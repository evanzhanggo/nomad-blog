import { parseFeed } from "./feed";
import { buildDraft, byRank, dedupeDrafts, withTag } from "./item";
import { fetchText } from "./text";
import type { Draft, Source } from "./types";
import { fetchXAccount, X_ACCOUNTS } from "./x";

/**
 * 中文、且尽量是各站自己的 RSS。V2EX 官方接口和 linux.do 在 Cloudflare 上会 403，
 * rsshub.app 会拒绝这个采集器，云居民的 feed 会落到验证页，所以都没有接。
 * 少数派和电鸭仍会抓，但只有跨过质量线的指南才会留下。
 * X 账号不走官方 API，见 src/x.ts。每个账号单独成一个来源，失败不会挡住下面的 RSS。
 */

interface FeedSpec {
  id: string;
  name: string;
  url: string;
  dailyLimit: number;
  tag?: string;
}

export const FEEDS: FeedSpec[] = [
  { id: "kannetflix", name: "看奈飞", url: "https://kannetflix.com/index.xml", dailyLimit: 8 },
  { id: "ttshuoka", name: "TT说卡", url: "https://www.ttshuoka.com/blog/rss.xml", dailyLimit: 6 },
  { id: "jarodise", name: "数字游民部落", url: "https://jarodise.com/rss.xml", dailyLimit: 6 },
  {
    id: "turtlegirl",
    name: "乌龟妹出走旅行",
    url: "https://turtlegirltravel.com/category/digital-nomad/feed/",
    dailyLimit: 4,
  },
  { id: "looktheworld", name: "Look the World", url: "https://www.looktheworld.com/changes.xml", dailyLimit: 4, tag: "visa" },
  { id: "rososa", name: "爱沙尼亚电子居民社区", url: "https://rososa.com/feed/", dailyLimit: 4 },
  { id: "sspai", name: "少数派", url: "https://sspai.com/feed", dailyLimit: 3 },
  { id: "eleduck", name: "电鸭社区", url: "https://eleduck.com/feed/latest.xml", dailyLimit: 4 },
];

function qualify(entries: ReturnType<typeof parseFeed>, spec: FeedSpec): Draft[] {
  return dedupeDrafts(
    entries
      .map((entry) => {
        const draft = buildDraft({
          url: entry.url,
          title: entry.title,
          excerpt: entry.excerpt,
          sourceId: spec.id,
          sourceName: spec.name,
          author: entry.author,
          publishedAt: entry.publishedAt,
          contentHtml: entry.contentHtml,
        });
        return spec.tag && draft ? withTag(draft, spec.tag) : draft;
      })
      .filter((item): item is Draft => item !== null),
  ).sort(byRank);
}

export async function qualifyFeed(spec: FeedSpec, limit: number): Promise<Draft[]> {
  const entries = parseFeed(await fetchText(spec.url));
  return qualify(entries, spec).slice(0, limit);
}

export const SOURCES: Source[] = [
  ...FEEDS.map((spec) => ({
    id: spec.id,
    name: spec.name,
    hint: spec.url,
    fetch: () => qualifyFeed(spec, spec.dailyLimit),
  })),
  ...X_ACCOUNTS.map((account) => ({
    id: account.id,
    name: account.name,
    hint: `https://x.com/${account.handle}`,
    fetch: () => fetchXAccount(account),
  })),
];

export function knownSource(id: string): Source | undefined {
  return SOURCES.find((source) => source.id === id);
}
