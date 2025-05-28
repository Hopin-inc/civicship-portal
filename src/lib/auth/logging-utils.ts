"use client";

/**
 * 認証ログ用のユーティリティ関数
 */

/**
 * 認証セッションIDを生成する
 * @returns 一意のセッションID
 */
export const generateSessionId = (): string => {
  return `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32ビット整数に変換
  }
  return `user_${Math.abs(hash).toString(36)}`;
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
  additionalContext?: Record<string, any>
): Record<string, any> => {
  return {
    sessionId,
    timestamp: new Date().toISOString(),
    component: "AuthProvider",
    authType,
    ...additionalContext
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
  backoffStep: number
): Record<string, any> => {
  return {
    retry: {
      count: retryCount,
      max: maxRetries,
      backoffStep,
      isLastAttempt: retryCount >= maxRetries
    }
  };
};
