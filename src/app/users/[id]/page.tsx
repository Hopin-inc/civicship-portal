"use client";

import { useUserProfileContext } from "@/app/users/contexts/UserProfileContext";
import { presentUserProfile } from "@/app/users/presenters";
import { UserProfileView } from "@/app/users/components";

export default function UserPage() {
  const { gqlUser, isOwner } = useUserProfileContext();
  const viewModel = presentUserProfile(gqlUser, isOwner);

  return <UserProfileView viewModel={viewModel} isOwner={isOwner} />;
}
