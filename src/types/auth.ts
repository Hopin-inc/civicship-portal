import { GqlUser } from "@/types/graphql";

export type AppAuthInfo = {
  uid?: string;
  providerIds?: string[];
  user?: GqlUser | null;
};

export type AuthInitializationState = 
  | "not_started"        // 初期化未開始
  | "checking_tokens"    // トークン検証中
  | "checking_user"      // ユーザー情報確認中
  | "hydrating"          // SSR/CSR状態同期中
  | "completed"          // 初期化完了
  | "failed";            // 初期化失敗

export interface AuthInitializationContext {
  state: AuthInitializationState;
  progress: number; // 0-100の進捗率
  error?: string;
  retryCount: number;
}
