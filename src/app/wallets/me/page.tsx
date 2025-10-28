import { WalletOverview } from "@/app/wallets/features/overview/WalletOverview";
import { TransactionList } from "@/app/wallets/features/transactions/TransactionList";

export default function WalletMePage() {
  return (
    <div className="max-w-xl mx-auto mt-8 px-4">
      <WalletOverview />
      <TransactionList />
    </div>
  );
}
