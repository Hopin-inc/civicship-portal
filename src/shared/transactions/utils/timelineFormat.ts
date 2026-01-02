import { GqlTransactionReason } from "@/types/graphql";

type TransactionActionType = "donation" | "grant" | "payment" | "return" | "refund";

interface TimelineActionLabelOptions {
  reason: GqlTransactionReason;
  recipientName: string;
  senderName: string;
  amount: string;
  locale: string;
  t: (key: string, values?: Record<string, string>) => string;
  isIncoming?: boolean; // ウォレット視点で受信取引かどうか
}

export interface TimelineActionLabelData {
  type: "normal" | "special";
  locale: string;
  // normal の場合
  recipient?: string;
  amount?: string;
  action?: string;
  // special の場合
  text?: string;
}

/**
 * タイムライン用のActionLabel生成
 *
 * 例: 「山田太郎に3,000ptを贈りました」
 *
 * 制約:
 * - 主語（送信者名）を含めない（Header側で表示済み）
 * - 時刻を含めない（Header側で表示済み）
 * - recipient（相手）を主役にする
 */
export const formatActionLabelForTimeline = ({
  reason,
  recipientName,
  senderName,
  amount,
  locale,
  t,
  isIncoming = false,
}: TimelineActionLabelOptions): TimelineActionLabelData => {
  // 特殊ケース: ポイント発行、登録ボーナスなど
  if (
    reason === GqlTransactionReason.PointIssued ||
    reason === GqlTransactionReason.Onboarding
  ) {
    const specialNameKey = reason === GqlTransactionReason.PointIssued ? "issued" : "onboarding";
    return {
      type: "special",
      locale,
      text: t(`transactions.timeline.special.${specialNameKey}`, { amount, community: senderName }),
    };
  }

  // ウォレット視点で受信取引の場合
  if (isIncoming) {
    return {
      type: "special",
      locale,
      text: t(`transactions.timeline.received`, { amount, sender: senderName }),
    };
  }

  // 通常ケース（送信 or グローバル視点）
  const actionType = mapReasonToTimelineActionType(reason);

  return {
    type: "normal",
    locale,
    recipient: recipientName,
    amount,
    action: t(`transactions.timeline.actionType.${actionType}`),
  };
};

/**
 * GqlTransactionReason を timeline用の actionType にマッピング
 */
const mapReasonToTimelineActionType = (reason: GqlTransactionReason): TransactionActionType => {
  switch (reason) {
    case GqlTransactionReason.Donation:
      return "donation";
    case GqlTransactionReason.Grant:
      return "grant";
    case GqlTransactionReason.PointReward:
    case GqlTransactionReason.TicketPurchased:
    case GqlTransactionReason.OpportunityReservationCreated:
      return "payment";
    case GqlTransactionReason.TicketRefunded:
      return "return";
    case GqlTransactionReason.OpportunityReservationCanceled:
    case GqlTransactionReason.OpportunityReservationRejected:
      return "refund";
    default:
      return "donation"; // デフォルトは donation として扱う
  }
};
