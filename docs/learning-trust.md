# 学习可信度修复（2026-10-23）

## 学习提示与词义显示

- 移除按前三个字母拆分的“词根词缀”和将中文释义片段当成近义词的提示。
- 保留“显示提示”操作和原有提示区域。未纳入核验内容的词使用词义回顾、例句练习和回忆练习；已核验内容现覆盖 3000 词，提供具体用法及近义／易混辨析，其中 47 词提供构词／词族说明，见 `core-word-notes.md`。扩充批次的逐组来源与分类覆盖率见 `word-notes-coverage.md`。
- 缺少释义、例句或译文时不补造内容。词义显示清理字面的 `\n`，已有词性时不重复添加词性；不改写词库或音频源数据。

## 收藏

- 单词卡星标按词 ID 显示真实收藏状态；单词卡和账号面板可进入“我的收藏”。收藏集合复用 `WordCollectionView`、`AppLayout` 和全站导航。
- 收藏不改变单词学习状态、复习安排、错词或日统计。取消收藏不删除学习记录。
- 本机存储 `flashcards_word_bookmarks`，纳入现有账号缓存归档／恢复。访客仅在本机保存，正常登录时沿用访客学习数据合并；不同已登录账号之间不合并。
- 云端使用既有 `user_progress.preferences.wordBookmarks`，形如 `{ "123": { "saved": true, "updatedAt": "..." } }`。
- 每词独立比较时间戳；取消收藏保留 `saved:false`，相同时间优先取消，避免旧设备或旧请求恢复已取消记录。收藏更新时间不改写计划设置版本。
- 旧客户端省略收藏字段时，更新后的 Worker 保留云端收藏。收藏不进入老师的学生进度响应。
- 先写本机，再展示成功；存储写入失败显示错误，星标不变。离线收藏沿用进度待同步及恢复联网重试流程。
- 收藏集合按需加载完整词库，支持新设备恢复尚未加载的 TOEFL/IELTS 收藏；加载失败可重试，未匹配的收藏 ID 保留并显示数量。

## 学习状态口径

- 原“已掌握”统一显示为“标记认识”。测试范围、个人统计、阅读难词、账号面板及老师查看的状态保持一致。
- 认识标记来自自评或现有练习结果，不代表经过验证的长期记忆；认识标记集合和统计页说明这一边界。
- 保留 `masteredWords` 等原存储字段、原有历史、复习算法与练习行为。本轮没有引入任意次数阈值或长期掌握评分。
- 集合页“不认识／认识了”都接入实际回调；缺少回调时显示无法更新，不再只弹成功提示或跳过卡片。

## 部署

- 不新增数据库列或表，无额外数据迁移，无旧记录重写。
- 需发布更新后的 Worker 和前端。虽然 Worker 入口文件未改，`shared/planPreferences.js` 及其新依赖必须随 Worker 重新打包发布。
- 旧 Worker 不认识收藏字段，不能仅上线新前端；使用现有 Worker + 静态资源部署流程一同发布。
- 本轮只做本机验证，未操作生产数据库或发布线上版本。

## 验证

- `tests/learning-trust.test.mjs`：提示数据边界、词义格式、收藏取消与冲突、计划设置独立性、账号隔离、存储失败、旧客户端兼容、服务端鉴权及老师不可见收藏。
- 本机最终验收：`npm test` 91/91 通过，`npm run lint` 通过，`npm run build`（含 PWA 生成）通过。
- 本机浏览器使用内存 SQLite 和虚构账号：收藏、换词状态、刷新恢复、取消收藏、存储拒绝、离线保存／联网重试、新设备恢复、账号切换。
- 1440px 桌面和 390px 手机：学习卡、收藏集合、统计、阅读正文及老师学生详情无横向溢出；专属手机背单词页面保留横向三个动作且没有通用底部导航。浏览器验收无运行错误。
- 浏览器验收脚本与截图位于忽略的 `output/playwright/trust-*`。

## 变更文件

- `shared/wordBookmarks.js`
- `shared/planPreferences.js`
- `src/context/word-bookmarks-context.js`
- `src/utils/wordHints.js`
- `src/utils/storage.js`
- `src/App.jsx`
- `src/components/WordCard.jsx`
- `src/components/WordCollectionView.jsx`
- `src/components/AuthPanel.jsx`
- `src/components/LearningView.jsx`
- `src/components/ExamPracticeView.jsx`
- `src/components/Statistics.jsx`
- `src/components/StudyHub.jsx`
- `src/components/ReadingSessionView.jsx`
- `src/components/ClassroomView.jsx`
- `src/components/assessment/ExamHistoryPanel.jsx`
- `src/components/classroom/StudentProgressPanel.jsx`
- `src/styles/word-learning-refresh.css`
- `tests/learning-trust.test.mjs`
- `PROJECT_CONTEXT.md`
- `docs/learning-trust.md`
