import React from "react";
import { GqlCurrentPrefecture, GqlCurrentUserPayload, GqlUser } from "@/types/graphql";
import { User } from "firebase/auth";
import { AuthEnvironment } from "@/lib/auth/environment-detector";
import { RawURIComponent } from "@/utils/path";

export type AuthStore = {
  state: AuthState;
  // cashedToken: string | null;
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
    expiresAt: number | null;
  };
};

export type AuthenticationState =
  | "unauthenticated" // S0: 未認証
  | "line_authenticated" // S1: LINE認証済み
  | "line_token_expired" // S1e: LINEトークン期限切れ
  | "phone_authenticated" // S2: 電話番号認証済み
  | "phone_token_expired" // S2e: 電話番号トークン期限切れ
  | "user_registered" // S3: ユーザ情報登録済み
  | "loading" // L0: 状態チェック中
  | "authenticating"; // L1: Firebase認証セッション確認中

export type LiffState = {
  isInitialized: boolean;
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
    expiresAt: number | null;
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

  loginWithLiff: (redirectPath?: RawURIComponent) => Promise<boolean>;
  logout: () => Promise<void>;

  phoneAuth: {
    startPhoneVerification: (phoneNumber: string) => Promise<string | null>;
    verifyPhoneCode: (verificationCode: string) => Promise<boolean>;
    clearRecaptcha?: () => void;
    isVerifying: boolean;
    phoneUid: string | null;
    phoneNumber: string | null;
  };

  createUser: (
    name: string,
    prefecture: GqlCurrentPrefecture,
    phoneUid: string,
  ) => Promise<User | null>;
  updateAuthState: () => Promise<GqlUser | null>;

  loading: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
  ssrCurrentUser?: GqlUser | undefined | null;
  ssrLineAuthenticated?: boolean;
  ssrPhoneAuthenticated?: boolean;
}
