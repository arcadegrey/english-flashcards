# P1 词性、释义与例句修复（2026-10-29）

本批按用户授权处理清单中的 **125 项 P1，涉及 124 个活动词条**。全部保留原 ID、词头、顺序、分类及范围字段，没有新增／退役词条，没有迁移或清空学习记录。词库仍为 8699 条，完整 core 为 3495 条。

同时联动关闭 constitutional、sympathetic 两条与本次义项修订直接相关的 P2 短语问题；其余 **176 项 P2 继续保留**。例如 people 的 `Old people.`、gastric 的 `Gastric ulcer.` 尚未在本批改写；不能把 P1 处理完成说成全库例句质量已经验收。

## 最终内容

- 词性修复按本条教学用法和明确列出的义项处理。n./v. 等合理多义保留；lovely、elderly、Canadian、Hispanic、nonprofit、national、romantic、metric、exclusive、offensive、cunning、cooperative、militant、unconscious 等复核后保留相应名词义。形容词默认标签的修正，不表示这个拼写绝不能是其他语境中的动词形态或专业名词。
- 30 条英文例句重写为短而完整的句子，修复截断、缺主语、`These news`、`Patry` 和默认义项错配。不是根据原中文猜出并伪称恢复了被截断的英文。
- 除这些英文对应的新译文，还更正两个本批词条的中文：hand 的“雇佣的手”改为“雇工”，encouraging advances 改为“令人鼓舞的进展”。不把原短语已经变成完整句来报告。
- constitutional 区分宪法／身体相关形容词义与散步名词义；sympathetic 默认教体谅义，并正确标明交感神经相关形容词义；harassment 的例句不再反转施受关系。
- gay 区分现代常用身份义和较旧的快乐／鲜艳义，避免把旧的“放荡”解释与现代身份义不加区分地并列；queer 区分较旧奇怪义、身份语境及称呼他人时的使用提示。旧记录原文完整保存在 before 快照中，不据此宣布所有历史义项从不存在。
- learned 的默认教学义为“博学的”，IPA 规范为 `/ˈlɜːnɪd/`，例句为 `He is a learned teacher.`。释义仍说明 learn 的过去式／分词及后天习得义通常使用单音节读法，没有把所有 learned 都改成双音节。

实际修改字段数为：112 条词性、26 条释义、30 条英文、32 条中文及 1 条音标（同一词条可涉及多个字段，不能相加当作词条数）。其中 sob、valve、ham、dismay 在重写例句时同步补齐原释义中已有的名词等词性。

完整 before／after、修改字段、对应审计项号：`data/vocabulary-p1-repair/reviews-2026-10-29.json`。静态修订输入：同目录 `patches-2026-10-29.json`。

## 数据交付与学习记录兼容

- 124 个 ID 均属于完整 core；只更新 canonical/core，再由原生成器同步轻目录、例句详情、索引和 Worker 新作业目录。未改变无关 TOEFL／IELTS List 或 manifest 时间戳。
- 原内容哈希及构建词库版本自然更新。没有新增用户存储键，不清理进度／收藏／错词／打卡／成绩；计划、范围选择、洗牌、活动学习池、授权和同步代码未改动。
- 新作业使用修订释义；已有作业及考试历史继续使用自己的不可变快照与原选项／评分。词条 ID 不迁移，旧学习记录无需搬移。
- `beforeTeachingP1Review` 只供维护工具重建早期审校基线。先撤销本批再重建更早快照，使已有修复批次的完整原库哈希继续可复现；该工具不读写个人学习存储。
- 两个应用修订脚本都保存最新审校顺序并验证当前记录是已登记的 before／after；未知修改会被拒绝，防止旧维护命令覆盖后续内容。
- 原审计报告保留修复前文字与 1900 条线索统计，JSON 用 `auditSnapshot` 与 `current` 分开记录，另以 `resolution` 标明 125 个 P1／2 个关联 P2 已本地修复。没有把旧 NLP 结果冒充对新例句的重新解析，也没有把剩余候选都判成错误。

## 音频

批次为 `audio-updates/2026-10-29-p1/`：**30 条新例句 + learned 的 1 个单词发音，四音色共 124 个 MP3**。

- 沿用四音色 `af_bella`、`am_michael`、`bf_emma`、`bm_george`，24 kHz／单声道／24 kbps；旧文件和旧 URL 不覆盖。
- 例句映射要求 ID、字段和完整文本相符。旧例句快照不能选中新录音；只改词性／中文的词条不虚构音频变化。
- learned 强制使用美音模型音素 `lˈɜɹnɪd`、英音 `lˈɜːnɪd`，用于本批“博学的”单词及例句。单词映射还要求修订后的 `pos`、`phonetic`、`meaning` 全部匹配；旧的动词快照、缺元数据对象或不同释义不能套用新读法。
- 共享生成器的语义保护回调为可选参数，旧批次的生成和映射行为保持兼容；四音色仍合用由全部输入计算的版本，避免只有最后一个音色的文件名可用。
- 复用上一批准备的独立本机运行时与缓存模型，制作期间禁用模型联网下载，原 `.venv-kokoro` 未改动。成功制作命令如下。

```bash
PYTHONPATH=/private/tmp/english-flashcards-feedback-audio \
  PYTHONUNBUFFERED=1 HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1 \
  /opt/homebrew/bin/python3.11 -S scripts/generate_vocabulary_p1_audio.py
```

124 个录音及清单已经上传到原 R2 桶的新前缀，逐个公网读取核对 SHA-256、字节数和音频 MIME，清单与本地逐字节相同。发布回执：`data/vocabulary-p1-repair/audio-r2-release-2026-10-29.json`。MP3 仍由 Git 和前端／PWA 构建排除；只提交清单、映射、审校记录与脚本。

验收边界：音素日志、文件解码和原生播放结束不是人耳听辨。本轮没有进行 124 个录音逐一的人耳发音验收。浏览器语音提供者及静态失败回退仍由系统语音读原文字，没有给系统语音注入音素；learned 的明确双音节保证针对本批四音色录音，不能扩大成对任意系统声音的承诺。

## 验证

- 全量 `npm test`：**334／334**；新增 7 项覆盖精确 P1 ID／事项范围、全库修订前后哈希、词性义项覆盖、30 条新句的填空兼容、P2 边界、旧作业快照和评分、124 个音频的文本／哈希／音色映射、learned 义项保护及静态失败直接浏览器回退。
- 全部既有历史内容基线和分片一致性检查通过；Lint、生产构建／PWA 通过。PWA 预缓存 101 项／1878.80 KiB（未压缩），缓存策略不变。
- 124 个本地 MP3 逐个通过完整解码、编码／采样率／声道、字节数和 SHA-256 检查；124 个公网 MP3 及清单校验通过。
- 真实 WordCard 通过生成轻目录及按需例句详情读取 124 个词条，在 1440／390px 共 **248 组**检查中核对词性、释义、IPA、双语例句、按钮尺寸和无横向溢出；无页面异常。代表截图检查 constitutional、gay、learned。
- 真实 Chromium 中通过 WordCard 按钮逐个播放四音色 **124 个公网文件**，全部触发原生 `ended`，ID／字段／音色／版本与清单完全一致，无音频错误、页面异常或未处理拒绝。八个短批次的结果合并后，URL 集合与 manifest 的 124 个路径逐个相等；没有只抽样后声称整批播放通过。
- 两个维护应用命令和审计报告生成命令依次重放后，canonical/core、审校登记、全部索引、音频映射和清单 SHA-256 均不变；未回滚本批或更早修复。最终 `git diff --check` 通过。

所有浏览器测试使用独立 localhost 测试 origin、原组件和公开音频，不使用生产账号、不发验证码、不写真实学习记录。证据在忽略目录 `output/vocabulary-p1-repair/` 和 `output/playwright/vocabulary-p1-repair/`。

## 发布

本批音频已发布，应用尚未 Git 提交、推送或部署。正式发布需包含前端全部生成数据／映射及更新后的 Worker 作业目录；无 D1 或用户数据迁移。用户此前删除的文件和无关未提交改动均保留。

## 本批词条明细

下表只列改动字段和本批新英文；全部前后释义、译文及来源在审校 JSON 中。未改英文表示该词的例句独立质量问题仍按清单另行跟踪。

| ID／词条 | 原词性 → 新词性 | 改动字段 | 本批英文例句 |
| --- | --- | --- | --- |
| 5429 · time | v. → n./v./adj. | pos | 未改英文 |
| 5442 · people | v. → n./v. | pos | 未改英文 |
| 5464 · way | adv. → n./adv. | pos | 未改英文 |
| 5470 · man | v. → n./v. | pos | 未改英文 |
| 5487 · woman | v. → n./adj./v. | pos | 未改英文 |
| 5497 · school | v. → n./v. | pos | 未改英文 |
| 5511 · number | v. → n./v. | pos | 未改英文 |
| 5518 · show | v. → n./v. | pos | 未改英文 |
| 5519 · house | v. → n./v. | pos | 未改英文 |
| 5529 · place | v. → n./v. | pos | 未改英文 |
| 5530 · hand | v. → n./v. | pos、exampleCn | 未改英文 |
| 5535 · small | adv. → adj./adv./n. | pos | 未改英文 |
| 5545 · large | adv. → adj./adv. | pos | 未改英文 |
| 5549 · end | v. → n./v. | pos | 未改英文 |
| 5554 · word | v. → n./v. | pos | 未改英文 |
| 5555 · question | v. → n./v. | pos | 未改英文 |
| 5558 · play | v. → n./v. | pos | 未改英文 |
| 5562 · move | v. → n./v. | pos | 未改英文 |
| 5564 · head | v. → n./v./adj. | pos | 未改英文 |
| 5568 · side | v. → n./adj./v. | pos | 未改英文 |
| 5569 · set | v. → n./v./adj. | pos | 未改英文 |
| 5777 · concerned | v. → adj. | pos | 未改英文 |
| 5824 · nice | n. → adj. | pos | 未改英文 |
| 5854 · united | v. → adj./v. | pos、meaning、example、exampleCn | Our team stayed united during the game. |
| 5895 · scottish | n. → adj. | pos | 未改英文 |
| 5908 · existing | v. → adj. | pos | 未改英文 |
| 5927 · interested | v. → adj. | pos | 未改英文 |
| 5988 · growing | n. → adj. | pos | 未改英文 |
| 6006 · lovely | n. → adj./n. | pos、meaning | 未改英文 |
| 6109 · ooh | v. → interj./n./v. | pos、meaning、example、exampleCn | Ooh, this cake looks good! |
| 6223 · elderly | n. → adj./n. | pos、meaning | 未改英文 |
| 6237 · glad | n. → adj. | pos | 未改英文 |
| 6269 · amazing | v. → adj. | pos | 未改英文 |
| 6322 · continuing | v. → adj. | pos | 未改英文 |
| 6360 · satisfied | v. → adj. | pos | 未改英文 |
| 6361 · canadian | n. → adj./n. | pos、meaning | 未改英文 |
| 6363 · operating | v. → adj. | pos | 未改英文 |
| 6369 · constitutional | n. → adj./n. | pos、meaning、example、exampleCn | The court protects our constitutional rights. |
| 6439 · scared | v. → adj. | pos | 未改英文 |
| 6551 · homeless | n. → adj./n. | pos、meaning、example、exampleCn | The shelter provides meals for homeless people. |
| 6563 · experienced | v. → adj. | pos | 未改英文 |
| 6564 · disappointed | v. → adj. | pos | 未改英文 |
| 6567 · encouraging | v. → adj. | pos、exampleCn | 未改英文 |
| 6568 · frightened | v. → adj. | pos | 未改英文 |
| 6571 · excited | v. → adj. | pos | 未改英文 |
| 6605 · mixed | v. → adj. | pos | 未改英文 |
| 6609 · hispanic | n. → adj./n. | pos、meaning | 未改英文 |
| 6617 · required | v. → adj. | pos | 未改英文 |
| 6692 · frozen | v. → adj. | pos | 未改英文 |
| 6710 · nonprofit | n. → adj./n. | pos、meaning | 未改英文 |
| 6754 · hidden | v. → adj. | pos | 未改英文 |
| 6775 · payable | n. → adj. | pos | 未改英文 |
| 6780 · integrated | v. → adj. | pos | 未改英文 |
| 6799 · determined | v. → adj. | pos | 未改英文 |
| 6850 · depressed | v. → adj./v. | pos、meaning、example、exampleCn | She felt depressed after hearing the news. |
| 6961 · registered | v. → adj. | pos | 未改英文 |
| 6968 · harassment | n. → n. | meaning、example、exampleCn | She reported the harassment to her manager. |
| 7003 · printed | v. → adj./v. | pos、meaning、example、exampleCn | Please sign the printed form. |
| 7015 · distinguished | v. → adj. | pos | 未改英文 |
| 7025 · varied | v. → adj. | pos | 未改英文 |
| 7033 · misleading | v. → adj. | pos | 未改英文 |
| 7053 · disturbing | v. → adj. | pos | 未改英文 |
| 7057 · neighboring | v. → adj. | pos | 未改英文 |
| 7059 · devastating | v. → adj. | pos | 未改英文 |
| 7086 · compelling | v. → adj. | pos | 未改英文 |
| 7089 · troubled | v. → adj. | pos | 未改英文 |
| 7094 · balanced | v. → adj. | pos | 未改英文 |
| 7106 · organized | v. → adj. | pos | 未改英文 |
| 7127 · challenging | v. → adj. | pos、meaning、example、exampleCn | This is a challenging task for our team. |
| 7145 · stunning | v. → adj. | pos | 未改英文 |
| 7194 · pact | n. → n. | example、exampleCn | The two countries signed a peace pact. |
| 7205 · national | n. → adj./n. | pos、meaning | 未改英文 |
| 7258 · central | n. → adj. | pos | 未改英文 |
| 7264 · common | n. → adj. | pos | 未改英文 |
| 7268 · recent | n. → adj. | pos | 未改英文 |
| 7269 · personal | n. → adj. | pos | 未改英文 |
| 7345 · advice | n. → n. | example、exampleCn | Her advice helped me solve the problem. |
| 7415 · willing | n. → adj. | pos | 未改英文 |
| 7444 · technical | n. → adj. | pos | 未改英文 |
| 7501 · novel | n. → adj./n. | pos | 未改英文 |
| 7527 · crazy | n. → adj. | pos | 未改英文 |
| 7577 · gay | n. → adj./n. | pos、meaning、example、exampleCn | The story is about a gay couple. |
| 7640 · surprising | v. → adj. | pos | 未改英文 |
| 7648 · electric | n. → adj. | pos | 未改英文 |
| 7660 · exciting | v. → adj. | pos | 未改英文 |
| 7664 · classical | n. → adj. | pos | 未改英文 |
| 7690 · gentle | v. → adj. | pos | 未改英文 |
| 7743 · eager | n. → adj. | pos | 未改英文 |
| 7744 · romantic | n. → adj./n. | pos、meaning | 未改英文 |
| 7774 · exclusive | n. → adj./n. | pos、meaning | 未改英文 |
| 7777 · illustration | n. → n. | example、exampleCn | The illustration shows a cat under a tree. |
| 7794 · missing | v. → adj. | pos | 未改英文 |
| 7803 · refusal | n. → n. | example、exampleCn | His refusal to help surprised me. |
| 7820 · vitamin | n. → n. | example、exampleCn | We get vitamin C from oranges. |
| 7866 · whoever | pron. → pron. | example、exampleCn | Whoever finishes first can choose the next game. |
| 7871 · sympathetic | n. → adj./n. | pos、meaning、example、exampleCn | The teacher was sympathetic to my problem. |
| 7926 · unconscious | n. → adj./n. | pos、meaning、example、exampleCn | He was unconscious after the accident. |
| 8002 · accustomed | v. → adj. | pos | 未改英文 |
| 8017 · learned | v. → adj./v. | pos、phonetic、meaning、example、exampleCn | He is a learned teacher. |
| 8040 · sob | v. → v./n. | example、exampleCn、pos | I heard the child sob in the next room. |
| 8115 · cunning | n. → adj./n. | pos、meaning | 未改英文 |
| 8126 · metric | n. → adj./n. | pos、meaning | 未改英文 |
| 8146 · queer | v. → adj./n./v. | pos、meaning、example、exampleCn | I heard a queer noise outside. |
| 8214 · dominant | n. → adj. | pos | 未改英文 |
| 8232 · offensive | n. → adj./n. | pos、meaning、example、exampleCn | He apologized for his offensive remark. |
| 8242 · underlying | v. → adj. | pos | 未改英文 |
| 8259 · plead | v. → v. | example、exampleCn | He began to plead for another chance. |
| 8298 · fascinating | v. → adj. | pos | 未改英文 |
| 8327 · cooperative | n. → adj./n. | pos、meaning | 未改英文 |
| 8329 · dessert | n. → n. | example、exampleCn | We had fruit for dessert. |
| 8349 · neighbouring | v. → adj. | pos、example、exampleCn | We often visit the neighbouring town. |
| 8386 · convincing | v. → adj. | pos | 未改英文 |
| 8404 · valve | v. → n./v. | example、exampleCn、pos | Turn the valve to stop the water. |
| 8460 · feminine | n. → adj. | pos | 未改英文 |
| 8467 · intriguing | v. → adj. | pos | 未改英文 |
| 8481 · soy | n. → n. | example、exampleCn | Please pass me the soy sauce. |
| 8495 · ham | v. → n./adj./v. | example、exampleCn、pos | She put some ham in the sandwich. |
| 8519 · petty | n. → adj. | pos | 未改英文 |
| 8529 · cruelty | n. → n. | example、exampleCn | She spoke out against cruelty to animals. |
| 8589 · alas | n. → interj. | pos | 未改英文 |
| 8590 · appealing | v. → adj. | pos | 未改英文 |
| 8610 · militant | n. → adj./n. | pos、meaning | 未改英文 |
| 8651 · generosity | n. → n. | example、exampleCn | Your generosity helped many families. |
| 8668 · dismay | v. → n./v. | example、exampleCn、pos | To my dismay, I missed the last bus. |

## 文件与构建交付

- `public/data/vocabulary.json`
- `public/data/vocabulary/core.json`
- `public/data/vocabulary/catalog/core-d3724ca94c2a8a99.json`
- `src/data/vocabularyIndex.json`
- `src/data/vocabularyDetailsIndex.json`
- `src/data/vocabularyStartup.json`
- `worker/data/assignment-vocabulary.json`
- `shared/vocabularyAudio.js`
- `shared/teachingP1VocabularyAudio.js`
- `shared/vocabularyHistory.js`
- `scripts/apply-vocabulary-teaching-p1.mjs`
- `scripts/apply-vocabulary-reviews.mjs`
- `scripts/generate_vocabulary_p1_audio.py`
- `scripts/generate_name_place_audio.py`
- `scripts/audit-vocabulary-teaching.mjs`
- `data/vocabulary-p1-repair/patches-2026-10-29.json`
- `data/vocabulary-p1-repair/reviews-2026-10-29.json`
- `data/vocabulary-p1-repair/audio-r2-release-2026-10-29.json`
- `public/audio-updates/2026-10-29-p1/manifest.json`
- `tests/vocabulary-teaching-p1.test.mjs`
- `docs/vocabulary-teaching-quality-audit-2026-10-29.md`
- `docs/vocabulary-teaching-quality-audit-2026-10-29.json`
- `PROJECT_CONTEXT.md`
- `docs/vocabulary-teaching-p1-repair-2026-10-29.md`

另替换 25 个例句详情批次及旧哈希文件（构建工具按当前索引维护）：

- `public/data/vocabulary/details/110-0d2512e404660f93.json`
- `public/data/vocabulary/details/117-77329b819e4e6e59.json`
- `public/data/vocabulary/details/122-aafb9a99e816352c.json`
- `public/data/vocabulary/details/127-c9355025be9deb79.json`
- `public/data/vocabulary/details/131-8646e007d222015c.json`
- `public/data/vocabulary/details/137-87d94d007d69789c.json`
- `public/data/vocabulary/details/139-4f41624d775183cd.json`
- `public/data/vocabulary/details/140-0933174af9509cda.json`
- `public/data/vocabulary/details/142-54024238971e9ba6.json`
- `public/data/vocabulary/details/143-ca45e3fbb19485c5.json`
- `public/data/vocabulary/details/146-0c3da9fa123b8b2b.json`
- `public/data/vocabulary/details/151-2cde586f82847cee.json`
- `public/data/vocabulary/details/155-9eb89d3e541bf5be.json`
- `public/data/vocabulary/details/156-1f269356006fcf9d.json`
- `public/data/vocabulary/details/157-ea63f6b49c4d4f21.json`
- `public/data/vocabulary/details/158-8784422fb2f13860.json`
- `public/data/vocabulary/details/160-ceae8f584a2c6101.json`
- `public/data/vocabulary/details/162-a938b4abfc8c0cfe.json`
- `public/data/vocabulary/details/164-231c923e76d4439e.json`
- `public/data/vocabulary/details/165-2a88a0681f90eb18.json`
- `public/data/vocabulary/details/166-4b334973efc1f1fc.json`
- `public/data/vocabulary/details/168-3c10fe31b1e7bd4b.json`
- `public/data/vocabulary/details/169-d9c55ba70b10b91a.json`
- `public/data/vocabulary/details/170-3f6cfeafa040bc3e.json`
- `public/data/vocabulary/details/173-429eab1eb2958cb7.json`
