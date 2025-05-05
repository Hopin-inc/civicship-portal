'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_PROFILE } from '@/graphql/queries/user';
import { UPDATE_MY_PROFILE } from '@/graphql/mutations/user';
import { UserProfileEdit } from '@/app/components/features/user/UserProfileEdit';
import { LoadingIndicator } from '@/app/components/shared/LoadingIndicator';
import { ErrorState } from '@/app/components/shared/ErrorState';
import { toast } from 'sonner';
import { CurrentPrefecture } from '@/gql/graphql';

export default function ProfileEditPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [location, setLocation] = useState<CurrentPrefecture | undefined>();
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
            image: profileImage ? { file: profileImage } : undefined,
            bio,
            currentPrefecture: location,
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

  if (userLoading) {
    return <LoadingIndicator />;
  }

  if (userError) {
    return <ErrorState message="プロフィールの取得に失敗しました" />;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 h-14 px-4 flex items-center justify-between border-b bg-white z-10">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="mr-4">
            <ChevronLeft />
          </button>
          <h1 className="text-lg font-semibold">プロフィール編集</h1>
        </div>
      </header>

      <main className="pt-20 px-4 pb-24 max-w-md mx-auto">
        <UserProfileEdit
          profileImage={profileImage}
          displayName={displayName}
          location={location}
          bio={bio}
          socialLinks={socialLinks}
          updating={updating}
          setDisplayName={setDisplayName}
          setLocation={setLocation}
          setBio={setBio}
          setSocialLinks={setSocialLinks}
          handleImageSelect={handleImageSelect}
          handleSave={handleSave}
        />
      </main>
    </div>
  );
}
