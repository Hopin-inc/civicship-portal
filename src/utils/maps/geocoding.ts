/**
 * 住所から緯度経度を取得するユーティリティ関数
 * #NOTE: strapi に保存された緯度経度は若干位置がずれるため、住所から位置情報を再取得して表示するために利用してている
 */

// メモリ内キャッシュ: 住所 -> 緯度経度のマッピング
const geocodeCache: Record<string, google.maps.LatLngLiteral> = {};

/**
 * 住所から緯度経度を取得する
 * @param address 住所
 * @returns Promise<{lat: number, lng: number} | null> 緯度経度の情報、取得できなかった場合はnull
 */
export const getCoordinatesFromAddress = async (
  address: string,
): Promise<google.maps.LatLngLiteral | null> => {
  if (geocodeCache[address]) {
    return geocodeCache[address];
  }

  // Google Maps APIが読み込まれていない場合はfallbackまたはnullを返す
  if (!window.google || !window.google.maps) {
    console.error("Google Maps API is not loaded");
    return null;
  }

  const geocoder = new google.maps.Geocoder();

  try {
    const result = await new Promise<google.maps.GeocoderResult[] | null>((resolve, reject) => {
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
