# 主页深色版本交接（2026-10-26）

## 范围

依据当前浅色主页实现深色版本，沿用共享 AppLayout、Sidebar、Topbar、手机顶栏／四项底部导航和全部真实学习组件。

- 深蓝灰背景、深色卡面与内嵌任务行形成层级，继续使用既有蓝色主操作及选中导航。青、紫、暖色仅用于小面积图标底色和轻微轮播色调。
- 首页轮播、统计、任务／快速开始、周目标、完成总结、明日预告和账号提示区均有深色样式。相邻训练中心的模块卡、内联选择面板与手机阅读推荐沿用同一套材质。
- 复用原有透明装饰图，不反转整页颜色或图片，不新增生成素材。手机山景加深遮罩，主卡插画略向右下收拢；真实文字、按钮和进度仍为 DOM。
- 桌面／手机共用顶栏恢复月亮／太阳主题按钮，含明确的可访问名称、按下状态和键盘焦点。原有日历、语音、通知与账号入口保留。
- 首次访问仍默认浅色；明确选择深色后立即写入现有 `flashcards_theme`／`flashcards_theme_explicit`，刷新恢复。`main.jsx` 不再强制覆写浅色，初次渲染前应用已存主题，ThemeContext 同步维护根节点及浏览器 theme-color。
- 不自动跟随系统主题，不新增存储键、依赖、API 或云端主题偏好。学习算法、词库、路由、成绩、账号隔离及进度同步没有修改。

本轮集中验收首页与训练中心；其他页面继续使用已有 dark 样式，不代表全站页面重新完成深色设计验收。

## 验证

- `npm test`：211/211 通过。
- `npm run lint`、完整生产构建／PWA、`git diff --check`：通过。保留已有主包超过 500 kB 的构建提示。
- 开发环境真实浏览器 65 项检查通过：320／360／390／430／640／768／1024／1440px 无页面横向溢出；逐张检查四张轮播的标题、主按钮及进度区；手机顶栏无重叠，保留四项底部导航。
- 主题鼠标／键盘切换、浅／深色刷新恢复、轮播选择保留、拖动／方向键及真实背词入口通过；切换主题和预览轮播前后，非主题学习存储保持一致。浅色卡片计算样式保持原值。
- 隔离生产预览额外 13 项检查通过：首次访问即使系统深色仍默认浅色；无效存储值回退浅色；偏好即时保存及刷新恢复；theme-color 正确；真实触屏横滑、原生纵向滚动、手机训练入口及返回首页滚动复位通过。无未捕获页面错误。
- 人工核对生产预览的 1440×900 桌面和 390×844 手机截图。浏览器检查使用隔离访客上下文与本机拦截 API，未发送邮件或访问生产账号。

验收脚本、结果及截图在已忽略的 `output/playwright/`：`home-dark-check.js`、`home-dark-production.js`、`home-dark-results.json`、`home-dark-production-results.json`、`home-dark-1440-viewport.png`、`home-dark-390-viewport.png` 等。无需数据库迁移或资源上传；未推送或生产部署。

## 变更文件

- `src/main.jsx`
- `src/context/ThemeContext.jsx`
- `src/components/layout/AppLayout.jsx`
- `src/components/layout/Topbar.jsx`
- `src/components/layout/MobileAppChrome.jsx`
- `src/design-system/tokens.css`
- `src/styles/dark-home.css`
- `PROJECT_CONTEXT.md`
- `test-page-visual-language.md`
- `docs/home-dark-mode-2026-10-26.md`
