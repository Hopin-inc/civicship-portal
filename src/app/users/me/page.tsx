import { redirect } from "next/navigation";
import { fetchPrivateUserServer } from "@/app/users/data";
import { presentUserProfile } from "@/app/users/presenters";
import { UserProfileClient } from "@/app/users/components";

export const dynamic = 'force-dynamic';

export default async function MyProfilePage() {
  const ssrUser = await fetchPrivateUserServer();

  if (!ssrUser) {
    redirect('/login');
  }

  const viewModel = presentUserProfile(ssrUser, true);

  return <UserProfileClient viewModel={viewModel} />;
}
