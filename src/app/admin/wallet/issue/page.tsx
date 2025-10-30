"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTransactionMutations } from "@/app/admin/wallet/hooks/useTransactionMutations";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";
import { useTranslations } from "next-intl";

const PRESET_AMOUNTS = [1000000, 3000000, 5000000, 10000000, 30000000, 50000000];
const INT_LIMIT = 2000000000;

export default function IssuePointPage() {
  const t = useTranslations();
  const communityId = COMMUNITY_ID;
  const router = useRouter();

  const headerConfig = useMemo(
    () => ({
      title: t("adminWallet.issue.title"),
      showLogo: false,
      showBackButton: true,
    }),
    [t],
  );
  useHeaderConfig(headerConfig);

  const track = useAnalytics();

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
    if (raw === "") {
      setAmount(null);
      setDisplayValue("");
      return;
    }

    const num = Number(raw);
    if (isNaN(num)) {
      setAmount(null);
      setDisplayValue("");
      return;
    }
    if (num < 0) {
      toast.error(t("adminWallet.issue.validation.min"));
      return;
    }
    if (num > INT_LIMIT) {
      toast.error(t("adminWallet.issue.validation.max"));
      return;
    }
    setAmount(num);
    setDisplayValue(formatWithComma(num.toString()));
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
        track({
          name: "issue_point",
          params: { amount },
        });
        toast.success(t("adminWallet.issue.success"));
        router.push("/admin/wallet?refresh=true");
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
          disabled={!amount || amount <= 0 || amount > INT_LIMIT}
        >
          {t("adminWallet.issue.submit")}
        </Button>
      </footer>
    </>
  );
}
