'use client';

import { GetUserProfileData, GetUserWithDetailsData } from '../hooks/features/user/useUserProfileQuery';
import { GqlCurrentPrefecture } from '@/types/graphql';

/**
 * Prefecture labels for display
 */
export const prefectureLabels: Record<GqlCurrentPrefecture, string> = {
  [GqlCurrentPrefecture.Kagawa]: '香川県',
  [GqlCurrentPrefecture.Tokushima]: '徳島県',
  [GqlCurrentPrefecture.Kochi]: '高知県',
  [GqlCurrentPrefecture.Ehime]: '愛媛県',
  [GqlCurrentPrefecture.OutsideShikoku]: '四国以外',
  [GqlCurrentPrefecture.Unknown]: '不明',
} as const;

/**
 * Prefecture options for selection
 */
export const prefectureOptions = [
  GqlCurrentPrefecture.Kagawa,
  GqlCurrentPrefecture.Tokushima,
  GqlCurrentPrefecture.Kochi,
  GqlCurrentPrefecture.Ehime,
];

/**
 * Transform user profile data from GraphQL to application format
 */
export const formatUserProfileData = (data: GetUserProfileData | GetUserWithDetailsData | undefined) => {
  if (!data) return null;
  
  return {
    id: data.user.id,
    name: data.user.name,
    image: data.user.image,
    bio: data.user.bio,
    sysRole: data.user.sysRole,
    urlFacebook: data.user.urlFacebook,
    urlInstagram: data.user.urlInstagram,
    urlWebsite: data.user.urlWebsite,
    urlX: data.user.urlX,
    urlYoutube: data.user.urlYoutube,
    opportunities: 'opportunitiesCreatedByMe' in data.user && data.user.opportunitiesCreatedByMe
      ? data.user.opportunitiesCreatedByMe.edges.map(edge => ({
          id: edge.node.id,
          title: edge.node.title,
          description: edge.node.description,
          images: edge.node.images,
          feeRequired: edge.node.feeRequired,
          isReservableWithTicket: edge.node.isReservableWithTicket,
        }))
      : [],
    portfolios: 'portfolios' in data.user && data.user.portfolios
      ? data.user.portfolios.edges.map(edge => ({
          id: edge.node.id,
          title: edge.node.title,
          category: edge.node.category,
          date: edge.node.date,
          thumbnailUrl: edge.node.thumbnailUrl,
          source: edge.node.source,
          reservationStatus: edge.node.reservationStatus,
        }))
      : [],
    hasMorePortfolios: 'portfolios' in data.user && data.user.portfolios?.pageInfo.hasNextPage || false,
    endCursor: 'portfolios' in data.user && data.user.portfolios?.pageInfo.endCursor || null,
  };
};

/**
 * Format user profile data from any user data structure
 */
export const formatSimpleUserProfileData = (userData: any) => {
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
