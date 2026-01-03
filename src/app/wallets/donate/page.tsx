import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { getMembershipListServer } from "@/lib/graphql/getMembershipListServer";
import DonatePointPageClient from "./DonatePointPageClient";

export default async function DonatePointPage() {
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
    console.error("SSR fetch for DonatePointPage failed:", { error });
  }

  return <DonatePointPageClient initialConnection={connection} />;
}
