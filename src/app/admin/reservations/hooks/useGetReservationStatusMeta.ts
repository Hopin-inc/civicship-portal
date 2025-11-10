import {
  GqlEvaluationStatus,
  GqlOpportunitySlotHostingStatus,
  GqlParticipationStatus,
  GqlReservation,
  GqlReservationStatus,
} from "@/types/graphql";

type StatusMeta = {
  step: "approval" | "cancellation" | "attendance" | "done";
  label: string;
  variant: "primary" | "secondary" | "success" | "outline" | "destructive" | "warning";
};

const getReservationStatusMeta = (reservation: GqlReservation): StatusMeta => {
  const status = reservation.status;
  const slot = reservation.opportunitySlot;
  const hostingStatus = slot?.hostingStatus ?? null;
  const startsAt = slot?.startsAt ? new Date(slot.startsAt) : null;
  const now = new Date();

  const isApplied = status === GqlReservationStatus.Applied;
  const isRejected = status === GqlReservationStatus.Rejected;
  const isReservationCancelled = status === GqlReservationStatus.Canceled;
  const isSlotCancelled = hostingStatus === GqlOpportunitySlotHostingStatus.Cancelled;
  const isAccepted = status === GqlReservationStatus.Accepted;
  const isScheduled = hostingStatus === GqlOpportunitySlotHostingStatus.Scheduled;
  const isCompleted = hostingStatus === GqlOpportunitySlotHostingStatus.Completed;
  const isFuture = startsAt ? startsAt.getTime() > now.getTime() : false;
  const isPast = startsAt ? startsAt.getTime() <= now.getTime() : false;

  const participated =
    reservation.participations?.filter(
      (p) => p.user !== null && p.status === GqlParticipationStatus.Participated,
    ) ?? [];

  const isFullyEvaluated =
    participated.length > 0 &&
    participated.every(
      (p) => p.evaluation?.status != null && p.evaluation.status !== GqlEvaluationStatus.Pending,
    );

  // --- 判定ロジック ---

  if (isApplied) {
    return { step: "approval", label: "承認待ち", variant: "primary" };
  }

  if (isRejected) {
    return { step: "approval", label: "却下済み", variant: "destructive" };
  }

  if (isReservationCancelled) {
    return { step: "cancellation", label: "キャンセル済み", variant: "outline" };
  }

  if (isSlotCancelled) {
    return { step: "cancellation", label: "開催中止", variant: "warning" };
  }

  if (isAccepted && isScheduled && isFuture) {
    return { step: "cancellation", label: "承認済み", variant: "secondary" };
  }

  if (isAccepted && isCompleted && isPast) {
    if (isFullyEvaluated) {
      return { step: "attendance", label: "対応済み", variant: "success" };
    } else {
      return { step: "attendance", label: "出欠未入力", variant: "outline" };
    }
  }

  // 予期しないパターンへのフォールバック（例：不正データ・未定義状態）
  return { step: "approval", label: "不明", variant: "destructive" };
};

export default getReservationStatusMeta;
