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
import { parseStreetAddress } from "../services/addressService";

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

  // シート管理
  const [stateSheetOpen, setStateSheetOpen] = useState(false);
  const [citySheetOpen, setCitySheetOpen] = useState(false);

  // 都道府県マスタを取得（既存データ解析用）
  const { data: statesData } = useQuery(GET_STATES, {
    variables: { first: 50 },
    skip: !initialData?.address || !initialData?.cityCode,
    fetchPolicy: "cache-first",
  });

  // 既存データの住所分割処理
  useEffect(() => {
    if (
      initialData?.address &&
      initialData?.cityCode &&
      !editor.formState.stateCode &&
      statesData?.states?.edges
    ) {
      const states = statesData.states.edges;
      const address = initialData.address;

      // 都道府県名を抽出
      let matchedState = null;
      for (const edge of states) {
        const state = edge?.node;
        if (state?.name && address.startsWith(state.name)) {
          matchedState = state;
          break;
        }
      }

      if (matchedState && initialData.cityName) {
        // stateCodeとstateNameを設定
        editor.updateField("stateCode", matchedState.code);
        editor.updateField("stateName", matchedState.name);

        // streetAddressを抽出（addressServiceを使用）
        const streetAddress = parseStreetAddress(
          address,
          matchedState.name,
          initialData.cityName
        );

        editor.updateField("streetAddress", streetAddress);
      }
    }
  }, [initialData, statesData, editor.formState.stateCode, editor]);

  const handleStateSelect = (code: string, name: string) => {
    editor.handleStateSelect(code, name);
    setStateSheetOpen(false);
  };

  const handleCitySelect = (code: string, name: string) => {
    editor.handleCitySelect(code, name);
    setCitySheetOpen(false);
  };

  return (
    <PlaceEditorLayout>
      <PlaceForm
        editor={editor}
        onSubmit={editor.handleSave}
        onStateClick={() => setStateSheetOpen(true)}
        selectedStateName={editor.formState.stateName || null}
        onCityClick={() => setCitySheetOpen(true)}
        selectedCityName={editor.formState.cityName || null}
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
