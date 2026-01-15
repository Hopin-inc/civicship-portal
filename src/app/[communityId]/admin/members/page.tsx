import { getMembershipListServer } from "@/lib/graphql/getMembershipListServer";
import MembersPageClient from "./MembersPageClient";

interface PageProps {
  params: Promise<{ communityId: string }>;
}

export default async function MembersPage({ params }: PageProps) {
  let connection = null;
  const { communityId } = await params;

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
