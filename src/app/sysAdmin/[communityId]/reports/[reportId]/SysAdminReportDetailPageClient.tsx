"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import type {
  GqlGetAdminReportFeedbacksQuery,
  GqlGetAdminReportQuery,
} from "@/types/graphql";
import { variantLabel } from "@/app/sysAdmin/features/system/templates/shared/labels";
import { ReportDetailContainer } from "@/app/sysAdmin/features/reportDetail/components/ReportDetailContainer";

type Report = NonNullable<GqlGetAdminReportQuery["report"]>;
type FeedbacksConnection = NonNullable<
  NonNullable<GqlGetAdminReportFeedbacksQuery["report"]>["feedbacks"]
>;

type Props = {
  report: Report;
  body: string | null;
  initialFeedbacksConnection: FeedbacksConnection | null;
};

/**
 * Report detail page の client wrapper。
 * header config を当てて Container にデータを橋渡しするだけ。
 */
export function SysAdminReportDetailPageClient({
  report,
  body,
  initialFeedbacksConnection,
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
        initialFeedbacksConnection={initialFeedbacksConnection}
      />
    </div>
  );
}
