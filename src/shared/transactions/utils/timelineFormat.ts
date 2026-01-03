import { GqlTransaction, GqlTransactionReason } from "@/types/graphql";

/**
 * タイムライン表示用のActionLabelデータ
 * 通常: flow形式（矢印/記号 + 名前 + ポイント）
 * ポイント発行: シンプル形式（ポイント + 発行）
 */
export interface TimelineActionLabelData {
  viewMode: "timeline" | "wallet";
  name?: string;
  direction: "outgoing" | "incoming";
  amount: string;
  note?: string;
  isPointIssued?: boolean;
  issuedLabel?: string;
}

interface TimelineActionLabelOptions {
  reason: GqlTransactionReason;
  recipientName: string;
  senderName: string;
  amount: string;
  isIncoming: boolean;
  viewMode: "timeline" | "wallet";
  onboardingNote?: string;
  issuedLabel?: string;
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
  issuedLabel,
}: TimelineActionLabelOptions): TimelineActionLabelData => {
  // ポイント発行: シンプル表示（タイムライン視点のみ）
  if (reason === GqlTransactionReason.PointIssued && viewMode === "timeline") {
    return {
      viewMode,
      direction: "incoming",
      amount,
      isPointIssued: true,
      issuedLabel,
    };
  }

  // ポイント発行: ウォレット視点では通常のフロー
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
  const reason = transaction.reason;

  if (perspectiveWalletId) {
    // ポイント発行 & ウォレット視点の特殊ケース
    // fromWallet=null, toWallet=community なので toName にコミュニティ名が入っている
    if (reason === GqlTransactionReason.PointIssued) {
      return toName;
    }

    // 通常ケース: 相手（counterparty）の名前を表示
    const isOutgoing = transaction.fromWallet?.id === perspectiveWalletId;
    return isOutgoing ? toName : fromName;
  } else {
    // グローバル視点（/transactions）: 通常は送信者、ポイント発行のみ受信者
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
