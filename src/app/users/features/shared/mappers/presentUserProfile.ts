import { GqlUser, GqlOpportunityCategory, GqlOpportunitySlot, GqlTicketStatus } from "@/types/graphql";
import { UserProfileViewModel } from "@/app/users/features/profile/types";
import { AppPortfolio } from "@/app/users/features/shared/types";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { prefectureLabels } from "@/shared/prefectures/constants";

type OpportunityWithContext = {
  id: string;
  title: string;
  category: GqlOpportunityCategory;
  images?: string[] | null;
  isReservableWithTicket?: boolean | null;
  feeRequired?: number | null;
  pointsRequired?: number | null;
  place?: { name?: string | null } | null;
  community?: { id?: string | null } | null;
};

export function presentUserProfile(
  gqlUser: GqlUser,
  isOwner: boolean = false,
  portfolios?: AppPortfolio[],
): UserProfileViewModel {
  const wallet = gqlUser.wallets?.find((w) => w.community?.id === COMMUNITY_ID);

  const selfOpportunities = (gqlUser.opportunitiesCreatedByMe ?? []).map((opp) => ({
    id: opp.id,
    title: opp.title,
    coverUrl: opp.images?.[0] ?? undefined,
    category: opp.category ?? "",
  }));

  const currentlyHiringOpportunities = (gqlUser.opportunitiesCreatedByMe ?? []).map((opp) => {
    const oppWithContext = opp as OpportunityWithContext;
    return {
      id: oppWithContext.id,
      title: oppWithContext.title,
      category: oppWithContext.category,
      images: oppWithContext.images ?? [],
      location: oppWithContext.place?.name ?? "",
      communityId: oppWithContext.community?.id ?? "",
      hasReservableTicket: oppWithContext.isReservableWithTicket ?? false,
      feeRequired: oppWithContext.feeRequired ?? null,
      pointsRequired: oppWithContext.pointsRequired ?? null,
      slots: [] as GqlOpportunitySlot[],
    };
  });

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
    ticketsAvailable: isOwner 
      ? (wallet?.tickets?.filter((t) => t.status === GqlTicketStatus.Available).length ?? 0) 
      : undefined,
    points: isOwner ? (wallet?.currentPointView?.currentPoint ?? 0) : undefined,
    portfolios: portfolios ?? [],
    selfOpportunities,
    currentlyHiringOpportunities,
    nftInstances,
    showOpportunities: selfOpportunities.length > 0,
  };
}
