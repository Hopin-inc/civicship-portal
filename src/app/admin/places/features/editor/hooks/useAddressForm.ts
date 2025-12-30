/**
 * 住所フィールド管理フック
 * 郵便番号検索、都道府県/市区町村選択、番地入力を管理
 */

import { useState, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_CITIES, GET_STATES } from "../queries";
import { autoCompleteAddress } from "../services/postalCodeService";

interface AddressFormState {
  stateCode: string;
  stateName: string;
  cityCode: string;
  cityName: string;
  streetAddress: string;
}

interface UseAddressFormOptions {
  initialState?: Partial<AddressFormState>;
  onAddressChange?: () => void; // 住所変更時のコールバック（座標再確認フラグ用）
}

export const useAddressForm = (options: UseAddressFormOptions = {}) => {
  const { initialState, onAddressChange } = options;

  // 住所フィールドの状態
  const [addressState, setAddressState] = useState<AddressFormState>({
    stateCode: initialState?.stateCode || "",
    stateName: initialState?.stateName || "",
    cityCode: initialState?.cityCode || "",
    cityName: initialState?.cityName || "",
    streetAddress: initialState?.streetAddress || "",
  });

  // 郵便番号
  const [postalCode, setPostalCode] = useState("");
  const [postalCodeSearching, setPostalCodeSearching] = useState(false);

  // UI表示制御
  const [showStateSelector, setShowStateSelector] = useState(false);
  const [showCitySelector, setShowCitySelector] = useState(false);

  // GraphQLクエリ
  const [searchCities] = useLazyQuery(GET_CITIES, {
    fetchPolicy: "cache-first",
  });

  const [searchStates] = useLazyQuery(GET_STATES, {
    fetchPolicy: "cache-first",
  });

  // 住所フィールド更新
  const updateAddressField = useCallback(
    <K extends keyof AddressFormState>(
      field: K,
      value: AddressFormState[K]
    ) => {
      setAddressState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // 都道府県選択ハンドラ
  const handleStateSelect = useCallback(
    (code: string, name: string) => {
      updateAddressField("stateCode", code);
      updateAddressField("stateName", name);
      setShowStateSelector(false);
      // 都道府県が変更されたら市区町村をリセット
      updateAddressField("cityCode", "");
      updateAddressField("cityName", "");
    },
    [updateAddressField]
  );

  // 市区町村選択ハンドラ
  const handleCitySelect = useCallback(
    (code: string, name: string) => {
      updateAddressField("cityCode", code);
      updateAddressField("cityName", name);
      setShowCitySelector(false);
    },
    [updateAddressField]
  );

  // 番地変更ハンドラ
  const handleStreetAddressChange = useCallback(
    (streetAddress: string) => {
      updateAddressField("streetAddress", streetAddress);
      // 住所変更を通知（座標再確認フラグ用）
      onAddressChange?.();
    },
    [updateAddressField, onAddressChange]
  );

  // 郵便番号検索ハンドラ
  const handlePostalCodeSearch = useCallback(async () => {
    if (postalCode.length !== 7) {
      return;
    }

    setPostalCodeSearching(true);

    try {
      console.log("[useAddressForm] Starting postal code search:", postalCode);
      const result = await autoCompleteAddress(
        postalCode,
        searchStates,
        searchCities
      );

      console.log("[useAddressForm] AutoComplete result:", result);

      if (!result) {
        console.log("[useAddressForm] No result");
        alert("郵便番号から住所を取得できませんでした");
        return;
      }

      // 結果を反映
      if (result.stateCode && result.stateName) {
        console.log("[useAddressForm] Applying state:", result.stateCode, result.stateName);
        updateAddressField("stateCode", result.stateCode);
        updateAddressField("stateName", result.stateName);
        setShowStateSelector(false);
      } else {
        console.log("[useAddressForm] No state result");
        setShowStateSelector(true);
      }

      if (result.cityCode && result.cityName) {
        console.log("[useAddressForm] Applying city:", result.cityCode, result.cityName);
        updateAddressField("cityCode", result.cityCode);
        updateAddressField("cityName", result.cityName);
        setShowCitySelector(false);
      } else {
        console.log("[useAddressForm] No city result");
        setShowCitySelector(true);
      }

      console.log("[useAddressForm] Applying street address:", result.streetAddress);
      updateAddressField("streetAddress", result.streetAddress);

      // 住所変更を通知
      onAddressChange?.();
      console.log("[useAddressForm] Address change notified");
    } catch (error) {
      console.error("Postal code search error:", error);
      alert("郵便番号検索中にエラーが発生しました");
    } finally {
      setPostalCodeSearching(false);
    }
  }, [
    postalCode,
    searchStates,
    searchCities,
    updateAddressField,
    onAddressChange,
  ]);

  return {
    // 住所状態
    ...addressState,
    updateAddressField,

    // 郵便番号
    postalCode,
    setPostalCode,
    postalCodeSearching,
    handlePostalCodeSearch,

    // ハンドラ
    handleStateSelect,
    handleCitySelect,
    handleStreetAddressChange,

    // UI制御
    showStateSelector,
    setShowStateSelector,
    showCitySelector,
  };
};
