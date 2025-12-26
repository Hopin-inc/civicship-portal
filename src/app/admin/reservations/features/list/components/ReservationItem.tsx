"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { displayRelativeTime } from "@/utils";
import { GqlReservation } from "@/types/graphql";
import getReservationStatusMeta from "../../detail/hooks/useGetReservationStatusMeta";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

interface ReservationItemProps {
  reservation: GqlReservation;
}

export function ReservationItem({ reservation }: ReservationItemProps) {
  const router = useRouter();
  const { step, label, variant } = getReservationStatusMeta(reservation);

  const handleClick = () => {
    router.push(`/admin/reservations/${reservation.id}/?mode=${step}`);
  };

  // 日付フォーマット（月/日 時:分 - 時:分）
  const formatSlotTime = (start: Date | string, end?: Date | string) => {
    const dStart = dayjs(start);
    const dEnd = end ? dayjs(end) : null;

    if (!dEnd) {
      return dStart.format("M/D H:mm");
    }

    if (dStart.isSame(dEnd, "date")) {
      // 同じ日付の場合: 01/15 10:00 - 12:00
      return `${dStart.format("M/D H:mm")}-${dEnd.format("H:mm")}`;
    } else {
      // 日付を跨ぐ場合: 01/15 10:00 - 01/16 12:00
      return `${dStart.format("M/D H:mm")}-${dEnd.format("M/D H:mm")}`;
    }
  };

  // バリアントに応じた色クラス
  const statusColorClass =
    {
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
      className="space-y-2 rounded-xl border p-3 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
    >
      {/* ステータスと作成日時 */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className={cn("size-2.5 rounded-full", statusColorClass)} aria-label={label} />
          <span>{label}</span>
        </div>
        <span>{displayRelativeTime(reservation.createdAt ?? "")}</span>
      </div>

      {/* 情報 */}
      <div className="flex-1 min-w-0 space-y-1.5">
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

        {/* 募集タイトル・開催日時 */}
        <div className="text-xs text-muted-foreground truncate">
          {reservation.opportunitySlot?.opportunity?.title}
          {reservation.opportunitySlot?.startsAt && (
            <>
              ・
              {formatSlotTime(
                reservation.opportunitySlot.startsAt,
                reservation.opportunitySlot.endsAt,
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
