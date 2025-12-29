import { useState, useCallback, useEffect } from "react";
import { PlaceEditorFormState, createInitialFormState } from "../types/form";
import { usePlaceSave } from "./usePlaceSave";
import { getCoordinatesFromAddress } from "@/app/places/utils/geocoding";
import { PlaceFormData } from "../../shared/types/place";

interface UsePlaceEditorOptions {
  placeId?: string;
  initialData?: Partial<PlaceFormData>;
  onSuccess?: (id: string) => void;
}

export const usePlaceEditor = ({
  placeId,
  initialData,
  onSuccess,
}: UsePlaceEditorOptions = {}) => {
  const [formState, setFormState] = useState<PlaceEditorFormState>(
    createInitialFormState(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { handleSave: savePlace } = usePlaceSave({ placeId, onSuccess });

  // フィールド更新
  const updateField = useCallback(
    <K extends keyof PlaceEditorFormState>(field: K, value: PlaceEditorFormState[K]) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // 住所変更時に座標を自動取得
  const handleAddressChange = useCallback(
    async (address: string) => {
      updateField("address", address);

      if (!address.trim()) {
        updateField("latitude", null);
        updateField("longitude", null);
        return;
      }

      setGeocoding(true);
      try {
        const coordinates = await getCoordinatesFromAddress(address);
        if (coordinates) {
          updateField("latitude", coordinates.lat);
          updateField("longitude", coordinates.lng);
          updateField("isManual", false);
        } else {
          updateField("isManual", true);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
        updateField("isManual", true);
      } finally {
        setGeocoding(false);
      }
    },
    [updateField]
  );

  // 保存処理
  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaving(true);
      try {
        const result = await savePlace(formState);
        return result;
      } finally {
        setSaving(false);
      }
    },
    [formState, savePlace]
  );

  return {
    formState,
    updateField,
    handleAddressChange,
    handleSave,
    saving,
    geocoding,
    errors,
  };
};
