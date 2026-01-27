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

### 削除対象コード

#### シャドウモード条件分岐

```typescript
// 削除: シャドウモード条件分岐
const isProduction = process.env.NODE_ENV === "production";
if (isProduction) {
  // 旧ロジック
} else {
  // 新ロジック
}

// 変更後: 新ロジックのみ
const currentUser = await findUserByGlobalIdentity(decoded.uid);
```

#### 旧 Identity 検索ロジック

```typescript
// 削除: コミュニティ固有 Identity 検索
let currentUser = await issuer.internal((tx) =>
  tx.user.findFirst({
    where: {
      identities: {
        some: {
          uid: decoded.uid,
          communityId, // ← この条件を削除
        },
      },
    },
  }),
);

// 変更後: グローバル Identity のみ検索
let currentUser = await issuer.internal((tx) =>
  tx.user.findFirst({
    where: {
      identities: {
        some: {
          uid: decoded.uid,
          communityId: null, // グローバル Identity
        },
      },
    },
  }),
);
```

### 実装手順

1. シャドウモードの比較ログを確認し、差分がないことを確認
2. シャドウモード条件分岐を削除
3. 旧 Identity 検索ロジックを削除
4. 不要な型定義を削除
5. テストを更新

### テスト方法

1. 全ての認証フローが正常に動作することを確認
2. グローバル Identity での認証が正常に動作することを確認
3. Membership 自動作成が正常に動作することを確認

### 注意事項

- シャドウモードのログで差分がないことを十分に確認してから実施
- ロールバックが困難なため、慎重に進める

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

### epic/mini-appify 参照コード

#### apollo.ts 変更

```typescript
// 削除: 環境変数フォールバック
if (!communityId) {
  communityId = process.env.NEXT_PUBLIC_COMMUNITY_ID ?? null;
}

// 変更後: パスからの抽出のみ
let communityId = extractCommunityIdFromPath(window.location.pathname);
if (!communityId) {
  communityId = extractCommunityIdFromLiffState();
}
// フォールバックなし - communityId が null の場合はヘッダーを送信しない
```

参照: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/src/lib/apollo.ts

#### liff-service.ts 変更

```typescript
// 変更前
const communityId = process.env.NEXT_PUBLIC_COMMUNITY_ID;
const endpoint = `${process.env.NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT}/line/liff-login`;
// ...
headers: {
  "X-Community-Id": communityId ?? "",
},

// 変更後
const configId = "integrated";
const endpoint = `${process.env.NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT}/line/liff-login`;
// ...
headers: {
  "X-Community-Id": configId,
},
```

参照: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/src/lib/auth/service/liff-service.ts#L262-L284

#### CI/CD 変更

```yaml
# .github/workflows/deploy-to-cloud-run-prod.yml

# 削除: Matrix ビルド
jobs:
  read-communities:
    # ... 削除
  
  build-and-deploy:
    strategy:
      matrix:
        community: ${{ fromJson(needs.read-communities.outputs.communities) }}
    # ... 削除

# 変更後: 単一デプロイ
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Build and push Docker image
        run: |
          docker build \
            --build-arg NEXT_PUBLIC_API_ENDPOINT=${{ secrets.API_ENDPOINT }} \
            --build-arg NEXT_PUBLIC_LIFF_LOGIN_ENDPOINT=${{ secrets.LIFF_LOGIN_ENDPOINT }} \
            # ... 他の共通環境変数
            -t ${{ env.IMAGE_NAME }}:latest .
      
      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy ${{ env.SERVICE_NAME }} \
            --image ${{ env.IMAGE_NAME }}:latest \
            --region ${{ env.REGION }}
```

参照: https://github.com/Hopin-inc/civicship-portal/blob/epic/mini-appify/.github/workflows/deploy-to-cloud-run-prod.yml

### 削除対象環境変数

| 環境変数 | 理由 |
|---------|------|
| `NEXT_PUBLIC_COMMUNITY_ID` | パスから取得するため不要 |
| `NEXT_PUBLIC_LIFF_ID` | "integrated" 設定を使用するため不要 |
| `NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID` | テナント認証を使用しないため不要 |

### 実装手順

1. `apollo.ts` から環境変数フォールバックを削除
2. `middleware.ts` から環境変数フォールバックを削除
3. `liff-service.ts` を "integrated" 設定に変更
4. CI/CD ワークフローを単一デプロイに変更
5. 不要な環境変数を削除

### テスト方法

1. 全コミュニティで認証が正常に動作することを確認
2. 全コミュニティでページが正常に表示されることを確認
3. CI/CD パイプラインが正常に動作することを確認

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
