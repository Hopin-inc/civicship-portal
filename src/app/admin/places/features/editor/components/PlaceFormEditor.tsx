"use client";

import { useState } from "react";
import { usePlaceEditor } from "../hooks/usePlaceEditor";
import { PlaceForm } from "./PlaceForm";
import { PlaceEditorLayout } from "./PlaceEditorLayout";
import { CitySelectorSheet } from "./sheets/CitySelectorSheet";
import { MapConfirmSheet } from "./sheets/MapConfirmSheet";
import { PlaceFormData } from "../../shared/types/place";

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
  const [citySheetOpen, setCitySheetOpen] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState<string | null>(
    initialData?.cityName || null
  );

  const handleCitySelect = (code: string, name: string) => {
    editor.handleCitySelect(code);
    setSelectedCityName(name);
    setCitySheetOpen(false);
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
        onConfirm={editor.handleMapConfirm}
      />
    </PlaceEditorLayout>
  );
}
