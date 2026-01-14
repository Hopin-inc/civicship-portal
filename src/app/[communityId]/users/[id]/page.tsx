"use client";

import { useUserProfileContext, presentUserProfile } from "@/app/[communityId]/users/features/shared";
import { UserProfileView } from "@/app/[communityId]/users/features/profile";

export default function UserPage() {
  const { gqlUser, isOwner, portfolios } = useUserProfileContext();
  const viewModel = presentUserProfile(gqlUser, isOwner, portfolios);

  return <UserProfileView viewModel={viewModel} isOwner={isOwner} />;
}
