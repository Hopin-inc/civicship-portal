import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchCommunityConfigForEdge } from "@/lib/communities/config-env";
import { detectPreferredLocale } from "@/lib/i18n/languageDetection";
import { locales, defaultLocale } from "@/lib/i18n/config";

// Feature types for route gating
type FeaturesType = "places" | "opportunities" | "points" | "tickets" | "articles" | "languageSwitcher";

// Map features to their corresponding route paths (relative to communityId)
const featureToRoutesMap: Partial<Record<FeaturesType, string[]>> = {
  places: ["/places"],
  opportunities: ["/activities", "/search"],
  points: ["/wallets"],
  tickets: ["/tickets"],
  articles: ["/articles"],
};

// Extract communityId from URL path (first segment after /)
function extractCommunityIdFromPath(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return null;
  }
  const firstSegment = segments[0];
  // Skip if it's a known non-community path
  if (["api", "_next", "favicon.ico"].includes(firstSegment)) {
    return null;
  }
  return firstSegment;
}

// Get path without communityId prefix
function getPathWithoutCommunityId(pathname: string, communityId: string): string {
  const prefix = `/${communityId}`;
  if (pathname.startsWith(prefix)) {
    const remaining = pathname.slice(prefix.length);
    return remaining || "/";
  }
  return pathname;
}

export async function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV !== "production";
  const pathname = request.nextUrl.pathname;
  
  // Extract communityId from URL path
  let communityId = extractCommunityIdFromPath(pathname);
  
  // If no communityId in path but liff.state is present, extract communityId from liff.state
  // This handles LINE OAuth callback where the URL is /?liff.state=%2Fneo88%2Fusers%2Fme
  const liffState = request.nextUrl.searchParams.get("liff.state");
  if (!communityId && liffState) {
    // liff.state contains the original path (URL-encoded), e.g., "/neo88/users/me"
    const decodedLiffState = decodeURIComponent(liffState);
    communityId = extractCommunityIdFromPath(decodedLiffState);
  }
  
  // If no communityId in path and accessing root (without liff.state), show loading page
  if (!communityId && pathname === "/") {
    const res = NextResponse.next();
    return addSecurityHeaders(res, isDev);
  }
  
  // If no communityId found, continue without community context
  if (!communityId) {
    const res = NextResponse.next();
    return addSecurityHeaders(res, isDev);
  }
  
  // Fetch config from server-side API using communityId from URL
  const config = await fetchCommunityConfigForEdge(communityId);
  const enabledFeatures = config?.enableFeatures || [];
  const rootPath = config?.rootPath || "/activities";

  // Get path relative to communityId
  const relativePath = getPathWithoutCommunityId(pathname, communityId);

  // liff.state がある場合はrootPathへのリダイレクトをスキップ（LIFFのルーティングバグ対策）
  const hasLiffState = request.nextUrl.searchParams.get("liff.state");

  // ルートページへのアクセスを処理（liff.stateがない場合、またはliff.stateが/の場合のみrootPathにリダイレクト）
  if (relativePath === "/" && rootPath !== "/" && (!hasLiffState || hasLiffState === "/")) {
    return NextResponse.redirect(new URL(`/${communityId}${rootPath}`, request.url));
  }

  for (const [feature, routes] of Object.entries(featureToRoutesMap)) {
    if (!enabledFeatures.includes(feature as FeaturesType)) {
      for (const route of routes) {
        if (feature === "opportunities" && /^\/activities\/[^/]+$/.test(relativePath)) {
          continue;
        }

        if (relativePath === route || relativePath.startsWith(`${route}/`)) {
          if (isDev) {
            console.log(`Redirecting from disabled feature path: ${pathname} to /${communityId}${rootPath}`);
          }
          return NextResponse.redirect(new URL(`/${communityId}${rootPath}`, request.url));
        }
      }
    }
  }

  const res = NextResponse.next();
  
  // Add x-community-id header for backend requests
  res.headers.set("x-community-id", communityId);
  
  // Add security headers
  addSecurityHeaders(res, isDev);

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

// Helper function to add security headers
function addSecurityHeaders(res: NextResponse, isDev: boolean): NextResponse {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

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
    "https://zipcloud.ibsnet.co.jp", // 郵便番号検索API
  ].join(" ");

  const frameSrc = [
    `'self'`,
    "https://www.google.com",
    "https://www.gstatic.com",
    ...(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
      ? [`https://${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`]
      : []),
  ].join(" ");

  res.headers.set("x-nonce", nonce);

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

  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "no-referrer");
  
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
