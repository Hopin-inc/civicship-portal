import { Header } from "@/app/[communityId]/transactions/components/Header";
import { getServerCommunityTransactions } from "@/hooks/transactions/server";
import { InfiniteTransactionList } from "@/shared/transactions/components/InfiniteTransactionList";
import { getTranslations } from "next-intl/server";

export default async function TransactionsPage({ params }: { params: Promise<{ communityId: string }> }) {
  const t = await getTranslations();
  const { communityId } = await params;
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
