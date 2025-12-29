import { PlaceFormData } from "../../shared/types/place";

export interface PlaceEditorFormState {
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  cityCode: string;
  googlePlaceId?: string;
  isManual: boolean;
  mapLocation?: any;
}

export const createInitialFormState = (
  existingPlace?: Partial<PlaceFormData>
): PlaceEditorFormState => {
  return {
    name: existingPlace?.name ?? "",
    address: existingPlace?.address ?? "",
    latitude: existingPlace?.latitude ?? null,
    longitude: existingPlace?.longitude ?? null,
    cityCode: existingPlace?.cityCode ?? "",
    googlePlaceId: existingPlace?.googlePlaceId,
    isManual: existingPlace?.isManual ?? false,
    mapLocation: existingPlace?.mapLocation,
  };
};
