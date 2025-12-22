import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { FeaturesType, COMMUNITY_BASE_CONFIG, COMMUNITY_ID } from "@/lib/communities/metadata";
import { detectPreferredLocale } from "@/lib/i18n/languageDetection";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { isValidCommunityId } from "@/lib/communities/communityIds";

// Map features to their corresponding route paths
const featureToRoutesMap: Partial<Record<FeaturesType, string[]>> = {
  places: ["/places"],
  opportunities: ["/activities", "/search"],
  points: ["/wallets"],
  tickets: ["/tickets"],
  articles: ["/articles"],
};

function extractCommunityIdFromPath(pathname: string): { communityId: string | null; remainingPath: string } {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return { communityId: null, remainingPath: "/" };
  }

  const potentialCommunityId = segments[0];
  if (isValidCommunityId(potentialCommunityId)) {
    const remainingPath = "/" + segments.slice(1).join("/") || "/";
    return { communityId: potentialCommunityId, remainingPath };
  }

  return { communityId: null, remainingPath: pathname };
}

export function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV !== "production";
  const pathname = request.nextUrl.pathname;
  
  // Extract communityId from URL path
  const { communityId: pathCommunityId, remainingPath } = extractCommunityIdFromPath(pathname);
  
  // Determine the effective communityId:
  // 1. From URL path (highest priority)
  // 2. From cookie (fallback)
  // 3. From environment variable (legacy support)
  const cookieCommunityId = request.cookies.get("communityId")?.value;
  const effectiveCommunityId = pathCommunityId || cookieCommunityId || COMMUNITY_ID;
  
  // If no communityId in path and we have one from cookie/env, redirect to include it
  if (!pathCommunityId && effectiveCommunityId && pathname !== "/" && !pathname.startsWith("/_next") && !pathname.startsWith("/api")) {
    const newUrl = new URL(`/${effectiveCommunityId}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }
  
  // Get community config dynamically based on effectiveCommunityId
  const communityConfig = COMMUNITY_BASE_CONFIG[effectiveCommunityId] || COMMUNITY_BASE_CONFIG.default;
  
  // For root path without communityId, redirect to community root
  if (pathname === "/" && effectiveCommunityId) {
    const rootPath = communityConfig.rootPath || "/";
    return NextResponse.redirect(new URL(`/${effectiveCommunityId}${rootPath}`, request.url));
  }

  // Use the dynamic community config for feature checks
  const enabledFeatures = communityConfig.enableFeatures || [];
  const rootPath = communityConfig.rootPath || "/";

  // liff.state がある場合はrootPathへのリダイレクトをスキップ（LIFFのルーティングバグ対策）
  const hasLiffState = request.nextUrl.searchParams.get("liff.state");

  // ルートページへのアクセスを処理（liff.stateがない場合、またはliff.stateが/の場合のみrootPathにリダイレクト）
  // Note: Now we check remainingPath instead of pathname for community-prefixed URLs
  const effectivePath = pathCommunityId ? remainingPath : pathname;
  if (effectivePath === "/" && rootPath !== "/" && (!hasLiffState || hasLiffState === "/")) {
    const redirectPath = pathCommunityId ? `/${pathCommunityId}${rootPath}` : rootPath;
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  for (const [feature, routes] of Object.entries(featureToRoutesMap)) {
    if (!enabledFeatures.includes(feature as FeaturesType)) {
      for (const route of routes) {
        if (feature === "opportunities" && /^\/activities\/[^/]+$/.test(effectivePath)) {
          continue;
        }

        if (effectivePath === route || effectivePath.startsWith(`${route}/`)) {
          if (isDev) {
            console.log(`Redirecting from disabled feature path: ${effectivePath} to ${rootPath}`);
          }
          const redirectPath = pathCommunityId ? `/${pathCommunityId}${rootPath}` : rootPath;
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
      }
    }
  }

  // Generate nonce using Web Crypto API (Edge Runtime compatible)
  // crypto.randomUUID() returns a safe ASCII string, so we can use btoa directly
  const nonce = btoa(crypto.randomUUID());

  const scriptSrc = [
    `'self'`,
    `'nonce-${nonce}'`,
    "https://static.line-scdn.net",
    "https://www.google.com",
    "https://www.googletagmanager.com",
    "https://apis.google.com",
    "https://maps.googleapis.com",
    "https://www.gstatic.com",
    ...(isDev ? [`'unsafe-eval'`] : []),
  ].join(" ");

  const styleSrcElem = [
    `'self'`,
    "https://fonts.googleapis.com",
    `'unsafe-inline'`,
  ].join(" ");

  const styleSrcAttr = [
    `'unsafe-inline'`,
  ].join(" ");

  const styleSrc = [
    `'self'`,
    "https://fonts.googleapis.com",
    `'unsafe-inline'`,
  ].join(" ");

  const connectSrc = [
    `'self'`,
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}`,
    `${process.env.NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT}`,
    "https://api.line.me",
    "https://identitytoolkit.googleapis.com",
    "https://securetoken.googleapis.com",
    "https://liffsdk.line-scdn.net",
    "https://www.google.com",
    "https://maps.googleapis.com",
    "https://firebase.googleapis.com",
    "https://firebaseinstallations.googleapis.com",
    "https://www.google-analytics.com",
    "https://analytics.google.com",
    "https://region1.google-analytics.com",
    "https://www.googletagmanager.com",
  ].join(" ");

  const frameSrc = [
    `'self'`,
    "https://www.google.com",
    "https://www.gstatic.com",
    ...(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
      ? [`https://${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`]
      : []),
  ].join(" ");

  const csp = [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `script-src ${scriptSrc}`,
    `style-src ${styleSrc}`,
    `style-src-elem ${styleSrcElem}`,
    `style-src-attr ${styleSrcAttr}`,
    `img-src 'self' https: data: blob:`,
    `font-src 'self' https: data:`,
    `connect-src ${connectSrc}`,
    `frame-src ${frameSrc}`,
    `frame-ancestors 'none'`,
    `form-action 'self'`,
  ].join("; ");

  // Prepare request headers for SSR (these are passed to the server components)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  if (effectiveCommunityId) {
    requestHeaders.set("X-Community-Id", effectiveCommunityId);
  }

  // If there's a communityId in the path, rewrite to the path without the prefix
  // This allows /neo88/activities to be served by app/activities/page.tsx
  let res: NextResponse;
  if (pathCommunityId) {
    const rewriteUrl = new URL(remainingPath, request.url);
    rewriteUrl.search = request.nextUrl.search;
    res = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    });
  } else {
    res = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Set response headers
  res.headers.set("x-nonce", nonce);
  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "no-referrer");
  
  // Set community cookie for fallback (when user navigates without community in path)
  if (effectiveCommunityId) {
    res.cookies.set("communityId", effectiveCommunityId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });
  }

  const hasLanguageSwitcher = enabledFeatures.includes("languageSwitcher");
  const languageCookie = request.cookies.get('language');
  
  if (hasLanguageSwitcher && !languageCookie) {
    const detectedLanguage = detectPreferredLocale(
      request.headers.get('accept-language'),
      locales,
      defaultLocale
    );
    res.cookies.set('language', detectedLanguage, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
