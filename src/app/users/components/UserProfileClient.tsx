"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { UserProfileViewModel } from "@/app/users/types";
import { UserProfileView } from "./UserProfileView";

interface UserProfileClientProps {
  viewModel: UserProfileViewModel;
}

export function UserProfileClient({ viewModel }: UserProfileClientProps) {
  const { user: currentUser } = useAuth();
  const isOwner = currentUser?.id === viewModel.id;
  
  return <UserProfileView viewModel={viewModel} isOwner={isOwner} />;
}
