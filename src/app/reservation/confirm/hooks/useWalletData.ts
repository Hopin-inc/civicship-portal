"use client";

import { useMemo } from "react";
import { useGetMyWalletQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { toNumberSafe } from "@/utils/bigint";

export function useWalletData(userId?: string) {
  const { data, loading, error, refetch } = useGetMyWalletQuery({
    skip: !userId,
    fetchPolicy: "cache-and-network",
  });

  const wallet = useMemo(() => data?.myWallet ?? null, [data]);

  const wallets = useMemo(
    () => wallet && wallet.community?.id === COMMUNITY_ID ? [wallet] : null,
    [wallet],
  );

  const currentPoint = useMemo(() => {
    return toNumberSafe(wallet?.currentPointView?.currentPoint, 0);
  }, [wallet]);

  // ticketsは常に空配列を返す
  const tickets: never[] = [];

  return {
    wallets,
    currentPoint,
    tickets,
    loading,
    error,
    refetch,
  };
}
