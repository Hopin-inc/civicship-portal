"use client";

import { useMemo, useState } from "react";
import { useAppRouter } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { useTransactionMutations } from "@/app/community/[communityId]/admin/wallet/hooks/useTransactionMutations";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";
import { useTranslations } from "next-intl";
import Numpad, { NumpadKey } from "@/components/ui/numpad";
import { errorMessages } from "@/utils/errorMessage";

const INT_LIMIT = 2000000000;

export default function IssuePointPage() {
  const t = useTranslations();
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId ?? "";
  const router = useAppRouter();
  const track = useAnalytics();

  const [step, setStep] = useState<"numpad" | "confirm">("numpad");
  const [inputStr, setInputStr] = useState("");
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const headerConfig = useMemo(
    () => ({
      title: t("adminWallet.issue.title"),
      showLogo: false,
      showBackButton: true,
      onBackClick: step === "confirm" ? () => setStep("numpad") : undefined,
    }),
    [t, step],
  );
  useHeaderConfig(headerConfig);

  const { issuePoint } = useTransactionMutations();

  const numericAmount = parseInt(inputStr || "0", 10);
  const isAmountValid = numericAmount > 0 && numericAmount <= INT_LIMIT;

  const handleKey = (key: NumpadKey) => {
    if (key === "AC") {
      setInputStr("");
      return;
    }
    if (key === "backspace") {
      setInputStr((prev) => prev.slice(0, -1));
      return;
    }
    // Validate against current render value first (for toast), then update
    // functionally from prev to avoid stale closure on rapid taps
    const parsed = parseInt((inputStr || "") + key, 10);
    if (parsed > INT_LIMIT) {
      toast.error(t("adminWallet.issue.validation.max"));
      return;
    }
    setInputStr((prev) => {
      const next = parseInt((prev || "") + key, 10);
      return next > INT_LIMIT ? prev : String(next);
    });
  };

  const handleIssuePoint = async () => {
    if (!isAmountValid) return;
    setIsLoading(true);
    try {
      const res = await issuePoint({
        input: { transferPoints: numericAmount, comment: comment.trim() || undefined },
        permission: { communityId },
      });

      if (res.success) {
        track({ name: "issue_point", params: { amount: numericAmount } });
        toast.success(t("adminWallet.issue.success"));
        router.push("/admin/wallet?refresh=true");
      } else {
        const errorMessage = errorMessages[res.code] ?? t("adminWallet.issue.errorGeneric");
        toast.error(errorMessage);
      }
    } catch {
      toast.error(t("adminWallet.issue.errorGeneric"));
    } finally {
      setIsLoading(false);
    }
  };

  const amountSection = (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">{t("adminWallet.issue.title")}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-6xl font-bold tabular-nums tracking-tight">
          {numericAmount.toLocaleString()}
        </span>
        <span className="text-2xl text-muted-foreground font-medium">pt</span>
      </div>
    </div>
  );

  if (step === "confirm") {
    return (
      <main className="flex flex-col items-center px-4 pt-8 gap-6 max-w-xl mx-auto w-full">
        {amountSection}

        <div className="w-full">
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

        <Button onClick={handleIssuePoint} disabled={isLoading} className="w-full">
          {t("adminWallet.issue.submit")}
        </Button>
      </main>
    );
  }

  return (
    <div className="fixed inset-x-0 top-16 bottom-0 max-w-mobile-l mx-auto flex flex-col overflow-hidden bg-background">
      {/* 金額入力エリア（60%） */}
      <div className="flex-[3] flex flex-col items-center justify-center gap-4 px-4">
        {amountSection}
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
