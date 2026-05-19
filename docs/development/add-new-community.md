# 新しいコミュニティの追加方法

新しいコミュニティを civicship-portal に追加する際の手順をまとめます。

## 全体像

コミュニティの作成・設定は次の3つのレイヤに分かれています。

| レイヤ | 内容 | 設定方法 |
|---|---|---|
| 1. コミュニティ本体 | コミュニティID、名前、LINE連携 | `/sysAdmin/create` のフォーム |
| 2. ポータル設定（UI可能分） | タイトル、説明文、ロゴ、OGP画像 | `/community/{id}/admin/setting` |
| 3. ポータル設定（UI不可分） | ドメイン、Firebaseテナント、有効機能フラグ、ルートパス等 | バックエンド (civicship-api) で対応 |

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
| LIFF | LIFF App ID / LIFF Base URL | 同上 |
| Rich Menu | Rich Menu ID（複数種別あり） | LINE Messaging API で別途作成 |

### Firebase (Identity Platform)

LINEログインで使う Firebase テナントを作成します。

- Firebase Console → Authentication → Identity Platform → 「テナントを追加」
- テナント ID を控える（例: `newcommunity-xxxxx`）
- LINE プロバイダ（OIDC）をテナントに登録

### DNS / ドメイン

ホワイトラベルドメインで運用する場合は DNS を設定します。

- 例: `newcommunity.civicship.app` を Cloud Run 等の本番URLへ向ける
- パスベース運用（`{base-domain}/community/{id}`）のみであれば不要

### アセット準備

デザイン側で以下の画像を用意します。アップロード先は `/community/{id}/admin/setting` のフォームから（バックエンドが GCS に格納）。

- ロゴ（横長）
- スクエアロゴ
- OGP 画像
- ファビコン

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
| LINE LIFF ID | ✅ | LIFF ID（形式バリデーション有） |

作成成功後、`/community/{communityId}/users/me` へリダイレクトされます。

> **注意**: 入力した LINE 認証情報はバックエンドで `https://api.line.me/v2/bot/info` を呼び出して検証されます。

---

## 手順2: ポータルプロフィールの設定（UI）

`/community/{communityId}/admin/setting` から以下を設定できます。

- タイトル
- 説明文（長）
- 説明文（短）
- ロゴ画像
- スクエアロゴ画像
- OGP 画像

---

## 手順3: ポータル詳細設定（UI不可、バックエンド対応）

以下の項目は現状ポータル側に編集 UI がなく、**バックエンド（civicship-api）側で設定する必要があります**。

| 項目 | 用途 |
|---|---|
| `domain` | ホワイトラベルドメイン |
| `firebaseTenantId` | Firebase Identity Platform のテナント ID |
| `liffAppId` / `liffBaseUrl` | LIFF アプリの追加情報 |
| `enableFeatures` | 有効化する機能フラグ（`points`, `opportunities`, `quests`, `languageSwitcher` 等） |
| `rootPath` / `adminRootPath` | ユーザー向け/管理者向けのルートパス |
| `documents` / `commonDocumentOverrides` | 利用規約・プライバシーポリシー等のドキュメント |
| `regionKey` / `regionName` | 地域設定 |
| `favicon` | ファビコン |
| `tokenName` | ポイントトークン名 |
| `richMenus` | LINE リッチメニュー設定 |

`UpdatePortalConfig` mutation 自体はこれらを受け付けるため、暫定的に Apollo Sandbox や GraphQL クライアントから直接 mutation を実行する運用も可能です（要 SYS_ADMIN 認証）。

---

## 動作確認チェックリスト

- [ ] パスベース `/community/{id}` でアクセスでき、404 にならない
- [ ] サブドメインを設定している場合、`{id}.civicship.app` 等でアクセスできる
- [ ] LINE ログイン（LIFF）が成功する
- [ ] ポータル UI のタイトル・説明・ロゴ・OGP が正しく表示される
- [ ] ファビコン・OGP 画像のメタタグが正しく出る
- [ ] `enableFeatures` で許可した機能だけが表示される
- [ ] sysAdmin から再ログインしても新コミュニティが一覧で見える

---

## トラブルシュート

### `Community not found` で 404 になる
- middleware の DB 検証で弾かれている。`/sysAdmin/create` で本当に作成されているか、`originalId` が想定どおりかを確認。

### LIFF ID 形式エラー
- フォーマットは `^\d+-[A-Za-z0-9]+$`。LINE Developers Console から正しい LIFF ID をコピーしているか確認。

### ログインしたら別コミュニティに飛ばされる
- セッション Cookie（`__session_{communityId}`）が以前のコミュニティのまま残っている可能性。ブラウザの Cookie をクリアして再試行。

### サブドメインでアクセスすると 404
- ホスト名から抽出した ID が DB に存在しないと middleware が 404 を返す。DNS が正しく向いているか、抽出ロジック（`src/middleware.ts` の `getCommunityIdFromHost`）が想定通りに ID を取り出せているかを確認。
