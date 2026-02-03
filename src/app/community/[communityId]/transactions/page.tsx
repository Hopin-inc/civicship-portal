import { notFound } from "next/navigation";
import { Header } from "@/app/community/[communityId]/transactions/components/Header";
import { getServerCommunityTransactions } from "@/hooks/transactions/server";
import { InfiniteTransactionList } from "@/shared/transactions/components/InfiniteTransactionList";
import { getTranslations } from "next-intl/server";
import { getCommunityIdFromHeader } from "@/lib/community/get-community-id-server";

export default async function TransactionsPage() {
  const t = await getTranslations();
  const communityId = await getCommunityIdFromHeader();

  if (!communityId) {
    notFound();
  }

  const transactions = await getServerCommunityTransactions({
    communityId,
    first: 20,
  });
  return (
    <>
      <Header />
      <div className="mt-6 px-4">
        {transactions.edges?.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center pt-6">
            {t("transactions.empty")}
          </p>
        ) : (
          <InfiniteTransactionList 
            initialTransactions={transactions}
            enableClickNavigation={true}
          />
        )}
      </div>
    </>
  );
}
