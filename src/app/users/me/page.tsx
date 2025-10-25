"use client";

import { useUserProfileContext } from "@/app/users/features/shared/contexts/UserProfileContext";
import { presentUserProfile } from "@/app/users/features/shared/mappers";
import { UserProfileView } from "@/app/users/features/profile";

export default function MyProfilePage() {
  const { gqlUser, isOwner } = useUserProfileContext();
  const viewModel = presentUserProfile(gqlUser, isOwner);

  return <UserProfileView viewModel={viewModel} isOwner={isOwner} />;
}
