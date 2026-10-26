# 残留人名／地名替换与义项复核交接（2026-10-26）

## 范围与结果

用户追加要求将人名和地名换成更值得学习的词。本轮检查完整活动词库，替换 80 条具体人名、姓氏、国家／地区／海洋／山脉名称、具名人物／天体，以及与姓名或地名混淆的少见同形义。before 记录在 `data/name-place-replacement/retired-2026-10-26.json`；新旧对应、逐项原因及批次开始前哈希在同目录 `replacement-manifest.json`。

- 活动词库仍为 **8699 条、8697 个不同词头**，两对原有同形词保留各自 ID。
- 新词使用 **8947–9026**，全部归为 `daily`，不继承未经核验的考试标签。包括 charger、username、screenshot、look after、put off、boarding pass、customer service、date of birth。
- 分类计数：日常 2047、四级 2028、六级 1516、托福 3245、雅思 3246；分类有交集。启动 core 为 3495 条，雅思分片允许同一 ID 出现在多个 List，分片行数不等于独立词数。
- 退役条目累计 **327 条**（旧 247 + 新 80），活动加历史共 9026 个 ID；提示编译为 46 个按需批次。
- 保留 mark、frank、bill、will、hope、grace、rose、jack 等普通常用义，以及语言／国籍形容词、月份、星期、计量与科学术语，不以大小写或姓名黑名单删除普通词。
- lewis、ruth、ulster、surrey、morgan、charlotte、kong 确有其他真实义项；按本轮实用词方向替换其少见义或语境冲突记录，不声称这些词没有普通词义。

## 新词来源与内容

80 条均有词性、中文义项、音标、具体用法和两条原创双语例句，共 **160 条**，基础例句复用第一条提示例句。与原活动词、历史词及旧提示无精确重复。

- 主要核对牛津完整词条、主词条中的短语义项或明确搭配；power bank、boarding pass、health insurance、exchange rate、interest rate 核对柯林斯；mobile data 核对三星官方说明。
- 来源登记在 `sources-2026-10-26.json`，不提交词典完整释义和例句。完整 HTML 仅留忽略目录。部分页面通过网页工具读取，其哈希明确为“事实摘要与来源 URL”，不伪称抓取到 HTML；403、404 及错误页不作证据。
- `phonetics-2026-10-26.json` 区分完整词条 IPA 与短语／复数的英式宽式编辑转写，不把主词条 IPA 冒充整串短语的音标。英美录音使用各自音色，语流和弱读可能不同。
- source-checked 表示模型参考公开来源核对，不代表独立专家审校、客观词频排名或官方考试词表认证。
- `be supposed to` 例句中的 `are supposed to` 使用逐例、带来源的显式 `forms` 加粗。仅多词词头允许多词词形；拒绝单词的任意短语扩展、草稿、缺失来源、无关词头及不完整匹配，不推断词干。

## 原 38 条队列

**19 条退役，仅留历史兼容；其余 19 条完成来源复核，当前该批候选无未关闭项。**这不等于全库已完成独立语言审校。逐条登记在 `data/sense-review/reviews-2026-10-26.json`，运行提示在 `src/data/senseReviewWordNotes.json`。

- 对齐 cripple、aborigine、Caucasian、oriental、dumb、disabled 的具体义项与语域，不把全部义项一律中性化或一律删除。
- may 按许可／可能的情态动词教授；august 保留原形容词义并区分月份 August 的读音；sept 按原月份例句教授，写作 Sept.、朗读完整 September，另解释普通名词 sept。
- states、commons、lords、DEC 与基础例句对齐；tech 区分技术学院／科技／技术人员；明确 waggon／wagon、jean／jeans 的实际用法。
- lame 原例句混淆了织物 lamé，现改为 lame excuse 的完整句及正确中文，并重制录音。
- 重写 **7 条基础英文例句**，提供 19 组、38 条对齐后的双语提示例句。
- Negro 保留历史语境识读，不进入新的自主四模式测试、干扰项、班级词汇作业或周报巩固建议。选定范围含该条时提示调整，不静默改变序号。历史作业直接按旧快照评分，旧离线成绩仍可同步；不拦截其他 ID 的自定义词。

原 111 条基础候选仍全部关闭：1 条既有字段修复、71 条来源复核且仍活动、39 条退役历史。此前已复核的 Charlie／Korea 在本轮退役，不是退回未完成。

## 音频与数据兼容

- 新词：`audio-updates/2026-10-26-name-place/`，80 个词头和 80 个基础例句 × 4 音色，**640 MP3**。
- 义项：`audio-updates/2026-10-26-sense/`，7 个例句与 august／Sept. 两个明确读音 × 4 音色，**36 MP3**。
- 共 **676 个、5,330,952 字节**，24 kHz 单声道，本地 Kokoro 音色 af_bella／am_michael／bf_emma／bm_george。proofread 词头明确现在时读音，august 明确形容词读音，Sept. 展开为 September；合成文本、音素、时长和哈希保存在清单中。
- MP3 忽略，不进入 Git、前端包或 PWA 预缓存；文本与配置哈希生成版本路径，不覆盖旧远程对象。只提交清单、文本映射和生成脚本。
- 退役记录合并到 `shared/retiredVocabulary.js`，原 247 条阶段另行导出，原构建脚本不会误重放为 327 条。
- 旧收藏、认识标记、复习、作业与成绩保留旧 ID；新词不继承旧进度，退役词不进入活动学习及新作业目录。历史提示继续可读。
- 新音频按 ID 和字段原文匹配，旧例句快照不误用新句录音。同文异读的 august／Sept. 使用新版读音，旧远程文件仍保留。
- `shared/vocabularyHistory.js` 仅供维护／验收复原编辑阶段，不迁移用户进度。原批次哈希回归继续通过，不改写原始审查证据。

## 验收状态

- **155/155 自动测试通过**：替换范围与历史哈希、ID／进度隔离、160 例句去重、IPA 方法、短语词形来源与边界、19 条义项、676 音频映射、旧作业评分、离线成绩及账号隔离。
- lint、生产构建／PWA、Worker dry-run、`git diff --check` 通过。主包仍有超过 500 kB 的构建提示。
- 676 MP3 全部通过哈希／大小、ffprobe 格式及 ffmpeg 完整解码；未逐句人工听审。
- 浏览器复用真实 WordCard，抽查 13 个活动词与 Charlie／Korea 历史词；提示、来源、完整词组加粗通过，1440×900／390×844 无横向溢出和未捕获错误。应用首页同尺寸冒烟通过。截图在忽略的 `output/playwright/name-place-*.png`。
- R2 的 676 个新 MP3 与两份清单已上传；新文件逐一公开读取核对 SHA-256、大小及音频类型，失败 0。版本音频现共 3112 个，原 2436 个复用已通过的 immutable 文件核验回执，全部五份公开清单重新读取并核对哈希。回执：`data/name-place-replacement/audio-r2-release-2026-10-26.json`。
- 真实词卡点击播放验收：boarding pass、proofread、august、Sept. 的词头和例句，以及 lame 的新例句，共 9 次均命中新 R2 地址并收到 ended 事件，无音频错误。
- 未执行应用／Worker 生产部署、Git 提交／推送、D1 迁移；真实生产账号及多设备流程尚未验收。

## 维护与上线

```bash
node scripts/build-name-place-replacement.mjs
node scripts/apply-sense-review.mjs
node scripts/apply-vocabulary-reviews.mjs
node scripts/split-vocabulary.mjs
node scripts/build-assignment-catalog.mjs
node scripts/report-vocabulary-followup.mjs
npm run hints:build
node scripts/report-word-notes.mjs > docs/word-notes-coverage.md
HF_HUB_OFFLINE=1 PYTORCH_ENABLE_MPS_FALLBACK=1 OMP_NUM_THREADS=4 .venv-kokoro/bin/python scripts/generate_name_place_audio.py
HF_HUB_OFFLINE=1 PYTORCH_ENABLE_MPS_FALLBACK=1 OMP_NUM_THREADS=4 .venv-kokoro/bin/python scripts/generate_sense_review_audio.py
npm test
npm run lint
npm run build
npx --no-install wrangler deploy --dry-run
npm run audio:verify-updates-r2
```

先确认 R2 新音频与清单公开核验通过，再一起发布前端与 Worker。本轮没有新增 schema，无需新增 D1 迁移。仅发布前端会使服务端缺少新 ID 或继续使用旧词义；发布后仍需真实账号、师生流程及多设备生产验收。

## 变更文件

共 94 个源码／数据／清单文件（含移除的旧哈希提示批次），MP3 不进入 Git。

- `PROJECT_CONTEXT.md`
- `data/name-place-replacement/audio-r2-release-2026-10-26.json`
- `data/name-place-replacement/phonetics-2026-10-26.json`
- `data/name-place-replacement/practical-2026-10-26.json`
- `data/name-place-replacement/practical-2026-10-26.tsv`
- `data/name-place-replacement/replacement-manifest.json`
- `data/name-place-replacement/retired-2026-10-26.json`
- `data/name-place-replacement/sources-2026-10-26.json`
- `data/sense-review/reviews-2026-10-26.json`
- `docs/name-place-replacement-2026-10-26.md`
- `docs/project-reference.md`
- `docs/vocabulary-quality-followup.json`
- `docs/word-notes-coverage.md`
- `plan.md`
- `public/audio-updates/2026-10-26-name-place/manifest.json`
- `public/audio-updates/2026-10-26-sense/manifest.json`
- `public/data/vocabulary.json`
- `public/data/vocabulary/core.json`
- `public/data/vocabulary/ielts/list-2.json`
- `public/data/vocabulary/ielts/list-3.json`
- `public/data/vocabulary/ielts/list-41.json`
- `public/data/vocabulary/ielts/manifest.json`
- `public/data/vocabulary/toefl/level-3/list-1.json`
- `public/data/vocabulary/toefl/level-4/list-9.json`
- `public/data/vocabulary/toefl/level-5/list-1.json`
- `public/data/vocabulary/toefl/level-5/list-8.json`
- `public/data/vocabulary/toefl/level-6/list-1.json`
- `public/data/vocabulary/toefl/level-6/list-2.json`
- `public/data/vocabulary/toefl/level-6/list-4.json`
- `public/data/vocabulary/toefl/level-6/list-5.json`
- `public/data/vocabulary/toefl/manifest.json`
- `public/data/word-hints/15-06aef35849190911.json`
- `public/data/word-hints/15-4538130c0b406518.json`
- `public/data/word-hints/16-4f538f2d4a68e85e.json`
- `public/data/word-hints/16-9da7b4d8da4716f6.json`
- `public/data/word-hints/17-3d384cc0cbd6b180.json`
- `public/data/word-hints/17-a5e5d8e38119d6ec.json`
- `public/data/word-hints/18-52a1a6ca7a8e692e.json`
- `public/data/word-hints/18-e9d1fc4ecd394309.json`
- `public/data/word-hints/26-438337efbd24dd70.json`
- `public/data/word-hints/26-509227a526f5e998.json`
- `public/data/word-hints/27-0d40c169c8b1bbf4.json`
- `public/data/word-hints/27-9d6328bfcccdc210.json`
- `public/data/word-hints/29-25b5f1485e15cee6.json`
- `public/data/word-hints/29-9da23120c0d0c2c3.json`
- `public/data/word-hints/30-1cf5fbb1378b612c.json`
- `public/data/word-hints/30-c1a3420fccb050c7.json`
- `public/data/word-hints/31-608f72663111de3b.json`
- `public/data/word-hints/31-94459749fde51917.json`
- `public/data/word-hints/33-2f6a117208fed0e5.json`
- `public/data/word-hints/33-8494523d9a46f604.json`
- `public/data/word-hints/35-6de910675c1eb89c.json`
- `public/data/word-hints/35-a67aff27f2873523.json`
- `public/data/word-hints/40-02319a18103432cc.json`
- `public/data/word-hints/40-1fe77516bbd06ca3.json`
- `public/data/word-hints/41-c0d1bb4d5c14ed00.json`
- `public/data/word-hints/41-dff489eaf8ddc999.json`
- `public/data/word-hints/44-2dff6e9b5d5b97e6.json`
- `public/data/word-hints/44-bb0ee9426a6724e2.json`
- `public/data/word-hints/45-3048d16f4cae415e.json`
- `scripts/apply-sense-review.mjs`
- `scripts/apply-vocabulary-reviews.mjs`
- `scripts/build-name-place-replacement.mjs`
- `scripts/build-practical-vocabulary.mjs`
- `scripts/check-name-place-sources.py`
- `scripts/generate_name_place_audio.py`
- `scripts/generate_sense_review_audio.py`
- `scripts/prepare-name-place-evidence.mjs`
- `scripts/report-vocabulary-followup.mjs`
- `scripts/report-word-notes.mjs`
- `shared/namePlaceVocabularyAudio.js`
- `shared/retiredVocabulary.js`
- `shared/senseReviewVocabularyAudio.js`
- `shared/vocabularyAudio.js`
- `shared/vocabularyHistory.js`
- `shared/vocabularyPracticePolicy.js`
- `shared/weeklyReport.js`
- `shared/wordAssignments.js`
- `src/components/assessment/AssessmentSession.jsx`
- `src/data/coreWordNotes.js`
- `src/data/namePlaceWordNotes.js`
- `src/data/reviewedWordNotes.js`
- `src/data/senseReviewWordNotes.json`
- `src/data/wordHintsManifest.json`
- `src/utils/wordHints.js`
- `tests/core-word-notes.test.mjs`
- `tests/helpers/vocabulary-history.mjs`
- `tests/name-place-replacement.test.mjs`
- `tests/practical-vocabulary.test.mjs`
- `tests/study-plan.test.mjs`
- `tests/vocabulary-followup.test.mjs`
- `tests/vocabulary-quality.test.mjs`
- `tests/vocabulary-repairs.test.mjs`
- `worker/data/assignment-vocabulary.json`
