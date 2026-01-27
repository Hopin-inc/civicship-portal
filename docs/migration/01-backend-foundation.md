# Phase 1: Backend 基盤

## 概要

Backend に新しい認証・Identity 基盤を追加する。既存の認証フローは維持しつつ、新しいグローバル Identity（communityId: null）をサポートする。

## PR 1a: グローバル Identity 基盤 + DB マイグレーション

### 目的

- グローバル Identity（communityId: null）の概念を導入
- 統合 LIFF チャネルからのログインをサポートする基盤を作成

### 変更対象ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/application/domain/account/identity/service.ts` | `findGlobalIdentity()`, `addIdentityToUser()` 追加 |
| `src/application/domain/account/identity/data/repository.ts` | `findByUidAndCommunity()` 追加、`findGlobalIdentity()` 追加（推奨） |
| `src/application/domain/account/user/service.ts` | `findUserByPhoneNumber()` 追加 |
| `src/infrastructure/prisma/schema.prisma` | `communityId` nullable 化 |
| `prisma/migrations/` | マイグレーションファイル追加 |

### 設計上の注意

Repository レベルでも `findGlobalIdentity(uid, platform)` メソッドを追加することを推奨する。`findByUidAndCommunity(uid, platform, null)` のように `null` を直接渡すのは、将来的に混乱を生む可能性があるため。

### epic/mini-appify 参照コード

#### IdentityService 変更

```typescript
// src/application/domain/account/identity/service.ts

// 新規メソッド: グローバル Identity を検索
// ※ Repository レベルでも findGlobalIdentity() を追加することを推奨
//    null を直接渡すのは混乱を生む可能性があるため
async findGlobalIdentity(uid: string, platform: IdentityPlatform) {
  return this.identityRepository.findByUidAndCommunity(uid, platform, null);
}

// 新規メソッド: ユーザーに Identity を追加
async addIdentityToUser(
  ctx: IContext,
  userId: string,
  uid: string,
  platform: IdentityPlatform,
  communityId: string | null,
  tx?: Prisma.TransactionClient,
) {
  const data: Prisma.IdentityCreateInput = {
    uid,
    platform,
    user: { connect: { id: userId } },
  };

  if (communityId) {
    data.community = { connect: { id: communityId } };
  }

  await this.identityRepository.create(ctx, data, tx);
}
```

参照: https://github.com/Hopin-inc/civicship-api/blob/epic/mini-appify/src/application/domain/account/identity/service.ts#L44-L72

#### UserService 変更

```typescript
// src/application/domain/account/user/service.ts

// 新規メソッド: 電話番号でユーザーを検索
async findUserByPhoneNumber(phoneNumber: string) {
  return this.userRepository.findByPhoneNumber(phoneNumber);
}
```

参照: https://github.com/Hopin-inc/civicship-api/blob/epic/mini-appify/src/application/domain/account/user/service.ts

#### DB マイグレーション

```sql
-- prisma/migrations/YYYYMMDDHHMMSS_make_community_config_community_id_optional/migration.sql

ALTER TABLE "t_community_configs" ALTER COLUMN "community_id" DROP NOT NULL;
```

参照: https://github.com/Hopin-inc/civicship-api/blob/epic/mini-appify/src/infrastructure/prisma/schema.prisma

### 実装手順

1. `IdentityRepository` に `findByUidAndCommunity(uid, platform, communityId)` メソッドを追加
2. `IdentityService` に `findGlobalIdentity()` と `addIdentityToUser()` を追加
3. `UserService` に `findUserByPhoneNumber()` を追加
4. Prisma schema で `communityId` を nullable に変更
5. マイグレーションを生成・適用

### テスト方法

1. 既存の認証フローが正常に動作することを確認
2. `findGlobalIdentity()` が communityId: null の Identity を正しく検索できることを確認
3. DB マイグレーション後も既存データが正常に動作することを確認

---

## PR 1b: 新認証メソッド追加

### 目的

統合 LIFF チャネルを使った新しい認証フローのメソッドを追加する。既存の認証フローは維持。

### 変更対象ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/application/domain/account/auth/liff/usecase.ts` | 新認証メソッド追加 |
| `src/application/domain/account/community/config/service.ts` | `getIntegratedLiffConfig()` 追加（推奨） |
| `src/presentation/router/line.ts` | 新エンドポイント追加 |

### 設計上の注意

`getLiffConfig(ctx, null)` のように `null` を直接渡すのは混乱を生む可能性がある。`getIntegratedLiffConfig(ctx)` のような専用メソッドを追加することを推奨する。

現在の epic/mini-appify の実装では、`getLiffConfig(ctx, _communityId)` は `_communityId` パラメータを受け取るが、実際には使用せず常に `"integrated"` を使用している。この設計は将来的に混乱を生む可能性があるため、明示的なメソッド名に変更することを推奨する。

### epic/mini-appify 参照コード

#### LIFFAuthUseCase 変更

```typescript
// src/application/domain/account/auth/liff/usecase.ts

// 新規インターフェース
export interface GlobalLIFFLoginResponse {
  status: "success" | "user_not_found" | "registration_required";
  customToken?: string;
  profile: LINEProfile;
  expiryTimestamp?: number;
}

export interface PhoneLinkRequest {
  accessToken: string;
  phoneNumber: string;
}

export interface PhoneLinkResponse {
  status: "linked" | "registration_required";
  customToken?: string;
  expiryTimestamp?: number;
  userId?: string;
}

// 新規メソッド: 統合 LIFF でログイン
static async loginWithGlobalLiff(accessToken: string): Promise<GlobalLIFFLoginResponse> {
  const configService = container.resolve(CommunityConfigService);
  const identityService = container.resolve(IdentityService);
  const issuer = new PrismaClientIssuer();
  const ctx = { issuer } as IContext;

  // communityId: null で LIFF 設定を取得（統合チャネル）
  const { liffId } = await configService.getLiffConfig(ctx, null);
  const verifyResult = await LIFFService.verifyAccessToken(accessToken, liffId);
  const profile = await LIFFService.getProfile(accessToken);

  // グローバル Identity を検索
  const globalIdentity = await identityService.findGlobalIdentity(
    profile.userId,
    IdentityPlatform.LINE,
  );

  if (!globalIdentity) {
    return { status: "user_not_found", profile };
  }

  const customToken = await LIFFService.createFirebaseCustomToken(profile);
  // ... 省略
  return { status: "success", customToken, profile, expiryTimestamp };
}

// 新規メソッド: 電話番号でユーザーをリンク
static async linkPhoneAndGetUser(request: PhoneLinkRequest): Promise<PhoneLinkResponse> {
  // ... 実装
}

// 新規メソッド: 新規ユーザー登録
static async registerNewUser(request: UserRegistrationRequest): Promise<UserRegistrationResponse> {
  // ... 実装
}
```

参照: https://github.com/Hopin-inc/civicship-api/blob/epic/mini-appify/src/application/domain/account/auth/liff/usercase.ts#L79-L211

### 実装手順

1. `GlobalLIFFLoginResponse`, `PhoneLinkRequest`, `PhoneLinkResponse` インターフェースを追加
2. `loginWithGlobalLiff()` メソッドを実装
3. `linkPhoneAndGetUser()` メソッドを実装
4. `registerNewUser()` メソッドを実装
5. 新エンドポイント `/line/global-liff-login` を追加（オプション）

### テスト方法

1. 既存の `/line/liff-login` エンドポイントが正常に動作することを確認
2. 新メソッドが正しく動作することを単体テストで確認

---

## PR 1c: Firebase Auth シャドウモード

### 目的

本番環境で旧認証ロジックを維持しつつ、新認証ロジックを並行実行して検証する。

### 変更対象ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/presentation/middleware/auth/firebase-auth.ts` | シャドウモード呼び出し |
| `src/presentation/middleware/auth/shadow-mode.ts` | シャドウモードロジック（新規作成） |
| `src/presentation/middleware/auth/identity-resolution.ts` | Identity 解決ロジック（新規作成） |

### 設計上の注意

firebase-auth.ts にシャドウモードロジックを直接実装すると可読性が下がるため、以下のように分割することを推奨する：

1. `identity-resolution.ts`: グローバル Identity 検索、コミュニティ別 Identity 検索のロジック
2. `shadow-mode.ts`: 新旧ロジックの比較、ログ出力のロジック
3. `firebase-auth.ts`: 上記を呼び出すエントリーポイント

### epic/mini-appify 参照コード

#### firebase-auth.ts 変更

```typescript
// src/presentation/middleware/auth/firebase-auth.ts

export async function handleFirebaseAuth(
  headers: AuthHeaders,
  issuer: PrismaClientIssuer,
): Promise<AuthResult> {
  // ... 既存の処理

  // First, try to find user with community-specific identity (旧ロジック)
  let currentUser = await issuer.internal((tx) =>
    tx.user.findFirst({
      where: {
        identities: {
          some: {
            uid: decoded.uid,
            communityId,
          },
        },
      },
      // ... include
    }),
  );

  // If not found, try to find user with global LINE identity (新ロジック)
  // communityId = null for integrated LINE channel
  if (!currentUser) {
    currentUser = await issuer.internal((tx) =>
      tx.user.findFirst({
        where: {
          identities: {
            some: {
              uid: decoded.uid,
              communityId: null, // Global identity
            },
          },
        },
        // ... include
      }),
    );

    // Auto-create membership if user has phone identity but no membership
    if (currentUser) {
      const hasPhoneIdentity = currentUser.identities?.some(
        (identity) => identity.platform === "PHONE",
      );
      const hasMembership = currentUser.memberships && currentUser.memberships.length > 0;

      if (hasPhoneIdentity && !hasMembership) {
        // Auto-create membership and wallet
        await membershipService.joinIfNeeded(ctx, currentUser.id, communityId, tx);
        await walletService.createMemberWalletIfNeeded(ctx, currentUser.id, communityId, tx);
      }
    }
  }

  // ... 残りの処理
}
```

参照: https://github.com/Hopin-inc/civicship-api/blob/epic/mini-appify/src/presentation/middleware/auth/firebase-auth.ts#L46-L162

### シャドウモード実装方針

```typescript
// シャドウモード: 本番では旧ロジック結果を返し、新ロジックはログのみ
const isProduction = process.env.NODE_ENV === "production";

// 旧ロジック実行
const oldResult = await findUserByCommunityIdentity(decoded.uid, communityId);

// 新ロジック実行（Read-only）
const newResult = await findUserByGlobalIdentity(decoded.uid);

if (isProduction) {
  // 比較ログ出力
  logger.info("[ShadowMode] Auth comparison", {
    operation: "identityResolution",
    match: oldResult?.id === newResult?.id,
    old: { userId: oldResult?.id, identityId: oldResult?.identityId },
    new: { userId: newResult?.id, identityId: newResult?.identityId },
  });
  
  // 旧ロジック結果を返す
  return oldResult;
} else {
  // 開発環境では新ロジックを使用
  return newResult ?? oldResult;
}
```

### 実装手順

1. `findUserByGlobalIdentity()` ヘルパー関数を追加（Read-only）
2. シャドウモード条件分岐を追加
3. 比較ログ出力を実装
4. 本番では旧ロジック結果を返すように実装

### テスト方法

1. 開発環境で新ロジックが正しく動作することを確認
2. 本番環境でシャドウログが正しく出力されることを確認
3. 旧ロジックの結果が返されることを確認

### 注意事項

- 新ロジックは Read-only（DB 書き込みなし）
- Membership 自動作成は本番では実行しない（シャドウモード中）
- ログで差分を監視し、問題がないことを確認してから Phase 5 に進む
