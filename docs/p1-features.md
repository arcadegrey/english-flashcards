# P1 功能交接

## 班级词汇作业

- 老师在“教学班级 → 布置作业”切换阅读 / 词汇作业。
- 词汇范围使用全部 / 日常 / 四级 / 六级 / 托福 / 雅思词库，按当前完整词库的稳定顺序选择起始序号和词数，每次 5–50 词。
- 发布时固定词汇、选项、答案和范围，后续词库更新不会改变已发布作业。
- 学生在今日计划和我的班级查看任务，完成词义测验后提交。答案按账号与作业分别保存在本机并同步云端，重新进入可续答。
- 服务端按发布快照评分，只有当前成员能提交；首次成绩固定，重试不覆盖，逾期允许补交。老师查看当前成员的未完成 / 逾期 / 已提交 / 补交及分数。
- 词汇作业成绩独立于个人学习计划，不自动把整组词标为已掌握，不改写个人词库、目标或复习队列。

## 阅读历史和错题本

- 入口：训练中心现有阅读面板下方“阅读复盘”，不新增独立阅读列表页。
- 自主阅读完成全部题目后点击“保存本次练习”；每次练习单独记录，保留文章、每题所选答案、正确答案和解析快照。同日多次练习不会重复增加原有文章级日统计。
- 新提交的班级阅读作业也加入个人复盘，原作业首次成绩保持固定。
- “阅读错题”按同一原题最近一次练习结果判断是否还需巩固；“只重做错题”只呈现所选历史记录中答错的题，生成独立成绩，保留原记录。
- 展示最近 100 次练习；服务端保存历史，读取最近 100 次。本机同样保留最近 100 次，待同步达到 100 次会要求先同步，避免静默丢弃尚未同步的练习。
- 自主练习保留作答时的文章版本，包括离线完成后才同步的情况；个人快照不参与班级作业评分，班级成绩始终按服务端发布快照计算。
- 先保存本机再同步，失败保留待同步队列，可手动“同步历史”，恢复联网后自动重试。新设备可恢复当前账号的历史。
- 访客历史只在本机保存，与登录账号分开；旧的文章级汇总没有逐题信息，不凭空补写答案。新保存的练习才有逐题复盘。
- 自主阅读和错题练习使用独立草稿；未提交的班级作业草稿仍不向老师展示。

## 内容扩充

- 新增 8 篇原创基础故事：A1 4 篇、A2 4 篇，每篇 3 道选择题与中文解析。
- 原有 5 篇 B1 文章各补 3 题；保留原文章 ID，兼容已有进度与作业快照。
- 当前共 26 篇，19 篇带题，69 道题；B1 5 篇、B2 11 篇、C1 2 篇。
- CEFR 等级为编辑估计，不代表官方考试认证。新增内容和题目均为原创。

## 数据和部署

新增表（仅新增，不删除或重写已有学习数据）：

- `word_assignments`
- `word_assignment_submissions`
- `word_assignment_sessions`
- `reading_attempts`

2026-10-21 已按用户要求执行生产 D1 迁移并核验，详见 `d1-p1-deployment.md`；Worker 和前端仍待部署。后续上线沿用先 `npm run d1:migrate`、再部署 Worker 和前端的顺序，`worker/schema.sql` 可重复执行。开发和测试使用本机 / 内存数据库。

服务端词库快照目录由 `npm run words:assignment-catalog` 生成；`npm run build` 的 prebuild 同步刷新，防止词库导入后前后端范围不一致。生成文件必须与完整词库一起提交。

主要新增 API：

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| GET / POST | `/api/classes/:id/word-assignments` | 所属老师查看 / 发布词汇作业 |
| GET | `/api/word-assignments` | 当前学生的词汇作业 |
| GET / PUT | `/api/word-assignments/:id/session` | 当前学生的作业草稿 |
| POST | `/api/word-assignments/:id/submit` | 服务端评分并固定首次成绩 |
| GET | `/api/word-assignments/:id/submissions` | 所属老师查看当前成员成绩 |
| GET / POST | `/api/reading-attempts` | 当前账号的逐次阅读历史 |

所有接口沿用 HttpOnly 会话，并校验可选的 expected-user 请求头。词汇作业检查角色、班级归属和当前成员关系；阅读历史仅本人可读写。重做引用原记录的快照，不接受他人的原记录。

## 验证

- `npm test`：新增词库范围、快照与评分、成员撤销、草稿恢复、历史隔离、错题重做、内容完整性测试。
- `npm run lint`、`npm run build`。
- `wrangler deploy --dry-run`：仅验证 Worker 打包，不发布。
- 本机老师 / 学生浏览器流程与 1440px 桌面、390px 移动布局验证。

## 本轮变更文件

作业与页面接入：

- `src/App.jsx`
- `src/components/ClassroomView.jsx`
- `src/components/HomeScreen.jsx`
- `src/components/ReadingSessionView.jsx`
- `src/components/classroom/ReadingAssignments.jsx`
- `src/components/classroom/WordAssignmentSession.jsx`
- `src/components/reading/ReadingReviewPanel.jsx`
- `src/components/reading/readingPickerModel.js`
- `src/styles/classroom.css`
- `src/utils/classroomApi.js`

历史、草稿与共享规则：

- `shared/wordAssignments.js`
- `shared/readingAttempts.js`
- `src/hooks/useReadingDraft.js`
- `src/hooks/useReadingAttempts.js`
- `src/utils/readingAttempts.js`

内容、服务端与构建：

- `src/data/readings.js`
- `src/data/foundationReadings.js`
- `worker/index.js`
- `worker/schema.sql`
- `worker/readingAssignments.js`
- `worker/wordAssignments.js`
- `worker/readingAttempts.js`
- `worker/data/assignment-vocabulary.json`
- `scripts/build-assignment-catalog.mjs`
- `package.json`

测试与交接：

- `tests/p1-features.test.mjs`
- `PROJECT_CONTEXT.md`
- `plan.md`
- `docs/project-reference.md`
- `docs/classroom-system.md`
- `docs/p1-features.md`

本机验收：71 项自动测试、lint、前端生产构建、Worker dry-run 打包通过。师生发布/续答/提交/查看成绩、阅读错题重做、新设备历史恢复、离线保存/刷新/重试同步已通过浏览器检查；1440px 桌面与 390px 手机无横向溢出，无浏览器运行错误。截图存于忽略的 `output/playwright/p1-*.png`。2026-10-21 已完成生产 D1 迁移；Worker 与前端尚未在本次操作中部署，详见 `d1-p1-deployment.md`。
