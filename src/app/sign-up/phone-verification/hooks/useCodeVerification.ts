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

/**
 * Wait for firebaseUser to be available in the auth store.
 * This is needed because initAuthFast hydrates firebaseUser asynchronously in the background,
 * and we need it to be available before making authenticated GraphQL mutations.
 * 
 * @param maxWaitMs Maximum time to wait in milliseconds (default: 5000ms)
 * @param pollIntervalMs Polling interval in milliseconds (default: 100ms)
 * @returns true if firebaseUser became available, false if timeout
 */
async function waitForFirebaseUser(maxWaitMs = 5000, pollIntervalMs = 100): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitMs) {
    const { firebaseUser } = useAuthStore.getState().state;
    if (firebaseUser) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }
  
  return false;
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
      
      // Helper function to handle updateAuthState returning null
      const handleUpdateAuthStateNull = (
        status: GqlPhoneUserStatus,
      ): CodeVerificationResult => {
        logger.warn("[AUTH] useCodeVerification: updateAuthState returned null", {
          status,
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
      };
      setAuthState({ isAuthInProgress: true });

      try {
        const success = await phoneAuth.verifyPhoneCode(verificationCode);
        const phoneUid = useAuthStore.getState().phoneAuth.phoneUid;

        if (!success || !phoneUid) {
          logger.debug("[useCodeVerification] Invalid code or missing phoneUid", {
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

        // Wait for firebaseUser to be available before making authenticated GraphQL mutation
        // This is needed because initAuthFast hydrates firebaseUser asynchronously in the background
        const hasFirebaseUser = await waitForFirebaseUser();
        
        logger.debug("[useCodeVerification] Calling identityCheckPhoneUser", {
          component: "useCodeVerification",
          phoneUid: phoneUid?.slice(-6),
          hasFirebaseUser,
          pathname: typeof window !== "undefined" ? window.location.pathname : "server",
        });

        if (!hasFirebaseUser) {
          logger.warn("[useCodeVerification] Firebase user not available after waiting", {
            component: "useCodeVerification",
          });
          // Continue anyway - the mutation might work without auth if backend allows it
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
              return handleUpdateAuthStateNull(GqlPhoneUserStatus.ExistingSameCommunity);
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
              return handleUpdateAuthStateNull(GqlPhoneUserStatus.ExistingDifferentCommunity);
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
        // Enhanced error logging to identify the exact failure point
        const apolloError = error as any;
        logger.error("[useCodeVerification] Verification failed with exception", {
          component: "useCodeVerification",
          errorMessage: apolloError?.message,
          errorName: apolloError?.name,
          graphQLErrors: apolloError?.graphQLErrors?.map((e: any) => ({
            message: e.message,
            path: e.path,
            extensions: e.extensions,
          })),
          networkError: apolloError?.networkError ? {
            message: apolloError.networkError.message,
            statusCode: apolloError.networkError.statusCode,
            name: apolloError.networkError.name,
          } : null,
          communityId: typeof window !== "undefined" ? window.location.pathname : "server",
        });
        
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
      } finally {
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
