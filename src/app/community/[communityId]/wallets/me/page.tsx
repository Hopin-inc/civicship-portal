import { WalletOverview } from "@/app/community/[communityId]/wallets/features/overview/WalletOverview";
import { TransactionList } from "@/app/community/[communityId]/wallets/features/transactions/TransactionList";
import { getServerMyWalletWithTransactions } from "@/app/community/[communityId]/wallets/features/shared/server/getServerMyWalletWithTransactions";
import { appRedirect } from "@/lib/navigation/server";

export default async function WalletMePage() {
  const { wallet, transactions } = await getServerMyWalletWithTransactions({ first: 20 });

  if (!wallet) {
    await appRedirect("/login");
  }

  return (
    <div className="max-w-xl mx-auto mt-8 px-4">
      <WalletOverview />
      <TransactionList walletId={wallet.id} initialTransactions={transactions} />
    </div>
  );
}
