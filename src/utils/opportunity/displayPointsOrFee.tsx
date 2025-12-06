import React from "react";
import { GqlOpportunityCategory } from "@/types/graphql";
import { ActivityDetail, QuestDetail, isActivityCategory } from "@/components/domains/opportunities/types";
import { isPointsOnlyOpportunity } from "@/utils/opportunity/isPointsOnlyOpportunity";

interface GetPointOrFeeParams {
  opportunity: ActivityDetail | QuestDetail | null;
  totalPrice?: number;
  pointsRequired?: number;
  participantCountWithPoint?: number;
  participantCount?: number;
}

export const getPointOrFee = ({
  opportunity,
  totalPrice,
  pointsRequired,
  participantCountWithPoint,
  participantCount,
}: GetPointOrFeeParams) => {
  if (opportunity?.category === GqlOpportunityCategory.Activity) {
    const feeRequired = isActivityCategory(opportunity) ? opportunity.feeRequired : 0;
    const isPointsOnly = isPointsOnlyOpportunity(feeRequired, pointsRequired);
    const normalParticipantCount = (participantCount ?? 0) - (participantCountWithPoint ?? 0);
    
    if (isPointsOnly) {
      return (
        <div className="border-b border-foreground-caption pb-4">
          <dl className="flex justify-between py-2 mt-2 items-center">
            <dt className="text-label-sm font-bold">必要ポイント</dt>
            <dd className="text-body-sm">{((pointsRequired ?? 0) * (participantCount ?? 0)).toLocaleString()}pt</dd>
          </dl>
          <div className="bg-muted rounded-lg p-4">
            <div className="space-y-2">
              <h2 className="text-body-xs text-caption font-bold">内訳</h2>
              <div className="flex justify-between text-body-xs text-muted-foreground mt-1">
                <span>ポイント利用</span>
                <div>
                  <span>{pointsRequired?.toLocaleString()}pt</span>
                  <span className="mx-2">×</span>
                  <span>{participantCount}名</span>
                  <span className="mx-2">=</span>
                  <span className="font-bold">{(pointsRequired ?? 0) * (participantCount ?? 0)}pt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="border-b border-foreground-caption pb-4">
        <dl className="flex justify-between py-2 mt-2 items-center">
          <div>
            <dt className="text-label-sm font-bold">当日お支払い金額</dt>
            <p className="text-body-xs text-caption pt-1">料金は現地でお支払いください</p>
          </div>
          <dd className="text-body-sm">{totalPrice?.toLocaleString()}円</dd>
        </dl>
        <div className="bg-muted rounded-lg p-4">
          <div className="space-y-2">
            <h2 className="text-body-xs text-caption font-bold">内訳</h2>
            <div className="flex justify-between text-body-xs text-muted-foreground mt-1 border-b border-foreground-caption pb-2">
              <span className="">通常申し込み</span>
              <div>
                <span>{feeRequired?.toLocaleString()}円</span>
                <span className="mx-2">×</span>
                <span>{normalParticipantCount}名</span>
                <span className="mx-2">=</span>
                <span className="font-bold">{(feeRequired ?? 0) * normalParticipantCount}円</span>
              </div>
            </div>

            {pointsRequired && pointsRequired > 0 && participantCountWithPoint && participantCountWithPoint > 0 ? (
              <div className="flex justify-between text-body-xs text-muted-foreground">
                <span>ポイント利用</span>
                <div>
                  <span>{pointsRequired?.toLocaleString()}pt</span>
                  <span className="mx-2">×</span>
                  <span>{participantCountWithPoint}名</span>
                  <span className="mx-2">=</span>
                  <span className="font-bold">{pointsRequired * participantCountWithPoint}pt</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  } else {
    const quest = opportunity as QuestDetail;
    return (
      <dl className="flex justify-between py-5 mt-2 border-b border-foreground-caption items-center">
        <dt className="text-label-sm font-bold">獲得予定ポイント数</dt>
        <dd className="text-body-sm">{((quest.pointsToEarn ?? 0) * (participantCount ?? 0)).toLocaleString()}pt</dd>
      </dl>
    );
  }
};
