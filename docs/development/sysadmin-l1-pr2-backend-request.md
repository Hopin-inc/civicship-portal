# SysAdmin L1 改善 (PR #2) — civicship-api 側への調査・仕様確認依頼

**宛先**: civicship-api バックエンド担当
**発信**: civicship-portal / SysAdmin ダッシュボード L1 後続作業
**関連**: PR #1170 (L1 baseline) がマージ済み。本依頼は L1 の「介入判断に耐える指標強化」フェーズの前提確認。

---

## 1. 背景

PR #1170 で出荷した L1 一覧は、`SysAdminCommunityOverview` 経由で以下のスナップショット指標を表示している:

- `communityActivityRate` (MAU%, JST 暦月)
- `growthRateActivity` (MoM %)
- `latestCohortRetentionM1` (前月コホートの M+1 retention)
- `tier1Count` / `tier2Count` / `passiveCount` / `totalMembers`
- `alerts.{churnSpike, activeDrop, noNewMembers}` (boolean only)

後続 PR (#2) の目的は **「SYS_ADMIN が今日ダッシュボードを開いて、どのコミュニティに介入すべきかを即判断できる」** 状態に L1 を寄せること。

この過程で以下 2 点がクリアになっていないため、civicship-api 側の現状確認と仕様方針判断を依頼したい。

---

## 2. 確認したい論点

### 論点 A — 「直近28日 rolling」の現実性

**背景**:
暦月 MAU% は asOf が月初 (例: 11/3) のとき分子がほぼ 0 で介入判断に使えない (月初 artifact)。
portal 側で「今日時点の28日窓」で評価したいという要望があり、以下のような新 field を追加できるか検討したい:

- `rolling28dActivityRate`: 直近 28 日の unique DONATION 送付者 / asOf 時点 `totalMembers`
- `rolling28dNewMemberRate`: 直近 28 日の新規加入 (`t_memberships.created_at`, status=JOINED) / asOf 時点 `totalMembers`
- `rolling28dGrowthRateActivity`: 直近 28 日窓 vs 1 つ前の 28 日窓 (D-56〜D-28) の % 変化
- `rolling28dGrowthRateNewMembers`: 上記の新規加入率版

**質問**:
1. 既存の集計 MV は月次粒度と認識している。rolling 28d を出すためには **daily MV 新設** か **都度集計** のどちらが現実的か?
2. SYS_ADMIN ダッシュボードはアクセス頻度が非常に低い (運営数名 × 数回/日想定)。都度集計でもレスポンス時間と DB 負荷の許容範囲内か?
3. daily MV を新設する場合、運用上のコスト (追加ストレージ、refresh スケジュール) はどの程度か?

---

### 論点 B — 「習慣化比率 (tier1Pct)」の所在

**背景**:
`userSendRate >= tier1 (default 0.7)` を「習慣化」と定義しており (既存 MetricDefinitions 準拠)、L1 で `tier1Count / totalMembers` を表示したい。

`SysAdminCommunitySummaryCard` (L2) には既に同パターンの `tier2Pct` が存在する:

```graphql
type SysAdminCommunitySummaryCard {
  tier2Count: Int!
  tier2Pct: Float!   # tier2Count / totalMembers
  ...
}
```

**質問**:
1. `SysAdminCommunityOverview` (L1) にも対称性のため `tier1Pct` / `tier2Pct` を **convenience field として足す意思はあるか**? (portal 側で派生計算も可能なので、純粋に設計対称性の判断)
2. 介入アラート閾値判定 (論点 C) で backend 側が `tier1Pct` を使うなら、同じ数値を payload に乗せるべきで、その場合は backend 追加が必然。

---

### 論点 C — 介入アラート (`SysAdminCommunityAlerts`) 拡張

**背景**:
現アラートは 3 boolean のみ:
- `churnSpike` (latest-week `churnedSenders > retainedSenders`)
- `activeDrop` (MoM `communityActivityRate` ≤ -20%)
- `noNewMembers` (`t_memberships.created_at` = 0 in last 14 days)

L1 baseline の段階では十分だが、PR #2 では以下の追加アラートを検討している:

- `newMemberAdoptionLow`: `rolling28dNewMemberRate` が閾値未満 (閾値値は未定)
- `habitualDrop`: `tier1Pct` が前 rolling28d 窓より一定幅低下 (幅は未定)

**質問**:
1. アラート判定ロジックを backend 側に置く方針を継続する前提で OK か? (portal 側で再実装すると二重管理)
2. 追加するなら閾値パラメタは **hardcode** / **入力パラメタ (SysAdminDashboardInput)** / **DB 設定** のどれが望ましいか?
3. rolling 28d 系 field 追加を見送る場合 (論点 A の結論次第)、アラートも暦月基準に留めるべきか?

---

### 論点 D — 代替案: backend 変更不要パスの成立性

**背景**:
論点 A で daily MV or 都度集計のコストが高い場合、portal 側だけで以下の限定実装に絞る選択肢がある。

- **習慣化比率**: portal で `tier1Count / totalMembers` を派生計算 (backend 触らず)
- **月初 artifact 回避**: portal で `asOf` のデフォルトを「直近完了月末」に変更 (例: 11/3 に開いても asOf=10/31 で送信 → MAU% は 10 月の完全データ)
- **新規加入の度合い**: 数値表示は諦め、既存 `noNewMembers` boolean のみで介入シグナル化
- **アラート強化**: 既存 3 boolean の優先度ロジックのみ portal 側で組み替え

**質問**:
1. 「asOf を直近完了月末で呼ぶ」利用パターンは backend 側の想定と整合するか? (例: daily な refresh を前提にしていないか、直近完了月のデータが確実に揃っている保証はあるか)
2. MV の月次 refresh タイミング次第で、月頭数日間は「先月」のデータがまだ不完全な可能性はあるか?

---

## 3. portal 側で既に判断済みの事項 (参考)

- 暦月 MAU% と `growthRateActivity` と `latestCohortRetentionM1` は **維持** (Glossary・L2 詳細で参照継続)
- rolling 28d を追加する場合も、L1 の主表示を差し替えるだけで暦月指標は L2 detail と Glossary に残す
- L1 は windowMonths パラメタを持たない現仕様を変えない (windowed trend は L2 `monthlyActivityTrend` に寄せる)

---

## 4. 回答で決まること / 次ステップ

civicship-api 側の回答で以下が確定する:

| 決定事項 | 分岐 |
|---|---|
| PR #2 の scope | backend-heavy (論点 A 採用) / frontend-only (論点 D 採用) |
| 追加する GraphQL field 群 | 論点 A で挙げた 4 field + 論点 B の 1-2 field / 何も足さない |
| アラート追加数 | 0-2 個 |
| PR 実装順序 | civicship-api 先行マージ待ち / portal 単独で並行実装 |

civicship-api 側の回答受領後、portal 側で要件を確定して実装に着手する。

---

## Appendix — portal 側で確認済みの既存 schema 抜粋

```graphql
type SysAdminCommunityOverview {
  communityId: ID!
  communityName: String!
  communityActivityRate: Float!       # 0-1
  growthRateActivity: Float            # MoM fraction, nullable
  latestCohortRetentionM1: Float       # nullable
  totalMembers: Int!
  passiveCount: Int!
  tier1Count: Int!
  tier2Count: Int!
  segmentCounts: SysAdminSegmentCounts!
  alerts: SysAdminCommunityAlerts!
}

type SysAdminCommunityAlerts {
  churnSpike: Boolean!
  activeDrop: Boolean!
  noNewMembers: Boolean!
}

input SysAdminDashboardInput {
  asOf: Datetime
  segmentThresholds: SysAdminSegmentThresholdsInput
}
```

L1 は `windowMonths` を持たず、`asOf` スナップショット + MoM + last-cohort-M1 の組み合わせで構成されている。
