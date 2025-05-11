'use client';

import { GqlWallet } from "@/types/graphql";
import { AvailableTicket, UserAsset } from "@/types/wallet";

export const presenterUserAsset = (wallet: GqlWallet | undefined | null): UserAsset => {
  const walletId = wallet?.id ?? '';
  const currentPoint = wallet?.currentPointView?.currentPoint ?? 0;

  const tickets: AvailableTicket[] = (wallet?.tickets ?? []).map(ticket => ({
    id: ticket.id,
  }));

  return {
    points: {
      walletId,
      currentPoint,
    },
    tickets,
  };
};


export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP').format(amount);
};
