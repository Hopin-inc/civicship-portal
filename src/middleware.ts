import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchCommunityConfigForEdge } from "@/lib/communities/config-env";
import { detectPreferredLocale } from "@/lib/i18n/languageDetection";
import { defaultLocale, locales } from "@/lib/i18n/config";
import { ACTIVE_COMMUNITY_IDS } from "@/lib/communities/constants";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const pathname = request.nextUrl.pathname;

  // 1. コミュニティIDの特定とバトンパス
  const communityId = getCommunityIdFromHost(host);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-community-id", communityId);

  const res = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Cookie にも設定（Client JS から参照可能にする）
  res.cookies.set("x-community-id", communityId, {
    path: "/",
    maxAge: 60 * 60 * 24, // 24時間
    sameSite: "lax",
    httpOnly: false, // JS から読み取り可能
  });

  // 2. DBから動的設定を取得
  const config = await fetchCommunityConfigForEdge(communityId);
  const enabledFeatures = config?.enableFeatures || [];
  const rootPath = config?.rootPath || "/";

  // 3. ルートリダイレクト処理
  const redirectRes = handleRootRedirect(request, pathname, rootPath);
  if (redirectRes) return redirectRes;

  // 4. セキュリティヘッダー (CSP) の設定
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  setSecurityHeaders(res, nonce);

  // 5. 言語設定処理
  handleLanguageSetting(request, res, enabledFeatures);

  console.log(`[Middleware] communityId resolved`, {
    host,
    communityId,
    pathname,
    method: request.method,
  });
  return res;
}

/**
 * ルートページへのリダイレクト判定
 */
function handleRootRedirect(request: NextRequest, pathname: string, rootPath: string) {
  const hasLiffState = request.nextUrl.searchParams.get("liff.state");
  if (pathname === "/" && rootPath !== "/" && (!hasLiffState || hasLiffState === "/")) {
    return NextResponse.redirect(new URL(rootPath, request.url));
  }
  return null;
}

/**
 * セキュリティヘッダー (CSP) のセット
 */
function setSecurityHeaders(res: NextResponse, nonce: string) {
  const isDev = process.env.NODE_ENV !== "production";

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
    "https://zipcloud.ibsnet.co.jp",
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
    `style-src 'self' https://fonts.googleapis.com 'unsafe-inline'`,
    `style-src-elem 'self' https://fonts.googleapis.com 'unsafe-inline'`,
    `style-src-attr 'unsafe-inline'`,
    `img-src 'self' https: data: blob:`,
    `font-src 'self' https: data:`,
    `connect-src ${connectSrc}`,
    `frame-src ${frameSrc}`,
    `frame-ancestors 'none'`,
    `form-action 'self'`,
  ].join("; ");

  res.headers.set("x-nonce", nonce);
  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "no-referrer");
}

/**
 * 言語設定の処理
 */
function handleLanguageSetting(request: NextRequest, res: NextResponse, enabledFeatures: string[]) {
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
}

function getCommunityIdFromHost(host: string | null): string {
  const DEFAULT_ID = "himeji-ymca";
  let communityId = DEFAULT_ID;

  if (!host) {
    console.warn(`[Middleware Debug] No host header. Using default: ${DEFAULT_ID}`);
  } else {
    // ポート番号が含まれている場合は除去（例: localhost:3000 -> localhost）
    const hostName = host.split(":")[0];

    if (hostName.includes("localhost") || hostName.includes("127.0.0.1")) {
      communityId = process.env.LOCAL_COMMUNITY_ID || DEFAULT_ID;
      console.log(`[Middleware Debug] Local environment detected: ${hostName} -> ${communityId}`);
    } else {
      // 逆順スキャン方式でホワイトラベルとcivicship.app両方に対応
      const parts = hostName.split(".");
      const reversedParts = [...parts].reverse();
      const ignoreWords = ["app", "civicship", "dev", "www"];

      let extractedId = "";
      for (const part of reversedParts) {
        if (!ignoreWords.includes(part.toLowerCase())) {
          extractedId = part;
          break;
        }
      }

      if (extractedId && (ACTIVE_COMMUNITY_IDS as readonly string[]).includes(extractedId)) {
        communityId = extractedId;
        console.log(`[Middleware Debug] Community ID resolved: ${hostName} -> ${communityId}`);
      } else {
        console.warn(
          `[Middleware Debug] Unknown or missing community ID from host: ${hostName} (extracted: ${extractedId || "(none)"}). Falling back to default: ${DEFAULT_ID}`,
        );
        communityId = DEFAULT_ID;
      }
    }
  }

  return communityId;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
