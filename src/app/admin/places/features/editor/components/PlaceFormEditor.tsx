"use client";

import { usePlaceEditor } from "../hooks/usePlaceEditor";
import { PlaceForm } from "./PlaceForm";
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <PlaceForm
        formState={editor.formState}
        onFieldChange={editor.updateField}
        onAddressChange={editor.handleAddressChange}
        onSubmit={editor.handleSave}
        saving={editor.saving}
        geocoding={editor.geocoding}
      />
    </div>
  );
}
