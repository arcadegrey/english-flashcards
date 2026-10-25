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

- Word hints cover all 8699 existing vocabulary entries (8541 scoped notes: 92 synonym, 78 confusable, 8371 usage; 17082 original bilingual examples; original 47 words with formation/family notes retained). Data: `src/data/coreWordNotes.js` aggregates daily/everyday/usage notes plus nine `expansion*WordNotes.js` modules. The last 2699 entries are independent 900/900/899 batches. `wordHints.js` renders usage/spelling notes in the existing card. Source audit: `docs/word-notes-coverage.md`; editorial rules: `docs/core-word-notes.md`. Future/custom words without curated notes retain entry-based hints.
- Word bookmarks persist per account and sync via `user_progress.preferences.wordBookmarks`, with per-word timestamps and removal tombstones. Entry points: word card and account panel; the collection reuses `WordCollectionView`. No D1 migration required; deploy updated Worker and frontend together.
- Existing `masteredWords` displays as “标记认识” across personal, reading, test and teacher screens. It records self-assessment or practice results, not verified long-term mastery. Existing learning records and review behavior remain compatible.
- Scope, tests and deployment notes: `docs/learning-trust.md`.
- Content milestone: all 8699 existing entries covered, including phrases, proper names and explicit spelling/expression corrections. Original vocabulary/IDs, meanings, audio, progress and sync are preserved; notes clarify unreliable legacy entries rather than silently rewriting them. Next priority is independent language review, high-value sense gaps and a separately scoped base-vocabulary quality audit. Do not force synonyms or roots to reach a number. Regenerate coverage with `node scripts/report-word-notes.mjs`.
- Base-vocabulary audit (2026-10-24): read-only screening of all 8699 entries plus a single-model first review identified 33 record issues; 111 additional candidates are 104 missing phonetics, one missing POS and six sense-alignment questions. These counts do not represent a complete word-by-word expert review. Findings, false-positive exclusions, source references and repair/audio compatibility requirements: `docs/base-vocabulary-audit.md`; machine report: `.json` alongside it. Reproduce with `node scripts/audit-base-vocabulary.mjs`; review register: `data/vocabulary-audit-reviews.json`. No vocabulary, shards, hints, audio or application behavior changed. Next: repair the confirmed issues in bounded batches while preserving IDs and regenerating affected audio.
- Base-vocabulary repair (2026-10-24): the 33 confirmed records are corrected locally; 111 screening candidates remain unreviewed. All 8699 IDs/order/categories are retained. Corrected spectator and precaution each collide with an existing headword, so both IDs remain (8697 distinct spellings), with legacy lookup aliases and per-ID note provenance. Quiz/fill/matching/new assignment distractors exclude identical headwords. Four word recordings and eleven example recordings use 60 versioned four-voice assets hosted in R2, avoiding stale CDN audio. No D1 migration; deploy Worker + frontend + new assets together. Details and actual verification status: `docs/vocabulary-repair-2026-10-24.md`.
- Vocabulary inclusion audit (2026-10-25): read-only screening of 8699 records produced 459 explicitly reviewed entries: 148 personal-name entries proposed outside default required study, 99 proposed for optional topics, 174 retained, 36 requiring sense/hint/register review, and two restricted to contextual recognition. These are single-model curriculum recommendations, not implemented exclusions, a complete expert review, or official exam-list certification. The ECDICT expansion mixed high-frequency candidates into `daily|cet4`, so the current category is not proof of CET4 provenance. Newly logged conflicts include teen, mick, kong and name/common-word homographs. Report: `docs/vocabulary-inclusion-audit.md` and `.json`; reproduce with `node scripts/audit-vocabulary-inclusion.mjs`. No runtime/data/audio changes or migration. This does not complete or replace the earlier 111-candidate review.
- Example inflections use per-example `forms` annotations with a headword, literal form, registered references and source-checked review (144 annotations, including the initial eight). `getHintExampleParts` matches complete accented words, compounds, contractions and multiword phrases; quoted terms work without matching possessive/compound substrings. Six explicit spelling/expression mappings use `group.correction.canonical` while preserving raw keys. Draft, missing-source, unrelated or absent forms never add emphasis or references. Never infer stems or suffixes at runtime. Details: `docs/core-word-notes.md`.
- Latest local verification (2026-10-24): 25 focused core-word-notes/learning-trust checks, lint, production build/PWA and 14-word browser checks passed; 1440px desktop, 390px mobile, collapse accessibility and offline phrase hints verified. Content audit confirms the exact 2699-word difference, 5398 new examples with no exact duplicates against old hints/vocabulary, preserved prior 6000 entries and source evidence for every new reference. No full suite rerun. New batches are preloaded/precached (about 354/438/418 kB); index remains about 1.78 MB with the existing large-chunk warning. No D1 migration; publish frontend for this content/rendering change. If the earlier bookmark release is pending, deploy Worker + frontend together and complete authenticated production acceptance.

## Practical Vocabulary Replacement (2026-10-25)

- User authorized replacing the 148 personal-name entries and all 99 optional-topic entries (247 total). Active vocabulary remains 8699 records; new IDs 8700–8946 are all `daily`. Counts: daily 2029, CET4 2075, CET6 1520, TOEFL 3251, IELTS 3257; startup core 3481.
- `shared/retiredVocabulary.js` preserves the 247 originals for history, bookmarks, teacher lookups and offline exam grading. Never reuse retired IDs, merge their progress into replacements, or add them to active study/new assignments. Existing assignment snapshots stay immutable. Daily review excludes retired IDs; raw user records remain stored.
- New notes: `src/data/practicalWordNotes.js`; 494 original bilingual examples, active coverage 8699, reference coverage including retired entries 8946. The 1976 local Kokoro four-voice recordings are generated under `public/audio-updates/2026-10-25/` and published to the R2 `audio-updates` prefix with text/hash guarded URLs. MP3s are ignored and excluded from builds; keep only manifests/mappings in Git. See `docs/audio-r2-release-2026-10-25.md` for upload verification and the upload-before-push workflow.
- Handoff, evidence and commands: `docs/practical-vocabulary-replacement-2026-10-25.md`. Deploy frontend, Worker and audio together; no D1 migration, Git push or production deployment performed. Local checks: 123 tests, lint, production build/PWA, Worker dry-run, all-file audio decode/hash checks and isolated desktop/mobile browser checks. No full manual listening or authenticated production acceptance.

## Next Work

- Versioned audio R2 release completed on 2026-10-25: 60 repair + 1976 replacement MP3s and two manifests uploaded to `english-flashcards-audio/audio-updates/`. All 2036 public MP3s and both manifests passed SHA-256/size verification; browser word/example playback ended successfully. Receipt: `data/audio-r2-release-2026-10-25.json`; handoff: `docs/audio-r2-release-2026-10-25.md`.
- Commit only manifests/mappings/scripts, never MP3s. `audio-updates` is excluded from frontend/PWA bundles. Use `npm run audio:upload-updates-r2 -- --bucket english-flashcards-audio`, then `npm run audio:verify-updates-r2`, before pushing code. Audio is not guaranteed on a first offline visit; existing speech fallback remains. No application deployment, Git push or D1 migration was performed in this R2 release.

P2 adds personal test results (four modes, local drafts, account-scoped history and offline retry), teacher weekly reports with weakness-based assignment preparation, and weekly goals/milestone feedback. See `docs/p2-features.md`. The additive production `exam_attempts` schema was applied and verified on 2026-10-22; existing records were retained. See `docs/d1-p2-deployment.md`. P2 Worker/frontend deployment is pending the user's manual Git push.

See `plan.md` for the product roadmap. Current priorities:

1. Complete 今日学习计划 loop.
2. Clean remaining TOEFL/IELTS selector and legacy styling.
3. Add learning goals: IELTS / TOEFL / daily English.
4. Expand reading content further and improve weak-word recovery; the first reading history and wrong-answer review loop is implemented.
5. Continue productizing statistics across words, reading, and exam practice.
