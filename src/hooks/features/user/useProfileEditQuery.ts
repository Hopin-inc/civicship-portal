'use client';

import { GqlCurrentPrefecture, useGetUserProfileQuery, useUpdateMyProfileMutation } from '@/types/graphql';

/**
 * Hook for fetching user profile data from GraphQL
 */
export const useProfileEditQuery = (userId: string | undefined) => {
  return useGetUserProfileQuery({
    variables: { 
      id: userId ?? '',
    },
    skip: !userId,
  });
};

/**
 * Interface for profile update input
 */
export interface ProfileUpdateInput {
  name: string;
  image?: { file: string } | undefined;
  bio: string;
  currentPrefecture: GqlCurrentPrefecture;
  urlFacebook: string;
  urlInstagram: string;
  urlX: string;
  slug: string;
}

/**
 * Hook for updating user profile data in GraphQL
 */
export const useProfileEditMutation = () => {
  return useUpdateMyProfileMutation();
};
