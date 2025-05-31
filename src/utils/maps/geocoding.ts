/**
 * 住所から緯度経度を取得するユーティリティ関数
 * #NOTE: strapi に保存された緯度経度は若干位置がずれるため、住所から位置情報を再取得して表示するために利用してている
 */

// 住所からだと若干住所がズレる拠点ID
export const PRIORITIZE_LAT_LNG_PLACE_IDS = [
  "cmahq8fb5000rs60nhlqmuz0h", // SAKAZUKI BOTANICAL
  "cmahr04i90015s60nt3942swi", // 田村神社
  "cmap18zk20006s60ns5f2cz44", // 大庄屋
  "cmahtero00038s60n9y0iotq7", // 萬翠荘
  "cmahv5tcx004es60nh9pvayyh", // 田渕石材株式会社
  "cmahq8fb5000rs60nhlqmuz0h", // 眞鍋自転車店
];

const HARDCODED_COORDINATES: Record<string, google.maps.LatLngLiteral> = {
  cmap18zk20006s60ns5f2cz44: { lat: 34.178142, lng: 133.818358 }, // 大庄屋
};

// メモリ内キャッシュ: 住所 -> 緯度経度のマッピング
const geocodeCache: Record<string, google.maps.LatLngLiteral> = {};

/**
 * 住所から緯度経度を取得する
 * @param address 住所
 * @param placeId
 * @returns Promise<{lat: number, lng: number} | null> 緯度経度の情報、取得できなかった場合はnull
 */
export const getCoordinatesFromAddress = async (
  address: string,
  placeId?: string, // 追加：placeIdが分かる場合に使用
): Promise<google.maps.LatLngLiteral | null> => {
  if (placeId && HARDCODED_COORDINATES[placeId]) {
    return HARDCODED_COORDINATES[placeId];
  }

  if (geocodeCache[address]) {
    return geocodeCache[address];
  }

  if (!window.google || !window.google.maps) {
    console.error("Google Maps API is not loaded");
    return null;
  }

  const geocoder = new google.maps.Geocoder();

  try {
    const result = await new Promise<google.maps.GeocoderResult[] | null>((resolve) => {
      geocoder.geocode({ address, language: "ja" }, (results, status) => {
        if (status === "OK" && results && results.length > 0) {
          resolve(results);
        } else {
          console.warn(`Geocoding failed for address: ${address}`, status);
          resolve(null);
        }
      });
    });

    if (!result) return null;

    const location = result[0].geometry.location;
    const coordinates = {
      lat: location.lat(),
      lng: location.lng(),
    };

    geocodeCache[address] = coordinates;

    return coordinates;
  } catch (error) {
    console.error("Error geocoding address:", error);
    return null;
  }
};

export const clearGeocodeCache = (): void => {
  Object.keys(geocodeCache).forEach((key) => {
    delete geocodeCache[key];
  });
};

/**
 * Google Maps APIがロードされているかどうかを確認する
 * @returns boolean Google Maps APIがロードされているかどうか
 */
export const isGoogleMapsLoaded = (): boolean => {
  return !!(window.google && window.google.maps);
};
