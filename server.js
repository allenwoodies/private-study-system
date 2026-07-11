import express from "express";
import multer from "multer";
import OpenAI from "openai";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execFileAsync = promisify(execFile);

const PORT = Number(process.env.PORT || 8610);
const UPLOAD_DIR = path.resolve(__dirname, process.env.UPLOAD_DIR || "uploads");
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";
const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB || 20);
const MAX_UPLOAD_FILES = Number(process.env.MAX_UPLOAD_FILES || 20);
const OCR_LANG = process.env.OCR_LANG || "chi_sim+eng";
const OCR_PSM = process.env.OCR_PSM || "6";
const OCR_TIMEOUT_MS = Number(process.env.OCR_TIMEOUT_MS || 120000);
const OCR_MAX_CHARS = Number(process.env.OCR_MAX_CHARS || 24000);
const OCR_MAX_PDF_PAGES = Number(process.env.OCR_MAX_PDF_PAGES || 8);
const DEFAULT_RAPID_OCR_PYTHON = process.platform === "win32"
  ? path.join(__dirname, ".venv", "Scripts", "python.exe")
  : path.join(__dirname, ".venv", "bin", "python");
const RAPID_OCR_PYTHON = process.env.RAPID_OCR_PYTHON || DEFAULT_RAPID_OCR_PYTHON;
const RAPID_OCR_SCRIPT = process.env.RAPID_OCR_SCRIPT || path.join(__dirname, "scripts", "rapid_ocr.py");
const PRIVATE_DIR = path.resolve(__dirname, process.env.PRIVATE_DIR || "private");
const STORE_DIR = path.resolve(PRIVATE_DIR, "store");
const EVALUATION_STORE_FILE = path.resolve(STORE_DIR, "evaluations.json");
const TEACHER_PROGRESS_STORE_FILE = path.resolve(STORE_DIR, "teacher-progress.json");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(STORE_DIR, { recursive: true });

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "4mb" }));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const safeName = file.originalname
      .normalize("NFKC")
      .replace(/[^\w.\-\u4e00-\u9fa5]+/g, "_")
      .slice(0, 120);
    cb(null, `${stamp}_${Math.random().toString(36).slice(2, 8)}_${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_UPLOAD_MB * 1024 * 1024,
    files: MAX_UPLOAD_FILES
  }
});

function getClient() {
  if (!hasDeepSeekKey()) {
    const error = new Error("DEEPSEEK_API_KEY is not configured on the server.");
    error.statusCode = 503;
    throw error;
  }

  return new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com"
  });
}

function hasDeepSeekKey() {
  const key = (process.env.DEEPSEEK_API_KEY || "").trim();
  return Boolean(key) && !/^PLEASE_SET_THIS_ON_SERVER$/i.test(key) && !/^replace_with_/i.test(key);
}

function parseJsonObject(text) {
  if (!text) throw new Error("Empty model response.");
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Model response is not JSON.");
    return JSON.parse(match[0]);
  }
}

function uploadedFileSummary(files = []) {
  return files.map((file, index) => ({
    originalName: file.originalname,
    storedName: file.filename,
    size: file.size,
    mimeType: file.mimetype,
    page: index + 1,
    side: index === 0 ? "front" : (index === 1 ? "back" : "appendix")
  }));
}

function createRecordId(prefix = "eval") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function readEvaluationStore() {
  try {
    const text = await fs.promises.readFile(EVALUATION_STORE_FILE, "utf8");
    const parsed = JSON.parse(text);
    return {
      version: parsed.version || 1,
      evaluations: Array.isArray(parsed.evaluations) ? parsed.evaluations : []
    };
  } catch (error) {
    if (error.code === "ENOENT") return { version: 1, evaluations: [] };
    throw error;
  }
}

async function writeEvaluationStore(store) {
  const tmpFile = `${EVALUATION_STORE_FILE}.${process.pid}.tmp`;
  await fs.promises.writeFile(tmpFile, JSON.stringify(store, null, 2), "utf8");
  await fs.promises.rename(tmpFile, EVALUATION_STORE_FILE);
}

let evaluationWriteQueue = Promise.resolve();

function saveEvaluationRecord(record) {
  evaluationWriteQueue = evaluationWriteQueue.catch(() => {}).then(async () => {
    const store = await readEvaluationStore();
    store.evaluations.push(record);
    await writeEvaluationStore(store);
    return record;
  });
  return evaluationWriteQueue;
}

function updateEvaluationRecord(id, patch = {}) {
  evaluationWriteQueue = evaluationWriteQueue.catch(() => {}).then(async () => {
    const store = await readEvaluationStore();
    const record = (store.evaluations || []).find((item) => item.id === id);
    if (!record) throw new Error("Evaluation not found.");
    Object.assign(record, patch, { updatedAt: new Date().toISOString() });
    await writeEvaluationStore(store);
    return record;
  });
  return evaluationWriteQueue;
}

async function findEvaluationRecord(id) {
  const store = await readEvaluationStore();
  return (store.evaluations || []).find((item) => item.id === id) || null;
}

function safeUploadPath(storedName) {
  const uploadRoot = path.resolve(UPLOAD_DIR);
  const filePath = path.resolve(uploadRoot, String(storedName || ""));
  if (!filePath.startsWith(`${uploadRoot}${path.sep}`)) {
    throw new Error("Invalid uploaded file path.");
  }
  return filePath;
}

function storedFilesToProcess(files = []) {
  return files.map((file) => ({
    originalname: file.originalName,
    filename: file.storedName,
    size: file.size,
    mimetype: file.mimeType,
    path: safeUploadPath(file.storedName)
  }));
}

function publicEvaluationRecord(record) {
  return {
    id: record.id,
    createdAt: record.createdAt,
    date: record.date,
    status: record.status,
    childId: record.childId,
    child: record.child,
    grade: record.grade,
    subject: record.subject,
    type: record.type,
    title: record.title,
    fullScore: record.fullScore,
    humanScore: record.humanScore,
    rubric: record.rubric,
    manualText: record.manualText || "",
    files: record.files || [],
    ocr: record.ocr || { text: "", details: [] },
    result: record.result || null,
    usage: record.usage || null,
    model: record.model || DEEPSEEK_MODEL,
    error: record.error || "",
    progress: record.progress || { phase: record.status || "unknown", completed: 0, total: (record.files || []).length, percent: 0 },
    completedAt: record.completedAt || "",
    updatedAt: record.updatedAt || record.createdAt || ""
  };
}

async function readTeacherProgressStore() {
  try {
    const text = await fs.promises.readFile(TEACHER_PROGRESS_STORE_FILE, "utf8");
    const parsed = JSON.parse(text);
    return {
      version: parsed.version || 1,
      progress: parsed.progress && typeof parsed.progress === "object" ? parsed.progress : {}
    };
  } catch (error) {
    if (error.code === "ENOENT") return { version: 1, progress: {} };
    throw error;
  }
}

async function writeTeacherProgressStore(store) {
  const tmpFile = `${TEACHER_PROGRESS_STORE_FILE}.${process.pid}.tmp`;
  await fs.promises.writeFile(tmpFile, JSON.stringify(store, null, 2), "utf8");
  await fs.promises.rename(tmpFile, TEACHER_PROGRESS_STORE_FILE);
}

let teacherProgressWriteQueue = Promise.resolve();

function teacherProgressKey(childId, projectId, taskId) {
  return `${childId}:${projectId}:${taskId}`;
}

function publicTeacherProgress(progress = {}, { childId = "", projectId = "" } = {}) {
  return Object.fromEntries(Object.entries(progress).filter(([_key, value]) => {
    if (childId && value.childId !== childId) return false;
    if (projectId && value.projectId !== projectId) return false;
    return true;
  }));
}

function commandExists(command) {
  const checkCommand = process.platform === "win32" ? "where" : "which";
  const result = spawnSync(checkCommand, [command], { stdio: "ignore" });
  return result.status === 0;
}

function executableAvailable(command) {
  if (!command) return false;
  if (path.isAbsolute(command) || command.includes("/") || command.includes("\\")) {
    return fs.existsSync(command);
  }
  return commandExists(command);
}

function getOcrStatus() {
  const rapidOcr = fs.existsSync(RAPID_OCR_SCRIPT) && executableAvailable(RAPID_OCR_PYTHON);
  const tesseract = commandExists("tesseract");
  const pdftotext = commandExists("pdftotext");
  const pdftoppm = commandExists("pdftoppm");
  return {
    available: rapidOcr || tesseract || pdftotext,
    engine: rapidOcr ? "rapidocr" : (tesseract ? "tesseract" : (pdftotext ? "pdf-text" : "none")),
    rapidOcr,
    tesseract,
    pdftotext,
    pdftoppm,
    language: OCR_LANG,
    maxFiles: MAX_UPLOAD_FILES,
    maxPdfPages: OCR_MAX_PDF_PAGES
  };
}

function isPdf(file) {
  return file.mimetype === "application/pdf" || /\.pdf$/i.test(file.originalname);
}

function isImage(file) {
  return /^image\//i.test(file.mimetype) || /\.(png|jpe?g|webp|bmp|tiff?)$/i.test(file.originalname);
}

function cleanExtractedText(text) {
  return String(text || "")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n")
    .trim();
}

function truncateText(text, maxChars = OCR_MAX_CHARS) {
  if (!text || text.length <= maxChars) return text || "";
  return `${text.slice(0, maxChars)}\n\n[OCR文本过长，已截断到 ${maxChars} 字符]`;
}

async function runTesseract(filePath) {
  const args = [filePath, "stdout", "-l", OCR_LANG, "--psm", OCR_PSM];
  const { stdout } = await execFileAsync("tesseract", args, {
    timeout: OCR_TIMEOUT_MS,
    maxBuffer: 12 * 1024 * 1024
  });
  return cleanExtractedText(stdout);
}

async function runRapidOcr(filePath) {
  const { stdout } = await execFileAsync(RAPID_OCR_PYTHON, [RAPID_OCR_SCRIPT, filePath, String(OCR_MAX_CHARS)], {
    timeout: OCR_TIMEOUT_MS,
    maxBuffer: 24 * 1024 * 1024
  });
  const parsed = JSON.parse(stdout);
  if (!parsed.ok) {
    throw new Error(parsed.error || "RapidOCR failed.");
  }
  return {
    text: cleanExtractedText(parsed.text),
    method: "rapidocr",
    meta: {
      rotation: parsed.rotation,
      characters: parsed.characters,
      lineCount: parsed.lineCount,
      avgScore: parsed.avgScore,
      truncated: parsed.truncated,
      alternatives: parsed.alternatives
    }
  };
}

async function runImageOcr(filePath, ocrStatus = getOcrStatus()) {
  let rapidOcrError = "";
  if (ocrStatus.rapidOcr) {
    try {
      const result = await runRapidOcr(filePath);
      if (result.text || !ocrStatus.tesseract) return result;
    } catch (error) {
      rapidOcrError = error.message;
    }
  }

  if (ocrStatus.tesseract) {
    return {
      text: await runTesseract(filePath),
      method: "tesseract",
      meta: rapidOcrError ? { rapidOcrError } : {}
    };
  }

  return {
    text: "",
    method: "none",
    meta: rapidOcrError ? { rapidOcrError } : {}
  };
}

async function extractPdfText(filePath) {
  let text = "";
  if (commandExists("pdftotext")) {
    try {
      const { stdout } = await execFileAsync("pdftotext", ["-layout", filePath, "-"], {
        timeout: OCR_TIMEOUT_MS,
        maxBuffer: 12 * 1024 * 1024
      });
      text = cleanExtractedText(stdout);
    } catch {
      text = "";
    }
  }

  const ocrStatus = getOcrStatus();
  if (text.length >= 20 || !commandExists("pdftoppm") || !(ocrStatus.rapidOcr || ocrStatus.tesseract)) {
    return text;
  }

  const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "study-ocr-"));
  try {
    const outputPrefix = path.join(tmpDir, "page");
    await execFileAsync("pdftoppm", ["-r", "180", "-png", "-f", "1", "-l", String(OCR_MAX_PDF_PAGES), filePath, outputPrefix], {
      timeout: OCR_TIMEOUT_MS,
      maxBuffer: 8 * 1024 * 1024
    });
    const pageFiles = (await fs.promises.readdir(tmpDir))
      .filter((name) => /\.png$/i.test(name))
      .sort();
    const pageTexts = [];
    for (const pageFile of pageFiles) {
      const pageOcr = await runImageOcr(path.join(tmpDir, pageFile));
      if (pageOcr.text) pageTexts.push(`【PDF ${pageFile} / ${pageOcr.method}】\n${pageOcr.text}`);
    }
    return cleanExtractedText(pageTexts.join("\n\n"));
  } finally {
    await fs.promises.rm(tmpDir, { recursive: true, force: true });
  }
}

async function extractTextFromFiles(files = [], onFileProgress = null) {
  const details = [];
  const chunks = [];
  const ocrStatus = getOcrStatus();

  for (const [index, file] of files.entries()) {
    const label = `附件${index + 1}: ${file.originalname}`;
    try {
      let text = "";
      let method = "none";
      let ocrMeta = null;
      if (isPdf(file)) {
        method = "pdf";
        text = await extractPdfText(file.path);
      } else if (isImage(file) && (ocrStatus.rapidOcr || ocrStatus.tesseract)) {
        const imageOcr = await runImageOcr(file.path, ocrStatus);
        method = imageOcr.method;
        text = imageOcr.text;
        ocrMeta = imageOcr.meta;
      } else {
        const detail = {
          file: file.originalname,
          status: "skipped",
          reason: "unsupported_file_or_ocr_missing",
          method
        };
        details.push(detail);
        if (onFileProgress) await onFileProgress({ index, total: files.length, detail, details: details.slice() });
        continue;
      }

      const cleaned = cleanExtractedText(text);
      const detail = {
        file: file.originalname,
        status: cleaned ? "ok" : "empty",
        method,
        characters: cleaned.length,
        ...(ocrMeta || {})
      };
      details.push(detail);
      if (cleaned) {
        chunks.push(`【${label}】\n${cleaned}`);
      }
      if (onFileProgress) await onFileProgress({ index, total: files.length, detail, details: details.slice() });
    } catch (error) {
      const detail = {
        file: file.originalname,
        status: "error",
        error: error.message
      };
      details.push(detail);
      if (onFileProgress) await onFileProgress({ index, total: files.length, detail, details: details.slice() });
    }
  }

  return {
    text: truncateText(cleanExtractedText(chunks.join("\n\n"))),
    details
  };
}

function buildEvaluationPrompt({ child, grade, subject, type, title, fullScore, humanScore, rubric, workText, files, ocrDetails }) {
  return `你是两个孩子私人学习系统里的学习诊断助手。请根据家长提供的文本化作业/试卷内容做参考评分和短板分析。

重要限制：
- DeepSeek 当前 API 请求收到的是文本。系统会尽量先对上传图片/PDF做OCR，再把OCR文本发给你。
- 如果OCR文本不完整、乱码或题目信息不足，请给低置信度，并明确列出需要家长复核/补充的地方；不要假装看清了图片。
- 如果无法准确给分，也要基于可识别的题号、勾叉痕迹、题干关键词和学科主题，输出“可复核的疑似短板”；把不确定性写进 confidence 和 parent_review_needed，不要只拒绝分析。
- 你的输出是参考评价，不能替代老师或家长复核。
- 不要制造焦虑。每次只给 1-2 个下周重点。

孩子：${child || "未填写"}
阶段：${grade || "未填写"}
学科：${subject || "未填写"}
类型：${type || "未填写"}
名称：${title || "未填写"}
满分：${fullScore || "未填写"}
家长初评分：${humanScore || "未填写"}
评分重点：${rubric || "按题目、答案、过程、表达、书写规范综合判断。"}
上传文件：${files.length ? files.map((file) => `${file.originalName} (${file.mimeType}, ${Math.round(file.size / 1024)}KB)`).join("；") : "无"}
OCR状态：${ocrDetails?.length ? JSON.stringify(ocrDetails, null, 2) : "无附件OCR"}

作业/试卷/OCR/转写文本：
${workText || "未提供文本。"}

请只输出 JSON，不要输出 Markdown。JSON 结构：
{
  "reference_score": number|null,
  "full_score": number|null,
  "confidence": "高"|"中"|"低",
  "summary": "一句话总评",
  "deductions": [
    {"item": "题号或问题点", "lost_points": number|null, "reason": "扣分依据"}
  ],
  "knowledge_weaknesses": ["知识点短板"],
  "ability_weaknesses": ["能力短板"],
  "error_types": ["知识不会|概念混淆|审题问题|计算错误|表达不规范|粗心|时间管理|证据不足"],
  "recommended_actions": ["下周训练建议，最多3条"],
  "parent_review_needed": ["需要家长或老师复核的地方"]
}`;
}

function buildWeeklyPrompt(payload) {
  return `你是一个家庭学习教练。请基于这个私人学习系统数据，为孩子生成一份周报。

要求：
1. 明确区分事实、判断、假设、建议。
2. 不要制造焦虑，不要只看分数。
3. 下周最多给 1-2 个重点。
4. 同时分析客观学习数据、AI批改记录和主观成长观察。
5. 判断问题属于知识短板、能力短板、习惯短板还是情绪状态。
6. 输出适合孩子年龄的快乐学习方式。

只输出 JSON：
{
  "facts": [],
  "objective_analysis": [],
  "growth_observation": [],
  "ai_vs_parent": [],
  "judgements": [],
  "hypotheses": [],
  "next_pdca": {
    "plan": [],
    "do": [],
    "check": [],
    "action": []
  },
  "parent_guidance": [],
  "not_recommended": []
}

系统数据：
${JSON.stringify(payload, null, 2)}`;
}

async function callDeepSeekJson(prompt, { maxTokens = 2200 } = {}) {
  const client = getClient();
  const completion = await client.chat.completions.create({
    model: DEEPSEEK_MODEL,
    messages: [
      {
        role: "system",
        content: "你是严谨、温和、面向家庭教育场景的学习诊断助手。必须输出合法 JSON。"
      },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
    max_tokens: maxTokens,
    stream: false,
    thinking: { type: "disabled" }
  });

  const content = completion.choices?.[0]?.message?.content || "";
  return {
    parsed: parseJsonObject(content),
    raw: content,
    usage: completion.usage || null,
    model: completion.model || DEEPSEEK_MODEL
  };
}

const evaluationJobs = new Map();

function jobProgress(phase, completed, total, percent, message) {
  return { phase, completed, total, percent, message };
}

async function processEvaluationJob(recordId) {
  const record = await findEvaluationRecord(recordId);
  if (!record) return;

  let files = [];
  let total = 0;
  let currentProgress = jobProgress("queued", 0, 0, 0, "任务已保存，等待处理");
  try {
    files = storedFilesToProcess(record.files || []);
    total = files.length;
    currentProgress = jobProgress("ocr", 0, total, total ? 5 : 45, total ? "正在准备 OCR" : "正在准备 AI 分析");
    await updateEvaluationRecord(recordId, {
      status: "processing",
      error: "",
      progress: currentProgress
    });

    const ocr = await extractTextFromFiles(files, async ({ index, details }) => {
      const completed = index + 1;
      currentProgress = jobProgress(
        "ocr",
        completed,
        total,
        total ? 10 + Math.round((completed / total) * 55) : 45,
        `OCR 已完成 ${completed}/${total} 页`
      );
      await updateEvaluationRecord(recordId, {
        status: "processing",
        ocr: { text: "", details },
        progress: currentProgress
      });
    });

    const combinedWorkText = cleanExtractedText([
      record.manualText,
      ocr.text ? `【系统OCR识别文本】\n${ocr.text}` : ""
    ].filter(Boolean).join("\n\n"));

    currentProgress = jobProgress("ai", total, total, 78, "OCR 完成，正在请求 DeepSeek");
    await updateEvaluationRecord(recordId, {
      status: "analyzing",
      ocr,
      progress: currentProgress
    });

    const payload = {
      childId: record.childId,
      child: record.child,
      grade: record.grade,
      subject: record.subject,
      type: record.type,
      title: record.title,
      fullScore: record.fullScore,
      humanScore: record.humanScore,
      rubric: record.rubric,
      workText: combinedWorkText,
      files: record.files || [],
      ocrDetails: ocr.details
    };
    const prompt = buildEvaluationPrompt(payload);
    const result = await callDeepSeekJson(prompt);
    const completedAt = new Date().toISOString();

    await updateEvaluationRecord(recordId, {
      status: "completed",
      ocr,
      result: result.parsed,
      raw: result.raw,
      usage: result.usage,
      model: result.model,
      error: "",
      completedAt,
      progress: jobProgress("completed", total, total, 100, "AI 分析完成")
    });
  } catch (error) {
    console.error(`Evaluation job ${recordId} failed`, error);
    await updateEvaluationRecord(recordId, {
      status: "failed",
      error: error.message,
      progress: { ...currentProgress, phase: "failed", message: error.message }
    }).catch((storeError) => console.error(storeError));
  }
}

function startEvaluationJob(recordId) {
  if (evaluationJobs.has(recordId)) return;
  const job = processEvaluationJob(recordId)
    .catch((error) => console.error(`Evaluation job ${recordId} crashed`, error))
    .finally(() => evaluationJobs.delete(recordId));
  evaluationJobs.set(recordId, job);
}

async function resumePendingEvaluationJobs() {
  const store = await readEvaluationStore();
  (store.evaluations || [])
    .filter((record) => ["queued", "processing", "analyzing"].includes(record.status))
    .forEach((record) => startEvaluationJob(record.id));
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "private-study-system",
    aiConfigured: hasDeepSeekKey(),
    model: DEEPSEEK_MODEL,
    deepseekBaseUrl: "https://api.deepseek.com",
    visionInput: false,
    ocr: getOcrStatus()
  });
});

app.get("/api/evaluations", async (req, res, next) => {
  try {
    const store = await readEvaluationStore();
    const childId = String(req.query.childId || "").trim();
    const child = String(req.query.child || "").trim();
    const limit = Math.min(Number(req.query.limit || 100), 300);
    let rows = store.evaluations || [];
    if (childId) rows = rows.filter((record) => record.childId === childId);
    if (child) rows = rows.filter((record) => record.child === child);
    rows = rows
      .slice()
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
      .slice(0, limit)
      .map(publicEvaluationRecord);
    res.json({ ok: true, evaluations: rows });
  } catch (error) {
    next(error);
  }
});

app.get("/api/evaluations/:id", async (req, res, next) => {
  try {
    const store = await readEvaluationStore();
    const record = (store.evaluations || []).find((item) => item.id === req.params.id);
    if (!record) {
      res.status(404).json({ ok: false, error: "Evaluation not found." });
      return;
    }
    res.json({ ok: true, evaluation: publicEvaluationRecord(record) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/evaluations/:id/files/:index", async (req, res, next) => {
  try {
    const record = await findEvaluationRecord(req.params.id);
    const index = Number(req.params.index);
    const file = Number.isInteger(index) && index >= 0 ? record?.files?.[index] : null;
    if (!record || !file) {
      res.status(404).json({ ok: false, error: "Uploaded file not found." });
      return;
    }
    const filePath = safeUploadPath(file.storedName);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ ok: false, error: "Uploaded file is no longer available." });
      return;
    }
    res.setHeader("Content-Disposition", `inline; filename*=UTF-8''${encodeURIComponent(file.originalName || "attachment")}`);
    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
});

app.post("/api/evaluations/:id/retry", async (req, res, next) => {
  try {
    const record = await findEvaluationRecord(req.params.id);
    if (!record) {
      res.status(404).json({ ok: false, error: "Evaluation not found." });
      return;
    }
    if (evaluationJobs.has(record.id)) {
      res.status(409).json({ ok: false, error: "Evaluation is already processing." });
      return;
    }
    const files = storedFilesToProcess(record.files || []);
    const missingFile = files.find((file) => !fs.existsSync(file.path));
    if (missingFile) {
      res.status(409).json({ ok: false, error: `附件不存在：${missingFile.originalname}` });
      return;
    }
    const updated = await updateEvaluationRecord(record.id, {
      status: "queued",
      error: "",
      result: null,
      raw: "",
      usage: null,
      completedAt: "",
      ocr: { text: "", details: [] },
      progress: jobProgress("queued", 0, files.length, 0, "重新排队中")
    });
    startEvaluationJob(updated.id);
    res.status(202).json({ ok: true, record: publicEvaluationRecord(updated) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/teacher-progress", async (req, res, next) => {
  try {
    const childId = String(req.query.childId || "").trim();
    const projectId = String(req.query.projectId || "").trim();
    const store = await readTeacherProgressStore();
    res.json({
      ok: true,
      progress: publicTeacherProgress(store.progress, { childId, projectId })
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/teacher-progress", async (req, res, next) => {
  try {
    const childId = String(req.body.childId || "").trim();
    const projectId = String(req.body.projectId || "").trim();
    const taskId = String(req.body.taskId || "").trim();
    const check = String(req.body.check || "").trim();
    const done = Boolean(req.body.done);
    const allowedChecks = new Set(["recite", "dictation", "review"]);

    if (!childId || !projectId || !taskId || !allowedChecks.has(check)) {
      res.status(400).json({ ok: false, error: "Invalid teacher progress payload." });
      return;
    }

    const updatedAt = new Date().toISOString();
    const today = updatedAt.slice(0, 10);
    const key = teacherProgressKey(childId, projectId, taskId);
    teacherProgressWriteQueue = teacherProgressWriteQueue.catch(() => {}).then(async () => {
      const store = await readTeacherProgressStore();
      const progress = {
        childId,
        projectId,
        taskId,
        ...(store.progress[key] || {})
      };
      progress[check] = done;
      progress[`${check}Date`] = done ? today : "";
      progress.updatedAt = updatedAt;
      store.progress[key] = progress;
      await writeTeacherProgressStore(store);
      return progress;
    });

    const progress = await teacherProgressWriteQueue;
    res.json({ ok: true, key, progress });
  } catch (error) {
    next(error);
  }
});

const evaluateUpload = (req, res, next) => {
  upload.array("files", MAX_UPLOAD_FILES)(req, res, async (error) => {
    if (!error) {
      next();
      return;
    }
    await Promise.all((req.files || []).map((file) => fs.promises.rm(file.path, { force: true }).catch(() => {})));
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    const message = error.code === "LIMIT_FILE_SIZE"
      ? `单个文件不能超过 ${MAX_UPLOAD_MB}MB。`
      : (error.code === "LIMIT_FILE_COUNT" ? `最多上传 ${MAX_UPLOAD_FILES} 个文件。` : error.message);
    res.status(status).json({ ok: false, error: message });
  });
};

app.post("/api/evaluate", evaluateUpload, async (req, res, next) => {
  try {
    const uploadedFiles = req.files || [];
    const files = uploadedFileSummary(uploadedFiles);
    const createdAt = new Date().toISOString();
    const savedRecord = await saveEvaluationRecord({
      id: createRecordId("eval"),
      createdAt,
      updatedAt: createdAt,
      date: createdAt.slice(0, 10),
      status: "queued",
      childId: req.body.childId || "",
      child: req.body.child || "",
      grade: req.body.grade || "",
      subject: req.body.subject || "",
      type: req.body.type || "",
      title: req.body.title || "",
      fullScore: req.body.fullScore || "",
      humanScore: req.body.humanScore || "",
      rubric: req.body.rubric || "",
      manualText: req.body.workText || "",
      files,
      ocr: { text: "", details: [] },
      result: null,
      raw: "",
      usage: null,
      model: DEEPSEEK_MODEL,
      error: "",
      progress: jobProgress("queued", 0, files.length, 0, "任务已保存，等待处理")
    });

    startEvaluationJob(savedRecord.id);
    res.status(202).json({
      ok: true,
      mode: "queued_ocr_then_deepseek_text",
      note: "上传任务已先保存到服务器，OCR 和 DeepSeek 分析将在后台继续执行。",
      files,
      record: publicEvaluationRecord(savedRecord)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/weekly-review", async (req, res, next) => {
  try {
    const prompt = buildWeeklyPrompt(req.body);
    const result = await callDeepSeekJson(prompt, { maxTokens: 2600 });
    res.json({
      ok: true,
      result: result.parsed,
      raw: result.raw,
      usage: result.usage,
      model: result.model
    });
  } catch (error) {
    next(error);
  }
});

function sendIndex(res) {
  res.setHeader("Cache-Control", "no-store");
  res.sendFile(path.join(__dirname, "index.html"));
}

app.get(["/", "/index.html"], (_req, res) => {
  sendIndex(res);
});

app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    res.status(404).json({ ok: false, error: "API route not found." });
    return;
  }
  res.status(404).type("text/plain").send("Not found.");
});

app.use((error, _req, res, _next) => {
  const status = error.statusCode || error.status || 500;
  const message = status === 500 ? "Server error." : error.message;
  console.error(error);
  res.status(status).json({
    ok: false,
    error: message
  });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Private study system listening on http://127.0.0.1:${PORT}`);
  resumePendingEvaluationJobs().catch((error) => console.error("Failed to resume evaluation jobs", error));
});
