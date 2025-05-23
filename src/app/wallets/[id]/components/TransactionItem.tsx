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

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
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
          <span className="text-body-sm">{transaction.description}</span>
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
