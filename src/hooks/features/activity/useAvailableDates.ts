'use client';

import { useAvailableDatesQuery } from "@/hooks/features/activity/useAvailableDatesQuery";
import { GqlOpportunity } from "@/types/graphql";

export const useAvailableDates = (
  opportunity: GqlOpportunity | null
): Array<{
  startsAt: string;
  endsAt: string;
  participants: number;
  price: number;
}> => {
  const { availableDates } = useAvailableDatesQuery(opportunity);
  return availableDates;
};
