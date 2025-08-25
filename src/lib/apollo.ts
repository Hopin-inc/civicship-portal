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

// Firebaseトークンのキャッシュ管理
class TokenCache {
  private static instance: TokenCache;
  private firebaseToken: string | null = null;
  private firebaseTokenExpiry: number = 0;
  private readonly TOKEN_CACHE_DURATION = 50 * 60 * 1000; // 50分（Firebaseトークンの有効期限より短く）

  static getInstance(): TokenCache {
    if (!TokenCache.instance) {
      TokenCache.instance = new TokenCache();
    }
    return TokenCache.instance;
  }

  async getFirebaseToken(): Promise<string | null> {
    const now = Date.now();
    
    // キャッシュが有効な場合はキャッシュを返す
    if (this.firebaseToken && now < this.firebaseTokenExpiry) {
      return this.firebaseToken;
    }

    // キャッシュが無効または存在しない場合は新しいトークンを取得
    try {
      const { lineAuth } = await import("./auth/firebase-config");
      if (lineAuth.currentUser) {
        this.firebaseToken = await lineAuth.currentUser.getIdToken();
        this.firebaseTokenExpiry = now + this.TOKEN_CACHE_DURATION;
        return this.firebaseToken;
      }
    } catch (error) {
      logger.info("Failed to get Firebase token", {
        error: error instanceof Error ? error.message : String(error),
        component: "TokenCache",
      });
    }

    return null;
  }

  clearCache(): void {
    this.firebaseToken = null;
    this.firebaseTokenExpiry = 0;
  }
}

const tokenCache = TokenCache.getInstance();

if (__DEV__) {
  loadDevMessages();
  loadErrorMessages();
}

const uploadLink = createUploadLink({
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

        const firebaseToken = await tokenCache.getFirebaseToken();

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

const link = ApolloLink.from([requestLink, errorLink, uploadLink]);

const defaultOptions: ApolloClientOptions<NormalizedCacheObject> = {
  link,
  ssrMode: true,
  cache: new InMemoryCache({
    resultCaching: true,
    typePolicies: {
      Query: {
        fields: {
          currentUser: {
            merge: true, // 結果をマージ
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network", // キャッシュを優先しつつ、バックグラウンドで更新
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "cache-first", // キャッシュを優先
      errorPolicy: "all",
    },
  },
};

export const apolloClient = new ApolloClient(defaultOptions);
