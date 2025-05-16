"use client";

import { ErrorState } from "@/components/shared/ErrorState";
import { PlaceListPage } from "@/app/places/components/list/ListPage";
import PlaceMapView from "@/app/places/components/map/PlaceMapView";
import usePlaceQueryParams from "@/app/places/hooks/usePlaceQueryParams";
import usePlacePins from "@/app/places/hooks/usePlacePins";
import usePlaceCards from "@/app/places/hooks/usePlaceCards";

export default function PlacesPage() {
  const { selectedPlaceId, mode, handlePlaceSelect, handleClose, toggleMode } =
    usePlaceQueryParams();

  const { placePins, loading: pinsLoading, error: pinsError } = usePlacePins();
  const { baseCards, loading: cardsLoading, error: cardsError } = usePlaceCards();

  const loading = mode === "map" ? pinsLoading : cardsLoading;
  const error = mode === "map" ? pinsError : cardsError;

  if (error) return <ErrorState message={error.message} />;

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
