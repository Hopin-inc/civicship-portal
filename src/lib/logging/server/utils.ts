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
