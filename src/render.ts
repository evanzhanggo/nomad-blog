import { PAGE_SIZE, pageCount } from "./queries";
import { SOURCES } from "./sources";
import { CSS } from "./styles";
import { TOPICS } from "./score";
import { knownTag, parseTags, TAGS } from "./tags";
import { esc, rfc822, safeHref, shanghaiDayKey, shanghaiLabel, xmlEsc } from "./text";
import type { ItemRow } from "./types";

const FAVICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0c5f57"/><path d="M16 5.5 19.2 14.6 16 26.5 12.8 14.6Z" fill="#f4efe4"/><circle cx="16" cy="16" r="1.7" fill="#8d2e28"/></svg>`,
  );

export interface HomeView {
  items: ItemRow[];
  classics: ItemRow[];
  total: number;
  page: number;
  source: string;
  tag: string;
  topic: string;
  generatedAt: string;
}

function pageHref(page: number, source: string, tag: string, topic = ""): string {
  const params = new URLSearchParams();
  if (source) params.set("source", source);
  if (tag) params.set("tag", tag);
  if (topic) params.set("topic", topic);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

function displayAuthor(author: string | null): string {
  return author && author.trim() ? author : "未知";
}

function attribution(item: ItemRow): string {
  return `来源：<strong>${esc(item.source_name)}</strong> · 作者：<strong>${esc(displayAuthor(item.author))}</strong> · <a href="${safeHref(item.canonical_url)}" target="_blank" rel="noopener noreferrer">原文链接</a>`;
}

function tagLinks(item: ItemRow, source: string): string {
  const tags = parseTags(item.tags);
  if (!tags.length) return "";
  return `<ul class="badges">${tags
    .map(
      (tag) =>
        `<li><a href="${esc(pageHref(1, source, tag.id))}">${esc(tag.label)}</a></li>`,
    )
    .join("")}</ul>`;
}

function popularity(item: ItemRow): string {
  if (!item.popularity || !item.popularity_label) return "";
  return `${item.popularity} ${item.popularity_label}`;
}

function layout(options: {
  title: string;
  description: string;
  path: string;
  body: string;
  origin: string;
}): string {
  const onHome = options.path === "/" || options.path.startsWith("/?");
  const fullTitle = onHome ? "游牧手记" : `${options.title} · 游牧手记`;
  const canonical = `${options.origin}${options.path === "/" ? "/" : options.path}`;
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(options.description)}">
<link rel="canonical" href="${esc(canonical)}">
<link rel="alternate" type="application/rss+xml" title="游牧手记" href="/rss.xml">
<link rel="icon" href="${FAVICON}">
<meta name="theme-color" content="#0c5f57">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(options.description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:locale" content="zh_CN">
<meta property="og:type" content="website">
<style>${CSS}</style>
</head>
<body>
<a class="skip" href="#content">跳到正文</a>
<header class="mast">
  <div class="wrap mast-inner">
    <p class="kicker">nomad.evanzhang.cloud · 每日选读</p>
    <div class="mast-row">
      <a class="logo" href="/">游牧手记</a>
      <nav class="site" aria-label="站点">
        <a href="/" ${onHome ? 'aria-current="page"' : ""}>最新</a>
        <a href="/about" ${options.path === "/about" ? 'aria-current="page"' : ""}>关于</a>
        <a href="/rss.xml">RSS</a>
      </nav>
    </div>
    <p class="deck">每天从公开网页整理中文的数字游民、远程工作、签证和旅居内容。这里只放标题、三百字以内的摘要，以及回到原文的链接。</p>
  </div>
</header>
<main id="content" class="wrap">${options.body}</main>
<footer class="site">
  <div class="wrap">
    <p>本站只整理公开来源的标题、短摘要与链接，不转载全文。内容著作权归原作者所有。</p>
    <p>游牧手记 · <a href="/rss.xml">订阅 RSS</a> · <a href="/about">关于这份日更</a></p>
  </div>
</footer>
</body>
</html>`;
}

function classicsBlock(view: HomeView): string {
  const tabs = [
    `<a class="tag${view.topic ? "" : " on"}" href="${esc(pageHref(1, view.source, view.tag, ""))}">全部精选</a>`,
    ...TOPICS.map(
      (topic) =>
        `<a class="tag${view.topic === topic.id ? " on" : ""}" href="${esc(pageHref(1, view.source, view.tag, topic.id))}">${esc(topic.label)}</a>`,
    ),
  ].join("");
  const cards = view.classics
    .map(
      (item, index) => `<article class="item">
      <div class="index">${String(index + 1).padStart(2, "0")}</div>
      <div>
        <h3><a href="/item/${item.id}">${esc(item.title)}</a></h3>
        ${item.excerpt ? `<p class="excerpt">${esc(item.excerpt)}</p>` : ""}
        <p class="attr">${attribution(item)}</p>
        <p class="submeta">${esc([TOPICS.find((topic) => topic.id === item.topic)?.label, item.quality_score ? `${item.quality_score} 分` : ""].filter(Boolean).join(" · "))}</p>
      </div>
    </article>`,
    )
    .join("");
  return `<section class="classic">
    <h2>经典教程</h2>
    <p class="count">精选过的长指南，和下面的每日收录分开。</p>
    <div class="tag-row" aria-label="经典主题">${tabs}</div>
    ${cards || `<p class="empty">这个主题下还没有经典教程。</p>`}
  </section>`;
}

function filters(view: HomeView): string {
  const tags = [
    `<a class="tag${view.tag ? "" : " on"}" href="${esc(pageHref(1, view.source, "", view.topic))}">全部</a>`,
    ...TAGS.map(
      (tag) =>
        `<a class="tag${view.tag === tag.id ? " on" : ""}" href="${esc(pageHref(1, view.source, tag.id, view.topic))}">${esc(tag.label)}</a>`,
    ),
  ].join("");
  const options = [
    `<option value="">全部来源</option>`,
    ...SOURCES.map(
      (source) =>
        `<option value="${esc(source.id)}"${view.source === source.id ? " selected" : ""}>${esc(source.name)}</option>`,
    ),
  ].join("");
  return `<form class="filters" method="get" action="/">
    <div class="tag-row" role="navigation" aria-label="按主题筛选">${tags}</div>
    <div class="source-form">
      <label>来源 <select name="source">${options}</select></label>
      ${view.tag ? `<input type="hidden" name="tag" value="${esc(view.tag)}">` : ""}
      ${view.topic ? `<input type="hidden" name="topic" value="${esc(view.topic)}">` : ""}
      <button type="submit">筛选</button>
    </div>
  </form>`;
}

function itemCard(item: ItemRow, index: number, sourceFilter: string): string {
  const bits = [
    popularity(item),
    item.published_at ? `发布于 ${shanghaiLabel(item.published_at, false)}` : "",
    item.language === "zh" ? "中文" : "EN",
  ].filter(Boolean);
  return `<article class="item">
    <div class="index">${String(index).padStart(2, "0")}</div>
    <div>
      <h3><a href="/item/${item.id}">${esc(item.title)}</a></h3>
      ${item.excerpt ? `<p class="excerpt">${esc(item.excerpt)}</p>` : ""}
      <p class="attr">${attribution(item)}</p>
      ${tagLinks(item, sourceFilter)}
      <p class="submeta">${esc(bits.join(" · "))}</p>
    </div>
  </article>`;
}

export function renderHome(view: HomeView, origin: string): string {
  const pages = pageCount(view.total, PAGE_SIZE);
  const activeTag = view.tag ? knownTag(view.tag)?.label : "";
  const activeSource = SOURCES.find((source) => source.id === view.source)?.name;
  const filterBits = [activeSource, activeTag].filter(Boolean).join(" · ");
  let list = "";
  if (!view.items.length) {
    list = `<div class="empty"><p>${
      view.total === 0 && !view.source && !view.tag
        ? "还没有收录。每天北京时间 08:00 和 22:00 会各收集一次。本地调试可以调用管理接口手动跑一轮。"
        : "没有符合筛选条件的条目。"
    }</p></div>`;
  } else {
    const groups: Array<{ key: string; label: string; items: ItemRow[] }> = [];
    for (const item of view.items) {
      const key = shanghaiDayKey(item.collected_at);
      const last = groups[groups.length - 1];
      if (!last || last.key !== key) {
        groups.push({ key, label: shanghaiLabel(item.collected_at), items: [item] });
      } else {
        last.items.push(item);
      }
    }
    let number = (view.page - 1) * PAGE_SIZE;
    list = groups
      .map((group) => {
        const cards = group.items
          .map((item) => {
            number += 1;
            return itemCard(item, number, view.source);
          })
          .join("");
        return `<section class="day"><h2>收录于 ${esc(group.label)}<span>${group.items.length} 篇</span></h2>${cards}</section>`;
      })
      .join("");
  }
    const prev =
    view.page > 1
      ? `<a href="${esc(pageHref(view.page - 1, view.source, view.tag, view.topic))}">上一页</a>`
      : `<span>上一页</span>`;
  const next =
    view.page < pages
      ? `<a href="${esc(pageHref(view.page + 1, view.source, view.tag, view.topic))}">下一页</a>`
      : `<span>下一页</span>`;
  const body = `${classicsBlock(view)}
    <h2 class="daily-heading">最新收录</h2>
    ${filters(view)}
    <p class="count">共 ${view.total} 篇${filterBits ? ` · ${esc(filterBits)}` : ""} · 第 ${view.page} / ${pages} 页 · ${esc(shanghaiLabel(view.generatedAt, false))}</p>
    ${list}
    ${view.total > PAGE_SIZE ? `<nav class="pager" aria-label="分页">${prev}<span>第 ${view.page} / ${pages} 页</span>${next}</nav>` : ""}`;
  return layout({
    title: "最新",
    description: "数字游民、远程工作、签证与旅居的每日选读。只收录标题、短摘要和原文链接。",
    path: pageHref(view.page, view.source, view.tag, view.topic),
    body,
    origin,
  });
}

export function renderItem(item: ItemRow, origin: string): string {
  const bits = [
    popularity(item),
    item.published_at ? `发布于 ${shanghaiLabel(item.published_at)}` : "",
    `收录于 ${shanghaiLabel(item.collected_at)}`,
    item.language === "zh" ? "中文" : "EN",
  ].filter(Boolean);
  const discussion = item.discussion_url
    ? `<p class="discuss"><a href="${safeHref(item.discussion_url)}" target="_blank" rel="noopener noreferrer">查看讨论线程</a></p>`
    : "";
  const body = `<article class="post">
    <p class="kicker">${esc(item.language === "zh" ? "中文" : "EN")}</p>
    <h1>${esc(item.title)}</h1>
    <p class="attr">${attribution(item)}</p>
    ${item.excerpt ? `<blockquote class="quote">${esc(item.excerpt)}</blockquote>` : `<p class="note">这条来源没有提供可用的摘要。</p>`}
    <p class="note">上面是来源站点公开描述里的短摘要，最多 300 字，不是正文。请从原文链接继续读。</p>
    <p><a class="read" href="${safeHref(item.canonical_url)}" target="_blank" rel="noopener noreferrer">阅读原文</a></p>
    ${discussion}
    ${tagLinks(item, "")}
    <p class="submeta">${esc(bits.join(" · "))}</p>
  </article>`;
  return layout({
    title: item.title,
    description: item.excerpt || `${item.source_name} 的一条收录，链回原文。`,
    path: `/item/${item.id}`,
    body,
    origin,
  });
}

export function renderAbout(origin: string): string {
  const sources = SOURCES.map(
    (source) =>
      `<li><strong>${esc(source.name)}</strong> · <a href="${safeHref(source.hint)}">${esc(source.hint)}</a></li>`,
  ).join("");
  const body = `<article class="about">
    <h1>关于游牧手记</h1>
    <p>这是给中文读者的一份数字游民日更。它不生产原创长文，只收录标题以中文为主的公开内容，留下标题、短摘要和出处。</p>
    <h2>每天怎么更新</h2>
    <p>同一个 Cloudflare Worker 在北京时间 08:00 和 22:00 各跑一次采集。两次都写进当天的分组。每条都要先对上海外开卡、手机卡、税号、AI 订阅、签证、远程方法或券商，并且分数够高；招聘和闲聊不会进来。每次最多新增 16 条。</p>
    <h2>页面上有什么</h2>
    <ul>
      <li>首页按收录日分组，可以按来源和主题筛选，也可以翻页。</li>
      <li>每条记录有自己的页面，上面有来源、作者和原文链接。</li>
      <li><a href="/rss.xml">/rss.xml</a> 是这份日更自己的订阅源。</li>
    </ul>
    <h2>我们不保存什么</h2>
    <p>不抓正文，也不把全文放进数据库。摘要来自来源自己的描述、简介或帖子开头，截到 300 个字符。作者未知时会写成「未知」，不会把转帖的人说成原作者。</p>
    <h2>现在的来源</h2>
    <ul>${sources}</ul>
    <p>英文来源已经拿掉。V2EX 的官方接口从 Cloudflare 的地址访问会返回 403，所以也不直接抓。标题里汉字不够多的条目会被跳过。</p>
    <h2>版权</h2>
    <p>标题、摘要和链接只为了方便你决定要不要点回去。内容著作权归原作者所有。若要阅读，请使用每条记录上的原文链接。</p>
  </article>`;
  return layout({
    title: "关于",
    description: "游牧手记如何每天收集数字游民与远程工作的公开指南，以及它不转载全文的原因。",
    path: "/about",
    body,
    origin,
  });
}

export function renderNotFound(origin: string): string {
  return layout({
    title: "没有这条记录",
    description: "这个地址没有对应的收录。",
    path: "/404",
    body: `<div class="empty"><h1>没有找到这条记录</h1><p><a href="/">回到今天的选读</a></p></div>`,
    origin,
  });
}

export function renderError(origin: string): string {
  return layout({
    title: "暂时打不开",
    description: "页面暂时不可用。",
    path: "/error",
    body: `<div class="empty"><h1>页面暂时打不开</h1><p>请稍后再试。</p></div>`,
    origin,
  });
}

export function renderRss(items: ItemRow[], origin: string): string {
  const entries = items
    .map((item) => {
      const link = `${origin}/item/${item.id}`;
      const author = displayAuthor(item.author);
      const description = `${item.excerpt || "来源没有提供摘要。"} 来源：${item.source_name}。作者：${author}。原文：${item.canonical_url}`;
      const when = item.published_at || item.collected_at;
      return `<item>
  <title>${xmlEsc(item.title)}</title>
  <link>${xmlEsc(link)}</link>
  <guid isPermaLink="true">${xmlEsc(link)}</guid>
  <pubDate>${xmlEsc(rfc822(when))}</pubDate>
  <dc:creator>${xmlEsc(author)}</dc:creator>
  <description>${xmlEsc(description)}</description>
  <source url="${xmlEsc(item.canonical_url)}">${xmlEsc(item.source_name)}</source>
</item>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>游牧手记</title>
  <link>${xmlEsc(origin)}/</link>
  <atom:link href="${xmlEsc(origin)}/rss.xml" rel="self" type="application/rss+xml"/>
  <description>每天整理数字游民、远程工作、签证与旅居的公开指南。只有标题、短摘要和原文链接，不转载全文。</description>
  <language>zh-CN</language>
  <lastBuildDate>${xmlEsc(new Date().toUTCString())}</lastBuildDate>
  ${entries}
</channel>
</rss>`;
}
