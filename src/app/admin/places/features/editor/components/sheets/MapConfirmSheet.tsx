"use client";

import { useCallback, useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useQuery } from "@apollo/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { getCoordinatesFromAddress } from "@/app/places/utils/geocoding";
import { logger } from "@/lib/logging";
import { GET_CITIES } from "../../queries";
import { resolveCityCode } from "../../utils/resolveCityCode";

interface MapConfirmSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: string;
  initialLatitude?: number;
  initialLongitude?: number;
  onConfirm: (result: { latitude: number; longitude: number; cityCode: string | null }) => void;
}

// 東京駅をデフォルト位置として使用
const TOKYO_STATION = {
  lat: 35.681236,
  lng: 139.767125,
};

const DEFAULT_ZOOM = 15;

export function MapConfirmSheet({
  open,
  onOpenChange,
  address,
  initialLatitude,
  initialLongitude,
  onConfirm,
}: MapConfirmSheetProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [geocoded, setGeocoded] = useState(false);
  const [geocodeFailed, setGeocodeFailed] = useState(false);
  const [geocodeResult, setGeocodeResult] = useState<google.maps.GeocoderResult | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    language: "ja",
    region: "JP",
  });

  // Cities データ取得（cityCode解決用）
  const { data: citiesData } = useQuery(GET_CITIES, {
    variables: {
      first: 500,
      sort: { code: "ASC" },
    },
    fetchPolicy: "cache-first",
  });

  // Sheet表示時に初回geocode実行
  useEffect(() => {
    if (!open) {
      // Sheetが閉じられたら状態をリセット
      setGeocoded(false);
      setGeocodeFailed(false);
      setPosition(null);
      setGeocodeResult(null);
      return;
    }

    // 既にgeocode済みの場合はスキップ
    if (geocoded) {
      return;
    }

    // 初期座標が指定されている場合はそれを使用
    if (initialLatitude !== undefined && initialLongitude !== undefined) {
      setPosition({ lat: initialLatitude, lng: initialLongitude });
      setGeocoded(true);
      return;
    }

    // geocode実行（1回のみ）
    const executeGeocode = async () => {
      if (!address.trim()) {
        setPosition(TOKYO_STATION);
        setGeocodeFailed(true);
        setGeocoded(true);
        return;
      }

      try {
        const coordinates = await getCoordinatesFromAddress(address, "");
        if (coordinates) {
          setPosition({ lat: coordinates.lat, lng: coordinates.lng });
          // geocode結果を保存（cityCode解決用）
          // Note: getCoordinatesFromAddressは座標のみ返すため、
          // cityCode解決は後でGoogle Geocoder APIを直接呼び出す必要がある
          setGeocodeFailed(false);
        } else {
          setPosition(TOKYO_STATION);
          setGeocodeFailed(true);
        }
      } catch (error) {
        logger.error("Geocoding error:", { error });
        setPosition(TOKYO_STATION);
        setGeocodeFailed(true);
      } finally {
        setGeocoded(true);
      }
    };

    executeGeocode();
  }, [open, address, initialLatitude, initialLongitude, geocoded]);

  // ピンドラッグハンドラ
  const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setPosition({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
      // reverse geocodeは実行しない（要件7）
    }
  }, []);

  // 確定ボタンハンドラ
  const handleConfirm = useCallback(async () => {
    if (!position) return;

    let cityCode: string | null = null;

    try {
      // 1. Reverse geocodingで住所情報を取得
      const geocoder = new google.maps.Geocoder();
      const result = await geocoder.geocode({
        location: { lat: position.lat, lng: position.lng },
      });

      if (result.results && result.results.length > 0) {
        // 2. Cities データ準備
        const cities =
          citiesData?.cities?.edges?.map((edge: any) => edge?.node).filter(Boolean) || [];

        // 3. cityCode解決（都道府県考慮あり）
        cityCode = resolveCityCode(result.results[0], cities);
      }
    } catch (error) {
      logger.error("Reverse geocoding error:", { error });
      // エラーでもcityCode=nullで続行
    }

    onConfirm({
      latitude: position.lat,
      longitude: position.lng,
      cityCode,
    });
  }, [position, citiesData, onConfirm]);

  if (!isLoaded) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-w-md mx-auto p-0 overflow-hidden h-[80vh]"
      >
        <div className="flex flex-col h-full">
          {/* ヘッダー */}
          <SheetHeader className="text-left p-6 pb-4">
            <SheetTitle className="text-title-sm">地図で位置を確認</SheetTitle>
            {geocodeFailed && (
              <p className="text-xs text-amber-600 mt-2">
                住所から位置を特定できませんでした。地図上でピンを調整してください。
              </p>
            )}
          </SheetHeader>

          {/* 地図エリア */}
          <div className="flex-1 relative">
            {!position && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <LoadingIndicator />
              </div>
            )}

            {position && (
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "100%",
                }}
                center={position}
                zoom={DEFAULT_ZOOM}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                  gestureHandling: "greedy",
                }}
              >
                <Marker position={position} draggable={true} onDragEnd={handleMarkerDragEnd} />
              </GoogleMap>
            )}
          </div>

          {/* フッター */}
          <div className="p-6 border-t">
            <div className="space-y-2">
              <Button
                onClick={handleConfirm}
                className="w-full"
                variant="primary"
                disabled={!position}
              >
                確定する
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                className="w-full"
                variant="ghost"
                size="sm"
              >
                キャンセル
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
