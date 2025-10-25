import { redirect } from "next/navigation";
import { fetchProfileServer } from "@/app/users/me/libs/fetchProfileServer";
import { presenterPublicUserProfileViewModel } from "@/app/users/data/presenter";
import { UserProfileContainer } from "../[id]/UserProfile.container.client";

export const dynamic = 'force-dynamic';

export default async function MyProfilePage() {
  const ssrUser = await fetchProfileServer();

  if (!ssrUser) {
    redirect('/login');
  }

  const viewModel = presenterPublicUserProfileViewModel(ssrUser, true);

  return <UserProfileContainer viewModel={viewModel} currentUserId={ssrUser.id} />;
}
