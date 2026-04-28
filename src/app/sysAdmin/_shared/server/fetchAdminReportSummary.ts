import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { hasServerSession } from "@/lib/auth/server/session";
import { logger } from "@/lib/logging";
import { GET_ADMIN_REPORT_SUMMARY_SERVER_QUERY } from "@/graphql/account/adminReports/server";
import type { GqlGetAdminReportSummaryQuery } from "@/types/graphql";

const PAGE_SIZE = 100;

/**
 * `/sysAdmin` の L1 row に出す「最終 Report 発行サマリ」を SSR で取得。
 *
 * client-side fetch だと Apollo の auth link が firebaseUser / lineTokens を
 * まだ拾えないタイミングで発火し `IsAdmin authorization FAILED` になるため、
 * dashboard と同じく cookie ベースの SSR fetch に寄せる。
 */
export async function fetchAdminReportSummaryServer(): Promise<
  NonNullable<GqlGetAdminReportSummaryQuery["adminReportSummary"]> | null
> {
  const hasSession = await hasServerSession();
  if (!hasSession) return null;

  try {
    const data = await executeServerGraphQLQuery<
      GqlGetAdminReportSummaryQuery,
      { cursor?: string | null; first?: number | null }
    >(GET_ADMIN_REPORT_SUMMARY_SERVER_QUERY, { first: PAGE_SIZE });
    return data.adminReportSummary ?? null;
  } catch (error) {
    logger.warn("[sysAdmin] fetchAdminReportSummaryServer failed", {
      message: (error as Error).message,
      component: "fetchAdminReportSummaryServer",
    });
    return null;
  }
}
