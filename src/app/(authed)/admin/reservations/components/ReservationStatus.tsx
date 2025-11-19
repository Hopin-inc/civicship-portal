import { GqlReservationStatus } from "@/types/graphql";
import { Badge } from "@/components/ui/badge";

export function ReservationStatus({ status }: { status: GqlReservationStatus }) {
  const statusList = {
    [GqlReservationStatus.Applied]: {
      label: "承認待ち",
      color: "status-pending",
    },
    [GqlReservationStatus.Accepted]: {
      label: "予約確定",
      color: "status-approved",
    },
    [GqlReservationStatus.Canceled]: {
      label: "キャンセル済み",
      color: "status-cancelled",
    },
    [GqlReservationStatus.Rejected]: {
      label: "却下済み",
      color: "status-rejected",
    },
  };
  const { label, color } = statusList[status];

  return (
    <Badge variant="colored" color={color}>
      {label}
    </Badge>
  );
}
