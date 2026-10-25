# 实用词库替换交接（2026-10-25）

## 已执行范围

用户授权将收录审查中的148条姓名词和99条专题候选共247条全部替换。其他36条义项待核项、2条限定语境项不在本批范围内。

- 活动词库仍为8699条学习记录、8697个不同词头；原有 spectator / precaution 两对同形记录保留。
- 新247条使用ID 8700–8946，均归为 `daily`，不继承旧条目的 `cet4` 标签。包括 passport、umbrella、smartphone、password、pharmacy，以及 check in、credit card、find out、on time 等。
- 109条为空格分隔的常用短语或固定表达。没有为凑数加入新人名、地名或冷僻专业词。
- 旧247条完整存于 `shared/retiredVocabulary.js`，仅用于历史记录、收藏、老师旧记录查询和旧客户端待同步成绩评分。ID不重用，旧成绩不转移给新词。
- 8452条无关旧词的字段和相对顺序不变；把当前旧ID与历史副本合并可恢复替换前词库哈希。
- 分类计数：日常2029、四级2075、六级1520、托福3251、雅思3257。分类有交集，不能直接相加。启动core为3481条。

## 内容与证据

- 每条含词性、中文义项、音标、原创基础例句及译文、具体提示和两条双语提示例句，共494条；基础例句复用第一条提示例句。
- 对照[牛津官方词表](https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000)、[官方短语表](https://www.oxfordlearnersdictionaries.com/wordlists/oxford-phrase-list)和对应词条，按生活、学习、出行、数字工具等用途选择。来源URL、日期、网页SHA-256、来源等级和锚点状态存于 `data/vocabulary-replacement/sources-2026-10-25.json`。
- 部分链接锚点失效，但对应正文及官方短语表可核对；不把HTTP成功等同于语义审校。短语有时列在关联词的例句、搭配或习语部分。
- 单词优先采用词条音标；短语使用编辑转写的英式宽式音标，记录于 `phrase-phonetics-2026-10-25.json`，不声称从每个词条逐字摘录。英美录音使用各自音色。
- 中文解释、提示和例句由本项目编写，不复制词典例句或完整释义。494条例句与旧词库、旧提示精确去重。本轮不是独立语言专家审校。
- 原有提示保留历史用途；活动8699条全覆盖，含历史共8946条登记、8788组、17576条例句。

## 本地四音色录音

- 本地Kokoro-82M，音色为 af_bella / am_michael / bf_emma / bm_george。
- 247个词头/短语与247个基础例句，各4音色，共1976个MP3、13773312字节，24 kHz单声道、24 kbps。
- 本机生成路径为 `public/audio-updates/2026-10-25/`；发布到R2的同名 `audio-updates/2026-10-25/` 前缀。MP3已忽略，不进入Git、前端包或PWA预缓存；不覆盖旧R2录音。发布核验见 `audio-r2-release-2026-10-25.md`。
- 文本与ID精确匹配后使用新音频。旧快照保留历史文本与音频规则。
- 脚本逐文件校验哈希并保存断点；本批文本变化时移除该文本的旧版本文件并重合成，manifest不混入过期录音。
- 全部通过格式与完整解码检查；没有逐句人工听审，技术检查不等于语言听审。

## 学习与数据兼容

- 活动词库、分片、干扰项和新作业目录不含247个退役ID。更新后按序号创建的新作业使用新范围，已发布作业快照不重写。
- 今日计划剩余数只按活动ID计算；退役词不再进入每日到期复习。原始认识标记、错词、收藏、学习历史、离线草稿和账号隔离规则不清空或迁移。
- 历史集合仍按旧ID显示原文，用现有提示样式说明已移出当前词库；用户主动查看旧集合时原有动作仍可用。
- 老师学生详情可解析旧ID。统计保留历史认识记录，分母包含已记录的退役词并使用完整活动目录数量，避免未加载分片时比例失真。
- Worker对旧客户端离线成绩使用活动词和历史副本评分；内置ID优先于同ID自定义数据，保留账号、类别、重复提交及历史成绩不可变校验。

## 发布与复现

无需D1迁移。先上传并核验R2音频，再提交并一起部署前端和Worker；仅发布前端会导致服务端不认识新ID。R2音频发布状态见 `audio-r2-release-2026-10-25.md`。未执行Git推送或前端/Worker生产部署。

```bash
node scripts/build-practical-vocabulary.mjs
node scripts/split-vocabulary.mjs
node scripts/build-assignment-catalog.mjs
HF_HUB_OFFLINE=1 PYTORCH_ENABLE_MPS_FALLBACK=1 OMP_NUM_THREADS=4 .venv-kokoro/bin/python scripts/generate_practical_vocabulary_audio.py
node scripts/report-word-notes.mjs > docs/word-notes-coverage.md
npm test
npm run lint
npm run build
```

源TSV无表头，列依次为word、pos、meaning、example、exampleCn、第二例句、第二译文、用法提示。构建时保留原活动位置，用新ID加入内容；位置对应不代表迁移成绩。

## 验证状态

- 123项自动测试通过，包含247条授权范围、旧库可恢复哈希、新旧ID隔离、494条例句去重、1976音频哈希、旧离线成绩四模式与跨账号限制、旧作业服务端快照评分。
- lint、生产构建/PWA、Worker dry-run打包通过，保留既有大包和CSS插件耗时提示。
- 1976个MP3全部通过ffprobe格式核对和ffmpeg完整解码；文本/文件哈希一致，报告在忽略目录 `output/vocabulary-replacement/audio-validation.json`。
- 1440px桌面：收藏集合中旧Sam可读，新passport义项、提示、参考链接可用；发音命中新版本URL并收到播放结束事件，无横向溢出。
- 390px手机：背词专属布局、三个横向动作正常，无横向溢出。虚构访客旧ID保留，passport未继承旧状态；今日计划仍显示1个新词剩余，旧Sam不进入到期队列。
- 浏览器使用隔离访客，没有真实生产账号验收；截图在忽略的 `output/playwright/practical-vocabulary-*.png`。

## 变更文件

下方列出本轮实际改变的文件，保留此前33条修复的其他未提交改动。

- `PROJECT_CONTEXT.md`
- `data/vocabulary-replacement/phrase-phonetics-2026-10-25.json`
- `data/vocabulary-replacement/practical-2026-10-25.json`
- `data/vocabulary-replacement/practical-2026-10-25.tsv`
- `data/vocabulary-replacement/replacement-manifest.json`
- `data/vocabulary-replacement/sources-2026-10-25.json`
- `docs/core-word-notes.md`
- `docs/practical-vocabulary-replacement-2026-10-25.md`
- `docs/project-reference.md`
- `docs/vocabulary-inclusion-audit.json`
- `docs/vocabulary-inclusion-audit.md`
- `docs/word-notes-coverage.md`
- `plan.md`
- `public/data/vocabulary.json`
- `public/data/vocabulary/core.json`
- `public/data/vocabulary/ielts/manifest.json`
- `public/data/vocabulary/toefl/level-5/list-4.json`
- `public/data/vocabulary/toefl/level-6/list-1.json`
- `public/data/vocabulary/toefl/level-6/list-4.json`
- `public/data/vocabulary/toefl/manifest.json`
- `scripts/audit-base-vocabulary.mjs`
- `scripts/audit-vocabulary-inclusion.mjs`
- `scripts/build-practical-vocabulary.mjs`
- `scripts/generate_practical_vocabulary_audio.py`
- `scripts/report-word-notes.mjs`
- `shared/practicalVocabularyAudio.js`
- `shared/retiredVocabulary.js`
- `shared/vocabularyAudio.js`
- `src/App.jsx`
- `src/components/Statistics.jsx`
- `src/components/WordCollectionView.jsx`
- `src/components/classroom/StudentProgressPanel.jsx`
- `src/data/coreWordNotes.js`
- `src/data/practicalWordNotes.js`
- `tests/core-word-notes.test.mjs`
- `tests/p2-features.test.mjs`
- `tests/practical-vocabulary.test.mjs`
- `tests/study-plan.test.mjs`
- `tests/vocabulary-repairs.test.mjs`
- `worker/data/assignment-vocabulary.json`
- `worker/examAttempts.js`
- `public/audio-updates/2026-10-25/`: 1976 MP3 + manifest.json.

## New entries (IDs do not inherit retired progress)

| ID | Word / phrase | Meaning |
| ---: | --- | --- |
| 8700 | a | 一；一个（不定冠词） |
| 8701 | an | 一；一个（用于元音音素前） |
| 8702 | as | 当……时；随着 |
| 8703 | at | 在（具体地点或时刻） |
| 8704 | because of | 因为；由于 |
| 8705 | blonde | 金发的 |
| 8706 | cannot | 不能；无法 |
| 8707 | do | 做；干 |
| 8708 | email | 电子邮件 |
| 8709 | euro | 欧元 |
| 8710 | go | 去；走 |
| 8711 | goodbye | 再见 |
| 8712 | have to | 必须；不得不 |
| 8713 | he | 他（主格） |
| 8714 | hey | 嘿；喂（用于招呼或引起注意） |
| 8715 | hi | 你好；嗨 |
| 8716 | hobby | 业余爱好 |
| 8717 | I | 我（主格） |
| 8718 | ice cream | 冰淇淋 |
| 8719 | if | 如果 |
| 8720 | in | 在……里面 |
| 8721 | it | 它 |
| 8722 | me | 我（宾格） |
| 8723 | my | 我的 |
| 8724 | next to | 紧挨着；在……旁边 |
| 8725 | no | 没有；无 |
| 8726 | no one | 没有人 |
| 8727 | o'clock | ……点钟（整点） |
| 8728 | of | ……的；属于…… |
| 8729 | oh | 哦；啊 |
| 8730 | OK | 可以的；没问题的 |
| 8731 | on | 在……上面 |
| 8732 | or | 或者；还是 |
| 8733 | passport | 护照 |
| 8734 | so | 所以；因此 |
| 8735 | the | 这；那（定冠词） |
| 8736 | to | 到；向 |
| 8737 | T-shirt | T恤衫 |
| 8738 | TV | 电视；电视节目 |
| 8739 | umbrella | 雨伞 |
| 8740 | up | 向上；在高处 |
| 8741 | us | 我们（宾格） |
| 8742 | we | 我们（主格） |
| 8743 | according to | 根据；据……所说 |
| 8744 | all right | 安好的；可以接受的 |
| 8745 | any more | 再；还（常用于否定句） |
| 8746 | app | 应用程序 |
| 8747 | based | 以……为基地的；设在……的 |
| 8748 | bin | 垃圾桶 |
| 8749 | camping | 露营 |
| 8750 | connected | 连接的；有关联的 |
| 8751 | divorced | 离婚的 |
| 8752 | download | 下载 |
| 8753 | included | 包括在内的 |
| 8754 | instead of | 代替；而不是 |
| 8755 | lazy | 懒惰的；懒散的 |
| 8756 | loudly | 大声地 |
| 8757 | motorcycle | 摩托车 |
| 8758 | sailing | 帆船运动；乘帆船航行 |
| 8759 | singing | 唱歌 |
| 8760 | smartphone | 智能手机 |
| 8761 | used to | 过去常常；过去曾经 |
| 8762 | ad | 广告 |
| 8763 | AI | 人工智能 |
| 8764 | amazed | 感到惊奇的 |
| 8765 | annoyed | 感到恼火的 |
| 8766 | annoying | 令人烦恼的 |
| 8767 | careless | 粗心的；不小心的 |
| 8768 | disappointing | 令人失望的 |
| 8769 | educated | 受过教育的 |
| 8770 | embarrassing | 令人尴尬的 |
| 8771 | engaged | 订婚的 |
| 8772 | frightening | 令人害怕的 |
| 8773 | injured | 受伤的 |
| 8774 | latest | 最新的；最近的 |
| 8775 | located | 位于……的 |
| 8776 | old-fashioned | 老式的；过时的 |
| 8777 | podcast | 播客节目 |
| 8778 | relaxing | 令人放松的 |
| 8779 | spoken | 口头的；口语的 |
| 8780 | statistic | 统计数字 |
| 8781 | theirs | 他们的；她们的；它们的（所有物） |
| 8782 | Wi-Fi | 无线局域网连接技术 |
| 8783 | accidentally | 意外地；无意中 |
| 8784 | additionally | 此外；另外 |
| 8785 | amusing | 有趣的；逗人发笑的 |
| 8786 | artwork | 艺术作品；美术图案 |
| 8787 | ashamed | 惭愧的；羞愧的 |
| 8788 | astonishing | 令人十分惊讶的 |
| 8789 | billionaire | 亿万富翁（资产至少十亿货币单位） |
| 8790 | broadcaster | 广播员；广播电视机构 |
| 8791 | caption | 图片说明；字幕 |
| 8792 | colourful | 色彩鲜艳的；多彩的 |
| 8793 | comedian | 喜剧演员 |
| 8794 | console | 游戏机；控制台 |
| 8795 | critically | 批判性地；审慎地 |
| 8796 | depressing | 令人沮丧的 |
| 8797 | dishonest | 不诚实的 |
| 8798 | downwards | 向下 |
| 8799 | efficiently | 高效地 |
| 8800 | enjoyable | 令人愉快的 |
| 8801 | entertaining | 有趣的；有娱乐性的 |
| 8802 | fabulous | 极好的；非常棒的 |
| 8803 | firefighter | 消防员 |
| 8804 | firework | 烟火；烟花 |
| 8805 | footprint | 脚印；足迹 |
| 8806 | full-time | 全职的；全天的 |
| 8807 | gaming | 电子游戏活动 |
| 8808 | globalization | 全球化 |
| 8809 | healthcare | 医疗服务；医疗保健 |
| 8810 | hilarious | 非常滑稽的；令人捧腹的 |
| 8811 | ID | 身份证明；身份标识 |
| 8812 | info | 信息；资料（非正式） |
| 8813 | litre | 升（容量单位） |
| 8814 | long-term | 长期的 |
| 8815 | lottery | 彩票；抽彩活动 |
| 8816 | novelist | 小说家 |
| 8817 | obesity | 肥胖；肥胖症 |
| 8818 | pandemic | 大流行病 |
| 8819 | part-time | 兼职的；非全日制的 |
| 8820 | passionate | 充满热情的 |
| 8821 | password | 密码 |
| 8822 | pharmacy | 药房；药店 |
| 8823 | protester | 抗议者 |
| 8824 | punk | 朋克摇滚乐 |
| 8825 | racist | 种族主义的 |
| 8826 | seeker | 寻求者；寻找者 |
| 8827 | shocking | 令人震惊的 |
| 8828 | short-term | 短期的 |
| 8829 | spokesperson | 发言人 |
| 8830 | spokeswoman | 女发言人 |
| 8831 | sporting | 体育的；与运动有关的 |
| 8832 | timeline | 时间线；时间安排 |
| 8833 | trillion | 一万亿 |
| 8834 | vaccinate | 给……接种疫苗 |
| 8835 | vaccination | 疫苗接种 |
| 8836 | villain | 反派角色；恶棍 |
| 8837 | algorithm | 算法 |
| 8838 | broadband | 宽带网络连接 |
| 8839 | cancellation | 取消；取消通知 |
| 8840 | connectivity | 连接能力；联网能力 |
| 8841 | e-commerce | 电子商务 |
| 8842 | milestone | 里程碑；重要阶段 |
| 8843 | mindset | 思维方式；心态 |
| 8844 | notification | 通知；提醒 |
| 8845 | scam | 骗局；诈骗 |
| 8846 | start-up | 初创企业 |
| 8847 | streaming | 流媒体播放；流式传输 |
| 8848 | a bit | 有点；稍微 |
| 8849 | a few | 几个；一些（可数） |
| 8850 | a little | 一点；少量（不可数） |
| 8851 | a long time ago | 很久以前 |
| 8852 | a lot | 很多；经常；非常 |
| 8853 | after all | 毕竟；终究 |
| 8854 | again and again | 一再；反复 |
| 8855 | all day | 整天 |
| 8856 | all over the world | 遍及全世界 |
| 8857 | all the time | 一直；总是 |
| 8858 | and so on | 等等；诸如此类 |
| 8859 | anything else | 其他任何东西；别的事 |
| 8860 | apart from | 除……之外 |
| 8861 | art gallery | 美术馆；画廊 |
| 8862 | as a result | 因此；结果 |
| 8863 | as soon as | 一……就…… |
| 8864 | as soon as possible | 尽快 |
| 8865 | as well | 也；还 |
| 8866 | at first | 起初；最初 |
| 8867 | at home | 在家 |
| 8868 | at last | 终于；总算 |
| 8869 | at least | 至少；起码 |
| 8870 | at once | 立刻；同时 |
| 8871 | at present | 目前；现在 |
| 8872 | at risk | 处于危险中；有风险的 |
| 8873 | at school | 在学校；在上学 |
| 8874 | at the moment | 此刻；目前 |
| 8875 | at the same time | 同时 |
| 8876 | at the weekend | 在周末（英式） |
| 8877 | at work | 在工作；在工作地点 |
| 8878 | bad news | 坏消息 |
| 8879 | best friend | 最好的朋友 |
| 8880 | break up | 结束关系；分手 |
| 8881 | car park | 停车场（英式） |
| 8882 | carry on | 继续 |
| 8883 | cell phone | 手机（美式） |
| 8884 | check in | 办理入住或登机手续 |
| 8885 | check out | 办理退房手续 |
| 8886 | clean up | 清理；打扫干净 |
| 8887 | climate change | 气候变化 |
| 8888 | come back | 回来；返回 |
| 8889 | come true | 实现；成为现实 |
| 8890 | credit card | 信用卡 |
| 8891 | each other | 彼此；互相 |
| 8892 | end up | 最终处于；结果成为 |
| 8893 | even if | 即使；尽管可能 |
| 8894 | even though | 虽然；尽管 |
| 8895 | every day | 每天 |
| 8896 | except for | 除……以外 |
| 8897 | excuse me | 劳驾；对不起（引起注意） |
| 8898 | fall asleep | 入睡；睡着 |
| 8899 | far away | 很远；远处 |
| 8900 | find out | 查明；弄清 |
| 8901 | first of all | 首先；第一 |
| 8902 | for a while | 一会儿；一段时间 |
| 8903 | for example | 例如 |
| 8904 | for free | 免费地 |
| 8905 | get back | 回来；返回 |
| 8906 | get better | 好转；进步 |
| 8907 | get married | 结婚 |
| 8908 | get off | 下车；离开交通工具 |
| 8909 | get on | 上车；登上 |
| 8910 | get ready | 准备好 |
| 8911 | get up | 起床；站起来 |
| 8912 | give up | 放弃；停止 |
| 8913 | go ahead | 开始吧；继续进行 |
| 8914 | go out | 外出 |
| 8915 | go to bed | 上床睡觉 |
| 8916 | good luck | 祝好运 |
| 8917 | good morning | 早上好 |
| 8918 | grow up | 长大；成长 |
| 8919 | had better | 最好（带劝告意味） |
| 8920 | have a look | 看一看 |
| 8921 | have fun | 玩得开心；享受乐趣 |
| 8922 | have no idea | 不知道；毫无头绪 |
| 8923 | in addition | 此外；另外 |
| 8924 | in advance | 提前；预先 |
| 8925 | in danger | 处于危险之中 |
| 8926 | in fact | 事实上；其实 |
| 8927 | in front of | 在……前面 |
| 8928 | in general | 一般来说；总体上 |
| 8929 | in my opinion | 在我看来 |
| 8930 | in other words | 换句话说 |
| 8931 | in particular | 尤其；特别是 |
| 8932 | in public | 在公众场合；公开地 |
| 8933 | in the end | 最后；最终 |
| 8934 | in the future | 将来；今后 |
| 8935 | in time | 及时；来得及 |
| 8936 | in touch | 保持联系；有联系的 |
| 8937 | make a difference | 产生影响；起作用 |
| 8938 | make a mistake | 犯错 |
| 8939 | make sense | 有道理；意思清楚 |
| 8940 | make sure | 确保；核实 |
| 8941 | mental health | 心理健康；精神健康 |
| 8942 | no longer | 不再 |
| 8943 | no problem | 没问题；不用谢 |
| 8944 | not at all | 一点也不；完全不 |
| 8945 | of course | 当然 |
| 8946 | on time | 准时；按时 |
