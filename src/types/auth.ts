import { GqlUser } from "@/types/graphql";

export type AppAuthInfo = {
  uid?: string;
  providerIds?: string[];
  user?: GqlUser | null;
};

export type AuthenticationState = 
  | "unauthenticated"      
  | "line_authenticated"   
  | "phone_authenticated"  
  | "user_registered"      

export type LoadingState = {
  isLoading: boolean;
  phase: "initializing" | "checking_line" | "checking_phone" | "checking_user" | "idle";
}

export type TokenStatus = {
  lineTokenExpired: boolean;
  phoneTokenExpired: boolean;
}

export type AuthError = {
  type: "token_expired" | "network_error" | "auth_failed";
  source: "line" | "phone" | "user_registration";
  message: string;
  recoverable: boolean;
}

export type AuthState = {
  authentication: AuthenticationState;
  tokenStatus: TokenStatus;
  loading: LoadingState;
  firebaseUser: any | null;
  currentUser: GqlUser | null;
  environment: "liff" | "browser" | null;
  error: AuthError | null;
}

export type AuthStateChangeListener = (state: AuthState) => void;

export type LegacyAuthenticationState = 
  | "unauthenticated" 
  | "line_authenticated" 
  | "line_token_expired" 
  | "phone_authenticated" 
  | "phone_token_expired" 
  | "user_registered"
  | "loading";
