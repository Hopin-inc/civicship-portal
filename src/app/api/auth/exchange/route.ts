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
 *   3. Create session cookie via /api/sessionLogin proxy
 *   4. Return tokens + forward Set-Cookie header to client
 */
export async function POST(request: NextRequest) {
  try {
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
    let tenantId: string | null = null;
    try {
      const payloadBase64 = customToken.split(".")[1];
      const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
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

    // Create session cookie via backend /sessionLogin
    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT!;
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
      const setCookie = sessionRes.headers.get("set-cookie");
      if (setCookie) {
        response.headers.set("set-cookie", setCookie);
      }
    } else {
      logger.warn("[auth/exchange] Session creation failed, but token exchange succeeded", {
        sessionStatus: sessionRes.status,
        component: "auth/exchange",
      });
    }

    logger.info("[auth/exchange] Token exchange successful", {
      tenantId,
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
