"use client";

import { Card } from "@/components/ui/card";
import { useGetParticipationsQuery } from "@/types/graphql";
import { useSelection } from "../context/SelectionContext";

type OpportunityCardProps = {
  qty?: number;
  createdAt?: string;
  title?: string;
  isSelected?: boolean;
  onClick?: () => void;
  name?: string;
  opportunityId: string;
};

export function OpportunityCard({
  title,
  isSelected,
  onClick,
  name = "ticket",
  opportunityId,
}: OpportunityCardProps) {
  const { data, loading, error } = useGetParticipationsQuery({
    variables: {
      filter: { opportunityId }
    },
    skip: !opportunityId,
  });
  const { setParticipatedUserIds, setParticipatedSlotIds } = useSelection();

  const handleSelect = () => {
    const userIds = data?.participations.edges.map((e) => e?.node?.user?.id).filter((id): id is string => !!id);
    const slotId = data?.participations.edges.map((e) => e?.node?.opportunitySlot?.id).filter((id): id is string => !!id);
  if (userIds) {
    setParticipatedUserIds(userIds); // ← これだけでOK
  }
  if (slotId) {
    setParticipatedSlotIds(slotId[0]); // ← これだけでOK
  }
    if (onClick) onClick();
  };

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
          <p className="text-base font-bold truncate">{title ?? "チケット"}</p>
          <p className="text-gray-500 text-sm mt-1">参加者数: {data?.participations.totalCount ?? 0}</p>
        </div>
      </div>
    </Card>
  );
}
