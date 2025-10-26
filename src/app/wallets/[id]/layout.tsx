import { cookies } from "next/headers";
import { WalletProvider } from "@/app/wallets/features/shared/contexts/WalletContext";
import { fetchWalletByUserIdServer } from "@/app/wallets/features/shared/server";
import { presentWallet } from "@/app/wallets/features/shared/mappers";
import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

interface CurrentUserData {
  currentUser: {
    id: string;
  };
}

export default async function WalletLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  let userId: string | undefined;
  let initialWallet = null;

  if (session) {
    try {
      const userData = await executeServerGraphQLQuery<CurrentUserData>(
        `query GetCurrentUser {
          currentUser {
            id
          }
        }`,
        {},
        { Authorization: `Bearer ${session}` }
      );

      userId = userData.currentUser?.id;

      if (userId) {
        const gqlWallet = await fetchWalletByUserIdServer(userId, session);
        if (gqlWallet) {
          initialWallet = presentWallet(gqlWallet, userId);
        }
      }
    } catch (error) {
      console.error("Failed to fetch wallet data (SSR):", error);
    }
  }

  return (
    <WalletProvider
      initialWallet={initialWallet}
      walletId={params.id}
      userId={userId}
    >
      {children}
    </WalletProvider>
  );
}
