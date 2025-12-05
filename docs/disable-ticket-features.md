# チケット機能停止 要件定義書

**Document Version:** 1.0
**作成日:** 2025-12-05
**ステータス:** Draft

---

## 📋 目次

1. [概要](#概要)
2. [目的](#目的)
3. [スコープ](#スコープ)
4. [現状分析](#現状分析)
5. [要件定義](#要件定義)
6. [実装計画](#実装計画)
7. [テスト計画](#テスト計画)
8. [リスクと対策](#リスクと対策)
9. [付録](#付録)

---

## 概要

### 背景
civicship-portalにおけるチケット関連機能を全面的に停止する。

### 影響範囲
- ユーザー向けチケット機能（受け取り、一覧、使用）
- 管理者向けチケット管理機能（発行、Utility管理）
- 予約システムとの統合機能
- 検索機能のチケットフィルター

### 対象コミュニティ
- `neo88`
- `default`

※これらのコミュニティで現在チケット機能が有効化されています

---

## 目的

### 主目的
チケット関連機能を完全に無効化し、ユーザー・管理者ともにアクセスできないようにする

### 副次的目的
- コードベースの簡素化
- 不要な機能の保守コスト削減
- ユーザー体験の明確化（使用しない機能の非表示）

### 非目的
- チケット関連データの削除（将来の再有効化の可能性を残す）
- GraphQL APIエンドポイントの削除
- データベーススキーマの変更

---

## スコープ

### 実装対象 (In Scope)

#### Phase 1: フィーチャーフラグの無効化
- [ ] コミュニティ設定からの `"tickets"` フィーチャー削除
- [ ] ナビゲーション要素の非表示化

#### Phase 2: ページレベルのアクセス制御
- [ ] ユーザー向けチケットページのアクセス制限
- [ ] 管理画面チケットページのアクセス制限

#### Phase 3: 統合機能の無効化
- [ ] 予約確認画面でのチケット使用機能の非表示
- [ ] 検索フィルターからのチケット関連項目削除

### 実装対象外 (Out of Scope)
- データベースからのチケットデータ削除
- GraphQL APIの削除
- バックエンドロジックの削除
- 他のコミュニティ（既に無効化済み）の設定変更

---

## 現状分析

### チケット機能の構成要素

#### データモデル
- **Ticket** - チケット本体
- **TicketClaimLink** - チケット受け取りリンク
- **TicketIssuer** - チケット発行者情報
- **Utility** - チケットの種類定義

#### ページ構成

**ユーザー向け:**
- `/tickets` - チケット一覧ページ
- `/tickets/receive` - チケット受け取りページ

**管理者向け:**
- `/admin/tickets` - チケット管理ページ
- `/admin/tickets/[id]` - チケット詳細ページ
- `/admin/tickets/utilities` - Utility管理ページ

#### 主要コンポーネント

| コンポーネント | パス | 用途 |
|--------------|------|------|
| `TicketList` | `/src/app/tickets/components/TicketList.tsx` | チケット一覧表示 |
| `TicketReceiveContent` | `/src/app/tickets/receive/components/TicketReceiveContent.tsx` | チケット受け取りUI |
| `CreateTicketSheet` | `/src/app/admin/tickets/components/CreateTicketSheet.tsx` | チケット発行UI |
| `TicketsToggle` | `/src/app/reservation/confirm/components/payment/TicketsToggle.tsx` | 予約時のチケット選択 |
| `UserTicketsAndPoints` | `/src/app/users/features/profile/components/UserTicketsAndPoints.tsx` | プロフィールのチケット表示 |

#### フィーチャーフラグ制御箇所

| ファイル | 行番号 | 制御内容 |
|---------|--------|---------|
| `AdminBottomBar.tsx` | 53-60 | 管理画面ナビゲーションタブ |
| `UserTicketsAndPoints.tsx` | 61-65 | プロフィールページのチケット表示 |
| `admin/page.tsx` | 37-42, 76-80 | 管理設定ページのリンク |

#### GraphQL API

**クエリ:**
- `GET_TICKETS` - チケット一覧取得
- `VIEW_TICKET_CLAIM_LINKS` - チケットクレームリンク取得
- `GET_TICKET_ISSUERS` - 発行者情報取得
- `GET_UTILITIES` - Utility一覧取得

**ミューテーション:**
- `TICKET_ISSUE` - チケット発行
- `TICKET_CLAIM` - チケット受け取り
- `CREATE_UTILITY` - Utility作成
- `createReservation` (チケット使用含む) - 予約作成

---

## 要件定義

### 機能要件

#### FR-1: フィーチャーフラグ無効化
**要件:**
対象コミュニティ（`neo88`, `default`）の設定から `"tickets"` を削除する

**受入基準:**
- [ ] `/src/lib/communities/metadata.ts` の `neo88.enableFeatures` から `"tickets"` が削除されている
- [ ] `/src/lib/communities/metadata.ts` の `default.enableFeatures` から `"tickets"` が削除されている
- [ ] 管理画面ボトムバーにチケットタブが表示されない
- [ ] プロフィールページにチケット情報が表示されない

#### FR-2: ユーザー向けページのアクセス制御
**要件:**
チケット機能が無効な場合、ユーザー向けチケットページへのアクセスを404エラーとする

**対象ページ:**
- `/tickets/page.tsx`
- `/tickets/receive/page.tsx`

**受入基準:**
- [ ] `/tickets` にアクセスすると404エラーが表示される
- [ ] `/tickets/receive?token=xxx` にアクセスすると404エラーが表示される
- [ ] フィーチャーフラグが有効なコミュニティでは引き続きアクセス可能

#### FR-3: 管理画面ページのアクセス制御
**要件:**
チケット機能が無効な場合、管理画面チケットページへのアクセスを404エラーとする

**対象ページ:**
- `/admin/tickets/page.tsx`
- `/admin/tickets/[id]/page.tsx`
- `/admin/tickets/utilities/page.tsx`

**受入基準:**
- [ ] `/admin/tickets` にアクセスすると404エラーが表示される
- [ ] `/admin/tickets/123` にアクセスすると404エラーが表示される
- [ ] `/admin/tickets/utilities` にアクセスすると404エラーが表示される
- [ ] フィーチャーフラグが有効なコミュニティでは引き続きアクセス可能

#### FR-4: 予約確認画面でのチケット機能無効化
**要件:**
チケット機能が無効な場合、予約確認画面でチケット選択UIを非表示にする

**対象コンポーネント:**
- `TicketsToggle.tsx`
- `PaymentSection.tsx` (チケット関連部分)

**受入基準:**
- [ ] 予約確認画面でチケット選択トグルが表示されない
- [ ] 支払い方法として「チケット」が選択できない
- [ ] 既存の他の支払い方法（ポイント等）は正常に動作する

#### FR-5: 検索フィルターからのチケット項目削除
**要件:**
チケット機能が無効な場合、検索画面で「チケット利用可」フィルターを非表示にする

**受入基準:**
- [ ] 検索画面で「チケット利用可」フィルターが表示されない
- [ ] URLパラメータ `useTicket` が無視される
- [ ] 他の検索フィルターは正常に動作する

### 非機能要件

#### NFR-1: パフォーマンス
- ページ読み込み時間への影響: なし
- フィーチャーフラグチェックのオーバーヘッド: 1ms以下

#### NFR-2: 互換性
- 既存の他の機能（ポイント、予約等）との互換性を維持
- フィーチャーフラグが有効なコミュニティでは引き続き動作

#### NFR-3: 保守性
- コードの可読性を維持
- 将来の再有効化を容易にする設計
- データベースデータは保持

#### NFR-4: セキュリティ
- 無効化されたページへの不正アクセス防止
- 既存データへのアクセス制御維持

---

## 実装計画

### 実装フェーズ

#### Phase 1: フィーチャーフラグ無効化 (優先度: 🔴 最高)

**実装時間見積もり:** 10分

**変更ファイル:**
1. `/src/lib/communities/metadata.ts`

**実装内容:**
```typescript
// neo88コミュニティ (Line 112付近)
neo88: {
  // ...
  enableFeatures: [
    "opportunities",
    "points",
    "articles",
    // "tickets", // 🔴 削除
    "prefectures",
    "quests"
  ],
  // ...
}

// defaultコミュニティ (Line 311-319付近)
default: {
  // ...
  enableFeatures: [
    "opportunities",
    "places",
    "points",
    "articles",
    // "tickets", // 🔴 削除
    "prefectures",
    "quests"
  ],
  // ...
}
```

**検証方法:**
- [ ] 管理画面を開き、ボトムバーにチケットタブがないことを確認
- [ ] プロフィールページでチケット情報が表示されないことを確認
- [ ] 管理設定ページでチケット管理リンクがないことを確認

---

#### Phase 2: ページレベルのアクセス制御 (優先度: 🟡 高)

**実装時間見積もり:** 30-45分

**変更ファイル:**
1. `/src/app/tickets/page.tsx`
2. `/src/app/tickets/receive/page.tsx`
3. `/src/app/admin/tickets/page.tsx`
4. `/src/app/admin/tickets/[id]/page.tsx`
5. `/src/app/admin/tickets/utilities/page.tsx`

**実装パターン（全ページ共通）:**
```typescript
import { currentCommunityConfig } from "@/lib/communities/metadata";
import { notFound } from "next/navigation";

export default function TicketsPage() {
  // チケット機能が無効な場合は404
  if (!currentCommunityConfig.enableFeatures.includes("tickets")) {
    notFound();
  }

  // 既存の実装...
  return (
    // ...
  );
}
```

**検証方法:**
- [ ] `/tickets` にアクセスして404エラーが表示される
- [ ] `/tickets/receive` にアクセスして404エラーが表示される
- [ ] `/admin/tickets` にアクセスして404エラーが表示される
- [ ] `/admin/tickets/123` にアクセスして404エラーが表示される
- [ ] `/admin/tickets/utilities` にアクセスして404エラーが表示される

---

#### Phase 3: 統合機能の無効化 (優先度: 🟢 中)

**実装時間見積もり:** 45-60分

**変更ファイル:**
1. `/src/app/reservation/confirm/components/payment/TicketsToggle.tsx`
2. `/src/app/reservation/confirm/components/payment/PaymentSection.tsx`
3. 検索フィルター関連ファイル（該当箇所を特定）

**実装内容 - TicketsToggle.tsx:**
```typescript
import { currentCommunityConfig } from "@/lib/communities/metadata";

export function TicketsToggle({ ... }: TicketsToggleProps) {
  // チケット機能が無効な場合は何も表示しない
  if (!currentCommunityConfig.enableFeatures.includes("tickets")) {
    return null;
  }

  // 既存の実装...
}
```

**実装内容 - PaymentSection.tsx:**
```typescript
// チケット関連のロジックをフィーチャーフラグで制御
const showTickets = currentCommunityConfig.enableFeatures.includes("tickets");

// レンダリング時の条件分岐
{showTickets && (
  <TicketsToggle ... />
)}
```

**検証方法:**
- [ ] 予約確認画面でチケット選択UIが表示されない
- [ ] 予約作成が正常に完了する（他の支払い方法で）
- [ ] 検索画面でチケットフィルターが表示されない

---

### ロールバック計画

各Phaseは独立しており、個別にロールバック可能：

**Phase 1のロールバック:**
```typescript
// metadata.ts で "tickets" を配列に戻す
enableFeatures: ["opportunities", "points", "articles", "tickets", ...]
```

**Phase 2のロールバック:**
```typescript
// 各ページからフィーチャーフラグチェックを削除
// if (!currentCommunityConfig.enableFeatures.includes("tickets")) {
//   notFound();
// }
```

**Phase 3のロールバック:**
```typescript
// 各コンポーネントからフィーチャーフラグチェックを削除
// if (!currentCommunityConfig.enableFeatures.includes("tickets")) {
//   return null;
// }
```

---

## テスト計画

### テストシナリオ

#### TS-1: フィーチャーフラグ無効化の確認

| テストケース | 操作 | 期待結果 | 優先度 |
|-------------|------|---------|--------|
| TC-1.1 | 管理画面を開く | ボトムバーにチケットタブが表示されない | P0 |
| TC-1.2 | プロフィールページを開く | チケット情報が表示されない | P0 |
| TC-1.3 | 管理設定ページを開く | チケット管理リンクが表示されない | P1 |

#### TS-2: ページアクセス制御の確認

| テストケース | 操作 | 期待結果 | 優先度 |
|-------------|------|---------|--------|
| TC-2.1 | `/tickets` にアクセス | 404エラーページが表示される | P0 |
| TC-2.2 | `/tickets/receive?token=xxx` にアクセス | 404エラーページが表示される | P0 |
| TC-2.3 | `/admin/tickets` にアクセス | 404エラーページが表示される | P0 |
| TC-2.4 | `/admin/tickets/123` にアクセス | 404エラーページが表示される | P1 |
| TC-2.5 | `/admin/tickets/utilities` にアクセス | 404エラーページが表示される | P1 |

#### TS-3: 予約機能の確認

| テストケース | 操作 | 期待結果 | 優先度 |
|-------------|------|---------|--------|
| TC-3.1 | 予約確認画面を開く | チケット選択UIが表示されない | P0 |
| TC-3.2 | ポイントで予約を作成 | 予約が正常に完了する | P0 |
| TC-3.3 | 現金で予約を作成 | 予約が正常に完了する | P1 |

#### TS-4: 検索機能の確認

| テストケース | 操作 | 期待結果 | 優先度 |
|-------------|------|---------|--------|
| TC-4.1 | 検索画面を開く | チケットフィルターが表示されない | P1 |
| TC-4.2 | `?useTicket=true` パラメータ付きでアクセス | パラメータが無視される | P2 |

#### TS-5: リグレッションテスト

| テストケース | 操作 | 期待結果 | 優先度 |
|-------------|------|---------|--------|
| TC-5.1 | ポイント機能を使用 | 正常に動作する | P0 |
| TC-5.2 | 体験予約を作成 | 正常に動作する | P0 |
| TC-5.3 | 検索機能を使用（チケット以外） | 正常に動作する | P0 |
| TC-5.4 | プロフィールページを表示 | ポイント情報が正常に表示される | P1 |

### テスト環境

- **開発環境:** ローカル開発サーバー
- **ステージング環境:** ステージング環境（本番前検証）
- **本番環境:** 本番環境（リリース後監視）

### テスト実施タイミング

1. **Phase 1完了後:** TS-1を実施
2. **Phase 2完了後:** TS-1, TS-2を実施
3. **Phase 3完了後:** 全テストシナリオを実施
4. **本番リリース後:** TS-5（リグレッション）を実施

---

## リスクと対策

### リスク管理表

| リスクID | リスク内容 | 影響度 | 発生確率 | 対策 | 担当 |
|---------|----------|--------|---------|------|------|
| R-1 | URLを直接知っているユーザーがアクセスできる（Phase 1のみ実施時） | 中 | 高 | Phase 2を実施してページアクセスを制限 | 開発 |
| R-2 | 既存のチケットを保有しているユーザーからの問い合わせ | 中 | 中 | サポートページに案内を追加 | CS |
| R-3 | 他機能への影響（予約、ポイント等） | 高 | 低 | 十分なリグレッションテストを実施 | QA |
| R-4 | フィーチャーフラグチェックの実装漏れ | 中 | 低 | コードレビューで全箇所を確認 | 開発 |
| R-5 | 将来の再有効化が困難 | 低 | 低 | データとAPIを保持、ドキュメント整備 | 開発 |

### 対応優先度

- **高:** R-3（他機能への影響）
- **中:** R-1（直接アクセス）、R-2（ユーザー問い合わせ）、R-4（実装漏れ）
- **低:** R-5（再有効化）

---

## 付録

### A. 影響を受けるファイル一覧

#### 設定ファイル (Phase 1)
- `/src/lib/communities/metadata.ts`

#### ページファイル (Phase 2)
- `/src/app/tickets/page.tsx`
- `/src/app/tickets/receive/page.tsx`
- `/src/app/admin/tickets/page.tsx`
- `/src/app/admin/tickets/[id]/page.tsx`
- `/src/app/admin/tickets/utilities/page.tsx`

#### コンポーネントファイル (Phase 3)
- `/src/app/reservation/confirm/components/payment/TicketsToggle.tsx`
- `/src/app/reservation/confirm/components/payment/PaymentSection.tsx`
- 検索フィルター関連（調査中）

#### 既存のフィーチャーフラグ制御箇所（変更不要）
- `/src/components/layout/AdminBottomBar.tsx`
- `/src/app/users/features/profile/components/UserTicketsAndPoints.tsx`
- `/src/app/admin/page.tsx`

### B. フィーチャーフラグチェック実装パターン

#### パターン1: ページコンポーネント
```typescript
import { currentCommunityConfig } from "@/lib/communities/metadata";
import { notFound } from "next/navigation";

export default function FeaturePage() {
  if (!currentCommunityConfig.enableFeatures.includes("tickets")) {
    notFound();
  }
  // ...
}
```

#### パターン2: クライアントコンポーネント
```typescript
"use client";
import { currentCommunityConfig } from "@/lib/communities/metadata";

export function FeatureComponent() {
  if (!currentCommunityConfig.enableFeatures.includes("tickets")) {
    return null;
  }
  // ...
}
```

#### パターン3: 条件付きレンダリング
```typescript
const isFeatureEnabled = currentCommunityConfig.enableFeatures.includes("tickets");

return (
  <div>
    {isFeatureEnabled && <FeatureComponent />}
  </div>
);
```

### C. 関連ドキュメント

- [コミュニティ設定ドキュメント](./communities-metadata.md)（未作成）
- [フィーチャーフラグガイド](./feature-flags.md)（未作成）
- [チケット機能アーキテクチャ](./ticket-architecture.md)（未作成）

### D. 参考リンク

- GraphQLスキーマ: `/src/graphql/reward/`
- チケット関連型定義: `/src/app/tickets/data/type.ts`
- コミュニティ設定: `/src/lib/communities/metadata.ts`

### E. 変更履歴

| バージョン | 日付 | 変更内容 | 作成者 |
|----------|------|---------|--------|
| 1.0 | 2025-12-05 | 初版作成 | Claude |

---

## 承認

| 役割 | 氏名 | 承認日 | 署名 |
|-----|------|--------|------|
| プロダクトオーナー | | | |
| 技術リード | | | |
| QAリード | | | |

---

**END OF DOCUMENT**
