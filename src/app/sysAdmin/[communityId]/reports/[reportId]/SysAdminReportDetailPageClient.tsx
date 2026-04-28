"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import type {
  GqlGetAdminReportQuery,
  GqlReportFeedbackFieldsFragment,
} from "@/types/graphql";
import { variantLabel } from "@/app/sysAdmin/features/system/templates/shared/labels";
import { ReportDetailContainer } from "@/app/sysAdmin/features/reportDetail/components/ReportDetailContainer";

type Report = NonNullable<GqlGetAdminReportQuery["report"]>;

type Props = {
  report: Report;
  body: string | null;
  feedbacks: GqlReportFeedbackFieldsFragment[];
  feedbacksTotalCount: number;
};

/**
 * Report detail page の client wrapper。
 * header config を当てて Container にデータを橋渡しするだけ。
 */
export function SysAdminReportDetailPageClient({
  report,
  body,
  feedbacks,
  feedbacksTotalCount,
}: Props) {
  const headerConfig = useMemo(
    () => ({
      title: `${report.community.name ?? report.community.id} / ${variantLabel(report.variant)}`,
      showBackButton: true,
      showLogo: false,
    }),
    [report.community.name, report.community.id, report.variant],
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="max-w-xl mx-auto mt-8 px-4">
      <ReportDetailContainer
        report={report}
        body={body}
        feedbacks={feedbacks}
        feedbacksTotalCount={feedbacksTotalCount}
      />
    </div>
  );
}
