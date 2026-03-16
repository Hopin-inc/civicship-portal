import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logging";

/**
 * Server-side phone verification endpoint.
 *
 * Calls Firebase Identity Toolkit REST API on the server to perform
 * `signInWithPhoneNumber` (code verification step) — bypassing LIFF WebView
 * restrictions that block direct client-side communication with
 * identitytoolkit.googleapis.com.
 *
 * Flow:
 *   1. Receive verificationId (sessionInfo) and verificationCode from client
 *   2. POST to identitytoolkit REST API accounts:signInWithPhoneNumber
 *   3. Return { idToken, refreshToken, expiresAt, phoneUid }
 *
 * Note: Phone auth uses the parent Firebase project (no tenantId),
 * matching the backend's validateFirebasePhoneAuth which also uses
 * auth.verifyIdToken() without tenant scoping.
 */
export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && new URL(origin).host !== host) {
      logger.warn("[auth/phone-verify] Origin mismatch", { origin, host, component: "auth/phone-verify" });
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { verificationId, verificationCode } = await request.json();
    if (!verificationId || !verificationCode) {
      return NextResponse.json({ error: "Missing verificationId or verificationCode" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      logger.error("[auth/phone-verify] Missing NEXT_PUBLIC_FIREBASE_API_KEY");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Call Firebase Identity Toolkit REST API (server-to-server, no WebView restrictions)
    // No tenantId — phone auth runs on the parent project
    const identityToolkitUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPhoneNumber?key=${apiKey}`;
    const firebaseRes = await fetch(identityToolkitUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionInfo: verificationId,
        code: verificationCode,
      }),
    });

    if (!firebaseRes.ok) {
      const errorBody = await firebaseRes.text();
      logger.error("[auth/phone-verify] Identity Toolkit error", {
        status: firebaseRes.status,
        body: errorBody.substring(0, 500),
        component: "auth/phone-verify",
      });
      return NextResponse.json(
        { error: "Phone verification failed" },
        { status: firebaseRes.status },
      );
    }

    const firebaseData = await firebaseRes.json();
    const { idToken, refreshToken, expiresIn, localId } = firebaseData;

    if (!idToken || !localId) {
      logger.error("[auth/phone-verify] Missing idToken or localId in Identity Toolkit response");
      return NextResponse.json({ error: "Phone verification failed" }, { status: 500 });
    }

    const expiresAt = String(Date.now() + Number(expiresIn) * 1000);

    logger.info("[auth/phone-verify] Phone verification successful", {
      phoneUid: localId.slice(-6),
      component: "auth/phone-verify",
    });

    return NextResponse.json({
      idToken,
      refreshToken,
      expiresAt,
      phoneUid: localId,
    });
  } catch (error) {
    logger.error("[auth/phone-verify] Unexpected error", {
      error: error instanceof Error ? error.message : String(error),
      component: "auth/phone-verify",
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
