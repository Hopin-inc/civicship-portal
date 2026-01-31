import { getCommunityIdFromHeader } from "@/lib/community/get-community-id-server";
import { getMembershipListServer } from "@/lib/graphql/getMembershipListServer";
import GrantPageClient from "./GrantPageClient";

export const dynamic = "force-dynamic";

export default async function GrantPage() {
  let connection = null;
  const communityId = await getCommunityIdFromHeader();

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
    console.error("SSR fetch for GrantPage failed:", { error });
  }

  return <GrantPageClient initialConnection={connection} />;
}
