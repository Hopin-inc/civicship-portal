"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GqlDidIssuanceStatus, GqlUser } from "@/types/graphql";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { HeaderConfig } from "@/contexts/HeaderContext";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { truncateText } from "@/utils/stringUtils";
import { useTranslations } from "next-intl";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { useNumberInput } from "@/hooks/useNumberInput";

interface Props {
  user: GqlUser;
  currentPoint: bigint;
  isLoading: boolean;
  isAuthReady?: boolean;
  onBack: () => void;
  onSubmit: (amount: number, comment?: string) => void;
  title?: string;
  recipientKey?: string;
  submitLabel?: string;
  backLabel?: string;
  amountLabel?: string;
}

const INT_LIMIT = 2000000000;

function TransferInputStep({
  user,
  currentPoint,
  isLoading,
  isAuthReady = true,
  onBack,
  onSubmit,
  title,
  submitLabel,
  backLabel,
  amountLabel,
}: Props) {
  const t = useTranslations();

  const finalTitle = title ?? t("wallets.shared.transfer.pageTitle");
  const finalSubmitLabel = submitLabel ?? t("wallets.shared.transfer.submitLabel");
  const finalBackLabel = backLabel ?? t("wallets.shared.transfer.backLabel");

  const headerConfig: HeaderConfig = useMemo(
    () => ({
      title: finalTitle,
      showLogo: false,
      showBackButton: true,
    }),
    [finalTitle],
  );
  useHeaderConfig(headerConfig);

  const didValue = user.didIssuanceRequests?.find(
    (req) => req?.status === GqlDidIssuanceStatus.Completed,
  )?.didValue;

  const [amount, setAmount] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  // useNumberInput フックを使用
  const amountInput = useNumberInput({
    value: amount,
    onChange: (newValue: number) => {
      // 残高チェック
      if (newValue > Number(currentPoint)) {
        toast.error(t("wallets.shared.transfer.errorExceedsBalance"));
        return;
      }
      // 上限チェック
      if (newValue > INT_LIMIT) {
        toast.error(t("wallets.shared.transfer.errorExceedsLimit"));
        return;
      }
      setAmount(newValue);
    },
    min: 1,
    max: Math.min(Number(currentPoint), INT_LIMIT),
    defaultValue: 0,
  });

  return (
    <>
      <main className="flex items-center justify-center px-4">
        <div className="flex flex-col space-y-6 max-w-xl w-full">
          {/* 送付相手（確認情報） */}
          <div className="flex flex-col items-center gap-2 w-full text-center">
            <Avatar className="w-10 h-10 rounded-full border">
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1">
              <div className="text-sm font-medium">
                {user.name ?? t("adminWallet.common.notSet")} に送る
              </div>

              {didValue && (
                <div className="text-xs text-muted-foreground">
                  {truncateText(didValue, 20, "middle")}
                </div>
              )}
            </div>
          </div>

          {/* ポイント数（条件） */}
          <div className="space-y-3 w-full">
            <Item size="sm" variant={"outline"}>
              <ItemContent>
                <ItemTitle>{amountLabel ?? t("wallets.shared.transfer.amountLabel")}</ItemTitle>
                <ItemDescription className="text-xs text-muted-foreground">
                  {t("wallets.shared.transfer.balance")} {currentPoint.toLocaleString()} pt
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Input
                  type="number"
                  min="1"
                  value={amountInput.displayValue}
                  onChange={amountInput.handleChange}
                  onBlur={amountInput.handleBlur}
                  autoFocus
                  className="w-32 text-right"
                />
                <span className="text-sm text-muted-foreground">pt</span>
              </ItemActions>
            </Item>
          </div>

          {/* コメント */}
          <div className="w-full">
            <div className="text-sm font-medium mb-3">
              {t("wallets.shared.transfer.commentLabel")}
            </div>
            <div className="relative">
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
                className="focus:outline-none focus:ring-0 shadow-none min-h-[160px] pr-12"
              />
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {comment.length}/100
              </div>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex flex-col gap-2 w-full">
            <Button
              onClick={() => {
                if (amount > 0 && amount <= Number(currentPoint)) {
                  onSubmit(amount, comment.trim() || undefined);
                }
              }}
              disabled={
                amount <= 0 ||
                amount > Number(currentPoint) ||
                amount > INT_LIMIT ||
                isLoading ||
                !isAuthReady
              }
              className="w-full"
            >
              {finalSubmitLabel}
            </Button>
            <Button variant="text" size="sm" onClick={onBack} className="w-full">
              {finalBackLabel}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

export default TransferInputStep;
