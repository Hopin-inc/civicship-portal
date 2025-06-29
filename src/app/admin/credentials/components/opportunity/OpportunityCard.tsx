"use client";

import { Card } from "@/components/ui/card";
import { useGetParticipationsQuery, GqlParticipationStatusReason } from "@/types/graphql";
import { useSelection } from "../../context/SelectionContext";
import { useMemo, useCallback } from "react";

type OpportunityCardProps = {
  qty?: number;
  createdAt?: string;
  title?: string;
  isSelected?: boolean;
  onClick?: () => void;
  name?: string;
  opportunityId: string;
};

// ユーザー参加データの型定義
type ParticipatedUser = {
  userId: string;
  slotId: string;
  reason: GqlParticipationStatusReason | undefined;
  isCreatedByUser: boolean;
};

// データ変換ロジックを関数として分離
const transformParticipationData = (data: any): ParticipatedUser[] => {
  if (!data?.participations?.edges) return [];

  return data.participations.edges
    .map((edge: any) => {
      const node = edge?.node;
      if (!node) return null;

      const userId = node.user?.id;
      const opportunitySlot = node.opportunitySlot || node.reservation?.opportunitySlot;
      const slotId = opportunitySlot?.id;
      const reason = node.reason as GqlParticipationStatusReason | undefined;
      const reservations = opportunitySlot?.reservations || [];

      if (!userId || !slotId) return null;

      const isCreatedByUser = Array.isArray(reservations)
        ? reservations.some((r: any) => r?.createdByUser?.id === userId)
        : false;

      return {
        userId,
        slotId,
        reason,
        isCreatedByUser,
      };
    })
    .filter((user: ParticipatedUser | null): user is ParticipatedUser => user !== null);
};

export function OpportunityCard({
  title,
  isSelected,
  onClick,
  name = "ticket",
  opportunityId,
}: OpportunityCardProps) {
  const { data } = useGetParticipationsQuery({
    variables: { filter: { opportunityId } },
    skip: !opportunityId,
  });
  const { setParticipatedUsers } = useSelection();

  // 参加者データをメモ化
  const participatedUsers = useMemo(() => {
    return transformParticipationData(data);
  }, [data]);

  // ハンドラーをメモ化
  const handleSelect = useCallback(() => {
    setParticipatedUsers(participatedUsers);
    onClick?.();
  }, [participatedUsers, setParticipatedUsers, onClick]);

  return (
    <Card
      className={`transition-colors p-4 flex flex-col rounded-xl border border-gray-200 ${
        onClick ? "cursor-pointer hover:bg-muted" : "opacity-50 pointer-events-none"
      } ${isSelected ? "border-primary" : ""}`}
      onClick={handleSelect}
    >
      <div className="flex items-center gap-3">
        <input
          type="radio"
          checked={isSelected}
          readOnly
          name={name}
          className="mr-2 w-5 h-5"
          tabIndex={-1}
        />
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold truncate max-w-xs">{title ?? "チケット"}</p>
          <p className="text-gray-500 text-sm mt-1">参加者数: {data?.participations.totalCount ?? 0}</p>
        </div>
      </div>
    </Card>
  );
}
