import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { WalletProvider } from "@/app/wallets/features/shared/contexts/WalletContext";
import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlWalletType } from "@/types/graphql";
import { toPointNumber } from "@/utils/bigint";

interface CurrentUserData {
  currentUser: {
    id: string;
  };
}

interface WalletData {
  wallet: {
    id: string;
    type: string;
    currentPointView: {
      currentPoint: string;
    } | null;
    user: {
      id: string;
      name: string;
      image: string | null;
    } | null;
    community: {
      id: string;
      name: string;
    } | null;
  } | null;
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

  if (!session) {
    redirect("/login");
  }

  let userId: string | undefined;
  let initialCurrentPoint = 0;
  let initialWalletType: 'MEMBER' | 'COMMUNITY' = 'MEMBER';

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

    if (!userId) {
      redirect("/login");
    }

    const walletData = await executeServerGraphQLQuery<WalletData>(
      `query GetWalletById($id: ID!) {
        wallet(id: $id) {
          id
          type
          currentPointView {
            currentPoint
          }
          user {
            id
            name
            image
          }
          community {
            id
            name
          }
        }
      }`,
      { id: params.id },
      { Authorization: `Bearer ${session}` }
    );

    const wallet = walletData.wallet;

    if (!wallet) {
      notFound();
    }

    if (wallet.community?.id !== COMMUNITY_ID) {
      notFound();
    }

    if (wallet.user?.id !== userId) {
      notFound();
    }

    if (wallet.type !== GqlWalletType.Member) {
      notFound();
    }

    const pointString = wallet.currentPointView?.currentPoint;
    initialCurrentPoint = toPointNumber(pointString, 0);
    initialWalletType = wallet.type === GqlWalletType.Community ? 'COMMUNITY' : 'MEMBER';

  } catch (error) {
    console.error("Failed to fetch wallet data (SSR):", error);
    notFound();
  }

  return (
    <WalletProvider
      walletId={params.id}
      userId={userId}
      initialCurrentPoint={initialCurrentPoint}
      initialWalletType={initialWalletType}
    >
      {children}
    </WalletProvider>
  );
}
