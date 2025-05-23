"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTransactionMutations } from "@/app/admin/wallet/hooks/useTransactionMutations";
import { COMMUNITY_ID } from "@/utils";
import useHeaderConfig from "@/hooks/useHeaderConfig";

const PRESET_AMOUNTS = [1000000, 3000000, 5000000, 10000000];

export default function IssuePointPage() {
  const communityId = COMMUNITY_ID;
  const router = useRouter();

  const headerConfig = useMemo(
    () => ({
      title: "ポイントを増やす",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const [amount, setAmount] = useState<number | null>(null);
  const [displayValue, setDisplayValue] = useState<string>("");

  const { issuePoint } = useTransactionMutations();

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

  const handleIssuePoint = async () => {
    if (!amount || amount <= 0) return;
    try {
      const res = await issuePoint({
        input: { transferPoints: amount },
        permission: { communityId },
      });

      if (res.success) {
        toast.success("ポイントを発行しました");
        router.push("/admin/wallet");
      }
    } catch (err) {
      toast.error;
    }
  };

  const formatAsManUnit = (value: number) => {
    return `+${value / 10000}万pt`;
  };

  return (
    <div className="flex flex-col min-h-screen max-w-xl mx-auto pt-8 pb-[96px] space-y-6">
      <div className="px-4">
        <Input
          type="text"
          placeholder="7,500,000"
          value={displayValue}
          onChange={handleInputChange}
          inputMode="numeric"
        />
      </div>

      <div className="space-y-2 px-4">
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
      </div>

      <div className="px-4">
        <Button
          onClick={handleIssuePoint}
          disabled={!amount || amount <= 0}
          className="w-full h-12 text-base"
        >
          発行
        </Button>
      </div>
    </div>
  );
}
