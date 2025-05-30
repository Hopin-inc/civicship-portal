"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
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
import { COMMUNITY_ID } from "@/utils";

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

  loginWithLiff: (redirectPath?: string) => Promise<boolean>;
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
    const AuthStateManager = require("@/lib/auth/auth-state-manager").AuthStateManager;
    return AuthStateManager.getInstance();
  }, []);

  useEffect(() => {
    console.log("[Debug] authenticationState changed to:", state.authenticationState);
    const unsubscribe = lineAuth.onAuthStateChanged((user) => {
      setState((prev) => ({
        ...prev,
        firebaseUser: user,
        authenticationState: user
          ? prev.authenticationState === "loading"
            ? "line_authenticated"
            : prev.authenticationState
          : "unauthenticated",
      }));

      if (authStateManager && !state.isAuthenticating) {
        authStateManager.handleLineAuthStateChange(!!user);
      }
    });

    return () => unsubscribe();
  }, [authStateManager, state.isAuthenticating, state.authenticationState]);

  useEffect(() => {
    if (!authStateManager) return; // Guard against initialization error

    const phoneState = phoneAuthService.getState();
    const isVerified = phoneState.isVerified;

    if (isVerified) {
      const updatePhoneAuthState = async () => {
        try {
          const timestamp = new Date().toISOString();
          console.log(
            `🔍 [${timestamp}] Updating phone auth state in useEffect - isVerified:`,
            isVerified,
          );
          await authStateManager.handlePhoneAuthStateChange(true);
          console.log(
            `🔍 [${timestamp}] AuthStateManager phone state updated successfully in useEffect`,
          );
        } catch (error) {
          console.error("Failed to update AuthStateManager phone state in useEffect:", error);
        }
      };

      updatePhoneAuthState();
    }

    setState((prev) => ({
      ...prev,
      authenticationState: isVerified
        ? prev.authenticationState === "line_authenticated"
          ? "phone_authenticated"
          : prev.authenticationState
        : prev.authenticationState,
    }));
  }, [authStateManager, phoneAuthService]);

  useEffect(() => {
    if (userData?.currentUser?.user) {
      setState((prev) => ({
        ...prev,
        currentUser: userData.currentUser?.user,
        authenticationState: "user_registered",
      }));

      if (authStateManager) {
        const updateUserRegistrationState = async () => {
          try {
            const timestamp = new Date().toISOString();
            console.log(`🔍 [${timestamp}] Updating user registration state in useEffect`);
            await authStateManager.handleUserRegistrationStateChange(true);
            console.log(
              `🔍 [${timestamp}] AuthStateManager user registration state updated successfully`,
            );
          } catch (error) {
            console.error("Failed to update AuthStateManager user registration state:", error);
          }
        };

        updateUserRegistrationState();
      }
    }
  }, [userData, authStateManager]);

  useEffect(() => {
    const initializeLiff = async () => {
      if (environment !== AuthEnvironment.LIFF) return;

      const timestamp = new Date().toISOString();
      console.log(`🔍 [${timestamp}] Initializing LIFF in environment:`, environment);

      const liffSuccess = await liffService.initialize();
      if (liffSuccess) {
        const liffState = liffService.getState();
        console.log(`🔍 [${timestamp}] LIFF state after initialization:`, {
          isInitialized: liffState.isInitialized,
          isLoggedIn: liffState.isLoggedIn,
          userId: liffState.profile?.userId || "none",
        });
      } else {
        console.error(`🔍 [${timestamp}] LIFF initialization failed`);
      }
    };

    initializeLiff();
  }, [environment, liffService]);

  useEffect(() => {
    console.log("[Debug] 🔁 useEffect(handleLineAuthRedirect) fired");

    const handleLineAuthRedirect = async () => {
      if (typeof window === "undefined") return;

      if (state.isAuthenticating) {
        console.log("[Debug] Skipping: already authenticating");
        return;
      }

      if (
        state.authenticationState !== "unauthenticated" &&
        state.authenticationState !== "loading"
      ) {
        console.log("[Debug] Skipping: already authenticated or in progress");
        return;
      }

      const { isInitialized, isLoggedIn } = liffService.getState();

      if (isInitialized && !isLoggedIn) {
        console.log("[Debug] LIFF initialized but user not logged in - skipping redirect logic");
        return;
      }

      const timestamp = new Date().toISOString();
      console.log(`🔍 [${timestamp}] Detected LINE authentication redirect`);
      console.log(`🔍 [${timestamp}] Current state:`, {
        authenticationState: state.authenticationState,
        isAuthenticating: state.isAuthenticating,
        environment,
        windowHref: window.location.href,
      });

      setState((prev) => ({ ...prev, isAuthenticating: true }));

      try {
        const initialized = await liffService.initialize();
        if (!initialized) {
          console.error("LIFF init failed");
          return;
        }

        const { isLoggedIn, profile } = liffService.getState();
        console.log("LIFF State:", {
          isInitialized: true,
          isLoggedIn,
          userId: profile?.userId || "none",
        });

        if (!isLoggedIn) {
          console.log("User not logged in via LIFF");
          return;
        }

        const success = await liffService.signInWithLiffToken();
        if (!success) {
          console.error("signInWithLiffToken failed");
          return;
        }

        console.log("LINE auth successful. Refetching user...");
        await refetchUser();
      } catch (err) {
        console.error("Error during LINE auth:", err);
      } finally {
        setState((prev) => ({ ...prev, isAuthenticating: false }));
      }
    };

    handleLineAuthRedirect();
  }, [state.authenticationState, state.isAuthenticating, liffService, refetchUser, environment]);

  useEffect(() => {
    console.log("[Debug] 🔁 useEffect(handleAutoLogin) fired");

    const handleAutoLogin = async () => {
      if (environment !== AuthEnvironment.LIFF) return;
      if (state.authenticationState !== "unauthenticated") return;
      if (state.isAuthenticating) return;

      const liffState = liffService.getState();
      if (!liffState.isInitialized || !liffState.isLoggedIn) return;

      const timestamp = new Date().toISOString();
      console.log(`🔍 [${timestamp}] Auto-logging in via LIFF`);

      setState((prev) => ({ ...prev, isAuthenticating: true }));
      try {
        const success = await liffService.signInWithLiffToken();
        if (success) {
          await refetchUser();
        }
      } catch (error) {
        console.error("Auto-login with LIFF failed:", error);
      } finally {
        setState((prev) => ({ ...prev, isAuthenticating: false }));
      }
    };

    handleAutoLogin();
  }, [environment, state.authenticationState, state.isAuthenticating, liffService, refetchUser]);

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
      console.error("Logout failed:", error);
    }
  }, [liffService, phoneAuthService]);

  useEffect(() => {
    if (!authStateManager) return; // Guard against initialization error

    const initializeAuthState = async () => {
      console.log("🔍 Initializing AuthStateManager");
      await authStateManager.initialize();
    };

    initializeAuthState();

    const handleStateChange = (newState: AuthState["authenticationState"]) => {
      setState((prev) => ({ ...prev, authenticationState: newState }));
    };

    authStateManager.addStateChangeListener(handleStateChange);

    const handleTokenExpired = (event: Event) => {
      const customEvent = event as CustomEvent<{ source: string }>;
      const { source } = customEvent.detail;

      if (source === "graphql" || source === "network") {
        if (
          state.authenticationState === "line_authenticated" ||
          state.authenticationState === "user_registered"
        ) {
          setState((prev) => ({ ...prev, authenticationState: "line_token_expired" }));
          if (typeof window !== "undefined") {
            const event = new CustomEvent("auth:renew-line-token", { detail: {} });
            window.dispatchEvent(event);
          }
          return;
        }

        if (state.authenticationState === "phone_authenticated") {
          setState((prev) => ({ ...prev, authenticationState: "phone_token_expired" }));
          if (typeof window !== "undefined") {
            const event = new CustomEvent("auth:renew-phone-token", { detail: {} });
            window.dispatchEvent(event);
          }
          return;
        }

        toast.error("認証の有効期限が切れました", {
          description: "再度ログインしてください",
        });
        logout();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth:token-expired", handleTokenExpired);
    }

    return () => {
      authStateManager.removeStateChangeListener(handleStateChange);
      if (typeof window !== "undefined") {
        window.removeEventListener("auth:token-expired", handleTokenExpired);
      }
    };
  }, [state.authenticationState, logout, authStateManager]);

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
        console.error("Failed to initialize LIFF");
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

  // ====================================================================
  // ====================================================================
  // ====================================================================

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
          console.log(`🔍 [${timestamp}] Updating phone auth state in verifyPhoneCode`);
          await authStateManager.handlePhoneAuthStateChange(true);
          console.log(
            `🔍 [${timestamp}] AuthStateManager phone state updated successfully in verifyPhoneCode`,
          );
        } catch (error) {
          console.error("Failed to update AuthStateManager phone state in verifyPhoneCode:", error);
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

      console.log("Creating user with input:", {
        name,
        currentPrefecture: prefecture,
        communityId: COMMUNITY_ID,
        phoneUid,
        phoneNumber: phoneTokens.phoneNumber,
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
    isAuthenticated: ["line_authenticated", "phone_authenticated", "user_registered"].includes(
      state.authenticationState,
    ),
    isPhoneVerified: ["phone_authenticated", "user_registered"].includes(state.authenticationState),
    isUserRegistered: state.authenticationState === "user_registered",
    authenticationState: state.authenticationState,
    isAuthenticating: state.isAuthenticating,
    environment: state.environment,
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
    loading: state.authenticationState === "loading" || userLoading || state.isAuthenticating,
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
