import { runBackfill } from "./backfill";
import { purgeItems, runCollect } from "./collect";
import { fillMissingContent, fillMissingSummaries, parseBatchLimit, parseReindexLimit, reindexContentText } from "./fulltext";
import { countItems, countSearch, getItem, listClassics, listItems, normalizePage, PAGE_SIZE, parsePage, recentItems, searchItems } from "./queries";
import { SEARCH_PAGE_SIZE, normalizeSearchQuery } from "./search";
import { topicById } from "./score";
import {
  renderAbout,
  renderError,
  renderHome,
  renderItem,
  renderNotFound,
  renderRss,
  renderSearch,
} from "./render";
import { knownSource } from "./sources";
import { knownTag } from "./tags";
import type { Env } from "./types";

function originOf(request: Request): string {
  return new URL(request.url).origin;
}

function html(body: string, status = 200, cache = "public, max-age=120"): Response {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "content-language": "zh-CN",
      "cache-control": cache,
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
    },
  });
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

export function bearerOk(header: string | null, token: string | undefined): boolean {
  if (!token) return false;
  const expected = new TextEncoder().encode(`Bearer ${token}`);
  const actual = new TextEncoder().encode(header ?? "");
  const length = Math.max(expected.length, actual.length);
  let diff = expected.length === actual.length ? 0 : 1;
  for (let index = 0; index < length; index++) {
    diff |= (expected[index] ?? 0) ^ (actual[index] ?? 0);
  }
  return diff === 0;
}

function searchHref(base: string, q: string, page: number): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

async function searchResponse(url: URL, env: Env, origin: string): Promise<Response> {
  const basePath = url.pathname === "/search" ? "/search" : "/";
  const q = normalizeSearchQuery(url.searchParams.get("q"));
  if (!q) {
    return html(renderSearch({ q: "", items: [], total: 0, page: 1, basePath }, origin));
  }
  const requested = parsePage(url.searchParams.get("page"));
  const total = await countSearch(env.DB, q);
  const page = normalizePage(requested, total, SEARCH_PAGE_SIZE);
  if (url.searchParams.has("page") && page !== requested) {
    return redirect(searchHref(basePath, q, page));
  }
  const items = await searchItems(env.DB, q, page);
  return html(renderSearch({ q, items, total, page, basePath }, origin), 200, "public, max-age=60");
}

function redirect(location: string): Response {
  return new Response(null, {
    status: 302,
    headers: { location, "cache-control": "no-store" },
  });
}

export async function handle(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const origin = originOf(request);
  try {
    if (url.pathname.startsWith("/admin/")) {
      if (request.method !== "POST") {
        return json({ error: "method not allowed" }, 405);
      }
      if (!bearerOk(request.headers.get("Authorization"), env.ADMIN_TOKEN)) {
        return json({ error: "unauthorized" }, 401);
      }
      if (url.pathname === "/admin/purge-non-chinese") {
        return json({ ok: true, ...(await purgeItems(env.DB, "all")) });
      }
      if (url.pathname === "/admin/purge-low-quality") {
        return json({ ok: true, ...(await purgeItems(env.DB, "quality")) });
      }
      if (url.pathname === "/admin/backfill") {
        return json(await runBackfill(env));
      }
      if (url.pathname === "/admin/collect") {
        return json(await runCollect(env, "manual"), 200);
      }
      if (url.pathname === "/admin/fetch-content") {
        return json({ ok: true, ...(await fillMissingContent(env, parseBatchLimit(url.searchParams.get("limit")))) });
      }
      if (url.pathname === "/admin/summarize") {
        return json({ ok: true, ...(await fillMissingSummaries(env, parseBatchLimit(url.searchParams.get("limit")))) });
      }
      if (url.pathname === "/admin/reindex") {
        return json({ ok: true, ...(await reindexContentText(env.DB, parseReindexLimit(url.searchParams.get("limit")))) });
      }
      return json({ error: "not found" }, 404);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return json({ error: "method not allowed" }, 405);
    }

    if (url.pathname === "/health") {
      return json({ ok: true, name: "nomad-blog" });
    }
    if (url.pathname === "/about") return html(renderAbout(origin), 200, "public, max-age=3600");
    if (url.pathname === "/rss.xml") {
      const items = await recentItems(env.DB, 40);
      return new Response(renderRss(items, origin), {
        headers: {
          "content-type": "application/rss+xml; charset=utf-8",
          "cache-control": "public, max-age=600",
          "x-content-type-options": "nosniff",
        },
      });
    }

    const legacyMatch = url.pathname.match(/^\/item\/(\d+)$/);
    if (legacyMatch) return redirect(`/a/${legacyMatch[1]}`);

    const itemMatch = url.pathname.match(/^\/a\/(\d+)$/);
    if (itemMatch) {
      const id = Number(itemMatch[1]);
      const item = await getItem(env.DB, id);
      if (!item) return html(renderNotFound(origin), 404, "no-store");
      return html(renderItem(item, origin), 200, "public, max-age=600");
    }

    if (url.pathname === "/search" || (url.pathname === "/" && normalizeSearchQuery(url.searchParams.get("q")))) {
      return searchResponse(url, env, origin);
    }

    if (url.pathname === "/") {
      const source = knownSource(url.searchParams.get("source") ?? "")?.id ?? "";
      const tag = knownTag(url.searchParams.get("tag") ?? "")?.id ?? "";
      const topic = topicById(url.searchParams.get("topic") ?? "")?.id ?? "";
      const requested = parsePage(url.searchParams.get("page"));
      const total = await countItems(env.DB, source, tag);
      const page = normalizePage(requested, total, PAGE_SIZE);
      if (url.searchParams.has("page") && page !== requested) {
        const params = new URLSearchParams();
        if (source) params.set("source", source);
        if (tag) params.set("tag", tag);
        if (topic) params.set("topic", topic);
        if (page > 1) params.set("page", String(page));
        const query = params.toString();
        return redirect(query ? `/?${query}` : "/");
      }
      const items = await listItems(env.DB, source, tag, page);
      const classics = await listClassics(env.DB, topic);
      return html(
        renderHome(
          { items, classics, total, page, source, tag, topic, generatedAt: new Date().toISOString() },
          origin,
        ),
      );
    }

    return html(renderNotFound(origin), 404, "no-store");
  } catch (error) {
    console.error("request failed", error instanceof Error ? error.message : error);
    return html(renderError(origin), 500, "no-store");
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return handle(request, env);
  },
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<void> {
    void controller.cron;
    ctx.waitUntil(
      runCollect(env, "cron").catch((error: unknown) => {
        console.error("cron collect failed", error instanceof Error ? error.message : error);
      }),
    );
  },
} satisfies ExportedHandler<Env>;
