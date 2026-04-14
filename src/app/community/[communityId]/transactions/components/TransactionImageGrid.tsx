"use client";

import { useTranslations } from "next-intl";

interface Props {
  images: string[];
}

/**
 * トランザクション詳細ページの画像グリッド
 * 枚数に応じてレイアウトを変える（最大4枚）
 *   1枚: フル幅（4:3）
 *   2枚: 横並び（1:1）
 *   3枚: 上1枚フル幅 + 下2枚横並び
 *   4枚: 2×2グリッド
 */
export function TransactionImageGrid({ images }: Props) {
  const t = useTranslations();
  const count = images.length;
  const alt = (i: number) => t("transactions.detail.photo", { index: i + 1, total: count });

  if (count === 1) {
    return (
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[0]} alt={alt(0)} className="h-full w-full object-cover" />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-1">
        {images.map((url, i) => (
          <div key={i} className="aspect-square overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={alt(i)} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="flex flex-col gap-1">
        <div className="aspect-[2/1] overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[0]} alt={alt(0)} className="h-full w-full object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-1">
          {images.slice(1).map((url, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={alt(i + 1)} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4枚: 2×2グリッド
  return (
    <div className="grid grid-cols-2 gap-1">
      {images.slice(0, 4).map((url, i) => (
        <div key={i} className="aspect-square overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={alt(i)} className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}
