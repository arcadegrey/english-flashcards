# 阅读查词独立补载（2026-10-29）

> 2026-10-31 后续验收：真实生产 Worker 入口的阅读、听写及 PWA 离线恢复通过 45 项；历史源码重建的旧 PWA 升级／数据保留通过 23 项。自定义域名完整流程、真实旧安装、真机和已登录同步仍开放，见[最新验收](p1-online-pwa-acceptance-2026-10-31.md)。

> 2026-10-31 发布核验补记：本功能已随 `b8075a7de41a179170151435588e51a9dfceb332` 推送并部署；[Actions #152](https://github.com/arcadegrey/english-flashcards/actions/runs/41070849932) 于 2026-10-30 22:22:08（北京时间）成功，质量、D1 幂等步骤和 Worker／静态资源部署均通过。下文原“未推送／部署”描述仅为实施当时状态。最新复核和生产验收边界见[发布核验](p1-release-verification-2026-10-31.md)。

修复同一篇文章的点词范围和难词统计随先前词库加载路径变化的问题。阅读列表与正文现在使用完整、稳定的阅读词汇来源；不再从当前背词／测试池推断可查词范围。

## 行为与兼容

- 构建时沿用原分词、词形推导和旧拼写别名，从当前完整活动词库提取阅读所需的全部词形候选。26 篇文章共用 1058 条摘要；保留原 ID、词性、义项、音标和分类，不重新编辑内容。
- 启动 metadata 只增加 ID／拼写索引，使阅读列表在词库未补齐时也有完整分母。词义／音标摘要在进入阅读时加载；默认例句继续走原有 50 词详情批次，不把例句放进启动包。
- 正文与词汇摘要同时准备。两者均成功后才挂载原阅读会话、草稿、历史、题目和完成动作；任何一项失败都使用原加载／错误／重试界面，避免展示不完整统计或提前创建会话。
- 独立查词表不调用 `setVocabulary`，不修改当前背词顺序、范围、分类就绪标记或全库就绪标记。后台加载其他词库也不会改变阅读查词结果。
- 当前账号的自定义词仅在内存中追加到公共摘要后。保留原匹配优先级：同拼写活动词优先，自定义精确词形仍可优先于活动词的派生匹配。公共缓存不包含自定义词或个人进度。
- 同形记录按与现有目录合并器一致的数字 ID 顺序选择，避免旧完整文件缓存的物理顺序影响词条身份。原别名和词形推导规则不变。
- 文章、账号、作业、历史重做或离页发生变化时，渲染键和 effect 清理会丢弃旧请求结果；不会取消其他视图可能共用的公共请求，也不会让旧账号的自定义词进入新会话。

## 历史与作业快照

查词按快照自己的正文准备，绝不按相同文章 ID 替换成当前 canonical 正文／译文／题目。当前阅读 token 集能覆盖的快照复用摘要；遇到当前阅读库没有的 token 时，才调用原完整词汇目录 API，以保留任意旧正文的查词能力。

完整目录路径继续使用原 CacheStorage、旧 full/core/extension/List 兼容与错误重试。正常 canonical 阅读不会因此下载完整扩展。未在活动词库中的词仍遵循原查词边界，不恢复退役记录到活动学习池。

## 交付、缓存与成本

`scripts/build-reading-delivery.mjs` 同时生成：

- `src/data/readingCatalog.json` 的轻量 ID／拼写索引与目录路径。
- `public/data/reading-vocabulary/b2bf97fec6289f57.json`：1058 条内容寻址摘要。
- `src/data/readingVocabulary.json`：相同摘要的惰性代码后备。

公共 JSON 使用独立的 `flashcards-reading-vocabulary-<摘要哈希>` 缓存，只清理自己的旧版本，不清理词库、阅读正文、Workbox 或账号数据。完整成员、唯一 ID、拼写及词义类型校验失败时不缓存为可用结果；失败请求会释放，允许原页重试。

JSON 失败时使用惰性代码后备。既有 PWA 规则会预缓存该代码，因此此前未打开的 canonical 文章也能离线取得词汇摘要。没有更改 PWA 缓存策略；没有承诺首次完全无缓存离线或所有未查看例句均可用。

交付有明确成本：metadata 独立 gzip 从 9525 B 增至约 16.6 KB；摘要 JSON 为 48123 B gzip。最终 PWA 预缓存从本轮基线 101 项／1922.55 KiB 增至 102 项／2165.34 KiB 未压缩产物。该代价用于稳定列表统计和未打开文章的离线查词，不能称作全站流量下降。正文和完整词库仍不进入启动同步依赖。

## 验证

- **全量测试 388/388**，新增 14 项持久化回归；阅读定向 24/24。
- 26 篇真实文章的每个英文 token，在摘要、metadata 索引及完整词库下匹配 ID 一致；包括自定义精确词形和同拼写边界。列表与正文的未认识统计在不同认识集合下保持一致。
- 原复现的 TOEFL 文章（16）在日常池只有 89 个关联 ID；修复后 core／日常／托福／雅思／全库五种先前状态均为 **153**，全部可点词序列一致。A1 文章（19）为 **45**，包含此前缺失的 fruit（3725）。保留词库现有释义，不在本轮顺带改写。
- 校验目录与代码后备完全一致、路径哈希正确、无例句进入启动索引；覆盖并发去重、损坏／重复／缺词数据拒绝、失败重试、历史正文、旧完整缓存离线、缓存隔离、同形词／别名及账号自定义词隔离。
- **51 项本机真实 hooks／阅读组件浏览器断言**：五种先前词库状态；学习池不变、补载不写学习记录；真实词弹窗与按需例句；标记认识只改变分子；加载期间无答题／完成；延迟请求中的换文章／账号及离页；JSON 与代码后备同时失败后原页重试；作业快照不被 canonical 替换。
- **15 项生产构建／真实 PWA 断言**：实际 App 的阅读入口、153／45 分母、原题目、词义弹窗和草稿保存；只访问首页完成 PWA 安装后，离线重新打开此前未打开的文章，完整 45 词与词义弹窗可用，3 道原题保留，无补载学习事件。
- 浅／深色、390／1440px 无横向溢出，检查了桌面与手机截图；未改变 CSS 或布局。
- lint、生产构建/PWA、6 项额外跨时区回归、Worker dry-run 与差异检查通过。再次运行阅读生成器，输出逐字节一致；canonical 词库、文章、既有文章 JSON、音频、Worker 和学习数据格式均未修改。

浏览器使用独立 localhost origin、内存账号／API 夹具，不访问生产账号、不发邮件或修改真实云端数据。66 项浏览器断言没有未捕获错误。脚本、截图和日志保存在忽略目录 `output/playwright/reading-vocabulary/`；这不是真机／Safari 或生产登录验收。

## 变更文件与发布

- 生成：`scripts/build-reading-delivery.mjs`、`src/data/readingCatalog.json`、`src/data/readingVocabulary.json`、`public/data/reading-vocabulary/b2bf97fec6289f57.json`。
- 加载／索引：`src/data/readingMetadata.js`、`src/data/readingVocabulary.js`、`src/data/readingVocabularyLoader.js`、`src/utils/readingText.js`。
- 生命周期／接入：`src/hooks/useReadingVocabulary.js`、`src/hooks/app/useStudyOverview.js`、`src/hooks/app/useStudyNavigation.js`、`src/components/app/AppPages.jsx`。
- 回归：`tests/reading-vocabulary.test.mjs`、`tests/reading-delivery.test.mjs`。
- 文档：本文、`PROJECT_CONTEXT.md`、`docs/open-items-review-2026-10-29.md` 的后续状态。

仅需正常前端构建发布，`predev`／`prebuild` 已包含生成步骤；生成索引、公共 JSON 和惰性代码必须随同一版前端一起交付。无需 Worker 逻辑或 D1／个人学习数据迁移。本次改动保存为 `85fe4ef`，后续已随 `b8075a7` 由 Actions #152 推送／部署；生产完整资源加载、真实账号与旧 PWA 更新验收仍待完成。
