import { useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { ImageData, isNewImage } from "../types";

export function useImageManager(initialImages: ImageData[] = []) {
  const [images, setImages] = useState<ImageData[]>(initialImages);

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (images.length + files.length > 5) {
      toast.error("画像は最大5枚までです");
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

  // クリーンアップ
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (isNewImage(img)) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [images]);

  return {
    images,
    handleImageSelect,
    removeImage,
  };
}
