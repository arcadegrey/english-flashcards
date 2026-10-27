# 训练选择器：插画与阅读等级区分（2026-10-27）

## 当前效果

按用户确认的方案保留既有磨砂卡面、立体轮播和全部学习入口，通过不同轮廓、局部身份色及大号真实等级标识提高识别度。修改只作用于训练中心的词库和阅读等级选择器。

- 六类词库不再使用相似的蓝色盾牌／书本组合；全部词库复用首页磨砂闪卡，其余五类使用新透明插画。
- 阅读卡使用真实 DOM 的 ALL／A1／A2／B1／B2／C1 标识，配合六种轮廓。等级和文章数量仍由已有阅读数据生成，没有新增掌握率或学习进度。
- 标签、边缘柔光、插画使用局部辅助色；主操作保持原蓝色。浅深两主题采用各自可读的标签文字色，统一保留磨砂滤镜、插画框和透明度。
- 首页未提供身份色或等级字段时保持原样；轮播的拖动、触屏、键盘、循环、非当前卡片焦点规则和点击入口均未改动。
- 词库 ID、词数、等级筛选、文章列表、阅读正文、复盘、账号隔离、学习记录、存储和同步沿用原逻辑。本轮没有后端或迁移要求。
- 现有 C2／未知等级保留显示回退；内置文章目前展示 ALL 和 A1–C1。本轮未增加阅读文章或新等级。

## 素材映射

所有文件均位于 public/images/ui-assets/，没有覆盖旧素材。

| 卡片 | 轮廓 | 局部色 | 文件 |
|---|---|---|---|
| 全部单词 | 叠放闪卡 | 冰蓝 | dashboard-flashcards-frosted-v1.png（复用） |
| 日常常用 | 咖啡杯 | 薄荷青 | training-vocabulary-daily-frosted-v2.png |
| 四级核心 | 打开的笔记本 | 浅蓝 | training-vocabulary-cet4-frosted-v2.png |
| 六级核心 | 学士帽 | 淡紫 | training-vocabulary-cet6-frosted-v2.png |
| 托福词汇 | 地球仪 | 青蓝 | training-vocabulary-toefl-frosted-v2.png |
| 雅思词汇 | 护照与对话气泡 | 灰紫 | training-vocabulary-ielts-frosted-v2.png |
| 全部阅读 / ALL | 三本书组 | 冰蓝 | training-reading-all-frosted-v2.png |
| A1 | 嫩芽 | 薄荷青 | training-reading-a1-frosted-v2.png |
| A2 | 折角单页 | 青蓝 | training-reading-a2-frosted-v2.png |
| B1 | 打开的书本 | 浅蓝 | dashboard-reading-frosted-v1.png（复用） |
| B2 | 双峰山形 | 长春花蓝 | training-reading-b2-frosted-v2.png |
| C1 | 冠冕 | 淡紫 | training-reading-c1-frosted-v2.png |

新增十张 PNG，均为 1254×1254 RGBA，alpha 范围 0–255；合计 11,123,918 字节。未做程序化重绘、去背或改色。十张文件均逐字节进入构建，并列入 PWA 预缓存；当前预缓存 103 项，约 29 MB。源文件原件保留在 Codex generated_images，项目引用均指向已复制到项目内的最终文件。

## 生成记录与提示词

使用内置 image_gen，未使用 CLI、API key 或网页截图。每个素材独立调用，transparent_background=true，参考图为项目中的 public/images/ui-assets/dashboard-flashcards-frosted-v1.png。该参考只提供材质与光线，不作为要保留主体的编辑目标。

词库批次公共提示词：

```text
Use case: stylized-concept. Asset type: standalone transparent PNG hero illustration for an English learning app, one object illustration only. Image 1 is a STYLE REFERENCE, not an edit target. Faithfully match its premium milky frosted-glass 3D material, translucent colored beveled edges, pearl-white highlights, rounded geometry, near-frontal three-quarter camera, soft top-left studio light, thin delicate glass elliptical orbit and two tiny pale-yellow four-point sparkles. Preserve this visual family, but change the subject to the one specified below.
Square composition, entire object and orbit visible inside central 88% of canvas, centered visual weight, generous equal transparent margins. Genuine alpha-transparent background, no matte, no scene, no ground plane. Subject occupies about 70% of the square, its silhouette must remain unmistakable at 64 pixels. Milky-white glass should be the majority of the subject, with a clearly visible but restrained pastel tint in the thicker glass and edges. Do not make solid saturated plastic. Do not draw text, labels, letters, numbers, logos, badges, shields, UI, buttons, or a complete card. Yellow only in the two tiny sparkles.
```

每个词库素材追加的 Subject：

### training-vocabulary-daily-frosted-v2.png

```text
Subject: A single rounded glass coffee mug with a large unmistakable C-shaped handle, sitting on one shallow matching saucer. Pastel mint-teal glass edges (#7BC9BE), pearly-white body. No books, no flashcards, no liquid or steam text.
```

### training-vocabulary-cet4-frosted-v2.png

```text
Subject: A wide open rounded spiral notebook, two broad pages, the central binding clearly visible and a short icy-blue bookmark. A few subtle embossed lines are acceptable but no writing. Light sky-blue glass edges (#7EA6FF), milky-white glass pages. Clearly a study notebook, not a shield.
```

### training-vocabulary-cet6-frosted-v2.png

```text
Subject: One unmistakable graduation mortarboard cap with a wide diamond-shaped rounded top and one delicate curved tassel, floating at a slight tilt. Pale lavender-purple glass (#B3A0E2), milky-white translucent highlights. No diploma, no book, no shield.
```

### training-vocabulary-toefl-frosted-v2.png

```text
Subject: One round glass globe on a small curved meridian stand and oval glass foot, with simple raised continent silhouettes. The sphere must dominate the outline and be instantly distinguishable from books. Icy cyan glass (#79C8DB), milky-white continents. No airplane, no flags, no labels.
```

### training-vocabulary-ielts-frosted-v2.png

```text
Subject: A single closed rounded passport booklet, with one simple embossed globe symbol on the cover, plus TWO overlapping softly rounded speech bubbles floating behind its upper-right edge. Their round shapes must be visible and distinguish the outline from a stack of flashcards. Muted grey-lavender glass (#A9A8CB), pearl-white glass. No text, no lettering, no national insignia.
```

阅读批次使用同一参考图及以下主体提示词：

### training-reading-all-frosted-v2.png

```text
Subject: A compact fan-like stack of THREE thick rounded closed books, offset at distinct angles so their spine and layered page silhouettes clearly read as a collection. One small sky-blue bookmark. Ice-blue glass edges (#7EA6FF), pearl-white translucent pages. No lettering.
```

### training-reading-a1-frosted-v2.png

```text
Subject: One fresh little sprout with TWO broad rounded leaves and a single short stem, emerging from a small low rounded glass seed base. The two leaves must form a clear wide V-shaped silhouette. Pastel mint-teal glass edges (#7BC9BE), milky-white refraction. No pot, no book, no landscape.
```

### training-reading-a2-frosted-v2.png

```text
Subject: One large single rounded page standing at a slight tilt, with a very obvious folded upper-right corner and three gently embossed horizontal lines. A single page silhouette, no stack and no book. Icy cyan glass edges (#8ACDDF), milky-white frosted glass body. No text or letters.
```

### training-reading-b2-frosted-v2.png

```text
Subject: A standalone compact sculpture of TWO rounded mountain peaks, one tall triangular peak and one shorter peak behind, with a tiny pearl-white snow-cap bevel. Clear mountain outline, no base landscape or scene. Soft periwinkle-blue glass (#8FAFE6), frosted milky white facets. No flags, no words.
```

### training-reading-c1-frosted-v2.png

```text
Subject: One elegant low rounded crown with THREE distinct rounded upward points and a broad curved band, floating at a slight three-quarter angle. Its outline must be instantly recognizable as a crown, not a shield or star. Pale lavender glass (#B6A1DF) with pearly milky-white highlights. No gemstones, no gold body, no text.
```

## 验证

- 698 项身份／布局检查通过：浅深主题，320／390／640／768／1024／1440px；逐卡检查真实等级、字号、六种不同素材与身份色、统一蓝色主按钮、磨砂材质、图片解码、文字／按钮边界、原四模块及预览不改写学习存储。
- 55 项入口与滚动检查通过：六类词库、全部阅读等级的真实文章数量、文章往返、复盘、返回分类、复习、测试、移动导航及滚动复位。
- 十张素材的尺寸、RGBA、alpha、构建字节一致性和 PWA 收录已检查，生成结果及桌面／手机卡片截图已人工核对。
- 首页 63 项回归通过，确认原有四卡尺寸、素材、默认名称、主题、键盘、预览不写学习存储及真实学习入口保持。
- 本机生产预览 65 项检查通过：两套轮播在桌面／手机、浅深主题的切换、按钮边界、十二个不同图片路径、真实等级标识及学习／阅读入口。共计 881 项浏览器检查，无未捕获页面错误。
- lint、完整生产构建／PWA、差异检查及原有首页 9 项测试通过；未新增或重跑全量功能单元测试。保留既有主包体积与 Browserslist 更新时间提示。验收使用隔离访客与本机 API 拦截，不访问生产账号或生产 API。
- 验收结果与截图位于忽略目录 output/playwright/picker-identity-*。未推送或生产部署；localhost 预览继续使用 http://127.0.0.1:5174/。

## 文件

- src/components/training/pickerVisuals.js
- src/components/HomeScreen.jsx
- src/components/home/StudyCarousel.jsx
- src/components/reading/ReadingPicker.jsx
- src/styles/training-center.css
- public/images/ui-assets/ 中上述十张 training-*-frosted-v2.png
- PROJECT_CONTEXT.md
- docs/training-picker-identity-2026-10-27.md
