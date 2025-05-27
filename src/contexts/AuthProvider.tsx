"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "firebase/auth";
import { LiffService } from "@/lib/auth/liff-service";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { TokenManager } from "@/lib/auth/token-manager";
import { lineAuth, phoneAuth } from "@/lib/auth/firebase-config";
import { AuthEnvironment, detectEnvironment } from "@/lib/auth/environment-detector";
import { GqlCurrentPrefecture } from "@/types/graphql";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { USER_SIGN_UP } from "@/graphql/account/identity/mutation";

/**
 * 認証状態の型定義
 */
export type AuthState = {
  user: User | null;
  lineAuthStatus: "authenticated" | "unauthenticated" | "loading";
  phoneAuthStatus: "verified" | "unverified" | "loading";
  environment: AuthEnvironment;
  isAuthenticating: boolean;
};

/**
 * 認証コンテキストの型定義
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPhoneVerified: boolean;
  isAuthenticating: boolean;
  environment: AuthEnvironment;
  
  loginWithLiff: () => Promise<boolean>;
  logout: () => Promise<void>;
  
  phoneAuth: {
    startPhoneVerification: (phoneNumber: string) => Promise<string | null>;
    verifyPhoneCode: (verificationCode: string) => Promise<boolean>;
    isVerifying: boolean;
    phoneUid: string | null;
  };
  
  createUser: (name: string, prefecture: GqlCurrentPrefecture, phoneUid: string | null) => Promise<User | null>;
  
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 認証プロバイダーのプロパティ
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * 認証プロバイダーコンポーネント
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const environment = detectEnvironment();
  
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID || "";
  const liffService = LiffService.getInstance(liffId);
  
  const phoneAuthService = PhoneAuthService.getInstance();
  
  const [state, setState] = useState<AuthState>({
    user: null,
    lineAuthStatus: "loading",
    phoneAuthStatus: "loading",
    environment,
    isAuthenticating: false,
  });
  
  const router = useRouter();
  
  const [userSignUp] = useMutation(USER_SIGN_UP);
  
  useEffect(() => {
    const unsubscribe = lineAuth.onAuthStateChanged((user) => {
      setState((prev) => ({
        ...prev,
        user,
        lineAuthStatus: user ? "authenticated" : "unauthenticated",
      }));
    });
    
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const phoneState = phoneAuthService.getState();
    setState((prev) => ({
      ...prev,
      phoneAuthStatus: phoneState.isVerified ? "verified" : "unverified",
    }));
  }, []);
  
  useEffect(() => {
    const initializeLiff = async () => {
      if (environment === AuthEnvironment.LIFF || environment === AuthEnvironment.LINE_BROWSER) {
        await liffService.initialize();
      }
    };
    
    initializeLiff();
  }, [environment]);
  
  useEffect(() => {
    const handleTokenExpired = (event: CustomEvent) => {
      toast.error("認証の有効期限が切れました", {
        description: "再度ログインしてください",
      });
      logout();
    };
    
    window.addEventListener("auth:token-expired", handleTokenExpired as EventListener);
    
    return () => {
      window.removeEventListener("auth:token-expired", handleTokenExpired as EventListener);
    };
  }, []);
  
  /**
   * LIFFでログイン
   */
  const loginWithLiff = async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, isAuthenticating: true }));
    
    try {
      const initialized = await liffService.initialize();
      if (!initialized) {
        throw new Error("Failed to initialize LIFF");
      }
      
      const loggedIn = await liffService.login();
      if (!loggedIn) {
        return false; // リダイレクトするのでここには到達しない
      }
      
      const success = await liffService.signInWithLiffToken();
      return success;
    } catch (error) {
      console.error("Login with LIFF failed:", error);
      return false;
    } finally {
      setState((prev) => ({ ...prev, isAuthenticating: false }));
    }
  };
  
  /**
   * ログアウト
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      liffService.logout();
      
      await lineAuth.signOut();
      
      phoneAuthService.reset();
      
      TokenManager.clearAllTokens();
      
      setState((prev) => ({
        ...prev,
        user: null,
        lineAuthStatus: "unauthenticated",
        phoneAuthStatus: "unverified",
      }));
      
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [router]);
  
  /**
   * 電話番号認証を開始
   */
  const startPhoneVerification = async (phoneNumber: string): Promise<string | null> => {
    return phoneAuthService.startPhoneVerification(phoneNumber);
  };
  
  /**
   * 電話番号認証コードを検証
   */
  const verifyPhoneCode = async (verificationCode: string): Promise<boolean> => {
    const success = await phoneAuthService.verifyPhoneCode(verificationCode);
    
    if (success) {
      setState((prev) => ({
        ...prev,
        phoneAuthStatus: "verified",
      }));
    }
    
    return success;
  };
  
  /**
   * ユーザーを作成
   */
  const createUser = async (
    name: string,
    prefecture: GqlCurrentPrefecture,
    phoneUid: string | null,
  ): Promise<User | null> => {
    try {
      if (!state.user) {
        toast.error("LINE認証が完了していません");
        return null;
      }
      
      if (!phoneUid) {
        toast.error("電話番号認証が完了していません");
        return null;
      }
      
      const lineTokens = TokenManager.getLineTokens();
      
      const phoneTokens = TokenManager.getPhoneTokens();
      
      const { data } = await userSignUp({
        variables: {
          input: {
            name,
            prefecture,
            phoneUid,
            phoneNumber: phoneTokens.phoneNumber,
            lineAccessToken: lineTokens.accessToken,
            lineRefreshToken: lineTokens.refreshToken,
            lineTokenExpiresAt: lineTokens.expiresAt?.toISOString(),
            phoneAccessToken: phoneTokens.accessToken,
            phoneRefreshToken: phoneTokens.refreshToken,
            phoneTokenExpiresAt: phoneTokens.expiresAt?.toISOString(),
          },
        },
      });
      
      if (data?.userSignUp?.user) {
        toast.success("アカウントを作成しました");
        return state.user;
      } else {
        toast.error("アカウント作成に失敗しました");
        return null;
      }
    } catch (error) {
      console.error("User creation failed:", error);
      toast.error("アカウント作成に失敗しました", {
        description: error instanceof Error ? error.message : "不明なエラーが発生しました",
      });
      return null;
    }
  };
  
  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.lineAuthStatus === "authenticated",
    isPhoneVerified: state.phoneAuthStatus === "verified",
    isAuthenticating: state.isAuthenticating,
    environment: state.environment,
    loginWithLiff,
    logout,
    phoneAuth: {
      startPhoneVerification,
      verifyPhoneCode,
      isVerifying: phoneAuthService.getState().isVerifying,
      phoneUid: phoneAuthService.getState().phoneUid,
    },
    createUser,
    loading: state.lineAuthStatus === "loading" || state.phoneAuthStatus === "loading",
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * 認証コンテキストを使用するためのフック
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
