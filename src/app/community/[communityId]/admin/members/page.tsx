import { notFound } from "next/navigation";
import { getCommunityIdFromHeader } from "@/lib/community/get-community-id-server";
import { getMembershipListServer } from "@/lib/graphql/getMembershipListServer";
import MembersPageClient from "./MembersPageClient";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  let connection = null;
  const communityId = await getCommunityIdFromHeader();

  if (!communityId) {
    notFound();
  }

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
