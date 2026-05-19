# 新しいコミュニティの追加方法

新しいコミュニティを civicship-portal に追加する際の手順をまとめます。LINE 公式アカウントの作成から、コミュニティ作成・ポータル設定・LIFF 動作確認までの一連の流れを記載します。

## 全体像

LINE 側のセットアップを終えてから civicship-portal 側の作成・設定に進みます。

| ステップ | 内容 | 場所 |
|---|---|---|
| 0-1. LINE 公式アカウント作成 | LINE Business ID でアカウント取得、Official Account 作成 | LINE Account Manager |
| 0-2. LINE プロバイダ＆チャネル作成 | Messaging API channel、LIFF アプリ、LINE Login channel | LINE Developers Console |
| 1. コミュニティ本体作成 | コミュニティID、名前、LINE 連携、Firebase テナント自動作成 | `/sysAdmin/create` フォーム |
| 2. Firebase OIDC プロバイダ登録 | 自動作成されたテナントに LINE Login のクレデンシャル登録 | Firebase Console |
| 3. ポータルプロフィール設定（UI） | タイトル、説明文、ロゴ、OGP 画像 | `/community/{id}/admin/setting` |
| 4. ポータル詳細設定（GraphQL） | `enableFeatures`、`rootPath` 等 | `updatePortalConfig` mutation |
| 5. リッチメニュー配置 | LINE リッチメニュー画像と設定 | civicship-api 側 CLI (`pnpm richmenu:deploy`) |

ホスティングは現在パスベース（`https://civicship.app/community/{communityId}/...`）の単一 Cloud Run 構成で運用しているため、新規コミュニティごとに DNS / サブドメインを設定する必要はありません。コミュニティ ID の検証は middleware が DB を参照して行うので、フロント側コード（`ACTIVE_COMMUNITY_IDS` 等）を編集する必要もありません。

---

## ステップ 0: LINE 側のセットアップ

LINE 側に作成するアセットは以下の通りです。これらを揃えてから手順1に進みます。

| アセット | 入手するもの | civicship-portal 側で使う場所 |
|---|---|---|
| LINE 公式アカウント | Bot Basic ID | 運用情報。コード設定には不要 |
| Messaging API channel | Channel ID / Channel Secret / Channel Access Token | `/sysAdmin/create` フォーム |
| LIFF アプリ | LIFF ID（`数字-英数字`） | `/sysAdmin/create` フォーム |
| LINE Login channel | Channel ID / Channel Secret | Firebase OIDC プロバイダー登録（ステップ2） |

### 0-1. LINE 公式アカウントの作成

1. [LINE Account Manager](https://manager.line.biz/) にアクセス、LINE Business ID でログイン
2. 「アカウント作成」から Official Account を作成
   - アカウント名（コミュニティ名）
   - 業種
   - 運営者情報
3. 作成後、Bot Basic ID（`@xxxxxxx`）を控えておく（運用配布用）
4. （任意）有料プラン、認証済みアカウントへの申請等を行う

### 0-2. LINE Developers Console での設定

[LINE Developers Console](https://developers.line.biz/console/) にアクセス。

#### Provider の選択／作成

- 既存の Provider に紐付けるか、新規に作成する
- 「Provider」はチャネルをまとめる論理グループ。コミュニティごとに分けるか、Civicship 全体で 1 つにするかは運用ポリシーに合わせる

#### Messaging API channel の作成

1. Provider 配下で「Create a new channel」→ 「Messaging API」を選択
2. 公式アカウントとの紐付け、業種、説明文等を入力
3. 作成後、**Basic settings** タブで以下を取得：
   - **Channel ID**
   - **Channel Secret**
4. **Messaging API** タブで以下を取得：
   - **Channel Access Token (long-lived)** — 「Issue」ボタンで発行
5. （任意）Webhook URL は civicship-api 側のエンドポイントに合わせて設定

> Messaging API channel の Channel ID / Secret / Access Token は `/sysAdmin/create` フォームの「LINE Channel ID」「LINE Channel Secret」「LINE Access Token」に対応します。

#### LIFF アプリの作成

1. Messaging API channel（または LINE Login channel）の **LIFF** タブから「Add」
2. 以下を設定：
   - **LIFF app name**: 任意（例: コミュニティ名）
   - **Size**: `Full`（コミュニティポータルは画面全面を使う想定）
   - **Endpoint URL**: **`https://civicship.app/community/{communityId}`**
     - `{communityId}` はステップ1で作成する `originalId` と一致させる
     - 自動採番予定なら、コミュニティ作成後にここを書き換える
   - **Scopes**: `profile`, `openid`（最低限）
   - **Bot link feature**: 必要なら On
3. 作成後、**LIFF ID**（`数字-英数字` 形式、例: `2009756673-s2ldhFgl`）を控えておく

> **LIFF Endpoint URL は path-based 形式が前提**。サブドメイン運用は廃止済み（単一 Cloud Run 構成）。ここを間違えると LIFF 起動時にコミュニティが解決できず middleware で 404 になります。

#### LINE Login channel の作成（Firebase OIDC 用）

Firebase Identity Platform にコミュニティ専用テナントを作るため、**Messaging API とは別に LINE Login 専用のチャネル**を用意します。

1. Provider 配下で「Create a new channel」→ 「LINE Login」を選択
2. 「Webアプリ」「LINEアプリ」用途等を選択
3. 作成後、**Basic settings** タブで以下を取得：
   - **Channel ID**（Firebase OIDC の Client ID として使う）
   - **Channel Secret**（Firebase OIDC の Client Secret として使う）
4. **LINE Login** タブで以下を設定：
   - **Callback URL**: ステップ2で Firebase が出力する Redirect URL を登録（Firebase Console 側でテナント作成後に判明）
   - **Scopes**: `profile`, `openid`, `email`（必要に応じて）

> LIFF アプリは Messaging API channel と LINE Login channel のどちらの配下にも作成できます。運用しやすい方に置いて構いません。重要なのは **LIFF ID と LINE Login の Channel ID/Secret を取り違えない**こと。

---

## ステップ 1: コミュニティ本体の作成

1. **SYS_ADMIN 権限**を持つアカウントで既存のいずれかのコミュニティにログイン
2. `/sysAdmin/create` にアクセス
3. 以下を入力して「作成」

| フィールド | 必須 | 内容 |
|---|---|---|
| Community Name | ✅ | コミュニティ名 |
| Original ID | 任意 | コミュニティID（未指定なら自動採番） |
| LINE Channel ID | ✅ | Messaging API channel の Channel ID |
| LINE Channel Secret | ✅ | Messaging API channel の Channel Secret |
| LINE Access Token | ✅ | Messaging API channel の Access Token |
| LINE LIFF ID | ✅ | LIFF ID（フロント側で形式バリデーション） |

> **フォーム入力時のメモ**:
> - LINE 認証情報（Channel Secret / Access Token）はバックエンドでは検証されません。入力ミスがあってもエラーにならず保存されるので、貼り付けた値を必ず確認してください。
> - 入力した `LINE LIFF ID` から、フロントの server action (`src/app/sysAdmin/create/features/editor/actions/communityCreate.ts`) が自動で `liffId`（数字部分）と `liffBaseUrl`（`https://liff.line.me/{liffId}`）を派生させて mutation に渡します。UI から作成する分には追加入力不要です。
> - `Original ID` を自動採番した場合、LIFF Endpoint URL に入れる `{communityId}` が変わるため、作成後に LINE Developers Console で Endpoint URL を書き換えてください。

作成成功後、`/community/{communityId}/users/me` へリダイレクトされます。

### 内部処理（参考）

`communityCreate` mutation 1 回で以下が実行されます（civicship-api `usecase.ts:57-88`）。

1. Firebase テナントの自動作成
2. Community レコード作成（テナントID紐付け）
3. Membership(OWNER) 作成
4. Wallet 作成
5. 失敗時は Firebase テナントを cleanup

`CommunityLineConfigInput` 自体は `liffId` と `liffBaseUrl` を独立した必須フィールドとして受け取るため、`/sysAdmin/create` 以外の経路から mutation を直接叩く場合は両方を明示指定する必要があります。シークレット系（`accessToken`, `channelSecret`）は SYS_ADMIN 以外のユーザーには resolver で null マスクされます。

---

## ステップ 2: Firebase Identity Platform へ LINE OIDC プロバイダを登録

ステップ1で自動作成された Firebase テナントに、ステップ0で作った **LINE Login channel** のクレデンシャルを OIDC プロバイダとして登録します。

### 2-1. テナント ID の取得

`communityPortalConfig` query で取得：

```graphql
query GetFirebaseTenantId {
  communityPortalConfig(communityId: "<communityId>") {
    firebaseTenantId
  }
}
```

### 2-2. Firebase Console での登録

1. [Firebase Console](https://console.firebase.google.com/) → 該当プロジェクト → Authentication
2. テナント選択 UI で **取得した `firebaseTenantId`** を選ぶ
3. 「Sign-in method」→ 「Add new provider」→ 「OpenID Connect」
4. 以下を入力：
   - **Provider ID**: `oidc.line`（または運用上の命名規則に合わせる）
   - **Provider name**: `LINE`
   - **Client ID**: LINE Login channel の Channel ID
   - **Client Secret**: LINE Login channel の Channel Secret
   - **Issuer (URL)**: `https://access.line.me`
   - **Grant type**: Code flow
5. Firebase が表示する **Redirect URL** をコピー
6. LINE Developers Console → LINE Login channel → **Callback URL** に貼り付け、保存

---

## ステップ 3: ポータルプロフィールの設定（UI）

`/community/{communityId}/admin/setting` から以下を設定できます。

- タイトル
- 説明文（長）
- 説明文（短）
- ロゴ画像
- スクエアロゴ画像
- OGP 画像

権限: `IsCommunityManager`（OWNER または MANAGER）

---

## ステップ 4: ポータル詳細設定（GraphQL `updatePortalConfig`）

UI では編集できない以下の項目は、`updatePortalConfig` mutation を Apollo Sandbox 等の GraphQL クライアントから直接実行して設定します。

### 必須ヘッダ

- `x-community-id: {対象コミュニティID}` — 対象コミュニティの指定にこのヘッダが**必須**
- 認証: `IsCommunityManager` 権限が必要

### 設定可能フィールド

| フィールド | 型 | 内容 |
|---|---|---|
| `title` / `description` / `shortDescription` | String | プロフィール文（UIでも設定可） |
| `tokenName` | String | ポイントトークン名 |
| `enableFeatures` | [String!] | 有効機能フラグ（`points`, `opportunities`, `quests`, `languageSwitcher` 等）。デフォルト `["points", "justDaoIt", "languageSwitcher"]` |
| `rootPath` | String | ユーザー向けルートパス。**デフォルト `"/"`**。`/community/{id}` 直アクセス時のリダイレクト先（例: `/users/me`） |
| `adminRootPath` | String | 管理者向けルートパス。デフォルト `"/admin"` |
| `regionKey` / `regionName` | String | 地域設定 |
| `documents` | [CommunityDocumentInput!] | 利用規約・プライバシーポリシー等。`null` でクリア |
| `commonDocumentOverrides` | CommonDocumentOverridesInput | 共通ドキュメントの上書き。`null` でクリア |
| `favicon` | ImageInput | ファビコン画像 |
| `logo` / `squareLogo` / `ogImage` | ImageInput | 各種画像（UI からも設定可） |
| `domain` | String | （現在のパスベース運用では未使用。サブドメイン運用時のみ意味を持つ） |

> **`rootPath` 必須設定**: デフォルトの `"/"` のままだと、LIFF や直接アクセスで `/community/{id}` に来た時にユーザー向けの初期画面（例: `/users/me`）へリダイレクトされず、ページ遷移が止まります。新規コミュニティでは必ず設定してください（既存例: `himeji-ymca` は `/users/me`）。

> **画像フィールドの注意**: `logoPath` / `squareLogoPath` / `ogImagePath` / `faviconPrefix` は `@deprecated`。新規実装では `logo` / `squareLogo` / `ogImage` / `favicon`（`ImageInput`）を使用してください。GCS への並列アップロードを backend が代行します。

### mutation 例

```graphql
mutation UpdatePortalConfig($input: CommunityPortalConfigInput!) {
  updatePortalConfig(input: $input) {
    communityId
    enableFeatures
    rootPath
    adminRootPath
  }
}
```

variables:
```json
{
  "input": {
    "enableFeatures": ["points", "opportunities", "quests"],
    "rootPath": "/users/me",
    "adminRootPath": "/admin/wallet"
  }
}
```

### バックエンド対応が必要な項目（mutation 未提供）

以下は現状 `updatePortalConfig` でも更新できません。変更したい場合は civicship-api 側に専用 mutation 追加が必要です。

| 項目 | 設定タイミング | 備考 |
|---|---|---|
| `firebaseTenantId` | `communityCreate` 時のみ自動 | 後から変更する mutation 無し |
| LINE 設定系全般（`channelId` / `channelSecret` / `accessToken` / `liffId` / `liffAppId` / `liffBaseUrl`） | `communityCreate` 時のみ | `CommunityLineConfig` のフィールド。いずれも更新 mutation 未提供のため、間違って登録した場合は backend 側の対応が必要 |

---

## ステップ 5: LINE リッチメニューのデプロイ

リッチメニューは GraphQL ではなく、**civicship-api 側の CLI で配置**します。

```bash
# civicship-api リポジトリで実行
pnpm richmenu:deploy --community=<community_id>           # 単一コミュニティ
pnpm richmenu:deploy --all                                # 全コミュニティ
pnpm richmenu:deploy --community=<id> --dry-run           # 検証のみ
pnpm richmenu:deploy:dev --community=<id>                 # dev 環境
pnpm richmenu:deploy:prd --community=<id>                 # prod 環境
```

各コミュニティで `ADMIN` / `USER` / `PUBLIC` の3種類が登録可能（type ごとに一意制約）。
CLI が LINE API に対して create → image upload → alias 作成 → DB に `richMenuId` を upsert → デフォルト設定までを実行します。

実装: civicship-api `src/infrastructure/richmenu/cli.ts`, `deployer.ts`

---

## 動作確認チェックリスト

- [ ] パスベース `https://civicship.app/community/{id}` でアクセスでき、404 にならない
- [ ] `/community/{id}` で直接アクセスすると `rootPath`（例: `/users/me`）へリダイレクトされる
- [ ] LIFF 起動 URL `https://liff.line.me/{liffId}` から `/community/{id}` 経由でユーザー向け画面に到達できる
- [ ] LINE ログイン（OIDC）が成功する（Firebase テナントへの LINE Login プロバイダ登録が必要）
- [ ] ポータル UI のタイトル・説明・ロゴ・OGP が正しく表示される
- [ ] ファビコン・OGP 画像のメタタグが正しく出る
- [ ] `enableFeatures` で許可した機能だけが表示される
- [ ] LINE 公式アカウントでリッチメニューが表示される
- [ ] sysAdmin から再ログインしても新コミュニティが一覧で見える

---

## トラブルシュート

### `Community not found` で 404 になる
- middleware の DB 検証で弾かれている。`/sysAdmin/create` で本当に作成されているか、`originalId` が想定どおりかを確認。

### LIFF ID 形式エラー
- フォーマットは `^\d+-[A-Za-z0-9]+$`。LINE Developers Console から正しい LIFF ID をコピーしているか確認。

### LIFF を開いてもユーザー向け画面 (`/users/me` 等) に遷移しない
- そのコミュニティの PortalConfig の `rootPath` がデフォルトの `"/"` のまま。`updatePortalConfig` で `rootPath: "/users/me"` 等を設定（ステップ4参照）。
- LIFF Endpoint URL（LINE Developers Console 側）が `https://civicship.app/community/{communityId}` の形式になっているかも確認。

### LINE ログインしてもユーザーが作られない / 認証エラー
- Firebase Identity Platform のテナント（`communityCreate` で自動作成された）に LINE Login プロバイダ（OIDC）が登録されているかを確認（ステップ2）。
- LINE Developers Console の LINE Login channel に Firebase からの Callback URL が登録されているかを確認。

### `display_name should start with a letter ...` で `communityCreate` が失敗する
- Firebase Identity Platform の tenant `displayName` 制約（`^[a-zA-Z][a-zA-Z0-9-]{3,19}$`、4〜20文字）に違反している。civicship-api 側で displayName に何を渡しているかを確認し、入力値（コミュニティ名 / Original ID）を制約に合わせる、または backend 側で sanitize する。

### ログインしたら別コミュニティに飛ばされる
- セッション Cookie（`__session_{communityId}`）が以前のコミュニティのまま残っている可能性。ブラウザの Cookie をクリアして再試行。

### LINE Channel Secret / Access Token を間違えて登録した
- バックエンドは検証していないため、`communityCreate` 時の入力ミスはエラーにならず保存されます。LINE 設定系（`channelId` / `channelSecret` / `accessToken` / `liffId` / `liffAppId` / `liffBaseUrl`）はいずれも `communityCreate` 時のみ登録可能で更新 mutation が存在しないため、修正には civicship-api 側に専用 mutation 追加が必要です。
