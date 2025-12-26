import { notFound } from "next/navigation";
import { WalletProvider } from "@/app/wallets/features/shared/contexts/WalletProvider";
import { getServerMyWalletWithTransactions } from "@/app/wallets/features/shared/server/getServerMyWalletWithTransactions";
import { toPointNumber } from "@/utils/bigint";
import { logger } from "@/lib/logging";
import { headers, cookies } from "next/headers";

export default async function WalletMeLayout({ children }: { children: React.ReactNode }) {
  // Get communityId from request headers (set by middleware) or cookies
  const headersList = await headers();
  const cookieStore = await cookies();
  const communityId = headersList.get("x-community-id") || cookieStore.get("communityId")?.value || "";
  
  let result;
  try {
    result = await getServerMyWalletWithTransactions({ communityId, first: 20 });
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
