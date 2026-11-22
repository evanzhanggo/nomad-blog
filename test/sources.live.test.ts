import { describe, expect, it } from "vitest";
import { loadSource, runCollect } from "../src/collect";
import { handle } from "../src/index";
import { SOURCES } from "../src/sources";
import { EXCERPT_MAX } from "../src/text";
import type { Env } from "../src/types";
import { createTestDb } from "./fake-d1";

async function loadOnce(source: (typeof SOURCES)[number]) {
  const first = await loadSource(source);
  if (first.ok && first.items.length > 0) return first;
  await new Promise((resolve) => setTimeout(resolve, 600));
  console.error("retrying", source.id, first.error);
  return loadSource(source);
}

describe("live sources", () => {
  for (const source of SOURCES) {
    it(`fetches real items from ${source.id}`, async () => {
      const result = await loadOnce(source);
      expect(result.error, result.error ?? "").toBeNull();
      expect(result.ok).toBe(true);
      expect(result.items.length).toBeGreaterThan(0);
      for (const item of result.items) {
        expect(item.title.length).toBeGreaterThan(0);
        expect(item.canonicalUrl).toMatch(/^https:\/\//);
        expect(Array.from(item.excerpt).length).toBeLessThanOrEqual(EXCERPT_MAX);
        expect(item.excerpt.includes("<script")).toBe(false);
        expect(item.sourceId).toBe(source.id);
        expect(item.sourceName.length).toBeGreaterThan(0);
      }
      const sample = result.items[0];
      console.log(
        `SOURCE ${source.id} fetched=${result.items.length} author=${sample?.author ?? "未知"} title=${sample?.title}`,
      );
    });
  }
});

describe("live collect and render", () => {
  it("stores a daily slice and renders it in Chinese", async () => {
    const env = { DB: createTestDb(), ADMIN_TOKEN: "test-token" } as Env;
    const report = await runCollect(env, "manual");
    console.log(
      `COLLECT inserted=${report.inserted} duplicates=${report.duplicates} capped=${report.capped} status=${report.status}`,
    );
    for (const source of report.sources) {
      console.log(`REPORT ${source.id} ok=${source.ok} fetched=${source.fetched} error=${source.error ?? ""}`);
    }
    expect(report.ok).toBe(true);
    expect(report.inserted).toBeGreaterThan(0);
    expect(report.inserted).toBeLessThanOrEqual(16);

    const home = await handle(new Request("https://nomad.evanzhang.cloud/"), env);
    const html = await home.text();
    expect(home.status).toBe(200);
    expect(html).toContain("游牧手记");
    expect(html).toContain("来源：");
    expect(html).toContain("作者：");
    expect(html).toContain("原文链接");
    expect(html).toContain("著作权归原作者所有");

    const match = html.match(/href="\/item\/(\d+)"/);
    expect(match?.[1]).toBeTruthy();
    const detail = await handle(new Request(`https://nomad.evanzhang.cloud/item/${match?.[1]}`), env);
    const detailHtml = await detail.text();
    expect(detail.status).toBe(200);
    expect(detailHtml).toMatch(/来源：<strong>[^<]+<\/strong> · 作者：<strong>[^<]+<\/strong> · <a href="https?:\/\/[^"]+"[^>]*>原文链接<\/a>/);
    expect(detailHtml).toContain("阅读原文");

    const rss = await handle(new Request("https://nomad.evanzhang.cloud/rss.xml"), env);
    const xml = await rss.text();
    expect(rss.headers.get("content-type")).toContain("application/rss+xml");
    expect(xml).toContain("<title>游牧手记</title>");
    expect(xml).toContain("<item>");

    const visa = await handle(new Request("https://nomad.evanzhang.cloud/?tag=visa"), env);
    expect(visa.status).toBe(200);
    expect(await visa.text()).toContain("签证");
  }, 120_000);
});
