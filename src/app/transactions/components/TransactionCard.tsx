"use client";

import { GqlTransaction } from "@/types/graphql";
import { useTranslations } from "next-intl";
import { useLocaleDateTimeFormat } from "@/utils/i18n";
import {  getTransactionInfo } from "@/shared/transactions/utils/format";
import { computeTransactionHref } from "@/shared/transactions/utils/navigation";
import {
  formatActionLabelForTimeline,
  getTimelineDisplayName,
  isIncomingTransaction,
} from "@/shared/transactions/utils/timelineFormat";
import { formatCurrency } from "@/utils/transaction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TransactionTimelineItem } from "@/shared/transactions/components/timeline/TransactionTimelineItem";
import { TransactionHeader } from "@/shared/transactions/components/timeline/TransactionHeader";
import { TransactionActionLabel } from "@/shared/transactions/components/timeline/TransactionActionLabel";
import { TransactionMessageCard } from "@/shared/transactions/components/timeline/TransactionMessageCard";

interface TransactionCardProps {
  transaction: GqlTransaction;
  image?: string;
  perspectiveWalletId?: string;
  enableClickNavigation?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

/**
 * タイムラインUIのトランザクションカード
 * グローバル視点（/transactions）とウォレット視点（/wallets/me, /admin/wallet）の両方に対応
 */
export const TransactionCard = ({
  transaction,
  image,
  perspectiveWalletId,
  enableClickNavigation = false,
  isFirst = false,
  isLast = false,
}: TransactionCardProps) => {
  const t = useTranslations();
  const formatDateTime = useLocaleDateTimeFormat();
  const info = getTransactionInfo(transaction, perspectiveWalletId);

  // 表示名の決定
  const displayName = getTimelineDisplayName(
    transaction,
    info.from,
    info.to,
    perspectiveWalletId
  );

  // 金額のフォーマット
  const formattedAmount = `${formatCurrency(Math.abs(info.amount))}pt`;

  // ActionLabelデータの生成
  const actionLabelData = formatActionLabelForTimeline({
    reason: info.reason,
    recipientName: info.to,
    senderName: info.from,
    amount: formattedAmount,
    isIncoming: isIncomingTransaction(transaction, perspectiveWalletId),
    viewMode: perspectiveWalletId ? "wallet" : "timeline",
    onboardingNote: t("transactions.timeline.note.onboarding"),
    issuedLabel: t("transactions.timeline.issued"),
  });

  const transactionHref = enableClickNavigation
    ? computeTransactionHref(transaction.id)
    : null;

  return (
    <TransactionTimelineItem
      avatar={
        <Avatar className="h-12 w-12 shrink-0">
          <AvatarImage src={image} alt={displayName} />
          <AvatarFallback>{displayName?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
        </Avatar>
      }
      header={
        <TransactionHeader
          displayName={displayName}
          formattedDateTime={formatDateTime(info.transferredAt)}
        />
      }
      actionLabel={<TransactionActionLabel data={actionLabelData} />}
      messageCard={
        info.comment ? <TransactionMessageCard comment={info.comment} /> : undefined
      }
      profileHref={transactionHref}
      isFirst={isFirst}
      isLast={isLast}
    />
  );
};
