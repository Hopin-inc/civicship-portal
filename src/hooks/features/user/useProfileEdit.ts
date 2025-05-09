'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useProfileEditController } from './useProfileEditController';
import { GqlCurrentPrefecture } from '@/types/graphql';
import type { ErrorWithMessage } from '../wallet/useWalletController';
import React from "react";

/**
 * Public API hook for editing user profile
 * This is the hook that should be used by components
 */
export interface ProfileFormData {
  name: string;
  bio: string;
  currentPrefecture: GqlCurrentPrefecture;
  profileImage: string | null;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

export interface UseProfileEditResult {
  profileImage: string | null;
  displayName: string;
  location: GqlCurrentPrefecture | undefined;
  bio: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  userLoading: boolean;
  error: ErrorWithMessage | null;
  updating: boolean;
  prefectureOptions: Array<{
    value: GqlCurrentPrefecture;
    label: string;
  }>;
  setDisplayName: (name: string) => void;
  setLocation: (location: GqlCurrentPrefecture | undefined) => void;
  setBio: (bio: string) => void;
  setSocialLinks: (links: { facebook: string; instagram: string; twitter: string }) => void;
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: (e: React.FormEvent) => void;
}

export const useProfileEdit = (): UseProfileEditResult => {
  const { user } = useAuth();
  return useProfileEditController(user?.id);
};

export default useProfileEdit;
