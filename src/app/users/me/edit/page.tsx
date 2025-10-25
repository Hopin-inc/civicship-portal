"use client";

import React from "react";
import useProfileEdit from "@/app/users/features/edit/hooks/useProfileEdit";
import UserProfileEdit from "@/app/users/features/edit/components/UserProfileEdit";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";

export default function ProfileEditPage() {
  const {
    profileImage,
    displayName,
    location,
    bio,
    socialLinks,
    phone,
    userLoading,
    error,
    updating,
    setDisplayName,
    setLocation,
    setBio,
    setSocialLinks,
    handleImageSelect,
    handleSave,
  } = useProfileEdit();

  if (userLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorState title="プロフィールを読み込めませんでした" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="px-6 py-6 pb-24 max-w-md mx-auto">
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
          phone={phone}
        />
      </main>
    </div>
  );
}
