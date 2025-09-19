// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { currentCommunityConfig, FeaturesType } from "@/lib/communities/metadata";

/* ===================== 定数 ===================== */

const featureToRoutesMap: Partial<Record<FeaturesType, string[]>> = {
  places: ["/places"],
  opportunities: ["/activities", "/search", "quests"],
  points: ["/wallets"],
  tickets: ["/tickets"],
  articles: ["/articles"],
};

/* ===================== 判定関数 ===================== */

/** ルートパスへリダイレクトすべきか（現行ロジックをそのまま関数化） */
function shouldRedirectFromRoot(pathname: string, rootPath: string, liffState: string | null) {
  return pathname === "/" && rootPath !== "/" && (!liffState || liffState === "/");
}

/** 機能トグルOFFのルートに入ってしまっているか */
function isDisabledFeaturePath(
  pathname: string,
  enabledFeatures: string[],
): { shouldRedirect: boolean; to: string | null } {
  for (const [feature, routes] of Object.entries(featureToRoutesMap)) {
    if (!enabledFeatures.includes(feature)) {
      for (const base of routes) {
        // opportunities の詳細 (/opportunities/[id]) は許可（現行ロジックを踏襲）
        if (feature === "opportunities" && /^\/opportunities\/[^/]+$/.test(pathname)) {
          continue;
        }
        if (pathname === base || pathname.startsWith(`${base}/`)) {
          return { shouldRedirect: true, to: "root" };
        }
      }
    }
  }
  return { shouldRedirect: false, to: null };
}

/* ===================== 本体 ===================== */

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  const enabledFeatures = currentCommunityConfig.enableFeatures || [];
  const rootPath = currentCommunityConfig.rootPath || "/";

  const liffState = url.searchParams.get("liff.state");

  if (shouldRedirectFromRoot(pathname, rootPath, liffState)) {
    return NextResponse.redirect(new URL(rootPath, request.url));
  }

  const disabledCheck = isDisabledFeaturePath(pathname, enabledFeatures);
  if (disabledCheck.shouldRedirect) {
    return NextResponse.redirect(new URL(rootPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
