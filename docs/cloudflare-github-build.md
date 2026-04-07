# Cloudflare Worker（Static Assets + API）GitHub Actions 部署

本项目使用 `wrangler deploy` 同时部署：
- 前端静态资源（`dist/`）
- Worker API（`/api/*`）

## 已配置文件
- Workflow: `.github/workflows/deploy-cloudflare-pages.yml`
- Worker 配置: `wrangler.toml`
- D1 建表脚本: `worker/schema.sql`

## 需要在 GitHub Secrets 配置
进入：`Repo -> Settings -> Secrets and variables -> Actions -> New repository secret`

必填：
- `CF_API_TOKEN`
- `CF_ACCOUNT_ID`
- `D1_DATABASE_ID`
- `D1_DATABASE_NAME`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `SESSION_SECRET`

可选：
- `VITE_KOKORO_TTS_URL`

## 部署流程
- push 到 `main` 自动部署
- 或 Actions 页面手动触发 `Deploy To Cloudflare Worker`

工作流会自动：
1. `npm ci`
2. `npm run build`
3. 注入 wrangler 部署变量
4. `wrangler d1 execute ... --file ./worker/schema.sql`
5. `wrangler deploy`

## 说明
- 线上 API 默认同源：`/api`
- 不再依赖 CloudBase 配置
- 如需本地调试 API，建议用 `wrangler dev` 与 Vite 联调
