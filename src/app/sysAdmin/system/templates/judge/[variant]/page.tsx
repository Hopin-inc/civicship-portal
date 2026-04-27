"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";

export default function SysAdminSystemTemplateJudgeDetailPage() {
  const params = useParams<{ variant: string }>();

  const headerConfig = useMemo(
    () => ({
      title: "JUDGE テンプレート詳細",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6 px-4">
      <p className="text-body-sm text-muted-foreground">
        準備中: JUDGE variant = {params.variant} の詳細をここに表示します
      </p>
    </div>
  );
}
