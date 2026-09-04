<a id="en"></a>

# Project Catalyst F12 — Submission Materials

*English below · [日本語は下段へ](#ja)*


Documentation produced for Project Catalyst Fund 12, *Creating social implementation
use-cases of Cardano in the Shikoku region, Japan* (Project ID 1200088).

These files live in the repository rather than in a document store so that every
claim in them can be checked against the source it describes.

These documents are current as of `517e9a4` (2026-09-04).

## Deliverables and evidence

| Milestone | Deliverable | Acceptance criterion | Evidence | Status |
| --- | --- | --- | --- | --- |
| Milestone 5 | 1. Front-end development | Documentation covering UI/UX design principles, integration processes, and user instructions | [Front-end documentation](./frontend-documentation.md) | Met |
| Milestone 5 | 3. Demo video | A demonstration of the delivered front end | Submitted in the Catalyst milestone module; not hosted in this repository | Met |
| Final | 3. User acceptance testing | Over 70% of community leaders satisfied | [UAT report](./uat-report-2026.md) §2.1 | 47.7% (21 of 44). Below the threshold; see note 3 |
| Final | 3. User acceptance testing | Tester initials, region of residence, attribute and result | [UAT report](./uat-report-2026.md) §5 | Partial; see note 3 |
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

### 1. The commit these documents describe

The documents are written against `517e9a4`. The repositories are not fixed at that
commit: the backend milestone was submitted on 27 November 2025, and `civicship-api`
has taken well over a hundred commits to `master` since. Code present at HEAD and
not described by any document above is covered by note 2.

### 2. Work in the repositories after Milestone 4

The following is outside the scope of the deliverables above and is not offered as
evidence for them. It is listed so that the repositories can be read at HEAD against
the documents. The authoritative record is `git log`; this is a summary of themes.

**Identity.** DID issuance was reworked and existing users were backfilled. A phased
migration away from Identus as the DID/VC provider has been underway across several
releases. The migration is not complete — Identus is still referenced in eight files
at `517e9a4`.

**Credentials and NFTs.** NFT issuance was built out, including the resident-card
NFTs described in the DAO documentation. Authorization on VC issuance requests was
tightened so that a request is visible only to its subject or to an administrator.

**Analytics and reporting.** Community analytics, cohort funnels, a report scheduler
and report templates were added, with golden-case tests covering the generated
reports. This produces the usage figures in the [UAT report](./uat-report-2026.md).

**Points and transactions.** Members can contribute points to a community wallet
(`CONTRIBUTION`), alongside the existing peer-to-peer transfers.

**Data protection.** A GDPR domain was added to the API, covering data export and
deletion paths.

**Security posture.** A `security.txt` endpoint, domain hardening,
certificate-transparency log monitoring, dependency CVE remediation, and the
remediation of the audit findings recorded in
[the audit document](../security/audit-2025-hexens.md).

**Delivery.** Test suites split for parallel execution, pipeline and deployment
posture reviewed, GitHub Actions pinned to immutable commit SHAs, and Google Cloud
authentication moved to Workload Identity Federation.

**Front end.** The community wallet contribution flow, the administrative analytics
screens, a system-administration area, per-community feature configuration, and a
development-only login for testing non-production deployments without a LINE
account. The menu entries for analytics and for voting are currently disabled in the
interface; the screens and their routes remain in the codebase.

### 3. Final Milestone deliverable 3

Satisfaction was measured at 47.7% against a 70% threshold. The figure is reported
as measured. [UAT report](./uat-report-2026.md) §2.1 gives the distribution and §4
the analysis.

Tester information is partial. Company or personal name was collected for 36 of 44
respondents; initials, region of residence and attribute were not collected as
separate fields. [UAT report](./uat-report-2026.md) §5 states what is available.

### 4. Scope of the security audit

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

これらのドキュメントは `517e9a4`（2026-09-04）時点のもの。

## 成果物と対応するエビデンス

| マイルストーン | 成果物 | 受入条件 | エビデンス | 状況 |
| --- | --- | --- | --- | --- |
| Milestone 5 | 1. フロントエンド開発 | UI/UX 設計原則・バックエンド連携・利用者向け手順書を含むドキュメント | [フロントエンド ドキュメント](./frontend-documentation.md) | 充足 |
| Milestone 5 | 3. デモ動画 | 完成したフロントエンドのデモンストレーション | Catalyst のマイルストーンモジュール側で提出。本リポジトリには置いていない | 充足 |
| Final | 3. ユーザー受入テスト | community leaders の70%超が満足していること | [UAT 報告書](./uat-report-2026.md) §2.1 | 47.7%（44件中21件）。基準を下回る。備考3を参照 |
| Final | 3. ユーザー受入テスト | テスターのイニシャル・居住地域・属性・テスト結果 | [UAT 報告書](./uat-report-2026.md) §5 | 一部。備考3を参照 |
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

### 1. これらのドキュメントが対象とするコミット

各ドキュメントは `517e9a4` に対して書かれている。リポジトリ自体はそのコミットに
固定されていない — バックエンドのマイルストーンは2025年11月27日に提出しており、
`civicship-api` の `master` にはそれ以降100を優に超えるコミットが入っている。
HEAD に存在し、上記のいずれのドキュメントにも記載が無いコードについては備考2で扱う。

### 2. Milestone 4 以降にリポジトリに入った作業

以下は上記の成果物の範囲外であり、そのエビデンスとして提出するものではない。
リポジトリを HEAD で読む際に、上記ドキュメントと突き合わせられるように記載している。
正典は各リポジトリの `git log` であり、以下はテーマごとの要約である。

**アイデンティティ。** DID 発行を作り直し、既存ユーザーへのバックフィルを実施した。
DID/VC プロバイダを Identus から段階的に移行する作業が複数リリースにわたって進行して
いる。この移行は完了していない — `517e9a4` 時点で8ファイルが依然として Identus を
参照している。

**クレデンシャルと NFT。** DAO ドキュメントに記載の住民証 NFT を含む NFT 発行機能を構築。
VC 発行リクエストの認可を厳格化し、リクエストは本人か管理者にのみ見えるようにした。

**分析とレポート。** コミュニティ分析、コホートファネル、レポートスケジューラ、
レポートテンプレートを追加し、生成されるレポートに対する golden-case テストを整備。
[UAT 報告書](./uat-report-2026.md)に載せた利用統計はこの仕組みによるもの。

**ポイントと取引。** 既存の個人間送付に加え、メンバーからコミュニティ財布への
ポイント拠出（`CONTRIBUTION`）を追加。

**データ保護。** データのエクスポートと削除の経路を扱う GDPR ドメインを API に追加。

**セキュリティ体制。** `security.txt` エンドポイントの設置、ドメインのハードニング、
証明書透明性ログの監視、依存関係の CVE 対応、そして[監査ドキュメント](../security/audit-2025-hexens.md)に
記録した監査指摘への対応。

**デリバリ。** テストスイートを並列実行のために分割、パイプラインとデプロイ体制の
見直し、GitHub Actions のイミュータブルなコミット SHA へのピン留め、Google Cloud
認証の Workload Identity Federation への移行。

**フロントエンド。** コミュニティ財布への拠出フロー、管理者向け分析画面、システム管理
エリア、コミュニティ単位の機能設定、そして LINE アカウント無しで非本番環境を検証できる
開発専用ログイン。分析画面と投票画面のメニュー導線は現在インターフェース上で停止して
おり、画面とルート自体はコードベースに残っている。

### 3. Final Milestone 成果物3について

満足度の実測値は 47.7%、基準は70%超である。数値は実測のまま報告している。
分布は [UAT 報告書](./uat-report-2026.md) §2.1、分析は §4 に記載。

テスター情報は一部である。44件中36件について会社名または個人名を取得しているが、
イニシャル・居住地域・属性は個別の項目としては取得していない。取得できている内容は
[UAT 報告書](./uat-report-2026.md) §5 に記載。

### 4. セキュリティ監査の範囲

監査は2025年9〜12月時点のコードベースを評価し、NEO88 の環境を対象としている。
指摘事項が現在のコードとどう対応するかは、監査ドキュメントの
[監査の範囲と、現在との時間差](../security/audit-2025-hexens.md#監査の範囲と現在との時間差)に記載。
