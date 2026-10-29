# 页面样式边界与小型维护（2026-10-29）

完成当前优化计划余下三项：按页面拆分样式、修复无 manifest 时雅思目录的 `list/lists` 回退错误、统一学习洗牌。保留现有布局、设计、词库内容、账号隔离、学习事件、草稿、成绩与同步。没有数据库／Worker／音频／用户存储迁移。

## 样式职责与加载顺序

原 `word-learning-refresh.css` 为 7238 行，包含许多不同页面。现在保留为兼容导入入口，声明分到以下文件：

| 文件 | 职责 |
| --- | --- |
| `app-base.css` | 先包含原 `index.css`，再包含一次 `study-core.css`；由 `main.jsx` 作为全局入口加载。 |
| `study-core.css` | 共享卡片、例句、进度、侧栏、动作和模式菜单基础规则，以及原卡片动画。 |
| `study-word.css` | 单词卡、提示、学习布局、移动专用学习 chrome，以及词集合中的单词卡变体。 |
| `study-reading.css` | 阅读正文、题目、词弹窗、状态栏与阅读动作；仍在其后导入原 `reading-question-options.css`。 |
| `study-catalog.css` | 托福／雅思目录、主题背景、旧分类样式；在 `vocabulary-selection.css` 后导入，保留原生产深色优先级。 |
| `study-assessment.css` | 四种测试、测试控制和反馈；由测试会话导入，仍配合原 `test-workspace.css`。 |
| `study-voice.css` | 语音设置弹窗，由 `VoiceSettings` 直接声明，避免依赖曾经进入学习页才有样式。 |
| `study-collection.css` | 学习／认识／错词／复习／收藏集合的工具、搜索、空状态和布局。 |
| `study-legacy.css` | 保留已无当前组件引用的旧首页样式，仅由兼容入口导入，没有恢复旧组件或旧路由。 |

基础规则不能依赖动态 CSS 插入顺序。原全局 reset 是未分层的，最终方案将基础规则直接拼接在原 reset 之后，并作为全局 CSS 先于页面加载；没有引入 CSS 层、提高选择器优先级、改写全局 reset 或添加新视觉规则。页面各自导入剩余样式，基础包不在每页重复内联。

拆分还保留了几个重要的原先优先级：共享例句及其深色覆盖在同一文件中；学习 main 的基础／响应式规则保持内部顺序；词集合的单词卡变体放在 WordCard 模块内，保持原深色卡片覆盖顺序；托福目录的旧深色覆盖仍晚于其现代目录基础样式。

一次性 PostCSS 对照审计确认：**1520 个选择器分支的声明值、important 标志、媒体条件均保留，两个关键帧定义一致**。混合选择器列表按实际归属拆开，可能在不同文件保留相同声明；没有依据单次覆盖率删除规则。完整兼容入口仍可供旧开发预览使用，应用页面不再导入它。

## 测试会话准备

- `LearningView` 继续拥有原模式、chrome 和参数，通过共享惰性 `AssessmentSession` 渲染四种测试。普通背词不再请求测试会话代码／测试样式或 `test-workspace.css`。
- 显式开始测试时调用 `loadLearningView(nextMode)`，并行准备基础学习容器、测试会话及原词库。所有准备成功且请求代次仍有效，才采用词库和导航；惰性渲染复用同一请求，保留完整词库与账号／范围取消门控。
- 原 CSS 失败恢复扩展到两个加载入口，同一失败 href 的重试共享一个 promise，避免重复替换链接。测试样式失败时保留原有错误／重试；不能进入未排版题目。
- 页面内模式菜单切换继续使用现有 Suspense／错误边界和真实组件。PWA 仍预缓存代码／CSS，离线可从背词切到此前未渲染的测验模式。
- 四种测试仍共用学习容器，可能需要其词卡基础代码／样式；没有继续拆每一个测试模式的 JS 或为几 KB 再建立新的状态框架。

## 两项功能维护

### 雅思目录回退

`getIeltsMeta` 返回复数 `lists`，旧回退分支误读单数 `list`，把已分 List 的词聚集到 unknown。现在对规范化、去重后的每个 List 统计成员；只有没有 List 的词进入 unknown。主题由原映射生成，数字顺序、分类交集和双重 TOEFL／IELTS 词的旧字段边界保持不变。

一个词可属于多个 List，目录总量仍按 List 成员计数，不能当作去重词数。真实全库各 List 的回退数量与 manifest／实际筛选一致。此修复针对目录投影；没有在缺少 manifest 路径时猜测下载 URL、承诺未缓存范围可离线下载，或绕过原范围加载器。

### 学习顺序

学习初始化和显式重置改用 `createStudyWordOrder`，复用已有 Fisher–Yates `shuffle/sample`，移除随机 sort 比较器。保留词条引用、重复记录和 ID；若指定首词，仍以原字符串 ID 语义固定该词，剩余词才洗牌。不存在的首词退回普通洗牌。

活动学习池仍只在实际范围变化／显式重置时准备，后台词库补载不改变当前卡或顺序。进度、评分和同步算法不变，没有迁移或复用词条 ID。

## 实际 CSS 交付量

修改前完整构建保存在忽略目录 `baseline-dist`，已包含前一批尚未提交的阅读分层和首次阅读样式修复。修改前后均为本机生产 gzip 服务、全新 Chromium 上下文、HTTP 缓存关闭、SW 阻止，按真实按钮进入页面；表中仅统计已完成的 CSS 响应 gzip 正文字节，不含 JS／JSON／图片、请求头或安装流量。

| 路径 | 首页 CSS 前／后 | 进入目标页额外 CSS 前／后 | 整条路径 CSS 前／后 |
| --- | ---: | ---: | ---: |
| 首页 → 全词库背词 | 32624／35830 | 25890／4868 | 58514／40698 |
| 首页 → 推荐阅读 | 32624／35830 | 22152／5777 | 54776／41607 |
| 首页 → 训练中心 → 托福 Level | 32624／35830 | 29421／12083 | 62045／47913 |

全局基础包使首页增加 **3206 B**。包含该成本后，三条路径仍分别减少 **17816 B（约 30.4%）、13169 B（约 24.0%）、14132 B（约 22.8%）**。没有把额外页面加载量的降幅说成全站降幅，也没有承诺固定提速秒数。本批没有重新进行受限带宽／CPU 延迟实验。

最终 PWA 预缓存 101 项／1873.35 KiB 未压缩产物，前一批为 95 项／1877.79 KiB。原预缓存策略不变，安装时仍可能请求后续页面资源；按需页面加载的节省不等于安装或每次更新流量减少。

## 验证

- 新增 5 项持久化测试：雅思混合旧格式／多 List／unknown 回退、真实全库每个 List 与 manifest／筛选一致；学习洗牌保留冻结输入与重复记录、指定首词、三词六种排列等概率覆盖。
- 22 项定向测试通过；全量 `npm test` **314／314** 通过，lint、最终生产构建／PWA、`git diff --check` 通过。保留既有构建提示，未更新依赖。
- 最终生产页面矩阵 **113 项**断言通过：学习、阅读、测验、填空、拼写、连线、托福 Level／List、雅思主题／List、复习词集合、语音设置；320／390／768／1440px 和浅深主题配对。比较真实文本、全部后代节点的 19 项计算样式、无横向溢出，最后无差异。比较前等待原有限动画完成；仅规范化两个本机端口的相同图片 URL。
- 语音弹窗基线补加载其原有全量样式，作为正确旧设计对照；最终页面自然加载其独立样式。未把原先首页直接打开的缺样式弹窗当作设计目标。其他矩阵路径使用原样构建。
- 行为 **11 项**：背词不加载测试样式／代码、完整 8699 池、提示展开、一次认识、测试 CSS 失败不进题目／原重试恢复、一次真实测验反馈与计数、指定起始词、后台补载不重排、显式重置及错误检查。
- 无雅思 manifest 的真实 hooks **5 项**：加载全库后保留正确数字 Lists／20 个主题、不再聚集 unknown、主题导航、成员计数及无未捕获错误。没有伪造下载目录。
- 真实 PWA **7 项**：离线重新打开后完整背词池／卡片样式、页面内切换到测验及四个选项／样式、未曾打开的阅读正文及三题、独立阅读样式、无未捕获错误。
- 跨页／键盘 **19 项**：阅读翻译、测验菜单、Enter 操作和可见焦点、拼写、雅思目录、再回背词；浅深主题及桌面／手机配对的最终文字与计算样式仍与基线一致。
- 合计 **155 项浏览器断言**，截图已核对。其余中间实验及重点矩阵不重复累加。
- 以上为隔离本机浏览器和 owner／API 夹具，不访问真实生产账号、不发验证码或修改真实数据。真实手机、Safari、生产网络、多设备和发布后验收仍未进行。

## 本批文件

共 30 个文件（其中 4 个与前一批阅读工作重叠）：

- `src/main.jsx`
- `src/styles/app-base.css`
- `src/styles/study-core.css`
- `src/styles/study-word.css`
- `src/styles/study-reading.css`
- `src/styles/study-catalog.css`
- `src/styles/study-assessment.css`
- `src/styles/study-voice.css`
- `src/styles/study-collection.css`
- `src/styles/study-legacy.css`
- `src/styles/word-learning-refresh.css`
- `src/components/LearningView.jsx`
- `src/components/WordCard.jsx`
- `src/components/ReadingSessionView.jsx`
- `src/components/ToeflSelectionView.jsx`
- `src/components/WordCollectionView.jsx`
- `src/components/VoiceSettings.jsx`
- `src/components/assessment/AssessmentSession.jsx`
- `src/utils/learningViewLoader.js`
- `src/utils/random.js`
- `src/utils/studyOrder.js`
- `src/utils/vocabularyCatalog.js`
- `src/hooks/app/useStudyNavigation.js`
- `tests/vocabulary-catalog.test.mjs`
- `tests/study-order.test.mjs`
- `frontend-architecture.md`
- `PROJECT_CONTEXT.md`
- `docs/performance-audit-2026-10-28.md`
- `docs/app-responsibility-refactor-2026-10-28.md`
- 本文档。

前一批阅读的 44 个文件继续保留，两批合计 70 个未提交文件。本轮没有 Git 提交、推送或部署。正常前端构建发布即可，无数据库／Worker 迁移。

当前列出的本地优化计划已经完成；提交发布与生产验收仍是独立步骤。原始样式、拆分／关键帧覆盖、构建基线、页面矩阵、截图、行为／离线／键盘日志及 CSS 请求字节记录保存在忽略目录 `output/playwright/css-boundaries/`。
