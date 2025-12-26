import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { displayPhoneNumber } from "@/utils";
import { displayDuration } from "@/utils/date";
import { GqlOpportunityCategory, GqlReservation } from "@/types/graphql";
import { ActivityCard } from "@/components/domains/opportunities/types";
import { PriceInfo } from "@/app/admin/reservations/types";
import { PaymentBreakdown } from "../presenters/presentPaymentBreakdown";
import Link from "next/link";

interface ReservationDetailsProps {
  reservation: GqlReservation;
  activityCard: ActivityCard;
  label: string;
  variant: "primary" | "secondary" | "success" | "outline" | "destructive" | "warning";
  priceInfo: PriceInfo;
  paymentBreakdown?: PaymentBreakdown;
}

const AdminReservationDetails: React.FC<ReservationDetailsProps> = ({
  reservation,
  activityCard,
  label,
  variant,
  priceInfo,
  paymentBreakdown,
}) => {
  const {
    participationFee,
    participantCount,
    pointsRequired,
    totalPointsRequired,
    isPointsOnly,
    category,
    pointsToEarn,
    totalPointsToEarn,
  } = priceInfo;

  const isQuest = category === GqlOpportunityCategory.Quest;
  const opportunity = reservation.opportunitySlot?.opportunity;
  const opportunityLink = opportunity
    ? isQuest
      ? `/quests/${opportunity.id}?community_id=${opportunity.community?.id}`
      : `/activities/${opportunity.id}?community_id=${opportunity.community?.id}`
    : "#";

  return (
    <div>
      {/* ユーザー名とステータス */}
      <dl className="flex justify-between items-center py-5 border-b border-foreground-caption">
        <div className="flex items-center gap-3 flex-grow min-w-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={reservation.createdByUser?.image || ""} />
            <AvatarFallback>{reservation.createdByUser?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <dt className="text-body-md font-bold truncate">
            {reservation.createdByUser?.name || "未設定"}
          </dt>
        </div>
        <dd className="flex-shrink-0">
          <Badge variant={variant}>{label}</Badge>
        </dd>
      </dl>

      {/* 電話番号 */}
      <dl className="flex justify-between items-center py-5 border-b border-foreground-caption">
        <dt className="text-label-sm font-bold">電話番号</dt>
        <dd className="text-body-sm">
          {reservation.createdByUser?.phoneNumber ? (
            <a
              href={`tel:${reservation.createdByUser.phoneNumber}`}
              className="text-primary hover:underline"
            >
              {displayPhoneNumber(reservation.createdByUser.phoneNumber)}
            </a>
          ) : (
            <span className="text-muted-foreground">未設定</span>
          )}
        </dd>
      </dl>

      {/* 自己紹介 */}
      {reservation.createdByUser?.bio?.trim() && (
        <dl className="py-5 border-b border-foreground-caption">
          <dt className="text-label-sm font-bold mb-2">自己紹介</dt>
          <dd className="text-body-sm">{reservation.createdByUser.bio}</dd>
        </dl>
      )}

      {/* 募集タイトル（リンク） */}
      <dl className="flex justify-between items-center py-5 border-b border-foreground-caption">
        <dt className="text-label-sm font-bold">募集</dt>
        <dd className="text-body-sm text-right flex-1 min-w-0 ml-4">
          <Link
            href={opportunityLink}
            className="text-primary hover:underline inline-flex items-center gap-1.5 justify-end"
          >
            <span className="truncate">{opportunity?.title || "未設定"}</span>
            <ExternalLink className="h-4 w-4 flex-shrink-0" />
          </Link>
        </dd>
      </dl>

      {/* 日時 */}
      <dl className="flex justify-between items-center py-5 border-b border-foreground-caption">
        <dt className="text-label-sm font-bold">日時</dt>
        <dd className="text-body-sm text-right">
          {reservation.opportunitySlot?.startsAt &&
            displayDuration(
              reservation.opportunitySlot.startsAt,
              reservation.opportunitySlot.endsAt,
            )}
        </dd>
      </dl>

      {/* 人数 */}
      <dl className="flex justify-between items-center py-5 border-b border-foreground-caption">
        <dt className="text-label-sm font-bold">人数</dt>
        <dd className="text-body-sm">{reservation.participations?.length ?? 0}名</dd>
      </dl>

      {/* 料金・ポイント（内訳表示） */}
      {!isQuest && paymentBreakdown && (
        <>
          {paymentBreakdown.paymentType === "FEE_ONLY" && (
            <dl className="flex justify-between items-center py-5 border-b border-foreground-caption">
              <dt className="text-label-sm font-bold">参加費</dt>
              <dd className="text-body-sm">
                {paymentBreakdown.totalFee.toLocaleString()}円
                <span className="text-label-sm text-muted-foreground ml-2">
                  ({paymentBreakdown.feePerPerson.toLocaleString()}円×
                  {paymentBreakdown.feePayerCount.toLocaleString()}人)
                </span>
              </dd>
            </dl>
          )}

          {paymentBreakdown.paymentType === "POINT_ONLY" && (
            <dl className="flex justify-between items-center py-5 border-b border-foreground-caption">
              <dt className="text-label-sm font-bold">参加費</dt>
              <dd className="text-body-sm">
                {paymentBreakdown.totalPoints.toLocaleString()}pt
                <span className="text-label-sm text-muted-foreground ml-2">
                  ({paymentBreakdown.pointsPerPerson.toLocaleString()}pt×
                  {paymentBreakdown.pointPayerCount.toLocaleString()}人)
                </span>
              </dd>
            </dl>
          )}

          {paymentBreakdown.paymentType === "MIXED" && (
            <>
              {paymentBreakdown.feePayerCount > 0 && (
                <dl className="flex justify-between items-center py-5 border-b border-foreground-caption">
                  <dt className="text-label-sm font-bold">参加費（現金）</dt>
                  <dd className="text-body-sm">
                    {paymentBreakdown.totalFee.toLocaleString()}円
                    <span className="text-label-sm text-muted-foreground ml-2">
                      ({paymentBreakdown.feePerPerson.toLocaleString()}円×
                      {paymentBreakdown.feePayerCount.toLocaleString()}人)
                    </span>
                  </dd>
                </dl>
              )}

              {paymentBreakdown.pointPayerCount > 0 && (
                <dl className="flex justify-between items-center py-5 border-b border-foreground-caption">
                  <dt className="text-label-sm font-bold">参加費（ポイント）</dt>
                  <dd className="text-body-sm">
                    {paymentBreakdown.totalPoints.toLocaleString()}pt
                    <span className="text-label-sm text-muted-foreground ml-2">
                      ({paymentBreakdown.pointsPerPerson.toLocaleString()}pt×
                      {paymentBreakdown.pointPayerCount.toLocaleString()}人)
                    </span>
                  </dd>
                </dl>
              )}
            </>
          )}
        </>
      )}

      {isQuest && pointsToEarn && pointsToEarn > 0 && (
        <dl className="flex justify-between items-center py-5 border-b border-foreground-caption">
          <dt className="text-label-sm font-bold">獲得予定ポイント</dt>
          <dd className="text-body-sm">
            {totalPointsToEarn?.toLocaleString()}pt
            <span className="text-label-sm text-muted-foreground ml-2">
              ({pointsToEarn.toLocaleString()}pt×{participantCount.toLocaleString()}人)
            </span>
          </dd>
        </dl>
      )}

      {/* コメント */}
      {reservation.comment?.trim() && (
        <dl className="py-5">
          <dt className="text-label-sm font-bold mb-2">コメント</dt>
          <dd className="text-body-sm">{reservation.comment}</dd>
        </dl>
      )}
    </div>
  );
};

export default AdminReservationDetails;
