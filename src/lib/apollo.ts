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
  // Determine auth mode based on firebaseUser availability:
  // - Browser with firebaseUser: use id_token mode with Authorization header
  // - Browser without firebaseUser: fallback to session mode (use session cookie)
  // - Server: always use session mode
  let authMode: "session" | "id_token" = "session";

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
    if (firebaseUser) {
      try {
        token = await firebaseUser.getIdToken();
        authMode = "id_token"; // Use id_token mode when Firebase user is available
      } catch (error) {
        logger.warn("Failed to get ID token", { error });
        if (isMutation) {
          throw new Error("認証トークンの取得に失敗しました");
        }
        // Fallback to session mode if token retrieval fails
        authMode = "session";
      }
    } else {
      // Query実行時にfirebaseUserがない場合、sessionモードにフォールバック
      logger.info("GraphQL request without firebase user, using session mode", {
        operationName: operation.operationName,
        isMutation,
        authenticationState,
      });
      authMode = "session"; // Fallback to session mode (will use session cookie)
    }
  }

  const headers = {
    ...prevContext.headers,
    // Only send Authorization header when we have a token
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "X-Auth-Mode": authMode,
    "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID,
    "X-Community-Id": process.env.NEXT_PUBLIC_COMMUNITY_ID,
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
