"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ApolloError } from "@apollo/client";
import { Item, ItemActions, ItemContent, ItemFooter, ItemTitle } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GqlErrorCode,
  GqlIncentiveGrantFailureCode,
  useIncentiveGrantRetryMutation,
} from "@/types/graphql";
import { toast } from "react-toastify";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

interface FailedBonusItemProps {
  bonus: {
    id: string;
    failureCode?: GqlIncentiveGrantFailureCode | null;
    attemptCount: number;
    user?: {
      name?: string | null;
      image?: string | null;
    } | null;
  };
  onRetrySuccess: () => void;
}

export default function FailedBonusItem({ bonus, onRetrySuccess }: FailedBonusItemProps) {
  const t = useTranslations();
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId;
  const [retrying, setRetrying] = useState(false);

  const [retryGrant] = useIncentiveGrantRetryMutation();

  const handleRetry = async () => {
    if (!communityId) {
      toast.error(t("adminWallet.settings.pending.retryError.generic"));
      return;
    }

    setRetrying(true);
    try {
      const { data } = await retryGrant({
        variables: { incentiveGrantId: bonus.id, communityId },
      });

      if (data?.incentiveGrantRetry) {
        toast.success(t("adminWallet.settings.pending.retrySuccess"));
        onRetrySuccess();
      } else {
        toast.error(t("adminWallet.settings.pending.retryError.generic"));
      }
    } catch (error) {
      if (error instanceof ApolloError) {
        const errorCode = error.graphQLErrors[0]?.extensions?.code as GqlErrorCode | undefined;

        const messageKey = errorCode
          ? `adminWallet.settings.pending.retryError.${errorCode}`
          : "adminWallet.settings.pending.retryError.generic";

        const message = t(messageKey);

        // 翻訳が存在しない場合は generic にフォールバック
        toast.error(
          message !== messageKey ? message : t("adminWallet.settings.pending.retryError.generic"),
        );
      } else {
        toast.error(t("adminWallet.settings.pending.retryError.generic"));
      }
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
