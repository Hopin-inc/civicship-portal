"use client";

import { useMemo } from "react";
import { ErrorState } from "@/components/shared/ErrorState";
import { usePlaces } from "@/app/places/hooks/usePlaces";
import PlaceMapView from "@/app/places/components/map/PlaceMapView";
import { PlaceListPage } from "@/app/places/components/list/PlaceListSheet";
import useHeaderConfig from "@/hooks/useHeaderConfig";

export default function PlacesPage() {
  const headerConfig = useMemo(
    () => ({
      showLogo: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { places, selectedPlaceId, mode, error, handlePlaceSelect, toggleMode } = usePlaces();
  if (error) return <ErrorState message={error.message} />;

  return (
    <div className="h-screen w-full">
      {mode === "list" ? (
        <PlaceListPage places={places} selectedPlaceId={selectedPlaceId} onMapClick={toggleMode} />
      ) : (
        <PlaceMapView
          selectedPlaceId={selectedPlaceId}
          onPlaceSelect={handlePlaceSelect}
          toggleMode={toggleMode}
          places={places}
        />
      )}
    </div>
  );
}
