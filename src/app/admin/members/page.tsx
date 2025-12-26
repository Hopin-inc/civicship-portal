import { getMembershipListServer } from "@/lib/graphql/getMembershipListServer";
import MembersPageClient from "./MembersPageClient";
import { headers, cookies } from "next/headers";

export default async function MembersPage() {
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
    console.error("SSR fetch for MembersPage failed:", error);
  }

  return <MembersPageClient initialConnection={connection} />;
}
