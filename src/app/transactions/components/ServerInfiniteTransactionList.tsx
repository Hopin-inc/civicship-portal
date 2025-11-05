import { getServerCommunityTransactions } from "@/hooks/transactions/server-community-transactions";
import { InfiniteTransactionList } from "./InfiniteTransactionList";

export async function ServerInfiniteTransactionList() {
  const initialTransactions = await getServerCommunityTransactions({ first: 20 });
  
  return <InfiniteTransactionList initialTransactions={initialTransactions} />;
}
