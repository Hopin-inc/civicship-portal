import { useState, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";
import { PlaceEditorFormState, createInitialFormState } from "../types/form";
import { usePlaceSave } from "./usePlaceSave";
import { PlaceFormData } from "../../shared/types/place";
import { fetchAddressByPostalCode, formatFullAddress } from "../utils/postalCode";
import { GET_CITIES } from "../queries";
import { GqlSortDirection } from "@/types/graphql";
import { toast } from "react-toastify";

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
  const [formState, setFormState] = useState<PlaceEditorFormState>(
    createInitialFormState(initialData)
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // 郵便番号
  const [postalCode, setPostalCode] = useState("");
  const [postalCodeSearching, setPostalCodeSearching] = useState(false);

  // 座標確定状態
  const [coordinatesConfirmed, setCoordinatesConfirmed] = useState(
    !!(initialData?.latitude && initialData?.longitude)
  );
  const [coordinatesNeedReview, setCoordinatesNeedReview] = useState(false);

  // UI表示制御
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [mapSheetOpen, setMapSheetOpen] = useState(false);

  const { handleSave: savePlace } = usePlaceSave({ placeId, onSuccess });

  // City検索用のlazy query（郵便番号検索時に使用）
  const [searchCities] = useLazyQuery(GET_CITIES, {
    fetchPolicy: "cache-first",
  });

  // フィールド更新
  const updateField = useCallback(
    <K extends keyof PlaceEditorFormState>(field: K, value: PlaceEditorFormState[K]) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // 住所変更ハンドラ（自動geocodeなし）
  const handleAddressChange = useCallback(
    (address: string) => {
      updateField("address", address);

      // 座標が既に確定している場合のみ「要再確認」フラグを立てる
      if (coordinatesConfirmed) {
        setCoordinatesNeedReview(true);
      }

      // 座標自体は保持する（nullにしない）
    },
    [updateField, coordinatesConfirmed]
  );

  // 地図確認ハンドラ
  const handleMapClick = useCallback(() => {
    setMapSheetOpen(true);
  }, []);

  // 地図確定ハンドラ
  const handleMapConfirm = useCallback(
    (result: {
      latitude: number;
      longitude: number;
      cityCode: string | null;
    }) => {
      // 1. 座標を保存
      updateField("latitude", result.latitude);
      updateField("longitude", result.longitude);
      setCoordinatesConfirmed(true);
      setCoordinatesNeedReview(false);

      // 2. cityCode解決
      if (result.cityCode) {
        updateField("cityCode", result.cityCode);
        setShowCitySelector(false);
      } else {
        // 解決失敗時のみ手動選択UI表示
        setShowCitySelector(true);
      }

      setMapSheetOpen(false);
    },
    [updateField]
  );

  // 市区町村選択ハンドラ
  const handleCitySelect = useCallback(
    (code: string) => {
      updateField("cityCode", code);
      setShowCitySelector(false);
    },
    [updateField]
  );

  // 郵便番号検索ハンドラ（明示的なボタンクリック）
  const handlePostalCodeSearch = useCallback(async () => {
    if (postalCode.length !== 7) {
      return;
    }

    setPostalCodeSearching(true);

    try {
      // 1. zipcloud APIで住所を取得
      const result = await fetchAddressByPostalCode(postalCode);

      if (!result) {
        alert("郵便番号から住所を取得できませんでした");
        setPostalCodeSearching(false);
        return;
      }

      // 2. 住所を自動入力
      const fullAddress = formatFullAddress(result);
      updateField("address", fullAddress);

      // 3. 市区町村を検索（都道府県も考慮）
      const { data } = await searchCities({
        variables: {
          filter: { name: result.address2 }, // 市区町村名で検索
          first: 10,
          sort: { code: GqlSortDirection.Asc }, // ソート追加
        },
      });

      // 4. city解決（都道府県が一致するものを優先）
      const cities = data?.cities?.edges || [];
      let matchedCity = null;
      let isPrefectureMatched = false;

      // 都道府県が一致するcityを探す
      for (const edge of cities) {
        const city = edge?.node;
        if (city && city.state && city.state.name === result.address1) {
          matchedCity = city;
          isPrefectureMatched = true;
          break;
        }
      }

      // 都道府県一致がなければ、最初のcityを使用（案B）
      if (!matchedCity && cities.length > 0) {
        matchedCity = cities[0]?.node;
        isPrefectureMatched = false;
      }

      if (matchedCity) {
        updateField("cityCode", matchedCity.code);
        setShowCitySelector(false);

        if (isPrefectureMatched) {
          // 都道府県が一致した場合：成功メッセージ
          toast.success(`市区町村「${matchedCity.name}」を自動選択しました`);
        } else {
          // 都道府県不一致の場合：警告メッセージ
          toast.warning(
            `市区町村「${matchedCity.name}」を選択しました。正しいか確認してください`,
            { autoClose: 5000 }
          );
        }
      } else {
        // 候補が全くない場合：手動選択を促す
        setShowCitySelector(true);
        toast.warning("市区町村を自動選択できませんでした。手動で選択してください");
      }
    } catch (error) {
      console.error("Postal code search error:", error);
      alert("郵便番号検索中にエラーが発生しました");
    } finally {
      setPostalCodeSearching(false);
    }
  }, [postalCode, updateField, searchCities]);

  // バリデーション
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formState.name.trim()) {
      newErrors.name = "場所名を入力してください";
    }

    if (!formState.address.trim()) {
      newErrors.address = "住所を入力してください";
    }

    // 座標未確定チェック
    if (!coordinatesConfirmed || formState.latitude === null || formState.longitude === null) {
      newErrors.coordinates = "地図で位置を確認してください";
    }

    // 座標要再確認チェック
    if (coordinatesNeedReview) {
      newErrors.coordinates = "住所を変更しました。地図で位置を再確認してください";
    }

    // cityCode必須チェック
    if (!formState.cityCode) {
      newErrors.cityCode = "市区町村を選択してください";
      setShowCitySelector(true);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState, coordinatesConfirmed, coordinatesNeedReview]);

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
        const result = await savePlace(formState);
        return result;
      } finally {
        setSaving(false);
      }
    },
    [formState, savePlace, validateForm]
  );

  return {
    formState,
    updateField,
    handleAddressChange,
    handleMapClick,
    handleMapConfirm,
    handleCitySelect,
    handleSave,
    saving,
    errors,
    coordinatesConfirmed,
    coordinatesNeedReview,
    showCitySelector,
    mapSheetOpen,
    setMapSheetOpen,
    postalCode,
    setPostalCode,
    postalCodeSearching,
    handlePostalCodeSearch,
  };
};
