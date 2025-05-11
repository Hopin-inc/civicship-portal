'use client';

import { GqlCurrentPrefecture, GqlUser, GqlWallet } from "@/types/graphql";
import {  AppUser, AppUserSelf, GeneralUserProfile, ManagerProfile } from "@/types/user";
import { presenterActivityCard } from "@/presenters/opportunity";
import { presenterUserAsset } from "@/presenters/wallet";
import { presenterPortfolio } from "@/presenters/portfolio";

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

const presenterUserProfile = (gqlUser: GqlUser): GeneralUserProfile => {
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

export interface SimpleUserData {
  user?: {
    id: string;
    name: string;
    image: string | null;
    bio?: string | null;
    currentPrefecture?: GqlCurrentPrefecture | null;
    urlFacebook?: string | null;
    urlInstagram?: string | null;
    urlX?: string | null;
    urlYoutube?: string | null;
    urlWebsite?: string | null;
  } | null;
}

export interface SimpleUserProfile {
  id: string;
  name: string;
  image: string | null;
  bio: string;
  currentPrefecture?: GqlCurrentPrefecture | null;
  socialLinks: Array<{
    type: string;
    url: string | null;
  }>;
}

export const formatSimpleUserProfileData = (userData: SimpleUserData): SimpleUserProfile | null => {
  if (!userData?.user) return null;
  
  const { user } = userData;
  return {
    id: user.id,
    name: user.name,
    image: user.image,
    bio: user.bio || '',
    currentPrefecture: user.currentPrefecture,
    socialLinks: [
      { type: 'facebook', url: user.urlFacebook || null },
      { type: 'instagram', url: user.urlInstagram || null },
      { type: 'x', url: user.urlX || null },
      { type: 'youtube', url: user.urlYoutube || null },
      { type: 'website', url: user.urlWebsite || null }
    ]
  };
};
