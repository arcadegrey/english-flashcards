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
    /reading

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

The current Test page is the approved global visual benchmark. Use `test-page-visual-language.md` before polishing older pages.

--------------------------------
# IMPLEMENTATION RULES

## UI Layer
- Keep layout, text, buttons, cards, navigation, progress, and stats as real frontend code.
- Keep hover, click, focus, and responsive states code-native.
- Use shared tokens and CSS classes from the design system.
- When restyling existing pages, move them toward the Test page's white/tinted panel system, blue selected states, semantic pastel cards, and soft 3D decorative PNG assets without changing behavior.

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
- Training Center intentionally has no keyword search bar.
- 背单词 opens `#word-category-panel` inline and scrolls to it.
- 做阅读 opens `#reading-category-panel` inline and scrolls to it.
- The word and reading pickers are mutually exclusive.
- Selecting TOEFL / IELTS still routes through the existing TOEFL/IELTS flows; do not bypass existing loading or learning logic.
- Selecting a reading level shows article cards inside the same panel; selecting an article opens `readingSession` through the existing handler.
- Reading navigation must also open the Training Center reading panel. Do not reintroduce a standalone `ReadingListView` route or page-local reading topbar/list UI.
- Reading level cards and reading article rows live in `src/components/reading/ReadingPicker.jsx`; reuse this shared component instead of duplicating markup in `HomeScreen`.
- `readingSession` uses `ReadingSessionView` inside shared `AppLayout`, with 阅读 active in navigation. It keeps reading logic, questions, translation, highlighted vocabulary, and word modal behavior unchanged while using the word-learning-style study surface.
- Reading page-specific controls must stay inside the reading workspace or aside: 返回列表, 显示/收起翻译, 朗读全文, 同步进度, and QuickMenu. Do not add these controls to the global Topbar.

## Exam Practice Behavior
- `ExamPracticeView` is the test range/mode picker, reached from both sidebar 测试 and Training Center 做测试.
- 全范围随机 must use the complete vocabulary count and load exam shards on demand; do not fall back to the startup `core.json` count.
- Internal exam modes are rendered by `LearningView` with `mode !== "learn"` and use the shared `AppLayout` chrome.
- The internal exam workspace uses a focused shell: control card, thin progress bar, centered answer card, and in-card stats. The global Topbar remains unchanged.
- The exam control card contains 返回, question count, and QuickMenu only. Account/sync state should stay in the global account chip, not in the exam control card.

## Responsive Behavior
- Desktop uses sidebar + topbar + content composition.
- Desktop sidebar and topbar must stay visually identical across homepage, training center, learning pages, statistics, reading, review, and test surfaces by reusing `Sidebar.jsx` / `Topbar.jsx` directly or through `AppLayout.jsx`.
- Medium screens may hide large decorative hero artwork before breaking core content.
- Mobile stacks hero content, cards, and stats without clipping text or controls.
- Mobile uses <MobileTopbar> and <MobileBottomNav> inside <AppLayout>; do not create page-local mobile nav.
- Exception: mobile word-learning mode may use the dedicated `.ds-app-layout--mobile-study` chrome so the study screen can match the clean flashcard reference. In that mode, hide generic `MobileTopbar`, hide `MobileBottomNav`, and hide the desktop learning-status aside.
- Mobile reading sessions are not part of the word-learning exception. They keep the generic `MobileTopbar` and `MobileBottomNav`, with the reading card and actions stacked without horizontal overflow.
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
- For mobile word-learning UI work, verify around `430x932`: no generic mobile topbar/bottom nav, no learning-progress/continuous-check-in side panels, bottom actions remain horizontal, and there is no horizontal overflow.
- For Training Center desktop UI work, verify `1440x900`: blue hero banner, four main cards, word category panel, reading category panel, Daily Progress, and no horizontal overflow.
- For reading UI work, verify that clicking the shared sidebar/mobile reading entry lands on Training Center with `#reading-category-panel` open, not on a standalone reading list.
- For reading session UI work, verify desktop `1440x900` and mobile around `390x844`: no old `.learn-refresh-topbar`, shared chrome is present, 阅读 navigation is active, reading text and actions fit, and there is no horizontal overflow.
- For exam UI work, verify desktop `1440x900` and mobile around `390x844`: shared chrome is present, 测试 navigation is active, four modes render with the control card/progress/card shell, no “已同步” chip appears in the exam control card, and there is no horizontal overflow.
