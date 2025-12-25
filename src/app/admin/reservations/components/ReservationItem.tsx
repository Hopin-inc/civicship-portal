"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, CalendarIcon } from "lucide-react";
import { displayRelativeTime } from "@/utils";
import { displayDuration } from "@/utils/date";
import { GqlReservation } from "@/types/graphql";
import getReservationStatusMeta from "../hooks/useGetReservationStatusMeta";

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

  return (
    <Card
      onClick={handleClick}
      className="cursor-pointer hover:bg-muted-hover transition-colors"
    >
      <CardHeader className="flex flex-row items-center justify-between p-4 gap-3">
        <div className="flex items-center gap-3 flex-grow min-w-0">
          <Avatar>
            <AvatarImage src={reservation.createdByUser?.image || ""} />
            <AvatarFallback>
              {reservation.createdByUser?.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-base truncate">
            {reservation.createdByUser?.name || "未設定"}
          </CardTitle>
        </div>

        <div className="flex-shrink-0">
          <Badge variant={variant}>{label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1 truncate">
          <Bookmark size={16} />
          <span className="truncate">
            {reservation.opportunitySlot?.opportunity?.title}
          </span>
        </div>
        <div className="flex items-center gap-1 truncate">
          <CalendarIcon size={16} />
          <span className="truncate">
            {reservation.opportunitySlot?.startsAt &&
              displayDuration(
                reservation.opportunitySlot.startsAt,
                reservation.opportunitySlot.endsAt,
              )}
          </span>
        </div>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground pt-0 flex justify-between items-center">
        <span>{displayRelativeTime(reservation.createdAt ?? "")}</span>
        {showActionButton && (
          <Button
            variant="secondary"
            size="sm"
            className="px-10"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            対応する
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
