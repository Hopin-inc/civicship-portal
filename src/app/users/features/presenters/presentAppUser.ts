import { GqlPortfolio, GqlUser } from "@/types/graphql";
import { AppPortfolio, GeneralUserProfile } from "@/app/users/features/data/type";
import { Participant } from "@/types/utils";
import { PLACEHOLDER_IMAGE } from "@/utils";

export const presenterUserProfile = (gqlUser: GqlUser): GeneralUserProfile => {
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

export const presenterPortfolio = (gqlPortfolio: GqlPortfolio): AppPortfolio => {
  const dateObj = new Date(gqlPortfolio.date);

  return {
    id: gqlPortfolio.id,
    source: gqlPortfolio.source,
    category: gqlPortfolio.category,
    reservationStatus: gqlPortfolio.reservationStatus ?? null,
    evaluationStatus: gqlPortfolio.evaluationStatus ?? null,
    title: gqlPortfolio.title,
    image: gqlPortfolio.thumbnailUrl ?? PLACEHOLDER_IMAGE,
    date: dateObj.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    location: gqlPortfolio.place?.name ?? null,
    participants: (gqlPortfolio.participants ?? []).map(presentParticipant),
  };
};

export const presentParticipant = (gqlParticipant: GqlUser): Participant => {
  return {
    id: gqlParticipant.id,
    image: gqlParticipant.image ?? PLACEHOLDER_IMAGE,
    name: gqlParticipant.name,
  };
};
