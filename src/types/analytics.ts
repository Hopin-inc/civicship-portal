export type IEventName =
  | "apply_opportunity"
  | "cancel_application"
  | "accept_application"
  | "reject_application"
  | "cancel_slot"
  | "issue_point"
  | "donate_point"
  | "grant_point"
  | "finish_evaluation";

export interface IEventParamMap {
  apply_opportunity: ReservationEvent;
  cancel_application: ReservationEvent;
  accept_application: ReservationEvent;
  reject_application: ReservationEvent;
  cancel_slot: SlotEvent;
  issue_point: { amount: number };
  donate_point: PointEvent;
  grant_point: PointEvent;
  finish_evaluation: EvaluationEvent;
}

type ReservationEvent = {
  opportunityTitle: string;
  category: string;

  reservationId: string;
  opportunityId: string;

  guest: number;
  feeRequired: number;
  totalFee: number;
  scheduledAt: string;
};

type SlotEvent = {
  opportunityTitle: string;
  category: string;

  slotId: string;
  opportunityId: string;
};

type PointEvent = {
  fromUser?: UserInfo;
  toUser: UserInfo;
  amount: number;
};

type EvaluationEvent = {
  opportunityTitle: string;
  category: string;

  participationId: string;
  evaluator: UserInfo;
};

type UserInfo = {
  userId: string;
  name: string;
};
