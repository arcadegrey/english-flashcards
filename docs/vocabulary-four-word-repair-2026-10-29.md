# 四词释义、例句与读音修复（2026-10-29）

范围仅为用户点名的 gifted（6508）、teenage（6718）、ulcer（6919）、kingdom（7580）。基础编辑源、完整 core、轻目录、四批例句详情和服务端新作业目录同步更新。保留全部 8699 个活动词条的 ID、顺序、分类、原有提示、历史记录、作业快照、学习进度与账号隔离；不作全库质量验收声明。

## 文本与依据

| 词条 | 定位的问题与修订 | 当前默认例句／译文 |
| --- | --- | --- |
| gifted | 默认释义从“有天才的”统一为“有天赋的；有才华的”；`v.` 修正为 `adj.`，音标规范为 `/ˈɡɪftɪd/`。原 `A gifted writer.` 只是名词短语。 | My sister is a gifted singer.／我姐姐是一位有天赋的歌手。 |
| teenage | 原音标 `'ti:nidʒ` 缺少 `/eɪ/`，改为 `/ˈtiːneɪdʒ/`。原 `Teenage mothers.` 是两词短语。默认释义说明十三至十九岁与青少年时期。 | My teenage brother plays basketball after school.／我十几岁的弟弟放学后打篮球。 |
| ulcer | 当前基础例句为一条冗长且缺少正确标点的句子，还把压力／饮食写成溃疡病因；改用不涉及病因或治疗建议的完整句，默认释义精简为“溃疡”，音标规范为 `/ˈʌlsə(r)/`。 | She has a mouth ulcer.／她得了口腔溃疡。 |
| kingdom | 原 `The untroubled kingdom of reason.` 为抽象文学名词短语。改用王国的具体常用义，保留领域／生物分类“界”，移除旧的医学标签，音标规范为 `/ˈkɪŋdəm/`。 | The king ruled a small kingdom.／这位国王统治着一个小王国。 |

新句均为本次编写，未复制词典例句。依据：[gifted 中文及词性（PONS）](https://en.pons.com/translate/english-chinese/gifted)、[gifted 词性与 IPA（Cambridge）](https://dictionary.cambridge.org/dictionary/english/gifted)、[teenage 音素（Cambridge）](https://dictionary.cambridge.org/pronunciation/english/teenage)、[teenage 年龄及用法（Oxford）](https://www.oxfordlearnersdictionaries.com/us/definition/english/teenage)、[ulcer 与 mouth ulcer（Oxford）](https://www.oxfordlearnersdictionaries.com/definition/english/ulcer)、[kingdom 多义与 IPA（Oxford）](https://www.oxfordlearnersdictionaries.com/us/definition/english/kingdom)。网页访问受限时使用检索返回的词典正文；机器审查登记中的 `fact` 为改写的依据说明。

“有天才的”见于部分双语词典，不应声称它完全没有依据。本产品选择更自然直观的“有天赋的；有才华的”。当前 gifted 的学习提示原本已采用该释义，继续保留。其他三个词现有提示的两句例句也为完整句，未为了修改基础例句而重复改写提示。

ulcer 所报“两词例句”的具体历史／缓存／页面来源仍未定位。当前基础句及提示都不是该两词原文；修复当前基础句不等于否定用户反馈或找到了其所见版本。

## 读音检查与版本音频

已读取线上四音色的原 teenage MP3，并与本地原文件逐个比较：字节数及 SHA-256 全部相同。该检查只能排除所查本地／线上文件不一致，不能证明词尾发音正确，也不能判断用户当时选中了哪种音色或浏览器回退。

使用原本机缓存的 Kokoro 模型和既有不可变音频生成流程，为四条新例句各生成四音色，并为 teenage 单词生成四音色，共 20 个 MP3。teenage 单词及新例句中的目标词显式使用美音模型音素 `tˈinˌAʤ`、英音 `tˈiːnAʤ`；其中 `A`、`ʤ` 对应 `/eɪ/`、`/dʒ/`。这属于生成输入约束与音素日志验证，不是人耳实听。四份新 teenage 单词文件均与原文件哈希不同，模型输出时长依次为 1.550／1.500／1.350／1.575 秒；时长变化同样不能代替音素听辨。

批次：`audio-updates/2026-10-29-feedback/`。映射包含 ID、字段、精确文本与内容版本；旧例句快照不能选中新录音。teenage 头词拼写未变，历史中的同词也可使用其新读音。原 URL／文件不覆盖，未改动全局语速、静态音频优先和直接浏览器回退。

实听限制：本轮没有进行四音色逐个的人耳听辨，不能声称原录音缺尾音的原因已经确诊，或仅凭可解码／播放结束就认定发音准确。用户的听感反馈仍须按这一边界验收。

### 本机制作环境

原 `.venv-kokoro` 的 PyTorch 2.12／Transformers 5.8 依赖启动在文件读取中耗时异常；仅替换 Transformers 后仍慢。未修改原环境或项目依赖文件，最终在 `/private/tmp/english-flashcards-feedback-audio` 创建独立依赖目录，使用 Kokoro 0.9.4、Misaki 0.9.4、PyTorch 2.6.0、Transformers 4.51.3、tokenizers 0.21.4、spaCy 3.8.18，并复制本机已有的 `en_core_web_sm` 3.8.0 及其包元数据。模型、音色均复用原 Hugging Face 缓存，制作阶段禁用模型联网下载。

本轮成功的执行命令：

```bash
PYTHONPATH=/private/tmp/english-flashcards-feedback-audio \
  PYTHONUNBUFFERED=1 HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1 \
  /opt/homebrew/bin/python3.11 -S scripts/generate_vocabulary_feedback_audio.py
```

临时目录不属于项目依赖承诺。今后可在兼容的本机 Kokoro 环境运行同一脚本；不要把异常的旧环境加载延迟解读为网站播放延迟。共享生成器新增可选音色回调，默认调用方式保持原样；同一 ID／字段的四音色合用由全部输入音素计算的版本，避免映射最后一个音色后让其他音色找不到文件。

## 兼容与维护

- `data/vocabulary-feedback/reviews-2026-10-29.json` 保留四条完整 before／after、来源与全库修订前 SHA-256；回归检查保证只修改这四条的教学字段。
- 旧阶段审计重建先撤销本批内容修订，使此前的全库哈希继续可重现。该工具只服务维护，不迁移用户数据。
- `apply-vocabulary-reviews.mjs` 按最后一次审校状态重放，防止旧维护命令回滚本批修订；已检验重放幂等。
- 四词均在完整 core，不属于 TOEFL／IELTS 分片，因此本次无需重建无关 List／manifest 时间戳。既有生成器重建轻目录／详情索引；内容哈希文件名及正常构建词库版本自动更新，不清理用户学习存储。
- 新作业从更新后的 `worker/data/assignment-vocabulary.json` 取得释义；已发布作业仍使用不可变原快照、原选项和原评分。

## 验证与发布

- 全量 `npm test`：**327／327**；新增五项覆盖四词边界／修订前全库哈希、当前语义和填空可用性、旧作业评分、新旧文本／音色映射、静态失败直接使用修订文本回退浏览器。既有历史审计与分片一致性检查继续通过。
- Lint、生产构建／PWA 和 `git diff --check` 通过。预缓存 101 项／1875.97 KiB（未压缩），原缓存策略不变；新的内容文件名及词库构建版本自然更新。
- 真实 WordCard 通过轻目录与按需详情加载四词；1440／390px 共八组内容／音标／释义、可用音频按钮、无横向溢出检查通过，截图在原入场动画结束后检查。
- 本地 20 个 MP3 的 SHA-256、字节数、24 kHz 单声道 MP3 元数据及完整解码通过；清单／映射中的音素与当前文本一致。
- R2 已发布本批 20 个不可变 MP3 和一份清单；逐个公网读取核对 SHA-256、大小、音频 MIME，清单也与本地逐字节一致。可提交回执：`data/vocabulary-feedback/audio-r2-release-2026-10-29.json`。MP3 仍被 Git／前端／PWA 排除，未重传旧批次。
- 真实 Chromium 中通过 WordCard 的按钮逐个播放这 20 个公网录音，四音色均到达原生 `ended`，URL 的 ID／字段／音色／版本与映射一致，没有音频错误或页面异常。与八组内容／布局检查合计 28 次浏览器验收。该验收为实际音频播放生命周期，不是人耳听辨、Safari／真机或线上账号流程验收。

不要求 D1、用户数据或存储键迁移；正式应用需发布前端和更新后的 Worker 作业目录。本批音频已经上传并验证，可以进入代码审核／提交步骤；本轮没有 Git 提交、推送或应用部署。

## 项目文件

- 基础词条：`public/data/vocabulary.json`、`public/data/vocabulary/core.json`。
- 派生数据：`public/data/vocabulary/catalog/core-04d8cc0da95f8a97.json`，替换旧 core 目录；`details/130-8f1a171ae022d6c5.json`、`134-313692d474a7b8af.json`、`138-c09270b6b259ad83.json`、`151-acfefb52a4e98318.json` 替换各自旧批次。详情文件均位于 `public/data/vocabulary/details/`。
- 索引：`src/data/vocabularyIndex.json`、`vocabularyDetailsIndex.json`、`vocabularyStartup.json`。
- 新作业目录：`worker/data/assignment-vocabulary.json`。
- 音频：`public/audio-updates/2026-10-29-feedback/manifest.json`、`shared/feedbackVocabularyAudio.js`、`shared/vocabularyAudio.js`。
- 维护与生成：`scripts/generate_vocabulary_feedback_audio.py`、`scripts/generate_name_place_audio.py`、`scripts/apply-vocabulary-reviews.mjs`、`shared/vocabularyHistory.js`。
- 审校与回执：`data/vocabulary-feedback/reviews-2026-10-29.json`、`audio-r2-release-2026-10-29.json`。
- 回归：`tests/vocabulary-feedback.test.mjs`。
- 交接：`PROJECT_CONTEXT.md`、`docs/vocabulary-user-feedback-2026-10-29.md`、本文档。

本机证据保存在忽略目录 `output/vocabulary-feedback/`、`output/playwright/vocabulary-feedback/`。本次不提交 MP3，不修改既有工作区内其他未提交改动与用户删除的文件。
