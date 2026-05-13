import { notFound } from "next/navigation";
import {
  fetchAdminReportFeedbacksServer,
  fetchAdminReportServer,
} from "@/app/sysAdmin/_shared/server/fetchAdminReport";
import { SysAdminReportDetailPageClient } from "@/app/sysAdmin/[communityId]/reports/[reportId]/SysAdminReportDetailPageClient";

type PageProps = {
  params: Promise<{ communityId: string; reportId: string }>;
};

export default async function AdminAnalyticsReportDetailPage({ params }: PageProps) {
  const { communityId, reportId } = await params;
  const [report, feedbacksConnection] = await Promise.all([
    fetchAdminReportServer(reportId),
    fetchAdminReportFeedbacksServer(reportId),
  ]);
  if (!report) notFound();
  if (report.community.id !== communityId) notFound();

  const body = report.finalContent ?? report.outputMarkdown ?? null;

  const feedbacks =
    feedbacksConnection?.edges
      ?.map((e) => e?.node)
      .filter((n): n is NonNullable<typeof n> => n != null) ?? [];
  const feedbacksTotalCount =
    feedbacksConnection?.totalCount ?? feedbacks.length;

  return (
    <SysAdminReportDetailPageClient
      report={report}
      body={body}
      feedbacks={feedbacks}
      feedbacksTotalCount={feedbacksTotalCount}
    />
  );
}
