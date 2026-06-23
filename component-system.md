# COMPONENT SYSTEM

## App Shell

Canonical components:

- `AppLayout`
- `Sidebar`
- `Topbar`
- `MobileTopbar`
- `MobileBottomNav`

Rules:

- Desktop pages reuse the shared `AppLayout` chrome or directly import the canonical `Sidebar.jsx` and `Topbar.jsx` for specialized layouts.
- Do not create page-local desktop sidebars or topbars.
- Desktop Topbar visible actions stay identical to 今日计划: calendar, theme toggle, notification, and account chip.
- `AppLayout` may receive `className="ds-app-layout--mobile-study"` only for mobile word-learning.
- `Sidebar.jsx` may show the desktop “连续学习” card only from real `studyHistory`; do not hardcode streak values.

## UI Components

Cards:

- `BaseCard`
- `HeroCard`
- `ModuleCard`
- `StatCard`
- `StatusCard`

Buttons:

- `PrimaryButton`
- `SecondaryButton`
- `IconButton`

Progress:

- `CircularProgress`
- `LinearProgress`

Rules:

- Cards own structure, spacing, radius, elevation, hover, and responsive behavior.
- Buttons remain real `button` elements.
- Progress values are real CSS/SVG/frontend state, never baked into images.
- Theme toggle uses `IconButton` and existing theme context.
- New or redesigned surfaces should follow the Test page white/blue card language.

## Module Components

Core module surfaces:

- `VocabularyModule`
- `ReadingModule`
- `ReviewModule`
- `TestModule`
- `ReadingPickerContent`
- `ReadingSessionView`
- `WordCard`

Training Center:

- Four main `ModuleCard` entries: 背单词 / 做阅读 / 今日复习 / 做测试.
- Six compact word-category `ModuleCard` entries: 全部单词 / 日常常用 / 四级核心 / 六级核心 / 托福词汇 / 雅思词汇.
- 背单词 opens the word picker; 做阅读 opens the reading picker.
- Sidebar/mobile 阅读 also opens the Training Center reading picker.
- Reading picker UI is shared in `src/components/reading/ReadingPicker.jsx`.

Reading session:

- Lives in `src/components/ReadingSessionView.jsx`.
- Uses shared `AppLayout`.
- Keeps goal strip, large reading card, desktop status aside, real bottom actions, and QuickMenu inside content.

Word learning:

- Word card UI lives in `src/components/WordCard.jsx`.
- Mobile word-learning shows only the dedicated header, goal strip, word card, and three bottom actions: 不认识 / 显示提示 / 认识了.
- Do not restore old `CategorySelector.jsx`, old `components/Progress.jsx`, or generic `Card.jsx`.

Exam practice:

- `ExamPracticeView` is the range and mode selection surface.
- `LearningView` renders internal modes when `mode !== "learn"`.
- Internal exam modes share the focused shell: control card, thin progress bar, centered answer card.
- Control card contains 返回, question count, and QuickMenu only.

## Asset Props

`ModuleCard` supports:

- `iconSrc`
- `artSrc`
- `variant`

Rules:

- Decorative images may be passed into cards, but card text/actions stay real DOM.
- `variant` may tune visuals only; it must not change routing or learning behavior.
- Prefer transparent PNG assets over emoji in production UI.

## Do Not Use Generated Images For

- buttons
- text
- navigation
- progress values
- stats numbers
- full-page screenshots
