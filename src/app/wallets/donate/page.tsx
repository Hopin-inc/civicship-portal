import { DonatePointContent } from "@/app/wallets/features/donate/components/DonatePointContent";
import { getServerMemberWallets } from "@/hooks/members/server";
import { fetchPrivateUserServer } from "@/app/users/features/shared/server";
import { Tabs } from "@/app/admin/wallet/grant/types/tabs";

interface DonatePointPageProps {
  searchParams: Promise<{ currentPoint?: string; tab?: string }>;
}

export default async function DonatePointPage({ searchParams }: DonatePointPageProps) {
  const params = await searchParams;
  const currentPointString = params.currentPoint ?? "0";
  const tab = params.tab === "history" ? Tabs.History : Tabs.Member;
  const currentUser = await fetchPrivateUserServer();
  const initialMembers = await getServerMemberWallets({ first: 20 });

  return (
    <DonatePointContent
      currentUser={currentUser}
      currentPointString={currentPointString}
      initialMembers={initialMembers}
      initialActiveTab={tab}
    />
  );
}
