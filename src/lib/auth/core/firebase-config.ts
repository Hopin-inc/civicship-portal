"use client";

import { getApps, initializeApp } from "firebase/app";
import { Auth, browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { logger } from "@/lib/logging";

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

export const setLineAuthTenantId = (tenantId: string | null) => {
  lineAuth.tenantId = tenantId;
};

// Use localStorage instead of IndexedDB for persistence
// IndexedDB can hang in LIFF WebView environments (WKWebView on iOS, WebView on Android)
// See: https://github.com/firebase/firebase-js-sdk/issues/6791
setPersistence(lineAuth, browserLocalPersistence).catch((error) => {
  logger.warn("Failed to set Firebase persistence to localStorage", {
    error: error instanceof Error ? error.message : String(error),
    component: "FirebaseConfig",
  });
});

export const getPhoneAuth = (): Auth => {
  const app =
    getApps().find((a) => a.name === "phone-auth-app") ??
    initializeApp(firebaseConfig, "phone-auth-app");
  const auth = getAuth(app);
  auth.tenantId = null;
  return auth;
};

let analyticsInstance: Analytics | undefined;

export const getFirebaseAnalytics = async (): Promise<Analytics | undefined> => {
  const isBrowser = typeof window !== "undefined";
  const isStaging = process.env.NEXT_PUBLIC_ENV === "staging" || process.env.ENV === "staging";
  const isProduction = process.env.NODE_ENV === "production" && !isStaging;
  if (!isBrowser || !isProduction) return;

  if (!analyticsInstance) {
    const supported = await isSupported();
    if (supported) {
      analyticsInstance = getAnalytics(defaultApp);
      logger.debug("Analytics initialized", { component: "FirebaseConfig" });
    }
  }

  return analyticsInstance;
};

const CODE_EXPIRED_ERROR = {
  type: "verification",
  message: "認証コードの有効期限が切れました。再度送信してください。",
  messageKey: "auth.codeExpired",
  retryable: true,
  logLevel: "warn" as const,
  errorCategory: "user_input",
};

/**
 * Firebase認証エラーを分類する
 * @param error Firebaseから返されたエラー
 * @returns 分類されたエラー情報
 */
export const categorizeFirebaseError = (
  error: any,
): {
  type: string;
  message: string;
  messageKey: string;
  retryable: boolean;
  logLevel: "error" | "warn" | "info";
  errorCategory: string;
} => {
  if (error?.code) {
    const code = error.code as string;

    if (code === "auth/network-request-failed") {
      return {
        type: "network",
        message: "ネットワーク接続に問題が発生しました。インターネット接続を確認してください。",
        messageKey: "auth.networkRequestFailed",
        retryable: true,
        logLevel: "warn",
        errorCategory: "network",
      };
    }

    if (code === "auth/user-token-expired" || code === "auth/id-token-expired") {
      return {
        type: "expired",
        message: "認証の有効期限が切れました。再認証が必要です。",
        messageKey: "auth.tokenExpired",
        retryable: false,
        logLevel: "info",
        errorCategory: "auth_temporary",
      };
    }

    if (code === "auth/invalid-credential" || code === "auth/user-disabled") {
      return {
        type: "auth",
        message: "認証情報が無効です。再ログインしてください。",
        messageKey: "auth.invalidCredential",
        retryable: false,
        logLevel: "warn",
        errorCategory: "auth_temporary",
      };
    }

    if (code === "auth/requires-recent-login") {
      return {
        type: "reauth",
        message: "セキュリティのため再認証が必要です。",
        messageKey: "auth.requiresRecentLogin",
        retryable: false,
        logLevel: "info",
        errorCategory: "auth_temporary",
      };
    }

    if (code === "auth/invalid-verification-code") {
      return {
        type: "verification",
        message: "認証コードが無効です。正しいコードを入力してください。",
        messageKey: "auth.invalidVerificationCode",
        retryable: true,
        logLevel: "info",
        errorCategory: "user_input",
      };
    }

    if (code === "auth/too-many-requests") {
      return {
        type: "rate-limit",
        message: "短時間に大量のリクエストが発生しました。しばらく待ってから再試行してください。",
        messageKey: "auth.tooManyRequests",
        retryable: false,
        logLevel: "warn",
        errorCategory: "network",
      };
    }

    if (code === "auth/code-expired") {
      return CODE_EXPIRED_ERROR;
    }

    if (code === "auth/operation-not-allowed") {
      return {
        type: "config",
        message: "この地域ではSMS送信が有効化されていません。",
        messageKey: "auth.operationNotAllowed",
        retryable: false,
        logLevel: "error",
        errorCategory: "config",
      };
    }

    if (code === "auth/quota-exceeded") {
      return {
        type: "quota",
        message: "APIクォータを超過しました。",
        messageKey: "auth.quotaExceeded",
        retryable: false,
        logLevel: "error",
        errorCategory: "system",
      };
    }

    if (code === "auth/app-not-authorized") {
      return {
        type: "config",
        message: "アプリケーションが承認されていません。",
        messageKey: "auth.appNotAuthorized",
        retryable: false,
        logLevel: "error",
        errorCategory: "config",
      };
    }

    if (code === "auth/app-not-verified") {
      return {
        type: "config",
        message: "アプリケーションが検証されていません。",
        messageKey: "auth.appNotVerified",
        retryable: false,
        logLevel: "error",
        errorCategory: "config",
      };
    }

    if (code === "auth/missing-verification-code") {
      return {
        type: "validation",
        message: "認証コードが入力されていません。",
        messageKey: "auth.missingVerificationCode",
        retryable: false,
        logLevel: "error",
        errorCategory: "system",
      };
    }

    if (code === "auth/internal-error") {
      return {
        type: "system",
        message: "Firebase内部エラーが発生しました。",
        messageKey: "auth.internalError",
        retryable: false,
        logLevel: "error",
        errorCategory: "system",
      };
    }

    if (code === "auth/missing-verification-id") {
      return {
        type: "system",
        message: "認証IDが見つかりません。",
        messageKey: "auth.missingVerificationId",
        retryable: false,
        logLevel: "error",
        errorCategory: "state_management",
      };
    }

    if (code === "auth/invalid-app-credential" || code === "auth/missing-app-credential") {
      return {
        type: "config",
        message: "アプリケーション認証情報が無効または欠落しています。",
        messageKey: "auth.invalidAppCredential",
        retryable: false,
        logLevel: "error",
        errorCategory: "config",
      };
    }

    if (code === "auth/too-many-attempts-try-later") {
      return {
        type: "rate-limit",
        message: "短時間に多数の認証試行があり一時的にブロックされています。",
        messageKey: "auth.tooManyAttempts",
        retryable: false,
        logLevel: "warn",
        errorCategory: "network",
      };
    }

    if (code === "auth/captcha-check-failed") {
      return {
        type: "verification",
        message: "本人確認（CAPTCHA）に失敗しました。再度お試しください。",
        messageKey: "auth.captchaFailed",
        retryable: true,
        logLevel: "warn",
        errorCategory: "environment_constraint",
      };
    }

    if (code === "auth/invalid-phone-number") {
      return {
        type: "validation",
        message: "電話番号の形式が正しくありません。",
        messageKey: "auth.invalidPhoneNumber",
        retryable: true,
        logLevel: "info",
        errorCategory: "user_input",
      };
    }

    if (code === "auth/missing-phone-number") {
      return {
        type: "validation",
        message: "電話番号が入力されていません。",
        messageKey: "auth.missingPhoneNumber",
        retryable: true,
        logLevel: "info",
        errorCategory: "user_input",
      };
    }
  }

  if (error?.message?.includes("SESSION_EXPIRED")) {
    return CODE_EXPIRED_ERROR;
  }

  if (error?.message?.includes("LIFF authentication failed")) {
    return {
      type: "api",
      message: "LINE認証サービスとの通信に失敗しました。",
      messageKey: "auth.liffAuthFailed",
      retryable: true,
      logLevel: "warn",
      errorCategory: "network",
    };
  }

  return {
    type: "unknown",
    message: "認証中に予期せぬエラーが発生しました。",
    messageKey: "auth.unknownError",
    retryable: false,
    logLevel: "error",
    errorCategory: "system",
  };
};

/**
 * Firebase エラーを適切なログレベルで記録する
 * @param error Firebaseから返されたエラー
 * @param context ログのコンテキスト（エラーメッセージ）
 * @param additionalMetadata 追加のメタデータ
 */
export const logFirebaseError = (
  error: any,
  context: string,
  additionalMetadata?: Record<string, any>,
) => {
  const categorized = categorizeFirebaseError(error);

  logger[categorized.logLevel](context, {
    error: error instanceof Error ? error.message : String(error),
    errorCode: error?.code,
    errorCategory: categorized.errorCategory,
    retryable: categorized.retryable,
    authType: "phone",
    ...additionalMetadata,
  });
};
