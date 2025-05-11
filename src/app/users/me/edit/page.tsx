'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileEdit } from '@/hooks/features/user/useProfileEdit';
import { UserProfileEdit } from '@/components/features/user/UserProfileEdit';
import { LoadingIndicator } from '@/components/shared/LoadingIndicator';
import { ErrorState } from '@/components/shared/ErrorState';
import { useHeaderConfig } from '@/hooks/core/useHeaderConfig';

export default function ProfileEditPage() {
  const headerConfig = useMemo(() => ({
    title: "プロフィール編集",
    showBackButton: true,
    showLogo: false,
  }), []);
  useHeaderConfig(headerConfig);
  
  const router = useRouter();
  const {
    profileImage,
    displayName,
    location,
    bio,
    socialLinks,
    userLoading,
    error,
    updating,
    setDisplayName,
    setLocation,
    setBio,
    setSocialLinks,
    handleImageSelect,
    handleSave
  } = useProfileEdit();

  if (userLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorState message="プロフィールの取得に失敗しました" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="px-4 pb-24 max-w-md mx-auto">
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
