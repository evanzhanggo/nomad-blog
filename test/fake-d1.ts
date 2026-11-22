import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

interface Bound {
  sql: string;
  args: unknown[];
  run: () => Promise<{ success: true; meta: { changes: number } }>;
  all: <T>() => Promise<{ results: T[] }>;
  first: <T>() => Promise<T | null>;
}

/**
 * Just enough of D1 for the collector and page queries, backed by Node's sqlite.
 * The worker itself never imports this.
 */
export function createTestDb(): D1Database {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync(new URL("../migrations/0001_init.sql", import.meta.url), "utf8"));

  const run = (sql: string, args: unknown[]) => {
    const info = db.prepare(sql).run(...args);
    return { success: true as const, meta: { changes: Number(info.changes ?? 0) } };
  };

  const prepare = (sql: string) => ({
    bind(...args: unknown[]): Bound {
      return {
        sql,
        args,
        async run() {
          return run(sql, args);
        },
        async all<T>() {
          return { results: db.prepare(sql).all(...args) as T[] };
        },
        async first<T>() {
          const row = db.prepare(sql).get(...args) as T | undefined;
          return row ?? null;
        },
      };
    },
  });

  return {
    prepare,
    async batch(statements: Bound[]) {
      db.exec("BEGIN");
      try {
        const results = statements.map((statement) => run(statement.sql, statement.args));
        db.exec("COMMIT");
        return results;
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
    },
  } as unknown as D1Database;
}
