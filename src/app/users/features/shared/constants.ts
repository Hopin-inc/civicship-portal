import { GqlCurrentPrefecture } from "@/types/graphql";

export const prefectureLabels: Record<GqlCurrentPrefecture, string> = {
  [GqlCurrentPrefecture.Kagawa]: "香川県",
  [GqlCurrentPrefecture.Tokushima]: "徳島県",
  [GqlCurrentPrefecture.Kochi]: "高知県",
  [GqlCurrentPrefecture.Ehime]: "愛媛県",
  [GqlCurrentPrefecture.OutsideShikoku]: "四国以外",
  [GqlCurrentPrefecture.Unknown]: "不明",
};

export const visiblePrefectureLabels = Object.fromEntries(
  Object.entries(prefectureLabels).filter(
    ([key]) => key !== GqlCurrentPrefecture.OutsideShikoku && key !== GqlCurrentPrefecture.Unknown,
  ),
) as Record<GqlCurrentPrefecture, string>;

export const prefectureOptions = [
  GqlCurrentPrefecture.Kagawa,
  GqlCurrentPrefecture.Tokushima,
  GqlCurrentPrefecture.Kochi,
  GqlCurrentPrefecture.Ehime,
];
