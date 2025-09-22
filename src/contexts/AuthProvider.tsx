"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { LiffService } from "@/lib/auth/liff-service";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";
import { TokenManager } from "@/lib/auth/token-manager";
import { lineAuth } from "@/lib/auth/firebase-config";
import { detectEnvironment } from "@/lib/auth/environment-detector";
import { GqlCurrentPrefecture, useCurrentUserQuery, useUserSignUpMutation } from "@/types/graphql";
import { toast } from "sonner";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { AuthStateManager } from "@/lib/auth/auth-state-manager";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
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
import { AuthContextType, AuthState } from "@/types/auth";

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
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (!authStateManager) return;

    const initializeAuth = async () => {
      if (isInitializing) {
        console.log("🔄 AuthProvider: Initialization already in progress, skipping");
        return;
      }
      
      setIsInitializing(true);
      
      try {
        logger.debug("AuthProvider: Starting AuthStateManager initialization", {
          component: "AuthProvider",
          timestamp: new Date().toISOString(),
          isAuthInitialized,
          authInitError: !!authInitError,
        });
        
        await authStateManager.initialize();
        setIsAuthInitialized(true);
        setAuthInitError(null);
        const currentState = authStateManager.getState();
        setState((prev) => ({ ...prev, authenticationState: currentState }));
        
        logger.debug("AuthProvider: AuthStateManager initialization completed", {
          component: "AuthProvider",
          timestamp: new Date().toISOString(),
          authState: currentState,
        });
      } catch (error) {
        logger.error("AuthProvider: AuthStateManager initialization failed", {
          component: "AuthProvider",
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
        });
        setAuthInitError(error instanceof Error ? error.message : "認証の初期化に失敗しました");
        setIsAuthInitialized(false);
      } finally {
        setIsInitializing(false);
      }
    };

    if (!isAuthInitialized && !authInitError && !isInitializing) {
      initializeAuth();
    }
  }, [authStateManager, isAuthInitialized, authInitError]);

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
      const isEnvironmentConstraint =
        errorMessage.includes("LIFF") ||
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
    } finally {
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
      const isValidationError =
        errorMessage.includes("validation") ||
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
    authReady: isAuthInitialized && !authInitError && !isInitializing && state.authenticationState !== "initializing" && state.authenticationState !== "verifying" && state.authenticationState !== "network_error" && state.authenticationState !== "loading" && !userLoading && !state.isAuthenticating,
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
    loading: state.authenticationState === "loading" || state.authenticationState === "initializing" || state.authenticationState === "verifying" || state.authenticationState === "network_error" || userLoading || state.isAuthenticating,
  };

  if (!isAuthInitialized) {
    if (authInitError) {
      const refetchRef = {
        current: () => {
          setAuthInitError(null);
          setIsAuthInitialized(false);
        },
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
