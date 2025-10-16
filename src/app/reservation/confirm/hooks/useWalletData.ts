"use client";

import { useMemo } from "react";
import { GqlWalletType, useGetWalletsWithTicketQuery, GqlTicket } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { toNumberSafe } from "@/utils/bigint";

/**
 * Consolidated wallet data hook for reservation confirmation page.
 * 
 * ✅ Fetches wallet data with community filtering to prevent cross-community point usage
 * ✅ Includes tickets for ticket-based reservations
 * 🔑 Uses cache-and-network policy to ensure fresh data while maintaining performance
 * 
 * Note: Uses GET_WALLETS_WITH_TICKET query which includes transactions field.
 * This is a minor trade-off to avoid requiring GraphQL codegen for a new query.
 */
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
    () => data?.wallets?.edges?.map((edge) => edge?.node).filter((node): node is NonNullable<typeof node> => node != null) ?? null,
    [data]
  );

  const currentPoint = useMemo(() => {
    const memberWallet = wallets?.[0];
    return toNumberSafe(memberWallet?.currentPointView?.currentPoint, 0);
  }, [wallets]);

  const tickets: GqlTicket[] = useMemo(
    () => (wallets?.[0]?.tickets as GqlTicket[]) ?? [],
    [wallets]
  );

  return {
    wallets,
    currentPoint,
    tickets,
    loading,
    error,
    refetch,
  };
}
