import { describe, expect, it } from "vitest";
import { handle } from "../src/index";
import { normalizePage, parsePage } from "../src/queries";
import { renderAbout, renderHome, renderItem, renderRss } from "../src/render";
import type { Env, ItemRow } from "../src/types";

const origin = "https://nomad.evanzhang.cloud";

function row(overrides: Partial<ItemRow> = {}): ItemRow {
  return {
    id: 7,
    canonical_url: "https://nomadgate.com/portugal-visa",
    title: "葡萄牙签证变化 <script>alert(1)</script>",
    excerpt: "短摘要，不是全文。",
    source_id: "nomadgate",
    source_name: "Nomad Gate",
    author: null,
    published_at: "2026-05-19T08:00:00.000Z",
    collected_at: "2026-11-22T00:00:00.000Z",
    popularity: 12,
    popularity_label: "分",
    tags: "|visa|howto|",
    language: "zh",
    discussion_url: null,
    topic: "visa",
    quality_score: 60,
    section: "daily",
    ...overrides,
  };
}

describe("pages", () => {
  it("renders the home list with attribution, a day group, and escaped titles", () => {
    const html = renderHome(
      {
        items: [row(), row({ id: 8, title: "第二篇签证记录", source_name: "看奈飞", canonical_url: "https://kannetflix.com/pay/itin/" })],
        classics: [row({ id: 3, title: "港卡开户指南", section: "classic", topic: "bank", quality_score: 72 })],
        total: 21,
        page: 1,
        source: "",
        tag: "visa",
        topic: "",
        generatedAt: "2026-11-22T04:00:00.000Z",
      },
      origin,
    );
    expect(html).toContain("lang=\"zh-CN\"");
    expect(html).not.toContain("class=\"rule\"");
    expect(html).not.toContain("linear-gradient(90deg, var(--teal), var(--stamp))");
    expect(html).toContain("收录于");
    expect(html).toContain("经典教程");
    expect(html).toContain("港卡开户指南");
    expect(html).toContain("href=\"/a/7\"");
    expect(html).toContain("来源：<strong>Nomad Gate</strong> · 作者：<strong>未知</strong> · <a class=\"origin\" href=\"https://nomadgate.com/portugal-visa\"");
    expect(html).toContain(">原文</a>");
    expect(html).toContain("著作权归原作者所有");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>alert");
    expect(html).toContain("下一页");
    expect(html).toContain("签证");
  });

  it("renders a detail page with the source block and an original link", () => {
    const html = renderItem(row({ discussion_url: "https://news.ycombinator.com/item?id=1" }), origin);
    expect(html).toContain("原文标题");
    expect(html).toContain("来源站点");
    expect(html).toContain(">https://nomadgate.com/portugal-visa</a>");
    expect(html.match(/本文转载自Nomad Gate，版权归原作者所有，如有侵权请联系删除/g)?.length).toBe(2);
    expect(html).not.toContain("<span>作者</span>");
    expect(html).toContain("阅读原文");
    expect(html).toContain("全文还没有抓到");
    expect(html).toContain("查看讨论线程");
    expect(html).toContain("著作权归原作者所有");
  });

  it("renders about and an rss item that points back to the original", () => {
    const about = renderAbout(origin);
    expect(about).toContain("展示全文");
    expect(about).toContain("Workers AI");
    expect(about).toContain("电鸭社区");
    expect(about).toContain("数字游民部落");
    expect(about).not.toContain("Hacker News");
    expect(about).toContain("著作权归原作者所有");

    const rss = renderRss([row()], origin);
    expect(rss).toContain("<title>游牧手记</title>");
    expect(rss).toContain("<link>https://nomad.evanzhang.cloud/a/7</link>");
    expect(rss).toContain("https://nomadgate.com/portugal-visa");
    expect(rss).toContain("&lt;script&gt;");
    expect(rss).not.toContain("<script>alert");
  });

  it("serves about and rejects admin calls without the right bearer token", async () => {
    const env = { ADMIN_TOKEN: "secret" } as Env;
    const about = await handle(new Request(`${origin}/about`), env);
    expect(about.status).toBe(200);
    expect(about.headers.get("content-type")).toContain("text/html");
    expect(await about.text()).toContain("关于游牧手记");

    const missing = await handle(new Request(`${origin}/admin/collect`, { method: "POST" }), env);
    expect(missing.status).toBe(401);

    const wrong = await handle(
      new Request(`${origin}/admin/collect`, {
        method: "POST",
        headers: { Authorization: "Bearer nope" },
      }),
      env,
    );
    expect(wrong.status).toBe(401);

    const get = await handle(
      new Request(`${origin}/admin/collect`, {
        headers: { Authorization: "Bearer secret" },
      }),
      { ADMIN_TOKEN: "secret" } as Env,
    );
    expect(get.status).toBe(405);

    const unset = await handle(
      new Request(`${origin}/admin/collect`, {
        method: "POST",
        headers: { Authorization: "Bearer secret" },
      }),
      {} as Env,
    );
    expect(unset.status).toBe(401);

    const health = await handle(new Request(`${origin}/health`), env);
    expect(await health.json()).toEqual({ ok: true, name: "nomad-blog" });

    const missingPage = await handle(new Request(`${origin}/nope`), env);
    expect(missingPage.status).toBe(404);

    const purge = await handle(new Request(`${origin}/admin/purge-non-chinese`, { method: "POST" }), env);
    expect(purge.status).toBe(401);
    const purgeGet = await handle(
      new Request(`${origin}/admin/purge-non-chinese`, { headers: { Authorization: "Bearer secret" } }),
      env,
    );
    expect(purgeGet.status).toBe(405);
  });
});

describe("pagination", () => {
  it("parses and clamps pages", () => {
    expect(parsePage(null)).toBe(1);
    expect(parsePage("2")).toBe(2);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("nope")).toBe(1);
    expect(normalizePage(9, 25, 20)).toBe(2);
    expect(normalizePage(1, 0, 20)).toBe(1);
  });
});
