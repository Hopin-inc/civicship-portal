import { WalletOverview } from "@/app/wallets/features/overview/WalletOverview";
import { TransactionList } from "@/app/wallets/features/transactions/TransactionList";
import { getServerMyWalletWithTransactions } from "@/app/wallets/features/shared/server/getServerMyWalletWithTransactions";
import { redirect } from "next/navigation";

export default async function WalletMePage() {
  const { wallet, transactions } = await getServerMyWalletWithTransactions({ first: 20 });

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
