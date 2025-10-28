"use client";

import React from "react";
import { formatCurrency } from "@/utils/transaction";
import { AppTransaction } from "@/app/wallets/features/shared/type";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GqlTransactionReason } from "@/types/graphql";
import { truncateText } from "@/utils/stringUtils";

interface TransactionItemProps {
  transaction: AppTransaction;
  image?: string; // ← 追加
}

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

const formatTransactionDescription = (description: string): { name: string; action: string } => {
  if (!description) return { name: "", action: "" };

  const actions = [
    "に支給",
    "から支給",
    "さんに譲渡",
    "さんから譲渡",
    "さんに支払い",
    "さんから支払い",
    "さんから返品",
    "さんに返品",
  ];

  for (const action of actions) {
    if (description.endsWith(action)) {
      const name = description.replace(action, "");
      return { name, action };
    }
  }

  if (["発行", "初回ボーナス", "ポイント移動", "支払い", "返金"].includes(description)) {
    return { name: description, action: "" };
  }

  return { name: description, action: "" };
};

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, image }) => {
  const isPositive = transaction.transferPoints > 0;
  const { name, action } = formatTransactionDescription(transaction.description);
  return (
    <Card className="px-4 py-4 bg-white">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={image} alt="user" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-left min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <span className="flex items-center truncate whitespace-nowrap overflow-hidden">
              {name && <span className="text-label-sm font-bold">{name}</span>}
              {action && <span className="text-label-xs font-bold">{action}</span>}
            </span>
            {/* 右: 金額 */}
            <div
              className={`text-label-sm font-bold shrink-0 ml-4 ${isPositive ? "text-success" : "text-foreground"}`}
            >
              {isPositive ? "+" : ""}
              {formatCurrency(transaction.transferPoints)} pt
            </div>
          </div>
          {transaction.reason !== GqlTransactionReason.PointIssued && transaction.didValue && (
            <span className="text-label-xs text-caption py-2">
              {truncateText(transaction.didValue, 20, "middle")}
            </span>
          )}
          {transaction.comment && (
            <span className="text-label-xs text-caption bg-background-hover leading-relaxed block p-2 rounded-sm">
              {transaction.comment}
            </span>
          )}
          <span className="text-label-xs text-muted-foreground mt-2 block">
            {formatDateTime(transaction.transferredAt)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default TransactionItem;
