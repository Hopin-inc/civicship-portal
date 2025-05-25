import { GqlTransactionReason } from "@/types/graphql";

export type Wallet = {
  currentPoint: number;
};

export type UserAsset = {
  tickets: AvailableTicket[];
  points: AvailablePoint;
};

export type AvailableTicket = {
  id: string;
};

export type AvailablePoint = {
  walletId: string;
  currentPoint: number;
};

export type AppTransaction = {
  id: string;
  reason: GqlTransactionReason;
  description: string;

  source: string;

  from: string;
  to: string;
  transferPoints: number;

  transferredAt: string;
};
