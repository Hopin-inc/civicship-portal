"use client";

import { GqlPlaceEdge, useGetPlacesQuery } from "@/types/graphql";
import { useEffect, useMemo, useState, useRef } from "react";
import { presenterPlacePins } from "@/app/places/data/presenter";
import { getCoordinatesFromAddress } from "@/utils/maps/geocoding";
import { IPlacePin } from "@/app/places/data/type";
import { useJsApiLoader } from "@react-google-maps/api";

export default function usePlacePins() {
  const { data, loading, error, fetchMore, refetch } = useGetPlacesQuery({
    variables: { first: 100 },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    language: "ja",
    region: "JP",
  });

  const placeEdges: GqlPlaceEdge[] = (data?.places?.edges ?? []).filter(
    (e): e is GqlPlaceEdge => e != null && e.node != null,
  );

  const basePlacePins = useMemo(() => presenterPlacePins(placeEdges), [placeEdges]);

  const prevPinIdsRef = useRef<string[]>([]);

  const [geocodedPlacePins, setGeocodedPlacePins] = useState<IPlacePin[]>([]);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const pinsChanged = useMemo(() => {
    const currentPinIds = basePlacePins
      .map((pin) => pin.id)
      .sort()
      .join(",");
    const prevPinIds = prevPinIdsRef.current.sort().join(",");
    return currentPinIds !== prevPinIds;
  }, [basePlacePins]);

  // 住所から緯度経度を取得して更新する
  // #NOTE: strapi に保存された緯度経度は若干位置がずれるため、住所から位置情報を再取得して表示するため
  useEffect(() => {
    if (!isLoaded || !basePlacePins.length || isGeocoding || !pinsChanged) return;

    const geocodePins = async () => {
      setIsGeocoding(true);

      // 現在のピンIDを保存
      prevPinIdsRef.current = basePlacePins.map((pin) => pin.id);

      const updatedPins = await Promise.all(
        basePlacePins.map(async (pin) => {
          if (!pin.address) return pin;

          const fallbackCoordinates =
            pin.latitude && pin.longitude ? { lat: pin.latitude, lng: pin.longitude } : undefined;

          const coordinates = await getCoordinatesFromAddress(pin.address, fallbackCoordinates);

          if (coordinates) {
            return {
              ...pin,
              latitude: coordinates.lat,
              longitude: coordinates.lng,
            };
          }

          return pin;
        }),
      );

      setGeocodedPlacePins(updatedPins);
      setIsGeocoding(false);
    };

    geocodePins();
  }, [basePlacePins, isLoaded, isGeocoding, pinsChanged]);

  const placePins = useMemo(
    () => (geocodedPlacePins.length > 0 ? geocodedPlacePins : basePlacePins),
    [geocodedPlacePins, basePlacePins],
  );

  return {
    placePins,
    loading: loading || isGeocoding,
    error: error ?? null,
    refetch,
  };
}
