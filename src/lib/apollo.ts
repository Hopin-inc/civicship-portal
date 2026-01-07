import {
  ApolloClient,
  ApolloClientOptions,
  ApolloLink,
  NormalizedCacheObject,
} from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";
import { relayStylePagination } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

import { logger } from "@/lib/logging";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { setContext } from "@apollo/client/link/context";
import { getRuntimeCommunityId, getCurrentCommunityFirebaseTenantId } from "@/lib/communities/communityIds";

const httpLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_API_ENDPOINT,
  credentials: "include",
  headers: {
    "Apollo-Require-Preflight": "true",
  },
});

const requestLink = setContext(async (operation, prevContext) => {
  const isBrowser = typeof window !== "undefined";
  let token: string | null = null;
  // Default: Server uses session mode, browser tries id_token first
  let authMode: "session" | "id_token" = isBrowser ? "id_token" : "session";

  if (isBrowser) {
    const { firebaseUser, authenticationState } = useAuthStore.getState().state;

    // Mutation の場合は認証を厳格にチェック
    const isMutation = operation.query.definitions.some(
      (def) => def.kind === "OperationDefinition" && def.operation === "mutation"
    );

    if (isMutation) {
      if (authenticationState === "loading") {
        throw new Error("認証情報を読み込み中です。少し待ってから再度お試しください");
      }

      if (!firebaseUser) {
        throw new Error("認証情報が取得できませんでした。ページをリロードしてください");
      }
    }

    // firebaseUser がある場合はトークンを取得
    // IMPORTANT: Only use the token if the Firebase user's tenant matches the current community's tenant.
    // This prevents cross-community auth bleed where a token from community A is sent to community B.
    if (firebaseUser) {
      const currentCommunityTenantId = getCurrentCommunityFirebaseTenantId();
      const firebaseUserTenantId = firebaseUser.tenantId;
      
      // Check if tenant matches (null tenantId means no multi-tenant, which is fine)
      const tenantMatches = !currentCommunityTenantId || 
                           !firebaseUserTenantId || 
                           currentCommunityTenantId === firebaseUserTenantId;
      
      if (tenantMatches) {
        try {
          token = await firebaseUser.getIdToken();
        } catch (error) {
          logger.warn("Failed to get ID token", { error });
          if (isMutation) {
            throw new Error("認証トークンの取得に失敗しました");
          }
        }
      } else {
        // Tenant mismatch - don't use this token for the current community
        logger.info("[Apollo] Firebase user tenant mismatch, not using token", {
          operationName: operation.operationName,
          firebaseUserTenantId,
          currentCommunityTenantId,
          isMutation,
        });
        
        if (isMutation) {
          throw new Error("別のコミュニティでログイン中です。このコミュニティで再度ログインしてください");
        }
      }
    } else {
      // Query実行時にfirebaseUserがない場合を記録
      logger.info("GraphQL request without firebase user", {
        operationName: operation.operationName,
        isMutation,
        authenticationState,
      });
    }

    // IMPORTANT: If we couldn't get a Bearer token in the browser,
    // fall back to session mode so the server will use the session cookie.
    // Without this, the server ignores cookies when X-Auth-Mode is "id_token"
    // (see extractAuthHeaders.ts: idToken = authMode === "session" ? sessionCookie : bearer)
    if (!token) {
      authMode = "session";
      logger.debug("[Apollo] No Bearer token available, falling back to session mode", {
        hasFirebaseUser: !!firebaseUser,
        operation: operation.operationName,
      });
    }
  }

  // Get communityId at runtime from URL path or cookie (browser) or env var (server)
  const communityId = getRuntimeCommunityId();
  
  // Get the current community's Firebase tenant ID at runtime
  // This is set by CommunityConfigProvider when the config is loaded
  const runtimeTenantId = getCurrentCommunityFirebaseTenantId() || process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID;

  const headers = {
    ...prevContext.headers,
    // Only send Authorization header when we have a token
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "X-Auth-Mode": authMode,
    "X-Civicship-Tenant": runtimeTenantId,
    "X-Community-Id": communityId,
  };

  return { headers };
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      logger.warn("GraphQL error", {
        message: error.message,
        locations: error.locations,
        path: error.path,
        component: "ApolloErrorLink",
        operation: operation.operationName,
      });

      if (
        error.message.includes("Authentication required") ||
        error.message.includes("Invalid token") ||
        error.message.includes("Token expired") ||
        error.message.includes("Unauthorized")
      ) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("auth:token-expired", {
              detail: { source: "graphql", message: error.message },
            }),
          );
        }
      }
    }
  }

  if (networkError) {
    if ("statusCode" in networkError && networkError.statusCode === 401) {
      logger.warn("Network authentication error", {
        error: networkError.message || String(networkError),
        statusCode: networkError.statusCode,
        component: "ApolloErrorLink",
        operation: operation.operationName,
      });
    } else {
      const errorMessage = networkError.message || String(networkError);
      const isTemporaryNetworkIssue =
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("Load failed") ||
        errorMessage.includes("Network request failed");

      if (isTemporaryNetworkIssue) {
        logger.warn("Network connectivity issue", {
          error: errorMessage,
          component: "ApolloErrorLink",
          operation: operation.operationName,
          errorCategory: "network_temporary",
          retryable: true,
        });
      } else {
        logger.warn("Network system error", {
          error: errorMessage,
          component: "ApolloErrorLink",
          operation: operation.operationName,
          errorCategory: "system_error",
        });
      }
    }

    if ("statusCode" in networkError && networkError.statusCode === 401) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("auth:token-expired", {
            detail: { source: "network", status: 401 },
          }),
        );
      }
    }
  }
});

const link = ApolloLink.from([requestLink, errorLink, httpLink]);

const defaultOptions: ApolloClientOptions<NormalizedCacheObject> = {
  link,
  ssrMode: true,
  cache: new InMemoryCache({
    typePolicies: {
      Wallet: {
        fields: {
          transactionsConnection: relayStylePagination(),
        },
      },
    },
  }),
};

export const apolloClient = new ApolloClient(defaultOptions);
