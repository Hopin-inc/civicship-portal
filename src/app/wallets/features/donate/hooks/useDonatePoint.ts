"use client";

import { useState } from "react";
import { useTransactionMutations } from "@/app/admin/wallet/hooks/useTransactionMutations";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

interface DonatePointInput {
  toUserId: string;
  amount: number;
  comment?: string;
  fromUserId: string;
}

export function useDonatePoint() {
  const [isLoading, setIsLoading] = useState(false);
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId ?? "";
  const { donatePoint, isAuthReady } = useTransactionMutations();

  const donate = async ({ toUserId, amount, comment, fromUserId }: DonatePointInput) => {
    setIsLoading(true);
    try {
      return await donatePoint({
        input: {
          communityId,
          transferPoints: amount,
          toUserId,
          comment,
        },
        permission: { userId: fromUserId },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    donate,
    isLoading,
    isAuthReady,
  };
}
