import {
  GqlOpportunitySlotHostingStatus,
  GqlParticipationStatus,
  GqlReservation,
  GqlReservationStatus,
} from "@/types/graphql";

const getReservationStatusMeta = (
  reservation: GqlReservation,
): {
  step: "approval" | "cancellation" | "attendance" | "done";
  label: string;
  variant: "primary" | "secondary" | "success" | "outline" | "destructive" | "warning";
} => {
  const status = reservation.status;
  const hostingStatus = reservation.opportunitySlot?.hostingStatus;
  const startsAt = reservation.opportunitySlot?.startsAt
    ? new Date(reservation.opportunitySlot.startsAt)
    : null;

  const isApplied = status === GqlReservationStatus.Applied;

  const isRejected = status === GqlReservationStatus.Rejected;
  const isCancelled = hostingStatus === GqlOpportunitySlotHostingStatus.Cancelled;

  const isAccepted = status === GqlReservationStatus.Accepted;
  const isScheduled = hostingStatus === GqlOpportunitySlotHostingStatus.Scheduled;
  const isFuture = startsAt ? startsAt > new Date() : false;

  const isEvaluated =
    reservation.participations
      ?.filter((p) => p.user !== null)
      .every((p) => p.status !== GqlParticipationStatus.Participating || !!p.evaluation) ?? false;

  // ① 申請中（未承認）
  if (isApplied) {
    return { step: "approval", label: "承認待ち", variant: "primary" };
  }

  // ② 開催中止
  else if (isCancelled) {
    return { step: "cancellation", label: "開催中止", variant: "warning" };
  }

  // ③ 却下済み
  else if (isRejected) {
    return { step: "approval", label: "却下済み", variant: "destructive" };
  }

  // ④ 開催前（承認済み・未来のスロット）
  else if (isAccepted && isScheduled && isFuture) {
    return { step: "cancellation", label: "承認済み", variant: "secondary" };
  }

  // ⑤ 開催済み・出欠記録が未入力
  else if (!isEvaluated && !isFuture) {
    return { step: "attendance", label: "出欠未入力", variant: "outline" };
  }

  // ⑥ 評価済（すべて対応済み）
  else {
    return { step: "attendance", label: "対応済み", variant: "success" };
  }
};

export default getReservationStatusMeta;
