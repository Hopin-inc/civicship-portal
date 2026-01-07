import React from "react";
import { GqlCurrentUserPayload, GqlUser } from "@/types/graphql";
import { User } from "firebase/auth";
import { AuthEnvironment } from "@/lib/auth/core/environment-detector";

export type AuthStore = {
  state: AuthState;
  phoneAuth: PhoneAuthState;
  liffAuth: LiffState;
  setState: (partial: Partial<AuthState>) => void;
  setPhoneAuth: (partial: Partial<PhoneAuthState>) => void;
  setLiffAuth: (partial: Partial<LiffState>) => void;
  reset: () => void;
};

export type AuthState = {
  firebaseUser: User | null;
  currentUser: GqlCurrentUserPayload["user"] | null;
  authenticationState: AuthenticationState;
  environment: AuthEnvironment;
  isAuthenticating: boolean;
  isAuthInProgress: boolean;
  lineTokens: {
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: string | null;
  };
  /**
   * The community ID for which the user is LINE-authenticated.
   * This is used to determine if the LINE authentication is valid for the current community.
   * When navigating between communities, this helps redirect to login instead of phone verification
   * if the user is not LINE-authenticated for the target community.
   */
  authenticatedCommunityId: string | null;
};

export type AuthenticationState =
  | "unauthenticated" // S0: 未認証
  | "line_authenticated" // S1: LINE認証済み
  | "phone_authenticated" // S2: 電話番号認証済み
  | "user_registered" // S3: ユーザ情報登録済み
  | "loading" // L0: 状態チェック中
  | "authenticating"; // L1: Firebase認証セッション確認中

export type LiffState = {
  isInitialized: boolean;
  isLiffProcessing: boolean;
  isLoggedIn: boolean;
  profile: {
    userId: string | null;
    displayName: string | null;
    pictureUrl: string | null;
  };
  error: Error | null;
};

export type PhoneAuthState = {
  isVerifying: boolean;
  isVerified: boolean;
  refreshToken: string | null;
  phoneNumber: string | null;
  phoneUid: string | null;
  verificationId: string | null;
  error: Error | null;
  phoneTokens: {
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: string | null;
  };
};

export interface AuthContextType {
  user: GqlCurrentUserPayload["user"] | null;
  firebaseUser: User | null;
  uid: string | null;
  isAuthenticated: boolean;
  isPhoneVerified: boolean;
  isUserRegistered: boolean;
  authenticationState: AuthState["authenticationState"];
  isAuthenticating: boolean;
  environment: AuthEnvironment;

  logout: () => Promise<void>;

  updateAuthState: () => Promise<GqlUser | null>;

  loading: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
  ssrCurrentUser?: GqlUser | undefined | null;
  ssrLineAuthenticated?: boolean;
  ssrPhoneAuthenticated?: boolean;
}
