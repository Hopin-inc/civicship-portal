import { useState } from "react";
import { toast } from "sonner";
import signInWithLiffToken from "@/contexts/auth/liff/signIn";

/**
 * LIFF authentication hook for handling LINE login
 */
const useLiffAuth = (liff: any, liffLogin: () => void | Promise<void>) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isExplicitLogin, setIsExplicitLogin] = useState(false);

  /**
   * Login with LIFF
   */
  const loginWithLiff = async (): Promise<void> => {
    if (!liff) {
      return;
    }

    try {
      setIsExplicitLogin(true);
      await liffLogin();
    } catch (error) {
      console.error("LIFF login failed:", error);

      let errorMessage = "LINEログインに失敗しました";

      if (error instanceof Error) {
        if (error.message.includes("network")) {
          errorMessage =
            "ネットワーク接続に問題が発生しました。インターネット接続を確認してください。";
        } else if (error.message.includes("expired")) {
          errorMessage = "セッションの有効期限が切れました。再度お試しください。";
        } else if (error.message.includes("access denied") || error.message.includes("cancelled")) {
          errorMessage = "ログイン処理がキャンセルされました。";
        }
      }

      toast.error(errorMessage);
      setIsExplicitLogin(false);
    }
  };

  /**
   * Authenticate with LIFF token
   */
  const handleAuthenticateWithLiffToken = async (accessToken: string): Promise<boolean> => {
    setIsAuthenticating(true);

    try {
      return await signInWithLiffToken(accessToken);
    } catch (error) {
      console.error("Unexpected error during LIFF token authentication:", error);
      toast.error("予期せぬエラーが発生しました。もう一度お試しください。");
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  return {
    isAuthenticating,
    isExplicitLogin,
    loginWithLiff,
    handleAuthenticateWithLiffToken,
    setIsExplicitLogin,
  };
};

export default useLiffAuth;
