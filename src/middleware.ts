import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("access_token");

  // ログインが必要なページへのアクセスをチェック
  if (
    !session &&
    (request.nextUrl.pathname.startsWith("/users/me") || request.nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/users/me/:path*", "/register"],
};
