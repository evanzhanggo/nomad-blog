import { describe, expect, it } from "vitest";
import { purgeItems } from "../src/collect";
import { createTestDb } from "./fake-d1";

async function insert(db: D1Database, url: string, title: string, excerpt = "") {
  await db
    .prepare(
      `INSERT INTO items (
        canonical_url, title, excerpt, source_id, source_name, collected_at,
        popularity, popularity_label, tags, language
      ) VALUES (?, ?, ?, 'x', 'X', '2026-11-22T00:00:00.000Z', 0, '', '', 'zh')`,
    )
    .bind(url, title, excerpt)
    .run();
}

describe("purgeItems", () => {
  it("removes English titles and low-quality Chinese posts, and keeps a real guide", async () => {
    const db = createTestDb();
    const guide = "这是一份手把手申请说明，包含材料、顺序和费用。".repeat(6);
    await insert(db, "https://example.com/en", "How I got a digital nomad visa");
    await insert(db, "https://example.com/job", "远程岗位招聘，诚邀内推");
    await insert(db, "https://example.com/itin", "ITIN 美国税号申请教程", guide);

    const result = await purgeItems(db, "all");
    expect(result.deletedLanguage).toBe(1);
    expect(result.deletedQuality).toBe(1);
    const left = await db.prepare("SELECT title FROM items").all<{ title: string }>();
    expect(left.results?.map((row) => row.title)).toEqual(["ITIN 美国税号申请教程"]);
  });
});