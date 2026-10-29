# 剩余 P2 词库教学问题修复（2026-10-29）

本批完成原清单剩余 **176 项 P2，涉及 174 个活动词条**。174 条英文及对应中文全部重写，70 条词性、20 条释义同步对齐（字段数有重叠）。原清单 303 项现均有本地修复登记：P1 批次关闭 125 项 P1／2 项关联 P2，本批关闭其余 176 项。这个结论仅限已登记清单，未复核的筛查线索仍保留，不能据此宣称 8699 词均经专家验收。

## 内容与边界

- 默认例句改成有独立主句或合法祈使结构的完整句，采用常见生活、学习、工作情境；专业词使用必要的最小专业语境。新句均含目标词或短语，可继续用于填空练习；双语逐条对齐。174 句互不重复，也不与本批之前的基础词库例句完全相同。
- 新英文按空格计为 4–9 词。长度只是结果，修订依据是原登记问题及具体义项，没有使用统一模板批量补长原短语。额外 NLP 检查没有发现新句缺少限定谓语／祈使主句的线索；这只是辅助筛查，不能替代语言审校。
- gastric（6602）由 `Gastric ulcer.` 改为 `He visited a doctor for gastric pain.`／“他因胃痛去看了医生。”，ulcer 的既有修复不回滚。gastric 只是早前两词反馈的可能来源，仍不能确认用户当时看到的词条。
- stereotype（8387）默认教“刻板印象”，例句为 `That stereotype about older people is unfair.`。释义保留核实的印刷铅版及相关动词义，移除未得到本轮词典支持的“盲文”译义；原字段保存在 before 快照，不冒充已证明所有历史来源都不可能有该译法。
- science fiction（4129，IELTS List 19）释义扩大到“科幻／科幻作品（如小说、电影等）”，与电影例句及现有学习提示一致。
- don 默认示范较正式的“穿上”，另标 Don 称谓；romance 改为普通恋情语境，同时保留真实动词义；beneficiary 保留受益者和有明确历史／教会语境的旧义；literal 保留核实存在的书写印刷差错及计算机字面量名词义。
- monthly、advisory、standing 等标签覆盖所列实际义项；regulatory 补监管义；compelling、stunning 补常见评价义；feminine 释义不再直接等同柔弱。builder 补“建造者／建筑工人”，使修墙例句与基础释义一致。
- 不修改词头、音标、ID、分类、范围、顺序；不新增或退役词条。8699 条活动记录及唯一 ID 集合保持不变。大写地名／国籍形容词按英语句法在例句中正常大写，原词头存储保持兼容。

完整逐项 before／after、事项号、改动字段、来源登记：`data/vocabulary-p2-repair/reviews-2026-10-29.json`；固定输入为同目录 `patches-2026-10-29.json`。builder 施工者义参照 [Cambridge · builder](https://dictionary.cambridge.org/us/dictionary/english/builder)；其他特定义项来源也记录在审校 JSON。

## 数据与学习记录

- 完整数据只涉及 canonical、core 及 IELTS List 19，再由原生成器更新 core／extended／List 轻目录、按需详情、索引、启动数据、Worker 新作业目录。TOEFL／IELTS 原 List manifest 不重写时间戳。
- 学习进度、收藏、错词、打卡、考试历史及账户隔离／同步逻辑没有变更，没有清理存储或迁移 ID。新作业使用当前释义，旧作业继续使用已有不可变快照及原选项评分。
- P1 后基线 SHA-256：`e9f4b4a1fffb878978e8201b5258025ec105e38e099fcb025b6b24e5585536e0`。
- 本批 canonical SHA-256：`eb08780f5f05aa663c2b67121a358f9429b4c0450c6ced98debf3594f70df752`。
- `beforeTeachingP2Review` 仅为维护／测试重建 P1 历史基线；更早历史按 P2 → P1 顺序还原。原审计保留 `auditSnapshot`，另列 `current` 和批次 `resolution`，旧 NLP 统计仍明确属于原文。
- 通用修订脚本按登记时间顺序保留最新结果；P1 应用命令在 P2 完整哈希匹配时不回滚。P2 命令校验已登记的前后记录和全部实际完整分片后再写文件；遇到未知内容会拒绝覆盖。

## 音频

174 条英文 × `af_bella`／`am_michael`／`bf_emma`／`bm_george` 四音色，共 **696 个新 MP3**（合计 6,323,112 字节），批次 `audio-updates/2026-10-29-p2/`。单词发音本批没有改动。

- 沿用 Kokoro、24 kHz／单声道／24 kbps、不可变版本 URL。共享映射优先使用最新 P2，要求 ID、字段及完整英文相符；旧例句快照不会误选新录音，原 P1 learned 义项读音保护继续生效。
- `public/audio-updates/2026-10-29-p2/manifest.json` 标记 ready，登记 696 个文件、原文、字节数及文本／文件 SHA-256。MP3 继续被 Git 和前端／PWA 构建排除，只保留清单、映射、脚本及发布回执。
- 全部文件和清单已上传原 R2 桶的新前缀。逐个公网读取验证 696 个文件的 SHA-256、大小、`audio/mpeg`、CORS；远端清单与本地相同。回执：`data/vocabulary-p2-repair/audio-r2-release-2026-10-29.json`。
- 本地 696 个文件全部经过 ffprobe 参数检查及 ffmpeg 完整浮点解码，验证有限样本、非静音 RMS、时长和哈希。公网内容哈希与这些已解码本地文件一致。

制作使用已有独立临时运行时和缓存模型，不修改项目原虚拟环境：

```bash
PYTHONPATH=/private/tmp/english-flashcards-feedback-audio \
  PYTHONUNBUFFERED=1 HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1 \
  /opt/homebrew/bin/python3.11 -S scripts/generate_vocabulary_p2_audio.py
```

文件解码和浏览器播放结束不等于人耳听辨。本批没有逐一人工听辨全部 696 个录音，也没有独立语言专家签字。

## 验证与发布

- `npm test`：**342／342**。新增测试覆盖精确 176 项／174 ID 范围、全库历史与当前哈希、目标词填空、词性与释义、真实冷启动 core／IELTS List 19／详情加载、旧作业快照评分、审计状态、696 个音频映射及静态失败后的当前文本回退。
- `npm run lint`、`npm run build`／PWA 通过；预缓存 101 项／1893.02 KiB，音频不进入前端产物。
- 本地与公网 696 个音频及清单校验通过。
- 真实 WordCard 通过生成轻目录及按需详情读取全部 174 个修订词条，1440／390px 共 **348 组**检查通过：词性、释义、IPA、双语例句、按钮尺寸、无横向溢出及无页面异常；抽查 science fiction、gastric、stereotype、literal 截图。完整通过记录为 `content-1.txt` 至 `content-8.txt`。
- 在真实 Chromium 中通过词卡“播放例句”按钮抽验 12 个代表词 × 四音色，共 **48 个不同公网 MP3**，均触发原生 `ended`，URL 与清单中的 ID／音色／版本一致，无音频错误或页面异常。代表词为 science fiction、about、kid、palestinian、olympic、gastric、advisory、don、hitherto、stereotype、beneficiary、literal。此项是抽样播放；696 个文件的全量保证来自解码和公网内容校验。
- 依次重放通用修订、P1 应用、P2 应用、词库交付生成、Worker 作业目录、提示生成及审计生成，**434 个**词库、分片、索引、提示、审校、音频与审计文件逐字节相同，未覆盖后续修订。`git diff --check` 通过。

证据目录：`output/vocabulary-p2-repair/`、`output/playwright/vocabulary-p2-repair/`。浏览器使用隔离 localhost origin、真实 WordCard／轻目录／按需详情与公开录音，不使用生产账号或真实学习记录。

音频已发布，本批代码随本次 Git 提交保存，尚未推送或部署。发布应包含前端全部生成数据／音频映射及 Worker 新作业目录；不需要 D1 或个人数据迁移。无关未提交改动与用户既有删除保持原状。

## 改动文件

- 完整词库：`public/data/vocabulary.json`、`public/data/vocabulary/core.json`、`public/data/vocabulary/extended.json`、`public/data/vocabulary/ielts/list-19.json`。
- 生成交付：`public/data/vocabulary/catalog/`、`public/data/vocabulary/details/` 的版本文件替换，`src/data/vocabulary{Index,CategoryIndex,DetailsIndex,Startup}.json`，`worker/data/assignment-vocabulary.json`。
- 审校／音频：`data/vocabulary-p2-repair/{patches,reviews,audio-r2-release}-2026-10-29.json`、`public/audio-updates/2026-10-29-p2/manifest.json`、`shared/teachingP2VocabularyAudio.js`、`shared/vocabularyAudio.js`、`shared/vocabularyHistory.js`。
- 维护：`scripts/apply-vocabulary-teaching-p2.mjs`、`scripts/generate_vocabulary_p2_audio.py`、`scripts/apply-vocabulary-reviews.mjs`、`scripts/apply-vocabulary-teaching-p1.mjs`、`scripts/audit-vocabulary-teaching.mjs`。
- 验证与交接：`tests/vocabulary-teaching-{p1,p2}.test.mjs`、`docs/vocabulary-teaching-quality-audit-2026-10-29.{md,json}`、本文、`PROJECT_CONTEXT.md`。

## 词条明细

下表列本批最终英文、中文和改动字段；完整释义与历史在审校登记中。

| ID／词条 | 改动字段 | 新英文 | 新中文 |
| --- | --- | --- | --- |
| 4129 · science fiction | meaning、example、exampleCn | We watched a science fiction film last night. | 我们昨晚看了一部科幻电影。 |
| 5425 · about | pos、example、exampleCn | There are about ten books on the desk. | 桌上大约有十本书。 |
| 5433 · year | example、exampleCn | She visits her family every year. | 她每年都去看望家人。 |
| 5442 · people | example、exampleCn | Many people walk to work. | 许多人步行上班。 |
| 5447 · only | pos、example、exampleCn | I have only one ticket. | 我只有一张票。 |
| 5452 · more | pos、example、exampleCn | I need more time to finish. | 我需要更多时间才能完成。 |
| 5460 · new | example、exampleCn | She bought a new bicycle. | 她买了一辆新自行车。 |
| 5476 · many | pos、example、exampleCn | Many children play in this park. | 许多孩子在这座公园里玩。 |
| 5483 · such | example、exampleCn | It was such a good day. | 那真是美好的一天。 |
| 5489 · life | example、exampleCn | I enjoy life in this small town. | 我喜欢在这座小镇的生活。 |
| 5490 · too | example、exampleCn | This bag is too heavy for me. | 这个包对我来说太重了。 |
| 5496 · world | example、exampleCn | We live in a changing world. | 我们生活在一个不断变化的世界里。 |
| 5535 · small | example、exampleCn | They live in a small house. | 他们住在一座小房子里。 |
| 5541 · american | pos、example、exampleCn | She drives an American car. | 她开一辆美国产汽车。 |
| 5545 · large | example、exampleCn | We need a large table for dinner. | 我们需要一张大桌子吃晚饭。 |
| 5557 · next | pos、example、exampleCn | The next bus leaves in ten minutes. | 下一班公交车十分钟后发车。 |
| 5561 · quite | example、exampleCn | The soup is quite hot. | 这碗汤相当烫。 |
| 5572 · long | pos、example、exampleCn | This road is long. | 这条路很长。 |
| 5573 · important | example、exampleCn | Sleep is important for our health. | 睡眠对我们的健康很重要。 |
| 5593 · early | pos、example、exampleCn | She arrived early for the meeting. | 她提早到达会场参加会议。 |
| 5628 · late | pos、example、exampleCn | The bus is late today. | 今天公交车晚点了。 |
| 5641 · ago | example、exampleCn | We moved here two years ago. | 我们两年前搬到了这里。 |
| 5661 · food | example、exampleCn | Please put the food on the table. | 请把食物放在桌子上。 |
| 5663 · air | pos、example、exampleCn | Open the window to let in fresh air. | 打开窗户，让新鲜空气进来。 |
| 5695 · difficult | example、exampleCn | This question is difficult to answer. | 这个问题很难回答。 |
| 5713 · half | pos、example、exampleCn | He ate half of the bread. | 他吃了一半面包。 |
| 5722 · true | pos、example、exampleCn | Her story is true. | 她说的故事是真的。 |
| 5724 · short | pos、example、exampleCn | We took a short walk after dinner. | 晚饭后，我们散了一小会儿步。 |
| 5726 · easy | pos、example、exampleCn | This book is easy to read. | 这本书读起来很容易。 |
| 5761 · tree | pos、example、exampleCn | There is a tree outside my window. | 我的窗外有一棵树。 |
| 5765 · wide | pos、example、exampleCn | The river is too wide to cross here. | 河在这里太宽，无法横渡。 |
| 5766 · south | pos、example、exampleCn | They live in the south. | 他们住在南方。 |
| 5774 · foreign | example、exampleCn | She enjoys learning foreign languages. | 她喜欢学习外语。 |
| 5776 · simple | pos、example、exampleCn | The teacher gave us a simple explanation. | 老师给了我们一个简单的解释。 |
| 5787 · animal | example、exampleCn | The animal drank water from a bowl. | 那只动物从碗里喝水。 |
| 5795 · sport | pos、example、exampleCn | Swimming is my favorite sport. | 游泳是我最喜欢的运动。 |
| 5812 · hot | pos、example、exampleCn | Be careful with the hot pan. | 小心那口热锅。 |
| 5822 · happy | example、exampleCn | She was happy to see her friend. | 见到朋友，她很高兴。 |
| 5865 · cultural | example、exampleCn | The town hosts a cultural festival every summer. | 这座小镇每年夏天都举办文化节。 |
| 5868 · heavy | pos、example、exampleCn | This box is heavy. | 这个箱子很重。 |
| 5883 · beautiful | example、exampleCn | The garden is beautiful in spring. | 这座花园在春天很美。 |
| 5890 · western | pos、example、exampleCn | Our hotel is in the western part of town. | 我们的酒店在城镇的西部。 |
| 5895 · scottish | example、exampleCn | We listened to a Scottish song. | 我们听了一首苏格兰歌曲。 |
| 5908 · existing | example、exampleCn | We can repair the existing fence. | 我们可以修好现有的围栏。 |
| 5927 · interested | example、exampleCn | She is interested in gardening. | 她对园艺感兴趣。 |
| 5943 · train | pos、example、exampleCn | The train leaves at nine. | 火车九点发车。 |
| 5949 · chinese | pos、example、exampleCn | She is learning Chinese at school. | 她正在学校学习中文。 |
| 5960 · regional | example、exampleCn | The museum displays regional crafts. | 这家博物馆展出当地手工艺品。 |
| 5996 · dress | pos、example、exampleCn | The children can dress themselves. | 孩子们能自己穿衣服。 |
| 6001 · famous | example、exampleCn | The town is famous for its old bridge. | 这座小镇以古桥闻名。 |
| 6008 · tall | pos、example、exampleCn | The tall tree gives us shade. | 那棵高树为我们遮阴。 |
| 6019 · sweet | pos、example、exampleCn | These apples taste sweet. | 这些苹果吃起来很甜。 |
| 6023 · expensive | example、exampleCn | This coat is too expensive for me. | 这件外套对我来说太贵了。 |
| 6025 · educational | example、exampleCn | We watched an educational film about birds. | 我们看了一部关于鸟类的科教影片。 |
| 6041 · slow | pos、example、exampleCn | The bus is slow today. | 今天公交车开得很慢。 |
| 6054 · japanese | pos、example、exampleCn | We ate at a Japanese restaurant. | 我们在一家日式餐馆吃了饭。 |
| 6055 · increasing | pos、meaning、example、exampleCn | The increasing cost worries us. | 不断上涨的费用让我们担忧。 |
| 6072 · english | pos、example、exampleCn | We speak English in class. | 我们在课堂上说英语。 |
| 6136 · parliamentary | example、exampleCn | They watched a parliamentary debate on television. | 他们在电视上看了一场议会辩论。 |
| 6158 · kid | pos、example、exampleCn | The kid is playing in the garden. | 那个孩子正在花园里玩。 |
| 6160 · control | pos、example、exampleCn | We can control the lights from here. | 我们可以在这里控制灯光。 |
| 6161 · art | example、exampleCn | We made art with paper and paint. | 我们用纸和颜料创作艺术作品。 |
| 6162 · guy | pos、example、exampleCn | The guy next door is very friendly. | 隔壁那位男子很友好。 |
| 6163 · less | pos、example、exampleCn | I spend less money on snacks now. | 我现在花在零食上的钱更少了。 |
| 6183 · final | pos、example、exampleCn | This is the final page of the book. | 这是这本书的最后一页。 |
| 6188 · expert | pos、example、exampleCn | We asked an expert for advice. | 我们向一位专家征求建议。 |
| 6189 · huge | example、exampleCn | A huge tree stands beside the house. | 屋旁有一棵大树。 |
| 6195 · arrangement | example、exampleCn | We changed the arrangement of the chairs. | 我们改变了椅子的摆放方式。 |
| 6196 · male | pos、example、exampleCn | The zoo has a male lion. | 动物园里有一头雄狮。 |
| 6209 · dangerous | example、exampleCn | It is dangerous to cross this busy road. | 横穿这条繁忙的道路很危险。 |
| 6211 · daily | pos、example、exampleCn | A daily walk helps me relax. | 每天散步有助于我放松。 |
| 6232 · lucky | example、exampleCn | We were lucky to find a seat. | 我们很幸运，找到了座位。 |
| 6235 · holder | example、exampleCn | Put the towel on the holder. | 把毛巾放在架子上。 |
| 6238 · agricultural | example、exampleCn | The college offers agricultural courses. | 这所学院开设农业课程。 |
| 6251 · friendly | pos、example、exampleCn | Our neighbors are friendly. | 我们的邻居很友好。 |
| 6273 · congressional | example、exampleCn | The reporter attended a congressional hearing. | 那名记者参加了一场国会听证会。 |
| 6283 · asian | pos、example、exampleCn | My friend is an Asian artist. | 我的朋友是一位亚洲艺术家。 |
| 6286 · statutory | example、exampleCn | The notice explains our statutory rights. | 这份通知说明了我们的法定权利。 |
| 6334 · honest | example、exampleCn | Please be honest with me. | 请对我说实话。 |
| 6335 · palestinian | pos、meaning、example、exampleCn | We read a story by a Palestinian writer. | 我们读了一个巴勒斯坦作家写的故事。 |
| 6340 · disability | example、exampleCn | The school supports students with a disability. | 这所学校为有残障的学生提供支持。 |
| 6342 · biological | example、exampleCn | The lesson explains a biological process. | 这节课解释了一种生物过程。 |
| 6346 · altogether | example、exampleCn | The tickets cost twenty dollars altogether. | 这些票总共花了二十美元。 |
| 6348 · islamic | example、exampleCn | The museum has a room for Islamic art. | 博物馆里有一间伊斯兰艺术展室。 |
| 6360 · satisfied | example、exampleCn | She was satisfied with the result. | 她对结果感到满意。 |
| 6363 · operating | example、exampleCn | The machine has low operating costs. | 这台机器的运行成本很低。 |
| 6378 · ken | example、exampleCn | The answer is beyond my ken. | 这个问题的答案超出了我的知识范围。 |
| 6382 · olympic | meaning、example、exampleCn | She hopes to win an Olympic medal. | 她希望赢得一枚奥运会奖牌。 |
| 6398 · standing | pos、meaning、example、exampleCn | Her standing in the team improved. | 她在团队中的地位提高了。 |
| 6417 · dirty | pos、example、exampleCn | Please wash your dirty hands. | 请洗净你的脏手。 |
| 6457 · victorian | pos、example、exampleCn | The town has several Victorian houses. | 镇上有几栋维多利亚时代的房屋。 |
| 6460 · hunter | example、exampleCn | The hunter followed tracks in the snow. | 猎人沿着雪地里的足迹前行。 |
| 6467 · norman | pos、meaning、example、exampleCn | They read a story about Norman sailors. | 他们读了一个关于诺曼水手的故事。 |
| 6485 · australian | pos、example、exampleCn | She has an Australian friend. | 她有一位澳大利亚朋友。 |
| 6502 · institutional | example、exampleCn | The project has strong institutional support. | 这个项目得到了机构的大力支持。 |
| 6525 · exact | pos、example、exampleCn | Please tell me the exact time. | 请告诉我准确时间。 |
| 6556 · electoral | example、exampleCn | We learned about the electoral system. | 我们了解了选举制度。 |
| 6557 · statute | example、exampleCn | The statute sets out the school's legal duties. | 这部法规列明了学校的法定义务。 |
| 6594 · capitalist | pos、example、exampleCn | The capitalist invested money in a new factory. | 那位资本家投资了一家新工厂。 |
| 6595 · suburban | pos、example、exampleCn | They live on a quiet suburban street. | 他们住在郊区一条安静的街道上。 |
| 6602 · gastric | example、exampleCn | He visited a doctor for gastric pain. | 他因胃痛去看了医生。 |
| 6608 · deadly | pos、example、exampleCn | The storm caused a deadly accident. | 暴风雨引发了一起致命事故。 |
| 6611 · monthly | pos、meaning、example、exampleCn | We pay the rent monthly. | 我们每月交租。 |
| 6612 · korean | pos、example、exampleCn | She is learning Korean at school. | 她正在学校学习韩语。 |
| 6617 · required | example、exampleCn | A ticket is required for entry. | 入场需要门票。 |
| 6618 · longtime | pos、example、exampleCn | She met a longtime friend for lunch. | 她和一位老朋友一起吃了午饭。 |
| 6620 · legislative | pos、example、exampleCn | Parliament has a legislative role. | 议会承担立法职能。 |
| 6647 · fiscal | example、exampleCn | The report explains the city's fiscal policy. | 这份报告解释了这座城市的财政政策。 |
| 6651 · builder | example、exampleCn、meaning | The builder repaired the wall. | 建筑工人修好了墙。 |
| 6667 · rhetoric | example、exampleCn | The students studied rhetoric in class. | 学生们在课堂上学习修辞学。 |
| 6678 · behavioral | example、exampleCn | The teacher noticed a behavioral change. | 老师注意到一个行为上的变化。 |
| 6692 · frozen | example、exampleCn | We keep frozen peas in the freezer. | 我们把冷冻豌豆放在冰柜里。 |
| 6694 · lesser | example、exampleCn | The job is of lesser importance. | 这项工作的重要性较低。 |
| 6709 · theology | example、exampleCn | He studies theology at college. | 他在大学学习神学。 |
| 6742 · regulatory | meaning、example、exampleCn | The agency has a regulatory role. | 这个机构承担监管职责。 |
| 6750 · scary | meaning、example、exampleCn | The children watched a scary film. | 孩子们看了一部恐怖电影。 |
| 6754 · hidden | example、exampleCn | They found a hidden door behind the shelf. | 他们在架子后面发现了一扇暗门。 |
| 6765 · occupational | example、exampleCn | The course covers occupational safety. | 这门课程介绍职业安全知识。 |
| 6801 · parental | example、exampleCn | The trip requires parental permission. | 这次旅行需要家长许可。 |
| 6810 · symbolic | example、exampleCn | The gift has a symbolic meaning. | 这份礼物具有象征意义。 |
| 6819 · cuban | pos、example、exampleCn | We listened to a Cuban singer. | 我们听了一位古巴歌手演唱。 |
| 6833 · advisory | pos、meaning、example、exampleCn | The school has an advisory group. | 学校设有一个咨询小组。 |
| 6859 · zero | pos、meaning、example、exampleCn | The temperature fell to zero. | 气温降到了零度。 |
| 6869 · instructional | example、exampleCn | The teacher showed us an instructional video. | 老师给我们看了一段教学视频。 |
| 6891 · ecological | example、exampleCn | The spill caused serious ecological damage. | 这次泄漏造成了严重的生态破坏。 |
| 6930 · organizational | example、exampleCn | She has strong organizational skills. | 她有很强的组织能力。 |
| 6961 · registered | example、exampleCn | Only registered members can use the pool. | 只有注册会员才能使用游泳池。 |
| 6986 · peanut | pos、example、exampleCn | She ate a peanut after lunch. | 她午饭后吃了一颗花生。 |
| 7015 · distinguished | example、exampleCn | A distinguished scientist visited our school. | 一位杰出的科学家来访了我们学校。 |
| 7033 · misleading | example、exampleCn | The advertisement gave a misleading impression. | 这则广告给人留下了误导性的印象。 |
| 7035 · don | pos、meaning、example、exampleCn | He paused to don his coat. | 他停下来穿上外套。 |
| 7057 · neighboring | example、exampleCn | We often visit the neighboring town. | 我们经常去邻近的镇子。 |
| 7059 · devastating | example、exampleCn | The flood had a devastating effect on the town. | 洪水对这座小镇造成了毁灭性的影响。 |
| 7086 · compelling | meaning、example、exampleCn | The lawyer gave a compelling argument. | 律师提出了一个令人信服的论点。 |
| 7089 · troubled | example、exampleCn | The teacher helped a troubled student. | 老师帮助了一名遇到困难的学生。 |
| 7145 · stunning | meaning、example、exampleCn | The hotel has a stunning view of the sea. | 酒店拥有令人惊叹的海景。 |
| 7205 · national | example、exampleCn | The race is a national event. | 这场比赛是一项全国性赛事。 |
| 7236 · economic | example、exampleCn | The report explains recent economic changes. | 这份报告解释了近期的经济变化。 |
| 7238 · upon | example、exampleCn | He smiled upon hearing the good news. | 他一听到好消息就笑了。 |
| 7250 · leader | example、exampleCn | The leader listened to the whole team. | 负责人听取了整个团队的意见。 |
| 7268 · recent | example、exampleCn | A recent storm damaged the bridge. | 最近的一场暴风雨损坏了这座桥。 |
| 7269 · personal | example、exampleCn | Please keep your personal details private. | 请保护好你的个人信息。 |
| 7396 · obvious | example、exampleCn | There is an obvious mistake in this sentence. | 这个句子里有一个明显的错误。 |
| 7415 · willing | example、exampleCn | She is willing to help us. | 她愿意帮助我们。 |
| 7527 · crazy | example、exampleCn | She is crazy about cats. | 她非常喜欢猫。 |
| 7648 · electric | example、exampleCn | We bought an electric kettle. | 我们买了一个电水壶。 |
| 7660 · exciting | example、exampleCn | The game was exciting to watch. | 这场比赛看起来很精彩。 |
| 7664 · classical | example、exampleCn | She listens to classical music while cooking. | 她做饭时听古典音乐。 |
| 7743 · eager | example、exampleCn | The children are eager to learn. | 孩子们渴望学习。 |
| 7744 · romantic | example、exampleCn | They had a romantic dinner by the river. | 他们在河边共进了一顿浪漫晚餐。 |
| 8028 · speciality | example、exampleCn | Baking bread is her speciality. | 烤面包是她的专长。 |
| 8115 · cunning | example、exampleCn | The cunning fox found a way into the yard. | 那只狡猾的狐狸找到了进入院子的办法。 |
| 8117 · grieve | example、exampleCn | She needs time to grieve for her father. | 她需要时间悼念父亲。 |
| 8209 · pregnant | example、exampleCn | She is pregnant with her first child. | 她怀着第一个孩子。 |
| 8242 · underlying | example、exampleCn | We need to find the underlying cause. | 我们需要找出根本原因。 |
| 8298 · fascinating | example、exampleCn | The museum has a fascinating collection of old toys. | 博物馆里有一批引人入胜的旧玩具收藏。 |
| 8306 · romance | pos、meaning、example、exampleCn | The film tells a story of romance. | 这部电影讲述了一段恋情。 |
| 8322 · hitherto | example、exampleCn | Hitherto, we have worked from home. | 迄今为止，我们一直在家办公。 |
| 8327 · cooperative | example、exampleCn | The children were cooperative during the lesson. | 孩子们在课堂上很配合。 |
| 8356 · yacht | pos、example、exampleCn | A small yacht sailed past the island. | 一艘小游艇驶过了那座岛屿。 |
| 8386 · convincing | example、exampleCn | She gave a convincing explanation. | 她给出了一个令人信服的解释。 |
| 8387 · stereotype | pos、meaning、example、exampleCn | That stereotype about older people is unfair. | 那种关于老年人的刻板印象是不公平的。 |
| 8394 · pal | pos、example、exampleCn | He is an old pal of mine. | 他是我的一位老朋友。 |
| 8413 · confidential | example、exampleCn | Please keep this information confidential. | 请对这条信息保密。 |
| 8460 · feminine | meaning、example、exampleCn | The dress has a feminine style. | 这条连衣裙带有女性化的风格。 |
| 8466 · stroll | pos、example、exampleCn | We like to stroll along the river. | 我们喜欢沿着河边散步。 |
| 8467 · intriguing | example、exampleCn | The book begins with an intriguing question. | 这本书以一个引人好奇的问题开头。 |
| 8488 · beneficiary | pos、meaning、example、exampleCn | She is a beneficiary of the new program. | 她是这项新计划的受益者。 |
| 8519 · petty | example、exampleCn | They argued over a petty detail. | 他们为一个琐碎的细节争吵。 |
| 8610 · militant | pos、example、exampleCn | A militant spoke at the meeting. | 一名激进分子在会上发了言。 |
| 8625 · veto | pos、example、exampleCn | The president used his veto to block the bill. | 总统行使否决权，阻止了这项法案。 |
| 8654 · poultry | example、exampleCn | They keep poultry on their farm. | 他们在农场里养家禽。 |
| 8663 · literal | pos、meaning、example、exampleCn | Please explain the literal meaning of this word. | 请解释这个词的字面意思。 |
| 8693 · wink | pos、example、exampleCn | Can you wink with your left eye? | 你能眨一下左眼吗？ |
