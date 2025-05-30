"use client";

import { ILogger } from "@/lib/logging/type";

const formatMeta = (meta?: Record<string, any>): string => {
  if (!meta) return "";
  try {
    return ` ${JSON.stringify(meta)}`;
  } catch (e) {
    return " [Meta formatting error]";
  }
};

/**
 * Forwards logs to the server via API when in browser environment
 */
const forwardLogToServer = async (level: string, message: string, meta?: Record<string, any>) => {
  try {
    await fetch("/api/client-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        level,
        message,
        meta: {
          ...meta,
          source: "client",
          timestamp: new Date().toISOString(),
        },
      }),
    });
  } catch (e) {
    console.warn(
      `[CLIENT LOGGER] Failed to forward log to server: ${e instanceof Error ? e.message : String(e)}`,
    );
  }
};

const clientLogger: ILogger = {
  debug: (message: string, meta?: Record<string, any>) => {
    console.debug(`[DEBUG] ${message}${formatMeta(meta)}`);
    forwardLogToServer("debug", message, meta);
  },
  info: (message: string, meta?: Record<string, any>) => {
    console.info(`[INFO] ${message}${formatMeta(meta)}`);
    forwardLogToServer("info", message, meta);
  },
  warn: (message: string, meta?: Record<string, any>) => {
    console.warn(`[WARN] ${message}${formatMeta(meta)}`);
    forwardLogToServer("warn", message, meta);
  },
  error: (message: string, meta?: Record<string, any>) => {
    console.error(`[ERROR] ${message}${formatMeta(meta)}`);
    forwardLogToServer("error", message, meta);
  },
};

export default clientLogger;
