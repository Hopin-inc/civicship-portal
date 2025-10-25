"use client";

import { useUserProfileContext } from "@/app/users/features/contexts/UserProfileContext";
import { presentUserProfile } from "../features/presenters";
import { UserProfileView } from "../features/components";

export default function UserPage() {
  const { gqlUser, isOwner } = useUserProfileContext();
  const viewModel = presentUserProfile(gqlUser, isOwner);

  return <UserProfileView viewModel={viewModel} isOwner={isOwner} />;
}
