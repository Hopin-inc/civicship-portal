# Phase 2: Frontend 基盤

## 概要

Frontend にルーティング非依存のユーティリティを追加する。既存のルーティング構造は維持。

## PR 2a: ユーティリティ追加

### 目的

- `CommunityLink` コンポーネントを追加（将来のルーティング変更に備える）
- `useCommunityRouter` フックを追加
- `extractCommunityIdFromPath()` 関数を追加

### 変更対象ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/components/navigation/CommunityLink.tsx` | 新規作成 |
| `src/hooks/useCommunityRouter.ts` | 新規作成 |
| `src/lib/communities/utils.ts` | `extractCommunityIdFromPath()`, `getPathWithoutCommunityId()` 追加 |

### 実装コード（転記用）

#### 1. CommunityLink コンポーネント（新規作成）

```typescript
// src/components/navigation/CommunityLink.tsx
"use client";

import Link, { LinkProps } from "next/link";
import { useParams } from "next/navigation";
import { forwardRef, ReactNode } from "react";

interface CommunityLinkProps extends Omit<LinkProps, "href"> {
  href: LinkProps["href"];
  children: ReactNode;
  className?: string;
}

const CommunityLink = forwardRef<HTMLAnchorElement, CommunityLinkProps>(
  ({ href, children, ...props }, ref) => {
    const params = useParams();
    const communityId = params?.communityId as string | undefined;

    const buildHref = (originalHref: LinkProps["href"]): LinkProps["href"] => {
      if (!communityId) {
        return originalHref;
      }

      if (typeof originalHref === "string") {
        // Skip if already has communityId prefix or is external/absolute URL
        if (
          originalHref.startsWith(`/${communityId}`) ||
          originalHref.startsWith("http://") ||
          originalHref.startsWith("https://") ||
          originalHref.startsWith("//")
        ) {
          return originalHref;
        }

        // Add communityId prefix
        const path = originalHref.startsWith("/") ? originalHref : `/${originalHref}`;
        return `/${communityId}${path}`;
      }

      // Handle UrlObject
      if (typeof originalHref === "object" && originalHref !== null) {
        const { pathname, ...rest } = originalHref;
        if (pathname) {
          // Skip if already has communityId prefix
          if (pathname.startsWith(`/${communityId}`)) {
            return originalHref;
          }
          const newPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
          return {
            ...rest,
            pathname: `/${communityId}${newPathname}`,
          };
        }
        return originalHref;
      }

      return originalHref;
    };

    const finalHref = buildHref(href);

    return (
      <Link ref={ref} href={finalHref} {...props}>
        {children}
      </Link>
    );
  }
);

CommunityLink.displayName = "CommunityLink";

export { CommunityLink };
export default CommunityLink;
```

#### 2. useCommunityRouter フック（新規作成）

```typescript
// src/hooks/useCommunityRouter.ts
"use client";

import { useRouter, useParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useCommunityRouter() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const communityId = params?.communityId as string | undefined;

  const buildHref = useCallback(
    (href: string) => {
      if (!communityId) {
        return href;
      }

      // Handle query-only navigation (e.g., "?tab=member")
      if (href.startsWith("?")) {
        return `${pathname}${href}`;
      }

      // Skip if already has communityId prefix or is external/absolute URL
      if (
        href.startsWith(`/${communityId}`) ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("//")
      ) {
        return href;
      }

      // Ensure path starts with /
      const path = href.startsWith("/") ? href : `/${href}`;
      return `/${communityId}${path}`;
    },
    [communityId, pathname]
  );

  return useMemo(
    () => ({
      ...router,
      push: (href: string, options?: Parameters<typeof router.push>[1]) => {
        router.push(buildHref(href), options);
      },
      replace: (href: string, options?: Parameters<typeof router.replace>[1]) => {
        router.replace(buildHref(href), options);
      },
      prefetch: (href: string, options?: Parameters<typeof router.prefetch>[1]) => {
        router.prefetch(buildHref(href), options);
      },
    }),
    [router, buildHref]
  );
}
```

#### 3. ユーティリティ関数（新規作成）

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
  const nonCommunityPaths = ["api", "_next", "favicon.ico", "robots.txt", "sitemap.xml"];
  if (nonCommunityPaths.includes(firstSegment)) {
    return null;
  }
  return firstSegment;
}

/**
 * communityId プレフィックスを除いたパスを取得
 * 例: "/neo88/activities" → "/activities"
 * 
 * 用途: Middleware の feature gating で使用。
 * communityId プレフィックスを除いたパスを取得し、
 * そのパスが有効な機能かどうかを判定する。
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

### Link → CommunityLink 置き換え対象ファイル

以下のファイルで `import Link from "next/link"` を `import { CommunityLink } from "@/components/navigation/CommunityLink"` に置き換え、`<Link>` を `<CommunityLink>` に変更する。

```bash
# 置き換え対象ファイルの検索コマンド
grep -r "from \"next/link\"" src/ --include="*.tsx" | grep -v "CommunityLink"
```

主な置き換え対象:
- `src/components/shared/` 配下のコンポーネント
- `src/app/` 配下のページコンポーネント
- `src/features/` 配下の機能コンポーネント

置き換え例:
```typescript
// 変更前
import Link from "next/link";
// ...
<Link href="/activities">Activities</Link>

// 変更後
import { CommunityLink } from "@/components/navigation/CommunityLink";
// ...
<CommunityLink href="/activities">Activities</CommunityLink>
```

### router.push → useCommunityRouter 置き換え対象

以下のパターンを `useCommunityRouter` に置き換える:

```typescript
// 変更前
import { useRouter } from "next/navigation";
const router = useRouter();
router.push("/activities");

// 変更後
import { useCommunityRouter } from "@/hooks/useCommunityRouter";
const router = useCommunityRouter();
router.push("/activities");
```

### 実装手順

1. `src/lib/communities/utils.ts` を作成し、ユーティリティ関数を追加
2. `src/components/navigation/CommunityLink.tsx` を作成
3. `src/hooks/useCommunityRouter.ts` を作成
4. 全ての内部リンクを `Link` から `CommunityLink` に置き換え
5. 全ての `router.push/replace` を `useCommunityRouter` に置き換え
6. 単体テストを追加

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
2. ブラウザで `/activities` にアクセス
3. リンクをクリックして正しく遷移することを確認
4. `communityId` がない状態でも正常に動作することを確認

### 参照

- CommunityLink: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/src/components/navigation/CommunityLink.tsx
- useCommunityRouter: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/src/hooks/useCommunityRouter.ts

### 注意事項

- この PR で既存の `Link` を `CommunityLink` に置き換える
- `CommunityLink` は `communityId` がない場合は元の href をそのまま返すため、既存の動作は維持される
- Phase 4 ではディレクトリ移動のみを行う（Link 置き換えは不要）
