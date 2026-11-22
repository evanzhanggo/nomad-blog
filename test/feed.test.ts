import { describe, expect, it } from "vitest";
import { parseFeed } from "../src/feed";

describe("parseFeed", () => {
  it("reads a Medium item snippet and author", () => {
    const xml = `<?xml version="1.0"?><rss><channel><item>
      <title><![CDATA[Crossing into Brunei]]></title>
      <description><![CDATA[<div><p class="medium-feed-snippet">A short crossing note.</p><p>Continue reading »</p></div>]]></description>
      <link>https://medium.com/tales/crossing-into-brunei-abc?source=rss------digital_nomad-5</link>
      <dc:creator><![CDATA[Ada Nomad]]></dc:creator>
      <pubDate>Sat, 21 Nov 2026 22:21:58 GMT</pubDate>
    </item></channel></rss>`;
    const [entry] = parseFeed(xml);
    expect(entry?.title).toBe("Crossing into Brunei");
    expect(entry?.excerpt).toBe("A short crossing note.");
    expect(entry?.author).toBe("Ada Nomad");
    expect(entry?.url).toContain("medium.com/tales/crossing");
    expect(entry?.publishedAt).toBe("2026-11-21T22:21:58.000Z");
  });

  it("reads Nomad Gate descriptions and decodes entities", () => {
    const xml = `<?xml version="1.0"?><rss><channel><item>
      <title>Portugal’s New Nationality Law</title>
      <description>Portugal&apos;s stricter Nationality Law has entered into force.</description>
      <link>https://nomadgate.com/portugal-nationality-law/</link>
      <pubDate>Tue, 19 May 2026 08:00:00 +0000</pubDate>
    </item></channel></rss>`;
    const [entry] = parseFeed(xml);
    expect(entry?.excerpt).toBe("Portugal's stricter Nationality Law has entered into force.");
    expect(entry?.author).toBeNull();
  });

  it("reads Atom authors and an RSS author display name", () => {
    const atom = `<?xml version="1.0"?><feed><entry>
      <title>Hello</title>
      <link rel="alternate" href="https://example.com/hello"/>
      <published>2026-01-02T00:00:00Z</published>
      <author><name>Ada</name><email>ada@example.com</email></author>
      <summary>A short summary.</summary>
    </entry></feed>`;
    expect(parseFeed(atom)[0]).toMatchObject({
      title: "Hello",
      url: "https://example.com/hello",
      author: "Ada",
      excerpt: "A short summary.",
    });

    const rss = `<?xml version="1.0"?><rss><channel><item>
      <title>Chiang Mai notes</title>
      <link>https://www.johnnyfd.com/2026/04/chiang-mai.html</link>
      <author>noreply@blogger.com (Johnny FD)</author>
      <description>A base for the year.</description>
    </item></channel></rss>`;
    expect(parseFeed(rss)[0]?.author).toBe("Johnny FD");
  });

  it("drops a repeated title from a 电鸭-style description", () => {
    const xml = `<?xml version="1.0"?><rss><channel><item>
      <title><![CDATA[远程办公一周记]]></title>
      <link>https://eleduck.com/posts/abc</link>
      <description><![CDATA[远程办公一周记 别慌，这只是摘要。]]></description>
      <pubDate>Sun, 22 Nov 2026 03:37:10 GMT</pubDate>
    </item></channel></rss>`;
    expect(parseFeed(xml)[0]?.excerpt).toBe("别慌，这只是摘要。");
  });
});
