'use client';

import { GqlGetUserWithDetailsAndPortfoliosQuery, GqlOpportunity } from "@/types/graphql";
import { ActivityCard } from "@/types/opportunity";
import { presenterActivityCard } from "@/presenters/opportunity";

export const useUserOpportunities = (data: GqlGetUserWithDetailsAndPortfoliosQuery | undefined): ActivityCard[] => {
  if (!data?.user?.opportunitiesCreatedByMe) {
    return [];
  }

  return data.user.opportunitiesCreatedByMe
    .map((node: GqlOpportunity) => {
      if (!node) return null;
      return presenterActivityCard(node);
    })
    .filter((item): item is ActivityCard => item !== null);
};
