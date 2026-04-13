"use client";

interface Props {
  images: string[];
}

/**
 * トランザクション詳細ページの画像グリッド
 * 枚数に応じてレイアウトを変える
 *   1枚: フル幅（4:3）
 *   2枚: 横並び（1:1）
 *   3枚: 上1枚フル幅 + 下2枚横並び
 *   4枚以上: 2×2グリッド（+N バッジ付き）
 */
export function TransactionImageGrid({ images }: Props) {
  const count = images.length;

  if (count === 1) {
    return (
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[0]} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-1">
        {images.map((url, i) => (
          <div key={i} className="aspect-square overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
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
          <img src={images[0]} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="grid grid-cols-2 gap-1">
          {images.slice(1).map((url, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4枚以上: 2×2グリッド、4枚目に残り枚数バッジ
  const displayed = images.slice(0, 4);
  const remaining = count - 4;

  return (
    <div className="grid grid-cols-2 gap-1">
      {displayed.map((url, i) => (
        <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="h-full w-full object-cover" />
          {i === 3 && remaining > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
              <span className="text-xl font-bold text-white">+{remaining}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
