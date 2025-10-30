"use client";

import { useCallback, useState } from "react";
import { useMutation } from "@apollo/client";
import { AuthRedirectService } from "@/lib/auth/service/auth-redirect-service";
import { IDENTITY_CHECK_PHONE_USER } from "@/graphql/account/identity/mutation";
import {
  GqlIdentityCheckPhoneUserPayload,
  GqlMutationIdentityCheckPhoneUserArgs,
  GqlPhoneUserStatus,
  GqlCurrentPrefecture,
} from "@/types/graphql";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { RawURIComponent } from "@/utils/path";
import { logger } from "@/lib/logging";
import { handleNewUserSignup } from "./handleNewUserSignup";
import { currentCommunityConfig } from "@/lib/communities/metadata";
import { User } from "firebase/auth";

interface CodeVerificationResult {
  success: boolean;
  redirectPath?: string;
  message?: string;
  error?: {
    message: string;
    type: string;
  };
}

export function useCodeVerification(
  phoneAuth: { verifyPhoneCode: (verificationCode: string) => Promise<boolean> },
  nextParam: string,
  updateAuthState: () => Promise<GqlUser | null>,
  createUser: (name: string, prefecture: GqlCurrentPrefecture, phoneUid: string) => Promise<User | null>,
) {
  const [isVerifying, setIsVerifying] = useState(false);

  const [identityCheckPhoneUser] = useMutation<
    { identityCheckPhoneUser: GqlIdentityCheckPhoneUserPayload },
    GqlMutationIdentityCheckPhoneUserArgs
  >(IDENTITY_CHECK_PHONE_USER);

  const authRedirectService = AuthRedirectService.getInstance();

  const verify = useCallback(
    async (verificationCode: string): Promise<CodeVerificationResult> => {
      const authStoreState = useAuthStore.getState();

      if (isVerifying) {
        logger.warn("[useCodeVerification] Already verifying");
        return {
          success: false,
          error: {
            message: "認証処理中です。しばらくお待ちください。",
            type: "already-verifying",
          },
        };
      }

      setIsVerifying(true);

      const setAuthState = authStoreState.setState;
      setAuthState({ isAuthInProgress: true });

      try {
        const success = await phoneAuth.verifyPhoneCode(verificationCode);
        const phoneUid = useAuthStore.getState().phoneAuth.phoneUid;

        if (!success || !phoneUid) {
          logger.error("[useCodeVerification] Invalid code or missing phoneUid");
          setAuthState({ isAuthInProgress: false });
          return {
            success: false,
            error: {
              message: "認証コードが無効です",
              type: "invalid-code",
            },
          };
        }

        const { data } = await identityCheckPhoneUser({
          variables: {
            input: {
              phoneUid: phoneUid,
            },
          },
        });
        const status = data?.identityCheckPhoneUser?.status;
        if (!status) {
          setAuthState({ isAuthInProgress: false });
          return {
            success: false,
            error: {
              message: "認証ステータスの取得に失敗しました。再試行してください。",
              type: "status-fetch-failed",
            },
          };
        }

        // nextパラメータを取得
        const next = nextParam ? new URLSearchParams(nextParam).get("next") : null;
        const defaultPath = (currentCommunityConfig.rootPath || "/") as RawURIComponent;

        switch (status) {
          case GqlPhoneUserStatus.NewUser:
            const signupResult = await handleNewUserSignup({
              createUser,
              updateAuthState,
              setAuthState,
              phoneUid,
            });

            if (!signupResult.success) {
              // 自動サインアップ失敗時は手動登録フォームにリダイレクト
              // 電話番号認証自体は成功しているため、success: true
              return {
                success: true,
                redirectPath: `/sign-up${nextParam}`,
                message: "アカウントの自動作成に失敗しました。手動で情報を入力してください。",
              };
            }

            // 認証状態が user_registered に更新された後に authRedirectService を呼ぶ
            const newUserRedirectPath = authRedirectService.getRedirectPath(
              defaultPath,
              next as RawURIComponent,
            );

            return {
              success: true,
              redirectPath: newUserRedirectPath || defaultPath,
              message: "アカウントを作成しました",
            };

          case GqlPhoneUserStatus.ExistingSameCommunity:
            await updateAuthState();
            setAuthState({ authenticationState: "user_registered", isAuthInProgress: false });

            // 認証状態が user_registered に更新された後に authRedirectService を呼ぶ
            const existingUserRedirectPath = authRedirectService.getRedirectPath(
              defaultPath,
              next as RawURIComponent,
            );

            return {
              success: true,
              redirectPath: existingUserRedirectPath || defaultPath,
              message: "ログインしました",
            };

          case GqlPhoneUserStatus.ExistingDifferentCommunity:
            await updateAuthState();
            setAuthState({ authenticationState: "user_registered", isAuthInProgress: false });

            // 認証状態が user_registered に更新された後に authRedirectService を呼ぶ
            const crossCommunityRedirectPath = authRedirectService.getRedirectPath(
              defaultPath,
              next as RawURIComponent,
            );

            return {
              success: true,
              redirectPath: crossCommunityRedirectPath || defaultPath,
              message: "メンバーシップが追加されました",
            };

          default:
            setAuthState({ isAuthInProgress: false });
            return {
              success: false,
              error: {
                message: "認証処理でエラーが発生しました",
                type: "unknown-status",
              },
            };
        }
      } catch (error) {
        logger.error("[useCodeVerification] Verification failed", {
          error: error instanceof Error ? error.message : String(error),
        });
        setAuthState({ isAuthInProgress: false });
        return {
          success: false,
          error: {
            message: "電話番号からやり直して下さい",
            type: "verification-failed",
          },
        };
      } finally {
        setIsVerifying(false);
      }
    },
    [
      phoneAuth,
      identityCheckPhoneUser,
      authRedirectService,
      nextParam,
      updateAuthState,
      createUser,
      isVerifying,
    ],
  );

  return {
    verify,
    isVerifying,
  };
}
