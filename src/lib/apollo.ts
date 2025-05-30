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
import { TokenManager } from "./auth/token-manager";

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

  return new Promise(async (resolve) => {
    try {
      const { lineAuth } = await import("./auth/firebase-config");
      const phoneTokens = TokenManager.getPhoneTokens();
      
      let firebaseToken = null;
      if (lineAuth.currentUser) {
        try {
          firebaseToken = await lineAuth.currentUser.getIdToken();
        } catch (error) {
          console.warn('Failed to get Firebase token:', error);
        }
      }
      
      const lineTokens = TokenManager.getLineTokens();
      const accessToken = firebaseToken || lineTokens.accessToken;

      operation.setContext(({ headers = {} }) => {
        const baseHeaders = {
          ...headers,
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
          "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID,
        };

        const tokenRequiredOperations = ['userSignUp', 'linkPhoneAuth', 'storePhoneAuthToken'];
        
        if (tokenRequiredOperations.includes(operation.operationName || '')) {
          const requestHeaders = {
            ...baseHeaders,
            "X-Token-Expires-At": lineTokens.expiresAt ? lineTokens.expiresAt.toString() : "",
            "X-Phone-Auth-Token": phoneTokens.accessToken || "",
            "X-Phone-Token-Expires-At": phoneTokens.expiresAt ? phoneTokens.expiresAt.toString() : "",
            "X-Phone-Uid": phoneTokens.phoneUid || "",
            "X-Phone-Number": phoneTokens.phoneNumber || "",
          };
          
          console.log('🔐 Sending phone auth tokens for operation:', operation.operationName, {
            hasPhoneToken: !!phoneTokens.accessToken,
            hasPhoneUid: !!phoneTokens.phoneUid,
            hasPhoneNumber: !!phoneTokens.phoneNumber,
            tokenSource: firebaseToken ? 'firebase' : 'cookie'
          });
          
          return { headers: requestHeaders };
        }
        
        console.log('🔒 Sending tokens for operation:', operation.operationName, {
          tokenSource: firebaseToken ? 'firebase' : 'cookie',
          hasToken: !!accessToken
        });
        return { headers: baseHeaders };
      });

      resolve(forward(operation));
    } catch (error) {
      console.error('Error in requestLink:', error);
      const lineTokens = TokenManager.getLineTokens();

      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          Authorization: lineTokens.accessToken ? `Bearer ${lineTokens.accessToken}` : "",
          "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID,
        },
      }));

      resolve(forward(operation));
    }
  });
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
