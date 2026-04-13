import { NextRequest, NextResponse } from "next/server";

type VerifySuccess = { ok: true; botName: string };
type VerifyFailure = { ok: false; failedCheck: string; error: string };
type VerifyResult = VerifySuccess | VerifyFailure;

export async function POST(request: NextRequest): Promise<NextResponse<VerifyResult>> {
  // CSRF protection: only accept requests from the same origin
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json(
          { ok: false, failedCheck: "", error: "Forbidden" },
          { status: 403 },
        );
      }
    } catch {
      // malformed Origin header (e.g. "null" from sandboxed iframes) → reject
      return NextResponse.json(
        { ok: false, failedCheck: "", error: "Forbidden" },
        { status: 403 },
      );
    }
  }

  let body: {
    accessToken?: string;
    channelId?: string;
    channelSecret?: string;
    liffId?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, failedCheck: "", error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { accessToken } = body;

  if (!accessToken) {
    return NextResponse.json(
      { ok: false, failedCheck: "lineAccessToken", error: "Access Token を入力してください" },
      { status: 400 },
    );
  }

  // Step 1: Access Token の有効性確認 + botName 取得
  let botName = "LINE Bot";
  try {
    const res = await fetch("https://api.line.me/v2/bot/info", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      return NextResponse.json<VerifyResult>({
        ok: false,
        failedCheck: "lineAccessToken",
        error: "Access Token が無効です",
      });
    }
    let data: { displayName?: string; basicId?: string } = {};
    try {
      data = await res.json();
    } catch {
      // レスポンスのパースに失敗した場合はデフォルト名を使用
    }
    botName = data.displayName ?? data.basicId ?? "LINE Bot";
  } catch {
    return NextResponse.json<VerifyResult>(
      { ok: false, failedCheck: "lineAccessToken", error: "Access Token 確認中にエラーが発生しました" },
      { status: 500 },
    );
  }

  return NextResponse.json<VerifyResult>({ ok: true, botName });
}
