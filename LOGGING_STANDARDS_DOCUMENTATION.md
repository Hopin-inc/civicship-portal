# civicship-portal ログレベル設定基準とメタデータ標準化ドキュメント

## 📋 ログレベル設定基準

### 🔴 ERROR レベル
**使用条件**: システム内部障害・アプリケーションバグのみ
- アプリケーションコードのバグ
- データベース接続障害（サーバー側）
- 認証システム基盤の障害
- 予期しないシステム例外

**例**:
```typescript
logger.error("Database connection failed", {
  component: "UserService",
  errorCategory: "system",
  retryable: false,
  error: error.message
});
```

### 🟡 WARN レベル
**使用条件**: 外部要因による一時的問題（監視が必要）
- ネットワーク接続問題（ISP、CDN、モバイル回線）
- プラットフォーム制約（LIFF環境制限）
- 外部API一時的障害
- 設定不備・環境制約

**例**:
```typescript
logger.warn("Network connection temporarily unavailable", {
  component: "ApolloErrorLink",
  errorCategory: "network",
  retryable: true,
  expected: true,
  operation: operationName
});
```

### 🔵 INFO レベル
**使用条件**: ユーザー操作・環境制約による正常な処理
- ユーザー入力エラー（無効な電話番号等）
- 認証プロセスの正常な失敗
- ブラウザ環境制約（IndexedDB制限）
- ユーザー操作による処理中断

**例**:
```typescript
logger.info("Phone verification failed due to invalid code", {
  component: "PhoneAuthService",
  errorCategory: "user_input",
  retryable: true,
  authType: "phone"
});
```

### 🟢 DEBUG レベル
**使用条件**: 開発・デバッグ用詳細情報のみ
- 処理フローの詳細追跡
- パフォーマンス測定
- 開発時のみ必要な情報

**例**:
```typescript
logger.debug("Authentication state transition", {
  component: "AuthStateManager",
  from: previousState,
  to: newState,
  duration: processingTime
});
```

## 🏗️ 標準メタデータ構造

### 必須フィールド

#### `component` (string, 必須)
ログを出力するコンポーネント名
```typescript
component: "AuthProvider" | "ApolloErrorLink" | "LiffService" | "PhoneAuthService"
```

#### `timestamp` (string, 自動付与)
ISO形式のタイムスタンプ（自動生成）

### エラー分類フィールド

#### `errorCategory` (string, エラー時推奨)
エラーの根本原因による分類
```typescript
errorCategory: 
  | "system"              // システム内部エラー
  | "network"             // ネットワーク関連
  | "auth_temporary"      // 一時的認証エラー
  | "user_input"          // ユーザー入力エラー
  | "environment_constraint" // 環境制約
  | "state_management"    // 状態管理エラー
```

#### `retryable` (boolean, エラー時推奨)
エラーがリトライ可能かどうか
```typescript
retryable: true  // 自動リトライまたはユーザー再試行で解決可能
retryable: false // システム修正が必要
```

#### `expected` (boolean, オプション)
予期されるエラーかどうか
```typescript
expected: true   // 環境制約等による予期されるエラー
expected: false  // 予期しないエラー（デフォルト）
```

### 認証ログ専用フィールド

#### `authType` (string, 認証関連ログ必須)
認証方式の種別
```typescript
authType: "liff" | "phone" | "firebase" | "general"
```

#### `sessionId` (string, 自動付与)
セッション識別子（プライバシー保護済み）

### 環境・コンテキスト情報

#### `operation` (string, GraphQL関連)
GraphQL操作名
```typescript
operation: "GetUserProfile" | "CreateReservation"
```

#### `duration` (number, パフォーマンス測定時)
処理時間（ミリ秒）

#### `env` (object, 自動付与)
デバイス・ネットワーク情報（自動収集）

## 🔧 実装パターン

### 基本的なログ出力
```typescript
import { logger } from "@/lib/logging";

// 成功ログ
logger.info("User authentication successful", {
  component: "AuthProvider",
  authType: "liff",
  duration: 1250
});

// エラーログ（適切な分類付き）
logger.warn("LIFF environment constraint detected", {
  component: "LiffService",
  errorCategory: "environment_constraint",
  retryable: false,
  expected: true,
  authType: "liff",
  error: error.message
});
```

### エラー分類の判断フロー
```typescript
const categorizeError = (error: Error, context: string) => {
  const message = error.message.toLowerCase();
  
  if (message.includes('network') || message.includes('fetch')) {
    return {
      level: 'warn',
      errorCategory: 'network',
      retryable: true,
      expected: true
    };
  }
  
  if (message.includes('liff') || message.includes('line')) {
    return {
      level: 'warn',
      errorCategory: 'environment_constraint',
      retryable: false,
      expected: true
    };
  }
  
  if (context === 'user_input') {
    return {
      level: 'info',
      errorCategory: 'user_input',
      retryable: true,
      expected: false
    };
  }
  
  // デフォルト: システムエラーとして扱う
  return {
    level: 'error',
    errorCategory: 'system',
    retryable: false,
    expected: false
  };
};
```

### スロットリング実装（頻繁なエラー対策）
```typescript
// IndexedDBエラー等の頻繁なブラウザ環境エラー用
const logThrottle = new Map<string, number>();
const THROTTLE_DURATION = 5 * 60 * 1000; // 5分

const shouldThrottle = (message: string, level: string): boolean => {
  const key = `${level}:${message}`;
  const now = Date.now();
  const lastLogged = logThrottle.get(key);
  
  if (lastLogged && (now - lastLogged) < THROTTLE_DURATION) {
    return true;
  }
  
  logThrottle.set(key, now);
  return false;
};
```

## 🎯 ログレベル判定チェックリスト

### ERROR レベルチェック
- [ ] アプリケーションコードのバグか？
- [ ] システム内部の障害か？
- [ ] 即座に開発者の対応が必要か？
- [ ] ユーザーが何をしても解決できない問題か？

**すべて「はい」の場合のみERROR**

### WARN レベルチェック
- [ ] 外部要因（ネットワーク、プラットフォーム）による問題か？
- [ ] 一時的な問題で自動復旧の可能性があるか？
- [ ] 監視は必要だが即座の対応は不要か？

### INFO レベルチェック
- [ ] ユーザー操作や環境制約による正常な結果か？
- [ ] ビジネスロジック上の情報として価値があるか？
- [ ] エラーではあるが予期される範囲内か？

## 📊 環境別設定

### 本番環境
```typescript
// 推奨ログレベル: INFO以上
const productionLogLevel = "info";

// DEBUGログは無効化
if (process.env.NODE_ENV === "production") {
  logger.debug = () => {}; // No-op
}
```

### 開発環境
```typescript
// 推奨ログレベル: DEBUG以上
const developmentLogLevel = "debug";

// 詳細なデバッグ情報を出力
logger.debug("Detailed state information", { ... });
```

### ローカル環境
```typescript
// ログ転送を無効化
const isLocal = process.env.NODE_ENV === "development" && 
                process.env.NEXT_PUBLIC_VERCEL_ENV !== "preview";

if (isLocal) {
  // コンソール出力のみ、サーバー転送なし
}
```

## 🔒 プライバシー保護

### 自動マスキング対象
- 電話番号: `090-****-****`
- ユーザーID: SHA-256ハッシュ化
- 個人識別情報: 自動検出・マスキング

### 実装例
```typescript
import { maskSensitiveData } from "@/lib/logging/server/utils";

logger.info("User registration attempt", {
  component: "UserService",
  phoneNumber: maskSensitiveData(phoneNumber), // 自動マスキング
  userId: hashUserId(userId) // ハッシュ化
});
```

## 📈 監視・アラート設定

### ERROR レベル
- **即座にアラート**: Slack/メール通知
- **エスカレーション**: 15分以内に対応開始

### WARN レベル
- **集約アラート**: 1時間に10件以上で通知
- **トレンド監視**: 増加傾向の検出

### INFO レベル
- **ダッシュボード表示**: リアルタイム監視
- **週次レポート**: 傾向分析

## 🔄 継続的改善

### 月次レビュー項目
1. **ログレベル適正性**: 誤分類されたログの特定
2. **ログ量最適化**: 不要なログの削除
3. **メタデータ有効性**: 分析に役立つメタデータの評価
4. **コスト効率**: Google Cloud Logging費用の監視

### 改善指標
- ERROR ログ削減率: 目標80%以上
- 誤アラート削減率: 目標90%以上
- ログ品質スコア: メタデータ完全性90%以上

---

**最終更新**: 2025年7月25日  
**バージョン**: 1.0  
**作成者**: Devin AI (@sigma-xing2)  
**レビュー**: 要人的レビュー
