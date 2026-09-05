<a id="en"></a>

# Front-End Documentation

*English below · [日本語は下段へ](#ja)*


Milestone 5 deliverable 1. Describes the code at `517e9a4` (2026-09-04).

The acceptance criterion asks for documentation covering UI/UX design principles,
integration processes, and user instructions. This page is the index: the
architecture and integration are described here, and the design material and user
manual are linked where they live.

---

## What the application is

A mutual-assistance application for residents, delivered as a **LINE mini app
(LIFF)**. The UX assumes a mobile browser inside LINE: the residents it serves
already use LINE daily, and reaching the application requires no app installation
and no Web3 wallet.

| | |
| --- | --- |
| Framework | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS |
| Data layer | Apollo Client against a GraphQL API |
| Runtime | Cloud Run, with an Edge middleware in front |
| Licence | GPL-3.0 |

## Multi-community architecture

One codebase serves seven communities. Each is a separate tenant with its own
domain, branding, Firebase tenant, and LINE channel.

Which features a community sees is driven by `enableFeatures` on its portal
configuration — points, opportunities, quests, tickets, places, credentials. A
community configured for credentials only never renders the economic features at
all. This is what lets a single implementation serve communities as different as
Kibotcha (daily point circulation) and DAIS (credential issuance with no economic
activity).

Relevant source: `src/lib/communities/`, `src/contexts/CommunityConfigContext.tsx`.

## Authentication and identity

The chain, in order:

1. **LINE login** through LIFF produces an access token.
2. The API exchanges it for a **Firebase custom token** against the community's own
   Firebase tenant.
3. The portal exchanges that for an ID token and asks the API for a **session
   cookie scoped to the community** (`__session_{communityId}`).
4. **Phone-number verification** runs separately and acts as the common identity
   across communities — the same person joining two communities is recognised as
   one person.
5. A **DID** is issued against the verified phone number.

Relevant source: `src/lib/auth/`, `src/middleware.ts`.

There is also a development-only path that bypasses LINE and Firebase entirely so
testers can exercise non-production deployments without a LINE account. It is
gated on the deployment's `ENV` and cannot fire in production, which sets no
`ENV` at all. See [`docs/development/dev-login.md`](../development/dev-login.md).

## Integration with the backend

The front end holds no business logic and no database access. Everything goes
through the GraphQL API in
[`civicship-api`](https://github.com/Hopin-inc/civicship-api).

- **Transport:** Apollo Client. Server components and the Edge middleware call the
  same API over HTTP with the community's session cookie; the browser sends the
  session cookie plus an `X-Community-Id` header identifying the tenant.
- **Types:** the GraphQL schema is code-generated into TypeScript
  (`pnpm gql:generate` → `src/types/graphql.tsx`), so a schema change that breaks
  the front end fails at compile time rather than at runtime.
- **Tenancy:** every request carries the community id. The API resolves the tenant
  and the caller's identity from it, and applies row-level security accordingly.
- **Authorisation in the UI:** `src/lib/auth/core/access-policy.ts` decides which
  paths a role may reach. The API enforces the same rules independently — the
  front end's checks are for navigation, not for security.

The backend's own technical documentation was submitted as Milestone 4
(27 November 2025).

## Main screens

| Area | Screens |
| --- | --- |
| Participation | Opportunities (activities and their detail), reservations, quests |
| Economy | Transactions and history, wallets, point transfer, tickets |
| Place | Places (map and detail) |
| Identity | User profile, DID / VC credentials |
| Operations | Admin area — reservations, members, wallet, opportunities, tickets |

## Internationalisation

Japanese and English, with message catalogues under `src/messages/` and
generated key types (`src/types/i18n.ts`) so a missing translation is a type error.

## Component documentation

206 Storybook stories, published on every pull request through Chromatic. Running
`pnpm storybook` locally gives the same catalogue.

---

## UI/UX design material

Produced and submitted during Milestone 3, and approved there. Linked rather than
duplicated so there is one source of truth.

| | |
| --- | --- |
| Design principles, redesign requirements and action plan | https://hopin-inc.notion.site/What-s-Co-Creation-DAO-App-1c030b95d2b68016be45e448154a50ab |
| How interviewees were selected, the interview format, and how feedback was recorded and analysed | https://hopin-inc.notion.site/Additional-Document-M3-21130b95d2b68092aae4de53b3e5147d |
| UI design (Figma) | https://www.figma.com/design/TkZ3wAG6zj114b4N6ogJyf/Co-Creation-DAO-App-UI--Catalyst-M3- |
| Design walkthrough — participant side | https://youtube.com/playlist?list=PL0Jg6Cs8E9r3ynDqeweM-kWII2znYjr2v |
| Design walkthrough — host / admin side | https://youtube.com/playlist?list=PL0Jg6Cs8E9r1tfJ25FdtOguzyt6KWkiCV |

## User instructions

**NEO88 App Manual** — for experience providers:
https://docs.google.com/presentation/d/1WypOpniKO8l7OXk1VBbkYNf7O_vYgkwDg8it4eJccxk/edit

Covers account registration, linking the LINE account, approving and declining
reservations, cancelling a session, checking applications, and attendance
management.

## Developer documentation

| | |
| --- | --- |
| Adding a new community | [`docs/development/add-new-community.md`](../development/add-new-community.md) |
| Development login (LINE / Firebase bypass) | [`docs/development/dev-login.md`](../development/dev-login.md) |
| Logging standards | [`docs/development/logging-standards.md`](../development/logging-standards.md) |
| i18n style guide | [`docs/i18n-style-guide.md`](../i18n-style-guide.md) |

---
---

<a id="ja"></a>

# フロントエンド ドキュメント

*[English is above](#en)*

Milestone 5 成果物1。`517e9a4`（2026-09-04）時点のコードについて記述している。

受入条件は、UI/UX 設計原則・バックエンド連携・利用者向け手順書を含むドキュメントを
求めている。本ページはその索引である — アーキテクチャと連携方式はここに記述し、
設計資料と利用者マニュアルはそれぞれの所在にリンクする。

---

## このアプリケーションは何か

住民同士の助け合いのためのアプリケーションで、**LINE ミニアプリ（LIFF）** として提供する。
UX は LINE 内のモバイルブラウザを前提としている。対象となる住民は既に LINE を日常的に
使っており、利用にあたってアプリのインストールも Web3 ウォレットの管理も必要としない。

| | |
| --- | --- |
| フレームワーク | Next.js 15（App Router）、TypeScript |
| スタイリング | Tailwind CSS |
| データ層 | GraphQL API に対する Apollo Client |
| 実行環境 | Cloud Run、前段に Edge middleware |
| ライセンス | GPL-3.0 |

## マルチコミュニティ構成

単一のコードベースが7つのコミュニティに提供されている。各コミュニティは独立したテナント
であり、独自のドメイン、ブランディング、Firebase テナント、LINE チャネルを持つ。

どの機能が表示されるかは、そのコミュニティのポータル設定にある `enableFeatures` が
決定する — ポイント、募集、クエスト、チケット、拠点、クレデンシャル。クレデンシャル
専用に設定されたコミュニティでは、経済系の機能は一切描画されない。これにより、
キボッチャ（日常的なポイント循環）と DAIS（経済活動を伴わないクレデンシャル発行）
のように性格の異なるコミュニティを、単一の実装で提供できている。

関連するソース：`src/lib/communities/`、`src/contexts/CommunityConfigContext.tsx`

## 認証とアイデンティティ

順序は以下のとおり。

1. LIFF 経由の **LINE ログイン**でアクセストークンを取得する。
2. API がそれを、当該コミュニティ専用の Firebase テナントに対する
   **Firebase カスタムトークン**と交換する。
3. ポータルがそれを ID トークンと交換し、API に**コミュニティスコープのセッション
   cookie**（`__session_{communityId}`）を要求する。
4. **電話番号認証**を別途実施し、これがコミュニティ横断の共通 ID として機能する —
   同一人物が2つのコミュニティに参加した場合も1人として認識される。
5. 検証済みの電話番号に対して **DID** を発行する。

関連するソース：`src/lib/auth/`、`src/middleware.ts`

なお、テスターが LINE アカウント無しに非本番環境を検証できるよう、LINE と Firebase を
完全にバイパスする開発専用の経路も存在する。デプロイの `ENV` でゲートされており、
`ENV` を一切設定しない本番環境では発火しない。
[`docs/development/dev-login.md`](../development/dev-login.md) を参照。

## バックエンドとの連携

フロントエンドは業務ロジックもデータベースアクセスも持たない。すべては
[`civicship-api`](https://github.com/Hopin-inc/civicship-api) の GraphQL API を経由する。

- **通信：** Apollo Client。サーバーコンポーネントと Edge middleware は同じ API を
  コミュニティのセッション cookie 付きで HTTP 呼び出しし、ブラウザはセッション cookie に
  加えてテナントを示す `X-Community-Id` ヘッダを送信する。
- **型：** GraphQL スキーマから TypeScript を自動生成しており
  （`pnpm gql:generate` → `src/types/graphql.tsx`）、フロントエンドを壊すスキーマ変更は
  実行時ではなくコンパイル時に失敗する。
- **テナンシー：** すべてのリクエストがコミュニティ ID を持つ。API はそこからテナントと
  呼び出し元のアイデンティティを解決し、行レベルセキュリティを適用する。
- **UI 側の認可：** `src/lib/auth/core/access-policy.ts` がどのロールでどのパスに到達
  できるかを決める。API は同じルールを独立して強制しており、**フロントエンド側の
  チェックはナビゲーションのためのものであってセキュリティのためではない。**

バックエンド自体の技術ドキュメントは Milestone 4（2025年11月27日）として提出済み。

## 主な画面

| 領域 | 画面 |
| --- | --- |
| 参加 | 募集（活動とその詳細）、予約、クエスト |
| 経済 | 取引と履歴、ウォレット、ポイント送付、チケット |
| 拠点 | 拠点（マップと詳細） |
| アイデンティティ | ユーザープロフィール、DID / VC クレデンシャル |
| 運用 | 管理エリア — 予約、メンバー、ウォレット、募集、チケット |

## 多言語対応

日本語と英語。メッセージカタログは `src/messages/` 配下にあり、キーの型を生成している
（`src/types/i18n.ts`）ため、翻訳の欠落は型エラーになる。

## コンポーネントドキュメント

206個の Storybook ストーリーがあり、プルリクエストごとに Chromatic 経由で公開される。
ローカルでは `pnpm storybook` で同じカタログを参照できる。

---

## UI/UX 設計資料

Milestone 3 の期間中に作成・提出し、承認されたもの。単一の正典を保つため、複製せず
リンクする。

| | |
| --- | --- |
| 設計原則、再設計要件、アクションプラン | https://hopin-inc.notion.site/What-s-Co-Creation-DAO-App-1c030b95d2b68016be45e448154a50ab |
| インタビュー対象者の選定方法、インタビュー形式、フィードバックの記録・分析方法 | https://hopin-inc.notion.site/Additional-Document-M3-21130b95d2b68092aae4de53b3e5147d |
| UI デザイン（Figma） | https://www.figma.com/design/TkZ3wAG6zj114b4N6ogJyf/Co-Creation-DAO-App-UI--Catalyst-M3- |
| デザイン ウォークスルー — 参加者側 | https://youtube.com/playlist?list=PL0Jg6Cs8E9r3ynDqeweM-kWII2znYjr2v |
| デザイン ウォークスルー — ホスト / 管理者側 | https://youtube.com/playlist?list=PL0Jg6Cs8E9r1tfJ25FdtOguzyt6KWkiCV |

## 利用者向け手順書

**NEO88 アプリマニュアル** — 体験提供事業者向け：
https://docs.google.com/presentation/d/1WypOpniKO8l7OXk1VBbkYNf7O_vYgkwDg8it4eJccxk/edit

アカウント登録、LINE アカウントの連携、予約の承認と辞退、開催の中止、申込情報の確認、
出欠管理を扱う。

## 開発者向けドキュメント

| | |
| --- | --- |
| 新しいコミュニティの追加方法 | [`docs/development/add-new-community.md`](../development/add-new-community.md) |
| 開発用ログイン（LINE / Firebase バイパス） | [`docs/development/dev-login.md`](../development/dev-login.md) |
| ログ出力の規約 | [`docs/development/logging-standards.md`](../development/logging-standards.md) |
| i18n スタイルガイド | [`docs/i18n-style-guide.md`](../i18n-style-guide.md) |
