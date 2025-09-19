import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { currentCommunityConfig } from "@/lib/communities/metadata";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const rootPath = currentCommunityConfig.rootPath || "/";

  // A) LIFF戻りやリッチメニューのディープリンク
  if (pathname === "/") {
    const target = resolveLiffReturnTarget(url);
    if (target) {
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  // B) "/" → rootPath に強制リダイレクト
  const liffState = url.searchParams.get("liff.state");
  if (shouldRedirectFromRoot(pathname, rootPath, liffState)) {
    return NextResponse.redirect(new URL(rootPath, request.url));
  }

  // C) それ以外は通す
  return NextResponse.next();
}

function resolveLiffReturnTarget(url: URL): string | null {
  const raw = url.searchParams.get("liff.state");
  if (!raw || raw === "/") return null;

  try {
    const decoded = decodeURIComponent(raw);
    return decoded.startsWith("/") ? decoded : `/${decoded}`;
  } catch {
    return raw.startsWith("/") ? raw : `/${raw}`;
  }
}

function shouldRedirectFromRoot(
  pathname: string,
  rootPath: string,
  liffState: string | null,
): boolean {
  return pathname === "/" && rootPath !== "/" && (!liffState || liffState === "/");
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
