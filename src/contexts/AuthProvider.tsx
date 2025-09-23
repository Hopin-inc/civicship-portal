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
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from '@/components/shared'
import { useAuthStateChangeListener } from "@/hooks/auth/useAuthStateChangeListener";
import { useTokenExpirationHandler } from "@/hooks/auth/useTokenExpirationHandler";
import { useFirebaseAuthState } from "@/hooks/auth/useFirebaseAuthState";
import { usePhoneAuthState } from "@/hooks/auth/usePhoneAuthState";
import { useUserRegistrationState } from "@/hooks/auth/useUserRegistrationState";
import { useLiffInitialization } from "@/hooks/auth/useLiffInitialization";
import { useLineAuthRedirectDetection } from "@/hooks/auth/useLineAuthRedirectDetection";
import { useLineAuthProcessing } from "@/hooks/auth/useLineAuthProcessing";
import { logger } from "@/lib/logging";
import { maskPhoneNumber } from "@/lib/logging/client/utils";
import useAutoLogin from "@/hooks/auth/useAutoLogin";
import { RawURIComponent } from "@/utils/path";

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
  isUserRegistered: boolean;
  authenticationState: AuthState["authenticationState"];
  isAuthenticating: boolean;
  environment: AuthEnvironment;
  authInitComplete: boolean;

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
    authenticationState: "loading",
    environment,
    isAuthenticating: false,
  });

  const [userSignUp] = useUserSignUpMutation();

  const {
    data: userData,
    loading: userLoading,
    refetch: refetchUser,
  } = useCurrentUserQuery({
    skip: !["line_authenticated", "phone_authenticated", "user_registered"].includes(
      state.authenticationState,
    ),
    fetchPolicy: "network-only",
  });

  const authStateManager = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    return AuthStateManager.getInstance();
  }, []);

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
        authenticationState: "unauthenticated",
      }));
    } catch (error) {
      logger.warn("Logout process failed", {
        error: error instanceof Error ? error.message : String(error),
        component: "AuthProvider",
        errorCategory: "user_environment",
        retryable: true,
      });
    }
  }, [liffService, phoneAuthService]);

  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [authInitError, setAuthInitError] = useState<string | null>(null);
  const [authInitComplete, setAuthInitComplete] = useState(false);
  const didInitRef = React.useRef(false);

  useEffect(() => {
    if (!authStateManager) return;
    if (didInitRef.current) return;
    didInitRef.current = true;

    const initializeAuth = async () => {
      try {
        await authStateManager.initialize();
        setIsAuthInitialized(true);
        setAuthInitError(null);
        const currentState = authStateManager.getState();
        setState((prev) => ({ ...prev, authenticationState: currentState }));
        queueMicrotask(() => setAuthInitComplete(true));
      } catch (error) {
        setAuthInitError(error instanceof Error ? error.message : "認証の初期化に失敗しました");
        setIsAuthInitialized(false);
        setAuthInitComplete(false);
      }
    };

    initializeAuth();
  }, [authStateManager]);

  useAuthStateChangeListener({ authStateManager, setState });
  useTokenExpirationHandler({ state, setState, logout });
  useFirebaseAuthState({ authStateManager, state, setState });
  usePhoneAuthState({ authStateManager, phoneAuthService, setState });
  useUserRegistrationState({ authStateManager, userData, setState });
  useLiffInitialization({ environment, liffService });
  const { shouldProcessRedirect } = useLineAuthRedirectDetection({ state, liffService });
  useLineAuthProcessing({ shouldProcessRedirect, liffService, setState, refetchUser });
  useAutoLogin({ environment, state, liffService, setState, refetchUser });

  /**
   * LIFFでログイン
   * @param redirectPath リダイレクト先のパス（オプション）
   * @returns ログインが成功したかどうか
   */
  const loginWithLiff = async (redirectPath?: RawURIComponent): Promise<boolean> => {
    setState((prev) => ({ ...prev, isAuthenticating: true }));

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
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isEnvironmentConstraint = errorMessage.includes("LIFF") ||
                                     errorMessage.includes("LINE") ||
                                     errorMessage.includes("Load failed");
      
      if (isEnvironmentConstraint) {
        logger.warn("LIFF environment limitation", {
          authType: "liff",
          error: errorMessage,
          component: "AuthProvider",
          errorCategory: "environment_constraint",
          expected: true,
        });
      } else {
        logger.info("LIFF login process failed", {
          authType: "liff",
          error: errorMessage,
          component: "AuthProvider",
          errorCategory: "auth_temporary",
        });
      }
      return false;
    }finally {
      setState((prev) => ({ ...prev, isAuthenticating: false }));
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

    if (success) {
      setState((prev) => ({
        ...prev,
        authenticationState: "phone_authenticated",
      }));

      if (authStateManager) {
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
          logger.warn("Failed to update AuthStateManager phone state in verifyPhoneCode", {
            error: error instanceof Error ? error.message : String(error),
            component: "AuthProvider",
            errorCategory: "state_management",
            retryable: true,
          });
        }
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
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isValidationError = errorMessage.includes("validation") ||
                               errorMessage.includes("invalid") ||
                               errorMessage.includes("required");
      
      if (isValidationError) {
        logger.info("User creation validation error", {
          error: errorMessage,
          component: "AuthProvider",
          errorCategory: "validation_error",
        });
      } else {
        logger.error("User creation system error", {
          error: errorMessage,
          component: "AuthProvider",
          errorCategory: "system_error",
        });
      }
      
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
      state.authenticationState,
    ),
    isPhoneVerified: ["phone_authenticated", "user_registered"].includes(state.authenticationState),
    isUserRegistered: state.authenticationState === "user_registered",
    authenticationState: state.authenticationState,
    isAuthenticating: state.isAuthenticating,
    environment: state.environment,
    authInitComplete,
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
    loading: state.authenticationState === "loading" || userLoading || state.isAuthenticating,
  };

  if (!isAuthInitialized) {
    if (authInitError) {
      const refetchRef = { 
        current: () => {
          setAuthInitError(null);
          setIsAuthInitialized(false);
        }
      };
      return <ErrorState title="認証の初期化に失敗しました" refetchRef={refetchRef} />;
    }
    
    return <LoadingIndicator fullScreen={true} />;
  }

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
