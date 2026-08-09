import postgres from "postgres";

declare global {
  var openshelfSql: ReturnType<typeof postgres> | undefined;
}

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;

  if (!globalThis.openshelfSql) {
    globalThis.openshelfSql = postgres(databaseUrl, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    });
  }

  return globalThis.openshelfSql;
}
