"use client";

import { ILogger } from "@/lib/logging/type";
import { createAuthLogContext, generateSessionId } from "@/lib/logging/client/utils";

const cachedSessionId = generateSessionId();

const forwardLogToServer = async (level: string, message: string, meta?: Record<string, any>) => {
  const { authType = "general", ...restMeta } = meta ?? {};
  const enrichedMeta = createAuthLogContext(cachedSessionId, authType, restMeta);

  try {
    await fetch("/api/client-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        level,
        message,
        meta: enrichedMeta,
      }),
    });
  } catch (e) {
    console.warn(
      `[CLIENT LOGGER] Failed to forward log to server: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
  }
};

const clientLogger: ILogger = {
  debug: (message, meta) => {
    void forwardLogToServer("debug", message, meta);
  },
  info: (message, meta) => {
    void forwardLogToServer("info", message, meta);
  },
  warn: (message, meta) => {
    void forwardLogToServer("warn", message, meta);
  },
  error: (message, meta) => {
    void forwardLogToServer("error", message, meta);
  },
};

export default clientLogger;
