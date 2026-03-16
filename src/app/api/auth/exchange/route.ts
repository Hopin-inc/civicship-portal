import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { logger } from "@/lib/logging";

export async function POST(request: NextRequest) {
  const { customToken } = await request.json();

  const communityId =
    request.headers.get("x-community-id") ||
    request.cookies.get("x-community-id")?.value ||
    "";

  if (!customToken) {
    return NextResponse.json({ error: "Missing customToken" }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    logger.error("[exchange] NEXT_PUBLIC_FIREBASE_API_KEY is not set");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  // customToken から tenantId をデコード（マルチテナント対応）
  let tenantId: string | null = null;
  try {
    const decoded = jwtDecode<{ tenant_id?: string }>(customToken);
    tenantId = decoded.tenant_id ?? null;
  } catch {
    logger.warn("[exchange] Failed to decode customToken for tenantId");
  }

  // 1. customToken → idToken（サーバー側から呼ぶので LIFF にブロックされない）
  const exchangeRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: customToken,
        returnSecureToken: true,
        ...(tenantId ? { tenantId } : {}),
      }),
    },
  );

  if (!exchangeRes.ok) {
    const err = await exchangeRes.json().catch(() => ({}));
    logger.error("[exchange] identitytoolkit exchange failed", {
      status: exchangeRes.status,
      error: err?.error?.message,
      tenantId,
    });
    return NextResponse.json({ error: "Token exchange failed" }, { status: 502 });
  }

  const { idToken, refreshToken, expiresIn } = await exchangeRes.json();

  // 2. 既存の /api/sessionLogin プロキシをそのまま利用
  const sessionRes = await fetch(
    new URL("/api/sessionLogin", request.nextUrl.origin).toString(),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(communityId ? { "x-community-id": communityId } : {}),
      },
      body: JSON.stringify({ idToken }),
    },
  );

  if (!sessionRes.ok) {
    logger.warn("[exchange] sessionLogin failed", { status: sessionRes.status, communityId });
    return NextResponse.json({ error: "Session creation failed" }, { status: 401 });
  }

  // 3. idToken・refreshToken をクライアントに返しつつ Set-Cookie を転送
  const expiresAt = String(Date.now() + Number(expiresIn) * 1000);
  const response = NextResponse.json({ idToken, refreshToken, expiresAt });

  const setCookie = sessionRes.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  logger.info("[exchange] Auth exchange successful", { communityId, tenantId });
  return response;
}
