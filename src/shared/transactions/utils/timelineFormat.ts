import { GqlTransactionReason } from "@/types/graphql";

type TransactionActionType = "donation" | "grant" | "payment" | "return" | "refund";

interface TimelineActionLabelOptions {
  reason: GqlTransactionReason;
  recipientName: string;
  senderName: string;
  amount: string;
  locale: string;
  t: (key: string, values?: Record<string, string>) => string;
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
}: TimelineActionLabelOptions): string => {
  // 特殊ケース: ポイント発行、登録ボーナスなど
  if (
    reason === GqlTransactionReason.PointIssued ||
    reason === GqlTransactionReason.Onboarding
  ) {
    const specialNameKey = reason === GqlTransactionReason.PointIssued ? "issued" : "onboarding";
    return t(`transactions.timeline.special.${specialNameKey}`, { amount, community: senderName });
  }

  // 通常ケース
  const actionType = mapReasonToTimelineActionType(reason);

  if (locale === "en") {
    // 英語: "Gifted 3,000pt to 山田太郎"
    return t(`transactions.timeline.action.en`, {
      action: t(`transactions.timeline.actionType.${actionType}`),
      amount,
      recipient: recipientName,
    });
  }

  // 日本語: 「山田太郎に3,000ptを贈りました」
  return t(`transactions.timeline.action.ja`, {
    recipient: recipientName,
    amount,
    action: t(`transactions.timeline.actionType.${actionType}`),
  });
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
