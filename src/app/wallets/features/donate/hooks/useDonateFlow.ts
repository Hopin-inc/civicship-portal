"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";
import { useDonatePoint } from "@/app/wallets/features/donate/hooks";
import { toast } from "sonner";
import { GqlUser } from "@/types/graphql";

export function useDonateFlow(currentUser?: GqlUser | null, currentPoint?: bigint) {
  const router = useRouter();
  const track = useAnalytics();
  const { donate, isLoading } = useDonatePoint();
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
            fromUser: { userId: currentUser.id, name: currentUser.name ?? "未設定" },
            toUser: { userId: selectedUser.id, name: selectedUser.name ?? "未設定" },
            amount,
          },
        });

        toast.success(`${amount.toLocaleString()} pt をあげました`);
        router.push("/wallets/me?refresh=true");
      } else {
        toast.error(`送信失敗: ${res.code}`);
      }
    } catch {
      toast.error("ポイントを送れませんでした");
    }
  };

  return {
    selectedUser,
    setSelectedUser,
    handleDonate,
    isLoading,
    currentPoint,
  };
}
