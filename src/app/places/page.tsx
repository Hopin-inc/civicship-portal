'use client';

import ErrorState from '@/app/components/shared/ErrorState';
import { usePlaces } from '@/hooks/features/place/usePlaces';
import PlaceMapView from '@/app/components/features/places/PlaceMapView';
import PlaceListView from '@/app/components/features/places/list/PlaceListView';
import { useHeaderConfig } from '@/hooks/core/useHeaderConfig';

export default function PlacesPage() {
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
