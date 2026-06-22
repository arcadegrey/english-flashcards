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

- 完整唯一词量：5399
- `core.json`：178 个非考试词
- TOEFL：3254 个
- IELTS：List 1-56，20 个主题，3335 个 List 条目

## Main Views

- `studyHub`：今日学习计划和全部训练入口。
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
- 移动端使用共享 `MobileTopbar` 和 `MobileBottomNav`。
- 手机端单词学习页是唯一 app-shell 例外，使用 `.ds-app-layout--mobile-study`。
- 透明装饰资产位于 `public/images/ui-assets/`，只用于装饰图标、插画和空状态。
- 生成图片不能承载按钮、文案、进度、统计数字或导航。
- 新动画优先复用 `src/utils/gsapMotion.js`，并尊重 `prefers-reduced-motion`。

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
- 选择等级后在同一面板内展示纵向文章列表。
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
- Codex 内置 Browser 连接本地页面曾出现超时；必要时可用 `curl`、构建结果或其他浏览器验证方式辅助。
- `public/images/ielts-nature-geography-bg.png` 仍可能是未提交绑定的旧 PNG；CSS 当前实际使用 WebP。

## Next Work

产品路线见 `plan.md`。当前优先级：

1. 完善今日学习计划闭环。
2. 继续清理 TOEFL/IELTS 选择页和残留旧样式。
3. 建立学习目标：IELTS / TOEFL / 日常英语。
4. 完善阅读完成结果、错题解析和未掌握词回收。
5. 统计页继续产品化，区分单词、阅读、考试巩固。
