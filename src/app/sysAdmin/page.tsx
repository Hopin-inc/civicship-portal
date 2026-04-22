"use client";

import { useMemo } from "react";
import { useAppRouter } from "@/lib/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import { BarChart3, Plus } from "lucide-react";
import { CommunityList } from "./features/list/components/CommunityList";
import { sysAdminDashboardJa } from "./_shared/i18n/ja";

export default function SysAdminPage() {
  const router = useAppRouter();

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
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-body-sm text-muted-foreground pl-4">コミュニティ一覧</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push("/sysAdmin/dashboard")}
            variant="secondary"
            size="sm"
            className="gap-1"
          >
            <BarChart3 className="h-4 w-4" />
            {sysAdminDashboardJa.nav.toDashboard}
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

      <CommunityList />
    </div>
  );
}
