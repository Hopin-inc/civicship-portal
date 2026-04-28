import { notFound } from "next/navigation";
import {
  fetchAdminReportFeedbacksServer,
  fetchAdminReportServer,
} from "@/app/sysAdmin/_shared/server/fetchAdminReport";
import { SysAdminReportDetailPageClient } from "./SysAdminReportDetailPageClient";

type PageProps = {
  params: Promise<{ communityId: string; reportId: string }>;
};

/**
 * sysAdmin Report detail page。
 *
 * SSR + cookie で `report(id)` と `report.feedbacks` を並行取得して
 * client wrapper に渡す。本文 markdown は client 側で `react-markdown` が
 * パースする。`react-markdown` はデフォルトで生 HTML をレンダリングせず、
 * リンク / 画像 URL について `javascript:` 等の危険プロトコルを除外する
 * ため、別途 sanitize ライブラリは不要。
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

  const body = report.finalContent ?? report.outputMarkdown ?? null;

  return (
    <SysAdminReportDetailPageClient
      report={report}
      body={body}
      initialFeedbacksConnection={feedbacksConnection ?? null}
    />
  );
}
