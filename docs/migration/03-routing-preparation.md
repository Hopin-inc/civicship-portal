# Phase 3: ルーティング準備

## 概要

新しいルーティング構造に必要なコードを追加する。ただし、この Phase ではページのディレクトリ移動は行わない。既存のルーティングは維持したまま、新しいコードを「準備」として追加する。

## PR 3a: Apollo Client 準備

### 目的

Apollo Client が URL パスから communityId を抽出できるようにする。環境変数へのフォールバックを維持し、既存の動作を壊さない。

### 変更対象ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/lib/apollo.ts` | communityId 抽出ロジック追加（フォールバック付き） |

### 実装コード（転記用）

#### apollo.ts 変更

```typescript
// src/lib/apollo.ts
// ファイル先頭に以下のヘルパー関数を追加

import { setContext } from "@apollo/client/link/context";
import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { auth } from "@/lib/auth/init/firebase";

// Helper to get communityId from Next.js headers on server-side
async function getServerSideCommunityId(): Promise<string | null> {
  try {
    const { headers } = await import("next/headers");
    const headersList = await headers();
    return headersList.get("x-community-id");
  } catch {
    return null;
  }
}

// Extract communityId from URL path (first segment after /)
function extractCommunityIdFromPath(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return null;
  }
  const firstSegment = segments[0];
  // Skip if it's a known non-community path
  const nonCommunityPaths = ["api", "_next", "favicon.ico", "robots.txt", "sitemap.xml"];
  if (nonCommunityPaths.includes(firstSegment)) {
    return null;
  }
  return firstSegment;
}

// Extract communityId from liff.state parameter
function extractCommunityIdFromLiffState(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const searchParams = new URLSearchParams(window.location.search);
  const liffState = searchParams.get("liff.state");
  if (!liffState) {
    return null;
  }
  // liff.state is URL-encoded, decode it first
  try {
    const decodedLiffState = decodeURIComponent(liffState);
    return extractCommunityIdFromPath(decodedLiffState);
  } catch {
    return null;
  }
}

// requestLink を以下のように変更
const requestLink = setContext(async (operation, prevContext) => {
  const isBrowser = typeof window !== "undefined";

  // Get Firebase ID token
  let token: string | null = null;
  let authMode: "token" | "session" = "token";

  if (isBrowser) {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        token = await currentUser.getIdToken();
      } catch (error) {
        console.error("Failed to get ID token:", error);
      }
    }
  } else {
    // Server-side: try to get session cookie
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get("session");
      if (sessionCookie?.value) {
        token = sessionCookie.value;
        authMode = "session";
      }
    } catch {
      // Ignore errors in non-request contexts
    }
  }

  // Extract communityId from current URL path (dynamic multi-tenant routing)
  // Fallback to env var for backward compatibility
  let communityId: string | null = null;
  if (isBrowser) {
    // 1. Try to extract from URL path
    communityId = extractCommunityIdFromPath(window.location.pathname);
    
    // 2. If not found, try liff.state parameter (LINE OAuth callback)
    if (!communityId) {
      communityId = extractCommunityIdFromLiffState();
    }
  } else {
    // Server-side: get from request headers (set by middleware)
    communityId = await getServerSideCommunityId();
  }

  // 3. Fallback to environment variable (backward compatibility)
  if (!communityId) {
    communityId = process.env.NEXT_PUBLIC_COMMUNITY_ID ?? null;
  }

  const headers: Record<string, string> = {
    ...prevContext.headers,
    "X-Auth-Mode": authMode,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (communityId) {
    headers["X-Community-Id"] = communityId;
  }

  return { headers };
});

// エラーリンク
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// HTTP リンク
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  credentials: "include",
});

// Apollo Client インスタンス
export const apolloClient = new ApolloClient({
  link: from([errorLink, requestLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export default apolloClient;
```

### 実装手順

1. `extractCommunityIdFromPath()` 関数を追加
2. `extractCommunityIdFromLiffState()` 関数を追加
3. `getServerSideCommunityId()` 関数を追加
4. `requestLink` で communityId 抽出ロジックを追加
5. 環境変数へのフォールバックを維持

### テスト方法

```bash
# civicship-portal ディレクトリで実行

# 型チェック
pnpm lint

# ビルド確認
pnpm build

# ローカルで動作確認
pnpm dev
```

動作確認手順:
1. `pnpm dev` でサーバーを起動
2. 既存の URL（`/activities`）でアクセスし、環境変数から communityId が取得されることを確認
3. ブラウザの開発者ツールで Network タブを開き、GraphQL リクエストの `X-Community-Id` ヘッダーを確認
4. 新しい URL（`/neo88/activities`）でアクセスし、パスから communityId が抽出されることを確認（Phase 4 後）

### 参照

- apollo.ts: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/src/lib/apollo.ts

### 注意事項

- 環境変数フォールバックを必ず維持する
- この PR 単体では動作に変化なし（既存の URL 構造のため）
- liff.state パラメータは URL エンコードされているため、デコードが必要

---

## PR 3b: Middleware 準備

### 目的

Middleware が新しい URL 構造（`/[communityId]/...`）を処理できるようにする。既存の URL 構造も引き続きサポート。

### 変更対象ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/middleware.ts` | 新ルーティングロジック追加 |
| `src/lib/communities/config-env.ts` | Edge Runtime 用設定取得関数（新規作成） |

### 実装コード（転記用）

#### 1. config-env.ts（新規作成）

```typescript
// src/lib/communities/config-env.ts
// Edge Runtime で使用可能なコミュニティ設定取得関数

export interface CommunityConfigForEdge {
  communityId: string;
  enableFeatures: string[];
  rootPath: string;
}

// 静的な設定マップ（Edge Runtime では DB アクセス不可のため）
const COMMUNITY_CONFIGS: Record<string, CommunityConfigForEdge> = {
  neo88: {
    communityId: "neo88",
    enableFeatures: [
      "/activities",
      "/activities/[id]",
      "/users",
      "/users/[id]",
      "/users/me",
      "/wallets",
      "/admin",
    ],
    rootPath: "/activities",
  },
  // 他のコミュニティ設定を追加
};

export async function fetchCommunityConfigForEdge(
  communityId: string
): Promise<CommunityConfigForEdge | null> {
  return COMMUNITY_CONFIGS[communityId] ?? null;
}
```

#### 2. middleware.ts 変更

```typescript
// src/middleware.ts
// 完全な実装

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchCommunityConfigForEdge } from "@/lib/communities/config-env";

// Extract communityId from URL path (first segment after /)
function extractCommunityIdFromPath(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return null;
  }
  const firstSegment = segments[0];
  // Skip if it's a known non-community path
  const nonCommunityPaths = ["api", "_next", "favicon.ico", "robots.txt", "sitemap.xml"];
  if (nonCommunityPaths.includes(firstSegment)) {
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

// Check if path matches any enabled feature pattern
function isFeatureEnabled(path: string, enabledFeatures: string[]): boolean {
  // Normalize path (remove trailing slash)
  const normalizedPath = path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
  
  return enabledFeatures.some((feature) => {
    // Convert feature pattern to regex
    // e.g., "/activities/[id]" -> /^\/activities\/[^/]+$/
    const pattern = feature
      .replace(/\[([^\]]+)\]/g, "[^/]+")  // Replace [param] with regex
      .replace(/\*/g, ".*");               // Replace * with wildcard
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(normalizedPath);
  });
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // Static files like favicon.ico
  ) {
    return NextResponse.next();
  }
  
  // Try to extract communityId from URL path
  let communityId = extractCommunityIdFromPath(pathname);
  
  // Handle liff.state parameter for LINE OAuth callback
  const liffState = request.nextUrl.searchParams.get("liff.state");
  if (!communityId && liffState) {
    try {
      const decodedLiffState = decodeURIComponent(liffState);
      communityId = extractCommunityIdFromPath(decodedLiffState);
    } catch {
      // Ignore decode errors
    }
  }
  
  // If no communityId in path, fall back to env var (backward compatibility)
  if (!communityId) {
    communityId = process.env.NEXT_PUBLIC_COMMUNITY_ID ?? null;
  }
  
  if (!communityId) {
    return NextResponse.next();
  }
  
  // Fetch config using communityId
  const config = await fetchCommunityConfigForEdge(communityId);
  const enabledFeatures = config?.enableFeatures || [];
  const rootPath = config?.rootPath || "/activities";

  // Get path relative to communityId (for new URL structure)
  const relativePath = getPathWithoutCommunityId(pathname, communityId);

  // Feature gating: check if the path is enabled for this community
  if (relativePath !== "/" && !isFeatureEnabled(relativePath, enabledFeatures)) {
    // Redirect to root path if feature is not enabled
    const redirectUrl = new URL(`/${communityId}${rootPath}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Handle root path redirect
  if (relativePath === "/") {
    const redirectUrl = new URL(`/${communityId}${rootPath}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Set x-community-id header for server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-community-id", communityId);
  
  const res = NextResponse.next({
    request: { headers: requestHeaders },
  });
  
  res.headers.set("x-community-id", communityId);
  
  // Set cookie as fallback for client-side access
  res.cookies.set("x-community-id", communityId, {
    path: "/",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour
  });
  
  return res;
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
```

### 実装手順

1. `src/lib/communities/config-env.ts` を作成
2. `extractCommunityIdFromPath()` 関数を追加
3. `getPathWithoutCommunityId()` 関数を追加
4. `isFeatureEnabled()` 関数を追加
5. communityId 抽出ロジックを追加（パス優先、環境変数フォールバック）
6. `x-community-id` ヘッダーと Cookie を設定
7. feature gating を `relativePath` ベースに変更

### テスト方法

```bash
# civicship-portal ディレクトリで実行

# 型チェック
pnpm lint

# ビルド確認
pnpm build

# ローカルで動作確認
pnpm dev
```

動作確認手順:
1. `pnpm dev` でサーバーを起動
2. 既存の URL（`/activities`）でアクセスし、環境変数から communityId が取得されることを確認
3. ブラウザの開発者ツールで Application > Cookies を開き、`x-community-id` Cookie が設定されていることを確認
4. Network タブでレスポンスヘッダーに `x-community-id` が含まれていることを確認

### 参照

- middleware.ts: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/src/middleware.ts

### 注意事項

- 環境変数フォールバックを必ず維持する
- 既存の URL 構造での動作を壊さない
- Edge Runtime では DB アクセス不可のため、静的な設定マップを使用

---

## PR 3c: レガシー URL リダイレクト準備

### 目的

旧 URL（`/activities`）から新 URL（`/[communityId]/activities`）へのリダイレクトロジックを準備する。ただし、Phase 4 でページ移動するまでは有効化しない。

### 変更対象ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/middleware.ts` | リダイレクトロジック追加（NODE_ENV で制御） |

### 実装コード（転記用）

#### middleware.ts にリダイレクトロジックを追加

```typescript
// src/middleware.ts
// middleware 関数の先頭に以下のリダイレクトロジックを追加

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProduction = process.env.NODE_ENV === "production";
  
  // Skip static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }
  
  // Extract communityId from path
  let communityId = extractCommunityIdFromPath(pathname);
  
  // Legacy URL redirect (only in non-production environments initially)
  // After Phase 4 deployment, remove the isProduction check
  if (!communityId) {
    // Get default communityId from env var
    const defaultCommunityId = process.env.NEXT_PUBLIC_COMMUNITY_ID;
    
    // Check if this is a legacy URL that needs redirect
    const legacyPaths = [
      "/activities",
      "/users",
      "/wallets",
      "/admin",
      "/opportunities",
      "/places",
      "/articles",
      "/reservations",
      "/tickets",
    ];
    
    const isLegacyPath = legacyPaths.some(
      (legacyPath) => pathname === legacyPath || pathname.startsWith(`${legacyPath}/`)
    );
    
    if (defaultCommunityId && isLegacyPath) {
      // 開発環境: 即座にリダイレクト
      // 本番環境: Phase 4 デプロイ後に isProduction チェックを削除
      if (!isProduction) {
        // Redirect /activities to /neo88/activities
        const newUrl = new URL(`/${defaultCommunityId}${pathname}`, request.url);
        newUrl.search = request.nextUrl.search;
        return NextResponse.redirect(newUrl, { status: 308 });
      }
    }
  }
  
  // Handle liff.state parameter for LINE OAuth callback
  const liffState = request.nextUrl.searchParams.get("liff.state");
  if (!communityId && liffState) {
    try {
      const decodedLiffState = decodeURIComponent(liffState);
      communityId = extractCommunityIdFromPath(decodedLiffState);
    } catch {
      // Ignore decode errors
    }
  }
  
  // If no communityId in path, fall back to env var (backward compatibility)
  if (!communityId) {
    communityId = process.env.NEXT_PUBLIC_COMMUNITY_ID ?? null;
  }
  
  // ... 残りの処理（PR 3b と同じ）
}
```

### Phase 4 デプロイ後の変更

Phase 4 でページを `[communityId]` ディレクトリに移動した後、以下の変更を行う:

```typescript
// 変更前（開発環境のみリダイレクト）
if (!isProduction) {
  const newUrl = new URL(`/${defaultCommunityId}${pathname}`, request.url);
  newUrl.search = request.nextUrl.search;
  return NextResponse.redirect(newUrl, { status: 308 });
}

// 変更後（本番環境でもリダイレクト）
const newUrl = new URL(`/${defaultCommunityId}${pathname}`, request.url);
newUrl.search = request.nextUrl.search;
return NextResponse.redirect(newUrl, { status: 308 });
```

### 実装手順

1. NODE_ENV を使用してリダイレクトを制御
2. 開発環境（NODE_ENV !== "production"）では新ルーティングを有効化
3. 本番環境（NODE_ENV === "production"）では Phase 4 デプロイ後に有効化
4. 308 Permanent Redirect を使用（SEO に影響なし）

### テスト方法

```bash
# civicship-portal ディレクトリで実行

# 型チェック
pnpm lint

# ビルド確認
pnpm build

# ローカルで動作確認
pnpm dev
```

動作確認手順:
1. `pnpm dev` でサーバーを起動
2. 開発環境で旧 URL（`/activities`）にアクセス
3. 新 URL（`/neo88/activities`）にリダイレクトされることを確認
4. クエリパラメータが保持されることを確認（例: `/activities?page=2` → `/neo88/activities?page=2`）

### 参照

- middleware.ts: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/src/middleware.ts

### 注意事項

- 新しい環境変数は追加しない（NODE_ENV を使用）
- 開発環境では新ルーティングが有効、本番環境では Phase 4 デプロイ後に有効化
- LINE リッチメニューなどの外部リンクが壊れないようにするための対策
- 308 Permanent Redirect を使用（ブラウザがリダイレクトをキャッシュ）

### リダイレクト対象パス

| 旧 URL | 新 URL |
|--------|--------|
| `/activities` | `/[communityId]/activities` |
| `/activities/[id]` | `/[communityId]/activities/[id]` |
| `/users/me` | `/[communityId]/users/me` |
| `/users/[id]` | `/[communityId]/users/[id]` |
| `/wallets` | `/[communityId]/wallets` |
| `/admin/*` | `/[communityId]/admin/*` |
| `/opportunities/*` | `/[communityId]/opportunities/*` |
| `/places/*` | `/[communityId]/places/*` |
| `/articles/*` | `/[communityId]/articles/*` |
| `/reservations/*` | `/[communityId]/reservations/*` |
| `/tickets/*` | `/[communityId]/tickets/*` |
