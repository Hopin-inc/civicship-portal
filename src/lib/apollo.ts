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
import clientLogger from "./logging/client";

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
  if (typeof document === "undefined") {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID,
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
            clientLogger.error("GraphQL: token fetch failed", {
              component: "ApolloRequestLink",
              operation: operation.operationName,
              message: error instanceof Error ? error.message : String(error),
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
          };

          const tokenRequiredOperations = ["userSignUp", "linkPhoneAuth", "storePhoneAuthToken"];
          if (tokenRequiredOperations.includes(operation.operationName || "")) {
            return {
              headers: {
                ...baseHeaders,
                "X-Token-Expires-At": lineTokens.expiresAt?.toString() || "",
                "X-Phone-Auth-Token": phoneTokens.accessToken || "",
                "X-Phone-Token-Expires-At": phoneTokens.expiresAt?.toString() || "",
                "X-Phone-Uid": phoneTokens.phoneUid || "",
                "X-Phone-Number": phoneTokens.phoneNumber || "",
              },
            };
          }
          return { headers: baseHeaders };
        });

        clientLogger.info("GraphQL: started", {
          component: "ApolloRequestLink",
          operation: operation.operationName,
          phase: "start",
        });

        forward(operation).subscribe({
          next: (result) => {
            clientLogger.info("GraphQL: completed", {
              component: "ApolloRequestLink",
              operation: operation.operationName,
              phase: "complete",
            });
            observer.next(result);
          },
          error: (error) => {
            clientLogger.error("GraphQL: failed", {
              component: "ApolloRequestLink",
              operation: operation.operationName,
              phase: "fail",
              message: error.message || String(error),
            });
            observer.error(error);
          },
          complete: () => observer.complete(),
        });
      } catch (error) {
        clientLogger.error("GraphQL: requestLink unexpected error", {
          component: "ApolloRequestLink",
          operation: operation.operationName,
          phase: "fail",
          message: error instanceof Error ? error.message : String(error),
        });

        const lineTokens = TokenManager.getLineTokens();
        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            Authorization: lineTokens.accessToken ? `Bearer ${lineTokens.accessToken}` : "",
            "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID,
          },
        }));

        forward(operation).subscribe(observer);
      }
    })();
  });
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      clientLogger.error("GraphQL: errorLink GraphQL error", {
        component: "ApolloErrorLink",
        operation: operation.operationName,
        message: error.message,
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
    clientLogger.error("GraphQL: errorLink Network error", {
      component: "ApolloErrorLink",
      operation: operation.operationName,
      message: networkError.message || String(networkError),
      statusCode: "statusCode" in networkError ? networkError.statusCode : undefined,
    });

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
