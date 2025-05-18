import retry from "retry";
import { LIFFLoginResponse } from "@/types/line";
import { signInWithCustomToken, updateProfile } from "@firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import categorizeFirebaseError from "@/lib/firebase/const";

// リトライ操作の作成
const createRetryOperation = () => {
  return retry.operation({
    retries: 3,
    factor: 2,
    minTimeout: 1000,
    maxTimeout: 10000,
    randomize: true,
  });
};

// LIFF認証のエラーを処理する
const handleLiffLoginError = (
  error: unknown,
  currentAttempt: number,
  operation: retry.RetryOperation,
) => {
  // 型ガードを使って error が Error 型か確認
  if (error instanceof Error) {
    const categorizedError = categorizeFirebaseError(error);
    console.error(`LIFF authentication error (attempt ${currentAttempt}):`, {
      type: categorizedError.type,
      message: categorizedError.message,
      error,
      retryable: categorizedError.retryable,
    });

    // リトライ可能な場合はリトライ、リトライ不可能な場合はエラーを発行
    if (!categorizedError.retryable || !operation.retry(error)) {
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
    console.error("Non-error object caught:", error);
    return false;
  }

  return true;
};

// LIFFログインAPIを呼び出して認証を行う
const authenticateLiff = async (
  accessToken: string,
  operation: retry.RetryOperation,
  currentAttempt: number,
): Promise<LIFFLoginResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT}/line/liff-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
  });

  if (!response.ok) {
    throw new Error(`LIFF authentication failed: ${response.status}`);
  }

  return await response.json();
};

// Firebaseのサインインとプロファイル更新を行う
const signInWithFirebase = async (
  customToken: string,
  profile: { displayName: string; pictureUrl?: string }, // pictureUrlは省略可能にする
) => {
  const { user } = await signInWithCustomToken(auth, customToken);

  // pictureUrlがundefinedの場合にデフォルト画像URLを設定
  const profilePictureUrl = profile.pictureUrl || "https://example.com/default-profile-pic.png"; // デフォルトURL

  await updateProfile(user, {
    displayName: profile.displayName,
    photoURL: profilePictureUrl,
  });

  console.log("LIFF authentication successful");
};

// LIFFトークンでサインインするメイン関数
const signInWithLiffToken = async (accessToken: string): Promise<boolean> => {
  const operation = createRetryOperation();

  return new Promise((resolve) => {
    operation.attempt(async (currentAttempt) => {
      try {
        console.log(`Attempting LIFF authentication (attempt ${currentAttempt})`);

        // LIFF認証を試行
        const { customToken, profile } = await authenticateLiff(
          accessToken,
          operation,
          currentAttempt,
        );

        // Firebaseサインインとプロファイル更新
        await signInWithFirebase(customToken, {
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl, // ここでpictureUrlをそのまま渡す
        });

        resolve(true);
      } catch (error) {
        // エラーハンドリングとリトライ処理
        if (!handleLiffLoginError(error, currentAttempt, operation)) {
          resolve(false);
        }
      }
    });
  });
};

export default signInWithLiffToken;
