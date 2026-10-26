# 手机首页与训练中心参考图对齐（2026-10-26）

## 视觉与范围

依据用户提供的手机版效果图，使用白色／浅蓝表面、轻磨砂插画、紧凑的真实卡片与更轻的浮动底部导航。未绘制手机系统状态栏或把效果图作为界面。

- 首页：共享品牌顶栏 → 动态问候 → 加高的学习轮播 → 两列统计 → 今日任务／快速开始 → 原有每周目标与账号区。
- 主卡使用新增的山景背景和既有透明闪卡装饰；文字、按钮、进度和所有统计继续由组件与真实学习记录生成。手机进度移到主按钮上方，两侧预览和原拖动手势保留。最终手机卡片高度 316px；阅读插画缩至右上角并放在文字下层。问候语为 20px，移除下方说明行。
- 训练中心：原 HeroCard 在手机上显示为“学习”标题与说明；背单词、做阅读、今日复习、做测试继续使用四个 ModuleCard，改为单列横向插画卡。
- 背单词与做阅读仍打开原来的内联选择器；阅读等级／文章列表继续使用 ReadingPicker，不增加独立阅读列表路由。词库分类、托福／雅思选择、复习和测试入口保持原回调。
- 推荐内容是手机专属的横向文章卡，来源为传入的真实 readings；封面复用项目现有题材插画，标题、等级和分钟数取自实际文章。换一批只轮换组件临时展示顺序；点击调用既有 onOpenReadingSession(article.id)，缺少该回调时回到原阅读选择器。无文章时不显示推荐区。
- 共享 MobileTopbar 增加可选品牌样式；保留账号、日历、语音和通知入口。沿用产品当前固定浅色模式，没有恢复已移除的主题开关或新增搜索功能。
- MobileBottomNav 保留今日／训练／统计／我的四个目的地，选中态改为淡蓝图标底与蓝色文字，并增加 aria-current。页面切换继续依赖 App 原有滚动复位。
- 主体改版限定 640px 及以下；桌面导航、首页卡片比例、训练中心四卡／选择器／激励／今日进度结构保留。

## 数据与交付

无新增持久化状态、存储键、数据库字段、API、同步协议或学习算法。推荐顺序是组件内临时状态，不改变推荐日计划、文章完成记录或账号隔离。无数据库迁移或额外依赖。

本次文件：

- src/components/StudyHub.jsx
- src/components/HomeScreen.jsx
- src/components/layout/AppLayout.jsx
- src/components/layout/MobileAppChrome.jsx
- src/components/reading/RecommendedReadings.jsx
- src/styles/mobile-learning.css
- src/styles/study-dashboard.css
- public/images/ui-assets/mobile-learning-landscape-v1.png
- docs/mobile-learning-2026-10-26.md

## 验证

- lint、全量 205 项测试、生产构建与 PWA 生成通过。保留既有主包体积提示。
- 320／360／390／430／640／768／1440px：首页无横向溢出；逐一核对四张轮播的标题、副标题、按钮和进度区，手机统计两列、底部导航四项，品牌区与操作区不重叠。
- 同尺寸训练页无横向溢出，手机为四个横向模块卡；推荐区仅在手机尺寸显示。
- 浏览器检查：词库和共用 ReadingPicker、推荐换批及对应文章打开、从页面下方切换目的地后的滚动复位；原鼠标／触屏轮播、取消手势、键盘、指示点和学习入口回归通过。
- 验收在本机隔离访客浏览器完成，没有访问生产账号或写入生产数据。
- 截图：output/playwright/mobile-learning-home-390.png、mobile-learning-training-390.png；结果：mobile-learning-results.json、dashboard-interaction-results.json。验收脚本与截图位于已有忽略目录 output/playwright/。
