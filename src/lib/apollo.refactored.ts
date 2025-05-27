import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { COMMUNITY_ID } from "@/utils";
import { tokenService } from "@/services/TokenService";

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      console.error(
        `[GraphQL error]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`,
        err,
      );

      if (
        err.extensions?.code === "UNAUTHENTICATED" ||
        err.message.includes("not authenticated") ||
        err.message.includes("token") ||
        err.message.includes("auth")
      ) {
        console.warn("Authentication error detected in GraphQL response");
        
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("auth:error", {
              detail: {
                source: "graphql",
                errorType: "auth",
                errorMessage: "認証情報が無効です。再ログインしてください。",
                originalError: err,
              },
            }),
          );
        }
      }
    }
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("auth:error", {
          detail: {
            source: "network",
            errorType: "network",
            errorMessage: "ネットワーク接続に問題が発生しました。インターネット接続を確認してください。",
            originalError: networkError,
          },
        }),
      );
    }
  }

  return forward(operation);
});

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  const authHeaders = tokenService.getAuthorizationHeaders();
  
  return {
    headers: {
      ...headers,
      ...authHeaders,
      "X-Civicship-Community-Id": COMMUNITY_ID,
    },
  };
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
  ssrMode: typeof window === "undefined",
});

if (typeof window !== "undefined") {
  setInterval(() => {
    if (tokenService.isTokenExpired()) {
      console.log("Token expired, dispatching event");
      window.dispatchEvent(new Event("auth:token-expired"));
    }
  }, 60000); // 1分ごとにチェック
}

export default apolloClient;
