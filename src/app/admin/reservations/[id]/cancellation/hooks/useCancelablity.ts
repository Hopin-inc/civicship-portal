import { useMemo } from "react";
import dayjs from "dayjs";
import {
  GqlOpportunitySlotHostingStatus,
  GqlReservation,
  GqlReservationStatus,
} from "@/types/graphql";

export const useReservationStatus = (reservation: GqlReservation | null | undefined) => {
  return useMemo(() => {
    const slot = reservation?.opportunitySlot;

    const isSlotCancelled = () => slot?.hostingStatus === GqlOpportunitySlotHostingStatus.Cancelled;

    const isSlotCompleted = () => slot?.hostingStatus === GqlOpportunitySlotHostingStatus.Completed;

    const isSlotActive = () => !isSlotCancelled() && !isSlotCompleted();

    const isAccepted = () =>
      reservation?.status === GqlReservationStatus.Accepted && isSlotActive();

    const isApplied = () => reservation?.status === GqlReservationStatus.Applied && isSlotActive();

    const isWithin1Day = () => dayjs(slot?.startsAt).diff(dayjs(), "hour") < 24;

    const canCancelReservation = () => isAccepted() && !isWithin1Day();
    const cannotCancelReservation = () => isAccepted() && isWithin1Day();

    return {
      isSlotCancelled,
      isSlotCompleted,
      isSlotActive,
      isAccepted,
      isApplied,
      isWithin1Day,
      canCancelReservation,
      cannotCancelReservation,
    };
  }, [reservation]);
};
