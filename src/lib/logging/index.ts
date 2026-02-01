import clientLogger from "@/lib/logging/client";
import { ILogger } from "@/lib/logging/type";
import { isLocal, isStorybook } from "@/lib/environment";

const noopLogger: ILogger = {
  info: () => { },
  warn: () => { },
  error: () => { },
  debug: () => { },
};


let logger: ILogger;

if (isLocal || isStorybook) {
  logger = noopLogger;
} else if (typeof window === "undefined") {
  logger = require("./server").default;
} else {
  logger = clientLogger;
}

export { logger };
