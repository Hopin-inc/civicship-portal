"use client";

import { useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">画像</h2>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          参加者にイメージを伝えるため、最低2枚の画像登録が必要です。最大5枚まで登録できます。
        </p>

        <Button
          type="button"
          variant="tertiary"
          className="w-full h-[56px]"
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= 5}
        >
          ファイルを選択
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={onImageSelect}
        />

        {images.length > 0 && (
          <div>
            <div className="relative">
              <AsymmetricImageGrid images={formattedImages} />

              <div className="absolute top-2 right-2 flex flex-col gap-2">
                {images.map((_, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveImage(index)}
                  >
                    削除 {index + 1}
                  </Button>
                ))}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-2">{images.length}/5 枚選択中</p>
          </div>
        )}
      </div>
    </div>
  );
};
