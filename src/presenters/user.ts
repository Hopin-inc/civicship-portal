'use client';

import { GqlCurrentPrefecture, GqlUser } from "@/types/graphql";

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



export interface UserProfileData {
  id: string;
  name: string;
  image: string | null;
  bio: string | null;
  sysRole: string | null;
  urlFacebook: string | null;
  urlInstagram: string | null;
  urlWebsite: string | null;
  urlX: string | null;
  urlYoutube: string | null;
  opportunities: Array<{
    id: string;
    title: string;
    description: string | null;
    images: string[] | null;
    feeRequired: number | null;
    isReservableWithTicket: boolean | null;
  }>;
  portfolios: Array<{
    id: string;
    title: string;
    category: string | null;
    date: string | null;
    thumbnailUrl: string | null;
    source: string | null;
    reservationStatus: string | null;
  }>;
}

export const formatUserProfileData = (
  user: GqlUser | null | undefined,
): UserProfileData | null => {
  if (!user) return null;
  
  return {
    id: user.id,
    name: user.name,
    image: user.image ?? null,
    bio: user.bio ?? null,
    sysRole: user.sysRole ?? null,
    urlFacebook: user.urlFacebook ?? null,
    urlInstagram: user.urlInstagram ?? null,
    urlWebsite: user.urlWebsite ?? null,
    urlX: user.urlX ?? null,
    urlYoutube: user.urlYoutube ?? null,
    opportunities: 'opportunitiesCreatedByMe' in user && user.opportunitiesCreatedByMe
      ? user.opportunitiesCreatedByMe.map(node => ({
          id: node.id,
          title: node.title,
          description: node.description ?? null,
          images: node.images ?? null,
          feeRequired: node.feeRequired ?? null,
          isReservableWithTicket: node.isReservableWithTicket ?? null,
        }))
      : [],
    portfolios: 'portfolios' in user && user.portfolios
      ? user.portfolios.map(node => ({
          id: node.id,
          title: node.title,
          category: node.category ?? null,
          date: new Date(node.date).toISOString() ?? null,
          thumbnailUrl: node.thumbnailUrl ?? null,
          source: node.source ?? null,
          reservationStatus: node.reservationStatus ?? null,
        }))
      : [],
  };
};

/**
 * Format user profile data from any user data structure
 */
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
