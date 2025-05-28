"use client";

import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import logger from "../logging";
import { createAuthLogContext } from "./logging-utils";

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const lineApp = initializeApp(firebaseConfig, "line-auth-app");
export const lineAuth: Auth = getAuth(lineApp);
lineAuth.tenantId = process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID ?? null;

export const phoneApp = initializeApp(firebaseConfig, "phone-auth-app");
export const phoneAuth: Auth = getAuth(phoneApp);
phoneAuth.tenantId = null;

let analytics: Analytics | undefined;

const isBrowser = typeof window !== "undefined";
const isAnalyticsEnabled = isBrowser && process.env.NODE_ENV === "production";

if (isAnalyticsEnabled) {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(lineApp);
        logger.info("Analytics initialized", createAuthLogContext(
          'analytics_session',
          "general",
          {
            operation: "initializeAnalytics",
            environment: process.env.NODE_ENV
          }
        ));
      } else {
        logger.warn("Analytics not supported in this browser", createAuthLogContext(
          'analytics_session',
          "general",
          {
            operation: "initializeAnalytics",
            supported: false
          }
        ));
      }
    })
    .catch((e) => {
      logger.error("Error initializing Analytics", createAuthLogContext(
        'analytics_session',
        "general",
        {
          operation: "initializeAnalytics",
          error: e instanceof Error ? e.message : String(e)
        }
      ));
    });
} else {
  logger.info("Analytics disabled", createAuthLogContext(
    'analytics_session',
    "general",
    {
      operation: "initializeAnalytics",
      environment: process.env.NODE_ENV
    }
  ));
}

export { analytics };

/**
 * Firebase認証エラーを分類する
 * @param error Firebaseから返されたエラー
 * @returns 分類されたエラー情報
 */
export const categorizeFirebaseError = (
  error: any,
): { type: string; message: string; retryable: boolean } => {
  if (error?.code) {
    const code = error.code as string;

    if (code === "auth/network-request-failed") {
      return {
        type: "network",
        message: "ネットワーク接続に問題が発生しました。インターネット接続を確認してください。",
        retryable: true,
      };
    }

    if (code === "auth/user-token-expired" || code === "auth/id-token-expired") {
      return {
        type: "expired",
        message: "認証の有効期限が切れました。再認証が必要です。",
        retryable: false,
      };
    }

    if (code === "auth/invalid-credential" || code === "auth/user-disabled") {
      return {
        type: "auth",
        message: "認証情報が無効です。再ログインしてください。",
        retryable: false,
      };
    }

    if (code === "auth/requires-recent-login") {
      return {
        type: "reauth",
        message: "セキュリティのため再認証が必要です。",
        retryable: false,
      };
    }

    if (code === "auth/invalid-verification-code") {
      return {
        type: "verification",
        message: "認証コードが無効です。正しいコードを入力してください。",
        retryable: false,
      };
    }

    if (code === "auth/code-expired") {
      return {
        type: "verification",
        message: "認証コードの有効期限が切れました。再度送信してください。",
        retryable: false,
      };
    }
  }

  if (error?.message?.includes("LIFF authentication failed")) {
    return {
      type: "api",
      message: "LINE認証サービスとの通信に失敗しました。",
      retryable: true,
    };
  }

  return {
    type: "unknown",
    message: "認証中に予期せぬエラーが発生しました。",
    retryable: false,
  };
};
