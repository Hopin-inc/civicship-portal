import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { getMembershipListServer } from "@/lib/graphql/getMembershipListServer";
import GrantPageClient from "./GrantPageClient";

export default async function GrantPage() {
  let connection = null;

  try {
    const result = await getMembershipListServer({
      filter: {
        communityId: COMMUNITY_ID,
      },
      first: 20,
      withWallets: true,
      withDidIssuanceRequests: true,
    });
    connection = result.connection;
  } catch (error) {
    console.error("SSR fetch for GrantPage failed:", error);
  }

  return <GrantPageClient initialConnection={connection} />;
}
