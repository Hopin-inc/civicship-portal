"use client";

import { useState } from "react";
import { useTransactionMutations } from "@/app/community/[communityId]/admin/wallet/hooks/useTransactionMutations";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

interface DonatePointInput {
  /** 省略時はコミュニティ財布への送付 (CONTRIBUTION) として扱われる */
  toUserId?: string;
  amount: number;
  comment?: string;
  fromUserId: string;
  images?: File[];
}

export function useDonatePoint() {
  const [isLoading, setIsLoading] = useState(false);
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId ?? "";
  const { donatePoint, isAuthReady } = useTransactionMutations();

  const donate = async ({ toUserId, amount, comment, fromUserId, images }: DonatePointInput) => {
    setIsLoading(true);
    try {
      const imagesInput = images?.map((file) => ({ file, alt: "", caption: "" }));
      return await donatePoint({
        input: {
          communityId,
          transferPoints: amount,
          // toUserId を省略するとコミュニティ財布への送付 (CONTRIBUTION) になる
          ...(toUserId ? { toUserId } : {}),
          comment,
          images: imagesInput && imagesInput.length > 0 ? imagesInput : undefined,
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
