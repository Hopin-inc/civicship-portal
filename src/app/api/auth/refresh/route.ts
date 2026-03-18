import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logging";

/**
 * Server-side Firebase ID token refresh endpoint.
 *
 * Accepts a Firebase refresh token and exchanges it for a new ID token
 * via securetoken.googleapis.com — keeping the API key server-side and
 * consistent with the BFF pattern used in /api/auth/exchange.
 *
 * Flow:
 *   1. POST refresh_token to securetoken.googleapis.com/v1/token
 *   2. Create session cookie via backend /sessionLogin
 *   3. Return { idToken, refreshToken, expiresAt } + forward Set-Cookie
 */
export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();
    if (!refreshToken) {
      return NextResponse.json({ error: "Missing refreshToken" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      logger.error("[auth/refresh] Missing NEXT_PUBLIC_FIREBASE_API_KEY");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const tokenRes = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
      },
    );

    if (!tokenRes.ok) {
      const errorBody = await tokenRes.text();
      logger.error("[auth/refresh] securetoken API error", {
        status: tokenRes.status,
        body: errorBody.substring(0, 500),
        component: "auth/refresh",
      });
      return NextResponse.json({ error: "Token refresh failed" }, { status: tokenRes.status });
    }

    const {
      id_token: idToken,
      refresh_token: newRefreshToken,
      expires_in: expiresIn,
    } = await tokenRes.json();

    if (!idToken) {
      logger.error("[auth/refresh] No id_token in securetoken response");
      return NextResponse.json({ error: "Token refresh failed" }, { status: 500 });
    }

    const expiresAt = String(Date.now() + Number(expiresIn) * 1000);

    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
    if (!apiEndpoint) {
      logger.error("[auth/refresh] Missing NEXT_PUBLIC_API_ENDPOINT");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const apiBase = apiEndpoint.replace(/\/graphql\/?$/, "");
    const communityId = request.headers.get("x-community-id") || "";

    const sessionRes = await fetch(`${apiBase}/sessionLogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(communityId ? { "X-Community-Id": communityId } : {}),
      },
      body: JSON.stringify({ idToken }),
    });

    if (!sessionRes.ok) {
      logger.error("[auth/refresh] Session creation failed", {
        sessionStatus: sessionRes.status,
        component: "auth/refresh",
      });
      return NextResponse.json({ error: "Session creation failed" }, { status: 502 });
    }

    const response = NextResponse.json({ idToken, refreshToken: newRefreshToken, expiresAt });

    const setCookies = sessionRes.headers.getSetCookie();
    for (const cookie of setCookies) {
      response.headers.append("set-cookie", cookie);
    }

    logger.info("[auth/refresh] Token refreshed successfully", {
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
