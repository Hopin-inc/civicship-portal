import { DonatePointContent } from "@/app/wallets/features/donate/components/DonatePointContent";
import { getServerMemberWallets } from "@/hooks/members/server";
import { fetchPrivateUserServer } from "@/app/users/features/shared/server";

interface DonatePointPageProps {
  searchParams: Promise<{ currentPoint?: string }>;
}

export default async function DonatePointPage({ searchParams }: DonatePointPageProps) {
  const params = await searchParams;
  const currentPointString = params.currentPoint ?? "0";
  const currentUser = await fetchPrivateUserServer();
  const initialMembers = await getServerMemberWallets({ first: 20 });

  return (
    <DonatePointContent
      currentUser={currentUser}
      currentPointString={currentPointString}
      initialMembers={initialMembers}
    />
  );
}
