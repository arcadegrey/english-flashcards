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

公开构建变量：
- `VITE_WORD_AUDIO_BASE_URL=https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio/words`
- `VITE_EXAMPLE_AUDIO_BASE_URL=https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio/examples`
- `VITE_AUDIO_UPDATES_BASE_URL=https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio-updates`

## 音频先发布到R2

音频不存入D1。所有MP3保留本机生成副本并上传R2，Git只提交文本、清单、生成脚本及版本映射。

版本音频使用 `audio-updates/<批次>/<word或example>/<音色>/<ID>-<版本>.mp3`。变更文本生成新路径，不覆盖旧客户端/作业使用的对象。

更新词库或音频时，先生成并核验本机文件，再运行：

```bash
npx wrangler whoami
npm run audio:upload-updates-r2 -- --bucket english-flashcards-audio
npm run audio:verify-updates-r2
```

线上全部文件与清单哈希通过后再提交、推送代码。上传脚本支持分批重试及 `--start`/`--limit`；核验脚本对匹配当前清单的成功记录保存断点。首次/需要重新完整核验时先另存或移除忽略目录中的 `output/audio-updates-r2-verification.json`。

`public/audio-updates/**/*.mp3` 已加入Git忽略；整个 `audio-updates` 目录不进入 `dist` 和PWA预缓存。干净检出不需要MP3也能测试和构建。播放版本录音需要联网或已有浏览器缓存；不承诺首次离线可以播放全部R2录音。Kokoro/浏览器语音回退保持原有行为。

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
# 2026-10-25 发布前检查更新

部署工作流先复用 `.github/workflows/quality.yml`，完成测试、lint、跨时区回归、前端构建和 Worker dry-run；检查未通过时不进入迁移或部署。`npm run build` 的 prebuild 会生成服务端词库和提示 JSON 批次，必须一并发布。详见 `optimization-2026-10-25.md`。
