# DESIGN SYSTEM

--------------------------------
# COLORS
Primary: #4F7CFF
Primary active: #2F6DFF
Secondary: #7EA6FF
Accent yellow: #FFC857
Background: #F7FAFF
Card: #FFFFFF
Text: #0F172A
Muted text: #64748B

Green: success
Orange: warning
Blue: reading/active

Rules:
- The current Test page is the approved global visual reference. See `test-page-visual-language.md`.
- Primary learning surfaces use blue gradients based on #4F7CFF / #7EA6FF.
- Most page panels should be white or very softly tinted white, with subtle blue borders and soft blue shadows.
- Strong blue is reserved for primary buttons, active sidebar items, selected cards, progress bars, and key status pills.
- Violet, cyan, orange, and green are local semantic accents for modes/states, not page-wide themes.
- Yellow is an accent only: bookmark tabs, sparkles, small highlights, stars, or selected-state indicators. Do not make yellow the main surface color.
- Green is reserved for success/completion states.
- Orange/yellow is reserved for streaks, goals, bookmark accents, sparkles, or highlight stats.
- Avoid random accent colors.
- Do not introduce heavy borders or dark admin-style chrome.

--------------------------------
# SPACING
Only use:
8 / 16 / 24 / 32 / 48

--------------------------------
# TYPOGRAPHY
Page title: 28-32px bold
Hero title: 44-56px bold
Card title: 20-24px bold
Subtitle: 18-22px
Body: 14-16px

Rules:
- Hero title is the largest text on the page.
- Card titles must be clearly smaller than hero title.
- Body and metadata text should not compete with headings.
- Use strong weights sparingly; avoid too many bold elements fighting for attention.

--------------------------------
# STYLE
- Soft shadows only
- Rounded corners (20px for main cards, 12-14px for nav/buttons)
- Glass / soft gradient feel
- No heavy borders
- Cards should separate clearly from the background through soft elevation.
- Use subtle inset lines only when needed for definition.
- Keep the interface light, premium, and calm.
- Current global style follows the Test page: clean white cards, very light blue app background, subtle tinted borders, soft shadows, strong blue selected states, and small pastel semantic accents.

--------------------------------
# ICON STYLE
- unified soft 3D icons
- no mixed icon styles
- Generated icons must have transparent backgrounds.
- No Chinese text inside generated assets.
- No progress numbers or UI controls inside generated assets.
- For Training Center and vocabulary categories, prefer English-learning-specific blue/yellow 3D assets: Aa flashcards, reading document, review clipboard, target, CET shields, globe, IELTS card, study book/mug. Do not use emoji as production icons.

--------------------------------
# HOMEPAGE PATTERN

## Sidebar
- Width around 240px.
- Nav item height 44-48px.
- Nav item radius 12-14px.
- Icon/text gap 12px.
- Homepage may use a soft tint. Training Center desktop currently uses a stronger blue selected pill with a small yellow active indicator bar, matching the blue learning-app direction.
- Labels should be concise: 今日计划 / 训练中心 / 单词 / 阅读 / 复习 / 测试 / 统计.
- Desktop sidebar includes a shared bottom "连续学习" card with week dots. Keep it in `Sidebar.jsx`; do not duplicate streak cards inside individual pages.

## Topbar
- Lightweight, calm, and secondary to the page title.
- Right-side icon buttons use consistent size and alignment.
- Avatar/login state should feel polished but not heavy.
- Theme switching is a topbar icon button using the same icon-button system; show moon for switching to dark and sun for switching to light.
- All desktop pages use the same shared Topbar component and action styling as the homepage. Do not build custom desktop topbars for learning, reading, review, test, or statistics pages.
- The approved reference chrome is the 今日计划 desktop UI. Its topbar is implemented only in `src/components/layout/Topbar.jsx`; its sidebar is implemented only in `src/components/layout/Sidebar.jsx`.
- The desktop topbar action area keeps the same visible slots on every page: calendar, theme toggle, notification, and account chip. Search, sync, filters, mode menus, and page-specific controls live inside page content panels.
- Training Center has no search bar in the topbar or content area.

## Hero
- Strongest visual focus on the page.
- Left area: badge, title, subtitle, learned progress pill.
- Center area: real circular progress and real CTA buttons.
- Right area: decorative soft 3D "Aa" flashcard asset.
- Hero should feel intentionally composed, not assembled from unrelated pieces.
- Training Center hero uses a blue banner gradient, a right-side blue "Aa" flashcard asset, subtle letter background shapes, and small yellow highlights.

## Status Cards
- Review card: green completion language, real text, subtle decorative illustration.
- New words card: blue-purple active language, real progress bar, secondary action.
- Right-side illustrations should be integrated and decorative, not layout-critical.
- Status/action pills should share one soft rounded visual language.

## Stats Strip
- A single polished summary component.
- Three aligned stats: 连续打卡 / 今日目标 / 剩余词汇.
- Real numbers and labels; generated icons only for decoration.
- Dividers must be subtle.

## Mobile App Shell
- Hide desktop sidebar/topbar on small screens.
- Mobile topbar uses avatar, page title, calendar, theme toggle, and notification icons.
- Mobile bottom nav is floating, rounded, and uses concise labels: 今日 / 训练 / 统计 / 我的.
- Bottom nav selected state uses the primary blue-purple gradient; inactive items remain muted.
- Content padding must reserve safe space for the floating bottom nav.
- Mobile word-learning is the exception: it hides the generic mobile topbar and bottom nav, and uses its own clean study header.

## Mobile Word Learning
- Visual reference: clean flashcard study screen with back button, centered title, progress pill, goal strip, large word card, and bottom actions.
- Keep the phone view focused on learning only. Do not show 学习进度, 连续打卡, 剩余词汇 summary, or 坚持每天进步.
- Bottom actions stay in one horizontal row and must remain reachable above the safe area.
- The word card, example text, audio buttons, progress bar, and action buttons remain real components.

## Reading Session
- Reading article pages use the same blue-white learning visual language as word learning, not the old centered white article page.
- Desktop reading sessions keep the shared `AppLayout` sidebar/topbar, with 阅读 active in the sidebar and only the standard topbar slots on the right.
- The reading workspace uses a goal strip for 难词掌握, a large rounded article card, compact metadata chips, a right-side reading status stack, and real action buttons for 返回列表 / 显示翻译 / 朗读全文.
- Reading text, translation, questions, highlighted vocabulary, progress ring, and action buttons must remain real components.
- Mobile reading sessions use the generic mobile app shell and bottom nav; only mobile word-learning uses the dedicated study chrome exception.
- Reading level cards use white or softly tinted white surfaces with semantic pastel borders, real title/count/helper text, and a real circular arrow affordance.
- Reading article rows use a compact white row pattern: decorative icon block on the left, real article metadata in the center, and a real circular arrow on the right.

## Statistics Dashboard
- Statistics pages use the shared `AppLayout` chrome on desktop and the shared mobile app shell on mobile.
- The dashboard starts with one white rounded panel, a small blue decorative badge, a real title/subtitle, and real metric cards.
- Metric cards use semantic pastel accents only: blue for learning volume, green for mastered/success, orange for streak or review pressure, violet/cyan for secondary learning signals.
- Charts remain real DOM bars and labels, not generated images.
- Page-specific filters or progress controls belong inside the statistics panel, not in the global topbar.

## Word Collection Pages
- 今日复习、错题本、已学习单词 and 已掌握单词 use the shared `AppLayout` chrome on desktop and the shared mobile app shell on mobile.
- The global topbar owns the page title/subtitle; inside the page, keep only one compact progress strip before the content panel.
- Collection tools live inside the content panel: 返回、首页、搜索、同步、发音 and QuickMenu. Do not put these controls in the global topbar.
- Empty states use large decorative transparent PNG artwork inside a soft blue/purple white panel; the message, progress, buttons, and search controls remain real DOM.
- When words exist, the collection page reuses the real `WordCard` and bottom action buttons instead of static imagery.

## Exam Session
- The Test page is the global style benchmark for all page polish: large white panels, soft blue app background, selected blue cards, real progress bars, semantic pastel module cards, and transparent 3D PNG icons.
- Exam answer pages use the shared `AppLayout` sidebar/topbar, with 测试 active in the sidebar and only the standard topbar slots on the right.
- The exam workspace follows: control card -> thin progress bar -> centered answer card.
- The control card contains only 返回, current question count, and QuickMenu. Do not show "已同步" here because login/sync state belongs to the global account chip.
- The answer card width is narrower than the page shell and centered, matching the focused quiz reference.
- Four internal modes share this shell: 测验 / 填空 / 拼写 / 连线. Their question text, audio, options, answer feedback, and stats remain real components.
- Exam page-specific controls must stay in the workspace, not in the global Topbar.
- Reuse this page's panel/card/color rhythm when updating 今日计划, 训练中心, 阅读, 复习, 统计, and word collection pages.

## Mobile Training Cards
- Training module cards use a consistent white card surface in light mode.
- Do not use emoji as production card icons when decorative UI assets exist.
- Small module icons sit in the card's upper-right corner.
- Large decorative art can sit inside the card body, but must not obscure real text or the arrow button.
- The arrow remains a real button affordance, not an image.
- Mobile Training Center hero is an entry card, not a marketing banner: keep it compact, with a smaller title/subtitle/label, lower-opacity Aa watermark, and a slightly smaller right-side Aa illustration.
- The four mobile Training Center cards should read as one reusable component system: same two-column grid, same internal padding, same row height, aligned titles, meta directly below titles, consistent right-side illustration position, and a smaller softer circular arrow near the bottom-right.
- Desktop Training Center module cards use the same real `ModuleCard` system: text left, decorative learning icon right, real arrow button fixed at bottom-right.
- Word-category cards now use generated blue/yellow English-learning assets and should remain compact, lightweight cards rather than old plain buttons.
- Reading level cards use the shared `ReadingPickerContent` style: four light educational cards on desktop, compact responsive layout on smaller screens, real badges/counts/helper text, decorative CSS art, and a real circular arrow affordance.
- Reading article selection uses vertical rows, not horizontal module cards: left decorative icon block, center real title/source/time text, right real circular arrow.
- The old standalone reading list surface is not part of the design system; all reading entry points should visually read as part of the Training Center inline picker.

## Auth Modal
- Login/register opens in a centered rounded white modal with a soft blue border, subtle blue shadow, and circular close button.
- The modal owns the whole account UI: title/subtitle, two real stat cards for 已学习单词 and 已掌握单词, segmented 登录/注册 control, icon-leading email/code inputs, primary blue verification button, and real status/error text.
- Keep the existing email verification flow: sending a code when the code field is empty, completing login/register when a code is present.
- Mobile auth modal keeps side margins and can scroll within the viewport; desktop auth modal stays centered at a constrained width.

## Mobile Status Cards
- Status cards stack with 16px gaps on mobile.
- Card actions should be at least 48px tall for comfortable tapping.
- Illustration and action button should be distributed across the card width instead of being cramped in one narrow right column.
