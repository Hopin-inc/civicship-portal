"use client";

import { useUserProfileContext, presentUserProfile } from "@/app/users/features/shared";
import { UserProfileView } from "@/app/users/features/profile";

export default function UserPage() {
  const { gqlUser, isOwner } = useUserProfileContext();
  const viewModel = presentUserProfile(gqlUser, isOwner);

  return <UserProfileView viewModel={viewModel} isOwner={isOwner} />;
}
