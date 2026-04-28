"use client";

import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  saving?: boolean;
};

/**
 * JUDGE template 編集前に表示する警告 modal。
 *
 * JUDGE prompt を変更すると、過去の judgeScore (LLM-as-Judge 評価) と
 * 新しい judgeScore が直接比較できなくなる (評価指標の不連続点が生まれる)。
 * 編集者にこの含意を理解させてから confirm させる。
 */
export function JudgeWarningModal({ open, onOpenChange, onConfirm, saving }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            JUDGE template の編集確認
          </DialogTitle>
          <DialogDescription className="space-y-2 pt-2">
            <span className="block">
              JUDGE prompt を変更すると、<strong>過去の judgeScore との比較が断絶</strong>します。
            </span>
            <span className="block text-body-xs">
              新しい judgeScore は変更後の prompt で評価されたものとなり、
              過去 version の評価データと直接比較するべきではありません。
            </span>
            <span className="block text-body-xs">
              本番運用中の場合は、新 version として seed 投入し、
              experimentKey で並列稼働させて段階移行することを推奨します。
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            キャンセル
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={saving}
          >
            {saving ? "保存中..." : "影響を理解した上で保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
