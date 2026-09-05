<a id="en"></a>

# Final Milestone — Demonstration Experiment, NEO Shikoku 88 Event and Close Out

*English below · [日本語は下段へ](#ja)*


Project Catalyst F12, Project ID 1200088. Code as of `517e9a4` (2026-09-04).

## Deliverable 2 — Reports on the demonstration experiment, user feedback and usage statistics

The [UAT report](./uat-report-2025.md) answers all three criteria. It covers the
demonstration run during the NEO Shikoku 88 Festival, 1 July to 31 August 2025,
across the four prefectures of Shikoku, and is drawn from the 35 survey responses
that identify the experience provider who gave them.

### Over 70% of community leaders satisfied with the application

**Not met. 57.1% — 20 of 35.** The [UAT report](./uat-report-2025.md) gives the
full distribution: three rated the application "very satisfied", seventeen
"satisfied", eight "neither", six "somewhat dissatisfied" and one "dissatisfied".
The same 35 respondents were asked whether they would provide an experience
again, and 31 of them — 88.6% — rated that 4 or 5.

### Feedback collected and analysed, areas for improvement identified

**Met.** Every function was rated by all 35 respondents, eight left free-text
comments, and the report identifies three areas for improvement: discovery, the
rigidity of the listing format, and the LINE sign-up path. What changed in the
application afterwards is recorded [against each
function](./uat-report-2025.md#what-changed-in-the-application-afterwards).

### Tester initials, living region, attribute and result shared with the community

**Met.** All four are listed for each of the 35 testers the report draws on, in
[the tester
list](./uat-report-2025.md#criterion-3--tester-initials-living-region-attribute-and-result-shared)
— eighteen in Tokushima, eight in Ehime, eight in Kagawa and one in Kochi.

## Deliverable 3 — Bug fixes and security audit

### Security audit conducted by a recognised third-party organisation

**Met.** [Hexens](https://hexens.io/) assessed the platform, September–December
2025.

### Audit report and evidence of fixes publicly accessible

**Met.** [The report](https://drive.google.com/file/d/1T3v22q6stRceDy9eDbvpKB1rWGgGpO0W/view)
carries the findings, their severities and the status Hexens recorded for each.
[What changed in the code](./security-audit-response.md) records the fix for each
finding, and names the two items that remain open.

### Detailed report of bug fixes from user acceptance tests and security audits, shared with the community

**Met.** The audit side is [what changed in the
code](./security-audit-response.md); the user-acceptance side is [what changed in
the application
afterwards](./uat-report-2025.md#what-changed-in-the-application-afterwards),
which dates each change to its commit on `develop`.

### Fixed code publicly available on GitHub

**Met.** https://github.com/Hopin-inc/civicship-portal and
https://github.com/Hopin-inc/civicship-api, both public.

---
---

<a id="ja"></a>

# Final Milestone — 実証実験、NEO 四国88イベント、クローズアウト

*[English is above](#en)*

Project Catalyst F12、Project ID 1200088。`517e9a4`（2026-09-04）時点のコード。

## 成果物2 — 実証実験・利用者フィードバック・利用統計の報告

3つの受入条件すべてに [UAT 報告書](./uat-report-2025.md) が対応している。対象は
NEO 四国88祭（2025年7月1日〜8月31日）の期間中、四国4県で実施した実証であり、
体験提供事業者を特定できる35件の回答から算出している。

### community leaders の70%超がアプリケーションに満足していること

**未達。57.1%（35件中20件）。** 分布は [UAT 報告書](./uat-report-2025.md) に記載して
いる。「とても満足している」3件、「満足している」17件、「どちらともいえない」8件、
「やや不満がある」6件、「不満がある」1件である。同じ35名に次回も体験を提供したいかを
尋ねており、31件（88.6%）が4または5と回答している。

### フィードバックを収集・分析し、改善点を特定すること

**充足。** 全35名が各機能を評価し、8名が自由記述を残している。報告書は改善点として
発見性、掲載形式の硬直性、LINE の導線の3点を特定している。その後アプリケーションに
入った変更は[機能ごとに](./uat-report-2025.md#その後アプリケーションに入った変更)
記録している。

### テスターのイニシャル・居住地域・属性・結果をコミュニティに共有すること

**充足。** 報告書が対象とする35名すべてについて4項目を
[テスター一覧](./uat-report-2025.md#受入条件3--テスターのイニシャル居住地域属性結果の共有)
に掲載している。徳島18名、愛媛8名、香川8名、高知1名。

## 成果物3 — バグ修正とセキュリティ監査

### 認知された第三者機関による監査が実施されていること

**充足。** [Hexens](https://hexens.io/) が2025年9〜12月にプラットフォームを評価した。

### 監査レポートと修正の証跡が公開されていること

**充足。** 指摘事項・重大度・各指摘のステータスは
[レポート](https://drive.google.com/file/d/1T3v22q6stRceDy9eDbvpKB1rWGgGpO0W/view)
に記載。[コードで何を変更したか](./security-audit-response.md)が指摘ごとの修正内容を
記録しており、未対応の2件も明記している。

### 受入テストと監査で判明したバグ修正の詳細な報告を、コミュニティに共有すること

**充足。** 監査側は[コードで何を変更したか](./security-audit-response.md)、受入テスト側は
[その後アプリケーションに入った変更](./uat-report-2025.md#その後アプリケーションに入った変更)
であり、後者は各変更を `develop` のコミットに紐付けている。

### 修正済みコードが GitHub で公開されていること

**充足。** https://github.com/Hopin-inc/civicship-portal および
https://github.com/Hopin-inc/civicship-api。いずれも公開リポジトリ。
