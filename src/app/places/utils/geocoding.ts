/**
 * 住所から緯度経度を取得するユーティリティ関数
 * #NOTE: DBに保存された緯度経度を優先的に使用し、ない場合のみ住所から位置情報を取得して表示する
 */

const HARDCODED_COORDINATES: Record<string, google.maps.LatLngLiteral> = {
  cmahstwr4002rs60n6map2wiu: { lat: 34.178142, lng: 133.818358 }, // 大庄屋
};

/**
 * DBの緯度経度を優先的に使用するPlace IDのリスト
 * これらのIDはジオコーディングをスキップしてDBの値を使用する
 */
export const PRIORITIZE_LAT_LNG_PLACE_IDS: string[] = Object.keys(HARDCODED_COORDINATES);

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
