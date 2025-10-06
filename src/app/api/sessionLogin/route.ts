import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();
  if (!idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT!;
  const apiBase = apiEndpoint.replace(/\/graphql\/?$/, "");

  const res = await fetch(`${apiBase}/sessionLogin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
}
