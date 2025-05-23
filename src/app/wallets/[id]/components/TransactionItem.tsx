"use client";

import Image from "next/image";
import React from "react";
import { formatCurrency } from "@/app/wallets/data/presenter";
import { AppTransaction } from "@/app/wallets/data/type";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { Card } from "@/components/ui/card";

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
      <div className="flex items-center gap-3">
        <Image
          src={image ?? PLACEHOLDER_IMAGE}
          alt="user"
          width={40}
          height={40}
          className="rounded-full object-cover border"
          style={{ aspectRatio: "1 / 1" }}
        />
        <div className="flex flex-col text-left">
          <span className="text-body-sm truncate max-w-[200px]">{transaction.description}</span>
          <span className="text-label-xs text-muted-foreground">
            {formatDateTime(transaction.transferredAt)}
          </span>
        </div>
      </div>

      {/* 右: 金額 */}
      <div className={`text-label-sm font-bold ${isPositive ? "text-success" : "text-foreground"}`}>
        {isPositive ? "+" : ""}
        {formatCurrency(transaction.transferPoints)} pt
      </div>
    </Card>
  );
};

export default TransactionItem;
