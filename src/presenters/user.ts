'use client';

import { GetUserProfileData, GetUserWithDetailsData } from "@/hooks/features/user/useUserProfileQuery";
import { GqlCurrentPrefecture } from '@/types/graphql';

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
  hasMorePortfolios: boolean;
  endCursor: string | null;
}

export const formatUserProfileData = (
  data: GetUserProfileData | GetUserWithDetailsData | undefined
): UserProfileData | null => {
  if (!data) return null;
  
  return {
    id: data.user.id,
    name: data.user.name,
    image: data.user.image ?? null,
    bio: data.user.bio ?? null,
    sysRole: data.user.sysRole ?? null,
    urlFacebook: data.user.urlFacebook ?? null,
    urlInstagram: data.user.urlInstagram ?? null,
    urlWebsite: data.user.urlWebsite ?? null,
    urlX: data.user.urlX ?? null,
    urlYoutube: data.user.urlYoutube ?? null,
    opportunities: 'opportunitiesCreatedByMe' in data.user && data.user.opportunitiesCreatedByMe
      ? data.user.opportunitiesCreatedByMe.edges.map(edge => ({
          id: edge.node.id,
          title: edge.node.title,
          description: edge.node.description ?? null,
          images: edge.node.images ?? null,
          feeRequired: edge.node.feeRequired ?? null,
          isReservableWithTicket: edge.node.isReservableWithTicket ?? null,
        }))
      : [],
    portfolios: 'portfolios' in data.user && data.user.portfolios
      ? data.user.portfolios.edges.map(edge => ({
          id: edge.node.id,
          title: edge.node.title,
          category: edge.node.category ?? null,
          date: edge.node.date ?? null,
          thumbnailUrl: edge.node.thumbnailUrl ?? null,
          source: edge.node.source ?? null,
          reservationStatus: edge.node.reservationStatus ?? null,
        }))
      : [],
    hasMorePortfolios: 'portfolios' in data.user && data.user.portfolios?.pageInfo.hasNextPage || false,
    endCursor: 'portfolios' in data.user && data.user.portfolios?.pageInfo.endCursor || null,
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
