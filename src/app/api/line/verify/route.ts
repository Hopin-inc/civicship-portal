import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let accessToken: string;

  try {
    const body = await request.json();
    accessToken = body.accessToken;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  if (!accessToken || typeof accessToken !== "string") {
    return NextResponse.json({ ok: false, error: "accessToken is required" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.line.me/v2/bot/info", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return NextResponse.json(
        { ok: false, error: data.message ?? `LINE API returned ${response.status}` },
        { status: 200 },
      );
    }

    const data = await response.json();
    return NextResponse.json({ ok: true, botName: data.displayName ?? data.basicId });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Network error" },
      { status: 200 },
    );
  }
}
