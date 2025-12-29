import { PlaceFormData } from "../../shared/types/place";

export interface PlaceEditorFormState {
  name: string;

  // 住所フィールド（分割）
  stateCode: string;        // 都道府県コード
  cityCode: string;         // 市区町村コード
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
  // 既存データがある場合、addressを分割する必要がある
  // ただし、stateCode/cityCodeがあればそれを優先
  let stateCode = "";
  let streetAddress = "";

  // 既存のaddressがある場合、後で分割処理を行う
  // （Phase 4で実装）

  return {
    name: existingPlace?.name ?? "",
    stateCode: stateCode,
    cityCode: existingPlace?.cityCode ?? "",
    streetAddress: streetAddress,
    address: existingPlace?.address ?? "", // 既存の住所を保持
    latitude: existingPlace?.latitude ?? null,
    longitude: existingPlace?.longitude ?? null,
    googlePlaceId: existingPlace?.googlePlaceId,
    isManual: existingPlace?.isManual ?? false,
    mapLocation: existingPlace?.mapLocation,
  };
};
