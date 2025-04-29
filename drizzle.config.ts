import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";

process.env.NODE_ENV === "development" &&
  dotenv.config({ path: ".env.development.local" });

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL ?? "postgres://admin:admin@localhost/grades",
  },
} satisfies Config;
