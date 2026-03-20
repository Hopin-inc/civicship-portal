import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logging";

/**
 * Server-side token exchange endpoint.
 *
 * Calls Firebase Identity Toolkit REST API on the server to perform
 * `signInWithCustomToken` — bypassing LIFF WebView restrictions that
 * block direct client-side communication with identitytoolkit.googleapis.com.
 *
 * Flow:
 *   1. Decode tenant_id from customToken JWT payload
 *   2. POST to identitytoolkit REST API → { idToken, refreshToken, expiresIn }
 *   3. Create session cookie via backend /sessionLogin endpoint
 *   4. Return tokens + forward Set-Cookie header to client
 */
export async function POST(request: NextRequest) {
  try {
    // CSRF protection: only accept requests from the same origin
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && new URL(origin).host !== host) {
      logger.warn("[auth/exchange] Origin mismatch", { origin, host, component: "auth/exchange" });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { customToken } = await request.json();
    if (!customToken) {
      return NextResponse.json({ error: "Missing customToken" }, { status: 400 });
    }

    const communityId =
      request.headers.get("x-community-id") ||
      request.cookies.get("x-community-id")?.value ||
      "";

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      logger.error("[auth/exchange] Missing NEXT_PUBLIC_FIREBASE_API_KEY");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Decode tenant_id from customToken JWT payload (no verification needed — backend signed it)
    // JWT uses base64url encoding: replace -→+ and _→/, then add padding
    let tenantId: string | null = null;
    try {
      const payloadBase64Url = customToken.split(".")[1];
      const payloadBase64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");
      const padded = payloadBase64 + "=".repeat((4 - (payloadBase64.length % 4)) % 4);
      const payloadJson = Buffer.from(padded, "base64").toString("utf-8");
      const payload = JSON.parse(payloadJson);
      tenantId = payload.tenant_id || null;
    } catch {
      logger.warn("[auth/exchange] Failed to decode tenant_id from customToken");
    }

    // Call Firebase Identity Toolkit REST API (server-to-server, no WebView restrictions)
    const identityToolkitUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`;
    const identityToolkitBody: Record<string, unknown> = {
      token: customToken,
      returnSecureToken: true,
    };
    if (tenantId) {
      identityToolkitBody.tenantId = tenantId;
    }

    const firebaseRes = await fetch(identityToolkitUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(identityToolkitBody),
    });

    if (!firebaseRes.ok) {
      const errorBody = await firebaseRes.text();
      logger.error("[auth/exchange] Identity Toolkit error", {
        status: firebaseRes.status,
        body: errorBody.substring(0, 500),
        tenantId,
        component: "auth/exchange",
      });
      return NextResponse.json(
        { error: "Token exchange failed" },
        { status: firebaseRes.status },
      );
    }

    const firebaseData = await firebaseRes.json();
    const { idToken, refreshToken, expiresIn } = firebaseData;

    if (!idToken) {
      logger.error("[auth/exchange] No idToken in Identity Toolkit response");
      return NextResponse.json({ error: "Token exchange failed" }, { status: 500 });
    }

    const expiresAt = String(Date.now() + Number(expiresIn) * 1000);

    // Decode returned idToken to verify its embedded tenant
    let returnedTenantId: string | null = null;
    try {
      const retPayload = JSON.parse(
        Buffer.from(
          idToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/") +
            "==".slice((idToken.split(".")[1].length * 6) % 8 ? 1 : 0),
          "base64",
        ).toString("utf-8"),
      );
      returnedTenantId = retPayload?.firebase?.tenant ?? null;
    } catch {
      logger.warn("[auth/exchange] Failed to decode returned idToken tenant");
    }

    // Create session cookie via backend /sessionLogin
    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
    if (!apiEndpoint) {
      logger.error("[auth/exchange] Missing NEXT_PUBLIC_API_ENDPOINT");
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

    // Build response with tokens
    const response = NextResponse.json({
      idToken,
      refreshToken,
      expiresAt,
    });

    // Forward session cookie from backend to client
    if (sessionRes.ok) {
      const setCookies = sessionRes.headers.getSetCookie();
      for (const cookie of setCookies) {
        response.headers.append("set-cookie", cookie);
      }
    } else {
      // Session cookie is required for subsequent GraphQL requests in session mode.
      // If session creation fails, return error to prevent silent auth failure.
      logger.error("[auth/exchange] Session creation failed", {
        sessionStatus: sessionRes.status,
        component: "auth/exchange",
      });
      return NextResponse.json(
        { error: "Session creation failed" },
        { status: 502 },
      );
    }

    logger.info("[auth/exchange] Token exchange successful", {
      tenantId,
      returnedTenantId,
      tenantMatch: tenantId === returnedTenantId,
      communityId,
      hasSessionCookie: sessionRes.ok,
      component: "auth/exchange",
    });

    return response;
  } catch (error) {
    logger.error("[auth/exchange] Unexpected error", {
      error: error instanceof Error ? error.message : String(error),
      component: "auth/exchange",
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
