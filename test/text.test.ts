import { describe, expect, it } from "vitest";
import { buildDraft } from "../src/item";
import { tagString } from "../src/tags";
import { canonicalUrl, excerptOf, EXCERPT_MAX } from "../src/text";

describe("text", () => {
  it("canonicalizes tracking params and host", () => {
    expect(
      canonicalUrl(
        "http://WWW.Example.com/posts/Hello/?utm_source=hn&id=9&utm_medium=rss",
      ),
    ).toBe("https://example.com/posts/Hello?id=9");
  });

  it("rejects non-http urls", () => {
    expect(canonicalUrl("javascript:alert(1)")).toBeNull();
    expect(canonicalUrl("not a url")).toBeNull();
  });

  it("clips html excerpts to 300 characters and drops the title echo", () => {
    const title = "签证指南";
    const body = `${title} ${"甲".repeat(500)} <script>alert(1)</script>`;
    const excerpt = excerptOf(body, title);
    expect(Array.from(excerpt).length).toBe(EXCERPT_MAX);
    expect(excerpt.startsWith("甲")).toBe(true);
    expect(excerpt.includes("<")).toBe(false);
    expect(excerpt.endsWith("…")).toBe(true);
  });

  it("decodes escaped feed html before stripping tags", () => {
    const excerpt = excerptOf("&lt;p&gt;I&#39;m writing a short note.&lt;/p&gt;", "Note");
    expect(excerpt).toBe("I'm writing a short note.");
  });

  it("tags visa and tax copy", () => {
    expect(tagString("How I got a digital nomad visa", "tax residency")).toContain("|visa|");
    expect(tagString("How I got a digital nomad visa", "tax residency")).toContain("|taxes|");
  });

  it("builds a draft without storing a script or a long body", () => {
    const draft = buildDraft({
      url: "https://nomadgate.com/a/?utm_campaign=spring",
      title: "Portugal visa <script>x</script>",
      excerpt: `<p>${"word ".repeat(200)}</p>`,
      sourceId: "nomadgate",
      sourceName: "Nomad Gate",
      author: "noreply@example.com (Ada)",
      publishedAt: "2026-05-19T08:00:00Z",
      popularity: 3,
      popularityLabel: "分",
    });
    expect(draft?.canonicalUrl).toBe("https://nomadgate.com/a");
    expect(draft?.title.includes("<")).toBe(false);
    expect(draft?.author).toBe("Ada");
    expect(draft?.excerpt.includes("<")).toBe(false);
    expect(Array.from(draft?.excerpt ?? "").length).toBeLessThanOrEqual(EXCERPT_MAX);
    expect(draft?.tags.startsWith("|visa|")).toBe(true);
  });
});
