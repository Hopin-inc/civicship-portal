"use client";

import { formatCurrency, getNameFromWallet, mapReasonToAction } from "@/utils/transaction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GqlDidIssuanceStatus, GqlTransaction, GqlTransactionReason } from "@/types/graphql";
import { useTranslations } from "next-intl";
import { useLocaleDateTimeFormat } from "@/utils/i18n";
import { truncateText } from "@/utils/stringUtils";

interface TransactionCardProps {
  transaction: GqlTransaction;
  image?: string;
  perspectiveWalletId?: string;
  showSignedAmount?: boolean;
  showDid?: boolean;
}

const formatTransactionDescription = (
  reason: GqlTransactionReason,
  from: string,
  to: string,
  t: ReturnType<typeof useTranslations>,
): { displayName: string | null; displayAction: string | null; to: string } => {
  const mapping = mapReasonToAction(reason);

  if (mapping.specialName) {
    return {
      displayName: null,
      displayAction: t(`transactions.name.${mapping.specialName}`),
      to: to,
    };
  }

  const actionType = mapping.actionType!;
  return {
    displayName: t(`transactions.parts.action.${actionType}.from.name`, { name: from }),
    displayAction: t(`transactions.parts.action.${actionType}.from.action`),
    to: to,
  };
};

// シンプルなトランザクション情報を取得する関数
const getTransactionInfo = (transaction: GqlTransaction, perspectiveWalletId?: string) => {
  const from = getNameFromWallet(transaction.fromWallet);
  const to = getNameFromWallet(transaction.toWallet);
  const rawAmount = Math.abs(transaction.fromPointChange ?? 0);

  let amount = rawAmount;
  let isPositive = false;
  if (perspectiveWalletId) {
    const isOutgoing = transaction.fromWallet?.id === perspectiveWalletId;
    amount = isOutgoing ? -rawAmount : rawAmount;
    isPositive = amount > 0;
  }

  let didValue: string | null = null;
  if (perspectiveWalletId) {
    const counterpartyWallet =
      transaction.fromWallet?.id === perspectiveWalletId
        ? transaction.toWallet
        : transaction.fromWallet;
    didValue =
      counterpartyWallet?.user?.didIssuanceRequests?.find(
        (req) => req?.status === GqlDidIssuanceStatus.Completed,
      )?.didValue ?? null;
  } else {
    didValue =
      transaction.toWallet?.user?.didIssuanceRequests?.find(
        (req) => req?.status === GqlDidIssuanceStatus.Completed,
      )?.didValue ?? null;
  }

  return {
    from,
    to,
    amount,
    isPositive,
    reason: transaction.reason,
    comment: transaction.comment ?? "",
    transferredAt: transaction.createdAt ? new Date(transaction.createdAt).toISOString() : "",
    didValue,
  };
};

const getStatusLabel = (reason: GqlTransactionReason, t: ReturnType<typeof useTranslations>) => {
  switch (reason) {
    case GqlTransactionReason.Donation:
      return (
        <span className="text-label-xs  text-caption">{t("transactions.status.donation")}:</span>
      );
    case GqlTransactionReason.Grant:
      return <span className="text-label-xs  text-caption">{t("transactions.status.grant")}:</span>;
    case GqlTransactionReason.PointReward:
      return <span className="text-label-xs  text-caption">{t("transactions.status.pay")}:</span>;
    case GqlTransactionReason.TicketPurchased:
      return <span className="text-label-xs  text-caption">{t("transactions.status.pay")}:</span>;
    case GqlTransactionReason.TicketRefunded:
      return (
        <span className="text-label-xs  text-caption">{t("transactions.status.return")}:</span>
      );
    case GqlTransactionReason.OpportunityReservationCreated:
      return <span className="text-label-xs  text-caption">{t("transactions.status.pay")}:</span>;
    case GqlTransactionReason.OpportunityReservationCanceled:
    case GqlTransactionReason.OpportunityReservationRejected:
      return (
        <span className="text-label-xs  text-caption">{t("transactions.status.refund")}:</span>
      );
    default:
      return (
        <span className="text-label-xs  text-caption">{t("transactions.status.default")}:</span>
      );
  }
};

export const TransactionCard = ({
  transaction,
  image,
  perspectiveWalletId,
  showSignedAmount = false,
  showDid = false,
}: TransactionCardProps) => {
  const t = useTranslations();
  const formatDateTime = useLocaleDateTimeFormat();
  const info = getTransactionInfo(transaction, perspectiveWalletId);
  const { displayName, displayAction, to } = formatTransactionDescription(
    info.reason,
    info.from,
    info.to,
    t,
  );
  const statusLabelElement = getStatusLabel(info.reason, t);
  const hasDestination =
    to &&
    info.reason !== GqlTransactionReason.PointIssued &&
    info.reason !== GqlTransactionReason.Onboarding;

  const amountClassName =
    showSignedAmount && info.isPositive
      ? "text-label-sm font-bold shrink-0 ml-2 text-success"
      : "text-label-sm font-bold shrink-0 ml-2 text-foreground";

  const formattedAmount =
    showSignedAmount && info.isPositive
      ? `+${formatCurrency(info.amount)}pt`
      : `${formatCurrency(info.amount)}pt`;

  return (
    <div className="flex items-start gap-3 py-6">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={image} alt="user" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>

      <div className="flex flex-col text-left min-w-0 flex-1 gap-1.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center min-w-0 flex-1 overflow-hidden">
            {displayName && <span className="text-label-sm font-bold truncate">{displayName}</span>}
            {displayAction && (
              <span className="text-label-xs font-bold ml-1 shrink-0">{displayAction}</span>
            )}
          </span>

          <div className={amountClassName}>{formattedAmount}</div>
        </div>

        {hasDestination && (
          <p className="flex items-center gap-1">
            {statusLabelElement}
            <span className="text-label-xs font-medium text-caption truncate">{to}</span>
          </p>
        )}

        {showDid && info.reason !== GqlTransactionReason.PointIssued && info.didValue && (
          <span className="text-label-xs text-caption py-2">
            {truncateText(info.didValue, 20, "middle")}
          </span>
        )}

        {info.comment && (
          <p className="text-label-xs text-foreground leading-relaxed mt-2 whitespace-pre-line break-words">
            {info.comment}
          </p>
        )}

        <span className="text-label-xs text-muted-foreground mt-1 block">
          {formatDateTime(info.transferredAt)}
        </span>
      </div>
    </div>
  );
};
