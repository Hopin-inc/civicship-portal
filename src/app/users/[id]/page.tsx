import { notFound } from "next/navigation";
import { fetchPublicUserServer } from "@/app/users/data/fetchPublicUserServer";
import { presenterPublicUserProfileViewModel } from "@/app/users/data/presenter";
import { UserProfileContainer } from "./UserProfile.container.client";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function UserPage({ params }: PageProps) {
  const { id } = params;
  
  const gqlUser = await fetchPublicUserServer(id);
  
  if (!gqlUser) {
    notFound();
  }

  const viewModel = presenterPublicUserProfileViewModel(gqlUser, false);

  return <UserProfileContainer viewModel={viewModel} currentUserId={null} />;
}
