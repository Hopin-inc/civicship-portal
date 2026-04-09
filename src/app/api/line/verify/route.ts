import { NextRequest, NextResponse } from "next/server";

type VerifySuccess = { ok: true; botName: string };
type VerifyFailure = { ok: false; failedCheck: string; error: string };
type VerifyResult = VerifySuccess | VerifyFailure;

const LINE_TOKEN_URL = "https://api.line.me/oauth2/v2.1/token";
const LINE_REVOKE_URL = "https://api.line.me/oauth2/v2.1/revoke";

async function issueAndRevokeToken(channelId: string, channelSecret: string): Promise<boolean> {
  const res = await fetch(LINE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: channelId,
      client_secret: channelSecret,
    }),
  });

  if (!res.ok) return false;

  const { access_token } = await res.json();
  if (access_token) {
    // 検証目的で発行したトークンは即時失効
    await fetch(LINE_REVOKE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: channelId,
        client_secret: channelSecret,
        access_token,
      }),
    });
  }

  return true;
}

export async function POST(request: NextRequest): Promise<NextResponse<VerifyResult>> {
  let body: {
    accessToken?: string;
    liffId?: string;
    channelId?: string;
    channelSecret?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, failedCheck: "", error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { accessToken, liffId, channelId, channelSecret } = body;

  if (!accessToken || !liffId || !channelId || !channelSecret) {
    return NextResponse.json(
      { ok: false, failedCheck: "", error: "全てのフィールドを入力してください" },
      { status: 400 },
    );
  }

  // Step 1: Access Token の有効性確認
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

  // Step 2: LIFF ID の存在確認
  try {
    const res = await fetch("https://api.line.me/liff/v1/apps", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      return NextResponse.json<VerifyResult>({
        ok: false,
        failedCheck: "lineLiffId",
        error: "LIFF アプリの取得に失敗しました",
      });
    }
    const data = await res.json();
    const exists = (data.apps as { liffId: string }[] | undefined)?.some(
      (app) => app.liffId === liffId,
    );
    if (!exists) {
      return NextResponse.json<VerifyResult>({
        ok: false,
        failedCheck: "lineLiffId",
        error: "LIFF ID が見つかりません",
      });
    }
  } catch {
    return NextResponse.json<VerifyResult>(
      { ok: false, failedCheck: "lineLiffId", error: "LIFF ID 確認中にエラーが発生しました" },
      { status: 500 },
    );
  }

  // Step 3: LINE Login Channel ID + Secret の有効性確認（トークン発行 → 即失効）
  try {
    const ok = await issueAndRevokeToken(channelId, channelSecret);
    if (!ok) {
      return NextResponse.json<VerifyResult>({
        ok: false,
        failedCheck: "lineChannelSecret",
        error: "LINE Login の Channel ID または Channel Secret が無効です",
      });
    }
  } catch {
    return NextResponse.json<VerifyResult>(
      { ok: false, failedCheck: "lineChannelId", error: "LINE Login 確認中にエラーが発生しました" },
      { status: 500 },
    );
  }

  return NextResponse.json<VerifyResult>({ ok: true, botName });
}
