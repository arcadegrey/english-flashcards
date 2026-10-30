# 首批 50 个新增学习单元（2026-10-29）

> 后续发布状态（2026-10-30 整理）：本批已提交为 `5de1c1f`，2026-10-29 的核对记录确认已推送且 Actions #150 自动部署成功。本文末尾“本轮未提交、推送或部署”保留当次编辑操作的历史范围，不再表示当前待发布。发布凭据与生产验收边界见[发布状态](release-status.md)。

落实覆盖审计的全部 50 个新增候选：30 个表达／短语、20 个单词。新增 ID **9027–9076**，活动词库 **8699 → 8749**，完整 core **3495 → 3545**，daily **2047 → 2097**。原 8699 条记录逐字节语义不变，原顺序及分类保持；没有迁移、重用或合并旧 ID，没有写个人学习存储。327 个退役记录继续仅供历史引用。

## 编辑与核源

本批加入“日常常用”，覆盖一般日常表达及通用进阶词汇，不声称具备 CET／IELTS／TOEFL 官方分类。来源版本及候选关联保留在 `sources-2026-10-29.json`。旧覆盖报告保持冻结快照；其 50 条 proposal 仍保留当时 null ID，落实状态以本批新登记为准。

逐项核对原 Oxford／AWL／CET 参照和韦氏词典等公开词典／语法条目；文法模板按原词表表头和组成词的语法用法核对，不把每个模板说成词典独立词条。剑桥部分页面返回 403，使用可见的官方检索内容与其它已读取来源补充，不把失败请求记为全文核验。词性按本批选择的常用教学义，不冒充完整词典所有义项。

音标采用编辑转写的英式引用读法；多词表达按各组成词及常见弱读编辑，不声称逐条照抄词典的整短语 IPA。上传 upload 的英式动词读法另核对 Oxford `upload_1`；美式录音重音可按韦氏收录读法不同。四音色保持原英美音色。单词 IPA 不等于对所有连读及口音的穷尽认证。

50 条默认双语完整例句及 100 条提示例句独立编写。I'm／I 保留正确大写，you're welcome 保留缩写；语法与语用提示包括 would like + to do、feel like + -ing、why not + 原形、不可数 housework、discriminate between／against 的差别及 get lost 的不礼貌命令义。wake me up 与 noodles 使用明确、可核源的单例词形标注，不在运行时猜词干。

这是单模型编辑核对，不是独立语言专家认证。

## 数据、学习与历史兼容

- 新词追加 canonical 和完整 core；现有 TOEFL／IELTS Lists 原文与归属不改，两个 manifest 的 sourceTotal／core.count 更新为 8749／3545。
- 原生成器更新 startup／分类／ID／详情索引、catalog／details、提示批次及 Worker 新作业目录，所有实时总量为 8749。全库与统计总量改用当前启动索引，避免旧缓存 manifest 的 8699 覆盖新总量；保留各考试实际范围计数。
- `beforeExpansion50Review` 仅供维护／历史测试去除精确登记的新 ID，再由原链路恢复早期文本；从不操作用户进度。当前原始哈希必须匹配登记，防止未知编辑被历史重建掩盖。
- P1／P2／短例句／十词旧应用脚本识别本批完整哈希后保留扩充。通用修复脚本仍保留新 ID；扩充命令严格校验前后哈希、旧 core 和新 ID／拼写碰撞，重复执行不重复追加。
- 旧作业快照保留旧选项及评分；新作业可选新 ID。现有收藏、已学、错词、复习、成绩和账号隔离实现不变。

## 音频与发布

50 单元 × word／example × af_bella／am_michael／bf_emma／bm_george，共 **400 个 MP3**。沿用本地 Kokoro 和既有不可变文本版本映射，批次 `audio-updates/2026-10-29-expansion-50/`。MP3 排除于 Git 与前端／PWA 产物，只交付 manifest／映射／回执；旧音频 URL 不覆盖。

全部 400 个录音和清单已上传原 R2 桶；公网逐文件验证 HTTP 200、大小、SHA-256、audio/mpeg 及清单哈希。本地 400 个录音全部通过完整解码、24 kHz 单声道格式和非静音检查。

## 最终验证

- 全量 **374／374** 测试通过，Lint、生产构建／PWA、`git diff --check` 通过。
- 全部 50 词在 1440／390px 共 **100 组**真实词卡检查通过，双语例句、IPA、词性、提示、按钮及无横向溢出均验证。
- 8 个代表词 × word／example × 四音色，共 **64 个不同公网 MP3** 经真实按钮触发原生 `ended`；逐条 URL 匹配，无音频错误。
- 真实应用 hooks 注入旧 manifest 总量 8699 后，词库／计划／统计仍为 **8749**，daily 为 **2097**；原已学 `[4416,6508,9026]` 保持，剩余 **8746** 正确。
- 通用／旧批次／本批应用、交付／作业／提示生成及三份历史审计重放，**471 个文件**逐字节相同（此前快照不包含最终新增的 verification 回执）。

最终上传、校验、播放和测试状态见本批 `verification.json` 及 `audio-r2-release-2026-10-29.json`。解码、非静音与播放完成不等于人工逐条听辨。

应用发布需同步包含前端生成数据／提示／音频映射及 Worker 作业目录。无 D1 或个人数据迁移；本轮未提交、推送或部署应用。

## 定稿词条

| ID | 词头 | 英式 IPA | 词性 | 教学义 | 默认例句 | 中文 |
| --- | --- | --- | --- | --- | --- | --- |
| 9027 | thank you | θæŋk juː | phr. | 谢谢；感谢你 | Thank you for helping me today. | 谢谢你今天帮助我。 |
| 9028 | you're welcome | jɔː ˈwelkəm | phr. | 不客气（回应感谢） | You're welcome, and I am happy to help. | 不客气，我很乐意帮忙。 |
| 9029 | how are you | haʊ ɑː juː | phr. | 你好吗（问候语） | How are you feeling this morning? | 你今天早上感觉怎么样？ |
| 9030 | I'm sorry | aɪm ˈsɒri | phr. | 对不起；我很遗憾 | I'm sorry I broke your cup. | 对不起，我打碎了你的杯子。 |
| 9031 | how about | haʊ əˈbaʊt | phr. | ……怎么样（提出建议或询问） | How about taking a short break? | 休息一小会儿怎么样？ |
| 9032 | what about | wɒt əˈbaʊt | phr. | ……怎么样；那么……呢 | What about the bags we left upstairs? | 我们留在楼上的包怎么办？ |
| 9033 | would you like | wʊd juː laɪk | phr. | 你想要……吗（礼貌提议或邀请） | Would you like some orange juice? | 你想喝点橙汁吗？ |
| 9034 | right now | raɪt naʊ | adv. | 现在；立刻 | I cannot answer the phone right now. | 我现在无法接电话。 |
| 9035 | look at | lʊk æt | v. | 看；注视；查看 | Please look at the picture on the wall. | 请看墙上的那幅画。 |
| 9036 | wake up | weɪk ʌp | v. | 醒来；叫醒 | I wake up before seven every day. | 我每天七点前醒来。 |
| 9037 | I think so | aɪ θɪŋk səʊ | phr. | 我想是的；我认为如此 | I think so, but I will check the time. | 我想是的，不过我会核对时间。 |
| 9038 | in the middle | ɪn ðə ˈmɪdl | adv. | 在中间；在……期间（常接 of） | The child in the middle is my brother. | 中间那个孩子是我的弟弟。 |
| 9039 | as long as | æz lɒŋ æz | conj. / phr. | conj. 只要；phr. 与……一样长（或久） | You can borrow it as long as you return it. | 只要你归还，就可以借走它。 |
| 9040 | due to | djuː tuː | prep. | 由于；因为 | The train is late due to heavy snow. | 由于大雪，火车晚点了。 |
| 9041 | come on | kʌm ɒn | phr. | 快点；加油；得了吧（依语气而定） | Come on, we can finish this together! | 加油，我们能一起完成这件事！ |
| 9042 | get lost | ɡet lɒst | v. | 迷路；走开（命令语气时不礼貌） | We might get lost without a map. | 没有地图，我们可能会迷路。 |
| 9043 | no way | nəʊ weɪ | phr. | 不可能；绝不；没门（非正式） | There is no way we can finish today. | 我们今天不可能完成。 |
| 9044 | it depends | ɪt dɪˈpendz | phr. | 看情况；那得视情况而定 | It depends on how much time we have. | 这取决于我们有多少时间。 |
| 9045 | let me know | let miː nəʊ | phr. | 告诉我；让我知道 | Please let me know when you arrive. | 你到了请告诉我。 |
| 9046 | feel like | fiːl laɪk | v. | 想要；感觉像 | I feel like going for a walk. | 我想去散步。 |
| 9047 | get out | ɡet aʊt | v. | 出去；离开；传开（消息） | Please get out of the car carefully. | 请小心地下车。 |
| 9048 | go away | ɡəʊ əˈweɪ | v. | 离开；消失 | The dark clouds will go away soon. | 乌云很快就会散去。 |
| 9049 | on top of | ɒn tɒp əv | prep. | 在……上面；除……之外还 | Your keys are on top of the fridge. | 你的钥匙在冰箱顶上。 |
| 9050 | as part of | æz pɑːt əv | phr. | 作为……的一部分 | We read a story as part of the lesson. | 我们把读一篇故事作为这堂课的一部分。 |
| 9051 | in this way | ɪn ðɪs weɪ | phr. | 用这种方式；这样 | Fold the paper in this way to make a boat. | 像这样折纸，就能做出一只船。 |
| 9052 | for this reason | fə ðɪs ˈriːzn | phr. | 因此；由于这个原因 | The road is icy; for this reason, we walk slowly. | 道路结冰了，因此我们走得很慢。 |
| 9053 | so that | səʊ ðæt | conj. | 以便；因此（连接目的或结果） | Speak clearly so that everyone can hear you. | 说清楚些，以便每个人都能听见。 |
| 9054 | why not | waɪ nɒt | phr. | 为什么不……（建议）；好啊（表示同意） | Why not take the bus instead? | 为什么不改乘公共汽车呢？ |
| 9055 | belong to | bɪˈlɒŋ tuː | v. | 属于；是……的成员 | These books belong to the school. | 这些书属于学校。 |
| 9056 | focus on | ˈfəʊkəs ɒn | v. | 集中于；关注 | Let us focus on one question at a time. | 我们一次集中处理一个问题吧。 |
| 9057 | aloud | əˈlaʊd | adv. | 出声地；让人听得见地 | Please read the first sentence aloud. | 请把第一句话读出声来。 |
| 9058 | ant | ænt | n. | 蚂蚁 | An ant is carrying a tiny leaf. | 一只蚂蚁正搬着一片小叶子。 |
| 9059 | attic | ˈætɪk | n. | 阁楼；屋顶下的储藏空间 | We keep old toys in the attic. | 我们把旧玩具存放在阁楼里。 |
| 9060 | classmate | ˈklɑːsmeɪt | n. | 同班同学 | My classmate lent me a blue pen. | 我的同班同学借给我一支蓝笔。 |
| 9061 | cough | kɒf | v. / n. | v. 咳嗽；n. 咳嗽；咳嗽声 | Please cover your mouth when you cough. | 咳嗽时请捂住嘴。 |
| 9062 | housework | ˈhaʊswɜːk | n. | 家务劳动 | We share the housework at home. | 我们在家分担家务。 |
| 9063 | noodle | ˈnuːdl | n. | 面条（通常用复数 noodles） | A long noodle fell from my fork. | 一根长面条从我的叉子上掉了下来。 |
| 9064 | zoo | zuː | n. | 动物园 | We saw two pandas at the zoo. | 我们在动物园看到了两只熊猫。 |
| 9065 | kilogram | ˈkɪləɡræm | n. | 千克；公斤 | This bag of rice weighs one kilogram. | 这袋米重一千克。 |
| 9066 | upload | ˌʌpˈləʊd | v. | 上传（文件或数据） | Please upload your photo to the website. | 请把你的照片上传到网站。 |
| 9067 | append | əˈpend | v. | 追加；附加在末尾 | Please append your name to the list. | 请把你的名字加在名单末尾。 |
| 9068 | automate | ˈɔːtəmeɪt | v. | 使自动化 | This tool can automate simple office tasks. | 这个工具能让简单的办公任务自动完成。 |
| 9069 | discriminate | dɪˈskrɪmɪneɪt | v. | 辨别；区别对待；歧视 | We should not discriminate against anyone. | 我们不应歧视任何人。 |
| 9070 | finite | ˈfaɪnaɪt | adj. | 有限的；有界限的 | We have a finite amount of time. | 我们的时间是有限的。 |
| 9071 | maximize | ˈmæksɪmaɪz | v. | 使最大化；充分利用 | We arranged the desks to maximize space. | 我们调整了课桌位置，以充分利用空间。 |
| 9072 | negate | nɪˈɡeɪt | v. | 否定；使无效；抵消 | One error can negate all our hard work. | 一个错误就可能使我们的全部努力付诸东流。 |
| 9073 | underlie | ˌʌndəˈlaɪ | v. | 构成……的基础；位于……之下 | Simple rules underlie this complex game. | 简单的规则构成了这个复杂游戏的基础。 |
| 9074 | clarity | ˈklærəti | n. | 清晰；清楚；明晰 | The teacher explained the rules with clarity. | 老师清楚地解释了规则。 |
| 9075 | credible | ˈkredəbl | adj. | 可信的；可靠的 | We need credible evidence before making a decision. | 做决定前，我们需要可信的证据。 |
| 9076 | resilience | rɪˈzɪliəns | n. | 恢复力；韧性；适应力 | The team showed resilience after losing the first game. | 输掉首场比赛后，这支队伍展现了韧性。 |

## 改动文件

- 本批内容／登记／来源／提示／验收：`data/vocabulary-expansion-50/`。
- canonical／core、生成的 catalog／details、四份 vocabulary 索引、提示批次及 manifest、Worker 作业目录。
- `src/data/coreWordNotes.js`、`shared/vocabularyHistory.js`、`shared/vocabularyAudio.js`、`shared/expansion50VocabularyAudio.js`。
- `scripts/apply-vocabulary-expansion-50.mjs`、`scripts/generate_vocabulary_expansion_50_audio.py`、旧内容应用／审计脚本的后续版本保护与历史重建。
- 本批测试、受影响的历史计数测试、当前学习计划／合并／交付测试，`useVocabularyCatalog.js`／`useStudyOverview.js` 的总量来源修正，本文及 `PROJECT_CONTEXT.md`。
