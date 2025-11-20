import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  
  requestHeaders.set('x-pathname', pathname);
  requestHeaders.set('x-search', search);
  
  console.log('[MW]', request.nextUrl.href, '| pathname:', pathname, '| search:', search);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
