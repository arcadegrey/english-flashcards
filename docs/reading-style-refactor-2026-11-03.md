# 阅读组件与全局样式拆分（2026-11-03）

本批整理两项高优先级维护点：阅读正文组件和全局设计系统样式。保持现有界面、共享 AppLayout、DOM 类名、导航、词库、录音、账号隔离、草稿、历史、作业和学习行为。没有 Worker／数据库变更、存储键变更或数据迁移；正常前端构建即可交付。本批已完成本地验证，现按用户要求提交并推送；生产发布状态以对应 GitHub Actions 自动部署回执为准。

## 阅读职责

`src/components/ReadingSessionView.jsx` 从 698 行减到 321 行。仍负责草稿与历史 hooks、答案、普通阅读／错题重做／班级作业的完成流程、成绩总结状态、同步、翻译状态以及逐句播放生命周期。六个原控制事件函数（完成、选答案、认识／不认识、同步、首句朗读）与原源码一致。

新组件位于 `src/components/reading/session/`：

| 文件 | 职责 |
| --- | --- |
| `ReadingArticle.jsx` | 元信息、正文分词／高亮、逐句按钮和翻译展示。 |
| `ReadingQuestions.jsx` | 题目、选项、反馈和禁用状态；通过回调更新父级答案。 |
| `ReadingSessionSidebar.jsx` | 共享 QuickMenu、同步入口、难词统计与进度。 |
| `ReadingSessionActions.jsx` | 原底部真实操作按钮、文案和禁用条件。 |
| `ReadingCompletionSummary.jsx` | 完成总结展示。 |
| `ReadingWordDialog.jsx` | 单词详情加载、原 GSAP 动画、发音与学习标记入口。 |

没有复制草稿／历史／提交状态到子组件。单词弹窗以可空词条持续挂载，保留详情重试和动画清理；正文选择词条前仍停止当前句子。加载／错误外层继续阻止不完整文章创建阅读会话。保留原作业首次成绩锁定和重做不覆盖原成绩的规则。

## 样式边界与层叠顺序

`src/design-system/tokens.css` 从 5004 行变为 13 行兼容导入入口，原 `index.css` 引入位置保持不变。按原先连续区段拆分，避免重新分组改变覆盖优先级：

| 顺序 | 文件 | 内容 |
| --- | --- | --- |
| 1 | `foundations.css` | 浅／深色设计变量。 |
| 2 | `app-shell.css` | 共享布局、桌面侧栏、顶栏与基础容器。 |
| 3 | `hero.css` | Hero、装饰和圆形进度。 |
| 4 | `controls.css` | 按钮、图标按钮与通知标记。 |
| 5 | `module-cards.css` | 模块／状态／统计卡、线性进度与激励带。 |
| 6 | `training.css` | 词分类面板、训练入口和今日计划总结。 |
| 7 | `reading-picker.css` | 阅读级别、文章列表与对应深色覆盖。 |
| 8 | `statistics.css` | 统计页面与图表。 |
| 9 | `exam.css` | 测试范围／模式页面；开头保留原位置的移动 chrome 默认隐藏规则。 |
| 10 | `study-plan.css` | 计划设置及原先位于其后的测试／计划焦点和深色覆盖。 |
| 11 | `responsive.css` | 原先 1180／900／560px 响应式覆盖，顺序不变。 |
| 12 | `mobile.css` | 原先最后一组 640px 移动覆盖及其嵌套规则。 |

十二份文件保持全局同步加载，没有改成页面懒加载。PostCSS 对照确认 477 个顶层节点、完整嵌套规则、声明值和顺序一致；构建后 14 份 CSS 与基线逐字节相同。最大新样式文件为 811 行，没有把原文件整体搬到另一个大文件。

## 验证

- 全量 Node 测试：482／482；无失败、跳过。
- Lint、生产构建、缓存／启动与阅读包体预算、6 项跨时区检查通过。保留原有大 chunk 提示。
- 页面对照：九种页面共 22 组，包括今日计划、训练中心、阅读选择器、阅读正文、背词、测试、统计、计划设置和复习集合；覆盖 320／390／1440px、浅／深主题。真实文本、DOM 及所有后代的 19 项计算样式一致，无横向溢出或 pageerror。首页首次对照存在装饰图片异步插入时机差异，等待资源稳定后四组重新对照均一致；没有因此修改加载行为。
- 新增固定 `scripts/check-reading-session-browser.mjs` 并纳入现有浏览器 CI。22 项通过：翻译双入口、句子开始／停止、选词中止播放、单词学习标记、刷新后重新进入恢复草稿、完整答题才允许保存、历史记录、防重复保存、重做创建子记录且原成绩不变、320／390／1440px、真实 Worker 的作业发布／服务端评分、提交禁改和重新进入保留首次结果。
- 新浏览器检查只访问本机回环服务器、虚构邮箱和一次性 SQLite。逐句语音以受控平台替身检查播放状态及取消所有权，不宣称进行了新的真人发音实听或生产账号验收。
- 最终完整浏览器 CI：37 项交付＋24 项真实双构建 PWA 升级＋24 项密码流程＋22 项阅读检查，合计 107 项通过。Worker dry-run 和 `git diff --check` 通过，未执行部署。

固定命令：

```bash
npm test
npm run lint
npm run build
npm run performance:audit
TZ=America/Los_Angeles node --test tests/study-date.test.mjs tests/study-day-subscription.test.mjs tests/vocabulary-merge.test.mjs
PLAYWRIGHT_CHANNEL=chrome npm run test:browser
WRANGLER_SEND_METRICS=false npx --no-install wrangler deploy --dry-run
```

基线源码／构建、CSS 对照、页面对照脚本、截图和日志保存在忽略目录 `output/playwright/reading-style-refactor/`；固定 CI 结果保存在 `output/browser-ci/`。没有引入新的运行依赖。
