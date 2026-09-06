<a id="en"></a>

# Milestone 5 — Front-End Development and Prepare for the Shikoku 88 Event

*English below · [日本語は下段へ](#ja)*


Project Catalyst F12, Project ID 1200088. Code as of `517e9a4` (2026-09-04).

## Deliverable 1 — Front-end development

### The front-end source code is published on GitHub

**Met.** https://github.com/Hopin-inc/civicship-portal, under GPL-3.0. The GraphQL
API it runs against is at
[`civicship-api`](https://github.com/Hopin-inc/civicship-api).

### Detailed documentation, including UI/UX design principles, integration processes, and user instructions

**Met.** Those three are the three sections of the
[front-end documentation](./frontend-documentation.md): the design principles
produced and approved at Milestone 3, how the front end integrates with the
GraphQL API and with LINE, and the operator's manual.

### A link is provided to try out the completed mutual app

**Met.** https://civicship.app/community/neo88 is the application. A reviewer
without a LINE account can use https://dev.civicship.app/community/neo88 instead,
which signs a visitor in automatically. [Trying the
application](#trying-the-application) explains what each one gives you.

### Fully functional and responsive across different devices

**Met.** Either link, opened on a phone, a tablet or a desktop browser. Every
screen and every function behaves identically on all three; [Trying the
application](#trying-the-application) says why the layout targets phone widths.

## Deliverable 3 — Sharing of a demo video

### The demo video is published on YouTube and is freely accessible to the community

**Recorded; YouTube publication pending.** Twenty-one use-case recordings are in
[`demo/`](./demo/) — the eleven demonstrated at Milestone 3, recorded again on
the current application, and ten further use cases. Each one is listed against
the screen it was recorded on in [where to try each
recording](./demo/README.md#where-to-try-each-recording).

### The video includes an access link to the application for usability testing

**Pending.** https://dev.civicship.app/community/neo88 is the link, to be carried
in each video's description on publication.

---

## Trying the application

**https://civicship.app/community/neo88** is the application as residents use it.
Sign-in is by LINE account.

**https://dev.civicship.app/community/neo88** is the same build on a development
deployment, which signs a visitor in automatically. A reviewer can evaluate the
application there — participant screens and administrative screens alike —
without a LINE account and without giving up any personal information.

Every screen and every function works identically on a phone, a tablet and a
desktop browser. The layout targets phone widths because the application is a LINE
mini app (LIFF), opened from inside LINE's in-app browser; on wider screens the
same interface is centred in the viewport.

---
---

<a id="ja"></a>

# Milestone 5 — フロントエンド開発と四国88イベントの準備

*[English is above](#en)*

Project Catalyst F12、Project ID 1200088。`517e9a4`（2026-09-04）時点のコード。

## 成果物1 — フロントエンド開発

### フロントエンドのソースコードが GitHub で公開されていること

**充足。** https://github.com/Hopin-inc/civicship-portal（GPL-3.0）。接続先の
GraphQL API は [`civicship-api`](https://github.com/Hopin-inc/civicship-api)。

### UI/UX 設計原則・連携方式・利用者向け手順書を含む詳細なドキュメント

**充足。** [フロントエンド ドキュメント](./frontend-documentation.md)の3つの節が
そのまま該当する。Milestone 3 で作成・承認された設計原則、GraphQL API および LINE
との連携方式、事業者向けの操作マニュアルである。

### 完成したアプリを試せるリンクが提供されていること

**充足。** アプリケーション本体は https://civicship.app/community/neo88 。LINE
アカウントを持たないレビュアーは、訪問者を自動的にサインインさせる
https://dev.civicship.app/community/neo88 を使える。それぞれで何ができるかは
[アプリを試す](#アプリを試す)に記載。

### 各種デバイスで完全に動作し、レスポンシブであること

**充足。** いずれかのリンクを、スマートフォン・タブレット・デスクトップブラウザで
開く。3種類のいずれでも画面構成と機能は同一に動作する。スマートフォンの幅に合わせて
いる理由は[アプリを試す](#アプリを試す)に記載。

## 成果物3 — デモ動画の共有

### デモ動画が YouTube で公開され、コミュニティが自由にアクセスできること

**収録済み。YouTube 公開は未了。** ユースケース別21本を [`demo/`](./demo/) に収録して
いる。Milestone 3 でデモンストレーションした11本を現在のアプリケーションで撮り直した
ものと、追加の10本である。各動画がアプリのどの画面に対応するかは
[各録画を試せる画面](./demo/README.md#各録画を試せる画面)に一覧している。

### 動画に、使用性テスト用のアプリへのアクセスリンクが含まれること

**未了。** リンクは https://dev.civicship.app/community/neo88 。公開時に各動画の
概要欄に記載する。

---

## アプリを試す

**https://civicship.app/community/neo88** — 住民が実際に使っているアプリケーション。
サインインは LINE アカウント。

**https://dev.civicship.app/community/neo88** — 同じビルドの開発環境で、訪問者を
自動的にサインインさせる。レビュアーは LINE アカウントも個人情報も渡すことなく、
参加者向け画面と管理画面の両方を評価できる。

画面構成と機能は、スマートフォン・タブレット・デスクトップブラウザのいずれでも同一に
動作する。レイアウトをスマートフォンの幅に合わせているのは、本アプリケーションが LINE
ミニアプリ（LIFF）であり、LINE のアプリ内ブラウザから起動されるためである。より広い画面
では、同じ画面が中央に配置される。
