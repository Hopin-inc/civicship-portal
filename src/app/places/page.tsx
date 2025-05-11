'use client';

import { useMemo } from 'react';
import { ErrorState } from '@/components/shared/ErrorState';
import { usePlaces } from '@/hooks/features/place/usePlaces';
import PlaceMapView from '@/components/features/places/PlaceMapView';
import PlaceListView from '@/components/features/places/list/PlaceListView';
import { useHeaderConfig } from '@/hooks/core/useHeaderConfig';

export default function PlacesPage() {
  const headerConfig = useMemo(() => ({
    title: "拠点一覧",
    showBackButton: false,
    showLogo: true,
  }), []);
  useHeaderConfig(headerConfig);
  
  const {
    memberships,
    places,
    selectedPlaceId,
    mode,
    loading,
    error,
    handlePlaceSelect,
    handleClose,
    toggleMode,
    totalPlaces
  } = usePlaces();
  
  if (error) return <ErrorState message={error.message} />;

  return (
    <div className="h-screen w-full">
      {mode === 'list' ? (
        <PlaceListView
          memberships={memberships}
          toggleMode={toggleMode}
        />
      ) : (
        <PlaceMapView
          memberships={memberships}
          selectedPlaceId={selectedPlaceId}
          onPlaceSelect={handlePlaceSelect}
          onClose={handleClose}
          toggleMode={toggleMode}
          places={places}
        />
      )}
    </div>
  );
}
