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
  const { donatePoint, isAuthReady } = useTransactionMutations();
  // Use runtime communityId from CommunityConfigContext
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId || "";

  const donate = async ({ toUserId, amount, comment, fromUserId }: DonatePointInput) => {
    setIsLoading(true);
    try {
      return await donatePoint({
        input: {
          communityId: communityId,
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
