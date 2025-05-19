import { useState } from "react";
import { toast } from "sonner";
import signInWithLiffToken from "@/contexts/auth/liff/signInWithLiffToken";

// 認証状態を一元管理するタイプ
type AuthState = {
  isAuthenticating: boolean;
  isExplicitLogin: boolean;
  errorMessage: string | null;
};

const useLiffAuth = (liff: any, liffLogin: () => void | Promise<void>) => {
  // 認証状態を一元管理
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticating: false,
    isExplicitLogin: false,
    errorMessage: null,
  });

  // LIFFログイン処理
  const loginWithLiff = async (): Promise<void> => {
    if (!liff) return;

    try {
      setAuthState({ ...authState, isExplicitLogin: true }); // 明示的ログイン開始
      await liffLogin();
    } catch (error) {
      const message = getErrorMessage(error); // エラーメッセージ取得
      setAuthState({ ...authState, errorMessage: message, isExplicitLogin: false });
      toast.error(message);
    }
  };

  // LIFFトークン認証
  const handleAuthenticateWithLiffToken = async (accessToken: string): Promise<void> => {
    const failedTokenKey = `failed_liff_token:${accessToken}`;
    if (typeof window !== "undefined" && localStorage.getItem(failedTokenKey)) {
      console.log("Skipping authentication with previously failed token");
      return;
    }

    setAuthState({ ...authState, isAuthenticating: true }); // 認証開始

    try {
      const success = await signInWithLiffToken(accessToken);

      if (!success) {
        const message = "LINE認証に失敗しました";
        setAuthState({ ...authState, errorMessage: message });
        toast.error(message);
        localStorage.setItem(failedTokenKey, Date.now().toString());
      }
    } catch (error) {
      const message = getErrorMessage(error); // エラーメッセージ取得
      setAuthState({ ...authState, errorMessage: message });
      toast.error(message);
    } finally {
      setAuthState({ ...authState, isAuthenticating: false }); // 認証終了
    }
  };

  return {
    authState,
    loginWithLiff,
    handleAuthenticateWithLiffToken,
  };
};

// エラーメッセージの取得
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message.includes("network")) {
      return "ネットワーク接続に問題が発生しました。インターネット接続を確認してください。";
    } else if (error.message.includes("expired")) {
      return "セッションの有効期限が切れました。再度お試しください。";
    } else if (error.message.includes("access denied") || error.message.includes("cancelled")) {
      return "ログイン処理がキャンセルされました。";
    }
    return "予期しないエラーが発生しました";
  }
  return "予期しないエラーが発生しました";
};

export default useLiffAuth;
