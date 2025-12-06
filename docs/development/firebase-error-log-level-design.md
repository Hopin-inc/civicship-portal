# Firebase Authentication エラーログレベル設計

## 📋 調査サマリー

SESSION_EXPIRED エラーを含む Firebase Authentication 関連のエラーログレベルを調査し、適切なログレベルへの変更を設計しました。

## 🎯 このPRの実装範囲

このPRでは、Firebase認証エラーの包括的なログレベル改善とi18n対応を実装しています。

### 実装済みエラーコード（全20種類）

#### 既存エラーコード（8種類 - messageKey追加）
1. `auth/network-request-failed` - ネットワーク接続失敗 → **WARN**
2. `auth/user-token-expired` / `auth/id-token-expired` - トークン有効期限切れ → **INFO**
3. `auth/invalid-credential` / `auth/user-disabled` - 認証情報無効 → **WARN**
4. `auth/requires-recent-login` - 再認証が必要 → **INFO**
5. `auth/invalid-verification-code` - 無効な認証コード → **INFO**
6. `auth/too-many-requests` - レート制限 → **WARN**
7. `auth/code-expired` - 認証コードの有効期限切れ → **WARN**
8. `auth/operation-not-allowed` - SMS送信が有効化されていない → **ERROR** (WARN から変更)

#### 新規追加エラーコード（12種類）

**ERROR レベル（7種類）**:
9. `auth/quota-exceeded` - APIクォータ超過
10. `auth/app-not-authorized` - アプリケーション未承認
11. `auth/app-not-verified` - アプリケーション未検証
12. `auth/missing-verification-code` - 認証コード未入力（システムエラー）
13. `auth/internal-error` - Firebase内部エラー
14. `auth/missing-verification-id` - 認証ID欠落
15. `auth/invalid-app-credential` / `auth/missing-app-credential` - アプリ認証情報無効

**WARN レベル（2種類）**:
16. `auth/too-many-attempts-try-later` - 認証試行回数超過
17. `auth/captcha-check-failed` - CAPTCHA検証失敗

**INFO レベル（2種類）**:
18. `auth/invalid-phone-number` - 電話番号形式エラー
19. `auth/missing-phone-number` - 電話番号未入力

#### メッセージベースエラー（1種類）
20. `SESSION_EXPIRED` (Cloud Identity Toolkit) - セッション有効期限切れ → **WARN**

### 実装内容
1. **`categorizeFirebaseError` 関数の拡張**
   - `messageKey` フィールドを追加（i18n対応）
   - 12個の新規エラーコードを追加
   - `auth/operation-not-allowed` を WARN → ERROR に変更（errorCategory も environment_constraint → config に変更）
   - `SESSION_EXPIRED` のメッセージベース判定を追加（error.code チェックの後に配置）
   - `auth/captcha-check-failed` の errorCategory を environment_constraint に変更

2. **i18n対応**
   - `src/messages/ja/auth.json` に20個の翻訳キーを追加
   - `src/messages/en/auth.json` に20個の翻訳キーを追加
   - UIコンポーネントで `t(categorized.messageKey)` を使用可能

3. **ログ出力の統一**
   - `logFirebaseError` ヘルパー関数は既に実装済み（変更不要）
   - 電話認証関連の全ログ出力は既に `logFirebaseError` を使用中

### retryable フラグの定義

`retryable` フラグは、ユーザーが入力を修正したり、待機時間を置いた後に再試行可能かどうかを示します：

- **`retryable: true`**: ユーザーが入力を修正する、または待機することで解決可能
  - 例: `auth/invalid-phone-number`, `auth/invalid-verification-code`, `auth/code-expired`, `auth/captcha-check-failed`
  
- **`retryable: false`**: システムまたは設定の問題で、ユーザーの再試行では解決不可能
  - 例: `auth/quota-exceeded`, `auth/app-not-authorized`, `auth/operation-not-allowed`, `auth/too-many-attempts-try-later`

### エラー判定の優先順位

`categorizeFirebaseError` 関数は以下の優先順位でエラーを判定します：

1. **`error.code` による判定**（最優先）
   - Firebase SDK が提供する標準エラーコード
   - 20種類のエラーコードを網羅

2. **`error.message` による判定**
   - `SESSION_EXPIRED`: Cloud Identity Toolkit 固有のエラー
   - `LIFF authentication failed`: LINE認証エラー

3. **未知のエラー**（フォールバック）
   - `type: "unknown"`, `logLevel: "error"`, `errorCategory: "system"`

### 対象エラー

ユーザーから報告された Google Cloud Identity Toolkit のエラーログ:
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

## 🔍 調査結果

### SESSION_EXPIRED エラーの詳細

**Firebase エラーコード**: `auth/code-expired` (ID: 17051)
**意味**: SMSコードの有効期限が切れました。再送信してください。
**カテゴリ**: **予期される動作 (Expected Behavior)**

**発生原因**:
- ユーザーが電話認証コードを受信後、時間内に入力しなかった
- SMSコードのデフォルト有効期限（通常数分）が経過した
- ユーザーが後で戻ってきて期限切れのコードを入力しようとした

**参考**: [Firebase GitHub Issue #3949](https://github.com/FirebaseExtended/flutterfire/issues/3949)

### 類似のユーザー起因・予期されるエラー

Google Cloud Identity Platform のエラーコードドキュメントに基づく分類:

#### 1. 予期される動作 (Expected Behavior) → INFO/WARN レベル推奨

| エラーコード | Firebase Code | 説明 | 現状 | 推奨 |
|------------|--------------|------|------|------|
| SESSION_EXPIRED | `auth/code-expired` (17051) | SMSコードの有効期限切れ | ERROR | **WARN** |
| EMAIL_CHANGE_NEEDS_VERIFICATION | `auth/email-change-needs-verification` (17090) | メール変更には確認が必要 | - | **INFO** |
| MULTI_FACTOR_AUTH_REQUIRED | `auth/multi-factor-auth-required` (17078) | 多要素認証が必要 | - | **INFO** |

#### 2. ユーザー起因エラー (User-Caused) → INFO レベル推奨

| エラーコード | Firebase Code | 説明 | 現状 | 推奨 |
|------------|--------------|------|------|------|
| INVALID_CODE | `auth/invalid-verification-code` (17044) | 無効な認証コード | WARN | **WARN** *(変更済)* |
| INVALID_PHONE_NUMBER | `auth/invalid-phone-number` (17042) | 無効な電話番号 | - | **INFO** |
| MISSING_PHONE_NUMBER | `auth/missing-phone-number` (17041) | 電話番号未入力 | - | **INFO** |
| CAPTCHA_CHECK_FAILED | `auth/captcha-check-failed` (17056) | reCAPTCHA検証失敗 | - | **WARN** |
| SECOND_FACTOR_ALREADY_ENROLLED | `auth/second-factor-already-enrolled` (17087) | 既に登録済み | - | **INFO** |
| MAXIMUM_SECOND_FACTOR_COUNT_EXCEEDED | `auth/maximum-second-factor-count-exceeded` (17088) | 登録上限超過 | - | **INFO** |

#### 3. システム/設定エラー (System Error) → ERROR レベル維持

| エラーコード | Firebase Code | 説明 | 現状 | 推奨 |
|------------|--------------|------|------|------|
| APP_NOT_AUTHORIZED | `auth/app-not-authorized` (17028) | アプリが承認されていない | ERROR | **ERROR** |
| APP_NOT_VERIFIED | `auth/app-not-verified` (17055) | アプリが検証されていない | ERROR | **ERROR** |
| QUOTA_EXCEEDED | `auth/quota-exceeded` (17052) | クォータ超過 | ERROR | **ERROR** |
| MISSING_MULTI_FACTOR_SESSION | `auth/missing-multi-factor-session` (17081) | セッション情報欠落 | - | **ERROR** |

#### 4. 外部要因エラー (External Factor) → WARN レベル推奨

| エラーコード | Firebase Code | 説明 | 現状 | 推奨 |
|------------|--------------|------|------|------|
| NETWORK_REQUEST_FAILED | `auth/network-request-failed` | ネットワーク接続失敗 | - | **WARN** |
| TOO_MANY_REQUESTS | `auth/too-many-requests` | レート制限 | - | **WARN** |

## 📊 現在のコードベースでの該当箇所

### 1. PhoneAuthService (src/lib/auth/service/phone-auth-service.ts)

#### Line 127-134: Phone verification start failed
```typescript
logger.error("[PhoneAuthService] Phone verification start failed", {
  error: error instanceof Error ? error.message : String(error),
  errorCode: (error as any)?.code,
  phoneMasked: phoneNumber.replace(/\d(?=\d{4})/g, '*'),
  component: "PhoneAuthService",
});
```

**問題点**: すべてのエラーをERRORとして記録
**推奨**: Firebase エラーコードに基づいて分類

**改善案**:
```typescript
const categorized = categorizeFirebaseError(error);
const logLevel = categorized.retryable && categorized.type !== 'system' ? 'warn' : 'error';

logger[logLevel]("[PhoneAuthService] Phone verification start failed", {
  error: error instanceof Error ? error.message : String(error),
  errorCode: (error as any)?.code,
  errorCategory: categorized.type,
  retryable: categorized.retryable,
  phoneMasked: phoneNumber.replace(/\d(?=\d{4})/g, '*'),
  component: "PhoneAuthService",
});
```

#### Line 144: Missing verificationId
```typescript
logger.error("Missing verificationId", { component: "PhoneAuthService" });
```

**問題点**: これはシステムエラーなのでERRORが適切
**推奨**: ERRORレベル維持（変更不要）

#### Line 174: verifyPhoneCode failed
```typescript
logger.warn("verifyPhoneCode failed", {
  error: error instanceof Error ? error.message : String(error),
  component: "PhoneAuthService",
});
```

**状態**: ✅ **変更済み** (PR #782 でERROR → WARNに変更)
**推奨**: 現状のWARNレベル維持

### 2. useCodeVerification (src/app/sign-up/phone-verification/hooks/useCodeVerification.ts)

#### Line 67: Invalid code or missing phoneUid
```typescript
logger.error("[useCodeVerification] Invalid code or missing phoneUid");
```

**問題点**: ユーザーが無効なコードを入力した場合はINFOが適切
**推奨**: INFOレベルに変更

**改善案**:
```typescript
logger.info("[useCodeVerification] Invalid code or missing phoneUid", {
  component: "useCodeVerification",
  errorCategory: "user_input",
  retryable: true,
  authType: "phone",
});
```

#### Line 143: Verification failed
```typescript
logger.error("[useCodeVerification] Verification failed", {
  error: error instanceof Error ? error.message : String(error),
});
```

**問題点**: エラーの種類を判別せずにERRORとして記録
**推奨**: Firebase エラーコードに基づいて分類

### 3. usePhoneSubmission (src/app/sign-up/phone-verification/hooks/usePhoneSubmission.ts)

#### Line 94, 179: Phone verification ID mismatch
```typescript
logger.error("Phone verification ID mismatch", {
  verificationIdReturned: !!verificationId,
  verificationIdStored: !!storedId,
});
```

**問題点**: これはシステム的な不整合なのでERRORが適切
**推奨**: ERRORレベル維持（変更不要）

#### Line 110, 200: Phone verification submission/resend failed
```typescript
logger.error("Phone verification submission failed", {
  errorCode: (error as any)?.code,
  errorMessage: (error as any)?.message,
});
```

**問題点**: エラーの種類を判別せずにERRORとして記録
**推奨**: `categorizeFirebaseError` を使用して分類済み（`handleSubmissionError`内）

**現状確認**: ✅ すでに`categorizeFirebaseError`を使用しているが、ログ出力前の段階

**改善案**: ログレベルも動的に設定
```typescript
const categorized = categorizeFirebaseError(error);
const logLevel = categorized.type === 'user_input' || categorized.type === 'verification'
  ? 'info'
  : categorized.retryable
    ? 'warn'
    : 'error';

logger[logLevel]("Phone verification submission failed", {
  errorCode: (error as any)?.code,
  errorMessage: (error as any)?.message,
  errorCategory: categorized.type,
  retryable: categorized.retryable,
  component: "usePhoneSubmission",
});
```

### 4. useStartPhoneVerification (src/hooks/auth/actions/useStartPhoneVerification.ts)

#### Line 27: Failed to start phone verification
```typescript
logger.error("Failed to start phone verification", {
  error: error instanceof Error ? error.message : String(error),
  phoneNumber,
  component: "AuthActions",
});
```

**問題点**: エラーの種類を判別せずにERRORとして記録
**推奨**: Firebase エラーコードに基づいて分類

## 🎯 設計提案

### 提案1: categorizeFirebaseError 関数の拡張

現在の `categorizeFirebaseError` (src/lib/auth/core/firebase-config.ts) に以下を追加:

> **注**: 以下のコードは最終的な目標状態を示しています。このPRでは「このPRの実装範囲」セクションに記載されたエラーコードのみを対応し、その他のエラーコード（`auth/invalid-phone-number`, `auth/app-not-authorized`, `auth/quota-exceeded`など）は将来のPhase 2/3で実装予定です。

```typescript
export const categorizeFirebaseError = (
  error: any,
): {
  type: string;
  message: string;
  retryable: boolean;
  logLevel: 'error' | 'warn' | 'info';  // 追加
  errorCategory: string;  // logging-standards.md に準拠
} => {
  if (error?.code) {
    const code = error.code as string;

    // SESSION_EXPIRED エラーを追加
    if (code === "auth/code-expired") {
      return {
        type: "verification",  // 注: 認証コード(verification code)の有効期限切れのため"verification"を使用。トークン有効期限切れ(auth/user-token-expired)とは区別
        message: "認証コードの有効期限が切れました。再度送信してください。",
        retryable: true,
        logLevel: "warn",  // 予期される動作
        errorCategory: "user_input",
      };
    }

    if (code === "auth/network-request-failed") {
      return {
        type: "network",
        message: "ネットワーク接続に問題が発生しました。インターネット接続を確認してください。",
        retryable: true,
        logLevel: "warn",  // 外部要因
        errorCategory: "network",
      };
    }

    if (code === "auth/user-token-expired" || code === "auth/id-token-expired") {
      return {
        type: "expired",
        message: "認証の有効期限が切れました。再認証が必要です。",
        retryable: false,
        logLevel: "info",  // 予期される動作
        errorCategory: "auth_temporary",
      };
    }

    if (code === "auth/invalid-credential" || code === "auth/user-disabled") {
      return {
        type: "auth",
        message: "認証情報が無効です。再ログインしてください。",
        retryable: false,
        logLevel: "warn",  // 外部要因
        errorCategory: "auth_temporary",
      };
    }

    if (code === "auth/requires-recent-login") {
      return {
        type: "reauth",
        message: "セキュリティのため再認証が必要です。",
        retryable: false,
        logLevel: "info",  // 予期される動作
        errorCategory: "auth_temporary",
      };
    }

    if (code === "auth/invalid-verification-code") {
      return {
        type: "verification",
        message: "認証コードが無効です。正しいコードを入力してください。",
        retryable: true,
        logLevel: "info",  // ユーザー入力エラー
        errorCategory: "user_input",
      };
    }

    if (code === "auth/too-many-requests") {
      return {
        type: "rate-limit",
        message: "短時間に大量のリクエストが発生しました。しばらく待ってから再試行してください。",
        retryable: false,
        logLevel: "warn",  // 外部要因（監視必要）
        errorCategory: "network",
      };
    }

    if (code === "auth/invalid-phone-number" || code === "auth/missing-phone-number") {
      return {
        type: "validation",
        message: "電話番号が無効または未入力です。",
        retryable: true,
        logLevel: "info",  // ユーザー入力エラー
        errorCategory: "user_input",
      };
    }

    if (code === "auth/app-not-authorized" || code === "auth/app-not-verified") {
      return {
        type: "config",
        message: "アプリケーションの設定に問題があります。",
        retryable: false,
        logLevel: "error",  // システム設定エラー
        errorCategory: "config",
      };
    }

    if (code === "auth/quota-exceeded") {
      return {
        type: "quota",
        message: "APIクォータを超過しました。",
        retryable: false,
        logLevel: "error",  // システムエラー
        errorCategory: "system",
      };
    }
  }

  if (error?.message?.includes("LIFF authentication failed")) {
    return {
      type: "api",
      message: "LINE認証サービスとの通信に失敗しました。",
      retryable: true,
      logLevel: "warn",  // 外部要因
      errorCategory: "network",
    };
  }

  return {
    type: "unknown",
    message: "認証中に予期せぬエラーが発生しました。",
    retryable: false,
    logLevel: "error",  // 未知のエラーは安全のためERROR
    errorCategory: "system",
  };
};
```

### 提案2: 統一的なログ出力ヘルパー関数

```typescript
/**
 * Firebase エラーを適切なログレベルで記録する
 */
export const logFirebaseError = (
  error: any,
  context: string,
  additionalMetadata?: Record<string, any>,
) => {
  const categorized = categorizeFirebaseError(error);

  logger[categorized.logLevel](context, {
    error: error instanceof Error ? error.message : String(error),
    errorCode: error?.code,
    errorCategory: categorized.errorCategory,
    retryable: categorized.retryable,
    authType: "phone",
    ...additionalMetadata,
  });
};
```

### 提案3: 段階的な適用計画

#### Phase 1: 緊急対応（SESSION_EXPIRED のみ）
- [ ] `categorizeFirebaseError` に `auth/code-expired` のハンドリングを追加
- [ ] PhoneAuthService の `verifyPhoneCode` メソッドでの適用確認
- [ ] 本番環境で SESSION_EXPIRED エラーが WARN レベルになることを確認

#### Phase 2: 電話認証エラー全体の改善
- [ ] `logFirebaseError` ヘルパー関数の実装
- [ ] PhoneAuthService 全体への適用
- [ ] useCodeVerification への適用
- [ ] usePhoneSubmission への適用
- [ ] useStartPhoneVerification への適用

#### Phase 3: 認証全体への展開
- [ ] LINE認証エラーへの適用
- [ ] その他のFirebase認証エラーへの適用
- [ ] ログレベル変更の効果測定

## 📈 期待される効果

### 1. アラート精度の向上
- **現状**: SESSION_EXPIRED のような予期されるエラーで誤アラート発生
- **改善後**: 真のシステムエラーのみがERRORレベルでアラート
- **削減見込み**: ERROR ログ 40-60% 削減見込み（実測データに基づく検証が必要）

### 2. 監視効率の向上
- **現状**: エラーログのノイズが多く、重要なエラーが埋もれる
- **改善後**: ログレベルでフィルタリング可能
- **効果**: 重大なシステムエラーの検知時間短縮（見込み）

### 3. コスト削減
- **現状**: 大量の ERROR ログによる Cloud Logging コスト増加
- **改善後**: 適切なログレベル分類によるコスト最適化
- **削減見込み**: ログコスト 20-30% 削減見込み（実測データに基づく検証が必要）

### 4. ログレベル標準化への準拠
- `docs/development/logging-standards.md` の基準に完全準拠
- チーム全体での一貫したログレベル運用
- 新規機能開発時の迷いを削減

## 🔧 実装時の注意事項

### 1. 後方互換性
- 既存のログ監視ダッシュボードへの影響を確認
- ERROR レベルのアラート設定の見直しが必要

### 2. テスト
- 各エラーコードが正しいログレベルで記録されることを確認
- E2Eテストでログレベルの検証を追加

### 3. ドキュメント
- `logging-standards.md` にFirebase固有のエラー分類を追記
- チームへの周知と教育

### 4. モニタリング
- ログレベル変更後の1-2週間は集中モニタリング
- 誤分類されたエラーがないか確認
- 必要に応じて `categorizeFirebaseError` の調整

## 📝 チェックリスト

### ERROR レベル判定（logging-standards.md 準拠）
- [x] アプリケーションコードのバグか？ → **No**
- [x] システム内部の障害か？ → **No**
- [x] 設定・環境変数の誤りか？ → **No**
- [x] 即座に開発者の対応が必要か？ → **No**
- [x] ユーザーが何をしても解決できない問題か？ → **No**

**結論**: SESSION_EXPIRED は ERROR レベルではない

### WARN レベル判定
- [x] 外部要因（ネットワーク、プラットフォーム）による問題か？ → **Partial** (Firebase側のタイムアウト)
- [x] 一時的な問題で自動復旧の可能性があるか？ → **Yes** (再送信で解決)
- [x] 監視は必要だが即座の対応は不要か？ → **Yes**

**結論**: SESSION_EXPIRED は WARN レベルが適切

### INFO レベル判定
- [x] ユーザー操作や環境制約による正常な結果か？ → **Yes** (ユーザーが時間内に入力しなかった)
- [x] ビジネスロジック上の情報として価値があるか？ → **Limited**
- [x] エラーではあるが予期される範囲内か？ → **Yes**

**別の観点**: INFO も適切だが、監視の観点から WARN を推奨

## 🎯 最終推奨

### SESSION_EXPIRED エラー
**推奨ログレベル**: **WARN**

**理由**:
1. ユーザー操作の結果として予期される動作
2. システムエラーではない
3. 再送信で解決可能
4. ただし、頻度が高い場合はUX改善が必要（監視対象）

### その他のエラー
上記の分類表に従って、各エラーコードに応じた適切なログレベルを適用

---

**作成日**: 2025-10-31
**作成者**: Claude Code
**レビュー状態**: 要レビュー
**関連PR**: #782 (INVALID_CODE エラーのログレベル変更)
