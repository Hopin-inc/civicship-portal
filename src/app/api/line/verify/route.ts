import { NextRequest, NextResponse } from "next/server";

type VerifySuccess = { ok: true; botName: string };
type VerifyFailure = { ok: false; failedCheck: string; error: string };
type VerifyResult = VerifySuccess | VerifyFailure;


export async function POST(request: NextRequest): Promise<NextResponse<VerifyResult>> {
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

  const { accessToken, channelId, channelSecret } = body;

  if (!accessToken || !channelId || !channelSecret) {
    return NextResponse.json(
      { ok: false, failedCheck: "", error: "全てのフィールドを入力してください" },
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
    const data = await res.json();
    botName = data.displayName ?? data.basicId ?? "LINE Bot";
  } catch {
    return NextResponse.json<VerifyResult>(
      { ok: false, failedCheck: "lineAccessToken", error: "Access Token 確認中にエラーが発生しました" },
      { status: 500 },
    );
  }

  // Step 2: Access Token の client_id と入力 channelId を照合
  try {
    const res = await fetch(
      `https://api.line.me/oauth2/v2.1/verify?access_token=${encodeURIComponent(accessToken)}`,
    );
    if (!res.ok) {
      return NextResponse.json<VerifyResult>({
        ok: false,
        failedCheck: "lineAccessToken",
        error: "Access Token の検証に失敗しました",
      });
    }
    const data = await res.json();
    if (data.client_id !== channelId) {
      return NextResponse.json<VerifyResult>({
        ok: false,
        failedCheck: "lineChannelId",
        error: "Access Token と Channel ID が一致しません",
      });
    }
  } catch {
    return NextResponse.json<VerifyResult>(
      { ok: false, failedCheck: "lineChannelId", error: "Channel ID 確認中にエラーが発生しました" },
      { status: 500 },
    );
  }

  return NextResponse.json<VerifyResult>({ ok: true, botName });
}
