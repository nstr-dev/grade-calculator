import pino, { Logger } from "pino";

export const logger: Logger = pino({
  name: "grade-calculator",
  level: process.env.LOG_LEVEL || "info",
  mixin(_context, level) {
    return { severity: logger.levels.labels[level] };
  },
});
