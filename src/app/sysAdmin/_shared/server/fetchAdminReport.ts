import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { hasServerSession } from "@/lib/auth/server/session";
import { logger } from "@/lib/logging";
import {
  GET_ADMIN_REPORT_FEEDBACKS_SERVER_QUERY,
  GET_ADMIN_REPORT_SERVER_QUERY,
} from "@/graphql/account/report/server";
import type {
  GqlGetAdminReportFeedbacksQuery,
  GqlGetAdminReportFeedbacksQueryVariables,
  GqlGetAdminReportQuery,
  GqlGetAdminReportQueryVariables,
} from "@/types/graphql";

const FEEDBACKS_PAGE_SIZE = 20;

/**
 * Report detail page で表示する Report 単票を SSR で取得。
 * sysAdmin は全 community のオーナーなので、community 制約なしで叩ける。
 */
export async function fetchAdminReportServer(
  id: string,
): Promise<NonNullable<GqlGetAdminReportQuery["report"]> | null> {
  const hasSession = await hasServerSession();
  if (!hasSession) return null;

  try {
    const data = await executeServerGraphQLQuery<
      GqlGetAdminReportQuery,
      GqlGetAdminReportQueryVariables
    >(GET_ADMIN_REPORT_SERVER_QUERY, { id });
    return data.report ?? null;
  } catch (error) {
    logger.warn("[sysAdmin] fetchAdminReportServer failed", {
      message: (error as Error).message,
      id,
      component: "fetchAdminReportServer",
    });
    return null;
  }
}

/**
 * Report detail page の feedback 一覧 (1 ページ目) を SSR で取得。
 * Report 本体とは別 query に分けてあるのは Armor の cost 制限を避けるため
 * (`graphql/account/report/server.ts` のコメント参照)。
 */
export async function fetchAdminReportFeedbacksServer(
  reportId: string,
): Promise<
  | NonNullable<
      NonNullable<GqlGetAdminReportFeedbacksQuery["report"]>["feedbacks"]
    >
  | null
> {
  const hasSession = await hasServerSession();
  if (!hasSession) return null;

  try {
    const data = await executeServerGraphQLQuery<
      GqlGetAdminReportFeedbacksQuery,
      GqlGetAdminReportFeedbacksQueryVariables
    >(GET_ADMIN_REPORT_FEEDBACKS_SERVER_QUERY, {
      id: reportId,
      first: FEEDBACKS_PAGE_SIZE,
    });
    return data.report?.feedbacks ?? null;
  } catch (error) {
    logger.warn("[sysAdmin] fetchAdminReportFeedbacksServer failed", {
      message: (error as Error).message,
      reportId,
      component: "fetchAdminReportFeedbacksServer",
    });
    return null;
  }
}
