'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useProfileEdit } from '@/hooks/features/user/useProfileEdit';
import { UserProfileEdit } from '@/app/components/features/user/UserProfileEdit';
import { LoadingIndicator } from '@/app/components/shared/LoadingIndicator';
import { ErrorState } from '@/app/components/shared/ErrorState';

export default function ProfileEditPage() {
  const router = useRouter();
  const {
    profileImage,
    displayName,
    location,
    bio,
    socialLinks,
    userLoading,
    userError,
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
