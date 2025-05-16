import { GqlCurrentPrefecture } from "@/types/graphql";

export type IPrefecture = { id: string; name: string };

export const IPrefectureCodeMap: Partial<Record<GqlCurrentPrefecture, string>> = {
  [GqlCurrentPrefecture.Kagawa]: "370002",
  [GqlCurrentPrefecture.Tokushima]: "360007",
  [GqlCurrentPrefecture.Kochi]: "390003",
  [GqlCurrentPrefecture.Ehime]: "380008",
};
