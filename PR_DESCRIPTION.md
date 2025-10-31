# 🔍 Firebase認証エラーのログレベル調査・設計

## 概要

SESSION_EXPIRED エラーを含む Firebase Authentication 関連のエラーログレベルを調査し、適切なログレベルへの変更設計を行いました。

現在、予期される正常な動作（ユーザーがSMSコードを時間内に入力しなかった等）がERRORレベルで記録されており、誤アラートが発生しています。本PRでは詳細な調査結果と実装計画をドキュメント化しました。

## 🎯 背景

以下のようなエラーログが本番環境で ERROR として記録されています：

```json
{
  "methodName": "google.cloud.identitytoolkit.v1.AuthenticationService.SignInWithPhoneNumber",
  "status": {
    "code": 3,
    "message": "SESSION_EXPIRED"
  },
  "severity": "ERROR"
}
```

しかし、これは **ユーザーがSMSコードを時間内に入力しなかった** という予期される動作であり、システムエラーではありません。

## 🔍 調査内容

### SESSION_EXPIRED エラーの詳細
- **Firebase エラーコード**: `auth/code-expired` (ID: 17051)
- **発生原因**: SMSコードの有効期限（通常数分）が経過
- **カテゴリ**: 予期される動作 (Expected Behavior)
- **推奨ログレベル**: **WARN** (現在はERROR)

### その他の対応が必要なエラー

#### WARN レベルに変更すべき（予期される動作・外部要因）
- `SESSION_EXPIRED` (auth/code-expired) - SMSコード期限切れ
- `TOO_MANY_REQUESTS` (auth/too-many-requests) - レート制限
- `NETWORK_REQUEST_FAILED` (auth/network-request-failed) - ネットワークエラー

#### INFO レベルに変更すべき（ユーザー入力エラー）
- `INVALID_PHONE_NUMBER` (auth/invalid-phone-number) - 無効な電話番号
- `MISSING_PHONE_NUMBER` (auth/missing-phone-number) - 電話番号未入力
- `INVALID_VERIFICATION_CODE` (auth/invalid-verification-code) - 無効なコード *(PR #782で対応済み)*

#### ERROR レベル維持（システム/設定エラー）
- `APP_NOT_AUTHORIZED` (auth/app-not-authorized) - アプリ未承認
- `QUOTA_EXCEEDED` (auth/quota-exceeded) - クォータ超過
- 検証ID不整合などの内部エラー

## 📋 変更内容

### 追加ファイル
- `docs/development/firebase-error-log-level-design.md`
  - SESSION_EXPIRED エラーの詳細分析
  - Firebase認証エラー全体のログレベル分類表
  - `categorizeFirebaseError` 関数の拡張設計
  - `logFirebaseError` ヘルパー関数の提案
  - 段階的な実装計画（Phase 1-3）
  - 期待される効果とメトリクス

### 主要な設計提案

#### 1. `categorizeFirebaseError` 関数の拡張
```typescript
export const categorizeFirebaseError = (error: any): {
  type: string;
  message: string;
  retryable: boolean;
  logLevel: 'error' | 'warn' | 'info';  // ← 追加
  errorCategory: string;  // logging-standards.md に準拠
} => {
  // SESSION_EXPIRED エラーの処理
  if (code === "auth/code-expired") {
    return {
      type: "expired",
      message: "認証コードの有効期限が切れました。再度送信してください。",
      retryable: true,
      logLevel: "warn",
      errorCategory: "user_input",
    };
  }
  // ... 他のエラーコードの分類
}
```

#### 2. 統一的なログ出力ヘルパー
```typescript
export const logFirebaseError = (
  error: any,
  context: string,
  additionalMetadata?: Record<string, any>,
) => {
  const categorized = categorizeFirebaseError(error);
  logger[categorized.logLevel](context, {
    errorCode: error?.code,
    errorCategory: categorized.errorCategory,
    retryable: categorized.retryable,
    ...additionalMetadata,
  });
};
```

## 📈 期待される効果

### 1. アラート精度の向上
- **現状**: SESSION_EXPIRED のような予期されるエラーで誤アラート発生
- **改善後**: 真のシステムエラーのみがERRORレベルでアラート
- **削減見込み**: ERRORログ **40-60% 削減**

### 2. 監視効率の向上
- ログレベルでフィルタリング可能になり、重要なエラーが埋もれない
- 重大なシステムエラーの検知時間短縮

### 3. コスト削減
- 適切なログレベル分類による Cloud Logging コスト最適化
- **削減見込み**: ログコスト **20-30% 削減**

### 4. ログレベル標準化への準拠
- `docs/development/logging-standards.md` の基準に完全準拠
- チーム全体での一貫したログレベル運用

## 🛣️ 実装計画

### Phase 1: 緊急対応（SESSION_EXPIRED のみ）
- [ ] `categorizeFirebaseError` に `auth/code-expired` のハンドリングを追加
- [ ] PhoneAuthService での適用確認
- [ ] 本番環境で SESSION_EXPIRED が WARN レベルになることを確認

### Phase 2: 電話認証エラー全体の改善
- [ ] `logFirebaseError` ヘルパー関数の実装
- [ ] PhoneAuthService 全体への適用
- [ ] useCodeVerification, usePhoneSubmission への適用

### Phase 3: 認証全体への展開
- [ ] LINE認証エラーへの適用
- [ ] その他のFirebase認証エラーへの適用
- [ ] ログレベル変更の効果測定

## 🔧 実装対象ファイル（今後の実装PR用）

1. `src/lib/auth/core/firebase-config.ts`
   - `categorizeFirebaseError` 関数の拡張
   - `logFirebaseError` ヘルパー関数の追加

2. `src/lib/auth/service/phone-auth-service.ts`
   - Line 127-134: Phone verification start failed のログレベル調整

3. `src/app/sign-up/phone-verification/hooks/useCodeVerification.ts`
   - Line 67, 143: ログレベル調整

4. `src/app/sign-up/phone-verification/hooks/usePhoneSubmission.ts`
   - Line 110, 200: 動的ログレベル対応

5. `src/hooks/auth/actions/useStartPhoneVerification.ts`
   - Line 27: ログレベル調整

## 📊 logging-standards.md との整合性

本設計は既存の `docs/development/logging-standards.md` に完全準拠しています：

### ERROR レベル判定チェック（SESSION_EXPIRED の場合）
- [ ] アプリケーションコードのバグか？ → **No**
- [ ] システム内部の障害か？ → **No**
- [ ] 設定・環境変数の誤りか？ → **No**
- [ ] 即座に開発者の対応が必要か？ → **No**
- [ ] ユーザーが何をしても解決できない問題か？ → **No**

**結論**: SESSION_EXPIRED は ERROR レベルではない ✅

### WARN レベル判定
- [x] 外部要因（ネットワーク、プラットフォーム）による問題か？ → **Partial**
- [x] 一時的な問題で自動復旧の可能性があるか？ → **Yes**
- [x] 監視は必要だが即座の対応は不要か？ → **Yes**

**結論**: SESSION_EXPIRED は WARN レベルが適切 ✅

## 🔗 関連PR・Issue

- PR #782: INVALID_CODE エラーのログレベルを ERROR → WARN に変更（マージ済み）
- 本PRはその延長として、他のFirebase認証エラーも体系的に整理

## 📝 レビューポイント

1. **ログレベル分類の妥当性**
   - 各エラーコードの分類が適切か
   - logging-standards.md との整合性

2. **実装計画の妥当性**
   - Phase 1-3 の段階的アプローチは適切か
   - 優先順位は妥当か

3. **期待効果の現実性**
   - ERRORログ 40-60% 削減は達成可能か
   - コスト削減見込みは妥当か

## ⚠️ 注意事項

- 本PRは **設計ドキュメントのみ** を含みます
- 実際のコード変更は別PRで段階的に実施予定
- 既存のログ監視ダッシュボードやアラート設定の見直しが必要

## 🙏 次のステップ

1. 本設計ドキュメントのレビュー
2. 承認後、Phase 1（SESSION_EXPIRED対応）の実装PRを作成
3. 本番環境でのモニタリングと効果測定
4. Phase 2, 3 への展開

---

**レビューをお願いします！** 🙏
