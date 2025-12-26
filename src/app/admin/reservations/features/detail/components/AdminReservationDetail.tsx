import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Phone, MessageSquare } from "lucide-react";
import { displayDuration } from "@/utils/date";
import { GqlOpportunityCategory, GqlReservation } from "@/types/graphql";
import { ActivityCard } from "@/components/domains/opportunities/types";
import { PriceInfo } from "@/app/admin/reservations/types";
import { PaymentBreakdown } from "../presenters/presentPaymentBreakdown";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  const { participantCount, category, pointsToEarn, totalPointsToEarn } = priceInfo;

  const isQuest = category === GqlOpportunityCategory.Quest;
  const opportunity = reservation.opportunitySlot?.opportunity;
  const opportunityLink = opportunity
    ? isQuest
      ? `/quests/${opportunity.id}?community_id=${opportunity.community?.id}`
      : `/activities/${opportunity.id}?community_id=${opportunity.community?.id}`
    : "#";

  // バリアントに応じた色クラス
  const statusColorClass = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
    outline: "bg-muted-foreground",
  }[variant] || "bg-muted-foreground";

  return (
    <div>
      {/* ユーザー情報とアクション */}
      <div className="flex justify-between items-start py-5 border-b border-foreground-caption">
        {/* 左側：ステータス、アバター、名前（縦並び） */}
        <div className="flex flex-col gap-2.5 flex-grow min-w-0">
          {/* ステータス */}
          <div className="flex items-center gap-1.5 text-label-sm">
            <span
              className={cn("size-2.5 rounded-full", statusColorClass)}
              aria-label={label}
            />
            <span>{label}</span>
          </div>

          {/* アバター＋名前 */}
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={reservation.createdByUser?.image || ""} />
              <AvatarFallback className="text-xs">
                {reservation.createdByUser?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-label-sm font-bold truncate">
              {reservation.createdByUser?.name || "未設定"}
            </span>
          </div>
        </div>

        {/* 右側：電話・メッセージボタン */}
        <div className="flex gap-2 flex-shrink-0">
          {reservation.createdByUser?.phoneNumber && (
            <>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href={`tel:${reservation.createdByUser.phoneNumber}`}>
                  <Phone className="h-4 w-4 mr-1.5" />
                  電話
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href={`sms:${reservation.createdByUser.phoneNumber}`}>
                  <MessageSquare className="h-4 w-4 mr-1.5" />
                  メッセージ
                </a>
              </Button>
            </>
          )}
        </div>
      </div>

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
