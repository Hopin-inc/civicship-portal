import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { getMembershipListServer } from "@/lib/graphql/getMembershipListServer";
import { GqlMembershipStatus, GqlSortDirection } from "@/types/graphql";
import MembersPageClient from "./MembersPageClient";

export default async function MembersPage() {
  let connection = null;
  let ssrFetched = false;

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
    ssrFetched = result.ssrFetched;
  } catch (error) {
    console.error("SSR fetch for MembersPage failed:", error);
  }

  return <MembersPageClient initialConnection={connection} ssrFetched={ssrFetched} />;
}
