# Vocabulary Sources

## ECDICT

`data/daily_cet_expansion.csv` was generated from the MIT-licensed ECDICT project, filtered into the app's Daily/CET4/CET6 categories, and then imported through the existing upsert workflow.

- Project: <https://github.com/skywind3000/ECDICT>
- Source file used locally: `ECDICT-master/ecdict.csv`
- The raw ECDICT CSV is not committed to this repository.

MIT License

Copyright (c) 2025 Linwei

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Core Word Learning Notes (2026-10-23)

`src/data/coreWordNotes.js` and `src/data/dailyWordNotes.js` add original Chinese usage comparisons and bilingual examples for 100 existing common/core words. Forty-seven of these words have source-checked formation or word-family notes. The references are Cambridge Dictionary / English Grammar Today, BBC Learning English, and the University of Glasgow STELLA grammar materials.

Reference material is used to verify facts, not imported as dictionary definitions or example text. Third-party sources retain their own rights; no dictionary republication permission is asserted. Each section records source IDs, checking date and `source-checked` status; this indicates the current reference check, not independent expert approval. Drafts and missing references are withheld from the UI.

The full word list, source audit table, selection criteria, extension workflow and verification are in [core-word-notes.md](core-word-notes.md). No vocabulary IDs, source definitions or audio data were changed.
