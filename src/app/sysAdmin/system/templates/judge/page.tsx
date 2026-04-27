"use client";

import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";
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
      <div className="flex items-start gap-2 rounded border border-destructive/40 bg-destructive/5 p-3">
        <AlertTriangle className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
        <div className="space-y-1 text-body-sm">
          <p className="font-semibold text-destructive">
            JUDGE template の編集は過去の judgeScore 比較を断絶します
          </p>
          <p className="text-body-xs text-muted-foreground">
            このページからの編集は意図的なものに限り、変更前に
            「過去の評価データと比較しない」運用方針を確認してください。
            通常は seed 投入 + experimentKey による段階移行を推奨します。
          </p>
        </div>
      </div>

      <p className="text-body-sm text-muted-foreground">
        準備中: backend の `kind: ReportTemplateKind` 引数 landing 後に有効化されます。
      </p>
    </div>
  );
}
