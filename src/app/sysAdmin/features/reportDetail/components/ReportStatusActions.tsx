"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { GqlReportStatus } from "@/types/graphql";

export type ReportStatusActionsProps = {
  status: GqlReportStatus;
  /** publishReport の `finalContent` 初期値 (= report.finalContent ?? outputMarkdown) */
  initialFinalContent: string;
  approving: boolean;
  publishing: boolean;
  rejecting: boolean;
  approveError: { message: string } | null;
  publishError: { message: string } | null;
  rejectError: { message: string } | null;
  onApprove: () => Promise<void>;
  onPublish: (finalContent: string) => Promise<void>;
  onReject: () => Promise<void>;
};

/**
 * Report のステータス遷移 UI。
 *
 * 現 status から遷移可能なアクションだけ表示する。"これ以上の操作は
 * ありません" 等の hint は出さず、Published / Rejected / Skipped /
 * Superseded では何も描画しない (= ヘッダー周りがスッキリ)。
 *
 * - 「公開」は `publishReport` 用の confirm Dialog で finalContent を
 *   確認 / 編集してから発火。空のままだと submit 不可。
 * - 「却下」は取り消し不可なので確認 Dialog を挟む。
 * - 「承認」は Draft → Approved の中間遷移なので 1 段階的に押せて十分。
 *
 * mutation のエラーは inline メッセージで表示し、ボタンは success
 * までは disabled だが失敗時に再有効化される。
 */
export function ReportStatusActions({
  status,
  initialFinalContent,
  approving,
  publishing,
  rejecting,
  approveError,
  publishError,
  rejectError,
  onApprove,
  onPublish,
  onReject,
}: ReportStatusActionsProps) {
  const [publishOpen, setPublishOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  // 親コンポーネントで `key={report.id}` を渡すことで、別 Report に切り替わった
  // ときに Component が unmount → mount し直され、`useState` の初期値で
  // draftFinalContent も自動的に新 Report の initialFinalContent に置き換わる。
  // よって同一 Report 内では編集中の内容が Dialog の開閉 / mutation 失敗を
  // またいで保持される。
  const [draftFinalContent, setDraftFinalContent] = useState(
    initialFinalContent ?? "",
  );

  // 「承認」が出るのは Draft、「公開」が出るのは Approved。
  // 「却下」は Draft / Approved どちらからも撤回として打てる。
  const canApprove = status === GqlReportStatus.Draft;
  const canPublish = status === GqlReportStatus.Approved;
  const canReject =
    status === GqlReportStatus.Draft || status === GqlReportStatus.Approved;

  if (!canApprove && !canPublish && !canReject) return null;

  const errorMessage =
    approveError?.message ?? publishError?.message ?? rejectError?.message;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {canApprove && (
          <Button
            variant="primary"
            size="sm"
            onClick={onApprove}
            disabled={approving || rejecting}
          >
            {approving ? "承認中..." : "承認"}
          </Button>
        )}
        {canPublish && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setPublishOpen(true)}
            disabled={publishing || rejecting}
          >
            {publishing ? "公開中..." : "公開"}
          </Button>
        )}
        {canReject && (
          <Button
            variant="destructive-outline"
            size="sm"
            onClick={() => setRejectOpen(true)}
            disabled={approving || publishing || rejecting}
          >
            {rejecting ? "却下中..." : "却下"}
          </Button>
        )}
      </div>

      {errorMessage && (
        <p className="text-body-sm text-destructive">{errorMessage}</p>
      )}

      <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>このレポートを公開する</DialogTitle>
            <DialogDescription>
              公開すると finalContent がコミュニティ向けに配信されます。
              内容を確認・編集してください。
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={draftFinalContent}
            onChange={(e) => setDraftFinalContent(e.target.value)}
            rows={12}
            className="font-mono text-body-sm"
            placeholder="最終的な markdown を入力"
          />
          <DialogFooter>
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setPublishOpen(false)}
              disabled={publishing}
            >
              キャンセル
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={async () => {
                try {
                  await onPublish(draftFinalContent);
                  setPublishOpen(false);
                } catch {
                  // 失敗時は Dialog を閉じない: 編集中の draftFinalContent
                  // が保持され、エラーメッセージは親側で inline 表示される。
                }
              }}
              disabled={publishing || draftFinalContent.trim() === ""}
            >
              {publishing ? "公開中..." : "公開する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>このレポートを却下する</DialogTitle>
            <DialogDescription>
              却下すると以降このレポートは公開対象から外れます。取り消しは
              backend 側のフローによります。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setRejectOpen(false)}
              disabled={rejecting}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                try {
                  await onReject();
                  setRejectOpen(false);
                } catch {
                  // 失敗時は Dialog を閉じない (再試行できるように)。
                }
              }}
              disabled={rejecting}
            >
              {rejecting ? "却下中..." : "却下する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
