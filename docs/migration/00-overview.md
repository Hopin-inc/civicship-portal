# Multi-Tenant Migration Overview

## 目的

コミュニティごとの Cloud Run インスタンスから、単一の統合インスタンスへの移行を安全に実施する。

## 現状のアーキテクチャ

- Frontend: コミュニティごとに別々の Cloud Run インスタンス
- Backend: 単一インスタンス（X-Community-Id ヘッダーでコミュニティを識別）
- 認証: コミュニティごとの LIFF チャネル

## 目標のアーキテクチャ

- Frontend: 単一の Cloud Run インスタンス
- Backend: 単一インスタンス（変更なし）
- 認証: 統合 LIFF チャネル（communityId: null）
- ルーティング: URL パスベース（例: `/neo88/activities`）

## PR 分割戦略

### Phase 1: Backend 基盤（破壊的変更なし）

| PR | 内容 | リスク |
|----|------|--------|
| 1a | グローバル Identity 基盤 + DB マイグレーション | 低 |
| 1b | 新認証メソッド追加 | 低 |
| 1c | Firebase Auth シャドウモード | 低 |

### Phase 2: Frontend 基盤（ルーティング非依存）

| PR | 内容 | リスク |
|----|------|--------|
| 2a | ユーティリティ追加（CommunityLink, extractCommunityIdFromPath） | 低 |
| 2b | Mini-app 403 エラー対策（ensureProfilePermission） | 低 |

### Phase 3: ルーティング準備（コード追加のみ、未適用）

| PR | 内容 | リスク |
|----|------|--------|
| 3a | Apollo Client 準備（環境変数フォールバック付き） | 低 |
| 3b | Middleware 準備（新旧両方のパスをサポート） | 低 |
| 3c | レガシー URL リダイレクト準備 | 低 |

### Phase 4: ルーティング適用（ディレクトリ移動）

| PR | 内容 | リスク |
|----|------|--------|
| 4a | ページを `[communityId]` ディレクトリに移動 | 中 |

### Phase 5: クリーンアップ + インフラ

| PR | 内容 | リスク |
|----|------|--------|
| 5a | Backend クリーンアップ（シャドウモード削除） | 低 |
| 5b | Frontend クリーンアップ + CI/CD 単一デプロイ + 認証完全移行 | 高 |

## 依存関係

```
Phase 1 (Backend)
  PR 1a → PR 1b → PR 1c
              ↓
Phase 2 (Frontend)
  PR 2a, PR 2b（並行可能）
              ↓
Phase 3 (Routing Prep)
  PR 3a → PR 3b → PR 3c
              ↓
Phase 4 (Routing Apply)
  PR 4a
    ↓
Phase 5 (Cleanup)
  PR 5a + PR 5b（一括デプロイ必須）
```

## シャドウモードの動作

### Backend（PR 1c）

```
NODE_ENV=production:
  1. 旧ロジック実行 → 結果を返す（安全）
  2. 新ロジック実行 → ログに記録（検証用）
  3. 差分があればアラート

NODE_ENV=development:
  新ロジックのみ実行
```

### 比較ログフォーマット

```json
{
  "level": "info",
  "message": "[ShadowMode] Auth comparison",
  "context": {
    "operation": "identityResolution",
    "match": true,
    "old": { "userId": "xxx", "identityId": "yyy" },
    "new": { "userId": "xxx", "identityId": "zzz" }
  }
}
```

## ロールバック戦略

### Phase 1-3

- 各 PR は独立してロールバック可能
- 旧ロジックが維持されているため、PR を revert するだけで復旧

### Phase 4

- ディレクトリ構造の変更は revert で復旧可能
- ただし、Phase 3 の準備コードが残っていれば影響なし

### Phase 5

- CI/CD 変更後は旧インフラに戻すのが困難
- 十分な検証期間を設けてから実行

## 参照情報

### epic/mini-appify ブランチ

- Portal: https://github.com/Hopin-inc/civicship-portal/tree/epic/mini-appify
- API: https://github.com/Hopin-inc/civicship-api/tree/epic/mini-appify

### 関連 PR

- Portal PR #909: https://github.com/Hopin-inc/civicship-portal/pull/909
- API PR #620: https://github.com/Hopin-inc/civicship-api/pull/620
