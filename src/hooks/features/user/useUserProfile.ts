'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_PROFILE, GET_USER_WITH_DETAILS_AND_PORTFOLIOS } from '@/graphql/queries/user';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/hooks/core/useLoading';
import { formatUserProfileData } from '@/utils/userUtils';
import { toast } from 'sonner';
import { User } from '@/types';

interface GetUserProfileData {
  user: User;
}

interface GetUserWithDetailsData {
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
 * Custom hook for fetching and managing user profile data
 * @param userId Optional user ID. If not provided, fetches current user's profile
 */
export const useUserProfile = (userId?: string) => {
  const { user: authUser } = useAuth();
  const { setIsLoading } = useLoading();
  const [isOwner, setIsOwner] = useState(false);
  
  const targetId = userId || authUser?.id;
  const isMe = !userId || userId === authUser?.id;
  
  const { data, loading, error, refetch } = useQuery<GetUserProfileData | GetUserWithDetailsData>(
    isMe ? GET_USER_PROFILE : GET_USER_WITH_DETAILS_AND_PORTFOLIOS,
    {
      variables: { 
        id: targetId ?? '',
        first: 10,
        after: null,
        filter: null,
        sort: { field: "DATE", direction: "DESC" }
      },
      skip: !targetId,
      fetchPolicy: 'cache-and-network',
    }
  );
  
  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);
  
  useEffect(() => {
    setIsOwner(isMe || authUser?.id === userId);
  }, [authUser, userId, isMe]);
  
  const profileData = formatUserProfileData(data);
  
  const handleError = () => {
    if (error) {
      console.error('Error fetching user profile:', error);
      toast.error('プロフィールの取得に失敗しました');
    }
  };

  useEffect(() => {
    handleError();
  }, [error]);

  return {
    profileData,
    isOwner,
    isLoading: loading,
    error,
    isMe,
    refetch
  };
};

export default useUserProfile;
