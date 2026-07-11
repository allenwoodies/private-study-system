# 两个孩子的私人学习跟踪系统

这个目录是一个家庭内部使用的学习系统雏形，目标是在暑假两个月内同时管理：

- 成绩管理系统：考试、作业、测评、错因、知识点掌握度。
- 成长观察系统：兴趣、专注、情绪、主动性、表达、学习习惯。

核心方法是 PDCA：

1. PLAN：每周只确定 1-2 个重点。
2. DO：安排轻量任务，避免把暑假变成补课流水线。
3. CHECK：用小测、讲题、复述、迁移任务检查是否真的掌握。
4. ACTION：根据结果调整下周计划。

## 文件结构

```text
D:\孩子学习系统
  index.html                         手机优先本地看板，双击即可打开
  docs\system_design.md              系统设计与暑假执行方法
  data\knowledge_map_v1.json         二年级、六年级四科知识能力图谱第一版
  data\templates\children.csv        孩子档案模板
  data\templates\score_records.csv   成绩记录模板
  data\templates\objective_mastery.csv
  data\templates\growth_observations.csv
  data\templates\learning_tasks.csv
  data\templates\pdca_cycles.csv
  data\templates\ai_evaluations.csv
  prompts\weekly_review_prompt.md    每周给 AI 做复盘的提示词
```

## 使用顺序

1. 打开 `index.html`，手机上优先使用底部导航。
2. 首页看今日重点和优先关注，不需要先看复杂表格。
3. `AI批改` 里上传作业或试卷照片，生成给 AI 的批改请求。
4. 把 AI 的参考分、错因、知识点短板回写到系统。
5. 主观状态仍由家长人工打分，比如兴趣、专注、情绪、主动性。
6. 周末导出 JSON，复制到 AI 里，用 `prompts\weekly_review_prompt.md` 生成周报。
7. 下周只抓 1-2 个重点，不要同时补太多板块。

## 客观与主观的边界

客观层：知识点、能力点、试卷、任务结果、正确率、掌握等级。

主观层：兴趣、情绪、专注、主动性、表达、自信心。

AI 层：作业/试卷照片、AI参考分、错因归因、知识点短板、训练建议。AI 评价必须保留人工复核，不直接等同最终分。

系统的关键不是把孩子数据化，而是帮助家长减少误判：小学高分不代表底层能力已经稳定，低分也不一定是孩子不努力，可能是知识、能力、习惯或情绪中的某一类问题。

## DeepSeek 后端

本项目现在可以作为 Node 服务运行：

```bash
npm install
copy .env.example .env
npm start
```

DeepSeek Key 只允许放在后端环境变量：

```text
DEEPSEEK_API_KEY=...
```

不要写进 `index.html`。

当前 DeepSeek 接入是文本批改：系统会先对上传的图片/PDF做 OCR，再把“题目 / 孩子答案 / OCR文本”交给 DeepSeek 分析。服务器优先使用 RapidOCR，Tesseract 作为兜底。试卷照片过远、旋转、反光、一次拍多页时，评分置信度会下降，需要家长复核。

试卷照片支持多张，可分多次添加，适合正反面和附页。上传任务会先保存到服务器，再异步执行 OCR 和 AI 分析；页面会显示每页进度，历史记录可复看原附件、OCR状态和 AI 结论。当前默认最多 20 个文件。

AI 批改记录保存在服务器 `private/store/evaluations.json`，附件保存在 `uploads/`，浏览器只保留页面展示用的同步副本。`private/` 和 `uploads/` 不进入 Git，也不会被部署脚本覆盖。
