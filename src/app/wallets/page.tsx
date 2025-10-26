import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { executeServerGraphQLQuery } from "@/lib/graphql/server";

interface CurrentUserWalletData {
  currentUser: {
    id: string;
    wallets: Array<{
      id: string;
      community: { id: string };
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
    const data = await executeServerGraphQLQuery<CurrentUserWalletData>(
      `query GetCurrentUserWallet {
        currentUser {
          id
          wallets {
            id
            community { id }
          }
        }
      }`,
      {},
      { Authorization: `Bearer ${session}` }
    );
    
    const communityId = process.env.NEXT_PUBLIC_COMMUNITY_ID;
    const wallet = data.currentUser?.wallets?.find(
      (w) => w.community?.id === communityId
    );
    
    if (!wallet) {
      redirect("/error");
    }
    
    const queryString = new URLSearchParams(
      searchParams as Record<string, string>
    ).toString();
    const redirectUrl = `/wallets/${wallet.id}${queryString ? `?${queryString}` : ""}`;
    
    redirect(redirectUrl);
  } catch (error) {
    console.error("Failed to fetch wallet:", error);
    redirect("/error");
  }
}
