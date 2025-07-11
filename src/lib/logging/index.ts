import clientLogger from "@/lib/logging/client";
import { ILogger } from "@/lib/logging/type";

const noopLogger: ILogger = {
  info: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {},
};

const isLocalEnv = process.env.ENV === "LOCAL";

let logger: ILogger;

if (isLocalEnv) {
  logger = noopLogger;
} else if (typeof window === "undefined") {
  logger = require("./server").default;
} else {
  logger = clientLogger;
}

export { logger };
