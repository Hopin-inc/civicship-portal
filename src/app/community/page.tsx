import { getServerCommunityTransactions } from "@/hooks/transactions/server";
import { CommunityTabs } from "./components/CommunityTabs";

export default async function CommunityPage() {
  const transactions = await getServerCommunityTransactions({
    first: 20,
  });

  return (
    <div className="min-h-screen">
      <div className="pt-4 pb-8">
        <CommunityTabs initialTransactions={transactions} />
      </div>
    </div>
  );
}
