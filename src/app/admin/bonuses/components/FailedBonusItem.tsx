"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Item, ItemContent, ItemTitle, ItemFooter, ItemActions } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GqlSignupBonus } from "@/types/graphql";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { RETRY_SIGNUP_BONUS_GRANT } from "@/graphql/account/community/mutation";

interface FailedBonusItemProps {
  bonus: GqlSignupBonus;
  onRetrySuccess: () => void;
}

export default function FailedBonusItem({ bonus, onRetrySuccess }: FailedBonusItemProps) {
  const t = useTranslations();
  const [retrying, setRetrying] = useState(false);

  const [retryGrant] = useMutation(RETRY_SIGNUP_BONUS_GRANT);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      const { data } = await retryGrant({
        variables: { grantId: bonus.id },
      });

      if (data?.retrySignupBonusGrant?.success) {
        toast.success(t("adminWallet.settings.pending.retrySuccess"));
        onRetrySuccess();
      } else {
        toast.error(
          data?.retrySignupBonusGrant?.error ||
            t("adminWallet.settings.pending.retryError")
        );
      }
    } catch (e) {
      toast.error(t("adminWallet.settings.pending.retryError"));
    } finally {
      setRetrying(false);
    }
  };

  const getFailureReasonText = (code: string | null | undefined) => {
    if (!code) {
      return t("adminWallet.settings.pending.failureReason.unknown");
    }

    const key = `adminWallet.settings.pending.failureReason.${code}`;
    const translated = t(key);

    // If translation key doesn't exist, fall back to unknown
    if (translated === key) {
      return t("adminWallet.settings.pending.failureReason.unknown");
    }

    return translated;
  };

  return (
    <Item>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Avatar className="flex-shrink-0">
          <AvatarImage src={bonus.user?.image || ""} />
          <AvatarFallback>{bonus.user?.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <ItemContent>
            <ItemTitle className="truncate font-bold text-sm">
              {bonus.user?.name || "Unknown"}
            </ItemTitle>
          </ItemContent>

          <ItemFooter className="mt-1">
            <div className="text-xs text-muted-foreground flex items-center gap-2 truncate">
              <span>{getFailureReasonText(bonus.failureCode)}</span>
              <span>・</span>
              <span>{bonus.attemptCount || 0}回試行</span>
            </div>
          </ItemFooter>
        </div>
      </div>

      <ItemActions>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRetry}
          disabled={retrying}
        >
          {retrying ? "再試行中..." : t("adminWallet.settings.pending.retry")}
        </Button>
      </ItemActions>
    </Item>
  );
}
