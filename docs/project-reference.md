# Project Reference

Low-frequency project details moved out of `PROJECT_CONTEXT.md` to keep startup context small.

## Maintenance Commands

- D1 migration: `npm run d1:migrate`
- Import global vocabulary: `npm run words:import`
- Refresh vocabulary shards: `npm run words:split`
- Import reading materials: `npm run readings:import`
- Local Kokoro TTS: `npm run tts:kokoro`
- Generate static example audio: `npm run tts:generate-examples`
- Upload word static audio to R2: `npm run audio:upload-r2`
- Upload example static audio to R2: `npm run audio:upload-examples-r2`
- Upload versioned repair/replacement audio: `npm run audio:upload-updates-r2 -- --bucket english-flashcards-audio`
- Verify every published versioned MP3: `npm run audio:verify-updates-r2`

## Vocabulary Snapshot

- Active learning records: 8699 (8697 distinct headwords); 247 retired records remain reference-only. IDs 8700–8946 are new practical entries; see `practical-vocabulary-replacement-2026-10-25.md`.
- `core.json`: 3481 non-TOEFL/IELTS core words
- Daily: 2029
- CET4: 2075
- CET6: 1520
- TOEFL: 3251
- IELTS: 3257 unique words; Lists 1-56, 20 topics, 3335 list entries

## Vocabulary Loading API

`src/data/vocabulary.js` exposes:

- `loadVocabulary()`
- `loadToeflManifest()`
- `loadToeflListVocabulary()`
- `loadIeltsManifest()`
- `loadIeltsListVocabulary()`

App startup loads `core.json` plus TOEFL/IELTS manifests. Specific TOEFL/IELTS lists and ranges are loaded on demand.

## Vocabulary Maintenance History

- 2026-06-29: Cleaned placeholder example translations for IDs 5400-8699 in `public/data/vocabulary.json` and `public/data/vocabulary/core.json`. Old "这个例句..." and "参考译文..." fallback text counts were verified as 0. Sample `dine` translation: "我们经常和朋友在这家餐厅用餐。"
- 2026-06-30: Rewrote 1364 fallback English examples in IDs 5400-8699. `Students often meet the word ...` templates were verified as 0 in both vocabulary files. Export/import scripts: `scripts/export-example-rewrite-csv.mjs` and `scripts/import-example-rewrites.mjs`.
- 2026-07-01: Regenerated and uploaded four voices for those 1364 changed example audios, totaling 5456 changed MP3 files. R2 resume upload covered example audio for IDs 5400-8699 and `audio/examples/manifest.json`; public samples `manifest.json`, `af_bella/5400.mp3`, and `bm_george/8699.mp3` returned `200 OK`.
- 2026-07-07: Corrected the invalid `transportation` example for ID 7631 in `public/data/vocabulary.json` and `public/data/vocabulary/core.json`. Regenerated the four static example MP3 files for `af_bella`, `am_michael`, `bf_emma`, and `bm_george`, uploaded `audio/examples/{voice}/7631.mp3` plus `audio/examples/manifest.json` to R2, and verified all public URLs returned `200 OK`.

## CSV Import

Default word CSV fields:

```text
word, phonetic, pos, meaning, example, exampleCn, category, level, list
```

Rules:

- Required fields: `word`, `meaning`
- Deduplicate by lowercase `word`
- Valid categories: `daily`, `cet4`, `cet6`, `toefl`, `ielts`
- `all` is an entry point, not a word category
- Non-dry-run `words:import` automatically refreshes shards
- `--upsert` merges categories and position fields without overwriting existing meanings, examples, phonetics, or parts of speech
- Daily/CET expansion CSV: `data/daily_cet_expansion.csv`
- Daily/CET expansion script: `scripts/build-daily-cet-expansion.py`, based on MIT-licensed ECDICT
- After regenerating or importing expanded vocabulary, confirm `exampleCn` does not contain explanatory placeholders such as "这个例句..." or "参考译文..."

Example translation maintenance scripts:

- `scripts/fix-placeholder-example-translations.mjs`: fixes old placeholder translations and tries MyMemory through `curl`.
- `scripts/fill_fallback_translations.py`: uses local `deep_translator` to fill remaining fallback example translations.

## Reading Data

- Built-in readings: 26 total; 19 include questions (69 questions). Includes 4 A1 and 4 A2 original stories, questions for all 5 B1 articles, and the existing 6 IELTS/TOEFL-style practice articles. See `docs/p1-features.md`.
- Reading CSV fields: `title, level, category, content, translation, source, tags, examType, questions`
- Reading import script: `scripts/import-global-reading.mjs`

## TTS And Audio

- Speech utility: `src/utils/speech.js`
- Voice settings UI: `src/components/VoiceSettings.jsx`
- Default provider: `kokoro`
- Default voice: `af_bella`
- Default local endpoint: `http://127.0.0.1:8880/v1/audio/speech`
- Local service script: `scripts/kokoro_tts_server.py`
- Detailed docs: `docs/kokoro-tts.md`

Static audio:

- Word audio: `public/audio/words/{voice}/{id}.mp3`
- Example audio: `public/audio/examples/{voice}/{id}.mp3`
- R2 bucket: `english-flashcards-audio`
- Public URL: `https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev`
- Versioned repairs/replacements: `audio-updates/<batch>/<word|example>/<voice>/<id>-<revision>.mp3`. Local MP3s are ignored and excluded from frontend builds; commit manifests and mappings only. Upload/verify R2 before pushing the application. See `audio-r2-release-2026-10-25.md`.
- Completed voices: `af_bella`, `am_michael`, `bf_emma`, `bm_george`
- 2026-06-28: New audio uploaded to R2 for IDs 5400-8699: 13,200 word MP3 files and 13,200 example MP3 files. Both manifests were updated and public samples returned `200 OK`.
- 2026-07-01: `scripts/generate_kokoro_example_audio.py` became hash-aware. It reads `public/audio/examples/manifest.json` `exampleHashes`, so changed example text is queued even when an MP3 already exists. `--dry-run --start 5399` returned `pendingFiles=0`.
- 2026-07-07: Example audio ID 7631 was regenerated with `npm run tts:generate-examples -- --start 7630 --limit 1`, then uploaded with `npm run audio:upload-examples-r2 -- --bucket english-flashcards-audio --min-id 7631 --max-id 7631`. A follow-up dry run returned `pendingFiles=0`.

Suggested production environment variables:

```bash
VITE_WORD_AUDIO_BASE_URL=https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio/words
VITE_EXAMPLE_AUDIO_BASE_URL=https://pub-47e027cd6ce64af29a76f038ecb22373.r2.dev/audio/examples
```

## Cloudflare Worker / D1

- API wrapper: `src/utils/workerAuth.js`
- Default API prefix: `VITE_API_BASE` or `/api`
- Worker supports email-code login, session restore, logout, progress read, and progress write.
- D1 tables: `users`, `login_codes`, `sessions`, `user_progress`
- Session cookie: `ef_session`
- Synced data: `learnedWords`, `masteredWords`, `customWords`, `wordProgress`, `wrongWords`, `studyHistory`
- Auto-sync debounce: 800ms
- Version conflicts are resolved by Worker-side merging of cloud progress with submitted progress before writing back.

## Additional Known Risks

- CSV parser is custom and does not fully cover complex Excel dialects or semicolon-delimited files.
- `public/images/ielts-nature-geography-bg.png` may still be an old uncommitted-bound PNG; CSS currently uses WebP.
# 2026-10-25 稳定性/提示加载补充

后续 73 条基础候选已复核：来源、音标方法、23 条例句和 11 条提示更新、400 个 R2 版本音频及兼容要求见 `vocabulary-followup-73-2026-10-25.md`。原 38 条义项/语境课程清单继续独立跟踪。

词库合并使用 `src/utils/vocabularyMerge.js`，按稳定 ID 保留同形记录；学习日期使用 `shared/studyDate.js` 的 Asia/Shanghai 口径，旧日期汇总不搬移。新登录保留其他有效会话，`POST /api/auth/logout` 退出当前会话，`POST /api/auth/logout-all` 验证当前账号后退出其全部会话。复习计划按 `lastReviewed` 防止旧设备覆盖新记录。

提示源码继续通过 `src/utils/wordHints.js` 编译，运行时通过 `src/hooks/useWordHints.js` 与公共 JSON 批次按需加载，不再将整份提示数据静态打进 JS。发布需包含 `public/data/word-hints/` 与对应 manifest；没有额外 D1 迁移或新音频。维护、兼容与验证见 `optimization-2026-10-25.md`。
