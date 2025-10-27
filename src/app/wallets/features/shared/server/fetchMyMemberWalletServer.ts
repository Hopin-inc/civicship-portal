import { notFound } from "next/navigation";
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

export interface MyMemberWalletResult {
  walletId: string;
  userId: string;
  initialCurrentPoint: number;
  initialWalletType: 'MEMBER' | 'COMMUNITY';
}

/**
 * Fetches the current user's member wallet for the current community.
 * Throws notFound() if wallet doesn't exist or validation fails.
 */
export async function fetchMyMemberWalletServer(
  session: string
): Promise<MyMemberWalletResult> {
  const userData = await executeServerGraphQLQuery<CurrentUserData>(
    GET_CURRENT_USER_ID_SERVER_QUERY,
    {},
    { Authorization: `Bearer ${session}` }
  );

  const userId = userData.currentUser?.id;

  if (!userId) {
    notFound();
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

  const pointString = wallet.currentPointView?.currentPoint;
  const initialCurrentPoint = toPointNumber(pointString, 0);
  const initialWalletType = wallet.type === GqlWalletType.Community ? 'COMMUNITY' : 'MEMBER';

  return {
    walletId: wallet.id,
    userId,
    initialCurrentPoint,
    initialWalletType,
  };
}
