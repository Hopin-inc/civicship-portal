"use client";

import { useCallback, useState } from "react";
import { useMutation } from "@apollo/client";
import { AuthRedirectService } from "@/lib/auth/service/auth-redirect-service";
import { IDENTITY_CHECK_PHONE_USER } from "@/graphql/account/identity/mutation";
import {
  GqlIdentityCheckPhoneUserPayload,
  GqlMutationIdentityCheckPhoneUserArgs,
  GqlPhoneUserStatus,
} from "@/types/graphql";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { RawURIComponent } from "@/utils/path";
import { logger } from "@/lib/logging";
import React from "react";

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
  flowIdRef?: React.MutableRefObject<string | null>
) {
  const [isVerifying, setIsVerifying] = useState(false);

  const [identityCheckPhoneUser] = useMutation<
    { identityCheckPhoneUser: GqlIdentityCheckPhoneUserPayload },
    GqlMutationIdentityCheckPhoneUserArgs
  >(IDENTITY_CHECK_PHONE_USER);

  const authRedirectService = AuthRedirectService.getInstance();

  const verify = useCallback(
    async (verificationCode: string): Promise<CodeVerificationResult> => {
      const flowId = flowIdRef?.current || `verify-${Date.now()}`;
      const authStoreState = useAuthStore.getState();
      
      logger.info("[useCodeVerification] verify:start", { 
        flowId,
        isVerifying,
        isAuthInProgress: authStoreState.state.isAuthInProgress
      });

      if (isVerifying) {
        logger.warn("[useCodeVerification] Already verifying", { flowId });
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
      
      logger.debug("[useCodeVerification] Setting isAuthInProgress=true", { flowId });
      setAuthState({ isAuthInProgress: true });

      try {
        logger.debug("[useCodeVerification] Calling verifyPhoneCode", { flowId });
        const success = await phoneAuth.verifyPhoneCode(verificationCode);
        
        const phoneUid = useAuthStore.getState().phoneAuth.phoneUid;
        logger.debug("[useCodeVerification] verifyPhoneCode result", { 
          flowId,
          success,
          hasPhoneUid: !!phoneUid
        });

        if (!success || !phoneUid) {
          logger.error("[useCodeVerification] Invalid code or missing phoneUid", { flowId });
          setAuthState({ isAuthInProgress: false });
          return {
            success: false,
            error: {
              message: "認証コードが無効です",
              type: "invalid-code",
            },
          };
        }

        logger.debug("[useCodeVerification] Calling identityCheckPhoneUser", { flowId });
        const { data } = await identityCheckPhoneUser({
          variables: {
            input: {
              phoneUid: phoneUid,
            },
          },
        });

        const status = data?.identityCheckPhoneUser?.status;
        logger.info("[useCodeVerification] identityCheckPhoneUser result", { 
          flowId,
          status
        });

        if (!status) {
          logger.error("[useCodeVerification] Status fetch failed", { flowId });
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
            logger.info("[useCodeVerification] NewUser - no updateAuthState needed", { flowId });
            setAuthState({ isAuthInProgress: false });
            return {
              success: true,
              redirectPath: `/sign-up${nextParam}`,
              message: "電話番号認証が完了しました",
            };

          case GqlPhoneUserStatus.ExistingSameCommunity:
            logger.info("[useCodeVerification] ExistingSameCommunity - calling updateAuthState", { flowId });
            const updateStartTime = Date.now();
            await updateAuthState();
            const updateDuration = Date.now() - updateStartTime;
            logger.info("[useCodeVerification] updateAuthState completed", { 
              flowId,
              durationMs: updateDuration
            });
            
            setAuthState({ authenticationState: "user_registered", isAuthInProgress: false });
            logger.debug("[useCodeVerification] Computing redirect path", { 
              flowId,
              nextParam
            });
            const homeRedirectPath = authRedirectService.getRedirectPath(
              "/" as RawURIComponent,
              nextParam as RawURIComponent,
            );
            logger.info("[useCodeVerification] Redirect path computed", { 
              flowId,
              redirectPath: homeRedirectPath
            });
            return {
              success: true,
              redirectPath: homeRedirectPath || "/",
              message: "ログインしました",
            };

          case GqlPhoneUserStatus.ExistingDifferentCommunity:
            logger.info("[useCodeVerification] ExistingDifferentCommunity - calling updateAuthState", { flowId });
            const updateStartTime2 = Date.now();
            await updateAuthState();
            const updateDuration2 = Date.now() - updateStartTime2;
            logger.info("[useCodeVerification] updateAuthState completed", { 
              flowId,
              durationMs: updateDuration2
            });
            
            setAuthState({ authenticationState: "user_registered", isAuthInProgress: false });
            logger.debug("[useCodeVerification] Computing redirect path", { 
              flowId,
              nextParam
            });
            const crossCommunityRedirectPath = authRedirectService.getRedirectPath(
              "/" as RawURIComponent,
              nextParam as RawURIComponent,
            );
            logger.info("[useCodeVerification] Redirect path computed", { 
              flowId,
              redirectPath: crossCommunityRedirectPath
            });
            return {
              success: true,
              redirectPath: crossCommunityRedirectPath || "/",
              message: "メンバーシップが追加されました",
            };

          default:
            logger.error("[useCodeVerification] Unknown status", { flowId, status });
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
          flowId,
          error: error instanceof Error ? error.message : String(error)
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
        logger.debug("[useCodeVerification] verify:complete", { flowId });
      }
    },
    [phoneAuth, identityCheckPhoneUser, authRedirectService, nextParam, updateAuthState, isVerifying, flowIdRef]
  );

  return {
    verify,
    isVerifying,
  };
}
