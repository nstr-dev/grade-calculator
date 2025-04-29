import { logger } from "@/lib/logger";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Fix for "sorry, too many clients already"
declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: PostgresJsDatabase | undefined;
}

let db: PostgresJsDatabase;

if (process.env.NODE_ENV === "production") {
  db = drizzle(postgres(process.env.POSTGRES_URL ?? "", { max: 1 }));
} else {
  if (!global.db) global.db = drizzle(postgres(process.env.POSTGRES_URL ?? ""));

  db = global.db;
}

async function after() {
  // await migrate(db, { migrationsFolder: "drizzle" });
  logger.debug("Skipping DB migrations");
}

after();

export { db };
