import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logging";

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();
  if (!idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  // ミドルウェアが設定した x-community-id を取得してバックエンドへ転送
  const communityId = request.headers.get("x-community-id");

  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT!;
  const apiBase = apiEndpoint.replace(/\/graphql\/?$/, "");

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (communityId) {
      headers["X-Community-Id"] = communityId;
    }

    const res = await fetch(`${apiBase}/sessionLogin`, {
      method: "POST",
      headers,
      body: JSON.stringify({ idToken }),
      credentials: "include",
    });

    const text = await res.text();
    const response = new NextResponse(text, { status: res.status });

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Session login failed:", { message: error.message, stack: error.stack });
    } else {
      logger.error("Session login failed:", { error });
    }
    return NextResponse.json(
      { error: "Failed to connect to authentication service." },
      { status: 503 },
    );
  }
}
