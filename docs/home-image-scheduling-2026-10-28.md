# 首页非关键插画调度（2026-10-28）

## 结果与范围

完成性能审查第 4 项。当前轮播主图继续立即高优先加载；首页非关键插画在进入实际视口、当前主图加载完成或明确失败、且未准备学习时，等待空闲机会开始（含有限超时兜底）。小图使用原素材生成的轻量交付副本，布局、文字、统计、按钮、图形造型、裁切和学习行为保持原实现。

仅今日计划启用这个调度上下文。训练中心词库／阅读等级轮播继续保留原当前图 eager、高优先及邻图 native lazy 策略。没有新设计、表情图标、生成式改图、CSS 改版或静态截图替换。

## 实现边界

- `HomeArtworkProvider` 是无额外 DOM 的首页范围 provider；`paused` 来自已有 plan/rewards readiness 和 isPreparingWords，不持有学习状态。
- `createDecorativeImageScheduler` 将可见需求按公共 URL 合并成空闲批次。主图 token、防止旧主图释放新选择、学习暂停、断开／重连以及过期 idle generation 校验共同约束分发。尚未发起的请求可以取消；已发起或已显示的图片保留，不强行 abort 共享资源。
- `useScheduledArtwork` 使用 rootMargin 0 的 IntersectionObserver，确认正面积视口交集后排队。离开视口、来源变化或卸载会取消需求，并忽略迟到 observer／idle 回调。没有 IO 时回退为空闲加载，没有 idle API 时用短定时器；旧浏览器仍能显示图片，不承诺该回退路径的离屏流量收益。
- `ScheduledAssetImage` 在放行前保留原尺寸的真实 img 空位，放行后仍使用 AssetImage。当前卡或明确选择的卡片立即可用，已开始的图在成为邻卡或暂停时不会被撤下。轮播拖动、触摸指针、键盘和真实操作回调不改。
- `DashboardArtwork` 继续使用原 SVG、原 viewBox 和 image width/height，观察其真实 SVG 视口。内部 image 使用支持 SVG 的 AssetImage，既可延后 href，也可复用失败重试／断网恢复；没有重算裁切或改变透明边距。
- `AssetImage` 默认行为与原生 img API 保留；新增可选 small variant、SVG image 与 retryPaused。重试仍有界，暂停时清理计时器，恢复后可继续；online 恢复仍有效。新小图未缓存且离线时，回退到相同素材原有默认交付 URL，复用旧图片缓存。
- 本批不改变语音、词库、学习池、事件、成绩、复习、收藏、账号授权或同步；不增加持久化键。所有图片请求仍是公共静态资源。

## 素材与缓存兼容

既有 `build-image-assets.mjs` 为以下 8 个 PNG 增加 192px 宽的同画布比例 WebP variant：stat-target、stat-flame、category-all-words、training-card-vocabulary／reading／review／test、training-hero-flashcards。分辨率覆盖当前 28–48px 角色及原透明画布裁切所需细节，不把小图用于大英雄插画。

| 这 8 个素材的交付副本 | 字节 |
| --- | ---: |
| 原默认副本合计 | 158738 |
| small 副本合计 | 41266 |

该集合少约 74.0%，不代表全站图片或所有会话流量减少 74%。原 PNG 与默认副本保留；43 个默认 WebP 均与修改前构建逐字节一致，原 URL 不变。小图是从原 PNG 重新采样，保留透明通道、画布比例和原 SVG 坐标；存在重采样像素差异。

manifest 在原记录内增加可选 variants.small，默认 resolveImageAsset(src) 结果不变。新文件使用内容 hash，原 immutable headers 同样适用。predev/prebuild 继续用同一生成命令；不改 PWA 图片按需 CacheFirst／ignoreSearch／80 项上限，不将插画加入安装预缓存。发布目录增加 8 个派生文件，不把磁盘目录大小当作首屏网络流量。

## 同条件网络结果

基线包含上一批核心启动／索引分层等全部未提交工作，保存在忽略目录 baseline-dist。最终生产包沿用同一 gzip／按 cookie 共享带宽服务器，Chromium、390×844、CPU 4 倍降速、减少动态效果、HTTP 缓存关闭、SW 阻止、全新上下文。实际点击由 DOM click capture 记录，和上批口径一致；中速各 3 次取中位，慢速各 1 次。单位秒：

| 场景 | 首页 DOM | 实际点击 → 词卡 | 实际点击 → 例句 | 导航 → 词卡 | 导航 → 例句 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 修改前，256000 B/s、100ms | 1.580 | 2.280 | 2.424 | 3.976 | 4.117 |
| 修改后，相同中速 | 1.596 | 1.524 | 1.657 | 3.613 | 3.748 |
| 修改前，64000 B/s、150ms | 5.823 | 7.968 | 9.484 | 14.181 | 15.696 |
| 修改后，相同慢速 | 5.825 | 5.516 | 5.709 | 11.705 | 11.898 |

首页 DOM 基本不变。点击至词卡中速中位少 0.756s（约 33.2%），慢速样本少 2.452s（约 30.8%）；例句对应少 0.767s／3.775s。主要收益在减少与学习页／词库竞争的图片，不能据此承诺生产网络、真实手机或每次选择同样提速。

到第一条例句 DOM 出现时，PerformanceResourceTiming 已完成的图片响应如下：

| 场景 | 完成的图片响应数 | gzip/编码响应正文字节 |
| --- | ---: | ---: |
| 修改前，中速中位 | 12 | 373688 |
| 修改后，中速中位 | 7 | 181256 |
| 修改前，慢速单次 | 12 | 373688 |
| 修改后，慢速单次 | 2 | 97744 |

这是已完成响应的正文快照；图片本身为 WebP，并非再次 gzip。仍在传输或由浏览器取消的响应不在该表，不能称为全部实际传输字节或全部已开始请求数。最终中速个别样本只完成当前主图，其余样本可包含已经进入空闲加载的邻图／图标；不把所有被延后的图片当成永久删除。8 个正式计时上下文无 pageerror。时间是 DOM 标记，不是 LCP／Lighthouse。

## 验证

- 全量 `npm test`：293/293，lint、最终生产构建／PWA、差异检查通过。新增调度器 7 项：主图门控、同 URL 合并、旧主图 token、暂停和迟到 idle、消费者取消、新主图、StrictMode 连接清理及批次中途暂停；新增图像 variant 1 项，检查 8 个实际文件的 hash、解码、alpha、比例及大小。原 43 个副本另行与保存基线逐字节比对。
- 生产调度 16 项浏览器断言：主图优先／空闲门控、真正离屏图不请求、滚动后加载、可见统计只取小图、明确选卡立即取当前图、准备／卸载后不分发迟到装饰、完整 8699 池、真实认识一次及不改学习记录。
- 重试／兼容 API 9 项：SVG 与原生图失败、暂停期间无重试、恢复重试、保留 SVG namespace／viewport、卸载清理、online 恢复，以及缺少 IO/idle API 的计时器回退。
- 修改前后视觉／交互 66 项：320px 浅色、390px 深色、768px 浅色、1440px 浅／深，DPR 2。逐个滚入图标并等待真实图像后截屏；比较全部内容面板几何与原 SVG viewBox／image 尺寸，完全一致。两版本键盘、箭头、真实拖动和预览不写进度均通过，无横向溢出。
- 截图像素检查：任一 RGB 通道差大于 12 的像素占比约 0.036–0.104%，平均通道误差约 0.012–0.028（0–255 标度）。这是小图采样／编码差异；人工核对了原图形、配色、透明留白及布局，没有把重采样说成逐像素相同。
- PWA 升级／旧图离线 6 项：在线安装代码与词库后，单独保留原默认图缓存、清除所有 small 缓存，再离线 reload 新文档。原生统计图及 SVG 仍能回退到旧图；完整词库和手机学习 chrome 正常。首次离线且没有任何图缓存仍不保证插画可用。
- 原生产学习 23 项：桌面／手机、浅深主题、准备不写记录、完整词数、一次认识、真实测验一次答题、返回及 PWA 新文档离线完整池。
- 训练／阅读轮播回归 15 项：1440／390px，原当前图与邻图来源、eager/high 与 native lazy 策略、词库键盘选择、ALL/A1 阅读选择、预览不记学习及无溢出。
- 合计 135 项浏览器断言，最终脚本无未捕获 pageerror。没有访问生产账号、发送验证码、部署或修改真实数据；真实手机／Safari 和生产网络仍需另验。

PWA 代码预缓存仍为 91 项，未压缩产物约 1816.94 KiB；新插画 variant 不在安装预缓存内。调度有少量 JS 成本，首页时间未报告提速。

## 本批文件与发布

共 26 个文件：

- `scripts/build-image-assets.mjs`
- `src/utils/imageAssets.js`、`src/utils/decorativeImageScheduler.js`
- `src/data/imageAssets.json`
- `src/context/home-artwork-context.js`
- `src/components/home/HomeArtworkProvider.jsx`、`StudyDashboardPanels.jsx`、`StudyCarousel.jsx`
- `src/hooks/useScheduledArtwork.js`
- `src/components/ui/AssetImage.jsx`、`ScheduledAssetImage.jsx`
- `src/components/StudyHub.jsx`、`StudyMomentum.jsx`
- `tests/decorative-image-scheduler.test.mjs`、`tests/image-assets.test.mjs`
- `public/images/optimized/category-all-words-blue-v1-small-4dd6b40fca03c5b1.webp`
- `public/images/optimized/stat-flame-small-dc995efe587a31e7.webp`
- `public/images/optimized/stat-target-small-a43334db9e31bc88.webp`
- `public/images/optimized/training-card-reading-blue-v1-small-5a4e692b0e00f26f.webp`
- `public/images/optimized/training-card-review-blue-v1-small-f12447835e690f61.webp`
- `public/images/optimized/training-card-test-blue-v1-small-8e76989203275e97.webp`
- `public/images/optimized/training-card-vocabulary-blue-v1-small-10b592913c178cf8.webp`
- `public/images/optimized/training-hero-flashcards-blue-v1-small-2eab652713602520.webp`
- `PROJECT_CONTEXT.md`、`docs/performance-audit-2026-10-28.md`、本文。

仅前端正常构建发布，无数据库／Worker、词库内容、存储或同步迁移。原 PNG／默认图、学习数据及前几批工作均保留。本轮已按用户要求与其余性能优化批次合并本地提交，未推送或部署。

脚本、隔离基线、计时原始 JSON、截图、像素分析和最终日志在忽略目录 `output/playwright/home-image-scheduling/`；主要为 before/after.json、summary.json、各 check-*.js、pixel-comparison.json、default-compatibility.json 与对应结果。下一项是审查第 5 项分类计划补载，阅读正文分层／CSS 边界仍单独跟踪。
