# Project Context

## 项目用途

- 一个 Vite + React 英语学习应用，用于单词卡片学习、测验、填空、拼写、阅读练习、错题复习和学习统计。
- 内置词库来自 `public/data/vocabulary.json` 并在启动时异步加载；阅读材料来自 `src/data/readings.js`。用户自定义词和学习进度保存在本地 storage，并可同步到 Cloudflare Worker + D1。

## 启动命令

- 前端开发：`npm run dev`
- Worker 本地开发：`npm run worker:dev`
- 构建：`npm run build`
- 测试：`npm test`
- 预览构建产物：`npm run preview`
- 代码检查：`npm run lint`
- D1 迁移：`npm run d1:migrate`
- 导入全局词库：`npm run words:import`
- 导入阅读材料：`npm run readings:import`

## 主要页面

- `studyHub`：学习入口，展示词库、阅读、复习、错题、统计、考试练习和账号同步入口。
- `home`：单词分类选择页，支持全部、分类和托福词汇入口。
- `toeflLevels` / `toeflLists`：托福词汇按 Level / List 分层选择。
- `learn`：统一学习容器，由 `LearningView` 根据 mode 渲染学习卡片、测验、填空或拼写。
- `readingList` / `readingSession`：阅读列表和文章阅读练习。
- `todayReview` / `wrongWords` / `learnedWords` / `masteredWords`：复习、错题、已学习、已掌握集合页。
- `statistics`：学习统计页。
- `examPractice`：考试练习模式选择页。

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
- 单词导入会按小写 word 去重；新 id 从现有最大 id + 1 开始。
- 分类通过 `parseCategoryList` 解析，只保留有效分类；无有效分类时默认 `daily`。
- 仅当分类包含 `toefl` 时才写入规范化后的 `level` / `list` 数字标签。
- 阅读 CSV 默认字段：`title, level, category, content, translation, source, tags`。
- 阅读必填字段：`title`、`content`。
- 阅读导入按 `title + level` 去重；tags 支持 `|`、`,`、`;`、`，` 分隔。

## 当前已知风险

- `resetProgress` 会调用 `storage.clearProgress()` 清除学习进度、错题、复习计划和统计历史，但会保留账号、主题、语音设置和自定义词。
- 进度合并以数组去重和对象浅合并为主，`wordProgress` 同一单词的冲突会以后写入对象覆盖。
- Worker 发送验证码依赖 Resend；本地或测试环境若缺少环境变量，登录链路会直接失败。
- CSV 解析器是自实现，不支持复杂 Excel 方言或分号分隔文件。

## 下一步建议

- 继续加大量词库前，考虑把 `public/data/vocabulary.json` 按类别、Level 或 List 分片，减少 PWA 更新时必须重新预缓存的单文件体积。
- 为阅读 CSV 导入补充最小单元测试，覆盖重复、缺字段、tags 分隔和带引号换行内容。
- 如需更强多端同步语义，为 `wordProgress` 增加单词级 `updatedAt`，再按单词更新时间解决冲突。
