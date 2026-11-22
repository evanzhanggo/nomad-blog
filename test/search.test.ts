import { describe, expect, it } from "vitest";
import { handle } from "../src/index";
import { highlight, likePattern } from "../src/search";
import type { Env } from "../src/types";
import { createTestDb } from "./fake-d1";

const origin = "https://nomad.evanzhang.cloud";

async function insert(
  db: D1Database,
  row: {
    url: string;
    title: string;
    excerpt?: string;
    source?: string;
    topic?: string;
    summary?: string | null;
    contentText?: string | null;
    contentHtml?: string | null;
    collectedAt?: string;
  },
) {
  await db
    .prepare(
      `INSERT INTO items (
        canonical_url, title, excerpt, source_id, source_name, collected_at, language,
        topic, ai_summary, content_text, content_html
      ) VALUES (?, ?, ?, 'src', ?, ?, 'zh', ?, ?, ?, ?)`,
    )
    .bind(
      row.url,
      row.title,
      row.excerpt ?? "",
      row.source ?? "看奈飞",
      row.collectedAt ?? "2026-11-22T00:00:00.000Z",
      row.topic ?? "visa",
      row.summary ?? null,
      row.contentText ?? null,
      row.contentHtml ?? null,
    )
    .run();
}

describe("search helpers", () => {
  it("escapes like wildcards and html while highlighting the keyword", () => {
    expect(likePattern("100%_off\\")).toBe("%100\\%\\_off\\\\%");
    expect(highlight("港卡<script>开户", "港卡")).toBe("<mark>港卡</mark>&lt;script&gt;开户");
    expect(highlight("Wise 开户", "wise")).toBe("<mark>Wise</mark> 开户");
  });
});

describe("search pages", () => {
  it("finds Chinese substrings across title, summary, source, topic, and full text", async () => {
    const db = createTestDb();
    await insert(db, { url: "https://example.com/card", title: "港卡开户教程", excerpt: "材料清单" });
    await insert(db, {
      url: "https://example.com/sum",
      title: "一篇无关标题",
      excerpt: "短",
      summary: "AI 提到了紫卡保号",
      topic: "sim",
    });
    await insert(db, {
      url: "https://example.com/src",
      title: "另一篇",
      excerpt: "没有关键词",
      source: "少数派",
      topic: "ai",
    });
    await insert(db, {
      url: "https://example.com/topic",
      title: "主题命中",
      excerpt: "正文不提签证两个字",
      topic: "visa",
    });
    await insert(db, {
      url: "https://example.com/body",
      title: "只有正文里有",
      excerpt: "摘要没有",
      topic: "remote",
      contentText: "这里写了 giffgaff 保号的步骤和费用。",
    });
    await insert(db, { url: "https://example.com/wild", title: "a_b_c 教程", excerpt: "下划线", topic: "bank" });
    await insert(db, { url: "https://example.com/other", title: "aXbXc 教程", excerpt: "不该命中下划线", topic: "bank" });
    const env = { DB: db, ADMIN_TOKEN: "secret" } as Env;

    const home = await handle(new Request(`${origin}/`), env);
    expect(await home.text()).toContain('action="/search"');

    const byTitle = await handle(new Request(`${origin}/search?q=${encodeURIComponent("港卡")}`), env);
    const titleHtml = await byTitle.text();
    expect(byTitle.status).toBe(200);
    expect(titleHtml).toContain("共 1 篇");
    expect(titleHtml).toContain("<mark>港卡</mark>");
    expect(titleHtml).toContain("搜索结果");

    const byHome = await handle(new Request(`${origin}/?q=${encodeURIComponent("紫卡")}`), env);
    expect(await byHome.text()).toContain("<mark>紫卡</mark>");

    const bySource = await handle(new Request(`${origin}/search?q=${encodeURIComponent("少数派")}`), env);
    expect(await bySource.text()).toContain("共 1 篇");

    const byTopic = await handle(new Request(`${origin}/search?q=${encodeURIComponent("签证")}`), env);
    const topicHtml = await byTopic.text();
    expect(topicHtml).toContain("主题命中");
    expect(topicHtml).toContain("港卡开户教程");

    const byBody = await handle(new Request(`${origin}/search?q=${encodeURIComponent("giffgaff")}`), env);
    const bodyHtml = await byBody.text();
    expect(bodyHtml).toContain("只有正文里有");
    expect(bodyHtml).toContain("<mark>giffgaff</mark>");

    const injected = await handle(
      new Request(`${origin}/search?q=${encodeURIComponent("%' OR 1=1 --")}`),
      env,
    );
    expect(await injected.text()).toContain("共 0 篇");

    const underscore = await handle(new Request(`${origin}/search?q=${encodeURIComponent("a_b")}`), env);
    const underscoreHtml = await underscore.text();
    expect(underscoreHtml).toContain("<mark>a_b</mark>_c");
    expect(underscoreHtml).not.toContain("aXbXc");

    const empty = await handle(new Request(`${origin}/search`), env);
    expect(await empty.text()).toContain("请输入关键词");

    const hostile = await handle(
      new Request(`${origin}/search?q=${encodeURIComponent("<script>alert(1)</script>")}`),
      env,
    );
    const hostileHtml = await hostile.text();
    expect(hostileHtml).not.toContain("<script>alert");
    expect(hostileHtml).toContain("&lt;script&gt;");
  });

  it("pages 50 results at a time", async () => {
    const db = createTestDb();
    for (let index = 0; index < 51; index += 1) {
      await insert(db, {
        url: `https://example.com/p/${index}`,
        title: `签证材料 ${index}`,
        excerpt: "同一关键词",
        collectedAt: "2026-11-22T00:00:00.000Z",
      });
    }
    const env = { DB: db } as Env;
    const first = await handle(new Request(`${origin}/search?q=${encodeURIComponent("签证材料")}`), env);
    const firstHtml = await first.text();
    expect(firstHtml).toContain("共 51 篇");
    expect(firstHtml).toContain("下一页");
    expect(firstHtml.match(/<article class="item">/g)?.length).toBe(50);

    const second = await handle(
      new Request(`${origin}/search?q=${encodeURIComponent("签证材料")}&page=2`),
      env,
    );
    expect((await second.text()).match(/<article class="item">/g)?.length).toBe(1);
  });

  it("reindexes stripped full text for search", async () => {
    const db = createTestDb();
    await insert(db, {
      url: "https://example.com/html",
      title: "待索引",
      excerpt: "摘要里没有目标词",
      topic: "tax",
      contentHtml: "<p>正文讨论 <script>alert(1)</script>ITIN 申请顺序。</p>",
    });
    const env = { DB: db, ADMIN_TOKEN: "secret" } as Env;
    const denied = await handle(new Request(`${origin}/admin/reindex`, { method: "POST" }), env);
    expect(denied.status).toBe(401);

    const before = await handle(new Request(`${origin}/search?q=ITIN`), env);
    expect(await before.text()).toContain("共 0 篇");

    const response = await handle(
      new Request(`${origin}/admin/reindex`, {
        method: "POST",
        headers: { Authorization: "Bearer secret" },
      }),
      env,
    );
    const body = (await response.json()) as { updated: number; remaining: number };
    expect(body.updated).toBe(1);
    expect(body.remaining).toBe(0);

    const stored = await db
      .prepare("SELECT content_text FROM items WHERE canonical_url = ?")
      .bind("https://example.com/html")
      .first<{ content_text: string }>();
    expect(stored?.content_text).toContain("ITIN");
    expect(stored?.content_text).not.toContain("<script");

    const after = await handle(new Request(`${origin}/search?q=ITIN`), env);
    expect(await after.text()).toContain("待索引");
  });
});
