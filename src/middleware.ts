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
  const DEFAULT_ID = "neo88";
  let communityId = DEFAULT_ID;

  // 1. ホスト名がない場合
  if (!host) {
    console.log(`[Middleware Debug] No host header. Using default: ${DEFAULT_ID}`);
  }
  // 2. ローカル開発環境 (localhost / 127.0.0.1)
  else if (host.includes("localhost") || host.includes("127.0.0.1")) {
    communityId = process.env.NEXT_PUBLIC_COMMUNITY_ID || DEFAULT_ID;
    console.log(`[Middleware Debug] Local environment: "${host}" -> Using: ${communityId}`);
  }
  // 3. サブドメイン解析 (dev.kibotcha.civicship.app / kibotcha.civicship.app)
  else {
    const parts = host.split(".");
    //
    // 後ろから3番目がコミュニティID (parts.length - 3)
    const communityIndex = parts.length - 3;

    if (communityIndex >= 0) {
      const extractedId = parts[communityIndex];
      if (extractedId in COMMUNITY_CONFIGS) {
        communityId = extractedId;
        console.log(`[Middleware Debug] Match found! Host: "${host}" -> ID: ${communityId}`);
      } else {
        console.warn(
          `[Middleware Debug] Unknown community ID: "${extractedId}" from host: "${host}"`,
        );
      }
    } else {
      console.log(`[Middleware Debug] Host structure too short: "${host}"`);
    }
  }

  // 4. 差分チェックを実行（定数にデータがある場合のみ）
  const selectedConfig = COMMUNITY_CONFIGS[communityId as keyof typeof COMMUNITY_CONFIGS];
  if (selectedConfig) {
    checkConfigMismatch(communityId, selectedConfig);
  }

  return communityId;
}

function checkConfigMismatch(communityId: string, config: any) {
  // 比較したい環境変数のマッピング
  const envMapping = {
    COMMUNITY_ID: process.env.NEXT_PUBLIC_COMMUNITY_ID,
    FIREBASE_AUTH_TENANT_ID: process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID,
    LIFF_ID: process.env.NEXT_PUBLIC_LIFF_ID,
    LINE_CLIENT_ID: process.env.NEXT_PUBLIC_LINE_CLIENT,
  };

  console.log(`[Config Check] Verifying config for: ${communityId}`);

  Object.entries(envMapping).forEach(([key, envValue]) => {
    const constValue = config[key];

    // 環境変数が設定されており、かつ定数と一致しない場合のみ警告
    if (envValue && constValue !== envValue) {
      console.warn(
        `[⚠️ CONFIG MISMATCH] ${key} is different!\n` +
          `   - Constant: "${constValue}"\n` +
          `   - Env (.env): "${envValue}"`,
      );
    }
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
