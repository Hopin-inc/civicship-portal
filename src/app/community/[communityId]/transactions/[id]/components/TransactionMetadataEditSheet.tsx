"use client";

import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X } from "lucide-react";
import { toast } from "react-toastify";
import { useTransactionMutations } from "@/app/community/[communityId]/admin/wallet/hooks/useTransactionMutations";

const MAX_IMAGES = 4;

interface Props {
  transactionId: string;
  initialComment: string | null;
  initialImages: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

async function urlToFile(url: string): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  const fileName = url.split("/").pop()?.split("?")[0] ?? "image.jpg";
  return new File([blob], fileName, { type: blob.type });
}

export function TransactionMetadataEditSheet({
  transactionId,
  initialComment,
  initialImages,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const { updateTransactionMetadata } = useTransactionMutations();

  const [comment, setComment] = useState(initialComment ?? "");
  const [existingImages, setExistingImages] = useState<string[]>(initialImages);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // open 時にリセット
  useEffect(() => {
    if (open) {
      setComment(initialComment ?? "");
      setExistingImages(initialImages);
      setNewImages([]);
    }
  }, [open, initialComment, initialImages]);

  // 新規画像のプレビューURL管理
  useEffect(() => {
    const urls = newImages.map((f) => URL.createObjectURL(f));
    setNewPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [newImages]);

  const totalImages = existingImages.length + newImages.length;

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setNewImages((prev) => {
      const combined = [...prev, ...files];
      if (existingImages.length + combined.length > MAX_IMAGES) {
        toast.error(`画像は${MAX_IMAGES}枚まで追加できます`);
        return combined.slice(0, MAX_IMAGES - existingImages.length);
      }
      return combined;
    });
    e.target.value = "";
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const hasImageChanges =
        existingImages.length !== initialImages.length || newImages.length > 0;

      let images: File[] | undefined;
      if (hasImageChanges) {
        const keptFiles = await Promise.all(existingImages.map(urlToFile));
        images = [...keptFiles, ...newImages];
      }

      const res = await updateTransactionMetadata(transactionId, {
        comment: comment.trim() || undefined,
        images,
      });

      if (res.success) {
        toast.success("更新しました");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error("更新に失敗しました");
      }
    } catch {
      toast.error("更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] flex flex-col p-0">
        <SheetHeader className="px-4 pt-4 pb-2 shrink-0">
          <SheetTitle className="text-base">メッセージを編集</SheetTitle>
        </SheetHeader>

        {/* スクロール可能なコンテンツ */}
        <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-3">
          <div className="relative">
            <Textarea
              autoFocus
              maxLength={100}
              placeholder="メッセージを入力してください"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="focus:outline-none focus:ring-0 shadow-none resize-none min-h-[100px] pr-12"
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {comment.length}/100
            </div>
          </div>

          {/* 既存画像 */}
          {(existingImages.length > 0 || newPreviews.length > 0) && (
            <div className="flex gap-2 flex-wrap">
              {existingImages.map((url, i) => (
                <div key={`existing-${i}`} className="relative w-20 h-20 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover rounded-xl" />
                  <button
                    onClick={() => setExistingImages((prev) => prev.filter((u) => u !== url))}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {newPreviews.map((url, i) => (
                <div key={`new-${i}`} className="relative w-20 h-20 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover rounded-xl" />
                  <button
                    onClick={() => setNewImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 写真追加ボタン */}
          {totalImages < MAX_IMAGES && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <ImagePlus className="w-4 h-4" />
              写真を追加
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleAddImages}
          />
        </div>

        {/* 保存ボタン */}
        <div className="shrink-0 px-4 py-3 bg-background">
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
            {isLoading ? "保存中..." : "保存"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
