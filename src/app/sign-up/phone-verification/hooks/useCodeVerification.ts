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
import { logFirebaseError } from "@/lib/auth/core/firebase-config";
import { useTranslations } from "next-intl";

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
) {
  const t = useTranslations();
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
            message: t("phoneVerification.verification.processing"),
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
          logger.info("[useCodeVerification] Invalid code or missing phoneUid", {
            component: "useCodeVerification",
            errorCategory: "user_input",
            retryable: true,
            authType: "phone",
          });
          setAuthState({ isAuthInProgress: false });
          return {
            success: false,
            error: {
              message: t("phoneVerification.verification.invalidCode"),
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
              message: t("phoneVerification.verification.statusFailed"),
              type: "status-fetch-failed",
            },
          };
        }

        switch (status) {
          case GqlPhoneUserStatus.NewUser:
            setAuthState({ isAuthInProgress: false });
            return {
              success: true,
              redirectPath: `/sign-up${nextParam}`,
              message: t("phoneVerification.verification.completed"),
            };

          case GqlPhoneUserStatus.ExistingSameCommunity:
            const updatedUser = await updateAuthState();
            
            // Defensive: handle case where updateAuthState returns null
            if (!updatedUser) {
              logger.warn("[AUTH] useCodeVerification: updateAuthState returned null (ExistingSameCommunity)", {
                status: GqlPhoneUserStatus.ExistingSameCommunity,
                component: "useCodeVerification",
              });
              setAuthState({ isAuthInProgress: false });
              return {
                success: false,
                error: {
                  message: t("phoneVerification.errors.generic"),
                  type: "auth-state-update-failed",
                },
              };
            }
            
            setAuthState({ authenticationState: "user_registered", isAuthInProgress: false });
            const homeRedirectPath = authRedirectService.getRedirectPath(
              "/" as RawURIComponent,
              nextParam as RawURIComponent,
              updatedUser,
            );
            return {
              success: true,
              redirectPath: homeRedirectPath || "/",
              message: t("phoneVerification.login.success"),
            };

          case GqlPhoneUserStatus.ExistingDifferentCommunity:
            const updatedUserCross = await updateAuthState();
            
            // Defensive: handle case where updateAuthState returns null
            if (!updatedUserCross) {
              logger.warn("[AUTH] useCodeVerification: updateAuthState returned null (ExistingDifferentCommunity)", {
                status: GqlPhoneUserStatus.ExistingDifferentCommunity,
                component: "useCodeVerification",
              });
              setAuthState({ isAuthInProgress: false });
              return {
                success: false,
                error: {
                  message: t("phoneVerification.errors.generic"),
                  type: "auth-state-update-failed",
                },
              };
            }
            
            setAuthState({ authenticationState: "user_registered", isAuthInProgress: false });
            const crossCommunityRedirectPath = authRedirectService.getRedirectPath(
              "/" as RawURIComponent,
              nextParam as RawURIComponent,
              updatedUserCross,
            );
            return {
              success: true,
              redirectPath: crossCommunityRedirectPath || "/",
              message: t("phoneVerification.membership.added"),
            };

          default:
            setAuthState({ isAuthInProgress: false });
            return {
              success: false,
              error: {
                message: t("phoneVerification.errors.generic"),
                type: "unknown-status",
              },
            };
        }
      } catch (error) {
        logFirebaseError(
          error,
          "[useCodeVerification] Verification failed",
          {
            component: "useCodeVerification",
          }
        );
        setAuthState({ isAuthInProgress: false });
        return {
          success: false,
          error: {
            message: t("phoneVerification.actions.restartFromPhone"),
            type: "verification-failed",
          },
        };
      }finally {
        setIsVerifying(false);
      }
    },
    [
      t,
      phoneAuth,
      identityCheckPhoneUser,
      authRedirectService,
      nextParam,
      updateAuthState,
      isVerifying,
    ],
  );

  return {
    verify,
    isVerifying,
  };
}
