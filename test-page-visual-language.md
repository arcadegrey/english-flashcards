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

## Dark home companion (2026-10-26)

The user requested a dark version of the existing home. Preserve its composition, spacing, real data and interactions; light remains the default and the visual benchmark.

- Background: `#101724`; shared sidebar: `#121C2C`.
- Card: `#192334`; raised controls: `#1E2B40`; inset rows: `#141E2E`.
- Text: `#EDF3FF`; muted text: `#A4B3CC`; text links: `#9BBCFF`.
- Keep the established primary blue buttons and selected navigation. Pastel mode colors become small muted icon surfaces or subtle carousel tints.
- Keep existing transparent artwork; reduce brightness slightly and darken the mobile landscape behind real text. Do not invert the page or images.
- Desktop and mobile share theme controls through the existing topbars. Restore the saved local preference on startup; do not force dark or follow the OS automatically.
- Dark home and adjacent Training Center styles live in `src/styles/dark-home.css`; this is not a redesign of every learning, classroom or account screen.

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

Home light material: the existing carousel may use a translucent white-blue surface, restrained backdrop blur, thin white inner highlights and a soft blue shadow. Supporting dashboard panels use a lighter version of the same material. Keep foreground text and controls crisp; highlight layers must not intercept input. These light-only rules live in `study-dashboard.css` and do not override the dark companion or other page cards.

Home carousel artwork: all four study previews use the frosted flashcard illustration as their material reference, with matching frosted review/book/target assets. Keep one shared artwork frame and opacity across cards in each responsive layout and theme. Do not restore per-module placement, scale or opacity fixes. Small task icons remain independent from hero artwork.

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

When restyling older pages, preserve behavior and state outside the requested functional scope and move their visuals toward the Test page:
- replace page-local visual systems with shared `AppLayout` chrome
- use white/tinted panels instead of old standalone surfaces
- move page-specific controls into content panels
- use decorative 3D PNGs only for module art, hero art, stat icons, and empty states
- keep real DOM for all actions, counters, progress, and text
- reading level and article picker cards should mirror the Test page practice-mode card rhythm when they appear inside Training Center

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
- UI-only changes must preserve app logic, routes, storage, sync, progress, and learning behavior; requested functional changes require relevant tests and compatibility checks
