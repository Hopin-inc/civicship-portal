"use client";

import { useEffect, useState, type RefObject } from "react";

export type ReportSelection = {
  text: string;
  rect: DOMRect;
};

/**
 * `containerRef` 内のテキスト選択を監視し、選択範囲がある間だけ
 * `{ text, rect }` を返す hook。選択が崩れた / 範囲外に出たときは null。
 *
 * `selectionchange` は選択中ずっと連続で発火するので、debounce で「指 / マウスが
 * 離れて落ち着いた」タイミングだけを拾う。モバイルの native selection menu との
 * 競合を避けるため、呼び出し側で位置決めを工夫する想定。
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

    let timer: ReturnType<typeof setTimeout> | null = null;

    const update = () => {
      const sel = window.getSelection();
      const container = containerRef.current;
      if (!sel || sel.isCollapsed || sel.rangeCount === 0 || !container) {
        setSelection(null);
        return;
      }
      const range = sel.getRangeAt(0);
      const anchor = sel.anchorNode;
      const focus = sel.focusNode;
      if (!anchor || !focus) {
        setSelection(null);
        return;
      }
      if (!container.contains(anchor) || !container.contains(focus)) {
        setSelection(null);
        return;
      }
      const text = sel.toString().trim();
      if (text === "") {
        setSelection(null);
        return;
      }
      const rect = range.getBoundingClientRect();
      // 一部のブラウザは collapsed range で 0 の rect を返すことがあるので保険。
      if (rect.width === 0 && rect.height === 0) {
        setSelection(null);
        return;
      }
      setSelection({ text, rect });
    };

    const onSelectionChange = () => {
      if (timer != null) clearTimeout(timer);
      timer = setTimeout(update, 120);
    };

    // scroll / resize 中は選択は維持されるので、フロート UI が viewport 上で
    // 追従するよう rect を取り直す。
    const onViewportChange = () => update();

    document.addEventListener("selectionchange", onSelectionChange);
    window.addEventListener("scroll", onViewportChange, true);
    window.addEventListener("resize", onViewportChange);
    return () => {
      if (timer != null) clearTimeout(timer);
      document.removeEventListener("selectionchange", onSelectionChange);
      window.removeEventListener("scroll", onViewportChange, true);
      window.removeEventListener("resize", onViewportChange);
    };
  }, [containerRef, enabled]);

  return selection;
}
