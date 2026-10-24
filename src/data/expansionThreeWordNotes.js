// Original scoped usage notes and bilingual examples.
// Dictionary entries were read on 2026-10-23; source-checked is not expert review.
// Tuple order: word, sense, usage note, English 1, Chinese 1, English 2, Chinese 2.
const rows = [
  ["balcony","名词 · 阳台","balcony 是建筑外侧带护栏的平台，常说 on the balcony；房间自带阳台用 with a balcony。","A small table fits on our balcony.","我们阳台上能放下一张小桌。","Their new flat has a balcony facing the river.","他们的新公寓有个面向河流的阳台。"],
  ["bankrupt","形容词 · 破产的","bankrupt 表示无力偿债的破产状态；go bankrupt 说进入这种状态，不能直接理解成暂时没带现金。","The factory may go bankrupt this winter.","这家工厂今年冬天可能破产。","A bankrupt company cannot always repay its debts.","破产公司未必能偿还债务。"],
  ["bargain","名词 · 划算的买卖","说某物是 a bargain，重点是买得划算，而不是质量差；at that price 可补充划算的价格依据。","This second-hand desk is a real bargain.","这张二手书桌真划算。","At twenty dollars, the coat was a bargain.","这件外套二十美元，买得很值。"],
  ["baseball","名词 · 棒球运动与球","baseball 可以指棒球运动，也可以指比赛用球；play baseball 谈运动，不在运动名称前加 a。","We play baseball behind the school.","我们在学校后面打棒球。","A baseball rolled under the bench.","一个棒球滚到了长椅下面。"],
  ["battery","名词 · 电池","battery 指供电的电池，复数是 batteries；a phone battery 是手机电池，不能拿来指充电线。","The camera needs a new battery.","相机需要一块新电池。","My battery lasted through the whole trip.","我的电池撑过了整段旅程。"],
  ["beard","名词 · 下巴与脸颊的胡须","beard 主要指下巴、脸颊长出的胡须；描述某个人留胡子常用 have a beard 或 with a beard。","The actor wore a false beard on stage.","演员在台上戴着假胡子。","My uncle has a short grey beard.","我叔叔留着短短的灰胡子。"],
  ["bee","名词 · 蜜蜂","bee 指蜜蜂类昆虫，是可数名词；一只用 a bee，多只用 bees，不能与发音相同的 be 混写。","A bee landed on the yellow flower.","一只蜜蜂落在黄花上。","We watched a bee enter the hive.","我们看着一只蜜蜂飞进蜂巢。"],
  ["beforehand","副词 · 事先","beforehand 表示比某个已知事件更早、事先；它本身作副词，后面不直接接一个事件名词作宾语。","Please check the route beforehand.","请事先确认路线。","We bought our tickets beforehand to save time.","我们提前买了票，以节省时间。"],
  ["behalf","名词 · 代表某人的利益","behalf 常在 on behalf of 中使用，表示代表或为了某人；换成人称代词时可说 on her behalf。","I accepted the prize on behalf of our team.","我代表团队领取了奖项。","She signed the form on my behalf.","她代表我签了表格。"],
  ["belt","名词 · 腰带","belt 的衣物义指围在腰间的带子；a leather belt 指皮带，不能用它泛指任何一条细绳。","His belt matches his brown shoes.","他的腰带和棕色鞋子很搭。","I left my belt in the changing room.","我把腰带落在更衣室了。"],
  ["beneficial","形容词 · 有益的","beneficial 强调带来好的结果或帮助；说明对谁有益时用 beneficial to，后接人或受益的事物。","The new schedule is beneficial to younger students.","新时间表对年龄较小的学生有益。","We discussed the beneficial effects of reading aloud.","我们讨论了朗读的益处。"],
  ["betray","动词 · 背叛与泄露","betray 可指背叛某人或辜负信任，也可指泄露秘密；其后直接接对象，不需要加 to 引出被背叛者。","I would never betray a close friend.","我绝不会背叛亲密朋友。","Do not betray the secret we shared with you.","不要泄露我们告诉你的秘密。"],
  ["bill","名词 · 账单","bill 的付款义可指商品或服务的费用账单；pay the bill 是结账，electricity bill 是电费账单。","Could we split the bill equally?","我们可以平摊账单吗？","The water bill arrived this morning.","水费账单今天早上到了。"],
  ["birth","名词 · 出生","birth 指出生这一事件，date of birth 是出生日期；give birth to 后接生下的孩子或幼崽。","Write your date of birth here.","在这里写下出生日期。","The family celebrated the birth of their daughter.","这家人庆祝女儿的诞生。"],
  ["bitter","形容词 · 味苦的","bitter 在味觉中表示苦，不是酸或辣；描述食物时可直接放在味道或食物名词前，也可作表语。","The tea became bitter after ten minutes.","这茶泡了十分钟后变苦了。","He dislikes the bitter taste of this vegetable.","他不喜欢这种蔬菜的苦味。"],
  ["blame","动词 · 归咎于","blame someone for something 指责某人造成某事；blame something on someone 则先说事情，再说归咎对象。","Do not blame the driver for the delay.","不要因延误责怪司机。","They blame the noise on the old fan.","他们把噪声归咎于旧风扇。"],
  ["bleed","动词 · 流血","bleed 说伤口或身体部位流血，此义通常不直接接血作宾语；过去式和过去分词均是 bled。","Even a tiny cut can bleed.","即使小伤口也可能出血。","My gums sometimes bleed when I brush.","我刷牙时牙龈有时会出血。"],
  ["blind","形容词 · 失明或视力严重受损的","blind 的视力义描述看不见或视力严重受损；这里不用其比喻义评价人的判断，也不把它当作失聪。","The blind musician learned the score by ear.","这位失明的音乐家靠听觉学会了乐谱。","The museum offers audio guides for blind visitors.","博物馆为视障参观者提供语音导览。"],
  ["blood","名词 · 血液","blood 表示身体里的血液，通常作不可数名词；a drop of blood 表示一滴，blood test 表示血液检查。","There was a drop of blood on the tissue.","纸巾上有一滴血。","The nurse labelled the blood sample carefully.","护士仔细标记了血液样本。"],
  ["blueprint","名词 · 详细行动方案","blueprint 除了工程蓝图，还可比喻详细行动方案；a blueprint for 后接计划要解决或实现的事情。","The report offers a blueprint for cleaner transport.","这份报告提出了改善交通清洁程度的详细方案。","We need a clear blueprint before work begins.","开工前我们需要一份清晰方案。"],
  ["body","名词 · 身体","body 的人体义指身体整体或躯干部位，具体范围要看语境；upper body 常指上半身，不单独指头部。","The exercise strengthens the upper body.","这项练习增强上半身力量。","Her whole body felt tired after the hike.","徒步后她全身都感到疲惫。"],
  ["bond","名词 · 人际纽带","bond 可指把人联系在一起的情感纽带；a bond between 连接双方，强调关系而不是一次见面。","A strong bond grew between the two teammates.","两位队友之间形成了深厚的情谊。","Shared memories create a lasting bond.","共同的回忆形成长久的纽带。"],
  ["bookstore","名词 · 书店","bookstore 指以卖书为主的店，主要用于美式英语；它是商店，不是借书用的图书馆。","The bookstore hosts a reading every Friday.","这家书店每周五举办一次朗读活动。","I ordered the workbook from a local bookstore.","我从本地书店订了练习册。"],
  ["bore","动词 · 使厌烦","bore 作使人厌烦的动词，通常直接接感到无聊的人；不要与表示人的感受的 bored 混用。","Long lists of dates can bore young readers.","长串日期可能让小读者觉得无聊。","I hope these details will not bore you.","希望这些细节不会让你厌烦。"],
  ["bottom","名词 · 底部","bottom 指最低处或物体下侧；at the bottom of 可说明页面、容器等的底部，注意 of 后接整体。","Your name appears at the bottom of the page.","你的名字出现在页面底部。","The bottom of the bag was wet.","袋子底部湿了。"],
  ["bowl","名词 · 碗与一碗的量","bowl 既可指碗，也可借指一碗的内容；a bowl of 后接食物，量由 bowl 而不是食物自身表示。","She poured the soup into a blue bowl.","她把汤倒进一只蓝碗。","I ate a bowl of noodles before class.","上课前我吃了一碗面。"],
  ["brain","名词 · 大脑","brain 的本义是大脑器官，常与 the 连用谈人的大脑；这里不把口语复数 brains 的聪明义一并套入。","The model shows the main parts of the brain.","模型展示了大脑的主要部分。","The lesson explains how the brain processes sound.","这节课解释大脑如何处理声音。"],
  ["brand","名词 · 品牌","brand 指以名称等区分的产品品牌；品牌和生产商有联系，但一个生产商可以拥有多个不同品牌。","Which brand of paint did you choose?","你选了哪个牌子的油漆？","The shop sells its own brand of notebooks.","这家店出售自有品牌的笔记本。"],
  ["breast","名词 · 乳房或胸部","breast 可指乳房，也可在特定语境指胸部前侧；这里限人体部位义，不把所有上半身都称为 breast。","The diagram labels the breast and surrounding tissue.","图示标出了乳房及周围组织。","She held the sleeping child against her breast.","她把睡着的孩子抱在胸前。"],
  ["breed","动词 · 繁殖或培育动植物","breed 可指动物繁殖，也可指人有目的地培育动植物；过去式和过去分词是 bred，不是 breeded。","These birds breed near the lake.","这些鸟在湖边繁殖。","The farmers breed sheep for fine wool.","农民培育绵羊以获取细羊毛。"],
  ["brick","名词 · 砖块与砖材","brick 指建筑用砖，可说 a brick 表示一块；made of brick 描述建筑材料时，常整体看待砖材。","A loose brick fell from the wall.","墙上一块松动的砖掉了下来。","The old station is built of red brick.","老车站用红砖建成。"],
  ["broadcast","动词 · 广播或播出","broadcast 指通过广播、电视或网络向公众播出；broadcast live 表示直播，过去式 broadcast 和 broadcasted 都可用。","They will broadcast the final on Sunday.","他们将在周日转播决赛。","The station plans to broadcast the interview live.","电台计划直播这次采访。"],
  ["bronze","名词 · 青铜与铜牌","bronze 可指青铜材料，也可指比赛铜牌；made of bronze 谈材质，win bronze 谈获得第三名奖牌。","The statue is made of bronze.","这座雕像由青铜制成。","Their relay team won bronze last year.","他们的接力队去年获得铜牌。"],
  ["bubble","名词 · 气泡","bubble 指液体里的气泡或液膜包住气体形成的泡；air bubble 强调内部的气体，不等于一滴液体。","A bubble rose slowly through the oil.","一个气泡缓缓穿过油液上升。","The child caught a soap bubble on her sleeve.","孩子用袖子接住了一个肥皂泡。"],
  ["buffer","名词 · 缓冲物或保护屏障","buffer 指减轻冲击的东西，也可指起保护作用的屏障；a buffer between 说明缓冲物隔在双方之间。","The foam acts as a buffer during transport.","泡沫在运输时起缓冲作用。","Trees form a buffer between the road and the school.","树木在道路与学校之间形成一道屏障。"],
  ["bull","名词 · 公牛","bull 在牲畜语境通常指成年公牛；它带有雄性这一信息，不能不分性别地用来称呼所有牛。","The bull stood near the wooden gate.","公牛站在木门旁。","The farmer moved the bull to another field.","农民把公牛转移到了另一块田地。"],
  ["bunch","名词 · 一束或一串","bunch 表示聚在一起的一束、一串或一群；a bunch of 后接所聚集的东西，量词跟具体物品搭配。","She placed a bunch of flowers on the desk.","她把一束花放在书桌上。","We shared a bunch of grapes after lunch.","午饭后我们分吃了一串葡萄。"],
  ["burn","动词 · 燃烧","burn 可指东西自身燃烧，也可指使某物燃烧；是否接宾语取决于句中谁燃烧、谁让它燃烧。","Dry leaves burn very quickly.","干树叶燃烧得很快。","Do not burn rubbish beside the wooden fence.","不要在木围栏旁烧垃圾。"],
  ["business","名词 · 生意与企业","business 说商业活动时常不可数；指一家具体企业时可数，可用 a business，不能只靠中文生意决定冠词。","She wants to start a small business.","她想创办一家小企业。","The café does most of its business at lunchtime.","这家咖啡馆大部分生意在午餐时段。"],
  ["cabbage","名词 · 卷心菜","cabbage 作蔬菜食材时可整体使用；指一整颗时可以说 a cabbage，切碎后不必逐片数。","Add some cabbage to the soup.","往汤里加些卷心菜。","He bought a cabbage at the market.","他在市场买了一颗卷心菜。"],
  ["cable","名词 · 电缆或连接线","cable 的电气义指电缆、连接线；a charging cable 是充电线，不能把线本身称为电池。","The charging cable is too short.","充电线太短了。","A cable connects the monitor to the computer.","一根线缆把显示器接到电脑上。"],
  ["calculate","动词 · 计算数值","calculate 表示通过计算确定数值，可直接接费用、距离等对象；后接 how much 等从句时说明要算的内容。","We must calculate the total cost first.","我们必须先计算总费用。","Can you calculate how much paint we need?","你能算出我们需要多少油漆吗？"],
  ["camp","名词 · 营地","camp 指帐篷或简易房屋组成的临时营地，也可指营地生活；set up camp 表示扎营。","Our camp was hidden behind the trees.","我们的营地藏在树后。","They set up camp beside a small stream.","他们在小溪旁扎了营。"],
  ["canal","名词 · 运河","canal 的地理义主要指为通航、排水或灌溉修建的人工水道；不能把所有自然河流都叫 canal。","The canal links the two rivers.","这条运河连接两条河流。","We cycled along the canal before breakfast.","早饭前我们沿运河骑车。"],
  ["candy","名词 · 糖果","candy 主要是美式英语的糖果，既可整体说糖果，也可用 a piece of candy 指一颗，具体类别可用复数 candies。","There is no candy left in the jar.","罐里没有糖果了。","She gave each child a piece of candy.","她给每个孩子一颗糖。"],
  ["car","名词 · 汽车","car 的日常义是汽车；by car 表出行方式时不加冠词，具体坐进一辆车则可说 in the car。","We travelled to the coast by car.","我们开车去了海边。","I left my map in the car.","我把地图落在车里了。"],
  ["career","名词 · 职业生涯","career 强调持续发展的职业或职业经历；a career in 后接行业，a career as 后接职业身份。","She hopes for a career in science.","她希望从事科学事业。","He began his career as a hotel chef.","他以酒店厨师的身份开启职业生涯。"],
  ["carrot","名词 · 胡萝卜","carrot 可指一根胡萝卜，也可指用作食材的胡萝卜；整根可说 a carrot，切碎作配料时可整体表达。","Slice a carrot into thin strips.","把一根胡萝卜切成细丝。","The rice contains peas and chopped carrot.","米饭里有豌豆和碎胡萝卜。"],
  ["castle","名词 · 城堡","castle 的建筑义通常是带防御设施的城堡或宏伟宅邸；普通住宅不能只因为比较旧就称为 castle。","The castle overlooks a narrow valley.","这座城堡俯瞰着狭窄的山谷。","We explored the castle with a local guide.","我们跟当地导游参观了城堡。"],
  ["category","名词 · 类别","category 是分类体系中的一类；in this category 表示属于这一类别，复数把词尾 y 改为 ies。","Put each photo in the correct category.","把每张照片放入正确类别。","This book belongs in the travel category.","这本书属于旅游类。"],
  ["cave","名词 · 洞穴","cave 的地形义指地下或山崖中的天然洞穴；enter a cave 是进入洞内，不能把洞口与整座洞穴混为一谈。","A narrow path leads to the cave.","一条窄路通向洞穴。","We could hear water dripping inside the cave.","我们能听见洞穴内的滴水声。"],
  ["cement","名词 · 水泥","cement 可指制造砂浆、混凝土的水泥材料；通常按材料整体表达，不能把一袋水泥直接数成 a cement。","Keep the cement dry until you need it.","使用前让水泥保持干燥。","They mixed cement with sand for the repair.","他们把水泥和沙子混合用于修补。"],
  ["certificate","名词 · 证书或证明文件","certificate 是证明资格、事实或完成要求的文件；a birth certificate 是出生证明，不能把口头保证当作这种文件。","Each participant received a certificate.","每位参与者都获得了一张证书。","Please bring a copy of your birth certificate.","请带一份出生证明副本。"],
  ["champion","名词 · 冠军","champion 的比赛义指赢得第一名的人或队伍；the defending champion 指卫冕冠军，不等于普通参赛者。","The national champion joined our training session.","全国冠军参加了我们的训练。","Our school became the regional champion.","我们学校获得了地区冠军。"],
  ["charge","动词 · 收费","charge someone for something 表示因某项商品或服务向某人收费；报金额可用 charge ten dollars for something。","They charge visitors five dollars for parking.","他们向访客收取五美元停车费。","Does the hotel charge for breakfast?","酒店收早餐费吗？"],
  ["chart","名词 · 图表","chart 可以用表格、曲线或图示组织信息；read a chart 是读懂图表，不能把所有连续文字都当作 chart。","The chart compares rainfall in six cities.","图表比较了六座城市的降雨量。","We added a chart to explain the survey results.","我们加了一张图表来解释调查结果。"],
  ["cheek","名词 · 面颊","cheek 的身体义是眼睛下方、嘴两侧的面颊；说一侧脸颊用单数，两颊用复数 cheeks。","A tear ran down his cheek.","一滴眼泪沿着他的脸颊流下。","The child had a little paint on her cheek.","孩子脸颊上沾了一点颜料。"],
  ["chef","名词 · 专业厨师","chef 主要指有专业技能的厨师，尤其是负责厨房的人；通常用于职业身份，不能泛指所有在家做饭的人。","The chef prepared a special soup for us.","厨师为我们做了一道特别的汤。","Her ambition is to become a pastry chef.","她的志向是成为一名糕点师。"],
  ["chess","名词 · 国际象棋","chess 是国际象棋这项游戏的名称，play chess 不加 a；指一盘棋时可说 a game of chess。","We play chess during the lunch break.","我们午休时下国际象棋。","She won her first game of chess yesterday.","她昨天赢了自己的第一盘国际象棋。"],
  ["childhood","名词 · 童年","childhood 指儿童时期；in childhood 泛指在童年，my childhood 等结构则明确某个人的童年经历。","Music was a big part of my childhood.","音乐是我童年的重要部分。","They became close friends in childhood.","他们在童年时成为了好友。"],
  ["chocolate","名词 · 巧克力","chocolate 指巧克力材料时通常不可数；一块用 a piece of chocolate，单颗夹心巧克力可用 a chocolate。","Melt the chocolate over gentle heat.","用小火把巧克力融化。","I saved a piece of chocolate for you.","我给你留了一块巧克力。"],
  ["cigarette","名词 · 香烟","cigarette 指用纸卷起烟草制成的香烟，可数；a packet of cigarettes 指一包，不能直接用来表示烟雾。","He put out his cigarette before entering.","他进门前熄灭了香烟。","An unopened cigarette packet lay on the shelf.","架子上放着一包未开封的香烟。"],
  ["circulate","动词 · 循环或流通","circulate 可指空气、血液等流动循环，也可指消息在人群中传开；不要误当作静止地围成圆圈。","Open the window to let fresh air circulate.","打开窗户让新鲜空气流通。","Warm water can circulate through these pipes.","热水可以在这些管道中循环流动。"],
  ["clay","名词 · 黏土","clay 是湿时可塑、烧后变硬的黏土材料，通常不可数；a piece of clay 表示一块黏土。","She shaped the clay into a small bird.","她把黏土捏成了一只小鸟。","The riverbank contains a layer of red clay.","河岸含有一层红色黏土。"],
  ["climate","名词 · 气候","climate 指一个地区长期的气候状况，不能只用一天的冷热来概括；a mild climate 表示温和的气候。","The island has a mild climate.","这座岛的气候温和。","Farmers are adapting to a changing climate.","农民正在适应变化中的气候。"],
  ["clock","名词 · 钟","clock 指用于显示或测量时间的钟，日常与戴在手上的 watch 区分；a wall clock 是挂钟。","The kitchen clock is five minutes slow.","厨房的钟慢了五分钟。","We hung a clock above the classroom door.","我们在教室门上方挂了一口钟。"],
  ["club","名词 · 社团或俱乐部","club 的团体义指因共同兴趣或目标组织起来的社团；join a club 是加入，不是只到活动地点参观。","I joined the school chess club.","我加入了学校国际象棋社。","Our club meets every Wednesday afternoon.","我们的社团每周三下午活动。"],
  ["coast","名词 · 海岸地区","coast 指靠海的陆地及沿岸地区；on the coast 谈沿海位置，along the coast 谈沿岸移动或分布。","They live in a town on the coast.","他们住在沿海的一座小镇。","We drove along the coast until sunset.","我们沿着海岸开车直到日落。"],
  ["coffee","名词 · 咖啡饮品","coffee 作饮料整体时通常不可数，a cup of coffee 表示一杯；点单时也可用 a coffee 指一份。","The smell of coffee filled the kitchen.","咖啡香充满了厨房。","Would you like a cup of coffee after lunch?","午饭后你想喝杯咖啡吗？"],
  ["colleague","名词 · 同事或同行","colleague 指在同一工作场所或职业领域共事的人；a colleague of mine 表示我的一位同事，不要求是朋友。","A colleague helped me prepare the presentation.","一位同事帮我准备了演示。","She discussed the case with a senior colleague.","她和一位资深同事讨论了这个案例。"],
  ["comedy","名词 · 喜剧","comedy 指喜剧这一类型时可整体使用；a comedy 指一部具体喜剧，复数是 comedies，不等于一则笑话。","We watched a gentle comedy about family life.","我们看了一部讲述家庭生活的温情喜剧。","He prefers comedy to action films.","比起动作片，他更喜欢喜剧。"],
  ["hospital","名词 · 医院","hospital 指为伤病者提供照护的医院；英式英语常说 in hospital 表住院，特指某家建筑时可用 the hospital。","The hospital opened a new children's ward.","医院开设了新的儿科病房。","We took the injured cyclist to the hospital.","我们把受伤的骑车人送到了医院。"],
  ["piece","名词 · 一片或一件","piece 可以把不可数事物按一份、一片计量；a piece of 后接材料或事物，多个单位时把 piece 变复数。","May I have a piece of paper?","可以给我一张纸吗？","She gave me a useful piece of advice.","她给了我一条有用的建议。"],
  ["doctor","名词 · 医生","doctor 在医疗语境指医生，see a doctor 表示就医；它也能作博士称号，不能脱离场景一概译成医生。","The doctor explained the test results clearly.","医生清楚地解释了检查结果。","He made an appointment with a doctor nearby.","他预约了附近的一位医生。"],
  ["news","名词 · 新闻或消息","news 虽然以 s 结尾，通常按单数不可数名词处理；说一条消息用 a piece of news，而不是 a news。","The news was better than we expected.","消息比我们预想的更好。","She shared a piece of news with the team.","她和团队分享了一条消息。"],
  ["tree","名词 · 树木","tree 的植物义通常指有木质主干的树，可数；一棵用 a tree，一片树林要根据语境另选表达。","We planted a tree beside the playground.","我们在操场旁种了一棵树。","The old tree provides shade in summer.","这棵老树在夏天提供树荫。"],
  ["foreign","形容词 · 外国的","foreign 以说话者或所谈国家为参照，指来自别国的；foreign language 表外语，不能一概等同于英语。","She enjoys watching foreign films.","她喜欢看外国电影。","Learning a foreign language takes regular practice.","学习一门外语需要经常练习。"],
  ["colour","名词 · 颜色（英式拼写）","colour 是 color 的英式拼写，颜色义相同；同一篇文字通常保持拼写习惯一致，不能因此推断两个不同概念。","What colour should we paint the door?","我们该把门漆成什么颜色？","The colour of the curtains faded in the sunlight.","窗帘的颜色在阳光下褪去了。"],
  ["fire","名词 · 火与火灾","fire 指燃烧现象时可整体使用，a fire 可指一场火灾或一堆火；语境决定它是可控用火还是灾情。","The fire spread to the wooden roof.","火蔓延到了木屋顶。","We gathered around a small fire at dusk.","黄昏时我们围在一小堆火旁。"],
  ["discuss","动词 · 讨论","discuss 是及物动词，直接接讨论的话题，不加 about；讨论的对象人用 with 引出。","We need to discuss the timetable before Friday.","我们需要在周五前讨论时间表。","Please discuss your ideas with a partner.","请和一位同伴讨论你的想法。"],
  ["garden","名词 · 花园或菜园","garden 指种花、蔬菜等的园地；in the garden 表示在园内，vegetable garden 特指种菜的园地。","We grow beans in the garden.","我们在菜园里种豆子。","The hotel has a quiet garden at the back.","酒店后方有个安静的花园。"],
  ["sea","名词 · 大海","sea 的海洋义指大片咸水；by the sea 说在海边，at sea 常说出海或身处海上，两者语义不同。","Their house is close to the sea.","他们的房子离海很近。","The boat spent three days at sea.","这艘船在海上航行了三天。"],
  ["station","名词 · 车站","station 的交通义是线路中的停靠处及其建筑；train station 和 bus station 可明确不同交通工具。","Meet me outside the train station.","在火车站外面等我。","The bus station is next to the library.","汽车站就在图书馆旁边。"],
  ["dog","名词 · 狗","dog 的日常义是狗，可数；walk the dog 是带狗散步这一搭配，不必把 walk 后面加 with 才能表达。","Their dog waits by the gate every evening.","他们的狗每晚都在门边等候。","I walk the dog before breakfast.","我早饭前遛狗。"],
  ["science","名词 · 科学与学科","science 泛指科学知识时通常不可数；指各门具体科学时可用 sciences，不能把一次实验直接数作 a science。","The children enjoy learning about science.","孩子们喜欢学习科学知识。","She teaches science at a local school.","她在当地一所学校教科学。"],
  ["sister","名词 · 姐姐或妹妹","sister 本身不区分姐姐和妹妹；older sister 表示姐姐，younger sister 表示妹妹，需要时再补年龄关系。","My older sister taught me to swim.","姐姐教会了我游泳。","Her sister lives in the same building.","她的姐妹住在同一栋楼里。"],
  ["park","名词 · 公园","park 的公共休闲地义指公园；in the park 表示在园内，不能把此名词义与停车的动词义混在一起。","The park has a small lake and a playground.","公园里有一个小湖和一个游乐场。","We met in the park after lunch.","午饭后我们在公园见了面。"],
  ["visit","动词 · 拜访或参观","visit 作拜访、参观的动词时直接接人或地点，不加 to；a visit to 则是名词结构，句法不同。","We plan to visit the museum tomorrow.","我们计划明天参观博物馆。","I visit my grandparents every month.","我每个月看望祖父母。"],
  ["radio","名词 · 收音机与广播","radio 可指设备，也可指广播媒介；listen to the radio 说收听广播，on the radio 说通过广播播出。","We heard the interview on the radio.","我们在广播中听到了那段采访。","The old radio still works well.","那台旧收音机仍然好用。"],
  ["fly","动词 · 飞行","fly 可指鸟等用翅膀飞，也可指乘飞机；过去式 flew，过去分词 flown，不能按规则加 ed。","These birds fly south before winter.","这些鸟在冬季来临前向南飞。","We will fly to the island on Monday.","我们将在周一乘飞机去岛上。"],
  ["bag","名词 · 袋子或包","bag 指装东西的袋子或包；a bag of 后接袋内物品时还可表达一袋的量，不特指材料或包型。","I put the receipt in my bag.","我把收据放进包里。","She carried a bag of rice upstairs.","她把一袋米搬上楼。"],
  ["mouth","名词 · 嘴","mouth 的身体义指进食的口腔及开口；open your mouth 说张嘴，不能把 mouth 和其中的牙齿当同一部位。","The child opened his mouth for the dentist.","孩子张开嘴让牙医检查。","She covered her mouth when she yawned.","她打哈欠时捂住嘴。"],
  ["earth","名词 · 泥土与地球","earth 可指泥土，也可指我们居住的地球；作为行星名称时常写 Earth，不能只根据首字母忽略语境。","The earth in this pot is still damp.","这个花盆里的土还湿着。","The model shows the Earth and the moon.","模型展示了地球和月球。"],
  ["tomorrow","副词 · 明天","tomorrow 作时间副词表示今天之后的一天，前面一般不加 on；tomorrow morning 则进一步限定明天早上。","The repair team will return tomorrow.","维修团队明天会回来。","We can finish the labels tomorrow morning.","我们明早可以完成标签。"],
  ["front","名词 · 前部","front 指前面或前部；in front of 表示在某物外部的前面，at the front of 可指整体内部靠前的位置。","A taxi stopped in front of our house.","一辆出租车停在我们房子前面。","She sat at the front of the classroom.","她坐在教室前部。"],
  ["key","名词 · 钥匙","key 的实物义是用于开锁或启动装置的钥匙；a key to the door 可说明开哪扇门，不把它当作门把手。","I found the spare key in a drawer.","我在抽屉里找到了备用钥匙。","This key opens the garden gate.","这把钥匙能开花园的门。"],
  ["afternoon","名词 · 下午","afternoon 指中午到傍晚这段时间；in the afternoon 泛指下午，具体某日的下午通常用 on，如 on Friday afternoon。","We will practise on Friday afternoon.","我们将在周五下午练习。","The shop closes early in the afternoon.","这家店下午较早关门。"],
  ["tea","名词 · 茶饮料","tea 作饮料整体时通常不可数；a cup of tea 表示一杯茶，a pot of tea 表示一壶，数量通过容器表达。","The tea is still too hot to drink.","茶还太烫，不能喝。","She made a pot of tea for the visitors.","她为访客泡了一壶茶。"],
  ["conversation","名词 · 交谈","conversation 强调交流想法或感受的交谈；have a conversation with someone 表示与某人交谈，about 后再接话题。","We had a conversation about our holiday plans.","我们谈了谈假期计划。","A short conversation with the guide changed our route.","和导游简短交谈后，我们改变了路线。"],
  ["pair","名词 · 一双或一对","pair 指相配的两个，或由两部分构成的一件物品；a pair of shoes 是一双鞋，不能理解成单只鞋。","I need a new pair of walking shoes.","我需要一双新的步行鞋。","She bought a pair of scissors for the classroom.","她给教室买了一把剪刀。"],
  ["driver","名词 · 驾驶员","driver 在交通语境指驾驶车辆的人；a bus driver 是公交司机，词义本身不要求以驾驶为职业。","The driver stopped to let us cross.","司机停下来让我们过马路。","We thanked the bus driver before getting off.","我们下车前向公交司机道谢。"],
  ["flight","名词 · 飞行旅程或航班","flight 可指乘飞机的一段旅程，也可指具体航班；book a flight 是订航班，catch a flight 是赶上航班。","Our flight leaves just before sunrise.","我们的航班在日出前不久起飞。","She booked a direct flight to the island.","她订了直飞那座岛的航班。"],
  ["guest","名词 · 客人或住客","guest 可指受邀到访的客人，也可指酒店住客；hotel guest 不要求收到私人邀请，不能只译成宴会宾客。","Each guest received a handwritten welcome card.","每位客人都收到一张手写欢迎卡。","The hotel offers each guest a free city map.","酒店为每位住客提供一张免费城市地图。"],
  ["carefully","副词 · 仔细地","carefully 修饰动作，强调留意细节或谨慎操作；read carefully 是仔细读，不是读得轻声或快速。","Check the address carefully before sending the parcel.","寄包裹前仔细核对地址。","She carefully lifted the glass lid.","她小心地抬起玻璃盖。"],
  ["ear","名词 · 耳朵","ear 的身体义是耳朵，可数；in one ear 指一侧耳内，behind the ear 则指耳后，位置不能混用。","He held the shell against his ear.","他把贝壳贴在耳边。","The puppy has a brown patch behind one ear.","小狗一只耳朵后面有块棕色斑点。"],
  ["egg","名词 · 鸡蛋等蛋类","egg 指完整蛋时可数，用 an egg；作混合食材时可整体表达，boiled egg 是煮蛋而不是煎蛋。","She sliced a boiled egg into the salad.","她把一个煮蛋切片加进沙拉。","Break one egg into a separate cup.","把一个鸡蛋打进单独的杯子。"],
  ["gift","名词 · 礼物与天赋","gift 可指送给别人的礼物，也可指天赋；a gift for someone 说收礼人，a gift for music 则说音乐天赋。","I wrapped a small gift for our host.","我给主人包了一份小礼物。","The child has a remarkable gift for drawing.","这个孩子有非凡的绘画天赋。"],
  ["neighbor","名词 · 邻居（美式拼写）","neighbor 指住在附近的人，next-door neighbor 特指隔壁邻居；这是美式常见拼写，英式常用 neighbour。","Our neighbor watered the plants while we were away.","我们外出时邻居帮忙浇了花。","I borrowed a ladder from my next-door neighbor.","我从隔壁邻居那里借了一把梯子。"],
  ["dress","动词 · 穿衣或给人穿衣","dress 可以表示自己穿衣，也可以直接接人表示给对方穿衣；dress the child 不表示把孩子当作衣物穿上。","The twins can dress themselves now.","这对双胞胎现在能自己穿衣了。","She helped dress the little boy for the concert.","她帮小男孩穿好参加音乐会的衣服。"],
  ["rain","名词 · 雨水或降雨","rain 作天气名词通常不可数；heavy rain 是大雨，不能因为中文说一场雨就机械写成 a rain。","Heavy rain delayed the outdoor concert.","大雨推迟了露天音乐会。","We waited for the rain to stop.","我们等着雨停。"],
  ["sweet","形容词 · 味甜的","sweet 的味觉义指像糖一样的甜味；用于食物或饮料，不自动说明健康程度，也不等同于鲜美。","The sauce is a little too sweet for me.","这酱汁对我来说有点太甜。","These sweet grapes need no added sugar.","这些甜葡萄不需要额外加糖。"],
  ["expensive","形容词 · 价格高的","expensive 表示价格高或花费大，修饰物品、服务或活动；描述数额本身通常说 high，不说 an expensive price。","Repairing the roof was more expensive than we expected.","修屋顶比我们预想的更贵。","She chose a less expensive notebook.","她选了一本较便宜的笔记本。"],
  ["shout","动词 · 大声喊叫","shout 强调高声说出或喊出；可以直接接喊出的内容，也可不接宾语，不能一概理解成生气地骂人。","Please do not shout in the reading room.","请不要在阅览室里大声喊叫。","The coach had to shout over the noise.","教练不得不提高嗓门盖过噪声。"],
  ["surprise","名词 · 意外之事与惊讶","surprise 既可指一件意外发生的事，也可指惊讶；a surprise 指具体意外，in surprise 表示惊讶的反应。","The extra day off was a pleasant surprise.","多放一天假是个令人高兴的意外。","She looked up in surprise when the music stopped.","音乐停下时，她惊讶地抬起头。"],
  ["slow","形容词 · 缓慢的","slow 描述速度低或进展慢，可修饰交通、过程等；a slow train 说车速或运行较慢，不一定是火车晚点。","The bus made slow progress through the fog.","公交车在雾中缓慢行进。","This is a slow process that needs patience.","这是一个需要耐心的缓慢过程。"],
  ["dance","动词 · 跳舞","dance 的动作义指随节奏起舞；dance to music 表示跟着音乐跳，to 后接配乐而不是目的地。","We learned to dance to a simple rhythm.","我们学着跟简单的节奏跳舞。","The children wanted to dance at the party.","孩子们想在聚会上跳舞。"],
  ["nose","名词 · 鼻子","nose 的身体义指鼻子；blow your nose 表示擤鼻涕，不能按字面理解成向鼻子吹气。","The cold air made my nose red.","冷空气让我的鼻子发红。","She paused to blow her nose.","她停下来擤了擤鼻子。"],
  ["airport","名词 · 机场","airport 指飞机起降并办理相关业务的场所；at the airport 谈机场这个地点，不能用它专指客舱。","The airport is linked to the city by train.","机场通过铁路与市区相连。","We arrived at the airport two hours early.","我们提前两小时到了机场。"],
  ["snow","名词 · 雪或积雪","snow 表示降下的雪或地面的积雪时通常不可数；a layer of snow 是一层雪，不能把每片雪写成 a snow。","Fresh snow covered the narrow path.","新雪覆盖了窄路。","There was still snow on the mountain in May.","五月时山上仍有积雪。"],
  ["basketball","名词 · 篮球运动与球","basketball 可指篮球运动，也可指比赛用球；play basketball 谈运动，a basketball 则是一个篮球。","We play basketball in the school gym.","我们在学校体育馆打篮球。","A basketball bounced across the empty court.","一个篮球弹过空球场。"],
  ["lake","名词 · 湖","lake 的地理义指内陆较大静止水体；by the lake 说在湖边，in the lake 则说在湖水中，注意位置。","There is a small village beside the lake.","湖旁有个小村庄。","We saw fish swimming in the lake.","我们看见鱼在湖里游。"],
  ["wash","动词 · 清洗","wash 指用水等液体清洗；直接接清洗对象，如 wash your hands，不必额外用介词引出身体部位。","Please wash your hands before touching the dough.","碰面团前请洗手。","We wash these delicate cups by hand.","我们手洗这些精致的杯子。"],
  ["fun","名词 · 乐趣","fun 作乐趣的名词时通常不可数；have fun 表示玩得开心，for fun 表示为了好玩，不等同于嘲笑某人。","The treasure hunt was great fun.","寻宝活动非常有趣。","I sometimes write short poems for fun.","我有时写短诗自娱。"],
  ["pleased","形容词 · 高兴或满意的","pleased 常作表语；pleased with 接满意的对象，pleased to do 表示乐于做某事或因做某事而高兴。","The team was pleased with the new design.","团队对新设计很满意。","I am pleased to help with the school fair.","我很高兴帮忙筹办学校义卖。"],
  ["palace","名词 · 宫殿","palace 的主要建筑义指君主、国家元首等的官邸，也可指宏伟宅邸；不能把普通豪华房间都称为宫殿。","The palace gardens open at nine.","宫殿花园九点开放。","A guide explained the history of the palace.","导游讲解了宫殿的历史。"],
  ["afterwards","副词 · 后来或事后","afterwards 表示某件已知事情发生之后，和 afterward 义相同；它作副词，不直接接名词充当介词。","We visited the gallery and had lunch afterwards.","我们参观了画廊，之后吃了午饭。","I only understood his question afterwards.","我后来才明白他的问题。"],
  ["hat","名词 · 帽子","hat 通常指有帽顶、常带帽檐的帽子；wear a hat 表示戴着的状态，take off a hat 表示脱帽的动作。","She wore a straw hat in the garden.","她在花园里戴着一顶草帽。","The wind blew his hat into the pond.","风把他的帽子吹进了池塘。"],
  ["bike","名词 · 自行车","bike 日常常指自行车，也可能指摩托车，要看场景；ride a bike 是骑车，by bike 说交通方式。","I go to the library by bike.","我骑自行车去图书馆。","Her bike has a basket above the front wheel.","她的自行车前轮上方有个车篮。"],
  ["however","副词 · 然而","however 作转折副词时连接前后观点，常单独分句并用逗号；它不能直接当 but 去连接两个并列形容词。","The path was steep. However, everyone reached the top.","山路很陡。然而，所有人都登了顶。","We liked the plan; however, the cost was too high.","我们喜欢这个计划，然而费用太高了。"],
  ["although","连词 · 虽然","although 引出让步从句，需与主句形成完整意思；although 已表达转折时，一般不再在主句前加 but。","Although the shop was busy, the staff stayed calm.","虽然店里很忙，员工仍保持镇定。","We finished the walk although our shoes were wet.","虽然鞋子湿了，我们还是走完了全程。"],
  ["police","名词 · 警方人员","police 泛指警方人员时按复数理解；通常说 the police are，单个警察用 a police officer，不用 a police。","The police are checking the station entrance.","警方正在检查车站入口。","We asked the police for help finding the owner.","我们请警方帮忙寻找失主。"],
  ["death","名词 · 死亡","death 是死亡这一事件或状态的名词；die 是动词，不能把 death 直接放在主语后代替死亡的动作。","The novel begins with the death of a king.","小说以一位国王的去世开篇。","They built a memorial after his death.","他去世后，人们建了一座纪念碑。"],
  ["difference","名词 · 差异","difference between A and B 表示两者之间的差别；tell the difference 是辨别差别，并非一定把差别讲给别人听。","Can you explain the difference between these two maps?","你能解释这两张地图的差异吗？","I could not tell the difference in the dark.","黑暗中我分辨不出差别。"],
  ["phone","名词 · 电话或手机","phone 可指电话设备，现代语境也常指手机；on the phone 表示正在打电话，不能只按字面理解为放在电话上。","Her phone rang during the rehearsal.","排练时她的电话响了。","I was on the phone when the parcel arrived.","包裹送到时我正在打电话。"],
  ["clearly","副词 · 清楚地","clearly 可说明表达、看见或听见的清晰程度，也可表示显然；这里着重动作的清晰，不是单纯音量大。","Please write the room number clearly.","请把房间号写清楚。","I could hear the speaker clearly from the back row.","我从后排也能清楚地听见演讲者。"],
  ["exactly","副词 · 精确地或恰好","exactly 强调时间、数量或程度完全吻合；exactly the same 表示完全一样，不能只用于表示大概接近。","The shelf is exactly one metre wide.","架子恰好一米宽。","You have described exactly what we need.","你描述的正是我们需要的东西。"],
  ["feeling","名词 · 感受或情绪","feeling 可指某种感受；a feeling of 后接具体情绪或状态，复数 feelings 谈情感时不要一概当成触觉。","A feeling of relief spread through the room.","房间里弥漫着如释重负的感觉。","She described the feeling in her journal.","她在日记中描写了那种感受。"],
  ["anyway","副词 · 尽管如此或不管怎样","anyway 可表示即使有前述情况仍然如此，常放句末；这里是转折或补充，不等同于表示任意方式的 any way。","The forecast was poor, but we went anyway.","天气预报不佳，但我们还是去了。","I did not win, but I enjoyed the race anyway.","我没获胜，但仍然很享受这场比赛。"],
  ["easily","副词 · 容易地","easily 修饰动作时表示毫不费力或没有困难；easy 是形容词，不应把 easily 直接放在名词前代替它。","The lid comes off easily.","这个盖子很容易取下。","You can easily spot the red tower from here.","从这里你很容易看到红塔。"],
  ["band","名词 · 乐队","band 的音乐义是一起演奏的一组乐手；join a band 表示加入乐队，不能把每个独奏者都叫一支乐队。","The band practises in a converted garage.","乐队在改建的车库里排练。","We hired a local band for the festival.","我们请了当地一支乐队参加节庆活动。"],
  ["contribution","名词 · 贡献或捐助","contribution 可指投入的钱、时间或工作；make a contribution to 后接受益对象，to 在这里是介词。","Her contribution to the project went beyond editing.","她对项目的贡献不止是编辑工作。","Every small contribution helps keep the shelter open.","每一笔小额捐助都帮助收容所维持运转。"],
  ["danger","名词 · 危险","danger 指受到伤害或损失的可能性；in danger 表示处于危险中，out of danger 表示脱离危险，不是地点名称。","The flooded road put the village in danger.","被淹的道路使村庄陷入危险。","The sign warns visitors of danger near the cliff.","标志提醒游客悬崖附近有危险。"],
  ["internet","名词 · 互联网","internet 指连接世界各地计算机网络的互联网；作独立名词时通常带 the，on the internet 表示在网上。","We found the opening times on the internet.","我们在网上查到了营业时间。","The cabin has no internet connection.","小木屋没有互联网连接。"],
  ["paint","动词 · 涂漆或绘画","paint 可直接接被涂的表面，也可接画出的对象；paint the door blue 表示把门漆成蓝色，颜色放宾语后。","They will paint the classroom walls pale green.","他们要把教室墙壁漆成浅绿色。","She likes to paint scenes from her village.","她喜欢画村里的景色。"],
  ["beauty","名词 · 美或美丽","beauty 表示事物的美这一性质时通常不可数；the beauty of 后接所欣赏的对象，不能直接当形容词修饰 scenery。","We admired the quiet beauty of the valley.","我们欣赏了山谷宁静的美。","The poem finds beauty in ordinary objects.","这首诗从普通物品中发现美。"],
  ["funny","形容词 · 好笑或古怪的","funny 可指令人发笑，也可指不寻常、令人疑惑；a funny noise 常说怪声，不一定是能逗笑人的声音。","The cartoon has a funny ending.","这部动画片的结尾很好笑。","There is a funny smell coming from the cupboard.","柜子里传出一股怪味。"],
  ["badly","副词 · 差劲地或很严重地","badly 可说明表现不好，也可加强需要或受损的程度；badly damaged 表严重受损，并非损坏动作做得差。","The team played badly in the opening match.","球队在首场比赛表现不佳。","The old roof was badly damaged by the storm.","旧屋顶被暴风雨严重损坏。"],
  ["quietly","副词 · 轻声或安静地","quietly 修饰动作，着重声音小、少打扰；speak quietly 不等于发音含糊，也不一定表示偷偷摸摸。","Please close the door quietly.","请轻轻关门。","The children worked quietly while the baby slept.","婴儿睡觉时，孩子们安静地做事。"],
  ["boss","名词 · 上司","boss 指管理或监督他人的负责人，口语中常指上司；不必一定是企业所有者，也不表示所有同事。","My boss approved the change in schedule.","上司批准了时间安排的变更。","She asked her boss for two days off.","她向上司请了两天假。"],
  ["knife","名词 · 刀","knife 指带刀刃和柄的刀具，复数是 knives；knife 的首字母 k 不发音，不能据拼写把它读出。","Use a sharp knife to slice the bread.","用锋利的刀切面包。","Put the knife safely back in the drawer.","把刀安全地放回抽屉。"],
  ["countryside","名词 · 乡村地区","countryside 指城镇以外的乡间地区，通常整体看待；in the countryside 表在乡下，不指一个国家的全部领土。","They rented a cottage in the countryside.","他们在乡间租了一间小屋。","The train passed through peaceful countryside.","火车穿过宁静的乡野。"],
  ["arrival","名词 · 到达","arrival 是到达的名词，time of arrival 是到达时间；on arrival 表示一到达就发生某事，不能当作动词使用。","Please confirm your time of arrival.","请确认你的到达时间。","On arrival, we collected our room keys.","到达后，我们领取了房间钥匙。"],
  ["amazing","形容词 · 令人惊叹的","amazing 描述让人惊叹的事物或经历；它着重引发感受的对象，不直接代替表示人感到惊讶的 amazed。","The guide showed us an amazing underground lake.","导游带我们看了一个令人惊叹的地下湖。","It is amazing how quickly the seedlings grow.","幼苗生长之快令人惊叹。"],
  ["kiss","动词 · 亲吻","kiss 作动作动词可直接接被亲吻的人或部位；kiss someone goodnight 表示以亲吻道晚安，不需要额外加 to。","She bent down to kiss her grandmother.","她俯身亲吻祖母。","The father gave a smile and leaned over to kiss the baby.","父亲微笑着俯身亲吻婴儿。"],
  ["parking","名词 · 停车或停车空间","parking 作停车活动或停车空间时通常不可数；一个车位用 a parking space，不把 a parking 当作一个车位。","The hotel offers free parking for guests.","酒店为住客提供免费停车。","There is no parking outside the school gate.","学校门外禁止停车。"],
  ["luck","名词 · 运气","luck 表示运气时通常不可数；good luck 是好运，by luck 说靠运气，不可把一个具体幸运事件直接数成 a luck。","We found the missing key by pure luck.","我们完全靠运气找到了丢失的钥匙。","Good luck with your first performance tonight.","祝你今晚首演顺利。"],
  ["bathroom","名词 · 浴室或卫生间","bathroom 可指有浴缸或淋浴的房间，也可尤其在美式语境中指卫生间；问路时不一定表示准备洗澡。","The bathroom is at the end of the corridor.","卫生间在走廊尽头。","Our new bathroom has a large shower.","我们的新浴室有一个大淋浴间。"],
  ["smoke","名词 · 烟","smoke 的燃烧产物义通常不可数；a cloud of smoke 表示一团烟，不把它与单根香烟或水滴混为一谈。","Smoke drifted out of the chimney.","烟从烟囱里飘出来。","A cloud of smoke hid the far end of the street.","一团烟遮住了街道远端。"],
  ["mail","名词 · 邮件","mail 泛指信件、包裹等邮件时通常不可数；a piece of mail 指一件，语境中也可指电子邮件的总体。","Please check the mail while I am away.","我不在时，请帮我查收邮件。","The morning mail included a postcard from Peru.","早上的邮件里有一张来自秘鲁的明信片。"],
  ["constantly","副词 · 不断地或经常地","constantly 可指持续不断，也可说反复发生；它比偶尔频繁得多，但并非所有语境都要求每秒从未间断。","The display constantly updates the train times.","显示屏不断更新列车时刻。","The little boy was constantly asking about the moon.","小男孩不断问关于月亮的问题。"],
  ["adviser","名词 · 顾问","adviser 指提供建议的人，advisor 也是认可的拼写；career adviser 是职业顾问，不一定有权替求助者作决定。","A career adviser helped her compare the courses.","职业顾问帮她比较了这些课程。","He works as an adviser to the museum director.","他担任博物馆馆长的顾问。"],
  ["disability","名词 · 残障或功能障碍","disability 可指影响活动能力的身体或认知障碍；a person with a disability 描述一个有残障的人，不等同于暂时没学会技能。","The school supports each learner with a disability.","学校为每位有残障的学习者提供支持。","The project studies barriers faced by people with a disability.","项目研究残障人士面临的障碍。"],
  ["aunt","名词 · 姑姨辈女性亲属","aunt 不区分父系或母系，可指姑姑、姨妈，也包括叔舅等的配偶；中文称谓需按实际亲属关系选择。","My aunt is my mother's younger sister.","我的姨妈是我母亲的妹妹。","We invited our aunt and uncle to dinner.","我们邀请姨妈和姨父来吃晚饭。"],
  ["altogether","副词 · 总共或完全","altogether 可指总计，也可指完全；总计义常放句末，完全义可修饰形容词，不能一概译成大家在一起。","The tickets cost forty pounds altogether.","这些票总共花了四十英镑。","This is an altogether different question.","这是一个完全不同的问题。"],
  ["cooperation","名词 · 合作或配合","cooperation 指共同努力或按要求配合，通常不可数；cooperation between 说明合作双方，with 也可引出合作对象。","The rescue required cooperation between several teams.","救援需要多个团队合作。","We appreciate your cooperation during the repairs.","感谢你在维修期间的配合。"],
  ["dialogue","名词 · 对话与台词","dialogue 可指人与人的对话，也可指影视、戏剧中的对白；不能因为前半部分像 two 就限定必须只有两人。","The film has very little dialogue.","这部电影对白很少。","We wrote a short dialogue for three speakers.","我们为三个说话者写了一段简短对话。"],
  ["unemployed","形容词 · 失业的","unemployed 的工作义说没有受雇从事有收入的工作；它描述就业状态，不等同于今天休假或此刻没在忙。","The programme helps unemployed adults learn new skills.","这个项目帮助失业成年人学习新技能。","He was unemployed for three months after the factory closed.","工厂关闭后，他失业了三个月。"],
  ["delighted","形容词 · 非常高兴的","delighted 表示十分高兴，比一般满意更强；delighted to do 可表示因某事感到喜悦，描述的是人的感受。","The children were delighted to see the snow.","孩子们看到雪非常高兴。","We were delighted with the handmade invitation.","我们对这份手工请柬十分喜爱。"],
  ["counselor","名词 · 咨询辅导人员","counselor 在学校等场景指提供建议或辅导的人；也有其他职业义，不能仅凭这个词就认定是心理医生。","The school counselor helped him plan his next steps.","学校辅导员帮他规划了下一步。","She made an appointment with a career counselor.","她预约了一位职业咨询师。"],
  ["convinced","形容词 · 确信的","convinced 描述确信某事的状态，常用 be convinced that 加完整句子，或 convinced of 加名词；此义通常不放名词前。","I am convinced that the key is in this room.","我确信钥匙就在这个房间里。","She remained convinced of the plan's value.","她仍然坚信这个计划有价值。"],
  ["traveller","名词 · 旅行者","traveller 指出行、旅行的人，英式常用双写 l，美式常用 traveler；日常此义不要求一定是游客或长期旅居者。","The traveller asked for a map of the old town.","旅行者索要了一张老城区地图。","Each traveller carried a small water bottle.","每位旅行者都带了一个小水瓶。"],
  ["meter","名词 · 米（美式拼写）","meter 的长度单位义是一米，是美式拼写，英式常写 metre；它还有仪表等义，读数场景要另外辨别。","The shelf is less than a meter above the floor.","架子距地面不到一米。","Leave a meter of space between the rows.","两排之间留出一米空隙。"],
  ["educate","动词 · 教育或培养","educate 通常直接接接受教育的人，指通过教学或训练培养；不是只把一条消息告知别人，也不等于学习者自身学习。","The centre aims to educate young people through art.","中心旨在通过艺术教育年轻人。","They chose to educate their children in a bilingual school.","他们选择让孩子在双语学校接受教育。"],
  ["loud","形容词 · 声音大的","loud 的声音义描述音量大，不说明内容是否清晰；a loud voice 是大嗓门，a loud noise 是很响的噪声。","A loud crash interrupted the lesson.","一声巨响打断了课堂。","The music was too loud for a quiet café.","这音乐对安静的咖啡馆来说太响了。"],
  ["provider","名词 · 提供者","provider 指提供服务、资源或生计的人或机构；service provider 是服务商，不一定指实际使用该服务的客户。","We changed our internet provider last month.","我们上个月更换了互联网服务商。","The clinic is the main health-care provider in the village.","这家诊所是村里主要的医疗服务提供机构。"],
  ["calculation","名词 · 计算过程或结果","calculation 可以指一次计算，也可指计算结果；check a calculation 是核对计算，不只是查看计算器本身。","A quick calculation showed that we needed six boxes.","快速计算表明我们需要六个箱子。","Please check my calculation before we order the tiles.","订瓷砖前请核对我的计算。"],
  ["actress","名词 · 女演员","actress 指女性演员，可用于戏剧或影视；复数在词尾加 es，不能把唱歌或跳舞的女性一概称为 actress。","The actress rehearsed the final scene twice.","女演员把最后一场戏排练了两遍。","A young actress joined the touring company.","一位年轻女演员加入了巡演剧团。"],
  ["frustration","名词 · 受挫感","frustration 可指努力受阻时的挫败感；in frustration 表示因受挫而作出某种反应，不只是身体疲劳。","The repeated errors caused a lot of frustration.","反复出错让人十分沮丧。","He closed the broken app in frustration.","他沮丧地关掉了出故障的应用。"],
  ["cookie","名词 · 小甜饼","cookie 的食物义主要是美式的小甜饼，可数，复数 cookies；这里不把网页存储信息的技术义套进食物场景。","The child saved one cookie for her brother.","孩子给弟弟留了一块小甜饼。","Would you like a cookie with your milk?","喝牛奶时你想配块小甜饼吗？"],
  ["advertisement","名词 · 广告","advertisement 指公开发布的广告，常用 an advertisement for 说明宣传的产品、岗位或活动；它不表示观看广告的动作。","I saw an advertisement for a weekend art class.","我看到一则周末美术课广告。","The advertisement appeared on the back of the magazine.","广告刊登在杂志封底。"],
  ["taxi","名词 · 出租车","taxi 指供乘客付费使用的出租车；take a taxi 是乘出租车，by taxi 说出行方式时一般不加冠词。","We took a taxi to the railway station.","我们坐出租车去了火车站。","A taxi was waiting outside the hotel.","一辆出租车正在酒店外等候。"],
  ["painter","名词 · 画家或油漆工","painter 可指绘画艺术家，也可指职业油漆工；要看其是在创作图画还是涂刷表面，不能仅凭职业后缀决定。","The painter displayed her landscapes at the library.","画家在图书馆展示了她的风景画。","We hired a painter to repaint the kitchen.","我们请了油漆工重新粉刷厨房。"],
  ["homeless","形容词 · 无家可归的","homeless 说缺少家或固定住所的处境；它不等于只是不在家，也不能仅因衣着朴素就用来判断一个人。","The flood left many families homeless.","洪水使许多家庭无家可归。","The centre provides hot meals for homeless people.","中心为无家可归者提供热餐。"],
  ["experienced","形容词 · 有经验的","experienced 指通过实践而熟练的人；an experienced teacher 说教学经验丰富，不单是年龄较大。","An experienced guide led us through the forest.","一位有经验的向导带我们穿过森林。","We need an experienced mechanic for this repair.","这次维修需要一位有经验的机械师。"],
  ["criticise","动词 · 批评（英式拼写）","criticise 是 criticize 的英式拼写，可直接接被批评的人或事；criticise someone for 后接受批评的原因。","Do not criticise her for asking questions.","不要因为她提问而批评她。","The article does not criticise the volunteers themselves.","文章并没有批评志愿者本人。"],
  ["effectiveness","名词 · 有效性","effectiveness 关注是否产生预期结果，the effectiveness of 后接方法或措施；不要仅凭耗时少就判断有效性高。","The survey measured the effectiveness of the new lessons.","调查衡量了新课程的有效性。","We need more evidence of the tool's effectiveness.","我们需要更多证据说明该工具有效。"],
  ["monthly","副词 · 每月","monthly 作副词表示每月一次或按月；pay monthly 说按月付款，不是每天支付某个月的费用。","The club meets monthly at the community centre.","俱乐部每月在社区中心聚会一次。","You can pay monthly instead of yearly.","你可以按月而非按年付款。"],
  ["diagnosis","名词 · 诊断","diagnosis 可指识别病症的过程或得出的诊断结论；make a diagnosis 是作出诊断，复数是 diagnoses。","The doctor waited for the results before making a diagnosis.","医生等到检查结果后才作出诊断。","The new evidence confirmed the earlier diagnosis.","新证据证实了先前的诊断。"],
  ["dancer","名词 · 舞者","dancer 指跳舞的人，尤其可指职业舞蹈表演者；a ballet dancer 是芭蕾舞演员，不能把所有演奏者都叫舞者。","The dancer stretched before the rehearsal.","舞者在排练前做了拉伸。","She hopes to become a professional dancer.","她希望成为职业舞者。"],
  ["discretion","名词 · 自行决定的权力","discretion 的决定权义指根据情况自行判断；at someone's discretion 表示由某人酌情决定，不是必须按固定答案执行。","The exact meeting time is at your discretion.","具体开会时间由你酌情决定。","The manager has discretion to extend the deadline.","经理有权酌情延长截止日期。"],
  ["frozen","形容词 · 冻结或冷冻的","frozen 表示被冷冻、结冰后的状态；frozen food 指冷冻食品，不是只要温度稍低就属于 frozen。","We used frozen peas in the soup.","我们用冷冻豌豆做了汤。","The boat was trapped in the frozen lake.","船被困在结冰的湖里。"],
  ["rebuild","动词 · 重建","rebuild 指重新建造或大规模修复，也可比喻恢复原有状态；过去式和过去分词是 rebuilt，不能直接加 ed。","The village plans to rebuild the old bridge.","村里计划重建那座旧桥。","It will take time to rebuild trust after the mistake.","出错后重新建立信任需要时间。"],
  ["backwards","副词 · 向后或反向","backwards 表示朝后或按相反顺序，修饰动作；walk backwards 是倒着走，不等于转身后向前走。","She took two small steps backwards.","她向后退了两小步。","Try reading the list backwards from the last item.","试着从最后一项开始倒序读这份清单。"],
  ["pity","名词 · 遗憾或怜悯","pity 可指对他人不幸的怜悯，也可指令人遗憾的事情；it's a pity that 常用来表达遗憾，而不是羞耻。","It is a pity that the concert was cancelled.","音乐会取消了，真遗憾。","He looked at the injured bird with pity.","他怜悯地看着受伤的小鸟。"],
  ["happiness","名词 · 幸福或快乐","happiness 说幸福、满足的状态时通常不可数；可用 bring happiness to someone 说给某人带来快乐，不直接当形容词使用。","Gardening brings her a lot of happiness.","园艺给她带来很多快乐。","Their faces shone with happiness after the reunion.","重逢后，他们脸上洋溢着幸福。"],
  ["pizza","名词 · 比萨","pizza 指食物类别时可整体表达，a pizza 指一整张比萨；一片用 a slice of pizza，不能把整张和切片混为一谈。","We shared a large pizza after the match.","比赛后我们分吃了一张大比萨。","He packed a slice of pizza for lunch.","他装了一片比萨当午餐。"],
  ["disappointment","名词 · 失望","disappointment 可指希望落空的情绪，也可指令人失望的事物；to someone's disappointment 表示令某人失望的是。","She could not hide her disappointment at the result.","她掩饰不住对结果的失望。","To our disappointment, the museum was closed.","令我们失望的是，博物馆关门了。"],
  ["cab","名词 · 出租车","cab 的出租车义是 taxi 的常见说法；take a cab 是打车，语境也可能是卡车驾驶室，不能无条件互换所有义项。","We called a cab because the last bus had left.","末班公交已开走，所以我们叫了出租车。","The cab dropped us near the theatre entrance.","出租车把我们送到剧院入口附近。"],
  ["carer","名词 · 照护者","carer 尤其在英式英语中指照顾需要帮助者的人；可能是亲人也可能是工作者，不一定有护士资格。","Her carer helps with meals and appointments.","她的照护者帮助安排用餐和就诊。","The centre offers training for every new carer.","中心为每位新照护者提供培训。"],
  ["exam","名词 · 考试","exam 是 examination 的常见简略形式，学校语境指考试；take an exam 是参加考试，pass an exam 则是通过考试。","The exam includes a short listening task.","考试包含一项简短听力任务。","She will take her final exam next Thursday.","她将在下周四参加期末考试。"],
  ["jewelry","名词 · 首饰（美式拼写）","jewelry 泛指首饰，通常不可数；一件首饰用 a piece of jewelry，不能因为包含多件就机械加 s。","She keeps her jewelry in a wooden box.","她把首饰放在木盒里。","The ring is the only piece of jewelry I wear daily.","这枚戒指是我每天唯一佩戴的首饰。"],
  ["trophy","名词 · 奖杯或胜利纪念品","trophy 指为胜利或成绩授予、保存的奖品，常指奖杯；win a trophy 是赢得奖杯，不能等同于每份参赛礼物。","The captain lifted the trophy above her head.","队长把奖杯举过头顶。","Our first trophy still stands in the school hall.","我们的第一座奖杯仍摆在学校大厅。"],
  ["workstation","名词 · 工位或工作站","workstation 可指配备设备的工作区域，也可指用于专业工作的计算机；office workstation 不必指一台高性能电脑。","Each workstation has an adjustable chair.","每个工位都有一把可调节椅子。","The designer uses a powerful workstation for 3D models.","设计师用一台高性能工作站制作三维模型。"],
  ["creativity","名词 · 创造力","creativity 表示创造的能力或创意品质，通常不可数；encourage creativity 是鼓励创造力，不指一件具体作品。","The task encourages creativity rather than memorisation.","这项任务鼓励创造，而不是死记。","She used her creativity to turn scraps into toys.","她发挥创造力，把边角料变成玩具。"],
  ["enquire","动词 · 询问（常见英式拼写）","enquire 是 inquire 的常见英式拼写；enquire about 后接想了解的事情，不能把 about 后的事物当作被询问的人。","I called to enquire about the evening classes.","我打电话询问夜校课程。","Please enquire at reception before entering the workshop.","进入工作坊前请到接待处询问。"],
  ["tourism","名词 · 旅游业或旅游活动","tourism 指旅游活动及相关产业，通常不可数；work in tourism 说从事旅游业，不是单独一次旅行。","Tourism supports many small businesses on the island.","旅游业支撑着岛上的许多小商家。","The town is trying to develop tourism beyond summer.","小镇正在尝试发展夏季以外的旅游业务。"],
  ["relaxed","形容词 · 放松的","relaxed 描述人轻松、不紧张的状态，也可描述宽松的氛围；不应拿它直接表示某物正在使人放松的作用。","She looked relaxed after a week by the sea.","在海边待了一周后，她显得很放松。","The class has a relaxed and friendly atmosphere.","课堂氛围轻松友好。"],
  ["embarrassment","名词 · 尴尬或难堪","embarrassment 可指难堪的感觉，也可指令人难堪的事情；to someone's embarrassment 表示使某人尴尬的是。","He laughed to hide his embarrassment.","他用笑声掩饰尴尬。","To my embarrassment, I had forgotten the host's name.","令我尴尬的是，我忘了主人的名字。"],
  ["openly","副词 · 公开或坦率地","openly 表示不隐瞒、公开地表达或行动；speak openly 可说坦率地讲，不是把嘴张大或提高音量。","The team discussed the problem openly.","团队坦率地讨论了问题。","She openly admitted that the first design had failed.","她公开承认第一版设计失败了。"],
  ["retailer","名词 · 零售商","retailer 的商业义指主要向最终消费者销售商品的商家；可以是门店或公司，不要求一定拥有实体商铺。","The retailer accepts returns within thirty days.","这家零售商接受三十天内退货。","A local retailer donated books for the event.","一家当地零售商为活动捐了书。"],
  ["supportive","形容词 · 支持或给予帮助的","supportive 描述提供鼓励、理解或实际帮助的人和环境；a supportive teacher 是会支持学生的老师，不只表示同意所有决定。","Her supportive family encouraged her to apply.","支持她的家人鼓励她申请。","The group creates a supportive space for new learners.","小组为初学者营造互相支持的环境。"],
  ["compliance","名词 · 遵守或符合要求","compliance 的规则义常用 in compliance with 表示符合规定；with 后接规则或要求，不等同于内心赞成这些规则。","The doors were widened in compliance with safety rules.","这些门依照安全规定加宽了。","The team checks compliance with the agreed standards.","团队检查是否符合约定标准。"],
  ["bored","形容词 · 感到无聊的","bored 描述人因缺少兴趣而厌倦的感受；它与使人无聊的事物所用的 boring 不同，不能一概交换。","The children became bored during the long wait.","孩子们在漫长等待中感到无聊。","I was too bored to finish the repetitive puzzle.","这道重复性强的谜题让我无聊得做不下去。"],
  ["cemetery","名词 · 墓地","cemetery 指用于安葬死者的墓地，是可数名词；指整个安葬区域，不是其中单独一座坟墓。","A stone wall surrounds the old cemetery.","一道石墙围着老墓地。","They walked quietly through the cemetery.","他们安静地走过墓地。"],
  ["booking","名词 · 预订","booking 的出行或服务义指预订、预约，通常可数；make a booking 是预约，确认一项预约用 confirm a booking。","Please confirm your booking by Friday.","请在周五前确认预订。","I made a booking for a table by the window.","我预订了靠窗的一桌。"],
  ["embarrassed","形容词 · 感到难堪的","embarrassed 描述人因窘境而不自在的感受；too embarrassed to do 表示因难为情而不愿或不能做某事。","She was embarrassed by the unexpected praise.","突如其来的表扬让她有些不好意思。","He felt embarrassed to ask the same question again.","再次问同样的问题让他觉得难为情。"],
  ["relaxation","名词 · 放松或休闲","relaxation 可指身心放松的状态或让人放松的活动；for relaxation 说以此休闲，不是直接修饰人的形容词。","She listens to music for relaxation.","她听音乐来放松。","The garden provides a quiet place for relaxation.","花园提供了一个安静的休闲场所。"],
  ["driveway","名词 · 通往建筑的私人车道","driveway 通常是从公共道路通往住宅等建筑的私人车道；可供车辆进出或停放，不等同于城市主干道。","Please keep the driveway clear for deliveries.","请让车道保持畅通，以便送货。","A narrow driveway leads up to the farmhouse.","一条窄车道通向农舍。"],
  ["misleading","形容词 · 误导人的","misleading 说信息让人产生错误印象；它描述信息的作用，不等于所有内容都完全虚构，也不是被误导者的感受。","The headline gives a misleading impression of the report.","标题让人对报告产生了错误印象。","We removed the misleading label from the display.","我们移除了展示区中有误导性的标签。"],
  ["confession","名词 · 承认或认罪陈述","confession 可指承认错误、罪行的陈述；make a confession 是作出承认，不一定限定为宗教场景中的忏悔。","His confession surprised everyone in the room.","他的坦白让房间里的所有人都很意外。","The letter contained a confession about the broken vase.","信里承认了打碎花瓶的事。"],
  ["surveillance","名词 · 监视或监控","surveillance 指密切、持续地观察或监控，通常不可数；under surveillance 表示处于监控之下，不是被公开参观。","The entrance is under video surveillance.","入口处有视频监控。","The film follows a detective carrying out surveillance.","影片跟随一位执行监视任务的侦探展开。"],
  ["sovereignty","名词 · 主权","sovereignty 在国家语境指最高统治权或不受外部控制的自主权；national sovereignty 是国家主权，不是个人所有权。","The treaty recognises the island's sovereignty.","条约承认了该岛的主权。","The lecture examined the history of national sovereignty.","讲座探讨了国家主权的历史。"],
  ["contributor","名词 · 贡献者或投稿者","contributor 指提供帮助、资源或内容的人，也可指促成结果的因素；a contributor to 后接受益项目或投稿刊物。","Each contributor received a copy of the collection.","每位投稿者都收到了一本合集。","She is a regular contributor to the school magazine.","她经常给校刊投稿。"],
  ["sunny","形容词 · 阳光充足的","sunny 描述天气晴朗、日照充足，也可说房间受阳光照射；晴天不自动意味着气温高，不能一概译成炎热。","We ate breakfast on the sunny terrace.","我们在阳光充足的露台吃早饭。","It was sunny but cold enough for a coat.","天很晴，但冷得需要穿外套。"],
  ["shorts","复数名词 · 短裤","shorts 表示短裤时用复数形式；一条短裤用 a pair of shorts，不能用 a short 指一条短裤。","He wore shorts and a loose cotton shirt.","他穿着短裤和宽松的棉衬衫。","I packed a pair of shorts for the beach.","我为海滩之行装了一条短裤。"],
  ["website","名词 · 网站","website 指一组相关网页组成的站点，不只是一个浏览器窗口；on the website 说在网站上，visit a website 直接接宾语。","The museum's website lists its opening hours.","博物馆网站列出了开放时间。","You can register for the workshop on our website.","你可以在我们网站报名参加工作坊。"],
  ["foolish","形容词 · 缺乏判断的","foolish 说行为或判断不明智；a foolish decision 是愚蠢决定，不表示做决定的人永远没有能力。","It would be foolish to ignore the warning.","忽视警告是不明智的。","He admitted that leaving the map behind was foolish.","他承认没带地图很愚蠢。"],
  ["cleaner","名词 · 清洁工或清洁剂","cleaner 作名词可指清洁人员、清洁剂或设备；a window cleaner 可能是擦窗工，也要结合句中动作判断。","The cleaner arrived after the office closed.","清洁工在办公室关门后到了。","This cleaner removes marks from glass.","这种清洁剂能去掉玻璃上的污痕。"],
  ["countless","形容词 · 无数的","countless 强调数量多得难以计数，通常修饰可数名词复数；countless stars 说星星很多，不是没有星星。","Countless stars filled the clear night sky.","无数星星布满晴朗的夜空。","She has spent countless hours restoring the painting.","她花了无数小时修复这幅画。"],
  ["upcoming","形容词 · 即将到来的","upcoming 描述即将发生或出现的事情，常用于活动、考试、计划；指向未来，不表示已经发生的结果。","We discussed the upcoming school concert.","我们讨论了即将举行的校园音乐会。","The leaflet lists upcoming workshops for beginners.","传单列出了即将开办的初学者工作坊。"],
  ["lyrics","复数名词 · 歌词","lyrics 指歌曲中的文字，通常用复数；learn the lyrics 是记歌词，不等于学会旋律或乐器演奏部分。","The lyrics tell a story about returning home.","歌词讲述了一个归家的故事。","She wrote new lyrics for the class song.","她为班歌写了新歌词。"],
  ["antibiotic","名词 · 抗生素","antibiotic 指抗生素类药物，是可数名词；an antibiotic 是一种或一种制剂，具体用药判断不由这个词本身给出。","The label identifies the drug as an antibiotic.","标签注明这是一种抗生素。","The textbook explains how an antibiotic affects bacteria.","课本解释抗生素怎样影响细菌。"],
  ["architectural","形容词 · 建筑方面的","architectural 修饰与建筑设计有关的特征、图纸或风格；它是形容词，不表示从事建筑设计的人。","The tour focuses on architectural details above the doors.","导览重点介绍门上方的建筑细节。","The archive holds architectural drawings of the old station.","档案馆保存着老车站的建筑图纸。"],
  ["organizer","名词 · 组织者","organizer 的人员义指安排活动、协调工作的人；an event organizer 是活动组织者，不一定是台上的主持人。","The organizer sent everyone a revised timetable.","组织者给所有人发了修订后的时间表。","Ask the organizer where to leave your equipment.","问问组织者设备该放在哪里。"],
  ["bass","名词 · 低音乐器或低音声部","bass 在音乐中可指低音声部或低音乐器，读音像 base；鱼类义读音不同，不能用同一读音覆盖所有场景。","She plays bass in a small jazz band.","她在一支小爵士乐队演奏贝斯。","The bass was too loud for the quiet melody.","低音对这首轻柔旋律来说太响了。"],
  ["memo","名词 · 简短备忘录","memo 是工作中常见的简短书面消息或报告；a memo about 后接主题，不专指私人日记或完整研究论文。","The manager circulated a memo about the new hours.","经理传阅了一份关于新工作时间的备忘录。","I left a short memo on your desk.","我在你的桌上留了一份简短便笺。"],
  ["reconstruction","名词 · 重建或修复","reconstruction 指重新建造、修复的过程；the reconstruction of 后接受修复对象，也可有根据证据复原等其他义项。","The reconstruction of the bridge took two years.","重建桥梁花了两年。","The museum reopened after extensive reconstruction.","博物馆大规模改建后重新开放。"],
  ["corpse","名词 · 尸体","corpse 在现代常指死者的身体，尤其人的尸体；不能用来泛指活人的身体，也不要与发音不同的 corps 混读。","The detective found a corpse near the abandoned cabin.","侦探在废弃小屋附近发现了一具尸体。","In the story, the corpse is discovered at dawn.","故事中的尸体是在黎明时被发现的。"],
  ["pact","名词 · 协定或郑重约定","pact 可指正式协定，也可指双方郑重作出的约定；make a pact to do 后接约定要一起履行的行动。","The clubs made a pact to share their training ground.","两家俱乐部约定共用训练场。","The pact includes a promise to protect the river.","协定中包含保护河流的承诺。"],
  ["abandon","动词 · 放弃或抛弃","abandon 通常直接接被放弃的计划、地点或物品，强调离弃或不再继续；不是短暂停下来稍后再做。","They had to abandon the damaged boat.","他们不得不弃下受损的船。","We should not abandon the project after one setback.","我们不应遇到一次挫折就放弃项目。"],
  ["aboard","副词 · 上船或在交通工具上","aboard 可单独作副词表示登上或在船、飞机等交通工具上；welcome aboard 用来欢迎登乘，不是欢迎出国。","The passengers waited until everyone was aboard.","乘客们等到所有人都上了船。","Please come aboard before the gate closes.","请在登乘口关闭前登乘。"],
  ["abstract","形容词 · 抽象的","abstract 描述一般概念或性质，而不是具体可触摸的对象；an abstract idea 说抽象思想，不能理解成文章摘要。","The teacher used pictures to explain an abstract idea.","老师用图片解释抽象概念。","Justice can be difficult to discuss in abstract terms.","用抽象术语讨论正义可能很难。"],
  ["accelerate","动词 · 加速","accelerate 可指自身加快，也可指使过程更快；accelerate growth 直接接被加速的过程，不必加 up。","The train began to accelerate after the bend.","火车过弯后开始加速。","Extra funding could accelerate the repairs.","额外资金可能加快维修。"],
  ["accomplish","动词 · 完成或实现","accomplish 强调通过努力完成任务或达成结果；直接接任务、目标等对象，而非接想做某事的 to 不定式。","We can accomplish the first task before lunch.","我们能在午饭前完成第一项任务。","What do you hope to accomplish during the workshop?","你希望在工作坊期间取得什么成果？"],
  ["accumulate","动词 · 逐渐积累","accumulate 强调一点点增加，可说人积累东西，也可说东西自行堆积；不一定是一次性收集完成。","Dust can accumulate behind the shelves.","架子后面可能积灰。","Small savings accumulate into a useful emergency fund.","小额储蓄逐渐积累成一笔实用的应急金。"],
  ["achieve","动词 · 达成","achieve 常直接接目标、结果或水平，强调努力后实现；achieve a goal 不是仅有计划或还在尝试。","The team hopes to achieve its target by June.","团队希望在六月前达成目标。","Regular practice helps learners achieve steady progress.","经常练习帮助学习者取得稳定进步。"],
  ["adapt","动词 · 适应或改编","adapt to 后接需要适应的环境；adapt something for 则可说为某种用途改编对象，不等同于采用一种现成方案。","The plants can adapt to a dry climate.","这些植物能适应干燥气候。","We will adapt the story for younger readers.","我们将把故事改编给年龄更小的读者。"],
  ["administer","动词 · 管理或实施","administer 可指管理项目、资金，也可指实施测试或给予药物；administer a test 说组织实施，不表示参加考试。","The office will administer the scholarship fund.","该办公室将管理奖学金基金。","Trained staff administer the language test.","受过培训的人员负责实施语言测试。"],
  ["adopt","动词 · 采用或收养","adopt 可指开始采用方法，也可指正式收养孩子或动物；adopt a method 是采用方法，不是为适应而修改它。","The school will adopt a new reading programme.","学校将采用一套新的阅读方案。","They hope to adopt a dog from the shelter.","他们希望从收容所领养一只狗。"],
  ["adventure","名词 · 冒险或不寻常经历","adventure 可指带风险的冒险，也可指令人兴奋的特殊经历；an adventure 是一次经历，不一定必须危及生命。","Our first camping trip became a memorable adventure.","我们的首次露营成了一次难忘的冒险。","The novel follows an adventure across the desert.","小说讲述了一段穿越沙漠的冒险经历。"],
  ["afford","动词 · 负担得起","afford 在能力或费用义中常与 can、could 连用；afford to do 后接承担得起的行动，不用 afford doing 作此结构。","We cannot afford to replace every chair this year.","我们今年负担不起更换所有椅子的费用。","Can the club afford a new sound system?","俱乐部买得起新音响系统吗？"],
  ["agent","名词 · 代理人或经纪人","agent 的人员义可指获授权代办事务的人；a travel agent 办理旅行事务，不是每位旅行者自己的同义词。","The agent arranged an audition for the young actor.","经纪人为年轻演员安排了试镜。","A travel agent helped us change the booking.","旅行代理人帮我们更改了预订。"],
  ["agriculture","名词 · 农业","agriculture 包括种植作物、饲养牲畜等农业实践与研究，通常不可数；不只指某一块田或一种作物。","Water is essential to agriculture in this region.","水对该地区的农业至关重要。","She is studying agriculture at university.","她在大学学习农业。"],
  ["alert","形容词 · 警觉的","alert 描述能留意情况并及时反应的状态；stay alert to 后接要留意的风险，不是只表示醒着没睡。","Drivers should stay alert on this winding road.","司机在这条蜿蜒道路上应保持警觉。","The guide remained alert to changes in the weather.","向导一直留意天气变化。"],
  ["allow","动词 · 允许","allow someone to do 表示允许某人做某事；人作宾语，后接带 to 的动词，不能机械照搬 let 的结构。","The museum does not allow visitors to touch the models.","博物馆不允许游客触碰模型。","We allow each group to choose its own topic.","我们允许各组自己选话题。"],
  ["amaze","动词 · 使惊叹","amaze 是让某人非常惊讶的动词，可直接接受影响的人；不能直接把 I amaze 当作我很惊讶的状态。","The tiny machine can amaze even experienced engineers.","这台微型机器连经验丰富的工程师都能惊到。","Her ability to remember names never fails to amaze me.","她记人名的本领总让我惊叹。"],
  ["abolish","动词 · 废除","abolish 指彻底取消法律、制度或惯例的效力；不能拿它泛指把一件实体物品丢掉或暂时暂停活动。","The council voted to abolish the outdated rule.","议会投票决定废除过时规定。","The proposal would abolish fees for local students.","这项提案将取消本地学生的费用。"],
  ["abuse","名词 · 虐待或滥用","abuse 作名词可指伤害性对待，也可指权力等的滥用；abuse of power 是滥用权力，不是一般使用。","The training helps staff recognise signs of abuse.","培训帮助员工识别虐待迹象。","The report exposed an abuse of power.","报告揭露了滥用权力的行为。"],
  ["accommodation","名词 · 住宿或住处","accommodation 的旅行义指住宿及配套安排；美式常用复数 accommodations 表住宿设施，不能把所有语境都按同一可数性处理。","We booked accommodation near the train station.","我们订了火车站附近的住处。","The course fee does not include accommodation.","课程费不包括住宿。"],
  ["accordance","名词 · 一致或符合","accordance 常用于 in accordance with，表示依据并符合某规则或要求；with 之后接依据，通常不单独拿 accordance 作动词。","The rooms were inspected in accordance with the rules.","房间依照规定接受了检查。","We changed the schedule in accordance with your request.","我们按照你的要求更改了时间表。"],
  ["ache","动词 · 隐隐作痛","ache 通常是不及物动词，说身体部位持续、钝痛；My legs ache 的主语是疼痛部位，不直接接疼痛的人。","My shoulders ache after carrying the heavy bag.","背过沉重的包后，我肩膀酸痛。","Her feet began to ache during the long walk.","走了很久后，她的脚开始疼。"],
  ["acquaint","动词 · 使熟悉","acquaint someone with something 表示使某人了解某事；acquaint yourself with 则表示自己去熟悉，需要保留 with。","The tour will acquaint visitors with the town's history.","导览将让游客了解小镇历史。","Please acquaint yourself with the emergency exits.","请熟悉紧急出口的位置。"],
  ["activate","动词 · 启动或激活","activate 指使系统、装置等开始运行或进入有效状态；activate an account 是激活账号，不单是注册时填表。","Press the green button to activate the sensor.","按绿色按钮启动传感器。","You must activate your account before uploading files.","上传文件前你必须激活账号。"],
  ["addiction","名词 · 成瘾","addiction 可指对物质或行为产生有害的强迫性依赖；addiction to 后接所依赖的对象，不把一般兴趣都当作临床成瘾。","The documentary explores gambling addiction.","纪录片探讨了赌博成瘾。","The course examines addiction to alcohol and its social effects.","课程研究酒精成瘾及其社会影响。"],
  ["adjacent","形容词 · 相邻的","adjacent 指紧邻或靠近，adjacent to 后接参照对象；相邻不自动表示属于同一栋楼或同一所有者。","The café is adjacent to the main entrance.","咖啡馆紧邻主入口。","We booked two adjacent rooms for the family.","我们为家人订了两个相邻房间。"],
  ["administration","名词 · 管理事务","administration 的管理义指组织运营和执行事务；school administration 可说学校管理，不等于学生接受的课堂教学。","She works in the administration of a large hospital.","她从事一家大型医院的行政管理。","The new system simplifies routine administration.","新系统简化了日常行政事务。"],
  ["admittance","名词 · 进入许可","admittance 的日常义指获准进入场所；no admittance 是禁止进入，不一定是在说明收费或录取资格。","The sign says that admittance is for staff only.","标志写着仅限员工进入。","Visitors need a pass to gain admittance to the archive.","访客需要通行证才能进入档案馆。"],
  ["adverse","形容词 · 不利或有害的","adverse 可描述妨碍事情的情况或造成危害的影响；adverse effects 指不良影响，不能直接表示某个人不愿意做事。","Adverse weather delayed the repair work.","恶劣天气延误了维修工作。","The study examined the adverse effects of the change.","研究考察了这一变化的不良影响。"],
  ["affection","名词 · 喜爱或关爱","affection 指对人或事物温柔的喜爱，常用 affection for 表达对象；通常不是短暂兴奋或纯粹身体吸引。","She spoke of her old teacher with affection.","她满怀感情地谈起以前的老师。","He has a deep affection for the town where he grew up.","他深爱自己长大的小镇。"],
  ["afflict","动词 · 使遭受痛苦","afflict 常以疾病、灾难等作主语，指给人带来持续痛苦；被动结构 be afflicted with 说明所受困扰。","Long droughts can afflict farming communities.","长期干旱会让农业社区深受其苦。","The problems that afflict the region require lasting solutions.","困扰该地区的问题需要长久的解决方案。"],
  ["aftermath","名词 · 余波或事后时期","aftermath 常说灾难或重大不良事件后的影响、时期；in the aftermath of 后接事件，不泛指任何普通活动之后。","Volunteers brought food in the aftermath of the flood.","洪灾过后，志愿者送来了食物。","The novel explores the aftermath of a long war.","小说探讨了一场漫长战争的余波。"],
  ["agitation","名词 · 焦躁或不安","agitation 的情绪义指明显焦虑、激动或不安的状态；与普通积极兴奋不同，也不直接表示为某事采取行动。","He paced the corridor in agitation.","他焦躁地在走廊里踱步。","Her voice revealed agitation despite her calm words.","尽管措辞平静，她的声音仍显露出不安。"],
  ["aid","名词 · 援助","aid 的帮助义通常不可数，可指金钱、物资等实际援助；financial aid 是经济资助，不能与帮助者这个身份混淆。","The village received aid after the storm.","暴风雨后，村庄获得了援助。","The scholarship provides financial aid to new students.","奖学金为新生提供经济资助。"],
  ["airline","名词 · 航空公司","airline 指经营航空运输的机构及其系统；一家航空公司可以运营多个航班，不能把公司与单次飞行混为一谈。","The airline added a morning service to the island.","航空公司新增了前往该岛的早班服务。","Contact the airline if your baggage is missing.","如果行李遗失，请联系航空公司。"],
  ["algebra","名词 · 代数","algebra 指用字母、符号表示数及运算关系的数学分支；学科名通常不加不定冠词，不能泛指每一次算术运算。","We use algebra to solve equations with unknown values.","我们用代数求解有未知数的方程。","Her favourite part of mathematics is algebra.","她在数学中最喜欢代数。"],
  ["alive","形容词 · 活着的","alive 的生命义表示仍有生命，通常放在 be、keep 等词后作表语或补语；不要直接说 an alive animal。","The injured bird was still alive.","受伤的鸟仍然活着。","They worked hard to keep the young tree alive.","他们努力让小树存活。"],
  ["alloy","名词 · 合金","alloy 指由多种金属或金属与非金属结合形成的材料；an alloy of 可说明成分，不是把任意粉末混合都叫合金。","Bronze is an alloy of copper and tin.","青铜是铜和锡的合金。","The new alloy is lighter than the old material.","这种新合金比旧材料轻。"],
  ["alter","动词 · 改动","alter 指对原物作修改而使之不同，通常仍是同一对象；alter the plan 是修改计划，不一定彻底换掉它。","We may need to alter the seating plan.","我们可能需要调整座位安排。","The tailor can alter the sleeves for you.","裁缝能为你修改袖子。"],
  ["aluminum","名词 · 铝","aluminum 是金属元素铝的美式名称，作材料时通常不可数；aluminum foil 是铝箔，不应把每张箔数成一个 aluminum。","The frame is made of lightweight aluminum.","框架用轻质铝材制成。","Cover the dish with aluminum foil.","用铝箔盖住盘子。"],
  ["ambiguous","形容词 · 有歧义的","ambiguous 指能有两种或更多理解，或难以明确判断；ambiguous wording 说措辞有歧义，不等于读者完全没看见文字。","The instructions are ambiguous about the deadline.","说明对截止时间的表述有歧义。","We replaced the ambiguous phrase with a precise date.","我们把含糊短语改成了准确日期。"],
  ["amid","介词 · 在……之中","amid 后接名词，表示处于人群、环境或事件中；可说 surrounded by 的空间关系，也可说事件发生的背景。","A small cottage stood amid the trees.","一座小屋坐落在树林中。","The announcement came amid growing public interest.","公告发布时，公众的兴趣正不断增加。"],
  ["amuse","动词 · 逗乐或使消遣","amuse 通常直接接受到娱乐的人；amuse someone with something 用故事等使对方开心，不是本人感到好笑的状态。","The puppet show can amuse children of different ages.","木偶戏能逗乐不同年龄的孩子。","He tried to amuse the waiting guests with a puzzle.","他想用一道谜题让等候的客人消遣。"],
  ["ancestor","名词 · 祖先","ancestor 指家族中更早世代的祖先，常远于祖父母，也可指物种前身；不要把所有年长亲属都叫 ancestor。","She traced one ancestor to a village in the hills.","她追查到一位祖先来自山村。","The exhibit compares the modern horse with an ancient ancestor.","展览把现代马与其古老祖先作比较。"],
  ["angel","名词 · 天使","angel 的宗教义指被描绘为神的使者或守护者的灵性存在；描述艺术作品时可说 an angel，不同于 angle 角度。","The painting shows an angel beside a child.","画中一位天使站在孩子旁边。","A wooden angel stood at the top of the tree.","树顶立着一尊木制天使。"],
  ["anguish","名词 · 极度痛苦","anguish 表示强烈的痛苦、忧虑或悲伤，语气重于日常轻微烦恼；in anguish 表明处于这种煎熬中。","The letter describes her anguish during the long separation.","信中描述了她漫长分离期间的痛苦。","He cried out in anguish when he heard the news.","听到消息时，他痛苦地叫了出来。"],
  ["annoy","动词 · 使烦恼","annoy 指打扰或反复行为使人心烦，常直接接受影响的人；不要把 I annoy 当作我感到烦恼的表达。","Repeated alerts can annoy people trying to read.","反复提醒会让正想读书的人心烦。","I did not mean to annoy you with more questions.","我无意用更多问题烦扰你。"],
  ["apart","副词 · 分开或相隔","apart 可说明人或物在空间、时间上分开；two metres apart 把距离放前面，apart 后不直接接被分隔的另一件东西。","Place the chairs a metre apart.","把椅子摆成间隔一米。","The sisters lived apart for several years.","姐妹俩分开住了几年。"],
  ["apparent","形容词 · 明显的或表面上的","apparent 可指很明显，也可说看似如此而未必真实；apparent confidence 不自动证明当事人内心确实有信心。","The improvement was apparent after the first week.","第一周过后，进步已很明显。","Her apparent confidence hid years of careful practice.","她表面上的从容背后是多年的认真练习。"],
  ["appetite","名词 · 食欲","appetite 的饮食义指想吃东西的欲望；lose your appetite 是没了胃口，不等于丢掉食物，也不说明消化能力。","The long walk gave us a healthy appetite.","长途步行让我们胃口很好。","She lost her appetite before the important meeting.","重要会议前，她没了胃口。"],
  ["applicable","形容词 · 适用的","applicable 表示规则、方法等可以用于某情形；applicable to 后接适用对象，不是表示申请职位的动作。","The discount is applicable to online orders only.","折扣只适用于网上订单。","These safety rules are applicable to every workshop.","这些安全规则适用于每个工作坊。"],
  ["appoint","动词 · 任命","appoint 的人事义指正式选定某人担任职务；appoint someone director 可以直接接职位，不是一般邀请参加活动。","They will appoint a new director next month.","他们下个月将任命一位新主管。","The club may appoint her captain for the next season.","俱乐部可能任命她为下赛季队长。"],
  ["appropriate","形容词 · 恰当的","appropriate 指与场合、目的相符，可用 appropriate for 或 to 引出对象；这里是形容词，不套用同形动词的占用义。","Choose clothing appropriate for a long walk.","选择适合长途步行的衣服。","His response was calm and appropriate to the situation.","他的回应冷静且符合当时情境。"],
  ["approximate","形容词 · 大约的","approximate 描述接近准确值但并不精确的数量或结果；an approximate cost 表估算费用，不能再理解为最终确定价格。","Please give us an approximate arrival time.","请告诉我们大致到达时间。","The map shows the approximate location of the campsite.","地图显示了营地的大概位置。"],
  ["argue","动词 · 争论或论证","argue 可指争论，也可指提出理由支持观点；argue about 说明争论话题，argue for 则强调支持的主张。","They often argue about how to divide the work.","他们常为如何分工争论。","The report will argue for better bus services.","报告将论证改善公交服务的必要性。"],
  ["arrest","动词 · 逮捕","arrest 的执法义指依法拘捕某人，可直接接对象；并不表示已经审判或定罪，不应把三个阶段混为一谈。","The officers had a warrant to arrest the suspect.","警员持有逮捕嫌疑人的拘捕令。","The detective decided not to arrest anyone that night.","侦探决定那晚不逮捕任何人。"],
  ["aspect","名词 · 方面","aspect 的分析义指事物可分别考察的某个方面；an aspect of 后接整体，不一定是物体外表能看到的部分。","Cost is only one aspect of the decision.","费用只是这项决策的一个方面。","The class explored the social aspect of the story.","课堂探讨了故事的社会层面。"],
  ["assign","动词 · 分配或指派","assign someone a task 或 assign a task to someone 都能分配任务；被分配的是工作或职责，不能只理解成私人赠送。","The teacher will assign each group a different chapter.","老师会给各组分配不同章节。","We need to assign a leader to every team.","我们需要给每队指派一位负责人。"],
  ["assume","动词 · 假定或认为","assume 表示暂把未经完全证实的内容当作真实，可接 that 从句；不能仅因用了 assume 就认为结论已有证据保证。","Do not assume that every visitor speaks English.","不要假定每位游客都会说英语。","We can assume for now that the measurements are correct.","我们暂且可以假定测量结果正确。"],
  ["athlete","名词 · 运动员","athlete 指在需要力量、敏捷或耐力的运动方面受训或有技能的人；不局限于田径，也不要求必定是职业选手。","The athlete warmed up beside the track.","运动员在跑道旁热身。","Each athlete received a detailed training plan.","每位运动员都收到了一份详细训练计划。"],
  ["attain","动词 · 达到或获得","attain 常用于较正式语境，直接接目标、水平或地位；attain a standard 表达到标准，不需要额外加 to。","The course helps learners attain a higher level of fluency.","课程帮助学习者达到更高的流利程度。","Few teams attain this standard in their first season.","很少有队伍能在首个赛季就达到这一标准。"],
  ["attract","动词 · 吸引","attract 可说引起人的兴趣，也可说物理吸引；attract attention 直接接注意力，不把 attention 当作需要加 to 的对象。","The bright display can attract visitors from across the street.","明亮的展示能吸引街对面的访客。","The unusual roof is sure to attract attention.","这个独特屋顶一定会引起注意。"],
  ["authority","名词 · 权限或权威","authority 的权力义指指挥、决定或许可的权利；have authority to do 表有权做某事，不说明是否愿意做。","Only the manager has authority to approve this purchase.","只有经理有权批准这次采购。","The captain spoke with quiet authority.","队长说话平静而有威严。"],
  ["avoid","动词 · 避免","avoid 后可接名词或动词的 ing 形式；avoid doing 表示避免做某事，不能把不定式直接当作这一结构。","Leave early to avoid the rush-hour traffic.","早点出发，避开高峰车流。","Try to avoid repeating the same explanation.","尽量避免重复同样的解释。"],
  ["bear","名词 · 熊","bear 作动物名词表示熊，是可数名词；a polar bear 指北极熊，不应把同形动词的承受义带进动物语境。","A bear appeared at the edge of the forest.","一只熊出现在森林边缘。","The guide showed us a bear's tracks in the snow.","向导让我们看雪中的熊脚印。"],
  ["beneath","介词 · 在……下方","beneath 后接参照对象，描述在其下方或下面；beneath the surface 可说水面以下，不要求物体彼此接触。","A small box was hidden beneath the stairs.","楼梯下藏着一个小盒子。","Fish moved just beneath the surface of the pond.","鱼就在池塘水面下游动。"],
  ["bind","动词 · 捆绑","bind 可指用绳带绑紧或固定；bind something with 后说明捆绑材料，过去式和过去分词都是 bound。","Use this cord to bind the loose branches.","用这根绳把散开的树枝捆起来。","They bind the packages with a strong paper band.","他们用结实的纸带绑住包裹。"],
  ["break","动词 · 弄碎或折断","break 可说使物体分成几部分；break something in half 表示分成两半，过去式 broke，过去分词 broken。","Break the biscuit in half before sharing it.","分享饼干前先把它掰成两半。","A sudden fall could break the thin glass.","突然掉落可能把薄玻璃摔碎。"],
  ["building","名词 · 建筑物","building 作建筑物名词时可数，通常指供长期使用、有墙顶的结构；一栋楼用 a building，不必再加 house。","The building has a lift and two staircases.","这栋建筑有一部电梯和两段楼梯。","A new building now stands beside the library.","图书馆旁现在立着一栋新楼。"],
  ["capable","形容词 · 有能力的","capable of 后接名词或动词 ing，表示具有某种能力；of 属于固定结构，不能直接改成 capable to do。","The robot is capable of lifting small boxes.","这个机器人能举起小箱子。","She is capable of leading the group on her own.","她有能力独立带领这个小组。"],
  ["carry","动词 · 搬运或携带","carry 说托着、拿着或运输人和物；本身不限定朝说话者来或离开，需用目的地或方向补充。","Could you carry this box to the kitchen?","你能把这个箱子搬到厨房吗？","I always carry a small notebook on walks.","我散步时总带着一本小笔记本。"],
  ["casual","形容词 · 非正式的","casual 的服装和场合义表示休闲、不拘礼节；casual clothes 是便服，不自动表示衣服质量随便或破旧。","The invitation asks guests to wear casual clothes.","请柬请客人穿便服。","We had a casual conversation over lunch.","我们午饭时随意聊了聊。"],
  ["caution","名词 · 谨慎","caution 的谨慎义指为了降低风险而小心判断；with caution 表谨慎地，use caution 则表示行事小心。","Approach the damaged steps with caution.","靠近损坏的台阶时要小心。","The team used caution when moving the fragile model.","团队搬动易碎模型时十分谨慎。"],
  ["century","名词 · 一百年或世纪","century 的时间义是一百年；a century 可说一百年的时长，the twentieth century 则指按历法编号的二十世纪。","The bridge has stood for nearly a century.","这座桥已屹立近百年。","The painting dates from the nineteenth century.","这幅画创作于十九世纪。"],
  ["change","动词 · 改变","change 可以直接接改变的对象，也可说对象自身发生变化；change the plan 与 the plan may change 的施事不同。","We may need to change the meeting time.","我们可能需要更改开会时间。","The weather can change quickly in the hills.","山区天气可能变化很快。"],
  ["chase","名词 · 追赶","chase 作名词可说追逐这一过程；a chase 是一次追赶，give up the chase 表停止追，不等于已经追上。","The fox escaped after a long chase.","经过长时间追赶，狐狸逃走了。","The film opens with a chase through a crowded market.","影片以一场穿过拥挤市场的追逐开场。"],
  ["choice","名词 · 选择","choice 可以指选择的行为、机会或所选对象；make a choice 是作出选择，have no choice 是没有选择余地。","We must make a choice before the tickets sell out.","票售罄前我们必须作出选择。","The quieter room was my first choice.","安静些的房间是我的首选。"],
  ["citizen","名词 · 公民","citizen 的国家身份义指属于某国并受其保护的人；citizen of 后接国家，不能仅凭居住地点判断国籍。","She became a citizen of the country where she had lived for years.","她成为了自己居住多年的那个国家的公民。","Every citizen received an invitation to the public meeting.","每位公民都收到了一份公众会议邀请。"],
  ["claim","动词 · 要求或认领","claim 的权利义指提出要求或以正当所有者身份领取；claim a prize 是领奖，不是仅说自己希望得奖。","Please bring identification to claim your prize.","领奖时请带身份证明。","No one came to claim the lost suitcase.","没有人来认领丢失的手提箱。"],
  ["climb","动词 · 攀爬或上升","climb 可说向上移动、攀爬，也可说数量逐渐增加；climb a hill 可直接接所攀对象，不强制加 up。","We plan to climb the hill before breakfast.","我们计划早饭前爬山。","The path begins to climb after the bridge.","过桥后，小路开始向上延伸。"],
  ["clumsy","形容词 · 笨拙的","clumsy 可描述动作不灵巧，也可描述设计使用不便；clumsy fingers 不意味着手指本身很大，重点是操作笨拙。","My clumsy attempt to juggle made everyone laugh.","我笨拙地尝试玩杂耍，把大家逗笑了。","The tool is too clumsy for such delicate work.","这个工具太笨重，不适合如此精细的工作。"],
  ["combat","名词 · 战斗","combat 作名词可指对抗或战争中的实际战斗；in combat 表在战斗中，不是比赛获胜或作战计划本身。","The novel describes the soldier's first experience of combat.","小说描写了那名士兵第一次参战的经历。","The museum displays equipment used in combat.","博物馆展示曾用于战斗的装备。"],
  ["comment","名词 · 评论或意见","comment 指表达观点的评论，也可作文字旁的注释；a comment on 后接评论对象，不等于一项命令。","The teacher left a helpful comment on my draft.","老师在我的草稿上留下了一条有用意见。","His comment changed the direction of the discussion.","他的评论改变了讨论方向。"],
  ["program","名词 · 节目单（美式拼写）","program 的节目单义指列出演出次序、内容和参与者的材料；a concert program 是音乐会节目单，不专指电脑程序。","The program lists every performer in order.","节目单按顺序列出了每位表演者。","I kept the concert program as a souvenir.","我把音乐会节目单留作纪念。"],
  ["national","形容词 · 国家的或全国性的","national 与一个国家整体有关；national flag 是国旗，national competition 是全国性比赛，不一定是国际比赛。","The national museum opens a new gallery today.","国家博物馆今天开放一个新展厅。","Their school reached the national competition.","他们学校进入了全国比赛。"],
  ["perhaps","副词 · 也许","perhaps 表示有可能但不确定，可以放句首表达推测或委婉建议；不需要再接一个 to 才能引出完整句子。","Perhaps we should move the meeting indoors.","也许我们应该把会议移到室内。","She is perhaps the youngest person in the group.","她也许是组里最年轻的人。"],
  ["later","副词 · 后来或以后","later 的参照点由语境决定，可以是现在或过去某时；two days later 是两天以后，不必一定指明天之后。","We can discuss the details later.","我们可以稍后讨论细节。","Two weeks later, a letter arrived from the artist.","两周后，艺术家寄来的信到了。"],
  ["produce","动词 · 产生或生产","produce 可以说制造产品、产出结果或使事物出现；produce a result 强调产生结果，不只是宣布已有的结论。","The farm can produce enough food for the village.","农场能生产足够全村食用的粮食。","The new method may produce clearer images.","新方法可能产生更清晰的图像。"],
  ["team","名词 · 团队或队伍","team 指共同参加工作或活动的一群人；a team member 是成员，team 本身指整体，不限定必须是体育队。","The team designed a simple water filter.","团队设计了一个简单的滤水器。","Our debate team practises every Tuesday.","我们的辩论队每周二练习。"],
  ["public","形容词 · 面向公众的","public 描述对公众开放或与大众相关的事物；a public meeting 面向公众，不自动表示所有发言都已正式公布。","The town will hold a public meeting on transport.","小镇将举行关于交通的公众会议。","This path leads to a public garden.","这条路通向一座公共花园。"],
  ["centre","名词 · 中心（英式拼写）","centre 是 center 的常见英式拼写；the centre of 说某物中心，既可指位置，也可指活动集中的重要地点。","Place the vase in the centre of the table.","把花瓶放在桌子中央。","The town became a centre for pottery.","这座镇子成了陶器制作中心。"],
  ["remain","动词 · 留下或保持","remain 可指留在原处，也可后接形容词说明状态持续；remain calm 表保持冷静，不另加一个 be。","Please remain in your seats until the music ends.","音乐结束前请留在座位上。","The door must remain closed during the test.","测试期间门必须保持关闭。"],
  ["type","名词 · 种类","type 的分类义常用 a type of 后接事物；what type of 询问种类，不是询问一件物品的数量。","This type of plant grows well in shade.","这种植物在阴处生长良好。","What type of music will the band play?","乐队要演奏什么类型的音乐？"],
  ["patient","形容词 · 有耐心的","patient 作形容词表示能平静等待或应对困难，patient with 后接对待的人；此义不是医院里病人的名词。","Please be patient with new members of the class.","请对班级新成员耐心一些。","The patient teacher explained the rule again.","耐心的老师又解释了一遍规则。"],
  ["likely","形容词 · 可能的","likely 表示发生概率较高，常用 be likely to do；语气不保证事情必然发生，不能把它当成已经完成的事实。","The river is likely to rise after tonight's rain.","今晚降雨后河水很可能上涨。","They are likely to arrive before noon.","他们很可能在中午前到达。"],
  ["particularly","副词 · 尤其或格外","particularly 可以突出某个对象，也可加强程度；particularly useful 是格外有用，不能直接当形容词修饰名词。","The course is particularly useful for beginners.","课程对初学者尤其有用。","I enjoyed the exhibition, particularly the wood carvings.","我喜欢这次展览，尤其是木雕。"],
  ["drug","名词 · 药物","drug 的医疗义可指用于治疗等目的的药物；a prescription drug 是处方药，不能仅凭 drug 就断定是非法毒品。","The label gives the name of the drug.","标签注明了药物名称。","The researchers are studying a new drug in the laboratory.","研究人员正在实验室研究一种新药。"],
  ["thus","副词 · 因此或这样","thus 在结果义中相当于因此，常见于较正式表达；前面需要有能支持结果的原因，不是单纯按时间往后接。","The bridge was closed; thus, we took another route.","桥关闭了，因此我们改走另一条路线。","The file was empty and thus offered no useful information.","文件是空的，因此没有提供有用信息。"],
  ["player","名词 · 选手或演奏者","player 可指参加游戏、体育运动的人，也可指乐器演奏者；a piano player 是弹钢琴的人，不是钢琴这台设备。","Each player drew a card from the pile.","每位玩家从牌堆抽了一张牌。","The piano player arrived early for rehearsal.","钢琴演奏者提前到了排练现场。"],
  ["central","形容词 · 中央的或核心的","central 可说位置靠中心，也可说起关键作用；a central idea 是核心思想，不必与物理空间中央有关。","The central courtyard is open to visitors.","中央庭院向游客开放。","Trust is central to the team's success.","信任是团队成功的核心。"],
  ["rule","名词 · 规则","rule 是指导行为或活动的规定；follow a rule 是遵守规定，break a rule 是违反规定，不是折断实体物品。","The first rule is to keep the doorway clear.","第一条规则是保持门口畅通。","We agreed on a rule for sharing the equipment.","我们就共用设备达成了一条规则。"],
  ["officer","名词 · 警员或任职人员","officer 可指警员，也可指担任某项职务的人；a police officer 是一名警察，单个身份与集合名词 police 不同。","The officer asked us to wait by the entrance.","警员请我们在入口旁等候。","A police officer helped the child find her parents.","一名警员帮助孩子找到了父母。"],
  ["private","形容词 · 私人的或限制使用的","private 表示为特定个人或群体所有、使用或关切；a private garden 不对公众普遍开放，不等于花园里此刻无人。","This gate leads to a private garden.","这扇门通向私人花园。","She asked us to keep the letter private.","她请我们不要公开那封信。"],
  ["realize","动词 · 意识到","realize 的认识义指清楚意识到某个事实或重要性；可接 that 从句，不表示事情一定是刚刚发生的。","I did not realize that the shop closed so early.","我没意识到商店关门这么早。","You soon realize how much preparation the event needs.","你很快会意识到活动需要多少准备。"],
  ["congress","名词 · 代表大会","congress 可指代表们为讨论议题而召开的正式大会；在特定国家还可指国会，不能把每次小组开会都叫 congress。","The congress brought together delegates from twelve regions.","大会汇集了十二个地区的代表。","She presented her research at an international congress.","她在国际大会上介绍了自己的研究。"],
  ["rise","动词 · 上升","rise 表示自身上升、增加，是不及物动词；不能直接用 rise the flag 表升旗，过去式 rose，过去分词 risen。","Warm air begins to rise above the heater.","暖空气开始从加热器上方升起。","Prices may rise during the holiday season.","假期旺季价格可能上涨。"],
  ["fight","动词 · 打斗或奋力争取","fight 可说打斗，也可说为目标努力；fight for 引出争取的对象，过去式和过去分词都是 fought。","The children promised not to fight over the toys.","孩子们保证不再为玩具打架。","The group will fight for a cleaner river.","这个团体将为更清洁的河流而努力。"],
  ["despite","介词 · 尽管","despite 后接名词、代词或动词 ing，不直接引出普通完整从句；它本身已含尽管义，后面不加 of。","We continued the walk despite the cold wind.","尽管冷风吹着，我们仍继续步行。","She finished the task despite feeling tired.","尽管感到疲惫，她还是完成了任务。"],
  ["thought","名词 · 想法","thought 作名词可指一条想法或一次思考；a thought about 后接相关主题，不要把它只看成 think 的过去式。","A sudden thought made her stop at the door.","一个突如其来的想法让她停在门口。","He shared a thought about the ending of the story.","他分享了一个关于故事结尾的想法。"],
  ["decade","名词 · 十年","decade 的常见时间义是十年，a decade of 后可接这段时期的活动或变化；不要与一百年的 century 混淆。","The theatre reopened after a decade of repairs.","剧院经过十年修缮后重新开放。","A decade later, the two friends met again.","十年后，两位朋友再次相见。"],
  ["media","名词 · 新闻与传播媒体","media 可指报纸、广播、网站等向公众传播信息的媒体；the media 强调整体，实际语境中可按集合或复数处理。","The event attracted attention from the local media.","活动引起了本地媒体的关注。","She studies how digital media influence public debate.","她研究数字媒体如何影响公共讨论。"],
  ["mile","名词 · 英里","mile 常指等于五千二百八十英尺的英里，不能直接当作公里；a mile 是一英里，多英里常用 miles。","The village is a mile beyond the bridge.","村庄在桥过去一英里的地方。","We walked the final mile in silence.","最后一英里我们默默走完了。"],
  ["task","名词 · 任务","task 指需要完成的一项工作，通常可数；complete a task 是完成任务，不能把一整份职业总称都当作单个 task。","Our first task is to label the boxes.","我们的首项任务是给箱子贴标签。","She divided the difficult task into smaller steps.","她把困难的任务拆成了更小的步骤。"],
  ["indicate","动词 · 表明或指示","indicate 可直接接指示的对象，也可接 where、that 等从句；迹象可以 indicate 某事，但不自动证明原因唯一。","The arrow will indicate the correct exit.","箭头会指示正确出口。","Please indicate whether you need a printed copy.","请注明你是否需要纸质副本。"],
  ["hall","名词 · 大厅或礼堂","hall 可指建筑入口大厅、走廊，也可指供集会的大房间；a concert hall 是音乐厅，不是每栋普通房屋的名称。","The school hall was full before the concert began.","音乐会开始前学校礼堂就坐满了。","Please leave your umbrellas in the entrance hall.","请把雨伞留在门厅。"],
  ["previous","形容词 · 先前的","previous 表示时间或顺序在前的；the previous day 以所述时间为参照，不必是相对于今天的昨天。","Please read the previous paragraph again.","请再读一遍前一段。","The previous owner planted these apple trees.","上一位主人种下了这些苹果树。"],
  ["truth","名词 · 真相或事实","truth 可指与事实相符的内容，tell the truth 是说实话；区别于形容词 true，不能直接说 the story is truth。","We wanted to learn the truth about the missing painting.","我们想知道画作失踪的真相。","She finally decided to tell the truth.","她最终决定说出实情。"],
  ["throughout","介词 · 贯穿全部时间或空间","throughout 后接范围，强调整个期间或各个部分；throughout the night 是整晚，不只是夜里某一瞬间。","The lights stayed on throughout the night.","灯整夜都亮着。","Small signs were placed throughout the museum.","博物馆各处都设置了小标牌。"],
  ["industrial","形容词 · 工业的","industrial 与工业生产、工业使用或工业发达地区相关；industrial equipment 是工业设备，不单表示看起来现代。","The town grew around a large industrial site.","小镇围绕一处大型工业区发展起来。","The museum preserves old industrial machinery.","博物馆保存着旧工业机械。"],
  ["rock","动词 · 摇动","rock 作摇动的动词可说人使东西来回摆动，也可说东西自行摇晃；rock a baby 是轻摇哄婴儿，不是名词石头。","The waves made the small boat rock.","波浪让小船摇晃起来。","She began to rock the cradle gently.","她开始轻轻摇动摇篮。"],
  ["stone","名词 · 石块或石材","stone 作材料时可整体表达，a stone 指一块石头；a stone wall 里的 stone 修饰墙的材质，不表示墙只有一块石头。","A flat stone marked the edge of the path.","一块平石标示着小路边缘。","The house has a low wall made of stone.","房子有一道石砌矮墙。"],
  ["improve","动词 · 改善","improve 可直接接要改善的事物，也可说情况自身变好；improve your writing 是改进写作，不强制接介词 up。","Daily reading can improve your vocabulary.","每天阅读可以提升词汇水平。","The weather should improve by the afternoon.","下午天气应该会好转。"],
  ["direction","名词 · 指导或管理","direction 的指导义常用 under the direction of，说明工作由谁指导；这里通常整体表达，不是地理方向或路线说明。","The play was prepared under the direction of a drama teacher.","话剧在一位戏剧老师的指导下筹备。","The volunteers need clear direction from the project leader.","志愿者需要项目负责人给出明确指导。"],
  ["traditional","形容词 · 传统的","traditional 描述从过去传下来的习惯、技艺或做法；traditional food 是传统食物，不自动表示做法完全未变。","The festival includes traditional songs and dances.","节庆包括传统歌曲和舞蹈。","She learned a traditional method of weaving baskets.","她学会了一种传统编篮方法。"],
  ["professional","形容词 · 专业方面的","professional 可说明与某职业及其训练有关；professional development 是专业发展，不仅是工资高或穿着正式。","The course offers professional development for teachers.","课程为教师提供专业发展机会。","She sought professional advice before repairing the old instrument.","修复旧乐器前，她寻求了专业建议。"],
  ["inside","名词 · 内部","inside 作名词表示某物内部或内侧，常用 the inside of；这一结构中的 of 连接整体，不等于单独介词 inside。","The inside of the box was lined with cloth.","盒子内部衬着布。","She wiped the inside of the window.","她擦了窗户内侧。"],
  ["island","名词 · 岛屿","island 指四周被水围住的陆地；on an island 表示在岛上，不能因为岛属于一个国家就把它译成内陆。","The island is connected to the mainland by a ferry.","渡轮把岛屿与大陆连接起来。","We spent two nights on a small island.","我们在一座小岛上住了两晚。"],
  ["dream","名词 · 睡梦","dream 的睡眠义指睡觉时出现的画面、思想和感受；have a dream about 后接梦到的内容，不一定表示人生理想。","I had a strange dream about our old school.","我做了一个关于母校的奇怪的梦。","The sound of rain became part of her dream.","雨声进入了她的梦中。"],
  ["heat","动词 · 加热","heat 作动词表示使温度升高；heat water 是给水加热，heat something to 后可接目标温度，不需要到沸腾才算。","Heat the milk gently in a small pan.","用小锅慢慢加热牛奶。","The system uses sunlight to heat water.","系统利用阳光给水加热。"],
  ["owner","名词 · 所有者","owner 是拥有某物或享有其正当所有权的人；the owner of 后接所拥有对象，不一定是当前使用该物的人。","We found the owner of the missing dog.","我们找到了走失狗的主人。","The owner agreed to repair the broken window.","业主同意修好破窗。"],
  ["notice","名词 · 通知或预先告知","notice 作通知义可指预先提供的消息，give notice 是提前告知；without notice 是没有预告，并非什么都没注意到。","Please give us notice before changing the delivery date.","更改送货日期前请提前通知我们。","The timetable may change without notice.","时间表可能不经预告而变更。"],
  ["communication","名词 · 沟通","communication 指交换信息、表达想法的过程，通常整体表达；communication with 引出沟通对象，不只限于说话声音。","Clear communication helped the team avoid mistakes.","清晰沟通帮助团队避免了错误。","The group relies on communication by email.","小组依靠电子邮件沟通。"],
  ["shot","名词 · 投篮或射门等一次动作","shot 在体育语境可指为了得分而进行的一次击球、投篮等；take a shot 是尝试得分，不保证球已命中。","Her final shot hit the edge of the basket.","她最后一投碰到了篮筐边缘。","He took a shot from outside the penalty area.","他从禁区外射了一脚。"],
  ["scientist","名词 · 科学家","scientist 指掌握科学知识并从事科学研究的人；a scientist 可说明职业身份，不是每位学习科学课的学生。","The scientist recorded the temperature every hour.","科学家每小时记录一次温度。","We invited a scientist to explain the experiment.","我们请来一位科学家解释实验。"],
  ["requirement","名词 · 要求或必要条件","requirement 指必须具备或满足的条件；meet a requirement 是满足要求，不是遇见一个人，常接 for 说明用途。","Previous experience is not a requirement for this course.","这门课程不要求具备先前经验。","The design meets every safety requirement.","设计符合每一项安全要求。"],
  ["speech","名词 · 演讲","speech 作公开演讲义时可数，give a speech 表发表演讲；与一般说话能力的不可数义不同，不必每次长谈都算演讲。","She gave a short speech at the opening ceremony.","她在开幕式发表了简短讲话。","His speech focused on the value of local history.","他的演讲重点谈当地历史的价值。"],
  ["forest","名词 · 森林","forest 指大片树木及其覆盖的区域；a forest 是一片森林，不是单独一棵树，through the forest 表穿过林中。","A narrow trail runs through the forest.","一条窄径穿过森林。","The forest shelters many kinds of birds.","森林为许多鸟类提供栖身处。"],
  ["safety","名词 · 安全状态","safety 的状态义通常不可数；for safety 表为了安全，reach safety 表到达安全处，不是把安全当作一件工具。","The path was closed for safety.","这条小路为了安全而关闭了。","The guide led everyone to safety before dark.","向导在天黑前把所有人带到安全处。"],
  ["directly","副词 · 直接地","directly 可表示没有中间环节地行动，也可表达位置直达；contact directly 说直接联系，不必等同于立刻联系。","Please send your questions directly to the organiser.","请直接把问题发给组织者。","The path leads directly to the station entrance.","小路直通车站入口。"],
  ["freedom","名词 · 自由","freedom 的选择义通常不可数；freedom to do 表自由做某事，of 可连接表达等权利内容，不是免费价格义。","Students have the freedom to choose a project topic.","学生可以自由选择项目题目。","The poem celebrates the freedom of movement.","这首诗赞颂行动的自由。"],
  ["completely","副词 · 完全地","completely 强调动作完成或程度达到全部，可修饰动词、形容词；completely empty 表完全空，不是大部分空。","The room was completely empty when we arrived.","我们到达时房间完全是空的。","I had completely forgotten about the spare key.","我完全忘了备用钥匙的事。"],
  ["researcher","名词 · 研究人员","researcher 指从事系统研究的人；可研究历史、教育等多个领域，不一定只在实验室里做自然科学实验。","The researcher interviewed teachers from six schools.","研究人员采访了六所学校的教师。","A local researcher helped us trace the building's history.","一位本地研究者帮我们追查建筑历史。"],
  ["insurance","名词 · 保险","insurance 指针对约定风险损失提供保障的合同安排，通常不可数；travel insurance 是旅行保险，不指一次赔款本身。","The company asked for proof of insurance.","公司要求提供保险证明。","Our booking includes travel insurance for the trip.","我们的预订包含该旅程的旅行保险。"],
  ["transport","动词 · 运输","transport 作动词可直接接被运送的人或物，常用 from、to 说明起终点；不必一定由大型货车完成。","The boats transport supplies to the island.","这些船把物资运到岛上。","We need a van to transport the stage equipment.","我们需要一辆货车运送舞台设备。"],
  ["protection","名词 · 保护","protection 说保护行为或受保护状态时通常不可数；protection from 后接威胁来源，不是受保护的人。","The roof gives the plants protection from heavy rain.","屋顶为植物遮挡大雨。","The cases provide extra protection during transport.","这些箱子在运输时提供额外保护。"],
  ["wood","名词 · 木材","wood 作木材义通常不可数；made of wood 表由木材制成，一块木头用 a piece of wood，不直接数成 a wood。","The table is made of recycled wood.","桌子由回收木材制成。","We found a smooth piece of wood on the beach.","我们在海滩找到了一块光滑木头。"],
  ["understanding","名词 · 理解","understanding 可指对某主题的理解，常说 an understanding of；这里可加描述程度的形容词，不是表示理解别人的形容词义。","The visit gave us a better understanding of farm life.","参观让我们更了解农场生活。","Her understanding of the problem changed after the interview.","采访后，她对问题的理解改变了。"],
  ["regular","形容词 · 定期或有规律的","regular 可描述按固定或正常间隔重复发生的事物；regular meetings 是定期会议，不一定表示每天都有。","Regular practice helped her read music more confidently.","规律练习让她读谱更有信心。","The team holds regular meetings during the project.","项目期间团队定期开会。"],
  ["reporter","名词 · 记者","reporter 的新闻义指搜集、报道新闻的人，可任职于报纸、广播或电视等媒体；不要求一定在镜头前播报。","The reporter interviewed residents near the river.","记者采访了河边居民。","A local reporter asked about the new library.","一位本地记者询问了新图书馆的情况。"],
  ["wine","名词 · 葡萄酒","wine 常指由葡萄发酵而成的酒，作饮品整体时通常不可数；a glass of wine 是一杯，具体品种语境可用复数。","The recipe uses a little white wine.","食谱要用一点白葡萄酒。","The menu lists the wine served with each course.","菜单列出了各道菜所配的葡萄酒。"],
  ["tiny","形容词 · 极小的","tiny 表示非常小，比一般 small 的程度更强；可修饰物体或少量差别，不自动表示可爱或不重要。","A tiny bird landed on the windowsill.","一只小小的鸟落在窗台上。","There was a tiny hole near the bottom of the bag.","包底附近有个很小的洞。"],
  ["mostly","副词 · 大部分地","mostly 表示某种情况占主要部分，仍容许其他部分不同；mostly empty 不是完全空，也不等于形容词 most。","The audience was mostly made up of local families.","观众主要由本地家庭组成。","The sky stayed mostly clear during the walk.","步行期间天空大部分时间保持晴朗。"],
  ["injury","名词 · 伤害或损伤","injury 可指身体等受到的损伤，具体一处伤可用 an injury；a knee injury 是膝部损伤，不是所有疾病的总称。","A knee injury kept him out of the final.","膝部损伤让他无缘决赛。","The helmet reduced the risk of head injury.","头盔降低了头部受伤的风险。"],
  ["mainly","副词 · 主要地","mainly 表示主要部分或主要原因；mainly because 引出主要原因，不说明这是唯一原因，也不是形容词 main。","The class is mainly for adult beginners.","课程主要面向成年初学者。","We chose the route mainly because it was quieter.","我们选择这条路线主要因为它更安静。"],
  ["engine","名词 · 发动机","engine 指把能量转为机械动力的发动机等装置；start the engine 表启动发动机，不代表整辆车已经开始移动。","The engine made an unusual rattling sound.","发动机发出不寻常的咔嗒声。","The mechanic checked the engine before the journey.","机械师在旅程前检查了发动机。"],
  ["previously","副词 · 以前或先前","previously 表示在某个时间点之前，修饰动作或状态；a previously closed road 指先前关闭过的道路，不是形容词 previous。","The room had previously been used for storage.","这个房间以前用来储物。","I had not previously met the other speakers.","我此前没有见过其他演讲者。"],
  ["technical","形容词 · 技术或专业方面的","technical 指涉及专门、实用或科学技术知识的内容；technical language 是专业术语表达，不只是难懂就叫 technical。","The manual includes technical drawings of the machine.","手册包含机器的技术图纸。","We asked for technical support with the projector.","我们为投影仪寻求技术支持。"],
  ["suit","名词 · 套装或西服","suit 的服装义通常指相配的两件或更多衣物组成的套装；a dark suit 可指深色西装，不是单独一件衬衫。","He wore a grey suit to the interview.","他穿了一套灰西装参加面试。","The tailor adjusted the jacket of her suit.","裁缝修改了她套装的外套。"],
  ["location","名词 · 位置或地点","location 指人、物或活动所在的地点；the location of 后接对象，不能仅凭这个词判断是当前位置还是预定地点。","The map shows the location of every exit.","地图显示了每个出口的位置。","We chose a quiet location for the recording.","我们选择了一个安静地点录音。"],
  ["increasingly","副词 · 越来越","increasingly 表示程度逐步增加，常修饰形容词或动作；increasingly popular 是越来越受欢迎，不必再加 more 表同一层比较。","The path became increasingly narrow as we climbed.","随着攀爬，小路越来越窄。","Students are increasingly using the online archive.","学生越来越多地使用在线档案库。"],
  ["distribution","名词 · 分发或分布","distribution 可指把物品分发出去的过程，也可指在区域中的分布；the distribution of 后接所分发或考察的对象。","The volunteers organised the distribution of warm blankets.","志愿者组织分发保暖毯。","The map shows the distribution of rainfall across the island.","地图显示了全岛降雨量分布。"],
  ["loan","名词 · 贷款或借出物","loan 可指借来需偿还的钱，也可指暂借的东西；take out a loan 表取得贷款，on loan 表暂时借出或借用。","They took out a small loan to repair the roof.","他们贷了一小笔款来修屋顶。","The painting is on loan from a private collection.","画作由私人收藏借出。"],
  ["unable","形容词 · 不能的","unable 常放在 be 等连系动词后，unable to do 表无法做某事；可能出于条件限制，不一概表示永远没有能力。","We were unable to open the damaged door.","我们打不开受损的门。","She is unable to attend the meeting this afternoon.","她今天下午无法参会。"],
  ["limited","形容词 · 有限的","limited 指数量、程度或范围受限制；limited time 是时间有限，limited to 则明确限定在哪个范围。","We have limited space for the exhibition.","我们的展览空间有限。","The offer is limited to current members.","优惠仅限现有会员。"],
  ["explanation","名词 · 解释或说明","explanation 可指解释的内容，常用 an explanation of 说明要解释的对象；for 也可引出某种情况的原因。","Her explanation of the rules made the game much easier.","她对规则的解释让游戏容易多了。","We still need an explanation for the missing files.","文件失踪的事仍需要一个解释。"],
  ["surely","副词 · 想必或肯定","surely 可表达说话者的确信，也常含期待对方认同的语气；不能仅凭出现 surely 就把未经核实的推测当事实。","Surely there is a simpler way to carry these boxes.","想必有更简单的办法搬这些箱子。","The repaired bridge will surely make the journey easier.","修好的桥肯定会让旅程更方便。"],
  ["definition","名词 · 定义","definition 指说明一个词、符号或概念意义的陈述；a definition of 后接被定义对象，不等同于一则具体例子。","The report begins with a clear definition of success.","报告开头明确定义了成功。","The two teams agreed on a shared definition of the problem.","两支团队就问题的共同定义达成一致。"],
  ["nod","动词 · 点头","nod 指头部短促向下的动作，可表达同意或打招呼；过去式 nodded 和 ing 形式 nodding 都双写 d。","Just nod if you can hear me clearly.","如果能清楚听到我，就点点头。","The receptionist gave a smile and began to nod.","接待员微微一笑，开始点头。"],
  ["concentration","名词 · 专注","concentration 的注意力义通常整体表达，指把注意力集中到一件事上；lose concentration 是走神，不是丢掉物品。","The puzzle requires a lot of concentration.","这个谜题需要很专注。","The sudden noise broke her concentration.","突如其来的噪声打断了她的专注。"],
  ["reading","名词 · 阅读活动","reading 作阅读活动的名词时通常不可数；do some reading 表读一些东西，不必指正在朗读给别人听。","The course leaves time for independent reading.","课程留出了自主阅读时间。","Quiet reading is part of our evening routine.","安静阅读是我们晚间惯例的一部分。"],
  ["scientific","形容词 · 科学的或符合科学方法的","scientific 与科学知识、原则或系统研究方法相关；scientific evidence 是科学证据，不只是看起来专业的说法。","The claim needs stronger scientific evidence.","这个说法需要更有力的科学证据。","The class practised a scientific method of testing ideas.","全班练习了用科学方法检验想法。"],
  ["emotional","形容词 · 情绪方面的或情绪激动的","emotional 可说与情绪有关，也可说人情绪强烈；emotional support 是情感支持，不能全部译成容易哭。","She valued the emotional support of her friends.","她珍视朋友给予的情感支持。","The farewell was an emotional moment for the whole team.","告别是让全队情绪激动的一刻。"],
  ["properly","副词 · 正确或恰当地","properly 修饰动作，表示符合要求、方式正确；work properly 是正常工作，不自动表示速度快或功能更多。","Make sure the lid closes properly.","确保盖子关严。","The microphone was not connected properly.","麦克风没有正确连接。"],
  ["elsewhere","副词 · 在别处或到别处","elsewhere 本身表示别的地方，可直接跟在 go、look 等动词后；不需要额外用 to 来引出地点。","The shop was closed, so we looked elsewhere.","商店关门了，所以我们去别处找。","The original painting is displayed elsewhere in the museum.","原画在博物馆另一处展出。"],
  ["somehow","副词 · 以某种办法或不知为何","somehow 可说以未明确说明的方式，也可表示原因不明；它不说明具体如何做到，不能当成详细操作步骤。","We will get all the equipment upstairs somehow.","我们总会想办法把所有设备搬上楼。","Somehow, the tiny key had fallen into my shoe.","不知怎么，小钥匙掉进了我的鞋里。"],
  ["storm","名词 · 暴风雨等强烈天气","storm 指伴随强风、雨雪或雷电的恶劣天气事件；a snow storm 侧重暴雪，不保证每种 storm 都一定下雨。","The storm damaged several roofs near the harbour.","暴风雨损坏了港口附近的几处屋顶。","We reached shelter before the storm began.","暴风雨开始前我们到了避难处。"],
  ["widely","副词 · 广泛地","widely 表示覆盖很多地方、很多人或较大范围；widely used 说使用普遍，不自动表示人人都使用或认可。","The book is widely used in local schools.","这本书在当地学校被广泛使用。","The artist travelled widely before returning home.","艺术家游历多地后返回家乡。"],
  ["muscle","名词 · 肌肉","muscle 可指能收缩产生动作的肌肉组织，也可指一块具体肌肉；build muscle 谈增肌时通常整体表达。","The diagram shows how a muscle contracts.","图示说明肌肉如何收缩。","He felt a tight muscle in his calf after running.","跑步后，他感到小腿有块肌肉紧绷。"],
  ["inform","动词 · 告知","inform 常直接接接收消息的人，inform someone of 或 about 后再接内容；也可接人加 that 从句说明消息。","Please inform the organiser of any changes.","如有变更，请告知组织者。","We will inform you when the course dates are confirmed.","课程日期确定后我们会通知你。"],
  ["setting","名词 · 背景或环境","setting 可指故事发生的时间地点，也可指活动所处环境；a rural setting 是乡村环境，不是机器的参数设置。","The mountain village is the setting for the novel.","山村是小说的故事背景。","The quiet setting made the workshop feel welcoming.","安静的环境让工作坊显得亲切。"],
  ["percentage","名词 · 百分比","percentage 表示整体中按百分之几计算的部分；a percentage of 后接整体，不是直接等同于具体人数或金额。","What percentage of the class chose the science project?","班里百分之多少的人选了科学项目？","The chart shows the percentage of waste recycled each month.","图表显示每月回收废物的百分比。"],
  ["surgery","名词 · 外科或手术治疗","surgery 可指外科这一医学分支或手术治疗；在英式语境也能指诊所，不能只凭该词判断具体建筑或治疗方式。","She hopes to specialise in surgery after medical school.","她希望医学院毕业后专攻外科。","The history book describes early developments in surgery.","历史书描写了外科的早期发展。"],
  ["governor","名词 · 州长等管理首长","governor 可指一个政治辖区的行政首长，也有其他管理职务义；a state governor 通常译州长，不要把它套为所有国家元首。","The governor visited the newly restored bridge.","州长参观了新修复的桥梁。","The museum displays a portrait of a former governor.","博物馆展示了一位前任州长的肖像。"],
  ["forth","副词 · 向前或向外","forth 表示向前、向外，常见于固定搭配；from that day forth 说从那天起，不是数字顺序第四的 fourth。","From that day forth, she kept a daily journal.","从那天起，她每天写日记。","New leaves began to burst forth in spring.","春天新叶开始萌发。"],
  ["fashion","名词 · 时尚或流行样式","fashion 的样式义说某时期流行的风格；in fashion 表流行，out of fashion 表过时，不一定只谈昂贵衣物。","These bright colours are back in fashion.","这些鲜艳颜色又流行起来了。","The exhibition follows changes in fashion over a century.","展览追溯了一个世纪里时尚的变化。"],
  ["tear","动词 · 撕开","tear 作撕裂动词读音与表示眼泪的名词不同；tear something into pieces 表撕成碎片，过去式 tore，过去分词 torn。","Be careful not to tear the old map.","小心不要把旧地图撕破。","Please tear the paper along the dotted line.","请沿虚线撕开纸张。"],
  ["servant","名词 · 仆人或服务人员","servant 常指替别人做家务、侍奉的人员，也可在 public servant 中指公职人员；不能把所有服务职业都按同一义项翻译。","In the novel, a servant delivers the secret letter.","小说里，一名仆人送来了密信。","The old house had a separate entrance for each servant.","那座老宅为仆人设有单独入口。"],
  ["drawing","名词 · 绘画活动","drawing 作艺术活动义指用线条描绘形体、图样等；drawing classes 是绘画课，不等同于抽签的另一义项。","She studies drawing at the community centre.","她在社区中心学绘画。","The exercise develops basic drawing skills.","这项练习培养基础绘画技能。"],
  ["hence","副词 · 因此","hence 的结果义用于根据前文事实得出结论，语气较正式；因此义不要求再加 from，不能机械直译成从这里。","The path was flooded; hence, we returned to the village.","小路被淹了，因此我们回到村里。","The room has no windows, hence the need for good lighting.","房间没有窗户，因此需要良好照明。"],
  ["terrible","形容词 · 很糟或很严重的","terrible 可描述质量极差或让人不适的情况，程度很强；a terrible smell 是难闻气味，不一定指令人恐惧。","The hotel room had a terrible smell.","酒店房间里有股很难闻的气味。","I made a terrible mistake in the final calculation.","我在最后计算中犯了一个严重错误。"],
  ["prisoner","名词 · 被拘禁者","prisoner 指被限制自由、拘押或关在监狱中的人；不自动说明此人是否已经被判定有罪，需要结合上下文。","The prisoner was allowed to send a letter home.","被关押者获准给家里寄一封信。","The story follows a prisoner planning an escape.","故事讲述一名囚犯筹划越狱。"],
  ["rapidly","副词 · 迅速地","rapidly 修饰变化或动作的速度，表示发生得快；grow rapidly 不说明最终规模大小，只说明增长速度。","The river rose rapidly after the rain.","雨后河水迅速上涨。","The town is rapidly expanding towards the coast.","城镇正迅速向海岸扩展。"],
  ["proud","形容词 · 自豪的","proud 可描述对成就或他人的自豪，常用 proud of 或 proud to do；是否含傲慢贬义取决于语境。","She is proud of the garden she created.","她为亲手建成的花园自豪。","We were proud to represent our school.","我们为代表学校感到自豪。"],
  ["via","介词 · 经由或通过","via 后接中途地点或传递渠道；via the bridge 表经由那座桥，via email 表通过电子邮件，不局限于实际路线。","We travelled to the village via the northern road.","我们经北路去了村庄。","Send your confirmation via email.","请通过电子邮件发送确认。"],
  ["similarly","副词 · 类似地","similarly 可说明动作以相似方式进行，也可引出与前文相似的情况；比较的特点应明确，不代表两事物完全相同。","The two machines work similarly but use different materials.","两台机器工作方式相似，但使用不同材料。","The first team struggled with the wind. Similarly, the second team found it difficult.","第一队难以应对风，第二队也同样觉得困难。"],
  ["virtually","副词 · 几乎或实际上","virtually 在程度义中表示几乎、实际上已达到某程度；virtually empty 仍容许少量东西留下，并非所有语境都指网络虚拟。","The car park was virtually empty after sunset.","日落后停车场几乎空了。","The two versions are virtually identical.","两个版本几乎一样。"],
  ["addition","名词 · 增添或新增部分","addition 可指加入的动作或新增的人、物；an addition to 说明加到哪个整体，the addition of 则说明加了什么。","The new reading room is a welcome addition to the library.","新阅览室为图书馆增色不少。","The addition of lemon changed the flavour.","加了柠檬后味道变了。"],
  ["guilty","形容词 · 有内疚感的","guilty 可以描述内疚，也可用于法律有罪义；feel guilty about 说明令人内疚的事，感受本身不是法院判定。","I felt guilty about forgetting her birthday.","我因忘记她生日而内疚。","He gave a guilty smile when he saw the broken plate.","看到破盘子时，他露出了内疚的笑。"],
  ["illegal","形容词 · 违法的或违反正式规则的","illegal 指法律或正式规则不允许的行为；它比单纯让人不高兴更具体，词义本身不规定行为的处罚。","The report examined illegal dumping near the river.","报告调查了河边的非法倾倒行为。","The referee ruled that the move was illegal.","裁判判定那个动作违规。"],
  ["unknown","形容词 · 未知或不知名的","unknown 可说信息尚未获知，也可说人物不出名；an unknown artist 不等于没有创作能力，只说明知名度。","The cause of the delay is still unknown.","延误原因仍不清楚。","The gallery displayed work by an unknown artist.","画廊展出了一位不知名艺术家的作品。"],
  ["preparation","名词 · 准备","preparation 泛指准备过程时常不可数；in preparation for 表为了某事作准备，具体各项安排也可用 preparations。","The performance required weeks of preparation.","演出需要数周准备。","She practised daily in preparation for the audition.","她每天练习，为试演作准备。"],
  ["scream","动词 · 尖叫","scream 侧重突然、尖厉的大叫，可因恐惧、疼痛或激动发生；不应把所有轻声呼喊都归到 scream。","The sudden bang made the children scream.","突如其来的巨响让孩子们尖叫。","Fans began to scream when the singer appeared.","歌手出现时，歌迷们开始尖叫。"],
  ["primarily","副词 · 主要地","primarily 的主要义说明最重要的目的、原因或占比；primarily for 后接主要服务对象，不排除次要用途。","The room is used primarily for music lessons.","房间主要用于音乐课。","The project is primarily concerned with local history.","项目主要关注当地历史。"],
  ["heavily","副词 · 很大程度地","heavily 可说明受损程度、使用强度等很大，也可修饰降水；它不一定说物体自身重量高。","The road was heavily damaged in the storm.","道路在暴风雨中严重受损。","The school relies heavily on local volunteers.","学校很依赖当地志愿者。"],
  ["self","名词 · 自我或个人本来状态","self 作名词可指一个人的典型性格或状态；your true self 是真实的自我，复数是 selves，不等同于反身代词 yourself。","She felt free to show her true self with close friends.","她和亲友在一起时能自在展现真实自我。","After a quiet weekend, he was back to his usual self.","安静过完周末后，他恢复了平日状态。"],
  ["delivery","名词 · 送货或递送","delivery 可指把物品送到指定人或地点的过程；free delivery 是免费送货，a delivery 可指一次送货，不是快递员本人。","The shop offers delivery within the town.","商店提供镇内送货服务。","We are expecting a delivery of art supplies this morning.","我们预计今早会收到一批美术用品。"],
  ["poem","名词 · 一首诗","poem 指一首具体诗作，是可数名词；write a poem 说写一首诗，与泛指诗歌这一类文学的 poetry 区分。","She wrote a poem about the old railway.","她写了一首关于老铁路的诗。","The poem ends with an image of an open door.","诗以一扇敞开的门这一意象结尾。"],
  ["unlike","介词 · 与……不同","unlike 后接比较对象，表示与其不同；放句首时应让被比较的双方明确，不能当作不喜欢某物的动词。","Unlike the first route, this path has no steep steps.","与第一条路线不同，这条路没有陡台阶。","Her new painting is unlike anything she made before.","她的新画与之前的任何作品都不同。"],
  ["gently","副词 · 轻柔地","gently 修饰动作，强调力量或方式温和；stir gently 是轻轻搅动，不保证速度特别慢，也不是声音绝对无声。","Stir the mixture gently with a wooden spoon.","用木勺轻轻搅拌混合物。","He gently placed the bird back in its nest.","他轻轻把鸟放回巢里。"],
  ["regularly","副词 · 定期或经常地","regularly 表示按规律重复，也可指常常发生；check regularly 说反复检查，不强制意味着每天同一时刻。","The volunteers regularly check the riverbank for litter.","志愿者定期检查河岸是否有垃圾。","She practises regularly even during the holidays.","即使放假，她也经常练习。"],
  ["seventy","数词 · 七十","seventy 表示七十，后接可数名词复数；与 seventeen 十七不同，注意数量本身不会因有多个对象而加 s。","The hall has seats for seventy people.","大厅有七十人的座位。","We planted seventy young trees beside the path.","我们在路旁种了七十棵小树。"],
  ["keen","形容词 · 热切的或热衷的","keen 的热切义常用 keen to do 表迫切想做；a keen swimmer 则说热衷游泳的人，不直接说明比赛成绩。","She is keen to join the field trip.","她很想参加实地考察。","He is a keen gardener who shares seeds with neighbours.","他热衷园艺，常与邻居分享种子。"],
  ["frank","形容词 · 坦率的","frank 描述诚恳直接地表达，不刻意回避事实；a frank discussion 是坦率讨论，不自动表示语气粗鲁。","We had a frank discussion about the project's limits.","我们坦率讨论了项目的局限。","To be frank, the first plan needs more work.","坦白说，第一个方案还需要完善。"],
  ["gradually","副词 · 逐渐地","gradually 说变化一步步发生，强调过程而非突然转折；gradually improve 不必表示每次进步大小完全一样。","The noise gradually faded as the train moved away.","火车驶离时噪声逐渐减弱。","She gradually became more confident in class.","她在课堂上逐渐变得更自信。"],
  ["disorder","名词 · 混乱或失序","disorder 的失序义通常不可数；in disorder 表物品或状态混乱，不能把医学障碍的另一义项强套到房间整理上。","The office was left in disorder after the move.","搬迁后办公室一片混乱。","The sudden change caused disorder in the queue.","突然的变动让队伍出现混乱。"],
  ["twin","名词 · 双胞胎中的一个","twin 单数指同胎所生的两个孩子中的一个，twins 指两人；a twin brother 表双胞胎兄弟，不说明谁年长。","Each twin chose a different colour for the bedroom.","双胞胎各自为卧室选了不同颜色。","Her twin brother plays the violin.","她的双胞胎兄弟拉小提琴。"],
  ["nervous","形容词 · 紧张的","nervous 的情绪义说担忧、易紧张或不安；nervous about 后接所担忧的事，不等同于神经系统疾病。","I was nervous about speaking to such a large audience.","面对这么多观众讲话让我紧张。","She gave a nervous laugh before opening the letter.","开信前她紧张地笑了一下。"],
  ["tomato","名词 · 番茄","tomato 指番茄果实时可数，复数 tomatoes 加 es；tomato soup 里的 tomato 修饰汤的种类，不表示只有一个番茄。","Slice a ripe tomato onto the bread.","把一个熟番茄切片放到面包上。","The café serves fresh tomato soup on Fridays.","咖啡馆周五供应新鲜番茄汤。"],
  ["toy","名词 · 玩具","toy 是供玩耍的物品，是可数名词；作前置修饰语时 toy car 表玩具车，不是真实载人的小汽车。","The wooden toy has moving wheels.","这个木玩具装有可转动车轮。","She repaired a broken toy for her little cousin.","她给小表弟修好了一个玩具。"],
  ["flag","名词 · 旗帜","flag 的旗帜义是用作标志、信号或装饰的旗；raise a flag 表把旗升起，不表示改变其颜色图案。","A blue flag marked the start of the trail.","一面蓝旗标出了小路起点。","The school flag moved gently in the wind.","校旗在风中轻轻飘动。"],
  ["electric","形容词 · 电动或与电有关的","electric 可修饰以电运行的装置或电本身的现象；an electric heater 是电暖器，不是电力这个名词。","The boat has a small electric motor.","船上装有一台小电动机。","We used an electric pump to fill the pool.","我们用电泵给水池注水。"],
  ["grandmother","名词 · 祖母或外祖母","grandmother 不区分父系和母系，可以译奶奶或外婆；需要区分时补充家族关系，不应默认只指父亲的母亲。","My grandmother is teaching me her family's recipes.","我的祖母正在教我她家的食谱。","Her mother's mother is the grandmother in this photograph.","照片里的外祖母是她母亲的母亲。"],
  ["consent","动词 · 同意","consent 作动词通常是不及物，consent to 后接名词或动词 ing；这里 to 是介词，不是所有结构都可直接省略。","They must consent to the recording before the interview.","采访前，他们必须同意录音。","She did not consent to having her photograph published.","她没有同意公开自己的照片。"],
  ["greatly","副词 · 大大地或非常","greatly 强调程度很高，常修饰影响、改变或感激；greatly improved 是大有改善，不直接替代 great 修饰名词。","The extra windows greatly improved the light.","新增窗户大大改善了采光。","We greatly appreciate your help with the exhibition.","我们非常感谢你为展览提供帮助。"],
  ["exciting","形容词 · 令人兴奋的","exciting 描述引发兴奋的活动或事物；an exciting trip 是令人兴奋的旅行，与人自己感到兴奋的 excited 区分。","The final chapter is the most exciting part of the book.","最后一章是全书最令人兴奋的部分。","It was an exciting opportunity to work with the orchestra.","能和管弦乐队合作是个令人兴奋的机会。"],
  ["consumption","名词 · 消耗或消费","consumption 可指能源、资源等的使用或食物摄入；the consumption of 后接被消耗对象，不指购买者本人。","The new lights reduce electricity consumption.","新灯具降低了耗电量。","The report compares water consumption in different buildings.","报告比较了不同建筑的用水量。"],
  ["highway","名词 · 公路或交通干道","highway 常指主要公共道路；并非所有 highway 都是限制出入的高速公路，不能只按中文高速来推断道路条件。","The village lies close to the main highway.","村庄靠近主要公路。","A fallen tree blocked the highway after the storm.","风暴过后，一棵倒树堵住了公路。"],
  ["poet","名词 · 诗人","poet 指写诗的人，是可数名词；a poet 不要求靠写诗谋生，也不同于指具体诗作的 poem。","The poet read three new works at the festival.","诗人在节庆上朗读了三首新作。","Our class wrote questions for a visiting poet.","我们班为来访诗人准备了问题。"],
  ["concerning","介词 · 关于","concerning 作介词表示关于、涉及，后接名词或名词短语；此义不表示令人担忧，不必再加 about。","We received a letter concerning the building repairs.","我们收到一封关于建筑维修的信。","Please send any questions concerning transport to the organiser.","请把涉及交通的问题发给组织者。"],
  ["stranger","名词 · 陌生人","stranger 指不认识或不熟悉的人，参照对象取决于语境；一个人对你陌生，不等于对所有人都不认识。","A stranger helped us find the right platform.","一位陌生人帮我们找到了正确站台。","He was a stranger to everyone at the small gathering.","那场小聚会里没有人认识他。"],
  ["strategic","形容词 · 战略性的","strategic 与为达到整体目标而作的规划相关；a strategic decision 关注较大范围的目标，不只是当下一个小动作。","The centre made a strategic decision to expand its online courses.","中心作出扩大在线课程的战略决策。","The bridge occupies a strategic position on the route.","桥位于这条路线的关键位置。"],
  ["shopping","名词 · 购物活动","shopping 指寻找、选购商品的活动，通常不可数；go shopping 表去购物，不直接等同于自己开的商店。","We did our shopping before the market became crowded.","市场拥挤前我们买好了东西。","She made a list to keep the shopping quick and simple.","她列了清单，让购物更快更省事。"],
  ["salad","名词 · 沙拉","salad 可指由蔬菜、果物或其他食材拌成的菜肴，不只限生菜；a fruit salad 是水果沙拉，some salad 可说一些沙拉。","We made a salad with beans and fresh herbs.","我们用豆子和新鲜香草做了沙拉。","Would you like some salad with your sandwich?","你想给三明治配些沙拉吗？"],
  ["gentle","形容词 · 温和或轻柔的","gentle 可描述态度不严厉、动作不粗暴，也可说触碰很轻；a gentle person 不自动表示此人缺乏力量。","The teacher gave him a gentle reminder.","老师温和地提醒了他。","A gentle touch was enough to open the door.","轻轻一碰就打开了门。"],
  ["silly","形容词 · 傻气或可笑的","silly 可说缺乏判断的错误，也可说轻松逗趣的行为；a silly game 可能只是好玩幼稚，不必含严厉指责。","The children invented a silly game with paper hats.","孩子们戴着纸帽发明了一个逗趣游戏。","I made a silly mistake when I copied the address.","抄地址时我犯了个粗心的错误。"],
  ["pride","名词 · 自豪感","pride 可指对自身或他人成就的满足与自尊，也可能含自负；take pride in 表为某事自豪，不直接等于夸耀。","She takes pride in keeping the garden healthy.","她为把花园打理得健康繁茂而自豪。","He looked at the finished model with pride.","他自豪地看着完成的模型。"],
  ["singer","名词 · 歌手或唱歌的人","singer 的常见音乐义指唱歌的人，可是职业歌手或非职业演唱者；不能因为上台表演就把舞者也称作 singer。","The singer asked the audience to join the chorus.","歌手请观众一起唱副歌。","A young singer performed at the library opening.","一位年轻歌手在图书馆开幕时演唱。"],
  ["readily","副词 · 欣然或容易地","readily 可指不犹豫地愿意做，也可指很容易做到；readily available 说容易得到，不是物品已经准备好的形容词。","She readily agreed to help with the costumes.","她欣然答应帮忙准备服装。","The instructions are readily available on the website.","说明很容易在网站上找到。"],
  ["weakness","名词 · 弱点或虚弱","weakness 可指缺少力量的状态或具体不足；a weakness in the design 表设计弱点，不一定是材料真的没有重量。","The test revealed a weakness in the design.","测试暴露了设计中的一个弱点。","She felt some weakness in her legs after the climb.","攀登后，她觉得双腿有些无力。"],
  ["regardless","副词 · 不管怎样","regardless 可独立表示不顾前述情况仍然行动，常放句末；若直接接某种条件需用 regardless of，不能无条件省略 of。","The forecast was uncertain, but the team continued regardless.","天气预报不确定，但团队仍继续行动。","Everyone may take part, regardless of experience.","无论经验如何，每个人都可以参加。"],
  ["occasional","形容词 · 偶尔发生的","occasional 修饰名词，指不常发生或间隔不规则；occasional visits 说偶尔来访，不表示完全一次也不来。","We still receive occasional letters from the travellers.","我们仍偶尔收到旅行者的信。","The path is quiet apart from the occasional cyclist.","除了偶尔经过的骑车人，这条路很安静。"],
  ["desperate","形容词 · 绝望或极度急切的","desperate 可说失去希望，也可说因急需而十分迫切；desperate for 后接急需对象，具体情绪由语境判断。","The stranded hikers were desperate for clean water.","被困的徒步者急需干净水。","She felt desperate when the last train was cancelled.","末班火车取消时，她感到绝望。"],
  ["horror","名词 · 惊恐或强烈厌恶","horror 的情绪义表示极强恐惧、震惊或反感，通常整体表达；in horror 描述反应，不只是普通轻微担心。","They watched in horror as the bridge began to collapse.","桥开始坍塌时，他们惊恐地看着。","The letter filled her with horror.","信的内容让她充满惊恐。"],
  ["surprisingly","副词 · 出乎意料地","surprisingly 可评价整件事令人意外，也可加强某个出乎预期的程度；surprisingly easy 不等于每个人都一定觉得容易。","The final puzzle was surprisingly easy.","最后一道谜题出乎意料地简单。","Surprisingly, the old radio worked after years in storage.","出乎意料，存放多年的旧收音机还能用。"],
  ["soup","名词 · 汤","soup 作食物整体时通常不可数；a bowl of soup 表一碗，蔬菜汤、鱼汤等类别由前面的名词补充。","The soup smells of fresh herbs.","汤里有新鲜香草的香味。","He brought a bowl of soup to the visitor.","他给访客端来一碗汤。"],
  ["injure","动词 · 使受伤","injure 的身体义通常直接接受伤的人或部位；injure your ankle 是弄伤脚踝，不能用它作受伤状态的形容词。","A fall on the steps could injure someone.","在台阶上摔倒可能会使人受伤。","Be careful not to injure your hand on the broken edge.","小心不要让破边缘划伤手。"],
  ["reservation","名词 · 预订","reservation 的服务义指事先保留房间、座位等安排；make a reservation 是预订，不等同于已经入住或用餐。","I made a reservation for two at the café.","我在咖啡馆预订了两人的位子。","The hotel could not find our reservation.","酒店没找到我们的预订记录。"],
  ["upstairs","副词 · 在楼上或到楼上","upstairs 本身可作地点或方向副词；go upstairs 表上楼，不需要再加 to，不能只理解为那段楼梯。","The spare blankets are upstairs.","备用毯子在楼上。","She went upstairs to find her notebook.","她上楼找笔记本。"],
  ["strict","形容词 · 严格的","strict 可描述规则要求严，也可说人执行纪律严格；strict with 接对待的人，不能因此断定这个人不友善。","The laboratory has strict rules about food.","实验室对食物有严格规定。","Our coach is strict with us about arriving on time.","教练严格要求我们准时到。"],
  ["frequent","形容词 · 频繁的","frequent 作形容词描述次数多、间隔短，放名词前或作表语；修饰动作通常用 frequently，不直接套形容词。","The old bus makes frequent stops along the coast.","老公交车沿海岸频繁停靠。","Frequent visitors know where the quiet reading room is.","常来的访客知道安静阅览室在哪里。"],
  ["undoubtedly","副词 · 无疑地","undoubtedly 强调说话者认为某事确定，常修饰整句或评价；它表达判断的确信程度，本身不是支持判断的证据。","The new roof will undoubtedly improve the building.","新屋顶无疑会改善这栋建筑。","She is undoubtedly the most experienced member of the team.","她无疑是团队中最有经验的成员。"],
  ["resignation","名词 · 辞职或辞呈","resignation 的职务义指放弃职位的行为或正式通知；submit a resignation 是提交辞呈，不一定表示当日立即离岗。","The board accepted his resignation on Monday.","董事会周一接受了他的辞职。","She handed in her resignation after the project ended.","项目结束后，她递交了辞呈。"],
  ["generous","形容词 · 慷慨的","generous 可描述愿意给予的人，也可形容分量、数量充足；a generous portion 是大份食物，不是在说食物有人格。","Our neighbour was generous with her time and advice.","邻居很愿意花时间给我们建议。","The café serves a generous portion of salad.","咖啡馆供应的沙拉分量很足。"],
  ["harm","名词 · 伤害或损害","harm 的损害义通常不可数，可用于身体、心理或其他损伤；do harm to 后接受影响对象，不把 harm 直接当受伤的人。","The change caused no harm to the old trees.","这次改动没有伤害老树。","We moved the paintings out of harm's way.","我们把画移到了不易受损的地方。"],
  ["wherever","连词 · 无论在哪里","wherever 可引出表示任意地点的从句；wherever you go 是无论你去哪儿，不是询问一个已确定目的地。","Take a bottle of water wherever you go.","无论去哪里，都带一瓶水。","We can hold the workshop wherever there is enough space.","只要空间足够，我们在哪里都能办工作坊。"],
  ["powder","名词 · 粉末","powder 指细小颗粒构成的粉末，作为材料常不可数；a spoonful of powder 说一勺，不把每粒粉末都叫 a powder。","Mix the powder with a little cold water.","把粉末与少量冷水混合。","The dried leaves were crushed into a fine powder.","干叶被碾成了细粉。"],
  ["hesitate","动词 · 犹豫","hesitate 常用 hesitate to do 说犹豫着不去做，也可单独表示迟疑；do not hesitate to ask 用来鼓励放心提问。","Do not hesitate to ask for a larger printout.","需要更大字号的打印件时请尽管提出。","He began to hesitate when he saw the narrow bridge.","看到窄桥时，他开始犹豫。"],
  ["headline","名词 · 新闻标题","headline 通常指报纸、文章顶部概括内容的大标题；read a headline 不等于已经读完正文，需要区分标题与完整报道。","The headline caught my attention on the train.","火车上，那条标题吸引了我的注意。","The editor changed the headline before publication.","编辑在出版前修改了标题。"],
  ["rope","名词 · 绳索","rope 指由纤维或金属丝等搓编成的粗绳；a length of rope 可说一段绳子，a rope 也可指一根完整绳索。","Tie the boat to the post with a strong rope.","用结实的绳索把船系在柱子上。","We need another length of rope to secure the tent.","我们还需要一段绳子固定帐篷。"],
  ["courage","名词 · 勇气","courage 指面对危险或困难仍行动的精神力量，通常不可数；have the courage to do 表有勇气做，不要求完全不害怕。","She found the courage to speak in front of the class.","她鼓起勇气在全班面前发言。","The story shows quiet courage during difficult times.","故事展现了困难时期沉静的勇气。"],
  ["navy","名词 · 海军","navy 的军事义可指一个国家的海上军力及相关人员设施；join the navy 是加入海军，不是只登上一艘普通船。","He joined the navy after finishing school.","毕业后他加入了海军。","The museum explains the history of the country's navy.","博物馆讲述了该国海军的历史。"],
  ["spell","动词 · 拼写","spell 的拼写义可指按顺序说出或写出字母；spell your name 是拼出名字，而不是说明名字含义，过去式 spelled 或 spelt。","Could you spell your surname for the receptionist?","你能向接待员拼一下姓氏吗？","The child can spell the names of all the planets.","孩子能拼出所有行星的名称。"],
  ["delight","名词 · 喜悦或乐事","delight 可指强烈喜悦，也可指令人喜悦的事物；to someone's delight 表令某人高兴的是，a delight 则是一件乐事。","To our delight, the little tree began to flower.","令我们高兴的是，小树开始开花了。","The evening concert was a delight from beginning to end.","晚间音乐会从头到尾都令人愉悦。"],
  ["receiver","名词 · 接收器或电话听筒","receiver 的设备义指接收信号并转成声音、图像的装置；telephone receiver 可说电话听筒，不等同于整台通信系统。","The receiver lost the signal near the hills.","接收器在山附近失去了信号。","She lifted the telephone receiver and waited for a voice.","她拿起电话听筒，等待对方说话。"],
  ["magic","名词 · 魔法","magic 作魔法义通常不可数，指故事或信仰中借超自然力量产生效果的做法；不能把一种法术机械数作 a magic。","In the story, music awakens the magic of the forest.","故事里，音乐唤醒了森林的魔法。","The children imagined a world filled with magic.","孩子们想象了一个充满魔法的世界。"],
  ["hardware","名词 · 硬件","hardware 的计算机义指设备的实体部件，通常不可数；computer hardware 与程序等软件区分，不把每个零件叫一个 hardware。","The course explains basic computer hardware.","课程讲解基础计算机硬件。","The fault was in the hardware rather than the settings.","故障出在硬件，而不是设置。"],
  ["midnight","名词 · 午夜","midnight 通常指夜里十二点；at midnight 说在午夜，by midnight 表最迟到午夜，时间关系不同。","The last bus leaves at midnight.","末班公交午夜发车。","We had finished packing by midnight.","到午夜时，我们已收拾好行李。"],
  ["convenient","形容词 · 方便的","convenient 描述时间、地点、安排对人合适，常用 convenient for someone；不能直接用 I am convenient 表我有空。","Is Tuesday morning convenient for you?","周二早上对你方便吗？","The station is in a convenient location for visitors.","车站的位置对访客很方便。"],
  ["disadvantage","名词 · 不利条件或劣势","disadvantage 可指具体缺点，也可指所处劣势；at a disadvantage 表处于不利地位，不等同于已经失败。","The lack of a map put us at a disadvantage.","没有地图让我们处于不利境地。","The main disadvantage of the room is its noise.","这个房间的主要缺点是吵。"],
  ["mechanical","形容词 · 机械方面的","mechanical 与机器、工具及其运作有关；a mechanical fault 是机械故障，不一定涉及软件，也不自动表示机器靠电运行。","A mechanical fault stopped the lift.","机械故障让电梯停了。","The museum demonstrates a mechanical clock with wooden gears.","博物馆演示了一座用木齿轮运转的机械钟。"],
  ["loyalty","名词 · 忠诚","loyalty 指对人、团体或承诺的忠诚，loyalty to 后接忠诚对象；可指长期关系，不是一次购买行为本身。","The fans showed loyalty to the club during a difficult season.","艰难赛季里，球迷表现出对俱乐部的忠诚。","She valued honesty and loyalty in her friends.","她看重朋友的诚实和忠诚。"],
  ["flood","名词 · 洪水","flood 的灾害义指水上涨溢出到通常干燥的地方；a flood 是一次洪水，in flood 可说河水泛滥的状态。","The flood covered the fields beside the river.","洪水淹没了河边田地。","The bridge was damaged during a severe flood.","桥在一次严重洪灾中受损。"],
  ["unnecessary","形容词 · 不必要的","unnecessary 表示没有必要，并不保证东西有害；unnecessary work 是可以避免的额外劳动，不同于没完成的工作。","The new form creates unnecessary paperwork.","新表格增加了不必要的文书工作。","There is no need to take unnecessary risks.","没有必要冒不必要的风险。"],
  ["sadly","副词 · 伤心地或令人遗憾地","sadly 可说明动作表现出悲伤，也可评价整个情况令人遗憾；句首 Sadly 常是可惜，并非说句中每个人正在哭。","She smiled sadly at the empty classroom.","她望着空教室，伤感地笑了。","Sadly, the old cinema will not reopen.","可惜，老电影院不会重新开放了。"],
  ["cupboard","名词 · 橱柜","cupboard 指带搁板、存放餐具食物等的柜子；in the cupboard 表柜内，不能把它只当作一块杯子用的板。","The clean cups are in the upper cupboard.","干净杯子在上方橱柜里。","We moved the flour to a dry cupboard.","我们把面粉移到干燥橱柜里。"],
  ["drunk","形容词 · 喝醉的","drunk 可作形容词说酒精影响下的醉酒状态；be drunk 表喝醉，不同于 drink 的一般饮用动作，也不专指已经喝完。","The character was too drunk to remember the address.","角色醉得记不起地址了。","She realised that the noisy passenger was drunk.","她意识到吵闹的乘客喝醉了。"],
  ["classification","名词 · 分类","classification 指依照标准分组的过程或体系；the classification of 后接被分的对象，不等于仅给对象排出先后次序。","The lesson introduces the classification of common rocks.","这节课介绍常见岩石的分类。","We need a clear classification system for the photographs.","我们需要一套清晰的照片分类系统。"],
  ["seventeen","数词 · 十七","seventeen 表示十七，与 seventy 七十不同；seventeen people 后接复数名词，seventeen years old 表十七岁。","Seventeen students signed up for the field trip.","十七名学生报名实地考察。","The young performer is seventeen years old.","这位年轻表演者十七岁。"],
  ["scare","动词 · 吓到","scare 可直接接被吓的人或动物，常强调突然引发恐惧；scare someone 说造成感受，不表示说话者自己害怕。","The sudden flash could scare the birds.","突然的闪光可能吓到鸟。","I did not mean to scare you by opening the door.","我开门并不是想吓到你。"],
  ["inn","名词 · 客栈或小旅店","inn 可指为旅行者提供住宿和招待的客栈，也有酒馆等义；stay at an inn 说住客栈，不是介词 in 的重写。","We stayed at a small inn near the harbour.","我们住在港口附近的小客栈。","The inn serves breakfast in a room overlooking the sea.","客栈在一间面海的房间供应早餐。"],
  ["pursuit","名词 · 追求或追逐","pursuit 可指追赶或为某目标持续努力；in pursuit of 后接所追求的人物、目标，不把 of 漏掉当成动词结构。","The team travelled far in pursuit of new evidence.","团队为寻找新证据走了很远。","The film follows a long pursuit through the city.","影片展现了一场穿越城市的漫长追逐。"],
  ["tray","名词 · 托盘","tray 通常是底部平、边缘低的盛放或端送物品的容器；a tray of cups 说装着杯子的托盘，不表示杯子本身有把手。","She balanced the tray with both hands.","她双手端稳托盘。","The seedlings stood in a shallow tray by the window.","幼苗放在窗边浅托盘里。"],
  ["excessive","形容词 · 过多或过度的","excessive 强调超过合理、可接受的限度，带负面评价；excessive noise 不只是声音存在，而是噪声过大或过多。","The rules aim to prevent excessive noise at night.","规则旨在防止夜间过度噪声。","The package contained an excessive amount of plastic.","包裹用了过量塑料。"],
  ["translation","名词 · 翻译或译文","translation 可指转换语言的过程，也可指完成的译文；a translation of 后接原作品，into 后接目标语言。","Her translation of the story preserves its gentle humour.","她翻译的故事保留了原作温和的幽默。","The archive includes a translation into Spanish.","档案中收有一份西班牙语译文。"],
  ["lately","副词 · 最近","lately 说近期一直或反复存在的情况，常与完成时搭配；不表示迟到，也不等同于从现在往后的 later。","I have been reading more history lately.","最近我读了更多历史书。","Have you seen any butterflies in the garden lately?","最近你在花园看到过蝴蝶吗？"],
  ["freely","副词 · 自由或不受阻地","freely 可说没有限制地行动、流动或表达，不自动表示免费；speak freely 表坦率自由地说，而非不收说话费用。","The gate should swing freely after the repair.","维修后门应该能顺畅摆动。","Everyone was invited to speak freely about the plan.","大家都受邀畅所欲言地讨论计划。"],
  ["upwards","副词 · 向上","upwards 表方向从低到高，与 upward 的副词义相同；look upwards 是向上看，不说明物体已经到顶部。","The smoke curled upwards above the fire.","烟在火上方盘旋上升。","She pointed upwards to a nest in the tree.","她向上指了指树中的鸟巢。"],
  ["nowadays","副词 · 如今","nowadays 泛指当今这一时期，常隐含与过去比较；不专指今天某一刻，通常不加 in 等介词。","Nowadays, visitors can book the tour online.","如今，游客可以在线预订导览。","Few people use that narrow bridge nowadays.","如今很少有人走那座窄桥。"],
  ["optimistic","形容词 · 乐观的","optimistic 表示对未来怀有希望；optimistic about 后接看好的事情，不等于已掌握必然成功的证据。","The team remains optimistic about the next stage.","团队对下一阶段仍然乐观。","Her optimistic outlook helped everyone stay motivated.","她乐观的态度帮助大家保持动力。"],
  ["afterward","副词 · 之后","afterward 表示某件事之后，与 afterwards 同义；单独作时间副词，不能直接加名词取代介词 after。","We explored the castle and visited the café afterward.","我们游览了城堡，之后去了咖啡馆。","The discussion continued for an hour afterward.","讨论此后又持续了一小时。"],
  ["indirect","形容词 · 间接的或迂回的","indirect 可说路线绕行，也可说表达不直截了当；an indirect route 不保证最短，不能把它当直达路线。","We took an indirect route to avoid the flooded road.","我们绕路避开了被淹道路。","Her indirect question made him unsure what she wanted.","她拐弯抹角的问题让他不确定她想要什么。"],
  ["worthwhile","形容词 · 值得花时间精力的","worthwhile 评价活动或事情值得投入时间、努力；a worthwhile visit 说不虚此行，不等于一定昂贵或能赚钱。","The extra practice was difficult but worthwhile.","额外练习很难，但很值得。","It was a worthwhile visit for anyone interested in pottery.","对喜欢陶器的人来说，这次参观很值得。"],
  ["sympathetic","形容词 · 同情或体谅的","sympathetic 可说理解别人的困难并给予关怀；a sympathetic listener 是体谅的倾听者，不等于双方经历完全相同。","The adviser was sympathetic to the students' concerns.","顾问很体谅学生的顾虑。","She found a sympathetic listener in her new teacher.","她在新老师身上找到了一位体谅她的倾听者。"],
  ["fortnight","名词 · 两周","fortnight 指十四天、两周，常用于英式表达；for a fortnight 说持续两周，不要因为含 night 就只数夜间时段。","The exhibition will stay open for another fortnight.","展览将再开放两周。","We expect the repairs to finish in a fortnight.","我们预计维修两周后完成。"],
  ["midst","名词 · 中间或当中","midst 常用于 in the midst of，表示在某区域中央或某过程进行中；其后 of 连接范围，不能把整组结构随意拆开。","A stone fountain stands in the midst of the garden.","花园中央立着一座石喷泉。","We arrived in the midst of a lively debate.","我们到达时，一场热烈辩论正在进行。"],
  ["heal","动词 · 愈合或治愈","heal 可说伤口自身愈合，也可说使伤口恢复；强调损伤修复，不等同于所有情况下立即完全消除疾病。","The small cut took several days to heal.","小伤口花了几天愈合。","Time alone cannot always heal a damaged friendship.","仅靠时间并不总能修复受损友谊。"],
  ["notebook","名词 · 笔记本","notebook 的文具义指记笔记的本子；也可指轻便电脑，但 write in a notebook 通常是在本子里书写。","She keeps a notebook of ideas for future lessons.","她用一本笔记本记录以后上课的想法。","I drew the route in my notebook.","我在笔记本里画了路线。"],
  ["weaken","动词 · 减弱","weaken 可以是使力量、效力减小，也可说事物自行变弱；a storm may weaken 的主语是风暴，不需补被动。","The cracks may weaken the wooden frame.","裂缝可能削弱木框的强度。","The wind should weaken during the night.","夜里风势应该会减弱。"],
  ["tyre","名词 · 轮胎（英式拼写）","tyre 是 tire 在轮胎义的常见英式拼写；a flat tyre 表瘪胎，指包住轮圈的轮胎，不等于整个车轮。","The rear tyre needs more air.","后轮胎需要充气。","We stopped to change a flat tyre.","我们停车更换瘪掉的轮胎。"],
  ["widen","动词 · 拓宽或变宽","widen 可指增加实际宽度，也可说扩大范围；widen the road 是拓宽道路，不单指把道路延伸得更长。","The council plans to widen the footpath.","议会计划拓宽人行道。","Her eyes began to widen when she saw the display.","看到展示时，她的眼睛开始睁大。"],
  ["dying","形容词 · 垂死或逐渐消失的","dying 可以形容接近死亡的生命，也可比喻火光、习俗逐渐消失；不是表示颜色染色的 dyeing。","The gardener removed the dying plant from the pot.","园丁从盆里移走了快枯死的植物。","They warmed their hands beside the dying fire.","他们在将熄的火边暖手。"],
  ["librarian","名词 · 图书馆工作人员","librarian 指负责图书馆馆藏照管、管理等工作的专业人员；不只是任何在图书馆读书的人，也不等于书店店主。","The librarian helped me find books about astronomy.","图书馆员帮我找到天文学书籍。","Ask the librarian how to use the archive catalogue.","问问图书馆员如何使用档案目录。"],
  ["fortunate","形容词 · 幸运的","fortunate 可说人遇到意外好事，也可形容带来好运的情况；fortunate to do 常表有幸做成，不是富有的直接同义词。","We were fortunate to find a guide who knew the valley.","我们有幸找到了一位熟悉山谷的向导。","It was a fortunate discovery for the whole project.","这个发现为整个项目带来了好运。"],
  ["prescribe","动词 · 开药方或规定","prescribe 可指医生指定药物、治疗，也可指正式规定做法；在医疗义中直接接所开的药物或治疗，不是描述症状。","Only the clinician can decide whether to prescribe a medicine.","是否开药由临床医师判断。","The handbook does not prescribe a single teaching method.","手册没有规定只能采用一种教学法。"],
  ["undergraduate","名词 · 本科生","undergraduate 指尚未获得首个大学学位、尤其学士学位的大学生；不是所有在校学生的总称，也不同于研究生。","An undergraduate helped catalogue the museum's photographs.","一名本科生帮助整理了博物馆照片目录。","The course welcomes any undergraduate interested in local history.","课程欢迎任何对当地历史感兴趣的本科生。"],
  ["noble","形容词 · 高尚的","noble 的品格义描述道德、尊严等品质值得敬重；a noble act 是高尚行为，不一定涉及贵族身份。","It was a noble act to share the last supplies.","分享最后的物资是高尚之举。","The novel presents her as a noble but imperfect character.","小说把她写成一位高尚却不完美的人物。"],
  ["fog","名词 · 雾","fog 的天气义指悬在近地面空气中的细小水滴形成的雾；通常不可数，thick fog 是浓雾，不是几朵高空云。","Thick fog hid the far end of the bridge.","浓雾遮住了桥的远端。","The fog began to clear after sunrise.","日出后，雾开始散去。"],
  ["spit","动词 · 吐出","spit 的口部动作义指把东西从嘴里吐出来；spit out 可强调吐出内容，过去式 spit 或 spat，ing 双写 t。","The child had to spit out a bitter seed.","孩子不得不把苦籽吐出来。","Please do not spit on the pavement.","请不要往人行道上吐痰。"],
  ["fond","形容词 · 喜爱的","fond 的喜爱义通常用 be fond of，of 后接人、物或动词 ing；不能把它直接当及物动词接喜欢的对象。","She is fond of old travel journals.","她喜欢旧旅行日记。","He grew fond of walking along the river.","他渐渐喜欢沿河散步。"],
  ["competent","形容词 · 能胜任的","competent 表示具备完成工作所需的充分能力；a competent guide 是能胜任的向导，不保证是最卓越的一位。","We need a competent technician to check the equipment.","我们需要一位能胜任的技术员检查设备。","She became a competent swimmer after months of practice.","练习数月后，她成为了技术熟练的游泳者。"],
  ["unconscious","形容词 · 失去意识的","unconscious 可形容失去意识的状态；并不是所有闭眼休息都叫 unconscious，也有未察觉等其他义项需另看上下文。","In the film, the injured pilot remains unconscious.","影片中，受伤飞行员仍处于昏迷状态。","The character was found unconscious near the staircase.","角色被发现昏倒在楼梯附近。"],
  ["weep","动词 · 流泪或哭泣","weep 常比一般 cry 更带文学或较正式色彩，可不及物表示流泪；过去式、过去分词是 wept，不按规则加 ed。","The final scene made the audience weep.","最后一幕让观众落泪。","She began to weep quietly after reading the letter.","读完信后，她开始低声哭泣。"],
  ["soda","名词 · 汽水","soda 的饮品义可指汽水，尤其美式表达常用；a can of soda 是一罐汽水，不要把所有词义都套为化学品苏打。","He ordered a lemon soda with his sandwich.","他给三明治配了一份柠檬汽水。","There is a cold can of soda in the cooler.","冷藏箱里有一罐冰汽水。"],
  ["ink","名词 · 墨水","ink 的书写义指书写、印刷用的有色材料，通常不可数；a bottle of ink 表一瓶墨水，不把液体本身数成一个 ink。","The blue ink had stained the edge of the page.","蓝墨水染到了纸边。","She filled the pen with black ink.","她给钢笔灌了黑墨水。"],
  ["choke","动词 · 呛住或阻碍呼吸","choke 可指喉部被堵而呛住，也可说烟等使人呼吸受阻；choke on 后接呛到的东西，不等同于普通咳嗽。","Small loose parts can cause a child to choke.","松散的小零件可能使孩子呛住。","The thick smoke made the character cough and choke.","浓烟让角色咳嗽、喘不过气。"],
  ["noisy","形容词 · 吵闹的","noisy 描述发出很多或较大噪声的人、地方或装置；noisy neighbours 是吵闹邻居，不能用名词 noise 直接替代此形容词。","The noisy fan made it hard to hear the recording.","吵闹的风扇让录音很难听清。","We moved away from the noisy entrance.","我们离开了吵闹入口。"],
  ["repetition","名词 · 重复","repetition 可指反复发生的过程，也可指重复的一次动作；through repetition 说通过反复练习，不一定是毫无目的地机械重复。","The melody becomes familiar through repetition.","反复听让旋律变得熟悉。","One careful repetition was enough to clarify the movement.","仔细重复一次就足以讲清动作。"],
  ["excite","动词 · 使兴奋或激起","excite 可直接接产生兴奋的人，也可接兴趣等情绪；excite curiosity 是激起好奇，不表示说话者自己正处于兴奋状态。","The idea of a night walk can excite young explorers.","夜间徒步的想法能让小探险者兴奋。","The unusual shapes are meant to excite curiosity.","这些独特形状意在激起好奇。"],
  ["waiter","名词 · 餐厅服务员","waiter 的常见人员义指餐厅为客人点菜、上菜等服务的人；不是所有正在等待的人，也不一定是餐厅老板。","The waiter brought an extra plate for the cake.","服务员拿来一只额外盘子放蛋糕。","We asked the waiter whether the soup contained nuts.","我们问服务员汤里有没有坚果。"],
  ["peach","名词 · 桃子","peach 的水果义是桃子，是可数名词；a ripe peach 指一个熟桃，复数 peaches 加 es，不能只加 s。","She sliced a ripe peach into the bowl.","她把一个熟桃切进碗里。","The peach was soft and full of juice.","桃子柔软多汁。"],
  ["salesman","名词 · 销售人员","salesman 常指男性销售员，复数是 salesmen；卖商品或服务才是此职业义，不能仅因在商店出现就判断是销售员。","The salesman explained how the folding table worked.","销售员解释了折叠桌的用法。","A travelling salesman left a catalogue at the office.","一位旅行推销员在办公室留下了一份目录。"],
  ["applause","名词 · 掌声","applause 指公开表示赞赏的掌声等，通常不可数；a round of applause 表一阵掌声，不把每次拍手都数成 an applause。","The dancers bowed as applause filled the hall.","掌声响满大厅时，舞者们鞠躬。","The speaker received a warm round of applause.","演讲者获得一阵热烈掌声。"],
  ["interpreter","名词 · 口译员","interpreter 的语言工作义指为不同语言交流者传译的人，也包括手语口译；不必把所有书面译者都叫 interpreter。","An interpreter helped the visitors talk to the guide.","一位口译员帮助访客与导游交谈。","The school arranged a sign language interpreter for the event.","学校为活动安排了一位手语口译员。"],
  ["optional","形容词 · 可选择的","optional 表示由自己选择、并非强制，常修饰课程或活动；它不说明选择后是否收费，也不等于完全没有价值。","The final workshop is optional.","最后一场工作坊是自愿参加的。","The course includes an optional visit to the museum.","课程包含一项可自行选择的博物馆参观。"],
  ["playground","名词 · 游乐场或活动场地","playground 的常见义是供儿童玩耍、常设游乐设施的场地；school playground 依语境可译操场，不专指比赛用体育馆。","The playground has a new climbing frame.","游乐场装了新的攀爬架。","The children gathered in the school playground after lunch.","午饭后孩子们聚在学校操场。"],
  ["kite","名词 · 风筝","kite 的玩具义指系在线上、利用风飞起的轻框制品；fly a kite 是放风筝，不能因为在空中就把它当作鸟。","The red kite rose above the trees.","红风筝飞到了树梢上方。","She repaired the torn paper on her kite.","她修好了风筝上破损的纸。"],
  ["conductor","名词 · 乐队指挥","conductor 的音乐义指带领合奏的人；an orchestra conductor 是管弦乐指挥，和交通售票员、电导体的义项分开理解。","The conductor raised her hand to begin the rehearsal.","指挥举手开始排练。","Each musician watched the conductor closely.","每位乐手都密切注视指挥。"],
  ["gum","名词 · 牙龈","gum 的身体部位义指围绕牙根的软组织，日常常用复数 gums；不是口香糖的材料义，也不是牙齿本身。","The dentist checked the gum around the loose tooth.","牙医检查了松动牙齿周围的牙龈。","The model shows where the gum meets the tooth.","模型显示了牙龈与牙齿相接的位置。"],
  ["gallon","名词 · 加仑","gallon 是液体容量单位，数个加仑用 gallons；不同计量制度的具体容量需另行确认，不能直接当作一升。","The container holds one gallon of water.","容器能装一加仑水。","We bought a gallon of paint for the classroom.","我们为教室买了一加仑油漆。"],
  ["honourable","形容词 · 正直或值得尊敬的","honourable 是英式拼写，美式常用 honorable；品格义指正直、道德高，首字母 h 不发音，前面用 an。","She made an honourable decision to return the prize.","她作出了归还奖品的正直决定。","He built an honourable reputation over many years.","他多年积累了值得尊敬的名声。"],
  ["upward","副词 · 向上","upward 的副词义是向较高方向，与 upwards 可互用；也可作形容词修饰 trend，但句中词性要分别判断。","The path curves upward behind the chapel.","小路在小教堂后方弯着向上延伸。","He tilted the mirror upward to catch the light.","他把镜子向上倾斜以接住光线。"],
  ["fearful","形容词 · 害怕或担忧的","fearful 可描述心中恐惧，也可说令人害怕；fearful for someone's safety 表担忧某人安全，不一定害怕那个人。","The child gave a fearful glance towards the dark doorway.","孩子害怕地朝黑暗门口瞥了一眼。","They were fearful for the safety of the missing hikers.","他们担心失踪徒步者的安全。"],
  ["proportional","形容词 · 成比例的","proportional 表示大小、程度相应或比例保持一致；proportional to 后接参照量，不是只要两个数都变大就一定成立。","The payment is proportional to the hours worked.","报酬与工作时数成比例。","The two models have proportional dimensions.","两个模型的尺寸成比例。"],
  ["sorrow","名词 · 悲伤","sorrow 指深切悲伤、遗憾，常与失去珍爱的人或事物有关；with sorrow 表怀着悲伤，不只是暂时无聊。","She spoke with sorrow about the loss of the old forest.","她悲伤地谈到老森林的消失。","The poem expresses both sorrow and hope.","诗表达了悲伤，也表达了希望。"],
  ["fertilizer","名词 · 肥料","fertilizer 指用于提高土壤肥力的物质，不仅是化学制品；some fertilizer 说一些肥料，具体种类可按语境区分。","The gardener stored the fertilizer in a dry shed.","园丁把肥料放在干燥棚屋里。","This bag of fertilizer is for the vegetable beds.","这袋肥料是给菜畦用的。"],
  ["accustomed","形容词 · 习惯于的","accustomed to 表习惯某种环境或行为，to 是介词，后可接名词或动词 ing；不是每次都能直接用动词原形。","She is accustomed to working in a noisy office.","她习惯在吵闹办公室工作。","Our eyes slowly became accustomed to the darkness.","我们的眼睛慢慢适应了黑暗。"],
  ["porter","名词 · 行李搬运工","porter 在酒店、车站场景常指替旅客搬行李的工作人员；不等于司机，也不是每位背包旅行者的称呼。","A porter carried the heavy cases to our room.","一名行李员把沉重箱子搬到了我们房间。","We asked the station porter where to leave the luggage.","我们问车站搬运工行李该放在哪里。"],
  ["helpless","形容词 · 无助的","helpless 描述在某处境中无法有效行动或自助的状态；feel helpless 可说感到无能为力，不一定永远缺乏能力。","She felt helpless when the only phone stopped working.","唯一的电话失灵时，她觉得很无助。","The newly hatched birds were tiny and helpless.","刚孵出的鸟小小的，无法自助。"],
  ["insult","动词 · 侮辱","insult 作动词可直接接受侮辱的人，重音通常在后；重点是不尊重、冒犯，不等于任何友善的意见不同。","There is no need to insult someone who disagrees.","没有必要侮辱持不同意见的人。","He did not intend to insult the artist with his question.","他提问时无意冒犯艺术家。"],
  ["intimidate","动词 · 威吓或使畏缩","intimidate 指使人害怕、退缩，常涉及威胁或压力；直接接受影响的人，不表示对方已经主动同意。","The huge entrance hall seemed to intimidate the young visitor.","巨大的门厅似乎让年轻访客畏缩。","The group refused to let the threats intimidate them.","小组拒绝被这些威胁吓倒。"],
  ["learned","形容词 · 博学的","learned 说人博学或讨论学术性强时通常读两个音节；与 learn 的过去式、表示后天习得的单音节读法区分。","A learned scholar explained the old inscription.","一位博学学者解释了古老铭文。","The book includes a learned discussion of medieval maps.","书中有一段对中世纪地图的学术讨论。"],
  ["sulphur","名词 · 硫（常见英式拼写）","sulphur 是 sulfur 的常见英式拼写，表示同一种非金属化学元素；作材料通常不可数，不能由此推断任意含硫化合物都相同。","The diagram shows a sample of sulphur.","图示展示了一份硫样品。","The lesson explains how sulphur appears in different compounds.","这节课解释硫如何存在于不同化合物中。"],
  ["mourn","动词 · 哀悼","mourn 可直接接所哀悼的人或失去的事物，也可用 mourn for；表达悲伤不要求一定流泪或穿特定衣服。","The community gathered to mourn their former teacher.","社区居民聚集起来悼念从前的老师。","They mourn the loss of the historic theatre.","他们为历史剧院的消失而悲伤。"],
  ["unsuitable","形容词 · 不适合的","unsuitable 评价事物不适合某用途或对象，常用 unsuitable for；不代表在任何情境都没有价值。","These shoes are unsuitable for a muddy trail.","这些鞋不适合泥泞小路。","The room was unsuitable for recording quiet music.","这个房间不适合录制轻柔音乐。"],
  ["accidental","形容词 · 意外或非故意的","accidental 说事情偶然发生或并非有意，不保证结果一定严重；an accidental discovery 是偶然发现，不是预定成果。","The meeting was accidental rather than planned.","这次相遇是偶然的，并非事先安排。","An accidental discovery changed the direction of the research.","一项偶然发现改变了研究方向。"],
  ["selfish","形容词 · 自私的","selfish 指过度关注自身利益而不顾他人，带贬义；不能把任何合理照顾自己或拒绝请求都自动称为 selfish。","It was selfish to keep all the equipment for one team.","把所有设备都留给一队用很自私。","The character learns how his selfish choices affect others.","角色了解到自己的自私选择如何影响别人。"],
  ["workman","名词 · 工人或工匠","workman 常指从事体力、手艺工作的男性工人，复数 workmen；不能只按字面把所有办公室工作人员都这样称呼。","A skilled workman repaired the stone steps.","一名熟练工人修好了石台阶。","The workman checked the frame before fitting the door.","工人在装门前检查了门框。"],
  ["sob","动词 · 抽泣","sob 指哭时带断续吸气的抽泣，比泛指流泪更突出声音和呼吸；过去式 sobbed、ing 形式 sobbing 都双写 b。","The child began to sob when the toy broke.","玩具坏了，孩子开始抽泣。","She tried not to sob during the farewell.","告别时她努力不抽泣。"],
  ["youthful","形容词 · 年轻的或有青春活力的","youthful 可以说年龄年轻，也可形容年长者显得有活力；youthful energy 强调青春般精神，不直接证明实际年龄。","The youthful performers brought energy to the stage.","年轻表演者让舞台充满活力。","Her grandfather still has a youthful sense of adventure.","她祖父仍有青春般的冒险精神。"],
  ["needless","形容词 · 无必要的","needless 表示本可避免、没有必要，常带遗憾或批评；needless delay 是不必要的延误，不等于任何等待。","The missing label caused needless confusion.","缺失标签造成了不必要的混乱。","A clear checklist can prevent needless mistakes.","清晰清单可以防止不必要的错误。"],
  ["indifferent","形容词 · 漠不关心的","indifferent 的态度义指缺乏兴趣、关切或特别偏好；indifferent to 后接不关心的事，不是单纯与众不同。","He seemed indifferent to the result of the vote.","他似乎不关心投票结果。","The audience was indifferent rather than openly hostile.","观众反应冷淡，并非公开敌对。"],
  ["midday","名词 · 中午","midday 指一天中间、接近正午的时间；at midday 说在中午，around midday 则给出大致范围，不是午夜。","The volunteers will return at midday.","志愿者将在中午返回。","By midday, the shaded path was full of visitors.","到中午时，林荫小路已满是游客。"],
  ["slippery","形容词 · 滑的","slippery 描述表面容易让人打滑，或物体容易从手中滑脱；不要求一定有冰，也不直接表示行走速度。","The wet leaves made the steps slippery.","湿树叶让台阶很滑。","The fish was too slippery to hold with one hand.","鱼太滑，单手拿不住。"],
  ["orderly","形容词 · 整齐或有秩序的","orderly 是形容词，描述排列整齐或行为有序；an orderly queue 是有秩序的队伍，不因词尾 ly 就把它当副词。","The tools were arranged in orderly rows.","工具排成整齐的几行。","The visitors formed an orderly queue outside the gate.","游客在门外排成有序队伍。"],
  ["honeymoon","名词 · 蜜月旅行","honeymoon 可指新婚后的蜜月旅行，也可比喻新关系初期的和谐；on honeymoon 说在度蜜月，不是普通任何假期。","They spent their honeymoon on a quiet island.","他们在安静岛屿度过蜜月。","The hotel welcomed a couple on honeymoon.","酒店接待了一对度蜜月的夫妇。"],
  ["carpenter","名词 · 木匠","carpenter 指制作、修理木结构或其部件的工匠；通常与木工有关，不是所有修理工或家具销售人员的总称。","The carpenter fitted new shelves in the library.","木匠给图书馆装了新架子。","We asked a carpenter to repair the wooden gate.","我们请木匠修理木门。"],
  ["inventor","名词 · 发明者","inventor 的技术义指创造新装置、工艺的人；the inventor of 后接发明，不等于只发现自然界已有事物的人。","The inventor demonstrated a simple water-saving device.","发明者演示了一种简单节水装置。","The museum records the name of each inventor.","博物馆记录了每位发明者的名字。"],
  ["misunderstand","动词 · 误解","misunderstand 可直接接被误解的消息、人或意图；过去式和过去分词是 misunderstood，不是 misunderstood 后再加 ed。","Please ask if you think you might misunderstand the instructions.","如果你觉得可能误解说明，请提问。","It is easy to misunderstand a short message without context.","缺少上下文时，一条短消息很容易被误解。"],
  ["tedious","形容词 · 冗长乏味的","tedious 说事情因太长或太单调而让人厌倦；a tedious task 不必非常难，可能只是重复且耗时。","Copying every label by hand was a tedious task.","手抄每张标签是项乏味工作。","The discussion became tedious after the same point was repeated.","同一观点重复后，讨论变得乏味。"],
  ["granddaughter","名词 · 孙女或外孙女","granddaughter 指儿子或女儿的女儿，不区分父系、母系；中文具体译为孙女还是外孙女，要看亲属关系。","His granddaughter sends him a drawing every month.","他的孙女每个月都给他寄画。","Their daughter's child is their youngest granddaughter.","他们女儿的孩子是他们最小的外孙女。"],
  ["rejoice","动词 · 欢喜或庆贺","rejoice 可不及物表示非常高兴，也可用 rejoice at 或 in 说明喜悦缘由；语气往往比日常说 happy 更郑重。","The whole village had reason to rejoice when the bridge reopened.","桥重新开放时，全村都有理由欢庆。","We rejoice at the safe return of the missing boat.","我们为失踪船只平安归来而欣喜。"]
];

// Dictionary senses below checked on 2026-10-24; original bilingual examples.
const october24Rows = [
  [
    "brisk",
    "形容词 · 轻快而有活力的",
    "brisk 描述动作或步调轻快有力，常修饰 walk 或 pace；强调速度和精神，而非行动草率。",
    "A brisk walk helped us warm up before the climb.",
    "登山前轻快地走一段帮我们暖了身。",
    "The class moved at a brisk pace after the break.",
    "休息后课堂进度变得轻快。"
  ],
  [
    "pollute",
    "动词 · 污染",
    "pollute 是及物动词，直接接受污染的水、空气或环境；污染源可另用 with 或 by 结构说明。",
    "Leaking pipes could pollute the stream behind the houses.",
    "漏水的管道可能污染屋后的小溪。",
    "Do these engines pollute the air near the school?",
    "这些发动机会污染学校附近的空气吗？"
  ],
  [
    "tan",
    "动词 · 使皮肤晒黑",
    "这里的 tan 指阳光等使皮肤颜色变深，可直接接 skin；不表示皮肤晒伤，也不把变黑自动视为健康。",
    "Long afternoons outside can tan exposed skin.",
    "长时间在户外度过下午会使裸露皮肤晒黑。",
    "The sunlight began to tan his arms during the voyage.",
    "航行中阳光开始把他的手臂晒黑。"
  ],
  [
    "yearly",
    "副词 · 每年",
    "yearly 作副词表示每年或一年一次，直接修饰动作；若放在 report 等名词前，则是形容词用法。",
    "Members renew their museum passes yearly.",
    "会员每年续办博物馆通行证。",
    "The village holds this lantern show yearly.",
    "村里每年举办这场灯展。"
  ],
  [
    "mouthful",
    "名词 · 一口的量",
    "mouthful 可指一次含入口中的食物或液体的量，常用 a mouthful of；复数加在词末成为 mouthfuls。",
    "He swallowed a mouthful of warm soup before speaking.",
    "他咽下一口温汤才开口。",
    "I took one mouthful and passed the bowl back.",
    "我吃了一口便把碗递了回去。"
  ],
  [
    "sly",
    "形容词 · 狡黠的或暗中行事的",
    "sly 可指隐瞒意图，也可带轻微顽皮意味；描述 smile 时常表示藏着心思，具体褒贬依情境判断。",
    "A sly smile crossed her face as she hid the gift.",
    "她藏礼物时脸上掠过狡黠的微笑。",
    "His sly attempt to change the scores failed.",
    "他偷偷改分的企图失败了。"
  ],
  [
    "shady",
    "形容词 · 有阴凉的",
    "shady 的环境义表示有树荫等遮挡阳光，可描述地点；与其表示可疑、不可靠的比喻义应分开理解。",
    "We chose a shady corner for our picnic.",
    "我们选了个阴凉角落野餐。",
    "The path stays shady even at noon.",
    "这条小路即使中午也很阴凉。"
  ],
  [
    "humorous",
    "形容词 · 幽默的",
    "humorous 描述能引人发笑或体现幽默感的故事、言语等；可以修饰作品，也可以描述人的风格。",
    "Her humorous letters made the long winter easier.",
    "她幽默的来信让漫长冬天好过了些。",
    "The guide gave a humorous account of the failed expedition.",
    "向导幽默地讲述了那次失败的探险。"
  ],
  [
    "mortal",
    "形容词 · 会死亡的",
    "mortal 描述生命终将结束的性质，和 immortal 相对；这里不采用它修饰伤害时表示致命的另一义。",
    "The ancient tale contrasts mortal people with timeless gods.",
    "古老故事把终有一死的人与永恒的神对照。",
    "Even the king is mortal in this legend.",
    "在这个传说中，即使国王也会死去。"
  ],
  [
    "rusty",
    "形容词 · 因缺乏练习而生疏的",
    "rusty 除生锈外，还可描述技能久未使用而生疏；说语言能力 rusty 并不是指这种语言本身过时。",
    "My French is rusty after ten years without practice.",
    "十年没练习，我的法语生疏了。",
    "Her rusty keyboard skills improved during the project.",
    "项目期间她生疏的键盘操作逐渐熟练了。"
  ],
  [
    "unjust",
    "形容词 · 不公正的",
    "unjust 评价待遇、制度或决定不公正，侧重公平问题；并非所有自己不喜欢的结果都可据此称为 unjust。",
    "The committee overturned the unjust decision.",
    "委员会推翻了这项不公正的决定。",
    "Workers protested against an unjust system of promotion.",
    "工人抗议不公正的晋升制度。"
  ],
  [
    "grieve",
    "动词 · 悲伤或哀悼",
    "grieve 可不及物表示悲痛，也可直接接哀悼的损失；grieve for 后面可接所思念或哀悼的人。",
    "People need time to grieve after losing someone close.",
    "失去亲近之人后，人们需要时间哀伤。",
    "The family still gather to grieve for their lost brother.",
    "家人仍会聚在一起悼念逝去的兄弟。"
  ],
  [
    "millimetre",
    "名词 · 毫米",
    "millimetre 是长度单位，等于千分之一米，是 millimeter 的英式拼法；不能与表示百万分之一米的单位混淆。",
    "Move the needle one millimetre to the left.",
    "把针向左移动一毫米。",
    "A single millimetre can affect the fit of this part.",
    "哪怕一毫米也会影响这个零件的配合。"
  ],
  [
    "lame",
    "形容词 · 缺乏说服力的",
    "lame 可形容借口或论证无力、不可信，语气带批评；这里专指解释的质量，不用来评价人的身体情况。",
    "His lame explanation convinced none of the neighbours.",
    "他无力的解释没说服任何邻居。",
    "She offered a lame excuse for missing the rehearsal.",
    "她给出一个站不住脚的借口解释缺席排练。"
  ],
  [
    "metric",
    "名词 · 衡量指标",
    "metric 作名词可指衡量表现的标准或指标，可数；不同于表示公制的形容词，须结合所测内容理解。",
    "We need a better metric for customer satisfaction.",
    "我们需要更好的客户满意度指标。",
    "Speed is not the only metric used in this comparison.",
    "速度不是这项比较使用的唯一指标。"
  ],
  [
    "slit",
    "名词 · 狭长开口",
    "slit 指狭长的切口或缝隙，通常可数；a slit in 后接有开口的物体，不泛指所有形状的洞。",
    "A narrow slit in the curtain let in morning light.",
    "窗帘上的一道窄缝透进晨光。",
    "She pushed the note through a slit in the box.",
    "她把纸条从盒子上的狭缝塞进去。"
  ],
  [
    "thirst",
    "名词 · 口渴",
    "thirst 的身体感觉义通常不可数，可接表示缓解或忍受的动词；与形容词 thirsty 的句法不同。",
    "Cold water finally eased our thirst after the walk.",
    "步行后凉水终于缓解了我们的口渴。",
    "He woke with a terrible thirst in the middle of the night.",
    "他半夜因非常口渴而醒来。"
  ],
  [
    "sympathize",
    "动词 · 同情",
    "sympathize 的同情义是不及物用法，常以 with 引出对象；表示理解别人的苦处，不等于同意全部做法。",
    "I sympathize with anyone facing such a difficult choice.",
    "我同情任何面临如此艰难选择的人。",
    "She can sympathize with his frustration after that delay.",
    "那次延误后，她能体会他的沮丧。"
  ],
  [
    "liter",
    "名词 · 升",
    "liter 是体积单位，等于一千毫升，常见英式拼法是 litre；a liter of 后接按此量计的液体等。",
    "Add a liter of water to the empty bucket.",
    "向空桶里加一升水。",
    "This bottle holds exactly one liter.",
    "这个瓶子的容量正好是一升。"
  ],
  [
    "hasty",
    "形容词 · 仓促的",
    "hasty 表示做得急或考虑不充分，常修饰判断、结论和行动；强调仓促时通常含有需要更慎重的意味。",
    "A hasty repair left the window difficult to close.",
    "仓促的修理使窗户很难关上。",
    "Do not send a hasty reply while you are angry.",
    "生气时别匆忙回复。"
  ],
  [
    "scorn",
    "名词 · 轻蔑",
    "scorn 指明显的不屑或鄙视，常作不可数名词；with scorn 描述态度，比单纯不赞同带有更强贬斥意味。",
    "His proposal met with scorn at the first meeting.",
    "他的提议在第一次会议上遭到轻蔑对待。",
    "She listened without showing surprise or scorn.",
    "她听着，没有表现出惊讶或轻蔑。"
  ],
  [
    "trifle",
    "名词 · 小事",
    "trifle 可数，指价值或重要性很小的东西或事情；a trifle 可评价一件事，不能据此判断别人也觉得不重要。",
    "The missing button seemed a trifle beside the larger problem.",
    "与更大的问题相比，少颗纽扣似乎只是小事。",
    "They argued over a trifle and forgot their original plan.",
    "他们为一件小事争吵，忘了原本的计划。"
  ],
  [
    "westward",
    "副词 · 向西",
    "westward 作方向副词可修饰移动，后面不必再接 to the west；它说明方向，不表示已到某个西部地区。",
    "The convoy turned westward after crossing the river.",
    "车队过河后转向西行。",
    "Dark clouds spread westward across the valley.",
    "乌云向西铺过山谷。"
  ],
  [
    "transformer",
    "名词 · 变压器",
    "transformer 的电气义是改变电压、电流关系的设备，通常可数；这里不采用影视角色或人工智能模型的专门义。",
    "An engineer inspected the transformer behind the station.",
    "工程师检查了车站后面的变压器。",
    "The damaged transformer was replaced before sunrise.",
    "损坏的变压器在日出前换好了。"
  ],
  [
    "manly",
    "形容词 · 传统上被认为有男子气概的",
    "manly 描述传统上与男性联系的气质，带文化判断；用于人物刻画时应理解为说话者的观念而非普遍标准。",
    "The character tries to appear manly by hiding his fear.",
    "这个角色试图掩饰恐惧来显得有男子气概。",
    "The old portrait gives the prince a deliberately manly appearance.",
    "旧肖像刻意把王子画得富有男子气概。"
  ],
  [
    "hateful",
    "形容词 · 充满恶意的",
    "hateful 可描述带仇恨或恶意的言语、行为；这里强调发出伤害和敌意，并非一般的不愉快感受。",
    "The moderator removed a hateful comment from the forum.",
    "版主删除了论坛上一条充满恶意的评论。",
    "She refused to repeat the hateful words she had heard.",
    "她拒绝复述听到的那些恶毒话语。"
  ],
  [
    "sightseeing",
    "名词 · 观光",
    "sightseeing 指参观当地名胜的活动，常整体使用；go sightseeing 或 do some sightseeing 都可，不说一次活动是 a sightseeing。",
    "We left an afternoon free for sightseeing.",
    "我们留出一个下午观光。",
    "Their sightseeing ended early because of the heavy rain.",
    "大雨使他们的观光提前结束。"
  ],
  [
    "dialog",
    "名词 · 对话或对白",
    "dialog 是 dialogue 的较少见拼法，可指作品中的对白；这里是语言交流内容，不是指整场舞台演出。",
    "The actor shortened the dialog during rehearsal.",
    "演员在排练时缩短了对白。",
    "Their new film contains very little dialog.",
    "他们的新电影对白很少。"
  ],
  [
    "vex",
    "动词 · 使烦恼",
    "vex 是及物动词，可表示使某人恼怒或苦恼，语气较书面；直接接人，不把它当作人自身烦恼的状态形容词。",
    "Repeated changes to the schedule began to vex the crew.",
    "日程反复变化开始让全体工作人员烦恼。",
    "Small delays rarely vex our patient guide.",
    "小小延误很少惹恼我们耐心的向导。"
  ],
  [
    "seaport",
    "名词 · 海港",
    "seaport 指海船能够抵达的港口或港口城镇，通常可数；不应用它泛称所有靠湖泊或小河的码头。",
    "The railway connects the mines with a busy seaport.",
    "铁路把矿区与繁忙海港相连。",
    "Our ship reached the seaport shortly before dusk.",
    "船在黄昏前不久抵达海港。"
  ],
  [
    "waggon",
    "名词 · 运货马车",
    "waggon 是 wagon 的主要用于英式英语的拼法，这里指运货的四轮车；不是把任何小汽车都叫这个词。",
    "The horse pulled a loaded waggon through the gate.",
    "马拉着满载货物的车穿过大门。",
    "They stacked sacks of grain inside the wooden waggon.",
    "他们把一袋袋粮食堆进木制运货车。"
  ],
  [
    "assessment",
    "名词 · 评估",
    "assessment 可指评估过程或某次评估，常用 assessment of 说明对象；不必限于考试分数，也可判断风险和情况。",
    "The engineer prepared an assessment of the bridge's condition.",
    "工程师编写了一份桥梁状况评估。",
    "Our initial assessment missed the damage beneath the floor.",
    "初步评估漏掉了地板下的损坏。"
  ],
  [
    "offence",
    "名词 · 受冒犯的不悦",
    "offence 是 offense 的变体拼法，在 take offence 中表示因言语或行为感到受冒犯；不是指体育比赛的进攻。",
    "Please do not take offence at my direct question.",
    "请不要因我直率的问题而不快。",
    "He meant no offence when he corrected the date.",
    "他纠正日期时没有冒犯的意思。"
  ],
  [
    "producer",
    "名词 · 制片人或制作人",
    "producer 在影视表演中负责筹资或统筹制作，可数；其职责不与 director 导演完全重合，要按作品分工理解。",
    "The producer found a smaller studio for the recording.",
    "制作人为录音找到了一间较小的录音室。",
    "Our producer approved the final rehearsal schedule.",
    "制作人批准了最终排练日程。"
  ],
  [
    "warning",
    "名词 · 警告",
    "warning 可指提醒危险的通知或信号，常用 a warning about 或 of；give someone a warning 表示向某人发出警告。",
    "The radio carried a warning about strong winds offshore.",
    "电台播报了近海大风警告。",
    "A warning on the gate kept visitors away from the unstable wall.",
    "门上的警示让访客远离不稳固的墙。"
  ],
  [
    "proceeding",
    "名词 · 法律诉讼程序",
    "proceeding 作名词可指一项法律程序，常与 legal 连用；单数可表示一次具体程序，不是所有普通行动的随意称呼。",
    "The court opened a legal proceeding over the disputed property.",
    "法院就争议财产启动了法律程序。",
    "Each proceeding was recorded by a court clerk.",
    "每项诉讼程序都由书记员记录。"
  ],
  [
    "therapy",
    "名词 · 治疗",
    "therapy 指针对疾病、损伤或障碍的治疗，可整体表达；加 physical 等词可说明治疗类别，不只等于心理咨询。",
    "The clinic offers speech therapy for children.",
    "诊所为儿童提供语言治疗。",
    "He attended physical therapy twice a week after the injury.",
    "受伤后他每周接受两次物理治疗。"
  ],
  [
    "inspector",
    "名词 · 检查员",
    "inspector 指工作职责是检查的人，通常可数；修饰语可说明安全、建筑等领域，此义并不自动表示警察职衔。",
    "The safety inspector examined every emergency exit.",
    "安全检查员检查了每一个紧急出口。",
    "An inspector asked to see the kitchen's cleaning records.",
    "检查员要求查看厨房的清洁记录。"
  ],
  [
    "duke",
    "名词 · 公爵",
    "duke 是贵族或统治者的头衔，具体级别与历史制度相关；这里限公爵义，不把英国贵族体系直接套到所有国家。",
    "The duke donated part of his estate to the village.",
    "公爵把部分地产捐给了村庄。",
    "A portrait of the duke hung above the staircase.",
    "公爵的肖像挂在楼梯上方。"
  ],
  [
    "clinical",
    "形容词 · 临床的",
    "clinical 可说明与患者直接观察、诊疗有关；clinical experience 指临床经验，不是一般实验室操作经验的同义词。",
    "Students gain clinical experience at the teaching hospital.",
    "学生在教学医院积累临床经验。",
    "The report separates clinical observations from laboratory findings.",
    "报告把临床观察和实验室发现分开列示。"
  ],
  [
    "earnings",
    "复数名词 · 劳动收入",
    "earnings 表示劳动所得时使用复数形式，可接 from 说明来源；不把单次工作所得写成 an earnings。",
    "Her earnings from tutoring covered the rent.",
    "她的家教收入足以支付房租。",
    "His weekly earnings vary during the winter.",
    "他的每周收入在冬季会有波动。"
  ],
  [
    "testimony",
    "名词 · 证词",
    "testimony 可指证人在正式询问中作出的陈述，常用 give testimony；此词强调证言，不是对所有意见的通称。",
    "The witness gave testimony through an interpreter.",
    "证人通过口译员作证。",
    "Her testimony helped establish the time of the accident.",
    "她的证词帮助确定了事故时间。"
  ],
  [
    "dominant",
    "形容词 · 占主导地位的",
    "dominant 描述在力量、影响或重要性上占优势；可修饰主题或行业，并不必然表示完全没有其他力量。",
    "Blue is the dominant colour in the painting.",
    "蓝色是这幅画的主色。",
    "Tourism became the dominant industry on the island.",
    "旅游业成了岛上的主导产业。"
  ],
  [
    "magistrate",
    "名词 · 地方司法官",
    "magistrate 可指权限有限的地方司法官，具体职权依国家制度而异；这里不用它指所有律师或一般行政人员。",
    "The magistrate asked the witness to speak more slowly.",
    "地方司法官请证人说慢些。",
    "A local magistrate heard the case that morning.",
    "一位地方司法官那天早上审理了此案。"
  ],
  [
    "capability",
    "名词 · 能力",
    "capability 表示具备做某事的能力，可接 to do 说明行为；复数 capabilities 常描述一个人或系统的多方面能力。",
    "The new camera has the capability to record underwater.",
    "新相机具备水下录像能力。",
    "We underestimated her capability as a team leader.",
    "我们低估了她担任团队领导的能力。"
  ],
  [
    "completion",
    "名词 · 完成",
    "completion 表示完成的过程或状态，常用 on completion of；通常整体使用，后接所完成的工作或项目。",
    "The final payment is due on completion of the roof.",
    "屋顶完工时应付清尾款。",
    "The exhibition is now close to completion.",
    "展览筹备现已接近完成。"
  ],
  [
    "printer",
    "名词 · 打印机",
    "printer 的设备义指把文字、图像输出到纸面等介质的机器；通常可数，区别于只显示内容的屏幕。",
    "The printer stopped halfway through the report.",
    "打印机打到报告中途停了。",
    "Connect the printer before opening the document.",
    "打开文档前先连接打印机。"
  ],
  [
    "assurance",
    "名词 · 自信",
    "assurance 可表示言谈举止中显出的自信，常用 with assurance；这里是状态，不是给别人作保证的另一义。",
    "She answered the difficult question with quiet assurance.",
    "她沉着自信地回答了难题。",
    "His assurance grew as the rehearsal continued.",
    "随着排练进行，他的自信增加了。"
  ],
  [
    "offensive",
    "形容词 · 进攻的",
    "offensive 在体育语境修饰为得分而进行的行动或安排；与 defensive 防守的相对，不是冒犯他人的评价义。",
    "The coach changed the team's offensive strategy at halftime.",
    "教练在中场休息时调整了球队进攻策略。",
    "Their offensive play created space near the goal.",
    "他们的进攻打法在球门附近创造了空间。"
  ],
  [
    "instructor",
    "名词 · 教练或指导教师",
    "instructor 指教授知识或技能的人，常由 driving 等词说明领域；不是仅凭这一称呼就能判断大学职称。",
    "Our climbing instructor checked every rope.",
    "我们的攀岩教练检查了每根绳索。",
    "The instructor demonstrated the movement before we tried it.",
    "指导老师先示范动作，我们才尝试。"
  ],
  [
    "interface",
    "名词 · 交互界面或接口",
    "interface 指系统相互作用或沟通的接点、手段；user interface 是用户操作界面，不等于整个软件程序。",
    "The new interface lets visitors choose a language immediately.",
    "新界面让访客可以立即选择语言。",
    "A simple interface connects the sensor to the computer.",
    "一个简单接口把传感器连到电脑。"
  ],
  [
    "pregnancy",
    "名词 · 怀孕或孕期",
    "pregnancy 可指怀孕状态，也可指一次怀孕；during pregnancy 表示孕期，讲具体一次时可用 her first pregnancy。",
    "She continued her language course during pregnancy.",
    "怀孕期间她继续上语言课。",
    "The diary describes her first pregnancy in detail.",
    "日记详细记录了她第一次怀孕的经历。"
  ],
  [
    "marginal",
    "形容词 · 写在页边的",
    "marginal 的文字位置义表示在页边空白处写出或印出的；marginal notes 是页边批注，不是正文的一部分。",
    "The editor's marginal comments were written in pencil.",
    "编辑的页边意见用铅笔写成。",
    "A marginal note explained the old place name.",
    "一条页边注解释了旧地名。"
  ],
  [
    "sheer",
    "形容词 · 十足的或纯粹的",
    "sheer 可置于名词前加强程度，表示完全、十足或单凭某物；此义不是描述悬崖陡峭或布料透明。",
    "She finished the climb through sheer determination.",
    "她凭着十足的决心完成了攀登。",
    "The sheer size of the hall surprised the visitors.",
    "大厅之大让访客惊讶。"
  ],
  [
    "counseling",
    "名词 · 专业咨询辅导",
    "counseling 指利用面谈等方法提供的专业指导，可用于职业或心理领域；通常不可数，不能简单等同随口建议。",
    "The school provides career counseling before graduation.",
    "学校在毕业前提供职业辅导。",
    "He found counseling helpful during the difficult transition.",
    "艰难转变期间，他觉得咨询辅导很有帮助。"
  ],
  [
    "specification",
    "名词 · 详细规格说明",
    "specification 可指对设计或要求的详细说明，常见复数 specifications；具体某一份说明文件也可用单数表达。",
    "The builder followed the architect's specification exactly.",
    "施工方严格遵照建筑师的规格说明。",
    "This specification includes the required thickness of the glass.",
    "这份规格说明包括玻璃所需厚度。"
  ],
  [
    "correlation",
    "名词 · 相关性",
    "correlation 描述变量之间一起变化的统计关系，常用 between 连接两项；相关本身不足以证明一方导致另一方。",
    "The survey found a correlation between distance and travel time.",
    "调查发现距离与出行时间存在相关性。",
    "A strong correlation alone does not explain the mechanism.",
    "很强的相关性本身不能解释作用机制。"
  ],
  [
    "plead",
    "动词 · 在法庭辩论",
    "plead 的法律义可表示为案件或某方辩护，plead a case 可直接接案件；这里不采用日常恳求义。",
    "A lawyer will plead their case before the court.",
    "一位律师将向法院为他们的案件辩护。",
    "She learned to plead complex cases during her legal career.",
    "她在法律职业生涯中学会为复杂案件辩护。"
  ],
  [
    "theft",
    "名词 · 偷窃",
    "theft 指窃取财物的行为，也可指一次盗窃事件；the theft of 后接被盗物，不应和所有形式的财产损失混同。",
    "The shop reported the theft of several cameras.",
    "商店报案称有几台相机被盗。",
    "Better locks reduced theft from the storage area.",
    "更好的锁减少了储藏区的盗窃。"
  ],
  [
    "diplomatic",
    "形容词 · 外交的",
    "diplomatic 指国家间交涉或外交人员相关的事物；diplomatic relations 是外交关系，此义不是单纯待人圆滑。",
    "The countries opened a new diplomatic channel.",
    "两国开辟了新的外交通道。",
    "She began her diplomatic career at a small embassy.",
    "她在一间小使馆开始了外交职业生涯。"
  ],
  [
    "productivity",
    "名词 · 生产效率",
    "productivity 表示生产或工作的效率，常作不可数名词；提高它指相应投入下产出更好，不能只凭加班时长判断。",
    "Better tools increased productivity in the workshop.",
    "更好的工具提高了车间生产效率。",
    "The study compares productivity across three farms.",
    "研究比较了三家农场的生产效率。"
  ],
  [
    "correctly",
    "副词 · 正确地",
    "correctly 修饰动作，表示做得正确，可放在动词附近；不要用它直接修饰名词来代替形容词 correct。",
    "Please check that the address is written correctly.",
    "请检查地址是否写对了。",
    "Only one team solved the final puzzle correctly.",
    "只有一队正确解出了最后一道谜题。"
  ],
  [
    "chronic",
    "形容词 · 长期反复的",
    "chronic 强调持续很久或反复出现，可形容疾病，也可形容长期难题；不是严重程度高的简单同义词。",
    "The village faces a chronic shortage of clean water.",
    "村庄长期缺乏清洁饮用水。",
    "A chronic staffing problem delayed the opening.",
    "长期的人手问题推迟了开业。"
  ],
  [
    "directory",
    "名词 · 名录",
    "directory 可指按字母或类别编排的姓名、地址等名录；此义可数，与电脑中文件夹目录的专门义应分开。",
    "The directory lists local repair services by area.",
    "名录按地区列出本地维修服务。",
    "I found her office number in the staff directory.",
    "我在员工名录里找到了她的办公电话。"
  ],
  [
    "justification",
    "名词 · 正当理由",
    "justification 可指为某行为提供的合理依据，常用 justification for；强调可接受的理由，不保证听者一定认同。",
    "There is little justification for closing the only library.",
    "关闭唯一的图书馆缺少正当理由。",
    "The report provides a clear justification for the extra expense.",
    "报告清楚说明了额外开支的合理依据。"
  ],
  [
    "availability",
    "名词 · 可获得性",
    "availability 表示东西能否获得、使用或人员是否有空；check availability 可核查空位或供应，不等于已经订到。",
    "Room availability changes quickly during the festival.",
    "节日期间客房空余情况变化很快。",
    "The timetable depends on the availability of qualified guides.",
    "时间表取决于合格向导是否有空。"
  ],
  [
    "dedicate",
    "动词 · 投入或专用于",
    "dedicate something to 可表示把时间、资源投入某目的；to 后接名词或动名词，不能直接当成不定式标记。",
    "We dedicate Friday afternoons to testing new designs.",
    "我们把周五下午专门用于测试新设计。",
    "She plans to dedicate more time to restoring the garden.",
    "她计划投入更多时间修复花园。"
  ],
  [
    "envisage",
    "动词 · 设想",
    "envisage 是及物动词，表示事先在脑中设想情景；可接名词或动名词，不保证想象的安排最终会实现。",
    "The planners envisage a park along the old railway.",
    "规划人员设想沿旧铁路建一座公园。",
    "I cannot envisage living so far from the sea.",
    "我无法想象住在离海这么远的地方。"
  ],
  [
    "concede",
    "动词 · 承认",
    "concede 可表示虽有保留仍承认某事实，常接 that 从句；也可直接接 point 等对象，语气比随口同意更有让步意味。",
    "I concede that your route is shorter.",
    "我承认你选的路线更短。",
    "They may concede the point after reviewing the photographs.",
    "他们看过照片后可能会承认这一点。"
  ],
  [
    "subsidiary",
    "名词 · 子公司",
    "subsidiary 作名词可指受另一家公司控制的公司，可数；和形容词表示辅助、次要的用法不同，不能只看词尾判断。",
    "The firm opened a subsidiary near the port.",
    "公司在港口附近开设了一家子公司。",
    "Its largest subsidiary manufactures railway equipment.",
    "它最大的子公司生产铁路设备。"
  ],
  [
    "fascinating",
    "形容词 · 令人着迷的",
    "fascinating 描述某事极有趣、能吸引注意；人的感受通常用 fascinated，不能把吸引人的事物与被吸引者混用。",
    "The museum has a fascinating collection of old maps.",
    "博物馆收藏了一批引人入胜的旧地图。",
    "Her account of life at sea was fascinating.",
    "她关于海上生活的叙述很迷人。"
  ],
  [
    "prevention",
    "名词 · 预防",
    "prevention 表示阻止问题发生的过程，通常不可数；prevention of 后接要防止的事，不是问题发生后的补救本身。",
    "The workshop focuses on the prevention of kitchen fires.",
    "工作坊重点讲厨房火灾预防。",
    "Prevention receives a separate chapter in the safety handbook.",
    "安全手册用单独一章讲预防措施。"
  ],
  [
    "execution",
    "名词 · 执行或实施",
    "execution 的实施义表示把计划付诸行动，可用 execution of；它还可指处决，所以阅读时要由对象辨明义项。",
    "Careful execution of the plan kept the event on time.",
    "计划得到认真执行，使活动准时进行。",
    "The design was simple, but its execution required patience.",
    "设计虽简单，实施却需要耐心。"
  ],
  [
    "annually",
    "副词 · 每年",
    "annually 表示一年一次或按年计算，常用于较正式说明；它是副词，修饰动作时不再另加 every year。",
    "The committee reviews the rules annually.",
    "委员会每年审查规则。",
    "Members pay the fee annually rather than monthly.",
    "会员按年而非按月缴费。"
  ],
  [
    "slap",
    "动词 · 用手掌拍打",
    "slap 的动作义强调以张开的手掌快速拍击，可直接接物体；不等于握拳击打，过去式加倍末尾 p 后加 ed。",
    "Slap the dough firmly against the clean board.",
    "把面团用力拍到干净案板上。",
    "He raised his hand to slap the dusty cushion.",
    "他抬手拍打落了灰的靠垫。"
  ],
  [
    "dignity",
    "名词 · 尊严",
    "dignity 可指应受尊重的价值或尊严，常作不可数名词；respect someone's dignity 强调对人的尊重，不只指职位高低。",
    "The volunteers treated every visitor with dignity.",
    "志愿者尊重每位访客的尊严。",
    "She defended her dignity without raising her voice.",
    "她没有提高嗓门，却捍卫了自己的尊严。"
  ],
  [
    "shrimp",
    "名词 · 虾",
    "shrimp 指虾类动物，也可按食材整体表达；指多只时 shrimp 与 shrimps 均可见，须按句子是否强调数量理解。",
    "A tiny shrimp hid among the seaweed.",
    "一只小虾藏在海草间。",
    "She added shrimp to the rice just before serving.",
    "她在上桌前把虾加进米饭。"
  ],
  [
    "bankruptcy",
    "名词 · 破产",
    "bankruptcy 是破产状态的名词，face bankruptcy 表面临破产；与形容词 bankrupt 不同，不能直接互换词性。",
    "The company narrowly avoided bankruptcy after selling the warehouse.",
    "公司出售仓库后勉强避免了破产。",
    "Bankruptcy forced the workshop to close its doors.",
    "破产迫使工坊关门。"
  ],
  [
    "hitherto",
    "副词 · 迄今或此前",
    "hitherto 表示截至当前或所述时点，语体较正式；需结合叙述时间理解，不一定总以说话的今天为界。",
    "The diary revealed a hitherto hidden part of her life.",
    "日记揭示了她生活中此前不为人知的一部分。",
    "The team entered territory hitherto unexplored by them.",
    "队伍进入了他们此前未探索过的地区。"
  ],
  [
    "recruitment",
    "名词 · 招募或招聘",
    "recruitment 指吸引并招收人员的过程，通常整体使用；student recruitment 可指招生，不限于企业招聘正式员工。",
    "The club began a recruitment campaign for new volunteers.",
    "俱乐部开始开展新志愿者招募活动。",
    "Staff recruitment took longer than the director expected.",
    "人员招聘比主管预期的时间长。"
  ],
  [
    "tragic",
    "形容词 · 悲惨的",
    "tragic 可描述造成严重痛苦或令人痛惜的事件；悲剧结局也可用此词，不宜只按普通的不方便来理解。",
    "The museum tells the story of a tragic shipwreck.",
    "博物馆讲述了一次悲惨海难的故事。",
    "Their reunion followed a tragic loss in the family.",
    "他们在家人遭遇悲痛损失后重逢。"
  ],
  [
    "tighten",
    "动词 · 拧紧或收紧",
    "tighten 可及物表示使东西更紧，也可不及物表示变紧；描述螺丝、绳带等具体对象时可直接接宾语。",
    "Use the small tool to tighten the loose screw.",
    "用小工具拧紧松动的螺丝。",
    "Please tighten the rope before we lift the canvas.",
    "我们提起帆布前，请先拉紧绳子。"
  ],
  [
    "maturity",
    "名词 · 成熟",
    "maturity 可指充分发展或判断上的成熟，常作不可数名词；年龄增长和心理成熟有联系，但两者不能直接画等号。",
    "She handled the disagreement with surprising maturity.",
    "她以出人意料的成熟态度处理了分歧。",
    "These trees reach maturity after many years.",
    "这些树多年后才长成。"
  ],
  [
    "momentum",
    "名词 · 发展势头",
    "momentum 可比喻一连串事件积累的发展力量，常用 gain 或 lose momentum；不必把物理学动量的计算带入此义。",
    "The campaign gained momentum after the first public meeting.",
    "第一次公开会议后，这场活动声势渐强。",
    "We lost momentum when the main workshop closed.",
    "主工坊关闭后，我们的发展势头减弱了。"
  ],
  [
    "embassy",
    "名词 · 大使馆",
    "embassy 可指大使及工作人员办公、居住的官方机构或馆舍，可数；与专指领事机构的 consulate 不完全相同。",
    "She left the documents at the embassy reception desk.",
    "她把文件留在大使馆接待处。",
    "The embassy moved to a larger building last spring.",
    "大使馆去年春天搬进了更大的楼。"
  ],
  [
    "confrontation",
    "名词 · 对抗或冲突",
    "confrontation 可指力量或观点的正面冲突，常用 between 或 with 引出双方；不必然都是肢体暴力事件。",
    "The chair prevented a confrontation between the two groups.",
    "主席阻止了两个小组之间的正面冲突。",
    "He preferred a calm discussion to a public confrontation.",
    "比起公开对抗，他更愿意平静讨论。"
  ],
  [
    "vocal",
    "形容词 · 直言表达意见的",
    "vocal 描述积极公开表达观点的人，常修饰 critic 或 supporter；强调发声明确，不能只理解为嗓门大。",
    "She became a vocal supporter of the new library.",
    "她成了积极为新图书馆发声的支持者。",
    "Several residents were vocal about the proposed road.",
    "几位居民对拟建道路公开表达了意见。"
  ],
  [
    "thereafter",
    "副词 · 此后",
    "thereafter 是较正式的时间副词，回指前述事件或时点；它本身不用再接名词宾语，和 after 的句法不同。",
    "The bridge reopened in May and stayed open thereafter.",
    "桥在五月重新开放，此后一直通行。",
    "They signed the agreement and left shortly thereafter.",
    "他们签好协议，不久便离开了。"
  ],
  [
    "eligible",
    "形容词 · 符合资格的",
    "eligible to do 表示有资格做某事，eligible for 后可接名额、福利等；符合资格不等于已经被选中或获得。",
    "Are all students eligible to enter this competition?",
    "所有学生都有资格参加这项比赛吗？",
    "She is eligible for the advanced training programme.",
    "她符合高级培训项目的资格。"
  ],
  [
    "intact",
    "形容词 · 完好无损的",
    "intact 描述东西保持完整、未受损，可接在 remain 或 leave 后；它强调保存状态，不直接说明物品是否全新。",
    "The wooden case arrived intact despite the rough journey.",
    "尽管路途颠簸，木箱仍完好送达。",
    "Workers left the original staircase intact.",
    "工人保留了原来的楼梯，使其完整无损。"
  ],
  [
    "referee",
    "名词 · 裁判",
    "referee 的体育义是按比赛规则执裁的人，通常可数；具体运动职责不同，不宜与教练或球队队长混同。",
    "The referee stopped the match to check the injured player.",
    "裁判暂停比赛，查看受伤球员。",
    "A referee explained the rules before the tournament began.",
    "比赛开始前，一名裁判讲解了规则。"
  ],
  [
    "lily",
    "名词 · 百合",
    "lily 通常指百合及某些相关植物，可数，复数为 lilies；具体植物名称中的 lily 不一定都属于百合属。",
    "A white lily opened beside the garden wall.",
    "花园墙边开出了一朵白百合。",
    "She painted a lily growing from a cracked pot.",
    "她画了一株从裂花盆里长出的百合。"
  ],
  [
    "positively",
    "副词 · 简直或确实",
    "positively 可加强陈述的语气，接形容词时常表示简直、非常；这种强调用法不必然表达正面情绪。",
    "The room felt positively enormous after our tiny cabin.",
    "住过小舱房后，这房间简直大得惊人。",
    "He looked positively miserable in the wet costume.",
    "穿着湿戏服的他看起来简直难受极了。"
  ],
  [
    "shaft",
    "名词 · 一束光",
    "shaft 可指穿过开口的清晰光束，常用 a shaft of light；这一可数义项不等于光线的一般不可数用法。",
    "A shaft of light crossed the dusty floor.",
    "一束光照过满是灰尘的地板。",
    "We saw a golden shaft coming through the broken roof.",
    "我们看见一道金色光束穿过破屋顶。"
  ],
  [
    "fantastic",
    "形容词 · 极好的",
    "fantastic 在日常评价中表示非常好，语气强烈；它也有幻想、不真实等义，不能在所有语境一律译为极好。",
    "You did a fantastic job restoring the old chair.",
    "你把旧椅子修复得非常棒。",
    "The view from the roof was fantastic.",
    "屋顶上的景色美极了。"
  ],
  [
    "reproduction",
    "名词 · 复制品",
    "reproduction 作可数名词可指仿照原物制成的复制品；与不可数的繁殖过程义不同，艺术品语境应看冠词和数量。",
    "The café displays a reproduction of the famous painting.",
    "咖啡馆展示着那幅名画的一件复制品。",
    "This reproduction costs much less than the original.",
    "这件复制品比原作便宜很多。"
  ],
  [
    "cylinder",
    "名词 · 圆柱体",
    "cylinder 的常见几何义是圆柱体，可数；具体机械语境也可指气缸，此处仅描述物体形状。",
    "The child rolled a wooden cylinder across the table.",
    "孩子把木制圆柱体沿桌面滚过去。",
    "Draw a cylinder beside the cube on your worksheet.",
    "在练习纸上的立方体旁画一个圆柱体。"
  ],
  [
    "managerial",
    "形容词 · 管理方面的",
    "managerial 描述经理职责或组织管理相关的技能、经验和岗位；不直接表示管理水平一定优秀。",
    "The course develops managerial skills through practical projects.",
    "课程通过实践项目培养管理技能。",
    "She moved into a managerial role after five years.",
    "五年后她转到管理岗位。"
  ],
  [
    "reactor",
    "名词 · 核反应堆",
    "reactor 可指控制释放核能的设备，nuclear reactor 明确其类别；也有化学反应器义，须由领域判断。",
    "The model shows the main parts of a nuclear reactor.",
    "模型展示核反应堆的主要部分。",
    "Engineers shut down the reactor for a scheduled inspection.",
    "工程师按计划关闭反应堆进行检查。"
  ],
  [
    "scrutiny",
    "名词 · 仔细审查",
    "scrutiny 指认真细致的检查或审视，常作不可数名词；under scrutiny 表示正受到审查，不等于已判定有错。",
    "The proposed budget came under close scrutiny.",
    "拟议预算受到仔细审查。",
    "Careful scrutiny revealed several gaps in the records.",
    "仔细审查发现记录有几处空缺。"
  ]
];
const october24SecondRows = [
  [
    "complication",
    "名词 · 意外难题",
    "complication 可指使原有计划更难实施的额外因素，通常可数；不只用于医学并发症，也可说旅行或工作中的麻烦。",
    "A broken lift added another complication to the move.",
    "坏电梯给搬家又添了一项难题。",
    "We solved the complication without changing the main plan.",
    "我们解决了这项难题，没有改变主要计划。"
  ],
  [
    "pal",
    "名词 · 好友",
    "pal 表示亲近的朋友，语气比较随意；a school pal 可指学生时代的朋友，不适合所有正式关系称谓。",
    "An old pal joined us for lunch at the harbour.",
    "一位老朋友到港口和我们一起吃午饭。",
    "My cycling pal knows every path in this valley.",
    "我的骑行好友熟悉山谷里的每条小路。"
  ],
  [
    "disagreement",
    "名词 · 分歧",
    "disagreement 可指意见不一致的状态或一次争执，about 常引出议题；有分歧不一定已发展为激烈争吵。",
    "A disagreement about the route delayed our departure.",
    "关于路线的分歧耽误了我们出发。",
    "They settled their disagreement before the next rehearsal.",
    "他们在下次排练前解决了分歧。"
  ],
  [
    "exile",
    "名词 · 流亡",
    "exile 可指被迫或自愿离乡的状态、时期，常说 in exile；不能把每次普通出国旅行都称为流亡。",
    "The poet wrote these letters while living in exile.",
    "诗人在流亡期间写了这些信。",
    "Years of exile changed his understanding of home.",
    "多年流亡改变了他对家的理解。"
  ],
  [
    "valve",
    "名词 · 阀门",
    "valve 的机械义指控制流体通过管道等的阀门，通常可数；转动或关闭阀门不等于把整条管道移动。",
    "Close the valve before removing the damaged pipe.",
    "拆下损坏管道前先关阀门。",
    "The technician replaced a leaking valve near the pump.",
    "技术员更换了水泵附近一个漏水的阀门。"
  ],
  [
    "predominantly",
    "副词 · 主要地",
    "predominantly 表示在数量或程度上大部分如此，可修饰形容词或分词；表示主要而非全部，仍允许少量例外。",
    "The village is predominantly agricultural.",
    "这个村庄主要从事农业。",
    "The exhibition features work made predominantly from recycled paper.",
    "展览展示主要以再生纸制作的作品。"
  ],
  [
    "causal",
    "形容词 · 因果的",
    "causal 表示涉及原因或因果联系，常修饰 link 或 relationship；注意词序与 casual 休闲的不同。",
    "The study did not establish a causal link between the two changes.",
    "研究未确立两种变化之间的因果联系。",
    "We need stronger evidence for this causal explanation.",
    "这个因果解释需要更有力的证据。"
  ],
  [
    "confidential",
    "形容词 · 保密的",
    "confidential 表示信息只供特定人员使用，keep something confidential 是保密；与表示自信的 confident 不同。",
    "Please keep the interview notes confidential.",
    "请对访谈笔记保密。",
    "The envelope contains confidential information about the project.",
    "信封里有项目的保密信息。"
  ],
  [
    "salvation",
    "名词 · 解救办法",
    "salvation 除宗教救赎外，可比喻使人免于失败或困境的帮助；常整体使用，不限于身体遇险时的救援。",
    "The unexpected order proved to be the workshop's salvation.",
    "意外订单成了挽救工坊的关键。",
    "For the stranded hikers, the little shelter offered salvation.",
    "对受困徒步者来说，小避难所带来了生机。"
  ],
  [
    "warrant",
    "名词 · 搜查或拘捕令",
    "warrant 的司法义指授权执行搜查、拘捕等行为的正式命令，可数；a search warrant 明确是搜查令而非私人许可。",
    "The officer showed a search warrant at the door.",
    "警员在门口出示了搜查令。",
    "The judge signed the warrant that afternoon.",
    "法官当天下午签署了那份令状。"
  ],
  [
    "grim",
    "形容词 · 严峻或令人忧虑的",
    "grim 可描述让人沉重、不乐观的情况或消息；并非所有不愉快都同样严重，需由事件语境确定语气。",
    "The report paints a grim picture of the town's water supply.",
    "报告描绘了小镇供水的严峻状况。",
    "After three failed harvests, the outlook was grim.",
    "连续三季收成失败后，前景令人忧虑。"
  ],
  [
    "optimism",
    "名词 · 乐观",
    "optimism 指相信结果可能良好的态度，通常不可数；optimism about 后接看好的事情，不等于结果已得到保证。",
    "Her optimism about the restoration encouraged the volunteers.",
    "她对修复工作的乐观态度鼓舞了志愿者。",
    "There was cautious optimism after the first successful trial.",
    "首次试验成功后，人们表现出谨慎乐观。"
  ],
  [
    "fulfill",
    "动词 · 履行或满足",
    "fulfill 是及物动词，常直接接承诺、要求或订单；英国英语也常拼 fulfil，过去式均保留双 l。",
    "We must fulfill every condition before opening the centre.",
    "我们必须满足全部条件才能开放中心。",
    "She worked hard to fulfill her promise to the village.",
    "她努力兑现对村庄的承诺。"
  ],
  [
    "sniff",
    "动词 · 嗅闻",
    "sniff 表示通过鼻子吸气闻气味，可用 sniff at 引出对象；与普通呼吸相比通常强调短促、有目的的吸鼻动作。",
    "The dog stopped to sniff at a discarded glove.",
    "狗停下来嗅一只丢弃的手套。",
    "He leaned closer to sniff at the unfamiliar herb.",
    "他凑近去闻那种不熟悉的香草。"
  ],
  [
    "decree",
    "名词 · 法令",
    "decree 是通常具有法律效力的正式命令，可数；by decree 表示通过法令，不是一般口头建议或邀请。",
    "A royal decree opened the forest to public use.",
    "一道王室法令向公众开放了森林。",
    "The decree changed the rules for trading at the harbour.",
    "法令改变了港口贸易规则。"
  ],
  [
    "coincidence",
    "名词 · 巧合",
    "coincidence 可指看似有关而偶然同时发生的事，by coincidence 表示碰巧；时间相近本身不证明存在因果。",
    "By coincidence, we booked rooms on the same floor.",
    "碰巧我们订了同一楼层的房间。",
    "Their matching birthdays were a pleasant coincidence.",
    "他们生日相同，是个愉快的巧合。"
  ],
  [
    "promptly",
    "副词 · 及时地",
    "promptly 可表示不拖延地行动，也可表示按时；这里修饰回复或处理动作，强调收到事情后迅速响应。",
    "The caretaker promptly removed the broken glass.",
    "管理员及时清走了碎玻璃。",
    "She replied promptly to our request for directions.",
    "她迅速回复了我们问路的请求。"
  ],
  [
    "melody",
    "名词 · 旋律",
    "melody 指按节奏组织起来的音高序列，通常可数；不是指歌词文字，也不等于同时发声形成的全部和声。",
    "He played a gentle melody on the old violin.",
    "他用旧小提琴奏出柔和的旋律。",
    "The melody stayed in my mind throughout the journey.",
    "整个旅途中，那段旋律都萦绕在我脑海。"
  ],
  [
    "evenly",
    "副词 · 均匀地",
    "evenly 描述分布、变化或动作在各处保持一致；spread evenly 强调涂抹均匀，不仅指表面最终平整。",
    "Spread the seeds evenly over the prepared soil.",
    "把种子均匀撒在备好的土上。",
    "The oven heats the bread evenly on both sides.",
    "烤箱把面包两面均匀加热。"
  ],
  [
    "principally",
    "副词 · 主要地",
    "principally 表示主要或最重要的部分，常修饰目的、原因或构成；不是表示原则上，须与 in principle 分清。",
    "The hall is used principally for community meetings.",
    "大厅主要用于社区会议。",
    "She chose the village principally because of its quiet location.",
    "她选择这个村庄主要是因为位置安静。"
  ],
  [
    "nun",
    "名词 · 修女",
    "nun 指属于宗教修会的女性成员，通常可数；这是宗教身份名称，不等于任何在教会工作的女性。",
    "A nun showed us the convent's herb garden.",
    "一位修女带我们参观修道院的香草园。",
    "The diary belonged to a nun who taught at the village school.",
    "日记属于一位曾在村校任教的修女。"
  ],
  [
    "monarch",
    "名词 · 君主",
    "monarch 指国王、女王等君主，可数且不限男性；是否拥有实际统治权，要根据该国制度理解。",
    "The monarch opened the new parliament building.",
    "君主为新的议会大楼揭幕。",
    "The portrait shows a young monarch beside a globe.",
    "肖像画中一位年轻君主站在地球仪旁。"
  ],
  [
    "chord",
    "名词 · 和弦",
    "chord 的音乐义指三个或更多音同时发声形成的和弦，通常可数；别与表示绳子的同音词 cord 混写。",
    "The pianist held the final chord for several seconds.",
    "钢琴家把最后一个和弦保持了几秒。",
    "Try a softer chord at the end of this phrase.",
    "在这乐句结尾试用一个更柔和的和弦。"
  ],
  [
    "supplementary",
    "形容词 · 补充的",
    "supplementary 表示增添到主要内容上起补充作用，常修饰材料、信息；通常不是取代原来的主体内容。",
    "The teacher posted supplementary exercises after class.",
    "老师课后发布了补充练习。",
    "A supplementary map explains the walking routes in greater detail.",
    "一张补充地图更详细地说明了步行路线。"
  ],
  [
    "bourgeois",
    "形容词 · 中产阶级的",
    "bourgeois 可描述中产阶级的社会背景，也有带贬义的物质观念义；这里限阶层相关描述，不预设贬义。",
    "The novel follows a bourgeois family through a period of change.",
    "小说讲述一个中产家庭在变革时期的经历。",
    "The exhibition explores bourgeois life in nineteenth-century towns.",
    "展览探讨十九世纪城镇中产阶级的生活。"
  ],
  [
    "intriguing",
    "形容词 · 引人好奇的",
    "intriguing 描述明显吸引兴趣、让人想探究的事物；人的感受可用 intrigued，不将两种分词形容词互换。",
    "An intriguing mark appeared beneath the old signature.",
    "旧签名下方出现了一个引人好奇的记号。",
    "She raised an intriguing question about the map's origin.",
    "她就地图来源提出了一个耐人寻味的问题。"
  ],
  [
    "vicious",
    "形容词 · 凶猛或暴烈的",
    "vicious 可描述危险的攻击性或激烈暴力行为，语气很强；不是只表示竞争积极或一般不友好的样子。",
    "A vicious fight broke out behind the stadium.",
    "体育场后面爆发了一场凶狠的打斗。",
    "The keeper warned us about the vicious animal in the enclosure.",
    "饲养员提醒我们注意围栏内那只凶猛的动物。"
  ],
  [
    "ponder",
    "动词 · 仔细考虑",
    "ponder 可直接接需要思索的事情，也可用 ponder over；通常带安静、认真思考的意味，不一定马上得出答案。",
    "We paused to ponder the strange message on the wall.",
    "我们停下来思索墙上奇怪的信息。",
    "She will ponder the offer during her journey home.",
    "她会在回家路上仔细考虑这个提议。"
  ],
  [
    "tuna",
    "名词 · 金枪鱼肉",
    "tuna 可指金枪鱼，也可指作为食材的鱼肉；这里按食材整体表达，不用 a tuna 指一小份鱼肉。",
    "The salad contains tuna and fresh white beans.",
    "沙拉里有金枪鱼肉和新鲜白豆。",
    "He chose grilled tuna with a lemon dressing.",
    "他选了配柠檬调味汁的烤金枪鱼肉。"
  ],
  [
    "dentist",
    "名词 · 牙医",
    "dentist 指受训从事牙齿护理、治疗等工作的专业人员，可数；see a dentist 表示看牙医，不是看普通任意医生。",
    "The dentist examined the tooth under a bright lamp.",
    "牙医在明亮灯光下检查了那颗牙。",
    "I made an appointment with a dentist near the station.",
    "我预约了车站附近的一位牙医。"
  ],
  [
    "reunion",
    "名词 · 重聚",
    "reunion 指分离后再相聚，也可指同学或家族聚会，通常可数；不只是任何第一次见面的普通会议。",
    "The cousins planned a reunion at their childhood home.",
    "表亲们计划在童年故居重聚。",
    "Their reunion after twenty years was unexpectedly quiet.",
    "二十年后的重聚出乎意料地平静。"
  ],
  [
    "perch",
    "名词 · 鸟类栖木",
    "perch 可指鸟停落、栖息的横杆或位置，通常可数；这里不是同形的鲈鱼义，也不是动作的动词用法。",
    "The parrot moved to a higher perch inside the cage.",
    "鹦鹉移到了笼内较高的栖木上。",
    "A branch above the pond made a perfect perch for the kingfisher.",
    "池塘上方的树枝成了翠鸟理想的栖息处。"
  ],
  [
    "beneficiary",
    "名词 · 受益者",
    "beneficiary 指从某项安排获得帮助或利益的人或机构，可数；一般受益义不限于遗嘱或保险指定对象。",
    "The village school was the main beneficiary of the concert.",
    "村校是这场音乐会的主要受益方。",
    "Each beneficiary received a new set of gardening tools.",
    "每位受益者都得到一套新园艺工具。"
  ],
  [
    "bacon",
    "名词 · 培根",
    "bacon 通常指腌熏后切片的肉，食材义常不可数；数片数可用 slices of bacon，不直接套用 a bacon。",
    "She chopped the bacon before adding it to the pan.",
    "她把培根切碎后加进锅里。",
    "Two slices of bacon were left on the plate.",
    "盘里还剩两片培根。"
  ],
  [
    "prose",
    "名词 · 散文体",
    "prose 指区别于诗歌韵文的普通行文形式，通常不可数；小说、文章等都可用散文体，不只限中文的抒情散文。",
    "Her prose is clear even when the subject is complex.",
    "即使主题复杂，她的行文仍很清楚。",
    "The poet also wrote short pieces of prose for children.",
    "这位诗人也为儿童写短篇散文作品。"
  ],
  [
    "pumpkin",
    "名词 · 南瓜",
    "pumpkin 可指整只南瓜，也可整体指作食材的南瓜；一整只用 a pumpkin，切碎配料时可不加冠词。",
    "A pumpkin grew beside the compost heap.",
    "堆肥堆旁长出了一只南瓜。",
    "We roasted pumpkin with a little oil and salt.",
    "我们用少许油盐烤了南瓜。"
  ],
  [
    "roam",
    "动词 · 漫游",
    "roam 表示在一片区域自由走动，可直接接区域，也可接 around；不强调按固定路线去一个明确终点。",
    "We spent the morning free to roam the old market.",
    "整个上午我们都可以自由逛老集市。",
    "Deer roam across the open fields at dusk.",
    "黄昏时鹿在开阔田野上游荡。"
  ],
  [
    "fixture",
    "名词 · 固定装置",
    "fixture 的建筑义指安装或附着在建筑上的设备、部件，可数；light fixture 是灯具装置，不只是一只可更换的灯泡。",
    "The electrician installed a new light fixture above the table.",
    "电工在桌子上方装了新的灯具。",
    "This brass fixture has remained in the hallway for decades.",
    "这件黄铜固定装置在走廊里已有几十年。"
  ],
  [
    "hose",
    "名词 · 软管",
    "hose 可指输送水或其他流体的柔性管道，可数；garden hose 是花园水管，别与同音的 hoes 锄头混写。",
    "A long hose connects the tank to the outdoor tap.",
    "一根长软管把水箱接到室外水龙头。",
    "She rolled up the hose after watering the seedlings.",
    "她浇完幼苗后把软管卷了起来。"
  ],
  [
    "quantitative",
    "形容词 · 定量的",
    "quantitative 描述以数量、数值或测量为基础的研究信息；和侧重性质、特征的 qualitative 不同。",
    "The survey provides quantitative data on travel habits.",
    "调查提供了出行习惯的定量数据。",
    "We need a quantitative comparison of the two methods.",
    "我们需要对两种方法进行定量比较。"
  ],
  [
    "token",
    "名词 · 代币",
    "token 可指按特定规则代替钱币使用的筹码或代币，可数；使用范围取决于发行安排，不等于通行的法定货币。",
    "Insert a token to open the locker.",
    "投入一枚代币打开储物柜。",
    "Each child received a token for the small fairground ride.",
    "每个孩子得到一枚用于游乐场小设施的代币。"
  ],
  [
    "invaluable",
    "形容词 · 极其宝贵的",
    "invaluable 表示价值极高、难以估量，不是没有价值；常修饰帮助、经验等，对象也不必是可出售的东西。",
    "Her local knowledge was invaluable during the search.",
    "她对当地的了解在搜寻中非常宝贵。",
    "The diary provides invaluable details about everyday village life.",
    "日记提供了关于乡村日常生活的珍贵细节。"
  ],
  [
    "preside",
    "动词 · 主持",
    "preside 常用 preside over 表示主持会议或掌管活动，是不及物动词；不要把会议直接当作宾语省掉 over。",
    "The deputy will preside over the meeting tomorrow.",
    "副手将主持明天的会议。",
    "She agreed to preside over the awards ceremony.",
    "她同意主持颁奖典礼。"
  ],
  [
    "allegiance",
    "名词 · 效忠或忠诚",
    "allegiance 表示对人、团体或事业的忠诚，常用 to 引出对象；可以描述政治效忠，也不局限于国家关系。",
    "His allegiance to the club never weakened.",
    "他对俱乐部的忠诚从未减弱。",
    "The novel tests the hero's allegiance to his childhood friend.",
    "小说考验了主人公对童年好友的忠诚。"
  ],
  [
    "deviation",
    "名词 · 偏差",
    "deviation 在统计语境可指一个数值与参照值的差，常用 from 说明基准；这里不是评价人的行为是否合群。",
    "Calculate the deviation of each reading from the average.",
    "计算每个读数相对于平均值的偏差。",
    "A large deviation prompted us to check the instrument again.",
    "很大的偏差促使我们再次检查仪器。"
  ],
  [
    "grove",
    "名词 · 小树林",
    "grove 可指一小片树林，也常用于按一定范围种植的果树林，可数；不应把每一棵单独的树都叫 a grove。",
    "A narrow path leads through the olive grove.",
    "一条窄路穿过橄榄林。",
    "We rested in a small grove above the village.",
    "我们在村庄上方的一片小树林里休息。"
  ],
  [
    "underwear",
    "名词 · 内衣",
    "underwear 指贴身穿在其他衣服里面的衣物，通常整体使用；不能直接用 an underwear 来数一件，需说 an item of underwear。",
    "Pack enough clean underwear for the whole trip.",
    "带够整个旅程所需的干净内衣。",
    "The shop sells cotton underwear in several sizes.",
    "商店出售多种尺码的棉质内衣。"
  ],
  [
    "retention",
    "名词 · 记忆保持",
    "retention 的记忆义表示学过或经历过的内容在脑中留存，通常不可数；memory retention 不是一次新的学习动作本身。",
    "Short reviews helped improve retention of the new vocabulary.",
    "简短复习有助于增强新词记忆保持。",
    "The study measures retention a week after each lesson.",
    "研究测量每节课一周后的记忆保持情况。"
  ],
  [
    "brace",
    "动词 · 做好承受准备",
    "brace oneself for 表示为冲击、困难等做好准备，常用反身代词；for 后接要面对的事情，不是说明准备发生的时间。",
    "Brace yourself for a difficult conversation this afternoon.",
    "做好准备，迎接今天下午的一场艰难谈话。",
    "We had time to brace ourselves before the wave struck.",
    "海浪打来前，我们来得及做好承受准备。"
  ],
  [
    "rigorous",
    "形容词 · 严密的",
    "rigorous 可描述检查、推理等精确严密，强调认真遵守标准；不是简单说花的时间长或态度看起来严肃。",
    "The bridge design underwent a rigorous safety review.",
    "桥梁设计经过了严密的安全审查。",
    "We need rigorous evidence before accepting this explanation.",
    "接受这个解释前，我们需要严谨的证据。"
  ],
  [
    "enclosure",
    "名词 · 随函附件",
    "enclosure 在信件语境指装在信封里随信附送的材料，可数；电子邮件附件更常叫 attachment，不能只按中文附件混用。",
    "The letter mentions a map as an enclosure.",
    "信中提到随函附有一张地图。",
    "Please check that every enclosure is inside the envelope.",
    "请检查每份随函材料都已放进信封。"
  ],
  [
    "verge",
    "名词 · 某事将发生的边缘",
    "verge 常在 on the verge of 中比喻即将进入某状态，of 后接名词或动名词；不是已经彻底完成的意思。",
    "The team was on the verge of giving up when help arrived.",
    "帮助到来时，队伍几乎要放弃了。",
    "The old theatre stood on the verge of closure.",
    "老剧院濒临关闭。"
  ],
  [
    "transcend",
    "动词 · 超越",
    "transcend 是及物动词，直接接界限、差异等对象，表示越过其限制；不必在宾语前额外加 beyond。",
    "Their friendship can transcend differences in language.",
    "他们的友谊能超越语言差异。",
    "The exhibition aims to transcend traditional boundaries between art and science.",
    "展览旨在超越艺术与科学之间的传统界限。"
  ],
  [
    "eruption",
    "名词 · 火山喷发",
    "eruption 可指火山喷发这一事件，通常可数；volcanic eruption 明确自然现象义，不是皮肤出疹的另一义。",
    "The eruption covered nearby fields with ash.",
    "火山喷发使附近田地覆满灰。",
    "Villagers returned years after the last volcanic eruption.",
    "上次火山喷发多年后，村民才返回。"
  ],
  [
    "composite",
    "形容词 · 由多部分合成的",
    "composite 表示由不同部分组合构成，可描述照片、材料或图像；组合而成不必然表示质量低或是不真实的信息。",
    "The artist made a composite image from six photographs.",
    "艺术家用六张照片合成了一幅图像。",
    "The panel uses a light composite material.",
    "这块面板使用轻质复合材料。"
  ],
  [
    "siren",
    "名词 · 警报器",
    "siren 的设备义指发出尖锐警示声的装置，可数；an ambulance siren 是救护车警笛，不同于普通说话的扬声器。",
    "A siren sounded as the rescue boat left the harbour.",
    "救援船驶离港口时响起警报声。",
    "The workers tested the emergency siren before opening the site.",
    "工人在开放场地前测试了紧急警报器。"
  ],
  [
    "aerospace",
    "形容词 · 航空航天的",
    "aerospace 作形容词修饰与大气层及外层空间飞行、飞行器有关的行业或研究；范围包含航空和航天，不只指民航。",
    "She studies aerospace engineering at university.",
    "她在大学学习航空航天工程。",
    "The museum has a room devoted to aerospace research.",
    "博物馆有一间专门介绍航空航天研究的展厅。"
  ],
  [
    "dubious",
    "形容词 · 怀疑的",
    "dubious 描述人对某事拿不准或持怀疑态度，常用 about；此时是人的判断状态，不直接断言提议必定违法。",
    "I remain dubious about the promised delivery date.",
    "我对承诺的交货日期仍有疑虑。",
    "She looked dubious when we explained the shortcut.",
    "我们解释捷径时，她显得半信半疑。"
  ],
  [
    "clown",
    "名词 · 小丑演员",
    "clown 可指以滑稽动作、服饰逗乐观众的演员，可数；这里限表演职业义，不把称别人愚蠢的骂人用法混入。",
    "The clown balanced a plate on a narrow stick.",
    "小丑演员把盘子平衡在细棍上。",
    "A young clown greeted the audience outside the tent.",
    "一位年轻小丑演员在帐篷外迎接观众。"
  ],
  [
    "pathetic",
    "形容词 · 差劲得可怜的",
    "pathetic 可强烈批评表现或借口差得可怜、不够格；这种用法并非单纯同情，语气常比 weak 更尖锐。",
    "His pathetic excuse failed to explain the missing tools.",
    "他蹩脚的借口没能解释工具失踪。",
    "The team's first attempt was pathetic compared with their later work.",
    "和后来作品相比，团队首次尝试差得可怜。"
  ],
  [
    "immunity",
    "名词 · 豁免权",
    "immunity 的法律义是免于某项义务或责任的地位，常用 immunity from；并非指免疫系统，也不表示一般许可。",
    "The agreement offered immunity from prosecution to the witness.",
    "协议向证人提供了免于起诉的豁免。",
    "The court examined whether the official had immunity.",
    "法院审查该官员是否拥有豁免权。"
  ],
  [
    "shipment",
    "名词 · 一批货物",
    "shipment 可指运送出去的一批货物，通常可数；a shipment of 后接货物内容，而 ready for shipment 中表示运输过程。",
    "The latest shipment of tiles arrived in two wooden crates.",
    "最新一批瓷砖装在两个木箱里送达。",
    "A damaged label delayed the shipment at the depot.",
    "破损的标签让这批货滞留在仓库。"
  ],
  [
    "suffice",
    "动词 · 足够",
    "suffice 可不及物表示满足需要，常见 will suffice；主语是足够的数量或办法，不需要额外加 be 来表达动作。",
    "A short handwritten note will suffice for this request.",
    "这个请求用一张简短手写便条就够了。",
    "Two large tables should suffice for the display.",
    "两张大桌子应该足够展示使用。"
  ],
  [
    "systematically",
    "副词 · 有系统地",
    "systematically 修饰按明确顺序、方法开展的动作；强调有组织的步骤，不单指动作重复很多次或速度很快。",
    "The volunteers searched the building systematically, room by room.",
    "志愿者逐个房间有系统地搜查了建筑。",
    "She systematically compared each entry with the original ledger.",
    "她按顺序把每条记录与原始账簿对照。"
  ],
  [
    "hurl",
    "动词 · 用力投掷",
    "hurl 作及物动词表示猛力抛出某物，常接方向；语气比普通 throw 更强，不能用来描述轻轻递交。",
    "Do not hurl stones towards the abandoned greenhouse.",
    "不要朝废弃温室猛扔石头。",
    "The waves could hurl loose timber against the harbour wall.",
    "海浪可能把散落木料猛撞向港墙。"
  ],
  [
    "halve",
    "动词 · 减半或分成两半",
    "halve 是动词，可把数量减为一半或把东西等分；half 是常用名词、形容词形式，不要漏写动词中的 v。",
    "The new route could halve our travel time.",
    "新路线可能使出行时间减半。",
    "Halve the tomatoes before placing them on the tray.",
    "把番茄切成两半再放到托盘上。"
  ],
  [
    "appealing",
    "形容词 · 有吸引力的",
    "appealing 描述让人感兴趣或喜爱的事物，常用 appealing to 说明对谁有吸引力；并不等于在作法律上诉。",
    "The bright kitchen made the small flat more appealing.",
    "明亮的厨房让小公寓更有吸引力。",
    "This quieter route is especially appealing to families.",
    "这条较安静的路线对家庭游客特别有吸引力。"
  ],
  [
    "postal",
    "形容词 · 邮政的",
    "postal 描述与邮件、邮局有关的服务、费用等，放在名词前修饰；不是普通职位或岗位的形容词。",
    "The island relies on a weekly postal service.",
    "岛上依靠每周一次的邮政服务。",
    "Please write the postal code clearly on the envelope.",
    "请把邮政编码清楚写在信封上。"
  ],
  [
    "qualitative",
    "形容词 · 定性的",
    "qualitative 描述性质、类别或特征方面的分析，常与 quantitative 定量的比较；并非单纯表示质量优秀。",
    "The interviews provide qualitative evidence about village life.",
    "访谈为乡村生活提供了定性证据。",
    "The report combines qualitative descriptions with numerical results.",
    "报告把定性描述与数值结果结合。"
  ],
  [
    "equate",
    "动词 · 等同",
    "equate A with B 表示把两者视为相同或相当；这种看法本身可能合理也可能不合理，不能省略连接两方的 with。",
    "Do not equate a quiet manner with a lack of confidence.",
    "不要把安静的举止等同于缺乏自信。",
    "They equate success with the number of shops they open.",
    "他们把成功等同于开店数量。"
  ],
  [
    "groove",
    "名词 · 凹槽",
    "groove 的物体形态义指狭长的沟槽，通常可数；区别于 grove 小树林，后者词中少一个 o。",
    "A shallow groove runs along the edge of the frame.",
    "框架边缘有一道浅槽。",
    "Fit the wooden panel into the groove carefully.",
    "小心把木板嵌进凹槽。"
  ],
  [
    "scarlet",
    "形容词 · 鲜红的",
    "scarlet 表示鲜艳的红色，可修饰衣物、花等，也可作表语；这里限颜色义，不采用道德评价的旧用法。",
    "She tied a scarlet ribbon around the parcel.",
    "她在包裹上系了一条鲜红丝带。",
    "The autumn leaves turned scarlet beside the stream.",
    "溪旁的秋叶变得鲜红。"
  ],
  [
    "terminology",
    "名词 · 术语体系",
    "terminology 指某一学科、职业所用的专门词汇，通常整体使用；a term 才指单个术语，不把一个词叫 a terminology。",
    "The guide explains the terminology used in traditional weaving.",
    "指南解释了传统编织使用的术语。",
    "New staff need time to learn the workshop's technical terminology.",
    "新员工需要时间熟悉工坊的技术术语。"
  ],
  [
    "seam",
    "名词 · 缝合线",
    "seam 可指两块布料缝在一起的接合处，通常可数；不是衣服上每条装饰线，也别与同音词 seem 混写。",
    "The seam along the sleeve had come apart.",
    "袖子上的接缝裂开了。",
    "She pressed the seam flat before sewing the next piece.",
    "她缝下一块布前先把接缝熨平。"
  ],
  [
    "fort",
    "名词 · 堡垒",
    "fort 通常指设防的军事据点或堡垒，可数；与普通豪华住宅不同，其意义重点在防御和驻守用途。",
    "The old fort guards the entrance to the valley.",
    "古堡扼守着山谷入口。",
    "A path circles the ruined fort above the harbour.",
    "一条小路环绕着港口上方的堡垒遗址。"
  ],
  [
    "induction",
    "名词 · 归纳推理",
    "induction 的逻辑义是由个别实例形成一般结论的推理；和由一般规则推出个别结果的 deduction 应分清。",
    "The philosopher explains induction through a series of observations.",
    "哲学家用一系列观察解释归纳推理。",
    "Induction can suggest a pattern without proving it universally true.",
    "归纳能提示规律，却不能证明它普遍成立。"
  ],
  [
    "intricate",
    "形容词 · 错综复杂的",
    "intricate 强调许多细节彼此关联，常描述图案、机械或情节；不只是总体体积大，也不必然表示设计有问题。",
    "The screen is covered with an intricate pattern of leaves.",
    "屏风上满是错综细密的叶子图案。",
    "We followed the intricate plot with the help of a character chart.",
    "我们借助人物关系图理解复杂情节。"
  ],
  [
    "burglar",
    "名词 · 入室盗贼",
    "burglar 指非法进入建筑以实施盗窃等犯罪的人，通常可数；与公开威胁受害者抢财物的 robber 用法不完全相同。",
    "The burglar entered the empty shop through a rear window.",
    "入室盗贼从后窗进入空商店。",
    "A neighbour spotted the burglar leaving with a heavy bag.",
    "邻居看见盗贼提着重袋子离开。"
  ],
  [
    "numerical",
    "形容词 · 数字的",
    "numerical 表示与数有关或用数字表达的，可修饰代码、结果和排序；numerical order 是按数值顺序而非按字母。",
    "Each parcel received a numerical code at the depot.",
    "每个包裹在仓库都得到一个数字代码。",
    "The report includes a numerical summary of the survey.",
    "报告包括调查的数值摘要。"
  ],
  [
    "dispatch",
    "动词 · 派遣或发送",
    "dispatch 是及物动词，强调迅速发送货物、消息或派人执行事务；可用 to 说明目的地，语气较正式。",
    "The station will dispatch a repair team before dawn.",
    "站点将在黎明前派出维修队。",
    "Please dispatch the replacement parts to our workshop today.",
    "请今天把替换零件发到我们工坊。"
  ],
  [
    "ignite",
    "动词 · 点燃",
    "ignite 是较正式的点燃或使燃料燃烧，可直接接燃料；这里采用物理燃烧义，不把所有心理激动都称为着火。",
    "A single spark could ignite the dry grass.",
    "一点火星就可能点燃干草。",
    "The device uses electricity to ignite the gas.",
    "装置用电点燃气体。"
  ],
  [
    "doom",
    "名词 · 毁灭的命运",
    "doom 可指悲惨结局或毁灭，通常整体表达；a sense of doom 是对坏结局的预感，不说明事情已实际结束。",
    "A sense of doom spread through the crew as the water rose.",
    "水位上涨时，灾难将临的感觉在船员中蔓延。",
    "The neglected repairs spelled doom for the old ferry service.",
    "失修预示着老渡运服务的终结。"
  ],
  [
    "scrub",
    "动词 · 用力擦洗",
    "scrub 表示用刷子等来回用力清洗，可直接接待清洁表面；不是只用水轻轻冲一下，过去式须双写 b。",
    "Scrub the muddy boots before bringing them inside.",
    "把沾泥的靴子刷干净再拿进屋。",
    "We need to scrub the kitchen floor after the event.",
    "活动结束后我们需要用力刷洗厨房地板。"
  ],
  [
    "avert",
    "动词 · 避免发生",
    "avert 可指预见并阻止灾难、危机等发生，直接接不良事件；不是在事件发生后把后果简单遮住。",
    "Quick repairs helped avert a serious flood in the basement.",
    "及时修理帮助避免了地下室严重进水。",
    "The two sides met in an effort to avert a strike.",
    "双方会面，试图避免罢工。"
  ],
  [
    "shorten",
    "动词 · 缩短",
    "shorten 可减少物体长度或事件持续时间，通常直接接对象；表示缩短到某长度可另加 to 引出结果。",
    "Could you shorten this strap by two centimetres?",
    "你能把这根带子缩短两厘米吗？",
    "The new bridge will shorten the journey between the villages.",
    "新桥将缩短两村之间的行程。"
  ],
  [
    "arrogant",
    "形容词 · 傲慢的",
    "arrogant 描述表现出自认为优越、轻视别人的态度；可以修饰人或言语，和正常自信不完全等同。",
    "His arrogant reply discouraged the younger volunteers.",
    "他傲慢的答复让年轻志愿者泄了气。",
    "The speaker sounded arrogant when he dismissed every question.",
    "发言者把每个问题都否定掉时显得很傲慢。"
  ],
  [
    "persuasion",
    "名词 · 说服",
    "persuasion 可指让别人接受某想法的过程，通常不可数；after some persuasion 表示经过劝说，不必含强迫意味。",
    "After some persuasion, she agreed to exhibit her sketches.",
    "经过一番劝说，她同意展出素描。",
    "The team relied on persuasion rather than threats.",
    "团队依靠劝说而非威胁。"
  ],
  [
    "wade",
    "动词 · 涉水行走",
    "wade 表示在浅水、泥等有阻力的介质中迈步，常用 through 或 across 说明路径；不是游泳或乘船。",
    "We had to wade through shallow water to reach the boat.",
    "我们得涉过浅水才能到船边。",
    "The children can wade near the bank while an adult watches.",
    "成人看护时，孩子们可以在岸边浅水中走动。"
  ],
  [
    "payoff",
    "名词 · 回报",
    "payoff 可指投入努力后得到的好处或成果，通常可数；不一定是金钱，也有其他义项，需按语境理解。",
    "The payoff for months of practice was a confident performance.",
    "数月练习的回报是一场自信的表演。",
    "Better soil was the main payoff from years of careful composting.",
    "多年认真堆肥的主要收获是更好的土壤。"
  ],
  [
    "obedience",
    "名词 · 服从",
    "obedience 指遵守命令或要求的状态，常作不可数名词；obedience to 后接被遵守的规则或权威，不直接接动词。",
    "The captain expected obedience to the safety rules.",
    "船长期望大家遵守安全规则。",
    "The story questions the value of unquestioning obedience.",
    "故事质疑不加思考的服从有何价值。"
  ],
  [
    "gutter",
    "名词 · 檐沟",
    "gutter 可指屋檐下收集和排走雨水的槽，通常可数；这里与路边排水沟相近但位置不同，不指室内水池。",
    "Leaves blocked the gutter above the porch.",
    "树叶堵住了门廊上方的檐沟。",
    "Water overflowed from a cracked gutter during the storm.",
    "暴雨中水从开裂的檐沟溢了出来。"
  ],
  [
    "infinitely",
    "副词 · 极其或大大地",
    "infinitely 除数学无穷义外，也可加强比较级表达差别极大；日常强调不必理解为已作精确无限量测量。",
    "The lighter bag made the climb infinitely easier.",
    "较轻的背包让攀登轻松了许多。",
    "A clear diagram is infinitely more useful than this blurred photograph.",
    "清晰图示比这张模糊照片有用得多。"
  ],
  [
    "dismay",
    "动词 · 使沮丧或不安",
    "dismay 的及物用法是使人丧失勇气、担忧或失望，直接接感受者；人的状态可用 dismayed，不把词性混同。",
    "The missing records could dismay anyone planning a careful restoration.",
    "记录缺失会让任何打算认真修复的人沮丧。",
    "These early setbacks need not dismay the whole team.",
    "这些早期挫折不必让全队灰心。"
  ],
  [
    "degradation",
    "名词 · 退化或恶化",
    "degradation 可指环境、质量等逐步下降，通常整体表达；此处强调变坏的过程，不是单次普通变化。",
    "The survey records the degradation of soil near the road.",
    "调查记录了道路附近土壤的退化。",
    "Careful storage can slow the degradation of old photographs.",
    "妥善保存能减缓旧照片的劣化。"
  ],
  [
    "irritate",
    "动词 · 惹恼",
    "irritate 的情绪义表示使别人不耐烦或恼怒，可直接接人；不要用 irritate 来直接表示自己已经烦躁的状态。",
    "Repeated interruptions began to irritate the presenter.",
    "反复打断开始让主讲人烦躁。",
    "The loud ticking may irritate visitors in the quiet room.",
    "安静房间里响亮的滴答声可能惹恼访客。"
  ],
  [
    "fortress",
    "名词 · 要塞",
    "fortress 指坚固设防的地点，尤指大型、长期使用的防御设施，通常可数；有时范围可包含一座城镇。",
    "The fortress stood on a ridge overlooking the sea.",
    "要塞坐落在俯瞰海面的山脊上。",
    "We entered the fortress through a narrow stone gateway.",
    "我们穿过狭窄石门进入要塞。"
  ],
  [
    "penetration",
    "名词 · 穿透深度",
    "penetration 可指某物进入另一物的深度，常整体使用；此处描述材料或光线的进入情况，不采用市场渗透义。",
    "The test measured the penetration of dye into the wood.",
    "试验测量了染料渗入木材的深度。",
    "Thick cloud reduced the penetration of sunlight into the water.",
    "厚云减少了阳光在水中的穿透深度。"
  ],
  [
    "convene",
    "动词 · 召开或召集",
    "convene 可及物表示召集会议，也可不及物表示成员集会；较正式，主语和是否接会议宾语决定具体结构。",
    "The director will convene a meeting to discuss the repairs.",
    "主管将召开会议讨论维修。",
    "The committee plans to convene again after the survey.",
    "委员会计划调查后再次开会。"
  ],
  [
    "walnut",
    "名词 · 核桃",
    "walnut 可指核桃坚果，也可指核桃树或木材；本条采用果实义，单个可用 a walnut，碎料可整体说 chopped walnut。",
    "She cracked a walnut and shared the kernel with me.",
    "她敲开一颗核桃，把核桃仁分给我。",
    "A walnut rolled from the bowl onto the floor.",
    "一颗核桃从碗里滚到地板上。"
  ],
  [
    "extraction",
    "名词 · 提取或取出",
    "extraction 表示把某物从原来位置取出的过程，常用 extraction of；对象不同可指原料提取或部件取出。",
    "The extraction of oil from these seeds requires a strong press.",
    "从这些种子提油需要有力的压榨机。",
    "The engineer supervised the extraction of the damaged bearing.",
    "工程师监督取出损坏的轴承。"
  ]
];
october24Rows.push(...october24SecondRows);
const october24ThirdRows = [
  [
    "chestnut",
    "名词 · 栗子",
    "chestnut 可指栗树及其果实，本条限可食的栗子义；单颗可用 a chestnut，不把所有叫马栗的果实也当作食物。",
    "She peeled a roasted chestnut beside the stove.",
    "她在炉旁剥开一颗烤栗子。",
    "A chestnut fell from the basket as he opened the door.",
    "他开门时一颗栗子从篮里掉出来。"
  ],
  [
    "astonishment",
    "名词 · 惊讶",
    "astonishment 表示强烈惊奇的状态，通常不可数；to someone's astonishment 表示令某人惊讶的是，后面常接出乎意料的事实。",
    "To our astonishment, the old clock began to strike.",
    "令我们惊讶的是，旧钟开始报时。",
    "She stared at the restored painting in astonishment.",
    "她惊讶地望着修复好的画。"
  ],
  [
    "cutter",
    "名词 · 切割工具",
    "cutter 可指进行切割的工具、机器或部件，通常可数；具体类型由 paper 等修饰词说明，不必只理解为剪刀。",
    "The paper cutter needs a new blade.",
    "切纸机需要新刀片。",
    "Use a round cutter to shape the biscuits.",
    "用圆形切模给饼干造型。"
  ],
  [
    "archaeology",
    "名词 · 考古学",
    "archaeology 是通过人类活动留下的物质遗存研究过去的学科，通常不可数；不是只收集古物，也不泛指恐龙研究。",
    "Her interest in archaeology began at a ruined village.",
    "她对考古学的兴趣始于一座村落遗址。",
    "The course introduces archaeology through pottery and stone tools.",
    "课程通过陶器和石器介绍考古学。"
  ],
  [
    "tremendous",
    "形容词 · 极大的",
    "tremendous 可表示数量、程度或力量非常大，常加强名词；在这种用法中不一定表示事情本身值得称赞。",
    "The restoration required a tremendous amount of patience.",
    "修复工作需要极大的耐心。",
    "A tremendous crash echoed from the empty warehouse.",
    "空仓库里传来巨大的撞击声。"
  ],
  [
    "commit",
    "动词 · 犯下",
    "commit 可直接接 crime 等不良行为，表示犯下或实施；不把这个搭配任意套到所有普通日常动作上。",
    "The investigators wanted to know who could commit such a crime.",
    "调查人员想知道谁会犯下这种罪行。",
    "He refused to commit a dishonest act to win the contract.",
    "他拒绝为拿到合同做不诚实的事。"
  ],
  [
    "mental",
    "形容词 · 思维或头脑的",
    "mental 可描述在头脑中进行的活动，mental calculation 是心算；与 physical 身体或实际操作的形成对照。",
    "Try a quick mental calculation before using the calculator.",
    "用计算器前先试着快速心算。",
    "The puzzle requires careful mental effort.",
    "这道谜题需要认真动脑。"
  ],
  [
    "anxious",
    "形容词 · 焦虑的",
    "anxious about 可说明担心的事情，anxious for 可表示为某人担心；不要把 anxious to do 的急切义强套到担忧语境。",
    "She felt anxious about the long journey alone.",
    "她对独自长途旅行感到不安。",
    "The anxious parents waited beside the station entrance.",
    "焦虑的父母在车站入口旁等候。"
  ],
  [
    "refinement",
    "名词 · 细节改进",
    "refinement 可指让设计或方法更完善的一项细微改进，通常可数；不是只用于描述人的教养或物质提纯。",
    "A small refinement made the handle easier to grip.",
    "一项小改进让手柄更好握。",
    "The final refinement removed an awkward step from the process.",
    "最后一处改进去掉了流程中一个别扭的步骤。"
  ],
  [
    "frustrate",
    "动词 · 使受挫或沮丧",
    "frustrate 是及物动词，可说阻碍计划或使人因进展不顺而沮丧；描述人的感受时常用 frustrated。",
    "Constant changes can frustrate even an experienced organiser.",
    "不断变动会让经验丰富的组织者也感到受挫。",
    "Missing parts continued to frustrate our efforts to repair the mill.",
    "零件缺失持续阻碍我们修好磨坊。"
  ],
  [
    "hurricane",
    "名词 · 飓风",
    "hurricane 指达到一定强度的热带气旋，常用于大西洋及东北太平洋；不是所有大风暴都能按此命名。",
    "The hurricane damaged the wooden pier near the village.",
    "飓风损坏了村庄附近的木码头。",
    "They moved the boats inland before the hurricane arrived.",
    "他们在飓风到来前把船移向内陆。"
  ],
  [
    "fore",
    "感叹词 · 当心来球",
    "fore 在高尔夫球场可作警告呼喊，提醒可能被球击中的人注意；此处是独立感叹词，不是表示四的 four。",
    "The golfer shouted \"fore\" when the ball flew towards the path.",
    "球飞向小路时，高尔夫球手大喊当心来球。",
    "A loud cry of \"fore\" made the walkers look up.",
    "一声响亮的当心来球让步行者抬头。"
  ],
  [
    "relief",
    "名词 · 缓解或宽慰",
    "relief 可表示痛苦、压力或忧虑减轻，通常不可数；with relief 描述如释重负的状态，不是主动放松的动词。",
    "We heard the news of their safe return with relief.",
    "听说他们平安归来，我们松了口气。",
    "The cool room offered welcome relief from the afternoon heat.",
    "凉爽房间令人欣慰地缓解了午后炎热。"
  ],
  [
    "meaty",
    "形容词 · 内容充实的",
    "meaty 可比喻内容丰富、值得深入思考，常修饰角色、讨论或材料；不表示这些内容真的含有肉类。",
    "The interview gave us plenty of meaty material for the article.",
    "访谈为文章提供了大量充实的素材。",
    "She enjoyed a meaty discussion about the town's future.",
    "她喜欢这场关于小镇未来的深入讨论。"
  ],
  [
    "contribute",
    "动词 · 贡献或捐助",
    "contribute something to 表示向共同目标提供时间、钱物等；也可不说具体资源，只用 contribute to 说明参与贡献。",
    "Each family will contribute a dish to the picnic.",
    "每家都将为野餐带一道菜。",
    "She hopes to contribute more time to the garden project.",
    "她希望为花园项目投入更多时间。"
  ],
  [
    "separation",
    "名词 · 分离",
    "separation 可指分开的过程或状态，常用 separation of 说明对象；本条不专指夫妻分居，需按上下文判断。",
    "The separation of paper and plastic makes recycling easier.",
    "纸和塑料分开使回收更方便。",
    "Their long separation ended when the ferry service resumed.",
    "渡轮恢复通航时，他们长久的分离结束了。"
  ],
  [
    "differ",
    "动词 · 不同",
    "differ 是不及物动词，用 differ from 比较对象、differ in 说明方面；不说 be differ 来代替不同。",
    "The two samples differ in colour but not in weight.",
    "两个样本颜色不同，重量相同。",
    "Opinions differ from one neighbourhood to another.",
    "不同街区的意见有所差异。"
  ],
  [
    "stress",
    "名词 · 压力",
    "stress 可指带来身心紧张的压力，通常不可数；under stress 表示承受压力，不能单凭词形当成正在强调某事的动词。",
    "The sudden move put extra stress on the family.",
    "突然搬家给这个家庭带来了额外压力。",
    "She found that a quiet walk helped reduce stress.",
    "她发现安静散步有助于减轻压力。"
  ],
  [
    "disturb",
    "动词 · 打扰或扰乱",
    "disturb 可直接接正在进行的活动、秩序或人，表示干扰；不需要额外用 to 来引出受到打扰的对象。",
    "Please do not disturb the rehearsal in the next room.",
    "请不要打扰隔壁的排练。",
    "Heavy vehicles could disturb the quiet of the old village.",
    "重型车辆可能扰乱古村的宁静。"
  ],
  [
    "applicant",
    "名词 · 申请人",
    "applicant 指正式提出申请的人，可用 applicant for 引出职位或机会；提出申请不等于已通过筛选或获录用。",
    "Each applicant received a copy of the interview schedule.",
    "每位申请人都收到了面试时间表。",
    "The first applicant for the position had experience at sea.",
    "该职位的首位申请人有海上工作经验。"
  ],
  [
    "yawn",
    "动词 · 打哈欠",
    "yawn 可不及物表示张口深呼吸的打哈欠动作，常与疲倦或无聊有关；不能只凭此动作断定某人不尊重听众。",
    "I began to yawn halfway through the late train journey.",
    "深夜火车行程过半时，我开始打哈欠。",
    "The tired children tried not to yawn during the speech.",
    "疲倦的孩子们讲话期间尽量忍住哈欠。"
  ],
  [
    "roughly",
    "副词 · 大约",
    "roughly 放在数字等前表示估算而非精确值，近似 about；此处不是描述粗暴对待或表面粗糙。",
    "The walk takes roughly forty minutes from the station.",
    "从车站步行大约需要四十分钟。",
    "Roughly half the volunteers had worked on the garden before.",
    "大约一半志愿者以前参与过花园工作。"
  ],
  [
    "signal",
    "名词 · 信号",
    "signal 可指传达通知或提示行动的声音、手势等，可数；give a signal 表示发信号，具体含义要由约定决定。",
    "A raised flag was the signal to begin loading.",
    "升起的旗子是开始装货的信号。",
    "We waited for a signal from the guide across the river.",
    "我们等待河对岸向导发出信号。"
  ],
  [
    "offend",
    "动词 · 引起不快",
    "offend 可不及物表示引起反感或恼怒；表达言语可能冒犯时不必把它等同触犯法律的另一义。",
    "The poster was withdrawn because its wording might offend.",
    "海报因措辞可能冒犯而被撤下。",
    "He chose his words carefully because he did not wish to offend.",
    "他谨慎措辞，因为不愿冒犯别人。"
  ],
  [
    "household",
    "名词 · 一户人家",
    "household 指住在同一住所、共同生活的人组成的一户，可数；不只看血缘，和作为建筑的 house 有区别。",
    "Each household received one recycling bin.",
    "每户都收到一个回收桶。",
    "The survey asked every household about its water use.",
    "调查询问每户的用水情况。"
  ],
  [
    "incident",
    "名词 · 事件或插曲",
    "incident 可指一件具体发生的事，常用于意外、尴尬或引起关注的插曲；不是只能描述重大国际事件。",
    "The guide recorded the incident in the daily log.",
    "向导把这件事记进了每日日志。",
    "A minor incident at the gate delayed the concert.",
    "入口处一个小插曲耽误了音乐会。"
  ],
  [
    "instinct",
    "名词 · 本能或直觉",
    "instinct 可指自然的冲动或不经推理的反应，by instinct 表示凭本能；不自动等同于经过验证的判断。",
    "Her first instinct was to protect the small child.",
    "她的第一反应是保护那个小孩。",
    "The young animal found shelter by instinct.",
    "幼小动物凭本能找到了藏身处。"
  ],
  [
    "review",
    "名词 · 审查",
    "review 可指认真检查质量、情况等的过程或一次审查；a review of 后接对象，under review 表正在审查。",
    "The plan remains under review until the inspection is complete.",
    "检查结束前，计划仍处于审查中。",
    "A review of the records revealed a missing payment.",
    "记录审查发现一笔款项漏付。"
  ],
  [
    "virus",
    "名词 · 计算机病毒",
    "virus 在计算机语境指能复制并感染其他程序、文件的恶意程序，可数；不应把所有技术故障都归为病毒。",
    "The old computer contained a virus that damaged several files.",
    "旧电脑里有一个破坏了多个文件的病毒。",
    "The technician removed the virus before restoring the backup.",
    "技术员清除病毒后才恢复备份。"
  ],
  [
    "weird",
    "形容词 · 古怪的",
    "weird 表示奇特、不同寻常，常用于较随意的描述；可以修饰感觉或现象，不必含真正超自然的意思。",
    "A weird echo followed every step in the empty tunnel.",
    "空隧道里每走一步都有奇怪回声。",
    "The lamp cast a weird pattern across the ceiling.",
    "灯在天花板上投出古怪图案。"
  ],
  [
    "incomplete",
    "形容词 · 不完整的",
    "incomplete 表示缺少必要部分或尚未完成，可修饰资料、任务等；不是指全部不存在，而是仍有缺项。",
    "The map is incomplete near the northern border.",
    "地图在北部边界附近不完整。",
    "She returned the incomplete form with a note explaining what was missing.",
    "她退回未填完整的表格，并附注说明缺项。"
  ],
  [
    "fantasy",
    "名词 · 幻想",
    "fantasy 可指头脑中创造的不现实情景或想象，可数或整体使用；与已有事实的回忆不同，不说明想象会实现。",
    "His fantasy of living in a lighthouse inspired a short story.",
    "他住在灯塔里的幻想启发了一篇短篇故事。",
    "The plan remained a fantasy until someone offered a boat.",
    "有人提供船之前，这个计划仍只是幻想。"
  ],
  [
    "unoccupied",
    "形容词 · 无人使用的",
    "unoccupied 描述座位、房间或建筑没有人占用或居住；只说明当时状态，不保证可随意进入或不用预约。",
    "We found an unoccupied table beside the window.",
    "我们在窗边找到一张空桌。",
    "The house remained unoccupied throughout the winter.",
    "房子整个冬天都无人居住。"
  ],
  [
    "density",
    "名词 · 密度",
    "density 在物理语境可表示单位体积的质量，通常整体使用；和总重量不同，同体积物体才可据此直接比较质量。",
    "The experiment compares the density of two liquids.",
    "实验比较两种液体的密度。",
    "We calculated the density using the sample's mass and volume.",
    "我们用样本质量和体积计算了密度。"
  ],
  [
    "handicap",
    "名词 · 比赛差点",
    "handicap 在比赛中指为平衡参赛者实力而设置的让分、差点等安排；具体规则依项目，不是一般得分的同义词。",
    "The golfer's handicap was adjusted after the tournament.",
    "高尔夫球手的差点在赛后作了调整。",
    "A fair handicap allowed players of different levels to compete.",
    "公平的差点安排让不同水平的选手能够比赛。"
  ],
  [
    "survivor",
    "名词 · 幸存者",
    "survivor 指在灾难、危险等后仍活着的人，通常可数；a survivor of 后接所经历的事件，不是指救援者。",
    "A survivor of the shipwreck described the cold night at sea.",
    "一位海难幸存者讲述了海上寒冷的夜晚。",
    "The rescue crew found another survivor near the rocks.",
    "救援队在礁石附近又找到一位幸存者。"
  ],
  [
    "tuition",
    "名词 · 学费",
    "tuition 的费用义指教学所收取的费用，通常不可数；pay tuition 是付学费，不能自动把住宿和餐费都算进去。",
    "The scholarship covers tuition but not travel expenses.",
    "奖学金支付学费，但不支付交通费。",
    "She saved enough to pay the first term's tuition.",
    "她存够了支付第一学期学费的钱。"
  ],
  [
    "exaggeration",
    "名词 · 夸大",
    "exaggeration 可指把事实说得超出实际的行为或说法；without exaggeration 表示没有夸张，需与实际证据相符。",
    "His account of the storm contained more than one exaggeration.",
    "他对暴风雨的叙述中有不止一处夸大。",
    "Without exaggeration, this was our busiest week of the year.",
    "毫不夸张地说，这是我们全年最忙的一周。"
  ],
  [
    "plentiful",
    "形容词 · 充足的",
    "plentiful 表示供应或数量丰富，可作表语也可修饰名词；和 plenty of 的结构不同，不直接说 plentiful of。",
    "Fresh fruit is plentiful at the market in late summer.",
    "夏末市场上的鲜果很充足。",
    "The campsite has a plentiful supply of clean water.",
    "营地有充足的清洁水源。"
  ],
  [
    "target",
    "名词 · 目标",
    "target 可指计划达成的目标，常用 set 或 reach a target；目标是期望结果，不等于已经取得的实际成绩。",
    "The team set a target of repairing ten boats this month.",
    "团队定下本月修好十艘船的目标。",
    "We reached our fundraising target before the final concert.",
    "最后一场音乐会前，我们达到了筹款目标。"
  ],
  [
    "equation",
    "名词 · 方程或等式",
    "equation 在数学中表示两个表达式相等的陈述，通常可数；solve an equation 指求解，不只是写任意数字算式。",
    "The students solved the equation using two different methods.",
    "学生用两种方法解出了方程。",
    "An equation on the board linked distance and time.",
    "黑板上一道等式把距离和时间联系起来。"
  ],
  [
    "redesign",
    "动词 · 重新设计",
    "redesign 是及物动词，指对已有设计重新安排或改进；直接接受改造的物品，不必先证明原设计完全失败。",
    "We plan to redesign the entrance for easier access.",
    "我们计划重新设计入口以便进出。",
    "The maker will redesign the handle after hearing our feedback.",
    "制作者听取反馈后将重新设计手柄。"
  ],
  [
    "handle",
    "名词 · 手柄",
    "handle 的物体义指专为手抓握而设计的部分，通常可数；门把手、工具柄都可用，不等于整件器具。",
    "The handle of the old suitcase came loose.",
    "旧手提箱的提手松了。",
    "She gripped the wooden handle with both hands.",
    "她双手握住木柄。"
  ],
  [
    "herbivore",
    "名词 · 食草动物",
    "herbivore 指以植物为食的动物，通常可数；草食的植物范围不限于狭义青草，不能把所有吃过植物的动物都直接归类。",
    "The guide pointed out a large herbivore near the trees.",
    "向导指出树边的一只大型食草动物。",
    "A rabbit is a familiar example of a herbivore.",
    "兔子是常见的食草动物例子。"
  ],
  [
    "institute",
    "名词 · 研究所或学院",
    "institute 可指从事研究、教育等的机构，通常可数；名称里的 institute 不直接说明规模大小或是否具有大学授位资格。",
    "The institute studies the history of coastal settlements.",
    "研究所研究沿海聚落的历史。",
    "She joined a technical institute after leaving school.",
    "她离校后进入一所技术学院。"
  ],
  [
    "recapture",
    "动词 · 再次捕获",
    "recapture 作及物动词表示抓回原已捕获而后失去的对象；re- 表再次，但要根据实际情境判断是否确有先前捕获。",
    "The keeper used food to recapture the escaped goat.",
    "饲养员用食物抓回逃跑的山羊。",
    "They hoped to recapture the bird before nightfall.",
    "他们希望天黑前重新抓住那只鸟。"
  ],
  [
    "courtyard",
    "名词 · 庭院",
    "courtyard 指房屋等建筑旁或由建筑围合的院子，通常可数；不是室内大厅，介词 in 常说明位于院内。",
    "Musicians practised in the courtyard behind the museum.",
    "乐手在博物馆后面的庭院练习。",
    "A stone fountain stood in the centre of the courtyard.",
    "庭院中央立着一座石喷泉。"
  ],
  [
    "geographic",
    "形容词 · 地理的",
    "geographic 表示与地理或特定地区有关，geographical 也是常见形式；可修饰位置、分布，不是某种政治立场。",
    "The map shows the geographic distribution of the villages.",
    "地图展示村庄的地理分布。",
    "The island's geographic position made it a useful stopping point.",
    "岛屿的地理位置使它成为有用的中途停靠点。"
  ],
  [
    "psychological",
    "形容词 · 心理的",
    "psychological 可描述发生在头脑中的过程、影响或感受，也可表示心理学方面；不能简单等同于身体看不见的所有现象。",
    "The story explores the psychological effects of isolation.",
    "故事探讨隔离的心理影响。",
    "She became interested in psychological research during college.",
    "她在大学期间对心理学研究产生了兴趣。"
  ],
  [
    "version",
    "名词 · 版本或说法",
    "version 可指原作的一种改编或某人对事情的叙述，可数；his version of events 是他的说法，不自动等于已核实事实。",
    "Each witness gave a different version of the same event.",
    "每位证人都对同一事件给出了不同说法。",
    "We watched a shorter version of the play at school.",
    "我们在学校看了这部剧的缩短版本。"
  ],
  [
    "conscious",
    "形容词 · 意识到的",
    "conscious of 后接名词或动名词表示有所察觉，也可接 that 从句；这一义不同于仅表示昏迷后清醒。",
    "She was conscious of the silence behind her.",
    "她察觉到身后一片寂静。",
    "We were conscious that the deadline was approaching.",
    "我们意识到截止日期临近。"
  ],
  [
    "digest",
    "动词 · 理解吸收",
    "digest 可比喻把信息吸收理解，常直接接 information 等对象；不必局限于食物在身体中的消化过程。",
    "Give us a few minutes to digest the new information.",
    "给我们几分钟理解新信息。",
    "She needed time to digest the unexpected news.",
    "她需要时间消化这个意外消息。"
  ],
  [
    "administrator",
    "名词 · 管理员",
    "administrator 可指负责组织行政事务或计算机系统管理的人，通常可数；network administrator 是网络管理员，不只是普通网络用户。",
    "The network administrator restored access to the shared files.",
    "网络管理员恢复了共享文件的访问。",
    "Ask the school administrator for a copy of the timetable.",
    "向学校行政人员要一份课程表。"
  ],
  [
    "realistic",
    "形容词 · 切合实际的",
    "realistic 可评价计划、期望是否考虑实际条件；不等于完全悲观，也不自动保证计划最终成功。",
    "We need a realistic schedule for repairing the roof.",
    "我们需要一个切合实际的屋顶维修日程。",
    "Her estimate was realistic about the work still required.",
    "她的估计切合剩余工作所需的实际情况。"
  ],
  [
    "publicize",
    "动词 · 宣传或公布",
    "publicize 是及物动词，表示使公众知晓某事，直接接事件或信息；和仅为印刷出版的 publish 侧重点不同。",
    "The library will publicize the reading festival through local shops.",
    "图书馆将通过本地店铺宣传阅读节。",
    "We should publicize the change before tickets go on sale.",
    "售票前我们应公布这项变化。"
  ],
  [
    "qualification",
    "名词 · 资格条件",
    "qualification 可指使人适合某职务的技能、条件，通常可数；学历证书只是可能的证明，不是这个词唯一意义。",
    "Teaching experience is an important qualification for this role.",
    "教学经验是这个职位的重要资格条件。",
    "The notice lists each qualification needed for membership.",
    "公告列出了取得会员资格所需的每项条件。"
  ],
  [
    "unreliable",
    "形容词 · 不可靠的",
    "unreliable 描述不能稳定依赖的人、设备或信息，可作定语或表语；不一定表示故意撒谎，也可能是表现不稳定。",
    "The old van became unreliable during the winter.",
    "旧货车到冬天变得不可靠了。",
    "We excluded the unreliable measurements from the comparison.",
    "我们在比较中剔除了不可靠的测量数据。"
  ],
  [
    "customize",
    "动词 · 按需求定制",
    "customize 表示按个人或具体使用需求制作、调整，直接接产品或设置；和习惯的名词 custom 词性不同。",
    "You can customize the labels before printing them.",
    "打印前你可以按需要调整标签。",
    "The workshop will customize the chair for her height.",
    "工坊将按她的身高定制椅子。"
  ],
  [
    "irrigation",
    "名词 · 灌溉",
    "irrigation 的农业义是人工向土地供水帮助作物生长，通常不可数；不是所有自然降雨都叫灌溉。",
    "The farm uses stored rainwater for irrigation.",
    "农场用储存的雨水灌溉。",
    "A new canal improved irrigation in the southern fields.",
    "新水渠改善了南边田地的灌溉。"
  ],
  [
    "insight",
    "名词 · 深入理解",
    "insight 可表示洞察力或对某事的新理解，常用 insight into；获得理解不只指看到物体外表，也不保证判断永不出错。",
    "The letters offer insight into the painter's working habits.",
    "书信让人深入了解画家的工作习惯。",
    "Her careful questions showed real insight into the problem.",
    "她审慎的提问显示出对问题的深刻理解。"
  ],
  [
    "conclude",
    "动词 · 得出结论",
    "conclude 可接 that 从句表示根据思考或证据作判断；不等于只是猜测，也需留意它还有结束活动的另一常见义。",
    "We can conclude that the first repair did not solve the problem.",
    "我们可以得出结论，第一次维修没有解决问题。",
    "Do not conclude too much from a single observation.",
    "不要凭一次观察就作出过多结论。"
  ],
  [
    "irregular",
    "形容词 · 不规则变化的",
    "irregular 在语法中形容词形变化不遵循通常模式，常修饰 verb；不规则并不表示这些形式不正确。",
    "The exercise focuses on irregular verbs in the past tense.",
    "练习重点是过去时的不规则动词。",
    "She keeps an irregular verb list beside her notebook.",
    "她在笔记本旁放着一份不规则动词表。"
  ],
  [
    "volcano",
    "名词 · 火山",
    "volcano 可指地壳喷出热岩浆等的通道及喷出物形成的山，通常可数；复数 volcanoes 和 volcanos 都可见。",
    "The volcano was hidden behind a bank of cloud.",
    "火山藏在一片云后。",
    "Scientists placed a monitoring station near the volcano.",
    "科学家在火山附近设置了监测站。"
  ],
  [
    "fancy",
    "动词 · 想要",
    "fancy 的喜欢义在日常语境可表示想要某物，常见于英式英语；可接名词，不是此词作形容词时的花哨义。",
    "Do you fancy a cup of tea before we leave?",
    "离开前你想喝杯茶吗？",
    "I fancy something warm after that long walk.",
    "走了那么久，我想吃点热的。"
  ],
  [
    "serious",
    "形容词 · 认真的",
    "serious 可表示说话或做事当真、不是开玩笑，常作表语；be serious about 后接认真对待的事情。",
    "Are you serious about restoring the whole boat?",
    "你真打算修复整艘船吗？",
    "Her serious question changed the mood of the meeting.",
    "她认真的问题改变了会议的气氛。"
  ],
  [
    "complaint",
    "名词 · 抱怨或投诉",
    "complaint 可指表达不满的意见，通常可数；make a complaint about 后接事情，to 可引出接收投诉的人或机构。",
    "We sent a complaint about the noise to the building manager.",
    "我们向楼宇管理员投诉了噪声。",
    "The shop dealt with my complaint before lunchtime.",
    "商店午饭前处理了我的投诉。"
  ],
  [
    "withdraw",
    "动词 · 撤回",
    "withdraw 可直接接原先提出、提供的东西，表示收回；过去式 withdrew，过去分词 withdrawn，不按规则加 ed。",
    "They decided to withdraw the proposal after the public meeting.",
    "公开会议后，他们决定撤回提案。",
    "The supplier may withdraw the offer if we wait too long.",
    "如果我们拖得太久，供应商可能撤回报价。"
  ],
  [
    "faraway",
    "形容词 · 遥远的",
    "faraway 是形容词，通常放在名词前说明距离远；说明某物在远处时常用分写的 far away 作地点表达。",
    "She collected postcards from faraway cities.",
    "她收集来自遥远城市的明信片。",
    "A faraway island appeared in his grandfather's stories.",
    "祖父的故事里出现了一座遥远岛屿。"
  ],
  [
    "multiple",
    "形容词 · 多个的",
    "multiple 表示涉及不止一个，可修饰选择、原因或来源等复数名词；不专指某个固定数量，也不等于数学中的倍数名词。",
    "The report draws on multiple sources from the archive.",
    "报告采用了档案中的多个来源。",
    "We found multiple reasons for the delay.",
    "我们发现了延误的多个原因。"
  ],
  [
    "informant",
    "名词 · 资料提供者",
    "informant 可指给调查者提供语言、文化资料的人，通常可数；在研究语境不必带警方线人的秘密或告密意味。",
    "The researcher checked the story with a local informant.",
    "研究者向本地资料提供者核实了故事。",
    "Each informant described how the festival had changed.",
    "每位资料提供者都描述了节庆如何变化。"
  ],
  [
    "masterpiece",
    "名词 · 杰作",
    "masterpiece 指技巧或艺术成就极高的作品，通常可数；是强烈赞赏而非所有完成作品的普通名称。",
    "Critics regard the small portrait as her masterpiece.",
    "评论家把这幅小肖像视为她的杰作。",
    "The museum borrowed a masterpiece for the winter exhibition.",
    "博物馆为冬展借来了一件杰作。"
  ],
  [
    "curly",
    "形容词 · 卷曲的",
    "curly 形容头发等有卷曲形态，可放在名词前或作表语；它不是动词，描述变卷过程要采用相应动作词。",
    "The child has curly hair that falls over her forehead.",
    "孩子的卷发垂到额前。",
    "His beard became curly as it grew longer.",
    "他的胡子越长越卷。"
  ],
  [
    "reliability",
    "名词 · 可靠性",
    "reliability 指人或事物值得依赖的程度，通常不可数；评价资料的 reliability 要看证据，不只是内容听起来熟悉。",
    "We questioned the reliability of the old rainfall records.",
    "我们质疑旧降雨记录的可靠性。",
    "The van's reliability matters more than its appearance.",
    "货车的可靠性比外观更重要。"
  ],
  [
    "cooperate",
    "动词 · 合作",
    "cooperate 是不及物动词，常用 with 引出合作者、on 引出项目；直接把某人当宾语而不加 with 不符合此结构。",
    "The two schools will cooperate on a local history project.",
    "两所学校将合作开展本地历史项目。",
    "We need to cooperate with the harbour staff during the move.",
    "搬运期间我们需要与港口工作人员合作。"
  ],
  [
    "scheme",
    "名词 · 计划",
    "scheme 可指有组织的行动计划，可数；在一些语境也指秘密计谋，不能一见此词就假定所有计划都带欺骗。",
    "The council introduced a scheme to restore empty shops.",
    "委员会推出了修复空置店铺的计划。",
    "Residents can join the new bicycle-sharing scheme next month.",
    "居民下个月可参加新的共享单车计划。"
  ],
  [
    "recognition",
    "名词 · 认出",
    "recognition 可表示认出曾见过的人或事物的感觉，通常不可数；不同于公开表彰功绩的另一义项。",
    "A smile of recognition spread across her face.",
    "她认出对方后脸上露出了微笑。",
    "The familiar tune produced an immediate sense of recognition.",
    "熟悉的曲调立刻让人有了似曾相识的感觉。"
  ],
  [
    "literature",
    "名词 · 文献",
    "literature 可指关于某一主题的书面资料整体，通常不可数；scientific literature 是科学文献，不只指小说诗歌。",
    "She reviewed the literature on traditional boat construction.",
    "她查阅了传统造船方面的文献。",
    "There is little published literature on this local craft.",
    "关于这项地方手艺的已出版文献很少。"
  ],
  [
    "technological",
    "形容词 · 技术的",
    "technological 与技术及其发展有关，常修饰进步、变革或创新；不必把每个新颖想法都称为技术革新。",
    "The exhibition traces technological changes in printing.",
    "展览追溯印刷领域的技术变化。",
    "A technological advance made the device much smaller.",
    "一项技术进步使装置缩小了很多。"
  ],
  [
    "warfare",
    "名词 · 作战",
    "warfare 指敌对双方的军事行动，通常不可数；naval warfare 是海战作战，不能随意加 a 把每场战斗单数化。",
    "The book examines how naval warfare changed over time.",
    "这本书考察海上作战如何随时间变化。",
    "The museum explains the effects of warfare on coastal towns.",
    "博物馆讲述战争对沿海城镇的影响。"
  ],
  [
    "overseas",
    "形容词 · 海外的",
    "overseas 作形容词可直接修饰位于海外或与海外有关的活动、机构；它本身不是复数名词，不加额外词尾。",
    "The company opened an overseas office near the port.",
    "公司在港口附近开设了海外办事处。",
    "Her overseas experience helped with the new project.",
    "她的海外经历对新项目有帮助。"
  ],
  [
    "immediate",
    "形容词 · 立即的",
    "immediate 修饰无拖延发生或需要马上处理的事情；表示立即行动时常修饰 action，副词位置则用 immediately。",
    "The leaking pipe needs immediate attention.",
    "漏水管需要立即处理。",
    "Their immediate response prevented a longer delay.",
    "他们的立即回应避免了更长时间的延误。"
  ],
  [
    "wrap",
    "动词 · 包裹",
    "wrap something in 后接包装材料，wrap something around 后接被围住的对象；过去式和现在分词要双写 p。",
    "Wrap the bowl in soft cloth before packing it.",
    "装箱前用软布包好碗。",
    "She helped me wrap the gift in plain blue paper.",
    "她帮我用素蓝纸包礼物。"
  ],
  [
    "operator",
    "名词 · 操作员",
    "operator 可指操作机器或设备的人，通常可数；machine operator 是机器操作员，不等于只负责维修的技术人员。",
    "The crane operator waited for a clear signal.",
    "起重机操作员等待明确信号。",
    "A trained operator must remain beside the machine.",
    "经过培训的操作员必须守在机器旁。"
  ],
  [
    "commerce",
    "名词 · 商业贸易",
    "commerce 通常指涉及货物流通的商业买卖活动，常整体使用；a centre of commerce 是商业中心，不把每次购买叫 a commerce。",
    "The port became a centre of commerce along the coast.",
    "港口成了沿海的贸易中心。",
    "The new railway encouraged commerce between inland towns.",
    "新铁路促进了内陆城镇之间的贸易。"
  ],
  [
    "occupy",
    "动词 · 占据空间",
    "occupy 可直接接位置或空间，表示占用；此义不需要加 in 来引出房间或角落，也不必带军事占领意味。",
    "The display will occupy most of the entrance hall.",
    "展示将占据门厅的大部分空间。",
    "These boxes occupy the only dry corner of the shed.",
    "这些箱子占了棚里唯一干燥的角落。"
  ],
  [
    "calorie",
    "名词 · 热量单位卡",
    "calorie 是能量单位，营养语境常指大卡即千卡；和较小的物理卡要结合语境区分，复数直接加 s，成为 calories。",
    "The label gives a calorie count for each serving.",
    "标签列出每份的热量数。",
    "The chart explains what one calorie means in food measurements.",
    "图表解释食品计量中的一卡指什么。"
  ],
  [
    "shellfish",
    "名词 · 有壳水生动物",
    "shellfish 指有壳的水生无脊椎动物，常包括贝类和甲壳类；不是只指某一种贝，也不是普通鱼类的通称。",
    "The market sells fresh shellfish beside the fish stalls.",
    "市场在鱼摊旁出售新鲜贝类和甲壳类水产。",
    "Crabs are one kind of shellfish shown in the guide.",
    "螃蟹是指南展示的一类有壳水生动物。"
  ],
  [
    "fundamental",
    "形容词 · 基础性的",
    "fundamental 表示构成基础、影响本质的，常用 fundamental to 说明对什么至关重要；不只是数量上排在第一。",
    "Trust is fundamental to our work with local families.",
    "信任是我们与当地家庭合作的基础。",
    "The lesson explains a fundamental principle of boat design.",
    "课程解释造船设计的一项基本原理。"
  ],
  [
    "efficient",
    "形容词 · 高效的",
    "efficient 强调以较少时间、材料等浪费达成结果；不只表示事情有效，评价时需同时考虑投入与产出。",
    "The new pump is more efficient than the old one.",
    "新水泵比旧水泵更高效。",
    "An efficient layout saves the cooks many unnecessary steps.",
    "高效的布局让厨师少走许多冤枉步。"
  ],
  [
    "realist",
    "名词 · 务实的人",
    "realist 可指接受实际条件并据此判断的人，通常可数；不等于凡事悲观，也不同于形容词 realistic 的句法。",
    "As a realist, she allowed extra time for bad weather.",
    "作为务实的人，她为恶劣天气预留了额外时间。",
    "The team needed a realist who understood the limits of the budget.",
    "团队需要一位理解预算限制的务实者。"
  ],
  [
    "hide",
    "动词 · 藏起",
    "hide 可直接接要藏的物品，地点另用介词补充；过去式 hid，过去分词常用 hidden，不按普通动词加 ed。",
    "We can hide the spare lamp behind the large cupboard.",
    "我们可以把备用灯藏在大柜后。",
    "She tried to hide the present before her brother arrived.",
    "她试着在哥哥到来前把礼物藏好。"
  ],
  [
    "quantity",
    "名词 · 数量",
    "quantity 表示物品的多少，可用 a quantity of 接内容；和 quality 质量不同，不用它直接评价东西好坏。",
    "Measure the quantity of water before adding the powder.",
    "加粉末前先量水量。",
    "A small quantity of paint was enough for the frame.",
    "少量油漆就够刷框架了。"
  ],
  [
    "glance",
    "动词 · 瞥一眼",
    "glance 的看一眼义常用 glance at 引出所看对象，是不及物结构；强调短暂看，不是长时间凝视。",
    "Take a moment to glance at the map before leaving.",
    "离开前花一点时间看一下地图。",
    "I could only glance at the display as the train passed.",
    "火车经过时，我只能瞥一眼展示。"
  ],
  [
    "operate",
    "动词 · 运作",
    "operate 可不及物表示机器、设施等正常运作，时间或状态用补语说明；此处不采用医生实施手术的专门义。",
    "The small workshop can operate without electricity.",
    "小工坊不用电也能运作。",
    "The new system will operate throughout the night.",
    "新系统将整夜运行。"
  ],
  [
    "favorable",
    "形容词 · 赞同的",
    "favorable 可描述表达支持、认可的评价或态度，常修饰 review；此处不是仅说天气或环境适宜的另一义。",
    "The play received a favorable review in the local paper.",
    "话剧在本地报纸上获得了好评。",
    "Her favorable opinion helped the project gain support.",
    "她赞同的意见帮助项目获得支持。"
  ],
  [
    "measurable",
    "形容词 · 可测量的",
    "measurable 指能够用尺寸、数量、时间等具体指标描述；可测并不意味着数值已被测准，也不说明变化必然很大。",
    "The experiment produced a measurable change in temperature.",
    "实验造成了可测量的温度变化。",
    "We agreed on a measurable goal before the project began.",
    "项目开始前，我们商定了一个可衡量的目标。"
  ],
  [
    "glacial",
    "形容词 · 冰冷的",
    "glacial 可比喻极寒的感觉，也可表示态度冷漠；本条只描述温度，不等于所有事情都直接来自冰川。",
    "A glacial wind swept through the gap in the wall.",
    "一阵冰冷的风扫过墙缝。",
    "The water felt glacial even under the midday sun.",
    "即使在正午阳光下，水仍冷得刺骨。"
  ],
  [
    "submit",
    "动词 · 提交",
    "submit something to someone 表示把材料正式交给对方审查或决定；过去式 submitted，注意双写 t。",
    "Please submit the completed form to the school office.",
    "请把填好的表格交到学校办公室。",
    "We will submit our proposal before the end of the month.",
    "我们将在月底前提交提案。"
  ],
  [
    "zone",
    "名词 · 区域",
    "zone 指因特征或用途与周边区分的区域，通常可数；construction zone 是施工区，不等于所有城市行政区名称。",
    "Keep bicycles outside the marked loading zone.",
    "请把自行车停在标记的装卸区以外。",
    "The map divides the coast into a northern and a southern zone.",
    "地图把海岸划分为北区和南区。"
  ],
  [
    "columnist",
    "名词 · 专栏作者",
    "columnist 指定期为报纸、杂志专栏撰稿的人，通常可数；不等同于负责所有新闻采写的任意记者。",
    "The columnist wrote about changes in the old market.",
    "专栏作者写了老集市的变化。",
    "A local columnist interviewed the volunteers after the concert.",
    "音乐会后，一位本地专栏作者采访了志愿者。"
  ]
];
october24Rows.push(...october24ThirdRows);
const october24Words = new Set(october24Rows.map(([word]) => word));
rows.push(...october24Rows);

const checkedAt = '2026-10-23';
const dateForWord = (word) => october24Words.has(word) ? '2026-10-24' : checkedAt;
export const EXPANSION_THREE_NOTE_SOURCES = Object.fromEntries(rows.map(([word]) => [
  `e3-mw-${word}`,
  { title: `韦氏词典 · ${word}`, url: `https://www.merriam-webster.com/dictionary/${word}`, checkedAt: dateForWord(word), use: 'factual-reference' },
]));
EXPANSION_THREE_NOTE_SOURCES['e3-time-grammar'] = { title: '剑桥语法 · 时间介词', url: 'https://dictionary.cambridge.org/grammar/british-grammar/at-on-in-time', checkedAt, use: 'factual-reference' };
EXPANSION_THREE_NOTE_SOURCES['e3-oxford-front'] = { title: '牛津学习词典 · front', url: 'https://www.oxfordlearnersdictionaries.com/definition/english/front_1', checkedAt, use: 'factual-reference' };

export const EXPANSION_THREE_SYNONYM_GROUPS = Object.fromEntries(rows.map(([word, sense, note, en1, zh1, en2, zh2]) => [
  `e3-usage-${word}`,
  {
    words: [word], comparisonType: 'usage', sense, note,
    examples: [{ en: en1, zh: zh1 }, { en: en2, zh: zh2 }],
    sourceIds: [`e3-mw-${word}`, ...(word === 'afternoon' ? ['e3-time-grammar'] : []), ...(word === 'front' ? ['e3-oxford-front'] : [])],
    review: { status: 'source-checked', checkedAt: dateForWord(word) },
  },
]));

export const EXPANSION_THREE_WORD_NOTES = Object.fromEntries(rows.map(([word]) => [word, { synonymGroup: `e3-usage-${word}` }]));

// Supplemental references checked for the specific adjective, noun, or grammar sense.
const supplementaryReferences = {
  "e3-oxford-pleased": [
    "牛津学习词典 · pleased",
    "https://www.oxfordlearnersdictionaries.com/definition/english/pleased"
  ],
  "e3-oxford-convinced": [
    "牛津学习词典 · convinced",
    "https://www.oxfordlearnersdictionaries.com/definition/english/convinced"
  ],
  "e3-cambridge-parking": [
    "剑桥词典 · parking",
    "https://dictionary.cambridge.org/dictionary/english/parking?topic=parking"
  ],
  "e3-mw-criticize": [
    "韦氏词典 · criticize",
    "https://www.merriam-webster.com/dictionary/criticize"
  ],
  "e3-contrast-grammar": [
    "剑桥语法 · 转折连接",
    "https://dictionary.cambridge.org/grammar/british-grammar/conjunctions-contrasting"
  ],
  "e3-oxford-supportive": [
    "牛津学习词典 · supportive",
    "https://www.oxfordlearnersdictionaries.com/definition/english/supportive"
  ],
  "e3-oxford-misleading": [
    "牛津学习词典 · misleading",
    "https://www.oxfordlearnersdictionaries.com/definition/english/misleading"
  ],
  "e3-oxford-alive": [
    "牛津学习词典 · alive",
    "https://www.oxfordlearnersdictionaries.com/definition/english/alive"
  ],
  "e3-oxford-accommodation": [
    "牛津学习词典 · accommodation",
    "https://www.oxfordlearnersdictionaries.com/definition/english/accommodation"
  ],
  "e3-oxford-shopping": [
    "牛津学习词典 · shopping",
    "https://www.oxfordlearnersdictionaries.com/definition/english/shopping"
  ],
  "e3-mw-center": [
    "韦氏词典 · center",
    "https://www.merriam-webster.com/dictionary/center"
  ],
  "e3-mw-inquire": [
    "韦氏词典 · inquire",
    "https://www.merriam-webster.com/dictionary/inquire"
  ]
};
for (const [id, [title, url]] of Object.entries(supplementaryReferences)) {
  EXPANSION_THREE_NOTE_SOURCES[id] = { title, url, checkedAt, use: 'factual-reference' };
}
const supplementaryWordSources = {
  "shopping": [
    "e3-oxford-shopping"
  ],
  "centre": [
    "e3-mw-center"
  ],
  "supportive": [
    "e3-oxford-supportive"
  ],
  "misleading": [
    "e3-oxford-misleading"
  ],
  "alive": [
    "e3-oxford-alive"
  ],
  "accommodation": [
    "e3-oxford-accommodation"
  ],
  "enquire": [
    "e3-mw-inquire"
  ],
  "pleased": [
    "e3-oxford-pleased"
  ],
  "convinced": [
    "e3-oxford-convinced"
  ],
  "parking": [
    "e3-cambridge-parking"
  ],
  "criticise": [
    "e3-mw-criticize"
  ],
  "however": [
    "e3-contrast-grammar"
  ],
  "although": [
    "e3-contrast-grammar"
  ]
};
for (const [word, ids] of Object.entries(supplementaryWordSources)) {
  if (EXPANSION_THREE_WORD_NOTES[word]) EXPANSION_THREE_SYNONYM_GROUPS[EXPANSION_THREE_WORD_NOTES[word].synonymGroup].sourceIds.push(...ids);
}

EXPANSION_THREE_NOTE_SOURCES['e3-mw-wagon'] = { title: '韦氏词典 · wagon', url: 'https://www.merriam-webster.com/dictionary/wagon', checkedAt: '2026-10-24', use: 'factual-reference' };
EXPANSION_THREE_SYNONYM_GROUPS['e3-usage-waggon'].sourceIds.push('e3-mw-wagon');

EXPANSION_THREE_NOTE_SOURCES['e3-mw-systematic'] = { title: '韦氏词典 · systematic', url: 'https://www.merriam-webster.com/dictionary/systematic', checkedAt: '2026-10-24', use: 'factual-reference' };
EXPANSION_THREE_SYNONYM_GROUPS['e3-usage-systematically'].sourceIds.push('e3-mw-systematic');

EXPANSION_THREE_NOTE_SOURCES['e3-mw-burglary'] = { title: '韦氏词典 · burglary', url: 'https://www.merriam-webster.com/dictionary/burglary', checkedAt: '2026-10-24', use: 'factual-reference' };
EXPANSION_THREE_SYNONYM_GROUPS['e3-usage-burglar'].sourceIds.push('e3-mw-burglary');
