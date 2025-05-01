export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { runMigrations } = require("@/db/index");
    runMigrations();
  }
}
