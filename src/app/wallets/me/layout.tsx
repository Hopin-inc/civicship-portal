import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { WalletProvider } from "@/app/wallets/features/shared/contexts/WalletContext";
import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlWalletType } from "@/types/graphql";
import { toPointNumber } from "@/utils/bigint";
import { 
  GET_CURRENT_USER_ID_SERVER_QUERY, 
  GET_MEMBER_WALLETS_SERVER_QUERY 
} from "@/graphql/account/wallet/server";

interface CurrentUserData {
  currentUser: {
    id: string;
  };
}

interface MemberWalletsData {
  wallets: {
    edges: Array<{
      node: {
        id: string;
        type: string;
        currentPointView: {
          currentPoint: string;
        } | null;
        community: {
          id: string;
        } | null;
      };
    }>;
  };
}

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

  let userId: string | undefined;
  let walletId: string | undefined;
  let initialCurrentPoint = 0;
  let initialWalletType: 'MEMBER' | 'COMMUNITY' = 'MEMBER';

  try {
    const userData = await executeServerGraphQLQuery<CurrentUserData>(
      GET_CURRENT_USER_ID_SERVER_QUERY,
      {},
      { Authorization: `Bearer ${session}` }
    );

    userId = userData.currentUser?.id;

    if (!userId) {
      redirect("/login");
    }

    const walletsData = await executeServerGraphQLQuery<MemberWalletsData>(
      GET_MEMBER_WALLETS_SERVER_QUERY,
      {
        filter: {
          type: GqlWalletType.Member,
          userId: userId,
          communityId: COMMUNITY_ID,
        }
      },
      { Authorization: `Bearer ${session}` }
    );

    const wallet = walletsData.wallets?.edges?.[0]?.node;

    if (!wallet) {
      notFound();
    }

    if (wallet.community?.id !== COMMUNITY_ID) {
      notFound();
    }

    if (wallet.type !== GqlWalletType.Member) {
      notFound();
    }

    walletId = wallet.id;
    const pointString = wallet.currentPointView?.currentPoint;
    initialCurrentPoint = toPointNumber(pointString, 0);
    initialWalletType = wallet.type === GqlWalletType.Community ? 'COMMUNITY' : 'MEMBER';

  } catch (error) {
    console.error("Failed to fetch wallet data (SSR):", error);
    notFound();
  }

  return (
    <WalletProvider
      walletId={walletId!}
      userId={userId}
      initialCurrentPoint={initialCurrentPoint}
      initialWalletType={initialWalletType}
    >
      {children}
    </WalletProvider>
  );
}
