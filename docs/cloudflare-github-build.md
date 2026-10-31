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

`VITE_KOKORO_TTS_URL` 已不被前端消费，无需配置。当前工作流仍传入这一历史变量，但它不再启用在线 Kokoro／Railway 请求；本次仅更新说明，未修改工作流。

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

`public/audio-updates/**/*.mp3` 已加入Git忽略；整个 `audio-updates` 目录不进入 `dist` 和PWA预缓存。干净检出不需要MP3也能测试和构建。播放版本录音需要联网或已有浏览器缓存；不承诺首次离线可以播放全部R2录音。单词／例句优先播放已有静态录音，失败后直接回退浏览器语音；阅读句子使用浏览器语音。本地 Kokoro 仅用于维护时生成录音，运行时不再请求在线 Kokoro／Railway 服务。

新增「句子听写」按用户要求只播放已有例句录音，不执行上述浏览器语音回退。正式构建必须保留工作流中的例句及版本录音 R2 地址；失败时显示重试／换一句，不改写学习成绩或清除输入。正式配置的本地生产构建已验证真实公网 MP3 和强制失败分支，见[句子听写交接](sentence-dictation-2026-10-30.md)。

## 部署流程

- push 到 `main` 自动部署
- 或 Actions 页面手动触发 `Deploy To Cloudflare Worker`

工作流会自动：

1. 先通过复用的 `quality.yml` 完成 lint、全量 Node 测试、跨时区回归、前端构建和 Worker dry-run；失败则不进入部署。
2. 部署 job 验证必填 Secrets，再执行 `npm ci` 和 `npm run build`。
3. 向 `wrangler.toml` 注入部署变量。
4. 运行 `npm run d1:migrate`，执行现有幂等 schema／兼容迁移。
5. 运行 `npx --no-install wrangler deploy`，部署 Worker 与静态资源。

`prebuild` 会生成词库目录／详情／启动索引、提示批次、阅读 metadata／正文／词汇摘要、Worker 作业目录及图像交付文件，应随同一版本构建产物发布。质量门禁和构建成功不能代替真实生产账号与 PWA 更新验收。

## 说明

- 线上 API 默认同源：`/api`
- 不再依赖 CloudBase 配置
- 如需本地调试 API，建议用 `wrangler dev` 与 Vite 联调

## 已记录的发布状态

`5de1c1f` / Actions #150 包含 P2 和首批 50 单元扩充。后续阅读查词修复 `85fe4ef` 与句子听写已一起包含在 `b8075a7de41a179170151435588e51a9dfceb332` 中，远端 `main` 与 [Actions #152](https://github.com/arcadegrey/english-flashcards/actions/runs/41070849932) 已于 2026-10-31 实时核实；该流程在 2026-10-30 22:22:08（北京时间）成功完成质量检查、D1 幂等步骤及 Worker／静态资源部署。Cloudflare 版本为 `1a2cd898-aadc-4853-a1d6-53f91bfd8433`。本轮没有另行手动触发功能重部署或上传音频；交接提交仍沿用 `main` 的既有自动发布流程。

本地检查和部分生产只读检查已补做，完整生产 UI、真实账号、多设备、旧 PWA 更新和真机验收仍开放。见[发布核验](p1-release-verification-2026-10-31.md)与[发布状态](release-status.md)。
