import { GqlParticipationStatus, GqlParticipationStatusReason } from "@/types/graphql";

export type ParticipationStatus = GqlParticipationStatus;
export type ParticipationStatusReason = GqlParticipationStatusReason;

export type ReservationStatus = {
  status: string;
  statusText: string;
  statusSubText: string;
  statusClass: string;
};
