"use client";

import { ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item";
import { X } from "lucide-react";
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

  return (
    <div className="space-y-2">
      {/* Item 行 */}
      <Item size="sm" variant="outline">
        <ItemContent>
          <ItemTitle>画像</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button
            type="button"
            variant="text"
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

      {/* 画像一覧 */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img.url}
                alt={img.alt || ""}
                className="aspect-square w-full rounded-md object-cover"
              />

              {/* 削除ボタン */}
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                aria-label="画像を削除"
                className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && <p className="text-xs text-muted-foreground">{images.length} / 5 枚</p>}
    </div>
  );
};
