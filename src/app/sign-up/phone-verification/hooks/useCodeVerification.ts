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
import { LiffService } from "@/lib/auth/service/liff-service";
import { urlToFile } from "@/lib/utils/image-converter";

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
  updateAuthState: () => Promise<any>,
  createUser: (name: string, prefecture: GqlCurrentPrefecture, phoneUid: string, image?: File | null) => Promise<any>,
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

        switch (status) {
          case GqlPhoneUserStatus.NewUser:
            // LINE認証のプロフィール情報を取得
            const liffService = LiffService.getInstance();
            const liffProfile = liffService.getState().profile;
            const displayName = liffProfile.displayName || "ユーザー";

            try {
              // LINE画像をダウンロードしてFileに変換
              let profileImage: File | null = null;
              if (liffProfile.pictureUrl) {
                try {
                  profileImage = await urlToFile(liffProfile.pictureUrl, "profile.jpg");
                  if (profileImage) {
                    logger.debug("[useCodeVerification] Successfully downloaded LINE profile image");
                  }
                } catch (imageError) {
                  logger.warn("[useCodeVerification] Failed to download LINE profile image", {
                    error: imageError instanceof Error ? imageError.message : String(imageError),
                  });
                  // 画像ダウンロード失敗は致命的ではないので続行
                }
              }

              // userSignUpを実行
              await createUser(displayName, GqlCurrentPrefecture.Unknown, phoneUid, profileImage);

              // ユーザー情報を再取得
              await updateAuthState();
              setAuthState({ authenticationState: "user_registered", isAuthInProgress: false });

              const homeRedirectPath = authRedirectService.getRedirectPath(
                "/" as RawURIComponent,
                nextParam as RawURIComponent,
              );

              return {
                success: true,
                redirectPath: homeRedirectPath || "/",
                message: "アカウントを作成しました",
              };
            } catch (createError) {
              logger.error("[useCodeVerification] Failed to create user", {
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

          case GqlPhoneUserStatus.ExistingSameCommunity:
            await updateAuthState();
            setAuthState({ authenticationState: "user_registered", isAuthInProgress: false });
            const homeRedirectPath = authRedirectService.getRedirectPath(
              "/" as RawURIComponent,
              nextParam as RawURIComponent,
            );
            return {
              success: true,
              redirectPath: homeRedirectPath || "/",
              message: "ログインしました",
            };

          case GqlPhoneUserStatus.ExistingDifferentCommunity:
            await updateAuthState();
            setAuthState({ authenticationState: "user_registered", isAuthInProgress: false });
            const crossCommunityRedirectPath = authRedirectService.getRedirectPath(
              "/" as RawURIComponent,
              nextParam as RawURIComponent,
            );
            return {
              success: true,
              redirectPath: crossCommunityRedirectPath || "/",
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
