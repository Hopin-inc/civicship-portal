"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark, CalendarIcon } from "lucide-react";
import { displayRelativeTime } from "@/utils";
import { displayDuration } from "@/utils/date";
import { GqlReservation } from "@/types/graphql";
import getReservationStatusMeta from "../hooks/useGetReservationStatusMeta";
import { cn } from "@/lib/utils";

interface ReservationItemProps {
  reservation: GqlReservation;
  showActionButton?: boolean;
}

export function ReservationItem({ reservation, showActionButton = false }: ReservationItemProps) {
  const router = useRouter();
  const { step, label, variant } = getReservationStatusMeta(reservation);

  const handleClick = () => {
    router.push(`/admin/reservations/${reservation.id}/?mode=${step}`);
  };

  // バリアントに応じた色クラス
  const statusColorClass = {
    default: "bg-muted-foreground",
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
    outline: "bg-muted-foreground",
  }[variant] || "bg-muted-foreground";

  return (
    <div
      onClick={handleClick}
      className="space-y-3 rounded-xl border p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
    >
      {/* ステータス表示 */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span
          className={cn("size-2.5 rounded-full", statusColorClass)}
          aria-label={label}
        />
        <span>{label}</span>
      </div>

      <div className="flex justify-between items-start gap-4">
        {/* 左側：情報 */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* ユーザー情報 */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={reservation.createdByUser?.image || ""} />
              <AvatarFallback className="text-xs">
                {reservation.createdByUser?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-sm truncate">
              {reservation.createdByUser?.name || "未設定"}
            </span>
          </div>

          {/* 募集タイトル */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Bookmark size={14} className="flex-shrink-0" />
            <span className="truncate">
              {reservation.opportunitySlot?.opportunity?.title}
            </span>
          </div>

          {/* 開催日時 */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarIcon size={14} className="flex-shrink-0" />
            <span className="truncate">
              {reservation.opportunitySlot?.startsAt &&
                displayDuration(
                  reservation.opportunitySlot.startsAt,
                  reservation.opportunitySlot.endsAt,
                )}
            </span>
          </div>

          {/* 作成日時 */}
          <div className="text-xs text-muted-foreground">
            {displayRelativeTime(reservation.createdAt ?? "")}
          </div>
        </div>

        {/* 右側：アクションボタン */}
        {showActionButton && (
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            対応する
          </Button>
        )}
      </div>
    </div>
  );
}
