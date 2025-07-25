"use client";

import { useEffect, useMemo, useRef } from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import useParticipationPage from "@/app/participations/[id]/hooks/useParticipationPage";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import ParticipationStatusNotification from "@/app/participations/[id]/components/ParticipationStatusNotification";
import ParticipationActions from "@/app/participations/[id]/components/ParticipationActions";
import { toast } from "sonner";
import { GqlReservationStatus } from "@/types/graphql";
import { useParams } from "next/navigation";
import { errorMessages } from "@/utils/errorMessage";
import useCancelReservation from "@/app/participations/[id]/hooks/useCancelReservation";
import OpportunityInfo from "./components/OpportunityInfo";
import { useOpportunityDetail } from "@/app/activities/[id]/hooks/useOpportunityDetail";
import ReservationDetails from "@/app/reservation/complete/components/ReservationDetails";
import { useCompletePageViewModel } from "@/app/reservation/complete/hooks/useCompletePageViewModel";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";
import { logger } from "@/lib/logging";

export type ParticipationUIStatus = "pending" | "confirmed" | "cancelled";

const mapReservationStatusToUIStatus = (status: GqlReservationStatus): ParticipationUIStatus => {
  switch (status) {
    case GqlReservationStatus.Accepted:
      return "confirmed";
    case GqlReservationStatus.Rejected:
    case GqlReservationStatus.Canceled:
      return "cancelled";
    case GqlReservationStatus.Applied:
    default:
      return "pending";
  }
};

export default function ParticipationPage() {
  const headerConfig = useMemo(
    () => ({
      title: "予約の確認",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const track = useAnalytics();

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const {
    participation,
    opportunity,
    currentStatus,
    cancellationDeadline,
    loading,
    hasError,
    refetch,
  } = useParticipationPage(id ?? "");
  
  // #NOTE: コンポーネントに必要な情報を取得するために、useCompletePageViewModel と useOpportunityDetail を使用しているがリクエストが重複するので、まとめたい
  const { dateTimeInfo } = useCompletePageViewModel(id ?? "", participation?.reservation?.id ?? "");
  const { opportunity: opportunityDetail, loading: opportunityLoading } = useOpportunityDetail(
    opportunity?.id ?? "",
  );

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const isCancellable = cancellationDeadline ? new Date() < cancellationDeadline : false;
  const reservationId = participation?.reservation?.id;
  const { handleCancel, isCancelling } = useCancelReservation();

  const onCancel = async () => {
    if (!reservationId) {
      toast.error("予約情報が見つかりません");
      return;
    }
    const result = await handleCancel(reservationId);

    if (result.success) {
      toast.success("予約がキャンセルされました。");
      if (participation && opportunity && dateTimeInfo) {
        track({
          name: "cancel_application",
          params: {
            reservationId,
            opportunityId: opportunity.id,
            opportunityTitle: opportunity.title,
            category: opportunity.category,
            guest: dateTimeInfo.participantCount,
            paidGuest: dateTimeInfo.paidParticipantCount,
            feeRequired: opportunity.feeRequired ?? 0,
            totalFee: dateTimeInfo.totalPrice,
            scheduledAt: dateTimeInfo.startTime,
          },
        });
      }
      if (refetchRef.current) {
        refetchRef.current();
      }
    } else {
      const message = errorMessages[result.code] ?? "予期しないエラーが発生しました。";
      toast.error(message);
    }
  };

  const isAfterParticipation = useMemo(() => {
    if (currentStatus?.status !== GqlReservationStatus.Accepted) {
      return false;
    }
    const relevantDateString = dateTimeInfo?.endTime ?? dateTimeInfo?.startTime;
    if (!relevantDateString) {
      return false;
    }
    const eventDate = new Date(relevantDateString);
    if (isNaN(eventDate.getTime())) {
      logger.warn("Invalid date string for participation check", {
        relevantDateString,
        component: "ParticipationPage",
      });
      return false;
    }
    return new Date() > eventDate;
  }, [currentStatus, dateTimeInfo]);

  if (loading || opportunityLoading) return <LoadingIndicator />;
  if (hasError || !reservationId || !opportunity || !participation) {
    return <ErrorState title="Could not load reservation page" refetchRef={refetchRef} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {!isAfterParticipation && currentStatus && (
        <div className="px-6">
          <ParticipationStatusNotification
            status={mapReservationStatusToUIStatus(currentStatus.status)}
            statusText={currentStatus.statusText}
            statusSubText={currentStatus.statusSubText}
            statusClass={currentStatus.statusClass}
          />
        </div>
      )}
      <OpportunityInfo opportunity={opportunityDetail} />
      {dateTimeInfo && opportunityDetail && (
        <div className="px-6 mb-10 mt-8">
          <h2 className="text-label-md font-bold mb-4">予約詳細</h2>
          <ReservationDetails
            formattedDate={dateTimeInfo.formattedDate}
            startTime={dateTimeInfo.startTime}
            endTime={dateTimeInfo.endTime}
            participantCount={dateTimeInfo.participantCount}
            paidParticipantCount={dateTimeInfo.paidParticipantCount}
            totalPrice={dateTimeInfo.totalPrice}
            pricePerPerson={"feeRequired" in opportunityDetail ? opportunityDetail.feeRequired : 0}
            location={opportunityDetail.place}
            phoneNumber={participation.emergencyContactPhone}
            isReserved={true}
            dateDiffLabel={dateTimeInfo.dateDiffLabel}
            points={{
              usedPoints: dateTimeInfo.usedPoints,
              participantCountWithPoint: dateTimeInfo.participantCountWithPoint,
            }}
            ticketCount={dateTimeInfo.ticketCount}
            category={opportunityDetail.category}
            pointsToEarn={"pointsToEarn" in opportunityDetail ? opportunityDetail.pointsToEarn : 0}
          />
        </div>
      )}
      {/*<div className="px-6">*/}
      {/*  <h2 className="text-label-md font-bold mb-4">メッセージ</h2>*/}
      {/*  /!* #TODO: メッセージの表示を動的にする *!/*/}
      {/*  <p className="whitespace-pre-line text-body-md">*/}
      {/*    汚れてもOKな服装でお越しください。当日は12:50に現地集合です。遅れる場合は090-xxxx-xxxxまでご連絡をお願いします。*/}
      {/*  </p>*/}
      {/*</div>*/}
      {currentStatus &&
        currentStatus?.status !== "REJECTED" &&
        currentStatus?.status !== "CANCELED" && (
          <ParticipationActions
            cancellationDeadline={cancellationDeadline}
            isCancellable={isCancellable}
            onCancel={onCancel}
            isAfterParticipation={isAfterParticipation}
            isCancelling={isCancelling}
          />
        )}
    </div>
  );
}
