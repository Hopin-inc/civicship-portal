import { useMemo } from "react";
import {
  GqlGetTransactionDetailQuery,
  GqlTransactionReason,
  GqlWalletType,
} from "@/types/graphql";
import { getNameFromWallet, mapReasonToAction } from "@/utils/transaction";

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

export function useTransactionDetailData(
  transaction: GqlGetTransactionDetailQuery["transaction"],
  t: (key: string, values?: Record<string, string>) => string,
) {
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

    const fromName = getNameFromWallet(transaction.fromWallet);
    const toName = getNameFromWallet(transaction.toWallet);
    const pointAmount = Math.abs(transaction.fromPointChange ?? 0);
    const dateTime = transaction.createdAt
      ? new Date(transaction.createdAt).toISOString()
      : "";

    const fromUserId =
      transaction.fromWallet?.type === GqlWalletType.Member &&
      transaction.fromWallet.user?.id
        ? transaction.fromWallet.user.id
        : null;

    const toUserId =
      transaction.toWallet?.type === GqlWalletType.Member &&
      transaction.toWallet.user?.id
        ? transaction.toWallet.user.id
        : null;

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
  }, [transaction, t]);

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
