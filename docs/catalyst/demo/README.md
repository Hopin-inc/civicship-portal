<a id="en"></a>

# Demonstration Videos

*English below · [日本語は下段へ](#ja)*


Screen recordings of the civicship front end, one per use case, recorded at a
390×844 mobile viewport. Milestone 5, deliverable 3. Project Catalyst F12,
Project ID 1200088.

## Resident use cases

| | Use case | Video |
| --- | --- | --- |
| U1 | Finding an experience | [`U1_find-experience.mp4`](./U1_find-experience.mp4) |
| U2 | Booking an experience | [`U2_reserve.mp4`](./U2_reserve.mp4) |
| U3 | Viewing a place | [`U3_places.mp4`](./U3_places.mp4) |
| U4 | Points and transaction history | [`U4_points.mp4`](./U4_points.mp4) |
| U5 | Tickets | [`U5_tickets.mp4`](./U5_tickets.mp4) |
| U6 | My page and profile | [`U6_mypage.mp4`](./U6_mypage.mp4) |

## Community administrator use cases

| | Use case | Video |
| --- | --- | --- |
| A1 | Creating an opportunity | [`A1_admin-opportunity.mp4`](./A1_admin-opportunity.mp4) |
| A2 | Approving a reservation | [`A2_admin-reservations.mp4`](./A2_admin-reservations.mp4) |
| A3 | Managing members | [`A3_admin-members.mp4`](./A3_admin-members.mp4) |
| A4 | Issuing and granting points | [`A4_admin-points.mp4`](./A4_admin-points.mp4) |
| A5 | Registering a place | [`A5_admin-places.mp4`](./A5_admin-places.mp4) |
| A6 | Issuing tickets | [`A6_admin-tickets.mp4`](./A6_admin-tickets.mp4) |
| A7 | Issuing a verifiable credential | [`A7_admin-credentials.mp4`](./A7_admin-credentials.mp4) |
| A8 | Managing NFTs | [`A8_admin-nfts.mp4`](./A8_admin-nfts.mp4) |
| A9 | Configuring bonuses | [`A9_admin-bonuses.mp4`](./A9_admin-bonuses.mp4) |

## Full walkthrough

All fifteen recordings joined into one file, 4 min 26 s:
[`ALL_walkthrough.mp4`](./ALL_walkthrough.mp4)

| | | | |
| --- | --- | --- | --- |
| 0:00 | Finding an experience | 2:23 | Creating an opportunity |
| 0:21 | Booking an experience | 2:41 | Approving a reservation |
| 1:10 | Viewing a place | 2:56 | Managing members |
| 1:36 | Points and transaction history | 3:04 | Issuing and granting points |
| 1:56 | Tickets | 3:22 | Registering a place |
| 2:04 | My page and profile | 3:37 | Issuing tickets |
| | | 3:49 | Issuing a verifiable credential |
| | | 4:05 | Managing NFTs |
| | | 4:13 | Configuring bonuses |

## How these were recorded

The application is the front end of this repository, built and served as a
production build. Every interaction in the videos is a real tap on the real
interface — the pointer and the ripple are drawn into the page so the tap is
visible on camera — and each screen is rendered by the same code that runs on the
deployed environments.

Three things a reviewer should know:

**The backend is a local stand-in.** The recordings run against a local server that
answers GraphQL requests by executing them against `civicship-api`'s published
schema. The front end is unmodified; the data behind it is demonstration data, not
production records. Place names are the exception — they are the real NEO88 places
carried in this repository.

**Maps do not appear.** The Google Maps API is not reachable from the recording
environment, so the map components render nothing. On a deployed environment these
show a map of the place.

**No narration.** The videos are silent walkthroughs.

## Scope

Voting and the analytics screens are reachable in the codebase but their menu
entries are currently disabled, so they do not appear in these recordings.

---
---

<a id="ja"></a>

# デモ動画（日本語）

*[English is above](#en)*

civicship のフロントエンドの画面録画。ユースケース1件につき1本、390×844 のモバイル
表示で撮影している。Milestone 5 成果物3。Project Catalyst F12、Project ID 1200088。

## 住民向けユースケース

| | ユースケース | 動画 |
| --- | --- | --- |
| U1 | 体験を探す | [`U1_find-experience.mp4`](./U1_find-experience.mp4) |
| U2 | 体験を予約する | [`U2_reserve.mp4`](./U2_reserve.mp4) |
| U3 | 拠点を見る | [`U3_places.mp4`](./U3_places.mp4) |
| U4 | ポイントと取引履歴 | [`U4_points.mp4`](./U4_points.mp4) |
| U5 | チケット | [`U5_tickets.mp4`](./U5_tickets.mp4) |
| U6 | マイページとプロフィール | [`U6_mypage.mp4`](./U6_mypage.mp4) |

## コミュニティ管理者向けユースケース

| | ユースケース | 動画 |
| --- | --- | --- |
| A1 | 募集を作る | [`A1_admin-opportunity.mp4`](./A1_admin-opportunity.mp4) |
| A2 | 予約を承認する | [`A2_admin-reservations.mp4`](./A2_admin-reservations.mp4) |
| A3 | メンバーを管理する | [`A3_admin-members.mp4`](./A3_admin-members.mp4) |
| A4 | ポイントを発行・付与する | [`A4_admin-points.mp4`](./A4_admin-points.mp4) |
| A5 | 拠点を登録する | [`A5_admin-places.mp4`](./A5_admin-places.mp4) |
| A6 | チケットを発行する | [`A6_admin-tickets.mp4`](./A6_admin-tickets.mp4) |
| A7 | 証明書(VC)を発行する | [`A7_admin-credentials.mp4`](./A7_admin-credentials.mp4) |
| A8 | NFTを管理する | [`A8_admin-nfts.mp4`](./A8_admin-nfts.mp4) |
| A9 | 特典を設定する | [`A9_admin-bonuses.mp4`](./A9_admin-bonuses.mp4) |

## 通し版

15本を1本に連結したもの（4分26秒）:
[`ALL_walkthrough.mp4`](./ALL_walkthrough.mp4)

| | | | |
| --- | --- | --- | --- |
| 0:00 | 体験を探す | 2:23 | 募集を作る |
| 0:21 | 体験を予約する | 2:41 | 予約を承認する |
| 1:10 | 拠点を見る | 2:56 | メンバーを管理する |
| 1:36 | ポイントと取引履歴 | 3:04 | ポイントを発行・付与する |
| 1:56 | チケット | 3:22 | 拠点を登録する |
| 2:04 | マイページとプロフィール | 3:37 | チケットを発行する |
| | | 3:49 | 証明書(VC)を発行する |
| | | 4:05 | NFTを管理する |
| | | 4:13 | 特典を設定する |

## 撮影方法について

対象は本リポジトリのフロントエンドを本番ビルドして動かしたもの。動画中の操作はすべて
実際のインターフェースへの実際のタップである（タップ位置が分かるよう、ポインタと
リップルをページ内に描画している）。各画面は、稼働中の環境で動いているのと同じコードが
描画している。

レビュアーに知っておいてほしい点が3つある。

**バックエンドはローカルの代替である。** 録画は、`civicship-api` の公開スキーマに対して
クエリを実行して応答するローカルサーバーに対して行っている。フロントエンドには手を
加えていない。背後のデータは本番の記録ではなくデモ用のデータである。ただし拠点名だけは
例外で、本リポジトリに含まれる実際の NEO88 の拠点名を使用している。

**地図は表示されない。** 録画環境から Google Maps API に到達できないため、地図
コンポーネントは何も描画しない。稼働中の環境では、ここに拠点の地図が表示される。

**ナレーションはない。** 無音の操作動画である。

## 収録範囲について

投票機能とアナリティクス画面はコードベース上は到達可能だが、現在メニュー導線を停止して
いるため、これらの録画には含まれていない。
