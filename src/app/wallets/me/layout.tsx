import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { WalletProvider } from "@/app/wallets/features/shared/contexts/WalletProvider";
import { getServerMyWalletWithTransactions } from "@/app/wallets/features/shared/server/getServerMyWalletWithTransactions";
import { toPointNumber } from "@/utils/bigint";
import { logger } from "@/lib/logging";

export default async function WalletMeLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/login");
  }

  let result;
  try {
    result = await getServerMyWalletWithTransactions(session, { first: 20 });
  } catch (error) {
    logger.warn("Failed to fetch wallet data with transactions (SSR):", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }

  const { wallet, transactions } = result;

  if (!wallet) {
    logger.warn("No valid myWallet found");
    notFound();
  }

  const initialCurrentPoint = toPointNumber(wallet.currentPoint.toString(), 0);

  return (
    <WalletProvider
      walletId={wallet.id}
      userId={wallet.user?.id ?? "unknown"}
      initialCurrentPoint={initialCurrentPoint}
      initialTransactions={transactions}
    >
      {children}
    </WalletProvider>
  );
}
