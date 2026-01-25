"use client";

import { useUserProfileContext, presentUserProfile } from "@/app/[communityId]/users/features/shared";
import { UserProfileView } from "@/app/[communityId]/users/features/profile";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

export default function UserPage() {
  const { gqlUser, isOwner, portfolios } = useUserProfileContext();
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId;
  const viewModel = presentUserProfile(gqlUser, isOwner, portfolios, communityId);

  return <UserProfileView viewModel={viewModel} isOwner={isOwner} />;
}
