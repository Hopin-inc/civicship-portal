import { notFound } from "next/navigation";
import { WalletProvider } from "@/app/[communityId]/wallets/features/shared/contexts/WalletProvider";
import { getServerMyWalletWithTransactions } from "@/app/[communityId]/wallets/features/shared/server/getServerMyWalletWithTransactions";
import { toPointNumber } from "@/utils/bigint";
import { logger } from "@/lib/logging";

export default async function WalletMeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ communityId: string }>;
}) {
  const { communityId } = await params;
  let result;
  try {
    result = await getServerMyWalletWithTransactions({ first: 20, communityId });
  } catch (error) {
    logger.error("Failed to fetch wallet data with transactions (SSR):", {
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
