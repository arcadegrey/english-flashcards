# 正式站点图片加载优化（2026-10-27）

## 正式站点实测

用户报告 `https://englishflashcards.cn/` 图片加载慢、经常失败，并授权实测及按压缩、按需缓存和重试方向优化。

- 本次 curl：首页 HTTP 200，首字节约 11.93 秒，总计约 13.67 秒。
- 首页闪卡 PNG 为 1,177,820 字节；HTTP 200、`content-type: image/png`、`cf-cache-status: HIT`，但 45 秒只收到 115,322 字节并超时。首字节约 5.54 秒。
- 隔离 Chromium 中，137,456 字节的分类图片约 32.44 秒才完成，主闪卡仍在等待。部分图片尚未启动，不能将它们全部当成已经失败的请求。
- 图片响应为 `Cache-Control: public, max-age=0, must-revalidate`。本次线路经 Cloudflare LAX；结果只代表当前测试线路，不能直接推断所有地区、运营商和账号的速度。
- 已确认图片体积过大并叠加慢速传输；样本中不是文件 404 或未登录权限问题。未登录生产账号、发送验证码或修改生产数据，也不能据此排除用户其他失败请求的原因。

## 修改

### 图片交付

`scripts/build-image-assets.mjs` 使用锁定版本 Sharp，从已有 PNG 生成缩小尺寸、保留透明度和原画布比例的 WebP。普通素材最大宽度 640 px，手机背景最大宽度 960 px，不放大小图；quality 84、alphaQuality 95。

- 42 张界面图片从 **27,384,638 字节降至 1,343,754 字节，减少约 95.1%**。最大优化文件 77,822 字节。
- 首页闪卡：1,177,820 → 63,468 字节。
- 全部阅读：1,553,460 → 61,400 字节。
- 手机风景：1,675,695 → 34,276 字节。
- 文件位于 `public/images/optimized/<原名>-<内容哈希>.webp`。输出映射为 `src/data/imageAssets.json`；背景 CSS 变量由同一脚本生成，三份现有背景样式共用它。
- 原 PNG 和兼容 URL 保留；未重新生成插画或改变视觉设计。源图、alpha 和 sprite 设计稿不生成交付副本。
- `predev` / `prebuild` 自动生成；也可运行 `npm run images:build`。脚本仅清理 optimized 专用目录内不再引用的哈希 WebP，不改源图；相同内容不重复写文件。
- `sharp@0.34.5` 已存在于锁文件的 Wrangler 依赖树，本轮显式声明为开发依赖；没有引入另一套图像编码运行时。

### 加载和恢复

所有现有 JSX 的 HTML 图片接入 `AssetImage`，保持原 DOM 标签、属性、样式和操作。SVG 裁切图通过 `resolveImageAsset` 使用同一映射，沿用原坐标；SVG 和 CSS 装饰不宣称具有 HTML 图片的自动重试能力。

- HTML 图片异步解码；同源 `/images/` 请求出错后间隔 750 / 1500 ms，最多自动重试两次。仅重试发生过错误的图片，不对正常慢请求设置强制超时。
- 离线时停止定时重试；网络恢复后重试失败图片。切换源或卸载取消旧定时器，避免旧请求反复触发。
- 轮播仅挂载当前及左右相邻卡片的插画。当前卡使用高请求优先级，远端卡片切近后再请求；卡片文字、预览、键盘和学习入口仍使用原组件。

### 缓存

- 图片退出 PWA 安装预缓存；应用壳、图标和既有 JS/CSS 仍预缓存。当前构建预缓存 **63 项、约 1.77 MB**；之前本地构建的唯一预缓存资源约 30.41 MB，其中图片约 28.65 MB。
- 同源 `/images/*.webp` 使用独立 `flashcards-images-v1` CacheFirst 运行时缓存，最多 80 项、30 天；只存 HTTP 200 且 `content-type: image/webp` 的响应，避免 SPA HTML 回退污染图片缓存。重试参数不妨碍缓存命中。
- `public/_headers` 仅对内容哈希的 `/images/optimized/*` 设置一年 immutable 浏览器缓存，由已有复制插件发布到 `dist/_headers`。不对未版本化 PNG、HTML 或 API 设置长期缓存。
- 已通过受控 Service Worker 缓存的插画可以离线恢复；未访问、未缓存的插画不保证首次离线可用。首次页面加载发生在 Service Worker 接管前时，也不能把单次显示等同于完成运行时缓存。

## 验证

- 完整 `npm test` **247/247**；新增两项资产审计，遍历 42 张源图和交付文件，检查哈希、字节数、完整解码、比例、alpha 和总体减量。
- lint、生产构建/PWA、差异检查通过；保留既有大 chunk / Browserslist 提示。42 个 WebP 在 dist 内与源交付文件逐字节一致。
- 隔离浏览器 37 项：首页 1440/390 px 浅深主题、首页四张轮播图、词库六张与阅读六张、图片解码、远端卡片不加载原图、无横向溢出、预览不改学习存储；检查过桌面浅色和手机深色截图。
- 故障恢复 8 项：连续两次 HTTP 503 后自动恢复、重试参数、离线不循环、重连恢复、切源取消旧请求、持续失败最多三次请求、卸载清理、无未捕获错误。
- 生产构建 + 真实 Service Worker 7 项：安装不下载插画、仅缓存请求过的 WebP、HTML 回退不入缓存、手机断网重载仍显示已缓存图片，学习存储保持。
- 同等限速对比 3 项：两个新浏览器上下文，禁用 HTTP 缓存、64,000 字节/秒、100 ms 延迟，单张首页闪卡从 **18.553 秒降至 1.130 秒**。这是本地受控单图传输与解码测量，不是正式站点完整首屏时间承诺。
- 共 55 项浏览器断言。临时脚本、截图和日志保存在忽略目录 `output/playwright/image-delivery-*`。
- 未完成 Safari、真实手机或已登录生产账号验收；生产站点部署后的缓存响应头和用户网络改善仍需发布后复查。

## 发布

仅需发布前端完整 dist（包含优化图片、映射所编译的 JS、背景 CSS 和 `_headers`）。没有 Worker 业务代码、数据库迁移、词库、音频、账户存储或云同步协议变更。本轮按用户要求本地提交，未推送或生产部署。

## 变更文件

- `scripts/build-image-assets.mjs`、`package.json`、`package-lock.json`
- `public/images/optimized/*.webp`（42 张）、`public/_headers`
- `src/data/imageAssets.json`、`src/utils/imageAssets.js`、`src/components/ui/AssetImage.jsx`
- `src/components/ui/Cards.jsx`
- `src/components/home/StudyCarousel.jsx`、`src/components/home/StudyDashboardPanels.jsx`
- `src/components/modules/LearningModules.jsx`、`src/components/reading/RecommendedReadings.jsx`
- `src/components/statistics/WeeklyLearningOverview.jsx`、`src/components/classroom/StudentReadingProgress.jsx`
- `src/components/AuthPanel.jsx`、`src/components/ClassroomView.jsx`、`src/components/ExamPracticeView.jsx`
- `src/components/StudyMomentum.jsx`、`src/components/ToeflSelectionView.jsx`、`src/components/WordCollectionView.jsx`
- `src/main.jsx`、`src/styles/image-assets.css`、`src/styles/study-dashboard.css`、`src/styles/mobile-learning.css`、`src/styles/dark-home.css`
- `vite.config.js`、`tests/image-assets.test.mjs`、`PROJECT_CONTEXT.md`、本文档
