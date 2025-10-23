"use client";

import { useCallback, useState } from "react";
import { useMutation } from "@apollo/client";
import { PhoneAuthService } from "@/lib/auth/service/phone-auth-service";
import { AuthRedirectService } from "@/lib/auth/service/auth-redirect-service";
import { IDENTITY_CHECK_PHONE_USER } from "@/graphql/account/identity/mutation";
import {
  GqlIdentityCheckPhoneUserPayload,
  GqlMutationIdentityCheckPhoneUserArgs,
  GqlPhoneUserStatus,
} from "@/types/graphql";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { RawURIComponent } from "@/utils/path";

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
  phoneAuth: PhoneAuthService,
  nextParam: string,
  updateAuthState: () => void
) {
  const [isVerifying, setIsVerifying] = useState(false);

  const [identityCheckPhoneUser] = useMutation<
    { identityCheckPhoneUser: GqlIdentityCheckPhoneUserPayload },
    GqlMutationIdentityCheckPhoneUserArgs
  >(IDENTITY_CHECK_PHONE_USER);

  const authRedirectService = AuthRedirectService.getInstance();

  const verify = useCallback(
    async (verificationCode: string): Promise<CodeVerificationResult> => {
      if (isVerifying) {
        return {
          success: false,
          error: {
            message: "認証処理中です。しばらくお待ちください。",
            type: "already-verifying",
          },
        };
      }

      setIsVerifying(true);

      try {
        const success = await phoneAuth.verifyPhoneCode(verificationCode);
        const phoneAuthState = useAuthStore.getState().phoneAuth;
        const setAuthState = useAuthStore.getState().setState;

        if (!success || !phoneAuthState.phoneUid) {
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
              phoneUid: phoneAuthState.phoneUid,
            },
          },
        });

        const status = data?.identityCheckPhoneUser?.status;

        if (!status) {
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
            return {
              success: true,
              redirectPath: `/sign-up${nextParam}`,
              message: "電話番号認証が完了しました",
            };

          case GqlPhoneUserStatus.ExistingSameCommunity:
            setAuthState({ authenticationState: "user_registered" });
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
            updateAuthState();
            setAuthState({ authenticationState: "user_registered" });
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
            return {
              success: false,
              error: {
                message: "認証処理でエラーが発生しました",
                type: "unknown-status",
              },
            };
        }
      } catch (error) {
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
    [phoneAuth, identityCheckPhoneUser, authRedirectService, nextParam, updateAuthState, isVerifying]
  );

  return {
    verify,
    isVerifying,
  };
}
