"use client";

import { ILogger } from "@/lib/logging/type";
import { createAuthLogContext, generateSessionId } from "@/lib/logging/client/utils";

const cachedSessionId = generateSessionId();

const logThrottle = new Map<string, number>();
const THROTTLE_DURATION = 5 * 60 * 1000;

const shouldThrottle = (message: string, level: string): boolean => {
  const key = `${level}:${message}`;
  const now = Date.now();
  const lastLogged = logThrottle.get(key);

  if (lastLogged && now - lastLogged < THROTTLE_DURATION) {
    return true;
  }

  logThrottle.set(key, now);
  return false;
};

const forwardLogToServer = async (level: string, message: string, meta?: Record<string, any>) => {
  // In production, only forward warn/error logs to server
  const { isProduction } = require("@/lib/environment");
  if (isProduction && (level === "debug" || level === "info")) {
    return;
  }

  const { authType = "general", ...restMeta } = meta ?? {};

  const isBrowserIssue =
    message.includes("IndexedDB") ||
    message.includes("Database server lost") ||
    message.includes("Connection to Indexed Database server lost") ||
    message.includes("storage");

  if (isBrowserIssue && shouldThrottle(message, level)) {
    return;
  }

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
      `[CLIENT LOGGER] Failed to forward log to server: ${e instanceof Error ? e.message : String(e)
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
