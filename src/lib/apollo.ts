import {
  ApolloClient,
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { __DEV__ } from "@apollo/client/utilities/globals";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { tokenService } from "@/services/TokenService";

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
      },
    }));
    return forward(operation);
  }

  const authHeaders = tokenService.getAuthorizationHeaders();

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...authHeaders,
    },
  }));

  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      console.log(
        `[GraphQL error]: Message: ${error.message}, Location: ${error.locations}, Path: ${error.path}`,
      );

      if (
        error.message.includes("Authentication required") ||
        error.message.includes("Invalid token") ||
        error.message.includes("Token expired") ||
        error.message.includes("Unauthorized")
      ) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("auth:error", {
              detail: { 
                source: "graphql", 
                errorType: "auth",
                errorMessage: "認証情報が無効です。再ログインしてください。",
                originalError: error
              },
            }),
          );
        }
      }
    }
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);

    if ("statusCode" in networkError && networkError.statusCode === 401) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("auth:error", {
            detail: { 
              source: "network", 
              errorType: "auth",
              errorMessage: "認証情報が無効です。再ログインしてください。",
              status: 401 
            },
          }),
        );
      }
    }
  }
  
  return forward(operation);
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
