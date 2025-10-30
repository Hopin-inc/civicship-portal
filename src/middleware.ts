import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { FeaturesType, currentCommunityConfig } from "@/lib/communities/metadata";
import { NextURL } from "next/dist/server/web/next-url";

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
  const enabledFeatures = currentCommunityConfig.enableFeatures || [];
  const rootPath = currentCommunityConfig.rootPath || "/";

  if (pathname === "/_next/image") {
    const rewritten = redirectToCloudFlareIfIpfs(nextUrl);
    if (rewritten) return rewritten;
    return NextResponse.next();
  }

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

  return setCsp();
}

export const config = {
  matcher: [
    "/_next/image",
    "/((?!_next/static|favicon.ico).*)",
  ],
};

function redirectToCloudFlareIfIpfs(nextUrl: NextURL) {
  const searchParams = nextUrl.searchParams;
  const rawOriginalUrl = searchParams.get("url");
  if (!rawOriginalUrl) return;

  const originalUrl = decodeURIComponent(rawOriginalUrl);
  if (/https?:\/\/ipfs\.io\/ipfs\//i.test(originalUrl)) {
    // ipfs.io を cloudflare-ipfs.com に置換
    let replaced = originalUrl.replace(
      /^https?:\/\/ipfs\.io\/ipfs\//i,
      "https://cloudflare-ipfs.com/ipfs/",
    );

    // MIME 安定化のため filename ヒントを付与（拡張子不明対策）
    if (!/[?&]filename=/.test(replaced)) {
      replaced += (replaced.includes("?") ? "&" : "?") + "filename=image.png";
    }

    searchParams.set("url", encodeURIComponent(replaced));
    nextUrl.search = searchParams.toString();

    return NextResponse.rewrite(nextUrl);
  }
}

function setCsp() {
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

  const frameSrc = [`'self'`, "https://www.google.com"].join(" ");

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

  return res;
}
