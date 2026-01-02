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
  viewMode?: "timeline" | "wallet"; // 表示モード
}

export interface TimelineActionLabelData {
  type: "normal" | "special" | "flow";
  locale: string;
  viewMode?: "timeline" | "wallet";
  // normal の場合
  recipient?: string;
  amount?: string;
  action?: string;
  // special の場合
  text?: string;
  // flow の場合
  name?: string;
  direction?: "outgoing" | "incoming";
  badge?: string;
  note?: string; // オプションの補足情報
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
  viewMode = "timeline",
}: TimelineActionLabelOptions): TimelineActionLabelData => {
  // ポイント発行: 受信フロー
  if (reason === GqlTransactionReason.PointIssued) {
    return {
      type: "flow",
      locale,
      viewMode,
      name: recipientName,
      direction: "incoming",
      badge: amount,
    };
  }

  // 登録ボーナス: 受信フロー
  if (reason === GqlTransactionReason.Onboarding) {
    return {
      type: "flow",
      locale,
      viewMode,
      name: senderName,
      direction: "incoming",
      badge: amount,
      note: t("transactions.timeline.note.onboarding"),
    };
  }

  // ウォレット視点で受信取引の場合
  if (isIncoming) {
    return {
      type: "flow",
      locale,
      viewMode,
      name: senderName,
      direction: "incoming",
      badge: amount,
    };
  }

  // 通常ケース（送信 or グローバル視点）: 送信フロー
  return {
    type: "flow",
    locale,
    viewMode,
    name: recipientName,
    direction: "outgoing",
    badge: amount,
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
