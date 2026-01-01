/**
 * 住所関連のビジネスロジック
 */

interface State {
  code: string;
  name: string;
}

interface City {
  code: string;
  name: string;
  state?: {
    code: string;
    name: string;
  };
}

/**
 * 完全な住所から都道府県名と市区町村名を除去して番地を抽出
 */
export const parseStreetAddress = (
  fullAddress: string,
  stateName: string,
  cityName: string
): string => {
  let streetAddress = fullAddress;

  // 都道府県名を除去
  if (stateName && streetAddress.startsWith(stateName)) {
    streetAddress = streetAddress.substring(stateName.length);
  }

  // 市区町村名を除去
  if (cityName && streetAddress.startsWith(cityName)) {
    streetAddress = streetAddress.substring(cityName.length);
  }

  return streetAddress;
};

/**
 * 都道府県名、市区町村名、番地から完全な住所を生成
 */
export const formatFullAddress = (
  stateName: string,
  cityName: string,
  streetAddress: string
): string => {
  return `${stateName}${cityName}${streetAddress}`;
};

/**
 * 都道府県名から都道府県コードを検索
 */
export const matchPrefecture = (
  prefectureName: string,
  states: State[]
): State | null => {
  return states.find((state) => state.name === prefectureName) || null;
};

/**
 * 市区町村名から市区町村を検索
 * 都道府県名が指定されている場合は、都道府県が一致するものを優先
 */
export const matchCity = (
  cityName: string,
  cities: City[],
  prefectureName?: string
): { city: City; isPrefectureMatched: boolean } | null => {
  if (cities.length === 0) {
    return null;
  }

  // 都道府県が一致するcityを探す
  if (prefectureName) {
    const matchedCity = cities.find(
      (city) => city.state && city.state.name === prefectureName
    );

    if (matchedCity) {
      return { city: matchedCity, isPrefectureMatched: true };
    }
  }

  // 都道府県一致がなければ、最初のcityを使用（案B）
  return { city: cities[0], isPrefectureMatched: false };
};
