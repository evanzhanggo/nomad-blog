import { describe, expect, it } from "vitest";
import { handle } from "../src/index";
import { renderAbout, renderItem } from "../src/render";
import type { Env, ItemRow } from "../src/types";

const origin = "https://nomad.evanzhang.cloud";

function row(overrides: Partial<ItemRow> = {}): ItemRow {
  return {
    id: 7,
    canonical_url: "https://example.com/card",
    title: "港卡开户教程",
    excerpt: "原来的摘要",
    source_id: "kannetflix",
    source_name: "看奈飞",
    author: null,
    published_at: "2026-05-19T08:00:00.000Z",
    collected_at: "2026-11-22T00:00:00.000Z",
    popularity: 0,
    popularity_label: "",
    tags: "",
    language: "zh",
    discussion_url: null,
    topic: "bank",
    quality_score: 60,
    section: "daily",
    ...overrides,
  };
}

describe("brand icons", () => {
  it("serves the svg, pngs, and ico with a long cache", async () => {
    const env = {} as Env;
    const svg = await handle(new Request(`${origin}/favicon.svg`), env);
    expect(svg.headers.get("content-type")).toContain("image/svg+xml");
    expect(svg.headers.get("cache-control")).toContain("max-age=2592000");
    expect(await svg.text()).toContain("#0c5f57");

    for (const path of ["/og.png", "/icon-512.png", "/apple-touch-icon.png"]) {
      const response = await handle(new Request(`${origin}${path}`), env);
      const bytes = new Uint8Array(await response.arrayBuffer());
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe("image/png");
      expect(response.headers.get("cache-control")).toContain("max-age=2592000");
      expect(bytes[0]).toBe(0x89);
      expect(bytes[1]).toBe(0x50);
    }

    const ico = await handle(new Request(`${origin}/favicon.ico`), env);
    expect(ico.headers.get("content-type")).toBe("image/x-icon");
    expect(ico.headers.get("cache-control")).toContain("max-age=2592000");
  });
});

describe("share tags", () => {
  it("adds absolute open graph and twitter tags on every page", () => {
    const html = renderAbout(origin);
    expect(html).toContain('rel="icon" href="/favicon.svg" type="image/svg+xml"');
    expect(html).toContain('rel="icon" href="/icon-512.png" type="image/png"');
    expect(html).toContain('rel="apple-touch-icon" href="/apple-touch-icon.png"');
    expect(html).toContain('property="og:title" content="关于 · 游牧手记"');
    expect(html).toContain('property="og:image" content="https://nomad.evanzhang.cloud/og.png"');
    expect(html).toContain('property="og:url" content="https://nomad.evanzhang.cloud/about"');
    expect(html).toContain('property="og:type" content="website"');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
    expect(html).toContain('name="twitter:image" content="https://nomad.evanzhang.cloud/og.png"');
  });

  it("uses the article title and AI summary on detail pages", () => {
    const html = renderItem(row({ title: "港卡<script>", ai_summary: "两句简体中文摘要。" }), origin);
    expect(html).toContain('property="og:title" content="港卡&lt;script&gt;"');
    expect(html).toContain('property="og:description" content="两句简体中文摘要。"');
    expect(html).toContain('name="twitter:description" content="两句简体中文摘要。"');
    expect(html).toContain('property="og:type" content="article"');
    expect(html).toContain('property="og:image" content="https://nomad.evanzhang.cloud/og.png"');
  });
});
