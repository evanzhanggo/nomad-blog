import { describe, expect, it } from "vitest";
import { buildDraft, isPredominantlyChinese } from "../src/item";
import { tagString } from "../src/tags";
import { canonicalUrl, excerptOf, EXCERPT_MAX, shanghaiDayKey } from "../src/text";

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

  it("groups both daily collects on the same Beijing date", () => {
    const morning = shanghaiDayKey("2026-11-22T00:00:00.000Z");
    const evening = shanghaiDayKey("2026-11-22T14:00:00.000Z");
    expect(morning).toBe("2026-11-22");
    expect(evening).toBe(morning);
  });

  it("tags visa and tax copy", () => {
    expect(tagString("How I got a digital nomad visa", "tax residency")).toContain("|visa|");
    expect(tagString("How I got a digital nomad visa", "tax residency")).toContain("|taxes|");
  });

  it("keeps Chinese titles, including mixed visa headlines, and drops English ones", () => {
    expect(isPredominantlyChinese("越南签证办理")).toBe(true);
    expect(isPredominantlyChinese("AI时代程序员能干啥，有点焦虑")).toBe(true);
    expect(
      isPredominantlyChinese(
        "加拿大：Express Entry 新规生效：加拿大工作经验和高薪职业 offer 加分，offer 不再需要 LMIA",
      ),
    ).toBe(true);
    expect(isPredominantlyChinese("How I got a digital nomad visa")).toBe(false);
    expect(isPredominantlyChinese("Remote Work")).toBe(false);

    expect(
      buildDraft({
        url: "https://example.com/en",
        title: "How I got a digital nomad visa",
        excerpt: "A long English guide.",
        sourceId: "x",
        sourceName: "X",
      }),
    ).toBeNull();
  });

  it("builds a draft without storing a script or a long body", () => {
    const draft = buildDraft({
      url: "https://www.looktheworld.com/docs/pt/?utm_campaign=spring",
      title: "葡萄牙签证 <script>x</script>",
      excerpt: `<p>${"字".repeat(400)}</p>`,
      sourceId: "looktheworld",
      sourceName: "Look the World",
      author: "noreply@example.com (Ada)",
      publishedAt: "2026-05-19T08:00:00Z",
      popularity: 3,
      popularityLabel: "分",
    });
    expect(draft?.canonicalUrl).toBe("https://looktheworld.com/docs/pt");
    expect(draft?.title.includes("<")).toBe(false);
    expect(draft?.author).toBe("Ada");
    expect(draft?.excerpt.includes("<")).toBe(false);
    expect(Array.from(draft?.excerpt ?? "").length).toBeLessThanOrEqual(EXCERPT_MAX);
    expect(draft?.tags.startsWith("|visa|")).toBe(true);
    expect(draft?.language).toBe("zh");
  });
});
