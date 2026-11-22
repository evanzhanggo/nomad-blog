import { readFileSync, rmSync, writeFileSync } from "node:fs";

const source = readFileSync(new URL("../dist/index.js", import.meta.url), "utf8");
const bundled = source.replace(/\n\/\/# sourceMappingURL=.*\n?$/, "\n");
if (/^\s*import\s/m.test(bundled)) {
  throw new Error("dist/index.js still has import statements");
}
if (!bundled.includes("export {") && !bundled.includes("export default")) {
  throw new Error("dist/index.js is not an ES module");
}
writeFileSync(new URL("../dist/worker.js", import.meta.url), bundled);
rmSync(new URL("../dist/index.js", import.meta.url), { force: true });
rmSync(new URL("../dist/index.js.map", import.meta.url), { force: true });
rmSync(new URL("../dist/README.md", import.meta.url), { force: true });
console.log(`dist/worker.js ${bundled.length} bytes`);
