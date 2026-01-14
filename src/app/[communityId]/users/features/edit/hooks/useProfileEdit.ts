"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { GqlCurrentPrefecture, useUpdateMyProfileMutation } from "@/types/graphql";
import { GeneralUserProfile } from "@/app/[communityId]/users/features/shared/types";
import { mapGqlUserToProfile } from "@/app/[communityId]/users/features/shared/mappers";
import { prefectureOptions as prefectureEnumValues } from "@/shared/prefectures/constants";
import { logger } from "@/lib/logging";
import { useUserProfileContext } from "@/app/[communityId]/users/features/shared/contexts/UserProfileContext";
import { useTranslations, useLocale } from "next-intl";
import { getPrefectureKey } from "@/lib/i18n/prefectures";

const useProfileEdit = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { gqlUser, userId } = useUserProfileContext();

  const [profile, setProfile] = useState<GeneralUserProfile>(() => mapGqlUserToProfile(gqlUser));

  const [updateProfile, { loading: updating }] = useUpdateMyProfileMutation();

  const setSocialLinks = (links: { facebook: string; instagram: string; twitter: string }) => {
    setProfile((prev) => ({
      ...prev,
      urlFacebook: links.facebook,
      urlInstagram: links.instagram,
      urlX: links.twitter,
    }));
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfile((prev) => ({
      ...prev,
      image: file,
      imagePreviewUrl: imageUrl,
    }));
  };

  useEffect(() => {
    return () => {
      if (profile.imagePreviewUrl && profile.imagePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(profile.imagePreviewUrl);
      }
    };
  }, [profile.imagePreviewUrl]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile.currentPrefecture) {
      toast.error(t("users.edit.toast.missingResidence"));
      return;
    }

    try {
      await updateProfile({
        variables: {
          input: {
            name: profile.name,
            image:
              profile.image instanceof File && profile.image.size > 0
                ? { file: profile.image }
                : undefined,
            bio: profile.bio ?? "",
            currentPrefecture: profile.currentPrefecture,
            urlFacebook: profile.urlFacebook ?? "",
            urlInstagram: profile.urlInstagram ?? "",
            urlX: profile.urlX ?? "",
            slug: profile.name.toLowerCase().replace(/\s+/g, "-"),
          },
          permission: {
            userId: userId ?? "",
          },
        },
      });
      toast.success(t("users.edit.toast.updated"));
      router.push(`/users/me`);
    } catch (err) {
      logger.warn("Failed to update profile", {
        error: err instanceof Error ? err.message : String(err),
        component: "useProfileEdit",
        userId,
      });
      toast.error(t("users.edit.toast.updateFailed"));
    }
  };

  const prefectureOptions = useMemo(
    () =>
      prefectureEnumValues.map((value) => ({
        value,
        label: t(getPrefectureKey(value)),
      })),
    [t, locale],
  );

  return {
    profileImage: profile.imagePreviewUrl || gqlUser.image || null,
    displayName: profile.name,
    location: profile.currentPrefecture,
    bio: profile.bio ?? "",
    socialLinks: {
      facebook: profile.urlFacebook ?? "",
      instagram: profile.urlInstagram ?? "",
      twitter: profile.urlX ?? "",
    },
    phone: profile.phone,
    userLoading: false,
    error: null,
    updating,
    prefectureOptions,
    setDisplayName: (name: string) => setProfile((prev) => ({ ...prev, name })),
    setLocation: (location: GqlCurrentPrefecture | undefined) =>
      setProfile((prev) => ({ ...prev, currentPrefecture: location })),
    setBio: (bio: string) => setProfile((prev) => ({ ...prev, bio })),
    setSocialLinks,
    handleImageSelect,
    handleSave,
  };
};

export default useProfileEdit;
