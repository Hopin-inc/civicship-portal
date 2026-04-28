import { notFound } from "next/navigation";
import {
  fetchAdminReportFeedbacksServer,
  fetchAdminReportServer,
} from "@/app/sysAdmin/_shared/server/fetchAdminReport";
import { convertMarkdownToHtml } from "@/utils/markdownUtils";
import { SysAdminReportDetailPageClient } from "./SysAdminReportDetailPageClient";

type PageProps = {
  params: Promise<{ communityId: string; reportId: string }>;
};

/**
 * sysAdmin Report detail page。
 *
 * SSR + cookie で `report(id)` と `report.feedbacks` を並行取得し、本文
 * markdown を sanitize 済み HTML に変換した上で client wrapper に渡す。
 * markdown 変換は server only (sanitize に xss / unified を使うため) なので
 * RSC 側で済ませる。
 *
 * Report と feedbacks Connection を別 query にしているのは Armor の cost
 * limit 回避のため (`graphql/account/report/server.ts` のコメント参照)。
 *
 * `params.communityId` は URL の確認用。本来 sysAdmin はオーナー権限なので
 * 任意の community にアクセスできるが、URL と Report.community.id が違う
 * 場合は 404 にして混乱を防ぐ。
 */
export default async function SysAdminReportDetailPage({ params }: PageProps) {
  const { communityId, reportId } = await params;
  const [report, feedbacksConnection] = await Promise.all([
    fetchAdminReportServer(reportId),
    fetchAdminReportFeedbacksServer(reportId),
  ]);
  if (!report) notFound();
  if (report.community.id !== communityId) notFound();

  const source = report.finalContent ?? report.outputMarkdown ?? null;
  const bodyHtml = source ? await convertMarkdownToHtml(source) : null;

  const feedbacks =
    feedbacksConnection?.edges
      ?.map((e) => e?.node)
      .filter((n): n is NonNullable<typeof n> => n != null) ?? [];
  const feedbacksTotalCount =
    feedbacksConnection?.totalCount ?? feedbacks.length;

  return (
    <SysAdminReportDetailPageClient
      report={report}
      bodyHtml={bodyHtml}
      feedbacks={feedbacks}
      feedbacksTotalCount={feedbacksTotalCount}
    />
  );
}
