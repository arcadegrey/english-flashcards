# Project Context

## 项目用途

- 一个 Vite + React 英语学习应用，用于单词卡片学习、测验、填空、拼写、连线、阅读练习、错题复习、考试巩固和学习统计。
- 完整主词库仍保存在 `public/data/vocabulary.json`，用于导入/分片/音频生成；前端启动时加载轻量的 `public/data/vocabulary/core.json`，再按需加载考试词库分片。阅读材料来自 `src/data/readings.js`。用户自定义词和学习进度保存在本地 storage，并可同步到 Cloudflare Worker + D1。
- TOEFL 词库按 Level/List 拆分，位于 `public/data/vocabulary/toefl/`；`public/data/vocabulary/toefl/manifest.json` 记录每个 Level/List 的路径和数量。
- IELTS 词库按“主题/List”拆分，位于 `public/data/vocabulary/ielts/`；`public/data/vocabulary/ielts/manifest.json` 记录主题、List、路径和数量。

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
- 从 IELTS PDF 提取纯单词表：`npm run ielts:extract-pdf`
- 导入阅读材料：`npm run readings:import`
- 本地 Kokoro TTS：`npm run tts:kokoro`
- 生成例句静态音频：`npm run tts:generate-examples`
- 上传单词静态音频到 R2：`npm run audio:upload-r2`

## 主要页面

- `studyHub`：学习入口，展示词库、阅读、复习、错题、统计、考试练习和账号同步入口。
- `home`：单词分类选择页，支持全部、分类、托福词汇和雅思词汇入口。
- `toeflLevels` / `toeflLists`：托福词汇按 Level / List 分层选择。
- `ieltsTopics` / `ieltsLists`：雅思词汇按主题 / List 分层选择；当前已导入 List 1-27，按自然地理、植物研究、动物保护、太空探索、学校教育、科技发明、文化历史、语言演化、娱乐运动、物品材料分主题。
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
- 语音设置里的 Kokoro 说明蓝色提示块已移除；“试听 Kokoro”现在直接播放静态 Kokoro 单词 MP3（当前用 `{ id: 1, word: "abandon" }`），不会再因实时接口失败而 fallback 成浏览器 TTS。
- 默认 Kokoro endpoint 是 `http://127.0.0.1:8880/v1/audio/speech`，`.env.example` 也已改成本地自部署默认值。
- 本地 Kokoro 服务脚本是 `scripts/kokoro_tts_server.py`，依赖写在 `requirements-kokoro.txt`，说明文档是 `docs/kokoro-tts.md`。
- 本地服务提供 `POST /v1/audio/speech` 和 `POST /tts`，兼容 OpenAI 风格 payload：`input`、`voice`、`speed`、`response_format`。
- 音频生成后会缓存到 `.cache/kokoro-tts/`，缓存目录和 `.venv-kokoro` 都被 `.gitignore` 排除。
- 当前机器已通过 Homebrew 安装 `python@3.11`、`espeak-ng`、`libsndfile`，并已创建项目虚拟环境 `.venv-kokoro`、安装 Python 依赖。
- `.venv-kokoro` 当前位于项目目录内，体积约 936 MB，其中 PyTorch 相关依赖是主要占用；暂时先保留不迁移。如果后续要瘦项目目录，建议在项目外重建到例如 `/Users/arcade/.venvs/english-flashcards-kokoro`，再把 `package.json` 的 Kokoro 命令改为外部 venv 路径或 `KOKORO_PYTHON` 环境变量。
- 已实测 `curl http://127.0.0.1:8880/health` 返回 `{"status":"ok"}`，并成功生成 `/private/tmp/kokoro-test.wav`（WAV，mono 24000 Hz）。
- 批量静态单词音频脚本是 `scripts/generate_kokoro_word_audio.py`，启动命令是 `npm run tts:generate-words`。
- 批量静态例句音频脚本是 `scripts/generate_kokoro_example_audio.py`，启动命令是 `npm run tts:generate-examples`；默认只生成 `af_bella`，输出到 `public/audio/examples/{voice}/{id}.mp3`，适合先把例句从 Railway 实时 TTS 迁到 R2 静态音频。若要补男声，可运行 `npm run tts:generate-examples -- --voices am_michael`。
- R2 同步脚本是 `scripts/upload-word-audio-r2.mjs`，启动命令是 `npm run audio:upload-r2`；默认把 `public/audio/words` 上传到 bucket 的 `audio/words/` 前缀，bucket 可通过 `R2_AUDIO_BUCKET` 或 `--bucket` 指定。脚本默认使用 Wrangler `r2 bulk put` 小批量上传 MP3：`--batch-size 100 --concurrency 3 --retries 3 --batch-delay-ms 1500`，这是已验证过比逐文件上传更快、比 500 一批更稳的策略；也会单独上传 `manifest.json`。
- 已生成 3 套单词 MP3：`af_bella`、`am_michael`、`bf_emma`；路径为 `public/audio/words/{voice}/{id}.mp3`，共 10731 个 MP3，0 失败，MP3 24 kbps / 24 kHz / mono，内容字节约 46.27 MB，目录占用约 73 MB。
- 已生成例句 MP3：本地 `public/audio/examples/af_bella` 和 `public/audio/examples/am_michael` 各 3577 个 MP3。已确认 `af_bella` 女声例句全量上传到 R2：`audio/examples/af_bella/{id}.mp3`，抽查 `1.mp3` 和 `3577.mp3` 的公开 URL 返回 `200 OK`。已确认 `am_michael` 男声例句全量上传到 R2：`audio/examples/am_michael/{id}.mp3`，上传 3577/3577 个文件；抽查 `1.mp3`、`480.mp3`、`2406.mp3` 和 `3577.mp3` 的公开 URL 返回 `206 audio/mpeg`。
- 前端 `speakWord()` 在 Kokoro provider 下会优先播放静态单词音频；文件缺失或播放失败时 fallback 到实时 Kokoro / 浏览器 TTS。
- 静态单词音频默认 base URL 是 `/audio/words`；线上构建已在 GitHub Actions 设置 `VITE_WORD_AUDIO_BASE_URL=https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio/words`，让远端 App 从 R2 读取音频，避免 App 本体携带全部 MP3。
- 前端例句播放目前仍走 `speak(word.example)`，即 Kokoro provider 下会尝试实时 Kokoro 接口，失败再 fallback 浏览器 TTS；尚未接入 `audio/examples/{voice}/{id}.mp3` 静态例句优先播放。下一步如果要启用静态例句，需要在 `src/utils/speech.js` 增加 example audio base URL 和 `speakExample` 之类的入口，并在 `Card.jsx` / `FillBlank.jsx` / 阅读相关例句按钮改调用。
- 当前 R2 bucket 是 `english-flashcards-audio`，公开 r2.dev URL 是 `https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev`，CORS 配置文件是 `config/r2-word-audio-cors.json`。

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
- 当前词库分类已收敛为：`daily` 日常常用、`cet4` 四级核心、`cet6` 六级核心、`toefl` 托福词汇、`ielts` 雅思词汇；`all` 仅作为“全部单词”入口，不是实际词条分类。旧的 `academic/business/travel/food/emotion/technology/medical` 已合并到 `daily`。
- 当分类包含 `toefl` 时写入规范化后的 `level` / `list` 数字标签。
- 当分类包含 `ielts` 时写入规范化后的 `ieltsList` 数字标签和 `ieltsLists` 数组，不复用 TOEFL 的 `list` 字段，避免同一个重复词同时属于 TOEFL / IELTS 时位置互相覆盖。
- `--upsert` 行为边界：
  - 不会丢掉旧分类。重复词会通过 `mergeCategoryLists` 合并旧 `category/categories` 和 CSV 的 `category/categories`，例如原本 `daily`、CSV 为 `toefl`，结果包含 `["daily", "toefl"]`。
  - 重复词不会再用 CSV 覆盖已有 `phonetic`、`pos`、`meaning`、`example`、`exampleCn`，避免已录制的单词/例句音频因内容字段变化而需要重录。
  - 如果合并后词条属于 TOEFL，会优先保留旧的 `level/list`；旧词缺少位置时才用 CSV 的 `level/list` 补全 TOEFL 位置。
  - 如果合并后词条属于 IELTS，会把 CSV 的 `list` 合并进 `ieltsLists` 数组，并用第一个数字作为兼容字段 `ieltsList`；例如 `trunk` 同时属于 List 6 和 List 8。
  - 如果合并后词条不属于 TOEFL，会删除 `level/list`；如果不属于 IELTS，会删除 `ieltsList/ieltsLists`。
- 每次非 dry-run 的 `words:import` 成功后，都会自动调用 `splitVocabulary()` 刷新分片文件。
- 手动刷新分片可运行 `npm run words:split`。它会从 `public/data/vocabulary.json` 重新生成：
  - `public/data/vocabulary/core.json`：非 TOEFL、非 IELTS 的启动词库。
  - `public/data/vocabulary/toefl/manifest.json`：TOEFL 分片目录。
  - `public/data/vocabulary/toefl/level-{n}/list-{m}.json`：具体 TOEFL Level/List 分片。
  - `public/data/vocabulary/ielts/manifest.json`：IELTS 主题/List 分片目录。
  - `public/data/vocabulary/ielts/list-{m}.json`：具体 IELTS List 分片。
- 当前 TOEFL 导入进度：
  - Level 3：共 1010 词，List 1-10 分别为 98、100、98、99、100、100、100、99、99、117。
  - Level 4：共 1072 词，List 1-10 分别为 100、100、100、100、100、100、99、100、100、173。
  - Level 5：共 923 词，List 1-10 分别为 100、100、99、98、100、99、100、99、99、29。
  - Level 6：共 249 词，List 1-5 分别为 50、50、49、50、50。
  - 当前 TOEFL 词 3254 个。
- 当前 IELTS 导入进度：
  - 已从 `/Users/arcade/Desktop/ielts_list1-2_filled.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list3-4.csv`、`/Users/arcade/Desktop/IELTS Words/ietls_list5-6.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list7-8.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list9-10.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list11-12.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list13-14.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list15-16.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list17-18.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list19-20.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list21-23.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list24-25.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list26-27.csv` 通过 `--upsert` 导入 List 1-27。
  - IELTS manifest 当前为 10 个主题：List 1-4 自然地理，共 240；List 5-6 植物研究，共 120；List 7-9 动物保护，共 180；List 10 太空探索，共 60；List 11-17 学校教育，共 409；List 18-19 科技发明，共 120；List 20 文化历史，共 78；List 21-22 语言演化，共 73；List 23-25 娱乐运动，共 208；List 26-27 物品材料，共 120。
  - 当前 IELTS List 条目共 1608 个；其中 List 17 为 49 个，List 20/21/22/23/24/25 的条目数按当前填好 CSV 分布生成。源 CSV 中 `trunk`、`apply`、`pitch` 等词会通过 `ieltsLists` 同时归属多个 List。
  - 当前完整词库总量为 4435 个唯一词；`core.json` 约 263 个非考试词。
- IELTS PDF 纯单词提取脚本是 `scripts/extract-ielts-pdf-vocabulary.mjs`，命令示例为 `npm run ielts:extract-pdf -- /Users/arcade/Desktop/list11-16.pdf output/ielts_list11-16.csv`。该脚本使用 macOS Swift/PDFKit 读取 PDF 坐标，输出 `word,list` 两列，并已兼容 List 11-16 这种三栏内容被抽成同一行的 PDF 排版，用于后续单独生成释义/例句。
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
  - `loadVocabulary()`：加载 `/data/vocabulary/core.json` 启动词库。
  - `loadToeflManifest()`：加载 `/data/vocabulary/toefl/manifest.json`。
  - `loadToeflListVocabulary(manifest, levelKey, listKey)`：按 manifest 加载具体 TOEFL list 分片。
  - `loadIeltsManifest()`：加载 `/data/vocabulary/ielts/manifest.json`。
  - `loadIeltsListVocabulary(manifest, listKey)`：按 manifest 加载具体 IELTS list 分片。
- `src/App.jsx` 启动时加载 `core.json` + TOEFL manifest + IELTS manifest，不再启动时加载完整 `vocabulary.json`。完整 `vocabulary.json` 仍保留给导入、分片和音频生成脚本使用。
- TOEFL Level/List 页面优先使用 manifest 显示每个 Level/List 的数量，避免必须从内存扫描构造目录。
- 用户进入具体 TOEFL List 时，`ensureToeflListLoaded(level, list)` 会按需加载对应分片，并用 `mergeVocabularyList` 合并进内存。
- 用户选择“学习当前 Level 全部词汇”时，会触发 `ensureToeflLevelLoaded(level)` 预加载该 Level 下所有 List 分片。
- IELTS Topic/List 页面优先使用 manifest 显示主题和 List 数量；用户进入具体 IELTS List 时，`ensureIeltsListLoaded(list)` 会按需加载对应分片。
- 用户选择“学习当前 IELTS 主题全部词汇”时，会触发 `ensureIeltsTopicLoaded(topic)` 预加载该主题下所有 List 分片。
- IELTS 主题按钮使用 AI 生成背景图，CSS 实际引用 WebP：自然地理 `public/images/ielts-nature-geography-bg.webp`、植物研究 `public/images/ielts-plant-research-bg.webp`、动物保护 `public/images/ielts-animal-conservation-bg.webp`、太空探索 `public/images/ielts-space-exploration-bg.webp`、学校教育 `public/images/ielts-school-education-bg.webp`、科技发明 `public/images/ielts-technology-invention-bg.webp`、文化历史 `public/images/ielts-culture-history-bg.webp`、语言演化 `public/images/ielts-language-evolution-bg.webp`、娱乐运动 `public/images/ielts-entertainment-sports-bg.webp`、物品材料 `public/images/ielts-objects-materials-bg.webp`。后续新增 IELTS 主题图应保持类似自然地理的明亮、清透、内容可见风格。
- `vite.config.js` 的 PWA `globIgnores` 排除了 `**/data/vocabulary/**/*.json`，避免分片目录被 Workbox 全量预缓存；主 `public/data/vocabulary.json` 仍会按普通 json 静态资源参与构建缓存。

## 当前已知风险

- 最近重要提交：
  - `366bf22 Add IELTS vocabulary lists`：导入 IELTS List 1-2，新增 IELTS 主题/List 分层、按需分片加载、PDF 提词脚本和自然地理背景图。
  - `3c4fe49 Add static example audio generation`：新增例句静态音频生成脚本。
  - `61d07e5 Polish Kokoro preview and R2 audio uploads`：移除语音设置 Kokoro 说明块，修正 Kokoro 试听为静态 MP3，R2 上传脚本改为默认小批量 bulk。
- `resetProgress` 会调用 `storage.clearProgress()` 清除学习进度、错题、复习计划和统计历史，但会保留账号、主题、语音设置和自定义词。
- 进度合并以数组去重和对象浅合并为主，`wordProgress` 同一单词的冲突会以后写入对象覆盖。
- Worker 发送验证码依赖 Resend；本地或测试环境若缺少环境变量，登录链路会直接失败。
- CSV 解析器是自实现，不支持复杂 Excel 方言或分号分隔文件。
- 启动时已改为 `core.json + manifest`，考试词库按需加载；如果阅读高亮需要覆盖未加载的 TOEFL/IELTS 词，可能需要在阅读场景预加载相关考试分片或建立更轻量的 lookup 索引。
- `--upsert` 对重复词只合并分类，并只补位置字段（TOEFL 的 `level/list`、IELTS 的 `ieltsList`）；不会覆盖已有释义、例句、音标或词性，因此不会因 CSV 重导入触发已录制音频内容变化。
- `npm run worker:dev` 缺少本地 `wrangler` 依赖的风险已处理：`wrangler` 已加入 devDependencies，当前版本为 4.92.0。已验证 Worker 可启动到 `http://localhost:8787`，`GET /api/auth/me` 在未登录状态下正常返回 401。
- 本地前端 `npm run dev` 可正常启动；如果 `5173` 被占用，Vite 会自动切到下一个端口，例如 `5174`。
- Codex 内置 Browser 连接本地页面时曾多次超时，但同一端口用 `curl -I` 返回 200；如果要做 UI 截图验证，可能需要先解决 Browser/reconnect 问题或改用其他验证方式。
- 当前工作区还有未提交/未清理的副本文件风险：`public/data/vocabulary/ielts/list-1 2.json`、`list-2 2.json`、`manifest 2.json`、`public/data/vocabulary/toefl/manifest 2.json`，以及 `output/ielts_list1-10.csv`、`public/images/ielts-nature-geography-bg.png`。这些没有进入提交 `366bf22`；若后续要清理，需要先确认是否保留，再处理 Git index / 文件。

## 下一步建议

- 下一步最值得做的是接入静态例句音频播放：新增 `VITE_EXAMPLE_AUDIO_BASE_URL` 或复用 R2 根地址，Kokoro provider 下优先播放 `audio/examples/{voice}/{id}.mp3`；若当前音色没有例句音频（例如 `bf_emma`），可 fallback 到 `af_bella` 或实时 Kokoro。
- 男声例句 `am_michael` 已完成 R2 上传和公开 URL 抽查；后续无需再重复上传，除非本地重新生成了例句音频。
- 如果继续修订 IELTS 词表，优先使用 PDF 提取出的 `word,list` 作为基础，再单独生成释义/音标/例句，最后用 `npm run words:import -- <csv> --upsert` 导入；分片脚本会自动挂到对应 IELTS 主题。
- 若继续扩展更多考试词库，沿用 `core.json + manifest + 按需 list 分片`，避免启动包继续变大。
- 阅读 CSV 导入已覆盖 `examType` / `questions`，后续可继续补重复、缺字段、tags 分隔和带引号换行内容的测试。
- 如需更强多端同步语义，为 `wordProgress` 增加单词级 `updatedAt`，再按单词更新时间解决冲突。
- 如果继续加入 TOEFL / IELTS 阅读文章和阅读题，建议先固定 CSV 的 `questions` JSON 模板，避免手填时字段名漂移。
