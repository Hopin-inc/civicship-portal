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

// Helper to get communityId from Next.js headers on server-side
// This is used when Apollo client is used in Server Components
async function getServerSideCommunityId(): Promise<string | null> {
  try {
    // Dynamic import to avoid issues with client-side bundling
    const { headers } = await import("next/headers");
    const headersList = await headers();
    const communityId = headersList.get("x-community-id");
    
    // Log for debugging - can be removed after issue is resolved
    if (!communityId) {
      console.log("[Apollo] getServerSideCommunityId: x-community-id header not found in request headers");
    } else {
      console.log("[Apollo] getServerSideCommunityId: found communityId =", communityId);
    }
    
    return communityId;
  } catch (error) {
    // headers() is not available (e.g., during module initialization or in client context)
    console.log("[Apollo] getServerSideCommunityId: headers() not available, error:", error);
    return null;
  }
}

const httpLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_API_ENDPOINT,
  credentials: "include",
  headers: {
    "Apollo-Require-Preflight": "true",
  },
});

// Extract communityId from URL path (first segment after /)
function extractCommunityIdFromPath(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return null;
  }
  const firstSegment = segments[0];
  // Skip if it's a known non-community path
  if (["api", "_next", "favicon.ico"].includes(firstSegment)) {
    return null;
  }
  return firstSegment;
}

// Extract communityId from liff.state parameter (used when LIFF launches at root path)
function extractCommunityIdFromLiffState(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const searchParams = new URLSearchParams(window.location.search);
  const liffState = searchParams.get("liff.state");
  if (!liffState) {
    return null;
  }
  // liff.state contains the target path, e.g., "/neo88/users/me"
  return extractCommunityIdFromPath(liffState);
}

const requestLink = setContext(async (operation, prevContext) => {
  const isBrowser = typeof window !== "undefined";
  let token: string | null = null;
  // Browser uses id_token mode only (session mode is SSR-only via executeServerGraphQLQuery)
  // Server keeps session mode for any server-side Apollo usage
  let authMode: "session" | "id_token" = isBrowser ? "id_token" : "session";
  
  // Extract communityId from current URL path (dynamic multi-tenant routing)
  // Fallback to liff.state parameter when LIFF launches at root path "/"
  // On server-side, try to get communityId from Next.js request headers (set by middleware)
  let communityId: string | null = null;
  if (isBrowser) {
    communityId = extractCommunityIdFromPath(window.location.pathname);
    // When LIFF launches, it starts at "/" with liff.state=/target/path
    // We need to extract communityId from liff.state in this case
    if (!communityId) {
      communityId = extractCommunityIdFromLiffState();
    }
  } else {
    // Server-side: try to get communityId from Next.js request headers
    // This is set by the middleware based on the URL path
    communityId = await getServerSideCommunityId();
  }

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
      } catch (error) {
        logger.warn("Failed to get ID token", { error });
        if (isMutation) {
          throw new Error("認証トークンの取得に失敗しました");
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
  }

  const headers = {
    ...prevContext.headers,
    // Only send Authorization header when we have a token
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "X-Auth-Mode": authMode,
    // Use dynamic communityId from URL path for multi-tenant routing
    ...(communityId ? { "X-Community-Id": communityId } : {}),
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
