import { useState } from "react";
import { toast } from "sonner";
import signInWithLiffToken from "./signIn";

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

      toast.error(errorMessage, {
        id: `liff-login-error-${errorMessage.substring(0, 10)}`
      });
      setIsExplicitLogin(false);
    }
  };

  /**
   * Authenticate with LIFF token
   */
  const handleAuthenticateWithLiffToken = async (accessToken: string): Promise<boolean> => {
    const failedTokenKey = `failed_liff_token:${accessToken}`;
    if (typeof window !== "undefined" && localStorage.getItem(failedTokenKey)) {
      console.log("Skipping authentication with previously failed token");
      return false;
    }
    
    setIsAuthenticating(true);

    try {
      const success = await signInWithLiffToken(accessToken);
      
      if (!success) {
        console.log("LIFF token authentication failed without throwing an error");
        if (typeof window !== "undefined") {
          localStorage.setItem(failedTokenKey, Date.now().toString());
        }
        
        toast.error("LINE認証に失敗しました。もう一度お試しください。", {
          action: {
            label: "再試行",
            onClick: () => window.location.reload()
          },
          duration: 10000,
          id: "liff-auth-failed" // Add unique ID to prevent duplicate toasts
        });
      }
      
      return success;
    } catch (error) {
      console.error("Unexpected error during LIFF token authentication:", error);
      
      let errorMessage = "認証中に予期せぬエラーが発生しました。もう一度お試しください。";
      let errorType = "unknown";
      
      if (error instanceof Error) {
        if (error.message.includes("network")) {
          errorMessage = "ネットワーク接続に問題が発生しました。インターネット接続を確認してください。";
          errorType = "network";
        } else if (error.message.includes("expired")) {
          errorMessage = "認証の有効期限が切れました。再度お試しください。";
          errorType = "expired";
        } else if (error.message.includes("auth") || error.message.includes("token")) {
          errorMessage = "認証に失敗しました。再度LINEログインを行ってください。";
          errorType = "auth";
        }
      }
      
      if (typeof window !== "undefined") {
        localStorage.setItem(failedTokenKey, Date.now().toString());
      }
      
      toast.error(errorMessage, {
        action: {
          label: "再試行",
          onClick: () => window.location.reload()
        },
        duration: 10000,
        id: `liff-auth-error-${errorType}` // Add unique ID to prevent duplicate toasts
      });
      
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("auth:error", {
            detail: {
              source: "liff",
              errorType,
              errorMessage,
              originalError: error,
            },
          }),
        );
      }
      
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
