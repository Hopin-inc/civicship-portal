"use client";

import React, { useCallback, useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { getCoordinatesFromAddress } from "@/utils/maps/geocoding";

interface AddressMapProps {
  address: string;
  markerTitle?: string;
  height?: number | string;
  width?: number | string;
  zoom?: number;
  loadingComponent?: React.ReactNode;
  mapOptions?: google.maps.MapOptions;
  markerOptions?: Omit<google.maps.MarkerOptions, "position" | "map">;
  onMapLoad?: (map: google.maps.Map) => void;
  onLocationFound?: (location: google.maps.LatLng) => void;
}

const DEFAULT_CENTER = {
  lat: 33.75,
  lng: 133.5,
};

const DEFAULT_ZOOM = 17;

/**
 * 住所から位置を特定してマップとマーカーを表示するコンポーネント
 * #NOTE: strapi に保存された緯度経度は若干位置がずれるため、住所から位置情報を再取得して表示するために利用している
 */
export default function AddressMap({
  address,
  markerTitle,
  height = 300,
  width = "100%",
  zoom = DEFAULT_ZOOM,
  loadingComponent,
  mapOptions,
  markerOptions,
  onMapLoad,
  onLocationFound,
}: AddressMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLng | null>(null);

  const containerStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: "0.5rem",
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    language: "ja",
    region: "JP",
  });

  // 地図がロードされたときの処理
  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);

      if (onMapLoad) {
        onMapLoad(map);
      }
    },
    [onMapLoad],
  );

  // 住所から位置情報を取得して地図を更新する
  useEffect(() => {
    if (!isLoaded || !map || !address) return;

    const geocodeAddress = async () => {
      const coordinates = await getCoordinatesFromAddress(address);

      if (coordinates) {
        const location = new google.maps.LatLng(coordinates.lat, coordinates.lng);
        setMarkerPosition(location);
        map.setCenter(location);
        map.setZoom(zoom);

        // 位置が見つかった時のコールバックを実行
        if (onLocationFound) {
          onLocationFound(location);
        }
      }
    };

    geocodeAddress();
  }, [address, map, isLoaded, zoom, onLocationFound]);

  const onUnmount = useCallback(() => {
    setMap(null);
    setMarkerPosition(null);
  }, []);

  if (!isLoaded) {
    return loadingComponent || <LoadingIndicator />;
  }

  return (
    <div
      className="relative w-full rounded-lg overflow-hidden"
      style={{ height: containerStyle.height }}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={DEFAULT_CENTER}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          ...mapOptions,
        }}
      >
        {markerPosition && (
          <Marker position={markerPosition} title={markerTitle} options={markerOptions} />
        )}
      </GoogleMap>
    </div>
  );
}
