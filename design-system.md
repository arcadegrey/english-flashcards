# DESIGN SYSTEM

--------------------------------
# COLORS
Primary: #6C7BFF -> #8B7CFF
Background: #F7F9FF
Card: #FFFFFF

Green: success
Orange: warning
Blue: reading/active

Rules:
- Primary surfaces use blue-purple gradients only.
- Green is reserved for success/completion states.
- Orange/yellow is reserved for streaks, goals, or highlight stats.
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

--------------------------------
# ICON STYLE
- unified soft 3D icons
- no mixed icon styles
- Generated icons must have transparent backgrounds.
- No Chinese text inside generated assets.
- No progress numbers or UI controls inside generated assets.

--------------------------------
# HOMEPAGE PATTERN

## Sidebar
- Width around 240px.
- Nav item height 44-48px.
- Nav item radius 12-14px.
- Icon/text gap 12px.
- Active state is a soft gradient tint, not a large primary button.
- Labels should be concise: 今日计划 / 训练中心 / 单词 / 阅读 / 复习 / 测试 / 统计.

## Topbar
- Lightweight, calm, and secondary to the page title.
- Right-side icon buttons use consistent size and alignment.
- Avatar/login state should feel polished but not heavy.
- Theme switching is a topbar icon button using the same icon-button system; show moon for switching to dark and sun for switching to light.

## Hero
- Strongest visual focus on the page.
- Left area: badge, title, subtitle, learned progress pill.
- Center area: real circular progress and real CTA buttons.
- Right area: decorative soft 3D "Aa" flashcard asset.
- Hero should feel intentionally composed, not assembled from unrelated pieces.

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

## Mobile Training Cards
- Training module cards use a consistent white card surface in light mode.
- Do not use emoji as production card icons when decorative UI assets exist.
- Small module icons sit in the card's upper-right corner.
- Large decorative art can sit inside the card body, but must not obscure real text or the arrow button.
- The arrow remains a real button affordance, not an image.

## Mobile Status Cards
- Status cards stack with 16px gaps on mobile.
- Card actions should be at least 48px tall for comfortable tapping.
- Illustration and action button should be distributed across the card width instead of being cramped in one narrow right column.
