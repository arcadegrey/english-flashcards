# P2：班级周报、测试成绩与学习反馈

## 自主测试成绩闭环

- 测验、填空、拼写、配对共用逐次测试记录。每组最多 20 次答题，支持“结束本次”和“再练一组”；配对按每次尝试计数，包括答错后的重试。
- 每次作答保存本机草稿，按账号、模式、计划词库和测试范围隔离。刷新后通过测试入口进入相同模式／词库／范围，可恢复已答数量；原有刷新回到今日计划的导航行为不变。
- 草稿不共享给老师。结束一组后先保存本机，再上传云端。恢复联网自动重试，也可在测试页点击“同步成绩”。成绩在新设备登录后恢复。
- 测试页“我的测试成绩”和老师“教学班级 → 学生学习记录 → 测试成绩”展示最近 100 次已完成练习，可展开查看词汇、正确／需巩固状态及拼写输入。
- 自主练习允许提示和重试，用于学习反馈；班级作业仍使用独立的首次提交成绩。
- 服务端根据当前词库及该账号已同步自定义词重新比较答案，不接受客户端传入的分数或正确标记。同一账号、同一记录 ID 只保存一次，重试不覆盖原成绩。
- 本机最多保留 100 次，待同步成绩优先保留。达到 100 条待同步记录时要求先同步，避免静默丢失。
- 访客记录与登录账号分开，不自动迁入账号。旧日汇总没有逐次答案，不补造旧测试成绩；保存测试记录不再次增加日级答题计数。
- 测试范围在一组练习中固定，避免答对后更新已学习／已掌握状态导致题库重置。

## 老师班级周报

- 教学班级的当前班级内展示本周与历史周，可切换上一周／下一周并手动刷新。
- 与现有 `studyHistory` 日期口径一致，按 **UTC 周一 00:00 至下周一 00:00** 统计，页面明确标注。作业截止时间仍按设备本地时间输入、UTC 保存。
- 汇总当前成员的活跃人数、练词次数、阅读完成篇次、阅读／自主测试加权正确率和保存的测试组数。日汇总包含尚未结束一组的自主答题，测试组数只计已保存的记录，两者用途不同。
- 作业口径为“本周到期作业 × 当前成员”，显示提交、补交、逾期未交人数；已退出或被移除的成员不计入周报。
- 常错词来自本周保存的自主测试及首次词汇作业提交，按答错学生数、错误次数排序。未结束草稿与未共享的自定义词不进入推荐。
- 阅读薄弱点来自已保存逐题历史及已提交阅读作业。按每名学生同一原题在本周最近一次作答汇总，错题重做答对后不继续计为薄弱；同一次班级作业及其个人复盘不重复计数。
- 旧记录只有文章级汇总时，展示已有统计，不推算逐题薄弱点。日汇总仍沿用最近 90 个学习日的保留规则；较早历史周可能只有保留的逐次测试／阅读明细，不能视为完整周数据。
- 从常错词准备指定词汇巩固，预览全部词汇、补充词数量与截止时间后发布。不足 5 个错词时补充词库词，确保至少 4 个不同释义。
- 从阅读薄弱题准备原文章的阅读作业，确认截止时间后发布。发布沿用原作业鉴权、快照、首次成绩和补交逻辑，学生在原任务入口接收。

## 轻量游戏化反馈

- 今日计划新增每周小目标：每周学习 5 天。新词、复习、阅读或自主测试任一真实活动计为学习日，一天只计一次。
- 连续学习里程碑为 3／7／14／30／60／90 天，与当前可核验的历史保留范围一致。
- 今日新词、阅读、考试巩固、整日计划、周目标与里程碑完成时，复用已有庆祝效果；系统减少动态效果偏好下不播放动画，文字反馈保留。
- 完成提醒按账号和任务／日期在本机去重。新设备可能再显示一次已有成就；不写入积分、排行榜或虚构成就，不修改原学习记录。

## 接口、权限与部署

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET / POST | `/api/exam-attempts` | 当前账号逐次自主测试历史／保存 |
| GET | `/api/classes/:id/weekly-report?week=YYYY-MM-DD` | 所属老师的当前成员周报 |
| GET | `/api/classes/:id/students/:studentId/progress` | 在原响应中增加最近 100 次 `examAttempts` |
| POST | `/api/classes/:id/word-assignments` | 兼容原范围参数，增加可选 `wordIds`（5–50 个不同词） |

所有接口沿用 HttpOnly 会话和 expected-user 请求头。读取学生成绩及周报须验证老师角色、班级归属和当前成员关系。退班不删除个人成绩，只撤销老师的访问。

新增 `exam_attempts` 表和 `idx_exam_attempts_user_date` 索引，均为幂等新增，不修改旧学习数据。上线顺序：

1. `npm run d1:migrate`
2. 部署 Worker 与前端（原 GitHub Actions 流程仍按此顺序执行）。

2026-10-22 已按用户要求完成生产 D1 迁移并核验，见 `d1-p2-deployment.md`。Worker 与前端未部署；Git 推送由用户手动完成。原 GitHub Actions 可安全重复执行幂等 schema 步骤。

## 验证

- `tests/p2-features.test.mjs`：四种模式评分与输入校验、重复保存、角色与跨账号鉴权、成员撤销、UTC 周边界、加权统计、阅读错题恢复、指定薄弱词作业、离线重试、待同步保护、多实例缓存合并、存储失败及成就计算。
- 本机浏览器使用内存 SQLite 和虚构师生账号，验收脚本和截图位于被忽略的 `output/playwright/p2-*`，不使用生产账号。
- 2026-10-22 本机验收：85 项自动测试（含 14 项 P2）、lint、前端生产构建、Worker dry-run 打包通过。
- 浏览器已验收四种题型、刷新后重新进入续答、20 次自动结束和新一组重置、离线保存与恢复联网重试、新浏览器恢复云端历史、老师成绩页、周报切周、词汇／阅读巩固发布、里程碑提醒去重及减少动态效果偏好；1440px 桌面与 390px 手机无横向溢出，修复重复组件 key 后验收流程无运行错误。

## 主要变更文件

- 成绩共享规则：`shared/examAttempts.js`。
- 成绩存储与同步：`src/utils/examHistory.js`、`src/context/ExamHistoryProvider.jsx`、`src/context/exam-history-context.js`、`worker/examAttempts.js`。
- 测试页面：`src/components/assessment/AssessmentSession.jsx`、`ExamHistoryPanel.jsx`，以及 `LearningView.jsx`、`ExamPracticeView.jsx` 和四个题型组件。
- 周报：`shared/weeklyReport.js`、`worker/weeklyReport.js`、`src/components/classroom/ClassWeeklyReport.jsx`。
- 作业与班级：`shared/wordAssignments.js`、`worker/wordAssignments.js`、`worker/classroom.js`、`src/utils/classroomApi.js`、`ClassroomView.jsx`、`StudentProgressPanel.jsx`。
- 学习反馈：`shared/studyRewards.js`、`src/components/StudyMomentum.jsx`、`StudyHub.jsx`、`src/styles/study-momentum.css`。
- 接入与样式：`src/App.jsx`、`worker/index.js`、`worker/schema.sql`、`src/styles/classroom.css`。
- 测试与交接：`tests/p2-features.test.mjs`、本文件、`PROJECT_CONTEXT.md`、`plan.md`、`docs/classroom-system.md`、`docs/d1-p1-deployment.md`、`docs/d1-p2-deployment.md`。
