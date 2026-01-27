import { GqlPlace } from "@/types/graphql";
import { PlaceFormData } from "../../shared/types/place";

export function presentPlaceForEdit(place: GqlPlace): PlaceFormData {
  return {
    name: place.name,
    address: place.address,
    latitude: Number(place.latitude),
    longitude: Number(place.longitude),
    cityCode: place.city?.code || "",
    googlePlaceId: place.googlePlaceId || undefined,
    isManual: place.isManual || false,
    mapLocation: place.mapLocation,
  };
}
