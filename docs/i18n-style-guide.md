# i18n スタイルガイド

## キー命名規則

### フラットなドット区切りスキーム

すべての翻訳キーは、フラットなドット区切り形式を使用します。

**形式:** `{feature}.{component}.{element}`

**例:**
```
auth.login.welcomeMessage
auth.signup.title
wallets.overview.headerTitle
wallets.card.balanceLabel
phoneVerification.input.headerTitle
phoneVerification.verification.descriptionWithPhone
```

### 命名パターン

#### ラベル
- `{element}Label` - フォームフィールドやセクションのラベル
- 例: `nameLabel`, `prefectureLabel`, `balanceLabel`

#### ボタン
- `{action}Button` - アクションボタン
- 例: `loginButton`, `submitButton`, `sendButton`, `cancelButton`

#### 状態
- `{action}ing` - 進行中の状態
- 例: `loading`, `sending`, `verifying`, `submitting`

#### メッセージ
- `{type}Message` または `{type}` - ユーザーへのメッセージ
- 例: `successMessage`, `errorMessage`, `description`

#### タイトル
- `title` - ページやセクションのメインタイトル
- `headerTitle` - ヘッダーに表示されるタイトル

#### 単位
- `{element}Unit` - 数値の単位
- 例: `pointUnit`, `ticketsUnit`

#### プレースホルダー
- `{element}Placeholder` - 入力フィールドのプレースホルダー
- 例: `namePlaceholder`, `phonePlaceholder`

### 補間

動的コンテンツは補間を使用します。

**形式:** `{variableName}`

**例:**
```json
{
  "wallets.card.balanceHeader": "{tokenName} 残高",
  "auth.login.welcomeMessage": "{communityName}を利用するにはLINEでログインして下さい"
}
```

**使用例:**
```tsx
t('wallets.card.balanceHeader', { tokenName: currentCommunityConfig.tokenName })
```

### 時制と形式

- **ボタンテキスト:** 命令形（例: "送信", "キャンセル"）
- **ラベル:** 名詞形（例: "名前", "電話番号"）
- **メッセージ:** 完全な文（例: "ログインに成功しました"）

### 名前空間の境界

各機能は独自の名前空間を持ちます：

- `auth.*` - 認証関連（ログイン、サインアップ、ログアウト）
- `phoneVerification.*` - 電話番号認証
- `wallets.*` - ウォレット関連
- `transactions.*` - 取引履歴
- `users.*` - ユーザープロフィール
- `common.*` - 共通要素（ボタン、エラーメッセージなど）

### ファイル構造

**推奨:** 機能ごとに1ファイル

```
src/messages/
  ja/
    common.json
    auth.json
    phoneVerification.json
    wallets.json
    transactions.json
    users.json
  en/
    common.json
    auth.json
    phoneVerification.json
    wallets.json
    transactions.json
    users.json
```

### 例

#### 良い例 ✅

```json
{
  "auth.login.welcomeMessage": "を利用するにはLINEでログインして下さい",
  "auth.login.loginButton": "LINEでログイン",
  "auth.login.loggingIn": "ログイン中...",
  "auth.signup.nameLabel": "本名",
  "auth.signup.namePlaceholder": "山田太郎",
  "wallets.card.balanceLabel": "残高",
  "wallets.card.pointUnit": "pt"
}
```

#### 悪い例 ❌

```json
{
  "Login": {
    "description": "を利用するにはLINEでログインして下さい",
    "button": "LINEでログイン"
  },
  "WalletCard": {
    "balance": "残高",
    "unit": "pt"
  }
}
```

## 実装ガイドライン

### useTranslations の使用

```tsx
import { useTranslations } from 'next-intl';

export function LoginView() {
  const t = useTranslations();
  
  return (
    <div>
      <p>{t('auth.login.welcomeMessage')}</p>
      <button>{t('auth.login.loginButton')}</button>
    </div>
  );
}
```

### 補間の使用

```tsx
import { useTranslations } from 'next-intl';

export function WalletCard() {
  const t = useTranslations();
  
  return (
    <div>
      {t('wallets.card.balanceHeader', { 
        tokenName: currentCommunityConfig.tokenName 
      })}
    </div>
  );
}
```

### 条件付きメッセージ

```tsx
const message = isSuccess 
  ? t('auth.login.successMessage')
  : t('auth.login.errorMessage');
```

### リッチテキスト（HTML）の使用

翻訳文字列にHTMLタグを含める場合は、`t.rich()`を使用します。これにより、安全にリッチテキストを変換できます。

**翻訳ファイル (ja/auth.json):**
```json
{
  "auth.login.welcomeMessage": "<b>{communityName}</b>を利用するにはLINEでログインして下さい"
}
```

**コンポーネント内:**
```tsx
import { useTranslations } from 'next-intl';

export function LoginView() {
  const t = useTranslations();
  
  return (
    <div>
      {t.rich("auth.login.welcomeMessage", {
        communityName: currentCommunityConfig.title,
        b: (chunks) => <strong className="font-bold">{chunks}</strong>,
      })}
    </div>
  );
}
```

**注意:** 生のHTMLを直接注入するのではなく、`t.rich()`を使用して安全にリッチテキストを変換してください。

## チェックリスト

新しい翻訳を追加する際は、以下を確認してください：

- [ ] フラットなドット区切り形式を使用している
- [ ] 命名パターンに従っている
- [ ] 日本語と英語の両方のファイルに追加している
- [ ] 動的コンテンツには補間を使用している
- [ ] ハードコードされた文字列を削除している
- [ ] 適切な名前空間に配置している
