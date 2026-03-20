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
import { getCommunityIdClient } from "@/lib/community/get-community-id-client";

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
  let authMode: "session" | "id_token" = "session";

  if (isBrowser) {
    const { firebaseUser, lineTokens, authenticationState } = useAuthStore.getState().state;

    // lineTokens.idToken の有効期限チェック（Firebase ID token は1時間で失効）
    const isLineTokenValid =
      !!lineTokens.idToken &&
      !!lineTokens.expiresAt &&
      Number(lineTokens.expiresAt) > Date.now();

    // id_token モードは firebaseUser か有効な lineTokens.idToken がある場合のみ
    // それ以外はセッションCookieを使う session モードにフォールバック
    authMode = firebaseUser || isLineTokenValid ? "id_token" : "session";

    // Mutation の場合は認証を厳格にチェック
    const isMutation = operation.query.definitions.some(
      (def) => def.kind === "OperationDefinition" && def.operation === "mutation",
    );

    if (isMutation) {
      if (authenticationState === "loading") {
        throw new Error("認証情報を読み込み中です。少し待ってから再度お試しください");
      }

      // id_token モードで認証情報がない場合はエラー
      // session モードの場合はセッションCookieで認証するためここではエラーにしない
      if (authMode === "id_token" && !firebaseUser && !isLineTokenValid) {
        throw new Error("認証情報が取得できませんでした。ページをリロードしてください");
      }
    }

    // id_token モードのときのみトークンを取得
    if (authMode === "id_token") {
      if (firebaseUser) {
        try {
          token = await firebaseUser.getIdToken();
        } catch (error) {
          logger.warn("Failed to get ID token", { error });
          if (isMutation) {
            throw new Error("認証トークンの取得に失敗しました");
          }
        }
      } else if (isLineTokenValid) {
        // Server-side exchange 経由: firebaseUser なし → exchange で取得した有効な idToken を使用
        token = lineTokens.idToken;
      }
    }
  }

  // Community ID の取得（Client Side のみ）
  const communityId = isBrowser ? getCommunityIdClient() : null;

  if (isBrowser && !communityId) {
    logger.warn("[Apollo] X-Community-Id is empty on client-side request", {
      operationName: operation.operationName,
      communityId,
      component: "ApolloRequestLink",
    });
  } else {
    logger.debug("[Apollo] Request context", {
      operationName: operation.operationName,
      communityId,
      isBrowser,
      hasToken: !!token,
      authMode,
      component: "ApolloRequestLink",
    });
  }

  const headers = {
    ...prevContext.headers,
    // Only send Authorization header when we have a token
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "X-Auth-Mode": authMode,
    "X-Community-Id": communityId ?? "",
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
