"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import { JudgeWarningModal } from "@/app/sysAdmin/features/system/templates/shared/JudgeWarningModal";

export default function SysAdminSystemTemplateJudgeDetailPage() {
  const params = useParams<{ variant: string }>();
  const [warningOpen, setWarningOpen] = useState(false);

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
      <div className="flex items-start gap-2 rounded border border-destructive/40 bg-destructive/5 p-3">
        <AlertTriangle className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
        <p className="text-body-xs text-muted-foreground">
          JUDGE prompt を編集すると過去の judgeScore との比較が断絶します。
          保存前に確認 modal が表示されます。
        </p>
      </div>

      <p className="text-body-sm text-muted-foreground">
        準備中: variant = {params.variant} の JUDGE template editor。
        backend の `kind: ReportTemplateKind` 引数 landing 後に有効化されます。
      </p>

      {/* Demo: 警告 modal の見え方確認用ボタン (本番実装時に削除 / Save 動作に統合) */}
      <Button
        variant="destructive-outline"
        size="sm"
        onClick={() => setWarningOpen(true)}
      >
        警告 modal をプレビュー
      </Button>

      <JudgeWarningModal
        open={warningOpen}
        onOpenChange={setWarningOpen}
        onConfirm={() => {
          setWarningOpen(false);
          // TODO: 実際の保存処理を呼ぶ (backend kind landing 後)
        }}
      />
    </div>
  );
}
