import { GqlTransaction, GqlTransactionReason } from "@/types/graphql";

/**
 * タイムライン表示用のActionLabelデータ
 * 常にflow形式（矢印/記号 + 名前 + ポイント）で表示
 */
export interface TimelineActionLabelData {
  viewMode: "timeline" | "wallet";
  name: string;
  direction: "outgoing" | "incoming";
  amount: string;
  note?: string;
}

interface TimelineActionLabelOptions {
  reason: GqlTransactionReason;
  recipientName: string;
  senderName: string;
  amount: string;
  isIncoming: boolean;
  viewMode: "timeline" | "wallet";
  onboardingNote?: string;
}

/**
 * タイムライン用のActionLabelデータを生成
 */
export const formatActionLabelForTimeline = ({
  reason,
  recipientName,
  senderName,
  amount,
  isIncoming,
  viewMode,
  onboardingNote,
}: TimelineActionLabelOptions): TimelineActionLabelData => {
  // ポイント発行: 受信フロー
  if (reason === GqlTransactionReason.PointIssued) {
    return {
      viewMode,
      name: recipientName,
      direction: "incoming",
      amount,
    };
  }

  // 登録ボーナス: 受信フロー
  if (reason === GqlTransactionReason.Onboarding) {
    return {
      viewMode,
      name: senderName,
      direction: "incoming",
      amount,
      note: onboardingNote,
    };
  }

  // ウォレット視点で受信取引の場合
  if (isIncoming) {
    return {
      viewMode,
      name: senderName,
      direction: "incoming",
      amount,
    };
  }

  // 通常ケース（送信 or グローバル視点）: 送信フロー
  return {
    viewMode,
    name: recipientName,
    direction: "outgoing",
    amount,
  };
};

/**
 * タイムライン表示用の表示名を決定
 */
export const getTimelineDisplayName = (
  transaction: GqlTransaction,
  fromName: string,
  toName: string,
  perspectiveWalletId?: string
): string => {
  if (perspectiveWalletId) {
    // ウォレット視点: 常に相手（counterparty）の名前を表示
    const isOutgoing = transaction.fromWallet?.id === perspectiveWalletId;
    return isOutgoing ? toName : fromName;
  } else {
    // グローバル視点（/transactions）: 通常は送信者、ポイント発行のみ受信者
    const reason = transaction.reason;
    return reason === GqlTransactionReason.PointIssued ? toName : fromName;
  }
};

/**
 * 受信取引かどうかを判定
 */
export const isIncomingTransaction = (
  transaction: GqlTransaction,
  perspectiveWalletId?: string
): boolean => {
  if (!perspectiveWalletId) {
    return false;
  }
  return transaction.fromWallet?.id !== perspectiveWalletId;
};
