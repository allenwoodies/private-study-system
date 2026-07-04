# 部署到 HERMES / study.LP95.cn

## 当前实现

本系统已经支持后端 DeepSeek API：

- `GET /api/health`：查看服务和 AI Key 状态。
- `POST /api/evaluate`：作业/试卷文本化批改。
- `POST /api/weekly-review`：生成每周学习复盘。

DeepSeek API Key 不写在前端，只能放在服务器环境变量：

```bash
DEEPSEEK_API_KEY=你的key
DEEPSEEK_MODEL=deepseek-v4-flash
PORT=8610
```

## 重要限制

DeepSeek 当前接口在本系统里按文本模型使用，不直接接收图片。系统先做 OCR，再把文本交给 `deepseek-v4-flash` 做 JSON 批改：

- 图片优先使用 RapidOCR 识别，并自动尝试 0/90/180/270 度旋转。
- PDF 优先抽取文本；没有文本层时转图片再 OCR。
- 照片过远、反光、一次拍多页或手写过多时，AI 应降低置信度并要求家长复核。
- AI 批改结果持久化到应用目录下的 `private/store/evaluations.json`，该目录应随服务器备份保留，不参与普通静态文件发布。

## HERMES 目标目录

```bash
/home/lighthouse/study-learning-system
```

当前已部署到该目录。

## systemd

服务名：

```bash
study-learning.service
```

当前已创建并启动。

环境文件：

```bash
/etc/private-study-system/study-learning.env
```

当前环境文件已创建，但 `DEEPSEEK_API_KEY` 仍是占位值，需要替换为真实 Key。

## Nginx 建议配置

域名 `study.LP95.cn` 需要先解析到 HERMES 公网 IP。

```nginx
server {
    listen 80;
    server_name study.LP95.cn;

    client_max_body_size 30m;

    location / {
        proxy_pass http://127.0.0.1:8610;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

如果有证书，再加 HTTPS；没有证书时先用 HTTP 验证服务。

## 当前验证结果

服务器内部验证已通过：

```bash
curl http://127.0.0.1:8610/api/health
curl -H 'Host: study.lp95.cn' http://127.0.0.1/api/health
```

当前 `apiConfigured` 应为 `false`，直到写入真实 DeepSeek Key。

## 设置 DeepSeek Key

在 HERMES 上执行：

```bash
sudo nano /etc/private-study-system/study-learning.env
sudo systemctl restart study-learning.service
curl http://127.0.0.1:8610/api/health
```

确认 `DEEPSEEK_API_KEY` 已替换为真实 Key 后，`apiConfigured` 应变为 `true`。

不要把 API Key 写入 `index.html`、Git、Markdown 文档或前端代码。
