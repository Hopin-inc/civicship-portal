import { Country } from "react-phone-number-input";

/**
 * Default country for phone input
 */
export const DEFAULT_COUNTRY: Country = "JP";

/**
 * Get allowed countries from environment variable
 * Returns undefined if not set (allows all countries)
 * Returns array of country codes if set
 */
export const getAllowedCountries = (): Country[] | undefined => {
  const envCountries = process.env.NEXT_PUBLIC_PHONE_ALLOWED_COUNTRIES;
  if (!envCountries) {
    return undefined; // All countries allowed
  }
  return envCountries.split(",").map((code) => code.trim() as Country);
};

/**
 * Country labels in Japanese
 */
export const COUNTRY_LABELS: Record<string, string> = {
  JP: "日本",
  US: "アメリカ",
  GB: "イギリス",
  CN: "中国",
  KR: "韓国",
  TW: "台湾",
  HK: "香港",
  SG: "シンガポール",
  AU: "オーストラリア",
  CA: "カナダ",
  DE: "ドイツ",
  FR: "フランス",
  IT: "イタリア",
  ES: "スペイン",
  NL: "オランダ",
  BR: "ブラジル",
  MX: "メキシコ",
  IN: "インド",
  TH: "タイ",
  VN: "ベトナム",
  PH: "フィリピン",
  MY: "マレーシア",
  ID: "インドネシア",
};

/**
 * Whether to show country flags (disabled to keep bundle size small)
 */
export const SHOW_FLAGS = false;
