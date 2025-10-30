import { GqlCurrentPrefecture, GqlUser } from "@/types/graphql";
import { LiffService } from "@/lib/auth/service/liff-service";
import { logger } from "@/lib/logging";
import { User } from "firebase/auth";
import { AuthState } from "@/types/auth";

interface NewUserSignupParams {
  createUser: (name: string, prefecture: GqlCurrentPrefecture, phoneUid: string) => Promise<User | null>;
  updateAuthState: () => Promise<GqlUser | null>;
  setAuthState: (partial: Partial<AuthState>) => void;
  phoneUid: string;
}

interface NewUserSignupResult {
  success: boolean;
  error?: {
    message: string;
    type: string;
  };
}

/**
 * 新規ユーザーの自動サインアップ処理
 * LINE displayNameを使用してユーザーを作成する
 */
export async function handleNewUserSignup({
  createUser,
  updateAuthState,
  setAuthState,
  phoneUid,
}: NewUserSignupParams): Promise<NewUserSignupResult> {
  // LINE認証のプロフィール情報を取得
  const liffService = LiffService.getInstance();
  const liffProfile = liffService.getState().profile;
  const displayName = liffProfile.displayName || "ユーザー";

  try {
    // userSignUpを実行
    await createUser(displayName, GqlCurrentPrefecture.Unknown, phoneUid);

    // ユーザー情報を再取得
    await updateAuthState();
    setAuthState({ authenticationState: "user_registered", isAuthInProgress: false });

    return { success: true };
  } catch (createError) {
    logger.error("[handleNewUserSignup] Failed to create user", {
      error: createError instanceof Error ? createError.message : String(createError),
    });
    setAuthState({ isAuthInProgress: false });
    return {
      success: false,
      error: {
        message: "アカウント作成に失敗しました",
        type: "user-creation-failed",
      },
    };
  }
}
