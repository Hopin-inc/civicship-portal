import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logging";

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();
  if (!idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  // リクエストヘッダーまたはCookieからcommunityIdを取得
  const communityId =
    request.headers.get("x-community-id") ||
    request.cookies.get("x-community-id")?.value ||
    "";

  logger.info("[sessionLogin] Session login request", {
    communityId,
    hasIdToken: !!idToken,
    component: "sessionLogin",
  });

  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT!;
  const apiBase = apiEndpoint.replace(/\/graphql\/?$/, "");

  try {
    const res = await fetch(`${apiBase}/sessionLogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(communityId ? { "X-Community-Id": communityId } : {}),
      },
      body: JSON.stringify({ idToken }),
      credentials: "include",
    });

    const text = await res.text();
    const response = new NextResponse(text, { status: res.status });

    if (!res.ok) {
      logger.warn("[sessionLogin] Backend returned error", {
        status: res.status,
        communityId,
        responseBody: text.substring(0, 200),
        component: "sessionLogin",
      });
    }

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (error) {
    logger.error("[sessionLogin] Failed to connect to authentication service", {
      error: error instanceof Error ? error.message : String(error),
      communityId,
      component: "sessionLogin",
    });
    return NextResponse.json(
      { error: "Failed to connect to authentication service." },
      { status: 503 },
    );
  }
}
