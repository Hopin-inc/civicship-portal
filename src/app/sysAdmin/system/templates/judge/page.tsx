"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";

export default function SysAdminSystemTemplatesJudgePage() {
  const headerConfig = useMemo(
    () => ({
      title: "JUDGE テンプレート",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6 px-4">
      <p className="text-body-sm text-muted-foreground">
        準備中: JUDGE template 一覧をここに表示します
      </p>
      <p className="text-body-xs text-destructive">
        注意: JUDGE template の編集は過去の judgeScore 比較を断絶します。
      </p>
    </div>
  );
}
