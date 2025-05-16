import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import CustomMarker from "@/app/places/components/map/CustomMarker";
import { useMapState } from "@/app/places/hooks/useMapState";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { usePreloadImages } from "@/app/places/hooks/usePreloadImages";
import { BasePin } from "@/app/places/data/type";

const containerStyle = {
  width: "100%",
  height: "100%",
};

interface MapComponentProps {
  placePins: BasePin[];
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string) => void;
}

export default function MapComponent({
  placePins,
  selectedPlaceId,
  onPlaceSelect,
}: MapComponentProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    language: "ja",
    region: "JP",
  });

  const allImageUrls = Array.from(
    new Set(
      [...placePins.map((pin) => pin.image), ...placePins.map((pin) => pin.host?.image)].filter(
        (url): url is string => url != null,
      ),
    ),
  );
  const imagesReady = usePreloadImages(allImageUrls);

  const { markers, center, onLoad, onUnmount } = useMapState({
    placePins,
    selectedPlaceId,
  });

  if (!isLoaded || !imagesReady) {
    return <LoadingIndicator fullScreen />;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={9}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        gestureHandling: "greedy",
        disableDefaultUI: true,
        scrollwheel: true,
        zoomControl: true,
      }}
    >
      {markers.map((marker: BasePin) => (
        <CustomMarker
          key={marker.id}
          data={marker}
          onClick={() => onPlaceSelect(marker.id)}
          isSelected={marker.id === selectedPlaceId}
        />
      ))}
    </GoogleMap>
  );
}
