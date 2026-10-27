# 全站共享等待动画（2026-10-27）

## 当前范围

按用户要求，将登录账号后的三色圆点轨道动画用于应用各处的真实加载等待。保留原有轨道、蓝绿琥珀点、中心呼吸球与底部三段流动条；不新增素材或动画依赖。

- 新增 `LoadingState` 与 `LoadingAnimation`，共用同一套 CSS。提供整页、区域、覆盖层和行内显示；按钮使用 24px 轨道。完整动画保留登录时的欢迎文案，其他场景使用实际任务文案。
- 登录／注册过渡直接复用共享组件；应用首次词库加载、懒加载页面、账号面板和语音面板接入。
- 词库准备、托福／雅思 List 下载、测验／填空／拼写题目、单词例句、阅读词汇弹窗、展开学习提示、收藏补载接入。已有收藏词卡在补载时继续显示；只有没有词条时显示完整等待面板。
- 账号请求、同步按钮、阅读／词汇作业草稿恢复与提交、阅读／考试历史同步接入。同步 toast 在请求未结束时持续显示，不再按普通提示的 1.6 秒时长提前关闭。
- 今日计划任务准备、周目标／统计恢复、课堂／学生记录／周报／作业／提交情况接入。后台排队、普通空状态和错误提示保留实际状态，不因为“等待学生加入”或离线待同步就持续播放加载动画。
- 共享样式直接加载；深色首次启动不依赖之后才下载的单词学习样式。保留原 `prefers-reduced-motion` 降低动效规则，所有新状态使用真实组件。

## 兼容与发布

仅前端加载展示及请求中提示的显示时长调整。List 下载计数只用于展示现有请求状态，不改变请求、缓存、学习范围、抽题、评分或同步逻辑。学习提示 hook 额外暴露其现有等待状态供 UI 使用。

不改词库、稳定 ID、音频、账号隔离、路由、学习记录格式、云同步协议、Worker 或 D1。保留原成功／失败分支与重试入口；没有新增强制等待时间。只需发布完整前端 dist；无迁移或 R2 上传要求。本轮以单一 Git 提交更新 main；该分支更新会触发既有质量检查与 Cloudflare 自动部署，实际部署结果以 Actions 为准，生产账号验收仍待完成。

## 验证

- 完整现有 `npm test` 247/247 通过；未为纯 UI 变更增加实现镜像测试。
- 最终 lint、生产构建／PWA、`git diff --check` 通过。保留现有大 chunk／Browserslist 提示。
- 隔离 Chromium 169 项组件／异步检查：320／390／1440px、浅深主题，完整／行内／按钮／账号／收藏／考试等待，边界无溢出，按钮禁用与正常操作、减少动态效果、四种课堂网络错误恢复、例句／提示完成及登录请求失败重试。
- 真实 App 10 项检查：冷启动词库、懒加载账号／学习页、原登录覆盖层文案、网络失败回到原登录表单、托福 List 等待与完成、390px 学习页、学习记录不变及无未捕获错误。
- 本机生产预览 9 项：1440／390px、浅深主题的冷启动等待与完成退出，无未捕获错误。未宣称完成真实 PWA 离线、Safari、真实手机或已登录生产账号验收。
- 已缓存收藏补载 5 项：1440／390px 原词卡保持可见并显示行内轨道，无未捕获错误。共 193 项浏览器断言。
- 已查看生产构建手机浅深主题、原登录覆盖层及行内按钮截图。验收使用隔离浏览器与本机拦截 API，没有发送验证码、注册或访问生产账号。
- 临时夹具、脚本、日志及截图位于忽略目录 `output/playwright/shared-loading-*`，不进入发布内容。

## 变更文件

- `PROJECT_CONTEXT.md`
- `docs/shared-loading-animation-2026-10-27.md`
- `src/App.jsx`
- `src/components/AuthPanel.jsx`
- `src/components/ClassroomView.jsx`
- `src/components/ExamPracticeView.jsx`
- `src/components/FillBlank.jsx`
- `src/components/LearningView.jsx`
- `src/components/PlanSettingsView.jsx`
- `src/components/Quiz.jsx`
- `src/components/ReadingSessionView.jsx`
- `src/components/SpellingTest.jsx`
- `src/components/StudyMomentum.jsx`
- `src/components/ToeflSelectionView.jsx`
- `src/components/VoiceSettings.jsx`
- `src/components/WordCard.jsx`
- `src/components/WordCollectionView.jsx`
- `src/components/assessment/ExamHistoryPanel.jsx`
- `src/components/classroom/ClassWeeklyReport.jsx`
- `src/components/classroom/ReadingAssignments.jsx`
- `src/components/classroom/StudentProgressPanel.jsx`
- `src/components/classroom/WordAssignmentSession.jsx`
- `src/components/home/AccountProgressSummary.jsx`
- `src/components/home/StudyDashboardPanels.jsx`
- `src/components/reading/ReadingReviewPanel.jsx`
- `src/components/statistics/WeeklyLearningOverview.jsx`
- `src/components/ui/Buttons.jsx`
- `src/components/ui/Cards.jsx`
- `src/components/ui/LoadingState.jsx`
- `src/hooks/useWordHints.js`
- `src/index.css`
- `src/styles/loading-state.css`
- `src/styles/word-learning-refresh.css`
