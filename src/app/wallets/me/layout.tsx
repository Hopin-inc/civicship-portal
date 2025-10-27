import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { WalletProvider } from "@/app/wallets/features/shared/contexts/WalletContext";
import { fetchMyMemberWalletServer } from "@/app/wallets/features/shared/server/fetchMyMemberWalletServer";
import { logger } from "@/lib/logging";

export default async function WalletMeLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/login");
  }

  let res;
  try {
    res = await fetchMyMemberWalletServer(session);
  } catch (error) {
    logger.error("Failed to fetch wallet data (SSR):", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }

  return (
    <WalletProvider
      walletId={res.walletId}
      userId={res.userId}
      initialCurrentPoint={res.initialCurrentPoint}
    >
      {children}
    </WalletProvider>
  );
}
