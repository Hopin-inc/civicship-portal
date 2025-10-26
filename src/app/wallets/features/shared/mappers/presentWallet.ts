import { GqlWallet, GqlTicketStatus } from "@/types/graphql";
import { toPointNumber } from "@/utils/bigint";
import { WalletViewModel } from "../types";

export function presentWallet(
  gqlWallet: GqlWallet,
  userId?: string
): WalletViewModel {
  return {
    walletId: gqlWallet.id,
    points: toPointNumber(gqlWallet.currentPointView?.currentPoint, 0),
    accumulatedPoints: gqlWallet.accumulatedPointView?.accumulatedPoint
      ? toPointNumber(gqlWallet.accumulatedPointView.accumulatedPoint)
      : undefined,
    ticketsAvailable: gqlWallet.tickets?.filter(
      (t) => t.status === GqlTicketStatus.Available
    ).length,
    walletType: gqlWallet.type,
    ownerName: gqlWallet.user?.name ?? gqlWallet.community?.name ?? undefined,
  };
}
