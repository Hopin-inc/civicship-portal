import { GqlTransactionReason } from "@/types/graphql";

export type AppTransaction = {
  id: string;
  reason: GqlTransactionReason;
  description: string;
  comment: string;
  source: string;

  from: string;
  to: string;
  transferPoints: number;

  transferredAt: string;
  didValue: string | null;
  image?: string;
};
