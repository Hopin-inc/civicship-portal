/**
 * Generate a server-safe request ID using Node.js crypto
 */
export const generateRequestId = (): string => {
  if (typeof require !== "undefined") {
    try {
      const crypto = require("crypto");
      return `req_${crypto.randomBytes(6).toString("hex")}`;
    } catch (e) {
      return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate a server-safe session ID
 */
export const generateSessionId = (): string => {
  if (typeof require !== "undefined") {
    try {
      const crypto = require("crypto");
      return `auth_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    } catch (e) {
      return `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }
  return `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Server-safe device info (minimal for server environment)
 */
export const getDeviceInfo = (): Record<string, any> => {
  return { platform: "server" };
};

/**
 * Server-safe network info
 */
export const getNetworkInfo = (): Record<string, any> => {
  return { online: true };
};

/**
 * Mask phone number (shared implementation)
 */
export const maskPhoneNumber = (phoneNumber: string | null | undefined): string => {
  if (!phoneNumber) return "none";
  if (phoneNumber.length <= 4) return "****";
  return "*".repeat(phoneNumber.length - 4) + phoneNumber.slice(-4);
};

/**
 * Mask user ID (shared implementation)
 */
export const maskUserId = (userId: string | null | undefined): string => {
  if (!userId) return "none";
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `user_${Math.abs(hash).toString(36)}`;
};

/**
 * Server-safe operation tracking
 */
export const startOperation = (operationName: string) => {
  const startTime = Date.now();
  const operationId = generateRequestId();

  return {
    startTime,
    operationId,
    getContext: (additionalContext?: Record<string, any>) => ({
      operation: {
        name: operationName,
        id: operationId,
        startTime: new Date(startTime).toISOString(),
      },
      ...additionalContext,
    }),
  };
};

/**
 * Server-safe operation completion
 */
export const endOperation = (
  startTime: number,
  operationId: string,
  additionalContext?: Record<string, any>,
): Record<string, any> => {
  const endTime = Date.now();
  const duration = endTime - startTime;

  return {
    operation: {
      id: operationId,
      endTime: new Date(endTime).toISOString(),
      duration,
      status: additionalContext?.error ? "failed" : "success",
    },
    ...additionalContext,
  };
};

/**
 * Create auth log context for server environment
 */
export const createAuthLogContext = (
  sessionId: string,
  authType: "liff" | "phone" | "general",
  additionalContext?: Record<string, any>,
): Record<string, any> => {
  const userId =
    additionalContext?.userId ||
    (additionalContext?.user?.uid ? maskUserId(additionalContext.user.uid) : undefined);

  const errorInfo = additionalContext?.error
    ? {
        error: {
          message:
            additionalContext.error instanceof Error
              ? additionalContext.error.message
              : String(additionalContext.error),
          code: additionalContext.errorCode || "unknown",
          stack:
            additionalContext.error instanceof Error ? additionalContext.error.stack : undefined,
        },
      }
    : {};

  const levelInfo = additionalContext?.level ? { level: additionalContext.level } : {};

  return {
    sessionId,
    timestamp: new Date().toISOString(),
    component: "AuthProvider",
    authType,
    ...(userId ? { userId } : {}),
    env: {
      platform: "server",
      network: { online: true },
    },
    ...levelInfo,
    ...errorInfo,
    ...additionalContext,
  };
};

/**
 * Create retry log context for server environment
 */
export const createRetryLogContext = (
  retryCount: number,
  maxRetries: number,
  backoffStep: number,
): Record<string, any> => {
  return {
    retry: {
      count: retryCount,
      max: maxRetries,
      backoffStep,
      isLastAttempt: retryCount >= maxRetries,
    },
  };
};
