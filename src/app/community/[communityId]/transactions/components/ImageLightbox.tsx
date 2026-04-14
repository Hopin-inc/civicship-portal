"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function ImageLightbox({ images, index, onClose, onPrev, onNext }: Props) {
  const t = useTranslations();
  const total = images.length;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // オープン時に閉じるボタンへフォーカスを移し、クローズ時に元の要素へフォーカスを返す
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => {
      previouslyFocused?.focus();
    };
  }, []);

  // キーボード操作: Escape / 矢印キー / フォーカストラップ
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowLeft") { onPrev(); return; }
      if (e.key === "ArrowRight") { onNext(); return; }

      // フォーカストラップ: Tab / Shift+Tab をダイアログ内に閉じ込める
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t("transactions.detail.lightbox.title")}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* 閉じるボタン */}
      <button
        ref={closeButtonRef}
        type="button"
        aria-label={t("transactions.detail.lightbox.close")}
        className="absolute right-4 top-4 text-white/80 hover:text-white"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >
        <X className="w-7 h-7" />
      </button>

      {/* 枚数インジケーター */}
      {total > 1 && (
        <p className="absolute top-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
          {t("transactions.detail.lightbox.indicator", { current: index + 1, total })}
        </p>
      )}

      {/* 画像 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[index]}
        alt={t("transactions.detail.photo", { index: index + 1, total })}
        className="max-h-[85dvh] max-w-[92vw] rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {/* 前へ */}
      {total > 1 && (
        <button
          type="button"
          aria-label={t("transactions.detail.lightbox.prev")}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white disabled:opacity-30"
          disabled={index === 0}
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
          <ChevronLeft className="w-9 h-9" />
        </button>
      )}

      {/* 次へ */}
      {total > 1 && (
        <button
          type="button"
          aria-label={t("transactions.detail.lightbox.next")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white disabled:opacity-30"
          disabled={index === total - 1}
          onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
          <ChevronRight className="w-9 h-9" />
        </button>
      )}
    </div>,
    document.body
  );
}
