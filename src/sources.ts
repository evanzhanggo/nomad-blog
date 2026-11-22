import { parseFeed } from "./feed";
import { buildDraft, byRank, dedupeDrafts, withTag } from "./item";
import { fetchText } from "./text";
import type { Draft, Source } from "./types";

/**
 * 只收中文来源，而且用各站自己的 RSS，不经过 V2EX 官方接口。
 * V2EX 从 Cloudflare 的出口 IP 会返回 HTTP 403。rsshub.app 也会拒绝这个采集器。
 *
 * 2026-11-22 实测能打开、并且标题以中文为主：
 * - 电鸭社区
 * - Look the World 的签证与移居动态
 * - 数字游民部落 Jarodise
 * - 乌龟妹的数位游牧分类
 * - 爱沙尼亚电子居民社区
 */

const NOMAD_TOPIC =
  /数字游民|數位遊牧|数位游牧|游民|遊牧|远程|遠端|遠程|签证|簽證|旅居|海外|自由职业|自由職業|一人公司|居留|移民|电子居民|電子居民|税务|稅務|nomad/i;

function top(items: Array<Draft | null>, limit: number): Draft[] {
  const ready = dedupeDrafts(items.filter((item): item is Draft => item !== null)).sort(byRank);
  if (!ready.length) throw new Error("no items");
  return ready.slice(0, limit);
}

async function fetchFeed(options: {
  url: string;
  sourceId: string;
  sourceName: string;
  limit: number;
  authorFallback?: string;
  topicOnly?: boolean;
  tag?: string;
}): Promise<Draft[]> {
  const entries = parseFeed(await fetchText(options.url));
  return top(
    entries.map((entry) => {
      const draft = buildDraft({
        url: entry.url,
        title: entry.title,
        excerpt: entry.excerpt,
        sourceId: options.sourceId,
        sourceName: options.sourceName,
        author: entry.author ?? options.authorFallback ?? null,
        publishedAt: entry.publishedAt,
      });
      if (!draft) return null;
      if (options.topicOnly && !NOMAD_TOPIC.test(`${draft.title}\n${draft.excerpt}`)) return null;
      return options.tag ? withTag(draft, options.tag) : draft;
    }),
    options.limit,
  );
}

export const SOURCES: Source[] = [
  {
    id: "eleduck",
    name: "电鸭社区",
    hint: "https://eleduck.com/feed/latest.xml",
    fetch: () =>
      fetchFeed({
        url: "https://eleduck.com/feed/latest.xml",
        sourceId: "eleduck",
        sourceName: "电鸭社区",
        limit: 10,
      }),
  },
  {
    id: "looktheworld",
    name: "Look the World",
    hint: "https://www.looktheworld.com/changes.xml",
    fetch: () =>
      fetchFeed({
        url: "https://www.looktheworld.com/changes.xml",
        sourceId: "looktheworld",
        sourceName: "Look the World",
        limit: 8,
        tag: "visa",
      }),
  },
  {
    id: "jarodise",
    name: "数字游民部落",
    hint: "https://jarodise.com/rss.xml",
    fetch: () =>
      fetchFeed({
        url: "https://jarodise.com/rss.xml",
        sourceId: "jarodise",
        sourceName: "数字游民部落",
        limit: 8,
        topicOnly: true,
      }),
  },
  {
    id: "turtlegirl",
    name: "乌龟妹出走旅行",
    hint: "https://turtlegirltravel.com/category/digital-nomad/feed/",
    fetch: () =>
      fetchFeed({
        url: "https://turtlegirltravel.com/category/digital-nomad/feed/",
        sourceId: "turtlegirl",
        sourceName: "乌龟妹出走旅行",
        limit: 6,
      }),
  },
  {
    id: "rososa",
    name: "爱沙尼亚电子居民社区",
    hint: "https://rososa.com/feed/",
    fetch: () =>
      fetchFeed({
        url: "https://rososa.com/feed/",
        sourceId: "rososa",
        sourceName: "爱沙尼亚电子居民社区",
        limit: 6,
      }),
  },
];

export function knownSource(id: string): Source | undefined {
  return SOURCES.find((source) => source.id === id);
}
