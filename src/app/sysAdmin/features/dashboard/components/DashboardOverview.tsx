"use client";

import { useCallback } from "react";
import { useAppRouter } from "@/lib/navigation";
import { DashboardSection } from "@/app/sysAdmin/_shared/components/DashboardSection";
import { Empty } from "@/components/ui/empty";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import { useDashboardControls } from "../hooks/useDashboardControls";
import { useDashboardOverview } from "../hooks/useDashboardOverview";
import { CommunityCardGrid } from "./CommunityCardGrid";
import { DashboardControls } from "./DashboardControls";
import { PlatformSummaryCards } from "./PlatformSummaryCards";

export function DashboardOverview() {
  const router = useAppRouter();
  const { state, setAsOf, setThresholds, reset } = useDashboardControls();
  const { loading, error, platform, communities } = useDashboardOverview(state);

  const handleRowClick = useCallback(
    (communityId: string) => {
      router.push(`/sysAdmin/dashboard/${communityId}`);
    },
    [router],
  );

  const isInitialLoading = loading && !platform;

  return (
    <div className="flex flex-col gap-6">
      <DashboardSection actions={
        <DashboardControls
          state={state}
          onAsOfChange={setAsOf}
          onThresholdsChange={setThresholds}
          onReset={reset}
          disabled={loading && !platform}
        />
      }>
        <PlatformSummaryCards platform={platform} />
      </DashboardSection>

      <DashboardSection title={sysAdminDashboardJa.title}>
        {isInitialLoading && <LoadingIndicator />}
        {!isInitialLoading && error && <ErrorState title={sysAdminDashboardJa.state.error} />}
        {!isInitialLoading && !error && communities.length === 0 && (
          <Empty>{sysAdminDashboardJa.state.empty}</Empty>
        )}
        {!isInitialLoading && !error && communities.length > 0 && (
          <CommunityCardGrid rows={communities} onRowClick={handleRowClick} />
        )}
      </DashboardSection>
    </div>
  );
}
