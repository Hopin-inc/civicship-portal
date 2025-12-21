import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Minimal middleware to test if middleware is executing
export function middleware(request: NextRequest) {
  const res = NextResponse.next();
  res.headers.set("x-mw-test", "1");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
