# 游牧手记

给中文读者的数字游民日更。站点地址是 [nomad.evanzhang.cloud](https://nomad.evanzhang.cloud)。

同一个 Cloudflare Worker 负责两件事：每天去公开来源挑一轮热门指南，以及把这些条目渲染成网页。没有第二台服务器，也没有前端框架。正文不入库，页面上只有标题、最多 300 字的摘要、来源、作者和原文链接。

## 架构

```
Cron 0 0 * * * UTC
        │
        ▼
Worker（src/index.ts，ES Module）
  ├─ scheduled → 采集器
  └─ fetch     → 首页 / 详情 / 关于 / RSS / POST /admin/collect
        │
        ▼
D1（绑定名 DB）
```

- 定时表达式：`0 0 * * *`，即每天 00:00 UTC，北京时间 08:00。
- D1 绑定名：`DB`。数据库名：`nomad-blog`。
- 自定义域名：`nomad.evanzhang.cloud`（zone `evanzhang.cloud` 已在 Cloudflare）。
- Worker 名称：`nomad-blog`。
- 唯一密钥：`ADMIN_TOKEN`。用 `wrangler secret put ADMIN_TOKEN` 写入，不要放进仓库。`wrangler.toml` 里的 `database_id` 是占位符 `00000000-0000-0000-0000-000000000000`，部署前换成 `wrangler d1 create` 返回的 id。

采集器对每个来源单独 `fetch`、单独超时（大约 12 秒）、单独捕获错误。一个来源失败只会记在当轮报告里。条目按规范 URL 去重，再按热度（点数、反应、回复）和新鲜程度挑选，每轮最多写入 16 条新内容。同一个 URL 再遇到时不会覆盖，也不会把全文存下来。

## 本地运行

需要 Node.js 22+。

```bash
npm install
npm test
npm run check
npx wrangler d1 migrations apply DB --local
cp .dev.vars.example .dev.vars
npm run dev
```

开发服务器监听 `http://127.0.0.1:4391`。手动跑一轮采集：

```bash
curl -X POST http://127.0.0.1:4391/admin/collect \
  -H "Authorization: Bearer dev-admin-token"
```

然后打开首页、一条详情、`/about` 和 `/rss.xml`。

## 部署

仓库里的 `dist/worker.js` 是已经打好的单文件 ES Module，给不经过本机 wrangler 的部署用。自己重新构建：

```bash
npm run build
```

这会执行 `wrangler deploy --dry-run --outdir dist`，再把产物整理成没有外部 import 的 `dist/worker.js`。

在 Cloudflare 上部署时：

```bash
npx wrangler d1 create nomad-blog
# 把输出的 database_id 写进 wrangler.toml，替换占位符

npx wrangler d1 migrations apply DB --remote
npx wrangler secret put ADMIN_TOKEN
npx wrangler deploy
```

`wrangler deploy` 会按 `wrangler.toml` 绑定 D1、挂上每天一次的 Cron，并把 Worker 接到 `nomad.evanzhang.cloud`。

上线后可以手动补一轮：

```bash
curl -X POST https://nomad.evanzhang.cloud/admin/collect \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

没带正确的 `Authorization: Bearer <ADMIN_TOKEN>` 会返回 401。没配置 `ADMIN_TOKEN` 时，这个接口一律拒绝。

## 页面

- `/` 按收录日分组的最新条目，可用来源和主题筛选，可翻页。
- `/item/:id` 单条记录。来源行的形式是「来源：… · 作者：… · 原文链接」。作者缺失时写「未知」。
- `/about` 说明这份日更收集什么、不收集什么。
- `/rss.xml` 站点自己的 RSS。条目链到本站详情，描述里带原文地址。
- `POST /admin/collect` 手动采集。

页脚写明：内容著作权归原作者所有，本站不转载全文。

## 来源

| id | 名称 | 地址 | 热度 |
| --- | --- | --- | --- |
| `hn` | Hacker News | Algolia `digital nomad` / `nomad visa` / `remote work` | 点数，评论作少量加权 |
| `devto` | dev.to | `tag=digitalnomad`，以及 `tag=remotework&top=7` | 反应数 |
| `medium` | Medium | `digital-nomad` 标签 RSS；`remote-work` 只留下和游民、签证、旅行相关的 | 无，靠时间 |
| `nomadgate` | Nomad Gate | `https://nomadgate.com/feed.xml` | 无 |
| `johnnyfd` | JohnnyFD | `https://www.johnnyfd.com/feeds/posts/default?alt=rss` | 无 |
| `v2ex-remote` | V2EX · 远程工作 | `node_name=remote` | 回复数 |
| `v2ex-visa` | V2EX · 签证 | `node_name=visa` | 回复数 |
| `eleduck` | 电鸭社区 | `https://eleduck.com/feed/latest.xml` | 无 |
| `remoteok` | Remote OK | `https://remoteok.com/api`，只留全球远程的设计、工程、产品等工作 | 无 |

请求都带 `User-Agent: NomadBlogBot/1.0 (+https://nomad.evanzhang.cloud; excerpts-only; attribution)`。

查过但没有接进来的：

- Reddit 的 JSON 和 RSS 在这里返回 403 或登录页。
- Nomad List 的 `/feed`、`/rss`、`/blog/feed` 返回的是网站 HTML，不是订阅源。
- Remote OK 博客 RSS 返回 410。职位 API 还在，所以只收了全球远程这一类。
- 电鸭的 `svc.eleduck.com` API 返回 403。官网 RSS 可用。
- V2EX「数字游民」节点几乎没有帖子。「dn」节点是域名，不是游民。

Hacker News 上外链文章的提交者不会被写成原作者，作者一栏是「未知」，讨论线程另给链接。Ask / Show HN 没有外链时，作者才是发帖的人。

## 怎么加一个来源

编辑 `src/sources.ts` 的 `SOURCES`。每个来源是一个对象：`id`、`name`、给人看的 `hint`，以及 `fetch()`。`fetch` 只返回 `buildDraft(...)` 的结果，不要自己写数据库。

`buildDraft` 会做这些事：规范 URL、去掉追踪参数、把摘要压到 300 字、丢掉非 http(s) 链接、打上关键词标签。热度放在 `popularity`，展示用的单位放在 `popularityLabel`（比如「分」「回复」「反应」）。

RSS 或 Atom 可以用 `parseFeed`（`src/feed.ts`）。它只取 `description` / `summary`，没有描述时才退回 `content` 的开头，并且同样截断。

加完以后跑 `npm test`。`test/sources.live.test.ts` 会真的请求每个来源，空结果或打不开都会失败。确认有条目后，再 `npm run build`，把新的 `dist/worker.js` 留在仓库里。

主题标签在 `src/tags.ts`。匹配的是标题和摘要里的关键词，中英都可以。一条最多四个标签。

## 数据库

结构在 `migrations/0001_init.sql`。

- `items`：一条公开内容的标题、摘要、来源、作者、时间、热度、标签、原文 URL。`canonical_url` 唯一。
- `collect_runs`：每一轮采集的结果，方便回头看哪个来源失败了。

标签以 `|visa|jobs|` 这种形式存储，筛选时用 `LIKE`。

## 测试

```bash
npm test
```

单测覆盖 URL 规范化、摘要截断、RSS 解析、每日名额和去重、页面转义和来源行、管理接口的鉴权。另外一组测试会访问上面每个来源，把采到的条目写进本地 sqlite，再请求首页、详情、签证筛选和 RSS，确认页面上有来源、作者和原文链接。

## 目录

```
src/index.ts          Worker 入口
src/sources.ts        来源
src/collect.ts        调度、排序、写入
src/render.ts         中文页面和 RSS
migrations/0001_init.sql
dist/worker.js        单文件构建产物
wrangler.toml
```
