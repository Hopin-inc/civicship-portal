"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "firebase/auth";
import { LiffService } from "@/lib/auth/liff-service";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { TokenManager } from "@/lib/auth/token-manager";
import { lineAuth } from "@/lib/auth/firebase-config";
import { AuthEnvironment, detectEnvironment } from "@/lib/auth/environment-detector";
import { GqlCurrentPrefecture, GqlCurrentUserPayload, GqlCurrentUserQuery } from "@/types/graphql";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";
import { USER_SIGN_UP } from "@/graphql/account/identity/mutation";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";

/**
 * 認証状態の型定義
 */
export type AuthState = {
  firebaseUser: User | null;
  currentUser: GqlCurrentUserPayload["user"] | null;
  lineAuthStatus: "authenticated" | "unauthenticated" | "loading";
  phoneAuthStatus: "verified" | "unverified" | "loading";
  environment: AuthEnvironment;
  isAuthenticating: boolean;
};

/**
 * 認証コンテキストの型定義
 */
interface AuthContextType {
  user: GqlCurrentUserPayload["user"] | null;
  firebaseUser: User | null;
  uid: string | null;
  isAuthenticated: boolean;
  isPhoneVerified: boolean;
  isAuthenticating: boolean;
  environment: AuthEnvironment;

  loginWithLiff: (redirectPath?: string) => Promise<boolean>;
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
    firebaseUser: null,
    currentUser: null,
    lineAuthStatus: "loading",
    phoneAuthStatus: "loading",
    environment,
    isAuthenticating: false,
  });

  const router = useRouter();

  const [userSignUp] = useMutation(USER_SIGN_UP);

  const { data: userData, loading: userLoading, refetch: refetchUser } = useQuery(GET_CURRENT_USER, {
    skip: state.lineAuthStatus !== "authenticated",
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const unsubscribe = lineAuth.onAuthStateChanged((user) => {
      setState((prev) => ({
        ...prev,
        firebaseUser: user,
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
    if (userData?.currentUser?.user) {
      setState((prev) => ({
        ...prev,
        currentUser: userData.currentUser.user,
      }));
    }
  }, [userData]);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🔍 AuthProvider initializeAuth - Starting initialization");
      console.log("🔍 Current state:", {
        environment,
        lineAuthStatus: state.lineAuthStatus,
        isAuthenticating: state.isAuthenticating
      });

      setState(prev => ({ ...prev, isAuthenticating: true }));

      if (environment === AuthEnvironment.LIFF || environment === AuthEnvironment.LINE_BROWSER) {
        console.log("🔍 Initializing LIFF in environment:", environment);
        const liffSuccess = await liffService.initialize();
        
        if (liffSuccess) {
          const liffState = liffService.getState();
          console.log("🔍 LIFF state after initialization:", {
            isInitialized: liffState.isInitialized,
            isLoggedIn: liffState.isLoggedIn,
            userId: liffState.profile.userId
          });
          
          if (typeof window !== "undefined") {
            const searchParams = new URLSearchParams(window.location.search);
            const hasLiffStateParam = searchParams.has("liff.state");
            console.log("🔍 URL has liff.state param:", hasLiffStateParam);
            
            if (hasLiffStateParam) {
              console.log("🔍 Detected return from LINE authentication");
            }
          }
          
          if (liffState.isLoggedIn && state.lineAuthStatus === "unauthenticated") {
            console.log("🔍 LIFF is logged in but Firebase auth is not complete, completing authentication");
            try {
              console.log("🔍 Calling signInWithLiffToken");
              const success = await liffService.signInWithLiffToken();
              console.log("🔍 signInWithLiffToken result:", success);
              
              if (success) {
                console.log("🔍 Refreshing user data");
                await refetchUser();
              }
            } catch (error) {
              console.error("Failed to complete LIFF authentication:", error);
            }
          }
          else if ((environment === AuthEnvironment.LIFF || liffState.isLoggedIn) &&
              state.lineAuthStatus === "unauthenticated" &&
              !state.isAuthenticating) {
            console.log("🔍 Auto-logging in via LIFF");
            await loginWithLiff(typeof window !== "undefined" ? window.location.pathname : "/");
          } else {
            console.log("🔍 No authentication action needed. Current state:", {
              liffLoggedIn: liffState.isLoggedIn,
              lineAuthStatus: state.lineAuthStatus,
              isAuthenticating: state.isAuthenticating
            });
          }
        } else {
          console.error("LIFF initialization failed");
        }
      }

      setState(prev => ({ ...prev, isAuthenticating: false }));
      console.log("🔍 AuthProvider initializeAuth - Completed");
    };

    initializeAuth();
  }, [environment, state.isAuthenticating, state.lineAuthStatus]);

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
   * @param redirectPath リダイレクト先のパス（オプション）
   * @returns ログインが成功したかどうか
   */
  const loginWithLiff = async (redirectPath?: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isAuthenticating: true }));

    try {
      const initialized = await liffService.initialize();
      if (!initialized) {
        throw new Error("Failed to initialize LIFF");
      }

      const loggedIn = await liffService.login(redirectPath);
      if (!loggedIn) {
        return false; // リダイレクトするのでここには到達しない
      }

      const success = await liffService.signInWithLiffToken();

      if (success) {
        await refetchUser();
      }

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
        firebaseUser: null,
        currentUser: null,
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
      if (!state.firebaseUser) {
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
            lineTokenExpiresAt: lineTokens.expiresAt ? new Date(lineTokens.expiresAt).toISOString() : undefined,
            phoneAccessToken: phoneTokens.accessToken,
            phoneRefreshToken: phoneTokens.refreshToken,
            phoneTokenExpiresAt: phoneTokens.expiresAt ? new Date(phoneTokens.expiresAt).toISOString() : undefined,
          },
        },
      });

      if (data?.userSignUp?.user) {
        await refetchUser();
        toast.success("アカウントを作成しました");
        return state.firebaseUser;
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
    user: state.currentUser,
    firebaseUser: state.firebaseUser,
    uid: state.firebaseUser?.uid || null,
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
    loading: state.lineAuthStatus === "loading" || state.phoneAuthStatus === "loading" || userLoading || state.isAuthenticating,
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
