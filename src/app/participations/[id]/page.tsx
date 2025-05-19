"use client";

import { useEffect, useMemo, useRef } from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import useParticipationPage from "@/app/participations/[id]/hooks/useParticipationPage";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import ParticipationStatusNotification from "@/app/participations/[id]/components/ParticipationStatusNotification";
import ParticipationDetails from "@/app/participations/[id]/components/ParticipationDetails";
import ParticipationActions from "@/app/participations/[id]/components/ParticipationActions";
import { useCancelReservation } from "@/app/participations/[id]/hooks/useCancelReservation";
import { toast } from "sonner";
import { GqlReservationStatus } from "@/types/graphql";
import OpportunityCardHorizontal from "@/app/activities/components/Card/CardHorizontal";
import { useParams } from "next/navigation";
import OpportunityInfo from "@/app/reservation/confirm/components/OpportunityInfo";
import { useOpportunityDetail } from "@/app/activities/[id]/hooks/useOpportunityDetail";
import ReservationDetails from "@/app/reservation/complete/components/ReservationDetails";
import { useCompletePageViewModel } from "@/app/reservation/complete/hooks/useCompletePageViewModel";

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
  const { opportunity: oppotunityDetail, loading: opportunityLoading } = useOpportunityDetail(
    opportunity?.id ?? "",
  );

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const isCancellable = cancellationDeadline ? new Date() < cancellationDeadline : false;
  const reservationId = participation?.reservation?.id;
  const { handleCancel } = useCancelReservation();

  const onCancel = async () => {
    if (!reservationId) {
      toast.error("予約情報が見つかりません");
      return;
    }
    const result = await handleCancel(reservationId);
    if (result.success) {
      toast.success("予約がキャンセルされました。");
      if (refetchRef.current) {
        refetchRef.current();
      }
    } else if (result.typename === "ReservationCancellationTimeoutError") {
      toast.error("予約のキャンセルは24時間前まで可能です。");
    } else {
      toast.error(`予約のキャンセルに失敗しました。`);
      console.error("Cancel reservation failed:", result.error);
    }
  };

  const isAfterParticipation =
    currentStatus?.status === "ACCEPTED" &&
    new Date() > new Date(dateTimeInfo?.startTime ?? dateTimeInfo?.endTime ?? "");

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
      <OpportunityInfo opportunity={oppotunityDetail} />
      {dateTimeInfo && oppotunityDetail && (
        <div className="px-6 mb-10 mt-8">
          <h2 className="text-label-md font-bold mb-4">予約詳細</h2>
          <ReservationDetails
            formattedDate={dateTimeInfo.formattedDate}
            startTime={dateTimeInfo.startTime}
            endTime={dateTimeInfo.endTime}
            participantCount={dateTimeInfo.participantCount}
            totalPrice={dateTimeInfo.totalPrice}
            pricePerPerson={oppotunityDetail.feeRequired ?? 0}
            location={oppotunityDetail.place}
          />
        </div>
      )}
      <div className="px-6">
        <h2 className="text-label-md font-bold mb-4">メッセージ</h2>
        {/* #TODO: メッセージの表示を動的にする */}
        <p className="whitespace-pre-line text-body-md">
          汚れてもOKな服装でお越しください。当日は12:50に現地集合です。遅れる場合は090-xxxx-xxxxまでご連絡をお願いします。
        </p>
      </div>
      {currentStatus &&
        currentStatus?.status !== "REJECTED" &&
        currentStatus?.status !== "CANCELED" && (
          <ParticipationActions
            cancellationDeadline={cancellationDeadline}
            isCancellable={isCancellable}
            onCancel={onCancel}
            isAfterParticipation={isAfterParticipation}
          />
        )}
    </div>
  );
}
