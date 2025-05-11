"use client";

import { useMemo } from "react";
import { ErrorState } from "@/components/shared/ErrorState";
import { usePlaces } from "@/hooks/features/place/usePlaces";
import PlaceMapView from "@/components/features/places/PlaceMapView";
import { useHeaderConfig } from "@/hooks/core/useHeaderConfig";
import { PlaceListPage } from "@/components/features/places/list/PlaceListSheet";

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
