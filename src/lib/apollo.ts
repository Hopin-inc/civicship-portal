import {
  ApolloClient,
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { __DEV__ } from "@apollo/client/utilities/globals";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { TokenManager } from "./auth/token-manager";

import { logger } from "@/lib/logging";

if (__DEV__) {
  loadDevMessages();
  loadErrorMessages();
}

const httpLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_API_ENDPOINT,
  credentials: "same-origin",
  headers: {
    "Apollo-Require-Preflight": "true",
  },
});

const requestLink = new ApolloLink((operation, forward) => {
  // SSR 環境では document は存在しない
  if (typeof document === "undefined") {
    // SSRではトークン系は不要（または別途 next/headers などで付与）
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID,
        "X-Community-Id": process.env.NEXT_PUBLIC_COMMUNITY_ID,
      },
    }));
    return forward(operation);
  }

  return new Observable((observer) => {
    (async () => {
      try {
        const { lineAuth } = await import("./auth/firebase-config");
        const phoneTokens = TokenManager.getPhoneTokens();

        let firebaseToken = null;
        if (lineAuth.currentUser) {
          try {
            firebaseToken = await lineAuth.currentUser.getIdToken();
          } catch (error) {
            logger.info("Failed to get Firebase token", {
              error: error instanceof Error ? error.message : String(error),
              component: "ApolloRequestLink",
              operation: operation.operationName,
            });
          }
        }

        const lineTokens = TokenManager.getLineTokens();
        const accessToken = firebaseToken || lineTokens.accessToken;

        operation.setContext(({ headers = {} }) => {
          const baseHeaders = {
            ...headers,
            Authorization: accessToken ? `Bearer ${accessToken}` : "",
            "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID,
            "X-Community-Id": process.env.NEXT_PUBLIC_COMMUNITY_ID,
          };

          const tokenRequiredOperations = ["userSignUp", "linkPhoneAuth", "storePhoneAuthToken"];

          if (tokenRequiredOperations.includes(operation.operationName || "")) {
            const requestHeaders = {
              ...baseHeaders,
              "X-Token-Expires-At": lineTokens.expiresAt ? lineTokens.expiresAt.toString() : "",
              "X-Phone-Auth-Token": phoneTokens.accessToken || "",
              "X-Phone-Token-Expires-At": phoneTokens.expiresAt
                ? phoneTokens.expiresAt.toString()
                : "",
              "X-Phone-Uid": phoneTokens.phoneUid || "",
              "X-Phone-Number": phoneTokens.phoneNumber || "",
            };

            return { headers: requestHeaders };
          }
          return { headers: baseHeaders };
        });

        forward(operation).subscribe(observer);
      } catch (error) {
        logger.error("Error in requestLink", {
          error: error instanceof Error ? error.message : String(error),
          component: "ApolloRequestLink",
          operation: operation.operationName,
        });
        const lineTokens = TokenManager.getLineTokens();

        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            Authorization: lineTokens.accessToken ? `Bearer ${lineTokens.accessToken}` : "",
            "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID,
            "X-Community-Id": process.env.NEXT_PUBLIC_COMMUNITY_ID,
          },
        }));

        forward(operation).subscribe(observer);
      }
    })();
  });
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
      logger.error("Network error", {
        error: networkError.message || String(networkError),
        component: "ApolloErrorLink",
        operation: operation.operationName,
      });
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
    resultCaching: false,
  }),
};

export const apolloClient = new ApolloClient(defaultOptions);
