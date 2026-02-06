import React from "react";
import { GqlReservation } from "@/types/graphql";
import { PriceInfo } from "@/app/community/[communityId]/admin/reservations/types";
import { PaymentBreakdown } from "../presenters/presentPaymentBreakdown";
import { UserInfoBlock } from "./UserInfoBlock";
import { ReservationDetailsCard } from "./ReservationDetailsCard";
import { presentReservationDetailRows } from "../presenters/presentReservationDetailRows";

interface ReservationDetailsProps {
  reservation: GqlReservation;
  label: string;
  variant: "primary" | "secondary" | "success" | "outline" | "destructive" | "warning";
  priceInfo: PriceInfo;
  paymentBreakdown?: PaymentBreakdown;
}

const AdminReservationDetails: React.FC<ReservationDetailsProps> = ({
  reservation,
  label,
  variant,
  priceInfo,
  paymentBreakdown,
}) => {
  const { participantCount, pointsToEarn, totalPointsToEarn } = priceInfo;
  const opportunity = reservation.opportunitySlot?.opportunity;

  // 詳細行を取得
  const detailRows = presentReservationDetailRows({
    reservation,
    opportunity,
    paymentBreakdown,
    pointsToEarn,
    totalPointsToEarn,
    participantCount,
  });

  return (
    <div className="space-y-4">
      {/* ユーザー情報ブロック */}
      <UserInfoBlock reservation={reservation} statusLabel={label} statusVariant={variant} />

      {/* 予約詳細カード */}
      <ReservationDetailsCard rows={detailRows} />
    </div>
  );
};

export default AdminReservationDetails;
