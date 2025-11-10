"use client";

import { useEffect, useMemo } from "react";
import { presentReservationWallet } from "../presenters/presentReservationConfirm";
import type { ActivityDetail, QuestDetail } from "@/components/domains/opportunities/types";
import { logger } from "@/lib/logging";
import { useWalletData } from "./useWalletData";

export const useReservationWallet = ({
  userId,
  opportunity,
}: {
  userId?: string;
  opportunity: ActivityDetail | QuestDetail | null;
}) => {
  const walletData = useWalletData(userId);

  const wallet = useMemo(
    () => {
      if (!walletData.wallets || !Array.isArray(walletData.wallets)) return null;
      return presentReservationWallet(walletData.wallets, opportunity);
    },
    [walletData.wallets, opportunity]
  );

  useEffect(() => {
    if (walletData.error)
      logger.info("Wallet error", {
        error: walletData.error.message || String(walletData.error),
        component: "useReservationWallet",
        userId,
      });
  }, [walletData.error, userId]);

  return {
    wallet,
    loading: walletData.loading,
    error: walletData.error,
    refetch: walletData.refetch,
  };
};
