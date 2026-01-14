"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GqlPlaceEdge, useGetPlacesQuery } from "@/types/graphql";
import { presenterPlaceCard, presenterPlacePins } from "@/app/[communityId]/places/data/presenter";
import {
  getCoordinatesFromAddress,
  PRIORITIZE_LAT_LNG_PLACE_IDS,
} from "@/app/[communityId]/places/utils/geocoding";
import { IPlacePin } from "@/app/[communityId]/places/data/type";
import { useJsApiLoader } from "@react-google-maps/api";
import { logger } from "@/lib/logging";

/**
 * 共通のデータソースからマーカーとカードのデータを提供するフック
 * usePlaceCards と usePlacePins の機能を統合
 */
export default function usePlacesData() {
  // 共通のデータ取得
  const { data, loading, error, refetch } = useGetPlacesQuery({
    variables: {
      filter: {},
      first: 100,
      IsCard: true, // カード表示に必要な追加データを取得
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  // Google Maps API のロード状態
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    language: "ja",
    region: "JP",
  });

  // データの整形
  const placeEdges: GqlPlaceEdge[] = (data?.places?.edges ?? []).filter(
    (e): e is GqlPlaceEdge => e != null && e.node != null,
  );

  // カードデータの生成
  const baseCards = useMemo(() => presenterPlaceCard(placeEdges), [placeEdges]);

  // マーカーデータの生成
  const basePlacePins = useMemo(() => presenterPlacePins(placeEdges), [placeEdges]);

  // ジオコーディング関連の状態
  const prevPinIdsRef = useRef<string[]>([]);
  const [geocodedPlacePins, setGeocodedPlacePins] = useState<IPlacePin[]>([]);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // ピンが変更されたかどうかを確認
  const pinsChanged = useMemo(() => {
    const currentPinIds = basePlacePins
      .map((pin) => pin.id)
      .sort()
      .join(",");
    const prevPinIds = prevPinIdsRef.current.sort().join(",");
    return currentPinIds !== prevPinIds;
  }, [basePlacePins]);

  // 住所から緯度経度を取得して更新する
  useEffect(() => {
    if (!isLoaded || !basePlacePins.length || isGeocoding || !pinsChanged) return;

    const geocodePins = async () => {
      setIsGeocoding(true);

      // 現在のピンIDを保存
      prevPinIdsRef.current = basePlacePins.map((pin) => pin.id);

      const updatedPins = await Promise.all(
        basePlacePins.map(async (pin) => {
          if (!pin.address) return pin;

          const prioritizeLatLng = PRIORITIZE_LAT_LNG_PLACE_IDS.includes(pin.id);

          if (prioritizeLatLng) {
            return pin;
          }

          const coordinates = await getCoordinatesFromAddress(pin.address, pin.id);

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

  // 最終的なピンデータ
  const placePins = useMemo(
    () => (geocodedPlacePins.length > 0 ? geocodedPlacePins : basePlacePins),
    [geocodedPlacePins, basePlacePins],
  );

  // IDの一致確認（デバッグ用）
  useEffect(() => {
    // マーカーとカードのIDマッピングを確認
    const markerIds = placePins.map((pin) => pin.id).sort();
    const cardIds = baseCards.map((card) => card.id).sort();

    const missingInMarkers = cardIds.filter((id) => !markerIds.includes(id));
    const missingInCards = markerIds.filter((id) => !cardIds.includes(id));

    if (missingInMarkers.length > 0) {
      logger.warn("カードにあってマーカーにないID", {
        missingInMarkers,
        component: "usePlacesData"
      });
    }

    if (missingInCards.length > 0) {
      logger.warn("マーカーにあってカードにないID", {
        missingInCards,
        component: "usePlacesData"
      });
    }
  }, [placePins, baseCards]);

  return {
    cards: baseCards,
    pins: placePins,
    loading: loading || isGeocoding,
    error: error ?? null,
    refetch,
  };
}
