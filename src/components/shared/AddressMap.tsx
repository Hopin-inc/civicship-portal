"use client";

import React, { useCallback, useState, useRef } from "react";
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
  latitude?: number; // 緯度（フォールバック用）
  longitude?: number; //経度（フォールバック用）
}

const DEFAULT_CENTER = {
  lat: 33.75,
  lng: 133.5,
};

const DEFAULT_ZOOM = 17;

function useAddressGeocoding(
  address: string | undefined,
  fallbackLat?: number,
  fallbackLng?: number,
  onSuccess?: (location: google.maps.LatLng) => void,
) {
  const [location, setLocation] = useState<google.maps.LatLng | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const geocodeRequestRef = useRef<AbortController | null>(null);

  const geocodeAddress = useCallback(
    async (map?: google.maps.Map | null, zoom?: number) => {
      if (!address) return null;

      // 前回のリクエストがあればキャンセル
      if (geocodeRequestRef.current) {
        geocodeRequestRef.current.abort();
      }

      setIsGeocoding(true);

      try {
        const coordinates = await getCoordinatesFromAddress(address);

        if (coordinates) {
          const newLocation = new google.maps.LatLng(coordinates.lat, coordinates.lng);
          setLocation(newLocation);

          if (map) {
            map.setCenter(newLocation);
            if (zoom !== undefined) map.setZoom(zoom);
          }

          if (onSuccess) {
            onSuccess(newLocation);
          }

          return newLocation;
        }

        // 住所からの取得に失敗した場合、フォールバックの座標を使用
        return useFallbackCoordinates(map, zoom);
      } catch (error) {
        console.error("Error geocoding address:", error);

        // エラー発生時もフォールバックの座標を使用
        return useFallbackCoordinates(map, zoom);
      } finally {
        setIsGeocoding(false);
      }
    },
    [address, fallbackLat, fallbackLng, onSuccess],
  );

  const useFallbackCoordinates = useCallback(
    (map?: google.maps.Map | null, zoom?: number) => {
      if (fallbackLat === undefined || fallbackLng === undefined) {
        return null;
      }

      const fallbackLocation = new google.maps.LatLng(fallbackLat, fallbackLng);
      setLocation(fallbackLocation);

      if (map) {
        map.setCenter(fallbackLocation);
        if (zoom !== undefined) map.setZoom(zoom);
      }

      if (onSuccess) {
        onSuccess(fallbackLocation);
      }

      return fallbackLocation;
    },
    [fallbackLat, fallbackLng, onSuccess],
  );

  return {
    location,
    isGeocoding,
    geocodeAddress,
  };
}

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
  latitude,
  longitude,
}: AddressMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { location: markerPosition, geocodeAddress } = useAddressGeocoding(
    address,
    latitude,
    longitude,
    onLocationFound,
  );

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
    (mapInstance: google.maps.Map) => {
      setMap(mapInstance);

      // マップがロードされたら住所の位置情報を取得
      geocodeAddress(mapInstance, zoom);

      if (onMapLoad) {
        onMapLoad(mapInstance);
      }
    },
    [onMapLoad, geocodeAddress, zoom],
  );

  const onUnmount = useCallback(() => {
    setMap(null);
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
