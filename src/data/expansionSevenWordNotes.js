// Original usage notes and examples. Sources checked on 2026-10-24.
// Source checking is not independent editorial review; preserve original vocabulary IDs.
const rows = [
  ["café", "名词·咖啡馆", "可数名词，指提供饮料和简餐的小餐馆；也常拼作 cafe，保留重音符号是规范写法。", "The café overlooks a quiet square.", "这家咖啡馆俯瞰一座安静的广场。", "We found a café beside the bookshop.", "我们在书店旁发现一家咖啡馆。"],
  ["destine", "动词·注定", "通常见于被动结构 be destined for 或 be destined to do；不用主动式表达某人自行决定命运。", "She seemed destined to lead the expedition.", "她似乎注定要带领这次探险。", "These crates are destined for the island.", "这些板条箱预定运往那座岛。"],
  ["antarctic", "形容词·南极的", "地区名称及其形容词首字母大写；the Antarctic 指南极地区，范围可包括周围海域。", "The team studies Antarctic wildlife.", "这个团队研究南极野生动物。", "Antarctic winds battered the research hut.", "南极的风猛烈吹打研究小屋。"],
  ["roman", "形容词·古罗马的", "谈古罗马文化或人时首字母大写；书写字体中的 roman 可指正体，须按语境区分。", "A Roman coin lay beneath the floor.", "地板下有一枚古罗马硬币。", "The museum displays Roman pottery.", "博物馆展出古罗马陶器。"],
  ["sepectator", "拼写纠正·观众", "旧词头 sepectator 已更正为 spectator；指观看活动而未参与的人。", "A spectator returned the ball to the court.", "一位观众把球送回球场。", "Each spectator received a printed programme.", "每位观众得到一本印刷节目单。"],
  ["overgrow", "动词·长满", "常见过去分词 overgrown，描述植物长满某处；be overgrown with 后接繁茂生长的植物。", "Ivy can overgrow an unused doorway.", "常春藤会长满闲置的门洞。", "We must not let weeds overgrow the path.", "我们不能让杂草长满小路。"],
  ["per capita", "副词短语·按人均", "表示把总量按人数平均计算，可用于收入或消费等；不是指每个人实际获得相同数量。", "Water use per capita fell last year.", "去年人均用水量下降了。", "The chart compares spending per capita.", "图表比较人均支出。"],
  ["mediterranean", "形容词·地中海的", "首字母大写，修饰地中海及周边地区相关事物；the Mediterranean 也可指该海域。", "The garden contains Mediterranean herbs.", "花园里种着地中海香草。", "We studied Mediterranean trading routes.", "我们研究了地中海贸易路线。"],
  ["scandinavia", "专有名词·斯堪的纳维亚", "地区名称首字母大写；通常包括丹麦、挪威和瑞典，不宜与整个北欧一概等同。", "The exhibition follows a route through Scandinavia.", "展览沿着一条穿越斯堪的纳维亚的路线展开。", "She collected folk songs in Scandinavia.", "她在斯堪的纳维亚采集民歌。"],
  ["celsius", "名词·摄氏温标", "温标名称首字母大写，温度常写 degrees Celsius；不能把摄氏读数直接当作华氏读数。", "The room was twenty degrees Celsius.", "室温为二十摄氏度。", "This thermometer displays Celsius readings.", "这支温度计显示摄氏读数。"],
  ["cambrian", "形容词·寒武纪的", "地质时期名称首字母大写；Cambrian rocks 指该时期形成的岩石，不是泛指任何古老岩石。", "The cliff exposes Cambrian rocks.", "悬崖露出寒武纪岩石。", "We examined a Cambrian fossil.", "我们查看了一块寒武纪化石。"],
  ["muslim", "名词·穆斯林", "指伊斯兰教信徒，名词和形容词均首字母大写；宗教身份不等同于某一国籍或民族。", "A Muslim colleague explained the festival.", "一位穆斯林同事解释了这个节日。", "The school consulted Muslim families.", "学校征询了穆斯林家庭的意见。"],
  ["phenomenon", "名词·现象", "可数名词，复数为 phenomena；用于可观察到的事件或现象，不把复数误写为 phenomenons。", "The team recorded an unusual phenomenon.", "团队记录了一种不寻常的现象。", "This phenomenon occurs only at low temperatures.", "这种现象仅在低温下发生。"],
  ["ritualize", "动词·使仪式化", "指赋予行为固定的仪式形式或使其程式化；英式也写 ritualise，不等于单纯重复动作。", "The community chose to ritualize the annual planting.", "社区决定为每年的播种赋予仪式形式。", "Groups may ritualize shared meals.", "群体可能会让共同进餐仪式化。"],
  ["entitle", "动词·使有权利", "entitle someone to something 或 to do 表给予权利或资格；常用被动结构表示有权获得，不能误当成已经领取。", "The pass will entitle you to free entry.", "这张通行证让你有权免费入场。", "These tickets entitle holders to one guided tour.", "这些票让持票人可参加一次导览。"],
  ["proxy", "名词·代理人", "指获授权代别人行动的人；by proxy 表通过代理，代理权与本人亲自出席应区分。", "She appointed her brother as her proxy.", "她指定哥哥作为代理人。", "Members can vote by proxy.", "会员可以委托代理人投票。"],
  ["mutual", "形容词·相互的", "强调双方或多方具有同样感受或彼此作用；mutual respect 指相互尊重，不能只由单方完成。", "The agreement grew from mutual trust.", "协议源于相互信任。", "They share a mutual interest in pottery.", "他们共同对陶艺感兴趣。"],
  ["bleak", "形容词·荒凉的", "可形容空旷而不宜人的环境，也可形容前景无望；语气通常带有冷清或消极意味。", "A bleak hillside rose behind the village.", "村后耸起一片荒凉山坡。", "The abandoned station looked bleak in winter.", "废弃车站在冬天显得冷清荒凉。"],
  ["conserve", "动词·节约保护", "直接接资源或需保护的对象；强调避免浪费、损失或破坏，不只是把物品临时放起来。", "Close the tap to conserve water.", "关上水龙头以节约用水。", "The project aims to conserve historic gardens.", "项目旨在保护历史花园。"],
  ["contraction", "名词·收缩", "可指体积或数量缩小，也可指词语缩写；在语言学习中 a contraction 是一个缩略形式。", "Cooling caused contraction of the metal.", "冷却使金属收缩。", "The lesson explains the contraction “isn't”.", "这节课解释缩略形式 isn't。"],
  ["driven", "形容词·有强烈动力的", "形容人时强调目标导向和很强的成功意愿；还可组成 wind-driven 等，表示由某物驱动。", "The driven athlete practised before sunrise.", "这位目标坚定的运动员日出前就开始训练。", "She is driven by curiosity rather than prizes.", "推动她的是好奇心而非奖项。"],
  ["meteorite", "名词·陨石", "指来自太空并已到达地面的物质；应与仍在太空中的 meteoroid 和发光现象 meteor 区分。", "The museum acquired a small meteorite.", "博物馆购入一块小陨石。", "Researchers sliced the meteorite for analysis.", "研究人员切开陨石进行分析。"],
  ["microorganism", "名词·微生物", "可数，指通常需借助显微镜才能看清的微小生物；并非所有微生物都会引发疾病。", "The microorganism grew in the sample.", "这种微生物在样本中生长。", "A microscope revealed the shape of the microorganism.", "显微镜显示出这种微生物的形状。"],
  ["buffalo", "名词·水牛或野牛", "所指动物依地区而不同，北美口语中可指美洲野牛；不能把各种 buffalo 都当作同一物种。", "A buffalo stood beside the muddy pool.", "一头水牛站在泥塘旁。", "The guide pointed to a distant buffalo.", "导游指向远处的一头野牛。"],
  ["conductance", "名词·电导", "表示物体或电路导电能力的物理量；不等同于与材料性质相关的 conductivity，需注意测量对象。", "We measured the conductance of the solution.", "我们测量了溶液的电导。", "The meter showed a change in conductance.", "仪表显示电导发生了变化。"],
  ["culprit", "名词·肇事者", "可指做错事的人，也可借指造成问题的事物；不必总表示已经被法院定罪的罪犯。", "A broken seal was the culprit behind the leak.", "破损密封圈是漏水的原因。", "The culprit returned the stolen bicycle.", "肇事者归还了偷走的自行车。"],
  ["predominant", "形容词·占主导的", "强调数量、重要性或影响超过其他部分；不是唯一存在，不能据此推断没有其他因素。", "Blue is the predominant colour in the painting.", "蓝色是画中的主色。", "Fishing remains the predominant local industry.", "渔业仍是当地的主要产业。"],
  ["culminate", "动词·以……告终", "常用 culminate in 引出一系列发展的高潮或最终结果；通常不直接接结果作宾语。", "The festival will culminate in a lantern parade.", "节日将以灯笼游行达到高潮。", "Months of discussion culminate in today's vote.", "数月讨论最终迎来今天的投票。"],
  ["dome", "名词·穹顶", "可数，指半球状屋顶或类似的圆顶形状；形状概念不要求建筑一定有宗教用途。", "Sunlight entered through the glass dome.", "阳光从玻璃穹顶照入。", "The dome shelters a tropical garden.", "穹顶罩着一座热带花园。"],
  ["assembly", "名词·装配", "表示组装过程时通常不可数，school assembly 则可指学校集会；需按工业或学校语境判断。", "The chair requires no tools for assembly.", "这把椅子组装时无需工具。", "Final assembly takes place in this workshop.", "最后装配在这间车间进行。"],
  ["fluctuate", "动词·波动", "描述数值反复升降而非单向变化；常用 fluctuate between 两个界限或 fluctuate with 某因素。", "Prices fluctuate with the season.", "价格随季节波动。", "Temperatures fluctuate between ten and fifteen degrees.", "温度在十到十五度之间波动。"],
  ["perception", "名词·看法感知", "可指对事情的理解或感官察觉；perception of 后接所看待对象，不保证这种看法符合事实。", "The survey measures public perception of safety.", "调查衡量公众对安全的看法。", "Lighting can alter our perception of colour.", "照明会改变我们的颜色感知。"],
  ["assortment", "名词·各式物品", "常用 an assortment of 接复数名词，强调同一集合中种类多样；不只是数量很多。", "The drawer held an assortment of keys.", "抽屉里放着各式钥匙。", "She offered an assortment of homemade biscuits.", "她拿出各式自制饼干。"],
  ["adorn", "动词·装饰", "adorn A with B 表用 B 装饰 A，语气偏正式；被动结构常用于外观描写，强调增添装饰物。", "Children adorn the doorway with paper flowers.", "孩子们用纸花装饰门口。", "Painted tiles adorn the courtyard walls.", "彩绘瓷砖装点着庭院围墙。"],
  ["impulse", "名词·冲动", "on impulse 表未经周密考虑而一时起意；有冲动不等于已经采取行动，注意与计划区分。", "I bought the notebook on impulse.", "我一时冲动买下了笔记本。", "She resisted the impulse to interrupt.", "她忍住了打断别人的冲动。"],
  ["digress", "动词·离题", "通常不及物，可用 digress from the subject 表偏离主题；不是指人在空间中走错路。", "Please stop me if I digress.", "如果我离题了，请打断我。", "We should not digress from the main question.", "我们不应偏离主要问题。"],
  ["bliss", "名词·极乐", "通常不可数，表示强烈的幸福满足；常用 pure bliss 等强调感受，不是普通短暂的方便。", "The quiet afternoon was pure bliss.", "那个安静的下午令人无比幸福。", "She listened to the music in bliss.", "她幸福地听着音乐。"],
  ["locale", "名词·场所", "偏正式，指某事件发生或故事设定的地方；尤其关注环境背景，不等同于人的本地身份。", "The harbour provides a dramatic locale for the film.", "港口为影片提供了富有戏剧性的场景。", "The novel's locale is a mountain village.", "小说发生的地点是一座山村。"],
  ["herbicide", "名词·除草剂", "指用于杀死不需要植物的药剂；不可与针对昆虫的 insecticide 一概混用，使用要依具体标签。", "The label identifies the herbicide used on the plot.", "标签标明了地块使用的除草剂。", "The farmer stored the herbicide in a locked shed.", "农夫把除草剂存放在上锁的棚屋里。"],
  ["utilitarian", "形容词·注重实用的", "形容设计时强调功能而非装饰；哲学语境也可表示功利主义的，两个义项需结合上下文。", "The workshop has a plain utilitarian design.", "车间采用朴素实用的设计。", "Her utilitarian bag has many useful pockets.", "她那个注重实用的包有许多好用的口袋。"],
  ["cape", "名词·海角", "地理义指伸入海中的陆地，可数；另有披风义，需依据海岸或衣着语境辨认。", "A lighthouse stands on the cape.", "海角上立着一座灯塔。", "The boat rounded the rocky cape.", "船绕过岩石海角。"],
  ["pristine", "形容词·保持原始状态的", "描述未受污染、损坏或改变的状态；语气较强，不宜仅凭稍微整洁就说 pristine。", "The old map remained in pristine condition.", "这张旧地图仍保存完好。", "Visitors admired the pristine mountain lake.", "游客赞叹那片未受污染的高山湖泊。"],
  ["traverse", "动词·横穿", "偏正式，直接接被穿越的区域或地形；强调从一边到另一边的移动，不需要再加 across。", "Hikers traverse the plateau in small groups.", "徒步者分成小组穿越高原。", "The cable allows workers to traverse the gorge.", "缆索让工人能够横越峡谷。"],
  ["reinforce", "动词·加固强化", "既可直接接结构使其更坚固，也可接观点使其更有力；不只是反复提到某件事。", "Steel bars reinforce the concrete wall.", "钢筋加固了混凝土墙。", "These results reinforce our earlier conclusion.", "这些结果强化了我们先前的结论。"],
  ["exportable", "形容词·可出口的", "修饰可向其他国家出售的产品，也可引申到可推广的经验；不意味着已经实际出口。", "The workshop produces exportable furniture.", "车间生产可出口家具。", "They developed an exportable training model.", "他们开发了一套可向国外推广的培训模式。"],
  ["descendant", "名词·后代", "可数，descendant of 后接祖先；与表示祖先的 ancestor 方向相反，不表示同代的兄弟姐妹。", "She is a descendant of the village founder.", "她是村庄创建者的后代。", "A descendant donated the family letters.", "一位后人捐出了家族书信。"],
  ["clergy", "集合名词·神职人员", "指作为群体的宗教神职人员；单个人常用表示其中一名成员的结构，不可直接用不定冠词加 clergy。", "Members of the clergy attended the ceremony.", "神职人员参加了典礼。", "The clergy helped organize the community meal.", "神职人员协助组织了社区聚餐。"],
  ["petrochemical", "名词·石化产品", "指由石油或天然气制得的化学产品；作形容词修饰 industry 等时表示石油化工相关。", "The factory manufactures a petrochemical used in plastics.", "工厂生产一种用于塑料的石化产品。", "The port serves the petrochemical industry.", "港口服务于石油化工产业。"],
  ["encode", "动词·编码", "encode A as B 或 encode A into B 表把信息转成特定形式；编码不必等同于保密加密。", "The device can encode speech as digital data.", "设备能把语音编码为数字数据。", "We encode each answer with a number.", "我们用数字给每个答案编码。"],
  ["replica", "名词·复制品", "可数，a replica of 后接被仿制原物，强调相似复制；不应把复制品当作原物真迹。", "The display contains a replica of the crown.", "展柜里有王冠的复制品。", "They built a wooden replica of the ship.", "他们制作了这艘船的木质复制模型。"],
  ["tame", "形容词·驯服的", "形容动物不怕人或受人控制；不等同于物种已经驯化，也不能保证任何情况下都安全。", "A tame rabbit ate from her hand.", "一只温顺的兔子从她手中进食。", "The deer seemed unusually tame.", "这只鹿显得异常不怕人。"],
  ["vulnerable", "形容词·易受伤害的", "常用 vulnerable to 后接威胁或不利因素；强调易受影响的状态，而非已经遭受伤害。", "Young trees are vulnerable to frost.", "幼树容易遭受霜冻。", "The wooden bridge is vulnerable to flooding.", "木桥易受洪水损坏。"],
  ["onset", "名词·开始", "常用 the onset of 表某事的开端，尤其是不利情况或疾病；并非任何普通开始都惯用此词。", "The onset of winter slowed construction.", "冬季来临使施工放缓。", "Records show the onset of the drought.", "记录显示了旱灾开始的时间。"],
  ["reclamation", "名词·开垦修复", "通常不可数，可指使土地可用或回收废弃材料；须按土地、水域或材料语境确定具体含义。", "The report describes the reclamation of former mine land.", "报告描述了旧矿区土地的修复。", "Land reclamation changed the shape of the coast.", "填海造地改变了海岸形状。"],
  ["monetary", "形容词·货币的", "常修饰 policy、value 或 reward，涉及货币或金钱；不直接表示某人的经济条件好坏。", "The prize carries no monetary reward.", "这个奖项没有金钱奖励。", "The report examines monetary policy.", "报告研究货币政策。"],
  ["fracture", "名词·骨折断裂", "可指骨头或坚硬材料的裂缝，也可作动词；骨折不一定都造成骨头完全断成两段。", "The scan revealed a small fracture.", "扫描发现一处小骨折。", "A fracture runs across the rock sample.", "岩石样本上有一道裂缝。"],
  ["charged", "形容词·带电的", "可修饰带有电荷的粒子；emotionally charged 则指情绪强烈，不能把所有用法都理解为收费。", "The charged particles entered the chamber.", "带电粒子进入了腔室。", "It was an emotionally charged debate.", "那是一场情绪激烈的辩论。"],
  ["bead", "名词·珠子", "可数，常指有孔可穿线的小珠；a bead of sweat 则比喻一滴汗，注意材料与液滴语境。", "A blue bead rolled beneath the table.", "一颗蓝珠滚到桌下。", "She threaded a bead onto the cord.", "她把一颗珠子穿到绳上。"],
  ["melodious", "形容词·悦耳的", "描述声音或旋律优美悦耳，通常带褒义；不等于音量低，也不要求声音一定来自乐器。", "A melodious whistle came from the garden.", "花园传来悦耳的口哨声。", "The singer has a clear, melodious voice.", "这位歌手嗓音清亮悦耳。"],
  ["canyon", "名词·峡谷", "通常指两侧陡峭的深谷，可数；并非所有宽阔平缓的山谷都适合称 canyon。", "A narrow trail descends into the canyon.", "一条窄路通向峡谷底部。", "The canyon walls glowed at sunset.", "峡谷岩壁在夕阳下泛着光。"],
  ["successor", "名词·继任者", "successor to 后接前任职位或被替代事物；不是任何后来出生的人都叫 successor。", "The board will choose a successor next month.", "董事会下月将选出继任者。", "This camera is the successor to an earlier model.", "这款相机是先前型号的后继产品。"],
  ["allusion", "名词·暗指", "常用 an allusion to 表间接提及人物、作品或事件；与明说的直接引用有别。", "The title contains an allusion to an ancient myth.", "标题暗指一则古代神话。", "I missed the allusion in her final sentence.", "我没有领会她最后一句的暗指。"],
  ["abnormality", "名词·异常情况", "可数时指某项异常特征或状况；不直接说明异常的严重程度，也不能据此自行推断原因。", "The inspection revealed an abnormality in the pattern.", "检查发现图案有一处异常。", "The report describes a structural abnormality.", "报告描述了一处结构异常。"],
  ["oversight", "名词·疏忽", "an oversight 表无意的遗漏；不可数 oversight 还可表示监督，二者在责任语境中差别很大。", "The missing label was an oversight.", "漏贴标签是一时疏忽。", "An oversight delayed the delivery.", "一次疏忽延误了送货。"],
  ["prevail", "动词·占优势", "通常不及物，prevail over 表战胜或压过，prevail in 表在某范围盛行；不直接接对手作宾语。", "Patience may prevail over anger.", "耐心或许能战胜愤怒。", "These customs still prevail in remote villages.", "这些习俗在偏远村庄仍然盛行。"],
  ["synchronize", "动词·使同步", "synchronize A with B 表让时间或动作一致；英式也拼 synchronise，不只指双方同时开始。", "Please synchronize your watch with the station clock.", "请把手表与车站时钟对准。", "The dancers synchronize their movements.", "舞者让动作保持同步。"],
  ["credential", "名词·资格凭证", "通常以复数 credentials 指资历或资格证明；计算机语境可指验证身份的登录信息。", "The system checks each credential separately.", "系统逐项检查身份凭证。", "This certificate is a recognized professional credential.", "这张证书是受认可的职业资格凭证。"],
  ["feasibility", "名词·可行性", "通常不可数，feasibility of 后接方案或行动；可行性研究评估能否实行，并不保证项目必然成功。", "We assessed the feasibility of a night service.", "我们评估了夜间服务的可行性。", "The feasibility study will take three weeks.", "可行性研究将耗时三周。"],
  ["sparsely", "副词·稀疏地", "常修饰 populated、planted 等，表示单位面积分布少；不是强调每个对象体积很小。", "The hillside is sparsely wooded.", "山坡上树木稀疏。", "The region remains sparsely populated.", "这个地区仍然人口稀少。"],
  ["reef", "名词·礁", "指近水面的岩石、珊瑚或沙形成的隆起；coral reef 是其中一种，不能把所有礁都等同珊瑚。", "The boat stayed clear of the reef.", "船避开了暗礁。", "Divers surveyed the outer reef.", "潜水员调查了外围礁体。"],
  ["barn", "名词·谷仓畜棚", "可数，指农场储存作物或容纳牲畜的大建筑；具体用途须结合修饰词或上下文判断。", "They stored the hay in the barn.", "他们把干草存进谷仓。", "The barn doors opened onto the yard.", "谷仓门朝着院子打开。"],
  ["alumnus", "名词·男校友", "传统上指男性毕业生，复数 alumni；泛指个人时也常用 graduate，以避免误用性别或数。", "An alumnus donated books to the school.", "一位男校友向学校捐了书。", "The speaker is an alumnus of this college.", "演讲者是这所学院的男毕业生。"],
  ["strike", "动词·击打", "可直接接被击中的物体，过去式和过去分词均为 struck；名词还可表示罢工，需辨认词性。", "Be careful not to strike the glass.", "小心不要撞到玻璃。", "The hammer can strike the metal with great force.", "锤子能有力地击打金属。"],
  ["subsist", "动词·维持生活", "常用 subsist on 后接赖以生存的食物或收入，偏正式；通常暗示资源有限而勉强维生。", "The family had to subsist on a small allowance.", "这家人不得不靠少量津贴维生。", "These birds subsist mainly on seeds.", "这些鸟主要靠种子生存。"],
  ["percussion", "名词·打击乐", "指敲击演奏的乐器类别或乐队声部，通常不可数；单件乐器可说 a percussion instrument。", "She plays percussion in a youth orchestra.", "她在青年管弦乐团演奏打击乐。", "The piece begins with percussion alone.", "乐曲以单独的打击乐开始。"],
  ["tributary", "名词·支流", "可数，指流入另一条较大河流的河川；tributary of 后接主河流，不是河流出海口。", "The stream is a tributary of the larger river.", "这条小河是那条大河的支流。", "We crossed a shallow tributary before noon.", "我们中午前渡过一条浅支流。"],
  ["moss", "名词·苔藓", "通常作为不可数植物总称使用；描述一片苔藓可用 a patch of moss，不直接用一棵来计数。", "Moss covered the shaded stones.", "苔藓覆盖了背阴的石头。", "A patch of moss grew beside the steps.", "台阶旁长着一片苔藓。"],
  ["furry", "形容词·毛茸茸的", "形容表面覆有柔软的毛，常用于动物或仿毛材料；不表示所有长毛动物都是同一种类。", "A furry tail appeared behind the chair.", "一条毛茸茸的尾巴从椅子后露出。", "The toy has soft, furry ears.", "玩具有柔软的毛茸茸耳朵。"],
  ["patent", "名词·专利", "可数，a patent for 或 on 可引出发明；专利保护与商标、版权不同，不宜混为一谈。", "The inventor applied for a patent.", "发明者申请了一项专利。", "The patent covers the new valve design.", "这项专利涵盖新的阀门设计。"],
  ["meteoroid", "名词·流星体", "指太空中的小型岩石或金属物体；落到地面称 meteorite，进入大气发光称 meteor。", "The telescope detected a small meteoroid.", "望远镜探测到一个小流星体。", "A meteoroid entered the planet's atmosphere.", "一个流星体进入了该行星的大气层。"],
  ["obscure", "形容词·鲜为人知的", "形容人或地方不为多数人熟知，也可表示难懂；不应把不出名直接理解为质量差。", "She found the answer in an obscure journal.", "她在一本鲜为人知的期刊里找到了答案。", "The guide mentioned an obscure coastal village.", "导游提到一座不知名的沿海村庄。"],
  ["dismantle", "动词·拆卸", "直接接机器、结构或制度，强调分解或逐步拆除；拆卸后部件不必全部损坏或废弃。", "We need to dismantle the shelf before moving.", "搬运前我们需要拆开架子。", "Workers will dismantle the temporary stage.", "工人将拆除临时舞台。"],
  ["spine", "名词·脊柱", "指背部连接的骨骼结构，也指书脊或植物硬刺；根据人体、书本或植物语境区分。", "The model shows the human spine.", "模型展示人体脊柱。", "The title is printed on the spine of the book.", "书名印在书脊上。"],
  ["tentacle", "名词·触手", "可数，指章鱼等动物用于感觉或抓取的细长柔软附肢；不等同于所有昆虫的触角。", "One tentacle curled around the shell.", "一条触手卷住了贝壳。", "The octopus extended a tentacle toward the rock.", "章鱼向岩石伸出一条触手。"],
  ["limb", "名词·肢体", "可指人的手臂或腿、动物的腿，也可指大树枝；不能把所有身体突起都叫 limb。", "The cast supported the injured limb.", "石膏托住了受伤的肢体。", "A heavy limb broke from the oak.", "一根粗树枝从橡树上折断。"],
  ["hierarchy", "名词·等级体系", "可数，指按权力、地位或重要性排列的结构；hierarchy of 后可接具体层级对象。", "The diagram shows the company's hierarchy.", "图示展示公司的层级结构。", "The school has a clear hierarchy of responsibilities.", "学校有明确的职责层级。"],
  ["hydro", "名词·水力发电", "常作为 hydroelectric power 的简略说法；在复合词中 hydro- 表水，但不宜单独泛指所有水。", "The region generates electricity from hydro.", "这个地区利用水力发电。", "The report compares hydro with wind power.", "报告比较水电与风电。"],
  ["fraction", "名词·一小部分", "a fraction of 可表示整体的一小部分，也可指数学分数；数值大小须依据具体语境确定。", "Only a fraction of the seats were occupied.", "只有一小部分座位有人。", "Write the answer as a fraction.", "把答案写成分数。"],
  ["manifest", "动词·显现", "manifest itself in 表通过某种现象表现出来；也可直接接情感或特征，语气较正式。", "Stress can manifest itself in poor sleep.", "压力可能表现为睡眠不佳。", "The symptoms may manifest gradually.", "症状可能逐渐显现。"],
  ["inertia", "名词·惯性惰性", "物理上指保持运动状态的性质，也可比喻不愿改变；不等同于物体始终静止不动。", "The experiment demonstrates inertia.", "实验演示了惯性。", "Institutional inertia slowed the reform.", "机构的惰性拖慢了改革。"],
  ["punctuate", "动词·加标点", "可指给文字添加标点，也可指事件不时打断过程；be punctuated by 常引出间断出现的东西。", "Please punctuate the paragraph carefully.", "请仔细给这段话加标点。", "Short pauses punctuate her speech.", "她的讲话间或停顿片刻。"],
  ["conviction", "名词·坚定信念", "表示信念时可数或不可数，with conviction 表坚定地；法律义为定罪，不能与指控混同。", "She spoke with conviction about the project.", "她坚定地谈论这个项目。", "His conviction that change was possible never faded.", "他始终坚信改变是可能的。"],
  ["suite", "名词·套房", "可指一组相连房间，也指组曲或成套软件；房间语境中不是单独一间普通卧室。", "The suite includes a small sitting room.", "套房包括一间小起居室。", "They booked a suite overlooking the harbour.", "他们预订了一套俯瞰港口的房间。"],
  ["swarm", "名词·蜂群", "a swarm of 常指大量飞虫聚成的群，也可比喻拥挤人群；不是任何动物群都惯用 swarm。", "A swarm of bees gathered on the branch.", "一群蜜蜂聚集在树枝上。", "We watched the swarm settle near the hive.", "我们看着蜂群在蜂箱附近落下。"],
  ["resolve", "动词·解决", "直接接问题、争议或困难，强调找到解决办法；resolve to do 则表示下决心做某事。", "The team met to resolve the scheduling problem.", "团队开会解决排期问题。", "A clear diagram may resolve the confusion.", "清晰的图示或许能消除困惑。"],
  ["abrasion", "名词·擦伤磨损", "可指皮肤表面的擦伤，也可指摩擦造成的磨损过程；不等同于深层切割伤。", "The nurse cleaned a small abrasion on his knee.", "护士清洗了他膝盖上的一处小擦伤。", "The coating protects the surface against abrasion.", "涂层保护表面免受磨损。"],
  ["flagpole", "名词·旗杆", "可数，指悬挂旗帜的长杆；旗帜 flag 与支撑它的 flagpole 是不同物体。", "A flagpole stands beside the entrance.", "入口旁立着一根旗杆。", "They repaired the rope on the flagpole.", "他们修好了旗杆上的绳索。"],
  ["pebble", "名词·小圆石", "可数，通常指经水流等磨圆的小石头；不是任何大小或形状的岩石都称 pebble。", "A smooth pebble lay inside the shell.", "贝壳里有一颗光滑小石子。", "She skipped a pebble across the pond.", "她用一颗小石子在池面打水漂。"],
  ["limestone", "名词·石灰岩", "岩石材料名通常不可数，主要由碳酸钙组成；不能把所有白色岩石或石灰都称 limestone。", "The old walls are built from limestone.", "这些旧墙由石灰岩砌成。", "Water carved a cave in the limestone.", "水流在石灰岩中蚀出一个洞穴。"],
  ["textile", "名词·纺织品", "指织物或纺织材料，复数 textiles 常指此类产品；textile industry 中作定语表示纺织业。", "The museum acquired a woven textile.", "博物馆购入一件编织纺织品。", "The textile industry once dominated the town.", "纺织业曾主导这座城镇。"],
  ["opaque", "形容词·不透明的", "描述材料不透光，与 transparent 相对；也可比喻文字难懂，不表示所有深色材料都不透光。", "The bottle is made of opaque glass.", "瓶子由不透明玻璃制成。", "An opaque screen hides the pipes.", "不透明屏风遮住了管道。"],
  ["sect", "名词·宗教派别", "指从较大宗教分出的群体，使用时可能含距离感；具体团体应优先采用其正式自称。", "The book traces the history of the sect.", "这本书追溯这个教派的历史。", "Members of the sect built the meeting house.", "该教派成员建造了这间会堂。"],
  ["uproot", "动词·连根拔起", "直接接植物，也可比喻迫使人离开原来生活环境；与只剪去地上部分不同。", "The storm could uproot young trees.", "暴风雨可能把幼树连根拔起。", "We decided not to uproot the old rose bush.", "我们决定不拔掉那株老玫瑰。"],
  ["lodging", "名词·临时住处", "可指临时住宿，lodgings 常指租住的房间；不等于长期拥有的住宅或旅途费用总和。", "The college helped us find lodging.", "学院帮助我们找到临时住处。", "The fee includes meals and lodging.", "费用包括餐饮和住宿。"],
  ["diffuse", "动词·扩散", "描述光、气味或物质向四周散开，也可作形容词表示分散；不要与 defuse 排除危险混淆。", "The shade will diffuse the light.", "灯罩会让光线散开。", "The scent began to diffuse through the room.", "香味开始在房间里弥散。"],
  ["microscope", "名词·显微镜", "可数，观察微小物体常用 under a microscope；不是用于观看遥远天体的 telescope。", "Place the slide under the microscope.", "把载玻片放到显微镜下。", "The microscope revealed tiny crystals.", "显微镜显示出微小晶体。"],
  ["conservative", "形容词·保守的", "可描述不愿改变，也可表示谨慎估算；涉及特定政党名称时首字母可能大写。", "The design takes a conservative approach.", "设计采用保守做法。", "That is a conservative estimate of the cost.", "那是对成本的保守估计。"],
  ["substrate", "名词·基质", "生物语境可指生物生长的物质或表面；生化中指酶作用的底物，需按专业场景区分。", "The fungus grows on a woody substrate.", "真菌在木质基质上生长。", "We changed the substrate in the tank.", "我们更换了水箱里的底层基质。"],
  ["expedition", "名词·探险考察", "可数，指有特定目标且有组织的旅行；一般日常通勤或随意散步不称 expedition。", "The expedition returned with soil samples.", "考察队带着土壤样本返回。", "She organized an expedition to the glacier.", "她组织了一次冰川考察。"],
  ["entail", "动词·需要涉及", "后接名词或动名词，表示某行动必然涉及的后果或工作；通常不接 to do。", "The repair will entail replacing the roof.", "维修将需要更换屋顶。", "Does the role entail frequent travel?", "这个职位需要经常出差吗？"],
  ["withstand", "动词·经受住", "直接接压力、风雨或攻击，过去式和过去分词均为 withstood；不用再加 against。", "The fabric can withstand repeated washing.", "这种布料经得起反复清洗。", "The wall must withstand strong winds.", "围墙必须能抵挡强风。"],
  ["scant", "形容词·不足的", "放在名词前表示数量很少且往往不够；比单纯 small 更常带有不足的评价。", "There is scant evidence for the claim.", "支持这一说法的证据不足。", "The seedlings survived with scant rainfall.", "幼苗在降雨稀少的条件下存活了。"],
  ["plausible", "形容词·貌似可信的", "指解释或说法听起来合理可信；不等于已经证实，仍需证据来判断真假。", "She offered a plausible explanation.", "她提出了一个看似合理的解释。", "The account sounds plausible at first.", "这个说法乍听起来颇可信。"],
  ["christian", "形容词·基督教的", "宗教名称及形容词首字母大写；可修饰传统、艺术或信徒，不代表所有信徒习俗完全相同。", "The gallery displays early Christian art.", "画廊展出早期基督教艺术。", "She studies Christian traditions in the region.", "她研究该地区的基督教传统。"],
  ["carving", "名词·雕刻作品", "可数时指雕刻成品，不可数时可指雕刻技艺或过程；应与制作材料本身区别。", "A wooden carving stood on the shelf.", "架子上放着一件木雕。", "The carving depicts a bird in flight.", "这件雕刻表现一只飞鸟。"],
  ["sweep", "动词·扫", "用扫帚清洁时可直接接地面；过去式和过去分词为 swept，也可表示快速掠过。", "Please sweep the steps before lunch.", "请在午饭前扫一下台阶。", "Strong winds sweep across the plain.", "强风扫过平原。"],
  ["counterbalance", "动词·抵消平衡", "直接接需要平衡的因素，强调反向作用；不一定将对方作用完全消除，也可作名词。", "The weight helps counterbalance the arm.", "配重有助于平衡支臂。", "Lower rent may counterbalance higher travel costs.", "较低租金可能抵消较高交通费。"],
  ["explicit", "形容词·明确的", "描述信息清楚直接、不留含糊；explicit instructions 指明确指示，另有露骨义须按语境辨认。", "The manual gives explicit instructions.", "手册给出明确说明。", "We need explicit permission to enter.", "我们需要明确许可才能进入。"],
  ["photosynthesis", "名词·光合作用", "通常不可数，指利用光能合成营养物质的过程；不是植物呼吸的同义词。", "The class studied photosynthesis in pond plants.", "全班研究了水生植物的光合作用。", "Light is essential for photosynthesis.", "光对光合作用至关重要。"],
  ["outrigger", "名词·舷外浮材", "指装在小船一侧、帮助保持稳定的支撑或浮材；也可借指带这种结构的船。", "The outrigger kept the canoe stable.", "舷外浮材使独木舟保持稳定。", "They repaired the outrigger before sailing.", "他们出航前修好了舷外浮材。"],
  ["jot", "动词·匆匆记下", "常用 jot down 接简短信息；表示快速做笔记，不强调详细整理或完整抄写。", "Jot down the number before you forget.", "趁没忘记，赶快记下号码。", "I will jot a reminder on this card.", "我会在卡片上匆匆写个提醒。"],
  ["invoke", "动词·援引", "可直接接法律、原则或权威来支持行动；语气正式，与普通提到某事相比强调据以行事。", "They may invoke the emergency clause.", "他们可能援引紧急条款。", "The speaker chose to invoke a familiar principle.", "演讲者选择援引一项熟悉的原则。"],
  ["innumerable", "形容词·无数的", "后接复数可数名词，强调多得难以计数；常为修辞夸张，不是精确数量描述。", "Innumerable stars filled the sky.", "无数星星布满天空。", "The archive contains innumerable letters.", "档案馆藏有数不清的信件。"],
  ["pessimistic", "形容词·悲观的", "常用 pessimistic about 表对某事不乐观；描述预期倾向，不意味着预期一定会实现。", "She felt pessimistic about the weather.", "她对天气不抱乐观态度。", "The report offers a pessimistic forecast.", "报告给出悲观预测。"],
  ["metaphor", "名词·隐喻", "用另一种事物来描述某物的相似特征；通常不同于带 like 或 as 的明喻。", "The poem uses the sea as a metaphor for memory.", "诗把大海作为记忆的隐喻。", "That metaphor makes the argument clearer.", "那个隐喻让论点更清楚。"],
  ["beak", "名词·鸟喙", "指鸟嘴外部坚硬的部分，可数；不同鸟的喙形状不同，不必都尖细或弯曲。", "The bird held a twig in its beak.", "鸟嘴里衔着一根细枝。", "Its strong beak can crack seeds.", "它有力的喙能啄开种子。"],
  ["axis", "名词·轴", "可指旋转中心线或图表坐标轴，复数 axes；不要与斧头 axe 的复数混淆。", "The wheel turns around a fixed axis.", "轮子绕固定轴转动。", "Label the horizontal axis clearly.", "请清楚标注横轴。"],
  ["immortal", "形容词·不朽的", "可指永不死亡，也可比喻永远被铭记；文学人物的不死设定不能当作现实事实。", "The legend describes an immortal guardian.", "传说描述一位不死的守护者。", "Her immortal lines are still quoted today.", "她那些不朽的诗句至今仍被引用。"],
  ["foreseeable", "形容词·可预见的", "指可以合理预料到的事；for the foreseeable future 表在可预见时期内，不是永远。", "The risk was reasonably foreseeable.", "这种风险是可以合理预见的。", "The shop will remain closed for the foreseeable future.", "店铺在可预见的将来仍将关闭。"],
  ["supplement", "名词·补充物", "可数，指加入以补足或改善主体的东西；不表示能够自动替代原本必需的部分。", "The guide is a supplement to the main textbook.", "指南是主教材的补充材料。", "A weekend supplement arrived with the newspaper.", "周末增刊随报纸一起送来。"],
  ["passive", "形容词·被动的", "描述不主动干预或采取行动，也可指被动语态；语法上的 passive 不评价人的性格。", "She refused to remain a passive observer.", "她拒绝继续被动旁观。", "The lesson introduces the passive voice.", "这节课介绍被动语态。"],
  ["proton", "名词·质子", "可数，指带正电的亚原子粒子；不要与带负电的电子或电中性的中子混淆。", "The diagram marks each proton in red.", "图中把每个质子标成红色。", "A proton carries a positive charge.", "质子带正电荷。"],
  ["prowl", "动词·潜行搜寻", "常描述动物安静移动寻找猎物，也可用于可疑的人；重点在悄然游走而非单纯快速奔跑。", "Foxes prowl around the farm at night.", "狐狸夜间在农场附近潜行。", "Cats prowl along the garden wall.", "猫沿花园墙悄悄游走。"],
  ["cripple", "动词·严重削弱", "用于机器、交通或经济时表示使严重失灵；用作称呼残障人士的名词具有冒犯性，应避免。", "The outage could cripple the rail network.", "停电可能使铁路网严重瘫痪。", "A long drought can cripple local farming.", "长期干旱会严重打击当地农业。"],
  ["handicraft", "名词·手工艺品", "可指手工制作技艺或作品，复数 handicrafts 常指手工艺品；强调手工技能而非工厂量产。", "The market sells traditional handicraft.", "市场出售传统手工艺品。", "We watched a handicraft demonstration.", "我们观看了手工艺展示。"],
  ["erode", "动词·侵蚀", "可指水风逐渐磨损，也可比喻削弱信任等；通常强调缓慢过程，不是瞬间断裂。", "Waves erode the soft cliffs.", "海浪侵蚀松软悬崖。", "Repeated delays can erode trust.", "反复延误会逐渐削弱信任。"],
  ["imperial", "形容词·帝国的", "可修饰帝国权力或建筑；imperial units 则指英制单位，并非所有用法都有关王室。", "The museum displays imperial seals.", "博物馆展出帝国印玺。", "The map shows the imperial capital.", "地图显示帝国都城。"],
  ["autonomy", "名词·自主权", "通常不可数，可指地区自治或个人自主；不是完全没有约束，权限范围需由语境确定。", "The team gained more autonomy over its budget.", "团队获得了更多预算自主权。", "The charter protects local autonomy.", "章程保护地方自治权。"],
  ["akin", "形容词·类似的", "通常放在系动词后并搭配 to，表示某些性质相似；不是 completely identical 的完全相同。", "The texture is akin to silk.", "这种质地类似丝绸。", "Her relief was akin to joy.", "她的宽慰近似喜悦。"],
  ["compost", "名词·堆肥", "指腐熟有机物形成的材料，通常不可数；原始垃圾尚未腐熟时不能一概当作成品堆肥。", "Mix compost into the soil.", "把堆肥混入土壤。", "The bin contains mature compost.", "箱中装着腐熟堆肥。"],
  ["improvise", "动词·即兴创作", "表示未预先充分准备而临场创造；可用于音乐、讲话或临时工具，不等于随意敷衍。", "The musicians began to improvise together.", "乐手们开始一起即兴演奏。", "We had to improvise a shelter from branches.", "我们不得不用树枝临时搭个遮蔽处。"],
  ["symmetrical", "形容词·对称的", "指部分之间按镜像或旋转等方式对应；普通的相似或大致均衡不一定构成严格对称。", "The pattern is perfectly symmetrical.", "这个图案完全对称。", "She folded a symmetrical paper butterfly.", "她折出一只对称的纸蝴蝶。"],
  ["prestige", "名词·声望", "通常不可数，指因质量、成功或地位受到尊重；声望与实际价格或权力大小不必一致。", "The award brought the laboratory international prestige.", "奖项为实验室带来国际声望。", "The college enjoys considerable prestige.", "这所学院享有相当高的声望。"],
  ["foresight", "名词·远见", "通常不可数，强调提前判断并据此准备；常用 have the foresight to do 描述预先作好安排。", "She had the foresight to bring spare batteries.", "她有先见之明，带了备用电池。", "The plan shows remarkable foresight.", "这份计划体现出非凡远见。"],
  ["engulf", "动词·吞没", "直接接被完全包围或覆盖的对象；可用于水、烟或情绪，语气比部分遮挡更强。", "Smoke began to engulf the empty warehouse.", "烟雾开始吞没空仓库。", "The waves threatened to engulf the small boat.", "海浪眼看要吞没小船。"],
  ["transient", "形容词·短暂的", "强调只维持很短时间，也可指临时停留的人群；不等于所有变化都无关紧要。", "The instrument recorded a transient signal.", "仪器记录到一个短暂信号。", "Their discomfort was only transient.", "他们的不适只是暂时的。"],
  ["staple", "形容词·基本的", "常修饰 food、crop 等，指日常主要依赖的东西；名词另可指订书钉，要按领域区别。", "Rice is a staple food in the region.", "稻米是这个地区的主食。", "The report tracks staple crop prices.", "报告追踪主要粮食作物价格。"],
  ["practitioner", "名词·从业者", "可数，指从事需训练或技能职业的人；领域通常由 medical 等修饰词明确。", "An experienced practitioner led the workshop.", "一位经验丰富的从业者主持工作坊。", "The practitioner explained her working method.", "这位专业人士解释了她的工作方法。"],
  ["antarctica", "专有名词·南极洲", "指南极大陆，首字母大写且通常不加 the；与可包括周边海域的 the Antarctic 有别。", "The research ship returned from Antarctica.", "科考船从南极洲返回。", "The exhibition features maps of Antarctica.", "展览展出南极洲地图。"],
  ["surge", "名词·激增", "可数，a surge in 后接增长的数量或活动；强调突然显著上升，不表示长期平稳增长。", "A surge in visitors filled the station.", "游客骤增，挤满车站。", "The shop experienced a surge in demand.", "这家店经历了需求激增。"],
  ["render", "动词·使处于", "常用 render 加宾语加形容词，表示使进入某种状态，语气正式；不必都译为呈现。", "Heavy snow can render the road impassable.", "大雪会使道路无法通行。", "The new lock will render the old key useless.", "新锁会使旧钥匙失效。"],
  ["juvenile", "形容词·幼年的", "用于未成年的人或未成熟动物；形容成年人行为时可带幼稚的批评意味，须区别语境。", "A juvenile eagle perched nearby.", "一只幼鹰停在附近。", "The survey recorded several juvenile fish.", "调查记录了几条幼鱼。"],
  ["chivalry", "名词·骑士精神", "通常不可数，可指中世纪骑士规范或礼貌体贴行为；现代使用常带历史或传统色彩。", "The tale celebrates courage and chivalry.", "故事赞颂勇气与骑士精神。", "The lecture examined medieval ideals of chivalry.", "讲座考察了中世纪骑士精神的理想。"],
  ["partition", "名词·隔断", "可数时常指分隔室内空间的薄墙；也可指领土划分，不能一律理解为实体墙。", "A wooden partition divides the studio.", "木隔断把工作室分成两部分。", "They removed the partition to create more space.", "他们拆掉隔断以腾出更多空间。"],
  ["exemplary", "形容词·堪称典范的", "表示非常好、值得仿效，常修饰 conduct 或 work；另有惩戒示众义，需由名词确定。", "Her exemplary preparation impressed the team.", "她堪称典范的准备工作让团队印象深刻。", "The workshop has an exemplary safety record.", "车间的安全记录堪称典范。"],
  ["constellation", "名词·星座", "指从地球看形成一定图案的一组恒星；并不说明这些恒星在空间中彼此靠近。", "We identified a constellation above the trees.", "我们辨认出树梢上方的一个星座。", "The chart labels each constellation.", "星图标注了各个星座。"],
  ["terrain", "名词·地形", "通常不可数，关注土地的自然地貌；可说 rough terrain，不把某一块土地简单写成 a terrain。", "The route crosses rocky terrain.", "路线穿过多岩石的地带。", "This vehicle handles uneven terrain well.", "这辆车很适应崎岖地形。"],
  ["mentality", "名词·心态", "指个人或群体特有的思考方式；常受固定观念等修饰，不等同于智商或知识量。", "The team needs a more cooperative mentality.", "团队需要更合作的心态。", "The story challenges a competitive mentality.", "故事质疑一味竞争的心态。"],
  ["interplay", "名词·相互作用", "常用 interplay between A and B，通常不可数；强调彼此影响，而非简单并列存在。", "The film explores the interplay between light and shadow.", "影片探索光影之间的相互作用。", "We studied the interplay of climate and vegetation.", "我们研究气候与植被的相互作用。"],
  ["invariable", "形容词·不变的", "表示每次都一样或从不改变，语气比 usually 更绝对；使用时应有充分一致性。", "Her invariable response was a quiet smile.", "她始终如一的回应是轻轻一笑。", "The machine follows an invariable sequence.", "机器遵循固定不变的顺序。"],
  ["fabricate", "动词·捏造", "可指编造虚假信息，也可指工业制造；涉及 evidence 等时多含欺骗意图，不能与诚实创作混同。", "No researcher should fabricate data.", "任何研究人员都不应编造数据。", "The factory can fabricate steel frames.", "工厂能够制造钢架。"],
  ["oar", "名词·桨", "指带长柄和扁平叶片的划船工具，通常支在船边；与不依靠桨架的 paddle 在常见用法上不同。", "One oar slipped into the water.", "一支桨滑进水里。", "He repaired the cracked wooden oar.", "他修好了开裂的木桨。"],
  ["permeable", "形容词·可渗透的", "描述材料允许液体或气体通过；常用 permeable to，不表示肉眼一定看得见孔洞。", "The fabric is permeable to air.", "这种布料透气。", "We laid a permeable surface beside the path.", "我们在小路旁铺设了可渗水地面。"],
  ["brittle", "形容词·易碎的", "强调坚硬而容易断裂或碎开，并非柔软易弯；也可比喻信心或关系脆弱。", "The old plastic has become brittle.", "旧塑料已经变脆。", "Handle the brittle shell carefully.", "小心拿这个易碎贝壳。"],
  ["bolt", "名词·螺栓", "指配合螺母紧固部件的金属件，也可指门闩；应根据机械或门窗语境区分。", "Tighten the bolt with a wrench.", "用扳手拧紧螺栓。", "A rusty bolt held the bracket in place.", "一个生锈的螺栓固定着托架。"],
  ["myriad", "名词·无数", "常用 a myriad of 后接复数名词，表示大量不同事物；也可直接作形容词修饰复数名词。", "A myriad of lights reflected on the river.", "无数灯光倒映在河面。", "The guide describes myriad local customs.", "指南介绍了多种多样的地方习俗。"],
  ["coarse", "形容词·粗糙的", "描述材料粗硬或颗粒较大，也可形容语言粗俗；与读音相同的 course 拼写和意义不同。", "The bag is made of coarse cloth.", "袋子用粗布制成。", "Use coarse sand for the bottom layer.", "底层使用粗沙。"],
  ["disorient", "动词·使迷失方向", "可指让人不清楚方向或处境，也写 disorientate；直接接受到影响的人或动物。", "Thick fog can disorient walkers.", "浓雾会使行人迷失方向。", "The flashing lights may disorient the birds.", "闪烁灯光可能使鸟类迷失方向。"],
  ["impend", "动词·即将发生", "偏正式且较少用，常描述不利事件迫近；日常更常见 impending 加名词的形式。", "A crisis seemed to impend.", "危机似乎即将来临。", "Further delays may impend if the bridge closes.", "如果桥梁关闭，可能面临进一步延误。"],
  ["foggy", "形容词·有雾的", "常描述天气或能见度差的环境；也可比喻思路不清，不能只凭天空阴暗就说 foggy。", "The ferry stopped on a foggy morning.", "渡轮在一个雾蒙蒙的早晨停航了。", "The road became foggy near the lake.", "道路在湖边变得雾气弥漫。"],
  ["signify", "动词·表示意味着", "直接接意义或从句，说明某现象所代表的内容；偏正式，不是用言语通知某人的普通说法。", "The red dot may signify an error.", "红点可能表示有错误。", "What does this symbol signify?", "这个符号意味着什么？"],
  ["bemoan", "动词·哀叹", "直接接令人遗憾的事情，强调抱怨或为之悲叹；不需要在宾语前加 about。", "Residents bemoan the loss of the old cinema.", "居民哀叹老电影院的消失。", "Writers often bemoan the lack of quiet space.", "作家常感叹缺少安静空间。"],
  ["override", "动词·推翻取代", "可指权威否决原决定，也可指人工越过自动控制；过去式 overrode，过去分词 overridden。", "The manager can override the automatic setting.", "经理可以越过自动设置。", "Safety concerns should override convenience.", "安全考虑应高于便利性。"],
  ["terrestrial", "形容词·陆地的", "可指生活在陆地的生物，也可指地球相关事物；不是所有含 terra 的语境都表示土壤。", "The exhibit compares aquatic and terrestrial habitats.", "展览比较水生和陆生栖息地。", "The study focuses on terrestrial mammals.", "研究关注陆生哺乳动物。"],
  ["oppressive", "形容词·压迫的", "可形容残酷不公的制度，也可形容令人憋闷的天气；强调感受沉重而不舒适。", "The room felt oppressive without fresh air.", "没有新鲜空气，房间让人感到憋闷。", "The novel depicts an oppressive regime.", "小说描绘了一个压迫性的政权。"],
  ["framework", "名词·框架", "可指支撑结构，也可指规则和思想的组织体系；framework for 常引出用途或所指导的行动。", "The framework supports the glass roof.", "框架支撑着玻璃屋顶。", "The plan provides a framework for discussion.", "计划提供了讨论框架。"],
  ["heyday", "名词·鼎盛时期", "常用 in its heyday 描述过去最成功或最流行的阶段；不是泛指事物存在的全部历史。", "The theatre welcomed thousands in its heyday.", "这座剧院鼎盛时期迎接过数千观众。", "These photographs capture the port's heyday.", "这些照片记录了港口的鼎盛时期。"],
  ["horticulture", "名词·园艺", "通常不可数，指花园植物的栽培活动或研究；与涵盖更广农业生产的 agriculture 有别。", "She studied horticulture at college.", "她在大学学习园艺。", "The centre offers practical horticulture courses.", "中心开设实用园艺课程。"],
  ["sever", "动词·切断", "直接接连接物或关系，强调彻底断开；可用于电缆、纽带等，语气比普通分开更强。", "Falling rocks could sever the cable.", "落石可能切断缆线。", "They decided to sever all commercial ties.", "他们决定切断所有商业联系。"],
  ["celestial", "形容词·天体的", "常修饰 bodies、objects 等，指天空或外太空相关；文学中也可表示天堂般的。", "The chart records celestial objects.", "图表记录天体。", "Students learned to recognize celestial patterns.", "学生学习辨认天空中的星体图案。"],
  ["converse", "动词·交谈", "偏正式，常用 converse with someone about something；另可作名词表示相反情况，须辨词性。", "Visitors can converse with the artists.", "参观者可以与艺术家交谈。", "They converse quietly in the courtyard.", "他们在庭院里轻声交谈。"],
  ["inflate", "动词·充气膨胀", "可指向气球或轮胎充气，也可比喻夸大价格或数字；不等于所有物体体积增加。", "Use this pump to inflate the mattress.", "用这个泵给气垫充气。", "Do not inflate the balloon too much.", "不要把气球充得太满。"],
  ["graze", "动词·吃草", "动物作主语时表示吃草，可及物或不及物；另有擦伤、掠过义，须结合对象辨认。", "Sheep graze on the lower slopes.", "羊在较低的山坡上吃草。", "The cattle graze quietly near the stream.", "牛在小溪旁安静地吃草。"],
  ["inhospitable", "形容词·不宜居的", "可描述环境恶劣或主人不友善；地理语境通常强调人难以生活，并非完全没有生命。", "The plateau is cold and inhospitable.", "高原寒冷，不宜居住。", "They crossed an inhospitable stretch of desert.", "他们穿过一片环境恶劣的沙漠。"],
  ["skeletal", "形容词·骨骼的", "可指骨架相关，也可比喻只有最基本轮廓；skeletal plan 表简略计划，不表示计划已完善。", "The museum displays skeletal remains.", "博物馆展出骨骼遗骸。", "We prepared a skeletal outline of the proposal.", "我们准备了提案的简略大纲。"],
  ["strand", "名词·缕", "可指细线、头发等的一根，也可指故事的一条线索；常用 a strand of 加材料或对象。", "A strand of hair caught on the button.", "一缕头发挂在纽扣上。", "This strand of the story remains unresolved.", "故事的这条线索仍未得到解决。"],
  ["gypsum", "名词·石膏矿物", "通常不可数，指用于制作石膏等的矿物；与加工成的各种石膏制品应按材料阶段区别。", "The quarry contains a layer of gypsum.", "采石场含有一层石膏矿。", "Gypsum is used in building materials.", "石膏用于建筑材料。"],
  ["intermediary", "名词·中间人", "指在双方之间传递信息或促成安排的人或组织；不必具有作出最终决定的权力。", "The agent acted as an intermediary.", "代理人充当中间人。", "We contacted the buyer through an intermediary.", "我们通过中间人与买家联系。"],
  ["intestine", "名词·肠", "指消化道中的肠，常用 small intestine 或 large intestine；不能把胃 stomach 与肠混为一谈。", "The diagram shows the small intestine.", "图示展示小肠。", "The intestine absorbs nutrients from digested food.", "肠从消化后的食物中吸收营养。"],
  ["fauna", "集合名词·动物群", "指某地区或时期的动物总称，常与植物群 flora 对应；不是单个动物的可数名称。", "The guide describes the island's fauna.", "指南描述岛上的动物群。", "Changing habitats affect local fauna.", "栖息地变化影响当地动物群。"],
  ["semiarid", "形容词·半干旱的", "也写 semi-arid，表示降雨较少但不及典型干旱地区；不能理解为完全没有降雨。", "The crop grows in semiarid regions.", "这种作物生长在半干旱地区。", "The team studied semiarid grassland.", "团队研究半干旱草原。"],
  ["muffle", "动词·使声音低沉", "直接接声音或声源，强调让声音减弱且不清晰；不表示一定完全隔音或消声。", "Thick curtains muffle street noise.", "厚窗帘减弱街道噪声。", "Snow can muffle the sound of footsteps.", "雪会减弱脚步声。"],
  ["toll", "名词·通行费", "可数，指使用道路或桥梁等需缴的费用；take a toll on 则指造成损害，是另一个固定搭配。", "Drivers pay a toll at the bridge.", "司机在桥上缴通行费。", "The toll includes the return crossing.", "通行费包括返程过桥。"],
  ["judicial", "形容词·司法的", "修饰法院、法官或司法程序相关事物；与表示明智审慎的 judicious 拼写近而意义不同。", "The decision is subject to judicial review.", "这一决定须接受司法审查。", "The archive contains judicial records.", "档案馆藏有司法记录。"],
  ["spherical", "形容词·球形的", "描述类似球体的三维形状；不等同于二维的圆形 circular，也不要求现实物体完全理想。", "The lamp has a spherical shade.", "灯有一个球形灯罩。", "The model contains spherical particles.", "模型包含球形颗粒。"],
  ["purify", "动词·净化", "直接接受处理物质，表示去除杂质或不良成分；具体纯度需测量，不能仅凭词义保证安全。", "The filter helps purify the water.", "滤器有助于净化水。", "The laboratory uses heat to purify the sample.", "实验室用加热方式提纯样本。"],
  ["riot", "名词·骚乱", "可数，指大量人群失控的公共暴力事件；不能把所有集会或和平抗议都称 riot。", "The report investigated the causes of the riot.", "报告调查了骚乱的原因。", "The riot damaged several empty shops.", "骚乱损坏了几家空商铺。"],
  ["empirical", "形容词·实证的", "指依据观察、经验或实验，而非仅靠理论推演；有实证依据仍需考虑样本及方法质量。", "The claim lacks empirical support.", "这一说法缺少实证支持。", "The study collected empirical evidence.", "研究收集了实证证据。"],
  ["stunt", "名词·特技动作", "可数，指需要技能的危险表演，也可指吸引注意的噱头；不意味着观众应自行模仿。", "A trained performer carried out the stunt.", "受过训练的表演者完成了特技动作。", "The film includes a difficult driving stunt.", "影片包含一个高难度驾驶特技。"],
  ["multitude", "名词·大量", "常用 a multitude of 加复数名词；可指人或物很多，不需要把它理解成精确数量单位。", "A multitude of birds gathered at the lake.", "大量鸟聚集在湖边。", "The design solves a multitude of problems.", "设计解决了许多问题。"],
  ["anglo-saxon", "形容词·盎格鲁撒克逊的", "历史文化名称两部分通常首字母大写；谈早期英格兰的语言或文物时，不应直接套用现代国籍概念。", "The museum houses Anglo-Saxon jewellery.", "博物馆收藏盎格鲁撒克逊珠宝。", "We studied an Anglo-Saxon poem.", "我们学习了一首盎格鲁撒克逊诗歌。"],
  ["avalanche", "名词·雪崩", "可数，指大量积雪冰石沿山坡滑落；an avalanche of 也可比喻突然涌来大量事物。", "An avalanche blocked the mountain road.", "雪崩堵住了山路。", "The camera recorded the avalanche from a distance.", "相机从远处记录了雪崩。"],
  ["silicon", "名词·硅", "不可数元素名，常用于电子材料语境；不能与指硅酮材料的 silicone 混写。", "The chip contains a thin layer of silicon.", "芯片含有一层薄硅。", "The laboratory studies silicon surfaces.", "实验室研究硅表面。"],
  ["incompatibility", "名词·不兼容", "指双方无法共同存在或工作的状态；常用 incompatibility between，不等于其中一方单独损坏。", "The test revealed incompatibility between the programs.", "测试显示两个程序不兼容。", "A software incompatibility prevented printing.", "软件不兼容导致无法打印。"],
  ["expanse", "名词·广阔区域", "常用 an expanse of 接水、沙或其他空间，强调宽广开阔；不是任何封闭小空间。", "An expanse of sand stretched ahead.", "前方延伸着一大片沙地。", "We crossed an open expanse of grassland.", "我们穿过一片开阔草原。"],
  ["integrate", "动词·整合", "integrate A into B 表将一部分纳入整体；强调相互协调，不只是把事物并排放在一起。", "We will integrate the results into the report.", "我们将把结果整合进报告。", "The system can integrate several data sources.", "系统能够整合多个数据来源。"],
  ["haul", "动词·拖运", "常描述费力地拖拉重物，也可指长途运输；直接接受运输对象，不只是轻轻提起。", "They haul timber along the narrow track.", "他们沿窄道拖运木材。", "We used a cart to haul the stones.", "我们用手推车运石头。"],
  ["vertebral", "形容词·椎骨的", "用于 vertebral column 等解剖结构，表示与椎骨或脊柱有关；不是泛指所有骨骼。", "The model shows the vertebral column.", "模型展示脊柱。", "The scan records vertebral alignment.", "扫描记录椎骨排列情况。"],
  ["impermeable", "形容词·不透水气的", "常用 impermeable to 加所阻隔物质，表示不允许其通过；与外观不透明不是同一性质。", "The lining is impermeable to water.", "内衬不透水。", "An impermeable layer lies beneath the soil.", "土壤下方有不透水层。"],
  ["implicate", "动词·牵涉", "常用 implicate someone in something，指证据显示与不法或不良事件有关；不等于已正式定罪。", "The documents may implicate him in the fraud.", "文件可能显示他牵涉欺诈。", "The findings implicate several factors in the failure.", "调查结果表明多种因素与失败有关。"],
  ["allergy", "名词·过敏", "常用 an allergy to 后接过敏原；不是所有不适或不喜欢某种食物都属于过敏。", "She told the waiter about her nut allergy.", "她告诉服务员自己对坚果过敏。", "The form asks about any known allergy.", "表格询问是否有已知过敏。"],
  ["respiratory", "形容词·呼吸的", "修饰 system、rate 等，表示与呼吸有关；不专指肺部某一种疾病，也不表示必然感染。", "The diagram shows the respiratory system.", "图示展示呼吸系统。", "Researchers measured the animals' respiratory rate.", "研究人员测量了动物呼吸频率。"],
  ["pigment", "名词·色素颜料", "可指使生物或材料呈色的物质；不同于光的颜色本身，也不一定是人工添加的化学品。", "The artist mixed a blue pigment with oil.", "画家把蓝色颜料与油混合。", "This pigment gives the petals their colour.", "这种色素赋予花瓣颜色。"],
  ["inadvertent", "形容词·无意的", "描述行为或错误并非出于故意；无意并不代表没有后果，也不自动免除责任。", "An inadvertent click closed the window.", "无意的一次点击关闭了窗口。", "We corrected an inadvertent omission.", "我们改正了一处无意遗漏。"],
  ["crater", "名词·坑口", "可指火山口或撞击形成的坑，可数；不宜把所有自然凹陷都当作陨石坑。", "The rover approached the edge of the crater.", "探测车接近了陨坑边缘。", "Steam rose from the volcanic crater.", "蒸汽从火山口升起。"],
  ["reverse", "动词·使反转", "直接接方向、顺序或决定，表示改成相反状态；不是普通的轻微调整或修补。", "Press the switch to reverse the motor.", "按下开关让电机反转。", "They decided to reverse the earlier decision.", "他们决定推翻先前的决定。"],
  ["marvel", "动词·惊叹", "常用 marvel at 接令人惊奇的事物；强调赞叹或惊讶，不是单纯看见或注意到。", "Visitors marvel at the painted ceiling.", "游客惊叹于彩绘天花板。", "We still marvel at her patience.", "我们仍惊叹于她的耐心。"],
  ["integral", "形容词·不可或缺的", "常用 an integral part of，强调构成整体的重要部分；不等于可有可无的附加装饰。", "Practice is an integral part of the course.", "练习是课程不可或缺的部分。", "The handle is integral to the design.", "把手是设计中不可分割的一部分。"],
  ["contention", "名词·争议", "常用 a point of contention 指争议点；也可表示某人提出的主张，需看上下文确定。", "Cost remains a point of contention.", "费用仍是争议点。", "Her main contention concerns access to the library.", "她的主要论点涉及图书馆使用权。"],
  ["strain", "名词·压力", "可指身体或心理承受的负担，也可指肌肉拉伤；under strain 表承压，不一定已有损伤。", "The extra weight put strain on the shelf.", "额外重量给架子造成压力。", "The long wait placed the team under strain.", "长时间等待让团队承受压力。"],
  ["vanish", "动词·消失", "通常不及物，常强调突然不见或不复存在；不能直接接被隐藏物来表示把某物弄消失。", "The footprints vanish at the riverbank.", "脚印在河岸处消失。", "The mist began to vanish after sunrise.", "日出后薄雾开始消散。"],
  ["consistency", "名词·一致性", "可指表现始终稳定，也可指液体稠度；判断 quality 还是 texture 相关语境再确定译法。", "The team values consistency in marking.", "团队重视评分一致性。", "Add water until the mixture has a smooth consistency.", "加水直到混合物质地细滑。"],
  ["counterpart", "名词·对应者", "指另一地点或机构中职能相同的人或事物；不是仅仅年龄或外观相似的普通同伴。", "She met her counterpart at the partner school.", "她见了合作学校中与她职位对应的人。", "The digital edition differs from its printed counterpart.", "电子版与对应的印刷版不同。"],
  ["residue", "名词·残留物", "指主体去除或过程结束后留下的物质；通常强调剩余部分，不一定表示有害或有毒。", "A waxy residue coated the inside of the cup.", "一层蜡状残留物覆盖杯子内壁。", "The cleaner removed the soap residue from the basin.", "清洁工去除了洗手盆中的肥皂残留物。"],
  ["subside", "动词·减退", "通常不及物，可指情绪、风暴或水位减弱，也可指地面下沉；不直接接被降低的对象。", "The noise should subside after the train passes.", "火车经过后噪声应该会减弱。", "We waited for the floodwater to subside.", "我们等待洪水退去。"],
  ["deception", "名词·欺骗", "可指隐瞒真相的行为或某种骗局，常含获取利益的目的；不等同于无意犯错。", "The investigation uncovered deliberate deception.", "调查揭露了蓄意欺骗。", "Her deception damaged the team's trust.", "她的欺骗破坏了团队的信任。"],
  ["marble", "名词·大理石", "作石材通常不可数，a marble 则常指一颗玻璃弹珠；材料与玩具义需按数和语境区分。", "The steps are made of white marble.", "台阶由白色大理石制成。", "A green marble rolled out of the bag.", "一颗绿色弹珠从袋子里滚出。"],
  ["craftspeople", "复数名词·工匠", "是 craftsperson 的复数，用于有手工技艺的人；不能在前面加 a 表示单个人。", "Local craftspeople restored the wooden doors.", "当地工匠修复了木门。", "The festival brings craftspeople together.", "节日把工匠们聚到一起。"],
  ["obligatory", "形容词·必须的", "表示依规则必须做，也可带幽默语气表示惯常必有；须区分法律要求与社交习惯。", "Attendance is obligatory for registered students.", "已注册学生必须出席。", "A safety check is obligatory before departure.", "出发前必须进行安全检查。"],
  ["shrine", "名词·圣祠", "指有宗教纪念意义的圣地或祭祀场所，也可引申为纪念处；并非所有普通建筑都适用。", "Visitors left flowers at the shrine.", "来访者在圣祠前献花。", "The shrine stands beside an ancient tree.", "圣祠位于一棵古树旁。"],
  ["clam", "名词·蛤蜊", "可数，指贝壳分两瓣的海生软体动物；与英语中所有 shellfish 的广泛范围不同。", "A clam lay half buried in the sand.", "一只蛤蜊半埋在沙里。", "The child drew the patterned shell of a clam.", "孩子画下蛤蜊带花纹的壳。"],
  ["extermination", "名词·灭除", "指彻底消灭某类生物的行动，语气很强；谈历史中的人群时涉及暴行，不能弱化为普通减少。", "The report examines pest extermination methods.", "报告考察害虫灭除方法。", "The archive documents the extermination campaign.", "档案记录了那场灭绝行动。"],
  ["deteriorate", "动词·恶化", "通常不及物，描述状况逐渐变坏；不直接接宾语来表示主动损坏某物。", "The roof will deteriorate without maintenance.", "没有维护，屋顶会逐渐损坏。", "Conditions began to deteriorate after heavy rain.", "大雨后情况开始恶化。"],
  ["spatial", "形容词·空间的", "表示位置、距离、面积等空间关系相关；不是表示特殊的 special，拼写相近须留意。", "The puzzle tests spatial awareness.", "拼图测试空间意识。", "The map shows the spatial distribution of trees.", "地图展示树木的空间分布。"],
  ["permanence", "名词·持久性", "通常不可数，指长久存在或保持的性质；不等于形式完全不能变化，也不是一次临时停留。", "Stone gave the memorial a sense of permanence.", "石材赋予纪念碑持久感。", "The study questions the permanence of these changes.", "研究质疑这些变化是否持久。"],
  ["regenerate", "动词·再生复兴", "可指组织重新生长，也可指地区重新活跃；再生能力因对象不同，不能从词义推出所有生物都能再生。", "Some tissues can regenerate after damage.", "有些组织受损后能够再生。", "The scheme aims to regenerate the old dock area.", "方案旨在振兴旧码头区。"],
  ["presume", "动词·推定", "常接 that 从句，表示据概率相信但未完全确定；I presume 比确证事实语气保留。", "I presume the meeting will start on time.", "我想会议会准时开始。", "Do not presume that everyone has seen the email.", "不要想当然认为每个人都看过邮件。"],
  ["analogous", "形容词·类似的", "常用 analogous to 表在某些方面可比较；强调可类比，不代表两者在所有方面相同。", "The process is analogous to filtering sand.", "这一过程类似筛沙。", "We found an analogous pattern in the second sample.", "我们在第二个样本中发现类似模式。"],
  ["verdict", "名词·裁决", "可指陪审团或法院依据案情作出的裁断，也可泛指评价；不是开庭前的初步指控。", "The jury delivered its verdict on Friday.", "陪审团周五作出裁决。", "The panel's verdict surprised the audience.", "评审组的结论让观众意外。"],
  ["qualitatively", "副词·性质上", "表示从性质或特征层面比较，与数量层面的 quantitatively 区分；不一定表示质量更好。", "The two materials differ qualitatively.", "这两种材料在性质上不同。", "We analysed the interviews qualitatively.", "我们对访谈作了定性分析。"],
  ["frigid", "形容词·极冷的", "形容天气或环境时比普通 cold 更强；也可形容态度冷淡，谈人时需注意语气。", "Frigid air entered through the doorway.", "冰冷空气从门口涌入。", "The hikers faced frigid conditions.", "徒步者面临严寒环境。"],
  ["offset", "动词·抵消", "直接接成本或影响，表示以相反作用加以平衡；是否完全抵消需看程度，过去式仍为 offset。", "Savings may offset the installation cost.", "节省的费用可能抵消安装成本。", "The shade helps offset the afternoon heat.", "阴凉有助于缓解午后热度。"],
  ["illiterate", "形容词·不识字的", "指无法读写，也可在 computer-illiterate 等组合中表示欠缺某领域知识；不等同于缺乏智慧。", "The charity supports illiterate adults.", "慈善机构帮助不识字的成年人。", "The narrator begins the story as an illiterate farmer.", "故事开头叙述者是位不识字的农夫。"],
  ["ruthless", "形容词·无情的", "描述为达目的不顾他人痛苦，通常含批评；不能仅因做事高效就一概称 ruthless。", "The novel portrays a ruthless landlord.", "小说描写了一位无情的地主。", "She rejected his ruthless tactics.", "她拒绝采用他那些无情手段。"],
  ["eradication", "名词·根除", "通常不可数，指彻底除去不良事物；强调完全消除，不能把小幅减少称为 eradication。", "The project focuses on the eradication of invasive weeds.", "项目重点是根除入侵杂草。", "Eradication requires long-term monitoring.", "根除需要长期监测。"],
  ["watt", "名词·瓦", "功率单位，可数；复数 watts，符号 W，不等同于能量单位或每小时耗电量。", "The sensor uses less than one watt.", "传感器功率不到一瓦。", "A watt is a unit of power.", "瓦是功率单位。"],
  ["enliven", "动词·使活跃", "直接接活动、场所或文字等，表示增添趣味和活力；不是让无生命物体真正获得生命。", "Fresh flowers enliven the small office.", "鲜花让小办公室更有生气。", "A short story can enliven a lecture.", "一个短故事能让讲座生动起来。"],
  ["intrinsic", "形容词·内在的", "常用 intrinsic to 表本身固有的性质或价值；与外部附加的奖励、评价等不同。", "Curiosity is intrinsic to her work.", "好奇心是她工作中固有的特点。", "The material has intrinsic strength.", "这种材料本身具有强度。"],
  ["provincial", "形容词·省级的", "可指省区事务，也可带狭隘不时髦的贬义；谈地区机构时不应自动套入贬义。", "The provincial museum opened a new gallery.", "省博物馆开放了一个新展厅。", "The road is managed by the provincial authority.", "道路由省级主管部门管理。"],
  ["nibble", "动词·小口啃", "可直接接食物，也常用 nibble at；强调轻轻反复咬小口，与大口吞食不同。", "Rabbits nibble the young leaves.", "兔子小口啃嫩叶。", "She began to nibble at a biscuit.", "她开始小口吃饼干。"],
  ["marshy", "形容词·沼泽般湿的", "描述土地长年或经常潮湿松软，如同沼泽；不只是雨后短暂表面湿润。", "The path crosses marshy ground.", "小路穿过沼泽湿地。", "Marshy fields surround the old mill.", "老磨坊周围是沼泽般湿润的田地。"],
  ["stingless", "形容词·无刺的", "用于 stingless bees 等表示没有可用螫针的特征；不意味着所有这类动物都不会以其他方式防御。", "A stingless bee entered the hollow log.", "一只无刺蜂飞进空心木头。", "The colony belongs to a stingless species.", "这个蜂群属于一种无刺蜂。"],
  ["engender", "动词·引起", "偏正式，直接接情绪或情况，表示使其产生；常用于 trust、debate 等抽象对象。", "Clear explanations can engender trust.", "清楚解释能够产生信任。", "The proposal may engender lively debate.", "提议可能引起热烈讨论。"],
  ["glaze", "动词·上釉", "可指给陶器涂釉或给食物涂亮层；眼睛 glaze over 则表示目光呆滞，是不同搭配。", "We will glaze the bowls before the final firing.", "我们会在最后烧制前给碗上釉。", "Brush the syrup over the fruit to glaze it.", "把糖浆刷在水果上，使其有光泽。"],
  ["shatter", "动词·粉碎", "可及物或不及物，表示突然破成碎片；也可比喻希望被彻底打破，语气强于轻微损坏。", "A falling branch could shatter the window.", "落下的树枝可能击碎窗户。", "The glass may shatter if heated unevenly.", "玻璃受热不均可能碎裂。"],
  ["horizontal", "形容词·水平的", "指与地平面或参照底边平行；与 vertical 垂直相对，具体方向取决于所用参照。", "Draw a horizontal line beneath the heading.", "在标题下面画一条水平线。", "Keep the shelf horizontal while tightening the screws.", "拧螺丝时让架板保持水平。"],
  ["sporadic", "形容词·零星的", "表示不规则地偶尔出现，与连续或定期发生不同；不能因出现次数少就认定间隔规律。", "Sporadic rain continued through the afternoon.", "午后持续有零星降雨。", "The station received sporadic signals.", "接收站收到断断续续的信号。"],
  ["lethal", "形容词·致命的", "指能够造成死亡，常用 lethal dose 或 lethal weapon；不表示每次接触都一定造成同样结果。", "The sign warns of a potentially lethal current.", "标牌警告有可能致命的电流。", "The story centres on a lethal mistake.", "故事围绕一个致命错误展开。"],
  ["virtuoso", "名词·大师", "可数，尤其指乐器演奏技艺超群的人；不仅表示一般专业从业者，也可作形容词。", "A young violin virtuoso opened the concert.", "一位年轻小提琴大师为音乐会开场。", "The virtuoso performed a demanding solo.", "这位大师演奏了一段高难度独奏。"],
  ["innate", "形容词·天生的", "描述与生俱来而非后来学习所得的特征；不能仅凭早期表现就断定具体能力完全先天决定。", "The tale gives its hero an innate sense of direction.", "故事赋予主人公天生的方向感。", "The study examines innate responses in animals.", "研究考察动物的先天反应。"],
  ["hemispheric", "形容词·半球的", "可指地球半球或大脑半球，常修饰 differences 等；需先确定地理还是神经科学语境。", "The study measures hemispheric differences in the brain.", "研究测量大脑半球之间的差异。", "The map shows hemispheric temperature patterns.", "地图展示半球尺度的气温模式。"],
  ["stratum", "名词·层", "可指岩层或社会层级，复数 strata；表示单层用 a stratum，不能写成 a strata。", "A dark stratum lies beneath the sandstone.", "砂岩下面有一层深色地层。", "The survey sampled each social stratum.", "调查从每个社会阶层抽样。"],
  ["intertwine", "动词·交织", "可指绳线缠绕，也可比喻经历或关系紧密相连；可及物或不及物，常搭配 with。", "The vines intertwine above the gate.", "藤蔓在门上方交织。", "Their stories intertwine throughout the novel.", "他们的故事贯穿小说，相互交织。"],
  ["drench", "动词·使湿透", "直接接受到浸湿的人或物，强调非常湿；比轻微喷洒 sprinkle 的程度强。", "Heavy rain can drench the open stalls.", "大雨会把露天摊位淋透。", "Use the hose to drench the dry soil.", "用软管把干土浇透。"],
  ["descent", "名词·下降血统", "可指向下运动或祖先来源；of Chinese descent 中指华裔，不是指从某地下降。", "The descent into the valley took an hour.", "下到山谷用了一个小时。", "The archive records the family's descent.", "档案记载了家族血统。"],
  ["intrigue", "动词·引起好奇", "直接接感到好奇的人，常因神秘或特殊而吸引兴趣；不能与普通告知事实完全等同。", "These unusual markings intrigue the researchers.", "这些奇特标记引起研究人员好奇。", "The locked drawer continued to intrigue her.", "那个上锁的抽屉一直让她好奇。"],
  ["delegate", "动词·委派", "delegate a task to someone 表把任务或权限交给他人；交出任务不一定免除最终责任。", "She will delegate the booking to her assistant.", "她会把预订交给助理。", "Managers must learn to delegate effectively.", "管理者必须学会有效委派任务。"],
  ["stationary", "形容词·静止的", "表示位置不移动，与 stationery 文具同音但拼写不同；不等于设备一定没有内部运动。", "The train remained stationary for ten minutes.", "火车停着没动，持续十分钟。", "Keep the camera stationary during the exposure.", "曝光期间保持相机静止。"],
  ["unravel", "动词·解开", "可指解开缠结，也可比喻弄清复杂问题；用于计划自行 unravel 时还可指逐渐瓦解。", "We tried to unravel the tangled thread.", "我们试着解开缠结的线。", "The documents helped unravel the mystery.", "文件有助于解开谜团。"],
  ["twig", "名词·细枝", "指树或灌木的小而细枝条，可数；比大树枝 branch 细，不是树干 trunk。", "A dry twig snapped underfoot.", "一根干细枝在脚下折断。", "The bird carried a twig to its nest.", "鸟把一根细枝衔回巢中。"],
  ["paddle", "名词·划桨", "指手持宽叶桨，可单叶或双叶；常用于独木舟，与支在船边桨架上的 oar 常有区别。", "She lifted the paddle from the water.", "她把桨从水中提起。", "A spare paddle lay inside the canoe.", "独木舟里放着一支备用桨。"],
  ["incomprehensible", "形容词·难以理解的", "程度很强，表示几乎无法理解；不一定说明对象本身无意义，也可能因缺乏背景知识。", "The instructions were incomprehensible to beginners.", "这些说明让初学者难以理解。", "His hurried handwriting was almost incomprehensible.", "他匆忙写下的字迹几乎无法辨认。"],
  ["scrupulous", "形容词·一丝不苟的", "可强调认真准确或诚实守原则；scrupulous about 后接关注事项，不只是做事速度慢。", "She keeps scrupulous records of every expense.", "她一丝不苟地记录每项开支。", "The editor is scrupulous about checking names.", "编辑核查姓名时非常认真。"],
  ["lag", "动词·落后", "常用 lag behind 表落后，或 lag by 引出差距；计算机语境也可指响应延迟。", "Sales continue to lag behind expectations.", "销售额仍低于预期。", "The video may lag on a slow connection.", "网络连接慢时视频可能卡顿。"],
  ["linger", "动词·逗留", "通常不及物，可指人迟迟不走或气味感受久久不散；不表示有意长期定居。", "Visitors often linger beside the pond.", "游客常在池边流连。", "The scent may linger for several hours.", "香味可能持续数小时。"],
  ["magnitude", "名词·规模", "the magnitude of 常引出问题或变化的规模、重要程度；地震学中还有震级的专业意义。", "We underestimated the magnitude of the task.", "我们低估了任务的规模。", "The chart shows the magnitude of the change.", "图表展示变化的幅度。"],
  ["league", "名词·联赛", "可指参加同一赛事体系的一组队伍，也可指联盟；不是单支球队本身。", "The club joined a local league.", "俱乐部加入了当地联赛。", "Our team finished second in the league.", "我们队在联赛中排名第二。"],
  ["thermometer", "名词·温度计", "可数，测量温度的仪器；读数需看温标和单位，不能把气压计或湿度计混称 thermometer。", "The thermometer hangs outside the window.", "温度计挂在窗外。", "Check the thermometer before adjusting the heater.", "调节暖气前先看温度计。"],
  ["perpendicular", "形容词·垂直的", "常用 perpendicular to，表示与参照线或面成九十度；不能只凭看上去陡峭就判断。", "Draw a line perpendicular to the base.", "画一条垂直于底边的线。", "The two paths are perpendicular at the crossing.", "两条小路在交叉处互相垂直。"],
  ["acupuncture", "名词·针灸", "通常不可数，指使用细针刺激身体特定部位的治疗方式；词义本身不承诺某项治疗效果。", "The museum explains the history of acupuncture.", "博物馆介绍针灸的历史。", "She attended a lecture on acupuncture.", "她参加了一场有关针灸的讲座。"],
  ["outlet", "名词·出口发泄途径", "可指流体出口或表达精力情绪的方式；an outlet for 后接被表达的情感或能力。", "Check that the outlet is not blocked.", "检查出口没有堵塞。", "Drawing became an outlet for his imagination.", "绘画成为他发挥想象力的途径。"],
  ["quilt", "名词·被子", "常指有填充层并缝合的床上覆盖物，也可指装饰床罩；各地区与 duvet 的用法有差异。", "She spread a quilt over the bed.", "她把被子铺在床上。", "The quilt has a pattern of blue squares.", "这床被子有蓝色方格图案。"],
  ["gaze", "动词·凝视", "常用 gaze at 指较长时间地注视，尤其因欣赏或沉思；比 glance 的一瞥更持久。", "Visitors gaze at the enormous mural.", "游客凝视巨幅壁画。", "We sat quietly to gaze across the valley.", "我们静坐着凝望山谷对面。"],
  ["revision", "名词·修订", "可指修改文本或计划，英式也可指考前复习；a revision 常指一次具体修改。", "The final revision corrected several dates.", "最后修订纠正了几个日期。", "The timetable allows an hour for revision.", "时间表留出一小时复习。"],
  ["biography", "名词·传记", "指由他人撰写的某人一生经历；本人撰写自己的生平通常用 autobiography。", "She borrowed a biography of the composer.", "她借了一本那位作曲家的传记。", "The biography includes previously unpublished letters.", "传记收录了此前未发表的信件。"],
  ["inflation", "名词·通货膨胀", "通常不可数，指整体价格水平持续上升；不能仅凭一种商品暂时涨价就作此判断。", "The report compares wages with inflation.", "报告比较工资与通胀。", "Inflation reduced the value of their savings.", "通胀削弱了他们储蓄的价值。"],
  ["renaissance", "名词·复兴", "普通名词可指兴趣或活动复苏；the Renaissance 大写时通常指欧洲文艺复兴时期。", "The town experienced a cultural renaissance.", "城镇经历了一场文化复兴。", "The craft is enjoying a renaissance.", "这门手艺正迎来复兴。"],
  ["infection", "名词·感染", "可指病原体进入并繁殖的状况，也可指电脑感染恶意程序；不能与炎症 inflammation 一概等同。", "The leaflet explains how infection can spread.", "传单解释感染如何传播。", "The laboratory tested the sample for infection.", "实验室检测样本是否存在感染。"],
  ["modern", "形容词·现代的", "可指当前时代或采用近期方法的设计；不自动表示质量比旧物更高，要看具体评价标准。", "The library has a modern ventilation system.", "图书馆有现代通风系统。", "The course compares ancient and modern maps.", "课程比较古代与现代地图。"],
  ["fatigue", "名词·疲劳", "通常不可数，可指极度疲倦，也可指材料因反复受力而弱化；需区分身体和工程语境。", "The long journey caused considerable fatigue.", "长途旅行造成明显疲劳。", "Engineers checked the metal for fatigue.", "工程师检查金属是否出现疲劳。"],
  ["grid", "名词·网格", "可指交叉线形成的方格，也可指电网；on the grid 等具体搭配需依据图表或能源语境。", "Draw the design on a square grid.", "在方格网中绘制设计。", "The farm supplies power to the grid.", "农场向电网供电。"],
  ["lumber", "名词·木材", "美式英语中指加工供建造用的木材，通常不可数；作动词则可指缓慢笨重地移动。", "The yard stores lumber under a roof.", "堆场把木材存放在棚下。", "We ordered lumber for the new deck.", "我们订了建新露台的木材。"],
  ["miracle", "名词·奇迹", "可指被认为超越自然规律的事件，也可比喻出乎意料的幸运；使用不构成对超自然原因的证明。", "Finding the lost ring felt like a miracle.", "找到丢失的戒指让人觉得像奇迹。", "The villagers described the escape as a miracle.", "村民称这次脱险为奇迹。"],
  ["remedy", "名词·解决办法", "可指处理困难的办法或治疗手段，常用 remedy for；并不保证任何所谓 remedy 都有效。", "We need a practical remedy for the delay.", "我们需要切实办法解决延误。", "The report proposes a simple remedy.", "报告提出了一个简单的补救办法。"],
  ["defy", "动词·违抗", "直接接规则、权威或预期；defy explanation 则表示难以解释，不需要加 against。", "The design seems to defy gravity.", "这项设计看起来仿佛无视重力。", "The results defy our expectations.", "结果出乎我们的预料。"],
  ["folklore", "名词·民间传说", "通常不可数，涵盖某群体流传的故事、信仰和习俗；不等于每个故事都有可验证的历史事实。", "The book explores local folklore.", "这本书探讨当地民间传说。", "Birds appear frequently in the island's folklore.", "鸟经常出现在岛上的民间传说中。"],
  ["heed", "动词·留意", "直接接建议或警告，表示认真注意并据以行动；也可用 pay heed to，不能混成 heed to。", "Please heed the guide's warning.", "请留意导游的警告。", "We should heed these early signs.", "我们应重视这些早期迹象。"],
  ["integrity", "名词·正直完整性", "可指诚实守原则，也可指结构或数据的完整状态；不可数，不能仅按道德义理解所有技术用法。", "Her integrity earned the team's respect.", "她的正直赢得团队尊重。", "The test checks the integrity of the seal.", "测试检查密封的完整性。"],
  ["lateral", "形容词·侧向的", "表示与侧面有关或横向移动；在不同结构中参照方向不同，不自动等于地图上的东西方向。", "The joint permits some lateral movement.", "关节允许一定的侧向运动。", "The diagram shows the lateral branches.", "图示展示侧枝。"],
  ["extravagant", "形容词·奢侈的", "可形容花费或使用过量，也可指主张夸张不切实际；常含超过合理需要的评价。", "The ceremony was an extravagant affair.", "典礼办得十分奢华。", "He rejected the extravagant claims in the brochure.", "他否定了手册中夸张的说法。"],
  ["inherent", "形容词·固有的", "常用 inherent in 表某事本来具有的特点；与后来附加或偶然带来的性质不同。", "The task has inherent difficulties.", "这项任务有固有困难。", "Variation is inherent in the process.", "变化是这一过程固有的特点。"],
  ["plagiarism", "名词·剽窃", "指把别人的文字或想法冒充自己的成果；通常不可数，适当引用并注明来源有助于避免此问题。", "The college investigates every allegation of plagiarism.", "学院调查每项剽窃指控。", "The guide explains how to avoid plagiarism.", "指南解释如何避免剽窃。"],
  ["encyclopedia", "名词·百科全书", "可指按条目组织的综合参考书或网络资料库；英式也写 encyclopaedia，不等同于只释词的词典。", "The encyclopedia contains an entry on glaciers.", "百科全书收有冰川词条。", "She consulted an online encyclopedia.", "她查阅了一部在线百科全书。"],
  ["physician", "名词·医生", "较正式，尤其指非外科的内科医生；不同地区与 doctor 范围略有差别，不是物理学家 physicist。", "The physician reviewed the hospital notes.", "医生查看了住院记录。", "A local physician attended the meeting.", "一位当地医生参加了会议。"],
  ["prototype", "名词·原型", "可数，指用于开发测试的初始模型；不意味着已经达到量产标准或最终销售版本。", "The prototype passed its first test.", "原型通过了首次测试。", "They built a working prototype from wood.", "他们用木头制作了可运作的原型。"],
  ["superficial", "形容词·表面的", "可指只涉及明显部分、缺少深入，也可指身体表层；语境不同，不一定带道德评价。", "The report offers only a superficial analysis.", "报告只作了表面分析。", "The scratch caused superficial damage.", "划痕造成了表层损伤。"],
  ["agility", "名词·敏捷", "通常不可数，可形容身体行动灵活或思维反应快；不直接表示力量大或耐力持久。", "The exercise improves balance and agility.", "这项练习改善平衡和敏捷性。", "The dancer moved with remarkable agility.", "舞者动作非常敏捷。"],
  ["deduce", "动词·推断", "常用 deduce something from evidence 或接 that 从句，强调根据已知事实推理，而非凭空猜测。", "We can deduce the route from these tracks.", "我们能从这些痕迹推断路线。", "What do you deduce from the diagram?", "你从图示中推断出了什么？"],
  ["eternal", "形容词·永恒的", "可指无终止，也常夸张地指似乎无休止；不是一个可测量的具体时长单位。", "The poem explores the idea of eternal love.", "诗探讨永恒之爱的概念。", "The fountain seems to flow in eternal silence.", "喷泉仿佛在永恒寂静中流淌。"],
  ["excursion", "名词·短途出游", "可数，通常指为休闲或学习安排的短期外出；不同于长期迁居或每天通勤。", "The class took an excursion to the coast.", "全班到海边短途游览。", "Our excursion ended at the old lighthouse.", "我们的短途游览在老灯塔结束。"],
  ["ferment", "动词·发酵", "可及物或不及物，描述微生物作用引起食物饮料变化；并非所有变坏现象都叫发酵。", "The juice will ferment in the barrel.", "果汁将在桶中发酵。", "They ferment the beans before drying them.", "他们先让豆子发酵，再将其晾干。"],
  ["mower", "名词·割草机", "可数，常是 lawnmower 的简略说法；指割草设备而不是耙子或翻土工具。", "The mower stopped near the fence.", "割草机在围栏附近停下了。", "He cleaned the mower after use.", "他用完后清理了割草机。"],
  ["robust", "形容词·结实可靠的", "形容物品或系统坚固且不易失效，也可形容人强健；不能仅凭外观粗大就判断可靠。", "The table has a robust metal frame.", "桌子有结实的金属框架。", "We need a robust system for storing records.", "我们需要可靠的记录存储系统。"],
  ["sentiment", "名词·情绪观点", "可指基于感受的看法或公众情绪；public sentiment 通常不可数，不能直接等同于统计事实。", "Public sentiment shifted after the announcement.", "公告发布后公众情绪发生了变化。", "I share the sentiment expressed in your letter.", "我认同你信中表达的感受。"],
  ["sparkle", "动词·闪烁", "表示许多小亮点闪耀，也可形容表演富有活力；不要求对象自身能发光。", "The wet leaves sparkle in sunlight.", "湿叶在阳光下闪闪发亮。", "Tiny lights sparkle above the stage.", "小灯在舞台上方闪烁。"],
  ["summon", "动词·召来", "可指正式命令人到场，也可用 summon courage 表鼓起勇气；比随意邀请更有命令或努力意味。", "The captain will summon the crew.", "船长将召集船员。", "She tried to summon the courage to speak.", "她努力鼓起勇气发言。"],
  ["unveil", "动词·揭幕公布", "可指揭开新雕像等的覆盖物，也可指首次公开计划；不只是普通地再次展示旧资料。", "The mayor will unveil the memorial.", "市长将为纪念碑揭幕。", "The team plans to unveil its new design.", "团队计划公布新设计。"],
  ["adapter", "名词·适配器", "可数，用于连接原本接口或规格不同的设备；英式也拼 adaptor，不自动保证电压可转换。", "This adapter connects the camera to the laptop.", "这个适配器连接相机与笔记本电脑。", "I packed a plug adapter for the trip.", "我为旅行带了插头转换器。"],
  ["atlas", "名词·地图集", "可数，通常指一册地图，也可指特定主题的图谱；不是单张普通地图的同义词。", "The atlas includes detailed river maps.", "地图集包括详细河流图。", "She opened the atlas at the regional section.", "她翻开地图集的地区部分。"],
  ["championship", "名词·锦标赛", "可指决定冠军的比赛，也可指冠军地位；win the championship 可表示赢得赛事或冠军。", "The championship begins on Saturday.", "锦标赛周六开始。", "Her team won the regional championship.", "她的队伍赢得了地区锦标赛冠军。"],
  ["discourse", "名词·话语讨论", "较正式，可指语言交际或某主题的公共讨论；通常不等于两句简短日常寒暄。", "The study examines classroom discourse.", "研究考察课堂话语。", "The issue shaped public discourse for years.", "这个问题多年影响公众讨论。"],
  ["famine", "名词·饥荒", "指广泛严重缺粮并造成苦难的状况；不能把个人一时饥饿或普通食品短缺都称 famine。", "The archive contains accounts of the famine.", "档案中有那场饥荒的记述。", "The drought increased the risk of famine.", "干旱增加了饥荒风险。"],
  ["hospitable", "形容词·好客的", "可描述主人热情，也可描述环境适宜生活生长；两种用法都强调能够接纳和支持。", "Our hosts were warm and hospitable.", "主人热情好客。", "The valley offers a hospitable climate for fruit trees.", "山谷气候适宜果树生长。"],
  ["hospitality", "名词·热情款待", "通常不可数，指欢迎客人并提供照顾；也可涉及餐饮接待行业，不只指酒店住宿。", "We thanked them for their hospitality.", "我们感谢他们的热情款待。", "The visit began with generous hospitality.", "这次访问以盛情款待开始。"],
  ["overestimate", "动词·高估", "直接接数量、能力或价值，表示估计高于实际；与故意夸张并非必然相同。", "Do not overestimate the time available.", "不要高估可用时间。", "We may overestimate demand in winter.", "我们可能高估冬季需求。"],
  ["oversimplify", "动词·过度简化", "指简化到失去准确性的程度；不是所有让说明更清楚的简化都属于 oversimplify。", "A single diagram may oversimplify the process.", "单张图示可能把过程过度简化。", "We should not oversimplify the causes of the conflict.", "我们不应过度简化冲突的原因。"],
  ["precauition", "拼写纠正·预防措施", "旧词头 precauition 已更正为 precaution；常用 take a precaution 表采取预防措施。", "We carried a spare torch as a precaution.", "我们带了备用手电筒以防万一。", "This precaution protects the equipment from dust.", "这项预防措施保护设备免受灰尘影响。"],
  ["semiconductor", "名词·半导体", "指导电性质介于导体和绝缘体之间的材料，也可指相关器件；不等于所有电子元件。", "The device uses a semiconductor sensor.", "设备使用半导体传感器。", "The factory makes semiconductor components.", "工厂制造半导体元件。"],
  ["sensational", "形容词·轰动的", "可褒义表示精彩惊人，也可贬义表示报道耸人听闻；应从所修饰名词判断语气。", "The dancer gave a sensational performance.", "舞者献上了精彩惊人的表演。", "The newspaper printed a sensational headline.", "报纸刊出一个耸人听闻的标题。"],
  ["steroid", "名词·类固醇", "可指一类天然化学物质或其合成药物；不应把所有 steroid 都等同于用于增肌的违禁药。", "The paper describes a steroid molecule.", "论文描述了一种类固醇分子。", "The label lists a steroid among the ingredients.", "标签在成分中列出一种类固醇。"],
  ["sympathy", "名词·同情", "常用 sympathy for someone 表对遭遇的理解关心；与赞同观点的 agreement 不完全相同。", "She expressed sympathy for the displaced families.", "她对流离失所的家庭表示同情。", "His letter was full of sympathy.", "他的信中充满同情。"],
  ["tranquil", "形容词·宁静的", "描述没有噪声、冲突或烦扰的平静状态；不等于完全无人居住或没有任何活动。", "The courtyard remained tranquil after sunset.", "日落后庭院依旧宁静。", "We found a tranquil spot beside the lake.", "我们在湖边找到一处宁静地点。"],
  ["tranquilizer", "名词·镇静药", "指使人或动物镇静的药物，美式拼写；英式常写 tranquillizer，词义本身不提供用药建议。", "The vet recorded the tranquilizer used.", "兽医记录了所用镇静药。", "The novel mentions a tranquilizer dart.", "小说提到一支镇静药飞镖。"],
  ["underpin", "动词·支撑", "直接接理论、体系等，表示提供基础或支持；也可指加固建筑地基，不只是暂时托住。", "Trust must underpin the partnership.", "信任必须成为合作的基础。", "These principles underpin the training programme.", "这些原则支撑着培训项目。"],
  ["unearth", "动词·发掘", "可指从土中挖出实物，也可比喻发现隐藏信息；不意味着发现的东西本来一定埋在地下。", "Archaeologists hope to unearth the original floor.", "考古人员希望发掘原来的地板。", "The search may unearth new evidence.", "搜寻可能发现新证据。"],
  ["vaccine", "名词·疫苗", "可数，指用于诱导对特定疾病免疫反应的制剂；不等于已经生病后的所有治疗药物。", "The museum displays an early vaccine vial.", "博物馆展出一个早期疫苗小瓶。", "The researcher explained how the vaccine was developed.", "研究人员解释疫苗的研发过程。"],
  ["vow", "动词·郑重承诺", "常用 vow to do，语气比普通计划更郑重坚定；也可作可数名词表示誓言。", "They vow to restore the old theatre.", "他们郑重承诺修复旧剧院。", "I vow to keep your letters safe.", "我郑重保证保管好你的信。"],
  ["curator", "名词·策展人", "指负责博物馆藏品、展览等的人，职责取决于机构；不只是现场带团讲解的导游。", "The curator selected objects for the exhibition.", "策展人挑选了展览物品。", "We asked the curator about the painting.", "我们向策展人询问这幅画。"],
  ["congenital", "形容词·先天的", "指从出生时就存在的状况；先天不等于一定遗传，不能仅凭这个词断定来源。", "The lecture examines congenital conditions.", "讲座考察先天性状况。", "The researcher studies a congenital abnormality.", "研究人员研究一种先天异常。"],
  ["guild", "名词·行会", "可数，指从事同类职业或有共同兴趣者组成的组织；历史行会与现代协会制度未必一样。", "The guild trained new apprentices.", "行会培训新学徒。", "She joined a local guild of weavers.", "她加入了当地织工行会。"],
  ["gazelle", "名词·瞪羚", "可数，指非洲或亚洲的一类轻快羚羊；不是所有鹿或所有羚羊的通称。", "A gazelle stood at the edge of the grassland.", "一只瞪羚站在草原边缘。", "The gazelle bounded over a fallen branch.", "瞪羚跳过一根倒下的树枝。"],
  ["elongate", "动词·延长", "可及物或不及物，指形状变得更长，常也更细；不只是按同一比例整体放大。", "Heat can elongate the metal rod.", "热会使金属棒伸长。", "The cells elongate as the shoot grows.", "嫩枝生长时细胞伸长。"],
  ["epitome", "名词·典范", "常用 the epitome of 表某种特质的典型或极致表现；通常不是泛指任何普通例子。", "The room was the epitome of simplicity.", "这个房间堪称简约的典范。", "She considered the chair the epitome of comfort.", "她认为这把椅子是舒适的典范。"],
  ["herder", "名词·牧人", "可数，指照看和驱赶成群动物的人；herder 与拥有牧场或牲畜的所有者身份不一定相同。", "The herder led the goats toward water.", "牧人领着山羊去水边。", "A herder watched the flock from the ridge.", "一位牧人在山脊上看护羊群。"],
  ["edifice", "名词·宏伟建筑", "偏正式，通常指庞大或令人印象深刻的建筑；也可比喻复杂体系，不常用于小棚屋。", "The stone edifice dominates the square.", "这座石质宏伟建筑俯临广场。", "The old edifice now houses a library.", "这座古老大厦如今是一家图书馆。"],
  ["niche", "名词·适合的位置", "可指适合个人的工作领域或小众市场，也可指生态位；find a niche 表找到合适位置。", "She found her niche in book illustration.", "她在书籍插画领域找到适合自己的位置。", "The company serves a small niche market.", "公司服务于一个小众市场。"],
  ["hem", "名词·衣边", "指布料折叠缝合的边缘，也可作动词表示缝边；不是整件衣服的任意边界。", "The hem of the skirt caught on a nail.", "裙摆钩在钉子上。", "She stitched a narrow hem along the cloth.", "她沿布料缝了一道窄边。"],
  ["oscillate", "动词·振荡", "表示来回移动，也可指在两种意见之间反复摇摆；常用 oscillate between 引出两端。", "The pendulum began to oscillate.", "钟摆开始来回摆动。", "Temperatures oscillate between warm and cold.", "气温在暖冷之间波动。"],
  ["blockage", "名词·堵塞", "可指堵塞状态或造成堵塞的东西；常用于管道或通道，不必已经完全阻断流动。", "A blockage slowed the flow of water.", "堵塞使水流减慢。", "The plumber removed the blockage.", "水管工清除了堵塞物。"],
  ["bison", "名词·野牛", "指北美或欧洲的野牛，单复数常同形；北美 bison 也常被称为 buffalo，但并非亚洲水牛。", "A bison grazed beyond the fence.", "一头野牛在围栏外吃草。", "The guide pointed out a young bison.", "导游指出一头幼野牛。"],
  ["mercantile", "形容词·商业的", "偏正式或历史用语，常修饰 trade 相关制度和活动；不是普通日常购物时最常用的形容词。", "The port grew into a mercantile centre.", "港口发展成商业中心。", "The archive records the city's mercantile history.", "档案记载城市的商业历史。"],
  ["clump", "名词·一簇", "可指聚在一起的树草或结成一团的土；常用 a clump of，不等于规则排列的一整排。", "A clump of reeds grew beside the pond.", "池边长着一簇芦苇。", "He broke up a clump of soil.", "他捏碎一块土团。"],
  ["viscera", "复数名词·内脏", "指身体内部器官的集合，语气专业；本身是复数，不写 a viscera，单数形式较少见。", "The diagram identifies the abdominal viscera.", "图示标出腹部内脏。", "The specimen's viscera were examined in the laboratory.", "实验室检查了标本的内脏。"],
  ["piston", "名词·活塞", "可数，指在气缸内往复运动并传递压力的部件；不是整台发动机或所有转轴的名称。", "The piston moves inside the cylinder.", "活塞在气缸内移动。", "The mechanic inspected the piston for wear.", "技师检查活塞磨损情况。"],
  ["incongruous", "形容词·不协调的", "描述某物与环境或情境不相称而显得突兀；不一定意味着物体本身损坏或丑陋。", "The plastic sign looked incongruous beside the old gate.", "塑料标牌在古老大门旁显得不协调。", "His laughter seemed incongruous in the silent room.", "他的笑声在安静房间里显得不合时宜。"],
  ["hieroglyph", "名词·象形文字", "可数，指古埃及等文字体系中表示词或声音的图形符号；不能把所有图画都称 hieroglyph。", "The guide explained a hieroglyph on the wall.", "导游解释墙上的一个象形文字。", "A bird-shaped hieroglyph appears above the doorway.", "门上方出现一个鸟形象形文字。"],
  ["ravage", "动词·蹂躏毁坏", "直接接受重创的地方或事物，强调大范围严重破坏；比普通的轻微损坏语气更强。", "Wildfires can ravage dry forests.", "野火会严重毁坏干燥森林。", "A severe storm may ravage the exposed coast.", "猛烈风暴可能重创无遮蔽海岸。"],
  ["gorilla", "名词·大猩猩", "可数，指非洲的大型类人猿；不要与同音的 guerrilla 游击队员混写。", "The gorilla rested beneath a tree.", "大猩猩在树下休息。", "The keeper watched the young gorilla play.", "饲养员看着幼年大猩猩玩耍。"],
  ["caravan", "名词·旅行拖车", "英式常指可牵引居住的旅行车，也可指商旅队伍；车辆与一群旅行者需按语境区分。", "They parked the caravan near the coast.", "他们把旅行拖车停在海边。", "The caravan contains a small kitchen.", "旅行拖车内有小厨房。"],
  ["presage", "动词·预示", "偏正式，直接接将来的事情，常用于警示性征兆；表示预示不等于证明后果必然发生。", "Dark clouds may presage a storm.", "乌云可能预示风暴。", "These changes could presage a new era.", "这些变化可能预示新时代。"],
  ["choreographer", "名词·编舞者", "可数，指设计并安排舞蹈动作的人；与亲自表演这些动作的 dancer 职责不同。", "The choreographer adjusted the final movement.", "编舞者调整了最后的动作。", "A visiting choreographer led the rehearsal.", "一位来访编舞者主持排练。"],
  ["caravel", "名词·轻快帆船", "指历史上一种小型轻快帆船，常见于早期航海史；不能泛指所有木制帆船。", "The model depicts a sixteenth-century caravel.", "模型描绘一艘十六世纪轻快帆船。", "The caravel carried supplies along the coast.", "这艘轻快帆船沿海岸运送补给。"],
  ["conservatism", "名词·保守主义", "通常不可数，可指不愿改变的倾向或政治理念；涉及特定政治传统时需结合国家背景。", "The essay explores cultural conservatism.", "文章探讨文化保守主义。", "Financial conservatism shaped their spending decisions.", "财务上的保守倾向影响了他们的开支决定。"],
  ["interlock", "动词·连锁扣合", "描述部件互相嵌合或紧密连接，可及物或不及物；不是简单接触或松散摆放。", "The pieces interlock without glue.", "部件不用胶就能互相扣合。", "These gears interlock inside the housing.", "这些齿轮在外壳内互相啮合。"],
  ["nickel", "名词·镍", "元素名通常不可数；美加英语中 a nickel 也指五分硬币，需根据材料或金额语境区分。", "The alloy contains nickel.", "这种合金含镍。", "She found a nickel beneath the bench.", "她在长椅下找到一枚五分硬币。"],
  ["guilder", "名词·荷兰盾", "历史上指荷兰采用欧元前的货币单位；不是今天荷兰通用欧元的另一名称。", "The museum displays an old guilder note.", "博物馆展出一张旧荷兰盾纸币。", "The ledger records prices in guilder coins.", "账本用荷兰盾硬币记价。"],
  ["buzzer", "名词·蜂鸣器", "可数，指发出嗡鸣信号的电子装置；通常用于提醒或呼叫，不是所有门铃都发这种声音。", "Press the buzzer to call the attendant.", "按蜂鸣器呼叫工作人员。", "The buzzer sounded at the end of the round.", "本轮结束时蜂鸣器响了。"],
  ["faunal", "形容词·动物群的", "学术用语，表示某地区或时期动物群相关；不能用作单只动物的可数名词。", "The report compares faunal remains from two sites.", "报告比较两处遗址的动物遗存。", "The island has unusual faunal diversity.", "岛上有不同寻常的动物多样性。"],
  ["necrosis", "名词·组织坏死", "通常不可数，指身体组织细胞死亡；是专业病理用语，不能等同于一切普通疼痛或炎症。", "The report describes tissue necrosis.", "报告描述组织坏死。", "The sample showed an area of necrosis.", "样本显示一片坏死区域。"],
  ["refractory", "形容词·难处理的", "可描述不响应治疗或不易控制，也可指耐高温材料；技术语境应结合所修饰对象确定。", "The furnace uses refractory bricks.", "熔炉使用耐火砖。", "The case proved refractory to the usual treatment.", "这个病例对通常治疗没有反应。"],
  ["semisubsistence", "形容词·半自给的", "规范表达常写 semi-subsistence farming，指部分自用部分出售的农业；不把词条任意当作普通可数名词。", "The report describes semi-subsistence farming in the valley.", "报告描述山谷中的半自给农业。", "The family runs a semi-subsistence farm.", "这家人经营一个半自给农场。"],
  ["empress", "名词·女皇皇后", "可指女性帝国统治者或皇帝的配偶；具体是掌权者还是配偶须根据历史背景辨认。", "The portrait shows the empress in ceremonial dress.", "画像中的女皇穿着礼服。", "The empress received the visiting delegation.", "女皇接见了来访代表团。"],
  ["flange", "名词·凸缘", "指从物体伸出的平边，用于固定或加强连接；常见于机械管件，不是整根管子的名称。", "The flange connects the two pipes.", "凸缘连接两根管子。", "Tighten the bolts around the flange.", "拧紧凸缘周围的螺栓。"],
  ["pastoralism", "名词·游牧畜牧业", "通常不可数，指以放牧牲畜为生的生产生活方式；与文学中描写田园的 pastoral 意义有别。", "The region has a long history of pastoralism.", "该地区有悠久的畜牧生活历史。", "The course examines mobile pastoralism.", "课程考察流动放牧的生活方式。"],
  ["aborigine", "名词·原住民的旧称", "谈澳大利亚人时此称呼现有冒犯性，应采用 Aboriginal person 等尊重的表达；仅为理解旧文献保留此词。", "The old document uses the word “aborigine”.", "旧文件用了 aborigine 这个词。", "The curator explains why “aborigine” is offensive today.", "策展人解释为何 aborigine 如今具有冒犯性。"],
  ["manganese", "名词·锰", "不可数化学元素名，常涉及合金生产；不要与 magnesium 镁混淆，两者是不同元素。", "The sample contains manganese.", "样本含有锰。", "Manganese is used in steel production.", "锰用于炼钢。"],
  ["canopy", "名词·篷盖树冠", "可指人造遮盖物或树林上部枝叶形成的覆盖层；不只是单片树叶或任何屋顶。", "A canvas canopy shaded the entrance.", "帆布篷盖遮住入口。", "Birds moved through the forest canopy.", "鸟在森林冠层间活动。"],
  ["gaseous", "形容词·气态的", "描述物质以气体形式存在或具有气体性质；不等同于汽油的 petrol，也不表示一定可燃。", "The substance exists in a gaseous state.", "这种物质以气态存在。", "The sensor detects gaseous emissions.", "传感器检测气态排放物。"],
  ["nectar", "名词·花蜜", "通常不可数，指花产生的甜液；不是蜜蜂酿成的成品蜂蜜 honey，两者阶段不同。", "Bees collect nectar from the flowers.", "蜜蜂从花朵采集花蜜。", "The blossom holds a drop of nectar.", "花中含着一滴花蜜。"],
  ["brackish", "形容词·半咸的", "形容带有一定盐分的水，常见于河口；不是淡水，也不能仅凭此词确定适不适合饮用。", "The lagoon contains brackish water.", "潟湖里是半咸水。", "These fish tolerate brackish conditions.", "这些鱼能耐受半咸水环境。"],
  ["chloride", "名词·氯化物", "指含氯与其他元素形成的化合物；常见 sodium chloride，不等于氯气 chlorine。", "The analysis measured chloride in the water.", "分析测量了水中的氯化物。", "Sodium chloride formed white crystals.", "氯化钠形成白色晶体。"],
  ["bombard", "动词·轰击", "直接接目标，bombard someone with questions 也可比喻接连发问；强调大量连续袭来。", "The reporters bombard her with questions.", "记者们接连向她发问。", "The account describes how ships bombard the fort.", "记述描述舰船如何炮击要塞。"],
  ["equilibrium", "名词·平衡", "通常不可数，可指物理平衡或心理稳定；in equilibrium 表处于平衡，不代表没有任何相反作用。", "The system eventually reaches equilibrium.", "系统最终达到平衡。", "The diagram shows forces in equilibrium.", "图示展示相互平衡的力。"],
  ["beau", "名词·男友", "较旧式或幽默的说法，指女性的男友；不是现代正式场合中泛称男性朋友最常用的词。", "Her beau arrived with a bunch of flowers.", "她的男友带着一束花来了。", "The letter mentions her childhood beau.", "信中提到她年少时的男友。"],
  ["cobalt", "名词·钴", "不可数元素名，也可指深蓝色；用于颜料或合金语境时应区分材料与颜色义。", "The alloy includes a small amount of cobalt.", "合金含有少量钴。", "The artist chose a vivid cobalt blue.", "画家选择了鲜艳的钴蓝色。"],
  ["forager", "名词·觅食者", "可指搜寻可食或可用资源的人或动物；不一定专指农业社会之前的人类。", "A forager searched the woodland for mushrooms.", "一位采食者在林中寻找蘑菇。", "The bird is an energetic forager.", "这只鸟觅食很积极。"],
  ["brusquely", "副词·生硬地", "形容回应或动作简短直接且略显无礼；比单纯快速多了一层不够体贴的语气。", "He answered brusquely and closed the door.", "他生硬地回答后关上了门。", "She brusquely dismissed the suggestion.", "她生硬地否定了建议。"],
  ["goof", "动词·犯傻出错", "非正式，表示犯愚蠢的小错误，常用 goof up；不宜在正式报告中代替具体错误说明。", "We all goof occasionally.", "我们偶尔都会犯傻出错。", "Try not to goof up the booking.", "尽量别把预订弄错。"],
  ["gripe", "名词·抱怨", "非正式，可数时指具体不满，也可作动词表示不停抱怨；不一定是严重的正式投诉。", "My only gripe is the lack of storage.", "我唯一的不满是储物空间不足。", "The survey asked residents for their main gripe.", "调查询问居民最主要的不满。"],
  ["fissure", "名词·裂隙", "可数，指深而窄的裂口，常用于岩石或身体表面；不是所有宽大凹地都叫 fissure。", "Water seeped through a fissure in the rock.", "水从岩石裂隙渗出。", "The survey mapped a long fissure.", "勘测绘出一条长裂隙。"],
  ["confer", "动词·商议", "confer with someone 表与某人交换意见商议；confer something on someone 则是授予，两个结构的含义不同。", "The judges will confer before announcing the result.", "评委将在公布结果前商议。", "She asked to confer with her colleagues.", "她要求与同事商议。"],
  ["mortality", "名词·死亡率", "可指死亡数量比率或人终有一死的状态；比较 mortality 时要看统计时期与人群范围。", "The study compares mortality across regions.", "研究比较各地区死亡率。", "The poem reflects on human mortality.", "诗思考人终有一死这一事实。"],
  ["crevice", "名词·缝隙", "可数，通常指岩石等表面狭窄裂缝；与特指冰川深裂口的 crevasse 拼写相近但适用范围不同。", "A fern grew in a crevice in the wall.", "一株蕨长在墙缝里。", "The key slipped into a narrow crevice.", "钥匙滑进一条窄缝。"],
  ["crevasse", "名词·冰川裂缝", "可数，特指冰川或厚冰中的深裂缝；普通墙缝或岩缝更常用 crevice。", "The route avoids a wide crevasse.", "路线避开一条宽冰川裂缝。", "The climbers marked the crevasse on their map.", "登山者在地图上标出冰川裂缝。"],
  ["fossilize", "动词·变成化石", "可及物或不及物，表示遗骸等形成化石；英式也写 fossilise，比喻义可指僵化不变。", "Only a few remains fossilize.", "只有少数遗骸会形成化石。", "Sediment may preserve bones long enough for them to fossilize.", "沉积物可能将骨头保存足够久，使其形成化石。"],
  ["query", "名词·询问", "可数，常含疑问或向权威求证的意味；技术中也指数据库查询，不必都译为质疑。", "Please send your query to the library desk.", "请把你的询问发送给图书馆服务台。", "The database query returned twelve records.", "数据库查询返回十二条记录。"],
  ["harp", "名词·竖琴", "可数，指以手指拨弦的弦乐器；play the harp 常指演奏，harp on 则是反复唠叨的动词短语。", "She plays the harp in the orchestra.", "她在管弦乐团演奏竖琴。", "The harp stood beside the music stand.", "竖琴放在谱架旁。"],
  ["concur", "动词·同意", "偏正式，常用 concur with someone 或 concur that；不直接接人作宾语，也可指事件同时发生。", "I concur with your assessment.", "我同意你的评估。", "The reviewers concur that the evidence is strong.", "审阅者一致认为证据充分。"],
  ["cuticle", "名词·角质层", "可指指甲根部薄皮或毛发等的外层；具体解剖部位需由语境判断，不泛指整片皮肤。", "The diagram labels the nail's cuticle.", "图示标出了指甲根部的薄皮。", "The microscope revealed the hair's cuticle.", "显微镜显示出毛发的角质层。"],
  ["contour", "名词·轮廓", "可指物体外形或地图等高线；a contour line 连接同高点，不表示河流的实际走向。", "The artist traced the contour of the hill.", "画家描出了山丘轮廓。", "Each contour line marks a different height.", "每条等高线标示不同高度。"],
  ["commonality", "名词·共同性", "可指共有的经历或特征；复数 commonalities 表具体共同点，不意味着彼此完全相同。", "The discussion revealed a commonality of purpose.", "讨论显示大家有共同目标。", "We found commonality in our experiences.", "我们在经历中找到共同之处。"],
  ["crystalline", "形容词·晶体的", "可描述物质形成有规则结构的晶体，也可形容清澈明亮；不能仅按透明程度判断材料是否结晶。", "The sample has a crystalline structure.", "样本具有晶体结构。", "Crystalline deposits formed on the surface.", "表面形成了结晶沉积物。"],
  ["amniotic", "形容词·羊膜的", "专业用语，常见于 amniotic fluid 或 amniotic sac；不泛指体内任意液体或薄膜。", "The diagram labels the amniotic sac.", "图示标出羊膜囊。", "The lecture explains the role of amniotic fluid.", "讲座解释羊水的作用。"],
  ["marshal", "动词·集结组织", "直接接资源、证据或人员，强调为目标有序调集；也可作名词指活动管理人员。", "She will marshal the evidence before the hearing.", "她将在听证前整理证据。", "We must marshal our limited resources.", "我们必须统筹有限资源。"],
  ["encapsulate", "动词·概括", "直接接被浓缩表达的思想或特点；常用一句话或小事概括更大主题，不只是逐字复述。", "The title can encapsulate the whole argument.", "标题可以概括整个论点。", "These letters encapsulate the spirit of the period.", "这些信件概括了那个时代的精神。"],
  ["zinc", "名词·锌", "不可数化学元素名，常用于合金或防腐镀层；与锰、镁等不同元素不可混称。", "The coating contains zinc.", "涂层含锌。", "Zinc protects the steel beneath it.", "锌保护其下的钢材。"],
  ["estivate", "动词·夏眠", "美式拼写，对应英式 aestivate，指某些动物在炎热干旱期进入休眠；不同于冬眠。", "Some snails estivate during dry weather.", "一些蜗牛在干燥天气里夏眠。", "These animals estivate in sheltered burrows.", "这些动物在有遮蔽的洞穴里夏眠。"],
  ["gull", "名词·鸥", "可数，指常见于海岸的鸥类鸟；并非只能生活在海上，也不同于所有泛称海鸟。", "A gull landed on the harbour wall.", "一只鸥落在港口堤墙上。", "The gull carried a shell in its beak.", "鸥用喙衔着一只贝壳。"],
  ["outcrop", "名词·露头", "地质用语，指露出地面的基岩；不是任何搬运放置的石块都称 outcrop。", "The path passes a sandstone outcrop.", "小路经过一处砂岩露头。", "The geologist sampled the outcrop.", "地质学家对露头取样。"],
  ["grasshopper", "名词·蚱蜢", "可数，指后腿发达、善跳的食草昆虫；不要与 cricket 蟋蟀完全混同。", "A grasshopper jumped from the fence.", "一只蚱蜢从围栏上跳开。", "The child sketched a green grasshopper.", "孩子画了一只绿色蚱蜢。"],
  ["gusher", "名词·自喷油井", "指石油无需抽泵而涌出的油井，历史石油语境常见；不是普通喷泉或水龙头。", "The drilling crew struck a gusher.", "钻井队打出了一口自喷油井。", "The photograph shows an early oil gusher.", "照片显示一口早期自喷油井。"],
  ["adobe", "名词·土坯", "通常不可数，指泥土和草等制成晒干的建筑材料；不能与烧制砖直接等同。", "The walls are built from adobe.", "墙体用土坯建成。", "Adobe keeps the room cool during the day.", "土坯使房间白天保持凉爽。"],
  ["sulfate", "名词·硫酸盐", "美式拼写，对应 sulphate；指含硫酸根的化合物，不要与 sulfide 硫化物混淆。", "The test measured sulfate in the sample.", "测试测量了样本中的硫酸盐。", "The label lists magnesium sulfate.", "标签列出了硫酸镁。"],
  ["brook", "名词·小溪", "可数，指小型溪流；另作动词时可表示容忍，不能把 brook no delay 按水流义翻译。", "A brook runs behind the cottage.", "小屋后有一条小溪。", "We crossed the brook on stepping stones.", "我们踩着踏脚石过了小溪。"],
  ["demean", "动词·贬低", "直接接人，表示使其尊严或受尊重程度下降；不是表示普通描述的 mean。", "Such remarks demean the volunteers.", "这种言论贬低志愿者。", "She refused to demean herself by lying.", "她拒绝靠撒谎降低自己的人格。"],
  ["precipitation", "名词·降水", "气象义通常不可数，包含雨雪等从云中降下的水；不等于只有降雨量。", "The chart shows annual precipitation.", "图表展示年降水量。", "Most precipitation falls in winter here.", "这里大部分降水出现在冬季。"],
  ["phosphorus", "名词·磷", "不可数元素名，有不同同素异形体；不要与形容词 phosphorous 或发光现象泛称混用。", "The sample contains traces of phosphorus.", "样本含微量磷。", "The analysis measured phosphorus in the soil.", "分析测量土壤中的磷。"],
  ["grapple", "动词·努力应对", "grapple with a problem 表努力处理难题；本义也可指扭打，不能把抽象用法都译为抓住。", "We must grapple with the funding problem.", "我们必须努力解决资金问题。", "Students grapple with unfamiliar ideas.", "学生努力理解陌生观念。"],
  ["rift", "名词·裂缝分歧", "可指地面或岩石大裂缝，也可比喻关系破裂；a rift between 后接双方。", "A rift opened in the frozen surface.", "冰面裂开一道缝。", "The decision caused a rift between the partners.", "这个决定使合伙人之间产生裂痕。"],
  ["diffuser", "名词·扩散器", "可指使光线变柔或使物质散开的装置；与动词 diffuse 对应，不是所有滤镜都叫 diffuser。", "The photographer fitted a diffuser to the lamp.", "摄影师给灯装了柔光器。", "The diffuser spreads the heat evenly.", "扩散器使热量均匀散开。"],
  ["excruciate", "动词·使极痛苦", "较少见的及物动词，表示使人遭受剧烈疼痛或折磨；日常更常见 excruciating，不能误作普通轻微不适。", "The injury continued to excruciate him.", "伤处继续使他极度痛苦。", "Such memories can excruciate a troubled mind.", "这样的回忆会折磨困扰中的心灵。"],
  ["eardrum", "名词·鼓膜", "可数，指耳内随声波振动的薄膜；不是整个耳朵，也不是耳道的普通名称。", "The diagram shows the position of the eardrum.", "图示显示鼓膜的位置。", "The eardrum vibrates when sound reaches it.", "声波到达时鼓膜会振动。"],
  ["prairie", "名词·北美大草原", "可数或不可数，尤指北美广阔平坦草地；与任何地区的草坪或农田并非完全同义。", "The railway crosses open prairie.", "铁路穿越开阔大草原。", "Tall grasses once covered this prairie.", "高草曾覆盖这片北美草原。"],
  ["himalayas", "专有名词·喜马拉雅山脉", "通常说 the Himalayas，山脉名称大写并用复数形式；不把整个山脉当成一座单峰。", "The expedition travelled through the Himalayas.", "探险队穿越喜马拉雅山脉。", "The map marks valleys in the Himalayas.", "地图标出喜马拉雅山脉的山谷。"],
  ["arboreal", "形容词·树栖的", "生物学中描述在树上生活的习性；也可指树木相关，并非所有会爬树动物都主要树栖。", "The enclosure suits an arboreal species.", "围栏适合一种树栖物种。", "The study examines arboreal mammals.", "研究考察树栖哺乳动物。"],
  ["neurotransmitter", "名词·神经递质", "可数，指在神经细胞之间等传递信号的化学物质；不等同于电信号本身。", "The diagram tracks a neurotransmitter across the synapse.", "图示追踪神经递质穿过突触。", "The lecture introduces a common neurotransmitter.", "讲座介绍一种常见神经递质。"],
  ["ephemeral", "形容词·短暂的", "强调存在时间很短，常用于现象或体验；与 eternal 相反，但不意味着短暂事物没有价值。", "The display captures ephemeral patterns in water.", "展览捕捉水中短暂的图案。", "The blossom's beauty is ephemeral.", "花朵的美转瞬即逝。"],
  ["folktale", "名词·民间故事", "可数，指在某群体中流传的传统故事；与通常不可数的 folklore 民俗总称不同。", "She retold a folktale from her hometown.", "她重述了家乡的一个民间故事。", "The folktale features a clever fox.", "这个民间故事中有一只聪明狐狸。"],
  ["sludge", "名词·淤泥", "通常不可数，指稠厚湿软的泥状物，也常用于污水处理；不只是干燥粉尘。", "Sludge collected at the bottom of the tank.", "池底积聚了淤泥。", "The machine removes sludge from the water.", "机器从水中清除污泥。"],
  ["hiccup", "名词·打嗝", "可指不由自主的短促喉部声响，也可比喻小故障；常用 hiccups 表连续打嗝。", "A hiccup interrupted his sentence.", "一个嗝打断了他的话。", "The launch suffered a minor technical hiccup.", "发布遇到一个小技术故障。"],
  ["entrench", "动词·使根深蒂固", "直接接观念、问题或权力，常含难以改变的意味；不只是暂时支持某种想法。", "Repeated unfairness can entrench distrust.", "反复不公会使不信任根深蒂固。", "The rules may entrench existing divisions.", "规则可能固化现有分歧。"],
  ["figurine", "名词·小雕像", "可数，通常指人形小模型，常由瓷或陶等制成；不是所有大型纪念碑都叫 figurine。", "A porcelain figurine stood on the mantelpiece.", "壁炉架上放着一尊瓷质小雕像。", "The figurine depicts a seated musician.", "小雕像表现一位坐着的乐师。"],
  ["constituency", "名词·选区", "可指选举代表的地区或该地区选民；范围由选举制度决定，不等同于整个国家。", "The constituency elected a new representative.", "选区选出了新代表。", "She opened an office in her constituency.", "她在自己的选区开设了办公室。"],
  ["conifer", "名词·针叶树", "指结球果的一类树木，多数常绿；不能据此说所有针叶树都永不落叶。", "A tall conifer grows beside the gate.", "门旁长着一棵高针叶树。", "The guide identified the conifer by its cones.", "导游根据球果认出这棵针叶树。"],
  ["acorn", "名词·橡子", "可数，特指橡树的坚果，通常带杯状壳斗；不是所有树的种子都可叫 acorn。", "A squirrel buried an acorn in the grass.", "松鼠把一颗橡子埋进草里。", "The acorn fell from the oak.", "橡子从橡树上落下。"],
  ["cheep", "动词·吱啾叫", "常用于幼鸟发出高而微弱的叫声；与同音 cheap 便宜的意义和拼写不同。", "The chicks cheep beneath the hen.", "雏鸡在母鸡身下吱啾叫。", "Young birds cheep when the nest is disturbed.", "巢受惊动时幼鸟会吱啾叫。"],
  ["hearth", "名词·炉边", "指壁炉周围或前方地面，也可象征家庭；不等于 heart 心脏，虽拼写相近但发音不同。", "The cat slept beside the hearth.", "猫睡在炉边。", "Warm light spread across the stone hearth.", "暖光铺在石质炉台上。"],
  ["serpentine", "形容词·蜿蜒的", "形容像蛇一样弯曲，也可比喻复杂难懂；不表示物体本身一定与蛇有关。", "A serpentine path climbs the hillside.", "一条蜿蜒小路爬上山坡。", "The river follows a serpentine course.", "河流沿蜿蜒河道前行。"],
  ["hiss", "动词·发嘶声", "可指长 s 音般的声响，也可指低声愤怒说话；不能把所有动物叫声都统一译为 hiss。", "Steam began to hiss from the valve.", "蒸汽开始从阀门发出嘶嘶声。", "The cat may hiss if frightened.", "猫受惊时可能发嘶声。"],
  ["pathogen", "名词·病原体", "可数，指能致病的微小生物或因子；不是所有细菌或微生物都是病原体。", "The test detected a pathogen in the sample.", "检测在样本中发现一种病原体。", "The researchers studied how the pathogen spreads.", "研究人员研究这种病原体如何传播。"],
  ["algae", "复数名词·藻类", "是 alga 的复数，常作藻类总称；不能用 an algae 表示单个个体，须注意单复数。", "Algae covered the surface of the pond.", "藻类覆盖了池塘表面。", "The study tracks algae in coastal water.", "研究追踪沿海水中的藻类。"],
  ["bask", "动词·晒太阳", "常用 bask in the sun，也可比喻沉浸于赞美；强调舒服地享受温暖而不是任何站在阳光下。", "Lizards bask on the warm stones.", "蜥蜴在温暖石头上晒太阳。", "We paused to bask in the afternoon sun.", "我们停下来享受午后阳光。"],
  ["arthropod", "名词·节肢动物", "可数，指有外骨骼和分节附肢的动物，如昆虫蜘蛛；不等同于仅有六足的昆虫。", "The specimen is a small arthropod.", "标本是一只小节肢动物。", "The diagram shows the segmented body of the arthropod.", "图示显示节肢动物的分节身体。"],
  ["ameliorate", "动词·改善", "偏正式，直接接不良情况，表示使之变好；比普通 improve 更常用于问题、痛苦或条件。", "The scheme aims to ameliorate overcrowding.", "方案旨在缓解过度拥挤。", "Extra shade may ameliorate the harsh conditions.", "更多遮阴可能改善恶劣条件。"],
  ["anthropological", "形容词·人类学的", "指人类社会、文化或演化研究相关；不是泛指任何涉及人的日常活动。", "The museum holds anthropological collections.", "博物馆有人类学藏品。", "She conducted anthropological research in the region.", "她在该地区开展人类学研究。"],
  ["conspicuous", "形容词·显眼的", "表示容易被注意到，有时带不希望引人注目的意味；与表示有意识的 conscious 拼写不同。", "The bright bag was conspicuous in the crowd.", "鲜艳的包在人群中很显眼。", "A conspicuous sign marks the entrance.", "醒目标牌标示入口。"],
  ["bellow", "动词·大声吼叫", "可指人高声喊叫或大型动物低沉鸣叫；比普通 say 音量强得多，不能用于细微耳语。", "The bull began to bellow across the field.", "公牛开始朝田野发出吼声。", "We heard the coach bellow instructions.", "我们听见教练大声喊指令。"],
  ["choreograph", "动词·编舞", "直接接舞蹈或动作，也可比喻精心安排事件；不等于仅仅参与表演。", "She will choreograph the final dance.", "她将编排最后一支舞。", "The director helped choreograph the crowd scene.", "导演协助编排人群场面。"],
  ["fecund", "形容词·多产的", "较正式，可形容土地肥沃或生物繁殖旺盛，也可比喻想象力丰富；不只是物体数量多。", "The valley has fecund soil.", "山谷土壤肥沃。", "Her fecund imagination produced many stories.", "她丰富的想象力创造了许多故事。"],
  ["turnpike", "名词·收费公路", "可数，尤指需付费使用的主干道路；不同地区具体制度不同，不泛指每条高速路。", "The bus joined the turnpike at the next junction.", "公交车在下一处路口驶入收费公路。", "The map marks a turnpike near the city.", "地图标出城市附近一条收费公路。"],
  ["hoe", "名词·锄头", "可数，指长柄短刃的园艺工具，也可作动词锄地；不等同于用来挖深坑的 spade。", "She loosened the soil with a hoe.", "她用锄头松土。", "The hoe hangs beside the garden door.", "锄头挂在花园门旁。"],
  ["pleistocene", "形容词·更新世的", "地质时期名首字母大写，常修饰 fossils、deposits；不必在普通学习例句中套用有争议或过时的起止年代。", "The cave contains Pleistocene deposits.", "洞穴中有更新世沉积物。", "Researchers examined a Pleistocene fossil.", "研究人员检查了一块更新世化石。"],
  ["forage", "动词·觅食", "常用 forage for food 或 forage in a place；也可指人采集食物，不等于单纯漫无目的散步。", "Badgers forage at night.", "獾夜间觅食。", "The birds forage for insects beneath the leaves.", "鸟在树叶下寻找昆虫。"],
  ["aquifer", "名词·含水层", "可数，指能储存或传递地下水的地层；不是所有地下岩层或地下湖的同义词。", "The well draws water from an aquifer.", "井从含水层取水。", "The map shows the extent of the aquifer.", "地图显示含水层范围。"],
  ["dune", "名词·沙丘", "可数，指风等堆积形成的沙丘，常在海滨或沙漠；不是所有小山都由沙构成。", "Grass stabilized the dune.", "草固定了沙丘。", "We walked behind the coastal dune.", "我们走到海滨沙丘后面。"],
  ["miniature", "形容词·微型的", "常修饰某物的小比例版本，也可作名词表示微缩模型；不只是强调原物普通偏小。", "He built a miniature railway.", "他建造了一条微型铁路。", "The exhibition includes a miniature kitchen.", "展览包括一间微缩厨房。"],
  ["obsidian", "名词·黑曜石", "通常不可数，指玻璃质火山岩；颜色常深黑，但不能把所有黑色岩石都称 obsidian。", "The blade was made from obsidian.", "刀刃由黑曜石制成。", "A piece of obsidian gleamed in the case.", "一块黑曜石在柜中闪光。"],
  ["supersede", "动词·取代", "直接接旧方法、规则或物品，表示新者替换旧者；拼写结尾为 sede，不是 cede。", "The new chart will supersede the old version.", "新图表将取代旧版。", "Digital records may supersede paper forms.", "数字记录可能取代纸质表格。"],
  ["bovine", "形容词·牛的", "专业或较正式，表示牛科动物相关；用于评价人时可带迟钝贬义，生物语境不含此意。", "The laboratory analysed bovine tissue.", "实验室分析牛组织。", "The study tracks bovine behaviour.", "研究追踪牛的行为。"],
  ["jurassic", "形容词·侏罗纪的", "地质时期名称首字母大写；修饰该时期岩石或生物，不应把所有恐龙都归入侏罗纪。", "The cliff exposes Jurassic limestone.", "悬崖露出侏罗纪石灰岩。", "The exhibit features a Jurassic fossil.", "展览展出一块侏罗纪化石。"],
  ["circumvent", "动词·绕过", "直接接障碍或规则，常表示巧妙规避；规避规则的语境可能带负面意味，不等于正式获得豁免。", "The new road will circumvent the crowded centre.", "新道路将绕过拥挤市中心。", "They tried to circumvent the usual procedure.", "他们试图绕过通常程序。"],
  ["parish", "名词·教区", "可指某些基督教派由一名神职人员照管的区域；英格兰也可指基层行政单位，需看语境。", "The parish maintains the old church.", "教区维护老教堂。", "The register lists births in the parish.", "登记册列出教区内的出生记录。"],
  ["chimp", "名词·黑猩猩", "chimpanzee 的非正式简称，可数；不等同于 gorilla 大猩猩，两者属于不同类人猿。", "A young chimp climbed the rope.", "一只幼年黑猩猩爬上绳子。", "The keeper prepared food for the chimp.", "饲养员为黑猩猩准备食物。"],
  ["steppe", "名词·干草原", "指东欧和中亚等广阔无树草地；通常强调自然草原环境，不是庭院草坪。", "The herd moved across the steppe.", "兽群穿过干草原。", "Cold winds swept the open steppe.", "冷风扫过开阔干草原。"],
  ["aspen", "名词·山杨", "可数或作树种材料名，指叶片易随微风颤动的杨树；不是所有 poplar 的任意替代词。", "An aspen grows beside the stream.", "小溪旁长着一棵山杨。", "The aspen leaves trembled in the breeze.", "山杨叶在微风中颤动。"],
  ["taro", "名词·芋头", "可指热带植物或可食部分，作为食材通常不可数；不是所有根茎类蔬菜的通称。", "The market sells fresh taro.", "市场出售新鲜芋头。", "They grow taro in the valley.", "他们在山谷种芋头。"],
  ["barter", "动词·物物交换", "常用 barter A for B，表示不用钱而以物换物；不等于围绕现金价格讨价还价。", "They barter vegetables for eggs.", "他们用蔬菜交换鸡蛋。", "The villagers barter goods at the weekly market.", "村民在每周集市上以物换物。"],
  ["cult", "名词·狂热群体", "可指被外界视为极端的宗教群体，也可指某作品的狂热追随；涉及真实群体时需注意评价色彩。", "The film developed a cult following.", "这部电影形成了一批狂热追随者。", "The historian studied the ancient cult.", "历史学家研究了那个古代宗教团体。"],
  ["chariot", "名词·双轮战车", "可数，指古代由马拉的双轮车，常用于战争或竞赛；不同于现代汽车或普通四轮马车。", "The mural depicts a racing chariot.", "壁画描绘一辆竞赛战车。", "A chariot stood beside the palace gate.", "一辆双轮战车停在宫门旁。"],
  ["bidder", "名词·出价人", "可指拍卖竞买者或工程投标人；the highest bidder 是出价最高者，不保证所有情况下都成交。", "The bidder raised her hand.", "竞买者举起了手。", "Each bidder submitted a sealed proposal.", "每个投标人提交了一份密封方案。"],
  ["titanium", "名词·钛", "不可数元素名，常见于轻而强的合金语境；不是所有银色金属都由钛制成。", "The frame is made from titanium.", "框架由钛制成。", "The alloy contains titanium.", "合金含钛。"],
  ["calve", "动词·产犊", "指母牛等生下幼崽，常见于畜牧语境；不要把所有动物分娩都套用此词，具体对象要按物种确定。", "The cows usually calve in spring.", "母牛通常在春季产犊。", "We watched the heifer calve in the barn.", "我们看着那头小母牛在畜棚产犊。"],
  ["instigate", "动词·发起促成", "直接接行动、调查或变化，强调推动其开始；并非所有用法都表示煽动坏事。", "The committee will instigate a review.", "委员会将启动审查。", "The discovery could instigate further research.", "这个发现可能促成进一步研究。"],
  ["bode", "动词·预示", "常用 bode well 或 bode ill for，表示对未来是好或坏的兆头；不表示结果已确定。", "The clear sky should bode well for the journey.", "晴朗天空应该预示旅途顺利。", "These delays bode ill for the schedule.", "这些延误预示排期不妙。"],
  ["genotype", "名词·基因型", "可数，指个体的遗传组成，也可作动词表示测定基因型；与可观察外貌的 phenotype 有别。", "The study compared each plant's genotype.", "研究比较了每株植物的基因型。", "This genotype appeared in several samples.", "这种基因型出现在多个样本中。"],
  ["enamor", "动词·使倾心", "较少见的主动动词，常见被动 enamored of 或 with；英式 enamour，表示喜爱而非保证持久关系。", "The city can enamor visitors with its quiet charm.", "城市宁静的魅力能让游客倾心。", "Such graceful melodies enamor many listeners.", "这样优美的旋律令许多听者着迷。"],
  ["cobra", "名词·眼镜蛇", "可数，指能展开颈部皮褶的一类毒蛇；并非所有蛇都具有相同外形和行为。", "The cobra raised its head.", "眼镜蛇抬起头。", "The enclosure contains a cobra.", "围栏中有一条眼镜蛇。"],
  ["flue", "名词·烟道", "指将烟或热气排出建筑的管道；不要与同音 flu 流感和 flew 飞的过去式混淆。", "The inspector checked the flue.", "检查员检查烟道。", "Smoke rose through the narrow flue.", "烟从狭窄烟道升起。"],
  ["ooze", "动词·缓慢渗出", "常用 ooze from 或 ooze out of，描述稠液慢慢流出；也可直接接所渗出的物质。", "Resin began to ooze from the bark.", "树脂开始从树皮渗出。", "Mud can ooze through the cracks.", "泥浆会从裂缝中慢慢渗出。"],
  ["resin", "名词·树脂", "可指树产生的黏稠物，也可指合成材料；通常不可数，不等同于 sap 的所有植物汁液。", "Resin dripped from the damaged branch.", "树脂从受损树枝滴下。", "The model is cast in clear resin.", "模型用透明树脂浇铸而成。"],
  ["alp", "名词·高山", "较少见的地形词，指高而崎岖的山；专名 the Alps 是阿尔卑斯山脉，不能用政治缩写 ALP 的义项替代。", "A snow-covered alp rose beyond the village.", "村外耸起一座白雪覆盖的高山。", "The map shows a steep alp above the valley.", "地图显示山谷上方一座陡峭高山。"],
  ["kinetic", "形容词·运动的", "常见于动能等物理表达，表示与运动有关或产生运动；不要与静止状态下所具有的势能混同。", "The exhibit contains kinetic sculptures.", "展览有动态雕塑。", "The lesson compares kinetic and potential energy.", "课程比较动能与势能。"],
  ["estuary", "名词·河口", "指河流入海处较宽的水域，常混有淡水和海水；不是任何上游河段都称 estuary。", "Boats sheltered in the estuary.", "船只在河口避风。", "The estuary supports many wading birds.", "河口养育许多涉禽。"],
  ["infantile", "形容词·幼稚的", "形容成年人行为时带批评，表示像小孩般不成熟；医学中也可中性表示婴幼儿相关。", "He apologized for his infantile behaviour.", "他为幼稚行为道歉。", "The joke seemed infantile to the audience.", "观众觉得这个笑话很幼稚。"],
  ["remuneration", "名词·报酬", "正式用语，通常不可数，指因工作或服务得到的支付；不等同于任何赠礼或中奖收入。", "The contract specifies the remuneration.", "合同规定了报酬。", "She asked about remuneration for the extra work.", "她询问额外工作的报酬。"],
  ["farmstead", "名词·农庄建筑群", "可数，指农场住宅及周围附属建筑；不一定包括农场全部耕地或牧场范围。", "The old farmstead stands beside the lane.", "老农庄建筑群位于小路旁。", "The farmstead includes a barn and a stable.", "农庄建筑群包括谷仓和马厩。"],
  ["clove", "名词·蒜瓣丁香", "可指一瓣蒜，也可指丁香香料；a clove of garlic 中须保留 garlic 避免两种食材混淆。", "Crush one clove of garlic.", "压碎一瓣蒜。", "A single clove flavoured the warm drink.", "一粒丁香给热饮增添了香味。"],
  ["fortuitous", "形容词·偶然的", "常用于碰巧带来好处的事件，强调未预先安排；不能仅理解为事物本来就幸运。", "A fortuitous meeting led to the collaboration.", "一次偶遇促成合作。", "The timing was entirely fortuitous.", "这个时机完全是碰巧的。"],
  ["flutter", "动词·飘动", "指轻快反复的小幅移动，可用于旗帜、翅膀等；不是固定方向的持续滑行。", "Flags flutter above the entrance.", "旗帜在入口上方飘动。", "The moth's wings began to flutter.", "蛾的翅膀开始扑动。"],
  ["genus", "名词·属", "生物分类单位，复数 genera，位于科与种之间；不能把一个属与一个物种完全等同。", "The label identifies the plant's genus.", "标签标明植物的属。", "Several species belong to this genus.", "几个物种属于这个属。"],
  ["petrifaction", "名词·石化", "通常不可数，指有机物等长期变成石质状态的过程；不等同于普通快速干燥或结冰。", "The display explains the process of petrifaction.", "展览解释石化过程。", "Petrifaction preserved the wood's structure.", "石化保存了木材结构。"],
  ["democratization", "名词·民主化", "通常不可数，指制度或决策方式变得更民主的过程；不表示每个参与者最后都会同意同一意见。", "The book traces the country's democratization.", "这本书追溯该国的民主化过程。", "The reform encouraged democratization within the association.", "改革推动协会内部民主化。"],
  ["deity", "名词·神", "可数，指某一宗教或神话中的神祇；特定信仰中的称谓和大小写应按具体传统使用。", "The carving represents a river deity.", "雕刻表现一位河神。", "The tale describes a protective deity.", "故事描述一位守护神。"],
  ["ensemble", "名词·演奏组", "指一起表演的音乐家或演员群体；也可指成套服装，需从表演或衣着语境判断。", "The ensemble rehearses every Thursday.", "乐团每周四排练。", "A string ensemble played in the courtyard.", "一组弦乐演奏者在庭院演出。"],
  ["protract", "动词·拖长", "偏正式，表示使时间延长，常暗示不必要地拖延；日常更常见过去分词 protracted。", "Further debate may protract the meeting.", "进一步辩论可能拖长会议。", "We should not protract the negotiations unnecessarily.", "我们不应无谓拖延谈判。"],
  ["bushel", "名词·蒲式耳", "干货容量单位，英制与美制大小不同；不是固定重量，不能不看物品就直接换算公斤。", "The basket holds a bushel of apples.", "篮子可装一蒲式耳苹果。", "The old ledger priced grain by the bushel.", "旧账本按蒲式耳为谷物计价。"],
  ["convulsion", "名词·抽搐", "可数，指肌肉突然不由自主地运动，也可比喻社会剧烈动荡；不等于一般主动伸展。", "The record describes a brief convulsion.", "记录描述了一次短暂抽搐。", "The novel follows a country in political convulsion.", "小说讲述一个处于政治剧变中的国家。"],
  ["harken", "动词·倾听", "是 hearken 的变体，较古旧或文学化，常搭配 to；现代普通交谈通常使用 listen。", "Harken to the storyteller's warning.", "听一听讲故事者的警告。", "The poem asks its readers to harken to the wind.", "诗歌请读者倾听风声。"],
  ["caucasian", "形容词·白人的旧称", "传统分类中用于浅肤色人群，如今范围含糊且带历史负担；地理语境还可表示高加索地区相关。", "The old form used the category “Caucasian”.", "旧表格使用了 Caucasian 这个类别。", "The exhibit explains the historical term “Caucasian”.", "展览解释历史用语 Caucasian。"],
  ["scanty", "形容词·不足的", "表示数量或规模小于需要或期望，常修饰 evidence、information；不仅仅是体积小。", "The archive provides scanty information about the artist.", "档案提供的艺术家资料很少。", "The evidence remains scanty.", "证据仍然不足。"],
  ["custodian", "名词·保管人", "指负责保护、照料物品或场所的人，也可比喻传统守护者；不一定是物品所有者。", "The custodian unlocked the archive.", "保管人打开了档案室。", "She acts as custodian of the family papers.", "她负责保管家族文书。"],
  ["bowel", "名词·肠", "解剖义指肠道，常用复数 bowels；the bowels of a building 可比喻建筑深处，不能按肠直译。", "The diagram shows the lower bowel.", "图示展示下段肠道。", "The report describes normal bowel function.", "报告描述正常肠功能。"],
  ["relic", "名词·遗物", "可指从过去留存的物品或制度，也可指圣物；仅说明遗留下来，不保证有高市场价值。", "The rusted sign is a relic of the old railway.", "生锈标牌是旧铁路的遗物。", "The museum displays a relic from the settlement.", "博物馆展出一件来自聚居地的遗物。"],
  ["fling", "动词·猛扔", "直接接被用力扔出的东西，过去式和过去分词均为 flung；比轻放或缓慢移动语气强。", "Do not fling your bag onto the glass table.", "不要把包猛扔到玻璃桌上。", "She watched the wind fling leaves across the yard.", "她看着风把落叶抛过院子。"],
  ["ion", "名词·离子", "指因失去或获得电子而带电的原子或原子团；不等同于任何中性原子。", "The diagram shows a positively charged ion.", "图示显示一个带正电的离子。", "The detector recorded a single ion.", "探测器记录到一个离子。"],
  ["fledgling", "名词·学飞幼鸟", "指羽翼已长出、正在学飞的幼鸟，也可作形容词表示初创的；不是所有刚孵化雏鸟都适用。", "A fledgling waited beneath the hedge.", "一只学飞幼鸟在树篱下等候。", "The parent bird fed the fledgling.", "亲鸟喂养这只学飞幼鸟。"],
  ["excrete", "动词·排泄", "直接接排出的废物，描述细胞或身体去除废物；不要与分泌有用物质的 secrete 混淆。", "The body must excrete waste products.", "身体必须排出废物。", "These cells excrete excess salts.", "这些细胞排出多余盐分。"],
  ["deciduous", "形容词·落叶的", "植物义通常指按季节落叶的树木；不是因为一时缺水掉叶就一定属于落叶树种。", "A deciduous tree shades the window in summer.", "一棵落叶树夏天为窗户遮阴。", "The park contains a deciduous woodland.", "公园里有一片落叶林。"],
  ["hare", "名词·野兔", "指长耳、善奔跑的一类动物；与 rabbit 不完全相同，也不要与同音 hair 毛发混写。", "A hare crossed the empty field.", "一只野兔穿过空旷田地。", "The hare paused beside a stone wall.", "野兔在石墙旁停下。"],
  ["legume", "名词·豆科植物", "指种子长在荚中的豆科植物或相关食物；并非所有日常称为豆的食材分类都完全相同。", "The farmer planted a legume as a cover crop.", "农夫种了一种豆科植物作覆盖作物。", "A pea is a familiar legume.", "豌豆是一种常见豆科植物。"],
  ["mutualism", "名词·互利共生", "生态学中指双方均受益的关系；不同于仅一方受益而另一方不受影响的 commensalism。", "The lecture explains mutualism between two species.", "讲座解释两种生物之间的互利共生。", "This relationship is an example of mutualism.", "这种关系是互利共生的例子。"],
  ["epoch", "名词·时代", "可指有重大变化的时期，地质学中也有特定分级意义；不是固定等于某个年数。", "The invention marked the beginning of a new epoch.", "这项发明标志着新时代开始。", "The book describes an epoch of rapid change.", "这本书描述了一个快速变革的时代。"],
  ["mustard", "名词·芥末酱", "可指芥菜植物、籽或由其制成的调味酱；作酱料名通常不可数，不是所有黄酱的统称。", "She added a little mustard to the dressing.", "她往沙拉酱里加了一点芥末酱。", "The mustard has a sharp flavour.", "这种芥末酱味道辛辣。"],
  ["pomegranate", "名词·石榴", "可数水果名，果皮厚而内有多粒多汁种子；不是 juice 果汁等加工品的直接名称。", "She opened a ripe pomegranate.", "她剥开一个成熟石榴。", "The pomegranate had bright red seeds.", "石榴有鲜红的籽。"],
  ["aria", "名词·咏叹调", "可数，指歌剧等作品中由单人演唱的曲段；与合唱 chorus 和对唱 duet 有别。", "The soprano sang a demanding aria.", "女高音演唱了一首高难度咏叹调。", "The aria closes the first act.", "这首咏叹调结束第一幕。"],
  ["flotation", "名词·漂浮", "可指浮起的过程或能力，商业中也可指股票首次公开发行；技术与金融语境需要区分。", "The jacket provides extra flotation.", "这件救生衣提供额外浮力。", "The experiment compared flotation in different liquids.", "实验比较不同液体中的漂浮情况。"],
  ["scrubland", "名词·灌丛地", "通常不可数，指被低矮灌木等覆盖的土地；不是所有森林或耕作农田都称 scrubland。", "The track crosses dry scrubland.", "小道穿过干燥灌丛地。", "Birds nested in the scrubland behind the farm.", "鸟在农场后的灌丛地筑巢。"],
  ["fresco", "名词·湿壁画", "可指在湿灰泥上作画的技法或作品；不同于任何涂在干墙上的壁画。", "The chapel contains a restored fresco.", "小教堂里有一幅修复过的湿壁画。", "The fresco covers the eastern wall.", "湿壁画覆盖东墙。"],
  ["caput", "名词·头状部", "解剖学专业词，源自拉丁语，指头或器官的头状主要部分；不宜代替日常 head 称人的头。", "The diagram labels the caput of the structure.", "图示标出该结构的头状部。", "The anatomical guide defines caput as a headlike part.", "解剖指南把 caput 定义为头状部分。"],
  ["hemlock", "名词·毒芹", "可指有毒草本植物及其毒物，也可指铁杉树；不要只凭同名判断植物可食或同属一类。", "The botanical drawing shows hemlock flowers.", "植物图绘出了毒芹花朵。", "The guide identifies hemlock as a poisonous plant.", "指南指出毒芹是有毒植物。"],
  ["detritus", "名词·碎屑", "通常不可数，指残留废物或腐解有机物；语境可为生活垃圾或生态碎屑，不只指石块。", "Detritus collected beneath the fallen leaves.", "落叶下积聚着碎屑。", "The tide left detritus along the shore.", "潮水沿岸留下残余杂物。"],
  ["intertidal", "形容词·潮间带的", "指低潮线与高潮线之间的区域相关，交替暴露和浸水；不等同于永远深海的区域。", "Crabs sheltered in the intertidal zone.", "蟹在潮间带藏身。", "The survey mapped intertidal habitats.", "调查绘出了潮间带栖息地。"],
  ["stratify", "动词·分层", "可指使形成层次或按群组分类，常见 stratify by；并非所有分层都涉及社会阶级。", "The liquid may stratify during storage.", "液体储存时可能分层。", "We will stratify the sample by age.", "我们将按年龄对样本分层。"],
  ["shale", "名词·页岩", "通常不可数，指容易沿薄层裂开的沉积岩；不是所有黑色岩石或含油岩石的通称。", "The cliff contains layers of shale.", "悬崖中有页岩层。", "A thin piece of shale broke in his hand.", "一片薄页岩在他手中断开。"],
  ["feud", "名词·长期争执", "指双方长期积累的敌对争执，常用 feud between 或 feud with；不是一次短暂意见不同。", "The feud divided the two families.", "长期争执分裂了两个家族。", "They finally ended their bitter feud.", "他们终于结束了激烈的长期争斗。"],
  ["chondrite", "名词·球粒陨石", "指一类典型含球粒的石陨石；使用通常或典型描述特征，避免把分类特征说成毫无例外。", "The museum acquired a chondrite specimen.", "博物馆购入一件球粒陨石标本。", "The chondrite contains visible rounded grains.", "这块球粒陨石中有可见圆粒。"],
  ["fortification", "名词·防御工事", "可指加强防护的行为，复数 fortifications 常指城墙堡垒等工事；不只是一般住宅墙壁。", "The fortification guarded the harbour entrance.", "防御工事守卫港口入口。", "The map shows the old fortification.", "地图标出旧防御工事。"],
  ["fern", "名词·蕨", "可数植物名，指不开花而以孢子繁殖的蕨类；不等同于所有叶片细碎的观叶植物。", "A fern grows in the shaded corner.", "一株蕨长在背阴角落。", "The fern unfolded a new frond.", "这株蕨展开了一片新叶。"],
  ["despondent", "形容词·沮丧的", "表示失去希望或热情，程度比普通不满意更强；常用于对失败或困境的反应。", "She felt despondent after the cancellation.", "取消之后她感到沮丧。", "The team refused to become despondent.", "团队拒绝陷入沮丧。"],
  ["clamor", "名词·喧嚷", "美式拼写，对应 clamour，可指高声抱怨或强烈要求；常用 clamor for，不只是任何背景声。", "A clamor for change filled the hall.", "要求改变的喧嚷声充满大厅。", "The clamor outside made conversation difficult.", "外面的喧闹声使交谈困难。"],
  ["cascade", "名词·小瀑布", "可指一串瀑布或连续倾泻之物；a cascade of 也可比喻一连串事件，不限于水。", "A cascade flows beneath the footbridge.", "人行桥下流着一处小瀑布。", "The error triggered a cascade of delays.", "错误引发一连串延误。"],
  ["chromosome", "名词·染色体", "可数，指携带遗传信息的细胞结构；不是单个基因 gene，两者层级不同。", "The diagram marks one chromosome in blue.", "图中把一条染色体标成蓝色。", "The student examined a chromosome image.", "学生查看了一张染色体图像。"],
  ["nebula", "名词·星云", "可数，指太空中的气体或尘埃云，复数 nebulae 或 nebulas；不同于整个星系 galaxy。", "The telescope captured a bright nebula.", "望远镜拍到一片明亮星云。", "Dust obscures part of the nebula.", "尘埃遮住了部分星云。"],
  ["loam", "名词·壤土", "通常不可数，指沙、黏土等比例适宜的土壤；不等于所有肥料或单纯腐殖质。", "The roots spread through rich loam.", "根系在肥沃壤土中伸展。", "We filled the bed with loam.", "我们用壤土填满种植床。"],
  ["precipitate", "动词·促使突然发生", "直接接事件，表示使其过早或突然发生；化学中还可指沉淀，需按领域区分。", "The closure may precipitate a transport crisis.", "关闭可能引发交通危机。", "One mistake can precipitate further problems.", "一个错误会引发更多问题。"],
  ["befit", "动词·适合", "偏正式，直接接人或身份，表示与其地位或情境相称；不用再加介词 for。", "Such care would befit a treasured painting.", "这样的照料才配得上一幅珍贵画作。", "The simple room seemed to befit his quiet nature.", "朴素房间似乎很适合他安静的性格。"],
  ["capillary", "名词·毛细血管", "可指极细管道，尤其最细小的血管；不是所有动脉静脉的通称，也可作形容词。", "The model shows a tiny capillary.", "模型显示一条细小毛细血管。", "Blood passes through the capillary network.", "血液流经毛细血管网。"],
  ["fen", "名词·低湿地", "可数或不可数，指低洼平坦湿地，尤见于英国地理；不是普通干燥草原。", "The boardwalk crosses the fen.", "木栈道穿过低湿地。", "Rare plants grow in this fen.", "这片低湿地生长着稀有植物。"],
  ["floodplain", "名词·洪泛平原", "指邻近河流、河水上涨时易受淹的平地；并不表示那里每天或每年一定被淹。", "The village lies on a floodplain.", "村庄位于洪泛平原上。", "The map outlines the river's floodplain.", "地图标出河流洪泛平原范围。"],
  ["enzyme", "名词·酶", "可数，指催化特定化学反应的生物物质；不是反应中作为原料被大量消耗的普通底物。", "The enzyme acts on a specific substrate.", "这种酶作用于特定底物。", "Heat altered the activity of the enzyme.", "热改变了酶的活性。"],
  ["garrison", "名词·驻军", "可指驻扎在某地的军队或其营房，也可作动词派兵驻守；不是所有临时旅行团体。", "The garrison guarded the mountain pass.", "驻军守卫山口。", "The old garrison buildings now contain a museum.", "旧驻军营房如今设有博物馆。"],
  ["hawk", "名词·鹰", "可指捕猎小动物的猛禽，也可比喻支持强硬政策者；不要与同音 hawk 的叫卖义混淆语境。", "A hawk circled above the field.", "一只鹰在田野上方盘旋。", "The hawk landed on a fence post.", "鹰落在围栏柱上。"],
  ["intraspecies", "形容词·种内的", "与 intraspecific 同义，指同一物种成员之间；与不同物种之间的 interspecies 区分。", "The study examines intraspecies competition.", "研究考察种内竞争。", "The diagram illustrates intraspecies variation.", "图示说明种内变异。"],
  ["derrick", "名词·井架", "可指油井钻塔或一种吊装结构；应根据钻井或港口作业语境判断，不是任意高塔。", "The derrick rises above the drilling platform.", "井架耸立在钻井平台上方。", "The crew inspected the derrick before work.", "工作人员开工前检查井架。"],
  ["boulder", "名词·巨石", "可数，指很大的岩石块；不是小圆石 pebble，形状也不一定完全圆滑。", "A boulder blocked the narrow path.", "一块巨石堵住窄路。", "We rested in the shade of a boulder.", "我们在巨石的阴影里休息。"],
  ["calcite", "名词·方解石", "通常不可数，指主要成分为碳酸钙的矿物；与含多种矿物的岩石名称不是同一层级。", "The vein contains white calcite.", "矿脉含有白色方解石。", "A calcite crystal stood in the display case.", "展柜里放着一块方解石晶体。"],
  ["bulldozer", "名词·推土机", "指前部有大型推土铲的重型车辆；不等同于主要用铲斗挖土的挖掘机。", "The bulldozer cleared the fallen soil.", "推土机清除了塌落泥土。", "A bulldozer levelled the site.", "一台推土机平整了工地。"],
  ["floral", "形容词·花卉的", "可指由花组成、花纹装饰或花香相关；并非一定表示物体含有真实花朵。", "She chose a floral fabric for the curtains.", "她选了花卉图案布做窗帘。", "The tea has a delicate floral scent.", "茶有淡淡花香。"],
  ["dredge", "动词·疏浚", "直接接河道、港口等，表示清除底部沉积物；dredge up 也可比喻翻出旧事。", "The crew will dredge the harbour channel.", "船员将疏浚港口航道。", "They dredge the river to keep it navigable.", "他们疏浚河流以保持通航。"],
  ["crumble", "动词·碎裂", "可及物或不及物，表示变成小碎块，也可比喻体系瓦解；常强调逐渐脆弱崩解。", "The dry wall began to crumble.", "干燥墙体开始碎裂。", "Crumble the bread into the bowl.", "把面包掰碎放进碗里。"],
  ["exponential", "形容词·指数式的", "描述按固定倍增关系变化，也常泛指加速增长；不是所有快速或线性增长都严格属指数增长。", "The graph shows exponential growth.", "图显示指数式增长。", "The lesson compares linear and exponential functions.", "课程比较线性函数与指数函数。"],
  ["noria", "名词·水车", "较专门，指带一系列水斗用于提水的轮式装置；不泛指所有发电涡轮或车轮。", "The noria lifted water into a channel.", "水车把水提入渠道。", "The village restored its old noria.", "村庄修复了旧水车。"],
  ["gully", "名词·冲沟", "指流水冲出的狭窄陡侧沟谷，也可指排水沟；不等同于所有宽河谷。", "Rainwater rushed down the gully.", "雨水沿冲沟奔流。", "The path follows a shallow gully.", "小路沿一条浅冲沟延伸。"],
  ["smelter", "名词·冶炼厂", "指通过高温从矿石等提取金属的工厂或装置；不是所有仅熔化金属的场所都完全等同。", "The smelter processes ore from nearby mines.", "冶炼厂加工附近矿山的矿石。", "The old smelter closed many years ago.", "旧冶炼厂多年前就关闭了。"],
  ["pellet", "名词·小颗粒", "可指小硬球或小圆柱形颗粒，也可指某些动物吐出的团块；具体材料由上下文确定。", "A pellet of clay rolled across the bench.", "一颗黏土小球滚过工作台。", "The owl pellet contained tiny bones.", "猫头鹰吐出的食团含有细小骨头。"],
  ["caterpillar", "名词·毛毛虫", "指蝴蝶或蛾的幼虫，可数；不是所有细长多足小动物都属于 caterpillar。", "A caterpillar crawled along the leaf.", "一条毛毛虫沿叶片爬行。", "The caterpillar fed on young cabbage leaves.", "毛毛虫吃嫩卷心菜叶。"],
  ["laden", "形容词·满载的", "常用 laden with，描述承载很多东西；也可比喻情感或责任沉重，不能直接当普通动词原形。", "The cart was laden with vegetables.", "车上满载蔬菜。", "A heavily laden branch bent toward the ground.", "一根结满果实的枝条弯向地面。"],
  ["sulfide", "名词·硫化物", "美式拼写，对应 sulphide，指硫与其他元素的化合物；与含氧的 sulfate 硫酸盐有别。", "The rock contains an iron sulfide.", "岩石含有一种铁的硫化物。", "The analysis identified sulfide minerals.", "分析识别出硫化物矿物。"],
  ["scavenger", "名词·食腐动物", "可指吃其他动物遗体的动物，也可指捡拾废弃物的人；不等同于所有主动捕食者。", "A scavenger approached the remains.", "一只食腐动物靠近残骸。", "The bird acts as a scavenger on the coast.", "这种鸟在海岸以食腐为生。"],
  ["fir", "名词·冷杉", "可指数种或木材，树为可数、木材常不可数；与同音 fur 动物毛不同。", "A fir grows beside the mountain hut.", "山间小屋旁长着一棵冷杉。", "The shelf is made of fir.", "架子用冷杉木制成。"],
  ["spore", "名词·孢子", "可数，指某些生物用于繁殖的细胞；不等同于开花植物的种子 seed。", "A spore can develop into a new organism.", "孢子可以发育成新生物体。", "The microscope revealed a fern spore.", "显微镜显示一枚蕨类孢子。"],
  ["detractor", "名词·贬低者", "指批评某人或事物的人，常暗含批评不公；不意味着所有提出合理异议的人都是恶意贬低者。", "Even a detractor praised the new design.", "连一位贬低者也赞扬了新设计。", "Her fiercest detractor questioned the cost.", "对她最严厉的批评者质疑费用。"],
  ["lobe", "名词·叶瓣", "解剖中指器官较独立的一部分，也可指耳垂；不是所有小块身体组织都叫 lobe。", "The diagram highlights one lobe of the brain.", "图中突出显示大脑的一个叶。", "A small earring hung from her ear lobe.", "一枚小耳环挂在她的耳垂上。"],
  ["grunt", "动词·咕哝", "可指猪发低沉声，或人因不满、用力等发短促低声；不等同于清楚说出完整句子。", "The pigs grunt near the feeding trough.", "猪在食槽旁哼哼叫。", "He could only grunt while lifting the crate.", "抬板条箱时他只能低哼。"],
  ["conceptualize", "动词·形成概念", "指在头脑中构想或以某概念理解事物；英式也写 conceptualise，常搭配 as 引出理解方式。", "We conceptualize the system as a network.", "我们把这个系统构想为网络。", "The sketches help students conceptualize space.", "草图帮助学生形成空间概念。"],
  ["flipper", "名词·鳍肢", "可指海豹企鹅等用于游泳的扁平附肢，也可指人工脚蹼；并非所有鱼鳍都叫 flipper。", "The seal lifted one flipper.", "海豹抬起一只鳍肢。", "A rubber flipper floated beside the boat.", "一只橡胶脚蹼漂在船旁。"],
  ["maroon", "形容词·栗红色的", "颜色义指深红紫色，也可作动词表示使困于某处；不应把颜色与被困状态混译。", "She wore a maroon scarf.", "她围着一条栗红色围巾。", "The door was painted maroon.", "门漆成栗红色。"],
  ["diagonal", "形容词·斜的", "描述直线斜向跨过平面，常指连非相邻角的对角线；不是弯曲曲线。", "Draw a diagonal line across the square.", "在正方形中画一条对角线。", "The fabric has diagonal stripes.", "布料有斜条纹。"],
  ["fiddler", "名词·小提琴手", "常指演奏民间音乐的小提琴手；与正式 violinist 相比语体更轻松，但演奏的可为同类乐器。", "A fiddler played beside the dancers.", "一位小提琴手在舞者旁演奏。", "The fiddler taught us a folk tune.", "这位小提琴手教我们一首民间曲调。"],
  ["commensalism", "名词·偏利共生", "指一方受益而另一方未明显受益或受害的种间关系；不同于双方都受益的 mutualism。", "The lesson explains commensalism with a diagram.", "课程用图解释偏利共生。", "The study examines commensalism between two species.", "研究考察两个物种间的偏利共生。"],
  ["quartz", "名词·石英", "通常不可数，指一种常见矿物，也用于电子计时器；不是所有透明晶体都是石英。", "The vein contains clear quartz.", "矿脉含有透明石英。", "The watch uses a quartz crystal.", "手表使用石英晶体。"],
  ["fluorescent", "形容词·荧光的", "可指吸收光后发出不同波长光的性质，也常形容鲜亮颜色；不一定在完全无光时持续发光。", "The fluorescent dye glowed under the lamp.", "荧光染料在灯下发亮。", "She wore a fluorescent yellow jacket.", "她穿着荧光黄色外套。"],
  ["coyote", "名词·郊狼", "可数，指北美一种犬科动物；另有跨境走私者的俚语义，动物例句不含该义。", "A coyote crossed the road at dawn.", "一只郊狼黎明时穿过道路。", "The camera recorded a coyote near the fence.", "相机记录到围栏旁的一只郊狼。"],
  ["broom", "名词·扫帚", "可数，指长柄清扫工具，也可指金雀花植物；家务语境通常指扫地器具。", "The broom stood behind the kitchen door.", "扫帚立在厨房门后。", "Use a broom to clear the dry leaves.", "用扫帚清理干树叶。"],
  ["commissioner", "名词·专员", "可数，指政府或机构中负有重要职责的官员；具体权限取决于机构，不能只译为普通雇员。", "The commissioner announced a review.", "专员宣布开展审查。", "The report was sent to the transport commissioner.", "报告送交交通专员。"],
  ["oceania", "专有名词·大洋洲", "地区名称首字母大写，指太平洋岛屿及相关区域；不同分类的边界有差异，不随意列出绝对国家范围。", "The exhibition explores navigation in Oceania.", "展览探索大洋洲的航海。", "The atlas includes a section on Oceania.", "地图集有大洋洲专题部分。"],
  ["geyser", "名词·间歇泉", "指间歇喷出热水和蒸汽的地热喷口；不同于普通冷水泉或人工喷泉。", "The geyser erupted before sunrise.", "间歇泉在日出前喷发。", "Steam drifted above the geyser.", "蒸汽飘在间歇泉上方。"],
  ["diode", "名词·二极管", "可数，指主要允许电流单向通过的器件；不是整块电路板，也不应把所有发光器件都混称。", "The circuit contains a diode.", "电路中有一个二极管。", "The technician replaced the damaged diode.", "技术员换掉了损坏的二极管。"],
  ["slab", "名词·厚板", "常用 a slab of 接石、木或食物，强调厚而平的块；不同于薄片 slice 的常见形状。", "A stone slab covered the opening.", "一块石板盖住洞口。", "She cut a slab of cheese.", "她切下一厚块奶酪。"],
  ["etch", "动词·蚀刻", "直接接图案或表面，指借酸或尖工具刻出纹样；be etched in memory 可比喻深深记住。", "Artists etch patterns onto the glass.", "艺术家在玻璃上蚀刻图案。", "They etch the design into a metal plate.", "他们把设计蚀刻到金属板上。"],
  ["flank", "名词·侧面", "可指人或动物肋部至髋部之间，也可指山侧；不等同于背部或正面，须结合对象。", "The horse had a white mark on its flank.", "马的侧腹有白色斑记。", "The path climbs the eastern flank of the hill.", "小路攀上山丘东侧。"],
  ["conglomerate", "名词·联合企业", "可指经营多领域的企业集团，地质中也指砾岩；企业与岩石意义要按行业语境区分。", "The conglomerate owns several small publishers.", "这家联合企业拥有几家小出版商。", "The cliff contains a layer of conglomerate.", "悬崖中有一层砾岩。"],
  ["engraving", "名词·版画", "可指雕刻技法，也可指从刻版印出的图画；不是所有手绘作品都叫 engraving。", "The engraving shows the old harbour.", "这幅版画描绘旧港口。", "She studied metal engraving at college.", "她在大学学习金属雕刻。"],
  ["granule", "名词·小颗粒", "可数，指细小粒状物；常用 granules of，不能把未经限定的大块物体当作 granule。", "A granule of sugar sparkled on the plate.", "一颗糖粒在盘上闪光。", "The sample contains a dark granule.", "样本中有一颗深色颗粒。"],
  ["emulsion", "名词·乳状液", "指一种液体细分散在另一种不相溶液体中的混合物；不是所有透明溶液的统称。", "The sauce forms a smooth emulsion.", "酱汁形成细滑乳状液。", "Shake the bottle to mix the emulsion.", "摇瓶子以混匀乳状液。"],
  ["hydrosphere", "名词·水圈", "通常与 the 连用，涵盖地球等天体近表面的水、冰和水汽；不只指海洋液态水。", "The diagram shows the hydrosphere and atmosphere.", "图示显示水圈与大气圈。", "The course examines changes in the hydrosphere.", "课程考察水圈变化。"],
  ["lithosphere", "名词·岩石圈", "通常与 the 连用，指地球等天体坚硬的外层；不是大气圈，也不能简单等同于一块地表岩石。", "The diagram labels the lithosphere.", "图示标出岩石圈。", "The model illustrates movement within the lithosphere.", "模型说明岩石圈内的运动。"],
  ["oxygen", "名词·氧", "不可数元素名，常指无色无味的氧气；空气是混合物，不是纯氧 oxygen 的同义词。", "The sensor measures oxygen in the tank.", "传感器测量罐内氧气。", "The experiment used a small supply of oxygen.", "实验使用了少量氧气。"],
  ["carbon dioxide", "名词短语·二氧化碳", "通常不可数，写作两个单词，指由碳和氧组成的气体；不能与 carbon monoxide 一氧化碳混称。", "The monitor measures carbon dioxide in the room.", "监测器测量室内二氧化碳。", "Plants use carbon dioxide during photosynthesis.", "植物在光合作用中利用二氧化碳。"],
  ["hydrogen", "名词·氢", "不可数元素名，氢气是很轻的气体；不是水本身，也不要与 oxygen 氧混淆。", "The container holds hydrogen.", "容器内装着氢气。", "The lesson compares hydrogen with helium.", "课程比较氢与氦。"],
  ["mantle", "名词·地幔", "地质语境指地壳以下的地幔，也可泛指覆盖层或职责；不能把所有 mantle 都译为地幔。", "The diagram shows the Earth's mantle.", "图示展示地幔。", "The course examines movement in the mantle.", "课程考察地幔中的运动。"],
  ["mishap", "名词·小意外", "可数，通常指不幸的小事故或差错；程度一般比灾难 catastrophe 轻，不能一概混译。", "A minor mishap delayed our departure.", "一个小意外延迟了我们的出发。", "The rest of the trip passed without mishap.", "其余旅程没有发生意外。"],
  ["catastrophic", "形容词·灾难性的", "形容造成极严重损害的事件或失败，程度很强；不是每个一般问题都适合此词。", "The storm caused catastrophic damage.", "风暴造成灾难性破坏。", "A catastrophic failure shut down the plant.", "一次灾难性故障使工厂停工。"],
  ["calamity", "名词·灾祸", "可数，指造成严重损害或苦难的事件；与 minor mishap 小意外在程度上有明显区别。", "The flood was a calamity for local farms.", "洪水对当地农场是一场灾祸。", "The town slowly recovered from the calamity.", "城镇慢慢从灾祸中恢复。"],
  ["jeopardise", "动词·危及", "英式拼写，美式通常 jeopardize，直接接受威胁的计划或事物；不意味着危险结果已经发生。", "A delay could jeopardise the whole project.", "延误可能危及整个项目。", "Do not jeopardise your safety for a photograph.", "不要为拍照危及自身安全。"],
  ["destructive", "形容词·破坏性的", "可指会造成损害的力量、行为或影响；形容行为时不一定说明行为者有意识的恶意。", "The storm brought destructive winds.", "风暴带来破坏性强风。", "The report examines destructive farming practices.", "报告考察破坏性的农业做法。"],
  ["el niño", "专有名词·厄尔尼诺", "写作两个词并保留 ñ，指赤道太平洋海温偏暖相关现象；不能把任何异常天气都叫 El Niño。", "The lecture explains El Niño and its effects.", "讲座解释厄尔尼诺及其影响。", "The study compares rainfall during El Niño years.", "研究比较厄尔尼诺年份的降雨。"],
  ["greenhouse", "名词·温室", "可数，指有透明顶壁、帮助植物保温生长的建筑；greenhouse gas 是温室气体的固定组合。", "The greenhouse protects seedlings from cold winds.", "温室保护幼苗免受冷风影响。", "Tomatoes grow inside the greenhouse.", "番茄在温室里生长。"],
  ["mineral", "名词·矿物", "可指天然无机物质或身体所需无机营养元素；要区分地质与营养语境，不是所有石块同一种矿物。", "The rock contains a green mineral.", "岩石含有一种绿色矿物。", "The label lists the mineral content.", "标签列出矿物质含量。"],
  ["gust", "名词·阵风", "可数，指突然短暂增强的风，常用 a gust of wind；不同于持续稳定的一整场大风。", "A gust of wind lifted the papers.", "一阵风卷起纸张。", "The next gust shook the branches.", "下一阵风摇动了树枝。"],
  ["gale", "名词·大风", "可数，指很强的风，比一般 breeze 微风强得多；正式气象等级与日常形容需区别。", "A gale shook the old windows.", "大风摇动旧窗户。", "The boat remained in port during the gale.", "大风期间船留在港内。"],
  ["tornado", "名词·龙卷风", "可数，指强烈旋转且接触地面的风暴气柱；与大范围热带气旋 typhoon 并非同一种现象。", "The tornado damaged several farm buildings.", "龙卷风损坏了几座农场建筑。", "The documentary explains how a tornado forms.", "纪录片解释龙卷风如何形成。"],
  ["typhoon", "名词·台风", "指西北太平洋地区的强热带气旋；不能把所有大风或局部龙卷风都称 typhoon。", "The typhoon forced the ferry to stop running.", "台风迫使渡轮停航。", "The island prepared for the approaching typhoon.", "岛上为即将来临的台风作准备。"],
  ["monsoon", "名词·季风雨季", "可指季节性风、雨季或其降雨；应按天气背景判断，不是每场夏季暴雨都称 monsoon。", "The monsoon brought rain to the dry fields.", "季风给干田带来雨水。", "Road repairs will resume after the monsoon.", "雨季过后道路维修将恢复。"],
  ["magma", "名词·岩浆", "通常不可数，指地下熔融岩石；喷到地表后通常称 lava，两者按所在位置区分。", "Magma rose beneath the volcano.", "岩浆在火山下方上升。", "The diagram shows a chamber of magma.", "图示显示一个岩浆房。"],
  ["thermodynamic", "形容词·热力学的", "修饰与热、功和能量关系相关的过程或性质；不是只要天气温暖就可以用此词。", "The lecture introduces thermodynamic principles.", "讲座介绍热力学原理。", "The model predicts thermodynamic behaviour.", "模型预测热力学行为。"],
  ["smog", "名词·烟雾污染", "通常不可数，指烟、污染气体等形成的有害空气状况；不同于单纯水汽凝结的自然雾。", "Smog obscured the distant hills.", "烟雾污染遮住远山。", "The city introduced measures to reduce smog.", "城市采取措施减少烟雾污染。"],
  ["tsunami", "名词·海啸", "可数，指海底剧烈扰动等造成的大海浪；不是所有风吹出的普通大浪都属于海啸。", "The museum documents damage caused by the tsunami.", "博物馆记录海啸造成的破坏。", "The warning system detected a possible tsunami.", "预警系统探测到可能发生海啸。"],
  ["flooding", "名词·洪水泛滥", "通常不可数，指区域被水淹的状况；描述一次具体灾害常用 a flood，不写 a flooding 随意计数。", "Heavy rain caused flooding in the valley.", "大雨造成山谷泛洪。", "The road remains closed because of flooding.", "道路因水淹仍然关闭。"],
  ["earthquake", "名词·地震", "可数，指地表突然震动的事件；震级和烈度概念不同，不能仅凭 earthquake 一词判定严重程度。", "The earthquake cracked the old wall.", "地震震裂了旧墙。", "The station recorded a small earthquake.", "监测站记录到一次小地震。"],
  ["seismic", "形容词·地震的", "常修饰 waves、activity 等，表示地震相关；比喻义可表示影响巨大，不是所有振动都严格属于地震。", "The sensor recorded seismic waves.", "传感器记录了地震波。", "The island has frequent seismic activity.", "岛上地震活动频繁。"],
  ["landscape", "名词·景观", "可指某区域自然外观，也可指风景画；landscape painting 是风景绘画，不等于土地所有权。", "The railway changed the rural landscape.", "铁路改变了乡村景观。", "She painted a winter landscape.", "她画了一幅冬日风景画。"],
  ["continent", "名词·大陆", "指地球大块陆地之一，可数；与国家 country 不同，一块大陆通常包含多个国家。", "The route crosses the continent.", "路线穿越大陆。", "The atlas devotes a chapter to each continent.", "地图集为每块大陆安排一章。"],
  ["plain", "名词·平原", "地理义可数，指广阔平坦土地；作形容词还有朴素或清楚义，要先辨明词性。", "The river winds across the plain.", "河流蜿蜒穿过平原。", "Fields cover the broad plain below.", "田野覆盖下方广阔平原。"],
  ["oasis", "名词·绿洲", "指沙漠中有水和植物的地方，也可比喻嘈杂中的宁静处；复数为 oases。", "The travellers rested at an oasis.", "旅行者在绿洲休息。", "The courtyard became an oasis of calm.", "庭院成了宁静绿洲。"],
  ["globe", "名词·地球仪", "可指球形地球模型，也可用 the globe 指世界；单个实体模型是可数名词。", "The teacher turned the globe slowly.", "老师慢慢转动地球仪。", "A globe stood beside the atlas.", "地图集旁放着一个地球仪。"],
  ["equal", "形容词·相等的", "常用 equal to 比较数量或大小，也可指同等权利；不是表示模糊相似的 similar。", "Divide the rope into equal lengths.", "把绳子分成等长几段。", "Both teams had an equal chance.", "两队机会相同。"],
  ["arctic", "形容词·北极的", "地区相关名称首字母大写；the Arctic 指北极地区，不要与南极的 Antarctic 混淆。", "The expedition studies Arctic sea ice.", "考察队研究北极海冰。", "Arctic winds reached the coast.", "北极寒风到达海岸。"],
  ["pole", "名词·柱杆", "可指长杆，也可指南北极或磁极；使用 a pole 与 the North Pole 时具体意义不同。", "The tent needs one more pole.", "帐篷还需要一根支杆。", "A flag flew from the tall pole.", "一面旗帜在高杆上飘扬。"],
  ["upgrade", "动词·升级", "upgrade A to B 表提高版本或等级；不意味着所有新版本都自动适用于每台旧设备。", "We plan to upgrade the library computers.", "我们计划升级图书馆电脑。", "The hotel offered to upgrade our room.", "酒店提出给我们的房间升级。"],
  ["atlantic", "形容词·大西洋的", "首字母大写；名词 the Atlantic 通常省略 Ocean，但不能把定冠词用于所有形容词位置。", "The study tracks Atlantic currents.", "研究追踪大西洋洋流。", "The ship crossed the Atlantic in winter.", "船在冬天横渡大西洋。"],
  ["ocean", "名词·海洋", "可数，指极广阔海域；具体洋名通常首字母大写并用 the，如 the Pacific Ocean。", "The ocean looked calm at dawn.", "黎明时海洋看起来平静。", "The boat headed toward the open ocean.", "船驶向外海。"],
  ["pacific", "形容词·太平洋的", "指太平洋时大写 Pacific；小写 pacific 可表示爱好和平，两种意思不能混译。", "The archive records Pacific voyages.", "档案记载太平洋航行。", "The vessel entered the Pacific at dusk.", "船在黄昏进入太平洋。"],
  ["marine", "形容词·海洋的", "常修饰 life、research 或 transport，表示海洋相关；不应与表示机器的 machine 混写。", "The bay supports diverse marine life.", "海湾养育多样海洋生物。", "The centre conducts marine research.", "中心开展海洋研究。"],
  ["navigation", "名词·导航", "通常不可数，可指船机定位引导或网站页面间移动；不只是地图本身或单次点击。", "The course teaches coastal navigation.", "课程教授近岸航行导航。", "Clear labels improve website navigation.", "清楚标签改善网站导航。"],
  ["gulf", "名词·海湾", "通常指较大且部分被陆地包围的海域；也可比喻巨大分歧，不等同于一条狭窄河流。", "The ship entered a sheltered gulf.", "船驶入一个有遮蔽的海湾。", "The map shows islands within the gulf.", "地图显示海湾内的岛屿。"],
  ["beach", "名词·沙石滩", "可数，指水边的沙或小石地带，也可能在湖边；不表示所有海岸都为沙滩。", "A narrow path led us down to the beach.", "一条窄路带我们来到海滩。", "The beach was covered with smooth stones.", "海滩铺满光滑石子。"],
  ["shore", "名词·岸边", "指海、湖或宽河的陆地边缘；on shore 表在岸上，与 onboard 在船上区分。", "We could see lights along the shore.", "我们能看见沿岸灯光。", "The boat drifted toward the shore.", "船漂向岸边。"],
  ["tide", "名词·潮汐", "可指海水规律升降或某次涨落潮；high tide 和 low tide 表高潮与低潮，不是洋流本身。", "The tide was coming in when we arrived.", "我们到达时正在涨潮。", "The harbour is shallow at low tide.", "低潮时港口很浅。"],
  ["current", "名词·水流", "可指水、空气或电的定向流动；作形容词则表当前的，需从句法判断所指意义。", "A strong current carried the branch downstream.", "强水流把树枝带向下游。", "The map shows a warm ocean current.", "地图显示一股暖洋流。"],
  ["stream", "名词·小溪", "可指自然溪流，也可指连续流动的液体、人群或数据；地理语境不是网络视频流。", "A narrow stream runs through the garden.", "一条窄溪穿过花园。", "We followed the stream toward the woods.", "我们沿小溪走向树林。"],
  ["source", "名词·来源", "常用 source of 或 source for，指起点、成因或信息提供者；不保证每个来源同样可靠。", "The spring is the source of the stream.", "这处泉水是小溪源头。", "Please record the source of each quotation.", "请记录每处引文的来源。"],
  ["flat", "形容词·平坦的", "描述表面平且没有明显高低，也可指轮胎瘪气；不等同于所有低矮事物都平坦。", "Choose a flat surface for the experiment.", "为实验选择平坦表面。", "The path remains flat beside the river.", "河边小路一直很平坦。"],
  ["sandy", "形容词·多沙的", "可形容土壤或地面含沙多，也可形容发色浅褐；不说明沙地一定处于沙漠。", "The plants tolerate sandy soil.", "这些植物耐沙质土壤。", "We followed a sandy track to the coast.", "我们沿沙地小道来到海边。"],
  ["stony", "形容词·多石的", "可描述地面多石，也可比喻表情冷漠；stony ground 的石头不一定块块巨大。", "The path crosses stony ground.", "小路穿过多石地面。", "A stony field lay beyond the wall.", "墙外是一片多石田地。"],
  ["mainland", "名词·大陆主体", "通常用 the mainland 指相对于附近岛屿的陆地主体；不是特指全球唯一一片大陆。", "The ferry connects the island to the mainland.", "渡轮连接岛屿与大陆。", "We could see the mainland from the hill.", "我们从山上能看见大陆。"],
  ["weather", "名词·天气", "通常不可数，指特定地点时段的气象条件；不写 a weather，一段天气可用 a spell of weather。", "The weather changed during the afternoon.", "午后天气变了。", "Good weather allowed us to work outside.", "好天气使我们能在户外工作。"],
  ["meteorology", "名词·气象学", "通常不可数，指研究大气和天气过程的学科；不同于研究陨石或流星的其他领域。", "She studied meteorology at university.", "她在大学学习气象学。", "The museum offers a meteorology workshop.", "博物馆开设气象学工作坊。"],
  ["mild", "形容词·温和的", "可形容天气不太冷或症状、味道不强烈；具体程度取决于比较对象，不代表没有任何影响。", "The coast has a mild winter climate.", "沿海冬季气候温和。", "This cheese has a mild flavour.", "这种奶酪味道温和。"],
  ["heating", "名词·供暖", "通常不可数，指加热过程或建筑供暖设备；central heating 是中央供暖，不是空调所有功能的总称。", "The heating comes on at six.", "暖气六点开启。", "The building uses solar heating.", "建筑采用太阳能供暖。"],
  ["tropics", "复数名词·热带", "通常与 the 连用，指回归线之间的地区；不等于所有终年温暖的地方都在热带。", "The plant grows in the tropics.", "这种植物生长在热带。", "The course examines rainfall in the tropics.", "课程考察热带降雨。"],
  ["snowy", "形容词·多雪的", "可形容有雪或像雪的事物，常用 snowy day；不表示气温只要低就一定下雪。", "We arrived on a snowy evening.", "我们在一个下雪的傍晚到达。", "The snowy peaks rose above the clouds.", "积雪山峰耸立在云层之上。"],
  ["freeze", "动词·结冰冷冻", "可及物或不及物，过去式 froze、过去分词 frozen；不同物质冻结温度不同，不统一限定零度。", "The pond may freeze overnight.", "池塘夜里可能结冰。", "You can freeze the remaining soup.", "你可以把剩下的汤冷冻起来。"],
  ["tremble", "动词·发抖", "通常不及物，描述轻微难控制的震颤，也可用于物体；可由寒冷、恐惧或激动引起。", "Her hands began to tremble.", "她的手开始发抖。", "The leaves tremble in the wind.", "叶子在风中颤动。"],
  ["shiver", "动词·打寒战", "常因寒冷、病感或恐惧而轻微发抖；可用 shiver with cold，不是普通主动摇动身体。", "We began to shiver in the cold room.", "我们在寒冷房间里开始发抖。", "The wet dog continued to shiver.", "湿狗继续打寒战。"],
  ["thunder", "名词·雷声", "天气义通常不可数，a clap of thunder 指一声雷；不要把可见的闪电 lightning 当作声音。", "Thunder echoed across the valley.", "雷声在山谷回响。", "We heard thunder before the rain began.", "下雨前我们听见雷声。"],
  ["lightning", "名词·闪电", "通常不可数，可用 a flash of lightning；与表示光照的 lighting 拼写不同，不能漏写 n。", "Lightning lit up the distant hills.", "闪电照亮远山。", "A flash of lightning crossed the sky.", "一道闪电划过天空。"],
  ["stormy", "形容词·暴风雨的", "可描述强风骤雨的天气，也可比喻争吵激烈的关系；不只是有一点小雨。", "The ferry stopped in stormy weather.", "渡轮在暴风雨天气停航。", "The meeting had a stormy beginning.", "会议开头争论激烈。"],
  ["downpour", "名词·暴雨", "可数名词，指在短时间内大量降下的雨；一场突如其来的暴雨比普通毛毛雨明显更强。", "A sudden downpour sent us indoors.", "一场突如其来的暴雨让我们跑进室内。", "The downpour filled the roadside ditch.", "暴雨灌满路边沟。"],
  ["rainfall", "名词·降雨量", "通常不可数，可指雨或某地区一段时间降雨量；与包括雪等的 precipitation 范围不同。", "Annual rainfall is low in this valley.", "这个山谷年降雨量少。", "The chart compares rainfall across the region.", "图表比较该地区各处降雨量。"],
  ["sprinkle", "动词·撒洒", "常用 sprinkle A on B 或 sprinkle B with A，表示少量分散撒上；不是一次倒出全部液体。", "Sprinkle seeds over the soil.", "把种子撒在土上。", "Sprinkle the cake with a little sugar.", "往蛋糕上撒一点糖。"],
  ["rainbow", "名词·彩虹", "可数，常指雨后阳光条件下可见的彩色弧；也可泛指白光分出的多色效果。", "A rainbow appeared above the lake.", "湖上方出现一道彩虹。", "The prism produced a tiny rainbow.", "棱镜形成一道小彩虹。"],
  ["shower", "名词·阵雨", "天气义可数，指持续较短的一阵雨，也可指淋浴；结合 rain 或浴室场景辨认。", "A brief shower interrupted the picnic.", "一阵短雨打断了野餐。", "We waited for the shower to pass.", "我们等阵雨过去。"],
  ["temperature", "名词·温度", "可指可测温度或体温，读数应标清单位；have a temperature 口语中可表示发烧。", "The temperature fell after sunset.", "日落后气温下降。", "Check the water temperature before the experiment.", "实验前检查水温。"],
  ["forecast", "名词·预测", "可数，表示对未来的预判，常用于天气；不是已经发生的事实，准确性存在范围和时效。", "The forecast predicts rain tonight.", "天气预报预测今晚有雨。", "We revised the sales forecast.", "我们修订了销售预测。"],
  ["mountain", "名词·山", "可数，通常指明显高于周围地面的高大地形；山名和群山表达依具体专名有不同冠词习惯。", "The mountain was hidden by cloud.", "山被云遮住。", "A narrow path leads up the mountain.", "一条窄路通上山。"],
  ["range", "名词·山脉", "地理义指一系列相连山峰，也有范围、系列等义；a mountain range 可明确山脉含义。", "The range stretches beyond the lake.", "山脉延伸到湖泊远处。", "Snow covered the mountain range.", "雪覆盖了山脉。"],
  ["valley", "名词·山谷", "可数，指山丘或山脉之间低地，常有河流；不是单个山峰顶部的平台。", "The road follows a wooded valley.", "道路沿着林木覆盖的山谷延伸。", "Morning mist filled the valley.", "晨雾充满山谷。"],
  ["hillside", "名词·山坡", "指山丘的斜面，而非顶部或整个山体；可搭配 on the hillside 表在山坡上。", "Sheep grazed on the hillside.", "羊在山坡上吃草。", "The hillside glowed in the evening light.", "山坡在晚光中泛亮。"],
  ["southern", "形容词·南部的", "修饰某区域南部或来自南部的事物；方向相对位置由参照区域确定，不自动等于南半球。", "The southern entrance is closed.", "南入口关闭了。", "Rain reached the southern coast.", "降雨到达南部海岸。"],
  ["southeast", "名词·东南方", "指东与南之间方向，可用 to the southeast of；作为普通方向通常小写，专名另按规范。", "The road turns toward the southeast.", "道路转向东南。", "The village lies southeast of the lake.", "村庄位于湖的东南方。"],
  ["southwest", "名词·西南方", "指西与南之间方向，可作名词副词或定语；不要将 west 与 east 对应中文方向颠倒。", "The wind came from the southwest.", "风从西南方吹来。", "We drove southwest along the coast.", "我们沿海岸向西南行驶。"],
  ["northeast", "名词·东北方", "指北与东之间方向，可用 in the northeast 表某地东北部；具体参照区域需明确。", "The hills lie to the northeast.", "山丘位于东北方。", "The route heads northeast from the station.", "路线从车站向东北延伸。"],
  ["northwest", "名词·西北方", "指北与西之间方向，也可作副词表示向西北；不是地图上任何左侧方向都恒为西北。", "Clouds gathered in the northwest.", "云聚集在西北方。", "The river flows northwest through the plain.", "河流向西北流过平原。"],
  ["eastern", "形容词·东部的", "表示某区域东部或来自东部；普通方向小写，正式地名中的大写需按专名处理。", "The eastern gate opens at sunrise.", "东门日出时开放。", "The storm reached the eastern districts.", "风暴到达东部各区。"],
  ["oriental", "形容词·东方的旧称", "可见于旧文献或物品描述，但用于称呼亚洲人常显过时并有冒犯性；现代宜写明具体地区。", "The old catalogue used the label “oriental”.", "旧目录用了 oriental 这个标签。", "The curator discussed the outdated term “oriental”.", "策展人讨论了 oriental 这个过时用语。"],
  ["irregularly", "副词·不规则地", "可修饰时间间隔或形状排列；与固定规律的 regularly 相对，不等于每次都完全随机。", "The bells rang irregularly through the afternoon.", "整个下午钟声断续无规律地响。", "The stones were irregularly shaped.", "这些石头形状不规则。"],
  ["muddy", "形容词·泥泞的", "描述含泥或覆泥，也可形容颜色浑暗、表达不清；不能把所有湿润表面都叫 muddy。", "Our boots were muddy after the walk.", "步行后我们的靴子沾满泥。", "The path became muddy near the stream.", "小路靠近溪边变得泥泞。"],
  ["dirt", "名词·泥土污垢", "通常不可数，可指地面土壤或使表面变脏的物质；不能随意用 a dirt 表一小块土。", "Wipe the dirt from your shoes.", "擦掉鞋上的污垢。", "The children drew lines in the dirt.", "孩子们在泥地上画线。"],
  ["suburb", "名词·郊区", "可数，常指城镇外围住宅区；不是远离城市的所有乡村，也不等同于中心商业区。", "She lives in a quiet suburb.", "她住在安静郊区。", "A tram connects the suburb to the centre.", "有轨电车连接郊区与市中心。"],
  ["outskirts", "复数名词·城郊边缘", "通常用 on the outskirts of，表示城镇外围地带；本身为复数，不说 an outskirt 表郊区。", "The factory stands on the outskirts of town.", "工厂位于城镇边缘。", "We camped near the outskirts of the village.", "我们在村庄边缘附近露营。"],
  ["pollution", "名词·污染", "通常不可数，指有害物质造成的环境损害或污染物；air pollution 指空气污染而非任何灰尘都同等有害。", "The project monitors water pollution.", "项目监测水污染。", "Traffic contributes to local air pollution.", "交通造成当地空气污染。"],
  ["geology", "名词·地质学", "通常不可数，可指研究地球岩石的学科或某地区地质特征；不同于 geography 地理学。", "She studies geology at college.", "她在大学学习地质学。", "The guide explains the valley's geology.", "指南解释山谷地质情况。"],
  ["gap", "名词·间隙", "可指物理空隙或抽象差距，常用 gap between；不一定意味着原物已经损坏。", "Leave a small gap between the boards.", "木板间留一道小缝。", "The course addresses a gap in his knowledge.", "课程弥补了他的一处知识空白。"],
  ["splendid", "形容词·极好的", "较强的褒义词，可形容壮丽外观或很好的经历；不必局限于物体尺寸宏大。", "The terrace offers a splendid view.", "露台景色极佳。", "We had a splendid afternoon at the museum.", "我们在博物馆度过了美好的下午。"],
  ["grand", "形容词·宏伟的", "可形容规模大而壮观，也可指重要盛大；a grand plan 不保证一定可行，需看实际条件。", "A grand staircase leads to the gallery.", "宏伟楼梯通往展厅。", "The hall hosted a grand celebration.", "大厅举办盛大庆典。"],
  ["super", "形容词·很棒的", "非正式表达，多用于轻松交谈评价事物；正式论证通常需更具体地说明优点。", "That was a super idea.", "那是个很棒的主意。", "We had a super time at the concert.", "我们在音乐会上玩得很开心。"],
  ["interesting", "形容词·有趣的", "描述事物能引起兴趣；人感到有兴趣用 interested，不能把两种结尾任意互换。", "The guide shared an interesting story.", "导游分享了一个有趣故事。", "I found the workshop interesting.", "我觉得工作坊很有意思。"],
  ["wilderness", "名词·荒野", "指较少耕作建设的自然区域，常用 the wilderness；不意味着那里没有原住民历史或生态价值。", "The trail enters a remote wilderness.", "小径进入一片偏远荒野。", "The photographs document life in the wilderness.", "照片记录荒野中的生活。"],
  ["desert", "名词·沙漠", "可数，指降水极少、植被稀少的地区，未必全是沙；作动词抛弃时重音位置不同。", "The caravan crossed a rocky desert.", "商旅队穿过岩石沙漠。", "Nights can be cold in the desert.", "沙漠夜晚可能很冷。"],
  ["fertilise", "动词·使受精", "英式拼写，美式 fertilize；生物义指生殖细胞结合引发发育，与向土壤施肥的农业义需区分。", "The diagram shows how sperm cells fertilise eggs.", "图示展示精子怎样使卵细胞受精。", "A sperm cell can fertilise an egg.", "精子可以使卵细胞受精。"],
  ["sunrise", "名词·日出", "可指太阳初升时间或景象，常用 at sunrise；与 sunset 日落不同，具体时间随地点季节变化。", "We reached the ridge before sunrise.", "我们在日出前到达山脊。", "The sunrise coloured the clouds pink.", "日出把云染成粉色。"],
  ["sunset", "名词·日落", "可指太阳从地平线消失的时间或景象，常用 at sunset；不等于夜已完全黑暗。", "The ferry returned at sunset.", "渡轮在日落时返回。", "We watched the sunset from the pier.", "我们从码头看日落。"],
  ["dusk", "名词·黄昏", "通常不可数，指日落附近天色渐暗时段；at dusk 表在黄昏，不同于黎明 dawn。", "The lamps came on at dusk.", "灯在黄昏亮起。", "Birds gathered in the trees as dusk fell.", "黄昏降临时鸟聚集在树上。"],
  ["heaven", "名词·天堂", "宗教义指被相信存在的神圣境界，也可比喻极乐；不同信仰概念有差别，不作为现实地理名称。", "The painting depicts angels in heaven.", "画作描绘天堂里的天使。", "The quiet garden felt like heaven.", "安静花园让人感觉像天堂。"],
  ["paradise", "名词·乐园", "可比喻极理想、幸福的地方，常用 a paradise for；也有宗教天堂义，不是正式生态分类。", "The island is a paradise for birdwatchers.", "这座岛是观鸟者的乐园。", "The shaded courtyard felt like paradise.", "阴凉庭院令人宛如置身乐园。"],
  ["sunshine", "名词·阳光", "通常不可数，指太阳照来的光与热，也可比喻快乐；说一缕阳光可用 a ray of sunshine。", "Sunshine streamed through the doorway.", "阳光从门口照入。", "The washing dried quickly in the sunshine.", "衣物在阳光下很快晾干。"],
  ["shadow", "名词·影子", "通常指光被遮挡形成的暗区，可数；与 shade 泛指阴凉有所区别，大小依光源位置改变。", "The tree cast a long shadow.", "树投下一道长影。", "A shadow moved across the wall.", "一个影子从墙上移过。"],
  ["vapour", "名词·蒸气", "英式拼写，美式 vapor，通常不可数；指气态物质时不一定肉眼可见，不能把所有白雾当纯气体。", "Water vapour condensed on the cold glass.", "水蒸气在冷玻璃上凝结。", "The instrument detects vapour in the chamber.", "仪器检测腔室内的蒸气。"],
  ["reservoir", "名词·水库", "可指储水湖或其他液体储存处，也可比喻储备；不是所有天然湖泊都用于供水。", "The reservoir supplies water to the town.", "水库为城镇供水。", "The path circles a small reservoir.", "小路环绕一座小水库。"],
  ["waterfall", "名词·瀑布", "可数，指水从较高处跌落到较低处的自然景观；不同于基本水平流动的河段。", "A waterfall drops into the pool below.", "瀑布跌入下方水潭。", "We heard the waterfall before we saw it.", "我们还没见到瀑布就先听见了它。"],
  ["spring", "名词·泉", "可指地下水流出的泉，也可指春季或弹簧；不能把多义词的各意义都套进同一个例句。", "A spring feeds the village pond.", "一眼泉水补给村中池塘。", "The spring flows beneath the old bridge.", "泉水从老桥下流过。"],
  ["dew", "名词·露水", "通常不可数，指表面凝结的小水滴，常见于夜间或清晨；不是从云中落下的雨。", "Dew covered the grass at dawn.", "黎明时露水覆盖草地。", "A drop of dew shone on the leaf.", "一滴露水在叶上发亮。"],
  ["gush", "动词·涌出", "常用 gush from 或 gush out，指快速大量流出；与缓慢渗出的 ooze 在速度和量上有区别。", "Water began to gush from the broken pipe.", "水开始从破管涌出。", "Warm air can gush through the open vent.", "暖空气能从敞开通风口涌出。"],
  ["intensity", "名词·强度", "可指可测的光声强度或感受强烈程度；不等同于持续时间，常用 intensity of。", "The sensor measures light intensity.", "传感器测量光强度。", "The storm increased in intensity.", "风暴强度增大了。"],
  ["intensive", "形容词·密集的", "表示短时间投入大量活动或精力；intensive course 是密集课程，不只是学习时间长期持续。", "She joined an intensive language course.", "她参加了密集语言课程。", "The project requires intensive preparation.", "项目需要集中充分准备。"],
  ["flash", "动词·闪光", "可指突然短暂发亮或让光闪烁；名词 a flash 则指一次闪光，不等于持续恒亮。", "The warning lights flash every few seconds.", "警示灯每几秒闪一次。", "Lightning can flash across the whole sky.", "闪电能划亮整片天空。"],
  ["float", "动词·漂浮", "可指浮在液面不下沉，也可指在空气中轻移；不等于物体本身一定比任何液体都轻。", "Dry leaves float on the pond.", "干叶漂在池塘上。", "We watched a balloon float above the trees.", "我们看着气球飘到树梢上方。"],
  ["environment", "名词·环境", "可指自然环境或工作生活条件；the environment 常指自然整体，某个特定环境则可数。", "The school provides a quiet learning environment.", "学校提供安静学习环境。", "The project aims to protect the environment.", "项目旨在保护环境。"],
  ["surrounding", "形容词·周围的", "修饰名词表示环绕某处的事物；不可与复数名词 surroundings 互换，不单独表示环境总称。", "The surrounding hills sheltered the village.", "周围山丘为村庄挡风。", "We explored the surrounding area on foot.", "我们步行探索周边地区。"],
  ["condition", "名词·状况", "可指事物状态，常用 in good condition；复数 conditions 常指环境条件，不能总按单一状况解释。", "The bicycle is in excellent condition.", "自行车状况极佳。", "The report describes the condition of the roof.", "报告描述屋顶状况。"],
  ["situation", "名词·情形", "可数，指某时某地发生的事情及所处条件；in this situation 表在这种情形下，不直接替代地点名。", "We need to assess the situation calmly.", "我们需要冷静评估情况。", "The situation improved after the road reopened.", "道路重开后情况改善了。"],
  ["nature", "名词·自然", "通常不可数，指自然界及其现象；the nature of 则可表示某事本质，冠词随含义变化。", "The reserve helps children learn about nature.", "保护区帮助孩子了解自然。", "She enjoys observing nature through the seasons.", "她喜欢观察四季自然变化。"],
  ["natural", "形容词·自然的", "可指自然形成或天生的，不表示所有天然物都安全；与 synthetic 合成的区别属于来源描述。", "The room has plenty of natural light.", "房间有充足自然光。", "The path follows a natural ridge.", "小路沿天然山脊延伸。"],
  ["synthetic", "形容词·合成的", "指人工合成材料或产品，常模仿天然物；不自动表示质量差，也不等同于伪造欺骗。", "The jacket uses synthetic fibres.", "外套使用合成纤维。", "The laboratory produced a synthetic pigment.", "实验室制成一种合成色素。"],
  ["petrol", "名词·汽油", "英式用语，通常不可数，美式多用 gasoline 或 gas；不等于原油 petroleum 或柴油 diesel。", "The car needs petrol before the trip.", "出行前汽车需要加汽油。", "The station sells petrol and diesel.", "加油站出售汽油和柴油。"],
  ["gas", "名词·气体", "可指非固非液的物态或燃气；美式口语还可指汽油，不能脱离地区与语境确定意思。", "The gas expanded inside the container.", "气体在容器内膨胀。", "The stove runs on gas.", "炉子使用燃气。"],
  ["respire", "动词·呼吸", "较正式或生物学用语，通常不及物；普通日常表达更常用 breathe，不直接当作说话的同义词。", "Fish respire through their gills.", "鱼通过鳃呼吸。", "The cells continue to respire in darkness.", "细胞在黑暗中继续呼吸。"],
  ["dioxide", "名词·二氧化物", "常与元素名组成化合物名，如 carbon dioxide；di- 表两个氧原子，但本词不专指二氧化碳。", "Carbon dioxide accumulated in the chamber.", "二氧化碳在腔室中积聚。", "The label lists titanium dioxide.", "标签列出二氧化钛。"],
  ["eco-friendly", "形容词·环保的", "通常带连字符，表示旨在减少环境损害；属于相对描述，不能仅凭标签断定完全无环境影响。", "The hotel promotes eco-friendly travel.", "酒店倡导环保出行。", "They chose eco-friendly packaging.", "他们选择了环保包装。"],
  ["genetics", "名词·遗传学", "虽然以 s 结尾，作学科名通常用单数谓语；研究遗传信息传递，不等同于所有生物学内容。", "Genetics is part of the course.", "遗传学是课程的一部分。", "She studies plant genetics.", "她研究植物遗传学。"],
  ["mutation", "名词·突变", "可数，指遗传信息发生的改变；并非所有突变有害，也不能把任何短暂生理变化都称突变。", "The study identified a rare mutation.", "研究识别出一种罕见突变。", "The mutation altered the flower's colour.", "突变改变了花的颜色。"],
  ["hybridisation", "名词·杂交", "英式拼写，通常不可数，对应 hybridization；指不同类型生物的杂交过程，不等同于任何普通繁殖。", "The project studies hybridisation in wild plants.", "项目研究野生植物的杂交。", "Hybridisation produced a new variety.", "杂交产生了一个新品种。"],
  ["pick", "动词·挑选", "可指挑选或采摘，pick out 常强调选出；捡起通常用 pick up，不能随意省掉小品词。", "Pick a card from the box.", "从盒里选一张卡片。", "We can pick apples in the orchard.", "我们可以在果园采苹果。"],
  ["arable", "形容词·可耕的", "修饰适于或用于种植作物的土地；与主要供放牧的牧地 pasture 不完全相同。", "The valley contains valuable arable land.", "山谷中有宝贵耕地。", "The survey maps arable fields.", "调查绘制可耕田地分布。"],
  ["plough", "名词·犁", "英式拼写，对应美式 plow，可作动词耕地；不是所有农业工具或收割机的通称。", "The old plough stood beside the barn.", "旧犁放在谷仓旁。", "Farmers use a plough to turn the soil.", "农民用犁翻土。"],
  ["spade", "名词·锹", "指带平叶和长柄的挖土工具；不是把地面碎屑聚拢的 rake，也有扑克牌黑桃义。", "He dug the hole with a spade.", "他用锹挖坑。", "The spade leaned against the shed.", "锹靠在棚屋上。"],
  ["rake", "名词·耙子", "指有一排齿、用于平土或收集落叶的长柄工具；与挖土的 spade 或除草 hoe 有别。", "Use a rake to gather the leaves.", "用耙子收集落叶。", "The rake is hanging on the wall.", "耙子挂在墙上。"],
  ["vase", "名词·花瓶", "可数，通常用于插切花或装饰；不等同于有排水孔、供植物扎根的 flowerpot。", "She placed the lilies in a vase.", "她把百合放进花瓶。", "The ceramic vase stood by the window.", "陶瓷花瓶放在窗边。"],
  ["sunlight", "名词·日光", "通常不可数，指来自太阳的光；direct sunlight 表直射阳光，不一定同时强调感受温暖。", "Sunlight fell across the wooden floor.", "日光洒在木地板上。", "Keep the photograph out of direct sunlight.", "避免照片受到阳光直射。"],
  ["short-day", "形容词·短日照的", "植物学中指对较短光周期作反应的特征；临界日长因物种而异，不应一律规定为十二小时。", "The gardener selected short-day plants.", "园丁选择了短日照植物。", "The experiment compared short-day flowering responses.", "实验比较短日照开花反应。"],
  ["shade-tolerant", "形容词·耐阴的", "带连字符，指能够在较阴暗条件生长；耐阴不等于完全不需要光或适合永久无光。", "The bed contains shade-tolerant plants.", "花坛里种着耐阴植物。", "This shade-tolerant fern grows beneath the trees.", "这种耐阴蕨长在树下。"],
  ["fungus", "名词·真菌", "可数，复数 fungi 或 funguses；真菌不是植物的普通同义词，也不是所有真菌都导致疾病。", "A fungus grew on the fallen branch.", "倒下的树枝上长出一种真菌。", "The laboratory identified the fungus.", "实验室鉴定了这种真菌。"],
  ["mould", "名词·霉菌", "英式拼写，对应美式 mold，可指潮湿处霉斑，也可指铸型；此处用生长在物体表面的霉菌义。", "Mould appeared on the damp wall.", "潮湿墙面出现霉斑。", "The bread was covered with mould.", "面包长满霉菌。"],
  ["seed", "名词·种子", "植物义可数，指可长出新植物的结构；a packet of seed 中也可集合使用，不等于花粉 pollen。", "A seed sprouted in the damp soil.", "一粒种子在湿土中萌发。", "Press each seed gently into the compost.", "把每粒种子轻轻压进堆肥土中。"],
  ["burgeon", "动词·迅速发展", "偏正式，通常不及物，描述快速生长或扩展；不直接接宾语表示使某物长大。", "New businesses began to burgeon near the station.", "车站附近新企业开始迅速涌现。", "Interest in the craft continued to burgeon.", "人们对这门手艺的兴趣持续增长。"],
  ["flower", "名词·花", "可指植物开花部分或开花植物，通常可数；作动词则是开花或发展成熟，需分清词性。", "A yellow flower opened beside the path.", "小路旁开出一朵黄花。", "The flower attracted several bees.", "这朵花吸引了几只蜜蜂。"],
  ["ripen", "动词·成熟", "可及物或不及物，常用于果实逐渐适于食用；不只是体积增大，也不等于腐烂。", "The peaches ripen near the end of summer.", "桃子在夏末成熟。", "Leave the fruit indoors to ripen.", "把水果放在室内催熟。"],
  ["fruit", "名词·水果果实", "日常泛指水果通常不可数，种类可用 fruits；植物学 fruit 指含种子的结构，范围与烹饪分类不同。", "Fresh fruit filled the basket.", "篮子里装满新鲜水果。", "The flower developed into a small fruit.", "花发育成一颗小果实。"],
  ["wither", "动词·枯萎", "可及物或不及物，描述植物失水干枯变弱；也可比喻影响力消退，不是所有季节落叶都属枯萎。", "The leaves began to wither in the heat.", "叶子在高温下开始枯萎。", "Without water, these seedlings will wither.", "没有水，这些幼苗会枯萎。"],
  ["stale", "形容词·不新鲜的", "可形容食物放久失去新鲜口感，也可形容想法陈旧；不一定表示已腐败或必然有毒。", "The bread tasted stale.", "面包尝起来不新鲜。", "Open the window to clear the stale air.", "开窗换掉污浊空气。"],
  ["rainforest", "名词·雨林", "可数，通常指降雨丰富而植被茂密的森林；不是一次降雨后普通树林的名称。", "The trail enters dense rainforest.", "小路进入茂密雨林。", "The reserve protects a large rainforest.", "保护区保护着一大片雨林。"],
  ["jungle", "名词·丛林", "常指热带茂密树林，也可比喻混乱复杂的事物；不要把所有森林都固定翻译为 jungle。", "The path disappeared into the jungle.", "小路隐入丛林。", "Bird calls echoed through the jungle.", "鸟鸣在丛林回响。"],
  ["field", "名词·田地", "可指供种植或放牧的土地，也可指专业领域；in the field 还可指实际现场，须按语境确定。", "The field was planted with barley.", "田里种着大麦。", "A stone wall surrounds the field.", "石墙围着田地。"],
  ["logo", "名词·标志", "可数，指机构或产品用于识别的图形设计；不同于整套品牌体系，也不保证该图形已注册商标。", "The logo appears on every ticket.", "每张票都有这个标志。", "She designed a logo for the club.", "她为俱乐部设计了标志。"],
  ["forestry", "名词·林业", "通常不可数，指森林种植、管理和保护相关活动或学科；不是所有与木头有关的手工艺。", "He studied forestry at college.", "他在大学学习林业。", "The region has a forestry training centre.", "该地区有林业培训中心。"],
  ["bough", "名词·粗树枝", "可数，通常指树上较大的枝条，语气稍文学化；与更细的 twig 在大小上有区别。", "A heavy bough stretched over the path.", "一根粗枝伸到小路上方。", "Snow weighed down the pine bough.", "积雪压弯松树粗枝。"],
  ["root", "名词·根", "植物义指吸收水分并固定植株的结构；the root of a problem 比喻根源，不表示任何关联都为根因。", "A root pushed through the cracked pot.", "一条根从破花盆中伸出。", "We traced the root of the problem.", "我们追查了问题根源。"],
  ["straw", "名词·稻草麦秆", "作为干作物茎秆通常不可数；a straw 则常指吸管，不能把材料义与一根吸管混译。", "The roof is covered with straw.", "屋顶覆盖稻草。", "She sipped juice through a paper straw.", "她用纸吸管喝果汁。"],
  ["reed", "名词·芦苇", "可指水边生长的高秆植物，也可指乐器簧片；a reed 与 reed bed 应按乐器或湿地场景判断。", "A reed swayed beside the pond.", "一株芦苇在池边摇摆。", "The musician replaced the clarinet reed.", "乐手更换了单簧管簧片。"],
  ["grass", "名词·草", "泛指草通常不可数，单根可说 a blade of grass；grasses 也可表示不同草种。", "Grass grew between the paving stones.", "草从铺路石缝中长出。", "A blade of grass stuck to my boot.", "一片草叶粘在我的靴子上。"],
  ["olive", "名词·橄榄", "可指果实或树，具体计数依所指对象；olive oil 是橄榄油，不是任何绿色食用油。", "She added an olive to the salad.", "她往沙拉里加了一颗橄榄。", "An old olive tree shaded the terrace.", "一棵老橄榄树为露台遮阴。"],
  ["pine", "名词·松树", "树为可数，木材义通常不可数；pine for 作为动词短语还可表苦苦思念，与植物义不同。", "A tall pine grows behind the cabin.", "小木屋后长着一棵高松树。", "The table is made of pine.", "桌子用松木制成。"],
  ["tulip", "名词·郁金香", "可指球茎植物或其花，通常可数；不等同于所有杯状花朵，需要按植物种类辨认。", "A red tulip opened by the gate.", "门旁开出一朵红郁金香。", "She drew the curved petals of the tulip.", "她画下郁金香弯曲的花瓣。"],
  ["mint", "名词·薄荷", "植物或香草材料通常不可数，也可指薄荷糖或铸币厂；须从食物、植物或货币场景区分。", "Fresh mint flavoured the tea.", "新鲜薄荷给茶增添香味。", "The gardener planted mint beside the path.", "园丁在小路旁种薄荷。"],
  ["alga", "名词·藻", "是单数形式，复数 algae；指藻类中的一个个体或种类，不能把 algae 再加 s 当复数。", "The microscope revealed a tiny alga.", "显微镜显示一株微小藻体。", "This alga grows in shallow water.", "这种藻生长在浅水中。"],
  ["emission", "名词·排放", "可指发出气体、热或光的过程，也可指排出的量；常用复数 emissions 讨论各类排放。", "The sensor measures the emission of light.", "传感器测量光的发射。", "The factory recorded a reduction in emission levels.", "工厂记录到排放水平下降。"],
  ["circulation", "名词·流通循环", "可指信息、货币等传播，也可指血液循环或报刊发行；in circulation 表正在流通，不等于发行总量。", "The report is now in circulation.", "报告现在已在传阅。", "The exercise encourages air circulation.", "这项操作促进空气流通。"],
  ["uptake", "名词·吸收采用", "通常不可数，可指吸收水分物质或接受服务的比例；不是所有向上移动都能译为 uptake。", "The roots control water uptake.", "根系控制水分吸收。", "The survey measured uptake of the new service.", "调查衡量新服务的采用情况。"],
  ["energy", "名词·能量精力", "通常不可数，可指物理能量或人的活动精力；不等于瞬时功率 power，也不写 an energy 泛指一点精力。", "The battery stores energy.", "电池储存能量。", "She had enough energy for another walk.", "她还有精力再散一次步。"],
  ["surroundings", "复数名词·周边环境", "指人或物周围的地点与条件，通常用复数谓语；不同于作定语的 surrounding。", "The surroundings are peaceful.", "周围环境很宁静。", "Give the plant time to adjust to its surroundings.", "给植物时间适应周围环境。"],
  ["bush fire", "名词短语·灌木林火", "此词条分开写，常也写 bushfire，指野地植被火灾；不是仅在炉中受控燃烧的火。", "A bush fire closed the road.", "一场灌木林火迫使道路关闭。", "The crew monitored the bush fire overnight.", "工作人员整夜监测灌木林火。"],
  ["extinguish", "动词·熄灭", "直接接火、火焰等，表示使不再燃烧，也可比喻使希望消失；与点火 ignite 意义相反。", "The rain helped extinguish the small fire.", "雨有助于扑灭小火。", "Please extinguish the candle before leaving.", "离开前请熄灭蜡烛。"],
  ["destruct", "动词·摧毁", "这个独立动词较少见，日常一般用 destroy；常见 self-destruct 表自行毁坏，不能把 destruct 当作所有场合的普通替代词。", "The command will destruct the rocket if it veers off course.", "如果火箭偏离航线，这条指令会将其摧毁。", "The controller can destruct the test rocket.", "控制器能够摧毁试验火箭。"],
  ["perish", "动词·死亡损毁", "偏正式或文学化，常指因灾难死亡；材料语境可指老化破损，不是普通离开某地。", "Plants may perish during a severe drought.", "严重干旱时植物可能死亡。", "Rubber seals can perish with age.", "橡胶密封件会随时间老化。"],
  ["demolish", "动词·拆毁", "直接接建筑，表示彻底拆除；也可比喻有力驳倒论点，不等同于一般维修或小幅损坏。", "Workers will demolish the unsafe warehouse.", "工人将拆除不安全的仓库。", "The evidence may demolish his argument.", "证据可能彻底驳倒他的论点。"],
  ["extinction", "名词·灭绝", "通常不可数，指物种或事物完全不复存在；区域内减少不一定等于全球灭绝。", "The species faces extinction.", "这个物种面临灭绝。", "The exhibit explains the causes of extinction.", "展览解释灭绝的原因。"],
  ["outcome", "名词·结果", "可数，指行动或事件产生的结果；不同于预先设定的目标，最终结果可能偏离计划。", "The outcome depends on the weather.", "结果取决于天气。", "We recorded the outcome of each trial.", "我们记录了每次试验的结果。"],
  ["seasonal", "形容词·季节性的", "指与一年中特定季节相关或届时发生；seasonal work 不保证全年都有同样工作量。", "The shop sells seasonal fruit.", "店铺出售时令水果。", "Tourism creates seasonal jobs in the village.", "旅游业给村里创造季节性工作。"],
  ["favourable", "形容词·有利的", "英式拼写，对应 favorable，可表示赞成或条件有利；常用 favourable to 或 for，需按所接意义选择。", "The weather was favourable for sailing.", "天气有利于航行。", "The exhibition received favourable reviews.", "展览获得好评。"],
  ["minimal", "形容词·极少的", "表示数量或程度很小，常修饰 cost、effort；不一定恰好为数学上可达到的最小值。", "The repair caused minimal disruption.", "维修造成的干扰很小。", "The design requires minimal maintenance.", "这项设计只需很少维护。"],
  ["optimal", "形容词·最佳的", "表示在特定条件下最有利或最有效；最佳标准依目标而定，不是普遍适用于一切场景。", "The greenhouse maintains optimal growing conditions.", "温室维持最佳生长条件。", "We searched for the optimal route.", "我们寻找最优路线。"],
  ["biologist", "名词·生物学家", "可数，指研究生物的科学家；具体专业可能是植物、动物等，不等于所有医生的职业名称。", "A biologist examined the pond samples.", "生物学家检查池塘样本。", "The biologist described a new observation.", "生物学家描述了一项新观察。"],
  ["zoologist", "名词·动物学家", "指科学研究动物的人；不等同于照顾动物园日常饲养工作的 keeper，尽管职责可能合作。", "The zoologist observed the herd quietly.", "动物学家安静观察兽群。", "A visiting zoologist led the discussion.", "来访动物学家主持讨论。"],
  ["botanist", "名词·植物学家", "指研究植物的科学家，可数；不同于种植花园的 gardener，也不自动意味着研究所有生物。", "The botanist identified the fern.", "植物学家鉴定了那株蕨。", "A botanist collected seeds for the study.", "植物学家为研究收集种子。"],
  ["creature", "名词·生物", "常指动物，也可用于想象中的生命体；可数，不能一概当作包括任何非生物物件的 thing。", "A tiny creature moved beneath the leaf.", "一个小生物在叶下活动。", "The story describes a strange sea creature.", "故事描述一种奇怪海洋生物。"],
  ["wildlife", "名词·野生生物", "通常不可数，常指自然生活的野生动物；不写 a wildlife 表一只动物，应说 a wild animal。", "The reserve protects local wildlife.", "保护区保护当地野生生物。", "We watched wildlife from the observation hide.", "我们从隐蔽观察棚观看野生动物。"],
  ["throng", "名词·人群", "指大量聚集的人，常用 a throng of；较 crowd 稍有文学色彩，不常指少数三两个人。", "A throng of visitors waited outside.", "一大群游客在外面等候。", "The guide led us through the throng.", "导游带我们穿过人群。"],
  ["crowd", "名词·人群", "可数，指聚集的大群人，也可泛指某圈子；a crowd of 后接人群成员，不等于任意动物群。", "A crowd gathered beside the stage.", "一群人聚集在舞台旁。", "The crowd cheered when the band arrived.", "乐队到来时人群欢呼。"],
  ["brute", "名词·粗暴的人", "用于人时常含野蛮粗暴的强烈贬义，亦可在文学中指动物；不宜作为普通陌生人的中性称呼。", "The story portrays the guard as a brute.", "故事把守卫描绘成粗暴的人。", "He behaved like a brute toward the visitors.", "他粗暴地对待来访者。"],
  ["cruel", "形容词·残忍的", "可形容有意造成痛苦的人或行为，也可形容造成苦难的事件；cruel to 后接受虐待对象。", "It is cruel to abandon an animal.", "遗弃动物是残忍的。", "The novel exposes a cruel punishment.", "小说揭露一种残酷惩罚。"],
  ["subgroup", "名词·子群体", "指较大群体中有特定共同特征的一部分；仍属原群体，并非完全独立而毫无关联。", "The study analysed each subgroup separately.", "研究分别分析每个子群体。", "We formed a subgroup to review the drawings.", "我们成立一个小组审查图纸。"],
  ["interbreed", "动词·杂交繁殖", "可指不同品种或群体之间繁殖，也可及物；是否能产生后代及其可育性须看具体生物。", "These two varieties can interbreed.", "这两个品种可以杂交。", "The populations rarely interbreed in the wild.", "这些种群在野外很少杂交。"],
  ["hybridize", "动词·杂交", "美式拼写，对应 hybridise，可及物或不及物；不表示任意两种生物都能够成功杂交。", "The researchers hybridize related varieties.", "研究人员让近缘品种杂交。", "These plants can hybridize naturally.", "这些植物能够自然杂交。"],
  ["sterility", "名词·不育", "可指无法繁殖，也可指无菌状态或想象力贫乏；不同专业语境不能只按一种意思翻译。", "The study examined sterility in the hybrid plants.", "研究考察杂交植物的不育。", "The paper discusses the causes of sterility.", "论文讨论不育原因。"],
  ["mate", "名词·配偶", "动物语境指交配伙伴，英式口语也可指朋友；具体意义依生物或交往场景确定。", "The bird returned to its mate.", "鸟回到伴侣身边。", "The male searched for a mate near the pond.", "雄性动物在池边寻找伴侣。"],
  ["lay", "动词·放置产卵", "lay something 表放下某物，过去式 laid；动物产卵也用 lay，不要与 lie 躺的变化形式混淆。", "Lay the map on the table.", "把地图摊放在桌上。", "These birds lay eggs in shallow nests.", "这些鸟在浅巢中产卵。"],
  ["brood", "名词·一窝幼鸟", "可数，指同时孵出的一窝幼鸟，也可幽默地指一群孩子；作动词另表示闷闷地想。", "The hen watched over her brood.", "母鸡看护一窝雏鸡。", "A brood of ducklings followed the mother.", "一窝小鸭跟着母鸭。"],
  ["skin", "名词·皮肤", "可指人或动物外层，也可指水果皮；是否可数依整张皮或作为身体组织的用法决定。", "The fruit has a thin skin.", "这种水果有薄皮。", "Cold wind made her skin feel dry.", "冷风使她皮肤感觉干燥。"],
  ["claw", "名词·爪", "可指动物尖弯指甲，也可指蟹等的螯；不是整个脚 paw 的完全同义词。", "A claw caught in the fabric.", "一只爪子钩住了布。", "The crab raised a large claw.", "蟹举起一只大螯。"],
  ["paw", "名词·兽爪", "指猫狗熊等有爪或趾甲的脚；claw 更具体指尖爪，两者不能在所有场合互换。", "The dog lifted one paw.", "狗抬起一只爪子。", "A muddy paw left a print on the floor.", "一只泥爪在地板留下印迹。"],
  ["fin", "名词·鳍", "可指鱼用于平衡运动的鳍，也可指飞机类似结构；不同于海豹的鳍肢 flipper。", "A fin broke the surface of the water.", "一片鳍露出水面。", "The fish moved its tail fin slowly.", "鱼慢慢摆动尾鳍。"],
  ["wing", "名词·翅膀", "可指鸟虫飞行器官或飞机机翼，通常可数；不表示所有有翼动物都能飞行。", "The bird stretched one wing.", "鸟伸展一只翅膀。", "A mechanic inspected the aircraft's wing.", "技师检查飞机机翼。"],
  ["feather", "名词·羽毛", "可数，指鸟体表的一根羽毛；不同于哺乳动物的 fur，不能把任何柔软毛都称 feather。", "A white feather lay on the grass.", "草上有一根白羽毛。", "The child drew each feather carefully.", "孩子仔细画出每根羽毛。"],
  ["fur", "名词·兽毛", "通常不可数，指某些哺乳动物浓密毛被，也可指毛皮；与同音 fir 冷杉不同。", "The rabbit has soft fur.", "兔子有柔软皮毛。", "Mud clung to the dog's fur.", "泥粘在狗毛上。"],
  ["bristle", "名词·硬毛", "可指短硬毛或刷子的毛丝；可数，复数 bristles 常用于刷毛，不是柔顺长毛的常用词。", "A bristle fell from the old brush.", "旧刷子掉下一根刷毛。", "The animal has a stiff bristle above its eye.", "动物眼睛上方有一根硬毛。"],
  ["curl", "名词·卷发卷曲物", "可指一绺卷发或类似卷曲形状的物体；也可作动词卷曲，不能只按头发理解所有用法。", "A curl fell across her forehead.", "一绺卷发垂在她额前。", "A curl of smoke rose from the chimney.", "一缕卷曲烟雾从烟囱升起。"],
  ["insect", "名词·昆虫", "严格生物义指六足、身体分头胸腹的动物；蜘蛛是八足动物，不能在科学说明中当成昆虫。", "A tiny insect landed on the page.", "一只小昆虫落在书页上。", "The diagram shows the six legs of the insect.", "图示展示昆虫的六条腿。"],
  ["worm", "名词·蠕虫", "常指身体细长柔软、无肢的动物，也可用于某些幼虫；不是所有长形动物都属于同一分类。", "A worm moved through the damp soil.", "一条虫在湿土里移动。", "The bird pulled a worm from the ground.", "鸟从地里拉出一条虫。"],
  ["spider", "名词·蜘蛛", "可数，属于八足蛛形动物，不能在科学语境说成六足昆虫；并非每种蜘蛛都结网捕食。", "A spider crossed the windowsill.", "一只蜘蛛爬过窗台。", "The spider repaired its web.", "蜘蛛修补蛛网。"],
  ["butterfly", "名词·蝴蝶", "指有较大翅膀的一类昆虫，可数；与同属鳞翅目的 moth 蛾常有区别，不能只靠亮色绝对判断。", "A butterfly landed on the lavender.", "一只蝴蝶落在薰衣草上。", "The butterfly folded its wings.", "蝴蝶合拢翅膀。"],
  ["mosquito", "名词·蚊子", "可数，复数 mosquitoes 或 mosquitos；吸血习性取决于性别及物种，不宜笼统说每只蚊子都会吸血。", "A mosquito rested on the net.", "一只蚊子停在蚊帐上。", "The screen kept the mosquito outside.", "纱窗把蚊子挡在外面。"],
  ["cricket", "名词·蟋蟀", "可指鸣叫的昆虫，也可指板球运动；昆虫为可数名词，运动名通常不可数。", "A cricket chirped beside the steps.", "一只蟋蟀在台阶旁鸣叫。", "We found a cricket under the flowerpot.", "我们在花盆下发现一只蟋蟀。"],
  ["penguin", "名词·企鹅", "可数，指不会飞、善游泳的海鸟；主要分布南半球，不要一概说生活在北极。", "A penguin dived into the water.", "一只企鹅潜入水中。", "The penguin balanced on the rock.", "企鹅在岩石上保持平衡。"],
  ["tortoise", "名词·陆龟", "通常指主要在陆地生活的龟，英语地区分类用法有差异；不能把所有 turtle 都理解为陆龟。", "The tortoise crossed the garden slowly.", "陆龟慢慢穿过花园。", "The keeper weighed the tortoise.", "饲养员给陆龟称重。"],
  ["turtle", "名词·龟", "英式常用于水栖龟，美式可泛指各种龟；不要据一个地区用法断言所有 turtle 都住海里。", "A turtle surfaced beside the boat.", "一只龟在船旁浮出水面。", "The turtle rested on a warm log.", "龟在温暖木头上休息。"],
  ["whale", "名词·鲸", "可数，指生活在水中的哺乳动物；鲸需要呼吸空气，不能把它当鱼或认为可永久不换气。", "A whale surfaced beyond the boat.", "一头鲸在船远处浮出水面。", "The guide identified the whale by its tail.", "导游根据尾部认出这头鲸。"],
  ["kangaroo", "名词·袋鼠", "可数，指澳大利亚一类后腿强壮的有袋动物；并非所有澳大利亚跳跃动物都可互称袋鼠。", "A kangaroo rested beneath the tree.", "一只袋鼠在树下休息。", "The kangaroo crossed the track in a few leaps.", "袋鼠几次跳跃就穿过小道。"],
  ["camel", "名词·骆驼", "可数，常指有一或两座驼峰的大型动物；驼峰主要储脂，不应在学习提示中说成装水的袋子。", "A camel knelt beside the camp.", "一头骆驼跪在营地旁。", "The camel carried supplies across the sand.", "骆驼驮着补给穿过沙地。"],
  ["panda", "名词·大熊猫", "通常指以竹子为主要食物的黑白色熊类；red panda 指小熊猫，不能与大熊猫混为同种。", "The panda held a bamboo stem.", "大熊猫抱着一根竹子。", "The keeper prepared food for the panda.", "饲养员给大熊猫准备食物。"],
  ["elephant", "名词·象", "可数，指有长鼻的大型哺乳动物；非洲象与亚洲象等有差异，学习例句不把单一特征误当所有个体必有。", "An elephant stood in the shade.", "一头象站在阴凉处。", "The elephant lifted a branch with its trunk.", "象用鼻子卷起一根树枝。"],
  ["wolf", "名词·狼", "可数，犬科野生动物，复数 wolves；不要写 wolfs，也不能把所有外形似狗的动物都称狼。", "A wolf appeared at the edge of the forest.", "一只狼出现在森林边缘。", "The camera tracked a lone wolf.", "相机追踪一只独行狼。"],
  ["dragon", "名词·龙", "常指神话中的想象生物，不同文化形象差别大；英文某些动物名中 dragon 也可指蜥蜴。", "A dragon appears in the festival story.", "节日故事中出现一条龙。", "The child painted a green dragon.", "孩子画了一条绿龙。"],
  ["fox", "名词·狐狸", "可数，指尖脸蓬尾的犬科动物；并非每种狐狸都是红褐色，不宜仅凭颜色作绝对定义。", "A fox slipped beneath the hedge.", "一只狐狸钻过树篱。", "The fox paused beside the gate.", "狐狸在门旁停下。"],
  ["cub", "名词·幼兽", "常用于熊、狮、狼等的幼崽，不是所有动物幼体都叫 cub；具体物种可放在前面修饰。", "A bear cub followed its mother.", "一只小熊跟着母亲。", "The cub slept beside a fallen log.", "幼兽睡在倒木旁。"],
  ["calf", "名词·幼牛", "可指牛及象鲸等大型哺乳动物幼体，复数 calves；也有小腿义，需按动物或人体语境区分。", "The calf stood close to the cow.", "小牛紧挨着母牛站着。", "A whale calf swam beside its mother.", "一头幼鲸在母亲身边游泳。"],
  ["pup", "名词·幼崽", "用于狗或海豹等特定动物幼体，可数；不能任意替代所有动物名称后的 baby。", "The seal pup rested on the beach.", "海豹幼崽在海滩休息。", "The pup followed the keeper into the yard.", "幼犬跟着饲养员进入院子。"],
  ["lamb", "名词·羊羔", "指幼羊时可数，指羊羔肉时通常不可数；不等同于成年羊或所有山羊幼体。", "A lamb stood beside the ewe.", "一只羊羔站在母羊旁。", "The farmer carried the lamb into the barn.", "农夫把羊羔抱进畜棚。"],
  ["ox", "名词·役牛", "通常指用于牵引的牛，复数 oxen；不能按一般名词规则写 oxes，也不等于只指幼牛。", "An ox pulled the wooden cart.", "一头牛拉着木车。", "The farmer guided the ox along the track.", "农夫领着牛沿小道走。"],
  ["horse", "名词·马", "可数，指可供骑乘或牵引的大型动物；ride a horse 是骑马，不用 drive 表人在马背上骑乘。", "The horse drank from the trough.", "马从水槽喝水。", "She led the horse into the stable.", "她把马牵进马厩。"],
  ["zebra", "名词·斑马", "可数，指有条纹的非洲马科动物；不同种类条纹有差异，不把它当作涂了条纹的家马。", "A zebra grazed near the waterhole.", "一匹斑马在水潭附近吃草。", "The zebra turned toward the herd.", "斑马转向兽群。"],
  ["donkey", "名词·驴", "可数，指长耳、通常小于马的动物；与由马和驴杂交产生的 mule 骡不同。", "The donkey carried baskets up the hill.", "驴驮着篮子上山。", "A donkey waited beside the stone wall.", "一头驴在石墙旁等着。"],
  ["saddle", "名词·鞍座", "可指马鞍或自行车座，可数；具体对象常由 horse 或 bicycle 明确，不只是任意椅子。", "She placed the saddle on the horse.", "她把马鞍放到马背上。", "The bicycle saddle needs adjusting.", "自行车座需要调整。"],
  ["falcon", "名词·隼", "指尖翼、善捕猎的一类猛禽；不能把所有鹰隼类或所有训练过的鸟都叫 falcon。", "The falcon landed on a high ledge.", "隼落在高处岩架上。", "A falcon circled above the cliffs.", "一只隼在悬崖上方盘旋。"],
  ["eagle", "名词·鹰", "可数，指大型强壮猛禽，也有高尔夫球术语义；不等于任何体形大的鸟。", "An eagle perched on the dead tree.", "一只鹰栖在枯树上。", "The eagle spread its broad wings.", "鹰展开宽阔翅膀。"],
  ["owl", "名词·猫头鹰", "指面盘明显的一类猛禽，多数夜间活动；不要把多数习性写成所有物种都绝无例外。", "An owl watched from the barn roof.", "一只猫头鹰从谷仓屋顶注视着。", "The owl turned its head toward the sound.", "猫头鹰把头转向声音传来的方向。"],
  ["swallow", "动词·吞咽", "直接接食物或饮料，表示从口经喉进入胃；名词 swallow 也指燕子，应按句法区分。", "Swallow the water slowly.", "慢慢把水咽下去。", "He paused to swallow before answering.", "他先停下来咽了一口，再回答。"],
  ["pigeon", "名词·鸽子", "可数，常见于城市的一类鸟，也可饲养竞翔；不必每只都是灰色或承担送信任务。", "A pigeon landed on the railing.", "一只鸽子落在栏杆上。", "The pigeon carried a twig in its beak.", "鸽子嘴里衔着一根细枝。"],
  ["sparrow", "名词·麻雀", "可数，指常见的小型灰褐色鸟类；不是所有体形小的褐色鸟都属于麻雀。", "A sparrow hopped beneath the bench.", "一只麻雀在长椅下跳动。", "The sparrow picked up a seed.", "麻雀叼起一粒种子。"],
  ["swan", "名词·天鹅", "可数，长颈大型水鸟，多数熟悉种类为白色但也有黑天鹅；不能把白色当作绝对定义。", "A swan glided across the lake.", "一只天鹅滑过湖面。", "The swan lifted its long neck.", "天鹅抬起长颈。"],
  ["goose", "名词·鹅", "指一种大型水鸟，复数 geese；指肉时常不可数，不写 gooses 表多只鹅。", "A goose stood beside the pond.", "一只鹅站在池边。", "The goose spread its wings.", "鹅展开翅膀。"],
  ["cock", "名词·公鸡", "可指成年雄鸡，也可与鸟名组合表示雄鸟；另有粗俗义，日常需要明确时 rooster 更清楚。", "The cock crowed before dawn.", "公鸡在黎明前打鸣。", "A cock stood on the farmyard fence.", "一只公鸡站在农家院围栏上。"],
  ["mouse", "名词·老鼠鼠标", "动物义复数 mice，设备义 mice 也常用；不能把 rat 大鼠与 mouse 小鼠在所有场合互换。", "A mouse hid beneath the cupboard.", "一只小鼠躲在橱柜下。", "The wireless mouse needs a new battery.", "无线鼠标需要更换电池。"],
  ["rat", "名词·大鼠", "可数，通常指体形大于 mouse 的鼠类；用作称呼人的词时可带背叛者等冒犯含义。", "A rat ran along the warehouse wall.", "一只大鼠沿仓库墙跑过。", "The camera recorded a rat near the drain.", "相机记录到排水口旁的一只大鼠。"],
  ["frog", "名词·蛙", "可数两栖动物，成体常具强后腿；不能因常见绿色便断定所有蛙都为绿色。", "A frog jumped into the pond.", "一只蛙跳进池塘。", "The frog rested on a wet stone.", "蛙停在湿石头上。"],
  ["behaviour", "名词·行为", "英式拼写，对应 behavior，泛指行为方式通常不可数；专业讨论具体行为模式时可见复数。", "The study records animal behaviour.", "研究记录动物行为。", "Her behaviour during the visit was considerate.", "她访问期间行为体贴。"],
  ["roar", "动词·吼叫", "描述长而低沉的大声，可用于动物、车辆或人群；与轻微短促叫声不同，可及物或不及物。", "We heard a lion roar in the distance.", "我们听见远处狮子吼叫。", "Engines roar above the runway.", "发动机在跑道上方轰鸣。"],
  ["crawl", "动词·爬行", "可指人用手膝移动、动物贴地移动，也可比喻交通极慢；不能只理解为昆虫运动。", "The baby began to crawl toward the toy.", "婴儿开始爬向玩具。", "Cars crawl through the narrow street.", "汽车在窄街上缓慢前行。"],
  ["hive", "名词·蜂巢", "可指蜜蜂居所或人工蜂箱，也可借指蜂群；不同于鸟巢 nest 的一般用法。", "Bees gathered at the entrance to the hive.", "蜜蜂聚在蜂箱入口。", "The keeper inspected the hive carefully.", "养蜂人仔细检查蜂箱。"],
  ["hedge", "名词·树篱", "可指密植成排的灌木，也可指规避风险的方法；园艺语境不含金融对冲义。", "The hedge separates the two gardens.", "树篱分隔两个花园。", "A robin perched on the hedge.", "一只知更鸟栖在树篱上。"],
  ["bar", "名词·长条", "可指硬质长条，也可指酒吧或障碍；a bar of soap 指一块肥皂，须按搭配判断。", "A metal bar blocked the doorway.", "一根金属条挡住门口。", "She bought a bar of soap.", "她买了一块肥皂。"],
  ["epidemic", "名词·流行病", "可数，指某疾病在一定人群和时期异常多发；不等同于一例感染，也不同于全球大流行 pandemic。", "The archive documents a historical epidemic.", "档案记录了一场历史流行病。", "The epidemic disrupted travel across the region.", "流行病扰乱整个地区的出行。"],
  ["germ", "名词·病菌", "日常常指能引起疾病的微小生物，也可比喻想法萌芽；不是所有微生物都为有害 germ。", "The diagram shows a disease-causing germ.", "图示显示一种致病病菌。", "This conversation contained the germ of a new idea.", "这次谈话蕴含一个新想法的萌芽。"],
  ["bacteria", "复数名词·细菌", "是 bacterium 的复数，标准用法用复数谓语；细菌中既有有益也有有害成员，不能全称病菌。", "Bacteria were present in the sample.", "样本中有细菌。", "The study examined bacteria in the soil.", "研究考察土壤中的细菌。"],
  ["microbe", "名词·微生物", "可数，指非常微小的生物，日常常用于病菌语境；不能由此断言每种 microbe 都致病。", "The microscope revealed a tiny microbe.", "显微镜显示一个微小微生物。", "The laboratory identified the microbe.", "实验室鉴定了这种微生物。"],
  ["intuitive", "形容词·直觉的", "可指凭直觉判断，也可形容设计容易理解使用；直觉印象不等于已有事实证明。", "The map has an intuitive layout.", "地图布局直观。", "Her answer was intuitive rather than carefully calculated.", "她的回答出于直觉，而不是仔细计算。"],
  ["intuition", "名词·直觉", "指无需明确推理即产生的理解或感觉；可用 have an intuition that，但仍需证据检验。", "Her intuition told her to check the label.", "直觉提醒她查看标签。", "We should test the idea rather than rely on intuition.", "我们应检验想法，而不是依赖直觉。"],
  ["potential", "名词·潜力", "通常不可数，potential for 或 potential to do 表发展可能；潜力不等于已经实现的成果。", "The project has considerable potential.", "项目潜力很大。", "The survey explores the site's potential for tourism.", "调查探索场地的旅游潜力。"],
  ["intelligence", "名词·智力", "通常不可数，可指学习理解能力，也可指情报；不要把一次测试结果简单当作人的全部 intelligence。", "The task requires intelligence and patience.", "任务需要智慧与耐心。", "The book examines different ideas about intelligence.", "这本书考察对智力的不同观念。"],
  ["functional", "形容词·实用的", "可表示设计重实用，也可表示运作正常；functional equipment 不一定外观豪华或性能最先进。", "The room is simple but functional.", "房间简单却实用。", "The old radio is still functional.", "旧收音机仍能正常使用。"],
  ["acoustic", "形容词·声学的", "可表示声音或听觉相关；acoustic guitar 指不用电扩音为主要发声方式的吉他，不等于不能接麦克风。", "The hall has excellent acoustic properties.", "大厅有优异声学特性。", "She played an acoustic guitar.", "她弹了一把原声吉他。"],
  ["nocturnal", "形容词·夜间活动的", "指主要在夜间活跃或发生的事，常修饰 animals；不意味着个体白天绝不醒来或移动。", "The camera records nocturnal animals.", "相机记录夜间活动动物。", "The owl has nocturnal hunting habits.", "这只猫头鹰有夜间捕猎习性。"],
  ["dormant", "形容词·休眠的", "指当前不活跃但可能再次活动，常用于种子或火山；与永久死亡或灭绝不同。", "The seeds remained dormant through winter.", "种子整个冬天保持休眠。", "The volcano has been dormant for many years.", "火山已休眠多年。"],
  ["hibernation", "名词·冬眠", "通常不可数，指某些动物冬季显著降低活动的状态；不是普通一晚睡眠，也不同于夏眠。", "The animal emerged from hibernation.", "动物从冬眠中苏醒。", "The museum explains how hibernation conserves energy.", "博物馆解释冬眠如何节约能量。"],
  ["track", "名词·小道", "可指土路、轨道或踪迹，也可作动词追踪；a track 与 train tracks 等具体搭配含义不同。", "A narrow track leads to the farm.", "一条窄小道通往农场。", "The train stopped beside the damaged track.", "火车停在受损轨道旁。"],
  ["predator", "名词·捕食者", "生物学指捕猎并食用其他动物的动物；与仅取食非自杀动物残骸的 scavenger 在习性描述上不同。", "The small fish hid from a predator.", "小鱼躲避捕食者。", "The camera recorded a nocturnal predator.", "相机记录到一只夜间捕食者。"],
  ["victim", "名词·受害者", "可指受人、事故或疾病伤害的人或事物，常用 victim of；不应把受害理解为其自身过错。", "The charity helped a flood victim find shelter.", "慈善机构帮助一位洪灾受害者找到住处。", "The victim reported the theft promptly.", "受害者及时报告了盗窃。"],
  ["captivate", "动词·迷住", "直接接被吸引的人，强调强烈抓住注意力；不等同于强制关押的 capture。", "The storyteller can captivate a whole room.", "讲故事者能迷住满屋听众。", "These intricate models captivate young visitors.", "这些精细模型吸引年轻游客。"],
  ["subsistence", "名词·勉强生存", "通常不可数，指仅有足够维持生命的食物或收入；subsistence farming 强调主要供自用的农业。", "The family earned barely enough for subsistence.", "一家人收入仅够勉强维生。", "The report describes subsistence farming.", "报告描述自给农业。"],
  ["exist", "动词·存在", "通常不及物，表示某事真实存在或生活；不使用 be exist 来替代 exists，注意不要多加系动词。", "Several copies still exist.", "几个副本仍然存在。", "These plants exist only on the island.", "这些植物仅存在于该岛。"],
  ["existence", "名词·存在", "通常不可数，the existence of 后接存在的对象；come into existence 表开始存在，不等于某次被人看见。", "The records confirm the building's existence.", "记录证实建筑曾存在。", "The discovery changed our view of its existence.", "发现改变了我们对它是否存在的看法。"],
  ["tame nature", "短语用法·驯服自然", "这是 tame 加宾语 nature 的动词组合，意为控制自然；不是固定单词，也不同于 a tame nature 中温顺性情的名词组合。", "The engineers hoped to tame nature with a dam.", "工程师希望用大坝控制自然。", "The novel questions our desire to tame nature.", "小说质疑人类驯服自然的愿望。"],
  ["keeper", "名词·看护者", "可指照料动物或管理贵重物品场所的人；具体职责由 zoo 等修饰语决定，不一定拥有对象。", "The keeper prepared food for the seals.", "饲养员给海豹准备食物。", "The keeper unlocked the collection room.", "保管员打开藏品室。"],
  ["sheepdog", "名词·牧羊犬", "指训练来帮助控制羊群移动的犬；名称主要说明工作用途，不必只对应一种犬种。", "The sheepdog guided the flock through the gate.", "牧羊犬引导羊群通过大门。", "A sheepdog waited beside the farmer.", "一只牧羊犬等在农夫身旁。"],
  ["cosmos", "名词·宇宙", "常用 the cosmos 指作为有秩序整体的宇宙；另有波斯菊植物义，须从天文或花卉场景判断。", "The lecture explores our place in the cosmos.", "讲座探索我们在宇宙中的位置。", "The book describes patterns in the cosmos.", "这本书描述宇宙中的规律。"],
  ["universe", "名词·宇宙", "通常用 the universe 指全部物质和空间等整体；科幻中 a universe 可表示设想的另一宇宙。", "The telescope helps us study the universe.", "望远镜帮助我们研究宇宙。", "The course examines the early universe.", "课程考察早期宇宙。"],
  ["astrology", "名词·占星术", "指相信天体位置影响性格命运的传统实践；与科学研究天体的 astronomy 天文学有别。", "The museum compares astrology with astronomy.", "博物馆比较占星术与天文学。", "The book traces the history of astrology.", "这本书追溯占星术的历史。"],
  ["astronaut", "名词·宇航员", "可数，指受训进行太空旅行的人；与研究天体的 astronomer 天文学家不是同一职业。", "The astronaut checked the equipment.", "宇航员检查设备。", "A retired astronaut visited the school.", "一位退休宇航员访问学校。"],
  ["dust", "名词·尘埃", "通常不可数，指干燥细粉或微小颗粒；dust 作动词既可扫尘也可撒粉，需按宾语辨认。", "Dust settled on the empty shelves.", "尘埃落在空架子上。", "A beam of light revealed the dust.", "一束光照出尘埃。"],
  ["ash", "名词·灰", "燃烧后的灰烬通常不可数，也可指白蜡树；ashes 常用于具体残烬，植物与燃烧语境须区别。", "Ash covered the ground near the fire.", "灰覆盖火堆附近地面。", "The pot contained a little wood ash.", "罐里有一点木灰。"],
  ["envelope", "名词·信封", "可数名词，指装信件的纸封套；不要与表示包围的动词 envelop 混淆，二者结尾拼写和读音都不同。", "She sealed the envelope carefully.", "她仔细封好信封。", "The envelope contained a handwritten note.", "信封内有一张手写便条。"],
  ["spacecraft", "名词·航天器", "指用于太空运行或旅行的飞行器，单复数同形；不能写 spacecrafts 作为通常复数。", "The spacecraft entered orbit.", "航天器进入轨道。", "The antenna receives signals from the spacecraft.", "天线接收航天器信号。"],
  ["spaceship", "名词·宇宙飞船", "可数，常见于故事中的载人太空飞行器；与更广泛技术总称 spacecraft 的语体有所不同。", "The story begins aboard a spaceship.", "故事在宇宙飞船上开始。", "The model spaceship has a removable roof.", "宇宙飞船模型有可拆卸顶盖。"],
  ["probe", "名词·探头", "可指用于探测测量的工具，也可指调查；工具义常由 temperature 等修饰词明确，不是所有用法都指太空飞行器。", "The probe measured temperature inside the tube.", "探头测量管内温度。", "The technician inserted a temperature probe.", "技术员插入温度探头。"],
  ["module", "名词·模块", "可指整体中相对独立的部分，如设备舱段或课程单元；独立组成不代表能够脱离所有接口运行。", "The training module takes one hour.", "这个培训单元耗时一小时。", "The spacecraft carries a separate landing module.", "航天器带有独立着陆舱。"],
  ["propulsion", "名词·推进", "通常不可数，指推动物体前进的力或推进过程；不等同于飞行方向控制，也不必一定使用燃烧。", "The boat uses electric propulsion.", "船采用电力推进。", "The course explains rocket propulsion.", "课程解释火箭推进。"],
  ["pressure", "名词·压力", "可指施加在单位面积上的物理作用或精神负担；under pressure 表承压，不同语境单位和测量方式不同。", "The gauge shows the pressure in the tank.", "压力表显示罐内压力。", "The team worked well under pressure.", "团队在压力下表现良好。"],
  ["dynamics", "名词·动力学", "作学科名通常用单数谓语，也可指促成变化的力量关系；group dynamics 指群体互动模式。", "Dynamics is part of the physics course.", "动力学是物理课程的一部分。", "The study examines the dynamics of small groups.", "研究考察小群体的互动模式。"],
  ["tail", "名词·尾巴", "指动物后部延伸部分，也可指相似位置形状的东西；不等同于所有身体附肢。", "The dog wagged its tail.", "狗摇着尾巴。", "The aircraft's tail appeared above the hangar.", "飞机尾部露在机库上方。"],
  ["exploration", "名词·探索", "通常不可数，可指为了解地区而考察，也可指对议题深入研究；不表示一定已经发现成果。", "The exhibition traces polar exploration.", "展览追溯极地探索。", "The course encourages exploration of new ideas.", "课程鼓励探索新观念。"],
  ["flyby", "名词·飞越", "航天中指飞行器从天体附近经过的探测过程；不等同于进入轨道长期环绕或着陆。", "The probe completed a flyby of the planet.", "探测器完成一次行星飞越。", "Images from the flyby revealed new details.", "飞越影像揭示新细节。"],
  ["telescope", "名词·望远镜", "可数，指放大远处物体的光学仪器，也可用于其他波段；与观察微小近物的 microscope 不同。", "The telescope stands beneath a rotating dome.", "望远镜位于旋转穹顶下。", "She aimed the telescope at the moon.", "她把望远镜对准月球。"],
  ["spectacle", "名词·壮观景象", "可指引人注目的场面或大型表演；复数 spectacles 可指眼镜，不要把数变化后的词义机械合并。", "The parade was a colourful spectacle.", "游行是绚丽壮观的场面。", "We watched the spectacle from the bridge.", "我们从桥上观看那壮观景象。"],
  ["ecliptic", "名词·黄道", "通常用 the ecliptic，指太阳在天球上看似运行的路径；不能与天赤道混同，也不是一条实际画在太空中的线。", "The chart marks the ecliptic in yellow.", "星图用黄色标出黄道。", "The lecture explains the Sun's apparent motion along the ecliptic.", "讲座解释太阳沿黄道的视运动。"],
  ["diameter", "名词·直径", "指通过圆心连接圆周两点的线段或其长度；与从中心到边缘的 radius 半径不同。", "Measure the diameter of the circle.", "测量圆的直径。", "The pipe has a diameter of five centimetres.", "管子直径五厘米。"],
  ["composition", "名词·组成作品", "可指组成结构或音乐作品，具体由语境确定；chemical composition 指化学成分，不是作曲过程。", "The test reveals the rock's composition.", "测试揭示岩石成分。", "Her latest composition was performed yesterday.", "她最新的乐曲昨天得到演出。"],
  ["sample", "名词·样本", "可指从整体抽取的一小部分，是否有代表性需看抽样方法；不能仅凭是样本就推断代表全部。", "The laboratory tested a water sample.", "实验室检测了一个水样。", "The sample contains several small crystals.", "样本含几颗小晶体。"],
  ["atom", "名词·原子", "可数，指化学元素保持其性质的基本单位；原子能组成分子，不能把两者当作完全相同层级。", "The diagram shows a hydrogen atom.", "图示显示一个氢原子。", "The model represents each atom with a ball.", "模型用球代表每个原子。"],
  ["quantum", "名词·量子", "专业义指某物理量的离散单位，复数 quanta；量子概念不等于任何事物都简单分成同样大小。", "The lesson introduces the idea of a quantum of energy.", "课程介绍能量量子的概念。", "The model describes a single quantum state.", "模型描述一个量子态。"],
  ["liquid", "名词·液体", "可数或不可数，指可流动但通常有一定体积的物态；与 gas 气体区分，也可作形容词液态的。", "The liquid filled the bottom of the flask.", "液体装满烧瓶底部。", "Pour the clear liquid into the beaker.", "把透明液体倒进烧杯。"],
  ["fluid", "名词·流体", "指能流动的物质，专业上可包括液体和气体；不应在所有物理场景都把 fluid 限定成液体。", "The pump moves fluid through the pipe.", "泵使流体沿管道流动。", "The diagram shows fluid flow around a barrier.", "图示展示流体绕障碍流动。"],
  ["solid", "形容词·固态的", "可描述保持形状的物态，也可表示实心或牢固；不是所有 solid 都表示完全没有孔隙。", "The wax became solid as it cooled.", "蜡冷却时变成固体。", "The shelf rests on a solid wooden frame.", "架板由结实木架支撑。"],
  ["synthesise", "动词·合成", "英式拼写，对应 synthesize，可指化学制备或综合信息；不是把材料简单并排放置。", "The laboratory can synthesise the compound.", "实验室能够合成这种化合物。", "We must synthesise findings from several studies.", "我们必须综合多项研究结果。"],
  ["formation", "名词·形成", "可指形成过程或排列形态；rock formation 也可指岩层地貌，不能一律按军队队形理解。", "The diagram explains cloud formation.", "图示解释云的形成。", "The birds flew in a V-shaped formation.", "鸟以 V 字队形飞行。"],
  ["method", "名词·方法", "可数，常用 method of doing 或 method for doing；不等同于要实现的目标或得到的结果。", "The teacher demonstrated a new method.", "老师演示了一种新方法。", "This method of storage keeps the cards dry.", "这种存储方法使卡片保持干燥。"],
  ["antenna", "名词·触角天线", "动物触角复数常为 antennae，通讯天线常为 antennas；两者意义不同，应依据领域选用。", "The insect moved one antenna.", "昆虫移动一根触角。", "The antenna receives a weak signal.", "天线接收微弱信号。"],
  ["refraction", "名词·折射", "通常不可数，指光或声等进入不同介质时传播方向改变；不同于反射 reflection 返回原介质。", "The prism demonstrates refraction.", "棱镜演示折射。", "Refraction makes the straw appear bent.", "折射使吸管看起来弯曲。"],
  ["discernible", "形容词·可察觉的", "表示能够看出或辨别，常用 barely discernible 表几乎难辨；不表示所有人无需工具都明显看见。", "A faint outline was discernible through the mist.", "薄雾中能隐约看出轮廓。", "The change was barely discernible.", "变化几乎难以察觉。"],
  ["squash", "动词·压扁", "可指压成扁形或挤入小空间，也可作名词指壁球等；动作义不总表示物体完全毁坏。", "Do not squash the flowers in your bag.", "不要把包里的花压扁。", "We tried to squash the cushions into the box.", "我们试着把靠垫塞进箱子。"],
  ["cataclysmic", "形容词·灾变的", "形容造成巨大破坏或剧烈突变，程度很强；不适合把普通小调整都说成 cataclysmic。", "The exhibit describes a cataclysmic eruption.", "展览描述一场灾难性喷发。", "The novel begins after a cataclysmic event.", "小说在一场剧变之后开始。"],
  ["overwhelming", "形容词·压倒性的", "可表示强得难以抵挡或数量极大；overwhelming majority 指绝大多数，但并非每个人都同意。", "The proposal received overwhelming support.", "提议获得压倒性支持。", "The noise became overwhelming.", "噪声变得令人难以承受。"],
  ["despair", "名词·绝望", "通常不可数，指对改善处境失去希望；in despair 表绝望地，作动词时常用 despair of。", "The delay filled him with despair.", "延误让他满心绝望。", "She shook her head in despair.", "她绝望地摇头。"],
  ["hopeless", "形容词·无望的", "可指没有希望，也可在 be hopeless at 中表示很不擅长；不能仅凭此词把短期困难判断为永久无解。", "The search seemed hopeless in the dark.", "黑暗中搜寻似乎毫无希望。", "I am hopeless at remembering passwords.", "我非常不擅长记密码。"],
  ["education", "名词·教育", "通常不可数，可指教学学习过程或接受的教育；a good education 可把一次完整受教育经历视为整体。", "Education opens opportunities for young people.", "教育为年轻人打开机会。", "The museum supports science education.", "博物馆支持科学教育。"],
  ["primary", "形容词·主要的", "可指首要重要性，也可指小学阶段；primary concern 与 primary school 含义需按名词确定。", "Safety is our primary concern.", "安全是我们首要关切。", "The primary entrance faces the square.", "主要入口面向广场。"],
  ["secondary", "形容词·次要的", "可表示重要性较低，也可指中等教育阶段；secondary school 不是品质较差学校的意思。", "Cost is secondary to safety.", "费用的重要性次于安全。", "The report discusses a secondary cause.", "报告讨论一个次要原因。"],
  ["university", "名词·大学", "可数，开头发辅音音素，通常用 a university 而非 an；英式 go to university 可不带冠词。", "She enrolled at a local university.", "她注册进入当地一所大学。", "The university opened a new library.", "大学开放了一座新图书馆。"],
  ["study", "动词·学习研究", "可直接接学科表示学习，也可接对象表示仔细检查；study for an exam 则指为考试学习。", "We study river systems in geography.", "我们在地理课上学习河流系统。", "Please study the diagram before answering.", "回答前请仔细研究图示。"],
  ["knowledge", "名词·知识", "通常不可数，不说 a knowledge 泛指一条知识；a good knowledge of 可指对领域较好的掌握。", "Her knowledge of local history impressed us.", "她对当地历史的了解让我们印象深刻。", "The workshop builds practical knowledge.", "工作坊增进实用知识。"],
  ["expertise", "名词·专长", "通常不可数，指较高水平的专业知识或技能；expertise in 后接领域，不等同于初次尝试的经验。", "The project needs expertise in bridge design.", "项目需要桥梁设计专长。", "She shared her technical expertise with the team.", "她与团队分享技术专长。"]
];
const sourceMeta = {
  "café": {
    "url": "https://dictionary.cambridge.org/dictionary/english/caf%C3%A9",
    "verified": true
  },
  "destine": {
    "url": "https://www.merriam-webster.com/dictionary/destine",
    "verified": true
  },
  "antarctic": {
    "url": "https://dictionary.cambridge.org/dictionary/english/antarctic",
    "verified": true
  },
  "roman": {
    "url": "https://dictionary.cambridge.org/dictionary/english/roman",
    "verified": true
  },
  "sepectator": {
    "url": "https://dictionary.cambridge.org/dictionary/english/spectator",
    "verified": true
  },
  "overgrow": {
    "url": "https://www.merriam-webster.com/dictionary/overgrow",
    "verified": true
  },
  "per capita": {
    "url": "https://dictionary.cambridge.org/dictionary/english/per-capita",
    "verified": true
  },
  "mediterranean": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mediterranean",
    "verified": true
  },
  "scandinavia": {
    "url": "https://dictionary.cambridge.org/dictionary/english/scandinavia",
    "verified": true
  },
  "celsius": {
    "url": "https://dictionary.cambridge.org/dictionary/english/celsius",
    "verified": true
  },
  "cambrian": {
    "url": "https://dictionary.cambridge.org/dictionary/english/cambrian",
    "verified": true
  },
  "muslim": {
    "url": "https://dictionary.cambridge.org/dictionary/english/muslim",
    "verified": true
  },
  "phenomenon": {
    "url": "https://dictionary.cambridge.org/dictionary/english/phenomenon",
    "verified": true
  },
  "ritualize": {
    "url": "https://www.merriam-webster.com/dictionary/ritualize",
    "verified": true
  },
  "entitle": {
    "url": "https://dictionary.cambridge.org/dictionary/english/entitle",
    "verified": true
  },
  "proxy": {
    "url": "https://dictionary.cambridge.org/dictionary/english/proxy",
    "verified": true
  },
  "mutual": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mutual",
    "verified": true
  },
  "bleak": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bleak",
    "verified": true
  },
  "conserve": {
    "url": "https://dictionary.cambridge.org/dictionary/english/conserve",
    "verified": true
  },
  "contraction": {
    "url": "https://dictionary.cambridge.org/dictionary/english/contraction",
    "verified": true
  },
  "driven": {
    "url": "https://dictionary.cambridge.org/dictionary/english/driven",
    "verified": true
  },
  "meteorite": {
    "url": "https://dictionary.cambridge.org/dictionary/english/meteorite",
    "verified": true
  },
  "microorganism": {
    "url": "https://dictionary.cambridge.org/dictionary/english/microorganism",
    "verified": true
  },
  "buffalo": {
    "url": "https://dictionary.cambridge.org/dictionary/english/buffalo",
    "verified": true
  },
  "conductance": {
    "url": "https://www.merriam-webster.com/dictionary/conductance",
    "verified": true
  },
  "culprit": {
    "url": "https://dictionary.cambridge.org/dictionary/english/culprit",
    "verified": true
  },
  "predominant": {
    "url": "https://dictionary.cambridge.org/dictionary/english/predominant",
    "verified": true
  },
  "culminate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/culminate",
    "verified": true
  },
  "dome": {
    "url": "https://dictionary.cambridge.org/dictionary/english/dome",
    "verified": true
  },
  "assembly": {
    "url": "https://dictionary.cambridge.org/dictionary/english/assembly",
    "verified": true
  },
  "fluctuate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fluctuate",
    "verified": true
  },
  "perception": {
    "url": "https://dictionary.cambridge.org/dictionary/english/perception",
    "verified": true
  },
  "assortment": {
    "url": "https://dictionary.cambridge.org/dictionary/english/assortment",
    "verified": true
  },
  "adorn": {
    "url": "https://dictionary.cambridge.org/dictionary/english/adorn",
    "verified": true
  },
  "impulse": {
    "url": "https://dictionary.cambridge.org/dictionary/english/impulse",
    "verified": true
  },
  "digress": {
    "url": "https://dictionary.cambridge.org/dictionary/english/digress",
    "verified": true
  },
  "bliss": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bliss",
    "verified": true
  },
  "locale": {
    "url": "https://dictionary.cambridge.org/dictionary/english/locale",
    "verified": true
  },
  "herbicide": {
    "url": "https://dictionary.cambridge.org/dictionary/english/herbicide",
    "verified": true
  },
  "utilitarian": {
    "url": "https://dictionary.cambridge.org/dictionary/english/utilitarian",
    "verified": true
  },
  "cape": {
    "url": "https://dictionary.cambridge.org/dictionary/english/cape",
    "verified": true
  },
  "pristine": {
    "url": "https://dictionary.cambridge.org/dictionary/english/pristine",
    "verified": true
  },
  "traverse": {
    "url": "https://dictionary.cambridge.org/dictionary/english/traverse",
    "verified": true
  },
  "reinforce": {
    "url": "https://dictionary.cambridge.org/dictionary/english/reinforce",
    "verified": true
  },
  "exportable": {
    "url": "https://dictionary.cambridge.org/dictionary/english/exportable",
    "verified": true
  },
  "descendant": {
    "url": "https://dictionary.cambridge.org/dictionary/english/descendant",
    "verified": true
  },
  "clergy": {
    "url": "https://dictionary.cambridge.org/dictionary/english/clergy",
    "verified": true
  },
  "petrochemical": {
    "url": "https://dictionary.cambridge.org/dictionary/english/petrochemical",
    "verified": true
  },
  "encode": {
    "url": "https://dictionary.cambridge.org/dictionary/english/encode",
    "verified": true
  },
  "replica": {
    "url": "https://dictionary.cambridge.org/dictionary/english/replica",
    "verified": true
  },
  "tame": {
    "url": "https://dictionary.cambridge.org/dictionary/english/tame",
    "verified": true
  },
  "vulnerable": {
    "url": "https://dictionary.cambridge.org/dictionary/english/vulnerable",
    "verified": true
  },
  "onset": {
    "url": "https://dictionary.cambridge.org/dictionary/english/onset",
    "verified": true
  },
  "reclamation": {
    "url": "https://dictionary.cambridge.org/dictionary/english/reclamation",
    "verified": true
  },
  "monetary": {
    "url": "https://dictionary.cambridge.org/dictionary/english/monetary",
    "verified": true
  },
  "fracture": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fracture",
    "verified": true
  },
  "charged": {
    "url": "https://dictionary.cambridge.org/dictionary/english/charged",
    "verified": true
  },
  "bead": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bead",
    "verified": true
  },
  "melodious": {
    "url": "https://dictionary.cambridge.org/dictionary/english/melodious",
    "verified": true
  },
  "canyon": {
    "url": "https://dictionary.cambridge.org/dictionary/english/canyon",
    "verified": true
  },
  "successor": {
    "url": "https://dictionary.cambridge.org/dictionary/english/successor",
    "verified": true
  },
  "allusion": {
    "url": "https://dictionary.cambridge.org/dictionary/english/allusion",
    "verified": true
  },
  "abnormality": {
    "url": "https://dictionary.cambridge.org/dictionary/english/abnormality",
    "verified": true
  },
  "oversight": {
    "url": "https://dictionary.cambridge.org/dictionary/english/oversight",
    "verified": true
  },
  "prevail": {
    "url": "https://dictionary.cambridge.org/dictionary/english/prevail",
    "verified": true
  },
  "synchronize": {
    "url": "https://dictionary.cambridge.org/dictionary/english/synchronize",
    "verified": true
  },
  "credential": {
    "url": "https://dictionary.cambridge.org/dictionary/english/credential",
    "verified": true
  },
  "feasibility": {
    "url": "https://dictionary.cambridge.org/dictionary/english/feasibility",
    "verified": true
  },
  "sparsely": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sparsely",
    "verified": true
  },
  "reef": {
    "url": "https://dictionary.cambridge.org/dictionary/english/reef",
    "verified": true
  },
  "barn": {
    "url": "https://dictionary.cambridge.org/dictionary/english/barn",
    "verified": true
  },
  "alumnus": {
    "url": "https://dictionary.cambridge.org/dictionary/english/alumnus",
    "verified": true
  },
  "strike": {
    "url": "https://dictionary.cambridge.org/dictionary/english/strike",
    "verified": true
  },
  "subsist": {
    "url": "https://dictionary.cambridge.org/dictionary/english/subsist",
    "verified": true
  },
  "percussion": {
    "url": "https://dictionary.cambridge.org/dictionary/english/percussion",
    "verified": true
  },
  "tributary": {
    "url": "https://dictionary.cambridge.org/dictionary/english/tributary",
    "verified": true
  },
  "moss": {
    "url": "https://dictionary.cambridge.org/dictionary/english/moss",
    "verified": true
  },
  "furry": {
    "url": "https://dictionary.cambridge.org/dictionary/english/furry",
    "verified": true
  },
  "patent": {
    "url": "https://dictionary.cambridge.org/dictionary/english/patent",
    "verified": true
  },
  "meteoroid": {
    "url": "https://dictionary.cambridge.org/dictionary/english/meteoroid",
    "verified": true
  },
  "obscure": {
    "url": "https://dictionary.cambridge.org/dictionary/english/obscure",
    "verified": true
  },
  "dismantle": {
    "url": "https://dictionary.cambridge.org/dictionary/english/dismantle",
    "verified": true
  },
  "spine": {
    "url": "https://dictionary.cambridge.org/dictionary/english/spine",
    "verified": true
  },
  "tentacle": {
    "url": "https://dictionary.cambridge.org/dictionary/english/tentacle",
    "verified": true
  },
  "limb": {
    "url": "https://dictionary.cambridge.org/dictionary/english/limb",
    "verified": true
  },
  "hierarchy": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hierarchy",
    "verified": true
  },
  "hydro": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hydro",
    "verified": true
  },
  "fraction": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fraction",
    "verified": true
  },
  "manifest": {
    "url": "https://dictionary.cambridge.org/dictionary/english/manifest",
    "verified": true
  },
  "inertia": {
    "url": "https://dictionary.cambridge.org/dictionary/english/inertia",
    "verified": true
  },
  "punctuate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/punctuate",
    "verified": true
  },
  "conviction": {
    "url": "https://dictionary.cambridge.org/dictionary/english/conviction",
    "verified": true
  },
  "suite": {
    "url": "https://dictionary.cambridge.org/dictionary/english/suite",
    "verified": true
  },
  "swarm": {
    "url": "https://dictionary.cambridge.org/dictionary/english/swarm",
    "verified": true
  },
  "resolve": {
    "url": "https://dictionary.cambridge.org/dictionary/english/resolve",
    "verified": true
  },
  "abrasion": {
    "url": "https://dictionary.cambridge.org/dictionary/english/abrasion",
    "verified": true
  },
  "flagpole": {
    "url": "https://dictionary.cambridge.org/dictionary/english/flagpole",
    "verified": true
  },
  "pebble": {
    "url": "https://dictionary.cambridge.org/dictionary/english/pebble",
    "verified": true
  },
  "limestone": {
    "url": "https://dictionary.cambridge.org/dictionary/english/limestone",
    "verified": true
  },
  "textile": {
    "url": "https://dictionary.cambridge.org/dictionary/english/textile",
    "verified": true
  },
  "opaque": {
    "url": "https://dictionary.cambridge.org/dictionary/english/opaque",
    "verified": true
  },
  "sect": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sect",
    "verified": true
  },
  "uproot": {
    "url": "https://dictionary.cambridge.org/dictionary/english/uproot",
    "verified": true
  },
  "lodging": {
    "url": "https://dictionary.cambridge.org/dictionary/english/lodging",
    "verified": true
  },
  "diffuse": {
    "url": "https://dictionary.cambridge.org/dictionary/english/diffuse",
    "verified": true
  },
  "microscope": {
    "url": "https://dictionary.cambridge.org/dictionary/english/microscope",
    "verified": true
  },
  "conservative": {
    "url": "https://dictionary.cambridge.org/dictionary/english/conservative",
    "verified": true
  },
  "substrate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/substrate",
    "verified": true
  },
  "expedition": {
    "url": "https://dictionary.cambridge.org/dictionary/english/expedition",
    "verified": true
  },
  "entail": {
    "url": "https://dictionary.cambridge.org/dictionary/english/entail",
    "verified": true
  },
  "withstand": {
    "url": "https://dictionary.cambridge.org/dictionary/english/withstand",
    "verified": true
  },
  "scant": {
    "url": "https://dictionary.cambridge.org/dictionary/english/scant",
    "verified": true
  },
  "plausible": {
    "url": "https://dictionary.cambridge.org/dictionary/english/plausible",
    "verified": true
  },
  "christian": {
    "url": "https://dictionary.cambridge.org/dictionary/english/christian",
    "verified": true
  },
  "carving": {
    "url": "https://dictionary.cambridge.org/dictionary/english/carving",
    "verified": true
  },
  "sweep": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sweep",
    "verified": true
  },
  "counterbalance": {
    "url": "https://dictionary.cambridge.org/dictionary/english/counterbalance",
    "verified": true
  },
  "explicit": {
    "url": "https://dictionary.cambridge.org/dictionary/english/explicit",
    "verified": true
  },
  "photosynthesis": {
    "url": "https://dictionary.cambridge.org/dictionary/english/photosynthesis",
    "verified": true
  },
  "outrigger": {
    "url": "https://dictionary.cambridge.org/dictionary/english/outrigger",
    "verified": true
  },
  "jot": {
    "url": "https://dictionary.cambridge.org/dictionary/english/jot",
    "verified": true
  },
  "invoke": {
    "url": "https://dictionary.cambridge.org/dictionary/english/invoke",
    "verified": true
  },
  "innumerable": {
    "url": "https://dictionary.cambridge.org/dictionary/english/innumerable",
    "verified": true
  },
  "pessimistic": {
    "url": "https://dictionary.cambridge.org/dictionary/english/pessimistic",
    "verified": true
  },
  "metaphor": {
    "url": "https://dictionary.cambridge.org/dictionary/english/metaphor",
    "verified": true
  },
  "beak": {
    "url": "https://dictionary.cambridge.org/dictionary/english/beak",
    "verified": true
  },
  "axis": {
    "url": "https://dictionary.cambridge.org/dictionary/english/axis",
    "verified": true
  },
  "immortal": {
    "url": "https://dictionary.cambridge.org/dictionary/english/immortal",
    "verified": true
  },
  "foreseeable": {
    "url": "https://dictionary.cambridge.org/dictionary/english/foreseeable",
    "verified": true
  },
  "supplement": {
    "url": "https://dictionary.cambridge.org/dictionary/english/supplement",
    "verified": true
  },
  "passive": {
    "url": "https://dictionary.cambridge.org/dictionary/english/passive",
    "verified": true
  },
  "proton": {
    "url": "https://dictionary.cambridge.org/dictionary/english/proton",
    "verified": true
  },
  "prowl": {
    "url": "https://dictionary.cambridge.org/dictionary/english/prowl",
    "verified": true
  },
  "cripple": {
    "url": "https://dictionary.cambridge.org/dictionary/english/cripple",
    "verified": true
  },
  "handicraft": {
    "url": "https://dictionary.cambridge.org/dictionary/english/handicraft",
    "verified": true
  },
  "erode": {
    "url": "https://dictionary.cambridge.org/dictionary/english/erode",
    "verified": true
  },
  "imperial": {
    "url": "https://dictionary.cambridge.org/dictionary/english/imperial",
    "verified": true
  },
  "autonomy": {
    "url": "https://dictionary.cambridge.org/dictionary/english/autonomy",
    "verified": true
  },
  "akin": {
    "url": "https://dictionary.cambridge.org/dictionary/english/akin",
    "verified": true
  },
  "compost": {
    "url": "https://dictionary.cambridge.org/dictionary/english/compost",
    "verified": true
  },
  "improvise": {
    "url": "https://dictionary.cambridge.org/dictionary/english/improvise",
    "verified": true
  },
  "symmetrical": {
    "url": "https://dictionary.cambridge.org/dictionary/english/symmetrical",
    "verified": true
  },
  "prestige": {
    "url": "https://dictionary.cambridge.org/dictionary/english/prestige",
    "verified": true
  },
  "foresight": {
    "url": "https://dictionary.cambridge.org/dictionary/english/foresight",
    "verified": true
  },
  "engulf": {
    "url": "https://dictionary.cambridge.org/dictionary/english/engulf",
    "verified": true
  },
  "transient": {
    "url": "https://dictionary.cambridge.org/dictionary/english/transient",
    "verified": true
  },
  "staple": {
    "url": "https://dictionary.cambridge.org/dictionary/english/staple",
    "verified": true
  },
  "practitioner": {
    "url": "https://dictionary.cambridge.org/dictionary/english/practitioner",
    "verified": true
  },
  "antarctica": {
    "url": "https://dictionary.cambridge.org/dictionary/english/antarctica",
    "verified": true
  },
  "surge": {
    "url": "https://dictionary.cambridge.org/dictionary/english/surge",
    "verified": true
  },
  "render": {
    "url": "https://dictionary.cambridge.org/dictionary/english/render",
    "verified": true
  },
  "juvenile": {
    "url": "https://dictionary.cambridge.org/dictionary/english/juvenile",
    "verified": true
  },
  "chivalry": {
    "url": "https://dictionary.cambridge.org/dictionary/english/chivalry",
    "verified": true
  },
  "partition": {
    "url": "https://dictionary.cambridge.org/dictionary/english/partition",
    "verified": true
  },
  "exemplary": {
    "url": "https://dictionary.cambridge.org/dictionary/english/exemplary",
    "verified": true
  },
  "constellation": {
    "url": "https://dictionary.cambridge.org/dictionary/english/constellation",
    "verified": true
  },
  "terrain": {
    "url": "https://dictionary.cambridge.org/dictionary/english/terrain",
    "verified": true
  },
  "mentality": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mentality",
    "verified": true
  },
  "interplay": {
    "url": "https://dictionary.cambridge.org/dictionary/english/interplay",
    "verified": true
  },
  "invariable": {
    "url": "https://dictionary.cambridge.org/dictionary/english/invariable",
    "verified": true
  },
  "fabricate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fabricate",
    "verified": true
  },
  "oar": {
    "url": "https://dictionary.cambridge.org/dictionary/english/oar",
    "verified": true
  },
  "permeable": {
    "url": "https://dictionary.cambridge.org/dictionary/english/permeable",
    "verified": true
  },
  "brittle": {
    "url": "https://dictionary.cambridge.org/dictionary/english/brittle",
    "verified": true
  },
  "bolt": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bolt",
    "verified": true
  },
  "myriad": {
    "url": "https://dictionary.cambridge.org/dictionary/english/myriad",
    "verified": true
  },
  "coarse": {
    "url": "https://dictionary.cambridge.org/dictionary/english/coarse",
    "verified": true
  },
  "disorient": {
    "url": "https://dictionary.cambridge.org/dictionary/english/disorient",
    "verified": true
  },
  "impend": {
    "url": "https://dictionary.cambridge.org/dictionary/english/impend",
    "verified": true
  },
  "foggy": {
    "url": "https://dictionary.cambridge.org/dictionary/english/foggy",
    "verified": true
  },
  "signify": {
    "url": "https://dictionary.cambridge.org/dictionary/english/signify",
    "verified": true
  },
  "bemoan": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bemoan",
    "verified": true
  },
  "override": {
    "url": "https://dictionary.cambridge.org/dictionary/english/override",
    "verified": true
  },
  "terrestrial": {
    "url": "https://dictionary.cambridge.org/dictionary/english/terrestrial",
    "verified": true
  },
  "oppressive": {
    "url": "https://dictionary.cambridge.org/dictionary/english/oppressive",
    "verified": true
  },
  "framework": {
    "url": "https://dictionary.cambridge.org/dictionary/english/framework",
    "verified": true
  },
  "heyday": {
    "url": "https://dictionary.cambridge.org/dictionary/english/heyday",
    "verified": true
  },
  "horticulture": {
    "url": "https://dictionary.cambridge.org/dictionary/english/horticulture",
    "verified": true
  },
  "sever": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sever",
    "verified": true
  },
  "celestial": {
    "url": "https://dictionary.cambridge.org/dictionary/english/celestial",
    "verified": true
  },
  "converse": {
    "url": "https://dictionary.cambridge.org/dictionary/english/converse",
    "verified": true
  },
  "inflate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/inflate",
    "verified": true
  },
  "graze": {
    "url": "https://dictionary.cambridge.org/dictionary/english/graze",
    "verified": true
  },
  "inhospitable": {
    "url": "https://dictionary.cambridge.org/dictionary/english/inhospitable",
    "verified": true
  },
  "skeletal": {
    "url": "https://dictionary.cambridge.org/dictionary/english/skeletal",
    "verified": true
  },
  "strand": {
    "url": "https://dictionary.cambridge.org/dictionary/english/strand",
    "verified": true
  },
  "gypsum": {
    "url": "https://dictionary.cambridge.org/dictionary/english/gypsum",
    "verified": true
  },
  "intermediary": {
    "url": "https://dictionary.cambridge.org/dictionary/english/intermediary",
    "verified": true
  },
  "intestine": {
    "url": "https://dictionary.cambridge.org/dictionary/english/intestine",
    "verified": true
  },
  "fauna": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fauna",
    "verified": true
  },
  "semiarid": {
    "url": "https://www.merriam-webster.com/dictionary/semiarid",
    "verified": true
  },
  "muffle": {
    "url": "https://dictionary.cambridge.org/dictionary/english/muffle",
    "verified": true
  },
  "toll": {
    "url": "https://dictionary.cambridge.org/dictionary/english/toll",
    "verified": true
  },
  "judicial": {
    "url": "https://dictionary.cambridge.org/dictionary/english/judicial",
    "verified": true
  },
  "spherical": {
    "url": "https://dictionary.cambridge.org/dictionary/english/spherical",
    "verified": true
  },
  "purify": {
    "url": "https://dictionary.cambridge.org/dictionary/english/purify",
    "verified": true
  },
  "riot": {
    "url": "https://dictionary.cambridge.org/dictionary/english/riot",
    "verified": true
  },
  "empirical": {
    "url": "https://dictionary.cambridge.org/dictionary/english/empirical",
    "verified": true
  },
  "stunt": {
    "url": "https://dictionary.cambridge.org/dictionary/english/stunt",
    "verified": true
  },
  "multitude": {
    "url": "https://dictionary.cambridge.org/dictionary/english/multitude",
    "verified": true
  },
  "anglo-saxon": {
    "url": "https://dictionary.cambridge.org/dictionary/english/anglo-saxon",
    "verified": true
  },
  "avalanche": {
    "url": "https://dictionary.cambridge.org/dictionary/english/avalanche",
    "verified": true
  },
  "silicon": {
    "url": "https://dictionary.cambridge.org/dictionary/english/silicon",
    "verified": true
  },
  "incompatibility": {
    "url": "https://dictionary.cambridge.org/dictionary/english/incompatibility",
    "verified": true
  },
  "expanse": {
    "url": "https://dictionary.cambridge.org/dictionary/english/expanse",
    "verified": true
  },
  "integrate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/integrate",
    "verified": true
  },
  "haul": {
    "url": "https://dictionary.cambridge.org/dictionary/english/haul",
    "verified": true
  },
  "vertebral": {
    "url": "https://dictionary.cambridge.org/dictionary/english/vertebral",
    "verified": true
  },
  "impermeable": {
    "url": "https://dictionary.cambridge.org/dictionary/english/impermeable",
    "verified": true
  },
  "implicate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/implicate",
    "verified": true
  },
  "allergy": {
    "url": "https://dictionary.cambridge.org/dictionary/english/allergy",
    "verified": true
  },
  "respiratory": {
    "url": "https://dictionary.cambridge.org/dictionary/english/respiratory",
    "verified": true
  },
  "pigment": {
    "url": "https://dictionary.cambridge.org/dictionary/english/pigment",
    "verified": true
  },
  "inadvertent": {
    "url": "https://dictionary.cambridge.org/dictionary/english/inadvertent",
    "verified": true
  },
  "crater": {
    "url": "https://dictionary.cambridge.org/dictionary/english/crater",
    "verified": true
  },
  "reverse": {
    "url": "https://dictionary.cambridge.org/dictionary/english/reverse",
    "verified": true
  },
  "marvel": {
    "url": "https://dictionary.cambridge.org/dictionary/english/marvel",
    "verified": true
  },
  "integral": {
    "url": "https://dictionary.cambridge.org/dictionary/english/integral",
    "verified": true
  },
  "contention": {
    "url": "https://dictionary.cambridge.org/dictionary/english/contention",
    "verified": true
  },
  "strain": {
    "url": "https://dictionary.cambridge.org/dictionary/english/strain",
    "verified": true
  },
  "vanish": {
    "url": "https://dictionary.cambridge.org/dictionary/english/vanish",
    "verified": true
  },
  "consistency": {
    "url": "https://dictionary.cambridge.org/dictionary/english/consistency",
    "verified": true
  },
  "counterpart": {
    "url": "https://dictionary.cambridge.org/dictionary/english/counterpart",
    "verified": true
  },
  "residue": {
    "url": "https://dictionary.cambridge.org/dictionary/english/residue",
    "verified": true
  },
  "subside": {
    "url": "https://dictionary.cambridge.org/dictionary/english/subside",
    "verified": true
  },
  "deception": {
    "url": "https://dictionary.cambridge.org/dictionary/english/deception",
    "verified": true
  },
  "marble": {
    "url": "https://dictionary.cambridge.org/dictionary/english/marble",
    "verified": true
  },
  "craftspeople": {
    "url": "https://www.merriam-webster.com/dictionary/craftspeople",
    "verified": true
  },
  "obligatory": {
    "url": "https://dictionary.cambridge.org/dictionary/english/obligatory",
    "verified": true
  },
  "shrine": {
    "url": "https://dictionary.cambridge.org/dictionary/english/shrine",
    "verified": true
  },
  "clam": {
    "url": "https://dictionary.cambridge.org/dictionary/english/clam",
    "verified": true
  },
  "extermination": {
    "url": "https://dictionary.cambridge.org/dictionary/english/extermination",
    "verified": true
  },
  "deteriorate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/deteriorate",
    "verified": true
  },
  "spatial": {
    "url": "https://dictionary.cambridge.org/dictionary/english/spatial",
    "verified": true
  },
  "permanence": {
    "url": "https://dictionary.cambridge.org/dictionary/english/permanence",
    "verified": true
  },
  "regenerate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/regenerate",
    "verified": true
  },
  "presume": {
    "url": "https://dictionary.cambridge.org/dictionary/english/presume",
    "verified": true
  },
  "analogous": {
    "url": "https://dictionary.cambridge.org/dictionary/english/analogous",
    "verified": true
  },
  "verdict": {
    "url": "https://dictionary.cambridge.org/dictionary/english/verdict",
    "verified": true
  },
  "qualitatively": {
    "url": "https://dictionary.cambridge.org/dictionary/english/qualitatively",
    "verified": true
  },
  "frigid": {
    "url": "https://dictionary.cambridge.org/dictionary/english/frigid",
    "verified": true
  },
  "offset": {
    "url": "https://dictionary.cambridge.org/dictionary/english/offset",
    "verified": true
  },
  "illiterate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/illiterate",
    "verified": true
  },
  "ruthless": {
    "url": "https://dictionary.cambridge.org/dictionary/english/ruthless",
    "verified": true
  },
  "eradication": {
    "url": "https://dictionary.cambridge.org/dictionary/english/eradication",
    "verified": true
  },
  "watt": {
    "url": "https://dictionary.cambridge.org/dictionary/english/watt",
    "verified": true
  },
  "enliven": {
    "url": "https://dictionary.cambridge.org/dictionary/english/enliven",
    "verified": true
  },
  "intrinsic": {
    "url": "https://dictionary.cambridge.org/dictionary/english/intrinsic",
    "verified": true
  },
  "provincial": {
    "url": "https://dictionary.cambridge.org/dictionary/english/provincial",
    "verified": true
  },
  "nibble": {
    "url": "https://dictionary.cambridge.org/dictionary/english/nibble",
    "verified": true
  },
  "marshy": {
    "url": "https://dictionary.cambridge.org/dictionary/english/marshy",
    "verified": true
  },
  "stingless": {
    "url": "https://www.merriam-webster.com/dictionary/stingless",
    "verified": true
  },
  "engender": {
    "url": "https://dictionary.cambridge.org/dictionary/english/engender",
    "verified": true
  },
  "glaze": {
    "url": "https://dictionary.cambridge.org/dictionary/english/glaze",
    "verified": true
  },
  "shatter": {
    "url": "https://dictionary.cambridge.org/dictionary/english/shatter",
    "verified": true
  },
  "horizontal": {
    "url": "https://dictionary.cambridge.org/dictionary/english/horizontal",
    "verified": true
  },
  "sporadic": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sporadic",
    "verified": true
  },
  "lethal": {
    "url": "https://dictionary.cambridge.org/dictionary/english/lethal",
    "verified": true
  },
  "virtuoso": {
    "url": "https://dictionary.cambridge.org/dictionary/english/virtuoso",
    "verified": true
  },
  "innate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/innate",
    "verified": true
  },
  "hemispheric": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hemispheric",
    "verified": true
  },
  "stratum": {
    "url": "https://dictionary.cambridge.org/dictionary/english/stratum",
    "verified": true
  },
  "intertwine": {
    "url": "https://dictionary.cambridge.org/dictionary/english/intertwine",
    "verified": true
  },
  "drench": {
    "url": "https://dictionary.cambridge.org/dictionary/english/drench",
    "verified": true
  },
  "descent": {
    "url": "https://dictionary.cambridge.org/dictionary/english/descent",
    "verified": true
  },
  "intrigue": {
    "url": "https://dictionary.cambridge.org/dictionary/english/intrigue",
    "verified": true
  },
  "delegate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/delegate",
    "verified": true
  },
  "stationary": {
    "url": "https://dictionary.cambridge.org/dictionary/english/stationary",
    "verified": true
  },
  "unravel": {
    "url": "https://dictionary.cambridge.org/dictionary/english/unravel",
    "verified": true
  },
  "twig": {
    "url": "https://dictionary.cambridge.org/dictionary/english/twig",
    "verified": true
  },
  "paddle": {
    "url": "https://dictionary.cambridge.org/dictionary/english/paddle",
    "verified": true
  },
  "incomprehensible": {
    "url": "https://dictionary.cambridge.org/dictionary/english/incomprehensible",
    "verified": true
  },
  "scrupulous": {
    "url": "https://dictionary.cambridge.org/dictionary/english/scrupulous",
    "verified": true
  },
  "lag": {
    "url": "https://dictionary.cambridge.org/dictionary/english/lag",
    "verified": true
  },
  "linger": {
    "url": "https://dictionary.cambridge.org/dictionary/english/linger",
    "verified": true
  },
  "magnitude": {
    "url": "https://dictionary.cambridge.org/dictionary/english/magnitude",
    "verified": true
  },
  "league": {
    "url": "https://dictionary.cambridge.org/dictionary/english/league",
    "verified": true
  },
  "thermometer": {
    "url": "https://dictionary.cambridge.org/dictionary/english/thermometer",
    "verified": true
  },
  "perpendicular": {
    "url": "https://dictionary.cambridge.org/dictionary/english/perpendicular",
    "verified": true
  },
  "acupuncture": {
    "url": "https://dictionary.cambridge.org/dictionary/english/acupuncture",
    "verified": true
  },
  "outlet": {
    "url": "https://dictionary.cambridge.org/dictionary/english/outlet",
    "verified": true
  },
  "quilt": {
    "url": "https://dictionary.cambridge.org/dictionary/english/quilt",
    "verified": true
  },
  "gaze": {
    "url": "https://dictionary.cambridge.org/dictionary/english/gaze",
    "verified": true
  },
  "revision": {
    "url": "https://dictionary.cambridge.org/dictionary/english/revision",
    "verified": true
  },
  "biography": {
    "url": "https://dictionary.cambridge.org/dictionary/english/biography",
    "verified": true
  },
  "inflation": {
    "url": "https://dictionary.cambridge.org/dictionary/english/inflation",
    "verified": true
  },
  "renaissance": {
    "url": "https://dictionary.cambridge.org/dictionary/english/renaissance",
    "verified": true
  },
  "infection": {
    "url": "https://dictionary.cambridge.org/dictionary/english/infection",
    "verified": true
  },
  "modern": {
    "url": "https://dictionary.cambridge.org/dictionary/english/modern",
    "verified": true
  },
  "fatigue": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fatigue",
    "verified": true
  },
  "grid": {
    "url": "https://dictionary.cambridge.org/dictionary/english/grid",
    "verified": true
  },
  "lumber": {
    "url": "https://dictionary.cambridge.org/dictionary/english/lumber",
    "verified": true
  },
  "miracle": {
    "url": "https://dictionary.cambridge.org/dictionary/english/miracle",
    "verified": true
  },
  "remedy": {
    "url": "https://dictionary.cambridge.org/dictionary/english/remedy",
    "verified": true
  },
  "defy": {
    "url": "https://dictionary.cambridge.org/dictionary/english/defy",
    "verified": true
  },
  "folklore": {
    "url": "https://dictionary.cambridge.org/dictionary/english/folklore",
    "verified": true
  },
  "heed": {
    "url": "https://dictionary.cambridge.org/dictionary/english/heed",
    "verified": true
  },
  "integrity": {
    "url": "https://dictionary.cambridge.org/dictionary/english/integrity",
    "verified": true
  },
  "lateral": {
    "url": "https://dictionary.cambridge.org/dictionary/english/lateral",
    "verified": true
  },
  "extravagant": {
    "url": "https://dictionary.cambridge.org/dictionary/english/extravagant",
    "verified": true
  },
  "inherent": {
    "url": "https://dictionary.cambridge.org/dictionary/english/inherent",
    "verified": true
  },
  "plagiarism": {
    "url": "https://dictionary.cambridge.org/dictionary/english/plagiarism",
    "verified": true
  },
  "encyclopedia": {
    "url": "https://dictionary.cambridge.org/dictionary/english/encyclopedia",
    "verified": true
  },
  "physician": {
    "url": "https://dictionary.cambridge.org/dictionary/english/physician",
    "verified": true
  },
  "prototype": {
    "url": "https://dictionary.cambridge.org/dictionary/english/prototype",
    "verified": true
  },
  "superficial": {
    "url": "https://dictionary.cambridge.org/dictionary/english/superficial",
    "verified": true
  },
  "agility": {
    "url": "https://dictionary.cambridge.org/dictionary/english/agility",
    "verified": true
  },
  "deduce": {
    "url": "https://dictionary.cambridge.org/dictionary/english/deduce",
    "verified": true
  },
  "eternal": {
    "url": "https://dictionary.cambridge.org/dictionary/english/eternal",
    "verified": true
  },
  "excursion": {
    "url": "https://dictionary.cambridge.org/dictionary/english/excursion",
    "verified": true
  },
  "ferment": {
    "url": "https://dictionary.cambridge.org/dictionary/english/ferment",
    "verified": true
  },
  "mower": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mower",
    "verified": true
  },
  "robust": {
    "url": "https://dictionary.cambridge.org/dictionary/english/robust",
    "verified": true
  },
  "sentiment": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sentiment",
    "verified": true
  },
  "sparkle": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sparkle",
    "verified": true
  },
  "summon": {
    "url": "https://dictionary.cambridge.org/dictionary/english/summon",
    "verified": true
  },
  "unveil": {
    "url": "https://dictionary.cambridge.org/dictionary/english/unveil",
    "verified": true
  },
  "adapter": {
    "url": "https://dictionary.cambridge.org/dictionary/english/adapter",
    "verified": true
  },
  "atlas": {
    "url": "https://dictionary.cambridge.org/dictionary/english/atlas",
    "verified": true
  },
  "championship": {
    "url": "https://dictionary.cambridge.org/dictionary/english/championship",
    "verified": true
  },
  "discourse": {
    "url": "https://dictionary.cambridge.org/dictionary/english/discourse",
    "verified": true
  },
  "famine": {
    "url": "https://dictionary.cambridge.org/dictionary/english/famine",
    "verified": true
  },
  "hospitable": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hospitable",
    "verified": true
  },
  "hospitality": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hospitality",
    "verified": true
  },
  "overestimate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/overestimate",
    "verified": true
  },
  "oversimplify": {
    "url": "https://dictionary.cambridge.org/dictionary/english/oversimplify",
    "verified": true
  },
  "precauition": {
    "url": "https://dictionary.cambridge.org/dictionary/english/precaution",
    "verified": true
  },
  "semiconductor": {
    "url": "https://dictionary.cambridge.org/dictionary/english/semiconductor",
    "verified": true
  },
  "sensational": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sensational",
    "verified": true
  },
  "steroid": {
    "url": "https://dictionary.cambridge.org/dictionary/english/steroid",
    "verified": true
  },
  "sympathy": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sympathy",
    "verified": true
  },
  "tranquil": {
    "url": "https://dictionary.cambridge.org/dictionary/english/tranquil",
    "verified": true
  },
  "tranquilizer": {
    "url": "https://dictionary.cambridge.org/dictionary/english/tranquilizer",
    "verified": true
  },
  "underpin": {
    "url": "https://dictionary.cambridge.org/dictionary/english/underpin",
    "verified": true
  },
  "unearth": {
    "url": "https://dictionary.cambridge.org/dictionary/english/unearth",
    "verified": true
  },
  "vaccine": {
    "url": "https://dictionary.cambridge.org/dictionary/english/vaccine",
    "verified": true
  },
  "vow": {
    "url": "https://dictionary.cambridge.org/dictionary/english/vow",
    "verified": true
  },
  "curator": {
    "url": "https://dictionary.cambridge.org/dictionary/english/curator",
    "verified": true
  },
  "congenital": {
    "url": "https://dictionary.cambridge.org/dictionary/english/congenital",
    "verified": true
  },
  "guild": {
    "url": "https://dictionary.cambridge.org/dictionary/english/guild",
    "verified": true
  },
  "gazelle": {
    "url": "https://dictionary.cambridge.org/dictionary/english/gazelle",
    "verified": true
  },
  "elongate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/elongate",
    "verified": true
  },
  "epitome": {
    "url": "https://dictionary.cambridge.org/dictionary/english/epitome",
    "verified": true
  },
  "herder": {
    "url": "https://dictionary.cambridge.org/dictionary/english/herder",
    "verified": true
  },
  "edifice": {
    "url": "https://dictionary.cambridge.org/dictionary/english/edifice",
    "verified": true
  },
  "niche": {
    "url": "https://dictionary.cambridge.org/dictionary/english/niche",
    "verified": true
  },
  "hem": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hem",
    "verified": true
  },
  "oscillate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/oscillate",
    "verified": true
  },
  "blockage": {
    "url": "https://dictionary.cambridge.org/dictionary/english/blockage",
    "verified": true
  },
  "bison": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bison",
    "verified": true
  },
  "mercantile": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mercantile",
    "verified": true
  },
  "clump": {
    "url": "https://dictionary.cambridge.org/dictionary/english/clump",
    "verified": true
  },
  "viscera": {
    "url": "https://dictionary.cambridge.org/dictionary/english/viscera",
    "verified": true
  },
  "piston": {
    "url": "https://dictionary.cambridge.org/dictionary/english/piston",
    "verified": true
  },
  "incongruous": {
    "url": "https://dictionary.cambridge.org/dictionary/english/incongruous",
    "verified": true
  },
  "hieroglyph": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hieroglyph",
    "verified": true
  },
  "ravage": {
    "url": "https://dictionary.cambridge.org/dictionary/english/ravage",
    "verified": true
  },
  "gorilla": {
    "url": "https://dictionary.cambridge.org/dictionary/english/gorilla",
    "verified": true
  },
  "caravan": {
    "url": "https://dictionary.cambridge.org/dictionary/english/caravan",
    "verified": true
  },
  "presage": {
    "url": "https://www.merriam-webster.com/dictionary/presage",
    "verified": true
  },
  "choreographer": {
    "url": "https://dictionary.cambridge.org/dictionary/english/choreographer",
    "verified": true
  },
  "caravel": {
    "url": "https://www.merriam-webster.com/dictionary/caravel",
    "verified": true
  },
  "conservatism": {
    "url": "https://dictionary.cambridge.org/dictionary/english/conservatism",
    "verified": true
  },
  "interlock": {
    "url": "https://dictionary.cambridge.org/dictionary/english/interlock",
    "verified": true
  },
  "nickel": {
    "url": "https://dictionary.cambridge.org/dictionary/english/nickel",
    "verified": true
  },
  "guilder": {
    "url": "https://dictionary.cambridge.org/dictionary/english/guilder",
    "verified": true
  },
  "buzzer": {
    "url": "https://dictionary.cambridge.org/dictionary/english/buzzer",
    "verified": true
  },
  "faunal": {
    "url": "https://dictionary.cambridge.org/dictionary/english/faunal",
    "verified": true
  },
  "necrosis": {
    "url": "https://dictionary.cambridge.org/dictionary/english/necrosis",
    "verified": true
  },
  "refractory": {
    "url": "https://dictionary.cambridge.org/dictionary/english/refractory",
    "verified": true
  },
  "semisubsistence": {
    "url": "https://agrovoc.fao.org/browse/agrovoc/en/page/c_2bc8a199",
    "verified": true
  },
  "empress": {
    "url": "https://dictionary.cambridge.org/dictionary/english/empress",
    "verified": true
  },
  "flange": {
    "url": "https://dictionary.cambridge.org/dictionary/english/flange",
    "verified": true
  },
  "pastoralism": {
    "url": "https://www.merriam-webster.com/dictionary/pastoralism",
    "verified": true
  },
  "aborigine": {
    "url": "https://dictionary.cambridge.org/dictionary/english/aborigine",
    "verified": true
  },
  "manganese": {
    "url": "https://dictionary.cambridge.org/dictionary/english/manganese",
    "verified": true
  },
  "canopy": {
    "url": "https://dictionary.cambridge.org/dictionary/english/canopy",
    "verified": true
  },
  "gaseous": {
    "url": "https://dictionary.cambridge.org/dictionary/english/gaseous",
    "verified": true
  },
  "nectar": {
    "url": "https://dictionary.cambridge.org/dictionary/english/nectar",
    "verified": true
  },
  "brackish": {
    "url": "https://dictionary.cambridge.org/dictionary/english/brackish",
    "verified": true
  },
  "chloride": {
    "url": "https://dictionary.cambridge.org/dictionary/english/chloride",
    "verified": true
  },
  "bombard": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bombard",
    "verified": true
  },
  "equilibrium": {
    "url": "https://dictionary.cambridge.org/dictionary/english/equilibrium",
    "verified": true
  },
  "beau": {
    "url": "https://dictionary.cambridge.org/dictionary/english/beau",
    "verified": true
  },
  "cobalt": {
    "url": "https://dictionary.cambridge.org/dictionary/english/cobalt",
    "verified": true
  },
  "forager": {
    "url": "https://dictionary.cambridge.org/dictionary/english/forager",
    "verified": true
  },
  "brusquely": {
    "url": "https://dictionary.cambridge.org/dictionary/english/brusquely",
    "verified": true
  },
  "goof": {
    "url": "https://dictionary.cambridge.org/dictionary/english/goof",
    "verified": true
  },
  "gripe": {
    "url": "https://dictionary.cambridge.org/dictionary/english/gripe",
    "verified": true
  },
  "fissure": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fissure",
    "verified": true
  },
  "confer": {
    "url": "https://dictionary.cambridge.org/dictionary/english/confer",
    "verified": true
  },
  "mortality": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mortality",
    "verified": true
  },
  "crevice": {
    "url": "https://dictionary.cambridge.org/dictionary/english/crevice",
    "verified": true
  },
  "crevasse": {
    "url": "https://dictionary.cambridge.org/dictionary/english/crevasse",
    "verified": true
  },
  "fossilize": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fossilize",
    "verified": true
  },
  "query": {
    "url": "https://dictionary.cambridge.org/dictionary/english/query",
    "verified": true
  },
  "harp": {
    "url": "https://dictionary.cambridge.org/dictionary/english/harp",
    "verified": true
  },
  "concur": {
    "url": "https://dictionary.cambridge.org/dictionary/english/concur",
    "verified": true
  },
  "cuticle": {
    "url": "https://dictionary.cambridge.org/dictionary/english/cuticle",
    "verified": true
  },
  "contour": {
    "url": "https://dictionary.cambridge.org/dictionary/english/contour",
    "verified": true
  },
  "commonality": {
    "url": "https://dictionary.cambridge.org/dictionary/english/commonality",
    "verified": true
  },
  "crystalline": {
    "url": "https://dictionary.cambridge.org/dictionary/english/crystalline",
    "verified": true
  },
  "amniotic": {
    "url": "https://dictionary.cambridge.org/dictionary/english/amniotic",
    "verified": true
  },
  "marshal": {
    "url": "https://dictionary.cambridge.org/dictionary/english/marshal",
    "verified": true
  },
  "encapsulate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/encapsulate",
    "verified": true
  },
  "zinc": {
    "url": "https://dictionary.cambridge.org/dictionary/english/zinc",
    "verified": true
  },
  "estivate": {
    "url": "https://www.merriam-webster.com/dictionary/estivate",
    "verified": true
  },
  "gull": {
    "url": "https://dictionary.cambridge.org/dictionary/english/gull",
    "verified": true
  },
  "outcrop": {
    "url": "https://dictionary.cambridge.org/dictionary/english/outcrop",
    "verified": true
  },
  "grasshopper": {
    "url": "https://dictionary.cambridge.org/dictionary/english/grasshopper",
    "verified": true
  },
  "gusher": {
    "url": "https://dictionary.cambridge.org/dictionary/english/gusher",
    "verified": true
  },
  "adobe": {
    "url": "https://dictionary.cambridge.org/dictionary/english/adobe",
    "verified": true
  },
  "sulfate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sulfate",
    "verified": true
  },
  "brook": {
    "url": "https://dictionary.cambridge.org/dictionary/english/brook",
    "verified": true
  },
  "demean": {
    "url": "https://dictionary.cambridge.org/dictionary/english/demean",
    "verified": true
  },
  "precipitation": {
    "url": "https://dictionary.cambridge.org/dictionary/english/precipitation",
    "verified": true
  },
  "phosphorus": {
    "url": "https://dictionary.cambridge.org/dictionary/english/phosphorus",
    "verified": true
  },
  "grapple": {
    "url": "https://dictionary.cambridge.org/dictionary/english/grapple",
    "verified": true
  },
  "rift": {
    "url": "https://dictionary.cambridge.org/dictionary/english/rift",
    "verified": true
  },
  "diffuser": {
    "url": "https://dictionary.cambridge.org/dictionary/english/diffuser",
    "verified": true
  },
  "excruciate": {
    "url": "https://www.merriam-webster.com/dictionary/excruciate",
    "verified": true
  },
  "eardrum": {
    "url": "https://dictionary.cambridge.org/dictionary/english/eardrum",
    "verified": true
  },
  "prairie": {
    "url": "https://dictionary.cambridge.org/dictionary/english/prairie",
    "verified": true
  },
  "himalayas": {
    "url": "https://www.merriam-webster.com/dictionary/Himalayas",
    "verified": true
  },
  "arboreal": {
    "url": "https://dictionary.cambridge.org/dictionary/english/arboreal",
    "verified": true
  },
  "neurotransmitter": {
    "url": "https://dictionary.cambridge.org/dictionary/english/neurotransmitter",
    "verified": true
  },
  "ephemeral": {
    "url": "https://dictionary.cambridge.org/dictionary/english/ephemeral",
    "verified": true
  },
  "folktale": {
    "url": "https://dictionary.cambridge.org/dictionary/english/folktale",
    "verified": true
  },
  "sludge": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sludge",
    "verified": true
  },
  "hiccup": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hiccup",
    "verified": true
  },
  "entrench": {
    "url": "https://dictionary.cambridge.org/dictionary/english/entrench",
    "verified": true
  },
  "figurine": {
    "url": "https://dictionary.cambridge.org/dictionary/english/figurine",
    "verified": true
  },
  "constituency": {
    "url": "https://dictionary.cambridge.org/dictionary/english/constituency",
    "verified": true
  },
  "conifer": {
    "url": "https://dictionary.cambridge.org/dictionary/english/conifer",
    "verified": true
  },
  "acorn": {
    "url": "https://dictionary.cambridge.org/dictionary/english/acorn",
    "verified": true
  },
  "cheep": {
    "url": "https://dictionary.cambridge.org/dictionary/english/cheep",
    "verified": true
  },
  "hearth": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hearth",
    "verified": true
  },
  "serpentine": {
    "url": "https://dictionary.cambridge.org/dictionary/english/serpentine",
    "verified": true
  },
  "hiss": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hiss",
    "verified": true
  },
  "pathogen": {
    "url": "https://dictionary.cambridge.org/dictionary/english/pathogen",
    "verified": true
  },
  "algae": {
    "url": "https://dictionary.cambridge.org/dictionary/english/algae",
    "verified": true
  },
  "bask": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bask",
    "verified": true
  },
  "arthropod": {
    "url": "https://dictionary.cambridge.org/dictionary/english/arthropod",
    "verified": true
  },
  "ameliorate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/ameliorate",
    "verified": true
  },
  "anthropological": {
    "url": "https://dictionary.cambridge.org/dictionary/english/anthropological",
    "verified": true
  },
  "conspicuous": {
    "url": "https://dictionary.cambridge.org/dictionary/english/conspicuous",
    "verified": true
  },
  "bellow": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bellow",
    "verified": true
  },
  "choreograph": {
    "url": "https://dictionary.cambridge.org/dictionary/english/choreograph",
    "verified": true
  },
  "fecund": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fecund",
    "verified": true
  },
  "turnpike": {
    "url": "https://dictionary.cambridge.org/dictionary/english/turnpike",
    "verified": true
  },
  "hoe": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hoe",
    "verified": true
  },
  "pleistocene": {
    "url": "https://dictionary.cambridge.org/dictionary/english/pleistocene",
    "verified": true
  },
  "forage": {
    "url": "https://dictionary.cambridge.org/dictionary/english/forage",
    "verified": true
  },
  "aquifer": {
    "url": "https://dictionary.cambridge.org/dictionary/english/aquifer",
    "verified": true
  },
  "dune": {
    "url": "https://dictionary.cambridge.org/dictionary/english/dune",
    "verified": true
  },
  "miniature": {
    "url": "https://dictionary.cambridge.org/dictionary/english/miniature",
    "verified": true
  },
  "obsidian": {
    "url": "https://dictionary.cambridge.org/dictionary/english/obsidian",
    "verified": true
  },
  "supersede": {
    "url": "https://dictionary.cambridge.org/dictionary/english/supersede",
    "verified": true
  },
  "bovine": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bovine",
    "verified": true
  },
  "jurassic": {
    "url": "https://dictionary.cambridge.org/dictionary/english/jurassic",
    "verified": true
  },
  "circumvent": {
    "url": "https://dictionary.cambridge.org/dictionary/english/circumvent",
    "verified": true
  },
  "parish": {
    "url": "https://dictionary.cambridge.org/dictionary/english/parish",
    "verified": true
  },
  "chimp": {
    "url": "https://dictionary.cambridge.org/dictionary/english/chimp",
    "verified": true
  },
  "steppe": {
    "url": "https://dictionary.cambridge.org/dictionary/english/steppe",
    "verified": true
  },
  "aspen": {
    "url": "https://dictionary.cambridge.org/dictionary/english/aspen",
    "verified": true
  },
  "taro": {
    "url": "https://dictionary.cambridge.org/dictionary/english/taro",
    "verified": true
  },
  "barter": {
    "url": "https://dictionary.cambridge.org/dictionary/english/barter",
    "verified": true
  },
  "cult": {
    "url": "https://dictionary.cambridge.org/dictionary/english/cult",
    "verified": true
  },
  "chariot": {
    "url": "https://dictionary.cambridge.org/dictionary/english/chariot",
    "verified": true
  },
  "bidder": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bidder",
    "verified": true
  },
  "titanium": {
    "url": "https://dictionary.cambridge.org/dictionary/english/titanium",
    "verified": true
  },
  "calve": {
    "url": "https://dictionary.cambridge.org/dictionary/english/calve",
    "verified": true
  },
  "instigate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/instigate",
    "verified": true
  },
  "bode": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bode",
    "verified": true
  },
  "genotype": {
    "url": "https://dictionary.cambridge.org/dictionary/english/genotype",
    "verified": true
  },
  "enamor": {
    "url": "https://dictionary.cambridge.org/dictionary/english/enamor",
    "verified": true
  },
  "cobra": {
    "url": "https://dictionary.cambridge.org/dictionary/english/cobra",
    "verified": true
  },
  "flue": {
    "url": "https://dictionary.cambridge.org/dictionary/english/flue",
    "verified": true
  },
  "ooze": {
    "url": "https://dictionary.cambridge.org/dictionary/english/ooze",
    "verified": true
  },
  "resin": {
    "url": "https://dictionary.cambridge.org/dictionary/english/resin",
    "verified": true
  },
  "alp": {
    "url": "https://www.merriam-webster.com/dictionary/alp",
    "verified": true
  },
  "kinetic": {
    "url": "https://dictionary.cambridge.org/dictionary/english/kinetic",
    "verified": true
  },
  "estuary": {
    "url": "https://dictionary.cambridge.org/dictionary/english/estuary",
    "verified": true
  },
  "infantile": {
    "url": "https://dictionary.cambridge.org/dictionary/english/infantile",
    "verified": true
  },
  "remuneration": {
    "url": "https://dictionary.cambridge.org/dictionary/english/remuneration",
    "verified": true
  },
  "farmstead": {
    "url": "https://dictionary.cambridge.org/dictionary/english/farmstead",
    "verified": true
  },
  "clove": {
    "url": "https://dictionary.cambridge.org/dictionary/english/clove",
    "verified": true
  },
  "fortuitous": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fortuitous",
    "verified": true
  },
  "flutter": {
    "url": "https://dictionary.cambridge.org/dictionary/english/flutter",
    "verified": true
  },
  "genus": {
    "url": "https://dictionary.cambridge.org/dictionary/english/genus",
    "verified": true
  },
  "petrifaction": {
    "url": "https://dictionary.cambridge.org/dictionary/english/petrifaction",
    "verified": true
  },
  "democratization": {
    "url": "https://dictionary.cambridge.org/dictionary/english/democratization",
    "verified": true
  },
  "deity": {
    "url": "https://dictionary.cambridge.org/dictionary/english/deity",
    "verified": true
  },
  "ensemble": {
    "url": "https://dictionary.cambridge.org/dictionary/english/ensemble",
    "verified": true
  },
  "protract": {
    "url": "https://dictionary.cambridge.org/dictionary/english/protract",
    "verified": true
  },
  "bushel": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bushel",
    "verified": true
  },
  "convulsion": {
    "url": "https://dictionary.cambridge.org/dictionary/english/convulsion",
    "verified": true
  },
  "harken": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hearken",
    "verified": true
  },
  "caucasian": {
    "url": "https://dictionary.cambridge.org/dictionary/english/caucasian",
    "verified": true
  },
  "scanty": {
    "url": "https://dictionary.cambridge.org/dictionary/english/scanty",
    "verified": true
  },
  "custodian": {
    "url": "https://dictionary.cambridge.org/dictionary/english/custodian",
    "verified": true
  },
  "bowel": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bowel",
    "verified": true
  },
  "relic": {
    "url": "https://dictionary.cambridge.org/dictionary/english/relic",
    "verified": true
  },
  "fling": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fling",
    "verified": true
  },
  "ion": {
    "url": "https://dictionary.cambridge.org/dictionary/english/ion",
    "verified": true
  },
  "fledgling": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fledgling",
    "verified": true
  },
  "excrete": {
    "url": "https://dictionary.cambridge.org/dictionary/english/excrete",
    "verified": true
  },
  "deciduous": {
    "url": "https://dictionary.cambridge.org/dictionary/english/deciduous",
    "verified": true
  },
  "hare": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hare",
    "verified": true
  },
  "legume": {
    "url": "https://dictionary.cambridge.org/dictionary/english/legume",
    "verified": true
  },
  "mutualism": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mutualism",
    "verified": true
  },
  "epoch": {
    "url": "https://dictionary.cambridge.org/dictionary/english/epoch",
    "verified": true
  },
  "mustard": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mustard",
    "verified": true
  },
  "pomegranate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/pomegranate",
    "verified": true
  },
  "aria": {
    "url": "https://dictionary.cambridge.org/dictionary/english/aria",
    "verified": true
  },
  "flotation": {
    "url": "https://dictionary.cambridge.org/dictionary/english/flotation",
    "verified": true
  },
  "scrubland": {
    "url": "https://www.merriam-webster.com/dictionary/scrubland",
    "verified": true
  },
  "fresco": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fresco",
    "verified": true
  },
  "caput": {
    "url": "https://www.collinsdictionary.com/dictionary/english/caput",
    "verified": true
  },
  "hemlock": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hemlock",
    "verified": true
  },
  "detritus": {
    "url": "https://dictionary.cambridge.org/dictionary/english/detritus",
    "verified": true
  },
  "intertidal": {
    "url": "https://www.merriam-webster.com/dictionary/intertidal",
    "verified": true
  },
  "stratify": {
    "url": "https://dictionary.cambridge.org/dictionary/english/stratify",
    "verified": true
  },
  "shale": {
    "url": "https://dictionary.cambridge.org/dictionary/english/shale",
    "verified": true
  },
  "feud": {
    "url": "https://dictionary.cambridge.org/dictionary/english/feud",
    "verified": true
  },
  "chondrite": {
    "url": "https://www.merriam-webster.com/dictionary/chondrite",
    "verified": true
  },
  "fortification": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fortification",
    "verified": true
  },
  "fern": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fern",
    "verified": true
  },
  "despondent": {
    "url": "https://dictionary.cambridge.org/dictionary/english/despondent",
    "verified": true
  },
  "clamor": {
    "url": "https://dictionary.cambridge.org/dictionary/english/clamor",
    "verified": true
  },
  "cascade": {
    "url": "https://dictionary.cambridge.org/dictionary/english/cascade",
    "verified": true
  },
  "chromosome": {
    "url": "https://dictionary.cambridge.org/dictionary/english/chromosome",
    "verified": true
  },
  "nebula": {
    "url": "https://dictionary.cambridge.org/dictionary/english/nebula",
    "verified": true
  },
  "loam": {
    "url": "https://dictionary.cambridge.org/dictionary/english/loam",
    "verified": true
  },
  "precipitate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/precipitate",
    "verified": true
  },
  "befit": {
    "url": "https://dictionary.cambridge.org/dictionary/english/befit",
    "verified": true
  },
  "capillary": {
    "url": "https://dictionary.cambridge.org/dictionary/english/capillary",
    "verified": true
  },
  "fen": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fen",
    "verified": true
  },
  "floodplain": {
    "url": "https://dictionary.cambridge.org/dictionary/english/floodplain",
    "verified": true
  },
  "enzyme": {
    "url": "https://dictionary.cambridge.org/dictionary/english/enzyme",
    "verified": true
  },
  "garrison": {
    "url": "https://dictionary.cambridge.org/dictionary/english/garrison",
    "verified": true
  },
  "hawk": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hawk",
    "verified": true
  },
  "intraspecies": {
    "url": "https://www.merriam-webster.com/dictionary/intraspecies",
    "verified": true
  },
  "derrick": {
    "url": "https://dictionary.cambridge.org/dictionary/english/derrick",
    "verified": true
  },
  "boulder": {
    "url": "https://dictionary.cambridge.org/dictionary/english/boulder",
    "verified": true
  },
  "calcite": {
    "url": "https://www.merriam-webster.com/dictionary/calcite",
    "verified": true
  },
  "bulldozer": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bulldozer",
    "verified": true
  },
  "floral": {
    "url": "https://dictionary.cambridge.org/dictionary/english/floral",
    "verified": true
  },
  "dredge": {
    "url": "https://dictionary.cambridge.org/dictionary/english/dredge",
    "verified": true
  },
  "crumble": {
    "url": "https://dictionary.cambridge.org/dictionary/english/crumble",
    "verified": true
  },
  "exponential": {
    "url": "https://dictionary.cambridge.org/dictionary/english/exponential",
    "verified": true
  },
  "noria": {
    "url": "https://www.merriam-webster.com/dictionary/noria",
    "verified": true
  },
  "gully": {
    "url": "https://dictionary.cambridge.org/dictionary/english/gully",
    "verified": true
  },
  "smelter": {
    "url": "https://dictionary.cambridge.org/dictionary/english/smelter",
    "verified": true
  },
  "pellet": {
    "url": "https://dictionary.cambridge.org/dictionary/english/pellet",
    "verified": true
  },
  "caterpillar": {
    "url": "https://dictionary.cambridge.org/dictionary/english/caterpillar",
    "verified": true
  },
  "laden": {
    "url": "https://dictionary.cambridge.org/dictionary/english/laden",
    "verified": true
  },
  "sulfide": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sulfide",
    "verified": true
  },
  "scavenger": {
    "url": "https://dictionary.cambridge.org/dictionary/english/scavenger",
    "verified": true
  },
  "fir": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fir",
    "verified": true
  },
  "spore": {
    "url": "https://dictionary.cambridge.org/dictionary/english/spore",
    "verified": true
  },
  "detractor": {
    "url": "https://dictionary.cambridge.org/dictionary/english/detractor",
    "verified": true
  },
  "lobe": {
    "url": "https://dictionary.cambridge.org/dictionary/english/lobe",
    "verified": true
  },
  "grunt": {
    "url": "https://dictionary.cambridge.org/dictionary/english/grunt",
    "verified": true
  },
  "conceptualize": {
    "url": "https://dictionary.cambridge.org/dictionary/english/conceptualize",
    "verified": true
  },
  "flipper": {
    "url": "https://dictionary.cambridge.org/dictionary/english/flipper",
    "verified": true
  },
  "maroon": {
    "url": "https://dictionary.cambridge.org/dictionary/english/maroon",
    "verified": true
  },
  "diagonal": {
    "url": "https://dictionary.cambridge.org/dictionary/english/diagonal",
    "verified": true
  },
  "fiddler": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fiddler",
    "verified": true
  },
  "commensalism": {
    "url": "https://dictionary.cambridge.org/dictionary/english/commensalism",
    "verified": true
  },
  "quartz": {
    "url": "https://dictionary.cambridge.org/dictionary/english/quartz",
    "verified": true
  },
  "fluorescent": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fluorescent",
    "verified": true
  },
  "coyote": {
    "url": "https://dictionary.cambridge.org/dictionary/english/coyote",
    "verified": true
  },
  "broom": {
    "url": "https://dictionary.cambridge.org/dictionary/english/broom",
    "verified": true
  },
  "commissioner": {
    "url": "https://dictionary.cambridge.org/dictionary/english/commissioner",
    "verified": true
  },
  "oceania": {
    "url": "https://dictionary.cambridge.org/dictionary/english/oceania",
    "verified": true
  },
  "geyser": {
    "url": "https://dictionary.cambridge.org/dictionary/english/geyser",
    "verified": true
  },
  "diode": {
    "url": "https://dictionary.cambridge.org/dictionary/english/diode",
    "verified": true
  },
  "slab": {
    "url": "https://dictionary.cambridge.org/dictionary/english/slab",
    "verified": true
  },
  "etch": {
    "url": "https://dictionary.cambridge.org/dictionary/english/etch",
    "verified": true
  },
  "flank": {
    "url": "https://dictionary.cambridge.org/dictionary/english/flank",
    "verified": true
  },
  "conglomerate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/conglomerate",
    "verified": true
  },
  "engraving": {
    "url": "https://dictionary.cambridge.org/dictionary/english/engraving",
    "verified": true
  },
  "granule": {
    "url": "https://dictionary.cambridge.org/dictionary/english/granule",
    "verified": true
  },
  "emulsion": {
    "url": "https://dictionary.cambridge.org/dictionary/english/emulsion",
    "verified": true
  },
  "hydrosphere": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hydrosphere",
    "verified": true
  },
  "lithosphere": {
    "url": "https://dictionary.cambridge.org/dictionary/english/lithosphere",
    "verified": true
  },
  "oxygen": {
    "url": "https://dictionary.cambridge.org/dictionary/english/oxygen",
    "verified": true
  },
  "carbon dioxide": {
    "url": "https://dictionary.cambridge.org/dictionary/english/carbon-dioxide",
    "verified": true
  },
  "hydrogen": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hydrogen",
    "verified": true
  },
  "mantle": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mantle",
    "verified": true
  },
  "mishap": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mishap",
    "verified": true
  },
  "catastrophic": {
    "url": "https://dictionary.cambridge.org/dictionary/english/catastrophic",
    "verified": true
  },
  "calamity": {
    "url": "https://dictionary.cambridge.org/dictionary/english/calamity",
    "verified": true
  },
  "jeopardise": {
    "url": "https://dictionary.cambridge.org/dictionary/english/jeopardise",
    "verified": true
  },
  "destructive": {
    "url": "https://dictionary.cambridge.org/dictionary/english/destructive",
    "verified": true
  },
  "el niño": {
    "url": "https://dictionary.cambridge.org/dictionary/english/el-nino",
    "verified": true
  },
  "greenhouse": {
    "url": "https://dictionary.cambridge.org/dictionary/english/greenhouse",
    "verified": true
  },
  "mineral": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mineral",
    "verified": true
  },
  "gust": {
    "url": "https://dictionary.cambridge.org/dictionary/english/gust",
    "verified": true
  },
  "gale": {
    "url": "https://dictionary.cambridge.org/dictionary/english/gale",
    "verified": true
  },
  "tornado": {
    "url": "https://dictionary.cambridge.org/dictionary/english/tornado",
    "verified": true
  },
  "typhoon": {
    "url": "https://dictionary.cambridge.org/dictionary/english/typhoon",
    "verified": true
  },
  "monsoon": {
    "url": "https://dictionary.cambridge.org/dictionary/english/monsoon",
    "verified": true
  },
  "magma": {
    "url": "https://dictionary.cambridge.org/dictionary/english/magma",
    "verified": true
  },
  "thermodynamic": {
    "url": "https://dictionary.cambridge.org/dictionary/english/thermodynamic",
    "verified": true
  },
  "smog": {
    "url": "https://dictionary.cambridge.org/dictionary/english/smog",
    "verified": true
  },
  "tsunami": {
    "url": "https://dictionary.cambridge.org/dictionary/english/tsunami",
    "verified": true
  },
  "flooding": {
    "url": "https://dictionary.cambridge.org/dictionary/english/flooding",
    "verified": true
  },
  "earthquake": {
    "url": "https://dictionary.cambridge.org/dictionary/english/earthquake",
    "verified": true
  },
  "seismic": {
    "url": "https://dictionary.cambridge.org/dictionary/english/seismic",
    "verified": true
  },
  "landscape": {
    "url": "https://dictionary.cambridge.org/dictionary/english/landscape",
    "verified": true
  },
  "continent": {
    "url": "https://dictionary.cambridge.org/dictionary/english/continent",
    "verified": true
  },
  "plain": {
    "url": "https://dictionary.cambridge.org/dictionary/english/plain",
    "verified": true
  },
  "oasis": {
    "url": "https://dictionary.cambridge.org/dictionary/english/oasis",
    "verified": true
  },
  "globe": {
    "url": "https://dictionary.cambridge.org/dictionary/english/globe",
    "verified": true
  },
  "equal": {
    "url": "https://dictionary.cambridge.org/dictionary/english/equal",
    "verified": true
  },
  "arctic": {
    "url": "https://dictionary.cambridge.org/dictionary/english/arctic",
    "verified": true
  },
  "pole": {
    "url": "https://dictionary.cambridge.org/dictionary/english/pole",
    "verified": true
  },
  "upgrade": {
    "url": "https://dictionary.cambridge.org/dictionary/english/upgrade",
    "verified": true
  },
  "atlantic": {
    "url": "https://dictionary.cambridge.org/dictionary/english/atlantic",
    "verified": true
  },
  "ocean": {
    "url": "https://dictionary.cambridge.org/dictionary/english/ocean",
    "verified": true
  },
  "pacific": {
    "url": "https://dictionary.cambridge.org/dictionary/english/pacific",
    "verified": true
  },
  "marine": {
    "url": "https://dictionary.cambridge.org/dictionary/english/marine",
    "verified": true
  },
  "navigation": {
    "url": "https://dictionary.cambridge.org/dictionary/english/navigation",
    "verified": true
  },
  "gulf": {
    "url": "https://dictionary.cambridge.org/dictionary/english/gulf",
    "verified": true
  },
  "beach": {
    "url": "https://dictionary.cambridge.org/dictionary/english/beach",
    "verified": true
  },
  "shore": {
    "url": "https://dictionary.cambridge.org/dictionary/english/shore",
    "verified": true
  },
  "tide": {
    "url": "https://dictionary.cambridge.org/dictionary/english/tide",
    "verified": true
  },
  "current": {
    "url": "https://dictionary.cambridge.org/dictionary/english/current",
    "verified": true
  },
  "stream": {
    "url": "https://dictionary.cambridge.org/dictionary/english/stream",
    "verified": true
  },
  "source": {
    "url": "https://dictionary.cambridge.org/dictionary/english/source",
    "verified": true
  },
  "flat": {
    "url": "https://dictionary.cambridge.org/dictionary/english/flat",
    "verified": true
  },
  "sandy": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sandy",
    "verified": true
  },
  "stony": {
    "url": "https://dictionary.cambridge.org/dictionary/english/stony",
    "verified": true
  },
  "mainland": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mainland",
    "verified": true
  },
  "weather": {
    "url": "https://dictionary.cambridge.org/dictionary/english/weather",
    "verified": true
  },
  "meteorology": {
    "url": "https://dictionary.cambridge.org/dictionary/english/meteorology",
    "verified": true
  },
  "mild": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mild",
    "verified": true
  },
  "heating": {
    "url": "https://dictionary.cambridge.org/dictionary/english/heating",
    "verified": true
  },
  "tropics": {
    "url": "https://dictionary.cambridge.org/dictionary/english/tropics",
    "verified": true
  },
  "snowy": {
    "url": "https://dictionary.cambridge.org/dictionary/english/snowy",
    "verified": true
  },
  "freeze": {
    "url": "https://dictionary.cambridge.org/dictionary/english/freeze",
    "verified": true
  },
  "tremble": {
    "url": "https://dictionary.cambridge.org/dictionary/english/tremble",
    "verified": true
  },
  "shiver": {
    "url": "https://dictionary.cambridge.org/dictionary/english/shiver",
    "verified": true
  },
  "thunder": {
    "url": "https://dictionary.cambridge.org/dictionary/english/thunder",
    "verified": true
  },
  "lightning": {
    "url": "https://dictionary.cambridge.org/dictionary/english/lightning",
    "verified": true
  },
  "stormy": {
    "url": "https://dictionary.cambridge.org/dictionary/english/stormy",
    "verified": true
  },
  "downpour": {
    "url": "https://dictionary.cambridge.org/dictionary/english/downpour",
    "verified": true
  },
  "rainfall": {
    "url": "https://dictionary.cambridge.org/dictionary/english/rainfall",
    "verified": true
  },
  "sprinkle": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sprinkle",
    "verified": true
  },
  "rainbow": {
    "url": "https://dictionary.cambridge.org/dictionary/english/rainbow",
    "verified": true
  },
  "shower": {
    "url": "https://dictionary.cambridge.org/dictionary/english/shower",
    "verified": true
  },
  "temperature": {
    "url": "https://dictionary.cambridge.org/dictionary/english/temperature",
    "verified": true
  },
  "forecast": {
    "url": "https://dictionary.cambridge.org/dictionary/english/forecast",
    "verified": true
  },
  "mountain": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mountain",
    "verified": true
  },
  "range": {
    "url": "https://dictionary.cambridge.org/dictionary/english/range",
    "verified": true
  },
  "valley": {
    "url": "https://dictionary.cambridge.org/dictionary/english/valley",
    "verified": true
  },
  "hillside": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hillside",
    "verified": true
  },
  "southern": {
    "url": "https://dictionary.cambridge.org/dictionary/english/southern",
    "verified": true
  },
  "southeast": {
    "url": "https://dictionary.cambridge.org/dictionary/english/southeast",
    "verified": true
  },
  "southwest": {
    "url": "https://dictionary.cambridge.org/dictionary/english/southwest",
    "verified": true
  },
  "northeast": {
    "url": "https://dictionary.cambridge.org/dictionary/english/northeast",
    "verified": true
  },
  "northwest": {
    "url": "https://dictionary.cambridge.org/dictionary/english/northwest",
    "verified": true
  },
  "eastern": {
    "url": "https://dictionary.cambridge.org/dictionary/english/eastern",
    "verified": true
  },
  "oriental": {
    "url": "https://dictionary.cambridge.org/dictionary/english/oriental",
    "verified": true
  },
  "irregularly": {
    "url": "https://dictionary.cambridge.org/dictionary/english/irregularly",
    "verified": true
  },
  "muddy": {
    "url": "https://dictionary.cambridge.org/dictionary/english/muddy",
    "verified": true
  },
  "dirt": {
    "url": "https://dictionary.cambridge.org/dictionary/english/dirt",
    "verified": true
  },
  "suburb": {
    "url": "https://dictionary.cambridge.org/dictionary/english/suburb",
    "verified": true
  },
  "outskirts": {
    "url": "https://dictionary.cambridge.org/dictionary/english/outskirts",
    "verified": true
  },
  "pollution": {
    "url": "https://dictionary.cambridge.org/dictionary/english/pollution",
    "verified": true
  },
  "geology": {
    "url": "https://dictionary.cambridge.org/dictionary/english/geology",
    "verified": true
  },
  "gap": {
    "url": "https://dictionary.cambridge.org/dictionary/english/gap",
    "verified": true
  },
  "splendid": {
    "url": "https://dictionary.cambridge.org/dictionary/english/splendid",
    "verified": true
  },
  "grand": {
    "url": "https://dictionary.cambridge.org/dictionary/english/grand",
    "verified": true
  },
  "super": {
    "url": "https://dictionary.cambridge.org/dictionary/english/super",
    "verified": true
  },
  "interesting": {
    "url": "https://dictionary.cambridge.org/dictionary/english/interesting",
    "verified": true
  },
  "wilderness": {
    "url": "https://dictionary.cambridge.org/dictionary/english/wilderness",
    "verified": true
  },
  "desert": {
    "url": "https://dictionary.cambridge.org/dictionary/english/desert",
    "verified": true
  },
  "fertilise": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fertilize",
    "verified": true
  },
  "sunrise": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sunrise",
    "verified": true
  },
  "sunset": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sunset",
    "verified": true
  },
  "dusk": {
    "url": "https://dictionary.cambridge.org/dictionary/english/dusk",
    "verified": true
  },
  "heaven": {
    "url": "https://dictionary.cambridge.org/dictionary/english/heaven",
    "verified": true
  },
  "paradise": {
    "url": "https://dictionary.cambridge.org/dictionary/english/paradise",
    "verified": true
  },
  "sunshine": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sunshine",
    "verified": true
  },
  "shadow": {
    "url": "https://dictionary.cambridge.org/dictionary/english/shadow",
    "verified": true
  },
  "vapour": {
    "url": "https://dictionary.cambridge.org/dictionary/english/vapour",
    "verified": true
  },
  "reservoir": {
    "url": "https://dictionary.cambridge.org/dictionary/english/reservoir",
    "verified": true
  },
  "waterfall": {
    "url": "https://dictionary.cambridge.org/dictionary/english/waterfall",
    "verified": true
  },
  "spring": {
    "url": "https://dictionary.cambridge.org/dictionary/english/spring",
    "verified": true
  },
  "dew": {
    "url": "https://dictionary.cambridge.org/dictionary/english/dew",
    "verified": true
  },
  "gush": {
    "url": "https://dictionary.cambridge.org/dictionary/english/gush",
    "verified": true
  },
  "intensity": {
    "url": "https://dictionary.cambridge.org/dictionary/english/intensity",
    "verified": true
  },
  "intensive": {
    "url": "https://dictionary.cambridge.org/dictionary/english/intensive",
    "verified": true
  },
  "flash": {
    "url": "https://dictionary.cambridge.org/dictionary/english/flash",
    "verified": true
  },
  "float": {
    "url": "https://dictionary.cambridge.org/dictionary/english/float",
    "verified": true
  },
  "environment": {
    "url": "https://dictionary.cambridge.org/dictionary/english/environment",
    "verified": true
  },
  "surrounding": {
    "url": "https://dictionary.cambridge.org/dictionary/english/surrounding",
    "verified": true
  },
  "condition": {
    "url": "https://dictionary.cambridge.org/dictionary/english/condition",
    "verified": true
  },
  "situation": {
    "url": "https://dictionary.cambridge.org/dictionary/english/situation",
    "verified": true
  },
  "nature": {
    "url": "https://dictionary.cambridge.org/dictionary/english/nature",
    "verified": true
  },
  "natural": {
    "url": "https://dictionary.cambridge.org/dictionary/english/natural",
    "verified": true
  },
  "synthetic": {
    "url": "https://dictionary.cambridge.org/dictionary/english/synthetic",
    "verified": true
  },
  "petrol": {
    "url": "https://dictionary.cambridge.org/dictionary/english/petrol",
    "verified": true
  },
  "gas": {
    "url": "https://dictionary.cambridge.org/dictionary/english/gas",
    "verified": true
  },
  "respire": {
    "url": "https://dictionary.cambridge.org/dictionary/english/respire",
    "verified": true
  },
  "dioxide": {
    "url": "https://dictionary.cambridge.org/dictionary/english/dioxide",
    "verified": true
  },
  "eco-friendly": {
    "url": "https://dictionary.cambridge.org/dictionary/english/eco-friendly",
    "verified": true
  },
  "genetics": {
    "url": "https://dictionary.cambridge.org/dictionary/english/genetics",
    "verified": true
  },
  "mutation": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mutation",
    "verified": true
  },
  "hybridisation": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hybridisation",
    "verified": true
  },
  "pick": {
    "url": "https://dictionary.cambridge.org/dictionary/english/pick",
    "verified": true
  },
  "arable": {
    "url": "https://dictionary.cambridge.org/dictionary/english/arable",
    "verified": true
  },
  "plough": {
    "url": "https://dictionary.cambridge.org/dictionary/english/plough",
    "verified": true
  },
  "spade": {
    "url": "https://dictionary.cambridge.org/dictionary/english/spade",
    "verified": true
  },
  "rake": {
    "url": "https://dictionary.cambridge.org/dictionary/english/rake",
    "verified": true
  },
  "vase": {
    "url": "https://dictionary.cambridge.org/dictionary/english/vase",
    "verified": true
  },
  "sunlight": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sunlight",
    "verified": true
  },
  "short-day": {
    "url": "https://www.merriam-webster.com/dictionary/short-day",
    "verified": true
  },
  "shade-tolerant": {
    "url": "https://www.merriam-webster.com/dictionary/shade-tolerant",
    "verified": true
  },
  "fungus": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fungus",
    "verified": true
  },
  "mould": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mould",
    "verified": true
  },
  "seed": {
    "url": "https://dictionary.cambridge.org/dictionary/english/seed",
    "verified": true
  },
  "burgeon": {
    "url": "https://dictionary.cambridge.org/dictionary/english/burgeon",
    "verified": true
  },
  "flower": {
    "url": "https://dictionary.cambridge.org/dictionary/english/flower",
    "verified": true
  },
  "ripen": {
    "url": "https://dictionary.cambridge.org/dictionary/english/ripen",
    "verified": true
  },
  "fruit": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fruit",
    "verified": true
  },
  "wither": {
    "url": "https://dictionary.cambridge.org/dictionary/english/wither",
    "verified": true
  },
  "stale": {
    "url": "https://dictionary.cambridge.org/dictionary/english/stale",
    "verified": true
  },
  "rainforest": {
    "url": "https://dictionary.cambridge.org/dictionary/english/rainforest",
    "verified": true
  },
  "jungle": {
    "url": "https://dictionary.cambridge.org/dictionary/english/jungle",
    "verified": true
  },
  "field": {
    "url": "https://dictionary.cambridge.org/dictionary/english/field",
    "verified": true
  },
  "logo": {
    "url": "https://dictionary.cambridge.org/dictionary/english/logo",
    "verified": true
  },
  "forestry": {
    "url": "https://dictionary.cambridge.org/dictionary/english/forestry",
    "verified": true
  },
  "bough": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bough",
    "verified": true
  },
  "root": {
    "url": "https://dictionary.cambridge.org/dictionary/english/root",
    "verified": true
  },
  "straw": {
    "url": "https://dictionary.cambridge.org/dictionary/english/straw",
    "verified": true
  },
  "reed": {
    "url": "https://dictionary.cambridge.org/dictionary/english/reed",
    "verified": true
  },
  "grass": {
    "url": "https://dictionary.cambridge.org/dictionary/english/grass",
    "verified": true
  },
  "olive": {
    "url": "https://dictionary.cambridge.org/dictionary/english/olive",
    "verified": true
  },
  "pine": {
    "url": "https://dictionary.cambridge.org/dictionary/english/pine",
    "verified": true
  },
  "tulip": {
    "url": "https://dictionary.cambridge.org/dictionary/english/tulip",
    "verified": true
  },
  "mint": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mint",
    "verified": true
  },
  "alga": {
    "url": "https://dictionary.cambridge.org/dictionary/english/alga",
    "verified": true
  },
  "emission": {
    "url": "https://dictionary.cambridge.org/dictionary/english/emission",
    "verified": true
  },
  "circulation": {
    "url": "https://dictionary.cambridge.org/dictionary/english/circulation",
    "verified": true
  },
  "uptake": {
    "url": "https://dictionary.cambridge.org/dictionary/english/uptake",
    "verified": true
  },
  "energy": {
    "url": "https://dictionary.cambridge.org/dictionary/english/energy",
    "verified": true
  },
  "surroundings": {
    "url": "https://dictionary.cambridge.org/dictionary/english/surroundings",
    "verified": true
  },
  "bush fire": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bush-fire",
    "verified": true
  },
  "extinguish": {
    "url": "https://dictionary.cambridge.org/dictionary/english/extinguish",
    "verified": true
  },
  "destruct": {
    "url": "https://www.merriam-webster.com/dictionary/destruct",
    "verified": true
  },
  "perish": {
    "url": "https://dictionary.cambridge.org/dictionary/english/perish",
    "verified": true
  },
  "demolish": {
    "url": "https://dictionary.cambridge.org/dictionary/english/demolish",
    "verified": true
  },
  "extinction": {
    "url": "https://dictionary.cambridge.org/dictionary/english/extinction",
    "verified": true
  },
  "outcome": {
    "url": "https://dictionary.cambridge.org/dictionary/english/outcome",
    "verified": true
  },
  "seasonal": {
    "url": "https://dictionary.cambridge.org/dictionary/english/seasonal",
    "verified": true
  },
  "favourable": {
    "url": "https://dictionary.cambridge.org/dictionary/english/favourable",
    "verified": true
  },
  "minimal": {
    "url": "https://dictionary.cambridge.org/dictionary/english/minimal",
    "verified": true
  },
  "optimal": {
    "url": "https://dictionary.cambridge.org/dictionary/english/optimal",
    "verified": true
  },
  "biologist": {
    "url": "https://dictionary.cambridge.org/dictionary/english/biologist",
    "verified": true
  },
  "zoologist": {
    "url": "https://dictionary.cambridge.org/dictionary/english/zoologist",
    "verified": true
  },
  "botanist": {
    "url": "https://dictionary.cambridge.org/dictionary/english/botanist",
    "verified": true
  },
  "creature": {
    "url": "https://dictionary.cambridge.org/dictionary/english/creature",
    "verified": true
  },
  "wildlife": {
    "url": "https://dictionary.cambridge.org/dictionary/english/wildlife",
    "verified": true
  },
  "throng": {
    "url": "https://dictionary.cambridge.org/dictionary/english/throng",
    "verified": true
  },
  "crowd": {
    "url": "https://dictionary.cambridge.org/dictionary/english/crowd",
    "verified": true
  },
  "brute": {
    "url": "https://dictionary.cambridge.org/dictionary/english/brute",
    "verified": true
  },
  "cruel": {
    "url": "https://dictionary.cambridge.org/dictionary/english/cruel",
    "verified": true
  },
  "subgroup": {
    "url": "https://dictionary.cambridge.org/dictionary/english/subgroup",
    "verified": true
  },
  "interbreed": {
    "url": "https://dictionary.cambridge.org/dictionary/english/interbreed",
    "verified": true
  },
  "hybridize": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hybridize",
    "verified": true
  },
  "sterility": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sterility",
    "verified": true
  },
  "mate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mate",
    "verified": true
  },
  "lay": {
    "url": "https://dictionary.cambridge.org/dictionary/english/lay",
    "verified": true
  },
  "brood": {
    "url": "https://dictionary.cambridge.org/dictionary/english/brood",
    "verified": true
  },
  "skin": {
    "url": "https://dictionary.cambridge.org/dictionary/english/skin",
    "verified": true
  },
  "claw": {
    "url": "https://dictionary.cambridge.org/dictionary/english/claw",
    "verified": true
  },
  "paw": {
    "url": "https://dictionary.cambridge.org/dictionary/english/paw",
    "verified": true
  },
  "fin": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fin",
    "verified": true
  },
  "wing": {
    "url": "https://dictionary.cambridge.org/dictionary/english/wing",
    "verified": true
  },
  "feather": {
    "url": "https://dictionary.cambridge.org/dictionary/english/feather",
    "verified": true
  },
  "fur": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fur",
    "verified": true
  },
  "bristle": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bristle",
    "verified": true
  },
  "curl": {
    "url": "https://dictionary.cambridge.org/dictionary/english/curl",
    "verified": true
  },
  "insect": {
    "url": "https://dictionary.cambridge.org/dictionary/english/insect",
    "verified": true
  },
  "worm": {
    "url": "https://dictionary.cambridge.org/dictionary/english/worm",
    "verified": true
  },
  "spider": {
    "url": "https://dictionary.cambridge.org/dictionary/english/spider",
    "verified": true
  },
  "butterfly": {
    "url": "https://dictionary.cambridge.org/dictionary/english/butterfly",
    "verified": true
  },
  "mosquito": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mosquito",
    "verified": true
  },
  "cricket": {
    "url": "https://dictionary.cambridge.org/dictionary/english/cricket",
    "verified": true
  },
  "penguin": {
    "url": "https://dictionary.cambridge.org/dictionary/english/penguin",
    "verified": true
  },
  "tortoise": {
    "url": "https://dictionary.cambridge.org/dictionary/english/tortoise",
    "verified": true
  },
  "turtle": {
    "url": "https://dictionary.cambridge.org/dictionary/english/turtle",
    "verified": true
  },
  "whale": {
    "url": "https://dictionary.cambridge.org/dictionary/english/whale",
    "verified": true
  },
  "kangaroo": {
    "url": "https://dictionary.cambridge.org/dictionary/english/kangaroo",
    "verified": true
  },
  "camel": {
    "url": "https://dictionary.cambridge.org/dictionary/english/camel",
    "verified": true
  },
  "panda": {
    "url": "https://dictionary.cambridge.org/dictionary/english/panda",
    "verified": true
  },
  "elephant": {
    "url": "https://dictionary.cambridge.org/dictionary/english/elephant",
    "verified": true
  },
  "wolf": {
    "url": "https://dictionary.cambridge.org/dictionary/english/wolf",
    "verified": true
  },
  "dragon": {
    "url": "https://dictionary.cambridge.org/dictionary/english/dragon",
    "verified": true
  },
  "fox": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fox",
    "verified": true
  },
  "cub": {
    "url": "https://dictionary.cambridge.org/dictionary/english/cub",
    "verified": true
  },
  "calf": {
    "url": "https://dictionary.cambridge.org/dictionary/english/calf",
    "verified": true
  },
  "pup": {
    "url": "https://dictionary.cambridge.org/dictionary/english/pup",
    "verified": true
  },
  "lamb": {
    "url": "https://dictionary.cambridge.org/dictionary/english/lamb",
    "verified": true
  },
  "ox": {
    "url": "https://dictionary.cambridge.org/dictionary/english/ox",
    "verified": true
  },
  "horse": {
    "url": "https://dictionary.cambridge.org/dictionary/english/horse",
    "verified": true
  },
  "zebra": {
    "url": "https://dictionary.cambridge.org/dictionary/english/zebra",
    "verified": true
  },
  "donkey": {
    "url": "https://dictionary.cambridge.org/dictionary/english/donkey",
    "verified": true
  },
  "saddle": {
    "url": "https://dictionary.cambridge.org/dictionary/english/saddle",
    "verified": true
  },
  "falcon": {
    "url": "https://dictionary.cambridge.org/dictionary/english/falcon",
    "verified": true
  },
  "eagle": {
    "url": "https://dictionary.cambridge.org/dictionary/english/eagle",
    "verified": true
  },
  "owl": {
    "url": "https://dictionary.cambridge.org/dictionary/english/owl",
    "verified": true
  },
  "swallow": {
    "url": "https://dictionary.cambridge.org/dictionary/english/swallow",
    "verified": true
  },
  "pigeon": {
    "url": "https://dictionary.cambridge.org/dictionary/english/pigeon",
    "verified": true
  },
  "sparrow": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sparrow",
    "verified": true
  },
  "swan": {
    "url": "https://dictionary.cambridge.org/dictionary/english/swan",
    "verified": true
  },
  "goose": {
    "url": "https://dictionary.cambridge.org/dictionary/english/goose",
    "verified": true
  },
  "cock": {
    "url": "https://dictionary.cambridge.org/dictionary/english/cock",
    "verified": true
  },
  "mouse": {
    "url": "https://dictionary.cambridge.org/dictionary/english/mouse",
    "verified": true
  },
  "rat": {
    "url": "https://dictionary.cambridge.org/dictionary/english/rat",
    "verified": true
  },
  "frog": {
    "url": "https://dictionary.cambridge.org/dictionary/english/frog",
    "verified": true
  },
  "behaviour": {
    "url": "https://dictionary.cambridge.org/dictionary/english/behaviour",
    "verified": true
  },
  "roar": {
    "url": "https://dictionary.cambridge.org/dictionary/english/roar",
    "verified": true
  },
  "crawl": {
    "url": "https://dictionary.cambridge.org/dictionary/english/crawl",
    "verified": true
  },
  "hive": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hive",
    "verified": true
  },
  "hedge": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hedge",
    "verified": true
  },
  "bar": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bar",
    "verified": true
  },
  "epidemic": {
    "url": "https://dictionary.cambridge.org/dictionary/english/epidemic",
    "verified": true
  },
  "germ": {
    "url": "https://dictionary.cambridge.org/dictionary/english/germ",
    "verified": true
  },
  "bacteria": {
    "url": "https://dictionary.cambridge.org/dictionary/english/bacteria",
    "verified": true
  },
  "microbe": {
    "url": "https://dictionary.cambridge.org/dictionary/english/microbe",
    "verified": true
  },
  "intuitive": {
    "url": "https://dictionary.cambridge.org/dictionary/english/intuitive",
    "verified": true
  },
  "intuition": {
    "url": "https://dictionary.cambridge.org/dictionary/english/intuition",
    "verified": true
  },
  "potential": {
    "url": "https://dictionary.cambridge.org/dictionary/english/potential",
    "verified": true
  },
  "intelligence": {
    "url": "https://dictionary.cambridge.org/dictionary/english/intelligence",
    "verified": true
  },
  "functional": {
    "url": "https://dictionary.cambridge.org/dictionary/english/functional",
    "verified": true
  },
  "acoustic": {
    "url": "https://dictionary.cambridge.org/dictionary/english/acoustic",
    "verified": true
  },
  "nocturnal": {
    "url": "https://dictionary.cambridge.org/dictionary/english/nocturnal",
    "verified": true
  },
  "dormant": {
    "url": "https://dictionary.cambridge.org/dictionary/english/dormant",
    "verified": true
  },
  "hibernation": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hibernation",
    "verified": true
  },
  "track": {
    "url": "https://dictionary.cambridge.org/dictionary/english/track",
    "verified": true
  },
  "predator": {
    "url": "https://dictionary.cambridge.org/dictionary/english/predator",
    "verified": true
  },
  "victim": {
    "url": "https://dictionary.cambridge.org/dictionary/english/victim",
    "verified": true
  },
  "captivate": {
    "url": "https://dictionary.cambridge.org/dictionary/english/captivate",
    "verified": true
  },
  "subsistence": {
    "url": "https://dictionary.cambridge.org/dictionary/english/subsistence",
    "verified": true
  },
  "exist": {
    "url": "https://dictionary.cambridge.org/dictionary/english/exist",
    "verified": true
  },
  "existence": {
    "url": "https://dictionary.cambridge.org/dictionary/english/existence",
    "verified": true
  },
  "tame nature": {
    "url": "https://www.merriam-webster.com/dictionary/tame",
    "verified": true
  },
  "keeper": {
    "url": "https://dictionary.cambridge.org/dictionary/english/keeper",
    "verified": true
  },
  "sheepdog": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sheepdog",
    "verified": true
  },
  "cosmos": {
    "url": "https://dictionary.cambridge.org/dictionary/english/cosmos",
    "verified": true
  },
  "universe": {
    "url": "https://dictionary.cambridge.org/dictionary/english/universe",
    "verified": true
  },
  "astrology": {
    "url": "https://dictionary.cambridge.org/dictionary/english/astrology",
    "verified": true
  },
  "astronaut": {
    "url": "https://dictionary.cambridge.org/dictionary/english/astronaut",
    "verified": true
  },
  "dust": {
    "url": "https://dictionary.cambridge.org/dictionary/english/dust",
    "verified": true
  },
  "ash": {
    "url": "https://dictionary.cambridge.org/dictionary/english/ash",
    "verified": true
  },
  "envelope": {
    "url": "https://dictionary.cambridge.org/dictionary/english/envelope",
    "verified": true
  },
  "spacecraft": {
    "url": "https://dictionary.cambridge.org/dictionary/english/spacecraft",
    "verified": true
  },
  "spaceship": {
    "url": "https://dictionary.cambridge.org/dictionary/english/spaceship",
    "verified": true
  },
  "probe": {
    "url": "https://dictionary.cambridge.org/dictionary/english/probe",
    "verified": true
  },
  "module": {
    "url": "https://dictionary.cambridge.org/dictionary/english/module",
    "verified": true
  },
  "propulsion": {
    "url": "https://dictionary.cambridge.org/dictionary/english/propulsion",
    "verified": true
  },
  "pressure": {
    "url": "https://dictionary.cambridge.org/dictionary/english/pressure",
    "verified": true
  },
  "dynamics": {
    "url": "https://dictionary.cambridge.org/dictionary/english/dynamics",
    "verified": true
  },
  "tail": {
    "url": "https://dictionary.cambridge.org/dictionary/english/tail",
    "verified": true
  },
  "exploration": {
    "url": "https://dictionary.cambridge.org/dictionary/english/exploration",
    "verified": true
  },
  "flyby": {
    "url": "https://dictionary.cambridge.org/dictionary/english/flyby",
    "verified": true
  },
  "telescope": {
    "url": "https://dictionary.cambridge.org/dictionary/english/telescope",
    "verified": true
  },
  "spectacle": {
    "url": "https://dictionary.cambridge.org/dictionary/english/spectacle",
    "verified": true
  },
  "ecliptic": {
    "url": "https://www.merriam-webster.com/dictionary/ecliptic",
    "verified": true
  },
  "diameter": {
    "url": "https://dictionary.cambridge.org/dictionary/english/diameter",
    "verified": true
  },
  "composition": {
    "url": "https://dictionary.cambridge.org/dictionary/english/composition",
    "verified": true
  },
  "sample": {
    "url": "https://dictionary.cambridge.org/dictionary/english/sample",
    "verified": true
  },
  "atom": {
    "url": "https://dictionary.cambridge.org/dictionary/english/atom",
    "verified": true
  },
  "quantum": {
    "url": "https://dictionary.cambridge.org/dictionary/english/quantum",
    "verified": true
  },
  "liquid": {
    "url": "https://dictionary.cambridge.org/dictionary/english/liquid",
    "verified": true
  },
  "fluid": {
    "url": "https://dictionary.cambridge.org/dictionary/english/fluid",
    "verified": true
  },
  "solid": {
    "url": "https://dictionary.cambridge.org/dictionary/english/solid",
    "verified": true
  },
  "synthesise": {
    "url": "https://dictionary.cambridge.org/dictionary/english/synthesise",
    "verified": true
  },
  "formation": {
    "url": "https://dictionary.cambridge.org/dictionary/english/formation",
    "verified": true
  },
  "method": {
    "url": "https://dictionary.cambridge.org/dictionary/english/method",
    "verified": true
  },
  "antenna": {
    "url": "https://dictionary.cambridge.org/dictionary/english/antenna",
    "verified": true
  },
  "refraction": {
    "url": "https://dictionary.cambridge.org/dictionary/english/refraction",
    "verified": true
  },
  "discernible": {
    "url": "https://dictionary.cambridge.org/dictionary/english/discernible",
    "verified": true
  },
  "squash": {
    "url": "https://dictionary.cambridge.org/dictionary/english/squash",
    "verified": true
  },
  "cataclysmic": {
    "url": "https://dictionary.cambridge.org/dictionary/english/cataclysmic",
    "verified": true
  },
  "overwhelming": {
    "url": "https://dictionary.cambridge.org/dictionary/english/overwhelming",
    "verified": true
  },
  "despair": {
    "url": "https://dictionary.cambridge.org/dictionary/english/despair",
    "verified": true
  },
  "hopeless": {
    "url": "https://dictionary.cambridge.org/dictionary/english/hopeless",
    "verified": true
  },
  "education": {
    "url": "https://dictionary.cambridge.org/dictionary/english/education",
    "verified": true
  },
  "primary": {
    "url": "https://dictionary.cambridge.org/dictionary/english/primary",
    "verified": true
  },
  "secondary": {
    "url": "https://dictionary.cambridge.org/dictionary/english/secondary",
    "verified": true
  },
  "university": {
    "url": "https://dictionary.cambridge.org/dictionary/english/university",
    "verified": true
  },
  "study": {
    "url": "https://dictionary.cambridge.org/dictionary/english/study",
    "verified": true
  },
  "knowledge": {
    "url": "https://dictionary.cambridge.org/dictionary/english/knowledge",
    "verified": true
  },
  "expertise": {
    "url": "https://dictionary.cambridge.org/dictionary/english/expertise",
    "verified": true
  }
};
const corrections = {
  "sepectator": {
    "canonical": "spectator",
    "reason": "词库原条目拼写有误；规范拼写为 spectator。"
  },
  "precauition": {
    "canonical": "precaution",
    "reason": "词库原条目拼写有误；规范拼写为 precaution。"
  },
  "semisubsistence": {
    "canonical": "semi-subsistence",
    "reason": "此处采用来源核实的连字符形容词 semi-subsistence，用于修饰 farm 或 farming。"
  }
};
export const EXPANSION_SEVEN_NOTE_SOURCES = {};
export const EXPANSION_SEVEN_SYNONYM_GROUPS = {};
export const EXPANSION_SEVEN_WORD_NOTES = {};
for (const [word, sense, note, en1, zh1, en2, zh2] of rows) {
  const sourceId = `e7-source-${word}`;
  const groupId = `e7-usage-${word}`;
  const meta = sourceMeta[word];
  const review = meta.verified
    ? { status: 'source-checked', checkedAt: '2026-10-24' }
    : { status: 'draft' };
  const title = meta.url.includes('merriam-webster.com') ? '韦氏词典'
    : meta.url.includes('collinsdictionary.com') ? '柯林斯词典'
    : meta.url.includes('agrovoc.fao.org') ? 'FAO AGROVOC' : '剑桥词典';
  EXPANSION_SEVEN_NOTE_SOURCES[sourceId] = {
    title: `${title} · ${corrections[word]?.canonical || word}`,
    url: meta.url,
    ...(meta.verified ? { checkedAt: '2026-10-24' } : {}),
    use: 'factual-reference',
  };
  const examples = [{ en: en1, zh: zh1 }, { en: en2, zh: zh2 }];
  if (word === 'destine') {
    for (const example of examples) {
      example.forms = [{ word, form: 'destined', sourceIds: [sourceId], review: { ...review } }];
    }
  }
  const sourceIds = [sourceId];
  if (word === 'tame nature') sourceIds.push('e7-source-tame-nature-complement');
  if (word === 'intraspecies') sourceIds.push('e7-source-intraspecific');
  if (word === 'fertilise') sourceIds.push('e7-source-fertilization');
  EXPANSION_SEVEN_SYNONYM_GROUPS[groupId] = {
    words: [word], comparisonType: 'usage', sense: sense.replace(/\s*·\s*/g, ' · '), note, examples, sourceIds, review,
    ...(corrections[word] ? { correction: corrections[word] } : {}),
  };
  EXPANSION_SEVEN_WORD_NOTES[word] = { synonymGroup: groupId };
}
EXPANSION_SEVEN_NOTE_SOURCES['e7-source-intraspecific'] = {"title": "韦氏词典 · intraspecific", "url": "https://www.merriam-webster.com/dictionary/intraspecific", "checkedAt": "2026-10-24", "use": "factual-reference"};
EXPANSION_SEVEN_NOTE_SOURCES['e7-source-tame-nature-complement'] = {"title": "韦氏词典 · nature", "url": "https://www.merriam-webster.com/dictionary/nature", "checkedAt": "2026-10-24", "use": "factual-reference"};
EXPANSION_SEVEN_NOTE_SOURCES['e7-source-fertilization'] = {"title": "韦氏词典 · fertilization / British fertilise", "url": "https://www.merriam-webster.com/dictionary/fertilization", "checkedAt": "2026-10-24", "use": "factual-reference"};
