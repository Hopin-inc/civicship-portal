# civicship-portal ログ設定改善提案

## 現状分析サマリー

### 現在のログ使用状況
- **logger.* 使用**: 51ファイル（構造化ログ、メタデータ付き）
- **console.* 使用**: 12ファイル（主に設定警告、開発用デバッグ）
- **ログレベル**: ERROR, WARN, INFO, DEBUG の4段階
- **環境制御**: ローカル環境では無効化、本番環境はGoogle Cloud Logging

### 主要な課題
1. **ログ方式の不統一**: console.* と logger.* の混在
2. **構造化ログの不完全な活用**: 一部でメタデータが不足
3. **エラー分類の曖昧さ**: ビジネスエラーとシステムエラーの区別不明確
4. **本番環境でのログ量制御不足**: DEBUGレベルの制御が不十分

## 改善提案

### 1. ログ方式の統一化

#### 1.1 console.* → logger.* への移行
**対象**: 設定関連の警告ログ

**現状**:
```typescript
// src/lib/communities/metadata.ts
console.warn("COMMUNITY_ID environment variable is not set. Using default community settings.");

// src/lib/communities/content.ts  
console.warn(`Terms content for community "${communityId}" is not configured. Using default terms.`);
```

**改善案**:
```typescript
// 設定警告専用のログレベル追加
logger.warn("Configuration missing: COMMUNITY_ID not set", {
  component: "CommunityMetadata",
  fallbackUsed: "default",
  configType: "environment_variable"
});

logger.warn("Configuration missing: Terms content not found", {
  component: "CommunityContent", 
  communityId,
  fallbackUsed: "default_terms",
  configType: "content_configuration"
});
```

#### 1.2 開発用デバッグログの整理
**対象**: console.log/console.debug の使用箇所

**現状**:
```typescript
// src/app/places/components/map/MapComponent.tsx
console.debug(`マーカークリック - ID: ${marker.id}, 現在の選択ID: ${selectedPlaceId}`);
console.debug(`マーカーデータ:`, marker);
```

**改善案**:
```typescript
logger.debug("Map marker clicked", {
  component: "MapComponent",
  markerId: marker.id,
  selectedPlaceId,
  markerData: marker,
  action: "marker_click"
});
```

### 2. ログレベル体系の再定義

#### 2.1 新しいログレベル定義

```typescript
// src/lib/logging/type.ts に追加
export enum LogLevel {
  FATAL = 'fatal',    // アプリケーション停止レベル
  ERROR = 'error',    // 機能停止レベル  
  WARN = 'warn',      // 注意喚起レベル
  INFO = 'info',      // 情報レベル
  DEBUG = 'debug',    // デバッグレベル
  TRACE = 'trace'     // 詳細トレースレベル
}

export enum ErrorCategory {
  SYSTEM = 'system',           // システムエラー
  BUSINESS = 'business',       // ビジネスロジックエラー
  NETWORK = 'network',         // ネットワークエラー
  AUTHENTICATION = 'auth',     // 認証エラー
  CONFIGURATION = 'config',    // 設定エラー
  USER_INPUT = 'user_input'    // ユーザー入力エラー
}
```

#### 2.2 ログレベル使用ガイドライン

| レベル | 用途 | 例 |
|--------|------|-----|
| FATAL | アプリ停止 | データベース接続不可、重要な設定ファイル不存在 |
| ERROR | 機能停止 | API呼び出し失敗、認証エラー、予約失敗 |
| WARN | 注意喚起 | 設定不備（フォールバック使用）、非推奨機能使用 |
| INFO | 重要な情報 | ユーザーログイン、重要な状態変更、外部API呼び出し |
| DEBUG | 開発情報 | 詳細な処理フロー、パラメータ値 |
| TRACE | 詳細トレース | 関数の入出力、ループ処理の詳細 |

### 3. 構造化ログの標準化

#### 3.1 共通メタデータフィールド

```typescript
interface StandardLogContext {
  component: string;           // コンポーネント名（必須）
  action?: string;            // 実行アクション
  userId?: string;            // ユーザーID（マスク済み）
  sessionId?: string;         // セッションID
  requestId?: string;         // リクエストID
  errorCategory?: ErrorCategory; // エラー分類
  duration?: number;          // 処理時間（ms）
  metadata?: Record<string, any>; // 追加メタデータ
}
```

#### 3.2 エラーログの標準化

```typescript
// 現状の改善例
// Before
logger.error("Reservation cancellation mutation failed", {
  error: e instanceof Error ? e.message : String(e),
  component: "useCancelReservation",
  reservationId
});

// After  
logger.error("Reservation cancellation failed", {
  component: "useCancelReservation",
  action: "cancel_reservation",
  errorCategory: ErrorCategory.BUSINESS,
  reservationId,
  error: {
    message: e instanceof Error ? e.message : String(e),
    stack: e instanceof Error ? e.stack : undefined,
    code: e instanceof GraphQLError ? e.extensions?.code : undefined
  },
  metadata: {
    retryable: true,
    userAction: "reservation_cancel"
  }
});
```

### 4. 環境別ログレベル制御の強化

#### 4.1 環境別設定

```typescript
// src/lib/logging/config.ts（新規作成）
export const LOG_LEVEL_CONFIG = {
  local: 'debug',
  development: 'debug', 
  staging: 'info',
  production: 'warn'
} as const;

export const getLogLevel = (): string => {
  const env = process.env.ENV || 'local';
  return process.env.NEXT_PUBLIC_LOG_LEVEL || LOG_LEVEL_CONFIG[env] || 'warn';
};
```

#### 4.2 本番環境でのログ量制御

```typescript
// src/lib/logging/server/index.ts の改善
const logLevel = getLogLevel();
const isProduction = process.env.ENV === 'production';

// 本番環境では DEBUG/TRACE を無効化
const effectiveLevel = isProduction && ['debug', 'trace'].includes(logLevel) 
  ? 'info' 
  : logLevel;
```

### 5. ログ分析・監視の改善

#### 5.1 ログ集約用のタグ追加

```typescript
// 分析しやすいタグの追加
logger.error("Authentication failed", {
  component: "AuthProvider",
  errorCategory: ErrorCategory.AUTHENTICATION,
  tags: ["auth_failure", "user_experience", "security"],
  metrics: {
    failureCount: 1,
    authMethod: "liff"
  }
});
```

#### 5.2 パフォーマンス監視ログ

```typescript
// 処理時間の監視
const startTime = Date.now();
// ... 処理 ...
logger.info("GraphQL query completed", {
  component: "ApolloClient",
  action: "graphql_query",
  duration: Date.now() - startTime,
  queryName: operation.operationName,
  tags: ["performance", "graphql"]
});
```

### 6. 実装計画

#### Phase 1: 基盤整備（1-2週間）
1. ログレベル・エラー分類の型定義追加
2. 環境別ログレベル制御の実装
3. 標準ログコンテキストの定義

#### Phase 2: 段階的移行（2-3週間）
1. 高頻度使用箇所の console.* → logger.* 移行
2. エラーログの構造化・分類化
3. 設定関連ログの統一

#### Phase 3: 監視・分析強化（1-2週間）
1. パフォーマンス監視ログの追加
2. ログ分析用タグの整備
3. アラート設定の最適化

### 7. 移行時の注意点

#### 7.1 後方互換性
- 既存のログ出力を段階的に移行
- 重要なログは移行期間中は両方式で出力

#### 7.2 パフォーマンス影響
- 本番環境でのログ量増加を監視
- 必要に応じてサンプリング機能を追加

#### 7.3 開発体験
- ローカル開発時の視認性を維持
- デバッグ効率の向上を確認

## 期待される効果

1. **ログ品質向上**: 構造化された一貫性のあるログ
2. **問題解決の迅速化**: エラー分類による効率的なトラブルシューティング
3. **運用監視の強化**: 適切なログレベルによる効果的な監視
4. **開発効率向上**: 統一されたログ方式による開発体験の改善
5. **コスト最適化**: 本番環境でのログ量制御によるコスト削減

この提案により、civicship-portalのログシステムがより効果的で保守性の高いものになることが期待されます。
