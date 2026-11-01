# 资源缓存、导航准备与请求合并（2026-11-01）

基线为本地 `042fd35`。本批完成本地实现和验证，随本次本地提交保存，尚未推送或部署；不能把本地缓存响应当作生产新版本已生效。音频正式域名沿用既有交付，本批不重新上传音频、不更换桶、不修改 DNS。

## 五项状态

| 项目 | 当前状态 |
| --- | --- |
| 音频正式域名和边缘缓存 | 先前已发布，见 `audio-custom-domain-2026-10-31.md`。本批保持 `audio.englishflashcards.cn`。 |
| JS、词库、正文缓存审计 | 本地完成，包含真实 Wrangler 响应、304、HTML/SW/API 和缺失资源边界；待发布后复验。 |
| 根据导航意图准备资源 | 本地完成，有网络条件、停留、并发和数量预算；保持显式点击、失败与离线恢复。 |
| 按测量合并请求和改善顺序 | 本地完成一次有界合并和三轮前后对照，不保证所有网络、设备或路线普遍提速。 |
| 国内直连首次、再次访问和切页 | **未完成国内现场验收**。已提供可重复脚本，本机无代理探测有成功和超时，不能据此认证国内网络。 |

## 缓存与缺失资源

`public/_headers` 为 `/assets/`、带内容版本的词库 catalog/details、阅读正文、阅读查词摘要、提示批次和优化图片提供 `public, max-age=31536000, immutable`。HTML、SW、注册脚本和 PWA manifest 显式 `max-age=0, must-revalidate`。未带哈希的旧词库／Lists／manifests 继续使用 Workers 静态资源默认重新验证，不对整个 `/data/` 设置长期缓存。

账号 API 仍由 Worker 返回 `no-store`，不进入公共静态规则。词库、阅读和提示原有 CacheStorage 版本、校验、命名及旧缓存兼容保持不变。首次无缓存离线仍不受支持；MP3 不加入应用包和 PWA 安装预缓存。

真实 Wrangler 测试发现，原 `single-page-application` 自动回退会把 `/assets/missing.js`、`/data/readings/missing.json` 的文档导航返回为 HTML，并套用对应目录的一年缓存。这是本轮修复的缓存边界：`wrangler.toml` 改用 `not_found_handling = "none"` 并显式绑定 `ASSETS`；已有资源仍由 asset-first 路径直接交付，只有资源缺失才进入 Worker。新增 `worker/staticAssets.js`：页面文档深链接回退 `/index.html` 并重新验证；资源缺失返回 `404 / no-store`，不会把 HTML 当成旧 JS／JSON 缓存。API 路由仍先于静态处理。

Wrangler 本机实际响应：HTML/SW 200 且重新验证；哈希 JS、核心摘要、正文 200 且一年缓存；这些静态文件的条件请求 304；匿名 `GET /api/progress` 为 `401 / no-store`；`/deep-link` 为 200 HTML；两个缺失资源为 `404 / no-store`。原始记录在 `output/playwright/delivery-2026-11-01/worker-headers-final.json` 和 `spa-boundary.json`。

规则与实现依据：[Workers 静态资源响应头](https://developers.cloudflare.com/workers/static-assets/headers/)、[静态资源与 Worker 路由](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/)。

## 有界导航准备

- 鼠标停留或键盘聚焦 140 ms 才准备；移开、点击、离页、切换账号／计划或进入关键准备状态会取消尚未开始的意图。
- 每个页面／账号／计划范围最多两次准备尝试（失败也计入预算），同时最多一组。离线、Save-Data、slow-2g／2g／3g、词库未就绪、学习／阅读／作业进行中均跳过；显式点击不受这些预算限制。
- 共享桌面侧栏、手机导航、今日计划学习／阅读任务、阅读文章行与测试模式使用真实按钮的数据属性，不改变 UI、导航目的地和业务行为。训练选择轮播不会在拖动时下载所有分类。
- 单词／测试意图只准备对应代码。阅读意图准备一篇公共正文、阅读页面代码和固定的 1058 条公共查词摘要；不会下载活动学习全库、例句详情、录音或账号 API。查词摘要与两篇最大正文合计 **54542 gzip 字节**，构建审计限制为 64 KiB。
- 预热和 React.lazy／正文 hook 复用相同模块或数据服务。阅读的显式点击同时开始代码、正文和独立查词，原 hook 继续负责有效范围与挂载，不提前采用词库或打开个人草稿。
- 文章及查词预热失败时不扩大为完整后备下载；显式进入时仍保留原有离线代码后备与重试。已开始的公共共享请求不强制 abort，可能短暂与后续点击请求并存。

## 合并与实测

采用 Vite 8／Rolldown 的 `codeSplitting.groups`，仅合并已属于首页静态依赖的共享 UI 和小型身份／统计辅助模块；不递归捕获依赖，不把学习页、GSAP、大词库和音频映射并入首页。依据：[Vite 构建](https://vite.dev/guide/build)、[Rolldown 分组](https://rolldown.rs/reference/OutputOptions.codeSplitting)。

三轮生产构建对照：Chromium，390×844，减少动态效果，CPU 四倍降速，CDP 延迟 150 ms、下载 256000 B/s、上传 128000 B/s。新浏览器 context、禁用 HTTP 缓存、阻止 SW；两端使用相同本机 gzip 服务器。网络 API 报告均为 4g。以下为三次中位数，DOM 就绪标记，不是 LCP 或真实国内网络测速。

| 指标 | 原基线 | 本批 |
| --- | ---: | ---: |
| 首页已完成 JS 请求 | 33 | 22 |
| 首页 JS gzip 正文 | 157391 B | 155926 B |
| 首页 DOM，立即点击组 | 2712 ms | 2697 ms |
| 点击阅读 → 正文，立即点击组 | 1330 ms | 845 ms |
| 点击阅读 → 正文，先停留 900 ms 组 | 836 ms | 122 ms |

900 ms 的点击前停留在两端相同，**未计入点击后等待**；它不是免费获得的端到端时间节省。首屏中位差异很小；图片与数据共享带宽，先前轮次的阅读计时有明显波动。不将减少请求数直接等同于固定提速百分比。

第一轮仅预热单篇和代码时，停留组约 855 → 858 ms，没有明显收益；请求瀑布显示约 48 KiB 的查词摘要仍是等待点，因此最终把它纳入同一组受限准备，再取得上表结果。历史测量全部保留，不以最好单次替代三轮中位数。

最终 PWA 预缓存 **92 项／2949.54 KiB** 未压缩，原基线 102 项／2950.43 KiB。代码仍沿用既有安装预缓存；减少切页请求不等于同比减少安装流量。现有大 chunk／Browserslist 等构建提示未被隐藏。

## 验证与复现

- 全量 Node 测试 **454/454**；新增网络／预算／取消、只预热单篇、查词上限及静态资源回退边界；6 项跨时区检查通过。
- Lint、正式音频域名配置的生产构建、Worker dry-run、差异检查和构建缓存审计通过。
- 生产包真实浏览器 **37 项**：预热复用、个人学习／收藏不变、网络跳过、键盘焦点、预算、五种测试模式的零答题进入、背词卡、手机无溢出、真实 SW 控制、断网刷新及未打开文章的后备恢复，无 pageerror。静态计时服务器和真实本机 Wrangler／ASSETS 组合各独立通过相同 37 项，不把它们相加当作更多独立场景。
- `performance:audit` 检查 12 条缓存规则和 520 份长期缓存文件；拒绝未版本化文件／规则重叠，限制启动 JS ≤24 请求／170000 gzip 字节，检查大数据仍按需，阅读意图数据 ≤64 KiB。CI quality 在 build 后运行该审计。

```bash
npm test
npm run lint
npm run build
npm run performance:audit
npm run performance:serve -- dist 5195
# 使用 Playwright CLI 的隔离会话先 open http://127.0.0.1:5195，再运行：
playwright-cli run-code --filename=scripts/check-delivery-browser.cjs
```

前后计时需分别把原基线和最终构建放在 5194／5195，以 `scripts/delivery-audit-server.mjs <构建目录> <端口>` 启动，再运行 `scripts/measure-delivery.cjs`。静态测试服务器只用于可比较计时；响应头、深链接及资源缺失以真实 Wrangler 检查为准。基线构建及完整日志在被忽略的 `output/playwright/delivery-2026-11-01/`。

## 国内直连验收仍开放

匿名只读 `curl --noproxy '*'` 取得过首页 200（一次总耗时约 3.50 s），另轮首页约 9.22 s；哈希 JS／核心摘要／正文仍为生产旧版的 `max-age=0, must-revalidate`，核心和正文取得过 304。部分 TLS 请求超时。响应包含 LAX 边缘标记，但不据此推断测试者所在地区或具体网络根因。

明确用 `--no-proxy-server` 启动的隔离生产 Chrome 首次文档导航超时；未取得有效的再次访问、训练和阅读切页时序。这是本机当前路径的失败证据，不据此宣称国内用户必然失败，也不覆盖用户先前已报告恢复的设备。此次没有修改系统代理、DNS 或真实账户。

在国内真实设备上记录城市、运营商、Wi-Fi／流量、浏览器和是否首次访问，再运行：

```bash
npm run performance:probe -- https://www.englishflashcards.cn
playwright-cli --session direct open https://www.englishflashcards.cn --config=scripts/playwright-direct.json
playwright-cli --session direct run-code --filename=scripts/measure-public-navigation.cjs
```

配置使用已安装 Chrome 并明确禁用浏览器代理；探测脚本不读取验证码／账号、不提交答案。浏览器首次不成功时，没有有效热访问基线，不应把失败导航后的立即中止时间当作热启动。脚本不能绕过设备级隧道或代替现场网络信息。发布后仍需在同一国内网络取得首次、再次、切页和音频的完整数据；生产账号／多设备／旧 PWA／iOS 验收继续独立开放。

## 发布与回滚

必须同版本发布 Worker、`wrangler.toml`、`dist/_headers`、JS/CSS 及生成公共 JSON；现有 main 工作流可完成，质量阶段新增构建审计。本批随本次本地提交保存，尚未推送或部署，不需要 D1／个人数据迁移、新环境变量或音频上传。不要只切换 `not_found_handling` 而留下旧 Worker。已有静态文件保持 asset-first，没有配置所有资源 `run_worker_first`。

回滚时通过正常构建发布还原本批应用／Worker、资产路由和缓存配置；保留既有 R2 域名及音频、原个人数据和历史快照。不要清除用户学习记录来处理缓存问题。

## 变更文件

- 配置：`.github/workflows/quality.yml`、`package.json`、`public/_headers`、`vite.config.js`、`wrangler.toml`。
- 应用与按钮接线：`src/App.jsx`、`src/components/StudyHub.jsx`、`src/components/ExamPracticeView.jsx`、`src/components/app/AppPages.jsx`、`src/components/home/StudyCarousel.jsx`、`src/components/home/StudyDashboardPanels.jsx`、`src/components/layout/Sidebar.jsx`、`src/components/layout/MobileAppChrome.jsx`、`src/components/reading/ReadingPicker.jsx`。
- 导航准备：`src/hooks/useNavigationIntent.js`、`src/hooks/app/useStudyNavigation.js`、`src/utils/navigationIntent.js`、`src/utils/pageViewLoader.js`、`src/utils/learningViewLoader.js`。
- 公共正文／查词：`src/data/readingContentLoader.js`、`src/data/readingVocabulary.js`、`src/data/readingVocabularyLoader.js`。
- 静态回退：`worker/index.js`、`worker/staticAssets.js`。
- 工具：`scripts/audit-delivery.mjs`、`scripts/delivery-audit-server.mjs`、`scripts/probe-delivery.mjs`、`scripts/check-delivery-browser.cjs`、`scripts/measure-delivery.cjs`、`scripts/measure-public-navigation.cjs`、`scripts/playwright-direct.json`。
- 测试：`tests/navigation-intent.test.mjs`、`tests/reading-delivery.test.mjs`、`tests/reading-vocabulary.test.mjs`、`tests/static-asset-cache.test.mjs`。
- 交接：`PROJECT_CONTEXT.md`、`docs/release-status.md`、本文。
