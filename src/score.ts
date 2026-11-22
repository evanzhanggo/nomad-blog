export const MIN_QUALITY_SCORE = 40;

export interface TopicDef {
  id: string;
  label: string;
  /** 命中标题或摘要即计入。第一组是主题词，权重更高。 */
  patterns: Array<{ re: RegExp; weight: number; primary?: boolean }>;
}

/**
 * 美卡、英卡、PayPal、IBAN、红包卡、Google AI 的权重停在 22。
 * 只出现在标题里还到不了 40 分，短帖不会因为这些词被放进来。
 */
export const TOPICS: TopicDef[] = [
  {
    id: "bank",
    label: "海外开卡",
    patterns: [
      { re: /港卡|香港银行|香港银行卡|汇丰|中银香港|众安银行|蚂蚁银行|天星银行|虚拟银行|银行卡开户/i, weight: 28, primary: true },
      { re: /美卡|英卡|PayPal|IBAN/i, weight: 22, primary: true },
      { re: /开户|U\s*卡|虚拟卡|\bWise\b|万里汇|收款账户/i, weight: 14 },
    ],
  },
  {
    id: "sim",
    label: "海外手机卡",
    patterns: [
      { re: /紫卡|giffgaff|保号|eSIM|香港手机号|电话卡|手机卡|Club\s*SIM|英国号|香港号/i, weight: 28, primary: true },
      { re: /红包卡|Red\s*Pocket|Google\s*Fi/i, weight: 22, primary: true },
      { re: /验证码|漫游|实名/i, weight: 8 },
    ],
  },
  {
    id: "tax",
    label: "海外税号",
    patterns: [
      { re: /\bITIN\b|税号|税务居民|\bTIN\b|报税|W-7/i, weight: 28, primary: true },
      { re: /税务|增值税|电子居民/i, weight: 12 },
    ],
  },
  {
    id: "ai",
    label: "海外 AI 订阅",
    patterns: [
      { re: /ChatGPT|Claude|OpenAI|Apple\s*ID|美区|外区|Gemini/i, weight: 26, primary: true },
      { re: /Google\s*AI|谷歌\s*AI/i, weight: 22, primary: true },
      { re: /订阅|Plus|礼品卡|虚拟卡/i, weight: 10 },
    ],
  },
  {
    id: "visa",
    label: "数字游民签证",
    patterns: [
      { re: /数字游民签证|數位遊牧簽證|游民签证|DNV|居留许可/i, weight: 30, primary: true },
      { re: /签证|簽證|居留|永居|移民|电子居民/i, weight: 16 },
    ],
  },
  {
    id: "remote",
    label: "远程工作",
    patterns: [
      { re: /远程工作|遠端工作|远程办公|数字游民|數位遊牧/i, weight: 24, primary: true },
      { re: /自由职业|一人公司|异步办公/i, weight: 12 },
    ],
  },
  {
    id: "broker",
    label: "海外券商",
    patterns: [
      { re: /券商|盈透|\bIBKR\b|富途|老虎证券|美股开户|港股通|出入金/i, weight: 28, primary: true },
      { re: /美股|港股|经纪账户/i, weight: 12 },
    ],
  },
];

const TOPIC_BY_ID = new Map(TOPICS.map((topic) => [topic.id, topic]));

export function topicById(id: string): TopicDef | undefined {
  return TOPIC_BY_ID.get(id);
}

const GUIDE = /指南|教程|攻略|手把手|实测|流程|步骤|如何|开户|保号|申请/;
const CHATTER = /呢[？?]?$|大家怎么|请问|求助|吐槽|闲聊|空虚|摸鱼|各位都在/;
const REJECT = /招聘|内推|招一位|招人|岗位更新|接单|外包|美工|诚邀|派单|月薪|底薪|急招|在招|兼职/;

export interface Quality {
  topic: string;
  score: number;
  rejected: boolean;
  reason: string;
}

export function scoreQuality(title: string, excerpt: string, popularity = 0): Quality {
  const haystack = `${title}\n${excerpt}`;
  if (REJECT.test(haystack)) {
    return { topic: "", score: 0, rejected: true, reason: "招聘、派单或广告" };
  }

  let bestId = "";
  let best = 0;
  let primaryInTitle = false;
  for (const topic of TOPICS) {
    let points = 0;
    let primary = false;
    for (const pattern of topic.patterns) {
      if (!pattern.re.test(haystack)) continue;
      points += pattern.weight;
      if (pattern.primary && pattern.re.test(title)) primary = true;
    }
    if (points > best) {
      best = points;
      bestId = topic.id;
      primaryInTitle = primary;
    }
  }

  if (!bestId || best < 12) {
    return { topic: "", score: best, rejected: false, reason: "没有对上核心主题" };
  }

  const length = Array.from(excerpt).length;
  const lengthScore = length >= 180 ? 18 : length >= 100 ? 12 : length >= 40 ? 6 : 0;
  const guideScore = GUIDE.test(haystack) ? 16 : 0;
  const titleScore = primaryInTitle ? 14 : 0;
  const engagement = popularity >= 20 ? 10 : popularity >= 5 ? 6 : popularity >= 1 ? 3 : 0;
  const chatterPenalty = CHATTER.test(title) && !/指南|教程|攻略|实测/.test(title) ? 24 : 0;
  const score = best + lengthScore + guideScore + titleScore + engagement - chatterPenalty;
  return {
    topic: bestId,
    score,
    rejected: false,
    reason: `主题${best}+篇幅${lengthScore}+指南${guideScore}+标题${titleScore}+热度${engagement}-闲聊${chatterPenalty}`,
  };
}

export function passesQuality(title: string, excerpt: string, popularity = 0): boolean {
  const quality = scoreQuality(title, excerpt, popularity);
  return !quality.rejected && quality.score >= MIN_QUALITY_SCORE && quality.topic !== "";
}
