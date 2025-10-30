import { GqlCurrentPrefecture } from "@/types/graphql";
import { LiffService } from "@/lib/auth/service/liff-service";
import { logger } from "@/lib/logging";
import { AuthRedirectService } from "@/lib/auth/service/auth-redirect-service";
import { RawURIComponent } from "@/utils/path";
import { currentCommunityConfig } from "@/lib/communities/metadata";

interface NewUserSignupParams {
  createUser: (name: string, prefecture: GqlCurrentPrefecture, phoneUid: string) => Promise<any>;
  updateAuthState: () => Promise<any>;
  setAuthState: (partial: any) => void;
  phoneUid: string;
  nextParam: string;
}

interface NewUserSignupResult {
  success: boolean;
  redirectPath?: string;
  message?: string;
  error?: {
    message: string;
    type: string;
  };
}

/**
 * 新規ユーザーの自動サインアップ処理
 * LINE displayNameを使用してユーザーを作成し、適切なパスにリダイレクトする
 */
export async function handleNewUserSignup({
  createUser,
  updateAuthState,
  setAuthState,
  phoneUid,
  nextParam,
}: NewUserSignupParams): Promise<NewUserSignupResult> {
  // LINE認証のプロフィール情報を取得
  const liffService = LiffService.getInstance();
  const liffProfile = liffService.getState().profile;
  const displayName = liffProfile.displayName || "ユーザー";

  try {
    // userSignUpを実行（画像は後でユーザーがプロフィール編集で設定可能）
    await createUser(displayName, GqlCurrentPrefecture.Unknown, phoneUid);

    // ユーザー情報を再取得
    await updateAuthState();
    setAuthState({ authenticationState: "user_registered", isAuthInProgress: false });

    const authRedirectService = AuthRedirectService.getInstance();
    const defaultPath = (currentCommunityConfig.rootPath || "/") as RawURIComponent;
    const homeRedirectPath = authRedirectService.getRedirectPath(
      defaultPath,
      nextParam as RawURIComponent,
    );

    return {
      success: true,
      redirectPath: homeRedirectPath || defaultPath,
      message: "アカウントを作成しました",
    };
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
