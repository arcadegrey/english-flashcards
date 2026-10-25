# 基础词库 33 条修复交接（2026-10-24）

2026-10-25发布方式更新：这60个版本音频改为R2托管，MP3不进入Git或前端包。以下保留原本地验收记录，当前R2发布与核验见 `audio-r2-release-2026-10-25.md`。

## 范围与证据

本批处理首轮审计的全部 33 条记录：2 条错拼、14 条义项错配、异常释义／专名混淆／事实笔误／语域缺失各 1 条、10 条截断例句、3 条误译。逐条修复前后完整记录、来源和状态保存在 `data/vocabulary-audit-reviews.json`；可读清单及机器报告由 `node scripts/audit-base-vocabulary.mjs` 重建。

- 两处词头修正为 spectator、precaution，并核对音标。
- 姓名与缩写混淆的词条按现有例句补正教学义项；Sam 的提示同步改为人名。Les 的音标改为 /lez/，Sara 的音标按姓名义核对。
- Phillips 姓氏与 Philips 品牌分开；Freud 年份修正为 1856—1939。
- Negro 明确标注过时且冒犯，例句改成讨论历史文献中的用词。
- 10 条截断英文改为完整原创句，中文逐句对应；jean 保留布料义并说明裤子通常用 jeans。
- ben、closer、passing 按山峰、关门收尾、美式橄榄球语境重译。Tommy／Phillips 等译文删去英文没有的额外细节。
- 旧专业释义未盲目作为现代姓名义保留；原文本完整存档于 before 快照。此处理不声称所有旧义均不存在。

来源主要为牛津、剑桥、韦氏及 Dictionary.com 的具体词条。Freud 年份核对 [Freud Museum](https://www.freud.org.uk/schools/resources/who-was-sigmund-freud/)；jean / jeans 核对 [Merriam-Webster](https://www.merriam-webster.com/dictionary/jean)；third-and-long 的距离含义参考 [Atlanta Falcons 官方说明](https://www.atlantafalcons.com/news/inside-tori-notebook-a-journey-through-a-tale-of-third-downs)。完整来源逐条登记，原创例句不是词典引文。这仍是模型参考核对，不代替独立语言专家审校。另 111 条筛查线索未在本批处理。

## ID、同形词与历史兼容

保留全部 8699 个 ID、顺序、分类、List 与既有用户进度。把 33 条 before 快照放回新词库后，整份文件的 SHA-256 必须等于首轮审计基线；这验证了其他记录未改。

更正后 spectator 存在于 ID 1234（原 sepectator）及 4293；precaution 存在于 ID 3318（原 precauition）及 7977。共 8697 个不同词头，8699 个学习记录；这两对在审计中单独登记，不隐去，也不合并 ID。

- 新词条的 aliases 保留旧拼写；集合检索、阅读词汇查找及 CSV 去重兼容旧拼写。维护脚本 upsert 能按旧拼写命中原 ID。
- 提示按 ID 保留原有 8699 份登记；对应的新旧记录继续使用各自的核验来源。报告按稳定 ID 统计覆盖，不把同形词算成提示丢失。
- 单次选择／填空／配对及新班级词汇作业排除同形词干扰项；不改整库数量或范围序号。随机轮次中的两条同形记录仍各有机会被选中。
- 新拼写题只接受正确拼写。已保存本机历史按原快照可读；已提交云端成绩和已发布作业快照不重写。未同步的旧自主拼写记录仍遵循既有服务端按当前词库重算规则，旧错拼可能被判为错误；不会删除记录或输入。收藏、认识标记、复习数据和账号隔离不迁移。

## 音频交付

本批采用独立版本音频随前端发布：`public/audio-updates/2026-10-24/`。不覆盖旧 R2 对象，所以旧客户端和历史作业仍能播放原音频；新文本精确匹配 ID 和文本后使用新路径，避免 CDN 缓存播放旧句子。新音频失败时沿用实时 Kokoro／浏览器语音回退，不回退到该词的旧静态录音。

- 4 个词头（两个拼写修正及 Les／Sara 姓名读音）和 11 个例句，各 4 音色，共 60 个 MP3。
- 使用本地 Kokoro-82M、24 kHz 单声道、24 kbps；Les、Sara 使用来源核对的显式读音。
- manifest 记录原文、合成文本、文本／文件 SHA-256、大小、时长和实际音素；运行时映射由同一脚本生成。
- 新资源随 Vite 构建复制，并纳入 PWA 预缓存。旧大音频库仍不打包。
- 重建：`HF_HUB_OFFLINE=1 PYTORCH_ENABLE_MPS_FALLBACK=1 .venv-kokoro/bin/python scripts/generate_vocabulary_repair_audio.py`。已完成且文件哈希匹配的资源可复用。

## 发布

无需 D1 迁移，不改旧学习记录。应一起发布前端、版本音频和 Worker（更新的作业词库快照与同形词出题规则）；仅发布前端会导致服务端继续使用旧释义和拼写。没有执行 Git 推送、生产部署或 R2 上传。

## 验证

- `npm test`：116/116 通过（含新增 6 项修复验收）。
- `npm run lint`、`git diff --check`、生产构建及 PWA 生成通过。保留既有主包大于 500 kB、Browserslist 数据过期提示；本次构建还报告 CSS 插件耗时提示。
- `wrangler deploy --dry-run` 通过，仅打包，没有部署。
- 33 条 before 复原后的整库 SHA-256 与首轮基线一致；8699 个稳定 ID、原顺序、分类、分片内容和服务端目录核验通过。
- 60 个 MP3 共 676584 字节，全部通过 ffprobe 格式检查及 ffmpeg 完整解码；时长 0.888–6.216 秒，24 kHz 单声道。实际文本、文件 SHA-256、构建拷贝及 PWA 60/60 缓存项一致。核对词头音素；未进行逐句人工听审。
- 浏览器在本机独立验收页复用真实 `WordCollectionView`／`WordCard`：旧拼写检索、正确词头与提示、Sam 人名义项及引用、Negro 语域与新例句通过；实际点击 spectator 发音及 headline 例句，确认新版本 URL 加载且收到完整播放结束事件。验收页不修改学习记录、不连接生产账号。
- Playwright CLI 下载受当前网络限制，浏览器检查改用内置浏览器完成；未声称完成 1440px／390px 全页面回归或真实账号生产验收。
- 临时验收页和日志在忽略目录 `output/vocabulary-repair/`；正式 MP3 与 manifest 在可提交的 `public/audio-updates/2026-10-24/`。

## 变更文件

- `PROJECT_CONTEXT.md`
- `data/vocabulary-audit-reviews.json`
- `docs/base-vocabulary-audit.json`
- `docs/base-vocabulary-audit.md`
- `docs/core-word-notes.md`
- `docs/vocabulary-repair-2026-10-24.md`
- `docs/word-notes-coverage.md`
- `plan.md`
- `public/data/vocabulary.json`
- `public/data/vocabulary/core.json`
- `public/data/vocabulary/ielts/manifest.json`
- `public/data/vocabulary/toefl/level-3/list-9.json`
- `public/data/vocabulary/toefl/level-5/list-10.json`
- `public/data/vocabulary/toefl/manifest.json`
- `scripts/audit-base-vocabulary.mjs`
- `scripts/generate_vocabulary_repair_audio.py`
- `scripts/import-global-vocabulary.mjs`
- `scripts/report-word-notes.mjs`
- `shared/vocabularyAliases.js`
- `shared/vocabularyAudio.js`
- `shared/vocabularyAudioUpdates.js`
- `shared/wordAssignments.js`
- `src/components/FillBlank.jsx`
- `src/components/MatchingTest.jsx`
- `src/components/Quiz.jsx`
- `src/components/WordCollectionView.jsx`
- `src/data/expansionNineWordNotes.js`
- `src/data/expansionSevenWordNotes.js`
- `src/utils/csvImport.js`
- `src/utils/readingText.js`
- `src/utils/speech.js`
- `src/utils/wordHints.js`
- `tests/core-word-notes.test.mjs`
- `tests/vocabulary-repairs.test.mjs`
- `vite.config.js`
- `worker/data/assignment-vocabulary.json`
- `public/audio-updates/2026-10-24/`：60 个版本 MP3 与 `manifest.json`。
