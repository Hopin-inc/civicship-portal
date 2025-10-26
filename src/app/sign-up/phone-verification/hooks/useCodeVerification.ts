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
        console.log("[useCodeVerification] Starting phone code verification");
        const success = await phoneAuth.verifyPhoneCode(verificationCode);
        console.log("[useCodeVerification] verifyPhoneCode success:", success);
        
        const authStoreState = useAuthStore.getState();
        const phoneUid = authStoreState.phoneAuth.phoneUid;
        console.log("[useCodeVerification] Auth store state after verifyPhoneCode:", {
          authenticationState: authStoreState.state.authenticationState,
          phoneAuthPhoneUid: phoneUid,
          phoneAuthIsVerified: authStoreState.phoneAuth.isVerified,
        });
        
        const setAuthState = authStoreState.setState;

        if (!success || !phoneUid) {
          console.log("[useCodeVerification] Early return: invalid code or missing phoneUid");
          return {
            success: false,
            error: {
              message: "認証コードが無効です",
              type: "invalid-code",
            },
          };
        }

        console.log("[useCodeVerification] Calling identityCheckPhoneUser mutation with phoneUid:", phoneUid?.substring(0, 8) + "...");
        
        let data;
        try {
          const mutationResult = await identityCheckPhoneUser({
            variables: {
              input: {
                phoneUid: phoneUid,
              },
            },
          });
          data = mutationResult.data;
          console.log("[useCodeVerification] identityCheckPhoneUser mutation completed successfully");
          console.log("[useCodeVerification] Raw mutation result:", mutationResult);
        } catch (mutationError) {
          console.error("[useCodeVerification] identityCheckPhoneUser mutation failed:", mutationError);
          throw mutationError;
        }

        const status = data?.identityCheckPhoneUser?.status;
        console.log("[useCodeVerification] identityCheckPhoneUser response:", {
          status,
          hasData: !!data,
          hasUser: !!data?.identityCheckPhoneUser?.user,
          hasMembership: !!data?.identityCheckPhoneUser?.membership,
          fullData: data,
        });

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
            console.log("[useCodeVerification] Status: NEW_USER, redirecting to /sign-up");
            return {
              success: true,
              redirectPath: `/sign-up${nextParam}`,
              message: "電話番号認証が完了しました",
            };

          case GqlPhoneUserStatus.ExistingSameCommunity:
            console.log("[useCodeVerification] Status: EXISTING_SAME_COMMUNITY, setting user_registered");
            setAuthState({ authenticationState: "user_registered" });
            const homeRedirectPath = authRedirectService.getRedirectPath(
              "/" as RawURIComponent,
              nextParam as RawURIComponent,
            );
            console.log("[useCodeVerification] Redirecting to:", homeRedirectPath || "/");
            return {
              success: true,
              redirectPath: homeRedirectPath || "/",
              message: "ログインしました",
            };

          case GqlPhoneUserStatus.ExistingDifferentCommunity:
            console.log("[useCodeVerification] Status: EXISTING_DIFFERENT_COMMUNITY, updating auth state");
            updateAuthState();
            setAuthState({ authenticationState: "user_registered" });
            const crossCommunityRedirectPath = authRedirectService.getRedirectPath(
              "/" as RawURIComponent,
              nextParam as RawURIComponent,
            );
            console.log("[useCodeVerification] Redirecting to:", crossCommunityRedirectPath || "/");
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
        console.error("[useCodeVerification] Error during verification:", error);
        return {
          success: false,
          error: {
            message: "電話番号からやり直して下さい",
            type: "verification-failed",
          },
        };
      } finally {
        // エラー時も含めて、必ずisVerifyingをfalseに戻す
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
