import { cookies } from "next/headers";
import { logger } from "@/lib/logging";
import { AUTH_V2_FLAGS } from "@/lib/auth/auth-flags";
import { TokenManager } from "@/lib/auth/token-manager";

export interface SessionData {
  uid: string | null;
  email?: string;
  phoneNumber?: string;
  isVerified: boolean;
  expiresAt: number;
}

export interface SessionVerificationResult {
  success: boolean;
  session?: SessionData;
  error?: string;
}

/**
 * Server-side session verification using existing TokenManager
 * This function is part of PR1 and initially unused - no impact on existing UI
 */
export async function verifySession(): Promise<SessionVerificationResult> {
  if (!AUTH_V2_FLAGS.ENABLE_SERVER_SESSION) {
    logger.debug("Server session verification disabled by feature flag", {
      component: "verifySession",
      flag: "ENABLE_SERVER_SESSION",
    });
    return {
      success: false,
      error: "Server session verification disabled",
    };
  }

  try {
    const cookieStore = cookies();
    
    const lineAccessToken = cookieStore.get("line_access_token")?.value;
    const lineRefreshToken = cookieStore.get("line_refresh_token")?.value;
    const lineExpiresAt = cookieStore.get("line_expires_at")?.value;

    if (!lineAccessToken) {
      logger.debug("No LINE access token found in cookies", {
        component: "verifySession",
      });
      return {
        success: false,
        error: "No authentication token found",
      };
    }

    const expiresAt = lineExpiresAt ? parseInt(lineExpiresAt, 10) : 0;
    const now = Date.now();
    
    if (expiresAt > 0 && now >= expiresAt) {
      logger.debug("LINE access token expired", {
        component: "verifySession",
        expiresAt,
        now,
      });
      return {
        success: false,
        error: "Authentication token expired",
      };
    }

    const isLineTokenExpired = await TokenManager.isLineTokenExpired();
    if (isLineTokenExpired) {
      logger.debug("LINE token validation failed via TokenManager", {
        component: "verifySession",
      });
      return {
        success: false,
        error: "Authentication token validation failed",
      };
    }

    const session: SessionData = {
      uid: null, // No uid extraction yet - safer than placeholder
      isVerified: true,
      expiresAt,
    };

    logger.debug("Session verification successful", {
      component: "verifySession",
      hasValidToken: true,
      expiresAt: session.expiresAt,
    });

    return {
      success: true,
      session,
    };

  } catch (error) {
    logger.error("Session verification failed", {
      component: "verifySession",
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Session verification failed",
    };
  }
}

/**
 * Clear server-side session data as Server Action
 * Part of the DAL for session management
 */
export async function clearSession(): Promise<{ success: boolean; error?: string }> {
  "use server";
  
  if (!AUTH_V2_FLAGS.ENABLE_SERVER_SESSION) {
    return { success: true }; // No-op when disabled
  }

  try {
    const cookieStore = cookies();
    
    cookieStore.delete("line_access_token");
    cookieStore.delete("line_refresh_token");
    cookieStore.delete("line_expires_at");

    logger.debug("Server session cleared via Server Action", {
      component: "clearSession",
    });

    return { success: true };
  } catch (error) {
    logger.error("Failed to clear server session", {
      component: "clearSession",
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to clear session",
    };
  }
}
