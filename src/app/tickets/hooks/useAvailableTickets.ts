"use client";

import { useMemo } from "react";
import { useGetUserWalletQuery } from "@/types/graphql";
import { OpportunityDetail } from "@/app/opportunities/data/type";

export const useAvailableTickets = (
  opportunity: OpportunityDetail | null,
  userId: string | undefined,
): number => {
  const { data } = useGetUserWalletQuery({
    variables: userId ? { id: userId } : undefined,
    skip: !userId,
  });

  return useMemo(() => {
    const tickets = data?.user?.wallets?.[0]?.tickets || [];

    if (!opportunity?.requiredTicket.length) {
      return tickets.length;
    }

    const requiredUtilityIds = new Set(opportunity.requiredTicket.map((u) => u.id));

    return tickets.filter((edge) => {
      const utilityId = edge?.utility?.id;
      return utilityId && requiredUtilityIds.has(utilityId);
    }).length;
  }, [opportunity?.requiredTicket, data]);
};
