'use client';

import { UserWithPortfoliosData } from './useUserPortfolioQuery';

export interface UserOpportunity {
  id: string;
  title: string;
  price: number | null;
  location: string;
  imageUrl: string | null;
  community: {
    id: string;
    name: string;
    image: string | null;
  } | null;
  isReservableWithTicket: boolean | null;
}

/**
 * Hook for extracting and transforming user opportunities from user data
 */
export const useUserOpportunities = (data: UserWithPortfoliosData | undefined): UserOpportunity[] => {
  if (!data?.user?.opportunitiesCreatedByMe?.edges) {
    return [];
  }

  return data.user.opportunitiesCreatedByMe.edges
    .map((edge: any) => {
      const node = edge?.node;
      if (!node) return null;
      
      return {
        id: node.id,
        title: node.title,
        price: node.feeRequired ?? null,
        location: node.place?.name ?? '',
        imageUrl: node.images?.[0] ?? null,
        community: node.community,
        isReservableWithTicket: node.isReservableWithTicket
      };
    })
    .filter((item): item is UserOpportunity => item !== null);
};
