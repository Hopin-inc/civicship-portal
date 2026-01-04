import { PlaceFormData } from "../../shared/types/place";

export interface PlaceEditorFormState {
  name: string;

  // 住所フィールド（分割）
  stateCode: string;        // 都道府県コード
  stateName: string;        // 都道府県名（表示・保存用）
  cityCode: string;         // 市区町村コード
  cityName: string;         // 市区町村名（表示・保存用）
  streetAddress: string;    // 番地・建物名

  // 保存用の結合住所（バックエンドに送信）
  address: string;

  latitude: number | null;
  longitude: number | null;
  googlePlaceId?: string;
  isManual: boolean;
  mapLocation?: any;
}

export const createInitialFormState = (
  existingPlace?: Partial<PlaceFormData>
): PlaceEditorFormState => {
  return {
    name: existingPlace?.name ?? "",
    stateCode: "",
    stateName: "",
    cityCode: existingPlace?.cityCode ?? "",
    cityName: existingPlace?.cityName ?? "",
    streetAddress: "",
    address: existingPlace?.address ?? "", // 既存の住所を保持（Phase 4で分割）
    latitude: existingPlace?.latitude ?? null,
    longitude: existingPlace?.longitude ?? null,
    googlePlaceId: existingPlace?.googlePlaceId,
    isManual: existingPlace?.isManual ?? false,
    mapLocation: existingPlace?.mapLocation,
  };
};
