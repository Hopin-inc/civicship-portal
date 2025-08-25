# LIFF認証設定

このドキュメントでは、特定のページでのみLIFF認証を実行するための設定方法について説明します。

## 概要

従来の実装では、LIFF環境（LINEアプリ内）で開かれた場合、すべてのページで自動的にLIFF認証が実行されていました。新しい実装では、特定のページでのみ認証を実行するように条件分岐を追加できます。

## 設定方法

### 1. 認証が必要なページの設定

`src/config/auth-config.ts`で認証が必要なページを定義します：

```typescript
export const LIFF_AUTH_REQUIRED_PATHS = [
  // ユーザー関連ページ
  "/users",
  "/wallets", 
  "/tickets",
  
  // 予約関連ページ
  "/reservation",
  
  // 管理画面
  "/admin",
  
  // その他の認証が必要なページ
  "/login",
  "/sign-up",
];
```

### 2. 環境変数でのカスタマイズ

環境変数`NEXT_PUBLIC_LIFF_AUTH_PATHS`で認証が必要なページをカスタマイズできます：

```bash
# .env.local
NEXT_PUBLIC_LIFF_AUTH_PATHS='["/users", "/wallets", "/admin"]'
```

### 3. アプリケーションでの使用

`src/app/layout.tsx`で設定を適用します：

```typescript
import { getAuthConfig } from "@/config/auth-config";

// ...

<AuthProvider liffAuthRequiredPaths={getAuthConfig()}>
  {/* アプリケーションコンテンツ */}
</AuthProvider>
```

## 動作仕様

### 認証実行条件

1. **環境条件**: LIFF環境（LINEアプリ内）で実行されている
2. **ページ条件**: 設定されたパスに一致するページにアクセスしている
3. **状態条件**: 未認証状態で、かつ認証処理中でない

### パスマッチング

- **完全一致**: `/users` → `/users`ページのみ
- **プレフィックス一致**: `/users` → `/users`, `/users/me`, `/users/123`など

### ログ出力

認証が実行されない場合、以下のログが出力されます：

```
LIFF auth not required for current path
Auto-login not required for current path
```

## 使用例

### 例1: 基本的な設定

```typescript
// ユーザー関連ページでのみ認証を実行
const authPaths = ["/users", "/wallets", "/tickets"];

<AuthProvider liffAuthRequiredPaths={authPaths}>
  {children}
</AuthProvider>
```

### 例2: 動的な設定

```typescript
// 現在のページに基づいて動的に認証パスを決定
const getDynamicAuthPaths = () => {
  if (process.env.NODE_ENV === 'development') {
    return ["/admin"]; // 開発環境では管理画面のみ
  }
  return ["/users", "/wallets", "/admin"]; // 本番環境では全ページ
};

<AuthProvider liffAuthRequiredPaths={getDynamicAuthPaths()}>
  {children}
</AuthProvider>
```

### 例3: 条件付き認証

```typescript
// 特定の条件でのみ認証を実行
const shouldRequireAuth = () => {
  const pathname = window.location.pathname;
  return pathname.startsWith('/admin') || pathname.startsWith('/users');
};

<AuthProvider liffAuthRequiredPaths={shouldRequireAuth() ? ["/admin", "/users"] : []}>
  {children}
</AuthProvider>
```

## 注意事項

1. **パフォーマンス**: 認証が不要なページでは認証処理が実行されないため、パフォーマンスが向上します
2. **セキュリティ**: 認証が必要なページは適切に設定してください
3. **デバッグ**: 開発時はログを確認して、期待通りの動作をしているか確認してください
4. **後方互換性**: 設定を空配列にすると、従来の動作（全ページで認証）になります

## トラブルシューティング

### 認証が実行されない場合

1. 環境がLIFFかどうか確認
2. 現在のパスが設定されたパスに一致するか確認
3. ブラウザのコンソールでログを確認

### 認証が不要なページで実行される場合

1. パスの設定を確認
2. プレフィックス一致の動作を確認
3. 除外パスの設定を確認

## 関連ファイル

- `src/hooks/auth/useLiffInitialization.ts` - LIFF初期化フック
- `src/hooks/auth/useAutoLogin.ts` - 自動ログインフック
- `src/contexts/AuthProvider.tsx` - 認証プロバイダー
- `src/config/auth-config.ts` - 認証設定
