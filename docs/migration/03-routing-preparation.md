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

### epic/mini-appify 参照コード

#### apollo.ts 変更

```typescript
// src/lib/apollo.ts

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
  if (["api", "_next", "favicon.ico"].includes(firstSegment)) {
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
  return extractCommunityIdFromPath(liffState);
}

const requestLink = setContext(async (operation, prevContext) => {
  const isBrowser = typeof window !== "undefined";
  // ... 既存のトークン取得処理

  // Extract communityId from current URL path (dynamic multi-tenant routing)
  // Fallback to env var for backward compatibility
  let communityId: string | null = null;
  if (isBrowser) {
    communityId = extractCommunityIdFromPath(window.location.pathname);
    if (!communityId) {
      communityId = extractCommunityIdFromLiffState();
    }
  } else {
    communityId = await getServerSideCommunityId();
  }

  // Fallback to environment variable (backward compatibility)
  if (!communityId) {
    communityId = process.env.NEXT_PUBLIC_COMMUNITY_ID ?? null;
  }

  const headers = {
    ...prevContext.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "X-Auth-Mode": authMode,
    // Use dynamic communityId from URL path, fallback to env var
    ...(communityId ? { "X-Community-Id": communityId } : {}),
  };

  return { headers };
});
```

参照: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/src/lib/apollo.ts

### 実装手順

1. `extractCommunityIdFromPath()` 関数を追加
2. `extractCommunityIdFromLiffState()` 関数を追加
3. `getServerSideCommunityId()` 関数を追加
4. `requestLink` で communityId 抽出ロジックを追加
5. 環境変数へのフォールバックを維持

### テスト方法

1. 既存の URL（`/activities`）でアクセスし、環境変数から communityId が取得されることを確認
2. 新しい URL（`/neo88/activities`）でアクセスし、パスから communityId が抽出されることを確認（Phase 4 後）

### 注意事項

- 環境変数フォールバックを必ず維持する
- この PR 単体では動作に変化なし（既存の URL 構造のため）

---

## PR 3b: Middleware 準備

### 目的

Middleware が新しい URL 構造（`/[communityId]/...`）を処理できるようにする。既存の URL 構造も引き続きサポート。

### 変更対象ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/middleware.ts` | 新ルーティングロジック追加 |

### epic/mini-appify 参照コード

#### middleware.ts 変更

```typescript
// src/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchCommunityConfigForEdge } from "@/lib/communities/config-env";

// Extract communityId from URL path
function extractCommunityIdFromPath(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return null;
  }
  const firstSegment = segments[0];
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
  const pathname = request.nextUrl.pathname;
  
  // Try to extract communityId from URL path
  let communityId = extractCommunityIdFromPath(pathname);
  
  // Handle liff.state parameter for LINE OAuth callback
  const liffState = request.nextUrl.searchParams.get("liff.state");
  if (!communityId && liffState) {
    const decodedLiffState = decodeURIComponent(liffState);
    communityId = extractCommunityIdFromPath(decodedLiffState);
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

  // ... feature gating logic using relativePath

  // Set x-community-id header for server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-community-id", communityId);
  
  const res = NextResponse.next({
    request: { headers: requestHeaders },
  });
  
  res.headers.set("x-community-id", communityId);
  
  // Set cookie as fallback
  res.cookies.set("x-community-id", communityId, {
    path: "/",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60,
  });
  
  return res;
}
```

参照: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/src/middleware.ts

### 実装手順

1. `extractCommunityIdFromPath()` 関数を追加
2. `getPathWithoutCommunityId()` 関数を追加
3. communityId 抽出ロジックを追加（パス優先、環境変数フォールバック）
4. `x-community-id` ヘッダーと Cookie を設定
5. feature gating を `relativePath` ベースに変更

### テスト方法

1. 既存の URL（`/activities`）でアクセスし、環境変数から communityId が取得されることを確認
2. `x-community-id` ヘッダーが正しく設定されることを確認

### 注意事項

- 環境変数フォールバックを必ず維持する
- 既存の URL 構造での動作を壊さない

---

## PR 3c: レガシー URL リダイレクト準備

### 目的

旧 URL（`/activities`）から新 URL（`/[communityId]/activities`）へのリダイレクトロジックを準備する。ただし、Phase 4 でページ移動するまでは有効化しない。

### 変更対象ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/middleware.ts` | リダイレクトロジック追加（条件付き） |

### 実装方針

```typescript
// src/middleware.ts

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if new routing structure is enabled
  // This flag will be set to true in Phase 4
  const isNewRoutingEnabled = process.env.NEXT_PUBLIC_NEW_ROUTING_ENABLED === "true";
  
  // Extract communityId from path
  let communityId = extractCommunityIdFromPath(pathname);
  
  // Legacy URL redirect (only when new routing is enabled)
  if (isNewRoutingEnabled && !communityId) {
    // Get default communityId from env var
    const defaultCommunityId = process.env.NEXT_PUBLIC_COMMUNITY_ID;
    
    if (defaultCommunityId && pathname !== "/") {
      // Redirect /activities to /neo88/activities
      const newUrl = new URL(`/${defaultCommunityId}${pathname}`, request.url);
      newUrl.search = request.nextUrl.search;
      return NextResponse.redirect(newUrl, { status: 308 });
    }
  }
  
  // ... 残りの処理
}
```

### 実装手順

1. `NEXT_PUBLIC_NEW_ROUTING_ENABLED` 環境変数を追加（デフォルト: false）
2. リダイレクトロジックを追加（環境変数で制御）
3. 308 Permanent Redirect を使用

### テスト方法

1. `NEXT_PUBLIC_NEW_ROUTING_ENABLED=false` の状態で既存の URL が正常に動作することを確認
2. `NEXT_PUBLIC_NEW_ROUTING_ENABLED=true` の状態でリダイレクトが動作することを確認（Phase 4 後）

### 注意事項

- この PR 単体ではリダイレクトは無効
- Phase 4 でページ移動後に環境変数を有効化
- LINE リッチメニューなどの外部リンクが壊れないようにするための対策

### リダイレクト対象パス

| 旧 URL | 新 URL |
|--------|--------|
| `/activities` | `/[communityId]/activities` |
| `/activities/[id]` | `/[communityId]/activities/[id]` |
| `/users/me` | `/[communityId]/users/me` |
| `/wallets` | `/[communityId]/wallets` |
| `/admin/*` | `/[communityId]/admin/*` |
| ... | ... |
