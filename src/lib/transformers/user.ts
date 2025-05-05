'use client';

import { GetUserProfileData, GetUserWithDetailsData } from '../../hooks/features/user/useUserProfileQuery';

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
