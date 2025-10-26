import { GqlTransaction } from "@/types/graphql";
import { toPointNumber } from "@/utils/bigint";
import { TransactionViewModel } from "../types";

export function presentTransaction(
  gqlTransaction: GqlTransaction,
  currentWalletId: string
): TransactionViewModel {
  const isOutgoing = gqlTransaction.fromWallet?.id === currentWalletId;

  return {
    id: gqlTransaction.id,
    reason: gqlTransaction.reason,
    description: gqlTransaction.description ?? undefined,
    comment: gqlTransaction.comment ?? undefined,
    transferPoints: toPointNumber(gqlTransaction.transferPoints, 0),
    transferredAt: gqlTransaction.transferredAt,
    didValue: gqlTransaction.didValue ?? undefined,
    avatarUrl: isOutgoing
      ? gqlTransaction.toWallet?.user?.image ?? undefined
      : gqlTransaction.fromWallet?.user?.image ?? undefined,
    isOutgoing,
  };
}
