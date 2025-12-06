# チケット機能停止 要件定義書

**Document Version:** 1.5
**作成日:** 2025-12-05
**最終更新:** 2025-12-06
**ステータス:** Ready for Implementation

---

## 📋 目次

### 本編
1. [概要](#概要)
2. [目的とスコープ](#目的とスコープ)
3. [現状分析](#現状分析)
4. [要件定義](#要件定義)
5. [実装計画](#実装計画)
6. [テスト計画](#テスト計画)
7. [リスクと対策](#リスクと対策)

### 付録
- [付録A: 技術的前提条件](#付録a-技術的前提条件)
- [付録B: 調査結果とレビュー対応](#付録b-調査結果とレビュー対応)
- [付録C: システムフロー図](#付録c-システムフロー図)
- [付録D: 影響を受けるファイル一覧](#付録d-影響を受けるファイル一覧)
- [付録E: 実装パターン集](#付録e-実装パターン集)
- [付録F: トラブルシューティング](#付録f-トラブルシューティング)
- [付録G: 参考リンク](#付録g-参考リンク)
- [付録H: 変更履歴](#付録h-変更履歴)

---

# 本編

## 概要

### 背景

civicship-portalにおけるチケット関連機能を全面的に停止する。

### 対象コミュニティ

- `neo88`
- `default`

※これらのコミュニティで現在チケット機能が有効化されています

### 影響範囲

- ユーザー向けチケット機能（受け取り、一覧、使用）
- 管理者向けチケット管理機能（発行、Utility管理）
- 予約システムとの統合機能（チケット支払い）
- 検索機能のチケットフィルター

### ビジネス目標

- 使用しない機能の非表示によるUX向上
- 不要な機能の保守コスト削減
- 将来の再有効化を容易にする設計の維持

---

## 目的とスコープ

### 主目的

チケット関連機能を完全に無効化し、ユーザー・管理者ともにアクセスできないようにする

### スコープ

#### 実装対象 (In Scope)

- **Phase 1**: フィーチャーフラグの無効化（ナビゲーション自動非表示）
- **Phase 2**: チケットディレクトリの削除
- **Phase 3**: 検索フィルターからのチケットコード削除
- **Phase 4**: GraphQL クエリからのtickets削除
- **Phase 5**: 予約確認画面のTicketsToggleコード削除

#### 実装対象外 (Out of Scope)

- データベースからのチケットデータ削除
- GraphQL バックエンドAPIの削除（フロントエンドスコープ外）

---

## 現状分析

### チケット機能の構成

#### ページ構成

**ユーザー向け:**
- `/tickets` - チケット一覧
- `/tickets/receive` - チケット受け取り

**管理者向け:**
- `/admin/tickets` - チケット管理一覧
- `/admin/tickets/[id]` - チケット詳細
- `/admin/tickets/utilities` - Utility管理

#### フィーチャーフラグ制御箇所（既存）

以下は既にフィーチャーフラグで制御されており、**変更不要**（自動非表示）:

| ファイル | 制御内容 |
|---------|---------|
| `AdminBottomBar.tsx` | 管理画面ナビゲーションタブ |
| `UserTicketsAndPoints.tsx` | プロフィールページのチケット表示 |
| `admin/page.tsx` | 管理設定ページのリンク |

#### GraphQL関連の構成

**クエリ/ミューテーション:**
- `GET_WALLETS_WITH_TICKET` - ウォレット情報とチケット取得
- `GET_USER_FLEXIBLE` - ユーザー情報（wallets.tickets含む）
- `GET_USER_WALLET` - ユーザーウォレット（tickets含む）

**使用箇所:**
- `/src/app/reservation/confirm/hooks/useWalletData.ts` - 予約画面でのチケット情報取得

---

## 要件定義

### 機能要件

#### FR-1: フィーチャーフラグ無効化

**要件:**
対象コミュニティ（`neo88`, `default`）の設定から `"tickets"` を削除

**受入基準:**
- [ ] metadata.ts の neo88/default から "tickets" が削除されている
- [ ] 管理画面ボトムバーにチケットタブが表示されない
- [ ] プロフィールページにチケット情報が表示されない

---

#### FR-2: チケットディレクトリの削除

**要件:**
チケット関連のディレクトリを完全に削除し、404エラーを自動発生させる

**対象:**
- `/src/app/tickets/` ディレクトリ全体（17ファイル）
  - pages, components, hooks, data, graphql など
- `/src/app/admin/tickets/` ディレクトリ全体（8ファイル）
  - pages, components, hooks など

**受入基準:**
- [ ] `/src/app/tickets/` ディレクトリが削除されている
- [ ] `/src/app/admin/tickets/` ディレクトリが削除されている
- [ ] `/tickets` にアクセスすると404エラー（Next.js自動）
- [ ] `/admin/tickets` にアクセスすると404エラー（Next.js自動）
- [ ] TypeScript ビルドエラーがない

---

#### FR-3: 検索フィルターからのチケットコード削除

**要件:**
SearchFilters からチケット関連のコードを完全に削除

**対象:**
- `/src/app/search/components/SearchFilters.tsx` - チケットフィルター部分のコード削除

**受入基準:**
- [ ] チケットフィルター関連のコードが削除されている
- [ ] フィーチャーフラグチェック（`isTicketsEnabled`）が削除されている
- [ ] ポイントフィルターは正常に動作
- [ ] TypeScript ビルドエラーがない

---

#### FR-4: GraphQLクエリからのtickets削除

**要件:**
チケット関連のフィールドをGraphQLクエリから削除

**対象:**
- `/src/graphql/account/wallet/query.ts` - GET_WALLETS_WITH_TICKET削除
- `/src/graphql/account/user/query.ts` - tickets フィールド削除
- `/src/app/reservation/confirm/hooks/useWalletData.ts` - クエリ変更対応

**受入基準:**
- [ ] GET_WALLETS_WITH_TICKET クエリが削除されている
- [ ] GET_USER_FLEXIBLE, GET_USER_WALLET の tickets フィールドが削除されている
- [ ] useWalletData が代替クエリを使用している
- [ ] 型エラーが発生していない

---

#### FR-5: 予約確認画面のTicketsToggleコード削除

**要件:**
PaymentSection と呼び出し元からチケット関連のコードを完全に削除

**対象:**
- `/src/app/reservation/confirm/components/payment/PaymentSection.tsx` - TicketsToggle呼び出し削除、props削除
- `/src/app/reservation/confirm/components/ConfirmPageView.tsx` - チケット関連props削除

**受入基準:**
- [ ] PaymentSection から TicketsToggle 呼び出しが削除されている
- [ ] PaymentSection のチケット関連props（maxTickets, availableTickets, useTickets, etc.）が削除されている
- [ ] ConfirmPageView からチケット関連props渡しが削除されている
- [ ] フィーチャーフラグチェック（`isTicketsEnabled`）が削除されている
- [ ] ポイント機能は正常に動作
- [ ] TypeScript ビルドエラーがない

---

### 非機能要件

#### NFR-1: パフォーマンス
- ページ読み込み時間への影響: なし
- フィーチャーフラグチェックのオーバーヘッド: 1ms以下

#### NFR-2: 互換性
- 既存の他機能（ポイント、予約等）との互換性維持
- フィーチャーフラグが有効なコミュニティでは引き続き動作

#### NFR-3: 保守性
- データベースデータは保持（将来の再有効化に備える）
- 削除するコードはGit履歴で管理

#### NFR-4: セキュリティ
- 無効化されたページへの不正アクセス防止（404エラー）

---

## 実装計画

### Phase 1: フィーチャーフラグ無効化

**実装時間:** 5分
**優先度:** 🔴 最高

**変更ファイル:**
- `/src/lib/communities/metadata.ts`

**実装内容:**
```typescript
// Line 112付近 - neo88
enableFeatures: [
  "opportunities",
  "points",
  "articles",
  // "tickets", // ← 削除
  "prefectures",
  "quests"
]

// Line 311-319付近 - default
enableFeatures: [
  "opportunities",
  "places",
  "points",
  "articles",
  // "tickets", // ← 削除
  "prefectures",
  "quests"
]
```

**検証:**
- 管理画面でチケットタブが非表示
- プロフィールページでチケット情報が非表示

---

### Phase 2: チケットディレクトリの削除

**実装時間:** 5分
**優先度:** 🔴 最高

**削除対象:**
1. `/src/app/tickets/` - ディレクトリごと削除（17ファイル）
2. `/src/app/admin/tickets/` - ディレクトリごと削除（8ファイル）

**実装手順:**

```bash
# ユーザー向けチケットディレクトリを削除
git rm -r src/app/tickets/

# 管理者向けチケットディレクトリを削除
git rm -r src/app/admin/tickets/
```

**削除されるファイル:**
```
src/app/tickets/
├── page.tsx
├── layout.tsx
├── metadata.ts
├── receive/
│   ├── page.tsx
│   ├── components/
│   └── hooks/
├── components/
├── hooks/
├── data/
└── graphql/

src/app/admin/tickets/
├── page.tsx
├── [id]/page.tsx
├── utilities/page.tsx
├── components/
└── hooks/
```

**検証:**
- `/tickets` にアクセスすると404エラー（Next.js自動）
- `/admin/tickets` にアクセスすると404エラー（Next.js自動）
- TypeScript ビルドエラーがない

---

### Phase 3: 検索フィルターからのチケットコード削除

**実装時間:** 15分
**優先度:** 🟢 中

**変更ファイル:**
- `/src/app/search/components/SearchFilters.tsx`

**実装内容:**

```typescript
const SearchFilters: React.FC<SearchFiltersProps> = ({
  onFilterClick,
  formatDateRange,
  prefectureLabels,
  location,
  dateRange,
  guests,
  useTicket, // ← propsは残す（呼び出し元への影響最小化）
  usePoints,
}) => {
  const { control } = useFormContext();

  // チケット関連の Feature flag チェックを削除

  return (
    <div className="bg-background rounded-xl overflow-hidden">
      {/* 場所・日付・人数フィルター */}
      <FormField ... />
      <FormField ... />
      <FormField ... />

      {/* ポイントフィルターのみ表示 */}
      {usePoints && ( // ← チケット条件を削除
        <FormField
          control={control}
          name="usePoints" // ← name変更
          render={() => (
            <FormItem>
              <FormControl>
                <FilterButton
                  icon={<Tags className="h-4 w-4" />}
                  label="ポイント利用可" // ← label変更
                  value=""
                  active={usePoints}
                  onClick={() => onFilterClick("points")} // ← "other"から変更
                  verticalLayout={true}
                  className="rounded-b-xl"
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
```

**削除するコード:**
- `import { currentCommunityConfig } ...` （不要なら削除）
- `const isTicketsEnabled = ...` （完全削除）
- チケットフィルター条件部分（`isTicketsEnabled &&`）
- チケット表示ラベル（`"チケット利用可"`）

**検証:**
- チケットフィルターが表示されない
- ポイントフィルターは正常に動作
- TypeScript ビルドエラーがない

---

### Phase 4: GraphQLクエリからのtickets削除

**実装時間:** 30分
**優先度:** 🟡 高

**変更ファイル:**
1. `/src/graphql/account/wallet/query.ts`
2. `/src/graphql/account/user/query.ts`
3. `/src/app/reservation/confirm/hooks/useWalletData.ts`

**実装内容:**

**Step 1: GET_WALLETS_WITH_TICKET クエリ削除**
```typescript
// /src/graphql/account/wallet/query.ts
// 以下のクエリ全体を削除
export const GET_WALLETS_WITH_TICKET = gql`...`; // ← 削除
```

**Step 2: ユーザークエリからtickets削除**
```typescript
// /src/graphql/account/user/query.ts

// GET_USER_FLEXIBLEから削除（L56-58）
wallets @include(if: $withWallets) {
  ...WalletFields
  community {
    ...CommunityFields
  }
  // tickets {              // ← 削除
  //   ...TicketFields
  // }
}

// GET_USER_WALLETから削除（L115-120）
wallets {
  ...WalletFields
  community {
    ...CommunityFields
  }
  transactions { ... }
  // tickets {              // ← 削除
  //   ...TicketFields
  //   utility {
  //     ...UtilityWithOwnerFields
  //   }
  // }
}
```

**Step 3: useWalletData の修正**
```typescript
// /src/app/reservation/confirm/hooks/useWalletData.ts
"use client";

import { useMemo } from "react";
import { GqlWalletType, useGetWalletsQuery } from "@/types/graphql"; // ← 変更
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { toNumberSafe } from "@/utils/bigint";

export function useWalletData(userId?: string) {
  const { data, loading, error, refetch } = useGetWalletsQuery({ // ← 変更
    variables: {
      filter: {
        userId: userId,
        type: GqlWalletType.Member,
        communityId: COMMUNITY_ID,
      },
      first: 1,
    },
    skip: !userId,
    fetchPolicy: "cache-and-network",
  });

  const wallets = useMemo(
    () => data?.wallets?.edges?.flatMap((edge) => (edge?.node ? [edge.node] : [])) ?? null,
    [data],
  );

  const currentPoint = useMemo(() => {
    const memberWallet = wallets?.[0];
    return toNumberSafe(memberWallet?.currentPointView?.currentPoint, 0);
  }, [wallets]);

  // ticketsは常に空配列を返す
  const tickets = [];

  return {
    wallets,
    currentPoint,
    tickets,
    loading,
    error,
    refetch,
  };
}
```

**Step 4: 型生成の再実行**
```bash
npm run codegen
```

**検証:**
- `npm run codegen` がエラーなく完了
- TypeScript型エラーがない
- 予約画面が正常に動作（チケット欄は非表示）

---

### Phase 5: 予約確認画面のTicketsToggleコード削除

**実装時間:** 20分
**優先度:** 🟢 中

**変更ファイル:**
1. `/src/app/reservation/confirm/components/payment/PaymentSection.tsx`
2. `/src/app/reservation/confirm/components/ConfirmPageView.tsx`

**実装内容:**

**Step 1: PaymentSection.tsx の修正**

チケット関連のコードを完全に削除:

```typescript
import React, { memo, useCallback, useEffect, useState } from "react";
// import { TicketsToggle } from "./TicketsToggle"; // ← 削除
import { PointsToggle } from "./PointsToggle";
// import { AvailableTicket } ... // ← 削除（不要なら）
import { isPointsOnlyOpportunity } from "@/utils/opportunity/isPointsOnlyOpportunity";

interface PaymentSectionProps {
  ticketCount: number;
  onIncrement: () => void;
  onDecrement: () => void;
  // maxTickets: number;              // ← 削除
  // availableTickets: AvailableTicket[];  // ← 削除
  pricePerPerson: number | null;
  participantCount: number;
  // useTickets: boolean;             // ← 削除
  // setUseTickets: (value: boolean) => void;  // ← 削除
  usePoints: boolean;
  setUsePoints: (value: boolean) => void;
  userWallet: number | null;
  pointsRequired: number;
  onPointCountChange?: (count: number) => void;
  // onTicketCountChange?: (count: number) => void;  // ← 削除
  // onSelectedTicketsChange?: ...    // ← 削除
}

const PaymentSection: React.FC<PaymentSectionProps> = memo(
  ({
    // maxTickets,                     // ← 削除
    participantCount,
    // useTickets,                     // ← 削除
    // setUseTickets,                  // ← 削除
    usePoints,
    setUsePoints,
    userWallet,
    pointsRequired,
    // availableTickets,               // ← 削除
    pricePerPerson,
    onPointCountChange,
    // onTicketCountChange,            // ← 削除
    // onSelectedTicketsChange,        // ← 削除
  }) => {
    // const [selectedTicketCount, setSelectedTicketCount] = useState(0);  // ← 削除
    const [selectedPointCount, setSelectedPointCount] = useState(0);
    const [allDisabled, setAllDisabled] = useState(false);

    const isPointsOnly = isPointsOnlyOpportunity(pricePerPerson, pointsRequired);

    // const totalSelected = selectedTicketCount + selectedPointCount;  // ← 削除
    const totalSelected = selectedPointCount;  // ← チケットカウント削除
    const remainingSlots = Math.max(0, participantCount - totalSelected);

    useEffect(() => {
      // const shouldBeDisabled = selectedTicketCount + selectedPointCount >= participantCount;  // ← 削除
      const shouldBeDisabled = selectedPointCount >= participantCount;  // ← 修正

      if (shouldBeDisabled) {
        setAllDisabled(true);
      } else {
        setAllDisabled(false);
      }
    }, [selectedPointCount, participantCount]);  // ← selectedTicketCount削除

    // handleTicketCountChange 削除
    // handleSelectedTicketsChange 削除

    const handlePointCountChange = useCallback(
      (count: number) => {
        setSelectedPointCount(count);
        if (onPointCountChange) {
          onPointCountChange(count);
        }
      },
      [onPointCountChange],
    );

    const getTitle = () => {
      // if (maxTickets > 0 && pointsRequired > 0) {  // ← 削除
      //   return "ポイント・チケットを利用";
      // } else
      if (pointsRequired > 0) {
        return "ポイントを利用";
      // } else {                      // ← 削除
      //   return "チケットを利用";
      }
      return "支払い方法";
    };

    return (
      <div className="rounded-lg px-6">
        <h3 className="text-display-sm mb-4">{getTitle()}</h3>
        {/* TicketsToggle コンポーネント呼び出し全体を削除 */}
        {pointsRequired > 0 && !isPointsOnly && (
          <PointsToggle
            usePoints={usePoints}
            setUsePoints={setUsePoints}
            maxPoints={userWallet ?? 0}
            participantCount={participantCount}
            pointsRequired={pointsRequired}
            onPointCountChange={handlePointCountChange}
            remainingSlots={remainingSlots}
            disabled={
              // selectedTicketCount >= participantCount ||  // ← 削除
              !userWallet || userWallet < pointsRequired
            }
            allDisabled={allDisabled}
            isPointsOnly={isPointsOnly}
          />
        )}
      </div>
    );
  },
);

PaymentSection.displayName = "PaymentSection";

export default PaymentSection;
```

**Step 2: ConfirmPageView.tsx の修正**

PaymentSection 呼び出し箇所からチケット関連propsを削除:

```typescript
// interface からチケット関連props削除
export interface ConfirmPageViewProps {
  // ... 他のprops
  calculations: {
    feeRequired: number | null;
    pointsRequired: number;
    isActivity: boolean;
    isQuest: boolean;
    // maxTickets: number;                // ← 削除
    isPointsOnly: boolean;
    totalPointsRequired: number;
    hasInsufficientPoints: boolean;
  };
  // ... 他のprops
  // selectedTicketCount: number;          // ← 削除
  // onTicketCountChange: (count: number) => void;  // ← 削除
  // selectedTickets: Record<string, number>;       // ← 削除
  // onSelectedTicketsChange: (tickets: Record<string, number>) => void;  // ← 削除
  // useTickets: boolean;                  // ← 削除
  // setUseTickets: (use: boolean) => void;  // ← 削除
  // availableTickets: AvailableTicket[];  // ← 削除
  // ... 他のprops
}

export default function ConfirmPageView(props: ConfirmPageViewProps) {
  const {
    // ... 他の変数
    // selectedTicketCount,              // ← 削除
    // onTicketCountChange,              // ← 削除
    // selectedTickets,                  // ← 削除
    // onSelectedTicketsChange,          // ← 削除
    // useTickets,                       // ← 削除
    // setUseTickets,                    // ← 削除
    // availableTickets,                 // ← 削除
    // ... 他の変数
  } = props;

  const {
    feeRequired,
    pointsRequired,
    isActivity,
    isQuest,
    // maxTickets,                       // ← 削除
    isPointsOnly,
    hasInsufficientPoints,
  } = calculations;

  // ...

  {/* PaymentSection 呼び出し修正 */}
  {isActivity && pointsRequired > 0 && !isPointsOnly && (  {/* maxTickets条件削除 */}
    <PaymentSection
      ticketCount={ticketCounter.count}
      onIncrement={ticketCounter.increment}
      onDecrement={ticketCounter.decrement}
      // maxTickets={maxTickets}         // ← 削除
      // availableTickets={availableTickets}  // ← 削除
      pricePerPerson={feeRequired}
      participantCount={participantCount}
      // useTickets={useTickets}         // ← 削除
      // setUseTickets={setUseTickets}   // ← 削除
      userWallet={userWallet}
      usePoints={usePoints}
      setUsePoints={setUsePoints}
      pointsRequired={pointsRequired}
      onPointCountChange={onPointCountChange}
      // onTicketCountChange={onTicketCountChange}  // ← 削除
      // onSelectedTicketsChange={onSelectedTicketsChange}  // ← 削除
    />
  )}
}
```

**削除するコード一覧:**

**PaymentSection.tsx:**
- TicketsToggle import
- AvailableTicket import（不要なら）
- Interface の ticket 関連 props (6つ)
- selectedTicketCount state
- handleTicketCountChange callback
- handleSelectedTicketsChange callback
- getTitle() のチケット関連分岐
- TicketsToggle コンポーネント呼び出し全体
- PointsToggle の disabled 条件から selectedTicketCount

**ConfirmPageView.tsx:**
- calculations の maxTickets
- selectedTicketCount, onTicketCountChange props
- selectedTickets, onSelectedTicketsChange props
- useTickets, setUseTickets props
- availableTickets props
- PaymentSection 条件から maxTickets チェック
- PaymentSection に渡すチケット関連 props (7つ)

**検証:**
- 予約確認画面でチケットToggleが表示されない
- ポイント機能は正常に動作
- タイトルが「ポイントを利用」または「支払い方法」のみ表示
- TypeScript ビルドエラーがない

---

### ロールバック計画

各Phaseは独立しており、個別にロールバック可能：

**Phase 1:** metadata.ts で "tickets" を戻す（1分）
**Phase 2:** Git履歴からディレクトリを復元（`git revert` または `git checkout`）（5分）
**Phase 3:** Git履歴から SearchFilters のチケットコードを復元（5分）
**Phase 4:** Git履歴から GraphQL クエリを復元、codegen実行（15分）
**Phase 5:** Git履歴から PaymentSection/ConfirmPageView のチケットコードを復元（10分）

---

## テスト計画

### テストシナリオ

#### TS-1: フィーチャーフラグ無効化

| ID | 操作 | 期待結果 | 優先度 |
|----|------|---------|--------|
| TC-1.1 | 管理画面を開く | チケットタブが非表示 | P0 |
| TC-1.2 | プロフィールページを開く | チケット情報が非表示 | P0 |

#### TS-2: ディレクトリ削除

| ID | 操作 | 期待結果 | 優先度 |
|----|------|---------|--------|
| TC-2.1 | /tickets にアクセス | 404エラー（Next.js自動） | P0 |
| TC-2.2 | /admin/tickets にアクセス | 404エラー（Next.js自動） | P0 |
| TC-2.3 | TypeScript ビルド | エラーなし | P0 |

#### TS-3: 検索機能

| ID | 操作 | 期待結果 | 優先度 |
|----|------|---------|--------|
| TC-3.1 | 検索画面を開く | チケットフィルター非表示、ポイントフィルターのみ表示 | P0 |
| TC-3.2 | ポイントフィルター確認 | 正常に表示・動作（ラベル「ポイント利用可」） | P0 |
| TC-3.3 | TypeScript ビルド | エラーなし | P0 |

#### TS-4: リグレッション

| ID | 操作 | 期待結果 | 優先度 |
|----|------|---------|--------|
| TC-4.1 | ポイントで予約作成 | 正常に完了 | P0 |
| TC-4.2 | 現金で予約作成 | 正常に完了 | P0 |

#### TS-5: GraphQLクエリ

| ID | 操作 | 期待結果 | 優先度 |
|----|------|---------|--------|
| TC-5.1 | npm run codegen 実行 | エラーなく完了 | P0 |
| TC-5.2 | TypeScript ビルド | 型エラーなし | P0 |
| TC-5.3 | 予約画面データ取得 | ウォレット情報取得成功 | P0 |

#### TS-6: 予約確認画面

| ID | 操作 | 期待結果 | 優先度 |
|----|------|---------|--------|
| TC-6.1 | 予約確認画面を開く | チケットToggle非表示 | P0 |
| TC-6.2 | ポイント利用確認 | 正常に動作 | P0 |
| TC-6.3 | タイトル表示確認 | 「ポイントを利用」または「支払い方法」のみ表示 | P0 |
| TC-6.4 | TypeScript ビルド | エラーなし | P0 |

---

## リスクと対策

| ID | リスク | 影響度 | 発生確率 | 対策 |
|----|--------|--------|---------|------|
| R-1 | Phase 1のみ実施時、URL直接アクセス可能 | 中 | 高 | Phase 2を必ず実施 |
| R-2 | 他機能への影響 | 高 | 低 | 十分なリグレッションテスト |
| R-3 | 実装漏れ | 中 | 低 | コードレビューで全箇所確認 |
| R-4 | GraphQL型生成エラー | 中 | 中 | codegen後に即座にビルド確認 |
| R-5 | 予約画面でのランタイムエラー | 高 | 低 | useWalletDataの空配列返却を確認 |

---

# 付録

## 付録A: 技術的前提条件

### A-1. コミュニティ設定システム

**仕組み:**
```typescript
// 環境変数 NEXT_PUBLIC_COMMUNITY_ID でビルド時に決定
export const COMMUNITY_ID = getCommunityIdFromEnv();
export const currentCommunityConfig = COMMUNITY_BASE_CONFIG[COMMUNITY_ID];
```

**重要:** コミュニティIDはビルド時に固定され、ランタイムでは変更されない（動的切り替えなし）

---

### A-2. フィーチャーフラグシステム

**定義:**
```typescript
type FeaturesType = "places" | "opportunities" | "points" | "tickets" | ...;

interface CommunityBaseConfig {
  id: string;
  enableFeatures: FeaturesType[];
}
```

**使用パターン:**
```typescript
// 条件付きレンダリング
{currentCommunityConfig.enableFeatures.includes("tickets") && <Component />}

// 404エラー
if (!currentCommunityConfig.enableFeatures.includes("tickets")) {
  notFound();
}
```

---

### A-3. GraphQL クエリの削除方針

#### なぜ tickets フィールドを削除するのか

**理由:**

1. **完全な無効化**
   チケット機能を完全に停止するため、フロントエンドから tickets 関連コードを削除

2. **保守性の向上**
   不要なコードを削除することで、コードベースの保守性を向上

3. **再有効化時の対応**
   将来再有効化する場合は、Git履歴から復元可能

**削除対象:**

1. **GET_WALLETS_WITH_TICKET クエリ**
   - `/src/graphql/account/wallet/query.ts` から完全に削除

2. **tickets フィールド**
   - `GET_USER_FLEXIBLE` の wallets.tickets
   - `GET_USER_WALLET` の wallets.tickets

3. **使用箇所の修正**
   - `useWalletData` は `useGetWalletsQuery` に切り替え
   - tickets は空配列を返すように修正

**Codegen への影響:**
- tickets 削除後、`npm run codegen` で型を再生成
- 既存の `GqlTicket` 型は残る（他の箇所で使用されている可能性）
- `useGetWalletsWithTicketQuery` 型は削除される

---

### A-4. 予約確認画面の構成

**現状:**
`/reservation/confirm/page.tsx` は全体が Client Component ("use client")

**変更方針:**
PaymentSection に明示的なフィーチャーフラグチェックを追加

**理由:**
- より明確な制御
- 将来の仕様変更に対応しやすい
- `maxTickets > 0` だけでは不十分（tickets配列が空でもmaxTicketsが計算される可能性）

**将来の可能性:**
将来的に Server Component 化する可能性がある。その場合、フィーチャーフラグの参照を上位層（page.tsx）で行い、props として渡す構成も検討可能。

---

### A-5. Next.js App Router の構成

**Server Component と Client Component:**

| タイプ | 実行場所 | 特徴 |
|--------|---------|------|
| Server Component | サーバー | ビルド時に `currentCommunityConfig` が評価される |
| Client Component | ブラウザ | "use client" ディレクティブが必要 |

**本プロジェクトの構成:**

| ページ/コンポーネント | タイプ |
|-------------------|--------|
| `/tickets/page.tsx` | Server |
| `/admin/tickets/page.tsx` | Server |
| `/reservation/confirm/page.tsx` | Client |
| `SearchFilters.tsx` | Client |

---

## 付録B: 調査結果とレビュー対応

### B-1. コードベース調査結果

| 項目 | 調査結果 |
|------|---------|
| コミュニティ判定 | 環境変数 `NEXT_PUBLIC_COMMUNITY_ID` で静的決定 |
| currentCommunityConfig | ビルド時に固定、ランタイム変更なし |
| GraphQL クエリ | `GET_WALLETS_WITH_TICKET` で tickets 取得 |
| 予約画面構成 | 全体が Client Component |
| 検索フィルター | 5つのレイヤーで連携 |

### B-2. レビュー指摘への対応

#### 指摘1: currentCommunityConfig の動的性

**指摘内容:** URL/Cookie/ドメインによる動的切り替えの可能性
**調査結果:** ビルド時に固定、動的切り替えなし
**結論:** ✅ この懸念は該当しない

#### 指摘2: Client Component での扱い

**指摘内容:** ビルド時の値が固定される可能性
**調査結果:** NEXT_PUBLIC_ 環境変数はビルド時埋め込み（意図された動作）
**結論:** ✅ 直接 import 可能

#### 指摘3: GraphQL フィールドの最適化

**指摘内容:** tickets フィールド取得の可能性
**調査結果:** `GET_WALLETS_WITH_TICKET` で取得している
**対応方針変更:** ✅ v1.3でスコープ変更、tickets フィールドを削除（付録A-3参照）

#### 指摘4: 検索フィルター実装箇所

**指摘内容:** 該当箇所調査が未完了
**調査結果:** `SearchFilters.tsx` (L94-115) を特定
**結論:** ✅ 実装箇所特定済み

---

## 付録C: システムフロー図

### C-1. チケット発行フロー（現状）

```mermaid
sequenceDiagram
    participant Admin as 管理者
    participant AdminUI as /admin/tickets
    participant GQL as GraphQL API
    participant DB as Database

    Admin->>AdminUI: チケット管理ページを開く
    Admin->>AdminUI: 「新規発行」をクリック
    Admin->>GQL: TICKET_ISSUE mutation
    GQL->>DB: TicketClaimLink作成
    DB-->>GQL: 作成完了
    GQL-->>AdminUI: QRコード表示
```

### C-2. 無効化後のページアクセスフロー

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant NextJS as Next.js Router
    participant FileSystem as File System

    User->>NextJS: /tickets にアクセス
    NextJS->>FileSystem: src/app/tickets/page.tsx を探す
    FileSystem-->>NextJS: ファイルが存在しない
    NextJS->>User: 404 Not Found（自動）
```

### C-3. フィーチャーフラグチェックフロー

```mermaid
graph TD
    A[ビルド時] --> B[NEXT_PUBLIC_COMMUNITY_ID 読み取り]
    B --> C{値は?}
    C -->|neo88/default| D[COMMUNITY_ID 設定]
    C -->|未設定| E[default 使用]
    D --> F[currentCommunityConfig 生成]
    E --> F
    F --> G{tickets 含む?}
    G -->|Yes| H[機能有効]
    G -->|No| I[機能無効]
```

---

## 付録D: 影響を受けるファイル一覧

### D-1. 変更が必要なファイル

**Phase 1:**
- `/src/lib/communities/metadata.ts` (L112, L311-319)

**Phase 2:**
- `/src/app/tickets/` - ディレクトリごと削除（17ファイル）
- `/src/app/admin/tickets/` - ディレクトリごと削除（8ファイル）

**Phase 3:**
- `/src/app/search/components/SearchFilters.tsx` (L94-115)

**Phase 4:**
- `/src/graphql/account/wallet/query.ts` (GET_WALLETS_WITH_TICKET削除)
- `/src/graphql/account/user/query.ts` (tickets削除: L56-58, L115-120)
- `/src/app/reservation/confirm/hooks/useWalletData.ts` (クエリ変更、tickets空配列化)

**Phase 5:**
- `/src/app/reservation/confirm/components/payment/PaymentSection.tsx` (フィーチャーフラグチェック追加)

### D-2. 自動的に影響を受けるファイル（変更不要）

- `/src/components/layout/AdminBottomBar.tsx` (L53-60)
- `/src/app/users/features/profile/components/UserTicketsAndPoints.tsx` (L61-65)
- `/src/app/admin/page.tsx` (L37-42, L76-80)

### D-3. 型生成ファイル（自動更新）

- `/src/types/graphql.tsx` - codegen で自動生成

---

## 付録E: 実装パターン集

### E-1. コード削除方式（v1.5 アプローチ）

**基本方針:**
チケット機能を完全に停止するため、条件分岐ではなくコードそのものを削除する

**理由:**
- フィーチャーフラグが無効 + ディレクトリ削除済み → 条件チェックは冗長
- コードが簡潔になり保守性が向上
- Git履歴で管理するため、再有効化時も復元可能

**例: SearchFilters.tsx**
```typescript
// ❌ v1.4 アプローチ（条件分岐）
const isTicketsEnabled = currentCommunityConfig.enableFeatures.includes("tickets");
{(isTicketsEnabled || usePoints) && <FormField ... />}

// ✅ v1.5 アプローチ（コード削除）
{usePoints && <FormField ... />}
```

**例: PaymentSection.tsx**
```typescript
// ❌ v1.4 アプローチ（条件分岐）
{isTicketsEnabled && maxTickets > 0 && <TicketsToggle ... />}

// ✅ v1.5 アプローチ（コード削除）
// TicketsToggle コンポーネント呼び出し全体を削除
```

---

## 付録F: トラブルシューティング

### F-1. Phase 1 実装後もチケットタブが表示される

**原因:** ビルドキャッシュが残っている

**対処:**
```bash
rm -rf .next
npm run dev
```

### F-2. 404エラーではなく、ページが表示される

**原因:** Phase 2 の実装漏れ（ディレクトリが削除されていない）

**確認:**
```bash
# ディレクトリが存在するか確認
ls src/app/tickets/
ls src/app/admin/tickets/

# 存在する場合は削除
git rm -r src/app/tickets/
git rm -r src/app/admin/tickets/
```

### F-3. Phase 3/5 実装後に TypeScript エラーが発生

**原因:** チケット関連のコードを完全に削除していない（props、state、callbacks等が残っている）

**対処:**
Phase 3, Phase 5 の実装内容を再確認し、すべてのチケット関連コードを削除:
- imports
- interface props
- state variables
- callbacks
- component calls
- 条件分岐

---

## 付録G: 参考リンク

**内部:**
- GraphQLスキーマ: `/src/graphql/reward/`
- コミュニティ設定: `/src/lib/communities/metadata.ts`

**外部:**
- Next.js App Router: https://nextjs.org/docs/app
- Next.js notFound: https://nextjs.org/docs/app/api-reference/functions/not-found
- Apollo Client: https://www.apollographql.com/docs/react/

---

## 付録H: 変更履歴

| バージョン | 日付 | 変更内容 | 作成者 |
|----------|------|---------|--------|
| 1.0 | 2025-12-05 | 初版作成 | Claude |
| 1.1 | 2025-12-05 | レビュー指摘反映（前提条件・調査結果・フロー図追加） | Claude |
| 1.2 | 2025-12-05 | 最終版（本編スリム化、ステークホルダー追加、GraphQL説明強化） | Claude |
| 1.3 | 2025-12-06 | スコープ拡張（GraphQLクエリ削除、PaymentSection修正をIn Scopeに追加、Phase 4/5追加） | Claude |
| 1.4 | 2025-12-06 | Phase 2変更（ページアクセス制御→ディレクトリ削除に変更、よりシンプルで徹底的な実装） | Claude |
| 1.5 | 2025-12-06 | Phase 3/5をコード削除方式に変更（フィーチャーフラグチェック削除、冗長なコード排除、一貫性向上） | Claude |

---

## 承認

| 役割 | 氏名 | 承認日 | 署名 |
|-----|------|--------|------|
| プロダクトオーナー | | | |
| テックリード | | | |
| QAリード | | | |

---

**END OF DOCUMENT**

---

## 📌 実装者へのメッセージ

本要件定義書 Ver1.5 は以下の点を重視して作成しました：

1. **完全な無効化**: ディレクトリ削除+GraphQLクエリ削除+コード削除による徹底的なチケット機能停止
2. **一貫したアプローチ**: Phase 2-5すべてで「削除」方式を採用（条件分岐ではなくコード削除）
3. **シンプルで保守しやすいコード**: 冗長なフィーチャーフラグチェックを排除
4. **段階的実装**: 5つのPhaseに分割し、各Phase独立してロールバック可能
5. **Git履歴による管理**: 削除したコードはGit履歴で管理、将来の再有効化も可能

**重要な実装順序:**
- Phase 1: フィーチャーフラグ無効化（5分）
- Phase 2: ディレクトリ削除（5分）
- Phase 3: SearchFiltersのチケットコード削除（15分）
- Phase 4: GraphQLクエリ削除+codegen（30分）
- Phase 5: PaymentSection/ConfirmPageViewのチケットコード削除（20分）

**v1.5の主な変更点（v1.4からの差分）:**
- Phase 3: `isTicketsEnabled`チェック削除、条件を`usePoints`のみに簡素化
- Phase 5: `isTicketsEnabled`チェック追加 → TicketsToggle完全削除に変更
- 一貫性: すべてのPhaseで「コード削除」方式を採用

**実装のポイント:**
- Phase 2: ディレクトリごと削除（`git rm -r`）、Next.jsが自動404
- Phase 3/5: 条件分岐ではなくコード自体を削除（imports、props、callbacks、component callsすべて）
- TypeScriptエラーが出たら、削除漏れがないか確認

不明点があれば、まず付録Aの技術的前提条件と付録Eの実装パターン集を参照してください。
