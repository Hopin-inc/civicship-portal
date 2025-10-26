"use client";

import { detectEnvironment } from "@/lib/auth/core/environment-detector";

/**
 * 認証ログ用のユーティリティ関数
 * クライアント環境とサーバー環境の両方で動作するよう設計
 */

/**
 * フローIDを生成する（認証フロー追跡用）
 * @returns 一意のフローID
 */
export const generateFlowId = (): string => {
  return `flow_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * UIDの末尾6文字を取得（プライバシー保護）
 */
export const getUidSuffix = (uid: string | null | undefined): string | null => {
  if (!uid) return null;
  return uid.slice(-6);
};

/**
 * 電話番号をマスク（末尾4桁のみ表示）
 */
export const maskPhoneNumber = (phone: string | null | undefined): string | null => {
  if (!phone) return null;
  if (phone.length <= 4) return "****";
  return `****${phone.slice(-4)}`;
};

let serverUtils: any = null;

if (typeof window === "undefined") {
  try {
    serverUtils = require("../server/utils");
  } catch (e) {
    console.warn("Failed to load server logging utilities:", e);
  }
}

/**
 * 認証セッションIDを生成する（ブラウザ永続化対応）
 * ブラウザ環境では localStorage を使用してセッションIDを永続化
 * ログイン・ログアウトに関係なく同一ブラウザでは同じIDを使用
 * @returns 一意のセッションID
 */
export const generateSessionId = (): string => {
  if (typeof window === "undefined" && serverUtils) {
    return serverUtils.generateSessionId();
  }

  if (typeof window === "undefined") {
    return generateNewSessionId();
  }

  const SESSION_ID_KEY = "civicship_session_id";

  try {
    let sessionId = localStorage.getItem(SESSION_ID_KEY);

    if (!sessionId) {
      sessionId = generateNewSessionId();
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    }

    return sessionId;
  } catch (error) {
    return generateNewSessionId();
  }
};

/**
 * 新しいセッションIDを生成する内部関数
 * @returns 新しい一意のセッションID
 */
const generateNewSessionId = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `auth_${Date.now()}_${crypto.randomUUID().replace(/-/g, "").substring(0, 9)}`;
  } else if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return `auth_${Date.now()}_${array[0].toString(36)}`;
  } else {
    return `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};

/**
 * 認証ログのコンテキストを作成する
 * @param sessionId セッションID
 * @param authType 認証タイプ（"liff" または "phone"）
 * @param additionalContext 追加のコンテキスト情報
 * @returns ログコンテキスト
 */
export const createAuthLogContext = (
  sessionId: string,
  authType: "liff" | "phone" | "general",
  additionalContext?: Record<string, any>,
): Record<string, any> => {
  if (typeof window === "undefined" && serverUtils) {
    return serverUtils.createAuthLogContext(sessionId, authType, additionalContext);
  }

  const userId = additionalContext?.userId || (additionalContext?.user?.uid ?? undefined);
  const authEnvironment = detectEnvironment();

  const errorInfo = additionalContext?.error
    ? {
        error: {
          message:
            additionalContext.error instanceof Error
              ? additionalContext.error.message
              : String(additionalContext.error),
          code: additionalContext.errorCode || "unknown",
          stack:
            additionalContext.error instanceof Error ? additionalContext.error.stack : undefined,
        },
      }
    : {};

  return {
    sessionId,
    runtime: typeof window === "undefined" ? "server" : "client",
    timestamp: new Date().toISOString(),
    component: additionalContext?.component || "AuthProvider",
    authType,
    ...(userId ? { userId } : {}),
    authEnvironment,
    ...errorInfo,
    ...additionalContext,
  };
};

/**
 * フロー追跡用のログヘルパークラス
 * flowIdを自動的に付与してログを出力
 */
export class AuthFlowLogger {
  private flowId: string;
  private startTime: number;
  private sessionId: string;
  private authType: "liff" | "phone" | "general";
  private logger: any;

  constructor(flowId?: string, authType: "liff" | "phone" | "general" = "general") {
    this.flowId = flowId || generateFlowId();
    this.startTime = Date.now();
    this.sessionId = generateSessionId();
    this.authType = authType;
    
    if (typeof window !== "undefined") {
      (window as any).__currentAuthFlowId = this.flowId;
      
      import("@/lib/logging").then(mod => {
        this.logger = mod.logger;
      });
    }
  }

  getFlowId(): string {
    return this.flowId;
  }

  private createContext(additionalMeta?: Record<string, any>) {
    return createAuthLogContext(this.sessionId, this.authType, {
      flowId: this.flowId,
      elapsed: Date.now() - this.startTime,
      ...additionalMeta,
    });
  }

  info(message: string, meta?: Record<string, any>) {
    const context = this.createContext(meta);
    if (this.logger) {
      this.logger.info(`[AUTH] ${message}`, context);
    }
  }

  warn(message: string, meta?: Record<string, any>) {
    const context = this.createContext(meta);
    if (this.logger) {
      this.logger.warn(`[AUTH] ${message}`, context);
    }
  }

  error(message: string, meta?: Record<string, any>) {
    const context = this.createContext(meta);
    if (this.logger) {
      this.logger.error(`[AUTH] ${message}`, context);
    }
  }

  debug(message: string, meta?: Record<string, any>) {
    const context = this.createContext(meta);
    if (this.logger) {
      this.logger.debug(`[AUTH] ${message}`, context);
    }
  }
};
