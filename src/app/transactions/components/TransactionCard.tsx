"use client";

import { formatCurrency, getNameFromWallet, mapReasonToAction } from "@/utils/transaction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GqlTransaction, GqlTransactionReason } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { useTranslations } from "next-intl";
import { useLocaleDateTimeFormat } from "@/utils/i18n";

interface TransactionCardProps {
  transaction: GqlTransaction;
  image?: string;
}

const getStatusLabelText = (
  reason: GqlTransactionReason,
  t: ReturnType<typeof useTranslations>,
) => {
  switch (reason) {
    case GqlTransactionReason.Donation:
      return t("transactions.status.donation");
    case GqlTransactionReason.Grant:
      return t("transactions.status.grant");
    case GqlTransactionReason.PointReward:
    case GqlTransactionReason.TicketPurchased:
    case GqlTransactionReason.OpportunityReservationCreated:
      return t("transactions.status.pay");
    case GqlTransactionReason.TicketRefunded:
      return t("transactions.status.return");
    case GqlTransactionReason.OpportunityReservationCanceled:
    case GqlTransactionReason.OpportunityReservationRejected:
      return t("transactions.status.refund");
    default:
      return t("transactions.status.default");
  }
};

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
const getTransactionInfo = (transaction: GqlTransaction, didPendingText: string) => {
  const from = getNameFromWallet(transaction.fromWallet);
  const to = getNameFromWallet(transaction.toWallet);
  const amount = Math.abs(transaction.fromPointChange ?? 0);

  return {
    from,
    to,
    amount,
    reason: transaction.reason,
    comment: transaction.comment ?? "",
    transferredAt: transaction.createdAt ? new Date(transaction.createdAt).toISOString() : "",
    didValue:
      transaction.toWallet?.user?.didIssuanceRequests?.find((req) => req?.status === "COMPLETED")
        ?.didValue ?? didPendingText,
  };
};

export const TransactionCard = ({ transaction, image }: TransactionCardProps) => {
  const t = useTranslations();
  const formatDateTime = useLocaleDateTimeFormat();
  const info = getTransactionInfo(transaction, t("transactions.did.pending"));
  const { displayName, displayAction, to } = formatTransactionDescription(
    info.reason,
    info.from,
    info.to,
    t,
  );
  const statusLabelElement = getStatusLabelText(info.reason, t);
  const hasDestination =
    to &&
    info.reason !== GqlTransactionReason.PointIssued &&
    info.reason !== GqlTransactionReason.Onboarding;

  return (
    <div className="flex items-start gap-3 py-6">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={image ?? PLACEHOLDER_IMAGE} alt="user" />
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

          <div className="text-label-sm font-bold shrink-0 ml-2 text-foreground">
            {formatCurrency(info.amount)}pt
          </div>
        </div>

        {hasDestination && (
          <p className="flex items-center gap-0.5 mt-1 text-label-xs text-muted-foreground">
            <span className="truncate">{statusLabelElement}</span>
            <span className="text-label-xs font-medium text-caption truncate">{to}</span>
          </p>
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
