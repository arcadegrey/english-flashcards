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
8. Desktop app chrome is shared: use the approved 今日计划 chrome from `src/components/layout/Sidebar.jsx` and `src/components/layout/Topbar.jsx` through <AppLayout> or direct imports. Page-local desktop sidebars/topbars are not allowed.

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
- Current Training Center uses blue/yellow generated PNGs in `public/images/ui-assets/`:
  - `training-hero-flashcards-blue-v1.png`
  - `training-card-vocabulary-blue-v1.png`
  - `training-card-reading-blue-v1.png`
  - `training-card-review-blue-v1.png`
  - `training-card-test-blue-v1.png`
  - `category-all-words-blue-v1.png`
  - `category-daily-words-blue-v1.png`
  - `category-cet4-blue-v1.png`
  - `category-cet6-blue-v1.png`
  - `category-toefl-blue-v1.png`
  - `category-ielts-blue-v1.png`
- Source/sprite images may be kept beside final exported icons, but app code should reference the final transparent PNG assets.

## Training Center Behavior
- `HomeScreen` is the Training Center view.
- The page structure stays: AppLayout -> HeroCard -> main ModuleCards -> inline picker panels -> MotivationBand -> StatsRow.
- 背单词 opens `#word-category-panel` inline and scrolls to it.
- 做阅读 opens `#reading-category-panel` inline and scrolls to it.
- The word and reading pickers are mutually exclusive, except search can force the word picker open.
- Selecting TOEFL / IELTS still routes through the existing TOEFL/IELTS flows; do not bypass existing loading or learning logic.
- Selecting a reading level shows article cards inside the same panel; selecting an article opens `readingSession` through the existing handler.

## Responsive Behavior
- Desktop uses sidebar + topbar + content composition.
- Desktop sidebar and topbar must stay visually identical across homepage, training center, learning pages, statistics, reading, review, and test surfaces by reusing `Sidebar.jsx` / `Topbar.jsx` directly or through `AppLayout.jsx`.
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
- For Training Center desktop UI work, verify `1440x900`: blue hero banner, four main cards, word category panel, reading category panel, Daily Progress, and no horizontal overflow.
