"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface EditImageSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  currentImageUrl: string | null;
  onSave: (file: File | null) => Promise<boolean>;
  aspectRatio?: string;
  description?: string;
  saving?: boolean;
}

export function EditImageSheet({
  open,
  onOpenChange,
  title,
  currentImageUrl,
  onSave,
  aspectRatio = "1/1",
  description,
  saving = false,
}: EditImageSheetProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // シートが開くたびにリセット
  useEffect(() => {
    if (open) {
      setPreviewUrl(currentImageUrl);
      setSelectedFile(null);
    }
  }, [open, currentImageUrl]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // プレビュー用のBlob URLを作成
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);
  };

  const handleRemove = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleSave = async () => {
    await onSave(selectedFile);
    onOpenChange(false);
  };

  const isDirty = selectedFile !== null || (currentImageUrl !== null && previewUrl === null);

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
        </SheetHeader>

        <div className="space-y-4">
          {/* 画像プレビューエリア */}
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
            disabled={!isDirty || saving}
            className="w-full"
          >
            {saving ? "保存中..." : "保存"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
