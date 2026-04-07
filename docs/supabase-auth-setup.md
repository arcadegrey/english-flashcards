# 账号注册登录与云同步（Cloudflare Worker + D1）

本项目已从 CloudBase 切换为 Cloudflare Worker 同源 API + D1。

## 1. 架构说明
- 前端调用同源接口：`/api/*`
- Worker 负责：邮箱验证码登录、会话管理、进度读写
- D1 保存：用户、验证码、会话、学习进度

## 2. 前端环境变量
`.env` 可选配置：

```bash
VITE_API_BASE=/api
VITE_KOKORO_TTS_URL=https://kokoro-api-production-9ea1.up.railway.app/v1/audio/speech
```

说明：
- 不配置 `VITE_API_BASE` 时默认也是 `/api`。
- 前端不再需要 `VITE_CLOUDBASE_*`。

## 3. D1 数据表
已提供建表脚本：`worker/schema.sql`

包含表：
- `users`
- `login_codes`
- `sessions`
- `user_progress`

可执行：

```bash
wrangler d1 execute <你的数据库名> --remote --file ./worker/schema.sql
```

## 4. 登录流程（邮箱验证码）
- 登录：输入邮箱 -> 发送登录验证码 -> 输入验证码完成登录
- 注册：输入邮箱 -> 发送注册验证码 -> 输入验证码完成注册并自动登录
- 会话通过 HttpOnly Cookie 保存，前端不再持有第三方 access token。

## 5. 同步流程
- 登录后自动拉取云端进度并与本地合并，再回写云端。
- 首页账号卡片可手动点击“立即同步”。
- 未登录时会提示先登录。

## 6. 生产必填密钥
请在 GitHub Actions Secrets 配置：
- `CF_API_TOKEN`
- `CF_ACCOUNT_ID`
- `D1_DATABASE_ID`
- `D1_DATABASE_NAME`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `SESSION_SECRET`
