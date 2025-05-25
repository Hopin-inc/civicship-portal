import dayjs from "dayjs";
import {
  GqlOpportunitySlotHostingStatus,
  GqlReservation,
  GqlReservationStatus,
} from "@/types/graphql";

const isSlotCancelled = (r: GqlReservation): boolean =>
  r.opportunitySlot?.hostingStatus === GqlOpportunitySlotHostingStatus.Cancelled;

const isSlotCompleted = (r: GqlReservation): boolean =>
  r.opportunitySlot?.hostingStatus === GqlOpportunitySlotHostingStatus.Completed;

const isSlotActive = (r: GqlReservation): boolean => !isSlotCancelled(r) && !isSlotCompleted(r);

const isAccepted = (r: GqlReservation): boolean =>
  r.status === GqlReservationStatus.Accepted && isSlotActive(r);

const isWithin1Day = (r: GqlReservation): boolean =>
  dayjs(r.opportunitySlot?.startsAt).diff(dayjs(), "hour") < 24;

const canCancelReservation = (r: GqlReservation): boolean => isAccepted(r) && !isWithin1Day(r);
const cannotCancelReservation = (r: GqlReservation): boolean => isAccepted(r) && isWithin1Day(r);

export { canCancelReservation, cannotCancelReservation };
