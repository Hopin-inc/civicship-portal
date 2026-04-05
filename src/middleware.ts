import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { fetchCommunityConfigForEdge } from "@/lib/communities/config-env";
import { detectPreferredLocale } from "@/lib/i18n/languageDetection";
import { defaultLocale, locales } from "@/lib/i18n/config";
import { ACTIVE_COMMUNITY_IDS } from "@/lib/communities/constants";

/**
 * パスベースルーティングのリダイレクト対象外パターン
 * これらのパスは /community/{communityId} プレフィックスへリダイレクトしない
 */
const EXCLUDED_REDIRECT_PATTERNS = [
  "/community", // 既にパスベース形式
  "/api",       // API ルート
  "/_next",     // Next.js 内部
  "/images",    // 静的アセット
  "/communities", // コミュニティアセット
  "/icons",     // アイコン
];

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const pathname = request.nextUrl.pathname;

  // 1. コミュニティIDの特定（パス → ホスト → クッキー の順で解決）
  let communityId = getCommunityIdFromPath(pathname);
  let communityIdSource = communityId ? "path" : null;

  if (!communityId) {
    communityId = getCommunityIdFromHost(host);
    if (communityId) communityIdSource = "host";
  }

  // パスとホストで解決できない場合はクッキーからフォールバック
  // （LIFFコールバックなど、ルートURLへのリダイレクト後に使用）
  // LIFF の redirect_uri は登録済みエンドポイント URL（例: https://dev.civicship.app）に固定されるため、
  // コールバックがルート "/" に来ても communityId を特定できる必要がある。
  if (!communityId) {
    const cookieValue = request.cookies.get("x-community-id")?.value ?? null;
    if (cookieValue && /^[a-zA-Z0-9-]+$/.test(cookieValue)) {
      communityId = cookieValue;
      communityIdSource = "cookie";
    }
  }

  if (!communityId) {
    console.warn("[Middleware] Could not resolve communityId from path or host", {
      host,
      pathname,
    });
    return new NextResponse("Community not found", { status: 404 });
  }

  // セッションCookieの存在確認と、communityIdの不一致を早期検出
  // __session_{communityId} 形式はコミュニティ別に独立しているため、切り替え時も削除しない。
  // 旧形式（session / __session）は communityId を含まず複数コミュニティで混在するため、
  // コミュニティ切り替え時のみクリア対象とする。
  const previousCommunityId = request.cookies.get("x-community-id")?.value;
  const legacySessionCookie = request.cookies.get("session")?.value || request.cookies.get("__session")?.value;

  let shouldClearSessionCookies = false;
  if (previousCommunityId && previousCommunityId !== communityId) {
    console.warn("[Middleware] TENANT_MISMATCH: community changed, clearing stale session cookies", {
      previousCommunityId,
      resolvedCommunityId: communityId,
      communityIdSource,
      hasLegacySessionCookie: !!legacySessionCookie,
      host,
      pathname,
    });
    if (legacySessionCookie) {
      shouldClearSessionCookies = true;
    }
  }

  // 2. パスベースリダイレクト判定
  // サブドメインでアクセスされ、パスが /community で始まっていない場合はリダイレクト
  const shouldRedirect = shouldRedirectToPathBased(pathname);
  if (shouldRedirect) {
    const newPath = pathname === "/"
      ? `/community/${communityId}`
      : `/community/${communityId}${pathname}`;
    const redirectUrl = new URL(newPath, request.url);
    redirectUrl.search = request.nextUrl.search;

    const redirectResponse = NextResponse.redirect(redirectUrl, 301);
    if (shouldClearSessionCookies) {
      clearLegacySessionCookies(redirectResponse);
    }
    return redirectResponse;
  }

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

  // 3. DBから動的設定を取得（存在しないコミュニティは404）
  const config = await fetchCommunityConfigForEdge(communityId);
  if (!config) {
    console.warn("[Middleware] Community not found in DB", { communityId, host, pathname });
    return new NextResponse("Community not found", { status: 404 });
  }
  const enabledFeatures = config.enableFeatures;
  const rootPath = config.rootPath;

  // 4. ルートリダイレクト処理（/community/{communityId} へのアクセス時）
  const redirectRes = handleRootRedirect(request, pathname, rootPath, communityId);
  if (redirectRes) {
    redirectRes.cookies.set("x-community-id", communityId, {
      path: "/",
      maxAge: 60 * 60 * 24, // 24時間
      sameSite: "lax",
      httpOnly: false,
    });
    if (shouldClearSessionCookies) {
      clearLegacySessionCookies(redirectRes);
    }
    return redirectRes;
  }

  // 5. セキュリティヘッダー (CSP) の設定
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  setSecurityHeaders(res, nonce);

  // 6. 言語設定処理
  handleLanguageSetting(request, res, enabledFeatures);

  // コミュニティ変化による stale session Cookie を expire させる。
  // バックエンドへのリクエストに古いテナントの Cookie が乗らないようにする。
  if (shouldClearSessionCookies) {
    // 旧形式（session / __session）のみ削除。
    // 新形式 __session_{communityId} はコミュニティ別に独立しているため削除しない。
    clearLegacySessionCookies(res);
  }

  return res;
}

/**
 * パスから communityId を抽出
 * /community/{communityId}/... 形式の場合に communityId を返す
 * ホワイトリストチェックは行わず、DB検証に委ねる
 */
function getCommunityIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/community\/([a-zA-Z0-9-]+)/);
  return match ? match[1] : null;
}

/**
 * パスベースURLへリダイレクトすべきかどうかを判定
 */
function shouldRedirectToPathBased(pathname: string): boolean {
  // 既に /community で始まっている場合はリダイレクト不要
  if (pathname.startsWith("/community")) {
    return false;
  }

  // 除外パターンに一致する場合はリダイレクト不要
  for (const pattern of EXCLUDED_REDIRECT_PATTERNS) {
    if (pathname === pattern || pathname.startsWith(pattern + "/")) {
      return false;
    }
  }

  // favicon.ico などのファイルはリダイレクト不要
  if (pathname === "/favicon.ico" || pathname === "/robots.txt") {
    return false;
  }

  return true;
}

/**
 * ルートページへのリダイレクト判定
 * /community/{communityId} へのアクセス時に rootPath へリダイレクト
 */
function handleRootRedirect(
  request: NextRequest,
  pathname: string,
  rootPath: string,
  communityId: string
) {
  const hasLiffState = request.nextUrl.searchParams.get("liff.state");
  const communityRoot = `/community/${communityId}`;

  // /community/{communityId} へのアクセス時に rootPath へリダイレクト
  if (pathname === communityRoot && rootPath !== "/" && (!hasLiffState || hasLiffState === "/")) {
    const redirectPath = `/community/${communityId}${rootPath}`;
    return NextResponse.redirect(new URL(redirectPath, request.url));
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
    `frame-ancestors 'self' ${process.env.NEXT_PUBLIC_ALLOWED_FRAME_ANCESTORS ?? ""}`.trimEnd(),
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

function clearLegacySessionCookies(response: NextResponse) {
  const LEGACY_SESSION_COOKIE_NAMES = ["session", "__session"];
  for (const cookieName of LEGACY_SESSION_COOKIE_NAMES) {
    response.cookies.set(cookieName, "", { expires: new Date(0), path: "/" });
  }
}

function getCommunityIdFromHost(host: string | null): string | null {
  if (!host) {
    console.warn("[Middleware Debug] No host header.");
    return null;
  }

  // ポート番号が含まれている場合は除去（例: localhost:3000 -> localhost）
  const hostName = host.split(":")[0];

  if (hostName.includes("localhost") || hostName.includes("127.0.0.1")) {
    const localIdFromEnv = process.env.LOCAL_COMMUNITY_ID ?? null;
    const fallbackLocalId = (ACTIVE_COMMUNITY_IDS as readonly string[])[0] ?? null;
    const resolvedLocalId = localIdFromEnv ?? fallbackLocalId;
    return resolvedLocalId;
  }

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
    return extractedId;
  }

  console.warn(
    `[Middleware Debug] Unknown community ID from host: ${hostName} (extracted: ${extractedId || "(none)"})`,
  );
  return null;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|images/|icons/).*)"],
};
