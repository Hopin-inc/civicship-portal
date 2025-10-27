import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { WalletProvider } from "@/app/wallets/features/shared/contexts/WalletContext";
import { fetchMyMemberWalletServer } from "@/app/wallets/features/shared/server/fetchMyMemberWalletServer";

export default async function WalletMeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/login");
  }

  let walletData;
  try {
    walletData = await fetchMyMemberWalletServer(session);
  } catch (error) {
    console.error("Failed to fetch wallet data (SSR):", error);
    throw error;
  }

  return (
    <WalletProvider
      walletId={walletData.walletId}
      userId={walletData.userId}
      initialCurrentPoint={walletData.initialCurrentPoint}
      initialWalletType={walletData.initialWalletType}
    >
      {children}
    </WalletProvider>
  );
}
