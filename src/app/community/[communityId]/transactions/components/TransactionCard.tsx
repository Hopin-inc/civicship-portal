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
          <div className={`flex gap-1.5 flex-wrap ${info.comment ? "mt-2" : ""}`}>
            {images.slice(0, 4).map((url, i) => (
              <div key={i} className="relative w-14 h-14 shrink-0 overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
                {i === 3 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">+{images.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
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
      actionLabel={<TransactionActionLabel data={actionLabelData} />}
      messageCard={messageCard}
      href={transactionHref}
      isFirst={isFirst}
      isLast={isLast}
    />
  );
};
