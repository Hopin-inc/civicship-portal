"use client";

import { useEffect, useMemo, useRef } from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { useParticipationPage } from "@/app/participations/[id]/hooks/useParticipationPage";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import ParticipationStatusNotification from "@/app/participations/[id]/components/ParticipationStatusNotification";
import ParticipationDetails from "@/app/participations/[id]/components/ParticipationDetails";
import ParticipationActions from "@/app/participations/[id]/components/ParticipationActions";
import { useCancelReservation } from "@/app/participations/[id]/hooks/useCancelReservation";
import { toast } from "sonner";
import { GqlReservationStatus } from "@/types/graphql";
import OpportunityCardHorizontal from "@/app/activities/components/Card/CardHorizontal";

interface ParticipationProps {
  params: { id: string };
}

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

export default function ParticipationPage({ params }: ParticipationProps) {
  const headerConfig = useMemo(
    () => ({
      title: "予約詳細",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const {
    participation,
    opportunity,
    currentStatus,
    cancellationDeadline,
    loading,
    error,
    refetch,
  } = useParticipationPage(params.id);

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
      toast.success("予約をキャンセルしました");
      refetch();
    } else {
      toast.error(`予約のキャンセルが失敗しました`);
    }
  };

  if (loading) return <LoadingIndicator />;
  if (error || !reservationId || !opportunity || !participation) {
    return <ErrorState title="予約ページを読み込めませんでした" refetchRef={refetchRef} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-[120px]">
      {currentStatus && (
        <ParticipationStatusNotification
          status={mapReservationStatusToUIStatus(currentStatus.status)}
          statusText={currentStatus.statusText}
          statusSubText={currentStatus.statusSubText}
          statusClass={currentStatus.statusClass}
        />
      )}

      <OpportunityCardHorizontal opportunity={opportunity} />

      <ParticipationDetails opportunity={opportunity} participation={participation} />

      <ParticipationActions
        cancellationDeadline={cancellationDeadline}
        isCancellable={isCancellable}
        onCancel={onCancel}
      />
    </div>
  );
}
