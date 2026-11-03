# 手机训练入口回顶与 CI 修复（2026-11-03）

## 远端失败与复现

`9fc28fe` 的 [Actions #175](https://github.com/arcadegrey/english-flashcards/actions/runs/41584985168) 在 `Check browser flows and PWA upgrades` 失败，部署被跳过。登录后读取原始日志确认：`check-learning-pages-browser.mjs:91` 等待 `window.scrollY === 0` 超时。lint、Node 测试、时区、构建、资源预算和 Worker dry-run 已通过，不把构建提示当作本次失败根因。

失败前的阅读／全局样式批次 `4249cdd` 对应 [Actions #174](https://github.com/arcadegrey/english-flashcards/actions/runs/41576598448)，工作流成功；后续发布以修复提交对应的自动部署回执为准。

路径：先通过全局单词／阅读入口进入训练中心的指定面板，再离开到今日计划，滚动手机页面，点击底部“训练”。`homePanelRequest` 仍保存上一轮的面板意图；页面导航 effect 先回顶，新挂载的 HomeScreen 又通过两层 requestAnimationFrame 打开旧面板并 scrollIntoView。

本机无头 Chromium 的逐帧记录稳定复现：第一个采样为 `0`，随后变成 `526px` 并保持，旧词分类面板自动打开。原测试若恰好在第一帧看到 0 就会通过；远端执行时错过这个短暂状态而超时。修复前，强化回归明确失败于 `526,526,526,526,526`。

## 修改

- `src/hooks/app/useStudyNavigation.js`：普通 `handleBackToHome` 进入训练中心前清空旧面板请求，并递增现有 nonce。单词／阅读专用导航仍各自发送原面板请求，阅读返回列表的展开行为保留。
- `scripts/check-learning-pages-browser.mjs`：分别构造旧单词／阅读请求，再从真实滚动的手机首页进入训练中心。跨过两层动画帧后连续采样五帧，严格要求每帧为 0，且普通训练入口不自动展开旧面板；同时验证两个专用入口仍展开正确面板。没有放宽原断言或用额外滚动掩盖问题，学习检查由 30 项增至 37 项。
- `scripts/browser-ci.mjs`：每个浏览器阶段记录开始、通过数量或失败堆栈，并即时保存 `output/browser-ci/results.json`。失败时保留此前阶段结果，沿用既有 artifact 上传，不修改门禁或部署条件。

没有修改布局、CSS、学习事件、账号、存储键、Worker／D1 或同步协议，无数据迁移或新依赖。

## 本地验证

- 修复前稳定复现，修复后两个面板路径的五帧采样均为 `0,0,0,0,0`。
- 本机已有无头 Chromium 的 37 项学习／导航回归通过；单词与阅读专用入口及通用训练入口分别验证。
- Chrome 完整浏览器 CI：37 交付＋24 真实双构建 PWA 升级＋24 密码＋22 阅读＋37 学习，共 144 项通过；新的阶段报告全部为 passed。
- 490 项 Node 回归、lint、生产构建、缓存／启动／阅读预算、6 项跨时区、Worker dry-run 和差异检查通过。保留原有大 chunk 提示。
- 隔离本机访客与一次性测试账号，不访问生产学习数据，不发送真实邮件。旧日志通过用户在浏览器自行登录后读取，没有导出凭据或扩大权限。

源码、逐帧复现、失败／成功截图与日志位于忽略目录 `output/playwright/ci-fix-175/`。完整 CI 报告在 `output/browser-ci/`。本批按用户授权提交、推送并沿用原自动部署；最终上线状态必须以修复提交的远端 quality 与 deploy 结果共同确认。
