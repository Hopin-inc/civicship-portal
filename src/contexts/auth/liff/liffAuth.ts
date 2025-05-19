import retry from "retry";
import { LIFFLoginResponse } from "@/types/line";
import categorizeFirebaseError from "@/lib/firebase/const";

// リトライ操作の作成
export const createRetryOperation = (maxRetries: number = 3) => {
  return retry.operation({
    retries: maxRetries,
    factor: 2,
    minTimeout: 1000,
    maxTimeout: 10000,
    randomize: true,
  });
};

// LIFFログイン処理
export const authenticateLiff = async (
  accessToken: string,
  operation: retry.RetryOperation,
  currentAttempt: number,
  setAuthState: (state: any) => void, // 状態更新関数を追加
): Promise<LIFFLoginResponse> => {
  try {
    setAuthState({ isAuthenticating: true, errorMessage: null }); // 認証中に設定
    const response = await fetch(`${process.env.NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT}/line/liff-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken }),
    });

    if (!response.ok) {
      throw new Error(`LIFF authentication failed: ${response.status}`);
    }

    setAuthState({ isAuthenticating: false, errorMessage: null }); // 認証終了
    return await response.json();
  } catch (error) {
    setAuthState({ isAuthenticating: false, errorMessage: "認証に失敗しました" }); // エラーメッセージ設定
    throw error; // エラーを上に伝播させる
  }
};

// エラーハンドリングとリトライ処理
export const handleLiffLoginError = (
  error: unknown,
  currentAttempt: number,
  operation: retry.RetryOperation,
  setAuthState: (state: any) => void, // 状態更新関数を追加
) => {
  if (error instanceof Error) {
    const categorizedError = categorizeFirebaseError(error);
    console.error(`LIFF authentication error (attempt ${currentAttempt}):`, {
      type: categorizedError.type,
      message: categorizedError.message,
      error,
      retryable: categorizedError.retryable,
    });

    // リトライ可能な場合はリトライ
    if (!categorizedError.retryable || !operation.retry(error)) {
      setAuthState({ isAuthenticating: false, errorMessage: categorizedError.message }); // リトライ終了、エラー設定
      console.error("LIFF authentication failed after all retries");

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("auth:error", {
            detail: {
              source: "liff",
              errorType: categorizedError.type,
              errorMessage: categorizedError.message,
              originalError: error,
            },
          }),
        );
      }
      return false;
    }
  } else {
    setAuthState({ isAuthenticating: false, errorMessage: "予期しないエラーが発生しました" }); // エラーメッセージ設定
    console.error("Non-error object caught:", error);
    return false;
  }
  return true;
};
