'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useProfileEditQuery, useProfileEditMutation } from './useProfileEditQuery';
import { GqlCurrentPrefecture } from '@/types/graphql';
import { ErrorWithMessage, formatError } from '../wallet/useWalletController';
import { prefectureLabels } from '@/transformers/user';

/**
 * Controller hook for profile editing
 * Handles business logic and state management for profile editing
 */
export const useProfileEditController = (userId: string | undefined) => {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [location, setLocation] = useState<GqlCurrentPrefecture | undefined>();
  const [bio, setBio] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    twitter: ''
  });

  const { data: userData, loading: userLoading, error: userError } = useProfileEditQuery(userId);
  const [updateProfile, { loading: updating }] = useProfileEditMutation();

  useEffect(() => {
    if (userData?.user) {
      const { user: userDetails } = userData;
      setDisplayName(userDetails.name);
      setProfileImage(userDetails.image ? userDetails.image : null);
      setBio(userDetails.bio || '');
      setLocation(userDetails.currentPrefecture || undefined);
      setSocialLinks({
        facebook: userDetails.urlFacebook || '',
        instagram: userDetails.urlInstagram || '',
        twitter: userDetails.urlX || '',
      });
    }
  }, [userData]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64 = base64String.split(',')[1];
        setProfileImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      toast.error('居住地を選択してください');
      return;
    }

    try {
      await updateProfile({
        variables: {
          input: {
            name: displayName,
            image: profileImage ? { file: profileImage } : undefined,
            bio,
            currentPrefecture: location as any, // Type cast to resolve compatibility issue
            urlFacebook: socialLinks.facebook,
            urlInstagram: socialLinks.instagram,
            urlX: socialLinks.twitter,
            slug: displayName.toLowerCase().replace(/\s+/g, '-'),
          },
          permission: {
            userId: userId ?? ''
          }
        },
      });
      toast.success('プロフィールを更新しました');
      router.push(`/users/${userId}`);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('プロフィールの更新に失敗しました');
    }
  };

  const formattedError = useMemo(() => {
    if (userError) {
      console.error('Error fetching user profile:', userError);
      toast.error('プロフィールの取得に失敗しました');
      return formatError(userError);
    }
    return null;
  }, [userError]);

  return {
    profileImage,
    displayName,
    location,
    bio,
    socialLinks,
    userLoading,
    error: formattedError,
    updating,
    prefectureOptions: Object.entries(prefectureLabels).map(([key, label]) => ({
      value: key as GqlCurrentPrefecture,
      label
    })),
    setDisplayName,
    setLocation,
    setBio,
    setSocialLinks,
    handleImageSelect,
    handleSave
  };
};
