import { CommunityId } from "@/types/index";
import { ActivityReservation } from "@/types/reservation";

export type ParticipationDetail = CommunityId & {
  id: string;
  status: string;
  reservation: ActivityReservation
}