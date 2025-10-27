import { notFound } from "next/navigation";
import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlWalletType } from "@/types/graphql";
import { toPointNumber } from "@/utils/bigint";
import { GET_MEMBER_WALLETS_SERVER_QUERY } from "@/graphql/account/wallet/server";

interface MemberWalletsData {
  wallets: {
    edges: Array<{
      node: {
        id: string;
        type: string;
        currentPointView: { currentPoint: string } | null;
        community: { id: string } | null;
      };
    }>;
  };
}

export interface MyMemberWalletResult {
  walletId: string;
  userId: string;
  initialCurrentPoint: number;
  initialWalletType: "MEMBER" | "COMMUNITY";
}

export async function fetchMyMemberWalletServer(session: string): Promise<MyMemberWalletResult> {
  const userId = "cmh8cymuv00008zp26ed7n42i";

  let walletsData: MemberWalletsData | null = null;
  try {
    walletsData = await executeServerGraphQLQuery<MemberWalletsData>(
      GET_MEMBER_WALLETS_SERVER_QUERY,
      {
        filter: {
          type: GqlWalletType.Member,
          userId,
          communityId: COMMUNITY_ID,
        },
      },
      { Authorization: `Bearer ${session}` },
    );
  } catch (error: any) {
    console.error("[fetchMyMemberWalletServer] Failed to fetch wallets:", error);
    throw new Error("ウォレット情報の取得に失敗しました。");
  }

  const wallet = walletsData?.wallets?.edges?.[0]?.node;

  if (!wallet || wallet.community?.id !== COMMUNITY_ID || wallet.type !== GqlWalletType.Member) {
    console.warn("[fetchMyMemberWalletServer] No valid member wallet found", {
      wallet,
      communityId: COMMUNITY_ID,
    });
    notFound();
  }

  // --- Step 3: 整形と返却 ---
  const initialCurrentPoint = toPointNumber(wallet.currentPointView?.currentPoint, 0);

  return {
    walletId: wallet.id,
    userId,
    initialCurrentPoint,
    initialWalletType: "MEMBER",
  };
}
