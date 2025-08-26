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

/**
 * userSignUp操作に必要な電話番号トークンを検証する
 * @param phoneTokens 電話番号トークン情報
 * @param operationName GraphQL操作名
 * @throws {Error} 必要なトークンが不足している場合
 */
function validateUserSignUpTokens(phoneTokens: any, operationName: string): void {
  const missingTokens: string[] = [];
  
  if (!phoneTokens.accessToken) {
    missingTokens.push("X-Phone-Auth-Token");
  }
  
  if (!phoneTokens.phoneUid) {
    missingTokens.push("X-Phone-Uid");
  }
  
  if (missingTokens.length > 0) {
    logger.error("Required phone tokens missing for userSignUp", {
      missingTokens,
      hasPhoneNumber: !!phoneTokens.phoneNumber,
      hasRefreshToken: !!phoneTokens.refreshToken,
      component: "ApolloRequestLink",
      operation: operationName,
      errorCategory: "token_validation",
    });
    
    throw new Error(`Missing required tokens for userSignUp: ${missingTokens.join(", ")}`);
  }
  
  logger.debug("Phone tokens validated for userSignUp", {
    hasPhoneAuthToken: !!phoneTokens.accessToken,
    hasPhoneUid: !!phoneTokens.phoneUid,
    hasPhoneNumber: !!phoneTokens.phoneNumber,
    hasRefreshToken: !!phoneTokens.refreshToken,
    component: "ApolloRequestLink",
    operation: operationName,
  });
}

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

          const tokenRequiredOperations = ["userSignUp", "linkPhoneAuth", "storePhoneAuthToken", "identityCheckPhoneUser"];

          if (tokenRequiredOperations.includes(operation.operationName || "")) {
            if (operation.operationName === "userSignUp") {
              validateUserSignUpTokens(phoneTokens, operation.operationName);
            }

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
      const errorMessage = networkError.message || String(networkError);
      const isTemporaryNetworkIssue = errorMessage.includes("Failed to fetch") || 
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
  cache: new InMemoryCache({
    resultCaching: false,
  }),
};

export const apolloClient = new ApolloClient(defaultOptions);
