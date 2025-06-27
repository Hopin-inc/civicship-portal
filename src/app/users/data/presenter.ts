"use client";

import { GqlCurrentPrefecture, GqlPortfolio, GqlUser } from "@/types/graphql";
import {
  AppPortfolio,
  AppUser,
  AppUserSelf,
  GeneralUserProfile,
  ManagerProfile,
} from "@/app/users/data/type";
import { presenterUserAsset } from "@/app/wallets/data/presenter";
import { Participant } from "@/types/utils";
import { presenterActivityCard } from "@/app/activities/data/presenter";
import { PLACEHOLDER_IMAGE } from "@/utils";

export const presenterAppUser = (gqlUser: GqlUser): AppUser => {
  return {
    id: gqlUser.id,
    profile: presenterUserProfile(gqlUser),
    portfolios: (gqlUser.portfolios ?? []).map(presenterPortfolio),
  };
};

export const presenterAppUserSelf = (gqlUser: GqlUser): AppUserSelf => {
  return {
    ...presenterAppUser(gqlUser),
    asset: presenterUserAsset(gqlUser.wallets?.[0]),
    portfolios: (gqlUser.portfolios ?? []).map(presenterPortfolio),
  };
};

export const presenterManagerProfile = (gqlUser: GqlUser, communityId: string): ManagerProfile => {
  return {
    ...presenterAppUser(gqlUser),
    asset: presenterUserAsset(gqlUser.wallets?.find((w) => w.community?.id === communityId)),
    currentlyHiringOpportunities: (gqlUser.opportunitiesCreatedByMe ?? []).map(
      presenterActivityCard,
    ),
  };
};

export const presenterUserProfile = (gqlUser: GqlUser): GeneralUserProfile => {
  return {
    name: gqlUser.name,
    image: null, // File object is not available from server data
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

export const prefectureLabels: Record<GqlCurrentPrefecture, string> = {
  [GqlCurrentPrefecture.Kagawa]: "香川県",
  [GqlCurrentPrefecture.Tokushima]: "徳島県",
  [GqlCurrentPrefecture.Kochi]: "高知県",
  [GqlCurrentPrefecture.Ehime]: "愛媛県",
  [GqlCurrentPrefecture.OutsideShikoku]: "四国以外",
  [GqlCurrentPrefecture.Unknown]: "不明",
};

export const visiblePrefectureLabels = Object.fromEntries(
  Object.entries(prefectureLabels).filter(
    ([key]) => key !== GqlCurrentPrefecture.OutsideShikoku && key !== GqlCurrentPrefecture.Unknown,
  ),
) as Record<GqlCurrentPrefecture, string>;

export const prefectureOptions = [
  GqlCurrentPrefecture.Kagawa,
  GqlCurrentPrefecture.Tokushima,
  GqlCurrentPrefecture.Kochi,
  GqlCurrentPrefecture.Ehime,
];
