# 游牧手记

给中文读者的数字游民日更。站点地址是 [nomad.evanzhang.cloud](https://nomad.evanzhang.cloud)。

同一个 Cloudflare Worker 负责两件事：每天两次去公开来源挑中文指南，以及把这些条目渲染成网页。没有第二台服务器，也没有前端框架。正文不入库，页面上只有标题、最多 300 字的摘要、来源、作者和原文链接。

## 架构

```
Cron 0 0 * * * 与 0 14 * * * UTC
        │
        ▼
Worker（src/index.ts，ES Module）
  ├─ scheduled → 采集器
  └─ fetch     → 首页 / 详情 / 关于 / RSS / POST /admin/collect / POST /admin/purge-non-chinese
        │
        ▼
D1（绑定名 DB）
```

- 定时表达式：`0 0 * * *` 和 `0 14 * * *`，即 UTC 00:00 与 14:00，北京时间 08:00 与 22:00。两次都执行同一套采集。
- D1 绑定名：`DB`。数据库名：`nomad-blog`。
- 自定义域名：`nomad.evanzhang.cloud`（zone `evanzhang.cloud` 已在 Cloudflare）。
- Worker 名称：`nomad-blog`。
- 唯一密钥：`ADMIN_TOKEN`。用 `wrangler secret put ADMIN_TOKEN` 写入，不要放进仓库。`wrangler.toml` 里的 `database_id` 是占位符 `00000000-0000-0000-0000-000000000000`，部署前换成 `wrangler d1 create` 返回的 id。

采集器对每个来源单独 `fetch`、单独超时（大约 12 秒）、单独捕获错误。一个来源失败只会记在当轮报告里。只留下标题以中文为主的条目（至少 4 个汉字，并且汉字不少于汉字与英文字母合计的 45%）。同一篇原文只保留一次。每次运行按新鲜程度最多写入 16 条新内容，所以一天两次最多大约 32 条；第二次不会把第一次已经写入的链接再写一遍。首页按北京时间的收录日分组，同一天的两次结果在同一组里。

`compatibility_date` 是 `2026-01-15`。没有 `compatibility_flags`，也不需要 `nodejs_compat`。除了密钥 `ADMIN_TOKEN`，Worker 只读 D1 绑定 `DB`。

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

`wrangler deploy` 会按 `wrangler.toml` 绑定 D1、挂上每天两次的 Cron，并把 Worker 接到 `nomad.evanzhang.cloud`。

上线后可以手动补一轮：

```bash
curl -X POST https://nomad.evanzhang.cloud/admin/collect \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

清掉已经入库、但标题不是中文为主的旧条目：

```bash
curl -X POST https://nomad.evanzhang.cloud/admin/purge-non-chinese \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

返回 `{"ok":true,"scanned":123,"deleted":40}`。判断标准和采集时一样。没带正确的 `Authorization: Bearer <ADMIN_TOKEN>` 会返回 401。没配置 `ADMIN_TOKEN` 时，这两个接口一律拒绝。

## 页面

- `/` 按收录日分组的最新条目，可用来源和主题筛选，可翻页。
- `/item/:id` 单条记录。来源行的形式是「来源：… · 作者：… · 原文链接」。作者缺失时写「未知」。
- `/about` 说明这份日更收集什么、不收集什么。
- `/rss.xml` 站点自己的 RSS。条目链到本站详情，描述里带原文地址。
- `POST /admin/collect` 手动采集。

页脚写明：内容著作权归原作者所有，本站不转载全文。

## 来源

只要中文。这些站提供自己的 RSS，不依赖会被 Cloudflare 拦住的接口。

| id | 名称 | 地址 |
| --- | --- | --- |
| `eleduck` | 电鸭社区 | `https://eleduck.com/feed/latest.xml` |
| `looktheworld` | Look the World | `https://www.looktheworld.com/changes.xml` |
| `jarodise` | 数字游民部落 | `https://jarodise.com/rss.xml`（标题或摘要要碰到游民、远程、签证、旅居、海外这些词） |
| `turtlegirl` | 乌龟妹出走旅行 | `https://turtlegirltravel.com/category/digital-nomad/feed/` |
| `rososa` | 爱沙尼亚电子居民社区 | `https://rososa.com/feed/` |

请求都带 `User-Agent: NomadBlogBot/1.0 (+https://nomad.evanzhang.cloud; excerpts-only; attribution)`。

没有接进来的：

- Hacker News、dev.to、Medium、Nomad Gate、JohnnyFD、Remote OK：英文来源。
- V2EX 官方 JSON 和 Atom：在 Cloudflare 的出口 IP 上返回 403。
- `rsshub.app`：对这个采集器直接拒绝。能用的镜像也没有「远程工作」节点这条路由，全站最新里几乎碰不到游民或签证，所以不用它当生产来源。

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
