import { describe, expect, it } from "vitest";
import { DAILY_LIMIT, loadSource, selectFresh } from "../src/collect";
import type { Draft, Source } from "../src/types";

function draft(sourceId: string, slug: string, rankScore: number): Draft {
  return {
    canonicalUrl: `https://example.com/${sourceId}/${slug}`,
    title: `${sourceId} ${slug}`,
    excerpt: "excerpt",
    sourceId,
    sourceName: sourceId,
    author: null,
    publishedAt: null,
    popularity: rankScore,
    popularityLabel: "分",
    discussionUrl: null,
    rankScore,
    tags: "",
    language: "en",
  };
}

describe("selectFresh", () => {
  it("keeps one slot per source, then fills by score, and skips urls already stored", () => {
    const items = [
      draft("hn", "old", 200),
      draft("hn", "new", 50),
      draft("eleduck", "a", 2),
      draft("medium", "a", 1),
      draft("hn", "new", 50),
    ];
    const { picked, duplicates, capped } = selectFresh(items, new Set(["https://example.com/hn/old"]), 3);
    expect(duplicates).toBe(1);
    expect(picked.map((item) => item.canonicalUrl)).toEqual([
      "https://example.com/hn/new",
      "https://example.com/eleduck/a",
      "https://example.com/medium/a",
    ]);
    expect(capped).toBe(0);
  });

  it("caps a single source at the daily limit", () => {
    const items = Array.from({ length: 20 }, (_, index) => draft("hn", String(index), 20 - index));
    const { picked, capped } = selectFresh(items, new Set(), DAILY_LIMIT);
    expect(picked).toHaveLength(DAILY_LIMIT);
    expect(capped).toBe(20 - DAILY_LIMIT);
    expect(picked[0]?.rankScore).toBe(20);
  });
});

describe("loadSource", () => {
  it("isolates a failing source", async () => {
    const source: Source = {
      id: "bad",
      name: "坏掉的来源",
      hint: "https://example.com/feed",
      fetch: async () => {
        throw new Error("HTTP 403");
      },
    };
    const result = await loadSource(source);
    expect(result.ok).toBe(false);
    expect(result.items).toEqual([]);
    expect(result.error).toContain("403");
  });
});
