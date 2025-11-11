import { getServerCommunityTransactions } from "@/hooks/transactions/server";
import { getServerCommunityMembers } from "./hooks/server-community-members";
import { CommunityTabs } from "./components/CommunityTabs";
import { getTranslations } from "next-intl/server";

export default async function CommunityPage() {
  const t = await getTranslations();
  const transactions = await getServerCommunityTransactions({
    first: 20,
  });
  const members = await getServerCommunityMembers({
    first: 20,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {t("community.title")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {t("community.description")}
          </p>
        </div>
      </div>

      <div className="pb-8">
        <CommunityTabs initialTransactions={transactions} initialMembers={members} />
      </div>
    </div>
  );
}
