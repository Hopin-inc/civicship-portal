import { Header } from "@/app/transactions/components/Header";
import { getServerCommunityTransactions } from "@/hooks/transactions/server";
import { InfiniteTransactionList } from "@/shared/transactions/components/InfiniteTransactionList";
import { getTranslations } from "next-intl/server";
import { headers, cookies } from "next/headers";

export default async function TransactionsPage() {
  // Get communityId from request headers (set by middleware) or cookies
  const headersList = await headers();
  const cookieStore = await cookies();
  const communityId = headersList.get("x-community-id") || cookieStore.get("communityId")?.value || "";
  
  const t = await getTranslations();
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
