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
import { COMMUNITY_ID } from "@/utils";
import logger from "@/lib/logging";
import { generateSessionId, maskPhoneNumber, maskUserId, createAuthLogContext, createRetryLogContext } from "@/lib/auth/logging-utils";

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
  sessionId: string;
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
  sessionId: string;

  loginWithLiff: (redirectPath?: string, sessionId?: string) => Promise<boolean>;
  logout: (sessionId?: string) => Promise<void>;

  phoneAuth: {
    startPhoneVerification: (phoneNumber: string, sessionId?: string) => Promise<string | null>;
    verifyPhoneCode: (verificationCode: string, sessionId?: string) => Promise<boolean>;
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
    sessionId: generateSessionId(),
  });

  const router = useRouter();

  const [userSignUp] = useMutation(USER_SIGN_UP);

  const { data: userData, loading: userLoading, refetch: refetchUser } = useQuery(GET_CURRENT_USER, {
    skip: state.lineAuthStatus !== "authenticated",
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const unsubscribe = lineAuth.onAuthStateChanged((user) => {
      const prevAuthStatus = state.lineAuthStatus;
      const newAuthStatus = user ? "authenticated" : "unauthenticated";
      
      logger.info("Firebase auth state changed", createAuthLogContext(
        state.sessionId,
        "liff",
        {
          operation: "authStateChanged",
          prevState: prevAuthStatus,
          newState: newAuthStatus,
          userId: user ? maskUserId(user.uid) : "none",
          hasUser: !!user
        }
      ));
      
      setState((prev) => ({
        ...prev,
        firebaseUser: user,
        lineAuthStatus: newAuthStatus,
      }));
    });

    return () => unsubscribe();
  }, [state.sessionId, state.lineAuthStatus]);

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
      const timestamp = new Date().toISOString();
      logger.debug("AuthProvider initializeAuth - Starting initialization", createAuthLogContext(
        state.sessionId,
        "general",
        {
          operation: "initializeAuth",
          environment,
          lineAuthStatus: state.lineAuthStatus,
          isAuthenticating: state.isAuthenticating,
          windowLocation: typeof window !== "undefined" ? window.location.href : "SSR",
          timestamp
        }
      ));

      setState(prev => ({ ...prev, isAuthenticating: true }));

      if (environment === AuthEnvironment.LIFF) {
        logger.debug("Initializing LIFF", createAuthLogContext(
          state.sessionId,
          "liff",
          {
            operation: "initializeAuth",
            environment,
            timestamp
          }
        ));
        const liffSuccess = await liffService.initialize();

        if (liffSuccess) {
          const liffState = liffService.getState();
          logger.debug("LIFF state after initialization", createAuthLogContext(
            state.sessionId,
            "liff",
            {
              operation: "initializeAuth",
              isInitialized: liffState.isInitialized,
              isLoggedIn: liffState.isLoggedIn,
              userId: liffState.profile?.userId ? "exists" : "none",
              timestamp
            }
          ));

          let isRedirectFromLineAuth = false;
          if (typeof window !== "undefined") {
            const searchParams = new URLSearchParams(window.location.search);
            isRedirectFromLineAuth = searchParams.has("liff.state") || searchParams.has("code");
            logger.debug("LINE auth redirect check", createAuthLogContext(
              state.sessionId,
              "liff",
              {
                operation: "checkRedirect",
                isRedirectFromLineAuth,
                timestamp
              }
            ));
          }

          if (isRedirectFromLineAuth || (liffState.isLoggedIn && state.lineAuthStatus === "unauthenticated")) {
            logger.debug("Detected LINE authentication redirect or LIFF login without Firebase auth", createAuthLogContext(
              state.sessionId,
              "liff",
              {
                operation: "detectAuthRedirect",
                isRedirectFromLineAuth,
                liffLoggedIn: liffState.isLoggedIn,
                lineAuthStatus: state.lineAuthStatus,
                timestamp
              }
            ));
            try {
              logger.debug("Calling signInWithLiffToken to complete authentication", createAuthLogContext(
                state.sessionId,
                "liff",
                {
                  operation: "signInWithLiffToken",
                  timestamp
                }
              ));
              const success = await liffService.signInWithLiffToken();
              logger.debug("signInWithLiffToken completed", createAuthLogContext(
                state.sessionId,
                "liff",
                {
                  operation: "signInWithLiffToken",
                  success,
                  timestamp
                }
              ));

              if (success) {
                logger.info("Authentication successful, refreshing user data", createAuthLogContext(
                  state.sessionId,
                  "liff",
                  {
                    operation: "signInWithLiffToken",
                    timestamp
                  }
                ));
                await refetchUser();
              } else {
                logger.error("Failed to complete authentication with LIFF token", createAuthLogContext(
                  state.sessionId,
                  "liff",
                  {
                    operation: "signInWithLiffToken",
                    timestamp
                  }
                ));
              }
            } catch (error) {
              logger.error("Failed to complete LIFF authentication", createAuthLogContext(
                state.sessionId,
                "liff",
                {
                  operation: "initializeAuth",
                  error: error instanceof Error ? error.message : String(error),
                  stack: error instanceof Error ? error.stack : undefined,
                  timestamp
                }
              ));
            }
          }
          else if ((environment === AuthEnvironment.LIFF || liffState.isLoggedIn) &&
              state.lineAuthStatus === "unauthenticated" &&
              !state.isAuthenticating) {
            logger.debug("Auto-logging in via LIFF", createAuthLogContext(
              state.sessionId,
              "liff",
              {
                operation: "autoLogin",
                path: typeof window !== "undefined" ? window.location.pathname : "/",
                environment,
                timestamp
              }
            ));
            await loginWithLiff(typeof window !== "undefined" ? window.location.pathname : "/");
          } else {
            logger.debug("No authentication action needed", createAuthLogContext(
              state.sessionId,
              "liff",
              {
                operation: "checkAuthStatus",
                liffLoggedIn: liffState.isLoggedIn,
                lineAuthStatus: state.lineAuthStatus,
                isAuthenticating: state.isAuthenticating,
                environment,
                timestamp
              }
            ));
          }
        } else {
          logger.error("LIFF initialization failed", createAuthLogContext(
            state.sessionId,
            "liff",
            {
              operation: "initializeAuth",
              timestamp
            }
          ));
        }
      }

      let isRedirectFromLineAuth = false;
      if (typeof window !== "undefined") {
        const searchParams = new URLSearchParams(window.location.search);
        isRedirectFromLineAuth = searchParams.has("liff.state") || searchParams.has("code");
        const redirectTimestamp = new Date().toISOString();
        logger.debug("LINE redirect detection", createAuthLogContext(
          state.sessionId,
          "liff",
          {
            operation: "initializeAuth",
            timestamp: redirectTimestamp,
            hasLiffState: searchParams.has("liff.state"),
            hasCode: searchParams.has("code"),
            isRedirect: isRedirectFromLineAuth,
            currentUrl: typeof window !== "undefined" ? window.location.href : "SSR"
          }
        ));
      }

      if (isRedirectFromLineAuth && state.lineAuthStatus === "unauthenticated" && !state.isAuthenticating) {
        const redirectTimestamp = new Date().toISOString();
        logger.info("Detected LINE authentication redirect - starting completion process", createAuthLogContext(
          state.sessionId,
          "liff",
          {
            operation: "initializeAuth",
            timestamp: redirectTimestamp,
            lineAuthStatus: state.lineAuthStatus,
            isAuthenticating: state.isAuthenticating,
            environment,
            windowHref: typeof window !== "undefined" ? window.location.href : "SSR"
          }
        ));

        setState(prev => ({ ...prev, isAuthenticating: true }));

        try {
          logger.debug("Initializing LIFF for authentication completion", createAuthLogContext(
            state.sessionId,
            "liff",
            {
              operation: "initializeAuth",
              timestamp: redirectTimestamp
            }
          ));
          const liffSuccess = await liffService.initialize(state.sessionId);
          const initTimestamp = new Date().toISOString();
          logger.debug("LIFF initialization result", createAuthLogContext(
            state.sessionId,
            "liff",
            {
              operation: "initializeAuth",
              timestamp: initTimestamp,
              success: liffSuccess
            }
          ));

          if (liffSuccess) {
            const liffState = liffService.getState();
            logger.debug("LIFF state after initialization", createAuthLogContext(
              state.sessionId,
              "liff",
              {
                operation: "initializeAuth",
                timestamp: initTimestamp,
                isInitialized: liffState.isInitialized,
                isLoggedIn: liffState.isLoggedIn,
                userId: liffState.profile?.userId ? maskUserId(liffState.profile.userId) : "none",
                hasAccessToken: !!liffService.getAccessToken()
              }
            ));

            if (liffState.isLoggedIn) {
              logger.debug("LIFF is logged in - calling signInWithLiffToken", createAuthLogContext(
                state.sessionId,
                "liff",
                {
                  operation: "initializeAuth",
                  timestamp: initTimestamp
                }
              ));
              const authTimestamp = new Date().toISOString();
              const success = await liffService.signInWithLiffToken(state.sessionId);
              const completeTimestamp = new Date().toISOString();
              logger.debug("signInWithLiffToken result", createAuthLogContext(
                state.sessionId,
                "liff",
                {
                  operation: "initializeAuth",
                  timestamp: completeTimestamp,
                  success
                }
              ));

              if (success) {
                logger.info("LINE authentication successful - refreshing user data", createAuthLogContext(
                  state.sessionId,
                  "liff",
                  {
                    operation: "initializeAuth",
                    timestamp: completeTimestamp
                  }
                ));
                await refetchUser();
              } else {
                logger.error("Failed to complete LINE authentication with LIFF token", createAuthLogContext(
                  state.sessionId,
                  "liff",
                  {
                    operation: "initializeAuth",
                    timestamp: completeTimestamp
                  }
                ));
              }
            } else {
              logger.debug("LIFF not logged in after initialization", createAuthLogContext(
                state.sessionId,
                "liff",
                {
                  operation: "initializeAuth",
                  timestamp: initTimestamp
                }
              ));
            }
          } else {
            logger.error("LIFF initialization failed during redirect completion", createAuthLogContext(
              state.sessionId,
              "liff",
              {
                operation: "initializeAuth",
                timestamp: initTimestamp
              }
            ));
          }
        } catch (error) {
          const errorTimestamp = new Date().toISOString();
          logger.error("LINE authentication completion failed", createAuthLogContext(
            state.sessionId,
            "liff",
            {
              operation: "initializeAuth", 
              timestamp: errorTimestamp,
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
              environment
            }
          ));
        }
      }

      setState(prev => ({ ...prev, isAuthenticating: false }));
      const endTimestamp = new Date().toISOString();
      logger.debug("AuthProvider initializeAuth - Completed", createAuthLogContext(
        state.sessionId,
        "general",
        {
          operation: "initializeAuth",
          timestamp: endTimestamp
        }
      ));
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
   * @param sessionId セッションID（オプション）
   * @returns ログインが成功したかどうか
   */
  const loginWithLiff = async (redirectPath?: string, sessionId?: string): Promise<boolean> => {
    const authSessionId = sessionId || state.sessionId;
    setState((prev) => ({ ...prev, isAuthenticating: true }));

    try {
      const initialized = await liffService.initialize(authSessionId);
      if (!initialized) {
        throw new Error("Failed to initialize LIFF");
      }

      const loggedIn = await liffService.login(redirectPath, authSessionId);
      if (!loggedIn) {
        return false; // リダイレクトするのでここには到達しない
      }

      const success = await liffService.signInWithLiffToken(authSessionId);

      if (success) {
        await refetchUser();
      }

      return success;
    } catch (error) {
      logger.info("Login with LIFF failed", createAuthLogContext(
        authSessionId,
        "liff",
        {
          operation: "loginWithLiff",
          error: error instanceof Error ? error.message : String(error)
        }
      ));
      return false;
    } finally {
      setState((prev) => ({ ...prev, isAuthenticating: false }));
    }
  };

  /**
   * ログアウト
   * @param sessionId セッションID（オプション）
   */
  const logout = useCallback(async (sessionId?: string): Promise<void> => {
    const authSessionId = sessionId || state.sessionId;
    try {
      logger.info("User logout initiated", createAuthLogContext(
        authSessionId,
        "general",
        {
          operation: "logout"
        }
      ));
      
      liffService.logout(authSessionId);

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

      logger.info("User logout completed", createAuthLogContext(
        authSessionId,
        "general",
        {
          operation: "logout",
          status: "success"
        }
      ));

      router.push("/login");
    } catch (error) {
      logger.error("Logout failed", createAuthLogContext(
        authSessionId,
        "general",
        {
          operation: "logout",
          error: error instanceof Error ? error.message : String(error)
        }
      ));
      console.error("Logout failed:", error);
    }
  }, [router, state.sessionId]);

  /**
   * 電話番号認証を開始
   */
  const startPhoneVerification = async (phoneNumber: string, sessionId?: string): Promise<string | null> => {
    return phoneAuthService.startPhoneVerification(phoneNumber, sessionId || state.sessionId);
  };

  /**
   * 電話番号認証コードを検証
   */
  const verifyPhoneCode = async (verificationCode: string, sessionId?: string): Promise<boolean> => {
    const success = await phoneAuthService.verifyPhoneCode(verificationCode, sessionId || state.sessionId);

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

      const phoneTokens = TokenManager.getPhoneTokens();
      const lineTokens = TokenManager.getLineTokens();

      logger.debug("Tokens before userSignUp", createAuthLogContext(
        state.sessionId,
        "general",
        {
          operation: "createUser",
          hasLineToken: !!lineTokens.accessToken,
          hasPhoneToken: !!phoneTokens.accessToken,
          lineExpiresAt: lineTokens.expiresAt,
          phoneExpiresAt: phoneTokens.expiresAt,
          phoneUid: phoneUid ? maskUserId(phoneUid) : null,
          phoneNumber: phoneTokens.phoneNumber ? maskPhoneNumber(phoneTokens.phoneNumber) : null
        }
      ));

      logger.debug("Creating user with input", createAuthLogContext(
        state.sessionId,
        "general",
        {
          operation: "createUser",
          name,
          currentPrefecture: prefecture,
          communityId: COMMUNITY_ID,
          phoneUid: phoneUid ? maskUserId(phoneUid) : null,
          phoneNumber: phoneTokens.phoneNumber ? maskPhoneNumber(phoneTokens.phoneNumber) : null
        }
      ));

      const { data } = await userSignUp({
        variables: {
          input: {
            name,
            currentPrefecture: prefecture, // Changed from prefecture to currentPrefecture to match backend schema
            communityId: COMMUNITY_ID,
            phoneUid,
            phoneNumber: phoneTokens.phoneNumber,
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
      logger.error("User creation failed", createAuthLogContext(
        state.sessionId,
        "general",
        {
          operation: "createUser",
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }
      ));
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
    sessionId: state.sessionId,
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
