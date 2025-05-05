"use client";

import { GetUserWalletDocument } from '@/types/graphql';
import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import { Opportunity } from "@/types";

export const useAvailableTickets = (
  opportunity: Opportunity | null,
  userId: string | undefined
): number => {
  const { data: walletData } = useQuery(GetUserWalletDocument, {
    variables: userId ? { id: userId } : undefined,
    skip: !userId,
  });

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
