import {
  GqlParticipationStatus,
  GqlParticipationStatusReason,
  GqlReservationStatus,
} from "@/types/graphql";

export type ParticipationStatus = GqlParticipationStatus;
export type ParticipationStatusReason = GqlParticipationStatusReason;

export type ReservationStatus = {
  status: GqlReservationStatus;
  statusText: string;
  statusSubText: string;
  statusClass: string;
};
