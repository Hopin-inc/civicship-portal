"use server";

import { cookies } from "next/headers";
import { AUTH_V2_FLAGS } from "@/lib/auth/auth-flags";

export interface SessionData {
  uid: string;
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
    return { success: false, error: "Server session verification disabled" };
  }

  try {
    const cookieStore = await cookies();

    const lineAccessToken = cookieStore.get("line_access_token")?.value;
    const lineExpiresAt = cookieStore.get("line_expires_at")?.value;

    if (!lineAccessToken) {
      return { success: false, error: "No authentication token found" };
    }

    const expiresAt = lineExpiresAt ? parseInt(lineExpiresAt, 10) : 0;
    if (expiresAt && Date.now() >= expiresAt) {
      return { success: false, error: "Authentication token expired" };
    }

    // TODO: decode lineAccessToken → uid 抽出
    const session: SessionData = {
      uid: "placeholder_uid", // 仮置き、decode 実装が必要
      isVerified: true,
      expiresAt,
    };

    return { success: true, session };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Session verification failed",
    };
  }
}

export async function clearSession(): Promise<{ success: boolean; error?: string }> {
  if (!AUTH_V2_FLAGS.ENABLE_SERVER_SESSION) {
    return { success: true };
  }

  try {
    const cookieStore = await cookies();
    cookieStore.set("line_access_token", "", { maxAge: 0 });
    cookieStore.set("line_refresh_token", "", { maxAge: 0 });
    cookieStore.set("line_expires_at", "", { maxAge: 0 });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to clear session",
    };
  }
}
