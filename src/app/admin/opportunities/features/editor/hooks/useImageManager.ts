import { useState, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { ImageData, isNewImage } from "../types/form";
import { MAX_IMAGES } from "../constants/form";

export function useImageManager(initialImages: ImageData[] = []) {
  const [images, setImages] = useState<ImageData[]>(initialImages);

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`画像は最大${MAX_IMAGES}枚までです`);
      return;
    }

    const newImages: ImageData[] = files.map((file) => ({
      type: 'new' as const,
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const removed = prev[index];
      // 新規画像の場合、blob URLを解放
      if (isNewImage(removed)) {
        URL.revokeObjectURL(removed.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // Note: Blob URLのクリーンアップは意図的に実装していません
  // 理由:
  // - ページ遷移時に自動解放される
  // - 編集中の少数の画像による影響は無視できる
  // - クリーンアップのタイミング制御が複雑化し、バグの原因になる

  return {
    images,
    handleImageSelect,
    removeImage,
  };
}
