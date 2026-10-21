# Project Context

## Purpose

Vite + React English learning app for flashcards, tests, spelling, matching, reading practice, wrong-word review, exam practice, statistics, and Cloudflare sync.

This file is intentionally short for Codex startup context. Detailed data/audio/import/Worker notes live in `docs/project-reference.md`.

## Commands

- Frontend dev: `npm run dev`
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
- Preview build: `npm run preview`
- Worker dev: `npm run worker:dev`

Less common maintenance commands are listed in `docs/project-reference.md`.

## UI Rules

- Do not change backend logic, routes, state, storage, sync, or learning behavior unless explicitly requested.
- Current global visual language is `test-page-visual-language.md`: white and very light blue surfaces, primary blue `#4F7CFF` / `#2F6DFF`, secondary blue `#7EA6FF`, light background `#F7FAFF`, card background `#FFFFFF`, text `#0F172A` / `#64748B`.
- Desktop pages use shared chrome through `AppLayout`, `Sidebar.jsx`, and `Topbar.jsx`; do not create page-local desktop navigation or topbars.
- Desktop topbar visible slots stay identical to 今日计划: title/subtitle left; calendar, notification, and `Aa` account chip right. Page-specific controls belong inside content panels.
- Mobile uses shared `MobileTopbar` and `MobileBottomNav`, except mobile word-learning mode, which uses `.ds-app-layout--mobile-study`.
- Use generated assets only for decorative art/icons/empty states. Buttons, text, stats, progress, navigation, and cards must be real frontend components.
- Production module/category icons should use assets from `public/images/ui-assets/`, not emoji.
- Product is currently fixed to light mode. `ThemeContext` remains, but startup forces light and global theme toggles are not rendered.

## Key Screens

- `studyHub`: 今日学习计划 and training entry.
- `planSettings`: daily new-word target settings, persisted to `flashcards_daily_new_word_target`.
- Plan settings also select a persistent local vocabulary category (`flashcards_study_plan_category`). Home new-word cards start that category directly; all exam scopes and quiz distractors are restricted to it. Training Center category browsing remains independent.
- `home`: Training Center with hero, four module cards, inline word picker, inline reading picker, motivation band, and Daily Progress.
- `learn`: shared learning container; `LearningView` renders study/test/fill/spelling/matching modes.
- `readingSession`: reading article practice using shared `AppLayout`.
- `todayReview`, `wrongWords`, `learnedWords`, `masteredWords`: word collection pages.
- `statistics`: learning statistics.
- `examPractice`: exam practice range and mode selection.
- `classroom`: teacher/student cloud profiles, invite-code classes, student roster and read-only word progress; accessed from the account panel. See `docs/classroom-system.md` for permissions and deployment.

## Important Files

- Layout: `src/components/layout/AppLayout.jsx`, `Sidebar.jsx`, `Topbar.jsx`, `MobileAppChrome.jsx`
- UI primitives: `src/components/ui/Buttons.jsx`, `Cards.jsx`, `Progress.jsx`
- Reading: `src/components/reading/ReadingPicker.jsx`, `src/components/ReadingSessionView.jsx`, `src/data/readings.js`
- Learning: `src/components/WordCard.jsx`, `src/components/QuickMenu.jsx`
- Vocabulary loading: `src/data/vocabulary.js`
- Speech: `src/utils/speech.js`, `src/components/VoiceSettings.jsx`
- Classrooms: `src/components/ClassroomView.jsx`, `src/components/classroom/StudentProgressPanel.jsx`, `src/utils/classroomApi.js`, `worker/classroom.js`; new tables are created idempotently by the existing schema deployment step.
- Design docs: `agents.md`, `frontend-architecture.md`, `design-system.md`, `component-system.md`, `test-page-visual-language.md`

## Core Data

- Startup vocabulary: `public/data/vocabulary/core.json`
- Full vocabulary: `public/data/vocabulary.json`
- TOEFL shards: `public/data/vocabulary/toefl/`
- IELTS shards: `public/data/vocabulary/ielts/`
- User progress: local storage, optionally synced through Cloudflare Worker + D1.
- App startup loads only `core.json` plus TOEFL/IELTS manifests; specific TOEFL/IELTS ranges load shards on demand.
- Production build does not copy `public/audio` into `dist`.

## Reading Rules

- Training Center owns the reading entry through inline `ReadingPickerContent`.
- The 阅读 nav item returns to Training Center and opens the reading picker; do not recreate a standalone reading-list page.
- Reading level cards and article rows must use `src/components/reading/ReadingPicker.jsx`.
- Reading article sessions must use `ReadingSessionView` with shared `AppLayout`; page actions belong inside the content workspace.

## Current Risks

- Reading highlights may need a dedicated lookup or shard preloading for TOEFL/IELTS words that are not loaded yet.
- Worker login depends on Resend and production secrets.
- Daily new-word target is local-only and is not synced in the Cloudflare progress payload.
- Codex in-app Browser has previously timed out on local pages; verify with `curl`, builds, or another browser method when needed.

## Next Work

See `plan.md` for the product roadmap. Current priorities:

1. Complete 今日学习计划 loop.
2. Clean remaining TOEFL/IELTS selector and legacy styling.
3. Add learning goals: IELTS / TOEFL / daily English.
4. Improve reading completion results, wrong-answer explanations, and weak-word recovery.
5. Continue productizing statistics across words, reading, and exam practice.
