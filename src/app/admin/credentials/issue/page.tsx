import { getMembershipListServer } from "@/lib/graphql/getMembershipListServer";
import OpportunitySelector from "../components/CredentialIssuanceWizard";
import { headers, cookies } from "next/headers";

export default async function SelectOpportunity() {
  // Get communityId from request headers (set by middleware) or cookies
  const headersList = await headers();
  const cookieStore = await cookies();
  const communityId = headersList.get("x-community-id") || cookieStore.get("communityId")?.value || "";
  
  let connection = null;

  try {
    const result = await getMembershipListServer({
      filter: { communityId: communityId },
      first: 20,
      withWallets: true,
      withDidIssuanceRequests: true,
      communityId: communityId,
    });
    connection = result.connection;
  } catch (error) {
    console.error("SSR fetch for credentials page failed:", error);
  }

  return (
    <div className="p-4 space-y-8 max-w-2xl mx-auto">
      <div className="space-y-4">
        <OpportunitySelector initialConnection={connection} />
      </div>
    </div>
  );
}
