# Phase 2: Frontend 基盤

## 概要

Frontend にルーティング非依存のユーティリティと Mini-app 対応を追加する。既存のルーティング構造は維持。

## PR 2a: ユーティリティ追加

### 目的

- `CommunityLink` コンポーネントを追加（将来のルーティング変更に備える）
- `extractCommunityIdFromPath()` 関数を追加

### 変更対象ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/components/navigation/CommunityLink.tsx` | 新規作成 |
| `src/lib/communities/utils.ts` | `extractCommunityIdFromPath()` 追加 |

### epic/mini-appify 参照コード

#### CommunityLink コンポーネント

```typescript
// src/components/navigation/CommunityLink.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ComponentProps, useMemo } from "react";

type LinkProps = ComponentProps<typeof Link>;

interface CommunityLinkProps extends Omit<LinkProps, "href"> {
  href: string | { pathname: string; query?: Record<string, string> };
}

export function CommunityLink({ href, children, ...props }: CommunityLinkProps) {
  const params = useParams();
  const communityId = params?.communityId as string | undefined;

  const resolvedHref = useMemo(() => {
    if (!communityId) return href;

    if (typeof href === "string") {
      // Skip if already has communityId prefix or is external
      if (href.startsWith(`/${communityId}`) || href.startsWith("http")) {
        return href;
      }
      // Add communityId prefix
      return `/${communityId}${href.startsWith("/") ? href : `/${href}`}`;
    }

    // Handle UrlObject
    const { pathname, ...rest } = href;
    if (pathname?.startsWith(`/${communityId}`) || pathname?.startsWith("http")) {
      return href;
    }
    return {
      ...rest,
      pathname: `/${communityId}${pathname?.startsWith("/") ? pathname : `/${pathname}`}`,
    };
  }, [href, communityId]);

  return (
    <Link href={resolvedHref} {...props}>
      {children}
    </Link>
  );
}
```

参照: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/src/components/navigation/CommunityLink.tsx

#### extractCommunityIdFromPath 関数

```typescript
// src/lib/communities/utils.ts

/**
 * URL パスから communityId を抽出する
 * 例: "/neo88/activities" → "neo88"
 * 例: "/activities" → null
 */
export function extractCommunityIdFromPath(pathname: string): string | null {
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

/**
 * communityId プレフィックスを除いたパスを取得
 * 例: "/neo88/activities" → "/activities"
 */
export function getPathWithoutCommunityId(pathname: string, communityId: string): string {
  const prefix = `/${communityId}`;
  if (pathname.startsWith(prefix)) {
    const remaining = pathname.slice(prefix.length);
    return remaining || "/";
  }
  return pathname;
}
```

参照: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/src/middleware.ts#L19-L38

### 実装手順

1. `src/lib/communities/utils.ts` を作成し、ユーティリティ関数を追加
2. `src/components/navigation/CommunityLink.tsx` を作成
3. 単体テストを追加

### テスト方法

1. `extractCommunityIdFromPath()` の単体テスト
   - `/neo88/activities` → `"neo88"`
   - `/activities` → `null`
   - `/api/health` → `null`
2. `CommunityLink` が正しく href を変換することを確認
   - communityId がない場合は元の href をそのまま使用
   - communityId がある場合はプレフィックスを追加

### 注意事項

- この PR では `CommunityLink` を使用する箇所は変更しない
- Phase 4 でページ移動時に既存の `Link` を `CommunityLink` に置き換える

---

## PR 2b: Mini-app 403 エラー対策

### 目的

LINE Mini-app 環境で発生する 403 エラー（profile スコープ不足）を解決する。

### 背景

LINE の「チャネル同意の簡略化」により、Mini-app からのアクセス時にデフォルトで `openid` スコープのみが付与される。バックエンドで `getProfile` を呼び出す際に `profile` スコープが必要なため、403 エラーが発生する。

参照: https://developers.line.biz/ja/news/2025/10/31/channel-consent-simplification/

### 変更対象ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/lib/auth/service/liff-service.ts` | `ensureProfilePermission()` 追加 |

### epic/mini-appify 参照コード

#### ensureProfilePermission メソッド

```typescript
// src/lib/auth/service/liff-service.ts

/**
 * Mini App用: profileスコープの権限を確保する
 * チャネル同意の簡略化により、デフォルトではopenidのみ。
 * バックエンドでgetProfileを呼ぶ前に、この権限を取得する必要がある。
 */
private async ensureProfilePermission(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!liff.isInClient()) return;
  if (!liff.isApiAvailable("permission")) return;

  try {
    const permissionStatus = await liff.permission.query("profile");

    logger.info("LIFF profile permission status", {
      authType: "liff",
      component: "LiffService",
      state: permissionStatus.state,
    });

    if (permissionStatus.state === "prompt") {
      await liff.permission.requestAll();
    }
  } catch (error) {
    const processedError = error instanceof Error ? error : new Error(String(error));
    logger.info("LIFF profile permission check failed", {
      authType: "liff",
      component: "LiffService",
      error: processedError.message,
    });
  }
}
```

参照: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/src/lib/auth/service/liff-service.ts#L223-L252

#### signInWithLiffToken での呼び出し

```typescript
// src/lib/auth/service/liff-service.ts

public async signInWithLiffToken(): Promise<boolean> {
  const accessToken = this.getAccessToken();
  if (!accessToken) {
    return false;
  }

  // Mini-app 環境で profile スコープを確保
  await this.ensureProfilePermission();

  // ... 残りの処理
}
```

参照: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/src/lib/auth/service/liff-service.ts#L262-L268

### 実装手順

1. `LiffService` に `ensureProfilePermission()` private メソッドを追加
2. `signInWithLiffToken()` の先頭で `ensureProfilePermission()` を呼び出す
3. ログ出力を追加

### テスト方法

1. 通常のブラウザ環境で既存の認証フローが正常に動作することを確認
2. LINE Mini-app 環境でログインを試行
   - 初回アクセス時に profile 権限の同意画面が表示されることを確認
   - 同意後、403 エラーなくログインできることを確認
3. 既に profile 権限を持っているユーザーは同意画面なしでログインできることを確認

### 注意事項

- `liff.isInClient()` で Mini-app 環境かどうかを判定
- `liff.isApiAvailable("permission")` で permission API が利用可能か確認
- エラーが発生しても処理を継続（graceful degradation）
