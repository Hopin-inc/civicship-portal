'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUserProfileQuery } from './useUserProfileQuery';
import { formatUserProfileData } from '@/presenters/user';
import { useLoading } from '@/hooks/core/useLoading';
import { toast } from 'sonner';

/**
 * Controller hook for managing user profile data and state
 * @param userId Optional user ID. If not provided, fetches current user's profile
 * @param authUserId Current authenticated user ID
 */
export const useUserProfileController = (userId?: string, authUserId?: string) => {
  const { setIsLoading } = useLoading();
  const [isOwner, setIsOwner] = useState(false);
  
  const isMe = !userId || userId === authUserId;
  
  const { data, loading, error, refetch } = useUserProfileQuery(userId, authUserId);
  
  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);
  
  useEffect(() => {
    setIsOwner(isMe || authUserId === userId);
  }, [authUserId, userId, isMe]);
  
  const profileData = formatUserProfileData(data);
  
  const handleError = useCallback(() => {
    if (error) {
      console.error('Error fetching user profile:', error);
      toast.error('プロフィールの取得に失敗しました');
    }
  }, [error]);

  useEffect(() => {
    handleError();
  }, [handleError]);

  return {
    profileData,
    isOwner,
    isLoading: loading,
    error,
    isMe,
    refetch
  };
};
