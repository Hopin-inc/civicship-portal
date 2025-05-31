"use client";

/**
 * 認証ログ用のユーティリティ関数
 * クライアント環境とサーバー環境の両方で動作するよう設計
 */

let serverUtils: any = null;

if (typeof window === "undefined") {
  try {
    serverUtils = require("./logging-utils-server");
  } catch (e) {
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

  const SESSION_ID_KEY = "civicship_auth_session_id";
  
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
 * 電話番号をマスクする（下4桁のみ表示）
 * @param phoneNumber マスクする電話番号
 * @returns マスクされた電話番号
 */
export const maskPhoneNumber = (phoneNumber: string | null | undefined): string => {
  if (!phoneNumber) return "none";
  if (phoneNumber.length <= 4) return "****";
  return "*".repeat(phoneNumber.length - 4) + phoneNumber.slice(-4);
};

/**
 * ユーザーIDをマスクする
 * @param userId マスクするユーザーID
 * @returns マスクされたユーザーID
 */
export const maskUserId = (userId: string | null | undefined): string => {
  if (!userId) return "none";
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32ビット整数に変換
  }
  return `user_${Math.abs(hash).toString(36)}`;
};

/**
 * デバイスとブラウザ情報を取得する
 * @returns デバイスとブラウザ情報
 */
export const getDeviceInfo = (): Record<string, any> => {
  if (typeof window === "undefined") {
    if (serverUtils) {
      return serverUtils.getDeviceInfo();
    }
    return { platform: "server" };
  }

  if (typeof navigator === "undefined") {
    return { platform: "unknown" };
  }

  const userAgent = navigator.userAgent || "";
  const isLINE = /Line/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  const isMobile = isIOS || isAndroid;

  const isChrome = /Chrome/i.test(userAgent) && !/Edg|Edge/i.test(userAgent);
  const isFirefox = /Firefox/i.test(userAgent);
  const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
  const isEdge = /Edg|Edge/i.test(userAgent);

  return {
    platform: isLINE ? "LINE" : "Web",
    device: {
      type: isMobile ? (isIOS ? "iOS" : "Android") : "Desktop",
      isMobile,
      isIOS,
      isAndroid,
      isLINE,
    },
    browser: {
      userAgent: userAgent.substring(0, 100), // 長すぎる場合は切り詰める
      isChrome,
      isFirefox,
      isSafari,
      isEdge,
      name: isChrome
        ? "Chrome"
        : isFirefox
          ? "Firefox"
          : isSafari
            ? "Safari"
            : isEdge
              ? "Edge"
              : "Other",
    },
    screen:
      typeof window !== "undefined"
        ? {
            width: window.innerWidth,
            height: window.innerHeight,
          }
        : undefined,
  };
};

/**
 * ネットワーク状態を取得する
 * @returns ネットワーク状態情報
 */
export const getNetworkInfo = (): Record<string, any> => {
  if (typeof window === "undefined") {
    if (serverUtils) {
      return serverUtils.getNetworkInfo();
    }
    return { online: true };
  }

  if (typeof navigator === "undefined") {
    return { online: true };
  }

  interface NetworkInformation {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  }

  const connection =
    "connection" in navigator ? ((navigator as any).connection as NetworkInformation) : null;

  return {
    online: navigator.onLine,
    connection: connection
      ? {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        }
      : undefined,
  };
};

/**
 * リクエストIDを生成する
 * @returns 一意のリクエストID
 */
export const generateRequestId = (): string => {
  if (typeof window === "undefined" && serverUtils) {
    return serverUtils.generateRequestId();
  }

  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `req_${crypto.randomUUID().replace(/-/g, "").substring(0, 12)}`;
  } else if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint32Array(2);
    crypto.getRandomValues(array);
    return `req_${array[0].toString(36)}${array[1].toString(36)}`;
  } else {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};

/**
 * 操作の開始時間を記録する
 * @param operationName 操作名
 * @returns 開始時間とoperationIdを含むオブジェクト
 */
export const startOperation = (
  operationName: string,
): {
  startTime: number;
  operationId: string;
  getContext: (additionalContext?: Record<string, any>) => Record<string, any>;
} => {
  if (typeof window === "undefined" && serverUtils) {
    return serverUtils.startOperation(operationName);
  }

  const startTime = Date.now();
  const operationId = generateRequestId();

  return {
    startTime,
    operationId,
    getContext: (additionalContext?: Record<string, any>) => ({
      operation: {
        name: operationName,
        id: operationId,
        startTime: new Date(startTime).toISOString(),
      },
      ...additionalContext,
    }),
  };
};

/**
 * 操作の所要時間を計算する
 * @param startTime 開始時間
 * @param operationId 操作ID
 * @param additionalContext 追加のコンテキスト情報
 * @returns 所要時間を含むコンテキスト
 */
export const endOperation = (
  startTime: number,
  operationId: string,
  additionalContext?: Record<string, any>,
): Record<string, any> => {
  if (typeof window === "undefined" && serverUtils) {
    return serverUtils.endOperation(startTime, operationId, additionalContext);
  }

  const endTime = Date.now();
  const duration = endTime - startTime;

  return {
    operation: {
      id: operationId,
      endTime: new Date(endTime).toISOString(),
      duration,
      status: additionalContext?.error ? "failed" : "success",
    },
    ...additionalContext,
  };
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

  const userId =
    additionalContext?.userId ||
    (additionalContext?.user?.uid ? maskUserId(additionalContext.user.uid) : undefined);

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

  const levelInfo = additionalContext?.level ? { level: additionalContext.level } : {};

  const deviceInfo =
    typeof window === "undefined" && serverUtils ? { platform: "server" } : getDeviceInfo();

  const networkInfo =
    typeof window === "undefined" && serverUtils ? { online: true } : getNetworkInfo();

  return {
    sessionId,
    timestamp: new Date().toISOString(),
    component: "AuthProvider",
    authType,
    ...(userId ? { userId } : {}),
    env: {
      ...deviceInfo,
      network: networkInfo,
    },
    ...levelInfo,
    ...errorInfo,
    ...additionalContext,
  };
};

/**
 * リトライ情報をログコンテキストに追加する
 * @param retryCount リトライ回数
 * @param maxRetries 最大リトライ回数
 * @param backoffStep バックオフステップ
 * @returns リトライ情報を含むコンテキスト
 */
export const createRetryLogContext = (
  retryCount: number,
  maxRetries: number,
  backoffStep: number,
): Record<string, any> => {
  if (typeof window === "undefined" && serverUtils) {
    return serverUtils.createRetryLogContext(retryCount, maxRetries, backoffStep);
  }

  return {
    retry: {
      count: retryCount,
      max: maxRetries,
      backoffStep,
      isLastAttempt: retryCount >= maxRetries,
    },
  };
};
