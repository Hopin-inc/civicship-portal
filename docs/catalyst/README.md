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
| Milestone 5 | 1. Front-end development | Documentation covering UI/UX design principles, integration processes, and user instructions | [Front-end documentation](./frontend-documentation.md) | Met |
| Milestone 5 | 3. Demo video | A demonstration of the delivered front end | [Demonstration videos](./demo/) — twenty-one use-case recordings in two sets: the eleven Milestone 3 demonstrated, and ten it did not cover | Met |
| Final | 3. User acceptance testing | Over 70% of community leaders satisfied | [UAT report](./uat-report-2026.md) §2.1 | 47.7% (21 of 44). Below the threshold; see note 1 |
| Final | 3. User acceptance testing | Tester initials, region of residence, attribute and result | [UAT report](./uat-report-2026.md) §5 | Partial; see note 1 |
| Final | 4. Bug fixes and security audit | Security audit results and an account of the bug fixes, published where the community can access them | [Security audit and remediation](../security/audit-2025-hexens.md) | Met |

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
| Milestone 5 | 1. フロントエンド開発 | UI/UX 設計原則・バックエンド連携・利用者向け手順書を含むドキュメント | [フロントエンド ドキュメント](./frontend-documentation.md) | 充足 |
| Milestone 5 | 3. デモ動画 | 完成したフロントエンドのデモンストレーション | [デモ動画](./demo/) — ユースケース別21本を2セットに分けて収録（Milestone 3 と同じ11件、扱われていなかった10件） | 充足 |
| Final | 3. ユーザー受入テスト | community leaders の70%超が満足していること | [UAT 報告書](./uat-report-2026.md) §2.1 | 47.7%（44件中21件）。基準を下回る。備考1を参照 |
| Final | 3. ユーザー受入テスト | テスターのイニシャル・居住地域・属性・テスト結果 | [UAT 報告書](./uat-report-2026.md) §5 | 一部。備考1を参照 |
| Final | 4. バグ修正とセキュリティ監査 | セキュリティ監査の結果とバグ修正の説明を、コミュニティがアクセスできる形で公開すること | [セキュリティ監査と対応状況](../security/audit-2025-hexens.md) | 充足 |

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
