import "server-only";

import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { hasServerSession } from "@/lib/auth/server/session";
import { logger } from "@/lib/logging";
import {
  GET_REPORT_TEMPLATE_SERVER_QUERY,
  GET_REPORT_TEMPLATES_SERVER_QUERY,
} from "@/graphql/account/reportTemplate/server";
import {
  GqlReportTemplateKind,
  type GqlGetReportTemplateQuery,
  type GqlGetReportTemplatesQuery,
  type GqlReportTemplateFieldsFragment,
  type GqlReportVariant,
} from "@/types/graphql";

/**
 * variant の active な GENERATION template を SSR で取得 (1 件)。
 * editor の初期表示用。backend `reportTemplate` は GENERATION 固定。
 */
export async function fetchActiveGenerationTemplateServer(
  variant: GqlReportVariant,
): Promise<GqlReportTemplateFieldsFragment | null> {
  const hasSession = await hasServerSession();
  if (!hasSession) return null;

  try {
    const data = await executeServerGraphQLQuery<
      GqlGetReportTemplateQuery,
      { variant: GqlReportVariant; communityId?: string | null }
    >(GET_REPORT_TEMPLATE_SERVER_QUERY, { variant });
    return data.reportTemplate ?? null;
  } catch (error) {
    logger.warn("[sysAdmin] fetchActiveGenerationTemplateServer failed", {
      message: (error as Error).message,
      variant,
      component: "fetchActiveGenerationTemplateServer",
    });
    return null;
  }
}

/**
 * variant の active な JUDGE template を SSR で取得 (1 件)。
 * 配列で返るので [0] を取る (= active かつ最新版)。
 */
export async function fetchActiveJudgeTemplateServer(
  variant: GqlReportVariant,
): Promise<GqlReportTemplateFieldsFragment | null> {
  const hasSession = await hasServerSession();
  if (!hasSession) return null;

  try {
    const data = await executeServerGraphQLQuery<
      GqlGetReportTemplatesQuery,
      {
        variant: GqlReportVariant;
        communityId?: string | null;
        kind?: GqlReportTemplateKind | null;
        includeInactive?: boolean | null;
      }
    >(GET_REPORT_TEMPLATES_SERVER_QUERY, {
      variant,
      kind: GqlReportTemplateKind.Judge,
      includeInactive: false,
    });
    return data.reportTemplates[0] ?? null;
  } catch (error) {
    logger.warn("[sysAdmin] fetchActiveJudgeTemplateServer failed", {
      message: (error as Error).message,
      variant,
      component: "fetchActiveJudgeTemplateServer",
    });
    return null;
  }
}
