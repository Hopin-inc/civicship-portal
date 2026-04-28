"use client";

import type { GqlGetSysAdminDashboardQuery } from "@/types/graphql";
import { SysAdminPageClient } from "./SysAdminPageClient";
import { useReportSummariesByCommunity } from "./features/dashboard/hooks/useReportSummariesByCommunity";

type Props = {
  initialData: GqlGetSysAdminDashboardQuery["sysAdminDashboard"] | null;
};

/**
 * `SysAdminPageClient` (View) と `useReportSummariesByCommunity` (data) を
 * 結ぶ container。runtime page.tsx はこちらを render する。
 *
 * Storybook では SysAdminPageClient を直接 render し、Map prop を省略
 * (or mock) することで Apollo / 認証 hook の依存なく描画できる。
 */
export function SysAdminPageContainer({ initialData }: Props) {
  const { summariesByCommunity } = useReportSummariesByCommunity();
  return (
    <SysAdminPageClient
      initialData={initialData}
      reportSummariesByCommunity={summariesByCommunity}
    />
  );
}
