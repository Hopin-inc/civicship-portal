import { GqlUser } from "@/types/graphql";
import { UserProfileViewModel } from "@/app/users/features/profile/types";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { prefectureLabels } from "@/app/users/features/shared/constants";

export function presentUserProfile(
  gqlUser: GqlUser,
  isOwner: boolean = false,
): UserProfileViewModel {
  const wallet = gqlUser.wallets?.find((w) => w.community?.id === COMMUNITY_ID);
  const portfolios = (gqlUser.portfolios ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    source: p.source ?? "OPPORTUNITY",
    category: p.category ?? "ACTIVITY",
    coverUrl: p.thumbnailUrl ?? undefined,
    createdAt: p.date instanceof Date ? p.date.toISOString() : String(p.date),
  }));

  const selfOpportunities = (gqlUser.opportunitiesCreatedByMe ?? []).map((opp) => ({
    id: opp.id,
    title: opp.title,
    coverUrl: opp.images?.[0] ?? undefined,
    category: opp.category ?? "",
  }));

  const currentlyHiringOpportunities = selfOpportunities.map((opp) => ({
    id: opp.id,
    title: opp.title,
  }));

  const nftInstances = isOwner
    ? (gqlUser.nftInstances?.edges ?? []).map((edge) => ({
        id: edge.node.id,
        name: edge.node.name ?? "",
        imageUrl: edge.node.imageUrl ?? undefined,
      }))
    : undefined;

  return {
    id: gqlUser.id,
    name: gqlUser.name,
    bio: gqlUser.bio ?? undefined,
    imageUrl: gqlUser.image ?? undefined,
    currentPrefecture: gqlUser.currentPrefecture
      ? prefectureLabels[gqlUser.currentPrefecture]
      : undefined,
    socialUrl: {
      x: gqlUser.urlX ?? null,
      instagram: gqlUser.urlInstagram ?? null,
      facebook: gqlUser.urlFacebook ?? null,
    },
    ticketsAvailable: isOwner ? (wallet?.tickets?.length ?? 0) : undefined,
    points: isOwner ? (wallet?.currentPointView?.currentPoint ?? 0) : undefined,
    portfolios,
    selfOpportunities,
    currentlyHiringOpportunities,
    nftInstances,
    showOpportunities: selfOpportunities.length > 0,
  };
}
