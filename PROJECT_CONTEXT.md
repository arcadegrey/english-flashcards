# Project Context

## 项目用途

- 一个 Vite + React 英语学习应用，用于单词卡片学习、测验、填空、拼写、连线、阅读练习、错题复习、考试巩固和学习统计。
- 内置主词库来自 `public/data/vocabulary.json` 并在启动时异步加载；阅读材料来自 `src/data/readings.js`。用户自定义词和学习进度保存在本地 storage，并可同步到 Cloudflare Worker + D1。
- TOEFL 词库同时有按 Level/List 拆分的静态分片，位于 `public/data/vocabulary/toefl/`；`public/data/vocabulary/toefl/manifest.json` 记录每个 Level/List 的路径和数量。

## 启动命令

- 前端开发：`npm run dev`
- Worker 本地开发：`npm run worker:dev`
- 构建：`npm run build`
- 测试：`npm test`
- 预览构建产物：`npm run preview`
- 代码检查：`npm run lint`
- D1 迁移：`npm run d1:migrate`
- 导入全局词库：`npm run words:import`
- 刷新词库分片：`npm run words:split`
- 导入阅读材料：`npm run readings:import`
- 本地 Kokoro TTS：`npm run tts:kokoro`

## 主要页面

- `studyHub`：学习入口，展示词库、阅读、复习、错题、统计、考试练习和账号同步入口。
- `home`：单词分类选择页，支持全部、分类和托福词汇入口。
- `toeflLevels` / `toeflLists`：托福词汇按 Level / List 分层选择。
- `learn`：统一学习容器，由 `LearningView` 根据 mode 渲染学习卡片、测验、填空、拼写或连线。
- `readingList` / `readingSession`：阅读等级列表和文章阅读练习；文章页支持阅读题作答和反馈。
- `todayReview` / `wrongWords` / `learnedWords` / `masteredWords`：复习、错题、已学习、已掌握集合页。
- `statistics`：学习统计页。
- `examPractice`：考试练习模式选择页。

## 共享右上角菜单

- 共享菜单组件是 `src/components/QuickMenu.jsx`，菜单选项集中在 `src/components/quickMenuOptions.js`。
- 当前菜单统一包含：学习、测验、填空、拼写、连线、阅读、语音设置、慢速发音。
- 已接入页面：`HomeScreen`、`LearningView`、`WordCollectionView`、`ReadingListView`、`ReadingSessionView`、`ExamPracticeView`。
- 如果后续新增页面需要右上角快速菜单，优先复用 `QuickMenu`，不要再复制一份本地菜单状态和选项。
- `QuickMenu` 支持 `extraItems`，用于页面专属菜单项；目前 `WordCollectionView` 用它保留“显示/隐藏搜索栏”。

## TTS / 语音

- 语音工具在 `src/utils/speech.js`，支持 `browser` 和 `kokoro` 两个 provider；Kokoro 失败时会自动 fallback 到浏览器 TTS。
- 语音设置 UI 在 `src/components/VoiceSettings.jsx`，可选择浏览器 TTS 或 Kokoro TTS，并配置 Kokoro endpoint、voice、speed。
- 默认 Kokoro endpoint 是 `http://127.0.0.1:8880/v1/audio/speech`，`.env.example` 也已改成本地自部署默认值。
- 本地 Kokoro 服务脚本是 `scripts/kokoro_tts_server.py`，依赖写在 `requirements-kokoro.txt`，说明文档是 `docs/kokoro-tts.md`。
- 本地服务提供 `POST /v1/audio/speech` 和 `POST /tts`，兼容 OpenAI 风格 payload：`input`、`voice`、`speed`、`response_format`。
- 音频生成后会缓存到 `.cache/kokoro-tts/`，缓存目录和 `.venv-kokoro` 都被 `.gitignore` 排除。
- 当前机器已通过 Homebrew 安装 `python@3.11`、`espeak-ng`、`libsndfile`，并已创建项目虚拟环境 `.venv-kokoro`、安装 Python 依赖。
- 已实测 `curl http://127.0.0.1:8880/health` 返回 `{"status":"ok"}`，并成功生成 `/private/tmp/kokoro-test.wav`（WAV，mono 24000 Hz）。
- 批量静态单词音频脚本是 `scripts/generate_kokoro_word_audio.py`，启动命令是 `npm run tts:generate-words`。
- 已生成 3 套单词 MP3：`af_bella`、`am_michael`、`bf_emma`；路径为 `public/audio/words/{voice}/{id}.mp3`，共 10731 个 MP3，0 失败，MP3 24 kbps / 24 kHz / mono，内容字节约 46.27 MB，目录占用约 73 MB。
- 前端 `speakWord()` 在 Kokoro provider 下会优先播放静态单词音频；文件缺失或播放失败时 fallback 到实时 Kokoro / 浏览器 TTS。
- 静态单词音频默认 base URL 是 `/audio/words`，可通过 `VITE_WORD_AUDIO_BASE_URL` 改成 R2/CDN 地址，避免远端 App 本体必须携带全部音频。

## Cloudflare Worker / D1 同步逻辑

- 前端接口封装在 `src/utils/workerAuth.js`，默认 API 前缀为 `VITE_API_BASE` 或 `/api`。
- Worker 提供邮箱验证码登录：
  - `POST /api/auth/send-code` 发送注册或登录验证码。
  - `POST /api/auth/verify-code` 校验验证码，创建用户和会话。
  - `GET /api/auth/me` 通过 HttpOnly cookie 恢复登录。
  - `POST /api/auth/logout` 清理会话。
- Worker 依赖 D1 binding `DB`，以及 `SESSION_SECRET`、`RESEND_API_KEY`、`RESEND_FROM_EMAIL`。
- 会话存储在 D1 `sessions` 表中，浏览器侧使用 `ef_session` HttpOnly cookie。
- 学习进度接口：
  - `GET /api/progress` 读取 `user_progress`。
  - `PUT /api/progress` 写入进度。
- 同步数据包含 `learnedWords`、`masteredWords`、`customWords`、`wordProgress`、`wrongWords`、`studyHistory`。
- 前端启动时先加载本地数据，再尝试恢复云端会话；登录成功后会合并本地和云端进度。
- 前端自动同步有 800ms debounce；D1 写入使用 `baseUpdatedAt` 做版本判断。
- 如果 `baseUpdatedAt` 与云端当前版本不一致，Worker 会把现有云端进度和本次进度合并后写回，并返回 `conflictResolved`。

## CSV 导入逻辑

- CSV 解析在 `src/utils/csvImport.js`，支持引号、转义双引号、CRLF、BOM 清理。
- 单词 CSV 默认字段：`word, phonetic, pos, meaning, example, exampleCn, category, level, list`。
- 单词必填字段：`word`、`meaning`。
- 单词导入脚本是 `scripts/import-global-vocabulary.mjs`，当前读写目标是 `public/data/vocabulary.json`，不是旧版的 `src/data/vocabulary.js`。
- 常用导入命令：
  - 追加新词并跳过重复词：`npm run words:import -- /absolute/path/to/file.csv`
  - 合并已有词并追加新词：`npm run words:import -- /absolute/path/to/file.csv --upsert`
  - 预览导入结果：`npm run words:import -- /absolute/path/to/file.csv --dry-run`
- 单词导入会按小写 word 去重；新 id 从现有最大 id + 1 开始。
- 分类通过 `parseCategoryList` 解析，只保留有效分类；无有效分类时默认 `daily`。
- 仅当分类包含 `toefl` 时才写入规范化后的 `level` / `list` 数字标签。
- `--upsert` 行为边界：
  - 不会丢掉旧分类。重复词会通过 `mergeCategoryLists` 合并旧 `category/categories` 和 CSV 的 `category/categories`，例如原本 `daily`、CSV 为 `toefl`，结果包含 `["daily", "toefl"]`。
  - 会用 CSV 中的非空字段更新重复词的 `phonetic`、`pos`、`meaning`、`example`、`exampleCn`。
  - 如果合并后词条属于 TOEFL，会用 CSV 的 `level/list` 优先更新 TOEFL 位置；CSV 没有时保留旧的规范化 `level/list`。
  - 如果合并后词条不属于 TOEFL，会删除 `level/list`。
- 每次非 dry-run 的 `words:import` 成功后，都会自动调用 `splitVocabulary()` 刷新分片文件。
- 手动刷新分片可运行 `npm run words:split`。它会从 `public/data/vocabulary.json` 重新生成：
  - `public/data/vocabulary/core.json`：非 TOEFL 词。
  - `public/data/vocabulary/toefl/manifest.json`：TOEFL 分片目录。
  - `public/data/vocabulary/toefl/level-{n}/list-{m}.json`：具体 TOEFL Level/List 分片。
- 当前 TOEFL 导入进度：
  - Level 3：共 1010 词，List 1-10 分别为 98、100、98、99、100、100、100、99、99、117。
  - Level 4：共 1072 词，List 1-10 分别为 100、100、100、100、100、100、99、100、100、173。
  - Level 5：共 923 词，List 1-10 分别为 100、100、99、98、100、99、100、99、99、29。
  - Level 6：共 249 词，List 1-5 分别为 50、50、49、50、50。
  - 最近一次导入后总词库为 3577 个词，其中 TOEFL 词 3254 个。
- 阅读 CSV 默认字段：`title, level, category, content, translation, source, tags, examType, questions`。
- 阅读必填字段：`title`、`content`。
- 阅读导入按 `title + level` 去重；tags 支持 `|`、`,`、`;`、`，` 分隔。
- 阅读导入脚本是 `scripts/import-global-reading.mjs`，读写目标是 `src/data/readings.js`。
- 阅读导入支持：
  - 追加新文章并跳过重复：`npm run readings:import -- /absolute/path/to/file.csv`
  - 合并已有文章并追加新文章：`npm run readings:import -- /absolute/path/to/file.csv --upsert`
  - 预览导入结果：`npm run readings:import -- /absolute/path/to/file.csv --dry-run`
- `examType` 会保留为文章来源标签，例如 TOEFL / IELTS。
- `questions` 需要是 JSON 数组；每题支持 `id`、`prompt/question`、`options`、`answer/correctAnswer`、`explanation`。`options` 可为字符串数组，也可为 `{ id, label }` / `{ key, text }` 这类对象。
- `--upsert` 合并阅读文章时，CSV 的非空 `title`、`level`、`category`、`content`、`translation`、`source`、`examType` 会覆盖旧值；tags 会合并去重；CSV 有有效 questions 时会更新 questions，否则保留旧 questions。
- `tests/csv-import.test.mjs` 已覆盖阅读 CSV 导入 `examType` 和 JSON `questions`。

## 阅读功能状态

- 阅读列表现在先按 CEFR 等级分组展示，再进入对应文章列表；文章卡片保留考试来源、主题、题目数量、预计阅读时间和难词数量。
- 阅读正文会基于词库高亮未掌握词，点击可打开单词详情并标记学习/掌握。
- 阅读文章可包含 `questions`，`ReadingSessionView` 会渲染“阅读题”，选择选项后显示正确/错误和解析。
- 当前内置阅读文章数量为 12 篇。

## 词库加载与分片策略

- `src/data/vocabulary.js` 暴露：
  - `loadVocabulary()`：加载 `/data/vocabulary.json` 主词库。
  - `loadToeflManifest()`：加载 `/data/vocabulary/toefl/manifest.json`。
  - `loadToeflListVocabulary(manifest, levelKey, listKey)`：按 manifest 加载具体 TOEFL list 分片。
- `src/App.jsx` 启动时仍加载完整 `vocabulary.json`，以保持首页、阅读高亮、全部词库和旧逻辑兼容。
- TOEFL Level/List 页面优先使用 manifest 显示每个 Level/List 的数量，避免必须从内存扫描构造目录。
- 用户进入具体 TOEFL List 时，`ensureToeflListLoaded(level, list)` 会按需加载对应分片，并用 `mergeVocabularyList` 合并进内存。
- 用户选择“学习当前 Level 全部词汇”时，会触发 `ensureToeflLevelLoaded(level)` 预加载该 Level 下所有 List 分片。
- `vite.config.js` 的 PWA `globIgnores` 排除了 `**/data/vocabulary/**/*.json`，避免分片目录被 Workbox 全量预缓存；主 `public/data/vocabulary.json` 仍会按普通 json 静态资源参与构建缓存。

## 当前已知风险

- `resetProgress` 会调用 `storage.clearProgress()` 清除学习进度、错题、复习计划和统计历史，但会保留账号、主题、语音设置和自定义词。
- 进度合并以数组去重和对象浅合并为主，`wordProgress` 同一单词的冲突会以后写入对象覆盖。
- Worker 发送验证码依赖 Resend；本地或测试环境若缺少环境变量，登录链路会直接失败。
- CSV 解析器是自实现，不支持复杂 Excel 方言或分号分隔文件。
- 目前仍然启动时加载完整 `public/data/vocabulary.json`，TOEFL 分片主要用于目录和具体 List 的按需补强加载；若未来词库继续变大，可以进一步改成“启动只加载 core + manifest，选择分类/列表时再加载分片”。
- `--upsert` 会更新重复词的释义/例句等内容字段，若某些旧释义需要保留，导入前要先 dry-run 并人工检查重复词。
- `npm run worker:dev` 当前会因本地缺少 `wrangler` 而失败；需要先安装/恢复 Wrangler 依赖再跑 Worker 本地开发。
- 本地前端 `npm run dev` 可正常启动；如果 `5173` 被占用，Vite 会自动切到下一个端口，例如 `5174`。
- Codex 内置 Browser 连接本地页面时曾多次超时，但同一端口用 `curl -I` 返回 200；如果要做 UI 截图验证，可能需要先解决 Browser/reconnect 问题或改用其他验证方式。

## 下一步建议

- 若继续扩展到更多 TOEFL Level，考虑把启动加载从全量 `vocabulary.json` 改为 `core.json + manifest`，再为普通分类补分片。
- 阅读 CSV 导入已覆盖 `examType` / `questions`，后续可继续补重复、缺字段、tags 分隔和带引号换行内容的测试。
- 如需更强多端同步语义，为 `wordProgress` 增加单词级 `updatedAt`，再按单词更新时间解决冲突。
- 如果继续加入 TOEFL / IELTS 阅读文章和阅读题，建议先固定 CSV 的 `questions` JSON 模板，避免手填时字段名漂移。
