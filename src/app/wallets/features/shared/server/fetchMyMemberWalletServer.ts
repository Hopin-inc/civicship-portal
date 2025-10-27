import { notFound } from "next/navigation";
import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { toPointNumber } from "@/utils/bigint";
import { GET_MY_WALLET_SERVER_QUERY } from "@/graphql/account/wallet/server";

interface MyWalletData {
  myWallet: {
    id: string;
    type: string;
    currentPointView: { currentPoint: string } | null;
    user: { id: string } | null;
    community: { id: string } | null;
  } | null;
}

export interface MyMemberWalletResult {
  walletId: string;
  userId: string;
  initialCurrentPoint: number;
}

export async function fetchMyMemberWalletServer(session: string): Promise<MyMemberWalletResult> {
  let walletData: MyWalletData | null = null;
  try {
    walletData = await executeServerGraphQLQuery<MyWalletData>(
      GET_MY_WALLET_SERVER_QUERY,
      {},
      { Authorization: `Bearer ${session}` },
    );
  } catch (error: any) {
    console.error("[fetchMyMemberWalletServer] Failed to fetch myWallet:", error);
  }

  const wallet = walletData?.myWallet;

  if (!wallet || wallet.community?.id !== COMMUNITY_ID) {
    console.warn("[fetchMyMemberWalletServer] No valid myWallet found", {
      wallet,
      communityId: COMMUNITY_ID,
    });
    notFound();
  }

  const initialCurrentPoint = toPointNumber(wallet.currentPointView?.currentPoint, 0);

  return {
    walletId: wallet.id,
    userId: wallet.user?.id ?? "unknown",
    initialCurrentPoint,
  };
}
