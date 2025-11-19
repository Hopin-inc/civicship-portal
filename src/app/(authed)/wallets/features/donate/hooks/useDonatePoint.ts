"use client";

import { useState } from "react";
import { useTransactionMutations } from "@/app/(authed)/admin/wallet/hooks/useTransactionMutations";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

interface DonatePointInput {
  toUserId: string;
  amount: number;
  comment?: string;
  fromUserId: string;
}

export function useDonatePoint() {
  const [isLoading, setIsLoading] = useState(false);
  const { donatePoint } = useTransactionMutations();

  const donate = async ({ toUserId, amount, comment, fromUserId }: DonatePointInput) => {
    setIsLoading(true);
    try {
      return await donatePoint({
        input: {
          communityId: COMMUNITY_ID,
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
  };
}
