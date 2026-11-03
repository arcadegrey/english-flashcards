# 页面装配与背词展示拆分（2026-11-03）

继续整理 `AppPages.jsx` 和 `LearningView.jsx`。本批以已推送的 `4249cdd` 加上一批本地 Worker／storage 拆分为基线；保留上一批未提交修改，不回退、混入修改其业务逻辑。未调整设计、CSS、页面导航、账号隔离、学习事件、词库准备、存储、同步或后端协议。无需迁移、新环境变量或运行依赖。两批已完成本地验证，现按用户要求一并提交并推送；生产发布状态以对应 GitHub Actions 自动部署回执为准。

## 页面装配

`src/components/app/AppPages.jsx` 从 510 行降为 37 行，只判断当前 view 并调用以下纯装配函数：

| 模块 | 职责 |
| --- | --- |
| `DashboardPages.jsx` | 今日计划、训练中心、计划设置和统计。 |
| `LearningPages.jsx` | 单词学习、阅读会话和测试选择入口。 |
| `ClassroomPages.jsx` | 班级入口、词汇作业及无活动作业时的原回退页面。 |
| `VocabularyDirectoryPage.jsx` | 托福 Level／List、雅思主题／List；集中原来重复的准备、同步、chrome 参数。 |
| `WordCollectionPage.jsx` | 收藏、今日复习、错题、已学习、认识标记；集中原来重复的导航、同步、chrome 参数。 |
| `pageComponents.jsx` | 原有稳定 React.lazy 类型，继续复用既有准备加载器。 |

装配函数只接收 feature 对象并返回原页面 element，不增加 React 路由包装层，避免词集合或目录之间切换时多卸载一次。原 key、参数缺省／省略、事件回调和未知 view 返回 null 的行为保留。学习事件、请求和状态继续属于原 feature hooks。没有新增路由框架或页面配置系统。

## 背词展示

`src/components/LearningView.jsx` 从 429 行降为 249 行，继续拥有提示和 toast 状态、范围／目标／统计派生、导航和同步回调、原 GSAP 作用域，以及原测试容器、惰性加载与 `mode:category:scope` key。

| 展示组件 | 职责 |
| --- | --- |
| `components/learning/WordStudyWorkspace.jsx` | 原手机学习头部、今日目标条、加载提示和带原 key 的 WordCard。 |
| `components/learning/WordStudyActions.jsx` | 不认识／提示／认识了三个真实按钮。 |
| `components/learning/WordStudySidebar.jsx` | 桌面同步、QuickMenu、学习统计和本周打卡。 |

这些组件不新增学习状态、effect、请求、存储或 chrome。WordCard 继续负责原有详情／提示数据和收藏行为。手机仍使用专用学习布局，桌面侧栏和通用手机导航仍隐藏，底部三动作横向排列。原基础／学习／测试 CSS 的加载归属和顺序不变。

## 验证

- 临时对照执行原 AppPages 与新装配函数：19 个分支（含未知 view），各八种账号／模式／加载／错误变体，共 152 组页面类型、key、参数和 children 一致；1116 次真实装配回调的调用目标、参数与顺序一致。覆盖作业有／无会话、收藏错误／加载、目录退回、错词标记和测试重试。
- LearningView 的全部参数／默认值及拆分前展示段之前的 30 条控制器语句，其语法树与原版一致。原提示清理、学习事件、同步和动画逻辑未改写。
- 全量 Node 回归 490／490，通过且无跳过；其中上一批新增的八项 Worker／storage 回归继续保留。
- 新增 `scripts/check-learning-pages-browser.mjs`，纳入现有浏览器 CI。30 项通过：提示打开／下一词清理、收藏重渲染保留词卡与提示、两种学习动作各记一次、320／390／430px 专用 chrome／隐藏桌面状态／三按钮横排／无溢出、模式切换及测验续答、单次结果保存、托福／雅思 List 返回和浏览不改学习数据、复习入口与手机切页滚动复位。
- 完整浏览器 CI 137 项通过：37 交付＋24 真实双构建 PWA 升级＋24 密码＋22 阅读＋30 学习／目录。检查使用隔离本机浏览器、访客数据和既有一次性数据库环境，不访问生产账号或发送真实邮件。
- 视觉／样式对照共 40 组：今日计划、训练中心、阅读选择器、阅读正文、背词、测试选择、统计、计划、复习、托福 Level／List、雅思主题／List、测验／填空／拼写／连线／句子听写。覆盖 320／390／1440px、浅／深主题，文本、DOM 和所有后代 19 项计算样式一致，无横向溢出或 pageerror。背词桌面／手机对照截图已人工核对。
- Lint、生产构建、缓存／启动与阅读预算、6 项跨时区、Worker dry-run 及 `git diff --check` 通过；14 份构建 CSS 与本批基线逐字节相同。保留原有大 chunk 提示。

固定验证命令：

```bash
npm test
npm run lint
npm run build
npm run performance:audit
PLAYWRIGHT_CHANNEL=chrome npm run test:browser
TZ=America/Los_Angeles node --test tests/study-date.test.mjs tests/study-day-subscription.test.mjs tests/vocabulary-merge.test.mjs
WRANGLER_SEND_METRICS=false npx --no-install wrangler deploy --dry-run
```

原源码与构建基线、页面参数／回调对照、浏览器矩阵和截图位于忽略目录 `output/playwright/app-learning-refactor/`。最终 CI 报告保存在 `output/browser-ci/`。后续正常构建发布即可交付；回退本批只需还原对应前端代码，无需处理账号数据或数据库。
