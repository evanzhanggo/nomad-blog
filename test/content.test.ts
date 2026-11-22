import { describe, expect, it } from "vitest";
import { articleHtmlFromSource, CONTENT_MAX_BYTES, sanitizeHtml } from "../src/content";
import { fillMissingContent, fillMissingSummaries } from "../src/fulltext";
import { handle } from "../src/index";
import { cleanSummary, readModelText } from "../src/summary";
import type { Env } from "../src/types";
import { createTestDb } from "./fake-d1";

const base = "https://kannetflix.com/pay/itin";
const paragraph = `<p>${"材料清单与办理顺序。".repeat(12)}</p><p>${"费用、时间和常见退回原因。".repeat(12)}</p>`;

describe("sanitizeHtml", () => {
  it("keeps the whitelist, absolutizes urls, and strips active content", () => {
    const html = sanitizeHtml(
      `${paragraph}<img src="/img/a.png" onerror="alert(1)" alt="卡面"><a href="javascript:alert(1)">坏链接</a><a href="/next">下一篇</a><iframe src="https://evil.test"></iframe><script>alert(1)</script><p onclick="alert(1)">仍然留下</p>`,
      base,
    );
    expect(html).toContain('src="https://kannetflix.com/img/a.png"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('referrerpolicy="no-referrer"');
    expect(html).toContain('href="https://kannetflix.com/next"');
    expect(html).toContain("坏链接");
    expect(html).toContain("仍然留下");
    expect(html).not.toContain("onerror");
    expect(html).not.toContain("onclick");
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("alert(1)");
  });

  it("caps output near 200KB and still closes tags", () => {
    const huge = `<p>${"很长的一段说明。".repeat(4000)}</p>`.repeat(40);
    const html = sanitizeHtml(huge, base);
    expect(new TextEncoder().encode(html).length).toBeLessThanOrEqual(CONTENT_MAX_BYTES + 2_000);
    expect(html.endsWith("</p>")).toBe(true);
  });
});

describe("articleHtmlFromSource", () => {
  it("prefers a feed fragment and special-cases weixin, sspai, and zhihu", () => {
    const feed = articleHtmlFromSource(`<![CDATA[${paragraph}]]>`, "https://example.com/post");
    expect(feed).toContain("<p>");
    expect(feed).not.toContain("CDATA");

    const noise = `<div class="sidebar"><p>${"广告".repeat(80)}</p></div>`;
    const weixin = articleHtmlFromSource(
      `<html><body>${noise}<div id="js_content">${paragraph}<img data-src="https://mmbiz.qpic.cn/a.jpg"></div></body></html>`,
      "https://mp.weixin.qq.com/s/abc",
    );
    expect(weixin).toContain("材料清单");
    expect(weixin).toContain('src="https://mmbiz.qpic.cn/a.jpg"');
    expect(weixin).not.toContain("广告");

    const sspai = articleHtmlFromSource(
      `<html><body><div id="article-content">${paragraph}</div>${noise}</body></html>`,
      "https://sspai.com/post/1",
    );
    expect(sspai).toContain("材料清单");
    expect(sspai).not.toContain("广告");

    const zhihu = articleHtmlFromSource(
      `<html><body><div class="Post-RichText ztext">${paragraph}</div>${noise}</body></html>`,
      "https://zhuanlan.zhihu.com/p/1",
    );
    expect(zhihu).toContain("费用、时间");
    expect(zhihu).not.toContain("广告");
  });

  it("returns null when the page has no real article", () => {
    expect(articleHtmlFromSource("<p>太短</p>", "https://example.com/x")).toBeNull();
  });
});

describe("cleanSummary", () => {
  it("drops preambles and think tags, and keeps a short Chinese summary", () => {
    expect(readModelText({ choices: [{ message: { content: "摘要：两句说明。" } }] })).toContain("摘要");
    const text = cleanSummary("<think>推理过程</think>\n摘要：这是两句简体中文说明。第二句补充了办理顺序和材料。");
    expect(text).toBe("这是两句简体中文说明。第二句补充了办理顺序和材料。");
    expect(cleanSummary("这是两句简体中文说明。第二句补充了办理顺序和材料。<think>还在想繁体")).toBe(
      "这是两句简体中文说明。第二句补充了办理顺序和材料。",
    );
    expect(readModelText({ response: "已经写好。<think>unclosed tail" })).toBe("已经写好。");
    expect(cleanSummary("")).toBeNull();
    expect(cleanSummary("<think>only</think>")).toBeNull();
    expect(cleanSummary("<think>unclosed only")).toBeNull();
  });
});

describe("admin content endpoints", () => {
  it("requires the bearer token, then stores sanitized html and an AI summary", async () => {
    const db = createTestDb();
    await db
      .prepare(
        `INSERT INTO items (
          canonical_url, title, excerpt, source_id, source_name, collected_at, language
        ) VALUES (?, ?, ?, 'kannetflix', '看奈飞', '2026-11-22T00:00:00.000Z', 'zh')`,
      )
      .bind("https://kannetflix.com/pay/itin", "ITIN 美国税号申请教程", "原来的 RSS 摘要")
      .run();
    const env = {
      DB: db,
      ADMIN_TOKEN: "secret",
      AI: {
        run: async () => ({
          choices: [{ message: { content: "这是两句简体中文摘要。它说明了税号材料。读者可以按顺序办理。" } }],
        }),
      },
    } as Env;
    const denied = await handle(new Request("https://nomad.evanzhang.cloud/admin/fetch-content?limit=2", { method: "POST" }), env);
    expect(denied.status).toBe(401);

    const original = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(`<html><body><article>${paragraph}<script>alert(1)</script></article></body></html>`, {
        status: 200,
        headers: { "content-type": "text/html" },
      });
    try {
      const filled = await handle(
        new Request("https://nomad.evanzhang.cloud/admin/fetch-content?limit=2", {
          method: "POST",
          headers: { Authorization: "Bearer secret" },
        }),
        env,
      );
      expect(filled.status).toBe(200);
      const body = (await filled.json()) as { filled: number; summarized: number };
      expect(body.filled).toBe(1);
      expect(body.summarized).toBe(1);
    } finally {
      globalThis.fetch = original;
    }

    const row = await db
      .prepare("SELECT content_html, ai_summary FROM items WHERE id = 1")
      .first<{ content_html: string; ai_summary: string }>();
    expect(row?.content_html).toContain("<p>");
    expect(row?.content_html).not.toContain("<script");
    expect(row?.ai_summary).toContain("税号材料");

    const page = await handle(new Request("https://nomad.evanzhang.cloud/a/1"), env);
    const html = await page.text();
    expect(html).toContain("AI 摘要");
    expect(html).toContain("税号材料");
    expect(html).toContain("材料清单");
    expect(html.match(/本文转载自看奈飞/g)?.length).toBe(2);

    const again = await fillMissingSummaries(env, 4);
    expect(again.scanned).toBe(0);
    expect(again.lastError).toBeNull();
  });

  it("returns lastError when the summary model throws", async () => {
    const db = createTestDb();
    await db
      .prepare(
        `INSERT INTO items (
          canonical_url, title, excerpt, source_id, source_name, collected_at, language
        ) VALUES ('https://example.com/visa', '克罗地亚数字游民签证教程', '原来的 RSS 摘要，材料、顺序和费用都写在原文里。', 'x', 'X', '2026-11-22T00:00:00.000Z', 'zh')`,
      )
      .run();
    const env = {
      DB: db,
      ADMIN_TOKEN: "secret",
      AI: {
        run: async () => {
          throw new Error("5028: @cf/qwen/qwen3-30b-a3b-fp8 was deprecated on 2026-11-20");
        },
      },
    } as Env;
    const response = await handle(
      new Request("https://nomad.evanzhang.cloud/admin/summarize?limit=1", {
        method: "POST",
        headers: { Authorization: "Bearer secret" },
      }),
      env,
    );
    expect(response.status).toBe(200);
    const body = (await response.json()) as { summarized: number; failed: number; lastError: string | null };
    expect(body.summarized).toBe(0);
    expect(body.failed).toBe(1);
    expect(body.lastError).toContain("5028");
  });

  it("leaves content null when the fetch fails and keeps the RSS summary", async () => {
    const db = createTestDb();
    await db
      .prepare(
        `INSERT INTO items (
          canonical_url, title, excerpt, source_id, source_name, collected_at, language
        ) VALUES ('https://example.com/missing', 'ITIN 美国税号申请教程', '原来的 RSS 摘要', 'x', 'X', '2026-11-22T00:00:00.000Z', 'zh')`,
      )
      .run();
    const env = { DB: db, ADMIN_TOKEN: "secret" } as Env;
    const original = globalThis.fetch;
    globalThis.fetch = async () => new Response("nope", { status: 404 });
    try {
      const result = await fillMissingContent(env, 2);
      expect(result.filled).toBe(0);
      expect(result.failed).toBe(1);
    } finally {
      globalThis.fetch = original;
    }
    const row = await db
      .prepare("SELECT content_html, content_fetched_at, ai_summary FROM items")
      .first<{ content_html: string | null; content_fetched_at: string | null; ai_summary: string | null }>();
    expect(row?.content_html).toBeNull();
    expect(row?.content_fetched_at).toBeTruthy();
    expect(row?.ai_summary).toBeNull();
  });
});
