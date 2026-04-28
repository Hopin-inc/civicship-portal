"use client";

import type {
  GqlReportTemplateFieldsFragment,
  GqlReportTemplateStatsBreakdownRowFieldsFragment,
} from "@/types/graphql";
import { JudgeTemplateView } from "./JudgeTemplateView";

type Props = {
  initialBreakdownRows: GqlReportTemplateStatsBreakdownRowFieldsFragment[];
  initialJudgeTemplate: GqlReportTemplateFieldsFragment | null;
};

/**
 * `JudgeTemplateView` (presentational) と SSR initial data を結ぶ container。
 *
 * JUDGE は閲覧専用のため mutation も不要。data は SSR で取得して渡される。
 */
export function JudgeTemplateContainer({
  initialBreakdownRows,
  initialJudgeTemplate,
}: Props) {
  return (
    <JudgeTemplateView
      rows={initialBreakdownRows}
      breakdownLoading={false}
      breakdownError={null}
      template={initialJudgeTemplate}
      templateLoading={false}
      templateError={null}
    />
  );
}
