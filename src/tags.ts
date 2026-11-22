export interface TagDef {
  id: string;
  label: string;
  pattern: RegExp;
}

/** 顺序就是优先级：一条最多保留前 4 个命中的标签。 */
export const TAGS: TagDef[] = [
  {
    id: "visa",
    label: "签证",
    pattern:
      /visa|passport|residency|golden visa|nomad visa|dnv|移民|签证|簽證|居留|永居|国籍|电子居民|電子居民|数字游民签|數位遊牧簽/i,
  },
  {
    id: "taxes",
    label: "税务",
    pattern: /\btax(?:es|ation)?\b|irs\b|vat\b|税务|报税|税收|个税|税务居民/i,
  },
  {
    id: "jobs",
    label: "远程工作",
    pattern:
      /hiring|we're hiring|\bjobs?\b|\bremote\b|career|salary|recruit|远程|招聘|内推|岗位|职位/i,
  },
  {
    id: "cost",
    label: "生活成本",
    pattern: /cost of living|budget|expenses|生活成本|物价|开销|每月花费|花费报告/i,
  },
  {
    id: "cities",
    label: "城市",
    pattern:
      /chiang mai|bali|lisbon|porto|bangkok|mexico city|medell[ií]n|tbilisi|buenos aires|da nang|penang|kuala lumpur|tokyo|taipei|seoul|清迈|曼谷|巴厘|里斯本|波尔图|墨西哥城|第比利斯|岘港|槟城|吉隆坡|东京|台北|城市指南|where to (?:live|stay)|best (?:cities|places) for/i,
  },
  {
    id: "housing",
    label: "住宿",
    pattern: /apartment|\brent(?:ing|al)?\b|airbnb|accommodation|coliving|住房|租房|住宿|民宿|长租/i,
  },
  {
    id: "coworking",
    label: "联合办公",
    pattern: /cowork|co-working|联合办公|共享办公|coworking/i,
  },
  {
    id: "insurance",
    label: "保险",
    pattern: /insurance|safetywing|health cover|保险|医疗险/i,
  },
  {
    id: "finance",
    label: "财务",
    pattern: /\bbank(?:ing)?\b|wise\b|revolut|paypal|stripe|多币种|银行|收款|跨境支付|发票|currency/i,
  },
  {
    id: "tools",
    label: "工具",
    pattern: /\bvpn\b|notion|obsidian|slack|vscode|figma|工具|软件|效率/i,
  },
  {
    id: "legal",
    label: "法律与合规",
    pattern: /\blegal\b|compliance|\bllc\b|incorporation|合规|公司注册|法律|合同/i,
  },
  {
    id: "gear",
    label: "装备",
    pattern: /\bgear\b|packing list|backpack|装备|行李|行李清单/i,
  },
  {
    id: "travel",
    label: "旅行",
    pattern: /\btravel\b|\bflight\b|backpacker|行程|旅行|航班|机票|游记|旅居/i,
  },
  {
    id: "community",
    label: "社区",
    pattern: /community|meetup|discord|社区|聚会|交流群/i,
  },
  {
    id: "howto",
    label: "教程",
    pattern: /how to|guide|tutorial|教程|指南|入门|手把手|攻略/i,
  },
];

const TAG_BY_ID = new Map(TAGS.map((tag) => [tag.id, tag]));

export function tagString(title: string, excerpt: string): string {
  const haystack = `${title}\n${excerpt}`;
  const ids = TAGS.filter((tag) => tag.pattern.test(haystack)).map((tag) => tag.id);
  const picked = ids.slice(0, 4);
  return picked.length ? `|${picked.join("|")}|` : "";
}

export function parseTags(stored: string): Array<{ id: string; label: string }> {
  return stored
    .split("|")
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id) => {
      const known = TAG_BY_ID.get(id);
      return known ? { id, label: known.label } : null;
    })
    .filter((tag): tag is { id: string; label: string } => tag !== null);
}

export function knownTag(id: string): TagDef | undefined {
  return TAG_BY_ID.get(id);
}
