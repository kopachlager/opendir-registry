import { readFile } from "node:fs/promises";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run migrations");
}

const sql = postgres(databaseUrl, { max: 1, prepare: false });
const migration = await readFile(
  new URL("../db/migrations/001_initial.sql", import.meta.url),
  "utf8",
);

try {
  await sql.unsafe(migration);
  console.log("Applied db/migrations/001_initial.sql");
} finally {
  await sql.end();
}
