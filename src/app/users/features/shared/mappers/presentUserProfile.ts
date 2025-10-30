import { GqlTicketStatus, GqlUser } from "@/types/graphql";
import { UserProfileViewModel } from "@/app/users/features/profile/types";
import { AppPortfolio } from "@/app/users/features/shared/types";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

export function presentUserProfile(
  gqlUser: GqlUser | null,
  isOwner: boolean = false,
  portfolios?: AppPortfolio[],
): UserProfileViewModel {
  const wallet = gqlUser?.wallets?.find((w) => w.community?.id === COMMUNITY_ID);

  const selfOpportunities = (gqlUser?.opportunitiesCreatedByMe ?? []).map((opp) => ({
    id: opp.id,
    title: opp.title,
    coverUrl: opp.images?.[0] ?? undefined,
    category: opp.category ?? "",
  }));

  const currentlyHiringOpportunities = (gqlUser?.opportunitiesCreatedByMe ?? []).map((opp) => ({
    id: opp.id,
    title: opp.title,
    images: opp.images ?? undefined,
  }));

  const nftInstances = isOwner
    ? (gqlUser?.nftInstances?.edges ?? []).map((edge) => ({
        id: edge.node.id,
        name: edge.node.name ?? "",
        imageUrl: edge.node.imageUrl ?? undefined,
      }))
    : undefined;

  return {
    id: gqlUser?.id ?? "",
    name: gqlUser?.name ?? "",
    bio: gqlUser?.bio ?? undefined,
    imageUrl: gqlUser?.image ?? undefined,
    currentPrefecture: gqlUser?.currentPrefecture ?? undefined,
    socialUrl: {
      x: gqlUser?.urlX ?? null,
      instagram: gqlUser?.urlInstagram ?? null,
      facebook: gqlUser?.urlFacebook ?? null,
    },
    ticketsAvailable: isOwner
      ? (wallet?.tickets ?? []).filter((t) => t.status === GqlTicketStatus.Available).length
      : undefined,
    points: isOwner ? (wallet?.currentPointView?.currentPoint ?? 0) : undefined,
    portfolios: portfolios ?? [],
    selfOpportunities,
    currentlyHiringOpportunities,
    nftInstances,
    showOpportunities: selfOpportunities.length > 0,
  };
}
