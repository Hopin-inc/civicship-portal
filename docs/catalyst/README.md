<a id="en"></a>

# Project Catalyst F12 — Submission Materials

*English below · [日本語は下段へ](#ja)*


Documentation produced for Project Catalyst Fund 12, *Creating social implementation
use-cases of Cardano in the Shikoku region, Japan* (Project ID 1200088).

These files live in the repository rather than in a document store so that every
claim in them can be checked against the source it describes.

## Contents

| Document | Milestone | What it covers |
| --- | --- | --- |
| [Front-end documentation](./frontend-documentation.md) | Milestone 5 | Architecture of the front end, how it integrates with the API, and where the UI/UX design material and user instructions live |
| [User Acceptance Test report](./uat-report-2026.md) | Final | Demonstration experiment results, provider feedback, analysis, and platform usage statistics |
| [Security audit and remediation](../security/audit-2025-hexens.md) | Final | The Hexens third-party audit, each finding, and its remediation status verified against the code |

## On the gap between a submission and the code today

Milestones are submitted at a point in time; the code keeps moving. The backend
milestone was submitted on **27 November 2025**, and `civicship-api` has taken well
over a hundred commits to `master` since then. A reader comparing that submission
to the repository today will find differences, and that is expected rather than a
discrepancy to explain away.

To keep these documents honest about it, each one states the commit it was written
against. Anything that has changed since is visible in `git log` rather than hidden
by a document that quietly stopped being true.

**These documents are current as of `517e9a4` (2026-09-04).**

### What has changed since Milestone 4

Rather than leave the gap unexplained, here is what the commit history shows. This
is a summary of themes, not an exhaustive changelog — the authoritative record is
`git log` in each repository.

**Volume.** At least **190 commits** landed on `civicship-api`'s `master` after the
Milestone 4 submission. That figure is a floor, not a total: those 190 span only
2026-05-13 to 2026-07-17, roughly two months of the nine that have passed, so the
real number is considerably higher.

**Identity.** The largest single line of work. DID issuance was reworked and
existing users were backfilled, and a **phased migration away from Identus** as the
DID/VC provider has been underway across several releases. That migration is *not
complete* — Identus is still referenced in eight files at the commit above — so it
should be read as in progress rather than finished.

**Credentials and NFTs.** NFT issuance was built out, including the resident-card
NFTs described in the DAO documentation. Authorization on VC issuance requests was
tightened so that a request is visible only to its subject or to an administrator.

**Analytics and reporting.** Community analytics, cohort funnels, a report
scheduler and report templates were added, with golden-case tests covering the
generated reports. This is the machinery behind the usage figures in the
[UAT report](./uat-report-2026.md).

**Points and transactions.** Members can now contribute points to a community
wallet (`CONTRIBUTION`), alongside the existing peer-to-peer transfers.

**Data protection.** A GDPR domain was added to the API, covering data export and
deletion paths.

**Security posture.** A sustained programme rather than a single fix: a
`security.txt` endpoint, domain hardening, certificate-transparency log
monitoring, dependency CVE remediation, and the remediation of the third-party
audit findings recorded in
[the audit document](../security/audit-2025-hexens.md).

**Delivery.** CI was restructured — test suites split for parallel execution,
pipeline and deployment posture reviewed, GitHub Actions pinned to immutable
commit SHAs, and Google Cloud authentication moved to Workload Identity Federation.

On this repository, the front end tracked those changes and added its own: the
community wallet contribution flow, the administrative analytics screens, a
system-administration area, per-community feature configuration, and a
development-only login that lets testers exercise non-production deployments
without a LINE account.

The short version: the project did not pause between Milestone 4 and this
submission. The identity layer was substantially rebuilt, credential and NFT
issuance shipped, analytics arrived, and the security work that produced the audit
above ran throughout.

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
---

<a id="ja"></a>

# Project Catalyst F12 — 提出資料（日本語）

*[English is above](#en)*

Project Catalyst Fund 12「四国地域における Cardano の社会実装ユースケース創出」
（Project ID 1200088）のために作成したドキュメント。

これらをドキュメントストアではなくリポジトリに置いているのは、記述の一つひとつを、
それが説明している当のソースコードと突き合わせて検証できるようにするため。

## 収録内容

| ドキュメント | マイルストーン | 内容 |
| --- | --- | --- |
| [フロントエンド ドキュメント](./frontend-documentation.md) | Milestone 5 | フロントエンドのアーキテクチャ、API との連携方法、UI/UX 設計資料と利用者向け手順書の所在 |
| [ユーザー受入テスト報告書](./uat-report-2026.md) | Final | 実証実験の結果、事業者からのフィードバック、分析、プラットフォーム利用統計 |
| [セキュリティ監査と対応状況](../security/audit-2025-hexens.md) | Final | Hexens による第三者監査、各指摘事項と、コードに対して検証した対応状況 |

## 提出時点と現在のコードの差について

マイルストーンはある時点での提出であり、コードはその後も動き続ける。バックエンドの
マイルストーンは **2025年11月27日** に提出しており、`civicship-api` の `master` には
それ以降 100 を優に超えるコミットが入っている。当時の提出物と現在のリポジトリを
比べれば差分は見つかるが、それは説明を要する不整合ではなく、想定された状態である。

その点について各ドキュメントを正直に保つため、**どのコミット時点で書かれたか**を
それぞれに明記している。以降に変わった箇所は、静かに古くなった文書の陰に隠れるのでは
なく `git log` から辿れる。

**これらのドキュメントは `517e9a4`（2026-09-04）時点のもの。**

### Milestone 4 以降に変わったこと

差分を説明せずに放置すると、読み手は最悪の想像をする。実際に何があったかを書いておく。
以下は網羅的な変更履歴ではなくテーマごとの要約であり、正典は各リポジトリの `git log`。

**分量。** Milestone 4 提出以降、`civicship-api` の `master` に **最低でも190コミット**が
入っている。これは総数ではなく下限である — その190件は 2026-05-13 から 2026-07-17 まで、
経過した9ヶ月のうち約2ヶ月分しか含んでいないため、実数はこれを大きく上回る。

**アイデンティティ。** 最も大きな作業の塊。DID 発行を作り直し、既存ユーザーへの
バックフィルを実施した。また DID/VC プロバイダを Identus から**段階的に移行する作業**が
複数リリースにわたって進行している。この移行は**完了していない** — 上記コミット時点で
8ファイルが依然として Identus を参照しており、進行中と読むべきである。

**クレデンシャルと NFT。** DAO ドキュメントに記載の住民証 NFT を含む NFT 発行機能を構築。
VC 発行リクエストの認可を厳格化し、リクエストは本人か管理者にのみ見えるようにした。

**分析とレポート。** コミュニティ分析、コホートファネル、レポートスケジューラ、
レポートテンプレートを追加し、生成されるレポートに対する golden-case テストを整備。
[UAT 報告書](./uat-report-2026.md)に載せた利用統計はこの仕組みによるもの。

**ポイントと取引。** 既存の個人間送付に加え、メンバーからコミュニティ財布への
ポイント拠出（`CONTRIBUTION`）を追加。

**データ保護。** データのエクスポートと削除の経路を扱う GDPR ドメインを API に追加。

**セキュリティ体制。** 単発の修正ではなく継続的な取り組みとして実施 — `security.txt`
エンドポイントの設置、ドメインのハードニング、証明書透明性ログの監視、依存関係の CVE 対応、
そして[監査ドキュメント](../security/audit-2025-hexens.md)に記録した第三者監査の指摘対応。

**デリバリ。** CI を再構成した — テストスイートを並列実行のために分割、パイプラインと
デプロイ体制の見直し、GitHub Actions のイミュータブルなコミット SHA へのピン留め、
Google Cloud 認証の Workload Identity Federation への移行。

このリポジトリ（フロントエンド）側もそれらに追随し、独自の追加を行った — コミュニティ
財布への拠出フロー、管理者向け分析画面、システム管理エリア、コミュニティ単位の機能設定、
そして LINE アカウント無しで非本番環境を検証できる開発専用ログイン。

要するに、**Milestone 4 とこの提出の間にプロジェクトが止まっていた事実はない。**
アイデンティティ層は大幅に作り直され、クレデンシャルと NFT の発行が稼働し、分析基盤が
入り、上記の監査に至るセキュリティ作業がその間ずっと動いていた。

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
