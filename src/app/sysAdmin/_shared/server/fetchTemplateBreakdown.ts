import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { hasServerSession } from "@/lib/auth/server/session";
import { logger } from "@/lib/logging";
import { GET_REPORT_TEMPLATE_STATS_BREAKDOWN_SERVER_QUERY } from "@/graphql/account/reportTemplate/server";
import {
  GqlReportTemplateKind,
  type GqlGetReportTemplateStatsBreakdownQuery,
  type GqlReportTemplateStatsBreakdownRowFieldsFragment,
  type GqlReportVariant,
} from "@/types/graphql";

const HISTORY_PAGE_SIZE = 50;

/**
 * variant + kind の breakdown rows を SSR で取得。
 * client-side fetch だと auth race で IsAdmin failed になるため SSR に統一。
 */
export async function fetchTemplateBreakdownServer(
  variant: GqlReportVariant,
  kind: GqlReportTemplateKind = GqlReportTemplateKind.Generation,
): Promise<GqlReportTemplateStatsBreakdownRowFieldsFragment[]> {
  const hasSession = await hasServerSession();
  if (!hasSession) return [];

  try {
    const data = await executeServerGraphQLQuery<
      GqlGetReportTemplateStatsBreakdownQuery,
      {
        variant: GqlReportVariant;
        kind?: GqlReportTemplateKind | null;
        includeInactive?: boolean | null;
        first?: number | null;
        cursor?: string | null;
        version?: number | null;
      }
    >(GET_REPORT_TEMPLATE_STATS_BREAKDOWN_SERVER_QUERY, {
      variant,
      kind,
      includeInactive: true,
      first: HISTORY_PAGE_SIZE,
    });
    return (
      data.reportTemplateStatsBreakdown.edges
        ?.map((e) => e?.node)
        .filter(
          (n): n is GqlReportTemplateStatsBreakdownRowFieldsFragment => n != null,
        ) ?? []
    );
  } catch (error) {
    logger.warn("[sysAdmin] fetchTemplateBreakdownServer failed", {
      message: (error as Error).message,
      variant,
      kind,
      component: "fetchTemplateBreakdownServer",
    });
    return [];
  }
}
