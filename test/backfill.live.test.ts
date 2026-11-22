import { describe, expect, it } from "vitest";
import { runBackfill } from "../src/backfill";
import type { Env } from "../src/types";
import { createTestDb } from "./fake-d1";

describe("live backfill", () => {
  it("imports scored classics and reports them by topic", async () => {
    const env = { DB: createTestDb(), ADMIN_TOKEN: "test-token" } as Env;
    const report = await runBackfill(env);
    console.log(JSON.stringify({ inserted: report.inserted, byTopic: report.byTopic, seeds: report.seeds, feeds: report.feeds }));
    expect(report.ok).toBe(true);
    expect(report.inserted).toBeGreaterThan(0);
    const rows = await env.DB.prepare(
      "SELECT topic, COUNT(*) AS n FROM items WHERE section = 'classic' GROUP BY topic",
    ).all<{ topic: string; n: number }>();
    console.log("STORED", rows.results);
  }, 120_000);
});