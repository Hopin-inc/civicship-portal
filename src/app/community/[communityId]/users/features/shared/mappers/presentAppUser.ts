import { GqlPortfolio, GqlUser } from "@/types/graphql";
import { AppPortfolio, GeneralUserProfile } from "@/app/community/[communityId]/users/features/shared/types";
import { Participant } from "@/types/utils";
import { PLACEHOLDER_IMAGE } from "@/utils";

export const mapGqlUserToProfile = (gqlUser: GqlUser): GeneralUserProfile => {
  return {
    name: gqlUser.name,
    image: null,
    imagePreviewUrl: gqlUser.image ?? PLACEHOLDER_IMAGE,
    bio: gqlUser.bio ?? null,
    currentPrefecture: gqlUser.currentPrefecture ?? undefined,
    urlFacebook: gqlUser.urlFacebook ?? null,
    urlInstagram: gqlUser.urlInstagram ?? null,
    urlX: gqlUser.urlX ?? null,
  };
};

export const mapGqlPortfolio = (gqlPortfolio: GqlPortfolio): AppPortfolio => {
  return {
    id: gqlPortfolio.id,
    source: gqlPortfolio.source,
    category: gqlPortfolio.category,
    reservationStatus: gqlPortfolio.reservationStatus ?? null,
    evaluationStatus: gqlPortfolio.evaluationStatus ?? null,
    title: gqlPortfolio.title,
    image: gqlPortfolio.thumbnailUrl ?? PLACEHOLDER_IMAGE,
    dateISO: new Date(gqlPortfolio.date).toISOString(),
    location: gqlPortfolio.place?.name ?? null,
    participants: (gqlPortfolio.participants ?? []).map(mapGqlParticipant),
  };
};

export const mapGqlParticipant = (gqlParticipant: GqlUser): Participant => {
  return {
    id: gqlParticipant.id,
    image: gqlParticipant.image ?? PLACEHOLDER_IMAGE,
    name: gqlParticipant.name,
  };
};
