"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GqlUser } from "@/types/graphql";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { HeaderConfig } from "@/contexts/HeaderContext";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  user: GqlUser;
  currentPoint: bigint;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (amount: number) => void;
  title?: string;
  recipientLabel?: string;
  submitLabel?: string;
  backLabel?: string;
  presetAmounts?: number[]; // ← 追加
}

const DEFAULT_PRESET_AMOUNTS = [100000, 300000, 500000, 1000000];
const INT_LIMIT = 2000000000;

function TransferInputStep({
  user,
  currentPoint,
  isLoading,
  onBack,
  onSubmit,
  title = "ポイントを支給する",
  recipientLabel = "支給する相手",
  submitLabel = "支給",
  backLabel = "支給先を選び直す",
  presetAmounts,
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

  const amounts = presetAmounts ?? DEFAULT_PRESET_AMOUNTS;

  const [amount, setAmount] = useState<number | null>(null);
  const [displayValue, setDisplayValue] = useState<string>("");

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

  const handlePresetClick = (value: number) => {
    if (value > currentPoint) {
      toast.error("保有ポイントを超えています");
      return;
    }
    setAmount(value);
    setDisplayValue(formatWithComma(value));
  };

  const formatAsManUnit = (value: number) =>
    value < 10000 ? `+${value.toLocaleString()}pt` : `+${value / 10000}万pt`;

  return (
    <>
      <main className="pb-32 min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center space-y-6 max-w-xl w-full">
          <div className="flex items-center gap-3 w-full">
            <Avatar className="w-10 h-10 rounded-full border object-cover">
              <AvatarImage src={user.image || ""} alt={user.name ?? "要確認"} />
              <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">{recipientLabel}</span>
              <span className="text-base font-medium">{user.name}</span>
            </div>
          </div>

          <Input
            type="text"
            placeholder="7,500,000"
            value={displayValue}
            onChange={handleInputChange}
            inputMode="numeric"
            className="text-5xl text-center py-6 h-20 border-0 border-b-2 border-input focus:outline-none focus:ring-0 shadow-none"
          />
          <div className="text-sm text-muted-foreground text-center">
            残高：{currentPoint.toLocaleString()} pt
          </div>

          <div className="w-full">
            <div className="flex gap-x-3 overflow-x-auto scrollbar-none pb-1">
              {amounts.map((value) => (
                <Button
                  key={value}
                  variant={amount === value ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => handlePresetClick(value)}
                  className="min-w-[100px] flex-shrink-0"
                >
                  {formatAsManUnit(value)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-[120px] left-0 right-0 z-50 bg-background max-w-mobile-l w-full px-4 py-4 mx-auto">
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => amount && amount > 0 && amount <= currentPoint && onSubmit(amount)}
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
