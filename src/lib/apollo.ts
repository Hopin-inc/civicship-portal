import {
  ApolloClient,
  ApolloClientOptions,
  ApolloLink,
  NormalizedCacheObject,
} from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";
import { onError } from "@apollo/client/link/error";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

import { logger } from "@/lib/logging";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { setContext } from "@apollo/client/link/context";
import { getEnvAuthConfig, getEnvCommunityId, getAuthForCommunity } from "@/lib/communities/runtime-auth";
import type { CommunityId } from "@/lib/communities/runtime-auth";

function buildRequestLink(tenantId: string, communityId: string) {
  return setContext(async (operation, prevContext) => {
    let token: string | null = null;
    let authMode: "session" | "id_token" = "session";

    if (typeof window !== "undefined") {
      const { firebaseUser } = useAuthStore.getState().state;

      if (firebaseUser) {
        try {
          token = await firebaseUser.getIdToken();
          authMode = "id_token";
        } catch (error) {
          logger.warn("Failed to get ID token, falling back to session", { error });
        }
      }
    }

    const headers = {
      ...prevContext.headers,
      Authorization: token ? `Bearer ${token}` : "",
      "X-Auth-Mode": authMode,
      "X-Civicship-Tenant": tenantId,
      "X-Community-Id": communityId,
    };

    return { headers };
  });
}

const envCommunityId = getEnvCommunityId();
const envAuth = getEnvAuthConfig();
const fallback = envCommunityId ? getAuthForCommunity(envCommunityId) : undefined;
const staticTenantId = envAuth.tenantId ?? fallback?.tenantId ?? "";
const staticCommunityId = envCommunityId ?? "";

const httpLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_API_ENDPOINT,
  credentials: "include",
  headers: {
    "Apollo-Require-Preflight": "true",
  },
});

const requestLink = buildRequestLink(staticTenantId, staticCommunityId);

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      logger.info("GraphQL error", {
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
      logger.info("Network authentication error", {
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
        logger.error("Network system error", {
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
  cache: new InMemoryCache(),
};

export const apolloClient = new ApolloClient(defaultOptions);

export function createApolloClient(options: {
  communityId: string;
  tenantId: string;
  apiEndpoint: string;
}): ApolloClient<NormalizedCacheObject> {
  const { communityId, tenantId, apiEndpoint } = options;

  const httpLink = createUploadLink({
    uri: apiEndpoint,
    credentials: "include",
    headers: {
      "Apollo-Require-Preflight": "true",
    },
  });

  const requestLink = buildRequestLink(tenantId, communityId);
  const link = ApolloLink.from([requestLink, errorLink, httpLink]);

  return new ApolloClient({
    link,
    ssrMode: true,
    cache: new InMemoryCache(),
  });
}
