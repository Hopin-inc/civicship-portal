import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlWalletType } from "@/types/graphql";
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
        community: {
          id: string;
        } | null;
      };
    }>;
  };
}

export default async function WalletsRedirectPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  
  if (!session) {
    redirect("/login");
  }
  
  try {
    const userData = await executeServerGraphQLQuery<CurrentUserData>(
      GET_CURRENT_USER_ID_SERVER_QUERY,
      {},
      { Authorization: `Bearer ${session}` }
    );
    
    const userId = userData.currentUser?.id;
    
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
      redirect("/error?message=wallet_not_found");
    }
    
    const queryString = new URLSearchParams(
      searchParams as Record<string, string>
    ).toString();
    const redirectUrl = `/wallets/${wallet.id}${queryString ? `?${queryString}` : ""}`;
    
    redirect(redirectUrl);
  } catch (error) {
    console.error("Failed to fetch wallet:", error);
    redirect("/error?message=wallet_fetch_failed");
  }
}
