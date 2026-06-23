# TEST PAGE VISUAL LANGUAGE

This is the approved global visual direction for English Flashcards.

All future page polish should move toward the current Test page style.

--------------------------------
# DESIGN PRINCIPLE

The product should feel like a calm, premium edtech SaaS app:
- bright white content cards
- very light blue app background
- strong blue only for selected/primary states
- soft pastel mode colors used in small areas
- real UI components for text, buttons, progress, navigation, cards, and stats
- generated PNG assets only as decorative icons or illustrations

Do not return to heavy gradients, dark admin chrome, emoji icons, or page-specific visual improvisation.

--------------------------------
# GLOBAL PALETTE

Core:
- App background: `#F7FAFF`
- Main card: `#FFFFFF`
- Primary blue: `#4F7CFF`
- Primary blue active: `#2F6DFF`
- Secondary blue: `#7EA6FF`
- Text: `#0F172A`
- Muted text: `#64748B`
- Subtle border: `rgba(126, 166, 255, 0.16)`
- Soft blue shadow: `rgba(79, 124, 255, 0.12)`

Mode accents:
- Quiz / selected / active: blue
- Fill blank: violet
- Spelling: cyan
- Matching / streak / small highlights: orange-yellow
- Success / mastered: green

Rules:
- Blue is the product color and the only strong global accent.
- Violet, cyan, orange, and green are local semantic accents, not page themes.
- Yellow/orange must stay small: stars, streaks, tiny highlights, matching mode accents, or selected detail marks.
- Large page surfaces should remain white, light blue, or very soft tinted white.

--------------------------------
# PAGE COMPOSITION

Desktop pages should follow the Test page rhythm:
- shared sidebar and topbar through `AppLayout`
- large white rounded content panels
- section title with a small decorative 3D icon or CSS badge on the left
- real status pill on the right when needed
- card grids inside the panel
- bottom or inline real progress bars where useful

Topbar:
- The global topbar never carries page-specific tools.
- Keep the approved slots: title/subtitle, calendar, theme toggle, notification, `Aa` account chip.
- Search, sync, filters, mode menus, and progress controls live inside page panels.

Sidebar:
- Keep the strong blue selected navigation pill.
- Keep the small yellow active indicator.
- If the desktop streak card is present, it must use real learning history rather than fixed display data.

--------------------------------
# CARD STYLE

Use the Test page card language everywhere:
- border radius: 20-24px for large panels, 18-22px for inner cards
- border: subtle tinted 1px border
- background: white or very soft tinted white
- shadow: soft blue-tinted shadow only
- selected state: stronger blue border, soft blue glow, real check indicator if selection is needed
- hover: small lift, stronger border, slightly stronger shadow

Avoid:
- heavy borders
- saturated full-card backgrounds except deliberate hero banners
- nested card stacks
- random gradients
- oversized decorative blobs

--------------------------------
# MODE / MODULE CARDS

The approved mode-card structure is:
- decorative transparent PNG icon on the left
- real title, meta, and helper text in the center
- real circular arrow button on the right
- soft tinted background and border based on the card's semantic color

Current approved exam mode assets:
- `public/images/ui-assets/exam-mode-quiz-blue-v1.png`
- `public/images/ui-assets/exam-mode-fillblank-violet-v1.png`
- `public/images/ui-assets/exam-mode-spelling-cyan-v1.png`
- `public/images/ui-assets/exam-mode-matching-orange-v1.png`

Generated assets must not contain Chinese text, progress values, buttons, or navigation.

--------------------------------
# APPLYING THIS TO EXISTING PAGES

When updating older pages, keep their behavior and state unchanged, but restyle them toward the Test page:
- replace page-local visual systems with shared `AppLayout` chrome
- use white/tinted panels instead of old standalone surfaces
- move page-specific controls into content panels
- use decorative 3D PNGs only for module art, hero art, stat icons, and empty states
- keep real DOM for all actions, counters, progress, and text

Priority pages to align next:
- 今日计划
- 训练中心
- 单词学习 desktop shell

Already aligned:
- 测试选择页 and four internal exam modes
- 阅读选择 inline picker
- 阅读正文 session page
- 统计 dashboard
- 复习 / 错题 / 已学习 / 已掌握集合页
- shared sidebar/topbar chrome on desktop app pages

Collection page rule:
- Keep only a compact top progress strip above the content panel.
- Put page tools such as 返回、首页、搜索、同步、发音 and QuickMenu inside the content panel.
- Empty states use a large decorative PNG illustration and soft blue/purple panel art, while all text, progress, buttons, and actions remain real DOM.

--------------------------------
# VERIFICATION

For every page converted to this direction:
- `npm run lint` must pass
- `npm run build` must pass
- desktop `1440x900` should have no horizontal overflow
- mobile `390px` width should have no clipped text or overlapping controls
- generated assets must remain decorative only
- app logic, routes, storage, sync, progress, and learning behavior must remain unchanged
