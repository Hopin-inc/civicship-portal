# Phase 2: Frontend 基盤

## 概要

Frontend にルーティング非依存のユーティリティと Mini-app 対応を追加する。既存のルーティング構造は維持。

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

---

## PR 2b: Mini-app 403 エラー対策（Phase 5b で有効化）

### 目的

LINE Mini-app 環境で発生する 403 エラー（profile スコープ不足）を解決する。

### 重要: 有効化タイミング

この機能は **Phase 5b（CI/CD 単一デプロイ + 認証完全移行）で有効化** する。Phase 2b では準備のみを行い、本番環境では有効化しない。

理由: 本番環境で統合チャネルへの移行が完了する前に `ensureProfilePermission()` を有効化すると、既存の認証フローに影響を与える可能性がある。

### 背景

LINE の「チャネル同意の簡略化」により、Mini-app からのアクセス時にデフォルトで `openid` スコープのみが付与される。バックエンドで `getProfile` を呼び出す際に `profile` スコープが必要なため、403 エラーが発生する。

参照: https://developers.line.biz/ja/news/2025/10/31/channel-consent-simplification/

### 変更対象ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/lib/auth/service/liff-service.ts` | `ensureProfilePermission()` 追加、`signInWithLiffToken()` 変更 |
| `src/lib/auth/init/firebase.ts` | LIFF サインイン失敗時の処理改善 |

### 実装コード（転記用）

#### 1. ensureProfilePermission メソッド追加

```typescript
// src/lib/auth/service/liff-service.ts
// LiffService クラスに以下の private メソッドを追加

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
    // エラーが発生しても処理を継続（graceful degradation）
  }
}
```

#### 2. signInWithLiffToken メソッド変更

```typescript
// src/lib/auth/service/liff-service.ts
// signInWithLiffToken メソッドを以下のように変更

public async signInWithLiffToken(): Promise<boolean> {
  const accessToken = this.getAccessToken();
  if (!accessToken) {
    logger.info("No LIFF access token available", {
      authType: "liff",
      component: "LiffService",
    });
    return false;
  }

  // Mini-app 環境で profile スコープを確保
  await this.ensureProfilePermission();

  try {
    // 変更: configId を "integrated" に固定
    const response = await fetch("/api/line/liff-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Community-Id": this.communityId,
      },
      body: JSON.stringify({
        accessToken,
        configId: "integrated",  // 変更: communityId → "integrated"
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error("LIFF login API failed", {
        authType: "liff",
        component: "LiffService",
        status: response.status,
        error: errorData,
      });
      return false;
    }

    const data = await response.json();
    const { customToken } = data;

    // Firebase にカスタムトークンでサインイン
    await signInWithCustomToken(auth, customToken);

    logger.info("LIFF sign-in successful", {
      authType: "liff",
      component: "LiffService",
    });

    return true;
  } catch (error) {
    const processedError = error instanceof Error ? error : new Error(String(error));
    logger.error("LIFF sign-in failed", {
      authType: "liff",
      component: "LiffService",
      error: processedError.message,
    });
    return false;
  }
}
```

#### 3. Firebase 初期化の改善（LIFF サインイン失敗時の処理）

```typescript
// src/lib/auth/init/firebase.ts
// initializeFirebase 関数の戻り値の型を変更

// 変更前:
// export async function initializeFirebase(): Promise<User | null>

// 変更後:
export interface InitializeFirebaseResult {
  user: User | null;
  signInFailed: boolean;  // LIFF サインインが明示的に失敗したかどうか
}

export async function initializeFirebase(): Promise<InitializeFirebaseResult> {
  // ... 既存の初期化処理

  // LIFF ログイン済みの場合
  if (liffService.isLoggedIn()) {
    const signInSuccess = await liffService.signInWithLiffToken();
    
    if (!signInSuccess) {
      // LIFF はログイン済みだが、Firebase サインインに失敗
      // この場合、無限ローディングを防ぐために signInFailed を true に設定
      logger.warn("LIFF logged in but Firebase sign-in failed", {
        authType: "liff",
        component: "initializeFirebase",
      });
      return { user: null, signInFailed: true };
    }

    // Firebase サインイン成功
    const user = auth.currentUser;
    return { user, signInFailed: false };
  }

  // LIFF 未ログインの場合
  return { user: null, signInFailed: false };
}
```

#### 4. AuthProvider での使用

```typescript
// src/lib/auth/provider/AuthProvider.tsx
// initializeFirebase の戻り値の処理を変更

useEffect(() => {
  const initialize = async () => {
    const result = await initializeFirebase();
    
    if (result.signInFailed) {
      // LIFF サインインが失敗した場合、ローディングを終了してエラー状態に
      setIsLoading(false);
      setError(new Error("LIFF sign-in failed"));
      return;
    }

    setUser(result.user);
    setIsLoading(false);
  };

  initialize();
}, []);
```

### 実装手順

1. `LiffService` に `ensureProfilePermission()` private メソッドを追加
2. `signInWithLiffToken()` の先頭で `ensureProfilePermission()` を呼び出す
3. `signInWithLiffToken()` の configId を `"integrated"` に変更
4. `initializeFirebase()` の戻り値の型を `InitializeFirebaseResult` に変更
5. `AuthProvider` で `signInFailed` フラグを処理
6. ログ出力を追加

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

ローカルでの動作確認手順:
1. `pnpm dev` でサーバーを起動
2. 通常のブラウザ環境で既存の認証フローが正常に動作することを確認
3. LINE Mini-app 環境でログインを試行（実機テスト必要）
   - 初回アクセス時に profile 権限の同意画面が表示されることを確認
   - 同意後、403 エラーなくログインできることを確認
4. 既に profile 権限を持っているユーザーは同意画面なしでログインできることを確認

### 参照

- liff-service.ts: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/src/lib/auth/service/liff-service.ts
- firebase.ts: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/src/lib/auth/init/firebase.ts

### 注意事項

- `liff.isInClient()` で Mini-app 環境かどうかを判定
- `liff.isApiAvailable("permission")` で permission API が利用可能か確認
- エラーが発生しても処理を継続（graceful degradation）
- Phase 5b で有効化するまで、本番環境では既存の認証フローを維持
