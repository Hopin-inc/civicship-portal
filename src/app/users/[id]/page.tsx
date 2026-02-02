"use client";

import { useUserProfileContext, presentUserProfile } from "@/app/users/features/shared";
import { UserProfileView } from "@/app/users/features/profile";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

export default function UserPage() {
  const { gqlUser, isOwner, portfolios } = useUserProfileContext();
  const config = useCommunityConfig();
  const viewModel = presentUserProfile(gqlUser, config?.communityId ?? "", isOwner, portfolios);

  return <UserProfileView viewModel={viewModel} isOwner={isOwner} />;
}
