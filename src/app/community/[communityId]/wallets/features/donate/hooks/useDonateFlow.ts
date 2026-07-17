"use client";

import { useState } from "react";
import { useAppRouter } from "@/lib/navigation";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";
import { useDonatePoint } from "@/app/community/[communityId]/wallets/features/donate/hooks/index";
import { toast } from "react-toastify";
import { GqlUser } from "@/types/graphql";
import { useTranslations } from "next-intl";
import { errorMessages } from "@/utils/errorMessage";

export function useDonateFlow(currentUser?: GqlUser | null, currentPoint?: bigint) {
  const t = useTranslations();
  const router = useAppRouter();
  const track = useAnalytics();
  const { donate, isLoading: isDonating, isAuthReady } = useDonatePoint();
  const [selectedUser, setSelectedUserState] = useState<GqlUser | null>(null);
  // 送付先がコミュニティ財布 (CONTRIBUTION) かどうか。true のとき toUserId を省略する
  const [isCommunityRecipient, setIsCommunityRecipient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 通常のメンバー選択。コミュニティ送付フラグは解除する
  const setSelectedUser = (user: GqlUser | null) => {
    setIsCommunityRecipient(false);
    setSelectedUserState(user);
  };

  // コミュニティ財布への送付を選択。表示用に疑似ユーザー (コミュニティ名/ロゴ) を保持する
  const selectCommunity = (community: GqlUser) => {
    setIsCommunityRecipient(true);
    setSelectedUserState(community);
  };

  const handleDonate = async (amount: number, comment?: string, images?: File[]) => {
    if (!selectedUser || !currentUser?.id) return;
    setIsSubmitting(true);

    try {
      const res = await donate({
        toUserId: isCommunityRecipient ? undefined : selectedUser.id,
        amount,
        comment,
        fromUserId: currentUser.id,
        images,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedUser,
    setSelectedUser,
    selectCommunity,
    isCommunityRecipient,
    handleDonate,
    isLoading: isDonating || isSubmitting,
    isAuthReady,
    currentPoint,
  };
}
