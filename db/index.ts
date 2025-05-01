import { logger } from "@/lib/logger";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

declare global {
  // avoids “too many clients” by re-using the same db handle in dev
  // eslint-disable-next-line no-var
  var __db: PostgresJsDatabase | undefined;
}

const connectionString = process.env.POSTGRES_URL ?? "";
if (!connectionString) {
  throw new Error("POSTGRES_URL is not defined");
}
// keep a single connection per instance; drizzle will multiplex internally
const sql = postgres(connectionString, { max: 1 });

const db: PostgresJsDatabase = global.__db ?? drizzle(sql);
if (!global.__db) global.__db = db;

async function runMigrations() {
  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    logger.debug("Database migrations applied successfully");
  } catch (error) {
    logger.error("Database migration failed:", error);
    // re-throw so the process exits or your hosting platform can restart it
    throw error;
  }
}

// trigger migrations immediately
(async () => {
  try {
    await runMigrations();
  } catch (error) {
    logger.error("Failed to run migrations during initialization:", error);
    process.exit(1); // Exit the process to signal failure
  }
})();

export { db };
