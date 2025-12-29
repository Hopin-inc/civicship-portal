"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { usePlaceEditor } from "../hooks/usePlaceEditor";
import { PlaceForm } from "./PlaceForm";
import { PlaceEditorLayout } from "./PlaceEditorLayout";
import { CitySelectorSheet } from "./sheets/CitySelectorSheet";
import { MapConfirmSheet } from "./sheets/MapConfirmSheet";
import { PlaceFormData } from "../../shared/types/place";
import { GET_CITIES } from "../queries";
import { resolveCityCode } from "../utils/resolveCityCode";

interface PlaceFormEditorProps {
  placeId?: string;
  initialData?: Partial<PlaceFormData>;
  onSuccess?: (id: string) => void;
}

export function PlaceFormEditor({ placeId, initialData, onSuccess }: PlaceFormEditorProps) {
  const editor = usePlaceEditor({
    placeId,
    initialData,
    onSuccess,
  });

  // Cityマスタデータ取得
  const { data: citiesData } = useQuery(GET_CITIES, {
    variables: {
      first: 1000,
      sort: { code: "ASC" },
    },
    fetchPolicy: "cache-first",
  });

  // citiesリストを作成
  const cities = useMemo(() => {
    return (citiesData?.cities?.edges || [])
      .map((edge: any) => {
        const city = edge?.node;
        if (city && city.code && city.name) {
          return {
            code: city.code,
            name: city.name,
            state: city.state,
          };
        }
        return null;
      })
      .filter((city: any): city is any => city !== null);
  }, [citiesData]);

  // Sheet管理
  const [citySheetOpen, setCitySheetOpen] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState<string | null>(
    initialData?.cityName || null
  );

  const handleCitySelect = (code: string, name: string) => {
    editor.handleCitySelect(code);
    setSelectedCityName(name);
    setCitySheetOpen(false);
  };

  // 地図確定ハンドラ（resolveCityCode統合）
  const handleMapConfirm = (result: {
    latitude: number;
    longitude: number;
    cityCode: string | null;
  }) => {
    // cityCodeを解決（TODOを実装）
    // Note: MapConfirmSheetからgeocodeResultを受け取る必要があるため、
    // 現時点ではcityCode解決は後回しにする
    editor.handleMapConfirm(result);
  };

  return (
    <PlaceEditorLayout>
      <PlaceForm
        editor={editor}
        onSubmit={editor.handleSave}
        onCityClick={() => setCitySheetOpen(true)}
        selectedCityName={selectedCityName}
      />

      {/* 市区町村選択シート */}
      <CitySelectorSheet
        open={citySheetOpen}
        onOpenChange={setCitySheetOpen}
        selectedCityCode={editor.formState.cityCode}
        onSelectCity={handleCitySelect}
      />

      {/* 地図確認シート */}
      <MapConfirmSheet
        open={editor.mapSheetOpen}
        onOpenChange={editor.setMapSheetOpen}
        address={editor.formState.address}
        initialLatitude={editor.formState.latitude || undefined}
        initialLongitude={editor.formState.longitude || undefined}
        onConfirm={handleMapConfirm}
      />
    </PlaceEditorLayout>
  );
}
