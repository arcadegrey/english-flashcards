// Original scoped usage notes and bilingual examples. References were opened on 2026-10-23.
// source-checked is factual reference checking, not independent expert review.
// Tuple fields: word, scoped sense, teaching note, English/Chinese example 1, English/Chinese example 2.
const entries = [
  [
    "balance",
    "名词 · 身体的平衡",
    "身体站稳可说 keep one's balance；失去平衡用 lose one's balance。这里指身体状态，不是银行账户余额。",
    "The dancer kept her balance on one foot.",
    "舞者单脚站立仍保持着平衡。",
    "He lost his balance on the wet steps.",
    "他在湿台阶上失去了平衡。"
  ],
  [
    "bandage",
    "名词 · 绷带",
    "bandage 指包扎伤处的绷带，是可数名词；强调一条可用 a bandage，包在某处可用 a bandage around。",
    "A clean bandage covered her knee.",
    "一条干净的绷带包着她的膝盖。",
    "The bandage around his wrist was loose.",
    "他手腕上的绷带松了。"
  ],
  [
    "bare",
    "形容词 · 裸露、无遮盖",
    "bare 强调没有通常应有的覆盖物，常见 bare feet、bare walls；不是所有“空的”都用 bare，空杯子通常用 empty。",
    "She left muddy footprints with her bare feet.",
    "她光着脚留下了泥脚印。",
    "They hung a map on the bare wall.",
    "他们在光秃秃的墙上挂了一幅地图。"
  ],
  [
    "barrier",
    "名词 · 阻挡通行的屏障",
    "barrier 可以是挡住道路的实物，也可用于抽象障碍；这里先记物理屏障，通常可数，放在通行路线前。",
    "A metal barrier blocked the entrance.",
    "一道金属屏障挡住了入口。",
    "Please stay behind the barrier until the train stops.",
    "请待在护栏后，直到列车停稳。"
  ],
  [
    "basin",
    "名词 · 盛水的盆",
    "basin 在此指盛水、洗漱用的盆，可用 a basin of water 表示一盆水；地理文章里的 river basin 则是流域。",
    "She carried a basin of warm water upstairs.",
    "她端着一盆温水上楼。",
    "A small basin stood beside the water pump.",
    "水泵旁放着一个小盆。"
  ],
  [
    "beam",
    "名词 · 建筑横梁",
    "beam 可指支撑建筑的长梁，常与 wooden、steel 连用；a beam of light 是另一义项“光束”，读到时要依靠搭配区分。",
    "A wooden beam supported the old roof.",
    "一根木梁支撑着旧屋顶。",
    "The builder checked every steel beam before work began.",
    "开工前，建筑工人检查了每根钢梁。"
  ],
  [
    "bedroom",
    "名词 · 卧室",
    "bedroom 指供睡眠使用的房间，是可数名词；in the bedroom 表示在卧室里，描述几居室时也常见 bedroom 的组合用法。",
    "Her bedroom overlooks a quiet garden.",
    "她的卧室朝向一座安静的花园。",
    "We put the spare blankets in the bedroom.",
    "我们把备用毯子放进卧室。"
  ],
  [
    "beer",
    "名词 · 啤酒",
    "beer 指啤酒这种饮品时通常不可数；a beer 在点单等语境中可表示一份或一杯，而不是说所有液体都变成可数名词。",
    "The recipe calls for a little beer.",
    "这道菜的做法需要少量啤酒。",
    "The museum displayed an old beer bottle.",
    "博物馆展出了一只旧啤酒瓶。"
  ],
  [
    "behavior",
    "名词 · 行为、表现",
    "behavior 是美式拼写，英式常写 behaviour；概括一个人的举止时通常不可数，可用 polite behavior 或 unusual behavior。",
    "The teacher praised his thoughtful behavior.",
    "老师表扬了他体贴的表现。",
    "The camera recorded the animal's unusual behavior.",
    "摄像机记录了那只动物的异常行为。"
  ],
  [
    "belly",
    "名词 · 肚子、腹部",
    "belly 是较口语的肚子说法，也能指动物腹部；正式介绍身体部位时可见 abdomen，不要把 belly 只理解为身体内部的胃。",
    "The puppy rolled over and showed its belly.",
    "小狗翻了个身，露出了肚子。",
    "He lay on his belly to look under the sofa.",
    "他趴着查看沙发下面。"
  ],
  [
    "bend",
    "动词 · 使弯曲",
    "bend 可直接接被弯曲的物体，也可描述身体弯曲；过去式和过去分词是 bent，不是规则加 -ed。",
    "Bend the wire gently around the wooden post.",
    "把铁丝轻轻绕着木柱弯过去。",
    "Try not to bend the corners of the photograph.",
    "尽量别折弯照片的角。"
  ],
  [
    "bible",
    "名词 · 《圣经》",
    "表示基督教经典时通常写 the Bible，Bible 首字母大写；a Bible 可指一本具体的《圣经》，不能只按词库小写形式照抄。",
    "She found a family Bible in the wooden chest.",
    "她在木箱里找到一本家传的《圣经》。",
    "The guide explained a scene from the Bible.",
    "导游讲解了《圣经》中的一个场景。"
  ],
  [
    "bird",
    "名词 · 鸟",
    "bird 指鸟这种动物，是可数名词；一只用 a bird，多只用 birds。描述种类时可说 a kind of bird。",
    "A tiny bird landed on the balcony rail.",
    "一只小鸟落在阳台栏杆上。",
    "We watched a bird carry a twig to its nest.",
    "我们看着一只鸟把细枝衔回巢里。"
  ],
  [
    "bite",
    "动词 · 咬",
    "bite 可直接接被咬的人或东西；过去式 bit、过去分词 bitten。bite into 强调咬入某物，与单纯触碰不同。",
    "Do not bite the end of your pencil.",
    "不要咬铅笔末端。",
    "A frightened dog may bite even a familiar person.",
    "受惊的狗连熟人也可能咬。"
  ],
  [
    "blade",
    "名词 · 刀刃、刀片",
    "blade 强调工具中平薄、负责切割的部分，不等于整把刀；也能指叶片等相似形状，此处限刀具义。",
    "The blade was too dull to cut the rope.",
    "刀刃太钝，割不断绳子。",
    "Keep your fingers away from the moving blade.",
    "手指要远离转动中的刀片。"
  ],
  [
    "blast",
    "名词 · 强烈的一股气流",
    "a blast of air 表示突然而强烈的一股气流，blast 可数；不要把这里的 blast 一律译成爆炸，它也可用于风或声响。",
    "A blast of cold air came through the doorway.",
    "一股猛烈的冷风从门口灌了进来。",
    "We felt a warm blast from the open oven.",
    "我们感到敞开的烤箱涌出一股热气。"
  ],
  [
    "bless",
    "动词 · 祝福、为……祈福",
    "bless 常用于宗教祝福，可直接接人、事物；Bless you 也用于回应喷嚏。日常祝贺成绩更常用 congratulate。",
    "The priest will bless the new chapel on Sunday.",
    "神父将在周日为新礼拜堂祝福。",
    "They asked a religious leader to bless their marriage.",
    "他们请一位宗教领袖为婚姻祝福。"
  ],
  [
    "blog",
    "名词 · 博客",
    "blog 可指博客网站或持续发布文章的栏目；写博客可说 write a blog，描述主题常用 a blog about 或 a travel blog。",
    "Her travel blog includes sketches of small towns.",
    "她的旅行博客里有小镇速写。",
    "I found the recipe on a gardening blog.",
    "我在一个园艺博客上找到了这份食谱。"
  ],
  [
    "blouse",
    "名词 · 女式衬衫",
    "blouse 通常指较宽松的女式上衣，是可数名词；不是所有上衣都叫 blouse，T 恤和外套通常另用各自名称。",
    "She paired a white blouse with dark trousers.",
    "她用白衬衫搭配深色长裤。",
    "The blue blouse has tiny pearl buttons.",
    "那件蓝色女式衬衫有小小的珍珠纽扣。"
  ],
  [
    "boat",
    "名词 · 小船",
    "boat 通常用于水上的小型船只；大型海船常用 ship，但实际名称受习惯影响，不宜只用尺寸作绝对判断。",
    "We rented a boat to explore the narrow river.",
    "我们租了条小船探索那条窄河。",
    "The wooden boat rocked beside the pier.",
    "木船在码头旁摇晃。"
  ],
  [
    "bomb",
    "名词 · 炸弹",
    "bomb 指爆炸装置，是可数名词；新闻中 bomb 可以作名词修饰语，如 bomb damage，指炸弹造成的损坏。",
    "The museum displayed a model of an old bomb.",
    "博物馆展出了一枚旧式炸弹的模型。",
    "The film follows a team searching for a hidden bomb.",
    "电影讲述一支队伍搜寻隐藏炸弹的故事。"
  ],
  [
    "bonus",
    "名词 · 奖金、额外好处",
    "bonus 表示原定报酬之外的奖金，也可指预料之外的好处；不是固定工资本身，常见 a bonus、an added bonus。",
    "The company paid a small bonus in December.",
    "公司在十二月发了一笔小额奖金。",
    "The sea view was an unexpected bonus.",
    "海景是一个意外的额外收获。"
  ],
  [
    "border",
    "名词 · 边缘",
    "border 可指画面或物体周围的边缘，也能指国界；a border around 强调围绕某物的一圈边，不是中心部分。",
    "She drew a green border around the invitation.",
    "她沿请柬四周画了一圈绿色边框。",
    "The blanket has a narrow red border.",
    "毯子有一圈窄窄的红边。"
  ],
  [
    "bother",
    "动词 · 打扰、使烦恼",
    "bother someone 指打扰某人或使其烦恼；bother to do 则表示费心去做，是另一种结构，不能把所有 bother 都译成打扰。",
    "Does the noise from the printer bother you?",
    "打印机的声音会打扰你吗？",
    "I did not want to bother her during lunch.",
    "我不想在午餐时打扰她。"
  ],
  [
    "bow",
    "动词 · 鞠躬、低头致意",
    "bow 作鞠躬解时读音与 cow 押韵；常用 bow to someone。名词“弓、蝴蝶结”的 bow 发音不同，不能混记。",
    "The actors bow to the audience after the final scene.",
    "最后一幕后，演员们向观众鞠躬。",
    "Visitors sometimes bow before entering the shrine.",
    "参观者有时在进入神社前鞠躬。"
  ],
  [
    "boy",
    "名词 · 男孩",
    "boy 通常指男孩，是可数名词；用来称呼不熟悉的成年男性可能失礼，正式介绍成年人应选合适的称呼。",
    "The boy in the red hat is my cousin.",
    "戴红帽的男孩是我表弟。",
    "A young boy offered to carry the empty basket.",
    "一个小男孩主动提出帮忙拿空篮子。"
  ],
  [
    "branch",
    "名词 · 树枝",
    "branch 在树木语境中指从树干分出的枝条，也可引申为机构分部；此处先记树枝，不要与整棵树或树叶混淆。",
    "A broken branch lay across the path.",
    "一根断树枝横在小路上。",
    "The cat climbed onto the lowest branch.",
    "猫爬上了最低的那根树枝。"
  ],
  [
    "breakfast",
    "名词 · 早餐",
    "breakfast 指一天中的第一餐，普通吃早餐常用 have breakfast，不必加 a；强调一顿具体早餐时可以用 a。",
    "We have breakfast before the school bus arrives.",
    "校车到达前我们吃早餐。",
    "The hotel serves breakfast in the courtyard.",
    "旅馆在庭院供应早餐。"
  ],
  [
    "breathe",
    "动词 · 呼吸",
    "breathe 是动词，注意与名词 breath 区分；可单独用，也可接 in、out 描述吸气、呼气，结尾 -e 不能漏写。",
    "Breathe slowly while you stretch your shoulders.",
    "伸展肩膀时慢慢呼吸。",
    "It is easier to breathe near the open window.",
    "在敞开的窗边呼吸更轻松。"
  ],
  [
    "brew",
    "动词 · 酿制啤酒",
    "brew 可指酿造啤酒等饮品，宾语直接接所制饮品；也能用于泡茶、煮咖啡，但不泛指一切烹饪。",
    "They brew a dark beer using local grain.",
    "他们用本地谷物酿制一种黑啤酒。",
    "The small factory began to brew beer last spring.",
    "那家小工厂去年春天开始酿啤酒。"
  ],
  [
    "bridge",
    "名词 · 桥梁",
    "bridge 作名词指跨越河流、道路等障碍的桥，是可数名词；over the river 描述桥跨越河面，under the bridge 则在桥下。",
    "A narrow bridge connects the two villages.",
    "一座窄桥连接着两个村庄。",
    "We stopped under the bridge to avoid the rain.",
    "我们停在桥下避雨。"
  ],
  [
    "broken",
    "形容词 · 损坏的、破裂的",
    "broken 可描述东西破裂或设备损坏，作定语或表语；表示设备不能工作时不必是肉眼可见地断成两半。",
    "The broken window let cold air into the room.",
    "破窗让冷风吹进了房间。",
    "Please label the broken chair so nobody uses it.",
    "请给坏椅子贴上标签，以免有人使用。"
  ],
  [
    "brush",
    "名词 · 刷子",
    "brush 指带刷毛、用于清洁或涂抹的工具，是可数名词；不同用途可用 paint brush、hairbrush 等名称，注意语境。",
    "Use a soft brush to clean the dusty frame.",
    "用软刷清理满是灰尘的相框。",
    "She dipped the brush into the blue paint.",
    "她把刷子蘸进蓝色颜料。"
  ],
  [
    "budget",
    "名词 · 预算",
    "budget 指预先安排的资金额度或收支计划；on a tight budget 表示预算紧张，within the budget 表示没有超出预算。",
    "Our budget covers the train tickets and two meals.",
    "我们的预算包含火车票和两餐饭。",
    "They kept the repair costs within the budget.",
    "他们把维修费用控制在预算内。"
  ],
  [
    "bulk",
    "名词 · 大部分",
    "the bulk of 表示某物的大部分，常接工作、时间、货物等；这里不是“体积”的含义，需结合 of 后面的内容理解。",
    "The bulk of the work was finished before noon.",
    "大部分工作在中午前完成了。",
    "She spent the bulk of her savings on training.",
    "她把大部分积蓄花在培训上。"
  ],
  [
    "bump",
    "名词 · 凸起、肿块",
    "bump 可指表面凸起或碰撞后的肿块，是可数名词；a bump on the road 与 a bump on the head 都强调凸起的形状。",
    "A bump in the road shook the boxes loose.",
    "路上的一处凸起把箱子颠松了。",
    "There was a small bump on his forehead.",
    "他的额头上有一个小肿包。"
  ],
  [
    "burden",
    "名词 · 负担",
    "burden 可指需要承担的责任或令人烦忧的重压；a burden on someone 强调给某人带来的负担，不只指实际重量。",
    "The rent became a heavy burden on the family.",
    "房租成了这个家庭的沉重负担。",
    "Sharing the chores reduced her burden.",
    "分担家务减轻了她的负担。"
  ],
  [
    "bush",
    "名词 · 灌木",
    "bush 是灌木，常比树低矮且有多个枝干，通常可数；the bush 在某些地区也指荒野，此处限花园里的植物。",
    "A butterfly settled on the rose bush.",
    "一只蝴蝶停在玫瑰丛上。",
    "The gardener trimmed the bush beside the gate.",
    "园丁修剪了大门旁的灌木。"
  ],
  [
    "button",
    "名词 · 纽扣",
    "button 可指衣物上的纽扣，也可指控制按钮；此处是衣物义，扣上纽扣的动作也可以用动词 button。",
    "One button was missing from his coat.",
    "他的大衣少了一颗纽扣。",
    "She sewed a blue button onto the sleeve.",
    "她在袖子上缝了一颗蓝纽扣。"
  ],
  [
    "cabinet",
    "名词 · 储物柜",
    "cabinet 在家具语境中指通常有门、搁板的柜子，是可数名词；政治语境里的 Cabinet 则可指内阁。",
    "The cups are in the cabinet above the sink.",
    "杯子在水槽上方的柜子里。",
    "He locked the documents in a metal cabinet.",
    "他把文件锁进了一个金属柜。"
  ],
  [
    "cake",
    "名词 · 蛋糕",
    "cake 指食物整体时可数，指吃掉的蛋糕份量时常不可数；a cake 是一个蛋糕，a piece of cake 是一块蛋糕。",
    "We baked a cake for the class celebration.",
    "我们为班级庆祝活动烤了一个蛋糕。",
    "Would you like another slice of cake?",
    "你想再来一片蛋糕吗？"
  ],
  [
    "camera",
    "名词 · 相机、摄像机",
    "camera 指记录影像的设备，是可数名词；take a photograph with a camera 说明使用工具，不是把照片“放进”相机。",
    "Her camera can take clear pictures in low light.",
    "她的相机在弱光下也能拍出清晰照片。",
    "I left my camera beside the window.",
    "我把相机落在窗边了。"
  ],
  [
    "campus",
    "名词 · 校园",
    "campus 指学校的建筑和场地整体；on campus 表示在校园内，通常不用 in campus，off campus 表示校外。",
    "The new library is on the north side of campus.",
    "新图书馆在校园北侧。",
    "She lives on campus during the term.",
    "学期里她住在校园内。"
  ],
  [
    "candle",
    "名词 · 蜡烛",
    "candle 是可数名词，点蜡烛可用 light a candle，吹灭用 blow out a candle；不要与电灯的开关搭配混淆。",
    "A single candle lit the little table.",
    "一支蜡烛照亮了小桌子。",
    "She placed a candle beside the framed photograph.",
    "她在相框旁放了一支蜡烛。"
  ],
  [
    "captain",
    "名词 · 船长",
    "captain 的身份随领域变化，可以是船长、队长或军衔；此处限负责船只的人，不把所有 captain 都译为军官。",
    "The captain delayed departure because of the storm.",
    "船长因暴风雨推迟了启航。",
    "A message from the captain came over the radio.",
    "无线电里传来船长的消息。"
  ],
  [
    "card",
    "名词 · 贺卡",
    "card 可指多类卡片，这里限定祝福、问候用的贺卡；a birthday card、send someone a card 都是实用组合。",
    "The class signed a card for their retiring teacher.",
    "全班在给即将退休老师的贺卡上签了名。",
    "She sent a card with a drawing of the seaside.",
    "她寄了一张画着海边图景的贺卡。"
  ],
  [
    "carpet",
    "名词 · 地毯",
    "carpet 指铺地面的厚织物，可指一块地毯或铺设材料；a carpet 强调整块，the carpet 强调语境中已知的地面铺物。",
    "The carpet softened the sound of our footsteps.",
    "地毯减轻了我们的脚步声。",
    "They chose a blue carpet for the reading room.",
    "他们为阅览室选了一块蓝地毯。"
  ],
  [
    "cash",
    "名词 · 现金",
    "cash 表示现金时通常不可数，付款用 pay in cash；不能照“一个现金”写成 a cash，具体张数应说 notes 或 bills。",
    "The small shop accepts cash only.",
    "这家小店只收现金。",
    "I paid in cash because the card reader was broken.",
    "刷卡机坏了，所以我用现金付款。"
  ],
  [
    "catalog",
    "名词 · 目录",
    "catalog 是美式常见拼写，catalogue 也常见；指系统列出物品及信息的目录，可用于商品、图书，不只是普通清单。",
    "The library catalog lists every book by author.",
    "图书馆目录按作者列出每本书。",
    "She circled a desk in the furniture catalog.",
    "她在家具目录里圈出了一张书桌。"
  ],
  [
    "cattle",
    "名词 · 牛群",
    "cattle 指牛的集合，语法上搭配复数动词；不能说 a cattle，单头牛要根据情境用 a cow、a bull 等。",
    "The cattle are grazing near the river.",
    "牛群正在河边吃草。",
    "The farmer moved the cattle into a larger field.",
    "农民把牛群赶到一片更大的田地里。"
  ],
  [
    "cell",
    "名词 · 单人小室、牢房",
    "cell 可指修道院或监狱里的小室，也有生物细胞等义项；这里限定房间，需看 prison 等语境线索。",
    "The prisoner returned to his cell after the visit.",
    "探视结束后，囚犯回到了牢房。",
    "A narrow window lit the monk's cell.",
    "一扇窄窗照亮了修士的小室。"
  ],
  [
    "ceremony",
    "名词 · 仪式",
    "ceremony 指有规定流程的正式仪式，是可数名词；opening ceremony 是开幕式，不能把所有轻松聚会都称 ceremony。",
    "The opening ceremony began with a short speech.",
    "开幕式以一段简短致辞开始。",
    "Our school held a ceremony to welcome new students.",
    "学校举行了迎新仪式。"
  ],
  [
    "chamber",
    "名词 · 腔室、封闭空间",
    "chamber 可指专门用途的房间或封闭腔室，比 room 更强调用途或结构；此处不涉及议会两院等政治义项。",
    "The machine has a sealed chamber for the sample.",
    "机器有一个存放样本的密封腔室。",
    "The guide led us into an underground chamber.",
    "导游带我们进入了一个地下石室。"
  ],
  [
    "chapter",
    "名词 · 书的章",
    "chapter 指书中的大章节，是可数名词；in chapter three 表示在第三章，阅读具体章节可用 read a chapter。",
    "Each chapter ends with a short exercise.",
    "每章都以一个简短练习结束。",
    "I read one chapter before turning off the light.",
    "我读完一章才关灯。"
  ],
  [
    "charm",
    "名词 · 魅力",
    "charm 指吸引人的特质时通常不可数，可以描述人或地方；a charm 还可指护身符等小物件，不能混为同一义项。",
    "The village has a quiet charm in winter.",
    "这个村庄冬日里有一种宁静的魅力。",
    "Her warm voice added charm to the simple story.",
    "她温暖的嗓音为这个朴素的故事增添了魅力。"
  ],
  [
    "cheat",
    "动词 · 作弊、欺骗",
    "cheat 可不及物表示作弊；考试作弊常见 cheat on an exam，美式表达尤其常用。cheat someone 则是欺骗某人。",
    "It is unfair to cheat during a spelling contest.",
    "拼写比赛中作弊是不公平的。",
    "The seller tried to cheat us by changing the price.",
    "卖家试图临时改价来欺骗我们。"
  ],
  [
    "cheese",
    "名词 · 奶酪",
    "cheese 泛指奶酪食物时通常不可数，一块用 a piece of cheese；cheeses 在比较不同品种时才常用复数。",
    "She sprinkled cheese over the baked vegetables.",
    "她在烤蔬菜上撒了些奶酪。",
    "We packed bread and cheese for the hike.",
    "我们为徒步带上了面包和奶酪。"
  ],
  [
    "chemistry",
    "名词 · 化学",
    "chemistry 是学科名称，通常不可数，常见 study chemistry、a chemistry lesson；词尾虽然有 -y，不能据此推断通用构词规则。",
    "Chemistry helps us understand how materials change.",
    "化学帮助我们理解材料如何变化。",
    "Our chemistry lesson began with a safety demonstration.",
    "我们的化学课从安全演示开始。"
  ],
  [
    "chicken",
    "名词 · 鸡",
    "chicken 指一只鸡时可数，指鸡肉时通常不可数；a chicken 和 some chicken 的含义需依上下文区分。",
    "A chicken escaped through the open gate.",
    "一只鸡从敞开的大门跑了出去。",
    "The child drew a chicken beside the farmhouse.",
    "孩子在农舍旁画了一只鸡。"
  ],
  [
    "chip",
    "名词 · 薄片、小碎片",
    "chip 可指从木头、石头等剥下的小片，也用于薄脆食品；此处先记物体碎片，不把芯片义套到所有场景。",
    "A tiny chip of wood fell onto the floor.",
    "一小片木屑掉在地上。",
    "He found a chip of blue paint on his sleeve.",
    "他在袖子上发现一小片蓝色漆屑。"
  ],
  [
    "church",
    "名词 · 教堂",
    "church 可指基督教礼拜建筑；go to church 常强调参加礼拜，go to the church 常强调去某一座建筑，要依语境判断。",
    "The old church stands beside the river.",
    "那座老教堂位于河边。",
    "We met outside the church before the concert.",
    "音乐会前，我们在教堂外碰面。"
  ],
  [
    "circuit",
    "名词 · 环行路线",
    "circuit 在这里表示绕一圈的路线或行程，可用 a circuit of the park；它也有电路等含义，不能只背单一中文。",
    "We made a slow circuit of the lake.",
    "我们沿湖慢慢绕了一圈。",
    "One circuit of the running track is enough for now.",
    "目前绕跑道一圈就够了。"
  ],
  [
    "classroom",
    "名词 · 教室",
    "classroom 指上课用的房间，是可数名词；class 可指班级或一节课，classroom 则强调实际空间，二者不随意替换。",
    "Our classroom gets plenty of morning sunlight.",
    "我们的教室早晨阳光充足。",
    "The students left their wet coats outside the classroom.",
    "学生把湿外套留在教室外。"
  ],
  [
    "click",
    "动词 · 点击",
    "click 在电脑操作中可直接接按钮或链接，也常用 click on；它指一次按键选择动作，不等于打字输入。",
    "Click the blue button to save your drawing.",
    "点击蓝色按钮保存画作。",
    "Do not click on a link from an unknown sender.",
    "不要点击未知发件人发来的链接。"
  ],
  [
    "clip",
    "名词 · 夹子",
    "clip 可指用来夹住东西的小装置，是可数名词；a paper clip 是回形针，视频片段也是 clip 的另一义项。",
    "A metal clip held the papers together.",
    "一个金属夹子把纸张夹在一起。",
    "She attached the label with a small clip.",
    "她用一个小夹子固定住标签。"
  ],
  [
    "cloud",
    "名词 · 云",
    "cloud 指天空中的云时可数，a cloud 是一朵云；cloud 也用于云计算等语境，此处先记天气义。",
    "A dark cloud covered the afternoon sun.",
    "一片乌云遮住了午后的太阳。",
    "The last cloud drifted behind the mountain.",
    "最后一片云飘到了山后。"
  ],
  [
    "coal",
    "名词 · 煤",
    "coal 指作为燃料的煤时通常不可数，可用 a piece of coal 表示一块煤；不要与木炭 charcoal 混作完全同义。",
    "The old stove used coal to heat the house.",
    "旧炉子用煤给房子供暖。",
    "A piece of coal lay beside the empty bucket.",
    "空桶旁有一块煤。"
  ],
  [
    "code",
    "名词 · 规则体系",
    "code 可指系统的一套规则，如 a code of conduct；这里不是程序代码义，理解时要看 code 后面的说明。",
    "The club has a clear code of conduct.",
    "俱乐部有明确的行为准则。",
    "Respect for others is central to our school code.",
    "尊重他人是校规的核心。"
  ],
  [
    "collar",
    "名词 · 衣领、项圈",
    "collar 指围在颈部的部分，可用于衣领或动物项圈；a shirt collar 和 a dog's collar 都围绕颈部，但用途不同。",
    "The collar of his shirt was slightly bent.",
    "他的衬衫领子有点折弯了。",
    "The dog wore a collar with its owner's number.",
    "狗戴着写有主人号码的项圈。"
  ],
  [
    "column",
    "名词 · 纵列",
    "column 指纵向排列的一列，如表格中的一列；row 通常指横向一行，填写表格时要看清方向。",
    "Write the dates in the first column.",
    "把日期写在第一列。",
    "The final column shows the total cost.",
    "最后一列显示总费用。"
  ],
  [
    "collaborate",
    "动词 · 合作",
    "collaborate 常接 with someone 表示与谁合作，再接 on something 说明项目；不能直接把人当宾语写 collaborate someone。",
    "The two classes will collaborate on a science project.",
    "两个班将合作完成一个科学项目。",
    "She hopes to collaborate with local artists.",
    "她希望与本地艺术家合作。"
  ],
  [
    "for",
    "介词 · 代表、为某人",
    "for 可表示代表或为了某人利益而行动；这里记 on behalf of 的意思，不把 for 的时间、价格等其他用法混入同一解释。",
    "I collected the parcel for my elderly neighbor.",
    "我替年迈的邻居领了包裹。",
    "She spoke for the whole class at the meeting.",
    "她在会上代表全班发言。"
  ],
  [
    "you",
    "代词 · 你、你们",
    "you 同时用于单数和复数，作主语或宾语时形式相同；主语 you 通常搭配 are，而不是按中文人数改成 is。",
    "You are welcome to join our reading group.",
    "欢迎你加入我们的阅读小组。",
    "The coach will meet you outside the gym.",
    "教练将在体育馆外与你们见面。"
  ],
  [
    "this",
    "代词、限定词 · 这个",
    "this 指较近或当前正在谈论的单数事物，可独立作代词，也可放在单数名词前；复数通常对应 these。",
    "This is the drawing I told you about.",
    "这就是我和你说过的那幅画。",
    "Please carry this box to the kitchen.",
    "请把这个箱子搬到厨房。"
  ],
  [
    "his",
    "限定词、代词 · 他的",
    "his 放在名词前表示“他的”，也能独立表示“他的东西”；形式不因所修饰名词的单复数而改变。",
    "His bicycle is parked behind the library.",
    "他的自行车停在图书馆后面。",
    "The green notebook is his, but the ruler is mine.",
    "绿色笔记本是他的，尺子是我的。"
  ],
  [
    "will",
    "情态助动词 · 将要",
    "will 后接动词原形，可表达未来行动或当下作出的决定；第三人称单数不加 -s，也不用 will to do。",
    "The bus will leave from the east gate tomorrow.",
    "明天公共汽车将从东门出发。",
    "I will carry the heavy bag for you.",
    "我来帮你拿这个重袋子。"
  ],
  [
    "their",
    "限定词 · 他们的",
    "their 放在名词前表示所属关系；独立表示“他们的东西”通常用 theirs，不把 their 单独留在句末代替名词。",
    "Their garden is full of yellow flowers.",
    "他们的花园里满是黄花。",
    "The students put their bags under the chairs.",
    "学生们把各自的书包放在椅子下面。"
  ],
  [
    "get",
    "动词 · 得到、获得",
    "get 在此表示取得某物，可直接接名词；它还有“变得、到达”等常见义项，不能把 get 后所有内容都译成拿到。",
    "You can get a free map at the entrance.",
    "你可以在入口处领一张免费地图。",
    "I hope to get a place on the evening course.",
    "我希望能获得夜校课程的一个名额。"
  ],
  [
    "about",
    "副词 · 大约",
    "about 放在数量、时间前表示近似值，与 roughly 相近；在 about a book 中却是介词“关于”，需看后接内容。",
    "The walk takes about twenty minutes.",
    "步行大约需要二十分钟。",
    "There were about fifty chairs in the hall.",
    "大厅里大约有五十把椅子。"
  ],
  [
    "time",
    "名词 · 时间",
    "time 指可支配的时间时通常不可数，可用 have time to do；a time、three times 常表示一次或次数，是其他用法。",
    "We have enough time to visit the museum.",
    "我们有足够的时间参观博物馆。",
    "Repairing the old clock took more time than expected.",
    "修理旧钟花的时间比预想更多。"
  ],
  [
    "year",
    "名词 · 年",
    "year 是可数时间单位；last year、next year 通常不另加 in，某个具体年份前通常用 in，如 in 2025。",
    "She moved to this town last year.",
    "她去年搬到这个镇上。",
    "The project will take a year to complete.",
    "这个项目需要一年完成。"
  ],
  [
    "into",
    "介词 · 进入……里面",
    "into 体现从外到内的移动，in 通常描述已在内部的位置；但不能据此把含 movement 的所有 in 都机械改为 into。",
    "The kitten jumped into the empty basket.",
    "小猫跳进了空篮子。",
    "Pour the flour into a large bowl.",
    "把面粉倒进一个大碗。"
  ],
  [
    "then",
    "副词 · 然后、那时",
    "then 可以按时间顺序连接动作，也可回指过去或未来的某一时刻；不要与比较时使用的 than 混写。",
    "Wash the apples, then cut them into small pieces.",
    "先洗苹果，然后切成小块。",
    "The bridge was still under construction then.",
    "那时这座桥还在建设中。"
  ],
  [
    "people",
    "名词 · 人们、多人",
    "people 表示多个人时搭配复数动词，一般不再加 -s；peoples 可指多个民族，属于不同义项，不能随处替换。",
    "Several people are waiting outside the station.",
    "几个人正在车站外等候。",
    "The guide asked people to keep the path clear.",
    "导游请大家保持小路畅通。"
  ],
  [
    "him",
    "代词 · 他，作宾语",
    "him 是 he 的宾格，放在动词或介词后作宾语；作一般陈述句主语时用 he，不能只按中文“他”忽略位置。",
    "I gave him the spare key this morning.",
    "我今天早上把备用钥匙给了他。",
    "The seat beside him was empty.",
    "他旁边的座位空着。"
  ],
  [
    "good",
    "形容词 · 好的、质量高的",
    "good 可修饰名词，表示质量或表现好；修饰一般动作时通常用 well，但 feel good 等系动词结构可以用 good。",
    "A good dictionary explains words in context.",
    "一本好词典会结合语境解释词语。",
    "The soup has a good flavor without extra salt.",
    "汤不用额外加盐就很好喝。"
  ],
  [
    "how",
    "疑问副词 · 怎样",
    "how 询问方式或方法；直接问句常需助动词，间接问句用陈述语序，如 how the machine works，不能保留倒装。",
    "How do you keep these plants healthy?",
    "你怎样让这些植物保持健康？",
    "Please show me how the lock works.",
    "请给我示范这把锁怎么用。"
  ],
  [
    "any",
    "限定词 · 任何、一些",
    "any 常见于疑问和否定句，肯定句中也能表示任意一个；不要把“肯定句绝不能用 any”当成规则。",
    "Do you have any questions about the route?",
    "关于路线，你有问题吗？",
    "You may choose any seat in this row.",
    "这一排的座位你可以任选一个。"
  ],
  [
    "want",
    "动词 · 想要",
    "want 可直接接名词，也可用 want to do 表达想做某事；要求别人做某事用 want someone to do，中间要有宾语。",
    "I want to learn how to repair bicycles.",
    "我想学习修自行车。",
    "They want a quieter place for the interview.",
    "他们想要一个更安静的面试地点。"
  ],
  [
    "well",
    "副词 · 做得好",
    "well 作副词可修饰动作的完成情况，如 write well；good 多作形容词，但 well 也有表示健康的形容词用法，需看结构。",
    "The new printer works well with this laptop.",
    "新打印机与这台笔记本电脑配合良好。",
    "She explained the difficult rule very well.",
    "她把那条难懂的规则解释得很好。"
  ],
  [
    "day",
    "名词 · 一天、白天",
    "day 可以指二十四小时的一天，也可以指与夜晚相对的白天；by day 强调白天，all day 强调整天。",
    "We spent a whole day exploring the island.",
    "我们花了一整天探索这座岛。",
    "The museum is quieter early in the day.",
    "博物馆在一天较早的时候更安静。"
  ],
  [
    "here",
    "副词 · 这里",
    "here 通常直接与表示到达或停留的动词连用，如 come here、stay here；不要照搬中文加成 come to here。",
    "Please leave the empty basket here.",
    "请把空篮子留在这里。",
    "We can wait here until the rain stops.",
    "我们可以在这里等到雨停。"
  ],
  [
    "down",
    "副词 · 向下",
    "down 在此说明向较低处移动，也可配 sit、lie 表示坐下、躺下；它有多种短语用法，不能统一按方向翻译。",
    "The children climbed down carefully.",
    "孩子们小心地爬下来。",
    "Please sit down while I find the form.",
    "我找表格的时候，请先坐下。"
  ],
  [
    "back",
    "名词 · 背部",
    "back 作身体部位名词指背部；on one's back 可指仰卧，on one's belly 则是趴着，不能把身体朝向弄反。",
    "She carried the child on her back.",
    "她背着那个孩子。",
    "He lay on his back and watched the clouds.",
    "他仰卧着看云。"
  ],
  [
    "woman",
    "名词 · 成年女性",
    "woman 是单数，复数为 women，发音也变化；不能用规则复数 womans。作为名词修饰职业时也要留意实际表达习惯。",
    "The woman at the desk helped us find the room.",
    "前台的女士帮我们找到了房间。",
    "A woman in a yellow coat waved from the platform.",
    "一位穿黄大衣的女士从站台上挥手。"
  ],
  [
    "put",
    "动词 · 放置",
    "put 常用 put something somewhere，通常需要说明把东西放在哪里；过去式、过去分词仍为 put，不加 -ed。",
    "Put the clean towels on the shelf.",
    "把干净毛巾放在架子上。",
    "I put my keys in the blue bowl last night.",
    "我昨晚把钥匙放进了蓝碗。"
  ],
  [
    "world",
    "名词 · 世界",
    "world 指整个世界时常带 the；around the world 表示世界各地，in the world 表示在世界范围内，注意固定介词组合。",
    "The exhibition includes pottery from around the world.",
    "展览包括来自世界各地的陶器。",
    "People across the world watched the same event.",
    "世界各地的人观看了同一场活动。"
  ],
  [
    "where",
    "疑问副词 · 在哪里、到哪里",
    "where 询问位置或去向；作间接问句时后接陈述语序，如 where she lives，不能写成 where does she live。",
    "Where did you leave the library card?",
    "你把借书证放在哪里了？",
    "I cannot remember where the spare chairs are.",
    "我不记得备用椅子在哪里。"
  ],
  [
    "same",
    "形容词 · 相同的、同一个",
    "same 表示相同时常与 the 连用，比较对象用 the same as；不要机械套成 the same with，后者多有不同结构。",
    "We took the same bus to school.",
    "我们乘同一班公交车上学。",
    "Her answer was the same as mine.",
    "她的答案和我的相同。"
  ],
  [
    "number",
    "名词 · 数量",
    "the number of 表示……的数量，作为主语时通常接单数动词；a number of 则表示若干，后接复数名词及复数动词。",
    "The number of visitors is rising slowly.",
    "参观人数正在缓慢增加。",
    "A number of students are waiting for the next bus.",
    "有一些学生正在等下一班公交车。"
  ],
  [
    "yes",
    "副词 · 肯定回答",
    "yes 用于表示肯定、同意或接受；回答否定疑问句时，yes 通常仍肯定实际情况，不能只照中文“是的”机械判断。",
    "Yes, I can stay until the workshop ends.",
    "可以，我能留到工作坊结束。",
    "She smiled and said yes to the invitation.",
    "她微笑着接受了邀请。"
  ],
  [
    "again",
    "副词 · 再一次",
    "again 表示动作重复，可放句末；again and again 强调反复发生，不等于一直没有停顿地做同一动作。",
    "Please check the address again before sending it.",
    "寄出前请再核对一次地址。",
    "We hope to visit that little island again.",
    "我们希望再次游览那座小岛。"
  ],
  [
    "place",
    "名词 · 地点、地方",
    "place 是可数名词，可以指具体地点或适合某种用途的地方；a place to read 表示一个适合阅读的地方，后接不定式说明用途。",
    "We found a quiet place to read near the river.",
    "我们在河边找到了一个安静的阅读地点。",
    "This is the place where we first met.",
    "这就是我们初次见面的地方。"
  ],
  [
    "party",
    "名词 · 聚会",
    "party 在此指为庆祝或社交安排的聚会，是可数名词；have a party、go to a party 都常见，政治语境里的 party 则可能是政党。",
    "The neighbors organized a party in the shared garden.",
    "邻居们在公共花园里组织了一场聚会。",
    "We brought fresh fruit to the birthday party.",
    "我们带着新鲜水果参加生日聚会。"
  ],
  [
    "different",
    "形容词 · 不同的",
    "different 表示不相同；different from 广泛用于比较，也可见 different to 或 than 等地区及结构差异，不必一概判错。",
    "The two keys open different doors.",
    "这两把钥匙打开不同的门。",
    "Her new timetable is different from last year's.",
    "她的新课表与去年的不同。"
  ],
  [
    "four",
    "数词 · 四",
    "four 表示数量四，后接可数名词复数；第四是 fourth，不能用 four 直接替换普通序数词的位置。",
    "Four volunteers stayed to clean the hall.",
    "四名志愿者留下来打扫大厅。",
    "We need four small boxes for these books.",
    "这些书需要用四个小箱子装。"
  ],
  [
    "without",
    "介词 · 没有、不带",
    "without 后接名词、代词或动名词，表示缺少某物或没有做某事；如 without waiting，不能直接接动词原形。",
    "He left the classroom without his jacket.",
    "他离开教室时没有带外套。",
    "She answered without looking at her notes.",
    "她没看笔记就作出了回答。"
  ],
  [
    "play",
    "动词 · 玩耍",
    "play 表示玩耍可不带宾语，也可接 with 说明玩的物品或伙伴；play a game、play football 又是具体活动搭配。",
    "The children play outside after lunch.",
    "孩子们午饭后在外面玩。",
    "The kitten likes to play with a soft ball.",
    "小猫喜欢玩一个软球。"
  ],
  [
    "quite",
    "副词 · 相当、完全",
    "quite 的程度依语境和形容词而变；quite cold 常表示相当冷，quite certain 可表示完全确定，不能固定只译成“有一点”。",
    "The upstairs room is quite warm in the afternoon.",
    "楼上的房间下午相当暖和。",
    "I am quite certain that I locked the gate.",
    "我完全确定自己锁了大门。"
  ],
  [
    "head",
    "名词 · 头部",
    "head 指身体的头部，是可数名词；nod one's head 表示点头，shake one's head 表示摇头，注意别把动作方向记反。",
    "She lifted her head when she heard the bell.",
    "她听到铃声便抬起头。",
    "Wear a helmet to protect your head.",
    "戴上头盔保护头部。"
  ],
  [
    "write",
    "动词 · 写",
    "write 可直接接所写内容，如 write a letter；表示给某人写信可用 write to someone。过去式 wrote，过去分词 written。",
    "Write your name clearly at the top of the form.",
    "请在表格顶部清楚地写下姓名。",
    "I will write to my cousin during the holiday.",
    "假期里我会给表弟写信。"
  ],
  [
    "month",
    "名词 · 月",
    "month 是可数时间单位，复数 months；next month、last month 通常直接作时间状语，表示期间则可用 for a month。",
    "The new course begins next month.",
    "新课程下个月开始。",
    "She stayed with her aunt for a month.",
    "她在姑妈家住了一个月。"
  ],
  [
    "million",
    "数词 · 百万",
    "具体数词后的 million 不加 -s，如 two million；泛指大量时可用 millions of，不能写成 two millions people。",
    "The museum holds more than a million objects.",
    "博物馆藏有一百多万件物品。",
    "The project cost two million dollars.",
    "这个项目花了两百万美元。"
  ],
  [
    "pay",
    "动词 · 支付",
    "pay for something 表示为某物付钱，pay someone 表示付钱给某人；pay a bill 可以直接接账单，不是所有宾语前都加 for。",
    "We can pay for the tickets at the station.",
    "我们可以在车站付票款。",
    "Please pay the bill before you leave.",
    "请离开前结账。"
  ],
  [
    "money",
    "名词 · 钱",
    "money 通常不可数，数量多可说 much money 或 a lot of money；单枚硬币、单张纸币分别用 coin、note 或 bill 等。",
    "We saved enough money to repair the roof.",
    "我们攒够了修屋顶的钱。",
    "She keeps a little money in a separate pocket.",
    "她在单独的口袋里放着少量钱。"
  ],
  [
    "lot",
    "名词 · 大量，见 a lot of",
    "a lot of 可接复数可数名词或不可数名词，表达大量；a lot 单独用还可修饰动作，不能把 lot 一律当作普通可数数量单位。",
    "A lot of students borrowed books this week.",
    "这周有很多学生借书。",
    "There is a lot of dust on the old shelf.",
    "旧书架上积了很多灰。"
  ],
  [
    "job",
    "名词 · 职位、工作任务",
    "job 是可数名词，可指一份职位或一项具体任务；work 概括工作时通常不可数，不能把 a job 随意换成 a work。",
    "Her new job involves organizing school trips.",
    "她的新工作包括组织学校出游。",
    "Painting the fence is a job for two people.",
    "给篱笆刷漆是一项需要两个人完成的任务。"
  ],
  [
    "black",
    "形容词 · 黑色的",
    "black 作颜色形容词放在名词前或系动词后；它还有社会身份、情绪等义项，这里只描述物体颜色，不能脱离语境套译。",
    "She marked the route with a black pen.",
    "她用黑笔标出了路线。",
    "The cat has a white tail and black ears.",
    "这只猫有白尾巴和黑耳朵。"
  ],
  [
    "since",
    "介词 · 自某时以来",
    "since 后接起点，for 后常接一段时长；延续到现在的状态常用现在完成时，不能把 since three years 当作“三年以来”。",
    "We have lived here since September.",
    "我们从九月起就住在这里。",
    "The shop has been closed since Monday.",
    "这家店从周一以来一直关着。"
  ],
  [
    "father",
    "名词 · 父亲",
    "father 比 dad 更中性、正式一些，通常是可数名词；作家庭成员的直接称呼时可大写 Father，普通 my father 用小写。",
    "My father taught me to mend a bicycle tire.",
    "父亲教我修补自行车胎。",
    "Her father works at the village library.",
    "她父亲在村图书馆工作。"
  ],
  [
    "game",
    "名词 · 游戏、比赛",
    "game 可指有规则的游戏或一场比赛，是可数名词；a game of chess 表示一盘棋，不把所有运动训练都称为一场 game。",
    "The class invented a game to practice new words.",
    "全班设计了一个练习新词的游戏。",
    "Our final game of chess lasted almost an hour.",
    "我们最后那盘棋下了将近一小时。"
  ],
  [
    "almost",
    "副词 · 几乎、差一点",
    "almost 表示接近某个数量或状态但尚未完全达到；almost all 表示几乎全部，不能把 almost 直接当作“大多数”的限定词。",
    "The water bottle is almost empty.",
    "水瓶几乎空了。",
    "Almost all the seats were taken before noon.",
    "中午前几乎所有座位都坐满了。"
  ],
  [
    "together",
    "副词 · 一起",
    "together 可表示共同做事或物品放在同一处，通常不需要再加 with each other；具体“和谁”可由主语或 with 短语说明。",
    "We cooked dinner together after the trip.",
    "旅行后我们一起做了晚饭。",
    "Keep the matching socks together in the drawer.",
    "把配对的袜子一起放在抽屉里。"
  ],
  [
    "door",
    "名词 · 门",
    "door 指可打开、关闭的门，也可依语境指门口；knock on the door 是敲门，不把 on 机械理解成物体叠放。",
    "The wind pushed the door shut.",
    "风把门吹关了。",
    "Someone knocked on the door during the lesson.",
    "上课时有人敲门。"
  ],
  [
    "office",
    "名词 · 办公室",
    "office 可指办公房间或办公机构；in the office 强调房间内部，at the office 常强调在工作地点，不能只凭中文“在”选介词。",
    "Her office has two windows facing the square.",
    "她的办公室有两扇朝向广场的窗。",
    "Please leave the form at the school office.",
    "请把表格交到学校办公室。"
  ],
  [
    "best",
    "形容词 · 最好的",
    "best 是 good 的最高级，通常用于某个范围内的最佳选择；名词前常见 the best，但 my best friend 等已有所有格时不用再加 the。",
    "This is the best route for young cyclists.",
    "这是最适合年轻骑车者的路线。",
    "My best friend is learning to play the violin.",
    "我最好的朋友正在学拉小提琴。"
  ],
  [
    "read",
    "动词 · 阅读",
    "read 原形与过去式、过去分词拼写相同，读音却不同；可直接接书或文字，read to someone 表示读给某人听。",
    "I read the local newspaper every morning.",
    "我每天早晨读当地报纸。",
    "Please read the instructions before opening the package.",
    "拆包装前请阅读说明。"
  ],
  [
    "others",
    "代词 · 其他人或物",
    "others 可独立代替复数的人或物，后面不再接被代替的名词；若后接名词通常用 other，如 other students。",
    "Some children drew pictures while others made paper birds.",
    "有些孩子画画，另一些折纸鸟。",
    "These cups are clean; the others need washing.",
    "这些杯子是干净的，其余的需要清洗。"
  ],
  [
    "grow",
    "动词 · 生长、长大",
    "grow 可以描述植物生长、孩子长大，也可接植物作宾语表示种植；过去式 grew、过去分词 grown，不是规则变化。",
    "These flowers grow well in sandy soil.",
    "这些花在沙土中长得好。",
    "We grow tomatoes in large pots on the balcony.",
    "我们在阳台上的大花盆里种番茄。"
  ],
  [
    "walk",
    "动词 · 步行",
    "walk 表示走路，可用 walk to a place 说明目的地；walk the dog 指遛狗，是直接带宾语的常见搭配。",
    "We walk to the market every Saturday.",
    "我们每周六步行去市场。",
    "Can you walk the dog before breakfast?",
    "你能在早餐前遛狗吗？"
  ],
  [
    "age",
    "名词 · 年龄",
    "age 表示年龄，常见 at the age of 加数词；询问年龄可用 How old，不能照中文把所有年龄表达都写成 age is。",
    "She learned to swim at the age of six.",
    "她六岁时学会了游泳。",
    "The club welcomes children of any age.",
    "俱乐部欢迎任何年龄的孩子。"
  ],
  [
    "receive",
    "动词 · 收到",
    "receive 表示收到物品、消息等，不必意味着同意或接受其中的提议；accept 更强调主动接受，不能把二者在所有语境中互换。",
    "Did you receive the timetable I sent yesterday?",
    "你收到我昨天发的课表了吗？",
    "Each visitor will receive a small map.",
    "每位访客都会收到一张小地图。"
  ],
  [
    "everything",
    "代词 · 一切",
    "everything 指全部相关事物，通常搭配单数动词；后置形容词可说 everything important，不写成 important everything。",
    "Everything is ready for the evening concert.",
    "晚间音乐会的一切准备就绪。",
    "She packed everything important in a small bag.",
    "她把所有重要物品装进了一个小袋子。"
  ],
  [
    "themselves",
    "反身代词 · 他们自己",
    "themselves 可指主语所指的人自己，也能用于强调；by themselves 可以表示独自或自行完成，不能直接代替所有宾格 them。",
    "The children prepared the snacks themselves.",
    "孩子们自己准备了点心。",
    "They introduced themselves to the new coach.",
    "他们向新教练作了自我介绍。"
  ],
  [
    "wait",
    "动词 · 等待",
    "等待某人或某物通常用 wait for，后接动作常用 wait to do；不要直接套成 wait someone，服务顾客的 wait on 是另一个用法。",
    "We will wait for you beside the clock tower.",
    "我们会在钟楼旁等你。",
    "Please wait to open the envelope until everyone arrives.",
    "请等大家到齐再打开信封。"
  ],
  [
    "die",
    "动词 · 死亡",
    "die 是表示死亡发生的动词，dead 是形容词，不能把“已经死了”的状态全部写成 is die；过去式 died，进行式 dying。",
    "Plants may die if their roots stay too wet.",
    "根部长时间过湿，植物可能死亡。",
    "Many young trees die during a long drought.",
    "长时间干旱期间，许多幼树会死亡。"
  ],
  [
    "cut",
    "动词 · 切、割",
    "cut 的过去式和过去分词仍为 cut；cut something into pieces 表示把某物切成块，强调动作及结果。",
    "Cut the orange into six pieces.",
    "把橙子切成六块。",
    "We cut the paper along the dotted line.",
    "我们沿虚线剪开了纸。"
  ],
  [
    "return",
    "动词 · 返回",
    "return 表示返回时，地点前常用 to；return home 不加 to。return 已有回去的含义，通常无须再写 return back。",
    "We will return to the campsite before sunset.",
    "我们会在日落前返回营地。",
    "She hopes to return home next week.",
    "她希望下周回家。"
  ],
  [
    "either",
    "限定词、代词 · 两者之一",
    "either 常用于两个对象中的任一个；either choice 接单数名词，也可独立说 either is fine，不等于两个都必须选。",
    "You can use either entrance to reach the garden.",
    "两个入口你任选一个都能到花园。",
    "I do not mind which day; either is fine.",
    "哪天都可以，两天中任一天都行。"
  ],
  [
    "sell",
    "动词 · 出售",
    "sell 表示把东西出售给别人，结构可用 sell something to someone；过去式、过去分词都是 sold，和 buy 的方向不同。",
    "They sell fresh bread near the bus stop.",
    "他们在公交车站附近卖新鲜面包。",
    "She plans to sell her old camera to a friend.",
    "她打算把旧相机卖给一位朋友。"
  ],
  [
    "better",
    "形容词 · 更好的",
    "better 是 good 的比较级，可用 better than 比较；表示程度更高可说 much better，不要再加 more 写成 more better。",
    "The smaller room has better light for painting.",
    "较小的房间光线更适合画画。",
    "Your new plan is much better than the first one.",
    "你的新计划比第一个好多了。"
  ],
  [
    "ground",
    "名词 · 地面",
    "ground 在这里指室外的地面，常见 on the ground；floor 常指室内地板，描述场所时需按实际环境选择。",
    "The basket fell onto the wet ground.",
    "篮子掉到了湿地上。",
    "We spread a blanket on the ground for lunch.",
    "我们在地上铺了条毯子吃午饭。"
  ],
  [
    "third",
    "序数词 · 第三",
    "third 表示顺序第三，通常放在单数名词前，常见 the third floor；one third 表示三分之一，是相关但不同的数量用法。",
    "Our classroom is on the third floor.",
    "我们的教室在三楼。",
    "She finished third in the school race.",
    "她在学校赛跑中获得第三名。"
  ],
  [
    "half",
    "名词、限定词 · 一半",
    "half 表示两个相等部分中的一个；half an hour 是半小时，half of the cake 是蛋糕的一半，不能把 half 当作两份。",
    "We saved half of the cake for tomorrow.",
    "我们留下半个蛋糕明天吃。",
    "The walk takes half an hour from the station.",
    "从车站步行要半小时。"
  ],
  [
    "drive",
    "动词 · 驾驶",
    "drive 表示驾驶，可直接接车辆，也可用 drive to 表示开车去某地；过去式 drove、过去分词 driven，不用 drived。",
    "Can you drive the van to the school gate?",
    "你能把货车开到校门口吗？",
    "We will drive to the coast early tomorrow.",
    "我们明天一早将开车去海边。"
  ],
  [
    "whose",
    "疑问限定词、代词 · 谁的",
    "whose 询问所属关系，可放在名词前，也能独立使用；who's 是 who is 或 who has 的缩写，不能与 whose 混写。",
    "Whose gloves are drying beside the window?",
    "窗边晾着的是谁的手套？",
    "I found a blue scarf, but I do not know whose it is.",
    "我找到一条蓝围巾，但不知道是谁的。"
  ],
  [
    "yesterday",
    "副词、名词 · 昨天",
    "yesterday 作为时间状语通常直接使用，不加 on；也可用 yesterday morning、yesterday afternoon 表示昨天的一段时间。",
    "The parcel arrived yesterday afternoon.",
    "包裹昨天下午到了。",
    "We did not have a music lesson yesterday.",
    "我们昨天没有音乐课。"
  ],
  [
    "usually",
    "副词 · 通常",
    "usually 表示通常如此，并不表示每次都一样；一般放在实义动词前、be 动词后，句首也可用于强调习惯。",
    "We usually eat lunch in the courtyard.",
    "我们通常在庭院里吃午饭。",
    "The library is usually quiet before nine.",
    "图书馆九点前通常很安静。"
  ],
  [
    "star",
    "名词 · 星星、恒星",
    "star 可以指夜空可见的星，也可严格指恒星；日常所称的“星”未必都属于天文学上的恒星，需区别表达精度。",
    "A bright star appeared above the dark roof.",
    "漆黑屋顶上方出现了一颗亮星。",
    "The child drew a star beside the moon.",
    "孩子在月亮旁画了一颗星星。"
  ],
  [
    "bed",
    "名词 · 床",
    "bed 指床这种家具时可数；go to bed、in bed 常强调就寝或卧床，on the bed 更强调在床的表面。",
    "I left the folded blanket on the bed.",
    "我把叠好的毯子放在床上。",
    "She went to bed early before the long journey.",
    "长途旅行前，她早早就寝了。"
  ],
  [
    "single",
    "形容词 · 单个的",
    "single 在此强调只有一个，可用于 a single ticket、a single flower 等；婚姻状态中的 single 是另一义项。",
    "A single lamp lit the narrow hallway.",
    "一盏灯照亮了狭窄走廊。",
    "There was not a single empty seat in the hall.",
    "大厅里一个空座都没有。"
  ],
  [
    "date",
    "名词 · 日期",
    "date 在此指日历上的某一天或某事发生的时间，常用 the date of；它还有约会、椰枣等义项，要按搭配区分。",
    "Please write the date at the top of each page.",
    "请在每页顶部写上日期。",
    "We have not chosen a date for the picnic.",
    "我们还没选定野餐日期。"
  ],
  [
    "north",
    "名词、副词 · 北、向北",
    "north 作方向副词可直接跟在 go、travel 后；the north of 表示某地北部，north of 表示在某地以北，范围关系不同。",
    "The road runs north toward the mountains.",
    "道路向北通往群山。",
    "Their village lies north of the river.",
    "他们的村庄在河流以北。"
  ],
  [
    "herself",
    "反身代词 · 她自己",
    "herself 指回主语中的她，或用于强调本人；by herself 可表示独自、自行，不能一般地替换宾格 her。",
    "She made the wooden frame herself.",
    "她自己制作了那个木框。",
    "Mia introduced herself to the visiting students.",
    "米娅向来访学生介绍了自己。"
  ],
  [
    "film",
    "名词 · 电影",
    "film 作电影解时通常可数，英式尤其常见；电影这种艺术总体也可不可数。film 的薄膜、胶片义不能套到观影语境。",
    "The film tells the story of a young inventor.",
    "电影讲述了一位年轻发明家的故事。",
    "We watched a short film about migrating birds.",
    "我们看了一部关于候鸟的短片。"
  ],
  [
    "nearly",
    "副词 · 几乎、差不多",
    "nearly 表示接近但尚未达到，常用于数字、时间和完成程度；与 almost 常相近，但不是在所有固定表达中都能替换。",
    "The museum is nearly a hundred years old.",
    "博物馆已有近百年历史。",
    "We had nearly finished when the lights went out.",
    "我们快做完时，灯灭了。"
  ],
  [
    "twenty",
    "数词 · 二十",
    "twenty 表示二十，拼写结尾为 -ty；twentieth 是第二十，twenty-one 等复合数词中间通常加连字符。",
    "Twenty students joined the afternoon workshop.",
    "二十名学生参加了下午的工作坊。",
    "We waited twenty minutes for the ferry.",
    "我们等渡轮等了二十分钟。"
  ],
  [
    "summer",
    "名词 · 夏季",
    "summer 指夏季，季节具体月份随地区而异；in summer 泛指夏天，this summer、last summer 作时间状语时通常不加 in。",
    "The river is shallow in summer.",
    "这条河夏季水浅。",
    "We plan to repair the garden wall this summer.",
    "我们打算今年夏天修花园围墙。"
  ],
  [
    "husband",
    "名词 · 丈夫",
    "husband 指婚姻中的男性配偶，是可数名词，常用 her husband、my husband 等表示关系；不要与泛指男性的 man 混为同义。",
    "Her husband works in a small publishing company.",
    "她丈夫在一家小出版社工作。",
    "She and her husband planted the trees together.",
    "她和丈夫一起种下了那些树。"
  ],
  [
    "floor",
    "名词 · 地板",
    "floor 在此指房间内的地面，常见 on the floor；它也可指楼层，但一块地板与一个楼层的数量概念不同。",
    "Sunlight formed a bright square on the floor.",
    "阳光在地板上投下一块明亮的方形。",
    "Please wipe the water off the kitchen floor.",
    "请擦去厨房地板上的水。"
  ],
  [
    "animal",
    "名词 · 动物",
    "animal 日常可用来指人以外的动物，也有包括人类在内的科学分类用法；此处先记普通动物，不能把它仅限于宠物。",
    "We found an animal track beside the stream.",
    "我们在溪边发现了动物足迹。",
    "Each child chose an animal to draw.",
    "每个孩子选了一种动物来画。"
  ],
  [
    "page",
    "名词 · 页",
    "page 指书、文稿的一页，也可指网页；on page ten 表示在第十页，翻到某页可用 turn to page ten。",
    "The answer is on the last page.",
    "答案在最后一页。",
    "Please turn to page twelve and read the title.",
    "请翻到第十二页，读一下标题。"
  ],
  [
    "west",
    "名词、副词 · 西、向西",
    "west 作副词可以说明向西移动；the west of 指某地的西部，west of 指在某地以西，不能忽略有没有 the。",
    "The path turns west beyond the bridge.",
    "小路过桥后转向西。",
    "The airport is west of the city center.",
    "机场在市中心以西。"
  ],
  [
    "rest",
    "名词 · 休息",
    "rest 表示停止活动、恢复精力的休息，可用 get some rest、have a rest；the rest of 表示其余部分，是另一个义项。",
    "You need some rest after the long walk.",
    "长途步行后你需要休息。",
    "We stopped for a short rest under the trees.",
    "我们停在树下稍作休息。"
  ],
  [
    "past",
    "形容词 · 过去的",
    "past 作形容词描述已经过去的时间，常见 the past week；不要与动词 pass 的过去式 passed 混写，二者结构不同。",
    "The past week has been unusually busy.",
    "过去这一周格外忙碌。",
    "We learned about village life in past centuries.",
    "我们了解了过去几个世纪的村庄生活。"
  ],
  [
    "size",
    "名词 · 大小、尺码",
    "size 可指物体尺寸或衣物尺码；the size of 表示……的大小，What size 表示询问尺码，不能只按长短理解。",
    "The size of the room surprised us.",
    "房间的大小让我们吃惊。",
    "What size jacket do you usually wear?",
    "你通常穿多大码的夹克？"
  ],
  [
    "note",
    "动词 · 留意、记下",
    "note 作动词可直接接需注意的事项，也可接 that 从句；它不只是名词“笔记”，读句子时要看所在位置。",
    "Please note the change in the meeting time.",
    "请留意会议时间的变更。",
    "Note that the museum is closed on Tuesdays.",
    "请注意，博物馆周二闭馆。"
  ],
  [
    "hotel",
    "名词 · 旅馆、酒店",
    "hotel 指向客人提供住宿等服务的营业场所，是可数名词；stay at a hotel、book a hotel room 都常见。",
    "The hotel lent us umbrellas for the walk.",
    "酒店借给我们雨伞供步行时使用。",
    "We booked a small hotel near the harbor.",
    "我们订了港口附近的一家小旅馆。"
  ],
  [
    "village",
    "名词 · 村庄",
    "village 通常指比城镇小的聚居地，是可数名词；不同国家行政划分不完全相同，不能把规模描述当成通用法律定义。",
    "The village has one school and two small shops.",
    "村里有一所学校和两家小店。",
    "A narrow road links the village to the coast.",
    "一条窄路把村庄和海岸连在一起。"
  ],
  [
    "nice",
    "形容词 · 令人愉快的",
    "nice 是较宽泛的积极评价，可形容人友善或体验愉快；需要精确描述时可另用具体形容词，不把所有“好”都只译为 nice。",
    "We had a nice walk along the canal.",
    "我们沿运河愉快地散了步。",
    "It was nice of you to save me a seat.",
    "你给我留了座位，真体贴。"
  ],
  [
    "machine",
    "名词 · 机器",
    "machine 是可数名词，指完成任务的机械、电气等设备；machinery 常作不可数集合词，不能简单当 machine 的规则复数。",
    "The machine folds the paper into neat packets.",
    "机器把纸折成整齐的小包。",
    "Please switch off the machine before cleaning it.",
    "清洁机器前请先关机。"
  ],
  [
    "whom",
    "代词 · 谁，作宾语",
    "whom 用于宾语位置，尤其见于正式写作和介词后；口语常用 who，但不能因此把正式的 to whom 当成错误。",
    "To whom should I send the completed form?",
    "填好的表格该寄给谁？",
    "The researcher whom we met explained the experiment.",
    "我们见到的那位研究者讲解了实验。"
  ],
  [
    "everybody",
    "代词 · 每个人",
    "everybody 表示所有相关的人，语法上通常接单数动词；虽然意义涉及多人，也不能直接用 everybody are。",
    "Everybody is ready to leave the classroom.",
    "大家都准备好离开教室了。",
    "Please make sure everybody has a copy of the map.",
    "请确保每个人都有一份地图。"
  ],
  [
    "blue",
    "形容词 · 蓝色的",
    "blue 描述颜色时可在名词前或系动词后使用，light blue、dark blue 表示浅蓝、深蓝；情绪低落是另一义项。",
    "She painted the wooden box blue.",
    "她把木盒涂成蓝色。",
    "A blue scarf hung beside the front door.",
    "前门旁挂着一条蓝围巾。"
  ],
  [
    "song",
    "名词 · 歌曲",
    "song 指带有词和旋律的歌曲，是可数名词；sing a song 是唱歌，不把所有纯器乐曲都直接称作 song。",
    "The class learned a song about the seasons.",
    "全班学了一首关于季节的歌。",
    "Her favorite song begins with a gentle piano melody.",
    "她最喜欢的歌以轻柔的钢琴旋律开头。"
  ],
  [
    "guess",
    "动词 · 猜测",
    "guess 表示根据不充分证据作判断，可接名词或疑问从句；I guess 也可缓和说法，不一定表示在玩猜谜游戏。",
    "Can you guess the weight of this pumpkin?",
    "你能猜猜这个南瓜的重量吗？",
    "I had to guess which key opened the cupboard.",
    "我只能猜哪把钥匙能打开柜子。"
  ],
  [
    "sun",
    "名词 · 太阳、阳光",
    "sun 指我们所见的太阳时通常用 the sun，也能指阳光；in the sun 是在阳光下，不是进入太阳内部。",
    "The sun disappeared behind a thick cloud.",
    "太阳躲到厚云后面。",
    "We left the wet shoes in the sun to dry.",
    "我们把湿鞋放在阳光下晾干。"
  ],
  [
    "ball",
    "名词 · 球",
    "ball 在运动、游戏中指球，是可数名词；throw、catch、kick a ball 分别是扔、接、踢球，动作搭配需要一起记。",
    "The ball rolled beneath the parked bicycle.",
    "球滚到了停着的自行车下面。",
    "She caught the ball with both hands.",
    "她双手接住了球。"
  ],
  [
    "weight",
    "名词 · 重量",
    "weight 是名词，weigh 是动词；the weight of 表示……的重量，不能把询问重量的句子写成 How much does it weight。",
    "The label shows the weight of the empty box.",
    "标签上标着空箱重量。",
    "Check the weight before carrying the parcel upstairs.",
    "把包裹搬上楼前先看看重量。"
  ],
  [
    "worry",
    "动词 · 担心",
    "worry about 表示为某人或某事担心；worry someone 则表示使某人担心，注意主语和宾语所承担的角色。",
    "Do not worry about the missing pencil.",
    "别为那支丢失的铅笔担心。",
    "The long silence began to worry her parents.",
    "长时间没有消息让她父母开始担心。"
  ],
  [
    "trouble",
    "名词 · 麻烦、困难",
    "trouble 泛指困难时常不可数，have trouble doing something 表示做某事有困难；不能照中文加成 have a trouble to do。",
    "I had trouble finding the correct entrance.",
    "我找正确入口时遇到了困难。",
    "The sudden storm caused trouble for the ferry service.",
    "突如其来的暴风雨给渡轮运营带来了麻烦。"
  ],
  [
    "middle",
    "名词 · 中间",
    "middle 指位置或时段的中部，常用 in the middle of；它强调在两端之间，不表示一切场景都恰好是数学中心点。",
    "A large table stood in the middle of the room.",
    "房间中间摆着一张大桌子。",
    "We stopped in the middle of the lesson for a break.",
    "课程中途我们停下来休息。"
  ],
  [
    "somebody",
    "代词 · 某人",
    "somebody 表示身份未具体说明的某个人，通常搭配单数动词；形容词放在后面，如 somebody new，不放在前面。",
    "Somebody has left a coat on the bus.",
    "有人把外套落在了公交车上。",
    "The club hopes to invite somebody new to lead the walk.",
    "俱乐部希望邀请一位新成员带领步行活动。"
  ],
  [
    "thirty",
    "数词 · 三十",
    "thirty 表示三十，thirteen 是十三，拼写及重音都要区分；表示三十岁可用 thirty years old，而不是 thirty year old 单独结尾。",
    "Thirty chairs were arranged around the long table.",
    "长桌周围摆了三十把椅子。",
    "The next bus leaves in thirty minutes.",
    "下一班公共汽车三十分钟后出发。"
  ],
  [
    "ahead",
    "副词 · 前方、提前",
    "ahead 可表示在前方或比计划提前；ahead of 后可接比较对象，plan ahead 则强调提前规划，不必另加 future。",
    "The path ahead looks narrow but safe.",
    "前方的小路看着窄，但很安全。",
    "We finished the display ahead of schedule.",
    "我们提前完成了展陈布置。"
  ],
  [
    "kitchen",
    "名词 · 厨房",
    "kitchen 指配有做饭设施的空间，是可数名词；in the kitchen 是在厨房内，kitchen table 等组合中用来说明用途或位置。",
    "Warm light came from the kitchen window.",
    "温暖的灯光从厨房窗户里透出来。",
    "We gathered in the kitchen to make dumplings.",
    "我们聚在厨房包饺子。"
  ],
  [
    "none",
    "代词 · 一个也没有",
    "none 表示没有任何一个或没有任何部分，可用 none of 加具体范围；单复数动词取决于所指对象和语境，不能一律只配单数。",
    "None of the milk was left after breakfast.",
    "早餐后牛奶一点也没剩。",
    "We checked several keys, but none would turn the lock.",
    "我们试了几把钥匙，但没有一把能转动锁。"
  ],
  [
    "wind",
    "名词 · 风",
    "wind 表示空气流动时通常读音与 pinned 押韵；动词“缠绕”的 wind 读音不同。a strong wind 可指一阵强风。",
    "The wind carried the sound of bells across the field.",
    "风把钟声带过田野。",
    "A strong wind shook the young trees.",
    "一阵强风摇动着幼树。"
  ],
  [
    "corner",
    "名词 · 角落、拐角",
    "corner 可指物体的角、房间角落或街道交会处；in the corner 强调空间内部角落，at the corner 常说街角。",
    "A small desk fits in the corner of the room.",
    "房间角落能放下一张小书桌。",
    "We waited at the corner near the bakery.",
    "我们在面包店附近的街角等候。"
  ],
  [
    "restaurant",
    "名词 · 餐馆",
    "restaurant 指供应餐食供人购买的场所，是可数名词；eat at a restaurant 强调在那里用餐，不能与只表示食物的 meal 混用。",
    "The restaurant serves soup made with local vegetables.",
    "这家餐馆供应用当地蔬菜熬的汤。",
    "We chose a quiet restaurant beside the harbor.",
    "我们选了港口旁一家安静的餐馆。"
  ],
  [
    "hill",
    "名词 · 小山、山丘",
    "hill 通常比 mountain 低矮，但日常命名没有全世界统一的严格高度界线；up the hill、down the hill 表示沿山坡上下。",
    "A narrow path leads up the hill.",
    "一条窄路通向山顶。",
    "From the hill, we could see the whole village.",
    "从小山上，我们能看见整个村庄。"
  ],
  [
    "plane",
    "名词 · 飞机",
    "plane 可作为 airplane 的常见简称，是可数名词；by plane 表示交通方式，on the plane 表示在某架飞机上。",
    "The plane landed shortly before sunset.",
    "飞机在日落前不久降落。",
    "She left her notebook on the plane.",
    "她把笔记本落在飞机上了。"
  ],
  [
    "perfect",
    "形容词 · 完美的、无瑕的",
    "perfect 强调没有缺点或完全符合要求；perfect for 可表示特别适合某用途，不是所有语境都要译成外观完美。",
    "The drawing is not perfect, but it shows real progress.",
    "这幅画并不完美，但展现了实实在在的进步。",
    "This quiet room is perfect for recording the story.",
    "这间安静的房间特别适合录故事。"
  ],
  [
    "ship",
    "名词 · 海船",
    "ship 作名词常指海上大型船只，是可数名词；boat 通常较小，但实际命名有习惯差异，不按长度设绝对界线。",
    "The ship carried fruit from the island to the mainland.",
    "海船把水果从岛上运往大陆。",
    "We watched a ship disappear beyond the harbor.",
    "我们看着一艘船驶出港口，消失在远处。"
  ],
  [
    "ice",
    "名词 · 冰",
    "ice 指冰这种物质时通常不可数；a piece of ice、an ice cube 可明确一块冰，不能只照中文“一块”写成 an ice。",
    "A thin layer of ice covered the pond.",
    "池塘上结了一层薄冰。",
    "She added a little ice to the fruit juice.",
    "她往果汁里加了少量冰。"
  ],
  [
    "telephone",
    "名词 · 电话设备",
    "telephone 作名词表示电话设备，phone 是更常见的简短说法；on the telephone 可指正在通话，而不只是物理上在电话旁。",
    "The telephone rang just as we began lunch.",
    "我们刚开始吃午饭，电话就响了。",
    "An old telephone stood beside the visitor book.",
    "访客登记簿旁放着一部旧电话。"
  ],
  [
    "cry",
    "动词 · 哭泣",
    "cry 表示流泪哭泣时通常不及物；cry out 可表示喊叫，cry 后的具体结构决定含义，不能把所有 cry 都理解为伤心。",
    "The little child began to cry when the balloon burst.",
    "气球爆了，小孩哭了起来。",
    "It is all right to cry when you feel upset.",
    "难过时哭出来也没关系。"
  ],
  [
    "entirely",
    "副词 · 完全地",
    "entirely 强调完整程度，可修饰形容词、动词等；not entirely 表示并非完全如此，不能把它读成 entirely not 的绝对否定。",
    "The task was not entirely finished when we arrived.",
    "我们到达时，任务还没有完全完成。",
    "The two reports describe entirely different events.",
    "两份报告描述的是完全不同的事件。"
  ],
  [
    "anybody",
    "代词 · 任何人、有人",
    "anybody 与 anyone 常近义，常用于疑问、否定或表示任意人；通常搭配单数动词，形容词放后，如 anybody else。",
    "Does anybody know where the spare key is?",
    "有人知道备用钥匙在哪里吗？",
    "Anybody can join the workshop without special equipment.",
    "任何人都能参加工作坊，不需要专用设备。"
  ],
  [
    "twice",
    "副词 · 两次、两倍",
    "twice 可表示次数两次，也可表示数量或程度为两倍；twice a week 是每周两次，twice as long 是长度或时长的两倍。",
    "We check the classroom plants twice a week.",
    "我们每周检查教室里的植物两次。",
    "The new shelf is twice as long as the old one.",
    "新架子的长度是旧架子的两倍。"
  ],
  [
    "football",
    "名词 · 足球类运动",
    "football 在英式英语中通常指足球，美式通常指美式橄榄球；需要明确英式足球时可用 soccer，不能脱离地区一律解释。",
    "We play football on the field behind the school.",
    "我们在学校后面的球场踢足球。",
    "The British visitor talked about his favorite football team.",
    "那位英国访客谈起他最喜欢的足球队。"
  ],
  [
    "equally",
    "副词 · 同等地、平均地",
    "equally 可说明程度相同，也可说明分配平均；divide equally 表示均分，而 equally important 表示同样重要，留意修饰对象。",
    "The children shared the fruit equally.",
    "孩子们平均分了水果。",
    "Both routes are equally safe in daylight.",
    "这两条路线在白天同样安全。"
  ],
  [
    "twelve",
    "数词 · 十二",
    "twelve 表示十二，twelfth 是第十二，复合数词及序数词拼写有差别；数十二个物品时后接可数名词复数。",
    "Twelve guests signed the visitor book.",
    "十二位来宾在访客簿上签了名。",
    "The old clock struck twelve as we arrived.",
    "我们到达时，老钟敲响了十二点。"
  ],
  [
    "medicine",
    "名词 · 药物",
    "medicine 泛指药物时通常不可数，a medicine 可指一种药；take medicine 表示服药，不按中文“吃药”写成 eat medicine。",
    "The nurse put the medicine in a locked cupboard.",
    "护士把药物放进锁着的柜子。",
    "Please read the label before taking the medicine.",
    "服药前请阅读标签。"
  ],
  [
    "factory",
    "名词 · 工厂",
    "factory 指制造物品的建筑或场所，是可数名词；factory workers 表示工厂工人，factory 作名词修饰语时通常用单数形式。",
    "The factory makes reusable glass bottles.",
    "这家工厂生产可重复使用的玻璃瓶。",
    "A former factory now houses the town museum.",
    "一座旧工厂如今成了镇博物馆。"
  ],
  [
    "map",
    "名词 · 地图",
    "map 指展示地区位置、路线等的图，是可数名词；on the map 表示地图上，a map of the island 说明地图所描绘的范围。",
    "She marked the campsite on the map.",
    "她在地图上标出了营地。",
    "The guide handed us a map of the island.",
    "导游递给我们一张岛屿地图。"
  ],
  [
    "fat",
    "名词 · 脂肪",
    "fat 作名词可指食物或身体中的脂肪，泛指时通常不可数；也可作形容词，描述人时应留意语气与场合。",
    "A thin layer of fat floated on the soup.",
    "汤面上浮着一层薄薄的油脂。",
    "The label lists the amount of fat in each serving.",
    "标签列出了每份食物的脂肪含量。"
  ],
  [
    "noise",
    "名词 · 噪声、响声",
    "noise 泛指不需要的声响时常不可数，一种或一次具体声音可用 a noise；sound 比 noise 更中性，不必都有干扰意味。",
    "The noise from the road kept us awake.",
    "道路上传来的噪声让我们无法入睡。",
    "We heard a strange noise behind the cupboard.",
    "我们听到柜子后面传来奇怪的响声。"
  ],
  [
    "gate",
    "名词 · 大门、闸门",
    "gate 常指围墙、栅栏等处的出入口或关闭装置；door 更常指建筑或房间的门，二者不能在所有场景中随意互换。",
    "Please close the garden gate after you enter.",
    "进来后请关上花园大门。",
    "The bus stops outside the main gate.",
    "公共汽车停在正门外。"
  ],
  [
    "neither",
    "限定词、代词 · 两者都不",
    "neither 表示两个对象均不符合；neither answer 接单数名词，neither of 后可接复数范围。不要与 either 的任一个含义混淆。",
    "Neither answer explains why the lamp stopped working.",
    "两个答案都没解释灯为何不亮。",
    "Neither of the keys fits this lock.",
    "两把钥匙都不适合这把锁。"
  ],
  [
    "tooth",
    "名词 · 牙齿",
    "tooth 的复数是 teeth，不是 tooths；单颗牙常用 a tooth，brush one's teeth 通常用复数表示刷牙。",
    "The child proudly showed me a loose tooth.",
    "孩子自豪地让我看一颗松动的牙。",
    "The dentist checked each tooth carefully.",
    "牙医仔细检查了每颗牙。"
  ],
  [
    "wake",
    "动词 · 醒来、叫醒",
    "wake 可不及物表示醒来，也可接人表示叫醒；wake up 常见。过去式 woke、过去分词 woken，另有规则词形但此处先记常见形式。",
    "I often wake before the alarm rings.",
    "我常在闹钟响之前醒来。",
    "Please do not wake the baby while moving the chairs.",
    "搬椅子时请不要吵醒婴儿。"
  ],
  [
    "shirt",
    "名词 · 衬衫、上衣",
    "shirt 常指有领有袖的衬衫，也见于 T-shirt 等名称；普通 shirt 是可数名词，不泛指外套、毛衣等全部衣物。",
    "His shirt has a small pocket on the front.",
    "他的衬衫前面有一个小口袋。",
    "She hung the clean shirt beside the window.",
    "她把洗净的衬衫挂在窗边。"
  ],
  [
    "meat",
    "名词 · 肉类食物",
    "meat 泛指供食用的肉时通常不可数；a piece of meat 是一块肉，meats 可指不同种类，不能把每一小块都按复数 meats 数。",
    "The dish contains vegetables but no meat.",
    "这道菜有蔬菜，但没有肉。",
    "The chef sliced the meat into thin strips.",
    "厨师把肉切成了细条。"
  ],
  [
    "except",
    "介词 · 除……之外",
    "except 表示从整体中排除某人或某物；besides 通常强调在已提内容之外再包括，二者的包含关系不同。",
    "The shop opens every day except Sunday.",
    "商店除周日外每天营业。",
    "Everyone except Leo had brought a raincoat.",
    "除利奥外，每个人都带了雨衣。"
  ],
  [
    "milk",
    "名词 · 奶",
    "milk 指奶这种饮品时通常不可数；a glass of milk 说明一杯，不能把一杯奶直接按一般数量写成 a milk，点单省略另论。",
    "She poured warm milk into the small cup.",
    "她把温牛奶倒进小杯子。",
    "The recipe uses milk instead of water.",
    "这个配方用牛奶代替水。"
  ],
  [
    "vegetable",
    "名词 · 蔬菜",
    "vegetable 通常是可数名词，泛指多种蔬菜常用 vegetables；分类上的植物果实和日常烹饪中的蔬菜称呼可能不同。",
    "A carrot is a vegetable that grows underground.",
    "胡萝卜是一种长在地下的蔬菜。",
    "Choose one vegetable to add to the soup.",
    "选一种蔬菜加进汤里。"
  ],
  [
    "ninety",
    "数词 · 九十",
    "ninety 表示九十，nineteen 是十九；末尾 -ty 与 -teen 容易混写，后接可数物品通常用复数名词。",
    "The hall can hold ninety people.",
    "大厅能容纳九十人。",
    "The journey takes about ninety minutes by train.",
    "坐火车全程大约需要九十分钟。"
  ],
  [
    "assistance",
    "名词 · 帮助、协助",
    "assistance 是较正式的帮助说法，通常不可数，常见 ask for assistance、with someone's assistance；不要在泛指帮助时写 an assistance。",
    "Visitors can ask for assistance at the front desk.",
    "访客可以向前台寻求帮助。",
    "With her assistance, we repaired the wooden frame.",
    "在她协助下，我们修好了木框。"
  ],
  [
    "yours",
    "物主代词 · 你的、你们的东西",
    "yours 可独立代替所属物，后面不再接名词；your 放在名词前，yours 没有表示所有格的撇号，不写成 your's。",
    "The red umbrella is yours, and the green one is mine.",
    "红伞是你的，绿伞是我的。",
    "Is this notebook yours or Sam's?",
    "这本笔记本是你的还是萨姆的？"
  ],
  [
    "part",
    "名词 · 部分",
    "part 指整体中的一部分，可用 part of 加整体；a part of 强调其中一个部分，并不是所有语境都要求 a。",
    "The glass roof is part of the original design.",
    "玻璃屋顶是原设计的一部分。",
    "This part of the river is too shallow for boats.",
    "这段河水太浅，船无法通行。"
  ],
  [
    "against",
    "介词 · 反对、对抗",
    "against 可以表示反对意见或与对手竞争，后接名词或动名词；支持常用 for，不能把 against 与同样涉及接触的其他义项混在一起。",
    "They voted against closing the small library.",
    "他们投票反对关闭小图书馆。",
    "Our team will play against the visitors tomorrow.",
    "我们队明天将与客队比赛。"
  ],
  [
    "happen",
    "动词 · 发生",
    "happen 表示事件发生，通常不及物；what happened to someone 表示某人出了什么事，一般不写成某事件 was happened。",
    "Accidents can happen when the floor is wet.",
    "地板湿时可能发生意外。",
    "What will happen to the old school building?",
    "旧校舍接下来会怎么样？"
  ],
  [
    "oil",
    "名词 · 油",
    "oil 泛指油类液体时通常不可数，可用 a little oil；具体哪种油由 cooking、olive 等限定，不能一律理解成石油。",
    "Heat a little oil before adding the onions.",
    "放洋葱前先热少量油。",
    "A drop of oil helped the rusty hinge move.",
    "一滴油让生锈的铰链转动起来。"
  ],
  [
    "attention",
    "名词 · 注意力",
    "attention 通常不可数，pay attention to 表示注意，to 后可接名词或动名词；不要按动词原形误写成 pay attention to check。",
    "Please pay attention to the warning signs.",
    "请注意警示标牌。",
    "The moving shadow caught the cat's attention.",
    "移动的影子引起了猫的注意。"
  ],
  [
    "artist",
    "名词 · 艺术家",
    "artist 指从事艺术创作的人，范围可包括绘画、雕塑、音乐等；不能在没有语境时仅译成画家，也不同于普通技术工人。",
    "The artist made a sculpture from fallen branches.",
    "艺术家用掉落的树枝做了一座雕塑。",
    "A local artist designed the festival poster.",
    "一位本地艺术家设计了节庆海报。"
  ],
  [
    "lady",
    "名词 · 女士",
    "lady 可作为女性的礼貌称呼，但语气及适用性依场合而变；作为职业修饰语并非总需要，不能把它当作 woman 的无条件正式替换。",
    "The lady beside the window asked for directions.",
    "窗边那位女士问了路。",
    "An elderly lady showed us the path to the church.",
    "一位年长女士给我们指了去教堂的路。"
  ],
  [
    "argument",
    "名词 · 论证、争论",
    "argument 既能指支持观点的理由，也能指争吵；an argument for something 是支持某事的论据，an argument with someone 常指与某人争执。",
    "Her argument for a later start was convincing.",
    "她支持推迟开始的理由很有说服力。",
    "The neighbors had an argument about the fence.",
    "邻居们为篱笆的事发生了争执。"
  ],
  [
    "huge",
    "形容词 · 巨大的",
    "huge 表示尺寸、数量或程度非常大，常比普通 big 语气强；不必仅用于物理体积，也可说 a huge difference。",
    "A huge tree shades the school entrance.",
    "一棵大树为校门入口遮阴。",
    "The new timetable made a huge difference to our mornings.",
    "新课表让我们的早晨发生了很大变化。"
  ],
  [
    "okay",
    "形容词 · 可以的、尚好的",
    "okay 常用于非正式语境，表示可以、无碍或尚可；评价质量时不一定达到 excellent 的程度，不能一律译为特别好。",
    "Is it okay to leave our bags here?",
    "把包留在这里可以吗？",
    "The first drawing was okay, but the second was clearer.",
    "第一幅画还可以，第二幅更清楚。"
  ],
  [
    "arrangement",
    "名词 · 布置、安排方式",
    "arrangement 可指物品的布局，也可指活动安排；这里限定可见的排列方式，arrangements 复数常用于具体筹备事项。",
    "The arrangement of chairs left a wide central aisle.",
    "椅子的排列方式留出了一条宽阔的中央通道。",
    "She changed the arrangement of flowers in the vase.",
    "她调整了花瓶里花枝的摆放。"
  ],
  [
    "dozen",
    "名词、数词用法 · 十二个",
    "a dozen 表示十二个；具体数量后 dozen 通常不加 -s，如 two dozen eggs，dozens of 则泛指很多。",
    "We bought a dozen eggs at the market.",
    "我们在市场买了十二个鸡蛋。",
    "The class folded two dozen paper cranes.",
    "全班折了二十四只纸鹤。"
  ],
  [
    "gold",
    "名词 · 黄金",
    "gold 指金这种金属时通常不可数，也可修饰物品说明材质；golden 常描述金色或带金色特征，不必都说明由黄金制成。",
    "The ring is made of gold.",
    "这枚戒指由黄金制成。",
    "The exhibition explains how gold was used in ancient jewelry.",
    "展览介绍了黄金如何用于古代首饰。"
  ],
  [
    "actual",
    "形容词 · 实际的",
    "actual 强调真实存在或实际发生，与想象、估计相区别；它通常不表示“目前的”，目前的可按语境用 current。",
    "The actual cost was lower than our first estimate.",
    "实际费用比最初估计低。",
    "The model is smaller than the actual bridge.",
    "模型比真实的桥小。"
  ],
  [
    "actor",
    "名词 · 演员",
    "actor 指在戏剧、影视等作品中表演的人，可用于不同性别的演员；actress 专指女演员，使用取决于当事人及语境。",
    "The actor practiced the speech beside the stage.",
    "演员在舞台旁练习台词。",
    "A young actor played the village teacher in the film.",
    "一位年轻演员在电影中饰演乡村教师。"
  ],
  [
    "favorite",
    "形容词、名词 · 最喜欢的",
    "favorite 是美式常见拼写，英式常写 favourite；my favorite book 表示最喜欢的书，也可独立说 my favorite，后面不必再带名词。",
    "Her favorite place to read is the balcony.",
    "她最喜欢的阅读地点是阳台。",
    "Of all the soups, this one is my favorite.",
    "在所有汤里，这一种是我最喜欢的。"
  ],
  [
    "mix",
    "动词 · 混合",
    "mix 可直接接被混合的物品，mix A with B 表示把两者混合；mix up 还可表示弄混，不能把所有带 up 的结构当成搅拌。",
    "Mix the flour with a little warm water.",
    "把面粉和少量温水混合。",
    "Do not mix clean towels with dirty clothes.",
    "不要把干净毛巾与脏衣服混在一起。"
  ],
  [
    "aside",
    "副词 · 到一旁",
    "aside 表示移到旁边，也可用于 set aside 表示留存备用；单独的 aside 不是 beside 的直接替换，后面通常不直接接地点名词。",
    "She stepped aside to let the visitors pass.",
    "她走到一旁让访客通过。",
    "We set aside a little money for repairs.",
    "我们留出少量钱用于维修。"
  ],
  [
    "eighty",
    "数词 · 八十",
    "eighty 表示八十，eighteen 是十八；注意 eighty 里没有第二个 t。数物品时用 eighty 加复数可数名词。",
    "Eighty seedlings were ready to plant.",
    "八十株幼苗已准备好栽种。",
    "The old road is eighty kilometers long.",
    "那条旧路长八十千米。"
  ],
  [
    "licence",
    "名词 · 许可证",
    "licence 是英式英语中许可证这一名词的常见拼写，美式通常写 license；此处表示正式许可的文件，不是个人随意作出的承诺。",
    "Her driving licence was inside the blue wallet.",
    "她的驾驶执照在蓝钱包里。",
    "The restaurant applied for a new licence.",
    "餐馆申请了一份新许可证。"
  ],
  [
    "dear",
    "形容词 · 亲爱的、珍爱的",
    "dear 可指深受珍爱的人或事物，也常用于信件开头 Dear；a dear friend 强调亲近，不是说这位朋友价格贵。",
    "She kept a photograph of a dear friend in her bag.",
    "她包里留着一位亲密朋友的照片。",
    "Dear Maya, thank you for showing us the garden.",
    "亲爱的玛雅，谢谢你带我们参观花园。"
  ],
  [
    "advertising",
    "名词 · 广告宣传",
    "advertising 指广告宣传活动、行业或广告总体，通常不可数；一则具体广告可用 an advertisement，不写 an advertising。",
    "The shop spends very little on advertising.",
    "这家店在广告宣传上花费很少。",
    "She works in advertising and designs posters.",
    "她从事广告行业，负责设计海报。"
  ],
  [
    "stairs",
    "复数名词 · 楼梯",
    "stairs 通常指一段楼梯，使用复数形式，常见 go up the stairs；单级台阶可用 a step，不把整段楼梯当成 a stairs。",
    "The stairs are narrow near the top.",
    "楼梯接近顶部的地方很窄。",
    "Please carry the box down the stairs slowly.",
    "请慢慢把箱子搬下楼梯。"
  ],
  [
    "hello",
    "感叹词、名词 · 问候",
    "hello 用于打招呼或接电话，通常较中性；say hello to someone 表示向某人问好，hello 不是需要人称变化的普通动词。",
    "Hello, are you here for the afternoon workshop?",
    "你好，你是来参加下午工作坊的吗？",
    "Please say hello to your grandparents for me.",
    "请代我向你祖父母问好。"
  ],
  [
    "potato",
    "名词 · 土豆",
    "potato 是可数名词，复数 potatoes 末尾加 -es；作为食材名词修饰语时可用单数，如 potato soup。",
    "She cut a large potato into thin slices.",
    "她把一个大土豆切成薄片。",
    "A potato rolled out of the shopping bag.",
    "一个土豆从购物袋里滚了出来。"
  ],
  [
    "uncle",
    "名词 · 叔伯舅等男性长辈",
    "uncle 可指父母的兄弟或某些姻亲，英文一个词不细分中文叔、伯、舅；需要明确关系时补充说明是哪一方的兄弟。",
    "My uncle taught me to repair the old radio.",
    "我叔叔教我修那台旧收音机。",
    "Her uncle lives on a farm outside the town.",
    "她舅舅住在镇外的农场。"
  ],
  [
    "juice",
    "名词 · 汁液、果汁",
    "juice 指果蔬等的汁时通常不可数，a glass of juice 表示一杯；orange juice 等组合用来说明汁液来源。",
    "We squeezed juice from the fresh oranges.",
    "我们把新鲜橙子榨成了汁。",
    "Would you like some apple juice with lunch?",
    "午饭时你想来点苹果汁吗？"
  ],
  [
    "dollar",
    "名词 · 元，一种货币单位",
    "dollar 用于多个国家的货币单位，不能只凭 dollar 就断言是美元；单数 a dollar，数额超过一通常用 dollars。",
    "The old postcard cost one dollar.",
    "那张旧明信片花了一元。",
    "She put a dollar into the donation box.",
    "她往捐款箱里放了一元。"
  ],
  [
    "smell",
    "动词 · 闻到、闻起来",
    "smell 可直接接闻到的东西，也可作系动词接形容词表示闻起来怎样；smell sweet 中 sweet 不改成修饰动作的 sweetly。",
    "I can smell fresh bread from the kitchen.",
    "我能闻到厨房里新面包的香味。",
    "These flowers smell sweet after the rain.",
    "这些花雨后闻起来很香。"
  ],
  [
    "designer",
    "名词 · 设计师",
    "designer 指设计物品、空间等的人，是可数名词；graphic designer、fashion designer 可说明领域，不等于任何从事绘画的人。",
    "The designer chose pale blue for the reading room.",
    "设计师为阅览室选了浅蓝色。",
    "A local designer created the new town map.",
    "一位本地设计师制作了新镇区地图。"
  ],
  [
    "birthday",
    "名词 · 生日",
    "birthday 通常指每年出生日期的纪念日，可用 on someone's birthday；Happy birthday 是祝贺生日，不与一般节日问候随意互换。",
    "We planted a tree on her birthday.",
    "我们在她生日那天种了一棵树。",
    "His birthday falls on the first day of the holiday.",
    "他的生日恰好在假期第一天。"
  ],
  [
    "apple",
    "名词 · 苹果",
    "apple 是可数名词，单个用 an apple，因为开头是元音音素；apple juice、apple pie 中用作材料说明，通常用单数形式。",
    "An apple fell onto the grass beside us.",
    "一个苹果掉在我们旁边的草地上。",
    "She packed an apple and a sandwich for lunch.",
    "她装了一个苹果和一个三明治作午餐。"
  ],
  [
    "dig",
    "动词 · 挖",
    "dig 可直接接土、洞等宾语，也可用 dig for 表示挖找某物；过去式、过去分词为 dug，不是 digged。",
    "We will dig a small hole for each seedling.",
    "我们会为每株幼苗挖一个小坑。",
    "The dog began to dig near the garden fence.",
    "狗开始在花园篱笆附近刨土。"
  ],
  [
    "satisfied",
    "形容词 · 满意的",
    "satisfied 描述人的满意感，常用 be satisfied with；satisfying 常描述使人满意的事物，不能只因中文都有“满意”就互换。",
    "She was satisfied with the repaired chair.",
    "她对修好的椅子很满意。",
    "Are you satisfied with the amount of light in this room?",
    "你对这间房的采光满意吗？"
  ],
  [
    "publisher",
    "名词 · 出版者、出版社",
    "publisher 指负责出版书刊等的人或机构，不是书的作者本身；publish 是动词，publisher 则用于指出版活动的承担者。",
    "The publisher asked for a clearer cover design.",
    "出版社要求封面设计更清晰一些。",
    "A small publisher released her first collection of poems.",
    "一家小出版社出版了她的第一本诗集。"
  ],
  [
    "joy",
    "名词 · 喜悦",
    "joy 表示强烈喜悦时通常不可数，with joy 表示高兴地；a joy 可指让人开心的人或事物，不能把两种数量用法混淆。",
    "Her face lit up with joy when the letter arrived.",
    "信到达时，她脸上洋溢着喜悦。",
    "The garden brings joy to many local families.",
    "花园为许多当地家庭带来快乐。"
  ],
  [
    "sixteen",
    "数词 · 十六",
    "sixteen 表示十六，sixty 表示六十，注意词尾和重音；用于年龄时 sixteen years old 中 years 仍用复数。",
    "Sixteen students signed up for the weekend walk.",
    "十六名学生报名参加周末步行活动。",
    "She learned to repair bicycles when she was sixteen.",
    "她十六岁时学会了修自行车。"
  ],
  [
    "honey",
    "名词 · 蜂蜜",
    "honey 指蜂蜜时通常不可数，可用 a spoonful of honey 表示一匙；作为亲昵称呼时是另一种用法，不应混入食物义。",
    "A little honey made the yogurt taste sweeter.",
    "少量蜂蜜让酸奶更甜了。",
    "She stirred a spoonful of honey into the warm tea.",
    "她把一匙蜂蜜搅进温茶。"
  ],
  [
    "math",
    "名词 · 数学",
    "math 是美式常见简称，英式常用 maths；表示数学学科时通常作为单数概念使用，不要因 maths 有 -s 就配复数动词。",
    "Math is her favorite subject this year.",
    "数学是她今年最喜欢的学科。",
    "We used math to work out the garden's area.",
    "我们用数学算出了花园面积。"
  ],
  [
    "celebration",
    "名词 · 庆祝活动",
    "celebration 可指庆祝的行为，也可数地指一次庆祝活动；a celebration of something 可表达庆祝或赞颂的对象。",
    "The school held a celebration for its new library.",
    "学校为新图书馆举行了一次庆祝活动。",
    "Music and dancing were part of the celebration.",
    "音乐和舞蹈是庆祝活动的一部分。"
  ],
  [
    "pig",
    "名词 · 猪",
    "pig 是猪的常用名词，通常可数；pork 是作为食物的猪肉。不要把一般物种名称 pig 和肉类名称直接互换。",
    "A young pig slept in the shade of the barn.",
    "一只小猪睡在谷仓的阴凉处。",
    "The farmer checked the pig before feeding the chickens.",
    "农民喂鸡前查看了一下那头猪。"
  ],
  [
    "friendship",
    "名词 · 友谊",
    "friendship 可不可数地表示友谊这种关系，也能可数地指一段具体友谊；friend 是朋友本人，不能把关系与人混为同一名词。",
    "Their friendship began during a school project.",
    "他们的友谊始于一个学校项目。",
    "The letter was a simple sign of friendship.",
    "这封信是友谊的朴素表达。"
  ],
  [
    "flavor",
    "名词 · 风味、味道",
    "flavor 是美式拼写，英式常写 flavour；可指食物的风味或某种具体口味，不完全等于舌头辨别甜咸的单一感觉。",
    "Fresh herbs gave the soup a rich flavor.",
    "新鲜香草给汤增添了浓郁风味。",
    "Which flavor of yogurt would you like?",
    "你想要哪种口味的酸奶？"
  ],
  [
    "silk",
    "名词 · 丝、丝绸",
    "silk 指丝纤维或丝绸材料时通常不可数；a silk scarf 中 silk 说明材料，不代表一条丝就是一个可数 silk。",
    "The scarf is made from soft silk.",
    "这条围巾用柔软丝绸制成。",
    "She chose pale silk for the costume sleeves.",
    "她选了浅色丝绸做戏服袖子。"
  ],
  [
    "orange",
    "名词 · 橙子",
    "orange 作水果名时可数，一只用 an orange；颜色形容词 orange 及果汁 orange juice 的结构不同，要结合名词位置理解。",
    "She peeled an orange while waiting for the train.",
    "她等火车时剥了一个橙子。",
    "We shared the last orange after the walk.",
    "散步后，我们分吃了最后一个橙子。"
  ],
  [
    "everyday",
    "形容词 · 日常的",
    "everyday 合写通常是形容词，如 everyday life；every day 分写表示每天，作时间状语，不能写成 I read everyday 代替每天读书。",
    "The course teaches English for everyday situations.",
    "这门课教授日常情境中的英语。",
    "She finds ideas for stories in everyday life.",
    "她在日常生活中寻找故事灵感。"
  ],
  [
    "piano",
    "名词 · 钢琴",
    "piano 作乐器名是可数名词，play the piano 是常见表达；乐谱中的 piano 也可表示弱奏，是另一个专业用法。",
    "The piano stood beside the open window.",
    "钢琴摆在敞开的窗边。",
    "He practices the piano before dinner.",
    "他晚餐前练钢琴。"
  ],
  [
    "shine",
    "动词 · 发光、反光",
    "shine 可指光源发光，也可指物体反光，常作不及物动词；shone 常见于发光义过去式，擦亮物品时也常见 shined。",
    "The stars shine clearly on cold nights.",
    "寒冷夜晚，星星明亮地闪耀。",
    "Small lights shine through the paper lanterns.",
    "小灯的光透过纸灯笼照出来。"
  ],
  [
    "dictionary",
    "名词 · 词典",
    "dictionary 是提供词义、发音等资料的工具书或电子资源，是可数名词；look a word up in a dictionary 表示查词。",
    "The dictionary gives two pronunciations for this word.",
    "词典为这个词列出了两种发音。",
    "She keeps a small dictionary beside her notebook.",
    "她把一本小词典放在笔记本旁。"
  ],
  [
    "server",
    "名词 · 餐饮服务员",
    "server 在餐馆语境中指服务员，性别中性；它也可指服务器或发球者，不能只凭技术语境常用义理解所有句子。",
    "The server brought an extra plate to our table.",
    "服务员给我们桌送来一只额外的盘子。",
    "We asked the server which dishes contained nuts.",
    "我们问服务员哪些菜含坚果。"
  ],
  [
    "boyfriend",
    "名词 · 男朋友",
    "boyfriend 通常表示恋爱关系中的男性伴侣；普通男性朋友可以说 a male friend，不能把所有男同学都称 boyfriend。",
    "Her boyfriend helped carry the plants upstairs.",
    "她男朋友帮忙把植物搬上楼。",
    "She introduced her boyfriend to the reading group.",
    "她把男朋友介绍给了阅读小组。"
  ],
  [
    "frightened",
    "形容词 · 害怕的",
    "frightened 描述感到害怕的人或动物；frightening 描述让人害怕的事物，注意感受者和引起感受的对象不同。",
    "The frightened kitten hid behind a basket.",
    "受惊的小猫躲到篮子后面。",
    "He was frightened by the sudden crash outside.",
    "他被外面突如其来的撞击声吓到了。"
  ],
  [
    "excited",
    "形容词 · 兴奋的",
    "excited 描述人感到兴奋，常用 excited about；exciting 描述令人兴奋的事情，不把感受和引起感受的特征混写。",
    "The children were excited about the museum visit.",
    "孩子们对博物馆参观兴奋不已。",
    "She sounded excited when she described the new project.",
    "她描述新项目时听起来很兴奋。"
  ],
  [
    "improved",
    "形容词、过去分词 · 改进了的",
    "improved 表示相对以前有所改善，可修饰服务、设计等；只是相对进步，不代表已经达到完美或所有方面都更好。",
    "The improved design uses less material.",
    "改进后的设计使用更少材料。",
    "The town now has an improved bus service.",
    "镇上如今有了改善后的公交服务。"
  ],
  [
    "airplane",
    "名词 · 飞机",
    "airplane 通常指有固定机翼并靠动力飞行的飞机，美式常见；英式常写 aeroplane，不把直升机等所有航空器都当作 airplane。",
    "The airplane flew low over the coast.",
    "飞机低空飞过海岸。",
    "The museum restored a small wooden airplane.",
    "博物馆修复了一架小木飞机。"
  ],
  [
    "known",
    "形容词、过去分词 · 已知的",
    "known 可表示已经知道、认识或公认的；known for 表示因某特点闻名，known as 强调名称或身份，介词改变关系。",
    "The village is known for its blue pottery.",
    "这个村庄以蓝色陶器闻名。",
    "The report lists every known entrance to the cave.",
    "报告列出了洞穴所有已知入口。"
  ],
  [
    "frankly",
    "副词 · 坦率地",
    "frankly 可修饰说话方式，也可放在句首表明坦率表达意见；有时语气较直接，需要根据交流关系判断使用。",
    "She spoke frankly about the difficulties ahead.",
    "她坦率地谈到前面的困难。",
    "Frankly, we need more time to finish the display.",
    "坦率地说，我们需要更多时间完成展陈。"
  ],
  [
    "confused",
    "形容词 · 困惑的",
    "confused 表示感到不明白或辨不清，常用于人；confusing 描述让人困惑的说明、情况等，注意角色区别。",
    "I was confused by the two different timetables.",
    "两份不同的课表把我弄糊涂了。",
    "The confused visitor asked the guide to repeat the directions.",
    "困惑的访客请导游再说一遍路线。"
  ],
  [
    "hopefully",
    "副词 · 希望如此地",
    "hopefully 可表示满怀希望地做某事，也可表达“但愿”；后者是常见标准用法，不能只承认它修饰动作的含义。",
    "She looked hopefully toward the station entrance.",
    "她满怀希望地望向车站入口。",
    "Hopefully, the weather will improve before our trip.",
    "但愿出发前天气会好转。"
  ],
  [
    "fool",
    "名词 · 傻瓜、受骗者",
    "fool 可指判断不明智的人或受骗者，直接称别人 fool 往往冒犯；make a fool of oneself 表示让自己出丑。",
    "He felt like a fool after ignoring the clear instructions.",
    "他无视了清楚的说明，事后觉得自己很傻。",
    "Nobody wanted to look a fool in front of the visitors.",
    "没人想在访客面前出丑。"
  ],
  [
    "retired",
    "形容词 · 已退休的",
    "retired 表示已经结束职业工作，可修饰 teacher、doctor 等；不等于暂时休假，后者通常用 on holiday、on leave 等。",
    "A retired engineer helped repair the school clock.",
    "一位退休工程师帮忙修好了学校的钟。",
    "Her father is retired but still enjoys teaching chess.",
    "她父亲退休了，但仍喜欢教国际象棋。"
  ],
  [
    "freshman",
    "名词 · 一年级新生",
    "freshman 在美式中常指高中或大学一年级学生；复数 freshmen，不能只按“新来的人”推断其年级以外的所有身份。",
    "The freshman joined a science club in September.",
    "那名一年级新生九月加入了科学社团。",
    "As a freshman, she found the campus map useful.",
    "作为一年级新生，她觉得校园地图很有用。"
  ],
  [
    "astronomer",
    "名词 · 天文学家",
    "astronomer 研究天体及相关现象，是科学领域身份；不要与研究占星解释的 astrologer 混淆，二者关注与方法不同。",
    "The astronomer showed us how to find the planet.",
    "天文学家教我们如何找到那颗行星。",
    "An astronomer gave a talk at the village school.",
    "一位天文学家在村小学作了讲座。"
  ],
  [
    "timing",
    "名词 · 时机、时间安排",
    "timing 指事件发生的时间安排或选时能力，不只是 time 的另一种拼写；good timing 表示时机合适，未必表示用时很短。",
    "The timing of the announcement surprised the staff.",
    "公告发布的时机让员工吃惊。",
    "Good timing helped the two musicians stay together.",
    "良好的节奏时机把握让两位乐手保持协调。"
  ],
  [
    "teenage",
    "形容词 · 青少年时期的",
    "teenage 通常修饰名词，表示十三至十九岁这一年龄段相关；teenager 是人，不能把 teenage 单独当作一个青少年。",
    "The program welcomes teenage volunteers.",
    "这个项目欢迎青少年志愿者。",
    "She wrote her first stories during her teenage years.",
    "她在青少年时期写下了最初的故事。"
  ],
  [
    "traveler",
    "名词 · 旅行者",
    "traveler 是美式常见拼写，英式常写 traveller；指正在旅行或常旅行的人，不必与专为观光的 tourist 在所有语境中等同。",
    "A tired traveler asked about the last train.",
    "一位疲惫的旅行者询问末班火车的情况。",
    "The guidebook offers advice for the independent traveler.",
    "指南为独自规划行程的旅行者提供建议。"
  ],
  [
    "swimming",
    "名词 · 游泳",
    "swimming 指游泳这种活动时通常不可数，可用 go swimming；拼写时 swim 的末尾 m 双写，不能写成 swiming。",
    "Swimming is popular at the lake in summer.",
    "夏天在湖里游泳很受欢迎。",
    "The children go swimming every Friday.",
    "孩子们每周五去游泳。"
  ],
  [
    "noon",
    "名词 · 中午",
    "noon 指中午十二点左右的时刻，常用 at noon；by noon 表示最迟到中午，before noon 则在中午之前，不混淆截止时间。",
    "The library closes at noon on Saturdays.",
    "图书馆周六中午关门。",
    "Please return the keys by noon tomorrow.",
    "请最迟明天中午归还钥匙。"
  ],
  [
    "jazz",
    "名词 · 爵士乐",
    "jazz 是源自非裔美国文化的音乐类型名称，通常不可数；a jazz band 中 jazz 说明乐队风格，不表示一首单独作品。",
    "Soft jazz played in the small cafe.",
    "小咖啡馆里播放着轻柔的爵士乐。",
    "She joined a jazz band at college.",
    "她在大学加入了一支爵士乐队。"
  ],
  [
    "starter",
    "名词 · 发令员",
    "starter 可指让比赛开始的发令员；它还有开胃菜、启动装置等义项，此处限竞赛工作人员，要依比赛语境识别。",
    "The starter raised a flag before the race.",
    "发令员在比赛前举起了旗。",
    "Every runner waited for the starter's signal.",
    "每位赛跑者都等待发令员的信号。"
  ],
  [
    "hidden",
    "形容词、过去分词 · 隐藏的",
    "hidden 表示看不见或不易察觉，可修饰入口、信息等；它是 hide 的过去分词形式，不能按规则写成 hided。",
    "The map showed a hidden path through the woods.",
    "地图标出了一条穿过树林的隐秘小路。",
    "There are no hidden charges in the ticket price.",
    "票价没有隐性收费。"
  ],
  [
    "shared",
    "形容词、过去分词 · 共同的",
    "shared 表示由两人或多人共同使用、拥有或经历；a shared room 强调共用房间，不等于每人拥有独立房间。",
    "The shared kitchen was clean and bright.",
    "共用厨房干净明亮。",
    "A shared interest in birds brought them together.",
    "对鸟类的共同兴趣让他们走到一起。"
  ],
  [
    "alternatively",
    "副词 · 作为另一选择",
    "alternatively 提供另一种可选方案，常放句首并用逗号隔开；alternately 则常表示交替发生，不能因为拼写相近就互换。",
    "We could walk along the river; alternatively, we could take the bus.",
    "我们可以沿河步行，也可以选择坐公交车。",
    "You may send the form by post. Alternatively, hand it in at reception.",
    "你可以邮寄表格，也可以交给前台。"
  ],
  [
    "downstairs",
    "副词 · 在楼下、往楼下",
    "downstairs 作副词直接表达楼下位置或向下移动，常用 go downstairs；一般不写 go to downstairs，作形容词则可修饰房间。",
    "The children went downstairs for breakfast.",
    "孩子们下楼吃早餐。",
    "We could hear music from downstairs.",
    "我们能听到楼下传来的音乐。"
  ],
  [
    "payable",
    "形容词 · 应付的、可支付的",
    "payable 常见于账单等正式文本，表示须支付或可支付；payable by 表截止日期，payable to 表收款对象，注意介词。",
    "The fee is payable by the end of the month.",
    "费用应在月底前支付。",
    "The amount payable is shown at the bottom of the bill.",
    "应付金额列在账单底部。"
  ],
  [
    "elder",
    "名词 · 年长者、长辈",
    "elder 作名词可以指年长者或凭年龄经验受到尊重的人；one's elders 指长辈，不只是任何比自己年龄大的物品。",
    "A village elder explained the history of the old bridge.",
    "一位村中长者介绍了老桥的历史。",
    "The young volunteers asked an elder to lead the ceremony.",
    "年轻志愿者请一位长者主持仪式。"
  ],
  [
    "supermarket",
    "名词 · 超市",
    "supermarket 是出售食品及日用品等的自选商店，通常可数；它不等于所有 shop，也不意味着任何国家都有统一的最低规模。",
    "The supermarket sells local vegetables near the entrance.",
    "超市在入口附近卖本地蔬菜。",
    "We walked to the supermarket with two empty bags.",
    "我们带着两个空袋子步行去了超市。"
  ],
  [
    "determined",
    "形容词 · 下定决心的",
    "determined 描述有坚定决心的人，常见 determined to do；它也可能是 determine 的过去式，需看句中是状态还是动作。",
    "She is determined to finish the evening course.",
    "她下定决心完成夜校课程。",
    "The determined team kept working after the first failure.",
    "坚定的团队在首次失败后继续工作。"
  ],
  [
    "isolated",
    "形容词 · 单独发生的、个别的",
    "isolated 可表示某事件独立、偶发，不属于更广泛模式；它也能指地理位置偏远或感到孤独，这里限定事件义。",
    "The broken window was an isolated incident.",
    "破窗是一次孤立事件。",
    "The report describes an isolated case of equipment failure.",
    "报告描述了一例个别设备故障。"
  ],
  [
    "dolphin",
    "名词 · 海豚",
    "dolphin 通常指海豚，是水生哺乳动物而非鱼；部分名称也指其他动物，这里限常见的海豚义，不按外形判断分类。",
    "A dolphin surfaced beside the research boat.",
    "一只海豚在科考船旁浮出水面。",
    "The children watched a dolphin leap above the waves.",
    "孩子们看着一只海豚跃出浪面。"
  ],
  [
    "depressed",
    "形容词 · 情绪低落的",
    "depressed 在日常语境中可指心情很低落，也有临床相关用法；不能仅凭一个形容词判断疾病，这里只描述故事人物的感受。",
    "He felt depressed after losing the final match.",
    "输掉决赛后，他感到很低落。",
    "The gloomy weather made her feel depressed.",
    "阴沉的天气让她心情低落。"
  ],
  [
    "shocked",
    "形容词 · 震惊的",
    "shocked 描述人受到突然情绪冲击的状态，常用 shocked by 或 shocked at；shocking 描述令人震惊的事情，注意角色区别。",
    "We were shocked by the sudden announcement.",
    "那个突然的公告让我们震惊。",
    "She looked shocked when she saw the damaged roof.",
    "她看到受损的屋顶时显得很震惊。"
  ],
  [
    "workplace",
    "名词 · 工作场所",
    "workplace 指人们工作的场所，可包括办公室、商店或工厂；它不只指办公室，也不是职业职位本身，通常是可数名词。",
    "The workshop became a safer workplace after the repairs.",
    "修缮后，车间成了更安全的工作场所。",
    "Clear signs help visitors find their way around the workplace.",
    "清楚的标识帮助访客在工作场所内找路。"
  ],
  [
    "zero",
    "数词、名词 · 零",
    "zero 表示数量零或数字符号 0；温度 below zero 表示零度以下。电话号码中的 0 也有其他读法，不能据此改变数量词意义。",
    "The counter returned to zero after the reset.",
    "重置后计数器回到了零。",
    "The temperature fell below zero last night.",
    "昨晚气温降到了零度以下。"
  ],
  [
    "alley",
    "名词 · 狭窄街巷",
    "alley 可指建筑物之间的小巷或通道，通常可数；它也见于 bowling alley 等其他用法，这里限城市街巷义。",
    "A narrow alley leads behind the bakery.",
    "一条窄巷通到面包店后面。",
    "The cafe has a side door opening onto the alley.",
    "咖啡馆有一扇通向小巷的侧门。"
  ],
  [
    "dried",
    "形容词、过去分词 · 干制的",
    "dried 常描述经过干燥处理的食物，如 dried fruit；dry 更宽泛地描述干燥状态，不能把所有干的物品都机械换成 dried。",
    "She added dried mushrooms to the soup.",
    "她往汤里加了干蘑菇。",
    "The shop sells dried fruit in small paper bags.",
    "商店用小纸袋卖果干。"
  ],
  [
    "grandchild",
    "名词 · 孙辈、外孙辈",
    "grandchild 指子女的孩子，不区分中文孙子与外孙等关系；复数 grandchildren，不写 grandchilds，性别可另用 grandson 或 granddaughter。",
    "Her youngest grandchild started school this year.",
    "她最小的孙辈今年开始上学。",
    "He made a wooden toy for each grandchild.",
    "他给每个孙辈做了一个木玩具。"
  ],
  [
    "dough",
    "名词 · 面团",
    "dough 通常指可揉、可擀的面团，作为材料时不可数；a piece of dough 表示一块，较稀的面糊常用 batter。",
    "Knead the dough until it feels smooth.",
    "揉面团，直到手感光滑。",
    "She covered the dough with a clean cloth.",
    "她用干净的布盖住面团。"
  ],
  [
    "workout",
    "名词 · 一次锻炼",
    "workout 是名词，表示一次体能训练或锻炼；work out 分写通常是动词短语，不能用 a work out 指一次锻炼。",
    "Her morning workout ended with a gentle stretch.",
    "她的晨练以轻柔伸展结束。",
    "We met for a short workout before lunch.",
    "我们在午饭前碰面，做了短时间锻炼。"
  ],
  [
    "pencil",
    "名词 · 铅笔",
    "pencil 是可数名词，通常指带石墨等笔芯的书写工具；in pencil 表示用铅笔书写，不必再加 a，区别于一支具体铅笔。",
    "Please mark uncertain answers in pencil.",
    "请用铅笔标出不确定的答案。",
    "A yellow pencil lay across the open notebook.",
    "一本打开的笔记本上横放着一支黄铅笔。"
  ],
  [
    "caller",
    "名词 · 来电者",
    "caller 可指打来电话的人，也可指来访者或发号者；这里限电话语境，不是所有含 call 的行为都指打电话。",
    "The caller asked when the library would open.",
    "来电者询问图书馆什么时候开门。",
    "She asked the caller to leave a contact number.",
    "她请来电者留下联系电话。"
  ],
  [
    "eighth",
    "序数词 · 第八",
    "eighth 表示顺序第八，注意 eight 后加 -h 的拼写结果；an eighth 还可表示八分之一，不能与数量八 eight 混用。",
    "Her name was eighth on the list.",
    "她的名字排在名单第八位。",
    "The eighth chapter explains how the machine works.",
    "第八章解释机器如何运转。"
  ],
  [
    "someday",
    "副词 · 将来某一天",
    "someday 表示未来不确定的某一天，通常不指已经确定的日期；some day 分写也可见，不能只凭词形判断具体是哪天。",
    "Someday, I hope to travel along the whole coast.",
    "将来有一天，我希望沿整条海岸旅行。",
    "She plans to open a little bookshop someday.",
    "她计划有朝一日开一家小书店。"
  ],
  [
    "eyebrow",
    "名词 · 眉毛",
    "eyebrow 指眼睛上方的眉毛或眉弓，通常可数；eyelash 是眼睑边缘的睫毛，二者位置不同，不能混指。",
    "He raised one eyebrow when he heard the price.",
    "他听到价格时挑起了一边眉毛。",
    "A drop of rain hung from her eyebrow.",
    "她的眉毛上挂着一滴雨水。"
  ],
  [
    "monkey",
    "名词 · 猴子",
    "monkey 通常指猴子，是可数名词；与 ape 等灵长类名称不应只按中文俗称完全等同，这里只描述常见动物。",
    "A monkey picked fruit from the low branch.",
    "一只猴子从低枝上摘水果。",
    "The child drew a monkey holding a banana.",
    "孩子画了一只拿着香蕉的猴子。"
  ],
  [
    "independently",
    "副词 · 独立地",
    "independently 表示不依赖他人或彼此独立地行动；work independently 可以指自主工作，不一定表示物理上独自待在房间里。",
    "The two teams checked the results independently.",
    "两个团队分别独立核查了结果。",
    "She can complete the exercise independently now.",
    "她现在能独立完成练习了。"
  ],
  [
    "kilometre",
    "名词 · 千米",
    "kilometre 是英式常见拼写，美式常写 kilometer，等于一千米；作为完整单位名词，数量大于一时通常使用复数 kilometres。",
    "The campsite is one kilometre from the bridge.",
    "营地离桥一千米。",
    "We walked the final kilometre along the river.",
    "我们沿河走完最后一千米。"
  ],
  [
    "wheelchair",
    "名词 · 轮椅",
    "wheelchair 指带轮、供行动需要者使用的椅子，是可数名词；常说 use a wheelchair，描述使用者时不必把人简单等同于设备。",
    "The entrance is wide enough for a wheelchair.",
    "入口足够宽，轮椅可以通过。",
    "He uses a wheelchair to move around the campus.",
    "他使用轮椅在校园里活动。"
  ],
  [
    "banana",
    "名词 · 香蕉",
    "banana 指水果时可数，一根用 a banana；a bunch of bananas 表示一串，不能把串和单根的数量单位混淆。",
    "She put a banana in each lunch bag.",
    "她在每个午餐袋里放了一根香蕉。",
    "The last banana was too ripe to carry on the hike.",
    "最后一根香蕉熟得过头，不适合徒步携带。"
  ],
  [
    "temporarily",
    "副词 · 暂时地",
    "temporarily 强调只在有限时间内如此，通常与 permanently 相对；它不说明时间一定很短，也不保证具体何时结束。",
    "The side entrance is temporarily closed for repairs.",
    "侧门因维修暂时关闭。",
    "We moved the plants indoors temporarily.",
    "我们暂时把植物搬进了室内。"
  ],
  [
    "stuck",
    "过去分词、形容词 · 卡住的",
    "stuck 是 stick 的过去式和过去分词，也可描述卡住、受困的状态；get stuck 常见，不写成规则形式 sticked。",
    "The key is stuck in the old lock.",
    "钥匙卡在旧锁里了。",
    "Our cart got stuck in the soft mud.",
    "我们的推车陷在软泥里了。"
  ],
  [
    "terribly",
    "副词 · 非常、极其",
    "terribly 可作程度副词表示非常，不一定说明情况可怕；也能表示做得很糟糕，要根据被修饰的词判断。",
    "I am terribly sorry about the broken cup.",
    "杯子打碎了，我非常抱歉。",
    "The upstairs room became terribly hot in the afternoon.",
    "楼上的房间下午变得非常热。"
  ],
  [
    "crowded",
    "形容词 · 拥挤的",
    "crowded 指挤满人或东西，常见 crowded with；不是所有 busy 场所都实际拥挤，后者还可能只表示事务繁忙。",
    "The train was crowded with students after the match.",
    "比赛后，列车上挤满了学生。",
    "We avoided the crowded market and took a quieter street.",
    "我们避开拥挤的市场，走了一条较安静的街。"
  ],
  [
    "rental",
    "名词 · 租赁、租用物",
    "rental 可指租用行为、租金或租来的东西，含义依具体搭配；car rental 是汽车租赁，不一定指汽车本身的售价。",
    "The ticket price includes bicycle rental.",
    "票价包含自行车租赁。",
    "We returned the rental before the office closed.",
    "我们在办公室关门前归还了租用物。"
  ],
  [
    "regain",
    "动词 · 重新获得",
    "regain 直接接重新获得的东西，常见 regain strength、regain control；不能因为 gain 常与机会等连用就忽略 re- 表达恢复的意义。",
    "She paused to regain her balance.",
    "她停下来恢复平衡。",
    "The team hopes to regain the visitors' trust.",
    "团队希望重新赢得访客的信任。"
  ],
  [
    "rehabilitation",
    "名词 · 康复",
    "rehabilitation 可指恢复功能的康复过程，也有帮助重返社会等义项；这里限身体康复，不把它当作某种单一治疗名称。",
    "The center has a bright room for rehabilitation exercises.",
    "中心有一间明亮的房间供康复训练使用。",
    "Her rehabilitation continued after she left the hospital.",
    "出院后，她继续康复训练。"
  ],
  [
    "trauma",
    "名词 · 创伤",
    "trauma 可指身体组织受伤，也可指严重经历造成的心理创伤；具体语境决定意义，不把普通小烦恼与专业概念一概等同。",
    "The lecture explained the difference between physical and emotional trauma.",
    "讲座解释了身体创伤和情绪创伤的区别。",
    "The novel explores the family's trauma after the disaster.",
    "小说探讨了这家人在灾难后的创伤。"
  ],
  [
    "citizenship",
    "名词 · 公民身份",
    "citizenship 表示公民身份或公民责任相关概念，通常不可数；它不是一张具体证件，证件通常另用 certificate、passport 等。",
    "The course includes a lesson on citizenship and community life.",
    "课程包含一节关于公民身份与社区生活的课。",
    "The museum explains how ideas of citizenship changed over time.",
    "博物馆介绍了公民身份观念如何随时间改变。"
  ],
  [
    "node",
    "名词 · 植物茎上的节",
    "node 在植物学中指叶等从茎上生出的节位，是可数名词；它也用于网络等领域，不能把不同专业义项直接混用。",
    "A small leaf grew from the node near the base.",
    "一片小叶从靠近底部的节位长了出来。",
    "The diagram labels each node along the stem.",
    "示意图标出了茎上的每个节。"
  ],
  [
    "serum",
    "名词 · 血清",
    "serum 在这里指血液凝固后留下的液体部分，区别于保留凝血成分的 plasma；护肤产品也可叫 serum，属于不同语境。",
    "The laboratory labeled the serum sample carefully.",
    "实验室仔细标记了血清样本。",
    "The diagram shows how serum is separated from clotted blood.",
    "示意图展示血清如何从凝固血液中分离。"
  ],
  [
    "creek",
    "名词 · 小溪",
    "creek 尤其在美式英语中可指通常比河流小的溪流，常可数；某些地区也有海湾等用法，读到地名时留意地区语境。",
    "A narrow creek flows behind the school.",
    "一条小溪流经学校后面。",
    "We crossed the creek on a wooden footbridge.",
    "我们经一座木制步行桥跨过小溪。"
  ],
  [
    "relieved",
    "形容词 · 宽慰的",
    "relieved 表示忧虑或紧张减轻后的安心，可用 relieved to hear 或 relieved that；不是指一般身体被挪开的位置变化。",
    "We were relieved to hear that the dog was safe.",
    "听说狗安然无恙，我们松了口气。",
    "She looked relieved when the missing bag was found.",
    "丢失的包找到后，她显得如释重负。"
  ],
  [
    "tech",
    "名词 · 技术、科技",
    "tech 可作为 technology 的简短说法，常见于较随意的行业表达；也可指 technician，需结合 tech company 等搭配识别。",
    "The exhibition shows how tech has changed classroom learning.",
    "展览展示了科技如何改变课堂学习。",
    "She enjoys reading about new tech for small farms.",
    "她喜欢阅读小型农场新技术的资料。"
  ],
  [
    "challenging",
    "形容词 · 有挑战性的",
    "challenging 描述需要能力、思考或努力而具有挑战的任务；不一定表示无法完成，也不等于危险或带敌意。",
    "The final puzzle was challenging but enjoyable.",
    "最后一道谜题很有挑战性，但也有趣。",
    "He chose a challenging route for the experienced walkers.",
    "他为经验丰富的徒步者选了条有挑战的路线。"
  ],
  [
    "compassion",
    "名词 · 同情、关怀",
    "compassion 指注意到他人痛苦并希望减轻的关怀，通常不可数；show compassion for someone 表示对某人表达这种关心。",
    "The volunteers treated every visitor with compassion.",
    "志愿者们关怀地对待每一位访客。",
    "The story encourages compassion for people facing hardship.",
    "故事鼓励人们关怀困境中的人。"
  ],
  [
    "beautifully",
    "副词 · 优美地、出色地",
    "beautifully 可修饰动作，表示美丽地或完成得出色；beautiful 是形容词，不要用来直接替代 beautifully sung 这类结构。",
    "She played the final melody beautifully.",
    "她优美地演奏了最后一段旋律。",
    "The repaired door now closes beautifully.",
    "修好的门现在关起来顺畅极了。"
  ],
  [
    "stunning",
    "形容词 · 惊艳的、极出色的",
    "stunning 常强调美或表现带来的强烈惊叹，也可表示震惊；不只是 ordinary beautiful 的机械替换，注意语气较强。",
    "The balcony offers a stunning view of the coast.",
    "阳台能看到令人惊叹的海岸景色。",
    "Her stunning performance brought the audience to its feet.",
    "她出色的表演让观众起立喝彩。"
  ],
  [
    "creator",
    "名词 · 创作者",
    "creator 指把新事物创作出来的人或实体，通常可数；与只使用、展示作品的人不同，不能把所有相关参与者都称 creator。",
    "The creator of the game visited our class.",
    "游戏的创作者来访了我们班。",
    "Each poster names its creator in the lower corner.",
    "每张海报都在下角标明创作者。"
  ],
  [
    "unacceptable",
    "形容词 · 不能接受的",
    "unacceptable 描述不符合要求、不能被接受的情况或行为；常与 behavior、risk 等搭配，不表示只是个人不喜欢某种口味。",
    "Leaving the fire door locked is unacceptable.",
    "把消防门锁住是不能接受的。",
    "The teacher explained why bullying is unacceptable.",
    "老师解释了为什么欺凌是不可接受的。"
  ],
  [
    "boxing",
    "名词 · 拳击",
    "boxing 指用拳进行攻防的体育项目，通常不可数；box 的装箱义也能形成 boxing，阅读时依比赛或物品包装语境区分。",
    "The club offers an introduction to boxing.",
    "俱乐部提供拳击入门课程。",
    "The documentary follows the history of boxing in the town.",
    "纪录片追溯了镇上拳击运动的历史。"
  ],
  [
    "shiny",
    "形容词 · 有光泽的",
    "shiny 描述表面平滑、反光或发亮，常用于金属、鞋面等；它与发出光线的 shining 有交叉，但不宜随意互换所有用法。",
    "The child picked up a shiny pebble.",
    "孩子捡起一颗发亮的小石子。",
    "Her shoes were clean and shiny before the ceremony.",
    "仪式前，她的鞋子干净有光泽。"
  ],
  [
    "poorly",
    "副词 · 糟糕地、不佳地",
    "poorly 作副词表示完成得不佳，修饰动作或过去分词；在英式等用法中也可作形容词表示身体不适，这里限表现义。",
    "The sign was poorly placed behind a tree.",
    "标牌位置不佳，放在了树后。",
    "The plants grew poorly in the dark corner.",
    "植物在阴暗角落长得不好。"
  ],
  [
    "abnormal",
    "形容词 · 异常的",
    "abnormal 表示偏离正常或平均状态，需要有相应参照；不一定天然表示危险，也不适合随意给人的身份或差异贴标签。",
    "The sensor recorded an abnormal rise in temperature.",
    "传感器记录到温度异常升高。",
    "The machine stopped after making an abnormal sound.",
    "机器发出异常声音后停了下来。"
  ],
  [
    "absorb",
    "动词 · 吸收",
    "absorb 可表示材料吸收液体，也可引申为吸收知识；直接接宾语，不因中文“从”就给所有结构加 from。",
    "The cloth can absorb a surprising amount of water.",
    "这块布能吸收相当多的水。",
    "Dark surfaces absorb more light than pale ones.",
    "深色表面比浅色表面吸收更多光。"
  ],
  [
    "academic",
    "形容词 · 学业的、学术的",
    "academic 形容与学校教育、学业或研究有关的事项；academic year 指学年，不等于从一月到十二月的日历年。",
    "Her academic interests include language and history.",
    "她的学术兴趣包括语言和历史。",
    "The academic year begins with a welcome meeting.",
    "学年以一场欢迎会开始。"
  ],
  [
    "accommodate",
    "动词 · 容纳",
    "accommodate 可直接接所容纳的人或物，也能指满足需求；注意两个 c、两个 m 的拼写，不误作 accomodate。",
    "The room can accommodate thirty visitors.",
    "房间能容纳三十位访客。",
    "We moved the shelves to accommodate the larger table.",
    "我们挪动了架子，以容纳更大的桌子。"
  ],
  [
    "account",
    "名词 · 账目、账户记录",
    "account 可指记录收入支出往来的账目，也有叙述、账户等义项；这里限定交易记录，不把所有 account 都译为网络账号。",
    "The account showed every payment made during the month.",
    "账目列出了当月的每一笔付款。",
    "She checked the account against the receipts.",
    "她对照收据核查了账目。"
  ],
  [
    "accuse",
    "动词 · 指责、指控",
    "accuse someone of something 表示指责某人做了某事，of 后可接名词或动名词；不用 accuse someone to do 代替这个结构。",
    "They did not accuse anyone without checking the evidence.",
    "他们没有在核查证据前指责任何人。",
    "She refused to accuse her neighbor of taking the parcel.",
    "她拒绝指责邻居拿了包裹。"
  ],
  [
    "acquire",
    "动词 · 获得",
    "acquire 可指取得物品、技能或知识，语气通常比 get 正式；获得方式由语境说明，不必都理解为花钱购买。",
    "The museum hopes to acquire a set of local maps.",
    "博物馆希望获得一套本地地图。",
    "Students acquire useful skills through practical projects.",
    "学生通过实践项目获得实用技能。"
  ],
  [
    "adjust",
    "动词 · 调整、适应",
    "adjust something 表示调整某物，adjust to something 表示适应；to 在后者是介词，可接名词或动名词，注意两种结构不同。",
    "Please adjust the lamp so the page is brighter.",
    "请调整灯，让书页更亮些。",
    "It took time to adjust to the new timetable.",
    "适应新课表花了一些时间。"
  ],
  [
    "admit",
    "动词 · 承认",
    "admit 可接名词、that 从句或动名词，表示承认事实；admit to doing 也常见，通常不用 admit to do 表示承认做过某事。",
    "I must admit that the instructions were unclear.",
    "我必须承认说明不够清楚。",
    "She was willing to admit making a mistake.",
    "她愿意承认自己犯了错。"
  ],
  [
    "advantage",
    "名词 · 优势、有利因素",
    "advantage 是可数名词，指相对有利的条件；an advantage over 强调相对谁的优势，an advantage of 常说明某方案的好处。",
    "A covered path is an advantage in rainy weather.",
    "有遮盖的通道在雨天是一个优势。",
    "His knowledge of the area gave the team an advantage.",
    "他对当地的了解为团队带来了优势。"
  ],
  [
    "affect",
    "动词 · 影响",
    "affect 作动词常表示影响，直接接宾语；effect 通常作名词表示效果或影响，但有其他专业用法，不能只凭首字母判断所有句子。",
    "Heavy rain may affect the afternoon bus service.",
    "大雨可能影响下午的公交运营。",
    "The position of the window can affect the room's temperature.",
    "窗的位置会影响室温。"
  ],
  [
    "agenda",
    "名词 · 议程",
    "agenda 可指会议待讨论事项的清单，现代英语中通常作可数单数名词使用；on the agenda 表示列入议程，不在前面加 in。",
    "The first item on the agenda is the school garden.",
    "议程第一项是学校花园。",
    "Please send the agenda before Friday's meeting.",
    "请在周五会议前发来议程。"
  ],
  [
    "agreement",
    "名词 · 协议、一致",
    "agreement 可指达成的具体协议，也可指意见一致的状态；reach an agreement 是达成协议，in agreement 是意见一致。",
    "We reached an agreement about sharing the workshop.",
    "我们就共用工作室达成了协议。",
    "The two teachers were in agreement about the new plan.",
    "两位老师对新计划意见一致。"
  ],
  [
    "album",
    "名词 · 相册、专辑",
    "album 可指收集照片等的册子，也可指作为一个整体发行的音乐作品；需要依 photo、music 等语境区别，不只表示单首歌。",
    "She arranged the family photographs in an album.",
    "她把全家照片整理进了相册。",
    "The band's new album includes a song about the sea.",
    "乐队的新专辑包含一首关于海洋的歌。"
  ],
  [
    "allocate",
    "动词 · 分配",
    "allocate 常用 allocate something to someone 或 allocate something for a purpose，表示按对象或用途分配资源，语气较正式。",
    "The school will allocate more time for reading.",
    "学校将分配更多时间用于阅读。",
    "We need to allocate one room to each visiting group.",
    "我们需要给每个来访小组分配一个房间。"
  ],
  [
    "alternative",
    "形容词 · 供选择的、替代的",
    "alternative 作形容词可修饰 route、plan 等，表示另一个可选择方案；不一定是更好的方案，也不同于表示轮流的 alternate。",
    "The guide suggested an alternative route through the village.",
    "导游建议走另一条穿村路线。",
    "We prepared an alternative plan in case of rain.",
    "我们准备了备用方案，以防下雨。"
  ],
  [
    "abide",
    "动词 · 遵守，见 abide by",
    "abide by 是遵守规则、协议的常用结构，by 后接所遵守的内容；单独 abide 还有忍受等义，不能漏掉短语介词。",
    "All visitors must abide by the library rules.",
    "所有访客都必须遵守图书馆规则。",
    "The teams agreed to abide by the referee's decision.",
    "两队同意遵从裁判的决定。"
  ],
  [
    "absurd",
    "形容词 · 荒谬的",
    "absurd 表示极不合理或可笑，语气强于普通 unusual；评价想法时应说明不合理之处，不把不常见本身就当成荒谬。",
    "It would be absurd to heat an empty building all winter.",
    "整个冬天给一座空楼供暖会很荒谬。",
    "The story begins with an absurd misunderstanding.",
    "故事从一个荒谬的误会开始。"
  ],
  [
    "accessory",
    "名词 · 附件、配件",
    "accessory 指非核心但增加便利、美观等的附件，通常可数；法律语境中也可指从犯，这里限物品配件义。",
    "The camera came with one useful accessory.",
    "相机附带一个实用配件。",
    "A waterproof cover is a handy accessory for this bag.",
    "防水罩是这个包的方便配件。"
  ],
  [
    "accomplishment",
    "名词 · 成就、完成的事",
    "accomplishment 可指已成功完成的事情，通常可数；the accomplishment of a task 也可强调完成过程，不一定都表示大型荣誉。",
    "Learning to swim was her proudest accomplishment that summer.",
    "学会游泳是她那个夏天最自豪的成就。",
    "The exhibition celebrates the team's technical accomplishment.",
    "展览庆祝了团队的技术成果。"
  ],
  [
    "accustom",
    "动词 · 使习惯",
    "accustom someone to something 表示使某人习惯，to 是介词，可接名词或动名词；不要直接用 accustom to do 省去被影响者。",
    "The exercises accustom students to listening for key details.",
    "练习让学生习惯留意关键细节。",
    "We tried to accustom the puppy to short car journeys.",
    "我们试着让小狗适应短途乘车。"
  ],
  [
    "acid",
    "名词 · 酸、酸性物质",
    "acid 作名词可指酸类物质或一种具体的酸，可数性依语境变化；日常酸味和化学分类有关，但不能仅凭尝味判断物质安全性。",
    "The diagram shows how an acid reacts with the metal.",
    "示意图展示酸与金属如何反应。",
    "The label identifies the acid used in the experiment.",
    "标签标明了实验中使用的酸。"
  ],
  [
    "acre",
    "名词 · 英亩",
    "acre 是土地面积单位，常见于农田、地产描述；它不是长度单位，不与米或千米直接比较，具体换算需采用面积单位。",
    "The orchard covers one acre behind the house.",
    "屋后的果园占地一英亩。",
    "They set aside an acre for the community garden.",
    "他们划出一英亩土地作为社区花园。"
  ],
  [
    "adaptability",
    "名词 · 适应能力",
    "adaptability 表示面对环境或需求变化时调整的能力，通常不可数；不是一次具体的改动本身，后者可用 an adaptation。",
    "The project tested the team's adaptability.",
    "项目考验了团队的适应能力。",
    "Her adaptability helped her settle into the new school.",
    "她的适应能力帮助她融入新学校。"
  ],
  [
    "adhere",
    "动词 · 黏附、坚持",
    "adhere 常用 adhere to，既可指黏附表面，也可表示遵守规则；to 后接对象，不能在这类结构中直接漏去介词。",
    "The label will not adhere to a dusty surface.",
    "标签粘不牢有灰尘的表面。",
    "All teams must adhere to the agreed schedule.",
    "所有团队都必须遵守商定的时间表。"
  ],
  [
    "adjustment",
    "名词 · 调整",
    "adjustment 可指一次具体调整，也可指逐步适应过程；make an adjustment to 表示对某物作调整，不要把它当作动词直接带宾语。",
    "A small adjustment to the chair made it more comfortable.",
    "对椅子的小调整使它更舒适。",
    "The new timetable required a period of adjustment.",
    "新课表需要一段适应期。"
  ],
  [
    "admission",
    "名词 · 入场许可",
    "admission 可指进入某地的许可或入场相关费用，也能表示承认；free admission 是免费入场，不等于所有项目均免费。",
    "Admission to the exhibition is free on Sundays.",
    "展览周日免费入场。",
    "The ticket includes admission to the main gallery.",
    "票价包含主展厅的入场许可。"
  ],
  [
    "adult",
    "名词 · 成年人",
    "adult 作名词指成年人，也可作形容词修饰课程等；各地具体法律成年标准不同，这里只学习普通词义，不把年龄定义绝对化。",
    "Each group of children must be accompanied by an adult.",
    "每组孩子必须有一位成年人陪同。",
    "The guide spoke to the adult before leading the children inside.",
    "导游先与成年人交谈，再带孩子们进去。"
  ],
  [
    "aesthetic",
    "形容词 · 审美的",
    "aesthetic 表示与美、艺术感受或外观有关的方面；aesthetic appeal 强调视觉等美感，不自动说明功能或结构更好。",
    "The new windows improved the building's aesthetic appeal.",
    "新窗户提升了建筑的美感。",
    "The designer considered both practical and aesthetic needs.",
    "设计师兼顾了实用和审美需求。"
  ],
  [
    "affirm",
    "动词 · 肯定、确认",
    "affirm 是较正式的肯定陈述，可直接接名词或 that 从句；不等于普通随口回答 yes，常用于明确表达信念、有效性等。",
    "The statement will affirm the school's commitment to reading.",
    "声明将肯定学校对阅读的重视与投入。",
    "The judge asked him to affirm that the account was accurate.",
    "法官要求他确认叙述准确。"
  ],
  [
    "afloat",
    "形容词、副词 · 漂浮着",
    "afloat 表示浮在水面，常放在系动词后或 keep 后；keep a boat afloat 是使船保持漂浮，也有维持经营等比喻用法。",
    "The little wooden boat remained afloat after the storm.",
    "暴风雨后，小木船仍浮在水上。",
    "A sealed bottle can stay afloat for a long time.",
    "密封瓶能在水上漂浮很久。"
  ],
  [
    "aggregate",
    "形容词 · 合计的",
    "aggregate 作形容词表示把多个单项合起来的总量，如 aggregate score；不能把它误作 average，合计值与平均值不同。",
    "The aggregate cost includes all three repairs.",
    "合计费用包括三项维修。",
    "The aggregate score placed our team second.",
    "总比分使我们队排在第二。"
  ],
  [
    "agreeable",
    "形容词 · 令人愉快的",
    "agreeable 可描述合意、愉快的事物，语气偏中性正式；agreeable to 还可表示愿意接受某提议，不能一律只译成天气好。",
    "We spent an agreeable afternoon in the garden.",
    "我们在花园度过了愉快的下午。",
    "The warm breeze made the walk more agreeable.",
    "温暖微风让步行更惬意。"
  ],
  [
    "aircraft",
    "名词 · 航空器",
    "aircraft 范围较广，可包括飞机、气球等航空器，单复数同形；不能在复数后加 -s，也不只指固定翼飞机。",
    "The small aircraft landed beyond the field.",
    "小型航空器在田野那边降落。",
    "Several aircraft were displayed outside the museum.",
    "几架航空器陈列在博物馆外。"
  ],
  [
    "alcohol",
    "名词 · 酒精、含酒精饮品",
    "alcohol 在日常语境常指乙醇或含酒精饮品，通常不可数；化学上还有更广泛的醇类概念，这里不将各种用途混为一谈。",
    "The label says that the drink contains no alcohol.",
    "标签注明这种饮品不含酒精。",
    "The exhibition explains how alcohol is produced by fermentation.",
    "展览介绍酒精如何通过发酵产生。"
  ],
  [
    "align",
    "动词 · 排齐",
    "align 表示让物体成一直线或按指定关系对齐，可直接接对象；align with 还可表示与某原则一致，这里先记空间排列义。",
    "Align the edges of the paper before folding it.",
    "折纸前先把边缘对齐。",
    "The carpenter used a string to align the fence posts.",
    "木匠用绳子把篱笆柱排成直线。"
  ],
  [
    "allowance",
    "名词 · 补贴、定额",
    "allowance 可指按期给予的一笔钱或规定可用额度；a travel allowance 是差旅补贴，不一定等于工资或实际所有支出。",
    "The volunteers received a small travel allowance.",
    "志愿者们收到了一小笔差旅补贴。",
    "Her weekly allowance covered the bus fare.",
    "她每周的补贴够付公交车费。"
  ],
  [
    "ally",
    "名词 · 盟友、支持者",
    "ally 作名词可指合作的国家或支持某一目标的人，是可数名词；不只指亲密朋友，合作往往围绕共同目的。",
    "The library found an ally in the local school.",
    "图书馆在本地学校找到了支持者。",
    "Each group became an ally of the other during the campaign.",
    "两组在活动中成为彼此的盟友。"
  ],
  [
    "alphabet",
    "名词 · 字母表",
    "alphabet 指一种书写系统的一套字母，英语通常说 the alphabet；alphabetical 是按字母顺序的形容词，不要混作同一词性。",
    "The children learned the alphabet through songs.",
    "孩子们通过歌曲学习字母表。",
    "The poster shows every letter of the English alphabet.",
    "海报展示了英语字母表中的每个字母。"
  ],
  [
    "altitude",
    "名词 · 高度、海拔",
    "altitude 通常指相对于海平面或其他参照面的垂直高度；不是沿山路走过的距离，描述时应注意参照面。",
    "The pilot checked the aircraft's altitude.",
    "飞行员检查了航空器高度。",
    "The village lies at a higher altitude than the town.",
    "村庄的海拔高于镇子。"
  ],
  [
    "ambassador",
    "名词 · 大使、代表",
    "ambassador 可指一国派驻另一国的正式外交代表，也可用于某组织的形象代表；普通游客不自动具有官方外交身份。",
    "The ambassador visited the cultural exhibition.",
    "大使参观了文化展览。",
    "She became an ambassador for the community reading project.",
    "她成为社区阅读项目的推广代表。"
  ],
  [
    "amend",
    "动词 · 修改、修订",
    "amend 常用于修改文本、规则或计划，使之更合适，语气较正式；直接接宾语，不等于把整个原稿彻底替换。",
    "The committee agreed to amend the final paragraph.",
    "委员会同意修改最后一段。",
    "We can amend the schedule after hearing from the visitors.",
    "收到访客回复后，我们可以修改时间表。"
  ],
  [
    "ample",
    "形容词 · 充足的",
    "ample 表示足够而有余，常与 time、space、evidence 等名词搭配；它不是一般尺寸大的替换词，要体现满足需求的关系。",
    "We have ample time to check the equipment.",
    "我们有充足时间检查设备。",
    "The new hall provides ample space for the exhibition.",
    "新大厅为展览提供了充足空间。"
  ],
  [
    "analyse",
    "动词 · 分析",
    "analyse 是英式常见拼写，美式通常写 analyze；指研究各部分及其关系来理解整体，不只是快速看一眼。",
    "We will analyse the results after the workshop.",
    "工作坊后我们会分析结果。",
    "The students analyse a short poem in each lesson.",
    "学生每节课分析一首短诗。"
  ],
  [
    "anecdote",
    "名词 · 轶事、趣闻",
    "anecdote 通常是一段关于个人经历或有趣事件的短故事，是可数名词；不等于系统证据，正式论证需区分故事与数据。",
    "She began the talk with an anecdote about her first job.",
    "她用第一份工作的一个趣闻开始演讲。",
    "His travel diary includes an amusing anecdote about a lost hat.",
    "他的旅行日记里有一个关于丢帽子的趣事。"
  ],
  [
    "angle",
    "名词 · 角、角度",
    "angle 可指两线相交形成的角及其大小；也能引申为观察问题的角度，不能把它误写成表示天使的 angel。",
    "Use a ruler to draw the angle clearly.",
    "用尺把这个角画清楚。",
    "The lamp can be turned to a different angle.",
    "灯可以转到不同角度。"
  ],
  [
    "announce",
    "动词 · 宣布",
    "announce 直接接所宣布的消息，告知对象可用 to someone；通常不写 announce someone something，应把消息和接收者位置分清。",
    "They will announce the results after lunch.",
    "他们将在午饭后宣布结果。",
    "The guide will announce any changes to the group.",
    "导游会向全组宣布任何变更。"
  ],
  [
    "anonymous",
    "形容词 · 匿名的",
    "anonymous 表示作者、来源或当事人姓名不公开或不明；不等于信息一定不真实，真实性需要另行判断。",
    "The library received an anonymous donation.",
    "图书馆收到了一笔匿名捐款。",
    "The survey allows visitors to remain anonymous.",
    "问卷允许访客保持匿名。"
  ],
  [
    "apologize",
    "动词 · 道歉",
    "apologize to someone for something 表示为某事向某人道歉，for 后可接动名词；通常不用 apologize someone 直接接接受道歉的人。",
    "I will apologize to her for arriving late.",
    "我会为迟到向她道歉。",
    "The shop called to apologize for the delay.",
    "商店打电话为延误道歉。"
  ],
  [
    "appear",
    "动词 · 出现",
    "appear 可表示进入视线，也可表示似乎；此处是出现义，通常不及物，不写成 was appeared 描述物体自然出现。",
    "A small boat began to appear through the mist.",
    "一条小船开始从薄雾中显现。",
    "New leaves appear on the tree each spring.",
    "树上每年春天都会长出新叶。"
  ],
  [
    "appliance",
    "名词 · 器具、电器",
    "appliance 常指为特定用途设计的设备，尤其家用电器，是可数名词；并不是所有小工具或家具都叫 appliance。",
    "The kitchen has space for one more appliance.",
    "厨房还能放一件电器。",
    "Please unplug the appliance before moving it.",
    "移动电器前请拔掉插头。"
  ],
  [
    "apply",
    "动词 · 使用、应用",
    "apply 可表示将方法、知识投入实际使用，常见 apply something to something；申请工作的 apply for 是另一义项，不混用介词。",
    "We can apply this method to the next problem.",
    "我们可以把这个方法用于下一个问题。",
    "The workshop helps students apply their knowledge.",
    "工作坊帮助学生运用知识。"
  ],
  [
    "approach",
    "动词 · 接近",
    "approach 表示逐渐靠近时可直接接地点或对象；不必再加 to，如 approach the gate。名词 an approach to 则另有结构。",
    "Please slow down as you approach the bend.",
    "接近弯道时请减速。",
    "We watched the ferry approach the island.",
    "我们看着渡轮驶近岛屿。"
  ],
  [
    "approve",
    "动词 · 批准、赞同",
    "approve a plan 通常指正式批准计划，approve of something 常表示赞同；是否带 of 改变结构重点，不能机械混用。",
    "The committee will approve the final design next week.",
    "委员会将在下周批准最终设计。",
    "Her parents approve of her decision to study art.",
    "父母赞同她学习艺术的决定。"
  ],
  [
    "architect",
    "名词 · 建筑师",
    "architect 指设计建筑并就建造提供专业意见的人，是可数名词；实际施工人员和建筑设计者承担不同工作，不能全部称 architect。",
    "The architect designed a bright reading room.",
    "建筑师设计了一间明亮的阅览室。",
    "We asked an architect to review the new entrance.",
    "我们请建筑师审看了新入口方案。"
  ],
  [
    "arrange",
    "动词 · 整理、安排",
    "arrange 可指按顺序摆放，也可表示筹备；arrange to do 表示安排自己做，arrange for someone to do 表示安排别人做。",
    "Arrange the cards in alphabetical order.",
    "把卡片按字母顺序排列。",
    "We will arrange for a guide to meet the visitors.",
    "我们会安排一位导游接待访客。"
  ],
  [
    "artificial",
    "形容词 · 人造的",
    "artificial 常指人为制作、用来模仿自然物的东西；不必都带“质量差”或“有害”含义，真假、品质需分别判断。",
    "Artificial flowers decorated the stage.",
    "人造花装饰着舞台。",
    "The room needs artificial light during the afternoon.",
    "这间房下午需要人工照明。"
  ],
  [
    "assess",
    "动词 · 评估",
    "assess 表示经过查看后判断性质、价值或程度，通常直接接对象；assessment 是名词，不把动作和评价结果混为同一词性。",
    "The teacher will assess the final projects.",
    "老师将评估最终项目。",
    "We need to assess the damage before ordering materials.",
    "订购材料前，我们需要评估损坏情况。"
  ],
  [
    "associate",
    "动词 · 联想、联系",
    "associate A with B 表示把两者联系起来，可指记忆联想；associate with someone 也可表示与人交往，结构和重点不同。",
    "I associate this song with our seaside holiday.",
    "这首歌让我联想到海边假期。",
    "People often associate the town with its pottery.",
    "人们常把这个镇与陶器联系起来。"
  ],
  [
    "astonish",
    "动词 · 使十分惊讶",
    "astonish 直接接感到惊讶的人，语气通常较强；感到惊讶用 be astonished，令人惊讶的事物可用 astonishing 修饰。",
    "The size of the ancient bridge will astonish visitors.",
    "古桥的规模会让访客十分惊讶。",
    "Her ability to remember every name continues to astonish me.",
    "她记住每个人名字的本领仍让我惊叹。"
  ],
  [
    "attach",
    "动词 · 固定、附上",
    "attach A to B 表示把 A 固定或附在 B 上；发送邮件时 attach a file 也常见，不把接收对象与附件位置混淆。",
    "Attach the label to the outside of the box.",
    "把标签贴在箱子外面。",
    "Please attach a photograph to the form.",
    "请在表格上附一张照片。"
  ],
  [
    "attend",
    "动词 · 出席",
    "attend a meeting 或 attend school 可直接接活动或机构；attend to 表示处理、照料等，不能给所有出席结构都加 to。",
    "Several parents will attend the evening meeting.",
    "几位家长将出席晚间会议。",
    "She hopes to attend the summer art course.",
    "她希望参加暑期艺术课程。"
  ],
  [
    "audience",
    "名词 · 观众、听众",
    "audience 指观看或聆听某活动的一群人，是集合名词；可数的是一批观众，不把一个观众称为 an audience。",
    "The audience listened quietly to the final poem.",
    "听众安静地聆听最后一首诗。",
    "The small hall was filled with an enthusiastic audience.",
    "小礼堂里坐满了热情的观众。"
  ],
  [
    "average",
    "名词 · 平均数",
    "average 在常见统计语境中可指均值，但也有其他概括中心水平的用法；计算具体结果前要说明采用的统计方法。",
    "We calculated the average of the three measurements.",
    "我们算出了三次测量的平均值。",
    "The class average rose after the extra practice.",
    "额外练习后，全班平均分提高了。"
  ],
  [
    "award",
    "动词 · 授予",
    "award something to someone 或 award someone something 表示授予奖项、金额等；不是获得者主动领取，注意授予者与接受者方向。",
    "The judges will award the prize to the youngest finalist.",
    "评委将把奖颁给最年轻的决赛选手。",
    "The school may award a certificate to each volunteer.",
    "学校可能会给每位志愿者颁发证书。"
  ],
  [
    "belong",
    "动词 · 属于",
    "belong to 后接所有者，通常不用于被动结构；不写 is belonged to。belong 也可表示适合某环境，读时依搭配区分。",
    "These gardening tools belong to the school.",
    "这些园艺工具属于学校。",
    "Does this blue coat belong to anyone here?",
    "这件蓝外套是这里哪位的吗？"
  ],
  [
    "billion",
    "数词 · 十亿",
    "billion 在现代常见英语数值中表示十亿；具体数词后通常不加 -s，如 two billion，泛指大量可用 billions of。",
    "The model represents a distance of one billion kilometers.",
    "模型表示十亿千米的距离。",
    "The report describes a project worth two billion dollars.",
    "报告描述了一个价值二十亿美元的项目。"
  ],
  [
    "boundary",
    "名词 · 边界",
    "boundary 指界定区域或范围的边线、界限，常用 boundary between；可以是实际标记，也可以是抽象限制，不一定是国界。",
    "The fence marks the boundary between the two gardens.",
    "篱笆标出了两个花园的边界。",
    "The old path follows the eastern boundary of the park.",
    "旧路沿着公园东侧边界延伸。"
  ],
  [
    "build",
    "动词 · 建造",
    "build 常指把材料逐步组成建筑或其他整体，也可引申建立能力；过去式和过去分词是 built，不是 builded。",
    "The volunteers plan to build a shelter beside the field.",
    "志愿者计划在田边建一个遮棚。",
    "Small daily tasks can help build confidence.",
    "每天的小任务有助于建立信心。"
  ],
  [
    "bury",
    "动词 · 埋藏",
    "bury 表示放进土中或用东西覆盖，可直接接被埋物；过去式 buried 先把 y 变为 i，注意不要照读音随意拼写。",
    "They will bury the time capsule beneath the new tree.",
    "他们会把时间胶囊埋在新树下面。",
    "The puppy tried to bury its toy in the sand.",
    "小狗试着把玩具埋进沙里。"
  ],
  [
    "cancel",
    "动词 · 取消",
    "cancel 表示不再举行或执行原定事项；postpone 表示推迟，不能把取消和换时间混为一谈。英美常见过去式拼写可不同。",
    "We may cancel the picnic if the storm continues.",
    "如果暴风雨持续，我们可能取消野餐。",
    "Please cancel the duplicate booking before Friday.",
    "请在周五前取消重复的预订。"
  ],
  [
    "capture",
    "动词 · 捕获、捉住",
    "capture 可表示捕获、控制某人或动物，也有记录影像等义项；此处限捉住，不把所有拍摄场景都理解为拘捕。",
    "The team hopes to capture the injured bird safely.",
    "团队希望安全地捕捉那只受伤的鸟。",
    "The trap was designed to capture the animal without hurting it.",
    "陷阱旨在不伤害动物地将其捕获。"
  ],
  [
    "cast",
    "动词 · 投下光影",
    "cast 可与 shadow、light 等连用，表示投射或投下；过去式、过去分词仍为 cast，名词还可指演员阵容或石膏等。",
    "The tall trees cast shadows across the path.",
    "高树把影子投在小路上。",
    "The lantern will cast a soft light over the table.",
    "灯笼会在桌上投下柔和的光。"
  ],
  [
    "cause",
    "名词 · 原因",
    "cause 指导致结果的原因，常见 the cause of；reason 常用于说明理由，两者有交叉，但不能在所有固定结构中直接替换。",
    "The cause of the delay was a broken signal.",
    "延误的原因是信号设备坏了。",
    "The report examines the main cause of the damage.",
    "报告调查了造成损坏的主要原因。"
  ],
  [
    "center",
    "名词 · 中心",
    "center 是美式常见拼写，英式常写 centre；可指空间中央或活动中心，in the center of 常用于具体位置。",
    "A fountain stands in the center of the square.",
    "广场中央有一座喷泉。",
    "The new community center opens next month.",
    "新的社区中心下月开放。"
  ],
  [
    "chance",
    "名词 · 机会",
    "chance 可指做某事的机会，常见 a chance to do；也能表示某结果发生的可能性，两者都需依后接内容判断。",
    "The workshop gives students a chance to use new tools.",
    "工作坊让学生有机会使用新工具。",
    "We missed the chance to visit the tower.",
    "我们错过了参观塔楼的机会。"
  ],
  [
    "character",
    "名词 · 故事人物",
    "character 在故事、戏剧中指角色或人物，是可数名词；它还有性格、文字字符等义项，不能只背一个中文就套用所有场景。",
    "The main character repairs clocks in a small village.",
    "主人公在一个小村里修钟。",
    "Each child chose a character from the story to draw.",
    "每个孩子选了故事中的一个人物来画。"
  ],
  [
    "check",
    "动词 · 检查、核对",
    "check 可直接接要检查的内容；check something against a list 表示对照清单核对，不只是快速看一眼而无需确认。",
    "Check the gate before letting the puppy outside.",
    "让小狗出去前检查一下大门。",
    "Please check each name against the attendance list.",
    "请对照出勤表核对每个名字。"
  ],
  [
    "circumstance",
    "名词 · 情况、条件",
    "circumstance 可指影响事件的某项情况，复数 circumstances 更常用于整体处境；under the circumstances 表示在这种情况下。",
    "The report describes a circumstance that affected the result.",
    "报告描述了影响结果的一项情况。",
    "The same circumstance may require a different response next time.",
    "同样的情况，下次可能需要不同回应。"
  ],
  [
    "civil",
    "形容词 · 有礼貌的",
    "civil 可表示保持基本礼貌，未必特别热情；它也有公民、民事等义项，这里限定交往态度，不与法律用法混淆。",
    "They remained civil despite their disagreement.",
    "尽管意见不同，他们仍保持礼貌。",
    "A civil reply helped the conversation continue calmly.",
    "礼貌的回应让谈话得以平静继续。"
  ],
  [
    "clear",
    "形容词 · 清楚易懂的",
    "clear 可描述说明或表达容易理解，也可描述透明、晴朗等；这里强调信息清楚，不是只说明声音大或字数少。",
    "Her clear instructions helped everyone begin quickly.",
    "她清楚的说明让大家很快开始了。",
    "The map is simple and clear enough for young visitors.",
    "地图简单清晰，适合年幼访客使用。"
  ],
  [
    "clue",
    "名词 · 线索",
    "clue 指帮助解决问题或找到答案的信息，常见 a clue to something；它可以引导调查，却不一定单独证明结论。",
    "The muddy footprints gave us a clue to the puppy's hiding place.",
    "泥脚印为寻找小狗藏身处提供了线索。",
    "One small clue helped her solve the puzzle.",
    "一个小线索帮助她解开了谜题。"
  ],
  [
    "collision",
    "名词 · 碰撞",
    "collision 指物体相撞事件，常见 a collision between 或 a collision with；不是只要两物接触就一定属于猛烈碰撞。",
    "The barrier prevented a collision between the carts.",
    "护栏避免了两辆推车相撞。",
    "The exhibition explains what happens during a particle collision.",
    "展览解释粒子碰撞时会发生什么。"
  ],
  [
    "command",
    "动词 · 命令",
    "command 可用 command someone to do，语气带权威；普通礼貌请求不必用这个强词，名词 command 另可指命令本身。",
    "The officer will command the crew to leave the deck.",
    "军官将命令船员离开甲板。",
    "In the story, the queen can command the guards to open the gate.",
    "故事里，女王能命令守卫开门。"
  ],
  [
    "within",
    "介词 · 在某时间内",
    "within 后接一段时间表示未超过这段时长；within two days 是两天以内，不等于一定在第二天，也不同于 for two days。",
    "Please return the form within a week.",
    "请在一周内交回表格。",
    "We expect an answer within two working days.",
    "我们预计两个工作日内收到回复。"
  ],
  [
    "interest",
    "名词 · 兴趣",
    "interest 表示对某事的关注或兴趣，常用 an interest in 或 show interest in；这里不是借贷利息义，要根据后接内容辨别。",
    "She developed an interest in local history.",
    "她对本地历史产生了兴趣。",
    "The unusual machine caught the children's interest.",
    "那台不寻常的机器引起了孩子们的兴趣。"
  ],
  [
    "include",
    "动词 · 包括",
    "include 表示把某物作为整体的一部分，后面列出的内容不一定穷尽全部；通常直接接宾语，不写 include of。",
    "The ticket will include a guided walk.",
    "票里会包含一次导览步行。",
    "Please include your contact number on the form.",
    "请在表格上填写联系电话。"
  ],
  [
    "line",
    "名词 · 绳、线",
    "line 在这里指细长绳索，可见 washing line、fishing line；它还有队列、文字行等义项，不能把所有 line 都理解为绳子。",
    "The wet towels hung from a line across the yard.",
    "湿毛巾挂在横跨院子的晾衣绳上。",
    "He tied the line securely to the small boat.",
    "他把绳子牢牢系在小船上。"
  ],
  [
    "continue",
    "动词 · 继续",
    "continue 可接动名词或不定式，也可不及物表示继续发生；两种形式常有交叉，不要把每一处 continue to do 都当成未来动作。",
    "We will continue working after a short break.",
    "短暂休息后，我们会继续工作。",
    "The rain may continue through the afternoon.",
    "这场雨可能持续整个下午。"
  ],
  [
    "war",
    "名词 · 战争",
    "war 可指战争这种状态，也可数地指一次具体战争；at war 表示处于交战状态，不能把任何普通争论都照字面称战争。",
    "The museum records how the war changed village life.",
    "博物馆记录了战争如何改变村庄生活。",
    "The novel describes a family separated by war.",
    "小说描写了一个因战争分离的家庭。"
  ],
  [
    "towards",
    "介词 · 朝向",
    "towards 与 toward 都可表示朝某方向，towards 在英式中较常见；表示方向不保证最终到达，不能与 reach 完全等同。",
    "She walked towards the station with a small suitcase.",
    "她提着小行李箱朝车站走去。",
    "The boat drifted towards the island.",
    "船向小岛漂去。"
  ],
  [
    "society",
    "名词 · 协会、学会",
    "society 可指为共同目标组成的协会，是可数名词；泛指社会整体时常不可数，这里限定有具体活动与成员的组织。",
    "The history society meets in the library every month.",
    "历史协会每月在图书馆聚会。",
    "She joined a society that protects local wildlife.",
    "她加入了一个保护本地野生动物的协会。"
  ],
  [
    "probably",
    "副词 · 很可能",
    "probably 表示发生的可能性较高，但不是保证；通常放在实义动词前或 be 后，可与 may、will 等配合表达判断。",
    "The workshop will probably finish before five.",
    "工作坊很可能在五点前结束。",
    "She is probably still at the library.",
    "她很可能还在图书馆。"
  ],
  [
    "actually",
    "副词 · 实际上",
    "actually 常用于纠正原有印象或补充真实情况；它通常不是 currently 的“目前”，不能仅凭字面相似判断时间含义。",
    "The path looks steep, but it is actually quite gentle.",
    "小路看着陡，实际上坡度很缓。",
    "I thought the bag was heavy; actually, it was almost empty.",
    "我以为包很重，其实几乎是空的。"
  ],
  [
    "decision",
    "名词 · 决定",
    "decision 是决定的名词，常用 make a decision、a decision about；decide 才是动词，不把两种词性直接放入同一位置。",
    "The decision about the trip will be made tomorrow.",
    "关于旅行的决定明天作出。",
    "Her decision to stay helped the team finish on time.",
    "她决定留下，帮助团队按时完成。"
  ],
  [
    "reach",
    "动词 · 到达",
    "reach 表示到达地点时通常直接接地点，不加 to；与 arrive at 或 get to 结构不同，不能把介词机械搬过来。",
    "We hope to reach the village before dark.",
    "我们希望天黑前到达村庄。",
    "The parcel should reach your office tomorrow.",
    "包裹应该明天到达你的办公室。"
  ],
  [
    "nation",
    "名词 · 国家、民族共同体",
    "nation 可指具有共同历史文化等联系的人群，也可指政治组织成的国家；不总与 territory 或 government 单独表示的概念等同。",
    "The festival brought together musicians from every nation represented.",
    "节庆汇集了每个参展国家的音乐家。",
    "The museum explores how the nation developed over centuries.",
    "博物馆探讨了这个国家数百年来的发展。"
  ],
  [
    "international",
    "形容词 · 国际的",
    "international 表示涉及两个或更多国家，或跨越国界；不是只要活动很大就一定 international，需有跨国联系。",
    "The school hosted an international science exhibition.",
    "学校举办了一场国际科学展。",
    "Her work requires regular international travel.",
    "她的工作需要定期出国旅行。"
  ],
  [
    "rather",
    "副词 · 宁愿，见 would rather",
    "would rather 后通常接动词原形表达偏好，rather than 可连接比较的选项；不要照 want 的结构写 would rather to do。",
    "I would rather walk than wait for another bus.",
    "我宁愿走路，也不想再等一班公交车。",
    "She would rather read outside when the weather is warm.",
    "天气暖和时，她更愿意在户外阅读。"
  ],
  [
    "voice",
    "名词 · 嗓音",
    "voice 指人等发出的声音，常用于说话、唱歌的嗓音；sound 是更广的声音概念，机器声通常不直接当作人的 voice。",
    "Her voice was calm even when the room became noisy.",
    "房间吵闹起来时，她的嗓音依然平静。",
    "I recognized his voice over the telephone.",
    "我在电话里听出了他的声音。"
  ],
  [
    "relationship",
    "名词 · 关系",
    "relationship 可指人、群体或事物间的联系，不仅是恋爱关系；a relationship between A and B、a relationship with someone 都常见。",
    "The project improved the relationship between the two schools.",
    "项目改善了两所学校之间的关系。",
    "She has a friendly relationship with her neighbors.",
    "她与邻居关系友好。"
  ],
  [
    "training",
    "名词 · 培训、训练",
    "training 通常不可数，可用 a training session 表示一次培训；不能在普通泛指时直接写 a training，具体行业省略用法另论。",
    "The volunteers received training before the museum opened.",
    "博物馆开放前，志愿者接受了培训。",
    "Regular training helped the team work more smoothly.",
    "定期训练让团队合作更顺畅。"
  ],
  [
    "indeed",
    "副词 · 确实",
    "indeed 可以强调真实程度或补充确认，语气往往比普通口语 really 稍正式；它不是每个肯定句都必须添加的词。",
    "The restored room is beautiful indeed.",
    "修复后的房间确实很美。",
    "The task was difficult; indeed, it took the whole afternoon.",
    "任务很难，确实花了整个下午。"
  ],
  [
    "image",
    "名词 · 图像",
    "image 可指照片、屏幕画面等视觉呈现，是可数名词；也能表示心理形象或公众印象，这里限可见图像，不泛指全部文字文件。",
    "The image on the screen was too dark to see clearly.",
    "屏幕上的图像太暗，看不清楚。",
    "She saved a high-quality image of the old map.",
    "她保存了一张高质量的旧地图图像。"
  ],
  [
    "personal",
    "形容词 · 个人的",
    "personal 表示与某个人相关或私人的；personnel 通常指全体员工，拼写相近但含义不同，不能将 personal details 当成员工资料总称。",
    "Please keep your personal belongings beside your seat.",
    "请把个人物品放在座位旁。",
    "The notebook contains personal reflections on the journey.",
    "笔记本里写着旅途中的个人感想。"
  ],
  [
    "board",
    "名词 · 木板",
    "board 在此指长宽较大、厚度较小的木板，是可数名词；告示板、董事会及登船等义项也常见，要看名词或动词位置。",
    "A loose board creaked beneath his foot.",
    "一块松动木板在他脚下吱呀作响。",
    "We need one more board to finish the shelf.",
    "我们还需要一块木板才能完成架子。"
  ],
  [
    "election",
    "名词 · 选举",
    "election 指通过投票等方式选出人员的过程，通常可数；不能只把所有选择行为都叫 election，普通选择常用 choice。",
    "The school held an election for the student council.",
    "学校举行了学生会选举。",
    "The election results were posted beside the entrance.",
    "选举结果贴在入口旁。"
  ],
  [
    "various",
    "形容词 · 各种各样的",
    "various 常修饰复数可数名词，表示不止一种或多个不同对象；通常不写 various book，也不必加 of 直接连接名词。",
    "The market sells various kinds of local cheese.",
    "市场出售各种本地奶酪。",
    "Students suggested various ways to save water.",
    "学生们提出了多种节水方法。"
  ],
  [
    "loss",
    "名词 · 丧失、损失",
    "loss 是名词，lose 是动词；the loss of something 指失去某物，lost 则是过去式或形容词，三者不能按同一词性替换。",
    "The loss of the old photographs saddened the family.",
    "旧照片的丢失让这家人难过。",
    "The report describes the loss of several important records.",
    "报告描述了几份重要记录的丢失。"
  ],
  [
    "goal",
    "名词 · 目标",
    "goal 可指努力追求的目标，也可指球门或进球；set a goal、reach a goal 常用于计划语境，不能都按体育义解释。",
    "Her goal is to read one short story each week.",
    "她的目标是每周读一篇短故事。",
    "The team set a clear goal for the next month.",
    "团队为下个月定下了明确目标。"
  ],
  [
    "recently",
    "副词 · 最近",
    "recently 指距当前较近的一段时间，可与过去时或现在完成时等搭配；不意味着动作一定持续到现在，需结合动词与上下文。",
    "The library recently added a quiet study room.",
    "图书馆最近增设了一间安静自习室。",
    "We have recently started a small reading group.",
    "我们最近成立了一个小阅读组。"
  ],
  [
    "relation",
    "名词 · 联系、关系",
    "relation 可指事物间的联系，常见 in relation to 表示与……有关；它也有亲属、叙述等义项，不能全部译成恋爱关系。",
    "The chart shows the relation between temperature and growth.",
    "图表显示了温度与生长的关系。",
    "We studied the village in relation to the nearby river.",
    "我们结合附近河流研究了这个村庄。"
  ],
  [
    "protect",
    "动词 · 保护",
    "protect someone or something from 或 against 表示防止某种伤害；保护对象直接作宾语，风险或威胁放在介词后。",
    "The cover will protect the bicycle from rain.",
    "罩子会保护自行车免受雨淋。",
    "We planted bushes to protect the garden from strong winds.",
    "我们种了灌木，保护花园免受强风影响。"
  ],
  [
    "whatever",
    "代词、连接用法 · 无论什么",
    "whatever 可指任何……的事物，也可引出不管什么情况；后接名词时也可作限定词，不把它只当成随意回答的“随便”。",
    "You can choose whatever suits your project.",
    "你可以选择任何适合项目的东西。",
    "Whatever happens, we will keep the entrance clear.",
    "无论发生什么，我们都会保持入口畅通。"
  ],
  [
    "recognize",
    "动词 · 认出",
    "recognize 可指凭已有记忆认出人或事物，也有承认等义项；美式常见 recognize，英式也常见 recognise，含义不因拼写而改变。",
    "I did not recognize the house after the repairs.",
    "修缮后，我没认出那座房子。",
    "She can recognize most local birds by their calls.",
    "她能凭叫声认出大多数本地鸟类。"
  ],
  [
    "county",
    "名词 · 郡、县等行政区域",
    "county 是某些国家的一种地区划分，具体权限和规模依国家而异；不是 country“国家”，不要忽略中间字母 r 的区别。",
    "The county has several small public libraries.",
    "这个郡有几家小型公共图书馆。",
    "A map of the county hung in the visitor center.",
    "游客中心里挂着一幅郡地图。"
  ],
  [
    "wonder",
    "动词 · 想知道、感到疑惑",
    "wonder 可接疑问词从句或 if、whether，表达好奇或不确定；从句用陈述语序，不写 I wonder where is the key。",
    "I wonder why the gate is locked.",
    "我想知道大门为什么锁着。",
    "We wonder whether the old boat can be repaired.",
    "我们想知道旧船能否修好。"
  ],
  [
    "message",
    "名词 · 信息、口信",
    "message 指可传递的一条信息，通常可数；send a message、leave a message 常见，不与通常不可数的 information 混用数量结构。",
    "Please leave a message if nobody answers.",
    "如果无人接听，请留言。",
    "Her message explained the change in the meeting place.",
    "她的消息说明了会议地点的变更。"
  ],
  [
    "lawyer",
    "名词 · 律师",
    "lawyer 指从事法律咨询、诉讼等专业工作的人，是可数名词；具体资格名称随地区不同，不把所有相关法律岗位完全等同。",
    "The lawyer explained the document in plain language.",
    "律师用通俗语言解释了文件。",
    "A local lawyer volunteered at the community center.",
    "一位本地律师在社区中心做志愿服务。"
  ],
  [
    "gun",
    "名词 · 枪",
    "gun 可指枪械，也见于某些发射或喷射工具名称；此处限枪械义，不能因 glue gun 的组合把所有 gun 都理解为武器。",
    "The museum displayed an old gun behind glass.",
    "博物馆在玻璃后展出了一支旧枪。",
    "The actor carried a clearly marked imitation gun.",
    "演员拿着一支标记清楚的仿制枪。"
  ],
  [
    "title",
    "名词 · 标题、名称",
    "title 可指书、文章、电影等作品的名称，是可数名词；也可指头衔等，不能只按屏幕位置把所有 title 都当作职位。",
    "The title of the story gives a hint about the ending.",
    "故事标题暗示了结局。",
    "She wrote the title above the first paragraph.",
    "她把标题写在第一段上方。"
  ],
  [
    "executive",
    "名词 · 主管、管理人员",
    "executive 作名词可指组织中负责管理的人，不等于每位员工；作形容词还有行政等用法，句中身份须结合词性理解。",
    "A senior executive visited the training workshop.",
    "一位高级主管参观了培训工作坊。",
    "The executive asked for a shorter report.",
    "主管要求报告更简短些。"
  ],
  [
    "remove",
    "动词 · 移走、去除",
    "remove 直接接要移除的对象，remove A from B 表示从 B 去掉 A；不是把对象挪向何处就一律用 from，要分清起点。",
    "Remove the old label from the box.",
    "把箱子上的旧标签去掉。",
    "Please remove wet shoes before entering the reading room.",
    "进入阅览室前请脱掉湿鞋。"
  ],
  [
    "religious",
    "形容词 · 宗教的",
    "religious 表示与宗教信仰、活动有关，也可描述有宗教信仰的人；不能仅凭建筑古老就判定它是宗教建筑。",
    "The museum explains the island's religious traditions.",
    "博物馆介绍了岛上的宗教传统。",
    "The hall is sometimes used for religious ceremonies.",
    "大厅有时用于宗教仪式。"
  ],
  [
    "unless",
    "连词 · 除非",
    "unless 引出例外条件，常相当于 if not，但不是所有结构都能机械互换；通常无需再给从句加否定来重复“除非不”。",
    "We will eat outside unless it rains.",
    "除非下雨，否则我们会在户外吃饭。",
    "Do not enter the room unless a staff member invites you.",
    "除非工作人员邀请，否则不要进入房间。"
  ],
  [
    "imagine",
    "动词 · 想象",
    "imagine 可接名词、从句或动名词；imagine doing 表示想象做某事，通常不用 imagine to do 来替代这个结构。",
    "Imagine living in the village a hundred years ago.",
    "想象一下百年前住在这个村庄的生活。",
    "Can you imagine how bright the room will look?",
    "你能想象房间会显得多明亮吗？"
  ],
  [
    "original",
    "形容词 · 原来的、原作的",
    "original 可表示最早的版本、供复制的原作，也可表示有创意；这里先记原版含义，不等于目前最新或质量最好。",
    "The original map is kept in a locked case.",
    "原地图存放在上锁的盒子里。",
    "We restored the door to its original color.",
    "我们把门恢复成了原来的颜色。"
  ],
  [
    "pain",
    "名词 · 疼痛",
    "pain 指身体疼痛时可不可数地描述总体感受，也可用 a pain in 表示某部位一次或一类疼痛；不等于所有疲劳或情绪。",
    "She described a sharp pain in her shoulder.",
    "她描述肩部有一阵剧痛。",
    "The character tried to hide his pain during the journey.",
    "故事人物在旅途中试着掩饰疼痛。"
  ],
  [
    "advice",
    "名词 · 建议",
    "advice 通常不可数，一条建议用 a piece of advice；advise 是动词，不写 an advice 或用 advice someone 表示建议某人。",
    "The guide gave us useful advice about the route.",
    "导游给了我们有关路线的实用建议。",
    "Her advice helped me choose a suitable course.",
    "她的建议帮我选了合适的课程。"
  ],
  [
    "writer",
    "名词 · 作家、写作者",
    "writer 指写作的人，可指职业作家或特定文字的作者；author 常强调作品作者，两者可重叠，但不等于出版机构。",
    "The writer spent a month researching village life.",
    "作家花了一个月研究村庄生活。",
    "A young writer read her story to the class.",
    "一位年轻写作者给全班朗读了自己的故事。"
  ],
  [
    "depend",
    "动词 · 依赖、取决于",
    "depend 常接 on 或 upon，表示依靠或由某条件决定；不把依赖对象直接接在 depend 后，常见 It depends on the weather。",
    "The trip will depend on the weather.",
    "能否出游将取决于天气。",
    "Young plants depend on regular watering.",
    "幼苗依赖定期浇水。"
  ],
  [
    "sexual",
    "形容词 · 与性、生殖有关的",
    "sexual 是形容词，可在生物学中修饰 reproduction 等，表示涉及性或两性；不是 sex 的名词替换，需看具体学科搭配。",
    "The diagram compares sexual and asexual reproduction.",
    "示意图比较了有性生殖和无性生殖。",
    "The biology lesson explains sexual reproduction in flowering plants.",
    "生物课讲解开花植物的有性生殖。"
  ],
  [
    "german",
    "名词、形容词 · 德语、德国的",
    "表示德语或德国相关事物时 German 首字母大写；词库检索小写不改变正式书写规范，语言名词通常不随意加冠词。",
    "She reads short stories in German.",
    "她阅读德语短篇故事。",
    "The exhibition includes work by a German designer.",
    "展览包括一位德国设计师的作品。"
  ],
  [
    "reality",
    "名词 · 现实",
    "reality 可表示与想象相对的真实情况，常见 in reality；a reality 可指已经成为事实的具体事物，不一定所有用法都不可数。",
    "In reality, the path was much shorter than it looked.",
    "实际上，小路比看起来短得多。",
    "The new library finally became a reality.",
    "新图书馆终于成为现实。"
  ],
  [
    "collection",
    "名词 · 收藏、收集品",
    "collection 可指一组收集起来的物品，通常可数，也可表示收集过程；a collection of maps 说明具体内容，不等于单张地图。",
    "The museum owns a collection of old clocks.",
    "博物馆拥有一批旧钟藏品。",
    "Her postcard collection fills three small albums.",
    "她收藏的明信片装满了三本小册子。"
  ],
  [
    "document",
    "名词 · 文件",
    "document 可指提供信息或证据的书面、电子等文件，是可数名词；作动词则可表示记录，不能在句中忽略词性区别。",
    "The document lists every item in the donation.",
    "文件列出了捐赠的每件物品。",
    "Please save the document before closing the window.",
    "关闭窗口前请保存文件。"
  ],
  [
    "painting",
    "名词 · 绘画作品",
    "painting 指一幅画时可数，指绘画这种活动时通常不可数；a painting by someone 说明作者，与画面描绘对象不同。",
    "The painting shows the village before the bridge was built.",
    "画作描绘了桥建成前的村庄。",
    "A small painting hung above the fireplace.",
    "壁炉上方挂着一幅小画。"
  ],
  [
    "district",
    "名词 · 地区、区域",
    "district 可指行政区域，也可指有共同特点的城区；具体职责与国家制度相关，这里不将它定义为统一面积的地理单位。",
    "The district has three schools and a public library.",
    "这个地区有三所学校和一家公共图书馆。",
    "We walked through the old market district.",
    "我们步行穿过了老市场区。"
  ],
  [
    "highly",
    "副词 · 高度地、非常",
    "highly 常与评价、受欢迎程度等词搭配，如 highly skilled；high 常直接描述高处，不把 jump high 一般改成 jump highly。",
    "The course is highly popular with new volunteers.",
    "这门课程非常受新志愿者欢迎。",
    "She is a highly skilled woodworker.",
    "她是一位技艺高超的木工。"
  ],
  [
    "fresh",
    "形容词 · 新鲜的",
    "fresh 描述食物尚未陈旧、变质，或刚获得的东西；不等于所有未煮熟的 raw，也不保证适合任何饮食用途。",
    "We bought fresh bread on the way home.",
    "我们回家路上买了新鲜面包。",
    "The kitchen uses fresh herbs from the garden.",
    "厨房使用花园里采来的新鲜香草。"
  ],
  [
    "global",
    "形容词 · 全球的",
    "global 表示涉及整个世界或世界范围，international 只需涉及多个国家；二者有关联，但不能把跨国活动都说成覆盖全球。",
    "The lesson looks at global patterns of rainfall.",
    "课程研究全球降雨分布。",
    "The internet gives the small museum a global audience.",
    "互联网让小博物馆拥有了全球观众。"
  ],
  [
    "hardly",
    "副词 · 几乎不",
    "hardly 常表示几乎没有或几乎不，语义带否定；hard 可表示努力地或艰难地，不能把 work hard 改成 work hardly。",
    "We could hardly hear the speaker over the wind.",
    "风声太大，我们几乎听不清讲话者。",
    "There is hardly any space left on the shelf.",
    "架子上几乎没有剩余空间了。"
  ],
  [
    "sale",
    "名词 · 出售",
    "sale 指出售行为，也可指降价销售活动；for sale 表示待售，on sale 在某些语境中表示促销，不能机械视为同一含义。",
    "The old boat is now for sale.",
    "那条旧船现在待售。",
    "The sale of handmade cards raised money for the library.",
    "手工贺卡的销售为图书馆筹了款。"
  ],
  [
    "trust",
    "名词 · 信任",
    "trust 指对人或事物能力、可靠性的信任，通常不可数；have trust in someone 表示信任某人，不把它当成一次具体承诺。",
    "The project depends on trust between the two teams.",
    "项目依赖两个团队间的信任。",
    "Clear communication helped rebuild the visitors' trust.",
    "清晰沟通帮助重新赢得访客信任。"
  ],
  [
    "investigation",
    "名词 · 调查",
    "investigation 指为了查清情况进行的仔细调查，常用 an investigation into something；可用于科学、事故等，并不只指警方办案。",
    "The investigation into the damaged roof took a week.",
    "屋顶受损情况的调查花了一周。",
    "The class carried out an investigation of local water use.",
    "全班调查了当地的用水情况。"
  ],
  [
    "normally",
    "副词 · 通常、正常地",
    "normally 可说明通常的习惯，也可说明运行正常；前者与 usually 有交叉，机器 working normally 则强调状态符合正常标准。",
    "The library normally closes at six.",
    "图书馆通常六点关门。",
    "The printer is working normally again.",
    "打印机又正常工作了。"
  ],
  [
    "beginning",
    "名词 · 开始、开端",
    "beginning 指时间或内容的开始部分，常用 at the beginning of；in the beginning 常泛指最初，不必始终带 of 说明对象。",
    "The beginning of the story takes place in winter.",
    "故事开头发生在冬天。",
    "We checked the tools at the beginning of the workshop.",
    "工作坊开始时，我们检查了工具。"
  ],
  [
    "hole",
    "名词 · 洞、孔",
    "hole 是物体中的开口或空缺，通常可数；a hole in 表示某物上的洞，挖出来的坑也可依语境称 hole。",
    "There is a small hole in the bottom of the bucket.",
    "桶底有一个小洞。",
    "The gardener dug a hole for the new tree.",
    "园丁为新树挖了一个坑。"
  ],
  [
    "distance",
    "名词 · 距离",
    "distance 指两点间的距离，可用 the distance between A and B；in the distance 表示在远处，不直接说明距离的具体数值。",
    "The map shows the distance between the two villages.",
    "地图标出了两个村庄之间的距离。",
    "We could see a tower in the distance.",
    "我们能看到远处一座塔。"
  ],
  [
    "speed",
    "名词 · 速度",
    "speed 指运动快慢，不包含方向这一条件；at a speed of 加数值单位可说明速度，不能把单纯行程长度直接当速度。",
    "The boat moved at a steady speed.",
    "船以稳定速度前进。",
    "Please reduce your speed near the school gate.",
    "靠近校门时请减速。"
  ],
  [
    "willing",
    "形容词 · 愿意的",
    "willing to do 表示愿意做某事，后接不定式；它说明意愿，不保证已经具备能力，也不表示动作肯定完成。",
    "Several students are willing to help with the garden.",
    "几位学生愿意帮忙打理花园。",
    "She was willing to try a different method.",
    "她愿意试试另一种方法。"
  ],
  [
    "conclusion",
    "名词 · 结论",
    "conclusion 可指根据推理得到的判断，常用 reach a conclusion；也可指末尾部分，不能把文章最后一段都自动当成已经证明的结论。",
    "We cannot reach a conclusion from one example.",
    "我们不能根据一个例子得出结论。",
    "The report's conclusion explains why the plan should change.",
    "报告的结论解释了计划为何应调整。"
  ],
  [
    "ignore",
    "动词 · 不理会、忽视",
    "ignore 表示不去注意或回应，通常直接接对象；与不知道 not know 不完全相同，可能已经知道却选择不处理。",
    "Do not ignore the warning near the broken steps.",
    "不要忽视破台阶旁的警告。",
    "She decided to ignore the distracting noise and keep reading.",
    "她决定不理会干扰噪声，继续阅读。"
  ],
  [
    "possibly",
    "副词 · 可能、或许",
    "possibly 表示存在可能性，语气依 can、could 等结构而变；Can you possibly 也可加强请求，不是精确的概率百分比。",
    "The workshop could possibly move to the larger room.",
    "工作坊可能会移到较大的房间。",
    "Could you possibly bring an extra chair?",
    "你能不能多带一把椅子？"
  ],
  [
    "largely",
    "副词 · 主要地、很大程度上",
    "largely 常表示在很大程度上或主要因为，并不是单纯描述体积大的 large 的替换；largely successful 也不等于完全成功。",
    "The project was largely funded by local donations.",
    "项目主要由本地捐款资助。",
    "The old house remained largely unchanged.",
    "老房子基本保持原样。"
  ],
  [
    "farmer",
    "名词 · 农场主、农业经营者",
    "farmer 指种植作物或饲养动物等从事农业的人，通常可数；不必在所有情况下都是土地所有者，也不同于每位园艺爱好者。",
    "The farmer showed us how the young trees were planted.",
    "农场主给我们演示了幼树如何栽种。",
    "A local farmer supplies vegetables to the school kitchen.",
    "一位本地农户为学校厨房供应蔬菜。"
  ],
  [
    "confidence",
    "名词 · 信心、信任",
    "confidence 可表示对自身能力的信心，也可表示对他人的信任，通常不可数；confidence in someone 表示对某人有信心，confident 则是形容词。",
    "Practice gave her confidence to speak in front of the class.",
    "练习让她有信心在全班面前讲话。",
    "The team has confidence in the new guide.",
    "团队对新导游有信心。"
  ],
  [
    "visitor",
    "名词 · 访客、参观者",
    "visitor 指到某处探访或参观的人，通常可数；a visitor to the museum 说明访问地点，不一定只指外地旅行者。",
    "Every visitor received a small map at the entrance.",
    "每位参观者在入口都领到了一张小地图。",
    "A visitor from the next village asked about the course.",
    "一位来自邻村的访客询问了课程情况。"
  ]
];

// Additional original notes; references opened on 2026-10-24.
const additions = [
  [
    "introduction",
    "名词 · 入门介绍",
    "introduction to 常用于某主题的入门介绍；它也可指书的导言，不表示已经详细讲完全部内容。",
    "This booklet is an introduction to local birds.",
    "这本小册子是本地鸟类的入门介绍。",
    "Read the introduction before opening the first chapter.",
    "打开第一章前先读导言。"
  ],
  [
    "extremely",
    "副词 · 极其",
    "extremely 加强形容词或副词的程度；它表示程度非常高，本身并不带 too 所含的过度评价。",
    "The mountain path was extremely narrow.",
    "山路极其狭窄。",
    "The new machine runs extremely quietly.",
    "新机器运转起来极为安静。"
  ],
  [
    "wonderful",
    "形容词 · 极好的",
    "wonderful 可称赞经历、表现或事物非常好，带鲜明赞许语气；并不是表示实际奇迹发生的专用词。",
    "You have chosen a wonderful place for the picnic.",
    "你选了一个极好的野餐地点。",
    "The volunteers did a wonderful job restoring the garden.",
    "志愿者出色地修复了花园。"
  ],
  [
    "traffic",
    "名词 · 道路交通",
    "traffic 指来往的车辆或交通流量，通常不可数；堵车常说 heavy traffic，不把一辆车叫作 a traffic。",
    "Traffic was light on the bridge this morning.",
    "今天早晨桥上的车辆很少。",
    "Heavy traffic delayed the school bus.",
    "繁忙的交通耽误了校车。"
  ],
  [
    "northern",
    "形容词 · 北部的",
    "northern 修饰位于北部或与北部相关的地方，常置于名词前；表示朝北的移动则通常用 north。",
    "Snow covered the northern hills.",
    "积雪覆盖了北部山丘。",
    "The northern entrance closes at dusk.",
    "北面的入口在黄昏关闭。"
  ],
  [
    "learning",
    "名词 · 学习过程",
    "learning 作名词可指获取知识技能的过程，通常不可数；这里不是 learn 的进行时谓语。",
    "Games can make language learning more enjoyable.",
    "游戏能让语言学习更有趣。",
    "The course combines learning with practical work.",
    "这门课程将学习与实践结合起来。"
  ],
  [
    "theatre",
    "名词 · 剧院",
    "theatre 是常见英式拼写，theater 常见于美式；此处指演出场所，不是每个大型建筑都能如此称呼。",
    "The theatre has a small stage and wooden seats.",
    "这座剧院有小舞台和木座椅。",
    "We met outside the theatre before the play.",
    "开演前我们在剧院外碰面。"
  ],
  [
    "usual",
    "形容词 · 惯常的",
    "usual 指符合习惯或通常发生的情况；as usual 表示像往常一样，usual 与副词 usually 词性不同。",
    "She took her usual seat beside the window.",
    "她坐在窗边惯常的座位上。",
    "The bakery opened early as usual.",
    "面包店像往常一样很早开门。"
  ],
  [
    "photograph",
    "名词 · 照片",
    "photograph 指通过摄影得到的图像，是可数名词；take a photograph 表示拍照，不用 draw 表示拍摄动作。",
    "An old photograph hung above the piano.",
    "钢琴上方挂着一张老照片。",
    "May I take a photograph of your garden?",
    "我可以给你的花园拍张照片吗？"
  ],
  [
    "writing",
    "名词 · 书写、写作",
    "writing 作名词可指写作活动，也可指写下的文字；in writing 表示以书面形式，不特指纸质文件。",
    "The tutor gives feedback on my writing every week.",
    "导师每周对我的写作提出反馈。",
    "Please confirm the change in writing.",
    "请以书面形式确认这项变更。"
  ],
  [
    "search",
    "动词 · 搜查、查找",
    "search a place 表示搜查某个地方；search for something 强调查找目标，注意地点与目标的结构差别。",
    "We need to search the attic before moving out.",
    "搬走前我们得搜查阁楼。",
    "Use the map to search for the nearest library.",
    "使用地图寻找最近的图书馆。"
  ],
  [
    "hate",
    "名词 · 憎恨",
    "hate 作名词指强烈厌恶或敌意，通常不可数；比一般的不喜欢语气重，不能把所有分歧都叫憎恨。",
    "The story shows how fear can turn into hate.",
    "这个故事展示了恐惧如何变成憎恨。",
    "She refused to answer their hate with more anger.",
    "她拒绝用更多愤怒回应他们的憎恨。"
  ],
  [
    "leading",
    "形容词 · 领先的、主要的",
    "leading 置于名词前可指排名靠前或重要的；这里是形容词，不是 lead 的进行时动作。",
    "A leading researcher will speak at the workshop.",
    "一位杰出研究人员将在研讨会上发言。",
    "The leading article discusses the town's water supply.",
    "头条文章讨论了镇上的供水问题。"
  ],
  [
    "instruction",
    "名词 · 指示",
    "instruction 指一条要求遵循的指示，操作说明常用复数 instructions；此义不同于泛指教学的不可数用法。",
    "One instruction on the label was difficult to read.",
    "标签上有一条指示很难辨认。",
    "Follow the instructions before assembling the shelf.",
    "组装架子前先按说明操作。"
  ],
  [
    "salt",
    "名词 · 食盐",
    "salt 指调味用的盐时通常不可数，少量可说 a pinch of salt；化学中的一种盐则有可数用法。",
    "Add a pinch of salt to the flour.",
    "往面粉里加一小撮盐。",
    "There is enough salt in the sauce already.",
    "酱汁里已经有足够的盐了。"
  ],
  [
    "planet",
    "名词 · 行星",
    "planet 指绕恒星运行的行星，可数；日常表达 the planet 也可特指地球，要根据语境判断。",
    "The telescope detected a planet around a distant star.",
    "望远镜发现了一颗环绕遥远恒星的行星。",
    "The book compares the size of each planet.",
    "这本书比较了各颗行星的大小。"
  ],
  [
    "whilst",
    "连词 · 当……时",
    "whilst 多用于英式英语，可像 while 一样引导同时发生的事情；它是连词，后面可接完整从句。",
    "She watered the plants whilst I swept the path.",
    "我扫小路时，她给植物浇水。",
    "Please keep the lid closed whilst the machine is running.",
    "机器运行时请保持盖子关闭。"
  ],
  [
    "seriously",
    "副词 · 认真地",
    "seriously 可表示认真而非开玩笑的态度；take something seriously 是认真对待，别一律译成伤势严重。",
    "We should seriously consider her suggestion.",
    "我们应该认真考虑她的建议。",
    "The team takes every safety report seriously.",
    "团队认真对待每一份安全报告。"
  ],
  [
    "partly",
    "副词 · 部分地",
    "partly 表示在一定程度上成立，不能推断为全部；partly because 可指出多个原因中的一部分。",
    "The path was partly hidden by fallen leaves.",
    "小路有一部分被落叶遮住了。",
    "The delay was partly because the road was flooded.",
    "延误的部分原因是道路被淹了。"
  ],
  [
    "guide",
    "名词 · 导游、向导",
    "guide 可指引路或介绍景点的人，是可数名词；也可指指南书，必须靠上下文辨认对象。",
    "Our guide explained the carvings above the doorway.",
    "导游解释了门上方的雕刻。",
    "A local guide led us through the forest.",
    "一位本地向导带我们穿过森林。"
  ],
  [
    "sixty",
    "数词 · 六十",
    "sixty 表示六十，区别于 sixteen 的十六；in one's sixties 指六十多岁，复数结尾不能省去。",
    "The hall has room for sixty people.",
    "大厅可容纳六十人。",
    "My aunt learned to paint in her sixties.",
    "我姨妈六十多岁时学会了画画。"
  ],
  [
    "initiative",
    "名词 · 主动性",
    "initiative 指主动发起行动的能力或意愿时通常不可数；take the initiative 则是率先行动，不能只译成计划。",
    "The teacher praised her initiative in organizing the visit.",
    "老师赞扬了她主动组织参观。",
    "He took the initiative and called the missing volunteer.",
    "他主动打电话给缺席的志愿者。"
  ],
  [
    "comfortable",
    "形容词 · 舒适的",
    "comfortable 可形容让身体舒服的物品或感到自在的人；comfortably 才是修饰坐、睡等动作的副词。",
    "This chair is comfortable enough for a long interview.",
    "这把椅子足够舒适，适合长时间采访。",
    "Are you comfortable in that heavy coat?",
    "穿着那件厚外套你舒服吗？"
  ],
  [
    "truly",
    "副词 · 真正地、真诚地",
    "truly 可强调真实程度或诚恳态度，常置于形容词前；拼写由 true 变来时去掉末尾的 e。",
    "The children were truly excited about the trip.",
    "孩子们真的很期待这次出游。",
    "I am truly grateful for your patient guidance.",
    "我真诚地感谢你耐心的指导。"
  ],
  [
    "combination",
    "名词 · 组合",
    "combination of A and B 表示两者结合的组合；指密码锁的数字组合时则强调特定顺序，不能混用语境。",
    "The room uses a combination of blue and white.",
    "这个房间采用蓝白组合。",
    "A combination of rain and wind damaged the tents.",
    "风雨交加使帐篷受损。"
  ],
  [
    "interpretation",
    "名词 · 解释、理解",
    "interpretation of 指对文字、证据等的理解或解释；同一材料可有不同理解，不等于已经证实的事实。",
    "Her interpretation of the poem surprised the class.",
    "她对诗的解读让全班惊讶。",
    "The diagram allows more than one interpretation.",
    "这张图可以有不止一种解释。"
  ],
  [
    "soil",
    "名词 · 土壤",
    "soil 指植物生长的土壤时通常不可数；a sample of soil 是一份土样，不能把单颗土粒叫 a soil。",
    "The soil beneath the tree was still damp.",
    "树下的土壤仍很湿。",
    "Mix the compost into the soil before planting.",
    "栽种前把堆肥混入土壤。"
  ],
  [
    "crazy",
    "形容词 · 狂热喜爱的",
    "crazy about 是口语中非常喜爱某人或某事；它不同于描述疾病，避免用 crazy 随意称呼患者。",
    "My brother is crazy about old maps.",
    "我弟弟特别喜欢老地图。",
    "She is crazy about the band's new album.",
    "她非常喜欢乐队的新专辑。"
  ],
  [
    "deputy",
    "名词 · 副手",
    "deputy 指能代表上级行事的副手，常在职位名称前出现；不是所有普通助手都有代理决策的权限。",
    "The deputy will lead the meeting while the director is away.",
    "主任不在时由副手主持会议。",
    "She was appointed deputy head of the research team.",
    "她获任研究团队的副负责人。"
  ],
  [
    "meanwhile",
    "副词 · 与此同时",
    "meanwhile 用来转到同时发生或等待期间发生的另一件事；作为句子连接副词，不能仅用逗号粘连两个独立句。",
    "The soup was simmering. Meanwhile, we prepared the bread.",
    "汤正小火炖着。与此同时，我们准备了面包。",
    "The printer is warming up; meanwhile, check the address list.",
    "打印机正在预热；这期间先检查地址表。"
  ],
  [
    "topic",
    "名词 · 话题",
    "topic 是讨论、讲话或文章涉及的主题，可数；a topic for discussion 指供讨论的问题，不必是文章标题。",
    "Choose a topic that interests your partner.",
    "选一个搭档感兴趣的话题。",
    "The topic of the lecture was urban wildlife.",
    "讲座的主题是城市野生动物。"
  ],
  [
    "tank",
    "名词 · 储液罐",
    "tank 可指储存水或燃料的大容器，常说 water tank；军事上的坦克是另一义项，需靠搭配判断。",
    "Rainwater flows into a tank behind the school.",
    "雨水流进学校后面的储水罐。",
    "The fuel tank was almost empty.",
    "油箱几乎空了。"
  ],
  [
    "era",
    "名词 · 时代",
    "era 指具有鲜明人物或特征的一段时期，通常可数；不适合把任意短暂的一分钟都称为一个时代。",
    "The railway marked the start of a new era for the town.",
    "铁路标志着小镇新时代的开始。",
    "The museum displays tools from the industrial era.",
    "博物馆展示工业时代的工具。"
  ],
  [
    "grey",
    "形容词 · 灰色的",
    "grey 和 gray 都是认可的拼写，grey 常用于英国等地，gray 在美国更常见；两者并非两种不同颜色。",
    "A grey cloud covered the hilltop.",
    "一片灰云遮住了山顶。",
    "He wore a grey scarf to the concert.",
    "他戴着灰围巾去听音乐会。"
  ],
  [
    "ideal",
    "形容词 · 最合适的",
    "ideal for 表示对某种用途十分合适；不必声称在所有方面都完美，评价所针对的用途很重要。",
    "This shallow pool is ideal for young swimmers.",
    "这个浅水池很适合年幼的游泳者。",
    "A quiet morning is ideal for recording birdsong.",
    "安静的早晨很适合录制鸟鸣。"
  ],
  [
    "plenty",
    "代词 · 充足的数量",
    "plenty of 后可接复数可数名词或不可数名词；知道所指对象时也可单独说 plenty，不用再加名词。",
    "We have plenty of time to walk to the station.",
    "我们有充足时间步行到车站。",
    "Do you need more paper? There is plenty in the drawer.",
    "你还需要纸吗？抽屉里有很多。"
  ],
  [
    "passenger",
    "名词 · 乘客",
    "passenger 指乘坐车辆等交通工具出行的人，可数；通常与驾驶或操作该交通工具的人区分。",
    "Each passenger received a map of the ferry route.",
    "每位乘客都领到了一张渡轮航线图。",
    "The front passenger helped the driver read the signs.",
    "前排乘客帮司机看路牌。"
  ],
  [
    "manufacturer",
    "名词 · 制造商",
    "manufacturer 指生产商品的人或企业，常接 of 说明产品；销售商品的商店不一定就是制造商。",
    "The manufacturer offers spare parts for this model.",
    "制造商为这个型号提供零件。",
    "Contact the manufacturer if the label is missing.",
    "如果标签缺失，请联系制造商。"
  ],
  [
    "taste",
    "动词 · 尝、尝起来",
    "taste something 是主动尝某物；something tastes 加形容词表示尝起来如何，别用副词修饰这个感官结果。",
    "Taste the soup before adding any herbs.",
    "加香草前先尝尝汤。",
    "The apple tastes sweeter after a few days indoors.",
    "苹果在室内放几天后尝起来更甜。"
  ],
  [
    "perfectly",
    "副词 · 完全、十分",
    "perfectly 可表示完全达到某程度，如 perfectly clear；不总是在夸赞技能完美，要看它修饰的词。",
    "Your explanation is perfectly clear.",
    "你的解释完全清楚。",
    "The old key still fits the lock perfectly.",
    "旧钥匙仍与锁完全吻合。"
  ],
  [
    "kingdom",
    "名词 · 王国",
    "kingdom 可指由国王或女王担任君主的国家，是可数名词；生物分类中的界属于另一义项。",
    "The old kingdom stretched from the coast to the mountains.",
    "古王国从海岸一直延伸到群山。",
    "The map shows the borders of the kingdom.",
    "地图标出了王国的边界。"
  ],
  [
    "forever",
    "副词 · 永远、很久",
    "forever 可指无限长的时间，也可在口语里夸张表示等了很久；不能把夸张等待理解为字面无限。",
    "We cannot keep these borrowed tools forever.",
    "我们不能永远留着这些借来的工具。",
    "The queue seemed to last forever.",
    "排队似乎没完没了。"
  ],
  [
    "lab",
    "名词 · 实验室",
    "lab 是 laboratory 的缩略说法，通常可数；口语和校园语境很常见，正式名称可能保留全称。",
    "The lab stores water samples in a locked cabinet.",
    "实验室把水样存放在上锁的柜子里。",
    "Please leave your bag outside the lab.",
    "请把包放在实验室外面。"
  ],
  [
    "moreover",
    "副词 · 此外、而且",
    "moreover 在已有论点上再加一条信息，书面语常见；可独立放句首，不把它当普通并列连词。",
    "The route is shorter; moreover, it avoids the steep hill.",
    "这条路线更短，而且避开了陡山。",
    "The room is bright. Moreover, it overlooks the garden.",
    "房间很明亮。此外，它还朝向花园。"
  ],
  [
    "tower",
    "名词 · 塔",
    "tower 指相对周围明显高耸的塔状建筑，可数；可独立，也可附属于教堂等建筑，不只指观光塔。",
    "A stone tower stands above the village.",
    "一座石塔高耸在村庄上方。",
    "We climbed the tower to watch the boats.",
    "我们登塔观看船只。"
  ],
  [
    "regarding",
    "介词 · 关于",
    "regarding 直接接名词或动名词说明所涉及的事情；无需再加 about 或 to，常用于较正式的说明。",
    "I have a question regarding the delivery date.",
    "我有一个关于送达日期的问题。",
    "She sent a note regarding access to the archive.",
    "她发来一张关于进入档案室的便条。"
  ],
  [
    "depth",
    "名词 · 深度",
    "depth 指从表面向下或从前向后的测量距离；at a depth of 后可接具体深度，区别形容词 deep。",
    "The sign gives the depth of the pool.",
    "标牌给出了泳池的深度。",
    "The camera works at a depth of ten metres.",
    "这台相机能在十米深处工作。"
  ],
  [
    "port",
    "名词 · 港口",
    "port 可指船舶停泊及装卸货物的港口；此义通常可数，不把计算机端口与海港的语境混淆。",
    "The ship reached the port before sunrise.",
    "船在日出前到达港口。",
    "Workers unloaded grain at the port.",
    "工人在港口卸下粮食。"
  ],
  [
    "rose",
    "名词 · 玫瑰",
    "rose 可指玫瑰植株或花，可数，复数 roses；它也恰好是 rise 的过去式，要用句法判断。",
    "A white rose lay beside the invitation.",
    "请柬旁放着一朵白玫瑰。",
    "She planted a rose near the garden gate.",
    "她在花园门边种了一株玫瑰。"
  ],
  [
    "protein",
    "名词 · 蛋白质",
    "protein 泛指营养成分时通常不可数；研究中谈不同种类的蛋白质可用复数，不要一概禁用 proteins。",
    "The label lists the amount of protein in each serving.",
    "标签列出每份食物的蛋白质含量。",
    "Beans provide protein as well as fibre.",
    "豆类除了纤维还提供蛋白质。"
  ],
  [
    "recommendation",
    "名词 · 建议、推荐",
    "recommendation 可指被提出的建议，也可指推荐意见；make a recommendation 强调给建议，不保证对方会采纳。",
    "The committee made a recommendation to repair the roof.",
    "委员会提出了修理屋顶的建议。",
    "We visited the museum on her recommendation.",
    "我们听了她的推荐去参观博物馆。"
  ],
  [
    "exposure",
    "名词 · 接触、暴露",
    "exposure to 指受到某种影响或接触某事物，通常不可数；介词用 to，不直接以 exposure 加影响来源。",
    "The cover reduces exposure to sunlight.",
    "罩子减少了阳光照射。",
    "Regular exposure to spoken English helped her listening.",
    "经常接触英语口语帮助她提高了听力。"
  ],
  [
    "recovery",
    "名词 · 恢复",
    "recovery 可指从疾病、损失或衰退中恢复的过程；recovery from 说明原先困境，不把所有恢复都理解成找回物品。",
    "Her recovery from the injury took several months.",
    "她用了几个月才从伤病中恢复。",
    "The report shows signs of economic recovery.",
    "报告显示出经济复苏的迹象。"
  ],
  [
    "shortly",
    "副词 · 不久",
    "shortly 可指过一小段时间，也可在 shortly after 中指某事后不久；它本身不说明精确分钟数。",
    "The next train will arrive shortly.",
    "下一班火车不久就到。",
    "We left shortly after the rain stopped.",
    "雨停后不久我们就离开了。"
  ],
  [
    "electricity",
    "名词 · 电、电力",
    "electricity 指电能或供电时通常不可数；停电可说 no electricity，不把一次供电叫作 an electricity。",
    "The cabin has water but no electricity.",
    "小屋有水但没有电。",
    "These lights use very little electricity.",
    "这些灯耗电很少。"
  ],
  [
    "pale",
    "形容词 · 浅色的、苍白的",
    "pale 可形容颜色浅或脸色缺乏血色；pale blue 指浅蓝，不能仅凭 pale 就认定人物生病。",
    "The walls were painted pale blue.",
    "墙壁漆成了浅蓝色。",
    "His face looked pale under the harsh light.",
    "在刺眼的光线下，他的脸显得苍白。"
  ],
  [
    "bean",
    "名词 · 豆、豆荚",
    "bean 可指豆类种子或用作蔬菜的嫩豆荚，通常可数；菜名常用复数 beans，不能把所有豆都当作咖啡豆。",
    "A green bean fell from the basket.",
    "一根四季豆从篮子里掉了出来。",
    "Soak the dried beans before cooking.",
    "煮之前先浸泡干豆。"
  ],
  [
    "transportation",
    "名词 · 运输、交通方式",
    "transportation 常见于美式语境，指运输过程或出行方式；public transportation 是公共交通，泛指时通常不可数。",
    "The hotel provides transportation to the airport.",
    "酒店提供去机场的交通服务。",
    "Public transportation makes the town easier to explore.",
    "公共交通让游览小镇更方便。"
  ],
  [
    "pure",
    "形容词 · 纯的、未混杂的",
    "pure 形容没有掺杂其他物质或不含杂质；它不自动等于安全可食用，要与具体物质和语境一起理解。",
    "The ring is made of pure silver.",
    "这枚戒指用纯银制成。",
    "Pure water was used in the experiment.",
    "实验使用了纯水。"
  ],
  [
    "pray",
    "动词 · 祈祷",
    "pray 可用 pray for 为某人某事祈祷，也可接 to 指向祈祷对象；注意与同音的 prey 猎物区分。",
    "They gathered to pray for peace.",
    "他们聚在一起为和平祈祷。",
    "She went to the quiet chapel to pray.",
    "她去安静的小教堂祈祷。"
  ],
  [
    "surprising",
    "形容词 · 令人惊讶的",
    "surprising 描述引起惊讶的事物；surprised 描述感到惊讶的人，两者不可因中文都含惊讶而互换。",
    "The survey produced a surprising result.",
    "调查得出了令人惊讶的结果。",
    "It is surprising how quickly the seedlings grew.",
    "幼苗长得如此之快，真令人惊讶。"
  ],
  [
    "teenager",
    "名词 · 十三至十九岁的人",
    "teenager 指十三到十九岁的少年，可数；十岁虽也未成年，却不在这个词通常表示的年龄范围内。",
    "A teenager helped us carry the boxes.",
    "一名少年帮我们搬箱子。",
    "She learned to repair bicycles as a teenager.",
    "她在少年时期学会了修自行车。"
  ],
  [
    "anxiety",
    "名词 · 焦虑、不安",
    "anxiety 可表示对未来情况的不安，常搭配 about 或 over；日常情绪义不应直接等同于医学诊断。",
    "He felt anxiety about the unfamiliar journey.",
    "他对陌生的旅程感到不安。",
    "A clear schedule reduced her anxiety.",
    "清楚的日程安排减轻了她的焦虑。"
  ],
  [
    "pink",
    "名词 · 粉红色",
    "pink 作颜色名词通常不加冠词；a shade of pink 是一种粉红色，花卉名称等其他用法另当别论。",
    "She chose pink for the nursery walls.",
    "她为育儿室的墙选了粉红色。",
    "The sky turned a soft shade of pink.",
    "天空变成柔和的粉红色。"
  ],
  [
    "successfully",
    "副词 · 成功地",
    "successfully 修饰完成或执行动作，说明达到了目的；successful 才是直接修饰计划、尝试等名词的形容词。",
    "The team successfully repaired the damaged bridge.",
    "团队成功修复了受损桥梁。",
    "She successfully completed the winter course.",
    "她成功完成了冬季课程。"
  ],
  [
    "disk",
    "名词 · 磁盘",
    "disk 在计算机语境可指存储数据的磁盘；disc 常用于光盘，具体产品名称应保留原有拼写。",
    "The old disk contains photographs from our first project.",
    "旧磁盘里存着我们首个项目的照片。",
    "Save a copy on a separate disk.",
    "在另一块磁盘上保存副本。"
  ],
  [
    "giant",
    "名词 · 巨人",
    "giant 可指传说中的巨人，也可比喻实力非凡的人或庞大机构；这里先记可数的故事人物。",
    "The giant in the story lived above the clouds.",
    "故事里的巨人住在云端之上。",
    "The child drew a giant beside a tiny cottage.",
    "孩子在小屋旁画了一个巨人。"
  ],
  [
    "stupid",
    "形容词 · 愚蠢的",
    "stupid 可评价决定缺乏思考，语气较重；称人 stupid 容易冒犯，描述具体失误通常更清楚。",
    "Leaving the keys in the car was a stupid mistake.",
    "把钥匙留在车里是个愚蠢的错误。",
    "He regretted making that stupid remark.",
    "他后悔说了那句蠢话。"
  ],
  [
    "confident",
    "形容词 · 有信心的",
    "confident 可表示对能力有信心，或确信某事；confident that 引出判断，与表示信任秘密的 confidential 不同。",
    "She felt confident about her presentation.",
    "她对自己的演讲充满信心。",
    "We are confident that the repairs will last.",
    "我们相信这次修理能长久奏效。"
  ],
  [
    "ultimate",
    "形容词 · 最终的",
    "ultimate 可表示一系列过程的最终阶段或目标；不总等于最近的 latest，当前一步也不一定是最终一步。",
    "Our ultimate goal is to restore the entire wetland.",
    "我们的最终目标是修复整个湿地。",
    "The passengers did not know their ultimate destination.",
    "乘客不知道最终目的地。"
  ],
  [
    "yell",
    "动词 · 大声喊叫",
    "yell 强调声音很响，可接喊出的内容；yell at 往往有朝某人吼叫的意味，具体情绪仍依语境判断。",
    "Please do not yell across the reading room.",
    "请不要隔着阅览室大声喊叫。",
    "We had to yell to be heard above the engine.",
    "我们得大声喊，才能盖过引擎声被听见。"
  ],
  [
    "destruction",
    "名词 · 毁坏、破坏",
    "destruction 指毁坏的行为、过程或状态，通常不可数；the destruction of 后接被毁坏的对象，不是动词形式。",
    "The fire caused the destruction of several wooden huts.",
    "火灾毁坏了几间木屋。",
    "The exhibition documents the destruction of the old forest.",
    "展览记录了古老森林遭破坏的情况。"
  ],
  [
    "provided",
    "连词 · 只要",
    "provided 或 provided that 可引导条件从句，意思是只要；此处不是 provide 的过去式，不要译成已经提供。",
    "You may borrow the tent provided you return it dry.",
    "只要干燥归还，你就可以借帐篷。",
    "The trip will go ahead provided that the road is open.",
    "只要道路开放，旅行就会照常进行。"
  ],
  [
    "strengthen",
    "动词 · 加强",
    "strengthen 可直接接被加强的对象，也可不及物表示自身变强；不是形容词，形容强壮要用 strong。",
    "These wooden braces will strengthen the shelf.",
    "这些木支架会加固架子。",
    "The wind began to strengthen after midnight.",
    "午夜后风开始增强。"
  ],
  [
    "lifetime",
    "名词 · 一生、存在期间",
    "lifetime 指人或事物存在的整段时间；in one's lifetime 是在某人一生中，不表示每天的日常活动。",
    "She collected hundreds of letters during her lifetime.",
    "她一生中收集了数百封信。",
    "This tree may outlive a human lifetime.",
    "这棵树可能比人的一生还长寿。"
  ],
  [
    "satisfy",
    "动词 · 满足要求",
    "satisfy 可直接接要求、条件等，表示达到规定标准；不需要在 satisfy 与 requirements 之间加 with。",
    "The design must satisfy the school's safety requirements.",
    "设计必须满足学校的安全要求。",
    "These measurements satisfy all the stated conditions.",
    "这些测量值符合列出的全部条件。"
  ],
  [
    "secondly",
    "副词 · 其次",
    "secondly 用于列举第二点，通常承接第一点；与表示第二名的序数词 second 在句中承担的作用不同。",
    "Firstly, check the size; secondly, inspect the stitching.",
    "首先检查尺寸，其次查看缝线。",
    "The plan saves water. Secondly, it reduces waste.",
    "该计划节约用水。其次，它减少浪费。"
  ],
  [
    "furthermore",
    "副词 · 而且、此外",
    "furthermore 在前述论点上补充信息，语气较书面；常配句号或分号，不承担 because 那样的从属连接作用。",
    "The tool is expensive; furthermore, it is difficult to repair.",
    "这个工具很贵，而且难以修理。",
    "The garden attracts birds. Furthermore, it provides shade.",
    "花园吸引鸟类。此外，它还提供荫凉。"
  ],
  [
    "deliberately",
    "副词 · 故意地",
    "deliberately 可指有意识地故意行动，也可指从容审慎；这里取故意义，别仅根据动作缓慢就判断恶意。",
    "She deliberately left the final page blank.",
    "她故意把最后一页留白。",
    "He deliberately chose a seat near the exit.",
    "他特意选了靠近出口的座位。"
  ],
  [
    "imagination",
    "名词 · 想象力",
    "imagination 可指构思未在眼前事物的能力，通常不可数；use your imagination 是发挥想象力，不是提供证据。",
    "The empty stage left room for the audience's imagination.",
    "空舞台为观众的想象留下了空间。",
    "Use your imagination to design a home for the character.",
    "发挥想象，为角色设计一个家。"
  ],
  [
    "shrug",
    "动词 · 耸肩",
    "shrug 可独立使用，也可说 shrug one's shoulders；过去式 shrugged 双写 g，常表达不确定或不在意。",
    "He could only shrug when asked about the delay.",
    "被问及延误时，他只能耸耸肩。",
    "Do not simply shrug your shoulders when someone asks for help.",
    "别人求助时不要只是耸耸肩。"
  ],
  [
    "grateful",
    "形容词 · 感激的",
    "grateful to someone for something 说明感激谁以及为何感激；人感到感激，不能把帮助本身称为 grateful。",
    "I am grateful to you for lending me the map.",
    "我感谢你借地图给我。",
    "She gave the patient guide a grateful smile.",
    "她向耐心的向导投以感激的微笑。"
  ],
  [
    "nowhere",
    "副词 · 哪里也不",
    "nowhere 本身已有否定意义，标准表达通常不再加 not；nowhere to sit 表示没有地方坐，不等于没人坐。",
    "There was nowhere to hang the wet coats.",
    "没有地方可以挂湿外套。",
    "The missing notebook was nowhere in the room.",
    "房间里哪里都没有那本丢失的笔记本。"
  ],
  [
    "objection",
    "名词 · 反对意见",
    "objection to 后接反对的事物或动名词；raise an objection 是提出异议，不要与目标 objective 混淆。",
    "Her main objection was the cost of the new roof.",
    "她主要的反对理由是新屋顶的费用。",
    "Does anyone have an objection to meeting earlier?",
    "有人反对提前开会吗？"
  ],
  [
    "continuous",
    "形容词 · 连续不断的",
    "continuous 强调在时间、空间或序列上没有中断；描述反复发生的打扰时要留意是否实际存在间隔。",
    "The machine ran for six hours of continuous testing.",
    "机器连续测试运行了六小时。",
    "A continuous line of paint marked the route.",
    "一条连续的油漆线标出了路线。"
  ],
  [
    "cow",
    "名词 · 母牛",
    "cow 常指成年母牛，也有泛指家牛的用法；谈明确性别时与 bull 公牛区分，不把 cattle 当作单数个体。",
    "A cow stood beside the wooden fence.",
    "一头母牛站在木栅栏边。",
    "The farmer brought the cow into the barn.",
    "农夫把母牛牵进了谷仓。"
  ],
  [
    "commonly",
    "副词 · 通常、普遍地",
    "commonly 指通常发生或广泛使用的情况，commonly used 很常见；不意味着没有任何例外。",
    "This plant is commonly found near streams.",
    "这种植物常见于溪流附近。",
    "The word is commonly used in informal conversation.",
    "这个词常用于非正式交谈。"
  ],
  [
    "consequently",
    "副词 · 因此",
    "consequently 引出前述情况带来的结果，强调因果；不是单纯表示接下来按时间发生的 then。",
    "The bridge was closed; consequently, we took a longer route.",
    "桥关闭了，因此我们走了更远的路。",
    "The soil was dry. Consequently, the seeds failed to grow.",
    "土壤干燥。因此种子未能发芽。"
  ],
  [
    "rabbit",
    "名词 · 兔子",
    "rabbit 指兔子，通常可数，日常复数常用 rabbits；它与 hare 的动物分类和用法并非处处相同。",
    "A rabbit hid beneath the garden bench.",
    "一只兔子藏在花园长椅下。",
    "The rabbit left small tracks in the snow.",
    "兔子在雪地留下了小脚印。"
  ],
  [
    "sharply",
    "副词 · 急剧地",
    "sharply 修饰增减可强调变化幅度明显，修饰转向可强调突然；不表示所有语境里都与刀刃锋利相关。",
    "The road turns sharply beyond the barn.",
    "道路过了谷仓后急转弯。",
    "The temperature fell sharply after sunset.",
    "日落后气温急剧下降。"
  ],
  [
    "sigh",
    "动词 · 叹气",
    "sigh 指发出可听见的深呼吸，可能因疲惫、失望或释然；不能只凭叹气就判定人物悲伤。",
    "She began to sigh as the queue grew longer.",
    "队伍越来越长，她开始叹气。",
    "He let himself sigh with relief when the dog returned.",
    "狗回来时，他如释重负地叹了口气。"
  ],
  [
    "outer",
    "形容词 · 外部的",
    "outer 常置于名词前，指较外层或离中心较远的部分；与 inner 相对，不作表示到外面去的方向副词。",
    "Remove the outer wrapping before opening the box.",
    "开盒前先去掉外层包装。",
    "The outer wall protects the garden from wind.",
    "外墙为花园挡风。"
  ],
  [
    "curious",
    "形容词 · 好奇的",
    "curious about 表示想了解某事；curious 也可形容事情奇特，人物有好奇心与事物奇怪要靠语境区分。",
    "The children were curious about the locked cupboard.",
    "孩子们对上锁的橱柜很好奇。",
    "I am curious to know how the old clock works.",
    "我很想知道这座老钟如何运作。"
  ],
  [
    "romantic",
    "形容词 · 浪漫的",
    "romantic 可描述与爱情有关的感情或营造浪漫氛围的事物；音乐艺术中的 Romantic 则可能指浪漫主义。",
    "They planned a romantic dinner beside the river.",
    "他们计划在河边共进浪漫晚餐。",
    "The film follows a romantic relationship over many years.",
    "影片讲述了一段持续多年的恋情。"
  ],
  [
    "invitation",
    "名词 · 邀请、请柬",
    "invitation 可指邀请行为或具体请柬，an invitation to 后可接活动；邀请做某事可接 to do。",
    "An invitation to the concert arrived this morning.",
    "今天早晨收到了一份音乐会邀请。",
    "She accepted the invitation to speak at the school.",
    "她接受了到学校演讲的邀请。"
  ],
  [
    "nut",
    "名词 · 坚果",
    "nut 在饮食语境可指带壳果实、种子或其中的果仁；日常食物分类不一定与严格植物分类完全一致。",
    "He cracked a nut with the small metal tool.",
    "他用小金属工具敲开了一颗坚果。",
    "The cake contains chopped nuts.",
    "蛋糕含有切碎的坚果。"
  ],
  [
    "inspection",
    "名词 · 检查",
    "inspection 指仔细查看或按标准检查，可说 carry out an inspection；不等于看到一眼就已经完成检查。",
    "The bridge will close for a safety inspection.",
    "桥将关闭以进行安全检查。",
    "A closer inspection revealed cracks in the handle.",
    "更仔细的检查发现把手有裂纹。"
  ],
  [
    "humour",
    "名词 · 幽默",
    "humour 是英式拼写，美式通常写 humor；a sense of humour 指幽默感，此义通常不以一个幽默来计数。",
    "Her gentle humour made the nervous guests relax.",
    "她温和的幽默让紧张的客人放松下来。",
    "The story combines sadness with humour.",
    "这个故事把悲伤与幽默结合起来。"
  ],
  [
    "pet",
    "名词 · 宠物",
    "pet 指主要为陪伴或喜爱而饲养的动物，可数；不是所有家养或供人使用的动物都适合称为宠物。",
    "Their first pet was a small brown rabbit.",
    "他们的第一只宠物是一只棕色小兔。",
    "The landlord allows one pet in each flat.",
    "房东允许每套公寓养一只宠物。"
  ],
  [
    "transformation",
    "名词 · 转变",
    "transformation 强调明显的形态或状态变化；transformation of 后接变化对象，通常比细小调整语义更强。",
    "The transformation of the empty yard took two years.",
    "空院子的改造用了两年。",
    "We watched the room's transformation into a library.",
    "我们见证了房间变成图书馆的过程。"
  ]
];
const additionsSeven = [
  [
    "berry",
    "名词 · 浆果",
    "berry 日常可指小而多汁的果实，复数变 y 为 ies；植物学定义更严格，不要推断所有野生浆果均可食。",
    "A red berry floated on the juice.",
    "一颗红浆果浮在果汁上。",
    "The bird carried a berry in its beak.",
    "鸟嘴里叼着一颗浆果。"
  ],
  [
    "concerned",
    "形容词 · 担心的",
    "concerned about 常说明担心的事情，concerned for 可说明关心谁的安危；涉及某事的有关义要另依语境判断。",
    "We are concerned about the missing dog.",
    "我们很担心那只失踪的狗。",
    "She was concerned for the hikers' safety.",
    "她担心徒步者的安全。"
  ],
  [
    "realise",
    "动词 · 实现",
    "realise 是英式常见拼写，realize 也获认可；realise a goal 指实现目标，不要与意识到的义项混在一起。",
    "The club hopes to realise its goal of opening a library.",
    "俱乐部希望实现开设图书馆的目标。",
    "This grant will help her realise her ambition.",
    "这笔资助将帮助她实现抱负。"
  ],
  [
    "planning",
    "名词 · 规划、筹划",
    "planning 作名词表示制定计划的过程，通常不可数；careful planning 强调事前安排，不表示已有一份具体文件。",
    "Careful planning kept the trip within budget.",
    "仔细筹划使旅行开支没有超预算。",
    "The festival required months of planning.",
    "节庆活动需要几个月的筹划。"
  ],
  [
    "smith",
    "名词 · 金属工匠",
    "smith 作普通名词可指加工金属的工匠；作为姓氏 Smith 时首字母大写，不能把姓氏译作铁匠。",
    "The smith shaped the iron into a hook.",
    "工匠把铁打造成钩子。",
    "A local smith repaired the broken gate.",
    "一位本地金属工匠修好了破门。"
  ],
  [
    "supposed",
    "形容词 · 所谓的、据称的",
    "supposed 放在名词前可表示只是被认为如此，往往带怀疑；不同于 be supposed to 表预期或责任的结构。",
    "The supposed expert could not answer a basic question.",
    "那个所谓的专家连基本问题也答不出。",
    "The supposed treasure turned out to be old buttons.",
    "据称的宝藏原来是旧纽扣。"
  ],
  [
    "regional",
    "形容词 · 地区的",
    "regional 表示与特定地区有关或服务于该地区，通常修饰名词；不表示某活动必然覆盖整个国家。",
    "The regional museum collects pottery from nearby villages.",
    "地区博物馆收藏附近村庄的陶器。",
    "A regional bus connects the smaller towns.",
    "一辆地区公交连接各小镇。"
  ],
  [
    "detailed",
    "形容词 · 详细的",
    "detailed 强调包含充分细节，可说 a detailed description；不要用表示细节的名词 detail 直接替代所有形容词位置。",
    "She drew a detailed map of the garden.",
    "她画了一张详细的花园地图。",
    "The mechanic gave us a detailed explanation.",
    "技师给了我们详细的解释。"
  ],
  [
    "educational",
    "形容词 · 教育的、有教育意义的",
    "educational 可修饰教育领域的事物，也可说某经历有教育意义；不只限于学校正式授课。",
    "The museum runs educational workshops for families.",
    "博物馆为家庭举办教育工作坊。",
    "The visit was both enjoyable and educational.",
    "这次参观既愉快又有教育意义。"
  ],
  [
    "totally",
    "副词 · 完全地",
    "totally 强调完全的程度，常修饰 different、wrong 等；属于副词，不能直接当 total 放在名词前。",
    "The two keys look totally different.",
    "这两把钥匙看起来完全不同。",
    "I totally forgot about the spare ticket.",
    "我把备用票的事完全忘了。"
  ],
  [
    "increased",
    "形容词 · 增多的",
    "increased 可在名词前表示数量或程度已增加；increasing 则常强调正在增加，关注过程与结果的差别。",
    "The library needs extra staff to meet increased demand.",
    "图书馆需要增员以满足增多的需求。",
    "Increased rainfall filled the reservoir.",
    "增加的降雨使水库蓄满了水。"
  ],
  [
    "suggestion",
    "名词 · 建议",
    "suggestion 表示一条建议时可数，make a suggestion 是提出建议；不同于不可数的 advice，不能照搬数词结构。",
    "May I make a suggestion about the seating?",
    "我可以就座位安排提个建议吗？",
    "Her suggestion saved us an hour of work.",
    "她的建议帮我们省了一小时的工作。"
  ],
  [
    "typically",
    "副词 · 通常、典型地",
    "typically 可指通常情况下，也可表示某事物具有典型特征；不能由通常推出每次毫无例外。",
    "The shop typically opens before the first bus arrives.",
    "店铺通常在首班公交到达前开门。",
    "The design is typically simple and practical.",
    "这种设计通常简洁实用。"
  ],
  [
    "supporter",
    "名词 · 支持者",
    "supporter 指支持某人、团队或事业的人，通常可数；a supporter of 后说明支持对象，不必是出资者。",
    "She is a strong supporter of the reading club.",
    "她是读书俱乐部的坚定支持者。",
    "A supporter donated books to the team.",
    "一位支持者向团队捐了书。"
  ],
  [
    "database",
    "名词 · 数据库",
    "database 指按一定方式组织以便检索的数据集合，通常可数；与单个数据项或普通网页不能简单画等号。",
    "The database contains records of local birds.",
    "数据库里有本地鸟类的记录。",
    "We added the new address to the database.",
    "我们把新地址加入数据库。"
  ],
  [
    "deeply",
    "副词 · 深深地",
    "deeply 可表示物理深度，也可加强情感程度，如 deeply moved；修饰情绪时不是实际进入某个深处。",
    "We were deeply moved by her letter.",
    "她的信深深打动了我们。",
    "The post was buried deeply in the wet ground.",
    "柱子深深埋入湿地里。"
  ],
  [
    "manufacturing",
    "名词 · 制造业",
    "manufacturing 作名词指制造活动或行业，通常不可数；in manufacturing 表从事制造业，不指单个工厂。",
    "Manufacturing provides many jobs in this town.",
    "制造业为这个镇提供了许多岗位。",
    "The course introduces modern manufacturing methods.",
    "课程介绍现代制造方法。"
  ],
  [
    "remaining",
    "形容词 · 剩余的",
    "remaining 置于名词前说明一部分被用掉或移走后留下的东西；不是名词 remains 的直接替换。",
    "Put the remaining bread in the tin.",
    "把剩余面包装进铁盒。",
    "The remaining seats are beside the window.",
    "剩余座位在窗边。"
  ],
  [
    "art",
    "名词 · 技艺",
    "art 可指通过经验和学习掌握的技艺，the art of 后常接动名词；此义不只指绘画雕塑等美术。",
    "She taught us the art of folding paper birds.",
    "她教我们折纸鸟的技艺。",
    "Making good bread is an art that takes practice.",
    "做好面包是一门需要练习的技艺。"
  ],
  [
    "toward",
    "介词 · 朝、向",
    "toward 表示方向，后接地点或对象；它说明朝某处移动，并不保证最后到达该处，towards 也是常见形式。",
    "The dog ran toward the open gate.",
    "狗朝敞开的门跑去。",
    "Turn the lamp toward the workbench.",
    "把灯转向工作台。"
  ],
  [
    "former",
    "形容词 · 以前的",
    "former 加职位或身份表示过去担任过；the former 还可指前述两项中的前者，两个结构不要混淆。",
    "A former teacher now runs the bookshop.",
    "一位以前的教师现在经营书店。",
    "The building has regained its former beauty.",
    "这栋建筑恢复了昔日的美丽。"
  ],
  [
    "closely",
    "副词 · 仔细地",
    "closely 修饰 look、listen 等可表示仔细关注；并非每次都指物理距离近，结合被修饰的动作判断。",
    "Listen closely to the final instruction.",
    "仔细听最后一条指示。",
    "The children watched the tiny crab closely.",
    "孩子们仔细观察那只小螃蟹。"
  ],
  [
    "bob",
    "动词 · 上下晃动",
    "bob 可不及物表示短促或反复上下浮动，也可接 head 表点头；过去式 bobbed 需要双写 b。",
    "The small boats bob on the waves.",
    "小船在波浪上起伏。",
    "Watch the cork bob as the fish pulls the line.",
    "看鱼拉线时浮标上下浮动。"
  ],
  [
    "plaintiff",
    "名词 · 原告",
    "plaintiff 指提起诉讼的一方，通常可数；区别于应诉的 defendant，不应把它笼统译成所有法庭参与者。",
    "The plaintiff brought photographs to the hearing.",
    "原告带照片参加听证。",
    "The judge asked the plaintiff to describe the damage.",
    "法官请原告描述损失。"
  ],
  [
    "essentially",
    "副词 · 本质上",
    "essentially 强调基本性质或大体情况，可能容许细节不同；它不等于每个方面都完全相同。",
    "The two proposals are essentially the same.",
    "两份提案本质上相同。",
    "The machine is essentially a pump with a timer.",
    "这台机器基本上是一台带定时器的泵。"
  ],
  [
    "armed",
    "形容词 · 武装的",
    "armed 可指携带武器，也可用 armed with 比喻备有知识等；武装义与表示带扶手的复合形容词不同。",
    "An armed guard stood near the entrance.",
    "一名持械警卫站在入口附近。",
    "The report described an armed attack on the camp.",
    "报告描述了营地遭受的武装袭击。"
  ],
  [
    "breach",
    "名词 · 违反",
    "breach of 表示违反规则、义务或信任；还可指实物缺口，此处聚焦行为义，不把所有裂缝译为违约。",
    "Sharing the password was a breach of the club's rules.",
    "分享密码违反了俱乐部规定。",
    "She regarded the disclosure as a breach of trust.",
    "她认为泄露此事是背弃信任。"
  ],
  [
    "buck",
    "名词 · 美元的口语说法",
    "buck 在非正式美式语境可指一美元，复数 bucks；正式报价常写 dollar，不把它当所有货币的通称。",
    "This old postcard cost only a buck.",
    "这张旧明信片只花了一美元。",
    "I paid five bucks for the wooden frame.",
    "我花五美元买了木相框。"
  ],
  [
    "testing",
    "形容词 · 考验能力的",
    "testing 作形容词表示困难、需要付出努力的，常见 a testing time；不必是在描述实验或考试动作。",
    "The team faced a testing climb before dawn.",
    "团队在黎明前面临一段艰难攀登。",
    "Moving the archive was a testing task for the volunteers.",
    "搬运档案对志愿者是项艰巨任务。"
  ],
  [
    "favourite",
    "形容词 · 最喜爱的",
    "favourite 是英式拼写，美式常用 favorite，通常放在名词前；它也可作名词表示最喜爱的一个。",
    "My favourite bench overlooks the river.",
    "我最喜欢的长椅朝向河流。",
    "This is her favourite part of the story.",
    "这是故事中她最喜欢的部分。"
  ],
  [
    "written",
    "形容词 · 书面的",
    "written 修饰 agreement、permission 等表示以文字记录的；它与 oral 口头的相对，不要求一定手写。",
    "Please bring written permission from your parent.",
    "请带上家长的书面许可。",
    "The written instructions include a clear diagram.",
    "书面说明包含一张清楚的示意图。"
  ],
  [
    "biological",
    "形容词 · 生物的",
    "biological 可表示与生命过程或生物学有关；在 biological parent 中则指遗传上的亲生关系，依搭配辨义。",
    "The pond supports many biological processes.",
    "池塘支持许多生命过程。",
    "She studies the biological effects of changing temperatures.",
    "她研究温度变化对生物的影响。"
  ],
  [
    "operating",
    "形容词 · 运行方面的",
    "operating 可修饰 costs、conditions 等表示运行或经营方面的；医院 operating room 则指手术室，需结合名词。",
    "The new lights reduced the building's operating costs.",
    "新照明降低了建筑的运行成本。",
    "Check the operating temperature before starting the motor.",
    "启动电机前先查看运行温度。"
  ],
  [
    "disabled",
    "形容词 · 有残障的",
    "disabled 可描述受到残障影响的人，搭配 disabled people；不说明具体障碍类型，也不表示没有任何能力。",
    "The centre offers art classes for disabled children.",
    "中心为残障儿童开设美术课。",
    "Disabled visitors helped plan the museum's new entrance.",
    "残障访客参与设计了博物馆的新入口。"
  ],
  [
    "constitutional",
    "形容词 · 宪法的",
    "constitutional 可表示与宪法有关或符合宪法的，具体取决于名词；不能自动把 constitutional debate 理解为合法辩论。",
    "The course examines constitutional rights.",
    "课程研究宪法权利。",
    "The article discusses constitutional reform.",
    "这篇文章讨论宪法改革。"
  ],
  [
    "implementation",
    "名词 · 实施",
    "implementation 指让计划、政策等实际生效或付诸行动；implementation of 后接实施对象，与只是提出建议不同。",
    "Implementation of the new timetable starts next month.",
    "新时刻表下月开始实施。",
    "The team discussed the practical details of implementation.",
    "团队讨论了实施的实际细节。"
  ],
  [
    "considerably",
    "副词 · 相当大程度地",
    "considerably 表示程度明显，常修饰比较级或增减动作；不能直接放在名词前替代 considerable。",
    "The repaired engine runs considerably more quietly.",
    "修好的引擎运行起来安静多了。",
    "The river widened considerably below the bridge.",
    "河流在桥下明显变宽。"
  ],
  [
    "consultation",
    "名词 · 咨询、商议",
    "consultation 可指向专业人士请教或共同商议，consultation with 指商议对象；不必每次都涉及医疗。",
    "The plan changed after consultation with local residents.",
    "与本地居民商议后，计划作了修改。",
    "She arranged a consultation with the architect.",
    "她安排了与建筑师的一次咨询。"
  ],
  [
    "squad",
    "名词 · 小队",
    "squad 指为共同任务组织的小群体，可用于军事、救援或运动语境；不要由此推出固定人数。",
    "A rescue squad searched the hillside.",
    "救援小队搜查了山坡。",
    "The coach named the squad for Saturday's match.",
    "教练公布了周六比赛的队员名单。"
  ],
  [
    "offense",
    "名词 · 冒犯",
    "offense 是美式常见拼写，offence 常见于英式；take offense 表示感到被冒犯，不能直译为拿走攻击。",
    "No offense was intended by the joke.",
    "那个笑话并无冒犯之意。",
    "She took offense at the dismissive remark.",
    "她对那句轻蔑的话感到被冒犯。"
  ],
  [
    "till",
    "介词 · 直到",
    "till 后可接时间表示持续到某时，本身是完整单词；无需当作 until 的缩写而强加撇号。",
    "The reading room stays open till nine.",
    "阅览室一直开放到九点。",
    "We waited till noon beside the harbour.",
    "我们在港口旁一直等到中午。"
  ],
  [
    "sergeant",
    "名词 · 中士",
    "sergeant 常指军队中的一种士官军衔，也可用于警务级别；不同组织的等级制度不宜一概套用。",
    "The sergeant checked the equipment before the march.",
    "中士在行军前检查装备。",
    "A sergeant explained the drill to the new soldiers.",
    "一名中士向新兵解释操练内容。"
  ],
  [
    "treasury",
    "名词 · 金库",
    "treasury 可指存放和支出资金的地方，也可指其中的资金；大写 Treasury 常指财政部门，依上下文判断。",
    "The old treasury was protected by a heavy iron door.",
    "旧金库由一扇沉重铁门保护。",
    "The town's treasury could not cover the repairs.",
    "镇上的资金不足以支付修理费。"
  ],
  [
    "dining",
    "动词分词 · 用餐",
    "dining 是 dine 的现在分词，去掉词尾 e 再加 ing；表示正在用餐时要与 be 等构成完整谓语。",
    "The guests are dining in the garden tonight.",
    "今晚客人们在花园用餐。",
    "We enjoyed dining beside the quiet harbour.",
    "我们喜欢在安静的港口旁用餐。"
  ],
  [
    "hunter",
    "名词 · 猎人",
    "hunter 可指捕猎野生动物的人；也可扩展为寻找某物的人，具体对象可由 treasure hunter 等组合说明。",
    "The hunter followed the tracks through the snow.",
    "猎人循着足迹穿过雪地。",
    "A hunter left a map of the mountain trails.",
    "一位猎人留下了一张山路地图。"
  ],
  [
    "taxpayer",
    "名词 · 纳税人",
    "taxpayer 指支付税款或负有纳税义务的人或组织，通常可数；不等于特指某个国家的全部公民。",
    "Each taxpayer received a copy of the notice.",
    "每位纳税人都收到了通知副本。",
    "The leaflet explains how a taxpayer can update an address.",
    "传单说明纳税人如何更新地址。"
  ],
  [
    "vendor",
    "名词 · 售货者、供应商",
    "vendor 指出售商品或服务的人或企业，可数；路边摊贩和企业供应商都可能使用此词，范围依场景。",
    "A vendor sold fresh bread near the station.",
    "一位摊贩在车站附近卖新鲜面包。",
    "The school chose a local vendor for its furniture.",
    "学校选了一家本地家具供应商。"
  ],
  [
    "institutional",
    "形容词 · 机构的",
    "institutional 表示属于或涉及机构，常修饰 support、policy 等；不同于个人自主行动，不一定专指政府部门。",
    "The project received institutional support from the college.",
    "项目得到学院的机构支持。",
    "The archive preserves institutional records.",
    "档案馆保存机构记录。"
  ],
  [
    "gifted",
    "形容词 · 有天赋的",
    "gifted 表示具有出色的自然才能，常说 gifted at 或 a gifted musician；与收到礼物的动词分词要依结构辨别。",
    "She is a gifted storyteller.",
    "她是一位有天赋的讲故事者。",
    "The workshop welcomed gifted young musicians.",
    "工作坊欢迎有才华的年轻音乐人。"
  ],
  [
    "chapel",
    "名词 · 小教堂、礼拜堂",
    "chapel 可指小型礼拜场所，也可指机构内部的礼拜堂；不必是独立建筑，也不等于所有大型教堂。",
    "A small chapel stood beside the hospital.",
    "医院旁有一座小礼拜堂。",
    "The chapel windows filled the room with coloured light.",
    "礼拜堂的窗户让室内洒满彩色光线。"
  ],
  [
    "processor",
    "名词 · 处理器",
    "processor 在计算机语境指处理数据的部件，常指中央处理器；food processor 是食品加工机，不能混译。",
    "The new processor uses less power.",
    "新处理器耗电更少。",
    "A faster processor improved the computer's performance.",
    "更快的处理器提升了电脑性能。"
  ],
  [
    "publishing",
    "名词 · 出版业",
    "publishing 作名词指出版的业务或行业，通常不可数；work in publishing 表示从事出版，不是一份具体出版物。",
    "She hopes to find a job in publishing.",
    "她希望在出版业找工作。",
    "Digital publishing changed how the magazine reaches readers.",
    "数字出版改变了杂志触达读者的方式。"
  ],
  [
    "electoral",
    "形容词 · 选举的",
    "electoral 用于与选举或选举人有关的名词前，如 electoral system；不是 electrical 电气的，注意中间拼写。",
    "The class compared two electoral systems.",
    "全班比较了两种选举制度。",
    "The archive holds old electoral maps.",
    "档案馆保存着旧选举地图。"
  ],
  [
    "banking",
    "名词 · 银行业务",
    "banking 指银行业务或银行业，通常不可数；online banking 表示网上银行业务，不能把单座银行叫作 a banking。",
    "Online banking lets her check the balance at home.",
    "网上银行让她可以在家查余额。",
    "He studied banking before joining the credit union.",
    "他加入信用社前学习了银行业务。"
  ],
  [
    "suburban",
    "形容词 · 郊区的",
    "suburban 描述位于城镇郊区或与郊区生活相关的事物；不等于远离城市的所有乡村地区。",
    "The train stops at several suburban stations.",
    "火车停靠几个郊区车站。",
    "They moved into a quiet suburban street.",
    "他们搬到一条安静的郊区街道。"
  ],
  [
    "pitcher",
    "名词 · 有嘴带柄水罐",
    "pitcher 可指盛放和倒出液体的带柄罐，常用于美式；棒球投手也是 pitcher，但属于另一义项。",
    "A glass pitcher stood beside the cups.",
    "杯子旁放着一个玻璃水罐。",
    "She filled the pitcher with lemon water.",
    "她把水罐装满柠檬水。"
  ],
  [
    "developer",
    "名词 · 软件开发者",
    "developer 可指开发软件的人或公司，也可指房地产开发者；software developer 通过前置名词明确领域。",
    "The developer fixed the problem in the reading app.",
    "开发者修复了阅读应用中的问题。",
    "A software developer visited the school's coding club.",
    "一位软件开发者访问了学校编程社。"
  ],
  [
    "mentally",
    "副词 · 在头脑中",
    "mentally 可指在头脑中完成而不写下，也可表示精神方面；修饰 calculate 时通常是心算，不是凭感觉猜测。",
    "She mentally calculated the total before checking the receipt.",
    "查收据前，她在头脑中算了总额。",
    "He mentally rehearsed the opening lines of his speech.",
    "他在脑中预演了演讲开场白。"
  ],
  [
    "pensioner",
    "名词 · 领养老金者",
    "pensioner 指领取养老金的人，常用于英式语境；不应只凭年龄就断定某人一定是 pensioner。",
    "A pensioner showed us photographs of the old railway.",
    "一位领取养老金的老人向我们展示旧铁路照片。",
    "The pensioner volunteers at the library twice a week.",
    "这位退休金领取者每周在图书馆做两次志愿者。"
  ],
  [
    "graphics",
    "名词复数 · 图形、图像",
    "graphics 可指用于说明的图形或电脑生成图像，常按复数处理；a graphic 才是一幅具体图形的单数表达。",
    "The graphics make the instructions easier to follow.",
    "这些图形让操作说明更易理解。",
    "The designer replaced the blurry graphics.",
    "设计师替换了模糊的图像。"
  ],
  [
    "rhetoric",
    "名词 · 修辞学",
    "rhetoric 可指有效表达和说服的技巧或研究，通常不可数；也有空洞辞令的贬义，不能每次都如此翻译。",
    "The course explores rhetoric in public speeches.",
    "课程探讨公开演讲中的修辞。",
    "She studied rhetoric to understand how arguments persuade.",
    "她学习修辞学以理解论证如何说服人。"
  ],
  [
    "offender",
    "名词 · 违规者",
    "offender 指违反法律、规则或行为准则者，通常可数；不同情境严重程度不同，不应一律译成重罪犯。",
    "The first offender received a written warning.",
    "首位违规者收到书面警告。",
    "The report identified the repeat offender.",
    "报告指出了那名屡次违规者。"
  ],
  [
    "lesser",
    "形容词 · 较小的、较不重要的",
    "lesser 常放在名词前比较重要性、程度或规模；不是修饰动词花费较少的通用 less 替代词。",
    "The committee focused on the lesser risks first.",
    "委员会先关注较小的风险。",
    "The second entrance has a lesser role in the new plan.",
    "第二入口在新方案中的作用较小。"
  ],
  [
    "pickup",
    "名词 · 回升",
    "pickup 可指商业活动等的回升，常接 in 说明领域；它是一个名词单词，与动词短语 pick up 分开写不同。",
    "There was a pickup in ticket sales after the review.",
    "评论发表后，售票量有所回升。",
    "The manager noticed a pickup in orders.",
    "经理注意到订单回升。"
  ],
  [
    "theology",
    "名词 · 神学",
    "theology 指对宗教信仰与实践，尤其神与世界关系的研究；学科义通常不可数，不等于任何宗教仪式。",
    "She studies theology at the university.",
    "她在大学学习神学。",
    "The library has a section devoted to theology.",
    "图书馆有一个神学专区。"
  ],
  [
    "alleged",
    "形容词 · 据称的",
    "alleged 表示有人如此声称但尚未证明；描述指控时保留这种不确定性，不能把 alleged 自动译成已确认。",
    "The article examined the alleged discovery.",
    "文章研究了那项据称的发现。",
    "The alleged thief denied taking the bicycle.",
    "被指控的窃贼否认拿走自行车。"
  ],
  [
    "obliged",
    "动词分词 · 被迫、负有义务",
    "be obliged to do 表示由于规则或处境必须做；much obliged 还可表达感谢，不要忽略结构差别。",
    "We were obliged to leave when the alarm sounded.",
    "警报响起时我们不得不离开。",
    "Members are obliged to return borrowed tools.",
    "会员有义务归还借用的工具。"
  ],
  [
    "regulatory",
    "形容词 · 监管的",
    "regulatory 表示与管理、规则控制相关，常修饰 body、requirements；不是普通描述规律重复发生的 regular。",
    "The factory faced new regulatory requirements.",
    "工厂面临新的监管要求。",
    "A regulatory body reviewed the safety report.",
    "监管机构审查了安全报告。"
  ],
  [
    "combined",
    "动词分词 · 结合、合并",
    "combined 是 combine 的过去式或过去分词；combined with 表示与某物结合，不必指两者彻底失去原有特点。",
    "The team combined two small rooms into a workshop.",
    "团队把两个小房间合成工作坊。",
    "The artist combined wood with coloured glass.",
    "艺术家把木材与彩色玻璃结合起来。"
  ],
  [
    "offering",
    "名词 · 推出的产品或作品",
    "offering 可指供出售或供公众欣赏的产品、作品等，通常可数；也可指供品，此处不取宗教义。",
    "The bakery's latest offering is a walnut loaf.",
    "面包店最新推出的产品是核桃面包。",
    "The new film is the director's most ambitious offering.",
    "新片是这位导演最具雄心的作品。"
  ],
  [
    "archbishop",
    "名词 · 大主教",
    "archbishop 指教会中负责一个教省或具相等荣衔的主教；是特定宗教职位，不泛指所有宗教领袖。",
    "The archbishop visited the restored chapel.",
    "大主教访问了修复后的礼拜堂。",
    "A portrait of the archbishop hangs in the hall.",
    "大厅里挂着大主教的肖像。"
  ],
  [
    "ideological",
    "形容词 · 意识形态的",
    "ideological 表示与思想体系或观念有关，常修饰 difference、debate；不同于表示理想的 ideal，不应混译。",
    "The debate exposed ideological differences within the group.",
    "辩论暴露了群体内部的思想分歧。",
    "The essay examines the movement's ideological roots.",
    "文章考察了运动的思想根源。"
  ],
  [
    "striker",
    "名词 · 罢工者",
    "striker 可指参加罢工的工人，是可数名词；体育语境的击球者或前锋属于不同义项，依上下文判断。",
    "A striker explained the workers' demands.",
    "一位罢工者解释了工人们的诉求。",
    "The strikers gathered outside the closed factory.",
    "罢工者聚在关闭的工厂外。"
  ],
  [
    "broker",
    "名词 · 经纪人",
    "broker 指在买卖等交易中代表双方或一方协商的中介，可数；不一定拥有被交易的商品或房产。",
    "A broker helped them find an office to rent.",
    "一位经纪人帮他们寻找出租办公室。",
    "The seller asked a broker to arrange the meeting.",
    "卖方请经纪人安排会面。"
  ],
  [
    "impressed",
    "动词分词 · 使钦佩",
    "impressed 是 impress 的过去式或过去分词；be impressed by 表示受到好印象、感到钦佩，主体是感受者。",
    "Her careful preparation impressed the judges.",
    "她细致的准备给评委留下深刻印象。",
    "We were impressed by the child's patience.",
    "孩子的耐心让我们钦佩。"
  ],
  [
    "courtroom",
    "名词 · 法庭审判室",
    "courtroom 指举行法院审理的房间，可数；区别于 court 可指整个法院或机构的更广泛用法。",
    "The courtroom was quiet when the judge entered.",
    "法官进入时，法庭里很安静。",
    "Reporters waited outside the courtroom.",
    "记者们在审判室外等候。"
  ],
  [
    "tumor",
    "名词 · 肿瘤",
    "tumor 是美式拼写，英式常写 tumour；可指良性或恶性异常组织增生，词本身不能等同于癌症。",
    "The scan showed a small tumor.",
    "扫描显示有一个小肿瘤。",
    "The doctor explained that the tumor was benign.",
    "医生解释说这个肿瘤是良性的。"
  ],
  [
    "voting",
    "动词分词 · 投票",
    "voting 是 vote 去掉 e 后的现在分词，voting for 或 against 说明支持或反对对象；不代表选举结果。",
    "Members are voting on the new proposal today.",
    "会员们今天就新提案投票。",
    "She is voting for the candidate who supports the library.",
    "她正投票支持那位支持图书馆的候选人。"
  ],
  [
    "coordinator",
    "名词 · 协调员",
    "coordinator 指组织人员或小组配合工作的负责人，通常可数；不一定就是所有参与者的上级。",
    "The coordinator sent each volunteer a timetable.",
    "协调员给每位志愿者发了时刻表。",
    "Ask the project coordinator about the delivery.",
    "请向项目协调员询问交付事宜。"
  ],
  [
    "teammate",
    "名词 · 队友",
    "teammate 指与自己同一队的成员，是可数名词；参加同一比赛但属于其他队的人不是自己的 teammate。",
    "My teammate helped me practise the final pass.",
    "队友帮我练习最后一传。",
    "She thanked every teammate after the match.",
    "比赛后她感谢了每位队友。"
  ],
  [
    "antibody",
    "名词 · 抗体",
    "antibody 指参与免疫反应、特异性识别抗原的蛋白质，复数 antibodies；与引起反应的 antigen 抗原区分。",
    "The diagram shows an antibody binding to an antigen.",
    "示意图展示抗体与抗原结合。",
    "The laboratory measured the antibody level in the sample.",
    "实验室测量了样本中的抗体水平。"
  ],
  [
    "evidently",
    "副词 · 显然、据现有迹象",
    "evidently 可表示从现有证据推断看来如此；说话者未必直接目睹，不能译成绝对保证无误。",
    "The gate had evidently been repaired recently.",
    "看起来大门最近修过。",
    "She was evidently pleased with the new shelves.",
    "她显然对新架子很满意。"
  ],
  [
    "instructional",
    "形容词 · 教学指导的",
    "instructional 常形容传授知识或操作信息的资料，如 instructional video；不是表示收到指令后的被动动作。",
    "The kit includes an instructional booklet.",
    "套件附有一本操作指导手册。",
    "We watched an instructional video about paper making.",
    "我们看了一段造纸教学视频。"
  ],
  [
    "mid",
    "形容词 · 中间的",
    "mid 表示处于中部，常用在复合表达如 mid-August；表示月中时不是独立的序数词。",
    "The flowers usually open in mid-April.",
    "这些花通常在四月中旬开放。",
    "A rescue boat waited in mid ocean.",
    "一艘救援船在大洋中部等待。"
  ],
  [
    "takeover",
    "名词 · 接管",
    "takeover 作名词连写，表示接管的行为；动词短语 take over 分写，名词可接 of 说明接管对象。",
    "The takeover of the small company surprised its staff.",
    "这家小公司被收购让员工惊讶。",
    "The board discussed the proposed takeover.",
    "董事会讨论了拟议的收购。"
  ],
  [
    "referendum",
    "名词 · 公民投票",
    "referendum 指将议案等交由公众投票表决，通常可数；不等同于每次选举人员，复数有 referendums、referenda。",
    "The town held a referendum on the transport plan.",
    "小镇就交通计划举行公民投票。",
    "The referendum attracted a large turnout.",
    "这次公投吸引了大量选民参与。"
  ],
  [
    "genuinely",
    "副词 · 真诚地、真正地",
    "genuinely 强调情感或特征真实而非装出，常修饰感受或形容词；不能直接作为名词前的 genuine 使用。",
    "She was genuinely delighted by the unexpected visit.",
    "这次意外来访让她由衷高兴。",
    "The guide seemed genuinely interested in our questions.",
    "向导似乎真的对我们的问题感兴趣。"
  ],
  [
    "marketplace",
    "名词 · 集市",
    "marketplace 可指举行买卖的开放场地，通常可数；也可抽象指竞争市场，此处聚焦实际集市地点。",
    "The marketplace filled with stalls before sunrise.",
    "日出前集市上就摆满了摊位。",
    "We bought a woven basket in the marketplace.",
    "我们在集市买了一只编织篮。"
  ],
  [
    "developmental",
    "形容词 · 发展的、促进发展的",
    "developmental 描述与成长发展有关或用于促进发展的事物；不能把它当 developing 在所有句中的替换。",
    "The course covers developmental stages in childhood.",
    "课程涵盖儿童成长的各阶段。",
    "These developmental toys encourage children to sort shapes.",
    "这些益智玩具鼓励儿童按形状分类。"
  ],
  [
    "selected",
    "动词分词 · 挑选了、被挑选的",
    "selected 可是 select 的过去式或过去分词，表示已经挑选；selected for 后说明用途或入选活动。",
    "The judges selected three photographs for the exhibition.",
    "评委挑选了三张照片参展。",
    "She was selected for the school's swimming team.",
    "她入选了学校游泳队。"
  ],
  [
    "planned",
    "动词分词 · 计划了",
    "planned 是 plan 的过去式或过去分词，双写 n 再加 ed；planned to do 表示当时打算，不保证实际完成。",
    "We planned to visit the mill after lunch.",
    "我们计划午饭后参观磨坊。",
    "The architect planned a larger entrance.",
    "建筑师设计了一个更大的入口。"
  ],
  [
    "reduced",
    "动词分词 · 减少了",
    "reduced 是 reduce 的过去式或过去分词；reduced by 说明减少的量，reduced to 说明减少后的量，注意区别。",
    "The repair reduced the noise considerably.",
    "这次修理大幅降低了噪声。",
    "The price was reduced to ten dollars.",
    "价格降到了十美元。"
  ],
  [
    "sexuality",
    "名词 · 性、性意识",
    "sexuality 涉及人的性及相关感受、兴趣或表达，通常不可数；不等同于单指生理性别的 sex。",
    "The novel explores identity and sexuality.",
    "小说探讨了身份与性意识。",
    "The course discusses sexuality in a respectful way.",
    "课程以尊重的方式讨论性相关议题。"
  ],
  [
    "valuation",
    "名词 · 估值",
    "valuation 可指评估价值的过程或估出的金额；valuation of 后接对象，不一定等于实际成交价格。",
    "The owner requested a valuation of the old house.",
    "房主要求评估老房子的价值。",
    "The final valuation was lower than expected.",
    "最终估值比预期低。"
  ],
  [
    "feminist",
    "名词 · 女权主义者",
    "feminist 作名词指支持或参与女权主义的人，通常可数；不限于女性，也可作形容词修饰思想或运动。",
    "The feminist argued for equal access to education.",
    "这位女权主义者主张平等的受教育机会。",
    "A feminist spoke at the college's history event.",
    "一位女权主义者在学院的历史活动上发言。"
  ],
  [
    "ranger",
    "名词 · 护林员",
    "ranger 在森林或公园语境可指管理员、护林员，常说 park ranger；军事中的特殊兵种属于另一义项。",
    "The ranger checked the trail after the storm.",
    "护林员在风暴后检查了小径。",
    "A park ranger showed us the nesting area.",
    "公园管理员带我们看了筑巢区。"
  ],
  [
    "wicket",
    "名词 · 小门",
    "wicket 可指较大门旁或门中供通行的小门，是可数名词；板球中的三柱门等另有义项，先依场景辨认。",
    "The gardener opened the wicket beside the main gate.",
    "园丁打开了大门旁的小门。",
    "A narrow wicket led into the courtyard.",
    "一扇狭窄小门通往庭院。"
  ],
  [
    "inclined",
    "形容词 · 倾向于",
    "be inclined to do 表示有某种意愿或倾向，语气比决定去做更保留；物理倾斜义要根据搭配区分。",
    "I am inclined to agree with the quieter proposal.",
    "我倾向于赞成那个更安静的方案。",
    "She felt inclined to stay another day.",
    "她有意再待一天。"
  ],
  [
    "dancing",
    "动词分词 · 跳舞",
    "dancing 是 dance 去掉 e 后的现在分词，搭配 be 可构成进行时；dancing to 后接伴舞音乐。",
    "The children are dancing to the drumbeat.",
    "孩子们正随着鼓点跳舞。",
    "She enjoys dancing with her friends.",
    "她喜欢与朋友跳舞。"
  ],
  [
    "inheritance",
    "名词 · 遗产、继承",
    "inheritance 可指继承得到的财产，也可指继承过程；receive an inheritance 表示得到遗产，不指自己的全部收入。",
    "She used her inheritance to restore the cottage.",
    "她用继承的遗产修复小屋。",
    "The brothers discussed the inheritance after the meeting.",
    "兄弟俩会后讨论了遗产。"
  ]
];
additions.push(...additionsSeven);
const additionsEight = [
  [
    "strongly",
    "副词 · 强烈地",
    "strongly 修饰支持、反对或感受时强调程度；它是副词，直接形容结实的物体仍用 strong。",
    "I strongly support the plan to reopen the library.",
    "我强烈支持重开图书馆的计划。",
    "She feels strongly about protecting the old trees.",
    "她对保护老树抱有强烈感情。"
  ],
  [
    "gay",
    "形容词 · 同性恋的",
    "gay 现代常用于同性恋身份，常修饰人或伴侣；旧文本中的快乐义另依年代判断，不能当作贬义评价。",
    "The film follows a gay couple raising a family.",
    "电影讲述一对同性伴侣养育家庭的经历。",
    "The author writes about growing up as a gay teenager.",
    "作者讲述自己作为同性恋青少年的成长经历。"
  ],
  [
    "liable",
    "形容词 · 负有责任的",
    "liable for 常表示依法承担某项责任，后接损失、债务等；与 liable to do 的可能发生结构分开记。",
    "The notice says the owner is liable for repair costs.",
    "通知说业主承担维修费用。",
    "Who is liable for damage to the rented equipment?",
    "谁对租赁设备的损坏负责？"
  ],
  [
    "laughter",
    "名词 · 笑声",
    "laughter 通常不可数，a burst of laughter 表示一阵笑声；它不是表示笑这一动作的动词 laugh。",
    "Laughter drifted out of the classroom.",
    "笑声从教室里传出来。",
    "Her unexpected reply filled the room with laughter.",
    "她出人意料的回答让满屋充满笑声。"
  ],
  [
    "container",
    "名词 · 容器",
    "container 泛指盛装物品的盒、罐等容器，是可数名词；货运中也可特指集装箱，需依大小和用途判断。",
    "Keep the seeds in a dry container.",
    "把种子保存在干燥容器里。",
    "The container has a lid that closes tightly.",
    "这个容器有一个能盖紧的盖子。"
  ],
  [
    "exclusive",
    "形容词 · 独有的、专用的",
    "exclusive 可指仅由一个人或群体使用的，exclusive use 表示专用；不应把所有 exclusive 都理解为昂贵奢华。",
    "The room is for the exclusive use of staff.",
    "这个房间仅供员工使用。",
    "The museum gave her exclusive access to the letters.",
    "博物馆允许她独家查阅那些信件。"
  ],
  [
    "illustration",
    "名词 · 插图",
    "illustration 可指帮助说明内容的图画或图表，可数；也可指说明性的例子，不必都是写实绘画。",
    "The illustration shows how the pump moves water.",
    "插图说明泵如何输水。",
    "Each chapter begins with a small illustration.",
    "每章都以一幅小插图开始。"
  ],
  [
    "lion",
    "名词 · 狮子",
    "lion 指狮子，通常可数；可泛指该动物，也常与 lioness 母狮对照，不能只凭词形认定一定是雄性。",
    "A lion rested in the shade of the tree.",
    "一头狮子在树荫下休息。",
    "The guide pointed to a lion near the rocks.",
    "向导指向岩石旁的一头狮子。"
  ],
  [
    "desirable",
    "形容词 · 值得想要的、可取的",
    "desirable 表示具吸引力或值得追求，不等于必须具备；招聘或条件说明中与 essential 的强制程度不同。",
    "Experience with maps is desirable for this role.",
    "这个岗位最好具备地图使用经验。",
    "A quieter location would be desirable for the recording.",
    "录音最好选更安静的地点。"
  ],
  [
    "pill",
    "名词 · 药丸",
    "pill 可指供吞服的小固体药物，是可数名词；不代表某种具体疗效，the pill 还可能特指避孕药。",
    "The pill bottle had a clear label.",
    "药丸瓶上有清楚的标签。",
    "She asked the pharmacist about the size of the pill.",
    "她向药剂师询问药丸的大小。"
  ],
  [
    "slam",
    "动词 · 砰地关上",
    "slam 可直接接 door 等表示用力关出声，也可不及物；过去式 slammed 双写 m，语气比普通 close 强。",
    "Please do not slam the cupboard door.",
    "请不要砰地关橱柜门。",
    "A sudden gust made the window slam shut.",
    "一阵突来的风使窗户砰地关上。"
  ],
  [
    "specially",
    "副词 · 专门地",
    "specially 可表示为某个特定用途而做，常见 specially made；表示尤其时常用 especially，二者有交叉但不可机械互换。",
    "These shelves were specially made for the narrow room.",
    "这些架子专为狭窄房间制作。",
    "She came specially to see the restored painting.",
    "她专程来看修复的画。"
  ],
  [
    "confuse",
    "动词 · 混淆",
    "confuse A with B 表示把两者弄混；confuse someone 则是使某人困惑，注意人和被混淆对象的区别。",
    "Do not confuse the exit sign with the meeting point.",
    "不要把出口标志与集合点弄混。",
    "The similar labels confuse many visitors.",
    "相似标签让许多访客困惑。"
  ],
  [
    "duck",
    "名词 · 鸭子",
    "duck 指鸭子时可数，通常复数 ducks；谈作为食材的鸭肉时常不可数，别把两种数的用法混用。",
    "A duck swam beneath the little bridge.",
    "一只鸭子游过小桥下面。",
    "The child drew a duck with bright orange feet.",
    "孩子画了一只橙色脚的鸭子。"
  ],
  [
    "uncertain",
    "形容词 · 不确定的",
    "uncertain 可描述人不清楚某事，也可描述结果尚不明朗；uncertain about 后说明不确定的内容。",
    "She was uncertain about the meeting time.",
    "她不确定开会时间。",
    "The cause of the leak remains uncertain.",
    "漏水原因仍不确定。"
  ],
  [
    "colonel",
    "名词 · 上校",
    "colonel 是军衔名称，发音不能按每个字母直拼，常读作近似 kernel；不同军队的具体职责可能不同。",
    "The colonel inspected the damaged bridge.",
    "上校检查了受损桥梁。",
    "A colonel addressed the new officers.",
    "一位上校向新军官讲话。"
  ],
  [
    "unfair",
    "形容词 · 不公平的",
    "unfair 可形容规则、待遇或判断不公；unfair to someone 指对某人不公平，不要与 unfortunate 不幸的混淆。",
    "It seems unfair to change the rules halfway through.",
    "中途改规则似乎不公平。",
    "The children complained about the unfair division of work.",
    "孩子们抱怨工作分配不公平。"
  ],
  [
    "merit",
    "名词 · 优点、价值",
    "merit 可不可数表示价值，也可复数 merits 列举优点；on merit 表按本身表现评价，不依身份决定。",
    "The proposal has merit despite its high cost.",
    "尽管成本高，这项提案仍有价值。",
    "We discussed the merits of each design.",
    "我们讨论了每种设计的优点。"
  ],
  [
    "boost",
    "动词 · 提高、促进",
    "boost 可直接接数量、士气、信心等表示提升；它强调推动增加，不一定说明最终增加了多少。",
    "The extra practice may boost her confidence.",
    "额外练习可能增强她的信心。",
    "The festival helped boost sales in the village.",
    "节庆活动帮助提高村里的销售额。"
  ],
  [
    "duration",
    "名词 · 持续时间",
    "duration 强调事件持续多久，而非何时开始；for the duration of 表示在整个期间，不必重复加 time。",
    "The duration of the tour is ninety minutes.",
    "参观持续九十分钟。",
    "Please remain seated for the duration of the demonstration.",
    "演示全程请保持就座。"
  ],
  [
    "endless",
    "形容词 · 无休止的",
    "endless 可字面表示没有终点，也常夸张描述仿佛没完没了；不应把每个 endless queue 都理解成真正无限。",
    "The children asked endless questions about the telescope.",
    "孩子们没完没了地问望远镜的事。",
    "The road seemed endless in the afternoon heat.",
    "午后炎热中，道路仿佛没有尽头。"
  ],
  [
    "regret",
    "动词 · 后悔",
    "regret doing 指后悔做过的事；regret to say 则常用于遗憾告知，后面的动作时间关系不同。",
    "I regret leaving the camera at home.",
    "我后悔把相机留在家里。",
    "We regret to say that the workshop is full.",
    "我们遗憾地告知，工作坊已满员。"
  ],
  [
    "dull",
    "形容词 · 钝的",
    "dull 形容刀刃、尖端可指不锋利；形容课程或故事可指无趣，这里聚焦物体锋利程度。",
    "A dull blade can tear the paper.",
    "钝刀片会把纸扯破。",
    "The pencil was too dull to draw a fine line.",
    "铅笔太钝，画不出细线。"
  ],
  [
    "preliminary",
    "形容词 · 初步的",
    "preliminary 常形容正式阶段前的调查或结果；初步结果可能被进一步资料修正，不等于最终定论。",
    "The preliminary report identified three possible causes.",
    "初步报告指出三个可能原因。",
    "We held a preliminary meeting before the main workshop.",
    "主要工作坊前，我们开了预备会议。"
  ],
  [
    "influential",
    "形容词 · 有影响力的",
    "influential 指能影响人或事物，常说 influential in 某领域；与已经受到影响的 influenced 方向不同。",
    "Her book became influential in local history research.",
    "她的书在地方史研究中产生了重要影响。",
    "An influential teacher encouraged him to study music.",
    "一位有影响力的老师鼓励他学音乐。"
  ],
  [
    "pat",
    "名词 · 轻拍",
    "pat 作名词表示用手等轻拍的一下，give someone a pat 是常见结构；不等同于用力打击的 hit。",
    "She gave the dog a gentle pat.",
    "她轻轻拍了拍狗。",
    "A friendly pat on the shoulder reassured him.",
    "友好地拍一下肩膀让他安心。"
  ],
  [
    "ton",
    "名词 · 吨、大量",
    "ton 可指不同体系的重量单位，具体数值需看体系；口语 a ton of 常夸张表示很多，不应按重量换算。",
    "The sign lists the truck's load in tons.",
    "标牌以吨列出卡车载重。",
    "We still have a ton of work to finish.",
    "我们还有一大堆工作要完成。"
  ],
  [
    "pint",
    "名词 · 品脱",
    "pint 是容量单位，英美制的实际容量不同；a pint of 后接液体等，不能不看制度就固定换算成同一毫升数。",
    "The recipe calls for a pint of milk.",
    "食谱需要一品脱牛奶。",
    "She bought a pint of cream for the dessert.",
    "她买了一品脱奶油做甜点。"
  ],
  [
    "exclusively",
    "副词 · 仅仅、专门",
    "exclusively 强调限于某一对象、用途或方式，比主要地更有排他意味；不要将主要使用误写为仅仅使用。",
    "The room is used exclusively for music practice.",
    "这个房间仅用于音乐练习。",
    "The shop sells exclusively handmade goods.",
    "这家店专卖手工制品。"
  ],
  [
    "operational",
    "形容词 · 可运行的",
    "operational 可表示设备或系统已具备运行条件，fully operational 即完全可用；不只指计划已经写好。",
    "The water pump is operational again.",
    "水泵又能运行了。",
    "The new station will be fully operational next week.",
    "新车站下周将全面投入运行。"
  ],
  [
    "gasoline",
    "名词 · 汽油",
    "gasoline 是常见美式汽油说法，通常不可数，英式常说 petrol；不要与柴油 diesel 或泛指气体混淆。",
    "The engine runs on gasoline.",
    "这台发动机使用汽油。",
    "The truck carried sealed containers of gasoline.",
    "卡车运载着密封的汽油容器。"
  ],
  [
    "rocket",
    "名词 · 火箭",
    "rocket 可指由喷出气体推进的装置或飞行器，通常可数；某些英式菜单中另指芝麻菜，要依场景辨义。",
    "The rocket carried a small research instrument.",
    "火箭搭载了一个小型研究仪器。",
    "The children built a cardboard rocket.",
    "孩子们造了一枚纸板火箭。"
  ],
  [
    "lively",
    "形容词 · 活跃的、生动的",
    "lively 形容人可指精力充沛，形容讨论可指活跃；虽然以 ly 结尾，它在这里是形容词而非副词。",
    "The talk led to a lively discussion.",
    "讲座引出了一场热烈讨论。",
    "A lively tune filled the courtyard.",
    "欢快的曲调响彻庭院。"
  ],
  [
    "patience",
    "名词 · 耐心",
    "patience 表示面对延误或困难时保持平静的能力，通常不可数；区别于指病人的复数 patients。",
    "Restoring the tiny clock requires patience.",
    "修复这只小钟需要耐心。",
    "Thank you for your patience during the delay.",
    "感谢你在延误期间的耐心。"
  ],
  [
    "tender",
    "形容词 · 嫩的",
    "tender 在食物语境指容易咀嚼的柔嫩口感；形容感情可指温柔，不能将 tender meat 译成温柔的肉。",
    "The beans became tender after slow cooking.",
    "豆子慢煮后变软嫩了。",
    "She cut the tender meat into thin slices.",
    "她把嫩肉切成薄片。"
  ],
  [
    "whip",
    "动词 · 搅打",
    "whip 在烹饪中可指把奶油、蛋等搅打至起泡；与拌匀并非完全相同，动作强调打入空气。",
    "Whip the cream until it holds its shape.",
    "把奶油打到能保持形状。",
    "Use a clean bowl to whip the egg whites.",
    "用干净的碗打发蛋白。"
  ],
  [
    "conscience",
    "名词 · 良心",
    "conscience 指判断是非的内在意识，a guilty conscience 是内疚；与表示意识状态的 consciousness 不是同一词。",
    "Her conscience would not let her keep the lost money.",
    "良心让她不能留下捡到的钱。",
    "He returned the book to ease his conscience.",
    "他归还了书以让自己心安。"
  ],
  [
    "costly",
    "形容词 · 代价高的",
    "costly 可指价格昂贵，也可指错误造成重大损失；尽管以 ly 结尾，这里是形容词，直接修饰名词。",
    "The delay proved costly for the small business.",
    "延误让这家小企业付出高昂代价。",
    "Replacing the roof was a costly project.",
    "更换屋顶是项昂贵工程。"
  ],
  [
    "penny",
    "名词 · 便士",
    "penny 在英国可指一便士，金额复数常用 pence，数硬币可用 pennies；美式还可指一美分硬币，依地区辨别。",
    "The old ticket cost a penny.",
    "旧票价是一便士。",
    "She kept several pennies in a small tin.",
    "她在小铁盒里留着几枚便士硬币。"
  ],
  [
    "goodness",
    "名词 · 善良",
    "goodness 表示善良、良好品质时通常不可数；my goodness 则是感叹表达，不要每次都译成我的善良。",
    "His goodness showed in the way he treated strangers.",
    "他对待陌生人的方式体现了善良。",
    "She helped out of the goodness of her heart.",
    "她出于好心提供帮助。"
  ],
  [
    "partially",
    "副词 · 部分地",
    "partially 表示一定程度而非全部，常修饰完成、损坏等状态；它本身不规定恰好一半，不应固定译成半数。",
    "The doorway was partially blocked by boxes.",
    "门口被箱子挡住了一部分。",
    "The task was only partially completed.",
    "任务只完成了一部分。"
  ],
  [
    "enthusiastic",
    "形容词 · 热情的",
    "enthusiastic about 后接感兴趣的事物或动名词；它表达积极热情，并不自动意味着已经熟练掌握。",
    "The students were enthusiastic about the new garden.",
    "学生们对新花园充满热情。",
    "An enthusiastic audience welcomed the young performers.",
    "热情的观众欢迎年轻表演者。"
  ],
  [
    "peculiar",
    "形容词 · 奇特的",
    "peculiar 可指不寻常而令人注意，也可在 peculiar to 中表示特有；后一个结构不必有古怪贬义。",
    "A peculiar tapping sound came from the roof.",
    "屋顶传来奇特的敲击声。",
    "The custom is peculiar to this valley.",
    "这个习俗为这片山谷所特有。"
  ],
  [
    "robot",
    "名词 · 机器人",
    "robot 指能执行动作任务的机器，通常可数；不必都长成人形，也不能把任何自动开关都直接称为机器人。",
    "The robot sorted the blocks by colour.",
    "机器人按颜色给积木分类。",
    "A small robot moved between the shelves.",
    "一个小机器人在架子间移动。"
  ],
  [
    "injection",
    "名词 · 注射",
    "injection 可指注射行为或被注入的药物，通常可数；give an injection 与 have an injection 区分施打与接受。",
    "The nurse prepared an injection.",
    "护士准备了一针注射药物。",
    "He looked away during the injection.",
    "注射时他把目光移开了。"
  ],
  [
    "corresponding",
    "形容词 · 对应的",
    "corresponding 表示在位置、功能等方面互相对应，常修饰 part、number；不一定要求两项外形完全相同。",
    "Match each symbol with the corresponding word.",
    "把每个符号与对应单词配对。",
    "The two maps use corresponding colours.",
    "两张地图使用相互对应的颜色。"
  ],
  [
    "goat",
    "名词 · 山羊",
    "goat 指山羊，通常可数，复数 goats；不要把所有有角的家畜都叫 goat，绵羊通常是 sheep。",
    "A goat climbed onto the low wall.",
    "一只山羊爬上矮墙。",
    "The farmer brought the goat back to its pen.",
    "农夫把山羊带回围栏。"
  ],
  [
    "unpleasant",
    "形容词 · 令人不快的",
    "unpleasant 可描述气味、经历或态度让人不舒服；程度依语境，不应每次都升级成极其可怕。",
    "An unpleasant smell came from the drain.",
    "排水口传来难闻气味。",
    "The delay was unpleasant but brief.",
    "延误让人不快，不过持续不长。"
  ],
  [
    "headache",
    "名词 · 头痛",
    "headache 表示一次头痛时常用 a headache；也可比喻棘手问题，区别身体症状与比喻语境。",
    "She left early because she had a headache.",
    "她因头痛提前离开。",
    "A headache made it difficult for him to concentrate.",
    "头痛让他难以集中注意力。"
  ],
  [
    "tiger",
    "名词 · 老虎",
    "tiger 通常指有黑色条纹的大型猫科动物老虎，可数；故事中可比喻凶猛的人，但此处先记动物义。",
    "The tiger disappeared into the tall grass.",
    "老虎消失在高草丛里。",
    "A camera recorded the tiger near the river.",
    "相机拍到了河边的老虎。"
  ],
  [
    "swell",
    "动词 · 膨胀、肿胀",
    "swell 可不及物表示体积变大，过去式 swelled，过去分词可用 swollen；与表示很好的一些旧口语用法不同。",
    "Dry beans swell when they soak in water.",
    "干豆泡水会膨胀。",
    "The wooden door may swell in damp weather.",
    "木门在潮湿天气可能膨胀。"
  ],
  [
    "permanently",
    "副词 · 永久地",
    "permanently 表示持续、非临时地改变或处于某状态；修饰动作时不同于形容词 permanent 直接修饰事物。",
    "The old entrance was permanently closed.",
    "旧入口永久关闭了。",
    "They decided to settle permanently in the village.",
    "他们决定在村里永久定居。"
  ],
  [
    "sickness",
    "名词 · 生病、恶心",
    "sickness 可泛指生病，也可特指恶心感，motion sickness 是晕动病；不能离开搭配把每次都译成呕吐。",
    "Sickness kept several pupils at home.",
    "几名学生因病待在家里。",
    "The rough crossing caused a feeling of sickness.",
    "颠簸的渡船旅程让人恶心。"
  ],
  [
    "recorder",
    "名词 · 记录设备",
    "recorder 可指录音等记录设备，通常可数；也可指竖笛或某些司法职位，使用 sound recorder 可明确设备义。",
    "The recorder captured the birdsong clearly.",
    "录音机清楚录下了鸟鸣。",
    "She placed a small sound recorder on the table.",
    "她在桌上放了一个小录音设备。"
  ],
  [
    "miserable",
    "形容词 · 难受的、痛苦的",
    "miserable 可描述身体难受或情绪非常低落；比一般不高兴强，也有形容环境糟糕的用法。",
    "He felt miserable after missing the last train.",
    "错过末班火车后，他感到很难受。",
    "The cold wind made the waiting crowd miserable.",
    "冷风让等待的人群苦不堪言。"
  ],
  [
    "cheerful",
    "形容词 · 愉快的、明快的",
    "cheerful 可指人的情绪愉快，也可指房间等让人振奋；不代表此人从不遇到困难，要依当下语境。",
    "She greeted us with a cheerful smile.",
    "她用愉快的微笑迎接我们。",
    "Yellow curtains made the kitchen feel cheerful.",
    "黄色窗帘让厨房显得明快。"
  ],
  [
    "hopeful",
    "形容词 · 抱有希望的",
    "hopeful 可描述人怀抱希望，也可描述迹象令人有希望；be hopeful that 接所期待的情况，不等于确定发生。",
    "We are hopeful that the bridge will reopen soon.",
    "我们希望桥很快能重开。",
    "The first green shoots were a hopeful sign.",
    "最初的绿芽是令人抱有希望的迹象。"
  ],
  [
    "ending",
    "名词 · 结尾",
    "ending 可指故事、电影等的结尾部分，可数；an ending 不等同于把所有情节结果都称为 conclusion。",
    "The story has an unexpected ending.",
    "故事有一个出人意料的结尾。",
    "Please do not reveal the ending before I finish the book.",
    "我读完前请不要透露结尾。"
  ],
  [
    "rotation",
    "名词 · 旋转",
    "rotation 可指绕轴转动的过程，也可数表示转一整圈；on rotation 等轮换义要与物理旋转分开辨认。",
    "The diagram shows the rotation of the wheel.",
    "示意图展示轮子的旋转。",
    "One full rotation returns the pointer to its starting place.",
    "转一整圈后指针回到起点。"
  ],
  [
    "hatred",
    "名词 · 仇恨",
    "hatred 指强烈厌恶或敌意，常接 of、for 等说明对象；通常比普通 dislike 强，不适合描述轻微偏好。",
    "The speech tried to turn fear into hatred.",
    "演讲试图把恐惧转为仇恨。",
    "The novel explores the damage caused by hatred.",
    "小说探讨仇恨造成的伤害。"
  ],
  [
    "wicked",
    "形容词 · 邪恶的",
    "wicked 在故事中可指道德上邪恶，通常语气很强；某些口语有赞叹或程度加强用法，不能机械套用。",
    "The wicked ruler destroyed the village's only bridge.",
    "邪恶统治者毁掉了村里唯一的桥。",
    "The tale ends with the defeat of the wicked wizard.",
    "故事以邪恶巫师的失败告终。"
  ],
  [
    "startle",
    "动词 · 使吓一跳",
    "startle 表示突然惊动或吓一跳，常直接接受到惊动的人或动物；并不一定涉及长期恐惧或严重危险。",
    "A loud clap can startle the sleeping cat.",
    "响亮的拍手会惊到睡着的猫。",
    "Try not to startle the young birds.",
    "尽量别惊动幼鸟。"
  ],
  [
    "sadness",
    "名词 · 悲伤",
    "sadness 通常不可数表示悲伤情绪，a sense of sadness 是一种悲伤感；具体悲伤事例也可能出现可数用法。",
    "A sense of sadness remained after the farewell.",
    "告别后仍留着悲伤的感觉。",
    "She spoke about the loss with quiet sadness.",
    "她带着平静的悲伤谈起那次失去。"
  ],
  [
    "underneath",
    "介词 · 在……下面",
    "underneath 后接名词可强调位于某物下方或被遮住；也能单独作副词，不能每次都另加 under。",
    "The spare key is underneath the flowerpot.",
    "备用钥匙在花盆下面。",
    "A cat was sleeping underneath the bench.",
    "一只猫在长椅下面睡觉。"
  ],
  [
    "uneasy",
    "形容词 · 不安的",
    "uneasy about 表示对某事不安或担心；uneasy 不只是 easy 的机械否定，不等于描述一道题不容易。",
    "She felt uneasy about leaving the window open.",
    "她对让窗户开着感到不安。",
    "An uneasy silence followed the question.",
    "提问后出现令人不安的沉默。"
  ],
  [
    "presently",
    "副词 · 目前、不久",
    "presently 可表示目前，也可表示不久以后；它容易引起时间歧义，读时靠上下文判断，需精确时可换更明确的词。",
    "The gallery is presently closed for repairs.",
    "画廊目前因维修关闭。",
    "The guide said the next group would arrive presently.",
    "向导说下一组人不久就到。"
  ],
  [
    "lieutenant",
    "名词 · 副手",
    "lieutenant 除军衔外也可指替上级行事的助手或代表；此处取副手义，不必将普通组织关系译成军队军官。",
    "Her trusted lieutenant organized the volunteers.",
    "她信任的副手组织了志愿者。",
    "The leader sent a lieutenant to discuss the plan.",
    "领导派了一位副手讨论计划。"
  ],
  [
    "spelling",
    "名词 · 拼写",
    "spelling 可指拼写能力或一个词的字母写法；讨论某种可选写法时可数，泛指技能时通常不可数。",
    "Check the spelling of the street name.",
    "检查街道名的拼写。",
    "Her spelling improved with daily reading.",
    "她通过每日阅读提高了拼写能力。"
  ],
  [
    "cafe",
    "名词 · 咖啡馆",
    "cafe 是 café 的可接受无重音拼写，通常可数；可提供咖啡和简餐，不必只售咖啡一种饮品。",
    "The cafe beside the station opens early.",
    "车站旁的咖啡馆很早开门。",
    "We shared a table in the little cafe.",
    "我们在小咖啡馆合用了一张桌子。"
  ],
  [
    "grammatical",
    "形容词 · 语法的、合语法的",
    "grammatical 可表示与语法有关，也可表示符合语法规则；合语法不保证表达自然或事实正确。",
    "The tutor explained the grammatical structure of the sentence.",
    "导师解释了句子的语法结构。",
    "The sentence is grammatical but difficult to understand.",
    "这句话合乎语法，但难以理解。"
  ],
  [
    "precaution",
    "名词 · 预防措施",
    "precaution 指事前为防止伤害而采取的措施，常见 take precautions；不是事件发生后才采取的补救。",
    "We carried an extra torch as a precaution.",
    "我们多带了一支手电以防万一。",
    "Locking the gate is a simple precaution.",
    "锁门是一项简单的预防措施。"
  ],
  [
    "robbery",
    "名词 · 抢劫",
    "robbery 通常涉及以暴力或威胁从人处夺取财物；与泛指盗窃的 theft 及闯入盗窃的 burglary 概念有区别。",
    "The witness described the robbery to the police.",
    "目击者向警方描述了抢劫。",
    "The shop closed briefly after the robbery.",
    "店铺在抢劫后短暂关闭。"
  ],
  [
    "loosen",
    "动词 · 松开",
    "loosen 表示使变松，可直接接螺丝、绳结等；与丢失 lose 拼写、意义不同，不要漏掉中间的第二个 o。",
    "Loosen the knot before pulling out the rope.",
    "拉出绳子前先松开绳结。",
    "A small tool can loosen the tight screw.",
    "小工具可以松开拧紧的螺丝。"
  ],
  [
    "photographic",
    "形容词 · 摄影的",
    "photographic 表示与摄影相关或通过摄影获得的；与一张照片 photograph 的词性不同，常修饰 equipment、record。",
    "The archive contains photographic records of the old bridge.",
    "档案馆保存着旧桥的影像记录。",
    "She packed the photographic equipment carefully.",
    "她仔细收好了摄影设备。"
  ],
  [
    "honesty",
    "名词 · 诚实",
    "honesty 指尊重事实和坦率处事的品质，通常不可数；in all honesty 可用于坦率地说明真实看法。",
    "Her honesty helped the team solve the mistake.",
    "她的诚实帮助团队解决了错误。",
    "In all honesty, I preferred the simpler design.",
    "坦白说，我更喜欢简单的设计。"
  ],
  [
    "turning",
    "名词 · 转弯处",
    "turning 可指道路改变方向或可转入的地方，可数，英式指路常见；不是所有车辆动作都必须用这个名词。",
    "Take the next turning on the left.",
    "在下一个左侧路口转弯。",
    "A sign stood just before the turning.",
    "转弯处前面立着一块标牌。"
  ],
  [
    "foremost",
    "形容词 · 首要的",
    "foremost 强调排名、重要性或地位最靠前，常修饰 concern、expert；不是表示时间最近的 newest。",
    "The children's safety is our foremost concern.",
    "孩子的安全是我们首要关切。",
    "She became one of the region's foremost historians.",
    "她成了该地区最杰出的历史学家之一。"
  ],
  [
    "vacant",
    "形容词 · 空着的",
    "vacant 可形容座位或房间无人占用，也可形容职位空缺；不单指容器内部没有内容的 empty。",
    "The seat beside the window was vacant.",
    "窗边的座位空着。",
    "A vacant shop became a community workshop.",
    "一间空铺面变成了社区工作坊。"
  ],
  [
    "hardship",
    "名词 · 困苦、艰难",
    "hardship 泛指困苦可不可数，具体艰难遭遇可用复数 hardships；通常不只指一道练习题有难度。",
    "The storm caused financial hardship for many families.",
    "风暴使许多家庭陷入经济困苦。",
    "The diary records the hardships of the long journey.",
    "日记记录了漫长旅途的艰辛。"
  ],
  [
    "imprison",
    "动词 · 监禁",
    "imprison 可直接接被关押的人，被动式 be imprisoned；与表示监狱的名词 prison 区分，不在两者之间额外加介词。",
    "The ruler threatened to imprison anyone who protested.",
    "统治者威胁监禁任何抗议者。",
    "The law allowed officials to imprison debtors.",
    "那条法律允许官员监禁债务人。"
  ],
  [
    "thickness",
    "名词 · 厚度",
    "thickness 是表示厚这一尺寸的名词，可用 the thickness of；稠度也是一个义项，量木板时主要指尺寸。",
    "Measure the thickness of the glass before ordering a frame.",
    "订框前量一下玻璃厚度。",
    "The two boards differ in thickness.",
    "两块木板厚度不同。"
  ],
  [
    "moan",
    "名词 · 呻吟声",
    "moan 作名词可指低而持续的痛苦声音，a moan of pain 是疼痛的呻吟；也可表示抱怨，依对象辨义。",
    "A faint moan came from the next room.",
    "隔壁传来微弱的呻吟声。",
    "He let out a moan as he moved his sore leg.",
    "他挪动疼痛的腿时发出一声呻吟。"
  ],
  [
    "pearl",
    "名词 · 珍珠",
    "pearl 指某些软体动物体内形成的珍珠，可数；a string of pearls 是一串珍珠，不把整串当单颗。",
    "A single pearl hung from the silver chain.",
    "银链上挂着一颗珍珠。",
    "The jeweller examined the pearl under a lamp.",
    "珠宝匠在灯下查看珍珠。"
  ],
  [
    "fireman",
    "名词 · 消防员",
    "fireman 可指消防员，复数 firemen；现代中性职业称呼常用 firefighter，不必由传统称谓推断所有从业者性别。",
    "The fireman checked the empty building.",
    "消防员检查了空楼。",
    "A fireman carried the frightened cat outside.",
    "一名消防员把受惊的猫抱到外面。"
  ],
  [
    "vibration",
    "名词 · 振动",
    "vibration 可指振动过程或一次振动，语境决定可数性；机械振动义不要与比喻的氛围或感觉混淆。",
    "The machine caused a slight vibration in the floor.",
    "机器使地板产生轻微振动。",
    "Rubber pads reduced the vibration from the motor.",
    "橡胶垫减少了电机的振动。"
  ],
  [
    "weary",
    "形容词 · 疲倦的",
    "weary 可形容精力耗尽，也可在 weary of 中表示厌倦；与 wary 小心警惕的拼写和意义不同。",
    "The weary walkers rested beside the stream.",
    "疲倦的步行者在溪边休息。",
    "She grew weary of hearing the same excuse.",
    "她渐渐厌倦听同一个借口。"
  ],
  [
    "pear",
    "名词 · 梨",
    "pear 指梨或梨树，通常可数；与 pair 一对同音，读句时要靠语法和情境辨认，拼写不可混用。",
    "A ripe pear lay beside the bread.",
    "面包旁放着一个熟梨。",
    "She sliced the pear into a small bowl.",
    "她把梨切片放进小碗。"
  ],
  [
    "preferable",
    "形容词 · 更可取的",
    "preferable to 表示比另一选择更可取，通常不用 than；它本身已有比较意味，一般不必再加 more。",
    "The earlier train is preferable to the crowded evening service.",
    "较早那班车比拥挤的晚班车更可取。",
    "A short delay is preferable to a rushed repair.",
    "短暂延误比草率修理更好。"
  ],
  [
    "gloomy",
    "形容词 · 阴暗的、忧郁的",
    "gloomy 可形容光线阴暗，也可形容情绪低落或前景悲观；并非每个暗房间都说明居住者悲伤。",
    "The hallway looked gloomy without the lamps.",
    "没有灯，走廊显得阴暗。",
    "The gloomy forecast worried the farmers.",
    "悲观的预测让农民们担心。"
  ],
  [
    "kindness",
    "名词 · 善意",
    "kindness 泛指善良或善意时通常不可数，具体善举可用 a kindness；thank someone for their kindness 是感谢其好意。",
    "The visitors remembered her kindness.",
    "访客们记得她的善意。",
    "Bringing me a warm coat was a real kindness.",
    "给我带来暖外套真是一件善举。"
  ],
  [
    "naughty",
    "形容词 · 淘气的",
    "naughty 常形容儿童不听话或行为调皮，通常不等于严重邪恶；也有不得体义，需注意使用对象和语气。",
    "The naughty puppy hid one of my shoes.",
    "淘气的小狗藏起了我的一只鞋。",
    "The story follows a naughty child who learns to share.",
    "故事讲一个淘气孩子学会分享。"
  ],
  [
    "merry",
    "形容词 · 欢乐的",
    "merry 表示兴高采烈或充满节庆欢快，常见 Merry Christmas；不是每种安静满意的 happy 都适合替换。",
    "A merry crowd gathered around the musicians.",
    "欢乐的人群围在乐手周围。",
    "The song gave the party a merry ending.",
    "歌曲为聚会带来了欢快的结尾。"
  ],
  [
    "hamburger",
    "名词 · 汉堡包",
    "hamburger 可指夹牛肉饼的面包，也可指牛肉馅或肉饼；作为完整汉堡包时可数，不要由 ham 推断一定含火腿。",
    "He ordered a hamburger with onions.",
    "他点了一个加洋葱的汉堡包。",
    "The hamburger came with a small salad.",
    "汉堡包配了一份小沙拉。"
  ],
  [
    "sharpen",
    "动词 · 削尖、磨利",
    "sharpen 可直接接铅笔或刀具表示使尖锐，也可比喻提高技能；与形容词 sharp 的词性区别要保留。",
    "Use the small tool to sharpen the pencil.",
    "用小工具把铅笔削尖。",
    "The gardener stopped to sharpen the shears.",
    "园丁停下来磨剪刀。"
  ],
  [
    "continual",
    "形容词 · 反复不断的",
    "continual 可指接连反复发生，也有持续不停的用法；与 continuous 有重叠，不能绝对宣称一定有间隔。",
    "Continual interruptions made the lesson difficult.",
    "反复的打断让课堂难以进行。",
    "The continual noise from the road disturbed her work.",
    "道路上不断的噪声干扰了她的工作。"
  ],
  [
    "typewriter",
    "名词 · 打字机",
    "typewriter 指通过按键把字印在纸上的机器，通常可数；不是一般电脑键盘，也不同于操作机器的打字员 typist。",
    "The typewriter stood beside a pile of envelopes.",
    "打字机旁放着一堆信封。",
    "She typed the address on an old typewriter.",
    "她用旧打字机打出地址。"
  ],
  [
    "indoors",
    "副词 · 在室内、到室内",
    "indoors 是副词，可直接搭配 stay、go 等，不必再加 in；修饰名词的形容词通常是 indoor。",
    "The children stayed indoors during the storm.",
    "暴风雨期间孩子们待在室内。",
    "We moved the plants indoors before the frost.",
    "霜冻前我们把植物搬进室内。"
  ],
  [
    "comprehension",
    "名词 · 理解",
    "comprehension 通常不可数，指理解所听所读等内容的能力或过程；reading comprehension 强调阅读理解，不只是认出字母。",
    "Pictures can support comprehension of the instructions.",
    "图片可以帮助理解说明。",
    "The teacher checked our comprehension with three questions.",
    "老师用三个问题检查我们的理解。"
  ],
  [
    "practicable",
    "形容词 · 可实行的",
    "practicable 强调计划或方法实际上做得到；practical 常见实际、实用义，两者相关但不是在所有搭配中互换。",
    "The team searched for a practicable way to move the statue.",
    "团队寻找可行的搬运雕像方法。",
    "The plan is practicable with the tools we already have.",
    "用现有工具，这个计划可实行。"
  ],
  [
    "pronunciation",
    "名词 · 发音",
    "pronunciation 指读出词语的方式或动作，拼写中是 nun 而非 noun；与动词 pronounce 的字母变化值得特别记住。",
    "The recording demonstrates the pronunciation of each word.",
    "录音示范每个词的发音。",
    "Her pronunciation became clearer after careful practice.",
    "仔细练习后她的发音更清楚了。"
  ]
];
additions.push(...additionsEight);
const additionsNine = [
  [
    "downward",
    "副词 · 向下",
    "downward 表示从高处到低处或朝下的方向，可直接修饰动作；downwards 也是形式，不必在前面再加 to。",
    "The path slopes downward after the gate.",
    "小路过了大门后向下倾斜。",
    "She pointed downward at the broken step.",
    "她向下指着坏台阶。"
  ],
  [
    "weekday",
    "名词 · 工作日",
    "weekday 现代通常指星期一至星期五，复数 weekdays；它表示一周中的日类，不保证每个人这些天都上班。",
    "The museum is quieter on a weekday.",
    "博物馆在工作日更安静。",
    "The bus runs every weekday.",
    "公交每个工作日运行。"
  ],
  [
    "shopkeeper",
    "名词 · 店主",
    "shopkeeper 指拥有或经营商店的人，可数；不一定指店内每位雇员，也不能把顾客包括在内。",
    "The shopkeeper wrapped the bowl in paper.",
    "店主用纸包好碗。",
    "A friendly shopkeeper showed us the old photograph.",
    "一位友善店主给我们看了老照片。"
  ],
  [
    "gracious",
    "形容词 · 亲切有礼的",
    "gracious 强调待人和蔼而有礼，常称赞主人或回应方式；不要与只强调动作优美的 graceful 混淆。",
    "Our host was gracious even when we arrived late.",
    "即使我们迟到，主人仍亲切有礼。",
    "She gave a gracious reply to the awkward question.",
    "她对尴尬问题作了得体回应。"
  ],
  [
    "solemn",
    "形容词 · 庄严的、严肃的",
    "solemn 可形容仪式气氛或人的表情严肃庄重；不必表示人物愤怒，也不同于普通安静的 quiet。",
    "The hall fell quiet during the solemn ceremony.",
    "庄严仪式期间，大厅安静下来。",
    "He listened with a solemn expression.",
    "他神情严肃地听着。"
  ],
  [
    "intentional",
    "形容词 · 故意的",
    "intentional 表示有意而为，常与 accidental 意外的对照；本身不必含恶意，可能是有意识的设计选择。",
    "The blank page was intentional.",
    "留白的那页是有意安排的。",
    "She explained that the change was intentional.",
    "她解释说这项改变是有意的。"
  ],
  [
    "worthless",
    "形容词 · 无价值的",
    "worthless 指没有价值或用途，评价很强；与 invaluable 无价而极有价值恰好不同，不能见否定形式就混为一谈。",
    "The damaged ticket was worthless after the event.",
    "活动后那张破损票毫无价值。",
    "The map was worthless without a scale.",
    "没有比例尺，地图毫无用处。"
  ],
  [
    "tramp",
    "动词 · 踩着走、长途步行",
    "tramp 可指脚步沉重地行走，也可指徒步跋涉；作名词有涉及人的贬损用法，此处聚焦动作。",
    "We had to tramp through mud to reach the shed.",
    "我们得踏着泥地走到棚屋。",
    "Please do not tramp up the stairs in muddy boots.",
    "请不要穿泥靴重踩着上楼。"
  ],
  [
    "sportsman",
    "名词 · 有体育精神的人",
    "sportsman 可称赞在运动中公平有风度的人，不只强调成绩；也可指参加运动者，现代泛称可用 sportsperson。",
    "He proved a good sportsman by congratulating his opponent.",
    "他向对手道贺，展现了体育风度。",
    "A true sportsman respects the rules even when losing.",
    "真正有体育精神的人即使输也尊重规则。"
  ],
  [
    "stiffen",
    "动词 · 变硬、使僵硬",
    "stiffen 既可不及物表示变硬，也可直接接材料使之硬挺；与形容词 stiff 区分，注意动作与状态。",
    "The glue will stiffen the fabric.",
    "胶水会让布料硬挺。",
    "Wet paper can stiffen as it dries.",
    "湿纸干后可能变硬。"
  ],
  [
    "shriek",
    "动词 · 尖叫",
    "shriek 强调尖锐高声的叫喊，可能由于惊吓也可能兴奋；不等同于所有普通音量的喊话。",
    "The children began to shriek with excitement.",
    "孩子们开始兴奋地尖叫。",
    "A sudden splash made her shriek.",
    "突然的水花让她尖叫起来。"
  ],
  [
    "attentive",
    "形容词 · 专心的、体贴的",
    "attentive to 可指认真关注某事或留意他人需求；专心听讲与提供周到服务要根据对象辨义。",
    "The class remained attentive during the demonstration.",
    "演示期间全班一直专心。",
    "The guide was attentive to the younger visitors.",
    "向导很照顾年幼访客的需求。"
  ],
  [
    "vanity",
    "名词 · 虚荣",
    "vanity 可指对自身或外貌过度自负，通常不可数；家具语境还可指梳妆台，不能不看场景直译。",
    "His vanity made it difficult to accept criticism.",
    "他的虚荣让他难以接受批评。",
    "The story gently mocks human vanity.",
    "故事温和地讽刺了人的虚荣。"
  ],
  [
    "troublesome",
    "形容词 · 麻烦的",
    "troublesome 形容带来问题或让人难处理的事物；与人感到烦恼的 troubled 方向不同，不宜混用。",
    "The loose hinge became a troublesome problem.",
    "松动铰链成了一个麻烦问题。",
    "A troublesome leak delayed the opening.",
    "棘手的漏水问题推迟了开业。"
  ],
  [
    "fruitful",
    "形容词 · 有成果的",
    "fruitful 比喻产生丰硕成果，常修饰 discussion、search；不必与实际水果有关，也不保证每项建议都成功。",
    "The meeting led to a fruitful exchange of ideas.",
    "会议促成了富有成果的思想交流。",
    "Our search through the archive was fruitful.",
    "我们查档案收获颇丰。"
  ],
  [
    "vain",
    "形容词 · 徒劳的",
    "vain 可形容努力没有结果，in vain 表示徒劳地；它也有自负义，注意不是同音的 vein 血管。",
    "They made a vain attempt to stop the leak.",
    "他们试图堵漏，但徒劳无功。",
    "We waited in vain for the missing parcel.",
    "我们白等了那个未到的包裹。"
  ],
  [
    "unbearable",
    "形容词 · 难以忍受的",
    "unbearable 指程度强到难忍，可修饰热、痛或噪声；比一般 unpleasant 更重，不适合每个轻微不便。",
    "The heat inside the tent became unbearable.",
    "帐篷里的热变得难以忍受。",
    "The noise was almost unbearable near the machine.",
    "机器旁的噪声几乎让人难以忍受。"
  ],
  [
    "telegram",
    "名词 · 电报",
    "telegram 指经电报方式传送的消息，通常可数；历史通信语境常见，不等于现代所有即时通讯消息。",
    "A telegram arrived with news of the ship.",
    "一封电报带来了船的消息。",
    "The museum displayed a telegram sent during the war.",
    "博物馆展示了一封战争期间发出的电报。"
  ],
  [
    "rouse",
    "动词 · 唤醒",
    "rouse 可直接接人表示使从睡眠或休息中醒来，常搭配 from sleep；还可指激起情绪，此处聚焦唤醒义。",
    "The bell will rouse the campers at dawn.",
    "钟声将在黎明唤醒露营者。",
    "A loud knock can rouse even a heavy sleeper.",
    "响亮敲门声甚至能叫醒熟睡的人。"
  ],
  [
    "treason",
    "名词 · 叛国",
    "treason 在政治法律语境常指背叛所效忠国家或君主的严重行为；词义不是日常不同意政府政策的同义词。",
    "The historian studied the trial for treason.",
    "历史学家研究了那场叛国案审判。",
    "The king accused his adviser of treason.",
    "国王指控顾问叛国。"
  ],
  [
    "transistor",
    "名词 · 晶体管",
    "transistor 指用于控制电流的半导体电子元件，可数；也可简称晶体管收音机，判断时看电路或器材语境。",
    "The diagram labels each transistor in the circuit.",
    "示意图标出了电路中每个晶体管。",
    "A tiny transistor controlled the signal.",
    "一枚微小晶体管控制着信号。"
  ],
  [
    "disable",
    "动词 · 禁用、使失效",
    "disable 可使设备或功能无法运行，直接接被停用对象；与 remove 删除不同，禁用未必移除对象。",
    "You can disable the timer with this switch.",
    "你可以用这个开关停用计时器。",
    "The technician had to disable the faulty sensor.",
    "技师不得不停用故障传感器。"
  ],
  [
    "quicken",
    "动词 · 加快",
    "quicken 可直接接 pace、steps 等使速度加快，也能不及物；与表示数量增长的 increase 关注点不同。",
    "The approaching rain made us quicken our pace.",
    "将至的雨让我们加快脚步。",
    "Her heartbeat began to quicken before the performance.",
    "表演前她的心跳开始加快。"
  ],
  [
    "joyful",
    "形容词 · 喜悦的",
    "joyful 可形容感到、表现出或引起喜悦的人和场合；是形容词，修饰动作时通常用 joyfully。",
    "A joyful shout came from the winners.",
    "获胜者发出喜悦的欢呼。",
    "The reunion was a joyful occasion for the family.",
    "重聚对家人而言是欢乐的时刻。"
  ],
  [
    "postman",
    "名词 · 邮递员",
    "postman 常指投递邮件的人，复数 postmen；mail carrier 是常见中性称呼，不与管理邮局的 postmaster 混淆。",
    "The postman delivered a parcel before lunch.",
    "邮递员午饭前送来一个包裹。",
    "She waved to the postman at the gate.",
    "她在门边向邮递员挥手。"
  ],
  [
    "indignant",
    "形容词 · 愤慨的",
    "indignant 描述因认为事情不公或不当而愤怒，常接 at、about；不是所有无明确理由的恼怒都要用此词。",
    "She was indignant at the unfair accusation.",
    "她对不公正的指控感到愤慨。",
    "An indignant reply arrived the next morning.",
    "第二天早晨收到一封愤慨的回复。"
  ],
  [
    "skillful",
    "形容词 · 熟练的",
    "skillful 是美式常见拼写，skilful 见于英式；可修饰有技巧的人或完成巧妙的处理，不同于副词 skillfully。",
    "A skillful carpenter repaired the curved chair leg.",
    "熟练木匠修好了弯曲椅腿。",
    "The painting shows skillful use of light.",
    "画作展现了对光线的巧妙运用。"
  ],
  [
    "gymnasium",
    "名词 · 体育馆",
    "gymnasium 指供室内运动的大厅或建筑，常简称 gym；在部分欧洲教育语境还有学校义，不能套用体育馆。",
    "The gymnasium has space for two basketball courts.",
    "体育馆能容纳两片篮球场。",
    "Students gathered in the gymnasium for the final rehearsal.",
    "学生们在体育馆进行最后排练。"
  ],
  [
    "worst",
    "形容词 · 最差的",
    "worst 是 bad 等的不规则最高级，名词前常有 the；比较两者较差用 worse，不把二者混淆。",
    "This was the worst storm of the winter.",
    "这是这个冬天最严重的风暴。",
    "The worst part was losing our only map.",
    "最糟糕的是丢了唯一的地图。"
  ],
  [
    "cordial",
    "形容词 · 热情友好的",
    "cordial 可称赞欢迎或关系友好有礼，常较正式；名词还有饮品义，描述人的态度时不用理解为饮料。",
    "The hosts gave us a cordial welcome.",
    "主人热情欢迎了我们。",
    "The two groups maintained cordial relations.",
    "两个群体保持友好关系。"
  ],
  [
    "circumference",
    "名词 · 圆周、周长",
    "circumference 常指圆的周长或外缘，区别跨过中心的直径 diameter；量一圈的长度不是量中心到边缘。",
    "Measure the circumference of the wheel with string.",
    "用绳子量轮子的周长。",
    "The diagram marks the circumference in blue.",
    "示意图用蓝色标出圆周。"
  ],
  [
    "zealous",
    "形容词 · 热忱的",
    "zealous 强调对某人、事业或理念投入强烈热情；区别于拼写相近的 jealous 嫉妒，褒贬仍依语境。",
    "A zealous volunteer catalogued the entire collection.",
    "一位热忱志愿者为全部藏品编了目录。",
    "She is a zealous supporter of the village library.",
    "她是村图书馆的热心支持者。"
  ],
  [
    "radioactivity",
    "名词 · 放射性",
    "radioactivity 指某些原子核自发衰变并放出粒子等的性质或现象，通常不可数；并非一切电磁信号都叫放射性。",
    "The instrument measures radioactivity in the sample.",
    "仪器测量样本的放射性。",
    "The textbook explains radioactivity with a diagram.",
    "课本用图解说明放射性。"
  ],
  [
    "punctual",
    "形容词 · 准时的",
    "punctual 描述人或服务按约定时间到达、进行；副词 punctually 才修饰到达动作，不是提早越多越准时。",
    "Our guide was punctual for every visit.",
    "向导每次参观都准时到场。",
    "The school values punctual attendance.",
    "学校重视准时出勤。"
  ],
  [
    "quart",
    "名词 · 夸脱",
    "quart 是容量单位，常与 gallon、pint 一起出现；英美制实际容量不同，换算时先确认计量体系。",
    "The bottle holds a quart of liquid.",
    "这个瓶子能装一夸脱液体。",
    "She poured a quart of water into the pot.",
    "她往锅里倒了一夸脱水。"
  ],
  [
    "environmental",
    "形容词 · 环境的",
    "environmental 常修饰与环境相关的影响、研究或保护工作；不只指天气，且 environmental friendly 应写 environmentally friendly。",
    "The class studied the dam's environmental effects.",
    "全班研究水坝对环境的影响。",
    "An environmental survey began near the river.",
    "河流附近开始了一项环境调查。"
  ],
  [
    "unemployment",
    "名词 · 失业",
    "unemployment 通常不可数，表示失业状态或失业情况；unemployment rate 是失业率，不是失业人数本身。",
    "The report examines unemployment in rural areas.",
    "报告研究农村地区的失业情况。",
    "His period of unemployment lasted four months.",
    "他的失业期持续了四个月。"
  ],
  [
    "jack",
    "名词 · 扑克牌的J",
    "jack 在纸牌语境指通常排在王后之下的人头牌，可数；同词也有千斤顶等义项，先依游戏场景判断。",
    "She played a jack from her hand.",
    "她从手牌中打出一张J。",
    "The jack of hearts was missing from the pack.",
    "这副牌少了红桃J。"
  ],
  [
    "rating",
    "名词 · 评级、评分",
    "rating 指依据某标准得出的等级或评价，可数；不同标准的评分不能只凭数值大小直接比较。",
    "The guide gives each campsite a safety rating.",
    "指南给每个营地评了安全等级。",
    "The hotel received a high rating for cleanliness.",
    "酒店的清洁程度获得高评分。"
  ],
  [
    "liability",
    "名词 · 责任、负债",
    "liability 可指承担责任的状态，复数 liabilities 常指债务；不要将公司负债与资产 assets 的方向弄反。",
    "The contract explains liability for damaged equipment.",
    "合同解释设备损坏的责任。",
    "The report lists the company's assets and liabilities.",
    "报告列出了公司的资产和负债。"
  ],
  [
    "specifically",
    "副词 · 明确地、具体地",
    "specifically 强调具体指明或准确限定，可修饰说明动作；more specifically 引出更精确的信息，不只是一般补充。",
    "She specifically asked for a quiet room.",
    "她明确要求一间安静房间。",
    "The sign refers specifically to bicycles.",
    "标牌具体针对自行车。"
  ],
  [
    "funding",
    "动词分词 · 提供资金",
    "funding 是 fund 的现在分词，表示为某事提供资金；此处用 be 加分词说明资助动作，不把提供者与接受者颠倒。",
    "The council is funding the repair of the bridge.",
    "议会正在资助修桥。",
    "Several charities are funding the school garden.",
    "几家慈善机构正为学校花园提供资金。"
  ],
  [
    "coalition",
    "名词 · 联盟",
    "coalition 指原本分开的群体为共同目标形成的联盟，可数；不一定永久合并为单个组织。",
    "A coalition of local groups supported the project.",
    "本地团体组成的联盟支持该项目。",
    "The parties formed a coalition after the election.",
    "选举后各党组成联盟。"
  ],
  [
    "retirement",
    "名词 · 退休",
    "retirement 可指退出工作岗位或退休后的阶段，通常不可数；in retirement 表退休后，不自动代表不再参与任何活动。",
    "She took up painting after retirement.",
    "退休后她开始画画。",
    "He volunteers at the museum in retirement.",
    "他退休后在博物馆做志愿者。"
  ],
  [
    "historian",
    "名词 · 历史学家",
    "historian 指研究或撰写历史的人，可数；与表示历史的形容词 historical 不同，也不只是亲历旧事的人。",
    "The historian compared three accounts of the battle.",
    "历史学家比较了三份战役记述。",
    "A local historian led the walk around the harbour.",
    "一位地方史学家带队漫步港口。"
  ],
  [
    "hip",
    "名词 · 髋部",
    "hip 指躯干下部两侧的髋部，也可指髋关节；on one's hip 与 hand、arm 等一起描述姿势，不等于腰的全部。",
    "She rested one hand on her hip.",
    "她把一只手放在髋部。",
    "The climber felt a pain in his left hip.",
    "攀登者感到左髋疼痛。"
  ],
  [
    "lawsuit",
    "名词 · 诉讼",
    "lawsuit 指提交法院处理的法律案件，通常可数；file a lawsuit 是提起诉讼，不表示已经胜诉或有罪。",
    "The company faced a lawsuit over the damaged goods.",
    "公司因货物损坏面临诉讼。",
    "The newspaper reported that the lawsuit had ended.",
    "报纸报道诉讼已结束。"
  ],
  [
    "detective",
    "形容词 · 侦探的",
    "detective 放在 novel、work 等前可形容与侦查有关；此处是形容词，不是作为人物主语的侦探名词。",
    "She borrowed a detective novel from the library.",
    "她从图书馆借了一本侦探小说。",
    "The documentary explains detective work in the last century.",
    "纪录片介绍上世纪的侦查工作。"
  ],
  [
    "fighter",
    "名词 · 拳击手",
    "fighter 可指战士、拳击手或战斗机，通常可数；本组聚焦拳击运动者，不宜把各义项混在同一句里。",
    "The young fighter trained before sunrise.",
    "年轻拳击手日出前就训练。",
    "The fighter thanked his coach after the bout.",
    "拳击手在比赛后感谢教练。"
  ],
  [
    "privacy",
    "名词 · 隐私、独处",
    "privacy 可表示不受他人观察干扰或未经允许侵入的状态，通常不可数；不等于所有独处都意味着保密秘密。",
    "The curtain gives each patient some privacy.",
    "帘子为每位病人提供一些私密空间。",
    "Please respect her privacy while she writes.",
    "她写作时请尊重她的私人空间。"
  ],
  [
    "narrative",
    "名词 · 叙述",
    "narrative 可指对事件的叙述或故事，通常可数；也可指呈现事态的观点框架，不保证叙述必然真实完整。",
    "The diary offers a vivid narrative of the journey.",
    "日记生动叙述了那段旅程。",
    "The narrative moves between the two villages.",
    "叙述在两个村庄之间切换。"
  ],
  [
    "versus",
    "介词 · 对阵、与……相比",
    "versus 可引出对手或比较的另一方，常缩写 vs. 或 v.；不同于表示诗行的复数 verses。",
    "The final match is North School versus West School.",
    "决赛是北校对西校。",
    "The article compares renting versus buying tools.",
    "文章比较租用与购买工具。"
  ],
  [
    "legitimate",
    "形容词 · 正当的、真实的",
    "legitimate 可形容诉求有根据而非虚假；也有合法义，正当担忧不必涉及法院作出的法律判断。",
    "The residents raised a legitimate concern about noise.",
    "居民提出了有根据的噪声担忧。",
    "The inspector checked whether the claim was legitimate.",
    "检查员核实索赔是否真实正当。"
  ],
  [
    "physically",
    "副词 · 身体上",
    "physically 可说明身体方面，常与 mentally 精神上对照；修饰 demanding 指体力要求，不必与物理学有关。",
    "The climb was physically demanding.",
    "这次攀登对体力要求很高。",
    "She felt physically tired but mentally alert.",
    "她身体疲倦，但头脑清醒。"
  ],
  [
    "prescription",
    "名词 · 处方",
    "prescription 可指医务人员开具的用药等书面指示，也可指处方药；此处先记可数的处方文件义。",
    "The pharmacist checked the prescription carefully.",
    "药剂师仔细核对处方。",
    "He brought the prescription to the pharmacy.",
    "他把处方带到药房。"
  ],
  [
    "fitness",
    "名词 · 身体健康、体能",
    "fitness 日常可指身体健康和体能状态，通常不可数；生物学的适合度另有专门义，不要跨领域直译。",
    "Regular swimming improved her fitness.",
    "经常游泳改善了她的体能。",
    "The course focuses on fitness and balance.",
    "课程注重体能和平衡。"
  ],
  [
    "thoroughly",
    "副词 · 彻底地",
    "thoroughly 修饰检查、清洗等表示充分仔细，也可强调程度；不是只表示动作很快完成。",
    "Wash the jars thoroughly before using them.",
    "使用前彻底清洗罐子。",
    "The mechanic checked the brakes thoroughly.",
    "技师全面检查了刹车。"
  ],
  [
    "superb",
    "形容词 · 极佳的",
    "superb 是高度赞许的评价，可描述质量、能力或景观；语气比普通 good 强，副词为 superbly。",
    "The concert ended with a superb performance.",
    "音乐会以极精彩的演出结束。",
    "The tower offers a superb view of the harbour.",
    "从塔上能看到绝佳的港口景色。"
  ],
  [
    "comply",
    "动词 · 遵守",
    "comply 通常不及物，遵守要求用 comply with；与直接接对象的 obey 结构不同，别省略这里的 with。",
    "All visitors must comply with the safety rules.",
    "所有访客必须遵守安全规定。",
    "The new doors comply with the stated standard.",
    "新门符合所列标准。"
  ],
  [
    "closet",
    "名词 · 壁橱",
    "closet 在常见美式家居语境指存放衣物等的橱柜或小空间，可数；不应把每个 closet 都理解为厕所。",
    "The spare blankets are in the closet.",
    "备用毯子在壁橱里。",
    "She cleared a shelf in the closet.",
    "她清理了壁橱里的一层架子。"
  ],
  [
    "desperately",
    "副词 · 极其、迫切地",
    "desperately 可强调极度需要或拼命行动，不一定真的毫无希望；修饰 need 常译迫切需要，注意搭配。",
    "The dry garden desperately needs rain.",
    "干燥花园迫切需要雨水。",
    "He searched desperately for the missing ticket.",
    "他拼命寻找丢失的票。"
  ],
  [
    "seemingly",
    "副词 · 看似",
    "seemingly 说明表面看来如此，常修饰形容词；保留判断的不确定性，不应直接删掉看似而断言事实。",
    "A seemingly simple question led to a long debate.",
    "一个看似简单的问题引发长时间辩论。",
    "The path ended at a seemingly empty house.",
    "小路通向一栋看似空着的房子。"
  ],
  [
    "monster",
    "名词 · 怪物",
    "monster 可指形状奇异或可怕的生物，通常可数；故事和比喻用法常见，不宜随意用来描述现实人的外貌。",
    "The child drew a friendly monster with three eyes.",
    "孩子画了一个有三只眼的友善怪物。",
    "A sea monster appeared in the sailor's story.",
    "水手的故事里出现了一只海怪。"
  ],
  [
    "consistently",
    "副词 · 一贯地",
    "consistently 强调多个时点或方面表现稳定一致，常修饰好坏表现；不必等于时间上毫无间断地连续进行。",
    "She consistently arrives before the first bell.",
    "她一贯在第一遍铃响前到达。",
    "The team performed consistently well throughout the season.",
    "球队整个赛季表现一直很好。"
  ],
  [
    "random",
    "形容词 · 随机的、无固定模式的",
    "random 日常可表示没有明确计划或模式，统计语境有更具体定义；不能把任何随手挑选都当严格随机抽样。",
    "He opened the book at a random page.",
    "他随手翻开书的一页。",
    "The game selects a random number.",
    "游戏随机选择一个数字。"
  ],
  [
    "oak",
    "名词 · 橡树、橡木",
    "oak 指橡树时通常可数，指木材时通常不可数；an oak 是一棵树，made of oak 是用橡木制成。",
    "An oak shaded the village square.",
    "一棵橡树为村庄广场遮荫。",
    "The table is made of oak.",
    "桌子用橡木制成。"
  ],
  [
    "adoption",
    "名词 · 收养",
    "adoption 可指收养孩子或动物的过程，具体个案可数；也有采纳方法等义项，此组聚焦收养。",
    "The family discussed adoption with a social worker.",
    "这家人与社工讨论了收养。",
    "The shelter arranged the dog's adoption.",
    "收容所安排了这只狗的领养。"
  ],
  [
    "ballot",
    "名词 · 选票",
    "ballot 可指供秘密表决的纸质或电子选票，通常可数；cast a ballot 是投票，不是表示选举一定已结束。",
    "Each member received a ballot at the door.",
    "每位会员在门口领到一张选票。",
    "Please mark only one name on the ballot.",
    "请只在选票上勾选一个名字。"
  ],
  [
    "premium",
    "形容词 · 优质的、高价的",
    "premium 作形容词可指质量出众或售价较高，常放名词前；不是所有标为 premium 的产品都已获客观质量认证。",
    "The shop sells premium wool from local farms.",
    "店铺出售本地农场的优质羊毛。",
    "A premium ticket includes a guided tour.",
    "高价票包含导览服务。"
  ],
  [
    "meaningful",
    "形容词 · 有意义的",
    "meaningful 可表示有明确意义、用途或重要性的；不只指情感感动，meaningful results 可指能说明问题的结果。",
    "The small project gave the pupils meaningful work.",
    "小项目为学生提供了有意义的工作。",
    "The data did not reveal a meaningful pattern.",
    "数据未显示有意义的模式。"
  ],
  [
    "trader",
    "名词 · 商人、交易者",
    "trader 指以买卖或交换为业的人，通常可数；可以交易日用品或金融品，不只限于股票投资者。",
    "A trader brought cloth from the coast.",
    "一位商人从沿海带来了布料。",
    "The local trader kept careful records of every sale.",
    "本地商人认真记录每笔销售。"
  ],
  [
    "hug",
    "动词 · 拥抱",
    "hug 可直接接被抱的人，也可不及物描述拥抱；过去式 hugged 双写 g，不必在宾语前加 with。",
    "She bent down to hug her little brother.",
    "她弯下身拥抱弟弟。",
    "They paused to hug before saying goodbye.",
    "他们告别前停下来拥抱。"
  ],
  [
    "striking",
    "形容词 · 引人注目的",
    "striking 作形容词表示特征明显而引起注意，常修饰 contrast、difference；这里不是正在敲击的动作。",
    "The two paintings show a striking contrast.",
    "两幅画形成鲜明对比。",
    "The bird has a striking red patch on its wing.",
    "鸟翅上有一块醒目红斑。"
  ],
  [
    "tightly",
    "副词 · 紧紧地",
    "tightly 修饰握、关、绑等动作可表示紧密牢固；与形容词 tight 修饰结或衣物等的位置不同。",
    "She held the rope tightly.",
    "她紧紧握住绳子。",
    "The lid must fit tightly to keep the seeds dry.",
    "盖子必须盖紧，才能保持种子干燥。"
  ],
  [
    "supervision",
    "名词 · 监督、指导",
    "supervision 通常不可数，under someone's supervision 指在某人监督指导下；不表示所有事情都由监督者亲手完成。",
    "Students may use the tools under supervision.",
    "学生可在监督下使用工具。",
    "The restoration continued under her supervision.",
    "修复工作在她指导下继续进行。"
  ],
  [
    "romance",
    "名词 · 恋情、浪漫感",
    "romance 可指一段恋情，也可不可数表示恋爱的浪漫感觉；与 romantic 形容词区分，按句子判断可数性。",
    "Their romance began during a summer course.",
    "他们的恋情始于一门暑期课程。",
    "The film brings romance to an ordinary seaside town.",
    "电影为普通海滨小镇带来了浪漫气息。"
  ],
  [
    "invariably",
    "副词 · 一贯、总是",
    "invariably 强调每次如此，比通常的 usually 更绝对；表达有限观察时应考虑是否真的适合这种强度。",
    "He invariably chooses the seat near the door.",
    "他总是选择靠门的座位。",
    "The bell invariably rings at eight.",
    "钟总是在八点敲响。"
  ],
  [
    "bug",
    "名词 · 小虫",
    "bug 日常可泛指各种小节肢动物，通常可数；严格昆虫学的 true bug 范围更窄，不把口语分类当科学定义。",
    "A tiny bug crawled across the leaf.",
    "一只小虫爬过叶面。",
    "The child watched a bug beneath the flowerpot.",
    "孩子观察花盆下的一只小虫。"
  ],
  [
    "revelation",
    "名词 · 揭露、披露之事",
    "revelation 可指原先未知信息被公开或新披露的事实，通常可数；宗教启示是另一义项，不必每次涉及神学。",
    "The revelation changed our understanding of the old map.",
    "这项新披露改变了我们对旧地图的理解。",
    "Her letter contained a surprising revelation.",
    "她的信披露了一件令人惊讶的事。"
  ],
  [
    "cooperative",
    "形容词 · 乐于合作的",
    "cooperative 可形容人愿意与别人配合，或形容共同完成的努力；作名词时合作社另有义项。",
    "The neighbours were cooperative during the repairs.",
    "维修期间邻居们很配合。",
    "The mural was a cooperative effort by several classes.",
    "壁画是几个班合作完成的。"
  ],
  [
    "disturbance",
    "名词 · 干扰、骚动",
    "disturbance 可指打破安静或平稳的行为、事件，通常可数；泛指干扰时也有不可数表达，不能仅理解为暴乱。",
    "A loud disturbance interrupted the talk.",
    "一阵喧闹打断了讲话。",
    "The work was completed with minimal disturbance.",
    "工作在尽量少的干扰下完成。"
  ],
  [
    "appreciation",
    "名词 · 感激、赞赏",
    "appreciation 可表示感激或赞赏，通常不可数；in appreciation of 表示为感谢，不只指价格上涨的增值义。",
    "She expressed her appreciation for their patient help.",
    "她对他们耐心的帮助表示感激。",
    "The flowers were a token of our appreciation.",
    "这些花代表我们的谢意。"
  ],
  [
    "banker",
    "名词 · 银行业从业者",
    "banker 指从事银行业务的人，通常可数；不只指拥有整家银行的人，也不同于普通储户 customer。",
    "The banker explained how the account worked.",
    "银行从业者解释了账户如何运作。",
    "A retired banker helped the charity keep its records.",
    "一位退休银行业人士帮慈善机构记账。"
  ],
  [
    "moor",
    "动词 · 系泊",
    "moor 表示用绳索或锚等固定船只，可直接接 boat；与名词荒原同形，此义不表示把船随意停在岸上。",
    "We need to moor the boat before the tide changes.",
    "潮汐变化前我们得系好船。",
    "They moor the ferry beside the old pier.",
    "他们把渡轮系泊在旧码头旁。"
  ],
  [
    "shark",
    "名词 · 鲨鱼",
    "shark 指鲨鱼，通常可数；也有对欺诈者的比喻用法，此组聚焦动物义，不把所有种类都视为同样危险。",
    "A shark swam past the camera.",
    "一条鲨鱼游过相机前。",
    "The guide identified the shark by its fin.",
    "向导凭鳍辨认出那条鲨鱼。"
  ],
  [
    "onwards",
    "副词 · 向前、从此以后",
    "onwards 是 onward 的副词变体，可用于空间或时间；from Monday onwards 表示从周一起往后，不是仅周一一天。",
    "The hikers continued onwards through the valley.",
    "徒步者继续向前穿过山谷。",
    "The room is available from noon onwards.",
    "房间从中午起可用。"
  ],
  [
    "stall",
    "名词 · 摊位",
    "stall 可指陈列出售商品的摊位，通常可数；马厩隔间或剧院座位也有此词，需看活动场景。",
    "A flower stall stood beside the bakery.",
    "面包店旁有一个花摊。",
    "She bought honey from a market stall.",
    "她从集市摊位买了蜂蜜。"
  ],
  [
    "motorway",
    "名词 · 高速公路",
    "motorway 是英式常见高速公路说法，通常可数；不同道路制度用词不同，不能把每条普通公路都叫 motorway。",
    "The motorway runs north of the town.",
    "高速公路从镇北经过。",
    "We left the motorway at the next exit.",
    "我们在下一个出口驶离高速公路。"
  ],
  [
    "allied",
    "形容词 · 结盟的、相关的",
    "allied 可表示通过联盟联合，也可指领域紧密相关；并非所有 allied 都特指某场战争的同盟国。",
    "The two allied groups shared their equipment.",
    "两个结盟团体共享设备。",
    "The course covers nursing and allied subjects.",
    "课程涵盖护理及相关学科。"
  ],
  [
    "faction",
    "名词 · 派别",
    "faction 常指较大组织内部持特定立场的派别，可数，常带纷争色彩；不等于任意临时工作小组。",
    "A faction within the committee opposed the plan.",
    "委员会内一个派别反对计划。",
    "The debate split the club into two factions.",
    "辩论使俱乐部分成两个派别。"
  ],
  [
    "steak",
    "名词 · 肉排、牛排",
    "steak 常指切得较厚的牛肉排，带其他食材名时也可指鱼排等；注意与同音 stake 木桩或赌注区分。",
    "The chef served the steak with roasted vegetables.",
    "厨师用烤蔬菜配牛排。",
    "She ordered a tuna steak at the harbour restaurant.",
    "她在港口餐厅点了一份金枪鱼排。"
  ],
  [
    "brutal",
    "形容词 · 残酷的、严酷的",
    "brutal 可指冷酷残忍，也可加强天气或处境的严酷；语气强，不应把普通不友善都升级为 brutal。",
    "The story describes a brutal ruler.",
    "故事描写了一位残酷统治者。",
    "The climbers faced brutal winter weather.",
    "攀登者面对严酷的冬季天气。"
  ],
  [
    "threshold",
    "名词 · 门槛",
    "threshold 可指门下的门槛，通常可数；抽象义还可指开始产生效果的界限，具体跨门动作取实物义。",
    "He paused on the threshold before entering.",
    "他进门前在门槛处停了一下。",
    "The wooden threshold had worn smooth.",
    "木门槛已经磨得光滑。"
  ],
  [
    "denial",
    "名词 · 否认",
    "denial 可指拒绝承认某说法属实，denial of 后接被否认的事；否认本身不能证明该说法必真或必假。",
    "Her denial surprised the other witnesses.",
    "她的否认让其他证人惊讶。",
    "The letter contained a clear denial of the accusation.",
    "信中明确否认了那项指控。"
  ],
  [
    "sofa",
    "名词 · 沙发",
    "sofa 指通常带靠背和扶手、能坐多人的软座，可数；on the sofa 表示坐在沙发上，不用 in 套所有坐法。",
    "The blue sofa faces the fireplace.",
    "蓝沙发朝向壁炉。",
    "A cat was asleep on the sofa.",
    "一只猫在沙发上睡着了。"
  ],
  [
    "blond",
    "形容词 · 金发的、浅黄色的",
    "blond 可形容头发为金黄等浅色，也可描述浅色木材；blonde 是变体，不要从发色词推断国籍。",
    "The child had blond hair and a green hat.",
    "孩子留着金发，戴着绿帽。",
    "Sunlight caught the blond wood of the table.",
    "阳光照在桌子的浅色木面上。"
  ],
  [
    "soften",
    "动词 · 软化",
    "soften 可直接接对象使变软，也可不及物表示自身变软；与形容词 soft 区分，不能把动作位直接换成 soft。",
    "Warm water will soften the dried clay.",
    "温水会软化干黏土。",
    "Leave the butter on the counter to soften.",
    "把黄油放在台面上软化。"
  ],
  [
    "molecular",
    "形容词 · 分子的",
    "molecular 表示与分子有关，常修饰 structure、biology；它是形容词，单个分子的名词是 molecule。",
    "The chart shows the molecular structure of water.",
    "图表展示水的分子结构。",
    "She studies molecular biology at the university.",
    "她在大学学习分子生物学。"
  ],
  [
    "stereotype",
    "名词 · 刻板印象",
    "stereotype 指对某类人的过度简化固定看法，可数；个体不能只因群体标签就被认定符合该印象。",
    "The film challenges a familiar stereotype about older people.",
    "电影挑战了对老年人的常见刻板印象。",
    "She refused to judge her neighbour by a stereotype.",
    "她拒绝用刻板印象判断邻居。"
  ],
  [
    "confirmation",
    "名词 · 证实",
    "confirmation 可表示支持某判断的证据或证实过程，通常不可数；需要实际材料支持，不等于单纯重复猜测。",
    "We need confirmation before changing the report.",
    "改报告前我们需要证实。",
    "The second measurement provided confirmation of the result.",
    "第二次测量证实了结果。"
  ]
];
additions.push(...additionsNine);
const addedWords = new Set(additions.map(([word]) => word));
entries.push(...additions);
const checkedDate = (word) => addedWords.has(word) ? '2026-10-24' : '2026-10-23';

export const EXPANSION_TWO_NOTE_SOURCES = Object.fromEntries(entries.map(([word]) => [
  `e2-mw-${word}`,
  { title: `韦氏词典 · ${word}`, url: `https://www.merriam-webster.com/dictionary/${encodeURIComponent(word)}`, checkedAt: checkedDate(word), use: 'factual-reference' },
]));

export const EXPANSION_TWO_SYNONYM_GROUPS = Object.fromEntries(entries.map(([word, sense, note, en1, zh1, en2, zh2]) => [
  `e2-usage-${word}`,
  { words: [word], comparisonType: 'usage', sense, note, examples: [{ en: en1, zh: zh1 }, { en: en2, zh: zh2 }], sourceIds: [`e2-mw-${word}`], review: { status: 'source-checked', checkedAt: checkedDate(word) } },
]));

export const EXPANSION_TWO_WORD_NOTES = Object.fromEntries(entries.map(([word]) => [word, { synonymGroup: `e2-usage-${word}` }]));

// Linked headwords supply the scoped definitions for spelling and participle entries.
for (const [word, linkedWord] of [['analyse', 'analyze'], ['stuck', 'stick']]) {
  const sourceId = `e2-mw-${linkedWord}`;
  EXPANSION_TWO_NOTE_SOURCES[sourceId] = { title: `韦氏词典 · ${linkedWord}`, url: `https://www.merriam-webster.com/dictionary/${linkedWord}`, checkedAt: '2026-10-23', use: 'factual-reference' };
  EXPANSION_TWO_SYNONYM_GROUPS[`e2-usage-${word}`].sourceIds.push(sourceId);
}

// British variant links to its full definition.
EXPANSION_TWO_NOTE_SOURCES['e2-mw-humor'] = { title: '韦氏词典 · humor', url: 'https://www.merriam-webster.com/dictionary/humor', checkedAt: '2026-10-24', use: 'factual-reference' };
EXPANSION_TWO_SYNONYM_GROUPS['e2-usage-humour'].sourceIds.push('e2-mw-humor');

// Supplementary headwords for inflections and referenced British spellings.
for (const [word, linkedWord] of [['manufacturing', 'manufacture'], ['dining', 'dine'], ['voting', 'vote'], ['dancing', 'dance'], ['impressed', 'impress'], ['obliged', 'oblige'], ['selected', 'select'], ['planned', 'plan'], ['reduced', 'reduce'], ['regulatory', 'regulate'], ['combined', 'combine'], ['graphics', 'graphic']]) {
  const id = `e2-mw-${linkedWord}`;
  EXPANSION_TWO_NOTE_SOURCES[id] ??= { title: `韦氏词典 · ${linkedWord}`, url: `https://www.merriam-webster.com/dictionary/${linkedWord}`, checkedAt: '2026-10-24', use: 'factual-reference' };
  EXPANSION_TWO_SYNONYM_GROUPS[`e2-usage-${word}`].sourceIds.push(id);
}
for (const [word, title, url] of [
  ['berry', '柯林斯词典 · berry', 'https://www.collinsdictionary.com/us/dictionary/english/berry'],
  ['favourite', '柯林斯词典 · favourite', 'https://www.collinsdictionary.com/dictionary/english/favourite'],
  ['realise', '牛津学习词典 · realize / realise', 'https://www.oxfordlearnersdictionaries.com/definition/english/realize'],
]) {
  const id = `e2-reference-${word}`;
  EXPANSION_TWO_NOTE_SOURCES[id] = { title, url, checkedAt: '2026-10-24', use: 'factual-reference' };
  EXPANSION_TWO_SYNONYM_GROUPS[`e2-usage-${word}`].sourceIds = [id];
  delete EXPANSION_TWO_NOTE_SOURCES[`e2-mw-${word}`];
}

EXPANSION_TWO_NOTE_SOURCES['e2-mw-fund'] = { title: '韦氏词典 · fund', url: 'https://www.merriam-webster.com/dictionary/fund', checkedAt: '2026-10-24', use: 'factual-reference' };
EXPANSION_TWO_SYNONYM_GROUPS['e2-usage-funding'].sourceIds.push('e2-mw-fund');
