"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { usePlaceEditor } from "../hooks/usePlaceEditor";
import { PlaceForm } from "./PlaceForm";
import { PlaceEditorLayout } from "./PlaceEditorLayout";
import { StateSelectorSheet } from "./sheets/StateSelectorSheet";
import { CitySelectorSheet } from "./sheets/CitySelectorSheet";
import { MapConfirmSheet } from "./sheets/MapConfirmSheet";
import { PlaceFormData } from "../../shared/types/place";
import { GET_STATES } from "../queries";

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

  // Sheet管理
  const [stateSheetOpen, setStateSheetOpen] = useState(false);
  const [selectedStateName, setSelectedStateName] = useState<string | null>(null);

  const [citySheetOpen, setCitySheetOpen] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState<string | null>(
    initialData?.cityName || null
  );

  // 都道府県マスタを取得（既存データ解析用）
  const { data: statesData } = useQuery(GET_STATES, {
    variables: { first: 50 }, // 日本の都道府県は47なので50で十分
    skip: !initialData?.address || !!initialData?.cityCode === false,
    fetchPolicy: "cache-first",
  });

  // 既存データの住所分割処理（Phase 4）
  useEffect(() => {
    // 既存データで住所があり、まだstateCodeが設定されていない場合のみ実行
    if (
      initialData?.address &&
      initialData?.cityCode &&
      !editor.formState.stateCode &&
      statesData?.states?.edges
    ) {
      const states = statesData.states.edges;
      const address = initialData.address;

      // 1. 都道府県名を抽出（住所の先頭から都道府県名を検索）
      let matchedState = null;
      for (const edge of states) {
        const state = edge?.node;
        if (state?.name && address.startsWith(state.name)) {
          matchedState = state;
          break;
        }
      }

      if (matchedState) {
        // stateCodeとstateNameを設定
        editor.updateField("stateCode", matchedState.code);
        editor.updateField("stateName", matchedState.name);
        setSelectedStateName(matchedState.name);

        // 2. streetAddressを抽出（都道府県名と市区町村名を除去）
        let streetAddress = address.substring(matchedState.name.length);

        // 市区町村名を除去
        if (initialData.cityName && streetAddress.startsWith(initialData.cityName)) {
          streetAddress = streetAddress.substring(initialData.cityName.length);
        }

        editor.updateField("streetAddress", streetAddress);
      }
    }
  }, [initialData, statesData, editor.formState.stateCode]);

  const handleStateSelect = (code: string, name: string) => {
    editor.handleStateSelect(code, name);
    setSelectedStateName(name);
    setStateSheetOpen(false);
  };

  const handleCitySelect = (code: string, name: string) => {
    editor.handleCitySelect(code, name);
    setSelectedCityName(name);
    setCitySheetOpen(false);
  };

  return (
    <PlaceEditorLayout>
      <PlaceForm
        editor={editor}
        onSubmit={editor.handleSave}
        onStateClick={() => setStateSheetOpen(true)}
        selectedStateName={selectedStateName}
        onCityClick={() => setCitySheetOpen(true)}
        selectedCityName={selectedCityName}
      />

      {/* 都道府県選択シート */}
      <StateSelectorSheet
        open={stateSheetOpen}
        onOpenChange={setStateSheetOpen}
        selectedStateCode={editor.formState.stateCode}
        onSelectState={handleStateSelect}
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
        address={`${editor.formState.stateName}${editor.formState.cityName}${editor.formState.streetAddress}`}
        initialLatitude={editor.formState.latitude || undefined}
        initialLongitude={editor.formState.longitude || undefined}
        onConfirm={editor.handleMapConfirm}
      />
    </PlaceEditorLayout>
  );
}
