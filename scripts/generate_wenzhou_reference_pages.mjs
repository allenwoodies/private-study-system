import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("dist", "lp95-study");

const commonSources = [
  ["浙江省教育厅：初中学业水平考试省级统一命题通知", "https://zjjcmspublic.oss-cn-hangzhou-zwynet-d01-a.internet.cloud.zj.gov.cn/jcms_files/jcms1/web3114/site/attach/0/924fe84581ff48a6bba132fac066ea0d.pdf"],
  ["浙江省教育考试院：2025年初中学业水平考试命题思路", "https://www.zjzs.net/art/2025/6/23/art_31_11386.html"],
  ["浙江省数字教材服务平台：初中英语新标准、科学浙教版教材", "https://book.zjeav.com/"]
];

const english = {
  file: "wenzhou-english.html",
  storagePrefix: "wenzhou-english-checklist:",
  title: "浙江温州初中英语中考知识体系查漏补缺表",
  subtitle: "适用于温州市初中英语中考复习。框架依据《义务教育英语课程标准（2022年版）》、浙江省初中学业水平考试省级统一命题方向，并结合温州常用“英语（新标准）/外研版”初中教材模块整理。",
  sources: [
    ...commonSources,
    ["教育部：义务教育英语课程标准（2022年版）", "https://www.moe.gov.cn/srcsite/A26/s8001/202204/W020220420582349487953.pdf"]
  ],
  center: {
    title: "浙江温州中考英语",
    sub: "听说 · 词汇语法 · 阅读语篇 · 语言运用 · 写作表达 · 文化策略"
  },
  nav: [
    ["mindmap", "一、整体思维导图"],
    ["strategy", "二、最小提分策略"],
    ["textbook", "三、外研版教材主线"],
    ["listening", "四、听力与听说"],
    ["vocabulary", "五、词汇与短语"],
    ["grammar", "六、语法句法"],
    ["reading", "七、阅读与任务型阅读"],
    ["language-use", "八、完形与语言运用"],
    ["writing", "九、写作表达"],
    ["patterns", "十、句型速查"]
  ],
  branches: [
    ["听力听说", ["数字、时间、地点、人物、事件细节", "主旨推断、态度判断、信息转述", "朗读、情景问答、话题表达、口语连贯"]],
    ["词汇短语", ["课标核心词、主题词群、固定搭配", "词形变化、派生合成、近义辨析", "在语境中理解词义和功能"]],
    ["语法句法", ["时态、语态、从句、非谓语、情态动词", "句子成分、句型转换、主谓一致", "语法服务于语篇表达，不孤立刷题"]],
    ["阅读语篇", ["应用文、记叙文、说明文、议论文", "主旨、细节、推断、词义、结构", "多文本、图表、任务型阅读和观点表达"]],
    ["写作表达", ["要点覆盖、结构清楚、语言准确", "应用文、建议、观点、故事、活动介绍", "审题、提纲、连接词、修改检查"]],
    ["文化策略", ["人与自我、人与社会、人与自然", "跨文化意识、学习策略、复盘错因", "真实情境下解决问题和表达观点"]]
  ],
  sections: [
    {
      id: "strategy",
      title: "二、最小提分策略",
      tag: "先抓收益",
      note: "英语提分不要先陷入海量刷题。先稳定听读基础、语法低错、阅读证据和写作结构。",
      groups: [
        ["优先级", [
          ["en-strategy-01", "听力保底", "每天 10 分钟泛听 + 5 分钟精听，能复述人物、地点、事件和结果。", "只听不复述，错题不知道漏了哪个信息点。"],
          ["en-strategy-02", "词汇复现", "按主题建立词群，做到会读、会拼、会变形、会搭配、会造句。", "只背中文意思，写作和完形无法调用。"],
          ["en-strategy-03", "语法低错", "时态、语态、从句、非谓语、主谓一致每周专项清一类错。", "凭语感选择，错题不归因。"],
          ["en-strategy-04", "阅读证据", "每道阅读题能在原文标出定位句或推断依据。", "答案看似合理，但没有文本证据。"],
          ["en-strategy-05", "完形逻辑", "先读主线，再看上下文、搭配、情感变化和复现词。", "逐空做题，忽略全文语境。"],
          ["en-strategy-06", "写作模板升级", "固定三段结构，但每篇至少有 3 个具体细节和 2 个高级连接。", "模板味太重，内容空，语法低级错多。"],
          ["en-strategy-07", "错题标签", "每题标为词汇、语法、定位、推断、审题、表达六类之一。", "只抄答案，不知道下次如何避免。"],
          ["en-strategy-08", "周复盘", "每周只选 1 个最高频错误专题做 20-30 分钟复测。", "每周都学很多，但没有一个点真正变稳。"]
        ]]
      ]
    },
    {
      id: "textbook",
      title: "三、外研版教材主线",
      tag: "温州教材",
      note: "温州初中英语按“英语（新标准）/外研版”模块体系组织更贴近教材。复习时不要只看语法表，要把语法放回模块话题和语篇任务。",
      groups: [
        ["七年级上", [
          ["en-book-7a-01", "Starter Modules", "师友、课堂、课本、日常生活；字母音形、问候、课堂指令、颜色时间。", "大小写、标点、基本问答不规范。"],
          ["en-book-7a-02", "Module 1 My classmates", "自我介绍、国家城市、be 动词、人称代词。", "am/is/are 混用，介绍只会背模板。"],
          ["en-book-7a-03", "Module 2 My family", "家庭成员、职业、this/that/these/those、名词单复数。", "指示代词远近和单复数不一致。"],
          ["en-book-7a-04", "Module 3 My school", "学校场所、there be、方位介词、校园描述。", "there is/are 与名词单复数不匹配。"],
          ["en-book-7a-05", "Module 4-5 Food & school day", "饮食健康、课程时间、have/has、一般现在时。", "第三人称单数和时间表达不稳。"],
          ["en-book-7a-06", "Module 6-10", "动物、电脑、礼物、人物地点、春节；一般现在时与现在进行时。", "两种时态混淆，节日文化词汇散。"]
        ]],
        ["七年级下", [
          ["en-book-7b-01", "Lost and found", "物品归属、名词性物主代词、失物招领表达。", "my/mine、your/yours 混淆。"],
          ["en-book-7b-02", "What can you do?", "能力表达、can/can't、社团和竞选。", "can 后动词原形漏掉。"],
          ["en-book-7b-03", "Making plans", "计划、be going to、周末活动。", "be going to 结构不完整。"],
          ["en-book-7b-04", "Life in the future", "未来生活、will、预测和想象表达。", "will 与 be going to 混用。"],
          ["en-book-7b-05", "Shopping / Body language", "购物对话、礼貌表达、肢体语言文化差异。", "口语场景语气不自然。"],
          ["en-book-7b-06", "Past life / Story time", "一般过去时、人物经历、故事叙述。", "动词过去式和时间状语不匹配。"]
        ]],
        ["八年级上", [
          ["en-book-8a-01", "Learning English", "学习建议、should、why not、how about。", "建议句型单一，不会解释理由。"],
          ["en-book-8a-02", "Hometown / Sports / Transport", "比较级最高级、交通方式、体育话题。", "比较对象不清，than/as...as 用错。"],
          ["en-book-8a-03", "Teahouse / Animals / Stories", "动词不定式、保护动物、过去进行时。", "不定式作宾语/目的状语不分。"],
          ["en-book-8a-04", "Accidents / Population / Weather", "过去进行时、冠词、情态动词和天气表达。", "事故叙述缺时间线。"],
          ["en-book-8a-05", "Way of life / Help", "情态动词 must/can/may、急救和文化规则。", "情态动词语气强弱不分。"]
        ]],
        ["八年级下", [
          ["en-book-8b-01", "Feelings / Experiences", "感官系动词、现在完成时、经历表达。", "have been to / have gone to 混淆。"],
          ["en-book-8b-02", "Health / Cartoons", "现在完成时延续性、健康建议、故事人物。", "for/since 与瞬间动词搭配错误。"],
          ["en-book-8b-03", "Hobbies / Friendship", "简单句基本句型、宾语从句入门。", "宾语从句语序仍按疑问句。"],
          ["en-book-8b-04", "Time off / On the radio", "宾语从句、旅行与媒体表达。", "that/if/whether/疑问词选择不稳。"]
        ]],
        ["九年级", [
          ["en-book-9-01", "Wonders / Holidays / Heroes", "时态综合、时间状语从句、人物事迹介绍。", "故事时间线混乱。"],
          ["en-book-9-02", "Home alone / Museums / Problems", "结果状语从句、条件状语从句、建议表达。", "if 条件句主将从现不稳。"],
          ["en-book-9-03", "Great books / Sports life", "被动语态、一般现在/过去被动。", "主动被动主语判断错误。"],
          ["en-book-9-04", "Photos / Australia / Save our world", "定语从句、环保议题、文化介绍。", "关系代词和先行词不对应。"],
          ["en-book-9-05", "复习整合", "围绕人与自我、人与社会、人与自然三大主题做综合阅读和写作。", "只按语法复习，忽略主题语篇。"]
        ]]
      ]
    },
    {
      id: "listening",
      title: "四、听力与听说",
      tag: "输入输出",
      note: "温州英语听说能力要长期练，不适合临考突击。听力要从“听懂关键词”升级到“听懂关系和态度”。",
      groups: [
        ["听力信息", [
          ["en-listen-01", "数字价格", "电话号码、价格、数量、年龄、百分比、编号。", "相近数字、teen/ty、hundred/thousand 听混。"],
          ["en-listen-02", "时间日期", "星期、月份、时刻、持续时间、先后顺序。", "half past、quarter、in/on/at 不敏感。"],
          ["en-listen-03", "地点路线", "school, hospital, museum, station, restaurant；问路和方位。", "left/right、across/opposite/next to 混淆。"],
          ["en-listen-04", "人物关系", "teacher-student、doctor-patient、shop assistant-customer 等。", "只听到词，没判断说话人关系。"],
          ["en-listen-05", "事件结果", "谁做了什么、为什么、结果如何。", "原因和结果顺序颠倒。"],
          ["en-listen-06", "态度情绪", "happy, worried, surprised, disappointed, interested。", "忽略语气词和转折词。"],
          ["en-listen-07", "主旨大意", "听完整段后概括主题，不被局部词带偏。", "听到熟词就选，忽略全文目的。"],
          ["en-listen-08", "推断判断", "根据语境判断未直接说出的信息。", "把原文同词当答案，不推理。"]
        ]],
        ["听说表达", [
          ["en-speak-01", "朗读", "重音、连读、停顿、升降调；能自然读课文和短文。", "逐词读，句群停顿不清。"],
          ["en-speak-02", "情景问答", "根据中文或图片快速组织一句完整答语。", "只答关键词，句子不完整。"],
          ["en-speak-03", "信息转述", "听读材料后转述人物、时间、地点、事件、观点。", "漏主语、漏时态、漏逻辑连接。"],
          ["en-speak-04", "话题表达", "围绕学校、家庭、健康、旅行、环保等话题说 6-8 句。", "内容散，只有单句，没有结构。"],
          ["en-speak-05", "观点理由", "I think... because... For example... 能清楚表达观点和理由。", "有观点无理由，或理由与观点不匹配。"],
          ["en-speak-06", "口语修复", "不会说时能换词、解释、举例，不直接停住。", "遇到生词就沉默。"]
        ]]
      ]
    },
    {
      id: "vocabulary",
      title: "五、词汇与短语",
      tag: "语境记忆",
      note: "中考词汇不是“中文意思背熟”就够，要放进主题、搭配、句法和语篇中使用。",
      groups: [
        ["主题词群", [
          ["en-vocab-01", "个人信息", "name, age, country, city, hobby, personality, dream。", "介绍信息缺逻辑顺序。"],
          ["en-vocab-02", "家庭朋友", "family members, jobs, relationship, friendship。", "人物关系和所有格表达错。"],
          ["en-vocab-03", "学校学习", "subjects, timetable, classroom, learning methods。", "course/class/lesson 区分不清。"],
          ["en-vocab-04", "饮食健康", "food, diet, exercise, illness, advice, habit。", "healthy/health、ill/sick 词性混用。"],
          ["en-vocab-05", "运动休闲", "sports, hobbies, music, movies, reading。", "go/do/play 搭配不稳。"],
          ["en-vocab-06", "旅行交通", "transport, direction, hotel, ticket, journey。", "take/spend/cost/pay 混淆。"],
          ["en-vocab-07", "天气自然", "weather, season, animals, plants, environment。", "weather 不可数，temperature 搭配不稳。"],
          ["en-vocab-08", "节日文化", "festival, custom, celebration, gift, symbol。", "中国文化英文表达不会。"],
          ["en-vocab-09", "科技媒体", "computer, Internet, AI, radio, newspaper, app。", "technology 与 technique 混用。"],
          ["en-vocab-10", "社会规则", "rules, safety, manners, volunteer, public places。", "must/have to/should 语气不分。"]
        ]],
        ["词汇能力", [
          ["en-vocab-11", "词性变化", "名词、动词、形容词、副词转换，如 success/succeed/successful。", "只知道一个词形，填空不会变。"],
          ["en-vocab-12", "名词单复数", "规则复数、不规则复数、不可数名词、量词。", "information/advice/news 当可数。"],
          ["en-vocab-13", "动词短语", "look up, give up, put off, take care of, get on with。", "介词/副词小品词漏写。"],
          ["en-vocab-14", "介词搭配", "be good at, be interested in, be proud of, depend on。", "中文直译导致介词错。"],
          ["en-vocab-15", "形容词搭配", "similar to, different from, full of, afraid of。", "固定搭配记不准。"],
          ["en-vocab-16", "易混词", "say/tell/speak/talk, bring/take, borrow/lend/keep。", "只背中文，不看动作方向。"],
          ["en-vocab-17", "构词法", "前缀 un-/im-/dis-/re-，后缀 -ful/-less/-tion/-ment/-er。", "词义能猜但词性不会判断。"],
          ["en-vocab-18", "同义替换", "start/begin, improve/make better, protect/keep safe。", "阅读找不到原文同义表达。"],
          ["en-vocab-19", "熟词生义", "light, right, mean, present, point, matter。", "只记常见义，阅读误解。"],
          ["en-vocab-20", "语境选词", "根据前后文、情感色彩、搭配和句法位置选词。", "选项逐个翻译，忽略语篇。"]
        ]]
      ]
    },
    {
      id: "grammar",
      title: "六、语法句法",
      tag: "低错核心",
      note: "语法的目标不是背术语，而是在阅读中看懂长句，在写作中少出低级错。",
      groups: [
        ["基础句法", [
          ["en-grammar-01", "句子成分", "主语、谓语、宾语、表语、定语、状语、宾补。", "不知道谓语动词，长句无法拆。"],
          ["en-grammar-02", "五种基本句型", "SV, SVO, SVP, SVOO, SVOC。", "写作只会简单 SVO。"],
          ["en-grammar-03", "be 动词", "am/is/are/was/were 与主语、时态一致。", "主谓不一致。"],
          ["en-grammar-04", "there be", "就近原则、时态变化、否定疑问。", "there has 与 there be 混用。"],
          ["en-grammar-05", "代词", "人称、物主、反身、不定代词。", "形容词性/名词性物主代词错。"],
          ["en-grammar-06", "冠词", "a/an/the/零冠词；首次提及和特指。", "元音音素判断错。"],
          ["en-grammar-07", "数词", "基数词、序数词、分数、小数、年代日期。", "hundred/thousand 是否加 s 不稳。"],
          ["en-grammar-08", "介词", "时间、地点、方式、原因介词及固定搭配。", "in/on/at、by/with/in 混淆。"]
        ]],
        ["时态语态", [
          ["en-grammar-09", "一般现在时", "事实、习惯、频率；第三人称单数。", "三单漏 s/es。"],
          ["en-grammar-10", "现在进行时", "正在发生、阶段性动作；be doing。", "be 动词漏写。"],
          ["en-grammar-11", "一般过去时", "过去时间、规则/不规则过去式。", "过去式拼写和否定疑问错。"],
          ["en-grammar-12", "过去进行时", "过去某时正在发生；when/while。", "主从句动作关系不清。"],
          ["en-grammar-13", "一般将来时", "will 与 be going to。", "计划、预测、临时决定分不清。"],
          ["en-grammar-14", "现在完成时", "have/has done，经历、影响、持续。", "since/for 和瞬间动词误用。"],
          ["en-grammar-15", "被动语态", "be done；一般现在、过去、将来、情态被动。", "不知道动作承受者作主语。"],
          ["en-grammar-16", "时态综合", "根据时间状语、上下文和语篇逻辑判断。", "只看单句，不看全文时间线。"]
        ]],
        ["词类与从句", [
          ["en-grammar-17", "形容词副词", "比较级、最高级、原级比较、修饰关系。", "more/most 与词尾 -er/-est 叠用。"],
          ["en-grammar-18", "情态动词", "can, may, must, should, need, had better。", "mustn't 与 don't have to 区分不清。"],
          ["en-grammar-19", "非谓语", "to do, doing, done 的常见搭配和功能。", "want to do / enjoy doing 混用。"],
          ["en-grammar-20", "祈使句", "肯定、否定、Let 型、and/or 结构。", "祈使句主语和动词形式错。"],
          ["en-grammar-21", "感叹句", "What + 名词；How + 形容词/副词。", "what/how 选择错。"],
          ["en-grammar-22", "宾语从句", "连接词、陈述语序、时态呼应。", "从句仍用疑问语序。"],
          ["en-grammar-23", "状语从句", "时间、条件、原因、结果、让步、目的。", "if/when 引导从句时态错。"],
          ["en-grammar-24", "定语从句", "先行词、关系代词 who/which/that。", "关系词与先行词不对应。"],
          ["en-grammar-25", "并列复合句", "and, but, or, so, while, however。", "连接词逻辑关系不对。"],
          ["en-grammar-26", "主谓一致", "单复数、就近原则、不可数名词、集合名词。", "主语长时找不到真正主语。"]
        ]]
      ]
    },
    {
      id: "reading",
      title: "七、阅读与任务型阅读",
      tag: "证据答题",
      note: "阅读题要从“读懂大概”升级为“能用证据解释为什么选这个答案”。",
      groups: [
        ["阅读题型", [
          ["en-read-01", "主旨大意", "概括文章或段落中心，识别作者写作目的。", "被开头细节或高频词带偏。"],
          ["en-read-02", "细节定位", "根据题干关键词定位原文，注意同义替换。", "只找原词，漏掉改写表达。"],
          ["en-read-03", "推理判断", "根据事实、因果、态度和上下文推断。", "把自己的常识当答案。"],
          ["en-read-04", "词义猜测", "用定义、举例、转折、因果、构词法判断。", "孤立翻译生词。"],
          ["en-read-05", "标题选择", "标题要覆盖全文、简洁、有概括性。", "选局部细节做标题。"],
          ["en-read-06", "结构排序", "识别总分、时间、空间、问题解决、因果结构。", "只看句子表面意思。"],
          ["en-read-07", "作者态度", "positive, negative, worried, hopeful, objective。", "忽略形容词和转折。"],
          ["en-read-08", "代词指代", "it/they/this/that/which 指代前文对象或事件。", "只找最近名词，不看语义。"]
        ]],
        ["语篇类型", [
          ["en-read-09", "应用文", "广告、通知、海报、邮件、说明；快速提取信息。", "不看标题、图标和限制条件。"],
          ["en-read-10", "记叙文", "人物、事件、冲突、情感变化、主题。", "只记情节，不提炼人物成长。"],
          ["en-read-11", "说明文", "说明对象、特征、原因、过程、数据。", "漏读限定词和数据。"],
          ["en-read-12", "议论文", "观点、理由、例证、结论。", "观点和例子分不清。"],
          ["en-read-13", "科普文本", "科学概念、实验、技术应用、环保健康。", "术语害怕，忽略上下文解释。"],
          ["en-read-14", "多文本阅读", "比较两三则材料的共同点、差异和任务要求。", "答案只引用一则材料。"],
          ["en-read-15", "图表阅读", "图表标题、单位、趋势、最大最小值。", "单位、比例和时间范围漏看。"],
          ["en-read-16", "任务型阅读", "补句、匹配、回答问题、完成表格、开放表达。", "只填词，不管语法和逻辑。"]
        ]]
      ]
    },
    {
      id: "language-use",
      title: "八、完形与语言运用",
      tag: "上下文",
      note: "完形和语法填空考的是“语言在语篇中的作用”，不是孤立词汇或语法。",
      groups: [
        ["完形填空", [
          ["en-use-01", "全文主线", "先快速读首尾段和每段首句，判断故事/说明主线。", "第一空就开始纠结。"],
          ["en-use-02", "上下文复现", "原词复现、同义复现、反义对照、代词照应。", "不回看上下文。"],
          ["en-use-03", "情感变化", "人物心情从担心到放松、从失败到成长等。", "只看选项意思，忽略情感线。"],
          ["en-use-04", "逻辑关系", "转折、因果、递进、让步、条件。", "but/so/however 后逻辑判断错。"],
          ["en-use-05", "固定搭配", "动词短语、介词搭配、形容词搭配。", "搭配靠直觉。"],
          ["en-use-06", "词义辨析", "近义动词、形容词、副词在语境中的细微差别。", "四个词都认识但不知道选哪个。"],
          ["en-use-07", "句法位置", "根据空格前后判断词性和句子成分。", "名词、动词、形容词位置不清。"],
          ["en-use-08", "主题价值", "成长、合作、坚持、环保、科技、文化等主题导向。", "忽略文章价值取向。"]
        ]],
        ["语法与词汇运用", [
          ["en-use-09", "动词形式", "时态、语态、非谓语、主谓一致。", "看到动词就只变时态。"],
          ["en-use-10", "名词形式", "单复数、所有格、不可数、量词。", "可数不可数不分。"],
          ["en-use-11", "形副转换", "修饰名词用形容词，修饰动词/句子用副词。", "careful/carefully 混用。"],
          ["en-use-12", "代词与限定词", "人称、物主、反身、some/any/much/many。", "指代对象不清。"],
          ["en-use-13", "连词填空", "根据分句关系选 because/although/if/when/that。", "只按中文意思填。"],
          ["en-use-14", "介词填空", "时间、地点、方式、固定搭配。", "in/on/at 和固定短语不稳。"],
          ["en-use-15", "短文改错意识", "检查大小写、拼写、标点、谓语、单复数。", "最后不回读全文。"]
        ]]
      ]
    },
    {
      id: "writing",
      title: "九、写作表达",
      tag: "结构表达",
      note: "中考写作要做到：审题不偏、要点完整、结构清楚、语言准确、有具体细节。",
      groups: [
        ["写作流程", [
          ["en-write-01", "审题", "圈身份、对象、体裁、时态、人称、要点和字数。", "漏身份或漏要点。"],
          ["en-write-02", "列提纲", "开头点题，中间 2-3 个要点，结尾总结或倡议。", "想到哪写到哪。"],
          ["en-write-03", "句群组织", "一个要点写 2-3 句，先总说再解释例子。", "句子堆叠，没有段落逻辑。"],
          ["en-write-04", "连接词", "first, besides, however, as a result, in my opinion。", "连接词少或使用不准确。"],
          ["en-write-05", "具体细节", "用时间、地点、人物、动作、例子让内容具体。", "good, nice, interesting 反复出现。"],
          ["en-write-06", "检查修改", "时态、人称、三单、单复数、拼写、标点。", "低级错误扣分。"]
        ]],
        ["常见体裁", [
          ["en-write-07", "邮件/书信", "称呼、目的、正文、结尾；语气得体。", "格式和对象语气不匹配。"],
          ["en-write-08", "通知/海报", "时间地点、活动内容、要求、联系方式。", "关键信息不完整。"],
          ["en-write-09", "建议类", "问题描述 + 建议 + 理由 + 鼓励。", "建议只有 should，没有原因。"],
          ["en-write-10", "观点类", "亮明观点，给出两到三条理由，适当举例。", "观点摇摆或理由重复。"],
          ["en-write-11", "经历故事", "时间线、冲突、转折、结果、感受。", "故事没有高潮或感悟。"],
          ["en-write-12", "人物介绍", "身份、品质、事件证据、影响。", "只列形容词，无具体事例。"],
          ["en-write-13", "活动介绍", "活动背景、过程、收获、建议。", "过程流水账，缺收获。"],
          ["en-write-14", "图表作文", "描述数据趋势，分析原因，提出建议。", "只抄数据，不总结趋势。"],
          ["en-write-15", "文化介绍", "节日、习俗、意义、个人体验。", "文化词汇不会表达。"],
          ["en-write-16", "环保科技", "现象、影响、做法、倡议。", "大话空话，无可执行做法。"]
        ]]
      ]
    },
    {
      id: "patterns",
      title: "十、句型速查",
      tag: "表达工具",
      note: "句型不是背模板，而是帮孩子把中文想法稳定转成英文句子。",
      groups: [
        ["高频句型", [
          ["en-pattern-01", "建议", "You should... / Why not...? / It is a good idea to...", "只会 should，表达单调。"],
          ["en-pattern-02", "原因结果", "because, so, as a result, That is why...", "because 和 so 连用。"],
          ["en-pattern-03", "目的", "in order to, so that, to do。", "目的状语位置混乱。"],
          ["en-pattern-04", "比较", "as...as, more...than, one of the most...。", "比较对象不对等。"],
          ["en-pattern-05", "观点", "In my opinion, I believe that..., From my point of view。", "观点句后没有理由。"],
          ["en-pattern-06", "举例", "For example, such as, take...as an example。", "such as 后接完整句。"],
          ["en-pattern-07", "让步转折", "although, though, however, but。", "although 和 but 连用。"],
          ["en-pattern-08", "总结", "In a word, All in all, To sum up。", "结尾只是重复开头。"],
          ["en-pattern-09", "期待希望", "I hope that..., I am looking forward to...。", "look forward to 后动词原形。"],
          ["en-pattern-10", "责任倡议", "It is our duty to..., Let's take action to...。", "倡议空泛，没有具体行动。"]
        ]]
      ]
    }
  ]
};

const science = {
  file: "wenzhou-science.html",
  storagePrefix: "wenzhou-science-checklist:",
  title: "浙江温州初中科学中考知识体系查漏补缺表",
  subtitle: "适用于温州市初中科学中考复习。框架依据《义务教育科学课程标准（2022年版）》、浙江省初中学业水平考试省级统一命题方向，并结合温州常用浙教版初中科学教材整理。",
  sources: [
    ...commonSources,
    ["教育部：义务教育科学课程标准（2022年版）", "https://www.moe.gov.cn/srcsite/A26/s8001/202204/W020220420582355009892.pdf"]
  ],
  center: {
    title: "浙江温州中考科学",
    sub: "科学探究 · 生命科学 · 物质科学 · 地球宇宙 · 运动能量 · 实验工程"
  },
  nav: [
    ["mindmap", "一、整体思维导图"],
    ["strategy", "二、最小提分策略"],
    ["textbook", "三、浙教版教材主线"],
    ["inquiry", "四、科学探究与实验"],
    ["life", "五、生命科学"],
    ["earth", "六、地球与宇宙"],
    ["matter", "七、物质与化学"],
    ["physics", "八、运动、力、电与能量"],
    ["comprehensive", "九、综合应用"],
    ["formula", "十、公式与速查"]
  ],
  branches: [
    ["科学探究", ["提出问题、作出假设、控制变量", "实验设计、仪器读数、数据处理", "证据推理、模型解释、误差分析"]],
    ["生命科学", ["细胞、组织、器官、系统和生物体", "生殖发育、遗传变异、稳态调节", "生态系统、生物分类、健康生活"]],
    ["物质科学", ["物质性质、密度、溶液、酸碱盐", "粒子观、化学变化、质量守恒", "金属、材料、物质转化和实验制备"]],
    ["地球宇宙", ["地图、经纬网、地形、地壳运动", "天气气候、水循环、太阳地球月球", "资源环境、防灾减灾、可持续发展"]],
    ["运动能量", ["速度、力、压强、浮力、功和机械能", "声光热、电路、电功电功率、电磁", "能量转化与守恒、生活技术应用"]],
    ["综合实践", ["真实情境建模、跨学科解释", "工程设计、方案比较、风险评价", "图表信息、开放探究和科学表达"]]
  ],
  sections: [
    {
      id: "strategy",
      title: "二、最小提分策略",
      tag: "先抓主干",
      note: "科学不是物理、化学、生物、地理碎片相加。中考更看重核心概念、实验探究、数据证据和真实情境迁移。",
      groups: [
        ["优先级", [
          ["sc-strategy-01", "实验先行", "每个专题都要能说出变量、装置、现象、数据和结论。", "只背结论，不会解释实验为什么这样设计。"],
          ["sc-strategy-02", "公式理解", "速度、密度、压强、浮力、电功率等公式能说出物理意义和单位。", "公式会套，但单位和适用条件错。"],
          ["sc-strategy-03", "图表能力", "能读坐标图、柱状图、表格、流程图、装置图。", "只读文字，忽略图中隐藏条件。"],
          ["sc-strategy-04", "核心概念", "围绕结构功能、系统模型、物质能量、运动相互作用建立主线。", "知识点零散，换情境就不会。"],
          ["sc-strategy-05", "错因分类", "标记为概念、计算、实验、图表、审题、表达六类。", "只订正答案，不知道能力短板。"],
          ["sc-strategy-06", "题干翻译", "长情境题先转成科学模型：对象、条件、变化、证据、问题。", "被故事背景干扰，找不到科学问题。"],
          ["sc-strategy-07", "规范表达", "现象和结论分开写，原因要写因果链。", "用生活口语回答，缺科学术语。"],
          ["sc-strategy-08", "周复测", "每周只复测一个薄弱模型，如浮力、酸碱盐、电路或生态。", "刷很多题，但没有形成模型。"]
        ]]
      ]
    },
    {
      id: "textbook",
      title: "三、浙教版教材主线",
      tag: "温州教材",
      note: "温州科学复习要贴合浙教版综合科学体系：七年级重观察与基础概念，八年级重水、天气、调节、电路和运动，九年级重化学、能量、电磁与综合应用。",
      groups: [
        ["七年级上", [
          ["sc-book-7a-01", "科学入门", "科学观察、测量、实验室安全、科学探究基本流程。", "读数不估读，变量不会控制。"],
          ["sc-book-7a-02", "观察生物", "生物与非生物、细胞、组织器官系统、生物分类。", "结构层次顺序和分类依据混乱。"],
          ["sc-book-7a-03", "人类的家园：地球", "地球形状、地图、经纬网、地形、地壳运动、宇宙。", "经纬度、比例尺、方向判断错。"],
          ["sc-book-7a-04", "物质的特性", "物态变化、密度、熔化凝固、汽化液化、物质性质。", "密度和质量体积关系理解不深。"]
        ]],
        ["七年级下", [
          ["sc-book-7b-01", "代代相传的生命", "人的生殖发育、植物一生、动物生长、微生物繁殖。", "生殖方式和发育过程混淆。"],
          ["sc-book-7b-02", "对环境的察觉", "感觉器官、声音、光、透镜、视觉和听觉。", "光路图和成像规律不稳。"],
          ["sc-book-7b-03", "运动和力", "机械运动、速度、力、二力平衡、摩擦、压力。", "参照物、速度单位、受力分析错。"],
          ["sc-book-7b-04", "地球与宇宙", "太阳月球、昼夜四季、月相、日食月食。", "空间想象和周期规律不清。"]
        ]],
        ["八年级上", [
          ["sc-book-8a-01", "水和水的溶液", "水循环、水组成、浮力、溶液、溶解度、物质分离。", "浮力和溶解度图像易错。"],
          ["sc-book-8a-02", "天气与气候", "大气层、气温、气压、风、湿度、降水、天气系统。", "天气与气候、气压与风向关系不清。"],
          ["sc-book-8a-03", "生命活动的调节", "植物激素、人体激素、神经调节、体温调节。", "激素调节和神经调节混淆。"],
          ["sc-book-8a-04", "电路探秘", "电路、电流、电压、电阻、欧姆定律、串并联。", "电路图和实物图转化弱。"]
        ]],
        ["八年级下", [
          ["sc-book-8b-01", "微粒与模型", "原子、分子、离子、元素、化学式、模型建构。", "宏观现象和微观解释脱节。"],
          ["sc-book-8b-02", "空气与生命", "空气成分、氧气、二氧化碳、呼吸、光合作用。", "气体制取和性质检验混乱。"],
          ["sc-book-8b-03", "植物与土壤", "根茎叶结构、蒸腾、矿质营养、土壤和水分吸收。", "结构与功能对应不清。"],
          ["sc-book-8b-04", "电与磁", "磁场、电磁铁、电动机、发电机、电磁感应。", "左右手规则和能量转化混淆。"]
        ]],
        ["九年级", [
          ["sc-book-9-01", "物质及其变化", "酸碱盐、金属、物质转化、化学方程式。", "离子、沉淀、气体和反应条件不清。"],
          ["sc-book-9-02", "能量转化与守恒", "机械能、功、功率、热量、内能、能量效率。", "功和能量关系理解浅。"],
          ["sc-book-9-03", "电能与生活", "电功、电功率、家庭电路、安全用电。", "实际功率、额定功率、电能表计算错。"],
          ["sc-book-9-04", "生命延续与进化", "遗传变异、生物进化、健康与生态。", "基因、性状、变异关系混乱。"],
          ["sc-book-9-05", "资源环境与可持续", "能源、材料、环境污染、防灾减灾、工程设计。", "综合题不会从证据写建议。"]
        ]]
      ]
    },
    {
      id: "inquiry",
      title: "四、科学探究与实验",
      tag: "实验能力",
      note: "浙江科学试题强调真实情境和探究实践。实验题要用“变量、证据、结论、评价”四步处理。",
      groups: [
        ["探究流程", [
          ["sc-inq-01", "提出问题", "把生活现象转化为可研究的科学问题。", "问题太大或不能实验。"],
          ["sc-inq-02", "作出假设", "用已有知识提出可检验的猜想。", "假设和问题不对应。"],
          ["sc-inq-03", "变量控制", "自变量、因变量、控制变量清楚。", "一次改变多个因素。"],
          ["sc-inq-04", "对照实验", "设置实验组和对照组，除研究因素外保持一致。", "对照组缺失或条件不等。"],
          ["sc-inq-05", "重复实验", "多次测量求平均，减少偶然误差。", "只用一次数据下结论。"],
          ["sc-inq-06", "实验安全", "药品取用、加热、闻气体、用电安全、废液处理。", "操作顺序和安全要求错。"],
          ["sc-inq-07", "观察记录", "现象、数据、条件分开记录。", "把结论当现象写。"],
          ["sc-inq-08", "数据处理", "表格、图像、平均值、趋势、异常值。", "不会从数据得趋势。"]
        ]],
        ["实验技能", [
          ["sc-inq-09", "长度体积温度", "刻度尺、量筒、温度计读数和估读。", "视线不平、单位漏写。"],
          ["sc-inq-10", "质量密度", "天平、量筒、排水法、密度计算。", "物体吸水或气泡导致误差不分析。"],
          ["sc-inq-11", "显微镜", "取镜、对光、调焦、制片、绘图。", "高倍镜下找不到物像。"],
          ["sc-inq-12", "气体制取", "氧气、二氧化碳装置选择、收集和检验。", "发生装置和收集方法不匹配。"],
          ["sc-inq-13", "酸碱盐检验", "指示剂、pH、沉淀、气体、离子推断。", "现象和离子反应对应不上。"],
          ["sc-inq-14", "电学实验", "连接电路、滑动变阻器、电表量程、故障判断。", "电流表电压表接法错。"],
          ["sc-inq-15", "力学实验", "弹簧测力计、浮力、摩擦力、杠杆平衡。", "受力对象和方向不清。"],
          ["sc-inq-16", "光学实验", "平面镜、凸透镜成像、光路可逆。", "物距像距和像的性质记混。"]
        ]]
      ]
    },
    {
      id: "life",
      title: "五、生命科学",
      tag: "结构功能",
      note: "生命科学主线是结构与功能、稳态与调节、生殖与遗传、生态与适应。",
      groups: [
        ["细胞与结构层次", [
          ["sc-life-01", "生物特征", "营养、呼吸、排泄、应激、生长、生殖、遗传变异。", "生物与非生物判断依据不完整。"],
          ["sc-life-02", "细胞结构", "细胞膜、细胞质、细胞核、液泡、叶绿体、细胞壁。", "动植物细胞差异混淆。"],
          ["sc-life-03", "显微观察", "放大倍数、视野明暗、物像移动、临时装片。", "玻片移动方向和物像方向反。"],
          ["sc-life-04", "组织器官系统", "细胞-组织-器官-系统-个体结构层次。", "植物没有系统层次。"],
          ["sc-life-05", "生物分类", "分类依据、检索表、种属关系、脊椎/无脊椎。", "分类等级和共同特征关系不清。"]
        ]],
        ["植物生命活动", [
          ["sc-life-06", "种子萌发", "种子结构、水分、空气、温度条件。", "自身条件和外界条件混淆。"],
          ["sc-life-07", "根茎叶", "吸收、运输、蒸腾、支持、光合作用。", "结构和功能对应不清。"],
          ["sc-life-08", "光合作用", "二氧化碳和水生成有机物和氧气，需要光和叶绿体。", "把光合作用和呼吸作用混为一谈。"],
          ["sc-life-09", "呼吸作用", "有机物分解释放能量，消耗氧气产生二氧化碳和水。", "植物白天只光合作用不呼吸的误解。"],
          ["sc-life-10", "蒸腾作用", "水分散失、运输动力、调节温度。", "叶面积、气孔与蒸腾关系不清。"],
          ["sc-life-11", "植物激素", "生长素等调节植物生长和向性。", "向光性原因说不完整。"]
        ]],
        ["人体与健康", [
          ["sc-life-12", "消化吸收", "消化道、消化腺、营养物质、酶和小肠吸收。", "消化和吸收概念混淆。"],
          ["sc-life-13", "呼吸系统", "呼吸道、肺泡、气体交换、呼吸运动。", "肺泡和血液气体交换方向错。"],
          ["sc-life-14", "循环系统", "心脏、血管、血液、体循环和肺循环。", "动脉静脉按含氧量判断错误。"],
          ["sc-life-15", "泌尿排泄", "肾单位、尿液形成、代谢废物排出。", "排泄和排遗混淆。"],
          ["sc-life-16", "神经调节", "反射弧、感受器、神经中枢、效应器。", "简单反射和复杂反射分不清。"],
          ["sc-life-17", "激素调节", "胰岛素、甲状腺激素、生长激素等。", "激素作用特点和分泌异常混乱。"],
          ["sc-life-18", "免疫健康", "传染病、免疫、疫苗、健康生活方式。", "病原体、传染源和传播途径混淆。"]
        ]],
        ["遗传生态", [
          ["sc-life-19", "生殖发育", "有性/无性生殖、受精、胚胎发育、青春期。", "生殖细胞和受精卵关系不清。"],
          ["sc-life-20", "遗传变异", "性状、基因、染色体、可遗传变异。", "变异一定能遗传的误解。"],
          ["sc-life-21", "生物进化", "适应、自然选择、生物多样性。", "用目的论解释进化。"],
          ["sc-life-22", "生态系统", "生产者、消费者、分解者、食物链和食物网。", "箭头方向和能量流动方向错。"],
          ["sc-life-23", "物质循环", "碳循环、水循环、氮循环与生物作用。", "只记名称，不会解释过程。"],
          ["sc-life-24", "生态平衡", "群落、环境因素、人类活动与保护。", "忽略生态系统自我调节有一定限度。"]
        ]]
      ]
    },
    {
      id: "earth",
      title: "六、地球与宇宙",
      tag: "空间系统",
      note: "地球宇宙题重在读图、空间想象、尺度意识和地球系统联系。",
      groups: [
        ["地图与地球", [
          ["sc-earth-01", "地球形状", "证据、地球仪、经线纬线、经纬度。", "东西经、南北纬判断错。"],
          ["sc-earth-02", "地图三要素", "方向、比例尺、图例和注记。", "比例尺换算和方向判断错。"],
          ["sc-earth-03", "等高线地形图", "山峰、山谷、山脊、陡崖、坡度。", "山谷山脊等高线弯曲方向混淆。"],
          ["sc-earth-04", "地球内部", "地壳、地幔、地核，岩石圈和板块。", "地壳和岩石圈概念混淆。"],
          ["sc-earth-05", "地壳运动", "板块运动、火山、地震、山脉形成。", "灾害成因与防护措施分离。"]
        ]],
        ["天气气候水循环", [
          ["sc-earth-06", "大气层", "大气组成、气压、气温垂直变化。", "高度和气温、气压关系不清。"],
          ["sc-earth-07", "天气要素", "气温、气压、风、湿度、降水、云量。", "天气和气候概念混淆。"],
          ["sc-earth-08", "风与气压", "气压差形成风，风向和风力判断。", "风向是风来的方向。"],
          ["sc-earth-09", "天气系统", "冷锋暖锋、台风、梅雨、灾害预警。", "天气图符号不会读。"],
          ["sc-earth-10", "水循环", "蒸发、蒸腾、水汽输送、降水、径流、下渗。", "水循环环节和人类影响不清。"],
          ["sc-earth-11", "水资源", "淡水分布、污染治理、节水和水质。", "把水多等同于可利用淡水多。"]
        ]],
        ["天文空间", [
          ["sc-earth-12", "昼夜与四季", "地球自转公转、太阳直射点、昼夜长短。", "自转和公转影响混淆。"],
          ["sc-earth-13", "月相", "新月、上弦、满月、下弦及周期。", "月相成因和可见时间不清。"],
          ["sc-earth-14", "日食月食", "日地月位置关系和影子。", "日食月食位置关系画错。"],
          ["sc-earth-15", "太阳系", "太阳、行星、卫星、小天体及运动。", "天体层级和尺度混乱。"],
          ["sc-earth-16", "宇宙探索", "航天、卫星、空间站、探测器和科学意义。", "只记事实，不会联系科学问题。"]
        ]]
      ]
    },
    {
      id: "matter",
      title: "七、物质与化学",
      tag: "宏微结合",
      note: "化学类科学题要建立宏观现象、微观粒子、符号表达、实验证据四层联系。",
      groups: [
        ["物质性质", [
          ["sc-matter-01", "物质分类", "纯净物、混合物、单质、化合物、氧化物。", "分类依据混乱。"],
          ["sc-matter-02", "物理化学变化", "是否生成新物质，现象与本质区别。", "有颜色变化就判断为化学变化。"],
          ["sc-matter-03", "密度", "质量、体积、密度关系和图像。", "密度与物体大小混淆。"],
          ["sc-matter-04", "物态变化", "熔化、凝固、汽化、液化、升华、凝华和吸放热。", "白气、水蒸气、雾的区别不清。"],
          ["sc-matter-05", "溶液", "溶质、溶剂、溶液、悬浊液、乳浊液。", "溶液一定无色的误解。"],
          ["sc-matter-06", "溶解度", "饱和溶液、溶解度曲线、结晶。", "温度改变后溶质质量判断错。"]
        ]],
        ["粒子与符号", [
          ["sc-matter-07", "分子原子离子", "粒子观点解释扩散、变化和导电。", "分子变化和原子变化混淆。"],
          ["sc-matter-08", "元素", "元素符号、元素周期表、地壳元素。", "元素和原子概念混淆。"],
          ["sc-matter-09", "化学式", "化学式意义、相对分子质量、元素质量分数。", "下标意义和系数意义混淆。"],
          ["sc-matter-10", "化合价", "常见化合价、根据化合价写化学式。", "原子团化合价不熟。"],
          ["sc-matter-11", "质量守恒", "反应前后原子种类、数目、质量不变。", "把气体质量漏掉。"],
          ["sc-matter-12", "化学方程式", "书写、配平、条件、气体沉淀符号。", "配平改变化学式下标。"]
        ]],
        ["空气与气体", [
          ["sc-matter-13", "空气成分", "氮气、氧气、稀有气体、二氧化碳和水蒸气。", "空气成分体积分数记错。"],
          ["sc-matter-14", "氧气", "制取、收集、助燃、氧化反应。", "检验氧气和二氧化碳方法混淆。"],
          ["sc-matter-15", "二氧化碳", "制取、收集、性质、温室效应、用途。", "CO2 不支持燃烧但不是所有灭火都适用。"],
          ["sc-matter-16", "燃烧灭火", "可燃物、氧气、温度，灭火三原理。", "灭火方法不能对应燃烧条件。"]
        ]],
        ["酸碱盐金属", [
          ["sc-matter-17", "酸碱性", "pH、指示剂、酸性碱性强弱。", "pH 与酸碱强弱关系反了。"],
          ["sc-matter-18", "常见酸", "盐酸、硫酸性质和用途。", "浓硫酸稀释操作不规范。"],
          ["sc-matter-19", "常见碱", "氢氧化钠、氢氧化钙性质和用途。", "变质检验不会设计。"],
          ["sc-matter-20", "中和反应", "酸和碱生成盐和水，pH 变化。", "恰好中和判断依据不清。"],
          ["sc-matter-21", "盐与复分解", "碳酸盐、硫酸盐、氯化物、沉淀气体水。", "反应能否发生判断错。"],
          ["sc-matter-22", "离子检验", "CO3²-, Cl-, SO4²-, NH4+ 等常见检验。", "试剂顺序和干扰离子不考虑。"],
          ["sc-matter-23", "金属活动性", "金属与氧气、酸、盐溶液反应。", "置换反应条件和顺序判断错。"],
          ["sc-matter-24", "金属材料", "合金、锈蚀、防锈、资源回收。", "铁生锈条件不完整。"]
        ]],
        ["计算与转化", [
          ["sc-matter-25", "质量分数", "溶质质量分数、稀释、配制。", "溶液质量和溶质质量混淆。"],
          ["sc-matter-26", "化学计算", "根据方程式计算质量、体积、纯度。", "比例对象不对应。"],
          ["sc-matter-27", "物质推断", "颜色、沉淀、气体、反应关系推断。", "只看单一现象，不联立条件。"],
          ["sc-matter-28", "除杂提纯", "不引新杂质、不减少主要物质、易分离。", "除杂试剂过量后无法处理。"],
          ["sc-matter-29", "装置评价", "发生、净化、干燥、收集、尾气处理。", "装置顺序错。"],
          ["sc-matter-30", "材料与环境", "塑料、金属、玻璃、复合材料和绿色化学。", "只谈用途，不谈性质依据。"]
        ]]
      ]
    },
    {
      id: "physics",
      title: "八、运动、力、电与能量",
      tag: "模型计算",
      note: "物理类题的核心是建模：选对象、画图、列关系、检验单位和范围。",
      groups: [
        ["运动与力", [
          ["sc-phys-01", "参照物", "运动和静止的相对性。", "没说明相对哪个物体。"],
          ["sc-phys-02", "速度", "v=s/t，平均速度、单位换算、图像。", "m/s 与 km/h 换算错。"],
          ["sc-phys-03", "力的作用", "力的三要素、相互作用、力的示意图。", "作用对象和方向画错。"],
          ["sc-phys-04", "重力弹力摩擦", "G=mg，弹簧测力计，摩擦影响因素。", "摩擦力方向凭感觉。"],
          ["sc-phys-05", "二力平衡", "同体、等大、反向、共线。", "平衡力和相互作用力混淆。"],
          ["sc-phys-06", "惯性", "物体保持原运动状态的性质。", "惯性当成力。"],
          ["sc-phys-07", "压强", "p=F/S，固体压强和液体压强。", "受力面积判断错。"],
          ["sc-phys-08", "液体压强", "p=ρgh，与深度和密度有关。", "和液体体积、容器形状混淆。"],
          ["sc-phys-09", "大气压强", "托里拆利实验、吸管、抽水机。", "生活现象解释不完整。"],
          ["sc-phys-10", "浮力", "F浮=ρ液gV排，阿基米德原理。", "V物 和 V排 不分。"],
          ["sc-phys-11", "浮沉条件", "比较 F浮 与 G 或 ρ物 与 ρ液。", "漂浮时 F浮=G 但不是浮力最大。"],
          ["sc-phys-12", "简单机械", "杠杆、滑轮、斜面、机械效率。", "力臂画错，效率大于100%。"]
        ]],
        ["声光热", [
          ["sc-phys-13", "声音", "产生、传播、音调、响度、音色、噪声控制。", "音调和响度混淆。"],
          ["sc-phys-14", "光的直线传播", "影子、小孔成像、日食月食。", "小孔成像大小和倒立原因不清。"],
          ["sc-phys-15", "反射", "反射定律、平面镜成像。", "像距物距和虚像特点错。"],
          ["sc-phys-16", "折射", "光从一种介质进入另一种介质方向改变。", "入射角、折射角判断错。"],
          ["sc-phys-17", "透镜成像", "凸透镜成像规律、照相机、投影仪、放大镜。", "物距范围和像的性质混淆。"],
          ["sc-phys-18", "热现象", "温度、内能、热量、比热容。", "温度高不等于热量多。"],
          ["sc-phys-19", "热传递", "传导、对流、辐射，吸放热。", "热量方向和温差关系不清。"]
        ]],
        ["电学与电磁", [
          ["sc-phys-20", "电路", "电源、开关、用电器、串联并联、电路图。", "短路、断路和通路判断错。"],
          ["sc-phys-21", "电流电压", "电流表串联、电压表并联、量程读数。", "表接法和正负接线柱错。"],
          ["sc-phys-22", "电阻", "材料、长度、横截面积、温度影响。", "电阻和电流大小简单混同。"],
          ["sc-phys-23", "欧姆定律", "I=U/R，伏安法测电阻。", "控制变量和滑变作用不清。"],
          ["sc-phys-24", "串联并联规律", "电流、电压、电阻分配关系。", "串并联总电阻规律反了。"],
          ["sc-phys-25", "电功电功率", "W=UIt，P=UI，额定功率和实际功率。", "额定值和实际值混用。"],
          ["sc-phys-26", "焦耳定律", "Q=I²Rt，电热应用和安全。", "电热与电功关系不清。"],
          ["sc-phys-27", "家庭电路", "火线零线、保险丝、漏保、安全用电。", "开关位置和接地保护不清。"],
          ["sc-phys-28", "磁现象", "磁体、磁极、磁场、磁感线。", "磁感线方向和真实存在误解。"],
          ["sc-phys-29", "电磁铁", "电流大小、线圈匝数、铁芯影响。", "控制变量设计不规范。"],
          ["sc-phys-30", "电动机发电机", "通电导体受力、电磁感应、能量转化。", "两者原理和能量方向混淆。"]
        ]],
        ["能量", [
          ["sc-phys-31", "功与功率", "W=Fs，P=W/t，做功条件。", "有力就一定做功的误解。"],
          ["sc-phys-32", "机械能", "动能、重力势能、弹性势能和转化。", "能量大小影响因素不完整。"],
          ["sc-phys-33", "能量守恒", "能量可以转化和转移，总量守恒。", "把能量消失当结论。"],
          ["sc-phys-34", "效率", "有用功、总功、额外功、机械效率。", "效率和功率混淆。"]
        ]]
      ]
    },
    {
      id: "comprehensive",
      title: "九、综合应用",
      tag: "真实情境",
      note: "综合题要把题干里的真实场景拆成科学模型，再用数据和证据作答。",
      groups: [
        ["综合情境", [
          ["sc-comp-01", "健康管理", "运动、营养、心肺、体温、代谢、数据图表。", "只写生活建议，不用科学依据。"],
          ["sc-comp-02", "环境治理", "水污染、空气污染、微塑料、碳循环、生态保护。", "没有从物质循环和生态角度解释。"],
          ["sc-comp-03", "航天科技", "运动、能量、材料、微生物、空间环境。", "只看新闻背景，忽略科学概念。"],
          ["sc-comp-04", "防灾减灾", "台风、地震、洪涝、用电安全、实验安全。", "措施和灾害成因不对应。"],
          ["sc-comp-05", "工程设计", "明确目标、约束条件、方案比较、测试改进。", "只给方案，不评价优缺点。"],
          ["sc-comp-06", "农业生产", "光合作用、呼吸作用、蒸腾、土壤、气候。", "单一因素解释复杂问题。"],
          ["sc-comp-07", "材料选择", "密度、强度、导电导热、耐腐蚀、环保成本。", "只写“好用”，不联系性质。"],
          ["sc-comp-08", "能源利用", "化石能源、新能源、效率、污染、可持续。", "只说环保，不看能量转化和成本。"]
        ]],
        ["解题表达", [
          ["sc-comp-09", "审题提取", "圈对象、条件、变化、数据、问题。", "长题读完找不到核心问题。"],
          ["sc-comp-10", "模型转换", "把文字转为图、表、公式、流程或因果链。", "直接套公式，模型不对。"],
          ["sc-comp-11", "证据推理", "结论必须由实验现象、数据或图表支持。", "答案只有结论没有证据。"],
          ["sc-comp-12", "开放评价", "从科学性、安全性、经济性、环保性评价方案。", "只写一个角度。"],
          ["sc-comp-13", "误差分析", "仪器、操作、环境、样品、读数造成误差。", "误差原因写成计算错误。"],
          ["sc-comp-14", "规范单位", "所有计算写公式、代入、结果、单位。", "漏单位或单位不统一。"]
        ]]
      ]
    },
    {
      id: "formula",
      title: "十、公式与速查",
      tag: "最后回看",
      note: "公式要配适用条件和单位，不要把科学复习变成公式背诵。",
      groups: [
        ["常用公式", [
          ["sc-formula-01", "速度", "v=s/t；1 m/s=3.6 km/h。", "路程、时间单位不统一。"],
          ["sc-formula-02", "密度", "ρ=m/V；同种物质密度一般一定。", "质量体积改变时密度也改变的误解。"],
          ["sc-formula-03", "重力", "G=mg，g≈9.8 N/kg。", "质量和重力单位混用。"],
          ["sc-formula-04", "压强", "p=F/S；液体 p=ρgh。", "压力不一定等于重力。"],
          ["sc-formula-05", "浮力", "F浮=G排=ρ液gV排。", "漂浮和浸没条件不分。"],
          ["sc-formula-06", "杠杆", "F1L1=F2L2。", "力臂不是力的作用点到支点距离。"],
          ["sc-formula-07", "功", "W=Fs；力和距离方向一致才做功。", "搬着书水平走，重力不做功。"],
          ["sc-formula-08", "功率", "P=W/t。", "功率大不等于做功多。"],
          ["sc-formula-09", "机械效率", "η=W有/W总×100%。", "效率不可能超过100%。"],
          ["sc-formula-10", "欧姆定律", "I=U/R。", "必须是同一导体同一状态。"],
          ["sc-formula-11", "电功", "W=UIt=Pt。", "电能表单位 kW·h 换算焦耳。"],
          ["sc-formula-12", "电功率", "P=UI=I²R=U²/R。", "公式适用条件和已知量不匹配。"],
          ["sc-formula-13", "焦耳定律", "Q=I²Rt。", "纯电阻电路中电热等于电功。"],
          ["sc-formula-14", "比热容", "Q=cmΔt。", "温度变化量和末温初温不分。"],
          ["sc-formula-15", "溶质质量分数", "w=m溶质/m溶液×100%。", "溶液质量不是溶剂质量。"],
          ["sc-formula-16", "化学方程式计算", "按化学方程式中各物质质量比列比例。", "未先配平就计算。"]
        ]],
        ["关键结论", [
          ["sc-formula-17", "串联电路", "I 相等，U 分配，R总=R1+R2。", "电压电流规律混淆。"],
          ["sc-formula-18", "并联电路", "U 相等，I 分流，1/R总=1/R1+1/R2。", "总电阻比任一支路电阻大。"],
          ["sc-formula-19", "酸碱盐反应条件", "有沉淀、气体或水生成，反应更可能发生。", "所有酸碱盐混合都反应的误解。"],
          ["sc-formula-20", "生态能量流动", "单向流动、逐级递减，物质循环反复进行。", "能量循环的误解。"]
        ]]
      ]
    }
  ]
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function countItems(page) {
  return page.sections.reduce((total, section) => total + section.groups.reduce((sum, group) => sum + group[1].length, 0), 0);
}

function renderRows(rows, groupTitle) {
  return rows.map(row => {
    const [id, point, check, risk] = row.length === 4
      ? row
      : [row[0], row[2], row[3], row[4]];
    return `
            <tr>
              <td><input type="checkbox" data-id="${esc(id)}"></td>
              <td>${esc(groupTitle)}</td>
              <td>${esc(point)}</td>
              <td>${esc(check)}</td>
              <td>${esc(risk || "")}</td>
            </tr>`;
  }).join("");
}

function renderSection(section) {
  return `
    <section id="${esc(section.id)}">
      <div class="section-head">
        <div>
          <h2>${esc(section.title)}</h2>
          <p class="section-note">${esc(section.note)}</p>
        </div>
        <span class="tag">${esc(section.tag)}</span>
      </div>
      ${section.groups.map(([title, rows]) => `
      <h3 class="group-title">${esc(title)}</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>掌握</th>
              <th>板块</th>
              <th>知识点/能力点</th>
              <th>掌握标准</th>
              <th>易错点</th>
            </tr>
          </thead>
          <tbody>${renderRows(rows, title)}
          </tbody>
        </table>
      </div>`).join("")}
    </section>`;
}

function renderPage(page) {
  const total = countItems(page);
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)}</title>
  <style>
    :root {
      --bg: #f4f6f8;
      --panel: #ffffff;
      --ink: #17202a;
      --muted: #667381;
      --line: #dce3ea;
      --blue: #1f6feb;
      --blue-soft: #eaf2ff;
      --green: #248457;
      --green-soft: #e8f6ef;
      --amber: #a45f07;
      --amber-soft: #fff3d9;
      --shadow: 0 8px 24px rgba(20, 32, 43, .08);
      font-family: "Microsoft YaHei", "PingFang SC", "Segoe UI", Arial, sans-serif;
    }
    * { box-sizing: border-box; }
    body { margin: 0; color: var(--ink); background: var(--bg); line-height: 1.65; }
    .page { width: min(1180px, 100%); margin: 0 auto; padding: 18px 14px 44px; }
    header, nav, section, .toolbar {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 10px;
      box-shadow: var(--shadow);
      padding: 18px;
      margin-bottom: 14px;
    }
    h1 { margin: 0 0 8px; font-size: clamp(24px, 4vw, 40px); line-height: 1.2; }
    h2 { margin: 0; font-size: 22px; line-height: 1.35; }
    h3 { margin: 0; }
    .subtitle, .section-note, .note-box, .source-list, .foot { color: var(--muted); }
    .subtitle { max-width: 900px; margin: 0 0 14px; }
    .note-box {
      border: 1px solid #cfe0ff;
      border-radius: 10px;
      background: #f7fbff;
      padding: 12px;
      color: #174ea6;
      font-weight: 700;
    }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      align-items: center;
      gap: 12px;
    }
    .progress-label { display: flex; justify-content: space-between; gap: 10px; font-size: 13px; color: var(--muted); margin-bottom: 5px; }
    .bar { height: 10px; border-radius: 999px; overflow: hidden; background: #e8edf2; }
    .bar span { display: block; height: 100%; width: 0; background: var(--green); }
    button {
      min-height: 38px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fff;
      color: var(--ink);
      padding: 8px 12px;
      cursor: pointer;
    }
    nav strong { display: block; margin-bottom: 10px; }
    .nav-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    a { color: #174ea6; text-decoration: none; }
    .nav-grid a, .source-list a {
      border: 1px solid #cfe0ff;
      border-radius: 999px;
      background: var(--blue-soft);
      padding: 6px 10px;
      font-size: 13px;
      font-weight: 700;
    }
    .section-head { display: flex; justify-content: space-between; gap: 14px; align-items: flex-start; margin-bottom: 14px; }
    .tag {
      display: inline-flex;
      white-space: nowrap;
      border: 1px solid #cbead8;
      border-radius: 999px;
      background: var(--green-soft);
      color: #1d6443;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 800;
    }
    .mindmap {
      border: 1px solid #cfe0ff;
      border-radius: 12px;
      background: linear-gradient(180deg, #f7fbff, #fff);
      padding: 16px;
    }
    .map-center {
      width: min(420px, 100%);
      margin: 0 auto 14px;
      border: 2px solid #9cc3ff;
      border-radius: 16px;
      background: #fff;
      padding: 16px;
      text-align: center;
      color: #174ea6;
      font-size: 24px;
      font-weight: 900;
    }
    .map-center span { display: block; margin-top: 6px; color: var(--muted); font-size: 13px; font-weight: 600; }
    .map-branches { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
    .map-node {
      border: 1px solid var(--line);
      border-radius: 10px;
      background: #fff;
      padding: 12px;
    }
    .map-node h3 { color: #174ea6; font-size: 16px; margin-bottom: 6px; }
    .map-node:nth-child(2n) h3 { color: #1d6443; }
    .map-node:nth-child(3n) h3 { color: #704306; }
    .map-node ul { margin: 0; padding-left: 18px; color: var(--muted); font-size: 13px; }
    .group-title {
      margin: 16px 0 8px;
      color: #174ea6;
      font-size: 17px;
    }
    .table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 10px; margin-bottom: 8px; }
    table { width: 100%; min-width: 900px; border-collapse: collapse; background: #fff; }
    th, td { border-bottom: 1px solid var(--line); padding: 9px 10px; vertical-align: top; font-size: 13px; }
    th { background: #f7f9fb; text-align: left; color: #506070; white-space: nowrap; }
    th:first-child, td:first-child { width: 56px; text-align: center; }
    td:nth-child(2) { width: 150px; font-weight: 800; color: #1d6443; }
    td:nth-child(3) { width: 260px; font-weight: 700; }
    input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--green); }
    .source-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .foot { text-align: center; font-size: 13px; margin-top: 18px; }
    @media (max-width: 760px) {
      .page { padding: 10px 10px 28px; }
      header, nav, section, .toolbar { padding: 12px; border-radius: 8px; }
      .toolbar { position: static; grid-template-columns: 1fr; }
      .map-branches { grid-template-columns: 1fr; }
      .section-head { display: grid; }
      table { min-width: 760px; font-size: 12px; }
      th, td { padding: 8px; }
    }
    @media print {
      .toolbar, nav { display: none; }
      body { background: #fff; }
      header, section { box-shadow: none; break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="page">
    <header>
      <h1>${esc(page.title)}</h1>
      <p class="subtitle">${esc(page.subtitle)}</p>
      <div class="note-box">使用方式：逐项检查“是否掌握”。能独立解释概念、完成典型题、说清易错点，才建议勾选。本页共 ${total} 个检查点，勾选状态保存在本机浏览器。</div>
      <div class="source-list">
        ${page.sources.map(([label, href]) => `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}</a>`).join("")}
      </div>
    </header>

    <div class="toolbar">
      <div>
        <div class="progress-label"><span>查漏补缺进度</span><span id="progressText">0 / ${total}</span></div>
        <div class="bar"><span id="progressBar"></span></div>
      </div>
      <button id="resetBtn" type="button">清空勾选</button>
      <button type="button" onclick="window.print()">打印或导出 PDF</button>
    </div>

    <nav>
      <strong>目录</strong>
      <div class="nav-grid">
        ${page.nav.map(([id, label]) => `<a href="#${esc(id)}">${esc(label)}</a>`).join("")}
      </div>
    </nav>

    <section id="mindmap">
      <div class="section-head">
        <div>
          <h2>一、整体思维导图</h2>
          <p class="section-note">先用总图定位知识板块，再下钻到后面的检查表。适合每周复盘时快速确认薄弱板块。</p>
        </div>
        <span class="tag">知识脉络</span>
      </div>
      <div class="mindmap" aria-label="${esc(page.center.title)}知识思维导图">
        <div class="map-center">${esc(page.center.title)}<span>${esc(page.center.sub)}</span></div>
        <div class="map-branches">
          ${page.branches.map(([title, items]) => `
          <div class="map-node">
            <h3>${esc(title)}</h3>
            <ul>${items.map(item => `<li>${esc(item)}</li>`).join("")}</ul>
          </div>`).join("")}
        </div>
      </div>
    </section>

    ${page.sections.map(renderSection).join("")}

    <p class="foot">本表用于浙江温州初中${page.file.includes("english") ? "英语" : "科学"}中考查漏补缺。勾选状态保存在本机浏览器中。</p>
  </div>

  <script>
    const storagePrefix = ${JSON.stringify(page.storagePrefix)};
    const boxes = Array.from(document.querySelectorAll('input[type="checkbox"][data-id]'));
    const progressText = document.getElementById('progressText');
    const progressBar = document.getElementById('progressBar');
    const resetBtn = document.getElementById('resetBtn');

    function updateProgress() {
      const done = boxes.filter(box => box.checked).length;
      progressText.textContent = done + ' / ' + boxes.length;
      progressBar.style.width = boxes.length ? Math.round(done / boxes.length * 100) + '%' : '0%';
    }

    boxes.forEach(box => {
      box.checked = localStorage.getItem(storagePrefix + box.dataset.id) === '1';
      box.addEventListener('change', () => {
        localStorage.setItem(storagePrefix + box.dataset.id, box.checked ? '1' : '0');
        updateProgress();
      });
    });

    resetBtn.addEventListener('click', () => {
      if (!confirm('确定清空本页所有勾选记录？')) return;
      boxes.forEach(box => {
        box.checked = false;
        localStorage.removeItem(storagePrefix + box.dataset.id);
      });
      updateProgress();
    });

    updateProgress();
  </script>
</body>
</html>
`;
}

fs.mkdirSync(outDir, { recursive: true });
for (const page of [english, science]) {
  fs.writeFileSync(path.join(outDir, page.file), renderPage(page), "utf8");
  console.log(`${page.file}: ${countItems(page)} checklist items`);
}
