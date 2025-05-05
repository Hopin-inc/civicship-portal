'use client';

import { useQuery } from '@apollo/client';
import { GET_USER_WITH_DETAILS_AND_PORTFOLIOS } from '@/graphql/queries/user';
import { SortDirection } from '@/gql/graphql';

export const ITEMS_PER_PAGE = 30;

export interface GqlPortfolio {
  id: string;
  title: string;
  category: string;
  date: string;
  thumbnailUrl: string | null;
  source?: string;
  reservationStatus?: string | null;
  place?: {
    name: string;
  } | null;
  participants: Array<{
    id: string;
    name: string;
    image: string | null;
  }>;
}

export interface UserWithPortfoliosData {
  user?: {
    id: string;
    name: string;
    image: string | null;
    bio: string | null;
    sysRole: string | null;
    currentPrefecture: string | null;
    portfolios?: {
      edges: Array<{
        node: GqlPortfolio | null;
        cursor: string;
      }>;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
    };
    opportunitiesCreatedByMe?: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          description: string;
          images: string[];
          feeRequired?: number | null;
          isReservableWithTicket?: boolean | null;
          place?: {
            name: string;
          } | null;
          community?: {
            id: string;
            name: string;
            image: string | null;
          } | null;
        } | null;
      }>;
    };
  };
}

/**
 * Hook for fetching user portfolios data from GraphQL
 */
export const useUserPortfolioQuery = (userId: string) => {
  return useQuery<UserWithPortfoliosData>(
    GET_USER_WITH_DETAILS_AND_PORTFOLIOS,
    {
      variables: { 
        id: userId,
        first: ITEMS_PER_PAGE,
        after: null,
        filter: null,
        sort: { date: SortDirection.Desc }
      },
      fetchPolicy: "network-only",
      skip: !userId
    }
  );
};
