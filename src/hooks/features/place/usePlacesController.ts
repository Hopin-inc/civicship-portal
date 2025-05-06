'use client';

import { useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApolloError } from '@apollo/client';
import { useLoading } from '@/hooks/core/useLoading';
import { usePlacesQuery } from '@/hooks/features/place/usePlacesQuery';
import { 
  Membership, 
  PlaceData, 
  transformMembershipsToPlaces, 
  calculateTotalPlaces,
  UsePlacesResult
} from '@/transformers/place';


/**
 * Controller hook for places functionality
 * Responsible for UI control and state management
 */
export const usePlacesController = (): UsePlacesResult => {
  const { data, loading, error } = usePlacesQuery();
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

  const memberships = useMemo(() => 
    (data?.memberships?.edges || []) as Membership[],
  [data?.memberships?.edges]);

  const places = useMemo(() => 
    transformMembershipsToPlaces(memberships),
  [memberships]);

  const totalPlaces = useMemo(() => 
    calculateTotalPlaces(memberships),
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
