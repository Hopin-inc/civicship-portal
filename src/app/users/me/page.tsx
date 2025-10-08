// app/users/me/page.tsx
import MyProfileClient from "./component/MyProfileClient";
import { fetchProfileServer } from "@/app/users/me/libs/fetchProfileServer";
import { presenterManagerProfile } from "@/app/users/data/presenter";
import { presenterActivityCard } from "@/components/domains/opportunities/data/presenter";
import { formatOpportunities } from "@/components/domains/opportunities/utils";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

export default async function MyProfilePage() {
  const ssrUser = await fetchProfileServer();

  if (!ssrUser) {
    return <MyProfileClient ssrData={null} />;
  }

  const presentedProfile = presenterManagerProfile(ssrUser, COMMUNITY_ID);
  const nftInstances = ssrUser.nftInstances?.edges?.map((e) => e.node) ?? [];
  const selfOpportunities =
    ssrUser.opportunitiesCreatedByMe
      ?.filter((o) => o?.community?.id === COMMUNITY_ID)
      ?.map(presenterActivityCard)
      ?.map(formatOpportunities) ?? [];

  // ✅ 整形済み構造としてまとめる
  const ssrData = {
    user: ssrUser,
    profile: presentedProfile,
    nftInstances,
    selfOpportunities,
  };

  return <MyProfileClient ssrData={ssrData} />;
}
