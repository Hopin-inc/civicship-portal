/**
 * 郵便番号検索サービス
 */

import { toast } from "react-toastify";
import { matchPrefecture, matchCity } from "./addressService";
import { GqlSortDirection } from "@/types/graphql";
import { logger } from "@/lib/logging";

export interface PostalCodeResult {
  address1: string; // 都道府県
  address2: string; // 市区町村
  address3: string; // 町域
  kana1: string; // 都道府県カナ
  kana2: string; // 市区町村カナ
  kana3: string; // 町域カナ
}

interface ZipcloudResponse {
  message: string | null;
  results: PostalCodeResult[] | null;
  status: number;
}

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

interface AutoCompleteResult {
  stateCode?: string;
  stateName?: string;
  cityCode?: string;
  cityName?: string;
  streetAddress: string;
}

/**
 * 郵便番号から住所を取得する
 *
 * @param postalCode 郵便番号（ハイフンなし7桁）
 * @returns 住所情報、エラー時はnull
 */
export async function fetchAddressByPostalCode(
  postalCode: string
): Promise<PostalCodeResult | null> {
  // 郵便番号の形式チェック（7桁の数字）
  if (!/^\d{7}$/.test(postalCode)) {
    return null;
  }

  try {
    const response = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`
    );

    if (!response.ok) {
      return null;
    }

    const data: ZipcloudResponse = await response.json();

    // エラーレスポンスチェック
    if (data.status !== 200 || !data.results || data.results.length === 0) {
      return null;
    }

    // 最初の結果を返す
    return data.results[0];
  } catch (error) {
    console.error("Postal code search error:", error);
    return null;
  }
}

/**
 * 郵便番号から住所を自動補完
 *
 * @param postalCode 郵便番号
 * @param searchStates 都道府県検索関数
 * @param searchCities 市区町村検索関数
 * @returns 自動補完された住所情報
 */
export async function autoCompleteAddress(
  postalCode: string,
  searchStates: (variables: any) => Promise<any>,
  searchCities: (variables: any) => Promise<any>
): Promise<AutoCompleteResult | null> {
  logger.debug("[autoCompleteAddress] Start:", postalCode);

  // 1. zipcloud APIで住所を取得
  const result = await fetchAddressByPostalCode(postalCode);

  if (!result) {
    logger.debug("[autoCompleteAddress] No result from zipcloud");
    return null;
  }

  logger.debug("[autoCompleteAddress] Zipcloud result:", result);

  const autoCompleteResult: AutoCompleteResult = {
    streetAddress: result.address3,
  };

  // 2. 都道府県を検索
  logger.debug("[autoCompleteAddress] Searching states...");
  const statesData = await searchStates({
    variables: { first: 50 },
  });
  logger.debug("[autoCompleteAddress] States data:", statesData);
  logger.debug("[autoCompleteAddress] States data.data:", statesData?.data);
  logger.debug("[autoCompleteAddress] States edges:", statesData?.data?.states?.edges);

  const states: State[] = statesData?.data?.states?.edges
    ?.map((edge: any) => edge?.node)
    .filter(Boolean) || [];

  logger.debug("[autoCompleteAddress] States count:", states.length);

  const matchedState = matchPrefecture(result.address1, states);

  if (matchedState) {
    logger.debug("[autoCompleteAddress] Matched state:", matchedState);
    autoCompleteResult.stateCode = matchedState.code;
    autoCompleteResult.stateName = matchedState.name;
    logger.info(`State auto-selected: ${matchedState.name} (${matchedState.code})`);
    toast.success(`都道府県「${matchedState.name}」を自動選択しました`);
  } else {
    logger.warn(`No state matched for: ${result.address1}`);
    toast.warning("都道府県を自動選択できませんでした。手動で選択してください");
  }

  // 3. 市区町村を検索
  logger.debug("[autoCompleteAddress] Searching cities...");
  const citiesData = await searchCities({
    variables: {
      filter: { name: result.address2 },
      first: 10,
      sort: { code: GqlSortDirection.Asc },
    },
  });
  logger.debug("[autoCompleteAddress] Cities data:", citiesData);

  const cities: City[] = citiesData?.data?.cities?.edges
    ?.map((edge: any) => edge?.node)
    .filter(Boolean) || [];

  logger.debug("[autoCompleteAddress] Cities count:", cities.length);

  const matchResult = matchCity(result.address2, cities, result.address1);

  if (matchResult) {
    logger.debug("[autoCompleteAddress] Matched city:", matchResult);
    autoCompleteResult.cityCode = matchResult.city.code;
    autoCompleteResult.cityName = matchResult.city.name;

    if (matchResult.isPrefectureMatched) {
      logger.info(`City auto-selected: ${matchResult.city.name} (${matchResult.city.code})`);
      toast.success(`市区町村「${matchResult.city.name}」を自動選択しました`);
    } else {
      logger.warn(
        `City selected without prefecture match: ${matchResult.city.name} (${matchResult.city.code})`
      );
      toast.warning(
        `市区町村「${matchResult.city.name}」を選択しました。正しいか確認してください`,
        { autoClose: 5000 }
      );
    }
  } else {
    logger.warn(`No city matched for: ${result.address2}`);
    toast.warning("市区町村を自動選択できませんでした。手動で選択してください");
  }

  logger.debug("[autoCompleteAddress] Final result:", autoCompleteResult);
  return autoCompleteResult;
}
