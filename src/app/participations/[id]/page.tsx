"use client";

import { useEffect, useMemo, useRef } from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import useParticipationPage from "@/app/participations/[id]/hooks/useParticipationPage";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import ParticipationStatusNotification from "@/app/participations/[id]/components/ParticipationStatusNotification";
import ParticipationDetails from "@/app/participations/[id]/components/ParticipationDetails";
import ParticipationActions from "@/app/participations/[id]/components/ParticipationActions";
import { toast } from "sonner";
import { GqlReservationStatus } from "@/types/graphql";
import OpportunityCardHorizontal from "@/app/activities/components/Card/CardHorizontal";
import { useParams } from "next/navigation";
import { errorMessages } from "@/utils/errorMessage";
import useCancelReservation from "@/app/participations/[id]/hooks/useCancelReservation";

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
      title: "予約詳細",
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
    } else {
      const message = errorMessages[result.code] ?? "予期しないエラーが発生しました。";
      toast.error(message);
    }
  };

  if (loading) return <LoadingIndicator />;
  if (hasError || !reservationId || !opportunity || !participation) {
    return <ErrorState title="Could not load reservation page" refetchRef={refetchRef} />;
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
