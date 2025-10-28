"use client";

import { formatCurrency, getNameFromWallet } from "@/utils/transaction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { GqlTransaction, GqlTransactionReason } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";

interface TransactionCardProps {
  transaction: GqlTransaction;
  image?: string;
}

const DID_ISSUANCE_PENDING_TEXT = "did発行中";

const formatDateTime = (isoString: string | null | undefined): string => {
  if (!isoString) return "日時不明";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "日時不明";

  return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, "0")}月${String(
    date.getDate(),
  ).padStart(2, "0")}日 ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
};

const statusLabel = (reason: GqlTransactionReason) => {
  switch (reason) {
    case GqlTransactionReason.Donation:
      return <span className="text-label-xs font-medium bg-green-100 text-green-700 py-1 px-2 rounded-full">譲渡先</span>;
    case GqlTransactionReason.Grant:
      return <span className="text-label-xs font-medium  py-1 px-2 bg-blue-100 text-blue-700 rounded-full">支給先</span>;
    case GqlTransactionReason.PointReward:
      return <span className="text-label-xs font-medium bg-green-100 text-green-700 py-1 px-2 rounded-full">支払い先</span>;
    case GqlTransactionReason.TicketPurchased:
      return <span className="text-label-xs font-medium bg-green-100 text-green-700 py-1 px-2 rounded-full">支払い先</span>;
    case GqlTransactionReason.TicketRefunded:
      return <span className="text-label-xs font-medium bg-red-100 text-red-700 py-1 px-2 rounded-full">返品先</span>;
    case GqlTransactionReason.OpportunityReservationCreated:
      return <span className="text-label-xs font-medium bg-green-100 text-green-700 py-1 px-2 rounded-full">支払い先</span>;
    case GqlTransactionReason.OpportunityReservationCanceled:
    case GqlTransactionReason.OpportunityReservationRejected:
      return <span className="text-label-xs font-medium bg-red-100 text-red-700 py-1 px-2 rounded-full">払い戻し先</span>;
    default:
      return <span className="text-label-xs font-medium bg-zinc-100 text-zinc-700 py-1 px-2 rounded-full">移動先</span>;
  }
}


const formatTransactionDescription = (reason: GqlTransactionReason, from: string, to: string): { name: string; to: string; action: string } => {
  switch (reason) {
    case GqlTransactionReason.Donation:
      return { name: from, to: to, action: `が譲渡` };
    case GqlTransactionReason.Grant:
      return { name: from, to: to, action: `が支給` };
    case GqlTransactionReason.PointIssued:
      return { name: "発行", to: to, action: "" };
    case GqlTransactionReason.PointReward:
      return { name: from, to: to, action: `が支払い` };
    case GqlTransactionReason.TicketPurchased:
      return { name: from, to: to, action: `が支払い` };
    case GqlTransactionReason.TicketRefunded:
      return { name: from, to: to, action: `が返品` };
    case GqlTransactionReason.Onboarding:
      return { name: "初回ボーナス", to: to, action: "" };
    case GqlTransactionReason.OpportunityReservationCreated:
      return { name: from, to: to, action: `が支払い` };
    case GqlTransactionReason.OpportunityReservationCanceled:
    case GqlTransactionReason.OpportunityReservationRejected:
      return { name: from, to: to, action: `が払い戻し` };
    default:
      return { name: "ポイント移動", to: to, action: "" };
  }
};


// シンプルなトランザクション情報を取得する関数
const getTransactionInfo = (transaction: GqlTransaction) => {
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
    didValue: transaction.toWallet?.user?.didIssuanceRequests?.find(req => req?.status === "COMPLETED")?.didValue ?? DID_ISSUANCE_PENDING_TEXT,
  };
};

export const TransactionCard = ({ transaction, image }: TransactionCardProps) => {
    const info = getTransactionInfo(transaction);
    const { name, action } = formatTransactionDescription(info.reason, info.from, info.to);
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
                    {statusLabel(info.reason)}
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
