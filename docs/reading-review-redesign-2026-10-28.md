# 阅读复盘视觉落地（2026-10-28）

## 范围

按用户确认的第二版效果图实现训练中心的阅读复盘，保留上方阅读轮播和共享 AppLayout。

- 标题、说明、最近 100 次标识，以及登录账号的原有同步按钮。
- 紧凑分段切换，显示真实练习次数与待巩固题数，保留 `aria-pressed`、键盘操作和焦点轮廓。
- 空状态使用珊瑚橙书本、奶油白书页和雾蓝回看时钟的哑光陶土插画。文字、按钮、计数均为真实 DOM。
- “选择文章”复用现有阅读等级选择回调：未选等级进入全部文章，已有等级则保持该等级。沿用原有滚动与减少动态效果处理。
- 已有记录使用等级、文章标题、日期和真实答题数的紧凑折叠行；展开保留原答案、正确答案、解析及只重做错题。
- 同步中的空记录使用共享加载动画；缓存记录继续显示；错误与本机保存说明保留在底部。访客与各账号仍使用原有独立缓存。
- 独立直接引用的 `reading-review.css` 替代 classroom/training 中旧复盘样式，避免懒加载样式顺序覆盖。桌面横向空状态，中等宽度将操作放到说明下方，手机纵向排版；浅深主题均支持。

不修改文章数据、评分、原成绩、错题筛选、草稿、账号授权、持久化、同步协议、Worker 或 D1。无需迁移，仅前端发布；本轮按用户要求本地提交，未推送或部署。

## 素材

- 源图：`public/images/ui-assets/reading-review-clay-v1.png`，1254×1254 RGBA，alpha 0–255，1,111,289 字节。
- 交付：`public/images/optimized/reading-review-clay-v1-dc42bd31d68184af.webp`，640×640，41,006 字节，由既有 `scripts/build-image-assets.mjs` 生成并登记到 `src/data/imageAssets.json`。
- 组件使用 `AssetImage`，保留 WebP 映射、解码、失败重试和断网恢复。图片仍走现有按需缓存，不新增安装预缓存。
- 使用内置 image_gen，`transparent_background=true`，参考用户确认的第二版效果图。未程序化重绘、去背或改色，原生成结果保留于 Codex generated_images；项目引用均为项目内副本。

最终生成提示词：

```text
Use case: stylized-concept. Asset type: standalone alpha transparent PNG decorative illustration for an existing English-learning web app. Image 1 is an approved mockup STYLE AND SUBJECT reference. Recreate ONLY the small coral open book and slate-blue history clock illustration from the BOTTOM LEFT of the mockup as a standalone high quality 3D object on a completely transparent background. Do not include any of the UI, text, panels, buttons, top carousel, or blue glass objects. Subject: friendly open book, thick warm ivory curved pages with subtle shallow embossed page lines but no writing, muted coral-peach #E6A28D hardcover, short dusty blue #829AB8 ribbon bookmark dangling off the bottom left of the spine, small slate-blue circular clock with ivory face, simple dark blue hands and integrated circular return-arrow rim at the lower right. One tiny muted peach four-point sparkle above the upper right of the book. Opaque matte ceramic / soft clay materials with tactile satin finish, beautiful rounded edges, extremely subtle grain, soft upper-left studio light, delicate contact shadow only below object that fades to full transparency. Near frontal slight three-quarter view, premium editorial edtech illustration. Match the approved lower icon faithfully in silhouette, colors and proportions. Square canvas, whole subject fills central 82% with generous transparent margins, no cropping. No glass, no crystal, no iridescence, no scenery, no matte background, no square tile, no pedestal, no text, numbers, letters, logos, UI, or watermark. Genuine RGBA alpha transparency.
```

## 验证

- lint、完整生产构建／PWA、`git diff --check` 通过，保留既有大 chunk／Browserslist 提示。
- 32 项现有 P1、阅读作业、阅读索引及首页测试通过。本次未新增镜像实现的单元测试，也未重跑全量功能测试。
- 开发版真实应用 111 项浏览器检查：320／390／768／1024／1440px、浅深主题、无横向溢出、图片解码与 WebP 路径、按钮尺寸与边界、分段切换、键盘、浏览不改学习存储。
- 实际全部文章与 A1 列表入口、已有等级保留、真实正文入口、历史计数、答案／解析展开、只重做错题入口及原成绩不改通过。
- 本机账号夹具 23 项检查：同步中禁用及共享加载、失败说明、同步重试、原 expected-account 请求头、切换账号缓存边界，以及手机／桌面浅深主题。使用隔离浏览器与 API 拦截，不访问生产账号或生产数据。
- 生产构建预览 21 项检查通过：1440／390px、浅深主题、真实 WebP 图片、无溢出、文章入口与错题切换；合计 155 项浏览器检查，无未捕获页面错误。截图已核对。验收脚本、日志及截图均在忽略目录 `output/playwright/reading-review-*`。
- 未完成真实手机／Safari、生产登录账号、生产多设备或本轮离线同步验收，不以构建成功代替这些验收。

## 变更文件

- `src/components/HomeScreen.jsx`
- `src/components/reading/ReadingReviewPanel.jsx`
- `src/styles/reading-review.css`
- `src/styles/classroom.css`
- `src/styles/training-center.css`
- `src/data/imageAssets.json`
- 上述 PNG 与 WebP
- `PROJECT_CONTEXT.md`
- 本文档
