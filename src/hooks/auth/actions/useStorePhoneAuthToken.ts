import { useCallback } from "react";
import { useMutation } from "@apollo/client";
import { STORE_PHONE_AUTH_TOKEN } from "@/graphql/account/identity/mutation";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { logger } from "@/lib/logging";
import {
  GqlStorePhoneAuthTokenPayload,
  GqlMutationStorePhoneAuthTokenArgs,
} from "@/types/graphql";

export const useStorePhoneAuthToken = () => {
  const [storePhoneAuthTokenMutation, { loading, error }] = useMutation<
    { storePhoneAuthToken: GqlStorePhoneAuthTokenPayload },
    GqlMutationStorePhoneAuthTokenArgs
  >(STORE_PHONE_AUTH_TOKEN);

  const storeTokens = useCallback(async (): Promise<{ success: boolean }> => {
    const { phoneAuth } = useAuthStore.getState();
    const { phoneUid, phoneTokens } = phoneAuth;

    if (
      !phoneUid ||
      !phoneTokens?.accessToken ||
      !phoneTokens?.refreshToken ||
      !phoneTokens?.expiresAt
    ) {
      logger.warn("[useStorePhoneAuthToken] Missing required phone auth data", {
        hasPhoneUid: !!phoneUid,
        hasAccessToken: !!phoneTokens?.accessToken,
        hasRefreshToken: !!phoneTokens?.refreshToken,
        hasExpiresAt: !!phoneTokens?.expiresAt,
      });
      return { success: false };
    }

    // expiresAt (timestamp string) → expiresIn (seconds)
    const expiresIn = Math.floor((Number(phoneTokens.expiresAt) - Date.now()) / 1000);

    try {
      const result = await storePhoneAuthTokenMutation({
        variables: {
          input: {
            phoneUid,
            authToken: phoneTokens.accessToken,
            refreshToken: phoneTokens.refreshToken,
            expiresIn,
          },
        },
      });

      const success = result.data?.storePhoneAuthToken?.success ?? false;

      if (success) {
        logger.info("[useStorePhoneAuthToken] Phone auth token stored successfully");
      } else {
        logger.warn("[useStorePhoneAuthToken] Failed to store phone auth token");
      }

      return { success };
    } catch (err) {
      logger.error("[useStorePhoneAuthToken] Error storing phone auth token", {
        error: err instanceof Error ? err.message : String(err),
      });
      return { success: false };
    }
  }, [storePhoneAuthTokenMutation]);

  return { storeTokens, loading, error };
};
