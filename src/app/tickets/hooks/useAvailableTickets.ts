"use client";

import { useMemo } from "react";
import { useGetUserWalletQuery } from "@/types/graphql";
import { ActivityDetail } from "@/app/activities/data/type";

export const useAvailableTickets = (
  opportunity: ActivityDetail | null,
  userId: string | undefined,
): number => {
  const { data } = useGetUserWalletQuery({
    variables: userId ? { id: userId } : undefined,
    skip: !userId,
  });

  return useMemo(() => {
    const tickets = data?.user?.wallets?.[0]?.tickets || [];

    if (!opportunity?.targetUtilities.length) {
      return tickets.length;
    }

    const requiredUtilityIds = new Set(opportunity.targetUtilities.map((u) => u.id));

    return tickets.filter((edge) => {
      const utilityId = edge?.utility?.id;
      return utilityId && requiredUtilityIds.has(utilityId);
    }).length;
  }, [opportunity?.targetUtilities, data]);
};
