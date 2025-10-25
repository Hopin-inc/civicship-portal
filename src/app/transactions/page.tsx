import { Header } from "@/app/transactions/components/Header";
import { getServerCommunityTransactions } from "@/hooks/transactions/server";
import { InfiniteTransactionList } from "./components/InfiniteTransactionList";
import { getCommunityIdFromRequest } from "@/lib/communities/server-resolve";

export default async function TransactionsPage() {
    const communityId = getCommunityIdFromRequest();
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
                まだ交換したことがありません
            </p>
            ) : (
            <InfiniteTransactionList initialTransactions={transactions} />
            )}
        </div>
        </>
    );
}
