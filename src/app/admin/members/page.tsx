import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { getMembershipListServer } from "@/lib/graphql/getMembershipListServer";
import MembersPageClient from "./MembersPageClient";

export default async function MembersPage() {
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
    console.error("SSR fetch for MembersPage failed:", error);
  }

  return <MembersPageClient initialConnection={connection} />;
}
