'use client';

import { useMemo } from "react";
import { Opportunity } from "@/types/index";
import { useAvailableTicketsQuery } from "./useAvailableTicketsQuery";

/**
 * Controller hook for managing available tickets UI state
 * @param opportunity Opportunity to check tickets for
 * @param userId User ID to check tickets for
 */
export const useAvailableTicketsController = (
  opportunity: Opportunity | null,
  userId: string | undefined
): number => {
  const { data: walletData } = useAvailableTicketsQuery(userId);

  return useMemo(() => {
    if (!opportunity?.requiredUtilities?.length) {
      return walletData?.user?.wallets?.edges?.[0]?.node?.tickets?.edges?.length || 0;
    }

    const requiredUtilityIds = new Set(opportunity.requiredUtilities.map(u => u.id));
    const tickets = walletData?.user?.wallets?.edges?.[0]?.node?.tickets?.edges || [];

    return tickets.filter((edge: any) => {
      const utilityId = edge?.node?.utility?.id;
      return utilityId && requiredUtilityIds.has(utilityId);
    }).length;
  }, [opportunity?.requiredUtilities, walletData]);
};
