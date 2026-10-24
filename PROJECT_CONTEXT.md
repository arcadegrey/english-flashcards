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

## Work Scope

- Development is not limited to UI. Modify frontend logic, backend APIs, database schema, storage, sync, and learning behavior as needed for the requested task.
- Preserve unrelated functionality and existing user data. UI-only tasks keep existing behavior unchanged; functional changes must maintain account isolation, authorization, data compatibility, and sync correctness, with relevant tests and migration/deployment notes.

## UI Rules

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
- Plan settings also select a persistent vocabulary category (`flashcards_study_plan_category`). Home new-word cards start that category directly; all exam scopes and quiz distractors are restricted to it. Training Center category browsing remains independent.
- `home`: Training Center with hero, four module cards, inline word picker, inline reading picker, motivation band, and Daily Progress.
- `learn`: shared learning container; `LearningView` renders study/test/fill/spelling/matching modes.
- `readingSession`: reading article practice using shared `AppLayout`.
- `todayReview`, `wrongWords`, `learnedWords`, `masteredWords`: word collection pages.
- `statistics`: learning statistics.
- `examPractice`: exam practice range and mode selection.
- `classroom`: teacher/student cloud profiles, invite-code classes, student roster, word/reading progress, and assigned reading with server-graded first submissions; accessed from the account panel. See `docs/classroom-system.md` for permissions and deployment.

## Important Files

- Layout: `src/components/layout/AppLayout.jsx`, `Sidebar.jsx`, `Topbar.jsx`, `MobileAppChrome.jsx`
- UI primitives: `src/components/ui/Buttons.jsx`, `Cards.jsx`, `Progress.jsx`
- Reading: `src/components/reading/ReadingPicker.jsx`, `src/components/ReadingSessionView.jsx`, `src/data/readings.js`
- Learning: `src/components/WordCard.jsx`, `src/components/QuickMenu.jsx`
- Vocabulary loading: `src/data/vocabulary.js`
- Speech: `src/utils/speech.js`, `src/components/VoiceSettings.jsx`
- P1 assignments/review/content: `docs/p1-features.md`; word assignment APIs in `worker/wordAssignments.js`, reading history in `worker/readingAttempts.js`, original foundation readings in `src/data/foundationReadings.js`.
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
- Daily target and plan category now sync through versioned `user_progress.preferences`; older databases require the existing idempotent migration step.
- Codex in-app Browser has previously timed out on local pages; verify with `curl`, builds, or another browser method when needed.

## Reading Drafts And Assignments

- Shared normalization: `shared/planPreferences.js` and `shared/readingQuestions.js`.
- Reading drafts: `src/hooks/useReadingDraft.js`, scoped local storage and authenticated `/api/reading-sessions/:key`.
- Assignment UI: `src/components/classroom/ReadingAssignments.jsx`, reused in 今日计划 and classroom.
- Assignment API: `worker/readingAssignments.js`; published articles/questions are snapshots, grading is server-side, and first submission is immutable.
- Progress GET returns `updatedAt`; PUT uses compare-and-swap retries and preserves preferences from older clients.
- Local learning cache is archived per account on switching. Anonymous learning can merge on login; another signed-in user's data never merges. Other tabs reload on account changes; stale progress/draft writes carry an expected-user check.
- Deploy with `npm run d1:migrate` before the updated Worker; new tables and preferences column are additive. Local preview migrations operate only on the ignored SQLite database.

## P1 Status

- Production D1 migration completed and verified on 2026-10-21 for `english-flashcards`. On 2026-10-22 the user confirmed pushing the release; public site assets contain P1 assignment results and the word-assignment API responds with authentication required. No authenticated production flow was tested. Audit: `docs/d1-p1-deployment.md`.
- Ranged vocabulary assignments, student home tasks, teacher completion/grade lists, reading attempt snapshots, and wrong-only retries are implemented. See `docs/p1-features.md` for scope and deployment.
- Reading content is now 26 articles, 19 with questions, 69 questions, including 4 A1 and 4 A2 articles and questions for all 5 B1 articles.
- Reading history is separate from old aggregate progress; old records without saved answers cannot be reconstructed.

## Learning Trust (2026-10-23)

- Word hints use source-checked notes for 3000 common/core words (2842 scoped notes: 92 synonym, 78 confusable, 2672 usage; 5684 original bilingual examples; original 47 words with formation/family notes retained). Data: `src/data/coreWordNotes.js` aggregates daily/everyday/usage notes plus three `expansion*WordNotes.js` modules. `wordHints.js` renders usage notes as “用法提示” in the existing card. Source audit: `docs/word-notes-coverage.md`; editorial rules: `docs/core-word-notes.md`. Uncovered words retain entry-based hints.
- Word bookmarks persist per account and sync via `user_progress.preferences.wordBookmarks`, with per-word timestamps and removal tombstones. Entry points: word card and account panel; the collection reuses `WordCollectionView`. No D1 migration required; deploy updated Worker and frontend together.
- Existing `masteredWords` displays as “标记认识” across personal, reading, test and teacher screens. It records self-assessment or practice results, not verified long-term mastery. Existing learning records and review behavior remain compatible.
- Scope, tests and deployment notes: `docs/learning-trust.md`.
- Content milestone: 3000 words completed. Next priority is independent language review, high-value sense gaps and directly supported formation notes. Do not force synonyms or roots to reach a number. Regenerate coverage with `node scripts/report-word-notes.mjs`. Preserve explicit word matching for example emphasis.
- Latest local verification (2026-10-24): focused core-word-notes checks (11) and production build/PWA only; user requested lightweight verification for content changes, so no full suite/browser rerun. No new D1 migration; content changes need frontend deployment. If the earlier bookmark release is still pending, deploy Worker + frontend together and complete authenticated production acceptance.

## Next Work

P2 adds personal test results (four modes, local drafts, account-scoped history and offline retry), teacher weekly reports with weakness-based assignment preparation, and weekly goals/milestone feedback. See `docs/p2-features.md`. The additive production `exam_attempts` schema was applied and verified on 2026-10-22; existing records were retained. See `docs/d1-p2-deployment.md`. P2 Worker/frontend deployment is pending the user's manual Git push.

See `plan.md` for the product roadmap. Current priorities:

1. Complete 今日学习计划 loop.
2. Clean remaining TOEFL/IELTS selector and legacy styling.
3. Add learning goals: IELTS / TOEFL / daily English.
4. Expand reading content further and improve weak-word recovery; the first reading history and wrong-answer review loop is implemented.
5. Continue productizing statistics across words, reading, and exam practice.
