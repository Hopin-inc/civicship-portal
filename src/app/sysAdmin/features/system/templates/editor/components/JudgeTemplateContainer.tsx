"use client";

import { GqlReportTemplateKind, type GqlReportVariant } from "@/types/graphql";
import { useTemplateBreakdown } from "@/app/sysAdmin/features/system/templates/editor/hooks/useTemplateBreakdown";
import { useActiveJudgeTemplate } from "@/app/sysAdmin/features/system/templates/editor/hooks/useActiveJudgeTemplate";
import { JudgeTemplateView } from "./JudgeTemplateView";

type Props = {
  variant: GqlReportVariant;
};

/**
 * `JudgeTemplateView` (presentational) と
 * `useTemplateBreakdown` / `useActiveJudgeTemplate` (data) を結ぶ container。
 */
export function JudgeTemplateContainer({ variant }: Props) {
  const breakdown = useTemplateBreakdown(variant, GqlReportTemplateKind.Judge);
  const judge = useActiveJudgeTemplate(variant);

  return (
    <JudgeTemplateView
      rows={breakdown.rows}
      breakdownLoading={breakdown.loading}
      breakdownError={breakdown.error}
      template={judge.template}
      templateLoading={judge.loading}
      templateError={judge.error}
    />
  );
}
