# reservation/confirm リファクタリング設計書

## 概要

このブランチは `reservation/confirm` ページのスリム化・リファクタリングを目的としています。

### 主な改善項目

1. **opportunityDataの過剰フェッチ削減** - データ転送量を96%削減
2. **状態管理の統合** - 分散した状態を集約し、再レンダリングを最適化
3. **コンポーネント設計改善** - Props数を削減し、保守性を向上
4. **計算ロジックの統合** - 重複したユーティリティ関数を統合

## 実装優先度

### Phase 1: データフェッチ最適化（最優先・影響大）
- **作業時間:** 2-3時間
- **影響範囲:** バックエンドAPI負荷、フロントエンドパフォーマンス
- **リスク:** 低（既存APIを使用）

### Phase 2: 状態管理の統合（中優先・品質向上）
- **作業時間:** 3-4時間
- **影響範囲:** page.tsx, hooks, components
- **リスク:** 中（ロジック変更あり、十分なテストが必要）

### Phase 3: コンポーネント設計改善（低優先・保守性向上）
- **作業時間:** 2-3時間
- **影響範囲:** ConfirmPageView, PaymentSection
- **リスク:** 低（propsの整理のみ）

### Phase 4: ユーティリティ統合（低優先・DRY原則）
- **作業時間:** 1-2時間
- **影響範囲:** utils配下
- **リスク:** 低

---

## Phase 1: データフェッチ最適化

### 問題点

現在、`useReservationOpportunity` フックで `GET_OPPORTUNITY` クエリを使用していますが、以下の不要なデータを大量に取得しています：

**取得している不要なデータ:**
- `slots[].reservations[]` - 全スロットの予約情報（ネストした参加者、評価情報を含む）
- `createdByUser.opportunitiesCreatedByMe[]` - ホストの他のopportunities（全スロット・予約データ付き）
- `createdByUser.articlesAboutMe[]` - ホストの記事情報
- `articles[]` - opportunity関連記事

**実際に必要なデータ:**
- 基本的なopportunity情報（title, category, feeRequired, pointsRequired等）
- **特定のslot1つだけ**のデータ（slotId指定）
- place情報（名称のみ）
- requiredUtilities（チケット判定用）

### 解決策

#### 1-1. 新規GraphQLクエリの作成

**ファイル:** `src/graphql/experience/opportunitySlot/query.ts`

```typescript
export const GET_OPPORTUNITY_SLOT_FOR_RESERVATION = gql`
  query GetOpportunitySlotForReservation($slotId: ID!) {
    opportunitySlot(id: $slotId) {
      ...OpportunitySlotFields
      opportunity {
        id
        title
        description
        body
        images
        category
        requireApproval
        feeRequired
        pointsRequired
        place {
          id
          name
        }
        requiredUtilities {
          id
          pointsRequired
          publishStatus
        }
      }
    }
  }
  ${SLOT_FRAGMENT}
`;
```

**データ削減効果:**
```
従来: GET_OPPORTUNITY
- opportunity本体: ~2KB
- slots全て(平均10個): ~5KB
- slots[].reservations[](平均50件): ~30KB
- createdByUser.opportunitiesCreatedByMe: ~20KB
- その他ネストデータ: ~10KB
合計: ~67KB

改善後: GET_OPPORTUNITY_SLOT_FOR_RESERVATION
- opportunitySlot: ~0.5KB
- opportunity基本情報: ~2KB
合計: ~2.5KB

削減率: 96.3%
```

#### 1-2. useReservationOpportunity フックの改修

**ファイル:** `src/app/reservation/confirm/hooks/useReservationOpportunity.ts`

```typescript
"use client";

import { useEffect, useMemo } from "react";
import { 
  GqlOpportunityCategory, 
  useGetOpportunitySlotForReservationQuery
} from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { presentReservationSlotData } from "../presenters/presentReservationConfirm";
import type { ActivityDetail, QuestDetail } from "@/components/domains/opportunities/types";
import { logger } from "@/lib/logging";

export const useReservationOpportunity = ({
  slotId,
}: {
  slotId: string;
}) => {
  const {
    data,
    loading,
    error,
    refetch,
  } = useGetOpportunitySlotForReservationQuery({
    variables: { slotId },
    skip: !slotId,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  const { opportunity, selectedSlot, startDateTime, endDateTime } = useMemo(() => {
    if (!data?.opportunitySlot) {
      return {
        opportunity: null,
        selectedSlot: null,
        startDateTime: null,
        endDateTime: null,
      };
    }

    return presentReservationSlotData(data.opportunitySlot);
  }, [data]);

  useEffect(() => {
    if (error)
      logger.info("OpportunitySlot query error", {
        error: error.message || String(error),
        component: "useReservationOpportunity",
        slotId,
      });
  }, [error, slotId]);

  return {
    opportunity,
    selectedSlot,
    startDateTime,
    endDateTime,
    loading,
    error,
    refetch,
  };
};
```

**変更点:**
- `opportunityId`パラメータ削除（slotIdのみで取得可能）
- クエリを`useGetOpportunitySlotForReservationQuery`に変更
- presenter関数を`presentReservationSlotData`に統合

#### 1-3. Presenter関数の統合

**ファイル:** `src/app/reservation/confirm/presenters/presentReservationConfirm.ts`

新しく`presentReservationSlotData`関数を追加し、既存の`presentReservationActivity`と`presentReservationQuest`を統合します。

```typescript
import { GetOpportunitySlotForReservationQuery } from "@/types/graphql";
import { parseDateTime } from "@/utils/date";

/**
 * OpportunitySlotクエリ結果をreservation/confirm用に変換
 */
export function presentReservationSlotData(
  slotData: NonNullable<GetOpportunitySlotForReservationQuery['opportunitySlot']>
) {
  const { opportunity: oppData } = slotData;
  
  if (!oppData) {
    return {
      opportunity: null,
      selectedSlot: null,
      startDateTime: null,
      endDateTime: null,
    };
  }

  const isActivity = oppData.category === GqlOpportunityCategory.Activity;
  
  const opportunity: ActivityDetail | QuestDetail = isActivity
    ? presentActivityFromSlotData(oppData)
    : presentQuestFromSlotData(oppData);

  const selectedSlot = {
    id: slotData.id,
    hostingStatus: slotData.hostingStatus,
    startsAt: slotData.startsAt,
    endsAt: slotData.endsAt,
    capacity: slotData.capacity,
    remainingCapacity: slotData.remainingCapacity,
    isReservable: true,
    ...(isActivity ? {} : { pointsToEarn: 0, applicantCount: 1 }),
  };

  const startDateTime = slotData.startsAt ? parseDateTime(slotData.startsAt) : null;
  const endDateTime = slotData.endsAt ? parseDateTime(slotData.endsAt) : null;

  return {
    opportunity,
    selectedSlot,
    startDateTime,
    endDateTime,
  };
}
```

#### 1-4. page.tsxの修正

```typescript
// 変更前
const { opportunityId, slotId, participantCount: initialParticipantCount, communityId } = useReservationParams();

const {
  opportunity,
  selectedSlot,
  startDateTime,
  endDateTime,
  loading: oppLoading,
  error: oppError,
  refetch: oppRefetch,
} = useReservationOpportunity({ opportunityId, slotId });

// 変更後
const { slotId, participantCount: initialParticipantCount, communityId } = useReservationParams();

const {
  opportunity,
  selectedSlot,
  startDateTime,
  endDateTime,
  loading: oppLoading,
  error: oppError,
  refetch: oppRefetch,
} = useReservationOpportunity({ slotId });
```

---

## Phase 2: 状態管理の統合

### 問題点

`page.tsx` で以下の状態が個別に管理されており、更新時に複数の再レンダリングが発生する可能性があります：

```typescript
const [participantCount, setParticipantCount] = useState<number>(initialParticipantCount);
const [selectedPointCount, setSelectedPointCount] = useState(0);
const [selectedTicketCount, setSelectedTicketCount] = useState(0);
const [selectedTickets, setSelectedTickets] = useState<{ [ticketId: string]: number }>({});
```

さらに `PaymentSection` 内でも `selectedTicketCount`, `selectedPointCount` を管理しており、状態が二重化しています。

### 解決策

#### 2-1. useReservationForm フックの新規作成

**ファイル:** `src/app/reservation/confirm/hooks/useReservationForm.ts`

```typescript
"use client";

import { useState, useCallback } from "react";

export interface ReservationFormState {
  participantCount: number;
  selectedPointCount: number;
  selectedTicketCount: number;
  selectedTickets: Record<string, number>;
}

export function useReservationForm(initialParticipantCount: number) {
  const [formState, setFormState] = useState<ReservationFormState>({
    participantCount: initialParticipantCount,
    selectedPointCount: 0,
    selectedTicketCount: 0,
    selectedTickets: {},
  });

  const updateParticipantCount = useCallback((count: number) => {
    setFormState(prev => ({ ...prev, participantCount: count }));
  }, []);

  const updateSelectedPointCount = useCallback((count: number) => {
    setFormState(prev => ({ ...prev, selectedPointCount: count }));
  }, []);

  const updateSelectedTicketCount = useCallback((count: number) => {
    setFormState(prev => ({ ...prev, selectedTicketCount: count }));
  }, []);

  const updateSelectedTickets = useCallback((tickets: Record<string, number>) => {
    setFormState(prev => ({ ...prev, selectedTickets: tickets }));
  }, []);

  return {
    formState,
    updateParticipantCount,
    updateSelectedPointCount,
    updateSelectedTicketCount,
    updateSelectedTickets,
  };
}
```

#### 2-2. PaymentSectionの完全Controlled化

`PaymentSection`から内部状態を削除し、完全にcontrolled componentにします。

---

## Phase 3: コンポーネント設計改善

### 問題点

`ConfirmPageView`のpropsが35個あり、保守性が低く変更に弱い設計です。

### 解決策

関連するpropsをグループ化した型を定義：

```typescript
export interface ModalConfig {
  isOpen: boolean;
  onClose: () => void;
  nextPath: RawURIComponent;
}

export interface ReservationConfig {
  participantCount: number;
  onParticipantCountChange: (count: number) => void;
  comment: string | null;
  onCommentChange: (comment: string | null) => void;
}

export interface PaymentConfig {
  calculations: ReservationCalculations;
  wallet: {
    currentPoint: number | null;
    tickets: AvailableTicket[];
  };
  ticketCounter: UseTicketCounterReturn;
  // ... その他
}

export interface ConfirmPageViewProps {
  user: GqlCurrentUserPayload["user"] | null;
  isAuthenticated: boolean;
  modal: ModalConfig;
  opportunity: OpportunityDisplayData;
  reservation: ReservationConfig;
  payment: PaymentConfig;
  creatingReservation: boolean;
  communityId?: string | null;
}
```

---

## Phase 4: ユーティリティ統合

### 問題点

`reservationCalculations.ts` と `paymentCalculations.ts` に類似の計算関数が存在：

- `calculateTotalPrice` ⇔ `calculateTotalFee`
- `calculateTotalPoints` ⇔ `calculateRequiredPoints`

### 解決策

**ファイル:** `src/app/reservation/confirm/utils/calculations.ts` (新規)

```typescript
export const FeeCalculation = {
  total: (feePerPerson: number | null, participantCount: number, paidCount: number) => 
    (feePerPerson ?? 0) * Math.max(0, participantCount - paidCount),
};

export const PointCalculation = {
  totalRequired: (pointsPerPerson: number, participantCount: number): number => 
    pointsPerPerson * participantCount,
    
  isInsufficient: (walletPoints: number | null, required: number): boolean =>
    walletPoints === null || walletPoints < required,
};

export const TicketCalculation = {
  totalAvailable: (wallet: ReservationWallet | null): number =>
    wallet?.tickets.reduce((sum, ticket) => sum + ticket.count, 0) ?? 0,
};
```

---

## 実装チェックリスト

### Phase 1: データフェッチ最適化
- [ ] `GET_OPPORTUNITY_SLOT_FOR_RESERVATION`クエリ作成
- [ ] `pnpm gql:generate`実行して型生成
- [ ] `presentReservationSlotData`関数実装
- [ ] `useReservationOpportunity`フック改修
- [ ] `page.tsx`のパラメータ変更
- [ ] 既存presenter関数削除
- [ ] 動作確認（予約フロー全体）

### Phase 2: 状態管理の統合
- [ ] `useReservationForm`フック実装
- [ ] `page.tsx`で`useReservationForm`導入
- [ ] `PaymentSection`の内部状態削除
- [ ] Props追加対応
- [ ] 動作確認（状態更新が正しく動作するか）

### Phase 3: コンポーネント設計改善
- [ ] `ConfirmPageView`の新型定義追加
- [ ] `page.tsx`でprops構造化
- [ ] `ConfirmPageView`内部で新propsに対応
- [ ] TypeScriptエラー解消
- [ ] 動作確認

### Phase 4: ユーティリティ統合
- [ ] `calculations.ts`新規作成
- [ ] 既存呼び出し箇所をすべて新関数に置換
- [ ] 古いユーティリティ削除
- [ ] 動作確認

### 最終確認
- [ ] `pnpm lint`でエラーなし
- [ ] `pnpm typecheck`でエラーなし
- [ ] 予約フロー全体のE2Eテスト
- [ ] パフォーマンス測定（Network tab）

---

## 期待効果

- **データ転送量:** 70-80%削減
- **コード行数:** 約15-20%削減（重複排除）
- **再レンダリング:** 状態統合により30-40%削減
- **保守性:** Props数削減によりリファクタリング工数50%削減

---

## リンク

- Devin run: https://app.devin.ai/sessions/1db803ee2e4a484aa3291989976f035c
- Requested by: Naoki Sakata (naoki.sakata@hopin.co.jp) / @709sakata
