"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GqlUser } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";

const PRESET_AMOUNTS = [100000, 300000, 500000, 1000000];

interface Props {
  user: GqlUser;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (amount: number) => void;
}

function GrantInputStep({ user, isLoading, onBack, onSubmit }: Props) {
  const [amount, setAmount] = useState<number | null>(null);
  const [displayValue, setDisplayValue] = useState<string>("");

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
      setAmount(num);
      setDisplayValue(formatWithComma(raw));
    }
  };

  const handlePresetClick = (value: number) => {
    setAmount(value);
    setDisplayValue(formatWithComma(value));
  };

  const formatAsManUnit = (value: number) => `+${value / 10000}万pt`;

  return (
    <>
      <div className="flex items-center gap-3 px-4">
        <Image
          src={user.image ?? PLACEHOLDER_IMAGE}
          alt={user.name ?? "要確認"}
          width={40}
          height={40}
          className="rounded-full object-cover border"
          style={{ aspectRatio: "1 / 1" }}
        />
        <div className="flex flex-col">
          <span className="text-base font-medium">{user.name}</span>
          <span className="text-muted-foreground text-sm">にポイントを渡す</span>
        </div>
      </div>

      <div className="px-4 space-y-2">
        <label className="text-sm font-medium text-muted-foreground">ポイント数</label>
        <Input
          type="text"
          placeholder="7,500,000"
          value={displayValue}
          onChange={handleInputChange}
          inputMode="numeric"
        />

        <div className="flex gap-x-3 overflow-x-auto scrollbar-none pb-1">
          {PRESET_AMOUNTS.map((value) => (
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

        <div className="flex gap-2 mt-2">
          <Button variant="tertiary" onClick={onBack} className="flex-1">
            戻る
          </Button>
          <Button
            onClick={() => amount && amount > 0 && onSubmit(amount)}
            disabled={!amount || amount <= 0 || isLoading}
            className="flex-1"
          >
            渡す
          </Button>
        </div>
      </div>
    </>
  );
}

export default GrantInputStep;
