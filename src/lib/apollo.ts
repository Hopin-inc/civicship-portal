import {
  ApolloClient,
  ApolloClientOptions,
  ApolloLink,
  NormalizedCacheObject,
} from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";
import { onError } from "@apollo/client/link/error";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { TokenManager } from "./auth/core/token-manager";

import { logger } from "@/lib/logging";
import { lineAuth } from "@/lib/auth/core/firebase-config";
import { setContext } from "@apollo/client/link/context";

const httpLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_API_ENDPOINT,
  credentials: "same-origin",
  headers: {
    "Apollo-Require-Preflight": "true",
  },
});

const requestLink = setContext(async (operation, prevContext) => {
  let token: string | null = null;

  if (typeof window !== "undefined") {
    const user = lineAuth.currentUser;
    token = user ? await TokenManager.getCachedToken(user) : null;
  }

  const baseHeaders = {
    ...prevContext.headers,
    Authorization: token ? `Bearer ${token}` : "",
    "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID,
    "X-Community-Id": process.env.NEXT_PUBLIC_COMMUNITY_ID,
  };

  const tokenRequiredOperations = [
    "userSignUp",
    "linkPhoneAuth",
    "storePhoneAuthToken",
    "identityCheckPhoneUser",
  ];

  if (tokenRequiredOperations.includes(operation.operationName || "")) {
    return { headers: { ...baseHeaders } };
  }

  return { headers: baseHeaders };
});

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
