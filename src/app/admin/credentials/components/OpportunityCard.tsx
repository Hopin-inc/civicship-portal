"use client";

import { Card } from "@/components/ui/card";
import { useGetParticipationsQuery, GqlParticipationStatusReason } from "@/types/graphql";
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
  const { data } = useGetParticipationsQuery({
    variables: { filter: { opportunityId } },
    skip: !opportunityId,
  });
  const { setParticipatedUsers } = useSelection();

  const handleSelect = () => {
    const users =
      data?.participations.edges
        .map((e) => {
          const userId = e?.node?.user?.id;
          console.log("userId:", userId);
          const slotId =
            e?.node?.opportunitySlot?.id ??
            e?.node?.reservation?.opportunitySlot?.id;
          const reason = e?.node?.reason as GqlParticipationStatusReason | undefined;
          const reservations =
            e?.node?.opportunitySlot?.reservations ??
            e?.node?.reservation?.opportunitySlot?.reservations ??
            [];
          console.log("reservations:", reservations);
          const isCreatedByUser = Array.isArray(reservations)
            ? reservations.some(r => r?.createdByUser?.id === userId)
            : false;
          if (typeof userId === "string" && typeof slotId === "string") {
            return { userId, slotId, reason, isCreatedByUser };
          }
          return null;
        })
        .filter((u): u is { userId: string; slotId: string; reason: GqlParticipationStatusReason | undefined; isCreatedByUser: boolean } => !!u);
    setParticipatedUsers(users ?? []);
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
