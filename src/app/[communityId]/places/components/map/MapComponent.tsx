import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useMapState } from "@/app/[communityId]/places/hooks/useMapState";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { usePreloadImages } from "@/app/[communityId]/places/hooks/usePreloadImages";
import { IPlacePin } from "@/app/[communityId]/places/data/type";
import CustomMarker from "./CustomMarker";

const containerStyle = {
  width: "100%",
  height: "100%",
};

interface MapComponentProps {
  placePins: IPlacePin[];
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string | null) => void;
  onRecenterReady?: (fn: () => void) => void;
}

export default function MapComponent({
  placePins,
  selectedPlaceId,
  onPlaceSelect,
  onRecenterReady,
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

  const { markers, center, zoom, onLoad, onUnmount, recenterToSelectedMarker } = useMapState({
    placePins,
    selectedPlaceId,
  });

  React.useEffect(() => {
    if (onRecenterReady) {
      onRecenterReady(recenterToSelectedMarker);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recenterToSelectedMarker]);

  if (!isLoaded || !imagesReady) {
    return <LoadingIndicator fullScreen />;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        gestureHandling: "greedy",
        disableDefaultUI: true,
        scrollwheel: true,
        zoomControl: true,
      }}
      onClick={() => onPlaceSelect(null)}
    >
      {markers.map((marker: IPlacePin) => (
        <CustomMarker
          key={marker.id}
          data={marker}
          onClick={() => {
            console.debug(`マーカークリック - ID: ${marker.id}, 現在の選択ID: ${selectedPlaceId}`);
            console.debug(`マーカーデータ:`, marker);
            onPlaceSelect(marker.id);
          }}
          isSelected={marker.id === selectedPlaceId}
        />
      ))}
    </GoogleMap>
  );
}
