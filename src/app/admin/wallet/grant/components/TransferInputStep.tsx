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

interface Props {
  user: GqlUser;
  currentPoint: bigint;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (amount: number, comment?: string) => void;
  title?: string;
  recipientLabel?: string;
  submitLabel?: string;
  backLabel?: string;
  presetAmounts?: number[]; // ← 追加
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
  submitLabel = "支給する",
  backLabel = "支給先を選び直す",
}: Props) {
  const headerConfig: HeaderConfig = useMemo(
    () => ({
      title,
      showLogo: true,
      showBackButton: false,
    }),
    [title],
  );
  useHeaderConfig(headerConfig);
  const didValue = user.didIssuanceRequests?.find(req => req?.status === GqlDidIssuanceStatus.Completed)?.didValue ?? "did発行中";

  const [amount, setAmount] = useState<number | null>(null);
  const [displayValue, setDisplayValue] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const formatWithComma = (value: string | number) => {
    const num = typeof value === "number" ? value : Number(value.replace(/,/g, ""));
    if (isNaN(num)) return "";
    return new Intl.NumberFormat().format(num);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");
    const num = Number(raw);
    if (isNaN(num)) {
      setAmount(null);
      setDisplayValue("");
    } else {
      if (num > currentPoint) {
        toast.error("保有ポイントを超えています");
        return;
      }
      if (num > INT_LIMIT) {
        toast.error("20億以下を指定して下さい");
        return;
      }
      setAmount(num);
      setDisplayValue(formatWithComma(raw));
    }
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
                <div className="flex items-center gap-1">
                  <span className="text-label-sm font-bold">{user.name}</span>
                  <span className="text-label-xs font-bold">{recipientLabel}</span>
                </div>
                <span className="text-label-xs text-caption mt-1">{ didValue?.length ? truncateText(didValue, 20, "middle") : "did取得中"}</span>
              </div>
            </div>
          </Card>
          <section className="w-full">
            <div>
              <Label className="text-label-md font-medium">支給ポイント</Label>
              <span className="text-label-xs rounded-full px-2 py-[2px] ml-2 bg-primary-foreground text-primary font-bold">
                必須
              </span>
            </div>
            <Input
                type="text"
                placeholder="1,000pt"
                value={displayValue}
                onChange={handleInputChange}
                className="mt-3 focus:outline-none focus:ring-0 shadow-none"
            />
            <div className="text-sm text-muted-foreground text-left mt-3">
              残高 {currentPoint.toLocaleString()} pt
            </div>
            <div className="mt-6">
              <Label className="text-label-md font-medium">コメント</Label>
              <div className="relative mt-3">
                <Textarea
                  maxLength={100}
                  placeholder="例）草刈り手伝ってくれてありがとう！"
                  value={comment}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue.length > 100) {
                      toast.error("100文字以内で入力してください");
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
        </div>
      </main>

      <footer className="fixed bottom-[40px] left-0 right-0 z-50 bg-background max-w-mobile-l w-full px-4 py-4 mx-auto">
        <div className="flex flex-col gap-2">
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
      </footer>
    </>
  );
}

export default TransferInputStep;
