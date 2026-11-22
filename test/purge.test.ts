import { describe, expect, it } from "vitest";
import { purgeNonChinese } from "../src/collect";
import { createTestDb } from "./fake-d1";

describe("purgeNonChinese", () => {
  it("deletes English titles and keeps Chinese ones", async () => {
    const db = createTestDb();
    const insert = db.prepare(
      `INSERT INTO items (
        canonical_url, title, excerpt, source_id, source_name, collected_at, popularity, popularity_label, tags, language
      ) VALUES (?, ?, '', 'x', 'X', '2026-11-22T00:00:00.000Z', 0, '', '', 'en')`,
    );
    await insert.bind("https://example.com/en", "How I got a digital nomad visa").run();
    await insert.bind("https://example.com/zh", "越南签证办理").run();
    await insert
      .bind(
        "https://example.com/mix",
        "加拿大：Express Entry 新规生效：加拿大工作经验和高薪职业 offer 加分，offer 不再需要 LMIA",
      )
      .run();

    const result = await purgeNonChinese(db);
    expect(result.scanned).toBe(3);
    expect(result.deleted).toBe(1);

    const left = await db.prepare("SELECT title FROM items ORDER BY id").all<{ title: string }>();
    expect(left.results?.map((row) => row.title)).toEqual([
      "越南签证办理",
      "加拿大：Express Entry 新规生效：加拿大工作经验和高薪职业 offer 加分，offer 不再需要 LMIA",
    ]);
  });
});