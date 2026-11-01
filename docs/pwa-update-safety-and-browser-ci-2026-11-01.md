# PWA 更新保护与浏览器 CI（2026-11-01）

基线为 `654d96b`。本批完成本地实现与验证，随本次提交保存；推送与部署结果需独立核验，不以本地通过代表远端 Actions 已执行或生产新版本已生效。没有 D1／个人学习数据迁移，没有新增个人存储键、音频上传或账号协议变化。

## 更新行为

- 从 `autoUpdate` 改为 `prompt`，关闭默认注册脚本注入；`bootstrap.js` 启动唯一更新客户端，使用 `updateViaCache: none` 注册现有 `/sw.js`。首次安装不自动刷新页面。
- 新 Worker 安装完成后进入 waiting。学习、阅读、单词集合复习、课堂、作业、账号切换／弹窗、语音设置和准备任务期间不显示立即更新入口。只有明确列出的空闲页面可以提供更新；未来未知视图默认受保护。
- 账号 API 的请求与响应解析期间使用引用计数阻止更新，成功、失败、401 和异常都在 finally 释放；原 cookie、expected-user 头、超时、返回值与授权行为保持。
- 空闲页面内容区使用现有 `BaseCard`、`PrimaryButton`、`SecondaryButton` 显示“新版本已准备好／稍后／更新并刷新”。不增加全局顶栏槽位；手机背词界面仍只有原有学习内容。浅／深主题及 320／390px 使用同一组件。
- 点击更新后，waiting Worker 枚举同 origin 的窗口，依次执行预留、再次确认、提交确认。页面在预留期间同步阻止点击／键盘／表单，并复用既有 LoadingState 覆盖层，避免确认与新学习动作交错。
- 所有页面都已确认空闲，且窗口集合未变化，才调用 `skipWaiting`；页面已确认收到提交后，才会在 controllerchange 时刷新。其他页面忙碌、无响应旧页面或新开页面会阻止切换并释放预留。正常激活失败也会释放已提交的预留。
- 自定义 guard 在 Workbox 默认消息处理之前拦截旧客户端的直接 `SKIP_WAITING`，避免绕过跨页面确认。未知旧页面无需理解新协议；关闭所有旧页面后，浏览器仍可按原生生命周期激活新版本，不要求清除数据。
- “稍后”只在当前页面内隐藏通知。空闲时重新聚焦或恢复联网，最多每小时检查一次版本；正在学习、请求中或已有 waiting Worker 时不额外检查。没有后台轮询。

`public/pwa-update-guard.js` 作为 generateSW 的 importScripts 同版本发布，并以重新验证缓存交付。现有 Workbox 预缓存、图片运行缓存、词库／阅读／提示缓存命名与数据保留规则均保持；没有 unregister 或清理用户 CacheStorage/localStorage 的新操作。

依据：[Vite PWA 等待更新](https://vite-pwa-org.netlify.app/guide/prompt-for-update.html)、[Workbox 更新与刷新生命周期](https://developer.chrome.com/docs/workbox/handling-service-worker-updates)。

## 浏览器质量流程

固定开发依赖 `playwright@1.64.1`，由 lockfile 保证版本；没有增加产品运行依赖或外部测试服务。

```bash
npm ci
npm run build
npx --no-install playwright install --with-deps chromium
npm run test:browser
```

已有 Chrome 的本机也可使用 `PLAYWRIGHT_CHANNEL=chrome npm run test:browser`。CI 使用安装的 Chromium，页面 context 路由阻止非测试 origin 请求，只访问 loopback 测试服务器和虚构访客环境，不登录生产账号、不发送验证码或发布作业。路由同时禁用普通 HTTP 缓存，离线和旧 chunk 恢复使用真实 SW／CacheStorage。测试不依赖公网音频成功，不充当录音发音验收。

`scripts/browser-ci.mjs` 先运行已有导航／学习／离线回归，再构建真实 B 版本：使用相同 canonical 数据和生成规则，以 `VITE_APP_BUILD_ID=ci-upgrade-b` 生成不同的真实 JS 内容与哈希依赖图，在同一个 origin 切换部署目录。版本标识仅是公共构建元数据／DOM 属性，不显示到产品文案，不涉及账号。

两项公共资源复制插件现在遵循 Vite 的 outDir；构建 B 不覆盖 A 的目录或数据。测试服务器代码提取为共享模块，只监听 `127.0.0.1`；root 切换由测试进程直接控制，没有对外管理接口。

质量工作流新增浏览器安装与 `npm run test:browser`，超时为 10 分钟。断言失败会以非零状态阻止原有发布依赖；`if: always()` 保存 JSON 结果、真实测试 context 的 trace 和截图，保留 7 天，排除 B 构建目录。现有 CLI `run-code --filename=scripts/check-delivery-browser.cjs` 用法仍可使用。

## 验证记录

| 检查 | 本机结果 |
| --- | --- |
| 全量 Node 测试 | **465/465**，无失败或跳过；新增 11 项保护协议、旧消息拦截、失败释放、API 引用计数与鉴权兼容检查。 |
| 原浏览器流程 | **37 项**，覆盖导航预热、五种测试入口、背词、响应式与真实 SW 离线恢复。 |
| 双版本升级 | **24 项**，包括学习中保持 A、拦截旧版立即激活、第二页面听写阻止更新、草稿保留、无响应旧页面阻止更新、显式切到 B、零新增答题／成绩、升级后离线阅读及手机布局。 |
| 视觉 | 桌面 1440px、手机 390px 浅／深色和 320px，核对更新卡片内边距、按钮对比度及无横向溢出。 |
| Lint／生产构建 | 通过；PWA 92 项／2957.19 KiB 未压缩预缓存。保留已有构建提示。 |
| 缓存与包预算审计 | 通过；13 条规则、520 份长期缓存文件；启动请求和 gzip 上限保持原预算。 |
| 跨时区／Worker dry-run | 6/6；dry-run 通过，没有部署。 |

本机浏览器驱动为固定 Playwright 1.64.1，实际使用已安装的 Chrome 156；没有把本机执行描述为 Ubuntu 远端 CI 已通过。结果、截图和 trace 位于忽略目录 `output/browser-ci/`，命令失败时同样保留诊断。

升级测试明确等待 Worker 实际进入 waiting，再发送旧消息和检查状态；不会把返回 Promise 的异步轮询误当成已经等待完成。

## 验收边界

- A/B 是真实构建与真实 Service Worker，使用相同词库／文章；验证的是代码版本升级和已保存数据保留，未验证同时替换整个公共内容版本的每一种交付组合。旧哈希 JSON 在服务器被移除时，仍依赖原有缓存／后备和显式错误恢复，不能以本次保护承诺所有旧公共 URL 永远可达。
- 无响应旧页面使用同 origin 的无消息处理页面模拟，并额外测试旧 `SKIP_WAITING` 消息；这不是用户设备上真实旧 PWA 安装实例的验收。
- 未完成真实账号／双设备／课堂权限、国内冷／热／切页、iOS/Safari 的生产验收。当前的用户直连历史反馈仍按原交接保留。
- 没有运行远端 GitHub Actions，没有推送或发布。CI 已接线且相同项目命令在本机通过，远端结果须在实际推送后另行核对。

## 发布与维护

下一次正常发布需一起包含新的客户端 JS、生成 `/sw.js`、`/pwa-update-guard.js` 和 `_headers`；不要只上传 SW 或遗漏 guard。沿用既有 Worker／静态资源部署、ASSETS 绑定和 `not_found_handling=none`，无需迁移或新增必填环境变量。`VITE_APP_BUILD_ID` 为可选公共诊断字段，正常未配置时为 `app`，不要将 CI 的测试值设为生产必填项。

第一次从旧客户端迁移时，无法确认的旧页面会保守阻止手动激活；可结束学习并关闭本站全部页面后重新打开，保留本机记录。回滚通过正常版本构建与部署进行，不清除学习、收藏、草稿或账号缓存。

## 变更文件

- 配置：`.github/workflows/quality.yml`、`package.json`、`package-lock.json`、`vite.config.js`、`public/_headers`。
- 更新生命周期：`public/pwa-update-guard.js`、`src/utils/pwaUpdates.js`、`src/hooks/usePwaUpdateSafety.js`、`src/bootstrap.js`、`src/App.jsx`、`src/utils/workerAuth.js`。
- 共享 UI：`src/components/layout/PwaUpdateNotice.jsx`、`src/components/layout/AppLayout.jsx`、`src/styles/app-base.css`。
- 浏览器工具：`scripts/browser-ci.mjs`、`scripts/check-pwa-upgrade.mjs`、`scripts/lib/delivery-server.mjs`、`scripts/delivery-audit-server.mjs`、`scripts/check-delivery-browser.cjs`、`scripts/audit-delivery.mjs`。
- 测试：`tests/pwa-update.test.mjs`、`tests/pwa-api-guard.test.mjs`。
- 交接：本文、`PROJECT_CONTEXT.md`、`docs/release-status.md`。
