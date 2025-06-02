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
import { createAuthLogContext, generateSessionId } from "./logging/client/utils";

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

  return new Observable(observer => {
    (async () => {
      try {
        const { lineAuth } = await import("./auth/firebase-config");
        const phoneTokens = TokenManager.getPhoneTokens();

        let firebaseToken = null;
        if (lineAuth.currentUser) {
          try {
            firebaseToken = await lineAuth.currentUser.getIdToken();
          } catch (error) {
            clientLogger.info('Failed to get Firebase token', createAuthLogContext(
              generateSessionId(),
              "general",
              {
                error: error instanceof Error ? error.message : String(error),
                component: 'ApolloRequestLink',
                operation: operation.operationName
              }
            ));
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

            return { headers: requestHeaders };
          }
          return { headers: baseHeaders };
        });

        const activitiesOperations = ['getOpportunities', 'getOpportunity'];
        
        const getComponentContext = (operationName: string, variables: any) => {
          const context: any = {
            operation: operationName
          };

          if (operationName === 'getOpportunities') {
            if (variables?.filter?.category === 'ACTIVITY') {
              context.component = 'useActivities';
            } else if (variables?.filter?.stateCodes?.length > 0) {
              context.component = 'useSameStateActivities';
              context.stateCode = variables.filter.stateCodes[0];
            } else {
              context.component = 'useActivities';
            }
          } else if (operationName === 'getOpportunity') {
            context.component = 'useOpportunityDetail';
            context.opportunityId = variables?.id;
          }

          return context;
        };

        if (activitiesOperations.includes(operation.operationName || '')) {
          const startContext = getComponentContext(operation.operationName || '', operation.variables);
          clientLogger.info('GraphQL operation started', startContext);
        }

        forward(operation).subscribe({
          next: (result) => {
            if (activitiesOperations.includes(operation.operationName || '')) {
              const metadata = getComponentContext(operation.operationName || '', operation.variables);

              if (operation.operationName === 'getOpportunities' && result.data?.opportunities) {
                metadata.totalCount = result.data.opportunities.totalCount;
                metadata.resultCount = result.data.opportunities.edges?.length || 0;
                
                if (operation.variables?.filter?.stateCodes?.length > 0) {
                  metadata.stateCode = operation.variables.filter.stateCodes[0];
                }
              } else if (operation.operationName === 'getOpportunity' && result.data?.opportunity) {
                metadata.hasData = !!result.data.opportunity;
                metadata.opportunityId = operation.variables?.id;
              }

              clientLogger.info('GraphQL operation completed', metadata);
            }
            observer.next(result);
          },
          error: (error) => {
            if (activitiesOperations.includes(operation.operationName || '')) {
              const errorContext = getComponentContext(operation.operationName || '', operation.variables);
              errorContext.error = error.message || String(error);
              
              clientLogger.error('GraphQL operation failed', errorContext);
            }
            observer.error(error);
          },
          complete: () => observer.complete()
        });
      } catch (error) {
        clientLogger.error('Error in requestLink', {
          error: error instanceof Error ? error.message : String(error),
          component: 'ApolloRequestLink',
          operation: operation.operationName
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

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      clientLogger.info('GraphQL error', createAuthLogContext(
        generateSessionId(),
        "general",
        {
          message: error.message,
          locations: error.locations,
          path: error.path,
          component: 'ApolloErrorLink',
          operation: operation.operationName
        }
      ));

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
      clientLogger.info('Network authentication error', createAuthLogContext(
        generateSessionId(),
        "general",
        {
          error: networkError.message || String(networkError),
          statusCode: networkError.statusCode,
          component: 'ApolloErrorLink',
          operation: operation.operationName
        }
      ));
    } else {
      clientLogger.error('Network error', {
        error: networkError.message || String(networkError),
        component: 'ApolloErrorLink',
        operation: operation.operationName
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
