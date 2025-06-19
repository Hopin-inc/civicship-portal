import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { FeaturesType, currentCommunityConfig } from "@/lib/communities/metadata";

// Map features to their corresponding route paths
const featureToRoutesMap: Record<string, string[]> = {
  places: ["/places"],
  opportunities: ["/", "/activities", "/search"],
  points: ["/wallets"],
  tickets: ["/tickets"],
  articles: ["/articles"],
};

export function middleware(request: NextRequest) {
  // Get the current path
  const pathname = request.nextUrl.pathname;

  // Get enabled features for the current community
  const enabledFeatures = currentCommunityConfig.enableFeatures || [];
  const rootPath = currentCommunityConfig.rootPath || "/";

  // Check if the current path corresponds to a disabled feature
  for (const [feature, routes] of Object.entries(featureToRoutesMap)) {
    if (!enabledFeatures.includes(feature as FeaturesType)) {
      for (const route of routes) {
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
