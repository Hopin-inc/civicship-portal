'use client';

import { useQuery } from '@apollo/client';
import { GET_USER_PROFILE, GET_USER_WITH_DETAILS_AND_PORTFOLIOS } from '../../../graphql/queries/user';
import { User } from '../../../types';

export interface GetUserProfileData {
  user: User;
}

export interface GetUserWithDetailsData {
  user: User & {
    opportunitiesCreatedByMe?: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          description: string;
          images: string[];
          feeRequired?: number;
          isReservableWithTicket?: boolean;
        };
      }>;
    };
    portfolios?: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          category: string;
          date: string;
          thumbnailUrl: string;
          source?: string;
          reservationStatus?: string;
        };
        cursor: string;
      }>;
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string;
      };
    };
  };
}

/**
 * Hook for fetching user profile data from GraphQL
 * @param userId Optional user ID. If not provided, fetches current user's profile
 * @param authUserId Current authenticated user ID
 */
export const useUserProfileQuery = (userId?: string, authUserId?: string) => {
  const targetId = userId || authUserId;
  const isMe = !userId || userId === authUserId;
  
  return useQuery<GetUserProfileData | GetUserWithDetailsData>(
    isMe ? GET_USER_PROFILE : GET_USER_WITH_DETAILS_AND_PORTFOLIOS,
    {
      variables: { 
        id: targetId ?? '',
        first: 10,
        after: null,
        filter: null,
        sort: { date: "DESC" }
      },
      skip: !targetId,
      fetchPolicy: 'cache-and-network',
    }
  );
};
