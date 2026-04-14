"use client";

import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X } from "lucide-react";
import { toast } from "react-toastify";
import { useTransactionMutations } from "@/app/community/[communityId]/admin/wallet/hooks/useTransactionMutations";
import { useTranslations } from "next-intl";

const MAX_IMAGES = 4;

interface Props {
  transactionId: string;
  initialComment: string | null;
  initialImages: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

async function urlToFile(url: string, onError: (msg: string) => void): Promise<File> {
  try {
    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxyUrl);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const blob = await res.blob();
    const fileName = url.split("/").pop()?.split("?")[0] ?? "image.jpg";
    return new File([blob], fileName, { type: blob.type });
  } catch (error) {
    onError(url);
    throw error instanceof Error ? error : new Error("Failed to reconstruct existing image");
  }
}

export function TransactionMetadataEditSheet({
  transactionId,
  initialComment,
  initialImages,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const t = useTranslations();
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
    const willExceed = existingImages.length + newImages.length + files.length > MAX_IMAGES;
    if (willExceed) {
      toast.error(t("transactions.detail.editSheet.photoLimit", { max: MAX_IMAGES }));
    }
    setNewImages((prev) => {
      const combined = [...prev, ...files];
      if (existingImages.length + combined.length > MAX_IMAGES) {
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
        const results = await Promise.allSettled(
          existingImages.map((url) =>
            urlToFile(url, () => {}),
          ),
        );
        if (results.some((r) => r.status === "rejected")) {
          toast.error(t("transactions.detail.editSheet.imageLoadError"));
          return;
        }
        const keptFiles = results.map((r) => (r as PromiseFulfilledResult<File>).value);
        images = [...keptFiles, ...newImages];
      }

      // 変更なし=undefined、削除=null、新規/更新=文字列 で区別
      const normalizedInitial = initialComment?.trim() ?? "";
      const normalizedComment = comment.trim();
      const nextComment =
        normalizedComment === normalizedInitial
          ? undefined
          : normalizedComment === ""
            ? null
            : normalizedComment;

      // コメントも画像も変更がなければミューテーションをスキップして閉じる
      if (nextComment === undefined && images === undefined) {
        onOpenChange(false);
        return;
      }

      const res = await updateTransactionMetadata(transactionId, {
        comment: nextComment,
        images,
      });

      if (res.success) {
        toast.success(t("transactions.detail.editSheet.saveSuccess"));
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(t("transactions.detail.editSheet.saveError"));
      }
    } catch {
      toast.error(t("transactions.detail.editSheet.saveError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] flex flex-col p-0 max-w-md mx-auto">
        <SheetHeader className="px-4 pt-4 pb-2 shrink-0">
          <SheetTitle className="text-base">{t("transactions.detail.editSheet.title")}</SheetTitle>
        </SheetHeader>

        {/* スクロール可能なコンテンツ */}
        <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-3">
          <div className="relative">
            <Textarea
              autoFocus
              maxLength={100}
              placeholder={t("transactions.detail.editSheet.placeholder")}
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
                    type="button"
                    aria-label={t("transactions.detail.editSheet.removePhoto", { index: i + 1 })}
                    onClick={() => setExistingImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
              ))}
              {newPreviews.map((url, i) => (
                <div key={`new-${i}`} className="relative w-20 h-20 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover rounded-xl" />
                  <button
                    type="button"
                    aria-label={t("transactions.detail.editSheet.removePhoto", { index: existingImages.length + i + 1 })}
                    onClick={() => setNewImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 写真追加ボタン */}
          {totalImages < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <ImagePlus className="w-4 h-4" />
              {t("transactions.detail.editSheet.addPhoto")}
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
            {isLoading
              ? t("transactions.detail.editSheet.saving")
              : t("transactions.detail.editSheet.save")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
