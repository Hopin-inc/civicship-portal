import { signInWithFirebase } from "@/contexts/auth/liff/firebase";
import {
  authenticateLiff,
  createRetryOperation,
  handleLiffLoginError,
} from "@/contexts/auth/liff/liffAuth";

type AuthState = {
  isAuthenticating: boolean;
  retryCount: number;
  errorMessage: string | null;
};

const signInWithLiffToken = async (
  accessToken: string,
  setAuthState: (state: AuthState) => void, // 状態更新関数を渡す
): Promise<boolean> => {
  const operation = createRetryOperation();
  setAuthState({ isAuthenticating: true, retryCount: 0, errorMessage: null }); // 認証開始

  return new Promise((resolve, reject) => {
    operation.attempt(async (currentAttempt) => {
      try {
        console.log(`Attempting LIFF authentication (attempt ${currentAttempt})`);

        const { customToken, profile } = await authenticateLiff(
          accessToken,
          operation,
          currentAttempt,
        );

        await signInWithFirebase(customToken, {
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl,
        });

        // 認証成功
        setAuthState({ isAuthenticating: false, retryCount: currentAttempt, errorMessage: null });
        resolve(true);
      } catch (error) {
        if (!handleLiffLoginError(error, currentAttempt, operation, setAuthState)) {
          // エラー時
          setAuthState({
            isAuthenticating: false,
            retryCount: currentAttempt,
            errorMessage: "認証に失敗しました",
          });
          reject(false);
        }
      }
    });
  });
};

export default signInWithLiffToken;
