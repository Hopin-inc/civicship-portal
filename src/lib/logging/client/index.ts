"use client";

import { ILogger } from "@/lib/logging/type";
import { createAuthLogContext, generateSessionId } from "@/lib/logging/client/utils";
import { detectEnvironment } from "@/lib/auth/environment-detector";

// キャッシュされたセッションID（初回にlocalStorageから取得）
const cachedSessionId = generateSessionId();

const forwardLogToServer = async (level: string, message: string, meta?: Record<string, any>) => {
  const enrichedMeta = createAuthLogContext(cachedSessionId, detectEnvironment(), meta);

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

const formatMeta = (meta?: Record<string, any>): string => {
  if (!meta) return "";
  try {
    return ` ${JSON.stringify(meta)}`;
  } catch (e) {
    return " [Meta formatting error]";
  }
};

const clientLogger: ILogger = {
  debug: (message, meta) => {
    console.debug(`[DEBUG] ${message}${formatMeta(meta)}`);
    forwardLogToServer("debug", message, meta);
  },
  info: (message, meta) => {
    console.info(`[INFO] ${message}${formatMeta(meta)}`);
    forwardLogToServer("info", message, meta);
  },
  warn: (message, meta) => {
    console.warn(`[WARN] ${message}${formatMeta(meta)}`);
    forwardLogToServer("warn", message, meta);
  },
  error: (message, meta) => {
    console.error(`[ERROR] ${message}${formatMeta(meta)}`);
    forwardLogToServer("error", message, meta);
  },
};

export default clientLogger;
