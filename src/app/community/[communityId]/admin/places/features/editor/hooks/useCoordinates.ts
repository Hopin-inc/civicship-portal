/**
 * 座標管理フック
 * 緯度経度、座標確定状態、地図確認を管理
 */

import { useState, useCallback } from "react";

interface CoordinatesState {
  latitude: number | null;
  longitude: number | null;
}

interface UseCoordinatesOptions {
  initialCoordinates?: CoordinatesState;
}

export const useCoordinates = (options: UseCoordinatesOptions = {}) => {
  const { initialCoordinates } = options;

  // 座標状態
  const [coordinates, setCoordinates] = useState<CoordinatesState>({
    latitude: initialCoordinates?.latitude ?? null,
    longitude: initialCoordinates?.longitude ?? null,
  });

  // 座標確定状態
  const [coordinatesConfirmed, setCoordinatesConfirmed] = useState(
    !!(initialCoordinates?.latitude && initialCoordinates?.longitude)
  );

  // 要再確認フラグ（住所変更後）
  const [coordinatesNeedReview, setCoordinatesNeedReview] = useState(false);

  // 地図シート表示制御
  const [mapSheetOpen, setMapSheetOpen] = useState(false);

  // 座標更新
  const updateCoordinates = useCallback(
    (latitude: number, longitude: number) => {
      setCoordinates({ latitude, longitude });
    },
    []
  );

  // 地図確認ボタンハンドラ
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
      updateCoordinates(result.latitude, result.longitude);
      setCoordinatesConfirmed(true);
      setCoordinatesNeedReview(false);

      setMapSheetOpen(false);

      // cityCodeは別途addressFormで管理されるため、ここでは返すのみ
      return result.cityCode;
    },
    [updateCoordinates]
  );

  // 住所変更時に呼ばれる（座標要再確認フラグを立てる）
  const markCoordinatesForReview = useCallback(() => {
    if (coordinatesConfirmed) {
      setCoordinatesNeedReview(true);
    }
  }, [coordinatesConfirmed]);

  return {
    // 座標状態
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    updateCoordinates,

    // 確定状態
    coordinatesConfirmed,
    setCoordinatesConfirmed,
    coordinatesNeedReview,
    setCoordinatesNeedReview,
    markCoordinatesForReview,

    // 地図シート
    mapSheetOpen,
    setMapSheetOpen,
    handleMapClick,
    handleMapConfirm,
  };
};
