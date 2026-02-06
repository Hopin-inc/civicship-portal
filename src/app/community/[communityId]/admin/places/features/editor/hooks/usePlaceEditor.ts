/**
 * Place編集フック（ファサード）
 * useAddressForm, useCoordinates, usePlaceSaveを統合
 */

import { useState, useCallback } from "react";
import { PlaceEditorFormState } from "../types/form";
import { usePlaceSave } from "./usePlaceSave";
import { useAddressForm } from "./useAddressForm";
import { useCoordinates } from "./useCoordinates";
import { PlaceFormData } from "../../shared/types/place";
import { formatFullAddress } from "../services/addressService";

interface UsePlaceEditorOptions {
  placeId?: string;
  initialData?: Partial<PlaceFormData>;
  onSuccess?: (id: string) => void;
}

interface FormErrors {
  name?: string;
  address?: string;
  coordinates?: string;
  cityCode?: string;
}

export const usePlaceEditor = ({
  placeId,
  initialData,
  onSuccess,
}: UsePlaceEditorOptions = {}) => {
  // 基本フォーム状態（nameのみ）
  const [name, setName] = useState(initialData?.name || "");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // 住所フォーム
  const addressForm = useAddressForm({
    initialState: {
      stateCode: initialData?.stateCode || "",
      stateName: initialData?.stateName || "",
      cityCode: initialData?.cityCode || "",
      cityName: initialData?.cityName || "",
      streetAddress: initialData?.streetAddress || "",
    },
    onAddressChange: () => {
      // 住所変更時に座標要再確認フラグを立てる
      coordinates.markCoordinatesForReview();
    },
  });

  // 座標管理
  const coordinates = useCoordinates({
    initialCoordinates: {
      latitude: initialData?.latitude ?? null,
      longitude: initialData?.longitude ?? null,
    },
  });

  // 保存処理
  const { handleSave: savePlace } = usePlaceSave({ placeId, onSuccess });

  // フィールド更新（汎用）
  const updateField = useCallback(
    <K extends keyof PlaceEditorFormState>(
      field: K,
      value: PlaceEditorFormState[K]
    ) => {
      // フィールドに応じて適切なハンドラを呼ぶ
      switch (field) {
        case "name":
          setName(value as string);
          break;
        case "stateCode":
          addressForm.updateAddressField("stateCode", value as string);
          break;
        case "stateName":
          addressForm.updateAddressField("stateName", value as string);
          break;
        case "cityCode":
          addressForm.updateAddressField("cityCode", value as string);
          break;
        case "cityName":
          addressForm.updateAddressField("cityName", value as string);
          break;
        case "streetAddress":
          addressForm.updateAddressField("streetAddress", value as string);
          break;
        case "latitude":
          coordinates.updateCoordinates(
            value as number,
            coordinates.longitude || 0
          );
          break;
        case "longitude":
          coordinates.updateCoordinates(
            coordinates.latitude || 0,
            value as number
          );
          break;
        default:
          console.warn(`Unknown field: ${field}`);
      }
    },
    [addressForm, coordinates]
  );

  // 地図確定ハンドラ（cityCodeも処理）
  const handleMapConfirm = useCallback(
    (result: {
      latitude: number;
      longitude: number;
      cityCode: string | null;
    }) => {
      const returnedCityCode = coordinates.handleMapConfirm(result);

      // cityCode解決
      if (returnedCityCode) {
        addressForm.updateAddressField("cityCode", returnedCityCode);
        addressForm.setShowCitySelector?.(false);
      } else {
        // 解決失敗時のみ手動選択UI表示
        addressForm.setShowCitySelector?.(true);
      }
    },
    [coordinates, addressForm]
  );

  // バリデーション
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "場所名を入力してください";
    }

    // stateCode必須チェック
    if (!addressForm.stateCode) {
      newErrors.address = "都道府県を選択してください";
      addressForm.setShowStateSelector(true);
    }

    // cityCode必須チェック
    if (!addressForm.cityCode) {
      newErrors.cityCode = "市区町村を選択してください";
      addressForm.setShowCitySelector?.(true);
    }

    // streetAddress必須チェック
    if (!addressForm.streetAddress.trim()) {
      newErrors.address = "番地・建物名を入力してください";
    }

    // 座標未確定チェック
    if (
      !coordinates.coordinatesConfirmed ||
      coordinates.latitude === null ||
      coordinates.longitude === null
    ) {
      newErrors.coordinates = "地図で位置を確認してください";
    }

    // 座標要再確認チェック
    if (coordinates.coordinatesNeedReview) {
      newErrors.coordinates =
        "住所を変更しました。地図で位置を再確認してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, addressForm, coordinates]);

  // 保存処理
  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // バリデーション
      if (!validateForm()) {
        return;
      }

      setSaving(true);
      try {
        // 住所フィールドを結合
        const combinedAddress = formatFullAddress(
          addressForm.stateName,
          addressForm.cityName,
          addressForm.streetAddress
        );

        // フォーム状態を作成
        const formState: PlaceEditorFormState = {
          name,
          stateCode: addressForm.stateCode,
          stateName: addressForm.stateName,
          cityCode: addressForm.cityCode,
          cityName: addressForm.cityName,
          streetAddress: addressForm.streetAddress,
          address: combinedAddress,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          googlePlaceId: initialData?.googlePlaceId,
          isManual: initialData?.isManual || false,
          mapLocation: initialData?.mapLocation,
        };

        const result = await savePlace(formState);
        return result;
      } finally {
        setSaving(false);
      }
    },
    [
      validateForm,
      name,
      addressForm,
      coordinates,
      initialData,
      savePlace,
    ]
  );

  // formStateの互換性のために統合オブジェクトを返す
  const formState: PlaceEditorFormState = {
    name,
    stateCode: addressForm.stateCode,
    stateName: addressForm.stateName,
    cityCode: addressForm.cityCode,
    cityName: addressForm.cityName,
    streetAddress: addressForm.streetAddress,
    address: formatFullAddress(
      addressForm.stateName,
      addressForm.cityName,
      addressForm.streetAddress
    ),
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    googlePlaceId: initialData?.googlePlaceId,
    isManual: initialData?.isManual || false,
    mapLocation: initialData?.mapLocation,
  };

  return {
    // フォーム状態
    formState,
    updateField,

    // 住所関連（addressFormから）
    postalCode: addressForm.postalCode,
    setPostalCode: addressForm.setPostalCode,
    postalCodeSearching: addressForm.postalCodeSearching,
    handlePostalCodeSearch: addressForm.handlePostalCodeSearch,
    handleStateSelect: addressForm.handleStateSelect,
    handleCitySelect: addressForm.handleCitySelect,
    handleStreetAddressChange: addressForm.handleStreetAddressChange,
    showStateSelector: addressForm.showStateSelector,
    setShowStateSelector: addressForm.setShowStateSelector,
    showCitySelector: addressForm.showCitySelector,

    // 座標関連（coordinatesから）
    coordinatesConfirmed: coordinates.coordinatesConfirmed,
    coordinatesNeedReview: coordinates.coordinatesNeedReview,
    mapSheetOpen: coordinates.mapSheetOpen,
    setMapSheetOpen: coordinates.setMapSheetOpen,
    handleMapClick: coordinates.handleMapClick,
    handleMapConfirm,

    // 保存
    handleSave,
    saving,
    errors,
  };
};
