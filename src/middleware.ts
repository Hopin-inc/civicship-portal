import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchCommunityConfigForEdge, getCommunityIdFromEnv } from "@/lib/communities/config-env";
import { detectPreferredLocale } from "@/lib/i18n/languageDetection";
import { defaultLocale, locales } from "@/lib/i18n/config";
import { COMMUNITY_CONFIGS } from "@/lib/communities/constants";

// Feature types for route gating
type FeaturesType =
  | "places"
  | "opportunities"
  | "points"
  | "tickets"
  | "articles"
  | "languageSwitcher";

// Map features to their corresponding route paths
const featureToRoutesMap: Partial<Record<FeaturesType, string[]>> = {
  places: ["/places"],
  opportunities: ["/activities", "/search"],
  points: ["/wallets"],
  tickets: ["/tickets"],
  articles: ["/articles"],
};

export async function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV !== "production";
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get("host");

  getCommunityIdFromHost(host);

  // Fetch config from server-side API
  const communityId = getCommunityIdFromEnv();
  const config = await fetchCommunityConfigForEdge(communityId);
  const enabledFeatures = config?.enableFeatures || [];
  const rootPath = config?.rootPath || "/";

  // liff.state がある場合はrootPathへのリダイレクトをスキップ（LIFFのルーティングバグ対策）
  const hasLiffState = request.nextUrl.searchParams.get("liff.state");

  // ルートページへのアクセスを処理（liff.stateがない場合、またはliff.stateが/の場合のみrootPathにリダイレクト）
  if (pathname === "/" && rootPath !== "/" && (!hasLiffState || hasLiffState === "/")) {
    return NextResponse.redirect(new URL(rootPath, request.url));
  }

  for (const [feature, routes] of Object.entries(featureToRoutesMap)) {
    if (!enabledFeatures.includes(feature as FeaturesType)) {
      for (const route of routes) {
        if (feature === "opportunities" && /^\/activities\/[^/]+$/.test(pathname)) {
          continue;
        }

        if (pathname === route || pathname.startsWith(`${route}/`)) {
          if (isDev) {
            console.log(`Redirecting from disabled feature path: ${pathname} to ${rootPath}`);
          }
          return NextResponse.redirect(new URL(rootPath, request.url));
        }
      }
    }
  }

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

  const styleSrcElem = [`'self'`, "https://fonts.googleapis.com", `'unsafe-inline'`].join(" ");

  const styleSrcAttr = [`'unsafe-inline'`].join(" ");

  const styleSrc = [`'self'`, "https://fonts.googleapis.com", `'unsafe-inline'`].join(" ");

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

  const res = NextResponse.next();
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

  const hasLanguageSwitcher = enabledFeatures.includes("languageSwitcher");
  const languageCookie = request.cookies.get("language");

  if (hasLanguageSwitcher && !languageCookie) {
    const detectedLanguage = detectPreferredLocale(
      request.headers.get("accept-language"),
      locales,
      defaultLocale,
    );
    res.cookies.set("language", detectedLanguage, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return res;
}

function getCommunityIdFromHost(host: string | null): string {
  console.log(`[Middleware Debug] Incoming Host: "${host}"`);

  if (!host) {
    console.log(`[Middleware Debug] Result: No host, returning default (neo88)`);
    return "neo88";
  }

  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    const envId = process.env.NEXT_PUBLIC_COMMUNITY_ID || "neo88";
    console.log(`[Middleware Debug] Result: Local environment detected. Returning envId: ${envId}`);
    return envId;
  }

  const parts = host.split(".");
  console.log(`[Middleware Debug] Host parts:`, parts);

  if (parts.length >= 3) {
    const subdomain = parts[0];
    console.log(`[Middleware Debug] Checking subdomain: "${subdomain}"`);

    if (subdomain in COMMUNITY_CONFIGS) {
      console.log(`[Middleware Debug] Result: Subdomain match found! Returning: ${subdomain}`);
      return subdomain;
    } else {
      console.log(
        `[Middleware Debug] Warning: Subdomain "${subdomain}" not found in COMMUNITY_CONFIGS`,
      );
    }
  }

  console.log(`[Middleware Debug] Result: No match, falling back to default (neo88)`);
  return "neo88";
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
