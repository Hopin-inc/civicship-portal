"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Item, ItemActions, ItemContent, ItemFooter, ItemTitle } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GqlIncentiveGrant } from "@/types/graphql";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { SIGNUP_BONUS_RETRY } from "@/graphql/account/community/mutation";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

interface FailedBonusItemProps {
  bonus: GqlIncentiveGrant;
  onRetrySuccess: () => void;
}

export default function FailedBonusItem({ bonus, onRetrySuccess }: FailedBonusItemProps) {
  const t = useTranslations();
  const [retrying, setRetrying] = useState(false);

  const [retryGrant] = useMutation(SIGNUP_BONUS_RETRY);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      const { data } = await retryGrant({
        variables: { incentiveGrantId: bonus.id, communityId: COMMUNITY_ID },
      });

      if (data?.incentiveGrantRetry) {
        toast.success(t("adminWallet.settings.pending.retrySuccess"));
        onRetrySuccess();
      } else {
        toast.error(t("adminWallet.settings.pending.retryError"));
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
            <div className="text-xs flex items-center truncate">
              <span className="text-destructive font-medium">
                {getFailureReasonText(bonus.failureCode)}
              </span>
              <span className="text-muted-foreground">・</span>
              <span className="text-muted-foreground">
                {t("adminWallet.settings.pending.attempts", { count: bonus.attemptCount || 0 })}
              </span>
            </div>
          </ItemFooter>
        </div>
      </div>

      <ItemActions>
        <Button variant="primary" size="sm" onClick={handleRetry} disabled={retrying}>
          {retrying
            ? t("adminWallet.settings.pending.retrying")
            : t("adminWallet.settings.pending.retry")}
        </Button>
      </ItemActions>
    </Item>
  );
}
