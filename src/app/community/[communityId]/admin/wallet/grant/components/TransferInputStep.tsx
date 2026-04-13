"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { GqlUser } from "@/types/graphql";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { HeaderConfig } from "@/contexts/HeaderContext";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import Numpad, { NumpadKey } from "@/components/ui/numpad";

interface Props {
  user: GqlUser;
  currentPoint: bigint;
  isLoading: boolean;
  isAuthReady?: boolean;
  onBack: () => void;
  onSubmit: (amount: number, comment?: string) => void;
  title?: string;
  submitLabel?: string;
  backLabel?: string;
  amountLabel?: string;
}

const INT_LIMIT = 2000000000;

function TransferInputStep({
  user,
  currentPoint,
  isLoading,
  isAuthReady = true,
  onBack,
  onSubmit,
  title,
  submitLabel,
  amountLabel,
}: Props) {
  const t = useTranslations();

  const finalTitle = title ?? t("wallets.shared.transfer.pageTitle");
  const finalSubmitLabel = submitLabel ?? t("wallets.shared.transfer.submitLabel");

  const [step, setStep] = useState<"numpad" | "confirm">("numpad");

  const headerConfig: HeaderConfig = useMemo(
    () => ({
      title: finalTitle,
      showLogo: false,
      showBackButton: true,
      ...(step === "confirm" && { backTo: undefined }),
    }),
    [finalTitle, step],
  );
  useHeaderConfig(headerConfig);

  const [inputStr, setInputStr] = useState("");
  const [comment, setComment] = useState("");

  const numericAmount = parseInt(inputStr || "0", 10);
  const maxAmount = Math.min(Number(currentPoint), INT_LIMIT);
  const isAmountValid = numericAmount > 0 && numericAmount <= maxAmount;

  const handleKey = (key: NumpadKey) => {
    if (key === "AC") {
      setInputStr("");
      return;
    }
    if (key === "backspace") {
      setInputStr((prev) => prev.slice(0, -1));
      return;
    }
    const next = String(parseInt((inputStr || "") + key, 10));
    const parsed = parseInt(next, 10);
    if (parsed > Number(currentPoint)) {
      toast.error(t("wallets.shared.transfer.errorExceedsBalance"));
      return;
    }
    if (parsed > INT_LIMIT) {
      toast.error(t("wallets.shared.transfer.errorExceedsLimit"));
      return;
    }
    setInputStr(next);
  };

  if (step === "confirm") {
    return (
      <main className="flex items-center justify-center px-4">
        <div className="flex flex-col space-y-6 max-w-xl w-full">
          {/* 金額確認 */}
          <Item size="sm" variant="outline">
            <ItemContent>
              <ItemTitle>{amountLabel ?? t("wallets.shared.transfer.amountLabel")}</ItemTitle>
              <ItemDescription className="text-xs text-muted-foreground">
                {t("wallets.shared.transfer.balance")} {currentPoint.toLocaleString()} pt
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <span className="font-semibold tabular-nums">{numericAmount.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">pt</span>
            </ItemActions>
          </Item>

          {/* コメント */}
          <div className="w-full">
            <div className="text-sm font-medium mb-3">
              {t("wallets.shared.transfer.commentLabel")}
            </div>
            <div className="relative">
              <Textarea
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
                className="focus:outline-none focus:ring-0 shadow-none min-h-[160px] pr-12 resize-none"
              />
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {comment.length}/100
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex flex-col gap-2 w-full">
            <Button
              onClick={() => onSubmit(numericAmount, comment.trim() || undefined)}
              disabled={isLoading || !isAuthReady}
              className="w-full"
            >
              {finalSubmitLabel}
            </Button>
            <Button variant="text" size="sm" onClick={() => setStep("numpad")} className="w-full">
              {t("wallets.shared.transfer.backLabel")}
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="fixed inset-x-0 top-16 bottom-0 flex flex-col overflow-hidden bg-background">
      {/* 金額入力エリア（60%） */}
      <div className="flex-[3] flex flex-col items-center justify-center gap-4 px-4">
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

        <Button onClick={() => setStep("confirm")} disabled={!isAmountValid} className="px-10 mt-2">
          {t("wallets.shared.transfer.nextLabel")}
        </Button>
      </div>

      {/* テンキー（40%） */}
      <div className="flex-[2] bg-muted/30">
        <Numpad onKey={handleKey} />
      </div>
    </div>
  );
}

export default TransferInputStep;
