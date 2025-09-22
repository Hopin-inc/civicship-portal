import { User } from "firebase/auth";
import { GqlCurrentPrefecture, GqlCurrentUserPayload } from "@/types/graphql";
import { AuthEnvironment } from "@/lib/auth/environment-detector";
import { RawURIComponent } from "@/utils/path";

export type AuthState = {
  firebaseUser: User | null;
  currentUser: GqlCurrentUserPayload["user"] | null;
  authenticationState:
    | "initializing" // I0: 初期化中
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
  authReady: boolean;

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
