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
  const liffState = liffService.getState();
  
  if (!liffState.isInitialized || !liffState.isLoggedIn) {
    logger.error("[handleNewUserSignup] LIFF not initialized or not logged in", {
      isInitialized: liffState.isInitialized,
      isLoggedIn: liffState.isLoggedIn,
    });
    setAuthState({ isAuthInProgress: false, isAuthenticating: false });
    return {
      success: false,
      error: {
        message: "LINE認証情報の取得に失敗しました",
        type: "liff-not-ready",
      },
    };
  }

  const liffProfile = liffState.profile;
  const displayName = liffProfile.displayName || null;
  
  if (!displayName) {
    logger.error("[handleNewUserSignup] LINE displayName not available", {
      profile: liffProfile,
    });
    setAuthState({ isAuthInProgress: false, isAuthenticating: false });
    return {
      success: false,
      error: {
        message: "LINEプロフィール情報の取得に失敗しました",
        type: "liff-profile-missing",
      },
    };
  }

  try {
    // userSignUpを実行
    const firebaseUser = await createUser(displayName, GqlCurrentPrefecture.Unknown, phoneUid);

    // createUserが失敗した場合（nullを返した場合）
    if (!firebaseUser) {
      logger.error("[handleNewUserSignup] createUser returned null");
      setAuthState({ isAuthInProgress: false, isAuthenticating: false });
      return {
        success: false,
        error: {
          message: "アカウント作成に失敗しました",
          type: "user-creation-failed",
        },
      };
    }

    // ユーザー情報を再取得
    const currentUser = await updateAuthState();
    
    // updateAuthStateが失敗した場合（nullを返した場合）
    if (!currentUser) {
      logger.error("[handleNewUserSignup] updateAuthState returned null");
      setAuthState({ isAuthInProgress: false, isAuthenticating: false });
      return {
        success: false,
        error: {
          message: "ユーザー情報の取得に失敗しました",
          type: "user-fetch-failed",
        },
      };
    }

    setAuthState({ authenticationState: "user_registered", isAuthInProgress: false, isAuthenticating: false });

    return { success: true };
  } catch (createError) {
    logger.error("[handleNewUserSignup] Failed to create user", {
      error: createError instanceof Error ? createError.message : String(createError),
    });
    setAuthState({ isAuthInProgress: false, isAuthenticating: false });
    return {
      success: false,
      error: {
        message: "アカウント作成に失敗しました",
        type: "user-creation-failed",
      },
    };
  }
}
