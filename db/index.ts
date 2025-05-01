import { logger } from "@/lib/logger";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __db: PostgresJsDatabase | undefined;
}

const connectionString = process.env.POSTGRES_URL ?? "";
const sql = postgres(connectionString, { max: 1 });

const db: PostgresJsDatabase = global.__db ?? drizzle(sql);
if (!global.__db) global.__db = db;

async function runMigrations() {
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    logger.debug("Database migrations applied successfully");
  } catch (error) {
    logger.error("Database migration failed:", error);
    throw error;
  }
}

export { db, runMigrations };
