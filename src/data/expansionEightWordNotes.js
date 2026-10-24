// Original bilingual learning notes. Primary dictionary facts checked on 2026-10-24.
// Source checks do not constitute independent language-editor review.
const rows = [
  ["novice", "名词·新手", "指刚开始学习某技能的人，常用a novice at/in说明不熟悉的领域。", "Even a novice can assemble this shelf.", "即使新手也能组装这个架子。", "I am a novice at pottery.", "我是陶艺新手。"],
  ["literate", "形容词·有读写能力的", "表示能够读写；computer-literate则指具备电脑使用能力，并非文学修养高。", "The programme helps adults become literate.", "这个项目帮助成年人学会读写。", "The survey asked whether each adult was literate.", "调查询问每位成年人是否会读写。"],
  ["illiteracy", "名词·文盲状况", "通常不可数，指不会读写的状况；谈比例时可用the illiteracy rate。", "The survey measured adult illiteracy.", "调查测量了成年人的文盲状况。", "Evening classes helped reduce illiteracy.", "夜校帮助减少了文盲现象。"],
  ["numerate", "形容词·有基本计算能力的", "指能够理解数字并进行基本计算；与有读写能力的literate分别描述不同技能。", "A cashier needs to be numerate.", "收银员需要具备基本计算能力。", "The course helps workers become more numerate.", "课程帮助工人提高基本计算能力。"],
  ["controversial", "形容词·有争议的", "形容引起明显意见分歧的事情，常修饰issue或decision，不等于已经证实错误。", "The council approved the controversial plan.", "市政委员会批准了那项有争议的计划。", "Her proposal remains controversial.", "她的提议仍有争议。"],
  ["issue", "名词·问题；议题", "本处指需要讨论或处理的问题，常用raise an issue；也有出版物一期的含义。", "We discussed the issue of access.", "我们讨论了通行问题。", "Funding is the central issue.", "资金是核心问题。"],
  ["affair", "名词·事情；事件", "可指某件事或事件，复数affairs常指事务；私情义需由人物关系语境判断。", "The wedding was a quiet affair.", "婚礼办得很低调。", "The affair became a matter of public concern.", "这件事成了公众关心的问题。"],
  ["riddle", "名词·谜语；谜团", "可数，既指供人猜的谜语，也可指难以解释的事；solve a riddle表示解谜。", "Can you solve this riddle?", "你能解开这个谜语吗？", "The missing page remains a riddle.", "失踪的那一页仍是个谜。"],
  ["instil", "动词·逐渐灌输", "常用instil something in someone，强调逐步培养观念或感受；美式常拼instill。", "Good coaches instil confidence in beginners.", "优秀教练逐渐让初学者建立信心。", "Stories can instil a love of reading.", "故事可以培养阅读的热爱。"],
  ["cram", "动词·塞满；临时死记", "cram A into B表示勉强塞入；cram for an exam指考前短期突击复习。", "Don't cram wet clothes into that bag.", "别把湿衣服硬塞进那个包。", "We had to cram for the exam.", "我们不得不为考试突击复习。"],
  ["emphasise", "动词·强调", "直接接要强调的内容，也可接that从句；英式常拼emphasise，美式常拼emphasize。", "Please emphasise the change of venue.", "请强调地点的变更。", "The tutor will emphasise clear reasoning.", "导师会强调清晰的推理。"],
  ["enable", "动词·使能够", "常用enable someone to do，宾语后接带to的不定式；不是enable someone doing。", "These rails enable visitors to climb safely.", "这些扶手让游客能安全攀爬。", "Subtitles enable me to follow the dialogue.", "字幕让我能听懂对话内容。"],
  ["inspire", "动词·激励；启发", "inspire someone to do表示激励行动；inspire confidence则指使人产生信心。", "The visit may inspire pupils to paint.", "这次参观可能激励学生绘画。", "Her sketches inspire my textile designs.", "她的素描启发了我的纺织品设计。"],
  ["indulge", "动词·尽情享受；纵容", "indulge in后接所享受的活动；indulge a child指过度迁就孩子，语气不同。", "We occasionally indulge in a long lunch.", "我们偶尔尽情享受悠长的午餐。", "They tend to indulge their youngest child.", "他们常常纵容最小的孩子。"],
  ["intelligible", "形容词·可理解的", "常用intelligible to someone，表示话语或文字能被理解；不同于表示聪明的intelligent。", "The recording is barely intelligible.", "录音几乎听不清。", "Make the explanation intelligible to beginners.", "让解释对初学者也清楚易懂。"],
  ["all-round", "形容词·全面的", "主要用于英式英语，在名词前说明多方面都具备；美式相近表达为all-around。", "The course provides all-round musical training.", "课程提供全面的音乐训练。", "She is an excellent all-round athlete.", "她是位出色的全能运动员。"],
  ["idiot", "名词·笨蛋", "用于骂人或自嘲，具有冒犯性；日常评价他人时宜直接指出具体错误。", "I felt like an idiot after forgetting my key.", "忘带钥匙后我觉得自己像个笨蛋。", "He regretted calling his colleague an idiot.", "他后悔骂同事是笨蛋。"],
  ["wisdom", "名词·智慧", "通常不可数，指运用经验作出好判断的能力；与单纯掌握事实的knowledge侧重不同。", "We valued her practical wisdom.", "我们重视她的实用智慧。", "Experience does not always bring wisdom.", "经历不一定带来智慧。"],
  ["wit", "名词·机智", "表示幽默机敏的表达能力时通常不可数；复数wits可表示思考或应变能力。", "Her wit kept the audience laughing.", "她的机智逗得观众一直笑。", "The review lacks his usual wit.", "这篇评论缺少他一贯的机智幽默。"],
  ["aptitude", "名词·天赋；才能", "常用an aptitude for加领域或活动，强调自然具备的能力倾向，不等于已熟练掌握。", "He shows an aptitude for languages.", "他表现出语言天赋。", "The test measures mechanical aptitude.", "这项测试测量机械方面的潜能。"],
  ["excellent", "形容词·极好的", "用于高度肯定质量或表现；通常不再用very修饰，可说absolutely excellent。", "The hostel has excellent cooking facilities.", "旅舍有很好的烹饪设施。", "Your map is an excellent guide.", "你的地图是份极好的指南。"],
  ["reputation", "名词·名声", "常用a reputation for说明因何闻名，reputation as说明作为何种人的声誉。", "The café has a reputation for fresh bread.", "这家咖啡馆以新鲜面包闻名。", "Her reputation as a researcher grew.", "她作为研究者的声誉日益提高。"],
  ["eminent", "形容词·杰出的", "常用于在专业领域有声望的人，语体较正式；不要与表示即将发生的imminent混淆。", "An eminent botanist led the walk.", "一位著名植物学家带领大家步行考察。", "The award honours eminent scholars.", "这个奖表彰杰出学者。"],
  ["notorious", "形容词·臭名昭著的", "通常含负面评价，常用notorious for说明坏名声的原因，不能随意代替中性的famous。", "The bend is notorious for accidents.", "那个弯道因事故频发而出名。", "He became notorious for forged reviews.", "他因伪造评论而臭名昭著。"],
  ["esteem", "名词·尊重", "通常不可数，常见hold someone in high esteem表示非常敬重某人，语气较正式。", "Her colleagues hold her in high esteem.", "同事们十分敬重她。", "The prize reflects the esteem of his peers.", "该奖体现了同行对他的尊重。"],
  ["respect", "名词·尊重", "表示对人的敬重时通常不可数，常搭配respect for；earn respect表示赢得尊重。", "She earned respect through careful work.", "她靠认真工作赢得了尊重。", "Show respect for other people's time.", "要尊重他人的时间。"],
  ["diligent", "形容词·勤勉的", "强调持续认真、用心地工作，常修饰student或researcher，不单指做事速度快。", "The diligent archivist checked every date.", "勤勉的档案员核查了每个日期。", "She is diligent in keeping records.", "她认真勤勉地保存记录。"],
  ["painstaking", "形容词·极其仔细的", "强调花费很多时间和精力认真处理细节，常搭配research或work，并非表示身体疼痛。", "The restoration required painstaking work.", "修复需要极其细致的工作。", "His painstaking research uncovered the error.", "他的细致研究揭示了错误。"],
  ["skill", "名词·技能", "泛指熟练能力时可不可数，指具体技能时可数；常用skill in/at加活动。", "Repairing the clasp takes considerable skill.", "修理搭扣需要相当高的技巧。", "The course develops skill in basic cooking.", "课程培养基本烹饪技能。"],
  ["headmaster", "名词·男校长", "主要指学校的男性负责人，英式英语常见；不明性别或中性称呼可用headteacher。", "The headmaster welcomed the new pupils.", "男校长欢迎新生。", "Our headmaster also teaches history.", "我们的男校长也教历史。"],
  ["professor", "名词·教授", "通常指大学的高级教师或教授职务；称号置于姓名前时大写，不同国家职级制度并不完全相同。", "The professor demonstrated the experiment.", "教授演示了实验。", "Professor Lin answered our questions.", "林教授回答了我们的问题。"],
  ["mentor", "名词·导师；指导者", "指以经验支持他人成长的人，常用a mentor to；不必是学校正式授课教师。", "My mentor helped me plan the exhibition.", "我的导师帮我筹划展览。", "She became a mentor to younger engineers.", "她成了年轻工程师的指导者。"],
  ["tutor", "名词·辅导教师", "可指提供个人或小组教学的人；英国大学语境也可能指负责学生指导的教师。", "The tutor explained the difficult passage.", "辅导教师解释了难懂的段落。", "We hired a tutor for evening lessons.", "我们请了位教师晚上辅导。"],
  ["lecturer", "名词·讲师", "常指大学或学院教师，也可指发表讲座的人；职位等级需结合所在教育体系判断。", "The lecturer illustrated the point with photographs.", "讲师用照片说明了这一点。", "A visiting lecturer spoke about translation.", "一位客座讲师谈了翻译问题。"],
  ["assistant", "名词·助手", "可数，指协助他人工作的人；作职称前置修饰语时如assistant editor表示副职或助理职位。", "The assistant labelled the samples.", "助手给样本贴了标签。", "Ask the shop assistant for another size.", "请店员拿另一个尺码。"],
  ["degree", "名词·学位", "表示大学授予的资格时可数，常用a degree in加专业；不要与课程名称course混用。", "She earned a degree in geology.", "她获得了地质学学位。", "His degree took four years to complete.", "他花了四年取得学位。"],
  ["permit", "动词·允许", "permit someone to do或permit doing均可；书面语较正式，名词permit另指许可证。", "The rules permit visitors to take photographs.", "规定允许游客拍照。", "We do not permit smoking inside.", "我们不允许在室内吸烟。"],
  ["diploma", "名词·文凭", "指完成课程后授予的证书或资格，可数；具体层级因国家与机构不同，不能直接等同学位。", "She received a diploma in design.", "她获得了设计专业文凭。", "Keep your diploma in a dry folder.", "把文凭放在干燥的文件夹里。"],
  ["graduate", "动词·毕业", "常用graduate from加学校；表示专业可用graduate in，名词graduate另指毕业生。", "I hope to graduate from college next spring.", "我希望明年春天大学毕业。", "Students must pass the project to graduate.", "学生必须通过项目考核才能毕业。"],
  ["bachelor", "名词·学士；单身男子", "教育语境常用a bachelor's degree；单独a bachelor也可指未婚男子，须由语境区分。", "She is studying for a bachelor's degree.", "她正在攻读学士学位。", "The novel follows an elderly bachelor.", "小说描写了一位年老的单身男子。"],
  ["master", "名词·硕士；能手", "a master's degree指硕士学位；a master of某技艺指大师，两种用法中的结构不同。", "He completed a master's degree in chemistry.", "他取得了化学硕士学位。", "The carpenter is a master of his craft.", "这位木匠是行家。"],
  ["fresher", "名词·大学一年级新生", "主要用于英式非正式语境，指刚入大学的学生；美式常用freshman。", "Each fresher received a campus map.", "每位新生都拿到了校园地图。", "The club welcomed every fresher personally.", "社团亲自欢迎每位新生。"],
  ["sophomore", "名词·二年级学生", "主要用于美国高中或大学的二年级学生；不能直接套用到所有国家的年级体系。", "The sophomore joined the campus newspaper.", "这名大二学生加入了校报。", "She took biology as a sophomore.", "她在二年级修了生物学。"],
  ["junior", "名词·三年级学生", "美式教育语境指高中或大学三年级学生；工作中junior还可表示职位较低，需区分。", "He is a junior at a small college.", "他是所小学院的大三学生。", "As a junior, she began laboratory work.", "她在三年级开始了实验室工作。"],
  ["senior", "名词·高年级毕业班学生", "美式教育语境通常指高中或大学四年级学生；并不表示学生年龄一定很大。", "The senior presented her final project.", "这位毕业班学生展示了毕业项目。", "Every senior must complete a research paper.", "每位毕业班学生都必须完成研究论文。"],
  ["alumni", "复数名词·校友", "是alumnus的复数，指某校往届学生；表示单个校友不能说an alumni。", "Alumni returned for the anniversary concert.", "校友们回来参加周年音乐会。", "The alumni donated books to the library.", "校友们向图书馆捐赠了书籍。"],
  ["orientation", "名词·迎新介绍", "学校或工作语境可指帮助新人了解环境的介绍培训；另有方向和倾向义，需看搭配。", "Orientation begins in the main hall.", "迎新介绍在大厅开始。", "The library offers an orientation session.", "图书馆提供入馆介绍活动。"],
  ["coed", "形容词·男女同校的", "美式非正式用法，也写co-ed，指男女共同参加；名词指女大学生的旧用法应谨慎使用。", "The college became coed in the seventies.", "这所学院在七十年代改为男女同校。", "They joined a coed volleyball team.", "他们加入了一支男女混合排球队。"],
  ["enrol", "动词·注册入学", "英式拼写enrol，美式enroll；常用enrol in/on a course，或enrol someone in。", "I want to enrol on the evening course.", "我想报名参加夜间课程。", "Parents can enrol children online.", "家长可在线为孩子报名。"],
  ["matriculation", "名词·大学入学注册", "较正式，指被大学正式接纳入学或相关程序；不等于所有课程的普通报名。", "Matriculation takes place before classes begin.", "正式入学注册在开课前进行。", "She attended the matriculation ceremony.", "她参加了入学仪式。"],
  ["dorm", "名词·学生宿舍", "是dormitory的非正式缩略形式，可指宿舍楼或多人宿舍；常见于美式校园用语。", "Our dorm overlooks the playing field.", "我们的宿舍俯瞰运动场。", "The dorm has a shared kitchen.", "宿舍里有公共厨房。"],
  ["dining hall", "名词短语·食堂", "通常指学校或机构供人集体用餐的大房间；两个词分写，不是任意家庭餐厅。", "The dining hall closes after supper.", "食堂晚饭后关闭。", "We met outside the dining hall.", "我们在食堂外见面。"],
  ["canteen", "名词·食堂", "英式常指学校、工厂等工作场所供餐的地方；不必是商业街上的独立餐馆。", "The canteen serves soup at noon.", "食堂中午供应汤。", "Workers queued outside the canteen.", "工人们在食堂外排队。"],
  ["experiment", "名词·实验", "可数，常用an experiment on/in研究对象或领域；conduct an experiment表示进行实验。", "The experiment measured heat loss.", "这项实验测量了热量流失。", "We repeated the experiment with clean water.", "我们用干净的水重复了实验。"],
  ["data", "名词·数据", "既可按复数使用，也常作集合性不可数名词；正式科学写作需遵循所在领域习惯。", "The data show a seasonal pattern.", "数据呈现出季节性规律。", "We collected data from fifty sites.", "我们从五十处地点收集了数据。"],
  ["quality", "名词·质量；特质", "表示优劣程度时通常不可数；a quality则可指一种特质，注意数量和含义变化。", "The quality of the paper surprised us.", "纸张的质量让我们惊讶。", "Patience is an important quality in teaching.", "耐心是教学中的重要品质。"],
  ["library", "名词·图书馆", "指供查阅或借阅资料的场所，复数libraries；不是出售书籍的bookshop。", "The library lends musical instruments.", "图书馆出借乐器。", "Our library stays open until nine.", "我们的图书馆开到九点。"],
  ["author", "名词·作者", "可数，常用the author of加作品；通常指书面作品作者，不泛指所有表演者。", "The author signed my copy.", "作者在我的那本书上签了名。", "Who is the author of this essay?", "这篇文章的作者是谁？"],
  ["diary", "名词·日记本；日程簿", "keep a diary表示记日记；英式语境也可指记录安排的日程簿，需看内容。", "She keeps a diary of the voyage.", "她记录这次航行的日记。", "I wrote the appointment in my diary.", "我把预约写进了日程簿。"],
  ["poetry", "名词·诗歌", "泛指诗这一文学体裁时不可数；一首具体的诗用a poem，不说a poetry。", "The club meets to read poetry.", "社团聚会朗读诗歌。", "His poetry often describes coastal villages.", "他的诗歌常描写沿海村庄。"],
  ["magazine", "名词·杂志", "通常指定期出版、包含多篇文章或图片的刊物，可数；不是单篇文章本身。", "The magazine includes a map of the coast.", "杂志附有海岸地图。", "She edits a monthly gardening magazine.", "她编辑一本园艺月刊。"],
  ["journal", "名词·学术期刊；日志", "学术语境指专业期刊，私人记录语境可指日志；a journal article是期刊中的文章。", "The journal published their findings.", "期刊发表了他们的研究结果。", "He kept a journal during the expedition.", "他在考察期间写日志。"],
  ["coverage", "名词·报道；覆盖", "新闻语境指报道的范围或内容，通常不可数；不能用a coverage指一篇报道。", "The race received extensive television coverage.", "比赛得到广泛电视报道。", "The report criticises the coverage of rural schools.", "报告批评了对乡村学校的报道。"],
  ["bibliography", "名词·参考书目", "可数，指作品中使用或推荐的书籍文章清单；不等于作者生平biography。", "Put the bibliography after the final chapter.", "把参考书目放在最后一章之后。", "Her bibliography lists several local histories.", "她的参考书目列了几本地方史。"],
  ["record", "名词·记录", "指保存下来的信息时可数，常用a record of；注意名词重音通常在前，与动词不同。", "We kept a record of every repair.", "我们记录了每次维修。", "The oldest record is written on silk.", "最早的记录写在丝绸上。"],
  ["file", "名词·文件；档案", "可指纸质资料夹或计算机文件，常用a file on说明主题；不是文件夹中每张纸的统称。", "The file contains the original drawings.", "文件里有原始图纸。", "Save the file before closing the window.", "关闭窗口前保存文件。"],
  ["frame", "名词·框架；画框", "可指包围图画的框或支撑物体的架子，可数；具体材料可用a wooden frame。", "The frame is made of bamboo.", "框架用竹子制成。", "She chose a narrow frame for the print.", "她为版画选了窄画框。"],
  ["catalogue", "名词·目录", "指按一定顺序排列的物品或资料清单，可数；美式常用catalog，同一词有不同拼法。", "The catalogue lists every painting.", "目录列出了每幅画。", "Ask for a catalogue of evening courses.", "索取一份夜间课程目录。"],
  ["content", "名词·内容", "泛指材料内容时常不可数；书的目录常用复数contents，不能机械按中文统一数量。", "The content is suitable for beginners.", "内容适合初学者。", "We revised the content of the leaflet.", "我们修改了传单的内容。"],
  ["list", "名词·清单", "可数，常用a list of加项目；on the list表示列在清单上，通常不用in。", "Your name is on the waiting list.", "你的名字在候补名单上。", "Make a list of missing tools.", "列出缺失工具的清单。"],
  ["volume", "名词·卷；册", "本处指成套书中的一卷，可数；表示音量或体积时含义不同，需结合名词搭配。", "The final volume contains the index.", "最后一卷包含索引。", "This volume covers the early voyages.", "这一卷介绍早期航行。"],
  ["reel", "名词·卷轴；一卷", "指绕线、胶片等的轴或一卷材料；可用a reel of film，不等于单张照片。", "The reel holds fishing line.", "卷轴上绕着钓鱼线。", "They found a reel of old film.", "他们找到一卷旧胶片。"],
  ["subject", "名词·学科；主题", "可指所学科目或讨论对象，常用the subject of；不要把专业major和每个科目都等同。", "Chemistry was her favourite subject.", "化学曾是她最喜欢的科目。", "The subject of the lecture is migration.", "讲座主题是迁徙。"],
  ["major", "名词·主修专业", "主要用于美式大学教育，a major in说明主修领域；动词结构为major in。", "His major is environmental science.", "他的主修专业是环境科学。", "She chose a major in mathematics.", "她选择数学作为主修专业。"],
  ["sociology", "名词·社会学", "作为学科通常不可数，谓语用单数；研究社会生活和群体，不是单指个人心理。", "Sociology examines patterns in social life.", "社会学研究社会生活中的规律。", "She teaches sociology at a local college.", "她在当地一所学院教社会学。"],
  ["politics", "名词·政治；政治学", "表示政治学或政治活动时常接单数谓语，形式有s；个人政治观点可用复数语义。", "Politics is part of the first-year course.", "政治学是一年级课程的一部分。", "They discussed local politics over lunch.", "他们午餐时讨论了地方政治。"],
  ["economics", "名词·经济学", "作为学科虽然以s结尾，通常接单数谓语；不要与经济体系economy混淆。", "Economics is her main subject.", "经济学是她的主要科目。", "He studied economics before entering journalism.", "他从事新闻业前学过经济学。"],
  ["marketing", "名词·市场营销", "通常不可数，指研究需求、推广销售等活动；不只等于广告或一次商品买卖。", "The course combines design and marketing.", "课程结合设计与市场营销。", "Our marketing focuses on local customers.", "我们的营销面向当地顾客。"],
  ["accounting", "名词·会计工作", "指记录和分析财务账目的工作或学科，通常不可数；一名会计师用accountant。", "The company updated its accounting system.", "公司更新了会计系统。", "She took an introductory accounting course.", "她修了一门会计入门课。"],
  ["audit", "名词·审计；核查", "可数，指有系统地检查账目或过程；常用carry out an audit，不等于普通随手检查。", "The audit revealed several duplicate payments.", "审计发现了几笔重复付款。", "An independent audit begins next week.", "独立审计下周开始。"],
  ["psychology", "名词·心理学", "作为学科通常不可数，研究心理与行为；与指身体机能的physiology不同。", "Psychology helps us study decision-making.", "心理学帮助我们研究决策。", "Her degree combines psychology and education.", "她的学位课程结合心理学和教育学。"],
  ["philosophy", "名词·哲学", "可指研究基本存在与知识的学科，也可指指导做事的一套理念；需由语境区别。", "He teaches philosophy through short dialogues.", "他通过短对话教授哲学。", "Her design philosophy favours simple materials.", "她的设计理念偏爱简单材料。"],
  ["logic", "名词·逻辑", "通常不可数，指推理规则或思路；the logic of说明某种想法背后的合理关系。", "I cannot follow the logic of this argument.", "我无法理解这个论证的逻辑。", "The puzzle tests basic logic.", "这道谜题考查基本逻辑。"],
  ["physics", "名词·物理学", "学科名虽然以s结尾，通常接单数谓语；physical是相关形容词而非同一词性。", "Physics is taught in this laboratory.", "这个实验室用于物理教学。", "She uses physics to explain the motion.", "她用物理学解释该运动。"],
  ["logistics", "名词·后勤；物流", "指组织运输、供应等具体安排，形式带s；常用the logistics of加所组织的活动。", "We discussed the logistics of moving the exhibit.", "我们讨论了搬运展品的后勤安排。", "The logistics team arranged refrigerated transport.", "物流团队安排了冷藏运输。"],
  ["geography", "名词·地理学", "作为学科通常不可数，也可指某地的自然布局；不等于只记国家或城市名称。", "Geography links landscapes and human activity.", "地理学联系地貌与人类活动。", "The island's geography makes travel difficult.", "岛上的地形使出行困难。"],
  ["history", "名词·历史", "泛指过去事件或学科时常不可数；a history of还可指某对象的发展记载或经历。", "History is taught through original letters.", "历史课通过原始书信来教学。", "The museum traces the history of printing.", "博物馆追溯了印刷史。"],
  ["engineering", "名词·工程学", "通常不可数，指运用科学原理设计建造系统的学科或工作；工程师则用engineer。", "The project combines art and engineering.", "项目结合艺术与工程技术。", "She hopes to study civil engineering.", "她希望学习土木工程。"],
  ["mechanics", "名词·力学", "学科义通常接单数谓语，研究运动与作用力；the mechanics of还可指运作细节。", "Mechanics explains how the lever works.", "力学解释杠杆如何起作用。", "The course introduces classical mechanics.", "课程介绍经典力学。"],
  ["maths", "名词·数学", "是mathematics的英式缩略形式，通常接单数谓语；美式常用math，不额外加s。", "Maths is her strongest subject.", "数学是她最擅长的学科。", "We use maths to compare the results.", "我们用数学比较结果。"],
  ["arithmetic", "名词·算术", "通常不可数，侧重加减乘除等数字运算；不应把所有高等数学都称为arithmetic。", "The game improves mental arithmetic.", "这个游戏提升心算能力。", "Check the arithmetic before submitting the invoice.", "提交发票前检查算术计算。"],
  ["geometry", "名词·几何学", "作为学科通常不可数，研究形状、大小及空间关系；不是只指绘图技巧。", "Geometry helps us calculate the area.", "几何学帮助我们计算面积。", "The roof design uses simple geometry.", "屋顶设计运用了简单几何原理。"],
  ["calculus", "名词·微积分", "数学学科义通常不可数，涉及变化率和积分等；不同于泛指计算的calculation。", "Calculus is required for this engineering course.", "这门工程课程要求学习微积分。", "We used calculus to model the motion.", "我们用微积分模拟运动。"],
  ["plus", "介词·加上", "用于算式表示相加，也可表示额外加入；two plus three中不是表示正负号的形容词义。", "Seven plus two equals nine.", "七加二等于九。", "The price includes delivery plus tax.", "价格包括运费另加税费。"],
  ["merger", "名词·合并", "可数，常指两家公司结合成一家；merger with说明另一方，merger of说明参与各方。", "The merger created a larger publisher.", "这次合并产生了一家更大的出版社。", "Staff questioned the proposed merger.", "员工质疑了拟议中的合并。"],
  ["minus", "介词·减去", "用于算式表示减法，也可指扣除某项；温度minus five表示零下五度。", "Nine minus four equals five.", "九减四等于五。", "We paid the total minus the deposit.", "我们支付了扣除订金后的总额。"],
  ["subtract", "动词·减去", "固定关系为subtract A from B，即从B中减去A；注意表达顺序与中文常不同。", "Subtract the deposit from the final bill.", "从最终账单中减去订金。", "We subtract two points for each error.", "每处错误我们扣两分。"],
  ["divide", "动词·除；划分", "divide A by B表示A除以B；divide A into parts则指把整体分成若干部分。", "Divide thirty by five.", "把三十除以五。", "We divide the garden into six plots.", "我们把花园分为六块地。"],
  ["dividend", "名词·股息；被除数", "财务义指向股东分配的利润，数学义指被除数；两义所处领域不同，不宜混译。", "The company paid a small dividend.", "公司支付了少量股息。", "In this calculation, twelve is the dividend.", "在这道计算中，十二是被除数。"],
  ["rational", "形容词·理性的；有理数的", "一般指基于理由和清晰思考；数学中的rational number指可表示为整数之比的数。", "We need a rational explanation for the delay.", "我们需要对延误作出合理解释。", "One half is a rational number.", "二分之一是有理数。"],
  ["even", "形容词·偶数的", "数学中指能被二整除的整数，常用even number；与表示甚至的副词义区分。", "Eight is an even number.", "八是偶数。", "Each pile contains an even number of cards.", "每堆卡片的张数均为偶数。"],
  ["mean", "名词·平均值", "统计中通常指算术平均数，可说the mean of；不同于取中间位置的中位数。", "The mean of these values is six.", "这些数的平均值是六。", "Calculate the mean before drawing the graph.", "画图前先计算平均值。"],
  ["double", "形容词·双倍的", "表示数量或大小为两倍，常用double the amount；不能误解为只增加原量的一半。", "We need double the usual amount.", "我们需要平常两倍的量。", "The room has a double window.", "房间有一扇双层窗。"],
  ["triple", "形容词·三倍的；三重的", "可表示三倍数量或由三部分组成，常见triple layer；含义取决于所修饰名词。", "The box has a triple layer of cardboard.", "盒子有三层纸板。", "They paid triple the original price.", "他们付了原价三倍的钱。"],
  ["quadruple", "动词·增至四倍", "可及物或不及物，表示变为原来的四倍；不是仅在原数上增加四个。", "The upgrade could quadruple storage capacity.", "升级可能让储存容量增至四倍。", "Attendance may quadruple during the festival.", "节日期间到场人数可能增至四倍。"],
  ["minimum", "名词·最小值", "the minimum指允许或可能的最小数量，at least意义相近；与最大值maximum相对。", "The minimum is ten participants.", "最低人数是十名参与者。", "Keep noise to a minimum.", "把噪音降到最低。"],
  ["maximum", "名词·最大值", "指允许或可能达到的最大量，常用a maximum of；不表示通常平均达到该值。", "The room holds a maximum of forty people.", "房间最多容纳四十人。", "Set the volume below the maximum.", "把音量调到最高值以下。"],
  ["approximately", "副词·大约", "用于数值或时间之前，表近似而非精确结果；不与exactly同时修饰同一个值。", "The walk takes approximately forty minutes.", "步行大约需要四十分钟。", "We used approximately two litres of paint.", "我们用了大约两升油漆。"],
  ["graph", "名词·图表", "指以线或点表示数据关系的图，可数；draw a graph of说明要呈现的数据。", "The graph shows monthly rainfall.", "图表展示每月降雨量。", "Plot the results on a graph.", "把结果绘在图表上。"],
  ["cube", "名词·立方体", "几何中指六个面均为同样大小正方形的立体；也可指某数的三次方。", "The wooden cube has smooth edges.", "木立方体的棱很光滑。", "The cube of three is twenty-seven.", "三的立方是二十七。"],
  ["triangle", "名词·三角形", "指有三条直边的平面图形，可数；并不专指三个边都相等的等边三角形。", "Draw a triangle inside the circle.", "在圆内画一个三角形。", "The roof forms a narrow triangle.", "屋顶形成一个狭长的三角形。"],
  ["straight", "形容词·直的", "形容没有弯曲的线或物体，也可作副词直接修饰行进方向；不必另加-ly。", "Use a ruler to draw a straight line.", "用尺子画直线。", "Walk straight towards the bridge.", "朝桥一直走。"],
  ["round", "形容词·圆的", "本处修饰圆形物体，常在名词前或be后；另有一轮活动等名词义。", "We chose a round dining table.", "我们选了一张圆餐桌。", "The window is almost round.", "窗户几乎是圆形的。"],
  ["dot", "名词·小圆点", "指很小的圆形标记，可数；读网址中的点时也用dot，区别于句号的常用名称。", "Place a dot beside each correct answer.", "在每个正确答案旁点一个点。", "A red dot marks the station.", "红点标出了车站。"],
  ["cone", "名词·圆锥体", "指圆形底面向顶点收窄的立体，也可指交通锥；不是所有圆柱形物体。", "The model ends in a sharp cone.", "模型末端是尖圆锥。", "Put a cone beside the damaged paving.", "在破损铺路处放一个交通锥。"],
  ["width", "名词·宽度", "表示从一侧到另一侧的距离，常用the width of；与两端间长度length分别说明尺寸。", "Measure the width of the doorway.", "测量门口宽度。", "The width is marked on the drawing.", "图纸标明了宽度。"],
  ["length", "名词·长度", "表示两端之间的距离；a length of还可指一段绳或管等材料，需看冠词结构。", "We measured the length of the bridge.", "我们测量了桥的长度。", "Cut a short length of string.", "剪一小段细绳。"],
  ["per cent", "副词短语·百分之", "表示每一百中的比例，置于数词后；英式常分写per cent，美式常写percent。", "Only ten per cent of seats remain.", "只剩百分之十的座位。", "Prices rose by three per cent.", "价格上涨了百分之三。"],
  ["ounce", "名词·盎司", "重量单位，常衡盎司约为二十八克；液量盎司是体积单位，不能直接视为同一计量。", "The parcel weighs just one ounce.", "包裹仅重一盎司。", "Add an ounce of butter.", "加入一盎司黄油。"],
  ["fahrenheit", "形容词·华氏的", "温标名称在例句中通常大写Fahrenheit，数值后接degrees Fahrenheit来说明温标。", "The thermometer reads seventy degrees Fahrenheit.", "温度计显示华氏七十度。", "This dial uses the Fahrenheit scale.", "这个刻度盘用华氏温标。"],
  ["volt", "名词·伏特", "是电势差的单位，数值大于一时名词通常用复数；不等于电流单位安培。", "The cell supplies about one volt.", "这节电池提供约一伏电压。", "The meter can detect a change of one volt.", "仪表能测出一伏的变化。"],
  ["transparent", "形容词·透明的", "物理义指可以清楚透视；描述程序时可表示公开易懂，两义需依对象判断。", "The transparent cover protects the map.", "透明盖板保护着地图。", "The selection process must be transparent.", "选拔过程必须透明。"],
  ["ozone", "名词·臭氧", "通常不可数，指一种氧的气体形式；地面臭氧与高层大气臭氧所处环境不同。", "The instrument measures ozone near ground level.", "仪器测量近地面的臭氧。", "The ozone layer absorbs ultraviolet radiation.", "臭氧层吸收紫外辐射。"],
  ["eccentric", "形容词·古怪的", "描述不合常规的人或行为，常可带有幽默色彩；不等于必然危险或错误。", "Her eccentric hat attracted curious looks.", "她古怪的帽子引来好奇的目光。", "The inventor had an eccentric routine.", "发明家的日常作息很古怪。"],
  ["dilute", "动词·稀释", "dilute A with B表示往A中加入B使浓度变低；不等于把所有溶质都除去。", "Dilute the ink with clean water.", "用干净的水稀释墨水。", "Do not dilute this ready-mixed paint.", "不要稀释这种调好的油漆。"],
  ["noxious", "形容词·有毒害的", "常用于气体或物质，强调对生命有害；不仅表示气味难闻，也不能仅凭气味判断。", "The process releases noxious fumes.", "该过程释放有毒烟气。", "Workers sealed the noxious waste safely.", "工人安全封存了有害废物。"],
  ["inert", "形容词·不活跃的；惰性的", "一般可指静止不动，化学中指不易反应；不表示在任何条件下都绝无反应。", "The demonstration uses an inert gas.", "演示使用惰性气体。", "The inert material remained unchanged.", "这种不活泼的材料保持不变。"],
  ["doctrine", "名词·学说；信条", "指某群体接受的一套信念，常用于宗教或政治；不等于任何人的临时意见。", "The lecture examines a political doctrine.", "讲座考察一种政治学说。", "The doctrine shaped the school's teaching.", "这套信条影响了学校的教学。"],
  ["semester", "名词·学期", "尤用于一年分成两期的教育安排，常见美式语境；不同学校具体时长并非完全一致。", "The semester begins in late August.", "学期在八月下旬开始。", "She spent a semester studying abroad.", "她在国外学习了一个学期。"],
  ["timetable", "名词·时间表", "可指课程或交通班次安排；英式常用timetable，美式在许多场景用schedule。", "Check the timetable before leaving.", "出发前查看时刻表。", "Our timetable includes a weekly workshop.", "我们的课程表包含每周一次的工作坊。"],
  ["deadline", "名词·截止时间", "指必须完成某事的最后期限；meet a deadline表示按时完成，miss表示错过。", "The deadline for applications is Friday.", "申请截止时间是星期五。", "We finished before the deadline.", "我们在截止时间前完成了。"],
  ["course", "名词·课程", "可数，指围绕某科目的一系列教学，常用a course in/on；不是单次上课的唯一说法。", "The course includes practical fieldwork.", "课程包含实地实践。", "I booked a course in photography.", "我报了一门摄影课程。"],
  ["seminar", "名词·研讨课", "指小组在教师或专家指导下学习讨论的活动，可数；区别于通常单向讲授的lecture。", "The seminar focused on translation problems.", "研讨课聚焦翻译问题。", "Bring your notes to the seminar.", "带笔记来参加研讨课。"],
  ["syllabus", "名词·教学大纲", "指课程规定要学习的主题或书目，可数；不同于列出每天上课时间的timetable。", "The syllabus lists the required novels.", "教学大纲列出了必读小说。", "Statistics was added to the syllabus.", "统计学被加入了教学大纲。"],
  ["system", "名词·系统", "指相互联系并共同工作的部分，常用a system for说明用途；不是杂乱物品的任意集合。", "The heating system needs regular checks.", "供暖系统需要定期检查。", "We devised a system for tracking loans.", "我们设计了追踪借出物的系统。"],
  ["basic", "形容词·基础的", "表示构成起点或最必要的部分，常修饰skills或needs；不等于质量低劣。", "The class teaches basic first aid.", "这门课教授基础急救。", "The shelter provides basic cooking equipment.", "住所提供基本炊具。"],
  ["surface", "名词·表面", "指物体最外部或最上面的一层；on the surface可指在表面，也可比喻表面看来。", "Wipe the surface with a dry cloth.", "用干布擦拭表面。", "Tiny bubbles rose to the surface.", "小气泡浮上水面。"],
  ["prerequisite", "名词·先决条件", "常用a prerequisite for/to，表示后续事情成立前必须具备的条件，语体较正式。", "Algebra is a prerequisite for this course.", "代数是修这门课的先决条件。", "Experience is not a prerequisite for joining.", "加入并不以经验为先决条件。"],
  ["elective", "名词·选修课", "教育中的可数名词，指可以选择的课程；医疗中作形容词时指可择期的治疗。", "I chose an elective in photography.", "我选了一门摄影选修课。", "This elective meets twice a week.", "这门选修课每周上两次。"],
  ["preview", "名词·预览；预展", "指正式公开前先行观看的机会，常用a preview of；不一定展示作品的全部内容。", "We attended a preview of the exhibition.", "我们参加了展览预展。", "The newsletter offers a preview of next month's events.", "简报预告了下个月的活动。"],
  ["inspect", "动词·检查", "直接接受检查的对象，强调仔细查看状况或合规性；不同于仅随意看一眼。", "Please inspect the seal for cracks.", "请检查密封处是否有裂缝。", "Engineers inspect the bridge each spring.", "工程师每年春天检查这座桥。"],
  ["skim", "动词·略读", "阅读义指快速看以把握大意，常用skim through；不等于仔细逐字审查。", "I skim the headlines over breakfast.", "我早餐时浏览新闻标题。", "Skim through the report before the meeting.", "开会前略读一下报告。"],
  ["scan", "动词·浏览查找；扫描", "阅读义可指快速查找具体信息；机器扫描则指用设备取得图像或数据，依宾语区分。", "Scan the list for your name.", "浏览名单找你的名字。", "Please scan the receipt before filing it.", "归档前请扫描收据。"],
  ["scrutinise", "动词·仔细审查", "强调密切检查细节，直接接宾语；英式拼写scrutinise，美式常拼scrutinize。", "The editor will scrutinise every quotation.", "编辑会仔细审查每条引文。", "We must scrutinise the revised budget.", "我们必须仔细审查修订后的预算。"],
  ["recite", "动词·背诵", "指凭记忆大声说出诗文或列表，直接接内容；不只是默读书面文字。", "Can you recite the opening lines?", "你能背诵开头几行吗？", "The children recite a poem together.", "孩子们一起背诵一首诗。"],
  ["test", "名词·测验；测试", "可数，用于检查知识、能力或性能；take a test指参加，give a test指组织测验。", "The test includes a listening section.", "测验包含听力部分。", "We ran a test on the spare battery.", "我们测试了备用电池。"],
  ["quiz", "名词·小测验", "通常指较短的测验或知识问答，复数quizzes双写z；不一定是正式期末考试。", "The quiz covers the first three chapters.", "小测验涵盖前三章。", "Our team won the history quiz.", "我们队赢了历史知识竞赛。"],
  ["plagiarise", "动词·抄袭", "指把他人作品或想法冒充自己的，直接接作品；引用必须说明来源，区别于合规引用。", "Never plagiarise another student's essay.", "绝不要抄袭另一名学生的文章。", "Writers must not plagiarise online reviews.", "作者不得抄袭网上评论。"],
  ["copy", "动词·复制；照抄", "可指制作相同版本或模仿，copy A onto B说明复制到哪里；是否违规需由情境判断。", "Copy the diagram onto plain paper.", "把图示复制到白纸上。", "Do not copy your neighbour's answers.", "不要照抄邻座的答案。"],
  ["print", "动词·打印；印刷", "指用机器在纸上形成文字或图像，直接接内容；print out也常用于打印文件。", "Please print the timetable in colour.", "请用彩色打印时刻表。", "We print the labels on recycled paper.", "我们把标签印在再生纸上。"],
  ["essay", "名词·文章；作文", "可数，常指围绕一个主题展开的短文，an essay on说明主题；不同于整本专著。", "Her essay compares two translations.", "她的文章比较两种译本。", "Write an essay on local transport.", "写一篇关于当地交通的文章。"],
  ["paper", "名词·论文；纸", "材料纸通常不可数；学术论文可数，a paper on表示关于某主题的一篇论文。", "The paper presents new survey results.", "这篇论文介绍了新的调查结果。", "She wrote a paper on urban gardens.", "她写了一篇关于城市花园的论文。"],
  ["dissertation", "名词·学位论文", "指为获得学位而写的较长研究文章，可数；具体用于何种学位因教育体系而异。", "Her dissertation examines coastal erosion.", "她的学位论文研究海岸侵蚀。", "He submitted his dissertation in June.", "他在六月提交了学位论文。"],
  ["heading", "名词·标题", "指正文或章节上方说明内容的文字，可数；小节标题可用subheading表示层级。", "Put the date beneath the heading.", "把日期写在标题下方。", "Each section needs a clear heading.", "每节都需要清晰的标题。"],
  ["outset", "名词·开始", "常用于固定搭配at the outset或from the outset，语体较正式，不单独表示一个起点物件。", "We explained the rules at the outset.", "我们一开始就解释了规则。", "The plan was clear from the outset.", "计划从一开始就很清楚。"],
  ["point", "名词·要点；观点", "表达讨论中的想法或重点时可数；make a point指提出观点，get the point指领会意思。", "Your final point deserves more discussion.", "你最后的观点值得进一步讨论。", "I understand the point of this exercise.", "我明白这项练习的目的。"],
  ["opinion", "名词·意见", "常用an opinion on/about说明议题；in my opinion引出个人看法，不必再加according to me。", "What is your opinion on the timetable?", "你对这个时刻表有何看法？", "In my opinion, the route is too long.", "在我看来，这条路线太长。"],
  ["introduce", "动词·介绍；引入", "introduce A to B表示把A介绍给B；引入新措施可直接接规则或制度等宾语。", "Please introduce me to the curator.", "请把我介绍给策展人。", "The library will introduce evening opening hours.", "图书馆将开始晚间开放。"],
  ["postulate", "动词·假定；提出假说", "偏正式，指把某观点作为进一步推理基础，可接that从句；并不表示已经证明。", "The model will postulate a stable temperature.", "模型将假定温度稳定。", "Researchers postulate that the settlement was seasonal.", "研究者假定聚落具有季节性。"],
  ["recognise", "动词·认出；承认", "可直接接人或物表示认出，也可接that从句承认事实；英式常用recognise拼写。", "Did you recognise the voice?", "你认出那个声音了吗？", "We recognise that further checks are needed.", "我们承认还需要进一步检查。"],
  ["insist", "动词·坚持要求", "insist on后接名词或动名词，insist that后接从句；不能直接说insist to do。", "They insist on checking every ticket.", "他们坚持检查每张票。", "I insist that we record the changes.", "我坚持要求记录这些改动。"],
  ["persist", "动词·持续；坚持", "问题可作主语表示继续存在；persist in doing强调坚持做某事，通常不用直接宾语。", "If doubts persist, ask the instructor.", "若疑问仍在，请询问老师。", "They persist in using the older method.", "他们坚持使用较旧的方法。"],
  ["understand", "动词·理解", "可接名词或疑问词从句；通常不用进行时表达此刻已理解的状态，过去式understood。", "I understand why you changed the date.", "我理解你为何改日期。", "Do you understand these symbols?", "你理解这些符号吗？"],
  ["compare", "动词·比较", "compare A with/to B用于比较；比较对象应具有对应关系，避免把人和某人的作品直接对比。", "Compare the two maps carefully.", "仔细比较两张地图。", "We compare prices before ordering paper.", "我们订纸前先比较价格。"],
  ["contrast", "名词·差异；对比", "常用a contrast between A and B；in contrast引出差异，不等于相似关系的说明。", "The contrast between the rooms is striking.", "两个房间的差别十分明显。", "In contrast, the second route follows the coast.", "相比之下，第二条路线沿海岸延伸。"],
  ["contradiction", "名词·矛盾", "表示两个说法不能同时成立，可用a contradiction between；不只是轻微侧重不同。", "There is a contradiction between the two accounts.", "两份叙述之间存在矛盾。", "The witness noticed a contradiction in the dates.", "证人发现日期有矛盾。"],
  ["disagree", "动词·不同意", "disagree with接人或观点，disagree about/on接议题；不直接接受持不同意见的人作宾语。", "I disagree with your interpretation.", "我不同意你的解读。", "We disagree about the best route.", "我们对最佳路线有分歧。"],
  ["nuance", "名词·细微差别", "指意义、语气或外观上的细小区别，可数；理解nuance通常需要关注上下文。", "The translation misses an important nuance.", "译文遗漏了一个重要的细微含义。", "Each shade adds a different nuance.", "每种色调增添不同的细微变化。"],
  ["inductive", "形容词·归纳的", "指由具体事实形成一般原则的推理方式；与从一般原则推出具体结论的演绎有所区别。", "The exercise develops inductive reasoning.", "练习培养归纳推理能力。", "Her argument takes an inductive approach.", "她的论证采取归纳方法。"],
  ["detail", "名词·细节", "可数表示单项信息，in detail固定用单数表示详细地；details常指一组具体情况。", "One detail in the drawing caught my eye.", "画中的一个细节吸引了我。", "Please explain the procedure in detail.", "请详细解释程序。"],
  ["example", "名词·例子", "an example of说明某类实例；for example引出说明性例子，后面不必接of。", "This bridge is an example of local craftsmanship.", "这座桥是当地工艺的一个例子。", "We can reuse jars, for example.", "例如，我们可以重复使用罐子。"],
  ["prove", "动词·证明", "可接that从句或prove something to someone；不能把尚未检验的推测直接称为已证明。", "The measurements prove that the wall moved.", "测量证明墙移动了。", "Can you prove ownership of the bicycle?", "你能证明自行车属于你吗？"],
  ["decide", "动词·决定", "decide to do表示决定行动，decide on接所选对象；decide doing通常不合此结构。", "We must decide on a departure time.", "我们必须决定出发时间。", "They decide to postpone the exhibition.", "他们决定推迟展览。"],
  ["research", "名词·研究", "通常不可数，可用research into/on说明对象；一项研究可用a study或a research project。", "Her research focuses on early printing.", "她的研究聚焦早期印刷。", "The museum supports research into local dialects.", "博物馆支持当地方言研究。"],
  ["score", "名词·分数", "可数，指测试或比赛得分；a score of加数值，不能把每个分数都称为等级grade。", "Her score improved after regular practice.", "定期练习后她的分数提高了。", "A score of eighty earns a certificate.", "得八十分可获得证书。"],
  ["mark", "名词·成绩；痕迹", "英式教育中指作业或考试成绩；另可指物体上的痕迹，须由上下文区分。", "She received a high mark for the essay.", "她的文章得了高分。", "There is a mark beside the signature.", "签名旁有个痕迹。"],
  ["grade", "名词·等级；成绩", "可指按标准给出的字母或等级，也可指学年；与具体得分score的侧重不同。", "He earned the highest grade in chemistry.", "他在化学课上取得最高等级。", "The timber is sorted by grade.", "木材按等级分类。"],
  ["rank", "名词·排名；级别", "表示相对于他人的位置或职位等级，常用the rank of；不是单纯考试所得数字。", "The result raised her national rank.", "这个成绩提高了她的全国排名。", "He holds the rank of captain.", "他的军衔是上尉。"],
  ["queue", "名词·队列", "英式常用a queue for表示等候某物的队伍，美式常用line；发音并非逐个读所有元音。", "The queue stretched around the corner.", "队伍一直排到拐角处。", "We joined the queue for tickets.", "我们加入了买票的队伍。"],
  ["praise", "动词·表扬", "praise someone for something表示因某事表扬某人；赞赏成果与感谢帮助的语用目的不同。", "Teachers praise pupils for careful reasoning.", "教师表扬学生推理认真。", "Critics praise the film's quiet humour.", "评论者赞赏电影含蓄的幽默。"],
  ["fellowship", "名词·研究奖学金；同伴情谊", "可数时可指资助研究或进修的职位与资金；不可数时可指共同活动形成的友谊。", "She won a fellowship to study manuscripts.", "她获得了研究手稿的奖学金。", "The shared project created a sense of fellowship.", "共同项目带来了同伴情谊。"],
  ["scholarship", "名词·奖学金", "可数，指支持求学的资助，常用a scholarship to加学校；不可数另可表示学术研究。", "The scholarship covers tuition and books.", "奖学金涵盖学费和书本费。", "He applied for a music scholarship.", "他申请了音乐奖学金。"],
  ["prize", "名词·奖品；奖项", "可数，常用win a prize或a prize for说明获奖原因；不等于每次工作的工资报酬。", "Her design won first prize.", "她的设计获得一等奖。", "The prize includes a set of tools.", "奖品包括一套工具。"],
  ["fee", "名词·费用", "可数，指某项服务或资格所收的钱，常见an entrance fee；不泛指所有商品售价。", "The fee includes all workshop materials.", "费用包含全部工作坊材料。", "Is there an entrance fee?", "需要入场费吗？"],
  ["technology", "名词·技术", "泛指实用科学技术时不可数，具体技术类别可数；不只指电脑或互联网。", "The farm uses water-saving technology.", "农场使用节水技术。", "New technology changed how maps were made.", "新技术改变了地图的制作方式。"],
  ["polytechnic", "名词·理工院校", "指重视技术及职业教育的高等院校；英国历史称谓与其他国家现行机构类型需区别。", "The polytechnic offers courses in surveying.", "这所理工院校提供测绘课程。", "She trained as a designer at a polytechnic.", "她在理工院校接受了设计师培训。"],
  ["engineer", "名词·工程师", "指运用专业知识设计、建造或维护系统的人，可数；与工程学engineering词性不同。", "The engineer tested the emergency lights.", "工程师测试了应急灯。", "A structural engineer examined the roof.", "一位结构工程师检查了屋顶。"],
  ["breakthrough", "名词·突破", "可数，指带来重大进展的发现或成就，常用a breakthrough in；不是每次小修改。", "The new sensor marked a major breakthrough.", "新传感器标志着重大突破。", "They reported a breakthrough in battery design.", "他们报告了电池设计方面的突破。"],
  ["gizmo", "名词·小装置", "非正式用语，指有特定用途的小器具；常在不知道或无需说明准确名称时使用。", "This gizmo removes lids without sharp edges.", "这个小装置能开盖且不留尖边。", "He carries a gizmo for measuring distance.", "他带着一个测距小装置。"],
  ["invent", "动词·发明；编造", "指创造此前没有的东西；invent an excuse则指编造借口，不能与发现已有事物混同。", "They hope to invent a quieter pump.", "他们希望发明更安静的水泵。", "Do not invent figures to fill the gaps.", "不要编造数字来填空缺。"],
  ["foundation", "名词·基础；基金会", "建筑基础常用复数foundations，抽象基础可单数；基金会则是独立机构义。", "The course provides a foundation for further study.", "课程为深造打下基础。", "The foundation funds local arts projects.", "基金会资助当地艺术项目。"],
  ["specialise", "动词·专攻", "常用specialise in加领域或活动，不直接接专业名称作宾语；英式常用此拼法。", "The clinic will specialise in sports injuries.", "诊所将专治运动损伤。", "Some farms specialise in organic herbs.", "有些农场专门种植有机香草。"],
  ["utilise", "动词·利用", "较正式，直接接受利用的资源；一般语境常可用use，不能因词长就认定语气更准确。", "We utilise waste heat to warm the office.", "我们利用废热给办公室供暖。", "The design can utilise existing foundations.", "设计可以利用现有地基。"],
  ["tester", "名词·测试者；测试器", "可指执行测试的人或装置；化妆品语境也可指试用品，需按所测对象判断。", "The tester reported a loose switch.", "测试人员报告开关松动。", "Use a battery tester before replacing the cell.", "换电池前先用电池测试器检查。"],
  ["facility", "名词·设施；场所", "单数可指为特定用途建立的场所，复数facilities常泛指配套设施，不只表示能力。", "The facility stores historical film.", "这处设施储存历史胶片。", "The school opened a new sports facility.", "学校开放了一处新体育设施。"],
  ["equipment", "名词·设备", "不可数，不说an equipment或equipments；一件设备可用a piece of equipment。", "The equipment fits in two cases.", "设备能装进两个箱子。", "Check every piece of equipment before departure.", "出发前检查每件设备。"],
  ["instrument", "名词·仪器；乐器", "可指测量工具或演奏工具，均可数；a musical instrument明确指乐器，依场景选择。", "The instrument measures air pressure.", "这台仪器测量气压。", "She plays a traditional string instrument.", "她演奏一种传统弦乐器。"],
  ["tool", "名词·工具", "可指手工器具，也可比喻完成任务的方法或资源；可数，常用a tool for doing。", "This tool removes damaged screws.", "这个工具能取出损坏的螺丝。", "A diary is a useful planning tool.", "日记本是实用的规划工具。"],
  ["measure", "动词·测量", "直接接受测物，measure A in B表示以B为单位测A；不等于仅估计大概数量。", "We measure rainfall in millimetres.", "我们以毫米测量降雨量。", "Please measure the shelf before ordering.", "订购前请测量架子。"],
  ["count", "动词·数；计算数量", "指逐一数出数目，直接接对象；count on someone另指依靠某人，不是数人头。", "Count the spoons before packing them.", "包装前数一数勺子。", "We count visitors at each entrance.", "我们在每个入口统计游客。"],
  ["estimate", "动词·估计", "指根据有限信息判断大致数量，常接成本或时间；与精确测量measure不同。", "Can you estimate the repair cost?", "你能估计维修费用吗？", "We estimate attendance at around eighty.", "我们估计到场人数约为八十。"],
  ["byproduct", "名词·副产品", "指生产过程伴随产生的其他产品，也可比喻附带结果；不一定全无利用价值。", "Sawdust is a byproduct of cutting timber.", "锯末是切割木材的副产品。", "The survey data were a useful byproduct.", "调查数据是个有用的附带成果。"],
  ["add", "动词·添加；相加", "add A to B表示把A加入B；add up可指把多个数字相加，留意介词方向。", "Add the herbs to the soup.", "把香草加入汤中。", "Add twelve and seven to get nineteen.", "十二加七得到十九。"],
  ["gather", "动词·收集；聚集", "可直接接资料等对象，也可不及物表示人聚在一起；不是只表示数量增长。", "We gather seeds in autumn.", "我们秋天收集种子。", "Visitors gather beside the fountain.", "游客在喷泉旁聚集。"],
  ["optics", "名词·光学", "作物理学分支名时通常接单数谓语；新闻中的the optics可另指公众观感。", "Optics is essential to telescope design.", "光学对望远镜设计至关重要。", "She studies optics in the laboratory.", "她在实验室研究光学。"],
  ["radar", "名词·雷达", "指利用无线电波探测物体的系统，常用on radar；不能和普通光学摄像机混为一谈。", "The vessel appeared on radar.", "船只出现在雷达上。", "Radar helps pilots detect distant storms.", "雷达帮助飞行员探测远处风暴。"],
  ["sensor", "名词·传感器", "可数，指探测或记录变化的装置，常用a sensor for说明用途；不必具备显示屏。", "The sensor detects movement near the door.", "传感器探测门附近的运动。", "Dust covered the temperature sensor.", "灰尘盖住了温度传感器。"],
  ["multimedia", "形容词·多媒体的", "指结合文字、声音、图像等多种媒介，常置于presentation等名词前说明形式。", "We prepared a multimedia exhibition.", "我们筹备了多媒体展览。", "The room supports multimedia teaching.", "房间支持多媒体教学。"],
  ["network", "名词·网络", "可指相互连接的设备或人与机构的联系，可数；computer network明确指计算机网络。", "The network connects three research stations.", "网络连接三个研究站。", "She built a network of local volunteers.", "她建立了当地志愿者网络。"],
  ["browser", "名词·浏览器", "指访问网页的软件，可数；与查找网页的搜索引擎search engine不是同一种概念。", "The browser opened a new tab.", "浏览器打开了新标签页。", "Update your browser before using the site.", "使用网站前更新浏览器。"],
  ["dial", "名词·刻度盘", "可指显示测量值的表盘或调节旋钮；作动词dial a number则表示拨电话号码。", "The dial shows the air pressure.", "表盘显示气压。", "Turn the dial to reduce the heat.", "转动旋钮调低温度。"],
  ["microcomputer", "名词·微型计算机", "指使用微处理器的小型计算机，带有较早期技术用语色彩；可数，不指微芯片本身。", "The museum displays an early microcomputer.", "博物馆展示一台早期微型计算机。", "This microcomputer once controlled the greenhouse.", "这台微型计算机曾控制温室。"],
  ["laptop", "名词·笔记本电脑", "可数，指便于携带且通常可合上的电脑；不是单独的键盘或显示屏名称。", "My laptop fits in this bag.", "我的笔记本电脑装得进这个包。", "She connected her laptop to the projector.", "她把笔记本电脑连到投影仪。"],
  ["software", "名词·软件", "通常不可数，不说a software或softwares；一款软件可用a program或a piece of software。", "The software organises our photographs.", "这个软件整理我们的照片。", "Install the software before connecting the scanner.", "连接扫描仪前安装软件。"],
  ["keyboard", "名词·键盘", "可指电脑键盘，也可指乐器琴键；均可数，具体含义由电脑或音乐语境决定。", "The keyboard has several worn keys.", "键盘有几个磨损的按键。", "She placed the keyboard beside the monitor.", "她把键盘放在显示器旁。"],
  ["screen", "名词·屏幕", "指显示文字或图像的表面，on the screen表在屏幕上；不等同于整台电脑。", "The screen displays the next departure.", "屏幕显示下一班出发时间。", "Keep the screen away from direct sunlight.", "让屏幕避开阳光直射。"],
  ["loudspeaker", "名词·扬声器", "可数，指把电信号转成可听声音的设备；与收集声音的microphone功能不同。", "The loudspeaker crackled during the announcement.", "广播时扬声器发出噼啪声。", "Mount the loudspeaker above the doorway.", "把扬声器装在门口上方。"],
  ["microphone", "名词·麦克风", "可数，指用于拾取声音的设备；speak into a microphone表示对着麦克风讲话。", "The microphone picked up the rain.", "麦克风录到了雨声。", "Please speak directly into the microphone.", "请直接对着麦克风讲话。"],
  ["cassette", "名词·盒式磁带", "可数，通常指装有录音或录像带的盒式装置；a cassette player指相应播放设备。", "The cassette contains interviews with former workers.", "磁带里有对昔日工人的访谈。", "She found a cassette in the recorder.", "她在录音机里找到一盒磁带。"],
  ["tape", "名词·磁带；胶带", "作录音材料时常不可数，一盘可说a tape；黏贴材料义则由sticky等搭配说明。", "The tape preserves the original interview.", "磁带保存了原始访谈。", "Seal the box with strong tape.", "用牢固的胶带封箱。"],
  ["binary", "形容词·二进制的", "计算语境指只用零和一的数字系统；也可指由两个部分组成，不能仅按数码翻译。", "The message is stored in binary form.", "消息以二进制形式储存。", "The class learned to read binary numbers.", "全班学习了读取二进制数。"],
  ["digital", "形容词·数字的", "技术义指用离散数值表示和处理信息；与连续变化的analogue相对，并非只指新设备。", "The archive stores digital copies of maps.", "档案馆保存地图的数字副本。", "A digital display replaced the old dial.", "数字显示屏取代了旧表盘。"],
  ["wireless", "形容词·无线的", "表示通过无线电等方式连接而非电线，常修饰network；不保证完全不需要电源线。", "The hall offers wireless internet access.", "大厅提供无线上网服务。", "We installed a wireless doorbell.", "我们安装了无线门铃。"],
  ["high-definition", "形容词·高清晰度的", "通常放在名词前并加连字符，说明画面等清晰度高；不等于任何大尺寸屏幕。", "The camera records high-definition video.", "相机录制高清视频。", "They installed a high-definition display.", "他们安装了高清显示屏。"],
  ["audio", "形容词·声音的", "置于equipment或recording等名词前，表示涉及声音记录或播放；不是视频画面本身。", "The archive includes audio interviews.", "档案中有音频访谈。", "Check the audio settings before recording.", "录制前检查音频设置。"],
  ["science fiction", "名词短语·科幻", "指以想象的科学发展及其影响为题材的作品，通常不可数；一部作品可用a novel。", "She writes science fiction for teenagers.", "她为青少年创作科幻小说。", "The festival includes a science fiction film.", "电影节包括一部科幻片。"],
  ["generator", "名词·发电机", "可数，常指产生电力的机器；其他语境也可指产生某种输出的装置，需看修饰词。", "The generator powers the emergency lights.", "发电机给应急灯供电。", "Keep the generator outside the building.", "把发电机放在建筑外。"],
  ["pivot", "名词·支点；枢轴", "指物体围绕旋转的固定支撑点，可数；比喻义可指处于核心地位的人或物。", "The beam turns around a central pivot.", "横梁绕中央支点转动。", "Oil the pivot before moving the arm.", "移动机械臂前给枢轴上油。"],
  ["hydraulic", "形容词·液压的", "表示利用液体压力工作，常修饰brake或pump；不同于利用气压的pneumatic。", "The truck uses a hydraulic lift.", "卡车使用液压升降装置。", "A leak damaged the hydraulic system.", "泄漏损坏了液压系统。"],
  ["sewage", "名词·污水", "通常不可数，指含生活或其他废物的废水；与指排污系统的sewerage侧重不同。", "The plant treats sewage from the town.", "工厂处理镇上的污水。", "Untreated sewage polluted the stream.", "未经处理的污水污染了小溪。"],
  ["ventilation", "名词·通风", "通常不可数，指空气流通或通风系统；good ventilation强调空气更换，不只是有窗户。", "The workshop needs better ventilation.", "车间需要更好的通风。", "Roof vents provide natural ventilation.", "屋顶通风口提供自然通风。"],
  ["simplify", "动词·简化", "直接接受简化的内容，表示减少复杂程度；不必然意味着删去所有关键细节。", "We can simplify the booking process.", "我们可以简化预订流程。", "The diagram helps simplify the explanation.", "图示帮助简化解释。"],
  ["distil", "动词·蒸馏；提炼", "蒸馏义指先汽化再冷凝分离液体；distil A into B也可指提炼要点，英式拼写单l。", "They distil water for the experiment.", "他们为实验蒸馏水。", "We distil the findings into three principles.", "我们把研究结果提炼为三条原则。"],
  ["mode", "名词·模式", "可数，常指机器运行方式，in mode表处于某模式；统计中另可指众数。", "The camera is in manual mode.", "相机处于手动模式。", "Switch to silent mode during the talk.", "讲座期间切换到静音模式。"],
  ["convert", "动词·转换", "convert A into/to B表示把A转为B；convert from A to B说明原格式和目标格式。", "We convert old recordings into digital files.", "我们把旧录音转换为数字文件。", "This device can convert sunlight into electricity.", "这个装置能把阳光转为电能。"],
  ["turn", "动词·转动；转向", "可直接接被转动物，也可不及物表示自己转动；turn left不用介词to。", "Turn the handle slowly.", "慢慢转动把手。", "Turn left after the stone bridge.", "过石桥后左转。"],
  ["error", "名词·错误", "可数，常用an error in说明出错之处；计算误差也可用error，不一定含责备。", "An error in the formula changed the result.", "公式中的错误改变了结果。", "Please report any error in the timetable.", "请报告时刻表中的任何错误。"],
  ["fault", "名词·故障；过错", "可指数设备问题，也可表示责任；at fault指有过错，不等于一切错误都由人导致。", "The technician found a fault in the cable.", "技术员发现电缆有故障。", "The delay was not your fault.", "延误不是你的过错。"],
  ["stumble", "动词·绊脚", "通常不及物，stumble over说明绊到的物体；stumble across还可指偶然发现。", "Watch your step or you may stumble.", "当心脚下，否则可能绊倒。", "I sometimes stumble over unfamiliar names.", "我有时念不顺不熟悉的名字。"],
  ["contingency", "名词·意外情况", "可数，指未来可能发生而需准备应对的事情；contingency plan指应变计划。", "We budgeted extra money for any contingency.", "我们为任何意外情况预留了资金。", "The team prepared a contingency plan.", "团队准备了应变计划。"],
  ["culture", "名词·文化", "可指群体共享的习俗与观念，具体文化可数；不是单指绘画或音乐等艺术。", "The exhibition explores coastal culture.", "展览探索沿海文化。", "Food reflects the culture of a region.", "食物反映一个地区的文化。"],
  ["civilisation", "名词·文明", "可指发展出复杂社会组织的文化体系，也可泛指人类文明；英式常用s拼写。", "The course examines an ancient civilisation.", "课程研究一个古代文明。", "Trade helped shape this civilisation.", "贸易帮助塑造了这个文明。"],
  ["epic", "名词·史诗", "可指篇幅长、讲述重大历史或英雄事件的诗歌或电影，可数；不等于任意长文章。", "The epic recounts a dangerous sea voyage.", "史诗讲述了一次危险航行。", "They adapted the epic for the stage.", "他们把史诗改编成舞台作品。"],
  ["ideology", "名词·意识形态", "指支撑某种政治或社会体系的信念集合，可数；不是单次会议的一条建议。", "The book examines the party's ideology.", "书中考察了该党的意识形态。", "Education was influenced by the dominant ideology.", "教育受到主导意识形态影响。"],
  ["tradition", "名词·传统", "指群体长期延续的信念或做法，既可泛指也可数；by tradition表示按照传统。", "The village maintains a boat-building tradition.", "村庄延续着造船传统。", "It is a family tradition to cook together.", "一起做饭是家族传统。"],
  ["custom", "名词·习俗", "可数，指长期形成的群体或个人习惯；复数customs还可指海关，须按语境判断。", "Removing shoes is a local custom.", "脱鞋是当地习俗。", "The custom has changed over generations.", "这一习俗经过几代发生了变化。"],
  ["feudalism", "名词·封建制度", "通常不可数，指基于土地与等级义务组织的社会制度；具体历史形态应按地区理解。", "The chapter discusses land ownership under feudalism.", "这一章讨论封建制度下的土地所有权。", "Feudalism shaped relations between lords and tenants.", "封建制度塑造了领主与佃户的关系。"],
  ["slavery", "名词·奴隶制", "通常不可数，指人被他人占有并强迫服从或劳动的制度与处境，涉及严肃历史议题。", "The exhibition documents resistance to slavery.", "展览记录了对奴隶制的反抗。", "The lecture examines the abolition of slavery.", "讲座考察奴隶制的废除。"],
  ["ethical", "形容词·道德的", "可表示涉及道德判断或符合道德标准；ethical question不等于已经有唯一答案。", "The project raised an ethical question.", "项目提出了一个伦理问题。", "We discussed ethical standards for interviews.", "我们讨论了访谈的道德标准。"],
  ["aboriginal", "形容词·原住民的", "指与某地原住民相关；用于澳大利亚原住民时通常大写Aboriginal，并尊重社群自称。", "The museum displays Aboriginal weaving.", "博物馆展示澳大利亚原住民编织品。", "She studies Aboriginal languages with community teachers.", "她向社群教师学习澳大利亚原住民语言。"],
  ["native", "形容词·本土的；出生地的", "物种语境常用native to表示原产于；native language指母语，不单指居住地语言。", "This fern is native to the island.", "这种蕨类原产于该岛。", "The museum offers tours in her native language.", "博物馆提供用她母语讲解的导览。"],
  ["local", "形容词·当地的", "表示与所谈特定地区有关，常置于名词前；范围由语境决定，不固定等于一个城市。", "The café buys milk from local farms.", "咖啡馆从当地农场购买牛奶。", "Ask the local librarian about old maps.", "向当地图书管理员询问旧地图。"],
  ["foreigner", "名词·外国人", "指来自另一国家的人，可数；描述身份时应结合场景，不能自动等同于移民或游客。", "As a foreigner, he needed a different form.", "作为外国人，他需要另一种表格。", "The guide welcomed every visitor, local or foreigner.", "导游欢迎每位访客，无论本地人还是外国人。"],
  ["anthropologist", "名词·人类学家", "指研究人类文化、社会或生物特征的专业人士，可数；不是考古学家的完全同义词。", "The anthropologist recorded local naming traditions.", "人类学家记录了当地命名传统。", "An anthropologist joined the research team.", "一位人类学家加入了研究团队。"],
  ["heritage", "名词·遗产", "常指从过去传下的文化、语言或建筑，通常不可数；不只指个人继承的钱财。", "The project protects the village's cultural heritage.", "项目保护村庄的文化遗产。", "Music is part of their shared heritage.", "音乐是他们共同遗产的一部分。"],
  ["antique", "名词·古董", "指因年代、稀有或工艺而有价值的旧物，可数；并非所有旧东西都可直接称为古董。", "The dealer examined the antique closely.", "古董商仔细查看了那件古董。", "This shop specialises in antique furniture.", "这家店专营古董家具。"],
  ["museum", "名词·博物馆", "可数，指收藏并展示历史、艺术或科学物品的场所；at the museum常表所在机构。", "The museum lends objects to local schools.", "博物馆向当地学校出借藏品。", "We spent the afternoon at the museum.", "我们下午在博物馆度过。"],
  ["pottery", "名词·陶器；制陶", "可指陶制品集合或制作活动，通常不可数；一件陶器可用a piece of pottery。", "The pottery was fired in a small kiln.", "这些陶器在小窑中烧制。", "She teaches pottery on Saturdays.", "她星期六教制陶。"],
  ["religion", "名词·宗教", "泛指信仰活动可不可数，某种宗教可数；讨论时区分信仰体系与具体信众个人。", "The course compares art and religion.", "课程比较艺术与宗教。", "The collection explores religion through everyday objects.", "藏品通过日常物件探索宗教。"],
  ["etiquette", "名词·礼仪", "通常不可数，指特定社交环境接受的行为规则；不同文化或场合未必采用同一规则。", "The guide explains basic dining etiquette.", "指南解释基本用餐礼仪。", "Online etiquette matters during group discussions.", "小组讨论时网络礼仪很重要。"],
  ["belief", "名词·信念", "a belief that接相信的内容，belief in接信任或相信其存在的对象；两种结构侧重不同。", "Her belief in careful planning proved useful.", "她对周密规划的信念起了作用。", "The belief that all metals sink is mistaken.", "认为所有金属都会下沉的看法是错误的。"],
  ["soul", "名词·灵魂", "可指一些宗教相信的人的精神部分，也可比喻情感深度；宗教观点不能写成普遍科学结论。", "The story follows a wandering soul.", "故事描写一个游荡的灵魂。", "Her singing has warmth and soul.", "她的歌声温暖而富于灵魂。"],
  ["spirit", "名词·精神", "可指情绪或群体态度，常见team spirit；与指一位灵体的可数义应按语境区分。", "The project strengthened team spirit.", "项目增强了团队精神。", "They welcomed us in a spirit of friendship.", "他们怀着友好的精神欢迎我们。"],
  ["hallowed", "形容词·神圣的；备受尊崇的", "常置于名词前，形容因宗教、历史或重要性而受到尊敬的地方或传统，语气较庄重。", "We entered the hallowed courtyard quietly.", "我们安静地走进神圣的庭院。", "The ceremony honours a hallowed tradition.", "仪式尊崇一项神圣传统。"],
  ["holy", "形容词·神圣的", "表示与神或宗教崇敬有关，常修饰place或book；具体神圣地位由信仰背景决定。", "Visitors removed their shoes at the holy site.", "游客在圣地脱鞋。", "The painting depicts a holy figure.", "画作描绘一位神圣人物。"],
  ["pope", "名词·教皇", "指罗马天主教会领袖，通常用the pope；作为姓名前称号时常大写Pope。", "The pope addressed the gathering.", "教皇向集会人群讲话。", "The portrait shows a former pope.", "肖像描绘了一位前任教皇。"],
  ["bishop", "名词·主教", "指某些基督教会中的高级神职人员；国际象棋中另指象，不能依字面混用。", "The bishop attended the anniversary service.", "主教出席了周年礼拜。", "The bishop moved diagonally across the board.", "象沿对角线穿过棋盘。"],
  ["missionary", "名词·传教士", "可数，指被派往某地传播宗教的人；不等于所有公益工作者或国外教师。", "The missionary learned the local language.", "传教士学习了当地语言。", "Her diary describes life as a missionary.", "她的日记描述了传教士生活。"],
  ["monk", "名词·修士；僧侣", "可数，指宗教团体中通常过共同清修生活的男性；不同传统的生活制度有所区别。", "The monk tended the courtyard garden.", "僧侣照料庭院花园。", "A monk showed us the old manuscripts.", "一位修士给我们看了旧手稿。"],
  ["temple", "名词·寺庙", "指某些宗教的礼拜建筑，可数；解剖语境中的temple另指太阳穴，不要混淆。", "The temple stands above the river.", "寺庙矗立在河流上方。", "Visitors waited outside the temple gate.", "游客在寺门外等候。"],
  ["pagoda", "名词·宝塔", "指亚洲宗教建筑中的多层塔形结构，通常各层有突出的屋檐；不是所有寺庙建筑。", "The pagoda rises above the trees.", "宝塔高出树林。", "We sketched the pagoda from the courtyard.", "我们从庭院写生宝塔。"],
  ["chronology", "名词·年代顺序", "可指事件发生的次序或按时间排列的记录；a chronology of说明所整理的事件。", "The chronology begins with the first voyage.", "年代记录从首次航行开始。", "We checked the chronology against the letters.", "我们参照书信核对事件顺序。"],
  ["king", "名词·国王", "可数，指男性君主；the king用于特定国王，作为姓名前称号时通常大写King。", "The king appears on the old coin.", "旧硬币上有国王肖像。", "The play follows a young king.", "戏剧描写一位年轻国王。"],
  ["queen", "名词·女王；王后", "可指女性在位君主或国王配偶，两者地位不同；必须依据具体历史背景翻译。", "The queen opened the new gallery.", "女王为新画廊揭幕。", "The painting shows the queen and her children.", "画作描绘王后与她的孩子。"],
  ["prince", "名词·王子；亲王", "可指男性王室成员或某些国家的统治者，称号意义随制度不同；不能总译为国王之子。", "The prince studied the old navigation chart.", "王子研究了旧航海图。", "A portrait of the prince hung above the stairs.", "楼梯上方挂着亲王肖像。"],
  ["princess", "名词·公主；王妃", "可指王室女性成员或王子的妻子；中文译法须依据人物身份，而非只按一个固定词义。", "The princess visited the restored theatre.", "公主参观了修复后的剧院。", "The princess wore a simple silver bracelet.", "王妃戴着简洁的银手镯。"],
  ["majesty", "名词·威严；陛下", "表示宏伟威严时不可数；Your Majesty是直接称呼君主的敬称，两个词通常大写。", "The mountain's majesty impressed the travellers.", "大山的雄伟让旅行者印象深刻。", "Welcome to the exhibition, Your Majesty.", "陛下，欢迎莅临展览。"],
  ["nobility", "名词·贵族；高尚", "the nobility可统指贵族阶层；不可数的nobility也可指品格高尚，要按语境区分。", "The nobility owned much of the land.", "贵族阶层拥有大部分土地。", "The poem praises the nobility of her actions.", "诗歌赞颂她行为的高尚。"],
  ["lord", "名词·贵族；领主", "可指有爵位的男性或历史领主；作为称号置于姓名前通常大写，不能泛称所有男人。", "The lord leased land to several families.", "领主把土地租给几户人家。", "The portrait depicts a local lord.", "肖像描绘一位当地贵族。"],
  ["knight", "名词·骑士；爵士", "可指中世纪骑兵或获授荣誉爵位的人；现代爵位并不意味着受封者参与战斗。", "The knight carried a painted shield.", "骑士拿着彩绘盾牌。", "The actor became a knight for his work.", "演员因其工作获封爵士。"],
  ["nostalgia", "名词·怀旧", "通常不可数，含对过去的温暖回忆与些许伤感，常用nostalgia for；不只表示悲伤。", "The old song filled her with nostalgia.", "老歌让她满怀怀旧之情。", "He felt nostalgia for the seaside town.", "他怀念那个海滨小镇。"],
  ["background", "名词·背景", "可指图像后景或人的经历出身；in the background指在后景，含义由语境决定。", "A windmill appears in the background.", "背景中有一座风车。", "Her background in chemistry helped the project.", "她的化学背景有助于项目。"],
  ["experience", "名词·经验；经历", "表示积累的知识时不可数，表示一次经历时可数；a useful experience与much experience用法不同。", "The role requires experience in editing.", "这个职位需要编辑经验。", "The voyage was an unforgettable experience.", "航行是一次难忘经历。"],
  ["accident", "名词·事故；偶然", "可指非故意发生的意外，by accident固定表示偶然；不是by an accident来表达一般方式。", "The accident blocked the narrow road.", "事故堵住了狭窄道路。", "I found the letter by accident.", "我偶然发现了那封信。"],
  ["setback", "名词·挫折", "可数，指让进展受阻的事件，常用a setback for；不必意味着永久失败。", "The storm was a setback for the repairs.", "风暴使维修进展受挫。", "They recovered quickly from the setback.", "他们很快从挫折中恢复。"],
  ["adversity", "名词·逆境", "通常不可数，指困难或不幸的处境；in adversity表示身处逆境，语体较正式。", "The team showed patience in adversity.", "团队在逆境中展现了耐心。", "Her letters describe years of adversity.", "她的书信描述了多年的困境。"],
  ["language", "名词·语言", "某种语言可数，泛指语言交流能力可不可数；一种语言名称通常不加the。", "The island has its own language.", "该岛有自己的语言。", "Gesture is an important part of language.", "手势是语言的重要部分。"],
  ["symbol", "名词·符号；象征", "a symbol of表示象征某种观念，a symbol for表示代表某物的符号，两种介词侧重不同。", "A circle became the group's symbol of unity.", "圆形成了这个群体团结的象征。", "This symbol stands for a railway station.", "这个符号代表火车站。"],
  ["gesture", "名词·手势；举动", "可指传达意思的身体动作，也可指表达态度的行动；a gesture of kindness表善意举动。", "She answered with a small gesture.", "她用一个小手势回答。", "The gift was a gesture of thanks.", "礼物是表达感谢的举动。"],
  ["handwriting", "名词·笔迹", "通常不可数，指用笔书写的样式或文字；不能用handwritings泛指多个人的书写材料。", "Her handwriting is easy to read.", "她的笔迹容易辨认。", "I recognised his handwriting on the envelope.", "我认出了信封上他的笔迹。"],
  ["pictograph", "名词·象形符号", "可数，指用图像表达事物或观念的符号；不等于任何装饰画或照片。", "The pictograph represents flowing water.", "这个象形符号表示流水。", "A pictograph marks the cave entrance.", "洞口有一个象形符号标记。"],
  ["wedge", "名词·楔子；楔形块", "指一端薄而另一端较厚的物体，可用于固定门；a wedge of可指楔形食物块。", "Put a wedge under the door.", "把楔子塞在门下。", "She added a wedge of lemon.", "她加了一角柠檬。"],
  ["knot", "名词·结", "指绳线系成的结，可数；tie a knot表示打结，untie表示解结，不是裁断。", "Tie a knot at the end.", "在末端打个结。", "The knot held despite the wind.", "尽管风大，绳结仍很牢固。"],
  ["linguistics", "名词·语言学", "作为学科虽以s结尾，通常接单数谓语；研究语言结构与发展，不等于会多种语言。", "Linguistics is part of her degree.", "语言学是她学位课程的一部分。", "He studies linguistics rather than literature.", "他研究语言学而非文学。"],
  ["semantic", "形容词·语义的", "表示涉及词语意义，常修饰difference或change；不同于词序结构层面的syntactic。", "The two terms have a semantic difference.", "这两个词在语义上有差别。", "The paper traces semantic change over time.", "论文追踪语义随时间的变化。"],
  ["syntax", "名词·句法", "通常不可数，指词语构成句子的排列规则；计算机语言中也可指表达式的结构规则。", "The lesson compares English and French syntax.", "这一课比较英法句法。", "The editor explained the sentence's unusual syntax.", "编辑解释了句子不寻常的句法。"],
  ["grammar", "名词·语法", "泛指语言规则时通常不可数，一本语法书可用a grammar；不只是标点或拼写。", "The course teaches grammar through short dialogues.", "课程通过短对话教语法。", "Good grammar makes the instructions clearer.", "正确语法让说明更清晰。"],
  ["phonetics", "名词·语音学", "作为学科名通常接单数谓语，研究语音的产生等特点；不是单独指一个音素。", "Phonetics helps us describe speech sounds.", "语音学帮助我们描述语音。", "She took a course in phonetics.", "她修了一门语音学课程。"],
  ["pronounce", "动词·发音", "pronounce a word指读出单词；不把名词pronunciation的拼写机械套入动词。", "How do you pronounce this surname?", "这个姓怎么读？", "Please pronounce the final consonant clearly.", "请清楚地发出末尾辅音。"],
  ["intonation", "名词·语调", "通常不可数，指说话音高的升降变化；能改变语气含义，不等同于音量大小。", "Her intonation made it sound like a question.", "她的语调让它听起来像疑问句。", "Listen to the speaker's rising intonation.", "听说话者的升调。"],
  ["inflection", "名词·词形变化；语调变化", "语法中指词形随语法功能变化；语音中也可指声音起伏，须按上下文区分。", "The suffix marks an inflection of the verb.", "后缀标记动词的词形变化。", "A slight inflection changed the question's tone.", "轻微的语调变化改变了问题的语气。"],
  ["accent", "名词·口音；重音符号", "口音指某地区或群体的发音方式，可数；不是说话者英语水平高低的直接指标。", "Her accent reminded me of my aunt.", "她的口音让我想起姑妈。", "Put an accent above the final letter.", "在最后一个字母上加重音符号。"],
  ["utterance", "名词·话语", "可数，指说出口的一段话，不必是一句完整的语法句；常用于语言研究语境。", "The recording contains a single utterance.", "录音包含一段话语。", "Each utterance was transcribed separately.", "每段话语都被分别转写。"],
  ["oral", "形容词·口头的；口腔的", "oral exam指口试，oral hygiene指口腔卫生；需通过所修饰名词判断具体含义。", "The course ends with an oral exam.", "课程以口试结束。", "The clinic provides oral health education.", "诊所提供口腔健康教育。"],
  ["phoneme", "名词·音素", "指能在某语言中区分词义的语音单位，可数；与书写字母并非一一对应。", "The class practised one difficult phoneme.", "全班练习了一个难音素。", "Changing a phoneme can change the word.", "改变一个音素可能改变单词。"],
  ["vowel", "名词·元音", "可指发音时气流不受明显阻碍的语音，也可指表示这种音的字母；字母与声音须区分。", "The word begins with a vowel sound.", "这个词以元音开头。", "Listen carefully to the second vowel.", "仔细听第二个元音。"],
  ["consonant", "名词·辅音", "可指气流受到阻碍形成的语音或相应字母，均可数；不等于所有非英语字母。", "The final consonant is silent.", "末尾辅音字母不发音。", "Repeat the consonant before adding the vowel.", "加入元音前先重复辅音。"],
  ["logogram", "名词·语素文字；表词符号", "指代表一个词或有意义单位的书写符号，可数；不是所有图像或单个字母。", "The logogram represents a complete word.", "该符号表示一个完整单词。", "The chart pairs each logogram with its meaning.", "图表把每个表词符号与意义配对。"],
  ["vocabulary", "名词·词汇量；词汇", "泛指一个人或领域使用的词语集合，通常不可数；一个具体单词应说a word。", "Reading widely expands your vocabulary.", "广泛阅读扩大词汇量。", "The guide explains the vocabulary of weaving.", "指南解释纺织领域的词汇。"],
  ["diction", "名词·吐字", "通常不可数，指说话发音表达的方式，常用clear diction；不同于词典dictionary。", "The actor's diction made every word clear.", "演员的吐字让每个词都清楚可辨。", "Singing lessons improved her diction.", "歌唱课改善了她的吐字。"],
  ["idiom", "名词·习语", "可数，指整体含义不能完全从各单词字面推得的固定表达；使用时需注意语境。", "This idiom sounds informal in a report.", "这个习语在报告中显得非正式。", "The teacher explained the idiom with a story.", "教师用故事解释了习语。"],
  ["phrase", "名词·短语", "指一组构成表达单位的词，通常不足以独立成句；也可指常用说法，依语法语境判断。", "Underline the phrase that describes the house.", "给描述房子的短语画下划线。", "The phrase appears in several letters.", "这个说法出现在几封信里。"],
  ["clause", "名词·分句；条款", "语法中指通常含主语与限定动词的单位；法律中指合同或法规的一条规定。", "The second clause explains the reason.", "第二个分句解释了原因。", "Read the cancellation clause before signing.", "签名前阅读取消条款。"],
  ["expression", "名词·表达；表情", "可指一种措辞或面部神态，常用an expression of加感受；不是所有情况都译成公式。", "Her expression changed when she saw the letter.", "她看到信后表情变了。", "This expression is common in informal speech.", "这个表达常见于非正式口语。"],
  ["tense", "名词·时态", "语法中指动词形式体现的时间关系，可数；作形容词时另表示紧张，勿混译。", "Which tense fits this sentence?", "哪个时态适合这个句子？", "The verb changes tense in the final paragraph.", "动词在最后一段改变了时态。"],
  ["prefix", "名词·前缀", "指加在词前构成新词的字母或字母组，可数；与加在末尾的suffix位置不同。", "The prefix changes the word's meaning.", "前缀改变词义。", "Underline the prefix in each example.", "给每个例子中的前缀画下划线。"],
  ["suffix", "名词·后缀", "指加在词尾形成新词或词形的字母组，可数；注意不是随意截取任何结尾字母。", "This suffix often forms an adjective.", "这个后缀常构成形容词。", "Circle the suffix in the longer word.", "圈出较长单词中的后缀。"],
  ["abbreviation", "名词·缩写", "指一个词或短语的缩短形式，可数；是否使用句点或大写由具体缩写惯例决定。", "The abbreviation appears in the footnote.", "缩写出现在脚注中。", "Explain each abbreviation when it first appears.", "每个缩写首次出现时应说明。"],
  ["antonym", "名词·反义词", "常用an antonym of/for说明相对的词；同一单词在不同义项下可能有不同反义词。", "Give an antonym for the highlighted word.", "给出高亮单词的反义词。", "The worksheet pairs each adjective with an antonym.", "练习单将每个形容词与反义词配对。"],
  ["noun", "名词·名词", "指可命名人、事物、地点或抽象概念的词；是否可数须按具体义项判断。", "This noun has an irregular plural.", "这个名词有不规则复数。", "Find the noun after the adjective.", "找出形容词后的名词。"],
  ["singular", "形容词·单数的", "语法中描述指一个人或事物的形式，常用singular noun；不要因词尾有s就一律判复数。", "Use a singular verb after this subject.", "这个主语后用单数动词。", "Write the singular form beside the plural.", "在复数旁写出单数形式。"],
  ["pronoun", "名词·代词", "指代替名词或名词短语的词，可数；指代必须让读者清楚对应的人或事物。", "The pronoun refers to the second speaker.", "代词指第二位说话者。", "Replace the repeated name with a pronoun.", "用代词替换重复的人名。"],
  ["verb", "名词·动词", "表示动作或状态等的词，可数；一个动词能否直接接宾语需看具体义项和用法。", "The verb agrees with the subject.", "动词与主语一致。", "Choose a verb that describes the movement.", "选一个描述该动作的动词。"],
  ["adjective", "名词·形容词", "指描述名词或代词的词，常位于名词前或连系动词后；不能任意用来修饰动作。", "The adjective describes the fabric's texture.", "形容词描述布料的质地。", "Put the adjective before the noun.", "把形容词放在名词前。"],
  ["adverb", "名词·副词", "可修饰动词、形容词等，可数；并非所有副词都以-ly结尾，需要按功能判断。", "This adverb tells us how she walked.", "这个副词说明她走路的方式。", "The adverb modifies the following adjective.", "副词修饰后面的形容词。"],
  ["preposition", "名词·介词", "通常置于名词短语或代词前表达关系，可数；动词后的介词需按具体搭配学习。", "Choose the preposition that fits the sentence.", "选择适合句子的介词。", "The pronoun follows a preposition here.", "这里代词位于介词之后。"],
  ["complicated", "形容词·复杂的", "表示包含多部分或难理解的关系，常修饰process；不自动表示无用或无法解决。", "The instructions seem unnecessarily complicated.", "说明似乎过于复杂。", "We found a simpler route through the complicated layout.", "我们在复杂布局中找到了更简单的路线。"],
  ["eloquence", "名词·雄辩；表达力", "通常不可数，强调清晰而有感染力的表达；不单指讲话很快或使用长词。", "Her eloquence held the audience's attention.", "她的口才吸引了观众注意。", "The letter has a quiet eloquence.", "这封信具有平静的感染力。"],
  ["communicate", "动词·交流；传达", "communicate with接交流对象，communicate information to接信息接收者；不混淆介词角色。", "We communicate with the team by radio.", "我们通过无线电与团队交流。", "Pictures can communicate complex ideas.", "图片能够传达复杂想法。"],
  ["discussion", "名词·讨论", "a discussion about/on说明议题；hold a discussion表示组织讨论，动词discuss则不另接about。", "The discussion focused on safer routes.", "讨论聚焦更安全的路线。", "We had a discussion about the timetable.", "我们讨论了时刻表。"],
  ["brainstorm", "动词·集思广益", "指先快速提出许多想法再筛选，直接接ideas等内容；不等于立即作出最后决定。", "Let's brainstorm possible names for the club.", "让我们集思广益为社团起名。", "We brainstorm solutions before judging them.", "我们先集思广益想方案，再评价。"],
  ["debate about", "名词短语·关于……的辩论", "在a debate about中about引出议题；动词debate可直接接议题，学习时要分清结构。", "The debate about parking lasted an hour.", "关于停车的辩论持续了一小时。", "A debate about school meals followed the survey.", "调查后展开了关于校餐的辩论。"],
  ["negotiate", "动词·协商", "negotiate with接协商对象，negotiate over/on接议题；直接接合同等可指谈妥该事项。", "We negotiate with suppliers each spring.", "我们每年春天与供应商协商。", "They will negotiate a new lease.", "他们将商议新租约。"],
  ["negotiation", "名词·谈判", "过程义可不可数，具体谈判常用复数negotiations；常用negotiation with/over区分双方与议题。", "The price is open to negotiation.", "价格可以协商。", "The negotiation ended without an agreement.", "谈判未达成协议就结束了。"],
  ["press", "名词·新闻界", "the press统指报刊记者等媒体群体；动词press则指按压，需由句法位置判断。", "The press waited outside the theatre.", "记者们在剧院外等候。", "She declined to speak to the press.", "她拒绝向媒体发言。"],
  ["journalist", "名词·记者", "可数，指采写或播报新闻的人；并非所有写私人博客的人都以此为职业。", "The journalist interviewed the rescue team.", "记者采访了救援队。", "A local journalist requested the public records.", "一位当地记者索取公共记录。"],
  ["commentator", "名词·评论员；解说员", "可指现场描述比赛的人或分析时事的人；不等于所有参加讨论的普通观众。", "The commentator explained the unusual penalty.", "解说员解释了不常见的处罚。", "A political commentator analysed the speech.", "一位政治评论员分析了演讲。"],
  ["exponent", "名词·倡导者；指数", "a leading exponent of可指某思想或技艺的重要代表；数学义则指幂的指数。", "She is an exponent of traditional weaving.", "她是传统编织技艺的代表人物。", "The exponent tells us the power.", "指数告诉我们幂次。"],
  ["announcer", "名词·播音员", "指在广播、电视或活动中发布信息的人，可数；与持续评论比赛的commentator侧重不同。", "The announcer read the revised departure times.", "播音员读出了修改后的出发时间。", "The announcer introduced the next performer.", "报幕员介绍了下一位表演者。"],
  ["correspondent", "名词·通讯记者", "可指驻某地或负责某领域的记者，也可指通信者；foreign correspondent表驻外记者。", "The correspondent reported from the harbour.", "通讯记者从港口发回报道。", "Our science correspondent interviewed the researchers.", "我们的科学记者采访了研究人员。"],
  ["messenger", "名词·信使", "可数，指传递口信或文件的人；don't shoot the messenger表示不迁怒于传话者。", "The messenger delivered a sealed envelope.", "信使送来一个密封信封。", "A messenger waited at the side entrance.", "一名信使在侧门等候。"],
  ["editor", "名词·编辑", "指修改整理出版内容或负责刊物的人，可数；不一定就是作品的原作者。", "The editor shortened the final paragraph.", "编辑缩短了最后一段。", "Ask the editor to check the captions.", "请编辑检查图片说明。"],
  ["typist", "名词·打字员", "可指以打字为职业的人；a fast typist也可描述某人打字快，不必是其正式职业。", "The typist prepared three copies.", "打字员准备了三份副本。", "She became a fast typist through practice.", "她通过练习提高了打字速度。"],
  ["propaganda", "名词·宣传", "通常不可数，指为影响观点而选择性传播的信息，常带批评色彩；不是所有信息告知。", "The poster was designed as propaganda.", "这张海报被设计为宣传品。", "The museum explains how propaganda shaped opinion.", "博物馆解释宣传如何塑造舆论。"],
  ["publish", "动词·出版；公布", "可指印行作品或让信息公开，直接接书或结果等内容；不只限于纸质出版。", "The archive will publish the letters online.", "档案馆将在线公布这些信。", "They publish a monthly science magazine.", "他们出版一本科学月刊。"],
  ["disseminate", "动词·传播", "较正式，常接information或findings，强调广泛传递；不必表示信息已被所有接收者接受。", "The network helps disseminate research findings.", "网络帮助传播研究结果。", "We disseminate safety updates by email.", "我们通过邮件发布安全更新。"],
  ["expect", "动词·预料；期待", "expect someone to do表示预期某人做事，也可接that从句；不说expect for something。", "We expect the parcel to arrive tomorrow.", "我们预计包裹明天到。", "Do not expect an immediate reply.", "不要期待立即回复。"],
  ["pastime", "名词·消遣", "可数，指为了娱乐在空闲时间从事的活动；不是past time两个词表示过去时间。", "Birdwatching became her favourite pastime.", "观鸟成了她最喜欢的消遣。", "Drawing is an inexpensive pastime.", "画画是一种花费不多的消遣。"],
  ["entertain", "动词·使娱乐；招待", "可直接接观众表示使其愉快，也可接客人表示招待；不是所有娱乐活动都需舞台。", "The puppets entertain children of all ages.", "木偶逗乐各年龄的孩子。", "We rarely entertain guests during the week.", "我们工作日很少招待客人。"],
  ["recreation", "名词·娱乐活动", "娱乐义通常不可数，指工作之外的休闲；重建义re-creation则含义不同，要注意语境。", "The park provides space for recreation.", "公园提供休闲空间。", "Swimming is her main form of recreation.", "游泳是她主要的休闲方式。"],
  ["gossip", "名词·闲话", "谈他人私事的信息通常不可数；a gossip可指爱说闲话的人，不代表信息已核实。", "Office gossip spread quickly after lunch.", "午饭后办公室闲话传得很快。", "She avoids gossip about her neighbours.", "她避免谈论邻居的私事。"],
  ["rumour", "名词·传闻", "可数，指未被正式证实而流传的消息；英式rumour，美式rumor，不应写成已确认事实。", "A rumour spread about the closure.", "有关关闭的传闻流传开来。", "The manager denied the rumour.", "经理否认了传闻。"],
  ["feast", "名词·盛宴", "可数，指丰盛或庆祝用的大餐；a feast for the eyes比喻视觉上的享受。", "The village prepared a harvest feast.", "村庄准备了丰收盛宴。", "The exhibition is a feast for the eyes.", "展览令人赏心悦目。"],
  ["programme", "名词·节目；计划", "英式常用于节目和活动计划；计算机程序通常即使在英式英语也拼program。", "The programme features local musicians.", "节目以当地音乐家为特色。", "We joined a summer reading programme.", "我们参加了暑期阅读计划。"],
  ["programmer", "名词·程序员", "可数，指编写计算机程序的人；拼写与programme活动安排不同，采用programmer。", "The programmer fixed the import error.", "程序员修复了导入错误。", "A programmer helped automate the catalogue.", "程序员帮助实现目录自动化。"],
  ["simulate", "动词·模拟", "指创造与真实情况相似的条件，直接接过程或环境；不表示被模拟事件真的发生。", "The model can simulate heavy rainfall.", "模型能模拟强降雨。", "Students simulate a rescue in shallow water.", "学生在浅水中模拟救援。"],
  ["simulative", "形容词·模拟的", "较少见，表示具有模拟或模仿性质；一般行文常可用simulated，具体搭配宜查专业语境。", "The exercise includes a simulative component.", "练习包含模拟部分。", "The study compares analytical and simulative methods.", "研究比较分析方法与模拟方法。"],
  ["circus", "名词·马戏团", "可指表演团体或其演出，可数；现代马戏不一定包含动物表演，勿作为必要条件。", "The circus erected a tent beside the river.", "马戏团在河边搭起帐篷。", "We watched the circus from the front row.", "我们在前排观看马戏表演。"],
  ["concert", "名词·音乐会", "指音乐家或歌手的现场演出，可数；at a concert表示在音乐会上，不通常用on。", "The concert raised money for the library.", "音乐会为图书馆筹款。", "She played violin at the concert.", "她在音乐会上拉小提琴。"],
  ["musicale", "名词·小型音乐会", "较少见，通常指非正式或社交性质的音乐聚会；不要与形容词musical或音乐剧混淆。", "They hosted a musicale in the drawing room.", "他们在客厅举办小型音乐会。", "The musicale ended with a violin duet.", "小型音乐会以小提琴二重奏结束。"],
  ["concertmaster", "名词·乐团首席小提琴手", "主要为美式称谓，指交响乐团中领奏的小提琴手；英式常称leader，不是指挥。", "The concertmaster tuned the orchestra.", "首席小提琴手带领乐团调音。", "The concertmaster played the opening solo.", "首席小提琴手演奏开场独奏。"],
  ["opera", "名词·歌剧", "可指主要以歌唱呈现的戏剧作品，可数；泛指艺术形式时常不可数，注意a的使用。", "The opera tells the story of a sailor.", "歌剧讲述一个水手的故事。", "She studies opera at the conservatory.", "她在音乐学院学习歌剧。"],
  ["tragedy", "名词·悲剧", "可指结局悲惨的戏剧，也可指造成巨大痛苦的事件；不要把日常小麻烦都按此强度描述。", "The theatre staged a classical tragedy.", "剧院上演了一部古典悲剧。", "The flood was a tragedy for the village.", "洪灾是村庄的一场悲剧。"],
  ["animation", "名词·动画；生气", "制作或呈现活动图像时通常不可数；with animation还可指带着热情和活力。", "The animation explains how the pump works.", "动画解释水泵如何运作。", "She spoke with unusual animation.", "她说话时格外有活力。"],
  ["x-rated", "形容词·限制成人观看的", "通常指含露骨性内容等而不适合儿童的作品，例句常大写X-rated；评级标准因地区而异。", "The cinema restricted entry to the X-rated film.", "影院限制观看这部成人级电影的入场资格。", "The review described the comedy as X-rated.", "评论将这部喜剧描述为成人级作品。"],
  ["artistic", "形容词·艺术的", "可指与艺术有关或具艺术才能，常修饰work或ability；不等于作品必然受所有人喜欢。", "The project encourages artistic expression.", "项目鼓励艺术表达。", "She has considerable artistic ability.", "她有相当强的艺术才能。"],
  ["craftsman", "名词·工匠", "传统上指有手工技艺的男性，可数；泛指不同性别从业者时也可用craftsperson。", "The craftsman repaired the carved screen.", "工匠修复了雕花屏风。", "A skilled craftsman made the violin.", "一位熟练工匠制作了小提琴。"],
  ["role", "名词·角色；作用", "a role in表示在某活动中的作用，play a role可指发挥作用或扮演角色。", "She plays a central role in the project.", "她在项目中发挥核心作用。", "He accepted a small role in the play.", "他接受了剧中的小角色。"],
  ["scene", "名词·场景；一场", "可指戏剧电影中的连续段落或所见景象，可数；不必与整幕act等同。", "The scene takes place in a kitchen.", "这一场发生在厨房。", "We painted the river scene from memory.", "我们凭记忆画出河边景象。"],
  ["stage", "名词·舞台；阶段", "on stage表示在舞台上，at this stage表示现阶段；介词不同对应具体含义。", "The stage was lit with blue light.", "舞台被蓝光照亮。", "At this stage, we need more evidence.", "现阶段我们需要更多证据。"],
  ["gallery", "名词·画廊", "可指展示艺术品的房间或机构，也可指高处看台；不一定所有画廊都销售作品。", "The gallery displays local pottery.", "画廊展示当地陶器。", "We sat in the gallery above the hall.", "我们坐在大厅上方的楼座。"],
  ["exhibition", "名词·展览", "可数，an exhibition of说明展出内容；不是每件展品本身，单件展品用exhibit。", "The exhibition opens on Saturday.", "展览星期六开幕。", "We visited an exhibition of early photographs.", "我们参观了早期摄影作品展。"],
  ["opt", "动词·选择", "常用opt for接选项，opt to do接行动；opt out of则表示退出，不可省略搭配差别。", "We opt for the cheaper route.", "我们选择较便宜的路线。", "Some visitors opt to walk back.", "有些游客选择步行返回。"],
  ["photography", "名词·摄影", "通常不可数，指拍摄照片的活动或技艺；一张照片用a photograph，不用a photography。", "Flash photography is prohibited inside.", "室内禁止闪光摄影。", "The course introduces wildlife photography.", "课程介绍野生动物摄影。"],
  ["draw", "动词·画", "通常指用铅笔或钢笔等画线形成图像，过去式drew；与用颜料作画的paint侧重不同。", "Draw the outline before adding colour.", "上色前先画轮廓。", "Can you draw a map of the route?", "你能画一张路线图吗？"],
  ["describe", "动词·描述", "describe something to someone说明向谁描述；不能直接说describe someone something表示给某人描述。", "Please describe the missing bag.", "请描述丢失的包。", "Can you describe the scene to us?", "你能给我们描述场景吗？"],
  ["musical", "形容词·音乐的", "可指与音乐相关或有音乐才能；作名词a musical则指音乐剧，需按句法位置判断。", "The archive contains musical manuscripts.", "档案中有音乐手稿。", "Her family is very musical.", "她家人很有音乐天赋。"],
  ["solo", "名词·独奏；独唱", "可数，指由一人完成的音乐段落或表演；play a solo表演独奏，不等于整场都无伴奏。", "The flute solo opened the concert.", "长笛独奏拉开音乐会序幕。", "She played a short solo after the chorus.", "合唱之后她演奏了短独奏。"],
  ["tune", "名词·曲调", "可数，指可辨认的旋律；in tune和out of tune分别表示音准正确与走调。", "I recognised the tune immediately.", "我立刻认出了曲调。", "The choir sang in tune throughout.", "合唱团全程音准准确。"],
  ["disc", "名词·圆盘；唱片", "可指扁平圆形物体或光盘等载体；英式常拼disc，某些计算机存储术语采用disk。", "The disc contains the complete interview.", "光盘包含完整访谈。", "A metal disc covers the opening.", "一个金属圆盘盖住开口。"],
  ["violin", "名词·小提琴", "可数，指四弦弓弦乐器；play the violin常加the，指具体乐器可用a violin。", "The violin needs a new string.", "小提琴需要一根新弦。", "She practises the violin before school.", "她上学前练小提琴。"],
  ["harmonica", "名词·口琴", "可数，指以口吹吸发声的小型乐器；不是手风琴accordion，注意乐器名称区别。", "The harmonica fits in his pocket.", "口琴能放进他的口袋。", "He played a folk tune on the harmonica.", "他用口琴吹奏了民间曲调。"],
  ["trumpet", "名词·小号", "指吹奏的铜管乐器，可数；动词还可形容大象鸣叫，需按音乐或动物语境判断。", "The trumpet sounded above the drums.", "小号声盖过了鼓声。", "She borrowed a trumpet for the concert.", "她借了一把小号参加音乐会。"],
  ["flute", "名词·长笛", "指通常横向吹奏的管乐器，可数；玻璃器皿中的flute另指细长高脚杯。", "The flute carries the main melody.", "长笛演奏主旋律。", "He placed the flute in its case.", "他把长笛放进盒子。"],
  ["competition", "名词·比赛；竞争", "具体赛事可数，竞争状态通常不可数；enter a competition表示报名参赛。", "The competition attracted young designers.", "比赛吸引了年轻设计师。", "There is strong competition for each place.", "每个名额都有激烈竞争。"],
  ["compete", "动词·比赛；竞争", "compete in接赛事，compete with/against接对手，compete for接争取的目标。", "Teams compete for a place in the final.", "各队争夺决赛名额。", "She will compete in the cycling event.", "她将参加自行车比赛。"],
  ["sponsorship", "名词·赞助", "通常不可数，指为活动或个人提供的资金支持；不必表示赞助方拥有所支持的项目。", "The club depends on local sponsorship.", "俱乐部依靠当地赞助。", "Sponsorship covered the cost of transport.", "赞助支付了交通费用。"],
  ["spectator", "名词·观众", "可数，尤指观看体育活动的人；与亲自参加的participant角色不同，仍可付费观看。", "Each spectator received a printed guide.", "每位观众收到一份印刷指南。", "The spectator waved from the front row.", "观众从前排挥手。"],
  ["volunteer", "名词·志愿者", "可数，指自愿提供帮助的人；volunteer to do作动词表示自愿做事，不直接等同所有无薪工作。", "A volunteer showed us the accessible entrance.", "志愿者给我们指了无障碍入口。", "We need a volunteer to carry the map.", "我们需要一位志愿者拿地图。"],
  ["well-known", "形容词·著名的", "常用well-known for说明出名原因；名词前通常加连字符，所指名气范围可大可小。", "The well-known artist opened the exhibition.", "著名艺术家为展览揭幕。", "The village is well-known for its pottery.", "这个村庄以陶器闻名。"],
  ["stadium", "名词·体育场", "可数，通常指有看台的大型运动场地；不同于室内健身房gym或普通游乐场。", "The stadium has four public entrances.", "体育场有四个公众入口。", "Fans filled the stadium before noon.", "中午前球迷坐满了体育场。"],
  ["exercise", "名词·锻炼；练习题", "身体锻炼活动通常不可数；具体动作或学习练习可数，an exercise in说明训练内容。", "Regular exercise improves her mood.", "经常锻炼改善了她的心情。", "Complete the final exercise before lunch.", "午饭前完成最后一道练习。"],
  ["indoor", "形容词·室内的", "放在名词前，如indoor pool；说明在室内的地点状语应用indoors，不能机械互换。", "The hotel has an indoor pool.", "酒店有室内游泳池。", "Indoor plants need adequate light.", "室内植物需要足够光照。"],
  ["outdoor", "形容词·户外的", "主要置于名词前，如outdoor activities；表示动作在户外发生则通常用副词outdoors。", "The school organises outdoor activities.", "学校组织户外活动。", "We bought an outdoor table.", "我们买了一张户外桌。"],
  ["movement", "名词·动作；运动", "可指数身体或物体的位置变化，也可指社会运动；是否可数需按具体含义判断。", "The sensor detected a slight movement.", "传感器检测到轻微移动。", "The movement campaigns for cleaner rivers.", "该运动倡导更清洁的河流。"],
  ["sprawl", "动词·伸展四肢；蔓延", "人作主语可指懒散地摊开四肢，城市作主语可指向外扩展；常接across或over。", "The children sprawl on the carpet.", "孩子们摊开四肢躺在地毯上。", "Suburbs sprawl across the valley.", "郊区蔓延到整个山谷。"],
  ["badminton", "名词·羽毛球运动", "作为运动名通常不可数，play badminton不加冠词；球拍和羽毛球本体另有名称。", "We play badminton after class.", "我们课后打羽毛球。", "Badminton requires quick changes of direction.", "羽毛球需要快速变向。"],
  ["billiards", "名词·台球", "运动名以s结尾但通常接单数谓语；具体玩法因地区不同，不直接等于所有球类运动。", "Billiards is popular at the club.", "台球在俱乐部很受欢迎。", "They played billiards after supper.", "他们晚饭后打台球。"],
  ["soccer", "名词·足球", "尤为美式用语，指双方各十一人用脚等踢球入门的运动；英式通常称football。", "They play soccer in the park.", "他们在公园踢足球。", "The school formed a girls' soccer team.", "学校组建了女子足球队。"],
  ["tennis", "名词·网球", "运动名通常不可数，play tennis不用the；可由两人单打或四人双打，不只一种形式。", "We booked a court for tennis.", "我们订了球场打网球。", "Tennis was cancelled because of rain.", "网球活动因雨取消。"],
  ["volleyball", "名词·排球运动", "表示运动时通常不可数，play volleyball不加冠词；a volleyball则可指一只排球。", "We play volleyball beside the beach.", "我们在海滩旁打排球。", "The volleyball rolled under the bench.", "排球滚到了长椅下。"],
  ["hockey", "名词·曲棍球", "英式常指草地曲棍球，美式hockey常指冰球；必要时用field或ice明确运动类型。", "She plays field hockey at school.", "她在学校打草地曲棍球。", "The hockey team practises on Fridays.", "曲棍球队每周五训练。"],
  ["kick", "动词·踢", "指用脚击打，可直接接球等宾语；kick at侧重做出踢的动作，不保证踢中。", "Kick the ball towards the wall.", "把球踢向墙。", "Please don't kick the loose stones.", "请不要踢松散的石子。"],
  ["knock", "动词·敲", "knock on/at the door表示敲门；knock something over表示碰倒，与单纯敲击含义不同。", "Knock on the side door.", "敲侧门。", "Do not knock the cup off the desk.", "别把杯子从桌上碰下去。"],
  ["flip", "动词·快速翻转", "指迅速翻面或翻动，可直接接物体；flip through a book则表示快速浏览。", "Flip the pancake once the edges set.", "边缘凝固后把薄饼翻面。", "She likes to flip through old magazines.", "她喜欢翻看旧杂志。"],
  ["throw", "动词·扔", "throw something to someone表示扔给某人，at则常表示朝目标投掷；过去式threw。", "Throw the rope to the guide.", "把绳子扔给向导。", "Never throw stones at windows.", "绝不要向窗户扔石头。"],
  ["toss", "动词·轻抛；拌匀", "可指随手轻抛，也可指翻拌食物；toss a coin表示抛硬币决定事情。", "Toss the keys onto the sofa.", "把钥匙随手抛到沙发上。", "Toss the salad with a little oil.", "加少许油拌匀沙拉。"],
  ["glide", "动词·滑行", "通常不及物，强调平稳轻巧地移动；glide across/over说明经过的表面或空间。", "Swans glide across the lake.", "天鹅在湖面平稳游动。", "The skaters glide towards the centre.", "滑冰者滑向中央。"],
  ["tumble", "动词·翻滚跌落", "表示失控地快速落下，也可形容价格急跌；常用tumble down/from说明方向。", "Loose stones tumble down the slope.", "松石沿坡翻滚而下。", "The boxes may tumble from the shelf.", "箱子可能从架子上滚落。"],
  ["ski", "动词·滑雪", "go skiing是常用活动表达；名词a ski指一只滑雪板，通常成对使用。", "We ski on the lower slopes.", "我们在较低的山坡滑雪。", "They learned to ski last winter.", "他们去年冬天学会了滑雪。"],
  ["skate", "动词·滑冰；滑行", "可指穿冰鞋或轮滑鞋滑行；go skating表示去滑，具体是哪种运动由语境说明。", "Children skate on the frozen pond.", "孩子们在结冰池塘上滑冰。", "Can you skate without holding the rail?", "你能不扶栏杆滑冰吗？"],
  ["cycling", "名词·骑自行车", "活动名通常不可数，go cycling表示去骑车；不只指竞赛，也可用于日常出行。", "Cycling is his favourite way to travel.", "骑自行车是他最喜欢的出行方式。", "We go cycling along the canal.", "我们沿运河骑车。"],
  ["cyclist", "名词·骑自行车的人", "可数，可指通勤者或运动员，并不必须参加比赛；与自行车本身bicycle区别。", "The cyclist stopped at the crossing.", "骑车人在路口停下。", "Each cyclist wore a reflective jacket.", "每位骑车人都穿着反光外套。"],
  ["bicycle", "名词·自行车", "可数，ride a bicycle表示骑车；by bicycle表示交通方式时通常不加冠词。", "I locked my bicycle beside the gate.", "我把自行车锁在门边。", "The guide travels to work by bicycle.", "导游骑自行车上班。"],
  ["jump", "动词·跳", "jump over接跳过的障碍，jump into接跳入的位置；并不一定含从高处落下的意思。", "Jump over the narrow ditch.", "跳过窄沟。", "Please do not jump on the bed.", "请不要在床上跳。"],
  ["plunge", "动词·猛冲；骤降", "plunge into可指突然冲入，价格等作主语则可表示骤降；通常比逐渐下降语气强。", "Do not plunge into unfamiliar water.", "不要猛地跳入不熟悉的水域。", "Temperatures may plunge after sunset.", "日落后气温可能骤降。"],
  ["plunge whole-heartedly", "动词短语·全身心投入", "词库短语需补足into才自然；用plunge wholeheartedly into表示全身心投入，wholeheartedly常连写。", "We plunge wholeheartedly into the restoration project.", "我们全身心投入修复项目。", "New members plunge wholeheartedly into rehearsals.", "新成员全心投入排练。"],
  ["tent", "名词·帐篷", "可数，put up/pitch a tent表示搭帐篷；take down则表示拆下，不是把帐篷丢弃。", "The tent sheltered us from the drizzle.", "帐篷为我们挡住毛毛雨。", "We put up the tent before dark.", "我们天黑前搭好了帐篷。"],
  ["picnic", "名词·野餐", "可数，have a picnic或go for a picnic是常见表达；作为动词也可指在户外野餐。", "We had a picnic beside the stream.", "我们在溪边野餐。", "Pack fruit for the picnic.", "为野餐装些水果。"],
  ["hunt", "动词·狩猎；搜寻", "hunt for说明搜寻的目标；动物狩猎可直接接受猎动物，两个含义需由语境区分。", "Owls hunt mainly after dark.", "猫头鹰主要在天黑后捕猎。", "We hunt for shells along the beach.", "我们沿海滩找贝壳。"],
  ["race", "名词·比赛", "本处指比速度的赛事，可数；win a race表示获胜，参加则用enter或take part in。", "The race starts beside the lighthouse.", "比赛在灯塔旁开始。", "She entered a five-kilometre race.", "她报名参加了五公里赛跑。"],
  ["marathon", "名词·马拉松", "指全程约四十二点一九五公里的长跑赛事；也可比喻持续很久的活动。", "The marathon finishes in the central square.", "马拉松在中央广场结束。", "Training for a marathon requires careful planning.", "为马拉松训练需要周密规划。"],
  ["pace", "名词·速度；步速", "常用at a steady pace说明稳定速度，keep pace with表示跟上；不单指一步的长度。", "We walked at a comfortable pace.", "我们以舒适的步速行走。", "The pace increased after the bend.", "过弯后速度加快了。"],
  ["step", "名词·步；步骤", "take a step表示迈一步，a step in a process表示流程步骤；应由空间或过程语境判断。", "Take a small step backwards.", "向后迈一小步。", "The final step is to seal the lid.", "最后一步是封紧盖子。"],
  ["footstep", "名词·脚步声；足迹", "可指脚落地的声音或痕迹，常用复数footsteps；本条示例用单数a footstep表示一声脚步。", "A footstep sounded in the corridor.", "走廊传来一声脚步。", "We heard a footstep on the stairs.", "我们听到楼梯上一声脚步。"],
  ["cruise", "名词·游轮旅行", "可数，指以游乐为目的并常停靠多处的船旅；go on a cruise表示乘游轮旅行。", "The cruise includes three island stops.", "游轮旅行包括三次停岛。", "They booked a short river cruise.", "他们预订了短途河流游船旅行。"],
  ["vocation", "名词·天职；职业志向", "指自觉适合并愿投入的工作或使命；不是假期vacation，原词拼写需与后者区分。", "She found her vocation in teaching.", "她在教学中找到了天职。", "Restoring old buildings became his vocation.", "修复古建筑成为他的职业使命。"],
  ["hike", "名词·徒步远足", "可数，指较长距离、尤在郊野的步行；价格语境中的a hike则表示大幅提高。", "The hike follows an old shepherd's path.", "远足沿一条旧牧羊道进行。", "We planned a gentle hike for beginners.", "我们为初学者安排了轻松远足。"],
  ["jog", "动词·慢跑", "表示以缓慢稳定速度跑步，go jogging表示去慢跑；过去式jogged需双写g。", "We jog beside the canal.", "我们在运河边慢跑。", "I prefer to jog before breakfast.", "我更喜欢早餐前慢跑。"],
  ["jogger", "名词·慢跑者", "可数，指以慢跑锻炼的人；复数joggers也可指束脚运动裤，要按人物或衣物语境区分。", "A jogger stopped to check the map.", "慢跑者停下查看地图。", "The jogger wore a bright vest.", "慢跑者穿着鲜艳背心。"],
  ["stride", "名词·大步", "可指走跑时的一大步或步幅，take a stride表示迈出大步；复数strides还可比喻进步。", "One stride carried her across the puddle.", "她一大步跨过了水坑。", "Her long stride keeps her ahead.", "她的大步幅让她保持领先。"],
  ["pull", "动词·拉", "表示向自己或某方向牵引，pull something towards接方向；与推的push动作相反。", "Pull the rope towards you.", "把绳子拉向自己。", "Do not pull on the loose cable.", "不要拉松动的电缆。"],
  ["be", "动词·是；处于", "原形be可用于to后或情态动词后；主语直接陈述时需按人称时态选am/is/are等。", "Please be quiet in the archive.", "请在档案室保持安静。", "The keys should be in the drawer.", "钥匙应该在抽屉里。"],
  ["take a bow", "动词短语·鞠躬谢幕", "指表演后向观众鞠躬致谢，bow在此读作与how押韵；也可比喻值得接受赞扬。", "The actors take a bow after the final song.", "演员在最后一首歌后鞠躬谢幕。", "Please take a bow for your wonderful performance.", "请为精彩表演鞠躬谢幕。"],
  ["stuff", "名词·东西", "非正式且通常不可数，泛指不具体点明的物品或材料；不说a stuff表示一件东西。", "Put your stuff in the cupboard.", "把你的东西放进柜子。", "What is this sticky stuff?", "这黏糊糊的东西是什么？"],
  ["item", "名词·物件；项目", "可数，指一组物品或清单中的单项；an item of clothing可量化不可数的clothing。", "Every item has a numbered label.", "每件物品都有编号标签。", "The final item concerns transport costs.", "最后一个议题涉及交通费用。"],
  ["souvenir", "名词·纪念品", "可数，指帮助记住旅行或事件的物品；a souvenir of说明所纪念的旅行或场合。", "I kept the ticket as a souvenir.", "我保留车票作纪念。", "The shop sells a handmade souvenir of the island.", "商店出售岛屿主题的手工纪念品。"],
  ["artefact", "名词·人工制品；文物", "常指具有历史价值的人造物，英式artefact与美式artifact同义；不指自然形成的石头。", "The artefact was found beside the hearth.", "文物在炉边被发现。", "Each artefact has a record of its origin.", "每件文物都有来源记录。"],
  ["material", "名词·材料", "泛指制作物品的物质时可不可数，具体材料种类可数；书写资料义也需看上下文。", "The material bends without breaking.", "这种材料弯曲而不断裂。", "We chose a waterproof material for the cover.", "我们选了防水材料做罩子。"],
  ["raw", "形容词·生的；未经加工的", "食物语境指未烹饪，材料语境指未加工；不是形容所有新买或新鲜的东西。", "The salad contains raw carrots.", "沙拉里有生胡萝卜。", "The factory imports raw cotton.", "工厂进口原棉。"],
  ["raw material", "名词短语·原材料", "指尚待加工制造的材料；集合使用时常见复数raw materials，不表示已经制好的产品。", "Wood is the main raw material.", "木材是主要原材料。", "The workshop stores raw material under cover.", "车间把原材料存放在有遮盖处。"],
  ["necessary", "形容词·必要的", "常用necessary for加对象，necessary to do加行动；表示实现目标所需，不只是个人喜好。", "A permit is necessary for this route.", "走这条路线需要许可证。", "It is necessary to check the seals.", "有必要检查密封处。"],
  ["outfit", "名词·一套服装", "可数，指为特定场合穿的一套衣服；也可非正式地指某个组织，依语境判断。", "She packed an outfit for the ceremony.", "她装了一套参加典礼的服装。", "The outfit includes waterproof trousers.", "这套服装包括防水裤。"],
  ["kit", "名词·成套用品", "可指特定活动的一套工具衣物，或待组装的部件；a kit of tools不指一件孤立工具。", "The kit contains needles and thread.", "工具包里有针和线。", "We bought a kit to build a model boat.", "我们买了套件做模型船。"],
  ["garbage", "名词·垃圾", "主要为美式用法，通常不可数；英式常用rubbish，一袋垃圾用a bag of garbage。", "Put the garbage in a covered bin.", "把垃圾放进有盖的垃圾桶。", "The truck collects garbage every Tuesday.", "卡车每周二收垃圾。"],
  ["rubbish", "名词·垃圾", "主要为英式且通常不可数，不说a rubbish；也可非正式批评某话是胡说。", "Please take your rubbish home.", "请把垃圾带走。", "The bin was full of rubbish.", "垃圾桶装满了垃圾。"],
  ["trash", "名词·垃圾", "美式通常不可数，指丢弃的废物；动词trash可指糟蹋或毁坏，语气不同。", "Sort the trash before collection.", "收运前把垃圾分类。", "The alley was littered with trash.", "巷子里到处是垃圾。"],
  ["reuse", "动词·再利用", "直接接再次使用的物品；区别于把材料重新加工的recycle，重复使用不必改变材料形态。", "We reuse glass jars for storage.", "我们重复利用玻璃罐储物。", "Can we reuse the packing paper?", "我们能重复使用包装纸吗？"],
  ["litter", "名词·乱扔的垃圾", "垃圾义不可数，尤指公共场所散落的小废物；动物语境a litter则指一窝幼崽。", "Volunteers removed litter from the beach.", "志愿者清理了海滩垃圾。", "Please do not leave litter beside the trail.", "请不要在步道旁丢垃圾。"],
  ["waste", "名词·浪费；废物", "表示不必要的消耗或废弃物时常不可数；a waste of time固定表示浪费时间。", "The process produces very little waste.", "工艺产生的废物很少。", "Leaving the tap running is a waste of water.", "让水龙头一直开着是浪费水。"],
  ["junk", "名词·废旧杂物", "通常不可数，指认为没用的旧物或低质量东西；价值判断依场景，不是每件旧物都无用。", "The shed was full of junk.", "棚屋堆满废旧杂物。", "We cleared junk from the attic.", "我们清理了阁楼里的杂物。"],
  ["sewerage", "名词·排污系统", "通常不可数，重点指收集输送污水的管网；sewage主要指污水本身，部分地区用法有交叉。", "The village needs a modern sewerage system.", "村庄需要现代排污系统。", "Investment in sewerage improved sanitation.", "排污系统投资改善了卫生条件。"],
  ["detergent", "名词·洗涤剂", "可指清洁用液体或粉末，材料义常不可数；具体一类洗涤剂可用a mild detergent。", "Use a mild detergent on the fabric.", "用温和洗涤剂清洗布料。", "Too much detergent leaves a residue.", "洗涤剂过多会留残留物。"],
  ["lotion", "名词·护肤液", "指涂在皮肤上护理或保护的液体，既可泛指也可数种类；不等于所有药膏。", "The lotion absorbs without feeling sticky.", "护肤液吸收后不黏腻。", "She packed a bottle of body lotion.", "她装了一瓶身体乳液。"],
  ["shampoo", "名词·洗发液", "材料通常不可数，a shampoo也可指一次洗发；a bottle of shampoo指一瓶洗发液。", "This shampoo has a mild scent.", "这款洗发液气味温和。", "Rinse the shampoo out thoroughly.", "彻底冲净洗发液。"],
  ["soap", "名词·肥皂", "材料义通常不可数，一块可用a bar of soap；不能直接按中文说a soap表示一块。", "Wash your hands with soap.", "用肥皂洗手。", "A bar of soap lay beside the basin.", "洗手盆旁放着一块肥皂。"],
  ["tub", "名词·盆；桶状容器", "可数，指敞口大容器，也可指带盖的小食品盒；a tub of说明其中装的东西。", "Fill the tub with warm water.", "给盆装上温水。", "She bought a tub of yogurt.", "她买了一盒酸奶。"],
  ["pipe", "名词·管道", "可数，指输送液体或气体的管子；a pipe for smoking另指烟斗，依功能判断。", "The pipe carries rainwater underground.", "管道把雨水输送到地下。", "A leak appeared in the copper pipe.", "铜管出现泄漏。"],
  ["pipeline", "名词·长输管道", "指通常跨较长距离输送液体或气体的大型管线，可数；in the pipeline也可比喻正在筹划。", "The pipeline crosses open farmland.", "管线穿过开阔农田。", "Inspectors checked the pipeline for damage.", "检查员查看管线有无损伤。"],
  ["tube", "名词·管；软管包装", "可数，指中空管状物；a tube of toothpaste指一管牙膏，不是所有容器都叫tube。", "The tube connects the pump to the tank.", "管子连接水泵与水箱。", "Pack a small tube of toothpaste.", "装一小管牙膏。"],
  ["mop", "名词·拖把", "可数，指长柄带吸水材料的清洁工具；也可作动词直接接地面，过去式mopped双写p。", "The mop stood beside the bucket.", "拖把立在桶旁。", "Use a clean mop on the kitchen floor.", "用干净拖把拖厨房地面。"],
  ["mattress", "名词·床垫", "可数，指床上供躺卧的厚垫，复数mattresses；与覆盖在上面的床单sheet不同。", "The mattress fits the narrow bed.", "床垫适合那张窄床。", "They carried the mattress upstairs.", "他们把床垫搬上楼。"],
  ["rug", "名词·小地毯", "通常指可移动、覆盖部分地板的厚织物，可数；比铺满房间的carpet范围常小。", "A wool rug covered the cold tiles.", "羊毛小地毯盖住冰冷地砖。", "Shake the rug outside.", "到外面抖小地毯。"],
  ["mat", "名词·垫子", "可指保护地板或桌面的小块材料，可数；依用途可加door或place等前置修饰词。", "Leave muddy boots on the mat.", "把泥靴留在垫子上。", "Put a mat under the hot pan.", "在热锅下放垫子。"],
  ["pad", "名词·衬垫；便笺本", "可指保护或吸收用的软垫，也可指一叠装订纸张；a pad of paper指便笺本。", "A soft pad protects the lens.", "软垫保护镜头。", "Write the number on this pad.", "把号码写在这本便笺上。"],
  ["sheet", "名词·床单；一张", "床品义可数，材料可用a sheet of paper；注意不是被子或毯子的通称。", "The sheet dried quickly in the breeze.", "床单在微风中很快干了。", "Give each pupil a sheet of paper.", "给每位学生一张纸。"],
  ["pillow", "名词·枕头", "可数，指睡觉时托头的软垫；通常放床上，与沙发上靠垫cushion有常见使用区别。", "The pillow was filled with feathers.", "枕头填着羽毛。", "She placed a pillow behind her neck.", "她在颈后放了枕头。"],
  ["towel", "名词·毛巾", "可数，指用来擦干水的布或纸；a towel不等于一卷纸巾，依材质和用途区分。", "Hang the towel where it can dry.", "把毛巾挂在能晾干的地方。", "The guest asked for a clean towel.", "客人要了一条干净毛巾。"],
  ["nail", "名词·钉子；指甲", "五金语境指敲入材料固定用的钉子，人体语境则指指甲；两义均可数。", "The nail bent under the hammer.", "钉子在锤击下弯了。", "One nail was enough to hold the sign.", "一根钉子足以固定标牌。"],
  ["razor", "名词·剃刀", "可数，指剃除毛发的工具；electric razor表示电动剃须刀，不等于所有带刃刀具。", "The razor needs a new blade.", "剃刀需要新刀片。", "Keep the razor in its protective case.", "把剃刀放在保护盒里。"],
  ["shave", "动词·剃", "可接脸或腿等表示剃毛，也可指从材料表面削去薄层；shave off强调剃掉或削掉的部分。", "He prefers to shave before breakfast.", "他喜欢早餐前剃须。", "Please shave a little wood off the edge.", "请从边缘削掉一点木头。"],
  ["match", "名词·火柴；比赛", "一根火柴可数，strike a match表示划火柴；运动义一场比赛也可数，依语境区分。", "The match went out in the wind.", "火柴被风吹灭了。", "We struck a match to light the stove.", "我们划火柴点炉子。"],
  ["wax", "名词·蜡", "材料义通常不可数，a layer of wax指一层蜡；不等于已经做成一支的candle。", "The wax softened near the heater.", "蜡在暖气旁变软了。", "Rub a little wax onto the wood.", "往木头上擦一点蜡。"],
  ["portfolio", "名词·作品集", "可指展示代表作品的集合或携带作品的夹子，可数；求职语境常强调作品集合。", "Her portfolio includes textile designs.", "她的作品集包含纺织品设计。", "Bring a portfolio to the interview.", "面试时带作品集。"],
  ["paperback", "名词·平装书", "可数，指纸质软封面的书；in paperback表示以平装形式，不等于电子版。", "The paperback fits in my coat pocket.", "平装书能放进我的外套口袋。", "The paperback edition includes a new introduction.", "平装版附有新序言。"],
  ["pamphlet", "名词·小册子", "可数，指页数较少、介绍信息或观点的薄册；不一定纯广告，也不等于厚重书籍。", "The pamphlet explains the new bus routes.", "小册子解释了新公交路线。", "Take a pamphlet from the desk.", "从桌上拿一本小册子。"],
  ["booklet", "名词·小册子", "可数，指页数少、通常纸封面的薄册；常用a booklet on/about说明所介绍主题。", "The booklet contains a walking map.", "小册子里有步行地图。", "We printed a booklet about local wildlife.", "我们印了本介绍当地野生动物的小册子。"],
  ["cover", "名词·封面；罩子", "可数时可指书籍封面或保护物的罩子；the cover of说明所附属物，与正文内容区分。", "The cover shows a coastal village.", "封面展示一个沿海村庄。", "Put a cover over the equipment.", "给设备盖上罩子。"],
  ["xerox", "动词·复印", "源于品牌名称，例句保留Xerox大写；一般场合用photocopy更中性，不代表所有品牌设备。", "Please Xerox the signed form.", "请复印签好的表格。", "We need to Xerox the original letter.", "我们需要复印原信。"],
  ["memorandum", "名词·备忘录", "较正式，指供特定人群阅读的信息短文，复数可用memoranda或memorandums；memo为常用短式。", "The memorandum outlines the revised procedure.", "备忘录概述修订后的程序。", "She circulated a memorandum before the meeting.", "她会前传阅了备忘录。"],
  ["stationery", "名词·文具", "通常不可数，指纸笔信封等书写用品；与表示静止的stationary仅差一个元音字母。", "The cupboard holds spare stationery.", "柜子放着备用文具。", "We ordered stationery for the office.", "我们为办公室订购了文具。"],
  ["stationer", "名词·文具商", "可数，指卖文具的人或商家；a stationer's可指文具店，别与station车站混淆。", "The stationer supplied envelopes and folders.", "文具商供应了信封和文件夹。", "A stationer opened a shop near the school.", "文具商在学校附近开了店。"],
  ["glue", "名词·胶水", "材料通常不可数，常说a tube of glue；也可作动词，用glue A to B说明粘贴位置。", "The glue dries clear.", "胶水干后透明。", "Apply glue along the edge.", "沿边缘涂胶水。"],
  ["rubber", "名词·橡胶；橡皮", "橡胶材料通常不可数，英式a rubber可指橡皮；美式对应eraser，地区含义需注意。", "The seal is made of rubber.", "密封圈由橡胶制成。", "I used a rubber to remove the pencil marks.", "我用橡皮擦掉铅笔痕迹。"],
  ["scissors", "复数名词·剪刀", "通常使用复数谓语，单把用a pair of scissors；不能说a scissors或scissors is。", "The scissors are in the top drawer.", "剪刀在最上层抽屉。", "Use a pair of scissors to cut the ribbon.", "用一把剪刀剪丝带。"],
  ["shear", "动词·剪羊毛", "常接羊等动物，过去分词可用shorn；也有切断义，不等于普通修剪所有植物。", "Farmers shear the sheep in spring.", "农民春天给羊剪毛。", "They shear each animal carefully.", "他们仔细给每只动物剪毛。"],
  ["edge", "名词·边缘；刃", "可指物体外围或刀具切割部分，可数；on the edge of说明处在边缘的位置。", "Keep the cup away from the edge.", "把杯子放得离边缘远一些。", "The knife has a sharp edge.", "刀有锋利的刃。"],
  ["rim", "名词·边缘；轮缘", "常指圆形物或容器的边口，可数；the rim of a cup指杯沿，不是杯底。", "A crack runs along the rim.", "一道裂缝沿着边口延伸。", "The cup has a blue rim.", "杯子有蓝色杯沿。"],
  ["element", "名词·元素；组成部分", "可指整体中的一部分或化学基本物质；an element of还可表示少量某种特质。", "Colour is a key element of the design.", "色彩是设计的关键元素。", "Iron is a chemical element.", "铁是一种化学元素。"],
  ["badge", "名词·徽章", "可数，指佩戴或携带以表明身份、资格或支持的标记；不是所有装饰饰品。", "Each visitor wore a numbered badge.", "每位访客佩戴编号徽章。", "The badge identifies trained first-aiders.", "徽章标识受训急救人员。"],
  ["knob", "名词·旋钮；圆把手", "指圆形把手或控制器，可数；turn the knob是常见动作，区别于按压按钮button。", "Turn the wooden knob to open the cupboard.", "转动木把手打开柜子。", "The drawer has a brass knob.", "抽屉有黄铜圆把手。"],
  ["shutter", "名词·百叶窗；快门", "窗户语境指外部遮板，摄影语境指控制进光的快门；两种用途由搭配明确。", "The shutter rattled in the wind.", "百叶窗在风中咯吱作响。", "The camera's shutter closed with a click.", "相机快门咔嗒一声闭合。"],
  ["pane", "名词·一块窗玻璃", "可数，指装在门窗框中的单块玻璃；a pane of glass不是整扇窗的窗框结构。", "One pane was cracked.", "一块窗玻璃裂了。", "Replace the damaged pane of glass.", "更换损坏的那块玻璃。"],
  ["opacity", "名词·不透明度", "通常不可数，指阻挡透视的程度；也可比喻制度或表述难以理解，不是亮度的同义词。", "The slider controls the image's opacity.", "滑块控制图像不透明度。", "The glass has a milky opacity.", "玻璃呈乳白色不透明状态。"],
  ["pail", "名词·桶", "可数，通常指带提柄的敞口容器，近义词bucket更常见；a pail of表示一桶内容物。", "The pail stood beneath the leaking roof.", "桶放在漏雨屋顶下。", "She carried a pail of water.", "她提着一桶水。"],
  ["lantern", "名词·灯笼；提灯", "可数，指有外罩并可提或挂的灯；现代lantern也可用电，不必限定蜡烛。", "The lantern hung beside the entrance.", "提灯挂在入口旁。", "We followed the glow of the lantern.", "我们跟着提灯的光走。"],
  ["flashlight", "名词·手电筒", "主要为美式名称，可数；英式常用torch，通常为可手持的电池照明工具。", "The flashlight revealed a narrow opening.", "手电筒照出一个窄开口。", "Pack a flashlight and spare batteries.", "装上手电筒和备用电池。"],
  ["refrigerator", "名词·冰箱", "可数，指用来低温保存食物的电器；日常口语常用缩略词fridge，含义基本相同。", "The refrigerator is beside the sink.", "冰箱在水槽旁。", "Put the milk in the refrigerator.", "把牛奶放进冰箱。"],
  ["refrigeration", "名词·冷藏", "通常不可数，指保持低温以保存物品的过程；不是一台冰箱本身的可数名称。", "These samples require constant refrigeration.", "这些样品需要持续冷藏。", "Refrigeration slows the spoilage of food.", "冷藏减缓食物变质。"],
  ["fridge", "名词·冰箱", "是refrigerator的常用短式，可数；注意写法fridge中有d，不能直接按长词截断。", "The fridge contains fresh vegetables.", "冰箱里有新鲜蔬菜。", "Leave space behind the fridge.", "在冰箱后留出空间。"],
  ["fan", "名词·风扇；爱好者", "电器义和支持者义均可数；a fan of说明喜爱的对象，依上下文区分机器与人。", "The fan circulates air through the room.", "风扇让房间空气流通。", "She is a fan of historical fiction.", "她喜欢历史小说。"],
  ["hurdle", "名词·栏架；难关", "可指跨栏比赛的障碍架，也可比喻必须克服的困难；clear a hurdle表示越过障碍。", "The runner cleared the final hurdle.", "跑者跨过最后一个栏架。", "Funding remains the biggest hurdle.", "资金仍是最大难关。"],
  ["fence", "名词·围栏", "可数，指以柱和木板或金属丝等隔开土地的结构；不等于实心砖墙wall。", "The fence separates the garden from the road.", "围栏把花园与道路隔开。", "A low fence surrounds the pond.", "低围栏围着池塘。"],
  ["pedal", "名词·踏板", "可数，指用脚控制的机械部件；bicycle pedal是自行车脚踏板，不同于车轮。", "The pedal turns the rear wheel.", "踏板带动后轮。", "Press the pedal gently.", "轻轻踩踏板。"],
  ["shelf", "名词·搁板", "可数，指水平放置以存物的板，复数shelves；on the shelf表示放在架上。", "The shelf holds our reference books.", "搁板上放着参考书。", "A shelf above the desk provides extra storage.", "桌上方的搁板增加了储物空间。"],
  ["ladder", "名词·梯子", "可数，通常有两侧长杆和横档；climb a ladder表示爬梯子，不是走楼梯stairs。", "The ladder rests against the wall.", "梯子靠着墙。", "Hold the ladder while I climb.", "我爬时请扶住梯子。"],
  ["lift", "名词·电梯", "本处为英式可数名词，美式常用elevator；动词lift则指抬起，依句法位置区分。", "The lift stops on every floor.", "电梯每层都停。", "Take the lift to the gallery.", "乘电梯去画廊。"],
  ["drawer", "名词·抽屉", "可数，指家具中可抽拉的储物盒；in a drawer表示在里面，不是放在其上表面。", "The drawer sticks in damp weather.", "潮湿天气抽屉会卡住。", "Keep the spare keys in this drawer.", "把备用钥匙放进这个抽屉。"],
  ["raincoat", "名词·雨衣", "可数，指防雨外套；wear a raincoat表示穿雨衣，不等于所有保暖大衣。", "Her raincoat kept the map dry.", "她的雨衣让地图保持干燥。", "Hang the raincoat by the door.", "把雨衣挂在门边。"],
  ["can", "名词·罐；情态动词·能", "容器义可数，a can of后接内容物；表示能力时can后接动词原形，不加to。", "A can of beans is on the shelf.", "一罐豆子在架子上。", "We can repair the broken latch.", "我们能修好坏门闩。"],
  ["metal", "名词·金属", "泛指材料通常不可数，具体金属类别可数；并非所有金属都同样硬或有磁性。", "The metal expanded as it warmed.", "金属受热膨胀。", "Copper is a useful metal for wiring.", "铜是适合做电线的金属。"],
  ["iron", "名词·铁；熨斗", "材料铁通常不可数，熨斗则可数；an iron指熨斗，不能据此把一块铁都叫an iron。", "The gate is made of iron.", "门用铁制成。", "The iron has an adjustable temperature setting.", "熨斗可以调温。"],
  ["lead", "名词·铅", "金属义读作与red押韵，通常不可数；带领义读音不同，材料语境需要特别区分。", "The old pipe contains lead.", "旧管道含铅。", "Lead is denser than aluminium.", "铅比铝密度大。"],
  ["brass", "名词·黄铜", "指铜与锌组成的合金，材料义不可数；音乐中the brass可指铜管乐器组。", "The handle is made of brass.", "把手由黄铜制成。", "Polish the brass with a soft cloth.", "用软布擦亮黄铜。"],
  ["cementer", "名词·胶合者；水泥作业者", "cementer是施胶或水泥作业者等施事名词，不表示水泥材料；材料应写cement，勿混用。", "The cementer joined the layers carefully.", "胶合作业者仔细接合各层。", "A cementer checked the prepared surfaces.", "一名胶合作业者检查了准备好的表面。"],
  ["lime", "名词·石灰；酸橙", "材料语境lime指石灰，水果语境a lime指酸橙；两义不可按颜色或发音混同。", "The mortar contains lime and sand.", "灰浆含石灰和沙。", "Add a squeeze of lime.", "挤入少许酸橙汁。"],
  ["plaster", "名词·灰泥", "建筑材料义通常不可数，常用于墙面；in plaster可指用石膏固定，需看建筑或医疗语境。", "The plaster dried overnight.", "灰泥一夜之间干了。", "Loose plaster fell from the ceiling.", "松动的灰泥从天花板掉下。"],
  ["leather", "名词·皮革", "材料通常不可数，made of leather说明材质；不是任何仿皮塑料都是真皮。", "The bag is made of soft leather.", "包由柔软皮革制成。", "Keep the leather away from direct heat.", "让皮革避开直接热源。"],
  ["plastic", "名词·塑料", "泛指材料时通常不可数；不同种类可用复数plastics，不能一律加s表示多个物件。", "The cover is made of recycled plastic.", "罩子由再生塑料制成。", "Heat can soften this plastic.", "热量会让这种塑料变软。"],
  ["fibre", "名词·纤维", "可指单根纤维或纤维材料，英式fibre与美式fiber对应；数量形式由具体含义决定。", "A loose fibre caught on the hook.", "一根松纤维挂在钩子上。", "The rope contains natural fibre.", "绳子含天然纤维。"],
  ["fabric", "名词·织物", "通常指制衣或包覆家具的布料，材料义不可数，具体种类可数；不只指棉布。", "The fabric feels smooth and cool.", "布料摸着光滑凉爽。", "Choose a fabric that dries quickly.", "选择快干布料。"],
  ["cotton", "名词·棉花；棉布", "通常不可数，可指植物纤维及制成的线或布；cotton shirt中作前置修饰语。", "The shirt is made of cotton.", "衬衫由棉布制成。", "Workers sorted the raw cotton.", "工人分拣原棉。"],
  ["nylon", "名词·尼龙", "通常不可数，指用于织物、绳等的合成材料；不等于全部人造纤维材料。", "The rope is made of nylon.", "绳子由尼龙制成。", "This nylon dries faster than the cotton.", "这种尼龙比那块棉布干得快。"],
  ["wooden", "形容词·木制的", "用于修饰以木头为材料的物件；描述表演时也可指生硬，不能都按材质翻译。", "The wooden frame supports the canvas.", "木框支撑画布。", "We crossed a wooden footbridge.", "我们过了一座木制人行桥。"],
  ["mine", "名词·矿井；代词·我的", "矿井义可数；所有格代词mine独立使用，后面不再接被拥有的名词。", "The mine closed after the seam ran out.", "矿层采尽后矿井关闭了。", "That blue notebook is mine.", "那本蓝色笔记本是我的。"],
  ["lubricate", "动词·润滑", "直接接受润滑的机械部件，常用油等降低摩擦；不等同于把表面清洗干净。", "Lubricate the hinge with suitable oil.", "用合适的油润滑铰链。", "We lubricate the gears during maintenance.", "我们维护时给齿轮润滑。"],
  ["diamond", "名词·钻石", "可数宝石，也可作材料使用；作为工具材质时强调硬度，不是所有闪亮石头都叫diamond。", "The ring contains a small diamond.", "戒指镶着小钻石。", "A diamond tip cuts the glass.", "金刚石刀头切割玻璃。"],
  ["crystal", "名词·晶体；水晶玻璃", "可指具有规则结构的固体，也可指高品质透明玻璃；不能把所有透明物都称晶体。", "A salt crystal formed on the rim.", "边缘形成一颗盐晶体。", "The bowl is made of crystal.", "碗由水晶玻璃制成。"],
  ["counterfeit", "形容词·伪造的", "表示故意仿冒真品以欺骗，常修饰money或goods；不等于合法注明的模型复制品。", "The machine detected a counterfeit note.", "机器查出一张假钞。", "The shop removed counterfeit watches.", "商店撤下了假冒手表。"],
  ["style", "名词·风格", "可数或不可数，指独特做法或外观形式，in the style of表示模仿某种风格。", "Her style combines clear lines and warm colours.", "她的风格结合清晰线条和暖色。", "The house was built in a traditional style.", "房子采用传统风格建造。"],
  ["stylish", "形容词·时髦的", "描述外观或设计有吸引力且有格调；不直接表示价格昂贵或材料最耐用。", "The café has a stylish interior.", "咖啡馆内饰时髦。", "She chose a simple but stylish jacket.", "她选了一件简洁而时髦的夹克。"],
  ["tendency", "名词·倾向", "常用a tendency to do或a tendency for something to happen，表示较易出现而非必定发生。", "The fabric has a tendency to shrink.", "这种布料容易缩水。", "He has a tendency to speak too quickly.", "他往往说得太快。"],
  ["popularity", "名词·受欢迎程度", "通常不可数，指被许多人喜爱或支持的状态；不表示事物自身一定有高质量。", "The sport is growing in popularity.", "这项运动越来越受欢迎。", "The survey measured the programme's popularity.", "调查衡量了节目的受欢迎程度。"],
  ["vogue", "名词·流行", "常用in vogue或come into vogue，指某段时间的时尚或广泛偏好，常带暂时性。", "Wide trousers are back in vogue.", "宽裤腿又流行起来。", "The vogue for tiny gardens continues.", "小花园的流行仍在继续。"],
  ["prevalence", "名词·普遍程度", "通常不可数，指某种情况存在或发生的常见程度；不等于人们喜欢它的popularity。", "The survey examines the prevalence of damp housing.", "调查研究潮湿住房的普遍程度。", "Researchers compared the prevalence across regions.", "研究者比较了各地区的发生率。"],
  ["prevailing", "形容词·普遍的；盛行的", "放在名词前指某地某时占主导的情况；prevailing wind指常见风向，不是永远不变。", "The design reflects prevailing tastes.", "设计反映当时流行的审美。", "The prevailing wind comes from the west.", "盛行风从西边吹来。"],
  ["model", "名词·模型；模特", "可指供展示或研究的缩小结构，也可指展示服装的人；两义均可数，依场景判断。", "The model shows the planned extension.", "模型展示拟建扩展部分。", "The model wore a handwoven jacket.", "模特穿着手织夹克。"],
  ["icon", "名词·图标；标志人物", "计算机中指可点击的小符号；人物语境可指被视为某文化代表的人，不等于普通头像。", "Click the icon to open the map.", "点击图标打开地图。", "The singer became a cultural icon.", "歌手成了文化标志人物。"],
  ["idol", "名词·偶像", "可指极受崇拜的人或宗教崇拜物，可数；与仅表示屏幕小图形的icon不同。", "The young drummer met her idol.", "年轻鼓手见到了偶像。", "The idol stood at the centre of the shrine.", "神像立在神龛中央。"],
  ["jewellery", "名词·珠宝首饰", "英式拼写且通常不可数，美式jewelry；单件用a piece of jewellery，不说a jewellery。", "The jewellery is displayed under glass.", "首饰陈列在玻璃下。", "She designs jewellery from recycled silver.", "她用再生银设计首饰。"],
  ["jewel", "名词·宝石", "可数，指用于装饰的贵重石头；jewellery泛指首饰，不能因一个戒指就叫a jewel。", "The jewel caught the light.", "宝石闪着光。", "A blue jewel decorated the clasp.", "一颗蓝色宝石装饰搭扣。"],
  ["jade", "名词·玉", "材料义通常不可数，也可指相应绿色；a piece of jade是一块玉，不等于所有绿石。", "The pendant is carved from jade.", "吊坠由玉雕成。", "The museum displays a jade bowl.", "博物馆展示一只玉碗。"],
  ["embroider", "动词·刺绣", "可直接接布料或图案，embroider A on B表示在B上绣A；也可比喻添枝加叶。", "She plans to embroider flowers on the cuff.", "她打算在袖口绣花。", "We embroider each name by hand.", "我们手工绣出每个名字。"],
  ["hairdressing", "名词·美发", "通常不可数，指剪发、造型等工作或活动；从业者为hairdresser，并非同一词性。", "She took a course in hairdressing.", "她修了一门美发课程。", "The college has a hairdressing salon.", "学院有美发实训沙龙。"],
  ["masquerade", "名词·化装舞会；伪装", "社交义可指戴面具的聚会；masquerade as作动词表示冒充，常含欺骗意味。", "They organised a masquerade in the old theatre.", "他们在旧剧院组织化装舞会。", "The apology was merely a masquerade.", "道歉只是伪装。"],
  ["veil", "名词·面纱", "可数，指遮住脸部或头部的薄布；文化与场合不同，不能把所有头巾统一看待。", "The veil was edged with lace.", "面纱边缘镶着蕾丝。", "A veil of mist covered the valley.", "一层薄雾笼罩山谷。"],
  ["costume", "名词·服装；戏服", "可指某时期地区的典型衣着或表演扮装的服装；普通日常衣服通常用clothes。", "The costume was copied from a portrait.", "戏服依照肖像制作。", "Each dancer wore a traditional costume.", "每位舞者穿着传统服装。"],
  ["cosplay", "名词·角色扮演", "通常不可数，指装扮并扮演影视漫画等角色的爱好；也可作动词，依句法区分。", "The festival includes a cosplay competition.", "节庆包括角色扮演比赛。", "She designs costumes for cosplay.", "她设计角色扮演服装。"],
  ["decent", "形容词·得体的；不错的", "可形容行为合宜或质量尚好，语气通常弱于excellent；不只表示服装遮体。", "The hostel offers a decent breakfast.", "旅舍提供不错的早餐。", "Wear something decent to the interview.", "面试时穿得得体些。"],
  ["indecent", "形容词·猥亵的；不合宜的", "常指违反性方面礼俗或明显不适当的行为；强烈判断取决于语境，不宜泛称普通差错。", "The station apologised for the indecent remark.", "电台为猥亵言论道歉。", "They criticised the indecent haste of the decision.", "他们批评决定仓促得不合宜。"],
  ["exquisite", "形容词·精美的", "通常形容极细致美丽的工艺或物品；也可修饰强烈感觉，不能都按美观翻译。", "The box has an exquisite carved lid.", "盒子有精美雕花盖。", "Her necklace is an exquisite piece of work.", "她的项链是精美作品。"],
  ["grace", "名词·优雅", "表示动作顺畅轻盈时通常不可数；with grace描述有风度的方式，不只指衣服漂亮。", "The dancer moved with remarkable grace.", "舞者动作格外优雅。", "She accepted the criticism with grace.", "她有风度地接受批评。"],
  ["elegance", "名词·优雅；简洁精妙", "通常不可数，可形容外观气质或解决方案的巧妙；不是价格昂贵的必然结果。", "The room has a quiet elegance.", "房间有安静的优雅感。", "We admired the elegance of the solution.", "我们欣赏方案的简洁精妙。"],
  ["elegant", "形容词·优雅的；精巧的", "可形容外观或简洁巧妙的想法，常修饰design或solution；不是elegance名词的替代用法。", "She wore an elegant linen jacket.", "她穿着优雅的亚麻夹克。", "The proof offers an elegant solution.", "证明给出了精巧解法。"],
  ["appearance", "名词·外表；露面", "外观义可作单数概括，公开露面义可数；judge by appearance表示凭外表判断。", "The repair improved the chair's appearance.", "修理改善了椅子的外观。", "Her appearance on stage surprised the audience.", "她在舞台露面让观众意外。"],
  ["cosmetics", "复数名词·化妆品", "通常以复数形式统指改善外表的用品；单件可说a cosmetic product，不用a cosmetics。", "The cosmetics are stored away from sunlight.", "化妆品存放在避光处。", "She rarely wears cosmetics at work.", "她工作时很少化妆。"],
  ["charming", "形容词·迷人的", "表示令人愉快或有吸引力，常描述人或地方；不保证行为完全可靠或产品没有缺点。", "The cottage has a charming garden.", "小屋有迷人的花园。", "Our guide was a charming storyteller.", "导游是个很有魅力的讲故事者。"],
  ["handsome", "形容词·英俊的；可观的", "常形容男性外貌，也可修饰建筑或大额数目；handsome profit不指利润有外貌。", "He wore a handsome dark suit.", "他穿着一套漂亮的深色西装。", "The restored hall is a handsome building.", "修复后的大厅是一座漂亮建筑。"],
  ["clothing", "名词·衣物", "集合性不可数名词，不能说clothings；具体一件用an item of clothing，区别于布料cloth。", "The shelter provides warm clothing.", "收容处提供暖和衣物。", "Pack one item of waterproof clothing.", "装一件防水衣物。"],
  ["uniform", "名词·制服", "可数，指群体规定穿着的衣服；作形容词则指一致的，依名词或形容词位置判断。", "The uniform includes a blue jacket.", "制服包括蓝色夹克。", "She changed out of her uniform.", "她换下制服。"],
  ["laundry", "名词·待洗衣物；洗衣店", "衣物集合义通常不可数，do the laundry表示洗衣；a laundry则可指洗衣经营场所。", "The laundry is drying on the line.", "洗好的衣物晾在绳上。", "I do the laundry on Saturday.", "我星期六洗衣服。"],
  ["wardrobe", "名词·衣柜；全部衣物", "可指挂衣服的柜子，也可统指某人拥有的服装；a wardrobe不只表示一套衣服。", "The wardrobe has sliding doors.", "衣柜有推拉门。", "Her wardrobe includes several handmade coats.", "她的衣物里有几件手工外套。"],
  ["overcoat", "名词·厚大衣", "可数，指寒冷天气穿在外层的长厚外套；不是所有短夹克jacket都称overcoat。", "He hung his overcoat near the entrance.", "他把大衣挂在入口附近。", "The overcoat kept her warm on the platform.", "大衣让她在站台保持温暖。"],
  ["robe", "名词·长袍；浴袍", "指宽松长衣，正式长袍或浴袍需看场合；bathrobe明确表示洗浴前后穿的袍子。", "She wore a robe after swimming.", "她游泳后穿上浴袍。", "The judge's robe hung in the cupboard.", "法官长袍挂在柜子里。"],
  ["gown", "名词·长礼服；罩衣", "可指正式女长裙，也可指特定职业或场合的长罩衣；hospital gown是医院穿的罩衣。", "The gown was made of pale silk.", "长礼服由浅色丝绸制成。", "Students wore a gown at the ceremony.", "学生在典礼上穿学位袍。"],
  ["sweater", "名词·毛衣", "可数，指通常长袖、套在上身的针织衣；并非必须用羊毛制成，依材料另说明。", "The sweater has a loose neckline.", "毛衣领口宽松。", "She folded the sweater into her bag.", "她把毛衣叠进包里。"],
  ["jacket", "名词·夹克", "可数，通常指较短外套；书籍语境中的jacket也可指护封，不能都按衣服翻译。", "The jacket has two inside pockets.", "夹克有两个内袋。", "Take a waterproof jacket for the hike.", "远足带一件防水夹克。"],
  ["jeans", "复数名词·牛仔裤", "通常用复数谓语，一条用a pair of jeans；材料为denim，不说a jeans。", "The jeans are too long.", "牛仔裤太长。", "She bought a pair of dark jeans.", "她买了一条深色牛仔裤。"],
  ["trousers", "复数名词·裤子", "英式常用，通常接复数谓语，一条用a pair of trousers；美式常称pants。", "These trousers have deep pockets.", "这条裤子口袋很深。", "He packed a pair of wool trousers.", "他装了一条羊毛裤。"],
  ["clasp", "名词·搭扣", "可数，指首饰或衣物上固定闭合的小扣件；作动词clasp则表示紧握，不要混淆句法。", "The clasp on the bracelet is broken.", "手镯搭扣坏了。", "She fastened the silver clasp.", "她扣上银色搭扣。"],
  ["unbutton", "动词·解开纽扣", "直接接衬衫等衣物，表示解开其纽扣；前缀un-在此逆转button的扣上动作。", "Unbutton your coat before sitting down.", "坐下前解开外套纽扣。", "She stopped to unbutton the tight collar.", "她停下解开紧领口的纽扣。"],
  ["glove", "名词·手套", "可数，通常有分开的手指部分，一副用a pair of gloves；单只可用a glove。", "One glove fell beneath the bench.", "一只手套掉到长椅下。", "Wear a protective glove when handling the metal.", "处理金属时戴防护手套。"],
  ["brim", "名词·帽檐；容器口", "可指帽子外伸边沿或容器顶部边缘；to the brim表示满到边口，依物体区分。", "The hat has a wide brim.", "帽子有宽帽檐。", "The jug was filled to the brim.", "水壶装得满到边口。"],
  ["scarf", "名词·围巾", "可数，可围颈或遮头肩，复数可用scarves或scarfs；不必局限为冬季厚毛巾。", "The scarf fluttered in the breeze.", "围巾在微风中飘动。", "She tied a silk scarf around her neck.", "她在颈上系了丝巾。"],
  ["handkerchief", "名词·手帕", "可数，传统上指擦鼻子或眼泪的方布；纸制一次用品日常也常称tissue。", "He folded the handkerchief neatly.", "他整齐地叠好手帕。", "A clean handkerchief lay in the drawer.", "抽屉里有一方干净手帕。"],
  ["purse", "名词·零钱包；手提包", "英式常指小钱袋，美式常指手提包；理解时结合地域，不能默认所有场景都只是钱包。", "She kept coins in a small purse.", "她把硬币放在小钱袋里。", "Her purse contained a notebook and keys.", "她的手提包里有笔记本和钥匙。"],
  ["wallet", "名词·钱包", "可数，通常指可折叠携带钞票和卡片的小夹；不是普通大背包，数字语境另有电子钱包义。", "My wallet was in the inner pocket.", "钱包在内袋里。", "He returned the wallet without opening it.", "他没打开钱包就归还了。"],
  ["vest", "名词·背心", "英式可指贴身无袖内衣，美式常指马甲；a safety vest指反光等安全背心，依场景判断。", "Wear a reflective vest beside the road.", "在路边穿反光背心。", "He wore a cotton vest beneath his shirt.", "他衬衫下面穿棉背心。"],
  ["sleeve", "名词·袖子；保护套", "可数，衣物义指包住手臂的部分；其他物体的保护套也可叫sleeve，依对象区分。", "The sleeve caught on a branch.", "袖子挂住了树枝。", "Slide the record into its paper sleeve.", "把唱片放进纸套。"],
  ["sock", "名词·短袜", "可数，一双用a pair of socks；通常包脚和小腿下部，区别于长袜stocking。", "One sock disappeared in the wash.", "一只袜子洗后不见了。", "She pulled a sock over the cold foot.", "她给冰冷的脚套上袜子。"],
  ["stocking", "名词·长袜", "可数，常指薄而贴腿的长袜；圣诞语境也可指装礼物的大袜子，需看场合。", "The stocking tore near the ankle.", "长袜在脚踝附近破了。", "A stocking hung beside the fireplace.", "壁炉旁挂着一只圣诞袜。"],
  ["slipper", "名词·拖鞋", "可数，通常指室内穿的柔软舒适鞋子，一双用slippers；不泛指户外凉鞋。", "A slipper lay beneath the bed.", "一只拖鞋在床下。", "He put on a warm slipper.", "他穿上一只暖和的拖鞋。"],
  ["lace", "名词·蕾丝；鞋带", "蕾丝材料通常不可数，鞋带则可数；a lace指一根鞋带，依服装装饰或鞋子语境判断。", "The collar is trimmed with lace.", "领口饰有蕾丝。", "A lace came loose during the walk.", "走路时一根鞋带松了。"],
  ["tailor", "名词·裁缝", "可数，指制作或修改衣服的人；tailor something to作动词表示按需求调整，不只用于服装。", "The tailor shortened the jacket sleeves.", "裁缝缩短了夹克袖子。", "Ask a tailor to adjust the waistband.", "请裁缝调整腰围。"],
  ["sew", "动词·缝", "指用针线连接或制作布料制品，过去式sewed，过去分词常用sewn；注意不是sow播种。", "Can you sew a button on this coat?", "你能给这件外套缝个纽扣吗？", "We sew the lining by hand.", "我们手工缝衬里。"],
  ["stitch", "名词·针脚", "可指一针线或缝合动作留下的线圈，可数；a row of stitches是一排针脚，非整件衣服。", "One stitch came loose at the seam.", "接缝处松了一针。", "Use a small stitch around the edge.", "沿边缘用小针脚缝。"],
  ["needle", "名词·针", "可数，缝纫针一端尖、另一端有针眼；knitting needle则指编织用针，结构不同。", "Thread the needle in good light.", "在光线好处穿针。", "The needle slipped through the fabric.", "针穿过布料。"],
  ["pin", "名词·别针；大头针", "可数，常指临时固定布料的小金属针；不同于需要穿线缝合的needle。", "A pin held the pattern in place.", "大头针固定了纸样。", "Remove every pin before sewing.", "缝纫前取下每根大头针。"],
  ["strap", "名词·带子", "可数，通常指用于固定或支撑的窄带；shoulder strap指肩带，与整体包袋区别。", "The strap is adjustable.", "带子可调节。", "A leather strap secures the case.", "皮带固定了箱子。"],
  ["stripe", "名词·条纹", "可数，指颜色与周围不同的长条纹；与狭长实体带strip的概念不完全一样。", "A yellow stripe runs along the sleeve.", "袖子上有一条黄色条纹。", "The fabric has a narrow blue stripe.", "布料有一条细蓝纹。"],
  ["bracelet", "名词·手镯；手链", "可数，指戴在手腕或手臂的首饰；不像necklace那样戴在颈部，依佩戴部位区分。", "The bracelet has a tiny clasp.", "手链有个小搭扣。", "She made a bracelet from coloured beads.", "她用彩珠做了手链。"],
  ["woollen", "形容词·羊毛的", "英式常拼woollen，美式常拼woolen；置于衣物等名词前说明材料或羊毛织物属性。", "The woollen blanket felt warm.", "羊毛毯摸着暖和。", "He packed a woollen scarf.", "他装了一条羊毛围巾。"],
  ["patchwork", "名词·拼布", "指用多块不同布料缝合的织物或工艺，通常不可数；a patchwork of也可比喻杂合布局。", "The quilt is made of patchwork.", "被子由拼布制成。", "The fields formed a patchwork of colour.", "田野组成斑斓的拼布图案。"],
  ["shabby", "形容词·破旧的", "常指因长期使用或缺乏照料而显得旧损；shabby treatment则表示不公正待遇。", "The shabby chair needed a new cover.", "破旧椅子需要新罩子。", "They restored the shabby waiting room.", "他们修复了破旧候车室。"],
  ["tight", "形容词·紧的", "衣服语境指贴身过紧，物体连接语境可指牢固；并非所有tight都表示空间狭小。", "The shoes feel too tight.", "鞋子穿着太紧。", "Check that the lid is tight.", "检查盖子是否拧紧。"],
  ["whitewash", "名词·石灰水；掩饰", "建筑中指涂白墙面的石灰等混合物，通常不可数；掩盖真相的报告义可数。", "The wall needs a coat of whitewash.", "墙需要刷一层石灰水。", "Critics called the inquiry a whitewash.", "批评者称调查是在掩盖真相。"],
  ["brown", "形容词·棕色的", "修饰颜色时可置于名词前或be后；作为颜色名也可作名词，不能据颜色推定材料。", "The desk has a brown leather top.", "书桌有棕色皮革桌面。", "The leaves turn brown in autumn.", "叶子秋天变棕。"],
  ["purple", "形容词·紫色的", "表示偏红的蓝色系颜色，可在名词前或be后；purple prose另指过分华丽的文风。", "She chose a purple ribbon.", "她选了一条紫色丝带。", "The sky looked purple after sunset.", "日落后天空看着发紫。"],
  ["blot", "名词·墨渍", "可数，通常指意外留下的小块墨迹；作动词blot指用吸水物轻压吸干，不是来回擦。", "A blot covered the final letter.", "墨渍盖住了最后一个字母。", "The blot spread across the damp paper.", "墨渍在湿纸上散开。"],
  ["figure", "名词·身材；数字", "可指身体轮廓或数值符号，均可数；figure in a report常指统计数字而不是人物身材。", "The coat suits her figure.", "这件外套适合她的身材。", "One figure in the total is wrong.", "总数中的一个数字有误。"],
  ["curvy", "形容词·多曲线的", "可描述弯曲的线条或有圆润曲线的身材；谈人时应尊重本人，不作为健康结论。", "The chair has a curvy back.", "椅背有曲线。", "She chose a dress for her curvy figure.", "她为曲线身材选了连衣裙。"],
  ["hourglass", "名词·沙漏", "可数，指沙子从上部经窄口流到下部的计时器；hourglass figure比喻腰细的身材轮廓。", "The hourglass stood beside the chessboard.", "沙漏立在棋盘旁。", "The design has an hourglass shape.", "设计呈沙漏形。"],
  ["slight", "形容词·轻微的；纤细的", "可形容数量程度小，也可形容身材瘦小；not in the slightest表示一点也不。", "There is a slight crack in the rim.", "边口有轻微裂缝。", "His slight frame belied his strength.", "他纤瘦的体格掩盖了力量。"],
  ["slim", "形容词·苗条的；微小的", "形容身材时常含正面意味，机会等语境则指很小；不能把两义的评价对象混同。", "The slim case fits in a pocket.", "薄盒子装得进口袋。", "Our chances are slim.", "我们的机会渺茫。"],
  ["thready", "形容词·线状的；微弱的", "可描述像细线的结构，医学中的thready pulse指细弱脉搏；不是苗条身材的普通称赞。", "The plant has thready roots.", "植物有细线状根。", "The nurse noted a thready pulse.", "护士记录了细弱脉搏。"],
  ["stringy", "形容词·纤维多的；瘦而结实的", "食物语境常指筋或纤维多而难嚼，描述身体则指瘦且肌肉突出；注意评价语境。", "The old beans were stringy.", "老豆角纤维多。", "He had strong, stringy arms.", "他手臂精瘦有力。"],
  ["diet", "名词·饮食", "可指日常摄入的食物，也可指控制饮食计划；on a diet表示按某种计划控制饮食。", "Her diet includes plenty of beans.", "她的饮食包含很多豆类。", "The study compares diet across regions.", "研究比较各地区饮食。"],
  ["dietary", "形容词·饮食的", "置于needs或habits等名词前，表示与饮食有关；不是名词diet的直接替代。", "Please tell us your dietary requirements.", "请告知饮食要求。", "The survey examines dietary habits.", "调查考察饮食习惯。"],
  ["treat", "名词·乐事；动词·款待", "a treat可指特别享受的食物或活动；treat someone to说明请某人享用什么。", "The concert was a real treat.", "音乐会真是难得的享受。", "Let me treat you to lunch.", "让我请你吃午饭。"],
  ["treatment", "名词·对待；治疗", "表示处理方式或医疗过程时常不可数，具体疗法可数；treatment for说明所针对的问题。", "The wood needs protective treatment.", "木头需要防护处理。", "She questioned the treatment of the historic walls.", "她质疑对历史墙面的处理方式。"],
  ["cater", "动词·提供餐饮", "cater for an event表示承办餐饮；cater for/to也可表示满足需求，需看宾语区分。", "They cater for small weddings.", "他们为小型婚礼提供餐饮。", "The café can cater for vegetarian guests.", "咖啡馆能满足素食客人的需要。"],
  ["drinkable", "形容词·可饮用的", "可指安全适宜饮用，也可非正式表示味道尚可；不能仅凭外观断定水是否安全。", "The label confirms the water is drinkable.", "标签确认水可饮用。", "The coffee was surprisingly drinkable.", "咖啡意外地还挺能入口。"],
  ["refectory", "名词·集体食堂", "可数，通常用于学校、学院或修道院的大食堂，语域较特定；不是普通家庭餐厅。", "The refectory overlooks a courtyard.", "食堂俯瞰庭院。", "Students queued outside the refectory.", "学生在食堂外排队。"],
  ["cafeteria", "名词·自助食堂", "可数，指自己选取食物并端到桌上用餐的餐厅，常见于学校公司；不等同免费餐饮。", "The cafeteria serves a hot lunch.", "自助食堂供应热午餐。", "We met in the cafeteria.", "我们在自助食堂见面。"],
  ["buffet", "名词·自助餐", "本处指食客自行取用多种食物的餐饮形式；常用a buffet lunch，注意与殴击的动词读音不同。", "The buffet includes several vegetarian dishes.", "自助餐含几道素食菜。", "Guests helped themselves at the buffet.", "客人在自助餐处自行取食。"],
  ["barbecue", "名词·烧烤；烧烤架", "可指户外烤食活动、食物或烤架；have a barbecue表示举行烧烤聚餐，依场景区分。", "We had a barbecue by the lake.", "我们在湖边烧烤。", "The barbecue needs cleaning.", "烧烤架需要清理。"],
  ["supper", "名词·晚餐", "常指晚间一餐，也可指较晚的简单进食；习惯因地区家庭不同，不固定必须在几点。", "Supper is ready in the kitchen.", "晚饭在厨房准备好了。", "We talked after supper.", "我们晚饭后聊天。"],
  ["refreshment", "名词·点心饮料", "可指少量食物饮料或吃喝后的恢复；提供茶点时常用复数refreshments，数量形式需按含义选择。", "We stopped for refreshment after the walk.", "步行后我们停下来吃喝休息。", "The foyer offers a place for refreshment.", "门厅提供吃喝休息的地方。"],
  ["snack", "名词·小吃", "可数，指正餐之间少量进食或简单的一餐；have a snack表示吃点东西，不必是不健康食品。", "Pack a snack for the journey.", "为旅程装些小吃。", "I had a snack before rehearsal.", "我排练前吃了点东西。"],
  ["appetiser", "名词·开胃菜", "可数，指正式主餐前的少量食物；英式常拼appetiser，美式常拼appetizer。", "The appetiser came with fresh herbs.", "开胃菜配有新鲜香草。", "We shared an appetiser before the soup.", "我们喝汤前分吃了一份开胃菜。"],
  ["cuisine", "名词·烹饪风格", "指某地区或传统的烹饪方式，常不可数；French cuisine表示法国菜，不指厨房房间。", "The course explores regional cuisine.", "课程探索地方菜系。", "Seafood is central to this cuisine.", "海鲜是这种菜系的核心。"],
  ["menu", "名词·菜单", "可数，餐饮中列可选菜品，电脑中列操作选项；on the menu表示在菜单上。", "The menu changes with the seasons.", "菜单随季节变化。", "Choose a dish from the menu.", "从菜单选一道菜。"],
  ["order", "名词·订单；点单", "可数，指顾客提出的食品或商品需求；take an order是接单，place an order是下单。", "The waiter checked our order.", "服务员核对了我们的点单。", "Your order will arrive tomorrow.", "你的订单明天到。"],
  ["takeaway", "名词·外卖；要点", "英式餐饮语境指买走吃的熟食或店铺；演讲语境a key takeaway指主要收获。", "We ordered a takeaway after rehearsal.", "我们排练后点了外卖。", "The key takeaway is to check the source.", "主要收获是要核查来源。"],
  ["gourmet", "名词·美食家", "可数，指懂得欣赏高品质食物的人；作形容词时gourmet food强调精致优质的食物。", "The gourmet praised the subtle sauce.", "美食家称赞酱汁细腻。", "The shop sells gourmet chocolates.", "商店出售精品巧克力。"],
  ["vegetarian", "名词·素食者", "可数，指不吃肉的人；形容词vegetarian meal表示素食餐，不必等于完全不用蛋奶的vegan。", "A vegetarian joined us for supper.", "一位素食者与我们共进晚餐。", "The menu has a vegetarian option.", "菜单有素食选项。"],
  ["cutlery", "名词·餐具", "通常不可数，统指刀叉勺等用餐器具；不说a cutlery，一件可用a piece of cutlery。", "The cutlery is in the drawer.", "餐具在抽屉里。", "Wrap the cutlery in a clean cloth.", "用干净布包餐具。"],
  ["silver", "名词·银", "材料义通常不可数；颜色或奖牌语境有引申义，silver medal不保证整块由纯银制成。", "The bracelet is made of silver.", "手镯由银制成。", "Silver conducts electricity well.", "银导电性好。"],
  ["saucer", "名词·茶碟", "可数，通常指放杯子的小浅碟；与普通装主菜的大盘plate用途有所不同。", "The cup fits this saucer.", "杯子适合这个茶碟。", "She placed a biscuit on the saucer.", "她在茶碟上放了一块饼干。"],
  ["fork", "名词·叉子；岔路", "餐具义可数，通常有数个齿；a fork in the road则指路分叉，依搭配判断。", "The fork lay beside the plate.", "叉子在盘子旁。", "Turn left at the fork.", "在岔路左转。"],
  ["spoon", "名词·勺子", "可数，指有柄和凹形头部的用餐工具；一勺的量用spoonful，不能随意作精确单位。", "Use a spoon to stir the sauce.", "用勺子搅酱汁。", "The wooden spoon feels smooth.", "木勺摸着光滑。"],
  ["spoonful", "名词·一勺的量", "可数，复数spoonfuls；实际容量随勺子大小不同，未说明时不能当作统一精确单位。", "Add a spoonful of yogurt.", "加一勺酸奶。", "One spoonful was enough to taste the soup.", "一勺就足够品尝汤味。"],
  ["kettle", "名词·烧水壶", "可数，指带把手和壶嘴的烧水容器；区别于主要用于泡茶或盛茶的teapot。", "The kettle is beginning to boil.", "水壶开始沸腾。", "Fill the kettle below the marked line.", "给水壶加水不要超过标线。"],
  ["pan", "名词·平底锅；烹饪容器", "可数，指金属烹饪容器；具体平锅或深锅可加frying或sauce等词明确。", "Heat the oil in a pan.", "在锅里热油。", "The pan has a heavy base.", "锅底很厚。"],
  ["lid", "名词·盖子", "可数，指容器上可取下或掀开的盖；put a lid on表示给容器盖盖子。", "The lid fits tightly.", "盖子扣得很紧。", "Leave the lid slightly open.", "把盖子留条小缝。"],
  ["alcoholic beverage", "名词短语·含酒精饮料", "可数，较正式地指含酒精的饮品；beverage是饮料，不表示饮用者有酒精依赖。", "The menu labels each alcoholic beverage.", "菜单标注了每种含酒精饮料。", "An alcoholic beverage is not included in the ticket.", "门票不含酒精饮料。"],
  ["alcoholic", "形容词·含酒精的", "用来描述饮料时表示含酒精；用于人可能涉及酒精依赖，宜避免随意给人贴标签。", "This sauce contains an alcoholic ingredient.", "这种酱含酒精成分。", "The café offers non-alcoholic and alcoholic drinks.", "咖啡馆供应无酒精和含酒精饮料。"],
  ["liquor", "名词·烈酒；烹饪液", "酒精饮品义主要为美式且常不可数；烹饪语境也可指食物煮泡的液体，需看上下文。", "The shop keeps liquor behind the counter.", "店里把烈酒放在柜台后。", "Reserve the cooking liquor for the sauce.", "保留煮食液做酱汁。"],
  ["whisky", "名词·威士忌", "常不可数，一杯可用a whisky；苏格兰等常拼whisky，爱尔兰和美国常用whiskey。", "The recipe includes a little whisky.", "食谱里有少许威士忌。", "The barrel once held whisky.", "桶里曾装威士忌。"],
  ["brandy", "名词·白兰地", "通常指由葡萄酒等蒸馏而成的烈酒，材料义不可数；也可用a brandy表示一杯。", "The sauce contains a splash of brandy.", "酱汁含少许白兰地。", "The bottle of brandy remained unopened.", "白兰地酒瓶仍未打开。"],
  ["tobacco", "名词·烟草", "通常不可数，指烟草植物或其加工叶片；一支烟用cigarette或cigar，不用a tobacco。", "The museum displays old tobacco tins.", "博物馆展示旧烟草罐。", "The field once grew tobacco.", "这块地曾种烟草。"],
  ["cigar", "名词·雪茄", "可数，指由烟草叶卷成的烟制品；不是普通卷烟cigarette的完全同义表达。", "The cigar box held old letters.", "雪茄盒里放着旧信。", "The portrait shows an unlit cigar.", "肖像上有一支未点燃的雪茄。"],
  ["sober", "形容词·清醒的；严肃的", "可表示未受酒精影响，也可描述严肃冷静的态度；不要凭单个外观特征推断是否清醒。", "The driver remained sober throughout the evening.", "司机整晚保持清醒。", "The report offered a sober assessment.", "报告作出冷静评估。"],
  ["cucumber", "名词·黄瓜", "整根蔬菜可数，切碎食材可用不可数用法；a slice of cucumber是一片黄瓜。", "Slice the cucumber thinly.", "把黄瓜切薄片。", "The cucumber came from our garden.", "黄瓜来自我们的花园。"],
  ["onion", "名词·洋葱", "整颗通常可数，切碎材料可不可数；an onion用an，因为开头是元音音素。", "Chop the onion finely.", "把洋葱切细。", "The soup needs a little onion.", "汤里需要一点洋葱。"],
  ["mushroom", "名词·蘑菇", "可数，指某些真菌的子实体；并非所有蘑菇可食，名字不能作为野生采食依据。", "The mushroom grew beneath the stump.", "蘑菇长在树桩下。", "This mushroom illustration labels each part.", "这幅蘑菇图标注了各部分。"],
  ["eggplant", "名词·茄子", "主要美式用词，英式通常为aubergine；整只可数，烹饪食材可按材料使用。", "Roast the eggplant until soft.", "把茄子烤软。", "The curry contains eggplant and chickpeas.", "咖喱里有茄子和鹰嘴豆。"],
  ["turnip", "名词·芜菁", "可数，通常指圆形块根蔬菜，食材义也可不可数；不要直接等同于所有白萝卜。", "The turnip has a pale purple top.", "芜菁顶部呈浅紫色。", "Add diced turnip to the stew.", "把切丁芜菁加入炖菜。"],
  ["radish", "名词·萝卜", "可指常生食的小萝卜，品种形状颜色各异；整根可数，材料使用可不加冠词。", "The radish tasted crisp and peppery.", "萝卜尝着爽脆微辣。", "Slice a radish over the salad.", "在沙拉上切一根萝卜。"],
  ["hull", "动词·去壳；名词·船体", "食物语境可指去掉种子外壳或果蒂，hull strawberries指去草莓蒂；不是普通切片。", "Hull the strawberries before washing the bowl.", "给草莓去蒂后洗碗。", "The boat's hull needs repainting.", "船体需要重新刷漆。"],
  ["cherry", "名词·樱桃", "单颗可数，复数cherries；烹饪中还可作材料，stone/pit指果核而非外皮。", "A cherry topped each cake.", "每块蛋糕顶上有颗樱桃。", "Remove the stone from the cherry.", "去掉樱桃核。"],
  ["strawberry", "名词·草莓", "单颗可数，复数strawberries；flavour等名词前用单数strawberry表示草莓口味。", "The strawberry was ripe and fragrant.", "草莓熟透且芳香。", "She chose strawberry ice cream.", "她选了草莓冰激凌。"],
  ["blueberry", "名词·蓝莓", "单颗可数，复数blueberries；作口味修饰语时通常用单数blueberry而非复数。", "A blueberry rolled off the plate.", "一颗蓝莓滚下盘子。", "The café serves blueberry muffins.", "咖啡馆供应蓝莓松饼。"],
  ["grape", "名词·葡萄", "单颗可数，一串可说a bunch of grapes；作产品口味修饰语时常用单数grape。", "One grape remained in the bowl.", "碗里剩一颗葡萄。", "The label says grape juice.", "标签写着葡萄汁。"],
  ["papaya", "名词·木瓜", "可数，指热带水果及其果树；作果肉材料时可不加冠词，不能仅按颜色辨别品种。", "The papaya was soft enough to slice.", "木瓜已软到能切片。", "We added papaya to the fruit salad.", "我们往水果沙拉加了木瓜。"],
  ["melon", "名词·瓜；甜瓜", "整只可数，切好果肉可用材料义；不是所有英文melon都能固定对应同一种中文瓜名。", "The melon has pale green flesh.", "瓜有浅绿果肉。", "Serve the melon chilled.", "把瓜冷藏后上桌。"],
  ["lemon", "名词·柠檬", "整只可数，汁或风味可作材料；a slice of lemon是一片柠檬，非整杯饮料。", "A lemon lay beside the chopping board.", "一只柠檬在砧板旁。", "The sauce has a hint of lemon.", "酱汁有淡淡柠檬味。"],
  ["lemonade", "名词·柠檬饮料", "通常不可数，美式常指柠檬汁加糖水，英式也可指柠檬味汽水；应按地域理解。", "The lemonade came in a tall jug.", "柠檬饮料装在高水壶里。", "She poured a glass of lemonade.", "她倒了一杯柠檬饮料。"],
  ["kiwi", "名词·猕猴桃；几维鸟", "水果义可数，鸟类义则指新西兰不会飞的鸟；大写Kiwi还可非正式指新西兰人。", "Slice the kiwi into rounds.", "把猕猴桃切成圆片。", "The kiwi searches for food at night.", "几维鸟夜间觅食。"],
  ["crop", "名词·作物；收成", "可指种植供收获的植物或一次产量，a crop of说明作物；不只表示一株植物。", "Wheat is the farm's main crop.", "小麦是农场主要作物。", "Heavy rain damaged this year's crop.", "暴雨损坏了今年收成。"],
  ["corn", "名词·玉米；谷物", "美式通常指玉米，英式还可泛指谷物；理解农业材料时需注意地域用法。", "The soup contains sweet corn.", "汤里有甜玉米。", "Corn grows in the field beyond the barn.", "谷仓外的田里长着玉米。"],
  ["popcorn", "名词·爆米花", "通常不可数，指玉米粒加热爆开制成的食物；一粒可用a piece/kernel of popcorn。", "The popcorn cooled in a large bowl.", "爆米花在大碗里晾凉。", "We shared a bag of popcorn.", "我们分吃一袋爆米花。"],
  ["wheat", "名词·小麦", "通常不可数，可指作物或籽粒；不把每一株都叫a wheat，可说a stalk of wheat。", "Wheat ripens in the summer fields.", "小麦在夏日田野里成熟。", "This flour is made from wheat.", "这种面粉由小麦制成。"],
  ["flour", "名词·面粉", "通常不可数，指谷物等磨成的粉末；发音与flower相同，写作含义要按上下文区分。", "Sift the flour into a bowl.", "把面粉筛进碗。", "The recipe uses wholemeal flour.", "食谱使用全麦面粉。"],
  ["porridge", "名词·粥；燕麦粥", "英式通常指燕麦加水或奶煮成的稠粥，常不可数；不必等于所有地区的米粥。", "The porridge thickened as it cooled.", "燕麦粥冷却时变稠。", "She stirred honey into her porridge.", "她把蜂蜜拌进燕麦粥。"],
  ["turkey", "名词·火鸡；火鸡肉", "鸟类义可数，肉食义不可数；国家名称Turkey首字母大写，不能与食物混淆。", "A turkey wandered near the barn.", "一只火鸡在谷仓附近走。", "The sandwich contains sliced turkey.", "三明治里有火鸡肉片。"],
  ["beefy", "形容词·壮实的", "通常指人高大结实，也可非正式形容设备强劲；不表示牛肉本身，牛肉名词为beef。", "A beefy guard lifted the barrier.", "壮实的保安抬起栏杆。", "The truck has a beefy engine.", "卡车有强劲发动机。"],
  ["pork", "名词·猪肉", "肉类名通常不可数，活猪称pig；一块可用a piece of pork，不说a pork指一头猪。", "The dumplings contain pork and cabbage.", "饺子里有猪肉和白菜。", "Cook the pork according to the recipe.", "按食谱烹饪猪肉。"],
  ["mutton", "名词·羊肉", "通常不可数，尤其指成年羊的肉；与羔羊肉lamb的区分可能因地区饮食用法而异。", "The stew contains mutton and potatoes.", "炖菜里有羊肉和土豆。", "The butcher sells fresh mutton.", "肉店出售新鲜羊肉。"],
  ["sausage", "名词·香肠", "单根通常可数，作为肉馅材料时也可不可数；不能把所有火腿ham都称作sausage。", "The sausage browned in the pan.", "香肠在锅里煎黄。", "She added sliced sausage to the beans.", "她往豆子里加香肠片。"],
  ["an odd fish", "名词短语·古怪的人", "非正式习语，把人称为an odd fish表示觉得其古怪；不是指鱼的生物分类，语气可能失礼。", "The narrator describes himself as an odd fish.", "叙述者自称古怪的人。", "They called the reclusive inventor an odd fish.", "他们把隐居的发明家称为怪人。"],
  ["pond", "名词·池塘", "可数，通常比湖小的水域，常为人工形成；across the pond另可幽默地指大西洋彼岸。", "The pond reflects the willow.", "池塘倒映柳树。", "Frogs gathered beside the pond.", "青蛙聚在池边。"],
  ["rod", "名词·杆；钓竿", "可数，指长细木杆或金属杆，fishing rod明确指钓竿；不是绳索或弯软线材。", "The rod supports the curtain.", "杆子支撑窗帘。", "He carried a fishing rod to the pond.", "他拿钓竿去池塘。"],
  ["dairy", "形容词·乳制品的", "修饰products或cattle，表示与奶及奶制品有关；名词a dairy另可指奶品场所。", "The menu marks dishes containing dairy products.", "菜单标出含乳制品的菜。", "The farm keeps dairy cattle.", "农场饲养奶牛。"],
  ["boiling", "形容词·沸腾的；很热的", "液体义指达到沸腾状态；口语I'm boiling表示很热，不能理解为人真的在沸腾。", "Pour boiling water over the tea.", "往茶上倒沸水。", "The kitchen was boiling after baking.", "烘焙后厨房热极了。"],
  ["yogurt", "名词·酸奶", "通常不可数，单份或一盒也可说a yogurt；另有yoghurt拼法，两者都指发酵乳食品。", "The yogurt tastes slightly sour.", "酸奶尝着微酸。", "Stir the berries into plain yogurt.", "把浆果拌进原味酸奶。"],
  ["creamy", "形容词·奶油状的", "可指含奶油或具有类似的浓滑质地；creamy sauce并不保证实际加入奶油。", "The soup has a creamy texture.", "汤有绵滑质地。", "Blend until the mixture is creamy.", "搅拌至混合物绵滑。"],
  ["pudding", "名词·布丁；甜点", "英式可泛指餐后甜点或多种热甜食，美式常指奶蛋制成的软甜品；按地区食物判断。", "The pudding was served warm.", "布丁温热上桌。", "What are we having for pudding?", "我们餐后甜点吃什么？"],
  ["sandwich", "名词·三明治", "可数，通常指两片面包夹馅的食物，复数sandwiches；夹什么馅可前置修饰。", "The sandwich contains cheese and cucumber.", "三明治里有奶酪和黄瓜。", "Wrap the sandwich before packing it.", "装包前把三明治包好。"],
  ["loaf", "名词·一条面包", "可数，指烤成一整块后可切片的面包，复数loaves；一片仍需用a slice of bread。", "The loaf cooled on a wire rack.", "面包在金属架上晾凉。", "Slice the loaf with a bread knife.", "用面包刀切这条面包。"],
  ["pasta", "名词·意大利面食", "通常不可数，指面粉等制成的各种形状面食；一份可说a portion of pasta。", "The pasta needs another minute.", "意面还需煮一分钟。", "Serve the pasta with tomato sauce.", "把意面配番茄酱上桌。"],
  ["jam", "名词·果酱", "食品义通常不可数，由水果加糖煮制；a traffic jam另指交通堵塞，勿按食品翻译。", "Spread jam on the warm toast.", "在热吐司上抹果酱。", "The jam contains chunks of apricot.", "果酱里有杏块。"],
  ["vanilla", "名词·香草香料", "通常不可数，指用于甜品调味的香草制品；形容词义也可比喻基础无特色的产品。", "Add a little vanilla to the custard.", "给蛋奶酱加少许香草香料。", "The shop sells vanilla ice cream.", "商店出售香草冰激凌。"],
  ["wasabi", "名词·山葵；芥末酱", "通常不可数，指日本料理用的辛辣山葵或其酱；市售绿色酱的原料并不一定全是山葵。", "A little wasabi accompanied the sushi.", "寿司配有少许山葵酱。", "The label lists wasabi as an ingredient.", "标签把山葵列为原料。"],
  ["pepper", "名词·胡椒；甜椒", "胡椒调味料通常不可数，整只甜椒可数；bell pepper明确指甜椒，不等同于辣椒粉。", "Add pepper after tasting the soup.", "尝汤后加胡椒。", "Slice a red pepper into strips.", "把一只红甜椒切条。"],
  ["ginger", "名词·姜", "调味材料通常不可数，可指鲜姜或姜粉；颜色义指姜黄偏红的色调，按食物语境判断。", "Grate the ginger into the sauce.", "把姜磨进酱里。", "Fresh ginger gives the tea a warm flavour.", "鲜姜给茶带来温辛风味。"],
  ["garlic", "名词·大蒜", "通常不可数，一瓣用a clove of garlic；不能把一瓣和一整个蒜头的量混同。", "Crush the garlic before cooking.", "烹饪前压碎大蒜。", "The dressing contains garlic and lemon.", "沙拉汁含蒜和柠檬。"],
  ["scallion", "名词·青葱", "主要为美式名称，英式常称spring onion；整根可数，不等于成熟的大洋葱。", "Slice the scallion finely.", "把青葱切细。", "A scallion adds colour to the soup.", "一根青葱给汤增色。"],
  ["vinegar", "名词·醋", "通常不可数，是带酸味的调味液；具体种类可加cider或rice，不等于柠檬汁。", "The dressing needs more vinegar.", "沙拉汁还需加醋。", "Store the vinegar in a sealed bottle.", "把醋存放在密封瓶里。"],
  ["salty", "形容词·咸的", "食物义表示有盐味或盐较多；口语也可指恼怒，不能在食品语境中误按情绪翻译。", "The soup tastes too salty.", "汤太咸。", "Choose a less salty snack.", "选不那么咸的小吃。"],
  ["flavour", "名词·味道", "可指整体风味或某种特定口味，英式flavour与美式flavor对应；不只是舌头识别的甜咸。", "The herbs add a fresh flavour.", "香草增添清新风味。", "Which flavour of yogurt would you like?", "你想要哪种口味的酸奶？"],
  ["sour", "形容词·酸的", "食物义可指像柠檬的酸味，牛奶等也可能指变酸；不能因所有酸味就断定食品腐坏。", "The berries are rather sour.", "浆果相当酸。", "The milk smells sour.", "牛奶闻起来酸了。"],
  ["sweeten", "动词·使变甜", "直接接饮品或食物，sweeten with说明所加甜味来源；也可比喻让条件更有吸引力。", "Sweeten the tea with honey.", "用蜂蜜给茶调甜。", "Ripe bananas sweeten the mixture naturally.", "熟香蕉自然地使混合物变甜。"],
  ["spicy", "形容词·香料味浓的", "表示含较强香料风味，常也指辣；不是所有香料都产生辣感，需结合菜品理解。", "The spicy stew warmed us after the walk.", "辛香炖菜让步行后的我们暖和起来。", "Is this sauce very spicy?", "这酱很辣吗？"],
  ["delicious", "形容词·美味的", "表示味道或气味令人十分愉快，通常不需very加强；主观评价不代表营养成分。", "The bread smells delicious.", "面包闻起来很香。", "What a delicious bowl of soup!", "这碗汤真美味！"],
  ["tasty", "形容词·好吃的", "用于形容食物味道浓郁悦口，通常比单纯有味道更正面；不是形容声音的词。", "The beans make a tasty filling.", "豆子做成了好吃的馅。", "This is a simple but tasty meal.", "这顿饭简单却可口。"],
  ["hunger", "名词·饥饿", "通常不可数，既指需要进食的感觉，也可指长期缺食状态；a hunger for则比喻渴望。", "Hunger made it hard to concentrate.", "饥饿让人难以集中。", "The programme aims to reduce hunger.", "项目旨在减少饥饿。"],
  ["sauce", "名词·酱汁", "可指配食物的调味液体，既可泛指也可数种类；不等同任何汤soup。", "The sauce thickens as it cools.", "酱汁冷却时变稠。", "Serve the fish with a lemon sauce.", "给鱼配柠檬酱汁。"],
  ["soy sauce", "名词短语·酱油", "通常不可数，指发酵大豆等制成的深色咸调味液；一瓶用a bottle of soy sauce。", "Add a little soy sauce.", "加少许酱油。", "The marinade contains soy sauce and ginger.", "腌汁里有酱油和姜。"],
  ["ketchup", "名词·番茄酱", "通常不可数，尤指冷食的浓稠红色番茄调味酱；不等于所有用于炖煮的tomato sauce。", "The ketchup bottle is nearly empty.", "番茄酱瓶快空了。", "He put ketchup beside the chips.", "他在薯条旁放番茄酱。"],
  ["perfume", "名词·香水；香气", "香水作为液体常不可数，具体香型可数；自然香气义也可用the perfume of flowers。", "The perfume has a light floral scent.", "香水有淡淡花香。", "The perfume of roses filled the courtyard.", "玫瑰香气充满庭院。"],
  ["digestion", "名词·消化", "通常不可数，指身体分解利用食物的过程或能力；与吃饭本身的eating不是同一过程。", "The diagram explains digestion in birds.", "图示解释鸟类消化。", "The lesson follows food through digestion.", "课程追踪食物的消化过程。"],
  ["cooker", "名词·炊具；炉灶", "主要为英式名词，指烹饪用的大型炉具；不是做饭的人，厨师用cook。", "The cooker has four gas burners.", "炉灶有四个燃气灶头。", "Switch off the cooker after use.", "用后关闭炉灶。"],
  ["baker", "名词·面包师", "可数，指制作或售卖面包蛋糕的人；a baker's可指面包店，而非普通厨房。", "The baker starts work before dawn.", "面包师黎明前上班。", "Ask the baker about the bread's ingredients.", "向面包师询问面包原料。"],
  ["fry", "动词·煎；炸", "指用热油或脂肪烹饪，可及物或不及物；deep-fry则特指让食物浸在油中炸。", "Fry the onion until soft.", "把洋葱炒软。", "We fry the cakes in a shallow pan.", "我们用浅锅煎饼。"],
  ["toast", "名词·吐司；祝酒", "烤面包义不可数，一片用a slice of toast；a toast可指举杯祝愿，两义数量不同。", "The toast was crisp and warm.", "吐司酥脆温热。", "They raised a toast to the volunteers.", "他们举杯向志愿者致意。"],
  ["toaster", "名词·烤面包机", "可数，指把面包片烤成吐司的电器；不是所有烤箱oven都叫toaster。", "The toaster has two slots.", "烤面包机有两个槽。", "Unplug the toaster before cleaning it.", "清洁前拔掉烤面包机电源。"],
  ["lick", "动词·舔", "指舌头擦过物体表面，直接接对象；也可比喻火焰掠过，须看主语判断。", "The puppy tried to lick my hand.", "小狗想舔我的手。", "Do not lick the envelope if it has an adhesive strip.", "若信封有胶条就不要舔。"],
  ["dip", "动词·浸一下；蘸", "dip A into/in B表示将A短暂放入B；不是长期泡浸，过去式dipped双写p。", "Dip the brush into clean water.", "把画笔蘸入清水。", "We dip the bread in olive oil.", "我们用面包蘸橄榄油。"],
  ["dice", "动词·切丁", "烹饪中直接接蔬菜等，表示切成小方块；名词dice另指骰子，句法不同。", "Dice the carrot before adding it.", "先将胡萝卜切丁再加入。", "We dice the potatoes for the salad.", "我们把土豆切丁做沙拉。"],
  ["shred", "动词·切丝；撕碎", "可直接接受处理的材料；shred cabbage通常指切细条，名词a shred则是一小片。", "Shred the cabbage finely.", "把卷心菜切细丝。", "Please shred the confidential draft.", "请把保密草稿碎纸处理。"],
  ["deep-fry", "动词·油炸", "指食物浸在较深热油中炸，带连字符；与用少量油煎的shallow-fry有区别。", "They deep-fry the pastry until golden.", "他们把面点炸至金黄。", "We do not deep-fry these dumplings.", "我们不把这些饺子油炸。"],
  ["steam", "名词·蒸汽；动词·蒸", "蒸汽义不可数；作动词直接接食物表示以蒸汽加热，不能和水中煮boil混为一谈。", "Steam the vegetables briefly.", "把蔬菜稍蒸一下。", "Steam rose from the open kettle.", "蒸汽从开口水壶升起。"],
  ["shell", "动词·剥壳；名词·壳", "作动词直接接坚果或豆类表示去掉壳；名词可指蛋壳或动物硬壳，可数。", "Shell the peas into a bowl.", "把豌豆剥进碗。", "The shell cracked along one side.", "壳沿一侧裂开。"],
  ["mash", "动词·捣成泥", "指把食物压碎成柔软混合物，常接土豆等；不同于只切成小丁的dice。", "Mash the potatoes while warm.", "趁热把土豆捣成泥。", "Use a fork to mash the banana.", "用叉子把香蕉捣成泥。"],
  ["erection", "名词·建造；竖立", "建筑语境中the erection of表示搭建过程；此词另有生理义，正式表达需明确建筑宾语。", "The erection of the scaffold took a day.", "搭脚手架花了一天。", "They supervised the erection of the steel frame.", "他们监督钢框架的竖立。"],
  ["structure", "名词·结构；建筑物", "可指各部分的组织关系或已建成的物体；a structure可数，抽象组织方式也可不可数。", "The structure supports a glass roof.", "结构支撑玻璃屋顶。", "We examined the structure of the argument.", "我们检查了论证结构。"],
  ["construct", "动词·建造", "指组合各部分形成整体，直接接建筑或模型；不把施工名词construction当动词使用。", "Students construct a bridge from paper.", "学生用纸建桥。", "We will construct a shelter beside the path.", "我们将在路边建避雨棚。"],
  ["established", "形容词·成熟的；公认的", "指因长期存在而获认可，常修饰business或practice；不等于刚刚宣布成立。", "The gallery works with established artists.", "画廊与成名艺术家合作。", "The college follows established testing methods.", "学院沿用成熟的测试方法。"],
  ["founder", "名词·创办者", "指建立机构或组织的人，可数；作动词founder可指船沉或计划失败，需按句法分辨。", "The founder donated her notebooks.", "创办者捐出笔记本。", "The museum honours its founder.", "博物馆纪念其创办者。"],
  ["concretely", "副词·具体地", "修饰表述或思考方式，指清楚明确而非抽象；并不自动表示用了水泥材料。", "Please explain the proposal more concretely.", "请更具体地解释提案。", "The model shows concretely how the parts connect.", "模型具体展示部件如何相连。"],
  ["steel", "名词·钢", "主要由铁与碳等组成的材料，泛指时不可数；不要把铁iron与钢完全等同。", "The frame is made of steel.", "框架由钢制成。", "Steel expands when heated.", "钢受热膨胀。"],
  ["stability", "名词·稳定性", "通常不可数，表示不易移动或改变的状态；高稳定性不必意味着结构完全没有弹性。", "The wide base improves stability.", "宽底座提高稳定性。", "Engineers tested the stability of the tower.", "工程师测试了塔的稳定性。"],
  ["site", "名词·地点；工地", "可数，指某事件或建筑所在地点；on site表示在现场，与表示视力的sight同音不同义。", "The site was once a railway yard.", "这里曾是铁路调车场。", "Workers must wear helmets on site.", "工人在工地必须戴安全帽。"],
  ["venue", "名词·活动场所", "可数，通常指举行会议、演出或赛事的地方；不泛指任何没有活动目的的地理位置。", "The venue has step-free access.", "会场有无台阶通道。", "We booked a venue near the station.", "我们订了车站附近的场地。"],
  ["situated", "形容词·位于", "常与be连用，并接in/on等地点短语；不能直接用situated作没有助动词的主动谓语。", "The lodge is situated beside a lake.", "小屋位于湖边。", "The gallery is conveniently situated near the station.", "画廊便利地位于车站旁。"],
  ["locate", "动词·定位；设在", "主动locate可指找到确切位置；be located in表示位于，注意主动寻找与被动位置的区别。", "We could not locate the source of the noise.", "我们找不到噪音源。", "The map helps visitors locate the museum.", "地图帮助游客找到博物馆。"],
  ["settle", "动词·定居；解决", "settle in表示安顿适应，settle a dispute表示解决争端；定居地点常用in或on引出。", "They hope to settle in a coastal town.", "他们希望在海滨小镇定居。", "We must settle the question of access.", "我们必须解决通行问题。"],
  ["dwelling", "名词·住所", "较正式的可数名词，指供居住的地方；不能把所有工业建筑都称为dwelling。", "The dwelling has a sheltered courtyard.", "住所带遮蔽庭院。", "Each dwelling has its own entrance.", "每处住宅都有独立入口。"],
  ["mansion", "名词·宅邸", "可数，指大型而通常昂贵的住宅；不泛指所有独栋房屋或普通公寓。", "The mansion now houses a music school.", "宅邸现在是一所音乐学校。", "A long drive leads to the mansion.", "长车道通向宅邸。"],
  ["lodge", "名词·小屋；门房", "可指乡间住宿小屋或大宅门口的小建筑；lodge a complaint另为提出投诉的动词用法。", "The lodge stands beside the forest trail.", "小屋在森林步道旁。", "We stayed in a small fishing lodge.", "我们住在小型垂钓旅舍。"],
  ["hut", "名词·小屋", "可数，通常指结构简单、空间较小的建筑；不等于所有临时搭起的帐篷tent。", "The hut shelters walkers in bad weather.", "小屋在坏天气为步行者避雨。", "A wooden hut stands above the beach.", "木屋立在海滩上方。"],
  ["cellar", "名词·地窖", "可数，指建筑底层以下常用于储物的房间；不同于只在地面层的小储物间。", "The cellar stays cool in summer.", "地窖夏天保持凉爽。", "We stored the jars in the cellar.", "我们把罐子存进地窖。"],
  ["cradle", "名词·摇篮", "可数，通常指婴儿用、可摇动的小床；the cradle of还可比喻某事物的发源地。", "The cradle stood beside the bed.", "摇篮在床边。", "She gently rocked the cradle.", "她轻轻摇动摇篮。"],
  ["shelter", "名词·遮蔽；庇护所", "保护状态常不可数，具体建筑可数；take shelter from表示躲避某种天气或危险。", "We took shelter from the rain.", "我们躲雨。", "The shelter has room for six walkers.", "避难棚能容纳六名步行者。"],
  ["porch", "名词·门廊", "可数，通常指入口前有顶的结构，有时带侧墙；不是房屋内部所有走廊。", "Leave your boots on the porch.", "把靴子放在门廊。", "The porch keeps rain off the doorway.", "门廊让门口避雨。"],
  ["stair", "名词·一级楼梯", "单数可指一级踏步，整组楼梯通常用stairs并接复数谓语；不可把a stair总译为一整层。", "The lowest stair is loose.", "最下一级楼梯松了。", "She paused on the top stair.", "她在最上一级楼梯停下。"],
  ["staircase", "名词·楼梯结构", "可数，指连接建筑楼层的一整组楼梯，常包含扶手；与单级踏步stair层级不同。", "The staircase curves around the hall.", "楼梯沿大厅弯曲。", "A narrow staircase leads to the attic.", "窄楼梯通向阁楼。"],
  ["storey", "名词·楼层", "英式表示建筑一层，复数storeys；美式通常拼story，英式story另常指故事。", "The top storey has three windows.", "顶层有三扇窗。", "They added another storey to the building.", "他们给建筑加了一层。"],
  ["layer", "名词·层", "可数，指覆盖另一层或夹在其间的材料，a layer of说明内容；厚度并非固定。", "Apply a thin layer of glue.", "涂一层薄胶。", "The next layer contains darker clay.", "下一层含较深色黏土。"],
  ["elevator", "名词·电梯", "主要为美式，英式常用lift；可数，指运人或货物上下楼层的升降设备。", "The elevator opens onto the lobby.", "电梯门通向大堂。", "Take the elevator to the fourth floor.", "乘电梯到四楼。"],
  ["escalator", "名词·自动扶梯", "可数，指台阶连续移动的输送设备；与封闭厢式升降的elevator不同。", "The escalator leads to the platforms.", "自动扶梯通向站台。", "Hold the rail on the escalator.", "乘自动扶梯时扶住扶手。"],
  ["handrail", "名词·扶手", "可数，指楼梯或斜坡旁供手扶的长杆；不把所有用于围挡的栏杆都默认可供攀扶。", "The handrail follows the curve of the stairs.", "扶手沿楼梯曲线延伸。", "A handrail was fitted beside the ramp.", "斜坡旁安装了扶手。"],
  ["laser", "名词·激光；激光器", "可指高控制性的窄光束或产生它的装置；装置可数，光束材料义按语境判断。", "The laser cuts a precise outline.", "激光切出精确轮廓。", "A laser measures the distance.", "激光器测量距离。"],
  ["vault", "名词·拱顶；保险库", "建筑义指支撑屋顶的拱形结构，金融义指安全储物室；不能不看语境统一译保险柜。", "The stone vault spans the chapel.", "石拱顶跨过礼拜堂。", "The documents are kept in a secure vault.", "文件保存在安全库房。"],
  ["vaulted", "形容词·拱顶的", "通常在名词前说明天花板或屋顶由拱形结构形成；不是只要天花板高就必为拱顶。", "The room has a vaulted ceiling.", "房间有拱形天花板。", "Light filled the vaulted hall.", "光线充满拱顶大厅。"],
  ["arched", "形容词·拱形的", "形容顶部呈弧线的结构，常修饰doorway或window；不等于任何倾斜的直线屋顶。", "An arched doorway opens onto the garden.", "拱形门口通向花园。", "The bridge has three arched openings.", "桥有三个拱形开口。"],
  ["eaves", "复数名词·屋檐", "通常指屋顶突出外墙的边缘，以复数形式使用；under the eaves表示在屋檐下。", "Swallows nested under the eaves.", "燕子在屋檐下筑巢。", "Rain dripped from the eaves.", "雨水从屋檐滴下。"],
  ["chimney", "名词·烟囱", "可数，指将室内火源烟气排向室外的中空结构；不是墙上任何普通通风孔。", "Smoke rose from the chimney.", "烟从烟囱升起。", "The chimney needs regular cleaning.", "烟囱需要定期清理。"],
  ["reception", "名词·接待处；招待会", "机构入口处可用at reception，正式社交活动可用a reception；不只表示收到东西。", "Ask at reception for a map.", "到接待处索取地图。", "The reception followed the opening speech.", "招待会在开幕讲话后举行。"],
  ["lobby", "名词·大堂；游说团体", "建筑中指入口大厅，可数；政治中指施加影响的群体，动词lobby for表示游说支持。", "The lobby has comfortable seats.", "大堂有舒适座位。", "We met in the hotel lobby.", "我们在酒店大堂见面。"],
  ["lobbyist", "名词·游说者", "可数，指试图影响官员或政策的人；不是大堂接待员，虽同样含lobby词形。", "The lobbyist submitted written evidence.", "游说者提交了书面证据。", "A lobbyist argued for changes to the rules.", "一位游说者主张修改规则。"],
  ["parlour", "名词·客厅；服务店", "历史住宅语境可指会客厅，商业中常见ice-cream parlour等；英式常拼parlour。", "The parlour contains the original fireplace.", "会客厅保留原壁炉。", "They stopped at an ice-cream parlour.", "他们在冰激凌店停下。"],
  ["fireplace", "名词·壁炉", "可数，指墙内燃火的空间及周围结构；不是把烟引到屋外的chimney烟囱。", "The fireplace has a carved wooden surround.", "壁炉有雕花木框。", "Chairs stood beside the fireplace.", "椅子摆在壁炉旁。"],
  ["lavatory", "名词·厕所", "较正式的可数名词，可指便器或带便器的房间；日常语境也常用toilet或restroom。", "The lavatory is beside the stairs.", "厕所在楼梯旁。", "A sign points to the accessible lavatory.", "标牌指向无障碍厕所。"],
  ["toilet", "名词·便器；厕所", "可指卫生设备或所在房间，具体指代随地域语境；go to the toilet是常用表达。", "The toilet is at the end of the corridor.", "厕所在走廊尽头。", "The toilet has a water-saving flush.", "便器有节水冲水装置。"],
  ["bath", "名词·浴缸；沐浴", "可指装水洗浴的容器或一次洗浴，have/take a bath表示洗澡；不要与动词bathe混形。", "The bath is deep but narrow.", "浴缸深而窄。", "She had a warm bath after the hike.", "她远足后洗了热水澡。"],
  ["bathe", "动词·洗浴；浸洗", "英式也可指在海河中游泳，美式可指洗澡；bathe the wound指冲洗伤口，按对象判断。", "People bathe in the sheltered bay.", "人们在避风海湾游泳。", "Bathe the cloth in warm water.", "把布浸在温水里。"],
  ["booth", "名词·小隔间；展位", "可指电话投票用的隔间或展会摊位，可数；不等于大型独立展馆。", "The booth displays handmade maps.", "展位陈列手工地图。", "She entered the voting booth.", "她走进投票隔间。"],
  ["casino", "名词·赌场", "可数，指提供以金钱下注游戏的场所；不是任何普通游乐场或游戏室。", "The former casino is now a concert hall.", "昔日赌场现为音乐厅。", "The casino entrance faced the harbour.", "赌场入口面向港口。"],
  ["studio", "名词·工作室；演播室", "可指艺术创作空间或录音影视制作场所，可数；studio flat另指开间公寓。", "The studio has a large north-facing window.", "工作室有大北窗。", "They recorded the interview in a studio.", "他们在演播室录访谈。"],
  ["downtown", "副词·在市中心", "主要为美式，go downtown通常不加to；形容词downtown shops表示市中心商店。", "We took the tram downtown.", "我们乘有轨电车到市中心。", "The gallery is downtown.", "画廊在市中心。"],
  ["urbanise", "动词·使城市化", "指把乡村土地开发得具有城市特征，英式常拼urbanise；不等于所有小规模房屋维修。", "The plan would urbanise the valley.", "该计划会使山谷城市化。", "New roads can urbanise rural districts.", "新道路可能使乡村地区城市化。"],
  ["urbanisation", "名词·城市化", "通常不可数，可指人口向城市集中或地区变为城市的过程；英式采用s拼写。", "Urbanisation changed the river valley.", "城市化改变了河谷。", "The report tracks rapid urbanisation.", "报告追踪快速城市化。"],
  ["peripheral", "形容词·外围的；次要的", "位置义指在边缘，重要性义指非核心；peripheral issue不意味着完全无影响。", "The clinic serves peripheral neighbourhoods.", "诊所服务外围街区。", "Parking is a peripheral issue in this debate.", "停车在这场辩论中是次要问题。"],
  ["periphery", "名词·外围", "常用on the periphery of表示在某地区或活动边缘；较正式，不是中心位置。", "Warehouses occupy the city's periphery.", "仓库位于城市外围。", "The village lies on the periphery of the forest.", "村庄位于森林边缘。"],
  ["spacious", "形容词·宽敞的", "表示有较多可用空间，常修饰room或interior；不直接说明装修豪华或房价昂贵。", "The hall is bright and spacious.", "大厅明亮宽敞。", "The cottage has a surprisingly spacious kitchen.", "小屋厨房出奇宽敞。"],
  ["airtight", "形容词·密封的", "本义指空气不能进出的密闭状态；airtight argument则比喻论证严密，需看所修饰对象。", "The seeds stay dry in an airtight jar.", "种子在密封罐里保持干燥。", "Check that the seal is airtight.", "检查封口是否气密。"],
  ["plaza", "名词·广场", "可指城镇开阔广场，也可指集中的商业建筑群；并非所有国家的plaza都同一布局。", "The plaza fills with visitors at noon.", "中午广场满是游客。", "We met beside the fountain in the plaza.", "我们在广场喷泉旁见面。"],
  ["brickwork", "名词·砌砖结构", "通常不可数，指建筑或墙中的砖砌部分；不是单块砖brick，也不是所有建筑工程。", "The brickwork needs repointing.", "砖砌墙需要重新勾缝。", "A climbing plant covered the brickwork.", "攀援植物覆盖砖墙。"],
  ["suspension", "名词·悬吊；暂停", "可指暂时停止活动，也用于suspension bridge表示悬索桥；不同领域中的具体结构应分辨。", "The suspension of services lasted a week.", "服务暂停了一周。", "The suspension bridge spans the river.", "悬索桥跨越河流。"],
  ["hook", "名词·钩子", "可数，指弯曲且用于挂或抓物的部件；hang something on a hook表示挂到钩上。", "The hook holds a heavy lantern.", "钩子挂着重提灯。", "Put your coat on this hook.", "把外套挂在这个钩子上。"],
  ["lever", "名词·杠杆；操纵杆", "可数，指绕支点转动以控制机器或撬动物体的杆；不只是任意一根木棍。", "Push the lever down slowly.", "慢慢向下推操纵杆。", "A long lever moves the heavy stone.", "长杠杆撬动重石。"],
  ["scaffold", "名词·脚手架", "可数，指施工者在高处工作所用支撑架；材料整体也常用不可数名词scaffolding。", "The scaffold surrounds the tower.", "脚手架围着塔。", "Workers inspected the scaffold before climbing.", "工人攀爬前检查脚手架。"],
  ["maltreat", "动词·虐待", "直接接遭受残酷或暴力对待的人或动物，语气强烈；不是所有一般不满意的服务。", "The law forbids owners to maltreat animals.", "法律禁止主人虐待动物。", "No institution may maltreat the people in its care.", "机构不得虐待其照顾的人。"],
  ["maintenance", "名词·维护", "通常不可数，指保持建筑或设备良好状态的工作；不是只有损坏后才进行的repair。", "The bridge requires regular maintenance.", "桥需要定期维护。", "Maintenance costs are included in the budget.", "维护费用包括在预算内。"],
  ["fix", "动词·修理；确定", "可指修复损坏，也可指确定时间等；fix a date表示定日期，不能都译为修理。", "Can you fix the loose handle?", "你能修好松把手吗？", "We need to fix a date for the visit.", "我们需要确定参观日期。"],
  ["mend", "动词·修补", "直接接受损坏的物件，常用于衣物或破裂处；表示身体恢复时也可不及物使用。", "I can mend the torn pocket.", "我能补破口袋。", "We mend small holes before washing the fabric.", "我们洗布料前先补小洞。"],
  ["weld", "动词·焊接", "指熔接相接部位使金属连牢，weld A to B说明连接关系；不同于用胶粘glue。", "They weld the frame in the workshop.", "他们在车间焊框架。", "The repairer will weld a plate over the crack.", "修理工会在裂缝上焊块板。"],
  ["saw", "名词·锯；动词·锯", "工具义可数，动词指用锯切割；也恰为see的过去式，须凭句子结构判断。", "Use a fine saw for this wood.", "这种木头用细齿锯。", "We saw the plank into shorter pieces.", "我们把木板锯成短块。"],
  ["screw", "名词·螺丝", "可数，指有螺纹可旋入材料的紧固件；turn a screw表示拧螺丝，不同于敲入的nail。", "The screw holds the hinge in place.", "螺丝固定铰链。", "Tighten the screw with a suitable driver.", "用合适螺丝刀拧紧螺丝。"],
  ["drill", "名词·钻；训练", "工具义可数，指打孔设备；a fire drill是消防演习，不能都按电钻理解。", "The drill needs a sharper bit.", "钻需要更锋利的钻头。", "The school held a fire drill.", "学校举行了消防演习。"],
  ["viaduct", "名词·高架桥", "指跨越山谷等地形、常由多拱支撑的长高桥，可数；可承载铁路或道路。", "The viaduct carries trains across the valley.", "高架桥载火车跨河谷。", "We photographed the old stone viaduct.", "我们拍了旧石高架桥。"],
  ["span of life", "名词短语·寿命", "词库短语可表示生命持续时间，常规词条更常用lifespan或life span；例句采用life span。", "The insect has a short life span.", "这种昆虫寿命短。", "Researchers compared the life span of several species.", "研究者比较了几种物种的寿命。"],
  ["furniture", "名词·家具", "集合性不可数，不说furnitures；一件用a piece of furniture，具体物品可用chair等名称。", "The furniture fits the small room.", "家具适合小房间。", "We moved the furniture before painting.", "我们刷漆前搬走家具。"],
  ["placement", "名词·放置；实习安排", "可指东西的位置安排，也可指临时实习岗位；work placement明确表示实习而非摆放家具。", "The placement of the desk blocks the light.", "书桌的摆放挡住光。", "She arranged a placement at the museum.", "她安排了博物馆实习。"],
  ["design", "名词·设计", "可指设计活动或具体方案，具体方案可数；a design for说明为哪件物品或用途设计。", "The design uses locally sourced wood.", "设计使用当地木材。", "We approved the design for the entrance.", "我们批准了入口设计。"],
  ["entrance", "名词·入口", "可数，指进入建筑或地区的通道；the entrance to表示通向哪里，区别于进入行为本身。", "The entrance is beside the clock tower.", "入口在钟楼旁。", "Keep the main entrance clear.", "让主入口保持畅通。"],
  ["entry", "名词·进入；参赛作品", "进入行为常不可数，具体参赛项目可数；entry to说明进入某场所或组织的资格。", "Entry is free on Sundays.", "周日免费入场。", "Her entry won the design competition.", "她的参赛作品赢得设计比赛。"],
  ["enter", "动词·进入；报名参加", "进入场所时直接接地点，通常不加into；enter into另可用于讨论或协议等抽象搭配。", "Please enter through the side door.", "请从侧门进入。", "Students may enter the competition online.", "学生可在线报名参赛。"],
  ["exit", "名词·出口", "可数，指离开建筑或车辆的通道；emergency exit是应急出口，需保持可用。", "The exit leads onto the courtyard.", "出口通向庭院。", "Do not block the emergency exit.", "不要堵住应急出口。"],
  ["outside", "副词·在外面", "可独立表示在建筑外，也可作介词接地点；go outside通常不必加to。", "We waited outside until noon.", "我们在外面等到中午。", "Leave the muddy boots outside the door.", "把泥靴留在门外。"],
  ["outward", "形容词·外在的；向外的", "可形容外表可见的表现或向外的方向；outward appearance不一定反映内心状态。", "Her outward calm reassured the group.", "她外表的平静让大家安心。", "The outward journey follows the coast.", "去程沿海岸走。"],
  ["inner", "形容词·内部的", "置于名词前表示里面一层或内心，常见inner wall；不能用作inside的地点副词。", "The inner door opens into a courtyard.", "内门通向庭院。", "The jacket has an inner pocket.", "夹克有内袋。"],
  ["inward", "副词·向内", "表示朝内部的方向，英式也常用inwards；形容词inward feelings指未表达出的内心感受。", "The door opens inward.", "门向内开。", "The petals curl inward at night.", "花瓣夜间向内卷。"],
  ["aviation", "名词·航空", "通常不可数，涵盖飞行及飞机设计制造维护等活动；不是单架飞机的名称。", "The museum traces the history of aviation.", "博物馆追溯航空史。", "She works in civil aviation.", "她在民航业工作。"],
  ["safari", "名词·野生动物观赏旅行", "可数，尤指在自然环境观察动物的有组织旅行；on safari表示参加这种旅行。", "The safari begins before sunrise.", "野生动物观赏旅行日出前开始。", "We saw elephants while on safari.", "我们在野生动物旅行中见到大象。"],
  ["haunt", "动词·萦绕；出没", "担忧记忆作主语可指反复困扰，鬼魂作主语可指经常出现；不是普通的一次参观。", "Those unanswered questions still haunt her.", "未解的问题仍萦绕她心。", "Legends say ghosts haunt the ruined tower.", "传说鬼魂在废塔出没。"],
  ["attraction", "名词·吸引力；景点", "具体吸引游客的地方可数，吸引感通常不可数；a tourist attraction指旅游景点。", "The waterfall is the main attraction.", "瀑布是主要景点。", "The town's attraction lies in its quiet streets.", "城镇的吸引力在安静街道。"],
  ["attractive", "形容词·有吸引力的", "可指外观悦目或条件引人兴趣；an attractive offer不涉及人的外貌，依修饰对象判断。", "The courtyard provides an attractive setting.", "庭院提供宜人环境。", "The pass is an attractive option for frequent visitors.", "通票对常客很有吸引力。"],
  ["monumental", "形容词·巨大的；纪念碑的", "可形容极大规模或重要性，也可指纪念碑式建筑；并不只用于评价正面成就。", "The restoration required monumental effort.", "修复需要巨大努力。", "The archive preserves a monumental collection.", "档案馆保存庞大藏品。"],
  ["pharaoh", "名词·法老", "可数，指古埃及统治者的称号；并非所有古代君主都可以用这一特定历史称谓。", "The pharaoh appears in the wall painting.", "法老出现在壁画中。", "The tomb belonged to a pharaoh.", "墓葬属于一位法老。"],
  ["traffic regulations", "复数名词短语·交通规则", "regulations用复数表示多项规则，traffic说明涉及交通；具体规定随地区而异，例句不替代法规。", "Drivers must follow local traffic regulations.", "司机必须遵守当地交通规则。", "The guide summarises traffic regulations for visitors.", "指南为访客概述交通规则。"],
  ["traffic jam", "名词短语·交通堵塞", "可数，指大量车辆挤在一起无法或只能缓慢移动；be stuck in a traffic jam表示堵在路上。", "A traffic jam delayed the coach.", "堵车耽误了长途客车。", "We were stuck in a traffic jam.", "我们堵在路上。"],
  ["traffic congestion", "名词短语·交通拥堵", "通常不可数，强调道路车辆过多而阻塞的状况；不能直接说a traffic congestion指一次堵车。", "Traffic congestion increases near the stadium.", "体育场旁交通拥堵加剧。", "The new route aims to reduce traffic congestion.", "新路线旨在减少交通拥堵。"],
  ["aeroplane", "名词·飞机", "主要为英式拼写，美式通常airplane；可数，指有机翼并以发动机推动飞行的航空器。", "The aeroplane circled above the coast.", "飞机在海岸上方盘旋。", "We boarded the aeroplane before sunrise.", "我们日出前登上飞机。"],
  ["helicopter", "名词·直升机", "可数，主要靠旋转翼获得升力，可垂直起降；不是固定翼飞机aeroplane的另一拼法。", "The helicopter landed beside the hospital.", "直升机在医院旁降落。", "A helicopter surveyed the flooded valley.", "直升机勘察了受淹河谷。"],
  ["jet", "名词·喷气式飞机；喷流", "可指喷气式飞机或从小孔喷出的细流；a jet of water指一股水流，不是飞机。", "The jet crossed the bay in seconds.", "喷气式飞机数秒内飞过海湾。", "A jet of water cleaned the stone.", "一股水流清洗了石头。"],
  ["parachute", "名词·降落伞", "可数，指展开后减慢人或物下落的设备；jump with a parachute需区别于无装备跳下。", "The parachute opened above the field.", "降落伞在田野上方展开。", "The crate descended by parachute.", "货箱靠降落伞下降。"],
  ["pilot", "名词·飞行员；领航员", "可指驾驶飞机的人或引导船只通过特定水域的人，可数；具体职责由交通工具决定。", "The pilot checked the weather report.", "飞行员查看天气报告。", "A harbour pilot guided the vessel.", "港口领航员引导船只。"],
  ["baggage", "名词·行李", "通常不可数，不说baggages；一件用a piece of baggage，与luggage近义而非单复数对应。", "The baggage arrived on a separate cart.", "行李由另一辆推车运到。", "Keep your baggage with you.", "把行李留在身边。"],
  ["luggage", "名词·行李", "集合性不可数，通常接单数谓语；具体箱包可用bags或suitcases，不用luggages。", "Our luggage is already on board.", "我们的行李已在车上。", "The rack has room for luggage.", "架子有空间放行李。"],
  ["suitcase", "名词·手提箱", "可数，指旅行装衣物的硬或软箱，常带把手及轮子；不等于所有手提小包。", "The suitcase fits under the berth.", "箱子装得进卧铺下。", "She packed a small suitcase.", "她装了个小行李箱。"],
  ["carry-on", "名词·随身行李", "航空语境可作名词或前置形容词，常用carry-on bag；注意带连字符，与动词carry on继续不同。", "My carry-on fits beneath the seat.", "我的随身行李放得进座椅下。", "Keep documents in your carry-on bag.", "把证件放在随身行李包。"],
  ["rack", "名词·架子", "可数，通常指由杆构成、支撑或存放物品的架子；a luggage rack明确为行李架。", "The rack holds six bicycles.", "架子能放六辆自行车。", "Place the suitcase on the luggage rack.", "把行李箱放在行李架。"],
  ["freighter", "名词·货船", "可数，指主要运货的大型船舶；某些语境也可指货机，需结合航海或航空场景。", "The freighter entered the harbour at dawn.", "货船黎明驶入港口。", "A freighter carried grain across the ocean.", "货船跨洋运输谷物。"],
  ["itinerary", "名词·行程计划", "可数，指旅程路线和安排，常用a detailed itinerary；不只是一个目的地名称。", "The itinerary includes a museum visit.", "行程包含参观博物馆。", "Check the itinerary before booking trains.", "订火车前检查行程。"],
  ["passage", "名词·通道；航程", "建筑中可指狭长通道，旅行中可指海上航程；文字中的a passage另指一段文章。", "The passage connects two courtyards.", "通道连接两个庭院。", "The sea passage took three days.", "海上航程花了三天。"],
  ["intersection", "名词·交叉路口", "可数，指道路或线相交处；at the intersection表示在路口，不一定有环岛或信号灯。", "Turn right at the intersection.", "在路口右转。", "The intersection has a pedestrian crossing.", "交叉路口有人行横道。"],
  ["lane", "名词·车道；小路", "可指乡间窄路或道路中分隔的车道，可数；in the left lane指在左侧车道。", "The lane winds between hedges.", "小路蜿蜒穿过树篱。", "Stay in the marked cycle lane.", "保持在标定自行车道内。"],
  ["avenue", "名词·大道", "通常指宽阔道路，常有树木或高楼；比喻an avenue for也可指实现目标的途径。", "The avenue leads to the old palace.", "大道通向旧宫殿。", "Trees shade the broad avenue.", "树荫覆盖宽阔大道。"],
  ["curb", "名词·路缘；动词·抑制", "美式名词curb指路边高起的边缘，英式常拼kerb；动词curb则表示控制限制。", "Wait beside the curb.", "在路缘旁等候。", "The policy aims to curb unnecessary traffic.", "政策旨在限制不必要交通。"],
  ["signpost", "名词·路标", "可数，指显示路线距离的杆式标牌；不等于所有广告牌，动词义也可比喻提示结构。", "The signpost points towards the coast.", "路标指向海岸。", "A wooden signpost marks the junction.", "木路标标出岔口。"],
  ["pavement", "名词·人行道；铺路面", "英式通常指路旁人行道，美式常指道路铺面；理解出行说明时要注意地域差别。", "Walk on the pavement beside the road.", "走路旁人行道。", "The pavement was wet after the shower.", "阵雨后铺路面湿了。"],
  ["vehicle", "名词·车辆", "可数，通常指运人或货的交通工具；不必只限私家车，实际范围依上下文确定。", "The vehicle stopped beside the gate.", "车辆停在门旁。", "Each vehicle needs a parking permit.", "每辆车需要停车证。"],
  ["auto", "名词·汽车", "主要为美式非正式或商业用词，可数；一般日常表达car更常见，不表示所有自动装置。", "The museum restored an early auto.", "博物馆修复了一辆早期汽车。", "The auto show opens tomorrow.", "车展明天开幕。"],
  ["express", "形容词·快车的；动词·表达", "交通中express train指停站较少的快车；动词express an opinion则表示表达观点。", "We boarded the express train.", "我们登上快车。", "Please express your concerns clearly.", "请清楚表达顾虑。"],
  ["tram", "名词·有轨电车", "主要为英式称呼，指沿道路轨道运行的公共电车；美式常用streetcar，不等于普通公交。", "The tram stops outside the museum.", "电车停在博物馆外。", "We took a tram to the market.", "我们乘有轨电车去市场。"],
  ["truck", "名词·卡车", "尤为美式，指运货的大型道路车辆；英式常用lorry，二者不是大小等级的固定划分。", "The truck delivered timber before noon.", "卡车中午前送来木材。", "A truck blocked the narrow entrance.", "卡车堵住了窄入口。"],
  ["lorry", "名词·卡车", "主要为英式用语，可数，美式常用truck；不必理解为一种专门不同的货车类型。", "The lorry carried building materials.", "卡车载着建筑材料。", "We waited for the lorry to reverse.", "我们等待卡车倒车。"],
  ["van", "名词·厢式货车", "可数，常指后部封闭、用于运货的中型车辆；也可有载人型号，需依上下文判断。", "The van carries our exhibition equipment.", "货车运送我们的展览设备。", "A delivery van stopped outside.", "送货车停在外面。"],
  ["carriage", "名词·马车；车厢", "可指马拉车或火车载客的一节车厢；英式铁路常用carriage，美式常用car。", "The carriage rolled through the gate.", "马车驶过大门。", "Our seats are in the front carriage.", "我们的座位在前车厢。"],
  ["tractor", "名词·拖拉机", "可数，通常指农场牵引机械的大轮车辆；不是所有重型货车都可称tractor。", "The tractor pulled a loaded trailer.", "拖拉机拉着满载拖车。", "A tractor stood beside the barn.", "拖拉机停在谷仓旁。"],
  ["pedicab", "名词·三轮人力车", "可数，指载客的脚踏三轮车，常作为短程出租交通；不等同机动三轮摩托车。", "The pedicab carried two passengers.", "三轮人力车载着两名乘客。", "We hired a pedicab near the market.", "我们在市场旁雇了三轮人力车。"],
  ["cycle", "名词·循环；自行车", "可指按顺序重复的过程，也可为bicycle的短式；a cycle of说明循环内容。", "The cycle repeats every spring.", "循环每年春天重复。", "She locked her cycle outside.", "她把自行车锁在外面。"],
  ["garage", "名词·车库；修车厂", "可指停放汽车的房屋或提供维修的商家；at the garage不必表示车辆停在自家车库。", "The garage has room for one car.", "车库能停一辆车。", "The garage repaired the damaged wheel.", "修车厂修好了损坏车轮。"],
  ["vehicles", "复数名词·车辆", "是vehicle的复数，搭配复数谓语；保留词库复数条目，不再加多余的-s。", "These vehicles use electric motors.", "这些车辆使用电动机。", "Only emergency vehicles may enter.", "只有应急车辆可进入。"],
  ["wheel", "名词·轮子", "可数，指绕中心轴转动的圆形部件；at the wheel可比喻在驾驶，不只指触摸车轮。", "The wheel caught in a rut.", "车轮卡进车辙。", "Check each wheel before the journey.", "旅程前检查每个车轮。"],
  ["tire", "名词·轮胎；动词·疲劳", "轮胎义为美式拼写，英式tyre；动词tire表示疲倦，与轮胎义依句法区分。", "The tire needs more air.", "轮胎需要充气。", "Long journeys can tire young children.", "长途旅行会让幼儿疲倦。"],
  ["honk", "动词·鸣喇叭", "可指汽车喇叭或鹅发出短促响声；honk the horn是常见搭配，不用于描述所有机械噪音。", "Please do not honk near the hospital.", "请勿在医院附近鸣笛。", "Geese honk above the marsh.", "鹅在沼泽上方鸣叫。"],
  ["steward", "名词·服务员；管理员", "可指船机服务人员或活动组织管理者；中性称谓视场景可用attendant，不能只译管家。", "The steward checked our tickets.", "工作人员检查车票。", "A steward showed us to the cabin.", "服务员带我们去舱房。"],
  ["stewardess", "名词·女乘务员", "传统上指女性航空乘务员，带性别限定；现代职业场合常用中性称谓flight attendant。", "The memoir describes her work as a stewardess.", "回忆录描述她任女乘务员的工作。", "The stewardess in the old film wears a blue uniform.", "老电影的女乘务员穿蓝制服。"],
  ["disappear", "动词·消失", "通常不及物，不能把物品直接接在后面表示使之消失；disappear from说明离开的视野或地方。", "The boat seemed to disappear into the fog.", "船似乎消失在雾里。", "The stains disappear after washing.", "污渍洗后消失。"],
  ["hazard", "名词·危险因素", "可数，指可能造成伤害的具体来源，a hazard to说明受威胁对象；不只是抽象风险概率。", "The loose cable is a trip hazard.", "松电缆有绊倒危险。", "Ice is a hazard to walkers.", "冰对步行者构成危险。"],
  ["hazardous", "形容词·危险的", "常用于物质、作业或状况，强调涉及伤害风险；不能与名词hazard在句中任意互换。", "Workers labelled the hazardous material.", "工人标注危险材料。", "The route becomes hazardous after snow.", "下雪后路线变危险。"],
  ["harbour", "名词·港口", "英式拼法，指海岸旁供船停泊避风的水域；美式常用harbor，不是任意海滩。", "The harbour shelters fishing boats.", "港口为渔船避风。", "We watched the ferry enter the harbour.", "我们看渡轮入港。"],
  ["dock", "名词·船坞；码头", "可指港口装卸修船区域或停靠结构，语义因地域设施不同；作动词指靠泊。", "The dock was busy before dawn.", "码头黎明前很忙。", "Workers unloaded crates at the dock.", "工人在码头卸箱。"],
  ["sailor", "名词·水手", "可指船上工作的人或帆船运动参加者，可数；与所有坐船旅客passengers角色不同。", "The sailor checked the mooring rope.", "水手检查系泊绳。", "A sailor explained how the tide worked.", "一位水手解释潮汐规律。"],
  ["seaman", "名词·海员", "传统上指在海船工作的人，常含男性用词色彩；现代泛指时也可使用seafarer等中性词。", "The seaman kept a careful log.", "海员认真记航海日志。", "He trained as a merchant seaman.", "他受训成为商船海员。"],
  ["steamer", "名词·汽船；蒸锅", "可指蒸汽动力船或以蒸汽烹饪的容器，均可数；需依海运或厨房语境判断。", "The steamer once carried mail.", "汽船曾运邮件。", "Put the vegetables in the steamer.", "把蔬菜放进蒸锅。"],
  ["liner", "名词·班轮；内衬", "航运中指有固定航线的大客轮或货轮；材料中也可指内衬，不能都按船舶理解。", "The liner crossed the ocean weekly.", "班轮每周横渡海洋。", "The bag has a waterproof liner.", "包有防水内衬。"],
  ["ferry", "名词·渡轮", "可数，通常定时运人或车辆渡过水域；take a ferry表示乘渡轮，不必是长途远洋船。", "The ferry carries cars across the inlet.", "渡轮载汽车过海湾。", "We caught the last ferry home.", "我们赶上末班渡轮回家。"],
  ["sail", "动词·航行", "可指船在水上行驶或人操纵帆船；sail to接目的地，不一定所有航行船都有帆。", "We sail to the island tomorrow.", "我们明天航行去岛上。", "Small boats sail across the bay.", "小船在海湾航行。"],
  ["deck", "名词·甲板", "可数，指船上可行走的水平面，也可指公交车层；on deck表示在甲板上。", "Passengers gathered on deck.", "乘客聚在甲板上。", "The deck was wet with spray.", "甲板被浪花打湿。"],
  ["propeller", "名词·螺旋桨", "可数，指高速旋转叶片推动船或飞机前进的装置；不是风吹自身转动的普通装饰风车。", "The propeller turned beneath the stern.", "螺旋桨在船尾下旋转。", "A damaged propeller delayed the flight.", "损坏的螺旋桨耽误了航班。"],
  ["stern", "名词·船尾；形容词·严厉的", "船舶义指船体后端，at the stern表在船尾；形容词stern warning则指严厉警告。", "A light marked the stern.", "一盏灯标示船尾。", "The guide gave us a stern warning.", "向导严厉警告我们。"],
  ["embark", "动词·登船；开始", "登船义常用embark on a ship；embark on a project则表示着手项目，不是任何普通迈步。", "Passengers embark at the eastern dock.", "乘客在东码头登船。", "We will embark on a new research project.", "我们将开始新研究项目。"],
  ["railroad", "名词·铁路", "主要为美式，可指轨道或铁路运输系统；英式常用railway，两词不固定分客货用途。", "The railroad connects the port to the mines.", "铁路连接港口和矿区。", "A railroad once crossed the valley.", "铁路曾穿过山谷。"],
  ["railway", "名词·铁路", "主要为英式，可指轨道或整个铁路系统；by railway不如by rail常用，需留意交通搭配。", "The railway follows the river.", "铁路沿河延伸。", "The railway station has step-free access.", "火车站有无台阶通道。"],
  ["locomotive", "名词·机车", "可数，指牵引列车的动力车头；不同于载客车厢carriage，不是每个车厢都叫locomotive。", "The locomotive pulled six carriages.", "机车牵引六节车厢。", "The museum restored a steam locomotive.", "博物馆修复了一台蒸汽机车。"],
  ["subway", "名词·地铁；地下通道", "美式常指地下城市铁路，英式也可指行人过街地下通道；先判断地域和交通情境。", "We took the subway downtown.", "我们乘地铁到市中心。", "The subway carries pedestrians beneath the road.", "地下通道供行人从路下穿过。"],
  ["underground", "副词·在地下", "可作副词说明位置，也可作形容词修饰结构；英式the Underground可专指伦敦地铁。", "The cables run underground.", "电缆在地下铺设。", "Workers explored an underground passage.", "工人探索地下通道。"],
  ["rail", "名词·铁路运输；钢轨", "by rail表示乘火车或铁路运输，通常不加冠词；单根轨道材料可用a rail。", "The goods travel by rail.", "货物通过铁路运输。", "A damaged rail was replaced overnight.", "损坏的钢轨连夜更换。"],
  ["delay", "动词·延误", "delay doing表示推迟行动，后接动名词；不是delay to do，名词a delay另指一次延误。", "The storm may delay the ferry.", "风暴可能延误渡轮。", "We cannot delay repairing the roof.", "我们不能推迟修屋顶。"],
  ["postpone", "动词·推迟", "postpone something until接新时间，postpone doing接行动；通常含另行安排而非彻底取消。", "We must postpone the picnic until Sunday.", "我们必须把野餐推至周日。", "They postpone opening the road after heavy rain.", "大雨后他们推迟开放道路。"],
  ["lull", "名词·暂时平静", "可数，指活动或声音中短暂的间歇，a lull in说明哪种活动；不代表永久停止。", "A lull in traffic let us cross.", "交通暂缓让我们能过路。", "We waited for a lull in the rain.", "我们等雨暂歇。"],
  ["due", "形容词·预期到达的；到期的", "be due at接预计时间，be due to do表示预定做事；due to后接原因则是不同结构。", "The train is due at six.", "火车预计六点到。", "The library books are due tomorrow.", "图书馆的书明天到期。"],
  ["postage", "名词·邮资", "通常不可数，指寄信包裹支付的费用；not include postage表示价格不含邮费，而非缺少邮票图案。", "The price includes postage.", "价格包含邮资。", "How much postage does this parcel need?", "这个包裹需多少邮资？"],
  ["post", "名词·邮政；邮件", "英式邮件义通常不可数，美式常用mail；by post表示邮寄，不能将其直接等同一张邮票。", "The documents arrived by post.", "文件通过邮寄送达。", "There is no post on Sunday.", "周日没有邮件投递。"],
  ["stamp", "名词·邮票；印章", "可指贴信件证明付费的纸片，也可指盖印工具，可数；put a stamp on表示贴邮票。", "The stamp shows a local bird.", "邮票画着本地鸟。", "The clerk pressed a stamp onto the form.", "办事员在表格上盖章。"],
  ["package", "名词·包裹", "可数，指包裹好的物品或商品包装，尤为美式常用；不是所有package都指旅游套餐。", "The package contains two framed prints.", "包裹里有两幅装框版画。", "A package arrived for the curator.", "寄给策展人的包裹到了。"],
  ["pack", "动词·打包", "pack something into说明装入哪里，pack for a trip表示为旅行收拾；不必每次都装到完全满。", "Pack the cups in soft paper.", "用软纸包装杯子。", "We pack lightly for short trips.", "我们短途旅行轻装打包。"],
  ["parcel", "名词·包裹", "英式常指邮寄的包好物品，可数；a parcel of land另指一块地，须看所接名词。", "The parcel was wrapped in brown paper.", "包裹用棕纸包着。", "Please weigh the parcel before posting it.", "寄出前称包裹。"],
  ["load", "名词·载荷；一批货", "可指车辆承载的重量或数量，可数；a load of说明装载物，不直接等同车辆自身重量。", "The load must be evenly distributed.", "载荷必须均匀分布。", "The truck carried a load of bricks.", "卡车载着一车砖。"],
  ["unload", "动词·卸载", "可接车辆表示卸下其货物，也可接货物表示卸货；不一定指把货物丢弃。", "Workers unload the van at dawn.", "工人黎明卸货车。", "Please unload the fragile boxes first.", "请先卸易碎箱子。"],
  ["transition", "名词·过渡", "常用the transition from A to B表示由A转为B的过程；不必是瞬间完成的切换。", "The transition to electric buses took years.", "转向电动公交花了多年。", "Clear signs eased the transition between terminals.", "清晰标识使航站楼间转场更顺畅。"],
  ["deliver", "动词·递送；发表", "deliver something to说明送达对象或地点；deliver a speech是发表演讲，不能都译为快递。", "We deliver books to remote villages.", "我们向偏远村庄送书。", "She will deliver the opening speech.", "她将发表开幕演讲。"],
  ["republic", "名词·共和国", "可数，指通常没有世袭君主、由代表等治理的国家体制；具体制度不能仅凭名称推定。", "The republic adopted a new constitution.", "共和国通过新宪法。", "The chapter examines the early republic.", "这一章研究早期共和国。"],
  ["republican", "形容词·共和制的", "小写通常指支持共和制度；大写Republican常指美国共和党相关，不能混同一般政治立场。", "The essay discusses republican institutions.", "文章讨论共和制机构。", "She favoured a republican form of government.", "她赞成共和政体。"],
  ["marxism", "名词·马克思主义", "理论名称通常写作Marxism，首字母大写；指与马克思著作相关的思想体系，内部有不同解读。", "The seminar compares interpretations of Marxism.", "研讨课比较马克思主义的不同解读。", "The book traces the history of Marxism.", "这本书追溯马克思主义历史。"],
  ["socialism", "名词·社会主义", "通常不可数，指强调社会公共所有等原则的思想及制度；不同语境的具体实现并不完全相同。", "The course examines debates about socialism.", "课程研究关于社会主义的争论。", "The chapter compares forms of socialism.", "这一章比较社会主义的不同形式。"],
  ["socialist", "形容词·社会主义的", "表示与社会主义思想或政党有关，也可作名词指支持者；不能据此自动推定某人的全部观点。", "The archive contains socialist pamphlets.", "档案收藏社会主义宣传册。", "The socialist argued for public ownership.", "这位社会主义者主张公有制。"],
  ["communism", "名词·共产主义", "通常不可数，指以阶级和生产资料共同所有等观念为核心的思想或相关制度，需区分理论实践。", "The lecture outlines the theory of communism.", "讲座概述共产主义理论。", "Historians debate the development of communism.", "历史学家讨论共产主义的发展。"],
  ["communist", "形容词·共产主义的", "可修饰思想、组织或政府，也可作名词指支持者；具体党名中可能按专名规则大写。", "The archive preserves communist newspapers.", "档案保存共产主义报纸。", "The communist joined the public debate.", "这位共产主义者参加公开辩论。"],
  ["government", "名词·政府", "可指执政群体或治理体系；英式集合名词谓语可随侧重变化，美式通常当单数机构。", "The government published the transport plan.", "政府公布交通计划。", "Local government maintains these roads.", "地方政府维护这些道路。"],
  ["authorise", "动词·授权", "authorise someone to do表示正式准许某人行动，直接接事项也可；英式常拼authorise。", "Only managers can authorise the payment.", "只有经理能批准付款。", "We authorise staff to use the archive.", "我们授权员工使用档案。"],
  ["political", "形容词·政治的", "修饰制度、活动或观点，表示与政治有关；不自动含褒义或贬义，具体态度来自上下文。", "The exhibition explores political cartoons.", "展览探索政治漫画。", "The decision sparked political debate.", "决定引发政治讨论。"],
  ["policy", "名词·政策；保险单", "政策义指机构采纳的行动原则，可数或不可数；保险语境a policy指保险合同，勿混译。", "The school revised its attendance policy.", "学校修改出勤政策。", "Check the policy before making a claim.", "索赔前查看保险单。"],
  ["politician", "名词·政治人物", "可数，指参与政治、尤其以此为职业的人；不等于政治学研究者political scientist。", "The politician answered questions from students.", "政治人物回答学生问题。", "A local politician attended the public meeting.", "当地政治人物参加公众会议。"],
  ["democratise", "动词·使民主化", "指让决策更有民主参与，也可指使资源更广泛可及；英式常用s拼写，不必限于国家体制。", "The proposal aims to democratise decision-making.", "提议旨在使决策民主化。", "Public libraries help democratise access to knowledge.", "公共图书馆帮助扩大知识获取。"],
  ["bureaucracy", "名词·官僚机构；繁文缛节", "可中性指按规则运作的行政组织，也可批评繁琐程序；不能把两义评价一概相同。", "The study examines the local bureaucracy.", "研究考察地方官僚机构。", "Excessive bureaucracy delayed the repairs.", "过多繁文缛节延误维修。"],
  ["bureaucratism", "名词·官僚主义", "通常不可数，偏批评性地指拘泥规章与文书手续的作风；不是所有行政组织的中性名称。", "The report criticises bureaucratism in procurement.", "报告批评采购中的官僚主义。", "Bureaucratism slowed the response to requests.", "官僚主义拖慢了请求处理。"],
  ["egalitarian", "形容词·平等主义的", "表示相信人应享有同等权利机会，常修饰society或principles；不表示每人偏好完全相同。", "The club adopted egalitarian principles.", "社团采纳平等主义原则。", "She imagined a more egalitarian society.", "她设想更平等的社会。"],
  ["materialism", "名词·物质主义；唯物主义", "日常可指重金钱财物，哲学可指物质为根本的理论；两义评价与领域不同。", "The novel criticises consumer materialism.", "小说批评消费物质主义。", "The seminar examines philosophical materialism.", "研讨课研究哲学唯物主义。"],
  ["revolution", "名词·革命；巨变", "可指政治制度的剧烈改变或某领域重大转变；机械中a revolution另指转一整圈。", "The industrial revolution changed the town.", "工业革命改变了小镇。", "The wheel completes one revolution per second.", "车轮每秒转一圈。"],
  ["revolutionary", "形容词·革命的；革新的", "政治义表示涉及革命，技术义可指带来巨大改变；宣传中的revolutionary仍需看实际证据。", "The archive preserves revolutionary songs.", "档案保存革命歌曲。", "The new printing method was revolutionary.", "新印刷方法具有革新意义。"],
  ["procession", "名词·行列；游行队伍", "可数，通常指按一定方向有序行进的队列，常用于典礼；不是任何随机聚集的人群。", "The procession crossed the central square.", "游行队伍穿过中央广场。", "Musicians led the procession.", "乐师带领行列。"],
  ["meltdown", "名词·熔毁；崩溃", "核能中指燃料过热熔化的严重事故，金融等语境比喻全面失常；不只是一般短暂延误。", "The simulation examines a reactor meltdown.", "模拟研究反应堆熔毁。", "The chapter describes the financial meltdown.", "这一章描述金融崩溃。"],
  ["bilateral", "形容词·双边的", "通常表示涉及两个国家或群体，常修饰agreement或talks；不等于所有多方谈判。", "The countries signed a bilateral agreement.", "两国签订双边协议。", "Bilateral talks resumed after the break.", "休息后双边会谈恢复。"],
  ["arena", "名词·竞技场；领域", "可指周围有观众席的活动场地，也可比喻争论活动的领域；in the political arena指政治领域。", "The arena hosted a cycling competition.", "竞技场举办自行车赛。", "She entered the political arena reluctantly.", "她不情愿地进入政治领域。"],
];
const sources = {
  "e8-source-novice": {
    "title": "剑桥词典 · novice",
    "url": "https://dictionary.cambridge.org/dictionary/english/novice",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-literate": {
    "title": "剑桥词典 · literate",
    "url": "https://dictionary.cambridge.org/dictionary/english/literate",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-illiteracy": {
    "title": "剑桥词典 · illiteracy",
    "url": "https://dictionary.cambridge.org/dictionary/english/illiteracy",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-numerate": {
    "title": "剑桥词典 · numerate",
    "url": "https://dictionary.cambridge.org/dictionary/english/numerate",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-controversial": {
    "title": "剑桥词典 · controversial",
    "url": "https://dictionary.cambridge.org/dictionary/english/controversial",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-issue": {
    "title": "剑桥词典 · issue",
    "url": "https://dictionary.cambridge.org/dictionary/english/issue",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-affair": {
    "title": "剑桥词典 · affair",
    "url": "https://dictionary.cambridge.org/dictionary/english/affair",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-riddle": {
    "title": "剑桥词典 · riddle",
    "url": "https://dictionary.cambridge.org/dictionary/english/riddle",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-instil": {
    "title": "剑桥词典 · instil",
    "url": "https://dictionary.cambridge.org/dictionary/english/instil",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cram": {
    "title": "剑桥词典 · cram",
    "url": "https://dictionary.cambridge.org/dictionary/english/cram",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-emphasise": {
    "title": "剑桥词典 · emphasise",
    "url": "https://dictionary.cambridge.org/dictionary/english/emphasise",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-enable": {
    "title": "剑桥词典 · enable",
    "url": "https://dictionary.cambridge.org/dictionary/english/enable",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-inspire": {
    "title": "剑桥词典 · inspire",
    "url": "https://dictionary.cambridge.org/dictionary/english/inspire",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-indulge": {
    "title": "剑桥词典 · indulge",
    "url": "https://dictionary.cambridge.org/dictionary/english/indulge",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-intelligible": {
    "title": "剑桥词典 · intelligible",
    "url": "https://dictionary.cambridge.org/dictionary/english/intelligible",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-all-round": {
    "title": "剑桥词典 · all-round",
    "url": "https://dictionary.cambridge.org/dictionary/english/all-round",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-idiot": {
    "title": "剑桥词典 · idiot",
    "url": "https://dictionary.cambridge.org/dictionary/english/idiot",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-wisdom": {
    "title": "剑桥词典 · wisdom",
    "url": "https://dictionary.cambridge.org/dictionary/english/wisdom",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-wit": {
    "title": "剑桥词典 · wit",
    "url": "https://dictionary.cambridge.org/dictionary/english/wit",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-aptitude": {
    "title": "剑桥词典 · aptitude",
    "url": "https://dictionary.cambridge.org/dictionary/english/aptitude",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-excellent": {
    "title": "剑桥词典 · excellent",
    "url": "https://dictionary.cambridge.org/dictionary/english/excellent",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-reputation": {
    "title": "剑桥词典 · reputation",
    "url": "https://dictionary.cambridge.org/dictionary/english/reputation",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-eminent": {
    "title": "剑桥词典 · eminent",
    "url": "https://dictionary.cambridge.org/dictionary/english/eminent",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-notorious": {
    "title": "剑桥词典 · notorious",
    "url": "https://dictionary.cambridge.org/dictionary/english/notorious",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-esteem": {
    "title": "剑桥词典 · esteem",
    "url": "https://dictionary.cambridge.org/dictionary/english/esteem",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-respect": {
    "title": "剑桥词典 · respect",
    "url": "https://dictionary.cambridge.org/dictionary/english/respect",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-diligent": {
    "title": "剑桥词典 · diligent",
    "url": "https://dictionary.cambridge.org/dictionary/english/diligent",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-painstaking": {
    "title": "剑桥词典 · painstaking",
    "url": "https://dictionary.cambridge.org/dictionary/english/painstaking",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-skill": {
    "title": "剑桥词典 · skill",
    "url": "https://dictionary.cambridge.org/dictionary/english/skill",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-headmaster": {
    "title": "剑桥词典 · headmaster",
    "url": "https://dictionary.cambridge.org/dictionary/english/headmaster",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-professor": {
    "title": "剑桥词典 · professor",
    "url": "https://dictionary.cambridge.org/dictionary/english/professor",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-mentor": {
    "title": "剑桥词典 · mentor",
    "url": "https://dictionary.cambridge.org/dictionary/english/mentor",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tutor": {
    "title": "剑桥词典 · tutor",
    "url": "https://dictionary.cambridge.org/dictionary/english/tutor",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lecturer": {
    "title": "剑桥词典 · lecturer",
    "url": "https://dictionary.cambridge.org/dictionary/english/lecturer",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-assistant": {
    "title": "剑桥词典 · assistant",
    "url": "https://dictionary.cambridge.org/dictionary/english/assistant",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-degree": {
    "title": "剑桥词典 · degree",
    "url": "https://dictionary.cambridge.org/dictionary/english/degree",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-permit": {
    "title": "剑桥词典 · permit",
    "url": "https://dictionary.cambridge.org/dictionary/english/permit",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-diploma": {
    "title": "剑桥词典 · diploma",
    "url": "https://dictionary.cambridge.org/dictionary/english/diploma",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-graduate": {
    "title": "剑桥词典 · graduate",
    "url": "https://dictionary.cambridge.org/dictionary/english/graduate",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-bachelor": {
    "title": "Merriam-Webster · bachelor's degree",
    "url": "https://www.merriam-webster.com/dictionary/bachelor%27s%20degree",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-bachelor-2": {
    "title": "剑桥词典 · bachelor",
    "url": "https://dictionary.cambridge.org/dictionary/english/bachelor",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-master": {
    "title": "Merriam-Webster · master's degree",
    "url": "https://www.merriam-webster.com/dictionary/master%27s%20degree",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-master-2": {
    "title": "剑桥词典 · master",
    "url": "https://dictionary.cambridge.org/dictionary/english/master",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-fresher": {
    "title": "剑桥词典 · fresher",
    "url": "https://dictionary.cambridge.org/dictionary/english/fresher",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sophomore": {
    "title": "剑桥词典 · sophomore",
    "url": "https://dictionary.cambridge.org/dictionary/english/sophomore",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-junior": {
    "title": "剑桥词典 · junior",
    "url": "https://dictionary.cambridge.org/dictionary/english/junior",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-senior": {
    "title": "剑桥词典 · senior",
    "url": "https://dictionary.cambridge.org/dictionary/english/senior",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-alumni": {
    "title": "剑桥词典 · alumni",
    "url": "https://dictionary.cambridge.org/dictionary/english/alumni",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-orientation": {
    "title": "剑桥词典 · orientation",
    "url": "https://dictionary.cambridge.org/dictionary/english/orientation",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-coed": {
    "title": "剑桥词典 · coed",
    "url": "https://dictionary.cambridge.org/dictionary/english/coed",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-enrol": {
    "title": "剑桥词典 · enrol",
    "url": "https://dictionary.cambridge.org/dictionary/english/enrol",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-matriculation": {
    "title": "剑桥词典 · matriculation",
    "url": "https://dictionary.cambridge.org/dictionary/english/matriculation",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-dorm": {
    "title": "剑桥词典 · dorm",
    "url": "https://dictionary.cambridge.org/dictionary/english/dorm",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-dining hall": {
    "title": "剑桥词典 · dining hall",
    "url": "https://dictionary.cambridge.org/dictionary/english/dining%20hall",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-canteen": {
    "title": "剑桥词典 · canteen",
    "url": "https://dictionary.cambridge.org/dictionary/english/canteen",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-experiment": {
    "title": "剑桥词典 · experiment",
    "url": "https://dictionary.cambridge.org/dictionary/english/experiment",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-data": {
    "title": "剑桥词典 · data",
    "url": "https://dictionary.cambridge.org/dictionary/english/data",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-quality": {
    "title": "剑桥词典 · quality",
    "url": "https://dictionary.cambridge.org/dictionary/english/quality",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-library": {
    "title": "剑桥词典 · library",
    "url": "https://dictionary.cambridge.org/dictionary/english/library",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-author": {
    "title": "剑桥词典 · author",
    "url": "https://dictionary.cambridge.org/dictionary/english/author",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-diary": {
    "title": "剑桥词典 · diary",
    "url": "https://dictionary.cambridge.org/dictionary/english/diary",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-poetry": {
    "title": "剑桥词典 · poetry",
    "url": "https://dictionary.cambridge.org/dictionary/english/poetry",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-magazine": {
    "title": "剑桥词典 · magazine",
    "url": "https://dictionary.cambridge.org/dictionary/english/magazine",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-journal": {
    "title": "剑桥词典 · journal",
    "url": "https://dictionary.cambridge.org/dictionary/english/journal",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-coverage": {
    "title": "剑桥词典 · coverage",
    "url": "https://dictionary.cambridge.org/dictionary/english/coverage",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-bibliography": {
    "title": "剑桥词典 · bibliography",
    "url": "https://dictionary.cambridge.org/dictionary/english/bibliography",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-record": {
    "title": "剑桥词典 · record",
    "url": "https://dictionary.cambridge.org/dictionary/english/record",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-file": {
    "title": "剑桥词典 · file",
    "url": "https://dictionary.cambridge.org/dictionary/english/file",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-frame": {
    "title": "剑桥词典 · frame",
    "url": "https://dictionary.cambridge.org/dictionary/english/frame",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-catalogue": {
    "title": "剑桥词典 · catalogue",
    "url": "https://dictionary.cambridge.org/dictionary/english/catalogue",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-content": {
    "title": "剑桥词典 · content",
    "url": "https://dictionary.cambridge.org/dictionary/english/content",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-list": {
    "title": "剑桥词典 · list",
    "url": "https://dictionary.cambridge.org/dictionary/english/list",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-volume": {
    "title": "剑桥词典 · volume",
    "url": "https://dictionary.cambridge.org/dictionary/english/volume",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-reel": {
    "title": "剑桥词典 · reel",
    "url": "https://dictionary.cambridge.org/dictionary/english/reel",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-subject": {
    "title": "剑桥词典 · subject",
    "url": "https://dictionary.cambridge.org/dictionary/english/subject",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-major": {
    "title": "剑桥词典 · major",
    "url": "https://dictionary.cambridge.org/dictionary/english/major",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sociology": {
    "title": "剑桥词典 · sociology",
    "url": "https://dictionary.cambridge.org/dictionary/english/sociology",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-politics": {
    "title": "剑桥词典 · politics",
    "url": "https://dictionary.cambridge.org/dictionary/english/politics",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-economics": {
    "title": "剑桥词典 · economics",
    "url": "https://dictionary.cambridge.org/dictionary/english/economics",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-marketing": {
    "title": "剑桥词典 · marketing",
    "url": "https://dictionary.cambridge.org/dictionary/english/marketing",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-accounting": {
    "title": "剑桥词典 · accounting",
    "url": "https://dictionary.cambridge.org/dictionary/english/accounting",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-audit": {
    "title": "剑桥词典 · audit",
    "url": "https://dictionary.cambridge.org/dictionary/english/audit",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-psychology": {
    "title": "剑桥词典 · psychology",
    "url": "https://dictionary.cambridge.org/dictionary/english/psychology",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-philosophy": {
    "title": "剑桥词典 · philosophy",
    "url": "https://dictionary.cambridge.org/dictionary/english/philosophy",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-logic": {
    "title": "剑桥词典 · logic",
    "url": "https://dictionary.cambridge.org/dictionary/english/logic",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-physics": {
    "title": "剑桥词典 · physics",
    "url": "https://dictionary.cambridge.org/dictionary/english/physics",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-logistics": {
    "title": "剑桥词典 · logistics",
    "url": "https://dictionary.cambridge.org/dictionary/english/logistics",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-geography": {
    "title": "剑桥词典 · geography",
    "url": "https://dictionary.cambridge.org/dictionary/english/geography",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-history": {
    "title": "剑桥词典 · history",
    "url": "https://dictionary.cambridge.org/dictionary/english/history",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-engineering": {
    "title": "剑桥词典 · engineering",
    "url": "https://dictionary.cambridge.org/dictionary/english/engineering",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-mechanics": {
    "title": "剑桥词典 · mechanics",
    "url": "https://dictionary.cambridge.org/dictionary/english/mechanics",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-maths": {
    "title": "剑桥词典 · maths",
    "url": "https://dictionary.cambridge.org/dictionary/english/maths",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-arithmetic": {
    "title": "剑桥词典 · arithmetic",
    "url": "https://dictionary.cambridge.org/dictionary/english/arithmetic",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-geometry": {
    "title": "剑桥词典 · geometry",
    "url": "https://dictionary.cambridge.org/dictionary/english/geometry",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-calculus": {
    "title": "剑桥词典 · calculus",
    "url": "https://dictionary.cambridge.org/dictionary/english/calculus",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-plus": {
    "title": "剑桥词典 · plus",
    "url": "https://dictionary.cambridge.org/dictionary/english/plus",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-merger": {
    "title": "剑桥词典 · merger",
    "url": "https://dictionary.cambridge.org/dictionary/english/merger",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-minus": {
    "title": "剑桥词典 · minus",
    "url": "https://dictionary.cambridge.org/dictionary/english/minus",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-subtract": {
    "title": "剑桥词典 · subtract",
    "url": "https://dictionary.cambridge.org/dictionary/english/subtract",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-divide": {
    "title": "剑桥词典 · divide",
    "url": "https://dictionary.cambridge.org/dictionary/english/divide",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-dividend": {
    "title": "剑桥词典 · dividend",
    "url": "https://dictionary.cambridge.org/dictionary/english/dividend",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-rational": {
    "title": "剑桥词典 · rational",
    "url": "https://dictionary.cambridge.org/dictionary/english/rational",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-even": {
    "title": "剑桥词典 · even",
    "url": "https://dictionary.cambridge.org/dictionary/english/even",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-mean": {
    "title": "剑桥词典 · mean",
    "url": "https://dictionary.cambridge.org/dictionary/english/mean",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-double": {
    "title": "剑桥词典 · double",
    "url": "https://dictionary.cambridge.org/dictionary/english/double",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-triple": {
    "title": "剑桥词典 · triple",
    "url": "https://dictionary.cambridge.org/dictionary/english/triple",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-quadruple": {
    "title": "剑桥词典 · quadruple",
    "url": "https://dictionary.cambridge.org/dictionary/english/quadruple",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-minimum": {
    "title": "剑桥词典 · minimum",
    "url": "https://dictionary.cambridge.org/dictionary/english/minimum",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-maximum": {
    "title": "剑桥词典 · maximum",
    "url": "https://dictionary.cambridge.org/dictionary/english/maximum",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-approximately": {
    "title": "剑桥词典 · approximately",
    "url": "https://dictionary.cambridge.org/dictionary/english/approximately",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-graph": {
    "title": "剑桥词典 · graph",
    "url": "https://dictionary.cambridge.org/dictionary/english/graph",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cube": {
    "title": "剑桥词典 · cube",
    "url": "https://dictionary.cambridge.org/dictionary/english/cube",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-triangle": {
    "title": "剑桥词典 · triangle",
    "url": "https://dictionary.cambridge.org/dictionary/english/triangle",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-straight": {
    "title": "剑桥词典 · straight",
    "url": "https://dictionary.cambridge.org/dictionary/english/straight",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-round": {
    "title": "剑桥词典 · round",
    "url": "https://dictionary.cambridge.org/dictionary/english/round",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-dot": {
    "title": "剑桥词典 · dot",
    "url": "https://dictionary.cambridge.org/dictionary/english/dot",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cone": {
    "title": "剑桥词典 · cone",
    "url": "https://dictionary.cambridge.org/dictionary/english/cone",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-width": {
    "title": "剑桥词典 · width",
    "url": "https://dictionary.cambridge.org/dictionary/english/width",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-length": {
    "title": "剑桥词典 · length",
    "url": "https://dictionary.cambridge.org/dictionary/english/length",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-per cent": {
    "title": "Merriam-Webster · percent",
    "url": "https://www.merriam-webster.com/dictionary/percent",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-ounce": {
    "title": "剑桥词典 · ounce",
    "url": "https://dictionary.cambridge.org/dictionary/english/ounce",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-fahrenheit": {
    "title": "剑桥词典 · fahrenheit",
    "url": "https://dictionary.cambridge.org/dictionary/english/fahrenheit",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-volt": {
    "title": "剑桥词典 · volt",
    "url": "https://dictionary.cambridge.org/dictionary/english/volt",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-transparent": {
    "title": "剑桥词典 · transparent",
    "url": "https://dictionary.cambridge.org/dictionary/english/transparent",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-ozone": {
    "title": "剑桥词典 · ozone",
    "url": "https://dictionary.cambridge.org/dictionary/english/ozone",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-eccentric": {
    "title": "剑桥词典 · eccentric",
    "url": "https://dictionary.cambridge.org/dictionary/english/eccentric",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-dilute": {
    "title": "剑桥词典 · dilute",
    "url": "https://dictionary.cambridge.org/dictionary/english/dilute",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-noxious": {
    "title": "剑桥词典 · noxious",
    "url": "https://dictionary.cambridge.org/dictionary/english/noxious",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-inert": {
    "title": "剑桥词典 · inert",
    "url": "https://dictionary.cambridge.org/dictionary/english/inert",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-doctrine": {
    "title": "剑桥词典 · doctrine",
    "url": "https://dictionary.cambridge.org/dictionary/english/doctrine",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-semester": {
    "title": "剑桥词典 · semester",
    "url": "https://dictionary.cambridge.org/dictionary/english/semester",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-timetable": {
    "title": "剑桥词典 · timetable",
    "url": "https://dictionary.cambridge.org/dictionary/english/timetable",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-deadline": {
    "title": "剑桥词典 · deadline",
    "url": "https://dictionary.cambridge.org/dictionary/english/deadline",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-course": {
    "title": "剑桥词典 · course",
    "url": "https://dictionary.cambridge.org/dictionary/english/course",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-seminar": {
    "title": "剑桥词典 · seminar",
    "url": "https://dictionary.cambridge.org/dictionary/english/seminar",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-syllabus": {
    "title": "剑桥词典 · syllabus",
    "url": "https://dictionary.cambridge.org/dictionary/english/syllabus",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-system": {
    "title": "剑桥词典 · system",
    "url": "https://dictionary.cambridge.org/dictionary/english/system",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-basic": {
    "title": "剑桥词典 · basic",
    "url": "https://dictionary.cambridge.org/dictionary/english/basic",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-surface": {
    "title": "剑桥词典 · surface",
    "url": "https://dictionary.cambridge.org/dictionary/english/surface",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-prerequisite": {
    "title": "剑桥词典 · prerequisite",
    "url": "https://dictionary.cambridge.org/dictionary/english/prerequisite",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-elective": {
    "title": "剑桥词典 · elective",
    "url": "https://dictionary.cambridge.org/dictionary/english/elective",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-preview": {
    "title": "剑桥词典 · preview",
    "url": "https://dictionary.cambridge.org/dictionary/english/preview",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-inspect": {
    "title": "剑桥词典 · inspect",
    "url": "https://dictionary.cambridge.org/dictionary/english/inspect",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-skim": {
    "title": "剑桥词典 · skim",
    "url": "https://dictionary.cambridge.org/dictionary/english/skim",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-scan": {
    "title": "剑桥词典 · scan",
    "url": "https://dictionary.cambridge.org/dictionary/english/scan",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-scrutinise": {
    "title": "剑桥词典 · scrutinise",
    "url": "https://dictionary.cambridge.org/dictionary/english/scrutinise",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-recite": {
    "title": "剑桥词典 · recite",
    "url": "https://dictionary.cambridge.org/dictionary/english/recite",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-test": {
    "title": "剑桥词典 · test",
    "url": "https://dictionary.cambridge.org/dictionary/english/test",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-quiz": {
    "title": "剑桥词典 · quiz",
    "url": "https://dictionary.cambridge.org/dictionary/english/quiz",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-plagiarise": {
    "title": "剑桥词典 · plagiarise",
    "url": "https://dictionary.cambridge.org/dictionary/english/plagiarise",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-copy": {
    "title": "剑桥词典 · copy",
    "url": "https://dictionary.cambridge.org/dictionary/english/copy",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-print": {
    "title": "剑桥词典 · print",
    "url": "https://dictionary.cambridge.org/dictionary/english/print",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-essay": {
    "title": "剑桥词典 · essay",
    "url": "https://dictionary.cambridge.org/dictionary/english/essay",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-paper": {
    "title": "剑桥词典 · paper",
    "url": "https://dictionary.cambridge.org/dictionary/english/paper",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-dissertation": {
    "title": "剑桥词典 · dissertation",
    "url": "https://dictionary.cambridge.org/dictionary/english/dissertation",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-heading": {
    "title": "剑桥词典 · heading",
    "url": "https://dictionary.cambridge.org/dictionary/english/heading",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-outset": {
    "title": "剑桥词典 · outset",
    "url": "https://dictionary.cambridge.org/dictionary/english/outset",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-point": {
    "title": "剑桥词典 · point",
    "url": "https://dictionary.cambridge.org/dictionary/english/point",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-opinion": {
    "title": "剑桥词典 · opinion",
    "url": "https://dictionary.cambridge.org/dictionary/english/opinion",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-introduce": {
    "title": "剑桥词典 · introduce",
    "url": "https://dictionary.cambridge.org/dictionary/english/introduce",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-postulate": {
    "title": "剑桥词典 · postulate",
    "url": "https://dictionary.cambridge.org/dictionary/english/postulate",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-recognise": {
    "title": "剑桥词典 · recognise",
    "url": "https://dictionary.cambridge.org/dictionary/english/recognise",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-insist": {
    "title": "剑桥词典 · insist",
    "url": "https://dictionary.cambridge.org/dictionary/english/insist",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-persist": {
    "title": "剑桥词典 · persist",
    "url": "https://dictionary.cambridge.org/dictionary/english/persist",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-understand": {
    "title": "剑桥词典 · understand",
    "url": "https://dictionary.cambridge.org/dictionary/english/understand",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-compare": {
    "title": "剑桥词典 · compare",
    "url": "https://dictionary.cambridge.org/dictionary/english/compare",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-contrast": {
    "title": "剑桥词典 · contrast",
    "url": "https://dictionary.cambridge.org/dictionary/english/contrast",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-contradiction": {
    "title": "剑桥词典 · contradiction",
    "url": "https://dictionary.cambridge.org/dictionary/english/contradiction",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-disagree": {
    "title": "剑桥词典 · disagree",
    "url": "https://dictionary.cambridge.org/dictionary/english/disagree",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-nuance": {
    "title": "剑桥词典 · nuance",
    "url": "https://dictionary.cambridge.org/dictionary/english/nuance",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-inductive": {
    "title": "剑桥词典 · inductive",
    "url": "https://dictionary.cambridge.org/dictionary/english/inductive",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-detail": {
    "title": "剑桥词典 · detail",
    "url": "https://dictionary.cambridge.org/dictionary/english/detail",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-example": {
    "title": "剑桥词典 · example",
    "url": "https://dictionary.cambridge.org/dictionary/english/example",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-prove": {
    "title": "剑桥词典 · prove",
    "url": "https://dictionary.cambridge.org/dictionary/english/prove",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-decide": {
    "title": "剑桥词典 · decide",
    "url": "https://dictionary.cambridge.org/dictionary/english/decide",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-research": {
    "title": "剑桥词典 · research",
    "url": "https://dictionary.cambridge.org/dictionary/english/research",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-score": {
    "title": "剑桥词典 · score",
    "url": "https://dictionary.cambridge.org/dictionary/english/score",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-mark": {
    "title": "剑桥词典 · mark",
    "url": "https://dictionary.cambridge.org/dictionary/english/mark",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-grade": {
    "title": "剑桥词典 · grade",
    "url": "https://dictionary.cambridge.org/dictionary/english/grade",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-rank": {
    "title": "剑桥词典 · rank",
    "url": "https://dictionary.cambridge.org/dictionary/english/rank",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-queue": {
    "title": "剑桥词典 · queue",
    "url": "https://dictionary.cambridge.org/dictionary/english/queue",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-praise": {
    "title": "剑桥词典 · praise",
    "url": "https://dictionary.cambridge.org/dictionary/english/praise",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-fellowship": {
    "title": "剑桥词典 · fellowship",
    "url": "https://dictionary.cambridge.org/dictionary/english/fellowship",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-scholarship": {
    "title": "剑桥词典 · scholarship",
    "url": "https://dictionary.cambridge.org/dictionary/english/scholarship",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-prize": {
    "title": "剑桥词典 · prize",
    "url": "https://dictionary.cambridge.org/dictionary/english/prize",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-fee": {
    "title": "剑桥词典 · fee",
    "url": "https://dictionary.cambridge.org/dictionary/english/fee",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-technology": {
    "title": "剑桥词典 · technology",
    "url": "https://dictionary.cambridge.org/dictionary/english/technology",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-polytechnic": {
    "title": "剑桥词典 · polytechnic",
    "url": "https://dictionary.cambridge.org/dictionary/english/polytechnic",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-engineer": {
    "title": "剑桥词典 · engineer",
    "url": "https://dictionary.cambridge.org/dictionary/english/engineer",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-breakthrough": {
    "title": "剑桥词典 · breakthrough",
    "url": "https://dictionary.cambridge.org/dictionary/english/breakthrough",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-gizmo": {
    "title": "剑桥词典 · gizmo",
    "url": "https://dictionary.cambridge.org/dictionary/english/gizmo",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-invent": {
    "title": "剑桥词典 · invent",
    "url": "https://dictionary.cambridge.org/dictionary/english/invent",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-foundation": {
    "title": "剑桥词典 · foundation",
    "url": "https://dictionary.cambridge.org/dictionary/english/foundation",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-specialise": {
    "title": "剑桥词典 · specialise",
    "url": "https://dictionary.cambridge.org/dictionary/english/specialise",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-utilise": {
    "title": "剑桥词典 · utilise",
    "url": "https://dictionary.cambridge.org/dictionary/english/utilise",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tester": {
    "title": "剑桥词典 · tester",
    "url": "https://dictionary.cambridge.org/dictionary/english/tester",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-facility": {
    "title": "剑桥词典 · facility",
    "url": "https://dictionary.cambridge.org/dictionary/english/facility",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-equipment": {
    "title": "剑桥词典 · equipment",
    "url": "https://dictionary.cambridge.org/dictionary/english/equipment",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-instrument": {
    "title": "剑桥词典 · instrument",
    "url": "https://dictionary.cambridge.org/dictionary/english/instrument",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tool": {
    "title": "剑桥词典 · tool",
    "url": "https://dictionary.cambridge.org/dictionary/english/tool",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-measure": {
    "title": "剑桥词典 · measure",
    "url": "https://dictionary.cambridge.org/dictionary/english/measure",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-count": {
    "title": "剑桥词典 · count",
    "url": "https://dictionary.cambridge.org/dictionary/english/count",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-estimate": {
    "title": "剑桥词典 · estimate",
    "url": "https://dictionary.cambridge.org/dictionary/english/estimate",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-byproduct": {
    "title": "剑桥词典 · byproduct",
    "url": "https://dictionary.cambridge.org/dictionary/english/byproduct",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-add": {
    "title": "剑桥词典 · add",
    "url": "https://dictionary.cambridge.org/dictionary/english/add",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-gather": {
    "title": "剑桥词典 · gather",
    "url": "https://dictionary.cambridge.org/dictionary/english/gather",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-optics": {
    "title": "剑桥词典 · optics",
    "url": "https://dictionary.cambridge.org/dictionary/english/optics",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-radar": {
    "title": "剑桥词典 · radar",
    "url": "https://dictionary.cambridge.org/dictionary/english/radar",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sensor": {
    "title": "剑桥词典 · sensor",
    "url": "https://dictionary.cambridge.org/dictionary/english/sensor",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-multimedia": {
    "title": "剑桥词典 · multimedia",
    "url": "https://dictionary.cambridge.org/dictionary/english/multimedia",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-network": {
    "title": "剑桥词典 · network",
    "url": "https://dictionary.cambridge.org/dictionary/english/network",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-browser": {
    "title": "剑桥词典 · browser",
    "url": "https://dictionary.cambridge.org/dictionary/english/browser",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-dial": {
    "title": "剑桥词典 · dial",
    "url": "https://dictionary.cambridge.org/dictionary/english/dial",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-microcomputer": {
    "title": "剑桥词典 · microcomputer",
    "url": "https://dictionary.cambridge.org/dictionary/english/microcomputer",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-laptop": {
    "title": "剑桥词典 · laptop",
    "url": "https://dictionary.cambridge.org/dictionary/english/laptop",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-software": {
    "title": "剑桥词典 · software",
    "url": "https://dictionary.cambridge.org/dictionary/english/software",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-keyboard": {
    "title": "剑桥词典 · keyboard",
    "url": "https://dictionary.cambridge.org/dictionary/english/keyboard",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-screen": {
    "title": "剑桥词典 · screen",
    "url": "https://dictionary.cambridge.org/dictionary/english/screen",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-loudspeaker": {
    "title": "剑桥词典 · loudspeaker",
    "url": "https://dictionary.cambridge.org/dictionary/english/loudspeaker",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-microphone": {
    "title": "剑桥词典 · microphone",
    "url": "https://dictionary.cambridge.org/dictionary/english/microphone",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cassette": {
    "title": "剑桥词典 · cassette",
    "url": "https://dictionary.cambridge.org/dictionary/english/cassette",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tape": {
    "title": "剑桥词典 · tape",
    "url": "https://dictionary.cambridge.org/dictionary/english/tape",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-binary": {
    "title": "剑桥词典 · binary",
    "url": "https://dictionary.cambridge.org/dictionary/english/binary",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-digital": {
    "title": "剑桥词典 · digital",
    "url": "https://dictionary.cambridge.org/dictionary/english/digital",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-wireless": {
    "title": "剑桥词典 · wireless",
    "url": "https://dictionary.cambridge.org/dictionary/english/wireless",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-high-definition": {
    "title": "剑桥词典 · high-definition",
    "url": "https://dictionary.cambridge.org/dictionary/english/high-definition",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-audio": {
    "title": "剑桥词典 · audio",
    "url": "https://dictionary.cambridge.org/dictionary/english/audio",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-science fiction": {
    "title": "剑桥词典 · science fiction",
    "url": "https://dictionary.cambridge.org/dictionary/english/science%20fiction",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-generator": {
    "title": "剑桥词典 · generator",
    "url": "https://dictionary.cambridge.org/dictionary/english/generator",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pivot": {
    "title": "剑桥词典 · pivot",
    "url": "https://dictionary.cambridge.org/dictionary/english/pivot",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-hydraulic": {
    "title": "剑桥词典 · hydraulic",
    "url": "https://dictionary.cambridge.org/dictionary/english/hydraulic",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sewage": {
    "title": "剑桥词典 · sewage",
    "url": "https://dictionary.cambridge.org/dictionary/english/sewage",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-ventilation": {
    "title": "剑桥词典 · ventilation",
    "url": "https://dictionary.cambridge.org/dictionary/english/ventilation",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-simplify": {
    "title": "剑桥词典 · simplify",
    "url": "https://dictionary.cambridge.org/dictionary/english/simplify",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-distil": {
    "title": "剑桥词典 · distil",
    "url": "https://dictionary.cambridge.org/dictionary/english/distil",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-mode": {
    "title": "剑桥词典 · mode",
    "url": "https://dictionary.cambridge.org/dictionary/english/mode",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-convert": {
    "title": "剑桥词典 · convert",
    "url": "https://dictionary.cambridge.org/dictionary/english/convert",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-turn": {
    "title": "剑桥词典 · turn",
    "url": "https://dictionary.cambridge.org/dictionary/english/turn",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-error": {
    "title": "剑桥词典 · error",
    "url": "https://dictionary.cambridge.org/dictionary/english/error",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-fault": {
    "title": "剑桥词典 · fault",
    "url": "https://dictionary.cambridge.org/dictionary/english/fault",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-stumble": {
    "title": "剑桥词典 · stumble",
    "url": "https://dictionary.cambridge.org/dictionary/english/stumble",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-contingency": {
    "title": "剑桥词典 · contingency",
    "url": "https://dictionary.cambridge.org/dictionary/english/contingency",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-culture": {
    "title": "剑桥词典 · culture",
    "url": "https://dictionary.cambridge.org/dictionary/english/culture",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-civilisation": {
    "title": "剑桥词典 · civilisation",
    "url": "https://dictionary.cambridge.org/dictionary/english/civilisation",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-epic": {
    "title": "剑桥词典 · epic",
    "url": "https://dictionary.cambridge.org/dictionary/english/epic",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-ideology": {
    "title": "剑桥词典 · ideology",
    "url": "https://dictionary.cambridge.org/dictionary/english/ideology",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tradition": {
    "title": "剑桥词典 · tradition",
    "url": "https://dictionary.cambridge.org/dictionary/english/tradition",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-custom": {
    "title": "剑桥词典 · custom",
    "url": "https://dictionary.cambridge.org/dictionary/english/custom",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-feudalism": {
    "title": "剑桥词典 · feudalism",
    "url": "https://dictionary.cambridge.org/dictionary/english/feudalism",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-slavery": {
    "title": "剑桥词典 · slavery",
    "url": "https://dictionary.cambridge.org/dictionary/english/slavery",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-ethical": {
    "title": "剑桥词典 · ethical",
    "url": "https://dictionary.cambridge.org/dictionary/english/ethical",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-aboriginal": {
    "title": "剑桥词典 · aboriginal",
    "url": "https://dictionary.cambridge.org/dictionary/english/aboriginal",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-native": {
    "title": "剑桥词典 · native",
    "url": "https://dictionary.cambridge.org/dictionary/english/native",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-local": {
    "title": "剑桥词典 · local",
    "url": "https://dictionary.cambridge.org/dictionary/english/local",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-foreigner": {
    "title": "剑桥词典 · foreigner",
    "url": "https://dictionary.cambridge.org/dictionary/english/foreigner",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-anthropologist": {
    "title": "剑桥词典 · anthropologist",
    "url": "https://dictionary.cambridge.org/dictionary/english/anthropologist",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-heritage": {
    "title": "剑桥词典 · heritage",
    "url": "https://dictionary.cambridge.org/dictionary/english/heritage",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-antique": {
    "title": "剑桥词典 · antique",
    "url": "https://dictionary.cambridge.org/dictionary/english/antique",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-museum": {
    "title": "剑桥词典 · museum",
    "url": "https://dictionary.cambridge.org/dictionary/english/museum",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pottery": {
    "title": "剑桥词典 · pottery",
    "url": "https://dictionary.cambridge.org/dictionary/english/pottery",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-religion": {
    "title": "剑桥词典 · religion",
    "url": "https://dictionary.cambridge.org/dictionary/english/religion",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-etiquette": {
    "title": "剑桥词典 · etiquette",
    "url": "https://dictionary.cambridge.org/dictionary/english/etiquette",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-belief": {
    "title": "剑桥词典 · belief",
    "url": "https://dictionary.cambridge.org/dictionary/english/belief",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-soul": {
    "title": "剑桥词典 · soul",
    "url": "https://dictionary.cambridge.org/dictionary/english/soul",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-spirit": {
    "title": "剑桥词典 · spirit",
    "url": "https://dictionary.cambridge.org/dictionary/english/spirit",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-hallowed": {
    "title": "剑桥词典 · hallowed",
    "url": "https://dictionary.cambridge.org/dictionary/english/hallowed",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-holy": {
    "title": "剑桥词典 · holy",
    "url": "https://dictionary.cambridge.org/dictionary/english/holy",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pope": {
    "title": "剑桥词典 · pope",
    "url": "https://dictionary.cambridge.org/dictionary/english/pope",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-bishop": {
    "title": "剑桥词典 · bishop",
    "url": "https://dictionary.cambridge.org/dictionary/english/bishop",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-missionary": {
    "title": "剑桥词典 · missionary",
    "url": "https://dictionary.cambridge.org/dictionary/english/missionary",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-monk": {
    "title": "剑桥词典 · monk",
    "url": "https://dictionary.cambridge.org/dictionary/english/monk",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-temple": {
    "title": "剑桥词典 · temple",
    "url": "https://dictionary.cambridge.org/dictionary/english/temple",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pagoda": {
    "title": "剑桥词典 · pagoda",
    "url": "https://dictionary.cambridge.org/dictionary/english/pagoda",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-chronology": {
    "title": "剑桥词典 · chronology",
    "url": "https://dictionary.cambridge.org/dictionary/english/chronology",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-king": {
    "title": "剑桥词典 · king",
    "url": "https://dictionary.cambridge.org/dictionary/english/king",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-queen": {
    "title": "剑桥词典 · queen",
    "url": "https://dictionary.cambridge.org/dictionary/english/queen",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-prince": {
    "title": "剑桥词典 · prince",
    "url": "https://dictionary.cambridge.org/dictionary/english/prince",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-princess": {
    "title": "剑桥词典 · princess",
    "url": "https://dictionary.cambridge.org/dictionary/english/princess",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-majesty": {
    "title": "剑桥词典 · majesty",
    "url": "https://dictionary.cambridge.org/dictionary/english/majesty",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-nobility": {
    "title": "剑桥词典 · nobility",
    "url": "https://dictionary.cambridge.org/dictionary/english/nobility",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lord": {
    "title": "剑桥词典 · lord",
    "url": "https://dictionary.cambridge.org/dictionary/english/lord",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-knight": {
    "title": "剑桥词典 · knight",
    "url": "https://dictionary.cambridge.org/dictionary/english/knight",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-nostalgia": {
    "title": "剑桥词典 · nostalgia",
    "url": "https://dictionary.cambridge.org/dictionary/english/nostalgia",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-background": {
    "title": "剑桥词典 · background",
    "url": "https://dictionary.cambridge.org/dictionary/english/background",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-experience": {
    "title": "剑桥词典 · experience",
    "url": "https://dictionary.cambridge.org/dictionary/english/experience",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-accident": {
    "title": "剑桥词典 · accident",
    "url": "https://dictionary.cambridge.org/dictionary/english/accident",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-setback": {
    "title": "剑桥词典 · setback",
    "url": "https://dictionary.cambridge.org/dictionary/english/setback",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-adversity": {
    "title": "剑桥词典 · adversity",
    "url": "https://dictionary.cambridge.org/dictionary/english/adversity",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-language": {
    "title": "剑桥词典 · language",
    "url": "https://dictionary.cambridge.org/dictionary/english/language",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-symbol": {
    "title": "剑桥词典 · symbol",
    "url": "https://dictionary.cambridge.org/dictionary/english/symbol",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-gesture": {
    "title": "剑桥词典 · gesture",
    "url": "https://dictionary.cambridge.org/dictionary/english/gesture",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-handwriting": {
    "title": "剑桥词典 · handwriting",
    "url": "https://dictionary.cambridge.org/dictionary/english/handwriting",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pictograph": {
    "title": "剑桥词典 · pictograph",
    "url": "https://dictionary.cambridge.org/dictionary/english/pictograph",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-wedge": {
    "title": "剑桥词典 · wedge",
    "url": "https://dictionary.cambridge.org/dictionary/english/wedge",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-knot": {
    "title": "剑桥词典 · knot",
    "url": "https://dictionary.cambridge.org/dictionary/english/knot",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-linguistics": {
    "title": "剑桥词典 · linguistics",
    "url": "https://dictionary.cambridge.org/dictionary/english/linguistics",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-semantic": {
    "title": "剑桥词典 · semantic",
    "url": "https://dictionary.cambridge.org/dictionary/english/semantic",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-syntax": {
    "title": "剑桥词典 · syntax",
    "url": "https://dictionary.cambridge.org/dictionary/english/syntax",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-grammar": {
    "title": "剑桥词典 · grammar",
    "url": "https://dictionary.cambridge.org/dictionary/english/grammar",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-phonetics": {
    "title": "剑桥词典 · phonetics",
    "url": "https://dictionary.cambridge.org/dictionary/english/phonetics",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pronounce": {
    "title": "剑桥词典 · pronounce",
    "url": "https://dictionary.cambridge.org/dictionary/english/pronounce",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-intonation": {
    "title": "剑桥词典 · intonation",
    "url": "https://dictionary.cambridge.org/dictionary/english/intonation",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-inflection": {
    "title": "剑桥词典 · inflection",
    "url": "https://dictionary.cambridge.org/dictionary/english/inflection",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-accent": {
    "title": "剑桥词典 · accent",
    "url": "https://dictionary.cambridge.org/dictionary/english/accent",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-utterance": {
    "title": "剑桥词典 · utterance",
    "url": "https://dictionary.cambridge.org/dictionary/english/utterance",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-oral": {
    "title": "剑桥词典 · oral",
    "url": "https://dictionary.cambridge.org/dictionary/english/oral",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-phoneme": {
    "title": "剑桥词典 · phoneme",
    "url": "https://dictionary.cambridge.org/dictionary/english/phoneme",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-vowel": {
    "title": "剑桥词典 · vowel",
    "url": "https://dictionary.cambridge.org/dictionary/english/vowel",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-consonant": {
    "title": "剑桥词典 · consonant",
    "url": "https://dictionary.cambridge.org/dictionary/english/consonant",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-logogram": {
    "title": "剑桥词典 · logogram",
    "url": "https://dictionary.cambridge.org/dictionary/english/logogram",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-vocabulary": {
    "title": "剑桥词典 · vocabulary",
    "url": "https://dictionary.cambridge.org/dictionary/english/vocabulary",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-diction": {
    "title": "剑桥词典 · diction",
    "url": "https://dictionary.cambridge.org/dictionary/english/diction",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-idiom": {
    "title": "剑桥词典 · idiom",
    "url": "https://dictionary.cambridge.org/dictionary/english/idiom",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-phrase": {
    "title": "剑桥词典 · phrase",
    "url": "https://dictionary.cambridge.org/dictionary/english/phrase",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-clause": {
    "title": "剑桥词典 · clause",
    "url": "https://dictionary.cambridge.org/dictionary/english/clause",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-expression": {
    "title": "剑桥词典 · expression",
    "url": "https://dictionary.cambridge.org/dictionary/english/expression",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tense": {
    "title": "剑桥词典 · tense",
    "url": "https://dictionary.cambridge.org/dictionary/english/tense",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-prefix": {
    "title": "剑桥词典 · prefix",
    "url": "https://dictionary.cambridge.org/dictionary/english/prefix",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-suffix": {
    "title": "剑桥词典 · suffix",
    "url": "https://dictionary.cambridge.org/dictionary/english/suffix",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-abbreviation": {
    "title": "剑桥词典 · abbreviation",
    "url": "https://dictionary.cambridge.org/dictionary/english/abbreviation",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-antonym": {
    "title": "剑桥词典 · antonym",
    "url": "https://dictionary.cambridge.org/dictionary/english/antonym",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-noun": {
    "title": "剑桥词典 · noun",
    "url": "https://dictionary.cambridge.org/dictionary/english/noun",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-singular": {
    "title": "剑桥词典 · singular",
    "url": "https://dictionary.cambridge.org/dictionary/english/singular",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pronoun": {
    "title": "剑桥词典 · pronoun",
    "url": "https://dictionary.cambridge.org/dictionary/english/pronoun",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-verb": {
    "title": "剑桥词典 · verb",
    "url": "https://dictionary.cambridge.org/dictionary/english/verb",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-adjective": {
    "title": "剑桥词典 · adjective",
    "url": "https://dictionary.cambridge.org/dictionary/english/adjective",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-adverb": {
    "title": "剑桥词典 · adverb",
    "url": "https://dictionary.cambridge.org/dictionary/english/adverb",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-preposition": {
    "title": "剑桥词典 · preposition",
    "url": "https://dictionary.cambridge.org/dictionary/english/preposition",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-complicated": {
    "title": "剑桥词典 · complicated",
    "url": "https://dictionary.cambridge.org/dictionary/english/complicated",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-eloquence": {
    "title": "剑桥词典 · eloquence",
    "url": "https://dictionary.cambridge.org/dictionary/english/eloquence",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-communicate": {
    "title": "剑桥词典 · communicate",
    "url": "https://dictionary.cambridge.org/dictionary/english/communicate",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-discussion": {
    "title": "剑桥词典 · discussion",
    "url": "https://dictionary.cambridge.org/dictionary/english/discussion",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-brainstorm": {
    "title": "剑桥词典 · brainstorm",
    "url": "https://dictionary.cambridge.org/dictionary/english/brainstorm",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-debate about": {
    "title": "剑桥词典 · debate about",
    "url": "https://dictionary.cambridge.org/dictionary/english/debate%20about",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-negotiate": {
    "title": "剑桥词典 · negotiate",
    "url": "https://dictionary.cambridge.org/dictionary/english/negotiate",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-negotiation": {
    "title": "剑桥词典 · negotiation",
    "url": "https://dictionary.cambridge.org/dictionary/english/negotiation",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-press": {
    "title": "剑桥词典 · press",
    "url": "https://dictionary.cambridge.org/dictionary/english/press",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-journalist": {
    "title": "剑桥词典 · journalist",
    "url": "https://dictionary.cambridge.org/dictionary/english/journalist",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-commentator": {
    "title": "剑桥词典 · commentator",
    "url": "https://dictionary.cambridge.org/dictionary/english/commentator",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-exponent": {
    "title": "剑桥词典 · exponent",
    "url": "https://dictionary.cambridge.org/dictionary/english/exponent",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-announcer": {
    "title": "剑桥词典 · announcer",
    "url": "https://dictionary.cambridge.org/dictionary/english/announcer",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-correspondent": {
    "title": "剑桥词典 · correspondent",
    "url": "https://dictionary.cambridge.org/dictionary/english/correspondent",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-messenger": {
    "title": "剑桥词典 · messenger",
    "url": "https://dictionary.cambridge.org/dictionary/english/messenger",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-editor": {
    "title": "剑桥词典 · editor",
    "url": "https://dictionary.cambridge.org/dictionary/english/editor",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-typist": {
    "title": "剑桥词典 · typist",
    "url": "https://dictionary.cambridge.org/dictionary/english/typist",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-propaganda": {
    "title": "剑桥词典 · propaganda",
    "url": "https://dictionary.cambridge.org/dictionary/english/propaganda",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-publish": {
    "title": "剑桥词典 · publish",
    "url": "https://dictionary.cambridge.org/dictionary/english/publish",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-disseminate": {
    "title": "剑桥词典 · disseminate",
    "url": "https://dictionary.cambridge.org/dictionary/english/disseminate",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-expect": {
    "title": "剑桥词典 · expect",
    "url": "https://dictionary.cambridge.org/dictionary/english/expect",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pastime": {
    "title": "剑桥词典 · pastime",
    "url": "https://dictionary.cambridge.org/dictionary/english/pastime",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-entertain": {
    "title": "剑桥词典 · entertain",
    "url": "https://dictionary.cambridge.org/dictionary/english/entertain",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-recreation": {
    "title": "剑桥词典 · recreation",
    "url": "https://dictionary.cambridge.org/dictionary/english/recreation",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-gossip": {
    "title": "剑桥词典 · gossip",
    "url": "https://dictionary.cambridge.org/dictionary/english/gossip",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-rumour": {
    "title": "剑桥词典 · rumour",
    "url": "https://dictionary.cambridge.org/dictionary/english/rumour",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-feast": {
    "title": "剑桥词典 · feast",
    "url": "https://dictionary.cambridge.org/dictionary/english/feast",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-programme": {
    "title": "剑桥词典 · programme",
    "url": "https://dictionary.cambridge.org/dictionary/english/programme",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-programmer": {
    "title": "剑桥词典 · programmer",
    "url": "https://dictionary.cambridge.org/dictionary/english/programmer",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-simulate": {
    "title": "剑桥词典 · simulate",
    "url": "https://dictionary.cambridge.org/dictionary/english/simulate",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-simulative": {
    "title": "Merriam-Webster · simulative",
    "url": "https://www.merriam-webster.com/dictionary/simulative",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-circus": {
    "title": "剑桥词典 · circus",
    "url": "https://dictionary.cambridge.org/dictionary/english/circus",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-concert": {
    "title": "剑桥词典 · concert",
    "url": "https://dictionary.cambridge.org/dictionary/english/concert",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-musicale": {
    "title": "Merriam-Webster · musicale",
    "url": "https://www.merriam-webster.com/dictionary/musicale",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-concertmaster": {
    "title": "剑桥词典 · concertmaster",
    "url": "https://dictionary.cambridge.org/dictionary/english/concertmaster",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-opera": {
    "title": "剑桥词典 · opera",
    "url": "https://dictionary.cambridge.org/dictionary/english/opera",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tragedy": {
    "title": "剑桥词典 · tragedy",
    "url": "https://dictionary.cambridge.org/dictionary/english/tragedy",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-animation": {
    "title": "剑桥词典 · animation",
    "url": "https://dictionary.cambridge.org/dictionary/english/animation",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-x-rated": {
    "title": "剑桥词典 · x-rated",
    "url": "https://dictionary.cambridge.org/dictionary/english/x-rated",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-artistic": {
    "title": "剑桥词典 · artistic",
    "url": "https://dictionary.cambridge.org/dictionary/english/artistic",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-craftsman": {
    "title": "剑桥词典 · craftsman",
    "url": "https://dictionary.cambridge.org/dictionary/english/craftsman",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-role": {
    "title": "剑桥词典 · role",
    "url": "https://dictionary.cambridge.org/dictionary/english/role",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-scene": {
    "title": "剑桥词典 · scene",
    "url": "https://dictionary.cambridge.org/dictionary/english/scene",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-stage": {
    "title": "剑桥词典 · stage",
    "url": "https://dictionary.cambridge.org/dictionary/english/stage",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-gallery": {
    "title": "剑桥词典 · gallery",
    "url": "https://dictionary.cambridge.org/dictionary/english/gallery",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-exhibition": {
    "title": "剑桥词典 · exhibition",
    "url": "https://dictionary.cambridge.org/dictionary/english/exhibition",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-opt": {
    "title": "剑桥词典 · opt",
    "url": "https://dictionary.cambridge.org/dictionary/english/opt",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-photography": {
    "title": "剑桥词典 · photography",
    "url": "https://dictionary.cambridge.org/dictionary/english/photography",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-draw": {
    "title": "剑桥词典 · draw",
    "url": "https://dictionary.cambridge.org/dictionary/english/draw",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-describe": {
    "title": "剑桥词典 · describe",
    "url": "https://dictionary.cambridge.org/dictionary/english/describe",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-musical": {
    "title": "剑桥词典 · musical",
    "url": "https://dictionary.cambridge.org/dictionary/english/musical",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-solo": {
    "title": "剑桥词典 · solo",
    "url": "https://dictionary.cambridge.org/dictionary/english/solo",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tune": {
    "title": "剑桥词典 · tune",
    "url": "https://dictionary.cambridge.org/dictionary/english/tune",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-disc": {
    "title": "剑桥词典 · disc",
    "url": "https://dictionary.cambridge.org/dictionary/english/disc",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-violin": {
    "title": "剑桥词典 · violin",
    "url": "https://dictionary.cambridge.org/dictionary/english/violin",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-harmonica": {
    "title": "剑桥词典 · harmonica",
    "url": "https://dictionary.cambridge.org/dictionary/english/harmonica",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-trumpet": {
    "title": "剑桥词典 · trumpet",
    "url": "https://dictionary.cambridge.org/dictionary/english/trumpet",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-flute": {
    "title": "剑桥词典 · flute",
    "url": "https://dictionary.cambridge.org/dictionary/english/flute",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-competition": {
    "title": "剑桥词典 · competition",
    "url": "https://dictionary.cambridge.org/dictionary/english/competition",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-compete": {
    "title": "剑桥词典 · compete",
    "url": "https://dictionary.cambridge.org/dictionary/english/compete",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sponsorship": {
    "title": "剑桥词典 · sponsorship",
    "url": "https://dictionary.cambridge.org/dictionary/english/sponsorship",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-spectator": {
    "title": "剑桥词典 · spectator",
    "url": "https://dictionary.cambridge.org/dictionary/english/spectator",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-volunteer": {
    "title": "剑桥词典 · volunteer",
    "url": "https://dictionary.cambridge.org/dictionary/english/volunteer",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-well-known": {
    "title": "剑桥词典 · well-known",
    "url": "https://dictionary.cambridge.org/dictionary/english/well-known",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-stadium": {
    "title": "剑桥词典 · stadium",
    "url": "https://dictionary.cambridge.org/dictionary/english/stadium",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-exercise": {
    "title": "剑桥词典 · exercise",
    "url": "https://dictionary.cambridge.org/dictionary/english/exercise",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-indoor": {
    "title": "剑桥词典 · indoor",
    "url": "https://dictionary.cambridge.org/dictionary/english/indoor",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-outdoor": {
    "title": "剑桥词典 · outdoor",
    "url": "https://dictionary.cambridge.org/dictionary/english/outdoor",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-movement": {
    "title": "剑桥词典 · movement",
    "url": "https://dictionary.cambridge.org/dictionary/english/movement",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sprawl": {
    "title": "剑桥词典 · sprawl",
    "url": "https://dictionary.cambridge.org/dictionary/english/sprawl",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-badminton": {
    "title": "剑桥词典 · badminton",
    "url": "https://dictionary.cambridge.org/dictionary/english/badminton",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-billiards": {
    "title": "剑桥词典 · billiards",
    "url": "https://dictionary.cambridge.org/dictionary/english/billiards",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-soccer": {
    "title": "剑桥词典 · soccer",
    "url": "https://dictionary.cambridge.org/dictionary/english/soccer",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tennis": {
    "title": "剑桥词典 · tennis",
    "url": "https://dictionary.cambridge.org/dictionary/english/tennis",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-volleyball": {
    "title": "剑桥词典 · volleyball",
    "url": "https://dictionary.cambridge.org/dictionary/english/volleyball",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-hockey": {
    "title": "剑桥词典 · hockey",
    "url": "https://dictionary.cambridge.org/dictionary/english/hockey",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-kick": {
    "title": "剑桥词典 · kick",
    "url": "https://dictionary.cambridge.org/dictionary/english/kick",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-knock": {
    "title": "剑桥词典 · knock",
    "url": "https://dictionary.cambridge.org/dictionary/english/knock",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-flip": {
    "title": "剑桥词典 · flip",
    "url": "https://dictionary.cambridge.org/dictionary/english/flip",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-throw": {
    "title": "剑桥词典 · throw",
    "url": "https://dictionary.cambridge.org/dictionary/english/throw",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-toss": {
    "title": "剑桥词典 · toss",
    "url": "https://dictionary.cambridge.org/dictionary/english/toss",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-glide": {
    "title": "剑桥词典 · glide",
    "url": "https://dictionary.cambridge.org/dictionary/english/glide",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tumble": {
    "title": "剑桥词典 · tumble",
    "url": "https://dictionary.cambridge.org/dictionary/english/tumble",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-ski": {
    "title": "剑桥词典 · ski",
    "url": "https://dictionary.cambridge.org/dictionary/english/ski",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-skate": {
    "title": "剑桥词典 · skate",
    "url": "https://dictionary.cambridge.org/dictionary/english/skate",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cycling": {
    "title": "剑桥词典 · cycling",
    "url": "https://dictionary.cambridge.org/dictionary/english/cycling",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cyclist": {
    "title": "剑桥词典 · cyclist",
    "url": "https://dictionary.cambridge.org/dictionary/english/cyclist",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-bicycle": {
    "title": "剑桥词典 · bicycle",
    "url": "https://dictionary.cambridge.org/dictionary/english/bicycle",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-jump": {
    "title": "剑桥词典 · jump",
    "url": "https://dictionary.cambridge.org/dictionary/english/jump",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-plunge": {
    "title": "剑桥词典 · plunge",
    "url": "https://dictionary.cambridge.org/dictionary/english/plunge",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-plunge whole-heartedly": {
    "title": "Merriam-Webster · plunge",
    "url": "https://www.merriam-webster.com/dictionary/plunge",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-plunge whole-heartedly-2": {
    "title": "Merriam-Webster · wholeheartedly",
    "url": "https://www.merriam-webster.com/dictionary/wholeheartedly",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-plunge whole-heartedly-3": {
    "title": "Merriam-Webster · wholehearted",
    "url": "https://www.merriam-webster.com/dictionary/wholehearted",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tent": {
    "title": "剑桥词典 · tent",
    "url": "https://dictionary.cambridge.org/dictionary/english/tent",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-picnic": {
    "title": "剑桥词典 · picnic",
    "url": "https://dictionary.cambridge.org/dictionary/english/picnic",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-hunt": {
    "title": "剑桥词典 · hunt",
    "url": "https://dictionary.cambridge.org/dictionary/english/hunt",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-race": {
    "title": "剑桥词典 · race",
    "url": "https://dictionary.cambridge.org/dictionary/english/race",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-marathon": {
    "title": "剑桥词典 · marathon",
    "url": "https://dictionary.cambridge.org/dictionary/english/marathon",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pace": {
    "title": "剑桥词典 · pace",
    "url": "https://dictionary.cambridge.org/dictionary/english/pace",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-step": {
    "title": "剑桥词典 · step",
    "url": "https://dictionary.cambridge.org/dictionary/english/step",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-footstep": {
    "title": "剑桥词典 · footstep",
    "url": "https://dictionary.cambridge.org/dictionary/english/footstep",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cruise": {
    "title": "剑桥词典 · cruise",
    "url": "https://dictionary.cambridge.org/dictionary/english/cruise",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-vocation": {
    "title": "剑桥词典 · vocation",
    "url": "https://dictionary.cambridge.org/dictionary/english/vocation",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-hike": {
    "title": "剑桥词典 · hike",
    "url": "https://dictionary.cambridge.org/dictionary/english/hike",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-jog": {
    "title": "剑桥词典 · jog",
    "url": "https://dictionary.cambridge.org/dictionary/english/jog",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-jogger": {
    "title": "剑桥词典 · jogger",
    "url": "https://dictionary.cambridge.org/dictionary/english/jogger",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-stride": {
    "title": "剑桥词典 · stride",
    "url": "https://dictionary.cambridge.org/dictionary/english/stride",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pull": {
    "title": "剑桥词典 · pull",
    "url": "https://dictionary.cambridge.org/dictionary/english/pull",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-be": {
    "title": "剑桥词典 · be",
    "url": "https://dictionary.cambridge.org/dictionary/english/be",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-take a bow": {
    "title": "剑桥词典 · take a bow",
    "url": "https://dictionary.cambridge.org/dictionary/english/take%20a%20bow",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-stuff": {
    "title": "剑桥词典 · stuff",
    "url": "https://dictionary.cambridge.org/dictionary/english/stuff",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-item": {
    "title": "剑桥词典 · item",
    "url": "https://dictionary.cambridge.org/dictionary/english/item",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-souvenir": {
    "title": "剑桥词典 · souvenir",
    "url": "https://dictionary.cambridge.org/dictionary/english/souvenir",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-artefact": {
    "title": "剑桥词典 · artefact",
    "url": "https://dictionary.cambridge.org/dictionary/english/artefact",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-material": {
    "title": "剑桥词典 · material",
    "url": "https://dictionary.cambridge.org/dictionary/english/material",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-raw": {
    "title": "剑桥词典 · raw",
    "url": "https://dictionary.cambridge.org/dictionary/english/raw",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-raw material": {
    "title": "剑桥词典 · raw material",
    "url": "https://dictionary.cambridge.org/dictionary/english/raw%20material",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-necessary": {
    "title": "剑桥词典 · necessary",
    "url": "https://dictionary.cambridge.org/dictionary/english/necessary",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-outfit": {
    "title": "剑桥词典 · outfit",
    "url": "https://dictionary.cambridge.org/dictionary/english/outfit",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-kit": {
    "title": "剑桥词典 · kit",
    "url": "https://dictionary.cambridge.org/dictionary/english/kit",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-garbage": {
    "title": "剑桥词典 · garbage",
    "url": "https://dictionary.cambridge.org/dictionary/english/garbage",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-rubbish": {
    "title": "剑桥词典 · rubbish",
    "url": "https://dictionary.cambridge.org/dictionary/english/rubbish",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-trash": {
    "title": "剑桥词典 · trash",
    "url": "https://dictionary.cambridge.org/dictionary/english/trash",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-reuse": {
    "title": "剑桥词典 · reuse",
    "url": "https://dictionary.cambridge.org/dictionary/english/reuse",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-litter": {
    "title": "剑桥词典 · litter",
    "url": "https://dictionary.cambridge.org/dictionary/english/litter",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-waste": {
    "title": "剑桥词典 · waste",
    "url": "https://dictionary.cambridge.org/dictionary/english/waste",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-junk": {
    "title": "剑桥词典 · junk",
    "url": "https://dictionary.cambridge.org/dictionary/english/junk",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sewerage": {
    "title": "Merriam-Webster · sewerage",
    "url": "https://www.merriam-webster.com/dictionary/sewerage",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-detergent": {
    "title": "剑桥词典 · detergent",
    "url": "https://dictionary.cambridge.org/dictionary/english/detergent",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lotion": {
    "title": "剑桥词典 · lotion",
    "url": "https://dictionary.cambridge.org/dictionary/english/lotion",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-shampoo": {
    "title": "剑桥词典 · shampoo",
    "url": "https://dictionary.cambridge.org/dictionary/english/shampoo",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-soap": {
    "title": "剑桥词典 · soap",
    "url": "https://dictionary.cambridge.org/dictionary/english/soap",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tub": {
    "title": "剑桥词典 · tub",
    "url": "https://dictionary.cambridge.org/dictionary/english/tub",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pipe": {
    "title": "剑桥词典 · pipe",
    "url": "https://dictionary.cambridge.org/dictionary/english/pipe",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pipeline": {
    "title": "剑桥词典 · pipeline",
    "url": "https://dictionary.cambridge.org/dictionary/english/pipeline",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tube": {
    "title": "剑桥词典 · tube",
    "url": "https://dictionary.cambridge.org/dictionary/english/tube",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-mop": {
    "title": "剑桥词典 · mop",
    "url": "https://dictionary.cambridge.org/dictionary/english/mop",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-mattress": {
    "title": "剑桥词典 · mattress",
    "url": "https://dictionary.cambridge.org/dictionary/english/mattress",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-rug": {
    "title": "剑桥词典 · rug",
    "url": "https://dictionary.cambridge.org/dictionary/english/rug",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-mat": {
    "title": "剑桥词典 · mat",
    "url": "https://dictionary.cambridge.org/dictionary/english/mat",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pad": {
    "title": "剑桥词典 · pad",
    "url": "https://dictionary.cambridge.org/dictionary/english/pad",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sheet": {
    "title": "剑桥词典 · sheet",
    "url": "https://dictionary.cambridge.org/dictionary/english/sheet",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pillow": {
    "title": "剑桥词典 · pillow",
    "url": "https://dictionary.cambridge.org/dictionary/english/pillow",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-towel": {
    "title": "剑桥词典 · towel",
    "url": "https://dictionary.cambridge.org/dictionary/english/towel",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-nail": {
    "title": "剑桥词典 · nail",
    "url": "https://dictionary.cambridge.org/dictionary/english/nail",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-razor": {
    "title": "剑桥词典 · razor",
    "url": "https://dictionary.cambridge.org/dictionary/english/razor",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-shave": {
    "title": "剑桥词典 · shave",
    "url": "https://dictionary.cambridge.org/dictionary/english/shave",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-match": {
    "title": "剑桥词典 · match",
    "url": "https://dictionary.cambridge.org/dictionary/english/match",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-wax": {
    "title": "剑桥词典 · wax",
    "url": "https://dictionary.cambridge.org/dictionary/english/wax",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-portfolio": {
    "title": "剑桥词典 · portfolio",
    "url": "https://dictionary.cambridge.org/dictionary/english/portfolio",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-paperback": {
    "title": "剑桥词典 · paperback",
    "url": "https://dictionary.cambridge.org/dictionary/english/paperback",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pamphlet": {
    "title": "剑桥词典 · pamphlet",
    "url": "https://dictionary.cambridge.org/dictionary/english/pamphlet",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-booklet": {
    "title": "剑桥词典 · booklet",
    "url": "https://dictionary.cambridge.org/dictionary/english/booklet",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cover": {
    "title": "剑桥词典 · cover",
    "url": "https://dictionary.cambridge.org/dictionary/english/cover",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-xerox": {
    "title": "剑桥词典 · xerox",
    "url": "https://dictionary.cambridge.org/dictionary/english/xerox",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-memorandum": {
    "title": "剑桥词典 · memorandum",
    "url": "https://dictionary.cambridge.org/dictionary/english/memorandum",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-stationery": {
    "title": "剑桥词典 · stationery",
    "url": "https://dictionary.cambridge.org/dictionary/english/stationery",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-stationer": {
    "title": "剑桥词典 · stationer",
    "url": "https://dictionary.cambridge.org/dictionary/english/stationer",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-glue": {
    "title": "剑桥词典 · glue",
    "url": "https://dictionary.cambridge.org/dictionary/english/glue",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-rubber": {
    "title": "剑桥词典 · rubber",
    "url": "https://dictionary.cambridge.org/dictionary/english/rubber",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-scissors": {
    "title": "剑桥词典 · scissors",
    "url": "https://dictionary.cambridge.org/dictionary/english/scissors",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-shear": {
    "title": "剑桥词典 · shear",
    "url": "https://dictionary.cambridge.org/dictionary/english/shear",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-edge": {
    "title": "剑桥词典 · edge",
    "url": "https://dictionary.cambridge.org/dictionary/english/edge",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-rim": {
    "title": "剑桥词典 · rim",
    "url": "https://dictionary.cambridge.org/dictionary/english/rim",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-element": {
    "title": "剑桥词典 · element",
    "url": "https://dictionary.cambridge.org/dictionary/english/element",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-badge": {
    "title": "剑桥词典 · badge",
    "url": "https://dictionary.cambridge.org/dictionary/english/badge",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-knob": {
    "title": "剑桥词典 · knob",
    "url": "https://dictionary.cambridge.org/dictionary/english/knob",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-shutter": {
    "title": "剑桥词典 · shutter",
    "url": "https://dictionary.cambridge.org/dictionary/english/shutter",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pane": {
    "title": "剑桥词典 · pane",
    "url": "https://dictionary.cambridge.org/dictionary/english/pane",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-opacity": {
    "title": "剑桥词典 · opacity",
    "url": "https://dictionary.cambridge.org/dictionary/english/opacity",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pail": {
    "title": "剑桥词典 · pail",
    "url": "https://dictionary.cambridge.org/dictionary/english/pail",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lantern": {
    "title": "剑桥词典 · lantern",
    "url": "https://dictionary.cambridge.org/dictionary/english/lantern",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-flashlight": {
    "title": "剑桥词典 · flashlight",
    "url": "https://dictionary.cambridge.org/dictionary/english/flashlight",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-refrigerator": {
    "title": "剑桥词典 · refrigerator",
    "url": "https://dictionary.cambridge.org/dictionary/english/refrigerator",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-refrigeration": {
    "title": "剑桥词典 · refrigeration",
    "url": "https://dictionary.cambridge.org/dictionary/english/refrigeration",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-fridge": {
    "title": "剑桥词典 · fridge",
    "url": "https://dictionary.cambridge.org/dictionary/english/fridge",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-fan": {
    "title": "剑桥词典 · fan",
    "url": "https://dictionary.cambridge.org/dictionary/english/fan",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-hurdle": {
    "title": "剑桥词典 · hurdle",
    "url": "https://dictionary.cambridge.org/dictionary/english/hurdle",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-fence": {
    "title": "剑桥词典 · fence",
    "url": "https://dictionary.cambridge.org/dictionary/english/fence",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pedal": {
    "title": "剑桥词典 · pedal",
    "url": "https://dictionary.cambridge.org/dictionary/english/pedal",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-shelf": {
    "title": "剑桥词典 · shelf",
    "url": "https://dictionary.cambridge.org/dictionary/english/shelf",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-ladder": {
    "title": "剑桥词典 · ladder",
    "url": "https://dictionary.cambridge.org/dictionary/english/ladder",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lift": {
    "title": "剑桥词典 · lift",
    "url": "https://dictionary.cambridge.org/dictionary/english/lift",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-drawer": {
    "title": "剑桥词典 · drawer",
    "url": "https://dictionary.cambridge.org/dictionary/english/drawer",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-raincoat": {
    "title": "剑桥词典 · raincoat",
    "url": "https://dictionary.cambridge.org/dictionary/english/raincoat",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-can": {
    "title": "剑桥词典 · can",
    "url": "https://dictionary.cambridge.org/dictionary/english/can",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-metal": {
    "title": "剑桥词典 · metal",
    "url": "https://dictionary.cambridge.org/dictionary/english/metal",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-iron": {
    "title": "剑桥词典 · iron",
    "url": "https://dictionary.cambridge.org/dictionary/english/iron",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lead": {
    "title": "剑桥词典 · lead",
    "url": "https://dictionary.cambridge.org/dictionary/english/lead",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-brass": {
    "title": "剑桥词典 · brass",
    "url": "https://dictionary.cambridge.org/dictionary/english/brass",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cementer": {
    "title": "Merriam-Webster · cementer",
    "url": "https://www.merriam-webster.com/dictionary/cementer",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lime": {
    "title": "剑桥词典 · lime",
    "url": "https://dictionary.cambridge.org/dictionary/english/lime",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-plaster": {
    "title": "剑桥词典 · plaster",
    "url": "https://dictionary.cambridge.org/dictionary/english/plaster",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-leather": {
    "title": "剑桥词典 · leather",
    "url": "https://dictionary.cambridge.org/dictionary/english/leather",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-plastic": {
    "title": "剑桥词典 · plastic",
    "url": "https://dictionary.cambridge.org/dictionary/english/plastic",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-fibre": {
    "title": "剑桥词典 · fibre",
    "url": "https://dictionary.cambridge.org/dictionary/english/fibre",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-fabric": {
    "title": "剑桥词典 · fabric",
    "url": "https://dictionary.cambridge.org/dictionary/english/fabric",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cotton": {
    "title": "剑桥词典 · cotton",
    "url": "https://dictionary.cambridge.org/dictionary/english/cotton",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-nylon": {
    "title": "剑桥词典 · nylon",
    "url": "https://dictionary.cambridge.org/dictionary/english/nylon",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-wooden": {
    "title": "剑桥词典 · wooden",
    "url": "https://dictionary.cambridge.org/dictionary/english/wooden",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-mine": {
    "title": "剑桥词典 · mine",
    "url": "https://dictionary.cambridge.org/dictionary/english/mine",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lubricate": {
    "title": "剑桥词典 · lubricate",
    "url": "https://dictionary.cambridge.org/dictionary/english/lubricate",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-diamond": {
    "title": "剑桥词典 · diamond",
    "url": "https://dictionary.cambridge.org/dictionary/english/diamond",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-crystal": {
    "title": "剑桥词典 · crystal",
    "url": "https://dictionary.cambridge.org/dictionary/english/crystal",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-counterfeit": {
    "title": "剑桥词典 · counterfeit",
    "url": "https://dictionary.cambridge.org/dictionary/english/counterfeit",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-style": {
    "title": "剑桥词典 · style",
    "url": "https://dictionary.cambridge.org/dictionary/english/style",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-stylish": {
    "title": "剑桥词典 · stylish",
    "url": "https://dictionary.cambridge.org/dictionary/english/stylish",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tendency": {
    "title": "剑桥词典 · tendency",
    "url": "https://dictionary.cambridge.org/dictionary/english/tendency",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-popularity": {
    "title": "剑桥词典 · popularity",
    "url": "https://dictionary.cambridge.org/dictionary/english/popularity",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-vogue": {
    "title": "剑桥词典 · vogue",
    "url": "https://dictionary.cambridge.org/dictionary/english/vogue",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-prevalence": {
    "title": "剑桥词典 · prevalence",
    "url": "https://dictionary.cambridge.org/dictionary/english/prevalence",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-prevailing": {
    "title": "剑桥词典 · prevailing",
    "url": "https://dictionary.cambridge.org/dictionary/english/prevailing",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-model": {
    "title": "剑桥词典 · model",
    "url": "https://dictionary.cambridge.org/dictionary/english/model",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-icon": {
    "title": "剑桥词典 · icon",
    "url": "https://dictionary.cambridge.org/dictionary/english/icon",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-idol": {
    "title": "剑桥词典 · idol",
    "url": "https://dictionary.cambridge.org/dictionary/english/idol",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-jewellery": {
    "title": "剑桥词典 · jewellery",
    "url": "https://dictionary.cambridge.org/dictionary/english/jewellery",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-jewel": {
    "title": "剑桥词典 · jewel",
    "url": "https://dictionary.cambridge.org/dictionary/english/jewel",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-jade": {
    "title": "剑桥词典 · jade",
    "url": "https://dictionary.cambridge.org/dictionary/english/jade",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-embroider": {
    "title": "剑桥词典 · embroider",
    "url": "https://dictionary.cambridge.org/dictionary/english/embroider",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-hairdressing": {
    "title": "剑桥词典 · hairdressing",
    "url": "https://dictionary.cambridge.org/dictionary/english/hairdressing",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-masquerade": {
    "title": "剑桥词典 · masquerade",
    "url": "https://dictionary.cambridge.org/dictionary/english/masquerade",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-veil": {
    "title": "剑桥词典 · veil",
    "url": "https://dictionary.cambridge.org/dictionary/english/veil",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-costume": {
    "title": "剑桥词典 · costume",
    "url": "https://dictionary.cambridge.org/dictionary/english/costume",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cosplay": {
    "title": "剑桥词典 · cosplay",
    "url": "https://dictionary.cambridge.org/dictionary/english/cosplay",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-decent": {
    "title": "剑桥词典 · decent",
    "url": "https://dictionary.cambridge.org/dictionary/english/decent",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-indecent": {
    "title": "剑桥词典 · indecent",
    "url": "https://dictionary.cambridge.org/dictionary/english/indecent",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-exquisite": {
    "title": "剑桥词典 · exquisite",
    "url": "https://dictionary.cambridge.org/dictionary/english/exquisite",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-grace": {
    "title": "剑桥词典 · grace",
    "url": "https://dictionary.cambridge.org/dictionary/english/grace",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-elegance": {
    "title": "剑桥词典 · elegance",
    "url": "https://dictionary.cambridge.org/dictionary/english/elegance",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-elegant": {
    "title": "剑桥词典 · elegant",
    "url": "https://dictionary.cambridge.org/dictionary/english/elegant",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-appearance": {
    "title": "剑桥词典 · appearance",
    "url": "https://dictionary.cambridge.org/dictionary/english/appearance",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cosmetics": {
    "title": "剑桥词典 · cosmetics",
    "url": "https://dictionary.cambridge.org/dictionary/english/cosmetics",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-charming": {
    "title": "剑桥词典 · charming",
    "url": "https://dictionary.cambridge.org/dictionary/english/charming",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-handsome": {
    "title": "剑桥词典 · handsome",
    "url": "https://dictionary.cambridge.org/dictionary/english/handsome",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-clothing": {
    "title": "剑桥词典 · clothing",
    "url": "https://dictionary.cambridge.org/dictionary/english/clothing",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-uniform": {
    "title": "剑桥词典 · uniform",
    "url": "https://dictionary.cambridge.org/dictionary/english/uniform",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-laundry": {
    "title": "剑桥词典 · laundry",
    "url": "https://dictionary.cambridge.org/dictionary/english/laundry",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-wardrobe": {
    "title": "剑桥词典 · wardrobe",
    "url": "https://dictionary.cambridge.org/dictionary/english/wardrobe",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-overcoat": {
    "title": "剑桥词典 · overcoat",
    "url": "https://dictionary.cambridge.org/dictionary/english/overcoat",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-robe": {
    "title": "剑桥词典 · robe",
    "url": "https://dictionary.cambridge.org/dictionary/english/robe",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-gown": {
    "title": "剑桥词典 · gown",
    "url": "https://dictionary.cambridge.org/dictionary/english/gown",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sweater": {
    "title": "剑桥词典 · sweater",
    "url": "https://dictionary.cambridge.org/dictionary/english/sweater",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-jacket": {
    "title": "剑桥词典 · jacket",
    "url": "https://dictionary.cambridge.org/dictionary/english/jacket",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-jeans": {
    "title": "剑桥词典 · jeans",
    "url": "https://dictionary.cambridge.org/dictionary/english/jeans",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-trousers": {
    "title": "剑桥词典 · trousers",
    "url": "https://dictionary.cambridge.org/dictionary/english/trousers",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-clasp": {
    "title": "剑桥词典 · clasp",
    "url": "https://dictionary.cambridge.org/dictionary/english/clasp",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-unbutton": {
    "title": "剑桥词典 · unbutton",
    "url": "https://dictionary.cambridge.org/dictionary/english/unbutton",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-glove": {
    "title": "剑桥词典 · glove",
    "url": "https://dictionary.cambridge.org/dictionary/english/glove",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-brim": {
    "title": "剑桥词典 · brim",
    "url": "https://dictionary.cambridge.org/dictionary/english/brim",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-scarf": {
    "title": "剑桥词典 · scarf",
    "url": "https://dictionary.cambridge.org/dictionary/english/scarf",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-handkerchief": {
    "title": "剑桥词典 · handkerchief",
    "url": "https://dictionary.cambridge.org/dictionary/english/handkerchief",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-purse": {
    "title": "剑桥词典 · purse",
    "url": "https://dictionary.cambridge.org/dictionary/english/purse",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-wallet": {
    "title": "剑桥词典 · wallet",
    "url": "https://dictionary.cambridge.org/dictionary/english/wallet",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-vest": {
    "title": "剑桥词典 · vest",
    "url": "https://dictionary.cambridge.org/dictionary/english/vest",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sleeve": {
    "title": "剑桥词典 · sleeve",
    "url": "https://dictionary.cambridge.org/dictionary/english/sleeve",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sock": {
    "title": "剑桥词典 · sock",
    "url": "https://dictionary.cambridge.org/dictionary/english/sock",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-stocking": {
    "title": "剑桥词典 · stocking",
    "url": "https://dictionary.cambridge.org/dictionary/english/stocking",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-slipper": {
    "title": "剑桥词典 · slipper",
    "url": "https://dictionary.cambridge.org/dictionary/english/slipper",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lace": {
    "title": "剑桥词典 · lace",
    "url": "https://dictionary.cambridge.org/dictionary/english/lace",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tailor": {
    "title": "剑桥词典 · tailor",
    "url": "https://dictionary.cambridge.org/dictionary/english/tailor",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sew": {
    "title": "剑桥词典 · sew",
    "url": "https://dictionary.cambridge.org/dictionary/english/sew",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-stitch": {
    "title": "剑桥词典 · stitch",
    "url": "https://dictionary.cambridge.org/dictionary/english/stitch",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-needle": {
    "title": "剑桥词典 · needle",
    "url": "https://dictionary.cambridge.org/dictionary/english/needle",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pin": {
    "title": "剑桥词典 · pin",
    "url": "https://dictionary.cambridge.org/dictionary/english/pin",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-strap": {
    "title": "剑桥词典 · strap",
    "url": "https://dictionary.cambridge.org/dictionary/english/strap",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-stripe": {
    "title": "剑桥词典 · stripe",
    "url": "https://dictionary.cambridge.org/dictionary/english/stripe",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-bracelet": {
    "title": "剑桥词典 · bracelet",
    "url": "https://dictionary.cambridge.org/dictionary/english/bracelet",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-woollen": {
    "title": "剑桥词典 · woollen",
    "url": "https://dictionary.cambridge.org/dictionary/english/woollen",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-patchwork": {
    "title": "剑桥词典 · patchwork",
    "url": "https://dictionary.cambridge.org/dictionary/english/patchwork",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-shabby": {
    "title": "剑桥词典 · shabby",
    "url": "https://dictionary.cambridge.org/dictionary/english/shabby",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tight": {
    "title": "剑桥词典 · tight",
    "url": "https://dictionary.cambridge.org/dictionary/english/tight",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-whitewash": {
    "title": "剑桥词典 · whitewash",
    "url": "https://dictionary.cambridge.org/dictionary/english/whitewash",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-brown": {
    "title": "剑桥词典 · brown",
    "url": "https://dictionary.cambridge.org/dictionary/english/brown",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-purple": {
    "title": "剑桥词典 · purple",
    "url": "https://dictionary.cambridge.org/dictionary/english/purple",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-blot": {
    "title": "剑桥词典 · blot",
    "url": "https://dictionary.cambridge.org/dictionary/english/blot",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-figure": {
    "title": "剑桥词典 · figure",
    "url": "https://dictionary.cambridge.org/dictionary/english/figure",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-curvy": {
    "title": "剑桥词典 · curvy",
    "url": "https://dictionary.cambridge.org/dictionary/english/curvy",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-hourglass": {
    "title": "剑桥词典 · hourglass",
    "url": "https://dictionary.cambridge.org/dictionary/english/hourglass",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-slight": {
    "title": "剑桥词典 · slight",
    "url": "https://dictionary.cambridge.org/dictionary/english/slight",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-slim": {
    "title": "剑桥词典 · slim",
    "url": "https://dictionary.cambridge.org/dictionary/english/slim",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-thready": {
    "title": "剑桥词典 · thready",
    "url": "https://dictionary.cambridge.org/dictionary/english/thready",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-stringy": {
    "title": "剑桥词典 · stringy",
    "url": "https://dictionary.cambridge.org/dictionary/english/stringy",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-diet": {
    "title": "剑桥词典 · diet",
    "url": "https://dictionary.cambridge.org/dictionary/english/diet",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-dietary": {
    "title": "剑桥词典 · dietary",
    "url": "https://dictionary.cambridge.org/dictionary/english/dietary",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-treat": {
    "title": "剑桥词典 · treat",
    "url": "https://dictionary.cambridge.org/dictionary/english/treat",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-treatment": {
    "title": "剑桥词典 · treatment",
    "url": "https://dictionary.cambridge.org/dictionary/english/treatment",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cater": {
    "title": "剑桥词典 · cater",
    "url": "https://dictionary.cambridge.org/dictionary/english/cater",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-drinkable": {
    "title": "剑桥词典 · drinkable",
    "url": "https://dictionary.cambridge.org/dictionary/english/drinkable",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-refectory": {
    "title": "剑桥词典 · refectory",
    "url": "https://dictionary.cambridge.org/dictionary/english/refectory",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cafeteria": {
    "title": "剑桥词典 · cafeteria",
    "url": "https://dictionary.cambridge.org/dictionary/english/cafeteria",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-buffet": {
    "title": "剑桥词典 · buffet",
    "url": "https://dictionary.cambridge.org/dictionary/english/buffet",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-barbecue": {
    "title": "剑桥词典 · barbecue",
    "url": "https://dictionary.cambridge.org/dictionary/english/barbecue",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-supper": {
    "title": "剑桥词典 · supper",
    "url": "https://dictionary.cambridge.org/dictionary/english/supper",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-refreshment": {
    "title": "剑桥词典 · refreshment",
    "url": "https://dictionary.cambridge.org/dictionary/english/refreshment",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-snack": {
    "title": "剑桥词典 · snack",
    "url": "https://dictionary.cambridge.org/dictionary/english/snack",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-appetiser": {
    "title": "剑桥词典 · appetiser",
    "url": "https://dictionary.cambridge.org/dictionary/english/appetiser",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cuisine": {
    "title": "剑桥词典 · cuisine",
    "url": "https://dictionary.cambridge.org/dictionary/english/cuisine",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-menu": {
    "title": "剑桥词典 · menu",
    "url": "https://dictionary.cambridge.org/dictionary/english/menu",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-order": {
    "title": "剑桥词典 · order",
    "url": "https://dictionary.cambridge.org/dictionary/english/order",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-takeaway": {
    "title": "剑桥词典 · takeaway",
    "url": "https://dictionary.cambridge.org/dictionary/english/takeaway",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-gourmet": {
    "title": "剑桥词典 · gourmet",
    "url": "https://dictionary.cambridge.org/dictionary/english/gourmet",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-vegetarian": {
    "title": "剑桥词典 · vegetarian",
    "url": "https://dictionary.cambridge.org/dictionary/english/vegetarian",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cutlery": {
    "title": "剑桥词典 · cutlery",
    "url": "https://dictionary.cambridge.org/dictionary/english/cutlery",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-silver": {
    "title": "剑桥词典 · silver",
    "url": "https://dictionary.cambridge.org/dictionary/english/silver",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-saucer": {
    "title": "剑桥词典 · saucer",
    "url": "https://dictionary.cambridge.org/dictionary/english/saucer",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-fork": {
    "title": "剑桥词典 · fork",
    "url": "https://dictionary.cambridge.org/dictionary/english/fork",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-spoon": {
    "title": "剑桥词典 · spoon",
    "url": "https://dictionary.cambridge.org/dictionary/english/spoon",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-spoonful": {
    "title": "剑桥词典 · spoonful",
    "url": "https://dictionary.cambridge.org/dictionary/english/spoonful",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-kettle": {
    "title": "剑桥词典 · kettle",
    "url": "https://dictionary.cambridge.org/dictionary/english/kettle",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pan": {
    "title": "剑桥词典 · pan",
    "url": "https://dictionary.cambridge.org/dictionary/english/pan",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lid": {
    "title": "剑桥词典 · lid",
    "url": "https://dictionary.cambridge.org/dictionary/english/lid",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-alcoholic beverage": {
    "title": "剑桥词典 · alcoholic beverage",
    "url": "https://dictionary.cambridge.org/dictionary/english/alcoholic%20beverage",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-alcoholic": {
    "title": "剑桥词典 · alcoholic",
    "url": "https://dictionary.cambridge.org/dictionary/english/alcoholic",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-liquor": {
    "title": "剑桥词典 · liquor",
    "url": "https://dictionary.cambridge.org/dictionary/english/liquor",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-whisky": {
    "title": "剑桥词典 · whisky",
    "url": "https://dictionary.cambridge.org/dictionary/english/whisky",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-brandy": {
    "title": "剑桥词典 · brandy",
    "url": "https://dictionary.cambridge.org/dictionary/english/brandy",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tobacco": {
    "title": "剑桥词典 · tobacco",
    "url": "https://dictionary.cambridge.org/dictionary/english/tobacco",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cigar": {
    "title": "剑桥词典 · cigar",
    "url": "https://dictionary.cambridge.org/dictionary/english/cigar",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sober": {
    "title": "剑桥词典 · sober",
    "url": "https://dictionary.cambridge.org/dictionary/english/sober",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cucumber": {
    "title": "剑桥词典 · cucumber",
    "url": "https://dictionary.cambridge.org/dictionary/english/cucumber",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-onion": {
    "title": "剑桥词典 · onion",
    "url": "https://dictionary.cambridge.org/dictionary/english/onion",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-mushroom": {
    "title": "剑桥词典 · mushroom",
    "url": "https://dictionary.cambridge.org/dictionary/english/mushroom",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-eggplant": {
    "title": "剑桥词典 · eggplant",
    "url": "https://dictionary.cambridge.org/dictionary/english/eggplant",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-turnip": {
    "title": "剑桥词典 · turnip",
    "url": "https://dictionary.cambridge.org/dictionary/english/turnip",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-radish": {
    "title": "剑桥词典 · radish",
    "url": "https://dictionary.cambridge.org/dictionary/english/radish",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-hull": {
    "title": "剑桥词典 · hull",
    "url": "https://dictionary.cambridge.org/dictionary/english/hull",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cherry": {
    "title": "剑桥词典 · cherry",
    "url": "https://dictionary.cambridge.org/dictionary/english/cherry",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-strawberry": {
    "title": "剑桥词典 · strawberry",
    "url": "https://dictionary.cambridge.org/dictionary/english/strawberry",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-blueberry": {
    "title": "剑桥词典 · blueberry",
    "url": "https://dictionary.cambridge.org/dictionary/english/blueberry",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-grape": {
    "title": "剑桥词典 · grape",
    "url": "https://dictionary.cambridge.org/dictionary/english/grape",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-papaya": {
    "title": "剑桥词典 · papaya",
    "url": "https://dictionary.cambridge.org/dictionary/english/papaya",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-melon": {
    "title": "剑桥词典 · melon",
    "url": "https://dictionary.cambridge.org/dictionary/english/melon",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lemon": {
    "title": "剑桥词典 · lemon",
    "url": "https://dictionary.cambridge.org/dictionary/english/lemon",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lemonade": {
    "title": "剑桥词典 · lemonade",
    "url": "https://dictionary.cambridge.org/dictionary/english/lemonade",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-kiwi": {
    "title": "剑桥词典 · kiwi",
    "url": "https://dictionary.cambridge.org/dictionary/english/kiwi",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-crop": {
    "title": "剑桥词典 · crop",
    "url": "https://dictionary.cambridge.org/dictionary/english/crop",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-corn": {
    "title": "剑桥词典 · corn",
    "url": "https://dictionary.cambridge.org/dictionary/english/corn",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-popcorn": {
    "title": "剑桥词典 · popcorn",
    "url": "https://dictionary.cambridge.org/dictionary/english/popcorn",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-wheat": {
    "title": "剑桥词典 · wheat",
    "url": "https://dictionary.cambridge.org/dictionary/english/wheat",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-flour": {
    "title": "剑桥词典 · flour",
    "url": "https://dictionary.cambridge.org/dictionary/english/flour",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-porridge": {
    "title": "剑桥词典 · porridge",
    "url": "https://dictionary.cambridge.org/dictionary/english/porridge",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-turkey": {
    "title": "剑桥词典 · turkey",
    "url": "https://dictionary.cambridge.org/dictionary/english/turkey",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-beefy": {
    "title": "剑桥词典 · beefy",
    "url": "https://dictionary.cambridge.org/dictionary/english/beefy",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pork": {
    "title": "剑桥词典 · pork",
    "url": "https://dictionary.cambridge.org/dictionary/english/pork",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-mutton": {
    "title": "剑桥词典 · mutton",
    "url": "https://dictionary.cambridge.org/dictionary/english/mutton",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sausage": {
    "title": "剑桥词典 · sausage",
    "url": "https://dictionary.cambridge.org/dictionary/english/sausage",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-an odd fish": {
    "title": "剑桥词典 · an odd fish",
    "url": "https://dictionary.cambridge.org/dictionary/english/an%20odd%20fish",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pond": {
    "title": "剑桥词典 · pond",
    "url": "https://dictionary.cambridge.org/dictionary/english/pond",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-rod": {
    "title": "剑桥词典 · rod",
    "url": "https://dictionary.cambridge.org/dictionary/english/rod",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-dairy": {
    "title": "剑桥词典 · dairy",
    "url": "https://dictionary.cambridge.org/dictionary/english/dairy",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-boiling": {
    "title": "剑桥词典 · boiling",
    "url": "https://dictionary.cambridge.org/dictionary/english/boiling",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-yogurt": {
    "title": "剑桥词典 · yogurt",
    "url": "https://dictionary.cambridge.org/dictionary/english/yogurt",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-creamy": {
    "title": "剑桥词典 · creamy",
    "url": "https://dictionary.cambridge.org/dictionary/english/creamy",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pudding": {
    "title": "剑桥词典 · pudding",
    "url": "https://dictionary.cambridge.org/dictionary/english/pudding",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sandwich": {
    "title": "剑桥词典 · sandwich",
    "url": "https://dictionary.cambridge.org/dictionary/english/sandwich",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-loaf": {
    "title": "剑桥词典 · loaf",
    "url": "https://dictionary.cambridge.org/dictionary/english/loaf",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pasta": {
    "title": "剑桥词典 · pasta",
    "url": "https://dictionary.cambridge.org/dictionary/english/pasta",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-jam": {
    "title": "剑桥词典 · jam",
    "url": "https://dictionary.cambridge.org/dictionary/english/jam",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-vanilla": {
    "title": "剑桥词典 · vanilla",
    "url": "https://dictionary.cambridge.org/dictionary/english/vanilla",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-wasabi": {
    "title": "剑桥词典 · wasabi",
    "url": "https://dictionary.cambridge.org/dictionary/english/wasabi",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pepper": {
    "title": "剑桥词典 · pepper",
    "url": "https://dictionary.cambridge.org/dictionary/english/pepper",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-ginger": {
    "title": "剑桥词典 · ginger",
    "url": "https://dictionary.cambridge.org/dictionary/english/ginger",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-garlic": {
    "title": "剑桥词典 · garlic",
    "url": "https://dictionary.cambridge.org/dictionary/english/garlic",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-scallion": {
    "title": "剑桥词典 · scallion",
    "url": "https://dictionary.cambridge.org/dictionary/english/scallion",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-vinegar": {
    "title": "剑桥词典 · vinegar",
    "url": "https://dictionary.cambridge.org/dictionary/english/vinegar",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-salty": {
    "title": "剑桥词典 · salty",
    "url": "https://dictionary.cambridge.org/dictionary/english/salty",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-flavour": {
    "title": "剑桥词典 · flavour",
    "url": "https://dictionary.cambridge.org/dictionary/english/flavour",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sour": {
    "title": "剑桥词典 · sour",
    "url": "https://dictionary.cambridge.org/dictionary/english/sour",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sweeten": {
    "title": "剑桥词典 · sweeten",
    "url": "https://dictionary.cambridge.org/dictionary/english/sweeten",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-spicy": {
    "title": "剑桥词典 · spicy",
    "url": "https://dictionary.cambridge.org/dictionary/english/spicy",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-delicious": {
    "title": "剑桥词典 · delicious",
    "url": "https://dictionary.cambridge.org/dictionary/english/delicious",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tasty": {
    "title": "剑桥词典 · tasty",
    "url": "https://dictionary.cambridge.org/dictionary/english/tasty",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-hunger": {
    "title": "剑桥词典 · hunger",
    "url": "https://dictionary.cambridge.org/dictionary/english/hunger",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sauce": {
    "title": "剑桥词典 · sauce",
    "url": "https://dictionary.cambridge.org/dictionary/english/sauce",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-soy sauce": {
    "title": "剑桥词典 · soy sauce",
    "url": "https://dictionary.cambridge.org/dictionary/english/soy%20sauce",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-ketchup": {
    "title": "剑桥词典 · ketchup",
    "url": "https://dictionary.cambridge.org/dictionary/english/ketchup",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-perfume": {
    "title": "剑桥词典 · perfume",
    "url": "https://dictionary.cambridge.org/dictionary/english/perfume",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-digestion": {
    "title": "剑桥词典 · digestion",
    "url": "https://dictionary.cambridge.org/dictionary/english/digestion",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cooker": {
    "title": "剑桥词典 · cooker",
    "url": "https://dictionary.cambridge.org/dictionary/english/cooker",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-baker": {
    "title": "剑桥词典 · baker",
    "url": "https://dictionary.cambridge.org/dictionary/english/baker",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-fry": {
    "title": "剑桥词典 · fry",
    "url": "https://dictionary.cambridge.org/dictionary/english/fry",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-toast": {
    "title": "剑桥词典 · toast",
    "url": "https://dictionary.cambridge.org/dictionary/english/toast",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-toaster": {
    "title": "剑桥词典 · toaster",
    "url": "https://dictionary.cambridge.org/dictionary/english/toaster",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lick": {
    "title": "剑桥词典 · lick",
    "url": "https://dictionary.cambridge.org/dictionary/english/lick",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-dip": {
    "title": "剑桥词典 · dip",
    "url": "https://dictionary.cambridge.org/dictionary/english/dip",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-dice": {
    "title": "剑桥词典 · dice",
    "url": "https://dictionary.cambridge.org/dictionary/english/dice",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-shred": {
    "title": "剑桥词典 · shred",
    "url": "https://dictionary.cambridge.org/dictionary/english/shred",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-deep-fry": {
    "title": "剑桥词典 · deep-fry",
    "url": "https://dictionary.cambridge.org/dictionary/english/deep-fry",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-steam": {
    "title": "剑桥词典 · steam",
    "url": "https://dictionary.cambridge.org/dictionary/english/steam",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-shell": {
    "title": "剑桥词典 · shell",
    "url": "https://dictionary.cambridge.org/dictionary/english/shell",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-mash": {
    "title": "剑桥词典 · mash",
    "url": "https://dictionary.cambridge.org/dictionary/english/mash",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-erection": {
    "title": "剑桥词典 · erection",
    "url": "https://dictionary.cambridge.org/dictionary/english/erection",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-structure": {
    "title": "剑桥词典 · structure",
    "url": "https://dictionary.cambridge.org/dictionary/english/structure",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-construct": {
    "title": "剑桥词典 · construct",
    "url": "https://dictionary.cambridge.org/dictionary/english/construct",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-established": {
    "title": "剑桥词典 · established",
    "url": "https://dictionary.cambridge.org/dictionary/english/established",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-founder": {
    "title": "剑桥词典 · founder",
    "url": "https://dictionary.cambridge.org/dictionary/english/founder",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-concretely": {
    "title": "剑桥词典 · concretely",
    "url": "https://dictionary.cambridge.org/dictionary/english/concretely",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-steel": {
    "title": "剑桥词典 · steel",
    "url": "https://dictionary.cambridge.org/dictionary/english/steel",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-stability": {
    "title": "剑桥词典 · stability",
    "url": "https://dictionary.cambridge.org/dictionary/english/stability",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-site": {
    "title": "剑桥词典 · site",
    "url": "https://dictionary.cambridge.org/dictionary/english/site",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-venue": {
    "title": "剑桥词典 · venue",
    "url": "https://dictionary.cambridge.org/dictionary/english/venue",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-situated": {
    "title": "剑桥词典 · situated",
    "url": "https://dictionary.cambridge.org/dictionary/english/situated",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-locate": {
    "title": "剑桥词典 · locate",
    "url": "https://dictionary.cambridge.org/dictionary/english/locate",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-settle": {
    "title": "剑桥词典 · settle",
    "url": "https://dictionary.cambridge.org/dictionary/english/settle",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-dwelling": {
    "title": "剑桥词典 · dwelling",
    "url": "https://dictionary.cambridge.org/dictionary/english/dwelling",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-mansion": {
    "title": "剑桥词典 · mansion",
    "url": "https://dictionary.cambridge.org/dictionary/english/mansion",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lodge": {
    "title": "剑桥词典 · lodge",
    "url": "https://dictionary.cambridge.org/dictionary/english/lodge",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-hut": {
    "title": "剑桥词典 · hut",
    "url": "https://dictionary.cambridge.org/dictionary/english/hut",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cellar": {
    "title": "剑桥词典 · cellar",
    "url": "https://dictionary.cambridge.org/dictionary/english/cellar",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cradle": {
    "title": "剑桥词典 · cradle",
    "url": "https://dictionary.cambridge.org/dictionary/english/cradle",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-shelter": {
    "title": "剑桥词典 · shelter",
    "url": "https://dictionary.cambridge.org/dictionary/english/shelter",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-porch": {
    "title": "剑桥词典 · porch",
    "url": "https://dictionary.cambridge.org/dictionary/english/porch",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-stair": {
    "title": "剑桥词典 · stair",
    "url": "https://dictionary.cambridge.org/dictionary/english/stair",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-staircase": {
    "title": "剑桥词典 · staircase",
    "url": "https://dictionary.cambridge.org/dictionary/english/staircase",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-storey": {
    "title": "剑桥词典 · storey",
    "url": "https://dictionary.cambridge.org/dictionary/english/storey",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-layer": {
    "title": "剑桥词典 · layer",
    "url": "https://dictionary.cambridge.org/dictionary/english/layer",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-elevator": {
    "title": "剑桥词典 · elevator",
    "url": "https://dictionary.cambridge.org/dictionary/english/elevator",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-escalator": {
    "title": "剑桥词典 · escalator",
    "url": "https://dictionary.cambridge.org/dictionary/english/escalator",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-handrail": {
    "title": "剑桥词典 · handrail",
    "url": "https://dictionary.cambridge.org/dictionary/english/handrail",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-laser": {
    "title": "剑桥词典 · laser",
    "url": "https://dictionary.cambridge.org/dictionary/english/laser",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-vault": {
    "title": "剑桥词典 · vault",
    "url": "https://dictionary.cambridge.org/dictionary/english/vault",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-vaulted": {
    "title": "剑桥词典 · vaulted",
    "url": "https://dictionary.cambridge.org/dictionary/english/vaulted",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-arched": {
    "title": "剑桥词典 · arched",
    "url": "https://dictionary.cambridge.org/dictionary/english/arched",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-eaves": {
    "title": "剑桥词典 · eaves",
    "url": "https://dictionary.cambridge.org/dictionary/english/eaves",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-chimney": {
    "title": "剑桥词典 · chimney",
    "url": "https://dictionary.cambridge.org/dictionary/english/chimney",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-reception": {
    "title": "剑桥词典 · reception",
    "url": "https://dictionary.cambridge.org/dictionary/english/reception",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lobby": {
    "title": "剑桥词典 · lobby",
    "url": "https://dictionary.cambridge.org/dictionary/english/lobby",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lobbyist": {
    "title": "剑桥词典 · lobbyist",
    "url": "https://dictionary.cambridge.org/dictionary/english/lobbyist",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-parlour": {
    "title": "剑桥词典 · parlour",
    "url": "https://dictionary.cambridge.org/dictionary/english/parlour",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-fireplace": {
    "title": "剑桥词典 · fireplace",
    "url": "https://dictionary.cambridge.org/dictionary/english/fireplace",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lavatory": {
    "title": "剑桥词典 · lavatory",
    "url": "https://dictionary.cambridge.org/dictionary/english/lavatory",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-toilet": {
    "title": "剑桥词典 · toilet",
    "url": "https://dictionary.cambridge.org/dictionary/english/toilet",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-bath": {
    "title": "剑桥词典 · bath",
    "url": "https://dictionary.cambridge.org/dictionary/english/bath",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-bathe": {
    "title": "剑桥词典 · bathe",
    "url": "https://dictionary.cambridge.org/dictionary/english/bathe",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-booth": {
    "title": "剑桥词典 · booth",
    "url": "https://dictionary.cambridge.org/dictionary/english/booth",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-casino": {
    "title": "剑桥词典 · casino",
    "url": "https://dictionary.cambridge.org/dictionary/english/casino",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-studio": {
    "title": "剑桥词典 · studio",
    "url": "https://dictionary.cambridge.org/dictionary/english/studio",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-downtown": {
    "title": "剑桥词典 · downtown",
    "url": "https://dictionary.cambridge.org/dictionary/english/downtown",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-urbanise": {
    "title": "剑桥词典 · urbanise",
    "url": "https://dictionary.cambridge.org/dictionary/english/urbanise",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-urbanisation": {
    "title": "剑桥词典 · urbanisation",
    "url": "https://dictionary.cambridge.org/dictionary/english/urbanisation",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-peripheral": {
    "title": "剑桥词典 · peripheral",
    "url": "https://dictionary.cambridge.org/dictionary/english/peripheral",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-periphery": {
    "title": "剑桥词典 · periphery",
    "url": "https://dictionary.cambridge.org/dictionary/english/periphery",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-spacious": {
    "title": "剑桥词典 · spacious",
    "url": "https://dictionary.cambridge.org/dictionary/english/spacious",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-airtight": {
    "title": "剑桥词典 · airtight",
    "url": "https://dictionary.cambridge.org/dictionary/english/airtight",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-plaza": {
    "title": "剑桥词典 · plaza",
    "url": "https://dictionary.cambridge.org/dictionary/english/plaza",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-brickwork": {
    "title": "剑桥词典 · brickwork",
    "url": "https://dictionary.cambridge.org/dictionary/english/brickwork",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-suspension": {
    "title": "剑桥词典 · suspension",
    "url": "https://dictionary.cambridge.org/dictionary/english/suspension",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-hook": {
    "title": "剑桥词典 · hook",
    "url": "https://dictionary.cambridge.org/dictionary/english/hook",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lever": {
    "title": "剑桥词典 · lever",
    "url": "https://dictionary.cambridge.org/dictionary/english/lever",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-scaffold": {
    "title": "剑桥词典 · scaffold",
    "url": "https://dictionary.cambridge.org/dictionary/english/scaffold",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-maltreat": {
    "title": "剑桥词典 · maltreat",
    "url": "https://dictionary.cambridge.org/dictionary/english/maltreat",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-maintenance": {
    "title": "剑桥词典 · maintenance",
    "url": "https://dictionary.cambridge.org/dictionary/english/maintenance",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-fix": {
    "title": "剑桥词典 · fix",
    "url": "https://dictionary.cambridge.org/dictionary/english/fix",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-mend": {
    "title": "剑桥词典 · mend",
    "url": "https://dictionary.cambridge.org/dictionary/english/mend",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-weld": {
    "title": "剑桥词典 · weld",
    "url": "https://dictionary.cambridge.org/dictionary/english/weld",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-saw": {
    "title": "剑桥词典 · saw",
    "url": "https://dictionary.cambridge.org/dictionary/english/saw",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-screw": {
    "title": "剑桥词典 · screw",
    "url": "https://dictionary.cambridge.org/dictionary/english/screw",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-drill": {
    "title": "剑桥词典 · drill",
    "url": "https://dictionary.cambridge.org/dictionary/english/drill",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-viaduct": {
    "title": "剑桥词典 · viaduct",
    "url": "https://dictionary.cambridge.org/dictionary/english/viaduct",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-span of life": {
    "title": "Merriam-Webster · life span",
    "url": "https://www.merriam-webster.com/dictionary/life%20span",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-furniture": {
    "title": "剑桥词典 · furniture",
    "url": "https://dictionary.cambridge.org/dictionary/english/furniture",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-placement": {
    "title": "剑桥词典 · placement",
    "url": "https://dictionary.cambridge.org/dictionary/english/placement",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-design": {
    "title": "剑桥词典 · design",
    "url": "https://dictionary.cambridge.org/dictionary/english/design",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-entrance": {
    "title": "剑桥词典 · entrance",
    "url": "https://dictionary.cambridge.org/dictionary/english/entrance",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-entry": {
    "title": "剑桥词典 · entry",
    "url": "https://dictionary.cambridge.org/dictionary/english/entry",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-enter": {
    "title": "剑桥词典 · enter",
    "url": "https://dictionary.cambridge.org/dictionary/english/enter",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-exit": {
    "title": "剑桥词典 · exit",
    "url": "https://dictionary.cambridge.org/dictionary/english/exit",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-outside": {
    "title": "剑桥词典 · outside",
    "url": "https://dictionary.cambridge.org/dictionary/english/outside",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-outward": {
    "title": "剑桥词典 · outward",
    "url": "https://dictionary.cambridge.org/dictionary/english/outward",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-inner": {
    "title": "剑桥词典 · inner",
    "url": "https://dictionary.cambridge.org/dictionary/english/inner",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-inward": {
    "title": "剑桥词典 · inward",
    "url": "https://dictionary.cambridge.org/dictionary/english/inward",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-aviation": {
    "title": "剑桥词典 · aviation",
    "url": "https://dictionary.cambridge.org/dictionary/english/aviation",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-safari": {
    "title": "剑桥词典 · safari",
    "url": "https://dictionary.cambridge.org/dictionary/english/safari",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-haunt": {
    "title": "剑桥词典 · haunt",
    "url": "https://dictionary.cambridge.org/dictionary/english/haunt",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-attraction": {
    "title": "剑桥词典 · attraction",
    "url": "https://dictionary.cambridge.org/dictionary/english/attraction",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-attractive": {
    "title": "剑桥词典 · attractive",
    "url": "https://dictionary.cambridge.org/dictionary/english/attractive",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-monumental": {
    "title": "剑桥词典 · monumental",
    "url": "https://dictionary.cambridge.org/dictionary/english/monumental",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pharaoh": {
    "title": "剑桥词典 · pharaoh",
    "url": "https://dictionary.cambridge.org/dictionary/english/pharaoh",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-traffic regulations": {
    "title": "Merriam-Webster · traffic",
    "url": "https://www.merriam-webster.com/dictionary/traffic",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-traffic regulations-2": {
    "title": "Merriam-Webster · regulation",
    "url": "https://www.merriam-webster.com/dictionary/regulation",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-traffic jam": {
    "title": "剑桥词典 · traffic jam",
    "url": "https://dictionary.cambridge.org/dictionary/english/traffic%20jam",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-traffic congestion": {
    "title": "Merriam-Webster · traffic",
    "url": "https://www.merriam-webster.com/dictionary/traffic",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-traffic congestion-2": {
    "title": "Merriam-Webster · congestion",
    "url": "https://www.merriam-webster.com/dictionary/congestion",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-aeroplane": {
    "title": "剑桥词典 · aeroplane",
    "url": "https://dictionary.cambridge.org/dictionary/english/aeroplane",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-helicopter": {
    "title": "剑桥词典 · helicopter",
    "url": "https://dictionary.cambridge.org/dictionary/english/helicopter",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-jet": {
    "title": "剑桥词典 · jet",
    "url": "https://dictionary.cambridge.org/dictionary/english/jet",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-parachute": {
    "title": "剑桥词典 · parachute",
    "url": "https://dictionary.cambridge.org/dictionary/english/parachute",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pilot": {
    "title": "剑桥词典 · pilot",
    "url": "https://dictionary.cambridge.org/dictionary/english/pilot",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-baggage": {
    "title": "剑桥词典 · baggage",
    "url": "https://dictionary.cambridge.org/dictionary/english/baggage",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-luggage": {
    "title": "剑桥词典 · luggage",
    "url": "https://dictionary.cambridge.org/dictionary/english/luggage",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-suitcase": {
    "title": "剑桥词典 · suitcase",
    "url": "https://dictionary.cambridge.org/dictionary/english/suitcase",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-carry-on": {
    "title": "剑桥词典 · carry-on",
    "url": "https://dictionary.cambridge.org/dictionary/english/carry-on",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-rack": {
    "title": "剑桥词典 · rack",
    "url": "https://dictionary.cambridge.org/dictionary/english/rack",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-freighter": {
    "title": "剑桥词典 · freighter",
    "url": "https://dictionary.cambridge.org/dictionary/english/freighter",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-itinerary": {
    "title": "剑桥词典 · itinerary",
    "url": "https://dictionary.cambridge.org/dictionary/english/itinerary",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-passage": {
    "title": "剑桥词典 · passage",
    "url": "https://dictionary.cambridge.org/dictionary/english/passage",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-intersection": {
    "title": "剑桥词典 · intersection",
    "url": "https://dictionary.cambridge.org/dictionary/english/intersection",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lane": {
    "title": "剑桥词典 · lane",
    "url": "https://dictionary.cambridge.org/dictionary/english/lane",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-avenue": {
    "title": "剑桥词典 · avenue",
    "url": "https://dictionary.cambridge.org/dictionary/english/avenue",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-curb": {
    "title": "剑桥词典 · curb",
    "url": "https://dictionary.cambridge.org/dictionary/english/curb",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-signpost": {
    "title": "剑桥词典 · signpost",
    "url": "https://dictionary.cambridge.org/dictionary/english/signpost",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pavement": {
    "title": "剑桥词典 · pavement",
    "url": "https://dictionary.cambridge.org/dictionary/english/pavement",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-vehicle": {
    "title": "剑桥词典 · vehicle",
    "url": "https://dictionary.cambridge.org/dictionary/english/vehicle",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-auto": {
    "title": "剑桥词典 · auto",
    "url": "https://dictionary.cambridge.org/dictionary/english/auto",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-express": {
    "title": "剑桥词典 · express",
    "url": "https://dictionary.cambridge.org/dictionary/english/express",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tram": {
    "title": "剑桥词典 · tram",
    "url": "https://dictionary.cambridge.org/dictionary/english/tram",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-truck": {
    "title": "剑桥词典 · truck",
    "url": "https://dictionary.cambridge.org/dictionary/english/truck",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lorry": {
    "title": "剑桥词典 · lorry",
    "url": "https://dictionary.cambridge.org/dictionary/english/lorry",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-van": {
    "title": "剑桥词典 · van",
    "url": "https://dictionary.cambridge.org/dictionary/english/van",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-carriage": {
    "title": "剑桥词典 · carriage",
    "url": "https://dictionary.cambridge.org/dictionary/english/carriage",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tractor": {
    "title": "剑桥词典 · tractor",
    "url": "https://dictionary.cambridge.org/dictionary/english/tractor",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pedicab": {
    "title": "剑桥词典 · pedicab",
    "url": "https://dictionary.cambridge.org/dictionary/english/pedicab",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-cycle": {
    "title": "剑桥词典 · cycle",
    "url": "https://dictionary.cambridge.org/dictionary/english/cycle",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-garage": {
    "title": "剑桥词典 · garage",
    "url": "https://dictionary.cambridge.org/dictionary/english/garage",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-vehicles": {
    "title": "剑桥词典 · vehicles",
    "url": "https://dictionary.cambridge.org/dictionary/english/vehicles",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-wheel": {
    "title": "剑桥词典 · wheel",
    "url": "https://dictionary.cambridge.org/dictionary/english/wheel",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-tire": {
    "title": "剑桥词典 · tire",
    "url": "https://dictionary.cambridge.org/dictionary/english/tire",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-honk": {
    "title": "剑桥词典 · honk",
    "url": "https://dictionary.cambridge.org/dictionary/english/honk",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-steward": {
    "title": "剑桥词典 · steward",
    "url": "https://dictionary.cambridge.org/dictionary/english/steward",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-stewardess": {
    "title": "剑桥词典 · stewardess",
    "url": "https://dictionary.cambridge.org/dictionary/english/stewardess",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-disappear": {
    "title": "剑桥词典 · disappear",
    "url": "https://dictionary.cambridge.org/dictionary/english/disappear",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-hazard": {
    "title": "剑桥词典 · hazard",
    "url": "https://dictionary.cambridge.org/dictionary/english/hazard",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-hazardous": {
    "title": "剑桥词典 · hazardous",
    "url": "https://dictionary.cambridge.org/dictionary/english/hazardous",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-harbour": {
    "title": "剑桥词典 · harbour",
    "url": "https://dictionary.cambridge.org/dictionary/english/harbour",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-dock": {
    "title": "剑桥词典 · dock",
    "url": "https://dictionary.cambridge.org/dictionary/english/dock",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sailor": {
    "title": "剑桥词典 · sailor",
    "url": "https://dictionary.cambridge.org/dictionary/english/sailor",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-seaman": {
    "title": "剑桥词典 · seaman",
    "url": "https://dictionary.cambridge.org/dictionary/english/seaman",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-steamer": {
    "title": "剑桥词典 · steamer",
    "url": "https://dictionary.cambridge.org/dictionary/english/steamer",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-liner": {
    "title": "剑桥词典 · liner",
    "url": "https://dictionary.cambridge.org/dictionary/english/liner",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-ferry": {
    "title": "剑桥词典 · ferry",
    "url": "https://dictionary.cambridge.org/dictionary/english/ferry",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-sail": {
    "title": "剑桥词典 · sail",
    "url": "https://dictionary.cambridge.org/dictionary/english/sail",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-deck": {
    "title": "剑桥词典 · deck",
    "url": "https://dictionary.cambridge.org/dictionary/english/deck",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-propeller": {
    "title": "剑桥词典 · propeller",
    "url": "https://dictionary.cambridge.org/dictionary/english/propeller",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-stern": {
    "title": "剑桥词典 · stern",
    "url": "https://dictionary.cambridge.org/dictionary/english/stern",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-embark": {
    "title": "剑桥词典 · embark",
    "url": "https://dictionary.cambridge.org/dictionary/english/embark",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-railroad": {
    "title": "剑桥词典 · railroad",
    "url": "https://dictionary.cambridge.org/dictionary/english/railroad",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-railway": {
    "title": "剑桥词典 · railway",
    "url": "https://dictionary.cambridge.org/dictionary/english/railway",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-locomotive": {
    "title": "剑桥词典 · locomotive",
    "url": "https://dictionary.cambridge.org/dictionary/english/locomotive",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-subway": {
    "title": "剑桥词典 · subway",
    "url": "https://dictionary.cambridge.org/dictionary/english/subway",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-underground": {
    "title": "剑桥词典 · underground",
    "url": "https://dictionary.cambridge.org/dictionary/english/underground",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-rail": {
    "title": "剑桥词典 · rail",
    "url": "https://dictionary.cambridge.org/dictionary/english/rail",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-delay": {
    "title": "剑桥词典 · delay",
    "url": "https://dictionary.cambridge.org/dictionary/english/delay",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-postpone": {
    "title": "剑桥词典 · postpone",
    "url": "https://dictionary.cambridge.org/dictionary/english/postpone",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-lull": {
    "title": "剑桥词典 · lull",
    "url": "https://dictionary.cambridge.org/dictionary/english/lull",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-due": {
    "title": "剑桥词典 · due",
    "url": "https://dictionary.cambridge.org/dictionary/english/due",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-postage": {
    "title": "剑桥词典 · postage",
    "url": "https://dictionary.cambridge.org/dictionary/english/postage",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-post": {
    "title": "剑桥词典 · post",
    "url": "https://dictionary.cambridge.org/dictionary/english/post",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-stamp": {
    "title": "剑桥词典 · stamp",
    "url": "https://dictionary.cambridge.org/dictionary/english/stamp",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-package": {
    "title": "剑桥词典 · package",
    "url": "https://dictionary.cambridge.org/dictionary/english/package",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-pack": {
    "title": "剑桥词典 · pack",
    "url": "https://dictionary.cambridge.org/dictionary/english/pack",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-parcel": {
    "title": "剑桥词典 · parcel",
    "url": "https://dictionary.cambridge.org/dictionary/english/parcel",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-load": {
    "title": "剑桥词典 · load",
    "url": "https://dictionary.cambridge.org/dictionary/english/load",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-unload": {
    "title": "剑桥词典 · unload",
    "url": "https://dictionary.cambridge.org/dictionary/english/unload",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-transition": {
    "title": "剑桥词典 · transition",
    "url": "https://dictionary.cambridge.org/dictionary/english/transition",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-deliver": {
    "title": "剑桥词典 · deliver",
    "url": "https://dictionary.cambridge.org/dictionary/english/deliver",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-republic": {
    "title": "剑桥词典 · republic",
    "url": "https://dictionary.cambridge.org/dictionary/english/republic",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-republican": {
    "title": "剑桥词典 · republican",
    "url": "https://dictionary.cambridge.org/dictionary/english/republican",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-marxism": {
    "title": "剑桥词典 · marxism",
    "url": "https://dictionary.cambridge.org/dictionary/english/marxism",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-socialism": {
    "title": "剑桥词典 · socialism",
    "url": "https://dictionary.cambridge.org/dictionary/english/socialism",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-socialist": {
    "title": "剑桥词典 · socialist",
    "url": "https://dictionary.cambridge.org/dictionary/english/socialist",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-communism": {
    "title": "剑桥词典 · communism",
    "url": "https://dictionary.cambridge.org/dictionary/english/communism",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-communist": {
    "title": "剑桥词典 · communist",
    "url": "https://dictionary.cambridge.org/dictionary/english/communist",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-government": {
    "title": "剑桥词典 · government",
    "url": "https://dictionary.cambridge.org/dictionary/english/government",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-authorise": {
    "title": "剑桥词典 · authorise",
    "url": "https://dictionary.cambridge.org/dictionary/english/authorise",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-political": {
    "title": "剑桥词典 · political",
    "url": "https://dictionary.cambridge.org/dictionary/english/political",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-policy": {
    "title": "剑桥词典 · policy",
    "url": "https://dictionary.cambridge.org/dictionary/english/policy",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-politician": {
    "title": "剑桥词典 · politician",
    "url": "https://dictionary.cambridge.org/dictionary/english/politician",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-democratise": {
    "title": "剑桥词典 · democratise",
    "url": "https://dictionary.cambridge.org/dictionary/english/democratise",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-bureaucracy": {
    "title": "剑桥词典 · bureaucracy",
    "url": "https://dictionary.cambridge.org/dictionary/english/bureaucracy",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-bureaucratism": {
    "title": "Merriam-Webster · bureaucratism",
    "url": "https://www.merriam-webster.com/dictionary/bureaucratism",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-bureaucratism-2": {
    "title": "Merriam-Webster · bureaucracy",
    "url": "https://www.merriam-webster.com/dictionary/bureaucracy",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-egalitarian": {
    "title": "剑桥词典 · egalitarian",
    "url": "https://dictionary.cambridge.org/dictionary/english/egalitarian",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-materialism": {
    "title": "剑桥词典 · materialism",
    "url": "https://dictionary.cambridge.org/dictionary/english/materialism",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-revolution": {
    "title": "剑桥词典 · revolution",
    "url": "https://dictionary.cambridge.org/dictionary/english/revolution",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-revolutionary": {
    "title": "剑桥词典 · revolutionary",
    "url": "https://dictionary.cambridge.org/dictionary/english/revolutionary",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-procession": {
    "title": "剑桥词典 · procession",
    "url": "https://dictionary.cambridge.org/dictionary/english/procession",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-meltdown": {
    "title": "剑桥词典 · meltdown",
    "url": "https://dictionary.cambridge.org/dictionary/english/meltdown",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-bilateral": {
    "title": "剑桥词典 · bilateral",
    "url": "https://dictionary.cambridge.org/dictionary/english/bilateral",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "e8-source-arena": {
    "title": "剑桥词典 · arena",
    "url": "https://dictionary.cambridge.org/dictionary/english/arena",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  }
};
const sourceIdsByWord = {
  "novice": [
    "e8-source-novice"
  ],
  "literate": [
    "e8-source-literate"
  ],
  "illiteracy": [
    "e8-source-illiteracy"
  ],
  "numerate": [
    "e8-source-numerate"
  ],
  "controversial": [
    "e8-source-controversial"
  ],
  "issue": [
    "e8-source-issue"
  ],
  "affair": [
    "e8-source-affair"
  ],
  "riddle": [
    "e8-source-riddle"
  ],
  "instil": [
    "e8-source-instil"
  ],
  "cram": [
    "e8-source-cram"
  ],
  "emphasise": [
    "e8-source-emphasise"
  ],
  "enable": [
    "e8-source-enable"
  ],
  "inspire": [
    "e8-source-inspire"
  ],
  "indulge": [
    "e8-source-indulge"
  ],
  "intelligible": [
    "e8-source-intelligible"
  ],
  "all-round": [
    "e8-source-all-round"
  ],
  "idiot": [
    "e8-source-idiot"
  ],
  "wisdom": [
    "e8-source-wisdom"
  ],
  "wit": [
    "e8-source-wit"
  ],
  "aptitude": [
    "e8-source-aptitude"
  ],
  "excellent": [
    "e8-source-excellent"
  ],
  "reputation": [
    "e8-source-reputation"
  ],
  "eminent": [
    "e8-source-eminent"
  ],
  "notorious": [
    "e8-source-notorious"
  ],
  "esteem": [
    "e8-source-esteem"
  ],
  "respect": [
    "e8-source-respect"
  ],
  "diligent": [
    "e8-source-diligent"
  ],
  "painstaking": [
    "e8-source-painstaking"
  ],
  "skill": [
    "e8-source-skill"
  ],
  "headmaster": [
    "e8-source-headmaster"
  ],
  "professor": [
    "e8-source-professor"
  ],
  "mentor": [
    "e8-source-mentor"
  ],
  "tutor": [
    "e8-source-tutor"
  ],
  "lecturer": [
    "e8-source-lecturer"
  ],
  "assistant": [
    "e8-source-assistant"
  ],
  "degree": [
    "e8-source-degree"
  ],
  "permit": [
    "e8-source-permit"
  ],
  "diploma": [
    "e8-source-diploma"
  ],
  "graduate": [
    "e8-source-graduate"
  ],
  "bachelor": [
    "e8-source-bachelor",
    "e8-source-bachelor-2"
  ],
  "master": [
    "e8-source-master",
    "e8-source-master-2"
  ],
  "fresher": [
    "e8-source-fresher"
  ],
  "sophomore": [
    "e8-source-sophomore"
  ],
  "junior": [
    "e8-source-junior"
  ],
  "senior": [
    "e8-source-senior"
  ],
  "alumni": [
    "e8-source-alumni"
  ],
  "orientation": [
    "e8-source-orientation"
  ],
  "coed": [
    "e8-source-coed"
  ],
  "enrol": [
    "e8-source-enrol"
  ],
  "matriculation": [
    "e8-source-matriculation"
  ],
  "dorm": [
    "e8-source-dorm"
  ],
  "dining hall": [
    "e8-source-dining hall"
  ],
  "canteen": [
    "e8-source-canteen"
  ],
  "experiment": [
    "e8-source-experiment"
  ],
  "data": [
    "e8-source-data"
  ],
  "quality": [
    "e8-source-quality"
  ],
  "library": [
    "e8-source-library"
  ],
  "author": [
    "e8-source-author"
  ],
  "diary": [
    "e8-source-diary"
  ],
  "poetry": [
    "e8-source-poetry"
  ],
  "magazine": [
    "e8-source-magazine"
  ],
  "journal": [
    "e8-source-journal"
  ],
  "coverage": [
    "e8-source-coverage"
  ],
  "bibliography": [
    "e8-source-bibliography"
  ],
  "record": [
    "e8-source-record"
  ],
  "file": [
    "e8-source-file"
  ],
  "frame": [
    "e8-source-frame"
  ],
  "catalogue": [
    "e8-source-catalogue"
  ],
  "content": [
    "e8-source-content"
  ],
  "list": [
    "e8-source-list"
  ],
  "volume": [
    "e8-source-volume"
  ],
  "reel": [
    "e8-source-reel"
  ],
  "subject": [
    "e8-source-subject"
  ],
  "major": [
    "e8-source-major"
  ],
  "sociology": [
    "e8-source-sociology"
  ],
  "politics": [
    "e8-source-politics"
  ],
  "economics": [
    "e8-source-economics"
  ],
  "marketing": [
    "e8-source-marketing"
  ],
  "accounting": [
    "e8-source-accounting"
  ],
  "audit": [
    "e8-source-audit"
  ],
  "psychology": [
    "e8-source-psychology"
  ],
  "philosophy": [
    "e8-source-philosophy"
  ],
  "logic": [
    "e8-source-logic"
  ],
  "physics": [
    "e8-source-physics"
  ],
  "logistics": [
    "e8-source-logistics"
  ],
  "geography": [
    "e8-source-geography"
  ],
  "history": [
    "e8-source-history"
  ],
  "engineering": [
    "e8-source-engineering"
  ],
  "mechanics": [
    "e8-source-mechanics"
  ],
  "maths": [
    "e8-source-maths"
  ],
  "arithmetic": [
    "e8-source-arithmetic"
  ],
  "geometry": [
    "e8-source-geometry"
  ],
  "calculus": [
    "e8-source-calculus"
  ],
  "plus": [
    "e8-source-plus"
  ],
  "merger": [
    "e8-source-merger"
  ],
  "minus": [
    "e8-source-minus"
  ],
  "subtract": [
    "e8-source-subtract"
  ],
  "divide": [
    "e8-source-divide"
  ],
  "dividend": [
    "e8-source-dividend"
  ],
  "rational": [
    "e8-source-rational"
  ],
  "even": [
    "e8-source-even"
  ],
  "mean": [
    "e8-source-mean"
  ],
  "double": [
    "e8-source-double"
  ],
  "triple": [
    "e8-source-triple"
  ],
  "quadruple": [
    "e8-source-quadruple"
  ],
  "minimum": [
    "e8-source-minimum"
  ],
  "maximum": [
    "e8-source-maximum"
  ],
  "approximately": [
    "e8-source-approximately"
  ],
  "graph": [
    "e8-source-graph"
  ],
  "cube": [
    "e8-source-cube"
  ],
  "triangle": [
    "e8-source-triangle"
  ],
  "straight": [
    "e8-source-straight"
  ],
  "round": [
    "e8-source-round"
  ],
  "dot": [
    "e8-source-dot"
  ],
  "cone": [
    "e8-source-cone"
  ],
  "width": [
    "e8-source-width"
  ],
  "length": [
    "e8-source-length"
  ],
  "per cent": [
    "e8-source-per cent"
  ],
  "ounce": [
    "e8-source-ounce"
  ],
  "fahrenheit": [
    "e8-source-fahrenheit"
  ],
  "volt": [
    "e8-source-volt"
  ],
  "transparent": [
    "e8-source-transparent"
  ],
  "ozone": [
    "e8-source-ozone"
  ],
  "eccentric": [
    "e8-source-eccentric"
  ],
  "dilute": [
    "e8-source-dilute"
  ],
  "noxious": [
    "e8-source-noxious"
  ],
  "inert": [
    "e8-source-inert"
  ],
  "doctrine": [
    "e8-source-doctrine"
  ],
  "semester": [
    "e8-source-semester"
  ],
  "timetable": [
    "e8-source-timetable"
  ],
  "deadline": [
    "e8-source-deadline"
  ],
  "course": [
    "e8-source-course"
  ],
  "seminar": [
    "e8-source-seminar"
  ],
  "syllabus": [
    "e8-source-syllabus"
  ],
  "system": [
    "e8-source-system"
  ],
  "basic": [
    "e8-source-basic"
  ],
  "surface": [
    "e8-source-surface"
  ],
  "prerequisite": [
    "e8-source-prerequisite"
  ],
  "elective": [
    "e8-source-elective"
  ],
  "preview": [
    "e8-source-preview"
  ],
  "inspect": [
    "e8-source-inspect"
  ],
  "skim": [
    "e8-source-skim"
  ],
  "scan": [
    "e8-source-scan"
  ],
  "scrutinise": [
    "e8-source-scrutinise"
  ],
  "recite": [
    "e8-source-recite"
  ],
  "test": [
    "e8-source-test"
  ],
  "quiz": [
    "e8-source-quiz"
  ],
  "plagiarise": [
    "e8-source-plagiarise"
  ],
  "copy": [
    "e8-source-copy"
  ],
  "print": [
    "e8-source-print"
  ],
  "essay": [
    "e8-source-essay"
  ],
  "paper": [
    "e8-source-paper"
  ],
  "dissertation": [
    "e8-source-dissertation"
  ],
  "heading": [
    "e8-source-heading"
  ],
  "outset": [
    "e8-source-outset"
  ],
  "point": [
    "e8-source-point"
  ],
  "opinion": [
    "e8-source-opinion"
  ],
  "introduce": [
    "e8-source-introduce"
  ],
  "postulate": [
    "e8-source-postulate"
  ],
  "recognise": [
    "e8-source-recognise"
  ],
  "insist": [
    "e8-source-insist"
  ],
  "persist": [
    "e8-source-persist"
  ],
  "understand": [
    "e8-source-understand"
  ],
  "compare": [
    "e8-source-compare"
  ],
  "contrast": [
    "e8-source-contrast"
  ],
  "contradiction": [
    "e8-source-contradiction"
  ],
  "disagree": [
    "e8-source-disagree"
  ],
  "nuance": [
    "e8-source-nuance"
  ],
  "inductive": [
    "e8-source-inductive"
  ],
  "detail": [
    "e8-source-detail"
  ],
  "example": [
    "e8-source-example"
  ],
  "prove": [
    "e8-source-prove"
  ],
  "decide": [
    "e8-source-decide"
  ],
  "research": [
    "e8-source-research"
  ],
  "score": [
    "e8-source-score"
  ],
  "mark": [
    "e8-source-mark"
  ],
  "grade": [
    "e8-source-grade"
  ],
  "rank": [
    "e8-source-rank"
  ],
  "queue": [
    "e8-source-queue"
  ],
  "praise": [
    "e8-source-praise"
  ],
  "fellowship": [
    "e8-source-fellowship"
  ],
  "scholarship": [
    "e8-source-scholarship"
  ],
  "prize": [
    "e8-source-prize"
  ],
  "fee": [
    "e8-source-fee"
  ],
  "technology": [
    "e8-source-technology"
  ],
  "polytechnic": [
    "e8-source-polytechnic"
  ],
  "engineer": [
    "e8-source-engineer"
  ],
  "breakthrough": [
    "e8-source-breakthrough"
  ],
  "gizmo": [
    "e8-source-gizmo"
  ],
  "invent": [
    "e8-source-invent"
  ],
  "foundation": [
    "e8-source-foundation"
  ],
  "specialise": [
    "e8-source-specialise"
  ],
  "utilise": [
    "e8-source-utilise"
  ],
  "tester": [
    "e8-source-tester"
  ],
  "facility": [
    "e8-source-facility"
  ],
  "equipment": [
    "e8-source-equipment"
  ],
  "instrument": [
    "e8-source-instrument"
  ],
  "tool": [
    "e8-source-tool"
  ],
  "measure": [
    "e8-source-measure"
  ],
  "count": [
    "e8-source-count"
  ],
  "estimate": [
    "e8-source-estimate"
  ],
  "byproduct": [
    "e8-source-byproduct"
  ],
  "add": [
    "e8-source-add"
  ],
  "gather": [
    "e8-source-gather"
  ],
  "optics": [
    "e8-source-optics"
  ],
  "radar": [
    "e8-source-radar"
  ],
  "sensor": [
    "e8-source-sensor"
  ],
  "multimedia": [
    "e8-source-multimedia"
  ],
  "network": [
    "e8-source-network"
  ],
  "browser": [
    "e8-source-browser"
  ],
  "dial": [
    "e8-source-dial"
  ],
  "microcomputer": [
    "e8-source-microcomputer"
  ],
  "laptop": [
    "e8-source-laptop"
  ],
  "software": [
    "e8-source-software"
  ],
  "keyboard": [
    "e8-source-keyboard"
  ],
  "screen": [
    "e8-source-screen"
  ],
  "loudspeaker": [
    "e8-source-loudspeaker"
  ],
  "microphone": [
    "e8-source-microphone"
  ],
  "cassette": [
    "e8-source-cassette"
  ],
  "tape": [
    "e8-source-tape"
  ],
  "binary": [
    "e8-source-binary"
  ],
  "digital": [
    "e8-source-digital"
  ],
  "wireless": [
    "e8-source-wireless"
  ],
  "high-definition": [
    "e8-source-high-definition"
  ],
  "audio": [
    "e8-source-audio"
  ],
  "science fiction": [
    "e8-source-science fiction"
  ],
  "generator": [
    "e8-source-generator"
  ],
  "pivot": [
    "e8-source-pivot"
  ],
  "hydraulic": [
    "e8-source-hydraulic"
  ],
  "sewage": [
    "e8-source-sewage"
  ],
  "ventilation": [
    "e8-source-ventilation"
  ],
  "simplify": [
    "e8-source-simplify"
  ],
  "distil": [
    "e8-source-distil"
  ],
  "mode": [
    "e8-source-mode"
  ],
  "convert": [
    "e8-source-convert"
  ],
  "turn": [
    "e8-source-turn"
  ],
  "error": [
    "e8-source-error"
  ],
  "fault": [
    "e8-source-fault"
  ],
  "stumble": [
    "e8-source-stumble"
  ],
  "contingency": [
    "e8-source-contingency"
  ],
  "culture": [
    "e8-source-culture"
  ],
  "civilisation": [
    "e8-source-civilisation"
  ],
  "epic": [
    "e8-source-epic"
  ],
  "ideology": [
    "e8-source-ideology"
  ],
  "tradition": [
    "e8-source-tradition"
  ],
  "custom": [
    "e8-source-custom"
  ],
  "feudalism": [
    "e8-source-feudalism"
  ],
  "slavery": [
    "e8-source-slavery"
  ],
  "ethical": [
    "e8-source-ethical"
  ],
  "aboriginal": [
    "e8-source-aboriginal"
  ],
  "native": [
    "e8-source-native"
  ],
  "local": [
    "e8-source-local"
  ],
  "foreigner": [
    "e8-source-foreigner"
  ],
  "anthropologist": [
    "e8-source-anthropologist"
  ],
  "heritage": [
    "e8-source-heritage"
  ],
  "antique": [
    "e8-source-antique"
  ],
  "museum": [
    "e8-source-museum"
  ],
  "pottery": [
    "e8-source-pottery"
  ],
  "religion": [
    "e8-source-religion"
  ],
  "etiquette": [
    "e8-source-etiquette"
  ],
  "belief": [
    "e8-source-belief"
  ],
  "soul": [
    "e8-source-soul"
  ],
  "spirit": [
    "e8-source-spirit"
  ],
  "hallowed": [
    "e8-source-hallowed"
  ],
  "holy": [
    "e8-source-holy"
  ],
  "pope": [
    "e8-source-pope"
  ],
  "bishop": [
    "e8-source-bishop"
  ],
  "missionary": [
    "e8-source-missionary"
  ],
  "monk": [
    "e8-source-monk"
  ],
  "temple": [
    "e8-source-temple"
  ],
  "pagoda": [
    "e8-source-pagoda"
  ],
  "chronology": [
    "e8-source-chronology"
  ],
  "king": [
    "e8-source-king"
  ],
  "queen": [
    "e8-source-queen"
  ],
  "prince": [
    "e8-source-prince"
  ],
  "princess": [
    "e8-source-princess"
  ],
  "majesty": [
    "e8-source-majesty"
  ],
  "nobility": [
    "e8-source-nobility"
  ],
  "lord": [
    "e8-source-lord"
  ],
  "knight": [
    "e8-source-knight"
  ],
  "nostalgia": [
    "e8-source-nostalgia"
  ],
  "background": [
    "e8-source-background"
  ],
  "experience": [
    "e8-source-experience"
  ],
  "accident": [
    "e8-source-accident"
  ],
  "setback": [
    "e8-source-setback"
  ],
  "adversity": [
    "e8-source-adversity"
  ],
  "language": [
    "e8-source-language"
  ],
  "symbol": [
    "e8-source-symbol"
  ],
  "gesture": [
    "e8-source-gesture"
  ],
  "handwriting": [
    "e8-source-handwriting"
  ],
  "pictograph": [
    "e8-source-pictograph"
  ],
  "wedge": [
    "e8-source-wedge"
  ],
  "knot": [
    "e8-source-knot"
  ],
  "linguistics": [
    "e8-source-linguistics"
  ],
  "semantic": [
    "e8-source-semantic"
  ],
  "syntax": [
    "e8-source-syntax"
  ],
  "grammar": [
    "e8-source-grammar"
  ],
  "phonetics": [
    "e8-source-phonetics"
  ],
  "pronounce": [
    "e8-source-pronounce"
  ],
  "intonation": [
    "e8-source-intonation"
  ],
  "inflection": [
    "e8-source-inflection"
  ],
  "accent": [
    "e8-source-accent"
  ],
  "utterance": [
    "e8-source-utterance"
  ],
  "oral": [
    "e8-source-oral"
  ],
  "phoneme": [
    "e8-source-phoneme"
  ],
  "vowel": [
    "e8-source-vowel"
  ],
  "consonant": [
    "e8-source-consonant"
  ],
  "logogram": [
    "e8-source-logogram"
  ],
  "vocabulary": [
    "e8-source-vocabulary"
  ],
  "diction": [
    "e8-source-diction"
  ],
  "idiom": [
    "e8-source-idiom"
  ],
  "phrase": [
    "e8-source-phrase"
  ],
  "clause": [
    "e8-source-clause"
  ],
  "expression": [
    "e8-source-expression"
  ],
  "tense": [
    "e8-source-tense"
  ],
  "prefix": [
    "e8-source-prefix"
  ],
  "suffix": [
    "e8-source-suffix"
  ],
  "abbreviation": [
    "e8-source-abbreviation"
  ],
  "antonym": [
    "e8-source-antonym"
  ],
  "noun": [
    "e8-source-noun"
  ],
  "singular": [
    "e8-source-singular"
  ],
  "pronoun": [
    "e8-source-pronoun"
  ],
  "verb": [
    "e8-source-verb"
  ],
  "adjective": [
    "e8-source-adjective"
  ],
  "adverb": [
    "e8-source-adverb"
  ],
  "preposition": [
    "e8-source-preposition"
  ],
  "complicated": [
    "e8-source-complicated"
  ],
  "eloquence": [
    "e8-source-eloquence"
  ],
  "communicate": [
    "e8-source-communicate"
  ],
  "discussion": [
    "e8-source-discussion"
  ],
  "brainstorm": [
    "e8-source-brainstorm"
  ],
  "debate about": [
    "e8-source-debate about"
  ],
  "negotiate": [
    "e8-source-negotiate"
  ],
  "negotiation": [
    "e8-source-negotiation"
  ],
  "press": [
    "e8-source-press"
  ],
  "journalist": [
    "e8-source-journalist"
  ],
  "commentator": [
    "e8-source-commentator"
  ],
  "exponent": [
    "e8-source-exponent"
  ],
  "announcer": [
    "e8-source-announcer"
  ],
  "correspondent": [
    "e8-source-correspondent"
  ],
  "messenger": [
    "e8-source-messenger"
  ],
  "editor": [
    "e8-source-editor"
  ],
  "typist": [
    "e8-source-typist"
  ],
  "propaganda": [
    "e8-source-propaganda"
  ],
  "publish": [
    "e8-source-publish"
  ],
  "disseminate": [
    "e8-source-disseminate"
  ],
  "expect": [
    "e8-source-expect"
  ],
  "pastime": [
    "e8-source-pastime"
  ],
  "entertain": [
    "e8-source-entertain"
  ],
  "recreation": [
    "e8-source-recreation"
  ],
  "gossip": [
    "e8-source-gossip"
  ],
  "rumour": [
    "e8-source-rumour"
  ],
  "feast": [
    "e8-source-feast"
  ],
  "programme": [
    "e8-source-programme"
  ],
  "programmer": [
    "e8-source-programmer"
  ],
  "simulate": [
    "e8-source-simulate"
  ],
  "simulative": [
    "e8-source-simulative"
  ],
  "circus": [
    "e8-source-circus"
  ],
  "concert": [
    "e8-source-concert"
  ],
  "musicale": [
    "e8-source-musicale"
  ],
  "concertmaster": [
    "e8-source-concertmaster"
  ],
  "opera": [
    "e8-source-opera"
  ],
  "tragedy": [
    "e8-source-tragedy"
  ],
  "animation": [
    "e8-source-animation"
  ],
  "x-rated": [
    "e8-source-x-rated"
  ],
  "artistic": [
    "e8-source-artistic"
  ],
  "craftsman": [
    "e8-source-craftsman"
  ],
  "role": [
    "e8-source-role"
  ],
  "scene": [
    "e8-source-scene"
  ],
  "stage": [
    "e8-source-stage"
  ],
  "gallery": [
    "e8-source-gallery"
  ],
  "exhibition": [
    "e8-source-exhibition"
  ],
  "opt": [
    "e8-source-opt"
  ],
  "photography": [
    "e8-source-photography"
  ],
  "draw": [
    "e8-source-draw"
  ],
  "describe": [
    "e8-source-describe"
  ],
  "musical": [
    "e8-source-musical"
  ],
  "solo": [
    "e8-source-solo"
  ],
  "tune": [
    "e8-source-tune"
  ],
  "disc": [
    "e8-source-disc"
  ],
  "violin": [
    "e8-source-violin"
  ],
  "harmonica": [
    "e8-source-harmonica"
  ],
  "trumpet": [
    "e8-source-trumpet"
  ],
  "flute": [
    "e8-source-flute"
  ],
  "competition": [
    "e8-source-competition"
  ],
  "compete": [
    "e8-source-compete"
  ],
  "sponsorship": [
    "e8-source-sponsorship"
  ],
  "spectator": [
    "e8-source-spectator"
  ],
  "volunteer": [
    "e8-source-volunteer"
  ],
  "well-known": [
    "e8-source-well-known"
  ],
  "stadium": [
    "e8-source-stadium"
  ],
  "exercise": [
    "e8-source-exercise"
  ],
  "indoor": [
    "e8-source-indoor"
  ],
  "outdoor": [
    "e8-source-outdoor"
  ],
  "movement": [
    "e8-source-movement"
  ],
  "sprawl": [
    "e8-source-sprawl"
  ],
  "badminton": [
    "e8-source-badminton"
  ],
  "billiards": [
    "e8-source-billiards"
  ],
  "soccer": [
    "e8-source-soccer"
  ],
  "tennis": [
    "e8-source-tennis"
  ],
  "volleyball": [
    "e8-source-volleyball"
  ],
  "hockey": [
    "e8-source-hockey"
  ],
  "kick": [
    "e8-source-kick"
  ],
  "knock": [
    "e8-source-knock"
  ],
  "flip": [
    "e8-source-flip"
  ],
  "throw": [
    "e8-source-throw"
  ],
  "toss": [
    "e8-source-toss"
  ],
  "glide": [
    "e8-source-glide"
  ],
  "tumble": [
    "e8-source-tumble"
  ],
  "ski": [
    "e8-source-ski"
  ],
  "skate": [
    "e8-source-skate"
  ],
  "cycling": [
    "e8-source-cycling"
  ],
  "cyclist": [
    "e8-source-cyclist"
  ],
  "bicycle": [
    "e8-source-bicycle"
  ],
  "jump": [
    "e8-source-jump"
  ],
  "plunge": [
    "e8-source-plunge"
  ],
  "plunge whole-heartedly": [
    "e8-source-plunge whole-heartedly",
    "e8-source-plunge whole-heartedly-2",
    "e8-source-plunge whole-heartedly-3"
  ],
  "tent": [
    "e8-source-tent"
  ],
  "picnic": [
    "e8-source-picnic"
  ],
  "hunt": [
    "e8-source-hunt"
  ],
  "race": [
    "e8-source-race"
  ],
  "marathon": [
    "e8-source-marathon"
  ],
  "pace": [
    "e8-source-pace"
  ],
  "step": [
    "e8-source-step"
  ],
  "footstep": [
    "e8-source-footstep"
  ],
  "cruise": [
    "e8-source-cruise"
  ],
  "vocation": [
    "e8-source-vocation"
  ],
  "hike": [
    "e8-source-hike"
  ],
  "jog": [
    "e8-source-jog"
  ],
  "jogger": [
    "e8-source-jogger"
  ],
  "stride": [
    "e8-source-stride"
  ],
  "pull": [
    "e8-source-pull"
  ],
  "be": [
    "e8-source-be"
  ],
  "take a bow": [
    "e8-source-take a bow"
  ],
  "stuff": [
    "e8-source-stuff"
  ],
  "item": [
    "e8-source-item"
  ],
  "souvenir": [
    "e8-source-souvenir"
  ],
  "artefact": [
    "e8-source-artefact"
  ],
  "material": [
    "e8-source-material"
  ],
  "raw": [
    "e8-source-raw"
  ],
  "raw material": [
    "e8-source-raw material"
  ],
  "necessary": [
    "e8-source-necessary"
  ],
  "outfit": [
    "e8-source-outfit"
  ],
  "kit": [
    "e8-source-kit"
  ],
  "garbage": [
    "e8-source-garbage"
  ],
  "rubbish": [
    "e8-source-rubbish"
  ],
  "trash": [
    "e8-source-trash"
  ],
  "reuse": [
    "e8-source-reuse"
  ],
  "litter": [
    "e8-source-litter"
  ],
  "waste": [
    "e8-source-waste"
  ],
  "junk": [
    "e8-source-junk"
  ],
  "sewerage": [
    "e8-source-sewerage"
  ],
  "detergent": [
    "e8-source-detergent"
  ],
  "lotion": [
    "e8-source-lotion"
  ],
  "shampoo": [
    "e8-source-shampoo"
  ],
  "soap": [
    "e8-source-soap"
  ],
  "tub": [
    "e8-source-tub"
  ],
  "pipe": [
    "e8-source-pipe"
  ],
  "pipeline": [
    "e8-source-pipeline"
  ],
  "tube": [
    "e8-source-tube"
  ],
  "mop": [
    "e8-source-mop"
  ],
  "mattress": [
    "e8-source-mattress"
  ],
  "rug": [
    "e8-source-rug"
  ],
  "mat": [
    "e8-source-mat"
  ],
  "pad": [
    "e8-source-pad"
  ],
  "sheet": [
    "e8-source-sheet"
  ],
  "pillow": [
    "e8-source-pillow"
  ],
  "towel": [
    "e8-source-towel"
  ],
  "nail": [
    "e8-source-nail"
  ],
  "razor": [
    "e8-source-razor"
  ],
  "shave": [
    "e8-source-shave"
  ],
  "match": [
    "e8-source-match"
  ],
  "wax": [
    "e8-source-wax"
  ],
  "portfolio": [
    "e8-source-portfolio"
  ],
  "paperback": [
    "e8-source-paperback"
  ],
  "pamphlet": [
    "e8-source-pamphlet"
  ],
  "booklet": [
    "e8-source-booklet"
  ],
  "cover": [
    "e8-source-cover"
  ],
  "xerox": [
    "e8-source-xerox"
  ],
  "memorandum": [
    "e8-source-memorandum"
  ],
  "stationery": [
    "e8-source-stationery"
  ],
  "stationer": [
    "e8-source-stationer"
  ],
  "glue": [
    "e8-source-glue"
  ],
  "rubber": [
    "e8-source-rubber"
  ],
  "scissors": [
    "e8-source-scissors"
  ],
  "shear": [
    "e8-source-shear"
  ],
  "edge": [
    "e8-source-edge"
  ],
  "rim": [
    "e8-source-rim"
  ],
  "element": [
    "e8-source-element"
  ],
  "badge": [
    "e8-source-badge"
  ],
  "knob": [
    "e8-source-knob"
  ],
  "shutter": [
    "e8-source-shutter"
  ],
  "pane": [
    "e8-source-pane"
  ],
  "opacity": [
    "e8-source-opacity"
  ],
  "pail": [
    "e8-source-pail"
  ],
  "lantern": [
    "e8-source-lantern"
  ],
  "flashlight": [
    "e8-source-flashlight"
  ],
  "refrigerator": [
    "e8-source-refrigerator"
  ],
  "refrigeration": [
    "e8-source-refrigeration"
  ],
  "fridge": [
    "e8-source-fridge"
  ],
  "fan": [
    "e8-source-fan"
  ],
  "hurdle": [
    "e8-source-hurdle"
  ],
  "fence": [
    "e8-source-fence"
  ],
  "pedal": [
    "e8-source-pedal"
  ],
  "shelf": [
    "e8-source-shelf"
  ],
  "ladder": [
    "e8-source-ladder"
  ],
  "lift": [
    "e8-source-lift"
  ],
  "drawer": [
    "e8-source-drawer"
  ],
  "raincoat": [
    "e8-source-raincoat"
  ],
  "can": [
    "e8-source-can"
  ],
  "metal": [
    "e8-source-metal"
  ],
  "iron": [
    "e8-source-iron"
  ],
  "lead": [
    "e8-source-lead"
  ],
  "brass": [
    "e8-source-brass"
  ],
  "cementer": [
    "e8-source-cementer"
  ],
  "lime": [
    "e8-source-lime"
  ],
  "plaster": [
    "e8-source-plaster"
  ],
  "leather": [
    "e8-source-leather"
  ],
  "plastic": [
    "e8-source-plastic"
  ],
  "fibre": [
    "e8-source-fibre"
  ],
  "fabric": [
    "e8-source-fabric"
  ],
  "cotton": [
    "e8-source-cotton"
  ],
  "nylon": [
    "e8-source-nylon"
  ],
  "wooden": [
    "e8-source-wooden"
  ],
  "mine": [
    "e8-source-mine"
  ],
  "lubricate": [
    "e8-source-lubricate"
  ],
  "diamond": [
    "e8-source-diamond"
  ],
  "crystal": [
    "e8-source-crystal"
  ],
  "counterfeit": [
    "e8-source-counterfeit"
  ],
  "style": [
    "e8-source-style"
  ],
  "stylish": [
    "e8-source-stylish"
  ],
  "tendency": [
    "e8-source-tendency"
  ],
  "popularity": [
    "e8-source-popularity"
  ],
  "vogue": [
    "e8-source-vogue"
  ],
  "prevalence": [
    "e8-source-prevalence"
  ],
  "prevailing": [
    "e8-source-prevailing"
  ],
  "model": [
    "e8-source-model"
  ],
  "icon": [
    "e8-source-icon"
  ],
  "idol": [
    "e8-source-idol"
  ],
  "jewellery": [
    "e8-source-jewellery"
  ],
  "jewel": [
    "e8-source-jewel"
  ],
  "jade": [
    "e8-source-jade"
  ],
  "embroider": [
    "e8-source-embroider"
  ],
  "hairdressing": [
    "e8-source-hairdressing"
  ],
  "masquerade": [
    "e8-source-masquerade"
  ],
  "veil": [
    "e8-source-veil"
  ],
  "costume": [
    "e8-source-costume"
  ],
  "cosplay": [
    "e8-source-cosplay"
  ],
  "decent": [
    "e8-source-decent"
  ],
  "indecent": [
    "e8-source-indecent"
  ],
  "exquisite": [
    "e8-source-exquisite"
  ],
  "grace": [
    "e8-source-grace"
  ],
  "elegance": [
    "e8-source-elegance"
  ],
  "elegant": [
    "e8-source-elegant"
  ],
  "appearance": [
    "e8-source-appearance"
  ],
  "cosmetics": [
    "e8-source-cosmetics"
  ],
  "charming": [
    "e8-source-charming"
  ],
  "handsome": [
    "e8-source-handsome"
  ],
  "clothing": [
    "e8-source-clothing"
  ],
  "uniform": [
    "e8-source-uniform"
  ],
  "laundry": [
    "e8-source-laundry"
  ],
  "wardrobe": [
    "e8-source-wardrobe"
  ],
  "overcoat": [
    "e8-source-overcoat"
  ],
  "robe": [
    "e8-source-robe"
  ],
  "gown": [
    "e8-source-gown"
  ],
  "sweater": [
    "e8-source-sweater"
  ],
  "jacket": [
    "e8-source-jacket"
  ],
  "jeans": [
    "e8-source-jeans"
  ],
  "trousers": [
    "e8-source-trousers"
  ],
  "clasp": [
    "e8-source-clasp"
  ],
  "unbutton": [
    "e8-source-unbutton"
  ],
  "glove": [
    "e8-source-glove"
  ],
  "brim": [
    "e8-source-brim"
  ],
  "scarf": [
    "e8-source-scarf"
  ],
  "handkerchief": [
    "e8-source-handkerchief"
  ],
  "purse": [
    "e8-source-purse"
  ],
  "wallet": [
    "e8-source-wallet"
  ],
  "vest": [
    "e8-source-vest"
  ],
  "sleeve": [
    "e8-source-sleeve"
  ],
  "sock": [
    "e8-source-sock"
  ],
  "stocking": [
    "e8-source-stocking"
  ],
  "slipper": [
    "e8-source-slipper"
  ],
  "lace": [
    "e8-source-lace"
  ],
  "tailor": [
    "e8-source-tailor"
  ],
  "sew": [
    "e8-source-sew"
  ],
  "stitch": [
    "e8-source-stitch"
  ],
  "needle": [
    "e8-source-needle"
  ],
  "pin": [
    "e8-source-pin"
  ],
  "strap": [
    "e8-source-strap"
  ],
  "stripe": [
    "e8-source-stripe"
  ],
  "bracelet": [
    "e8-source-bracelet"
  ],
  "woollen": [
    "e8-source-woollen"
  ],
  "patchwork": [
    "e8-source-patchwork"
  ],
  "shabby": [
    "e8-source-shabby"
  ],
  "tight": [
    "e8-source-tight"
  ],
  "whitewash": [
    "e8-source-whitewash"
  ],
  "brown": [
    "e8-source-brown"
  ],
  "purple": [
    "e8-source-purple"
  ],
  "blot": [
    "e8-source-blot"
  ],
  "figure": [
    "e8-source-figure"
  ],
  "curvy": [
    "e8-source-curvy"
  ],
  "hourglass": [
    "e8-source-hourglass"
  ],
  "slight": [
    "e8-source-slight"
  ],
  "slim": [
    "e8-source-slim"
  ],
  "thready": [
    "e8-source-thready"
  ],
  "stringy": [
    "e8-source-stringy"
  ],
  "diet": [
    "e8-source-diet"
  ],
  "dietary": [
    "e8-source-dietary"
  ],
  "treat": [
    "e8-source-treat"
  ],
  "treatment": [
    "e8-source-treatment"
  ],
  "cater": [
    "e8-source-cater"
  ],
  "drinkable": [
    "e8-source-drinkable"
  ],
  "refectory": [
    "e8-source-refectory"
  ],
  "cafeteria": [
    "e8-source-cafeteria"
  ],
  "buffet": [
    "e8-source-buffet"
  ],
  "barbecue": [
    "e8-source-barbecue"
  ],
  "supper": [
    "e8-source-supper"
  ],
  "refreshment": [
    "e8-source-refreshment"
  ],
  "snack": [
    "e8-source-snack"
  ],
  "appetiser": [
    "e8-source-appetiser"
  ],
  "cuisine": [
    "e8-source-cuisine"
  ],
  "menu": [
    "e8-source-menu"
  ],
  "order": [
    "e8-source-order"
  ],
  "takeaway": [
    "e8-source-takeaway"
  ],
  "gourmet": [
    "e8-source-gourmet"
  ],
  "vegetarian": [
    "e8-source-vegetarian"
  ],
  "cutlery": [
    "e8-source-cutlery"
  ],
  "silver": [
    "e8-source-silver"
  ],
  "saucer": [
    "e8-source-saucer"
  ],
  "fork": [
    "e8-source-fork"
  ],
  "spoon": [
    "e8-source-spoon"
  ],
  "spoonful": [
    "e8-source-spoonful"
  ],
  "kettle": [
    "e8-source-kettle"
  ],
  "pan": [
    "e8-source-pan"
  ],
  "lid": [
    "e8-source-lid"
  ],
  "alcoholic beverage": [
    "e8-source-alcoholic beverage"
  ],
  "alcoholic": [
    "e8-source-alcoholic"
  ],
  "liquor": [
    "e8-source-liquor"
  ],
  "whisky": [
    "e8-source-whisky"
  ],
  "brandy": [
    "e8-source-brandy"
  ],
  "tobacco": [
    "e8-source-tobacco"
  ],
  "cigar": [
    "e8-source-cigar"
  ],
  "sober": [
    "e8-source-sober"
  ],
  "cucumber": [
    "e8-source-cucumber"
  ],
  "onion": [
    "e8-source-onion"
  ],
  "mushroom": [
    "e8-source-mushroom"
  ],
  "eggplant": [
    "e8-source-eggplant"
  ],
  "turnip": [
    "e8-source-turnip"
  ],
  "radish": [
    "e8-source-radish"
  ],
  "hull": [
    "e8-source-hull"
  ],
  "cherry": [
    "e8-source-cherry"
  ],
  "strawberry": [
    "e8-source-strawberry"
  ],
  "blueberry": [
    "e8-source-blueberry"
  ],
  "grape": [
    "e8-source-grape"
  ],
  "papaya": [
    "e8-source-papaya"
  ],
  "melon": [
    "e8-source-melon"
  ],
  "lemon": [
    "e8-source-lemon"
  ],
  "lemonade": [
    "e8-source-lemonade"
  ],
  "kiwi": [
    "e8-source-kiwi"
  ],
  "crop": [
    "e8-source-crop"
  ],
  "corn": [
    "e8-source-corn"
  ],
  "popcorn": [
    "e8-source-popcorn"
  ],
  "wheat": [
    "e8-source-wheat"
  ],
  "flour": [
    "e8-source-flour"
  ],
  "porridge": [
    "e8-source-porridge"
  ],
  "turkey": [
    "e8-source-turkey"
  ],
  "beefy": [
    "e8-source-beefy"
  ],
  "pork": [
    "e8-source-pork"
  ],
  "mutton": [
    "e8-source-mutton"
  ],
  "sausage": [
    "e8-source-sausage"
  ],
  "an odd fish": [
    "e8-source-an odd fish"
  ],
  "pond": [
    "e8-source-pond"
  ],
  "rod": [
    "e8-source-rod"
  ],
  "dairy": [
    "e8-source-dairy"
  ],
  "boiling": [
    "e8-source-boiling"
  ],
  "yogurt": [
    "e8-source-yogurt"
  ],
  "creamy": [
    "e8-source-creamy"
  ],
  "pudding": [
    "e8-source-pudding"
  ],
  "sandwich": [
    "e8-source-sandwich"
  ],
  "loaf": [
    "e8-source-loaf"
  ],
  "pasta": [
    "e8-source-pasta"
  ],
  "jam": [
    "e8-source-jam"
  ],
  "vanilla": [
    "e8-source-vanilla"
  ],
  "wasabi": [
    "e8-source-wasabi"
  ],
  "pepper": [
    "e8-source-pepper"
  ],
  "ginger": [
    "e8-source-ginger"
  ],
  "garlic": [
    "e8-source-garlic"
  ],
  "scallion": [
    "e8-source-scallion"
  ],
  "vinegar": [
    "e8-source-vinegar"
  ],
  "salty": [
    "e8-source-salty"
  ],
  "flavour": [
    "e8-source-flavour"
  ],
  "sour": [
    "e8-source-sour"
  ],
  "sweeten": [
    "e8-source-sweeten"
  ],
  "spicy": [
    "e8-source-spicy"
  ],
  "delicious": [
    "e8-source-delicious"
  ],
  "tasty": [
    "e8-source-tasty"
  ],
  "hunger": [
    "e8-source-hunger"
  ],
  "sauce": [
    "e8-source-sauce"
  ],
  "soy sauce": [
    "e8-source-soy sauce"
  ],
  "ketchup": [
    "e8-source-ketchup"
  ],
  "perfume": [
    "e8-source-perfume"
  ],
  "digestion": [
    "e8-source-digestion"
  ],
  "cooker": [
    "e8-source-cooker"
  ],
  "baker": [
    "e8-source-baker"
  ],
  "fry": [
    "e8-source-fry"
  ],
  "toast": [
    "e8-source-toast"
  ],
  "toaster": [
    "e8-source-toaster"
  ],
  "lick": [
    "e8-source-lick"
  ],
  "dip": [
    "e8-source-dip"
  ],
  "dice": [
    "e8-source-dice"
  ],
  "shred": [
    "e8-source-shred"
  ],
  "deep-fry": [
    "e8-source-deep-fry"
  ],
  "steam": [
    "e8-source-steam"
  ],
  "shell": [
    "e8-source-shell"
  ],
  "mash": [
    "e8-source-mash"
  ],
  "erection": [
    "e8-source-erection"
  ],
  "structure": [
    "e8-source-structure"
  ],
  "construct": [
    "e8-source-construct"
  ],
  "established": [
    "e8-source-established"
  ],
  "founder": [
    "e8-source-founder"
  ],
  "concretely": [
    "e8-source-concretely"
  ],
  "steel": [
    "e8-source-steel"
  ],
  "stability": [
    "e8-source-stability"
  ],
  "site": [
    "e8-source-site"
  ],
  "venue": [
    "e8-source-venue"
  ],
  "situated": [
    "e8-source-situated"
  ],
  "locate": [
    "e8-source-locate"
  ],
  "settle": [
    "e8-source-settle"
  ],
  "dwelling": [
    "e8-source-dwelling"
  ],
  "mansion": [
    "e8-source-mansion"
  ],
  "lodge": [
    "e8-source-lodge"
  ],
  "hut": [
    "e8-source-hut"
  ],
  "cellar": [
    "e8-source-cellar"
  ],
  "cradle": [
    "e8-source-cradle"
  ],
  "shelter": [
    "e8-source-shelter"
  ],
  "porch": [
    "e8-source-porch"
  ],
  "stair": [
    "e8-source-stair"
  ],
  "staircase": [
    "e8-source-staircase"
  ],
  "storey": [
    "e8-source-storey"
  ],
  "layer": [
    "e8-source-layer"
  ],
  "elevator": [
    "e8-source-elevator"
  ],
  "escalator": [
    "e8-source-escalator"
  ],
  "handrail": [
    "e8-source-handrail"
  ],
  "laser": [
    "e8-source-laser"
  ],
  "vault": [
    "e8-source-vault"
  ],
  "vaulted": [
    "e8-source-vaulted"
  ],
  "arched": [
    "e8-source-arched"
  ],
  "eaves": [
    "e8-source-eaves"
  ],
  "chimney": [
    "e8-source-chimney"
  ],
  "reception": [
    "e8-source-reception"
  ],
  "lobby": [
    "e8-source-lobby"
  ],
  "lobbyist": [
    "e8-source-lobbyist"
  ],
  "parlour": [
    "e8-source-parlour"
  ],
  "fireplace": [
    "e8-source-fireplace"
  ],
  "lavatory": [
    "e8-source-lavatory"
  ],
  "toilet": [
    "e8-source-toilet"
  ],
  "bath": [
    "e8-source-bath"
  ],
  "bathe": [
    "e8-source-bathe"
  ],
  "booth": [
    "e8-source-booth"
  ],
  "casino": [
    "e8-source-casino"
  ],
  "studio": [
    "e8-source-studio"
  ],
  "downtown": [
    "e8-source-downtown"
  ],
  "urbanise": [
    "e8-source-urbanise"
  ],
  "urbanisation": [
    "e8-source-urbanisation"
  ],
  "peripheral": [
    "e8-source-peripheral"
  ],
  "periphery": [
    "e8-source-periphery"
  ],
  "spacious": [
    "e8-source-spacious"
  ],
  "airtight": [
    "e8-source-airtight"
  ],
  "plaza": [
    "e8-source-plaza"
  ],
  "brickwork": [
    "e8-source-brickwork"
  ],
  "suspension": [
    "e8-source-suspension"
  ],
  "hook": [
    "e8-source-hook"
  ],
  "lever": [
    "e8-source-lever"
  ],
  "scaffold": [
    "e8-source-scaffold"
  ],
  "maltreat": [
    "e8-source-maltreat"
  ],
  "maintenance": [
    "e8-source-maintenance"
  ],
  "fix": [
    "e8-source-fix"
  ],
  "mend": [
    "e8-source-mend"
  ],
  "weld": [
    "e8-source-weld"
  ],
  "saw": [
    "e8-source-saw"
  ],
  "screw": [
    "e8-source-screw"
  ],
  "drill": [
    "e8-source-drill"
  ],
  "viaduct": [
    "e8-source-viaduct"
  ],
  "span of life": [
    "e8-source-span of life"
  ],
  "furniture": [
    "e8-source-furniture"
  ],
  "placement": [
    "e8-source-placement"
  ],
  "design": [
    "e8-source-design"
  ],
  "entrance": [
    "e8-source-entrance"
  ],
  "entry": [
    "e8-source-entry"
  ],
  "enter": [
    "e8-source-enter"
  ],
  "exit": [
    "e8-source-exit"
  ],
  "outside": [
    "e8-source-outside"
  ],
  "outward": [
    "e8-source-outward"
  ],
  "inner": [
    "e8-source-inner"
  ],
  "inward": [
    "e8-source-inward"
  ],
  "aviation": [
    "e8-source-aviation"
  ],
  "safari": [
    "e8-source-safari"
  ],
  "haunt": [
    "e8-source-haunt"
  ],
  "attraction": [
    "e8-source-attraction"
  ],
  "attractive": [
    "e8-source-attractive"
  ],
  "monumental": [
    "e8-source-monumental"
  ],
  "pharaoh": [
    "e8-source-pharaoh"
  ],
  "traffic regulations": [
    "e8-source-traffic regulations",
    "e8-source-traffic regulations-2"
  ],
  "traffic jam": [
    "e8-source-traffic jam"
  ],
  "traffic congestion": [
    "e8-source-traffic congestion",
    "e8-source-traffic congestion-2"
  ],
  "aeroplane": [
    "e8-source-aeroplane"
  ],
  "helicopter": [
    "e8-source-helicopter"
  ],
  "jet": [
    "e8-source-jet"
  ],
  "parachute": [
    "e8-source-parachute"
  ],
  "pilot": [
    "e8-source-pilot"
  ],
  "baggage": [
    "e8-source-baggage"
  ],
  "luggage": [
    "e8-source-luggage"
  ],
  "suitcase": [
    "e8-source-suitcase"
  ],
  "carry-on": [
    "e8-source-carry-on"
  ],
  "rack": [
    "e8-source-rack"
  ],
  "freighter": [
    "e8-source-freighter"
  ],
  "itinerary": [
    "e8-source-itinerary"
  ],
  "passage": [
    "e8-source-passage"
  ],
  "intersection": [
    "e8-source-intersection"
  ],
  "lane": [
    "e8-source-lane"
  ],
  "avenue": [
    "e8-source-avenue"
  ],
  "curb": [
    "e8-source-curb"
  ],
  "signpost": [
    "e8-source-signpost"
  ],
  "pavement": [
    "e8-source-pavement"
  ],
  "vehicle": [
    "e8-source-vehicle"
  ],
  "auto": [
    "e8-source-auto"
  ],
  "express": [
    "e8-source-express"
  ],
  "tram": [
    "e8-source-tram"
  ],
  "truck": [
    "e8-source-truck"
  ],
  "lorry": [
    "e8-source-lorry"
  ],
  "van": [
    "e8-source-van"
  ],
  "carriage": [
    "e8-source-carriage"
  ],
  "tractor": [
    "e8-source-tractor"
  ],
  "pedicab": [
    "e8-source-pedicab"
  ],
  "cycle": [
    "e8-source-cycle"
  ],
  "garage": [
    "e8-source-garage"
  ],
  "vehicles": [
    "e8-source-vehicles"
  ],
  "wheel": [
    "e8-source-wheel"
  ],
  "tire": [
    "e8-source-tire"
  ],
  "honk": [
    "e8-source-honk"
  ],
  "steward": [
    "e8-source-steward"
  ],
  "stewardess": [
    "e8-source-stewardess"
  ],
  "disappear": [
    "e8-source-disappear"
  ],
  "hazard": [
    "e8-source-hazard"
  ],
  "hazardous": [
    "e8-source-hazardous"
  ],
  "harbour": [
    "e8-source-harbour"
  ],
  "dock": [
    "e8-source-dock"
  ],
  "sailor": [
    "e8-source-sailor"
  ],
  "seaman": [
    "e8-source-seaman"
  ],
  "steamer": [
    "e8-source-steamer"
  ],
  "liner": [
    "e8-source-liner"
  ],
  "ferry": [
    "e8-source-ferry"
  ],
  "sail": [
    "e8-source-sail"
  ],
  "deck": [
    "e8-source-deck"
  ],
  "propeller": [
    "e8-source-propeller"
  ],
  "stern": [
    "e8-source-stern"
  ],
  "embark": [
    "e8-source-embark"
  ],
  "railroad": [
    "e8-source-railroad"
  ],
  "railway": [
    "e8-source-railway"
  ],
  "locomotive": [
    "e8-source-locomotive"
  ],
  "subway": [
    "e8-source-subway"
  ],
  "underground": [
    "e8-source-underground"
  ],
  "rail": [
    "e8-source-rail"
  ],
  "delay": [
    "e8-source-delay"
  ],
  "postpone": [
    "e8-source-postpone"
  ],
  "lull": [
    "e8-source-lull"
  ],
  "due": [
    "e8-source-due"
  ],
  "postage": [
    "e8-source-postage"
  ],
  "post": [
    "e8-source-post"
  ],
  "stamp": [
    "e8-source-stamp"
  ],
  "package": [
    "e8-source-package"
  ],
  "pack": [
    "e8-source-pack"
  ],
  "parcel": [
    "e8-source-parcel"
  ],
  "load": [
    "e8-source-load"
  ],
  "unload": [
    "e8-source-unload"
  ],
  "transition": [
    "e8-source-transition"
  ],
  "deliver": [
    "e8-source-deliver"
  ],
  "republic": [
    "e8-source-republic"
  ],
  "republican": [
    "e8-source-republican"
  ],
  "marxism": [
    "e8-source-marxism"
  ],
  "socialism": [
    "e8-source-socialism"
  ],
  "socialist": [
    "e8-source-socialist"
  ],
  "communism": [
    "e8-source-communism"
  ],
  "communist": [
    "e8-source-communist"
  ],
  "government": [
    "e8-source-government"
  ],
  "authorise": [
    "e8-source-authorise"
  ],
  "political": [
    "e8-source-political"
  ],
  "policy": [
    "e8-source-policy"
  ],
  "politician": [
    "e8-source-politician"
  ],
  "democratise": [
    "e8-source-democratise"
  ],
  "bureaucracy": [
    "e8-source-bureaucracy"
  ],
  "bureaucratism": [
    "e8-source-bureaucratism",
    "e8-source-bureaucratism-2"
  ],
  "egalitarian": [
    "e8-source-egalitarian"
  ],
  "materialism": [
    "e8-source-materialism"
  ],
  "revolution": [
    "e8-source-revolution"
  ],
  "revolutionary": [
    "e8-source-revolutionary"
  ],
  "procession": [
    "e8-source-procession"
  ],
  "meltdown": [
    "e8-source-meltdown"
  ],
  "bilateral": [
    "e8-source-bilateral"
  ],
  "arena": [
    "e8-source-arena"
  ]
};
const corrections = {
  "plunge whole-heartedly": {
    "canonical": "plunge wholeheartedly into",
    "reason": "补全投入义所需的into，并采用wholeheartedly常见连写形式；保留原词库键。"
  },
  "span of life": {
    "canonical": "life span",
    "reason": "采用词典列出的常见词条life span；保留原词库短语键。"
  }
};
export const EXPANSION_EIGHT_NOTE_SOURCES = sources;
export const EXPANSION_EIGHT_SYNONYM_GROUPS = {};
export const EXPANSION_EIGHT_WORD_NOTES = {};
for (const [word, sense, note, en1, zh1, en2, zh2] of rows) {
  const groupId = `e8-usage-${word}`;
  EXPANSION_EIGHT_SYNONYM_GROUPS[groupId] = {
    words: [word], comparisonType: 'usage', sense: sense.replace(/\s*·\s*/g, ' · '), note,
    examples: [{ en: en1, zh: zh1,
      ...(['bachelor', 'master'].includes(word) ? { forms: [{
        word, form: `${word}'s`, sourceIds: [sourceIdsByWord[word][0]],
        review: { status: 'source-checked', checkedAt: '2026-10-24' },
      }] } : {}),
    }, { en: en2, zh: zh2 }],
    ...(corrections[word] ? { correction: corrections[word] } : {}),
    sourceIds: sourceIdsByWord[word],
    review: { status: 'source-checked', checkedAt: '2026-10-24' },
  };
  EXPANSION_EIGHT_WORD_NOTES[word] = { synonymGroup: groupId };
}
