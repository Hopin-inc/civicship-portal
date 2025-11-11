import { getServerCommunityTransactions } from "@/hooks/transactions/server";
import { getServerCommunityMembers } from "./hooks/server-community-members";
import { CommunityTabs } from "./components/CommunityTabs";
import { currentCommunityMetadata } from "@/lib/communities/metadata";

export default async function CommunityPage() {
  const communityMetadata = currentCommunityMetadata;
  const transactions = await getServerCommunityTransactions({
    first: 20,
  });
  const members = await getServerCommunityMembers({
    first: 20,
  });

  return (
    <div className="min-h-screen">
      <div className="pt-4 pb-8">
        <CommunityTabs initialTransactions={transactions} initialMembers={members} />
      </div>
    </div>
  );
}
