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
| `src/infrastructure/prisma/schema.prisma` | `CommunityConfig.communityId` を nullable 化 |
| `src/application/domain/account/identity/data/interface.ts` | `findByUidAndCommunity` メソッド定義追加 |
| `src/application/domain/account/identity/data/repository.ts` | `findByUidAndCommunity` メソッド実装 |
| `src/application/domain/account/identity/service.ts` | `findGlobalIdentity`, `addIdentityToUser` 変更 |
| `src/application/domain/account/user/data/interface.ts` | `findByPhoneNumber` メソッド定義追加 |
| `src/application/domain/account/user/data/repository.ts` | `findByPhoneNumber` メソッド実装 |
| `src/application/domain/account/user/service.ts` | `findUserByPhoneNumber`, `findLineUidForGlobal`, `findLineUidAndLanguageForGlobal` 追加 |

### 実装コード（転記用）

#### 1. Prisma Schema 変更

```prisma
// src/infrastructure/prisma/schema.prisma
// CommunityConfig モデルを以下のように変更

model CommunityConfig {
  id          String     @id @default(cuid())
  communityId String?    @unique @map("community_id")  // String → String? に変更
  community   Community? @relation(fields: [communityId], references: [id])  // Community → Community? に変更

  firebaseConfig CommunityFirebaseConfig?
  lineConfig     CommunityLineConfig?
  // ... 他のフィールドは変更なし
}
```

#### 2. DB マイグレーション生成

```bash
# civicship-api ディレクトリで実行
pnpm prisma migrate dev --name make_community_config_community_id_optional
```

生成されるマイグレーション SQL:
```sql
-- prisma/migrations/YYYYMMDDHHMMSS_make_community_config_community_id_optional/migration.sql

-- AlterTable
ALTER TABLE "t_community_configs" ALTER COLUMN "community_id" DROP NOT NULL;
```

#### 3. IdentityRepository インターフェース追加

```typescript
// src/application/domain/account/identity/data/interface.ts
// 以下のメソッド定義を IIdentityRepository インターフェースに追加

export interface IIdentityRepository {
  // ... 既存のメソッド定義

  // 追加: communityId を指定して Identity を検索（null 対応）
  findByUidAndCommunity(
    uid: string,
    platform: IdentityPlatform,
    communityId: string | null,
  ): Promise<IdentityDetail | null>;
}
```

#### 4. IdentityRepository 実装追加

```typescript
// src/application/domain/account/identity/data/repository.ts
// 以下のメソッドを IdentityRepository クラスに追加

async findByUidAndCommunity(
  uid: string,
  platform: IdentityPlatform,
  communityId: string | null,
) {
  return this.db.identity.findFirst({
    where: {
      uid,
      platform,
      communityId,
    },
    select: identitySelectDetail,
  });
}
```

#### 5. IdentityService 変更

```typescript
// src/application/domain/account/identity/service.ts
// 以下のメソッドを追加・変更

// 追加: グローバル Identity を検索
async findGlobalIdentity(uid: string, platform: IdentityPlatform) {
  return this.identityRepository.findByUidAndCommunity(uid, platform, null);
}

// 変更: communityId を nullable に
async addIdentityToUser(
  ctx: IContext,
  userId: string,
  uid: string,
  platform: IdentityPlatform,
  communityId: string | null,  // 変更: string → string | null
  tx?: Prisma.TransactionClient,
) {
  const data: Prisma.IdentityCreateInput = {
    uid,
    platform,
    user: {
      connect: { id: userId },
    },
  };

  // communityId がある場合のみ community を connect
  if (communityId) {
    data.community = {
      connect: { id: communityId },
    };
  }

  await this.identityRepository.create(ctx, data, tx);
}

// 変更: グローバル Identity のフォールバック追加
async findUserByIdentity(ctx: IContext, uid: string, communityId?: string | null): Promise<User | null> {
  // First, try to find identity with the specified communityId
  let identity = await this.identityRepository.find(uid, communityId);
  
  // If not found and communityId was specified, also try to find global identity (communityId = null)
  if (!identity && communityId) {
    identity = await this.identityRepository.find(uid, null);
  }
  
  if (identity) {
    return await this.userRepository.find(ctx, identity.userId);
  }
  return null;
}
```

#### 6. UserRepository インターフェース追加

```typescript
// src/application/domain/account/user/data/interface.ts
// 以下のメソッド定義を IUserRepository インターフェースに追加

export interface IUserRepository {
  // ... 既存のメソッド定義

  // 追加
  findByPhoneNumber(phoneNumber: string): Promise<UserDetail | null>;
}
```

#### 7. UserRepository 実装追加

```typescript
// src/application/domain/account/user/data/repository.ts
// 以下のメソッドを UserRepository クラスに追加

async findByPhoneNumber(phoneNumber: string) {
  return this.db.user.findFirst({
    where: { phoneNumber },
    select: userSelectDetail,
  });
}
```

#### 8. UserService 変更

```typescript
// src/application/domain/account/user/service.ts
// 以下のメソッドを追加

// 追加: 電話番号でユーザーを検索
async findUserByPhoneNumber(phoneNumber: string) {
  return await this.repository.findByPhoneNumber(phoneNumber);
}

// 追加: グローバル LINE Identity の uid を取得
async findLineUidForGlobal(
  ctx: IContext,
  userId: string,
): Promise<string | undefined> {
  const user = await ctx.issuer.internal(async (tx) => {
    return tx.user.findUnique({
      where: { id: userId },
      include: {
        identities: {
          where: {
            platform: IdentityPlatform.LINE,
            communityId: null,
          },
        },
      },
    });
  });

  return user?.identities[0]?.uid;
}

// 追加: グローバル LINE Identity の uid と言語設定を取得
async findLineUidAndLanguageForGlobal(
  ctx: IContext,
  userId: string,
): Promise<{ uid: string; language: Language } | undefined> {
  const user = await ctx.issuer.internal(async (tx) => {
    return tx.user.findUnique({
      where: { id: userId },
      select: {
        preferredLanguage: true,
        identities: {
          where: {
            platform: IdentityPlatform.LINE,
            communityId: null,
          },
          select: {
            uid: true,
          },
        },
      },
    });
  });

  const uid = user?.identities[0]?.uid;
  if (!uid) return undefined;

  return {
    uid,
    language: user.preferredLanguage,
  };
}
```

### 実装手順

1. Prisma schema で `CommunityConfig.communityId` を nullable に変更
2. `pnpm prisma migrate dev --name make_community_config_community_id_optional` でマイグレーション生成
3. `IdentityRepository` インターフェースに `findByUidAndCommunity()` メソッド定義を追加
4. `IdentityRepository` に `findByUidAndCommunity()` メソッド実装を追加
5. `IdentityService` に `findGlobalIdentity()` を追加、`addIdentityToUser()` を変更
6. `UserRepository` インターフェースに `findByPhoneNumber()` メソッド定義を追加
7. `UserRepository` に `findByPhoneNumber()` メソッド実装を追加
8. `UserService` に `findUserByPhoneNumber()`, `findLineUidForGlobal()`, `findLineUidAndLanguageForGlobal()` を追加
9. `pnpm prisma generate` で型を再生成
10. 既存のテストが通ることを確認

### テスト方法

```bash
# civicship-api ディレクトリで実行

# 型チェック
pnpm lint

# テスト実行
pnpm test

# DB マイグレーション確認
pnpm prisma migrate status
```

### 参照

- Schema: https://github.com/Hopin-inc/civicship-api/blob/epic/mini-appify/src/infrastructure/prisma/schema.prisma
- IdentityRepository: https://github.com/Hopin-inc/civicship-api/blob/epic/mini-appify/src/application/domain/account/identity/data/repository.ts
- IdentityService: https://github.com/Hopin-inc/civicship-api/blob/epic/mini-appify/src/application/domain/account/identity/service.ts
- UserService: https://github.com/Hopin-inc/civicship-api/blob/epic/mini-appify/src/application/domain/account/user/service.ts

---

## PR 1b: 新認証メソッド追加

### 目的

統合 LIFF チャネルを使った新しい認証フローのメソッドを追加する。既存の認証フローは維持。

### 変更対象ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/application/domain/account/auth/liff/usecase.ts` | 新認証メソッド追加、`LIFFLoginRequest.communityId` を nullable に |
| `src/application/domain/account/auth/liff/service.ts` | `createFirebaseCustomToken` から tenantId パラメータ削除 |
| `src/application/domain/account/community/config/service.ts` | `getLiffConfig`, `getLineMessagingConfig` を "integrated" 固定に、`getFirebaseTenantId` 削除 |
| `src/application/domain/account/community/config/data/repository.ts` | configId パラメータ対応 |

### 実装コード（転記用）

#### 1. LIFFAuthUseCase インターフェース追加

```typescript
// src/application/domain/account/auth/liff/usecase.ts
// 以下のインターフェースを追加

// 既存のインターフェース変更
export interface LIFFLoginRequest {
  accessToken: string;
  communityId: string | null;  // 変更: string → string | null
}

// 新規インターフェース追加
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

export interface UserRegistrationRequest {
  accessToken: string;
  name: string;
  slug: string;
  phoneNumber: string;
  currentPrefecture: import("@prisma/client").CurrentPrefecture;
}

export interface UserRegistrationResponse {
  customToken: string;
  expiryTimestamp: number;
  userId: string;
}
```

#### 2. LIFFAuthUseCase メソッド追加

```typescript
// src/application/domain/account/auth/liff/usecase.ts
// 以下のメソッドを LIFFAuthUseCase クラスに追加

// 既存メソッド変更: tenantId パラメータを削除
static async login(request: LIFFLoginRequest): Promise<LIFFLoginResponse> {
  const configService = container.resolve(CommunityConfigService);
  const issuer = new PrismaClientIssuer();
  const ctx = { issuer } as IContext;

  const { liffId } = await configService.getLiffConfig(ctx, request.communityId);
  const verifyResult = await LIFFService.verifyAccessToken(request.accessToken, liffId);

  const profile = await LIFFService.getProfile(request.accessToken);

  // 変更: tenantId パラメータを削除
  const customToken = await LIFFService.createFirebaseCustomToken(profile);

  const expiryTime = new Date();
  expiryTime.setSeconds(expiryTime.getSeconds() + verifyResult.expires_in);
  const expiryTimestamp = Math.floor(expiryTime.getTime() / 1000);

  return {
    customToken,
    profile,
    expiryTimestamp,
  };
}

// 新規メソッド: 統合 LIFF でログイン
static async loginWithGlobalLiff(accessToken: string): Promise<GlobalLIFFLoginResponse> {
  const configService = container.resolve(CommunityConfigService);
  const identityService = container.resolve(IdentityService);
  const issuer = new PrismaClientIssuer();

  const ctx = { issuer } as IContext;

  const { liffId } = await configService.getLiffConfig(ctx, null);
  const verifyResult = await LIFFService.verifyAccessToken(accessToken, liffId);

  const profile = await LIFFService.getProfile(accessToken);

  const globalIdentity = await identityService.findGlobalIdentity(
    profile.userId,
    IdentityPlatform.LINE,
  );

  if (!globalIdentity) {
    return {
      status: "user_not_found",
      profile,
    };
  }

  const customToken = await LIFFService.createFirebaseCustomToken(profile);

  const expiryTime = new Date();
  expiryTime.setSeconds(expiryTime.getSeconds() + verifyResult.expires_in);
  const expiryTimestamp = Math.floor(expiryTime.getTime() / 1000);

  return {
    status: "success",
    customToken,
    profile,
    expiryTimestamp,
  };
}

// 新規メソッド: 電話番号でユーザーをリンク
static async linkPhoneAndGetUser(request: PhoneLinkRequest): Promise<PhoneLinkResponse> {
  const configService = container.resolve(CommunityConfigService);
  const identityService = container.resolve(IdentityService);
  const userService = container.resolve(UserService);
  const issuer = new PrismaClientIssuer();

  const ctx = { issuer } as IContext;

  const { liffId } = await configService.getLiffConfig(ctx, null);
  await LIFFService.verifyAccessToken(request.accessToken, liffId);

  const profile = await LIFFService.getProfile(request.accessToken);

  const existingUser = await userService.findUserByPhoneNumber(request.phoneNumber);

  if (!existingUser) {
    return {
      status: "registration_required",
    };
  }

  const existingGlobalIdentity = await identityService.findGlobalIdentity(
    profile.userId,
    IdentityPlatform.LINE,
  );

  if (!existingGlobalIdentity) {
    await identityService.addIdentityToUser(
      ctx,
      existingUser.id,
      profile.userId,
      IdentityPlatform.LINE,
      null,  // グローバル Identity
    );
  }

  const customToken = await LIFFService.createFirebaseCustomToken(profile);

  const expiryTime = new Date();
  expiryTime.setSeconds(expiryTime.getSeconds() + 3600);
  const expiryTimestamp = Math.floor(expiryTime.getTime() / 1000);

  return {
    status: "linked",
    customToken,
    expiryTimestamp,
    userId: existingUser.id,
  };
}

// 新規メソッド: 新規ユーザー登録
static async registerNewUser(request: UserRegistrationRequest): Promise<UserRegistrationResponse> {
  const configService = container.resolve(CommunityConfigService);
  const identityService = container.resolve(IdentityService);
  const issuer = new PrismaClientIssuer();

  const ctx = { issuer } as IContext;

  const { liffId } = await configService.getLiffConfig(ctx, null);
  await LIFFService.verifyAccessToken(request.accessToken, liffId);

  const profile = await LIFFService.getProfile(request.accessToken);

  const existingIdentity = await identityService.findGlobalIdentity(
    profile.userId,
    IdentityPlatform.LINE,
  );
  if (existingIdentity) {
    throw new Error("This LINE account is already registered.");
  }

  const newUser = await identityService.createUserAndIdentity({
    name: request.name,
    slug: request.slug,
    phoneNumber: request.phoneNumber,
    currentPrefecture: request.currentPrefecture,
    identities: {
      create: {
        uid: profile.userId,
        platform: IdentityPlatform.LINE,
        // communityId は指定しない（グローバル Identity）
      },
    },
  });

  const customToken = await LIFFService.createFirebaseCustomToken(profile);

  const expiryTime = new Date();
  expiryTime.setSeconds(expiryTime.getSeconds() + 3600);
  const expiryTimestamp = Math.floor(expiryTime.getTime() / 1000);

  return {
    customToken,
    expiryTimestamp,
    userId: newUser.id,
  };
}
```

#### 3. LIFFService 変更

```typescript
// src/application/domain/account/auth/liff/service.ts
// createFirebaseCustomToken メソッドを以下のように変更（tenantId パラメータを削除）

// 変更前:
// static async createFirebaseCustomToken(profile: LINEProfile, tenantId: string): Promise<string>

// 変更後:
static async createFirebaseCustomToken(profile: LINEProfile): Promise<string> {
  // tenantId を使わない統合認証
  const customToken = await auth.createCustomToken(profile.userId, {
    platform: "LINE",
    displayName: profile.displayName,
    pictureUrl: profile.pictureUrl,
  });
  return customToken;
}
```

#### 4. CommunityConfigService 変更

```typescript
// src/application/domain/account/community/config/service.ts
// 以下のメソッドを変更

// 削除: getFirebaseTenantId メソッドを削除

// 変更: 常に "integrated" 設定を使用
async getLineMessagingConfig(
  ctx: IContext,
  _communityId: string | null,  // パラメータは互換性のため残すが使用しない
): Promise<{
  channelId: string;
  channelSecret: string;
  accessToken: string;
}> {
  const config = await this.repository.getLineConfig(ctx, "integrated");
  if (!config?.channelId || !config?.channelSecret || !config?.accessToken) {
    throw new NotFoundError("LINE Messaging Config is incomplete", { communityId: "integrated" });
  }
  return {
    channelId: config.channelId,
    channelSecret: config.channelSecret,
    accessToken: config.accessToken,
  };
}

// 変更: 常に "integrated" 設定を使用
async getLiffConfig(
  ctx: IContext,
  _communityId: string | null,  // パラメータは互換性のため残すが使用しない
): Promise<{
  liffId: string;
  liffBaseUrl: string;
}> {
  const config = await this.repository.getLineConfig(ctx, "integrated");
  if (!config?.liffId || !config?.liffBaseUrl) {
    throw new NotFoundError("LIFF Config is incomplete", { communityId: "integrated" });
  }
  return {
    liffId: config.liffId,
    liffBaseUrl: config.liffBaseUrl,
  };
}
```

#### 5. CommunityConfigRepository 変更

```typescript
// src/application/domain/account/community/config/data/repository.ts
// getLineConfig メソッドを以下のように変更

async getLineConfig(ctx: IContext, configId: string) {
  return this.db.communityLineConfig.findFirst({
    where: {
      communityConfig: {
        // "integrated" の場合は communityId: null を検索
        communityId: configId === "integrated" ? null : configId,
      },
    },
  });
}
```

### 実装手順

1. `LIFFService.createFirebaseCustomToken()` から tenantId パラメータを削除
2. `CommunityConfigService` の `getFirebaseTenantId()` メソッドを削除
3. `CommunityConfigService` の `getLiffConfig()`, `getLineMessagingConfig()` を "integrated" 固定に変更
4. `CommunityConfigRepository.getLineConfig()` で configId パラメータを処理
5. `LIFFAuthUseCase` に新インターフェースを追加
6. `LIFFAuthUseCase` に `loginWithGlobalLiff()`, `linkPhoneAndGetUser()`, `registerNewUser()` メソッドを追加
7. 既存のテストが通ることを確認

### テスト方法

```bash
# civicship-api ディレクトリで実行

# 型チェック
pnpm lint

# テスト実行
pnpm test
```

### 参照

- LIFFAuthUseCase: https://github.com/Hopin-inc/civicship-api/blob/epic/mini-appify/src/application/domain/account/auth/liff/usecase.ts
- CommunityConfigService: https://github.com/Hopin-inc/civicship-api/blob/epic/mini-appify/src/application/domain/account/community/config/service.ts

---

## PR 1c: Firebase Auth シャドウモード

### 目的

本番環境で旧認証ロジックを維持しつつ、新認証ロジックを並行実行して検証する。

### 変更対象ファイル

| ファイル | 変更内容 |
|---------|---------|
| `src/presentation/middleware/auth/firebase-auth.ts` | グローバル Identity 検索、自動 Membership 作成、tenantId 削除 |
| `src/presentation/middleware/auth/types.ts` | AuthResult から tenantId を削除 |

### 実装コード（転記用）

#### 1. firebase-auth.ts 変更

```typescript
// src/presentation/middleware/auth/firebase-auth.ts
// handleFirebaseAuth 関数を以下のように変更

import { auth } from "@/infrastructure/libs/firebase";
import { PrismaClientIssuer, prismaClient } from "@/infrastructure/prisma/client";
import { createLoaders } from "@/presentation/graphql/dataloader";
import logger from "@/infrastructure/logging";
import { AuthHeaders, AuthResult } from "./types";
import { AuthMeta, IContext } from "@/types/server";
import { AuthenticationError } from "@/errors/graphql";
import { container } from "tsyringe";
import MembershipService from "@/application/domain/account/membership/service";
import WalletService from "@/application/domain/account/wallet/service";

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

  // 変更: テナント認証を削除し、統合認証に変更
  const verificationMethod = authMode === "session" ? "verifySessionCookie" : "verifyIdToken";

  try {
    // 変更: tenantedAuth を使わない
    const decoded = await (authMode === "session"
      ? auth.verifySessionCookie(idToken, false)
      : auth.verifyIdToken(idToken));
    const uid = decoded.uid;
    const platform = decoded.platform;

    const provider = (decoded as any).firebase?.sign_in_provider;
    const decodedTenant = (decoded as any).firebase?.tenant;

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
        include: {
          identities: {
            where: {
              OR: [{ platform: "PHONE" }, { communityId }, { communityId: null }],
            },
          },
          memberships: {
            where: { communityId },
          },
        },
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
                communityId: null, // Global identity for integrated LINE channel
              },
            },
          },
          include: {
            identities: {
              where: {
                OR: [{ platform: "PHONE" }, { communityId }, { communityId: null }],
              },
            },
            memberships: {
              where: { communityId },
            },
          },
        }),
      );

      // If user found with global LINE identity, check if they have phone identity
      // and auto-create membership if needed
      if (currentUser) {
        const hasPhoneIdentity = currentUser.identities?.some(
          (identity) => identity.platform === "PHONE",
        );
        const hasMembership = currentUser.memberships && currentUser.memberships.length > 0;

        logger.debug("User found via global LINE identity", {
          userId: currentUser.id?.slice(-6),
          hasPhoneIdentity,
          hasMembership,
          communityId,
        });

        // Auto-create membership and wallet if user has phone identity but no membership
        if (hasPhoneIdentity && !hasMembership) {
          try {
            const membershipService = container.resolve(MembershipService);
            const walletService = container.resolve(WalletService);

            // Create a minimal context for the services
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

            // Re-fetch user to include the new membership
            currentUser = await issuer.internal((tx) =>
              tx.user.findFirst({
                where: { id: currentUser!.id },
                include: {
                  identities: {
                    where: {
                      OR: [{ platform: "PHONE" }, { communityId }, { communityId: null }],
                    },
                  },
                  memberships: {
                    where: { communityId },
                  },
                },
              }),
            );

            logger.info("Auto-created membership for user with global LINE identity", {
              userId: currentUser?.id?.slice(-6),
              communityId,
            });
          } catch (membershipError) {
            logger.error("Failed to auto-create membership", {
              userId: currentUser?.id?.slice(-6),
              communityId,
              error: membershipError instanceof Error ? membershipError.message : String(membershipError),
            });
            // Continue without membership - user will be redirected to phone verification
          }
        }
      }
    }

    logger.debug("Firebase user verified", {
      method: verificationMethod,
      uid: decoded.uid.slice(-6),
      decodedTenant,
      provider,
      communityId,
      userId: currentUser?.id?.slice(-6),
    });

    return {
      issuer,
      loaders,
      uid,
      idToken,
      platform,
      communityId,  // 変更: tenantId を削除
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

#### 2. types.ts 変更

```typescript
// src/presentation/middleware/auth/types.ts
// AuthResult インターフェースから tenantId を削除

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
```

### シャドウモード実装（オプション）

本番環境で新旧ロジックを比較したい場合は、以下のようにシャドウモードを実装する:

```typescript
// src/presentation/middleware/auth/shadow-mode.ts（新規作成）

import logger from "@/infrastructure/logging";
import { PrismaClientIssuer } from "@/infrastructure/prisma/client";
import { User } from "@prisma/client";

interface ShadowModeResult {
  oldUser: User | null;
  newUser: User | null;
  match: boolean;
}

export async function runShadowMode(
  issuer: PrismaClientIssuer,
  uid: string,
  communityId: string,
): Promise<ShadowModeResult> {
  // 旧ロジック: コミュニティ別 Identity で検索
  const oldUser = await issuer.internal((tx) =>
    tx.user.findFirst({
      where: {
        identities: {
          some: { uid, communityId },
        },
      },
    }),
  );

  // 新ロジック: グローバル Identity で検索
  const newUser = await issuer.internal((tx) =>
    tx.user.findFirst({
      where: {
        identities: {
          some: { uid, communityId: null },
        },
      },
    }),
  );

  const match = oldUser?.id === newUser?.id;

  // 比較ログ出力
  logger.info("[ShadowMode] Auth comparison", {
    operation: "identityResolution",
    match,
    old: { userId: oldUser?.id?.slice(-6) },
    new: { userId: newUser?.id?.slice(-6) },
    communityId,
  });

  return { oldUser, newUser, match };
}
```

firebase-auth.ts でシャドウモードを使用する場合:

```typescript
// firebase-auth.ts 内で使用
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  // シャドウモード: 新旧両方実行して比較ログ出力
  const shadowResult = await runShadowMode(issuer, decoded.uid, communityId);
  
  // 本番では旧ロジック結果を返す
  currentUser = shadowResult.oldUser;
} else {
  // 開発環境では新ロジックを使用（上記の実装）
}
```

### 実装手順

1. `firebase-auth.ts` からテナント認証を削除
2. グローバル Identity (communityId: null) でのユーザー検索を追加
3. 自動 Membership/Wallet 作成ロジックを追加
4. `types.ts` から tenantId を削除
5. （オプション）シャドウモードを実装して比較ログを出力

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

ローカルでの動作確認手順:
1. `pnpm dev:https` でサーバーを起動
2. フロントエンドからログインを試行
3. ログで `User found via global LINE identity` が出力されることを確認
4. Membership が自動作成されることを確認

### 参照

- firebase-auth.ts: https://github.com/Hopin-inc/civicship-api/blob/epic/mini-appify/src/presentation/middleware/auth/firebase-auth.ts

### 注意事項

- 新ロジックは Read-only ではなく、Membership/Wallet の自動作成を行う
- 本番環境でも新ロジックが動作するため、十分なテストが必要
- ロールバックが必要な場合は、グローバル Identity 検索部分をコメントアウトする
