"use client";

import { useAuth } from "@/contexts/AuthProvider";
import {
  GqlReportTemplateKind,
  useGetReportTemplatesQuery,
  type GqlReportTemplateFieldsFragment,
  type GqlReportVariant,
} from "@/types/graphql";

/**
 * 指定 variant の active な JUDGE template を 1 件取得 (read-only 表示用)。
 *
 * `useTemplateEditor` (GENERATION 用) と異なり JUDGE は admin UI から編集
 * できない (backend `updateReportTemplate` は GENERATION 固定) ので mutation は無し。
 *
 * `reportTemplates` (複数返却) を `includeInactive: false` で叩いて、
 * 配列の先頭 (= active かつ最新版の 1 件) を返す。同 version 内に A/B
 * 候補が並列で active な場合は backend が返す順 (version desc, createdAt desc)
 * の最初を取る。
 */
export function useActiveJudgeTemplate(variant: GqlReportVariant | null) {
  const { user, loading: authLoading } = useAuth();

  const { data, loading, error } = useGetReportTemplatesQuery({
    variables: {
      // skip により null variant 時は呼ばれないので non-null assertion で安全。
      variant: variant!,
      kind: GqlReportTemplateKind.Judge,
      includeInactive: false,
    },
    skip: !variant || authLoading || !user,
    fetchPolicy: "cache-and-network",
  });

  const template: GqlReportTemplateFieldsFragment | null =
    data?.reportTemplates[0] ?? null;

  return { template, loading, error };
}
