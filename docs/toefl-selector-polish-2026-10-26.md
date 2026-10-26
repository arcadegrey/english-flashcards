# 托福选择页视觉整理（2026-10-26）

## 范围

仅整理托福 Level／List 选择页。继续使用共享 AppLayout、Sidebar、Topbar、ModuleCard 和按钮组件；界面遵循测试页的白蓝视觉语言。

- 内容区将返回和同步放在轻量工具行，标题、真实数量和学习全部按钮左／右对齐。
- Level 页使用两列目录，List 页使用三列紧凑卡片；小屏响应为两列／单列。
- List 卡片由原 148px 最小高度改为桌面 108px、手机 92px，标题由 30px 改为 20px／18px。
- 移除没有操作含义的蓝色圆点、卡片渐变和大面积阴影，复用 ModuleCard 的进入箭头、悬停和键盘焦点。
- 标题旁复用现有托福蓝色装饰 PNG，没有新生成图片，也没有图片化文字、按钮或数据。
- 专用样式由选择组件直接导入，且限定在 `is-toefl-view` 内，避免依赖先进入背词页加载旧 CSS；雅思分支保留原结构和样式。

词库、分片加载、ID／顺序／数量、学习范围、路由历史、同步、存储和进度均未修改。没有添加虚构的完成进度或选中状态。

## 验证

- `npm run lint`、生产构建及 PWA 生成、`git diff --check` 通过；保留既有主包超过 500 kB 的提示。
- 真实浏览器从训练中心进入托福，核对 4 个 Level、3245 词及 Level 3 的 10 个 List、1009 词，数量和顺序与当前 manifest 一致。
- 1440／1024／768／390px 无横向溢出，返回、同步和学习全部按钮正常显示。
- 同步仍打开真实登录弹窗；学习 Level 3 全部进入 1009 词范围；键盘 Enter 进入 List 1 的 97 词范围。
- 返回顺序为 List → Level → 训练中心；进入学习页加载旧词卡 CSS 后返回，托福样式仍正常。雅思共享页面保留原主题卡，未套用本次托福样式。
- 隔离访客上下文无未捕获页面错误，不发送邮件，不使用生产账号。
- 验收脚本、JSON 与截图在忽略目录 `output/playwright/toefl-polish-*`。本轮为 UI 修改，未新增测试或重跑全量功能测试。

## 变更文件

- `src/components/ToeflSelectionView.jsx`
- `src/styles/vocabulary-selection.css`
- `docs/toefl-selector-polish-2026-10-26.md`
- `PROJECT_CONTEXT.md`
- `plan.md`

无迁移，无新音频或其他待上传资源；未推送或部署。
