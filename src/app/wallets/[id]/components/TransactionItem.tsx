"use client";

import React from "react";
import { formatCurrency } from "@/app/wallets/data/presenter";
import { AppTransaction } from "@/app/wallets/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GqlTransactionReason } from "@/types/graphql";

interface TransactionItemProps {
  transaction: AppTransaction;
  image?: string; // ← 追加
  didValue?: string;
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
  if (description.endsWith("に支給")) {
    const name = description.replace("に支給", "");
    return { name, action: "に支給" };
  }
  if (description === "発行") {
    return { name: description, action: "" };
  }
  return { name: description, action: "" };
};

const truncateDid = (did: string | undefined | null, length: number = 20): string => {
  if (!did) return "did発行中";
  if (did.length <= length) return did;
  const start = did.substring(0, length);
  const end = did.substring(did.length - 10);
  return `${start}...${end}`;
};


const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, image, didValue }) => {
  const isPositive = transaction.transferPoints > 0;
  const { name, action } = formatTransactionDescription(transaction.description);
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
            <div
              className={`text-label-sm font-bold shrink-0 ml-4 ${isPositive ? "text-success" : "text-foreground"}`}
            >
              {isPositive ? "+" : ""}
              {formatCurrency(transaction.transferPoints)} pt
            </div>
          </div>
          {transaction.reason !== GqlTransactionReason.PointIssued &&<span className="text-label-xs text-caption py-2">{truncateDid(transaction.didValue)}</span>}
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
