import { getMembershipListServer } from "@/lib/graphql/getMembershipListServer";
import GrantPageClient from "./GrantPageClient";
import { headers, cookies } from "next/headers";

export default async function GrantPage() {
  // Get communityId from request headers (set by middleware) or cookies
  const headersList = await headers();
  const cookieStore = await cookies();
  const communityId = headersList.get("x-community-id") || cookieStore.get("communityId")?.value || "";
  
  let connection = null;

  try {
    const result = await getMembershipListServer({
      filter: {
        communityId: communityId,
      },
      first: 20,
      withWallets: true,
      withDidIssuanceRequests: true,
    });
    connection = result.connection;
  } catch (error) {
    console.error("SSR fetch for GrantPage failed:", { error });
  }

  return <GrantPageClient initialConnection={connection} />;
}
