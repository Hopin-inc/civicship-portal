import { GqlTransaction, GqlWalletType } from "@/types/graphql";

export type NavigationStrategy = "perspectiveCounterparty" | "fromFirst" | "toFirst";

interface ComputeProfileHrefOptions {
  perspectiveWalletId?: string;
  strategy?: NavigationStrategy;
}

/**
 * Computes the profile href for a transaction card click.
 * Returns /users/{userId} if the target is a member wallet, null otherwise.
 */
export const computeProfileHref = (
  transaction: GqlTransaction,
  options: ComputeProfileHrefOptions = {},
): string | null => {
  const { perspectiveWalletId, strategy } = options;

  const effectiveStrategy: NavigationStrategy = strategy || (perspectiveWalletId ? "perspectiveCounterparty" : "fromFirst");

  let targetWallet = null;

  switch (effectiveStrategy) {
    case "perspectiveCounterparty":
      if (!perspectiveWalletId) return null;
      const isOutgoing = transaction.fromWallet?.id === perspectiveWalletId;
      targetWallet = isOutgoing ? transaction.toWallet : transaction.fromWallet;
      break;

    case "fromFirst":
      if (
        transaction.fromWallet?.type === GqlWalletType.Member &&
        transaction.fromWallet.user?.id
      ) {
        targetWallet = transaction.fromWallet;
      } else if (
        transaction.toWallet?.type === GqlWalletType.Member &&
        transaction.toWallet.user?.id
      ) {
        targetWallet = transaction.toWallet;
      }
      break;

    case "toFirst":
      if (
        transaction.toWallet?.type === GqlWalletType.Member &&
        transaction.toWallet.user?.id
      ) {
        targetWallet = transaction.toWallet;
      } else if (
        transaction.fromWallet?.type === GqlWalletType.Member &&
        transaction.fromWallet.user?.id
      ) {
        targetWallet = transaction.fromWallet;
      }
      break;
  }

  if (targetWallet?.type === GqlWalletType.Member && targetWallet.user?.id) {
    return `/users/${targetWallet.user.id}`;
  }

  return null;
};
