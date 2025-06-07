import clientLogger from "@/lib/logging/client";
import { ILogger } from "@/lib/logging/type";

let logger: ILogger;

if (typeof window === "undefined") {
  logger = require("./server").default;
} else {
  logger = clientLogger;
}

export { logger };
