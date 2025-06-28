"use client";

import React from "react";
import { formatCurrency } from "@/app/wallets/data/presenter";
import { AppTransaction } from "@/app/wallets/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, image }) => {
  const isPositive = transaction.transferPoints > 0;

  return (
    <Card className="flex items-center justify-between px-4 py-3">
      {/* 左: アイコンと説明 */}
      <div className="flex items-center gap-3 flex-grow min-w-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={image ?? PLACEHOLDER_IMAGE} alt="user" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-left min-w-0 flex-1">
          <span className="text-body-sm truncate whitespace-nowrap overflow-hidden block">
            {transaction.description}
          </span>
          <span className="text-label-xs text-muted-foreground">
            {formatDateTime(transaction.transferredAt)}
          </span>
        </div>
      </div>

      {/* 右: 金額 */}
      <div
        className={`text-label-sm font-bold shrink-0 ml-4 ${isPositive ? "text-success" : "text-foreground"}`}
      >
        {isPositive ? "+" : ""}
        {formatCurrency(transaction.transferPoints)} pt
      </div>
    </Card>
  );
};

export default TransactionItem;
