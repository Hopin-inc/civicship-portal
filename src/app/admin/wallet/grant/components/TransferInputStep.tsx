"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GqlDidIssuanceStatus, GqlUser } from "@/types/graphql";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { HeaderConfig } from "@/contexts/HeaderContext";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { truncateText } from "@/utils/stringUtils";
import { useTranslations } from "next-intl";

interface Props {
  user: GqlUser;
  currentPoint: bigint;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (amount: number, comment?: string) => void;
  title?: string;
  recipientLabel?: string;
  recipientKey?: string;
  submitLabel?: string;
  backLabel?: string;
  amountLabel?: string;
  presetAmounts?: number[];
}

const INT_LIMIT = 2000000000;

function TransferInputStep({
  user,
  currentPoint,
  isLoading,
  onBack,
  onSubmit,
  title = "ポイントを支給する",
  recipientLabel = "に支給",
  recipientKey,
  submitLabel = "支給する",
  backLabel = "支給先を選び直す",
  amountLabel,
}: Props) {
  const t = useTranslations();
  const headerConfig: HeaderConfig = useMemo(
    () => ({
      title,
      showLogo: true,
      showBackButton: false,
    }),
    [title],
  );
  useHeaderConfig(headerConfig);
  const didValue = user.didIssuanceRequests?.find(req => req?.status === GqlDidIssuanceStatus.Completed)?.didValue;

  const recipientDisplay = recipientKey
    ? t.rich(recipientKey, {
        b: (chunks) => <span className="text-label-sm font-bold">{chunks}</span>,
        name: user.name,
      })
    : (
        <>
          <span className="text-label-sm font-bold">{user.name}</span>
          <span className="text-label-xs font-bold">{recipientLabel}</span>
        </>
      );

  const [amount, setAmount] = useState<number | null>(null);
  const [displayValue, setDisplayValue] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    
    if (raw === "") {
      setAmount(null);
      setDisplayValue("");
      return;
    }
    
    const num = Number(raw);
    if (isNaN(num)) {
      return; // 数字以外の入力は無視
    }
    
    if (num > currentPoint) {
      toast.error(t("wallets.shared.transfer.errorExceedsBalance"));
      return;
    }
    if (num > INT_LIMIT) {
      toast.error(t("wallets.shared.transfer.errorExceedsLimit"));
      return;
    }
    
    setAmount(num);
    setDisplayValue(raw);
  };

  return (
    <>
      <main className="flex items-center justify-center px-4">
        <div className="flex flex-col items-center space-y-6 max-w-xl w-full">
          <Card className="items-center gap-3 w-full border p-4">
            <div className="flex items-center gap-3 w-full">
              <Avatar className="w-10 h-10 rounded-full border object-cover">
                <AvatarImage src={user.image || ""} alt={user.name ?? "要確認"} />
                <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-label-xs font-bold">
                  {recipientDisplay}
                </div>
                {didValue && <span className="text-label-xs text-caption mt-1">{truncateText(didValue, 20, "middle")}</span>}
              </div>
            </div>
          </Card>
          <section className="w-full">
            <div>
              <Label className="text-label-md font-medium">{amountLabel ?? t("wallets.shared.transfer.amountLabel")}</Label>
              <span className="text-label-xs rounded-full px-2 py-[2px] ml-2 bg-primary-foreground text-primary font-bold">
                {t("wallets.shared.transfer.required")}
              </span>
            </div>
            <Input
                type="text"
                inputMode="numeric"
                placeholder="1000pt"
                value={displayValue}
                onChange={handleInputChange}
                className="mt-3 focus:outline-none focus:ring-0 shadow-none"
            />
            <div className="text-sm text-muted-foreground text-left mt-3">
              {t("wallets.shared.transfer.balance")} {currentPoint.toLocaleString()} pt
            </div>
            <div className="mt-6">
              <Label className="text-label-md font-medium">{t("wallets.shared.transfer.commentLabel")}</Label>
              <div className="relative mt-3">
                <Textarea
                  maxLength={100}
                  placeholder={t("wallets.shared.transfer.commentPlaceholder")}
                  value={comment}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue.length > 100) {
                      toast.error(t("wallets.shared.transfer.commentError"));
                      return;
                    }
                    setComment(newValue);
                  }}
                  className="focus:outline-none focus:ring-0 shadow-none min-h-[120px] pr-12"
                />
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                  {comment.length}/100
                </div>
              </div>
            </div>
          </section>
          
          <div className="flex flex-col gap-2 w-full mt-6">
            <Button
              onClick={() => amount && amount > 0 && amount <= currentPoint && onSubmit(amount, comment.trim() || undefined)}
              disabled={
                !amount || amount <= 0 || amount > currentPoint || isLoading || amount > INT_LIMIT
              }
              className="w-full"
            >
              {submitLabel}
            </Button>
            <Button variant="text" size="sm" onClick={onBack} className="w-full">
              {backLabel}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

export default TransferInputStep;
