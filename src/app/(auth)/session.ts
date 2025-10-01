import { cookies } from "next/headers";
import { AUTH_V2_FLAGS } from "@/lib/auth/auth-flags";

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

export async function verifySession(): Promise<SessionVerificationResult> {
  if (!AUTH_V2_FLAGS.ENABLE_SERVER_SESSION) {
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
      return {
        success: false,
        error: "No authentication token found",
      };
    }

    const expiresAt = lineExpiresAt ? parseInt(lineExpiresAt, 10) : 0;
    const now = Date.now();
    
    if (expiresAt > 0 && now >= expiresAt) {
      return {
        success: false,
        error: "Authentication token expired",
      };
    }

    const session: SessionData = {
      uid: null,
      isVerified: true,
      expiresAt,
    };

    return {
      success: true,
      session,
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Session verification failed",
    };
  }
}

export async function clearSession(): Promise<{ success: boolean; error?: string }> {
  "use server";
  
  if (!AUTH_V2_FLAGS.ENABLE_SERVER_SESSION) {
    return { success: true };
  }

  try {
    const cookieStore = cookies();
    
    cookieStore.delete("line_access_token");
    cookieStore.delete("line_refresh_token");
    cookieStore.delete("line_expires_at");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to clear session",
    };
  }
}
