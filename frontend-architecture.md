# FRONTEND ARCHITECTURE

## Goal

Build a scalable production edtech SaaS frontend without changing learning behavior, routes, storage, sync, or data loading logic.

## Source Of Truth

- UI rules: `agents.md`
- Visual language: `test-page-visual-language.md`
- Tokens and reusable components: `design-system.md` and `component-system.md`
- Product direction: `plan.md`
- Project/runtime context: `PROJECT_CONTEXT.md`

## Structure

```text
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
```

## Architecture Rules

1. Desktop pages use the shared app chrome through `AppLayout`, or directly import the canonical `Sidebar.jsx` and `Topbar.jsx` only when a specialized internal layout requires it.
2. Mobile pages use the shared `MobileTopbar` and `MobileBottomNav` through `AppLayout`.
3. Mobile word-learning is the only app-shell exception and may use `className="ds-app-layout--mobile-study"`.
4. New UI should come from shared components first; avoid page-local copies of cards, buttons, nav, topbars, progress, or picker surfaces.
5. Page-specific tools such as search, sync, filters, progress controls, QuickMenu, and mode switches belong inside page content panels.
6. Generated images live in `public/images/ui-assets/` and remain decorative only.
7. Do not reintroduce deleted legacy UI surfaces such as old reading list pages, old category selectors, generic `Card.jsx`, or duplicated progress components.

## Page Composition

今日计划:

```text
AppLayout -> HeroCard -> PlanStatusCards -> StatsRow -> Status summary
```

训练中心:

```text
AppLayout -> HeroCard -> main ModuleCards -> inline word/reading picker panels -> MotivationBand -> StatsRow
```

阅读正文:

```text
AppLayout -> goal strip -> large reading card -> desktop status aside -> bottom actions
```

考试答题:

```text
AppLayout -> control card -> thin progress bar -> centered answer card
```

## Behavior Boundaries

- `HomeScreen` is the Training Center view.
- 背单词 opens `#word-category-panel`; 做阅读 opens `#reading-category-panel`.
- The 阅读 navigation entry returns to Training Center and opens the reading picker, not a standalone reading list.
- Reading level cards and article rows live in `src/components/reading/ReadingPicker.jsx`.
- Reading sessions use `ReadingSessionView` with shared `AppLayout` chrome.
- `ExamPracticeView` is the shared test range/mode picker for sidebar 测试 and Training Center 做测试.
- Internal exam modes render through `LearningView` when `mode !== "learn"`.
- Theme state stays in `ThemeProvider` / `useTheme`; do not add a second theme storage contract.

## Verification

Run:

```bash
npm run lint
npm run build
```

For UI work, also verify:

- desktop `1440x900`: no horizontal overflow, shared sidebar/topbar present
- mobile around `390px`: no clipped text or overlapping controls
- mobile word-learning around `430x932`: dedicated study chrome, no generic mobile nav, bottom actions horizontal
- Training Center: hero, four modules, word picker, reading picker, Daily Progress
- Reading entry: sidebar/mobile 阅读 opens Training Center reading picker
- Exam pages: shared chrome, testing nav active, no “已同步” chip in the exam control card
