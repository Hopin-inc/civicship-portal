"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { UserProfileViewModel } from "@/app/users/data/view-model";
import { UserProfileView } from "../presentation/UserProfileView";

interface UserProfileContainerProps {
  viewModel: UserProfileViewModel;
  currentUserId?: string | null;
}

export function UserProfileContainer({ viewModel, currentUserId }: UserProfileContainerProps) {
  const { user: currentUser } = useAuth();
  
  const isOwner = currentUser?.id === viewModel.id;

  return <UserProfileView viewModel={viewModel} isOwner={isOwner} />;
}
