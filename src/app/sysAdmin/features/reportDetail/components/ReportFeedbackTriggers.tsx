"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GqlReportFeedbackFieldsFragment } from "@/types/graphql";
import {
  ReportFeedbackForm,
  type FeedbackFormInput,
} from "./ReportFeedbackForm";
import { useReportTextSelection } from "./useReportTextSelection";

type Props = {
  /** 選択監視対象 (= 本文 article)。ここの中の選択にだけ float ボタンを出す。 */
  contentRef: RefObject<HTMLElement>;
  existingFeedback?: GqlReportFeedbackFieldsFragment | null;
  saving: boolean;
  saveError: { message: string } | null;
  onSubmit: (input: FeedbackFormInput) => void;
};

/**
 * Feedback の起動口を 2 系統用意する component:
 *
 * 1. 本文中で文字を選択したときにフロート表示される「選択範囲を引用してフィードバック」ボタン
 * 2. 画面右下に常駐する FAB
 *
 * どちらも `Dialog` ベースの同じモーダル (`ReportFeedbackForm`) を開く。
 * 選択経由で開いた場合は `> 選択テキスト\n\n` を comment に prefill する。
 */
export function ReportFeedbackTriggers({
  contentRef,
  existingFeedback,
  saving,
  saveError,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState(false);
  const [prefillComment, setPrefillComment] = useState<string>("");
  const wasSavingRef = useRef(false);

  const selection = useReportTextSelection(contentRef, !open);

  const openWithQuote = useCallback((text: string) => {
    setPrefillComment(buildQuotePrefix(text));
    setOpen(true);
    // モーダルが開いたら選択は不要 (native selection menu と被ると邪魔)
    if (typeof window !== "undefined") {
      window.getSelection()?.removeAllRanges();
    }
  }, []);

  const openEmpty = useCallback(() => {
    setPrefillComment("");
    setOpen(true);
  }, []);

  // 投稿成功 (saving が true → false に遷移し、saveError なし) でモーダルを閉じる。
  useEffect(() => {
    if (wasSavingRef.current && !saving && !saveError) {
      setOpen(false);
      setPrefillComment("");
    }
    wasSavingRef.current = saving;
  }, [saving, saveError]);

  const floatPosition = useMemo(() => computeFloatPosition(selection?.rect), [
    selection?.rect,
  ]);

  // ?debug=selection が付いていれば FAB の上に診断 chip を出す。
  // 本番では常時表示しないが、storybook / dev で「選択を hook が拾ってるか」
  // を visual で確認するための補助。
  const debug =
    typeof window !== "undefined" &&
    window.location.search.includes("debug=selection");

  return (
    <>
      {selection && floatPosition && (
        <div
          className="pointer-events-none fixed z-[60]"
          style={{ top: floatPosition.top, left: floatPosition.left }}
        >
          <Button
            type="button"
            size="sm"
            onMouseDown={(e) => {
              // mousedown 時点で選択が消えないよう preventDefault。
              e.preventDefault();
            }}
            onClick={() => openWithQuote(selection.text)}
            className="pointer-events-auto h-8 gap-1.5 px-2.5 text-body-xs shadow-lg"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" aria-hidden />
            この箇所にレビュー
          </Button>
        </div>
      )}

      {debug && (
        <div className="fixed bottom-20 right-6 z-[60] max-w-xs rounded-md bg-foreground/90 px-2 py-1 text-[10px] font-mono leading-tight text-background shadow">
          {selection
            ? `sel: ${selection.text.length}c, rect.top=${Math.round(
                selection.rect.top,
              )} left=${Math.round(selection.rect.left)} ref=${
                contentRef.current ? "OK" : "NULL"
              }`
            : `no selection (ref=${contentRef.current ? "OK" : "NULL"})`}
        </div>
      )}

      <Button
        type="button"
        size="lg"
        onClick={openEmpty}
        aria-label="フィードバックを投稿"
        className="fixed bottom-6 right-6 z-[60] h-12 w-12 rounded-full p-0 shadow-lg"
      >
        <MessageSquarePlus className="h-5 w-5" aria-hidden />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>フィードバックを投稿</DialogTitle>
            <DialogDescription className="text-body-xs">
              評価とコメントを残せます。引用部分は編集できます。
            </DialogDescription>
          </DialogHeader>
          <ReportFeedbackForm
            existingFeedback={existingFeedback}
            prefillComment={prefillComment}
            saving={saving}
            saveError={saveError}
            onSubmit={onSubmit}
            trailing={
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={saving}
                >
                  キャンセル
                </Button>
              </DialogClose>
            }
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function buildQuotePrefix(text: string): string {
  const cleaned = text.replace(/\r\n/g, "\n").trim();
  if (cleaned === "") return "";
  const quoted = cleaned
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
  return `${quoted}\n\n`;
}

/**
 * 選択範囲の真上にフロートボタンを置く。viewport 上端に近すぎる場合は下に回す。
 * `position: fixed` で配置するため `getBoundingClientRect` の値をそのまま使う。
 */
function computeFloatPosition(rect: DOMRect | undefined): {
  top: number;
  left: number;
} | null {
  if (!rect) return null;
  const buttonHeight = 36;
  const gap = 8;
  const minTopMargin = 56; // header の被り回避
  const placeAbove = rect.top - buttonHeight - gap >= minTopMargin;
  const top = placeAbove
    ? rect.top - buttonHeight - gap
    : rect.bottom + gap;
  const center = rect.left + rect.width / 2;
  const approxButtonWidth = 168;
  const left = Math.max(
    8,
    Math.min(
      center - approxButtonWidth / 2,
      (typeof window !== "undefined" ? window.innerWidth : 1024) -
        approxButtonWidth -
        8,
    ),
  );
  return { top, left };
}
