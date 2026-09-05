<a id="en"></a>

# User Acceptance Test and Demonstration Experiment — Report

*English below · [日本語は下段へ](#ja)*


Final Milestone, deliverable 2. Project Catalyst F12, Project ID 1200088.

Describes the code at `517e9a4` (2026-09-04).

The deliverable's three acceptance criteria are the three headings below. Usage
statistics, named in the deliverable itself, are the fourth section.

---

## What was tested, and with whom

The demonstration ran during the NEO Shikoku 88 Festival across Kagawa, Tokushima,
Ehime and Kochi. The application was used in production by two distinct groups:

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
**144 responses** were received in total. The questionnaire served both audiences,
and the application-specific sections were shown only to experience providers, so
those sections carry **44–47 responses** depending on the question. All figures
below state their own denominator.

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

**Satisfied or better: 21 of 44 — 47.7%.**

The milestone's acceptance criterion asks for over 70% of community leaders
satisfied. **This measurement does not meet that threshold.** Section 4 sets out
what the number reflects and what we are doing about it.

### Usability by function

Each function was rated 1–5. A small number of out-of-range entries (values above
5) were excluded as data-entry errors; the count excluded is stated per row.

| Function | n | Mean | Median | Rated 4–5 | Excluded |
| --- | ---: | ---: | ---: | ---: | ---: |
| Reservation handling | 45 | 3.36 | 3.0 | 48.9% | 4 |
| Change / cancellation notices | 45 | 3.24 | 3.0 | 44.4% | 4 |
| Running an experience | 46 | 3.17 | 3.0 | 41.3% | 3 |
| Registering an experience | 46 | 3.11 | 3.0 | 39.1% | 3 |
| **Search / discovery** | **47** | **2.89** | **3.0** | **31.9%** | **2** |

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

---

## Criterion 2 — Feedback collected and analysed, areas for improvement identified

**Met.** The qualitative responses, the analysis of them, and the resulting actions follow.

### Qualitative feedback

Nine respondents left free-text comments. Three themes carry actionable content;
the remainder were expressions of thanks and of interest in continuing.

**Discoverability.** One provider wrote that they wanted *"a way of presenting
things that lets customers see at a glance what experiences exist and where."*
Search is also the lowest-scoring function quantitatively (mean 2.89).

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
most concrete comment. Improving discovery is the change most likely to move the
satisfaction figure.

### Actions taken and planned

| Finding | Action |
| --- | --- |
| Search / discovery rated lowest | Prioritised for redesign. The requirement is a view that lets a participant see what experiences exist and where, rather than a list to be filtered. |
| Listing format too rigid | Per-experience configurable fields and notes are under consideration for the next iteration. |
| LINE onboarding has too many steps for some | The step count is being reviewed. Replacing LINE authentication with ID/password is not planned, as the majority found registration easy and LINE is what the target residents already use. |
| Off-app discovery materials | Handed to the event organising side; outside the application's scope. |

---

## Criterion 3 — Tester initials, living region, attribute and result shared

**Partially met.** Names are held for 36 of 44 respondents; region of residence
and attribute were not collected.

The acceptance criterion asks for tester initials, region of residence, attribute
and result.

**Available:** company or personal name for 36 of 44 respondents, who consented to
be contacted about next year's programme. Initials can be supplied to reviewers on
request; we have not published them here because the responses were collected
without notice that identifying information would be made public.

**Not available:** region of residence and attribute. **The survey instrument did
not include these questions.**

Every respondent to the application sections was an experience provider operating
in the four prefectures of Shikoku (Kagawa, Tokushima, Ehime, Kochi) during the
festival, each representing a business or organisation rather than an individual
consumer.

---

---

## Usage statistics

Cumulative, across all communities on the platform.

| Metric | Value |
| --- | ---: |
| Total members | 1,052 |
| Total P2P transaction volume (internal record) | 8,682,000 |
| Total points issued | 2.22 billion |
| Total grant volume | 65,829,000 |
| Verified IDs (DID) issued | 912 |
| Credentials (VC) issued | 134 |

By community:

| Community | Members | P2P volume | Points issued | Grants | DID | VC |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Kibotcha · Izu | 582 | 8,557,000 | 2.22bn | 65,223,000 | 464 | 16 |
| Kotohira | 53 | 111,000 | 1,000,000 | 450,000 | 35 | 15 |
| DAIS | 49 | 0 | 0 | 0 | 48 | 48 |
| NEO88 | 368 | 14,000 | 1,020,000 | 156,000 | 365 | 55 |

These figures are internal activity records. They do not represent fiat currency
or redeemable economic value.

NEO88 shows 368 members and recorded activity but no activity in the most recent
month: it was designed as a time-limited demonstration community and its
demonstration phase has concluded. DAIS shows DIDs and VCs approximately equal to
its member count and no economic activity, which reflects its configuration as a
credential-only community.

---
---

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

実証は NEO 四国88祭の期間中、香川・徳島・愛媛・高知の4県で実施した。アプリケーションは
本番環境で、性質の異なる2つの利用者群によって使われた。

- **体験提供事業者** — 体験を掲載し、アプリ経由で予約を受け、承認または辞退し、
  変更を参加者に通知し、出欠を記録した地域の事業者・団体。
- **参加者** — 体験を検索し予約した住民および来訪者。

ユーザー受入テストの対象は**体験提供事業者**、マイルストーンが言う community leaders に
相当する層である。それぞれが地域の組織を代表し、単一の予約フローではなく
アプリケーションの運用面全体を使用した。

### 調査手法

祭の終了後、関係者全員にアンケートを配布し、**144件**の回答を得た。アンケートは両方の
利用者群を対象としており、アプリケーションに関する設問は体験提供事業者にのみ表示された。
そのため該当セクションの回答数は設問により **44〜47件** となる。以下の数値はすべて
分母を併記している。

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

**満足以上：44件中21件 — 47.7%。**

マイルストーンの受入条件は community leaders の70%超が満足していることを求めている。
**本測定はこの閾値を満たしていない。** この数値が何を反映しているか、それに対して
何を行うかは第4節に記す。

### 機能別の使いやすさ

各機能を1〜5で評価。5を超える範囲外の入力が少数あり、入力ミスとして除外した。
除外件数は行ごとに明記する。

| 機能 | n | 平均 | 中央値 | 4〜5の割合 | 除外 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 予約対応 | 45 | 3.36 | 3.0 | 48.9% | 4 |
| 変更・中止の通知 | 45 | 3.24 | 3.0 | 44.4% | 4 |
| 体験の実施 | 46 | 3.17 | 3.0 | 41.3% | 3 |
| 体験の登録 | 46 | 3.11 | 3.0 | 39.1% | 3 |
| **検索・発見** | **47** | **2.89** | **3.0** | **31.9%** | **2** |

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

---

## 受入条件2 — フィードバックを収集・分析し、改善点を特定すること

**達成。** 自由記述、その分析、および導かれた対応を以下に記す。

### 自由記述

9名から自由記述の回答を得た。うち3つのテーマが具体的な改善につながる内容を含み、
残りは謝意および継続への関心の表明であった。

**発見性。** ある事業者は
「お客様に、どんな体験がどこにあるかを俯瞰していただける見せ方を改善できたら」
と記した。検索は定量評価でも最下位の機能である（平均2.89）。

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
発見性の改善が、満足度の数値を動かす可能性が最も高い変更である。

### 実施済みおよび予定している対応

| 指摘 | 対応 |
| --- | --- |
| 検索・発見が最低評価 | 再設計の優先対象とする。要件は、絞り込むためのリストではなく、どんな体験がどこにあるかを参加者が俯瞰できるビュー。 |
| 掲載形式が硬直的 | 体験ごとに設定可能な項目と留意事項を、次のイテレーションで検討中。 |
| 一部の事業者にとって LINE の導線が長い | 手順数を見直し中。LINE 認証を ID・パスワードに置き換える予定はない — 多数は登録を楽と回答しており、対象となる住民が日常的に使っているのは LINE であるため。 |
| アプリ外の発見用資材 | イベント運営側に引き継いだ。アプリケーションの範囲外。 |

---

## 受入条件3 — テスターのイニシャル・居住地域・属性・結果の共有

**部分的に達成。** 44名中36名の氏名を保持している。居住地域と属性は未取得。

受入条件はテスターのイニシャル、居住地域、属性、テスト結果を求めている。

**取得済み：** 44名中36名の会社名または氏名。いずれも来年度のプログラムに関する連絡に
同意している。イニシャルはレビュアーの求めに応じて提供可能だが、本文には掲載していない
— 回答は、識別可能な情報が公開されるという告知なしに収集されたものであるため。

**未取得：** 居住地域および属性。**アンケートの設問にこれらが含まれていなかった。**

アプリケーション関連設問の回答者は全員が、祭の期間中に四国4県（香川・徳島・愛媛・高知）
で事業を営む体験提供事業者であり、個人の消費者としてではなく事業者・団体を代表して
参加していた。

---

---

## 利用統計

全コミュニティ横断の累計。

| 指標 | 数値 |
| --- | ---: |
| 総メンバー数 | 1,052 |
| 総P2P取引量（内部記録） | 868.2万 |
| 総発行ポイント数 | 22.2億 |
| 総助成記録量 | 6,582.9万 |
| 検証済みID（DID）発行数 | 912 |
| クレデンシャル（VC）発行数 | 134 |

コミュニティ別：

| コミュニティ | メンバー | P2P取引量 | 発行ポイント | 助成 | DID | VC |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| キボッチャ・伊豆 | 582 | 855.7万 | 22.2億 | 6,522.3万 | 464 | 16 |
| 琴平 | 53 | 11.1万 | 100.0万 | 45.0万 | 35 | 15 |
| DAIS | 49 | 0 | 0 | 0 | 48 | 48 |
| NEO88 | 368 | 1.4万 | 102.0万 | 15.6万 | 365 | 55 |

これらはプラットフォーム内部の活動記録であり、法定通貨や換金可能な経済的価値を示すもの
ではない。

NEO88 は 368名のメンバーと活動記録を持つが直近1ヶ月の活動はない。これは期間限定の実証
コミュニティとして設計されたためで、実証フェーズは終了している。DAIS はメンバー数と
ほぼ同数の DID・VC を持ち経済活動がないが、これはクレデンシャル特化の構成を反映したもの
である。
