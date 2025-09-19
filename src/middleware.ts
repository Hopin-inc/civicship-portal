import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { currentCommunityConfig, FeaturesType } from "@/lib/communities/metadata";

// Map features to their corresponding route paths
const featureToRoutesMap: Partial<Record<FeaturesType, string[]>> = {
  places: ["/places"],
  opportunities: ["/activities", "/search"],
  points: ["/wallets"],
  tickets: ["/tickets"],
  articles: ["/articles"],
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const enabledFeatures = currentCommunityConfig.enableFeatures || [];
  const rootPath = currentCommunityConfig.rootPath || "/";

  // liff.state がある場合はrootPathへのリダイレクトをスキップ（LIFFのルーティングバグ対策）
  // const hasLiffState = request.nextUrl.searchParams.get("liff.state");

  // ルートページへのアクセスを処理（liff.stateがない場合、またはliff.stateが/の場合のみrootPathにリダイレクト）
  // if (pathname === "/" && rootPath !== "/" && (!hasLiffState || hasLiffState === "/")) {
  if (pathname === "/" && rootPath !== "/") {
    return NextResponse.redirect(new URL(rootPath, request.url));
  }

  for (const [feature, routes] of Object.entries(featureToRoutesMap)) {
    if (!enabledFeatures.includes(feature as FeaturesType)) {
      for (const route of routes) {
        if (feature === "opportunities" && /^\/activities\/[^/]+$/.test(pathname)) {
          continue;
        }

        if (pathname === route || pathname.startsWith(`${route}/`)) {
          console.log(`Redirecting from disabled feature path: ${pathname} to ${rootPath}`);
          return NextResponse.redirect(new URL(rootPath, request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
