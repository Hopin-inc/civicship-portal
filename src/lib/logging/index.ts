import clientLogger from "@/lib/logging/client";
import { ILogger } from "@/lib/logging/type";

const noopLogger: ILogger = {
  info: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {},
};

const isLocalEnv = process.env.ENV === "LOCAL";
const isStorybookEnv = process.env.ENV === "STORYBOOK";

let logger: ILogger;

if (isLocalEnv || isStorybookEnv) {
  logger = noopLogger;
} else if (typeof window === "undefined") {
  logger = require("./server").default;
} else {
  logger = clientLogger;
}

export { logger };
