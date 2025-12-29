interface GeocodeResult {
  address_components: google.maps.GeocoderAddressComponent[];
}

interface City {
  code: string;
  name: string;
  state?: {
    code: string;
    name: string;
  } | null;
}

/**
 * geocode結果からcityCodeを自動解決する
 *
 * @param geocodeResult Google Maps APIのgeocode結果
 * @param cities Cityマスタデータ
 * @returns 解決されたcityCode、解決できない場合はnull
 */
export function resolveCityCode(
  geocodeResult: GeocodeResult,
  cities: City[]
): string | null {
  // 1. geocode結果から市区町村候補を抽出（優先順位順）
  const cityComponents = geocodeResult.address_components
    .map((component) => ({
      name: component.long_name,
      priority: getCityComponentPriority(component.types),
    }))
    .filter((c) => c.priority > 0)
    .sort((a, b) => b.priority - a.priority); // 優先度の高い順

  if (cityComponents.length === 0) {
    return null;
  }

  // 2. 都道府県名を抽出（整合性チェック用）
  const prefComponent = geocodeResult.address_components.find((c) =>
    c.types.includes("administrative_area_level_1")
  );
  const prefName = prefComponent?.long_name;

  // 3. Cityマスタとの照合
  for (const cityComponent of cityComponents) {
    const cityName = cityComponent.name;

    // 3-1. 完全一致チェック
    const exactMatch = cities.find((city) => city.name === cityName);
    if (exactMatch) {
      // 都道府県も一致しているか確認
      if (!prefName || !exactMatch.state || exactMatch.state.name === prefName) {
        return exactMatch.code;
      }
    }

    // 3-2. 都道府県が一致する範囲内での部分一致
    if (prefName) {
      const prefMatchedCities = cities.filter(
        (city) => city.state && city.state.name === prefName
      );

      // 部分一致チェック（例: "岡山市北区" → "岡山市"）
      const partialMatch = prefMatchedCities.find(
        (city) => cityName.includes(city.name) || city.name.includes(cityName)
      );

      if (partialMatch) {
        return partialMatch.code;
      }
    }
  }

  // 4. 解決失敗
  return null;
}

/**
 * address_componentのtypesから市区町村としての優先度を返す
 *
 * @param types address_componentのtypes配列
 * @returns 優先度（0=市区町村ではない、1-3=優先度）
 */
function getCityComponentPriority(types: string[]): number {
  // locality（市区町村）が最優先
  if (types.includes("locality")) {
    return 3;
  }

  // administrative_area_level_2（郡・市区町村レベル）
  if (types.includes("administrative_area_level_2")) {
    return 2;
  }

  // administrative_area_level_3（区レベル）
  if (types.includes("administrative_area_level_3")) {
    return 1;
  }

  // 該当なし
  return 0;
}
