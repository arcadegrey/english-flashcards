# 句子精听与听写（2026-10-30）

> 2026-10-31 发布核验补记：本功能已随 `b8075a7de41a179170151435588e51a9dfceb332` 推送并部署；[Actions #152](https://github.com/arcadegrey/english-flashcards/actions/runs/41070849932) 于 2026-10-30 22:22:08（北京时间）成功，质量、D1 幂等步骤和 Worker／静态资源部署均通过。下文原“未推送／部署”描述仅为实施当时状态。最新复核和生产验收边界见[发布核验](p1-release-verification-2026-10-31.md)。

## 入口与学习流程

训练中心「做测试」或共享导航「测试」进入原测试选择页，在原四种练习之后新增第五个真实 ModuleCard「句子听写」。共享模式菜单也能进入。沿用当前计划词库与「已学习／标记认识／随机」范围，不新增主导航、训练中心主模块或桌面 topbar 控件。

- 先隐藏英文原句，点击播放／慢速播放后输入整句；可查看与当前例句对应的中文提示。
- 「核对答案」后显示原句、译文与逐词对齐：正确、漏写、多写、需修改均有文字标识。支持继续精听、重练本句及下一句。
- 大小写、标点与空白不计错；弯直引号统一，词内撇号忽略，缩写与展开形式仍按不同词序处理。没有语义等价判分或语法改写判分。
- 「查看原文」可以跳过输入，但本次计为待巩固；中文提示的使用单独保存，允许使用提示后答对。
- 本句只有第一次提交计分；「再练这句」不追加答题或学习事件。双击提交不会顺带触发新出现的「下一句」。每组沿用最多 20 次答题，允许提前结束。

## 音频与数据交付

继续使用 `speakExample` 和已有词条 ID／文本校验的版本音频映射。按用户后续确认，听写以 `recordingOnly: true` **只播放已有静态例句 MP3**，即使保存的提供方为 browser 也不合成语音，不改写用户的提供方或音色。文件缺失、映射失败或网络错误仅显示录音错误，可重试或无计分地「换一句」；输入保留。自定义例句如果没有现有录音也遵循这一规则。不请求在线 Kokoro／Railway，不生成或上传新音频。其他学习模式原有的回退行为保持不变。

慢速按钮以 0.75 倍调用现有播放服务，仍叠加用户原有全局语速／录音语速偏好并受原服务边界约束；它不是对实际播放速度的固定承诺。播放器显示准备、播放、停止与错误，未启动的音频 15 秒后可重试；真实开始后不截断整句。离页、换题及账号组件卸载只取消本组件拥有的音频，不能取消其他页面之后启动的音频。

例句仍通过原 `useWordDetails` 按需补载，加载失败保留输入并提供重试。现有完整例句、词库、阅读、音频源文件均未修改。候选允许 2–60 个词且最长 1000 字符的原例句，当前活动词库全部 8749 条具备可用例句；不声明新增了独立内容审校。

## 记录、权限与兼容

- 沿用 `flashcards_exam_draft:<账号或guest>:dictation:<词库>:<范围>`，新增可选 `question` 字段保存当前词条 ID、未提交输入、提示及核对状态；刷新／离页返回可恢复。同一句重练期间仍保留原首次成绩。未提交内容仅在当前设备暂存，不云端同步。
- 完成后沿用现有账号隔离的测试历史、离线待同步队列、expected-user 校验、教师查看权限与首次保存不可改写规则。结果保存原句／译文、输入、提示和查看原文标记。仅答题事件进入既有每日测试计数；听音与本句重练不增加活动计数。
- 整句正误不调用单词「标记认识／不认识」接口，不改变单词复习安排或错词集合。教师周报仍统计已保存测试，但不会据整句错误推荐某个单词为薄弱词。
- Worker 使用共享规则重新计算成绩，不信任客户端正误／总分。新 `worker/data/dictation-examples.json` 是服务器评分登记，校验词条、实际原句和当前范围；自定义词必须已属于提交账号并已同步。
- `scripts/build-dictation-catalog.mjs` 已接入 `prebuild`。登记保留既有句子版本，使后续英文更新或退役不使已离线提交的登记原句失效；不要清空或重建为仅含当前版本的文件。原 `assignment-vocabulary.json` 不增加例句字段。新登记仅随 Worker 打包，不进入前端启动词库。
- 原四种测试的记录与评分结构不变，旧成绩保留。新模式只新增 JSON 字段与 mode 值，无 D1 schema、个人学习进度或旧记录迁移。旧前端不支持显示新模式，发布后仍需旧 PWA 更新验收。

## 验证状态

- 全量 Node 回归 **404/404**，包括新增 13 项听写测试及 3 项录音／语音回归；定向听写／语音 **33/33**。新增检查覆盖保存的 browser 偏好、录音失败、映射失败与缺失 ID 均不得触发合成，并保留其他模式原有回退。
- Lint、生产构建／PWA、Worker dry-run、额外跨时区 **6/6** 与 `git diff --check` 通过。当前 PWA 预缓存 104 项／约 2182 KiB，Worker dry-run gzip 约 835 KiB；评分登记没有进入前端启动下载。
- 已完成 **46 项**真实组件浏览器断言：原四模式入口与第五模式、隐藏原句、提示、提交／重复点击、原句重练、逐词反馈、历史、输入续存、账号切换隔离、加载失败重试、存储不足暂停与重试保留输入、20 题保存和新一组；320／390／768／1440px 浅／深色无横向溢出，结果操作可滚动到浮动导航上方。
- 已完成 **10 项**音频浏览器断言：使用原有不可变版本路径和同版本本机 MP3，经过原生音频实际解码、播放及 ended，覆盖 Bella／George；同时检查慢速、停止、离页清理、不产生答题事件及不改写语音提供方。此测试将音频请求映射到同版本本机文件，未重新验证公网 R2 交付，也不构成人工发音认证。
- **23 项**生产构建／真实 PWA 断言通过：原四模式与新入口、当前真实词库例句补载与整句评分、个人词汇状态不变、标准桌面 chrome 槽位、390／1440px 浅／深色样式、历史快照、PWA 离线刷新后续写以及离线保存第二组成绩。首次完全无缓存离线、未缓存例句和全部 R2 音频仍不保证可用。
- 后续 **14 项**正式音频配置浏览器断言通过：构建使用与部署工作流相同的三项 R2 地址，不映射 MP3 请求，实际播放公网基础例句录音（本次抽中 `audio/examples/af_bella/1124.mp3`）并触发原生 ended；慢速复用同一录音。故意中断所有 MP3 后只出现错误提示，浏览器合成调用始终为 0；输入与答题数不变，可换不同句子，并在恢复网络后继续播放真实 R2 MP3。基础录音 `3406.mp3` 与版本录音 teenage 的公网 HEAD 也均为 `200 / audio/mpeg`。这些是配置与抽样播放证据，不代表逐文件重新验证或人工发音认证。证据：`output/playwright/dictation/recording-only-production.log`。

浏览器使用隔离 localhost origin、内存账号／API 夹具，未访问生产账号、发邮件或写真实云端数据；API 测试使用内存 SQLite 师生数据。脚本、日志和截图在忽略目录 `output/playwright/dictation/`；不是真机 iOS／Safari 验收。

## 变更文件

- 入口：`src/components/ExamPracticeView.jsx`、`src/components/quickMenuOptions.js`、`src/components/QuickMenu.jsx`。
- 工作区：`src/components/SentenceDictation.jsx`、`src/components/assessment/DictationFeedback.jsx`、`src/styles/sentence-dictation.css`。
- 会话／历史：`src/components/assessment/AssessmentSession.jsx`、`src/components/assessment/ExamHistoryPanel.jsx`。
- 播放：`src/utils/examplePlayback.js`、`src/utils/speechEngine.js`。
- 共享评分／服务器：`shared/dictation.js`、`shared/examAttempts.js`、`shared/weeklyReport.js`、`worker/examAttempts.js`。
- 生成：`scripts/build-dictation-catalog.mjs`、`worker/data/dictation-examples.json`、`package.json`。
- 回归：`tests/dictation.test.mjs`、`tests/speech.test.mjs`。
- 文档：本文、`PROJECT_CONTEXT.md`、`docs/release-status.md`。工作区此前的发布文档整理改动保留。

## 发布

正常构建后同时发布前端与更新的 Worker／评分登记；原 CI 幂等 D1 步骤可照常执行，无新增迁移，无需重新生成／上传已有音频。实现保存为 `b8075a7`，后续已由 Actions #152 推送／部署；本功能与此前阅读查词修复一起发布，见[发布状态](release-status.md)。生产账号同步、教师查看、旧 PWA 更新和真机音频仍需发布后验收。

## 本地试听预览补记

直接对未配置音频地址的构建运行 `vite preview`，基础音频会请求同源 `/audio/examples/`，但 MP3 按项目规则不进入 `dist`，因而会触发浏览器语音回退。此前隔离音频验收映射了同版本本机 MP3，未覆盖这一普通预览配置；不能据此声称未配置的构建预览可以直接播放全部录音。

上述回退是最初预览的问题记录；后续 `recordingOnly` 修正后，缺少音频地址只会提示录音不可用，不再切换浏览器语音。正式工作流已配置 `VITE_EXAMPLE_AUDIO_BASE_URL` 与 `VITE_AUDIO_UPDATES_BASE_URL` 为现有 R2 地址，使用该配置的生产构建已完成上述 14 项验收，后续正式发布已由 Actions #152 完成。

使用已有本机录音试听时，应启动开发预览，并把三类录音地址明确设为同源：

```bash
VITE_WORD_AUDIO_BASE_URL=/audio/words \
VITE_EXAMPLE_AUDIO_BASE_URL=/audio/examples \
VITE_AUDIO_UPDATES_BASE_URL=/audio-updates \
npm run dev -- --host 127.0.0.1 --port 5201
```

这样由 Vite 直接提供现有 `public/audio/` 和 `public/audio-updates/` MP3；不改动录音、播放服务或生产 R2 配置。此次新预览已核对基础／版本例句返回 HTTP 200 与 `audio/mpeg`，页面试听经过准备、播放并正常结束。生产构建仍须沿用工作流已配置的 R2 地址；不要为修正本地预览把全部 MP3 加回生产构建。
