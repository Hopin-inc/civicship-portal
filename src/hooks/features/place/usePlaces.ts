'use client';

import { useQuery, ApolloError } from '@apollo/client';
import { GET_MEMBERSHIP_LIST } from '@/graphql/queries/membership';
import { useMemo, useEffect } from 'react';
import { useLoading } from '@/hooks/core/useLoading';
import { useRouter, useSearchParams } from 'next/navigation';
import { Geo } from '@/types/maps';

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

export const usePlaces = (): UsePlacesResult => {
  const { data, loading, error } = useQuery(GET_MEMBERSHIP_LIST);
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlaceId = searchParams.get('placeId');
  const mode = searchParams.get('mode') || 'map';

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  const handlePlaceSelect = (placeId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('placeId', placeId);
    router.push(`/places?${params.toString()}`);
  };

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('placeId');
    router.push(`/places?${params.toString()}`);
  };

  const toggleMode = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('mode', mode === 'map' ? 'list' : 'map');
    params.delete('placeId'); // モード切り替え時に選択状態をリセット
    router.push(`/places?${params.toString()}`);
  };

  const memberships = (data?.memberships?.edges || []) as Membership[];

  const places = useMemo(() => {
    const allPlaces: PlaceData[] = [];

    memberships.forEach(({ node }) => {
      const activeOpportunityCount = node.user.opportunitiesCreatedByMe?.edges
        .filter((edge: any) => edge.node.publishStatus === 'PUBLIC')
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
  }, [memberships]);

  const totalPlaces = useMemo(() => 
    memberships.reduce((total, membership) => {
      const participatedCount = membership.node.participationView.participated.geo.length;
      const hostedCount = membership.node.participationView.hosted.geo.length;
      return total + participatedCount + hostedCount;
    }, 0), 
  [memberships]);

  return {
    memberships,
    places,
    selectedPlaceId,
    mode,
    loading,
    error: error || null,
    handlePlaceSelect,
    handleClose,
    toggleMode,
    totalPlaces
  };
};
