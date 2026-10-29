# 覆盖审计十词常用义与词性修复（2026-10-29）

仅处理覆盖审计提出的 10 个现有 ID。全部 8699 个活动 ID、词头、音标、顺序、分类、List 归属和个人学习记录不变；50 个新增候选仍未导入。修复登记保留完整 before／after，不复用或迁移 ID。

## 内容与来源

| ID／词条 | 词性 | 新默认例句 | 中文 |
| --- | --- | --- | --- |
| 4416 · can | modal v. / n. | I can carry this bag for you. | 我可以帮你提这个包。 |
| 4002 · mean | v. / n. / adj. | What does this word mean? | 这个词是什么意思？ |
| 4384 · cover | v. / n. | Please cover the food with a clean cloth. | 请用一块干净的布盖住食物。 |
| 4378 · match | v. / n. | Your shoes match your coat. | 你的鞋子和外套很相配。 |
| 4058 · point | v. / n. | Please point to your name on the list. | 请指一下名单上你的名字。 |
| 4326 · race | v. / n. | We race each other across the playground. | 我们在操场上互相比赛跑步。 |
| 5721 · arm | n. / v. | She held the baby in one arm. | 她用一只手臂抱着宝宝。 |
| 5451 · like | v. / prep. / adj. / n. / adv. | I like reading before bed. | 我喜欢在睡前阅读。 |
| 5709 · light | adj. / n. / v. / adv. | This bag is light enough to carry. | 这个包很轻，可以提得动。 |
| 5596 · kind | adj. / n. | Our neighbor is kind to everyone. | 我们的邻居对每个人都很友善。 |

- can 补能力／可能／许可情态义，保留容器义；mean 补意指、意味着、打算及常见形容词义，保留平均数。
- cover、match、point、race 补常用动词义和对应完整句，保留原名词义；point 补点／尖端／分数，race 区分竞赛与种族／族群。
- arm 补名词标签，默认教手臂，区分复数 arms 武器与动词装备；去掉原字段混入的无关计算机缩写释义。like 保留合理的多词性并优先教喜欢；kind 补友善形容词；light 补名词／形容词／动词并保留真实副词用法，改正原例句的“柔软玻璃”错译。
- 十条默认例句及 21 条补充提示例句独立编写，完整、简短、双语对应；旧近义词辨析、词族和原用法提示全部保留。补充提示通过稳定 ID、词头和已审核词性／释义匹配，不套用到未知自定义 ID；历史维护输入仍可重建原提示。
- 新提示沿用现有组件展示；WordCard 同名提示的 key 加入顺序，避免两个“用法提示”发生 React 身份冲突。释义格式化器识别 `modal v.`，避免 can 重复显示词性前缀。没有新视觉样式或学习流程。
- 逐词读取韦氏词典正文核对词性及义项；事实来源、日期与独立编写说明见 `data/vocabulary-common-senses-repair/sources-2026-10-29.json`。剑桥本轮抓取返回 403，不列为本轮新核实的来源。编辑核对不等于独立语言专家签字。

## 数据、提示与历史兼容

更新 canonical、core、IELTS Lists 14／16／24／26／27／39（race 在两个 List 中），再由现有生成器更新轻目录、分类增量、按需详情、索引、提示批次及 Worker 新作业词库。旧作业快照仍用原释义和选项评分；本轮不改账号、同步、存储或评分实现。

`beforeCommonSensesReview` 仅供维护／审计恢复前一阶段，不操作个人数据。通用应用脚本加入本批；P1／P2／短例句旧应用命令识别最新完整哈希后保留本批。覆盖审计继续输出原冻结基线，10 个历史建议及 50 个新增提案不被改写成新审计；本页记录后续落实状态。旧教学审计的原始命中仍是历史线索，不把未复核项目宣布为已修复。

基线 SHA-256：`fda962f32cb674b1610af43715d4147616570a7c0c3defd654d1a1a3f9e445a6`。
修复后 SHA-256：`8fa31adcf6b64f9dd9e5c1cef7bf29fd2fa3302c30a3ff69f6e9bcf50655f6ba`。

## 音频

10 条新默认例句 × af_bella／am_michael／bf_emma／bm_george，共 40 个版本化 MP3。批次 `audio-updates/2026-10-29-common-senses/`，沿用本地 Kokoro、24 kHz 单声道。单词文本及音标未变，单词录音继续复用；补充学习提示按现有机制呈现文字，无新音频按钮。

新映射要求 ID、字段和完整英文一致；旧例句快照不会误用新录音。旧 URL 保留。40 个 MP3 与清单已上传既有 R2 桶，公网逐个校验状态、SHA-256、字节数、MIME；全部本地音频通过 ffprobe、完整解码、有限样本和非静音检查。MP3 仍被 Git 和前端构建排除，只交付清单、映射和回执。

未进行逐一人工听辨，解码与浏览器播放完成不代表人工发音认证。

## 验证与发布

- 全量测试 367／367；最后的情态动词显示修复后，15 项针对性测试通过。
- Lint、生产构建／PWA、`git diff --check` 均通过。
- 1440／390px 共 20 组真实 WordCard 内容、提示、按钮和无横向溢出检查通过，代表截图已检查。
- 10 词 × 四音色共 40 个不同公网 MP3 全部经真实按钮触发原生 `ended`，实际 URL 逐条匹配当前清单，无音频错误或页面异常。
- 维护／生成／历史审计重放保持 461 个相关文件逐字节一致（新增最终回执不计入此前快照）。

验证结果记录于本批 `verification.json`；复现脚本及浏览器截图位于 `output/vocabulary-common-senses-repair/`、`output/playwright/vocabulary-common-senses-repair/`。浏览器使用独立 localhost origin，无生产账号或真实学习记录写入。

发布需同步包含前端生成数据、提示和音频映射，以及 Worker 新作业目录。无 D1 或个人数据迁移。本批代码与依赖的覆盖审计基线已随本次本地 Git 提交保存，未推送或部署应用；音频已发布到 R2。

## 改动文件

- 数据：canonical／core、IELTS Lists 14／16／24／26／27／39、extended、生成 catalog／details、四份 vocabulary 索引及 Worker 作业目录。
- 提示与显示：`src/utils/wordHints.js`、`src/utils/wordHintPresentation.js`、`src/components/WordCard.jsx`、提示批次和 manifest。
- 音频与登记：`data/vocabulary-common-senses-repair/`、本批音频 manifest、`shared/commonSensesVocabularyAudio.js`、`shared/vocabularyAudio.js`。
- 维护：本批应用／音频生成脚本、`shared/vocabularyHistory.js`、通用及 P1／P2／短例句应用脚本、教学／短例句／覆盖审计脚本与对应当前状态报告。
- 测试与文档：`tests/vocabulary-common-senses.test.mjs`、`tests/core-word-notes.test.mjs`、`tests/learning-trust.test.mjs`、`tests/vocabulary-short-examples.test.mjs`、`PROJECT_CONTEXT.md` 和本文。
