"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { PlaceFormSection } from "./sections/PlaceFormSection";
import { usePlaceEditor } from "../hooks/usePlaceEditor";

interface PlaceFormProps {
  editor: ReturnType<typeof usePlaceEditor>;
  onSubmit: (e: FormEvent) => void;
  onStateClick: () => void;
  selectedStateName: string | null;
  onCityClick: () => void;
  selectedCityName: string | null;
}

export function PlaceForm({
  editor,
  onSubmit,
  onStateClick,
  selectedStateName,
  onCityClick,
  selectedCityName,
}: PlaceFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* フォームセクション */}
      <PlaceFormSection
        name={editor.formState.name}
        onNameChange={(value) => editor.updateField("name", value)}
        postalCode={editor.postalCode}
        onPostalCodeChange={editor.setPostalCode}
        onPostalCodeSearch={editor.handlePostalCodeSearch}
        postalCodeSearching={editor.postalCodeSearching}
        stateCode={editor.formState.stateCode}
        stateName={selectedStateName}
        onStateClick={onStateClick}
        cityCode={editor.formState.cityCode}
        cityName={selectedCityName}
        onCityClick={onCityClick}
        streetAddress={editor.formState.streetAddress}
        onStreetAddressChange={editor.handleStreetAddressChange}
        coordinatesConfirmed={editor.coordinatesConfirmed}
        coordinatesNeedReview={editor.coordinatesNeedReview}
        latitude={editor.formState.latitude}
        longitude={editor.formState.longitude}
        onMapClick={editor.handleMapClick}
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
