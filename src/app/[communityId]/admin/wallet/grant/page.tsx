import { getMembershipListServer } from "@/lib/graphql/getMembershipListServer";
import GrantPageClient from "./GrantPageClient";

interface PageProps {
  params: Promise<{ communityId: string }>;
}

export default async function GrantPage({ params }: PageProps) {
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
    console.error("SSR fetch for GrantPage failed:", { error });
  }

  return <GrantPageClient initialConnection={connection} />;
}
