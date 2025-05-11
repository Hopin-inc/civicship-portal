'use client';

import { GqlWallet } from "@/types/graphql";

export const presenterUserAsset = (wallet : GqlWallet | undefined | null): { currentPoint: number; ticketCount: number } => {
  const currentPoint = wallet?.currentPointView?.currentPoint ?? 0;
  const ticketCount = wallet?.tickets?.length ?? 0;

  return {
    currentPoint,
    ticketCount
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP').format(amount);
};
