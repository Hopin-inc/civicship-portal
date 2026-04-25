import React, { ReactNode } from "react";
import type { GqlSysAdminCommunityAlerts } from "@/types/graphql";
import { PrimaryAlertBadge } from "@/app/sysAdmin/_shared/components/PrimaryAlertBadge";

type Props = {
  alerts: GqlSysAdminCommunityAlerts;
  /** 用語 Button などの補助コントロール */
  controls?: ReactNode;
  /** 期間セレクト */
  periodControl?: ReactNode;
};

/**
 * Slim header: コミュニティ名はグローバルヘッダーに反映済みなので、
 * ここではアラート + 期間 / 用語コントロールだけを並べる。
 * MAU% の大数字は「活動」セクションに移したため当 component は持たない。
 */
export function CommunityDetailHeader({ alerts, controls, periodControl }: Props) {
  return (
    <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-h-[1.5rem]">
        <PrimaryAlertBadge alerts={alerts} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {periodControl}
        {controls}
      </div>
    </header>
  );
}
