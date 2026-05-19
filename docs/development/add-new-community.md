# 新しいコミュニティの追加方法

新しいコミュニティを civicship-portal に追加する際の手順をまとめます。

## 全体像

コミュニティの作成・設定は次の4つのレイヤに分かれています。

| レイヤ | 内容 | 設定方法 |
|---|---|---|
| 1. コミュニティ本体 | コミュニティID、名前、LINE連携、Firebaseテナント（自動作成） | `/sysAdmin/create` のフォーム |
| 2. ポータルプロフィール（UI可能分） | タイトル、説明文、ロゴ、OGP画像 | `/community/{id}/admin/setting` |
| 3. ポータル詳細設定（GraphQL直叩き） | ドメイン、有効機能フラグ、ルートパス、ドキュメント等 | `updatePortalConfig` mutation |
| 4. リッチメニュー | LINE リッチメニュー画像と設定 | civicship-api 側の CLI (`pnpm richmenu:deploy`) |

ポータルでのコミュニティID検証は DB を参照するため、`/sysAdmin/create` で作成されれば、フロント側コード（`ACTIVE_COMMUNITY_IDS` 等）を編集する必要はありません。

---

## 事前準備（外部サービス側）

### LINE Developers Console

LINE Official Account とそれに紐づく Messaging API チャネル、LIFF アプリを作成します。

| 用途 | 取得値 | 取得場所 |
|---|---|---|
| Messaging API | Channel ID | LINE Developers Console → 対象チャネル → Basic settings |
| Messaging API | Channel Secret | 同上 → Basic settings |
| Messaging API | Channel Access Token (long-lived) | 同上 → Messaging API |
| LIFF | LIFF ID（形式: `数字-英数字` 例: `2009756673-s2ldhFgl`） | LINE Developers Console → LIFF タブ |
| LIFF | LIFF Base URL | 同上（`https://liff.line.me/{liffId}` 形式で自動生成される） |
| Rich Menu | Rich Menu 画像（種別ごと） | デザイン側で用意。設定は civicship-api 側の CLI で行う（後述） |

### Firebase (Identity Platform)

**Firebase テナントは `communityCreate` mutation が自動作成します**（civicship-api の `usecase.ts` 内で `auth.tenantManager().createTenant()` が呼ばれる）。Firebase Console での事前テナント作成は不要です。

ただし作成後、**自動作成されたテナントに LINE OIDC プロバイダの登録**が必要です。

作成された Firebase テナント ID は `communityPortalConfig` query で取得できます。

```graphql
query GetFirebaseTenantId {
  communityPortalConfig(communityId: "<communityId>") {
    firebaseTenantId
  }
}
```

- Firebase Console → Authentication → Identity Platform → 取得したテナント
- LINE プロバイダ（OIDC）の Client ID / Client Secret を登録

### DNS / ドメイン

ホワイトラベルドメインで運用する場合は DNS を設定します。

- 例: `newcommunity.civicship.app` を Cloud Run 等の本番URLへ向ける
- パスベース運用（`{base-domain}/community/{id}`）のみであれば不要

### アセット準備

デザイン側で以下の画像を用意します。アップロード方法は手順ごとに異なります。

| 画像種別 | 用途 | アップロード方法 |
|---|---|---|
| ロゴ（横長） | ポータル上部等 | `/community/{id}/admin/setting` フォーム |
| スクエアロゴ | アバター等 | 同上 |
| OGP 画像 | OGメタタグ | 同上 |
| ファビコン | favicon.ico | `updatePortalConfig` mutation の `favicon: ImageInput` |
| リッチメニュー画像 | LINE リッチメニュー | civicship-api の CLI で配置・デプロイ |

---

## 手順1: コミュニティ本体の作成

1. **SYS_ADMIN 権限**を持つアカウントで既存のいずれかのコミュニティにログイン
2. `/sysAdmin/create` にアクセス
3. 以下を入力して「作成」

| フィールド | 必須 | 内容 |
|---|---|---|
| Community Name | ✅ | コミュニティ名 |
| Original ID | 任意 | コミュニティID（未指定なら自動採番） |
| LINE Channel ID | ✅ | Messaging API の Channel ID |
| LINE Channel Secret | ✅ | Messaging API の Channel Secret |
| LINE Access Token | ✅ | Messaging API の Access Token |
| LINE LIFF ID | ✅ | LIFF ID（フロント側で形式バリデーション） |

> **フォーム入力時のメモ**:
> - LINE 認証情報（Channel Secret / Access Token）はバックエンドでは検証されません。入力ミスがあってもエラーにならず保存されるので、貼り付けた値を必ず確認してください。
> - 入力した `LINE LIFF ID` から、フロントの server action (`src/app/sysAdmin/create/features/editor/actions/communityCreate.ts`) が自動で `liffId`（数字部分）と `liffBaseUrl`（`https://liff.line.me/{liffId}`）を派生させて mutation に渡します。UI から作成する分には追加入力不要です。

作成成功後、`/community/{communityId}/users/me` へリダイレクトされます。

### 内部処理（参考）

`communityCreate` mutation 1 回で以下が実行されます（civicship-api `usecase.ts:57-88`）。

1. Firebase テナントの自動作成
2. Community レコード作成（テナントID紐付け）
3. Membership(OWNER) 作成
4. Wallet 作成
5. 失敗時は Firebase テナントを cleanup

なお `CommunityLineConfigInput` 自体は `liffId` と `liffBaseUrl` を独立した必須フィールドとして受け取るため、`/sysAdmin/create` 以外の経路から mutation を直接叩く場合は両方を明示指定する必要があります。シークレット系（`accessToken`, `channelSecret`）は SYS_ADMIN 以外のユーザーには resolver で null マスクされます。

---

## 手順2: ポータルプロフィールの設定（UI）

`/community/{communityId}/admin/setting` から以下を設定できます。

- タイトル
- 説明文（長）
- 説明文（短）
- ロゴ画像
- スクエアロゴ画像
- OGP 画像

権限: `IsCommunityManager`（OWNER または MANAGER）

---

## 手順3: ポータル詳細設定（GraphQL `updatePortalConfig`）

UI では編集できない以下の項目は、`updatePortalConfig` mutation を Apollo Sandbox 等の GraphQL クライアントから直接実行して設定します。

### 必須ヘッダ

- `x-community-id: {対象コミュニティID}` — 対象コミュニティの指定にこのヘッダが**必須**
- 認証: `IsCommunityManager` 権限が必要

### 設定可能フィールド

| フィールド | 型 | 内容 |
|---|---|---|
| `domain` | String | ホワイトラベルドメイン |
| `title` / `description` / `shortDescription` | String | プロフィール文（UIでも設定可） |
| `tokenName` | String | ポイントトークン名 |
| `enableFeatures` | [String!] | 有効機能フラグ（`points`, `opportunities`, `quests`, `languageSwitcher` 等）。デフォルト `["points", "justDaoIt", "languageSwitcher"]` |
| `rootPath` / `adminRootPath` | String | ユーザー/管理者のルートパス。デフォルト `"/"` / `"/admin"` |
| `regionKey` / `regionName` | String | 地域設定 |
| `documents` | [CommunityDocumentInput!] | 利用規約・プライバシーポリシー等。`null` でクリア |
| `commonDocumentOverrides` | CommonDocumentOverridesInput | 共通ドキュメントの上書き。`null` でクリア |
| `favicon` | ImageInput | ファビコン画像 |
| `logo` / `squareLogo` / `ogImage` | ImageInput | 各種画像（UI からも設定可） |

> **画像フィールドの注意**: `logoPath` / `squareLogoPath` / `ogImagePath` / `faviconPrefix` は `@deprecated`。新規実装では `logo` / `squareLogo` / `ogImage` / `favicon`（`ImageInput`）を使用してください。GCS への並列アップロードを backend が代行します。

### mutation 例

```graphql
mutation UpdatePortalConfig($input: CommunityPortalConfigInput!) {
  updatePortalConfig(input: $input) {
    communityId
    domain
    enableFeatures
    rootPath
  }
}
```

variables:
```json
{
  "input": {
    "domain": "https://newcommunity.civicship.app",
    "enableFeatures": ["points", "opportunities", "quests"],
    "rootPath": "/users/me",
    "adminRootPath": "/admin/wallet"
  }
}
```

> **`domain` のフォーマット**: 既存コミュニティのレコードに合わせるのが安全。本リポジトリのローカル設定例（`src/lib/communities/constants.ts`）では `https://himeji-ymca.civicship.jp` のようにスキーム付きで格納されています。新規追加時も既存レコードの形式を確認して揃えてください。

### バックエンド対応が必要な項目（mutation 未提供）

以下は現状 `updatePortalConfig` でも更新できません。変更したい場合は civicship-api 側に専用 mutation 追加が必要です。

| 項目 | 設定タイミング | 備考 |
|---|---|---|
| `firebaseTenantId` | `communityCreate` 時のみ自動 | 後から変更する mutation 無し |
| LINE 設定系全般（`channelId` / `channelSecret` / `accessToken` / `liffId` / `liffAppId` / `liffBaseUrl`） | `communityCreate` 時のみ | `CommunityLineConfig` のフィールド。いずれも更新 mutation 未提供のため、間違って登録した場合は backend 側の対応が必要 |

---

## 手順4: LINE リッチメニューのデプロイ

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

- [ ] パスベース `/community/{id}` でアクセスでき、404 にならない
- [ ] サブドメインを設定している場合、`{id}.civicship.app` 等でアクセスできる
- [ ] LINE ログイン（LIFF）が成功する（Firebase テナントへの LINE プロバイダ登録が必要）
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

### LINE ログインしてもユーザーが作られない / 認証エラー
- Firebase Identity Platform のテナント（`communityCreate` で自動作成された）に LINE プロバイダ（OIDC）が登録されているかを確認。

### ログインしたら別コミュニティに飛ばされる
- セッション Cookie（`__session_{communityId}`）が以前のコミュニティのまま残っている可能性。ブラウザの Cookie をクリアして再試行。

### サブドメインでアクセスすると 404
- ホスト名から抽出した ID が DB に存在しないと middleware が 404 を返す。DNS が正しく向いているか、抽出ロジック（`src/middleware.ts` の `getCommunityIdFromHost`）が想定通りに ID を取り出せているかを確認。

### LINE Channel Secret / Access Token を間違えて登録した
- バックエンドは検証していないため、`communityCreate` 時の入力ミスはエラーにならず保存されます。LINE 設定系（`channelId` / `channelSecret` / `accessToken` / `liffId` / `liffAppId` / `liffBaseUrl`）はいずれも `communityCreate` 時のみ登録可能で更新 mutation が存在しないため、修正には civicship-api 側に専用 mutation 追加が必要です。
