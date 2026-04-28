"use client";

import { useMemo } from "react";
import { Plus, Settings } from "lucide-react";
import { useAppRouter } from "@/lib/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import type {
  GqlAdminReportSummaryRowFieldsFragment,
  GqlGetSysAdminDashboardQuery,
} from "@/types/graphql";
import { CommunityRow } from "./features/dashboard/components/CommunityRow";
import { useDashboardControls } from "./features/dashboard/hooks/useDashboardControls";
import { useDashboardOverview } from "./features/dashboard/hooks/useDashboardOverview";
import { sysAdminDashboardJa } from "./_shared/i18n/ja";

type Props = {
  /** SSR で取得した初期データ。null は SSR fetch 失敗 (auth なし等) */
  initialData: GqlGetSysAdminDashboardQuery["sysAdminDashboard"] | null;
  /**
   * SSR で取得した Report Summary 配列。`communityId` で索けるように
   * 受け取り側で Map にする。null は summary 取得失敗 (= Report Pill 無しで
   * 描画する fail-soft フォールバック)。
   */
  reportSummaries: GqlAdminReportSummaryRowFieldsFragment[] | null;
};

export function SysAdminPageClient({ initialData, reportSummaries }: Props) {
  const router = useAppRouter();
  const { state } = useDashboardControls();
  const { loading, error, communities } = useDashboardOverview(state, initialData);

  const reportSummaryByCommunity = useMemo(() => {
    const map = new Map<string, GqlAdminReportSummaryRowFieldsFragment>();
    for (const row of reportSummaries ?? []) {
      if (row.community?.id) map.set(row.community.id, row);
    }
    return map;
  }, [reportSummaries]);

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
                reportSummary={reportSummaryByCommunity.get(
                  community.communityId,
                )}
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
