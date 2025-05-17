"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  GqlCurrentPrefecture,
  useGetUserFlexibleQuery,
  useUpdateMyProfileMutation,
} from "@/types/graphql";
import { GeneralUserProfile } from "@/app/users/data/type";
import { prefectureLabels, presenterUserProfile } from "@/app/users/data/presenter";

const useProfileEdit = () => {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id;

  const [profile, setProfile] = useState<GeneralUserProfile>({
    name: "",
    image: null,
    bio: "",
    currentPrefecture: undefined,
    urlFacebook: "",
    urlInstagram: "",
    urlX: "",
    phone: "",
  });

  const {
    data,
    loading: userLoading,
    error: userError,
  } = useGetUserFlexibleQuery({
    variables: {
      id: userId ?? "",
      withOpportunities: false,
      withPortfolios: false,
      withWallets: false,
    },
    skip: !userId,
  });

  const [updateProfile, { loading: updating }] = useUpdateMyProfileMutation();

  // 初期データの取り込み
  useEffect(() => {
    if (data?.user) {
      setProfile(presenterUserProfile(data.user));
    }
  }, [data]);

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

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64 = base64String.split(",")[1];
      setProfile((prev) => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!profile.currentPrefecture) {
      toast.error("居住地を選択してください");
      return;
    }

    try {
      await updateProfile({
        variables: {
          input: {
            name: profile.name,
            image: profile.image ? { file: profile.image } : undefined,
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
      toast.success("プロフィールを更新しました");
      router.push(`/users/${userId}`);
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("プロフィールの更新に失敗しました");
    }
  };

  const prefectureOptions = useMemo(
    () =>
      Object.entries(prefectureLabels).map(([key, label]) => ({
        value: key as GqlCurrentPrefecture,
        label,
      })),
    [],
  );

  const formattedError = useMemo(() => {
    if (userError) {
      console.error("Error fetching user profile:", userError);
      toast.error("プロフィールの取得に失敗しました");
    }
    return null;
  }, [userError]);

  return {
    profileImage: profile.image,
    displayName: profile.name,
    location: profile.currentPrefecture,
    bio: profile.bio ?? "",
    socialLinks: {
      facebook: profile.urlFacebook ?? "",
      instagram: profile.urlInstagram ?? "",
      twitter: profile.urlX ?? "",
    },
    phone: profile.phone,
    userLoading,
    error: formattedError,
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
