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
 * `selectionchange` / `mouseup` / `touchend` / `keyup` を全部拾って
 * `requestAnimationFrame` で batch する。これにより:
 *   - Mac / iOS Safari の selectionchange タイミングのバラつき
 *   - mouseup より selection 確定が後になるブラウザ
 *   - キーボード (shift+arrow) での選択拡張
 * いずれの経路でも 1 frame 以内にフロート UI が追従する。
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

    let raf: number | null = null;

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
      const text = sel.toString();
      if (text.trim() === "") return null;
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return null;
      return { text: text.trim(), rect };
    };

    const schedule = () => {
      if (raf != null) return;
      raf = window.requestAnimationFrame(() => {
        raf = null;
        setSelection(readCurrentSelection());
      });
    };

    document.addEventListener("selectionchange", schedule);
    document.addEventListener("mouseup", schedule);
    document.addEventListener("touchend", schedule);
    document.addEventListener("keyup", schedule);
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    return () => {
      if (raf != null) window.cancelAnimationFrame(raf);
      document.removeEventListener("selectionchange", schedule);
      document.removeEventListener("mouseup", schedule);
      document.removeEventListener("touchend", schedule);
      document.removeEventListener("keyup", schedule);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
    };
  }, [containerRef, enabled]);

  return selection;
}
