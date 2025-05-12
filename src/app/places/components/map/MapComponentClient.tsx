"use client";

import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import CustomMarker from "@/app/places/components/map/CustomMarker";
import { useMapState } from "@/app/places/hooks/useMapState";
import { BasePin, BaseCardInfo } from "@/app/places/data/type";

const containerStyle = {
  width: "100%",
  height: "100%",
};

interface MapComponentClientProps {
  places: BaseCardInfo[];
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string) => void;
}

export const MapComponentClient = ({
  places,
  selectedPlaceId,
  onPlaceSelect,
}: MapComponentClientProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const { markers, center, map, onLoad, onUnmount } = useMapState({
    places,
    selectedPlaceId,
    onPlaceSelect,
  });

  console.log("MapComponent - markers:", markers);

  if (!isLoaded) {
    return <></>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={9}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      }}
    >
      {markers.map((marker: BasePin) => (
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
