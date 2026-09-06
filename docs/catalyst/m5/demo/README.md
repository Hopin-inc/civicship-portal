<a id="en"></a>

# Demonstration Videos

*English below · [日本語は下段へ](#ja)*


Screen recordings of the civicship front end, one per use case.
Milestone 5, deliverable 3. Project Catalyst F12, Project ID 1200088.

Twenty-one recordings in two sets. [`milestone3-use-cases/`](./milestone3-use-cases/)
holds the eleven use cases Milestone 3 demonstrated, recorded again on the current
application — eight resident, three host. [`beyond-milestone3/`](./beyond-milestone3/)
holds ten further use cases — three resident, seven host. Each set is split into
`user/` and `admin/`, matching the two playlists used at Milestone 3.

## Where to try each recording

Every link below opens on the development deployment, which signs a visitor in
automatically: no LINE account, no personal information. The base is
**https://dev.civicship.app/community/neo88**.

### Resident

| | Use case | Recording | Where to try it |
| --- | --- | --- | --- |
| ① | A visitor accesses the app via the official LINE account | [`milestone3 · 01`](./milestone3-use-cases/user/01_access-via-line.mp4) | [Production](https://civicship.app/community/neo88) — the development deployment signs a visitor in without LINE |
| ② | Explores available activities | [`milestone3 · 02`](./milestone3-use-cases/user/02_explore-activities.mp4) | `/activities` |
| ③ | Looks for hosts on the map | [`milestone3 · 03`](./milestone3-use-cases/user/03_hosts-on-map.mp4) | `/places` |
| ④ | Views their initial My Page | [`milestone3 · 04`](./milestone3-use-cases/user/04_initial-mypage.mp4) | `/users/me` |
| ⑤ | Views their My Page with points and history | [`milestone3 · 05`](./milestone3-use-cases/user/05_mypage-with-history.mp4) | `/wallets/me` |
| ⑥ | Uses a ticket to reserve a connection | [`milestone3 · 06`](./milestone3-use-cases/user/06_ticket-reserve.mp4) | `/tickets` |
| ⑦ | Searches for quests | [`milestone3 · 07`](./milestone3-use-cases/user/07_search-quests.mp4) | `/quests`, or `/opportunities/search` |
| ⑧ | Verifies their connection (VC) | [`milestone3 · 08`](./milestone3-use-cases/user/08_verify-vc.mp4) | `/users/me/portfolios`, then open a completed record |
| ⑨ | Sends points to another member | [`beyond · 08`](./beyond-milestone3/user/08_send-points.mp4) | `/wallets/donate` |
| ⑩ | Checks a confirmed participation | [`beyond · 09`](./beyond-milestone3/user/09_confirm-participation.mp4) | `/users/me/portfolios`, then open a booked record |
| ⑪ | Looks at another resident's profile | [`beyond · 10`](./beyond-milestone3/user/10_other-resident.mp4) | Any experience under `/activities`, then the host's name |

### Host and administrator

The development deployment signs a visitor in with an **owner** membership, so
every screen below is reachable without being granted anything.

| | Use case | Recording | Where to try it |
| --- | --- | --- | --- |
| ① | Manages reservations | [`milestone3 · 01`](./milestone3-use-cases/admin/01_manage-reservations.mp4) | `/admin/reservations` |
| ② | Manages event dates | [`milestone3 · 02`](./milestone3-use-cases/admin/02_manage-event-dates.mp4) | `/admin/opportunities` |
| ③ | Issues tickets | [`milestone3 · 03`](./milestone3-use-cases/admin/03_issue-tickets.mp4) | `/admin/tickets` |
| ④ | Creates a new opportunity | [`beyond · 01`](./beyond-milestone3/admin/01_create-opportunity.mp4) | `/admin/opportunities/new` |
| ⑤ | Manages members and their roles | [`beyond · 02`](./beyond-milestone3/admin/02_manage-members.mp4) | `/admin/members` |
| ⑥ | Issues and grants community points | [`beyond · 03`](./beyond-milestone3/admin/03_issue-points.mp4) | `/admin/wallet/issue`, then `/admin/wallet/grant` |
| ⑦ | Registers a place | [`beyond · 04`](./beyond-milestone3/admin/04_register-place.mp4) | `/admin/places/new` |
| ⑧ | Issues a verifiable credential | [`beyond · 05`](./beyond-milestone3/admin/05_issue-credential.mp4) | `/admin/credentials/issue` |
| ⑨ | Manages resident-card NFTs | [`beyond · 06`](./beyond-milestone3/admin/06_resident-nfts.mp4) | `/admin/nfts` |
| ⑩ | Configures member bonuses | [`beyond · 07`](./beyond-milestone3/admin/07_configure-bonuses.mp4) | `/admin/bonuses` |

---
---

<a id="ja"></a>

# デモ動画

*[English is above](#en)*

civicship のフロントエンドの画面録画。ユースケース1件につき1本。
Milestone 5 成果物3。Project Catalyst F12、Project ID 1200088。

全21本を2セットに分けている。[`milestone3-use-cases/`](./milestone3-use-cases/) は
Milestone 3 でデモンストレーションした11件を現在のアプリケーションで撮り直したもの
（住民向け8件、ホスト向け3件）。[`beyond-milestone3/`](./beyond-milestone3/) は追加の
10件（住民向け3件、ホスト向け7件）。各セットは Milestone 3 の2つのプレイリストに合わせ、
`user/` と `admin/` に分けている。

## 各録画を試せる画面

以下のリンクはすべて開発環境の画面である。開発環境は訪問者を自動的にサインインさせる
ため、LINE アカウントも個人情報も要らない。ベースURLは
**https://dev.civicship.app/community/neo88**。

### 住民向け

| | ユースケース | 録画 | 試せる画面 |
| --- | --- | --- | --- |
| ① | 公式 LINE アカウント経由でアプリにアクセスする | [`milestone3 · 01`](./milestone3-use-cases/user/01_access-via-line.mp4) | [本番環境](https://civicship.app/community/neo88)。開発環境は LINE を経由せずサインインする |
| ② | 募集中の体験を探す | [`milestone3 · 02`](./milestone3-use-cases/user/02_explore-activities.mp4) | `/activities` |
| ③ | マップからホストを探す | [`milestone3 · 03`](./milestone3-use-cases/user/03_hosts-on-map.mp4) | `/places` |
| ④ | 初期状態のマイページを見る | [`milestone3 · 04`](./milestone3-use-cases/user/04_initial-mypage.mp4) | `/users/me` |
| ⑤ | ポイントと履歴のあるマイページを見る | [`milestone3 · 05`](./milestone3-use-cases/user/05_mypage-with-history.mp4) | `/wallets/me` |
| ⑥ | チケットを使って予約する | [`milestone3 · 06`](./milestone3-use-cases/user/06_ticket-reserve.mp4) | `/tickets` |
| ⑦ | クエストを探す | [`milestone3 · 07`](./milestone3-use-cases/user/07_search-quests.mp4) | `/quests` または `/opportunities/search` |
| ⑧ | 参加証明（VC）を確認する | [`milestone3 · 08`](./milestone3-use-cases/user/08_verify-vc.mp4) | `/users/me/portfolios` から完了済みの記録を開く |
| ⑨ | 住民同士でポイントを送る | [`beyond · 08`](./beyond-milestone3/user/08_send-points.mp4) | `/wallets/donate` |
| ⑩ | 確定した参加内容を確認する | [`beyond · 09`](./beyond-milestone3/user/09_confirm-participation.mp4) | `/users/me/portfolios` から予約済みの記録を開く |
| ⑪ | 他の住民のプロフィールを見る | [`beyond · 10`](./beyond-milestone3/user/10_other-resident.mp4) | `/activities` の体験を開き、案内人の名前から |

### ホスト・管理者向け

開発環境は訪問者に**オーナー権限**を付けてサインインさせるため、以下の画面はすべて
権限付与の手続きなしで到達できる。

| | ユースケース | 録画 | 試せる画面 |
| --- | --- | --- | --- |
| ① | 予約を管理する | [`milestone3 · 01`](./milestone3-use-cases/admin/01_manage-reservations.mp4) | `/admin/reservations` |
| ② | 開催日程を管理する | [`milestone3 · 02`](./milestone3-use-cases/admin/02_manage-event-dates.mp4) | `/admin/opportunities` |
| ③ | チケットを発行する | [`milestone3 · 03`](./milestone3-use-cases/admin/03_issue-tickets.mp4) | `/admin/tickets` |
| ④ | 募集を新しく作る | [`beyond · 01`](./beyond-milestone3/admin/01_create-opportunity.mp4) | `/admin/opportunities/new` |
| ⑤ | メンバーと権限を管理する | [`beyond · 02`](./beyond-milestone3/admin/02_manage-members.mp4) | `/admin/members` |
| ⑥ | ポイントを発行し、メンバーに付与する | [`beyond · 03`](./beyond-milestone3/admin/03_issue-points.mp4) | `/admin/wallet/issue` のあと `/admin/wallet/grant` |
| ⑦ | 拠点を登録する | [`beyond · 04`](./beyond-milestone3/admin/04_register-place.mp4) | `/admin/places/new` |
| ⑧ | 参加証明（VC）を発行する | [`beyond · 05`](./beyond-milestone3/admin/05_issue-credential.mp4) | `/admin/credentials/issue` |
| ⑨ | 住民証NFTを管理する | [`beyond · 06`](./beyond-milestone3/admin/06_resident-nfts.mp4) | `/admin/nfts` |
| ⑩ | 特典を設定する | [`beyond · 07`](./beyond-milestone3/admin/07_configure-bonuses.mp4) | `/admin/bonuses` |
