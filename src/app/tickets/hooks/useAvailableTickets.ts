"use client";

import { useMemo } from "react";
import { GqlTicketStatus, useGetUserWalletQuery } from "@/types/graphql";
import { ActivityDetail } from "@/app/activities/data/type";
import { getCommunityIdFromEnv } from "@/lib/communities/metadata";

export const useAvailableTickets = (
  opportunity: ActivityDetail | null,
  userId: string | undefined,
): number => {
  const { data } = useGetUserWalletQuery({
    variables: userId ? { id: userId } : undefined,
    skip: !userId,
  });

  return useMemo(() => {
    const tickets = data?.user?.wallets?.find(w => w.community?.id === getCommunityIdFromEnv())?.tickets || [];

    if (!opportunity?.targetUtilities.length) {
      return tickets.length;
    }

    const requiredUtilityIds = new Set(opportunity.targetUtilities.map((u) => u.id));

    return tickets.filter((t) => {
      const utilityId = t?.utility?.id;
      return utilityId && requiredUtilityIds.has(utilityId) && t.status === GqlTicketStatus.Available;
    }).length;
  }, [opportunity?.targetUtilities, data]);
};
