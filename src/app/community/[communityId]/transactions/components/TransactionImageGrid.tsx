"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ImageLightbox } from "./ImageLightbox";

interface Props {
  images: string[];
}

/**
 * トランザクション画像グリッド（最大4枚）
 *   1枚: フル幅（4:3）
 *   2枚: 横並び（1:1）
 *   3枚: 上1枚フル幅 + 下2枚横並び
 *   4枚: 2×2グリッド
 * タップで ImageLightbox を開く
 */
export function TransactionImageGrid({ images }: Props) {
  const t = useTranslations();
  const count = Math.min(images.length, 4);
  const displayed = images.slice(0, 4);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const alt = (i: number) => t("transactions.detail.photo", { index: i + 1, total: count });

  const imgProps = (i: number) => ({
    role: "button" as const,
    tabIndex: 0,
    onClick: () => setLightboxIndex(i),
    onKeyDown: (e: React.KeyboardEvent) => e.key === "Enter" && setLightboxIndex(i),
    className: "cursor-pointer",
  });

  return (
    <>
      {count === 1 && (
        <div className="aspect-[4/3] w-full overflow-hidden rounded-xl" {...imgProps(0)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayed[0]} alt={alt(0)} className="h-full w-full object-cover" />
        </div>
      )}

      {count === 2 && (
        <div className="grid grid-cols-2 gap-1">
          {displayed.map((url, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-xl" {...imgProps(i)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={alt(i)} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {count === 3 && (
        <div className="flex flex-col gap-1">
          <div className="aspect-[2/1] overflow-hidden rounded-xl" {...imgProps(0)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={displayed[0]} alt={alt(0)} className="h-full w-full object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-1">
            {displayed.slice(1).map((url, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-xl" {...imgProps(i + 1)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={alt(i + 1)} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {count === 4 && (
        <div className="grid grid-cols-2 gap-1">
          {displayed.map((url, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-xl" {...imgProps(i)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={alt(i)} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <ImageLightbox
          images={displayed}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => Math.max(0, (i ?? 0) - 1))}
          onNext={() => setLightboxIndex((i) => Math.min(count - 1, (i ?? 0) + 1))}
        />
      )}
    </>
  );
}
