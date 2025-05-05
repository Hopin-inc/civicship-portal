'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { prefectureLabels } from '@/utils/userUtils';
import { GqlCurrentPrefecture } from '@/types/graphql';
import { GET_USER_PROFILE } from '@/graphql/queries/user';
import { UPDATE_MY_PROFILE } from '@/graphql/mutations/user';

interface ProfileFormData {
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

/**
 * Custom hook for editing user profile
 */
export const useProfileEdit = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [location, setLocation] = useState<GqlCurrentPrefecture | undefined>();
  const [bio, setBio] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    twitter: ''
  });

  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER_PROFILE, {
    variables: { 
      id: user?.id ?? '',
    },
    skip: !user?.id,
  });

  const [updateProfile, { loading: updating }] = useMutation(UPDATE_MY_PROFILE);

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
            image: profileImage ? { file: profileImage } : null,
            bio,
            currentPrefecture: location as any, // Type cast to resolve compatibility issue
            urlFacebook: socialLinks.facebook,
            urlInstagram: socialLinks.instagram,
            urlX: socialLinks.twitter,
            slug: displayName.toLowerCase().replace(/\s+/g, '-'),
          },
          permission: {
            userId: user?.id ?? ''
          }
        },
      });
      toast.success('プロフィールを更新しました');
      router.push(`/users/${user?.id}`);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('プロフィールの更新に失敗しました');
    }
  };

  return {
    profileImage,
    displayName,
    location,
    bio,
    socialLinks,
    userLoading,
    userError,
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

export default useProfileEdit;
