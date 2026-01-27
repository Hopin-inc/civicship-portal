import { GqlOpportunity, GqlOpportunityCategory, GqlReservation } from "@/types/graphql";
import { displayDuration } from "@/utils/date";
import { PaymentBreakdown } from "./presentPaymentBreakdown";
import { ExternalLink } from "lucide-react";
import CommunityLink from "@/components/navigation/CommunityLink";
import React from "react";

export interface DetailRow {
  key: string;
  label?: string;
  value: React.ReactNode;
  isComment?: boolean; // コメント行は特別扱い
}

interface PresentReservationDetailRowsParams {
  reservation: GqlReservation;
  opportunity: GqlOpportunity | null | undefined;
  paymentBreakdown?: PaymentBreakdown;
  pointsToEarn?: number;
  totalPointsToEarn?: number;
  participantCount: number;
}

// 種別の表示名マッピング
function getCategoryDisplayName(category: GqlOpportunityCategory): string {
  switch (category) {
    case GqlOpportunityCategory.Quest:
      return "お手伝い";
    case GqlOpportunityCategory.Activity:
      return "体験";
    case GqlOpportunityCategory.Event:
      return "イベント";
    default:
      return category;
  }
}

export function presentReservationDetailRows({
  reservation,
  opportunity,
  paymentBreakdown,
  pointsToEarn,
  totalPointsToEarn,
  participantCount,
}: PresentReservationDetailRowsParams): DetailRow[] {
  const rows: DetailRow[] = [];
  const isQuest = opportunity?.category === GqlOpportunityCategory.Quest;

  // 種別
  if (opportunity?.category) {
    rows.push({
      key: "category",
      label: "種別",
      value: getCategoryDisplayName(opportunity.category),
    });
  }

  // 募集タイトル（リンク）
  if (opportunity) {
    const communityId = opportunity.community?.id;
    const opportunityLink = isQuest
      ? `/quests/${opportunity.id}${communityId ? `?community_id=${communityId}` : ""}`
      : `/activities/${opportunity.id}${communityId ? `?community_id=${communityId}` : ""}`;

    rows.push({
      key: "opportunity",
      label: "募集",
      value: (
        <CommunityLink
          href={opportunityLink}
          className="text-primary hover:underline flex items-center gap-1.5 min-w-0 justify-end"
        >
          <span className="block truncate min-w-0 max-w-full">{opportunity.title}</span>
          <ExternalLink className="h-4 w-4 flex-shrink-0" />
        </CommunityLink>
      ),
    });
  }

  // 日時
  if (reservation.opportunitySlot?.startsAt) {
    rows.push({
      key: "datetime",
      label: "日時",
      value: displayDuration(
        reservation.opportunitySlot.startsAt,
        reservation.opportunitySlot.endsAt,
      ),
    });
  }

  // 人数
  rows.push({
    key: "participants",
    label: "人数",
    value: `${participantCount}名`,
  });

  // 料金・ポイント（Activity の場合）
  if (!isQuest && paymentBreakdown) {
    const {
      paymentType,
      totalFee,
      feePerPerson,
      feePayerCount,
      totalPoints,
      pointsPerPerson,
      pointPayerCount,
    } = paymentBreakdown;

    if (paymentType === "FEE_ONLY") {
      rows.push({
        key: "fee",
        label: "参加費",
        value: (
          <>
            {totalFee.toLocaleString()}円
            <span className="text-label-sm text-muted-foreground ml-2">
              ({feePerPerson.toLocaleString()}円×{feePayerCount.toLocaleString()}人)
            </span>
          </>
        ),
      });
    } else if (paymentType === "POINT_ONLY") {
      rows.push({
        key: "points",
        label: "参加費",
        value: (
          <>
            {totalPoints.toLocaleString()}pt
            <span className="text-label-sm text-muted-foreground ml-2">
              ({pointsPerPerson.toLocaleString()}pt×{pointPayerCount.toLocaleString()}人)
            </span>
          </>
        ),
      });
    } else if (paymentType === "MIXED") {
      if (feePayerCount > 0) {
        rows.push({
          key: "fee_cash",
          label: "参加費（現金）",
          value: (
            <>
              {totalFee.toLocaleString()}円
              <span className="text-label-sm text-muted-foreground ml-2">
                ({feePerPerson.toLocaleString()}円×{feePayerCount.toLocaleString()}人)
              </span>
            </>
          ),
        });
      }
      if (pointPayerCount > 0) {
        rows.push({
          key: "fee_points",
          label: "参加費（ポイント）",
          value: (
            <>
              {totalPoints.toLocaleString()}pt
              <span className="text-label-sm text-muted-foreground ml-2">
                ({pointsPerPerson.toLocaleString()}pt×{pointPayerCount.toLocaleString()}人)
              </span>
            </>
          ),
        });
      }
    }
  }

  // 報酬ポイント（Quest の場合）
  if (isQuest && pointsToEarn && pointsToEarn > 0) {
    rows.push({
      key: "points_to_earn",
      label: "報酬ポイント",
      value: (
        <>
          {totalPointsToEarn?.toLocaleString()}pt
          <span className="text-label-sm text-muted-foreground ml-2">
            ({pointsToEarn.toLocaleString()}pt×{participantCount.toLocaleString()}人)
          </span>
        </>
      ),
    });
  }

  // コメント
  if (reservation.comment?.trim()) {
    rows.push({
      key: "comment",
      label: "コメント",
      value: reservation.comment,
      isComment: true,
    });
  }

  return rows;
}
