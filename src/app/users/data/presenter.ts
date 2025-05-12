'use client';

import { GqlCurrentPrefecture, GqlPortfolio, GqlUser } from "@/types/graphql";
import { AppPortfolio, AppUser, AppUserSelf, GeneralUserProfile, ManagerProfile } from "@/app/users/data/type";
import { presenterUserAsset } from "@/app/wallets/data/presenter";
import { Participant } from "@/types/utils";
import { presenterActivityCard } from "@/app/activities/data/presenter";

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

export const presenterManagerProfile = (gqlUser: GqlUser): ManagerProfile => {
  return {
    ...presenterAppUser(gqlUser),
    asset: presenterUserAsset(gqlUser.wallets?.[0]),
    currentlyHiringOpportunities: (gqlUser.opportunitiesCreatedByMe ?? []).map(presenterActivityCard),
  };
};

export const presenterUserProfile = (gqlUser: GqlUser): GeneralUserProfile => {
  return {
    name: gqlUser.name,
    image: gqlUser.image ?? null,
    bio: gqlUser.bio ?? null,
    currentPrefecture: gqlUser.currentPrefecture ?? undefined,
    urlFacebook: gqlUser.urlFacebook ?? null,
    urlInstagram: gqlUser.urlInstagram ?? null,
    urlX: gqlUser.urlX ?? null,
  };
};

export const presenterPortfolio = (gqlPortfolio: GqlPortfolio): AppPortfolio => {
  return {
    id: gqlPortfolio.id,
    source: gqlPortfolio.source,
    category: gqlPortfolio.category,
    reservationStatus: gqlPortfolio.reservationStatus ?? null,
    title: gqlPortfolio.title,
    image: gqlPortfolio.thumbnailUrl ?? null,
    date: new Date(gqlPortfolio.date).toISOString() ?? null,
    location: gqlPortfolio.place?.name ?? null,
    participants: (gqlPortfolio.participants ?? []).map(presentParticipant),
  };
};

export const presentParticipant = (gqlParticipant: GqlUser): Participant => {
  return {
    id: gqlParticipant.id,
    image: gqlParticipant.image ?? null,
    name: gqlParticipant.name,
  };
};

export const prefectureLabels: Record<GqlCurrentPrefecture, string> = {
  [GqlCurrentPrefecture.Kagawa]: '香川県',
  [GqlCurrentPrefecture.Tokushima]: '徳島県',
  [GqlCurrentPrefecture.Kochi]: '高知県',
  [GqlCurrentPrefecture.Ehime]: '愛媛県',
  [GqlCurrentPrefecture.OutsideShikoku]: '四国以外',
  [GqlCurrentPrefecture.Unknown]: '不明',
} as const;

export const prefectureOptions = [
  GqlCurrentPrefecture.Kagawa,
  GqlCurrentPrefecture.Tokushima,
  GqlCurrentPrefecture.Kochi,
  GqlCurrentPrefecture.Ehime,
];