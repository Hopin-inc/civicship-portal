// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { currentCommunityConfig, FeaturesType } from "@/lib/communities/metadata";

/* =========================================
 * 定数: 機能ごとのルートマッピング
 * ========================================= */
const featureToRoutesMap: Partial<Record<FeaturesType, string[]>> = {
  places: ["/places"],
  opportunities: ["/activities", "/search", "/quests"],
  points: ["/wallets"],
  tickets: ["/tickets"],
  articles: ["/articles"],
};

/* =========================================
 * 判定関数群
 * ========================================= */

/**
 * LIFF戻りやリッチメニュークリック時に
 * liff.state から転送先を解決
 */
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

/**
 * ルート("/")から rootPath にリダイレクトすべきか
 */
function shouldRedirectFromRoot(
  pathname: string,
  rootPath: string,
  liffState: string | null,
): boolean {
  return pathname === "/" && rootPath !== "/" && (!liffState || liffState === "/");
}

/**
 * 無効化された機能のルートに入ってしまった場合
 */
function isDisabledFeaturePath(pathname: string, enabledFeatures: string[]): boolean {
  for (const [feature, routes] of Object.entries(featureToRoutesMap)) {
    if (enabledFeatures.includes(feature)) continue;

    for (const base of routes) {
      if (feature === "opportunities" && /^\/opportunities\/[^/]+$/.test(pathname)) {
        continue;
      }
      if (pathname === base || pathname.startsWith(`${base}/`)) {
        return true;
      }
    }
  }
  return false;
}

/* =========================================
 * 本体
 * ========================================= */
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const rootPath = currentCommunityConfig.rootPath || "/";
  const enabledFeatures = currentCommunityConfig.enableFeatures || [];

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

  // C) 機能OFFのルートは rootPath に戻す
  if (isDisabledFeaturePath(pathname, enabledFeatures)) {
    return NextResponse.redirect(new URL(rootPath, request.url));
  }

  // D) それ以外は通す
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
