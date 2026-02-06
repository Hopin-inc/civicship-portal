# Cookie Path 制限（`path: "/community/[communityId]"`）フロントエンド影響評価レポート

## 総合判定: No-Go（現状のままでは導入不可）

バックエンドでセッションCookie（`__session` / `session`）に `path: "/community/${communityId}"` を設定した場合、フロントエンドの複数箇所で致命的な不整合が発生します。以下、各観点での詳細評価と必要な修正箇所を報告します。

---

## 1. Server Components での Cookie 参照

### 判定: 重大リスクあり

**現状の仕組み:**
- `executeServerGraphQLQuery`（`src/lib/graphql/server.ts:15-64`）は `next/headers` の `cookies()` を動的インポートし、すべてのCookieを `cookieStore.toString()` で文字列化してバックエンドへ転送する
- `hasServerSession()`（`src/lib/auth/server/session.ts:9-12`）は `cookieStore.has("session") || cookieStore.has("__session")` でセッション存在判定を行う

**リスク内容:**

ブラウザはCookieの `path` 属性に基づき、リクエスト先URLのパスがCookieの `path` と一致する場合のみCookieを送信します。Next.js の Server Components における `cookies()` は、**クライアントからのリクエストに含まれるCookie**を返します。

| リクエストURL | Cookie path | Cookie送信 | 結果 |
|---|---|---|---|
| `/community/himeji-ymca/wallets` | `/community/himeji-ymca` | 送信される | 正常動作 |
| `/community/himeji-ymca/admin` | `/community/himeji-ymca` | 送信される | 正常動作 |
| `/community/himeji-ymca/login` | `/community/himeji-ymca` | 送信される | 正常動作 |
| `/api/sessionLogout` | `/community/himeji-ymca` | **送信されない** | **異常** |
| `/api/sessionLogin` | `/community/himeji-ymca` | **送信されない** | 問題なし（新規発行のため） |
| `/community/other-community/...` | `/community/himeji-ymca` | **送信されない** | **異常（マルチコミュニティ時）** |

**影響を受けるファイル:**
- `src/lib/auth/init/getUserServer.ts` — SSR時のユーザー取得。コミュニティ配下のページでは問題ないが、共通ページからの呼び出し時にCookie欠落
- `src/app/community/[communityId]/users/features/shared/server/fetchPrivateUserServer.ts` — コミュニティ配下のため影響軽微
- `src/lib/graphql/getMembershipListServer.ts` — コミュニティ配下のため影響軽微
- `src/app/community/[communityId]/wallets/features/shared/server/getServerMyWalletWithTransactions.ts` — コミュニティ配下のため影響軽微

**結論:** 現在のページ構造（`/community/[communityId]/...`配下）では、Server Componentsの多くは正常動作します。ただし、`/api/*` ルートへのサーバーサイドfetchや、将来的にコミュニティ外のページを追加する場合にCookieが欠落します。

---

## 2. ログイン後のリダイレクト先

### 判定: リスク低（ただし注意点あり）

**現状の仕組み:**
- ログインはLIFF（LINE Frontend Framework）→ Firebase Custom Token → `/api/sessionLogin` の順で処理（`src/lib/auth/init/helper.ts:108-126`）
- `/api/sessionLogin`（`src/app/api/sessionLogin/route.ts`）はバックエンドの `/sessionLogin` へプロキシし、`Set-Cookie` ヘッダーをそのままクライアントへ転送
- リダイレクトは `AuthRedirectService`（`src/lib/auth/service/auth-redirect-service.ts`）が管理
- `RouteGuard`（`src/components/auth/RouteGuard.tsx`）がクライアントサイドでリダイレクト実行
- `useAppRouter`（`src/lib/navigation/useAppRouter.ts`）が全パスに `/community/${communityId}` プレフィックスを自動付与

**リダイレクト先一覧:**
| 認証状態 | 遷移先（相対パス） | 実際のURL | Cookie path一致 |
|---|---|---|---|
| LINE認証済 → 電話認証へ | `/sign-up/phone-verification` | `/community/{id}/sign-up/phone-verification` | 一致 |
| 電話認証済 → 登録へ | `/sign-up` | `/community/{id}/sign-up` | 一致 |
| 登録済み → トップ | `/` | `/community/{id}` | 一致 |
| 登録済み → next先 | `next`パラメータ | `/community/{id}/{next}` | 一致（通常） |

**結論:** リダイレクト先はすべて `useAppRouter` の `resolvePath` によって `/community/${communityId}` 配下に変換されるため、Cookie path制限下でもセッションCookieは正常に参照されます。ルート（`/`）に飛ばされるケースも `resolvePath` が `/community/${communityId}` に変換するため問題ありません。

---

## 3. クライアントサイドでの Cookie 破棄

### 判定: 致命的リスクあり

**現状の仕組み:**

**(a) サーバーサイド（API Route）での破棄:**
`/api/sessionLogout`（`src/app/api/sessionLogout/route.ts`）:
```typescript
response.cookies.set("session", "", { expires: new Date(0), path: "/" });
response.cookies.set("__session", "", { expires: new Date(0), path: "/" });
```

**問題:** `path: "/"` で削除を試みていますが、Cookieが `path: "/community/himeji-ymca"` で発行された場合、`path: "/"` の `Set-Cookie` では**そのCookieを削除できません**。Cookieの削除には、発行時と**完全に同じ `path`** を指定する必要があります（RFC 6265, Section 5.3）。

**(b) クライアントサイド（TokenManager）での破棄:**
`TokenManager.deleteCookie`（`src/lib/auth/core/token-manager.ts:55-58`）:
```typescript
document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
```

これは `line_authenticated`, `phone_authenticated` 等のフラグCookieに使われています。これらはフロントエンドが `path=/` で発行しているため、同じ `path=/` で削除できます。**セッションCookieの削除には関与していない**ため直接の影響はありません。

**(c) ログアウトフロー全体:**
`useLogout`（`src/hooks/auth/actions/useLogout.ts`）:
```typescript
// 1. Firebase signOut
await signOut(lineAuth);
// 2. LIFF/電話認証クリア
liffService.logout();
phoneAuthService.reset();
// 3. フラグCookieクリア
TokenManager.clearAllAuthFlags();
// 4. セッションCookieクリア（API呼び出し）
await fetch("/api/sessionLogout", { method: "POST" });
```

**問題点:**
1. `fetch("/api/sessionLogout")` はパス `/api/sessionLogout` へのリクエスト。Cookie path が `/community/himeji-ymca` の場合、このリクエストには**セッションCookieが付与されない**（パス不一致）。サーバーサイドでは Cookie の存在確認なしに削除 `Set-Cookie` を返すため一応 `Set-Cookie` ヘッダーは返るが、`path: "/"` で設定されるため path 不一致で削除されない
2. 結果として、**セッションCookieが消せない「ゾンビCookie」状態**になり、ログアウトしたはずのユーザーが `/community/{communityId}` 配下にアクセスすると再びログイン状態として扱われる

**影響を受けるファイル:**
- `src/app/api/sessionLogout/route.ts` — Cookie削除時の `path` 修正が必須
- `src/hooks/auth/actions/useLogout.ts` — ログアウトAPIのURLパス変更が必要な可能性

---

## 4. Middleware での認証チェック

### 判定: リスクなし

**現状の仕組み:**
`middleware.ts`（`src/middleware.ts`）は**認証チェックを一切行っていません**。Middlewareの役割は以下のみ：
1. コミュニティID特定（サブドメイン or パスから）
2. パスベースURLへの301リダイレクト
3. `x-community-id` のヘッダー/Cookie設定
4. CSPヘッダー設定
5. 言語Cookie設定

認証はすべてクライアントサイド（`RouteGuard`, `AdminGuard`）とServer Components内（`hasServerSession()`）で行われているため、Middlewareレベルでの矛盾は発生しません。

**結論:** Cookie path制限の影響を受けません。

---

## 5. localStorage との整合性

### 判定: リスク低（軽微な改善推奨）

**現在のlocalStorage使用状況:**

| キー | 用途 | communityId含む | 混線リスク |
|---|---|---|---|
| `civicship_auth_session_id` | 認証セッション追跡ID | なし | **低リスク** — 同一ブラウザでの認証追跡用、コミュニティ固有でない |
| `civicship_session_id` | ロギング用セッションID | なし | なし — ログ目的のみ |
| `languageSynced:${userId}` | 言語同期フラグ | なし（userId） | なし — ユーザー単位で正しい |

**Firebase Auth の永続化:**
- `src/lib/auth/core/firebase-config.ts` で `browserLocalPersistence` を使用
- Firebase は内部的に localStorage にトークンを保存
- tenant ID（`lineAuth.tenantId`）はコミュニティごとに異なる Firebase テナントを使用

**潜在リスク:**
- ドメイン統合後、同一ブラウザの同一ドメインで複数コミュニティにアクセスする場合、Firebase Auth の localStorage 永続化トークンが**前のコミュニティのテナント情報で残る**可能性がある
- ただし、現在の実装では `signInWithLiffToken` 内でカスタムトークンからテナントIDをデコードして `lineAuth.tenantId` を毎回上書きしているため、実用上は問題にならない

**結論:** localStorage のキー名に communityId を含める必要は現時点ではありません。ただし、将来的に同一ブラウザで複数コミュニティを同時利用するユースケースが出た場合は、`civicship_auth_session_id` に communityId を含めることを検討してください。

---

## 修正必要箇所の一覧

### 必須修正（Blocker）

| # | ファイル | 修正内容 | 重要度 |
|---|---|---|---|
| 1 | `src/app/api/sessionLogout/route.ts` | Cookie削除の `path` を `"/community/${communityId}"` に変更。communityId はリクエストヘッダー or Cookie から取得する必要あり | **Critical** |
| 2 | バックエンド側 `/sessionLogin` | `Set-Cookie` の `path` にどの communityId を含めるか、リクエストの `X-Community-Id` ヘッダーから決定するロジックの確認 | **Critical** |
| 3 | `src/hooks/auth/actions/useLogout.ts` | ログアウトAPI呼び出しを `/api/sessionLogout` から、Cookie path が一致するパス（例: `/community/${communityId}/api/sessionLogout`）に変更するか、あるいは communityId をリクエストボディに含めてサーバー側で正しい path の削除 Cookie を返す | **Critical** |

### 推奨修正（高優先）

| # | ファイル | 修正内容 | 重要度 |
|---|---|---|---|
| 4 | `src/app/api/sessionLogout/route.ts` | communityId を受け取って動的に `path: "/community/${communityId}"` を設定するよう修正 | **High** |
| 5 | `src/app/api/sessionLogin/route.ts` | バックエンドから返される `Set-Cookie` の `path` 値が正しく `/community/${communityId}` になっていることを検証するログ/バリデーション追加 | **High** |

### 確認推奨（低優先）

| # | ファイル | 修正内容 | 重要度 |
|---|---|---|---|
| 6 | `src/lib/auth/service/auth-redirect-service.ts` | `matchPaths` のパターン（`"/login"`, `"/sign-up"` 等）が、フルパス `/community/{id}/login` と一致するかの検証（micromatch によるグロブマッチング。既存バグの可能性あり）| **Medium** |
| 7 | `src/lib/auth/core/firebase-config.ts` | 同一ドメインでの複数コミュニティ利用時、Firebase localStorage 永続化データの分離検討 | **Low** |

---

## 代替案の提案

Cookie path 制限の目的がコミュニティ間のセッション分離であれば、以下の代替案も検討を推奨します：

### 案A: Cookie 名にコミュニティIDを含める（推奨）
- Cookie名を `__session_${communityId}`（例: `__session_himeji-ymca`）に変更
- `path: "/"` のまま運用可能
- フロントエンドの `hasServerSession()` で動的にCookie名を解決
- ログアウト時の path 不一致問題が発生しない
- 修正範囲が最小

### 案B: Cookie path を使う場合の完全対応
- ログアウトAPIを `/community/[communityId]/api/sessionLogout` のようなRoute Handlersに移動
- または、API Route側で communityId を受け取り、正しい path で Cookie を削除
- `hasServerSession()` のロジックは変更不要（コミュニティ配下ページでは Cookie が送信されるため）

---

## まとめ

| 評価項目 | 判定 | 理由 |
|---|---|---|
| Server Components でのCookie参照 | **条件付き問題あり** | `/community/{id}` 配下のページでは正常だが、`/api/*` ルートでは欠落 |
| ログイン後のリダイレクト先 | **問題なし** | `useAppRouter` がすべてのパスにコミュニティプレフィックスを付与 |
| クライアントサイドでのCookie破棄 | **致命的問題あり** | path不一致でセッションCookieが削除不可能になる |
| MiddlewareでのCookieチェック | **問題なし** | Middlewareは認証チェックを行わない |
| localStorageとの整合性 | **問題なし** | 現時点ではcommunityId依存のキーは不要 |

**最終判定: No-Go**

ログアウト時のCookie削除が不可能になる問題は致命的であり、この修正なしでの Cookie path 制限導入は推奨しません。上記「必須修正」の3項目を対応した上で再評価してください。代替案Aの方がフロントエンド修正コストが低く、推奨です。
