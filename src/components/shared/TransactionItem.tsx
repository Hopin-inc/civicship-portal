"use client";

import React from "react";
import { formatCurrency } from "@/utils/transaction";
import { AppTransaction } from "@/app/community/[communityId]/wallets/features/shared/type";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GqlTransactionReason } from "@/types/graphql";
import { truncateText } from "@/utils/stringUtils";
import { useTranslations } from "next-intl";
import { useLocaleDateTimeFormat } from "@/utils/i18n";

interface TransactionItemProps {
  transaction: AppTransaction;
  image?: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, image }) => {
  const t = useTranslations();
  const formatDateTime = useLocaleDateTimeFormat();
  const isPositive = transaction.transferPoints > 0;

  const getDisplayText = () => {
    const descData = transaction.descriptionData;
    
    if (!descData || descData.isSpecialCase) {
      return {
        displayName: null,
        displayAction: t(`transactions.name.${descData?.name || "move"}`)
      };
    }

    const actionType = descData.actionType;
    const direction = descData.direction;
    return {
      displayName: t(`transactions.parts.action.${actionType}.${direction}.name`, { name: descData.name }),
      displayAction: t(`transactions.parts.action.${actionType}.${direction}.action`)
    };
  };

  const { displayName, displayAction } = getDisplayText();

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
              {displayName && <span className="text-label-sm font-bold">{displayName}</span>}
              {displayAction && <span className="text-label-xs font-bold">{displayAction}</span>}
            </span>
            <div
              className={`text-label-sm font-bold shrink-0 ml-4 ${isPositive ? "text-success" : "text-foreground"}`}
            >
              {isPositive ? "+" : ""}
              {formatCurrency(transaction.transferPoints)}pt
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
