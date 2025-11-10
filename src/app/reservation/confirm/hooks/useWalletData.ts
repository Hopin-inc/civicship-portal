"use client";

import { useMemo } from "react";
import { GqlTicket, GqlWalletType, useGetWalletsWithTicketQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { toNumberSafe } from "@/utils/bigint";

export function useWalletData(userId?: string) {
  const { data, loading, error, refetch } = useGetWalletsWithTicketQuery({
    variables: {
      filter: {
        userId: userId,
        type: GqlWalletType.Member,
        communityId: COMMUNITY_ID,
      },
      first: 1,
    },
    skip: !userId,
    fetchPolicy: "cache-and-network",
  });

  const wallets = useMemo(
    () => data?.wallets?.edges?.flatMap((edge) => (edge?.node ? [edge.node] : [])) ?? null,
    [data],
  );

  const currentPoint = useMemo(() => {
    const memberWallet = wallets?.[0];
    return toNumberSafe(memberWallet?.currentPointView?.currentPoint, 0);
  }, [wallets]);

  const tickets: GqlTicket[] = useMemo(() => wallets?.[0]?.tickets ?? [], [wallets]);

  return {
    wallets,
    currentPoint,
    tickets,
    loading,
    error,
    refetch,
  };
}
