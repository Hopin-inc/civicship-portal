"use client";

import { useMemo } from "react";
import { Plus, Settings } from "lucide-react";
import { useAppRouter } from "@/lib/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import type { GqlGetSysAdminDashboardQuery } from "@/types/graphql";
import { CommunityRow, type CommunityReportSummary } from "./features/dashboard/components/CommunityRow";
import { useDashboardControls } from "./features/dashboard/hooks/useDashboardControls";
import { useDashboardOverview } from "./features/dashboard/hooks/useDashboardOverview";
import { sysAdminDashboardJa } from "./_shared/i18n/ja";

type Props = {
  /** SSR で取得した初期データ。null は SSR fetch 失敗 (auth なし等) */
  initialData: GqlGetSysAdminDashboardQuery["sysAdminDashboard"] | null;
  /**
   * Community ごとの「最終 Report 発行サマリ」。
   * RSC → Client の serialization 制約から Record で受ける (Map は React 18
   * の flight protocol で扱えない)。Storybook では undefined を渡せば Report
   * pill 抜きで描画される (View 層は data 層に依存しない)。
   */
  reportSummariesByCommunity?: Record<string, CommunityReportSummary>;
};

export function SysAdminPageClient({
  initialData,
  reportSummariesByCommunity,
}: Props) {
  const router = useAppRouter();
  const { state } = useDashboardControls();
  const { loading, error, communities } = useDashboardOverview(state, initialData);

  const headerConfig = useMemo(
    () => ({
      title: "コミュニティ一覧",
      showLogo: false,
      showBackButton: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-body-sm text-muted-foreground pl-4">
          コミュニティ一覧
        </h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push("/sysAdmin/system/templates")}
            variant="tertiary"
            size="sm"
            className="gap-1"
          >
            <Settings className="h-4 w-4" />
            設定
          </Button>
          <Button
            onClick={() => router.push("/sysAdmin/create")}
            variant="primary"
            size="sm"
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            作成
          </Button>
        </div>
      </div>

      {loading && communities.length === 0 ? (
        <LoadingIndicator fullScreen={false} />
      ) : error && communities.length === 0 ? (
        <ErrorState title={sysAdminDashboardJa.state.error} />
      ) : communities.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          {sysAdminDashboardJa.state.empty}
        </div>
      ) : (
        <div className="flex flex-col">
          {communities.map((community, idx) => (
            <div key={community.communityId}>
              {idx !== 0 && <hr className="border-muted" />}
              <CommunityRow
                row={community}
                reportSummary={reportSummariesByCommunity?.[community.communityId]}
                onClick={(communityId) =>
                  router.push(`/sysAdmin/${communityId}`)
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

