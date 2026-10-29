# App 职责拆分（2026-10-28）

## 已实施

本轮按维护边界拆分 `App.jsx`，保留原有组件、样式、导航状态、学习事件和同步协议。主文件由 3003 行减至 2418 行。

| 文件 | 职责 |
| --- | --- |
| `src/utils/vocabularyCatalog.js` | 托福 Level/List、雅思主题/List 的目录投影，分类交集筛选及标题。纯函数，不读取存储、不加载分片、不写学习状态。 |
| `src/hooks/useVocabularySelection.js` | 目录、筛选和标题的 React memo 边界；保留原依赖和结果引用稳定性。 |
| `src/hooks/useNavigationHistory.js` | 浏览器初始历史、push/pop 去重、前进后退恢复、旧 readingList 入口兼容及切页滚动复位。导航 state 和 setter 仍归 App。 |
| `src/components/account/AccountModal.jsx` | 原账号弹窗结构、AuthPanel 懒加载、焦点循环、Esc/遮罩关闭、滚动锁定与焦点恢复。登录、注册、退出和同步动作由 App 传入。 |

没有为了缩短文件而另建通用框架或全局 store。账号弹窗关闭回调保持稳定，避免父组件更新时重复安装焦点处理或覆盖表单焦点。共享 AppLayout、sidebar/topbar、页面内容和视觉样式不变。

## 兼容边界

- 目录继续以 manifest 为优先，保留自定义标签、路径、数字排序、unknown 桶、501–800 旧托福 ID 及雅思多 List 交集规则。
- 雅思目录的 total 是 List 成员计数，可能大于去重后的词数，本轮不改变其原有口径。
- 浏览器历史仍使用 `english_flashcards_navigation_v1`，不增加存储键；有效历史恢复仍清除临时作业和错题重做会话；外部历史仍返回今日计划；旧 `readingList` 仍打开训练中心的阅读面板。
- 不调整账号隔离、草稿、成绩、收藏、词库加载、学习算法、Worker 或 D1。无需迁移，仅需正常前端构建发布。本轮按用户要求合并为本地 Git 提交，未推送或部署。

## 验证

- 新增 `tests/vocabulary-catalog.test.mjs`：8 项持久化回归，覆盖旧托福 ID、未分组、manifest 优先、自定义主题、旧雅思目录格式、多 List 交集、空范围和标题。使用冻结夹具检查不修改输入，并检查真实目录的每一个 List 数量。
- 全量 `npm test`：255/255 通过。
- 拆分前后实际函数对照：8699 条真实词库、manifest/无 manifest、分类/Level/List/主题组合，共 1126 次结果与标题比对通过。一次性脚本与原文件备份在忽略目录 `output/refactor/`，不把旧源码副本作为维护中的测试依赖。
- lint、完整生产构建/PWA、`git diff --check` 通过；保留既有构建 chunk 大小提示。
- 浏览器验收完成后在此补充范围。

## 后续维护顺序

1. `App.jsx` 的认证同步协调与本机进度仍为最大的耦合部分。下一批应让同一个协调 hook 拥有 session、队列、定时器、版本号和迟到响应校验，不能只把函数搬走再暴露大量 setter。先固定延迟响应、请求期间学习、清空、离线重试和账号切换的浏览器回归。
2. 学习事件、每日统计和复习计划可在同一职责中整理，必须保留北京时间日期、旧汇总、日计数合并及退役 ID 规则。
3. `ReadingSessionView.jsx`（660 行）可优先按正文、题目区、学习侧栏拆展示组件；草稿、作业提交和首次成绩锁定仍应保持单一所有者。
4. `worker/index.js`（651 行）可单独整理认证和进度路由，保留现有鉴权、expected-user、CAS 与旧客户端兼容，不与界面拆分一起进行。

已有边界问题：无 manifest 的雅思目录回退路径原来读取单数 `list`，而元数据返回 `lists`，会聚合到未分组。本轮按行为一致保留；应作为独立修复覆盖目录加载失败及多 List 的回退语义，不与本次搬迁混在一起。

## 第二批：完整生命周期拆分

用户要求继续整理后，将认证同步、词库资源、学习事件、每日计划、导航和页面渲染从根组件分离。`App.jsx` 从本批开始的 2418 行降到 168 行，仅组合 feature hooks、共享 shell、providers 和全局弹窗。没有把剩余业务整体搬到另一个巨型文件。

| 新文件 | 所有权与边界 |
| --- | --- |
| `src/hooks/app/useLearningProgress.js` | 本机账号数据初始化、持久化、学习/阅读/测试事件、收藏、偏好及学习重置代次。 |
| `src/utils/learningEvents.js` | 日汇总和阅读首次完成的纯更新函数；保留 90 天、旧结果和北京时间口径。 |
| `src/hooks/app/useCloudProgressSync.js` | 同步队列、版本、上传/恢复、请求期间变更重放、延迟响应校验、1200ms debounce、网络恢复及监听清理。 |
| `src/hooks/app/useAccountSession.js` | 会话恢复、登录/注册/退出、账号缓存切换、账号弹窗状态和反馈。只在账号内部协调同步生命周期。 |
| `src/hooks/app/useVocabularyCatalog.js` | 核心词库、manifest、List 请求去重、加载/错误/重试、目录投影和收藏词补载。 |
| `src/hooks/app/useStudyOverview.js` | 阅读索引、真实今日/计划/集合派生数据、计划词库准备和明日预告。 |
| `src/hooks/app/useAppNavigationState.js` | 共享 view、mode、范围、阅读/作业会话及学习准备请求代次。 |
| `src/hooks/app/useStudyNavigation.js` | 跨模块入口、准备取消、学习前进/返回、阅读/作业入口；与原 history hook 配合。 |
| `src/hooks/app/useVocabularyNavigation.js` | 托福/雅思 Level、主题、List 的选择和学习动作。 |
| `src/components/app/AppPages.jsx` | 原有 screen props 和路由分支的组装；按 feature 对象传参，不拥有学习状态或发起数据请求。 |

本批移出的 hooks 约 38–392 行，页面组装约 490 行。同步的内部 refs 不暴露给根组件；收藏修改和考试范围失效通过所属模块的方法执行，页面不直接修改 hook 返回的对象。

### 初始化与时序

- 账号范围仍在本机 progress initializer 中先切换，再读取快照，随后才恢复登录。去掉原来 mount effect 中第二次逐字段回读和重复 setState；收藏初始化继续调用原有归一化 getter。
- `latestProgressRef` 在 layout effect 发布已提交的快照，早于 passive 同步 effect；云端合并和收藏操作仍同步更新 ref，保证进行中的请求看到最新本机结果。避免在 render 中写 ref。
- 学习/阅读事件先捕获北京时间日期，再进入 React 的 updater，防止跨午夜时将旧事件算入新一天。
- 所有移出作用域的稳定 ref/setter 均补入 effect/callback 依赖。同步状态 effect 保留一处有说明的局部 lint 例外：它根据外部网络和队列状态同步展示 pending，进度快照不变时不会重复触发。
- 初始学习数据来自同步读取的账号快照，`localDataLoaded` 在 hook 中即为 true；词库启动 loading 仍按原规则阻挡学习页面，未增加新的登录等待或数据存储格式。

### 本批验证

- 新增 `tests/learning-events.test.mjs` 6 项回归：日事件增量、旧汇总与分类计数保留、同日阅读结果不覆盖、90 天边界、北京时间跨午夜及只读输入。
- 全量 `npm test`：261/261 通过。
- 原 App 实际事件函数与新纯函数 320 组对照一致；脚本 `output/refactor2/compare-events.mjs`。首批词库模型保持不变。
- 最终 lint、生产构建/PWA 通过；保留既有大 chunk 提示。
- 真实 hooks 与隔离 API 夹具 19 项断言通过：冷启动云恢复、expected-account 请求头、延迟冲突响应下学习与收藏取消、上传期间重置后继续学习、离线持久化/恢复上传、切换账号后丢弃旧响应、缓存归档、退出/注册访客合并、503 本机保留与重试、401 恢复访客隔离。
- 真实应用页面 25 项与手机/生产构建 16 项断言通过：账号弹窗与焦点、原表单状态、托福/雅思目录到学习、前进后退、旧阅读入口、浏览不改学习记录、手机切页滚动、浅深主题、生产懒加载及桌面/手机无横向溢出。
- 词库资源与准备取消 8 项断言通过：启动失败显式报错、重试清错并加载核心词库、考试按需扩展、离页后迟到结果不导航/不声明全库已采用、随后正常开始计划学习、分类偏好持久化及范围复位；夹具无未捕获错误。本批浏览器断言合计 68 项。
- 脚本、夹具、日志及本批原文件备份均在忽略目录 `output/refactor2/`。夹具只拦截本机 API，不访问生产账号或发送真实验证码。

没有 Worker/D1/同步协议、词库内容、学习算法、CSS、资源或存储键迁移。本批按用户要求本地提交，未推送或部署。真实生产账号、多设备和 Safari/真实手机验收仍不在本轮本地验证范围内。

### 当前后续边界

前文“后续维护顺序”的第 1、2 项职责搬迁已由本批完成；继续细化时先补对应模块的独立行为验收。`ReadingSessionView` 和 Worker 路由仍可单独整理。本批保留前文记录的无 manifest 雅思目录回退问题，没有夹带修改其行为。

2026-10-29 后续：上述雅思目录问题已在独立维护批次修复，覆盖复数 `lists`、多 List 成员计数、未分组和真实全库对照；本次重构的历史验收范围不变。详见 `css-boundaries-and-maintenance-2026-10-29.md`。
