"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { DashboardOverview } from "@/app/sysAdmin/features/dashboard/components/DashboardOverview";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

export default function SysAdminDashboardPage() {
  const headerConfig = useMemo(
    () => ({
      title: sysAdminDashboardJa.title,
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="mx-auto max-w-7xl p-4">
      <DashboardOverview />
    </div>
  );
}
