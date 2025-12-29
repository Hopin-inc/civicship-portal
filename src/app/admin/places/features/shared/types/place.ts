/**
 * Place型定義
 */

export interface PlaceData {
  id?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  cityCode: string;
  cityName?: string;
  googlePlaceId?: string;
  isManual: boolean;
  mapLocation?: any;
  image?: string;
  opportunityCount?: number;
}

export interface PlaceFormData {
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  cityCode: string;
  googlePlaceId?: string;
  isManual: boolean;
  mapLocation?: any;
}
