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

  // CSR の場合のみ cookie を読み込む
  const cookies = document.cookie.split("; ");
  const accessToken = cookies.find((e) => e.startsWith("access_token"))?.split("=")[1];
  const refreshToken = cookies.find((e) => e.startsWith("refresh_token"))?.split("=")[1];
  const tokenExpiresAt = cookies.find((e) => e.startsWith("token_expires_at"))?.split("=")[1];
  const phoneAuthToken = cookies.find((e) => e.startsWith("phone_auth_token"))?.split("=")[1];
  const phoneRefreshToken = cookies.find((e) => e.startsWith("phone_refresh_token"))?.split("=")[1];
  const phoneTokenExpiresAt = cookies
    .find((e) => e.startsWith("phone_token_expires_at"))
    ?.split("=")[1];

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
      "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID,
      "X-Refresh-Token": refreshToken || "",
      "X-Token-Expires-At": tokenExpiresAt || "",
      "X-Phone-Auth-Token": phoneAuthToken || "",
      "X-Phone-Refresh-Token": phoneRefreshToken || "",
      "X-Phone-Token-Expires-At": phoneTokenExpiresAt || "",
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
            new CustomEvent("auth:token-expired", {
              detail: { source: "graphql", message: error.message },
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
