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
- 上传例句静态音频到 R2：`npm run audio:upload-examples-r2`

## 主要页面

- `studyHub`：学习入口，当前已从纯入口列表升级为“今日学习计划 + 全部训练入口”。今日计划会根据到期复习、新词目标、推荐阅读和考试巩固生成下一步建议；下方仍保留词库、阅读、复习、错题、统计、考试练习和账号同步入口。
- `home`：训练中心页，支持四个主模块和 inline picker。背单词展开词库分类面板；做阅读展开阅读等级/文章面板；托福词汇和雅思词汇继续进入对应分层选择页。
- `toeflLevels` / `toeflLists`：托福词汇按 Level / List 分层选择。
- `ieltsTopics` / `ieltsLists`：雅思词汇按主题 / List 分层选择；当前已导入完整 List 1-56，按 20 个主题分组：自然地理、植物研究、动物保护、太空探索、学校教育、科技发明、文化历史、语言演化、娱乐运动、物品材料、时尚潮流、饮食健康、建筑场所、交通旅游、国家政府、社会经济、法律法规、征战沙场、社会关系、行为动作。
- `learn`：统一学习容器，由 `LearningView` 根据 mode 渲染学习卡片、测验、填空、拼写或连线。
- `readingSession`：文章阅读练习；文章页使用共享 `AppLayout` 和背单词式学习卡视觉，支持难词掌握目标条、正文阅读、全文翻译、阅读题作答、点词弹窗和反馈。阅读等级和文章选择不再有独立旧列表页，统一通过训练中心的 `ReadingPickerContent` inline 面板进入。
- `todayReview` / `wrongWords` / `learnedWords` / `masteredWords`：复习、错题、已学习、已掌握集合页。
- `statistics`：学习统计页。
- `examPractice`：考试练习模式选择页。左侧“测试”和训练中心“做测试”共用同一入口与范围选择；选择全范围时会按需加载完整考试词库分片，而不是只使用启动 `core.json`。

## 共享右上角菜单

- 共享菜单组件是 `src/components/QuickMenu.jsx`，菜单选项集中在 `src/components/quickMenuOptions.js`。
- 当前菜单统一包含：学习、测验、填空、拼写、连线、阅读、语音设置、慢速发音。
- 已接入页面：`HomeScreen`、`LearningView`、`WordCollectionView`、`ReadingSessionView`、`ExamPracticeView`。
- 如果后续新增页面需要右上角快速菜单，优先复用 `QuickMenu`，不要再复制一份本地菜单状态和选项。
- `QuickMenu` 支持 `extraItems`，用于页面专属菜单项；目前 `WordCollectionView` 用它保留“显示/隐藏搜索栏”。

## 视觉 / 主题 / 动效

- 首页/训练中心已升级为 production edtech SaaS 风格，采用真实前端组件 + 装饰性透明 PNG 资产的混合 UI 方案。交互元素、文字、按钮、导航、进度环、进度条和统计数字都必须保持为真实 HTML/CSS/React 组件，不能用整页截图或带文字的图片替代。
- 测试页当前配色和卡片节奏已确定为新的全站视觉母版，规范文件是 `test-page-visual-language.md`。后续 UI 改造应优先向这套方向靠拢：白色大面板、浅蓝背景、强蓝选中态、柔和语义色卡片、真实进度条、透明 3D 装饰图标。
- 首页设计语言已沉淀到 5 个规范文件：`agents.md`、`design-system.md`、`component-system.md`、`frontend-architecture.md`、`test-page-visual-language.md`。后续 UI 改造需要先遵守这些文档，再落到代码。
- 首页当前结构是 `AppLayout -> Sidebar + Topbar -> HeroCard -> PlanStatusCards -> StatsRow -> Status summary`。
- 训练中心当前结构是 `AppLayout -> Sidebar + Topbar -> HeroCard -> main ModuleCards -> inline word/reading picker panels -> MotivationBand -> StatsRow`。
- 阅读正文页当前结构是 `AppLayout -> Sidebar + Topbar -> 难词掌握目标条 -> 大阅读卡 -> 阅读状态侧栏 -> 底部操作按钮`。不要恢复旧的阅读局部 topbar；返回列表、显示翻译、朗读全文、同步进度和 QuickMenu 都放在内容区。
- 考试答题页当前结构是 `AppLayout -> Sidebar + Topbar -> 考试控制条 -> 细进度条 -> 居中答题卡`。考试控制条只放返回、题号和 QuickMenu；不要显示“已同步”状态，账号/登录状态归全局 Topbar 负责。四种题型（测验、填空、拼写、连线）共享这一套考试壳，题目、选项、发音、统计仍为真实组件。
- 训练中心当前不保留搜索栏；不要在 topbar 或内容区重新加入搜索，除非后续明确成为产品需求。
- 左侧导航标签保持简洁：今日计划、训练中心、单词、阅读、复习、测试、统计。桌面侧边栏底部包含共享“连续学习”卡，作为全站 chrome 的一部分；不要在页面内容里重复做第二套 streak 卡。
- 手机端首页/训练中心已改为 app 化结构：隐藏桌面侧边栏，使用 `MobileTopbar` + 浮动 `MobileBottomNav`，底部主入口为 今日 / 训练 / 统计 / 我的。移动端仍复用同一套 `navItems` 回调，不能另写页面本地导航。
- 手机端单词学习页是例外：使用 `.ds-app-layout--mobile-study` 专属学习壳，隐藏通用 `MobileTopbar` 和 `MobileBottomNav`，只显示返回、标题、进度胶囊、今日目标条、单词卡和底部三按钮。
- 首页和训练中心 topbar 已接入现有主题系统：通过 `ThemeProvider` / `useTheme.toggleTheme()` 切换深色/浅色，并继续使用 `flashcards_theme` / `flashcards_theme_explicit` 存储键。主题按钮是 `IconButton`，不是新的主题状态。
- 桌面端全站 chrome 必须统一：以当前最满意的“今日计划”桌面顶栏和左栏为母版，已拆成 `src/components/layout/Topbar.jsx`、`src/components/layout/Sidebar.jsx`、`src/components/layout/MobileAppChrome.jsx` 和 `src/components/layout/icons.jsx`。主页、训练中心、单词学习页以及后续阅读/复习/测试/统计改造都要通过 `AppLayout` 或直接 import 这些共享文件，禁止另写页面本地侧边栏或顶栏。桌面 Topbar 右侧可见槽位固定为日历、主题切换、通知、`Aa` 账号；搜索、同步、筛选、模式切换、学习进度等页面专属控件必须放进内容区面板，不能把全局顶部改成另一套。
- 新组件体系位于：
  - `src/components/layout/AppLayout.jsx`：应用壳组合器，只负责拼装共享 chrome 和内容容器。
  - `src/components/layout/Sidebar.jsx`：全站唯一桌面侧边栏实现，抽自今日计划。
  - `src/components/layout/Topbar.jsx`：全站唯一桌面顶栏实现，抽自今日计划。
  - `src/components/layout/MobileAppChrome.jsx`：移动端 topbar/bottom nav 实现。
  - `src/components/layout/icons.jsx`：App shell 共享图标。
  - `src/components/ui/Buttons.jsx`：`PrimaryButton`、`SecondaryButton`、`IconButton`。
  - `src/components/ui/Cards.jsx`：`BaseCard`、`HeroCard`、`ModuleCard`、`StatusCard`、`StatCard`。`ModuleCard` 支持 `iconSrc` / `artSrc`，生产 UI 优先使用透明 PNG 资产，避免用 emoji 做模块图标。
  - `src/components/ui/Progress.jsx`：`CircularProgress`、`LinearProgress`。
  - `src/components/modules/LearningModules.jsx`：学习模块入口组件。
  - `src/components/reading/ReadingPicker.jsx`：阅读等级卡和文章列表共享组件；训练中心和所有阅读入口都调用这一套。
  - `src/components/reading/readingPickerModel.js`：阅读等级分组和筛选 helper。
  - `src/components/ReadingSessionView.jsx`：阅读正文训练页，使用共享 `AppLayout` 和背单词式学习卡结构，保留阅读题、翻译、点词和同步逻辑。
  - `src/components/WordCard.jsx`：当前单词学习卡组件。旧泛名 `Card.jsx` 已重命名，避免误认为旧 UI 残留。
  - `src/design-system/tokens.css`：当前首页 SaaS 视觉 token、布局、卡片、按钮、进度和响应式样式。
- 透明装饰资产位于 `public/images/ui-assets/`。这些资产只用于插画和图标，不能承载中文文案、进度数字、按钮或导航。
- 首页旧资产仍包括：`hero-flashcards.png`、`review-complete.png`、`new-words.png`、`stat-flame.png`、`stat-target.png`、`stat-star.png`。
- 训练中心当前蓝白黄资产包括：
  - Hero：`training-hero-flashcards-blue-v1.png`
  - 主模块：`training-card-vocabulary-blue-v1.png`、`training-card-reading-blue-v1.png`、`training-card-review-blue-v1.png`、`training-card-test-blue-v1.png`
  - 词库分类：`category-all-words-blue-v1.png`、`category-daily-words-blue-v1.png`、`category-cet4-blue-v1.png`、`category-cet6-blue-v1.png`、`category-toefl-blue-v1.png`、`category-ielts-blue-v1.png`
  - 同目录下的 `*-source.png` / `*-alpha.png` / sprite 图是生成和裁切来源，运行时组件应优先引用最终透明 PNG。
- 首页 Hero 的核心进度不是固定值，会由当前用户学习状态计算：复习完成度和今日新词完成度共同决定 `planProgress`。后续改 UI 时不要把 50% 或其他进度值写死到图片或样式里。
- 当前全站视觉原则以测试页为基准：主蓝 `#4F7CFF` / `#2F6DFF`、辅蓝 `#7EA6FF`、黄色/橙色只做书签/星光/高亮/连线模式等小面积点缀；背景 `#F7FAFF`，卡片 `#FFFFFF`，正文 `#0F172A`，次级文案 `#64748B`。避免回到大面积紫色、重渐变或 emoji 临时图标。
- 训练中心 hero 是蓝色渐变 banner，右侧为蓝色 `Aa` flashcards，背景有轻微 A/B/C 字母装饰和黄色高光。
- 训练中心四个入口卡当前为统一白色轻卡：背单词、做阅读、今日复习、做测试。使用蓝黄 3D 英语学习资产，不再使用 emoji；“做阅读”不再用单独高亮卡，除非以后表示真实选中态。
- 训练中心“背单词”入口不会直接进入全部单词学习，而是展开并滚动到现有词库类型选择区，用户再选择全部、TOEFL、IELTS 或其它分类。
- 训练中心“做阅读”和左侧导航“阅读”都会打开 `home` 中的阅读分类面板；选择等级后在同一面板内展示纵向文章列表，再进入阅读练习。旧独立 `ReadingListView.jsx` 已删除，只保留历史 state 兼容：如果浏览器历史里还有 `readingList`，会自动转回训练中心阅读面板。
- 词库分类卡已从旧按钮升级为真实 `ModuleCard`：全部单词、日常常用、四级核心、六级核心、托福词汇、雅思词汇。卡片使用蓝黄 3D 学习图标，文本/词数/箭头仍为真实 DOM。
- `StatsRow` 当前是统一 Daily Progress 组件：左侧标题区域 + 三个对齐 stats，数字和标签是真实组件，图标只是装饰。
- 手机端单词学习页不显示桌面侧栏状态：学习进度、连续打卡、剩余词汇 summary、坚持每天进步都应隐藏；底部动作保持横向三列：不认识 / 显示提示 / 认识了。
- 顶部账号区域使用品牌化 `Aa` chip；未登录态显示“未登录”，点击仍进入登录/注册流程，不要再放 emoji。
- 顶层 `AppContent` 已在 `view` 变化时执行 `window.scrollTo({ top: 0 })`，避免从移动端深层滚动位置进入 IELTS/TOEFL/阅读等新视图时停留在页面中部。
- 已支持深色版：启动前会在 `src/main.jsx` 根据系统偏好和本地主题设置给根节点加主题 class，避免深色浏览器打开时先闪白屏。
- 深色版覆盖了学习入口、今日学习计划、词汇学习、考试练习、阅读、统计、语音设置、单词集合等主要页面；后续新增页面要同步检查浅色/深色对比度，避免出现白色卡片或深色文字不可见。
- GSAP 已接入，依赖为 `gsap` 和 `@gsap/react`；统一封装在 `src/utils/gsapMotion.js`，会尊重 `prefers-reduced-motion`。
- 当前 GSAP 动效覆盖：答对题目庆祝动画、学习模式切换轻量过渡、IELTS/TOEFL 主题卡片入场、统计页数字滚动、阅读高亮词弹窗出现动画。
- 新增动画时优先复用 `gsapMotion.js`，避免 CSS animation 和 GSAP 同时控制同一属性。

## TTS / 语音

- 语音工具在 `src/utils/speech.js`，支持 `browser` 和 `kokoro` 两个 provider；Kokoro 失败时会自动 fallback 到浏览器 TTS。
- 语音设置 UI 在 `src/components/VoiceSettings.jsx`，现在面向用户只保留语速和 Kokoro 音色选择，不再展示浏览器 TTS、provider 切换、endpoint 输入等偏开发配置。
- 新用户或本地未保存过语音设置时，默认 provider 是 `kokoro`，默认音色是 `af_bella`。
- 当前前端可选 Kokoro 音色为 4 个：`af_bella` Bella 美音女声、`am_michael` Michael 美音男声、`bf_emma` Emma 英音女声、`bm_george` George 英音男声。
- 语音设置里的 Kokoro 说明蓝色提示块已移除；“试听发音”会走正常 `speakWord()` 链路，优先播放静态 Kokoro 单词 MP3（当前用 `{ id: 1, word: "abandon" }`），静态文件缺失时再 fallback 到实时 Kokoro / 浏览器 TTS。
- 默认 Kokoro endpoint 是 `http://127.0.0.1:8880/v1/audio/speech`，`.env.example` 也已改成本地自部署默认值。
- 本地 Kokoro 服务脚本是 `scripts/kokoro_tts_server.py`，依赖写在 `requirements-kokoro.txt`，说明文档是 `docs/kokoro-tts.md`。
- 本地服务提供 `POST /v1/audio/speech` 和 `POST /tts`，兼容 OpenAI 风格 payload：`input`、`voice`、`speed`、`response_format`。
- 音频生成后会缓存到 `.cache/kokoro-tts/`，缓存目录和 `.venv-kokoro` 都被 `.gitignore` 排除。
- 当前机器已通过 Homebrew 安装 `python@3.11`、`espeak-ng`、`libsndfile`，并已创建项目虚拟环境 `.venv-kokoro`、安装 Python 依赖。
- `.venv-kokoro` 当前位于项目目录内，体积约 936 MB，其中 PyTorch 相关依赖是主要占用；暂时先保留不迁移。如果后续要瘦项目目录，建议在项目外重建到例如 `/Users/arcade/.venvs/english-flashcards-kokoro`，再把 `package.json` 的 Kokoro 命令改为外部 venv 路径或 `KOKORO_PYTHON` 环境变量。
- 已实测 `curl http://127.0.0.1:8880/health` 返回 `{"status":"ok"}`，并成功生成 `/private/tmp/kokoro-test.wav`（WAV，mono 24000 Hz）。
- 批量静态单词音频脚本是 `scripts/generate_kokoro_word_audio.py`，启动命令是 `npm run tts:generate-words`。
- 批量静态例句音频脚本是 `scripts/generate_kokoro_example_audio.py`，启动命令是 `npm run tts:generate-examples`；输出到 `public/audio/examples/{voice}/{id}.mp3`，适合把例句从实时 TTS 迁到 R2 静态音频。可用 `-- --voices <voice>` 指定单个或多个音色，例如 `npm run tts:generate-examples -- --voices bm_george`。
- R2 同步脚本是 `scripts/upload-word-audio-r2.mjs`，启动命令是 `npm run audio:upload-r2`；默认把 `public/audio/words` 上传到 bucket 的 `audio/words/` 前缀，bucket 可通过 `R2_AUDIO_BUCKET` 或 `--bucket` 指定。脚本也可通过 `--source` / `--prefix` 复用到其他音频目录，例句快捷命令是 `npm run audio:upload-examples-r2`，默认把 `public/audio/examples` 上传到 `audio/examples/`。
- R2 上传脚本默认使用 Wrangler `r2 bulk put` 小批量上传 MP3：`--batch-size 100 --concurrency 3 --retries 3 --batch-delay-ms 1500`；已新增 `--min-id` / `--max-id` 按数字 id 过滤 MP3，始终包含 `manifest.json`，并且批次最终失败会直接退出，避免限流或鉴权抖动后悄悄跳批。R2 曾出现 `429 Too Many Requests` 和临时 `401 Unauthorized`，稳定上传建议使用 `--batch-size 25 --concurrency 1 --batch-delay-ms 4000`。
- 已生成并上传 4 套单词 MP3：`af_bella`、`am_michael`、`bf_emma`、`bm_george`；路径为 `public/audio/words/{voice}/{id}.mp3` / R2 `audio/words/{voice}/{id}.mp3`，每个音色覆盖完整 5399 个唯一词，0 失败，MP3 24 kbps / 24 kHz / mono。
- 已生成并上传 4 套例句 MP3：`af_bella`、`am_michael`、`bf_emma`、`bm_george`；路径为 `public/audio/examples/{voice}/{id}.mp3` / R2 `audio/examples/{voice}/{id}.mp3`，每个音色覆盖完整 5399 个例句，0 失败，MP3 24 kbps / 24 kHz / mono。
- 前端 `speakWord()` 在 Kokoro provider 下会优先播放静态单词音频；文件缺失或播放失败时 fallback 到实时 Kokoro / 浏览器 TTS。
- 静态单词音频默认 base URL 是 `/audio/words`；线上构建已在 GitHub Actions 设置 `VITE_WORD_AUDIO_BASE_URL=https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio/words`，让远端 App 从 R2 读取音频，避免 App 本体携带全部 MP3。
- 前端例句播放已接入静态 Kokoro MP3 优先播放：`src/utils/speech.js` 提供 `speakExample(word)`，Kokoro provider 下会优先尝试当前音色的 `audio/examples/{voice}/{id}.mp3`。当前静态例句白名单为 `af_bella`、`am_michael`、`bf_emma`、`bm_george`，因此选择 Emma/George 时例句也会使用英音；文件缺失或播放失败时再 fallback 到实时 Kokoro / 浏览器 TTS。可用 `VITE_EXAMPLE_AUDIO_BASE_URL` 指向 R2/CDN；未配置时默认 `/audio/examples`。当前已接入 `WordCard.jsx` 和 `FillBlank.jsx` 的例句播放按钮。
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
  - 已从 `/Users/arcade/Desktop/ielts_list1-2_filled.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list3-4.csv`、`/Users/arcade/Desktop/IELTS Words/ietls_list5-6.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list7-8.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list9-10.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list11-12.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list13-14.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list15-16.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list17-18.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list19-20.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list21-23.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list24-25.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list26-27.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list28-29.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list30-31.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list32-33.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list34-35.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list36-37.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list38-39.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list40-41.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list42-43.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list44-45.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list46-47.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list48-49.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list50-51.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list52-53.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list54-55.csv`、`/Users/arcade/Desktop/IELTS Words/ielts_list56.csv` 通过 `--upsert` 导入 List 1-56。
  - IELTS manifest 当前为 20 个主题：List 1-4 自然地理，共 240；List 5-6 植物研究，共 120；List 7-9 动物保护，共 180；List 10 太空探索，共 60；List 11-17 学校教育，共 409；List 18-19 科技发明，共 120；List 20 文化历史，共 78；List 21-22 语言演化，共 73；List 23-25 娱乐运动，共 208；List 26-27 物品材料，共 120；List 28-29 时尚潮流，共 120；List 30-32 饮食健康，共 168；List 33-35 建筑场所，共 157；List 36-37 交通旅游，共 143；List 38-40 国家政府，共 179；List 41-43 社会经济，共 184；List 44-45 法律法规，共 116；List 46-49 征战沙场，共 240；List 50 社会关系，共 60；List 51-56 行为动作，共 360。
  - 当前 IELTS List 条目共 3335 个；其中 List 17 为 49 个，List 20/21/22/23/24/25/32/35/36/40/43/44/48/49/55/56 的条目数按当前填好 CSV 分布生成。源 CSV 中 `trunk`、`apply`、`pitch` 等词会通过 `ieltsLists` 同时归属多个 List。
  - 当前完整词库总量为 5399 个唯一词；`core.json` 为 178 个非考试词。
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

- 阅读入口现在统一由训练中心的 inline `ReadingPickerContent` 承载：先按 CEFR 等级展示四张轻量阅读等级卡，再进入纵向文章列表。不要恢复旧的独立阅读列表页面或旧横排文章卡。
- 阅读正文页已升级为蓝白学习卡风格：共享桌面侧栏/顶栏，移动端保留通用 `MobileTopbar` 和 `MobileBottomNav`；正文页不再使用旧的局部阅读 topbar。
- 阅读正文会基于词库高亮未掌握词，点击可打开单词详情并标记学习/掌握。
- 阅读文章可包含 `questions`，`ReadingSessionView` 会渲染“阅读题”，选择选项后显示正确/错误和解析。
- 首页今日计划会优先推荐一篇考试风格阅读；当前推荐策略优先选 IELTS B2，其次 TOEFL，其次任意带 `examType` 的阅读。点击推荐阅读会直接进入 `readingSession`。
- 当前内置阅读文章数量为 18 篇，其中 6 篇为原创 IELTS/TOEFL 风格练习：IELTS 3 篇（湿地、城市热岛、考古碎片），TOEFL 3 篇（海洋洋流、重返月球、电报与通信网络）。这些文章没有搬运 IELTS/TOEFL 真题，事实参考来自 NASA/NOAA 等公开资料或通用背景知识，文章、题目和解析均为自写。
- 6 篇考试风格阅读每篇都有英文原文、中文翻译、`examType`、CEFR 等级、预计阅读时间、5 道选择题、答案和中文解析。

## 连线题交互状态

- 连线题组件是 `src/components/MatchingTest.jsx`，样式集中在 `src/styles/word-learning-refresh.css` 的 `.matching-refresh-*` 区域。
- 桌面端和手机端都保留原有点选交互：先点左侧单词，再点右侧释义。
- 手机端不再把“单词”和“释义”上下堆叠，而是保持左右两列，并压缩卡片间距、编号圆点、字号和内边距，方便同屏完成配对。
- 已新增拖线交互：按住左侧单词卡片可从卡片中心拖出蓝色连线，松到右侧释义卡片上自动判定对错。
- 拖线使用 `pointer` 事件和 SVG overlay 实现，线层显示在卡片上方但 `pointer-events: none`，不会拦截点击/触控。拖线失败或取消时会清理临时线条，原点选方式仍可继续使用。
- 若后续继续优化移动端连线题，优先在真机通过局域网 Vite 地址验证触控手感；电脑响应式模式只能粗看布局。

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
- IELTS 主题按钮使用 AI 生成背景图，CSS 实际引用 WebP：自然地理 `public/images/ielts-nature-geography-bg.webp`、植物研究 `public/images/ielts-plant-research-bg.webp`、动物保护 `public/images/ielts-animal-conservation-bg.webp`、太空探索 `public/images/ielts-space-exploration-bg.webp`、学校教育 `public/images/ielts-school-education-bg.webp`、科技发明 `public/images/ielts-technology-invention-bg.webp`、文化历史 `public/images/ielts-culture-history-bg.webp`、语言演化 `public/images/ielts-language-evolution-bg.webp`、娱乐运动 `public/images/ielts-entertainment-sports-bg.webp`、物品材料 `public/images/ielts-objects-materials-bg.webp`、时尚潮流 `public/images/ielts-fashion-trends-bg.webp`、饮食健康 `public/images/ielts-food-health-bg.webp`、建筑场所 `public/images/ielts-architecture-places-bg.webp`、交通旅游 `public/images/ielts-transport-travel-bg.webp`、国家政府 `public/images/ielts-nation-government-bg.webp`、社会经济 `public/images/ielts-society-economy-bg.webp`、法律法规 `public/images/ielts-law-regulation-bg.webp`、征战沙场 `public/images/ielts-warfare-battlefield-bg.webp`、社会关系 `public/images/ielts-social-relationships-bg.webp`、行为动作 `public/images/ielts-actions-behaviors-bg.webp`。后续新增 IELTS 主题图应保持类似自然地理的明亮、清透、内容可见风格。
- `vite.config.js` 已关闭 Vite build 默认的 `public` 整目录复制：`build.copyPublicDir: false`。生产构建通过自定义插件复制 public 资源，明确排除 `public/audio`，避免 385MB+ 静态音频进入 `dist`。
- 生产 build 会复制 `icons`、`images`、`manifest.json`、`icons.svg`、`favicon.svg` 等小资源；`public/data` 会在 PWA 生成之后再复制到 `dist/data`，避免 Workbox 扫描词库 JSON。
- PWA 预缓存不包含 `audio` 和大词库数据；最近验证 `npm run build` 约 1.45 秒完成，`dist/audio` 为 0 个文件，`dist` 约 11MB，`dist/data` 约 4.9MB。

## 当前已知风险

- 最近重要提交：
  - `d60f38f Polish shared app shell and word learning UI`：拆出共享桌面 Topbar/Sidebar 和移动 App chrome，统一今日计划/训练中心/背单词桌面顶部与左侧；重做单词学习卡和手机端单词学习页，训练中心移除搜索栏，并通过 `npm run lint` / `npm run build` 验证。
  - `ebf3b8b Refine training center blue UI`：训练中心改为蓝白黄 English learning app 风格，新增蓝色 hero、四个主模块 3D 图标、六个词库分类 3D 图标，重构 word/reading inline picker、Daily Progress、登录按钮和侧边栏选中态，并通过 `npm run lint` / `npm run build` 验证。
  - `1cb18df Polish mobile home UI`：完成手机端首页/训练中心 UI polish，新增移动端 topbar/bottom nav、主题切换按钮、统一训练模块卡、背单词先进入分类选择、视图切换滚动回顶部，并通过 `npm run lint` / `npm run build` 验证。
  - 首页 premium edtech SaaS UI polish 阶段：新增组件化 App Shell、卡片、按钮、进度组件、透明 UI 资产，以及 `agents.md` / `design-system.md` / `component-system.md` / `frontend-architecture.md` 规范文档。
  - `366bf22 Add IELTS vocabulary lists`：导入 IELTS List 1-2，新增 IELTS 主题/List 分层、按需分片加载、PDF 提词脚本和自然地理背景图。
  - `3c4fe49 Add static example audio generation`：新增例句静态音频生成脚本。
  - `61d07e5 Polish Kokoro preview and R2 audio uploads`：移除语音设置 Kokoro 说明块，修正 Kokoro 试听为静态 MP3，R2 上传脚本改为默认小批量 bulk。
  - `14206c8 Prefer static Kokoro example audio`：例句播放接入静态 Kokoro MP3 优先播放，默认 provider 设为 Kokoro。
  - `82678e8 Add IELTS lists 28-37`、`509544d Add IELTS lists 38-47`、`1315b90 Complete IELTS vocabulary lists`：完成 IELTS List 28-56 导入，并补齐新增主题图。
  - `663a480 Add incremental R2 audio upload support`：单词 R2 上传脚本支持 `--min-id` / `--max-id` 和失败即退出；单词音频已增量上传到 R2。
  - `4c77dbd Add example audio R2 upload command`：新增例句 R2 上传快捷命令；例句音频已增量上传到 R2。
  - `076c3c3 Improve mobile matching interactions`：优化手机端连线题左右布局，并新增从左侧卡片中心拖线连接右侧释义的交互动画。
  - `949207f Add dark theme support`：新增深色版支持，覆盖学习、考试、阅读、统计、语音设置等主要页面。
  - `f9feb8d Add GSAP interactions and streamline voice settings`：接入 GSAP 动效，简化语音设置面板，并加入 George 英音男声入口。
  - `1f5f008 Enable British example audio voices`：把 `bf_emma` 和 `bm_george` 加入静态例句音频白名单，修复英音单词但例句回到美音的问题。
  - `a34a268 Add exam-style readings and speed up builds`：新增 6 篇原创 IELTS/TOEFL 风格阅读练习，并优化 Vite build，排除 `public/audio`，让生产构建恢复到秒级。
- 当前工作区在 `d60f38f` 之后只做文档同步时，应避免误改 UI 代码；若继续 UI 调整，先遵守共享 chrome 和手机单词页规则。
- `resetProgress` 会调用 `storage.clearProgress()` 清除学习进度、错题、复习计划和统计历史，但会保留账号、主题、语音设置和自定义词。
- 进度合并以数组去重和对象浅合并为主，`wordProgress` 同一单词的冲突会以后写入对象覆盖。
- Worker 发送验证码依赖 Resend；本地或测试环境若缺少环境变量，登录链路会直接失败。
- CSV 解析器是自实现，不支持复杂 Excel 方言或分号分隔文件。
- 启动时已改为 `core.json + manifest`，考试词库按需加载；如果阅读高亮需要覆盖未加载的 TOEFL/IELTS 词，可能需要在阅读场景预加载相关考试分片或建立更轻量的 lookup 索引。
- `--upsert` 对重复词只合并分类，并只补位置字段（TOEFL 的 `level/list`、IELTS 的 `ieltsList`）；不会覆盖已有释义、例句、音标或词性，因此不会因 CSV 重导入触发已录制音频内容变化。
- `npm run worker:dev` 缺少本地 `wrangler` 依赖的风险已处理：`wrangler` 已加入 devDependencies，当前版本为 4.92.0。已验证 Worker 可启动到 `http://localhost:8787`，`GET /api/auth/me` 在未登录状态下正常返回 401。
- 本地前端 `npm run dev` 可正常启动；如果 `5173` 被占用，Vite 会自动切到下一个端口，例如 `5174`。`public/audio` 已被 Vite dev watch 忽略，避免大量 MP3 拖慢本地开发。
- Codex 内置 Browser 连接本地页面时曾多次超时，但同一端口用 `curl -I` 返回 200；如果要做 UI 截图验证，可能需要先解决 Browser/reconnect 问题或改用其他验证方式。
- 当前仍有一个未跟提交绑定的旧 PNG 素材风险：`public/images/ielts-nature-geography-bg.png` 仍在本地存在；CSS 实际使用 WebP。若后续清理静态资源，需要先确认这个 PNG 是否还要保留。

## 下一步建议

- 产品改进路线已沉淀到 `plan.md`。当前优先级是继续把首页“今日学习计划”从轻量推荐升级为完整日任务闭环。
- 刚完成的 shared app shell / word-learning polish 已降低桌面和手机端 UI 分叉；下一轮 UI 优先继续清理 今日计划、训练中心、TOEFL/IELTS 选择页、阅读等级页、复习/统计页旧样式残留，让它们与共享 chrome 和测试页视觉语言保持一致。
- 今日计划后续建议优先补：
  - 把阅读完成、考试巩固完成也纳入日级进度，而不是只用复习和新词计算核心进度。
  - 允许用户自定义每日新词目标，例如 10 / 15 / 25。
  - 今日任务完成后给出轻量总结和明日预告。
- 第二阶段建议做“学习目标”设置：IELTS、TOEFL、日常英语。首页推荐阅读、词库入口和统计维度都优先匹配当前目标，减少用户在多个入口里反复选择。
- 第三阶段建议完善阅读练习闭环：阅读完成结果页、阅读列表完成状态、错题解析、文章内未掌握词回收。
- 第四阶段建议产品化复习与错题：错题按来源分组，连续答对后提示移出错题本，到期复习成为首页最稳定的回访理由。
- 第五阶段建议改造统计页：近 7 天趋势、连续学习天数、掌握率变化，并区分单词、阅读、考试巩固三个维度。
- 之前提到的“测试能力界面”仍然有价值，但优先级低于学习任务闭环。若后续实现，建议作为开发/诊断入口，复用 `QuickMenu`、`storage`、`src/data/vocabulary.js`、`src/utils/speech.js` 和 Worker API 封装，不要复制一套加载逻辑。
- 线上构建环境需要同时设置 `VITE_WORD_AUDIO_BASE_URL=https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio/words` 和 `VITE_EXAMPLE_AUDIO_BASE_URL=https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio/examples`，让远端 App 直接从 R2 读取单词/例句 MP3，避免依赖实时 Kokoro 接口。
- 单词音频与例句音频 4 个音色均已完成 R2 上传；后续无需重复上传，除非本地重新生成了对应音频或新增词条。新增词条后优先用 `--min-id <新起始 id>` 增量上传。
- 如果继续修订 IELTS 词表，优先使用 PDF 提取出的 `word,list` 作为基础，再单独生成释义/音标/例句，最后用 `npm run words:import -- <csv> --upsert` 导入；分片脚本会自动挂到对应 IELTS 主题。
- 若继续扩展更多考试词库，沿用 `core.json + manifest + 按需 list 分片`，避免启动包继续变大。
- 阅读 CSV 导入已覆盖 `examType` / `questions`，后续可继续补重复、缺字段、tags 分隔和带引号换行内容的测试。
- 如需更强多端同步语义，为 `wordProgress` 增加单词级 `updatedAt`，再按单词更新时间解决冲突。
- 如果继续加入 TOEFL / IELTS 阅读文章和阅读题，继续坚持“开放资料事实参考 + 自写文章/题目/解析”的路线，不要直接搬运 Cambridge IELTS、ETS TOEFL 或培训站真题全文。建议先固定 CSV 的 `questions` JSON 模板，避免手填时字段名漂移。
