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
import logger from "./logging";
import { 
  createAuthLogContext, 
  generateRequestId, 
  startOperation, 
  endOperation,
  maskUserId 
} from "./auth/logging-utils";

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
  const requestId = generateRequestId();
  const op = startOperation("GraphQLRequest");
  const sessionId = operation.getContext().sessionId || 'unknown_session';
  
  logger.debug("GraphQLRequestStart", createAuthLogContext(
    sessionId,
    "general",
    op.getContext({
      event: "GraphQLRequestStart",
      component: "Backend",
      requestId,
      operation: operation.operationName
    })
  ));
  
  // SSR 環境では document は存在しない
  if (typeof document === "undefined") {
    // SSRではトークン系は不要（または別途 next/headers などで付与）
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID,
        "X-Request-ID": requestId
      },
    }));
    return forward(operation).map((response) => {
      logger.debug("GraphQLRequestComplete", createAuthLogContext(
        sessionId,
        "general",
        endOperation(op.startTime, op.operationId, {
          component: "Backend",
          operation: operation.operationName,
          status: response.errors?.length ? "error" : "success",
          environment: "server"
        })
      ));
      return response;
    });
  }

  const lineTokens = TokenManager.getLineTokens();
  const phoneTokens = TokenManager.getPhoneTokens();

  operation.setContext(({ headers = {} }) => {
    const requestHeaders = {
      ...headers,
      Authorization: lineTokens.accessToken ? `Bearer ${lineTokens.accessToken}` : "",
      "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID,
      "X-Refresh-Token": lineTokens.refreshToken || "",
      "X-Token-Expires-At": lineTokens.expiresAt ? lineTokens.expiresAt.toString() : "",
      "X-Phone-Auth-Token": phoneTokens.accessToken || "",
      "X-Phone-Refresh-Token": phoneTokens.refreshToken || "",
      "X-Phone-Token-Expires-At": phoneTokens.expiresAt ? phoneTokens.expiresAt.toString() : "",
      "X-Request-ID": requestId,
      "X-Session-ID": sessionId
    };
    
    if (operation.operationName === 'userSignUp') {
      logger.info("UserSignUpStart", createAuthLogContext(
        sessionId,
        "general", 
        op.getContext({
          event: "FirebaseLinkAccountStart",
          component: "Backend",
          requestId,
          operation: "userSignUp",
          hasLineToken: !!lineTokens.accessToken,
          hasPhoneToken: !!phoneTokens.accessToken,
          tokenExpiryInfo: {
            lineExpiresAt: lineTokens.expiresAt ? lineTokens.expiresAt.toString() : "",
            phoneExpiresAt: phoneTokens.expiresAt ? phoneTokens.expiresAt.toString() : "",
          }
        })
      ));
    }
    
    return { headers: requestHeaders };
  });

  return forward(operation).map((response) => {
    if (operation.operationName === 'userSignUp') {
      const eventName = response.errors?.length ? "FirebaseLinkAccountError" : "FirebaseLinkAccountSuccess";
      const logLevel = response.errors?.length ? "error" : "info";
      
      logger[logLevel](eventName, createAuthLogContext(
        sessionId,
        "general",
        op.getContext({
          event: eventName,
          component: "Backend",
          requestId,
          operation: operation.operationName,
          status: response.errors?.length ? "error" : "success",
          userId: response.data?.userSignUp?.id ? maskUserId(response.data.userSignUp.id) : undefined,
          error: response.errors?.length ? response.errors[0].message : undefined,
          errorCode: response.errors?.length ? response.errors[0].extensions?.code : undefined
        })
      ));
    } else {
      logger.debug("GraphQLRequestComplete", createAuthLogContext(
        sessionId,
        "general",
        endOperation(op.startTime, op.operationId, {
          component: "Backend",
          operation: operation.operationName,
          status: response.errors?.length ? "error" : "success",
          environment: "client"
        })
      ));
    }
    
    return response;
  });
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  const context = operation.getContext();
  const sessionId = context.sessionId || 'unknown_session';
  const requestId = generateRequestId();
  const op = startOperation("GraphQLOperation");
  
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      const isAuthError = error.message.includes("Authentication required") ||
        error.message.includes("Invalid token") ||
        error.message.includes("Token expired") ||
        error.message.includes("Unauthorized");
      
      logger.info(
        isAuthError ? "AuthenticationError" : "GraphQLError", 
        createAuthLogContext(
          sessionId,
          "general",
          op.getContext({
            event: isAuthError ? "CustomTokenRequestError" : "GraphQLError",
            component: "Backend",
            requestId,
            errorCode: error.extensions?.code || "unknown_graphql_error",
            error: error.message,
            locations: error.locations,
            path: error.path,
            extensions: error.extensions,
            operation: operation.operationName
          })
        )
      );

      if (isAuthError) {
        logger.info("TokenExpired", createAuthLogContext(
          sessionId,
          "general",
          op.getContext({
            event: "TokenExpired",
            component: "Backend",
            requestId,
            operation: operation.operationName,
            source: "graphql",
            message: error.message
          })
        ));
        
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
    const isServerError = "statusCode" in networkError && networkError.statusCode >= 500;
    const isAuthError = "statusCode" in networkError && networkError.statusCode === 401;
    const logLevel = isServerError ? "error" : "info";
    
    logger[logLevel](
      isAuthError ? "NetworkAuthError" : "NetworkError", 
      createAuthLogContext(
        sessionId,
        "general",
        op.getContext({
          event: isAuthError ? "CustomTokenRequestError" : "NetworkError",
          component: "Backend",
          requestId,
          errorCode: "statusCode" in networkError ? `http_${networkError.statusCode}` : "network_error",
          error: networkError.message,
          statusCode: "statusCode" in networkError ? networkError.statusCode : undefined,
          networkErrorType: networkError.name,
          operation: operation.operationName,
          retryable: isServerError || !isAuthError
        })
      )
    );

    if (isAuthError) {
      logger.info("TokenExpired", createAuthLogContext(
        sessionId,
        "general",
        op.getContext({
          event: "TokenExpired",
          component: "Backend",
          requestId,
          operation: operation.operationName,
          source: "network",
          status: 401
        })
      ));
      
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("auth:token-expired", {
            detail: { source: "network", status: 401 },
          }),
        );
      }
    }
  }
  
  logger.debug("GraphQL operation completed", createAuthLogContext(
    sessionId,
    "general",
    endOperation(op.startTime, op.operationId, {
      component: "Backend",
      operation: operation.operationName,
      status: graphQLErrors?.length || networkError ? "error" : "success"
    })
  ));
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
