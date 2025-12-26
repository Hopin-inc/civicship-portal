import { WalletOverview } from "@/app/wallets/features/overview/WalletOverview";
import { TransactionList } from "@/app/wallets/features/transactions/TransactionList";
import { getServerMyWalletWithTransactions } from "@/app/wallets/features/shared/server/getServerMyWalletWithTransactions";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";

export default async function WalletMePage() {
  // Get communityId from request headers (set by middleware) or cookies
  const headersList = await headers();
  const cookieStore = await cookies();
  const communityId = headersList.get("x-community-id") || cookieStore.get("communityId")?.value || "";
  
  const { wallet, transactions } = await getServerMyWalletWithTransactions({ communityId, first: 20 });

  if (!wallet) {
    redirect("/login");
  }

  return (
    <div className="max-w-xl mx-auto mt-8 px-4">
      <WalletOverview />
      <TransactionList walletId={wallet.id} initialTransactions={transactions} />
    </div>
  );
}
