import { presenterManagerProfile } from "@/app/users/data/presenter";
import { presenterActivityCard } from "@/components/domains/opportunities/data/presenter";
import { formatOpportunities } from "@/components/domains/opportunities/utils";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import MyProfileClient from "./component/MyProfileClient";
import { fetchProfileServer } from "@/app/users/me/libs/fetchProfileServer";

export default async function MyProfilePage() {
  const user = await fetchProfileServer();
  if (!user) return null;

  const profile = presenterManagerProfile(user, COMMUNITY_ID);

  const nftInstances = user.nftInstances?.edges?.map((e) => e.node) ?? [];

  const selfOpportunities =
    user.opportunitiesCreatedByMe
      ?.filter((o) => o?.community?.id === COMMUNITY_ID)
      ?.map(presenterActivityCard)
      ?.map(formatOpportunities) ?? [];

  return (
    <MyProfileClient
      user={user}
      profile={profile}
      nftInstances={nftInstances}
      selfOpportunities={selfOpportunities}
    />
  );
}
