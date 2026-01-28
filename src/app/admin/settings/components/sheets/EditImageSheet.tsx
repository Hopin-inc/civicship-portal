"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Upload, X, AlertCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

interface ImageSize {
  width: number;
  height: number;
}

interface EditImageSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  currentImageUrl: string | null;
  onSave: (file: File | null) => Promise<boolean>;
  /** 推奨サイズ（ピクセル） */
  recommendedSize?: ImageSize;
  description?: string;
  saving?: boolean;
}

export function EditImageSheet({
  open,
  onOpenChange,
  title,
  currentImageUrl,
  onSave,
  recommendedSize,
  description,
  saving = false,
}: EditImageSheetProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // シートが開くたびにリセット
  useEffect(() => {
    if (open) {
      setPreviewUrl(currentImageUrl);
      setSelectedFile(null);
      setImageSize(null);
      setSizeError(null);
    }
  }, [open, currentImageUrl]);

  const validateImageSize = (file: File): Promise<ImageSize> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error("画像の読み込みに失敗しました"));
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const size = await validateImageSize(file);
      setImageSize(size);

      // サイズバリデーション
      if (recommendedSize) {
        if (size.width !== recommendedSize.width || size.height !== recommendedSize.height) {
          setSizeError(
            `推奨サイズは ${recommendedSize.width}x${recommendedSize.height}px です。選択された画像は ${size.width}x${size.height}px です。`
          );
        } else {
          setSizeError(null);
        }
      }

      // プレビュー用のBlob URLを作成
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedFile(file);
    } catch {
      toast.error("画像の読み込みに失敗しました");
    }
  };

  const handleRemove = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
    setImageSize(null);
    setSizeError(null);
  };

  const handleSave = async () => {
    if (sizeError) {
      toast.error("推奨サイズの画像を選択してください");
      return;
    }
    await onSave(selectedFile);
    onOpenChange(false);
  };

  const isDirty = selectedFile !== null || (currentImageUrl !== null && previewUrl === null);

  // アスペクト比を計算
  const aspectRatio = recommendedSize
    ? `${recommendedSize.width}/${recommendedSize.height}`
    : "1/1";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-w-md mx-auto p-6 overflow-y-auto max-h-[80vh]"
      >
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="text-title-sm">{title}</SheetTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {recommendedSize && (
            <p className="text-xs text-muted-foreground">
              推奨サイズ: {recommendedSize.width} x {recommendedSize.height} px
            </p>
          )}
        </SheetHeader>

        <div className="space-y-4">
          {/* 画像プレビューエリア（実寸比率） */}
          <div
            className="relative w-full border-2 border-dashed rounded-lg overflow-hidden bg-muted"
            style={{ aspectRatio }}
          >
            {previewUrl ? (
              <>
                <Image
                  src={previewUrl}
                  alt="プレビュー"
                  fill
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition"
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  クリックして画像を選択
                </p>
              </div>
            )}
          </div>

          {/* 選択した画像のサイズ表示 */}
          {imageSize && (
            <p className="text-xs text-muted-foreground text-center">
              選択中: {imageSize.width} x {imageSize.height} px
            </p>
          )}

          {/* サイズエラー表示 */}
          {sizeError && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-xs text-destructive">{sizeError}</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {previewUrl && (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              別の画像を選択
            </Button>
          )}

          <Button
            onClick={handleSave}
            disabled={!isDirty || saving || !!sizeError}
            className="w-full"
          >
            {saving ? "保存中..." : "保存"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
