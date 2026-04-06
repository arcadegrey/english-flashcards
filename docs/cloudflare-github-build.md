# Cloudflare 静态站点改为 Git 驱动构建与部署

如果你在 Cloudflare 后台遇到“Static Assets 不走构建”的限制，可以改成 GitHub Actions 构建后再部署到 Pages。

## 已添加的仓库配置
- Workflow: `.github/workflows/deploy-cloudflare-pages.yml`
- Wrangler 配置: `wrangler.toml`

## 你需要在 GitHub 仓库 Secrets 里新增
进入：`GitHub Repo -> Settings -> Secrets and variables -> Actions -> New repository secret`

必填：
- `CF_API_TOKEN`：Cloudflare API Token（需包含 Pages 编辑权限）
- `CF_ACCOUNT_ID`：Cloudflare Account ID

构建用公开变量（Vite 会在打包时注入）：
- `VITE_CLOUDBASE_ENV_ID`
- `VITE_CLOUDBASE_REGION`
- `VITE_CLOUDBASE_PUBLISHABLE_KEY`
- `VITE_CLOUDBASE_PROGRESS_COLLECTION`
- `VITE_KOKORO_TTS_URL`（可选）

## 触发方式
- 推送到 `main` 自动触发部署
- 或手动触发：`Actions -> Deploy To Cloudflare Pages -> Run workflow`

## 说明
- 这套方式由 GitHub 完成 `npm ci && npm run build`，再把 `dist/` 上传到 Cloudflare Pages。
- 不依赖 Cloudflare 后台的构建开关。
