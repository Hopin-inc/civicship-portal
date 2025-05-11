import { GqlTransactionReason } from "@/types/graphql";

export type AppTransaction = {
  id: string;
  reason: GqlTransactionReason
  description: string;

  from: string;
  to: string;
  transferPoints: number;

  transferredAt: string;
}