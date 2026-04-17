"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GqlUser } from "@/types/graphql";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import type { HeaderConfig } from "@/components/providers/HeaderProvider";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import Numpad, { NumpadKey } from "@/components/ui/numpad";
import { ImagePlus, X } from "lucide-react";

const INT_LIMIT = 9_999_999;
const MAX_IMAGES = 4;

interface Props {
  user: GqlUser;
  currentPoint: bigint;
  isLoading: boolean;
  isAuthReady?: boolean;
  onBack: () => void;
  onSubmit: (amount: number, comment?: string, images?: File[]) => void;
  title?: string;
  submitLabel?: string;
}

function TransferInputStep({
  user,
  currentPoint,
  isLoading,
  isAuthReady = true,
  onBack,
  onSubmit,
  title,
  submitLabel,
}: Props) {
  const t = useTranslations();

  const finalTitle = title ?? t("wallets.shared.transfer.pageTitle");
  const finalSubmitLabel = submitLabel ?? t("wallets.shared.transfer.submitLabel");

  const [step, setStep] = useState<"numpad" | "confirm">("numpad");
  const [inputStr, setInputStr] = useState("");
  const inputStrRef = useRef("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const headerConfig: HeaderConfig = useMemo(
    () => ({
      title: finalTitle,
      showLogo: false,
      showBackButton: true,
      onBackClick: step === "confirm" ? () => setStep("numpad") : onBack,
    }),
    [finalTitle, step, onBack],
  );
  useHeaderConfig(headerConfig);

  const numericAmount = parseInt(inputStr || "0", 10);
  const maxAmount = Math.min(Number(currentPoint), INT_LIMIT);
  const isAmountValid = numericAmount > 0 && numericAmount <= maxAmount;

  // プレビューURL の生成と cleanup
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

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
    if (next > Number(currentPoint)) {
      toast.error(t("wallets.shared.transfer.errorExceedsBalance"));
      return;
    }
    if (next > INT_LIMIT) {
      toast.error(t("wallets.shared.transfer.errorExceedsLimit"));
      return;
    }
    const nextStr = String(next);
    inputStrRef.current = nextStr;
    setInputStr(nextStr);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (images.length + files.length > MAX_IMAGES) {
      toast.error(t("wallets.shared.transfer.photoLimit", { max: MAX_IMAGES }));
    }
    setImages((prev) => {
      const combined = [...prev, ...files];
      if (combined.length > MAX_IMAGES) {
        return combined.slice(0, MAX_IMAGES);
      }
      return combined;
    });
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // numpad ステップ用のユーザー表示
  const userSection = (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <Avatar className="w-10 h-10 border">
          <AvatarImage src={user.image || ""} alt={user.name || ""} />
          <AvatarFallback className="text-sm">{user.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>
        <p className="text-sm text-muted-foreground">
          {t("wallets.shared.transfer.sendTo", {
            name: user.name ?? t("adminWallet.common.notSet"),
          })}
        </p>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-6xl font-bold tabular-nums tracking-tight">
          {numericAmount.toLocaleString()}
        </span>
        <span className="text-2xl text-muted-foreground font-medium">pt</span>
      </div>
      <p className="text-xs text-muted-foreground">
        {t("wallets.shared.transfer.balance")} {currentPoint.toLocaleString()} pt
      </p>
    </div>
  );

  if (step === "confirm") {
    return (
      <div className="fixed inset-x-0 top-16 bottom-0 max-w-mobile-l mx-auto flex flex-col overflow-hidden bg-background">
        {/* コンパクトサマリー */}
        <div className="shrink-0 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border">
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback className="text-xs">{user.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">
              {t("wallets.shared.transfer.sendTo", {
                name: user.name ?? t("adminWallet.common.notSet"),
              })}
            </p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold tabular-nums">{numericAmount.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">pt</span>
          </div>
        </div>

        {/* スクロール可能なコンテンツ */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
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
              className="focus:outline-none focus:ring-0 shadow-none resize-none min-h-[120px] pr-12"
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {comment.length}/100
            </div>
          </div>

          {/* 画像サムネイル */}
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {imagePreviews.map((url, i) => (
                <div key={i} className="relative w-20 h-20 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    aria-label={t("wallets.shared.transfer.removePhoto", { index: i + 1 })}
                    onClick={() => removeImage(i)}
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
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"
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
          <Button
            onClick={() => onSubmit(numericAmount, comment.trim() || undefined, images.length > 0 ? images : undefined)}
            disabled={isLoading || !isAuthReady || !isAmountValid}
            className="w-full"
          >
            {finalSubmitLabel}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 top-16 bottom-0 max-w-mobile-l mx-auto flex flex-col overflow-hidden bg-background">
      {/* 金額入力エリア（60%） */}
      <div className="flex-[3] flex flex-col items-center justify-center gap-4 px-4">
        {userSection}
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

export default TransferInputStep;
