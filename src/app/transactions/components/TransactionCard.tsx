"use client";

import { GqlTransaction } from "@/types/graphql";
import { useTranslations, useLocale } from "next-intl";
import { useLocaleDateTimeFormat } from "@/utils/i18n";
import { getTransactionInfo } from "@/shared/transactions/utils/format";
import { computeProfileHref } from "@/shared/transactions/utils/navigation";
import { formatActionLabelForTimeline } from "@/shared/transactions/utils/timelineFormat";
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

export const TransactionCard = ({
  transaction,
  image,
  perspectiveWalletId,
  enableClickNavigation = false,
  isFirst = false,
  isLast = false,
}: TransactionCardProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const formatDateTime = useLocaleDateTimeFormat();
  const info = getTransactionInfo(transaction, perspectiveWalletId);

  // /transactions では perspectiveWalletId が undefined なので、常に fromUser の視点
  const displayName = info.from;
  const recipientName = info.to;
  const formattedAmount = `${formatCurrency(Math.abs(info.amount))}pt`;

  // ActionLabel の生成
  const actionLabelText = formatActionLabelForTimeline({
    reason: info.reason,
    recipientName,
    amount: formattedAmount,
    locale,
    t,
  });

  const profileHref = enableClickNavigation
    ? computeProfileHref(transaction, { perspectiveWalletId })
    : null;

  // Avatar コンポーネント
  const avatarElement = (
    <Avatar className="h-12 w-12 shrink-0">
      <AvatarImage src={image} alt={displayName} />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  );

  // Header コンポーネント
  const headerElement = (
    <TransactionHeader
      displayName={displayName}
      formattedDateTime={formatDateTime(info.transferredAt)}
    />
  );

  // ActionLabel コンポーネント
  const actionLabelElement = (
    <TransactionActionLabel text={actionLabelText} />
  );

  // MessageCard コンポーネント（コメントがある場合のみ）
  const messageCardElement = info.comment ? (
    <TransactionMessageCard comment={info.comment} />
  ) : undefined;

  return (
    <TransactionTimelineItem
      avatar={avatarElement}
      header={headerElement}
      actionLabel={actionLabelElement}
      messageCard={messageCardElement}
      profileHref={profileHref}
      isFirst={isFirst}
      isLast={isLast}
    />
  );
};
