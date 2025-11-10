import { WalletOverview } from "@/app/wallets/features/overview/WalletOverview";
import { TransactionList } from "@/app/wallets/features/transactions/TransactionList";
import { getServerMyWalletWithTransactions } from "@/app/wallets/features/shared/server/getServerMyWalletWithTransactions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function WalletMePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/login");
  }

  const { wallet, transactions } = await getServerMyWalletWithTransactions(session, { first: 20 });

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
