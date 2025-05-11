'use client';

import { useQuery } from '@apollo/client';
import { GET_USER_PROFILE, GET_USER_WITH_DETAILS_AND_PORTFOLIOS } from '@/graphql/account/user/query';
import { GqlUser } from "@/types/graphql";

export interface GetUserProfileData {
  user: GqlUser;
}

export interface GetUserWithDetailsData {
  user: GqlUser & {
    opportunitiesCreatedByMe?:
      Array<{
          id: string;
          title: string;
          description: string;
          images: string[];
          feeRequired?: number;
          isReservableWithTicket?: boolean;
    }>;
    portfolios?:
      Array<{
          id: string;
          title: string;
          category: string;
          date: string;
          thumbnailUrl: string;
          source?: string;
          reservationStatus?: string;
    }>;
  };
}

export const useUserProfileQuery = (userId?: string, authUserId?: string) => {
  const targetId = userId || authUserId;
  const isMe = !userId || userId === authUserId;
  
  return useQuery<GetUserProfileData | GetUserWithDetailsData>(
    isMe ? GET_USER_PROFILE : GET_USER_WITH_DETAILS_AND_PORTFOLIOS,
    {
      variables: { 
        id: targetId ?? '',
      },
      skip: !targetId,
      fetchPolicy: 'cache-and-network',
    }
  );
};
