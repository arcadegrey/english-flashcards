import { PRACTICAL_NOTE_SOURCES, PRACTICAL_SYNONYM_GROUPS, PRACTICAL_WORD_NOTES } from './practicalWordNotes.js';
import { DAILY_NOTE_SOURCES, DAILY_SYNONYM_GROUPS, DAILY_WORD_FORMATIONS, DAILY_WORD_NOTES } from './dailyWordNotes.js';
import { EVERYDAY_NOTE_SOURCES, EVERYDAY_SYNONYM_GROUPS, EVERYDAY_WORD_NOTES } from './everydayWordNotes.js';
import { USAGE_NOTE_SOURCES, USAGE_SYNONYM_GROUPS, USAGE_WORD_NOTES } from './usageWordNotes.js';
import { EXPANSION_ONE_NOTE_SOURCES, EXPANSION_ONE_SYNONYM_GROUPS, EXPANSION_ONE_WORD_NOTES } from './expansionOneWordNotes.js';
import { EXPANSION_TWO_NOTE_SOURCES, EXPANSION_TWO_SYNONYM_GROUPS, EXPANSION_TWO_WORD_NOTES } from './expansionTwoWordNotes.js';
import { EXPANSION_THREE_NOTE_SOURCES, EXPANSION_THREE_SYNONYM_GROUPS, EXPANSION_THREE_WORD_NOTES } from './expansionThreeWordNotes.js';
import { EXPANSION_FOUR_NOTE_SOURCES, EXPANSION_FOUR_SYNONYM_GROUPS, EXPANSION_FOUR_WORD_NOTES } from './expansionFourWordNotes.js';
import { EXPANSION_FIVE_NOTE_SOURCES, EXPANSION_FIVE_SYNONYM_GROUPS, EXPANSION_FIVE_WORD_NOTES } from './expansionFiveWordNotes.js';
import { EXPANSION_SIX_NOTE_SOURCES, EXPANSION_SIX_SYNONYM_GROUPS, EXPANSION_SIX_WORD_NOTES } from './expansionSixWordNotes.js';
import { EXPANSION_SEVEN_NOTE_SOURCES, EXPANSION_SEVEN_SYNONYM_GROUPS, EXPANSION_SEVEN_WORD_NOTES } from './expansionSevenWordNotes.js';
import { EXPANSION_EIGHT_NOTE_SOURCES, EXPANSION_EIGHT_SYNONYM_GROUPS, EXPANSION_EIGHT_WORD_NOTES } from './expansionEightWordNotes.js';
import { EXPANSION_NINE_NOTE_SOURCES, EXPANSION_NINE_SYNONYM_GROUPS, EXPANSION_NINE_WORD_NOTES } from './expansionNineWordNotes.js';

// Original learning notes and examples; references verify facts, not imported dictionary text.
const PILOT_WORD_NOTE_SOURCES = {
  "forms-mw-begin": {
    "title": "韦氏词典 · begin（例句词形）",
    "url": "https://www.merriam-webster.com/dictionary/begin",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "forms-mw-teach": {
    "title": "韦氏词典 · teach（例句词形）",
    "url": "https://www.merriam-webster.com/dictionary/teach",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "forms-mw-instruct": {
    "title": "韦氏词典 · instruct（例句词形）",
    "url": "https://www.merriam-webster.com/dictionary/instruct",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "forms-mw-learn": {
    "title": "韦氏词典 · learn（例句词形）",
    "url": "https://www.merriam-webster.com/dictionary/learn",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "forms-mw-learner": {
    "title": "韦氏词典 · learner（例句词形）",
    "url": "https://www.merriam-webster.com/dictionary/learner",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "forms-mw-student": {
    "title": "韦氏词典 · student（例句词形）",
    "url": "https://www.merriam-webster.com/dictionary/student",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "forms-mw-worker": {
    "title": "韦氏词典 · worker（例句词形）",
    "url": "https://www.merriam-webster.com/dictionary/worker",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "forms-mw-buy": {
    "title": "韦氏词典 · buy（例句词形）",
    "url": "https://www.merriam-webster.com/dictionary/buy",
    "checkedAt": "2026-10-24",
    "use": "factual-reference"
  },
  "big-large": {
    "title": "BBC · Big / large",
    "url": "https://downloads.bbc.co.uk/learningenglish/lowerintermediate/unit13/u13_6min_vocab_similarwords.pdf",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "small-little": {
    "title": "剑桥 · Small / little",
    "url": "https://dictionary.cambridge.org/thesaurus/articles/not-great-in-size-amount-etc",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "begin-start": {
    "title": "剑桥语法 · Begin / start",
    "url": "https://dictionary.cambridge.org/us/grammar/british-grammar/begin-or-start",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "quick-fast": {
    "title": "剑桥语法 · Fast / quick / quickly",
    "url": "https://dictionary.cambridge.org/grammar/british-grammar/fast",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "prefixes": {
    "title": "剑桥语法 · 前缀",
    "url": "https://dictionary.cambridge.org/us/grammar/british-grammar/prefixes",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "suffixes": {
    "title": "剑桥语法 · 后缀",
    "url": "https://dictionary.cambridge.org/grammar/british-grammar/suffixes",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "affixes": {
    "title": "格拉斯哥大学 · 词根与词缀",
    "url": "https://stella.glasgow.ac.uk/grammar/unit-4-3-affixes.html",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "spelling": {
    "title": "剑桥语法 · 构词拼写",
    "url": "https://dictionary.cambridge.org/grammar/british-grammar/plurals",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "work-job": {
    "title": "剑桥语法 · Work / job",
    "url": "https://dictionary.cambridge.org/grammar/british-grammar/work-noun",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "easy": {
    "title": "剑桥词典 · easy",
    "url": "https://dictionary.cambridge.org/dictionary/english/easy",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "simple": {
    "title": "剑桥词典 · simple",
    "url": "https://dictionary.cambridge.org/dictionary/english/simple",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "hard": {
    "title": "剑桥词典 · hard",
    "url": "https://dictionary.cambridge.org/dictionary/english/hard",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "happy": {
    "title": "剑桥词典 · happy",
    "url": "https://dictionary.cambridge.org/dictionary/english/happy",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "friendly": {
    "title": "剑桥词典 · friendly",
    "url": "https://dictionary.cambridge.org/dictionary/english/friendly",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "kind": {
    "title": "剑桥词典 · kind",
    "url": "https://dictionary.cambridge.org/dictionary/english/kind",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "assist": {
    "title": "剑桥词典 · assist",
    "url": "https://dictionary.cambridge.org/dictionary/english/assist",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "helpful": {
    "title": "剑桥词典 · helpful",
    "url": "https://dictionary.cambridge.org/dictionary/english/helpful",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "useful": {
    "title": "剑桥词典 · useful",
    "url": "https://dictionary.cambridge.org/dictionary/english/useful",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "employ": {
    "title": "剑桥词典 · employ",
    "url": "https://dictionary.cambridge.org/dictionary/english/employ",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "attention": {
    "title": "剑桥词典 · attention",
    "url": "https://dictionary.cambridge.org/dictionary/english/attention",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "care": {
    "title": "剑桥词典 · care",
    "url": "https://dictionary.cambridge.org/dictionary/english/care",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "careful": {
    "title": "剑桥词典 · careful",
    "url": "https://dictionary.cambridge.org/dictionary/english/careful",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "cautious": {
    "title": "剑桥词典 · cautious",
    "url": "https://dictionary.cambridge.org/dictionary/english/cautious",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "teach": {
    "title": "剑桥词典 · teach",
    "url": "https://dictionary.cambridge.org/dictionary/english/teach",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "teacher": {
    "title": "剑桥词典 · teacher",
    "url": "https://dictionary.cambridge.org/dictionary/english/teacher",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "instructor": {
    "title": "剑桥词典 · instructor",
    "url": "https://dictionary.cambridge.org/dictionary/english/instructor",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "learn": {
    "title": "剑桥词典 · learn",
    "url": "https://dictionary.cambridge.org/dictionary/english/learn",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "learner": {
    "title": "剑桥词典 · learner",
    "url": "https://dictionary.cambridge.org/dictionary/english/learner",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "worker": {
    "title": "剑桥词典 · worker",
    "url": "https://dictionary.cambridge.org/dictionary/english/worker",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "employee": {
    "title": "剑桥词典 · employee",
    "url": "https://dictionary.cambridge.org/dictionary/english/employee",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "feasible": {
    "title": "剑桥词典 · feasible",
    "url": "https://dictionary.cambridge.org/dictionary/english/feasible",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  },
  "impossible": {
    "title": "剑桥词典 · impossible",
    "url": "https://dictionary.cambridge.org/dictionary/english/impossible",
    "checkedAt": "2026-10-23",
    "use": "factual-reference"
  }
};

const PILOT_CORE_SYNONYM_GROUPS = {
  "big-large": {
    "words": [
      "big",
      "large"
    ],
    "sense": "形容词 · 尺寸或规模大",
    "note": "两者都可描述尺寸大。big 也常描述重要的决定或想法；large 常见于较正式的规模、数量表达，不能在所有搭配中替换 big。",
    "examples": [
      {
        "en": "Choosing a school is a big decision for our family.",
        "zh": "选择学校对我们家来说是个重大决定。"
      },
      {
        "en": "A large number of visitors arrived before noon.",
        "zh": "中午以前来了很多参观者。"
      }
    ],
    "sourceIds": [
      "big-large"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "small-little": {
    "words": [
      "small",
      "little"
    ],
    "sense": "形容词 · 尺寸小",
    "note": "small 较中性地描述大小；little 在口语中也可带亲昵等态度。这里只比较“小”的形容词义，不包括 little 表示不可数数量少的用法。",
    "examples": [
      {
        "en": "We need a small table for this corner.",
        "zh": "这个角落需要一张小桌子。"
      },
      {
        "en": "Their little dog likes sleeping beside the sofa.",
        "zh": "他们家的小狗喜欢睡在沙发旁边。"
      }
    ],
    "sourceIds": [
      "small-little"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "begin-start": {
    "words": [
      "begin",
      "start"
    ],
    "sense": "动词 · 开始",
    "note": "描述活动开始时通常接近，begin 语气较正式；启动机器时用 start，不能直接替换为 begin。",
    "examples": [
      {
        "en": "The evening class begins at half past six.",
        "forms": [{
          "word": "begin",
          "form": "begins",
          "sourceIds": ["forms-mw-begin"],
          "review": { "status": "source-checked", "checkedAt": "2026-10-24" }
        }],
        "zh": "晚间课程六点半开始。"
      },
      {
        "en": "I cannot start the car on this cold morning.",
        "zh": "今天早晨很冷，我发动不了汽车。"
      }
    ],
    "sourceIds": [
      "begin-start"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "easy-simple": {
    "words": [
      "easy",
      "simple"
    ],
    "sense": "形容词 · 容易做或理解",
    "note": "easy 强调不费力，simple 强调不复杂；简单的计划不一定容易执行。这里不涵盖 simple 的其他词义。",
    "examples": [
      {
        "en": "The exercise is easy for an experienced player.",
        "zh": "这项练习对有经验的选手来说很容易。"
      },
      {
        "en": "The plan is simple, but following it every day takes effort.",
        "zh": "计划很简单，但每天坚持执行需要努力。"
      }
    ],
    "sourceIds": [
      "easy",
      "simple"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "difficult-hard": {
    "words": [
      "difficult",
      "hard"
    ],
    "sense": "形容词 · 难做或难理解",
    "note": "描述任务困难时两者接近，hard 常用于日常表达。hard 还可以表示“坚硬的”，该义不能换成 difficult。",
    "examples": [
      {
        "en": "This chapter is difficult to understand without a diagram.",
        "zh": "没有图示，这一章很难理解。"
      },
      {
        "en": "The ground was hard after several dry weeks.",
        "zh": "连续干旱几周后，地面变得坚硬。"
      }
    ],
    "sourceIds": [
      "hard"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "quick-fast": {
    "words": [
      "quick",
      "fast"
    ],
    "sense": "形容词 · 快",
    "note": "quick 常强调动作完成得快或耗时短；fast 常强调移动或运行速度高。固定搭配需单独记忆，不能逐词互换。",
    "examples": [
      {
        "en": "Could we have a quick chat after class?",
        "zh": "下课后我们能简短聊一下吗？"
      },
      {
        "en": "The fast train reaches the coast in two hours.",
        "zh": "这趟快车两小时就能到海边。"
      }
    ],
    "sourceIds": [
      "quick-fast"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "happy-glad": {
    "words": [
      "happy",
      "glad"
    ],
    "sense": "形容词 · 高兴",
    "note": "两者都能表达高兴。happy 可描述较持续的愉快状态；glad 常用于对某件事或消息感到高兴的语境，不是所有 happy 的搭配都能换成 glad。",
    "examples": [
      {
        "en": "She feels happy in her new class.",
        "zh": "她在新班级感到很开心。"
      },
      {
        "en": "I am glad your keys have been found.",
        "zh": "我很高兴你的钥匙找到了。"
      }
    ],
    "sourceIds": [
      "happy"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "kind-friendly": {
    "words": [
      "kind",
      "friendly"
    ],
    "sense": "形容词 · 待人友善",
    "note": "kind 强调体贴、愿意帮助别人；friendly 强调交往时亲切友好。本条不适用于 kind 作名词表示“种类”的用法。",
    "examples": [
      {
        "en": "It was kind of Ben to carry my heavy bag upstairs.",
        "zh": "本帮我把沉重的包提上楼，真体贴。"
      },
      {
        "en": "The receptionist gave every visitor a friendly greeting.",
        "zh": "接待员友好地问候了每位来访者。"
      }
    ],
    "sourceIds": [
      "kind",
      "friendly"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "help-assist": {
    "words": [
      "help",
      "assist"
    ],
    "sense": "动词 · 帮助",
    "note": "help 是常用表达；assist 语气较正式，常见于协助完成任务。搭配可以不同，不应只替换单词而保留不合适的句式。",
    "examples": [
      {
        "en": "Can you help me move this desk?",
        "zh": "你能帮我搬一下这张桌子吗？"
      },
      {
        "en": "Two volunteers will assist the team with registration.",
        "zh": "两名志愿者将协助团队办理登记。"
      }
    ],
    "sourceIds": [
      "assist"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "helpful-useful": {
    "words": [
      "helpful",
      "useful"
    ],
    "sense": "形容词 · 有帮助或有用",
    "note": "描述建议、信息或工具有帮助时两者接近。helpful 还可形容人乐于助人；useful 常侧重某物能派上用场，不能一概替换。",
    "examples": [
      {
        "en": "The librarian was helpful when I could not find the book.",
        "zh": "我找不到书时，图书管理员热心地帮了我。"
      },
      {
        "en": "A pocket notebook is useful when your phone has no power.",
        "zh": "手机没电时，随身笔记本能派上用场。"
      }
    ],
    "sourceIds": [
      "helpful",
      "useful"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "use-employ": {
    "words": [
      "use",
      "employ"
    ],
    "sense": "动词 · 使用工具、方法或技能",
    "note": "use 是通用表达；employ 在“使用方法或资源”的词义下较正式。employ 表示“雇用”时，不对应这里的 use。",
    "examples": [
      {
        "en": "We use coloured cards to review new words.",
        "zh": "我们用彩色卡片复习新词。"
      },
      {
        "en": "The researchers employ several methods to check the results.",
        "zh": "研究人员采用多种方法核查结果。"
      }
    ],
    "sourceIds": [
      "employ"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "care-attention": {
    "words": [
      "care",
      "attention"
    ],
    "sense": "名词 · 对细节的留心",
    "note": "care 在这个词义下强调认真、小心地处理；attention 强调把注意力或精力放在某事上。搭配不同，如 with care 与 pay attention。",
    "examples": [
      {
        "en": "Please unpack the glass bowls with care.",
        "zh": "拆开这些玻璃碗的包装时请小心。"
      },
      {
        "en": "Pay attention to the final sound in each word.",
        "zh": "注意每个单词的结尾音。"
      }
    ],
    "sourceIds": [
      "care",
      "attention"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "careful-cautious": {
    "words": [
      "careful",
      "cautious"
    ],
    "sense": "形容词 · 小心、谨慎",
    "note": "careful 可指认真避免差错；cautious 更突出为避免风险而谨慎。描述仔细检查细节时不必都换成 cautious。",
    "examples": [
      {
        "en": "A careful check found two spelling mistakes.",
        "zh": "仔细检查后发现了两处拼写错误。"
      },
      {
        "en": "She was cautious about crossing the icy bridge.",
        "zh": "她过那座结冰的桥时很谨慎。"
      }
    ],
    "sourceIds": [
      "careful",
      "cautious"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "teach-instruct": {
    "words": [
      "teach",
      "instruct"
    ],
    "sense": "动词 · 教授知识或技能",
    "note": "teach 是常用的教学表达；instruct 较正式，常指具体指导如何操作。instruct 的“命令”义不属于此处的近义范围。",
    "examples": [
      {
        "en": "My aunt teaches science at a local school.",
        "forms": [{
          "word": "teach",
          "form": "teaches",
          "sourceIds": ["forms-mw-teach"],
          "review": { "status": "source-checked", "checkedAt": "2026-10-24" }
        }],
        "zh": "我姑姑在当地一所学校教科学。"
      },
      {
        "en": "The guide instructed us in the use of the safety equipment.",
        "forms": [{
          "word": "instruct",
          "form": "instructed",
          "sourceIds": ["forms-mw-instruct"],
          "review": { "status": "source-checked", "checkedAt": "2026-10-24" }
        }],
        "zh": "向导教我们如何使用安全设备。"
      }
    ],
    "sourceIds": [
      "teach"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "teacher-instructor": {
    "words": [
      "teacher",
      "instructor"
    ],
    "sense": "名词 · 教授知识或技能的人",
    "note": "teacher 常指学校等教学场景的教师；instructor 常用于教授驾驶、运动等实用技能的人，也可用于美式院校的教学场景，需结合上下文理解。",
    "examples": [
      {
        "en": "Our art teacher asked us to draw a tree.",
        "zh": "我们的美术老师让我们画一棵树。"
      },
      {
        "en": "The driving instructor explained how to park safely.",
        "zh": "驾驶教练讲解了如何安全停车。"
      }
    ],
    "sourceIds": [
      "teacher",
      "instructor"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "learn-study": {
    "words": [
      "learn",
      "study"
    ],
    "sense": "动词 · 学习知识或技能",
    "note": "learn 强调获得知识或技能，也可指逐渐学会；study 强调花时间研读、学习的过程。参加学习并不自动表示已经学会。",
    "examples": [
      {
        "en": "I study English for twenty minutes after breakfast.",
        "zh": "我每天早饭后学二十分钟英语。"
      },
      {
        "en": "I learned how to describe my town during the course.",
        "forms": [{
          "word": "learn",
          "form": "learned",
          "sourceIds": ["forms-mw-learn"],
          "review": { "status": "source-checked", "checkedAt": "2026-10-24" }
        }],
        "zh": "我在课程中学会了如何描述自己的城镇。"
      }
    ],
    "sourceIds": [
      "learn"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "learner-student": {
    "words": [
      "learner",
      "student"
    ],
    "sense": "名词 · 学习者",
    "note": "learner 强调正在学习某项知识或技能，不一定在学校就读；student 常用于学校、课程等学习身份。二者只在相应语境中接近。",
    "examples": [
      {
        "en": "Adult learners can practise speaking during the lunch break.",
        "forms": [{
          "word": "learner",
          "form": "learners",
          "sourceIds": ["forms-mw-learner"],
          "review": { "status": "source-checked", "checkedAt": "2026-10-24" }
        }],
        "zh": "成年学习者可以在午休时练习口语。"
      },
      {
        "en": "The students in this class are preparing a group project.",
        "forms": [{
          "word": "student",
          "form": "students",
          "sourceIds": ["forms-mw-student"],
          "review": { "status": "source-checked", "checkedAt": "2026-10-24" }
        }],
        "zh": "这个班的学生正在准备一个小组项目。"
      }
    ],
    "sourceIds": [
      "learner"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "work-job": {
    "words": [
      "work",
      "job"
    ],
    "sense": "名词 · 工作或任务",
    "note": "work 表示付出劳动的工作时通常不可数；job 指一份职业或一项具体任务，通常可数。这里不讨论 work 表示艺术作品等其他词义。",
    "examples": [
      {
        "en": "I have some work to finish before dinner.",
        "zh": "晚饭前我还有些工作要完成。"
      },
      {
        "en": "She found a new job at a museum last month.",
        "zh": "她上个月在博物馆找到了一份新工作。"
      }
    ],
    "sourceIds": [
      "work-job"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "worker-employee": {
    "words": [
      "worker",
      "employee"
    ],
    "sense": "名词 · 工作的人",
    "note": "worker 的范围较宽，可按工作类型或方式描述劳动者；employee 强调受雇为别人工作的人，比较时留意是否强调雇佣关系。",
    "examples": [
      {
        "en": "The workers repaired the school roof during the holidays.",
        "forms": [{
          "word": "worker",
          "form": "workers",
          "sourceIds": ["forms-mw-worker"],
          "review": { "status": "source-checked", "checkedAt": "2026-10-24" }
        }],
        "zh": "假期里，工人们修缮了学校的屋顶。"
      },
      {
        "en": "Every employee receives a name badge on the first day.",
        "zh": "每位员工第一天都会领到姓名牌。"
      }
    ],
    "sourceIds": [
      "worker",
      "employee"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "possible-feasible": {
    "words": [
      "possible",
      "feasible"
    ],
    "sense": "形容词 · 能够发生或做到",
    "note": "possible 范围较广，可指有可能发生；feasible 常用于计划在现有条件下能够实施。可能发生的事情不一定适合用 feasible 描述。",
    "examples": [
      {
        "en": "It is possible that the shop will close early today.",
        "zh": "这家店今天有可能提早关门。"
      },
      {
        "en": "A weekend course is feasible with our current schedule.",
        "zh": "按我们目前的日程安排，周末课程是可行的。"
      }
    ],
    "sourceIds": [
      "feasible"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "impossible-unachievable": {
    "words": [
      "impossible",
      "unachievable"
    ],
    "sense": "形容词 · 无法做到或实现",
    "note": "目标、任务无法实现时，两者接近。impossible 还能描述事情不能发生；这里只比较“无法实现”的词义，不涵盖形容人难以相处的用法。",
    "examples": [
      {
        "en": "Finishing every chapter in ten minutes is impossible.",
        "zh": "十分钟读完所有章节是不可能的。"
      },
      {
        "en": "The team replaced an unachievable target with a realistic one.",
        "zh": "团队把一个无法实现的目标换成了现实的目标。"
      }
    ],
    "sourceIds": [
      "impossible"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  }
};

const PILOT_CORE_WORD_FORMATIONS = {
  "helpful": {
    "base": "help",
    "derived": "helpful",
    "affix": "-ful",
    "affixRole": "后缀",
    "expression": "help + -ful → helpful",
    "note": "help 是词基；-ful 在这里构成形容词，helpful 表示有帮助的、乐于助人的。",
    "sourceIds": [
      "affixes",
      "suffixes",
      "helpful"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "useful": {
    "base": "use",
    "derived": "useful",
    "affix": "-ful",
    "affixRole": "后缀",
    "expression": "use + -ful → useful",
    "note": "use 是词基；加 -ful 构成形容词 useful，表示有用的。这里保留 use 末尾的 e。",
    "sourceIds": [
      "suffixes",
      "useful"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "careful": {
    "base": "care",
    "derived": "careful",
    "affix": "-ful",
    "affixRole": "后缀",
    "expression": "care + -ful → careful",
    "note": "care 是词基；careful 表示小心的、仔细的。-ful 是构词后缀，不能逐字理解成独立单词 full。",
    "sourceIds": [
      "suffixes",
      "careful"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "teacher": {
    "base": "teach",
    "derived": "teacher",
    "affix": "-er",
    "affixRole": "后缀",
    "expression": "teach + -er → teacher",
    "note": "teach 表示教；-er 在这里构成表示人的名词 teacher。不要与比较级的 -er 混淆。",
    "sourceIds": [
      "suffixes",
      "teacher"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "learner": {
    "base": "learn",
    "derived": "learner",
    "affix": "-er",
    "affixRole": "后缀",
    "expression": "learn + -er → learner",
    "note": "learn 表示学习；-er 在这里构成表示人的名词 learner，即学习者。",
    "sourceIds": [
      "suffixes",
      "learner"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "worker": {
    "base": "work",
    "derived": "worker",
    "affix": "-er",
    "affixRole": "后缀",
    "expression": "work + -er → worker",
    "note": "work 表示工作；-er 在这里构成表示人的名词 worker，即工作的人。",
    "sourceIds": [
      "suffixes",
      "worker"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "unhappy": {
    "base": "happy",
    "derived": "unhappy",
    "affix": "un-",
    "affixRole": "前缀",
    "expression": "un- + happy → unhappy",
    "note": "un- 在这里表示否定，unhappy 表示不高兴的；这是前缀加完整词基，不是按字母位置拆词。",
    "sourceIds": [
      "prefixes"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "unkind": {
    "base": "kind",
    "derived": "unkind",
    "affix": "un-",
    "affixRole": "前缀",
    "expression": "un- + kind → unkind",
    "note": "以形容词 kind（体贴的）为词基，un- 表示否定，unkind 表示不友善的；与名词 kind（种类）无关。",
    "sourceIds": [
      "prefixes",
      "kind"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "friendly": {
    "base": "friend",
    "derived": "friendly",
    "affix": "-ly",
    "affixRole": "后缀",
    "expression": "friend + -ly → friendly",
    "note": "friend 是词基；friendly 是形容词，表示友好的。-ly 也能构成形容词，不能只凭词尾判断为副词。",
    "sourceIds": [
      "suffixes",
      "friendly"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "quickly": {
    "base": "quick",
    "derived": "quickly",
    "affix": "-ly",
    "affixRole": "后缀",
    "expression": "quick + -ly → quickly",
    "note": "quick 是形容词；加 -ly 得到副词 quickly。fast 本身也可作副词，不能照此生成 fastly。",
    "sourceIds": [
      "quick-fast",
      "suffixes"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "impossible": {
    "base": "possible",
    "derived": "impossible",
    "affix": "im-",
    "affixRole": "前缀",
    "expression": "im- + possible → impossible",
    "note": "im- 在这里是表示否定的前缀，与 possible 合成 impossible；possible 保持完整，不拆成不成立的字母片段。",
    "sourceIds": [
      "prefixes",
      "spelling",
      "impossible"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  },
  "easily": {
    "base": "easy",
    "derived": "easily",
    "affix": "-ly",
    "affixRole": "后缀",
    "expression": "easy + -ly → easily",
    "note": "由形容词 easy 构成副词 easily 时，词尾 y 变成 i，再加 -ly；不是直接拼成 easyly。",
    "sourceIds": [
      "suffixes",
      "spelling"
    ],
    "review": {
      "status": "source-checked",
      "checkedAt": "2026-10-23"
    }
  }
};

const PILOT_CORE_WORD_NOTES = {
  "big": {
    "synonymGroup": "big-large"
  },
  "large": {
    "synonymGroup": "big-large"
  },
  "small": {
    "synonymGroup": "small-little"
  },
  "little": {
    "synonymGroup": "small-little"
  },
  "begin": {
    "synonymGroup": "begin-start"
  },
  "start": {
    "synonymGroup": "begin-start"
  },
  "easy": {
    "synonymGroup": "easy-simple",
    "formation": "easily"
  },
  "simple": {
    "synonymGroup": "easy-simple"
  },
  "difficult": {
    "synonymGroup": "difficult-hard"
  },
  "hard": {
    "synonymGroup": "difficult-hard"
  },
  "quick": {
    "synonymGroup": "quick-fast",
    "formation": "quickly"
  },
  "fast": {
    "synonymGroup": "quick-fast"
  },
  "happy": {
    "synonymGroup": "happy-glad",
    "formation": "unhappy"
  },
  "glad": {
    "synonymGroup": "happy-glad"
  },
  "kind": {
    "synonymGroup": "kind-friendly",
    "formation": "unkind"
  },
  "friendly": {
    "synonymGroup": "kind-friendly",
    "formation": "friendly"
  },
  "help": {
    "synonymGroup": "help-assist",
    "formation": "helpful"
  },
  "helpful": {
    "synonymGroup": "helpful-useful",
    "formation": "helpful"
  },
  "use": {
    "synonymGroup": "use-employ",
    "formation": "useful"
  },
  "useful": {
    "synonymGroup": "helpful-useful",
    "formation": "useful"
  },
  "care": {
    "synonymGroup": "care-attention",
    "formation": "careful"
  },
  "careful": {
    "synonymGroup": "careful-cautious",
    "formation": "careful"
  },
  "teach": {
    "synonymGroup": "teach-instruct",
    "formation": "teacher"
  },
  "teacher": {
    "synonymGroup": "teacher-instructor",
    "formation": "teacher"
  },
  "learn": {
    "synonymGroup": "learn-study",
    "formation": "learner"
  },
  "learner": {
    "synonymGroup": "learner-student",
    "formation": "learner"
  },
  "work": {
    "synonymGroup": "work-job",
    "formation": "worker"
  },
  "worker": {
    "synonymGroup": "worker-employee",
    "formation": "worker"
  },
  "possible": {
    "synonymGroup": "possible-feasible",
    "formation": "impossible"
  },
  "impossible": {
    "synonymGroup": "impossible-unachievable",
    "formation": "impossible"
  }
};

export const WORD_NOTE_SOURCES = { ...PILOT_WORD_NOTE_SOURCES, ...DAILY_NOTE_SOURCES, ...EVERYDAY_NOTE_SOURCES, ...USAGE_NOTE_SOURCES, ...EXPANSION_ONE_NOTE_SOURCES, ...EXPANSION_TWO_NOTE_SOURCES, ...EXPANSION_THREE_NOTE_SOURCES, ...EXPANSION_FOUR_NOTE_SOURCES, ...EXPANSION_FIVE_NOTE_SOURCES, ...EXPANSION_SIX_NOTE_SOURCES, ...EXPANSION_SEVEN_NOTE_SOURCES, ...EXPANSION_EIGHT_NOTE_SOURCES, ...EXPANSION_NINE_NOTE_SOURCES, ...PRACTICAL_NOTE_SOURCES };
export const CORE_SYNONYM_GROUPS = { ...PILOT_CORE_SYNONYM_GROUPS, ...DAILY_SYNONYM_GROUPS, ...EVERYDAY_SYNONYM_GROUPS, ...USAGE_SYNONYM_GROUPS, ...EXPANSION_ONE_SYNONYM_GROUPS, ...EXPANSION_TWO_SYNONYM_GROUPS, ...EXPANSION_THREE_SYNONYM_GROUPS, ...EXPANSION_FOUR_SYNONYM_GROUPS, ...EXPANSION_FIVE_SYNONYM_GROUPS, ...EXPANSION_SIX_SYNONYM_GROUPS, ...EXPANSION_SEVEN_SYNONYM_GROUPS, ...EXPANSION_EIGHT_SYNONYM_GROUPS, ...EXPANSION_NINE_SYNONYM_GROUPS, ...PRACTICAL_SYNONYM_GROUPS };
export const CORE_WORD_FORMATIONS = { ...PILOT_CORE_WORD_FORMATIONS, ...DAILY_WORD_FORMATIONS };
export const CORE_WORD_NOTES = { ...PILOT_CORE_WORD_NOTES, ...DAILY_WORD_NOTES, ...EVERYDAY_WORD_NOTES, ...USAGE_WORD_NOTES, ...EXPANSION_ONE_WORD_NOTES, ...EXPANSION_TWO_WORD_NOTES, ...EXPANSION_THREE_WORD_NOTES, ...EXPANSION_FOUR_WORD_NOTES, ...EXPANSION_FIVE_WORD_NOTES, ...EXPANSION_SIX_WORD_NOTES, ...EXPANSION_SEVEN_WORD_NOTES, ...EXPANSION_EIGHT_WORD_NOTES, ...EXPANSION_NINE_WORD_NOTES, ...PRACTICAL_WORD_NOTES };
