"use client";

import { formatCurrency, getNameFromWallet, mapReasonToAction } from "@/utils/transaction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { GqlTransaction, GqlTransactionReason } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { useTranslations } from "next-intl";
import { useLocaleDateTimeFormat } from "@/utils/i18n";

interface TransactionCardProps {
  transaction: GqlTransaction;
  image?: string;
}

const getStatusLabel = (reason: GqlTransactionReason, t: ReturnType<typeof useTranslations>) => {
  switch (reason) {
    case GqlTransactionReason.Donation:
      return <span className="text-label-xs font-medium bg-green-100 text-green-700 py-1 px-2 rounded-full">{t("transactions.status.donation")}</span>;
    case GqlTransactionReason.Grant:
      return <span className="text-label-xs font-medium  py-1 px-2 bg-blue-100 text-blue-700 rounded-full">{t("transactions.status.grant")}</span>;
    case GqlTransactionReason.PointReward:
      return <span className="text-label-xs font-medium bg-green-100 text-green-700 py-1 px-2 rounded-full">{t("transactions.status.pay")}</span>;
    case GqlTransactionReason.TicketPurchased:
      return <span className="text-label-xs font-medium bg-green-100 text-green-700 py-1 px-2 rounded-full">{t("transactions.status.pay")}</span>;
    case GqlTransactionReason.TicketRefunded:
      return <span className="text-label-xs font-medium bg-red-100 text-red-700 py-1 px-2 rounded-full">{t("transactions.status.return")}</span>;
    case GqlTransactionReason.OpportunityReservationCreated:
      return <span className="text-label-xs font-medium bg-green-100 text-green-700 py-1 px-2 rounded-full">{t("transactions.status.pay")}</span>;
    case GqlTransactionReason.OpportunityReservationCanceled:
    case GqlTransactionReason.OpportunityReservationRejected:
      return <span className="text-label-xs font-medium bg-red-100 text-red-700 py-1 px-2 rounded-full">{t("transactions.status.refund")}</span>;
    default:
      return <span className="text-label-xs font-medium bg-zinc-100 text-zinc-700 py-1 px-2 rounded-full">{t("transactions.status.default")}</span>;
  }
};

const formatTransactionDescription = (
  reason: GqlTransactionReason,
  from: string,
  to: string,
  t: ReturnType<typeof useTranslations>
): { displayText: string; to: string } => {
  const mapping = mapReasonToAction(reason);

  if (mapping.specialName) {
    return { displayText: t(`transactions.name.${mapping.specialName}`), to: to };
  }

  const actionType = mapping.actionType!;
  return { displayText: t(`transactions.action.${actionType}.from`, { name: from }), to: to };
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
    didValue: transaction.toWallet?.user?.didIssuanceRequests?.find(req => req?.status === "COMPLETED")?.didValue ?? didPendingText,
  };
};

export const TransactionCard = ({ transaction, image }: TransactionCardProps) => {
    const t = useTranslations();
    const formatDateTime = useLocaleDateTimeFormat();
    const info = getTransactionInfo(transaction, t("transactions.did.pending"));
    const { displayText, to } = formatTransactionDescription(info.reason, info.from, info.to, t);
    const statusLabelElement = getStatusLabel(info.reason, t);
    const hasDestination = to && info.reason !== GqlTransactionReason.PointIssued && info.reason !== GqlTransactionReason.Onboarding;
    
    return (
        <Card className="px-4 py-4 bg-white">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={image ?? PLACEHOLDER_IMAGE} alt="user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <span className="flex items-center truncate whitespace-nowrap overflow-hidden text-label-sm font-bold">
                  {displayText}
                </span>
                <div className="text-label-sm font-bold shrink-0 ml-4 text-foreground">
                  {formatCurrency(info.amount)} pt
                </div>
              </div>
              {hasDestination && (
                <p className="flex items-center gap-2 my-2">
                    {statusLabelElement}
                    <span className="text-label-xs font-medium text-caption">{to}</span>
                </p>
              )}
              {info.comment && (
                <span className="text-label-xs text-caption bg-background-hover leading-relaxed block p-2 rounded-sm">
                  {info.comment}
                </span>
              )}
              <span className="text-label-xs text-muted-foreground mt-2 block">
                {formatDateTime(info.transferredAt)}
              </span>
            </div>
          </div>
        </Card>
      );
};
