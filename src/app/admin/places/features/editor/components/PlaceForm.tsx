"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { PlaceFormSection } from "./sections/PlaceFormSection";
import { usePlaceEditor } from "../hooks/usePlaceEditor";

interface PlaceFormProps {
  editor: ReturnType<typeof usePlaceEditor>;
  onSubmit: (e: FormEvent) => void;
  onCityClick: () => void;
  selectedCityName: string | null;
}

export function PlaceForm({
  editor,
  onSubmit,
  onCityClick,
  selectedCityName,
}: PlaceFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* フォームセクション */}
      <PlaceFormSection
        name={editor.formState.name}
        onNameChange={(value) => editor.updateField("name", value)}
        address={editor.formState.address}
        onAddressChange={editor.handleAddressChange}
        coordinatesConfirmed={editor.coordinatesConfirmed}
        coordinatesNeedReview={editor.coordinatesNeedReview}
        latitude={editor.formState.latitude}
        longitude={editor.formState.longitude}
        onMapClick={editor.handleMapClick}
        showCitySelector={editor.showCitySelector}
        cityCode={editor.formState.cityCode}
        cityName={selectedCityName}
        onCityClick={onCityClick}
        errors={editor.errors}
      />

      {/* 送信ボタン */}
      <div className="w-full max-w-[345px] mx-auto">
        <Button
          type="submit"
          variant="primary"
          className="w-full h-[56px]"
          disabled={editor.saving}
        >
          {editor.saving ? "保存中..." : "保存"}
        </Button>
      </div>
    </form>
  );
}
