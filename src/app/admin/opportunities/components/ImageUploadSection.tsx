"use client";

import { ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";
import { X } from "lucide-react";
import AsymmetricImageGrid from "@/components/ui/asymmetric-image-grid";
import { ImageData } from "../types";

interface ImageUploadSectionProps {
  images: ImageData[];
  onImageSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
}

export const ImageUploadSection = ({
  images,
  onImageSelect,
  onRemoveImage,
}: ImageUploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formattedImages = images.map((img) => ({
    url: img.url,
    alt: img.alt || "",
  }));

  return (
    <div className="space-y-2">
      {/* Item 行（常に表示） */}
      <Item size="sm" variant={"outline"}>
        <ItemContent>
          <ItemTitle>画像</ItemTitle>
        </ItemContent>

        <ItemActions>
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= 5}
          >
            写真を追加
          </Button>
        </ItemActions>
      </Item>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={onImageSelect}
      />

      {/* 画像があるときだけ表示 */}
      {images.length > 0 && (
        <div className="space-y-1">
          <div className="relative">
            <AsymmetricImageGrid images={formattedImages} />

            {/* overlay は Grid の外で absolute 配置 */}
            <div className="pointer-events-none absolute inset-0">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className="pointer-events-auto absolute top-1 right-1 rounded-full bg-black/60 text-white p-1"
                  style={{
                    // ここは grid の配置に応じて微調整
                    transform: `translateY(${index * 0}px)`,
                  }}
                  onClick={() => onRemoveImage(index)}
                  aria-label="画像を削除"
                >
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">{images.length} / 5 枚</p>
        </div>
      )}
    </div>
  );
};
