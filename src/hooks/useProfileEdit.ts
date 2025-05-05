'use client';

import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from './useLoading';
import { prefectureLabels } from '@/utils/userUtils';
import { CurrentPrefecture } from '@/gql/graphql';

const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      user {
        id
        name
        bio
        currentPrefecture
        urlFacebook
        urlInstagram
        urlWebsite
        urlX
        urlYoutube
      }
    }
  }
`;

interface ProfileFormData {
  name: string;
  bio: string;
  currentPrefecture: CurrentPrefecture;
  socialLinks: {
    facebook: string;
    instagram: string;
    website: string;
    x: string;
    youtube: string;
  };
}

/**
 * Custom hook for editing user profile
 */
export const useProfileEdit = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setIsLoading } = useLoading();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    bio: '',
    currentPrefecture: CurrentPrefecture.Unknown,
    socialLinks: {
      facebook: '',
      instagram: '',
      website: '',
      x: '',
      youtube: ''
    }
  });

  const [updateProfile, { loading, error }] = useMutation(UPDATE_USER_PROFILE, {
    onCompleted: () => {
      toast.success('プロフィールを更新しました');
      router.push('/users/me');
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast.error('プロフィールの更新に失敗しました');
    }
  });

  const setInitialData = (userData: any) => {
    if (!userData) return;
    
    setFormData({
      name: userData.name || '',
      bio: userData.bio || '',
      currentPrefecture: userData.currentPrefecture || CurrentPrefecture.Unknown,
      socialLinks: {
        facebook: userData.urlFacebook || '',
        instagram: userData.urlInstagram || '',
        website: userData.urlWebsite || '',
        x: userData.urlX || '',
        youtube: userData.urlYoutube || ''
      }
    });
  };

  const handleInputChange = (field: keyof Omit<ProfileFormData, 'socialLinks'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: keyof ProfileFormData['socialLinks'], value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handlePrefectureChange = (prefecture: CurrentPrefecture) => {
    setFormData(prev => ({
      ...prev,
      currentPrefecture: prefecture
    }));
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('ユーザー情報が取得できません');
      return;
    }

    setIsLoading(true);
    
    try {
      await updateProfile({
        variables: {
          input: {
            userId: user.id,
            name: formData.name,
            bio: formData.bio,
            currentPrefecture: formData.currentPrefecture,
            urlFacebook: formData.socialLinks.facebook,
            urlInstagram: formData.socialLinks.instagram,
            urlWebsite: formData.socialLinks.website,
            urlX: formData.socialLinks.x,
            urlYoutube: formData.socialLinks.youtube
          }
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    prefectureOptions: Object.entries(prefectureLabels).map(([key, label]) => ({
      value: key as CurrentPrefecture,
      label
    })),
    setInitialData,
    handleInputChange,
    handleSocialLinkChange,
    handlePrefectureChange,
    handleSubmit
  };
};

export default useProfileEdit;
