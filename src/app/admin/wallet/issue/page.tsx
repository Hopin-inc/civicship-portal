"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTransactionMutations } from "@/app/admin/wallet/hooks/useTransactionMutations";
import { COMMUNITY_ID } from "@/utils";
import useHeaderConfig from "@/hooks/useHeaderConfig";

const PRESET_AMOUNTS = [1000000, 3000000, 5000000, 10000000, 30000000, 50000000];

export default function IssuePointPage() {
  const communityId = COMMUNITY_ID;
  const router = useRouter();

  const headerConfig = useMemo(
    () => ({
      title: "ポイント発行",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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
    <>
      <main className="pb-24 min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center space-y-6 max-w-xl w-full">
          <Input
            type="text"
            placeholder="7,500,000"
            value={displayValue}
            onChange={handleInputChange}
            inputMode="numeric"
            className="text-5xl text-center py-6 h-20 border-0 border-b-2 border-input focus:outline-none focus:ring-0 shadow-none"
          />

          <div className="w-full">
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
        </div>
      </main>

      <footer className="fixed bottom-[120px] left-0 right-0 z-50 bg-background max-w-mobile-l w-full h-20 flex items-center px-4 py-4 justify-center mx-auto">
        <Button
          size="lg"
          className="w-full max-w-xl"
          onClick={handleIssuePoint}
          disabled={!amount || amount <= 0}
        >
          発行
        </Button>
      </footer>
    </>
  );
}
