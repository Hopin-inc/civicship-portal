'use client';

import { Geo } from '../../types/maps';
import { ApolloError } from '@apollo/client';

export interface Place extends Omit<Geo, 'latitude' | 'longitude'> {
  latitude: number;
  longitude: number;
  activeOpportunityCount?: number;
}

export interface ParticipationView {
  participated: {
    totalParticipatedCount: number;
    geo: Place[];
  };
  hosted: {
    totalParticipantCount: number;
    geo: Place[];
  };
}

export interface Membership {
  node: {
    id: string;
    bio?: string;
    user: {
      id: string;
      name: string;
      image: string;
      opportunitiesCreatedByMe?: {
        edges: Array<{
          node: {
            id: string;
            publishStatus: string;
          };
        }>;
      };
    };
    participationView: ParticipationView;
  };
}

export interface PlaceData {
  placeId: string;
  title: string;
  address: string;
  participantCount: number;
  description: string;
  image: string;
  bio?: string;
  userId: string;
  activeOpportunityCount: number;
}

export interface UsePlacesResult {
  memberships: Membership[];
  places: PlaceData[];
  selectedPlaceId: string | null;
  mode: string;
  loading: boolean;
  error: ApolloError | null;
  handlePlaceSelect: (placeId: string) => void;
  handleClose: () => void;
  toggleMode: () => void;
  totalPlaces: number;
}

/**
 * Transform memberships data into place data
 */
export const transformMembershipsToPlaces = (memberships: Membership[]): PlaceData[] => {
  const allPlaces: PlaceData[] = [];

  memberships.forEach(({ node }) => {
    const activeOpportunityCount = node.user.opportunitiesCreatedByMe?.edges
      .filter((edge) => edge.node.publishStatus === 'PUBLIC')
      .length || 0;

    node.participationView.participated.geo.forEach((location: Place) => {
      allPlaces.push({
        placeId: location.placeId,
        title: node.user.name,
        address: location.placeName || "住所不明",
        participantCount: node.participationView.participated.totalParticipatedCount,
        description: "イベントの説明",
        image: location.placeImage,
        bio: node.bio,
        userId: node.user.id,
        activeOpportunityCount
      });
    });

    node.participationView.hosted.geo.forEach((location: Place) => {
      allPlaces.push({
        placeId: location.placeId,
        title: node.user.name,
        address: location.placeName || "住所不明",
        participantCount: node.participationView.hosted.totalParticipantCount,
        description: "イベントの説明",
        image: location.placeImage,
        bio: node.bio,
        userId: node.user.id,
        activeOpportunityCount
      });
    });
  });

  return allPlaces;
};

/**
 * Calculate total places from memberships
 */
export const calculateTotalPlaces = (memberships: Membership[]): number => {
  return memberships.reduce((total, membership) => {
    const participatedCount = membership.node.participationView.participated.geo.length;
    const hostedCount = membership.node.participationView.hosted.geo.length;
    return total + participatedCount + hostedCount;
  }, 0);
};
