"use client";

import { GqlTransaction } from "@/types/graphql";
import { useTranslations, useLocale } from "next-intl";
import { useLocaleDateTimeFormat } from "@/utils/i18n";
import { TransactionCardBase } from "@/shared/transactions/components/TransactionCardBase";
import { formatTransactionDescription, getTransactionInfo } from "@/shared/transactions/utils/format";
import { computeProfileHref } from "@/shared/transactions/utils/navigation";
import { getStatusLabel } from "@/shared/transactions/utils/statusLabel";
import { computeCardProps } from "@/shared/transactions/utils/cardProps";

interface TransactionCardProps {
  transaction: GqlTransaction;
  image?: string;
  perspectiveWalletId?: string;
  showSignedAmount?: boolean;
  showDid?: boolean;
  useReceivedPhrasing?: boolean;
  enableClickNavigation?: boolean;
}

export const TransactionCard = ({
  transaction,
  image,
  perspectiveWalletId,
  showSignedAmount = false,
  showDid = false,
  useReceivedPhrasing = false,
  enableClickNavigation = false,
}: TransactionCardProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const formatDateTime = useLocaleDateTimeFormat();
  const info = getTransactionInfo(transaction, perspectiveWalletId);
  
  const { displayName, displayAction, to } = formatTransactionDescription(
    info.reason,
    info.from,
    info.to,
    t,
    {
      transaction,
      perspectiveWalletId,
      useReceivedPhrasing,
      locale,
    },
  );

  const statusLabelElement = getStatusLabel(info.reason, t);
  
  const { hasDestination, amountClassName, formattedAmount, truncatedDidValue } = computeCardProps({
    transaction,
    perspectiveWalletId,
    showSignedAmount,
    showDid,
    info,
    to,
  });

  const profileHref = enableClickNavigation
    ? computeProfileHref(transaction, { perspectiveWalletId })
    : null;

  return (
    <TransactionCardBase
      image={image}
      displayName={displayName}
      displayAction={displayAction}
      amount={formattedAmount}
      amountClassName={amountClassName}
      statusLabel={statusLabelElement}
      hasDestination={hasDestination}
      destinationName={to}
      didValue={truncatedDidValue}
      comment={info.comment}
      formattedDateTime={formatDateTime(info.transferredAt)}
      profileHref={profileHref}
    />
  );
};
