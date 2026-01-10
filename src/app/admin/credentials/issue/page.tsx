import { getCommunityIdFromEnv } from "@/lib/communities/config";
import { getMembershipListServer } from "@/lib/graphql/getMembershipListServer";
import OpportunitySelector from "../components/CredentialIssuanceWizard";

export default async function SelectOpportunity() {
  let connection = null;
  const communityId = getCommunityIdFromEnv();

  try {
    const result = await getMembershipListServer({
      filter: { communityId },
      first: 20,
      withWallets: true,
      withDidIssuanceRequests: true,
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
