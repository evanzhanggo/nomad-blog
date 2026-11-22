export const CSS = `
:root {
  color-scheme: light;
  --paper: #f4efe4;
  --paper-2: #fffaf2;
  --ink: #1c1712;
  --muted: #5e564e;
  --line: #e0d3c2;
  --line-strong: #c9b8a2;
  --teal: #0c5f57;
  --teal-soft: #e5f3f1;
  --stamp: #8d2e28;
  --chip: #efe4d4;
  --shadow: 0 18px 50px rgba(48, 32, 14, 0.06);
  --serif: "Iowan Old Style", Palatino, "Palatino Linotype", "Songti SC", "Noto Serif SC", "Source Han Serif SC", serif;
  --sans: "Avenir Next", "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --paper: #141210;
    --paper-2: #1d1a16;
    --ink: #f4ecdf;
    --muted: #c3b6a6;
    --line: #3a332c;
    --line-strong: #5a4e43;
    --teal: #8fd9cf;
    --teal-soft: #1c3330;
    --stamp: #f0a79f;
    --chip: #2a241e;
    --shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
  }
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(1200px 400px at 10% -10%, rgba(12, 95, 87, 0.08), transparent 50%),
    var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 17px;
  line-height: 1.65;
}
a { color: var(--teal); text-underline-offset: 0.16em; }
a:hover { color: var(--stamp); }
:focus-visible { outline: 2px solid var(--teal); outline-offset: 3px; }
.skip {
  position: absolute;
  left: 1rem;
  top: -4rem;
  background: var(--ink);
  color: var(--paper);
  padding: 0.4rem 0.7rem;
}
.skip:focus { top: 0.6rem; }
.wrap { width: min(860px, calc(100% - 2rem)); margin: 0 auto; }
header.mast {
  border-bottom: 1px solid var(--line);
  background: color-mix(in srgb, var(--paper) 88%, transparent);
}
.mast-inner { padding: 1.4rem 0 1.15rem; }
.kicker {
  margin: 0;
  font-size: 0.74rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--stamp);
  font-weight: 700;
}
.mast-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  margin-top: 0.2rem;
}
.logo {
  font-family: var(--serif);
  font-size: clamp(2.2rem, 5vw, 3.3rem);
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--ink);
  text-decoration: none;
}
.logo:hover { color: var(--teal); }
nav.site { display: flex; gap: 0.9rem; font-size: 0.95rem; }
nav.site a { color: var(--ink); text-decoration: none; border-bottom: 1px solid transparent; }
nav.site a:hover, nav.site a[aria-current="page"] { border-bottom-color: var(--stamp); color: var(--stamp); }
.deck { margin: 0.75rem 0 0; max-width: 46rem; color: var(--muted); }
main { flex: 1; padding: 1.4rem 0 3rem; }
.filters { display: grid; gap: 0.85rem; margin-bottom: 1.3rem; }
.tag-row, .meta-row { display: flex; gap: 0.45rem; overflow-x: auto; padding-bottom: 0.15rem; }
.tag, button, select {
  font: inherit;
  color: var(--ink);
  background: var(--chip);
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0.28rem 0.75rem;
  text-decoration: none;
  white-space: nowrap;
}
.tag.on, button { background: var(--teal); color: #f7fffd; }
@media (prefers-color-scheme: dark) {
  .tag.on, button { color: #10211f; }
}
button { cursor: pointer; border-radius: 999px; }
select { border-radius: 999px; background: var(--paper-2); border-color: var(--line); }
form.search { display: flex; gap: 0.5rem; margin: 0.85rem 0 0; }
form.search label {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
form.search input[type="search"] {
  flex: 1;
  min-width: 0;
  font: inherit;
  color: var(--ink);
  background: var(--paper-2);
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  padding: 0.55rem 0.95rem;
}
mark { background: #f3df9a; color: inherit; padding: 0 0.12em; border-radius: 0.15em; }
@media (prefers-color-scheme: dark) {
  mark { background: #6a5420; }
}
.source-form { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
.source-form label { color: var(--muted); font-size: 0.92rem; }
.count { color: var(--muted); font-size: 0.92rem; margin: 0; }
.classic { margin: 0 0 2rem; }
.classic h2, .daily-heading {
  font-family: var(--serif);
  font-size: 1.45rem;
  margin: 0 0 0.4rem;
}
.day { margin: 0 0 1.6rem; }
.day h2 {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: baseline;
  margin: 0 0 0.7rem;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid var(--line);
  font-family: var(--serif);
  font-size: 1.25rem;
  font-weight: 600;
}
.day h2 span { color: var(--muted); font-family: var(--sans); font-size: 0.85rem; font-weight: 500; }
.item {
  display: grid;
  grid-template-columns: 2.4rem 1fr;
  gap: 0.7rem;
  padding: 0.95rem 0;
  border-bottom: 1px solid var(--line);
}
.index {
  font-family: var(--serif);
  color: var(--teal);
  font-size: 1.15rem;
  padding-top: 0.15rem;
}
.item h3 { margin: 0; font-family: var(--serif); font-size: 1.35rem; line-height: 1.3; font-weight: 600; }
.item h3 a { color: var(--ink); text-decoration: none; }
.item h3 a:hover { color: var(--teal); }
.excerpt { margin: 0.4rem 0 0.55rem; color: var(--muted); }
.attr {
  margin: 0.35rem 0;
  padding: 0.55rem 0.75rem;
  background: var(--paper-2);
  border-left: 3px solid var(--teal);
  box-shadow: var(--shadow);
}
.attr strong { font-weight: 650; }
.badges { display: flex; flex-wrap: wrap; gap: 0.35rem; margin: 0.45rem 0 0; padding: 0; list-style: none; }
.badges a, .lang {
  font-size: 0.78rem;
  text-decoration: none;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  padding: 0.05rem 0.5rem;
  color: var(--stamp);
}
.submeta { margin: 0.35rem 0 0; color: var(--muted); font-size: 0.88rem; }
.pager { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-top: 1.4rem; }
.pager a, .pager span { text-decoration: none; }
.empty, .note {
  background: var(--paper-2);
  border: 1px dashed var(--line-strong);
  padding: 1rem 1.1rem;
}
article.post h1 {
  font-family: var(--serif);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  line-height: 1.2;
  letter-spacing: -0.03em;
  margin: 0.3rem 0 0.9rem;
}
.quote {
  margin: 1rem 0;
  padding: 0.2rem 0 0.2rem 1rem;
  border-left: 3px solid var(--stamp);
  font-family: var(--serif);
  font-size: 1.18rem;
  color: var(--ink);
}
.read {
  display: inline-block;
  margin-top: 0.4rem;
  background: var(--teal);
  color: #f7fffd;
  text-decoration: none;
  padding: 0.7rem 1.1rem;
  border-radius: 999px;
  font-weight: 700;
}
@media (prefers-color-scheme: dark) {
  .read { color: #10211f; }
}
.read:hover { background: var(--stamp); color: white; }
.discuss { margin: 0.8rem 0 0; }
footer.site {
  border-top: 1px solid var(--line);
  padding: 1.2rem 0 2rem;
  color: var(--muted);
  font-size: 0.92rem;
}
footer.site p { margin: 0.3rem 0; }
.about h2 { font-family: var(--serif); font-size: 1.4rem; margin: 1.6rem 0 0.4rem; }
.about ul { padding-left: 1.2rem; }
.about li { margin: 0.35rem 0; }
code { font-size: 0.92em; }
.ai-mark {
  display: inline-block;
  margin-right: 0.35rem;
  padding: 0.02rem 0.4rem;
  border-radius: 999px;
  background: var(--teal-soft);
  color: var(--teal);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.ai-summary {
  margin: 0.9rem 0 1.1rem;
  padding: 0.85rem 1rem;
  background: var(--teal-soft);
  border-left: 3px solid var(--teal);
}
.ai-summary strong { display: block; margin-bottom: 0.25rem; font-size: 0.82rem; letter-spacing: 0.08em; }
.reprint {
  margin: 0.9rem 0;
  padding: 0.75rem 0.9rem;
  background: var(--paper-2);
  border-left: 3px solid var(--teal);
}
.reprint p { margin: 0.2rem 0; }
.reprint span { display: inline-block; min-width: 4.5rem; color: var(--muted); }
.reprint .notice { margin-top: 0.55rem; color: var(--stamp); }
.article-body { font-family: var(--serif); font-size: 1.08rem; }
.article-body p { margin: 0.9rem 0; }
.article-body h2, .article-body h3, .article-body h4 { font-family: var(--serif); line-height: 1.3; }
.article-body img { max-width: 100%; height: auto; }
.article-body pre { overflow: auto; padding: 0.8rem 1rem; background: var(--paper-2); }
.article-body blockquote { margin: 1rem 0; padding-left: 0.9rem; border-left: 3px solid var(--stamp); }
.article-body table { width: 100%; border-collapse: collapse; }
.article-body th, .article-body td { border: 1px solid var(--line); padding: 0.35rem 0.5rem; vertical-align: top; }
.origin { font-size: 0.92em; }
@media (max-width: 640px) {
  body { font-size: 16px; }
  .mast-row { flex-direction: column; align-items: flex-start; }
  .item { grid-template-columns: 1.8rem 1fr; }
  .item h3 { font-size: 1.18rem; }
}
`.trim();
