# 73 条基础候选复核交接（2026-10-25）

## 已完成范围

- 原待核的 73 条全部完成本轮来源复核：72 条缺失音标补齐，Korea 的地理义项、音标与例句对齐。活动词库仍为 8699 条，所有 ID、词头原键、分类和顺序保留，当前活动词库没有缺失音标。
- 同批修正与实际例句不符的词性/释义，重写 23 条截断、残句或义项不清的基础例句及译文；对齐 11 条提示，共 22 条原创双语提示例句。45 条新英文与旧词库、原提示及上一批编辑提示的 26027 个不同英文文本无精确重复。
- 公司 DEC 仍按 Digital Equipment Corporation 教授，与日期中的 Dec. 分开；人名 Charlie 与小写俚语分开。月份缩写注明规范大小写及按完整月份朗读；including 按本句介词用法解释。Korea 基础例句改成明确的地图语境，不擅自从原句推断南北。
- `data/vocabulary-followup/reviews-2026-10-25.json` 保存逐条 before/after、变更字段、73 个目标 ID、来源、音标方法和原 111 条队列。复原这 73 条后必须恢复本批开始前的整库 SHA-256；测试同时复原此前修复阶段，原始证据不被覆盖。

## 来源和音标口径

主要核对牛津学习词典的词条 IPA、明确列出的词形和词性；另核对剑桥、韦氏、柯林斯，DEC 公司义参考计算机历史博物馆。Corp./DEC 的读音另核对 CMU 发音词典中两条 ARPAbet 记录；CMU 数据来自本机 cmudict 1.1.3，文件哈希与条目保存在 `cmudict-evidence.json`，来源版权归 Carnegie Mellon University。

短语、复数、比较级的编辑转写，以及月份缩写的全称读法均单独标注；不把它们伪称为词典对整串文字的直接音标。Corp./DEC 的编辑 IPA 采用美式口径，其余以英式宽式 IPA 为主。英美录音使用各自音色，实际语流和弱读可能有差别。`source-checks-2026-10-25.json` 仅存核对来源及音标事实，不复制完整词典释义和例句。403 或错误页不作为证据。

本轮为模型参考来源复核；不宣称独立语言专家审校或所有音频逐句人工听审。另一份 38 条义项/语境课程清单继续保留，其中 10 条完成部分字段修正，28 条仍需来源复核；不将部分字段修复等同于完成该清单。

## 版本音频与兼容

- 本地 Kokoro 四音色 af_bella/am_michael/bf_emma/bm_george，73 个词头和 27 个例句共 400 个 MP3，总计 2870856 字节，24 kHz 单声道。四个未改英文的例句也重制录音，以明确 bow、DEC、CEO、HIV 的读法。
- take a bow 固定正确的 /baʊ/；Inc./Corp./DEC 使用核对后的显式读音；CEO/DNA/HIV 按字母朗读；Oct./Nov./Feb./Aug. 的合成文本展开为完整月份。Korea 使用显式读音。实际合成文本、音素、时长、文本/文件哈希均在 manifest 中。
- 路径：`audio-updates/2026-10-25-followup/`。400 个 MP3 和一份 manifest 已上传到既有 `english-flashcards-audio` R2 桶的新前缀。逐个公开读取核验 400 个新 MP3 的 SHA-256、字节数与类型，失败 0；三份公开清单均核验，原 2036 个 immutable 音频复用已通过的核验回执。回执：`data/vocabulary-followup/audio-r2-release-2026-10-25.json`。
- MP3 不进入 Git、前端包或 PWA 预缓存。新路径带合成文本/配置版本哈希，旧远程对象保留；修改读音必须明确更新合成配置并生成新版本，不覆盖 immutable 路径。
- 运行时按稳定 ID 与具体字段文本精确匹配新录音。旧例句快照文本不同，不会误用新例句音频。已发布作业和已提交成绩不重写，用户记录不清空、不转移。

## 验证状态

- `npm test`：149/149 通过，包含本批 6 项验收：精确范围与历史哈希、音标来源/明确转写方式、提示义项、例句去重、400 音频映射和快照兼容；原有 143 项回归均通过。
- lint、生产构建/PWA、Worker dry-run 打包、`git diff --check` 通过。最终构建与浏览器结果见下方补充记录。
- 400 个 MP3 全部通过 ffprobe 格式核对和 ffmpeg 完整解码，文本/文件哈希匹配。本机详细报告在忽略目录 `output/vocabulary-followup/audio-validation.json`。
- 浏览器复用真实 WordCard：take a bow 词头、Korea 新例句已命中新 R2 URL 并收到 ended 事件；月份/DEC 的实际播放状态、1440px/390px 显示与无横向溢出另记录。修复独立进入词卡/集合页时的样式依赖，未引入新视觉样式。
- 无 Git 提交/推送、前端或 Worker 生产部署、D1 迁移。本批音频已发布；网页和服务端仍需随后一起发布，并完成真实生产账号验收。

## 维护命令

```bash
node scripts/apply-vocabulary-reviews.mjs
node scripts/split-vocabulary.mjs
node scripts/build-assignment-catalog.mjs
node scripts/report-vocabulary-followup.mjs
npm run hints:build
HF_HUB_OFFLINE=1 PYTORCH_ENABLE_MPS_FALLBACK=1 OMP_NUM_THREADS=4 .venv-kokoro/bin/python scripts/generate_vocabulary_followup_audio.py
npm test
npm run lint
npm run build
npx --no-install wrangler deploy --dry-run
```

`apply-vocabulary-quality.mjs` 仍可用，现转到按阶段复原/校验的统一脚本，避免重放上一批时覆盖本批复核。未登记的其他修改会阻止覆盖；分片、服务端目录、提示批次须重建。无需新增数据库迁移。

## 逐条登记

| ID | 词条 | 当前音标 | 核对方法 | 变更字段 | 来源 |
| ---: | --- | --- | --- | --- | --- |
| 4322 | plunge whole-heartedly | /plʌndʒ ˌhəʊlˈhɑːtɪdli/ | 编辑短语转写 | phonetic, pos, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/plunge_1)、[来源2](https://www.oxfordlearnersdictionaries.com/definition/english/wholeheartedly) |
| 4340 | take a bow | /teɪk ə ˈbaʊ/ | 编辑短语转写 | phonetic, pos | [来源1](https://www.merriam-webster.com/dictionary/take%20a%20bow)、[来源2](https://www.merriam-webster.com/dictionary/bow) |
| 4347 | raw material | /ˌrɔː məˈtɪəriəl/ | 词条 IPA | phonetic, pos | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/raw-material) |
| 4544 | alcoholic beverage | /ˌælkəˈhɒlɪk ˈbevərɪdʒ/ | 编辑短语转写 | phonetic, pos | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/alcoholic_1)、[来源2](https://www.oxfordlearnersdictionaries.com/definition/english/beverage) |
| 4579 | an odd fish | /ən ɒd ˈfɪʃ/ | 编辑短语转写 | phonetic, pos, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/odd)、[来源2](https://www.oxfordlearnersdictionaries.com/definition/english/fish_1) |
| 4609 | soy sauce | /ˌsɔɪ ˈsɔːs/ | 词条 IPA | phonetic, pos | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/soy-sauce) |
| 4698 | span of life | /ˌspæn əv ˈlaɪf/ | 编辑短语转写 | phonetic, pos | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/span_2)、[来源2](https://www.oxfordlearnersdictionaries.com/definition/english/life_1) |
| 4718 | traffic regulations | /ˈtræfɪk ˌreɡjuˈleɪʃnz/ | 编辑短语转写 | phonetic, pos | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/traffic_1)、[来源2](https://www.oxfordlearnersdictionaries.com/definition/english/regulation) |
| 4719 | traffic jam | /ˈtræfɪk dʒæm/ | 词条 IPA | phonetic, pos | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/traffic-jam) |
| 4720 | traffic congestion | /ˈtræfɪk kənˈdʒestʃən/ | 编辑短语转写 | phonetic, pos | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/traffic_1)、[来源2](https://www.oxfordlearnersdictionaries.com/definition/english/congestion) |
| 4842 | establish a nation | /ɪˈstæblɪʃ ə ˈneɪʃn/ | 编辑短语转写 | phonetic, pos | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/establish)、[来源2](https://www.oxfordlearnersdictionaries.com/definition/english/nation) |
| 5649 | others | /ˈʌðəz/ | 编辑词形转写 | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/other) |
| 5674 | including | /ɪnˈkluːdɪŋ/ | 词条 IPA | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/including) |
| 5873 | sales | /seɪlz/ | 编辑词形转写 | phonetic | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/sale)、[来源2](https://www.merriam-webster.com/dictionary/sales) |
| 5896 | earlier | /ˈɜːliə(r)/ | 编辑词形转写 | phonetic, pos, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/early_1)、[来源2](https://www.merriam-webster.com/dictionary/earlier) |
| 5900 | planning | /ˈplænɪŋ/ | 词条 IPA | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/planning) |
| 5941 | states | /steɪts/ | 编辑词形转写 | phonetic | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/state_1) |
| 5947 | works | /wɜːks/ | 词典明确词形 | phonetic, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/work_1)、[来源2](https://www.merriam-webster.com/dictionary/the%20works) |
| 5963 | terms | /tɜːmz/ | 编辑词形转写 | phonetic, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/term_1)、[来源2](https://www.merriam-webster.com/dictionary/terms) |
| 6009 | thanks | /θæŋks/ | 词条 IPA | phonetic, pos, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/thanks_1)、[来源2](https://www.merriam-webster.com/dictionary/thanks) |
| 6030 | inc | /ɪŋk/ | 词条 IPA | phonetic, pos, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/inc_2) |
| 6069 | corp | /kɔːrp/ | 编辑转写（美式，CMU） | phonetic, pos, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/corp)、[来源2](https://www.merriam-webster.com/dictionary/corp)、[来源3](https://github.com/cmusphinx/cmudict) |
| 6080 | significantly | /sɪɡˈnɪfɪkəntli/ | 词条 IPA | phonetic | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/significantly) |
| 6127 | dec | /dɛk/ | 编辑转写（美式，CMU） | phonetic, pos, meaning | [来源1](https://www.computerhistory.org/brochures/d-f/digital-equipment-corporation-dec/)、[来源2](https://github.com/cmusphinx/cmudict) |
| 6148 | remaining | /rɪˈmeɪnɪŋ/ | 词条 IPA | phonetic, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/remaining) |
| 6241 | ceo | /ˌsiː iː ˈəʊ/ | 词条 IPA | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/ceo) |
| 6246 | stairs | /steəz/ | 词条 IPA | phonetic, meaning | [来源1](https://dictionary.cambridge.org/us/dictionary/essential-british-english/stairs) |
| 6258 | online | /ˌɒnˈlaɪn/ | 词条 IPA | phonetic | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/online_1) |
| 6260 | proposed | /prəˈpəʊzd/ | 词典明确词形 | phonetic, pos, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/propose) |
| 6287 | oct | /ɒkˈtəʊbə(r)/ | 全称读法 | phonetic, pos, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/october) |
| 6329 | dna | /ˌdiː en ˈeɪ/ | 词条 IPA | phonetic, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/dna) |
| 6330 | nov | /nəʊˈvembə(r)/ | 全称读法 | phonetic, pos, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/november) |
| 6396 | feb | /ˈfebruəri/ | 全称读法 | phonetic, pos, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/february) |
| 6397 | aug | /ˈɔːɡəst/ | 全称读法 | phonetic, pos, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/august_2) |
| 6407 | politically | /pəˈlɪtɪkli/ | 词条 IPA | phonetic, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/politically) |
| 6413 | charlie | /ˈtʃɑːli/ | 词条 IPA | phonetic | [来源1](https://www.oxfordlearnersdictionaries.com/us/definition/english/charlie_1) |
| 6441 | depending | /dɪˈpendɪŋ/ | 词典明确词形 | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/depend) |
| 6480 | girlfriend | /ˈɡɜːlfrend/ | 词条 IPA | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/girlfriend) |
| 6569 | expected | /ɪkˈspektɪd/ | 词条 IPA | phonetic, pos, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/expected) |
| 6581 | traditionally | /trəˈdɪʃənəli/ | 词条 IPA | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/traditionally) |
| 6604 | estimated | /ˈestɪmeɪtɪd/ | 词典明确词形 | phonetic, pos, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/estimate_1) |
| 6634 | lords | /lɔːdz/ | 编辑词形转写 | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/lord_1) |
| 6661 | freshman | /ˈfreʃmən/ | 词条 IPA | phonetic, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/freshman)、[来源2](https://www.merriam-webster.com/dictionary/freshman) |
| 6680 | associated | /əˈsəʊsieɪtɪd/ | 词条 IPA | phonetic, pos, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/associated) |
| 6682 | korea | /kəˈriːə/ | 词条 IPA | phonetic, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/us/definition/english/korea)、[来源2](https://www.collinsdictionary.com/dictionary/english/korea) |
| 6736 | faster | /ˈfɑːstə(r)/ | 编辑词形转写 | phonetic | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/fast_1)、[来源2](https://www.merriam-webster.com/dictionary/faster) |
| 6739 | obliged | /əˈblaɪdʒd/ | 词典明确词形 | phonetic, pos, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/oblige)、[来源2](https://www.oxfordlearnersdictionaries.com/definition/english/obliged) |
| 6770 | sexually | /ˈsekʃəli/ | 词条 IPA | phonetic, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/sexually) |
| 6774 | organiser | /ˈɔːɡənaɪzə(r)/ | 词典拼写变体 | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/organizer) |
| 6793 | impressed | /ɪmˈprest/ | 词典明确词形 | phonetic, pos, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/impress)、[来源2](https://www.oxfordlearnersdictionaries.com/definition/english/impressed) |
| 6845 | hiv | /ˌeɪtʃ aɪ ˈviː/ | 词条 IPA | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/hiv) |
| 6856 | workplace | /ˈwɜːkpleɪs/ | 词条 IPA | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/workplace) |
| 6911 | takeover | /ˈteɪkəʊvə(r)/ | 词条 IPA | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/takeover) |
| 6926 | genuinely | /ˈdʒenjuɪnli/ | 词条 IPA | phonetic, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/genuinely) |
| 6931 | emerging | /ɪˈmɜːdʒɪŋ/ | 词条 IPA | phonetic, pos, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/emerging) |
| 6939 | closest | /ˈkləʊsɪst/ | 编辑词形转写 | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/us/definition/english/close2_1) |
| 6958 | bored | /bɔːd/ | 词条 IPA | phonetic, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/bored) |
| 7009 | importantly | /ɪmˈpɔːtntli/ | 词条 IPA | phonetic, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/importantly) |
| 7013 | privately | /ˈpraɪvətli/ | 词条 IPA | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/privately) |
| 7016 | varying | /ˈveəriɪŋ/ | 词典明确词形 | phonetic, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/vary) |
| 7018 | routinely | /ruːˈtiːnli/ | 词条 IPA | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/routinely) |
| 7055 | counselling | /ˈkaʊnsəlɪŋ/ | 词条 IPA | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/counselling) |
| 7070 | explicitly | /ɪkˈsplɪsɪtli/ | 词条 IPA | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/explicitly) |
| 7118 | website | /ˈwebsaɪt/ | 词条 IPA | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/website) |
| 7155 | lyrics | /ˈlɪrɪks/ | 编辑词形转写 | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/lyric_1) |
| 7459 | theatre | /ˈθɪətə(r)/ | 词条 IPA | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/theatre) |
| 7720 | surprisingly | /səˈpraɪzɪŋli/ | 词条 IPA | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/surprisingly) |
| 8175 | waggon | /ˈwæɡən/ | 词典拼写变体 | phonetic | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/wagon)、[来源2](https://www.merriam-webster.com/dictionary/waggon) |
| 8267 | consistently | /kənˈsɪstəntli/ | 词条 IPA | phonetic, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/consistently) |
| 8367 | positively | /ˈpɒzətɪvli/ | 词条 IPA | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/positively) |
| 8377 | ironically | /aɪˈrɒnɪkli/ | 词条 IPA | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/ironically) |
| 8407 | predominantly | /prɪˈdɒmɪnəntli/ | 词条 IPA | phonetic, meaning | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/predominantly) |
| 8504 | consultancy | /kənˈsʌltənsi/ | 词条 IPA | phonetic, meaning, example, exampleCn | [来源1](https://www.oxfordlearnersdictionaries.com/definition/english/consultancy) |

## 浏览器及最终构建补充

- 1440px/390px 真实词卡检查：take a bow 词头、Korea 新例句、Oct. 全称读音、DEC 公司缩写均命中新 R2 路径并收到 ended。未发现未捕获运行错误。
- 从应用首页直接进入虚构访客的“我的收藏”，未先进入背词页；consistently 新音标、完整句子、提示和引用正常，词卡计算圆角为 28px，390px 下 scrollWidth 为 390。截图在 `output/vocabulary-followup/collection-mobile.png` 与 `collection-desktop.png`。
- 最终生产构建/PWA 与 Worker dry-run 通过；独立词卡现在自行加载既有词卡样式，未新增视觉模式。
