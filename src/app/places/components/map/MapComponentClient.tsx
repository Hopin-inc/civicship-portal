import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import CustomMarker from "@/app/places/components/map/CustomMarker";
import { useMapState } from "@/app/places/hooks/useMapState";
import { BasePin } from "@/app/places/data/type";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { usePreloadImages } from "@/hooks/usePreloadImages";

const containerStyle = {
  width: "100%",
  height: "100%",
};

interface MapComponentClientProps {
  placePins: BasePin[];
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string) => void;
}

export const MapComponentClient = ({
  placePins,
  selectedPlaceId,
  onPlaceSelect,
}: MapComponentClientProps) => {
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
  usePreloadImages(allImageUrls);

  const { markers, center, onLoad, onUnmount } = useMapState({
    placePins,
    selectedPlaceId,
  });

  if (!isLoaded) {
    return <LoadingIndicator fullScreen={true} />;
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
        scrollwheel: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      }}
    >
      {isLoaded &&
        markers.map((marker: BasePin) => (
          <CustomMarker
            key={marker.id}
            data={marker}
            onClick={() => onPlaceSelect?.(marker.id)}
            isSelected={marker.id === selectedPlaceId}
          />
        ))}
    </GoogleMap>
  );
};
