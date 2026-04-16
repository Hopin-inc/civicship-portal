"use client";

import { GqlTransaction } from "@/types/graphql";
import { useTranslations } from "next-intl";
import { useLocaleDateTimeFormat } from "@/utils/i18n";
import {  getTransactionInfo } from "@/shared/transactions/utils/format";
import { computeTransactionHref } from "@/shared/transactions/utils/navigation";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
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
import { ChainDepthBadge } from "@/shared/transactions/components/timeline/ChainDepthBadge";
import { TransactionMessageCard } from "@/shared/transactions/components/timeline/TransactionMessageCard";
import { TransactionImageGrid } from "@/app/community/[communityId]/transactions/components/TransactionImageGrid";

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
  const communityConfig = useCommunityConfig();
  const communityTitle = communityConfig?.title ?? "";
  const info = getTransactionInfo(transaction, perspectiveWalletId, communityTitle);

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

  const images = transaction.images ?? [];

  const messageCard =
    info.comment || images.length > 0 ? (
      <div>
        {info.comment && <TransactionMessageCard comment={info.comment} />}
        {images.length > 0 && (
          <div className={info.comment ? "mt-2" : ""}>
            <TransactionImageGrid images={images} />
          </div>
        )}
      </div>
    ) : undefined;

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
      actionLabel={
        <div className="flex items-center gap-1.5 min-w-0">
          <TransactionActionLabel data={actionLabelData} />
          <ChainDepthBadge depth={transaction.chainDepth} />
        </div>
      }
      messageCard={messageCard}
      href={transactionHref}
      isFirst={isFirst}
      isLast={isLast}
    />
  );
};
