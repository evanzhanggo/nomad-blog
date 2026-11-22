import { describe, expect, it } from "vitest";
import { loadSources } from "../src/collect";
import { articleHtmlFromSource } from "../src/content";
import { buildDraft } from "../src/item";
import { FEEDS, SOURCES } from "../src/sources";
import {
  fetchXAccount,
  postsByOwner,
  postsFromFixupRss,
  postsFromFxPayload,
  postsFromSyndication,
  qualifyXPosts,
  titleFromText,
  X_ACCOUNTS,
  type XAccount,
} from "../src/x";

const account = X_ACCOUNTS[0] as XAccount;
const step = "先准备护照、地址证明和美国手机号，然后按步骤提交。";
const longNote = `美卡开户教程。${step.repeat(16)}`;

function status(overrides: Record<string, unknown> = {}) {
  return {
    type: "status",
    id: "100",
    url: "https://x.com/hejushang8/status/100",
    text: "",
    created_timestamp: 1_700_000_000,
    likes: 12,
    replies: 0,
    reposted_by: null,
    replying_to: null,
    author: { name: "何居上", screen_name: "hejushang8", id: account.userId },
    ...overrides,
  };
}

function qualify(list: unknown[]) {
  return qualifyXPosts(postsFromFxPayload({ results: list }), account);
}

describe("X long-form parsing", () => {
  it("turns an article into a titled draft with display name, paragraphs, and a source link", () => {
    const linked = "打开链接继续阅读后面的说明。";
    const paragraph = `${linked}${step.repeat(8)}`;
    const drafts = qualify([
      status({
        id: "2102602033488634298",
        url: "https://twitter.com/hejushang8/status/2102602033488634298",
        likes: 1255,
        text: "https://x.com/i/article/1",
        article: {
          title: "美区 PayPal 注册及养号防封指南",
          preview_text: "预览很短",
          content: {
            blocks: [
              {
                type: "header-two",
                text: "注册前准备",
                inlineStyleRanges: [{ offset: 0, length: 5, style: "Bold" }],
                entityRanges: [],
              },
              {
                type: "unstyled",
                text: paragraph,
                inlineStyleRanges: [],
                entityRanges: [{ key: 1, offset: linked.indexOf("链接"), length: 2 }],
              },
              { type: "ordered-list-item", text: "第一步准备美国节点", inlineStyleRanges: [], entityRanges: [] },
              { type: "ordered-list-item", text: "第二步填写账单地址", inlineStyleRanges: [], entityRanges: [] },
              {
                type: "unstyled",
                text: "说明 <script>alert(1)</script> 仍然安全。",
                inlineStyleRanges: [],
                entityRanges: [],
              },
              { type: "atomic", text: "\uFFFC", inlineStyleRanges: [], entityRanges: [{ key: 2, offset: 0, length: 1 }] },
            ],
            entityMap: [
              { key: "1", value: { type: "LINK", data: { url: "https://example.com/paypal" } } },
              { key: "2", value: { type: "MEDIA", data: { mediaItems: [{ mediaId: "99" }] } } },
            ],
          },
          media_entities: [{ media_id: "99", media_info: { original_img_url: "https://pbs.twimg.com/media/demo.jpg" } }],
        },
      }),
    ]);
    expect(drafts).toHaveLength(1);
    const draft = drafts[0];
    expect(draft?.title).toBe("美区 PayPal 注册及养号防封指南");
    expect(draft?.author).toBe("何居上");
    expect(draft?.author).not.toContain("@");
    expect(draft?.sourceName).toBe("何居上");
    expect(draft?.canonicalUrl).toBe("https://x.com/hejushang8/status/2102602033488634298");
    expect(draft?.popularityLabel).toBe("赞");
    expect(draft?.feedHtml).toContain("<h2><strong>注册前准备</strong></h2>");
    expect(draft?.feedHtml).toContain('<a href="https://example.com/paypal">');
    expect(draft?.feedHtml).toContain('<img src="https://pbs.twimg.com/media/demo.jpg"');
    expect(draft?.feedHtml).toContain("<ol><li>第一步准备美国节点</li><li>第二步填写账单地址</li></ol>");
    expect(draft?.feedHtml).toContain("何居上在 X 发布的帖子");
    const stored = articleHtmlFromSource(draft?.feedHtml ?? "", draft?.canonicalUrl ?? "");
    expect(stored).toContain("仍然安全");
    expect(stored).not.toContain("<script");
    expect(stored).toContain("原文");
  });

  it("keeps a tutorial that mentions an invite code later, and drops promo, replies, reposts, and short notes", () => {
    const articleBody = `${step.repeat(12)}最后附上邀请码仅供参考，正文前面已经写完教程。`;
    const drafts = qualify([
      status({ id: "1", text: "今天冲了美卡", created_timestamp: 500 }),
      status({
        id: "2",
        text: `速度冲，手慢无。${longNote}`,
        created_timestamp: 490,
        url: "https://x.com/hejushang8/status/2",
      }),
      status({
        id: "3",
        text: `拉群交流。${longNote}`,
        created_timestamp: 480,
        url: "https://x.com/hejushang8/status/3",
      }),
      status({
        id: "4",
        text: longNote,
        created_timestamp: 470,
        url: "https://x.com/hejushang8/status/4",
        replying_to: { screen_name: "someone", status: "9" },
      }),
      status({
        id: "5",
        text: longNote,
        created_timestamp: 460,
        url: "https://x.com/hejushang8/status/5",
        reposted_by: { screen_name: "hejushang8" },
      }),
      status({
        id: "6",
        text: "https://x.com/i/article/6",
        created_timestamp: 450,
        url: "https://x.com/hejushang8/status/6",
        article: {
          title: "万里汇 WorldFirst 账户开户完整教程",
          preview_text: "预览",
          content: {
            blocks: [{ type: "unstyled", text: articleBody, inlineStyleRanges: [], entityRanges: [] }],
            entityMap: [],
          },
        },
      }),
      status({
        id: "7",
        text: "",
        created_timestamp: 440,
        url: "https://x.com/hejushang8/status/7",
        article: { title: "PayPal setup guide for nomads abroad", preview_text: step.repeat(12), content: { blocks: [], entityMap: [] } },
      }),
    ]);
    expect(drafts.map((draft) => draft.canonicalUrl)).toEqual(["https://x.com/hejushang8/status/6"]);
    expect(drafts[0]?.feedHtml).toContain("邀请码");
  });

  it("merges a self-thread, drops the invite reply, and does not publish a lone reply", () => {
    const chunk = "美卡开户步骤如下，准备护照和地址证明。";
    const drafts = qualify([
      status({
        id: "10",
        text: chunk.repeat(10),
        created_timestamp: 300,
        url: "https://x.com/hejushang8/status/10",
        replies: 2,
      }),
      status({
        id: "11",
        text: `${chunk.repeat(10)}第二段继续写开户顺序。`,
        created_timestamp: 301,
        url: "https://x.com/hejushang8/status/11",
        replying_to: { screen_name: "hejushang8", status: "10" },
      }),
      status({
        id: "12",
        text: "邀请码：ABC123，欢迎进群",
        created_timestamp: 302,
        url: "https://x.com/hejushang8/status/12",
        replying_to: { screen_name: "hejushang8", status: "10" },
      }),
      status({
        id: "13",
        text: longNote,
        created_timestamp: 200,
        url: "https://x.com/hejushang8/status/13",
        replying_to: { screen_name: "hejushang8", status: "99" },
      }),
    ]);
    expect(drafts).toHaveLength(1);
    expect(drafts[0]?.canonicalUrl).toBe("https://x.com/hejushang8/status/10");
    expect(drafts[0]?.title.startsWith("美卡开户步骤如下")).toBe(true);
    expect(drafts[0]?.feedHtml).toContain("第二段继续写开户顺序");
    expect(drafts[0]?.feedHtml).not.toContain("ABC123");
  });

  it("offers the two newest qualifying items and skips an off-topic note ahead of them", () => {
    const chair = `今天把椅子组装好了。${"对准螺丝再拧紧木板。".repeat(40)}`;
    const drafts = qualify([
      status({ id: "21", text: chair, created_timestamp: 900, url: "https://x.com/hejushang8/status/21" }),
      status({ id: "22", text: longNote, created_timestamp: 800, url: "https://x.com/hejushang8/status/22" }),
      status({
        id: "23",
        text: `英国 IBAN 账户开通完整教程。${step.repeat(16)}`,
        created_timestamp: 700,
        url: "https://x.com/hejushang8/status/23",
      }),
      status({
        id: "24",
        text: `红包卡保号教程。${step.repeat(16)}`,
        created_timestamp: 600,
        url: "https://x.com/hejushang8/status/24",
      }),
    ]);
    expect(drafts.map((draft) => draft.canonicalUrl)).toEqual([
      "https://x.com/hejushang8/status/22",
      "https://x.com/hejushang8/status/23",
    ]);
  });

  it("reads fixupx rss without treating a quoted article as the author's own post", () => {
    const quoted = `美卡开户教程。${step.repeat(20)}`;
    const xml = `<?xml version="1.0"?><rss version="2.0"><channel><item>
      <title>今天看看美卡</title>
      <link>https://x.com/hejushang8/status/31</link>
      <pubDate>Sun, 22 Nov 2026 00:00:00 GMT</pubDate>
      <description><![CDATA[<p>今天看看美卡</p><blockquote><a href="https://x.com/other/status/9">${quoted}</a></blockquote>]]></description>
    </item><item>
      <title>RT @other: 美卡开户教程</title>
      <link>https://x.com/hejushang8/status/32</link>
      <pubDate>Sun, 22 Nov 2026 01:00:00 GMT</pubDate>
      <description><![CDATA[<p>RT @other: ${quoted}</p>]]></description>
    </item><item>
      <title>美卡开户教程</title>
      <link>https://twitter.com/hejushang8/status/33</link>
      <pubDate>Sun, 22 Nov 2026 02:00:00 GMT</pubDate>
      <description><![CDATA[<p>${longNote}</p>]]></description>
    </item></channel></rss>`;
    const drafts = qualifyXPosts(postsFromFixupRss(xml, account), account);
    expect(drafts.map((draft) => draft.canonicalUrl)).toEqual(["https://x.com/hejushang8/status/33"]);
    expect(drafts[0]?.author).toBe("何居上");
  });

  it("reads a syndication timeline and skips retweets and replies", () => {
    const html = `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify({
      props: {
        pageProps: {
          timeline: {
            entries: [
              {
                content: {
                  tweet: {
                    id_str: "41",
                    full_text: `RT @other: ${longNote}`,
                    user: { name: "何居上", screen_name: "hejushang8", id_str: account.userId },
                  },
                },
              },
              {
                content: {
                  tweet: {
                    id_str: "42",
                    full_text: longNote,
                    in_reply_to_screen_name: "other",
                    in_reply_to_status_id_str: "7",
                    user: { name: "何居上", screen_name: "hejushang8", id_str: account.userId },
                  },
                },
              },
              {
                content: {
                  tweet: {
                    id_str: "43",
                    full_text: longNote,
                    permalink: "https://twitter.com/hejushang8/status/43",
                    created_at: "Sun Nov 22 00:00:00 +0000 2026",
                    favorite_count: 6,
                    user: { name: "何居上", screen_name: "hejushang8", id_str: account.userId },
                  },
                },
              },
            ],
          },
        },
      },
    })}</script>`;
    const drafts = qualifyXPosts(postsFromSyndication(html, account), account);
    expect(drafts).toHaveLength(1);
    expect(drafts[0]?.canonicalUrl).toBe("https://x.com/hejushang8/status/43");
    expect(titleFromText(`这是第一句比较完整的结束。${"后面还有很多字。".repeat(10)}`)).toBe("这是第一句比较完整的结束");
  });
});

describe("X account fetch", () => {
  it("hydrates article text and tolerates an articles 404", async () => {
    const calls: string[] = [];
    const shell = status({
      id: "200",
      url: "https://x.com/hejushang8/status/200",
      created_timestamp: 5_000,
      text: "https://x.com/i/article/200",
      article: { title: "美区 PayPal 注册及养号防封指南", preview_text: "短", content: { blocks: [], entityMap: [] } },
    });
    const full = status({
      ...shell,
      article: {
        title: "美区 PayPal 注册及养号防封指南",
        preview_text: "短",
        content: {
          blocks: [{ type: "unstyled", text: `账单地址写在这一段。${step.repeat(12)}`, inlineStyleRanges: [], entityRanges: [] }],
          entityMap: [],
        },
      },
    });
    const drafts = await fetchXAccount(account, {
      get: async (path) => {
        calls.push(path);
        if (path.endsWith("/articles?count=8")) throw new Error("HTTP 404 Not Found");
        if (path.endsWith("/statuses?count=20")) return { results: [shell] };
        if (path === "/2/status/200") return { status: full };
        throw new Error(path);
      },
      fallbackPosts: async () => {
        throw new Error("fallback should not run");
      },
    });
    expect(calls).toContain("/2/status/200");
    expect(drafts).toHaveLength(1);
    expect(drafts[0]?.feedHtml).toContain("账单地址写在这一段");
  });

  it("does not fetch article bodies once two newer long posts already qualify", async () => {
    const calls: string[] = [];
    await fetchXAccount(account, {
      get: async (path) => {
        calls.push(path);
        if (path.endsWith("/articles?count=8")) {
          return {
            results: [
              status({
                id: "300",
                created_timestamp: 100,
                url: "https://x.com/hejushang8/status/300",
                article: { title: "汇丰港卡开户教程", preview_text: "短", content: { blocks: [], entityMap: [] } },
              }),
            ],
          };
        }
        if (path.endsWith("/statuses?count=20")) {
          return {
            results: [
              status({ id: "301", text: longNote, created_timestamp: 900, url: "https://x.com/hejushang8/status/301" }),
              status({
                id: "302",
                text: `红包卡保号教程。${step.repeat(16)}`,
                created_timestamp: 800,
                url: "https://x.com/hejushang8/status/302",
              }),
            ],
          };
        }
        throw new Error(path);
      },
    });
    expect(calls.some((path) => path.startsWith("/2/status/"))).toBe(false);
  });

  it("fetches a self-thread when the root post is only the start of a tutorial", async () => {
    const chunk = "美卡开户步骤如下，准备护照和地址证明。";
    const drafts = await fetchXAccount(account, {
      get: async (path) => {
        if (path.endsWith("/articles?count=8")) return { code: 200, results: [] };
        if (path.endsWith("/statuses?count=20")) {
          return {
            results: [
              status({
                id: "400",
                text: chunk.repeat(8),
                replies: 3,
                created_timestamp: 50,
                url: "https://x.com/hejushang8/status/400",
              }),
            ],
          };
        }
        if (path === "/2/thread/400") {
          return {
            status: status({ id: "400", text: chunk.repeat(8), url: "https://x.com/hejushang8/status/400" }),
            thread: [
              status({
                id: "401",
                text: `${chunk.repeat(12)}接着写第二段开户顺序。`,
                url: "https://x.com/hejushang8/status/401",
                replying_to: { screen_name: "hejushang8", status: "400" },
              }),
            ],
          };
        }
        throw new Error(path);
      },
    });
    expect(drafts).toHaveLength(1);
    expect(drafts[0]?.feedHtml).toContain("接着写第二段开户顺序");
  });

  it("uses the fallback timeline when the JSON API fails, and still fails if that fails too", async () => {
    const drafts = await fetchXAccount(account, {
      get: async () => {
        throw new Error("HTTP 500 down");
      },
      fallbackPosts: async () => postsFromFxPayload({ results: [status({ id: "4", text: longNote, url: "https://x.com/hejushang8/status/4" })] }),
    });
    expect(drafts).toHaveLength(1);

    await expect(
      fetchXAccount(account, {
        get: async () => {
          throw new Error("HTTP 500 down");
        },
        fallbackPosts: async () => {
          throw new Error("rss down");
        },
      }),
    ).rejects.toThrow(/HTTP 500 down/);
  });

  it("refuses a mismatched user id without reading the fallback", async () => {
    await expect(
      fetchXAccount(account, {
        get: async (path) => {
          if (path.endsWith("/articles?count=8")) throw new Error("HTTP 404 Not Found");
          return {
            results: [
              status({
                text: longNote,
                author: { name: "别人", screen_name: "hejushang8", id: "1" },
              }),
            ],
          };
        },
        fallbackPosts: async () => {
          throw new Error("fallback should not run");
        },
      }),
    ).rejects.toThrow(/user id mismatch/);
    expect(() =>
      postsByOwner(postsFromFxPayload({ results: [status({ author: { name: "别人", screen_name: "hejushang8", id: "1" } })] }), account),
    ).toThrow(/user id mismatch/);
  });

  it("keeps the eight RSS feeds and isolates an X failure from them", async () => {
    expect(FEEDS).toHaveLength(8);
    expect(SOURCES.map((source) => source.id)).toEqual([...FEEDS.map((feed) => feed.id), ...X_ACCOUNTS.map((item) => item.id)]);
    const rss = buildDraft({
      url: "https://kannetflix.com/pay/itin",
      title: "ITIN 美国税号申请教程",
      excerpt: "字".repeat(180),
      sourceId: "kannetflix",
      sourceName: "看奈飞",
    });
    expect(rss).not.toBeNull();
    const loaded = await loadSources([
      { id: "kannetflix", name: "看奈飞", hint: "https://kannetflix.com/index.xml", fetch: async () => (rss ? [rss] : []) },
      {
        id: "hejushang8",
        name: "何居上",
        hint: "https://x.com/hejushang8",
        fetch: async () => {
          throw new Error("fx down");
        },
      },
    ]);
    expect(loaded.map((source) => [source.id, source.ok, source.items.length])).toEqual([
      ["kannetflix", true, 1],
      ["hejushang8", false, 0],
    ]);
  });
});
