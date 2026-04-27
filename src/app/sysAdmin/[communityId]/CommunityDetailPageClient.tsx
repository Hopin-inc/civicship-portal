"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import type {
  GqlGetSysAdminCommunityDetailQuery,
  GqlSysAdminTenureDistribution,
} from "@/types/graphql";
import { useDashboardControls } from "@/app/sysAdmin/features/dashboard/hooks/useDashboardControls";
import { useCommunityDetail } from "@/app/sysAdmin/features/communityDetail/hooks/useCommunityDetail";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import {
  L2_GLOSSARY_SECTIONS,
  MetricGlossaryButton,
} from "@/app/sysAdmin/_shared/components/MetricGlossary";
import { CommunityDashboardOverview } from "@/app/sysAdmin/features/communityDetail/components/CommunityDashboardOverview";

type Props = {
  communityId: string;
  initialData: GqlGetSysAdminCommunityDetailQuery["sysAdminCommunityDetail"] | null;
  /** L1 dashboard 経由で取得した、この community の tenure 分布。L2 schema
   * が tenureDistribution を露出するまでの SSR 横断の橋渡し。 */
  tenureDistribution?: GqlSysAdminTenureDistribution | null;
  /** L1 dashboard 経由で取得した、この community の hub メンバー数。L2
   * schema には未掲載のため、tenureDistribution と同じく page.tsx で
   * L1 と並列 fetch して受け渡す。 */
  hubMemberCount?: number | null;
};

export function CommunityDetailPageClient({
  communityId,
  initialData,
  tenureDistribution,
  hubMemberCount,
}: Props) {
  const dashboard = useDashboardControls();
  const { loading, error, detail: data } = useCommunityDetail({
    communityId,
    dashboardControls: dashboard.state,
    initialData,
  });

  const headerConfig = useMemo(
    () => ({
      title: data?.communityName ?? sysAdminDashboardJa.detail.title,
      showLogo: false,
      showBackButton: true,
      // L2 専用の用語集 (ファネル / 各種指標の定義) を Header action slot
      // から開けるようにする。L1 と同じ「用語」ボタンだが sections だけが
      // L2 仕様になっている (= L2_GLOSSARY_SECTIONS で全カードを網羅)。
      action: <MetricGlossaryButton sections={L2_GLOSSARY_SECTIONS} />,
    }),
    [data?.communityName],
  );
  useHeaderConfig(headerConfig);

  if (loading && !data) return <LoadingIndicator />;
  if (error) return <ErrorState title={sysAdminDashboardJa.state.error} />;
  if (!data) return null;

  // L2 detail schema doesn't expose L1's windowActivity, so we approximate
  // newMemberCount from the latest monthly trend point. hubMemberCount stays
  // unprovided (renders as 未計測) until backend exposes it on
  // SysAdminCommunityDetailPayload.
  const latestMonth =
    data.monthlyActivityTrend[data.monthlyActivityTrend.length - 1];
  const newMemberCount = latestMonth?.newMembers;

  return (
    <CommunityDashboardOverview
      data={data}
      communityName={data.communityName}
      newMemberCount={newMemberCount}
      tenureDistribution={tenureDistribution ?? undefined}
      hubMemberCount={hubMemberCount ?? undefined}
    />
  );
}
