# Phase 5: クリーンアップ + インフラ

## 概要

シャドウモードの削除、旧コードのクリーンアップ、CI/CD の単一デプロイ化を実施する。この Phase は Phase 4 完了後、十分な検証期間を経てから実施する。

## PR 5a: Backend クリーンアップ

### 目的

- シャドウモードコードを削除
- 旧認証ロジックを削除
- テナント関連コードを削除

### 変更対象ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/presentation/middleware/auth/firebase-auth.ts` | シャドウモード削除、新ロジックのみに |
| `src/presentation/middleware/auth/types.ts` | 不要な型定義削除 |
| `src/application/domain/account/auth/liff/usecase.ts` | 旧メソッド削除（必要に応じて） |

### 実装コード（転記用）

#### 1. firebase-auth.ts（クリーンアップ後）

```typescript
// src/presentation/middleware/auth/firebase-auth.ts
// シャドウモード削除後の最終形

import { auth } from "@/infrastructure/firebase/admin";
import { prismaClient } from "@/infrastructure/prisma/client";
import { createLoaders } from "@/presentation/graphql/loaders";
import { container } from "tsyringe";
import { MembershipService } from "@/application/domain/community/membership/service";
import { WalletService } from "@/application/domain/wallet/service";
import { logger } from "@/lib/logger";
import { AuthenticationError } from "@/presentation/graphql/errors";
import type { PrismaClientIssuer } from "@/infrastructure/prisma/issuer";
import type { AuthHeaders, AuthResult, AuthMeta, IContext } from "./types";

export async function handleFirebaseAuth(
  headers: AuthHeaders,
  issuer: PrismaClientIssuer,
): Promise<AuthResult> {
  const { idToken, authMode, communityId } = headers;
  const loaders = createLoaders(prismaClient);
  const authMeta: AuthMeta = { authMode };

  if (!idToken) {
    return { issuer, loaders, communityId, authMeta };
  }

  const verificationMethod = authMode === "session" ? "verifySessionCookie" : "verifyIdToken";

  try {
    const decoded = await (authMode === "session"
      ? auth.verifySessionCookie(idToken, false)
      : auth.verifyIdToken(idToken));
    const uid = decoded.uid;
    const platform = decoded.platform;

    // グローバル Identity（communityId: null）でユーザーを検索
    let currentUser = await issuer.internal((tx) =>
      tx.user.findFirst({
        where: {
          identities: {
            some: {
              uid: decoded.uid,
              communityId: null, // グローバル Identity のみ
            },
          },
        },
        include: {
          identities: {
            where: {
              OR: [{ platform: "PHONE" }, { communityId: null }],
            },
          },
          memberships: {
            where: { communityId },
          },
        },
      }),
    );

    // ユーザーが見つかった場合、Membership を自動作成
    if (currentUser) {
      const hasPhoneIdentity = currentUser.identities?.some(
        (identity) => identity.platform === "PHONE",
      );
      const hasMembership = currentUser.memberships && currentUser.memberships.length > 0;

      if (hasPhoneIdentity && !hasMembership) {
        try {
          const membershipService = container.resolve(MembershipService);
          const walletService = container.resolve(WalletService);

          const ctx: IContext = {
            issuer,
            loaders,
            communityId,
            uid: decoded.uid,
            currentUser,
          } as IContext;

          await issuer.public(ctx, async (tx) => {
            await membershipService.joinIfNeeded(ctx, currentUser!.id, communityId, tx);
            await walletService.createMemberWalletIfNeeded(ctx, currentUser!.id, communityId, tx);
          });

          // Membership 作成後、ユーザーを再取得
          currentUser = await issuer.internal((tx) =>
            tx.user.findFirst({
              where: { id: currentUser!.id },
              include: {
                identities: {
                  where: {
                    OR: [{ platform: "PHONE" }, { communityId: null }],
                  },
                },
                memberships: {
                  where: { communityId },
                },
              },
            }),
          );

          logger.info("Auto-created membership for user", {
            userId: currentUser?.id?.slice(-6),
            communityId,
          });
        } catch (membershipError) {
          logger.error("Failed to auto-create membership", {
            userId: currentUser?.id?.slice(-6),
            communityId,
            error: membershipError instanceof Error ? membershipError.message : String(membershipError),
          });
        }
      }
    }

    return {
      issuer,
      loaders,
      uid,
      idToken,
      platform,
      communityId,
      currentUser,
      authMeta,
    };
  } catch (err) {
    const error = err as any;
    logger.error("Firebase verification failed", {
      method: verificationMethod,
      communityId,
      errorCode: error.code || "unknown",
      errorMessage: error.message,
    });
    throw new AuthenticationError("Firebase authentication failed");
  }
}
```

#### 2. types.ts（クリーンアップ後）

```typescript
// src/presentation/middleware/auth/types.ts
// 不要な型定義を削除

import type { PrismaClientIssuer } from "@/infrastructure/prisma/issuer";
import type { DataLoaders } from "@/presentation/graphql/loaders";
import type { User } from "@prisma/client";

export interface AuthHeaders {
  idToken?: string;
  authMode: "token" | "session";
  communityId: string;
}

export interface AuthMeta {
  authMode: "token" | "session";
}

export interface AuthResult {
  issuer: PrismaClientIssuer;
  loaders: DataLoaders;
  uid?: string;
  idToken?: string;
  platform?: string;
  communityId: string;
  // 削除: tenantId?: string;
  currentUser?: User;
  authMeta: AuthMeta;
}

export interface IContext extends AuthResult {
  // コンテキスト固有のプロパティ
}
```

#### 3. 削除対象コード一覧

以下のコードを削除:

```typescript
// 削除: シャドウモード条件分岐
const isProduction = process.env.NODE_ENV === "production";
if (isProduction) {
  // 旧ロジック（削除）
  currentUser = await issuer.internal((tx) =>
    tx.user.findFirst({
      where: {
        identities: {
          some: {
            uid: decoded.uid,
            communityId, // コミュニティ固有 Identity
          },
        },
      },
    }),
  );
} else {
  // 新ロジック（残す）
}

// 削除: シャドウモード比較ログ
if (isProduction && currentUser) {
  const newUser = await findUserByGlobalIdentity(decoded.uid);
  if (newUser?.id !== currentUser.id) {
    logger.warn("Shadow mode mismatch", { ... });
  }
}

// 削除: tenantedAuth 関連コード
import { tenantedAuth } from "@/infrastructure/firebase/admin";
const decoded = await tenantedAuth(tenantId).verifyIdToken(idToken);
```

### 実装手順

1. シャドウモードの比較ログを確認し、差分がないことを確認
2. シャドウモード条件分岐を削除
3. 旧 Identity 検索ロジックを削除
4. `tenantedAuth` 関連コードを削除
5. 不要な型定義（`tenantId`）を削除
6. テストを更新

### テスト方法

```bash
# civicship-api ディレクトリで実行

# 型チェック
pnpm lint

# テスト実行
pnpm test

# ローカルで動作確認
pnpm dev:https
```

動作確認手順:
1. `pnpm dev:https` でサーバーを起動
2. 全ての認証フローが正常に動作することを確認
3. グローバル Identity での認証が正常に動作することを確認
4. Membership 自動作成が正常に動作することを確認

### 参照

- firebase-auth.ts: https://github.com/Hopin-inc/civicship-api/blob/epic/mini-appify/src/presentation/middleware/auth/firebase-auth.ts

### 注意事項

- シャドウモードのログで差分がないことを十分に確認してから実施
- ロールバックが困難なため、慎重に進める
- 本番環境で 1-2 週間のシャドウモード検証期間を設ける

---

## PR 5b: Frontend クリーンアップ + CI/CD + 認証完全移行

### 目的

- 環境変数フォールバックを削除
- CI/CD を単一デプロイに変更
- 認証サービスを完全に新ロジックに移行

### 重要: この PR は一括デプロイ必須

CI/CD の変更と認証サービスの変更は密接に関連しているため、一括でデプロイする必要がある。

### 変更対象ファイル

| カテゴリ | ファイル | 変更内容 |
|---------|---------|---------|
| Apollo Client | `src/lib/apollo.ts` | 環境変数フォールバック削除 |
| Middleware | `src/middleware.ts` | 環境変数フォールバック削除 |
| 認証サービス | `src/lib/auth/service/liff-service.ts` | "integrated" 設定に完全移行 |
| CI/CD | `.github/workflows/deploy-to-cloud-run-prod.yml` | Matrix ビルド削除、単一デプロイ化 |
| CI/CD | `.github/workflows/deploy-to-cloud-run-dev.yml` | Matrix ビルド削除、単一デプロイ化 |

### 実装コード（転記用）

#### 1. apollo.ts（クリーンアップ後）

```typescript
// src/lib/apollo.ts
// 環境変数フォールバックを削除

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
  try {
    const decodedLiffState = decodeURIComponent(liffState);
    return extractCommunityIdFromPath(decodedLiffState);
  } catch {
    return null;
  }
}

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

  // Extract communityId from current URL path
  // 削除: 環境変数フォールバック
  let communityId: string | null = null;
  if (isBrowser) {
    communityId = extractCommunityIdFromPath(window.location.pathname);
    if (!communityId) {
      communityId = extractCommunityIdFromLiffState();
    }
  } else {
    communityId = await getServerSideCommunityId();
  }

  // フォールバックなし - communityId が null の場合はヘッダーを送信しない
  // 削除: if (!communityId) { communityId = process.env.NEXT_PUBLIC_COMMUNITY_ID ?? null; }

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

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  credentials: "include",
});

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

#### 2. middleware.ts（クリーンアップ後）

```typescript
// src/middleware.ts
// 環境変数フォールバックを削除

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchCommunityConfigForEdge } from "@/lib/communities/config-env";

function extractCommunityIdFromPath(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return null;
  }
  const firstSegment = segments[0];
  const nonCommunityPaths = ["api", "_next", "favicon.ico", "robots.txt", "sitemap.xml"];
  if (nonCommunityPaths.includes(firstSegment)) {
    return null;
  }
  return firstSegment;
}

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
  
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }
  
  // Extract communityId from path
  let communityId = extractCommunityIdFromPath(pathname);
  
  // Handle liff.state parameter
  const liffState = request.nextUrl.searchParams.get("liff.state");
  if (!communityId && liffState) {
    try {
      const decodedLiffState = decodeURIComponent(liffState);
      communityId = extractCommunityIdFromPath(decodedLiffState);
    } catch {
      // Ignore decode errors
    }
  }
  
  // 削除: 環境変数フォールバック
  // 削除: if (!communityId) { communityId = process.env.NEXT_PUBLIC_COMMUNITY_ID ?? null; }
  
  // communityId がない場合はエラーページまたはコミュニティ選択ページにリダイレクト
  if (!communityId) {
    // オプション: コミュニティ選択ページにリダイレクト
    // return NextResponse.redirect(new URL("/select-community", request.url));
    return NextResponse.next();
  }
  
  const config = await fetchCommunityConfigForEdge(communityId);
  const enabledFeatures = config?.enableFeatures || [];
  const rootPath = config?.rootPath || "/activities";

  const relativePath = getPathWithoutCommunityId(pathname, communityId);

  // Handle root path redirect
  if (relativePath === "/") {
    const redirectUrl = new URL(`/${communityId}${rootPath}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-community-id", communityId);
  
  const res = NextResponse.next({
    request: { headers: requestHeaders },
  });
  
  res.headers.set("x-community-id", communityId);
  
  res.cookies.set("x-community-id", communityId, {
    path: "/",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60,
  });
  
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
```

#### 3. liff-service.ts（クリーンアップ後）

```typescript
// src/lib/auth/service/liff-service.ts
// "integrated" 設定に完全移行 + ensureProfilePermission() 有効化

import liff from "@line/liff";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/auth/init/firebase";
import { logger } from "@/lib/logger";

export class LiffService {
  private communityId: string;
  private initialized: boolean = false;

  constructor(communityId: string) {
    this.communityId = communityId;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    // 統合 LIFF ID を使用
    const liffId = process.env.NEXT_PUBLIC_INTEGRATED_LIFF_ID;
    if (!liffId) {
      throw new Error("NEXT_PUBLIC_INTEGRATED_LIFF_ID is not set");
    }

    await liff.init({ liffId });
    this.initialized = true;

    logger.info("LIFF initialized", {
      authType: "liff",
      component: "LiffService",
      isInClient: liff.isInClient(),
      isLoggedIn: liff.isLoggedIn(),
    });
  }

  public isLoggedIn(): boolean {
    return liff.isLoggedIn();
  }

  public isInClient(): boolean {
    return liff.isInClient();
  }

  public getAccessToken(): string | null {
    return liff.getAccessToken();
  }

  // Mini-app 403 エラー対策: profile スコープの権限を確認・要求
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

  public async signInWithLiffToken(): Promise<boolean> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      logger.info("No LIFF access token available", {
        authType: "liff",
        component: "LiffService",
      });
      return false;
    }

    // Mini-app 403 エラー対策: profile スコープの権限を確認
    await this.ensureProfilePermission();

    try {
      const response = await fetch("/api/line/liff-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Community-Id": this.communityId,
        },
        body: JSON.stringify({
          accessToken,
          configId: "integrated", // 統合設定を使用
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

  public login(): void {
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  }

  public logout(): void {
    if (liff.isLoggedIn()) {
      liff.logout();
    }
  }
}
```

#### 4. CI/CD ワークフロー（単一デプロイ化）

```yaml
# .github/workflows/deploy-to-cloud-run-prod.yml
# Matrix ビルドを削除し、単一デプロイに変更

name: Deploy to Cloud Run (Production)

on:
  push:
    branches:
      - master

env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  REGION: asia-northeast1
  SERVICE_NAME: civicship-portal
  IMAGE_NAME: gcr.io/${{ secrets.GCP_PROJECT_ID }}/civicship-portal

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
          service_account: ${{ secrets.GCP_SERVICE_ACCOUNT }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Configure Docker
        run: gcloud auth configure-docker

      - name: Build and push Docker image
        run: |
          docker build \
            --build-arg NEXT_PUBLIC_API_ENDPOINT=${{ secrets.API_ENDPOINT }} \
            --build-arg NEXT_PUBLIC_GRAPHQL_ENDPOINT=${{ secrets.GRAPHQL_ENDPOINT }} \
            --build-arg NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT=${{ secrets.LIFF_LOGIN_ENDPOINT }} \
            --build-arg NEXT_PUBLIC_INTEGRATED_LIFF_ID=${{ secrets.INTEGRATED_LIFF_ID }} \
            --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=${{ secrets.FIREBASE_API_KEY }} \
            --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${{ secrets.FIREBASE_AUTH_DOMAIN }} \
            --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID=${{ secrets.FIREBASE_PROJECT_ID }} \
            -t ${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -t ${{ env.IMAGE_NAME }}:latest \
            .
          docker push ${{ env.IMAGE_NAME }}:${{ github.sha }}
          docker push ${{ env.IMAGE_NAME }}:latest

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy ${{ env.SERVICE_NAME }} \
            --image ${{ env.IMAGE_NAME }}:${{ github.sha }} \
            --region ${{ env.REGION }} \
            --platform managed \
            --allow-unauthenticated \
            --memory 512Mi \
            --cpu 1 \
            --min-instances 0 \
            --max-instances 10
```

### 削除対象環境変数

| 環境変数 | 理由 |
|---------|------|
| `NEXT_PUBLIC_COMMUNITY_ID` | パスから取得するため不要 |
| `NEXT_PUBLIC_LIFF_ID` | `NEXT_PUBLIC_INTEGRATED_LIFF_ID` に置き換え |
| `NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID` | テナント認証を使用しないため不要 |

### 新規追加環境変数

| 環境変数 | 説明 |
|---------|------|
| `NEXT_PUBLIC_INTEGRATED_LIFF_ID` | 統合 LIFF アプリの ID |

### 実装手順

1. `apollo.ts` から環境変数フォールバックを削除
2. `middleware.ts` から環境変数フォールバックを削除
3. `liff-service.ts` を "integrated" 設定に変更
4. `liff-service.ts` で `ensureProfilePermission()` を有効化
5. CI/CD ワークフローを単一デプロイに変更
6. 不要な環境変数を削除
7. 新規環境変数を追加

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
1. `pnpm dev` でサーバーを起動（localhost でテスト）
2. 全コミュニティで認証が正常に動作することを確認
3. 全コミュニティでページが正常に表示されることを確認
4. Mini-app からのアクセスで 403 エラーが発生しないことを確認
5. CI/CD パイプラインが正常に動作することを確認

### 参照

- apollo.ts: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/src/lib/apollo.ts
- middleware.ts: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/src/middleware.ts
- liff-service.ts: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/src/lib/auth/service/liff-service.ts
- CI/CD: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/.github/workflows/deploy-to-cloud-run-prod.yml

### デプロイ手順

1. PR をマージ
2. CI/CD が単一イメージをビルド
3. 単一 Cloud Run インスタンスにデプロイ
4. 全コミュニティで動作確認
5. 旧 Cloud Run インスタンスを削除（別途作業）

### ロールバック手順

この PR のロールバックは困難です。問題が発生した場合:

1. 旧 CI/CD ワークフローを復元
2. 旧環境変数を復元
3. 旧 Cloud Run インスタンスを再デプロイ

### 注意事項

- この PR は十分な検証期間を経てから実施
- デプロイ前に全コミュニティの動作確認を実施
- ロールバック手順を事前に確認
- 深夜帯など影響の少ない時間帯にデプロイ推奨
- 認証フローのデバッグは localhost で行う（staging 環境ではなく）

### 旧 Cloud Run インスタンス削除

PR 5b デプロイ後、以下の旧インスタンスを削除:

```bash
# 旧インスタンス一覧
gcloud run services list --filter="name~civicship-portal-"

# 削除コマンド例
gcloud run services delete civicship-portal-neo88 --region=asia-northeast1
gcloud run services delete civicship-portal-other --region=asia-northeast1
# ...
```

削除は PR 5b デプロイ後、1-2週間の監視期間を経てから実施することを推奨。
