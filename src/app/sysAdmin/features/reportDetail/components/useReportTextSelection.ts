"use client";

import { useEffect, useState, type RefObject } from "react";

export type ReportSelection = {
  text: string;
  rect: DOMRect;
};

/**
 * `containerRef` 内のテキスト選択を監視し、選択範囲がある間だけ
 * `{ text, rect }` を返す hook。
 *
 * 「ユーザーが選択し終えた」タイミングを拾うため `mouseup` / `touchend` /
 * `keyup` で即時 update する。`selectionchange` は選択 clear (collapsed)
 * の検知のみに使う。`pointer` 系で取らない理由は、Safari iOS が
 * pointerup を発火しないケースがあるため。
 */
export function useReportTextSelection(
  containerRef: RefObject<HTMLElement>,
  enabled: boolean = true,
): ReportSelection | null {
  const [selection, setSelection] = useState<ReportSelection | null>(null);

  useEffect(() => {
    if (!enabled) {
      setSelection(null);
      return;
    }
    if (typeof window === "undefined") return;

    const readCurrentSelection = (): ReportSelection | null => {
      const sel = window.getSelection();
      const container = containerRef.current;
      if (!sel || sel.isCollapsed || sel.rangeCount === 0 || !container) {
        return null;
      }
      const range = sel.getRangeAt(0);
      const anchor = sel.anchorNode;
      const focus = sel.focusNode;
      if (!anchor || !focus) return null;
      if (!container.contains(anchor) || !container.contains(focus)) {
        return null;
      }
      const text = sel.toString().trim();
      if (text === "") return null;
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return null;
      return { text, rect };
    };

    const update = () => setSelection(readCurrentSelection());

    // 選択完了 (= mouse / 指を離した) タイミングで即時 update。
    // setTimeout で 1 tick ずらすのは、mouseup より先に selection が確定する
    // ブラウザと、後に確定するブラウザがあるため。
    const onPointerEnd = () => {
      window.setTimeout(update, 0);
    };

    // 選択が解除 (collapsed) されたら即座に消す。新規選択の途中で広がっていく
    // フェーズはこの hook では拾わない (チラつき回避)。
    const onSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) setSelection(null);
    };

    // scroll / resize 中は選択は維持されるので、フロート UI が viewport 上で
    // 追従するよう rect を取り直す。
    const onViewportChange = () => update();

    document.addEventListener("mouseup", onPointerEnd);
    document.addEventListener("touchend", onPointerEnd);
    document.addEventListener("keyup", onPointerEnd);
    document.addEventListener("selectionchange", onSelectionChange);
    window.addEventListener("scroll", onViewportChange, true);
    window.addEventListener("resize", onViewportChange);
    return () => {
      document.removeEventListener("mouseup", onPointerEnd);
      document.removeEventListener("touchend", onPointerEnd);
      document.removeEventListener("keyup", onPointerEnd);
      document.removeEventListener("selectionchange", onSelectionChange);
      window.removeEventListener("scroll", onViewportChange, true);
      window.removeEventListener("resize", onViewportChange);
    };
  }, [containerRef, enabled]);

  return selection;
}
