import { Opportunity } from "@/types";
import { useMemo } from "react";

export const useAvailableDates = (
  opportunity: Opportunity | null
): Array<{
  startsAt: string;
  endsAt: string;
  participants: number;
  price: number;
}> => {
  return useMemo(() => {
    if (!opportunity?.slots?.edges) return [];

    return opportunity.slots.edges
      .map(edge => ({
        startsAt: new Date(edge.node.startsAt).toISOString(),
        endsAt: new Date(edge.node.endsAt).toISOString(),
        participants: edge.node.participations?.edges?.length || 0,
        price: opportunity.feeRequired || 0,
      }))
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [opportunity]);
};
