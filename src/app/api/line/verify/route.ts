import { NextRequest, NextResponse } from "next/server";

type VerifySuccess = { ok: true; botName: string };
type VerifyFailure = { ok: false; failedCheck: string; error: string };
type VerifyResult = VerifySuccess | VerifyFailure;

const LINE_TOKEN_URL = "https://api.line.me/oauth2/v2.1/token";
const LINE_REVOKE_URL = "https://api.line.me/oauth2/v2.1/revoke";

async function issueToken(channelId: string, channelSecret: string): Promise<string | null> {
  const res = await fetch(LINE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: channelId,
      client_secret: channelSecret,
    }),
  });

  if (!res.ok) return null;

  const { access_token } = await res.json();
  return access_token ?? null;
}

async function revokeToken(channelId: string, channelSecret: string, accessToken: string) {
  await fetch(LINE_REVOKE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: channelId,
      client_secret: channelSecret,
      access_token: accessToken,
    }),
  });
}

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

  // Step 1: Messaging API Access Token の有効性確認
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

  // Step 2: Channel ID + Secret の有効性確認（トークン発行 → 即失効）
  let issuedToken: string | null = null;
  try {
    issuedToken = await issueToken(channelId, channelSecret);
  } catch {
    return NextResponse.json<VerifyResult>(
      { ok: false, failedCheck: "lineChannelId", error: "Channel ID / Secret 確認中にエラーが発生しました" },
      { status: 500 },
    );
  }

  if (!issuedToken) {
    return NextResponse.json<VerifyResult>({
      ok: false,
      failedCheck: "lineChannelSecret",
      error: "Channel ID または Channel Secret が無効です",
    });
  }

  // 発行したトークンを即時失効（ベストエフォート）
  revokeToken(channelId, channelSecret, issuedToken).catch(() => {});

  return NextResponse.json<VerifyResult>({ ok: true, botName });
}
