"use client";

import { initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { logger } from "@/lib/logging";
import { detectEnvironment, AuthEnvironment } from "./environment-detector";

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
};
const firebaseConfigWithAppId = {
  ...firebaseConfig,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const defaultApp = initializeApp(firebaseConfigWithAppId);

export const lineApp = initializeApp(firebaseConfig, "line-auth-app");
export const lineAuth: Auth = getAuth(lineApp);
lineAuth.tenantId = process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID ?? null;

export const phoneApp = initializeApp(firebaseConfig, "phone-auth-app");
export const phoneAuth: Auth = getAuth(phoneApp);
phoneAuth.tenantId = null;

let analyticsInstance: Analytics | undefined;

/**
 * IndexedDBの利用可能性をテストする
 * @returns IndexedDBが利用可能な場合はtrue
 */
export const isIndexedDBAvailable = (): boolean => {
  try {
    if (typeof window === "undefined" || !window.indexedDB) {
      return false;
    }
    
    const testDB = window.indexedDB.open("__test__", 1);
    testDB.onerror = () => false;
    testDB.onsuccess = () => {
      testDB.result.close();
      window.indexedDB.deleteDatabase("__test__");
    };
    
    return true;
  } catch (error) {
    logger.debug("IndexedDB availability test failed", {
      error: error instanceof Error ? error.message : String(error),
      component: "FirebaseConfig"
    });
    return false;
  }
};

export const getFirebaseAnalytics = async (): Promise<Analytics | undefined> => {
  const isBrowser = typeof window !== "undefined";
  if (!isBrowser || process.env.NODE_ENV !== "production") return;

  const environment = detectEnvironment();
  const isLiffEnvironment = environment === AuthEnvironment.LIFF;
  
  if (isLiffEnvironment && !isIndexedDBAvailable()) {
    logger.info("Analytics disabled in LIFF environment due to IndexedDB restrictions", { 
      component: "FirebaseConfig",
      environment 
    });
    return undefined;
  }

  if (!analyticsInstance) {
    try {
      const supported = await isSupported();
      if (supported) {
        analyticsInstance = getAnalytics(defaultApp);
        logger.info("Analytics initialized", { component: "FirebaseConfig", environment });
      }
    } catch (error) {
      logger.warn("Analytics initialization failed", {
        error: error instanceof Error ? error.message : String(error),
        component: "FirebaseConfig",
        environment
      });
      return undefined;
    }
  }

  return analyticsInstance;
};

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

    if (code === "auth/too-many-requests") {
      return {
        type: "rate-limit",
        message: "短時間に大量のリクエストが発生しました。しばらく待ってから再試行してください。",
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
