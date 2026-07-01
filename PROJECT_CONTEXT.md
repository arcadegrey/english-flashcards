# Project Context

## Purpose

Vite + React 英语学习应用，支持单词卡片、测验、填空、拼写、连线、阅读练习、错题复习、考试巩固、学习统计和云同步。

## Commands

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
- 生成例句静态音频：`npm run tts:generate-examples`
- 上传单词静态音频到 R2：`npm run audio:upload-r2`
- 上传例句静态音频到 R2：`npm run audio:upload-examples-r2`

## Core Data

- 主词库：`public/data/vocabulary.json`
- 启动词库：`public/data/vocabulary/core.json`
- TOEFL 分片：`public/data/vocabulary/toefl/`
- IELTS 分片：`public/data/vocabulary/ielts/`
- 阅读材料：`src/data/readings.js`
- 用户进度：本地 storage，可同步到 Cloudflare Worker + D1

当前词库状态：

- 完整唯一词量：8699
- `core.json`：3478 个非 TOEFL/IELTS 核心词
- Daily：2026 个
- CET4：2283 个
- CET6：1520 个
- TOEFL：3254 个
- IELTS：3257 个唯一词；List 1-56，20 个主题，3335 个 List 条目
- 2026-06-29 已清理 ID 5400-8699 扩展词库例句翻译：`public/data/vocabulary.json` 和 `public/data/vocabulary/core.json` 中旧的“这个例句...”占位翻译与“参考译文...”兜底文案均为 0。截图样例 `dine` 当前翻译为“我们经常和朋友在这家餐厅用餐。”
- 2026-06-30 已重写 ID 5400-8699 扩展词库中 1364 条兜底英文例句：`Students often meet the word ...` 模板在 `public/data/vocabulary.json` 和 `public/data/vocabulary/core.json` 中均为 0；导出/导入维护脚本为 `scripts/export-example-rewrite-csv.mjs` 和 `scripts/import-example-rewrites.mjs`。
- 2026-07-01 已为上述 1364 条变更例句重新生成并上传 4 个音色例句音频，共 5456 个实际变更 MP3；为保证线上一致，R2 断点续传覆盖了 ID 5400-8699 范围例句音频和 `audio/examples/manifest.json`，公网抽样 `manifest.json`、`af_bella/5400.mp3`、`bm_george/8699.mp3` 均为 `200 OK`。

## Main Views

- `studyHub`：今日学习计划和全部训练入口。
- `planSettings`：今日计划设置页，从“调整计划”进入；当前支持每日新词目标 10 / 15 / 25 / 40，本地持久化到 `flashcards_daily_new_word_target`，并实时影响今日计划新词卡和训练中心 Daily Progress。
- `home`：训练中心，包含四个主模块和 inline word/reading picker。
- `toeflLevels` / `toeflLists`：TOEFL Level/List 分层选择。
- `ieltsTopics` / `ieltsLists`：IELTS 主题/List 分层选择。
- `learn`：统一学习容器；`LearningView` 根据 mode 渲染学习、测验、填空、拼写或连线。
- `readingSession`：阅读正文训练页。
- `todayReview` / `wrongWords` / `learnedWords` / `masteredWords`：单词集合页。
- `statistics`：学习统计页。
- `examPractice`：考试练习范围和模式选择页。

## UI Architecture

Detailed rules live in:

- `agents.md`
- `frontend-architecture.md`
- `design-system.md`
- `component-system.md`
- `test-page-visual-language.md`

Current UI direction:

- 测试页白蓝视觉语言是全站母版。
- 桌面端使用共享 `AppLayout`、`Sidebar.jsx`、`Topbar.jsx`。
- 桌面端 `Sidebar.jsx` 当前包含真实“连续学习”卡：连续天数和本周点亮状态来自 `studyHistory`，不能再写死固定天数；无行为的“收起菜单”已删除。
- 移动端使用共享 `MobileTopbar` 和 `MobileBottomNav`。
- 手机端单词学习页是唯一 app-shell 例外，使用 `.ds-app-layout--mobile-study`。
- 手机端单词学习页顶部包含返回、标题、语音设置按钮和进度 pill；单词标题使用单行自适应字号，避免长单词换行。
- 透明装饰资产位于 `public/images/ui-assets/`，只用于装饰图标、插画和空状态。
- 生成图片不能承载按钮、文案、进度、统计数字或导航。
- 新动画优先复用 `src/utils/gsapMotion.js`，并尊重 `prefers-reduced-motion`。
- 2026-07-01 当前产品阶段固定浅色模式：保留暗色主题代码和 `ThemeContext` API，但启动时强制 `flashcards_theme=light`、移除 `.dark`，桌面 `Topbar` 与移动 `MobileTopbar` 不再渲染深浅切换按钮；无论浏览器系统主题是深色还是浅色，应用都只显示浅色界面。
- 今日计划底部账号/学习摘要条已从大块浅灰条调整为白蓝轻量状态条，避免在页面底部形成突兀断层。

Important shared components:

- `src/components/layout/AppLayout.jsx`
- `src/components/layout/Sidebar.jsx`
- `src/components/layout/Topbar.jsx`
- `src/components/layout/MobileAppChrome.jsx`
- `src/components/ui/Buttons.jsx`
- `src/components/ui/Cards.jsx`
- `src/components/ui/Progress.jsx`
- `src/components/reading/ReadingPicker.jsx`
- `src/components/ReadingSessionView.jsx`
- `src/components/WordCard.jsx`
- `src/components/QuickMenu.jsx`

## Reading

- 阅读入口统一由训练中心 inline `ReadingPickerContent` 承载。
- 单词学习子界面左侧栏“背单词”必须回到训练中心的单词选择面板，不能复用阅读面板请求。
- 阅读等级选择和文章选择都使用测试页练习方式的白蓝大卡节奏：两列横向卡、左侧真实装饰图标/等级 badge、中间真实标题与说明、右侧真实圆形箭头。
- 选择等级后在同一面板内展示文章选择卡。
- 阅读正文页使用共享 `AppLayout`，保留正文、翻译、阅读题、点词弹窗、高亮词和同步逻辑。
- 当前内置阅读文章 18 篇，其中 6 篇为原创 IELTS/TOEFL 风格练习，文章、题目和解析均为自写。
- 阅读 CSV 默认字段：`title, level, category, content, translation, source, tags, examType, questions`。
- 阅读导入脚本：`scripts/import-global-reading.mjs`。

## Vocabulary Loading

- `src/data/vocabulary.js` 暴露核心加载函数：
  - `loadVocabulary()`
  - `loadToeflManifest()`
  - `loadToeflListVocabulary()`
  - `loadIeltsManifest()`
  - `loadIeltsListVocabulary()`
- App 启动只加载 `core.json` + TOEFL/IELTS manifest。
- 进入具体 TOEFL/IELTS List 时按需加载分片。
- 选择某个 TOEFL Level 或 IELTS Topic 全部词汇时，按需预加载该范围分片。
- 生产 build 不复制 `public/audio`，避免静态音频进入 `dist`。

## CSV Import

单词 CSV 默认字段：

```text
word, phonetic, pos, meaning, example, exampleCn, category, level, list
```

规则：

- 必填：`word`、`meaning`
- 按小写 `word` 去重
- 有效分类：`daily`、`cet4`、`cet6`、`toefl`、`ielts`
- `all` 只是入口，不是词条分类
- 非 dry-run 的 `words:import` 成功后会自动刷新分片
- `--upsert` 合并分类和位置字段，不覆盖已有释义、例句、音标或词性
- Daily/CET 扩展 CSV：`data/daily_cet_expansion.csv`
- Daily/CET 扩展生成脚本：`scripts/build-daily-cet-expansion.py`，基于 MIT 许可 ECDICT 生成筛选后的导入 CSV
- 例句翻译维护脚本：
  - `scripts/fix-placeholder-example-translations.mjs`：修复旧占位翻译，并通过 `curl`/MyMemory 尝试补句子翻译。
  - `scripts/fill_fallback_translations.py`：使用本机 `deep_translator` 补齐剩余本地兜底例句翻译。
- 重新生成或导入扩展词库后，必须确认 `exampleCn` 不包含“这个例句...”或“参考译文...”这类说明性占位文案。

## TTS And Audio

- 语音工具：`src/utils/speech.js`
- 语音设置 UI：`src/components/VoiceSettings.jsx`
- 默认 provider：`kokoro`
- 默认音色：`af_bella`
- 默认本地 endpoint：`http://127.0.0.1:8880/v1/audio/speech`
- 本地服务脚本：`scripts/kokoro_tts_server.py`
- 详细说明：`docs/kokoro-tts.md`

静态音频：

- 单词音频：`public/audio/words/{voice}/{id}.mp3`
- 例句音频：`public/audio/examples/{voice}/{id}.mp3`
- R2 bucket：`english-flashcards-audio`
- 公开 URL：`https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev`
- 已完成 4 套单词和例句音频上传：`af_bella`、`am_michael`、`bf_emma`、`bm_george`
- 2026-06-28 新增音频已补传到 R2：只上传 ID 5400-8699，单词 13,200 个 MP3，例句 13,200 个 MP3，两个 manifest 均已更新并公网抽样 `200 OK`
- 2026-07-01 `scripts/generate_kokoro_example_audio.py` 已改为 hash-aware：会读取现有 `public/audio/examples/manifest.json` 的 `exampleHashes`，当例句文本变化时即使 MP3 已存在也会加入待生成队列；`--dry-run --start 5399` 当前返回 `pendingFiles=0`。

线上建议环境变量：

```bash
VITE_WORD_AUDIO_BASE_URL=https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio/words
VITE_EXAMPLE_AUDIO_BASE_URL=https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio/examples
```

## Cloudflare Worker / D1

- API 封装：`src/utils/workerAuth.js`
- 默认 API 前缀：`VITE_API_BASE` 或 `/api`
- Worker 提供邮箱验证码登录、会话恢复、登出、进度读取和进度写入。
- D1 表：`users`、`login_codes`、`sessions`、`user_progress`
- 会话 cookie：`ef_session`
- 同步数据：`learnedWords`、`masteredWords`、`customWords`、`wordProgress`、`wrongWords`、`studyHistory`
- 自动同步 debounce：800ms
- 版本冲突通过 Worker 合并云端和本次进度后写回。

## Known Risks

- 阅读高亮如果需要覆盖未加载的 TOEFL/IELTS 词，可能需要阅读场景专用 lookup 或分片预加载。
- CSV 解析器是自实现，不覆盖复杂 Excel 方言或分号分隔文件。
- Worker 登录链路依赖 Resend 和生产密钥。
- 每日新词目标目前是本地偏好，不在 Cloudflare 进度同步协议里；如需多端一致，需要后续扩展 progress payload 或新增偏好接口。
- Codex 内置 Browser 连接本地页面曾出现超时；必要时可用 `curl`、构建结果或其他浏览器验证方式辅助。
- `public/images/ielts-nature-geography-bg.png` 仍可能是未提交绑定的旧 PNG；CSS 当前实际使用 WebP。

## Next Work

产品路线见 `plan.md`。当前优先级：

1. 完善今日学习计划闭环。
2. 继续清理 TOEFL/IELTS 选择页和残留旧样式。
3. 建立学习目标：IELTS / TOEFL / 日常英语。
4. 完善阅读完成结果、错题解析和未掌握词回收。
5. 统计页继续产品化，区分单词、阅读、考试巩固。
