# 短例句清单修复（2026-10-29）

本批复核用户提供的 DeepSeek 说明及 238 个候选，改写其中 **237 条**；700 · collide 的 `The two cars collided.` 是完整句，作为误报保留。另按用户明确要求改写 smoking，因此实际修订 **238 个词条、238 组双语例句**。保留全部 8699 个活动 ID、词头、音标、顺序、分类和学习记录。

## 内容

| ID／词条 | 修复前 | 新英文 | 新中文 |
| --- | --- | --- | --- |
| 8667 · unpaid | Unpaid wages. | Several bills are still unpaid. | 几张账单仍未支付。 |
| 7124 · polite | Polite society.／有礼貌的社会。 | Please be polite to our guests. | 请礼貌地对待我们的客人。 |
| 6331 · longer | A longer for money.／为了钱，时间更长。 | Can we stay a little longer? | 我们能再多待一会儿吗？ |
| 7121 · smoking | Smoking stinks. | Smoking is not allowed in this room. | 这个房间内不允许吸烟。 |

- polite society 在原固定表达语境中指上流或讲究体面的社交圈，原逐词翻译不当；默认例句现在直接教待人有礼的常用形容词义。[Collins · polite society](https://www.collinsdictionary.com/dictionary/english/polite-society)
- longer 不应简单宣布为坏英语：long 的动词派生名词 longer（渴望者）确实存在，但原孤立短语不能示范本条“比较久”的副词义，且原中文错配。新句使用常用副词比较级；四音色音素日志均含比较级的 /ŋɡ/。[Merriam-Webster · longer](https://www.merriam-webster.com/dictionary/longer)
- Smoking stinks. 本身有主谓结构，本轮是用户指定的表达改进，未把它追记为句子残缺。collide、原清单的六个排除项及另外三条已确认主谓句均保持原文。
- 新句逐条独立编写，均为 4–9 个空格分词，包含目标词或明确搭配，使用完整陈述、问句或合法祈使结构。不是将原短语套入同一个模板，也没有将长度作为语法正确的证明。专业词保留必要的最小专业语境。
- 238 条新句互不重复，且与修复前 8699 条基础例句及现有全部整理过的提示例句无完全相同项。默认例句和展开提示仍提供不同例子。
- 同步补齐 **80 条词性标签**，对应选用教学用法及原字段明确列出的义项，保留合理的多词性。没有将所有分词拼写都统一标成动词。
- **12 条释义**补正或对齐：according 的 according to 介词搭配、mid- 前缀、sexy、supportive、poorly、satisfactory、operational、meaningful、bankruptcy、grim、sturdy、provocative。例如 supportive 改成形容词译法，bankruptcy 改为破产状态而非“破产者”，poorly 补差地／不好地并区分英式形容词义。其他较旧或专业字段并未因此获得全量词典核验。

固定输入及完整 before／after：`data/vocabulary-short-example-repair/patches-2026-10-29.json`、`reviews-2026-10-29.json`。具体核源事实及链接：同目录 `sources-2026-10-29.json`。本轮是单模型编辑复核，不是独立语言专家签字。

## 数据与兼容

- 本批 238 个 ID 都在完整 core；更新 canonical／core，再由原生成器更新轻目录、按需详情、索引、启动数据和 Worker 新作业目录。完整 TOEFL／IELTS Lists 及 manifest 不修改。
- 不写个人学习存储，不清理收藏、错词、打卡、成绩或进度，不迁移／复用 ID，不改变授权和同步实现。旧作业和考试继续使用既有快照及原选项评分；新作业读取修订释义。
- P2 后基线 SHA-256：`eb08780f5f05aa663c2b67121a358f9429b4c0450c6ced98debf3594f70df752`。
- 本批最终 canonical SHA-256：`fda962f32cb674b1610af43715d4147616570a7c0c3defd654d1a1a3f9e445a6`。
- `beforeShortExampleReview` 为维护／测试重建前一批状态，之后再还原 P2、P1 等更早阶段；它不操作用户进度。P2 测试仍严格断言原 P2 阶段哈希，并单独检查最新审计哈希。
- 通用应用脚本追加本批登记；旧 P1／P2 应用命令在最新完整哈希匹配时不回滚。新命令先校验 baseline 和全部实际完整分片，再写数据；未知修改会被拒绝。
- DeepSeek 原筛查的 238 个候选、原文字和数量保留为历史快照，并另列当前文字、237 个已修事项、1 个复核排除和 smoking 的额外请求。未把历史候选数量冒充新例句错误数量，未将原报告当作全库专家结论。
- 既有 303 项 P1／P2 报告继续保留原始筛查统计和批次归属；当前文字引用本批最新 canonical。大于五词的原残片及其他未复核线索不在本批范围内。

## 音频

- 238 条英文 × `af_bella`／`am_michael`／`bf_emma`／`bm_george` 四音色，当前清单共 **952 个 MP3**，合计 **9,236,376 字节**。
- 批次为 `audio-updates/2026-10-29-short-examples/`，沿用 Kokoro、24 kHz／单声道／24 kbps。全部最终录音和完整清单已上传原 R2 桶。旧 URL 保留，当前映射只引用最终版本。
- `shared/shortExampleVocabularyAudio.js` 优先于旧批次，要求 ID、字段及完整英文相符；旧例句快照不会套用新录音。本批单词文本／IPA 没有变化，单词音频路径保持不变。
- 952 个本地文件全部通过字节数、SHA-256、ffprobe 参数检查、ffmpeg 完整浮点解码、有限样本及非静音 RMS 检查；952 个公网文件逐个通过状态、大小、SHA-256 和 audio/mpeg 校验，远端清单与本地相同。回执：`data/vocabulary-short-example-repair/audio-r2-release-2026-10-29.json`。
- MP3 继续被 Git 及前端／PWA 构建排除，只保存清单、映射、生成脚本、审校登记与回执。没有进行全部 952 个录音逐一的人耳听辨；文件检查和播放结束不等于人工发音认证。

生成使用已有独立临时运行时及缓存模型，原项目虚拟环境不变：

```bash
PYTHONPATH=/private/tmp/english-flashcards-feedback-audio \
  PYTHONUNBUFFERED=1 HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1 \
  /opt/homebrew/bin/python3.11 -S scripts/generate_vocabulary_short_example_audio.py
```

## 验证与发布

- `npm test`：**350／350**。新增 8 项覆盖精确范围、历史与当前哈希、ID／顺序／分类／IPA、不变的有效短句、238 条句子的重复与填空兼容、词性／释义、冷 core／详情加载、旧作业评分、历史筛查状态、952 个音频的精确文本／版本／四音色矩阵，以及静态失败后的当前文字回退。
- 真实 WordCard 通过生成轻目录及按需详情读取全部 238 词，在 1440／390px 共 **476 组**检查中核对词性、释义、IPA、双语例句、播放按钮尺寸及无横向溢出；无页面异常。已检查 unpaid、polite、longer、smoking、mid 的代表截图。
- 通过真实 Chromium 词卡按钮抽验 12 个代表词 × 四音色，共 **48 个不同公网 MP3**，全部触发原生 `ended`，实际 URL 与清单中的 ID／音色／版本逐个一致，无音频错误或页面异常。代表词包括用户指定的 unpaid、polite、longer、smoking，以及 according、mid、supportive、poorly、operational、meaningful、bankruptcy、sturdy。本项是播放抽样；952 个文件的全量保证来自解码及公网哈希检查。
- Lint、最终生产构建／PWA、`git diff --check` 通过；预缓存 101 项／1914.95 KiB，MP3 不进入前端产物。
- 依次重放通用应用、P1／P2 应用、本批应用、交付／作业／提示生成和两份审计生成，**443 个**相关词库、分片、索引、提示、审校、音频与审计文件逐字节相同；本批和此前修复均未回滚。

证据目录：`output/vocabulary-short-example-repair/` 与 `output/playwright/vocabulary-short-example-repair/`。浏览器使用独立 localhost origin，不接生产账号，不写真实学习记录。

音频已发布，本批代码随本次 Git 提交保存，尚未推送或部署。发布应包含前端全部生成数据／音频映射及 Worker 新作业目录；无 D1 或个人数据迁移。本次同时提交上一轮已验收的学习页侧栏样式调整，详见 `docs/word-learning-status-rail-2026-10-29.md`。

## 改动文件

- canonical／core：`public/data/vocabulary.json`、`public/data/vocabulary/core.json`。
- 生成交付：`public/data/vocabulary/catalog/`、`public/data/vocabulary/details/` 的版本文件，`src/data/vocabulary{Index,DetailsIndex,Startup}.json`，`worker/data/assignment-vocabulary.json`。
- 本批输入／登记／来源／回执：`data/vocabulary-short-example-repair/`；原筛查及状态：`data/vocabulary-short-example-audit/`、`docs/vocabulary-short-example-audit-2026-10-29.md`。
- 音频：`public/audio-updates/2026-10-29-short-examples/manifest.json`、`shared/shortExampleVocabularyAudio.js`、`shared/vocabularyAudio.js`、`scripts/generate_vocabulary_short_example_audio.py`。
- 维护／历史：`scripts/apply-vocabulary-short-examples.mjs`、`scripts/audit-short-examples.mjs`、`scripts/apply-vocabulary-reviews.mjs`、`scripts/apply-vocabulary-teaching-{p1,p2}.mjs`、`scripts/audit-vocabulary-teaching.mjs`、`shared/vocabularyHistory.js`。
- 测试／交接：`tests/vocabulary-short-examples.test.mjs`、`tests/vocabulary-teaching-p2.test.mjs`、既有教学审计的 md／json、本文、`PROJECT_CONTEXT.md`。

## 本批逐词例句

| ID／词条 | 改动字段 | 新英文 | 新中文 |
| --- | --- | --- | --- |
| 5459 · very | example、exampleCn、pos | The soup is very hot today. | 今天的汤很烫。 |
| 5464 · way | example、exampleCn | This is the quickest way to the station. | 这是去车站最快的路线。 |
| 5472 · after | example、exampleCn、pos | We went for a walk after dinner. | 晚饭后我们出去散步了。 |
| 5488 · still | example、exampleCn、pos | Please sit still for a moment. | 请坐着别动一会儿。 |
| 5501 · great | example、exampleCn、pos | We had a great day at the park. | 我们在公园里度过了美好的一天。 |
| 5532 · country | example、exampleCn、pos | She wants to visit another country. | 她想去另一个国家旅行。 |
| 5571 · today | example、exampleCn、pos | I am working from home today. | 我今天在家办公。 |
| 5598 · black | example、exampleCn、pos | She wore a black coat to work. | 她穿了一件黑色外套去上班。 |
| 5606 · around | example、exampleCn、pos | We walked around the lake after lunch. | 午饭后，我们绕着湖散步。 |
| 5623 · road | example、exampleCn | The road is closed for repairs. | 这条路正在维修，暂时封闭。 |
| 5689 · behind | example、exampleCn、pos | She stood behind me in the queue. | 她排在我后面。 |
| 5717 · according | example、exampleCn、pos、meaning | Please sort the books according to size. | 请按大小给这些书分类。 |
| 5833 · science | example、exampleCn | Science is my favorite subject at school. | 科学是我在学校最喜欢的科目。 |
| 5876 · deep | example、exampleCn、pos | The well is too deep to see the bottom. | 这口井太深，看不到井底。 |
| 5877 · worth | example、exampleCn、pos | This old coin is worth ten dollars. | 这枚旧硬币值十美元。 |
| 6002 · healthy | example、exampleCn | The baby is healthy and happy. | 这个婴儿健康又快乐。 |
| 6031 · totally | example、exampleCn | I totally agree with your suggestion. | 我完全同意你的建议。 |
| 6049 · angry | example、exampleCn | She was angry about the delay. | 她对这次延误感到生气。 |
| 6200 · absolutely | example、exampleCn | I am absolutely certain about the date. | 我对日期十分确定。 |
| 6215 · favorite | example、exampleCn、pos | This is my favorite place to read. | 这是我最喜欢的读书地点。 |
| 6321 · constantly | example、exampleCn | The weather is constantly changing here. | 这里的天气不断变化。 |
| 6331 · longer | example、exampleCn | Can we stay a little longer? | 我们能再多待一会儿吗？ |
| 6443 · uncertainty | example、exampleCn | There is uncertainty about the date of the event. | 活动日期还不确定。 |
| 6450 · celebration | example、exampleCn | We planned a celebration for her birthday. | 我们为她的生日安排了一场庆祝活动。 |
| 6504 · nomination | example、exampleCn | She received a nomination for the award. | 她获得了这个奖项的提名。 |
| 6532 · everyday | example、exampleCn | This book describes everyday life in the city. | 这本书描写了城市中的日常生活。 |
| 6781 · ideological | example、exampleCn | The book explores ideological differences between the groups. | 这本书探讨了这些群体之间的思想差异。 |
| 6854 · sexy | example、exampleCn、meaning | She chose a sexy dress for the party. | 她为聚会选了一条性感的连衣裙。 |
| 6864 · handling | example、exampleCn、pos | Careful handling prevents damage to the equipment. | 小心搬运能防止设备受损。 |
| 6875 · mid | example、exampleCn、pos、meaning | The course starts in mid-June. | 这门课程在六月中旬开始。 |
| 6932 · making | example、exampleCn | The making of this film took two years. | 这部电影的制作花了两年时间。 |
| 6945 · dealing | example、exampleCn | Honest dealing builds trust between people. | 诚信交易能建立人与人之间的信任。 |
| 6946 · supportive | example、exampleCn、meaning | My family was supportive during a difficult time. | 在困难时期，家人给了我支持。 |
| 6966 · developmental | example、exampleCn | She studies developmental psychology at university. | 她在大学学习发展心理学。 |
| 6973 · turkish | example、exampleCn、pos | We shared a meal at a Turkish restaurant. | 我们在一家土耳其餐馆一起吃了饭。 |
| 7000 · philosophical | example、exampleCn | The class discussed a philosophical question. | 全班讨论了一个哲学问题。 |
| 7014 · coming | example、exampleCn、pos | We are busy preparing for the coming holiday. | 我们正忙着为即将到来的假期做准备。 |
| 7020 · terribly | example、exampleCn | I am terribly sorry for being late. | 迟到了，我十分抱歉。 |
| 7021 · theological | example、exampleCn | He borrowed a book about theological ideas. | 他借了一本介绍神学思想的书。 |
| 7026 · rental | example、exampleCn、pos | The rental includes heating and water. | 租金包含暖气费和水费。 |
| 7027 · relaxation | example、exampleCn | I listen to music for relaxation. | 我听音乐来放松。 |
| 7053 · disturbing | example、exampleCn | The news was disturbing to everyone. | 这个消息令所有人不安。 |
| 7072 · unidentified | example、exampleCn | An unidentified bird flew past the window. | 一只尚未辨认出的鸟从窗外飞过。 |
| 7075 · sunny | example、exampleCn | We spent a sunny afternoon in the park. | 我们在公园里度过了一个阳光明媚的下午。 |
| 7092 · lordship | example、exampleCn | The title gave him lordship over the land. | 这个头衔赋予了他对这片土地的领主权。 |
| 7097 · ace | example、exampleCn、pos | She hit an ace to win the game. | 她发出一记直接得分球，赢得了比赛。 |
| 7121 · smoking | example、exampleCn | Smoking is not allowed in this room. | 这个房间内不允许吸烟。 |
| 7124 · polite | example、exampleCn | Please be polite to our guests. | 请礼貌地对待我们的客人。 |
| 7134 · iranian | example、exampleCn、pos | The gallery displays work by an Iranian artist. | 这家画廊展出了一位伊朗艺术家的作品。 |
| 7141 · variance | example、exampleCn | There is a variance between the two results. | 这两个结果之间存在差异。 |
| 7149 · countless | example、exampleCn | We spent countless hours on this project. | 我们在这个项目上花了无数个小时。 |
| 7152 · upcoming | example、exampleCn | She is preparing for an upcoming exam. | 她正在为即将到来的考试做准备。 |
| 7164 · architectural | example、exampleCn | The guide explained the building's architectural style. | 导游介绍了这座建筑的建筑风格。 |
| 7187 · poorly | example、exampleCn、pos、meaning | The team played poorly in the first half. | 球队在上半场表现不佳。 |
| 7188 · warming | example、exampleCn | The class discussed global warming today. | 今天全班讨论了全球变暖。 |
| 7196 · gothic | example、exampleCn、pos | The church has beautiful Gothic windows. | 这座教堂有漂亮的哥特式窗户。 |
| 7203 · social | example、exampleCn、pos | The club organizes social events for its members. | 这家俱乐部为会员组织社交活动。 |
| 7235 · patient | example、exampleCn、pos | Please be patient while we check your ticket. | 我们检查您的票时，请耐心等候。 |
| 7243 · international | example、exampleCn、pos | The city hosts an international film festival. | 这座城市举办国际电影节。 |
| 7264 · common | example、exampleCn | We have several interests in common. | 我们有几个共同的兴趣。 |
| 7280 · medical | example、exampleCn、pos | She is studying at a medical college. | 她正在一所医学院学习。 |
| 7289 · region | example、exampleCn | The region is famous for its apples. | 这个地区以苹果闻名。 |
| 7308 · pretty | example、exampleCn、pos | She wore a pretty blue hat. | 她戴了一顶漂亮的蓝色帽子。 |
| 7315 · previous | example、exampleCn | The previous owner painted the door green. | 前任房主把门漆成了绿色。 |
| 7323 · executive | example、exampleCn、pos | The executive spoke at the company meeting. | 这位主管在公司会议上发了言。 |
| 7324 · industrial | example、exampleCn、pos | The town has a large industrial area. | 这座小镇有一大片工业区。 |
| 7329 · religious | example、exampleCn、pos | The museum displays religious art. | 这家博物馆展出宗教艺术品。 |
| 7337 · successful | example、exampleCn | The event was successful. | 这次活动很成功。 |
| 7339 · popular | example、exampleCn | This park is popular with local families. | 这个公园很受当地家庭欢迎。 |
| 7340 · traditional | example、exampleCn | We cooked a traditional meal for the festival. | 我们为节日做了一顿传统饭菜。 |
| 7354 · speaker | example、exampleCn | The speaker answered questions after the talk. | 演讲者在讲座结束后回答了问题。 |
| 7356 · sexual | example、exampleCn | The form asks about sexual orientation. | 这张表格询问性取向。 |
| 7359 · german | example、exampleCn、pos | He is learning German at night school. | 他正在夜校学习德语。 |
| 7370 · responsible | example、exampleCn | She is responsible for booking the tickets. | 她负责订票。 |
| 7371 · painting | example、exampleCn | She hung a painting above the sofa. | 她在沙发上方挂了一幅画。 |
| 7373 · safe | example、exampleCn、pos | Keep your money in a safe place. | 把钱放在安全的地方。 |
| 7378 · highly | example、exampleCn | Her work is highly valued by the team. | 她的工作受到团队的高度重视。 |
| 7381 · fresh | example、exampleCn、pos | We bought fresh bread this morning. | 我们今天早上买了新鲜面包。 |
| 7425 · tiny | example、exampleCn | A tiny bird landed on the fence. | 一只小鸟落在了围栏上。 |
| 7443 · extremely | example、exampleCn | The road is extremely busy at this time. | 这个时候路上非常繁忙。 |
| 7453 · northern | example、exampleCn、pos | Snow covered the northern part of the country. | 积雪覆盖了这个国家的北部。 |
| 7457 · distribution | example、exampleCn | The team organized the distribution of food. | 团队组织了食物分发。 |
| 7458 · proper | example、exampleCn、pos | This job requires proper training. | 这项工作需要适当的培训。 |
| 7461 · historical | example、exampleCn | We visited a museum of historical objects. | 我们参观了一家收藏历史文物的博物馆。 |
| 7470 · familiar | example、exampleCn、pos | Her voice sounds familiar to me. | 她的声音让我觉得熟悉。 |
| 7478 · leading | example、exampleCn、pos | She plays a leading role in the team. | 她在团队中发挥着主导作用。 |
| 7483 · pool | example、exampleCn、pos | The children played in the pool. | 孩子们在游泳池里玩耍。 |
| 7488 · scientific | example、exampleCn | The students carried out a scientific experiment. | 学生们进行了一项科学实验。 |
| 7511 · comfortable | example、exampleCn、pos | These shoes are comfortable for walking. | 这双鞋走路时穿着很舒服。 |
| 7520 · upper | example、exampleCn、pos | Put the books on the upper shelf. | 把书放在上层架子上。 |
| 7552 · terrible | example、exampleCn | The weather was terrible all weekend. | 整个周末的天气都很糟。 |
| 7561 · proud | example、exampleCn | She is proud of her daughter's work. | 她为女儿的作品感到自豪。 |
| 7562 · weak | example、exampleCn | The old bridge is too weak for trucks. | 这座旧桥不够坚固，无法承受卡车通行。 |
| 7572 · sharp | example、exampleCn、pos | Be careful with that sharp knife. | 小心那把锋利的刀。 |
| 7573 · perfectly | example、exampleCn | I can hear you perfectly. | 我能非常清楚地听到你说话。 |
| 7574 · unusual | example、exampleCn | It is unusual to see snow here. | 在这里见到雪很不寻常。 |
| 7576 · creative | example、exampleCn | The children found a creative solution. | 孩子们想出了一个有创意的解决办法。 |
| 7581 · illegal | example、exampleCn | The player made an illegal move in chess. | 这位棋手在国际象棋比赛中走了一步违规的棋。 |
| 7607 · protein | example、exampleCn、pos | Beans are a good source of protein. | 豆类是蛋白质的良好来源。 |
| 7611 · gently | example、exampleCn | Please close the door gently. | 请轻轻关门。 |
| 7613 · exposure | example、exampleCn | The cover protects the bike from exposure to rain. | 这个罩子保护自行车免受雨淋。 |
| 7615 · sudden | example、exampleCn、pos | A sudden change of plan surprised everyone. | 计划突然改变，让所有人都吃了一惊。 |
| 7635 · nervous | example、exampleCn | I feel nervous before an exam. | 考试前我会感到紧张。 |
| 7636 · festival | example、exampleCn、pos | The village holds a festival every spring. | 这个村庄每年春天都举办节庆活动。 |
| 7639 · electronic | example、exampleCn | The shop sells electronic equipment. | 这家商店销售电子设备。 |
| 7643 · nearby | example、exampleCn、pos | We walked to a nearby shop. | 我们步行去了一家附近的商店。 |
| 7662 · stupid | example、exampleCn、pos | I made a stupid mistake on the form. | 我在表格上犯了一个愚蠢的错误。 |
| 7666 · confident | example、exampleCn | She feels confident about her presentation. | 她对自己的演讲很有信心。 |
| 7670 · ultimate | example、exampleCn、pos | Our ultimate goal is to finish the project. | 我们的最终目标是完成这个项目。 |
| 7676 · awful | example、exampleCn | The milk has an awful smell. | 这牛奶的气味很难闻。 |
| 7681 · strategic | example、exampleCn | The company made a strategic decision. | 公司作出了一项战略决策。 |
| 7688 · innocent | example、exampleCn、pos | The judge found him innocent. | 法官认定他无罪。 |
| 7690 · gentle | example、exampleCn | She gave the child a gentle hug. | 她轻轻地拥抱了那个孩子。 |
| 7707 · grateful | example、exampleCn | I am grateful for your help. | 我很感激你的帮助。 |
| 7724 · wealthy | example、exampleCn | A wealthy family donated money to the library. | 一个富裕家庭向图书馆捐了款。 |
| 7736 · strict | example、exampleCn | The school has strict rules about attendance. | 这所学校对出勤有严格规定。 |
| 7741 · curious | example、exampleCn | The child was curious about the old map. | 那个孩子对这张旧地图很好奇。 |
| 7747 · invitation | example、exampleCn | She sent me an invitation to dinner. | 她给我发来了晚餐邀请。 |
| 7748 · generous | example、exampleCn | That was a generous gift. | 那是一份慷慨的馈赠。 |
| 7749 · weekly | example、exampleCn、pos | We meet weekly to discuss our progress. | 我们每周见面讨论进展。 |
| 7750 · nut | example、exampleCn | The squirrel found a nut under the tree. | 松鼠在树下找到了一颗坚果。 |
| 7752 · electrical | example、exampleCn | An electrical fault caused the lights to go out. | 一个电气故障导致灯灭了。 |
| 7761 · satisfactory | example、exampleCn、meaning | The quality of the work was satisfactory. | 这项工作的质量令人满意。 |
| 7764 · invasion | example、exampleCn | The museum has an exhibition about the invasion. | 博物馆有一个关于那次入侵的展览。 |
| 7783 · desirable | example、exampleCn | Good communication is a desirable skill. | 良好的沟通能力是一项可取的技能。 |
| 7799 · mechanical | example、exampleCn | The clock has a mechanical movement. | 这只钟采用机械机芯。 |
| 7801 · uncertain | example、exampleCn | I am uncertain about the best route. | 我不确定哪条路线最好。 |
| 7807 · unhappy | example、exampleCn | He was unhappy with the result. | 他对结果不满意。 |
| 7812 · peaceful | example、exampleCn | We enjoyed a peaceful afternoon in the garden. | 我们在花园里度过了一个宁静的下午。 |
| 7834 · influential | example、exampleCn | She is an influential member of the team. | 她是团队中一位有影响力的成员。 |
| 7849 · operational | example、exampleCn、meaning | The machine is now fully operational. | 这台机器现在已经可以正常运转。 |
| 7854 · nonsense | example、exampleCn | That story is complete nonsense. | 那个故事完全是胡说八道。 |
| 7858 · lively | example、exampleCn | We had a lively discussion about the book. | 我们围绕这本书展开了热烈讨论。 |
| 7859 · optimistic | example、exampleCn | She is optimistic about the future. | 她对未来很乐观。 |
| 7868 · worthwhile | example、exampleCn | Helping at the library is a worthwhile activity. | 在图书馆帮忙是一项值得做的活动。 |
| 7870 · conscience | example、exampleCn | His conscience told him to return the money. | 他的良心告诉他应该把钱还回去。 |
| 7873 · costly | example、exampleCn | The company made a costly mistake. | 公司犯了一个代价高昂的错误。 |
| 7881 · fever | example、exampleCn | She stayed at home with a fever. | 她因为发烧待在家里。 |
| 7885 · instant | example、exampleCn、pos | She recognized him in an instant. | 她一下子就认出了他。 |
| 7904 · unpleasant | example、exampleCn | There is an unpleasant smell in the kitchen. | 厨房里有一股难闻的气味。 |
| 7906 · overnight | example、exampleCn、pos | We stayed overnight at a small hotel. | 我们在一家小旅馆住了一夜。 |
| 7911 · noble | example、exampleCn、pos | She made a noble effort to help others. | 她为帮助他人作出了高尚的努力。 |
| 7912 · mathematical | example、exampleCn | The students solved a mathematical problem. | 学生们解答了一道数学题。 |
| 7920 · fond | example、exampleCn | She is fond of reading adventure stories. | 她喜欢读冒险故事。 |
| 7923 · competent | example、exampleCn | She is a competent driver. | 她是一位技术熟练的司机。 |
| 7924 · faithful | example、exampleCn、pos | She has been a faithful friend for years. | 多年来，她一直是一位忠实的朋友。 |
| 7928 · cheerful | example、exampleCn | He sounded cheerful on the phone. | 他在电话里听起来很高兴。 |
| 7941 · noisy | example、exampleCn | The cafe was too noisy for conversation. | 这家咖啡馆太吵，不适合交谈。 |
| 7963 · rude | example、exampleCn | It is rude to interrupt someone. | 打断别人说话很不礼貌。 |
| 7970 · inexpensive | example、exampleCn | We found an inexpensive hotel near the station. | 我们在车站附近找到了一家便宜的旅馆。 |
| 7986 · photographic | example、exampleCn | The shop sells photographic equipment. | 这家商店销售摄影器材。 |
| 7990 · fearful | example、exampleCn | The child was fearful of the dark. | 那个孩子怕黑。 |
| 7998 · vacant | example、exampleCn | The seat next to me is vacant. | 我旁边的座位空着。 |
| 8001 · hardship | example、exampleCn | The family faced hardship after losing their home. | 失去住所后，这个家庭面临困境。 |
| 8008 · helpless | example、exampleCn | I felt helpless when the car broke down. | 汽车抛锚时，我感到无助。 |
| 8024 · worse | example、exampleCn、pos | The weather is worse today. | 今天的天气更糟了。 |
| 8030 · accidental | example、exampleCn、pos | The damage was accidental. | 这次损坏是意外造成的。 |
| 8031 · ignorant | example、exampleCn | I was ignorant of the new rules. | 我当时不知道这些新规定。 |
| 8032 · gloomy | example、exampleCn | The sky looked gloomy before the storm. | 暴风雨前，天空显得阴沉。 |
| 8037 · incorrect | example、exampleCn | The address on the package is incorrect. | 包裹上的地址不正确。 |
| 8039 · naughty | example、exampleCn | The naughty puppy chewed my shoe. | 那只淘气的小狗咬了我的鞋。 |
| 8045 · rainy | example、exampleCn | We stayed indoors on a rainy afternoon. | 在一个下雨的下午，我们待在室内。 |
| 8056 · slippery | example、exampleCn | Be careful on the slippery floor. | 地板很滑，请小心。 |
| 8064 · practicable | example、exampleCn | We need a practicable plan for the project. | 我们需要一个切实可行的项目计划。 |
| 8074 · respectful | example、exampleCn | The students were respectful to their teacher. | 学生们对老师很尊敬。 |
| 8080 · gracious | example、exampleCn | Our host was gracious to every guest. | 主人对每一位客人都很亲切。 |
| 8083 · solemn | example、exampleCn | They made a solemn promise to help. | 他们郑重承诺提供帮助。 |
| 8089 · worthless | example、exampleCn | The broken watch is worthless. | 那只坏表一文不值。 |
| 8092 · tramp | example、exampleCn、pos | We had to tramp through the mud. | 我们不得不踩着泥泞艰难前行。 |
| 8093 · yearly | example、exampleCn、pos | The club holds a yearly meeting. | 俱乐部每年召开一次会议。 |
| 8099 · sly | example、exampleCn | The sly fox stole food from the garden. | 那只狡猾的狐狸偷走了花园里的食物。 |
| 8102 · shady | example、exampleCn | We rested in a shady corner of the garden. | 我们在花园一个荫凉的角落休息。 |
| 8104 · attentive | example、exampleCn | The students were attentive during the lesson. | 学生们上课时很专心。 |
| 8105 · humorous | example、exampleCn | He told a humorous story at dinner. | 他在晚餐时讲了一个幽默的故事。 |
| 8110 · troublesome | example、exampleCn | The broken lock is troublesome. | 这把坏锁很让人头疼。 |
| 8111 · rusty | example、exampleCn | The gate is old and rusty. | 这扇大门又旧又生锈。 |
| 8114 · unjust | example、exampleCn | The players thought the decision was unjust. | 球员们认为这个决定不公平。 |
| 8116 · vain | example、exampleCn | He made a vain attempt to open the door. | 他试图打开门，却没有成功。 |
| 8121 · elastic | example、exampleCn、pos | The fabric is soft and elastic. | 这种面料柔软而有弹性。 |
| 8140 · victorious | example、exampleCn | The victorious team lifted the trophy. | 获胜的球队举起了奖杯。 |
| 8147 · indignant | example、exampleCn | She was indignant about the unfair decision. | 她对这个不公平的决定感到愤慨。 |
| 8159 · cordial | example、exampleCn、pos | She gave us a cordial welcome. | 她热情地欢迎了我们。 |
| 8177 · environmental | example、exampleCn | The group studies environmental problems. | 这个小组研究环境问题。 |
| 8205 · clinical | example、exampleCn | She works in clinical research at a hospital. | 她在一家医院从事临床研究。 |
| 8221 · athletic | example、exampleCn | The school has excellent athletic facilities. | 这所学校有很好的体育设施。 |
| 8249 · superb | example、exampleCn | The restaurant serves superb food. | 这家餐馆的饭菜非常出色。 |
| 8254 · allegation | example、exampleCn | The manager denied the allegation. | 经理否认了这项指控。 |
| 8265 · diplomatic | example、exampleCn | She works in the diplomatic service. | 她从事外交工作。 |
| 8270 · random | example、exampleCn、pos | The teacher chose a name at random. | 老师随机选了一个名字。 |
| 8274 · chronic | example、exampleCn、pos | He visited a doctor for chronic back pain. | 他因长期背痛去看了医生。 |
| 8276 · adoption | example、exampleCn | The council approved the adoption of the new plan. | 委员会批准采用这项新计划。 |
| 8285 · meaningful | example、exampleCn、meaning | They had a meaningful conversation about their future. | 他们就自己的未来进行了一次有意义的交谈。 |
| 8314 · forthcoming | example、exampleCn、pos | The notice gives details of the forthcoming meeting. | 通知介绍了即将召开的会议的详情。 |
| 8315 · virgin | example、exampleCn、pos | The blanket is made from virgin wool. | 这条毯子由初次使用的纯羊毛制成。 |
| 8319 · bankruptcy | example、exampleCn、meaning | The company faced bankruptcy after years of losses. | 连年亏损后，这家公司面临破产。 |
| 8328 · tragic | example、exampleCn | The film tells a tragic story. | 这部电影讲述了一个悲惨的故事。 |
| 8342 · shark | example、exampleCn、pos | We saw a shark at the aquarium. | 我们在水族馆里看到了一条鲨鱼。 |
| 8346 · vocal | example、exampleCn、pos | The singer practices vocal exercises every morning. | 这位歌手每天早上练声。 |
| 8353 · dreadful | example、exampleCn | We had dreadful weather during the trip. | 旅行期间的天气糟透了。 |
| 8366 · brutal | example、exampleCn | The report described the prison's brutal conditions. | 这份报告描述了监狱里残酷的生活条件。 |
| 8369 · threshold | example、exampleCn | Please leave your shoes at the threshold. | 请把鞋留在门槛边。 |
| 8373 · fantastic | example、exampleCn | We had a fantastic time at the beach. | 我们在海滩上玩得非常开心。 |
| 8378 · blond | example、exampleCn、pos | He has blond hair and brown eyes. | 他有金色头发和棕色眼睛。 |
| 8384 · molecular | example、exampleCn | The diagram shows the molecular structure of water. | 这张图展示了水的分子结构。 |
| 8396 · orthodox | example、exampleCn | The school follows an orthodox teaching method. | 这所学校采用传统的教学方法。 |
| 8409 · corps | example、exampleCn | She joined the medical corps last year. | 她去年加入了医疗队。 |
| 8422 · grim | example、exampleCn、meaning | The report gave a grim picture of the damage. | 这份报告呈现了令人担忧的受损状况。 |
| 8430 · rattle | example、exampleCn、pos | The old door began to rattle in the wind. | 旧门开始在风中咯咯作响。 |
| 8432 · gorgeous | example、exampleCn | The garden looks gorgeous in spring. | 这座花园在春天看起来很美。 |
| 8441 · attachment | example、exampleCn | I sent the photo as an email attachment. | 我把照片作为电子邮件附件发了出去。 |
| 8464 · bourgeois | example、exampleCn、pos | The novel describes bourgeois life in the city. | 这部小说描写了城市中产阶级的生活。 |
| 8477 · cereal | example、exampleCn、pos | I ate a bowl of cereal for breakfast. | 我早餐吃了一碗麦片。 |
| 8511 · incapable | example、exampleCn | The old printer is incapable of printing photos. | 这台旧打印机无法打印照片。 |
| 8512 · token | example、exampleCn、pos | You need a token to use this machine. | 使用这台机器需要一枚代币。 |
| 8514 · premature | example、exampleCn、pos | It is premature to make a decision now. | 现在作决定为时过早。 |
| 8539 · rigorous | example、exampleCn | The equipment must pass rigorous tests. | 这些设备必须通过严格测试。 |
| 8540 · sturdy | example、exampleCn、meaning | We need a sturdy table for the workshop. | 工作间需要一张结实的桌子。 |
| 8547 · diagnostic | example、exampleCn、pos | The teacher used a diagnostic test. | 老师进行了一次诊断性测试。 |
| 8571 · susceptible | example、exampleCn | The old roof is susceptible to damage. | 旧屋顶很容易受损。 |
| 8572 · immunity | example、exampleCn | The lesson explains how immunity works. | 这节课解释了免疫的运作原理。 |
| 8577 · slack | example、exampleCn、pos | The rope became slack when he let go. | 他一松手，绳子就松了。 |
| 8579 · benign | example、exampleCn | He gave us a benign smile. | 他朝我们和善地笑了笑。 |
| 8593 · postal | example、exampleCn | The postal service delivers letters every weekday. | 邮政部门每个工作日都投递信件。 |
| 8598 · residual | example、exampleCn、pos | The filter removes residual dirt from the water. | 过滤器去除水中残留的污物。 |
| 8608 · terminology | example、exampleCn | The teacher explained the scientific terminology. | 老师解释了这些科学术语。 |
| 8613 · masculine | example、exampleCn、pos | The jacket has a masculine style. | 这件夹克带有男性化的风格。 |
| 8616 · provocative | example、exampleCn、meaning、pos | The speaker asked a provocative question. | 演讲者提出了一个发人深省的问题。 |
| 8620 · intricate | example、exampleCn | The box has an intricate design. | 这个盒子的设计很复杂。 |
| 8624 · latent | example、exampleCn、pos | The test revealed her latent talent. | 这次测试显示了她潜在的才能。 |
| 8630 · gradient | example、exampleCn | The road has a steep gradient. | 这条路的坡度很陡。 |
| 8639 · stubborn | example、exampleCn | He is too stubborn to change his mind. | 他太固执，不肯改变主意。 |
| 8646 · mastery | example、exampleCn | Her mastery of the language impressed us. | 她对这门语言的精通让我们印象深刻。 |
| 8647 · arrogant | example、exampleCn | His arrogant manner upset his colleagues. | 他傲慢的态度让同事们不快。 |
| 8667 · unpaid | example、exampleCn | Several bills are still unpaid. | 几张账单仍未支付。 |
| 8673 · frail | example、exampleCn、pos | The old chair is too frail to use. | 这把旧椅子太脆弱，不能再用了。 |
| 8675 · incompatible | example、exampleCn | The two programs are incompatible with each other. | 这两个程序互不兼容。 |
| 8692 · chestnut | example、exampleCn、pos | We roasted a chestnut over the fire. | 我们在火上烤了一颗栗子。 |
| 8694 · roundabout | example、exampleCn、pos | We took a roundabout route to the station. | 我们绕道去了车站。 |
