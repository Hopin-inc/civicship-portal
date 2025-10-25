"use client";

import { useUserProfileContext } from "@/app/users/features/shared/contexts/UserProfileContext";
import { presentUserProfile } from "@/app/users/features/shared/mappers";
import { UserProfileView } from "@/app/users/features/profile/components/UserProfileView";

export default function UserPage() {
  const { gqlUser, isOwner } = useUserProfileContext();
  const viewModel = presentUserProfile(gqlUser, isOwner);

  return <UserProfileView viewModel={viewModel} isOwner={isOwner} />;
}
