"use client";

import { useMemo } from "react";
import { useMemberWallets } from "@/hooks/members/useMemberWallets";
import { DonateMember } from "../types";

export function useDonateMembers(currentUserId?: string) {
  const { data, loading, error, refetch, loadMoreRef, hasNextPage, isLoadingMore } = useMemberWallets();

  const members = useMemo(() => {
    return (data?.wallets?.edges ?? [])
      .map((edge) => {
        const wallet = edge?.node;
        const user = wallet?.user;
        const pointStr = wallet?.currentPointView?.currentPoint;

        if (!user || user.id === currentUserId) return null;

        const currentPoint = pointStr ? BigInt(pointStr) : BigInt(0);

        return {
          user,
          wallet: {
            currentPointView: {
              currentPoint,
            },
          },
        };
      })
      .filter((member): member is DonateMember => !!member && !!member.user);
  }, [data, currentUserId]);

  return {
    members,
    loading,
    error,
    refetch,
    loadMoreRef,
    hasNextPage,
    isLoadingMore,
    walletsConnection: data?.wallets, // 元のconnection情報を返す
  };
}
