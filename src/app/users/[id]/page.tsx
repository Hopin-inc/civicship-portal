import { notFound } from "next/navigation";
import { fetchPublicUserServer } from "@/app/users/data";
import { presentUserProfile } from "@/app/users/presenters";
import { UserProfileClient } from "@/app/users/components";

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

  const viewModel = presentUserProfile(gqlUser, false);

  return <UserProfileClient viewModel={viewModel} />;
}
