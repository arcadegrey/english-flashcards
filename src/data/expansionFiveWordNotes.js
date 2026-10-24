// Original learning notes; senses checked against the linked Oxford/Cambridge entries.
// Source checking is not independent language-editor review.
const rows = [
[
"that",
"限定词 · 那个",
"放在单数可数或不可数名词前指较远或双方已知的事物；指多个事物时用 those。",
"Could you move that chair closer to the desk?",
"你能把那把椅子移到桌边一点吗？",
"I still remember that rainy afternoon.",
"我仍记得那个下雨的下午。",
"https://www.oxfordlearnersdictionaries.com/definition/english/that"
],
[
"from",
"介词 · 从；来自",
"用来引出起点或来源，后接地点、时间或人；from A to B 可同时说明起止范围。",
"The bus runs from the village to the hospital.",
"公交车从村庄开往医院。",
"This parcel is from my aunt.",
"这个包裹是我姑妈寄来的。",
"https://www.oxfordlearnersdictionaries.com/definition/english/from"
],
[
"her",
"代词 · 她（宾格）",
"在本义中作动词或介词的宾语，指前面提到的女性；作主语时要改用 she。",
"I met her beside the ticket machine.",
"我在售票机旁遇见了她。",
"We saved a seat for her near the window.",
"我们在窗边为她留了一个座位。",
"https://dictionary.cambridge.org/dictionary/english/her"
],
[
"could",
"情态动词 · 能否；可以",
"礼貌地提出请求时用 could 加主语和动词原形；这种用法不表示请求发生在过去。",
"Could you hold the door while I carry this box?",
"我搬这个箱子时，你能帮忙扶着门吗？",
"Could I leave my bag behind the counter?",
"我可以把包放在柜台后面吗？",
"https://www.oxfordlearnersdictionaries.com/definition/english/could"
],
[
"your",
"限定词 · 你的；你们的",
"后面接名词说明所属，单复数对象都能用；不能像 yours 那样独立代替整个名词短语。",
"Please write your name on the back of the photograph.",
"请在照片背面写上你的名字。",
"Are these your gloves on the radiator?",
"暖气片上的这些是你的手套吗？",
"https://www.oxfordlearnersdictionaries.com/definition/english/your"
],
[
"these",
"代词／限定词 · 这些",
"是 this 的复数形式，指较近或正在谈论的多个人或物；后接名词时用复数。",
"These boxes belong in the storeroom.",
"这些箱子应该放在储藏室里。",
"Can I borrow these for the afternoon?",
"我能借用这些东西一个下午吗？",
"https://dictionary.cambridge.org/dictionary/english/these"
],
[
"should",
"情态动词 · 应该",
"给出建议时后接动词原形，语气通常表示合适的做法；主语为第三人称时也不加 s。",
"You should save a copy before closing the file.",
"你应该在关闭文件前保存一个副本。",
"We should ask the neighbors about the missing cat.",
"我们应该向邻居打听一下那只走失的猫。",
"https://www.oxfordlearnersdictionaries.com/definition/english/should"
],
[
"those",
"代词／限定词 · 那些",
"是 that 的复数形式，可指较远或已经提到的事物；不能与单数可数名词搭配。",
"Those shoes are too muddy for the kitchen.",
"那几双鞋太脏，不能穿进厨房。",
"Please give these forms to those waiting outside.",
"请把这些表格交给外面等候的人。",
"https://dictionary.cambridge.org/dictionary/english/those"
],
[
"life",
"名词 · 生活",
"描述生活方式时可用 city life 等组合；指一个人的一生时可数，复数拼作 lives。",
"City life became quieter after we moved away from the main road.",
"我们搬离主干道后，城市生活变得更安静了。",
"Music has always been part of her life.",
"音乐一直是她生活的一部分。",
"https://www.oxfordlearnersdictionaries.com/definition/english/life"
],
[
"need",
"动词 · 需要",
"普通实义动词用法中可接名词或 to do；第三人称单数加 s，否定一般用 do not need。",
"We need a longer cable for the projector.",
"我们需要一根更长的投影仪连接线。",
"You need to sign both pages of the form.",
"你需要在表格的两页上都签名。",
"https://www.oxfordlearnersdictionaries.com/definition/english/need"
],
[
"show",
"动词 · 展示；演示",
"show someone something 可说明给谁看什么；演示做法时可接 how to do 结构。",
"Please show the class your sketch.",
"请向全班展示你的草图。",
"Can you show me how to fold this map?",
"你能演示一下怎么折这张地图吗？",
"https://www.oxfordlearnersdictionaries.com/definition/english/show"
],
[
"off",
"副词 · 脱离；关闭",
"与动词搭配可表示移开或停止运转；turn it off 中代词放在动词和 off 之间。",
"Turn the lamp off before you leave.",
"离开前把灯关掉。",
"Take your wet boots off at the door.",
"在门口脱掉你的湿靴子。",
"https://www.oxfordlearnersdictionaries.com/definition/english/off"
],
[
"always",
"副词 · 总是",
"描述通常规律时常放在实义动词前、be 动词后；并非只能放在句首或句末。",
"She always checks the weather before cycling.",
"她骑车前总会查看天气。",
"The kitchen is always warm in the morning.",
"厨房早上总是暖暖的。",
"https://www.oxfordlearnersdictionaries.com/definition/english/always"
],
[
"going",
"名词 · 进展状况",
"在 slow going、tough going 等搭配中表示事情做起来的进展或难度，不能只理解为去的动作。",
"The first chapter was slow going because of the unfamiliar terms.",
"第一章有很多陌生术语，读起来进展缓慢。",
"We made it up the hill, but it was tough going.",
"我们爬上了山，不过一路很艰难。",
"https://www.oxfordlearnersdictionaries.com/definition/english/going"
],
[
"side",
"名词 · 一侧；旁边",
"说明位于某物的一侧时用 on one side of；by someone's side 则表示在某人身旁。",
"A narrow path runs along the side of the house.",
"一条窄路沿着房屋一侧延伸。",
"Please write on only one side of the paper.",
"请只在纸的一面书写。",
"https://www.oxfordlearnersdictionaries.com/definition/english/side"
],
[
"young",
"形容词 · 年幼的",
"描述年龄小或尚未成熟的人和生物；比较级是 younger，最高级是 youngest。",
"The young tree needs support in strong winds.",
"这棵小树在大风中需要支撑。",
"She was too young to remember the journey.",
"她当时太小，记不住那次旅行。",
"https://www.oxfordlearnersdictionaries.com/definition/english/young"
],
[
"though",
"连词 · 虽然",
"引出让步分句时说明与主句相反的情况；英语中通常不再用 but 连接同一主句。",
"Though the shop was crowded, we found a quiet corner.",
"虽然商店很拥挤，我们还是找到了一个安静的角落。",
"He kept smiling though his shoes were soaked.",
"虽然鞋子湿透了，他还是一直笑着。",
"https://www.oxfordlearnersdictionaries.com/definition/english/though"
],
[
"idea",
"名词 · 想法；主意",
"表示一个具体建议时是可数名词，可用 an idea for 加名词，说明建议针对的事情。",
"I have an idea for the school newsletter.",
"我有一个关于校报的想法。",
"Her idea saved us several hours of work.",
"她的主意为我们节省了好几个小时的工作。",
"https://www.oxfordlearnersdictionaries.com/definition/english/idea"
],
[
"face",
"名词 · 脸",
"指头部有眼鼻口的前面，是可数名词；on someone's face 可说明表情出现在谁的脸上。",
"There was flour on his face after he baked the bread.",
"他烤完面包后脸上沾着面粉。",
"A worried expression crossed her face.",
"她脸上掠过一丝担忧的神情。",
"https://www.oxfordlearnersdictionaries.com/definition/english/face"
],
[
"person",
"名词 · 人",
"指作为个体的人，日常复数通常用 people；persons 多见于正式告示或法律等语境。",
"Only one person can enter the lift with this trolley.",
"推着这辆手推车时只能有一个人进入电梯。",
"The person at reception gave us a map.",
"接待处的那个人给了我们一张地图。",
"https://www.oxfordlearnersdictionaries.com/definition/english/person"
],
[
"health",
"名词 · 健康",
"谈身心健康状况时通常不可数，可用 in good health；不能用 a health 表示一个人的健康。",
"Regular walks have improved my health.",
"经常散步改善了我的健康状况。",
"The report looks at the health of local children.",
"这份报告考察当地儿童的健康状况。",
"https://www.oxfordlearnersdictionaries.com/definition/english/health"
],
[
"send",
"动词 · 寄；发送",
"可用 send someone something 或 send something to someone；过去式和过去分词都是 sent。",
"Please send me the room number by text.",
"请发短信把房间号告诉我。",
"We will send the equipment to your office tomorrow.",
"我们明天会把设备送到你的办公室。",
"https://www.oxfordlearnersdictionaries.com/definition/english/send"
],
[
"itself",
"反身代词 · 它自己",
"当动作发出者和承受者是同一动物或事物时使用；也可紧跟名词强调事物本身。",
"The door locked itself when the wind pushed it shut.",
"风把门吹关时，门自己锁上了。",
"The kitten looked at itself in the mirror.",
"小猫看着镜子中的自己。",
"https://www.oxfordlearnersdictionaries.com/definition/english/itself"
],
[
"cavity",
"名词 · 洞；腔",
"指坚硬物体内部的空隙，也指牙齿龋洞；具体含义需看 tooth、rock 等上下文。",
"The dentist found a small cavity in one tooth.",
"牙医发现一颗牙齿上有个小龋洞。",
"A bird had built its nest inside a cavity in the trunk.",
"一只鸟在树干的空洞里筑了巢。",
"https://www.oxfordlearnersdictionaries.com/definition/english/cavity"
],
[
"town",
"名词 · 城镇",
"通常指比村庄大、比大城市小的居民聚居地；in town 可表示在镇上或市中心。",
"Our town has a market every Saturday.",
"我们镇上每周六都有集市。",
"The last train leaves town at ten.",
"最后一班火车十点离开镇子。",
"https://www.oxfordlearnersdictionaries.com/definition/english/town"
],
[
"hope",
"动词 · 希望",
"后接 to do 表示自己希望做某事，接 that 从句则可说明希望发生的情况；不用 hope someone to do。",
"I hope to finish the repairs before winter.",
"我希望在冬天前完成修缮。",
"We hope the new timetable suits everyone.",
"我们希望新时间表适合所有人。",
"https://www.oxfordlearnersdictionaries.com/definition/english/hope"
],
[
"wife",
"名词 · 妻子",
"指婚姻关系中的女性配偶，是可数名词；复数拼作 wives，不能直接在词尾加 s。",
"His wife teaches art at the local college.",
"他的妻子在当地学院教美术。",
"I met my wife while volunteering at a museum.",
"我做博物馆志愿者时认识了我的妻子。",
"https://www.oxfordlearnersdictionaries.com/definition/english/wife"
],
[
"son",
"名词 · 儿子",
"指某人的男性孩子；年龄再大也能说 someone's son，不表示一定是小男孩。",
"Their son has just opened a bicycle shop.",
"他们的儿子刚开了一家自行车店。",
"She brought her son to the afternoon concert.",
"她带儿子来听下午的音乐会。",
"https://www.oxfordlearnersdictionaries.com/definition/english/son"
],
[
"window",
"名词 · 窗户",
"指建筑物或车辆上让光线进入的开口及其玻璃；at the window 表靠窗位置，through 表穿过。",
"Rain was running down the kitchen window.",
"雨水沿着厨房窗户流下来。",
"We could see the harbor through the window.",
"我们透过窗户能看见港口。",
"https://www.oxfordlearnersdictionaries.com/definition/english/window"
],
[
"rudimentary",
"形容词 · 初步的；基本的",
"强调知识、技能或设备仅达到最基础的程度，常有不完善的意味，不等于高级而简洁。",
"She had only a rudimentary knowledge of electronics.",
"她只有初步的电子学知识。",
"The shelter had a rudimentary heating system.",
"收容所有一套简陋的供暖系统。",
"https://www.oxfordlearnersdictionaries.com/definition/english/rudimentary"
],
[
"south",
"名词 · 南方",
"作方位名词可接 of 表相对位置；说明向南运动也可作副词，不要无故加 the。",
"The lake lies to the south of the village.",
"湖位于村庄南面。",
"The windows on the south side receive more sunlight.",
"南侧的窗户能照到更多阳光。",
"https://www.oxfordlearnersdictionaries.com/definition/english/south"
],
[
"sport",
"名词 · 体育运动",
"泛指体育活动时在英式英语中常不可数；指具体一项运动时可数，如 a team sport。",
"Swimming is the only sport he watches regularly.",
"游泳是他唯一经常观看的运动。",
"The school encourages children to take part in sport.",
"学校鼓励孩子们参加体育运动。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sport"
],
[
"june",
"名词 · 六月",
"月份名称书写时首字母大写；泛指在六月用 in June，具体到某一天通常用 on。",
"The roses usually flower in June.",
"玫瑰通常在六月开花。",
"Our lease ends on June 18.",
"我们的租约于六月十八日到期。",
"https://www.oxfordlearnersdictionaries.com/definition/english/june"
],
[
"deposition",
"名词 · 沉积",
"此处指物质逐层沉积的自然过程；地理语境中的 deposition 不表示证人的宣誓证词。",
"The diagram shows the deposition of sand at the river mouth.",
"示意图展示了河口沙子的沉积过程。",
"Slow deposition created several distinct layers.",
"缓慢的沉积形成了几个清晰的地层。",
"https://www.oxfordlearnersdictionaries.com/definition/english/deposition"
],
[
"united",
"形容词 · 团结的",
"表示人们因共同目标而一致行动，常用 united in；也可描述政治单位联合在一起。",
"The residents were united in their opposition to the closure.",
"居民们一致反对关闭该设施。",
"We presented a united front during the negotiations.",
"我们在谈判中表现出团结一致的立场。",
"https://www.oxfordlearnersdictionaries.com/definition/english/united"
],
[
"october",
"名词 · 十月",
"月份首字母须大写，介词 in 用于整个月，on 用于包含具体日期的时间表达。",
"The new gallery opens in October.",
"新画廊将在十月开放。",
"We planted these trees last October.",
"我们去年十月种下了这些树。",
"https://www.oxfordlearnersdictionaries.com/definition/english/october"
],
[
"sunday",
"名词 · 星期日",
"星期名称首字母大写；on Sunday 表周日，on Sundays 可表示每个周日反复发生的事。",
"The library closes early on Sunday.",
"图书馆周日提早关门。",
"Our next rehearsal is this Sunday.",
"我们下次排练就在这个星期日。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sunday"
],
[
"december",
"名词 · 十二月",
"表示一年最后一个月，书写须大写首字母；in December 表在该月，不能写成 on December 而不带日期。",
"The pond froze over in December.",
"池塘在十二月结了冰。",
"We received the invitation in early December.",
"我们十二月初收到了邀请。",
"https://www.oxfordlearnersdictionaries.com/definition/english/december"
],
[
"mum",
"名词 · 妈妈（英式）",
"是 mother 的日常亲昵称呼，英式英语常见；直接用作称呼时通常写作 Mum。",
"My mum keeps all our old school photographs.",
"我妈妈保存着我们所有旧校园照片。",
"Mum, have you seen my blue notebook?",
"妈妈，你见到我的蓝色笔记本了吗？",
"https://www.oxfordlearnersdictionaries.com/definition/english/mum"
],
[
"british",
"形容词 · 英国的",
"描述与英国有关的人或事物，首字母大写；范围不应随意缩小成仅英格兰的。",
"The archive contains British newspapers from the nineteenth century.",
"档案馆藏有十九世纪的英国报纸。",
"We compared British and American spellings in class.",
"我们在课堂上比较了英式和美式拼写。",
"https://www.oxfordlearnersdictionaries.com/definition/english/british"
],
[
"apparently",
"副词 · 据说；看来",
"表示根据听闻或表面迹象作判断，不保证说话人已独立证实；常用来保留信息的不确定性。",
"Apparently, the bakery is moving to a larger shop.",
"据说那家面包店要搬到更大的店面。",
"The path was apparently safe, but we checked the map.",
"那条小路看起来安全，不过我们还是查了地图。",
"https://www.oxfordlearnersdictionaries.com/definition/english/apparently"
],
[
"somewhere",
"副词 · 某处",
"用于地点未说明或不确定的情况；被形容词修饰时形容词后置，如 somewhere quiet。",
"I left my umbrella somewhere near the entrance.",
"我把伞落在了入口附近的某个地方。",
"Can we sit somewhere quiet for a few minutes?",
"我们能找个安静的地方坐几分钟吗？",
"https://www.oxfordlearnersdictionaries.com/definition/english/somewhere"
],
[
"fluidity",
"名词 · 流畅性",
"此处描述动作顺畅自然的性质，通常不可数；也有易变性义，需要结合所修饰对象判断。",
"We admired the fluidity of the dancer's movements.",
"我们赞赏那位舞者动作的流畅性。",
"Years of practice gave her playing greater fluidity.",
"多年的练习让她的演奏更加流畅。",
"https://www.oxfordlearnersdictionaries.com/definition/english/fluidity"
],
[
"mom",
"名词 · 妈妈（美式）",
"是美式英语中 mother 的日常亲昵称呼；直接作为称呼时通常大写，前面不再加 my。",
"My mom taught me to repair a loose button.",
"我妈妈教我缝牢松动的纽扣。",
"Mom, the soup is ready.",
"妈妈，汤做好了。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mom"
],
[
"monday",
"名词 · 星期一",
"星期名称首字母大写，on Monday 表在周一；next Monday 等表达前通常不再加 on。",
"The parcel should arrive on Monday.",
"包裹应该星期一送到。",
"Our first lesson is next Monday.",
"我们的第一节课在下星期一。",
"https://www.oxfordlearnersdictionaries.com/definition/english/monday"
],
[
"lots",
"代词 · 许多；大量",
"lots of 后可接复数可数名词或不可数名词，语气较口语；作主语时谓语随实际所指变化。",
"We still have lots of flour in the cupboard.",
"我们橱柜里还有很多面粉。",
"Lots of visitors came to see the restored garden.",
"许多游客来看修复后的花园。",
"https://dictionary.cambridge.org/dictionary/english/lots"
],
[
"increasing",
"形容词 · 不断增加的",
"描述数量或程度正在上升，常置于名词前；强调变化趋势，不表示已经达到最大值。",
"The town faces increasing pressure on its water supply.",
"这个镇子的供水面临越来越大的压力。",
"There is increasing demand for evening classes.",
"对晚间课程的需求正在增长。",
"https://dictionary.cambridge.org/dictionary/english/increasing"
],
[
"aye",
"感叹词 · 是；赞成",
"用来表示肯定，常见于议会表决、航海等场景；普通正式写作中不应随意代替 yes。",
"Those in favor of the motion said aye.",
"赞成这项动议的人说了赞成。",
"The sailor answered, Aye, captain.",
"水手回答说：是，船长。",
"https://www.oxfordlearnersdictionaries.com/definition/english/aye"
],
[
"cosmopolitan",
"形容词 · 国际化的",
"形容城市等有来自不同国家的人和文化；也可形容人见多识广，不能只理解为人口多。",
"The port became a cosmopolitan city with several language schools.",
"这座港口成为拥有多所语言学校的国际化城市。",
"Her cosmopolitan outlook reflects years of travel.",
"她开阔的国际视野反映出多年的旅行经历。",
"https://www.oxfordlearnersdictionaries.com/definition/english/cosmopolitan"
],
[
"jar",
"名词 · 广口瓶",
"通常指有盖的玻璃容器，是可数名词；a jar of 表示一瓶某种物品或该瓶的容量。",
"Keep the beans in a jar with a tight lid.",
"把豆子放在盖子严实的广口瓶里。",
"She gave us a jar of homemade jam.",
"她送给我们一瓶自制果酱。",
"https://www.oxfordlearnersdictionaries.com/definition/english/jar"
],
[
"buyer",
"名词 · 买方；购买者",
"指购买东西的人，也可指商店负责采购的人员；不自动等同于最后实际使用商品的人。",
"The buyer asked to see the bicycle before paying.",
"买家要求付款前先看看自行车。",
"A buyer from the bookstore selected three new titles.",
"书店的一名采购员选了三种新书。",
"https://www.oxfordlearnersdictionaries.com/definition/english/buyer"
],
[
"parliamentary",
"形容词 · 议会的",
"用于与议会及其程序有关的事物，常见 parliamentary debate；不把所有政府活动都称作议会活动。",
"The proposal sparked a lengthy parliamentary debate.",
"该提案引发了长时间的议会辩论。",
"Students watched a recording of parliamentary questions.",
"学生们观看了议会质询的录像。",
"https://www.oxfordlearnersdictionaries.com/definition/english/parliamentary"
],
[
"guy",
"名词 · 男人；家伙",
"单数时常在非正式英语中指男性；guys 称呼一群人时有时不限定性别，正式场合宜用中性称呼。",
"The guy at the next table lent me a pen.",
"邻桌的那个男人借给我一支笔。",
"A friendly guy showed us the way to the platform.",
"一个友善的男人告诉我们去站台怎么走。",
"https://www.oxfordlearnersdictionaries.com/definition/english/guy"
],
[
"onto",
"介词 · 到……上面",
"onto 强调移动后到达表面；on 常表示位置，也可随动词表达移动，需看完整语境。",
"The cat jumped onto the garden wall.",
"猫跳到了花园围墙上。",
"Slide the bread onto the hot baking tray.",
"把面包滑移到热烤盘上。",
"https://www.oxfordlearnersdictionaries.com/definition/english/onto"
],
[
"enigma",
"名词 · 谜；难以理解的人或事",
"指难以解释、理解的人或情况，是可数名词；an enigma to someone 表对谁来说是个谜。",
"The missing page remains an enigma to the researchers.",
"缺失的那一页对研究人员来说仍然是个谜。",
"Despite their long friendship, he was still an enigma to her.",
"尽管友谊长久，他对她来说仍是个难以理解的人。",
"https://www.oxfordlearnersdictionaries.com/definition/english/enigma"
],
[
"amongst",
"介词 · 在……之中",
"与 among 基本同义，英式英语较常见；强调处于群体或多物之中，后面直接接名词短语。",
"We found a blue feather amongst the leaves.",
"我们在树叶中发现了一根蓝色羽毛。",
"The prize money was shared amongst the four winners.",
"奖金分给了四位获胜者。",
"https://dictionary.cambridge.org/dictionary/english/amongst"
],
[
"mexican",
"形容词 · 墨西哥的",
"表示与墨西哥有关的人或事物，首字母要大写；国籍形容词前通常不加冠词。",
"The museum is showing work by Mexican artists.",
"博物馆正在展出墨西哥艺术家的作品。",
"We listened to Mexican music during the workshop.",
"我们在工作坊里听了墨西哥音乐。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mexican"
],
[
"proposed",
"形容词 · 提议的；拟议中的",
"放在名词前表示提出供考虑的计划，不代表已经批准或实施；注意与现行安排区分。",
"The proposed bridge would shorten the journey.",
"拟建的大桥将缩短路程。",
"Residents can comment on the proposed changes until Friday.",
"居民可以在星期五前对拟议修改提出意见。",
"https://dictionary.cambridge.org/dictionary/english/proposed"
],
[
"asian",
"名词 · 亚洲人",
"本义指来自亚洲或具有亚洲家庭背景的人，可数；作国籍或地域身份词时首字母大写。",
"An Asian from the neighboring team joined our discussion.",
"邻队的一位亚洲人加入了我们的讨论。",
"She interviewed an Asian who had recently moved to the city.",
"她采访了一位最近搬到这座城市的亚洲人。",
"https://www.oxfordlearnersdictionaries.com/definition/english/asian"
],
[
"educator",
"名词 · 教育工作者",
"泛指从事教育或研究教育方法的人，比某一课堂的 teacher 范围更广，常用于较正式语境。",
"An experienced educator helped us redesign the course.",
"一位有经验的教育工作者帮助我们重新设计课程。",
"The museum invited an educator to lead the workshop.",
"博物馆邀请了一位教育工作者主持工作坊。",
"https://www.oxfordlearnersdictionaries.com/definition/english/educator"
],
[
"lad",
"名词 · 男孩；小伙子",
"多见于英式非正式英语，指男孩或年轻男子；不宜在正式文书中泛指所有儿童。",
"A young lad helped carry the chairs inside.",
"一个小伙子帮忙把椅子搬进了屋。",
"The lad next door is learning to repair bicycles.",
"隔壁的男孩正在学修自行车。",
"https://www.oxfordlearnersdictionaries.com/definition/english/lad"
],
[
"briefly",
"副词 · 简短地；短暂地",
"既可说明表达篇幅短，也可说明持续时间短；应结合所修饰的动词判断具体意思。",
"Please briefly describe how the experiment works.",
"请简要说明这个实验如何进行。",
"We stopped briefly to check the map.",
"我们短暂停下来查了查地图。",
"https://www.oxfordlearnersdictionaries.com/definition/english/briefly"
],
[
"islamic",
"形容词 · 伊斯兰教的",
"说明与伊斯兰教有关的艺术、传统或制度，首字母大写；不能仅凭地区就推断宗教属性。",
"The gallery has a collection of Islamic ceramics.",
"画廊收藏了一批伊斯兰陶瓷。",
"The course introduces the history of Islamic architecture.",
"这门课程介绍伊斯兰建筑史。",
"https://www.oxfordlearnersdictionaries.com/definition/english/islamic"
],
[
"maxim",
"名词 · 格言",
"指被认为含有生活准则或普遍道理的简短话语；不表示说话者的每一句评论都具有普遍真理。",
"Her favorite maxim reminds us to listen before speaking.",
"她最喜欢的格言提醒我们先听后说。",
"He used a familiar maxim to end his speech.",
"他用一句熟悉的格言结束了演讲。",
"https://www.oxfordlearnersdictionaries.com/definition/english/maxim"
],
[
"lost",
"形容词 · 迷路的；找不到的",
"人 be lost 常表示不知道自己在哪里；a lost item 则指遗失物，须依据名词判断。",
"We were lost until a farmer pointed out the path.",
"我们迷路了，直到一位农民指出道路。",
"The receptionist put the lost scarf behind the desk.",
"接待员把那条遗失的围巾放在了桌子后。",
"https://www.oxfordlearnersdictionaries.com/definition/english/lost"
],
[
"olympic",
"形容词 · 奥林匹克的",
"修饰与奥运会有关的项目、运动员等，通常写作 Olympic；并非任何大型体育比赛都适用。",
"The school invited an Olympic swimmer to speak.",
"学校邀请了一位奥运会游泳选手来演讲。",
"She hopes to compete at an Olympic venue one day.",
"她希望有一天能在奥运场馆比赛。",
"https://dictionary.cambridge.org/dictionary/english/olympic"
],
[
"warehouse",
"名词 · 仓库",
"指大量存储货物的建筑，通常可数；in a warehouse 表在仓库内部，不能与零售店等同。",
"The furniture is kept in a warehouse outside town.",
"家具存放在城外的一间仓库里。",
"A warehouse near the docks has been converted into studios.",
"码头附近的一座仓库已被改成工作室。",
"https://www.oxfordlearnersdictionaries.com/definition/english/warehouse"
],
[
"shooting",
"名词 · 枪击事件",
"本义指有人遭枪击的一次事件，可用 a shooting；另有射击运动等义项，阅读时注意场景。",
"The road was closed after a shooting near the station.",
"车站附近发生枪击事件后，道路被封闭了。",
"Police asked witnesses to the shooting to come forward.",
"警方请枪击事件的目击者提供线索。",
"https://www.oxfordlearnersdictionaries.com/definition/english/shooting"
],
[
"legislation",
"名词 · 法律；立法",
"泛指法律或立法过程时通常不可数；说明一项法律可用 a piece of legislation，不能直接说 a legislation。",
"The committee reviewed legislation on water quality.",
"委员会审议了有关水质的法律。",
"New legislation requires clearer labels on these products.",
"新法律要求这些产品使用更清晰的标签。",
"https://www.oxfordlearnersdictionaries.com/definition/english/legislation"
],
[
"aged",
"形容词 · ……岁的",
"放在人后面接年龄，如 children aged ten；这种结构读作一个音节，与表示年迈的 aged 读音不同。",
"The workshop is for children aged eight to twelve.",
"这个工作坊面向八至十二岁的儿童。",
"Two students aged sixteen won the design prize.",
"两名十六岁的学生赢得了设计奖。",
"https://www.oxfordlearnersdictionaries.com/definition/english/aged"
],
[
"depending",
"分词 · 取决于",
"depending on 常引出影响结果的条件，可在句末补充说明；on 后接名词或疑问从句。",
"The walk takes two hours, depending on your pace.",
"这段路走完要两小时，具体取决于你的步速。",
"We may eat outside, depending on whether the rain stops.",
"我们可能在户外吃饭，具体取决于雨是否会停。",
"https://dictionary.cambridge.org/dictionary/english/depending"
],
[
"prosecution",
"名词 · 起诉；公诉",
"指试图在法庭证明被告犯罪的诉讼过程；并不表示指控已经成立，注意与定罪区分。",
"The evidence was considered insufficient for prosecution.",
"这些证据被认为不足以提起诉讼。",
"The case could lead to prosecution if further evidence emerges.",
"如果出现更多证据，此案可能进入起诉程序。",
"https://www.oxfordlearnersdictionaries.com/definition/english/prosecution"
],
[
"vat",
"名词 · 大桶",
"本义指工业生产等场景中盛放液体的大容器，可数；小写 vat 不应一律当成增值税缩写 VAT。",
"The cheese maker poured warm milk into a vat.",
"制酪师把温牛奶倒进大桶。",
"A steel vat stood beside the mixing machine.",
"搅拌机旁放着一个钢制大桶。",
"https://www.oxfordlearnersdictionaries.com/definition/english/vat"
],
[
"hers",
"代词 · 她的东西",
"是可独立使用的物主代词，代替 her 加名词；后面不再接所拥有的物品，也不加撇号。",
"My coat is black, but hers is green.",
"我的外套是黑色的，她的是绿色的。",
"That desk is hers until the end of the course.",
"课程结束前，那张桌子归她使用。",
"https://www.oxfordlearnersdictionaries.com/definition/english/hers"
],
[
"bombing",
"名词 · 爆炸袭击；轰炸",
"指投掷或安放炸弹的事件，也可泛指轰炸行为；a bombing 可表示一次具体袭击。",
"The bombing damaged several buildings near the square.",
"那次爆炸袭击损坏了广场附近几座建筑。",
"The museum records the effects of wartime bombing.",
"博物馆记录了战时轰炸造成的影响。",
"https://www.oxfordlearnersdictionaries.com/definition/english/bombing"
],
[
"australian",
"形容词 · 澳大利亚的",
"表示与澳大利亚有关的人或事物，书写时首字母大写；作形容词时不随名词单复数变化。",
"The class studied Australian wildlife.",
"全班学习了澳大利亚野生动物的知识。",
"An Australian company supplied the research equipment.",
"一家澳大利亚公司提供了研究设备。",
"https://www.oxfordlearnersdictionaries.com/definition/english/australian"
],
[
"earl",
"名词 · 伯爵（英国）",
"指英国贵族爵位中的伯爵，是可数名词；作为爵位称号用于特定人名前时通常大写。",
"The portrait shows an earl holding a hunting glove.",
"这幅肖像画着一位拿着猎手手套的伯爵。",
"An earl once owned the land around the village.",
"一位伯爵曾拥有村庄周围的土地。",
"https://www.oxfordlearnersdictionaries.com/definition/english/earl"
],
[
"dutch",
"形容词 · 荷兰的",
"表示与荷兰、荷兰人或荷兰语有关，首字母大写；不是与德国有关的 German。",
"The gallery displayed several Dutch landscape paintings.",
"画廊展出了几幅荷兰风景画。",
"She borrowed a Dutch dictionary from the library.",
"她从图书馆借了一本荷兰语词典。",
"https://www.oxfordlearnersdictionaries.com/definition/english/dutch"
],
[
"prosperous",
"形容词 · 繁荣富裕的",
"常形容地区、企业或人经济状况良好；表示已经富裕兴旺，与有前景的 promising 不同。",
"The railway helped the village become prosperous.",
"铁路帮助这个村庄走向繁荣。",
"A prosperous merchant paid for the new town hall.",
"一位富裕的商人为新市政厅出资。",
"https://www.oxfordlearnersdictionaries.com/definition/english/prosperous"
],
[
"hospitalize",
"动词 · 送入院治疗",
"指让人住院接受治疗，常用被动 be hospitalized；不能仅凭住院推断疾病严重程度。",
"The doctors decided to hospitalize him for observation.",
"医生们决定让他住院观察。",
"The clinic can hospitalize patients who need close monitoring.",
"诊所可以安排需要密切监测的病人住院。",
"https://www.oxfordlearnersdictionaries.com/definition/english/hospitalize"
],
[
"cooking",
"名词 · 烹饪",
"指通过加热等方法准备食物的活动，通常不可数；也可描述某人的烹调手艺或做出的饭菜。",
"I learned basic cooking from my grandfather.",
"我跟祖父学了基本的烹饪技巧。",
"Her cooking made the small cafe popular.",
"她的厨艺让这家小咖啡馆很受欢迎。",
"https://www.oxfordlearnersdictionaries.com/definition/english/cooking"
],
[
"impersonate",
"动词 · 冒充；模仿",
"直接接被模仿的人，可为娱乐模仿，也可能为欺骗冒充；需要结合目的判断语气。",
"The actor can impersonate several famous singers.",
"这位演员能模仿几位著名歌手。",
"Someone tried to impersonate a bank employee on the phone.",
"有人试图在电话中冒充银行职员。",
"https://www.oxfordlearnersdictionaries.com/definition/english/impersonate"
],
[
"monastery",
"名词 · 修道院",
"通常指修士共同居住和从事宗教生活的建筑；是可数名词，不能泛指任何宗教建筑。",
"The old monastery stands above the valley.",
"那座古老的修道院矗立在山谷上方。",
"Visitors can walk through the monastery garden.",
"游客可以在修道院花园里散步。",
"https://www.oxfordlearnersdictionaries.com/definition/english/monastery"
],
[
"statute",
"名词 · 成文法",
"指由有权机构正式通过并写成文字的法律，语体较正式；不表示一般个人建议。",
"The statute sets out the council's responsibilities.",
"这项成文法规定了议会的职责。",
"The lawyer pointed to a statute passed many years earlier.",
"律师指出一项多年前通过的成文法。",
"https://www.oxfordlearnersdictionaries.com/definition/english/statute"
],
[
"expected",
"形容词 · 预期的",
"说明依据已有信息所预测的结果，常置于名词前；预期结果不表示保证一定发生。",
"The expected delivery date is printed on the receipt.",
"预计送货日期印在收据上。",
"Attendance was higher than the expected total.",
"出席人数超过了预期总数。",
"https://www.oxfordlearnersdictionaries.com/definition/english/expected"
],
[
"vacuum",
"名词 · 真空",
"科学语境中指没有物质或气体极少的空间；抽象语境也可指权力等缺失，本条例句限物理义。",
"The experiment was carried out in a vacuum.",
"这项实验是在真空中进行的。",
"A vacuum inside the flask reduces heat transfer.",
"保温瓶内部的真空减少了热量传递。",
"https://www.oxfordlearnersdictionaries.com/definition/english/vacuum"
],
[
"amnesia",
"名词 · 失忆症",
"指记忆部分或全部丧失的病症，通常不可数；不能把日常偶尔忘事都称为这种病症。",
"The novel follows a traveler with amnesia.",
"小说讲述了一位患失忆症的旅行者的故事。",
"The lecture explained the difference between amnesia and ordinary forgetting.",
"讲座解释了失忆症与普通遗忘的区别。",
"https://www.oxfordlearnersdictionaries.com/definition/english/amnesia"
],
[
"loom",
"动词 · 隐约出现；逼近",
"常描述巨大形体隐约显现，或问题显得迫近；loom over 可用于空间或威胁笼罩的语境。",
"Dark towers loom above the harbor in the fog.",
"雾中黑色高塔隐约耸立在港口上方。",
"Financial difficulties loom as the project runs out of funds.",
"随着项目资金耗尽，财务困境迫在眉睫。",
"https://www.oxfordlearnersdictionaries.com/definition/english/loom"
],
[
"gastric",
"形容词 · 胃的",
"医学语境中用于修饰与胃有关的名词，如 gastric acid；不是所有腹部器官都可用它描述。",
"The diagram shows where gastric acid is produced.",
"这张图显示胃酸产生的位置。",
"The sample was tested for gastric enzymes.",
"这个样本接受了胃酶检测。",
"https://www.oxfordlearnersdictionaries.com/definition/english/gastric"
],
[
"deadly",
"形容词 · 致命的",
"表示能够导致死亡或极具危险性，不等于 dead 的已经死亡；置于名词前或作表语。",
"The museum displays information about deadly snakes.",
"博物馆展示了有关致命毒蛇的资料。",
"A small error can have deadly consequences in this environment.",
"在这种环境下，一个小错误可能带来致命后果。",
"https://www.oxfordlearnersdictionaries.com/definition/english/deadly"
],
[
"mainstream",
"名词 · 主流",
"指被大多数人接受的观点或活动，常用 in the mainstream；主流并不自动意味着正确。",
"The technique gradually entered the mainstream of education.",
"这种方法逐渐进入教育主流。",
"Her work remained outside the mainstream for many years.",
"她的作品多年来一直处于主流之外。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mainstream"
],
[
"champagne",
"名词 · 香槟酒",
"指特定产区的起泡葡萄酒，通常不可数；一杯用 a glass of，不应把所有起泡酒统称为香槟。",
"They opened a bottle of champagne to celebrate.",
"他们开了一瓶香槟庆祝。",
"She offered the guests champagne and orange juice.",
"她为客人提供了香槟和橙汁。",
"https://www.oxfordlearnersdictionaries.com/definition/english/champagne"
],
[
"urbane",
"形容词 · 温文尔雅的",
"形容社交中从容、有教养而懂得应对的人或举止；与表示城市的 urban 拼写接近但含义不同。",
"The host was urbane and attentive throughout the evening.",
"整晚主人都温文尔雅、周到细致。",
"His urbane manner put the nervous visitors at ease.",
"他温文尔雅的举止让紧张的来宾放松下来。",
"https://www.oxfordlearnersdictionaries.com/definition/english/urbane"
],
[
"eclipse",
"名词 · 日食；月食",
"指天体遮挡造成的天文现象；solar eclipse 是日食，lunar eclipse 是月食，要看修饰词区别。",
"The class built a model to explain a solar eclipse.",
"全班制作了一个模型来解释日食。",
"Clouds prevented us from seeing the lunar eclipse.",
"云层挡住了视线，我们没能看到月食。",
"https://www.oxfordlearnersdictionaries.com/definition/english/eclipse"
],
[
"dwarf",
"名词 · 矮人（故事角色）",
"此处限定童话中身形矮小、有特殊能力的角色；称呼真实人物时应尊重本人偏好，避免冒犯。",
"A friendly dwarf guided the travelers through the mountain.",
"一位友善的矮人引导旅人们穿过大山。",
"The story ends when the dwarf opens the hidden door.",
"故事在矮人打开暗门时结束。",
"https://www.oxfordlearnersdictionaries.com/definition/english/dwarf"
],
[
"walking",
"名词 · 步行；徒步",
"指步行锻炼或消遣活动时通常不可数；go walking 表示去散步或徒步，不需要加不定冠词。",
"Walking along the coast is my favorite weekend activity.",
"沿海岸徒步是我最喜欢的周末活动。",
"These boots are designed for walking on rough paths.",
"这些靴子是为在崎岖小路上行走设计的。",
"https://www.oxfordlearnersdictionaries.com/definition/english/walking"
],
[
"bat",
"名词 · 蝙蝠",
"本条限定夜间活动的翼手类动物，是可数名词；在球类运动中同形词则表示球棒。",
"A bat flew out of the old barn at dusk.",
"黄昏时一只蝙蝠飞出了旧谷仓。",
"We watched a bat catching insects above the pond.",
"我们看着一只蝙蝠在池塘上方捕虫。",
"https://www.oxfordlearnersdictionaries.com/definition/english/bat"
],
[
"desolate",
"形容词 · 荒凉的",
"形容地方空旷无人而给人悲凉感；也可形容人的孤独悲伤，不单纯等同于干燥。",
"The abandoned station looked desolate in the rain.",
"废弃的车站在雨中显得荒凉。",
"A desolate stretch of coast lay beyond the village.",
"村庄外面是一片荒凉的海岸。",
"https://www.oxfordlearnersdictionaries.com/definition/english/desolate"
],
[
"contractor",
"名词 · 承包商",
"指按合同提供工程或服务的人或公司，是可数名词；不自动表示承包商是客户的正式雇员。",
"The contractor will repair the roof next week.",
"承包商下周会修理屋顶。",
"We asked the contractor for a written estimate.",
"我们请承包商提供书面报价。",
"https://www.oxfordlearnersdictionaries.com/definition/english/contractor"
],
[
"christianity",
"名词 · 基督教",
"宗教名称通常大写首字母，泛指宗教本身时不加冠词；不要与指信徒的 Christian 混用。",
"The course examines the early history of Christianity.",
"这门课程研究基督教早期历史。",
"The museum explains how Christianity influenced local art.",
"博物馆解释了基督教如何影响当地艺术。",
"https://www.oxfordlearnersdictionaries.com/definition/english/christianity"
],
[
"electromagnetic",
"形容词 · 电磁的",
"修饰同时涉及电和磁现象的事物，如 electromagnetic wave；不等于只涉及电流的 electrical。",
"The instrument detects electromagnetic waves.",
"这台仪器探测电磁波。",
"An electromagnetic field surrounds the coil.",
"线圈周围存在电磁场。",
"https://www.oxfordlearnersdictionaries.com/definition/english/electromagnetic"
],
[
"permeate",
"动词 · 渗透；弥漫",
"可直接接被渗透的物体或场所，也可用 permeate through；还可形容思想气氛遍及各处。",
"The smell of fresh bread began to permeate the hallway.",
"新鲜面包的香味开始弥漫整个走廊。",
"Water can permeate the tiny spaces in the rock.",
"水可以渗入岩石的微小空隙。",
"https://www.oxfordlearnersdictionaries.com/definition/english/permeate"
],
[
"nonprofit",
"形容词 · 非营利的",
"表示组织的设立目的不是为所有者盈利；并不表示没有收入，也不表示工作人员一律无薪。",
"She works for a nonprofit theater company.",
"她为一家非营利剧团工作。",
"A nonprofit group runs the community garden.",
"一个非营利团体经营着社区花园。",
"https://dictionary.cambridge.org/dictionary/english/nonprofit"
],
[
"reporting",
"名词 · 新闻报道",
"此处指新闻采编和呈现的活动，通常不可数；不是指向主管汇报的一次具体报告。",
"Her reporting brought attention to the damaged bridge.",
"她的报道让受损的大桥受到关注。",
"Accurate reporting requires careful checks of the facts.",
"准确报道需要仔细核实事实。",
"https://www.oxfordlearnersdictionaries.com/definition/english/reporting"
],
[
"starting",
"形容词 · 起始的",
"常用于 starting point、starting salary 等搭配，说明过程开始时的位置或条件，不能表示最终结果。",
"The old bridge is our starting point for the walk.",
"那座旧桥是我们这次徒步的起点。",
"The starting price is listed beside each item.",
"每件物品旁都标有起拍价。",
"https://dictionary.cambridge.org/dictionary/english/starting"
],
[
"eating",
"名词 · 进食",
"表示吃东西这一活动时通常不可数，可用 eating habits 等名词组合；具体食物不称作 an eating。",
"The study examines children's eating habits.",
"这项研究考察儿童的饮食习惯。",
"Eating slowly gives us time to enjoy the meal.",
"慢慢吃能让我们有时间享受这顿饭。",
"https://www.oxfordlearnersdictionaries.com/definition/english/eating"
],
[
"auditor",
"名词 · 审计员",
"此处指正式检查企业财务和业务记录的人，可数；不把旁听课程等另一义项套入财务语境。",
"The auditor asked to see the original receipts.",
"审计员要求查看原始收据。",
"An independent auditor reviewed the charity's accounts.",
"一位独立审计员审查了这家慈善机构的账目。",
"https://www.oxfordlearnersdictionaries.com/definition/english/auditor"
],
[
"performer",
"名词 · 表演者",
"指面向观众表演的人，可数；形容工作表现时另有 performer 用法，本条限定舞台表演。",
"Each performer had five minutes on stage.",
"每位表演者有五分钟上台时间。",
"The performer invited a child to help with the trick.",
"那位表演者邀请一名孩子帮忙表演魔术。",
"https://www.oxfordlearnersdictionaries.com/definition/english/performer"
],
[
"hostility",
"名词 · 敌意；强烈反对",
"表示不友善态度时通常不可数，常用 hostility towards；并不一定表示已发生肢体暴力。",
"Her suggestion was met with unexpected hostility.",
"她的建议遭到了意想不到的敌视。",
"There was little hostility between the two teams.",
"两队之间几乎没有敌意。",
"https://www.oxfordlearnersdictionaries.com/definition/english/hostility"
],
[
"flake",
"名词 · 薄片",
"指从较大物体脱落的小薄片，可用 a flake of 加材料名；不是任意形状的大块物体。",
"A flake of paint fell onto the floor.",
"一片油漆碎屑落到了地板上。",
"She brushed a flake of pastry from her sleeve.",
"她拂去了袖子上的一片酥皮碎屑。",
"https://www.oxfordlearnersdictionaries.com/definition/english/flake"
],
[
"sexually",
"副词 · 在性方面",
"修饰与性活动或性吸引有关的行为或性质；不能把这个副词与表示性别身份的所有表达混同。",
"The survey asked whether participants were sexually active.",
"调查询问参与者是否有性生活。",
"Some diseases can be transmitted sexually.",
"有些疾病可以通过性接触传播。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sexually"
],
[
"credibility",
"名词 · 可信度",
"表示人或说法值得信任的程度，通常不可数；证据可增加 credibility，但不自动等同于证明。",
"The missing data weakened the report's credibility.",
"数据缺失削弱了这份报告的可信度。",
"Clear records helped the witness establish credibility.",
"清晰的记录有助于证人建立可信度。",
"https://www.oxfordlearnersdictionaries.com/definition/english/credibility"
],
[
"monitoring",
"名词 · 监测",
"指持续观察并检查变化的过程，常与 air quality 等对象搭配；监测本身不意味着已经干预。",
"The station provides continuous monitoring of river levels.",
"这座站点持续监测河流水位。",
"Better monitoring helped the team detect the fault earlier.",
"更好的监测帮助团队更早发现故障。",
"https://dictionary.cambridge.org/dictionary/english/monitoring"
],
[
"dynamism",
"名词 · 活力",
"强调推动新事物和实现目标的精力与热情，通常不可数；不只是物理上的移动速度。",
"Her dynamism brought new energy to the club.",
"她的活力给俱乐部注入了新的动力。",
"The exhibition captures the dynamism of the young city.",
"这场展览展现了这座年轻城市的活力。",
"https://www.oxfordlearnersdictionaries.com/definition/english/dynamism"
],
[
"nominee",
"名词 · 被提名者",
"指被正式提出作为职位或奖项候选人的人，是可数名词；获得提名并不等于最终当选或获奖。",
"Each nominee will give a short presentation.",
"每位被提名者都将作一个简短陈述。",
"The final nominee was announced at the ceremony.",
"最后一位被提名者在仪式上公布。",
"https://www.oxfordlearnersdictionaries.com/definition/english/nominee"
],
[
"inmate",
"名词 · 在押人员",
"常指监狱中的囚犯，也可用于某些收容机构的住居者；本条例句限定监狱场景，不能泛称普通住户。",
"The inmate borrowed a history book from the prison library.",
"那名囚犯从监狱图书馆借了一本历史书。",
"Each inmate was offered a place in the training program.",
"每名在押人员都有机会参加培训项目。",
"https://www.oxfordlearnersdictionaries.com/definition/english/inmate"
],
[
"washing",
"名词 · 洗涤；待洗衣物",
"表示清洗活动或一批待洗衣物时通常不可数；do the washing 常指洗衣服，不是一次普通洗手。",
"The washing is still hanging in the garden.",
"洗好的衣物还晾在花园里。",
"I did the washing before breakfast.",
"我早饭前洗了衣服。",
"https://www.oxfordlearnersdictionaries.com/definition/english/washing"
],
[
"junction",
"名词 · 交叉路口",
"指道路或铁路等相接之处，常用 at a junction；不仅限于两条道路，也可有多条相接。",
"A cyclist was waiting at the next junction.",
"一位骑车人正在下一个路口等候。",
"The signs near the junction were difficult to read.",
"路口附近的标志难以看清。",
"https://www.oxfordlearnersdictionaries.com/definition/english/junction"
],
[
"sterling",
"名词 · 英镑货币",
"指英国以英镑为基础的货币体系，通常不可数；说明币种可用 in sterling，并不是某一个面额。",
"The invoice must be paid in sterling.",
"这张发票必须以英镑支付。",
"The shop accepts sterling as well as euros.",
"这家商店既接受英镑，也接受欧元。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sterling"
],
[
"broadcasting",
"名词 · 广播电视业",
"泛指制作并传播电视或电台节目的行业和活动，通常不可数；不是一台具体的收音设备。",
"She hopes to work in broadcasting after graduation.",
"她希望毕业后从事广播电视工作。",
"The course covers the history of public broadcasting.",
"这门课程涵盖公共广播电视的发展史。",
"https://www.oxfordlearnersdictionaries.com/definition/english/broadcasting"
],
[
"toad",
"名词 · 蟾蜍",
"指类似青蛙但皮肤通常更干燥粗糙的两栖动物，是可数名词；不是所有蛙类都称作 toad。",
"A toad was hiding beneath the flowerpot.",
"一只蟾蜍躲在花盆下。",
"We watched a toad cross the wet path.",
"我们看着一只蟾蜍穿过湿漉漉的小路。",
"https://www.oxfordlearnersdictionaries.com/definition/english/toad"
],
[
"tumour",
"名词 · 肿瘤",
"是英式拼写，美式常写 tumor；指异常生长的组织团块，单凭该词不能断定为恶性肿瘤。",
"The scan showed a small tumour.",
"扫描显示有一个小肿瘤。",
"The report did not say whether the tumour was benign.",
"报告没有说明该肿瘤是否为良性。",
"https://www.oxfordlearnersdictionaries.com/definition/english/tumour"
],
[
"sexy",
"形容词 · 性感的",
"本义指有性吸引力的，通常用于非正式评价；不等同于表示性别的 sexual，也不适用于所有赞美场景。",
"The designer wanted the costume to look sexy without restricting movement.",
"设计师希望服装看起来性感而又不妨碍活动。",
"The advertisement describes the new perfume as sexy and mysterious.",
"广告把这款新香水描述为性感而神秘。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sexy"
],
[
"remarkably",
"副词 · 不同寻常地",
"强调某种程度或表现出乎意料、值得注意，常修饰形容词或副词；不是简单表示非常的中性替换。",
"The old clock still keeps remarkably accurate time.",
"这只旧钟走时仍然出奇地准确。",
"She remained remarkably calm during the delay.",
"耽搁期间她一直镇定得令人惊讶。",
"https://www.oxfordlearnersdictionaries.com/definition/english/remarkably"
],
[
"cocaine",
"名词 · 可卡因",
"指一种可能成瘾的强效药物，通常作不可数名词；不能把它当作任何白色粉末的通称。",
"The documentary examines the illegal cocaine trade.",
"这部纪录片探讨非法可卡因交易。",
"The lecture explained why cocaine can cause dependence.",
"讲座解释了可卡因为何可能导致依赖。",
"https://www.oxfordlearnersdictionaries.com/definition/english/cocaine"
],
[
"passing",
"名词 · 流逝",
"the passing of time 指时间流逝，passing 在此是名词；另有去世义，不能不看搭配就作同一理解。",
"The passing of time made the old dispute seem less important.",
"时间流逝让那场旧争执显得不那么重要了。",
"She marked the passing of each season in her sketchbook.",
"她在速写本里记录每个季节的流转。",
"https://www.oxfordlearnersdictionaries.com/definition/english/passing"
],
[
"monopoly",
"名词 · 垄断",
"指对某项商品或服务的独占控制，常用 a monopoly on；不意味着只要公司规模大就构成垄断。",
"The company once held a monopoly on local bus services.",
"这家公司曾垄断当地公交服务。",
"No single group should have a monopoly on the discussion.",
"任何一个团体都不应垄断讨论。",
"https://www.oxfordlearnersdictionaries.com/definition/english/monopoly"
],
[
"ancestral",
"形容词 · 祖先的",
"描述属于祖先或与祖辈有关的事物，常见 ancestral home；不等同于仅年代久远而无家族联系。",
"They returned to their ancestral village in spring.",
"他们春天回到了祖辈的村庄。",
"The collection includes tools from her ancestral home.",
"收藏中包括来自她祖居的工具。",
"https://www.oxfordlearnersdictionaries.com/definition/english/ancestral"
],
[
"contaminate",
"动词 · 污染",
"表示使物质掺入危险或不洁成分，直接接受污染对象；常用 be contaminated with 说明污染物。",
"A leaking pipe could contaminate the drinking water.",
"漏水的管道可能污染饮用水。",
"Dirty gloves can contaminate a clean sample.",
"脏手套会污染干净样本。",
"https://www.oxfordlearnersdictionaries.com/definition/english/contaminate"
],
[
"adrift",
"形容词／副词 · 漂流着",
"常用于船只失去系泊或控制而漂流的状态，放在 be 后；不表示主动按既定航线行驶。",
"The empty boat was adrift near the rocks.",
"那艘空船在礁石附近漂流。",
"The storm set several fishing boats adrift.",
"暴风雨使几艘渔船脱锚漂流。",
"https://www.oxfordlearnersdictionaries.com/definition/english/adrift"
],
[
"squadron",
"名词 · 飞行中队",
"指军队中由若干军用飞机或舰艇组成的单位，是可数名词；不是任意一群飞行中的鸟。",
"A squadron of aircraft flew over the coast.",
"一支飞行中队飞过海岸。",
"The squadron returned to base before sunset.",
"飞行中队在日落前返回基地。",
"https://www.oxfordlearnersdictionaries.com/definition/english/squadron"
],
[
"ulcer",
"名词 · 溃疡",
"指体表或内部器官表面破损、可能出血的病变，可数；不应把所有胃痛都称为 ulcer。",
"The doctor examined the ulcer on his leg.",
"医生检查了他腿上的溃疡。",
"The textbook includes a diagram of a stomach ulcer.",
"教材中有一张胃溃疡示意图。",
"https://www.oxfordlearnersdictionaries.com/definition/english/ulcer"
],
[
"organizational",
"形容词 · 组织的",
"可描述机构安排，也可表示统筹事务的能力；organizational skills 常指组织协调能力，不是一个机构的规模。",
"The role requires strong organizational skills.",
"这个职位要求很强的组织协调能力。",
"The report recommends several organizational changes.",
"报告建议作出几项组织结构调整。",
"https://www.oxfordlearnersdictionaries.com/definition/english/organizational"
],
[
"breathing",
"名词 · 呼吸",
"指吸入和呼出空气的活动，通常不可数；作名词时可被 slow、steady 等词修饰。",
"Her breathing became slower as she fell asleep.",
"她入睡后呼吸逐渐放慢。",
"The exercise focuses on steady breathing.",
"这个练习着重于保持平稳呼吸。",
"https://www.oxfordlearnersdictionaries.com/definition/english/breathing"
],
[
"persian",
"名词 · 波斯语",
"此处指语言名称，首字母大写，通常不加冠词；不能把说这种语言的人都自动等同于同一国籍。",
"She is learning Persian to read the poems in their original language.",
"她正在学习波斯语，以便阅读这些诗的原文。",
"The guide translated the inscription from Persian into English.",
"导游把铭文从波斯语翻译成英语。",
"https://www.oxfordlearnersdictionaries.com/definition/english/persian"
],
[
"bearing",
"名词 · 关系；影响",
"have a bearing on 表示与某事有关或对其有影响；该搭配不是指机器轴承或人的姿态。",
"The weather has a direct bearing on the harvest.",
"天气直接影响收成。",
"That detail has little bearing on our decision.",
"那个细节对我们的决定影响不大。",
"https://www.oxfordlearnersdictionaries.com/definition/english/bearing"
],
[
"albeit",
"连词 · 虽然；尽管",
"语体偏正式，常引出形容词、副词等简短补充，表达让步；不能机械地接任意完整陈述。",
"The room was comfortable, albeit rather small.",
"房间很舒适，尽管相当小。",
"She agreed to help, albeit reluctantly.",
"她同意帮忙，尽管有些勉强。",
"https://www.oxfordlearnersdictionaries.com/definition/english/albeit"
],
[
"thou",
"代词 · 你（古语）",
"是古代或诗歌中的第二人称单数主格，宾格常用 thee；现代日常交流一般用 you。",
"In the poem, thou refers to a single listener.",
"在这首诗中，thou 指一位听者。",
"The actor paused before reading the word thou aloud.",
"演员停顿了一下，然后朗读出 thou 这个词。",
"https://www.oxfordlearnersdictionaries.com/definition/english/thou"
],
[
"programming",
"名词 · 编程",
"本义指编写和测试计算机程序的活动，通常不可数；另外也可指广播节目编排，须结合上下文。",
"The club teaches programming through small games.",
"俱乐部通过小游戏教授编程。",
"A programming error caused the display to freeze.",
"一个编程错误导致屏幕显示卡住。",
"https://www.oxfordlearnersdictionaries.com/definition/english/programming"
],
[
"characterise",
"动词 · 是……的特征",
"是英式拼写，美式常写 characterize；作及物动词时可表示某种特点使事物具有辨识性。",
"Clear lines characterise her architectural drawings.",
"清晰的线条是她建筑图纸的特征。",
"Short, dry summers characterise the climate of this region.",
"短暂干燥的夏季是这个地区气候的特征。",
"https://dictionary.cambridge.org/dictionary/english/characterise"
],
[
"emotionally",
"副词 · 情绪上地",
"修饰与感受或情绪反应有关的状态，如 emotionally exhausted；不直接代替形容词 emotional。",
"She felt emotionally exhausted after the difficult conversation.",
"那场艰难的谈话后，她感到情绪上筋疲力尽。",
"The story affected him emotionally for several days.",
"这个故事在情绪上影响了他好几天。",
"https://www.oxfordlearnersdictionaries.com/definition/english/emotionally"
],
[
"covenant",
"名词 · 契约；约定",
"指较正式的承诺或法律协议，可数；宗教语境还可指盟约，不等同于日常随口说的打算。",
"The covenant required the land to remain a public garden.",
"这份契约要求这块地继续用作公共花园。",
"Both parties signed a covenant covering the use of the building.",
"双方签订了有关建筑使用的契约。",
"https://www.oxfordlearnersdictionaries.com/definition/english/covenant"
],
[
"printed",
"形容词 · 印刷的",
"用于书籍或资料时表示已印在纸上，与屏幕上的电子形式有别；不等于手写的。",
"Please bring a printed copy of the timetable.",
"请带一份印好的时间表。",
"The museum keeps a collection of early printed maps.",
"博物馆保存着一批早期印刷地图。",
"https://dictionary.cambridge.org/dictionary/english/printed"
],
[
"importantly",
"副词 · 重要的是",
"常用 more importantly 引出更重要的补充，评价整件事；不同于形容词 important 修饰名词。",
"The route is shorter and, more importantly, safer.",
"这条路线更短，更重要的是更安全。",
"Most importantly, everyone had a chance to speak.",
"最重要的是，每个人都有发言的机会。",
"https://www.oxfordlearnersdictionaries.com/definition/english/importantly"
],
[
"distinguished",
"形容词 · 杰出的；受尊敬的",
"强调因成就而受到敬重，常用于学者、来宾等；不是任何与别人不同的人都适用。",
"A distinguished historian gave the opening lecture.",
"一位杰出的历史学家作了开场讲座。",
"The award honors a distinguished career in teaching.",
"这个奖项表彰杰出的教学生涯。",
"https://www.oxfordlearnersdictionaries.com/definition/english/distinguished"
],
[
"regulator",
"名词 · 监管机构",
"指正式监管某一行业的人或组织，可数；与调节温度等的装置义不同，需看所监管的领域。",
"The regulator asked the company to explain its fees.",
"监管机构要求这家公司解释收费情况。",
"A national regulator oversees the safety of these services.",
"一个国家级监管机构监督这些服务的安全。",
"https://www.oxfordlearnersdictionaries.com/definition/english/regulator"
],
[
"varied",
"形容词 · 多种多样的",
"表示有多种不同类型或经常变化，常见 varied diet；不同于仅表示数量大的 large。",
"The course offers a varied selection of reading materials.",
"课程提供多种多样的阅读材料。",
"A varied landscape makes the walk interesting.",
"多样的地形让这次徒步很有趣。",
"https://www.oxfordlearnersdictionaries.com/definition/english/varied"
],
[
"brigade",
"名词 · 旅；队伍",
"军队语境中指较大的编制单位，可数；fire brigade 等固定搭配有专门含义，需整体理解。",
"The brigade moved to a new training area.",
"这个旅转移到了新的训练区域。",
"A medical team was attached to the brigade.",
"一支医疗队被配属给这个旅。",
"https://www.oxfordlearnersdictionaries.com/definition/english/brigade"
],
[
"appall",
"动词 · 使震惊",
"表示使人因令人不快或不能接受的事情而震惊，是及物动词；不用来表达普通的愉快惊喜。",
"Such careless treatment would appall any responsible owner.",
"这样草率的对待方式会让任何负责任的主人感到震惊。",
"The conditions in the building continue to appall visitors.",
"楼内的状况仍让来访者感到震惊。",
"https://dictionary.cambridge.org/dictionary/english/appall"
],
[
"quarry",
"名词 · 采石场",
"此处指开采石材等的场地，可数；另有被追捕对象义，不能套入采矿场景。",
"The old quarry filled with water after it closed.",
"那座旧采石场关闭后积满了水。",
"Stone from the quarry was used to build the bridge.",
"采石场的石头被用来修建那座桥。",
"https://www.oxfordlearnersdictionaries.com/definition/english/quarry"
],
[
"disturbing",
"形容词 · 令人不安的",
"描述消息、影像等使人焦虑或震惊，不同于 disturbed 描述人已感到不安的状态。",
"The documentary contains some disturbing images.",
"这部纪录片包含一些令人不安的画面。",
"We noticed a disturbing change in the water's color.",
"我们注意到水的颜色发生了令人不安的变化。",
"https://www.oxfordlearnersdictionaries.com/definition/english/disturbing"
],
[
"testament",
"名词 · 证明；见证",
"a testament to 常用于说明某事体现了某种品质或事实；这里采用见证义，不是遗嘱义。",
"The restored house is a testament to their patience.",
"修复后的房屋见证了他们的耐心。",
"Her collection is a testament to years of careful research.",
"她的收藏是多年细致研究的证明。",
"https://www.oxfordlearnersdictionaries.com/definition/english/testament"
],
[
"devastating",
"形容词 · 毁灭性的",
"用于灾害等造成极大破坏的情况，也可指令人极度难过的消息；不是仅有一点负面影响。",
"The storm had a devastating effect on coastal farms.",
"这场风暴对沿海农场造成了毁灭性影响。",
"The closure was devastating for the small community.",
"关闭对这个小社区造成了沉重打击。",
"https://www.oxfordlearnersdictionaries.com/definition/english/devastating"
],
[
"negligence",
"名词 · 疏忽",
"指未给予应有的照顾或注意，通常不可数；法律认定还需具体条件，不能仅凭该词推定责任。",
"The report identified negligence in the handling of the records.",
"报告指出记录处理过程中存在疏忽。",
"The damaged equipment raised concerns about negligence.",
"设备损坏引发了对疏忽问题的担忧。",
"https://www.oxfordlearnersdictionaries.com/definition/english/negligence"
],
[
"derby",
"名词 · 同城球队比赛",
"体育语境中可指同一地区球队之间的比赛，是可数名词；其他地区另有礼帽等义项。",
"The local derby attracted a large crowd.",
"这场本地德比战吸引了大批观众。",
"Both clubs prepared carefully for the derby.",
"两家俱乐部都为德比战作了充分准备。",
"https://www.oxfordlearnersdictionaries.com/definition/english/derby"
],
[
"unidentified",
"形容词 · 身份不明的",
"表示尚未识别或确认是谁、是什么；不等于物体本身无法被识别，也不自动表示可疑。",
"An unidentified caller left a message.",
"一位身份不明的来电者留了言。",
"The sample contained an unidentified substance.",
"样本中含有一种尚未确认的物质。",
"https://www.oxfordlearnersdictionaries.com/definition/english/unidentified"
],
[
"immerse",
"动词 · 浸入",
"immerse something in 表示把某物浸在液体中；反身结构 immerse yourself in 还可指专心投入。",
"Immerse the brush in warm water.",
"把刷子浸入温水中。",
"Do not immerse the motor in liquid.",
"不要把电机浸入液体。",
"https://www.oxfordlearnersdictionaries.com/definition/english/immerse"
],
[
"trim",
"动词 · 修剪",
"表示剪去部分使外形整齐或缩小尺寸，直接接被修剪的东西；不表示把整件物品完全剪碎。",
"Please trim the branches near the window.",
"请修剪窗户附近的树枝。",
"We need to trim the fabric before sewing the edge.",
"我们需要在缝边前修整布料。",
"https://www.oxfordlearnersdictionaries.com/definition/english/trim"
],
[
"exemption",
"名词 · 豁免",
"指获准不承担通常应履行的义务，常用 exemption from；不代表任何人都可自行选择不遵守。",
"She applied for an exemption from the fee.",
"她申请免除这笔费用。",
"The exemption applies only to the listed equipment.",
"这项豁免仅适用于列出的设备。",
"https://www.oxfordlearnersdictionaries.com/definition/english/exemption"
],
[
"lordship",
"名词 · 阁下（尊称）",
"在英国对特定贵族或法官等使用的正式尊称中常见 Your Lordship；不能用作对所有人的普通敬称。",
"The clerk addressed the judge as Your Lordship.",
"书记员用 Your Lordship 称呼法官。",
"The letter asked whether His Lordship would attend the ceremony.",
"信中询问阁下是否会出席仪式。",
"https://www.oxfordlearnersdictionaries.com/definition/english/lordship"
],
[
"ace",
"名词 · A牌",
"指扑克牌中标记一个花色符号的牌，是可数名词；a 开头为元音音素，单数用 an ace。",
"She placed an ace beside the king.",
"她把一张A牌放在K牌旁边。",
"He needed an ace to complete the hand.",
"他需要一张A牌才能凑齐这手牌。",
"https://www.oxfordlearnersdictionaries.com/definition/english/ace"
],
[
"guerrilla",
"名词 · 游击队员",
"指通常不属于正规军、以小队行动的武装成员，是可数名词；单个人也用 a guerrilla。",
"The novel follows a guerrilla returning to civilian life.",
"小说讲述了一名游击队员回归平民生活的故事。",
"A former guerrilla described his experiences in the interview.",
"一名前游击队员在采访中讲述了自己的经历。",
"https://www.oxfordlearnersdictionaries.com/definition/english/guerrilla"
],
[
"organized",
"形容词 · 有条理的",
"可描述人善于安排事务，或活动经过周密规划；不等于所有已成立的机构都运作有序。",
"An organized workspace makes it easier to find tools.",
"有条理的工作空间使工具更容易找到。",
"She is organized enough to manage three projects at once.",
"她做事很有条理，能同时管理三个项目。",
"https://www.oxfordlearnersdictionaries.com/definition/english/organized"
],
[
"easier",
"形容词 · 更容易的",
"是 easy 的比较级，说明与另一情况相比更省力；比较对象可用 than 引出，不要再加 more。",
"The second puzzle is easier than the first.",
"第二道谜题比第一道容易。",
"A wider handle makes the bag easier to carry.",
"更宽的提手让包更容易携带。",
"https://dictionary.cambridge.org/dictionary/english/easier"
],
[
"chopped",
"形容词 · 切碎的",
"是 chop 的过去分词，可放在名词前描述食材已被切成小块；不等同于绞成泥。",
"Add the chopped onion to the pan.",
"把切碎的洋葱加入锅中。",
"She scattered chopped nuts over the cake.",
"她把碎坚果撒在蛋糕上。",
"https://dictionary.cambridge.org/dictionary/english/chopped"
],
[
"considering",
"介词 · 考虑到",
"引出影响判断的事实，后可接名词短语；表示把某条件算进去，不是作出保证。",
"The room is quiet considering its location beside a main road.",
"考虑到房间紧挨主干道，它算是安静的。",
"Considering the weather, we made good progress.",
"考虑到天气状况，我们的进展不错。",
"https://www.oxfordlearnersdictionaries.com/definition/english/considering"
],
[
"skiing",
"名词 · 滑雪",
"表示滑雪活动或运动时通常不可数；go skiing 是常见搭配，不用 go to skiing。",
"We went skiing after the fresh snowfall.",
"下过新雪后我们去滑雪了。",
"Skiing requires balance as well as strength.",
"滑雪既需要力量，也需要平衡能力。",
"https://www.oxfordlearnersdictionaries.com/definition/english/skiing"
],
[
"iranian",
"形容词 · 伊朗的",
"表示与伊朗相关的人或事物，首字母大写；不要与较广或不同的语言和宗教身份机械等同。",
"The exhibition features Iranian cinema.",
"这场展览以伊朗电影为主题。",
"She translated a story by an Iranian author.",
"她翻译了一位伊朗作家的故事。",
"https://www.oxfordlearnersdictionaries.com/definition/english/iranian"
],
[
"tenure",
"名词 · 任期",
"指担任某一职位的时间，常用 during someone's tenure；大学职位语境中也可指长期任用资格。",
"The library expanded during her tenure as director.",
"图书馆在她担任馆长期间扩大了规模。",
"His tenure ended when a new board was appointed.",
"新董事会任命后，他的任期结束了。",
"https://www.oxfordlearnersdictionaries.com/definition/english/tenure"
],
[
"variance",
"名词 · 差异",
"at variance with 表示与某说法或事实不一致；统计学中还有方差义，不能把所有差异都称作方差。",
"Her account was at variance with the written record.",
"她的叙述与书面记录不一致。",
"The report noted a variance between planned and actual costs.",
"报告指出计划成本与实际成本存在差异。",
"https://www.oxfordlearnersdictionaries.com/definition/english/variance"
],
[
"trout",
"名词 · 鳟鱼",
"指一种常见淡水鱼；复数通常仍为 trout，作为食材时也可不可数，不必机械加 s。",
"A trout swam beneath the bridge.",
"一条鳟鱼从桥下游过。",
"The restaurant serves trout with lemon and herbs.",
"这家餐馆供应配柠檬和香草的鳟鱼。",
"https://www.oxfordlearnersdictionaries.com/definition/english/trout"
],
[
"swiftly",
"副词 · 迅速地",
"修饰动作发生得很快，常见 act swiftly；对应形容词 swift，不能直接用来修饰名词。",
"The team acted swiftly to protect the paintings.",
"团队迅速行动，保护这些画作。",
"Dark clouds moved swiftly across the valley.",
"乌云迅速掠过山谷。",
"https://www.oxfordlearnersdictionaries.com/definition/english/swiftly"
],
[
"ninth",
"序数词 · 第九",
"用于说明顺序而非数量，拼写会省去 nine 的 e；在普通名词前通常用 the ninth。",
"Our apartment is on the ninth floor.",
"我们的公寓在九楼。",
"She finished ninth in the race.",
"她在比赛中获得第九名。",
"https://www.oxfordlearnersdictionaries.com/definition/english/ninth"
],
[
"territorial",
"形容词 · 领土的",
"描述与国家拥有的土地或海域有关的事务；动物行为中另可指保卫领地，本条限国家领土义。",
"The talks focused on territorial boundaries.",
"谈判集中讨论领土边界。",
"The agreement addressed a long territorial dispute.",
"该协议处理了一场长期领土争端。",
"https://www.oxfordlearnersdictionaries.com/definition/english/territorial"
],
[
"cooper",
"名词 · 制桶匠",
"是制作木桶的工匠名称，可数；作姓氏时应大写，本条不把人名当作职业义。",
"The cooper shaped each wooden stave by hand.",
"制桶匠手工塑造每块桶板。",
"A cooper demonstrated barrel making at the museum.",
"一位制桶匠在博物馆演示木桶制作。",
"https://www.oxfordlearnersdictionaries.com/definition/english/cooper"
],
[
"mow",
"动词 · 割草",
"指用割草机或工具剪割草等，常用 mow the lawn；不用于修剪树枝等所有切削行为。",
"We need to mow the lawn before the picnic.",
"野餐前我们需要修剪草坪。",
"He learned to mow around the flowerbeds carefully.",
"他学会了小心地沿花坛周围割草。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mow"
],
[
"disclaimer",
"名词 · 免责声明",
"指声明不承担某些责任或不与某事相关的文字；有该声明不代表法律上一定免除责任。",
"The website includes a disclaimer about third-party content.",
"网站包含一项有关第三方内容的免责声明。",
"A brief disclaimer appears below the illustration.",
"插图下方有一则简短的免责声明。",
"https://www.oxfordlearnersdictionaries.com/definition/english/disclaimer"
],
[
"ascribe",
"动词 · 归因于",
"ascribe A to B 表示把A归因于B，也可把作品归属于某作者；不能省掉表达归属的 to。",
"We cannot ascribe every delay to bad weather.",
"我们不能把每次延误都归因于坏天气。",
"Critics ascribe the poem to an unknown local writer.",
"评论家认为这首诗出自一位不知名的本地作家。",
"https://dictionary.cambridge.org/dictionary/english/ascribe"
],
[
"colored",
"形容词 · 有颜色的",
"此处是美式拼写，英式常写 coloured，限定物品颜色；用于种族称呼时在许多语境中冒犯，勿套用。",
"Place a colored marker beside each completed task.",
"在每项完成的任务旁放一个彩色标记。",
"Sunlight shone through the colored glass.",
"阳光透过彩色玻璃照进来。",
"https://www.oxfordlearnersdictionaries.com/definition/english/colored"
],
[
"silently",
"副词 · 默默地；无声地",
"可表示没有说话，也可表示没有发出声音，需结合动作判断；不一定表示内心平静。",
"She silently handed me a clean towel.",
"她默默地递给我一条干净毛巾。",
"The owl glided silently over the field.",
"猫头鹰无声地滑翔过田野。",
"https://www.oxfordlearnersdictionaries.com/definition/english/silently"
],
[
"tyranny",
"名词 · 暴政",
"指残酷或不公地使用权力，通常不可数；the tyranny of 也可比喻某种强大束缚。",
"The novel describes life under tyranny.",
"小说描写了暴政之下的生活。",
"The exhibition honors those who resisted tyranny.",
"这场展览向反抗暴政的人们致敬。",
"https://www.oxfordlearnersdictionaries.com/definition/english/tyranny"
],
[
"upon",
"介词 · 在……时",
"upon 加名词或动名词可表示某事一发生就，语体较正式；其他义项应依搭配判断。",
"Please check the contents upon arrival.",
"抵达后请检查包裹内容。",
"Upon hearing the bell, the students put down their pens.",
"一听到铃声，学生们就放下了笔。",
"https://dictionary.cambridge.org/dictionary/english/upon"
],
[
"marxist",
"名词 · 马克思主义者",
"指支持马克思政治经济理论的人，可数；首字母通常大写，不可仅凭职业或国籍推断思想身份。",
"A Marxist joined the panel discussion on economic history.",
"一位马克思主义者参加了有关经济史的小组讨论。",
"The historian described herself as a Marxist.",
"那位历史学家称自己为马克思主义者。",
"https://www.oxfordlearnersdictionaries.com/definition/english/marxist"
],
[
"utmost",
"形容词 · 极大的",
"常见 of the utmost importance、with the utmost care 等搭配，强调最高程度；不同于最外层的 outermost。",
"Please handle the photographs with the utmost care.",
"请极其小心地拿取这些照片。",
"Accurate records are of the utmost importance here.",
"准确的记录在这里极其重要。",
"https://www.oxfordlearnersdictionaries.com/definition/english/utmost"
],
[
"quarterly",
"形容词／副词 · 每季度的／地",
"指每三个月一次，即一年通常四次；不是每四个月一次，也不表示每星期四。",
"The club publishes a quarterly newsletter.",
"俱乐部每季度出版一期通讯。",
"We review the figures quarterly.",
"我们每季度审查一次这些数据。",
"https://www.oxfordlearnersdictionaries.com/definition/english/quarterly"
],
[
"queer",
"形容词 · 奇怪的（较旧用法）",
"本条例句限定较旧的奇怪义；该词也有性别性向身份义，涉及人物时应尊重语境及本人用词。",
"There was a queer noise coming from the old cupboard.",
"旧橱柜里传来一种奇怪的声音。",
"The character notices a queer smell in the hallway.",
"这个角色注意到走廊里有一股奇怪的气味。",
"https://www.oxfordlearnersdictionaries.com/definition/english/queer"
],
[
"snowstorm",
"名词 · 暴风雪",
"指常伴有强风的大量降雪天气，是可数名词；不仅是普通的小雪或地面的积雪。",
"The snowstorm blocked the mountain road.",
"暴风雪阻断了山路。",
"We stayed at the lodge during the snowstorm.",
"暴风雪期间我们留在旅舍。",
"https://www.oxfordlearnersdictionaries.com/definition/english/snowstorm"
],
[
"displease",
"动词 · 使不悦",
"是及物动词，后接不满意的人，语气较正式；不能直接用它表示某人主动反对一个提案。",
"The sudden change may displease some visitors.",
"突然的改变可能使部分游客不悦。",
"I did not mean to displease you with my question.",
"我提问并非有意让你不高兴。",
"https://www.oxfordlearnersdictionaries.com/definition/english/displease"
],
[
"currently",
"副词 · 目前",
"说明当前阶段正在发生的状态，不保证长期保持；常放在 be 后或实义动词前。",
"The gallery is currently closed for repairs.",
"画廊目前关闭维修。",
"We currently offer two evening classes.",
"我们目前开设两门晚间课程。",
"https://www.oxfordlearnersdictionaries.com/definition/english/currently"
],
[
"defendant",
"名词 · 被告",
"指诉讼中被指控或被起诉的人或实体，是可数名词；被告身份本身不表示有罪。",
"The defendant denied the allegation.",
"被告否认了这项指控。",
"The court allowed the defendant time to consult a lawyer.",
"法庭给予被告时间咨询律师。",
"https://www.oxfordlearnersdictionaries.com/definition/english/defendant"
],
[
"spokesman",
"名词 · 发言人",
"指代表团体公开发言的人，传统用词偏男性；不指任何恰好说话的人，须有代表关系。",
"A spokesman for the museum announced the closure.",
"博物馆的一名发言人宣布了闭馆消息。",
"The spokesman declined to give further details.",
"发言人拒绝提供更多细节。",
"https://www.oxfordlearnersdictionaries.com/definition/english/spokesman"
],
[
"refugee",
"名词 · 难民",
"指因战争、迫害等被迫离开家园的人，是可数名词；不要把所有自愿迁居者都称作难民。",
"A refugee described the journey to the coast.",
"一位难民讲述了前往海岸的旅程。",
"The center helped a refugee find language classes.",
"中心帮助一位难民找到了语言课程。",
"https://www.oxfordlearnersdictionaries.com/definition/english/refugee"
],
[
"senator",
"名词 · 参议员",
"指参议院成员，是可数名词；各国立法机关设置不同，不能泛称所有议员为 senator。",
"The senator answered questions at the town hall.",
"那位参议员在市政厅回答了问题。",
"A senator proposed an amendment to the bill.",
"一位参议员提出了该法案的修正案。",
"https://www.oxfordlearnersdictionaries.com/definition/english/senator"
],
[
"mall",
"名词 · 购物中心",
"指有多家商店、餐厅等的商场或购物区，可数；不是一间独立小店的通称。",
"The mall has a reading area near the food court.",
"购物中心美食广场附近有一个阅读区。",
"A free bus connects the station with the mall.",
"免费公交连接车站和购物中心。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mall"
],
[
"grin",
"动词 · 咧嘴笑",
"表示张嘴或露齿地笑，通常用 grin at someone；不一定表示快乐，也可有尴尬等意味。",
"The children grin whenever the puppy brings back the ball.",
"小狗每次把球叼回来，孩子们都咧嘴笑。",
"He tried to grin at the camera despite his nerves.",
"尽管紧张，他仍试着对镜头咧嘴笑。",
"https://www.oxfordlearnersdictionaries.com/definition/english/grin"
],
[
"underlying",
"形容词 · 根本的；潜在的",
"描述不易从表面看见但影响局面的因素，常用 underlying cause；不等于已经得到确证的原因。",
"The report examines the underlying causes of the shortage.",
"报告研究了短缺的根本原因。",
"We need to understand the underlying problem before changing the rules.",
"更改规则前，我们需要了解潜在问题。",
"https://www.oxfordlearnersdictionaries.com/definition/english/underlying"
],
[
"salmon",
"名词 · 鲑鱼",
"指一种可供食用的鱼，单复数通常同形；表示鱼肉时一般不可数，不用 a salmon 指一份鱼肉。",
"A salmon leaped above the surface of the river.",
"一条鲑鱼跃出了河面。",
"We had grilled salmon with potatoes.",
"我们吃了烤鲑鱼配土豆。",
"https://www.oxfordlearnersdictionaries.com/definition/english/salmon"
],
[
"verse",
"名词 · 诗节",
"可指诗歌或歌曲中一组构成单位的句子；a verse 可数，泛指诗体文学时则常不可数。",
"The choir repeated the final verse.",
"合唱团重复唱了最后一节。",
"Each verse begins with the name of a season.",
"每一节都以一个季节的名称开头。",
"https://www.oxfordlearnersdictionaries.com/definition/english/verse"
],
[
"prediction",
"名词 · 预测",
"指对未来会发生什么作出的判断，可数；make a prediction 是常见搭配，不表示结果已确定。",
"Her prediction about the weather proved accurate.",
"她对天气的预测被证明是准确的。",
"The model produces a new prediction each morning.",
"模型每天早晨生成一个新预测。",
"https://www.oxfordlearnersdictionaries.com/definition/english/prediction"
],
[
"luminous",
"形容词 · 发光的",
"可描述黑暗中发光的材料或物体，也可形容颜色鲜亮；不等同于仅能反射光线的所有表面。",
"The watch has luminous hands that are easy to read at night.",
"这只手表的指针会发光，夜间容易看清。",
"A luminous dial glowed beside the door.",
"门旁有一个发光的刻度盘。",
"https://www.oxfordlearnersdictionaries.com/definition/english/luminous"
],
[
"web",
"名词 · 蜘蛛网",
"本条指蜘蛛吐丝结成的网，可数；网络信息系统的 the Web 是另一义项，不能混入动物场景。",
"A spider repaired its web between two branches.",
"一只蜘蛛在两根树枝间修补蛛网。",
"Morning dew made the web sparkle.",
"晨露让蛛网闪闪发亮。",
"https://www.oxfordlearnersdictionaries.com/definition/english/web"
],
[
"concession",
"名词 · 让步",
"指为达成协议或缓和分歧而同意的条件，可数；make a concession 是常见搭配。",
"The landlord made a concession on the rent.",
"房东在租金上作出了让步。",
"Neither side was willing to offer another concession.",
"双方都不愿再作让步。",
"https://www.oxfordlearnersdictionaries.com/definition/english/concession"
],
[
"incidence",
"名词 · 发生率",
"表示事件或状况发生的频度，常用 the incidence of；区别于指某一次事件的 incident。",
"The study measured the incidence of injuries among cyclists.",
"这项研究测量了骑车者受伤的发生率。",
"Better ventilation was linked to a lower incidence of illness.",
"更好的通风与较低的患病率有关。",
"https://www.oxfordlearnersdictionaries.com/definition/english/incidence"
],
[
"ranch",
"名词 · 大牧场",
"多用于北美、澳大利亚等饲养牛马羊的大型农场，可数；不泛指任何小菜园。",
"Her family runs a cattle ranch near the mountains.",
"她家在山边经营一个养牛牧场。",
"We spent a week helping on the ranch.",
"我们在牧场帮忙了一周。",
"https://www.oxfordlearnersdictionaries.com/definition/english/ranch"
],
[
"virgin",
"名词 · 没有性经历的人",
"本义指从未有过性行为的人，是可数名词；使用时注意隐私和语境，不能据年龄或外表推断。",
"The novel's narrator says that he is a virgin.",
"小说的叙述者说自己没有性经历。",
"He does not tell his friends that he is a virgin.",
"他没有告诉朋友自己尚无性经历。",
"https://www.oxfordlearnersdictionaries.com/definition/english/virgin"
],
[
"coffin",
"名词 · 棺材",
"指安放遗体以便埋葬或火化的箱体，可数；与指一般储物箱的 box 不可随意互换。",
"The coffin was covered with white flowers.",
"棺材上覆盖着白花。",
"The carpenter restored an old wooden coffin for the exhibition.",
"木匠为展览修复了一口旧木棺。",
"https://www.oxfordlearnersdictionaries.com/definition/english/coffin"
],
[
"rejection",
"名词 · 拒绝",
"可指不接受提议、申请等的行为或结果，rejection of 引出被拒的对象；不一定针对个人价值。",
"The rejection of the plan surprised the committee.",
"计划遭拒让委员会感到惊讶。",
"She received a polite rejection after the interview.",
"面试后，她收到了一封礼貌的拒绝信。",
"https://www.oxfordlearnersdictionaries.com/definition/english/rejection"
],
[
"lounge",
"名词 · 休息室",
"指机场、旅馆等供人等候或放松的房间，可数；不能泛指所有家中的卧室。",
"We waited in the lounge until our flight was called.",
"我们在休息室等候，直到广播通知登机。",
"The hotel lounge overlooks the garden.",
"酒店休息室俯瞰花园。",
"https://www.oxfordlearnersdictionaries.com/definition/english/lounge"
],
[
"yacht",
"名词 · 游艇；帆船",
"指供休闲或比赛用的船，常配有住宿空间；不把所有小划艇都称作 yacht。",
"A white yacht sailed out of the harbor.",
"一艘白色帆船驶出了港口。",
"They spent the night on a yacht in the bay.",
"他们在海湾的一艘游艇上过夜。",
"https://www.oxfordlearnersdictionaries.com/definition/english/yacht"
],
[
"butt",
"动词 · 用头顶撞",
"本条限定用头用力撞击的动词义，可直接接对象；另有烟蒂等名词义，须看句法区别。",
"The goat tried to butt the wooden gate.",
"山羊试图用头顶撞木门。",
"Keep back when the ram begins to butt.",
"公羊开始顶撞时要退远一点。",
"https://www.oxfordlearnersdictionaries.com/definition/english/butt"
],
[
"morality",
"名词 · 道德准则",
"指关于对错好坏的准则或行为的道德性质，通常不可数；不等同于个人一时的情绪。",
"The seminar explored the relationship between law and morality.",
"研讨会探讨了法律与道德的关系。",
"The story raises questions about the morality of revenge.",
"这个故事提出了关于复仇是否合乎道德的问题。",
"https://www.oxfordlearnersdictionaries.com/definition/english/morality"
],
[
"articulate",
"动词 · 清晰表达",
"作动词时表示把思想或感受清楚说出来，后接内容；与形容词善于表达的读音结尾有区别。",
"She struggled to articulate her concerns.",
"她努力想清楚表达自己的顾虑。",
"The workshop helps students articulate a convincing argument.",
"工作坊帮助学生清楚表达有说服力的论点。",
"https://www.oxfordlearnersdictionaries.com/definition/english/articulate"
],
[
"sheriff",
"名词 · 警长（美国）",
"在美国语境中常指县等行政区负责执法的民选官员；英格兰、苏格兰等地同词职责不同。",
"The sheriff arrived at the county courthouse.",
"警长到达县法院。",
"A local sheriff answered questions about the road closure.",
"当地一位警长回答了有关道路封闭的问题。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sheriff"
],
[
"baron",
"名词 · 男爵",
"指一种贵族爵位，是可数名词；新闻中也可指行业巨头，本条限定贵族头衔义。",
"A portrait of the baron hangs in the entrance hall.",
"门厅里挂着男爵的肖像。",
"The baron donated part of his estate to the town.",
"这位男爵把部分地产捐给了镇上。",
"https://www.oxfordlearnersdictionaries.com/definition/english/baron"
],
[
"crab",
"名词 · 螃蟹",
"指有硬壳、多足和一对螯的动物，可数；指蟹肉这一食材时也可作不可数名词。",
"A small crab disappeared beneath the rock.",
"一只小螃蟹消失在岩石下。",
"The soup contains crab and sweet corn.",
"这道汤里有蟹肉和甜玉米。",
"https://www.oxfordlearnersdictionaries.com/definition/english/crab"
],
[
"corps",
"名词 · 军；兵团",
"可指军队较大的单位或承担特定任务的部队，词尾 s 通常不发音，单复数拼写相同。",
"The army corps advanced along the valley.",
"这个军沿着山谷推进。",
"She served in the medical corps during the war.",
"战争期间她在医疗部队服役。",
"https://www.oxfordlearnersdictionaries.com/definition/english/corps"
],
[
"courtesy",
"名词 · 礼貌",
"表示尊重他人的礼貌举止时通常不可数；as a courtesy 可指作为一种礼貌做法，而非强制义务。",
"He treated every visitor with courtesy.",
"他礼貌地对待每一位来访者。",
"Please call first as a courtesy to the staff.",
"出于对工作人员的尊重，请先打电话。",
"https://www.oxfordlearnersdictionaries.com/definition/english/courtesy"
],
[
"rap",
"名词 · 说唱音乐",
"本条例句限定按强节奏快速念词的音乐类型，通常不可数；另有敲击等义项，需要看上下文。",
"The workshop combines rap with traditional percussion.",
"这个工作坊把说唱音乐与传统打击乐结合起来。",
"She wrote a rap about life in her neighborhood.",
"她写了一首讲述社区生活的说唱歌曲。",
"https://www.oxfordlearnersdictionaries.com/definition/english/rap"
],
[
"amusement",
"名词 · 乐趣；觉得好笑",
"表示因有趣的事而产生的愉悦感时通常不可数，常用 to someone's amusement 引出反应。",
"She watched the puppy with amusement.",
"她饶有趣味地看着小狗。",
"To our amusement, the parrot repeated the doorbell sound.",
"让我们觉得好笑的是，鹦鹉模仿了门铃声。",
"https://www.oxfordlearnersdictionaries.com/definition/english/amusement"
],
[
"abundance",
"名词 · 丰富；大量",
"an abundance of 表示数量充足甚至超出所需，后接名词；in abundance 则表示大量存在。",
"The garden offers an abundance of fresh herbs.",
"花园里有大量新鲜香草。",
"Wildflowers grow here in abundance every spring.",
"每年春天，这里都长满了野花。",
"https://www.oxfordlearnersdictionaries.com/definition/english/abundance"
],
[
"formulation",
"名词 · 制订",
"指仔细拟定计划、政策等的过程，常接 of；也有具体配方义，不能一概理解成化学公式。",
"The team contributed to the formulation of the new policy.",
"团队参与了新政策的制订。",
"Careful formulation of the research question took several weeks.",
"认真拟定研究问题花了几周时间。",
"https://www.oxfordlearnersdictionaries.com/definition/english/formulation"
],
[
"nurture",
"动词 · 培养；培育",
"既可指照料成长中的生命，也可指帮助能力或关系发展；直接接被培养的对象。",
"The club aims to nurture young musical talent.",
"俱乐部旨在培养年轻的音乐人才。",
"A good mentor can nurture a student's confidence.",
"一位好导师能够培养学生的自信心。",
"https://www.oxfordlearnersdictionaries.com/definition/english/nurture"
],
[
"batch",
"名词 · 一批",
"指作为一组处理或同次生产的东西，常用 a batch of；不强调每个成员完全相同。",
"We baked a fresh batch of rolls for lunch.",
"我们为午餐烤了新一批小面包。",
"The next batch of forms will be checked tomorrow.",
"下一批表格明天检查。",
"https://www.oxfordlearnersdictionaries.com/definition/english/batch"
],
[
"admiration",
"名词 · 钦佩",
"表示对人或事物的尊重赞赏时通常不可数；admiration for 后接钦佩的对象。",
"She expressed admiration for the team's patience.",
"她表达了对团队耐心的钦佩。",
"I watched his careful work with admiration.",
"我钦佩地看着他细致工作。",
"https://www.oxfordlearnersdictionaries.com/definition/english/admiration"
],
[
"constrain",
"动词 · 限制",
"表示条件迫使或限制行为，可用 constrain someone to do；不等于自愿决定，须有制约因素。",
"Limited space may constrain the size of the exhibition.",
"有限的空间可能限制展览规模。",
"We should not let the old layout constrain our ideas.",
"我们不应让旧布局限制我们的想法。",
"https://www.oxfordlearnersdictionaries.com/definition/english/constrain"
],
[
"bulletin",
"名词 · 新闻简报；公告",
"指简短新闻播报或正式信息通告，可数；a bulletin 通常不是一份完整日报的全部内容。",
"The radio bulletin warned of heavy snow.",
"电台新闻简报警告将有大雪。",
"A safety bulletin was posted beside the workshop door.",
"工作间门旁贴了一份安全公告。",
"https://www.oxfordlearnersdictionaries.com/definition/english/bulletin"
],
[
"feminine",
"形容词 · 女性化的",
"此处描述被某文化认为与女性有关的风格或特点，并非所有女性的固定性质；语法阴性是另一义项。",
"The designer described the style as feminine and romantic.",
"设计师把这种风格描述为女性化而浪漫。",
"The costume combines traditionally feminine details with heavy boots.",
"这套服装把传统上被视为女性化的细节与厚重靴子搭配起来。",
"https://www.oxfordlearnersdictionaries.com/definition/english/feminine"
],
[
"vocational",
"形容词 · 职业技能的",
"用于为特定工作培养知识和技能的教育或培训；不等于所有与学校相关的 academic 内容。",
"The college offers vocational training in plumbing.",
"学院提供管道安装维修的职业培训。",
"She chose a vocational course in furniture making.",
"她选择了一门家具制作职业课程。",
"https://www.oxfordlearnersdictionaries.com/definition/english/vocational"
],
[
"arc",
"名词 · 弧线",
"指圆周的一部分或弯曲形状，可数；不要求所有日常所说的 arc 都是精确数学圆弧。",
"The ball traveled in a high arc over the net.",
"球沿一道高弧线越过球网。",
"Draw an arc between the two marked points.",
"在两个标记点之间画一条弧线。",
"https://www.oxfordlearnersdictionaries.com/definition/english/arc"
],
[
"denounce",
"动词 · 公开谴责",
"表示强烈而公开地批评不当行为，直接接对象；语气比普通不同意或评价更强烈。",
"The group issued a statement to denounce the violence.",
"该团体发表声明谴责暴力。",
"Several speakers rose to denounce the unfair rules.",
"几位发言者起身谴责不公平的规则。",
"https://www.oxfordlearnersdictionaries.com/definition/english/denounce"
],
[
"royalty",
"名词 · 王室成员",
"指王室成员整体时通常不可数；royalties 表版税的义项另作理解，不能仅凭词尾推断同义。",
"The palace has welcomed royalty from several countries.",
"这座宫殿曾接待过来自多个国家的王室成员。",
"The exhibition explores the relationship between royalty and portrait painting.",
"这场展览探讨王室与肖像画之间的关系。",
"https://www.oxfordlearnersdictionaries.com/definition/english/royalty"
],
[
"trolley",
"名词 · 手推车",
"常指搬运购物品、行李等的小轮车，英式英语常用；美式常见 cart，须依具体场景选择。",
"Please return the trolley to the entrance.",
"请把手推车送回入口。",
"We loaded the equipment onto a trolley.",
"我们把设备装上了手推车。",
"https://www.oxfordlearnersdictionaries.com/definition/english/trolley"
],
[
"disposition",
"名词 · 性情",
"指个人较稳定的性格倾向，常见 a cheerful disposition；不是临时的一次心情变化。",
"The dog has a gentle disposition.",
"这只狗性情温和。",
"Her cheerful disposition helped the team through difficult days.",
"她开朗的性情帮助团队度过困难的日子。",
"https://www.oxfordlearnersdictionaries.com/definition/english/disposition"
],
[
"decorative",
"形容词 · 装饰性的",
"表示主要用于美观或增添装饰效果，修饰图案、物品等；不自动表示完全没有实用功能。",
"The bowl has a decorative blue border.",
"碗边有一道蓝色装饰花纹。",
"These tiles are decorative rather than structural.",
"这些砖用于装饰而非承担结构作用。",
"https://www.oxfordlearnersdictionaries.com/definition/english/decorative"
],
[
"stereo",
"形容词 · 立体声的",
"描述使用分开的声道和扬声器来再现声场的音响方式；不等于仅把音量调大。",
"The recording is available in stereo sound.",
"这段录音有立体声版本。",
"She connected a pair of stereo speakers to the player.",
"她把一对立体声扬声器连接到播放器。",
"https://www.oxfordlearnersdictionaries.com/definition/english/stereo"
],
[
"bald",
"形容词 · 秃顶的",
"形容头部没有或几乎没有头发，可说 go bald；不应把发型短简单等同于秃顶。",
"The actor wore makeup to appear bald.",
"演员化妆使自己看起来秃顶。",
"He began to go bald in his thirties.",
"他三十多岁开始秃顶。",
"https://www.oxfordlearnersdictionaries.com/definition/english/bald"
],
[
"fluctuation",
"名词 · 波动",
"指数量、程度等上下变化，可数；不同于只向单一方向持续增长，需要观察变化过程。",
"A small fluctuation in temperature affected the measurement.",
"温度的一次小幅波动影响了测量。",
"The graph shows a seasonal fluctuation in demand.",
"图表显示了需求的季节性波动。",
"https://www.oxfordlearnersdictionaries.com/definition/english/fluctuation"
],
[
"incapable",
"形容词 · 不能的",
"通常用 incapable of 加名词或动名词，说明没有做某事的能力；不要写成 incapable to do。",
"The damaged pump is incapable of supplying enough water.",
"受损的水泵无法供应足够的水。",
"He seemed incapable of sitting still for five minutes.",
"他似乎连五分钟都坐不住。",
"https://www.oxfordlearnersdictionaries.com/definition/english/incapable"
],
[
"remnant",
"名词 · 剩余部分",
"指其余部分消失或被用掉后留下的小部分，常用 a remnant of；不等于完整保留的整体。",
"A remnant of the old wall survives behind the shop.",
"商店后面还留着旧墙的一部分。",
"She made a cushion from a fabric remnant.",
"她用一块剩余布料做了一个靠垫。",
"https://www.oxfordlearnersdictionaries.com/definition/english/remnant"
],
[
"escort",
"名词 · 护送者",
"指陪同别人以保护或看守的人或队伍，可用 under escort；不一定表示双方是朋友关系。",
"The visitors entered the restricted area with an escort.",
"来访者在护送人员陪同下进入了限制区域。",
"A police escort led the convoy through the city.",
"一支警察护卫队引导车队穿过城市。",
"https://www.oxfordlearnersdictionaries.com/definition/english/escort"
],
[
"cruelty",
"名词 · 残忍",
"表示故意使人或动物身心受苦的行为时通常不可数；不是所有无意造成的不便都称作残忍。",
"The organization campaigns against cruelty to animals.",
"该组织开展反对虐待动物的活动。",
"The story contrasts acts of cruelty with unexpected kindness.",
"故事把残忍行为与出人意料的善意作对比。",
"https://www.oxfordlearnersdictionaries.com/definition/english/cruelty"
],
[
"paradox",
"名词 · 悖论；矛盾现象",
"指表面上相互矛盾却可能成立的说法或情况，可数；不能把任意错误陈述都当成悖论。",
"It is a paradox that greater choice can make decisions harder.",
"选择越多却可能越难决定，这是一种矛盾现象。",
"The lecture began with a famous logical paradox.",
"讲座以一个著名的逻辑悖论开场。",
"https://www.oxfordlearnersdictionaries.com/definition/english/paradox"
],
[
"sermon",
"名词 · 布道",
"指宗教仪式中讲述信仰或道德的讲话，可数；日常也可带批评意味地指长篇说教。",
"The sermon focused on kindness to strangers.",
"布道的主题是善待陌生人。",
"She listened to a sermon in the village church.",
"她在村里教堂听了一场布道。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sermon"
],
[
"goddess",
"名词 · 女神",
"指神话或宗教中的女性神祇，可数；形容现实人物的引申用法需结合语境，不是普通职业称谓。",
"The statue represents a goddess of wisdom.",
"这座雕像代表一位智慧女神。",
"The tale describes a goddess protecting the island.",
"这个传说描述了一位守护岛屿的女神。",
"https://www.oxfordlearnersdictionaries.com/definition/english/goddess"
],
[
"jealousy",
"名词 · 嫉妒",
"指担心失去所爱或羡妒别人优势的感受，通常不可数；不等同于合理的竞争行为。",
"His jealousy grew when his colleague received the award.",
"同事获奖时，他的嫉妒感加重了。",
"The novel explores how jealousy can damage a friendship.",
"小说探讨嫉妒如何破坏友谊。",
"https://www.oxfordlearnersdictionaries.com/definition/english/jealousy"
],
[
"heave",
"动词 · 用力提起",
"表示费很大力气抬、拉或扔重物，可直接接对象；不宜用于轻轻拿起一张纸等动作。",
"Together they managed to heave the chest onto the cart.",
"他们合力终于把箱子抬上了推车。",
"We had to heave the wet sail over the railing.",
"我们不得不用力把湿帆扛过栏杆。",
"https://www.oxfordlearnersdictionaries.com/definition/english/heave"
],
[
"millionaire",
"名词 · 百万富翁",
"指拥有至少百万单位某种货币财富的人，可数；具体币种和资产计算需看语境，不能仅凭生活外表判断。",
"The millionaire funded a new public library.",
"这位百万富翁资助了一座新公共图书馆。",
"The novel follows a millionaire who returns to his hometown.",
"小说讲述了一位百万富翁返回故乡的故事。",
"https://www.oxfordlearnersdictionaries.com/definition/english/millionaire"
],
[
"compliment",
"名词 · 赞美的话",
"是表示赞赏的评论，可数；pay someone a compliment 表赞美，注意与表示补足的 complement 区别。",
"She accepted the compliment with a smile.",
"她微笑着接受了赞美。",
"That is a lovely compliment to receive after so much work.",
"付出那么多努力后收到这样的赞美真好。",
"https://www.oxfordlearnersdictionaries.com/definition/english/compliment"
],
[
"unlock",
"动词 · 开锁",
"通常指用钥匙等打开锁，直接接门、设备等；也可比喻开启潜力，但本条例句限定解除锁定。",
"Use this key to unlock the side gate.",
"用这把钥匙打开侧门。",
"You can unlock the screen with a fingerprint.",
"你可以用指纹解锁屏幕。",
"https://www.oxfordlearnersdictionaries.com/definition/english/unlock"
],
[
"endeavour",
"名词 · 努力；尝试",
"是英式拼写，美式常写 endeavor；表示为达目标进行的认真尝试，可用 an endeavour to do。",
"The project is a joint endeavour by two schools.",
"这个项目是两所学校的共同努力。",
"Her endeavour to restore the garden took several years.",
"她为修复花园作出的努力持续了好几年。",
"https://www.oxfordlearnersdictionaries.com/definition/english/endeavour"
],
[
"slack",
"形容词 · 松弛的",
"此处形容绳索等没有拉紧，常与 rope 等搭配；描述生意清淡或工作松懈是其他义项。",
"The rope was too slack to support the canvas.",
"绳子太松，撑不住帆布。",
"Keep the cable slack while you adjust the bracket.",
"调整支架时让电缆保持松弛。",
"https://www.oxfordlearnersdictionaries.com/definition/english/slack"
],
[
"apt",
"形容词 · 恰当的",
"形容词语、例子等适合具体情境；be apt to do 另表示容易或倾向于做某事，不宜混淆。",
"Her comparison was apt and easy to understand.",
"她的比喻恰当且容易理解。",
"That is an apt title for a story about missed opportunities.",
"对一个讲述错失机会的故事来说，这是个恰当的标题。",
"https://www.oxfordlearnersdictionaries.com/definition/english/apt"
],
[
"alas",
"感叹词 · 唉；可惜",
"表示遗憾或悲伤，带较强文学或诙谐色彩；在普通事务沟通中不宜过度使用。",
"Alas, the last train had already left.",
"可惜，最后一班火车已经离开了。",
"The flowers were beautiful but, alas, short-lived.",
"花很美，但可惜花期很短。",
"https://www.oxfordlearnersdictionaries.com/definition/english/alas"
],
[
"hymn",
"名词 · 赞美诗",
"指宗教仪式中颂扬神的歌曲，可数；不等于任何情绪庄重的流行歌曲。",
"The service ended with a familiar hymn.",
"礼拜以一首熟悉的赞美诗结束。",
"A choir sang a hymn in the small chapel.",
"合唱团在小礼拜堂唱了一首赞美诗。",
"https://www.oxfordlearnersdictionaries.com/definition/english/hymn"
],
[
"maternity",
"名词 · 母亲身份",
"常作名词修饰语出现在 maternity leave、maternity ward 中，表示与成为母亲或生育有关。",
"She returned to work after maternity leave.",
"她休完产假后回去工作了。",
"The hospital opened a new maternity ward.",
"医院开设了新的产科病房。",
"https://www.oxfordlearnersdictionaries.com/definition/english/maternity"
],
[
"footpath",
"名词 · 人行小路",
"英式英语中常指供人步行的小径，尤其在乡间；某些地区也指路边人行道，需看场景。",
"A public footpath crosses the field.",
"一条公共步道穿过田野。",
"Follow the footpath beside the stream.",
"沿着溪边的小路走。",
"https://www.oxfordlearnersdictionaries.com/definition/english/footpath"
],
[
"huddle",
"动词 · 挤在一起",
"通常指因寒冷、害怕等靠拢成团，常用 huddle together；与有序站队的含义不同。",
"The children huddle together beneath the awning.",
"孩子们挤在雨篷下。",
"She watched the sheep huddle against the stone wall.",
"她看着羊群挤靠在石墙旁。",
"https://www.oxfordlearnersdictionaries.com/definition/english/huddle"
],
[
"provocative",
"形容词 · 挑衅的；引发争论的",
"形容言论或行为刻意激起情绪或争论，常带负面意味；也可能指激发思考，要看具体目的。",
"His provocative remark interrupted the calm discussion.",
"他的挑衅性评论打断了平静的讨论。",
"The essay asks a provocative question about ownership.",
"这篇文章提出了一个关于所有权的争议性问题。",
"https://www.oxfordlearnersdictionaries.com/definition/english/provocative"
],
[
"renovation",
"名词 · 翻新",
"指修复、重新粉刷等使旧建筑或家具恢复良好状态的过程；不一定表示推倒重新建造。",
"The theater closed for renovation in spring.",
"剧院春季因翻新而关闭。",
"The renovation preserved the building's original staircase.",
"这次翻新保留了建筑原有的楼梯。",
"https://www.oxfordlearnersdictionaries.com/definition/english/renovation"
],
[
"scripture",
"名词 · 宗教经典",
"可指宗教的神圣经文；在基督教语境常特指圣经，是否大写及复数形式依指称范围而定。",
"The lecture compared interpretations of scripture.",
"讲座比较了对宗教经典的不同解释。",
"The manuscript contains passages from scripture.",
"手稿中有若干经文段落。",
"https://www.oxfordlearnersdictionaries.com/definition/english/scripture"
],
[
"lipstick",
"名词 · 口红",
"表示涂在嘴唇上的化妆品时可不可数；说一支产品时也可用 a lipstick，不能泛指所有化妆品。",
"There was lipstick on the rim of the cup.",
"杯沿上有口红印。",
"She chose a lipstick that matched her scarf.",
"她选了一支与围巾相配的口红。",
"https://www.oxfordlearnersdictionaries.com/definition/english/lipstick"
],
[
"alleviate",
"动词 · 减轻",
"指降低痛苦、压力或问题的严重程度，直接接对象；不表示问题已经完全消除。",
"Extra buses may alleviate overcrowding on this route.",
"增开公交车可能缓解这条线路的拥挤。",
"The new schedule should alleviate pressure on the staff.",
"新时间安排应该能减轻员工的压力。",
"https://www.oxfordlearnersdictionaries.com/definition/english/alleviate"
],
[
"seaside",
"名词 · 海边",
"the seaside 常指供人休闲度假的海滨地区，前面通常有 the；不等同于具体某一片沙滩。",
"We spent the weekend at the seaside.",
"我们在海边度过了周末。",
"The train takes families to the seaside in summer.",
"夏天这班火车载着家庭游客去海滨。",
"https://www.oxfordlearnersdictionaries.com/definition/english/seaside"
],
[
"vigour",
"名词 · 活力；干劲",
"是英式拼写，美式常写 vigor；通常不可数，with vigour 表示充满精力地行动。",
"He approached the task with renewed vigour.",
"他以重新焕发的干劲投入这项任务。",
"The young plants grew with surprising vigour.",
"这些幼苗生长得十分旺盛。",
"https://www.oxfordlearnersdictionaries.com/definition/english/vigour"
],
[
"beware",
"动词 · 当心",
"常用于警告，beware of 后接危险来源；不是普通的观察动作，也不常像一般动词那样变化时态。",
"Beware of loose stones on the path.",
"小心路上松动的石头。",
"The sign tells swimmers to beware of strong currents.",
"标牌提醒游泳者当心强劲水流。",
"https://www.oxfordlearnersdictionaries.com/definition/english/beware"
],
[
"lining",
"名词 · 衬里",
"指衣服、袋子等内侧的一层材料，可数；也可指器官内壁组织，本条例句限物品衬里。",
"The coat has a warm wool lining.",
"这件外套有保暖的羊毛衬里。",
"A tear in the lining exposed the inside of the bag.",
"衬里的裂口露出了包的内部。",
"https://www.oxfordlearnersdictionaries.com/definition/english/lining"
],
[
"periodic",
"形容词 · 周期性的；定期的",
"表示间隔一段时间重复发生，常见 periodic checks；不必然说明每次间隔完全相同。",
"The equipment needs periodic safety checks.",
"设备需要定期安全检查。",
"The report records periodic changes in river flow.",
"报告记录了河流流量的周期性变化。",
"https://www.oxfordlearnersdictionaries.com/definition/english/periodic"
],
[
"unpaid",
"形容词 · 未支付的",
"可修饰尚未结清的账单，也可指没有报酬的工作；应根据名词区分欠款与无薪。",
"An unpaid invoice was attached to the letter.",
"信中附着一张未支付的发票。",
"She took unpaid leave to care for a relative.",
"她请了无薪假照顾亲属。",
"https://www.oxfordlearnersdictionaries.com/definition/english/unpaid"
],
[
"handbook",
"名词 · 手册",
"指提供某主题实用信息或操作说明的书，可数；不表示所有能拿在手里的书。",
"The handbook explains how to report a fault.",
"手册说明了如何报告故障。",
"Keep the safety handbook near the workbench.",
"把安全手册放在工作台附近。",
"https://www.oxfordlearnersdictionaries.com/definition/english/handbook"
],
[
"uranium",
"名词 · 铀",
"是化学元素名称，符号 U，通常不可数；不能把所有放射性物质都叫作 uranium。",
"The sample contained traces of uranium.",
"样本中含有微量铀。",
"The lesson introduced uranium as a naturally occurring element.",
"这堂课介绍铀是一种天然存在的元素。",
"https://www.oxfordlearnersdictionaries.com/definition/english/uranium"
],
[
"temperament",
"名词 · 性情",
"描述人或动物较稳定的性格特点，常说 a calm temperament；不同于因一次事件产生的短暂情绪。",
"The horse has a calm temperament.",
"这匹马性情温和。",
"Her temperament suits work that requires patience.",
"她的性情适合需要耐心的工作。",
"https://www.oxfordlearnersdictionaries.com/definition/english/temperament"
],
[
"squat",
"动词 · 蹲下",
"指屈膝、身体压低靠近脚跟的姿势，常接 down；另有擅自占用房屋义，本条不涉及。",
"Squat down to look beneath the shelf.",
"蹲下来看看架子下面。",
"We had to squat beside the low cave entrance.",
"我们不得不蹲在低矮的洞口旁。",
"https://www.oxfordlearnersdictionaries.com/definition/english/squat"
],
[
"roundabout",
"名词 · 环岛",
"英式英语中指车辆沿同一方向绕行的圆形路口，可数；不是任何弯曲的普通道路。",
"Take the second exit at the roundabout.",
"在环岛的第二个出口驶出。",
"Traffic slowed as we approached the roundabout.",
"接近环岛时车流慢了下来。",
"https://www.oxfordlearnersdictionaries.com/definition/english/roundabout"
],
[
"unwilling",
"形容词 · 不愿意的",
"常用 be unwilling to do 表示不愿做某事；与 unable 的无能力不同，重点在意愿。",
"She was unwilling to sign without reading the agreement.",
"她不愿在读协议前签字。",
"The owners seemed unwilling to discuss a lower price.",
"业主似乎不愿讨论更低的价格。",
"https://www.oxfordlearnersdictionaries.com/definition/english/unwilling"
],
[
"crime",
"名词 · 罪行",
"泛指犯罪活动时通常不可数，指某一具体犯罪行为则可数；不是所有失礼行为都构成 crime。",
"The novel begins with a crime in a quiet village.",
"小说以一个宁静村庄里的犯罪事件开场。",
"The report examines crime in the city center.",
"报告研究了市中心的犯罪情况。",
"https://www.oxfordlearnersdictionaries.com/definition/english/crime"
],
[
"substance",
"名词 · 物质",
"指有特定性质的固体、液体或气体，可数；不要因另有毒品义便把任何 substance 都理解为毒品。",
"The label names each substance in the mixture.",
"标签列出了混合物中的每一种物质。",
"A sticky substance covered the inside of the pipe.",
"管道内壁覆盖着一种黏稠物质。",
"https://www.oxfordlearnersdictionaries.com/definition/english/substance"
],
[
"rescue",
"动词 · 营救",
"表示使人或物脱离危险，常用 rescue someone from；不必然表示救援已经成功完成，需看时态。",
"Firefighters worked to rescue the trapped dog.",
"消防员努力营救被困的小狗。",
"Volunteers helped rescue books from the flooded library.",
"志愿者帮助从被淹图书馆中抢救书籍。",
"https://www.oxfordlearnersdictionaries.com/definition/english/rescue"
],
[
"prey",
"名词 · 猎物",
"指被其他动物捕杀食用的动物，通常不可数；常用 birds of prey 表猛禽，不用一个 prey 数数。",
"The owl waited quietly for its prey.",
"猫头鹰安静地等待猎物。",
"Small fish are prey for larger animals.",
"小鱼是较大动物的猎物。",
"https://www.oxfordlearnersdictionaries.com/definition/english/prey"
],
[
"conduct",
"动词 · 进行；组织",
"本条指开展调查、实验等活动，后直接接名词；动词重音通常在后，与名词行为的重音不同。",
"The students will conduct a survey of local traffic.",
"学生们将开展一次当地交通调查。",
"We need to conduct another test before opening the pool.",
"开放泳池前我们需要再做一次测试。",
"https://www.oxfordlearnersdictionaries.com/definition/english/conduct"
],
[
"mechanic",
"名词 · 机械维修工",
"常指修理车辆发动机等的专业人员，可数；与 mechanics 的力学或运作原理义不同。",
"A mechanic checked the brakes before the trip.",
"出发前一名机修工检查了刹车。",
"The mechanic explained why the engine was overheating.",
"机修工解释了发动机为什么过热。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mechanic"
],
[
"so-called",
"形容词 · 所谓的",
"可引出人们通常使用的名称，也可表示对该称呼的怀疑；后一用法可能带讽刺，不能无差别用于礼貌称谓。",
"The so-called express service took three days.",
"所谓的加急服务花了三天。",
"His so-called solution created two more problems.",
"他所谓的解决办法又造成了两个问题。",
"https://www.oxfordlearnersdictionaries.com/definition/english/so-called"
],
[
"organization",
"名词 · 组织；机构",
"表示有共同目标的团体时可数，表示安排事务的过程时常不可数；本条限定机构义。",
"The organization runs free classes for adults.",
"这个组织开办免费的成人课程。",
"A local organization helped repair the playground.",
"一个当地组织帮助修复了游乐场。",
"https://www.oxfordlearnersdictionaries.com/definition/english/organization"
],
[
"naturalist",
"名词 · 博物学家",
"指研究或观察动植物等自然生物的人，可数；不是表示裸体主义者的 naturist。",
"A naturalist guided us through the wetland.",
"一位博物学家带领我们穿过湿地。",
"The naturalist recorded every bird seen that morning.",
"那位博物学家记录了那天早晨看到的每一种鸟。",
"https://www.oxfordlearnersdictionaries.com/definition/english/naturalist"
],
[
"undesirable",
"形容词 · 不受欢迎的",
"描述不希望出现、可能造成问题的情况或结果；表示评价而不是客观说明不可能发生。",
"The plan could have undesirable effects on nearby streams.",
"该计划可能对附近溪流产生不良影响。",
"We removed an undesirable ingredient from the recipe.",
"我们从配方中去掉了一种不想使用的原料。",
"https://www.oxfordlearnersdictionaries.com/definition/english/undesirable"
],
[
"seize",
"动词 · 抓住",
"表示突然用力抓取，也可指夺取控制权；seize an opportunity 是把握机会，不是字面用手抓。",
"He tried to seize the rope before it slipped away.",
"他试图在绳子滑走前抓住它。",
"The officer moved to seize the weapon.",
"警员上前夺取武器。",
"https://www.oxfordlearnersdictionaries.com/definition/english/seize"
],
[
"recommend",
"动词 · 推荐；建议",
"推荐物品可直接接名词，建议行动可接动名词；不要把 recommend someone to do 当作唯一通用结构。",
"Can you recommend a quiet cafe near the station?",
"你能推荐车站附近一家安静的咖啡馆吗？",
"I recommend booking a seat in advance.",
"我建议提前订座。",
"https://www.oxfordlearnersdictionaries.com/definition/english/recommend"
],
[
"millimeter",
"名词 · 毫米",
"是美式拼写，英式常写 millimetre；一毫米为千分之一米，可数，数量大于一时用复数。",
"The gap was less than a millimeter wide.",
"缝隙宽度不到一毫米。",
"A single millimeter can make a difference in this design.",
"在这个设计里，一毫米就会造成差别。",
"https://dictionary.cambridge.org/dictionary/english/millimeter"
],
[
"conform",
"动词 · 遵守；符合",
"conform to 后接规定、标准或惯例；表示人的行为也可指顺应群体，不用直接把规则作宾语。",
"All labels must conform to the new standard.",
"所有标签都必须符合新标准。",
"He refused to conform to the group's expectations.",
"他拒绝迎合这个群体的期待。",
"https://www.oxfordlearnersdictionaries.com/definition/english/conform"
],
[
"necessarily",
"副词 · 必然地",
"not necessarily 表示不一定，是保留可能性而非彻底否定；不要把它译成一定不。",
"A higher price does not necessarily mean better quality.",
"价格更高不一定意味着质量更好。",
"The two events are not necessarily connected.",
"这两件事不一定有关联。",
"https://www.oxfordlearnersdictionaries.com/definition/english/necessarily"
],
[
"structural",
"形容词 · 结构的",
"用于建筑承重构造或组织体系等，强调组成方式；表面装饰变化不一定是 structural change。",
"The engineer inspected the wall for structural damage.",
"工程师检查墙体有无结构损坏。",
"The company announced a structural change to its departments.",
"公司宣布对部门结构作出调整。",
"https://www.oxfordlearnersdictionaries.com/definition/english/structural"
],
[
"finalize",
"动词 · 最后确定",
"指完成计划、协议等的最后安排，是美式常见拼写；不同于刚提出供讨论的初步方案。",
"We will finalize the guest list tomorrow.",
"我们明天会最终确定宾客名单。",
"Please finalize the design before ordering materials.",
"订购材料前请最终确定设计。",
"https://www.oxfordlearnersdictionaries.com/definition/english/finalize"
],
[
"settler",
"名词 · 定居者",
"指到一个新地区定居的人，可数；历史语境须结合当地原有人口理解，不表示该地此前无人居住。",
"The diary describes a settler's first winter in the valley.",
"日记描写了一位定居者在山谷度过的第一个冬天。",
"A settler built the farmhouse beside the river.",
"一位定居者在河边建了这座农舍。",
"https://www.oxfordlearnersdictionaries.com/definition/english/settler"
],
[
"marker",
"名词 · 标记物",
"指显示位置或特征的物体，可数；也可指记号笔，本条限定指示位置的实物标记。",
"A wooden marker shows where the trail begins.",
"一个木标记指示小路的起点。",
"Place a marker beside the deepest part of the pool.",
"在池子最深处旁边放一个标记物。",
"https://www.oxfordlearnersdictionaries.com/definition/english/marker"
],
[
"presidential",
"形容词 · 总统的",
"描述与总统职位、活动或选举有关的事物；不应用它泛指所有类型领导人的工作。",
"The archive holds records of presidential speeches.",
"档案馆保存着总统演讲的记录。",
"The class discussed the rules of a presidential election.",
"全班讨论了总统选举的规则。",
"https://www.oxfordlearnersdictionaries.com/definition/english/presidential"
],
[
"expectation",
"名词 · 预期",
"指认为某事将发生的想法，常用 expectation of 或 that 从句；预期不等于已经承诺。",
"There is an expectation that the work will finish soon.",
"人们预期工作很快就会完成。",
"The result exceeded our expectation of a modest improvement.",
"这个结果超出了我们仅会略有改善的预期。",
"https://www.oxfordlearnersdictionaries.com/definition/english/expectation"
],
[
"section",
"名词 · 部分；章节",
"指整体分成的某一部分，可数；a section of 后可接书、道路、建筑等，需按整体判断。",
"Read the section on safety before using the tool.",
"使用工具前先阅读安全章节。",
"One section of the path is closed for repairs.",
"小路有一段正在关闭维修。",
"https://www.oxfordlearnersdictionaries.com/definition/english/section"
],
[
"representative",
"名词 · 代表",
"指被选来替个人或群体发言、投票的人，可数；不是所有群体成员都自动具有代表资格。",
"Each class chose a representative for the meeting.",
"每个班选出一名代表参加会议。",
"A representative from the library answered our questions.",
"图书馆的一位代表回答了我们的问题。",
"https://www.oxfordlearnersdictionaries.com/definition/english/representative"
],
[
"ideally",
"副词 · 理想情况下",
"常在句首表示最希望达到的安排，也可表示完全适合；不能把理想条件误当作实际保证。",
"Ideally, the repairs should finish before winter.",
"理想情况下，修理应在冬天前完成。",
"The hall is ideally suited to small concerts.",
"这座大厅非常适合举办小型音乐会。",
"https://www.oxfordlearnersdictionaries.com/definition/english/ideally"
],
[
"shrub",
"名词 · 灌木",
"指有多条木质茎、一般低于树木的植物，可数；不等同于所有幼小的树。",
"A flowering shrub grows beside the gate.",
"门旁长着一丛开花灌木。",
"This shrub keeps its leaves through winter.",
"这种灌木整个冬天都保留叶子。",
"https://www.oxfordlearnersdictionaries.com/definition/english/shrub"
],
[
"revise",
"动词 · 修订",
"表示根据新情况修改计划、文字等，直接接被修改内容；英式英语还有复习功课义。",
"We need to revise the schedule after the delay.",
"延误后我们需要修改时间表。",
"Please revise the final paragraph to make the argument clearer.",
"请修改最后一段，让论点更清楚。",
"https://www.oxfordlearnersdictionaries.com/definition/english/revise"
],
[
"recipe",
"名词 · 食谱",
"指制作一道食物的配料及步骤，可数；a recipe for 后接菜肴名，不能用 receipt 代替。",
"This recipe uses yogurt instead of cream.",
"这份食谱用酸奶代替奶油。",
"Could you send me the recipe for your lemon cake?",
"你能把你做的柠檬蛋糕的食谱发给我吗？",
"https://www.oxfordlearnersdictionaries.com/definition/english/recipe"
],
[
"poverty",
"名词 · 贫困",
"指缺少维持基本生活所需资源的状态，通常不可数；常用 live in poverty、reduce poverty。",
"The program aims to reduce poverty in rural areas.",
"这个项目旨在减少农村地区的贫困。",
"The documentary follows a family living in poverty.",
"纪录片记录了一个生活贫困的家庭。",
"https://www.oxfordlearnersdictionaries.com/definition/english/poverty"
],
[
"intelligent",
"形容词 · 聪明的",
"形容学习、理解和推理能力较强的人或行为，常用 intelligent question；不等同于掌握某一具体事实。",
"She asked an intelligent question about the experiment.",
"她针对实验提出了一个很有见地的问题。",
"The trainer described the dog as intelligent and curious.",
"训练员说这只狗聪明又好奇。",
"https://www.oxfordlearnersdictionaries.com/definition/english/intelligent"
],
[
"impersonal",
"形容词 · 冷淡疏远的",
"形容环境或沟通缺乏人情味，使人觉得不受重视；语法中的非人称是另一用法。",
"The automated reply felt impersonal.",
"这条自动回复让人感到冷冰冰的。",
"The hotel lobby was large but rather impersonal.",
"酒店大堂很大，却颇缺人情味。",
"https://www.oxfordlearnersdictionaries.com/definition/english/impersonal"
],
[
"engage",
"动词 · 吸引住",
"engage someone's attention 或 interest 表示吸引并保持注意；engage in 则是参与活动，结构不同。",
"The opening scene should engage the audience's attention.",
"开场的一幕应该吸引观众注意。",
"These questions engage students in thinking about the evidence.",
"这些问题吸引学生思考证据。",
"https://www.oxfordlearnersdictionaries.com/definition/english/engage"
],
[
"span",
"动词 · 跨越",
"可直接接时间段，说明从头到尾涵盖这段时间；作名词时 a span of 是另一结构。",
"The letters span a period of forty years.",
"这些信件跨越了四十年。",
"Her research interests span several academic fields.",
"她的研究兴趣横跨多个学术领域。",
"https://www.oxfordlearnersdictionaries.com/definition/english/span"
],
[
"reintroduce",
"动词 · 重新引入",
"表示恢复使用或把曾经存在的物种引回，常用 reintroduce something to；前提是此前曾有过该事物。",
"The school plans to reintroduce evening classes.",
"学校计划重新开设夜间课程。",
"The project will reintroduce native plants to the wetland.",
"这个项目将把本地植物重新引入湿地。",
"https://www.oxfordlearnersdictionaries.com/definition/english/reintroduce"
],
[
"residential",
"形容词 · 住宅的",
"修饰 area 等表示主要供居住；修饰 course 等也可指寄宿式，需根据后面的名词判断。",
"The factory stands beside a residential area.",
"工厂位于一个住宅区旁边。",
"Heavy vehicles are restricted on residential streets.",
"住宅区街道限制重型车辆通行。",
"https://www.oxfordlearnersdictionaries.com/definition/english/residential"
],
[
"tunnel",
"名词 · 隧道",
"指穿过山体、地下或水下等的通道，可数；可用 through a tunnel 表示穿行其中。",
"The train slowed as it entered the tunnel.",
"火车进入隧道时减速了。",
"A narrow tunnel connects the two buildings.",
"一条狭窄隧道连接两栋建筑。",
"https://www.oxfordlearnersdictionaries.com/definition/english/tunnel"
],
[
"emperor",
"名词 · 皇帝",
"指帝国的统治者，是可数名词；不把所有国家的国王都称为 emperor，头衔需按历史背景理解。",
"The emperor ordered a new road through the mountains.",
"皇帝下令修建一条穿山新路。",
"The coin bears the portrait of an emperor.",
"硬币上有一位皇帝的肖像。",
"https://www.oxfordlearnersdictionaries.com/definition/english/emperor"
],
[
"talented",
"形容词 · 有才华的",
"描述在某方面有天赋或突出能力的人，常用 talented musician；说具体领域可用 talented at。",
"A talented pianist accompanied the choir.",
"一位有才华的钢琴家为合唱团伴奏。",
"The workshop brings talented young designers together.",
"工作坊把有才华的年轻设计师聚在一起。",
"https://www.oxfordlearnersdictionaries.com/definition/english/talented"
],
[
"remark",
"名词 · 评论；话语",
"指表达观点的一句话或评论，可数；make a remark about 表就某事发表评论，不是正式报告全文。",
"Her remark about the empty chair made us laugh.",
"她关于那把空椅子的一句话让我们笑了。",
"He made a brief remark before introducing the speaker.",
"他介绍演讲者前简短说了几句。",
"https://www.oxfordlearnersdictionaries.com/definition/english/remark"
],
[
"pant",
"动词 · 喘气",
"表示运动或炎热等导致短促快速呼吸，常用 pant for breath；与指裤子的复数 pants 需区分。",
"Dogs pant to help cool their bodies.",
"狗通过喘气帮助身体降温。",
"We began to pant halfway up the steep hill.",
"爬陡坡爬到一半，我们开始喘气。",
"https://www.oxfordlearnersdictionaries.com/definition/english/pant"
],
[
"sum",
"名词 · 总和",
"指相加得到的结果，常用 the sum of；另可指一笔钱，本条限定数学相加义。",
"The sum of the two numbers is twenty-four.",
"这两个数的和是二十四。",
"Check the sum before you enter it in the table.",
"把总和填入表格前先核对一下。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sum"
],
[
"crew",
"名词 · 全体工作人员",
"指船、飞机等上的工作人员整体，是集合名词；a crew member 表一名成员，乘客不包括在内。",
"The crew prepared the boat before sunrise.",
"船员们在日出前做好了船的准备工作。",
"A crew member showed us where to store our bags.",
"一名机组人员告诉我们把包存放在哪里。",
"https://www.oxfordlearnersdictionaries.com/definition/english/crew"
],
[
"trend",
"名词 · 趋势",
"指一段时间中的总体变化方向，可数；a trend towards 后接方向或状态，不是仅一次随机变化。",
"The figures show a trend towards smaller households.",
"这些数字显示家庭规模趋小的趋势。",
"We need more data before calling this a trend.",
"我们需要更多数据，才能把这称为趋势。",
"https://www.oxfordlearnersdictionaries.com/definition/english/trend"
],
[
"criticism",
"名词 · 批评",
"表示不赞同或指出不足时可泛指批评，也可用 a criticism 表一条意见；常接 of 指对象。",
"The design received criticism for its narrow entrance.",
"这个设计因入口狭窄而受到批评。",
"Her criticism focused on the lack of supporting evidence.",
"她的批评集中在缺少佐证这一点上。",
"https://www.oxfordlearnersdictionaries.com/definition/english/criticism"
],
[
"forum",
"名词 · 论坛",
"可指讨论公共议题的会议或网络空间，可数；a forum for 后接讨论或交流目的。",
"The school held a forum on safer travel.",
"学校举行了一场关于安全出行的论坛。",
"The online forum lets gardeners exchange advice.",
"这个网络论坛让园艺爱好者交流建议。",
"https://www.oxfordlearnersdictionaries.com/definition/english/forum"
],
[
"technician",
"名词 · 技术员",
"指负责专门设备操作维护的人员，可数；lab technician 表实验室技术员，不等同于所有科学研究者。",
"A technician checked the microphone before the talk.",
"技术员在演讲前检查了麦克风。",
"The technician replaced a damaged cable.",
"技术员更换了一根受损电缆。",
"https://www.oxfordlearnersdictionaries.com/definition/english/technician"
],
[
"starve",
"动词 · 挨饿",
"可表示因长期缺食而受苦甚至死亡，也能及物使某人挨饿；be starving 的口语夸张义需结合语境。",
"Without regular deliveries, the isolated community could starve.",
"如果没有定期物资运送，这个隔绝社区可能挨饿。",
"We cannot let the rescued animals starve.",
"我们不能让获救动物挨饿。",
"https://www.oxfordlearnersdictionaries.com/definition/english/starve"
],
[
"separately",
"副词 · 分别地",
"表示分开处理或不在一起，常修饰 store、pay 等动词；不表示两件事之间完全没有关系。",
"Please pack the glasses separately.",
"请把玻璃杯分开包装。",
"The tickets and meal vouchers are sold separately.",
"门票和餐券分别出售。",
"https://www.oxfordlearnersdictionaries.com/definition/english/separately"
],
[
"province",
"名词 · 省",
"指某些国家的行政区划单位，可数；the province of 后面可接地名，不能泛指所有国家的一级行政区。",
"The railway crosses the northern province.",
"这条铁路穿过北部省份。",
"Each province submits its own education report.",
"每个省提交自己的教育报告。",
"https://www.oxfordlearnersdictionaries.com/definition/english/province"
],
[
"pit",
"名词 · 坑",
"指地面上较大较深的洞，可数；a pit 用于物理坑洞，不应与任何浅色斑点等混同。",
"The workers dug a pit for the new foundation.",
"工人们为新地基挖了一个坑。",
"Rainwater collected in the pit overnight.",
"夜里雨水积在坑里。",
"https://www.oxfordlearnersdictionaries.com/definition/english/pit"
],
[
"foodstuff",
"名词 · 食品",
"是较正式的可数名词，常以复数 foodstuffs 统称食物原料或食品，日常对话通常用 food。",
"Rice is an important foodstuff in the region.",
"大米是这个地区的重要食品。",
"Each foodstuff was tested before entering storage.",
"每种食品入库前都经过检测。",
"https://www.oxfordlearnersdictionaries.com/definition/english/foodstuff"
],
[
"shift",
"名词 · 班次",
"本义指轮班工作中的一段时间，可用 work a night shift；不等于一次任何长度的工作任务。",
"Her shift begins at six in the morning.",
"她的班次早上六点开始。",
"He swapped a shift with a colleague.",
"他和同事换了一个班。",
"https://www.oxfordlearnersdictionaries.com/definition/english/shift"
],
[
"immature",
"形容词 · 不成熟的",
"可描述行为不够稳重或生物尚未发育完成；本条例句展示这两种范围，需按主语判断。",
"That immature response made the discussion harder.",
"那种不成熟的反应让讨论更困难。",
"The immature fruit was still hard and green.",
"未成熟的果实仍然又硬又绿。",
"https://www.oxfordlearnersdictionaries.com/definition/english/immature"
],
[
"mixture",
"名词 · 混合物",
"指不同成分结合的物质，常用 a mixture of A and B；可数时表示一份或一种混合物。",
"Pour the mixture into a shallow dish.",
"把混合物倒入浅盘。",
"The soil is a mixture of sand and compost.",
"这种土壤是沙子与堆肥的混合物。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mixture"
],
[
"investigator",
"名词 · 调查员",
"指检查事故、案件等以查明事实的人，可数；调查员身份不表示一定属于警方。",
"The investigator photographed the damaged lock.",
"调查员拍下了受损门锁。",
"An independent investigator interviewed the witnesses.",
"一位独立调查员采访了目击者。",
"https://www.oxfordlearnersdictionaries.com/definition/english/investigator"
],
[
"pulse",
"名词 · 脉搏",
"指心脏跳动推动血液时可在手腕等处感到的规律搏动；常用 take someone's pulse 表测脉搏。",
"The nurse checked his pulse.",
"护士检查了他的脉搏。",
"Her pulse slowed after she rested.",
"她休息后脉搏慢了下来。",
"https://www.oxfordlearnersdictionaries.com/definition/english/pulse"
],
[
"devil",
"名词 · 魔鬼",
"在宗教或故事中指邪恶存在，可数；the Devil 可特指魔王，本条不把现实人物当作宗教存在。",
"The folktale describes a bargain with a devil.",
"这个民间故事描写了与魔鬼做交易。",
"A painted devil appears above the doorway.",
"门口上方画着一个魔鬼。",
"https://www.oxfordlearnersdictionaries.com/definition/english/devil"
],
[
"panel",
"名词 · 面板",
"指平整的板块，常是门、墙或设备的一部分；控制面板常用 control panel，不同于专家小组义。",
"The carpenter replaced a cracked wooden panel.",
"木匠更换了一块裂开的木板。",
"A removable panel covers the wiring.",
"一块可拆卸面板覆盖着线路。",
"https://www.oxfordlearnersdictionaries.com/definition/english/panel"
],
[
"moral",
"形容词 · 道德的",
"修饰与对错、责任等有关的问题，如 moral duty；不等于法律强制，也不直接表示有道德的人。",
"The decision raises a difficult moral question.",
"这个决定引出了一个棘手的道德问题。",
"She felt a moral duty to tell the truth.",
"她觉得自己有道义责任说出真相。",
"https://www.oxfordlearnersdictionaries.com/definition/english/moral"
],
[
"beetle",
"名词 · 甲虫",
"指有硬质鞘翅覆盖飞行翅的昆虫，可数；不是任何黑色小昆虫都叫 beetle。",
"A green beetle crawled across the leaf.",
"一只绿色甲虫爬过叶面。",
"The guide showed us a beetle living under loose bark.",
"向导给我们看了一只住在松动树皮下的甲虫。",
"https://www.oxfordlearnersdictionaries.com/definition/english/beetle"
],
[
"profession",
"名词 · 专业职业",
"通常指需要专门训练或较高教育的职业，可数；the medical profession 还可统称医疗从业者。",
"She entered the teaching profession after university.",
"她大学毕业后进入了教师行业。",
"His profession requires years of practical training.",
"他的职业需要多年的实践训练。",
"https://www.oxfordlearnersdictionaries.com/definition/english/profession"
],
[
"odd",
"形容词 · 奇怪的",
"可描述不寻常、出人意料的事物，常用 it is odd that；数词中的奇数义是另一范围。",
"There was an odd smell near the radiator.",
"暖气片附近有一股奇怪的气味。",
"It seemed odd that no one had noticed the broken sign.",
"竟然没人注意到坏掉的标牌，这似乎有些奇怪。",
"https://www.oxfordlearnersdictionaries.com/definition/english/odd"
],
[
"resistant",
"形容词 · 耐……的",
"通常用 resistant to 加影响来源，表示能抵御；不代表在所有条件下完全不受损。",
"The fabric is resistant to stains.",
"这种布料耐污。",
"This variety is more resistant to cold than the others.",
"这个品种比其他品种更耐寒。",
"https://www.oxfordlearnersdictionaries.com/definition/english/resistant"
],
[
"gravity",
"名词 · 引力；重力",
"指物体之间的吸引作用，通常不可数；地面语境常译为重力，与严重性义须区分。",
"Gravity pulls the falling ball toward the ground.",
"重力使下落的球向地面运动。",
"The lesson compared gravity on Earth and the Moon.",
"这堂课比较了地球和月球上的重力。",
"https://www.oxfordlearnersdictionaries.com/definition/english/gravity"
],
[
"absence",
"名词 · 缺席；缺乏",
"someone's absence 表某人不在，absence of 表某物缺乏；in the absence of 可说明没有某条件。",
"Her absence from the meeting was unexpected.",
"她缺席会议让人意外。",
"In the absence of clear evidence, we kept investigating.",
"在缺乏明确证据的情况下，我们继续调查。",
"https://www.oxfordlearnersdictionaries.com/definition/english/absence"
],
[
"commercial",
"形容词 · 商业的",
"修饰与商品买卖或盈利活动有关的事物；commercial success 常指市场表现，不表示艺术评价。",
"The building is intended for commercial use.",
"这栋建筑用于商业用途。",
"The film was a commercial success.",
"这部电影在商业上获得成功。",
"https://www.oxfordlearnersdictionaries.com/definition/english/commercial"
],
[
"confront",
"动词 · 面对；处理",
"confront a problem 表主动面对困难；be confronted with 表面临，注意主动与被动结构的介词区别。",
"We need to confront the problem before it grows.",
"我们需要在问题变大前正视它。",
"The report forced the council to confront the cost of repairs.",
"报告迫使议会面对维修费用问题。",
"https://www.oxfordlearnersdictionaries.com/definition/english/confront"
],
[
"unsatisfactory",
"形容词 · 不令人满意的",
"表示未达到要求或可接受标准，常见 unsatisfactory result；不必然表示一无是处。",
"The first test produced an unsatisfactory result.",
"第一次测试的结果不令人满意。",
"The manager considered the explanation unsatisfactory.",
"经理认为这个解释不能令人满意。",
"https://www.oxfordlearnersdictionaries.com/definition/english/unsatisfactory"
],
[
"crack",
"动词 · 裂开",
"表示表面出现裂纹，可及物或不及物；并不一定表示完全碎成几块，须看后续描述。",
"The glass may crack if it cools too quickly.",
"玻璃冷却过快可能裂开。",
"Do not crack the shell until the egg has cooled.",
"鸡蛋冷却前不要敲裂蛋壳。",
"https://www.oxfordlearnersdictionaries.com/definition/english/crack"
],
[
"modify",
"动词 · 修改",
"指为改善或适应需要作一定改变，直接接对象；通常不意味着完全换成另一事物。",
"We need to modify the handle for smaller hands.",
"我们需要调整把手以适合较小的手。",
"You can modify the settings after installation.",
"安装后你可以修改设置。",
"https://www.oxfordlearnersdictionaries.com/definition/english/modify"
],
[
"relocate",
"动词 · 搬迁",
"可不及物表示迁移，也可及物表示把某机构或人员迁走；relocate to 后接新地点。",
"The library plans to relocate to a larger building.",
"图书馆计划搬到更大的建筑。",
"We had to relocate the workshop during the repairs.",
"维修期间我们不得不搬迁工作间。",
"https://www.oxfordlearnersdictionaries.com/definition/english/relocate"
],
[
"reaction",
"名词 · 反应",
"指对事件的感受、话语或行为，常用 reaction to；化学反应另有专门范围，不能直接混用。",
"Her reaction to the news was one of relief.",
"她听到消息后如释重负。",
"We waited to hear the audience's reaction.",
"我们等着听观众的反应。",
"https://www.oxfordlearnersdictionaries.com/definition/english/reaction"
],
[
"mammal",
"名词 · 哺乳动物",
"指以乳汁哺育幼体的一类动物，可数；多数胎生但鸭嘴兽等例外，不能只用是否产卵判断。",
"The dolphin is a mammal that spends its life in water.",
"海豚是一种终生生活在水中的哺乳动物。",
"The bat is the only mammal in this display.",
"蝙蝠是这个展区唯一的哺乳动物。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mammal"
],
[
"predict",
"动词 · 预测",
"可接名词或 that 从句说明预计发生的事；根据证据作预测也不能理解为对未来的保证。",
"The model cannot predict every sudden change.",
"这个模型不能预测每一次突变。",
"Experts predict that demand will rise in summer.",
"专家预测需求将在夏季上升。",
"https://www.oxfordlearnersdictionaries.com/definition/english/predict"
],
[
"identify",
"动词 · 识别",
"可指认出对象是谁或是什么，常用 identify something as；identify with 表认同是另一结构。",
"Can you identify this bird from its song?",
"你能根据鸣叫辨认这是什么鸟吗？",
"The test helped identify the source of the leak.",
"这项测试帮助查明了泄漏源。",
"https://www.oxfordlearnersdictionaries.com/definition/english/identify"
],
[
"suck",
"动词 · 吮吸",
"指用嘴唇等吸入液体或含着吮吸，常用 suck through、suck on；口语贬义是另一义项。",
"The baby began to suck on the bottle.",
"婴儿开始吸奶瓶。",
"Use the tube to suck water from the shallow tray.",
"用管子把浅盘里的水吸出来。",
"https://www.oxfordlearnersdictionaries.com/definition/english/suck"
],
[
"molecule",
"名词 · 分子",
"指由原子构成的化学粒子，可数；a molecule of 后可接物质名，不能与单个原子概念混同。",
"A water molecule contains three atoms.",
"一个水分子含有三个原子。",
"The model shows how the molecule changes shape.",
"模型显示这个分子如何改变形状。",
"https://www.oxfordlearnersdictionaries.com/definition/english/molecule"
],
[
"newborn",
"形容词 · 新生的",
"通常修饰刚出生的婴儿或动物，newborn baby 是常见搭配；不用于一般的新物品。",
"The newborn lamb stayed close to its mother.",
"刚出生的小羊紧挨着母羊。",
"The nurse weighed the newborn baby.",
"护士给新生婴儿称了体重。",
"https://www.oxfordlearnersdictionaries.com/definition/english/newborn"
],
[
"evident",
"形容词 · 明显的",
"常用 be evident from 说明判断依据，或 it is evident that 引出显然的事实；与名词 evidence 区分。",
"Her relief was evident from her smile.",
"从她的笑容可以明显看出她松了口气。",
"It became evident that the map was out of date.",
"地图已经过时这一点变得明显了。",
"https://www.oxfordlearnersdictionaries.com/definition/english/evident"
],
[
"remote",
"形容词 · 偏远的",
"形容地点远离居民区或主要活动中心，常见 remote village；不只是指两个人暂时距离较远。",
"The clinic serves a remote mountain village.",
"这家诊所为一个偏远山村服务。",
"They spent the summer on a remote island.",
"他们在一个偏远岛屿上度过了夏天。",
"https://www.oxfordlearnersdictionaries.com/definition/english/remote"
],
[
"leisure",
"名词 · 闲暇",
"指工作学习之外可自由支配的时间，通常不可数；at your leisure 表有空时从容处理。",
"She spends much of her leisure reading history.",
"她把许多闲暇时间用于读历史。",
"You can explore the garden at your leisure.",
"你可以有空时从容游览花园。",
"https://www.oxfordlearnersdictionaries.com/definition/english/leisure"
],
[
"edition",
"名词 · 版本",
"指书刊某次出版的形式或经过修订的版本，可数；second edition 不等于同版本再次印刷。",
"The new edition includes a chapter on digital maps.",
"新版本增加了一章数字地图内容。",
"I borrowed an earlier edition from the library.",
"我从图书馆借了一个较早版本。",
"https://www.oxfordlearnersdictionaries.com/definition/english/edition"
],
[
"tempt",
"动词 · 诱使",
"常用 tempt someone to do，说明诱惑某人做某事；be tempted to do 也可表达很想尝试。",
"The discount may tempt customers to order more.",
"折扣可能诱使顾客多订一些。",
"Do not let the sunshine tempt you to leave your coat behind.",
"不要因为阳光好就忍不住不带外套。",
"https://www.oxfordlearnersdictionaries.com/definition/english/tempt"
],
[
"fossil",
"名词 · 化石",
"指古代生物遗体或痕迹在地层中保存形成的遗存，可数；本条采用自然科学义，不用于贬称老人。",
"The fossil shows the outline of a leaf.",
"这块化石显示出一片叶子的轮廓。",
"A student found a fossil beside the cliff path.",
"一名学生在崖边小路旁发现了一块化石。",
"https://www.oxfordlearnersdictionaries.com/definition/english/fossil"
],
[
"minority",
"名词 · 少数",
"指群体中不足一半的部分，常用 a minority of；也可指少数群体，不能自动理解为人数极少。",
"Only a minority of residents opposed the plan.",
"只有少数居民反对该计划。",
"The proposal was supported by a small minority.",
"只有一小部分人支持该提案。",
"https://www.oxfordlearnersdictionaries.com/definition/english/minority"
],
[
"convey",
"动词 · 传达",
"直接接感受、意义或信息，convey something to someone 表传达给谁；本条不用运输义。",
"The photograph can convey a sense of isolation.",
"这张照片能传达一种孤独感。",
"We tried to convey our thanks to the volunteers.",
"我们努力向志愿者表达谢意。",
"https://www.oxfordlearnersdictionaries.com/definition/english/convey"
],
[
"critic",
"名词 · 评论家",
"指专门评判书籍、电影或艺术作品的人，可数；也可指批评者，并非每次都表示强烈反对。",
"A film critic introduced the evening's screening.",
"一位影评人介绍了当晚的放映。",
"The critic praised the play's quiet ending.",
"这位评论家称赞了戏剧平静的结尾。",
"https://www.oxfordlearnersdictionaries.com/definition/english/critic"
],
[
"establish",
"动词 · 建立",
"可表示创立组织、制度或建立关系，常接 organization、contact 等；不只是物理搭建一件小物品。",
"The village plans to establish a community library.",
"村庄计划建立一个社区图书馆。",
"We need to establish contact with the local team.",
"我们需要与当地团队建立联系。",
"https://www.oxfordlearnersdictionaries.com/definition/english/establish"
],
[
"seldom",
"副词 · 很少",
"本身带否定意味，通常不再加 not；普通语序中常位于实义动词前、be 动词后。",
"She seldom drives to work in summer.",
"她夏天很少开车上班。",
"The little museum is seldom crowded.",
"这座小博物馆很少拥挤。",
"https://www.oxfordlearnersdictionaries.com/definition/english/seldom"
],
[
"unexpected",
"形容词 · 意外的",
"表示事先没有预料到的情况，常修饰 change、visit 等；不自动带褒义或贬义，要看结果。",
"An unexpected visitor arrived during lunch.",
"午餐时来了一位意外的访客。",
"The repair caused an unexpected delay.",
"修理导致了意外的延误。",
"https://www.oxfordlearnersdictionaries.com/definition/english/unexpected"
],
[
"selection",
"名词 · 选择；选集",
"可指挑选过程，也可指选出的一组事物；a selection of 后常接复数名词，说明可供选择的一组。",
"The cafe offers a selection of homemade cakes.",
"这家咖啡馆提供多种自制蛋糕。",
"Careful selection of materials improved the design.",
"精心选择材料改善了设计。",
"https://www.oxfordlearnersdictionaries.com/definition/english/selection"
],
[
"drain",
"动词 · 排水",
"可及物表示排出某物的液体，也可不及物表示液体流走；drain the pasta 指沥干意面。",
"Drain the beans before adding them to the salad.",
"把豆子沥干后再加入沙拉。",
"Water should drain away from the house.",
"水应该从房屋附近排走。",
"https://www.oxfordlearnersdictionaries.com/definition/english/drain"
],
[
"sizable",
"形容词 · 相当大的",
"是美式常用拼写，英式常写 sizeable；描述数量或规模不小，但不提供具体数值。",
"The project attracted a sizable donation.",
"这个项目获得了一笔相当可观的捐款。",
"A sizable crowd gathered outside the theater.",
"剧院外聚集了相当多的人。",
"https://dictionary.cambridge.org/dictionary/english/sizable"
],
[
"theorist",
"名词 · 理论家",
"指提出或发展解释某领域现象的理论的人，可数；不要与仅表达个人猜想的人机械等同。",
"The theorist proposed a new model of language learning.",
"这位理论家提出了一个新的语言学习模型。",
"A leading theorist discussed the limits of the approach.",
"一位重要理论家讨论了这种方法的局限。",
"https://www.oxfordlearnersdictionaries.com/definition/english/theorist"
],
[
"crisis",
"名词 · 危机",
"指必须处理的严重困难阶段，可数；复数拼作 crises，不能直接写成 crisises。",
"The drought created a water crisis.",
"干旱引发了一场水危机。",
"The council met to discuss the housing crisis.",
"议会开会讨论住房危机。",
"https://www.oxfordlearnersdictionaries.com/definition/english/crisis"
],
[
"reminder",
"名词 · 提醒物；提醒",
"指让人记起某事的信息或物品，可数；a reminder to do 可说明需要记住做什么。",
"I set a reminder to return the library books.",
"我设置了归还图书馆书籍的提醒。",
"The old photograph is a reminder of our first trip.",
"这张旧照片让我们想起第一次旅行。",
"https://www.oxfordlearnersdictionaries.com/definition/english/reminder"
],
[
"dean",
"名词 · 学院院长",
"大学语境中常指学院或相关学术单位负责人，可数；宗教语境中有不同职务义，需看场景。",
"The dean welcomed students to the faculty.",
"院长欢迎学生们加入学院。",
"A new dean will take office next term.",
"新院长将在下学期上任。",
"https://dictionary.cambridge.org/dictionary/english/dean"
],
[
"recognizable",
"形容词 · 可辨认的",
"形容由于熟悉特征而能认出的事物，常见 instantly recognizable；不表示已经正式获得承认。",
"The tower is recognizable from miles away.",
"几英里外就能辨认出这座塔。",
"Her style remained recognizable despite the new materials.",
"尽管用了新材料，她的风格仍可辨认。",
"https://www.oxfordlearnersdictionaries.com/definition/english/recognizable"
],
[
"reinvent",
"动词 · 重新塑造",
"表示以新形式呈现事物或自己，常用 reinvent yourself；reinvent the wheel 是重复已有工作的固定说法。",
"The museum plans to reinvent itself as a learning center.",
"博物馆计划把自己重新塑造成学习中心。",
"We do not need to reinvent the wheel for every project.",
"我们不必为每个项目重复发明已有的办法。",
"https://www.oxfordlearnersdictionaries.com/definition/english/reinvent"
],
[
"purity",
"名词 · 纯度",
"此处指物质没有掺杂其他成分的程度，通常不可数；the purity of 后可接材料或水等。",
"The laboratory tested the purity of the sample.",
"实验室检测了样本的纯度。",
"Even a small impurity can affect the purity of the metal.",
"即使少量杂质也会影响金属纯度。",
"https://www.oxfordlearnersdictionaries.com/definition/english/purity"
],
[
"utilize",
"动词 · 利用",
"表示把某资源用于实际目的，语体较正式，直接接资源；日常普通使用也常直接说 use。",
"The project will utilize rainwater from the roof.",
"这个项目将利用屋顶收集的雨水。",
"We can utilize the empty room as a workshop.",
"我们可以把空房间用作工作间。",
"https://www.oxfordlearnersdictionaries.com/definition/english/utilize"
],
[
"ruin",
"动词 · 毁掉",
"表示严重损害价值、乐趣或用途，直接接对象；不一定指物体外形完全粉碎。",
"A leaking bottle could ruin the books in your bag.",
"漏水的瓶子可能毁掉包里的书。",
"Do not let one mistake ruin the whole afternoon.",
"别让一个错误毁了整个下午。",
"https://www.oxfordlearnersdictionaries.com/definition/english/ruin"
],
[
"reliable",
"形容词 · 可靠的",
"可形容人做事值得依赖，也可形容信息可信；reliable information 不代表消息永远无需复核。",
"We need a reliable supplier for the spare parts.",
"我们需要一家可靠的零件供应商。",
"The old thermometer is no longer reliable.",
"那支旧温度计已不再可靠。",
"https://www.oxfordlearnersdictionaries.com/definition/english/reliable"
],
[
"unstable",
"形容词 · 不稳定的",
"可描述结构易倒或情况易变，具体稳定性由所修饰对象决定；本条不用于给人贴心理标签。",
"The chair is unstable because one leg is loose.",
"椅子有条腿松了，所以不稳。",
"Prices remained unstable throughout the winter.",
"整个冬天价格一直不稳定。",
"https://www.oxfordlearnersdictionaries.com/definition/english/unstable"
],
[
"summary",
"名词 · 摘要",
"指保留主要内容的简短陈述，可数；a summary of 后接原内容，不应加入原文没有的结论。",
"Please write a short summary of the discussion.",
"请为讨论写一份简短摘要。",
"The report begins with a one-page summary.",
"报告以一页摘要开头。",
"https://www.oxfordlearnersdictionaries.com/definition/english/summary"
],
[
"fatty",
"形容词 · 含脂肪多的",
"描述食物或组织中含有较多脂肪，常见 fatty food、fatty tissue；不直接表示口感必定油腻。",
"Trim the fatty edges before cooking the meat.",
"烹调前切去肉边上脂肪较多的部分。",
"The diagram shows a layer of fatty tissue.",
"示意图显示了一层脂肪组织。",
"https://www.oxfordlearnersdictionaries.com/definition/english/fatty"
],
[
"dare",
"动词 · 敢",
"本条采用实义动词 dare to do，表示有勇气行动；dare someone to do 则表示激某人去做。",
"I did not dare to open the damaged box.",
"我不敢打开那个破损箱子。",
"Few visitors dare to cross the narrow bridge in high winds.",
"大风中很少有游客敢走过那座窄桥。",
"https://www.oxfordlearnersdictionaries.com/definition/english/dare"
],
[
"wool",
"名词 · 羊毛",
"表示材料羊毛或毛线时通常不可数；a ball of wool 表一团毛线，不能直接用 a wool 数数。",
"The blanket is made from soft wool.",
"这条毯子由柔软羊毛制成。",
"She bought a ball of blue wool for the scarf.",
"她买了一团蓝色毛线织围巾。",
"https://www.oxfordlearnersdictionaries.com/definition/english/wool"
],
[
"vote",
"名词 · 投票；一票",
"可指一次正式表决或某人所投的一票，常用 cast a vote；不等于普通问答中的任何选择。",
"Each member has one vote.",
"每位成员有一票。",
"The proposal passed by a single vote.",
"提案以一票之差获得通过。",
"https://www.oxfordlearnersdictionaries.com/definition/english/vote"
],
[
"noticeable",
"形容词 · 明显的",
"表示容易察觉到的变化或特征，常见 noticeable improvement；强调可被注意，不说明变化必定巨大。",
"There was a noticeable improvement in the sound quality.",
"音质有了明显改善。",
"The repair left a noticeable mark on the wall.",
"修理在墙上留下了明显痕迹。",
"https://www.oxfordlearnersdictionaries.com/definition/english/noticeable"
],
[
"unexplored",
"形容词 · 未探索的",
"可形容尚未实地勘查的地区，也可形容尚未深入研究的问题；不等于该事物不存在。",
"Much of the cave remains unexplored.",
"洞穴的大部分区域仍未探索。",
"The report points to an unexplored question about learning.",
"报告指出了一个尚未研究的学习问题。",
"https://www.oxfordlearnersdictionaries.com/definition/english/unexplored"
],
[
"permission",
"名词 · 许可",
"通常不可数，permission to do 表许可做某事，permission from 表许可来源；不用 a permission 指一般许可。",
"You need permission to enter the archive.",
"进入档案室需要许可。",
"We obtained permission from the owner to photograph the house.",
"我们获得房主许可，拍摄了这栋房屋。",
"https://www.oxfordlearnersdictionaries.com/definition/english/permission"
],
[
"systematic",
"形容词 · 系统的",
"描述按计划、步骤完整开展的工作，常用 systematic review；不只是指反复做同一件事。",
"A systematic search located the missing document.",
"一次系统搜寻找到了遗失文件。",
"The team took a systematic approach to testing the equipment.",
"团队采用了系统的方法测试设备。",
"https://www.oxfordlearnersdictionaries.com/definition/english/systematic"
],
[
"mismatch",
"动词 · 不相配",
"本条采用动词义，表示把不适合的人或物配在一起；名词 a mismatch 常接 between 是另一结构。",
"Do not mismatch the labels and their samples.",
"不要把标签和样本配错。",
"If we mismatch skills and tasks, the work takes longer.",
"如果把技能和任务错配，工作就会耗时更长。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mismatch"
],
[
"skyscraper",
"名词 · 摩天大楼",
"指城市中非常高的建筑，可数；不是任何普通多层住宅都称作 skyscraper。",
"The skyscraper casts a long shadow over the square.",
"摩天大楼在广场上投下长长的影子。",
"A viewing platform sits near the top of the skyscraper.",
"摩天大楼接近顶部处设有观景台。",
"https://www.oxfordlearnersdictionaries.com/definition/english/skyscraper"
],
[
"complex",
"形容词 · 复杂的",
"形容由许多相互联系部分组成或难以理解的事物；比较级可用 more complex，区别于名词建筑群义。",
"The machine has a complex cooling system.",
"这台机器有复杂的冷却系统。",
"The problem is more complex than it first appeared.",
"这个问题比起初看起来更复杂。",
"https://www.oxfordlearnersdictionaries.com/definition/english/complex"
],
[
"inconvenient",
"形容词 · 不方便的",
"表示安排带来麻烦或不便，常用 inconvenient for someone；不等于不可能做到。",
"The last bus leaves at an inconvenient time.",
"最后一班公交出发时间不太方便。",
"Would Tuesday morning be inconvenient for you?",
"星期二早晨对你来说不方便吗？",
"https://www.oxfordlearnersdictionaries.com/definition/english/inconvenient"
],
[
"unimproved",
"形容词 · 未改善的",
"可指状况没有好转，也可指土地未作开发；本条分别注明条件或土地，不暗示自然土地一定价值低。",
"The patient's condition remained unimproved.",
"病人的状况仍未好转。",
"The map shows an area of unimproved land beside the road.",
"地图标出了路旁一片未开发土地。",
"https://www.oxfordlearnersdictionaries.com/definition/english/unimproved"
],
[
"threaten",
"动词 · 威胁",
"表示扬言做不利的事时常接 to do；某因素危及事物时可直接接对象，不一定涉及说话者。",
"The owners threaten to close the shop unless costs fall.",
"店主扬言，如果成本不下降就关店。",
"Heavy rain could threaten the outdoor performance.",
"大雨可能危及户外演出。",
"https://www.oxfordlearnersdictionaries.com/definition/english/threaten"
],
[
"logical",
"形容词 · 合乎逻辑的",
"表示结论或步骤有合理联系，常用 logical conclusion；不保证基于错误前提的推理也符合事实。",
"The next logical step is to test a smaller model.",
"接下来合理的一步是测试一个较小模型。",
"Her explanation was clear and logical.",
"她的解释清楚而有条理。",
"https://www.oxfordlearnersdictionaries.com/definition/english/logical"
],
[
"probability",
"名词 · 可能性",
"表示发生某事的可能程度，常用 the probability of 加名词或动名词；不等于确定事实。",
"The forecast gives a high probability of rain.",
"预报显示降雨概率很高。",
"We estimated the probability of each outcome.",
"我们估计了每种结果的可能性。",
"https://www.oxfordlearnersdictionaries.com/definition/english/probability"
],
[
"localize",
"动词 · 限定在局部",
"可指把影响控制在特定区域，也可指确定位置；本条例句以控制影响范围为主，区别于定位功能名词。",
"The barriers helped localize the spill.",
"围挡帮助把泄漏限制在局部。",
"The team tried to localize the damage to a single section.",
"团队试图将损坏范围限制在单一区段。",
"https://www.oxfordlearnersdictionaries.com/definition/english/localize"
],
[
"tone",
"名词 · 语气",
"指声音或表达体现的态度，常用 a friendly tone；同一句话的字面内容相同，语气仍可能不同。",
"Her tone became warmer as the meeting continued.",
"随着会议继续，她的语气变得更亲切。",
"Please keep the tone of the letter polite.",
"请让信件语气保持礼貌。",
"https://www.oxfordlearnersdictionaries.com/definition/english/tone"
],
[
"division",
"名词 · 划分；分配",
"division of 可引出被划分的整体，常见 division of labor；与数学除法等义项要按语境区别。",
"The plan sets out a clear division of responsibilities.",
"计划明确划分了职责。",
"The division of the land caused a long dispute.",
"土地的划分引发了长期争执。",
"https://www.oxfordlearnersdictionaries.com/definition/english/division"
],
[
"sketch",
"名词 · 草图",
"指快速绘制、细节较少的图画，可数；make a sketch 表画草图，不是完成精细成品画。",
"She made a sketch of the doorway.",
"她画了一张门口的草图。",
"The sketch shows where the new shelves will go.",
"草图显示了新架子将放在哪里。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sketch"
],
[
"measurement",
"名词 · 测量结果",
"可指测量过程，也可指所得尺寸；take a measurement 是常见搭配，具体长宽可用复数 measurements。",
"The measurement was recorded in centimeters.",
"测量结果以厘米记录。",
"We repeated the measurement with a different ruler.",
"我们用另一把尺子重复测量。",
"https://www.oxfordlearnersdictionaries.com/definition/english/measurement"
],
[
"accessible",
"形容词 · 可到达的",
"形容地点能进入或使用，常用 accessible to；涉及无障碍时需结合具体设施说明，不只看距离。",
"The upper gallery is accessible by lift.",
"上层展厅可以乘电梯到达。",
"The documents are accessible to all registered members.",
"所有注册会员均可查阅这些文件。",
"https://www.oxfordlearnersdictionaries.com/definition/english/accessible"
],
[
"pro",
"名词 · 职业选手",
"是 professional 的非正式简称，体育语境常指职业运动员；不是指支持意见的所有用法。",
"A tennis pro gave us a short lesson.",
"一位职业网球选手给我们上了一节短课。",
"She hopes to become a pro after finishing school.",
"她希望毕业后成为职业选手。",
"https://www.oxfordlearnersdictionaries.com/definition/english/pro"
],
[
"supernatural",
"形容词 · 超自然的",
"用于无法按自然规律解释、涉及鬼神魔法的故事或信念；不应直接当作现实因果已获证实的描述。",
"The novel contains several supernatural events.",
"小说中有几起超自然事件。",
"The play explores the character's belief in supernatural forces.",
"这部剧探讨角色对超自然力量的信仰。",
"https://www.oxfordlearnersdictionaries.com/definition/english/supernatural"
],
[
"sole",
"形容词 · 唯一的",
"通常置于名词前，表示只有这一个，常用 sole owner；不是鞋底或鳎鱼的名词义。",
"She is the sole owner of the studio.",
"她是这间工作室的唯一所有者。",
"The well is the village's sole source of water.",
"这口井是村庄唯一的水源。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sole"
],
[
"reluctant",
"形容词 · 不情愿的",
"常用 be reluctant to do，表示不愿或犹豫去做；不同于完全没有能力做某事。",
"He was reluctant to leave the discussion unfinished.",
"他不愿在讨论没结束时离开。",
"The owner seemed reluctant to sell the old piano.",
"主人似乎不太愿意卖掉旧钢琴。",
"https://www.oxfordlearnersdictionaries.com/definition/english/reluctant"
],
[
"athletics",
"名词 · 田径（英式）",
"英式英语通常指跑、跳、投等田径项目，形式虽有 s，作为运动领域通常用单数谓语。",
"Athletics is a popular activity at the summer camp.",
"田径是夏令营里一项受欢迎的活动。",
"She trains in athletics three afternoons a week.",
"她每周三个下午进行田径训练。",
"https://www.oxfordlearnersdictionaries.com/definition/english/athletics"
],
[
"neat",
"形容词 · 整齐的",
"可形容物品摆放有序或工作完成得工整，常见 neat handwriting；本条不采用纯饮酒等其他义项。",
"He arranged the tools in a neat row.",
"他把工具整齐地排成一行。",
"Her neat handwriting made the notes easy to read.",
"她工整的字迹使笔记容易阅读。",
"https://www.oxfordlearnersdictionaries.com/definition/english/neat"
],
[
"found",
"动词 · 创立",
"本条是建立机构的独立动词，过去式 founded；不是 find 的过去式，原形同为 found 需看语义。",
"They plan to found a school for local children.",
"他们计划为当地孩子创办一所学校。",
"The grant helped her found a small theater company.",
"这笔资助帮助她创办了一个小剧团。",
"https://www.oxfordlearnersdictionaries.com/definition/english/found"
],
[
"imply",
"动词 · 暗示",
"表示不直接明说而使人领会，常接 that 从句；与 infer 的听者据线索推断不同。",
"The brief reply seemed to imply that the request had been refused.",
"这封简短回复似乎暗示请求已被拒绝。",
"A low price does not imply poor quality.",
"低价格并不意味着质量差。",
"https://www.oxfordlearnersdictionaries.com/definition/english/imply"
],
[
"paste",
"名词 · 糊状物",
"指粉末等与液体混成的柔软湿润物质，可按材料说 a paste；本条不采用电脑粘贴的动词义。",
"Mix the powder with water to form a paste.",
"把粉末与水混合成糊。",
"Spread a thin layer of paste over the paper.",
"在纸上涂薄薄一层浆糊。",
"https://www.oxfordlearnersdictionaries.com/definition/english/paste"
],
[
"examination",
"名词 · 考试",
"指正式检验知识或技能的测试，可数，语体比 exam 正式；体检和仔细检查也是其他常用义。",
"The final examination includes a practical task.",
"期末考试包括一项实践任务。",
"She prepared carefully for the oral examination.",
"她为口试作了认真准备。",
"https://www.oxfordlearnersdictionaries.com/definition/english/examination"
],
[
"criticize",
"动词 · 批评",
"直接接被批评的人或事，criticize someone for something 可说明原因；不能无故在宾语前加 to。",
"The report does not criticize individual teachers.",
"这份报告没有批评个别教师。",
"Do not criticize her for asking a careful question.",
"不要因为她问了一个细致的问题就批评她。",
"https://www.oxfordlearnersdictionaries.com/definition/english/criticize"
],
[
"inclusion",
"名词 · 纳入",
"表示把某人或某物包括进来的行为或状态，常用 inclusion in；不等于实际参与者人数。",
"The inclusion of a glossary makes the book more useful.",
"加入词汇表使这本书更实用。",
"We welcomed her inclusion in the research team.",
"我们欢迎她加入研究团队。",
"https://www.oxfordlearnersdictionaries.com/definition/english/inclusion"
],
[
"definitely",
"副词 · 肯定地",
"强调说话人对判断没有疑问，常位于助动词后或实义动词前；不能把态度确定等同外部证据。",
"I will definitely return the key tomorrow.",
"我明天肯定会归还钥匙。",
"This room is definitely warmer than the one upstairs.",
"这间房肯定比楼上那间暖和。",
"https://www.oxfordlearnersdictionaries.com/definition/english/definitely"
],
[
"curriculum",
"名词 · 课程体系",
"指学校或项目安排的整体教学内容，可数；不同于某一节课的 lesson，复数可用 curricula。",
"The curriculum includes music and environmental studies.",
"课程体系包括音乐和环境研究。",
"Teachers helped revise the science curriculum.",
"教师们帮助修订了科学课程体系。",
"https://www.oxfordlearnersdictionaries.com/definition/english/curriculum"
],
[
"explode",
"动词 · 爆炸",
"可不及物描述物体爆炸，也可及物表示使其爆炸；数量激增等引申义需看语境。",
"The tank could explode if the pressure rises too far.",
"压力升得过高时，储罐可能爆炸。",
"The film shows a distant star beginning to explode.",
"影片展示了一颗遥远恒星开始爆发。",
"https://www.oxfordlearnersdictionaries.com/definition/english/explode"
],
[
"medium",
"形容词 · 中等的",
"表示尺寸、程度等在大小之间，常放在名词前；作名词的媒介或材料义不属于此用法。",
"Choose a medium bowl for the mixture.",
"给混合物选一个中号碗。",
"Cook the onions over medium heat.",
"用中火烹调洋葱。",
"https://www.oxfordlearnersdictionaries.com/definition/english/medium"
],
[
"wipe",
"动词 · 擦拭",
"wipe something with a cloth 表用布擦，wipe something off 表擦掉；注意物体与污物作宾语的区别。",
"Please wipe the table with a damp cloth.",
"请用湿布擦桌子。",
"She used a tissue to wipe the water off her glasses.",
"她用纸巾擦去眼镜上的水。",
"https://www.oxfordlearnersdictionaries.com/definition/english/wipe"
],
[
"maintain",
"动词 · 维持",
"可表示使某状态继续，也可表示维护设备；maintain a balance 是保持平衡，不表示刚刚建立平衡。",
"The team worked to maintain a steady temperature.",
"团队努力保持温度稳定。",
"Regular checks help maintain the old machinery.",
"定期检查有助于维护这些旧机器。",
"https://www.oxfordlearnersdictionaries.com/definition/english/maintain"
],
[
"extraordinary",
"形容词 · 非凡的",
"强调不同寻常或超出预期，既可褒义也可表示奇怪；不是 ordinary 的同义表达。",
"The telescope revealed an extraordinary pattern of light.",
"望远镜呈现了一种非同寻常的光线图案。",
"She showed extraordinary patience during the repairs.",
"修理期间她表现出非凡耐心。",
"https://www.oxfordlearnersdictionaries.com/definition/english/extraordinary"
],
[
"connection",
"名词 · 联系",
"a connection between A and B 表二者关联；a connection to 常表与某对象连接，不能把关联直接当作因果。",
"The study found a connection between noise and poor sleep.",
"研究发现噪声与睡眠不佳存在联系。",
"We lost our connection to the server.",
"我们与服务器的连接中断了。",
"https://www.oxfordlearnersdictionaries.com/definition/english/connection"
],
[
"mass",
"名词 · 团块；大量",
"a mass of 可指一团无固定形状的物质，也可指大量事物；物理质量义则另作理解。",
"A mass of roots blocked the pipe.",
"一团根系堵住了管道。",
"The report contains a mass of useful information.",
"报告包含大量有用信息。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mass"
],
[
"destination",
"名词 · 目的地",
"指人或物将到达的地方，可数；reach your destination 中 reach 是及物动词，不再加 to。",
"We reached our destination before sunset.",
"我们在日落前到达了目的地。",
"The label gives the parcel's final destination.",
"标签标明包裹的最终目的地。",
"https://www.oxfordlearnersdictionaries.com/definition/english/destination"
],
[
"impact",
"名词 · 影响",
"常用 have an impact on 表对某物产生影响；该词也有撞击义，不能仅凭同形词把影响都理解成碰撞。",
"The closure had a major impact on local shops.",
"关闭对当地商店产生了重大影响。",
"We assessed the impact of the new timetable.",
"我们评估了新时间表的影响。",
"https://www.oxfordlearnersdictionaries.com/definition/english/impact"
],
[
"ecosystem",
"名词 · 生态系统",
"指生物与其环境相互作用构成的整体，可数；不只列出物种，还包括环境和联系。",
"The pond supports a small but complex ecosystem.",
"池塘维持着一个虽小却复杂的生态系统。",
"Pollution can alter the balance of an ecosystem.",
"污染会改变生态系统的平衡。",
"https://www.oxfordlearnersdictionaries.com/definition/english/ecosystem"
],
[
"define",
"动词 · 定义",
"可接词语、范围或性质，define A as B 表把A界定为B；不能把个人偏好当作普遍定义。",
"The glossary helps define unfamiliar terms.",
"词汇表有助于解释陌生术语。",
"We need to define the project's limits more clearly.",
"我们需要更清楚地界定项目范围。",
"https://www.oxfordlearnersdictionaries.com/definition/english/define"
],
[
"con",
"名词 · 骗局",
"是非正式可数名词，指欺骗行为，常用 a con；与 pros and cons 中的反对理由不同。",
"The supposed prize turned out to be a con.",
"那个所谓的奖项原来是一场骗局。",
"She realized the offer was a con before sending any money.",
"她在汇款前意识到这个提议是骗局。",
"https://www.oxfordlearnersdictionaries.com/definition/english/con"
],
[
"terrify",
"动词 · 使极度害怕",
"是强于 frighten 的及物动词，直接接感到害怕的人；be terrified of 表极怕某物。",
"Sudden loud noises terrify the rescued dog.",
"突然的巨响会使那只获救的狗极度害怕。",
"The thought of losing the records would terrify any archivist.",
"想到记录丢失会让任何档案员极度害怕。",
"https://www.oxfordlearnersdictionaries.com/definition/english/terrify"
],
[
"unsupported",
"形容词 · 无依据的",
"本条指说法缺少证据支撑，常见 unsupported claim；也有缺少物理支撑义，需按对象区分。",
"The article repeats an unsupported claim.",
"这篇文章重复了一项无依据的说法。",
"We removed the unsupported assumption from the analysis.",
"我们从分析中去掉了这个无依据的假设。",
"https://www.oxfordlearnersdictionaries.com/definition/english/unsupported"
],
[
"certify",
"动词 · 正式证明",
"通常指用正式程序或书面形式证明，certify that 可引出事实；不等同于随意表示个人相信。",
"The inspector will certify that the lift is safe.",
"检查员将正式证明电梯安全。",
"Only an approved laboratory can certify these results.",
"只有获准的实验室能为这些结果出具认证。",
"https://www.oxfordlearnersdictionaries.com/definition/english/certify"
],
[
"factual",
"形容词 · 事实性的",
"表示基于或包含事实，常用 factual error 指事实错误；factual 不等于作者任何判断都全面客观。",
"Please correct the factual error in the caption.",
"请更正图注中的事实错误。",
"The introduction gives a factual account of the journey.",
"导言按事实叙述了这次旅程。",
"https://www.oxfordlearnersdictionaries.com/definition/english/factual"
],
[
"experimental",
"形容词 · 实验性的",
"可指科学实验相关，也可指尝试新方法以观察效果；experimental treatment 不表示效果已获确认。",
"The team tested an experimental design for the shelter.",
"团队测试了一个实验性的遮蔽棚设计。",
"We recorded the experimental conditions carefully.",
"我们认真记录了实验条件。",
"https://www.oxfordlearnersdictionaries.com/definition/english/experimental"
],
[
"satellite",
"名词 · 卫星",
"可指绕行星的自然天体或人造设备；本条例句采用通信观测等人造卫星义，可数。",
"The satellite sends images of cloud cover.",
"这颗卫星传回云层图像。",
"A satellite helps monitor changes in sea ice.",
"一颗卫星帮助监测海冰变化。",
"https://www.oxfordlearnersdictionaries.com/definition/english/satellite"
],
[
"considerate",
"形容词 · 体贴的",
"表示顾及他人感受或需要，常用 considerate of someone；与表示相当大的 considerable 不同。",
"It was considerate of you to bring an extra chair.",
"你多带了一把椅子，真体贴。",
"Please be considerate of the neighbors during the repairs.",
"维修期间请体谅邻居。",
"https://www.oxfordlearnersdictionaries.com/definition/english/considerate"
],
[
"flatten",
"动词 · 弄平",
"可及物把东西压平，也可不及物变平；不必然表示完全摧毁，注意操作对象。",
"Use a board to flatten the clay.",
"用一块板子把黏土压平。",
"The path begins to flatten near the river.",
"小路在河边开始变得平坦。",
"https://www.oxfordlearnersdictionaries.com/definition/english/flatten"
],
[
"nutrient",
"名词 · 营养物质",
"指维持生命和生长所需的物质，可数；常用 essential nutrients，不等同于所有食物成分。",
"The soil lacks an essential nutrient.",
"土壤缺少一种必需营养物质。",
"Each nutrient plays a different role in growth.",
"每种营养物质在生长中发挥不同作用。",
"https://www.oxfordlearnersdictionaries.com/definition/english/nutrient"
],
[
"economical",
"形容词 · 节省的",
"表示节约金钱、时间或材料，常用 economical with；与 economic 的经济相关义不同。",
"The smaller heater is more economical to run.",
"较小的加热器运行起来更省钱。",
"Her design is economical with materials.",
"她的设计节省材料。",
"https://www.oxfordlearnersdictionaries.com/definition/english/economical"
],
[
"quantify",
"动词 · 量化",
"指用数字或数量表达某事程度，直接接所衡量对象；不能量化不表示该现象不存在。",
"The survey aims to quantify changes in travel habits.",
"这项调查旨在量化出行习惯的变化。",
"It is difficult to quantify the value of personal support.",
"个人支持的价值难以量化。",
"https://www.oxfordlearnersdictionaries.com/definition/english/quantify"
],
[
"outline",
"动词 · 概述",
"指给出主要事实或步骤，直接接计划等对象；不要求列出所有细节，名词 a brief outline 另是提纲。",
"Please outline the steps before demonstrating the repair.",
"演示修理前请概述步骤。",
"The brochure will outline the main features of the course.",
"小册子将概述课程的主要特点。",
"https://www.oxfordlearnersdictionaries.com/definition/english/outline"
],
[
"harvest",
"名词 · 收获",
"可指收割活动或收得的庄稼，常见 a good harvest；不是所有年度产出都采用农业收获义。",
"Rain delayed the harvest by a week.",
"雨让收割推迟了一周。",
"The orchard produced a generous harvest this year.",
"果园今年收成丰盛。",
"https://www.oxfordlearnersdictionaries.com/definition/english/harvest"
],
[
"loner",
"名词 · 独处者",
"指常独自活动或偏爱独处的人，可数；该词不自动表示孤独痛苦或缺乏社交能力。",
"The character is a loner who enjoys long walks.",
"这个角色喜欢独处，爱长距离散步。",
"Although a loner, he welcomed the chance to help his neighbors.",
"虽然喜欢独处，他仍乐意帮助邻居。",
"https://www.oxfordlearnersdictionaries.com/definition/english/loner"
],
[
"incline",
"动词 · 倾向于",
"incline to do 或 incline towards 表某种想法倾向，语体较正式；本条不用坡度名词义。",
"I incline to agree with the smaller estimate.",
"我倾向于同意较小的估值。",
"The evidence may incline the panel towards a different conclusion.",
"这些证据可能使小组倾向于另一个结论。",
"https://www.oxfordlearnersdictionaries.com/definition/english/incline"
],
[
"consideration",
"名词 · 考虑",
"give consideration to 表认真考虑，under consideration 表正在审议；作可数名词还可指需考虑的因素。",
"The proposal is still under consideration.",
"提案仍在审议中。",
"Cost is an important consideration when choosing materials.",
"选择材料时，成本是重要考虑因素。",
"https://www.oxfordlearnersdictionaries.com/definition/english/consideration"
],
[
"object",
"名词 · 物体",
"指能看见触摸的非生命东西，可数，名词重音在前；动词反对的重音和句法不同。",
"A shiny object lay beneath the bench.",
"长凳下面有一个发亮的物体。",
"Do not place a heavy object on the cable.",
"不要把重物放在电缆上。",
"https://www.oxfordlearnersdictionaries.com/definition/english/object"
],
[
"divorce",
"名词 · 离婚",
"指婚姻的法律终结，可用 get a divorce；与夫妻暂时分居不同，不宜仅凭居住安排推断。",
"They decided to seek a divorce.",
"他们决定办理离婚。",
"The novel explores family life after a divorce.",
"小说探讨离婚后的家庭生活。",
"https://www.oxfordlearnersdictionaries.com/definition/english/divorce"
],
[
"wise",
"形容词 · 明智的",
"强调凭经验和判断作出合理决定，常用 wise to do；不同于仅知道许多事实的 knowledgeable。",
"It would be wise to keep a spare key.",
"留一把备用钥匙会是明智的。",
"She gave us some wise advice about planning ahead.",
"她给了我们一些关于提前计划的明智建议。",
"https://www.oxfordlearnersdictionaries.com/definition/english/wise"
],
[
"slip",
"动词 · 滑倒；滑落",
"指意外短距离滑动而失去平衡或位置，可用 slip on 表踩在什么上打滑，不表示故意滑行。",
"Be careful not to slip on the wet steps.",
"小心别在湿台阶上滑倒。",
"The cup began to slip from her hand.",
"杯子开始从她手中滑落。",
"https://www.oxfordlearnersdictionaries.com/definition/english/slip"
],
[
"redefine",
"动词 · 重新界定",
"指改变事物的范围、含义或人们看待它的方式，直接接对象；不只是重复原来的定义。",
"The project may redefine the role of the local library.",
"这个项目可能重新界定当地图书馆的作用。",
"We need to redefine the boundaries of the study.",
"我们需要重新界定研究范围。",
"https://www.oxfordlearnersdictionaries.com/definition/english/redefine"
],
[
"shipyard",
"名词 · 造船厂",
"指建造或修理船舶的地方，可数；并不等于只装卸货物的港口或码头。",
"The shipyard repairs fishing boats and small ferries.",
"造船厂维修渔船和小型渡轮。",
"A new training center opened beside the shipyard.",
"造船厂旁开设了一个新培训中心。",
"https://www.oxfordlearnersdictionaries.com/definition/english/shipyard"
],
[
"migrate",
"动词 · 迁徙",
"动物可因季节变化迁移，人也可迁居，常用 migrate to；数据迁移是计算机领域的引申义。",
"These birds migrate south before winter.",
"这些鸟在冬天前向南迁徙。",
"Many families migrate to cities in search of work.",
"许多家庭迁往城市寻找工作。",
"https://www.oxfordlearnersdictionaries.com/definition/english/migrate"
],
[
"simplicity",
"名词 · 简单性",
"描述容易理解使用或朴素自然的特点，通常不可数；强调简明，不必然表示缺少必要功能。",
"The design's simplicity makes it easy to use.",
"设计的简单性使它容易使用。",
"We admired the simplicity of the wooden furniture.",
"我们欣赏这些木家具的朴素风格。",
"https://www.oxfordlearnersdictionaries.com/definition/english/simplicity"
],
[
"consult",
"动词 · 咨询；查阅",
"可直接接专家，也可接书籍等参考资料；consult someone about something 表向某人咨询某事。",
"Please consult the manual before removing the cover.",
"拆下盖子前请查阅手册。",
"We should consult the neighbors about the new gate.",
"我们应该就新大门征求邻居的意见。",
"https://www.oxfordlearnersdictionaries.com/definition/english/consult"
],
[
"construction",
"名词 · 建造",
"表示修建过程或建筑行业时通常不可数，under construction 表正在施工；不直接用 a construction 表一栋楼。",
"Construction of the footbridge will continue through winter.",
"步行桥的施工将持续整个冬季。",
"Road construction caused delays near the station.",
"道路施工导致车站附近通行延误。",
"https://www.oxfordlearnersdictionaries.com/definition/english/construction"
],
[
"spot",
"名词 · 斑点",
"指颜色或质地不同的小块，可数，a spot of 可引出少量污渍；本条不采用发现的动词义。",
"There was a red spot on the white cloth.",
"白布上有一个红点。",
"A spot of ink marked the edge of the page.",
"一块墨渍留在了页边。",
"https://www.oxfordlearnersdictionaries.com/definition/english/spot"
],
[
"prolong",
"动词 · 延长",
"直接接时间段或状态，表示使其持续更久；与把物体空间长度拉长的日常动作需区分。",
"We did not want to prolong the meeting.",
"我们不想延长会议。",
"Careful storage can prolong the life of the equipment.",
"妥善存放能延长设备寿命。",
"https://www.oxfordlearnersdictionaries.com/definition/english/prolong"
],
[
"perform",
"动词 · 执行；表演",
"perform a task 表完成任务，perform on stage 表舞台演出；需看宾语来判断具体范围。",
"The technician will perform a final safety check.",
"技术员将进行最后一次安全检查。",
"The children will perform a short play after lunch.",
"孩子们将在午饭后表演一出短剧。",
"https://www.oxfordlearnersdictionaries.com/definition/english/perform"
],
[
"mobile",
"形容词 · 可移动的",
"本条采用能方便移到别处的义项，如 mobile clinic；与仅表示移动电话有关的用法依搭配区分。",
"A mobile library visits the village every Tuesday.",
"流动图书馆每星期二来村里。",
"The team uses a mobile workshop to repair farm equipment.",
"团队使用流动作业车间维修农用设备。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mobile"
],
[
"mythical",
"形容词 · 神话中的",
"形容存在于神话传说而非现实中的人物或动物，常见 mythical creature；与一般虚构小说人物范围不同。",
"The painting shows a mythical bird rising from flames.",
"画中有一只从火焰中升起的神话之鸟。",
"Children designed a mythical creature for the story.",
"孩子们为故事设计了一个神话生物。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mythical"
],
[
"restless",
"形容词 · 坐立不安的",
"表示因无聊、焦虑等无法静下来，也可描述睡眠不安稳；不同于 rest 的否定命令。",
"The children grew restless during the long wait.",
"长时间等待使孩子们坐立不安。",
"After a restless night, she went for an early walk.",
"一夜没睡安稳后，她一早去散步。",
"https://www.oxfordlearnersdictionaries.com/definition/english/restless"
],
[
"inhabitant",
"名词 · 居民",
"指居住在某地的人或动物，可数；an inhabitant of 后面说明地方，不表示临时到访的游客。",
"An inhabitant of the village showed us the old well.",
"一位村民带我们看了古井。",
"The island's oldest inhabitant remembered the original harbor.",
"岛上最年长的居民记得最初的港口。",
"https://www.oxfordlearnersdictionaries.com/definition/english/inhabitant"
],
[
"prime",
"形容词 · 首要的",
"通常置于名词前表示最重要或主要的，如 prime concern；数学质数义和最佳状态义另行理解。",
"Safety is our prime concern during the repairs.",
"维修期间，安全是我们首要关切。",
"The empty warehouse is a prime candidate for renovation.",
"空仓库是最值得考虑翻新的建筑。",
"https://www.oxfordlearnersdictionaries.com/definition/english/prime"
],
[
"manufacture",
"动词 · 制造",
"指通常借助机器批量生产商品，直接接产品；个人临时手工做一个小物件通常用 make 更自然。",
"The factory will manufacture parts for electric buses.",
"工厂将制造电动公交车零件。",
"They manufacture glass containers for local food producers.",
"他们为当地食品生产商制造玻璃容器。",
"https://www.oxfordlearnersdictionaries.com/definition/english/manufacture"
],
[
"fame",
"名词 · 名声",
"指广为人知的状态，通常不可数；gain fame for 表因某事出名，不能像一个奖项那样用 a fame。",
"The novel brought her international fame.",
"这部小说给她带来了国际声誉。",
"He gained fame for his photographs of coastal birds.",
"他因拍摄海岸鸟类而出名。",
"https://www.oxfordlearnersdictionaries.com/definition/english/fame"
],
[
"obtain",
"动词 · 获得",
"语体较正式，通常表示通过努力取得信息、许可等，直接接对象；不随意在宾语前加到达介词。",
"We need to obtain permission before filming.",
"拍摄前我们需要获得许可。",
"You can obtain a copy from the information desk.",
"你可以从咨询台获得一份副本。",
"https://www.oxfordlearnersdictionaries.com/definition/english/obtain"
],
[
"output",
"名词 · 产量；输出",
"可指机器或组织产出的数量，也可指电脑生成的信息，通常不可数；具体数量常用 daily output 等。",
"The factory increased its daily output.",
"工厂提高了日产量。",
"The program saves its output in a separate folder.",
"程序把输出内容保存在单独的文件夹里。",
"https://www.oxfordlearnersdictionaries.com/definition/english/output"
],
[
"disrupt",
"动词 · 扰乱",
"表示使活动难以正常继续，直接接 service、routine 等；不一定完全停止，重点在干扰正常运作。",
"The repairs may disrupt train services.",
"维修可能扰乱列车运行。",
"Loud music can disrupt the quiet study area.",
"响亮音乐会干扰安静的学习区。",
"https://www.oxfordlearnersdictionaries.com/definition/english/disrupt"
],
[
"coexist",
"动词 · 共存",
"常用 coexist with 表与另一事物同时存在，语境也可强调和平相处；它是不及物动词。",
"These two species can coexist in the same pond.",
"这两个物种能在同一个池塘共存。",
"Old and new buildings coexist along the waterfront.",
"新旧建筑在滨水地带并存。",
"https://www.oxfordlearnersdictionaries.com/definition/english/coexist"
],
[
"conflict",
"名词 · 冲突",
"可指强烈分歧或武装冲突，a conflict between 表双方冲突；不是所有小小差异都称为 conflict。",
"The plan created a conflict between two departments.",
"这个计划引发了两个部门间的冲突。",
"We need a way to resolve the conflict peacefully.",
"我们需要找到和平解决冲突的方法。",
"https://www.oxfordlearnersdictionaries.com/definition/english/conflict"
],
[
"nutrition",
"名词 · 营养",
"表示生命获得和利用食物中所需物质的过程，通常不可数；不把单一种营养素叫作 a nutrition。",
"The course covers basic nutrition for growing children.",
"这门课程涵盖成长中儿童的基础营养知识。",
"Poor nutrition can affect a plant's growth.",
"营养不良会影响植物生长。",
"https://www.oxfordlearnersdictionaries.com/definition/english/nutrition"
],
[
"petroleum",
"名词 · 石油",
"指从地下或海底取得、可加工成燃料等的矿物油，通常不可数；不是某一种成品汽油的专名。",
"The region has large reserves of petroleum.",
"这个地区有大量石油储备。",
"The lesson explains how petroleum is refined.",
"这堂课解释石油如何被提炼。",
"https://www.oxfordlearnersdictionaries.com/definition/english/petroleum"
],
[
"exhibit",
"动词 · 展出",
"直接接向公众展示的物品，常见 exhibit paintings；show a quality 的表现出义是另一常用范围。",
"The gallery will exhibit the students' photographs.",
"画廊将展出学生们的照片。",
"Local artists can exhibit their work in the hall.",
"本地艺术家可以在大厅展出作品。",
"https://www.oxfordlearnersdictionaries.com/definition/english/exhibit"
],
[
"roll",
"动词 · 滚动",
"可不及物描述物体转动前进，也可及物使物体滚动；roll the dough flat 则是擀平的相关用法。",
"The apple began to roll toward the edge of the table.",
"苹果开始向桌边滚动。",
"Roll the barrel slowly down the ramp.",
"让桶沿斜坡缓缓滚下。",
"https://www.oxfordlearnersdictionaries.com/definition/english/roll"
],
[
"partnership",
"名词 · 合作关系",
"a partnership between 表双方合作，in partnership with 表与谁合作；不一定是法律上的企业合伙。",
"The project is a partnership between the school and the museum.",
"这个项目是学校和博物馆的合作。",
"We work in partnership with local farmers.",
"我们与当地农民合作。",
"https://www.oxfordlearnersdictionaries.com/definition/english/partnership"
],
[
"humble",
"形容词 · 谦逊的",
"形容不自夸、不认为自己高人一等的态度；不等于能力差或没有成就，常与 despite 搭配。",
"Despite the award, she remained humble.",
"尽管获奖，她仍然谦逊。",
"His humble response impressed the judges.",
"他谦逊的回应给评委留下深刻印象。",
"https://www.oxfordlearnersdictionaries.com/definition/english/humble"
],
[
"cope",
"动词 · 应付",
"是不及物动词，说明处理对象时通常加 with；cope with pressure 表承受并处理压力，不直接接宾语。",
"We need a better system to cope with the extra orders.",
"我们需要更好的系统来应付新增订单。",
"She found a quiet routine that helped her cope.",
"她找到一种安静的日常安排，帮助自己应对困难。",
"https://www.oxfordlearnersdictionaries.com/definition/english/cope"
],
[
"monument",
"名词 · 纪念碑",
"可指纪念重要人物或事件的建筑、雕像等，常用 monument to；也可指重要古迹，须看上下文。",
"The town built a monument to the rescue workers.",
"镇上为救援人员建立了一座纪念碑。",
"Flowers were placed beside the monument.",
"纪念碑旁放着鲜花。",
"https://www.oxfordlearnersdictionaries.com/definition/english/monument"
],
[
"positive",
"形容词 · 积极的；良好的",
"可形容结果有益或态度支持，常用 positive effect；医学阳性等义项不能直接套用积极评价义。",
"The new lighting had a positive effect on the workspace.",
"新照明对工作空间产生了积极影响。",
"She received a positive response to her proposal.",
"她的提案得到了积极回应。",
"https://www.oxfordlearnersdictionaries.com/definition/english/positive"
],
[
"imaginary",
"形容词 · 想象中的",
"指仅存在于想象中的人或事物，常见 imaginary friend；与 imaginative 的有想象力不同。",
"The children drew maps of an imaginary island.",
"孩子们画了一个想象中岛屿的地图。",
"He described an imaginary conversation with his younger self.",
"他描写了与年轻时的自己的一段假想对话。",
"https://www.oxfordlearnersdictionaries.com/definition/english/imaginary"
],
[
"slice",
"名词 · 薄片",
"a slice of 后接面包、肉等，说明切下的一片；也能指蛋糕等的一块，不要求所有形状完全薄平。",
"She put a slice of cheese on the bread.",
"她把一片奶酪放在面包上。",
"Would you like a slice of the apple cake?",
"你想要一块苹果蛋糕吗？",
"https://www.oxfordlearnersdictionaries.com/definition/english/slice"
],
[
"comparable",
"形容词 · 可比的",
"常用 comparable to 或 with，表示在有关方面相似、可比较；不表示所有细节完全相同。",
"The two rooms are comparable in size.",
"这两个房间大小相仿。",
"We need data from a comparable period last year.",
"我们需要去年可比时期的数据。",
"https://www.oxfordlearnersdictionaries.com/definition/english/comparable"
],
[
"limitation",
"名词 · 局限",
"可指限制条件或能力不足，常用 limitation of；报告自己的研究局限不等于否定全部结果。",
"The main limitation is the small sample size.",
"主要局限在于样本量小。",
"The report acknowledges the limitation of using old maps.",
"报告承认使用旧地图的局限。",
"https://www.oxfordlearnersdictionaries.com/definition/english/limitation"
],
[
"protective",
"形容词 · 防护的",
"常放在 clothing、cover 等名词前说明保护作用；protective of 则表示很想保护某人或某物。",
"Wear protective gloves when handling the dye.",
"处理染料时要戴防护手套。",
"A protective cover keeps dust off the lens.",
"防护盖防止镜头落灰。",
"https://www.oxfordlearnersdictionaries.com/definition/english/protective"
],
[
"supplier",
"名词 · 供应商",
"指提供货物的人或公司，可数；supplier of 后接所供产品，与最终消费者不是同一角色。",
"The supplier confirmed that the parts were in stock.",
"供应商确认这些零件有库存。",
"We chose a local supplier of recycled paper.",
"我们选了一家当地再生纸供应商。",
"https://www.oxfordlearnersdictionaries.com/definition/english/supplier"
],
[
"flyer",
"名词 · 传单",
"本条指用于宣传的单页印刷品，可数；也有飞行员或航空旅客义，需按场景判断。",
"A flyer on the noticeboard advertised free music lessons.",
"告示板上的一张传单宣传免费音乐课。",
"She handed me a flyer about the community garden.",
"她递给我一张有关社区花园的传单。",
"https://www.oxfordlearnersdictionaries.com/definition/english/flyer"
],
[
"fountain",
"名词 · 喷泉",
"指靠泵把水喷向空中的设施，可数；drinking fountain 是饮水器，具体结构由修饰语确定。",
"Children gathered beside the fountain in the square.",
"孩子们聚在广场喷泉旁。",
"The fountain is switched off during winter.",
"喷泉冬季关闭。",
"https://www.oxfordlearnersdictionaries.com/definition/english/fountain"
],
[
"performance",
"名词 · 演出",
"指一次舞台或音乐等表演，可数；作工作或设备性能义时常不可数，不能一概按场次理解。",
"The evening performance begins at seven.",
"晚场演出七点开始。",
"Her performance of the final song moved the audience.",
"她对最后一首歌的演绎打动了观众。",
"https://www.oxfordlearnersdictionaries.com/definition/english/performance"
],
[
"diversity",
"名词 · 多样性",
"指包含多种不同人或事物的状态，通常不可数；diversity of 后接对象，不能仅凭总数量判断多样性。",
"The garden's diversity attracts many kinds of insects.",
"花园的多样性吸引了多种昆虫。",
"The course reflects the diversity of the students' interests.",
"课程体现了学生兴趣的多样性。",
"https://www.oxfordlearnersdictionaries.com/definition/english/diversity"
],
[
"philosopher",
"名词 · 哲学家",
"指研究、撰写哲学或深入思考根本问题的人，可数；不是所有发表意见的人都因此成为哲学家。",
"The philosopher questioned the meaning of freedom.",
"这位哲学家探讨了自由的含义。",
"We read an essay by a contemporary philosopher.",
"我们读了一位当代哲学家的文章。",
"https://www.oxfordlearnersdictionaries.com/definition/english/philosopher"
],
[
"workshop",
"名词 · 工作坊",
"指结合讨论和实际操作的学习活动，可数；同词也可指制作维修物品的工作间，需按活动或地点区别。",
"The museum offers a workshop on restoring old photographs.",
"博物馆提供修复旧照片的工作坊。",
"Each participant made a small model during the workshop.",
"每位参与者在工作坊中做了一个小模型。",
"https://www.oxfordlearnersdictionaries.com/definition/english/workshop"
],
[
"frequency",
"名词 · 频率",
"表示某事重复发生的次数或速率，常用 frequency of；物理波动频率另有对应量纲，需注意语境。",
"The new timetable increases the frequency of evening buses.",
"新时间表增加了晚间公交班次频率。",
"We recorded the frequency of each bird's calls.",
"我们记录了每只鸟鸣叫的频率。",
"https://www.oxfordlearnersdictionaries.com/definition/english/frequency"
],
[
"modest",
"形容词 · 适度的；不大的",
"本条描述数量或规模不大，常见 modest increase；形容人的谦逊义是另一范围。",
"The repairs required only a modest budget.",
"修理只需要一笔不大的预算。",
"We saw a modest improvement after changing the lighting.",
"更换照明后，我们看到了小幅改善。",
"https://www.oxfordlearnersdictionaries.com/definition/english/modest"
],
[
"uneducated",
"形容词 · 未受充分教育的",
"主要指缺少正规教育经历，不等同于不聪明；不应把个人价值或学习能力从学历推断出来。",
"The program provides training for uneducated adults.",
"这个项目为未受过正规教育的成年人提供培训。",
"The novel's uneducated narrator learns to read in prison.",
"小说中未受过教育的叙述者在监狱中学会了阅读。",
"https://www.oxfordlearnersdictionaries.com/definition/english/uneducated"
],
[
"endure",
"动词 · 忍受",
"直接接痛苦或困难，表示在持续承受中没有放弃；也可不及物表示持久，需看宾语。",
"The residents had to endure months of building noise.",
"居民们不得不忍受数月施工噪声。",
"Few materials can endure such extreme heat.",
"很少有材料能承受如此高温。",
"https://www.oxfordlearnersdictionaries.com/definition/english/endure"
],
[
"notable",
"形容词 · 值得注意的",
"常用于重要成就、差异等，notable for 表因某特点显著；不只表示被很多人认识。",
"There was a notable difference between the two samples.",
"两份样本之间有显著差异。",
"The building is notable for its unusual roof.",
"这栋建筑以不寻常的屋顶著称。",
"https://www.oxfordlearnersdictionaries.com/definition/english/notable"
],
[
"forgetful",
"形容词 · 健忘的",
"描述经常忘事的倾向，常用 become forgetful；不是表示某件事已被遗忘的 forgotten。",
"He has become more forgetful about appointments.",
"他变得更容易忘记约会。",
"A forgetful visitor left a hat on the bench.",
"一位健忘的游客把帽子落在了长凳上。",
"https://www.oxfordlearnersdictionaries.com/definition/english/forgetful"
],
[
"detector",
"名词 · 探测器",
"指用来发现特定物质或现象的设备，可数；smoke detector 表烟雾探测器，不是调查员 detective。",
"The smoke detector needs a new battery.",
"烟雾探测器需要一块新电池。",
"A metal detector helped locate the buried pipe.",
"金属探测器帮助找到了埋藏的管道。",
"https://www.oxfordlearnersdictionaries.com/definition/english/detector"
],
[
"lengthy",
"形容词 · 漫长的",
"形容时间或篇幅很长，常隐含过长，常见 lengthy discussion；不是只指物体空间长度。",
"The application involves a lengthy review process.",
"申请涉及一个漫长的审核过程。",
"After a lengthy discussion, we agreed on a date.",
"经过长时间讨论，我们商定了日期。",
"https://www.oxfordlearnersdictionaries.com/definition/english/lengthy"
],
[
"address",
"名词 · 地址",
"本条采用居住、工作或收件地址义，是可数名词；动词处理问题和发表演说是其他义项。",
"Please check the address before posting the parcel.",
"寄包裹前请核对地址。",
"The address on the envelope was difficult to read.",
"信封上的地址难以辨认。",
"https://www.oxfordlearnersdictionaries.com/definition/english/address"
],
[
"likelihood",
"名词 · 可能性",
"常用 likelihood of doing 或 likelihood that，表示事件发生可能程度；in all likelihood 表很可能。",
"The forecast suggests little likelihood of snow.",
"预报显示下雪的可能性很小。",
"In all likelihood, the repairs will finish tomorrow.",
"修理很可能明天结束。",
"https://www.oxfordlearnersdictionaries.com/definition/english/likelihood"
],
[
"justice",
"名词 · 公平；正义",
"泛指公平对待时通常不可数，常用 a sense of justice；司法机构义需按上下文另作理解。",
"The story appeals to the reader's sense of justice.",
"这个故事唤起读者的正义感。",
"The group campaigns for justice for displaced families.",
"该团体为流离失所家庭争取公正待遇。",
"https://www.oxfordlearnersdictionaries.com/definition/english/justice"
],
[
"twinkle",
"动词 · 闪烁",
"描述光亮忽明忽暗，也可形容眼中闪着喜悦，常用 twinkle in；不等于持续不变地照明。",
"Stars began to twinkle above the ridge.",
"山脊上方的星星开始闪烁。",
"Small lights twinkle along the path after dark.",
"天黑后，小灯沿着小路闪烁。",
"https://www.oxfordlearnersdictionaries.com/definition/english/twinkle"
],
[
"proof",
"名词 · 证据",
"表示足以表明某事真实的信息时通常不可数；proof of 后接内容，不宜把一点线索直接认作确证。",
"Keep the receipt as proof of purchase.",
"保留收据作为购买凭证。",
"The photograph is not proof that the two events are connected.",
"这张照片不能证明这两件事有关。",
"https://www.oxfordlearnersdictionaries.com/definition/english/proof"
],
[
"emigrate",
"动词 · 移居国外",
"强调从原来国家离开，常用 emigrate from A to B；immigrate 则强调迁入目的国。",
"Her grandparents chose to emigrate to Canada.",
"她的祖父母选择移居加拿大。",
"The family plans to emigrate after the school year ends.",
"这个家庭计划在学年结束后移居国外。",
"https://www.oxfordlearnersdictionaries.com/definition/english/emigrate"
],
[
"electronics",
"名词 · 电子学",
"作学科名称时虽以 s 结尾，通常接单数谓语；也可统称电子设备，需依上下文判断。",
"Electronics is one of the subjects offered at the college.",
"电子学是学院开设的科目之一。",
"He studies electronics to understand how sensors work.",
"他学习电子学，以了解传感器如何工作。",
"https://www.oxfordlearnersdictionaries.com/definition/english/electronics"
],
[
"outstanding",
"形容词 · 杰出的",
"可表示极为出色，也可表示尚未解决或支付；outstanding balance 不是出色的余额，须看名词搭配。",
"Her outstanding performance earned a long round of applause.",
"她的杰出演出赢得了长时间掌声。",
"Please settle the outstanding balance before Friday.",
"请在星期五前结清未付余额。",
"https://www.oxfordlearnersdictionaries.com/definition/english/outstanding"
],
[
"status",
"名词 · 状态；地位",
"可指当前进展或社会法律地位，常用 check the status of；本条例句采用进展状态范围。",
"You can check the status of your order online.",
"你可以在线查看订单状态。",
"The form asks for the current status of the application.",
"表格要求填写申请的当前状态。",
"https://www.oxfordlearnersdictionaries.com/definition/english/status"
],
[
"enroll",
"动词 · 注册入学",
"是美式拼写，英式常写 enrol；enroll in a course 表报名课程，可用主动或被动结构。",
"You can enroll in the evening course online.",
"你可以在线报名晚间课程。",
"The office will enroll new students next Monday.",
"办公室下星期一将为新学生办理注册。",
"https://dictionary.cambridge.org/dictionary/english/enroll"
],
[
"slightly",
"副词 · 略微",
"表示程度很小，常修饰比较级或形容词，如 slightly warmer；不能用作直接修饰名词的形容词。",
"The new shelf is slightly wider than the old one.",
"新架子比旧架子略宽。",
"Please move the lamp slightly to the left.",
"请把灯稍微向左移一点。",
"https://www.oxfordlearnersdictionaries.com/definition/english/slightly"
],
[
"necessity",
"名词 · 必要性",
"the necessity of 或 for 引出需要做的事，常不可数；a necessity 则指不可缺少的物品。",
"The storm showed the necessity of regular roof inspections.",
"暴风雨表明了定期检查屋顶的必要性。",
"Clean water is a necessity, not a luxury.",
"清洁饮用水是必需品，不是奢侈品。",
"https://www.oxfordlearnersdictionaries.com/definition/english/necessity"
],
[
"steady",
"形容词 · 稳定的",
"可描述持续均匀的变化或不晃动的物体；steady growth 不表示完全没有增长，而是增长规律。",
"The seedlings need a steady supply of water.",
"幼苗需要稳定供水。",
"Keep the ladder steady while I climb down.",
"我爬下来时请扶稳梯子。",
"https://www.oxfordlearnersdictionaries.com/definition/english/steady"
],
[
"unaware",
"形容词 · 未察觉的",
"通常用 unaware of 加名词，或 unaware that 加从句；不用 unaware about 作为本条重点搭配。",
"We were unaware of the change in opening hours.",
"我们不知道营业时间有了变化。",
"She seemed unaware that the microphone was still on.",
"她似乎没意识到麦克风还开着。",
"https://www.oxfordlearnersdictionaries.com/definition/english/unaware"
],
[
"terminal",
"名词 · 航站楼；终点站",
"交通语境指旅程起止或旅客集散的设施，可数；与表示疾病末期的形容词义不同。",
"A shuttle connects the terminal with the railway station.",
"接驳车连接航站楼与火车站。",
"We waited outside the ferry terminal.",
"我们在渡轮客运站外等候。",
"https://www.oxfordlearnersdictionaries.com/definition/english/terminal"
],
[
"realm",
"名词 · 领域",
"较正式地指活动、知识或兴趣范围，常用 in the realm of；不一定指有实体边界的地方。",
"The question belongs in the realm of ethics.",
"这个问题属于伦理领域。",
"The discovery opened a new realm of research.",
"这项发现开辟了一个新的研究领域。",
"https://www.oxfordlearnersdictionaries.com/definition/english/realm"
],
[
"dive",
"动词 · 跳水；潜水",
"可指头和手先入水，也可指在水下活动，dive into 引出进入的水域；不能一概理解为深潜。",
"Do not dive into water of unknown depth.",
"不要跳入深度不明的水域。",
"The birds dive beneath the surface to catch fish.",
"这些鸟潜入水下捕鱼。",
"https://www.oxfordlearnersdictionaries.com/definition/english/dive"
],
[
"genius",
"名词 · 天才",
"指极高天赋时通常不可数，指具有非凡才能的人时可数；a genius at 可说明擅长领域。",
"The exhibition celebrates her artistic genius.",
"这场展览赞颂她的艺术天才。",
"He is a genius at finding simple solutions.",
"他在寻找简单解决办法方面是个天才。",
"https://www.oxfordlearnersdictionaries.com/definition/english/genius"
],
[
"superior",
"形容词 · 更好的",
"比较对象通常用 to 引出，不用 than；superior quality 表质量较高，而等级更高是另一相关范围。",
"This fabric is superior to the cheaper alternative.",
"这种布料优于便宜的替代品。",
"The new lens produces images of superior quality.",
"新镜头生成质量更高的图像。",
"https://www.oxfordlearnersdictionaries.com/definition/english/superior"
],
[
"peek",
"名词 · 偷看",
"可数，常用 take a peek at 表快速看一眼，常有偷偷或提前看的意味；与山峰 peak 拼写不同。",
"The children took a peek at the covered model.",
"孩子们偷偷看了一眼盖着的模型。",
"We were allowed a quick peek inside the new studio.",
"我们获准快速看一眼新工作室内部。",
"https://www.oxfordlearnersdictionaries.com/definition/english/peek"
],
[
"decline",
"动词 · 减少；下降",
"用作数量减少时通常不及物，decline by 引出减少幅度；拒绝邀请义则可直接接邀请或 to do。",
"Visitor numbers tend to decline after summer.",
"游客数量往往在夏季后下降。",
"The figures may decline further if the shop remains closed.",
"如果商店继续关闭，数字可能进一步下降。",
"https://www.oxfordlearnersdictionaries.com/definition/english/decline"
],
[
"participant",
"名词 · 参与者",
"指参加某活动的人，可数；participant in 后接活动，不必然都是比赛选手或获奖者。",
"Each participant received a packet of seeds.",
"每位参与者都收到了一包种子。",
"A participant in the workshop suggested a simpler design.",
"工作坊的一位参与者提出了更简单的设计。",
"https://www.oxfordlearnersdictionaries.com/definition/english/participant"
],
[
"genetic",
"形容词 · 遗传的",
"表示与基因有关，常见 genetic information；与父母共享特征不等于已证实某种具体遗传机制。",
"The study compared genetic information from several populations.",
"研究比较了多个种群的遗传信息。",
"The course introduces basic genetic principles.",
"课程介绍基本遗传学原理。",
"https://www.oxfordlearnersdictionaries.com/definition/english/genetic"
],
[
"instantly",
"副词 · 立刻",
"强调几乎没有等待时间，常修饰动作发生；instantly recognizable 则强调马上就能辨认。",
"The screen went dark instantly.",
"屏幕立刻黑了。",
"She recognized the old melody instantly.",
"她立刻认出了那支旧曲子。",
"https://www.oxfordlearnersdictionaries.com/definition/english/instantly"
],
[
"tolerate",
"动词 · 容忍",
"可接名词或动名词，表示接受不喜欢的事物；不表示赞成，也不必然表示无限制地接受。",
"The plants cannot tolerate prolonged frost.",
"这些植物不能耐受长时间霜冻。",
"We do not tolerate shouting at volunteers.",
"我们不容忍对志愿者吼叫。",
"https://www.oxfordlearnersdictionaries.com/definition/english/tolerate"
],
[
"tie",
"动词 · 系",
"可用 tie A to B 表把某物系在另一物上；tie a knot 表打结，过去式拼作 tied。",
"Tie the boat to the wooden post.",
"把船系在木桩上。",
"Please tie a label to each bag.",
"请在每个包上系一个标签。",
"https://www.oxfordlearnersdictionaries.com/definition/english/tie"
],
[
"diagram",
"名词 · 示意图",
"指用简明线条说明机器、系统或过程的图，可数；a diagram of 后接被说明对象，不要求是照片。",
"The diagram beside the switch shows how to reset the heater.",
"开关旁的示意图显示如何重置加热器。",
"We added a diagram of the water system to the report.",
"我们在报告中加入了一张供水系统示意图。",
"https://dictionary.cambridge.org/dictionary/english/diagram"
],
[
"shade",
"名词 · 阴凉处",
"指阳光被遮挡后较暗凉的区域，通常不可数；in the shade 表在阴凉处，不用 under the shade 作默认搭配。",
"We moved the table into the shade.",
"我们把桌子移到了阴凉处。",
"The seedlings grow best in partial shade.",
"这些幼苗在半阴处生长最好。",
"https://www.oxfordlearnersdictionaries.com/definition/english/shade"
],
[
"association",
"名词 · 协会",
"指为某一共同目的组成的正式团体，可数；association with 表联系是不同句式和义项。",
"The residents formed an association to protect the park.",
"居民成立了一个保护公园的协会。",
"The association publishes a monthly newsletter.",
"协会每月出版一期通讯。",
"https://www.oxfordlearnersdictionaries.com/definition/english/association"
],
[
"priority",
"名词 · 优先事项",
"可指首先应处理的事，常用 top priority；give priority to 表优先考虑，不等于完全忽视其他需求。",
"Repairing the roof is our top priority.",
"修屋顶是我们首要任务。",
"The service gives priority to urgent deliveries.",
"这项服务优先处理紧急配送。",
"https://www.oxfordlearnersdictionaries.com/definition/english/priority"
],
[
"revenue",
"名词 · 收入",
"通常指机构经营所得或政府税收，常不可数；不等于扣除成本后的利润 profit。",
"Ticket revenue helps pay for maintenance.",
"门票收入有助于支付维护费用。",
"The report separates advertising revenue from donations.",
"报告把广告收入与捐款分开列出。",
"https://www.oxfordlearnersdictionaries.com/definition/english/revenue"
],
[
"severe",
"形容词 · 严重的",
"形容问题、天气等程度很强，常见 severe damage；也可形容惩罚严厉，需依名词判断。",
"The storm caused severe damage to the pier.",
"风暴对码头造成严重损坏。",
"Severe delays affected the morning trains.",
"严重延误影响了早间列车。",
"https://www.oxfordlearnersdictionaries.com/definition/english/severe"
],
[
"represent",
"动词 · 代表",
"指获授权替某人或团体行动发言，直接接被代表对象；不必然表示每位成员都持相同观点。",
"She will represent the class at the meeting.",
"她将在会议上代表全班。",
"The lawyer agreed to represent the family.",
"律师同意代理这个家庭。",
"https://www.oxfordlearnersdictionaries.com/definition/english/represent"
],
[
"temporary",
"形容词 · 临时的",
"表示只存在或使用一段有限时间，常见 temporary entrance；没有给出精确期限时不宜自行补出时长。",
"A temporary bridge provides access to the farm.",
"一座临时桥通往农场。",
"The library has moved to a temporary location.",
"图书馆已搬到临时地点。",
"https://www.oxfordlearnersdictionaries.com/definition/english/temporary"
],
[
"organic",
"形容词 · 有机种植的",
"用于食品或农业时常指按有机方式生产，具体认证依当地标准；化学中的有机是另一专业范围。",
"The farm sells organic vegetables at the weekend market.",
"这家农场在周末市场出售有机蔬菜。",
"She chose organic compost for the garden beds.",
"她为花坛选择了有机堆肥。",
"https://www.oxfordlearnersdictionaries.com/definition/english/organic"
],
[
"dwell",
"动词 · 居住",
"表示住在某地，常用 dwell in，语体较书面；dwell on 是反复思考另一事物，不是地点搭配。",
"The poem describes people who dwell beside the sea.",
"这首诗描写居住在海边的人们。",
"Few families still dwell in these old stone houses.",
"如今很少有家庭还住在这些旧石屋里。",
"https://www.oxfordlearnersdictionaries.com/definition/english/dwell"
],
[
"insure",
"动词 · 投保",
"insure something against 表为某种风险投保，insure with 可说明保险公司；不是所有语境都能替代确保 ensure。",
"We need to insure the equipment against theft.",
"我们需要为设备投保盗窃险。",
"They decided to insure the house before moving in.",
"他们决定在搬入前给房屋投保。",
"https://www.oxfordlearnersdictionaries.com/definition/english/insure"
],
[
"ingredient",
"名词 · 原料",
"指制作食物所用的成分，可数；也可比喻成功所需因素，ingredient in 引出所属食物或混合物。",
"Check each ingredient before starting the recipe.",
"按食谱开始制作前先检查每种原料。",
"Patience is an important ingredient in careful restoration.",
"耐心是细致修复工作的重要要素。",
"https://www.oxfordlearnersdictionaries.com/definition/english/ingredient"
],
[
"friction",
"名词 · 摩擦",
"物理语境中指表面相对运动时的阻力，通常不可数；也可比喻人与组织间的分歧。",
"Oil reduces friction between the moving parts.",
"油能减少运动部件间的摩擦。",
"The experiment measures friction on different surfaces.",
"实验测量不同表面上的摩擦力。",
"https://www.oxfordlearnersdictionaries.com/definition/english/friction"
],
[
"donation",
"名词 · 捐赠",
"可指捐出的金钱物品或捐赠行为，a donation to 表捐给某机构；不是每笔付款都属于捐款。",
"A small donation helped buy new art supplies.",
"一笔小额捐款帮助购置了新美术用品。",
"The shelter received a donation of blankets.",
"收容所收到了一批捐赠的毯子。",
"https://www.oxfordlearnersdictionaries.com/definition/english/donation"
],
[
"breakdown",
"名词 · 故障",
"本条指机器或车辆停止正常工作的事件，可数；a breakdown of costs 是费用明细，别误译为费用故障。",
"A breakdown delayed the delivery van.",
"一次故障耽搁了送货车。",
"The engineers investigated the cause of the breakdown.",
"工程师调查了故障原因。",
"https://www.oxfordlearnersdictionaries.com/definition/english/breakdown"
],
[
"punctuation",
"名词 · 标点",
"指分隔句子和短语等的符号或使用规则，通常不可数；具体一个符号可说 a punctuation mark。",
"Correct punctuation makes the instructions easier to follow.",
"正确的标点使说明更容易理解。",
"The teacher asked us to check spelling and punctuation.",
"老师要求我们检查拼写和标点。",
"https://www.oxfordlearnersdictionaries.com/definition/english/punctuation"
],
[
"conquest",
"名词 · 征服",
"指用武力取得对地区的控制，常用 conquest of；历史叙述中不等同于自愿和平加入。",
"The chapter describes the conquest of the coastal region.",
"这一章描述对沿海地区的征服。",
"The museum examines the effects of conquest on local communities.",
"博物馆考察了征服对当地社区的影响。",
"https://www.oxfordlearnersdictionaries.com/definition/english/conquest"
],
[
"stake",
"名词 · 股份",
"在商业语境常用 a stake in 表某企业中的股权或利益份额；与木桩义不同，不能按物理支撑理解。",
"The investor bought a small stake in the company.",
"投资者购买了这家公司的一小部分股份。",
"Her stake in the business gives her voting rights.",
"她在企业中的股份赋予她投票权。",
"https://www.oxfordlearnersdictionaries.com/definition/english/stake"
],
[
"screening",
"名词 · 放映",
"电影语境指一次影片展示活动，可数；医疗筛查是另一义项，不能把 screening 统一译为放电影。",
"The screening will be followed by a discussion.",
"放映后将进行讨论。",
"We booked seats for a special screening of the documentary.",
"我们预订了纪录片特别放映的座位。",
"https://www.oxfordlearnersdictionaries.com/definition/english/screening"
],
[
"cord",
"名词 · 绳；电线",
"指较粗的线绳，也可指有绝缘层的电源线；power cord 表电源线，按所连接对象辨义。",
"Tie the parcel with a length of cord.",
"用一段绳子把包裹系好。",
"Keep the power cord away from the hot plate.",
"让电源线远离加热板。",
"https://www.oxfordlearnersdictionaries.com/definition/english/cord"
],
[
"constant",
"形容词 · 持续的；不变的",
"既可表示经常不断发生，也可表示数值不变；constant noise 不一定说明音量始终相同。",
"The constant noise made it hard to concentrate.",
"持续的噪声让人难以集中注意力。",
"Keep the pressure constant during the test.",
"测试期间保持压力不变。",
"https://www.oxfordlearnersdictionaries.com/definition/english/constant"
],
[
"steer",
"动词 · 驾驶；控制方向",
"可直接接船车等，也可不及物接方向短语；steer clear of 表避开，是相关固定用法。",
"She learned to steer the boat through narrow channels.",
"她学会了驾驶小船穿过狭窄水道。",
"Steer clear of the rocks near the shore.",
"避开岸边的礁石。",
"https://www.oxfordlearnersdictionaries.com/definition/english/steer"
],
[
"possession",
"名词 · 拥有",
"in possession of 表拥有某物，in someone's possession 表由某人持有；possessions 复数还可指个人物品。",
"The key is still in her possession.",
"钥匙仍由她保管。",
"The family took possession of the house in spring.",
"这家人在春天接收了房屋。",
"https://www.oxfordlearnersdictionaries.com/definition/english/possession"
],
[
"runaway",
"形容词 · 失控的",
"本条指车辆或动物等脱离控制，放在名词前；也可指离家出走的，与一般快速运动不同。",
"A runaway cart rolled toward the gate.",
"一辆失控手推车滚向大门。",
"The driver managed to stop the runaway vehicle.",
"司机设法停下了失控车辆。",
"https://www.oxfordlearnersdictionaries.com/definition/english/runaway"
],
[
"heroine",
"名词 · 女主角",
"可指故事中的主要女性角色，也可指因英勇行为受敬重的女性；本条例句限定文学角色。",
"The heroine returns to her village in the final chapter.",
"女主角在最后一章回到了村庄。",
"The novel's heroine works as a lighthouse keeper.",
"小说的女主角是一名灯塔看守人。",
"https://www.oxfordlearnersdictionaries.com/definition/english/heroine"
],
[
"petal",
"名词 · 花瓣",
"指花冠中通常较薄、有色的片状部分，可数；a petal 不是整朵花，也不同于叶片。",
"A pink petal floated on the pond.",
"一片粉色花瓣漂在池塘上。",
"She pressed a rose petal between the pages.",
"她把一片玫瑰花瓣压在书页间。",
"https://www.oxfordlearnersdictionaries.com/definition/english/petal"
],
[
"precisely",
"副词 · 精确地",
"可表示时间数量等完全准确，也可用来强调正是如此；修饰表达时常见 precisely what。",
"The machine cuts each piece precisely.",
"机器精确切割每个部件。",
"That is precisely what I meant.",
"那正是我的意思。",
"https://www.oxfordlearnersdictionaries.com/definition/english/precisely"
],
[
"extract",
"名词 · 摘录",
"本条采用书籍或乐曲中节选片段的名词义，重音在前；动词提取重音通常在后。",
"The teacher read an extract from the travel diary.",
"老师读了一段旅行日记的摘录。",
"This extract gives a sense of the author's humor.",
"这段摘录让人感受到作者的幽默。",
"https://www.oxfordlearnersdictionaries.com/definition/english/extract"
],
[
"frontier",
"名词 · 边境",
"指国家间分界及附近区域，可数；on the frontier 表处在边境，现代常也用 border。",
"The road follows the frontier for several miles.",
"这条路沿边境延伸了几英里。",
"A small station stands near the frontier.",
"边境附近有一座小车站。",
"https://www.oxfordlearnersdictionaries.com/definition/english/frontier"
],
[
"prosper",
"动词 · 兴旺",
"是不及物动词，指人、事业等发展成功；不能直接把财富作为宾语，常用 prosper through 等说明原因。",
"Small businesses can prosper with reliable transport.",
"有可靠交通时，小企业可以兴旺发展。",
"The village began to prosper after the market reopened.",
"市场重新开放后，村庄开始繁荣起来。",
"https://www.oxfordlearnersdictionaries.com/definition/english/prosper"
],
[
"steep",
"形容词 · 陡峭的",
"描述坡度大，也可指变化幅度急剧，常见 steep rise；本条例句分别展示地形与变化义。",
"A steep path leads to the tower.",
"一条陡峭小路通往塔楼。",
"The chart shows a steep rise in fuel costs.",
"图表显示燃料费用急剧上升。",
"https://www.oxfordlearnersdictionaries.com/definition/english/steep"
],
[
"radiation",
"名词 · 辐射",
"表示以波或粒子等形式传播的能量，通常不可数；并非出现该词就一定指核事故或有害剂量。",
"The instrument measures radiation from the Sun.",
"这台仪器测量来自太阳的辐射。",
"The material blocks some forms of radiation.",
"这种材料能阻挡某些形式的辐射。",
"https://www.oxfordlearnersdictionaries.com/definition/english/radiation"
],
[
"deposit",
"名词 · 押金；订金",
"可指预付的一部分价款，也可指租赁时可依条件退还的押金；是否退还应看具体约定。",
"We paid a deposit to reserve the room.",
"我们付了订金预留房间。",
"The bicycle hire includes a refundable deposit.",
"租自行车需交一笔可退押金。",
"https://www.oxfordlearnersdictionaries.com/definition/english/deposit"
],
[
"commitment",
"名词 · 承诺；投入",
"a commitment to do 表承诺行动，commitment to 后接名词或动名词也可表示投入；to 的功能需看结构。",
"The council made a commitment to repair the playground.",
"议会承诺修复游乐场。",
"Her commitment to teaching impressed the whole team.",
"她对教学的投入给全队留下深刻印象。",
"https://www.oxfordlearnersdictionaries.com/definition/english/commitment"
],
[
"crucial",
"形容词 · 关键的",
"强调结果会明显依赖该因素，常用 crucial to 或 for；不是任何轻微相关因素都具有关键作用。",
"Clean water is crucial to the seedlings' survival.",
"清洁水源对幼苗存活至关重要。",
"The next measurement will be crucial for our decision.",
"下一次测量对我们的决定将至关重要。",
"https://www.oxfordlearnersdictionaries.com/definition/english/crucial"
],
[
"inhale",
"动词 · 吸入",
"可直接接空气、烟等，也可不及物表示吸气；对应呼气为 exhale，不表示吞咽进入消化道。",
"Do not inhale the dust from the broken tiles.",
"不要吸入碎瓷砖产生的粉尘。",
"Inhale slowly before beginning the next note.",
"开始下一个音之前先慢慢吸气。",
"https://www.oxfordlearnersdictionaries.com/definition/english/inhale"
],
[
"oval",
"形容词 · 椭圆形的",
"描述类似蛋形的圆长形状，常放在 table、frame 等名词前；不能仅按比圆长一点作精确数学定义。",
"An oval mirror hangs above the desk.",
"书桌上方挂着一面椭圆镜。",
"She served the fish on an oval plate.",
"她用椭圆盘盛鱼。",
"https://www.oxfordlearnersdictionaries.com/definition/english/oval"
],
[
"civic",
"形容词 · 城市的；市民的",
"常修饰城市公共事务或市民责任，如 civic duties；与表示民事或一般文明礼貌的 civil 不完全相同。",
"The school organized a lesson on civic responsibility.",
"学校组织了一堂关于公民责任的课。",
"A civic ceremony marked the library's anniversary.",
"一场市政典礼纪念了图书馆的周年。",
"https://www.oxfordlearnersdictionaries.com/definition/english/civic"
],
[
"theorize",
"动词 · 提出理论",
"通常接 about 或 that 从句，表示提出解释性观点；提出理论不代表已经用数据证实。",
"Researchers theorize that the stones were moved by water.",
"研究人员提出，这些石头可能由水搬运。",
"The class began to theorize about the missing layer.",
"全班开始对缺失地层提出理论解释。",
"https://www.oxfordlearnersdictionaries.com/definition/english/theorize"
],
[
"magnetic",
"形容词 · 磁性的",
"描述磁体的作用、性质或相关现象，如 magnetic field；不要与只表示电流的 electric 一概等同。",
"A magnetic strip holds the tools against the wall.",
"一条磁条把工具吸附在墙上。",
"The compass responds to the Earth's magnetic field.",
"指南针对地球磁场作出反应。",
"https://www.oxfordlearnersdictionaries.com/definition/english/magnetic"
],
[
"rear",
"形容词 · 后部的",
"此处是形容词，置于门、窗等名词前说明后侧位置；名词后部、动词抚养是其他词性用法。",
"Please use the rear entrance during repairs.",
"维修期间请使用后门。",
"The van's rear window was covered in dust.",
"货车的后窗蒙着灰尘。",
"https://www.oxfordlearnersdictionaries.com/definition/english/rear"
],
[
"stain",
"动词 · 染污",
"可及物表示留下难去除的污渍，也可不及物表示容易沾染；另有有意染色义，需看对象。",
"Berry juice can stain a white tablecloth.",
"浆果汁会在白桌布上留下污渍。",
"This fabric does not stain easily.",
"这种布料不容易沾上污渍。",
"https://www.oxfordlearnersdictionaries.com/definition/english/stain"
],
[
"distinguish",
"动词 · 区分",
"distinguish A from B 或 distinguish between A and B 都可表辨别差异；不要省略连接比较对象的介词。",
"Can you distinguish the original from the copy?",
"你能分辨原件和复制品吗？",
"The test helps distinguish between the two materials.",
"这项测试有助于区分这两种材料。",
"https://www.oxfordlearnersdictionaries.com/definition/english/distinguish"
],
[
"crustal",
"形容词 · 地壳的",
"用于地质学中与地球坚硬外层有关的结构或运动，常见 crustal movement；不泛指面包硬壳。",
"The diagram shows crustal movement near the fault.",
"示意图展示断层附近的地壳运动。",
"The team measured changes in crustal thickness.",
"团队测量了地壳厚度的变化。",
"https://dictionary.cambridge.org/dictionary/english/crustal"
],
[
"instill",
"动词 · 逐渐灌输",
"美式拼写，英式 instil；常用 instill something in someone，表示逐渐培养某种观念或感受。",
"The course aims to instill confidence in new teachers.",
"课程旨在逐渐增强新教师的信心。",
"Her example helped instill a respect for careful work.",
"她的榜样帮助培养了对细致工作的尊重。",
"https://dictionary.cambridge.org/dictionary/english/instill"
],
[
"inadequacy",
"名词 · 不足",
"可指数量不够或质量不足，the inadequacy of 后接对象；也可指无能为力感，需看主语。",
"The report exposes the inadequacy of the current drainage system.",
"报告揭示了现有排水系统的不足。",
"She spoke openly about her feelings of inadequacy.",
"她坦率谈到了自己的无能为力感。",
"https://www.oxfordlearnersdictionaries.com/definition/english/inadequacy"
],
[
"namely",
"副词 · 即；也就是",
"用于把前面笼统提到的事物具体列明，不是随意举例；列举只是部分例子时应考虑 for example。",
"We need one missing item, namely the original receipt.",
"我们缺少一件东西，也就是原始收据。",
"Two rooms are closed, namely the kitchen and the study.",
"两间房关闭着，即厨房和书房。",
"https://www.oxfordlearnersdictionaries.com/definition/english/namely"
],
[
"supposedly",
"副词 · 据称",
"表示依据他人说法或通常看法但尚不确定，有时带怀疑；不应译成说话者已经独立证实。",
"The path is supposedly shorter than the main road.",
"据说这条小路比主路短。",
"The box supposedly contains the missing tools.",
"据称这个箱子装着遗失的工具。",
"https://www.oxfordlearnersdictionaries.com/definition/english/supposedly"
],
[
"drawback",
"名词 · 缺点",
"指使计划或事物不那么有吸引力的不利因素，可数；a drawback of 后接对象，不表示彻底不可行。",
"The main drawback is the lack of storage space.",
"主要缺点是缺乏储物空间。",
"A long journey is one drawback of living here.",
"路途遥远是住在这里的一个不利之处。",
"https://www.oxfordlearnersdictionaries.com/definition/english/drawback"
],
[
"resort",
"名词 · 度假胜地",
"本条指供游客度假的地方，可数，常见 seaside resort；resort to 是求助于的动词结构。",
"The resort offers guided walks along the coast.",
"这个度假区提供沿海岸的导览徒步。",
"We visited a small mountain resort after the conference.",
"会议后我们去了一个小型山地度假地。",
"https://www.oxfordlearnersdictionaries.com/definition/english/resort"
],
[
"villa",
"名词 · 别墅",
"常指乡间或度假地区的独立住宅，可数；不必然表示超级豪华，具体规模由语境补充。",
"They rented a villa overlooking the bay.",
"他们租了一栋俯瞰海湾的别墅。",
"The villa has a shaded terrace and a small garden.",
"别墅有遮阴露台和小花园。",
"https://www.oxfordlearnersdictionaries.com/definition/english/villa"
],
[
"contrary",
"名词 · 相反情况",
"on the contrary 表纠正前述说法并指出相反情况；不用于只补充一个不同但并不相反的事实。",
"The room was not cold; on the contrary, it was very warm.",
"房间并不冷，恰恰相反，它很暖和。",
"We found no evidence to the contrary.",
"我们没有找到相反的证据。",
"https://dictionary.cambridge.org/dictionary/english/contrary"
],
[
"uncover",
"动词 · 揭开；发现",
"可指移开覆盖物，也可指查出隐情，直接接对象；发觉事实并不一定意味着有意调查。",
"Please uncover the dishes just before serving.",
"请在上菜前揭开盖着的餐盘。",
"The investigation may uncover the cause of the leak.",
"调查可能发现泄漏原因。",
"https://www.oxfordlearnersdictionaries.com/definition/english/uncover"
],
[
"parallel",
"形容词 · 平行的",
"常用 parallel to 表示线或物体保持相同方向且间距不变；similar 的相似不一定是几何平行。",
"The path runs parallel to the railway.",
"小路与铁路平行延伸。",
"Draw two parallel lines across the page.",
"在纸上横着画两条平行线。",
"https://www.oxfordlearnersdictionaries.com/definition/english/parallel"
],
[
"distinctly",
"副词 · 清楚地",
"表示能清晰感知或辨认，常用 remember distinctly；也可表示明显带有某特征，需按所修饰内容判断。",
"I distinctly remember locking the gate.",
"我清楚记得锁了大门。",
"We could hear the bell distinctly through the fog.",
"雾中我们仍能清楚听见钟声。",
"https://www.oxfordlearnersdictionaries.com/definition/english/distinctly"
],
[
"progressive",
"形容词 · 逐渐发展的",
"此处取逐步发展的义项，常见 progressive change；政治理念的进步派义不能机械套入所有场景。",
"The graph shows a progressive decline in water levels.",
"图表显示水位逐步下降。",
"The course introduces skills through progressive stages.",
"课程通过循序渐进的阶段介绍技能。",
"https://www.oxfordlearnersdictionaries.com/definition/english/progressive"
],
[
"compromise",
"名词 · 妥协",
"指双方各让一部分以达成的协议，常用 reach a compromise；并不表示任何一方完全达到原目标。",
"We reached a compromise on the opening hours.",
"我们就开放时间达成了妥协。",
"The design is a compromise between comfort and low weight.",
"这个设计是在舒适性和轻量之间的折中。",
"https://www.oxfordlearnersdictionaries.com/definition/english/compromise"
],
[
"delicate",
"形容词 · 易损的",
"可形容脆弱材料或需要小心处理的物体，常见 delicate fabric；与精致、棘手等义项依对象区别。",
"Handle the delicate glass with both hands.",
"请用双手拿取易碎玻璃器皿。",
"These delicate plants need shelter from strong winds.",
"这些脆弱植物需要避开强风。",
"https://www.oxfordlearnersdictionaries.com/definition/english/delicate"
],
[
"geothermal",
"形容词 · 地热的",
"用于地球内部热量相关的能源或现象，常见 geothermal energy；不等同于太阳光直接带来的热。",
"The town uses geothermal energy to heat public buildings.",
"这个镇子利用地热能为公共建筑供暖。",
"Geothermal activity warms the water beneath the valley.",
"地热活动加热了山谷下的水。",
"https://www.oxfordlearnersdictionaries.com/definition/english/geothermal"
],
[
"reference",
"名词 · 提及；参考",
"a reference to 表提及对象，for reference 表供查考；reference book 是查阅资料的书，需按搭配辨义。",
"The article includes a reference to the old harbor.",
"文章提到了旧港口。",
"Keep a copy of the plan for reference.",
"留一份计划副本供参考。",
"https://www.oxfordlearnersdictionaries.com/definition/english/reference"
],
[
"undo",
"动词 · 解开；撤销",
"可直接接系紧的东西或某项操作，过去式 undid、过去分词 undone；不按普通规则加 ed。",
"Please undo the knot without cutting the rope.",
"请解开绳结，不要割断绳子。",
"You can undo the last change with this button.",
"你可以用这个按钮撤销上一次更改。",
"https://www.oxfordlearnersdictionaries.com/definition/english/undo"
],
[
"archaeologist",
"名词 · 考古学家",
"指通过遗址、器物等研究人类过去的人，可数；不把研究恐龙的古生物学家一概叫作此词。",
"An archaeologist examined the pottery fragments.",
"一位考古学家检查了陶器碎片。",
"The archaeologist recorded the position of each object.",
"考古学家记录了每件物品的位置。",
"https://www.oxfordlearnersdictionaries.com/definition/english/archaeologist"
],
[
"stab",
"动词 · 刺",
"表示用尖物刺入，可用 stab something with；也可表快速戳向某物，是否刺入需看语境。",
"The actor pretended to stab the cushion with a wooden sword.",
"演员假装用木剑刺向垫子。",
"She used a fork to stab a piece of potato.",
"她用叉子叉起一块土豆。",
"https://www.oxfordlearnersdictionaries.com/definition/english/stab"
],
[
"pierce",
"动词 · 刺穿",
"指尖物穿过或刺出小孔，直接接被穿透的物体；也可用声音等作主语表示穿透安静。",
"A sharp thorn can pierce a thin glove.",
"尖刺能刺穿薄手套。",
"Use a needle to pierce the paper at each marked point.",
"用针在每个标记点刺穿纸张。",
"https://www.oxfordlearnersdictionaries.com/definition/english/pierce"
],
[
"margin",
"名词 · 页边空白",
"指页面边缘留出的空白，可数；write in the margin 表在页边写字，盈利差额是另一义项。",
"She wrote a question in the margin.",
"她在页边写了一个问题。",
"Leave a wider margin for the editor's notes.",
"留宽一些页边空白，供编辑写批注。",
"https://www.oxfordlearnersdictionaries.com/definition/english/margin"
],
[
"candid",
"形容词 · 坦率的",
"表示公开真实地表达想法，常用 candid about；摄影中的 candid 指自然抓拍，并非坦率说话。",
"She was candid about the project's difficulties.",
"她坦率谈到了项目的困难。",
"We welcomed his candid assessment of the design.",
"我们欢迎他对设计的坦率评价。",
"https://www.oxfordlearnersdictionaries.com/definition/english/candid"
],
[
"scatter",
"动词 · 撒开",
"可指把东西撒向各处，也可指人或动物四散，scatter over 引出散布范围；不是整齐成排摆放。",
"Scatter the seeds thinly over the soil.",
"把种子稀疏地撒在土上。",
"The sudden noise made the birds scatter.",
"突然的声响使鸟群四散。",
"https://www.oxfordlearnersdictionaries.com/definition/english/scatter"
],
[
"component",
"名词 · 组成部分",
"指构成整体的一部分，可数，a component of 后接整体；既可用于机器，也可用于计划等抽象事物。",
"Each component is tested before assembly.",
"每个部件组装前都经过测试。",
"Reading is an important component of the course.",
"阅读是这门课程的重要组成部分。",
"https://www.oxfordlearnersdictionaries.com/definition/english/component"
],
[
"undergo",
"动词 · 经历",
"直接接变化、检查或过程，过去式 underwent，过去分词 undergone；不能当作 go 的普通加前缀形式变位。",
"The bridge will undergo repairs this winter.",
"这座桥将在今冬接受修缮。",
"Participants must undergo a brief assessment.",
"参与者必须接受一个简短评估。",
"https://www.oxfordlearnersdictionaries.com/definition/english/undergo"
],
[
"instance",
"名词 · 例子",
"an instance of 表某现象的一个具体事例；for instance 是例如，通常用于列举而非专指一次时间。",
"This is a rare instance of the two species sharing a nest.",
"这是这两个物种共享一个巢的罕见例子。",
"You could use a lighter material, for instance, bamboo.",
"你可以用较轻的材料，例如竹子。",
"https://www.oxfordlearnersdictionaries.com/definition/english/instance"
],
[
"sting",
"动词 · 叮；刺痛",
"可指昆虫用刺使皮肤疼痛，也可指伤口等有刺痛感；过去式和过去分词都是 stung。",
"A bee may sting if it feels threatened.",
"蜜蜂感到受威胁时可能蜇人。",
"The cut began to sting when water touched it.",
"伤口碰水后开始刺痛。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sting"
],
[
"indicator",
"名词 · 指标；指示器",
"可指反映变化的迹象或设备上的显示装置，可数；指标与结果可能有关联，但不等于单独因果证明。",
"Leaf color can be an indicator of plant health.",
"叶色可以是植物健康状况的指标。",
"The pressure indicator moved into the red zone.",
"压力指示器进入了红区。",
"https://www.oxfordlearnersdictionaries.com/definition/english/indicator"
],
[
"exploit",
"动词 · 利用；剥削",
"可中性表示充分利用资源，也可贬义表示不公平利用别人；动词重音通常在后，须依宾语辨义。",
"The design will exploit natural light from the roof.",
"设计将充分利用屋顶采光。",
"The rules aim to stop employers who exploit vulnerable workers.",
"这些规则旨在阻止雇主剥削处境脆弱的工人。",
"https://www.oxfordlearnersdictionaries.com/definition/english/exploit"
],
[
"narrator",
"名词 · 叙述者",
"指讲述故事或纪录片解说的人，可数；不一定与现实作者同一人，也不保证叙述完全可靠。",
"The narrator describes the village through a child's eyes.",
"叙述者通过儿童的眼光描写村庄。",
"A different narrator reads each chapter of the recording.",
"录音的每一章由不同叙述者朗读。",
"https://www.oxfordlearnersdictionaries.com/definition/english/narrator"
],
[
"deforest",
"动词 · 砍伐森林",
"是及物动词，表示移除某地区的森林，宾语通常是土地或区域；不用于修剪一根树枝。",
"The company planned to deforest the hillside.",
"公司计划砍掉山坡上的森林。",
"New rules make it harder to deforest protected land.",
"新规则使砍伐受保护土地上的森林更加困难。",
"https://www.oxfordlearnersdictionaries.com/definition/english/deforest"
],
[
"medieval",
"形容词 · 中世纪的",
"描述欧洲等历史语境中与中世纪相关的建筑、文学等；具体年代分期依研究传统，不宜随意套固定年份。",
"The church has a medieval stone doorway.",
"这座教堂有一道中世纪石门。",
"The course includes medieval poetry and music.",
"课程包括中世纪诗歌与音乐。",
"https://www.oxfordlearnersdictionaries.com/definition/english/medieval"
],
[
"hop",
"动词 · 跳跃",
"人可指单脚跳，兔鸟等可指双脚或四脚短跳；hop onto 表跳到某处，不一概等于长距离跳远。",
"The children hop across the painted squares.",
"孩子们单脚跳过画出的方格。",
"A small bird began to hop along the wall.",
"一只小鸟开始沿墙跳跃。",
"https://www.oxfordlearnersdictionaries.com/definition/english/hop"
],
[
"physicist",
"名词 · 物理学家",
"指研究物理学的科学家，可数；与医生 physician 拼写相近但职业和含义不同。",
"A physicist explained how the detector works.",
"一位物理学家解释了探测器如何工作。",
"The physicist tested the model under different temperatures.",
"物理学家在不同温度下测试模型。",
"https://www.oxfordlearnersdictionaries.com/definition/english/physicist"
],
[
"elaborate",
"形容词 · 精心复杂的",
"本条是形容词，描述有许多细节且精心安排的事物；动词 elaborate on 表详述，结尾读音不同。",
"The festival involved an elaborate lantern display.",
"节庆中有一场精心制作的花灯展示。",
"She prepared an elaborate model of the harbor.",
"她制作了一个精细复杂的港口模型。",
"https://www.oxfordlearnersdictionaries.com/definition/english/elaborate"
],
[
"nasty",
"形容词 · 令人不快的",
"口语中可形容糟糕事物，也可形容人不友善，常用 nasty to；语气依对象变化，不等于医学严重程度。",
"A nasty smell came from the blocked drain.",
"堵塞的排水沟散发出难闻气味。",
"There is no reason to be nasty to the new volunteer.",
"没有理由对新志愿者不友善。",
"https://www.oxfordlearnersdictionaries.com/definition/english/nasty"
],
[
"worship",
"名词 · 宗教敬拜",
"表示通过祈祷等向神表达敬意的活动，通常不可数，常见 a place of worship；本条不采用动词义。",
"The building is still used as a place of worship.",
"这栋建筑仍被用作宗教敬拜场所。",
"Music plays a central role in their worship.",
"音乐在他们的宗教敬拜中占核心地位。",
"https://www.oxfordlearnersdictionaries.com/definition/english/worship"
],
[
"deviate",
"动词 · 偏离",
"通常用 deviate from 后接路线、规则或惯例，是不及物结构；不把偏离对象直接作宾语。",
"Do not deviate from the marked path near the cliff.",
"靠近悬崖时不要偏离标出的道路。",
"We had to deviate from the original schedule after the storm.",
"风暴后我们不得不偏离原时间表。",
"https://www.oxfordlearnersdictionaries.com/definition/english/deviate"
],
[
"shed",
"动词 · 脱落；摆脱",
"直接接脱去或摆脱的东西，过去式和过去分词仍为 shed；与名词棚屋需按句法区分。",
"These trees shed their leaves in autumn.",
"这些树在秋季落叶。",
"The dog begins to shed its winter coat in spring.",
"这只狗春天开始脱去冬毛。",
"https://www.oxfordlearnersdictionaries.com/definition/english/shed"
],
[
"ongoing",
"形容词 · 持续的",
"形容仍在进行或发展的活动，常见 ongoing investigation；不代表已经完成，也不表示将永远继续。",
"The gallery stayed open during ongoing repairs.",
"画廊在持续维修期间仍然开放。",
"The report forms part of an ongoing study of river habitats.",
"报告是一项持续进行的河流栖息地研究的一部分。",
"https://www.oxfordlearnersdictionaries.com/definition/english/ongoing"
],
[
"reliant",
"形容词 · 依赖的",
"通常用 reliant on 引出所依赖的人或资源，形容词不能像 rely 一样直接作谓语动词。",
"The village is heavily reliant on the ferry service.",
"这个村庄高度依赖渡轮服务。",
"The young animals remain reliant on their mothers for food.",
"幼兽仍依赖母亲获得食物。",
"https://www.oxfordlearnersdictionaries.com/definition/english/reliant"
],
[
"revolutionize",
"动词 · 彻底改变",
"指对做事方法产生巨大变革，直接接领域或过程；语义强于小幅改进，不能把所有更新都称为革新。",
"Cheap printing helped revolutionize the spread of information.",
"廉价印刷帮助彻底改变了信息传播。",
"The new sensor could revolutionize how we monitor the reef.",
"新传感器可能彻底改变我们监测珊瑚礁的方式。",
"https://www.oxfordlearnersdictionaries.com/definition/english/revolutionize"
],
[
"specialist",
"名词 · 专家",
"指专门研究或从事某领域的人，可用 specialist in；医疗场景可指专科医生，不是任何工作人员的同义词。",
"A lighting specialist examined the exhibition space.",
"一位照明专家检查了展览空间。",
"The museum consulted a specialist in ancient pottery.",
"博物馆咨询了一位古陶器专家。",
"https://www.oxfordlearnersdictionaries.com/definition/english/specialist"
],
[
"tend",
"动词 · 往往",
"tend to do 表通常易于出现某行为或结果；不是每次必然发生，照料的及物义是另一范围。",
"These paths tend to flood after heavy rain.",
"这些小路大雨后往往积水。",
"Careful builders tend to read the instructions before unpacking the parts.",
"细心的搭建者往往在拆开零件包装前先读说明。",
"https://www.oxfordlearnersdictionaries.com/definition/english/tend"
],
[
"erosion",
"名词 · 侵蚀",
"常指风水逐渐磨损地表的过程，通常不可数，soil erosion 表水土流失；削弱信任是引申义。",
"Plant roots help prevent soil erosion on the slope.",
"植物根系有助于防止坡面土壤侵蚀。",
"The photographs document years of coastal erosion.",
"这些照片记录了多年的海岸侵蚀。",
"https://www.oxfordlearnersdictionaries.com/definition/english/erosion"
],
[
"suppose",
"动词 · 认为；猜想",
"常接 that 从句表达根据现有情况的判断，确定性有限；be supposed to 则有应当等不同用法。",
"I suppose the shop closes early on Sundays.",
"我想这家店星期日提早关门。",
"We suppose that the marks were made by a small animal.",
"我们推测这些痕迹是一只小动物留下的。",
"https://www.oxfordlearnersdictionaries.com/definition/english/suppose"
],
[
"commodity",
"名词 · 商品",
"常指可交易的产品或原材料，可数，常见 agricultural commodity；不应把个人直接当作可买卖商品。",
"Coffee became an important commodity in the port.",
"咖啡成为这个港口的重要商品。",
"The price of this commodity changes throughout the year.",
"这种商品的价格全年都在变化。",
"https://www.oxfordlearnersdictionaries.com/definition/english/commodity"
],
[
"advantageous",
"形容词 · 有利的",
"常用 advantageous to 或 for 说明对谁有利；表示在特定条件下有好处，不保证所有对象都受益。",
"An early start would be advantageous for the repair team.",
"早点开工对维修队有利。",
"The site is advantageous because it is close to the railway.",
"这个地点因靠近铁路而有优势。",
"https://www.oxfordlearnersdictionaries.com/definition/english/advantageous"
],
[
"fleshy",
"形容词 · 肉质的",
"可形容植物部位厚软、多汁或肉多；本条例句限植物形态，不用来评价人的身形。",
"The plant stores water in its fleshy leaves.",
"这种植物把水储存在肉质叶片中。",
"Cut the fleshy stem just above the lowest leaf.",
"在最下面一片叶子上方剪断肉质茎。",
"https://www.oxfordlearnersdictionaries.com/definition/english/fleshy"
],
[
"seep",
"动词 · 渗入；渗出",
"常用 seep through 或 into 表液体少量缓慢穿过或进入，是不及物动词，不直接接被渗透物。",
"Water began to seep through the cracked wall.",
"水开始从裂墙渗过来。",
"The dye may seep into the untreated wood.",
"染料可能渗入未经处理的木材。",
"https://www.oxfordlearnersdictionaries.com/definition/english/seep"
],
[
"interval",
"名词 · 间隔",
"指两事件之间的时间，可用 at regular intervals 表定期；英式剧场用法还可表示幕间休息。",
"A ten-minute interval separates each check of the seedlings.",
"每次幼苗检查之间间隔十分钟。",
"There was a short interval between the two measurements.",
"两次测量之间有一小段间隔。",
"https://www.oxfordlearnersdictionaries.com/definition/english/interval"
],
[
"opportunist",
"名词 · 机会主义者",
"指利用时机谋求自身利益的人，通常带批评意味，可数；不等同于普通善于把握合适机会的人。",
"The novel portrays him as an opportunist who changes sides for profit.",
"小说把他描写成一个为利益改变立场的机会主义者。",
"She dismissed the candidate as a political opportunist.",
"她斥责这位候选人是政治机会主义者。",
"https://dictionary.cambridge.org/dictionary/english/opportunist"
],
[
"enduring",
"形容词 · 持久的",
"描述延续很长时间的影响、关系或价值，常见 enduring appeal；与正在忍受的动词分词须按句子辨别。",
"The book has an enduring appeal for young readers.",
"这本书对年轻读者有持久吸引力。",
"Their partnership left an enduring mark on the town.",
"他们的合作给镇子留下了持久印记。",
"https://www.oxfordlearnersdictionaries.com/definition/english/enduring"
],
[
"arouse",
"动词 · 唤起",
"直接接好奇、怀疑等感受，arouse interest 是常见搭配；不等于让沉睡者起床的所有表达。",
"The unusual pattern began to arouse her curiosity.",
"不寻常的图案开始唤起她的好奇心。",
"The announcement may arouse concern among residents.",
"这则公告可能引起居民担忧。",
"https://www.oxfordlearnersdictionaries.com/definition/english/arouse"
],
[
"discourage",
"动词 · 阻止；使泄气",
"discourage someone from doing 表劝阻行动，from 后接动名词；也可直接接人表示使其失去信心。",
"The rain did not discourage us from exploring the garden.",
"雨没有让我们放弃游览花园。",
"Do not let a difficult first attempt discourage you.",
"别让艰难的初次尝试使你泄气。",
"https://www.oxfordlearnersdictionaries.com/definition/english/discourage"
],
[
"variable",
"名词 · 变量",
"指会变化或可被改变的量，可数；本条采用研究中的名词义，形容词可变的另看句法。",
"Temperature was the only variable we changed.",
"温度是我们唯一改变的变量。",
"Each variable is listed beside its unit of measurement.",
"每个变量旁都列出了计量单位。",
"https://dictionary.cambridge.org/dictionary/english/variable"
],
[
"presence",
"名词 · 在场；存在",
"通常不可数，in the presence of 表在某人面前或有某物存在时；不等于礼物 presents 的复数。",
"Her presence helped calm the nervous students.",
"她在场帮助紧张的学生们平静下来。",
"The test detects the presence of salt in water.",
"这项测试检测水中是否存在盐。",
"https://www.oxfordlearnersdictionaries.com/definition/english/presence"
],
[
"emit",
"动词 · 发出",
"直接接光、热、声音或气体等，过去式 emitted 双写 t；与仅反射光线的动作含义不同。",
"The device can emit a warning tone.",
"设备能发出警示音。",
"Wet wood may emit more smoke as it burns.",
"湿木燃烧时可能排放更多烟。",
"https://www.oxfordlearnersdictionaries.com/definition/english/emit"
],
[
"innovative",
"形容词 · 创新的",
"描述引入新方法或想法的人与事物，常见 innovative approach；不能仅因外观不同就确定有实际创新。",
"The exhibit uses an innovative approach to storytelling.",
"展览采用了一种创新的叙事方式。",
"An innovative design reduced the amount of wasted fabric.",
"一个创新设计减少了浪费的布料。",
"https://www.oxfordlearnersdictionaries.com/definition/english/innovative"
],
[
"disorganized",
"形容词 · 杂乱无章的",
"描述安排不良或缺乏条理的人和活动，常见 disorganized files；不等同于根本没有成立的组织。",
"The disorganized notes were difficult to follow.",
"杂乱的笔记很难读懂。",
"The event felt disorganized because no schedule had been shared.",
"活动没公布时间表，显得混乱无序。",
"https://www.oxfordlearnersdictionaries.com/definition/english/disorganized"
],
[
"barely",
"副词 · 几乎不",
"表示程度接近没有或仅勉强达到，含否定意味，通常不再加 not；barely enough 指刚够。",
"We could barely hear the guide above the traffic.",
"车流声中我们几乎听不见导游说话。",
"There was barely enough space for the two boxes.",
"空间勉强够放两个箱子。",
"https://www.oxfordlearnersdictionaries.com/definition/english/barely"
],
[
"ward",
"名词 · 病房",
"指医院中供某类病人使用的房间或区域，可数；不必然表示单人房，行政选区义另按场景理解。",
"Visitors must report to the ward desk.",
"访客必须到病区服务台报到。",
"The new ward has windows overlooking the garden.",
"新病房的窗户可以俯瞰花园。",
"https://www.oxfordlearnersdictionaries.com/definition/english/ward"
],
[
"complexity",
"名词 · 复杂性",
"表示由许多相互联系部分构成或难理解的程度，通常不可数；complexities 复数可指具体难点。",
"The diagram helps explain the complexity of the system.",
"示意图有助于解释系统的复杂性。",
"We underestimated the complexity of restoring the clock.",
"我们低估了修复这座钟的复杂性。",
"https://www.oxfordlearnersdictionaries.com/definition/english/complexity"
],
[
"transaction",
"名词 · 交易",
"指一次买卖或商业往来，可数；complete a transaction 表完成交易，不应与仅有询价的行为等同。",
"The receipt records the date of the transaction.",
"收据记录了交易日期。",
"Each transaction must be entered in the ledger.",
"每笔交易都必须记入账簿。",
"https://www.oxfordlearnersdictionaries.com/definition/english/transaction"
],
[
"implicit",
"形容词 · 含蓄的",
"表示未直接说出但可理解的意思，常用 implicit in；与明确表达的 explicit 相对，不能把猜测一概当作暗示。",
"An implicit warning lay behind the polite reply.",
"礼貌的回复背后隐含着警告。",
"The assumption is implicit in the original question.",
"原问题中隐含着这个假设。",
"https://www.oxfordlearnersdictionaries.com/definition/english/implicit"
],
[
"inappropriate",
"形容词 · 不合适的",
"常用 inappropriate for 表不适合某情境或对象；评价取决于实际场景，不仅是个人不喜欢。",
"These shoes are inappropriate for the muddy path.",
"这些鞋不适合走泥泞小路。",
"The joke seemed inappropriate during the serious meeting.",
"严肃会议上，这个笑话显得不合时宜。",
"https://www.oxfordlearnersdictionaries.com/definition/english/inappropriate"
],
[
"selective",
"形容词 · 有选择的",
"可指只影响部分对象，也可指选择仔细，常用 selective about；不等于完全排斥所有选择。",
"The archive is selective about which records it keeps.",
"档案馆对保留哪些记录有所选择。",
"Selective pruning lets more light reach the lower branches.",
"选择性修剪让更多光照到低处枝条。",
"https://www.oxfordlearnersdictionaries.com/definition/english/selective"
],
[
"soak",
"动词 · 浸泡",
"可及物把东西放液体中，也可不及物表示浸着，常用 soak in；不只是快速冲洗一下。",
"Soak the dried beans overnight before cooking.",
"烹调前把干豆浸泡一夜。",
"Let the stained cloth soak in cool water.",
"让沾污的布在凉水里浸泡。",
"https://www.oxfordlearnersdictionaries.com/definition/english/soak"
],
[
"colonist",
"名词 · 殖民地定居者",
"指在殖民地定居的人，可数；历史使用须区分当地原住民与新来定居者，不能暗示此前土地无人。",
"The diary records a colonist's arrival at the harbor.",
"日记记录了一位殖民地定居者抵达港口的经过。",
"The museum displays tools used by a colonist in the eighteenth century.",
"博物馆展示了一位十八世纪殖民地定居者使用的工具。",
"https://www.oxfordlearnersdictionaries.com/definition/english/colonist"
],
[
"provoke",
"动词 · 引起",
"可直接接反应，provoke a debate 表引发争论；provoke someone into doing 则表示刺激某人采取行动。",
"The proposal could provoke a lively debate.",
"这个提议可能引发热烈讨论。",
"The sudden noise did not provoke any reaction from the sleeping dog.",
"突然的声响没有引起熟睡小狗的任何反应。",
"https://www.oxfordlearnersdictionaries.com/definition/english/provoke"
],
[
"parameter",
"名词 · 参数；限制条件",
"指决定或限定做法的数值、条件，可数，常见 within the parameters of；不等于任何记录下来的数字。",
"We changed one parameter and repeated the test.",
"我们改变一个参数后重复了测试。",
"The budget sets a clear parameter for the design.",
"预算为设计设定了一个明确限制条件。",
"https://www.oxfordlearnersdictionaries.com/definition/english/parameter"
],
[
"diminish",
"动词 · 减少",
"可不及物表示变弱变少，也可及物使其减少，diminish in size 表尺寸缩小；不必然降为零。",
"The noise began to diminish as the train moved away.",
"火车驶远时，噪声开始减弱。",
"We should not diminish the importance of careful preparation.",
"我们不应贬低认真准备的重要性。",
"https://www.oxfordlearnersdictionaries.com/definition/english/diminish"
],
[
"cubic",
"形容词 · 立方的",
"用在体积单位前，cubic meter 表立方米；它把三维长度相乘，不能与面积平方单位混用。",
"The tank holds one cubic meter of water.",
"水箱能装一立方米的水。",
"The delivery charge is calculated per cubic foot.",
"运费按每立方英尺计算。",
"https://www.oxfordlearnersdictionaries.com/definition/english/cubic"
],
[
"weave",
"动词 · 编织",
"指交织线条或枝条制作布、篮等，weave A into B 表把A编成B；过去式常用 wove。",
"We can weave the willow branches into a small basket.",
"我们可以把柳条编成一个小篮子。",
"She learned to weave cloth on a wooden loom.",
"她学会了在木织机上织布。",
"https://www.oxfordlearnersdictionaries.com/definition/english/weave"
],
[
"analysis",
"名词 · 分析",
"可指详细研究过程或其结果，复数是 analyses；an analysis of 后说明所分析的对象。",
"The analysis revealed a small amount of salt.",
"分析发现了少量盐。",
"We completed an analysis of the survey responses.",
"我们完成了对问卷回答的分析。",
"https://www.oxfordlearnersdictionaries.com/definition/english/analysis"
],
[
"conservation",
"名词 · 保护",
"常用于环境、资源或历史物品保护，通常不可数，conservation of 后接对象；并非只指动物保护。",
"The group works on the conservation of coastal habitats.",
"该团体从事海岸栖息地保护。",
"Careful conservation preserved the fragile manuscript.",
"细致保护使脆弱的手稿得以保存。",
"https://www.oxfordlearnersdictionaries.com/definition/english/conservation"
],
[
"moisture",
"名词 · 水分",
"指空气、材料或表面中的少量水分，通常不可数；不等同于完整的一池或一杯水。",
"The lid helps retain moisture in the soil.",
"盖子有助于保留土壤中的水分。",
"Moisture collected on the cold window.",
"水汽凝结在冰冷窗户上。",
"https://www.oxfordlearnersdictionaries.com/definition/english/moisture"
],
[
"durable",
"形容词 · 耐用的",
"形容长期使用也不易损坏的材料或物品，常见 durable fabric；不表示永远不会磨损。",
"The chairs are made from a durable plastic.",
"椅子由一种耐用塑料制成。",
"We need durable labels for equipment stored outdoors.",
"我们需要用于户外设备的耐用标签。",
"https://www.oxfordlearnersdictionaries.com/definition/english/durable"
],
[
"solidify",
"动词 · 凝固",
"可不及物表示由液体变固体，也可及物使其凝固；抽象巩固关系义另依上下文理解。",
"The wax will solidify as it cools.",
"蜡冷却后会凝固。",
"Low temperatures can solidify the mixture.",
"低温能使混合物凝固。",
"https://www.oxfordlearnersdictionaries.com/definition/english/solidify"
],
[
"citation",
"名词 · 引文",
"指从书籍或讲话中引用的文字，可数；引文需与来源一致，本条不采用法庭传票等其他义项。",
"The essay opens with a short citation from a travel diary.",
"文章以一段旅行日记引文开头。",
"Each citation was checked against the original book.",
"每段引文都与原书进行了核对。",
"https://dictionary.cambridge.org/dictionary/english/citation"
],
[
"sparse",
"形容词 · 稀疏的",
"表示数量少且常分布较散，常见 sparse vegetation；不等于完全没有，不能直接译成无。",
"Sparse grass covered the dry hillside.",
"干燥山坡上稀疏长着草。",
"The report relies on sparse information about the early settlement.",
"报告依据的是关于早期定居点的零星资料。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sparse"
],
[
"commentary",
"名词 · 解说",
"可指对进行中事件的口头描述，也可指分析评论，a commentary on 后接所解说的对象。",
"The broadcast includes commentary from a former player.",
"这次转播包含一位前球员的解说。",
"The guide provides a commentary on each stage of the process.",
"指南对过程的每个阶段作出解说。",
"https://www.oxfordlearnersdictionaries.com/definition/english/commentary"
],
[
"unbiased",
"形容词 · 公正的",
"表示不受个人偏好或利益左右，常修饰 assessment、account；声称公正仍需以方法和证据来支撑。",
"We asked for an unbiased assessment of the two proposals.",
"我们要求对两个提案作公正评估。",
"The reporter tried to give an unbiased account of the dispute.",
"记者努力对争议作公正报道。",
"https://www.oxfordlearnersdictionaries.com/definition/english/unbiased"
],
[
"omit",
"动词 · 省略",
"直接接未包括的内容，omit something from 表从何处省去；过去式 omitted 要双写 t。",
"Do not omit the date from the application.",
"不要漏填申请日期。",
"You can omit this step if the surface is already clean.",
"如果表面已经干净，可以省略这一步。",
"https://www.oxfordlearnersdictionaries.com/definition/english/omit"
],
[
"skeptical",
"形容词 · 怀疑的",
"是美式常用拼写，英式常写 sceptical；skeptical about 或 of 引出存疑对象，不等于已证明对方错误。",
"She remained skeptical about the promised delivery date.",
"她对承诺的送货日期仍持怀疑态度。",
"We were skeptical of a result based on only two samples.",
"我们对仅基于两个样本的结果表示怀疑。",
"https://www.oxfordlearnersdictionaries.com/definition/english/skeptical"
],
[
"cloak",
"名词 · 斗篷",
"指从肩部垂下、通常在颈部扣合的无袖外衣，可数；a cloak of secrecy 是掩饰的比喻用法。",
"The traveler hung a damp cloak beside the fire.",
"旅人把潮湿斗篷挂在火边。",
"The costume includes a dark cloak with a silver clasp.",
"服装包括一件带银色搭扣的深色斗篷。",
"https://www.oxfordlearnersdictionaries.com/definition/english/cloak"
],
[
"fume",
"动词 · 愤怒",
"本条是动词，表示非常生气，常用 fume about；fumes 复数表示烟气，不能把两者混为同一词性。",
"He began to fume about the missing paperwork.",
"他开始为遗失的文件大发脾气。",
"Do not fume over a delay that no one could prevent.",
"不要为谁也无法避免的延误生闷气。",
"https://www.oxfordlearnersdictionaries.com/definition/english/fume"
],
[
"domesticate",
"动词 · 驯化",
"指使野生动植物逐渐适应人类利用或生活，直接接对象；不只是一次训练宠物完成动作。",
"People learned to domesticate wild plants over many generations.",
"人们经过许多代才学会驯化野生植物。",
"The museum explains how communities came to domesticate sheep.",
"博物馆解释人类群体如何逐渐驯化绵羊。",
"https://www.oxfordlearnersdictionaries.com/definition/english/domesticate"
],
[
"meteoric",
"形容词 · 迅速成功的",
"常见 a meteoric rise 表短期内飞速崛起；另有流星的字面义，不表示成功一定持久。",
"The singer's meteoric rise began with a small online audience.",
"这位歌手的迅速崛起始于一小群网络听众。",
"The article traces the company's meteoric growth.",
"文章追溯了这家公司的飞速增长。",
"https://www.oxfordlearnersdictionaries.com/definition/english/meteoric"
],
[
"nourish",
"动词 · 滋养",
"直接接得到食物滋养的人或生物，也可比喻培养思想；与仅让食物味道好的调味不同。",
"The compost helps nourish the young plants.",
"堆肥有助于滋养幼苗。",
"Regular reading can nourish a child's curiosity.",
"经常阅读能培养孩子的好奇心。",
"https://www.oxfordlearnersdictionaries.com/definition/english/nourish"
],
[
"municipal",
"形容词 · 市政的",
"用于由城市或地方政府管理的事务与设施，常见 municipal library；不等同于所有位于市区的私营设施。",
"The municipal library opens late on Wednesdays.",
"市立图书馆星期三延长开放时间。",
"A municipal team maintains the public gardens.",
"一支市政队伍维护公共花园。",
"https://www.oxfordlearnersdictionaries.com/definition/english/municipal"
],
[
"extinct",
"形容词 · 灭绝的",
"描述物种已不再存在，常用 become extinct；不能把某地暂时未见到某物种就当作全球灭绝。",
"The display includes a model of an extinct bird.",
"展区有一种已灭绝鸟类的模型。",
"Several species became extinct after their habitat disappeared.",
"几种物种在栖息地消失后灭绝了。",
"https://www.oxfordlearnersdictionaries.com/definition/english/extinct"
],
[
"recital",
"名词 · 独奏会；朗诵会",
"通常指由一人或小组呈现的音乐或诗歌表演，可数，give a recital 是常见搭配。",
"She gave a piano recital in the college hall.",
"她在学院礼堂举办了钢琴独奏会。",
"The recital ended with a short piece by a local composer.",
"独奏会以一位当地作曲家的短曲结束。",
"https://www.oxfordlearnersdictionaries.com/definition/english/recital"
],
[
"readjust",
"动词 · 重新调整",
"可指再微调物体位置，也可用 readjust to 表重新适应情况；to 后接新环境而非动词不定式时要辨明。",
"Please readjust the lamp so it lights the page.",
"请重新调整灯的位置，让它照亮书页。",
"It took time to readjust to the quieter routine.",
"重新适应更安静的日常安排花了一些时间。",
"https://www.oxfordlearnersdictionaries.com/definition/english/readjust"
],
[
"beaver",
"名词 · 海狸",
"指有扁宽尾巴、能啃木筑坝的啮齿动物，可数；不是只要住水边的动物都称为海狸。",
"A beaver dragged a branch toward the stream.",
"一只海狸把树枝拖向溪边。",
"The guide showed us a beaver lodge beside the pond.",
"向导给我们看了池边的一处海狸巢。",
"https://www.oxfordlearnersdictionaries.com/definition/english/beaver"
],
[
"nominate",
"动词 · 提名",
"nominate someone for a prize 表提名获奖，nominate someone to do 可指派工作；提名并不等于最终选中。",
"We can nominate a volunteer for the service award.",
"我们可以提名一位志愿者参加服务奖评选。",
"Each club may nominate one representative.",
"每个俱乐部可提名一位代表。",
"https://www.oxfordlearnersdictionaries.com/definition/english/nominate"
],
[
"unrest",
"名词 · 动荡",
"通常不可数，指人们因不满而可能抗议冲突的政治或社会局面，常见 social unrest；不等于个人失眠。",
"The novel is set during a period of social unrest.",
"小说背景是一段社会动荡时期。",
"The report examines the causes of unrest in the region.",
"报告研究了该地区动荡的原因。",
"https://www.oxfordlearnersdictionaries.com/definition/english/unrest"
],
[
"disposal",
"名词 · 处理；处置",
"disposal of waste 表废物处置，at someone's disposal 表供某人使用；两种固定结构含义不同。",
"The notice explains the safe disposal of paint.",
"告示说明了油漆的安全处置方式。",
"A small meeting room is at your disposal.",
"有一间小会议室供你使用。",
"https://www.oxfordlearnersdictionaries.com/definition/english/disposal"
],
[
"flush",
"动词 · 冲洗",
"本条采用用水冲去的义项，可用 flush something with water；马桶冲水和脸红需按对象区分。",
"Flush the pipe with clean water after use.",
"使用后用清水冲洗管道。",
"Please flush the toilet before leaving the washroom.",
"离开卫生间前请冲马桶。",
"https://www.oxfordlearnersdictionaries.com/definition/english/flush"
],
[
"chaotic",
"形容词 · 混乱的",
"形容缺乏秩序、难以管理的情形，常见 chaotic scene；不只是物品稍微摆放不齐。",
"The entrance became chaotic when two groups arrived together.",
"两组人同时抵达时，入口变得混乱。",
"The files were in a chaotic state after the move.",
"搬迁后文件处于混乱状态。",
"https://www.oxfordlearnersdictionaries.com/definition/english/chaotic"
],
[
"overhead",
"副词 · 在头顶上",
"本条作副词说明位于上方或空中，常用 fly overhead；形容词开支相关的 overhead 需另看场景。",
"A helicopter passed overhead during the walk.",
"徒步时一架直升机从头顶飞过。",
"Branches met overhead to form a shaded tunnel.",
"树枝在头顶交汇，形成一条阴凉通道。",
"https://www.oxfordlearnersdictionaries.com/definition/english/overhead"
],
[
"aggression",
"名词 · 攻击性",
"可指带威胁的愤怒情绪或侵略行为，通常不可数；show aggression 表显露攻击性，并不等于健康的自信。",
"The trainer noticed aggression when the dogs were crowded together.",
"训练员注意到狗挤在一起时出现了攻击性。",
"The agreement aims to prevent further aggression.",
"协议旨在防止进一步侵略。",
"https://www.oxfordlearnersdictionaries.com/definition/english/aggression"
],
[
"sphere",
"名词 · 球体",
"指表面各点距中心相等的几何实体，可数；现实球形物体是近似例子，领域义属于引申。",
"The model uses a sphere to represent the planet.",
"模型用一个球体代表行星。",
"Light reflected from the polished metal sphere.",
"光从抛光金属球上反射出来。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sphere"
],
[
"sustain",
"动词 · 维持",
"可直接接生命、活动或状态，表示持续提供所需支持；不只是开始某项活动。",
"The small reservoir can sustain the garden through summer.",
"这个小水库可以维持花园整个夏季的用水。",
"We could not sustain that pace for another hour.",
"我们无法再以那种速度坚持一小时。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sustain"
],
[
"supervise",
"动词 · 监督",
"直接接人员或工作，表示负责确保正确安全进行；监督不一定意味着亲自完成全部操作。",
"A trained adult must supervise the experiment.",
"必须由受过培训的成年人监督实验。",
"The architect will supervise the restoration work.",
"建筑师将监督修复工作。",
"https://www.oxfordlearnersdictionaries.com/definition/english/supervise"
],
[
"radical",
"形容词 · 根本的",
"可形容彻底改变事物基本部分的措施，常见 radical change；政治激进的义项应看具体立场语境。",
"The plan requires a radical change in how we use the space.",
"计划要求从根本上改变我们使用空间的方式。",
"A radical redesign reduced the number of moving parts.",
"一次彻底重新设计减少了运动部件数量。",
"https://www.oxfordlearnersdictionaries.com/definition/english/radical"
],
[
"potent",
"形容词 · 强有力的",
"指对身体、思想等作用强烈，常见 potent symbol；不把作用强等同于所有使用条件下都更好。",
"The image became a potent symbol of cooperation.",
"这个图像成为合作的有力象征。",
"Even a small amount of the dye is potent.",
"即使少量这种染料，着色力也很强。",
"https://www.oxfordlearnersdictionaries.com/definition/english/potent"
],
[
"discharge",
"动词 · 准许出院",
"医疗语境中常用 discharge someone from hospital 或被动结构，表示允许离院；不等于保证已完全没有病症。",
"The hospital plans to discharge her tomorrow.",
"医院计划明天让她出院。",
"The doctor may discharge the patient after reviewing the test.",
"医生复核检测结果后可能让病人出院。",
"https://www.oxfordlearnersdictionaries.com/definition/english/discharge"
],
[
"confine",
"动词 · 限制",
"confine something to 表把内容或范围限于某处；be confined to 也可指受限在某地点或活动范围。",
"Please confine your comments to the current proposal.",
"请把评论限于当前提案。",
"The screens help confine dust to the work area.",
"隔屏有助于把粉尘限制在施工区。",
"https://www.oxfordlearnersdictionaries.com/definition/english/confine"
],
[
"pedestrian",
"名词 · 行人",
"指在街道步行而非乘车的人，可数；pedestrian crossing 是行人过街处，不能泛称任何通勤者。",
"A pedestrian waited for the signal to change.",
"一名行人等待信号灯变化。",
"The driver stopped to let a pedestrian cross.",
"司机停车让一名行人通过。",
"https://www.oxfordlearnersdictionaries.com/definition/english/pedestrian"
],
[
"atomic",
"形容词 · 原子的",
"描述与原子有关的结构或过程，常见 atomic structure；核能相关义依具体名词判断，不能一概译成核弹。",
"The diagram shows the atomic structure of the material.",
"示意图显示材料的原子结构。",
"The scientist compared the atomic masses of two elements.",
"科学家比较了两种元素的原子质量。",
"https://www.oxfordlearnersdictionaries.com/definition/english/atomic"
],
[
"comic",
"形容词 · 滑稽的",
"本条形容让人发笑的效果或表演，常见 comic scene；名词漫画书等用法需按句法区分。",
"A comic misunderstanding brings the two characters together.",
"一场滑稽的误会让两个角色相遇。",
"The actor has excellent comic timing.",
"这位演员掌握喜剧节奏的能力非常出色。",
"https://www.oxfordlearnersdictionaries.com/definition/english/comic"
],
[
"forked",
"形容词 · 分叉的",
"形容一端分成两部分的形状，常见 forked branch；不表示任何有许多无序小洞的形状。",
"The bird rested on a forked branch.",
"鸟停在一根分叉的树枝上。",
"The diagram shows a forked lightning bolt.",
"图中画着一道分叉闪电。",
"https://www.oxfordlearnersdictionaries.com/definition/english/forked"
],
[
"partial",
"形容词 · 部分的",
"表示不完整或仅涵盖一部分，常用 partial view；be partial to 喜爱某物属于另一固定搭配。",
"The report offers only a partial explanation.",
"报告只给出了部分解释。",
"We had a partial view of the harbor from the balcony.",
"我们从阳台只能看见港口的一部分。",
"https://www.oxfordlearnersdictionaries.com/definition/english/partial"
],
[
"dampen",
"动词 · 弄湿；减弱",
"可指使稍湿，也可指降低热情等感受，直接接对象；语义通常不是完全浸透或彻底消除。",
"Dampen the cloth before wiping the frame.",
"擦框架前先把布稍微弄湿。",
"The delay did not dampen the children's enthusiasm.",
"延误没有减弱孩子们的热情。",
"https://www.oxfordlearnersdictionaries.com/definition/english/dampen"
],
[
"void",
"名词 · 空处",
"本条采用名词表示空无的空间或失去某物后的空缺；形容词无效的属于另一词性和义项。",
"The scanner revealed a void beneath the floor.",
"扫描仪发现地板下有一处空洞。",
"Her departure left a void in the small team.",
"她的离开在小团队里留下了空缺。",
"https://www.oxfordlearnersdictionaries.com/definition/english/void"
],
[
"analyst",
"名词 · 分析师",
"指通过研究事实、材料等提供判断的人，可数；具体专业由 data、financial 等修饰语说明。",
"A data analyst checked the survey results.",
"一位数据分析师核查了调查结果。",
"The analyst noted a change in customer behavior.",
"分析师注意到顾客行为有变化。",
"https://www.oxfordlearnersdictionaries.com/definition/english/analyst"
],
[
"spectacular",
"形容词 · 壮观的",
"形容非常令人印象深刻的景象或表现，常见 spectacular view；不一定只修饰很大的物体。",
"The ridge offers a spectacular view of the glacier.",
"山脊上能看见壮观的冰川景色。",
"A spectacular display of lanterns lit the square.",
"壮观的花灯展示照亮了广场。",
"https://www.oxfordlearnersdictionaries.com/definition/english/spectacular"
],
[
"expire",
"动词 · 到期",
"通常不及物，指证件、协议等有效期结束；expire on 后接具体日期，不直接把到期对象作宾语。",
"Your visitor pass will expire at the end of the day.",
"访客证将在当天结束时失效。",
"The contract is due to expire next spring.",
"合同将于明年春天到期。",
"https://www.oxfordlearnersdictionaries.com/definition/english/expire"
],
[
"ritual",
"名词 · 仪式",
"指按固定次序重复的一系列行为，可数；也可指日常惯例，religious ritual 才明确宗教场景。",
"The ceremony included a ritual of lighting candles.",
"典礼包含点蜡烛的仪式。",
"Making tea became a quiet morning ritual.",
"泡茶成了一项安静的早间惯例。",
"https://www.oxfordlearnersdictionaries.com/definition/english/ritual"
],
[
"chorus",
"名词 · 副歌",
"歌曲中常在每段主歌后重复的部分，可数；也可指合唱曲或合唱队，须依演唱结构判断。",
"Everyone joined in for the final chorus.",
"最后一遍副歌时，每个人都加入了演唱。",
"The chorus repeats the same question three times.",
"副歌把同一个问题重复三遍。",
"https://www.oxfordlearnersdictionaries.com/definition/english/chorus"
],
[
"scroll",
"名词 · 卷轴",
"本条指卷起的书写材料，可数；电脑屏幕滚动的动词义不是指物理卷轴本身移动。",
"The curator carefully unrolled the scroll.",
"策展人小心展开卷轴。",
"A painted scroll hung beside the entrance.",
"入口旁挂着一幅画卷。",
"https://www.oxfordlearnersdictionaries.com/definition/english/scroll"
],
[
"clan",
"名词 · 氏族",
"指有亲属关系的一组家庭，尤见于苏格兰历史；也可非正式指大家族，不能一概等同公司组织。",
"The exhibit traces the history of a Highland clan.",
"展览追溯了一个苏格兰高地氏族的历史。",
"Members of the clan gathered for the anniversary.",
"氏族成员为周年纪念聚集在一起。",
"https://www.oxfordlearnersdictionaries.com/definition/english/clan"
],
[
"portray",
"动词 · 描绘",
"可用 portray someone as 引出被描绘的形象，既能用于文字也能用于图像；不保证描绘完全客观。",
"The novel does not portray the village as an ideal place.",
"小说没有把村庄描绘成理想之地。",
"Her paintings portray everyday life near the harbor.",
"她的画作描绘港口附近的日常生活。",
"https://www.oxfordlearnersdictionaries.com/definition/english/portray"
],
[
"discontent",
"名词 · 不满",
"表示对处境不满意的感受，通常不可数，discontent with 后接对象；不等同于只是对信息不确定。",
"Discontent with the new timetable grew among passengers.",
"乘客对新时间表的不满日益增加。",
"The meeting gave residents a chance to express discontent.",
"会议让居民有机会表达不满。",
"https://www.oxfordlearnersdictionaries.com/definition/english/discontent"
],
[
"contest",
"名词 · 比赛",
"指有获胜目标的竞赛，可数，enter a contest 表参赛；动词质疑或争辩重音与名词通常不同。",
"The photo contest attracted entries from several schools.",
"摄影比赛收到多所学校的参赛作品。",
"She entered the contest with a picture of the old harbor.",
"她用一张旧港口照片参加比赛。",
"https://www.oxfordlearnersdictionaries.com/definition/english/contest"
],
[
"oppose",
"动词 · 反对",
"直接接计划、行为等，或用动名词作宾语；be opposed to 中 to 是介词，结构需区别。",
"Several residents oppose building on the wetland.",
"几位居民反对在湿地上建设。",
"We do not oppose the aim, but we question the method.",
"我们不反对目标，但对方法有疑问。",
"https://www.oxfordlearnersdictionaries.com/definition/english/oppose"
],
[
"lean",
"动词 · 倾斜；倚靠",
"lean against 表靠在某物上，lean forward 表向前倾；形容词瘦的和精简的属于其他用法。",
"Please do not lean against the glass case.",
"请不要倚靠玻璃展柜。",
"She had to lean forward to read the small label.",
"她不得不向前倾身阅读小标签。",
"https://www.oxfordlearnersdictionaries.com/definition/english/lean"
],
[
"oxidize",
"动词 · 氧化",
"指发生失电子等氧化过程，可及物或不及物；与氧反应是常见情况，但不应把氧化限定为必须有氧气。",
"The metal may oxidize when exposed to damp air.",
"金属暴露在潮湿空气中时可能氧化。",
"The experiment shows how these substances oxidize under different conditions.",
"实验显示这些物质在不同条件下如何氧化。",
"https://www.oxfordlearnersdictionaries.com/definition/english/oxidize"
],
[
"fuss",
"名词 · 大惊小怪",
"指过多担忧、抱怨或忙乱，常用 make a fuss about；语气可能批评，不宜用来轻视他人合理需求。",
"There is no need to make a fuss about the spilled water.",
"没必要为洒出的水大惊小怪。",
"She completed the repair without any fuss.",
"她不声不响地完成了修理。",
"https://www.oxfordlearnersdictionaries.com/definition/english/fuss"
],
[
"liberal",
"形容词 · 开明的",
"本条表示愿尊重不同意见或行为，常见 liberal views；政治流派具体含义因国家而异，不能一概等同。",
"Her liberal attitude encouraged open discussion.",
"她开明的态度鼓励了开放讨论。",
"The school adopted a more liberal policy on student dress.",
"学校采用了更宽松的学生着装政策。",
"https://www.oxfordlearnersdictionaries.com/definition/english/liberal"
],
[
"competence",
"名词 · 胜任能力",
"指做好某事的能力，通常不可数，competence in 后接领域；法律权限义须另按语境理解。",
"The test checks competence in basic first aid.",
"测试检查基本急救能力。",
"Her competence gave the new team confidence.",
"她的胜任能力给了新团队信心。",
"https://www.oxfordlearnersdictionaries.com/definition/english/competence"
],
[
"populate",
"动词 · 居住于",
"可指生物构成某地种群，也可指使某地有人或动物居住；不是所有短暂到访都构成 populate。",
"Several bird species populate the island.",
"岛上生活着几种鸟类。",
"The plan was to populate the restored pond with native fish.",
"计划是让恢复后的池塘栖居本地鱼类。",
"https://www.oxfordlearnersdictionaries.com/definition/english/populate"
],
[
"identical",
"形容词 · 完全相同的",
"常用 identical to 表与另一对象相同；强调相关细节一致，比仅表示相似的 similar 更强。",
"The two keys look identical to me.",
"这两把钥匙在我看来一模一样。",
"Her copy was identical to the original drawing.",
"她的复制品与原画完全相同。",
"https://www.oxfordlearnersdictionaries.com/definition/english/identical"
],
[
"shun",
"动词 · 避开",
"直接接有意回避的人或事物，语气常表示刻意不接触；不只是因疏忽而偶然漏看。",
"The artist chose to shun publicity after the exhibition.",
"展览后，这位艺术家选择避开公众关注。",
"Some animals shun brightly lit areas.",
"有些动物会避开光线很亮的地方。",
"https://www.oxfordlearnersdictionaries.com/definition/english/shun"
],
[
"carbonate",
"名词 · 碳酸盐",
"本条指含碳酸根的盐类，可数或用于化合物名称；calcium carbonate 表碳酸钙，碳酸饮料动词义另看句法。",
"The rock contains calcium carbonate.",
"这种岩石含有碳酸钙。",
"The chemist identified a carbonate in the powder.",
"化学家在粉末中鉴别出一种碳酸盐。",
"https://www.oxfordlearnersdictionaries.com/definition/english/carbonate"
],
[
"abstraction",
"名词 · 抽象概念",
"指不依赖某个具体人或事例的一般概念，可数；与具体可观察实例相对，不等于没有意义的说法。",
"The diagram turns a difficult abstraction into a visible pattern.",
"示意图把一个难懂的抽象概念变成可见图案。",
"The essay connects the abstraction of freedom with everyday choices.",
"文章把自由这一抽象概念与日常选择联系起来。",
"https://www.oxfordlearnersdictionaries.com/definition/english/abstraction"
],
[
"diplomat",
"名词 · 外交官",
"指在外国代表本国处理事务的人，可数，常见 career diplomat；不是任何出国工作的雇员。",
"The diplomat attended the opening of the cultural center.",
"那位外交官出席了文化中心的开幕式。",
"A diplomat helped arrange the exchange visit.",
"一位外交官帮助安排了互访。",
"https://www.oxfordlearnersdictionaries.com/definition/english/diplomat"
],
[
"unintentional",
"形容词 · 非故意的",
"形容并非有意造成而是意外发生的行为或结果，常见 unintentional error；不自动免除实际后果。",
"The omission was an unintentional error.",
"漏掉这项内容是一个无意的错误。",
"The film produced an unintentional comic effect.",
"影片产生了无意中的喜剧效果。",
"https://www.oxfordlearnersdictionaries.com/definition/english/unintentional"
],
[
"expose",
"动词 · 暴露",
"expose something to 表使其接触某物或影响；也可指揭露隐藏事实，需依据宾语判断。",
"Do not expose the prints to direct sunlight.",
"不要让印制图片直接暴露在阳光下。",
"The inspection may expose damage hidden beneath the paint.",
"检查可能揭示油漆下隐藏的损坏。",
"https://www.oxfordlearnersdictionaries.com/definition/english/expose"
],
[
"cultivate",
"动词 · 耕种",
"可指准备土地供种植，也可指种植植物；cultivate an interest 是培养兴趣的引申用法。",
"The family continues to cultivate the small field.",
"这家人继续耕种那块小田。",
"We can cultivate herbs in containers on the balcony.",
"我们可以在阳台容器里种植香草。",
"https://www.oxfordlearnersdictionaries.com/definition/english/cultivate"
],
[
"underline",
"动词 · 画下划线",
"直接接需加线的词句，也可比喻强调；underline the importance 表强调重要性，不是给抽象重要性画线。",
"Please underline the date in the first paragraph.",
"请在第一段的日期下面画线。",
"The incident helps underline the need for regular checks.",
"这件事强调了定期检查的必要性。",
"https://www.oxfordlearnersdictionaries.com/definition/english/underline"
],
[
"bud",
"名词 · 芽；花蕾",
"指植物尚未展开的花、叶或茎的幼小结构，可数；in bud 表含苞状态，不能一概译成已经开花。",
"A new bud appeared on the rose stem.",
"玫瑰茎上出现了一个新花蕾。",
"The tree is still in bud despite the warm weather.",
"尽管天气暖和，树还处于萌芽状态。",
"https://www.oxfordlearnersdictionaries.com/definition/english/bud"
],
[
"inference",
"名词 · 推断",
"指依据已知信息间接得出的判断，可数；draw an inference from 表从什么推断，不等于直接观察事实。",
"We cannot draw a firm inference from one result.",
"我们不能从一次结果得出确定推断。",
"Her inference was reasonable but needed more evidence.",
"她的推断合理，但需要更多证据。",
"https://www.oxfordlearnersdictionaries.com/definition/english/inference"
],
[
"row",
"名词 · 一排",
"指并列排列的人或物，可数；本义读音与表示争吵的同形词不同，in a row 表成排或连续。",
"Please leave the front row for the choir.",
"请把前排留给合唱团。",
"A row of young trees lines the path.",
"一排小树沿小路排列。",
"https://dictionary.cambridge.org/dictionary/english/row"
],
[
"indefensible",
"形容词 · 无法辩护的",
"可指行为在道德上无法合理辩护，也可指军事上难防守；本条例句采用行为与论证范围。",
"The report called the treatment of the workers indefensible.",
"报告称对工人的这种对待无法辩护。",
"That conclusion is indefensible without supporting evidence.",
"没有佐证，那个结论就站不住脚。",
"https://www.oxfordlearnersdictionaries.com/definition/english/indefensible"
],
[
"devise",
"动词 · 想出",
"直接接计划、方法等，强调经过思考设计；与名词设备 device 拼写接近但词性不同。",
"We need to devise a safer way to move the statue.",
"我们需要想出更安全的雕像搬运办法。",
"The students will devise a simple test for soil moisture.",
"学生们将设计一个简易土壤湿度测试。",
"https://www.oxfordlearnersdictionaries.com/definition/english/devise"
],
[
"specific",
"形容词 · 具体的",
"可指明确细节或某一特定对象，常用 specific to 表为某事物特有；不是泛泛的任何一种。",
"Please give a specific example from the text.",
"请给出文中的一个具体例子。",
"These instructions are specific to this model.",
"这些说明专用于这一型号。",
"https://www.oxfordlearnersdictionaries.com/definition/english/specific"
],
[
"requisite",
"形容词 · 必需的",
"语体正式，通常放在名词前表示特定目的所必须具备的条件，常见 requisite skills；不同于可有可无的选择项。",
"Applicants must have the requisite training.",
"申请者必须接受过必需的培训。",
"The form lists the requisite documents for registration.",
"表格列出了注册必需的文件。",
"https://www.oxfordlearnersdictionaries.com/definition/english/requisite"
],
[
"mystify",
"动词 · 使迷惑",
"直接接感到不理解的人，常用 be mystified by；不一定涉及神秘力量，也可只是原因不清楚。",
"The inconsistent readings continue to mystify the team.",
"不一致的读数仍让团队困惑。",
"The locked door seemed to mystify every visitor.",
"锁着的门似乎让每位来访者都感到困惑。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mystify"
],
[
"exceedingly",
"副词 · 极其",
"是程度副词，语体较正式，通常修饰形容词或副词；不作形容词直接修饰普通名词。",
"The original manuscript is exceedingly fragile.",
"原始手稿极其脆弱。",
"The final adjustment proved exceedingly difficult.",
"最后的调整被证明极其困难。",
"https://www.oxfordlearnersdictionaries.com/definition/english/exceedingly"
],
[
"impose",
"动词 · 强加；施行",
"impose a rule on someone 表对某人施加规定；不及物 impose on 还可指给人添麻烦，结构有别。",
"The council may impose limits on overnight parking.",
"议会可能对夜间停车施加限制。",
"We should not impose our preferences on every visitor.",
"我们不该把自己的偏好强加给每位来访者。",
"https://www.oxfordlearnersdictionaries.com/definition/english/impose"
],
[
"habitat",
"名词 · 栖息地",
"指某种动植物自然生活的地方，可数或泛指生境；habitat for 后可接物种，不只指一个巢穴。",
"The marsh provides a habitat for many insects.",
"沼泽为许多昆虫提供栖息地。",
"The project aims to restore the otter's habitat.",
"项目旨在恢复水獭的栖息地。",
"https://www.oxfordlearnersdictionaries.com/definition/english/habitat"
],
[
"meteor",
"名词 · 流星",
"指天体进入大气燃烧发光的现象或相关小天体，常见 meteor shower；落到地面的残块通常叫 meteorite。",
"A bright meteor crossed the sky above the camp.",
"一颗明亮流星划过营地上空。",
"The camera recorded a meteor just before dawn.",
"相机在黎明前拍到了一颗流星。",
"https://www.oxfordlearnersdictionaries.com/definition/english/meteor"
],
[
"ridicule",
"名词 · 嘲笑",
"指使人显得可笑的刻薄评论，通常不可数，expose someone to ridicule 表使人遭受嘲笑；不等同友善幽默。",
"Her unusual idea was met with ridicule.",
"她不寻常的想法遭到了嘲笑。",
"Fear of ridicule kept him from asking the question.",
"害怕被嘲笑使他没有问出问题。",
"https://www.oxfordlearnersdictionaries.com/definition/english/ridicule"
],
[
"analytical",
"形容词 · 分析的",
"描述用逻辑把整体分解研究的方式或能力，常见 analytical skills；不能只因文字很长就认定有分析性。",
"The task develops students' analytical skills.",
"这项任务培养学生的分析能力。",
"Her analytical approach helped separate facts from assumptions.",
"她的分析方法有助于区分事实与假设。",
"https://www.oxfordlearnersdictionaries.com/definition/english/analytical"
],
[
"mount",
"动词 · 增加",
"本条采用不及物表示数量、压力逐渐上升，常用 costs mount；与安装、登上等及物义依句法区别。",
"Costs began to mount as the repairs continued.",
"随着维修继续，费用开始增加。",
"Pressure may mount if deliveries remain delayed.",
"如果配送继续延误，压力可能增加。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mount"
],
[
"compass",
"名词 · 指南针",
"指利用磁针等指示方向的工具，可数；draw a circle 的 compasses 则常指圆规，须看具体活动。",
"We used a compass to check the direction of the path.",
"我们用指南针确认小路方向。",
"The compass needle moved when we placed a magnet nearby.",
"我们把磁铁放在附近时，指南针的指针动了。",
"https://www.oxfordlearnersdictionaries.com/definition/english/compass"
],
[
"contend",
"动词 · 主张",
"contend that 引出争论中坚持的说法；contend with 表应付困难，是另外的介词结构。",
"The authors contend that the evidence supports a different date.",
"作者们主张，这些证据支持另一个年代。",
"Several researchers contend that the model is too simple.",
"几位研究人员认为这个模型过于简单。",
"https://www.oxfordlearnersdictionaries.com/definition/english/contend"
],
[
"passageway",
"名词 · 通道",
"指建筑等内部连接房间或区域的狭长通行空间，可数；与书中一段文字的 passage 用法不同。",
"A narrow passageway connects the kitchen and the courtyard.",
"一条窄通道连接厨房和庭院。",
"Keep the passageway clear of boxes.",
"不要在通道堆放箱子。",
"https://dictionary.cambridge.org/dictionary/english/passageway"
],
[
"documentation",
"名词 · 文件资料",
"可指证明材料或产品使用说明，通常不可数；说一份具体文件可用 a document，不用 a documentation。",
"Please bring the documentation needed for registration.",
"请带上注册所需的文件资料。",
"The documentation explains how to replace the filter.",
"说明文档解释了如何更换滤芯。",
"https://www.oxfordlearnersdictionaries.com/definition/english/documentation"
],
[
"wane",
"动词 · 逐渐减弱",
"通常不及物，可描述兴趣或力量下降；月相语境还可指月亏，不一定都是光线本身变暗。",
"Interest in the proposal began to wane.",
"人们对提案的兴趣开始减退。",
"Her enthusiasm did not wane during the long restoration.",
"漫长修复期间，她的热情并未减退。",
"https://www.oxfordlearnersdictionaries.com/definition/english/wane"
],
[
"embryo",
"名词 · 胚胎",
"指动植物发育早期的个体，可数；不同物种及医学阶段分法不同，不能一概等同出生前所有阶段。",
"The image shows an embryo inside the seed.",
"图像显示种子内部的胚。",
"The lesson describes how a bird embryo develops in the egg.",
"这堂课介绍鸟类胚胎如何在卵中发育。",
"https://www.oxfordlearnersdictionaries.com/definition/english/embryo"
],
[
"inequality",
"名词 · 不平等",
"社会语境指群体在资源、地位、机会等方面的不公平差异，通常不可数；不是所有数值不相同都属此义。",
"The report examines inequality in access to education.",
"报告研究了获得教育机会的不平等。",
"The program aims to reduce inequality between neighborhoods.",
"项目旨在减少社区之间的不平等。",
"https://www.oxfordlearnersdictionaries.com/definition/english/inequality"
],
[
"superiority",
"名词 · 优越性",
"superiority over 表相较他人的优势，通常不可数；a sense of superiority 则可带自视高人一等的意味。",
"The test showed the material's superiority in wet conditions.",
"测试显示这种材料在潮湿条件下的优势。",
"He spoke with an irritating sense of superiority.",
"他说话带着令人不快的优越感。",
"https://www.oxfordlearnersdictionaries.com/definition/english/superiority"
],
[
"diverge",
"动词 · 分开；分歧",
"可描述道路向不同方向分开，也可指观点不同；常用 diverge from 表偏离，不直接接宾语。",
"The paths diverge just beyond the old gate.",
"小路在旧门外不远处分岔。",
"Their interpretations began to diverge after the first chapter.",
"第一章之后，他们的解释开始出现分歧。",
"https://www.oxfordlearnersdictionaries.com/definition/english/diverge"
],
[
"elementary",
"形容词 · 基础的",
"形容初级知识或学习阶段，常见 elementary principles；不表示内容对所有初学者都毫无困难。",
"The course introduces elementary principles of design.",
"课程介绍基础设计原则。",
"An elementary understanding of fractions will help with this task.",
"对分数有基本理解会有助于完成任务。",
"https://www.oxfordlearnersdictionaries.com/definition/english/elementary"
],
[
"sediment",
"名词 · 沉积物",
"指沉到液体底部或由水风搬运积下的固体物质，通常不可数；不是仍溶解在液体中的所有成分。",
"A layer of sediment covered the bottom of the jar.",
"瓶底覆盖着一层沉积物。",
"The river carries sediment toward the coast.",
"河流把泥沙带向海岸。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sediment"
],
[
"overshadow",
"动词 · 使黯然失色",
"直接接被压过的重要事件或成就；也可表示坏消息使活动失去愉悦，不一定是物理遮光。",
"The announcement threatened to overshadow the award ceremony.",
"这则公告可能使颁奖典礼黯然失色。",
"One poor result should not overshadow months of progress.",
"一次不佳结果不应掩盖数月进步。",
"https://www.oxfordlearnersdictionaries.com/definition/english/overshadow"
],
[
"detection",
"名词 · 检测；发现",
"指察觉不易看见或确认的现象的过程，通常不可数，early detection 表早期发现；不等于已经治疗。",
"The sensor improves the detection of small leaks.",
"传感器改善了小型泄漏的检测。",
"Early detection allowed the team to repair the fault quickly.",
"早期发现使团队得以迅速修理故障。",
"https://www.oxfordlearnersdictionaries.com/definition/english/detection"
],
[
"peculiarity",
"名词 · 独特之处",
"可指不寻常的特点或某人某地独有的特征，可数；不必然带有嘲笑或贬低，需看评价语境。",
"One peculiarity of the house is its triangular kitchen.",
"这栋房子的一个独特之处是三角形厨房。",
"The guide explained a peculiarity of the local dialect.",
"导游解释了当地方言的一个特点。",
"https://www.oxfordlearnersdictionaries.com/definition/english/peculiarity"
],
[
"saint",
"名词 · 圣人",
"宗教义指教会认可其圣洁生活的人，可数；日常比喻极有耐心的好人是引申用法。",
"The window depicts a saint holding a book.",
"窗画描绘了一位拿着书的圣人。",
"The chapel was named after a local saint.",
"小礼拜堂以一位当地圣人的名字命名。",
"https://www.oxfordlearnersdictionaries.com/definition/english/saint"
],
[
"obstacle",
"名词 · 障碍",
"可指挡路物体或妨碍目标的条件，可数，obstacle to 后接名词或动名词；to 在这里是介词。",
"A fallen branch was the first obstacle on the path.",
"倒下的树枝是小路上的第一个障碍。",
"Lack of transport is an obstacle to attending the classes.",
"缺乏交通是参加课程的一大障碍。",
"https://www.oxfordlearnersdictionaries.com/definition/english/obstacle"
],
[
"refine",
"动词 · 改进",
"可指通过小调整完善，也可指提纯材料；refine a method 表精进方法，不一定全部推翻。",
"We need to refine the design after testing the prototype.",
"测试原型后，我们需要改进设计。",
"The workshop helped her refine her drawing technique.",
"工作坊帮助她精进绘画技巧。",
"https://www.oxfordlearnersdictionaries.com/definition/english/refine"
],
[
"evaporate",
"动词 · 蒸发",
"液体作主语时通常不及物，表示转化成气体；不要求达到沸点，也不代表水分凭空消失。",
"Water will evaporate from the shallow dish.",
"水会从浅盘中蒸发。",
"The puddles began to evaporate when the sun came out.",
"太阳出来后，水洼开始蒸发变干。",
"https://www.oxfordlearnersdictionaries.com/definition/english/evaporate"
],
[
"guesswork",
"名词 · 猜测",
"指缺乏足够信息时靠猜判断的过程，通常不可数；take the guesswork out of 表减少依赖猜测。",
"A clear label takes the guesswork out of sorting the boxes.",
"清楚的标签让箱子分类不必靠猜。",
"The estimate was based largely on guesswork.",
"这个估计主要依靠猜测。",
"https://www.oxfordlearnersdictionaries.com/definition/english/guesswork"
],
[
"unequaled",
"形容词 · 无与伦比的",
"是美式拼写，英式常写 unequalled；强调没有其他对象能匹敌，语气很强，常用于高度赞扬。",
"The guide praised the garden's unequaled collection of roses.",
"导游称赞花园无与伦比的玫瑰收藏。",
"Her patience with beginners was unequaled.",
"她对初学者的耐心无人能及。",
"https://dictionary.cambridge.org/dictionary/english/unequaled"
],
[
"argumentative",
"形容词 · 好争辩的",
"形容人常想争论，通常带负面意味；并不自动表示论证严谨，议论文体是其他语境。",
"He became argumentative when we questioned the figures.",
"我们质疑这些数字时，他变得爱争辩。",
"An argumentative response delayed the search for a solution.",
"好争辩的回应拖延了寻找解决方案。",
"https://www.oxfordlearnersdictionaries.com/definition/english/argumentative"
],
[
"stun",
"动词 · 使震惊",
"可表示惊讶得难以反应，也可物理上击晕；本条的消息和美景义不表示真正昏迷。",
"The unexpected result seemed to stun the panel.",
"意外结果似乎让小组成员惊呆了。",
"The view from the ridge can stun even experienced hikers.",
"山脊景色能让经验丰富的徒步者也惊叹不已。",
"https://www.oxfordlearnersdictionaries.com/definition/english/stun"
],
[
"immigrant",
"名词 · 移民",
"强调到另一个国家长期生活的人，可数；与强调离开原国家的 emigrant 是观察方向不同。",
"An immigrant opened the village's first bookshop.",
"一位移民开设了村里第一家书店。",
"The interview follows an immigrant learning a new profession.",
"采访记录了一位移民学习新职业的过程。",
"https://www.oxfordlearnersdictionaries.com/definition/english/immigrant"
],
[
"composer",
"名词 · 作曲家",
"指创作音乐的人，可数；演奏者不一定同时是 composer，写作词语的一般作者通常不这样称呼。",
"The composer wrote a short piece for the school orchestra.",
"作曲家为学校管弦乐团写了一首短曲。",
"A local composer introduced the evening's final work.",
"一位当地作曲家介绍了当晚最后一部作品。",
"https://www.oxfordlearnersdictionaries.com/definition/english/composer"
],
[
"enlist",
"动词 · 争取帮助",
"enlist someone's help 表争取某人协助；不及物 enlist in 则可指参军，两种结构需区别。",
"We hope to enlist the help of local gardeners.",
"我们希望争取当地园艺爱好者的帮助。",
"The team tried to enlist more volunteers for the survey.",
"团队试图招募更多志愿者参与调查。",
"https://www.oxfordlearnersdictionaries.com/definition/english/enlist"
],
[
"intermediate",
"形容词 · 中级的",
"指处于初级和高级之间的知识水平，常见 intermediate course；不意味着所有学习者都已掌握同一具体内容。",
"The college offers an intermediate course in Spanish.",
"学院开设中级西班牙语课程。",
"This textbook is aimed at intermediate learners.",
"这本教材面向中级学习者。",
"https://www.oxfordlearnersdictionaries.com/definition/english/intermediate"
],
[
"sensory",
"形容词 · 感觉的",
"用于与视听触等感觉接收有关的器官或体验，常见 sensory information；不等同于情感上的敏感。",
"The exhibit offers a sensory experience through sound and touch.",
"展览通过声音和触觉提供感官体验。",
"The lesson explains how insects receive sensory information.",
"课程解释昆虫如何接收感觉信息。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sensory"
],
[
"unobtainable",
"形容词 · 无法获得的",
"描述在相关条件下买不到或取不到的事物，常作表语；与只是价格高但仍能购买的情况区别。",
"The original spare part is now unobtainable.",
"原装备件如今已无法获得。",
"Fresh vegetables were almost unobtainable during the closure.",
"封路期间几乎买不到新鲜蔬菜。",
"https://www.oxfordlearnersdictionaries.com/definition/english/unobtainable"
],
[
"peak",
"名词 · 顶峰",
"可指山顶或事物最强盛的时刻，可数，at its peak 表达到高峰；此处展示山峰与高峰期两种范围。",
"Clouds hid the highest peak from view.",
"云遮住了最高山峰。",
"Demand reaches its peak during the summer holidays.",
"需求在暑假期间达到高峰。",
"https://www.oxfordlearnersdictionaries.com/definition/english/peak"
],
[
"miscalculate",
"动词 · 误算",
"直接接金额、距离等，也可不及物说明算错；还可表示对形势判断有误，不限于算术运算。",
"We may miscalculate the cost if we ignore delivery fees.",
"忽略运费可能使我们算错成本。",
"The team did not want to miscalculate how long the walk would take.",
"团队不想误判徒步所需时间。",
"https://www.oxfordlearnersdictionaries.com/definition/english/miscalculate"
],
[
"progression",
"名词 · 逐步发展",
"常指从一个阶段渐进到另一阶段，a progression from A to B 表发展路径；不一定每一步都代表改善。",
"The course offers a clear progression from basic to advanced skills.",
"课程提供从基础到高级技能的清晰进阶路径。",
"The graph records the progression of changes over six months.",
"图表记录了六个月中变化的发展过程。",
"https://www.oxfordlearnersdictionaries.com/definition/english/progression"
],
[
"forehead",
"名词 · 额头",
"指眼睛上方、发际线下方的脸部区域，可数；on someone's forehead 表在某人的额头上。",
"A bead of sweat rolled down her forehead.",
"一颗汗珠沿着她的额头滚下。",
"He pushed his glasses up onto his forehead.",
"他把眼镜推到了额头上。",
"https://www.oxfordlearnersdictionaries.com/definition/english/forehead"
],
[
"longitude",
"名词 · 经度",
"指地点相对本初子午线向东或西的角距离，用度数表示；与南北位置的 latitude 纬度区分。",
"The map lists both latitude and longitude.",
"地图同时列出了纬度与经度。",
"We used the longitude to locate the island more precisely.",
"我们利用经度更精确地定位岛屿。",
"https://www.oxfordlearnersdictionaries.com/definition/english/longitude"
],
[
"symptom",
"名词 · 症状",
"指身体或心理状态改变所表现的征象，可数，symptom of 后接病症；单一症状通常不能独立确定诊断。",
"The doctor asked when the first symptom appeared.",
"医生询问第一个症状何时出现。",
"The leaflet describes a common symptom of the illness.",
"传单描述了这种疾病的一个常见症状。",
"https://www.oxfordlearnersdictionaries.com/definition/english/symptom"
],
[
"sacred",
"形容词 · 神圣的",
"可指与宗教崇敬有关，也可比喻极受尊重而不可侵犯，sacred to 后说明相关群体或个人。",
"The grove is sacred to the local community.",
"这片树林对当地社群来说是神圣的。",
"Visitors were asked not to photograph the sacred objects.",
"访客被要求不要拍摄这些圣物。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sacred"
],
[
"vibrant",
"形容词 · 充满活力的",
"可形容人或地区生气勃勃，也可形容颜色鲜明；不能把任何明亮光源都理解为有活力。",
"The market remains a vibrant part of town life.",
"市场仍是镇上生活中充满活力的一部分。",
"She chose vibrant colors for the mural.",
"她为壁画选择了鲜艳的颜色。",
"https://www.oxfordlearnersdictionaries.com/definition/english/vibrant"
],
[
"harmonious",
"形容词 · 和谐的",
"可描述相处和平或各部分搭配协调，常见 harmonious relationship；不只指音乐有和声。",
"The garden creates a harmonious balance of stone and planting.",
"花园让石材与植物形成协调平衡。",
"The two teams developed a harmonious working relationship.",
"两个团队建立了和谐的工作关系。",
"https://www.oxfordlearnersdictionaries.com/definition/english/harmonious"
],
[
"format",
"名词 · 格式",
"指内容安排呈现方式或数据存储结构，可数；in a different format 表换一种格式，不一定更改内容。",
"The teacher explained the format of the oral examination.",
"老师解释了口试形式。",
"Please save the images in the requested format.",
"请用所要求的格式保存图片。",
"https://www.oxfordlearnersdictionaries.com/definition/english/format"
],
[
"spill",
"动词 · 洒出",
"可及物使液体洒出，也可不及物液体溢出，spill onto 表洒到表面；过去式 spilled 或 spilt。",
"Try not to spill the paint on the floor.",
"尽量别把油漆洒在地板上。",
"Water began to spill over the rim of the bucket.",
"水开始从桶沿溢出。",
"https://www.oxfordlearnersdictionaries.com/definition/english/spill"
],
[
"split",
"动词 · 分开",
"可及物或不及物，split into 表分成若干部分；过去式和过去分词仍为 split，不写 splitted。",
"We will split the class into three groups.",
"我们将把全班分成三组。",
"The wood may split if the screw is too thick.",
"螺丝太粗可能使木头裂开。",
"https://www.oxfordlearnersdictionaries.com/definition/english/split"
],
[
"vague",
"形容词 · 模糊的",
"可指记忆不清或表达缺少细节，常见 vague instructions；不是用来形容物理表面不平整的词。",
"The directions were too vague to follow.",
"指示太模糊，无法照做。",
"I have a vague memory of visiting this bridge as a child.",
"我模糊记得小时候来过这座桥。",
"https://www.oxfordlearnersdictionaries.com/definition/english/vague"
],
[
"roast",
"动词 · 烤",
"通常指不用水在烤箱或火上烹调肉菜，也可烘烤豆类坚果；与在水里煮不同。",
"Roast the vegetables until the edges turn golden.",
"把蔬菜烤到边缘金黄。",
"They roast their coffee beans in small batches.",
"他们小批量烘焙咖啡豆。",
"https://www.oxfordlearnersdictionaries.com/definition/english/roast"
],
[
"barren",
"形容词 · 贫瘠的",
"可描述土地难以支持植物生长，常见 barren hillside；植物无结果实等义也存在，需按对象判断。",
"The barren hillside had almost no vegetation.",
"贫瘠山坡上几乎没有植被。",
"Wind swept across the barren plain.",
"风掠过荒凉贫瘠的平原。",
"https://www.oxfordlearnersdictionaries.com/definition/english/barren"
],
[
"shrinkage",
"名词 · 收缩",
"指尺寸变小的过程或缩小幅度，通常不可数；fabric shrinkage 常指织物缩水，不必是人为裁剪。",
"The label warns of possible shrinkage after washing.",
"标签警告洗涤后可能缩水。",
"We measured the shrinkage of the clay as it dried.",
"我们测量了黏土干燥时的收缩量。",
"https://www.oxfordlearnersdictionaries.com/definition/english/shrinkage"
],
[
"correspond",
"动词 · 对应",
"correspond to 表与某物对应，correspond with 可指相符或通信；不要把物理对应误译成写信。",
"The numbers correspond to locations on the map.",
"这些数字对应地图上的位置。",
"The observed pattern did not correspond with our prediction.",
"观察到的模式与我们的预测不符。",
"https://www.oxfordlearnersdictionaries.com/definition/english/correspond"
],
[
"rehearsal",
"名词 · 排练",
"指演出前练习的活动或一次练习，可用 a rehearsal for；不把正式演出本身称作排练。",
"The rehearsal was moved to a smaller room.",
"排练改到了一个较小房间。",
"We scheduled a final rehearsal for Friday evening.",
"我们把最后一次排练安排在星期五晚上。",
"https://www.oxfordlearnersdictionaries.com/definition/english/rehearsal"
],
[
"improbable",
"形容词 · 不大可能的",
"表示事情不太会发生或说法不太可信，常见 highly improbable；不同于不可能的 impossible。",
"A second delay seemed improbable after the road reopened.",
"道路恢复通行后，再次延误似乎不大可能。",
"The novel ends with an improbable coincidence.",
"小说以一个不大可能发生的巧合结尾。",
"https://www.oxfordlearnersdictionaries.com/definition/english/improbable"
],
[
"catalyst",
"名词 · 催化剂",
"化学中指改变反应速率、在反应后再生的物质，也可比喻促成变化的因素，常接 for。",
"The diagram shows how the catalyst speeds up the reaction.",
"示意图显示催化剂如何加快反应。",
"The exhibition became a catalyst for local art projects.",
"这场展览成为当地艺术项目的推动因素。",
"https://www.oxfordlearnersdictionaries.com/definition/english/catalyst"
],
[
"spark",
"动词 · 引发",
"直接接讨论、兴趣等，表示使其突然开始；也有发出火花义，不能把所有抽象 spark 都当火灾。",
"The discovery could spark a new debate about the site.",
"这个发现可能引发关于遗址的新争论。",
"The damaged wire began to spark behind the panel.",
"受损电线开始在面板后冒火花。",
"https://www.oxfordlearnersdictionaries.com/definition/english/spark"
],
[
"glow",
"动词 · 发光",
"指持续柔和地发光，不强调忽明忽暗；还可形容脸发红或洋溢情感，需看主语。",
"The lanterns glow softly along the garden path.",
"灯笼沿花园小路柔和发光。",
"The coals continued to glow after the flames died down.",
"火焰减弱后，炭火仍在发红发光。",
"https://www.oxfordlearnersdictionaries.com/definition/english/glow"
],
[
"ecologist",
"名词 · 生态学家",
"指研究生物与环境关系的人，可数；不等同于所有泛泛热爱自然却不从事相关研究的人。",
"An ecologist studied the insects living in the wetland.",
"一位生态学家研究湿地中的昆虫。",
"The ecologist compared habitats on both sides of the road.",
"生态学家比较了道路两侧的栖息地。",
"https://www.oxfordlearnersdictionaries.com/definition/english/ecologist"
],
[
"disharmony",
"名词 · 不和",
"通常不可数，表示人或群体间因意见不一致产生的不良关系；不一定意味着已经激烈争吵。",
"The sudden change caused disharmony within the group.",
"突然的变化引起了小组内部不和。",
"Clear responsibilities helped reduce disharmony between departments.",
"明确职责有助于减少部门间不和。",
"https://www.oxfordlearnersdictionaries.com/definition/english/disharmony"
],
[
"strive",
"动词 · 努力",
"常用 strive to do 或 strive for，引出努力的目标；语体比 try 更正式，强调投入的努力。",
"We strive to make every session accessible.",
"我们努力让每次活动都便于大家参加。",
"The team continues to strive for a safer design.",
"团队继续努力寻求更安全的设计。",
"https://www.oxfordlearnersdictionaries.com/definition/english/strive"
],
[
"transplant",
"动词 · 移栽",
"本条指把植物从一处移到另一处生长，可直接接植物；移植器官义在医学场景中另行理解。",
"Transplant the seedlings after the last frost.",
"最后一次霜冻后再移栽幼苗。",
"We plan to transplant the shrub to a sunnier corner.",
"我们计划把灌木移到阳光更充足的角落。",
"https://www.oxfordlearnersdictionaries.com/definition/english/transplant"
],
[
"acidity",
"名词 · 酸度",
"指物质含酸或呈酸性的程度，通常不可数；taste 与测得的酸碱性质并非在任何条件下完全等同。",
"The test measures the acidity of the soil.",
"这项测试测量土壤酸度。",
"The recipe balances sweetness with the acidity of lemon juice.",
"食谱用柠檬汁的酸味平衡甜味。",
"https://www.oxfordlearnersdictionaries.com/definition/english/acidity"
],
[
"diversification",
"名词 · 多样化",
"指扩展产品、技能等种类的过程，常用 diversification of；不等于单一种类数量增加。",
"Diversification of crops reduced the farm's dependence on wheat.",
"作物多样化减少了农场对小麦的依赖。",
"The plan supports the diversification of local industries.",
"计划支持当地产业多元化。",
"https://www.oxfordlearnersdictionaries.com/definition/english/diversification"
],
[
"overtake",
"动词 · 超过",
"可指从后面赶过移动对象，也可指数量超出，过去式 overtook、过去分词 overtaken；不用规则 ed。",
"Do not overtake on the narrow bridge.",
"不要在窄桥上超车。",
"Demand may overtake supply during the holiday season.",
"假期期间需求可能超过供应。",
"https://www.oxfordlearnersdictionaries.com/definition/english/overtake"
],
[
"scarce",
"形容词 · 稀缺的",
"表示供应不足或难找到，常见 scarce resources；与形似副词 scarcely 的几乎不不能混用。",
"Fresh water is scarce on the island in summer.",
"岛上夏季淡水稀缺。",
"The team had to share scarce building materials.",
"团队不得不共享稀缺建筑材料。",
"https://www.oxfordlearnersdictionaries.com/definition/english/scarce"
],
[
"sponge",
"名词 · 海绵",
"指柔软多孔、可吸水的天然或人造材料及其一块，清洁语境可数；动物海绵是相关另一范围。",
"Use a soft sponge to clean the painted surface.",
"用柔软海绵清洁涂漆表面。",
"The sponge absorbed the water from the tray.",
"海绵吸收了盘里的水。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sponge"
],
[
"landmark",
"名词 · 地标",
"指能帮助辨认位置的显著建筑或地形，可数；比喻里程碑时强调重要进展，不只是远处可见。",
"The old clock tower is a useful landmark.",
"旧钟楼是一个有用的地标。",
"We used the lighthouse as a landmark while walking.",
"徒步时我们把灯塔作为地标。",
"https://www.oxfordlearnersdictionaries.com/definition/english/landmark"
],
[
"matrix",
"名词 · 矩阵",
"数学中指按行列排列的一组数或符号，可数，复数常用 matrices；不等于任意散乱数据。",
"Place the values in a three-by-three matrix.",
"把数值放进一个三乘三矩阵。",
"The matrix shows the relationship between each pair of variables.",
"矩阵显示每对变量之间的关系。",
"https://www.oxfordlearnersdictionaries.com/definition/english/matrix"
],
[
"coil",
"动词 · 盘绕",
"可及物把绳线绕成一圈圈，也可不及物表示盘起；coil around 后接被绕的物体。",
"Coil the rope neatly before putting it away.",
"收起绳子前先把它整齐盘好。",
"The vine began to coil around the wooden post.",
"藤蔓开始绕着木桩盘生。",
"https://www.oxfordlearnersdictionaries.com/definition/english/coil"
],
[
"drastic",
"形容词 · 大幅度的",
"描述影响强烈、突然或极端的变化与措施，常见 drastic reduction；不是所有微小调整都适用。",
"The plan would require a drastic reduction in traffic.",
"计划将要求大幅减少车流。",
"We avoided drastic changes until the tests were complete.",
"测试完成前我们避免了大幅改动。",
"https://www.oxfordlearnersdictionaries.com/definition/english/drastic"
],
[
"counsel",
"名词 · 忠告",
"表示建议时通常不可数，seek counsel 表寻求建议；法律语境也可指律师，本条主要限建议义。",
"She sought counsel from a more experienced colleague.",
"她向一位更有经验的同事寻求建议。",
"His calm counsel helped us reconsider the decision.",
"他冷静的忠告帮助我们重新考虑决定。",
"https://www.oxfordlearnersdictionaries.com/definition/english/counsel"
],
[
"representation",
"名词 · 表现；再现",
"指用图像、文字等呈现事物的方式或结果，a representation of 后接对象；法律代理等义另行理解。",
"The model is a simplified representation of the river system.",
"模型是河流系统的简化再现。",
"The essay questions the film's representation of village life.",
"文章质疑影片对乡村生活的呈现。",
"https://www.oxfordlearnersdictionaries.com/definition/english/representation"
],
[
"interior",
"名词 · 内部",
"指物体或建筑的内部，可数，the interior of 后接整体；地理中还可指远离海岸的内陆地区。",
"The interior of the church is surprisingly bright.",
"教堂内部出奇地明亮。",
"We cleaned the interior before painting the outside.",
"我们在粉刷外部前先清理了内部。",
"https://www.oxfordlearnersdictionaries.com/definition/english/interior"
],
[
"speculate",
"动词 · 推测",
"常用 speculate about 或 that 从句表示信息不全时的推断；不应把推测写成已确认事实。",
"We can only speculate about why the settlement was abandoned.",
"我们只能推测这个定居点为何被废弃。",
"Researchers speculate that the marks were made by water.",
"研究人员推测这些痕迹是水流造成的。",
"https://www.oxfordlearnersdictionaries.com/definition/english/speculate"
],
[
"consistent",
"形容词 · 一致的",
"consistent with 表与某信息相符，也可形容表现稳定；一致并不单独证明因果关系。",
"The results are consistent with our earlier observations.",
"结果与先前观察一致。",
"Her work has been consistent throughout the term.",
"整个学期她的表现一直很稳定。",
"https://www.oxfordlearnersdictionaries.com/definition/english/consistent"
],
[
"sector",
"名词 · 部门；领域",
"经济语境中指一类活动组成的领域，常见 public sector；不等同于单一公司的一个办公室。",
"The report focuses on the tourism sector.",
"报告聚焦旅游业。",
"Many graduates found work in the public sector.",
"许多毕业生在公共部门找到了工作。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sector"
],
[
"interfere",
"动词 · 干涉",
"interfere in 表不受欢迎地干预事务，interfere with 表妨碍或影响；是不及物结构，需使用适当介词。",
"Please do not interfere with the equipment during testing.",
"测试期间请勿摆弄设备。",
"She did not want to interfere in the team's decision.",
"她不想干涉团队的决定。",
"https://www.oxfordlearnersdictionaries.com/definition/english/interfere"
],
[
"inhibit",
"动词 · 抑制",
"可表示阻碍过程或使人拘谨，直接接被影响对象；不一定完全停止，常用于减慢或降低发生频率。",
"Low temperatures can inhibit seed growth.",
"低温会抑制种子生长。",
"Fear of mistakes may inhibit students' participation.",
"害怕犯错可能阻碍学生参与。",
"https://www.oxfordlearnersdictionaries.com/definition/english/inhibit"
],
[
"temperate",
"形容词 · 温带的；温和的",
"气候语境表示气温适中、少极端冷热，常见 temperate region；描述人言行时另有克制义。",
"These trees grow best in temperate regions.",
"这些树在温带地区长得最好。",
"The island has a temperate climate with mild winters.",
"岛上气候温和，冬季不太冷。",
"https://www.oxfordlearnersdictionaries.com/definition/english/temperate"
],
[
"chunk",
"名词 · 大块",
"指切下或断下的厚实一块，常用 a chunk of；也可指相当一部分时间或信息，不一定都是食物。",
"A chunk of plaster fell from the ceiling.",
"一大块灰泥从天花板掉下。",
"The task took a large chunk of the afternoon.",
"这项任务占去下午很大一部分时间。",
"https://www.oxfordlearnersdictionaries.com/definition/english/chunk"
],
[
"spin",
"动词 · 旋转",
"可及物使物体转，也可不及物自转，过去式和过去分词 spun；不按普通规则写 spinned。",
"Spin the wheel gently to check the bearing.",
"轻轻转动车轮，检查轴承。",
"The leaves began to spin in the shallow pool.",
"叶子开始在浅水池中打转。",
"https://www.oxfordlearnersdictionaries.com/definition/english/spin"
],
[
"vastly",
"副词 · 极大地",
"表示程度差异非常大，常修饰比较级，如 vastly different；不作形容词直接修饰面积名词。",
"The restored room looks vastly different.",
"修复后的房间看起来大不相同。",
"The new method is vastly more efficient.",
"新方法效率高得多。",
"https://www.oxfordlearnersdictionaries.com/definition/english/vastly"
],
[
"swirl",
"动词 · 打旋",
"表示液体、气体等快速绕圈运动，可及物使其旋动；swirl around 后可说明环绕位置。",
"Mist began to swirl around the tower.",
"薄雾开始绕着塔楼旋转。",
"Swirl the water gently before adding the dye.",
"加入染料前轻轻旋动水。",
"https://www.oxfordlearnersdictionaries.com/definition/english/swirl"
],
[
"tap",
"动词 · 轻拍",
"指快速轻轻敲击，可直接接对象，也可 tap on a door；与名词水龙头及开发资源义依上下文区分。",
"Tap the lid gently to loosen it.",
"轻轻敲击盖子使它松动。",
"She used a pencil to tap on the window frame.",
"她用铅笔轻敲窗框。",
"https://www.oxfordlearnersdictionaries.com/definition/english/tap"
],
[
"frost",
"名词 · 霜",
"可指气温降到冰点以下的天气或表面薄冰晶，a frost 常指一次霜冻；不是地面积雪的通称。",
"A light frost covered the garden bench.",
"薄霜覆盖了花园长凳。",
"We moved the pots indoors before the first frost.",
"第一次霜冻前，我们把盆栽搬进了屋。",
"https://www.oxfordlearnersdictionaries.com/definition/english/frost"
],
[
"complement",
"动词 · 补充；相配",
"表示加上某物使整体更好，直接接被补充对象；与表示赞美的 compliment 拼写含义不同。",
"The blue cushions complement the pale wooden chairs.",
"蓝色靠垫与浅色木椅相配。",
"The photographs complement the written account.",
"照片补充了文字叙述。",
"https://www.oxfordlearnersdictionaries.com/definition/english/complement"
],
[
"wavelength",
"名词 · 波长",
"指波中相邻同相位点间距离，可数；be on the same wavelength 另可比喻彼此想法一致。",
"The instrument measures the wavelength of the light.",
"仪器测量光的波长。",
"Changing the wavelength altered the color we observed.",
"改变波长后，我们观察到的颜色变了。",
"https://www.oxfordlearnersdictionaries.com/definition/english/wavelength"
],
[
"glacier",
"名词 · 冰川",
"指由积雪等形成、缓慢流动的大量冰体，可数；不是漂在海面的一块冰山。",
"The glacier has retreated since the photograph was taken.",
"自那张照片拍摄以来，冰川已经后退。",
"Meltwater from the glacier feeds the river.",
"冰川融水补给这条河。",
"https://www.oxfordlearnersdictionaries.com/definition/english/glacier"
],
[
"migrant",
"名词 · 迁移者",
"可指为工作生活迁移的人，也可指季节迁移的动物；不等同于必然跨国永久定居。",
"A migrant described moving between farms for seasonal work.",
"一位迁移劳动者讲述了为季节工作辗转农场的经历。",
"The bird is a regular migrant through this wetland.",
"这种鸟经常迁徙经过这片湿地。",
"https://www.oxfordlearnersdictionaries.com/definition/english/migrant"
],
[
"decay",
"名词 · 腐烂；衰败",
"本条是名词，指自然破坏或疏于维护导致的衰败过程，通常不可数；动词同形，需看句法。",
"The wood showed signs of decay near the ground.",
"靠地面的木材显出腐烂迹象。",
"Regular maintenance slowed the building's decay.",
"定期维护减缓了建筑的衰败。",
"https://www.oxfordlearnersdictionaries.com/definition/english/decay"
],
[
"subscribe",
"动词 · 订阅",
"常用 subscribe to 后接刊物或服务，表示定期接收或使用；subscribe to an idea 另表示赞同观点。",
"You can subscribe to the museum's monthly newsletter.",
"你可以订阅博物馆的月度通讯。",
"We subscribe to a database of historical maps.",
"我们订阅了一个历史地图数据库。",
"https://www.oxfordlearnersdictionaries.com/definition/english/subscribe"
],
[
"process",
"名词 · 过程",
"表示为达结果的一系列步骤或自然变化，可数；in the process of doing 表正在做某事。",
"The guide explains each stage of the printing process.",
"指南解释印刷过程的每个阶段。",
"We are in the process of replacing the old labels.",
"我们正在更换旧标签。",
"https://dictionary.cambridge.org/dictionary/english/process"
],
[
"intervention",
"名词 · 干预",
"指为改善局面等采取的行动，可数或泛指干预；an intervention in 可说明介入的事务。",
"Early intervention helped prevent further damage to the roof.",
"早期干预帮助防止屋顶进一步损坏。",
"The study compares learning with and without teacher intervention.",
"研究比较有无教师干预时的学习情况。",
"https://www.oxfordlearnersdictionaries.com/definition/english/intervention"
],
[
"large-scale",
"形容词 · 大规模的",
"表示涉及很多对象或广阔范围，常见 large-scale survey；地图中也可指大比例尺，范围含义需另辨。",
"A large-scale survey began across the region.",
"全地区开始了一项大规模调查。",
"The plan would require large-scale changes to the road network.",
"计划将要求大规模改变道路网络。",
"https://www.oxfordlearnersdictionaries.com/definition/english/large-scale"
],
[
"bust",
"动词 · 弄坏（非正式）",
"本条取非正式的打破或弄坏义，直接接对象；与名词半身像以及警方搜查等义项依语境区别。",
"Do not bust the latch by forcing the door.",
"别硬推门把门闩弄坏。",
"That heavy load could bust the old wheel.",
"那样重的负荷可能弄坏旧轮子。",
"https://www.oxfordlearnersdictionaries.com/definition/english/bust"
],
[
"interdependence",
"名词 · 相互依赖",
"指各方或各部分彼此需要对方的状态，通常不可数；interdependence between 表多方关系，不是单向依赖。",
"The lesson explores interdependence between plants and pollinators.",
"这堂课探讨植物与传粉者之间的相互依赖。",
"The diagram shows the interdependence of the system's parts.",
"示意图展示系统各部分的相互依赖。",
"https://www.oxfordlearnersdictionaries.com/definition/english/interdependence"
],
[
"conception",
"名词 · 观念",
"a conception of 表对某事的理解或想象方式；本条不用受孕义，不应将所有情境都按生理过程理解。",
"The exhibition challenges our conception of a public museum.",
"展览挑战了我们对公共博物馆的观念。",
"Her conception of success changed after the journey.",
"旅程之后，她对成功的理解发生了变化。",
"https://www.oxfordlearnersdictionaries.com/definition/english/conception"
],
[
"gymnastic",
"形容词 · 体操的",
"用于与体操动作或训练有关的名词，常见 gymnastic exercises；不是指任何体育运动的通用形容词。",
"The class began with simple gymnastic exercises.",
"课程以简单体操练习开始。",
"A gymnastic display formed part of the festival.",
"体操表演是节庆的一部分。",
"https://www.oxfordlearnersdictionaries.com/definition/english/gymnastic"
],
[
"splash",
"动词 · 泼溅",
"可指液体飞落，也可及物使人或物被溅湿，splash onto 表溅到表面；不一定把整体浸透。",
"Try not to splash water onto the floor.",
"尽量不要把水溅到地板上。",
"The children began to splash in the shallow stream.",
"孩子们开始在浅溪里玩水。",
"https://www.oxfordlearnersdictionaries.com/definition/english/splash"
],
[
"median",
"形容词 · 中位的",
"统计语境中指排序后居于中间的值，常用 median income；不同于把总和除以个数的平均值。",
"The report compares median household income across towns.",
"报告比较不同城镇的家庭收入中位数。",
"The median score was higher in the second group.",
"第二组的分数中位数更高。",
"https://www.oxfordlearnersdictionaries.com/definition/english/median"
],
[
"heredity",
"名词 · 遗传",
"指亲代把某些特征传给子代的过程，通常不可数；特征发展也受环境等影响，不宜推成单一决定论。",
"The class studied heredity using the color of pea flowers.",
"全班以豌豆花色为例学习遗传。",
"The textbook explains the role of heredity in inherited traits.",
"教材解释了遗传在遗传性状中的作用。",
"https://www.oxfordlearnersdictionaries.com/definition/english/heredity"
],
[
"essence",
"名词 · 本质",
"the essence of 表某事最重要的特征，in essence 表本质上；植物浓缩香精是另一义项。",
"The essence of the plan is to reuse existing materials.",
"计划的核心是重复利用现有材料。",
"In essence, both methods solve the same problem.",
"本质上，这两种方法解决同一个问题。",
"https://www.oxfordlearnersdictionaries.com/definition/english/essence"
],
[
"exert",
"动词 · 施加",
"常与 pressure、influence 等搭配，exert something on 表对谁施加；exert yourself 另表示努力。",
"The roots can exert pressure on the old wall.",
"根系能对旧墙施加压力。",
"The committee may exert influence on the final decision.",
"委员会可能对最终决定施加影响。",
"https://www.oxfordlearnersdictionaries.com/definition/english/exert"
],
[
"questionnaire",
"名词 · 问卷",
"指为收集信息而列出的一组书面问题，可数，fill in a questionnaire 表填写；与一次面谈不完全相同。",
"Each visitor received a short questionnaire about the exhibition.",
"每位访客都收到一份有关展览的简短问卷。",
"The questionnaire asks how often people use the park.",
"问卷询问人们使用公园的频率。",
"https://www.oxfordlearnersdictionaries.com/definition/english/questionnaire"
],
[
"mold",
"名词 · 模具",
"本条采用美式拼写的模具义，英式 mould；把液体或软材料放入后形成相应形状，霉菌义另看场景。",
"Pour the mixture into a clean mold.",
"把混合物倒入干净模具。",
"The mold gives the soap a shell shape.",
"模具让肥皂成贝壳形。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mold"
],
[
"endanger",
"动词 · 危及",
"直接接可能受伤害的人、物或状态，强调使其陷入风险；不一定表示伤害已经发生。",
"Loose cables could endanger visitors.",
"松散电缆可能危及访客。",
"Pollution may endanger the fish living downstream.",
"污染可能危及下游生活的鱼类。",
"https://www.oxfordlearnersdictionaries.com/definition/english/endanger"
],
[
"sculpture",
"名词 · 雕塑",
"指立体艺术作品时可数，指艺术门类时常不可数；a sculpture of 后可说明塑造对象。",
"A wooden sculpture stands near the garden entrance.",
"一件木雕立在花园入口附近。",
"She studies sculpture at the local art college.",
"她在当地艺术学院学习雕塑。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sculpture"
],
[
"clearing",
"名词 · 林间空地",
"本义指森林中没有树木的开阔区域，可数；大学补录等其他义项不适用于林地场景。",
"We stopped for lunch in a small clearing.",
"我们在一片小林间空地停下吃午饭。",
"Sunlight reached the grass in the clearing.",
"阳光照到林间空地的草上。",
"https://www.oxfordlearnersdictionaries.com/definition/english/clearing"
],
[
"wander",
"动词 · 漫步",
"指没有固定方向或目的地走动，常用 wander through 或 around；不表示每次都迷路。",
"We had time to wander through the old market.",
"我们有时间在老市场里漫步。",
"Do not wander away from the marked route in the fog.",
"有雾时不要偏离标明的路线。",
"https://www.oxfordlearnersdictionaries.com/definition/english/wander"
],
[
"maximal",
"形容词 · 最大限度的",
"常见于技术或科学语境，表示达到可能的最大值；与日常泛称较大的 large 强度不同。",
"The test recorded maximal force during each attempt.",
"测试记录了每次尝试的最大力量。",
"The design allows maximal use of natural light.",
"设计可最大限度利用自然光。",
"https://www.oxfordlearnersdictionaries.com/definition/english/maximal"
],
[
"conformity",
"名词 · 遵从",
"in conformity with 表符合规定，社会语境还可指遵守群体惯例；通常不可数，不等于内容完全相同。",
"The work was completed in conformity with the agreed standard.",
"工作按约定标准完成。",
"The novel questions the pressure for conformity in the community.",
"小说质疑社区中要求顺从的压力。",
"https://www.oxfordlearnersdictionaries.com/definition/english/conformity"
],
[
"rid",
"动词 · 使摆脱",
"常用 rid someone of something 或 get rid of；rid 在固定结构中不能随意省去连接被去除事物的 of。",
"We need to get rid of the broken shelving.",
"我们需要处理掉坏架子。",
"The new filter will help rid the water of fine particles.",
"新滤芯将帮助清除水中的微粒。",
"https://www.oxfordlearnersdictionaries.com/definition/english/rid"
],
[
"undertake",
"动词 · 承担",
"可直接接任务或工程，undertake to do 还可表示承诺；过去式 undertook，过去分词 undertaken。",
"The team will undertake a detailed survey of the building.",
"团队将承担建筑的详细勘察。",
"She agreed to undertake the repairs before winter.",
"她同意在冬季前承担维修工作。",
"https://www.oxfordlearnersdictionaries.com/definition/english/undertake"
],
[
"disruption",
"名词 · 扰乱；中断",
"指活动无法正常继续的情况或过程，可用 disruption to services；不必然表示永久停止服务。",
"The repairs caused some disruption to bus services.",
"维修对公交服务造成了一些干扰。",
"We planned the work to minimize disruption in the library.",
"我们安排工作时尽量减少对图书馆的干扰。",
"https://www.oxfordlearnersdictionaries.com/definition/english/disruption"
],
[
"quest",
"名词 · 追求",
"常用 a quest for 加目标，表示持续而认真的寻找；语气比一次短暂找钥匙更郑重。",
"The book follows her quest for a lost family history.",
"这本书记录了她追寻失落家族历史的过程。",
"Their quest for a simpler design continued for months.",
"他们寻找更简单设计的努力持续了数月。",
"https://www.oxfordlearnersdictionaries.com/definition/english/quest"
],
[
"frown",
"动词 · 皱眉",
"指眉头聚拢表达担忧、生气或思考，frown at 引出对象；frown on 则可表示不赞成。",
"She began to frown at the unfamiliar figures.",
"她看着陌生数字开始皱眉。",
"He did not mean to frown during the photograph.",
"拍照时他并非有意皱眉。",
"https://www.oxfordlearnersdictionaries.com/definition/english/frown"
],
[
"commute",
"动词 · 通勤",
"指经常往返住所和工作地点，commute from A to B 表路线；不泛指偶尔去另一个城市旅行。",
"She has to commute by train three days a week.",
"她每周有三天必须乘火车通勤。",
"Many residents commute from the village to the city.",
"许多居民从村庄通勤到城市。",
"https://www.oxfordlearnersdictionaries.com/definition/english/commute"
],
[
"deficit",
"名词 · 赤字；不足",
"财务语境指支出超过收入的差额，可数；也可指相对需求不足，预算赤字不等同全部债务。",
"The museum ended the year with a small deficit.",
"博物馆年底出现了一笔小额赤字。",
"The budget aims to reduce the deficit over three years.",
"预算旨在三年内减少赤字。",
"https://www.oxfordlearnersdictionaries.com/definition/english/deficit"
],
[
"drown",
"动词 · 溺水身亡",
"可不及物表示因淹没窒息而死，也可及物使淹没；未死亡的落水经历不应一概译作 drowned。",
"Small animals may drown in an uncovered water tank.",
"小动物可能在未加盖的水箱里溺亡。",
"The warning tells visitors that even strong swimmers can drown.",
"警告提醒访客，即使游泳高手也可能溺亡。",
"https://www.oxfordlearnersdictionaries.com/definition/english/drown"
],
[
"restoration",
"名词 · 修复",
"表示恢复旧建筑或艺术品状况的工作，常用 restoration of；不必是拆掉重造，也有恢复制度等义。",
"The restoration of the ceiling took two years.",
"天花板的修复花了两年。",
"Careful restoration revealed the painting's original colors.",
"细致修复揭示了画作原有的色彩。",
"https://www.oxfordlearnersdictionaries.com/definition/english/restoration"
],
[
"encounter",
"动词 · 遇到",
"可指偶然遇见人，也可遇到问题，直接接对象；不像 meet 那样通常指事先安排的正式会面。",
"We may encounter fallen branches along the route.",
"我们可能在路上遇到倒下的树枝。",
"Visitors sometimes encounter seals near the harbor.",
"游客有时会在港口附近遇见海豹。",
"https://www.oxfordlearnersdictionaries.com/definition/english/encounter"
],
[
"dynasty",
"名词 · 王朝",
"指同一家族统治者延续的系列或其统治时期，可数；不是任何一次政府任期都能称王朝。",
"The vase dates from an earlier dynasty.",
"花瓶出自较早的一个王朝。",
"The chapter describes how the dynasty lost control of the coast.",
"这一章描述王朝如何失去对海岸的控制。",
"https://www.oxfordlearnersdictionaries.com/definition/english/dynasty"
],
[
"equator",
"名词 · 赤道",
"通常用 the equator，指地球上距南北极相等的假想纬线；不是地球表面真实画出的一条线。",
"The island lies just north of the equator.",
"这个岛位于赤道以北不远处。",
"The map marks the equator with a bold line.",
"地图用粗线标出赤道。",
"https://www.oxfordlearnersdictionaries.com/definition/english/equator"
],
[
"identification",
"名词 · 身份证明",
"可指辨明身份的过程或相关文件，通常不可数；show identification 表出示身份证明，不限于一种证件。",
"Please bring identification when collecting the parcel.",
"领取包裹时请带上身份证明。",
"The photograph helped with the identification of the missing bag.",
"照片帮助辨认了遗失的包。",
"https://www.oxfordlearnersdictionaries.com/definition/english/identification"
],
[
"radius",
"名词 · 半径",
"指圆心到圆周的线段或其长度，可数；within a radius of 表某中心周围一定距离内。",
"Draw a circle with a radius of five centimeters.",
"画一个半径五厘米的圆。",
"The service operates within a radius of ten miles.",
"服务覆盖十英里半径范围。",
"https://www.oxfordlearnersdictionaries.com/definition/english/radius"
],
[
"voltage",
"名词 · 电压",
"指以伏特计量的电势差，可数或不可数；与表示电流的 current 是不同物理量，不宜混称。",
"Check the voltage printed on the charger.",
"检查充电器上印的电压。",
"The display shows a sudden drop in voltage.",
"显示屏显示电压突然下降。",
"https://www.oxfordlearnersdictionaries.com/definition/english/voltage"
],
[
"stir",
"动词 · 搅拌",
"直接接液体或混合物，也可 stir something into 表把某物搅入；不表示所有摇动容器的动作。",
"Stir the sauce gently with a wooden spoon.",
"用木勺轻轻搅拌酱汁。",
"Stir a little water into the paste.",
"把少量水搅入糊中。",
"https://www.oxfordlearnersdictionaries.com/definition/english/stir"
],
[
"lawn",
"名词 · 草坪",
"指花园公园等经修剪的草地，可数；a patch of wild grass 不一定是维护过的 lawn。",
"The children sat on the lawn beneath the apple tree.",
"孩子们坐在苹果树下的草坪上。",
"Please keep the heavy trolley off the lawn.",
"请不要把重手推车推上草坪。",
"https://www.oxfordlearnersdictionaries.com/definition/english/lawn"
],
[
"domain",
"名词 · 领域",
"指知识、活动或责任范围，常用 the domain of；互联网域名是另一技术义，不能一概理解为实体地盘。",
"The question lies within the domain of public health.",
"这个问题属于公共卫生领域。",
"Digital maps are now part of her professional domain.",
"数字地图现在是她专业领域的一部分。",
"https://www.oxfordlearnersdictionaries.com/definition/english/domain"
],
[
"installation",
"名词 · 安装",
"指把设备等固定好以便使用的过程，通常不可数，installation of 后接设备；大型装置可数义另行理解。",
"Installation of the new lighting begins on Monday.",
"新照明的安装星期一开始。",
"The fee includes delivery and installation.",
"费用包括配送和安装。",
"https://www.oxfordlearnersdictionaries.com/definition/english/installation"
],
[
"aroma",
"名词 · 芳香",
"指容易察觉的宜人气味，可数，the aroma of 后接来源；不同于没有褒贬限制的 smell。",
"The aroma of fresh coffee drifted into the hallway.",
"新鲜咖啡的香气飘进走廊。",
"A warm aroma rose from the bread as she cut it.",
"她切开面包时，一股暖暖的香气升起。",
"https://www.oxfordlearnersdictionaries.com/definition/english/aroma"
],
[
"primate",
"名词 · 灵长类动物",
"本条采用动物学义，指包含猴、猿和人类等的哺乳动物类群成员；宗教高级主教义不同。",
"The primate used a stick to reach the food.",
"这只灵长类动物用棍子够食物。",
"Each primate in the study was observed from a distance.",
"研究中每只灵长类动物都接受了远距离观察。",
"https://www.oxfordlearnersdictionaries.com/definition/english/primate"
],
[
"cancer",
"名词 · 癌症",
"指异常细胞失控生长相关的一类疾病，泛指时通常不可数；并不是所有肿块都可称为 cancer。",
"The charity funds research into cancer.",
"慈善机构资助癌症研究。",
"The lecture explained how some forms of cancer develop.",
"讲座解释了某些类型的癌症如何发生。",
"https://www.oxfordlearnersdictionaries.com/definition/english/cancer"
],
[
"waist",
"名词 · 腰部",
"指胸廓与髋部之间身体较窄区域，也可指衣服相应部位，可数；与浪费 waste 同音但不同义。",
"The jacket is too tight around the waist.",
"夹克腰部太紧。",
"She tied the apron around her waist before cooking.",
"做饭前她把围裙系在腰间。",
"https://www.oxfordlearnersdictionaries.com/definition/english/waist"
],
[
"immigration",
"名词 · 入境移民",
"表示到另一国家长期生活的过程，通常不可数；机场语境也可指入境检查处，不能只按迁居理解。",
"The report studies immigration to the region over fifty years.",
"报告研究了五十年间迁入该地区的移民情况。",
"We waited at immigration before collecting our luggage.",
"取行李前我们在入境检查处等候。",
"https://www.oxfordlearnersdictionaries.com/definition/english/immigration"
],
[
"paraphrase",
"动词 · 改述",
"表示保留原意而用不同词语表达，直接接话语或文字；不是任意增加结论，也不是逐字引用。",
"Please paraphrase the instructions in your own words.",
"请用自己的话改述说明。",
"We tried to paraphrase the old letter without losing its meaning.",
"我们尝试改述这封旧信而不丢失原意。",
"https://www.oxfordlearnersdictionaries.com/definition/english/paraphrase"
],
[
"audible",
"形容词 · 听得见的",
"表示声音可以被听见，常用 barely audible 表几乎听不见；不等于说话内容必定容易理解。",
"Her voice was barely audible above the rain.",
"雨声中几乎听不见她的声音。",
"The alarm must be audible from the next room.",
"警报必须在隔壁也能听到。",
"https://www.oxfordlearnersdictionaries.com/definition/english/audible"
],
[
"license",
"动词 · 授予许可",
"动词可用 license someone to do 表正式许可；英式名词常写 licence，美式名词也写 license。",
"The agency can license the company to operate the ferry.",
"该机构可以许可公司运营渡轮。",
"The museum agreed to license the image for use in the textbook.",
"博物馆同意授权在教材中使用该图像。",
"https://www.oxfordlearnersdictionaries.com/definition/english/license"
],
[
"crisp",
"形容词 · 酥脆的；脆嫩的",
"描述食物硬脆而通常令人愉快的口感，常见 crisp pastry；与衣物整洁、表达清晰等引申义依名词区分。",
"The pastry stayed crisp after it cooled.",
"酥皮冷却后仍很酥脆。",
"Add the lettuce at the end to keep it crisp.",
"最后再加生菜，保持脆嫩。",
"https://www.oxfordlearnersdictionaries.com/definition/english/crisp"
],
[
"malfunction",
"动词 · 发生故障",
"本条采用不及物动词，表示设备不能正常工作；同形名词一次故障可用 a malfunction。",
"The sensor may malfunction in extreme cold.",
"传感器在严寒中可能失灵。",
"If the lock begins to malfunction, contact the maintenance team.",
"门锁开始出现故障时，请联系维护团队。",
"https://www.oxfordlearnersdictionaries.com/definition/english/malfunction"
],
[
"slot",
"名词 · 狭槽；时段",
"可指用于插入东西的窄口，也可指时间表的一段安排，可数；本条例句分别给出两种常用范围。",
"Insert the ticket into the slot below the screen.",
"把票插入屏幕下方的狭槽。",
"There is one free slot in the afternoon schedule.",
"下午日程里还有一个空闲时段。",
"https://www.oxfordlearnersdictionaries.com/definition/english/slot"
],
[
"trademark",
"名词 · 商标",
"指企业用于区别商品服务的名称或标志，可数；是否受保护需结合具体登记和法律条件，不等于普通装饰图案。",
"The company placed its trademark on each tool.",
"公司在每件工具上标上商标。",
"The label displays a familiar trademark.",
"标签上印着一个熟悉的商标。",
"https://www.oxfordlearnersdictionaries.com/definition/english/trademark"
],
[
"duplicate",
"动词 · 复制",
"表示制作相同副本，或重复工作；动词结尾读音与形容词重复的不同，需按句中词性辨别。",
"Please duplicate the file before editing it.",
"编辑前请复制文件。",
"We do not need to duplicate the survey already done by the school.",
"我们无需重复学校已经做过的调查。",
"https://www.oxfordlearnersdictionaries.com/definition/english/duplicate"
],
[
"sap",
"名词 · 树液",
"本条采用植物体内流动液体的名词义，通常不可数；动词削弱如 sap energy 是另一词性。",
"Sticky sap ran down the damaged bark.",
"黏稠树液沿受损树皮流下。",
"The guide explained how sap moves through a tree.",
"向导解释了树液如何在树内流动。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sap"
],
[
"simultaneous",
"形容词 · 同时的",
"修饰发生时间相同的事件，常见 simultaneous translation；与依次连续发生的 consecutive 不同。",
"The test requires simultaneous measurements at two points.",
"测试要求在两点同时测量。",
"Two simultaneous events forced us to divide the team.",
"两场同时举行的活动迫使我们把团队分开。",
"https://www.oxfordlearnersdictionaries.com/definition/english/simultaneous"
],
[
"evoke",
"动词 · 唤起",
"直接接记忆、感受或意象，常用 evoke memories of；不表示有意发出声响的所有动作。",
"The smell of wood smoke can evoke memories of winter visits.",
"柴烟味能唤起冬日探访的记忆。",
"The painting uses pale colors to evoke a quiet morning.",
"画作使用浅色唤起安静清晨的意象。",
"https://www.oxfordlearnersdictionaries.com/definition/english/evoke"
],
[
"precede",
"动词 · 在……之前",
"是及物动词，直接接后来的事件或人，不能重复加 before；be preceded by 则说明前面是什么。",
"A short introduction will precede the film.",
"影片之前会有一个简短介绍。",
"The guide will precede the group through the narrow doorway.",
"向导将走在队伍前面穿过窄门。",
"https://www.oxfordlearnersdictionaries.com/definition/english/precede"
],
[
"embellish",
"动词 · 装饰；润色",
"可用 embellish something with 表添加装饰，也可指给故事加不一定真实的细节；需看对象判断。",
"She used blue thread to embellish the plain cloth.",
"她用蓝线装饰素布。",
"The narrator likes to embellish each story with unlikely details.",
"叙述者喜欢给每个故事添加不大可信的细节。",
"https://www.oxfordlearnersdictionaries.com/definition/english/embellish"
],
[
"resonance",
"名词 · 共鸣；回响",
"可指声音持续深沉的特性，也可指引起情感呼应，emotional resonance 是常见搭配；物理共振需看专业语境。",
"The wooden hall gives the music a warm resonance.",
"木制大厅让音乐带有温暖的回响。",
"The story has a strong emotional resonance for local readers.",
"这个故事使当地读者产生强烈情感共鸣。",
"https://www.oxfordlearnersdictionaries.com/definition/english/resonance"
],
[
"soluble",
"形容词 · 可溶的",
"常用 soluble in water 表可溶于水，不能只写 soluble 而默认在所有液体里都溶解；可解决问题义另看语境。",
"This powder is soluble in warm water.",
"这种粉末可溶于温水。",
"The experiment separates soluble material from sand.",
"实验把可溶物质与沙子分开。",
"https://www.oxfordlearnersdictionaries.com/definition/english/soluble"
],
[
"financier",
"名词 · 金融家",
"指管理、提供或借贷大额资金的人，可数；并不是所有存有小额银行储蓄的人都叫 financier。",
"A financier helped fund the new railway.",
"一位金融家帮助资助新铁路。",
"The financier asked for a detailed account of the project's costs.",
"金融家要求提供项目成本的详细说明。",
"https://www.oxfordlearnersdictionaries.com/definition/english/financier"
],
[
"flora",
"名词 · 植物群",
"指某地或某时期的植物整体，常用 the flora of；不是单株植物的通称，与 fauna 动物群相对。",
"The island's flora includes several rare orchids.",
"岛上植物群包括几种稀有兰花。",
"The guide describes the flora of the coastal dunes.",
"指南介绍了沿海沙丘的植物群。",
"https://www.oxfordlearnersdictionaries.com/definition/english/flora"
],
[
"colossal",
"形容词 · 巨大的",
"用于强调体积、金额或程度极大，语气强，常见 colossal statue；不用于表达一般略大的差异。",
"A colossal statue once stood above the harbor.",
"港口上方曾矗立一尊巨大雕像。",
"Restoring the building required a colossal amount of work.",
"修复这栋建筑需要极大的工作量。",
"https://www.oxfordlearnersdictionaries.com/definition/english/colossal"
],
[
"topography",
"名词 · 地形",
"指地区地表特征及其位置，通常不可数，topography of 后接地域；与地名拼写研究不是同一范围。",
"The map shows the topography of the valley.",
"地图显示山谷地形。",
"The road design reflects the area's steep topography.",
"道路设计考虑了该地陡峭地形。",
"https://www.oxfordlearnersdictionaries.com/definition/english/topography"
],
[
"specimen",
"名词 · 标本；样本",
"指用于展示或研究的单个实例或少量材料，可数；a specimen of 后接所属类别，不一定是活体。",
"The museum displayed a specimen of volcanic rock.",
"博物馆展出了一块火山岩标本。",
"Each specimen was labeled with its collection date.",
"每份样本都标上了采集日期。",
"https://www.oxfordlearnersdictionaries.com/definition/english/specimen"
],
[
"unearned",
"形容词 · 非劳动所得的",
"常修饰通过利息等获得而不是工作挣来的收入；也可指未赢得的赞赏，不等于收入本身非法。",
"The form asks applicants to list unearned income.",
"表格要求申请者列出非劳动收入。",
"He felt uncomfortable receiving unearned praise for the repair.",
"他因并非自己应得的维修赞誉而不自在。",
"https://www.oxfordlearnersdictionaries.com/definition/english/unearned"
],
[
"sinkhole",
"名词 · 天坑；塌陷坑",
"指地表因地下空隙等形成的下陷洞穴，可数；不把任何人为开挖的坑都叫 sinkhole。",
"A sinkhole opened beside the old road after heavy rain.",
"大雨后旧路旁出现了一个塌陷坑。",
"The geologist mapped the sinkhole before approaching its edge.",
"地质学家靠近边缘前先测绘了塌陷坑。",
"https://dictionary.cambridge.org/dictionary/english/sinkhole"
],
[
"courtship",
"名词 · 求偶",
"动物语境指吸引配偶的特定行为，人际语境也可指婚前追求交往；本条例句限定动物。",
"The bird's courtship display includes a bright fan of feathers.",
"这种鸟的求偶展示包括展开鲜艳尾羽。",
"The documentary records the courtship of two cranes.",
"纪录片记录了两只鹤的求偶过程。",
"https://www.oxfordlearnersdictionaries.com/definition/english/courtship"
],
[
"utterly",
"副词 · 完全地",
"表示程度达到完全，常修饰 surprising、different 等，语气强；一般不直接修饰普通名词。",
"The result was utterly different from our prediction.",
"结果与我们的预测完全不同。",
"She was utterly exhausted after moving the equipment.",
"搬完设备后她筋疲力尽。",
"https://www.oxfordlearnersdictionaries.com/definition/english/utterly"
],
[
"erratic",
"形容词 · 不规则的",
"描述变化无固定规律、难以预测的行为或数值，常见 erratic readings；与单次错误不同。",
"The meter began to give erratic readings.",
"仪表开始给出不稳定读数。",
"An erratic supply of parts delayed the repairs.",
"零件供应不稳定拖延了维修。",
"https://www.oxfordlearnersdictionaries.com/definition/english/erratic"
],
[
"premier",
"形容词 · 首要的",
"本条形容某领域最重要或最有名的对象，常置于名词前；名词总理及首演相关词形须区分。",
"The hall became the region's premier music venue.",
"这座大厅成为该地区首屈一指的音乐场所。",
"The museum is one of the city's premier attractions.",
"博物馆是这座城市最重要的景点之一。",
"https://www.oxfordlearnersdictionaries.com/definition/english/premier"
],
[
"influx",
"名词 · 涌入",
"an influx of 后接大量进入的人、物或资金，常有集中到达意味；不能仅指孤立一个访客。",
"An influx of visitors filled the small town.",
"游客大量涌入，挤满小镇。",
"The project benefited from a sudden influx of donations.",
"项目受益于突然大量涌入的捐款。",
"https://www.oxfordlearnersdictionaries.com/definition/english/influx"
],
[
"vacate",
"动词 · 腾出",
"直接接房屋、座位或职位，表示离开使其可供他人使用；较正式，不等于日常每次短暂走开。",
"Please vacate the room by eleven.",
"请在十一点前腾出房间。",
"The team must vacate the workshop during the inspection.",
"检查期间团队必须腾出工作间。",
"https://www.oxfordlearnersdictionaries.com/definition/english/vacate"
],
[
"inconclusive",
"形容词 · 无定论的",
"描述测试或证据不足以得出确定结果，常见 inconclusive evidence；不等于已证明某说法错误。",
"The first test was inconclusive, so we collected another sample.",
"第一次测试无定论，所以我们又采了一份样本。",
"The report describes the evidence as inconclusive.",
"报告认为证据尚不足以下结论。",
"https://www.oxfordlearnersdictionaries.com/definition/english/inconclusive"
],
[
"artisan",
"名词 · 手艺人",
"指运用专门手工技能制作物品的人，可数；不等同于所有现代工厂流水线岗位。",
"An artisan carved the wooden panels by hand.",
"一位手艺人手工雕刻了木面板。",
"The market gives each artisan space to demonstrate a skill.",
"市场给每位手艺人提供展示技能的空间。",
"https://www.oxfordlearnersdictionaries.com/definition/english/artisan"
],
[
"overemphasize",
"动词 · 过分强调",
"直接接被赋予过大重要性的内容；cannot overemphasize 常反过来强调再重视也不为过，要看否定结构。",
"We should not overemphasize one unusual result.",
"我们不应过分强调一个异常结果。",
"It is easy to overemphasize speed at the expense of accuracy.",
"人们容易过分强调速度而牺牲准确性。",
"https://www.oxfordlearnersdictionaries.com/definition/english/overemphasize"
],
[
"satire",
"名词 · 讽刺作品",
"指用幽默揭示人物或制度问题的表达方式，也可指一部具体作品；与单纯取乐的喜剧不完全相同。",
"The play uses satire to question the council's decisions.",
"戏剧运用讽刺质疑议会的决定。",
"The novel is a satire on the pursuit of fame.",
"这部小说讽刺了对名声的追逐。",
"https://www.oxfordlearnersdictionaries.com/definition/english/satire"
],
[
"superficially",
"副词 · 表面上地",
"可指乍看似乎如此，也可指只研究明显表层，常修饰 similar 或 examined；并不代表深入核实。",
"The two rocks look superficially similar.",
"这两块岩石乍看相似。",
"The issue was only superficially examined in the report.",
"报告仅粗浅地研究了这个问题。",
"https://www.oxfordlearnersdictionaries.com/definition/english/superficially"
],
[
"volatile",
"形容词 · 易变的",
"描述情绪或局面易剧烈变化，也可化学上表示易挥发；本条例句限价格与局势，不把易变直接当作会蒸发。",
"Fuel prices remained volatile during the shortage.",
"短缺期间燃料价格持续波动。",
"The negotiators faced a volatile situation at the port.",
"谈判者面对港口不稳定的局势。",
"https://www.oxfordlearnersdictionaries.com/definition/english/volatile"
],
[
"valid",
"形容词 · 有效的",
"可指证件获正式认可，也可指理由合逻辑；valid until 后接截止时间，并非所有场景都说明法律效力。",
"This ticket is valid until midnight.",
"这张票到午夜前有效。",
"She raised a valid concern about the storage conditions.",
"她对储存条件提出了合理的担忧。",
"https://www.oxfordlearnersdictionaries.com/definition/english/valid"
],
[
"maneuver",
"名词 · 操作动作",
"是美式拼写，英式常写 manoeuvre；指需技巧控制的动作，可数，也可指策略，本条以驾驶等操作为主。",
"The pilot practiced a difficult maneuver in the simulator.",
"飞行员在模拟器里练习了一个高难度动作。",
"Parking in the narrow space required a careful maneuver.",
"把车停进狭窄车位需要小心操作。",
"https://www.oxfordlearnersdictionaries.com/definition/english/maneuver"
],
[
"alienate",
"动词 · 疏远",
"直接接因言行而不再友好或感到不属于群体的人；alienate someone from 可说明疏离的对象。",
"The sudden rule change could alienate long-term members.",
"突然改变规则可能疏远长期会员。",
"We do not want the new design to alienate older visitors.",
"我们不想让新设计使年长访客感到被排斥。",
"https://www.oxfordlearnersdictionaries.com/definition/english/alienate"
],
[
"reciprocity",
"名词 · 互惠",
"指双方相互提供同类帮助或好处的关系，通常不可数；不只是单向赠予且无任何相互性。",
"The agreement is based on reciprocity between the two libraries.",
"协议基于两家图书馆的互惠关系。",
"Reciprocity helped the neighboring farms share tools fairly.",
"互惠机制帮助相邻农场公平共享工具。",
"https://www.oxfordlearnersdictionaries.com/definition/english/reciprocity"
],
[
"mobilize",
"动词 · 动员",
"可及物组织人员或资源，也可不及物表示集结行动；mobilize support 表争取动员支持，不只指军事行动。",
"The group hopes to mobilize volunteers for the cleanup.",
"该团体希望动员志愿者参加清理。",
"The council will mobilize extra equipment before the storm.",
"议会将在风暴前调集额外设备。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mobilize"
],
[
"mite",
"名词 · 螨",
"本义指体形极小的蛛形动物，可数；a mite 的少许引申义另看语境，不是所有小昆虫的通称。",
"A mite was visible under the microscope.",
"显微镜下能看见一只螨。",
"The researcher identified a mite on the leaf sample.",
"研究人员在叶片样本上鉴别出一只螨。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mite"
],
[
"vine",
"名词 · 藤本植物",
"可泛指有长细茎的攀缘植物，也常特指葡萄藤，可数；不一定每种 vine 都结葡萄。",
"A vine climbed the sunny wall beside the door.",
"一株藤本植物攀上门旁向阳的墙。",
"The vine needs a stronger support as it grows.",
"藤蔓越长越大，需要更结实的支架。",
"https://www.oxfordlearnersdictionaries.com/definition/english/vine"
],
[
"delineate",
"动词 · 详细描绘",
"语体正式，可用于清楚说明范围或描绘轮廓，直接接对象；强调把细节或边界交代清楚。",
"The map will delineate the boundaries of the protected area.",
"地图将标明保护区边界。",
"The opening chapter aims to delineate the main problem.",
"第一章旨在详细说明主要问题。",
"https://www.oxfordlearnersdictionaries.com/definition/english/delineate"
],
[
"alteration",
"名词 · 改动",
"指使某物不同的一项变化或改动过程，常用 alteration to；可以是局部修改，不必完全重做。",
"The plan needs one small alteration before approval.",
"计划批准前需要一项小改动。",
"No alteration to the doorway is allowed without permission.",
"未经许可不得改动门口。",
"https://www.oxfordlearnersdictionaries.com/definition/english/alteration"
],
[
"pension",
"名词 · 养老金",
"指退休等后按期领取的款项，可数；不是任意临时补助，也不说明每个人领取条件和金额相同。",
"She receives a small pension from her former employer.",
"她从前雇主那里领取一笔不多的养老金。",
"The leaflet explains how the pension is calculated.",
"传单解释养老金如何计算。",
"https://dictionary.cambridge.org/dictionary/english/pension"
],
[
"revolve",
"动词 · 旋转；绕行",
"可指绕中心运动，revolve around 后接中心；抽象 revolve around 也可表示以某主题为中心。",
"The model shows how planets revolve around the Sun.",
"模型展示行星如何绕太阳运行。",
"The display will revolve slowly so visitors can see every side.",
"展品将缓慢旋转，让访客看到各侧。",
"https://www.oxfordlearnersdictionaries.com/definition/english/revolve"
],
[
"salinity",
"名词 · 盐度",
"指液体或土壤中的含盐程度，通常不可数；the salinity of 后接对象，不等于仅凭味道判断盐含量。",
"The instrument measures the salinity of the water.",
"仪器测量水的盐度。",
"Heavy rain lowered the salinity near the river mouth.",
"大雨降低了河口附近的盐度。",
"https://www.oxfordlearnersdictionaries.com/definition/english/salinity"
],
[
"clog",
"动词 · 堵塞",
"可及物说明什么堵住通道，也可不及物表示堵住，be clogged with 后接堵塞物；不一定完全密封。",
"Leaves can clog the drains beside the path.",
"树叶会堵塞小路旁的排水沟。",
"The filter may clog if it is not cleaned regularly.",
"如果不定期清洁，滤芯可能堵塞。",
"https://www.oxfordlearnersdictionaries.com/definition/english/clog"
],
[
"elaboration",
"名词 · 详细说明",
"可指对观点增加细节的说明，常用 elaboration of 或 on；不等于仅重复原句而无进一步内容。",
"The proposal needs further elaboration before we can assess it.",
"提案需要进一步详细说明，我们才能评估。",
"Her elaboration of the idea answered several questions.",
"她对想法的详细说明回答了几个问题。",
"https://www.oxfordlearnersdictionaries.com/definition/english/elaboration"
],
[
"subsequently",
"副词 · 随后",
"语体偏书面，说明在前面事件之后发生，常用于叙述时间顺序；先后关系本身不表示因果关系。",
"The building was sold and subsequently converted into flats.",
"建筑被卖出，随后改成了公寓。",
"The sample was subsequently tested in another laboratory.",
"样本随后在另一个实验室接受测试。",
"https://www.oxfordlearnersdictionaries.com/definition/english/subsequently"
],
[
"infringe",
"动词 · 侵犯；违反",
"可直接接法律规则表示违反，infringe on someone's rights 表侵犯权利；不是普通不同意某人观点。",
"The design must not infringe another artist's copyright.",
"设计不得侵犯另一位艺术家的著作权。",
"The new rules should not infringe on residents' privacy.",
"新规则不应侵犯居民隐私。",
"https://www.oxfordlearnersdictionaries.com/definition/english/infringe"
],
[
"conjunction",
"名词 · 连词",
"语法中指连接词、短语或分句的词，可数；in conjunction with 表与……共同，是另一固定搭配。",
"The conjunction links two clauses in the sentence.",
"连词连接了句子中的两个分句。",
"Choose a conjunction that shows the reason for the change.",
"选一个表示变化原因的连词。",
"https://www.oxfordlearnersdictionaries.com/definition/english/conjunction"
],
[
"democrat",
"名词 · 民主主义者",
"小写 democrat 可指支持民主的人；大写 Democrat 在美国政治语境常指民主党成员，不能混为一谈。",
"A committed democrat, she argued for a fair election.",
"作为坚定的民主主义者，她主张公平选举。",
"The historian described him as a democrat rather than a supporter of monarchy.",
"历史学家称他为民主主义者，而非君主制支持者。",
"https://www.oxfordlearnersdictionaries.com/definition/english/democrat"
],
[
"speck",
"名词 · 小点",
"指极小的污点或颗粒，可数，a speck of 后接灰尘等；不表示已经测定的固定重量单位。",
"A speck of dust lay on the lens.",
"镜头上有一粒灰尘。",
"There was a tiny speck of blue paint on his sleeve.",
"他袖子上有一点蓝油漆。",
"https://www.oxfordlearnersdictionaries.com/definition/english/speck"
],
[
"horn",
"名词 · 角",
"本条指牛羊等头上的坚硬突出部，可数；汽车喇叭和乐器同形义需按名词搭配区分。",
"The goat scratched its horn against the fence.",
"山羊用角蹭围栏。",
"One horn on the model had broken off.",
"模型上的一只角断了。",
"https://www.oxfordlearnersdictionaries.com/definition/english/horn"
],
[
"substantiate",
"动词 · 证实",
"表示提供事实或证据支持说法，直接接 claim 等对象；与仅重复个人立场不同，常用于正式论证。",
"We need records to substantiate the claim.",
"我们需要记录来证实这个说法。",
"The report could not substantiate the allegation.",
"报告无法证实这项指控。",
"https://www.oxfordlearnersdictionaries.com/definition/english/substantiate"
],
[
"prone",
"形容词 · 易于……的",
"通常用 prone to 加名词或动名词，多描述不利倾向；也有俯卧义，本条例句限定易发生某事。",
"The lower field is prone to flooding.",
"低处那块田容易被淹。",
"This material is prone to cracking in cold weather.",
"这种材料在寒冷天气容易开裂。",
"https://www.oxfordlearnersdictionaries.com/definition/english/prone"
],
[
"secular",
"形容词 · 世俗的",
"表示与宗教或宗教事务无关，常见 secular education；不表示反宗教，也不自动说明某人没有信仰。",
"The choir performs both sacred and secular music.",
"合唱团既演唱宗教音乐，也演唱世俗音乐。",
"The school follows a secular curriculum.",
"学校采用非宗教课程体系。",
"https://www.oxfordlearnersdictionaries.com/definition/english/secular"
],
[
"endorse",
"动词 · 公开支持",
"直接接人、计划或声明，表示公开认可；产品代言和票据背书是特定语境中的其他用法。",
"The committee may endorse the revised proposal.",
"委员会可能公开支持修订后的提案。",
"Several local groups agreed to endorse the campaign.",
"几个本地团体同意公开支持这项活动。",
"https://www.oxfordlearnersdictionaries.com/definition/english/endorse"
],
[
"decomposition",
"名词 · 分解",
"指有机物腐败或物质分成较简单成分的过程，通常不可数；不等于单纯切割成更小但成分不变的块。",
"Warm conditions can speed up decomposition in the compost bin.",
"温暖条件会加快堆肥箱中的分解。",
"The experiment measured the gases released during decomposition.",
"实验测量了分解过程中释放的气体。",
"https://www.oxfordlearnersdictionaries.com/definition/english/decomposition"
],
[
"impetus",
"名词 · 推动力",
"give impetus to 表推动某过程发展，通常不可数或用 an impetus；不是任何一项背景条件都起促进作用。",
"The grant gave new impetus to the restoration project.",
"资助为修复项目带来了新的推动力。",
"A successful trial provided the impetus for wider testing.",
"一次成功试验为更广泛测试提供了动力。",
"https://www.oxfordlearnersdictionaries.com/definition/english/impetus"
],
[
"designation",
"名词 · 指定；称号",
"可指给予某地或某人特定地位的行为，也可指名称，designation as 引出所获身份或资格。",
"The site's designation as a reserve limits new building.",
"该地被指定为保护区，限制了新建工程。",
"The form asks for the official designation of the position.",
"表格要求填写职位的正式名称。",
"https://www.oxfordlearnersdictionaries.com/definition/english/designation"
],
[
"phony",
"形容词 · 假的",
"是非正式美式拼写，英式也常写 phoney；指以假乱真、意图欺骗的事物，不等于普通艺术虚构。",
"The message offered a phony prize.",
"这条消息提供了一个虚假奖项。",
"A phony signature appeared on the application.",
"申请书上出现了伪造签名。",
"https://www.oxfordlearnersdictionaries.com/definition/english/phony"
],
[
"provision",
"名词 · 提供",
"provision of services 表提供服务，通常不可数；provisions 还可指条款或给养，要看所修饰对象。",
"The plan improves the provision of evening transport.",
"计划改善晚间交通服务供给。",
"The budget includes provision for emergency repairs.",
"预算为紧急维修作了安排。",
"https://www.oxfordlearnersdictionaries.com/definition/english/provision"
],
[
"chronological",
"形容词 · 按时间顺序的",
"常见 in chronological order，指按事件发生先后排列；不是按重要程度或人物姓氏排序。",
"Arrange the letters in chronological order.",
"把信件按时间先后排列。",
"The display gives a chronological account of the bridge's construction.",
"展览按时间顺序叙述大桥建造过程。",
"https://www.oxfordlearnersdictionaries.com/definition/english/chronological"
],
[
"octopus",
"名词 · 章鱼",
"指有柔软身体和八条腕足的海洋动物，可数；不同于乌贼 squid，不能仅因都有触腕就混同。",
"An octopus hid beneath a flat rock.",
"一只章鱼藏在扁平岩石下。",
"The camera recorded an octopus opening a shell.",
"相机拍到一只章鱼打开贝壳。",
"https://www.oxfordlearnersdictionaries.com/definition/english/octopus"
],
[
"cling",
"动词 · 紧抓",
"通常用 cling to 或 onto 后接抓住对象，过去式和过去分词 clung；不直接写 cling something。",
"The child began to cling to the railing.",
"孩子开始紧抓栏杆。",
"Wet leaves cling to the soles of our boots.",
"湿树叶粘在我们的靴底上。",
"https://www.oxfordlearnersdictionaries.com/definition/english/cling"
],
[
"tilt",
"动词 · 倾斜",
"可及物使一端高于另一端，也可不及物说明倾斜，tilt forward 表向前倾；不一定会完全倒下。",
"Tilt the tray slightly to drain the water.",
"稍稍倾斜托盘把水排掉。",
"The frame began to tilt when the support came loose.",
"支撑松开后，框架开始倾斜。",
"https://www.oxfordlearnersdictionaries.com/definition/english/tilt"
],
[
"advent",
"名词 · 到来",
"the advent of 常用于重要发明或变化的出现；大写 Advent 则是基督教将临期，时间范围不同。",
"The advent of cheap printing changed how books were shared.",
"廉价印刷的出现改变了书籍传播方式。",
"The display explores village life before the advent of electricity.",
"展览探讨了电力出现前的乡村生活。",
"https://www.oxfordlearnersdictionaries.com/definition/english/advent"
],
[
"helium",
"名词 · 氦",
"化学元素名称，符号 He，通常不可数；是气体名称而非所有用来充气的混合物通称。",
"The experiment compares helium with ordinary air.",
"实验比较氦气与普通空气。",
"The balloon was filled with helium for the demonstration.",
"演示用气球充入了氦气。",
"https://www.oxfordlearnersdictionaries.com/definition/english/helium"
],
[
"indefinite",
"形容词 · 不确定的；无限期的",
"可形容没有固定终点的时间，常见 indefinite period；不说明事情必然永不结束。",
"The trail is closed for an indefinite period.",
"小路无限期关闭。",
"The date of the next meeting remains indefinite.",
"下次会议日期仍未确定。",
"https://www.oxfordlearnersdictionaries.com/definition/english/indefinite"
],
[
"indigestion",
"名词 · 消化不良",
"通常不可数，指进食后消化困难带来的不适；不能仅凭胸腹不适就断定具体病因。",
"The questionnaire asks whether participants have experienced indigestion.",
"问卷询问参与者是否有过消化不良。",
"The doctor asked when the indigestion usually occurred.",
"医生询问消化不良通常何时发生。",
"https://www.oxfordlearnersdictionaries.com/definition/english/indigestion"
],
[
"metallic",
"形容词 · 金属的",
"可表示由金属构成，也可形容像金属的声色味，常见 metallic sound；不保证对象真正由金属制成。",
"A metallic sound came from the loose bracket.",
"松动支架发出金属般的声响。",
"She chose a paint with a metallic finish.",
"她选了一种具有金属光泽的油漆。",
"https://www.oxfordlearnersdictionaries.com/definition/english/metallic"
],
[
"sophisticate",
"名词 · 见多识广的人",
"本条是名词，指有文化见识并熟悉社交的人，可数；常见形容词 sophisticated 不可直接当作同一词形。",
"The novel contrasts a city sophisticate with a curious village teacher.",
"小说对比了一位见多识广的都市人和一位好奇的乡村教师。",
"He tries to appear a sophisticate, but the unfamiliar menu confuses him.",
"他想显得见多识广，却被陌生菜单弄糊涂了。",
"https://dictionary.cambridge.org/dictionary/english/sophisticate"
],
[
"stem",
"名词 · 茎",
"指植物地上支撑叶花的主轴或其分枝，可数；词干、酒杯脚等义需按所修饰对象区分。",
"Cut the stem at an angle before placing the flower in water.",
"把花放水中前，斜着剪切花茎。",
"The plant has a thick stem and small leaves.",
"这种植物有粗茎和小叶。",
"https://www.oxfordlearnersdictionaries.com/definition/english/stem"
],
[
"detrimental",
"形容词 · 有害的",
"常用 detrimental to 引出受损对象，语体较正式；表示负面影响，不必然是即时可见伤害。",
"Too much salt can be detrimental to these plants.",
"盐分过多会对这些植物有害。",
"The delay was detrimental to the small business.",
"延误损害了这家小企业。",
"https://www.oxfordlearnersdictionaries.com/definition/english/detrimental"
],
[
"resonate",
"动词 · 共鸣",
"字面可指声音深沉持续地回响，resonate with 也可表引起情感认同；两种范围需结合主语区分。",
"The low notes resonate through the wooden hall.",
"低音在木制大厅里回响。",
"The story may resonate with readers who have moved far from home.",
"这个故事可能让远离故乡的读者产生共鸣。",
"https://www.oxfordlearnersdictionaries.com/definition/english/resonate"
],
[
"insulate",
"动词 · 隔热；使绝缘",
"insulate something with 表用材料隔离，insulate from 或 against 表防止热、声等影响；不能只按保暖一种用途理解。",
"We need to insulate the pipes before winter.",
"冬天前我们需要给管道保温。",
"The thick walls help insulate the room from street noise.",
"厚墙有助于隔绝街道噪声。",
"https://www.oxfordlearnersdictionaries.com/definition/english/insulate"
],
[
"cellular",
"形容词 · 细胞的",
"生物语境表示与细胞有关，常见 cellular structure；电信中蜂窝通信的义项不用于生物细胞。",
"The microscope revealed the leaf's cellular structure.",
"显微镜显示了叶片的细胞结构。",
"The lesson examines cellular processes involved in growth.",
"课程研究与生长有关的细胞过程。",
"https://www.oxfordlearnersdictionaries.com/definition/english/cellular"
],
[
"scrap",
"名词 · 碎片",
"指纸、布等的小片残余，可数，a scrap of 后接材料；scrap metal 通常泛指废金属，不按小片数。",
"She wrote the number on a scrap of paper.",
"她把号码写在一张小纸片上。",
"A scrap of blue cloth was caught on the nail.",
"一小块蓝布挂在钉子上。",
"https://www.oxfordlearnersdictionaries.com/definition/english/scrap"
],
[
"nomadic",
"形容词 · 游牧的",
"可指群体随牲畜迁移的生活方式，也可形容频繁迁居，常见 nomadic life；不等于一般度假旅行。",
"The exhibition describes a nomadic community's seasonal routes.",
"展览描绘了一个游牧社群的季节路线。",
"Years of temporary work led him to a nomadic life.",
"多年临时工作使他过上了漂泊生活。",
"https://www.oxfordlearnersdictionaries.com/definition/english/nomadic"
],
[
"waterfowl",
"名词 · 水鸟",
"通常指能游泳并在水边生活的鸟类，单复数常同形；不只限于一种鸭子，具体物种需另加名称。",
"A waterfowl rested among the reeds.",
"一只水鸟在芦苇间歇息。",
"The reserve protects waterfowl during the nesting season.",
"保护区在筑巢季保护水鸟。",
"https://www.oxfordlearnersdictionaries.com/definition/english/waterfowl"
],
[
"anecdotal",
"形容词 · 轶事性的",
"常见 anecdotal evidence，指基于个人经历叙述而非系统研究；不必然为假，但不足以单独证明普遍规律。",
"The report separates anecdotal evidence from measured data.",
"报告把个人经历证据与测量数据分开。",
"We collected anecdotal accounts before planning a larger survey.",
"我们在规划更大调查前收集了个人经历叙述。",
"https://www.oxfordlearnersdictionaries.com/definition/english/anecdotal"
],
[
"mirage",
"名词 · 海市蜃楼",
"指光线在温度差等条件下产生的错觉影像，可数；不是指真实存在但只被雾遮住的物体。",
"The driver mistook a mirage for water on the road.",
"司机把蜃景误看成路上的水。",
"A mirage made the distant shore appear higher.",
"蜃景使远处海岸显得更高。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mirage"
],
[
"tile",
"名词 · 瓷砖；瓦片",
"指覆盖墙地面或屋顶的薄平材料，可数；具体材料可为陶土等，不能把所有 tile 都限为同一种瓷。",
"One tile near the sink had come loose.",
"水槽旁的一块瓷砖松了。",
"The roof needs a replacement tile above the doorway.",
"门口上方的屋顶需要换一块瓦。",
"https://www.oxfordlearnersdictionaries.com/definition/english/tile"
],
[
"flicker",
"动词 · 闪烁",
"描述光火等忽亮忽暗，也可指表情短暂显现，常见 flicker across；与稳定柔光的 glow 有别。",
"The candle began to flicker as the door opened.",
"门打开时蜡烛开始摇曳。",
"A brief smile seemed to flicker across her face.",
"她脸上似乎掠过一丝短暂笑意。",
"https://www.oxfordlearnersdictionaries.com/definition/english/flicker"
],
[
"repress",
"动词 · 压抑",
"可指努力不显露某种情绪，直接接 feeling 等，也可指以强制手段压制群体；本条例句限情绪。",
"He tried to repress a smile during the serious speech.",
"严肃演讲中他努力忍住笑。",
"She could not repress her excitement when the package arrived.",
"包裹到达时，她抑制不住兴奋。",
"https://www.oxfordlearnersdictionaries.com/definition/english/repress"
],
[
"garment",
"名词 · 衣服",
"指一件衣物，是可数名词，语体比 everyday clothes 正式；不能像复数 clothes 那样无须单件限定。",
"Each garment carries a label with washing instructions.",
"每件衣物都带有洗涤说明标签。",
"The museum displayed a ceremonial garment from the region.",
"博物馆展出了一件该地区的礼服。",
"https://www.oxfordlearnersdictionaries.com/definition/english/garment"
],
[
"vent",
"名词 · 通风口",
"指让空气、气体或液体进出的开口，可数；动词 vent anger 为发泄情绪，不是物理通风。",
"Dust had blocked the vent behind the cabinet.",
"灰尘堵住了柜子后面的通风口。",
"Keep the air vent clear when moving the desk.",
"移动书桌时不要挡住通风口。",
"https://www.oxfordlearnersdictionaries.com/definition/english/vent"
],
[
"saturate",
"动词 · 浸透",
"表示使液体完全浸满物体，直接接对象；也可比喻市场充斥某产品，不只是稍微打湿。",
"The heavy rain may saturate the soil.",
"大雨可能把土壤浸透。",
"Saturate the sponge before wiping the surface.",
"擦拭表面前先把海绵浸透。",
"https://www.oxfordlearnersdictionaries.com/definition/english/saturate"
],
[
"moist",
"形容词 · 湿润的",
"表示略带水分、未完全干燥，常见 moist soil；不同于 soaked 的完全湿透，也不表示水成片流动。",
"Keep the compost moist but not waterlogged.",
"让堆肥保持湿润，但不要积水。",
"The cake stayed moist inside the sealed tin.",
"蛋糕放在密封罐里仍保持润软。",
"https://www.oxfordlearnersdictionaries.com/definition/english/moist"
],
[
"autobiography",
"名词 · 自传",
"指作者自己写的生平叙述，可数；biography 则可由别人撰写，二者叙述主体关系不同。",
"Her autobiography includes a chapter about village school life.",
"她的自传包括一章乡村学校生活。",
"The club chose an autobiography for its next reading session.",
"读书会选了一部自传作为下次阅读内容。",
"https://www.oxfordlearnersdictionaries.com/definition/english/autobiography"
],
[
"rivalry",
"名词 · 竞争关系",
"常用 rivalry between 表两方竞争，也可用 rivalry with；不必然意味着敌视或不正当竞争。",
"A friendly rivalry developed between the two gardening clubs.",
"两个园艺俱乐部之间形成了友好竞争。",
"The story explores a long rivalry between neighboring families.",
"故事探讨相邻家庭之间的长期竞争。",
"https://www.oxfordlearnersdictionaries.com/definition/english/rivalry"
],
[
"grind",
"动词 · 磨碎",
"可指用硬表面或机器压磨成小颗粒，grind into 后接产物；过去式和过去分词 ground。",
"Grind the seeds into a fine powder.",
"把种子磨成细粉。",
"The mill can grind several kinds of grain.",
"这座磨坊可以磨多种谷物。",
"https://www.oxfordlearnersdictionaries.com/definition/english/grind"
],
[
"assemblage",
"名词 · 集合",
"语体正式，指聚集的一组人或物，可数；艺术中也可指拼合不同材料的作品，需依修饰语判断。",
"The display contains an unusual assemblage of everyday tools.",
"展区汇集了一组不寻常的日常工具。",
"An assemblage of local musicians performed in the square.",
"一群本地音乐家在广场演奏。",
"https://www.oxfordlearnersdictionaries.com/definition/english/assemblage"
],
[
"auxiliary",
"形容词 · 辅助的",
"表示支持主要人员或设备的角色，常见 auxiliary equipment；不等于完全独立于主系统的另一套用途。",
"An auxiliary pump provides water if the main one fails.",
"主泵失灵时，辅助泵提供水。",
"The hospital called in auxiliary staff during the renovation.",
"医院在翻修期间调来了辅助人员。",
"https://www.oxfordlearnersdictionaries.com/definition/english/auxiliary"
],
[
"furious",
"形容词 · 愤怒的",
"表示非常生气，常用 furious with someone 或 about something；也可形容动作猛烈快速，需按对象判断。",
"She was furious about the damage to the borrowed camera.",
"借来的相机受损使她大发雷霆。",
"The owner became furious when he saw the broken gate.",
"主人看见损坏的大门后非常愤怒。",
"https://www.oxfordlearnersdictionaries.com/definition/english/furious"
],
[
"antecedent",
"名词 · 前因；先行事物",
"指先于另一事物并可能影响它的事物，可数；语法中的先行词是特定用法，不能把所有前因都当代词指代对象。",
"The historian identified an antecedent of the modern council.",
"历史学家指出现代议会的一个前身。",
"The essay traces the antecedent of this educational idea.",
"文章追溯了这一教育理念的先行来源。",
"https://www.oxfordlearnersdictionaries.com/definition/english/antecedent"
],
[
"rigidity",
"名词 · 僵化；刚性",
"可指规则思想难改变，也可指材料不易弯曲，通常不可数；本条例句分别给出组织与物理范围。",
"The rigidity of the rules left little room for individual needs.",
"规则的僵化使个人需求几乎没有调整空间。",
"The frame's rigidity helps protect the delicate glass.",
"框架的刚性有助于保护脆弱玻璃。",
"https://dictionary.cambridge.org/dictionary/english/rigidity"
],
[
"fledge",
"动词 · 长羽学飞",
"多用于幼鸟开始长齐羽毛并准备飞行，是不及物动词；fledgling 是幼鸟名词，不应混用词性。",
"The young birds usually fledge before the end of June.",
"幼鸟通常在六月底前长羽学飞。",
"We watched from a distance as the chicks began to fledge.",
"雏鸟开始长羽学飞时，我们在远处观察。",
"https://dictionary.cambridge.org/dictionary/english/fledge"
],
[
"apprentice",
"名词 · 学徒",
"指在雇主或师傅指导下工作学习特定技能的人，可数；不是所有偶尔参加课程的初学者都称为学徒。",
"The apprentice learned to sharpen the carving tools.",
"学徒学习了如何磨快雕刻工具。",
"An apprentice helped the carpenter fit the new shelves.",
"一名学徒帮助木匠安装新架子。",
"https://www.oxfordlearnersdictionaries.com/definition/english/apprentice"
],
[
"authenticity",
"名词 · 真实性",
"表示物品或说法是否确为声称的来源或状态，通常不可数；authenticity of 后接被核验对象。",
"The expert checked the authenticity of the signature.",
"专家核验了签名的真实性。",
"The museum could not confirm the letter's authenticity.",
"博物馆无法确认这封信的真实性。",
"https://www.oxfordlearnersdictionaries.com/definition/english/authenticity"
],
[
"unsuspecting",
"形容词 · 毫无戒心的",
"指没有察觉危险或异常的人，常置于名词前；不等于人缺乏任何一般判断能力。",
"An unsuspecting visitor nearly walked into the wet paint.",
"一位毫无察觉的访客差点碰上湿油漆。",
"The scam targeted unsuspecting buyers online.",
"骗局针对网上毫无戒心的买家。",
"https://www.oxfordlearnersdictionaries.com/definition/english/unsuspecting"
],
[
"dynamic",
"形容词 · 有活力的",
"可形容人精力充沛，也可形容系统不断变化发展，常见 dynamic environment；与静态的 static 相对时须看专业范围。",
"A dynamic teacher transformed the quiet discussion.",
"一位有活力的教师改变了沉闷的讨论。",
"The coastline is a dynamic environment shaped by wind and water.",
"海岸线是由风和水不断塑造的动态环境。",
"https://www.oxfordlearnersdictionaries.com/definition/english/dynamic"
],
[
"ribbon",
"名词 · 丝带",
"指用于装饰或捆扎的窄条织物，可数或泛指材料，a length of ribbon 表一段丝带。",
"She tied a blue ribbon around the parcel.",
"她在包裹上系了一条蓝丝带。",
"A length of ribbon marked the page in the old book.",
"旧书中用一段丝带标着页码。",
"https://www.oxfordlearnersdictionaries.com/definition/english/ribbon"
],
[
"shimmer",
"动词 · 微微闪光",
"表示柔和光线似乎轻微移动或颤动，常用 shimmer in；不同于强烈直接照射的 shine 的所有范围。",
"The lake began to shimmer in the morning sun.",
"湖面开始在晨光中闪烁。",
"Silver threads shimmer as the costume moves.",
"服装移动时，银线微微闪光。",
"https://www.oxfordlearnersdictionaries.com/definition/english/shimmer"
],
[
"mania",
"名词 · 狂热",
"日常可指对某事异常强烈的热衷，常用 mania for；医学躁狂发作是不同范围，不能仅凭爱好浓厚作诊断。",
"A mania for collecting postcards swept through the club.",
"俱乐部里掀起了收集明信片的狂热。",
"The essay describes the city's brief mania for novelty clocks.",
"文章描述了该市一时对新奇钟表的狂热。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mania"
],
[
"distill",
"动词 · 蒸馏",
"是美式常用拼写，英式常写 distil；表示加热汽化再冷凝收集，可及物接液体，不等于简单过滤。",
"The students learned how to distill water in the laboratory.",
"学生们学会了如何在实验室蒸馏水。",
"The apparatus can distill a small sample at a time.",
"这套仪器每次可蒸馏一小份样本。",
"https://dictionary.cambridge.org/dictionary/english/distill"
],
[
"telltale",
"形容词 · 泄露内情的",
"通常置于名词前，形容能显示某事已发生或存在的迹象，常见 telltale sign；不只是随意讲故事。",
"A telltale stain revealed where the pipe had leaked.",
"一块明显水渍暴露了管道漏水的位置。",
"The mechanic noticed a telltale vibration in the wheel.",
"机修工注意到车轮有一种能说明问题的振动。",
"https://www.oxfordlearnersdictionaries.com/definition/english/telltale"
],
[
"mandarin",
"名词 · 普通话",
"本条采用语言名 Mandarin，首字母大写；官员和橘子的同形名词义须依上下文区别。",
"The museum offers an audio guide in Mandarin.",
"博物馆提供普通话语音导览。",
"She practices Mandarin with her classmates after school.",
"她放学后和同学练习普通话。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mandarin"
],
[
"radioactive",
"形容词 · 放射性的",
"表示物质能自发发出射线，常见 radioactive material；实际风险取决于种类剂量等，不由形容词单独说明。",
"The container was labeled as holding radioactive material.",
"容器标有内含放射性材料的标签。",
"The lesson explains how radioactive atoms change over time.",
"课程解释放射性原子如何随时间变化。",
"https://www.oxfordlearnersdictionaries.com/definition/english/radioactive"
],
[
"wagon",
"名词 · 货车；四轮马车",
"英式铁路语境常指运货车厢，也可指马或牛拉的四轮车；本条例句分别展示两种运输义。",
"A freight wagon stood beside the loading platform.",
"一节货车厢停在装货站台旁。",
"The farmer loaded hay onto a wooden wagon.",
"农民把干草装上木制四轮马车。",
"https://www.oxfordlearnersdictionaries.com/definition/english/wagon"
],
[
"respiration",
"名词 · 呼吸",
"可指吸气呼气，也可指细胞分解物质获取能量的呼吸作用；两者相关但不是完全同一过程。",
"The nurse recorded the patient's rate of respiration.",
"护士记录了病人的呼吸频率。",
"The lesson explains how cellular respiration releases energy.",
"课程解释细胞呼吸如何释放能量。",
"https://www.oxfordlearnersdictionaries.com/definition/english/respiration"
],
[
"disproportionate",
"形容词 · 不成比例的",
"常用 disproportionate to 表相对于某条件过大或过小；强调关系失衡，不只是绝对数量很大。",
"The penalty seemed disproportionate to the mistake.",
"惩罚相对于错误显得过重。",
"One section takes a disproportionate amount of the available space.",
"一部分占据了不成比例的可用空间。",
"https://www.oxfordlearnersdictionaries.com/definition/english/disproportionate"
],
[
"carrier",
"名词 · 承运商",
"指运输货物或旅客的公司，可数，常见 air carrier；疾病携带者等其他义项需另按领域理解。",
"The carrier confirmed the parcel's arrival at the depot.",
"承运商确认包裹已到达仓库。",
"We chose a carrier that serves remote villages.",
"我们选择了一家为偏远村庄提供服务的承运商。",
"https://www.oxfordlearnersdictionaries.com/definition/english/carrier"
],
[
"puff",
"动词 · 冒烟；喷气",
"本条采用发出烟气的动词义，可用 puff out；另有喘气和吸烟义，不能见到 puff 就判断有人吸烟。",
"The old engine began to puff out steam.",
"旧发动机开始喷出蒸汽。",
"We watched the locomotive puff as it climbed the hill.",
"我们看着机车爬坡时喷着烟气。",
"https://www.oxfordlearnersdictionaries.com/definition/english/puff"
],
[
"rigor",
"名词 · 严谨",
"是美式拼写，英式常写 rigour；研究语境强调细致周全和高标准，scientific rigor 是常见搭配。",
"The review praised the rigor of the analysis.",
"评审赞扬了分析的严谨性。",
"Scientific rigor requires us to report the failed trials as well.",
"科学严谨性要求我们也报告失败试验。",
"https://dictionary.cambridge.org/dictionary/english/rigor"
],
[
"ornament",
"名词 · 装饰品",
"指主要用作装饰的物品，可数；ornament on 后可说明所在表面，普通工具不因摆着好看就自动转义。",
"A small glass ornament stood on the mantelpiece.",
"壁炉台上放着一件小玻璃装饰品。",
"The child made a paper ornament for the window.",
"孩子为窗户做了一个纸装饰品。",
"https://www.oxfordlearnersdictionaries.com/definition/english/ornament"
],
[
"fragment",
"名词 · 碎片",
"指从较大整体破下或留下的小部分，可数，a fragment of 后接材料或内容；可用于实物也可用于文字。",
"A fragment of pottery lay beside the wall.",
"墙旁有一块陶器碎片。",
"Only a fragment of the original letter survives.",
"原信只保存下一小部分。",
"https://www.oxfordlearnersdictionaries.com/definition/english/fragment"
],
[
"dictator",
"名词 · 独裁者",
"指掌握国家完全权力、常以强制维持统治的领导人，可数；不宜把所有严格管理员都按政治义理解。",
"The documentary traces the rise of a dictator.",
"纪录片追溯了一位独裁者的崛起。",
"The novel describes life under a military dictator.",
"小说描写军事独裁者统治下的生活。",
"https://www.oxfordlearnersdictionaries.com/definition/english/dictator"
],
[
"gravel",
"名词 · 碎石",
"指用来铺路等的小石子集合，通常不可数；a piece of gravel 表一颗，不用 a gravel 泛指一条石子路。",
"Gravel crunched beneath our boots.",
"碎石在我们的靴子下沙沙作响。",
"They spread fresh gravel along the garden path.",
"他们沿花园小路铺了新碎石。",
"https://www.oxfordlearnersdictionaries.com/definition/english/gravel"
],
[
"dispersion",
"名词 · 散布",
"指人或物分散到较广区域的过程，通常不可数，dispersion of 后说明对象；光学色散是专业义项。",
"The study tracks the dispersion of seeds by wind.",
"研究追踪种子借风散播的过程。",
"The map shows the dispersion of settlements across the valley.",
"地图显示了定居点在山谷中的分散分布。",
"https://www.oxfordlearnersdictionaries.com/definition/english/dispersion"
],
[
"nucleus",
"名词 · 核",
"可指原子核，也可指细胞核，可数，复数 nuclei；要根据 atom 或 cell 等上下文判断尺度和结构。",
"The diagram shows the nucleus of a plant cell.",
"示意图显示一个植物细胞的细胞核。",
"Protons are found in the nucleus of an atom.",
"质子位于原子核中。",
"https://www.oxfordlearnersdictionaries.com/definition/english/nucleus"
],
[
"sodium",
"名词 · 钠",
"是化学元素名称，符号 Na，通常不可数；不能把钠元素与所有含钠化合物当作同一物质。",
"The label lists the amount of sodium per serving.",
"标签列出每份中的钠含量。",
"The lesson compares sodium with other metals.",
"这堂课把钠与其他金属作比较。",
"https://www.oxfordlearnersdictionaries.com/definition/english/sodium"
],
[
"backdrop",
"名词 · 背景",
"可指场景后可见的景物，也可指事件发生的社会环境，against a backdrop of 是常见搭配。",
"The mountains formed a dramatic backdrop to the performance.",
"群山为演出形成了壮观背景。",
"The story unfolds against a backdrop of rapid industrial change.",
"故事在工业快速变化的背景下展开。",
"https://www.oxfordlearnersdictionaries.com/definition/english/backdrop"
],
[
"inevitable",
"形容词 · 不可避免的",
"可作表语或放名词前，常见 inevitable change；表示在给定情况无法避免，不应用来随意断言所有未来结果。",
"Some wear is inevitable after years of daily use.",
"多年日常使用后，一些磨损不可避免。",
"It became inevitable that the work would continue into winter.",
"工程将持续到冬季已不可避免。",
"https://www.oxfordlearnersdictionaries.com/definition/english/inevitable"
],
[
"dwindle",
"动词 · 逐渐减少",
"通常不及物，dwindle to 表减至某程度，常见 dwindling supplies；不用于单次突然完全消失。",
"The supply of clean jars began to dwindle.",
"干净瓶子的供应开始减少。",
"The crowd will dwindle as the evening grows colder.",
"晚上越来越冷时，人群会逐渐散去。",
"https://www.oxfordlearnersdictionaries.com/definition/english/dwindle"
],
[
"fusion",
"名词 · 融合",
"指两种或多种事物结合成一个整体，可用 a fusion of；核聚变是专业义项，不等于任何加热熔化。",
"The music is a fusion of traditional rhythms and electronic sounds.",
"这种音乐融合了传统节奏和电子音效。",
"The project encourages a fusion of art and science.",
"项目鼓励艺术与科学融合。",
"https://www.oxfordlearnersdictionaries.com/definition/english/fusion"
],
[
"hectare",
"名词 · 公顷",
"是面积单位，一公顷等于一万平方米，可数；不能与表示体积的立方米或长度单位混用。",
"The garden covers about one hectare.",
"花园占地约一公顷。",
"Each hectare of the reserve was mapped in detail.",
"保护区每一公顷土地都经过详细测绘。",
"https://www.oxfordlearnersdictionaries.com/definition/english/hectare"
],
[
"analogue",
"形容词 · 模拟的",
"技术语境表示连续变化的量，也可形容用指针显示的钟表；美式常写 analog，与数字式 digital 区别。",
"The old device uses an analogue signal.",
"旧设备使用模拟信号。",
"An analogue clock hangs above the workbench.",
"工作台上方挂着一只指针式时钟。",
"https://www.oxfordlearnersdictionaries.com/definition/english/analogue"
],
[
"perennial",
"形容词 · 多年生的",
"植物学中指寿命超过两年的植物，常见 perennial plant；也可比喻反复出现的问题，范围依名词判断。",
"The border contains perennial plants that flower each spring.",
"花境中种着每年春天开花的多年生植物。",
"Limited storage remains a perennial problem for the workshop.",
"储物不足一直是工作间反复出现的问题。",
"https://www.oxfordlearnersdictionaries.com/definition/english/perennial"
],
[
"wrinkle",
"名词 · 皱纹；褶皱",
"可指皮肤上的细纹或布纸上不想要的折痕，可数；与 deliberate fold 的有意折叠效果有别。",
"A deep wrinkle ran across the old photograph.",
"旧照片上有一道深褶痕。",
"She smoothed a wrinkle in the tablecloth.",
"她抚平了桌布上的一道褶皱。",
"https://www.oxfordlearnersdictionaries.com/definition/english/wrinkle"
],
[
"frontal",
"形容词 · 正面的",
"表示与前部有关或直接从正面展开，常见 frontal view；不等同于任何表示首要位置的 first。",
"The drawing gives a frontal view of the statue.",
"图画呈现雕像的正面视图。",
"The lecture explains the role of the frontal areas of the brain.",
"讲座解释大脑额部区域的作用。",
"https://www.oxfordlearnersdictionaries.com/definition/english/frontal"
],
[
"meticulous",
"形容词 · 一丝不苟的",
"形容人或工作非常注意细节，常用 meticulous about 或 in；不只是做得慢，还强调准确细致。",
"She kept meticulous records of every repair.",
"她对每次修理都作了细致记录。",
"The restorer was meticulous about matching the original color.",
"修复师对匹配原有颜色一丝不苟。",
"https://www.oxfordlearnersdictionaries.com/definition/english/meticulous"
],
[
"elliptical",
"形容词 · 椭圆形的",
"本条取形状与椭圆有关的义项，常见 elliptical orbit；语言中省略词语的义项不用于几何形状。",
"The planet follows an elliptical orbit.",
"行星沿椭圆轨道运行。",
"An elliptical window lights the stairwell.",
"一扇椭圆窗为楼梯间采光。",
"https://www.oxfordlearnersdictionaries.com/definition/english/elliptical"
],
[
"incite",
"动词 · 煽动",
"通常用于鼓动暴力、违法等不良行动，incite someone to do 表煽动某人去做；不是中性鼓励学习的常用词。",
"The speech was accused of trying to incite violence.",
"这篇讲话被指试图煽动暴力。",
"The novel shows how rumors can incite a crowd to act.",
"小说展示谣言如何煽动人群行动。",
"https://www.oxfordlearnersdictionaries.com/definition/english/incite"
],
[
"alertness",
"名词 · 警觉",
"指迅速思考察觉情况的能力或意识到危险的状态，通常不可数；与保持清醒相关但不等于长期不睡。",
"The task requires alertness and careful observation.",
"这项任务需要警觉和细致观察。",
"Her alertness helped her notice the loose bolt.",
"她的警觉帮助她发现了松动螺栓。",
"https://www.oxfordlearnersdictionaries.com/definition/english/alertness"
],
[
"turbulent",
"形容词 · 动荡的",
"可描述局势反复变化或流体方向剧烈变动，常见 turbulent period；不能只按普通流动理解。",
"The company faced a turbulent period after the closure.",
"关闭后，公司面临一段动荡时期。",
"The boat entered turbulent water below the falls.",
"小船进入瀑布下方湍急水域。",
"https://www.oxfordlearnersdictionaries.com/definition/english/turbulent"
],
[
"snap",
"动词 · 折断",
"指伴有清脆声音的突然断裂，可及物或不及物，snapped 双写 p；拍照或急声说话是其他义项。",
"The dry branch could snap under the weight.",
"干树枝可能承受不住重量而折断。",
"Do not snap the thin plastic clip when removing the cover.",
"拆盖子时不要折断薄塑料卡扣。",
"https://www.oxfordlearnersdictionaries.com/definition/english/snap"
],
[
"dismiss",
"动词 · 不予考虑",
"dismiss something as 表认为某事不值得重视；解雇人员和让人离开是其他义，须看宾语与场景。",
"We should not dismiss the warning without checking it.",
"我们不应不核实就忽视警告。",
"She refused to dismiss the idea as impossible.",
"她拒绝把这个想法当作不可能而不予考虑。",
"https://www.oxfordlearnersdictionaries.com/definition/english/dismiss"
],
[
"exertion",
"名词 · 用力；努力",
"常指体力或脑力付出，通常不可数；physical exertion 表体力活动，不等于只有高强度运动。",
"The climb involved more exertion than we expected.",
"攀爬比我们预想的更费力。",
"He paused to recover from the exertion of moving the crates.",
"搬完箱子后，他停下来缓解用力后的疲惫。",
"https://www.oxfordlearnersdictionaries.com/definition/english/exertion"
],
[
"feedback",
"名词 · 反馈",
"表示对工作表现的信息或意见时通常不可数，feedback on 后接对象；不用 a feedback 表一条反馈。",
"We collected feedback on the new reading area.",
"我们收集了对新阅读区的反馈。",
"Her detailed feedback helped me revise the introduction.",
"她详尽的反馈帮助我修改导言。",
"https://www.oxfordlearnersdictionaries.com/definition/english/feedback"
],
[
"ubiquitous",
"形容词 · 无处不在的",
"形容某物极其常见、似乎随处可见，语体较正式；通常不是经过逐点证实的字面绝对覆盖。",
"The once rare device has become ubiquitous in classrooms.",
"这种曾经少见的设备如今在教室里随处可见。",
"The film includes the ubiquitous sound of traffic.",
"影片包含城市中随处可闻的车流声。",
"https://www.oxfordlearnersdictionaries.com/definition/english/ubiquitous"
],
[
"viper",
"名词 · 蝰蛇",
"指一类有毒的小型蛇，可数；不把所有毒蛇都叫 viper，具体物种仍需鉴别。",
"A viper lay hidden beneath the stones.",
"一条蝰蛇藏在石头下面。",
"The guide warned us not to approach the viper.",
"向导警告我们不要靠近那条蝰蛇。",
"https://www.oxfordlearnersdictionaries.com/definition/english/viper"
],
[
"retraction",
"名词 · 撤回声明",
"可指声明先前言论不实的更正，常用 a retraction of；也有物体缩回义，本条例句限定出版和言论。",
"The newspaper published a retraction of the false claim.",
"报纸发表声明撤回不实说法。",
"The author issued a retraction after discovering the error.",
"作者发现错误后发表了撤回声明。",
"https://www.oxfordlearnersdictionaries.com/definition/english/retraction"
],
[
"amplify",
"动词 · 放大",
"可指增强声音或影响，也可指补充细节，直接接对象；不只是把扬声器外形做大。",
"The microphone will amplify the speaker's voice.",
"麦克风将放大演讲者的声音。",
"Small errors can amplify differences in the final result.",
"小错误会放大最终结果中的差异。",
"https://www.oxfordlearnersdictionaries.com/definition/english/amplify"
],
[
"strait",
"名词 · 海峡",
"指连接较大海域的狭窄水道，可数，名称中也常用复数 Straits；与直的 straight 同音不同义。",
"The ferry crosses the strait twice a day.",
"渡轮每天穿越海峡两次。",
"Strong currents flow through the narrow strait.",
"强劲水流穿过狭窄海峡。",
"https://www.oxfordlearnersdictionaries.com/definition/english/strait"
],
[
"pile",
"名词 · 一堆",
"指堆放在一起的东西，可数，a pile of 后接材料或复数物件；不要求每层都排列整齐。",
"A pile of old maps covered the desk.",
"一堆旧地图盖满了书桌。",
"We moved the pile of branches away from the gate.",
"我们把那堆树枝从大门旁移走。",
"https://www.oxfordlearnersdictionaries.com/definition/english/pile"
],
[
"conventional",
"形容词 · 常规的",
"表示依传统或普遍接受方式而非新奇方法，常见 conventional design；不自动带正确或落后的判断。",
"The roof uses a conventional wooden frame.",
"屋顶采用常规木框架。",
"We compared the experimental method with a conventional approach.",
"我们把实验方法与常规做法作了比较。",
"https://www.oxfordlearnersdictionaries.com/definition/english/conventional"
],
[
"mitigate",
"动词 · 减轻",
"语体较正式，直接接风险、损害等，表示使其不那么严重；不表示负面影响已经完全消除。",
"Planting trees may mitigate the effects of strong winds.",
"种树可能减轻强风的影响。",
"The team added drainage channels to mitigate flood damage.",
"团队增加了排水沟，以减轻洪水损害。",
"https://www.oxfordlearnersdictionaries.com/definition/english/mitigate"
]
];
export const EXPANSION_FIVE_NOTE_SOURCES = {};
export const EXPANSION_FIVE_SYNONYM_GROUPS = {};
export const EXPANSION_FIVE_WORD_NOTES = {};
for (const [word, sense, note, en1, zh1, en2, zh2, url] of rows) {
  const sourceId = `e5-source-${word}`;
  const groupId = `e5-usage-${word}`;
  EXPANSION_FIVE_NOTE_SOURCES[sourceId] = {
    title: `${url.includes('cambridge.org') ? '剑桥词典' : '牛津学习词典'} · ${word}`,
    url, checkedAt: '2026-10-24', use: 'factual-reference',
  };
  EXPANSION_FIVE_SYNONYM_GROUPS[groupId] = {
    words: [word], comparisonType: 'usage', sense, note,
    examples: [{ en: en1, zh: zh1 }, { en: en2, zh: zh2 }], sourceIds: [sourceId],
    review: { status: 'source-checked', checkedAt: '2026-10-24' },
  };
  if (word === 'passageway') {
    const senseSourceId = 'e5-source-passageway-sense';
    EXPANSION_FIVE_NOTE_SOURCES[senseSourceId] = {
      title: '剑桥词典 · passage（passageway 交叉释义）',
      url: 'https://dictionary.cambridge.org/dictionary/english/passage',
      checkedAt: '2026-10-24', use: 'factual-reference',
    };
    EXPANSION_FIVE_SYNONYM_GROUPS[groupId].sourceIds.push(senseSourceId);
  }
  EXPANSION_FIVE_WORD_NOTES[word] = { synonymGroup: groupId };
}
