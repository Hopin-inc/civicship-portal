import { GqlTransaction, GqlWalletType } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";

export const getFromWalletImage = (transaction: GqlTransaction): string => {
  if (transaction.fromWallet?.type === GqlWalletType.Community) {
    return transaction.fromWallet.community?.image || PLACEHOLDER_IMAGE;
  }
  return transaction.fromWallet?.user?.image || PLACEHOLDER_IMAGE;
};

export const getToWalletImage = (transaction: GqlTransaction): string => {
  if (transaction.toWallet?.type === GqlWalletType.Community) {
    return transaction.toWallet.community?.image || PLACEHOLDER_IMAGE;
  }
  return transaction.toWallet?.user?.image || PLACEHOLDER_IMAGE;
};

export const getCounterpartyImage = (
  transaction: GqlTransaction,
  perspectiveWalletId: string,
): string => {
  const isOutgoing = transaction.fromWallet?.id === perspectiveWalletId;
  const counterpartyWallet = isOutgoing ? transaction.toWallet : transaction.fromWallet;

  if (counterpartyWallet?.type === GqlWalletType.Community) {
    return counterpartyWallet.community?.image || PLACEHOLDER_IMAGE;
  }
  return counterpartyWallet?.user?.image || PLACEHOLDER_IMAGE;
};
