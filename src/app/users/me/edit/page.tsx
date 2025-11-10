"use client";

import React, { useMemo } from "react";
import { useProfileEdit, UserProfileEdit } from "@/app/users/features/edit";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useTranslations } from "next-intl";

export default function ProfileEditPage() {
  const t = useTranslations();
  const headerConfig = useMemo(
    () => ({
      title: t("users.edit.pageTitle"),
      showLogo: false,
      showBackButton: true,
    }),
    [t],
  );
  useHeaderConfig(headerConfig);

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
    return <ErrorState title={t("users.edit.errorTitle")} />;
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
