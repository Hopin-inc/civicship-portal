import { getCommunityIdFromEnv } from "@/lib/communities/config";
import { getMembershipListServer } from "@/lib/graphql/getMembershipListServer";
import MembersPageClient from "./MembersPageClient";

export default async function MembersPage() {
  let connection = null;
  const communityId = getCommunityIdFromEnv();

  try {
    const result = await getMembershipListServer({
      filter: {
        communityId,
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
