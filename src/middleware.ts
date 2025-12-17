import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { FeaturesType, currentCommunityConfig } from "@/lib/communities/metadata";
import { detectPreferredLocale } from "@/lib/i18n/languageDetection";
import { locales, defaultLocale } from "@/lib/i18n/config";

// Map features to their corresponding route paths
const featureToRoutesMap: Partial<Record<FeaturesType, string[]>> = {
  places: ["/places"],
  opportunities: ["/activities", "/search"],
  points: ["/wallets"],
  tickets: ["/tickets"],
  articles: ["/articles"],
};

export function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV !== "production";
  const pathname = request.nextUrl.pathname;
  const enabledFeatures = currentCommunityConfig.enableFeatures || [];
  const rootPath = currentCommunityConfig.rootPath || "/";

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
