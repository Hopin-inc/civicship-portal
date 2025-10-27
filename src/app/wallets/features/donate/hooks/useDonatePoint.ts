"use client";

import { useState } from "react";
import { useTransactionMutations } from "@/app/admin/wallet/hooks/useTransactionMutations";
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
      const res = await donatePoint({
        input: {
          communityId: COMMUNITY_ID,
          transferPoints: amount,
          toUserId,
          comment,
        },
        permission: { userId: fromUserId },
      });

      return res;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    donate,
    isLoading,
  };
}
