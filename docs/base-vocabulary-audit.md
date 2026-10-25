# 后续复核状态（2026-10-25）

下文为首轮历史筛查报告，其 111 条线索现已分流为：73 条完成来源复核、1 条先前补齐词性、37 条退役后仅留历史兼容。最新修复、来源和验收见 `vocabulary-followup-73-2026-10-25.md`；这里的历史数量不代表当前仍缺失的字段数量。

# 基础词库首轮质量审计

审计批次：2026-10-24。

**范围：全库程序筛查 + 首轮高风险记录逐条复核，本轮由单一模型完成。没有完成全库逐词或独立语言专家审校，未命中规则不等于内容正确。**

- 已筛查：8699 个词条；已确认 33 条记录问题（33 个不同词）；已修复 33 条，待处理 0 条。
- 自动待复核：111 条线索（111 个不同词），不能当作已确认错误，也不能与已复核问题数直接相加。
- 未登记重复 ID／词头：0；为保留历史 ID 而登记的同形词对 2；缺音标 104 条，缺词性 1 条；词头、释义及双语例句缺失数见 JSON。
- 带旧专业领域标签的释义：1027 条，仅作规模提示；标签本身不是错误。
- 首轮问题原文和 before 快照保留；下列 current 是当前词库。resolved 表示本地文本已修复，音频及部署验收见 `vocabulary-repair-2026-10-24.md`。审计脚本本身仍只写报告。

## 已确认问题分布

| 类别 | 记录数 |
| --- | ---: |
| 词头拼写 | 2 |
| 释义／例句义项错配 | 14 |
| 异常释义 | 1 |
| 专名混淆 | 1 |
| 事实笔误 | 1 |
| 使用语域缺失 | 1 |
| 英文例句截断 | 10 |
| 中文译文错误 | 3 |

## 已确认问题清单

这里确认的是当前记录存在的拼写、语境、缺项或译文问题；不据此宣布所有旧义项不存在。修复状态以本地词库与 after 快照比对为准，不代表已部署上线。词条引用用于义项／拼写核对；截断和译文判断依据本地双语文本，不表示词典逐句审校了这些例句。

### 1234 · sepectator · P1 · 词头拼写

- 状态：resolved；当前词头：spectator
- 修复前释义：观众；旁观者
- 当前释义：观众；旁观者
- 当前英文：The spectators cheered loudly at the end of the game.
- 当前中文：比赛结束时观众大声欢呼。
- 问题：词头错拼；原例句实际使用 spectators。
- 建议：核对为 spectator，保持原 ID；同步处理词头音频及检索兼容。
- 参考：[Cambridge · spectator](https://dictionary.cambridge.org/dictionary/english/spectator?topic=audiences-and-spectators)；[Merriam-Webster · spectator（两种重音均收录）](https://www.merriam-webster.com/dictionary/spectator)；[剑桥词典 · spectator](https://dictionary.cambridge.org/dictionary/english/spectator)

### 3318 · precauition · P1 · 词头拼写

- 状态：resolved；当前词头：precaution
- 修复前释义：预防措施/谨慎
- 当前释义：预防措施/谨慎
- 当前英文：As a precaution, we backed up all the files.
- 当前中文：作为预防措施，我们备份了所有文件。
- 问题：词头错拼；原例句实际使用 precaution。
- 建议：核对为 precaution，保持原 ID；同步处理词头音频及检索兼容。
- 参考：[Merriam-Webster · precaution](https://www.merriam-webster.com/dictionary/precaution)

### 5955 · robert · P1 · 释义／例句义项错配

- 状态：resolved；当前词头：robert
- 修复前释义：警察
- 当前释义：n. 罗伯特（人名，写作 Robert）
- 当前英文：Robert worked as a police officer in the city centre for more than twenty years.
- 当前中文：罗伯特在市中心做了二十多年的警察。
- 问题：例句中 Robert 是人名，当前释义只显示“警察”。
- 建议：补充人名义并区分旧义；不把例句职业等同于姓名词义。
- 参考：[Oxford · robert](https://www.oxfordlearnersdictionaries.com/definition/english/robert)

### 6365 · sam · P1 · 释义／例句义项错配

- 状态：resolved；当前词头：sam
- 修复前释义：安全性帐户管理器
- 当前释义：n. 萨姆（人名，写作 Sam；Samuel 或 Samantha 的简称）
- 当前英文：Sam has been learning to play the drums in his garage and is getting better every week.
- 当前中文：萨姆一直在车库里学打鼓每周都在进步。
- 问题：当前释义是计算机缩写，例句是人名 Sam；现有提示又选择军用缩写义。
- 建议：统一本条教学义项；补充人名义并明确 SAM 与 Sam 的大小写区别。
- 参考：[Oxford · sam](https://www.oxfordlearnersdictionaries.com/definition/english/sam)

### 6807 · catherine · P1 · 释义／例句义项错配

- 状态：resolved；当前词头：catherine
- 修复前释义：n. 轮圈外缘装有倒钩的车轮, 侧翻筋斗, 轮转烟火, 车轮窗
- 当前释义：n. 凯瑟琳（女子名，写作 Catherine）
- 当前英文：Catherine spent two years teaching English at a small school deep in the mountains of northern Thailand.
- 当前中文：凯瑟琳花了两年时间在泰国北部深山的一所小学校教英语。
- 问题：例句是人名 Catherine，释义却为车轮、筋斗或烟火等物品／动作。
- 建议：补充人名义，逐项核对其他义项是否属于完整复合词。
- 参考：[Oxford · catherine](https://www.oxfordlearnersdictionaries.com/definition/english/catherine)

### 7085 · ali · P1 · 释义／例句义项错配

- 状态：resolved；当前词头：ali
- 修复前释义：异步线路接口
- 当前释义：n. 阿里（人名或姓氏，写作 Ali）
- 当前英文：Ali opened a small restaurant serving dishes from his homeland and it became the talk of the town.
- 当前中文：阿里开了一家供应家乡菜肴的小餐馆很快成为镇上的话题。
- 问题：例句是人名 Ali，当前释义仅为“异步线路接口”。
- 建议：补充人名义，并将技术缩写另作明确范围说明。
- 参考：[Dictionary.com · ali](https://www.dictionary.com/browse/ali)

### 6509 · oliver · P1 · 释义／例句义项错配

- 状态：resolved；当前词头：oliver
- 修复前释义：n. 脚踏铁锤
- 当前释义：n. 奥利弗（男子名，写作 Oliver）
- 当前英文：Oliver spent his gap year working on organic farms across Europe and learning about sustainable living.
- 当前中文：奥利弗用间隔年在欧洲各地的有机农场工作并学习可持续生活。
- 问题：例句是人名 Oliver，当前释义只有“脚踏铁锤”。
- 建议：补充人名义，旧技术义核验后单独标注。
- 参考：[Oxford · oliver](https://www.oxfordlearnersdictionaries.com/definition/english/oliver)

### 7193 · tommy · P1 · 释义／例句义项错配

- 状态：resolved；当前词头：tommy
- 修复前释义：n. 配给面包, 实物工资制\n[经] 实物工资制
- 当前释义：n. 汤米（男子名，写作 Tommy，Thomas 的昵称）；[旧时非正式用语] 英国士兵
- 当前英文：Tommy learned to fish from his grandfather and now spends every Sunday morning by the quiet river.
- 当前中文：汤米从爷爷那里学会了钓鱼，现在每个星期天早上都在安静的河边度过。
- 问题：例句是人名 Tommy，当前释义是配给面包／实物工资制；译文还新增原文没有的“和儿子”。
- 建议：补充人名义，另核对旧义；删除未经英文支持的译文细节。
- 参考：[Oxford · tommy](https://www.oxfordlearnersdictionaries.com/definition/english/tommy)

### 7047 · somerset · P1 · 释义／例句义项错配

- 状态：resolved；当前词头：somerset
- 修复前释义：n. 有衬垫的马鞍（独腿者乘坐的）
- 当前释义：n. 萨默塞特郡（英格兰西南部的郡，写作 Somerset）
- 当前英文：They drove through Somerset and stopped beside a quiet winding river for a lovely picnic.
- 当前中文：他们开车穿过萨默塞特在一条安静的蜿蜒河边停下来愉快野餐。
- 问题：例句中的 Somerset 是地名，当前释义只有一种马鞍。
- 建议：补充地名义，历史物品义不要套入当前例句。
- 参考：[Oxford · somerset](https://www.oxfordlearnersdictionaries.com/definition/english/somerset)；[剑桥词典 · somerset](https://dictionary.cambridge.org/dictionary/english/somerset)

### 7103 · sara · P1 · 释义／例句义项错配

- 状态：resolved；当前词头：sara
- 修复前释义：n. 萨拉族, 萨拉人
- 当前释义：n. 萨拉（女子名，写作 Sara，是 Sarah 的另一种拼写）；[族群名称] 萨拉人
- 当前英文：Sara spent a year in a remote African village helping to dig wells and teach children hygiene.
- 当前中文：萨拉在非洲一个偏远村庄生活了一年帮助打井和教孩子们卫生知识。
- 问题：例句中的 Sara 是个人姓名，当前释义为族群名称。
- 建议：补充人名义，保留族群义时明确适用语境。
- 参考：[Dictionary.com · sara](https://www.dictionary.com/browse/sara)

### 6413 · charlie · P1 · 释义／例句义项错配

- 状态：resolved；当前词头：charlie
- 修复前释义：n. 通讯中用以代表字母C的词
- 当前释义：n. 查理（人名，写作 Charlie，是 Charles 的昵称）；[通信] 字母 C 的代码词
- 当前英文：Charlie has been working as a firefighter at the central station for over fifteen years now.
- 当前中文：查理在中央消防站做了超过十五年的消防员。
- 问题：例句中的 Charlie 是人名，当前释义只解释通信字母 C。
- 建议：补充人名义，区分姓名与通信字母代码。
- 参考：[Oxford · charles](https://www.oxfordlearnersdictionaries.com/definition/english/charles)；[剑桥词典 · charlie](https://dictionary.cambridge.org/dictionary/english/charlie)

### 7060 · les · P1 · 释义／例句义项错配

- 状态：resolved；当前词头：les
- 修复前释义：abbr. 发射脱离系统（Launch Escape System）
- 当前释义：n. 莱斯（男子名，写作 Les，是 Leslie 的简称）
- 当前英文：Les spent his retirement years tending a small vegetable patch and reading detective novels in his sunny conservatory.
- 当前中文：莱斯退休后照料一小块菜地，并在阳光充足的暖房里读侦探小说。
- 问题：例句是人名 Les，释义只解释 Launch Escape System。
- 建议：补充人名义并区分 Les 与 LES。
- 参考：[Oxford · les](https://www.oxfordlearnersdictionaries.com/definition/english/les)

### 7063 · ron · P1 · 释义／例句义项错配

- 状态：resolved；当前词头：ron
- 修复前释义：abbr. 研究法辛烷值（Research Octane Number）
- 当前释义：n. 罗恩（男子名，写作 Ron，是 Ronald 的简称）
- 当前英文：Ron has worked as a mechanic at the corner garage for more than thirty years now.
- 当前中文：罗恩在街角那家车库做机修工已经三十多年了。
- 问题：例句是人名 Ron，释义只解释 Research Octane Number。
- 建议：补充人名义并区分 Ron 与 RON。
- 参考：[Oxford · ron](https://www.oxfordlearnersdictionaries.com/definition/english/ron)

### 6971 · spencer · P1 · 释义／例句义项错配

- 状态：resolved；当前词头：spencer
- 修复前释义：n. 针织短外衣, 斜桁纵帆
- 当前释义：n. 斯宾塞（人名或姓氏，写作 Spencer）；[服饰] 短外衣；[航海] 斜桁纵帆
- 当前英文：Spencer wrote a detailed history of the small village where he was born and raised during his retirement.
- 当前中文：斯宾塞退休后撰写了一部关于他出生和长大的那个小村庄的详细历史。
- 问题：例句中 Spencer 是写作者姓名，释义只解释外衣与帆。
- 建议：补充姓名义，普通名词义按范围保留。
- 参考：[Dictionary.com · spencer](https://www.dictionary.com/browse/spencer)；[Dictionary.com · spencer](https://www.collinsdictionary.com/dictionary/english/spencer)

### 6771 · hughes · P1 · 异常释义

- 状态：resolved；当前词头：hughes
- 修复前释义：体斯
- 当前释义：n. 休斯（姓氏，写作 Hughes）
- 当前英文：Ms Hughes pioneered a new approach to teaching reading that has since been adopted by schools nationwide.
- 当前中文：休斯女士首创了一种阅读教学方法，此后被全国各地的学校采用。
- 问题：释义仅为“体斯”，没有可理解的词义或姓氏说明，例句使用 Ms Hughes。
- 建议：核对姓氏说明与译名；不能把疑似乱码作为教学释义。
- 参考：[Dictionary.com · hughes](https://www.dictionary.com/browse/hughes)；[Dictionary.com · hughes](https://www.collinsdictionary.com/dictionary/english/hughes)

### 7186 · phillips · P1 · 专名混淆

- 状态：resolved；当前词头：phillips
- 修复前释义：n. 飞利浦（电子产业集团）；菲利普斯（姓氏）
- 当前释义：n. 菲利普斯（姓氏，写作 Phillips；不同于品牌 Philips）
- 当前英文：Mr Phillips has been teaching music at the secondary school for so long that he taught three generations.
- 当前中文：菲利普斯先生在那所中学教音乐已有很长时间，教过三代学生。
- 问题：释义把 Phillips 与电子企业 Philips 混为一项；当前例句是 Phillips 姓氏。
- 建议：保留姓氏义，核对并移除误归入本拼写的品牌义。
- 参考：[Dictionary.com · phillips](https://www.dictionary.com/browse/phillips)；[Philips 官方品牌拼写](https://www.philips.com/a-w/about.html)；[Dictionary.com · phillips](https://www.collinsdictionary.com/dictionary/english/phillips)

### 6841 · freud · P1 · 事实笔误

- 状态：resolved；当前词头：freud
- 修复前释义：n. 佛洛伊德（856-1939, 奥地利心理分析学家及精神病学家）
- 当前释义：n. 弗洛伊德（Sigmund Freud，1856—1939，精神分析创始人）
- 当前英文：The students studied Freud in psychology class and debated his theories for nearly two hours straight.
- 当前中文：学生们在心理学课上学习了弗洛伊德并连续辩论他的理论将近两个小时。
- 问题：释义中的出生年为 856；公开词条为 Sigmund Freud 1856–1939。
- 建议：补齐年份缺失的首位数字，并核对中文人物说明。
- 参考：[Freud Museum · Who was Sigmund Freud?](https://www.freud.org.uk/schools/resources/who-was-sigmund-freud/)；[Dictionary.com · freud](https://www.dictionary.com/browse/freud)

### 8164 · negro · P1 · 使用语域缺失

- 状态：resolved；当前词头：negro
- 修复前释义：n. 黑人\na. 黑人的
- 当前释义：n. 对黑人的旧称；adj. 黑人的（均已过时且具有冒犯性，仅用于理解历史引文或讨论这个词，不宜用来称呼他人）
- 当前英文：The guide explained why the word Negro in the old document is offensive today.
- 当前中文：讲解员解释了为什么旧文件中的 Negro 一词在今天具有冒犯性。
- 问题：基础释义和例句缺少现代冒犯性／历史语境标记；已有学习提示虽说明，基础卡片仍直接展示旧称。
- 建议：明确过时且冒犯的使用范围，改为词语讨论或历史引述例句。
- 参考：[Cambridge · Negro（语域）](https://dictionary.cambridge.org/us/dictionary/english/negro)；[剑桥词典 · negro](https://dictionary.cambridge.org/dictionary/english/negro)

### 7763 · headline · P1 · 英文例句截断

- 状态：resolved；当前词头：headline
- 修复前释义：n. 大标题, 新闻摘要\nvt. 为...做标题, 写标题
- 当前释义：n. 大标题, 新闻摘要\nvt. 为...做标题, 写标题
- 当前英文：The headline announced the opening of a new public library.
- 当前中文：这条标题宣布了一家新公共图书馆的开馆消息。
- 问题：英文以 after six long 结束，缺少中心名词；中文却补出了“六年”。
- 建议：依据核验后的完整英文重写双语例句，并重新生成对应例句音频。
- 参考：[韦氏词典 · headline](https://www.merriam-webster.com/dictionary/headline)

### 7921 · telegraph · P1 · 英文例句截断

- 状态：resolved；当前词头：telegraph
- 修复前释义：n. 电报, 电报机\nvi. 打电报\nvt. 打电报给, 电汇, 流露, 显示出要...的样子
- 当前释义：n. 电报, 电报机\nvi. 打电报\nvt. 打电报给, 电汇, 流露, 显示出要...的样子
- 当前英文：The station manager sent an urgent message by telegraph.
- 当前中文：站长用电报发出了一条紧急消息。
- 问题：英文以 within just a few short 结束，缺少时间单位。
- 建议：重写完整双语例句，不能只凭现有中文猜填英文；同步例句音频。
- 参考：[韦氏词典 · telegraph](https://www.merriam-webster.com/dictionary/telegraph)

### 7943 · hatred · P1 · 英文例句截断

- 状态：resolved；当前词头：hatred
- 修复前释义：n. 憎恨, 仇恨, 憎恶\n[法] 敌意, 憎恨, 憎恶
- 当前释义：n. 憎恨, 仇恨, 憎恶\n[法] 敌意, 憎恨, 憎恶
- 当前英文：Their hatred grew after years of bitter arguments.
- 当前中文：多年的激烈争吵加深了他们的仇恨。
- 问题：英文以 deeper than 结束，当前独立例句缺比较对象或从句。
- 建议：补成自然完整的比较结构，重新核对译文及音频。
- 参考：[韦氏词典 · hatred](https://www.merriam-webster.com/dictionary/hatred)

### 8015 · grandson · P1 · 英文例句截断

- 状态：resolved；当前词头：grandson
- 修复前释义：n. 孙子, 外孙
- 当前释义：n. 孙子, 外孙
- 当前英文：Her grandson helped her bake biscuits on Sunday afternoon.
- 当前中文：星期天下午，她的孙子帮她烤饼干。
- 问题：英文以 kitchen of her old 结束，缺少 old 修饰的中心名词。
- 建议：重写完整英文并使中文与之对应；同步例句音频。
- 参考：[韦氏词典 · grandson](https://www.merriam-webster.com/dictionary/grandson)

### 8034 · harden · P1 · 英文例句截断

- 状态：resolved；当前词头：harden
- 修复前释义：vt. 使变硬, 使坚强, 使冷酷\nvi. 变硬, 变冷酷
- 当前释义：vt. 使变硬, 使坚强, 使冷酷\nvi. 变硬, 变冷酷
- 当前英文：Leave the mixture in the fridge to harden overnight.
- 当前中文：把混合物放在冰箱里过夜，使它变硬。
- 问题：英文以 with a beautiful 结束，缺少名词；中文额外补出釉面细节。
- 建议：重写双语例句并核对新增细节；同步例句音频。
- 参考：[韦氏词典 · harden](https://www.merriam-webster.com/dictionary/harden)

### 8053 · midday · P1 · 英文例句截断

- 状态：resolved；当前词头：midday
- 修复前释义：n. 正午, 中午\na. 正午的
- 当前释义：n. 正午, 中午\na. 正午的
- 当前英文：We stopped beside the river for lunch at midday.
- 当前中文：中午，我们在河边停下来吃午饭。
- 问题：英文以 shade of a large 结束，缺少名词；中文补出了柳树。
- 建议：重写完整例句并核对译文；同步例句音频。
- 参考：[韦氏词典 · midday](https://www.merriam-webster.com/dictionary/midday)

### 8213 · jean · P1 · 英文例句截断

- 状态：resolved；当前词头：jean
- 修复前释义：n. 牛仔裤, 牛仔布, 斜纹棉布
- 当前释义：n. 斜纹棉布；牛仔裤（裤子义通常用复数 jeans 或 a pair of jeans）
- 当前英文：She put on her favourite jeans before going out for a walk.
- 当前中文：她穿上最喜欢的牛仔裤，然后出门散步。
- 问题：英文以 into the chilly 结束，缺少名词；中文补出了秋晨散步。
- 建议：重写完整例句，另核对 jean 布料义和 jeans 裤子义；同步例句音频。
- 参考：[Merriam-Webster · jean](https://www.merriam-webster.com/dictionary/jean)；[牛津学习词典 · jeans](https://www.oxfordlearnersdictionaries.com/definition/english/jeans)

### 8388 · scrutiny · P1 · 英文例句截断

- 状态：resolved；当前词头：scrutiny
- 修复前释义：n. 细看, 仔细检查, 监视, 选票检查\n[经] 复查, 评核, 仔细检查
- 当前释义：n. 细看, 仔细检查, 监视, 选票检查\n[经] 复查, 评核, 仔细检查
- 当前英文：The committee placed every item in the budget under close scrutiny.
- 当前中文：委员会仔细审查了预算中的每一项。
- 问题：英文以 about several large 结束，缺少名词；中文却补出旅行报销。
- 建议：重写双语例句，不能把译文补写视为英文完整；同步例句音频。
- 参考：[韦氏词典 · scrutiny](https://www.merriam-webster.com/dictionary/scrutiny)

### 8456 · bulletin · P1 · 英文例句截断

- 状态：resolved；当前词头：bulletin
- 修复前释义：n. 公告, 布告, 公报\n[电] 电子布告栏
- 当前释义：n. 公告, 布告, 公报\n[电] 电子布告栏
- 当前英文：The evening news bulletin reported delays on the main railway line.
- 当前中文：晚间新闻简报报道了铁路干线上的延误。
- 问题：英文以 after six long 结束，缺少时间名词。
- 建议：重写完整双语例句；同步例句音频。
- 参考：[牛津学习词典 · bulletin](https://www.oxfordlearnersdictionaries.com/definition/english/bulletin)

### 8294 · commonwealth · P1 · 英文例句截断

- 状态：resolved；当前词头：commonwealth
- 修复前释义：n. 共和国；联邦；国民整体
- 当前释义：n. 英联邦（写作 the Commonwealth）；联邦；共和国；国民整体
- 当前英文：Students from several Commonwealth countries attended the summer course.
- 当前中文：来自几个英联邦国家的学生参加了这门暑期课程。
- 问题：英文以 most of which were once part 结束，未说明 part of 什么；中文补出了大英帝国。
- 建议：重写完整例句；涉及成员数量时另核验时效，或避免动态数字；同步音频。
- 参考：[牛津学习词典 · commonwealth](https://www.oxfordlearnersdictionaries.com/definition/english/commonwealth)

### 6354 · ben · P1 · 中文译文错误

- 状态：resolved；当前词头：ben
- 修复前释义：n. 内室\n[医] 贝昂(俗名,一般指辣木Moringa oleifera,有时也指一些不同属的植物)
- 当前释义：n. [苏格兰用语] 山峰，常用于山名，如 Ben Nevis
- 当前英文：They were climbing the ben.
- 当前中文：他们当时正在攀登那座山峰。
- 问题：例句语境是爬山，中文“正在爬本”把名词机械音译；基础释义也未提供当前山峰义。
- 建议：补充相应山峰用法并重译，不把地形词直接译为“本”。
- 参考：[Dictionaries of the Scots Language · ben n3](https://dsl.ac.uk/entry/snd/ben_n3)；[剑桥词典 · ben](https://dictionary.cambridge.org/dictionary/english/ben)

### 6433 · closer · P1 · 中文译文错误

- 状态：resolved；当前词头：closer
- 修复前释义：n. 关闭者, 闭合器, 关闭器
- 当前释义：n. 负责关门或收尾的人；关闭器；[棒球] 终结投手
- 当前英文：Whoever is the closer has to turn out the lights and lock up.
- 当前中文：无论谁负责关门收尾，都必须关灯并锁好门。
- 问题：原句的 the closer 是负责关门收尾的人；译文“谁靠近”误作比较级。
- 建议：按当前岗位／收尾语境重译，核对 noun closer 的义项。
- 参考：[Merriam-Webster · closer](https://www.merriam-webster.com/dictionary/closer)；[剑桥词典 · closer](https://dictionary.cambridge.org/dictionary/english/closer)

### 6876 · passing · P1 · 中文译文错误

- 状态：resolved；当前词头：passing
- 修复前释义：n. 通过, 逝去, 死, 流逝\na. 经过的, 流逝的, 目前的, 短暂的, 及格的, 仓促的
- 当前释义：n. 通过；流逝；逝世；[体育] 传球；adj. 经过的；短暂的
- 当前英文：The coach sent in a passing play on third and long.
- 当前中文：在第三档进攻、距离取得新一轮首攻还差较远时，教练下达了传球战术。
- 问题：原句是美式橄榄球语境，译文“在第三长处送出传球”明显机械直译。
- 建议：专项核对 third and long 等术语后重译；不要因此把完整英文判为截断。
- 参考：[Atlanta Falcons · third-down distances](https://www.atlantafalcons.com/news/inside-tori-notebook-a-journey-through-a-tale-of-third-downs)；[牛津学习词典 · passing](https://www.oxfordlearnersdictionaries.com/definition/english/passing)

### 6782 · benjamin · P1 · 释义／例句义项错配

- 状态：resolved；当前词头：benjamin
- 修复前释义：安息香
- 当前释义：n. 本杰明（男子名，写作 Benjamin）
- 当前英文：Benjamin spent his gap year volunteering at an orphanage in a small village in the mountains of Kenya.
- 当前中文：本杰明用间隔年在肯尼亚山区一个小村庄的孤儿院做志愿者。
- 问题：例句中的 Benjamin 是个人姓名，释义仅给出“安息香”。
- 建议：补充人名义，其他旧义经来源核验后分开标明语境。
- 参考：[Oxford · benjamin](https://www.oxfordlearnersdictionaries.com/definition/english/benjamin)

### 6836 · johnny · P1 · 释义／例句义项错配

- 状态：resolved；当前词头：johnny
- 修复前释义：n. 男人, 家伙
- 当前释义：n. 约翰尼（男子名，写作 Johnny，是 John 的昵称）
- 当前英文：Johnny learned to fish from his grandfather and now spends every Sunday morning by the quiet lake.
- 当前中文：约翰尼从爷爷那里学会了钓鱼现在每个星期天早上都在安静的湖边度过。
- 问题：例句中的 Johnny 是个人姓名，释义仅给出“男人／家伙”。
- 建议：补充人名义，其他旧义经来源核验后分开标明语境。
- 参考：[Oxford · johnny](https://www.oxfordlearnersdictionaries.com/definition/english/johnny)

## 自动待复核线索

这些是筛查候选。特别是多义词、姓名、地名和缩写，不能仅凭提示选用了不同义项就改写基础释义。

| ID | 词条 | 规则 | 线索 |
| ---: | --- | --- | --- |
| 3849 | tame nature | missing_pos | 缺少 pos；需人工补核，不自动生成。 |
| 4322 | plunge whole-heartedly | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 4340 | take a bow | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 4347 | raw material | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 4544 | alcoholic beverage | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 4579 | an odd fish | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 4609 | soy sauce | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 4698 | span of life | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 4718 | traffic regulations | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 4719 | traffic jam | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 4720 | traffic congestion | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 4842 | establish a nation | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 5649 | others | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 5674 | including | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 5873 | sales | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 5896 | earlier | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 5900 | planning | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 5941 | states | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 5947 | works | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 5963 | terms | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 5986 | thomas | possible_sense_alignment | 原释义：n. 多马(耶稣十二门徒之一)；提示范围：专有名词 · 托马斯。两者不同不自动代表错误。 |
| 6009 | thanks | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6030 | inc | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6069 | corp | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6080 | significantly | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6088 | iii | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6125 | steve | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6127 | dec | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6147 | unix | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6148 | remaining | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6241 | ceo | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6246 | stairs | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6258 | online | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6260 | proposed | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6287 | oct | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6327 | thatcher | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6329 | dna | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6330 | nov | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6368 | neil | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6396 | feb | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6397 | aug | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6407 | politically | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6413 | charlie | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6438 | matthew | possible_sense_alignment | 原释义：n. 马太, 马太福音；提示范围：专有名词 · 马修。两者不同不自动代表错误。 |
| 6441 | depending | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6474 | nhs | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6480 | girlfriend | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6569 | expected | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6581 | traditionally | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6589 | clarke | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6600 | davies | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6601 | swindon | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6604 | estimated | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6634 | lords | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6636 | raf | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6642 | microsoft | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6658 | joan | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6661 | freshman | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6674 | ross | possible_sense_alignment | 原释义：n. 罗丝（女性名）；提示范围：专有名词 · 罗斯。两者不同不自动代表错误。 |
| 6680 | associated | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6682 | korea | possible_sense_alignment | 原释义：n. 朝鲜, 韩国；提示范围：专有名词 · 朝鲜半岛。两者不同不自动代表错误。 |
| 6717 | malcolm | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6736 | faster | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6739 | obliged | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6752 | geoffrey | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6764 | clark | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6770 | sexually | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6771 | hughes | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6774 | organiser | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6779 | liz | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6786 | ussr | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6787 | harriet | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6791 | gorbachev | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6793 | impressed | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6829 | kenneth | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6845 | hiv | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6846 | corbett | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6856 | workplace | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6879 | gop | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6880 | norwich | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6911 | takeover | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6924 | kinnock | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6926 | genuinely | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6931 | emerging | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6939 | closest | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6958 | bored | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 6985 | aberdeen | possible_sense_alignment | 原释义：n. 亚伯丁（英国苏格兰一郡 ）；苏格兰粗毛猎狐狗（等于Aberdeenterrier）；提示范围：专有名词 · 阿伯丁。两者不同不自动代表错误。 |
| 6991 | julie | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 7009 | importantly | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 7013 | privately | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 7016 | varying | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 7018 | routinely | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 7055 | counselling | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 7063 | ron | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 7070 | explicitly | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 7085 | ali | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 7090 | kim | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 7099 | eec | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 7105 | gabriel | possible_sense_alignment | 原释义：n. 加百利(<<经经>>中七大天使之一)；提示范围：专有名词 · 加布里埃尔。两者不同不自动代表错误。 |
| 7118 | website | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 7155 | lyrics | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 7180 | des | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 7186 | phillips | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 7459 | theatre | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 7720 | surprisingly | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 8175 | waggon | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 8267 | consistently | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 8367 | positively | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 8377 | ironically | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 8407 | predominantly | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |
| 8504 | consultancy | missing_phonetic | 缺少 phonetic；需人工补核，不自动生成。 |

## 已识别的误报与保留项

- **airline**：Which airline are you flying with? 是正常介词后置问句。
- **marshy**：difficult to build on 是自然介词后置，不是截断。
- **heal**：never managed to 可以省略已在上文出现的动词短语。
- **passing**：third and long 是专项术语语境；问题在中文，不是英文结尾。
- **hong**：原商行义与 trading hongs 例句相符，不因为存在 Hong Kong 地名就判错。
- **lewis**：原吊楔义与石块起吊例句一致；提示选人名义不代表基础词义错误。
- **surrey**：原马车义与 an old surrey 例句相符，不能因为提示选地名就强改。
- **dec**：当前例句 DEC 公司与释义相符，不能因为也可作月份缩写就判错。
- **lyric**：The lyrics are beautiful. 的形容词表语完整，不是截断。
- **thousand**：a thousand years old 是完整年龄结构。
- **henry**：six years old 是完整年龄结构；原释义也含人名义。
- **ruth**：原怜悯义与 with deep ruth 一致，虽语域少见，不能仅凭提示选人名就判错。
- **ulster**：原外套义与 wore a heavy ulster 一致，不能因为也有地名义就判错。
- **gary**：盖理／加里是译名差异，本轮不据此判为词义错误。
- **essex**：艾塞克斯／埃塞克斯是译名差异，本轮不据此判错。
- **swindon**：史云顿／斯温登是译名差异，本轮不据此判错。
- **norwich**：诺威奇／诺里奇是译名差异，本轮不据此判错。
- **churchill**：邱吉尔／丘吉尔是译名差异，本轮不据此判错。
- **sunderland**：森德兰／桑德兰等译名差异需按译名标准讨论，不自动判错。

## 后续修复顺序与兼容要求

1. 先处理两处错拼和明显义项错配，再修复截断例句、错误译文及语域标记。
2. 保留原 ID 和既有学习记录；词头更正应定义旧拼写兼容，并核对所有词库分片、提示键和分配目录。
3. 修改英文例句或词头后，核对静态音频 manifest／文本哈希，重新生成受影响音频并发布；不把文字修正当作音频已经更新。
4. 首轮 33 条问题的修复与验收见 `vocabulary-repair-2026-10-24.md`；其余自动候选仍待独立复核。

## 复现与验证

- 运行：`node scripts/audit-base-vocabulary.mjs`。逐条复核登记在 `data/vocabulary-audit-reviews.json`。
- 机器报告：`docs/base-vocabulary-audit.json`；候选与确认问题有不同状态字段。
- 输入 SHA-256：`3321bb9bc0164cd561bdf15ce472afeab08070b393c56d31c6899c3d1b9416e2`。脚本只写两份审计报告，并在完成后校验源词库未变。
- 本脚本不修改词库或运行程序；修复代码、音频、测试与发布状态另见修复交接。
