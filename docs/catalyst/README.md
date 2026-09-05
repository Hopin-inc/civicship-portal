<a id="en"></a>

# Project Catalyst F12 — Submission Materials

*English below · [日本語は下段へ](#ja)*


Documentation produced for Project Catalyst Fund 12, *Creating social implementation
use-cases of Cardano in the Shikoku region, Japan* (Project ID 1200088).

These files live in the repository rather than in a document store so that every
claim in them can be checked against the source it describes.

These documents describe the code at `517e9a4` (2026-09-04).

## Deliverables and evidence

| Milestone | Deliverable | Acceptance criterion | Evidence | Status |
| --- | --- | --- | --- | --- |
| Milestone 5 | 1. Front-end development | The front-end source code is published on GitHub | https://github.com/Hopin-inc/civicship-portal — GPL-3.0 | Met |
| Milestone 5 | 1. Front-end development | Detailed documentation, including UI/UX design principles, integration processes, and user instructions | [Front-end documentation](./frontend-documentation.md) | Met |
| Milestone 5 | 1. Front-end development | A link is provided to try out the completed mutual app | https://dev.civicship.app/community/neo88 — see [Trying the application](#trying-the-application) | Met |
| Milestone 5 | 1. Front-end development | Fully functional and responsive across different devices | The same link, opened on a phone and on a desktop browser — see [Trying the application](#trying-the-application) | Met |
| Milestone 5 | 3. Demo video | The demo video is published on YouTube and is freely accessible to the community | [Demonstration videos](./demo/) — twenty-one use-case recordings in two sets: the eleven Milestone 3 demonstrated, and ten it did not cover | Recorded; YouTube publication pending |
| Milestone 5 | 3. Demo video | The video includes an access link to the application for usability testing | https://dev.civicship.app/community/neo88 | Pending — carried in the YouTube descriptions |
| Final | 2. Reports on the demonstration experiment, user feedback and usage statistics | Over 70% of community leaders satisfied with the application | [UAT report](./uat-report-2026.md) §2.1 | 47.7% (21 of 44). Below the threshold; see note 1 |
| Final | 2. Reports on the demonstration experiment, user feedback and usage statistics | Tester initials, living region, attribute and result shared with the community | [UAT report](./uat-report-2026.md) §5 | Partial; see note 1 |
| Final | 3. Bug fixes and security audit | Detailed report of bug fixes from user acceptance tests and security audits, shared with the community | [Security audit and remediation](../security/audit-2025-hexens.md) | Met |
| Final | 3. Bug fixes and security audit | Security audit conducted by a recognised third-party organisation | [Security audit and remediation](../security/audit-2025-hexens.md) — Hexens | Met |
| Final | 3. Bug fixes and security audit | Audit report and evidence of fixes publicly accessible | [Hexens report, final](https://drive.google.com/file/d/1T3v22q6stRceDy9eDbvpKB1rWGgGpO0W/view) · [Security audit and remediation](../security/audit-2025-hexens.md) | Met |
| Final | 3. Bug fixes and security audit | Fixed code publicly available on GitHub | https://github.com/Hopin-inc/civicship-portal · https://github.com/Hopin-inc/civicship-api | Met |

This index covers the deliverables evidenced from this repository. Other
deliverables in these milestones are submitted separately and are not indexed here.

## Repositories

| | |
| --- | --- |
| Front end | https://github.com/Hopin-inc/civicship-portal — GPL-3.0 |
| Backend / GraphQL API | https://github.com/Hopin-inc/civicship-api — GPL-3.0 |

## Live deployments

| Community | URL |
| --- | --- |
| Kibotcha DAO | https://kibotcha.civicship.app/transactions |
| Izu DAO | https://izu.civicship.app/transactions |
| Kotohira DAO | https://kotohira.civicship.app/opportunities |
| DAIS (DID / VC only) | https://dais.civicship.app/users/me |

DAIS renders only after login because it handles credential data. NEO88
(https://www.neo88.app/) was the initial demonstration partner; its demonstration
phase has concluded.

## Trying the application

https://dev.civicship.app/community/neo88

The NEO88 community on the development deployment. A visitor arriving without a
session is signed in automatically as a throwaway account, so the application can
be used without a LINE account. The interface is a LINE mini app: it is laid out
for a phone, adapts to the viewport width, and on a desktop browser the mobile
layout is centred on the page.

---

## Notes

### 1. Final Milestone deliverable 3

Satisfaction was measured at 47.7% against a 70% threshold.
[UAT report](./uat-report-2026.md) §2.1 gives the distribution and §4 the analysis.

Tester information is partial. Company or personal name was collected for 36 of 44
respondents; initials, region of residence and attribute were not collected as
separate fields. [UAT report](./uat-report-2026.md) §5 states what is available.

### 2. Scope of the security audit

The audit assessed the codebase as of September–December 2025 and targeted the NEO88
deployment. [Scope and currency](../security/audit-2025-hexens.md#scope-and-currency)
in the audit document sets out how its findings relate to the code today.

---
---

<a id="ja"></a>

# Project Catalyst F12 — 提出資料（日本語）

*[English is above](#en)*

Project Catalyst Fund 12「四国地域における Cardano の社会実装ユースケース創出」
（Project ID 1200088）のために作成したドキュメント。

これらをドキュメントストアではなくリポジトリに置いているのは、記述の一つひとつを、
それが説明している当のソースコードと突き合わせて検証できるようにするため。

これらのドキュメントは `517e9a4`（2026-09-04）時点のコードについて記述している。

## 成果物と対応するエビデンス

| マイルストーン | 成果物 | 受入条件 | エビデンス | 状況 |
| --- | --- | --- | --- | --- |
| Milestone 5 | 1. フロントエンド開発 | フロントエンドのソースコードが GitHub で公開されていること | https://github.com/Hopin-inc/civicship-portal — GPL-3.0 | 充足 |
| Milestone 5 | 1. フロントエンド開発 | UI/UX 設計原則・バックエンド連携・利用者向け手順書を含む詳細なドキュメント | [フロントエンド ドキュメント](./frontend-documentation.md) | 充足 |
| Milestone 5 | 1. フロントエンド開発 | 完成したアプリを試せるリンクが提供されていること | https://dev.civicship.app/community/neo88 — [アプリを試す](#アプリを試す)を参照 | 充足 |
| Milestone 5 | 1. フロントエンド開発 | 各種デバイスで完全に動作し、レスポンシブであること | 同じリンクをスマートフォンとデスクトップブラウザで開く — [アプリを試す](#アプリを試す)を参照 | 充足 |
| Milestone 5 | 3. デモ動画 | デモ動画が YouTube で公開され、コミュニティが自由にアクセスできること | [デモ動画](./demo/) — ユースケース別21本を2セットに分けて収録（Milestone 3 と同じ11件、扱われていなかった10件） | 収録済み。YouTube 公開は未了 |
| Milestone 5 | 3. デモ動画 | 動画に、使用性テスト用のアプリへのアクセスリンクが含まれること | https://dev.civicship.app/community/neo88 | 未了。YouTube の概要欄に記載する |
| Final | 2. 実証実験・利用者フィードバック・利用統計の報告 | community leaders の70%超がアプリケーションに満足していること | [UAT 報告書](./uat-report-2026.md) §2.1 | 47.7%（44件中21件）。基準を下回る。備考1を参照 |
| Final | 2. 実証実験・利用者フィードバック・利用統計の報告 | テスターのイニシャル・居住地域・属性・結果をコミュニティに共有すること | [UAT 報告書](./uat-report-2026.md) §5 | 一部。備考1を参照 |
| Final | 3. バグ修正とセキュリティ監査 | 受入テストと監査で判明したバグ修正の詳細な報告を、コミュニティに共有すること | [セキュリティ監査と対応状況](../security/audit-2025-hexens.md) | 充足 |
| Final | 3. バグ修正とセキュリティ監査 | 認知された第三者機関による監査が実施されていること | [セキュリティ監査と対応状況](../security/audit-2025-hexens.md) — Hexens | 充足 |
| Final | 3. バグ修正とセキュリティ監査 | 監査レポートと修正の証跡が公開されていること | [Hexens レポート（最終版）](https://drive.google.com/file/d/1T3v22q6stRceDy9eDbvpKB1rWGgGpO0W/view) · [セキュリティ監査と対応状況](../security/audit-2025-hexens.md) | 充足 |
| Final | 3. バグ修正とセキュリティ監査 | 修正済みコードが GitHub で公開されていること | https://github.com/Hopin-inc/civicship-portal · https://github.com/Hopin-inc/civicship-api | 充足 |

この索引が対象としているのは、本リポジトリからエビデンスを示す成果物のみである。
これらのマイルストーンに含まれる他の成果物は別途提出しており、ここには載せていない。

## リポジトリ

| | |
| --- | --- |
| フロントエンド | https://github.com/Hopin-inc/civicship-portal — GPL-3.0 |
| バックエンド / GraphQL API | https://github.com/Hopin-inc/civicship-api — GPL-3.0 |

## 稼働中の環境

| コミュニティ | URL |
| --- | --- |
| キボッチャ DAO | https://kibotcha.civicship.app/transactions |
| 伊豆 DAO | https://izu.civicship.app/transactions |
| 琴平 DAO | https://kotohira.civicship.app/opportunities |
| DAIS（DID / VC 特化） | https://dais.civicship.app/users/me |

DAIS はクレデンシャル情報を扱うためログイン後にのみ画面が表示される。NEO88
（https://www.neo88.app/）は当初の実証パートナーであり、実証フェーズは終了している。

## アプリを試す

https://dev.civicship.app/community/neo88

開発環境上の NEO88 コミュニティ。セッションを持たない訪問者は使い捨てアカウントとして
自動的にサインインするため、LINE アカウント無しでアプリケーションを操作できる。
インターフェースは LINE ミニアプリであり、スマートフォン向けにレイアウトされ、
ビューポート幅に追随する。デスクトップブラウザではモバイル向けレイアウトが画面中央に
配置される。

---

## 備考

### 1. Final Milestone 成果物3について

満足度の実測値は 47.7%、基準は70%超である。
分布は [UAT 報告書](./uat-report-2026.md) §2.1、分析は §4 に記載。

テスター情報は一部である。44件中36件について会社名または個人名を取得しているが、
イニシャル・居住地域・属性は個別の項目としては取得していない。取得できている内容は
[UAT 報告書](./uat-report-2026.md) §5 に記載。

### 2. セキュリティ監査の範囲

監査は2025年9〜12月時点のコードベースを評価し、NEO88 の環境を対象としている。
指摘事項が現在のコードとどう対応するかは、監査ドキュメントの
[監査の範囲と、現在との時間差](../security/audit-2025-hexens.md#監査の範囲と現在との時間差)に記載。
