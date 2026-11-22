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
  return `来源：<strong>${esc(item.source_name)}</strong> · 作者：<strong>${esc(displayAuthor(item.author))}</strong> · <a class="origin" href="${safeHref(item.canonical_url)}" target="_blank" rel="noopener noreferrer">原文</a>`;
}

function reprint(item: ItemRow): string {
  const author = item.author?.trim()
    ? `<p><span>作者</span>${esc(item.author)}</p>`
    : "";
  return `<aside class="reprint">
    <p><span>原文标题</span>${esc(item.title)}</p>
    ${author}
    <p><span>来源站点</span>${esc(item.source_name)}</p>
    <p><span>原文链接</span><a href="${safeHref(item.canonical_url)}" target="_blank" rel="noopener noreferrer">${esc(item.canonical_url)}</a></p>
    <p class="notice">本文转载自${esc(item.source_name)}，版权归原作者所有，如有侵权请联系删除</p>
  </aside>`;
}

function safeBody(html: string | null | undefined): string | null {
  if (!html) return null;
  if (/<\s*script\b|<\/script|on\w+\s*=|javascript:/i.test(html)) return null;
  return html;
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
    <p class="deck">每天整理中文数字游民指南。点标题读全文，文首和文末都写着出处；列表上优先显示 AI 摘要。</p>
  </div>
</header>
<main id="content" class="wrap">${options.body}</main>
<footer class="site">
  <div class="wrap">
    <p>正文转载自公开来源，文首和文末保留标题、作者、来源和原文链接。内容著作权归原作者所有，如有侵权请联系删除。</p>
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
        <h3><a href="/a/${item.id}">${esc(item.title)}</a></h3>
        ${item.ai_summary ? `<p class="excerpt"><span class="ai-mark">AI 摘要</span> ${esc(item.ai_summary)}</p>` : item.excerpt ? `<p class="excerpt">${esc(item.excerpt)}</p>` : ""}
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
      <h3><a href="/a/${item.id}">${esc(item.title)}</a></h3>
      ${item.ai_summary ? `<p class="excerpt"><span class="ai-mark">AI 摘要</span> ${esc(item.ai_summary)}</p>` : item.excerpt ? `<p class="excerpt">${esc(item.excerpt)}</p>` : ""}
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
    description: "数字游民、远程工作、签证与旅居的每日选读。列表给出 AI 摘要，详情页是带来源的全文。",
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
  const full = safeBody(item.content_html);
  const aiBox = item.ai_summary
    ? `<p class="ai-summary"><strong>AI 摘要</strong> ${esc(item.ai_summary)}</p>`
    : "";
  const article = full
    ? `<div class="article-body">${full}</div>`
    : `<p class="note">${item.excerpt ? "全文还没有抓到，下面先放原来的摘要。" : "这条来源暂时没有可用的正文。"}</p>${
        item.excerpt ? `<blockquote class="quote">${esc(item.excerpt)}</blockquote>` : ""
      }`;
  const body = `<article class="post">
    <p class="kicker">${esc(item.language === "zh" ? "中文" : "EN")}</p>
    <h1>${esc(item.title)}</h1>
    ${aiBox}
    ${reprint(item)}
    ${article}
    <p><a class="read" href="${safeHref(item.canonical_url)}" target="_blank" rel="noopener noreferrer">阅读原文</a></p>
    ${discussion}
    ${tagLinks(item, "")}
    <p class="submeta">${esc(bits.join(" · "))}</p>
    ${reprint(item)}
  </article>`;
  return layout({
    title: item.title,
    description: item.ai_summary || item.excerpt || `${item.source_name} 的一篇转载。`,
    path: `/a/${item.id}`,
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
    <p>这是给中文读者的一份数字游民日更。它收录标题以中文为主的公开文章，在本站展示全文，并在文首文末写明出处。</p>
    <h2>每天怎么更新</h2>
    <p>同一个 Cloudflare Worker 在北京时间 08:00 和 22:00 各跑一次采集。两次都写进当天的分组。每条都要先对上海外开卡、手机卡、税号、AI 订阅、签证、远程方法或券商，并且分数够高；招聘和闲聊不会进来。每次最多新增 16 条。</p>
    <h2>页面上有什么</h2>
    <ul>
      <li>首页按收录日分组，可以按来源和主题筛选，也可以翻页。</li>
      <li>每篇文章在 <code>/a/编号</code>，正文上方有 AI 摘要，开头和结尾都有原文标题、作者、来源和原文链接。</li>
      <li><a href="/rss.xml">/rss.xml</a> 是这份日更自己的订阅源。</li>
    </ul>
    <h2>正文和摘要</h2>
    <p>采集时优先使用订阅源里的全文，没有的话再打开原文页提取正文。脚本、样式和跟踪参数会被去掉。抓不到正文时仍显示原来的短摘要。抓到正文后，Workers AI 会写两到三句简体中文摘要；模型失败时列表继续用 RSS 摘要。作者未知时列表写成「未知」，不会把转帖的人说成原作者。</p>
    <h2>现在的来源</h2>
    <ul>${sources}</ul>
    <p>英文来源已经拿掉。V2EX 的官方接口从 Cloudflare 的地址访问会返回 403，所以也不直接抓。标题里汉字不够多的条目会被跳过。</p>
    <h2>版权</h2>
    <p>本文转载自各来源站点，版权归原作者所有，如有侵权请联系删除。每篇文章的开头和结尾都重复了原文标题、来源和原文链接。</p>
  </article>`;
  return layout({
    title: "关于",
    description: "游牧手记如何每天收集数字游民与远程工作的公开指南，并在保留出处的前提下展示全文。",
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
      const link = `${origin}/a/${item.id}`;
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
  <description>每天整理数字游民、远程工作、签证与旅居的公开指南。站内文章保留出处并链回原文。</description>
  <language>zh-CN</language>
  <lastBuildDate>${xmlEsc(new Date().toUTCString())}</lastBuildDate>
  ${entries}
</channel>
</rss>`;
}
