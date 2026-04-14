import { notFound } from "next/navigation";
import { getServerCommunityWalletWithTransactions } from "./features/server/getServerCommunityWalletWithTransactions";
import { AdminWalletClient } from "./AdminWalletClient";

export default async function WalletPage() {
  const { wallet, transactions } = await getServerCommunityWalletWithTransactions({ first: 20 });

  if (!wallet) {
    notFound();
  }

  // wallet is non-null here: notFound() throws above when wallet is null
  return <AdminWalletClient initialWallet={wallet!} initialTransactions={transactions} />;
}
