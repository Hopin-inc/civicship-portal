import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { WalletProvider } from "@/app/wallets/features/shared/contexts/WalletContext";
import { TransactionsInitialProvider } from "@/app/wallets/features/shared/contexts/TransactionsInitialContext";
import { getServerMyWalletWithTransactions } from "@/hooks/wallet/server";
import { toPointNumber } from "@/utils/bigint";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
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
    logger.error("Failed to fetch wallet data with transactions (SSR):", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }

  const { wallet, transactions } = result;

  if (!wallet || wallet.community?.id !== COMMUNITY_ID) {
    logger.warn("No valid myWallet found", {
      wallet,
      communityId: COMMUNITY_ID,
    });
    notFound();
  }

  const initialCurrentPoint = toPointNumber(wallet.currentPoint.toString(), 0);

  return (
    <WalletProvider
      walletId={wallet.id}
      userId={wallet.user?.id ?? "unknown"}
      initialCurrentPoint={initialCurrentPoint}
    >
      <TransactionsInitialProvider initialTransactions={transactions}>
        {children}
      </TransactionsInitialProvider>
    </WalletProvider>
  );
}
