"use client";

import PlaceMapView from "@/app/places/components/map/PlaceMapView";
import usePlacePins from "@/app/places/hooks/usePlacePins";
import usePlaceCards from "@/app/places/hooks/usePlaceCards";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useEffect, useRef } from "react";
import { usePlaceQueryValues } from "@/app/places/hooks/usePlaceQueryValues";
import { usePlaceQueryActions } from "@/app/places/hooks/usePlaceQueryActions";
import PlaceListPage from "@/app/places/components/list/ListPage";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";

export default function PlacesPage() {
  const { selectedPlaceId, mode } = usePlaceQueryValues();
  const { toggleMode, handlePlaceSelect } = usePlaceQueryActions();

  const {
    placePins,
    loading: pinsLoading,
    error: pinsError,
    refetch: refetchPins,
  } = usePlacePins();

  const {
    baseCards,
    loading: cardsLoading,
    error: cardsError,
    refetch: refetchCards,
  } = usePlaceCards();

  const loading = mode === "map" ? pinsLoading : cardsLoading;
  const error = mode === "map" ? pinsError : cardsError;

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = mode === "map" ? refetchPins : refetchCards;
  }, [mode, refetchPins, refetchCards]);

  if (loading) return <LoadingIndicator fullScreen />;

  if (error) {
    return <ErrorState title="拠点を読み込めませんでした" refetchRef={refetchRef} />;
  }

  if (!loading && placePins.length === 0) {
    return <EmptyState title={"拠点"} />;
  }

  return (
    <div className="h-screen w-full">
      {mode === "list" ? (
        <PlaceListPage
          places={baseCards}
          selectedPlaceId={selectedPlaceId}
          onMapClick={toggleMode}
        />
      ) : (
        <PlaceMapView
          selectedPlaceId={selectedPlaceId}
          onPlaceSelect={handlePlaceSelect}
          toggleMode={toggleMode}
          placePins={placePins}
          places={baseCards}
        />
      )}
    </div>
  );
}
