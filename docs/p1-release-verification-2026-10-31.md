# P1 阅读查词与句子听写：发布核验（2026-10-31）

## 结论

两个功能已经一起发布，原交接中的“仅本地、未推送／部署”已过时。本次通过实时 GitHub API 发现并核实已有发布，不另行手动重发同一功能；交接提交仍沿用 `main` 的既有自动检查和发布流程。当前仍开放的是生产业务、完整资源交付与旧客户端更新验收。

- 远端仓库：`arcadegrey/english-flashcards`，核验时 `main` 为 `b8075a7de41a179170151435588e51a9dfceb332`，与本地 `HEAD`、`origin/main` 一致，工作树原本干净。
- 包含的功能提交：阅读查词独立补载 `85fe4ef1e959cf4583f038b60f39ed7319e820fd`，以及它的直接后继句子听写 `b8075a7de41a179170151435588e51a9dfceb332`。
- 发布：[Deploy To Cloudflare Worker #152](https://github.com/arcadegrey/english-flashcards/actions/runs/41070849932)，事件为 `push`，对应上述完整 SHA，`completed / success`。
- 工作流时间：北京时间 2026-10-30 22:19:23 创建，22:22:08 完成。
- `quality / verify`（job `124114222080`）：依赖安装、lint、全量测试、跨时区、构建和 Worker dry-run 全部成功。
- `deploy`（job `124114935998`）：Secrets 校验、依赖安装、构建、部署变量注入、D1 schema 与 Worker 部署全部成功。
- Cloudflare 部署日志记录版本 `1a2cd898-aadc-4853-a1d6-53f91bfd8433`，Worker gzip 上传量约 835.26 KiB。

## 交付完整性

现有工作流正常执行 `prebuild`，一起生成并交付阅读 metadata、公共词汇摘要、惰性代码，以及听写前端和 Worker 评分登记 `worker/data/dictation-examples.json`。评分登记保留旧句子版本，不进入前端启动下载。

两项功能无需新增 D1 schema 或个人学习数据迁移；已部署工作流中的既有幂等 D1 步骤正常完成。没有重建、重传音频，也没有改写线上账号、学习进度或作业数据。

本次生产配置构建沿用工作流中的三个现有 R2 地址和 `/api` 前缀；没有把 MP3 加回 `dist`，没有把 Worker 评分登记作为前端公共 JSON 发布。听写仍为 `recordingOnly`，不因保存的 browser 偏好或录音错误调用浏览器合成。

## 2026-10-31 重新执行的本地检查

| 检查 | 结果 |
| --- | --- |
| `npm test` | 404/404，无失败、跳过或待办。 |
| `npm run lint` | 通过。 |
| 与工作流一致的公开 R2 变量下 `npm run build` | 通过；PWA 104 项，2182.63 KiB 未压缩预缓存。仅有构建插件耗时提示。 |
| `TZ=America/Los_Angeles node --test tests/study-date.test.mjs tests/study-day-subscription.test.mjs tests/vocabulary-merge.test.mjs` | 6/6。 |
| `WRANGLER_SEND_METRICS=false npx --no-install wrangler deploy --dry-run` | 通过；没有执行真实部署。 |
| 阅读生产构建浏览器回归 | 15/15：26 篇目录、TOEFL 153／A1 45 分母、fruit 查词、题目／草稿、无全库扩展下载及真实 PWA 离线打开此前未读文章。 |
| 听写生产构建浏览器回归 | 23/23：原四模式和第五模式、共享 chrome、真实例句补载、整句评分、单词进度不变、390／1440px 浅深色、历史快照和真实 PWA 离线续写／保存。 |
| 正式音频配置浏览器回归 | 14/14：真实 R2 MP3 解码／播放结束、慢速／停止、强制中断 MP3 后仅报错、输入和答题数保留、不调用合成、换句与恢复播放。 |
| 生成文件与差异 | 构建后受版本管理的文件无变化；本次仅更新交接 Markdown。 |

共 52 项浏览器断言，无未捕获错误。脚本复用原交接检查，仅调整预览端口与输出位置；使用隔离浏览器上下文和 guest 本地记录，API 夹具不访问真实账号。本机预览来自本次完整生产构建，不等同于自定义域名上的完整 UI 验收。

本次真实音频抽样为 `https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio/examples/af_bella/5066.mp3`，未将 MP3 请求映射成本机文件。此结果证明配置与抽样可播放，不构成全量交付或人工发音认证。

命令日志：`output/release-2026-10-31/`；浏览器脚本、截图：`output/playwright/release-2026-10-31/`，均在忽略目录。

## 生产只读检查与边界

通过全新、未登录的隔离浏览器访问 `https://www.englishflashcards.cn/`：

- 取得首页 HTML，标题为“英语单词卡片 - English Flashcards”，入口脚本路径为 `/assets/index-pxESYLaP.js`。未以本机编译后的文件名推断线上版本；部署 SHA 以 GitHub 工作流证据为准。
- `/sw.js` 返回 `200 / text/javascript`，可读取预缓存清单并包含 `AssessmentSession` 资源。
- 未登录 GET `/api/exam-attempts` 返回 `401 / application/json`，符合鉴权边界；没有调用写接口或发送登录邮件。
- 本机 curl 对自定义域名发生 SSL 连接超时，对 Worker 公开域名发生连接超时；浏览器追加读取首页、阅读摘要和部分脚本也在 15 秒内超时，完整应用 UI 未成功验收。未据此认定生产站点故障，也未将初始 HTML 或 SW 的成功读取表述为全部资源交付成功。

## 仍待完成的 P1 验收

1. 在可稳定访问生产资源的网络下，完成阅读 153／45 分母、点词、听写五模式入口、真实评分／录音及完整 UI 检查。
2. 旧生产 PWA 升级，确认新代码、阅读摘要、评分目录、音频映射与历史一致；离线恢复后重新联网同步。本次新安装的本地 PWA 检查不能替代旧客户端升级。
3. 真实账号登录／退出与切换、双设备同步与冲突恢复、收藏／计划偏好／草稿／历史离线保存与恢复。
4. 教师发布词汇／阅读作业、学生续答／首次提交、教师查看成绩与权限隔离；听写历史的生产同步与教师读取。
5. iOS／Safari 真机播放、慢速、停止、换题及离页清理；teenage 四音色和高风险词独立实听仍按原内容质量队列跟踪。

后续工作从这些验收继续，不再将阅读修复或句子听写列为“未开发／等待首次发布”。

## 本轮交接文档同步状态

七份交接 Markdown 已保存到本地 Git 提交，业务代码未改变。推送 `origin main` 因终端缺少 GitHub HTTPS 凭据失败；已连接 GitHub 插件的 Git tree 写入接口也返回 `403 Resource not accessible by integration`。远端分支未被本次文档操作更新，未触发新的文档提交部署；这不影响已经核实成功的功能发布 Actions #152。

恢复本机 Git 凭据或连接的仓库写权限后，先核对远端变化，再正常推送本地交接提交，并检查现有自动工作流。当前不要声称这些文档已推送或新工作流已完成。
