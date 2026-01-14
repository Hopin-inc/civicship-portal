import { GqlTicketStatus, GqlUser } from "@/types/graphql";
import { UserProfileViewModel } from "@/app/[communityId]/users/features/profile/types";
import { AppPortfolio } from "@/app/[communityId]/users/features/shared/types";
import { getCommunityIdFromEnv } from "@/lib/communities/config";
import { logger } from "@/lib/logging";

export function presentUserProfile(
  gqlUser: GqlUser | null,
  isOwner: boolean = false,
  portfolios?: AppPortfolio[],
  communityId?: string,
): UserProfileViewModel {
  const resolvedCommunityId = communityId ?? getCommunityIdFromEnv();
  const wallet = gqlUser?.wallets?.find((w) => w.community?.id === resolvedCommunityId);

  logger.debug("[AUTH] presentUserProfile: wallet selection", {
    communityId: resolvedCommunityId,
    walletsCount: gqlUser?.wallets?.length ?? 0,
    walletCommunities: (gqlUser?.wallets ?? []).map((w) => w.community?.id),
    selectedWalletId: wallet?.id,
    hasCurrentPointView: wallet?.currentPointView != null,
    selectedWalletPoint: wallet?.currentPointView?.currentPoint ?? "__MISSING__",
    component: "presentUserProfile",
  });

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

  const nftInstances = (gqlUser?.nftInstances?.edges ?? []).map((edge) => ({
    id: edge.node.id,
    name: edge.node.name ?? "",
    imageUrl: edge.node.imageUrl ?? undefined,
    instanceId: edge.node.instanceId ?? undefined,
    communityId: edge.node.community?.id,
  }));

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
    points: wallet?.currentPointView?.currentPoint != null
      ? Number(wallet.currentPointView.currentPoint)
      : 0,
    portfolios: portfolios ?? [],
    selfOpportunities,
    currentlyHiringOpportunities,
    nftInstances,
    showOpportunities: selfOpportunities.length > 0,
  };
}
