"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAppRouter } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { useTransactionMutations } from "@/app/community/[communityId]/admin/wallet/hooks/useTransactionMutations";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";
import { useTranslations } from "next-intl";
import Numpad, { NumpadKey } from "@/components/ui/numpad";
import { errorMessages } from "@/utils/errorMessage";
import { ImagePlus, X } from "lucide-react";

const MAX_IMAGES = 4;

const INT_LIMIT = 9_999_999;

export default function IssuePointPage() {
  const t = useTranslations();
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId ?? "";
  const router = useAppRouter();
  const track = useAnalytics();

  const [step, setStep] = useState<"numpad" | "confirm">("numpad");
  const [inputStr, setInputStr] = useState("");
  const inputStrRef = useRef("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const headerConfig = useMemo(
    () => ({
      title: t("adminWallet.issue.title"),
      showLogo: false,
      showBackButton: true,
      onBackClick: step === "confirm" ? () => setStep("numpad") : undefined,
    }),
    [t, step],
  );
  useHeaderConfig(headerConfig);

  const { issuePoint, isAuthReady } = useTransactionMutations();

  // プレビューURL の生成と cleanup
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);
    return () => { urls.forEach((url) => URL.revokeObjectURL(url)); };
  }, [images]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = MAX_IMAGES - images.length;
    if (files.length > remaining) {
      toast.error(t("wallets.shared.transfer.photoLimit", { max: MAX_IMAGES }));
    }
    setImages((prev) => {
      const combined = [...prev, ...files];
      return combined.length > MAX_IMAGES ? combined.slice(0, MAX_IMAGES) : combined;
    });
    e.target.value = "";
  };

  const numericAmount = parseInt(inputStr || "0", 10);
  const isAmountValid = numericAmount > 0 && numericAmount <= INT_LIMIT;

  const handleKey = (key: NumpadKey) => {
    if (key === "AC") {
      inputStrRef.current = "";
      setInputStr("");
      return;
    }
    if (key === "backspace") {
      const next = inputStrRef.current.slice(0, -1);
      inputStrRef.current = next;
      setInputStr(next);
      return;
    }
    // ref を使って常に最新値から次値を計算することで、連打時のステイルクロージャを防ぐ
    const next = parseInt((inputStrRef.current || "") + key, 10);
    if (next > INT_LIMIT) {
      toast.error(t("adminWallet.issue.validation.max"));
      return;
    }
    const nextStr = String(next);
    inputStrRef.current = nextStr;
    setInputStr(nextStr);
  };

  const handleIssuePoint = async () => {
    if (!isAmountValid) return;
    setIsLoading(true);
    try {
      const imagesInput = images.map((file) => ({ file, alt: "", caption: "" }));
      const res = await issuePoint({
        input: {
          transferPoints: numericAmount,
          comment: comment.trim() || undefined,
          images: imagesInput.length > 0 ? imagesInput : undefined,
        },
        permission: { communityId },
      });

      if (res.success) {
        track({ name: "issue_point", params: { amount: numericAmount } });
        toast.success(t("adminWallet.issue.success"));
        router.push("/admin/wallet");
      } else {
        const errorMessage = errorMessages[res.code] ?? t("adminWallet.issue.errorGeneric");
        toast.error(errorMessage);
      }
    } catch {
      toast.error(t("adminWallet.issue.errorGeneric"));
    } finally {
      setIsLoading(false);
    }
  };

  const amountSection = (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">{t("adminWallet.issue.title")}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-6xl font-bold tabular-nums tracking-tight">
          {numericAmount.toLocaleString()}
        </span>
        <span className="text-2xl text-muted-foreground font-medium">pt</span>
      </div>
    </div>
  );

  if (step === "confirm") {
    return (
      <div className="fixed inset-x-0 top-16 bottom-0 max-w-mobile-l mx-auto flex flex-col overflow-hidden bg-background">
        {/* スクロール可能なコンテンツ */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-4">
          {amountSection}

          <div className="relative">
            <Textarea
              autoFocus
              maxLength={100}
              placeholder={t("wallets.shared.transfer.commentPlaceholder")}
              value={comment}
              onChange={(e) => {
                if (e.target.value.length > 100) {
                  toast.error(t("wallets.shared.transfer.commentError"));
                  return;
                }
                setComment(e.target.value);
              }}
              className="focus:outline-none focus:ring-0 shadow-none min-h-[120px] pr-12 resize-none"
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {comment.length}/100
            </div>
          </div>

          {/* 画像サムネイル */}
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {imagePreviews.map((url, i) => (
                <div key={i} className="relative w-20 h-20 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover rounded-xl" />
                  <button
                    type="button"
                    aria-label={t("wallets.shared.transfer.removePhoto", { index: i + 1 })}
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 写真追加ボタン */}
          {images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <ImagePlus className="w-4 h-4" />
              {t("wallets.shared.transfer.addPhoto")}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleImageSelect}
          />
        </div>

        {/* 送信ボタン（下部固定） */}
        <div className="shrink-0 px-4 py-3 bg-background">
          <Button onClick={handleIssuePoint} disabled={isLoading || !isAuthReady || !isAmountValid} className="w-full">
            {t("adminWallet.issue.submit")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 top-16 bottom-0 max-w-mobile-l mx-auto flex flex-col overflow-hidden bg-background">
      {/* 金額入力エリア（60%） */}
      <div className="flex-[3] flex flex-col items-center justify-center gap-4 px-4">
        {amountSection}
        <Button onClick={() => setStep("confirm")} disabled={!isAmountValid} className="px-10 mt-2">
          {t("wallets.shared.transfer.nextLabel")}
        </Button>
      </div>

      {/* テンキー（40%） */}
      <div className="flex-[2] bg-muted/30">
        <Numpad
          onKey={handleKey}
          backspaceLabel={t("common.numpad.backspace")}
          clearLabel={t("common.numpad.clear")}
        />
      </div>
    </div>
  );
}
