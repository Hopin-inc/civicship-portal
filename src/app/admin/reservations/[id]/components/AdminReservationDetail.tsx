import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, JapaneseYen, Phone, User } from "lucide-react";
import { displayPhoneNumber } from "@/utils";
import { displayDuration } from "@/utils/date";
import OpportunityCardHorizontal from "@/app/activities/components/Card/CardHorizontal";
import { cn } from "@/lib/utils";
import { GqlReservation, Maybe } from "@/types/graphql";
import { ActivityCard } from "@/app/activities/data/type";

interface ReservationDetailsProps {
  reservation: GqlReservation;
  activityCard: ActivityCard;
  label: string;
  variant: "primary" | "secondary" | "success" | "outline" | "destructive" | "warning";
  participationFee: number;
  participantCount: number;
}

const AdminReservationDetails: React.FC<ReservationDetailsProps> = ({
  reservation,
  activityCard,
  label,
  variant,
  participationFee,
  participantCount,
}) => {
  return (
    <div>
      <h2 className="text-title-sm font-bold mb-3">予約者</h2>
      <UserCard reservation={reservation} label={label} variant={variant} />

      <h2 className="text-title-sm font-bold mb-3">予約内容</h2>
      <ReservationCard
        activityCard={activityCard}
        reservation={reservation}
        participationFee={participationFee}
        participantCount={participantCount}
      />

      <h2 className="text-title-sm font-bold mb-3">コメント</h2>
      <CommentCard comment={reservation.comment} />
    </div>
  );
};

// 予約者情報を表示するコンポーネント
const UserCard: React.FC<{
  reservation: GqlReservation;
  label: string;
  variant: "primary" | "secondary" | "success" | "outline" | "destructive" | "warning";
}> = ({ reservation, label, variant }) => {
  return (
    <Card className="mb-10 shadow-none border-0">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-grow min-w-0">
          <Avatar>
            <AvatarImage src={reservation.createdByUser?.image || ""} />
            <AvatarFallback>{reservation.createdByUser?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-base truncate">
            {reservation.createdByUser?.name || "未設定"}
          </CardTitle>
        </div>
        <div className="flex-shrink-0">
          <Badge variant={variant}>{label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {reservation.createdByUser?.bio?.trim() && (
          <p className="inline-flex items-center text-body-md">{reservation.createdByUser.bio}</p>
        )}

        <p className="inline-flex items-center gap-2 text-body-md">
          {reservation.createdByUser?.phoneNumber ? (
            <>
              <Phone size={24} />
              <a
                href={`tel:${reservation.createdByUser.phoneNumber}`}
                className="text-primary hover:underline"
              >
                {displayPhoneNumber(reservation.createdByUser.phoneNumber)}
              </a>
            </>
          ) : (
            "未設定"
          )}
        </p>
      </CardContent>
    </Card>
  );
};

// 予約内容を表示するコンポーネント
const ReservationCard: React.FC<{
  activityCard: ActivityCard;
  reservation: GqlReservation;
  participationFee: number;
  participantCount: number;
}> = ({ activityCard, reservation, participationFee, participantCount }) => {
  return (
    <Card className="mb-10 shadow-none border-0">
      <CardHeader>
        <OpportunityCardHorizontal
          opportunity={activityCard}
          withShadow={false}
        ></OpportunityCardHorizontal>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <p className="inline-flex items-center gap-2 text-body-md">
          <CalendarIcon size={24} />
          {reservation.opportunitySlot?.startsAt &&
            displayDuration(
              reservation.opportunitySlot.startsAt,
              reservation.opportunitySlot.endsAt,
            )}
        </p>
        <p className="inline-flex items-center gap-2 text-body-md">
          <User size={24} />
          {reservation.participations?.length ?? 0}名
        </p>
        <p className="inline-flex items-center gap-2 text-body-md">
          <JapaneseYen size={24} />
          {participationFee.toLocaleString()}円
          <span className="text-label-sm text-muted-foreground">
            ({reservation.opportunitySlot?.opportunity?.feeRequired?.toLocaleString() ?? 0}円×
            {participantCount.toLocaleString()}人)
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

// コメントを表示するコンポーネント
const CommentCard: React.FC<{ comment?: Maybe<string> | undefined }> = ({ comment }) => {
  return (
    <p className={cn("text-body-md mb-10", !comment?.trim() && "text-muted-foreground")}>
      {comment?.trim() ? comment : "コメントはありません"}
    </p>
  );
};

export default AdminReservationDetails;
