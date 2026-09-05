<a id="en"></a>

# User Acceptance Test and Demonstration Experiment — Report

*English below · [日本語は下段へ](#ja)*


Final Milestone, deliverable 2. Project Catalyst F12, Project ID 1200088.

Describes the code at `517e9a4` (2026-09-04).

The deliverable's three acceptance criteria are the three headings below. Usage
statistics, named in the deliverable itself, are the fourth section.

---

## What was tested, and with whom

The demonstration ran during the NEO Shikoku 88 Festival, 1 July to 31 August
2025, across Kagawa, Tokushima, Ehime and Kochi. The application was used in
production by two distinct groups:

- **Experience providers** — local businesses and organisations who listed an
  experience, received reservations through the app, approved or declined them,
  notified participants of changes, and recorded attendance.
- **Participants** — residents and visitors who searched for experiences and
  booked them.

The user acceptance test targeted the **experience providers** — the group the
milestone calls community leaders. Each acts for an organisation in the region and
used the full operational surface of the application, not a single booking flow.

### Survey instrument

A questionnaire was distributed after the festival to everyone involved.
**44 responses** were received. Every figure below is drawn from those 44.

---

## Criterion 1 — Over 70% of community leaders satisfied with the application

**Not met. 47.7% (21 of 44).**

> *"How satisfied were you with the overall usability and experience of this
> application?"* — n = 44

| Response | Count | Share |
| --- | ---: | ---: |
| Very satisfied (exceeded expectations) | 4 | 9.1% |
| Satisfied (achieved my goal smoothly) | 17 | 38.6% |
| Neither | 12 | 27.3% |
| Somewhat dissatisfied | 7 | 15.9% |
| Dissatisfied | 4 | 9.1% |

---

## Criterion 2 — Feedback collected and analysed, areas for improvement identified

**Met.**

### Usability by function

Each function was rated 1–5 by all 44 respondents.

| Function | n | Mean | Median | Rated 4–5 |
| --- | ---: | ---: | ---: | ---: |
| Reservation handling | 44 | 3.34 | 3.0 | 47.7% |
| Change / cancellation notices | 44 | 3.23 | 3.0 | 43.2% |
| Running an experience | 44 | 3.14 | 3.0 | 38.6% |
| Registering an experience | 44 | 3.07 | 3.0 | 36.4% |
| **Search / discovery** | **44** | **2.86** | **3.0** | **29.5%** |

Every function has a median of 3.0. **Search scores lowest on every measure**, and
it is the only function whose mean falls below the midpoint.

### LINE integration

Multiple selection, n = 44, 56 selections.

| Response | Selections |
| --- | ---: |
| Communication was smooth | 15 |
| Account registration was easy | 10 |
| Nothing in particular | 13 |
| Too many steps | 6 |
| Hard to use | 6 |
| A conventional ID / password would be better | 5 |
| If we use LINE, I want to be reachable on LINE | 1 |

Positive selections outnumber negative ones, 25 to 18. Five providers selected that
a conventional ID / password account would be preferable.

### Intent to continue

| Question | Result |
| --- | --- |
| "I would provide an experience again next time" (1–5, n = 44) | Rated 4–5: **33 of 44 — 75.0%** |
| "May we contact you about participating next year?" (n = 44) | Yes: **37 of 44 — 84.1%** |

### Qualitative feedback

Nine respondents left free-text comments. Three themes carry actionable content;
the remainder were expressions of thanks and of interest in continuing.

**Discoverability.** One provider wrote that they wanted *"a way of presenting
things that lets customers see at a glance what experiences exist and where."*
Search is also the lowest-scoring function quantitatively (mean 2.86).

**Rigidity of the listing format.** A provider noted that *"the application felt
inflexible — it would be better if the selection fields and notes could be built
to suit each individual experience."* The current model assumes a common shape for
every experience; providers with unusual formats had to work around it.

**Off-app materials.** One comment concerned the printed pamphlet rather than the
application: *"the pamphlet was hard to use without explanation, which made
promotion difficult."* Recorded here because discovery of experiences spans both
the app and the printed material.

A separate comment reported an operational constraint rather than a product one:
one provider kept their experience open for the entire festival period and was too
occupied to visit others, and suggested cross-provider collaboration formats.

### Analysis

**Satisfaction and continuation measure different things.** Satisfaction sits at
47.7%, intent to provide again at 75%, willingness to be contacted at 84%.
Providers intend to return; they found the software adequate rather than good.

**The distribution is centred, not polarised.** The largest response is "satisfied"
(38.6%), the second "neither" (27.3%), and every function has a median of exactly
3.0. Dissatisfied responses total 25.0%.

**Search is the specific defect** — lowest quantitatively and the subject of the
most concrete comment.

**Four of the five functions are ones the provider operates; search is not.**
Registering, running, notifying and reservation handling are what a provider does
in the application. Search is what their customers do, and the free-text comment
asks for it on their behalf — *"a way of presenting things that lets **customers**
see at a glance what experiences exist and where."* This survey measured it through
the providers rather than through the people who use it.

### Areas for improvement identified

| Area | What the responses show |
| --- | --- |
| Discovery | Lowest of the five functions (mean 2.86, 29.5% rating it 4–5) and the subject of the most concrete free-text comment. What is asked for is a view of what experiences exist and where, rather than a list to be filtered. |
| Listing format | The model assumes a common shape for every experience. What is asked for is selection fields and notes that can be built per experience. |
| LINE onboarding | Six of 44 selected "too many steps" and five that a conventional ID / password would be better; ten selected that registration was easy, and fifteen that communication was smooth. |

---

## What changed in the application afterwards

Dates are the commits on `develop`. The survey closed on 6 November 2025.

| Function | Rated | What changed |
| --- | ---: | --- |
| Registering an experience | 3.07 | The administrative screens for creating and managing an opportunity were built into the application. Sessions, their capacity and their cancellation are set here. [`admin/opportunities`](https://github.com/Hopin-inc/civicship-portal/tree/develop/src/app/community/%5BcommunityId%5D/admin/opportunities), from 23 December 2025 |
| Reservation handling · Running an experience | 3.14–3.34 | The reservation detail screen — where a provider approves an application and records attendance — was restructured. [`0cbae16`](https://github.com/Hopin-inc/civicship-portal/commit/0cbae16e45cc3de59f6fb5e7c0936456989205fd), 26 December 2025 |
| Change / cancellation notices | 3.23 | Cancelling a session was implemented, with a message to the people holding a reservation for it. [`2354496`](https://github.com/Hopin-inc/civicship-portal/commit/2354496a8ddb424d5b4f2a4bff985246250cd59e) · [`1ee21db`](https://github.com/Hopin-inc/civicship-portal/commit/1ee21dbd4ce3e328c2c50303d3015cc0b968dd70), 23–24 December 2025 |
| **Search / discovery** | **2.86** | **No functional change.** It is the one function the survey measured through the providers rather than through the people who use it. |

---

## Criterion 3 — Tester initials, living region, attribute and result shared

**Met for the 35 testers below.**

**Region and attribute are the same for every row.** Each tester operated an
experience in one of the four prefectures of Shikoku — Kagawa, Tokushima, Ehime
or Kochi — during the festival, and each represents a business or organisation
rather than an individual consumer. The prefecture of each is not stated: the
survey did not ask for it.

Initials are romanised from the company or personal name as the tester wrote it.
Readings were not collected, so a name with more than one common reading is
rendered by its commonest.

| Tester | Initials | Result |
| --- | --- | --- |
| T01 | A.Y. | Satisfied |
| T02 | K.T. | Very satisfied |
| T03 | K.T. | Very satisfied |
| T04 | S.S. | Dissatisfied |
| T05 | A.Y. | Satisfied |
| T06 | K.B. | Satisfied |
| T07 | Y.O. | Somewhat dissatisfied |
| T08 | I.S. | Satisfied |
| T09 | H.M. | Somewhat dissatisfied |
| T10 | H.I. | Neither |
| T11 | U. | Somewhat dissatisfied |
| T12 | M.S. | Satisfied |
| T13 | T.H. | Satisfied |
| T14 | K.K. | Neither |
| T15 | I.K. | Neither |
| T16 | K.N. | Satisfied |
| T17 | S.G. | Satisfied |
| T18 | T.S. | Satisfied |
| T19 | Y.D. | Neither |
| T20 | J.M. | Neither |
| T21 | R.N. | Somewhat dissatisfied |
| T22 | Y.S. | Neither |
| T23 | H.B. | Somewhat dissatisfied |
| T24 | A.Y. | Satisfied |
| T25 | S.F. | Satisfied |
| T26 | A.M. | Neither |
| T27 | H.F. | Somewhat dissatisfied |
| T28 | G.C. | Very satisfied |
| T29 | I.K. | Satisfied |
| T30 | Y.D. | Satisfied |
| T31 | H.N. | Satisfied |
| T32 | I.S. | Satisfied |
| T33 | T.S. | Neither |
| T34 | M.N. | Satisfied |
| T35 | T.B. | Satisfied |

Nine of the 44 responses carry no tester name and are not listed. Every figure in
this report is calculated on all 44 responses.

---

## Usage statistics

The demonstration ran on NEO88. These are its figures.

| Metric | NEO88 |
| --- | ---: |
| Members | 368 |
| Verified IDs (DID) issued | 365 |
| Credentials (VC) issued | 55 |
| P2P transaction volume (internal record) | 14,000 |
| Points issued | 1,020,000 |
| Grant volume | 156,000 |

NEO88 records no activity in the most recent month. It was designed as a
time-limited demonstration community and its demonstration phase has concluded.

These figures are internal activity records. They do not represent fiat currency
or redeemable economic value.

### Appendix — the rest of the platform

The same application serves other communities. Their figures are given for
context; the demonstration experiment reported here is NEO88's.

| Community | Members | P2P volume | Points issued | Grants | DID | VC |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| **NEO88** | **368** | **14,000** | **1,020,000** | **156,000** | **365** | **55** |
| Kibotcha · Izu | 582 | 8,557,000 | 2.22bn | 65,223,000 | 464 | 16 |
| Kotohira | 53 | 111,000 | 1,000,000 | 450,000 | 35 | 15 |
| DAIS | 49 | 0 | 0 | 0 | 48 | 48 |
| Total | 1,052 | 8,682,000 | 2.22bn | 65,829,000 | 912 | 134 |

DAIS shows DIDs and VCs approximately equal to its member count and no economic
activity, which reflects its configuration as a credential-only community.

---
---

<a id="ja"></a>

# ユーザー受入テストおよび実証実験 — 報告書

*[English is above](#en)*

Final Milestone 成果物2。Project Catalyst F12、Project ID 1200088。

`517e9a4`（2026-09-04）時点のコードについて記述している。

本成果物の3つの受入条件が、以下の3つの見出しである。成果物名に含まれる利用統計を
4節目に置く。

---

## 何を、誰に対して検証したか

実証は NEO 四国88祭（2025年7月1日〜8月31日）の期間中、香川・徳島・愛媛・高知の4県で
実施した。アプリケーションは本番環境で、性質の異なる2つの利用者群によって使われた。

- **体験提供事業者** — 体験を掲載し、アプリ経由で予約を受け、承認または辞退し、
  変更を参加者に通知し、出欠を記録した地域の事業者・団体。
- **参加者** — 体験を検索し予約した住民および来訪者。

ユーザー受入テストの対象は**体験提供事業者**、マイルストーンが言う community leaders に
相当する層である。それぞれが地域の組織を代表し、単一の予約フローではなく
アプリケーションの運用面全体を使用した。

### 調査手法

祭の終了後、関係者全員にアンケートを配布し、**44件**の回答を得た。以下の数値はすべて
この44件から算出している。

---

## 受入条件1 — community leaders の70%超がアプリケーションに満足していること

**未達。47.7%（44件中21件）。**

> 「このアプリの全体的な使用感・体験に、どの程度ご満足いただけましたか？」— n = 44

| 回答 | 件数 | 割合 |
| --- | ---: | ---: |
| とても満足している（期待以上の体験ができた） | 4 | 9.1% |
| 満足している（目的をスムーズに達成できた） | 17 | 38.6% |
| どちらともいえない | 12 | 27.3% |
| やや不満がある（改善してほしい点があった） | 7 | 15.9% |
| 不満がある（満足できなかった） | 4 | 9.1% |

---

## 受入条件2 — フィードバックを収集・分析し、改善点を特定すること

**達成。**

### 機能別の使いやすさ

各機能を1〜5で評価。回答者44名全員が回答している。

| 機能 | n | 平均 | 中央値 | 4〜5の割合 |
| --- | ---: | ---: | ---: | ---: |
| 予約対応 | 44 | 3.34 | 3.0 | 47.7% |
| 変更・中止の通知 | 44 | 3.23 | 3.0 | 43.2% |
| 体験の実施 | 44 | 3.14 | 3.0 | 38.6% |
| 体験の登録 | 44 | 3.07 | 3.0 | 36.4% |
| **検索・発見** | **44** | **2.86** | **3.0** | **29.5%** |

全機能の中央値が3.0である。**検索はすべての指標で最下位**であり、平均が中間点を
下回る唯一の機能である。

### LINE 連携

複数選択、n = 44、選択数56。

| 回答 | 選択数 |
| --- | ---: |
| やり取りがスムーズ | 15 |
| アカウント登録が楽 | 10 |
| 特になし | 13 |
| 手順が多い | 6 |
| 使いにくい | 6 |
| 一般的な ID・パスワードの登録の方が良い | 5 |
| LINE を使うなら LINE で連絡が取れるようにしてほしい | 1 |

肯定的な選択が否定的な選択を上回る（25対18）。5名が「一般的な ID・パスワードの登録の
方が良い」を選択している。

### 継続意向

| 設問 | 結果 |
| --- | --- |
| 「次回もあれば体験を提供したい」（1〜5、n = 44） | 4〜5の評価：**44件中33件 — 75.0%** |
| 「来年度の参加についてご連絡してもよいか」（n = 44） | 可：**44件中37件 — 84.1%** |

### 自由記述

9名から自由記述の回答を得た。うち3つのテーマが具体的な改善につながる内容を含み、
残りは謝意および継続への関心の表明であった。

**発見性。** ある事業者は
「お客様に、どんな体験がどこにあるかを俯瞰していただける見せ方を改善できたら」
と記した。検索は定量評価でも最下位の機能である（平均2.86）。

**掲載形式の硬直性。** 別の事業者は
「アプリの自由度が少ないように感じました。選択項目や留意事項などそれぞれの体験にあった
作り方ができたらより良いかなと思いました」
と指摘した。現行モデルはすべての体験に共通の形式を前提としており、特殊な形態の事業者は
回避策を取る必要があった。

**アプリ外の資材。** アプリケーションではなく印刷パンフレットに関する指摘として
「パンフレットが説明なしには使いにくく広報が難しかった」があった。体験の発見はアプリと
印刷物の両方にまたがるため、ここに記録する。

なお、プロダクトではなく運営上の制約を報告した回答もあった。期間を通して体験を開放して
いたため他の体験を訪問する余裕がなかったというもので、事業者間で連携できる企画の提案が
併せて寄せられた。

### 分析

**満足度と継続意向は別のものを測っている。** 満足度 47.7%、次回も提供したい 75%、
来年度の連絡可 84%。事業者は再度参加する意向を持つ一方、ソフトウェアは「良い」ではなく
「十分」と評価している。

**分布は二極化しておらず中央に寄っている。** 最多は「満足している」（38.6%）、次が
「どちらともいえない」（27.3%）で、全機能の中央値がちょうど3.0。不満側は合計25.0%。

**検索が具体的な欠陥である。** 定量的に最下位で、かつ最も具体的な指摘の対象でもある。

**5機能のうち4つは事業者自身が操作する機能であり、検索だけがそうではない。**
体験の登録・実施・通知・予約対応は事業者がアプリ上で行う作業である。検索を使うのは
その顧客であり、自由記述もその立場からの要望である —「**お客様に**、どんな体験が
どこにあるかを俯瞰していただける見せ方を改善できたら」。本調査は、この機能を
実際の利用者ではなく事業者を通して測っている。

### 特定した改善点

| 領域 | 回答が示していること |
| --- | --- |
| 発見性 | 5機能中で最下位（平均2.86、4〜5の評価は29.5%）であり、自由記述で最も具体的な指摘の対象でもある。求められているのは、絞り込むためのリストではなく、どんな体験がどこにあるかを俯瞰できるビュー。 |
| 掲載形式 | 現行モデルはすべての体験に共通の形式を前提としている。求められているのは、体験ごとに構成できる選択項目と留意事項。 |
| LINE の導線 | 44名中6名が「手順が多い」、5名が「一般的な ID・パスワードの登録の方が良い」を選択。一方10名が「アカウント登録が楽」、15名が「やり取りがスムーズ」を選択している。 |

---

## その後アプリケーションに入った変更

日付は `develop` のコミット。アンケートの締切は2025年11月6日。

| 機能 | 評価 | 入った変更 |
| --- | ---: | --- |
| 体験の登録 | 3.07 | 募集の作成・管理を行う管理画面をアプリケーション内に構築した。開催枠、定員、開催の中止をここで設定する。[`admin/opportunities`](https://github.com/Hopin-inc/civicship-portal/tree/develop/src/app/community/%5BcommunityId%5D/admin/opportunities)、2025年12月23日から |
| 予約対応・体験の実施 | 3.14〜3.34 | 予約詳細画面（申込の承認と出欠の記録を行う画面）を作り直した。[`0cbae16`](https://github.com/Hopin-inc/civicship-portal/commit/0cbae16e45cc3de59f6fb5e7c0936456989205fd)、2025年12月26日 |
| 変更・中止の通知 | 3.23 | 開催枠の中止を実装し、その枠に予約している利用者へメッセージを添えて通知するようにした。[`2354496`](https://github.com/Hopin-inc/civicship-portal/commit/2354496a8ddb424d5b4f2a4bff985246250cd59e) · [`1ee21db`](https://github.com/Hopin-inc/civicship-portal/commit/1ee21dbd4ce3e328c2c50303d3015cc0b968dd70)、2025年12月23〜24日 |
| **検索・発見** | **2.86** | **機能的な変更なし。**5機能のうち唯一、実際の利用者ではなく事業者を通して測った機能である。 |

---

## 受入条件3 — テスターのイニシャル・居住地域・属性・結果の共有

**以下の35名について達成。**

**居住地域と属性は全行で共通である。** 各テスターは祭の期間中、四国4県（香川・徳島・
愛媛・高知）のいずれかで体験を提供しており、個人の消費者としてではなく事業者・団体を
代表して参加している。県単位の内訳は記載しない — アンケートで尋ねていないため。

イニシャルは、テスターが記入した会社名または氏名をローマ字化したもの。読みは取得して
いないため、複数の読みがある名前は一般的な読みで表記している。

| テスター | イニシャル | 結果 |
| --- | --- | --- |
| T01 | A.Y. | 満足している |
| T02 | K.T. | とても満足している |
| T03 | K.T. | とても満足している |
| T04 | S.S. | 不満がある |
| T05 | A.Y. | 満足している |
| T06 | K.B. | 満足している |
| T07 | Y.O. | やや不満がある |
| T08 | I.S. | 満足している |
| T09 | H.M. | やや不満がある |
| T10 | H.I. | どちらともいえない |
| T11 | U. | やや不満がある |
| T12 | M.S. | 満足している |
| T13 | T.H. | 満足している |
| T14 | K.K. | どちらともいえない |
| T15 | I.K. | どちらともいえない |
| T16 | K.N. | 満足している |
| T17 | S.G. | 満足している |
| T18 | T.S. | 満足している |
| T19 | Y.D. | どちらともいえない |
| T20 | J.M. | どちらともいえない |
| T21 | R.N. | やや不満がある |
| T22 | Y.S. | どちらともいえない |
| T23 | H.B. | やや不満がある |
| T24 | A.Y. | 満足している |
| T25 | S.F. | 満足している |
| T26 | A.M. | どちらともいえない |
| T27 | H.F. | やや不満がある |
| T28 | G.C. | とても満足している |
| T29 | I.K. | 満足している |
| T30 | Y.D. | 満足している |
| T31 | H.N. | 満足している |
| T32 | I.S. | 満足している |
| T33 | T.S. | どちらともいえない |
| T34 | M.N. | 満足している |
| T35 | T.B. | 満足している |

44件のうち9件はテスター名の記入がなく、一覧に含まれない。本報告書の数値はすべて44件の
回答に基づいて算出している。

---

## 利用統計

実証を行ったのは NEO88 である。以下はその数値。

| 指標 | NEO88 |
| --- | ---: |
| メンバー数 | 368 |
| 検証済みID（DID）発行数 | 365 |
| クレデンシャル（VC）発行数 | 55 |
| P2P取引量（内部記録） | 1.4万 |
| 発行ポイント数 | 102.0万 |
| 助成記録量 | 15.6万 |

NEO88 に直近1ヶ月の活動はない。期間限定の実証コミュニティとして設計されたためで、
実証フェーズは終了している。

これらはプラットフォーム内部の活動記録であり、法定通貨や換金可能な経済的価値を示すもの
ではない。

### 付録 — プラットフォーム上の他コミュニティ

同一のアプリケーションが他のコミュニティも運用している。参考として数値を挙げる。本報告書
が対象とする実証実験は NEO88 のものである。

| コミュニティ | メンバー | P2P取引量 | 発行ポイント | 助成 | DID | VC |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| **NEO88** | **368** | **1.4万** | **102.0万** | **15.6万** | **365** | **55** |
| キボッチャ・伊豆 | 582 | 855.7万 | 22.2億 | 6,522.3万 | 464 | 16 |
| 琴平 | 53 | 11.1万 | 100.0万 | 45.0万 | 35 | 15 |
| DAIS | 49 | 0 | 0 | 0 | 48 | 48 |
| 合計 | 1,052 | 868.2万 | 22.2億 | 6,582.9万 | 912 | 134 |

DAIS はメンバー数とほぼ同数の DID・VC を持ち経済活動がないが、これはクレデンシャル特化の
構成を反映したものである。
