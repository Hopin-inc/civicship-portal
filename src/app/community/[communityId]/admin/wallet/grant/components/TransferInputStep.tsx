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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Delete } from "lucide-react";

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

const NUMPAD_KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["AC", "0", "backspace"],
] as const;

function TransferInputStep({
  user,
  currentPoint,
  isLoading,
  isAuthReady = true,
  onSubmit,
  title,
  submitLabel,
  amountLabel,
}: Props) {
  const t = useTranslations();

  const finalTitle = title ?? t("wallets.shared.transfer.pageTitle");
  const finalSubmitLabel = submitLabel ?? t("wallets.shared.transfer.submitLabel");

  const headerConfig: HeaderConfig = useMemo(
    () => ({
      title: finalTitle,
      showLogo: false,
      showBackButton: true,
    }),
    [finalTitle],
  );
  useHeaderConfig(headerConfig);

  const [inputStr, setInputStr] = useState("");
  const [comment, setComment] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const numericAmount = parseInt(inputStr || "0", 10);
  const maxAmount = Math.min(Number(currentPoint), INT_LIMIT);
  const isAmountValid = numericAmount > 0 && numericAmount <= maxAmount;

  const handleKey = (key: string) => {
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

  return (
    <>
      {/* Colored header section */}
      <div className="bg-primary flex flex-col items-center justify-center gap-4 px-4 py-8 min-h-[45vh]">
        <div className="flex flex-col items-center gap-1">
          <Avatar className="w-10 h-10 border-2 border-white/30">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback className="bg-primary-foreground/20 text-white text-sm">
              {user.name?.[0] ?? "U"}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm text-primary-foreground/80">
            {t("wallets.shared.transfer.sendTo", {
              name: user.name ?? t("adminWallet.common.notSet"),
            })}
          </p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-bold text-white tabular-nums tracking-tight">
            {numericAmount.toLocaleString()}
          </span>
          <span className="text-2xl text-primary-foreground/70 font-medium">pt</span>
        </div>

        <p className="text-xs text-primary-foreground/60">
          {t("wallets.shared.transfer.balance")} {currentPoint.toLocaleString()} pt
        </p>

        <Button
          onClick={() => setSheetOpen(true)}
          disabled={!isAmountValid}
          className="bg-white text-primary hover:bg-white/90 font-semibold px-10 mt-2"
        >
          {t("wallets.shared.transfer.nextLabel")}
        </Button>
      </div>

      {/* Numpad */}
      <div className="bg-background px-6 pt-5 pb-6">
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {NUMPAD_KEYS.flat().map((key) => (
            <button
              key={key}
              onClick={() => handleKey(key)}
              className="flex items-center justify-center h-16 rounded-2xl bg-muted text-xl font-semibold text-foreground active:bg-muted/60 transition-colors select-none"
            >
              {key === "backspace" ? <Delete className="w-5 h-5" /> : key}
            </button>
          ))}
        </div>
      </div>

      {/* Confirmation bottom sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh]">
          <SheetHeader className="mb-4">
            <SheetTitle>{t("wallets.shared.transfer.commentLabel")}</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center py-3 border-b text-sm">
              <span className="text-muted-foreground">
                {amountLabel ?? t("wallets.shared.transfer.amountLabel")}
              </span>
              <span className="font-semibold">{numericAmount.toLocaleString()} pt</span>
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
                className="focus:outline-none focus:ring-0 shadow-none min-h-[120px] pr-12 resize-none"
              />
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {comment.length}/100
              </div>
            </div>

            <Button
              onClick={() => onSubmit(numericAmount, comment.trim() || undefined)}
              disabled={isLoading || !isAuthReady}
              className="w-full"
            >
              {finalSubmitLabel}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default TransferInputStep;
