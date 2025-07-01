"use client";

import React, { createContext, useCallback, useContext, useState, useEffect } from "react";
import { User } from "firebase/auth";
import { LiffService } from "@/lib/auth/liff-service";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { TokenManager } from "@/lib/auth/token-manager";
import { lineAuth } from "@/lib/auth/firebase-config";
import { AuthEnvironment, detectEnvironment } from "@/lib/auth/environment-detector";
import {
  GqlCurrentPrefecture,
  GqlCurrentUserPayload,
  useCurrentUserQuery,
  useUserSignUpMutation,
} from "@/types/graphql";
import { toast } from "sonner";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import { AuthState as AuthStateManagerState } from "@/types/auth";
import { logger } from "@/lib/logging";
import { maskPhoneNumber } from "@/lib/logging/client/utils";
import { RawURIComponent } from "@/utils/path";

/**
 * 新しいAuthStateから表示用の認証状態文字列を取得
 */
function getDisplayAuthenticationState(authState: AuthStateManagerState): AuthState["authenticationState"] {
  if (authState.loading.isLoading) {
    return "loading";
  }
  
  if (authState.tokenStatus.lineTokenExpired && authState.authentication === "line_authenticated") {
    return "line_token_expired";
  }
  
  if (authState.tokenStatus.phoneTokenExpired && authState.authentication === "phone_authenticated") {
    return "phone_token_expired";
  }
  
  return authState.authentication as AuthState["authenticationState"];
}

/**
 * 認証状態の型定義
 */
export type AuthState = {
  firebaseUser: User | null;
  currentUser: GqlCurrentUserPayload["user"] | null;
  authenticationState:
    | "unauthenticated" // S0: 未認証
    | "line_authenticated" // S1: LINE認証済み
    | "line_token_expired" // S1e: LINEトークン期限切れ
    | "phone_authenticated" // S2: 電話番号認証済み
    | "phone_token_expired" // S2e: 電話番号トークン期限切れ
    | "user_registered" // S3: ユーザ情報登録済み
    | "loading"; // L0: 状態チェック中
  environment: AuthEnvironment;
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
  isUserRegistered: boolean;
  authenticationState: AuthState["authenticationState"];
  environment: AuthEnvironment;

  loginWithLiff: (redirectPath?: RawURIComponent) => Promise<boolean>;
  logout: () => Promise<void>;

  phoneAuth: {
    startPhoneVerification: (phoneNumber: string) => Promise<string | null>;
    verifyPhoneCode: (verificationCode: string) => Promise<boolean>;
    clearRecaptcha?: () => void;
    isVerifying: boolean;
    phoneUid: string | null;
  };

  createUser: (
    name: string,
    prefecture: GqlCurrentPrefecture,
    phoneUid: string | null,
  ) => Promise<User | null>;
  updateAuthState: () => Promise<void>;

  authLoading: boolean;
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

  const authStateManager = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    return AuthStateManager.getInstance();
  }, []);

  const [state, setState] = useState<AuthStateManagerState>(() => {
    if (authStateManager) {
      return authStateManager.getState();
    }
    return {
      authentication: "unauthenticated",
      tokenStatus: { lineTokenExpired: false, phoneTokenExpired: false },
      loading: { isLoading: true, phase: "initializing" },
      firebaseUser: null,
      currentUser: null,
      environment: environment === "liff" ? "liff" : "browser",
      error: null,
    };
  });

  const [userSignUp] = useUserSignUpMutation();

  const {
    data: userData,
    loading: userLoading,
    refetch: refetchUser,
  } = useCurrentUserQuery({
    skip: !["line_authenticated", "phone_authenticated", "user_registered"].includes(
      state.authentication,
    ),
    fetchPolicy: "network-only",
  });

  /**
   * ログアウト
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      liffService.logout();

      await lineAuth.signOut();

      phoneAuthService.reset();

      TokenManager.clearAllTokens();

      if (authStateManager) {
        authStateManager.reset();
      }
    } catch (error) {
      logger.error("Logout failed", {
        error: error instanceof Error ? error.message : String(error),
        component: "AuthProvider",
      });
    }
  }, [liffService, phoneAuthService]);

  useEffect(() => {
    if (!authStateManager) return;

    const handleStateChange = (newAuthState: AuthStateManagerState) => {
      setState(newAuthState);
    };

    const unsubscribe = authStateManager.subscribe(handleStateChange);
    
    authStateManager.initialize();

    return unsubscribe;
  }, [authStateManager]);

  useEffect(() => {
    if (userData?.currentUser?.user && authStateManager) {
      authStateManager.updateUserData(state.firebaseUser, userData.currentUser.user);
      authStateManager.handleUserRegistrationStateChange(true);
    }
  }, [userData, authStateManager, state.firebaseUser]);


  /**
   * LIFFでログイン
   * @param redirectPath リダイレクト先のパス（オプション）
   * @returns ログインが成功したかどうか
   */
  const loginWithLiff = async (redirectPath?: RawURIComponent): Promise<boolean> => {
    if (authStateManager) {
      authStateManager.setLoadingState(true, "checking_line");
    }

    try {
      await liffService.initialize();

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
      logger.info("Login with LIFF failed", {
        authType: "liff",
        error: error instanceof Error ? error.message : String(error),
        component: "AuthProvider",
      });
      return false;
    } finally {
      if (authStateManager) {
        authStateManager.setLoadingState(false, "idle");
      }
    }
  };

  /**
   * 電話番号認証を開始
   */
  const startPhoneVerification = async (phoneNumber: string): Promise<string | null> => {
    return await phoneAuthService.startPhoneVerification(phoneNumber);
  };

  /**
   * 電話番号認証コードを検証
   */
  const verifyPhoneCode = async (verificationCode: string): Promise<boolean> => {
    const success = await phoneAuthService.verifyPhoneCode(verificationCode);

    if (success && authStateManager) {
      try {
        const timestamp = new Date().toISOString();
        logger.debug("Updating phone auth state in verifyPhoneCode", {
          timestamp,
          component: "AuthProvider",
        });
        await authStateManager.handlePhoneAuthStateChange(true);
        logger.debug("AuthStateManager phone state updated successfully in verifyPhoneCode", {
          timestamp,
          component: "AuthProvider",
        });
      } catch (error) {
        logger.error("Failed to update AuthStateManager phone state in verifyPhoneCode", {
          error: error instanceof Error ? error.message : String(error),
          component: "AuthProvider",
        });
      }
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

      const phoneTokens = TokenManager.getPhoneTokens();
      const lineTokens = TokenManager.getLineTokens();

      logger.debug("Creating user with input", {
        name,
        currentPrefecture: prefecture,
        communityId: COMMUNITY_ID,
        phoneUid,
        phoneNumber: maskPhoneNumber(phoneTokens.phoneNumber || ""),
        component: "AuthProvider",
      });

      const { data } = await userSignUp({
        variables: {
          input: {
            name,
            currentPrefecture: prefecture, // Changed from prefecture to currentPrefecture to match backend schema
            communityId: COMMUNITY_ID,
            phoneUid,
            phoneNumber: phoneTokens.phoneNumber ?? undefined,
            lineRefreshToken: lineTokens.refreshToken ?? undefined,
            phoneRefreshToken: phoneTokens.refreshToken ?? undefined,
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
      logger.error("User creation failed", {
        error: error instanceof Error ? error.message : String(error),
        component: "AuthProvider",
      });
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
    isAuthenticated: ["line_authenticated", "phone_authenticated", "user_registered"].includes(
      state.authentication,
    ),
    isPhoneVerified: ["phone_authenticated", "user_registered"].includes(state.authentication),
    isUserRegistered: state.authentication === "user_registered",
    authenticationState: getDisplayAuthenticationState(state),
    environment: environment,
    loginWithLiff,
    logout,
    phoneAuth: {
      startPhoneVerification,
      verifyPhoneCode,
      clearRecaptcha: () => phoneAuthService.clearRecaptcha(),
      isVerifying: phoneAuthService.getState().isVerifying,
      phoneUid: phoneAuthService.getState().phoneUid,
    },
    createUser,
    updateAuthState: async () => {
      await refetchUser();
    },
    authLoading: state.loading.isLoading || userLoading,
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
