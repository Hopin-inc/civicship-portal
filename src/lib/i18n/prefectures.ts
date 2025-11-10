import { GqlCurrentPrefecture } from "@/types/graphql";

/**
 * Get the translation key for a prefecture enum value
 */
export function getPrefectureKey(prefecture: GqlCurrentPrefecture | string | undefined): string {
  if (!prefecture) return "";
  
  switch (prefecture) {
    case GqlCurrentPrefecture.Kagawa:
      return "common.prefectures.kagawa";
    case GqlCurrentPrefecture.Tokushima:
      return "common.prefectures.tokushima";
    case GqlCurrentPrefecture.Ehime:
      return "common.prefectures.ehime";
    case GqlCurrentPrefecture.Kochi:
      return "common.prefectures.kochi";
    case GqlCurrentPrefecture.OutsideShikoku:
      return "common.prefectures.outsideShikoku";
    case GqlCurrentPrefecture.Unknown:
      return "common.prefectures.unknown";
    default:
      return "";
  }
}

/**
 * Get the Japanese prefecture name from enum value (fallback for non-translated contexts)
 */
export function getPrefectureName(prefecture: GqlCurrentPrefecture | string | undefined): string {
  if (!prefecture) return "";
  
  switch (prefecture) {
    case GqlCurrentPrefecture.Kagawa:
      return "香川県";
    case GqlCurrentPrefecture.Tokushima:
      return "徳島県";
    case GqlCurrentPrefecture.Ehime:
      return "愛媛県";
    case GqlCurrentPrefecture.Kochi:
      return "高知県";
    case GqlCurrentPrefecture.OutsideShikoku:
      return "四国以外";
    case GqlCurrentPrefecture.Unknown:
      return "不明";
    default:
      return "";
  }
}
