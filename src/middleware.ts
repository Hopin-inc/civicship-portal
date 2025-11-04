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
  const nextUrl = request.nextUrl;
  const pathname = nextUrl.pathname;
  const searchParams = nextUrl.searchParams;

  if (pathname === "/_next/image") {
    const encodedUrl = searchParams.get("url");
    if (encodedUrl) {
      try {
        const decodedUrl = decodeURIComponent(encodedUrl);
        
        if (/^https?:\/\/ipfs\.io\/ipfs\//i.test(decodedUrl)) {
          let rewrittenUrl = decodedUrl.replace(
            /^https?:\/\/ipfs\.io\/ipfs\//i,
            'https://cloudflare-ipfs.com/ipfs/'
          );
          
          if (!/[?&]filename=/.test(rewrittenUrl)) {
            rewrittenUrl += (rewrittenUrl.includes('?') ? '&' : '?') + 'filename=image.png';
          }
          
          searchParams.set('url', encodeURIComponent(rewrittenUrl));
          nextUrl.search = searchParams.toString();
          
          return NextResponse.rewrite(nextUrl);
        }
      } catch (error) {
        console.error('Error processing IPFS URL in middleware:', error);
      }
    }
  }

  const enabledFeatures = currentCommunityConfig.enableFeatures || [];
  const rootPath = currentCommunityConfig.rootPath || "/";

  // liff.state がある場合はrootPathへのリダイレクトをスキップ（LIFFのルーティングバグ対策）
  // ルートページへのアクセスを処理（liff.stateがない場合、またはliff.stateが/の場合のみrootPathにリダイレクト）
  const hasLiffState = searchParams.get("liff.state");
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
          console.log(`Redirecting from disabled feature path: ${pathname} to ${rootPath}`);
          return NextResponse.redirect(new URL(rootPath, request.url));
        }
      }
    }
  }

  return setCsp(request, enabledFeatures);
}

export const config = {
  matcher: ["/_next/image", "/((?!_next/static|favicon.ico).*)"],
};

function setCsp(request: NextRequest, enabledFeatures: FeaturesType[]) {
  const isDev = process.env.NODE_ENV !== "production";
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const scriptSrc = [
    `'self'`,
    `'nonce-${nonce}'`, // ← インラインを許可する唯一の手段
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}`,
    `${process.env.NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT}`,
    "https://static.line-scdn.net",
    "https://www.google.com",
    "https://www.googletagmanager.com",
    ...(isDev ? [`'unsafe-eval'`] : []), // ← 開発のみ許可（本番は絶対NG）
  ].join(" ");

  const styleSrc = [
    `'self'`,
    `'nonce-${nonce}'`, // CSS-in-JSが挿入する <style> を許可
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}`,
    `${process.env.NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT}`,
    "https://fonts.googleapis.com",
    // 可能なら style も nonce 化。インライン style が残るなら開発中だけ 'unsafe-inline' を一時許可
    ...(isDev ? [`'unsafe-inline'`] : []),
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
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://analytics.google.com",
    "https://firebaseinstallations.googleapis.com",
  ].join(" ");

  const frameSrc = [
    `'self'`,
    "https://www.google.com",
  ].join(" ");

  const res = NextResponse.next();
  res.headers.set("x-nonce", nonce);

  const csp = [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `script-src ${scriptSrc}`,
    `style-src ${styleSrc}`,
    `img-src 'self' https: data: blob:`,
    `font-src 'self' https: data:`,
    `connect-src ${connectSrc}`,
    `frame-src ${frameSrc}`,
    `frame-ancestors 'none'`,
    `form-action 'self'`,

    // `report-to default-endpoint`,  // ← レポート先を使うなら:
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
