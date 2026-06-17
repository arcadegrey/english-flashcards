# FRONTEND ARCHITECTURE

--------------------------------
# GOAL
Build a scalable production edtech SaaS frontend.

--------------------------------
# STRUCTURE

/src
  /components
    /layout
    /ui
    /modules

  /pages
  /design-system
  /hooks
  /utils

/public
  /images
    /ui-assets

--------------------------------
# RULES

1. All pages must use <AppLayout>
2. All UI must come from components
3. No hardcoded styling
4. No one-off UI
5. New UI -> create component first
6. Do not change backend logic when polishing UI
7. Generated images must remain decorative assets only

--------------------------------
# PAGE RULE
Every page must follow:

Layout -> Hero -> Modules -> Stats

For the Today Plan homepage:

AppLayout -> Sidebar + Topbar -> HeroCard -> PlanStatusCards -> StatsRow -> Status summary

--------------------------------
# QUALITY GOAL
Production SaaS level consistency

--------------------------------
# IMPLEMENTATION RULES

## UI Layer
- Keep layout, text, buttons, cards, navigation, progress, and stats as real frontend code.
- Keep hover, click, focus, and responsive states code-native.
- Use shared tokens and CSS classes from the design system.

## Assets
- Store UI artwork in `public/images/ui-assets/`.
- Use transparent PNGs for generated visual assets.
- Reference assets from components as decorative images with empty alt text when appropriate.
- Do not place Chinese text, progress numbers, buttons, or UI controls inside generated images.

## Responsive Behavior
- Desktop uses sidebar + topbar + content composition.
- Medium screens may hide large decorative hero artwork before breaking core content.
- Mobile stacks hero content, cards, and stats without clipping text or controls.
- Mobile uses <MobileTopbar> and <MobileBottomNav> inside <AppLayout>; do not create page-local mobile nav.
- Mobile bottom nav reuses the same `navItems` callbacks as desktop navigation.
- View changes should reset window scroll to top so routes opened from deep mobile sections start at the correct position.

## Theme Behavior
- Theme state lives in `ThemeProvider` / `useTheme`.
- Homepage and training center pass `toggleTheme` into AppLayout topbar props.
- Theme preference persists through existing storage keys; do not add a second localStorage contract.

## Verification
- Run `npm run lint`.
- Run `npm run build`.
- Manually check that interactive UI remains real components and generated assets remain decorative.
- For mobile UI work, verify at a 390px-wide viewport and test the main tap path: 今日 -> 训练 -> 背单词 -> 分类选择 -> IELTS/TOEFL.
