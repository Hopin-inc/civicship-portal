import { useMemo } from "react";
import {
  GqlGetTransactionDetailQuery,
  GqlTransactionReason,
  GqlWallet,
  GqlWalletType,
} from "@/types/graphql";
import { getNameFromWallet, mapReasonToAction } from "@/utils/transaction";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

type TransactionDetailData = {
  transactionType: string;
  dateTime: string;
  fromName: string;
  fromUserId: string | null;
  pointAmount: number;
  toName: string;
  toUserId: string | null;
  comment: string | null;
};

function getUserIdFromWallet(wallet: GqlWallet | null | undefined): string | null {
  return wallet?.type === GqlWalletType.Member ? wallet.user?.id ?? null : null;
}

export function useTransactionDetailData(
  transaction: GqlGetTransactionDetailQuery["transaction"],
  t: (key: string, values?: Record<string, string>) => string,
) {
  const communityConfig = useCommunityConfig();
  const communityTitle = communityConfig?.title ?? "";

  const detail = useMemo((): TransactionDetailData | null => {
    if (!transaction) {
      return null;
    }

    const mapping = mapReasonToAction(transaction.reason);
    let transactionType: string;

    if (mapping.specialName) {
      transactionType = t(`transactions.name.${mapping.specialName}`);
    } else if (mapping.actionType) {
      transactionType = getTransactionTypeLabel(mapping.actionType, t);
    } else {
      transactionType = t("transactions.name.move");
    }

    const fromName = getNameFromWallet(transaction.fromWallet, communityTitle);
    const toName = getNameFromWallet(transaction.toWallet, communityTitle);
    const pointAmount = Math.abs(transaction.fromPointChange ?? 0);
    const dateTime = transaction.createdAt
      ? new Date(transaction.createdAt).toISOString()
      : "";

    const fromUserId = getUserIdFromWallet(transaction.fromWallet);
    const toUserId = getUserIdFromWallet(transaction.toWallet);

    return {
      transactionType,
      dateTime,
      fromName,
      fromUserId,
      pointAmount,
      toName,
      toUserId,
      comment: transaction.comment ?? null,
    };
  }, [transaction, t, communityTitle]);

  return { detail };
}

function getTransactionTypeLabel(
  actionType: "donation" | "grant" | "payment" | "return" | "refund",
  t: (key: string) => string,
): string {
  switch (actionType) {
    case "donation":
      return t("transactions.detail.type.donation");
    case "grant":
      return t("transactions.detail.type.grant");
    case "payment":
      return t("transactions.detail.type.payment");
    case "return":
      return t("transactions.detail.type.return");
    case "refund":
      return t("transactions.detail.type.refund");
    default:
      return t("transactions.name.move");
  }
}
