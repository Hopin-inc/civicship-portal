import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logging";

/**
 * Server-side token refresh endpoint.
 *
 * Calls Firebase Secure Token REST API on the server to refresh an expired
 * Firebase ID token using a refresh token.
 *
 * This is needed for LIFF (LINE WebView) users who authenticate via the
 * server-side exchange flow (firebaseUser = null, lineTokens.idToken = "xxx").
 * Unlike regular Firebase SDK users, their ID token is not auto-refreshed,
 * so we need this BFF endpoint to refresh it manually before mutations.
 *
 * Flow:
 *   1. Accept refreshToken from client
 *   2. POST to Firebase Secure Token REST API → { idToken, refreshToken, expiresIn }
 *   3. Update session cookie via backend /sessionLogin
 *   4. Return new tokens to client
 */
export async function POST(request: NextRequest) {
  try {
    // CSRF protection: only accept requests from the same origin
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && new URL(origin).host !== host) {
      logger.warn("[auth/refresh] Origin mismatch", { origin, host, component: "auth/refresh" });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { refreshToken } = await request.json();
    if (!refreshToken) {
      return NextResponse.json({ error: "Missing refreshToken" }, { status: 400 });
    }

    const communityId =
      request.headers.get("x-community-id") ||
      request.cookies.get("x-community-id")?.value ||
      "";

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      logger.error("[auth/refresh] Missing NEXT_PUBLIC_FIREBASE_API_KEY");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Call Firebase Secure Token REST API to refresh the ID token
    const secureTokenUrl = `https://securetoken.googleapis.com/v1/token?key=${apiKey}`;
    const firebaseRes = await fetch(secureTokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!firebaseRes.ok) {
      const errorBody = await firebaseRes.text();
      logger.error("[auth/refresh] Secure Token API error", {
        status: firebaseRes.status,
        body: errorBody.substring(0, 500),
        component: "auth/refresh",
      });
      // Firebase の 5xx をそのまま返すとクライアントが誤解するため 502 に正規化
      const status = firebaseRes.status >= 500 ? 502 : firebaseRes.status;
      return NextResponse.json({ error: "Token refresh failed" }, { status });
    }

    const firebaseData = await firebaseRes.json();
    // Secure Token API returns snake_case fields
    const { id_token: idToken, refresh_token: newRefreshToken, expires_in: expiresIn } = firebaseData;

    if (!idToken) {
      logger.error("[auth/refresh] No id_token in Secure Token API response");
      return NextResponse.json({ error: "Token refresh failed" }, { status: 500 });
    }
    // refreshToken が返されない場合（Firebase API の仕様変更等）はエラーにする
    // クライアント側で undefined を保存してしまうのを防ぐため
    if (!newRefreshToken) {
      logger.error("[auth/refresh] No refresh_token in Secure Token API response");
      return NextResponse.json({ error: "Token refresh failed" }, { status: 500 });
    }

    const expiresAt = String(Date.now() + Number(expiresIn) * 1000);

    // Update session cookie via backend /sessionLogin
    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
    if (!apiEndpoint) {
      logger.error("[auth/refresh] Missing NEXT_PUBLIC_API_ENDPOINT");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }
    const apiBase = apiEndpoint.replace(/\/graphql\/?$/, "");

    const sessionRes = await fetch(`${apiBase}/sessionLogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(communityId ? { "X-Community-Id": communityId } : {}),
      },
      body: JSON.stringify({ idToken }),
    });

    // Build response with new tokens
    const response = NextResponse.json({
      idToken,
      refreshToken: newRefreshToken,
      expiresAt,
    });

    // Forward updated session cookie to client
    if (sessionRes.ok) {
      const setCookies = sessionRes.headers.getSetCookie();
      for (const cookie of setCookies) {
        response.headers.append("set-cookie", cookie);
      }
    } else {
      logger.warn("[auth/refresh] Session update failed", {
        sessionStatus: sessionRes.status,
        component: "auth/refresh",
      });
      // Session update failure is non-fatal for id_token auth mode — return tokens anyway
    }

    logger.info("[auth/refresh] Token refresh successful", {
      component: "auth/refresh",
    });

    return response;
  } catch (error) {
    logger.error("[auth/refresh] Unexpected error", {
      error: error instanceof Error ? error.message : String(error),
      component: "auth/refresh",
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
