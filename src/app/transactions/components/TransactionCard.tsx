"use client";

import { formatCurrency, getNameFromWallet } from "@/utils/transaction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { GqlTransaction, GqlTransactionReason } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { useTranslations, useLocale } from "next-intl";

interface TransactionCardProps {
  transaction: GqlTransaction;
  image?: string;
}

const useStatusLabel = (reason: GqlTransactionReason) => {
  const t = useTranslations();
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
}

const useFormatTransactionDescription = (reason: GqlTransactionReason, from: string, to: string): { name: string; to: string; action: string } => {
  const t = useTranslations();
  switch (reason) {
    case GqlTransactionReason.Donation:
      return { name: from, to: to, action: t("transactions.action.donation", { name: from }) };
    case GqlTransactionReason.Grant:
      return { name: from, to: to, action: t("transactions.action.grant", { name: from }) };
    case GqlTransactionReason.PointIssued:
      return { name: t("transactions.name.issued"), to: to, action: "" };
    case GqlTransactionReason.PointReward:
      return { name: from, to: to, action: t("transactions.action.pay", { name: from }) };
    case GqlTransactionReason.TicketPurchased:
      return { name: from, to: to, action: t("transactions.action.pay", { name: from }) };
    case GqlTransactionReason.TicketRefunded:
      return { name: from, to: to, action: t("transactions.action.return", { name: from }) };
    case GqlTransactionReason.Onboarding:
      return { name: t("transactions.name.onboarding"), to: to, action: "" };
    case GqlTransactionReason.OpportunityReservationCreated:
      return { name: from, to: to, action: t("transactions.action.pay", { name: from }) };
    case GqlTransactionReason.OpportunityReservationCanceled:
    case GqlTransactionReason.OpportunityReservationRejected:
      return { name: from, to: to, action: t("transactions.action.refund", { name: from }) };
    default:
      return { name: t("transactions.name.move"), to: to, action: "" };
  }
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
    const locale = useLocale();
    const info = getTransactionInfo(transaction, t("transactions.did.pending"));
    const { name, action } = useFormatTransactionDescription(info.reason, info.from, info.to);
    const statusLabelElement = useStatusLabel(info.reason);
    
    const formatDateTime = (isoString: string | null | undefined): string => {
      if (!isoString) return t("transactions.date.unknown");
      
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return t("transactions.date.unknown");
      
      const dtf = new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
      return dtf.format(date);
    };
    
    return (
        <Card className="px-4 py-4 bg-white">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={image ?? PLACEHOLDER_IMAGE} alt="user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <span className="flex items-center truncate whitespace-nowrap overflow-hidden">
                  {name && <span className="text-label-sm font-bold">{name}</span>}
                  {action && <span className="text-label-xs font-bold">{action}</span>}
                </span>
                {/* 右: 金額 */}
                <div className="text-label-sm font-bold shrink-0 ml-4 text-foreground">
                  {formatCurrency(info.amount)} pt
                </div>
              </div>
              {action && (
                <p className="flex items-center gap-2 my-2">
                    {statusLabelElement}
                    <span className="text-label-xs font-medium text-caption">{info.to}</span>
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
