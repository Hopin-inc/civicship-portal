<a id="en"></a>

# Milestone 3 Use Cases, Re-Recorded

*English below · [日本語は下段へ](#ja)*


Milestone 3 demonstrated the application through two playlists — eight use cases
for a resident, three for a host. This directory is those same eleven use cases,
recorded again on the application as it stands today.

Milestone 5, deliverable 3. Project Catalyst F12, Project ID 1200088.

## Resident

| | Use case | Video |
| --- | --- | --- |
| ① | A visitor accesses the app via the official LINE account | [`U1_access-via-line.mp4`](./U1_access-via-line.mp4) |
| ② | The user explores available activities | [`U2_explore-activities.mp4`](./U2_explore-activities.mp4) |
| ③ | The user looks for hosts on the map | [`U3_hosts-on-map.mp4`](./U3_hosts-on-map.mp4) |
| ④ | The user views their initial My Page | [`U4_initial-mypage.mp4`](./U4_initial-mypage.mp4) |
| ⑤ | The user views their My Page with points and history | [`U5_mypage-with-history.mp4`](./U5_mypage-with-history.mp4) |
| ⑥ | The user uses a ticket to reserve a connection | [`U6_ticket-reserve.mp4`](./U6_ticket-reserve.mp4) |
| ⑦ | The user searches for quests | [`U7_search-quests.mp4`](./U7_search-quests.mp4) |
| ⑧ | The user verifies their connection (VC) | [`U8_verify-vc.mp4`](./U8_verify-vc.mp4) |

## Host

| | Use case | Video |
| --- | --- | --- |
| ① | The admin manages reservations | [`H1_manage-reservations.mp4`](./H1_manage-reservations.mp4) |
| ② | The admin manages event dates | [`H2_manage-event-dates.mp4`](./H2_manage-event-dates.mp4) |
| ③ | The admin issues tickets | [`H3_issue-tickets.mp4`](./H3_issue-tickets.mp4) |

## What to know when watching

**The application is real; the data is not.** These are recordings of this
repository's front end, built as a production build and unmodified. It runs
against a local server that answers GraphQL by executing queries against
`civicship-api`'s published schema. Places, opportunities, members and points
are demonstration content, not production records.

**Phone verification is simulated.** In use case ①, no SMS is sent and no
Firebase authentication takes place. Entering the app through the LINE official
account leads to phone verification, and the recording shows the screens the
application presents at that point; the verification itself is short-circuited so
the walkthrough can continue.

**Everything else is a real interaction.** Each navigation is a tap on the element
a person would tap. The pointer and the ripple are drawn into the page so the tap
is visible on camera. The maps are Google Maps, loading real tiles.

---
---

<a id="ja"></a>

# Milestone 3 のユースケース（再録画）

*[English is above](#en)*

Milestone 3 では、住民向け8件・ホスト向け3件の2つのプレイリストでアプリケーションを
デモンストレーションした。本ディレクトリは、その同じ11件のユースケースを、現在の
アプリケーションで撮り直したものである。

Milestone 5 成果物3。Project Catalyst F12、Project ID 1200088。

## 住民向け

| | ユースケース | 動画 |
| --- | --- | --- |
| ① | 公式LINEアカウントからアプリに入る | [`U1_access-via-line.mp4`](./U1_access-via-line.mp4) |
| ② | 募集中の体験を見てまわる | [`U2_explore-activities.mp4`](./U2_explore-activities.mp4) |
| ③ | 地図から拠点とホストを探す | [`U3_hosts-on-map.mp4`](./U3_hosts-on-map.mp4) |
| ④ | マイページを開く | [`U4_initial-mypage.mp4`](./U4_initial-mypage.mp4) |
| ⑤ | ポイントと履歴が溜まったマイページ | [`U5_mypage-with-history.mp4`](./U5_mypage-with-history.mp4) |
| ⑥ | チケットを使って予約する | [`U6_ticket-reserve.mp4`](./U6_ticket-reserve.mp4) |
| ⑦ | お手伝い（クエスト）を探す | [`U7_search-quests.mp4`](./U7_search-quests.mp4) |
| ⑧ | 参加証明（VC）を確認する | [`U8_verify-vc.mp4`](./U8_verify-vc.mp4) |

## ホスト向け

| | ユースケース | 動画 |
| --- | --- | --- |
| ① | 予約を管理する | [`H1_manage-reservations.mp4`](./H1_manage-reservations.mp4) |
| ② | 開催日程を管理する | [`H2_manage-event-dates.mp4`](./H2_manage-event-dates.mp4) |
| ③ | チケットを発行する | [`H3_issue-tickets.mp4`](./H3_issue-tickets.mp4) |

## 視聴にあたって

**アプリケーションは実物であり、データはそうではない。** 本リポジトリのフロントエンドを
本番ビルドしたものを、無改変で録画している。バックエンドは `civicship-api` の公開スキーマに
対してクエリを実行して応答するローカルサーバーである。拠点・募集・メンバー・ポイントは
デモ用の内容であり、本番の記録ではない。

**電話番号認証は模擬している。** ユースケース①では、SMS は送信されず、Firebase 認証も
発生しない。LINE 公式アカウントからアプリに入ると電話番号認証に到達するため、その時点で
アプリケーションが提示する画面を録画している。認証処理自体は短絡させ、操作を先に
進められるようにしている。

**それ以外はすべて実際の操作である。** 各遷移は、人が押すのと同じ要素へのタップである。
タップ位置が分かるよう、ポインタとリップルをページ内に描画している。地図は Google Maps
であり、実際のタイルを読み込んでいる。
