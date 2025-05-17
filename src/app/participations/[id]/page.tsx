"use client";

import { useMemo } from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { useParticipationPage } from "@/app/participations/[id]/hooks/useParticipationPage";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { ParticipationStatusNotification } from "@/app/participations/[id]/components/ParticipationStatusNotification";
import { ParticipationHeader } from "@/app/participations/[id]/components/ParticipationHeader";
import { ParticipationDetails } from "@/app/participations/[id]/components/ParticipationDetails";
import ParticipationActions from "@/app/participations/[id]/components/ParticipationActions";
import { useCancelReservation } from "@/app/participations/[id]/hooks/useCancelReservation";
import { toast } from "sonner";

interface ParticipationProps {
  params: { id: string };
}

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
    startTime,
    endTime,
    participantCount,
    cancellationDeadline,
    loading,
    error,
    refetch,
  } = useParticipationPage(params.id);

  const isCancellable = new Date() < cancellationDeadline;
  const reservationId = participation?.node?.reservation?.id;
  const { handleCancel } = useCancelReservation();

  const onCancel = async () => {
    if (!reservationId) {
      toast.error("予約IDが見つかりません");
      return;
    }
    const result = await handleCancel(reservationId);
    if (result.success) {
      toast.success("キャンセルしました");
      refetch();
    } else {
      toast.error(`キャンセル失敗: ${result.error}`);
    }
  };

  if (loading) return <LoadingIndicator message="参加情報を読み込み中..." />;
  if (error || !opportunity || !participation) {
    return <ErrorState message="参加情報の読み込みに失敗しました。" />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-[120px]">
      {currentStatus && (
        <ParticipationStatusNotification
          status={
            currentStatus.status === "confirmed"
              ? "confirmed"
              : currentStatus.status === "cancelled"
                ? "cancelled"
                : "pending"
          }
          statusText={currentStatus.statusText}
          statusSubText={currentStatus.statusSubText}
          statusClass={currentStatus.statusClass}
        />
      )}

      <ParticipationHeader opportunity={opportunity} />

      <ParticipationDetails
        opportunity={opportunity}
        participation={participation}
        startTime={startTime}
        endTime={endTime}
        participantCount={participantCount}
      />

      <ParticipationActions
        cancellationDeadline={cancellationDeadline}
        isCancellable={isCancellable}
        onCancel={onCancel}
      />
    </div>
  );
}
