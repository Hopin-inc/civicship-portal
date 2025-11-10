"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { useTransactionMutations } from "@/app/admin/wallet/hooks/useTransactionMutations";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";
import { useTranslations } from "next-intl";

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

  const [amount, setAmount] = useState<number | null>(null);
  const [displayValue, setDisplayValue] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  const { issuePoint } = useTransactionMutations();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      setAmount(null);
      setDisplayValue("");
      return;
    }

    const num = Number(raw);
    if (isNaN(num)) return;
    if (num < 0) {
      toast.error(t("adminWallet.issue.validation.min"));
      return;
    }
    if (num > INT_LIMIT) {
      toast.error(t("adminWallet.issue.validation.max"));
      return;
    }
    setAmount(num);
    setDisplayValue(raw);
  };

  const handleIssuePoint = async () => {
    if (!amount || amount <= 0) return;
    try {
      const res = await issuePoint({
        input: { transferPoints: amount, comment: comment.trim() || undefined },
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

  return (
    <>
      <main className="flex items-center justify-center px-4">
        <div className="flex flex-col items-center space-y-6 max-w-xl w-full mt-6">
          <section className="w-full">
            <div>
              <Label className="text-label-md font-medium">{t("wallets.shared.transfer.amountLabel")}</Label>
              <span className="text-label-xs rounded-full px-2 py-[2px] ml-2 bg-primary-foreground text-primary font-bold">
                {t("wallets.shared.transfer.required")}
              </span>
            </div>
            <Input
              type="text"
              placeholder="1000pt"
              value={displayValue}
              onChange={handleInputChange}
              inputMode="numeric"
              className="mt-3 focus:outline-none focus:ring-0 shadow-none"
            />

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
              size="lg"
              className="w-full"
              onClick={handleIssuePoint}
              disabled={!amount || amount <= 0 || amount > INT_LIMIT}
            >
              {t("adminWallet.issue.submit")}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
