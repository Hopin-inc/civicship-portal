'use client';

import { useAuth } from '../../../contexts/AuthContext';
import { useUserProfileController } from './useUserProfileController';

/**
 * Custom hook for fetching and managing user profile data
 * This is a backward-compatible wrapper around useUserProfileController
 * @param userId Optional user ID. If not provided, fetches current user's profile
 */
export const useUserProfile = (userId?: string) => {
  const { user: authUser } = useAuth();
  return useUserProfileController(userId, authUser?.id);
};

export default useUserProfile;
