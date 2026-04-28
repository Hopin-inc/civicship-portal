import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { hasServerSession } from "@/lib/auth/server/session";
import { logger } from "@/lib/logging";
import { GET_ADMIN_REPORT_SUMMARY_SERVER_QUERY } from "@/graphql/account/adminReports/server";
import type {
  GqlAdminReportSummaryRowFieldsFragment,
  GqlGetAdminReportSummaryQuery,
} from "@/types/graphql";

const PAGE_SIZE = 100;

/**
 * L1 ダッシュボード用に Report Summary を SSR で取得。
 * コミュニティ数の想定上限を超えるまでは 1 ページ (100 件) で十分。
 *
 * 失敗時は null を返し、L1 dashboard の本体 (community 一覧) は壊れずに
 * 描画されるよう fail-soft にしている。
 */
export async function fetchAdminReportSummaryServer(): Promise<
  GqlAdminReportSummaryRowFieldsFragment[] | null
> {
  const hasSession = await hasServerSession();
  if (!hasSession) return null;

  try {
    const data = await executeServerGraphQLQuery<
      GqlGetAdminReportSummaryQuery,
      { cursor?: string | null; first?: number | null }
    >(GET_ADMIN_REPORT_SUMMARY_SERVER_QUERY, { first: PAGE_SIZE });

    return (
      data.adminReportSummary?.edges
        ?.map((e) => e?.node)
        .filter(
          (n): n is GqlAdminReportSummaryRowFieldsFragment => n != null,
        ) ?? []
    );
  } catch (error) {
    logger.warn("[sysAdmin] fetchAdminReportSummaryServer failed", {
      message: (error as Error).message,
      component: "fetchAdminReportSummaryServer",
    });
    return null;
  }
}
