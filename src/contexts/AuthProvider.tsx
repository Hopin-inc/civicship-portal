"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "firebase/auth";
import { LiffService } from "@/lib/auth/liff-service";
import { TokenService } from "@/lib/auth/token-service";
import { AuthenticationState, AuthStateStore } from "@/lib/auth/auth-state-store";
import { AuthService } from "@/lib/auth/auth-service";
import { lineAuth } from "@/lib/auth/firebase-config";
import { AuthEnvironment, detectEnvironment } from "@/lib/auth/environment-detector";
import { GqlCurrentPrefecture, GqlCurrentUserPayload } from "@/types/graphql";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";
import { USER_SIGN_UP } from "@/graphql/account/identity/mutation";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";
import { COMMUNITY_ID } from "@/utils";
import {
  useFirebaseAuth,
  usePhoneAuth,
  useUserData,
  useLiffInitialization,
  useLineAuthRedirect,
  useAutoLogin,
  useTokenExpiration,
} from "@/hooks/auth";
import { PhoneAuthService } from "@/lib/auth/phone-auth-service";

/**
 * 認証状態の型定義
 */
export type AuthState = {
  firebaseUser: User | null;
  currentUser: GqlCurrentUserPayload["user"] | null;
  authenticationState: AuthenticationState;
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

  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    currentUser: null,
    authenticationState: "loading",
    environment,
    isAuthenticating: false,
  });

  const [userSignUp] = useMutation(USER_SIGN_UP);

  const { data: userData, loading: userLoading, refetch: refetchUser } = useQuery(GET_CURRENT_USER, {
    skip: !["line_authenticated", "phone_authenticated", "user_registered"].includes(state.authenticationState),
    fetchPolicy: "network-only",
  });

  const authService = AuthService.getInstance();
  const phoneAuthService = PhoneAuthService.getInstance();

  const setFirebaseUser = useCallback((user: User | null) => {
    console.log("👀 Setting firebase user: ", user?.uid)
    setState(prev => ({ ...prev, firebaseUser: user }));
  }, []);

  const setCurrentUser = useCallback((user: GqlCurrentUserPayload["user"] | null) => {
    setState(prev => ({ ...prev, currentUser: user }));
  }, []);

  const setAuthenticationState = useCallback((stateOrUpdater: AuthenticationState | ((prev: AuthenticationState) => AuthenticationState)) => {
    setState((prev) => {
      const newState = typeof stateOrUpdater === "function"
        ? stateOrUpdater(prev.authenticationState)
        : stateOrUpdater;
      return { ...prev, authenticationState: newState };
    });
  }, []);

  const setIsAuthenticating = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, isAuthenticating: value }));
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await liffService.logout();
      await lineAuth.signOut();
      await phoneAuthService.reset();
      await authService.logout();

      setState((prev) => ({
        ...prev,
        firebaseUser: null,
        currentUser: null,
        authenticationState: "unauthenticated",
      }));
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [liffService, phoneAuthService, authService]);

  useLineAuthRedirect(state.authenticationState, state.isAuthenticating, environment, liffService, setIsAuthenticating, refetchUser);
  useLiffInitialization(environment, liffService);
  useFirebaseAuth(state.isAuthenticating, setFirebaseUser, setAuthenticationState);
  usePhoneAuth(setAuthenticationState);
  useUserData(userData, setCurrentUser, setAuthenticationState);
  useAutoLogin(state.authenticationState, state.isAuthenticating, environment, liffService, setIsAuthenticating, refetchUser);
  useTokenExpiration(state.authenticationState, state.isAuthenticating, setAuthenticationState, logout);

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
        authenticationState: "phone_authenticated",
      }));

      try {
        const timestamp = new Date().toISOString();
        console.log(`🔍 [${ timestamp }] Updating phone auth state in verifyPhoneCode`);
        await authService.handlePhoneAuthSuccess();
        console.log(`🔍 [${ timestamp }] Auth state updated to phone_authenticated in verifyPhoneCode`);
      } catch (error) {
        console.error("Failed to update auth state in verifyPhoneCode:", error);
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

      const tokenService = TokenService.getInstance();
      const phoneTokens = tokenService.getPhoneTokens();
      const lineTokens = tokenService.getLineTokens();

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
            phoneNumber: phoneTokens.phoneNumber,
            lineRefreshToken: lineTokens.refreshToken,
            phoneRefreshToken: phoneTokens.refreshToken,
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
    isAuthenticated: ["line_authenticated", "phone_authenticated", "user_registered"].includes(state.authenticationState),
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

  return <AuthContext.Provider value={ value }>{ children }</AuthContext.Provider>;
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
