# 首页四张轮播插画统一（2026-10-26）

## 当前设计与范围

按用户要求，以“全部单词”的既有 `dashboard-flashcards-frosted-v1.png` 为唯一画风基准。保留这张原图，新增复习剪贴板、阅读书本、测试靶心三张配套插画：同一乳白磨砂玻璃、冰蓝透明边缘、柔和反光、细蓝色环绕线和两颗浅黄色星光。

- 四张插画均为 1254×1254 RGBA PNG，含真实透明通道，使用同一方形画布与主体比例；它们只承担装饰作用。
- 首页大轮播使用独立的 `heroWords/heroReview/heroReading/heroExam` 素材映射。任务行和快速开始的小图标仍沿用原图，未扩大修改范围。
- 四张轮播共用现有 `.study-carousel-artwork` / `.study-carousel-art` 规则。手机统一为顶部 64px、右侧 -24px、宽度 64%、高度 176px；桌面沿用原词汇卡的公共插画槽。
- 移除阅读卡右上角小图、测试／复习各自缩放与 38% 透明度、深色非阅读卡独立偏移。四张图片自身 opacity 均为 1，手机父层统一 opacity 0.9；深色仍共用相同亮度处理。
- 手机说明文字统一宽度并优先在词组之间换行，保留原两行标题截断。没有修改卡片内容来源、真实数据、词库、推荐、学习算法、路由、存储或同步。

## 素材与生成记录

使用内置 **imagegen**，以原词汇插画为参考，每个新素材分别生成一次。未使用 CLI、API key、整页截图或静态 UI 替代。原生成文件留在 Codex generated_images 中，已将最终 PNG 复制至项目：

- `public/images/ui-assets/dashboard-review-frosted-v1.png`
- `public/images/ui-assets/dashboard-reading-frosted-v1.png`
- `public/images/ui-assets/dashboard-exam-frosted-v1.png`

三个调用均启用 transparent_background，使用以下公共提示词，再分别追加对应 Subject：

```text
Use case: stylized-concept. Asset type: transparent PNG decorative hero artwork for an English learning app.
Input image 1 is the EXACT visual style reference from the approved vocabulary hero. Match this family faithfully: luminous semi-transparent milky frosted glass with softly rounded bevels, icy translucent blue edges, gentle blue refraction, soft pearly white highlights, one thin translucent icy-blue elliptical orbit around the object and TWO small pale yellow four-point sparkles at upper right and lower left. Preserve the reference's soft premium 3D product illustration, same near-frontal three-quarter tilt, same soft top-left studio light, same camera distance, same centered composition and visual weight.
Square canvas. Keep the entire artwork including the orbit and sparkles inside the central 90% of the canvas, equal margins on every side. Genuine transparent background, no backdrop, no ground plane, no colored square, no opaque white matte. The main object should be approximately the same size relative to the canvas as the flashcard stack in the reference. Restrained blue (#7EA6FF/#4F7CFF); most material should be milky-white glass. No saturated solid plastic, no dark navy, no heavy shadows, no cartoon flat vector, no text, no letters, no numbers, no logos or interface controls. This is a standalone decorative asset, never an entire card/page.
```

### review

```text
Subject: a single thick rounded frosted-glass clipboard, with a softly raised translucent sky-blue checkmark centered on its face and a small glass clip at top. The clipboard replaces the flashcard stack; keep all the reference material, orbit, sparkles, scale and lighting.
```

### reading

```text
Subject: a slightly open thick book made of rounded frosted-glass covers and a few translucent layered glass pages, with a small pale-blue glass bookmark ribbon. The book replaces the flashcard stack; keep all the reference material, orbit, sparkles, scale and lighting. No printed lines or text.
```

### exam

```text
Subject: a rounded circular frosted-glass archery target, with subtle concentric translucent blue-glass rings and a small icy-blue glass arrow striking the center. The target replaces the flashcard stack; keep all the reference material, orbit, sparkles, scale and lighting. Rings must be delicate, mostly pearly milky glass rather than thick opaque royal blue. No gold arrow: yellow is limited to the same two small sparkles as the reference.
```

## 验证与发布

- 原有首页 9/9 项测试通过；lint、完整生产构建／PWA、git diff --check 通过。保留原有主包体积提示。
- 113 项隔离真实浏览器检查通过：浅／深两主题，320／390／640／768／1024／1440px，无横向溢出；逐张核对四张图片来源、成功解码、相同坐标／尺寸／透明度及标题／说明／进度／按钮间距。
- 鼠标拖动、键盘轮播、真实开始学习入口通过，预览及主题切换不写学习存储，无未捕获页面错误。人工核对桌面／手机两种主题下的卡片截图。
- 四张 PNG 的尺寸、RGBA 与 alpha 范围已检查；三张新增资源约 3.3 MB，构建后的 PWA 预缓存由 87 项增加至 90 项，新增图已进入前端产物。
- 验收脚本、结果与截图在忽略目录 `output/playwright/home-unified-art-check.js`、`home-unified-art-results.json`、`home-unified-*.png`。
- 本轮是 UI／装饰图修改，未重跑全量功能测试。发布前端即可，无 Worker、D1 迁移或独立音频上传要求；未推送或生产部署。

## 变更文件

- `src/utils/studyDashboard.js`
- `src/styles/study-dashboard.css`
- `src/styles/dark-home.css`
- 三张新增 `dashboard-*-frosted-v1.png`
- `docs/study-dashboard-2026-10-26.md`
- `docs/home-carousel-artwork-2026-10-26.md`
- `test-page-visual-language.md`
