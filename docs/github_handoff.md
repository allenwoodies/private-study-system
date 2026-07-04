# GitHub 交接说明

## 当前状态

本地 Git 仓库已初始化，默认分支是 `main`。

已配置远程地址：

```bash
git@github.com:allenwoodies/private-study-system.git
```

本机 GitHub SSH 已认证到 `allenwoodies`，但 GitHub 不支持通过 SSH 自动创建仓库。需要先在 GitHub 网页创建空仓库。

## 创建 GitHub 仓库

在 GitHub 上创建一个私有仓库：

```text
owner: allenwoodies
repo: private-study-system
visibility: private
```

创建时不要勾选 README、.gitignore、license，因为本地仓库已经有这些文件。

创建完成后，在本机执行：

```bash
git push -u origin main
```

## 不会进入 GitHub 的内容

以下内容已被 `.gitignore` 排除：

```text
node_modules/
uploads/
private/
.env
.tmp/
.venv/
__pycache__/
*.pyc
*.log
```

这些目录里可能包含真实上传文件、AI 分析结果、老师专项完成记录、环境密钥或临时文件，不应提交。

服务器上的真实学习记录在：

```text
/home/lighthouse/study-learning-system/private/store/
```

其中包括：

```text
evaluations.json
teacher-progress.json
```

这些是运行数据，不属于代码仓库。换服务器或重装时，需要单独备份和恢复。

## 在另一台电脑修改

另一台电脑需要先配置 GitHub SSH key，然后执行：

```bash
git clone git@github.com:allenwoodies/private-study-system.git
cd private-study-system
npm install
copy .env.example .env
npm start
```

在 `.env` 里填入真实 DeepSeek Key：

```text
DEEPSEEK_API_KEY=你的真实 key
```

不要把 `.env` 提交到 GitHub。

## 修改后发布到 HERMES

修改并提交后：

```bash
git add .
git commit -m "Describe your change"
git push
```

部署到 HERMES 仍按现有脚本：

```bash
bash scripts/deploy-hermes.sh
```

部署脚本会排除 `private/` 和 `uploads/`，不会覆盖服务器上的真实学习数据。
