"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";
import { useDonatePoint } from "@/app/wallets/features/donate/hooks";
import { toast } from "react-toastify";
import { GqlUser } from "@/types/graphql";
import { useTranslations } from "next-intl";
import { errorMessages } from "@/utils/errorMessage";

export function useDonateFlow(currentUser?: GqlUser | null, currentPoint?: bigint) {
  const t = useTranslations();
  const router = useRouter();
  const track = useAnalytics();
  const { donate, isLoading, isAuthReady } = useDonatePoint();
  const [selectedUser, setSelectedUser] = useState<GqlUser | null>(null);

  const handleDonate = async (amount: number, comment?: string) => {
    if (!selectedUser || !currentUser?.id) return;

    try {
      const res = await donate({
        toUserId: selectedUser.id,
        amount,
        comment,
        fromUserId: currentUser.id,
      });

      if (res.success) {
        track({
          name: "donate_point",
          params: {
            fromUser: { userId: currentUser.id, name: currentUser.name ?? t("users.shared.unnamed") },
            toUser: { userId: selectedUser.id, name: selectedUser.name ?? t("users.shared.unnamed") },
            amount,
          },
        });

        toast.success(t("wallets.donate.toast.success", { amount: amount.toLocaleString() }));
        router.push("/wallets/me?refresh=true");
      } else {
        const errorMessage = errorMessages[res.code] ?? t("wallets.donate.toast.genericError");
        toast.error(errorMessage);
      }
    } catch {
      toast.error(t("wallets.donate.toast.genericError"));
    }
  };

  return {
    selectedUser,
    setSelectedUser,
    handleDonate,
    isLoading,
    isAuthReady,
    currentPoint,
  };
}
