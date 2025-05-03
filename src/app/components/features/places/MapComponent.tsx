'use client';

import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { MapComponentProps, MarkerData } from '@/types/maps';
import CustomMarker from './markers/CustomMarker';
import { useMapState } from '@/hooks/useMapState';

const containerStyle = {
  width: '100%',
  height: '100%'
};

/**
 * マップコンポーネント
 * Google Mapsを使用して場所を表示するコンポーネント
 */
export default function MapComponent({ memberships, selectedPlaceId, onPlaceSelect }: MapComponentProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const {
    markers,
    center,
    map,
    onLoad,
    onUnmount,
  } = useMapState({ memberships, selectedPlaceId, onPlaceSelect });

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
      {markers.map((marker: MarkerData) => (
        <CustomMarker
          key={marker.id}
          data={marker}
          onClick={() => onPlaceSelect?.(marker.placeId)}
          isSelected={marker.placeId === selectedPlaceId}
        />
      ))}
    </GoogleMap>
  );
}        