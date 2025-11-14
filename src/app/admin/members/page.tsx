import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { getMembershipListServer } from "@/lib/graphql/getMembershipListServer";
import { GqlMembershipStatus, GqlSortDirection } from "@/types/graphql";
import MembersPageClient from "./MembersPageClient";

export default async function MembersPage() {
  const { connection, ssrFetched } = await getMembershipListServer({
    filter: {
      communityId: COMMUNITY_ID,
    },
    first: 20,
    withWallets: true,
    withDidIssuanceRequests: true,
  });

  return <MembersPageClient initialConnection={connection} ssrFetched={ssrFetched} />;
}
